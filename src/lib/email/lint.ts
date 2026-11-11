/**
 * MEDDY GLOBAL SOLUTIONS LTD — Deliverability & Quality Lint
 *
 * Automated checks for spam triggers, link hygiene, image restrictions,
 * contrast thresholds, contact integrity, and HTML structural safety.
 */

import { EMAIL_CONTACT, EMAIL_LOGO_URL, getContrastAudit } from "./tokens.ts";
import type { RenderedEmail } from "./types.ts";

export interface LintIssue {
  type: "error" | "warning";
  code: string;
  message: string;
  location?: string;
}

export interface LintResult {
  passed: boolean;
  errors: LintIssue[];
  warnings: LintIssue[];
  htmlSizeBytes: number;
  imageCount: number;
  linkCount: number;
}

const SPAM_PHRASES = [
  "free",
  "urgent",
  "act now",
  "limited time",
  "guarantee",
  "winner",
  "click here",
  "100%",
  "risk-free",
  "no obligation",
  "congratulations",
  "cash",
  "earn",
  "prize",
  "lottery",
  "wire transfer",
  "cryptocurrency",
  "offshore account",
  "fast cash",
  "make money",
];

const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "rebrand.ly",
  "cutt.ly",
];

export function lintEmail(email: RenderedEmail, isOwnerCompose = false): LintResult {
  const errors: LintIssue[] = [];
  const warnings: LintIssue[] = [];
  const html = email.html;
  const subject = email.subject;
  const text = email.text;

  // 1. Subject Rules
  if (!subject || subject.trim().length === 0) {
    errors.push({ type: "error", code: "SUBJECT_EMPTY", message: "Subject is required and cannot be empty." });
  } else {
    const cleanSub = subject.trim();
    const minLen = isOwnerCompose ? 5 : 6;
    const maxLen = isOwnerCompose ? 150 : 80;

    if (cleanSub.length < minLen) {
      errors.push({
        type: "error",
        code: "SUBJECT_TOO_SHORT",
        message: `Subject length (${cleanSub.length}) is below minimum of ${minLen} characters.`,
      });
    }
    if (cleanSub.length > maxLen) {
      warnings.push({
        type: "warning",
        code: "SUBJECT_LONG",
        message: `Subject length (${cleanSub.length}) exceeds recommended maximum of ${maxLen} characters.`,
      });
    }

    if (cleanSub.includes("!")) {
      errors.push({
        type: "error",
        code: "SUBJECT_EXCLAMATION",
        message: "Subject must not contain exclamation marks (!).",
      });
    }

    if (/[\$£₦€¥]/.test(cleanSub)) {
      errors.push({
        type: "error",
        code: "SUBJECT_CURRENCY",
        message: "Subject must not contain currency symbols ($/£/₦/€).",
      });
    }

    // Check for ALL-CAPS words (excluding allowed terms)
    const words = cleanSub.split(/[^A-Za-z0-9]+/);
    const allowedAllCaps = new Set([
      "MEDDY",
      "GLOBAL",
      "SOLUTIONS",
      "EPICM",
      "EPIC",
      "LTD",
      "HSSE",
      "WAT",
      "PDF",
      "MGS",
      "RE",
      "FWD",
      "ISO",
      "NDT",
      "QA",
      "QC",
      "CEO",
      "MD",
      "CTO",
      "RC",
    ]);
    for (const word of words) {
      if (word.length >= 4 && word === word.toUpperCase() && !allowedAllCaps.has(word)) {
        errors.push({
          type: "error",
          code: "SUBJECT_ALL_CAPS",
          message: `Subject contains prohibited ALL-CAPS word: "${word}".`,
        });
      }
    }
  }

  // 2. Spam phrase scan on subject and body
  const textToScan = `${subject} ${text}`.toLowerCase();
  for (const phrase of SPAM_PHRASES) {
    const regex = new RegExp(`\\b${phrase.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
    if (regex.test(textToScan)) {
      warnings.push({
        type: "warning",
        code: "SPAM_PHRASE_DETECTED",
        message: `Detected potential spam phrase: "${phrase}".`,
      });
    }
  }

  // 3. HTML size check (must be under 100 KB, target < 40 KB)
  const htmlSizeBytes = Buffer.byteLength(html, "utf8");
  if (htmlSizeBytes > 100 * 1024) {
    errors.push({
      type: "error",
      code: "HTML_OVERSIZED",
      message: `Total HTML size (${(htmlSizeBytes / 1024).toFixed(1)} KB) exceeds 100 KB limit (Gmail will clip).`,
    });
  } else if (htmlSizeBytes > 45 * 1024) {
    warnings.push({
      type: "warning",
      code: "HTML_LARGE",
      message: `Total HTML size (${(htmlSizeBytes / 1024).toFixed(1)} KB) exceeds optimal target of 45 KB.`,
    });
  }

  // 4. Image count and attributes
  const imgMatches = html.match(/<img\b[^>]*>/gi) || [];
  const imageCount = imgMatches.length;

  if (imageCount !== 1) {
    errors.push({
      type: "error",
      code: "IMAGE_COUNT_INVALID",
      message: `Email must contain exactly ONE image (the official logo). Found ${imageCount}.`,
    });
  }

  for (const imgTag of imgMatches) {
    if (!imgTag.includes('alt="MEDDY GLOBAL SOLUTIONS LTD"')) {
      errors.push({
        type: "error",
        code: "IMAGE_ALT_MISSING",
        message: 'Logo image tag must include alt="MEDDY GLOBAL SOLUTIONS LTD".',
      });
    }
    if (imgTag.includes("data:image/") || imgTag.includes("cid:")) {
      errors.push({
        type: "error",
        code: "IMAGE_EMBED_PROHIBITED",
        message: "Base64 data URIs and CID attachments are prohibited for deliverability. Use hosted HTTPS URL.",
      });
    }
  }

  // 5. Prohibited tags: <script>, <iframe>, <form>, <embed>
  if (/<(script|iframe|form|embed|object)\b/i.test(html)) {
    errors.push({
      type: "error",
      code: "PROHIBITED_HTML_TAG",
      message: "Prohibited executable HTML tag found (<script>, <iframe>, <form>, or <embed>).",
    });
  }

  // 6. Prohibited CSS: external stylesheets or display:none outside preheader
  if (/<link\s+[^>]*rel=["']stylesheet["']/i.test(html)) {
    errors.push({
      type: "error",
      code: "EXTERNAL_STYLESHEET",
      message: "External stylesheets are blocked in email clients. Use inline CSS.",
    });
  }

  // Count display:none instances in rendered HTML (excluding comments). Exactly 1 is permitted (the hidden preheader).
  const htmlWithoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const displayNoneMatches = htmlWithoutComments.match(/display:\s*none/gi) || [];
  if (displayNoneMatches.length > 1) {
    errors.push({
      type: "error",
      code: "HIDDEN_TEXT_PROHIBITED",
      message: `Found ${displayNoneMatches.length} elements with display:none. Only the single hidden preheader is permitted.`,
    });
  }

  // 7. Links audit
  const hrefMatches = Array.from(html.matchAll(/href=["']([^"']+)["']/gi)).map((m) => m[1]);
  const linkCount = hrefMatches.length;

  if (linkCount > 10) {
    warnings.push({
      type: "warning",
      code: "LINK_COUNT_HIGH",
      message: `High link count (${linkCount}). Keeping under 8 links improves deliverability.`,
    });
  }

  for (const href of hrefMatches) {
    // Check for shorteners
    for (const shortener of URL_SHORTENERS) {
      if (href.toLowerCase().includes(shortener)) {
        errors.push({
          type: "error",
          code: "URL_SHORTENER_DETECTED",
          message: `URL shortener detected (${shortener}). Shorteners trigger aggressive spam filters.`,
        });
      }
    }

    // Check for raw IP address URLs
    if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(href)) {
      errors.push({
        type: "error",
        code: "RAW_IP_URL_DETECTED",
        message: `Raw IP address URL detected (${href}). Prohibited by spam filters.`,
      });
    }

    // Scheme check
    if (!/^(https:|mailto:|tel:)/i.test(href)) {
      errors.push({
        type: "error",
        code: "UNSAFE_URL_SCHEME",
        message: `Disallowed link protocol found: "${href}". Only https:, mailto:, and tel: are permitted.`,
      });
    }
  }

  // 8. Plain-text part audit
  if (!text || text.trim().length === 0) {
    errors.push({
      type: "error",
      code: "PLAIN_TEXT_MISSING",
      message: "Plain text alternative part is missing or empty.",
    });
  } else {
    // Must contain official contact values
    if (!text.includes(EMAIL_CONTACT.email)) {
      errors.push({
        type: "error",
        code: "TEXT_MISSING_EMAIL",
        message: `Plain text part must include official email: ${EMAIL_CONTACT.email}`,
      });
    }
    if (!text.includes(EMAIL_CONTACT.phone)) {
      errors.push({
        type: "error",
        code: "TEXT_MISSING_PHONE",
        message: `Plain text part must include official phone: ${EMAIL_CONTACT.phone}`,
      });
    }
  }

  // 9. Contact Consistency Audit (Section 2.2)
  const contactConsistency = verifyContactConsistency();
  for (const issue of contactConsistency) {
    errors.push({
      type: "error",
      code: "CONTACT_INCONSISTENCY",
      message: issue,
    });
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
    htmlSizeBytes,
    imageCount,
    linkCount,
  };
}

export function verifyContactConsistency(): string[] {
  const issues: string[] = [];
  const c = EMAIL_CONTACT;

  // phoneRaw matches ^\+\d{8,15}$
  if (!/^\+\d{8,15}$/.test(c.phoneRaw)) {
    issues.push(`phoneRaw (${c.phoneRaw}) does not match required format ^\\+\\d{8,15}$`);
  }

  // phone (display) contains the same digits as phoneRaw
  const rawDigits = c.phoneRaw.replace(/\D/g, "");
  const displayDigits = c.phone.replace(/\D/g, "");
  if (rawDigits !== displayDigits) {
    issues.push(`phone display digits (${displayDigits}) do not match phoneRaw digits (${rawDigits})`);
  }

  // whatsappUrl is https://wa.me/<digits> and digits equal phoneRaw without +
  const expectedWa = `https://wa.me/${rawDigits}`;
  if (c.whatsappUrl !== expectedWa) {
    issues.push(`whatsappUrl (${c.whatsappUrl}) does not match expected (${expectedWa})`);
  }

  // email equals info@meddyglobalsolutions.com
  if (c.email !== "info@meddyglobalsolutions.com") {
    issues.push(`email (${c.email}) does not equal expected info@meddyglobalsolutions.com`);
  }

  return issues;
}

