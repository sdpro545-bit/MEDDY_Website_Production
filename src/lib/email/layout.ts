/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email Document Shell & Layout
 *
 * Robust, client-tested email document wrapper with MSO fallbacks,
 * dark-mode defense, strict letterhead header band, and hidden preheader.
 */

import { EMAIL_PALETTE, EMAIL_FONTS, EMAIL_DIMENSIONS, EMAIL_LOGO_URL, EMAIL_CONTACT } from "./tokens.ts";
import { escapeHtml, stripCRLF } from "./escape.ts";

export interface EmailLayoutOptions {
  title: string;
  preheader: string;
  contentHtml: string;
  footerHtml: string;
}

export function renderEmailLayout(options: EmailLayoutOptions): string {
  const title = escapeHtml(stripCRLF(options.title));
  const preheader = escapeHtml(stripCRLF(options.preheader));

  // Non-breaking spacer sequence to prevent email clients from grabbing body text into preview
  const preheaderPadding = "&zwnj;&nbsp;".repeat(12);

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: 100% !important;
      width: 100% !important;
      background-color: ${EMAIL_PALETTE.pageBg} !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    table, td {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }
    img {
      border: 0 !important;
      height: auto !important;
      line-height: 100% !important;
      outline: none !important;
      text-decoration: none !important;
      -ms-interpolation-mode: bicubic !important;
    }
    a {
      text-decoration: none;
    }
    /* Mobile responsive stacking & fluid padding */
    @media only screen and (max-width: 600px) {
      .meddy-email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0px !important;
        border-left: 0px !important;
        border-right: 0px !important;
      }
      .meddy-header-cell {
        padding: 24px 20px 20px 20px !important;
      }
      .meddy-content-cell {
        padding: 24px 20px 24px 20px !important;
      }
      .meddy-footer-cell {
        padding: 28px 20px 24px 20px !important;
      }
      .meddy-footer-grid-col {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        padding-right: 0 !important;
        padding-bottom: 16px !important;
      }
      .meddy-card-table td {
        display: block !important;
        width: 100% !important;
      }
      .meddy-card-label {
        padding-bottom: 2px !important;
      }
      .meddy-card-value {
        padding-top: 0 !important;
        padding-bottom: 12px !important;
      }
    }
  </style>
</head>
<body bgcolor="${EMAIL_PALETTE.pageBg}" style="margin: 0; padding: 0; word-spacing: normal; background-color: ${EMAIL_PALETTE.pageBg};">
  <!-- Hidden Preheader -->
  <div style="display: none; font-size: 1px; color: ${EMAIL_PALETTE.pageBg}; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
    ${preheaderPadding}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="${EMAIL_PALETTE.pageBg}" style="background-color: ${EMAIL_PALETTE.pageBg}; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 24px 12px 36px 12px;">
        <!--[if (gte mso 9)|(IE)]>
        <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="${EMAIL_DIMENSIONS.containerMaxWidth}">
        <tr>
        <td align="center" valign="top" width="${EMAIL_DIMENSIONS.containerMaxWidth}">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="meddy-email-container" style="max-width: ${EMAIL_DIMENSIONS.containerMaxWidth}px; width: 100%; margin: 0 auto; background-color: ${EMAIL_PALETTE.surfaceWhite}; border-radius: ${EMAIL_DIMENSIONS.containerBorderRadius}px; border: 1px solid ${EMAIL_PALETTE.hairlineBorder}; overflow: hidden; text-align: left;">
          
          <!-- Header Band with Logo Alone & Decorative 3px Brand Accent Rule -->
          <tr>
            <td bgcolor="${EMAIL_PALETTE.surfaceWhite}" class="meddy-header-cell" style="padding: 32px 36px 24px 36px; background-color: ${EMAIL_PALETTE.surfaceWhite}; border-bottom: ${EMAIL_DIMENSIONS.headerRuleHeight}px solid ${EMAIL_PALETTE.accentBlue};">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${EMAIL_CONTACT.siteUrl}" target="_blank" rel="noopener noreferrer" style="display: block; border: 0; outline: none; text-decoration: none;">
                      <img src="${EMAIL_LOGO_URL}" alt="MEDDY GLOBAL SOLUTIONS LTD" width="${EMAIL_DIMENSIONS.logoWidth}" height="${EMAIL_DIMENSIONS.logoHeight}" style="display: block; border: 0; outline: none; text-decoration: none; width: ${EMAIL_DIMENSIONS.logoWidth}px; height: ${EMAIL_DIMENSIONS.logoHeight}px; max-width: ${EMAIL_DIMENSIONS.logoWidth}px;" />
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Content Area -->
          <tr>
            <td bgcolor="${EMAIL_PALETTE.surfaceWhite}" class="meddy-content-cell" style="padding: 36px 36px 32px 36px; background-color: ${EMAIL_PALETTE.surfaceWhite}; font-family: ${EMAIL_FONTS.body}; color: ${EMAIL_PALETTE.bodyText};">
              ${options.contentHtml}
            </td>
          </tr>

          <!-- Bottom Footer Band -->
          ${options.footerHtml}

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

