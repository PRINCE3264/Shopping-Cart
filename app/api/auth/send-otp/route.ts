// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OTP from "@/models/OTP";
import { hashOtp } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  await connectDB();
  const { identifier, purpose = "verify" } = await req.json();
  if (!identifier) return NextResponse.json({ error: "identifier required" }, { status: 400 });

  // simple resend rule: don't allow if last OTP created < 60s ago
  const last = await OTP.findOne({ identifier, purpose }).sort({ createdAt: -1 });
  if (last && (Date.now() - last.createdAt.getTime()) < 60 * 1000) {
    return NextResponse.json({ error: "Please wait before requesting another code" }, { status: 429 });
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const hashed = await hashOtp(otp);
  const ttl = Number(process.env.OTP_TTL_MINUTES || 5);
  const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

  await OTP.create({ identifier, hashedOtp: hashed, purpose, expiresAt, attempts: 0, used: false });
  await sendOtpEmail(identifier, otp);

  return NextResponse.json({ ok: true });
}
