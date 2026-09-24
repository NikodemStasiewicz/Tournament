import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";
import { JWT_SECRET } from "@/app/lib/env";

export async function GET() {
  const cookieStore = await cookies(); // ⬅️ poprawka
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & { id: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    return Response.json({ user });
  } catch (err) {
    console.error("JWT verification failed in /api/auth/me:", err);
    return Response.json({ user: null });
  }
}
