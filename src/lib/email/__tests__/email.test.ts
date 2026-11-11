import test from "node:test";
import assert from "node:assert/strict";
import { escapeHtml, escapeAttr, stripCRLF, nl2br, safeUrl } from "../escape.ts";
import { EMAIL_CONTACT, EMAIL_PALETTE, getContrastAudit } from "../tokens.ts";
import { lintEmail, verifyContactConsistency } from "../lint.ts";
import { renderEnquiryAcknowledgement } from "../templates/enquiryAcknowledgement.ts";
import { renderEnquiryNotification } from "../templates/enquiryNotification.ts";
import { renderDocumentDelivery } from "../templates/documentDelivery.ts";
import { renderOwnerMessage } from "../templates/ownerMessage.ts";

test("Email Security: escapeHtml neutralizes hostile injection characters", () => {
  const unsafe = `<script>alert("xss")</script>&'`;
  const escaped = escapeHtml(unsafe);
  assert.equal(escaped.includes("<script>"), false);
  assert.equal(escaped.includes("&lt;script&gt;"), true);
  assert.equal(escaped.includes("&quot;"), true);
  assert.equal(escaped.includes("&#39;"), true);
  assert.equal(escaped.includes("&amp;"), true);
});

test("Email Security: escapeAttr neutralizes attribute escapes", () => {
  const unsafe = `hello" onmouseover="alert(1)`;
  const escaped = escapeAttr(unsafe);
  assert.equal(escaped.includes('"'), false);
  assert.equal(escaped.includes("&quot;"), true);
});

test("Email Security: stripCRLF prevents header injection attacks", () => {
  const injected = "Inquiry Subject\r\nBcc: evil@attacker.com\nTo: victim@target.com";
  const cleaned = stripCRLF(injected);
  assert.equal(cleaned.includes("\r"), false);
  assert.equal(cleaned.includes("\n"), false);
  assert.equal(cleaned, "Inquiry Subject Bcc: evil@attacker.com To: victim@target.com");
});

test("Email Security: safeUrl allows https, mailto, tel, rejects javascript and data schemes", () => {
  assert.equal(safeUrl("https://meddyglobalsolutionsltd.com"), "https://meddyglobalsolutionsltd.com/");
  assert.equal(safeUrl("mailto:info@meddyglobalsolutionsltd.com"), "mailto:info@meddyglobalsolutionsltd.com");
  assert.equal(safeUrl("tel:+2348033774429"), "tel:+2348033774429");
  assert.equal(safeUrl("javascript:alert(1)"), null);
  assert.equal(safeUrl("data:text/html,<script>alert(1)</script>"), null);
  assert.equal(safeUrl("ftp://evil.com"), null);
});

test("Email Tokens: Contact consistency audit passes completely", () => {
  const issues = verifyContactConsistency();
  assert.deepEqual(issues, []);
  assert.equal(EMAIL_CONTACT.phone, "+234 803 377 4429");
  assert.equal(EMAIL_CONTACT.phoneRaw, "+2348033774429");
  assert.equal(EMAIL_CONTACT.email, "info@meddyglobalsolutionsltd.com");
  assert.equal(EMAIL_CONTACT.rcNumber, "7425121");
  assert.equal(EMAIL_CONTACT.address.includes("Lekki"), true);
});

test("Email Tokens: WCAG 2.1 AA Contrast audit passes for all 10 color pairs", () => {
  const audit = getContrastAudit();
  assert.equal(audit.length >= 10, true);
  for (const item of audit) {
    assert.equal(item.passes, true, `Contrast failed for ${item.role}: ${item.measuredRatio}:1`);
    assert.equal(item.measuredRatio >= 4.5, true);
  }
});

test("Template T1: Enquiry Acknowledgement renders and passes deliverability lint", () => {
  const rendered = renderEnquiryAcknowledgement({
    recipientName: "Alhaji Ibrahim Danjuma",
    recipientEmail: "i.danjuma@kadunarefinery.ng",
    category: "Compressor Overhaul",
    submittedAtIso: "2026-11-10T14:30:00Z",
    referenceId: "MGS-2026-8891",
  });

  assert.equal(rendered.subject.includes("MEDDY GLOBAL SOLUTIONS LTD"), true);
  assert.equal(rendered.html.includes("Alhaji"), true);
  assert.equal(rendered.html.includes("MGS-2026-8891"), true);
  assert.equal(rendered.text.includes(EMAIL_CONTACT.phone), true);
  assert.equal(rendered.text.includes(EMAIL_CONTACT.email), true);

  const lint = lintEmail(rendered);
  assert.equal(lint.passed, true);
  assert.equal(lint.errors.length, 0);
});

