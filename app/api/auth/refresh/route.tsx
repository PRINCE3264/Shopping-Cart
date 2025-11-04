// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.split(";").map(s => s.trim()).find(s => s.startsWith("refreshToken="));
  if (!m) return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  const token = m.split("=")[1];
  const payload = verifyRefreshToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });

  const user = await User.findById(payload.sub);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email });
  return NextResponse.json({ accessToken });
}
