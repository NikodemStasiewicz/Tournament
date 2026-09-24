import { prisma } from "@/app/lib/prisma";
import { createBracketInDb } from "@/app/lib/createBracketInDb";
import { successResponse, notFoundResponse, badRequestResponse } from "@/app/lib/api-response";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (req: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return notFoundResponse("Turniej nie istnieje.");
  }

  const participants = await prisma.tournamentParticipant.findMany({
    where: { tournamentId },
  });

  const userIds = participants.map(p => p.userId).filter(Boolean) as string[];

  if (userIds.length < 2) {
    return badRequestResponse("Za mało uczestników.");
  }

  await createBracketInDb(tournamentId, userIds, tournament.format);

  return successResponse({ success: true }, "Players assigned to matches successfully");
});
