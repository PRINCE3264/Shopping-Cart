import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { identifier } = body;

        if (!identifier) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: identifier.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Rate limiting: Check if last OTP was sent recently
        if (user.otpExpires) {
            const now = new Date();
            const lastSent = new Date(user.otpExpires.getTime() - 10 * 60 * 1000); // Created 10 mins ago
            const diff = now.getTime() - lastSent.getTime();

            // If less than 60 seconds since last "generation"
            if (diff < 60 * 1000) {
                return NextResponse.json({ error: "Please wait 60 seconds before requesting another code" }, { status: 429 });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await prisma.user.update({
            where: { id: user.id },
            data: {
                otp,
                otpExpires: otpExpiry,
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
                to: user.email,
                subject: "Your New Verification Code",
                text: `Your new OTP is ${otp}. It expires in 10 minutes.`,
                html: `<b>Your new OTP is ${otp}</b>. It expires in 10 minutes.`,
            });
        } catch (emailErr) {
            console.error("Email sending failed:", emailErr);
            return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: any) {
        console.error("Resend OTP error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
