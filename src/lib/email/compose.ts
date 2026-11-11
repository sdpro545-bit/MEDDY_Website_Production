/**
 * MEDDY GLOBAL SOLUTIONS LTD — Owner Custom Message Engine (T4)
 *
 * Deterministic text/markdown formatter for executive correspondence.
 * Preserves exact wording, punctuation, and intent without altering owner copy.
 */

import { EMAIL_FONTS, EMAIL_PALETTE, EMAIL_CONTACT } from "./tokens.ts";
import { escapeHtml, escapeAttr, safeUrl, stripCRLF } from "./escape.ts";
import { renderEmailLayout } from "./layout.ts";
import {
  renderButton,
  renderSignOff,
  renderClientContactFooter,
} from "./components.ts";
import type { RenderedEmail } from "./types.ts";

export interface OwnerMessageHeader {
  to: string;
  toName?: string;
  subject: string;
  cc?: string[];
  senderName?: string;
  senderTitle?: string;
  cta?: {
    label: string;
    url: string;
  };
  attachments?: string[];
}

export interface OwnerMessageInput {
  header: OwnerMessageHeader;
  body: string;
}

export function parseMessageFile(content: string): OwnerMessageInput {
  const normalized = content.replace(/\r\n/g, "\n");
  const parts = normalized.split(/\n---\s*\n/);

  if (parts.length < 2) {
    // If no front-matter delimiter, treat first lines with key: value as header
    const lines = normalized.split("\n");
    const headerLines: string[] = [];
    const bodyLines: string[] = [];
    let inHeader = true;

    for (const line of lines) {
      if (inHeader && /^(to|toName|subject|senderName|senderTitle|cc|attachments|ctaLabel|ctaUrl):/i.test(line)) {
        headerLines.push(line);
      } else if (inHeader && line.trim() === "") {
        inHeader = false;
      } else {
        inHeader = false;
        bodyLines.push(line);
      }
    }

    const header = parseHeaderLines(headerLines.join("\n"));
    return { header, body: bodyLines.join("\n").trim() };
  }

  const header = parseHeaderLines(parts[0]);
  const body = parts.slice(1).join("\n---\n").trim();
  return { header, body };
}

function parseHeaderLines(rawHeader: string): OwnerMessageHeader {
  const lines = rawHeader.split("\n");
  const result: Partial<OwnerMessageHeader> = {};
  let ctaLabel = "";
  let ctaUrl = "";

  for (const line of lines) {
    const match = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const [, key, val] = match;
    const trimmedVal = val.trim();

    switch (key.toLowerCase()) {
      case "to":
        result.to = trimmedVal;
        break;
      case "toname":
        result.toName = trimmedVal;
        break;
      case "subject":
        result.subject = trimmedVal;
        break;
      case "sendername":
        result.senderName = trimmedVal;
        break;
      case "sendertitle":
        result.senderTitle = trimmedVal;
        break;
      case "cc":
        result.cc = trimmedVal.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "attachments":
        result.attachments = trimmedVal.split(",").map((s) => s.trim()).filter(Boolean);
        break;
      case "ctalabel":
        ctaLabel = trimmedVal;
        break;
      case "ctaurl":
        ctaUrl = trimmedVal;
        break;
    }
  }

  if (ctaLabel && ctaUrl) {
    result.cta = { label: ctaLabel, url: ctaUrl };
  }

  return {
    to: result.to || "",
    toName: result.toName,
    subject: result.subject || "",
    cc: result.cc,
    senderName: result.senderName,
    senderTitle: result.senderTitle,
    cta: result.cta,
    attachments: result.attachments,
  };
}

/**
 * Format inline tokens: **bold**, [text](https://...), bare https:// URLs
 * Strictly escapes everything else.
 */
function formatInline(text: string): string {
  // First escape all HTML
  let escaped = escapeHtml(text);

  // Bold: **text**
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, (_, content) => {
    return `<strong style="font-weight: 700; color: ${EMAIL_PALETTE.headingText};">${content}</strong>`;
  });

  // Markdown links: [text](url)
  escaped = escaped.replace(/\[(.+?)\]\((https:\/\/[^\s)]+)\)/g, (_, linkText, url) => {
    const valid = safeUrl(url, ["https:"]);
    if (!valid) return linkText;
    return `<a href="${escapeAttr(valid)}" target="_blank" rel="noopener noreferrer" style="color: ${EMAIL_PALETTE.linkBlue}; text-decoration: underline;">${linkText}</a>`;
  });

  // Bare https:// URLs that aren't already part of an href
  escaped = escaped.replace(/(?<!href=")(https:\/\/[^\s<"']+)/g, (url) => {
    const valid = safeUrl(url, ["https:"]);
    if (!valid) return url;
    return `<a href="${escapeAttr(valid)}" target="_blank" rel="noopener noreferrer" style="color: ${EMAIL_PALETTE.linkBlue}; text-decoration: underline; word-break: break-all;">${url}</a>`;
  });

  return escaped;
}

