import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";
import { successResponse, unauthorizedResponse, badRequestResponse, notFoundResponse, forbiddenResponse } from "@/app/lib/api-response";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/tournaments/[id]/join-team
// Body: { teamId: string }
export const POST = withErrorHandler(async (request: NextRequest, context: Params) => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return unauthorizedResponse();
  }

  const { params } = context;
  const { id: tournamentId } = await params;
    const body = await request.json();
    const teamId = String(body?.teamId || "");

  if (!tournamentId || !teamId) {
    return badRequestResponse("Brak danych: tournamentId/teamId");
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: {
      id: true,
      participantLimit: true,
      tournamentType: true,
      teamSize: true,
      minTeamSize: true,
      maxTeamSize: true,
      format: true,
    },
  });

  if (!tournament) {
    return notFoundResponse("Turniej nie istnieje");
  }

  const type = tournament.tournamentType || "MIXED";
  if (type === "SOLO_ONLY") {
    return badRequestResponse("Ten turniej przyjmuje tylko graczy solo");
  }

    // Sprawdź czy user ma uprawnienia w teamie (OWNER/CAPTAIN)
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
      select: { teamRole: true },
    });

  if (!membership || !["OWNER", "CAPTAIN"].includes(membership.teamRole as any)) {
    return forbiddenResponse("Brak uprawnień do reprezentowania tego zespołu");
  }

  // Sprawdź rozmiar zespołu vs wymagania turnieju
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { _count: { select: { members: true } } },
  });
  if (!team) {
    return notFoundResponse("Zespół nie istnieje");
  }

  const size = team._count.members;
  if (typeof tournament.teamSize === "number") {
    if (size !== tournament.teamSize) {
      return badRequestResponse(`Wymagany rozmiar zespołu: ${tournament.teamSize}`);
    }
  } else {
    if (typeof tournament.minTeamSize === "number" && size < tournament.minTeamSize) {
      return badRequestResponse(`Minimalny rozmiar zespołu: ${tournament.minTeamSize}`);
    }
    if (typeof tournament.maxTeamSize === "number" && size > tournament.maxTeamSize) {
      return badRequestResponse(`Maksymalny rozmiar zespołu: ${tournament.maxTeamSize}`);
    }
  }

  // Sprawdź, czy zespół nie jest już zapisany
  const existing = await prisma.tournamentParticipant.findFirst({
    where: { tournamentId, teamId },
  });
  if (existing) {
    return badRequestResponse("Ten zespół jest już zapisany na turniej");
  }

  // Sprawdź dostępność miejsc
  const currentCount = await prisma.tournamentParticipant.count({ where: { tournamentId } });
  if (currentCount >= tournament.participantLimit) {
    return badRequestResponse("Turniej jest pełny");
  }

    // Dodaj zespół jako uczestnika
    await prisma.tournamentParticipant.create({
      data: { tournamentId, teamId },
    });

    // Auto-generowanie drabinki po osiągnięciu limitu
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

  return successResponse(null, "Zespół dołączył do turnieju.");
});
