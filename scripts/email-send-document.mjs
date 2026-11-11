#!/usr/bin/env node

/**
 * MEDDY GLOBAL SOLUTIONS LTD — Document Delivery CLI (T3)
 *
 * Usage:
 *   node scripts/email-send-document.mjs --to client@example.com --file ./quote.pdf [--send --confirm]
 */

import fs from "node:fs";
import path from "node:path";
import { renderDocumentDelivery } from "../src/lib/email/templates/documentDelivery.ts";
import { lintEmail } from "../src/lib/email/lint.ts";
import { sendEmail } from "../src/lib/email/send.ts";

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : "";
  };

  const to = getArg("--to");
  const name = getArg("--name") || "Client";
  const docType = getArg("--type") || "Technical Proposal";
  const project = getArg("--project") || "";
  const ref = getArg("--ref") || "";
  const filePath = getArg("--file");
  const isSend = args.includes("--send");
  const isConfirm = args.includes("--confirm");

  if (!to || !filePath) {
    console.error("Usage: node scripts/email-send-document.mjs --to <email> --file <path.pdf> [--name <name>] [--type <type>] [--project <proj>] [--ref <ref>] [--send --confirm]");
    process.exit(1);
  }

  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`Error: File not found at ${absPath}`);
    process.exit(1);
  }

  if (!absPath.toLowerCase().endsWith(".pdf")) {
    console.error("Error: Only PDF documents can be dispatched via this delivery pipeline.");
    process.exit(1);
  }

  const fileBytes = fs.readFileSync(absPath);
  if (fileBytes.length > 2.5 * 1024 * 1024) {
    console.error(`Error: Attachment size (${(fileBytes.length/1024/1024).toFixed(1)} MB) exceeds 2.5 MB limit.`);
    process.exit(1);
  }

  const base64Content = fileBytes.toString("base64");
  const filename = path.basename(absPath);

  const rendered = renderDocumentDelivery({
    clientName: name,
    clientEmail: to,
    documentType: docType,
    projectName: project,
    referenceNumber: ref,
    documentDateIso: new Date().toISOString(),
  });

  const lint = lintEmail(rendered);

  console.log("\n=== DOCUMENT DELIVERY DISPATCH SUMMARY ===");
  console.log(`To:         ${name} <${to}>`);
  console.log(`Subject:    ${rendered.subject}`);
  console.log(`Document:   ${filename} (${(fileBytes.length / 1024).toFixed(1)} KB)`);
  console.log(`Lint:       ${lint.passed ? "PASSED" : "FAILED"}`);

  const previewPath = path.join(process.cwd(), "qa", "email", "previews", "cli-document-preview.html");
  fs.writeFileSync(previewPath, rendered.html, "utf8");
  console.log(`Preview written to: qa/email/previews/cli-document-preview.html`);

  if (!isSend) {
    console.log("\n[PREVIEW MODE] To dispatch with attachment, re-run with: --send --confirm\n");
    return;
  }

  if (isSend && !isConfirm) {
    console.error("\nREFUSAL: Sending requires explicit --confirm flag.\n");
    process.exit(1);
  }

  const result = await sendEmail({
    to,
    bcc: [process.env.EMAIL_ARCHIVE_BCC || "info@meddyglobalsolutions.com"],
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    attachments: [{ filename, content: base64Content }],
  });

  if (result.success) {
    console.log(`\nSUCCESS: Document dispatched! Message ID: ${result.messageId}\n`);
  } else {
    console.error(`\nERROR: Dispatch failed: ${result.error}\n`);
    process.exit(1);
  }
}

main().catch(console.error);
