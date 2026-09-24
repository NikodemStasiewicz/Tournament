import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';
import { successResponse, unauthorizedResponse, notFoundResponse, badRequestResponse, conflictResponse } from '@/app/lib/api-response';
import { withErrorHandler } from '@/app/lib/error-handler';

interface Params {
  params: Promise<{ id: string }>;
}

export const POST = withErrorHandler(async (
  request: NextRequest,
  context: Params
) => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return unauthorizedResponse();
  }

  const { params } = context;
  const { id: teamId } = await params;
  const body = await request.json();
  const { message } = body;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true
    }
  });

  if (!team) {
    return notFoundResponse('Drużyna nie znaleziona');
  }

  // Sprawdź czy user już jest członkiem
  const isMember = team.members.some(member => member.userId === user.id);
  if (isMember) {
    return conflictResponse('Jesteś już członkiem tej drużyny');
  }

  // Sprawdź limit członków
  if (team.members.length >= team.maxMembers) {
    return badRequestResponse('Drużyna jest pełna');
  }

  if (team.requireApproval) {
    // Sprawdź, czy istnieje już oczekująca (lub jakakolwiek) prośba dla (teamId, userId)
    const existingRequest = await prisma.teamJoinRequest.findFirst({
      where: { teamId, userId: user.id, status: 'PENDING' }
    });
    if (existingRequest) {
      return conflictResponse('Prośba o dołączenie już istnieje i oczekuje na akceptację');
    }

    try {
      const joinRequest = await prisma.teamJoinRequest.create({
        data: {
          teamId,
          userId: user.id,
          message,
          status: 'PENDING'
        }
      });

      return successResponse({ request: joinRequest }, 'Prośba wysłana, czekaj na akceptację');
    } catch (e: any) {
      if (e?.code === 'P2002') {
        // Unique constraint (teamId, userId)
        return conflictResponse('Prośba o dołączenie już istnieje');
      }
      throw e;
    }
  } else {
    // Automatyczne dołączenie
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id
      }
    });

    return successResponse({ member: teamMember }, 'Dołączyłeś do drużyny!');
  }
});
