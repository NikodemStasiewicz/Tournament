import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";

interface UserPayload {
  id: string;
  email: string;
}

interface JwtPayload extends UserPayload {
  iat?: number;
  exp?: number;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Validate payload structure
    if (
      typeof decoded === "object" &&
      typeof decoded.id === "string" &&
      typeof decoded.email === "string"
    ) {
      return {
        id: decoded.id,
        email: decoded.email
      };
    }

    return null;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

