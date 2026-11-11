#!/usr/bin/env node

/**
 * MEDDY GLOBAL SOLUTIONS LTD — Email Previews & Edge Case Generator
 *
 * Renders all official templates (T1, T2, T3, T4, S1) and rigorous edge cases to /qa/email/previews/
 * Evaluates every rendered output against deliverability & security lint.
 */

import fs from "node:fs";
import path from "node:path";
import { renderEnquiryAcknowledgement } from "../src/lib/email/templates/enquiryAcknowledgement.ts";
import { renderEnquiryNotification } from "../src/lib/email/templates/enquiryNotification.ts";
import { renderDocumentDelivery } from "../src/lib/email/templates/documentDelivery.ts";
import { renderOwnerMessage } from "../src/lib/email/templates/ownerMessage.ts";
import { lintEmail } from "../src/lib/email/lint.ts";
import { EMAIL_CONTACT, getContrastAudit } from "../src/lib/email/tokens.ts";

const PREVIEWS_DIR = path.join(process.cwd(), "qa", "email", "previews");
if (!fs.existsSync(PREVIEWS_DIR)) {
  fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
}

function writePreview(name, rendered, isOwner = false) {
  const htmlPath = path.join(PREVIEWS_DIR, `${name}.html`);
  const textPath = path.join(PREVIEWS_DIR, `${name}.txt`);
  fs.writeFileSync(htmlPath, rendered.html, "utf8");
  fs.writeFileSync(textPath, rendered.text, "utf8");

  const lint = lintEmail(rendered, isOwner);
  return { name, lint, htmlSize: Buffer.byteLength(rendered.html, "utf8") };
}

