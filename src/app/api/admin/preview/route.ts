import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminEnv } from "@/lib/admin/env";
import {
  verifySessionCookie,
  verifyCsrfToken,
  getCookieName,
  checkSameOrigin,
} from "@/lib/admin/auth";
import { renderOwnerMessage } from "@/lib/email/compose";
import { lintEmail } from "@/lib/email/lint";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const envCheck = validateAdminEnv();
  if (!envCheck.valid && envCheck.error?.startsWith("ADMIN_COMPOSE_DISABLED")) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (!envCheck.valid || !envCheck.config) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const config = envCheck.config;

  if (!checkSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  // Independent server-side session authentication
  const cookieStore = await cookies();
  const cookieName = getCookieName();
  const rawCookie = cookieStore.get(cookieName)?.value;
  const session = verifySessionCookie(rawCookie, config);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
  }

  // CSRF validation
  const csrfHeader = request.headers.get("x-csrf-token");
  if (!verifyCsrfToken(csrfHeader || undefined, session, config)) {
    return NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 });
  }

  let body: {
    to?: string;
    toName?: string;
    subject?: string;
    cc?: string[];
    senderName?: string;
    senderTitle?: string;
    body?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
  }

  const rendered = renderOwnerMessage({
    header: {
      to: (body.to || "").trim(),
      toName: body.toName ? body.toName.trim() : undefined,
      subject: (body.subject || "").trim(),
      cc: body.cc,
      senderName: body.senderName ? body.senderName.trim() : session.name,
      senderTitle: body.senderTitle ? body.senderTitle.trim() : session.title,
      cta:
        body.ctaLabel && body.ctaUrl
          ? { label: body.ctaLabel.trim(), url: body.ctaUrl.trim() }
          : undefined,
    },
    body: body.body || "",
  });

  const lintResult = lintEmail(rendered, true);

  return NextResponse.json({
    success: true,
    html: rendered.html,
    text: rendered.text,
    subject: rendered.subject,
    lintResult,
  });
}

