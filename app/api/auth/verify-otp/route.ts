
// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { serialize } from "cookie";

interface VerifyBody {
  identifier: string; // email (or phone) used when sending OTP
  otp: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json().catch(() => ({}))) as Partial<VerifyBody>;
    const identifier = typeof body.identifier === "string" ? body.identifier.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";

    if (!identifier || !otp) {
      return NextResponse.json({ error: "identifier and otp are required" }, { status: 400 });
    }

    // find user by email (adjust if you use phone instead)
    const user = await User.findOne({ email: identifier });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 });
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ error: "No OTP found for this user. Request a new code." }, { status: 400 });
    }

    const now = new Date();
    if (user.otpExpires < now) {
      return NextResponse.json({ error: "OTP expired. Please request a new code." }, { status: 400 });
    }

    // Compare OTPs (we saved OTP as plain in register route). If you hashed OTP, use compare helper.
    if (user.otp !== otp) {
      // optional: increment attempt counter or add rate-limit logic here
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // mark user verified and clear OTP fields
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // issue tokens
    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // set refresh token as HttpOnly cookie
    const cookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const responseBody = {
      accessToken,
      user: { id: user._id.toString(), email: user.email, isVerified: user.isVerified },
    };

    return new NextResponse(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });
  } catch (err) {
    // safe logging
    if (err instanceof Error) console.error("verify-otp error:", err.message);
    else console.error("verify-otp unknown error:", String(err));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