async function main() {
  console.log("=== RENDERING OFFICIAL EMAIL PREVIEWS & EDGE CASES ===");

  const results = [];

  // T1: Standard Enquiry Acknowledgement
  const t1 = renderEnquiryAcknowledgement({
    recipientName: "Babatunde Alabi",
    recipientEmail: "babatunde@example.com",
    category: "Pumps & Compressors",
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-ENQ-893K21",
  });
  results.push(writePreview("t1-acknowledgement", t1));

  // T2: Standard Internal Notification
  const t2 = renderEnquiryNotification({
    clientName: "Babatunde Alabi",
    clientEmail: "babatunde@example.com",
    category: "Pumps & Compressors",
    message: "We require a comprehensive technical assessment and refurbishment plan for two multi-stage centrifugal water injection pumps located at our facility in Port Harcourt. Please advise on mobilization schedule and quotation details.",
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-ENQ-893K21",
  });
  results.push(writePreview("t2-internal-notification", t2));

  // T3: Standard Document Delivery
  const t3 = renderDocumentDelivery({
    clientName: "Engr. Fatima Bello",
    clientEmail: "fbello@energypartners.ng",
    documentType: "Technical Proposal",
    projectName: "Escravos Gas Compression Turbine Overhaul",
    referenceNumber: "MEDDY-PROP-2026-042",
    documentDateIso: new Date().toISOString(),
    senderName: "Engr. Ahmed",
    senderTitle: "Lead Mechanical Engineer",
  });
  results.push(writePreview("t3-document-delivery", t3));

  // T4: Standard Owner Custom Message
  const t4 = renderOwnerMessage({
    header: {
      to: "client@industrial.ng",
      toName: "Chief Okon",
      subject: "Mobilization Schedule for Next Week Facility Inspection",
      senderName: "Engr. Ahmed",
      senderTitle: "Managing Director",
      cta: {
        label: "Confirm Inspection Date",
        url: "https://www.meddyglobalsolutionsltd.com/contact",
      },
    },
    body: `We have finalized the technical team mobilization roster for next week's site inspection at your Eket operations yard.

Our senior rotation specialist and electrical instrumentation engineer will arrive on Tuesday at 09:00 WAT.

Please find the checklist items we will review:
- Primary pump alignment and vibration metrics
- Lubrication cleanliness and filter differential pressures
- Control panel telemetry calibration

We look forward to meeting your operations crew on site.`,
  });
  results.push(writePreview("t4-owner-message", t4, true));

  // Edge Case 1: Very Long Name
  const edgeLongName = renderEnquiryAcknowledgement({
    recipientName: "Engr. Dr. Chukwuemeka Bartholomew Uchenna-Onyekwelu OFR FNSChE",
    recipientEmail: "chukwuemeka.uchenna-onyekwelu@petrochemical-multinational.com",
    category: "Turbines & Generators",
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-EDGE-LONGNAME",
  });
  results.push(writePreview("edge-long-name", edgeLongName));

  // Edge Case 2: Long Unbroken Email Address
  const edgeLongEmail = renderEnquiryNotification({
    clientName: "Procurement Division",
    clientEmail: "procurement-engineering-division.westafrica-coastal-region@multinational-petrochemical-holdings-international.com",
    category: "Procurement & Supply Chain",
    message: "Requesting supply timeline for stainless steel pipe spools conforming to ASME B31.3 specifications.",
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-EDGE-LONGEMAIL",
  });
  results.push(writePreview("edge-long-email", edgeLongEmail));

  // Edge Case 3: Missing Optional Fields
  const edgeMissingOptional = renderDocumentDelivery({
    clientName: "",
    clientEmail: "operations@terminal.com",
    documentType: "Document",
  });
  results.push(writePreview("edge-missing-optional", edgeMissingOptional));

  // Edge Case 4: African Diacritics (Igbo, Yoruba Names)
  const edgeDiacritics = renderEnquiryAcknowledgement({
    recipientName: "Adéwálé Ọ̀ṣunbọ̀ & Chukwudi Ọ́fọ́mátá",
    recipientEmail: "adewale.osunbo@operations.ng",
    category: "Fabrication & Structural Works",
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-EDGE-DIACRITICS",
  });
  results.push(writePreview("edge-diacritics", edgeDiacritics));

  // Edge Case 5: Hostile Payloads (XSS & HTML Injection)
  const edgeHostile = renderEnquiryNotification({
    clientName: '<script>alert("xss-name")</script>"><img src=x onerror=alert(1)>',
    clientEmail: 'hacker@hostile.com"><script>alert(1)</script>',
    category: "General Industrial Engineering Enquiry",
    message: `Test payload verification:
<script>alert("xss-body")</script>
</td></tr></table><div style="background:red;font-size:50px;">DEFACED</div>
javascript:alert(document.cookie)
"><img src=x onerror=alert(document.domain)>
\`-- DROP TABLE users; --`,
    submittedAtIso: new Date().toISOString(),
    referenceId: 'REF<script>"alert(1)"</script>',
  });
  results.push(writePreview("edge-hostile-payloads", edgeHostile));

  // Edge Case 6: 5,000 Character Message Body
  const baseParagraph = "MEDDY GLOBAL SOLUTIONS LTD provides specialized engineering, technical procurement, and lifecycle maintenance for high-criticality assets across oil & gas, petrochemical, and manufacturing infrastructure. Our rotation integrity specialists deliver vibration diagnostic assessments, dynamic balancing, hydrodynamic bearing rebabbitting, and laser optical alignment. ";
  const largeMessage = baseParagraph.repeat(Math.ceil(5000 / baseParagraph.length)).substring(0, 5000);
  const edgeLargeMessage = renderEnquiryNotification({
    clientName: "Terminal Operations Directorate",
    clientEmail: "directorate@bonnyterminal.ng",
    category: "Global Maintenance Service",
    message: largeMessage,
    submittedAtIso: new Date().toISOString(),
    referenceId: "MGS-EDGE-5000CHARS",
  });
  results.push(writePreview("edge-large-message", edgeLargeMessage));

  // Edge Case 7: Owner Message with Full Markdown Features
  const edgeOwnerFull = renderOwnerMessage({
    header: {
      to: "partner@jointventure.ng",
      toName: "Engr. Folake Adeyemi",
      subject: "Formal Quotation & Execution Schedule: Bonny Terminal Pipeline Inspection",
      cc: ["technical@jointventure.ng", "procurement@jointventure.ng"],
      senderName: "Engr. Ahmed",
      senderTitle: "Managing Director",
      cta: {
        label: "View Scope Verification Portal",
        url: "https://www.meddyglobalsolutionsltd.com/capabilities",
      },
    },
    body: `We are pleased to submit the finalized technical execution schedule for the upcoming subsea pipeline inspection.

## Key Technical Workstreams

The inspection campaign comprises three synchronized phases:
- Acoustic resonance pigging and ultrasonic wall thickness mapping
- Subsea flange torque audit and cathodic protection baseline verification
- Comprehensive metallurgical lifecycle integrity modeling

## Mobilization Timetable

1. Phase 1 Equipment Arrival: 14 business days from contract execution
2. Phase 2 Marine Vessel Stationing: 21 business days
3. Phase 3 Engineering Report Submission: 30 business days

For real-time operational milestones, please access our verified portal at https://www.meddyglobalsolutionsltd.com or review the attached technical dossier.

We remain dedicated to delivering **Engineering Excellence**, **Integrated Solutions**, and **Operational Success**.`,
  });
  results.push(writePreview("edge-owner-full-markdown", edgeOwnerFull, true));

  // Edge Case 8: Owner Message with Plain Text Only
  const edgeOwnerPlain = renderOwnerMessage({
    header: {
      to: "vendor@supplier.com",
      subject: "Inquiry Regarding Flange Gasket Availability",
    },
    body: `Please send your current stock availability and pricing for 8-inch Class 600 spiral wound gaskets with 316SS windings and graphite filler. We need delivery to our Lekki office within five business days.`,
  });
  results.push(writePreview("edge-owner-plain-text", edgeOwnerPlain, true));

  // S1: Webmail Signature copy to previews
  const signatureSrc = path.join(process.cwd(), "email-signature", "signature.html");
  if (fs.existsSync(signatureSrc)) {
    fs.copyFileSync(signatureSrc, path.join(PREVIEWS_DIR, "s1-webmail-signature.html"));
  }

  // Summary Table
  console.log("\n--------------------------------------------------------------------------------");
  console.log("TEMPLATE PREVIEWS & LINT AUDIT REPORT");
  console.log("--------------------------------------------------------------------------------");
  console.log(
    "Preview Name".padEnd(28) +
      "HTML Size".padEnd(14) +
      "Images".padEnd(10) +
      "Links".padEnd(10) +
      "Lint Status"
  );
  console.log("-".repeat(80));

  let anyFailed = false;
  for (const r of results) {
    const status = r.lint.passed ? "PASS" : `FAIL (${r.lint.errors.length} errs)`;
    if (!r.lint.passed) anyFailed = true;
    console.log(
      r.name.padEnd(28) +
        `${(r.htmlSize / 1024).toFixed(1)} KB`.padEnd(14) +
        `${r.lint.imageCount}`.padEnd(10) +
        `${r.lint.linkCount}`.padEnd(10) +
        status
    );
    if (r.lint.errors.length > 0) {
      for (const err of r.lint.errors) {
        console.error(`  [ERROR] ${err.code}: ${err.message}`);
      }
    }
    if (r.lint.warnings.length > 0) {
      for (const warn of r.lint.warnings) {
        console.warn(`  [WARN]  ${warn.code}: ${warn.message}`);
      }
    }
  }

  // Contrast Audit
  console.log("\n--------------------------------------------------------------------------------");
  console.log("WCAG 2.1 AA COLOR CONTRAST RATIO AUDIT");
  console.log("--------------------------------------------------------------------------------");
  const contrastRows = getContrastAudit();
  for (const c of contrastRows) {
    console.log(
      `${c.role.padEnd(38)} | ${c.foreground} on ${c.background} | Ratio: ${c.measuredRatio}:1 (Min: ${c.requiredMinimum}:1) | ${c.passes ? "PASS" : "FAIL"}`
    );
  }

  console.log("--------------------------------------------------------------------------------\n");

  if (anyFailed) {
    console.error("ERROR: One or more email templates failed deliverability lint!");
    process.exit(1);
  } else {
    console.log("All email templates generated and passed deliverability & quality lint.\n");
  }
}

main().catch((err) => {
  console.error("Preview rendering failed:", err);
  process.exit(1);
});
