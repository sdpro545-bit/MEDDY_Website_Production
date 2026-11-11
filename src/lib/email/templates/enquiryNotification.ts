/**
 * MEDDY GLOBAL SOLUTIONS LTD — T2: Internal Enquiry Notification Template
 *
 * Dispatched to the company inbox when a visitor submits the website contact form.
 * Escapes all user inputs, formats timestamps in Lagos WAT, and provides an inert inset message block.
 */

import { EMAIL_CONTACT, EMAIL_PALETTE, EMAIL_FONTS } from "../tokens.ts";
import { escapeHtml, escapeAttr, stripCRLF, nl2br, safeUrl } from "../escape.ts";
import { renderEmailLayout } from "../layout.ts";
import {
  renderInfoCard,
  renderButton,
  renderInternalFooter,
} from "../components.ts";
import { formatLagosDate } from "./enquiryAcknowledgement.ts";
import type { RenderedEmail } from "../types.ts";

export interface EnquiryNotificationData {
  clientName: string;
  clientEmail: string;
  category: string;
  message: string;
  submittedAtIso?: string;
  referenceId?: string;
}

export function renderEnquiryNotification(data: EnquiryNotificationData): RenderedEmail {
  const cleanName = stripCRLF(data.clientName);
  const cleanCategory = stripCRLF(data.category);
  let subject = `[Web Enquiry] ${cleanCategory} | ${cleanName}`;
  if (subject.length > 80) {
    const maxNameLen = Math.max(10, 80 - `[Web Enquiry] ${cleanCategory} | ...`.length);
    const truncatedName = cleanName.length > maxNameLen ? cleanName.slice(0, maxNameLen) + "..." : cleanName;
    subject = `[Web Enquiry] ${cleanCategory} | ${truncatedName}`;
    if (subject.length > 80) {
      subject = subject.slice(0, 77) + "...";
    }
  }
  const preheader = `New website enquiry received from ${cleanName} regarding ${cleanCategory}.`;
  const submittedFormatted = formatLagosDate(data.submittedAtIso);

  const safeClientEmail = safeUrl(`mailto:${data.clientEmail}`);
  const emailLinkHtml = safeClientEmail
    ? `<a href="${escapeAttr(safeClientEmail)}" style="color: ${EMAIL_PALETTE.linkBlue}; text-decoration: underline;">${escapeHtml(data.clientEmail)}</a>`
    : escapeHtml(data.clientEmail);

  const cardRows = [
    { label: "Full Name", valueHtml: escapeHtml(cleanName) },
    { label: "Client Email", valueHtml: emailLinkHtml },
    { label: "Category", valueHtml: escapeHtml(cleanCategory) },
    { label: "Received", valueHtml: escapeHtml(submittedFormatted) },
  ];

  if (data.referenceId) {
    cardRows.push({
      label: "Reference Code",
      valueHtml: `<span style="font-family: monospace; letter-spacing: 0.5px;">${escapeHtml(data.referenceId)}</span>`,
    });
  }

  const escapedMessageHtml = nl2br(escapeHtml(data.message));
  const replySubject = encodeURIComponent(`RE: [Web Enquiry] ${cleanCategory} - ${EMAIL_CONTACT.legalName}`);
  const replyMailtoUrl = `mailto:${encodeURIComponent(data.clientEmail)}?subject=${replySubject}`;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-family: ${EMAIL_FONTS.heading}; font-size: 18px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; line-height: 1.35;">
      New Web Enquiry Received
    </h2>
    <p style="margin: 0 0 16px 0; font-family: ${EMAIL_FONTS.body}; font-size: 15px; line-height: 1.6; color: ${EMAIL_PALETTE.bodyText};">
      A prospective client has submitted an enquiry through the official website contact form. Summary and details below:
    </p>

    ${renderInfoCard("Web Enquiry", cardRows)}

    <!-- Inset Escaped Message Block -->
    <div style="background-color: ${EMAIL_PALETTE.infoCardBg}; border: 1px solid ${EMAIL_PALETTE.infoCardBorder}; border-radius: 6px; padding: 18px 20px; margin: 24px 0 24px 0;">
      <div style="font-family: ${EMAIL_FONTS.heading}; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${EMAIL_PALETTE.mutedText}; margin-bottom: 8px;">
        Enquiry Message Details
      </div>
      <div style="font-family: ${EMAIL_FONTS.body}; font-size: 14px; line-height: 1.65; color: ${EMAIL_PALETTE.headingText}; word-break: break-word;">
        ${escapedMessageHtml}
      </div>
    </div>

    ${renderButton("Reply to Client", replyMailtoUrl)}
  `;

  const footerHtml = renderInternalFooter();

  const html = renderEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    footerHtml,
  });

  const text = `MEDDY GLOBAL SOLUTIONS LTD — INTERNAL NOTIFICATION
${subject}

A prospective client has submitted an enquiry through the official website contact form.

WEB ENQUIRY SUMMARY
- Full Name: ${cleanName}
- Client Email: ${data.clientEmail}
- Category: ${cleanCategory}
- Received: ${submittedFormatted}${data.referenceId ? `\n- Reference Code: ${data.referenceId}` : ""}

ENQUIRY MESSAGE DETAILS:
${data.message}

Reply to client: ${replyMailtoUrl}

--------------------------------------------------------------------------------
CONFIDENTIAL: Internal notification dispatched to ${EMAIL_CONTACT.email} for MEDDY GLOBAL SOLUTIONS LTD personnel only.
${EMAIL_CONTACT.legalName} · RC: ${EMAIL_CONTACT.rcNumber}
Head Office: ${EMAIL_CONTACT.address}
Direct: ${EMAIL_CONTACT.phone} · Inquiries: ${EMAIL_CONTACT.email} · Web: ${EMAIL_CONTACT.siteUrl}
`;

  return {
    subject,
    html,
    text,
  };
}

