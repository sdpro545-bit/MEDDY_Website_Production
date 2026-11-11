/**
 * MEDDY GLOBAL SOLUTIONS LTD — Reusable Email Components
 *
 * Bulletproof buttons, accessible typography blocks, responsive info-cards,
 * and the binding client-facing dark contact footer.
 */

import {
  EMAIL_PALETTE,
  EMAIL_FONTS,
  EMAIL_CONTACT,
  EMAIL_DIMENSIONS,
} from "./tokens.ts";
import { escapeHtml, escapeAttr, safeUrl } from "./escape.ts";

export function renderParagraph(text: string): string {
  return `<p style="margin: 0 0 18px 0; font-family: ${EMAIL_FONTS.body}; font-size: 15px; line-height: 1.6; color: ${EMAIL_PALETTE.bodyText};">${text}</p>`;
}

export function renderGreeting(name?: string): string {
  const safeName = name ? escapeHtml(name.trim()) : "";
  const greetingText = safeName ? `Dear ${safeName},` : "Dear Client,";
  return `<h2 style="margin: 0 0 16px 0; font-family: ${EMAIL_FONTS.heading}; font-size: 18px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; line-height: 1.35;">${greetingText}</h2>`;
}

export interface InfoCardRow {
  label: string;
  valueHtml: string;
}