export function formatOwnerBody(rawBody: string, toName?: string): { html: string; text: string } {
  const normalized = rawBody.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const rawParagraphs = normalized.split(/\n\n+/);

  let paragraphs = [...rawParagraphs];

  // Professional greeting default if missing
  const hasGreeting = paragraphs.length > 0 && /^(dear|hello|hi|good\s+(morning|afternoon|day))\b/i.test(paragraphs[0].trim());
  if (!hasGreeting) {
    const defaultGreeting = toName && toName.trim() ? `Dear ${toName.trim()},` : "Dear Client,";
    paragraphs.unshift(defaultGreeting);
  }

  // Check if ending has a sign-off
  const lastIndex = paragraphs.length - 1;
  const hasSignOff =
    lastIndex >= 0 &&
    /^(best\s+regards|kind\s+regards|regards|warm\s+regards|sincerely|yours\s+faithfully|yours\s+truly)\b/i.test(
      paragraphs[lastIndex].trim()
    );

  // If the owner typed their own sign-off, pop it so renderSignOff doesn't duplicate it
  if (hasSignOff) {
    paragraphs.pop();
  }

  const htmlBlocks: string[] = [];
  const textBlocks: string[] = [];

  for (let p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    // Check for H2 heading: ## Heading
    if (trimmed.startsWith("## ")) {
      const headingContent = trimmed.substring(3).trim();
      htmlBlocks.push(
        `<h2 style="margin: 24px 0 14px 0; font-family: ${EMAIL_FONTS.heading}; font-size: 18px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; line-height: 1.35;">${formatInline(headingContent)}</h2>`
      );
      textBlocks.push(`\n## ${headingContent}\n`);
      continue;
    }

    // Check for bullet list: lines starting with - or *
    const lines = trimmed.split("\n");
    const isBulletList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
    if (isBulletList) {
      const itemsHtml = lines
        .map((l) => {
          const itemText = l.trim().replace(/^[-*]\s+/, "");
          return `<li style="margin-bottom: 6px; padding-left: 4px; font-family: ${EMAIL_FONTS.body}; font-size: 15px; line-height: 1.6; color: ${EMAIL_PALETTE.bodyText};">${formatInline(itemText)}</li>`;
        })
        .join("");
      htmlBlocks.push(`<ul style="margin: 0 0 18px 0; padding-left: 20px;">${itemsHtml}</ul>`);
      textBlocks.push(lines.map((l) => `- ${l.trim().replace(/^[-*]\s+/, "")}`).join("\n"));
      continue;
    }

    // Check for numbered list: lines starting with 1. 2. etc
    const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()));
    if (isNumberedList) {
      const itemsHtml = lines
        .map((l) => {
          const itemText = l.trim().replace(/^\d+\.\s+/, "");
          return `<li style="margin-bottom: 6px; padding-left: 4px; font-family: ${EMAIL_FONTS.body}; font-size: 15px; line-height: 1.6; color: ${EMAIL_PALETTE.bodyText};">${formatInline(itemText)}</li>`;
        })
        .join("");
      htmlBlocks.push(`<ol style="margin: 0 0 18px 0; padding-left: 20px;">${itemsHtml}</ol>`);
      textBlocks.push(lines.map((l, i) => `${i + 1}. ${l.trim().replace(/^\d+\.\s+/, "")}`).join("\n"));
      continue;
    }

    // Standard paragraph with preserved internal line breaks
    const formattedLines = lines.map((l) => formatInline(l.trim())).join("<br>");
    htmlBlocks.push(
      `<p style="margin: 0 0 18px 0; font-family: ${EMAIL_FONTS.body}; font-size: 15px; line-height: 1.6; color: ${EMAIL_PALETTE.bodyText};">${formattedLines}</p>`
    );
    textBlocks.push(trimmed);
  }

  return {
    html: htmlBlocks.join("\n"),
    text: textBlocks.join("\n\n"),
  };
}

export function renderOwnerMessage(input: OwnerMessageInput): RenderedEmail {
  const { header, body } = input;
  const cleanSubject = stripCRLF(header.subject || "Message from MEDDY GLOBAL SOLUTIONS LTD");
  const preheader = `Message from MEDDY GLOBAL SOLUTIONS LTD regarding ${cleanSubject}.`;

  const { html: formattedBodyHtml, text: formattedBodyText } = formatOwnerBody(
    body,
    header.toName
  );

  let ctaHtml = "";
  let ctaText = "";
  if (header.cta && header.cta.label && header.cta.url) {
    ctaHtml = renderButton(header.cta.label, header.cta.url);
    ctaText = `\n[${header.cta.label}]: ${header.cta.url}\n`;
  }

  const signOffHtml = renderSignOff(header.senderName, header.senderTitle);

  const contentHtml = `
    ${formattedBodyHtml}
    ${ctaHtml}
    ${signOffHtml}
  `;

  const footerHtml = renderClientContactFooter({ isAutomated: false });

  const html = renderEmailLayout({
    title: cleanSubject,
    preheader,
    contentHtml,
    footerHtml,
  });

  const text = `MEDDY GLOBAL SOLUTIONS LTD
${cleanSubject}

${formattedBodyText}
${ctaText}
Best regards,
${header.senderName ? `${header.senderName}\n` : ""}${header.senderTitle ? `${header.senderTitle}\n` : ""}MEDDY GLOBAL SOLUTIONS LTD

--------------------------------------------------
GET IN TOUCH
- Visit us: ${EMAIL_CONTACT.siteUrl}
- Call us: ${EMAIL_CONTACT.phone} (${EMAIL_CONTACT.phoneRaw})
- WhatsApp: ${EMAIL_CONTACT.whatsappUrl}
- Email: ${EMAIL_CONTACT.email}
- Office: ${EMAIL_CONTACT.addressFormatted}
`;

  return {
    subject: cleanSubject,
    html,
    text,
  };
}

