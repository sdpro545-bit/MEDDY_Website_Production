#!/usr/bin/env node

/**
 * MEDDY GLOBAL SOLUTIONS LTD — Owner CLI Email Composer
 *
 * Usage:
 *   npm run email:compose -- message.md              # Preview only
 *   npm run email:compose -- message.md --send --confirm   # Dispatches email
 */

import fs from "node:fs";
import path from "node:path";
import { parseMessageFile, renderOwnerMessage } from "../src/lib/email/compose.ts";
import { lintEmail } from "../src/lib/email/lint.ts";
import { sendEmail } from "../src/lib/email/send.ts";

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find((a) => !a.startsWith("--"));
  const isSend = args.includes("--send");
  const isConfirm = args.includes("--confirm");

  if (!fileArg) {
    console.error("Error: Please provide a message markdown or text file.");
    console.log("Usage:");
    console.log("  npm run email:compose -- <file.md> [--send --confirm]");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  const rawContent = fs.readFileSync(filePath, "utf8");
  const input = parseMessageFile(rawContent);

  if (!input.header.to) {
    console.error("Error: Missing 'to' recipient header.");
    process.exit(1);
  }
  if (!input.header.subject) {
    console.error("Error: Missing 'subject' header.");
    process.exit(1);
  }

  const rendered = renderOwnerMessage(input);
  const lint = lintEmail(rendered, true);

  console.log("\n=== MEDDY EMAIL COMPOSE SUMMARY ===");
  console.log(`From:    ${process.env.EMAIL_FROM || "MEDDY GLOBAL SOLUTIONS <info@meddyglobalsolutionsltd.com>"}`);
  console.log(`To:      ${input.header.toName ? `${input.header.toName} <${input.header.to}>` : input.header.to}`);
  if (input.header.cc) console.log(`CC:      ${input.header.cc.join(", ")}`);
  console.log(`Subject: ${rendered.subject}`);
  console.log(`HTML:    ${Buffer.byteLength(rendered.html, "utf8")} bytes`);
  console.log(`Lint:    ${lint.passed ? "PASSED" : "FAILED"}`);

  if (lint.errors.length > 0) {
    console.error("\nLint Errors (blocking send):");
    for (const e of lint.errors) console.error(` - [${e.code}] ${e.message}`);
  }
  if (lint.warnings.length > 0) {
    console.warn("\nLint Warnings:");
    for (const w of lint.warnings) console.warn(` - [${w.code}] ${w.message}`);
  }

  // Write preview output to qa/email/previews/
  const previewDir = path.join(process.cwd(), "qa", "email", "previews");
  fs.mkdirSync(previewDir, { recursive: true });
  fs.writeFileSync(path.join(previewDir, "cli-owner-preview.html"), rendered.html, "utf8");
  fs.writeFileSync(path.join(previewDir, "cli-owner-preview.txt"), rendered.text, "utf8");
  console.log(`\nPreview written to: qa/email/previews/cli-owner-preview.html`);

  if (!isSend) {
    console.log("\n[PREVIEW MODE] To dispatch this message, re-run with: --send --confirm\n");
    return;
  }

  if (isSend && !isConfirm) {
    console.error("\nREFUSAL: Sending requires explicit --confirm flag.");
    console.error("Re-run: npm run email:compose -- " + fileArg + " --send --confirm\n");
    process.exit(1);
  }

  if (!lint.passed) {
    console.error("\nABORTED: Cannot send email with active deliverability lint errors.\n");
    process.exit(1);
  }

  console.log("\nDispatching email via provider...");
  const result = await sendEmail({
    to: input.header.to,
    cc: input.header.cc,
    bcc: [process.env.EMAIL_ARCHIVE_BCC || "info@meddyglobalsolutionsltd.com"],
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });

  if (result.success) {
    console.log(`\nSUCCESS: Email dispatched! Message ID: ${result.messageId}\n`);
  } else {
    console.error(`\nERROR: Dispatch failed: ${result.error}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
