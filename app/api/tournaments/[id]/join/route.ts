
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";
import { successResponse, badRequestResponse, notFoundResponse, conflictResponse } from "@/app/lib/api-response";
import { validateString } from "@/app/lib/validation";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
   params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (request: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  if (!tournamentId) {
    return badRequestResponse("Niepoprawne ID turnieju");
  }

  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return badRequestResponse("Brak ID użytkownika");
  }

  // Pobierz turniej i waliduj typ
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { format: true, participantLimit: true, tournamentType: true },
  });

  if (!tournament) {
    return notFoundResponse("Turniej nie istnieje");
  }

  if (tournament.tournamentType === "TEAM_ONLY") {
    return badRequestResponse("Ten turniej przyjmuje tylko zespoły");
  }

  // Sprawdź, czy użytkownik już jest zapisany
  const existing = await prisma.tournamentParticipant.findFirst({
    where: { tournamentId, userId },
  });

  if (existing) {
    return conflictResponse("Jesteś już zapisany na ten turniej");
  }

  const currentCount = await prisma.tournamentParticipant.count({
    where: { tournamentId },
  });

  if (currentCount >= tournament.participantLimit) {
    return badRequestResponse("Turniej jest pełny");
  }

  // Dodaj użytkownika do turnieju
  await prisma.tournamentParticipant.create({
    data: {
      tournamentId,
      userId,
    },
  });

  // Jeśli po dodaniu osiągnięto komplet uczestników -> generuj drabinkę uczestników (użytkownicy i zespoły)
  if (currentCount + 1 === tournament.participantLimit) {
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      select: { userId: true, teamId: true },
    });
    const entries = participants.map((p) => ({
      userId: p.userId ?? null,
      teamId: p.teamId ?? null,
    }));
    await createParticipantBracketInDb(tournamentId, entries, tournament.format);
  }

  return successResponse(null, "Dołączono do turnieju.");
});
