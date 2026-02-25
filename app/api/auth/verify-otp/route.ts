import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, otp } = body;

    if (!identifier || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: identifier.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "User already verified" }, { status: 400 });
    }

    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ error: "No OTP found. Request a new code." }, { status: 400 });
    }

    const now = new Date();
    if (user.otpExpires < now) {
      return NextResponse.json({ error: "OTP expired. Please request a new code." }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // Mark verified and clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      }
    });

    // Issue tokens
    const payload = { sub: updatedUser.id, email: updatedUser.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Set cookie
    const cookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new NextResponse(JSON.stringify({
      accessToken,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isVerified: updatedUser.isVerified
      },
    }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json"
      },
    });
  } catch (err: any) {
    console.error("verify-otp error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
