import { prisma } from "@/app/lib/prisma";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";
import { successResponse, notFoundResponse, badRequestResponse } from "@/app/lib/api-response";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (request: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  // Pobierz turniej
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return notFoundResponse("Turniej nie istnieje.");
  }

  // Pobierz uczestników (user lub team)
  const participants = await prisma.tournamentParticipant.findMany({
    where: { tournamentId },
    select: { userId: true, teamId: true },
  });

  if (participants.length < 2) {
    return badRequestResponse("Za mało uczestników.");
  }

  // Zbuduj listę entries dla generatora (userId lub teamId)
  const entries = participants.map((p) => ({
    userId: p.userId ?? null,
    teamId: p.teamId ?? null,
  }));

  await createParticipantBracketInDb(tournamentId, entries, tournament.format);

  return successResponse(null, "Drabinka wygenerowana");
});
