// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import nodemailer from "nodemailer";

function generateOTP(length = 6): string {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

interface RegisterBody {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

/** Handle CORS preflight so browsers can POST with JSON headers */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // change to your front-end origin in production
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/** Optional GET for quick browser test */
export async function GET() {
  return NextResponse.json({ ok: true, message: "Register endpoint (POST only)." });
}

/** POST handler: create user, save OTP, send email */
export async function POST(req: Request) {
  try {
    // OPTIONAL: allow CORS from dev origin (if you call from different origin)
    // Note: Next App Router runs server-side; browser preflight handled by OPTIONS above.
    const body = (await req.json().catch(() => ({}))) as RegisterBody;

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password || !name) {
      return NextResponse.json({ error: "name, email and password required" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return NextResponse.json({ error: "User exists" }, { status: 409 });

    const passwordHash = await hashPassword(password);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      phone: phone || undefined,
      passwordHash,
      otp,
      otpExpires: otpExpiry,
      isVerified: false,
    });

    // send email (will throw if smtp misconfigured)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account - OTP",
      text: `Hello ${name}, your OTP is ${otp}. It expires in 5 minutes.`,
    });

    return NextResponse.json(
      { success: true, message: "Registered. OTP sent.", userId: newUser._id.toString() },
      { status: 201 }
    );
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
