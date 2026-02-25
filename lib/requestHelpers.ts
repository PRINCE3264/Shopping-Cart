import prisma from "./prisma";
import { verifyAccessToken, TokenPayload } from "./auth";

/**
 * Minimal user shape returned by helpers.
 */
export interface IUserShape {
  _id: string;
  email?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

type HeaderSource = Headers | Record<string, string> | undefined;

export type RequestLike = { headers?: HeaderSource } | Request;

function getHeaderValue(headers: HeaderSource, key: string): string | null {
  if (!headers) return null;

  if (typeof (headers as Headers).get === "function") {
    const value = (headers as Headers).get(key);
    return typeof value === "string" ? value : null;
  }

  const obj = headers as Record<string, string>;
  const value = obj[key] ?? obj[key.toLowerCase()] ?? obj[key.toUpperCase()];
  return typeof value === "string" ? value : null;
}

function extractBearerToken(req: RequestLike): string | null {
  const headers = (req as { headers?: HeaderSource }).headers;
  const auth = getHeaderValue(headers, "authorization") ?? getHeaderValue(headers, "Authorization");
  if (!auth) return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.split(" ")[1] ?? null;
}

/**
 * Get authenticated user from request using Prisma.
 * Returns a plain object (IUserShape) or null.
 */
export async function getUserFromRequest(req: RequestLike): Promise<IUserShape | null> {
  try {
    const token = extractBearerToken(req);
    if (!token) return null;

    const payload = verifyAccessToken(token) as TokenPayload | null;
    if (!payload || typeof payload.sub !== "string") return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user) return null;

    // Map Prisma object to the Shape expected by existing code
    return {
      ...user,
      _id: user.id, // compatibility with existing code that uses ._id
    } as unknown as IUserShape;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("getUserFromRequest error:", err.message);
    }
    return null;
  }
}

export function extractRefreshTokenFromCookie(req: RequestLike): string | null {
  try {
    const headers = (req as { headers?: HeaderSource }).headers;
    const cookieHeader = getHeaderValue(headers, "cookie");
    if (!cookieHeader) return null;

    const match = cookieHeader
      .split(";")
      .map(s => s.trim())
      .find(c => c.startsWith("refreshToken="));
    if (!match) return null;
    return match.split("=")[1] ?? null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("extractRefreshTokenFromCookie error:", err.message);
    }
    return null;
  }
}