test("Template T2: Internal Enquiry Notification renders and passes deliverability lint", () => {
  const rendered = renderEnquiryNotification({
    clientName: "Engr. Ngozi Okafor",
    clientEmail: "ngozi.okafor@shell-nigeria.com",
    category: "Rotating Equipment Maintenance",
    message: "Seeking urgent mobilization of dynamic balancing technicians for Sulzer BB2 pump.",
    submittedAtIso: "2026-11-10T16:00:00Z",
    referenceId: "MGS-2026-9021",
  });

  assert.equal(rendered.subject.includes("[Web Enquiry]"), true);
  assert.equal(rendered.html.includes("Engr. Ngozi Okafor"), true);
  assert.equal(rendered.html.includes("Sulzer BB2 pump"), true);
  assert.equal(rendered.text.includes(EMAIL_CONTACT.email), true);

  const lint = lintEmail(rendered);
  assert.equal(lint.passed, true);
  assert.equal(lint.errors.length, 0);
});

test("Template T3: Document Delivery renders with secure anti-phishing advisory", () => {
  const rendered = renderDocumentDelivery({
    clientName: "Chief Tunde Balogun",
    clientEmail: "t.balogun@dangotepetrochemical.com",
    documentType: "Technical Proposal",
    projectName: "Lekki Train 2 Overhaul",
    referenceNumber: "MEDDY-PROP-2026-042",
    senderName: "Engr. Ahmed Yusuf",
    senderTitle: "Head of Projects",
  });

  assert.equal(rendered.subject.includes("Technical Proposal"), true);
  assert.equal(rendered.html.includes("Chief Tunde Balogun"), true);
  assert.equal(rendered.html.includes("MEDDY-PROP-2026-042"), true);
  // Anti-phishing advisory must be present
  assert.equal(rendered.html.includes("MEDDY GLOBAL SOLUTIONS LTD never transmits banking or settlement account"), true);

  const lint = lintEmail(rendered);
  assert.equal(lint.passed, true);
  assert.equal(lint.errors.length, 0);
});

test("Template T4: Owner Compose Message renders with clean typography and button", () => {
  const rendered = renderOwnerMessage({
    header: {
      toName: "Dr. Babatunde Lawal",
      to: "blawal@nlng.com",
      subject: "Mobilization Confirmation for Bonny Island Project",
      senderName: "Operations Directorate",
      senderTitle: "MEDDY GLOBAL SOLUTIONS LTD",
      cta: {
        label: "Confirm Schedule",
        url: "https://www.meddyglobalsolutionsltd.com/contact",
      },
    },
    body: `We confirm that our rotating equipment specialist team has been cleared for mobilization.\n\nArrival is scheduled for Monday at 08:00 WAT.`,
  });

  assert.equal(rendered.subject, "Mobilization Confirmation for Bonny Island Project");
  assert.equal(rendered.html.includes("Dr. Babatunde Lawal"), true);
  assert.equal(rendered.html.includes("Confirm Schedule"), true);

  const lint = lintEmail(rendered, true);
  assert.equal(lint.passed, true);
  assert.equal(lint.errors.length, 0);
});

test("Deliverability Lint: Catches disallowed executable tags (<script>)", () => {
  const badEmail = {
    subject: "Test Subject With Clean Name",
    html: `<!DOCTYPE html><html><body><script>alert('bad')</script><img alt="MEDDY GLOBAL SOLUTIONS LTD" src="https://meddyglobalsolutionsltd.com/email/meddy-logo.png" /></body></html>`,
    text: `Plain text with ${EMAIL_CONTACT.email} and ${EMAIL_CONTACT.phone}`,
  };

  const lint = lintEmail(badEmail);
  assert.equal(lint.passed, false);
  assert.equal(lint.errors.some((e) => e.code === "PROHIBITED_HTML_TAG"), true);
});

test("Deliverability Lint: Enforces exactly one hosted image", () => {
  const zeroImgEmail = {
    subject: "Test Subject With Clean Name",
    html: `<!DOCTYPE html><html><body><div style="display:none">Preheader</div>No images here</body></html>`,
    text: `Plain text with ${EMAIL_CONTACT.email} and ${EMAIL_CONTACT.phone}`,
  };

  const lint = lintEmail(zeroImgEmail);
  assert.equal(lint.passed, false);
  assert.equal(lint.errors.some((e) => e.code === "IMAGE_COUNT_INVALID"), true);
});
