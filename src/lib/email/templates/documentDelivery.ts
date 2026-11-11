/**
 * MEDDY GLOBAL SOLUTIONS LTD — T3: Client Document Delivery Template
 *
 * Official cover email for proposals, quotations, reports, and formal letters.
 * Phishing-safe: zero bank details or payment links in email body.
 */

import { EMAIL_CONTACT, EMAIL_PALETTE, EMAIL_FONTS } from "../tokens.ts";
import { escapeHtml, stripCRLF } from "../escape.ts";
import { renderEmailLayout } from "../layout.ts";
import {
  renderGreeting,
  renderParagraph,
  renderInfoCard,
  renderSignOff,
  renderClientContactFooter,
} from "../components.ts";
import { formatLagosDate } from "./enquiryAcknowledgement.ts";
import type { RenderedEmail } from "../types.ts";

export type DocumentType =
  | "Quotation"
  | "Proposal"
  | "Technical Report"
  | "Commercial Invoice"
  | "Official Letter"
  | "Document";

export interface DocumentDeliveryData {
  clientName: string;
  clientEmail: string;
  documentType: DocumentType | string;
  projectName?: string;
  referenceNumber?: string;
  documentDateIso?: string;
  senderName?: string;
  senderTitle?: string;
}

export function renderDocumentDelivery(data: DocumentDeliveryData): RenderedEmail {
  const cleanDocType = stripCRLF(data.documentType || "Document");
  const cleanProject = data.projectName ? stripCRLF(data.projectName) : "";

  let subject = cleanProject
    ? `${cleanDocType}: ${cleanProject} — MEDDY GLOBAL`
    : `Official Document: ${cleanDocType} — MEDDY GLOBAL SOLUTIONS LTD`;
  if (subject.length > 80 && cleanProject) {
    const maxProjLen = Math.max(10, 80 - `${cleanDocType}: ... — MEDDY GLOBAL`.length);
    const truncatedProj = cleanProject.length > maxProjLen ? cleanProject.slice(0, maxProjLen) + "..." : cleanProject;
    subject = `${cleanDocType}: ${truncatedProj} — MEDDY GLOBAL`;
  }

  const preheader = `Your ${cleanDocType.toLowerCase()} is attached.`;
  const cleanName = stripCRLF(data.clientName || "Client");
  const docDate = data.documentDateIso ? formatLagosDate(data.documentDateIso) : formatLagosDate();

  const cardRows = [
    { label: "Sender", valueHtml: escapeHtml(EMAIL_CONTACT.legalName) },
    { label: "Document Type", valueHtml: escapeHtml(cleanDocType) },
  ];

  if (cleanProject) {
    cardRows.push({ label: "Project Name", valueHtml: escapeHtml(cleanProject) });
  }

  if (data.referenceNumber) {
    cardRows.push({
      label: "Reference",
      valueHtml: `<span style="font-family: monospace; letter-spacing: 0.5px;">${escapeHtml(
        data.referenceNumber
      )}</span>`,
    });
  }

  cardRows.push({ label: "Date Issued", valueHtml: escapeHtml(docDate) });

  const contentHtml = `
    ${renderGreeting(cleanName)}
    ${renderParagraph(
      `Please find attached the ${escapeHtml(
        cleanDocType.toLowerCase()
      )} we have prepared for you${cleanProject ? ` regarding ${escapeHtml(cleanProject)}` : ""}.`
    )}
    ${renderInfoCard("Document Information", cardRows)}
    <!-- Security & Banking Advisory -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0 20px 0; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-left: 4px solid #0CA3DC; border-radius: 6px;">
      <tr>
        <td style="padding: 16px 20px; font-family: ${EMAIL_FONTS.body};">
          <p style="margin: 0 0 6px 0; font-family: ${EMAIL_FONTS.heading}; font-size: 13px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; text-transform: uppercase; letter-spacing: 0.5px;">
            Security &amp; Banking Advisory
          </p>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: ${EMAIL_PALETTE.mutedText};">
            MEDDY GLOBAL SOLUTIONS LTD never transmits banking or settlement account instructions via email body. All commercial settlement instructions are issued exclusively on official corporate letterhead signed by authorized directors. If you receive any message asking to alter payment destinations, verify immediately by telephone (+234 803 377 4429) before taking action.
          </p>
        </td>
      </tr>
    </table>
    ${renderParagraph(
      "If you have any questions or would like any adjustments, please reach out to us directly by replying to this email or using the details below."
    )}
    ${renderSignOff(data.senderName, data.senderTitle)}
  `;

  const footerHtml = renderClientContactFooter({ isAutomated: false });

  const html = renderEmailLayout({
    title: subject,
    preheader,
    contentHtml,
    footerHtml,
  });

  const text = `MEDDY GLOBAL SOLUTIONS LTD
${subject}

Dear ${cleanName},

Please find attached the ${cleanDocType.toLowerCase()} we have prepared for you${cleanProject ? ` regarding ${cleanProject}` : ""}.

DOCUMENT INFORMATION
- Sender: ${EMAIL_CONTACT.legalName}
- Document Type: ${cleanDocType}${cleanProject ? `\n- Project Name: ${cleanProject}` : ""}${
    data.referenceNumber ? `\n- Reference: ${data.referenceNumber}` : ""
  }
- Date Issued: ${docDate}

SECURITY & BANKING ADVISORY:
MEDDY GLOBAL SOLUTIONS LTD never transmits banking or settlement account instructions via email body. All commercial settlement instructions are issued exclusively on official corporate letterhead signed by authorized directors. If you receive any message asking to alter payment destinations, verify immediately by telephone (+234 803 377 4429) before taking action.

If you have any questions or would like any adjustments, please reach out to us directly by replying to this email or using the details below.

Best regards,
${data.senderName ? `${data.senderName}\n` : ""}${data.senderTitle ? `${data.senderTitle}\n` : ""}${EMAIL_CONTACT.legalName}

--------------------------------------------------
GET IN TOUCH
- Visit us: ${EMAIL_CONTACT.siteUrl}
- Call us: ${EMAIL_CONTACT.phone} (${EMAIL_CONTACT.phoneRaw})
- WhatsApp: ${EMAIL_CONTACT.whatsappUrl}
- Email: ${EMAIL_CONTACT.email}
- Office: ${EMAIL_CONTACT.addressFormatted}
  Map: ${EMAIL_CONTACT.addressGoogleMapsUrl}
`;

  return {
    subject,
    html,
    text,
  };
}