export function renderInfoCard(cardTitle: string, rows: InfoCardRow[]): string {
  const safeTitle = escapeHtml(cardTitle.toUpperCase());
  const validRows = rows.filter((r) => r.label && r.valueHtml);

  if (validRows.length === 0) return "";

  const rowsHtml = validRows
    .map(
      (r, idx) => `
        <tr>
          <td class="meddy-card-label" valign="top" style="padding: ${idx === 0 ? "8px" : "6px"} 12px ${idx === validRows.length - 1 ? "8px" : "6px"} 0; width: 38%; font-family: ${EMAIL_FONTS.body}; font-size: 13px; font-weight: 600; color: ${EMAIL_PALETTE.mutedText}; line-height: 1.45;">
            ${escapeHtml(r.label)}:
          </td>
          <td class="meddy-card-value" valign="top" style="padding: ${idx === 0 ? "8px" : "6px"} 0 ${idx === validRows.length - 1 ? "8px" : "6px"} 0; font-family: ${EMAIL_FONTS.body}; font-size: 14px; font-weight: 600; color: ${EMAIL_PALETTE.headingText}; line-height: 1.45; word-break: break-word;">
            ${r.valueHtml}
          </td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="meddy-card-table" style="background-color: ${EMAIL_PALETTE.infoCardBg}; border: 1px solid ${EMAIL_PALETTE.infoCardBorder}; border-left: ${EMAIL_DIMENSIONS.cardLeftBorderWidth}px solid ${EMAIL_PALETTE.infoCardLeftBorder}; border-radius: 6px; margin: 24px 0 24px 0;">
      <tr>
        <td style="padding: 16px 20px;">
          <div style="font-family: ${EMAIL_FONTS.heading}; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${EMAIL_PALETTE.linkBlue}; margin-bottom: 10px;">
            ${safeTitle}
          </div>
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            ${rowsHtml}
          </table>
        </td>
      </tr>
    </table>`;
}

export function renderButton(label: string, url: string): string {
  const safeTarget = safeUrl(url, ["https:", "mailto:"]);
  if (!safeTarget) return "";

  const safeLabel = escapeHtml(label);

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px 0 24px 0;">
      <tr>
        <td align="center" bgcolor="${EMAIL_PALETTE.buttonFill}" style="border-radius: 9999px; background-color: ${EMAIL_PALETTE.buttonFill};">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${escapeAttr(safeTarget)}" style="height:${EMAIL_DIMENSIONS.buttonMinHeight}px;v-text-anchor:middle;width:240px;" arcsize="50%" fillcolor="${EMAIL_PALETTE.buttonFill}" stroke="f">
          <w:anchorlock/>
          <center style="color:${EMAIL_PALETTE.buttonText};font-family:${EMAIL_FONTS.body};font-size:15px;font-weight:700;">
            ${safeLabel}
          </center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${escapeAttr(safeTarget)}" target="_blank" rel="noopener noreferrer" style="display: inline-block; min-height: ${EMAIL_DIMENSIONS.buttonMinHeight}px; line-height: ${EMAIL_DIMENSIONS.buttonMinHeight}px; padding: 0 28px; font-family: ${EMAIL_FONTS.body}; font-size: 15px; font-weight: 700; color: ${EMAIL_PALETTE.buttonText}; text-decoration: none; text-align: center; -webkit-text-size-adjust: none;">
            ${safeLabel}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`;
}

export function renderSignOff(senderName?: string, senderTitle?: string): string {
  const parts: string[] = [];
  parts.push(renderParagraph("Best regards,"));

  let signature = "";
  if (senderName && senderName.trim()) {
    signature += `<div style="font-family: ${EMAIL_FONTS.heading}; font-size: 15px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; line-height: 1.4;">${escapeHtml(senderName.trim())}</div>`;
    if (senderTitle && senderTitle.trim()) {
      signature += `<div style="font-family: ${EMAIL_FONTS.body}; font-size: 13px; font-weight: 500; color: ${EMAIL_PALETTE.mutedText}; line-height: 1.4; margin-bottom: 2px;">${escapeHtml(senderTitle.trim())}</div>`;
    }
  }

  signature += `<div style="font-family: ${EMAIL_FONTS.heading}; font-size: 14px; font-weight: 700; color: ${EMAIL_PALETTE.headingText}; line-height: 1.4;">${escapeHtml(EMAIL_CONTACT.legalName)}</div>`;

  return `<div style="margin: 24px 0 0 0;">${parts.join("")}${signature}</div>`;
}

export function renderClientContactFooter(options: { isAutomated?: boolean } = {}): string {
  const isAutomated = options.isAutomated ?? false;

  const automatedNotice = isAutomated
    ? `<div style="font-family: ${EMAIL_FONTS.body}; font-size: 12px; line-height: 1.5; color: ${EMAIL_PALETTE.footerTextMuted}; margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        This is an automated message. You can reply to it and our team will see your reply.
      </div>`
    : "";

  return `
    <tr>
      <td bgcolor="${EMAIL_PALETTE.footerBandBg}" class="meddy-footer-cell" style="padding: 32px 36px 28px 36px; background-color: ${EMAIL_PALETTE.footerBandBg}; font-family: ${EMAIL_FONTS.body}; color: ${EMAIL_PALETTE.footerTextWhite}; text-align: left;">
        
        <!-- Heading -->
        <div style="font-family: ${EMAIL_FONTS.heading}; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: ${EMAIL_PALETTE.footerTextWhite}; margin-bottom: 18px;">
          Get in touch
        </div>

        <!-- Two-column grid that stacks on mobile -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <!-- Column 1: Website & Phone -->
            <td valign="top" width="50%" class="meddy-footer-grid-col" style="padding-right: 12px; padding-bottom: 14px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${EMAIL_PALETTE.footerTextMuted}; margin-bottom: 3px;">
                Visit us at
              </div>
              <div style="min-height: 24px;">
                <a href="${escapeAttr(EMAIL_CONTACT.siteUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight: 600; color: ${EMAIL_PALETTE.footerLinkBlue}; text-decoration: none;">
                  www.meddyglobalsolutions.com
                </a>
              </div>

              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${EMAIL_PALETTE.footerTextMuted}; margin-top: 14px; margin-bottom: 3px;">
                Call us
              </div>
              <div style="min-height: 24px;">
                <a href="tel:${escapeAttr(EMAIL_CONTACT.phoneRaw)}" style="font-size: 13px; font-weight: 600; color: ${EMAIL_PALETTE.footerLinkBlue}; text-decoration: none;">
                  ${escapeHtml(EMAIL_CONTACT.phone)}
                </a>
              </div>
            </td>

            <!-- Column 2: WhatsApp & Email -->
            <td valign="top" width="50%" class="meddy-footer-grid-col" style="padding-left: 0; padding-bottom: 14px;">
              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${EMAIL_PALETTE.footerTextMuted}; margin-bottom: 3px;">
                WhatsApp
              </div>
              <div style="min-height: 24px;">
                <a href="${escapeAttr(EMAIL_CONTACT.whatsappUrl)}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight: 600; color: ${EMAIL_PALETTE.footerLinkBlue}; text-decoration: none;">
                  Message us on WhatsApp
                </a>
              </div>

              <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${EMAIL_PALETTE.footerTextMuted}; margin-top: 14px; margin-bottom: 3px;">
                Email us
              </div>
              <div style="min-height: 24px;">
                <a href="mailto:${escapeAttr(EMAIL_CONTACT.email)}" style="font-size: 13px; font-weight: 600; color: ${EMAIL_PALETTE.footerLinkBlue}; text-decoration: none;">
                  ${escapeHtml(EMAIL_CONTACT.email)}
                </a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Office Address Line -->
        <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.1); font-size: 12px; line-height: 1.5; color: ${EMAIL_PALETTE.footerTextMuted};">
          <span style="color: ${EMAIL_PALETTE.footerTextWhite}; font-weight: 600;">Office:</span> ${escapeHtml(EMAIL_CONTACT.addressFormatted)}
          &nbsp;&bull;&nbsp;
          <a href="${escapeAttr(EMAIL_CONTACT.addressGoogleMapsUrl)}" target="_blank" rel="noopener noreferrer" style="color: ${EMAIL_PALETTE.footerLinkBlue}; text-decoration: underline; font-weight: 600;">
            View on map
          </a>
        </div>

        <!-- Legal Name Signature -->
        <div style="font-family: ${EMAIL_FONTS.heading}; font-size: 12px; font-weight: 700; color: ${EMAIL_PALETTE.footerTextWhite}; margin-top: 12px; letter-spacing: 0.5px;">
          ${escapeHtml(EMAIL_CONTACT.legalName)}
        </div>

        ${automatedNotice}

      </td>
    </tr>`;
}

export function renderInternalFooter(): string {
  return `
    <tr>
      <td bgcolor="${EMAIL_PALETTE.footerBandBg}" style="padding: 22px 36px; background-color: ${EMAIL_PALETTE.footerBandBg}; font-family: ${EMAIL_FONTS.body}; color: ${EMAIL_PALETTE.footerTextMuted}; text-align: center; font-size: 12px; line-height: 1.6; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        Dispatched from official web portal &bull; Target recipient: <span style="color: ${EMAIL_PALETTE.footerTextWhite}; font-weight: 600;">${escapeHtml(EMAIL_CONTACT.email)}</span><br />
        <span style="color: ${EMAIL_PALETTE.footerTextMuted}; font-size: 11px;">${escapeHtml(EMAIL_CONTACT.legalName)} &bull; RC: ${escapeHtml(EMAIL_CONTACT.rcNumber)} &bull; ${escapeHtml(EMAIL_CONTACT.phone)}</span>
      </td>
    </tr>`;
}

