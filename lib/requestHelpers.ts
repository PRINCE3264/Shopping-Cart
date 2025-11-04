// lib/requestHelpers.ts
import { connectDB } from "./db";
import { verifyAccessToken, TokenPayload } from "./auth";
import UserModel from "../models/User";

/**
 * Minimal user shape returned by helpers.
 */
export interface IUserShape {
  _id: string;
  email?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

/**
 * A small union type representing the header shapes we may encounter:
 * - the Web Headers API (Headers)
 * - a plain object map of header names to values
 */
type HeaderSource = Headers | Record<string, string> | undefined;

/**
 * Request-like object accepted by helpers.
 * Next.js route handlers provide the global Request; server utilities may also pass
 * an object with a `headers` property.
 */
export type RequestLike = { headers?: HeaderSource } | Request;

/**
 * Safe helper to get header value from either Headers or plain object.
 */
function getHeaderValue(headers: HeaderSource, key: string): string | null {
  if (!headers) return null;

  // If it's a Headers instance
  if (typeof (headers as Headers).get === "function") {
    const value = (headers as Headers).get(key);
    return typeof value === "string" ? value : null;
  }

  // Otherwise it's a plain object map
  const obj = headers as Record<string, string>;
  const value = obj[key] ?? obj[key.toLowerCase()] ?? obj[key.toUpperCase()];
  return typeof value === "string" ? value : null;
}

/**
 * Extract bearer token from the Request-like object's headers.
 */
function extractBearerToken(req: RequestLike): string | null {
  const headers = (req as { headers?: HeaderSource }).headers;
  const auth = getHeaderValue(headers, "authorization") ?? getHeaderValue(headers, "Authorization");
  if (!auth) return null;
  if (!auth.startsWith("Bearer ")) return null;
  return auth.split(" ")[1] ?? null;
}

/**
 * Get authenticated user from request.
 * Returns a plain object (IUserShape) or null.
 */
export async function getUserFromRequest(req: RequestLike): Promise<IUserShape | null> {
  try {
    await connectDB();

    const token = extractBearerToken(req);
    if (!token) return null;

    const payload = verifyAccessToken(token) as TokenPayload | null;
    if (!payload || typeof payload.sub !== "string") return null;

    // Use .lean() to get a plain JS object instead of a Mongoose Document
    const user = await UserModel.findById(payload.sub).lean<IUserShape | null>();
    return user ?? null;
  } catch (err: unknown) {
    // Log error safely without using `any`
    if (err instanceof Error) {
      
      console.error("getUserFromRequest error:", err.message);
    } else {
     
      console.error("getUserFromRequest unknown error:", String(err));
    }
    return null;
  }
}

/**
 * Extract refresh token value from cookie header (if present).
 */
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
    } else {
      
      console.error("extractRefreshTokenFromCookie unknown error:", String(err));
    }
    return null;
  }
}
