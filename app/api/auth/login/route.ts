// // app/api/auth/login/route.ts
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { comparePassword, signAccessToken, signRefreshToken } from "@/lib/auth";
// import { serialize } from "cookie";

// export async function POST(req: Request) {
//   await connectDB();
//   const { email, password } = await req.json();
//   if (!email || !password) return NextResponse.json({ error: "missing" }, { status: 400 });

//   const user = await User.findOne({ email });
//   if (!user || !user.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//   const ok = await comparePassword(password, user.passwordHash);
//   if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//   const payload = { sub: user._id.toString(), email: user.email };
//   const accessToken = signAccessToken(payload);
//   const refreshToken = signRefreshToken(payload);

//   const cookie = serialize("refreshToken", refreshToken, {
//     httpOnly: true, path: "/", sameSite: "lax",
//     maxAge: 60 * 60 * 24 * 7, secure: process.env.NODE_ENV === "production"
//   });

//   return new NextResponse(JSON.stringify({ accessToken, user: { id: user._id, email: user.email } }), {
//     status: 200,
//     headers: { "Set-Cookie": cookie, "Content-Type":"application/json" },
//   });
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { serialize } from "cookie";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json().catch(() => ({}))) as Partial<LoginBody>;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your account before login" }, { status: 403 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: "Invalid account: no password set" }, { status: 400 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Generate tokens
    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // ✅ Set refresh token in HttpOnly cookie
    const cookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ Send response
    const responseBody = {
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        isVerified: user.isVerified,
      },
    };

    return new NextResponse(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
