import { prisma } from "@/app/lib/prisma";
import { successResponse } from "@/app/lib/api-response";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withErrorHandler(async (request: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  // Uczestnik może być user ALBO team
  const participants = await prisma.tournamentParticipant.findMany({
    where: { tournamentId },
    include: { user: true, team: true },
  });

  // Zwróć listę obiektów z id i name (dla team użyj name teamu)
  const result = participants.map((p) => {
    if (p.team) {
      return { id: p.team.id, name: p.team.name };
    }
    const uname = p.user?.username ?? "Anonim";
    return { id: p.user?.id ?? "", name: uname };
  });

  return successResponse(result);
});