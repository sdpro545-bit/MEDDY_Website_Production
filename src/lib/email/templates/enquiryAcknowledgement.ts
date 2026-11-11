/**
 * MEDDY GLOBAL SOLUTIONS LTD — T1: Enquiry Acknowledgement Template
 *
 * Confirms receipt to visitor who submitted the contact form.
 * Anti-backscatter compliant (does not echo arbitrary message body).
 */

import { EMAIL_CONTACT, EMAIL_PALETTE } from "../tokens.ts";
import { escapeHtml, stripCRLF } from "../escape.ts";
import { renderEmailLayout } from "../layout.ts";
import {
  renderGreeting,
  renderParagraph,
  renderInfoCard,
  renderSignOff,
  renderClientContactFooter,
} from "../components.ts";

export interface EnquiryAcknowledgementData {
  recipientName: string;
  recipientEmail: string;
  category: string;
  submittedAtIso?: string;
  referenceId?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

export function formatLagosDate(isoString?: string): string {
  const date = isoString ? new Date(isoString) : new Date();
  return new Intl.DateTimeFormat("en-NG", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date) + " WAT";
}

export function extractFirstName(fullName: string): string {
  if (!fullName) return "";
  const cleaned = stripCRLF(fullName).trim();
  const first = cleaned.split(/\s+/)[0];
  // Basic validation that first name is a valid alphabetic word
  if (/^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,}$/.test(first)) {
    return first;
  }
  return "";
}

export function renderEnquiryAcknowledgement(data: EnquiryAcknowledgementData): RenderedEmail {
  const subject = "We have received your enquiry | MEDDY GLOBAL SOLUTIONS LTD";
  const preheader = "Our team will review your message and reply by email.";
  const firstName = extractFirstName(data.recipientName);
  const submittedFormatted = formatLagosDate(data.submittedAtIso);

  const cardRows = [
    { label: "Enquiry Category", valueHtml: escapeHtml(data.category) },
    { label: "Submitted", valueHtml: escapeHtml(submittedFormatted) },
    { label: "Received by", valueHtml: escapeHtml(EMAIL_CONTACT.legalName) },
  ];

  if (data.referenceId) {
    cardRows.push({
      label: "Reference Code",
      valueHtml: `<span style="font-family: monospace; letter-spacing: 0.5px;">${escapeHtml(data.referenceId)}</span>`,
    });
  }

  const contentHtml = `
    ${renderGreeting(firstName)}
    ${renderParagraph(
      `Thank you for contacting ${escapeHtml(
        EMAIL_CONTACT.legalName
      )}. We have received your enquiry, and our technical operations team will review it and reply to you by email.`
    )}
    ${renderInfoCard("Enquiry Summary", cardRows)}
    ${renderParagraph(
      "If you would like to add any detail to your enquiry, simply reply to this email. If you need to reach us sooner, you can also call or message us on WhatsApp using the details below."
    )}
    <p style="margin: 20px 0 0 0; font-size: 13px; line-height: 1.5; color: ${
      EMAIL_PALETTE.mutedText
    };">
      If you did not make this enquiry, you can safely ignore this message.
    </p>
    ${renderSignOff()}
  `;

  const footerHtml = renderClientContactFooter({ isAutomated: true });

  const html = renderEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    footerHtml,
  });

  const text = `MEDDY GLOBAL SOLUTIONS LTD
${subject}

${firstName ? `Dear ${firstName},` : "Dear Client,"}

Thank you for contacting ${EMAIL_CONTACT.legalName}. We have received your enquiry, and our technical operations team will review it and reply to you by email.

ENQUIRY SUMMARY
- Enquiry Category: ${data.category}
- Submitted: ${submittedFormatted}
- Received by: ${EMAIL_CONTACT.legalName}${data.referenceId ? `\n- Reference Code: ${data.referenceId}` : ""}

If you would like to add any detail to your enquiry, simply reply to this email. If you need to reach us sooner, you can also call or message us on WhatsApp using the details below.

If you did not make this enquiry, you can safely ignore this message.

Best regards,
${EMAIL_CONTACT.legalName}

--------------------------------------------------
GET IN TOUCH
- Visit us: ${EMAIL_CONTACT.siteUrl}
- Call us: ${EMAIL_CONTACT.phone} (${EMAIL_CONTACT.phoneRaw})
- WhatsApp: ${EMAIL_CONTACT.whatsappUrl}
- Email: ${EMAIL_CONTACT.email}
- Office: ${EMAIL_CONTACT.addressFormatted}
  Map: ${EMAIL_CONTACT.addressGoogleMapsUrl}

This is an automated message. You can reply to it and our team will see your reply.
`;

  return {
    subject,
    html,
    text,
    headers: {
      "Auto-Submitted": "auto-generated",
      "X-Auto-Response-Suppress": "All",
    },
  };
}

