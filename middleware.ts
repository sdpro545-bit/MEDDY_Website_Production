/**
 * MEDDY GLOBAL SOLUTIONS LTD — Route Middleware
 *
 * Convenience redirect for admin access (Edge runtime, Web Crypto only).
 * NOTE: Server-side API handlers and pages independently verify session integrity.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login route and login API route freely
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Host-meddy_admin"
      : "meddy_admin_dev";

  const sessionCookie = request.cookies.get(cookieName)?.value;

  // If no session cookie on UI route, redirect to login page
  if (!sessionCookie) {
    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

