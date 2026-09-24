import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { successResponse, notFoundResponse } from '@/app/lib/api-response';
import { withErrorHandler } from '@/app/lib/error-handler';

interface Params {
  params: Promise<{ id: string }>;
}

export const GET = withErrorHandler(async (
  request: NextRequest,
  context: Params
) => {
  const { params } = context;
  const { id: teamId } = await params;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      owner: {
        select: { username: true, name: true }
      },
      members: {
        include: {
          user: {
            select: { username: true, name: true, email: true }
          }
        },
        orderBy: [
          { teamRole: 'desc' },
          { joinedAt: 'asc' }
        ]
      },
      joinRequests: {
        where: { status: 'PENDING' },
        include: {
          user: {
            select: { username: true, name: true }
          }
        }
      }
    }
  });

  if (!team) {
    return notFoundResponse('Drużyna nie znaleziona');
  }

  return successResponse(team);
});