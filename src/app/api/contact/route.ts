import { NextResponse } from "next/server";
import { siteContent } from "@/content/siteContent";
import { renderEnquiryNotification } from "@/lib/email/templates/enquiryNotification";
import { renderEnquiryAcknowledgement } from "@/lib/email/templates/enquiryAcknowledgement";
import { sendEmail } from "@/lib/email/send";
import { stripCRLF } from "@/lib/email/escape";

export const runtime = "nodejs";

// In-memory rate limiting defense in depth (Vercel Firewall rule recommended as primary)
const submissionTracker = new Map<string, { count: number; firstAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getClientIp(request: Request): string {
  const xForwarded = request.headers.get("x-forwarded-for");
  if (xForwarded) return xForwarded.split(",")[0].trim();
  const xReal = request.headers.get("x-real-ip");
  if (xReal) return xReal.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionTracker.get(ip);
  if (!record || now - record.firstAt > RATE_LIMIT_WINDOW) {
    submissionTracker.set(ip, { count: 1, firstAt: now });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  record.count += 1;
  return true;
}

// Anti-gibberish and spam detection heuristics
function isGibberish(text: string): boolean {
  if (!text) return true;
  const clean = text.trim();

  // Flag repetitive characters (e.g. aaaaa, !!!!!!, .....)
  if (/(.)\1{4,}/.test(clean)) return true;

  // Flag common keyboard mash patterns
  const mashPatterns = [
    /asdfgh/i, /qwerty/i, /zxcvbn/i, /hjkl;'/, /123456/,
    /qazwsx/i, /edcrfv/i, /tgbyhn/i, /yuiop/i,
  ];
  if (mashPatterns.some((pattern) => pattern.test(clean))) return true;

  // Words with excessive consonants and no vowels (e.g., "bcdfghjklmn")
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (word.length >= 7 && !/[aeiouyAEIOUY]/i.test(word)) {
      return true;
    }
    // High repeated character frequency in single word
    const uniqueChars = new Set(word.toLowerCase());
    if (word.length >= 8 && uniqueChars.size <= 2) {
      return true;
    }
  }

  return false;
}

// Build subject allowlist from verified site services
function getValidSubjectAllowlist(): Set<string> {
  const allowlist = new Set<string>();
  allowlist.add("General Industrial Engineering Enquiry");
  if (siteContent.services && siteContent.services.items) {
    for (const service of siteContent.services.items) {
      allowlist.add(service.title.trim());
    }
  }
  return allowlist;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submission attempts. Please wait 15 minutes before submitting again." },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Invalid Content-Type header. Expected application/json." },
        { status: 415 }
      );
    }

    const data = await request.json();
    const { name, email, subject, message, honeypot } = data;

    // Spam honeypot check
    if (honeypot && honeypot.length > 0) {
      // Quietly reject bots without alerting them
      return NextResponse.json({ success: true, message: "Enquiry received." });
    }

    // Required fields validation & length caps
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide your full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: "Full name exceeds the 100-character limit." },
        { status: 400 }
      );
    }

    if (isGibberish(name)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid, recognizable full name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim()) || email.trim().length > 254) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid corporate or personal email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim();
    const [handle, domainPart] = cleanEmail.split("@");
    if (isGibberish(handle)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid, legitimate email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = `${handle}@${domainPart.toLowerCase()}`;

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a detailed enquiry description (minimum 10 characters)." },
        { status: 400 }
      );
    }

    if (message.trim().length > 5000) {
      return NextResponse.json(
        { success: false, error: "Enquiry message exceeds the 5,000-character limit." },
        { status: 400 }
      );
    }

    if (isGibberish(message)) {
      return NextResponse.json(
        { success: false, error: "Your message appears to contain repetitive or unrecognized text. Please provide clear enquiry details." },
        { status: 400 }
      );
    }

    // Subject allowlist normalization
    const allowlist = getValidSubjectAllowlist();
    const candidateSubject = stripCRLF(subject || "");
    const cleanSubject = allowlist.has(candidateSubject)
      ? candidateSubject
      : "General Industrial Engineering Enquiry";

    const cleanName = stripCRLF(name);
    const cleanMessage = message.trim();
    const submittedAtIso = new Date().toISOString();
    const referenceId = `MGS-${Date.now().toString(36).toUpperCase().substring(2, 8)}`;

    const recipient = process.env.CONTACT_RECIPIENT || "mglobalsolutions185@gmail.com";

    // 1. Render T2: Internal Notification
    const t2Email = renderEnquiryNotification({
      clientName: cleanName,
      clientEmail: normalizedEmail,
      category: cleanSubject,
      message: cleanMessage,
      submittedAtIso,
      referenceId,
    });

    // Dispatch T2 to company inbox
    const t2Result = await sendEmail({
      to: recipient,
      replyTo: normalizedEmail,
      subject: t2Email.subject,
      html: t2Email.html,
      text: t2Email.text,
    });

    if (!t2Result.success) {
      console.error(`[CONTACT API DISPATCH FAILURE] Could not dispatch T2 to ${recipient}: ${t2Result.error}`);
      return NextResponse.json(
        { success: false, error: "Failed to dispatch enquiry email via provider. Please email us directly at info@meddyglobalsolutions.com." },
        { status: 502 }
      );
    }

    // 2. Render and dispatch T1: Visitor Acknowledgement (Best Effort)
    try {
      const t1Email = renderEnquiryAcknowledgement({
        recipientName: cleanName,
        recipientEmail: normalizedEmail,
        category: cleanSubject,
        submittedAtIso,
        referenceId,
      });

      const t1Result = await sendEmail({
        to: normalizedEmail,
        subject: t1Email.subject,
        html: t1Email.html,
        text: t1Email.text,
        headers: t1Email.headers,
      });

      if (!t1Result.success) {
        console.warn(`[CONTACT API NOTICE] T1 acknowledgement to visitor (${normalizedEmail}) could not be delivered: ${t1Result.error}`);
      }
    } catch (t1Err) {
      console.warn("[CONTACT API NOTICE] Non-fatal error sending visitor acknowledgement:", t1Err);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your enquiry. Our technical operations team has received your message and will reply via email promptly.",
      referenceId,
    });
  } catch (error) {
    console.error("Contact API submission error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
