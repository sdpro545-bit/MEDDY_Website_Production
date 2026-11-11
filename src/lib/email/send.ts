/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email Transport Dispatcher
 *
 * Secure, dependency-light HTTP client for Resend API with honest error reporting.
 */

import { EMAIL_CONTACT } from "./tokens.ts";

export interface EmailAttachment {
  filename: string;
  content: string; // base64 string
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  headers?: Record<string, string>;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isSimulated?: boolean;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const defaultFrom =
    process.env.EMAIL_FROM || `MEDDY GLOBAL SOLUTIONS <info@meddyglobalsolutions.com>`;
  const from = options.from || defaultFrom;
  const replyTo = options.replyTo || EMAIL_CONTACT.email;

  const toList = Array.isArray(options.to) ? options.to : [options.to];

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[EMAIL DISPATCH SIMULATED - NO API KEY]`);
      console.log(`From: ${from}`);
      console.log(`To: ${toList.join(", ")}`);
      if (options.cc && options.cc.length) console.log(`CC: ${options.cc.join(", ")}`);
      if (options.bcc && options.bcc.length) console.log(`BCC: ${options.bcc.join(", ")}`);
      console.log(`Reply-To: ${replyTo}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`HTML size: ${Buffer.byteLength(options.html, "utf8")} bytes`);
      return {
        success: true,
        messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        isSimulated: true,
      };
    }

    return {
      success: false,
      error: "Email delivery service is currently unconfigured (missing API key).",
    };
  }

  try {
    const payload: Record<string, unknown> = {
      from,
      to: toList,
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: replyTo,
    };

    if (options.cc && options.cc.length > 0) {
      payload.cc = options.cc;
    }
    if (options.bcc && options.bcc.length > 0) {
      payload.bcc = options.bcc;
    }
    if (options.headers && Object.keys(options.headers).length > 0) {
      payload.headers = options.headers;
    }
    if (options.attachments && options.attachments.length > 0) {
      payload.attachments = options.attachments;
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      let parsedErr = errText;
      try {
        const j = JSON.parse(errText);
        parsedErr = j.message || errText;
      } catch {
        // use raw text
      }
      console.error(`Resend API error (${response.status}):`, parsedErr);
      return {
        success: false,
        error: `Provider error (${response.status}): ${parsedErr}`,
      };
    }

    const result = (await response.json()) as { id?: string };
    return {
      success: true,
      messageId: result.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Network error during email dispatch:", message);
    return {
      success: false,
      error: `Network error: ${message}`,
    };
  }
}

