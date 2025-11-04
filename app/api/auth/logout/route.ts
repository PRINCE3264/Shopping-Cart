// // app/api/auth/logout/route.ts
// import { NextResponse } from "next/server";
// import { serialize } from "cookie";

// export async function POST() {
//   const cookie = serialize("refreshToken", "", { httpOnly: true, path: "/", maxAge: 0 });
//   return new NextResponse(null, { status: 200, headers: { "Set-Cookie": cookie }});
// }


// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Clear the HttpOnly refresh token cookie by setting it with maxAge 0
  const cookie = serialize("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return new NextResponse(null, {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
