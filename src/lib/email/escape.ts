/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email Output Encoding & Sanitization
 *
 * Strict context-aware escaping for HTML, attributes, URLs, and header injection defense.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "`": "&#96;",
};

export const escapeHtml = (v: unknown): string =>
  String(v ?? "").replace(/[&<>"'`]/g, (c) => HTML_ESCAPE_MAP[c] || c);

export const escapeAttr = escapeHtml;

export const stripCRLF = (v: unknown): string =>
  String(v ?? "").replace(/[\r\n\u2028\u2029\0]+/g, " ").trim();

export const nl2br = (escaped: string): string =>
  escaped.replace(/\r?\n/g, "<br>");

export function safeUrl(u: string, allowed = ["https:", "mailto:", "tel:"]): string | null {
  if (!u || typeof u !== "string") return null;
  const trimmed = u.trim();
  try {
    const parsed = new URL(trimmed);
    return allowed.includes(parsed.protocol) ? parsed.toString() : null;
  } catch {
    return null;
  }
}

