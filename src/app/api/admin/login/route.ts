import { NextResponse } from "next/server";
import { validateAdminEnv } from "@/lib/admin/env";
import {
  verifyPassword,
  createSessionCookie,
  getCookieName,
  generateCsrfToken,
  DUMMY_SCRYPT_HASH,
  checkSameOrigin,
} from "@/lib/admin/auth";
import {
  checkLoginThrottled,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/admin/throttle";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const envCheck = validateAdminEnv();

  // If disabled via flag, return 404 instant kill-switch
  if (!envCheck.valid && envCheck.error?.startsWith("ADMIN_COMPOSE_DISABLED")) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  // If configuration is missing or broken, fail closed with 503
  if (!envCheck.valid || !envCheck.config) {
    console.error("[ADMIN AUTH CONFIG ERROR]", envCheck.error);
    return NextResponse.json(
      { error: "Administrative services are temporarily unavailable." },
      { status: 503 }
    );
  }

  const config = envCheck.config;

  // CSRF / Same-origin check
  if (!checkSameOrigin(request)) {
    return NextResponse.json(
      { error: "Cross-origin request rejected." },
      { status: 403 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const rawEmail = (body.email || "").trim().toLowerCase();
  const rawPassword = body.password || "";

  // Throttling check
  const throttleCheck = checkLoginThrottled(request, rawEmail);
  if (throttleCheck.isThrottled) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please wait ${throttleCheck.waitSeconds} seconds before trying again.`,
      },
      { status: 429 }
    );
  }

  // Find user in allowed users list
  const user = config.users.find((u) => u.email === rawEmail);

  let passwordValid = false;
  if (user) {
    passwordValid = await verifyPassword(rawPassword, user.passwordHash);
  } else {
    // Run dummy scrypt hash comparison to equalize execution timing
    await verifyPassword(rawPassword, DUMMY_SCRYPT_HASH);
  }

  if (!user || !passwordValid) {
    recordLoginFailure(request, rawEmail);
    // Constant artificial delay (~300ms) to impede automated brute force
    await new Promise((r) => setTimeout(r, 300));
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  // Login successful
  clearLoginFailures(request, rawEmail);

  const now = Date.now();
  const session = {
    email: user.email,
    name: user.name,
    title: user.title,
    issuedAt: now,
    expiresAt: now + 2 * 60 * 60 * 1000, // 2-hour idle timeout
    sessionVersion: config.sessionVersion,
  };

  const cookieVal = createSessionCookie(session, config);
  const cookieName = getCookieName();
  const csrfToken = generateCsrfToken(session, config);

  const response = NextResponse.json({
    success: true,
    user: {
      email: user.email,
      name: user.name || "",
      title: user.title || "",
    },
    csrfToken,
  });

  const isProd = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: cookieName,
    value: cookieVal,
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 2 * 60 * 60, // 2 hours
  });

  return response;
}

