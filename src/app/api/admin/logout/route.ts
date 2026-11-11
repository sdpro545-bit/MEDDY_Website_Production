import { NextResponse } from "next/server";
import { getCookieName } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  const cookieName = getCookieName();
  const response = NextResponse.json({ success: true, message: "Logged out." });

  response.cookies.set({
    name: cookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}

