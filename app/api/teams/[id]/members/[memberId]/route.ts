import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';
import { successResponse, unauthorizedResponse, badRequestResponse, notFoundResponse, forbiddenResponse } from '@/app/lib/api-response';
import { withErrorHandler } from '@/app/lib/error-handler';

interface Params {
  params: Promise<{ id: string; memberId: string }>;
}

// PATCH /api/teams/[id]/members/[memberId] - zmiana roli (tylko OWNER)
export const PATCH = withErrorHandler(async (
  request: NextRequest,
  context: Params
) => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return unauthorizedResponse();
  }

  const { params } = context;
  const { id: teamId, memberId } = await params;

  const body = await request.json();
  const { teamRole } = body as { teamRole?: 'OWNER' | 'CAPTAIN' | 'MEMBER' };

  if (!teamRole || !['CAPTAIN', 'MEMBER'].includes(teamRole)) {
    return badRequestResponse('Nieprawidłowa rola. Dozwolone: CAPTAIN, MEMBER');
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { ownerId: true }
  });

  if (!team) {
    return notFoundResponse('Drużyna nie znaleziona');
  }

  if (team.ownerId !== user.id) {
    return forbiddenResponse('Brak uprawnień (właściciel tylko)');
  }

  const membership = await prisma.teamMember.findUnique({
    where: { id: memberId }
  });

  if (!membership || membership.teamId !== teamId) {
    return notFoundResponse('Członek nie znaleziony w tej drużynie');
  }

  if (membership.teamRole === 'OWNER') {
    return badRequestResponse('Nie można zmieniać roli właściciela');
  }

  const updated = await prisma.teamMember.update({
    where: { id: membership.id },
    data: { teamRole }
  });

  return successResponse(updated, 'Role updated successfully');
});

// DELETE /api/teams/[id]/members/[memberId] - usunięcie członka (tylko OWNER)
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context: Params
) => {
  const user = await getCurrentUser();
  if (!user?.id) {
    return unauthorizedResponse();
  }

  const { params } = context;
  const { id: teamId, memberId } = await params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { ownerId: true }
  });

  if (!team) {
    return notFoundResponse('Drużyna nie znaleziona');
  }

  if (team.ownerId !== user.id) {
    return forbiddenResponse('Brak uprawnień (właściciel tylko)');
  }

  const membership = await prisma.teamMember.findUnique({
    where: { id: memberId }
  });

  if (!membership || membership.teamId !== teamId) {
    return notFoundResponse('Członek nie znaleziony w tej drużynie');
  }

  if (membership.teamRole === 'OWNER') {
    return badRequestResponse('Nie można usunąć właściciela');
  }

  if (membership.userId === user.id) {
    return badRequestResponse('Właściciel nie może usunąć samego siebie');
  }

  await prisma.teamMember.delete({ where: { id: membership.id } });
  return successResponse(null, 'Member removed successfully');
});
