# MEDDY GLOBAL SOLUTIONS LTD — Domain & Email Infrastructure Setup Guide

This guide provides step-by-step instructions for connecting your custom domain **`meddyglobalsolutionsltd.com`** to the live website on Vercel and configuring enterprise-grade outbound branded email delivery.

---

## 1. Connecting Your Domain to Vercel (Website Hosting)

To link **`meddyglobalsolutionsltd.com`** to your live website:

### Step A: Add Domain in Vercel Dashboard
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Select your project (**`MEDDY_Website_Production`**).
3. Navigate to **Settings** -> **Domains**.
4. Click **Add Domain** and enter:
   ```text
   meddyglobalsolutionsltd.com
   ```
5. Select the recommended option: **Add `meddyglobalsolutionsltd.com` and redirect `www.meddyglobalsolutionsltd.com` to it** (or vice-versa).

### Step B: Configure DNS Records in Your Domain Registrar (Namecheap / GoDaddy)
Go to your domain registrar's **Advanced DNS** settings and add these two records:

| Type | Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` | Automatic / 1 min |
| **CNAME Record** | `www` | `cname.vercel-dns.com` | Automatic / 1 min |

*(Vercel will automatically provision a free, auto-renewing SSL certificate as soon as the DNS records propagate).*

---

## 2. Architecture Overview for Email

The MEDDY website and official communication system dispatches email via **Resend** (leveraging AWS SES underlying infrastructure) with strict domain authentication:
- **Sender Identity**: `info@meddyglobalsolutionsltd.com` (display: `MEDDY GLOBAL SOLUTIONS LTD`)
- **DKIM Signing**: 2048-bit domain keys aligned with `meddyglobalsolutionsltd.com`
- **SPF Policy**: Hardened authorization including Resend mail servers
- **DMARC Policy**: Enforced monitoring progressing to quarantine/reject
- **Inbound Routing**: Incoming mail continues delivering to your primary business inbox without disruption.

---

## 3. Step 1: Create Resend Account & Add Domain

1. Go to [https://resend.com](https://resend.com) and sign up (or sign in).
2. In the Resend Dashboard, navigate to **Domains** and click **Add Domain**.
3. Enter your official domain:
   ```text
   meddyglobalsolutionsltd.com
   ```
4. Select the region closest to your primary audience: **eu-west-1 (Ireland)** or **us-east-1 (N. Virginia)**.
5. Resend will display your domain's DNS verification records (DKIM, SPF/Return-Path, DMARC).

---

## 4. Step 2: Configure Namecheap DNS Records for Email

Log in to your **Namecheap Dashboard** -> **Domain List** -> click **Manage** next to `meddyglobalsolutionsltd.com` -> click **Advanced DNS**.

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
- **If you do NOT currently have an SPF record:**
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
- **Value**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@meddyglobalsolutionsltd.com; pct=100; sp=none; aspf=r; adkim=r`
- **TTL**: `Automatic`

*Note: Initial policy `p=none` allows you to monitor reports. After 2–4 weeks of clean deliverability, upgrade to `p=quarantine` or `p=reject`.*

### D. Return-Path (Bounce Handling)
- **Type**: `CNAME Record`
- **Host**: `bounces` (or host provided by Resend)
- **Value**: `feedback-smtp.resend.com` (or value provided by Resend)
- **TTL**: `Automatic`

---

## 5. Step 3: Verify Domain in Resend

1. Back in the Resend Dashboard under **Domains**, click **Verify Records**.
2. DNS propagation across global resolvers typically takes 5–30 minutes (up to 24 hours in rare cases).
3. Once all records display a green **Verified** status, your domain is authenticated to send DKIM-signed emails.

---

## 6. Step 4: Generate API Key

1. In Resend, navigate to **API Keys** -> click **Create API Key**.
2. **Name**: `MEDDY Production Website`
3. **Permission**: `Sending access` (or `Full access` if restricted sending is not desired).
4. **Domain**: Select `meddyglobalsolutionsltd.com`.
5. Click **Add** and immediately copy the key (`re_...`). Keep it confidential!

---

## 7. Step 5: Configure Production Environment Variables (Vercel)

Open your project in the [Vercel Dashboard](https://vercel.com) -> **Settings** -> **Environment Variables**. Add the following:

```env
# Outbound Mail Provider
RESEND_API_KEY=re_your_api_key_here

# Brand Sender Identities
EMAIL_FROM=MEDDY GLOBAL SOLUTIONS LTD <info@meddyglobalsolutionsltd.com>
EMAIL_REPLY_TO=info@meddyglobalsolutionsltd.com
EMAIL_INTERNAL_NOTIFICATION_TO=mglobalsolutions185@gmail.com,info@meddyglobalsolutionsltd.com

# Assets & URLs
NEXT_PUBLIC_SITE_URL=https://www.meddyglobalsolutionsltd.com
EMAIL_ASSET_BASE_URL=https://www.meddyglobalsolutionsltd.com

# Admin Compose Portal
ADMIN_COMPOSE_ENABLED=true
ADMIN_USERNAME=meddyadmin
ADMIN_PASSWORD_HASH=<generated-scrypt-hash>
ADMIN_SESSION_SECRET=<64-char-hex-secret>
ADMIN_DAILY_SEND_LIMIT=50
```

*(Refer to `ADMIN-HANDOVER.md` for generating the password hash and session secret).*

---

## 8. Step 6: Test & Verify Outbound Delivery

To verify that outbound mail sends cleanly and passes all deliverability filters:

1. Run the local preview generator:
   ```bash
   npm run email:previews
   ```
2. Send a test document cover letter via CLI:
   ```bash
   npm run email:send-doc -- --to="your-email@domain.com" --name="Test Recipient" --doc="Quotation" --project="Refinery Overhaul" --dry-run
   ```
3. Remove `--dry-run` to dispatch a live message once `RESEND_API_KEY` is present.
4. Inspect the received email in Gmail or Outlook:
   - Click the 3 dots -> **Show Original** (Gmail) or **View Message Details** (Outlook).
   - Verify:
     - `SPF: PASS with IP ...`
     - `DKIM: 'PASS' with domain meddyglobalsolutionsltd.com`
     - `DMARC: 'PASS'`

