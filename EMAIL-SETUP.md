# MEDDY GLOBAL SOLUTIONS LTD — Email Infrastructure Setup Guide

This guide provides step-by-step instructions for configuring enterprise-grade outbound branded email delivery for **MEDDY GLOBAL SOLUTIONS LTD** (`meddyglobalsolutions.com`).

---

## 1. Architecture Overview

The MEDDY website and official communication system dispatches email via **Resend** (leveraging AWS SES underlying infrastructure) with strict domain authentication:
- **Sender Identity**: `info@meddyglobalsolutions.com` (display: `MEDDY GLOBAL SOLUTIONS LTD`)
- **DKIM Signing**: 2048-bit domain keys aligned with `meddyglobalsolutions.com`
- **SPF Policy**: Hardened authorization including Resend mail servers
- **DMARC Policy**: Enforced monitoring progressing to quarantine/reject
- **Inbound Routing**: Incoming mail continues delivering to your primary business inbox without disruption.

---

## 2. Step 1: Create Resend Account & Add Domain

1. Go to [https://resend.com](https://resend.com) and sign up (or sign in).
2. In the Resend Dashboard, navigate to **Domains** and click **Add Domain**.
3. Enter your official domain:
   ```text
   meddyglobalsolutions.com
   ```
4. Select the region closest to your primary audience: **eu-west-1 (Ireland)** or **us-east-1 (N. Virginia)**.
5. Resend will display your domain's DNS verification records (DKIM, SPF/Return-Path, DMARC).

---

## 3. Step 2: Configure Namecheap DNS Records

Log in to your **Namecheap Dashboard** -> **Domain List** -> click **Manage** next to `meddyglobalsolutions.com` -> click **Advanced DNS**.

> [!WARNING]
> **DO NOT DELETE OR OVERWRITE EXISTING MX RECORDS.**
> Your existing MX records handle incoming emails to your company webmail (Titan, Google Workspace, or cPanel). Modifying MX records will disrupt your ability to receive emails.

Add the following DNS records exactly as specified:

### A. DKIM Records (Authenticity & Integrity)
Resend will provide two or three `TXT` or `CNAME` records for DKIM. Enter each:

| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** / **TXT** | `resend._domainkey` (or value provided by Resend) | `(Value provided by Resend dashboard)` | Automatic |
| **CNAME** / **TXT** | `(Second DKIM host provided)` | `(Second DKIM value provided)` | Automatic |

### B. SPF Record (Authorized Sender)
- **If you do NOT currently have an SPF record on Namecheap:**
  - **Type**: `TXT Record`
  - **Host**: `@`
  - **Value**: `v=spf1 include:resend.com ~all`
  - **TTL**: `Automatic`

- **If you ALREADY have an SPF record (e.g. for Titan, Google Workspace, or cPanel):**
  - Merge Resend into your existing record by adding `include:resend.com` before the all mechanism:
  - Example: `v=spf1 include:spf.titan.email include:resend.com ~all`

### C. DMARC Policy Record (Phishing & Spoofing Defense)
- **Type**: `TXT Record`
- **Host**: `_dmarc`
- **Value**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@meddyglobalsolutions.com; pct=100; sp=none; aspf=r; adkim=r`
- **TTL**: `Automatic`

*Note: Initial policy `p=none` allows you to monitor reports. After 2–4 weeks of clean deliverability, upgrade to `p=quarantine` or `p=reject`.*

### D. Return-Path (Bounce Handling)
- **Type**: `CNAME Record`
- **Host**: `bounces` (or host provided by Resend)
- **Value**: `feedback-smtp.resend.com` (or value provided by Resend)
- **TTL**: `Automatic`

---

## 4. Step 3: Verify Domain in Resend

1. Back in the Resend Dashboard under **Domains**, click **Verify Records**.
2. DNS propagation across global resolvers typically takes 5–30 minutes (up to 24 hours in rare cases).
3. Once all records display a green **Verified** status, your domain is authenticated to send DKIM-signed emails.

---

## 5. Step 4: Generate API Key

1. In Resend, navigate to **API Keys** -> click **Create API Key**.
2. **Name**: `MEDDY Production Website`
3. **Permission**: `Sending access` (or `Full access` if restricted sending is not desired).
4. **Domain**: Select `meddyglobalsolutions.com`.
5. Click **Add** and immediately copy the key (`re_...`). Keep it confidential!

---

## 6. Step 5: Configure Production Environment Variables (Vercel)

Open your project in the [Vercel Dashboard](https://vercel.com) -> **Settings** -> **Environment Variables**. Add the following:

```env
# Outbound Mail Provider
RESEND_API_KEY=re_your_api_key_here

# Brand Sender Identities
EMAIL_FROM=MEDDY GLOBAL SOLUTIONS LTD <info@meddyglobalsolutions.com>
EMAIL_REPLY_TO=info@meddyglobalsolutions.com
EMAIL_INTERNAL_NOTIFICATION_TO=mglobalsolutions185@gmail.com,info@meddyglobalsolutions.com

# Assets & URLs
NEXT_PUBLIC_SITE_URL=https://www.meddyglobalsolutions.com
EMAIL_ASSET_BASE_URL=https://www.meddyglobalsolutions.com

# Admin Compose Portal
ADMIN_COMPOSE_ENABLED=true
ADMIN_USERNAME=meddyadmin
ADMIN_PASSWORD_HASH=<generated-scrypt-hash>
ADMIN_SESSION_SECRET=<64-char-hex-secret>
ADMIN_DAILY_SEND_LIMIT=50
```

*(Refer to `ADMIN-HANDOVER.md` for generating the password hash and session secret).*

---

## 7. Step 6: Test & Verify Outbound Delivery

To verify that outbound mail sends cleanly and passes all deliverability filters:

1. Run the local preview generator:
   ```bash
   node --experimental-strip-types scripts/render-email-previews.mjs
   ```
2. Send a test document cover letter via CLI:
   ```bash
   node --experimental-strip-types scripts/email-send-document.mjs --to="your-email@domain.com" --name="Test Recipient" --doc="Quotation" --project="Refinery Overhaul" --dry-run
   ```
3. Remove `--dry-run` to dispatch a live message once `RESEND_API_KEY` is present.
4. Inspect the received email in Gmail or Outlook:
   - Click the 3 dots -> **Show Original** (Gmail) or **View Message Details** (Outlook).
   - Verify:
     - `SPF: PASS with IP ...`
     - `DKIM: 'PASS' with domain meddyglobalsolutions.com`
     - `DMARC: 'PASS'`

