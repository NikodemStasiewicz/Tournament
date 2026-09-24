import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { successResponse, unauthorizedResponse, notFoundResponse, forbiddenResponse } from "@/app/lib/api-response";
import { withErrorHandler } from "@/app/lib/error-handler";

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withErrorHandler(async (req: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return notFoundResponse("Tournament not found");
  }

  return successResponse(tournament);
});

export const PUT = withErrorHandler(async (req: Request, context: Params) => {
  const { params } = context;
  const { id: tournamentId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return unauthorizedResponse();
  }

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return notFoundResponse("Tournament not found");
  }

  if (tournament.ownerId !== user.id) {
    return forbiddenResponse();
  }

  const body = await req.json();
  const updatedTournament = await prisma.tournament.update({
    where: { id: tournamentId },
    data: {
      name: body.name,
      startDate: body.startDate,
      endDate: body.endDate,
      participantLimit: body.participantLimit,
      format: body.format,
    },
  });

  return successResponse(updatedTournament, "Tournament updated successfully");
});