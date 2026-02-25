import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || undefined }
        ]
      }
    });

    if (existing) {
      return NextResponse.json({ error: "User with this email or phone already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        otp,
        otpExpires: otpExpiry,
        isVerified: false,
      }
    });

    // Send OTP via Email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Shopping Cart" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification Code",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
        html: `<b>Your OTP is ${otp}</b>. It expires in 10 minutes.`,
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // We still return 201 because the user was created. 
      // In a real app, you might want to handle this differently.
    }

    return NextResponse.json({
      message: "Registration successful. Please verify your email.",
      userId: newUser.id
    }, { status: 201 });

  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({
      error: "Internal server error",
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}
