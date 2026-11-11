/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email System Tokens
 *
 * Strict single-source token definition for palettes, typography, contrast thresholds,
 * asset URLs, and the EMAIL_CONTACT allowlist mapper.
 */

import { siteContent } from "../../content/siteContent.ts";

export const EMAIL_PALETTE = {
  pageBg: "#F5FAFC",
  surfaceWhite: "#FFFFFF",
  hairlineBorder: "#E4EDF2",
  headingText: "#20262B",
  bodyText: "#3A444C",
  mutedText: "#5A6872",
  accentBlue: "#0CA3DC", // Decorative rules & card edge ONLY. Never text on white (2.9:1)
  linkBlue: "#076E9C",   // Accessible interactive blue (5.7:1 on white, 5.4:1 on pageBg)
  buttonFill: "#076E9C",
  buttonText: "#FFFFFF",
  infoCardBg: "#F5FAFC",
  infoCardBorder: "#E4EDF2",
  infoCardLeftBorder: "#0CA3DC",
  footerBandBg: "#20262B",
  footerTextWhite: "#FFFFFF",
  footerTextMuted: "#B8C4CC",
  footerLinkBlue: "#7FD3F2",
} as const;

export const EMAIL_FONTS = {
  heading: "Manrope, Arial, Helvetica, sans-serif",
  body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

export const EMAIL_DIMENSIONS = {
  containerMaxWidth: 600,
  containerBorderRadius: 12,
  logoWidth: 56,
  logoHeight: 65, // Natural 112x129 aspect ratio at 56px display width
  headerRuleHeight: 3,
  cardLeftBorderWidth: 3,
  buttonMinHeight: 44,
  touchMinHeight: 44,
} as const;

export interface EmailContactDetails {
  legalName: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsappUrl: string;
  addressFormatted: string;
  address: string;
  addressGoogleMapsUrl: string;
  siteUrl: string;
  rcNumber: string;
}

/**
 * Explicit allowlist mapper that extracts only verified contact properties from siteContent.
 * Spreading or importing the raw company object into email templates is strictly forbidden.
 */
function createEmailContact(): EmailContactDetails {
  const comp = siteContent.company;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.meddyglobalsolutionsltd.com").replace(/\/$/, "");

  return {
    legalName: comp.legalName,
    email: comp.email,
    phone: comp.phone,
    phoneRaw: comp.phoneRaw,
    whatsappUrl: comp.whatsappUrl,
    addressFormatted: comp.address.formatted,
    address: comp.address.formatted,
    addressGoogleMapsUrl: comp.address.googleMapsUrl,
    siteUrl,
    rcNumber: "7425121",
  };
}

export const EMAIL_CONTACT: EmailContactDetails = Object.freeze(createEmailContact());

export const EMAIL_ASSET_BASE_URL = (
  process.env.EMAIL_ASSET_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.meddyglobalsolutionsltd.com"
).replace(/\/$/, "");

export const EMAIL_LOGO_URL = `${EMAIL_ASSET_BASE_URL}/email/meddy-logo.png`;

/**
 * WCAG 2.1 Relative Luminance & Contrast Ratio calculation
 */
export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function getContrastRatio(hexForeground: string, hexBackground: string): number {
  const lum1 = getRelativeLuminance(hexForeground);
  const lum2 = getRelativeLuminance(hexBackground);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastAuditRow {
  role: string;
  foreground: string;
  background: string;
  measuredRatio: number;
  requiredMinimum: number;
  passes: boolean;
}

export function getContrastAudit(): ContrastAuditRow[] {
  const pairs: Array<{
    role: string;
    fg: string;
    bg: string;
    min: number;
  }> = [
    { role: "Heading text on white", fg: EMAIL_PALETTE.headingText, bg: EMAIL_PALETTE.surfaceWhite, min: 4.5 },
    { role: "Body text on white", fg: EMAIL_PALETTE.bodyText, bg: EMAIL_PALETTE.surfaceWhite, min: 4.5 },
    { role: "Muted text on white", fg: EMAIL_PALETTE.mutedText, bg: EMAIL_PALETTE.surfaceWhite, min: 4.5 },
    { role: "Muted text on page background", fg: EMAIL_PALETTE.mutedText, bg: EMAIL_PALETTE.pageBg, min: 4.5 },
    { role: "Link blue on white", fg: EMAIL_PALETTE.linkBlue, bg: EMAIL_PALETTE.surfaceWhite, min: 4.5 },
    { role: "Link blue on page background", fg: EMAIL_PALETTE.linkBlue, bg: EMAIL_PALETTE.pageBg, min: 4.5 },
    { role: "Button text on button fill", fg: EMAIL_PALETTE.buttonText, bg: EMAIL_PALETTE.buttonFill, min: 4.5 },
    { role: "Footer heading text on footer band", fg: EMAIL_PALETTE.footerTextWhite, bg: EMAIL_PALETTE.footerBandBg, min: 4.5 },
    { role: "Footer muted text on footer band", fg: EMAIL_PALETTE.footerTextMuted, bg: EMAIL_PALETTE.footerBandBg, min: 4.5 },
    { role: "Footer link on footer band", fg: EMAIL_PALETTE.footerLinkBlue, bg: EMAIL_PALETTE.footerBandBg, min: 4.5 },
  ];

  return pairs.map(({ role, fg, bg, min }) => {
    const ratio = Math.round(getContrastRatio(fg, bg) * 10) / 10;
    return {
      role,
      foreground: fg,
      background: bg,
      measuredRatio: ratio,
      requiredMinimum: min,
      passes: ratio >= min,
    };
  });
}

