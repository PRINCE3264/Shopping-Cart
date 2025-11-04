// // lib/auth.ts
// import * as jwt from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// /**
//  * Validate env at load-time so TS knows these are defined (not undefined)
//  */
// const ACCESS_SECRET_RAW = process.env.JWT_ACCESS_SECRET;
// const REFRESH_SECRET_RAW = process.env.JWT_REFRESH_SECRET;

// if (!ACCESS_SECRET_RAW || !REFRESH_SECRET_RAW) {
//   throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment");
// }

// /**
//  * Explicitly type secrets as jwt.Secret
//  */
// const ACCESS_SECRET: jwt.Secret = ACCESS_SECRET_RAW;
// const REFRESH_SECRET: jwt.Secret = REFRESH_SECRET_RAW;

// const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES ?? "15m";
// const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES ?? "7d";

// /**
//  * Token payload shape — tighten this to your needs
//  */
// export interface TokenPayload extends JwtPayload {
//   sub: string;     // user id
//   email?: string;
//   // add other claims here
// }

// /**
//  * Sign helpers
//  *
//  * We cast payload to the union type that jwt.sign accepts:
//  *   string | object | Buffer
//  *
//  * and the options are typed as jwt.SignOptions
//  */
// export function signAccessToken(payload: TokenPayload): string {
//   const options: jwt.SignOptions = { expiresIn: ACCESS_EXPIRES };
//   return jwt.sign(payload as string | object | Buffer, ACCESS_SECRET, options);
// }

// export function signRefreshToken(payload: TokenPayload): string {
//   const options: jwt.SignOptions = { expiresIn: REFRESH_EXPIRES };
//   return jwt.sign(payload as string | object | Buffer, REFRESH_SECRET, options);
// }

// /**
//  * Verify helpers -> return TokenPayload or null
//  */
// export function verifyAccessToken(token: string): TokenPayload | null {
//   try {
//     const decoded = jwt.verify(token, ACCESS_SECRET);
//     if (typeof decoded === "string") return null;
//     return decoded as TokenPayload;
//   } catch {
//     return null;
//   }
// }

// export function verifyRefreshToken(token: string): TokenPayload | null {
//   try {
//     const decoded = jwt.verify(token, REFRESH_SECRET);
//     if (typeof decoded === "string") return null;
//     return decoded as TokenPayload;
//   } catch {
//     return null;
//   }
// }

// /**
//  * Password / OTP helpers (bcrypt)
//  */
// export async function hashPassword(pw: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(pw, salt);
// }
// export async function comparePassword(pw: string, hash: string): Promise<boolean> {
//   return bcrypt.compare(pw, hash);
// }

// export async function hashOtp(otp: string): Promise<string> {
//   const salt = await bcrypt.genSalt(6);
//   return bcrypt.hash(otp, salt);
// }
// export async function compareOtp(otp: string, hash: string): Promise<boolean> {
//   return bcrypt.compare(otp, hash);
// }
// lib/auth.ts
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Validate env at load-time so TS knows these are defined (not undefined).
 */
const ACCESS_SECRET_RAW = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET_RAW = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET_RAW || !REFRESH_SECRET_RAW) {
  throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment");
}

/**
 * Explicitly type secrets as jwt.Secret
 */
const ACCESS_SECRET: jwt.Secret = ACCESS_SECRET_RAW;
const REFRESH_SECRET: jwt.Secret = REFRESH_SECRET_RAW;

/**
 * Make expires values typed as jwt.SignOptions['expiresIn'].
 * Use a cast because process.env returns string; runtime accepts strings like "15m".
 */
const ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES ?? "15m") as jwt.SignOptions['expiresIn'];
const REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRES ?? "7d") as jwt.SignOptions['expiresIn'];

/**
 * Token payload shape — tighten this to your needs
 */
export interface TokenPayload extends JwtPayload {
  sub: string;     // user id
  email?: string;
  // add other claims here
}

/**
 * Sign helpers
 */
export function signAccessToken(payload: TokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: ACCESS_EXPIRES };
  return jwt.sign(payload as string | object | Buffer, ACCESS_SECRET, options);
}

export function signRefreshToken(payload: TokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: REFRESH_EXPIRES };
  return jwt.sign(payload as string | object | Buffer, REFRESH_SECRET, options);
}

/**
 * Verify helpers -> return TokenPayload or null
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Password / OTP helpers (bcrypt)
 */
export async function hashPassword(pw: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pw, salt);
}
export async function comparePassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

export async function hashOtp(otp: string): Promise<string> {
  const salt = await bcrypt.genSalt(6);
  return bcrypt.hash(otp, salt);
}
export async function compareOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}
