import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAdminEnv } from "@/lib/admin/env";
import {
  verifySessionCookie,
  verifyCsrfToken,
  getCookieName,
  checkSameOrigin,
} from "@/lib/admin/auth";
import { checkAndIncrementDailySend, getRemainingDailySends } from "@/lib/admin/throttle";
import { renderOwnerMessage } from "@/lib/email/compose";
import { lintEmail } from "@/lib/email/lint";
import { sendEmail, EmailAttachment } from "@/lib/email/send";
import { stripCRLF } from "@/lib/email/escape";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_ATTACHMENTS = 3;
const MAX_TOTAL_ATTACHMENT_BYTES = 3 * 1024 * 1024; // 3 MB safe ceiling

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

  // Daily send limit check
  const sendLimitCheck = checkAndIncrementDailySend(config.dailySendLimit);
  if (!sendLimitCheck.allowed) {
    return NextResponse.json(
      {
        error: `Daily dispatch limit reached (${config.dailySendLimit} emails/day). Please try again tomorrow or contact engineering.`,
      },
      { status: 429 }
    );
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
    attachments?: Array<{ filename: string; content: string }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload." }, { status: 400 });
  }

  const cleanTo = (body.to || "").trim().toLowerCase();
  if (!cleanTo || !EMAIL_REGEX.test(cleanTo)) {
    return NextResponse.json(
      { error: "Please provide a single valid recipient email address." },
      { status: 400 }
    );
  }

  const cleanSubject = stripCRLF(body.subject || "");
  if (cleanSubject.length < 5 || cleanSubject.length > 150) {
    return NextResponse.json(
      { error: "Subject must be between 5 and 150 characters." },
      { status: 400 }
    );
  }

  const cleanBody = body.body || "";
  if (!cleanBody.trim() || cleanBody.length > 20000) {
    return NextResponse.json(
      { error: "Message body must be provided and cannot exceed 20,000 characters." },
      { status: 400 }
    );
  }

  // CC validation (at most 3 valid emails)
  const validatedCc: string[] = [];
  if (body.cc && Array.isArray(body.cc)) {
    if (body.cc.length > 3) {
      return NextResponse.json(
        { error: "A maximum of 3 CC recipients is permitted." },
        { status: 400 }
      );
    }
    for (const c of body.cc) {
      const trimmed = String(c).trim().toLowerCase();
      if (!EMAIL_REGEX.test(trimmed)) {
        return NextResponse.json(
          { error: `Invalid CC email address: "${trimmed}"` },
          { status: 400 }
        );
      }
      validatedCc.push(trimmed);
    }
  }

  // Attachments validation (PDF only, max 3, under 3MB total)
  const validatedAttachments: EmailAttachment[] = [];
  if (body.attachments && Array.isArray(body.attachments)) {
    if (body.attachments.length > MAX_ATTACHMENTS) {
      return NextResponse.json(
        { error: `At most ${MAX_ATTACHMENTS} PDF attachments are permitted.` },
        { status: 400 }
      );
    }

    let totalBytes = 0;
    for (const att of body.attachments) {
      if (!att.filename || !att.filename.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `Attachment "${att.filename}" rejected. Only PDF files are permitted.` },
          { status: 400 }
        );
      }
      if (!att.content || typeof att.content !== "string") {
        return NextResponse.json(
          { error: `Attachment "${att.filename}" has invalid content payload.` },
          { status: 400 }
        );
      }

      // Calculate approximate byte size from base64
      const approxBytes = Math.ceil((att.content.length * 3) / 4);
      totalBytes += approxBytes;
      if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
        return NextResponse.json(
          { error: "Total attachment size exceeds the 3 MB safe serverless ceiling." },
          { status: 400 }
        );
      }

      validatedAttachments.push({
        filename: stripCRLF(att.filename),
        content: att.content,
      });
    }
  }

  // Render using unified deterministic formatter
  const rendered = renderOwnerMessage({
    header: {
      to: cleanTo,
      toName: body.toName ? stripCRLF(body.toName) : undefined,
      subject: cleanSubject,
      cc: validatedCc.length > 0 ? validatedCc : undefined,
      senderName: body.senderName ? stripCRLF(body.senderName) : session.name,
      senderTitle: body.senderTitle ? stripCRLF(body.senderTitle) : session.title,
      cta:
        body.ctaLabel && body.ctaUrl
          ? { label: stripCRLF(body.ctaLabel), url: body.ctaUrl.trim() }
          : undefined,
    },
    body: cleanBody,
  });

  // Strict quality and deliverability lint
  const lintResult = lintEmail(rendered, true);
  if (!lintResult.passed && lintResult.errors.length > 0) {
    return NextResponse.json(
      {
        error: `Email rejected by deliverability lint: ${lintResult.errors[0].message}`,
        lintErrors: lintResult.errors,
      },
      { status: 400 }
    );
  }

  // Dispatch email with automatic BCC to archive mailbox
  const dispatchResult = await sendEmail({
    to: cleanTo,
    cc: validatedCc.length > 0 ? validatedCc : undefined,
    bcc: [config.archiveBcc],
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    attachments: validatedAttachments.length > 0 ? validatedAttachments : undefined,
  });

  // Extract recipient domain for privacy-safe audit logging
  const recipientDomain = cleanTo.split("@")[1] || "unknown";
  const nowIso = new Date().toISOString();

  if (!dispatchResult.success) {
    console.error(
      `[ADMIN EMAIL DISPATCH FAILED] Time: ${nowIso} | User: ${session.email} | ToDomain: ${recipientDomain} | SubjectLen: ${cleanSubject.length} | Error: ${dispatchResult.error}`
    );
    return NextResponse.json(
      {
        error: "Unable to dispatch message via mail provider. Please verify your internet connection or try again later.",
      },
      { status: 502 }
    );
  }

  console.log(
    `[ADMIN EMAIL DISPATCHED] Time: ${nowIso} | User: ${session.email} | ToDomain: ${recipientDomain} | SubjectLen: ${cleanSubject.length} | ProviderId: ${dispatchResult.messageId} | Simulated: ${Boolean(dispatchResult.isSimulated)}`
  );

  return NextResponse.json({
    success: true,
    messageId: dispatchResult.messageId,
    remainingSends: getRemainingDailySends(config.dailySendLimit),
  });
}

