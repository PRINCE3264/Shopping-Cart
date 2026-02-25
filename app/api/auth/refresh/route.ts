import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const cookie = req.headers.get("cookie") || "";
        const m = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("refreshToken="));
        if (!m) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

        const token = m.split("=")[1];
        const payload = verifyRefreshToken(token);
        if (!payload) return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: payload.sub }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const accessToken = signAccessToken({ sub: user.id, email: user.email });
        return NextResponse.json({ accessToken });
    } catch (err) {
        console.error("Refresh token error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
