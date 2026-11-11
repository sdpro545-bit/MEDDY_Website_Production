# MEDDY GLOBAL SOLUTIONS LTD — Owner & Executive User Guide

Welcome to your official branded email and document delivery suite. This system ensures that all electronic correspondence from **MEDDY GLOBAL SOLUTIONS LTD** looks executive, strictly matches company branding, builds trust with corporate oil & gas and industrial clients, and never ends up in spam folders.

---

## 1. What This System Does For You

1. **Automatic Website Form Responses (Template T1)**:
   - When a prospective client submits an inquiry through your website contact form, they instantly receive a formal acknowledgment confirming that MEDDY has received their request and that your engineering operations team is reviewing it.

2. **Internal Management Alerts (Template T2)**:
   - When a website inquiry arrives, a structured notification is instantly dispatched to your management inbox (`info@meddyglobalsolutions.com` and `mglobalsolutions185@gmail.com`) containing all the client's information, category, and message, with a 1-click button to reply to them directly.

3. **Client Document Delivery (Template T3)**:
   - A formal letterhead cover email for sending official quotations, technical proposals, field inspection reports, and corporate letters to clients.
   - Includes a prominent **Security & Banking Advisory** warning clients that MEDDY never alters bank details by email, protecting your business and clients against wire-fraud spoofing.

4. **Owner Compose Portal (Template T4)**:
   - A private, secure web portal where you or authorized managers can write custom messages to clients on the official letterhead with real-time visual preview.

5. **Official Branded Email Signature (Signature S1)**:
   - A copy-and-paste HTML signature for your day-to-day webmail (Outlook, Gmail, Apple Mail, Titan).

---

## 2. How to Use the Executive Compose Portal

### Step 1: Logging In
1. Visit: `https://www.meddyglobalsolutions.com/admin/login`
2. Enter your admin username and secure password.
3. Click **Sign In**.

### Step 2: Composing a Message
1. In the **Recipient Information** section:
   - Enter the recipient's Full Name (e.g. `Engr. Tunde Balogun`).
   - Enter the recipient's Email Address (e.g. `tbalogun@clientcompany.com`).
2. In the **Subject & Sender** section:
   - Enter the Subject line (e.g. `Site Mobilization Confirmation - Eket Operations Yard`).
   - Fill in your Sender Name (e.g. `Engr. Ahmed Yusuf`) and Title (e.g. `Head of Technical Operations`).
3. In the **Call-to-Action Button (Optional)** section:
   - If you want a button in the email, enter the button label (e.g. `Confirm Meeting`) and link URL.
4. In the **Message Body**:
   - Write your message in plain text.
   - You can use paragraphs, bullet points (starting with `-`), and bold text (using `**bold text**`).
5. As you type, the **Live Letterhead Preview** on the right side of the screen updates in real-time, showing you exactly how the email will look on client screens.

### Step 3: Sending the Email
1. Review the preview carefully.
2. Click **Send Official Branded Email**.
3. A confirmation dialog will appear. Confirm the dispatch, and the system will immediately deliver the email through Resend with full DKIM signing.

---

## 3. How to Send Documents (Quotations / Proposals) via CLI

If you or your technical team prefer sending document cover letters directly from your computer:

```bash
node --experimental-strip-types scripts/email-send-document.mjs \
  --to="procurement@clientcompany.com" \
  --name="Engr. Ngozi Okafor" \
  --doc="Quotation" \
  --project="Sulzer BB2 Pump Overhaul" \
  --ref="MEDDY-QT-2026-088"
```

Add `--dry-run` to preview the output before actually sending.

---

## 4. Installing Your Email Signature (Webmail / Outlook)

Your branded executive signature is located in `email-signature/signature.html`.

### How to set it up:
1. Open the file `email-signature/signature.html` in your web browser (double-click it).
2. Press **Ctrl + A** (or **Cmd + A** on Mac) to select the entire signature.
3. Press **Ctrl + C** (or **Cmd + C**) to copy it.
4. Open your email client:
   - **Gmail**: Settings (gear icon) -> See all settings -> General -> **Signature** -> Click inside the signature box -> Press **Ctrl + V** to paste -> Click **Save Changes** at the bottom.
   - **Outlook**: Settings -> Mail -> Compose and reply -> **Email signature** -> Paste (**Ctrl + V**) -> Save.
   - **Titan / cPanel Webmail**: Settings -> Preferences / Signatures -> Paste (**Ctrl + V**) -> Save.

---

## 5. Security & Deliverability Rules

To maintain high email deliverability and protect your company reputation:
- **Never include bank account numbers or wire instructions in email bodies.** Always put banking information inside an official signed PDF invoice.
- **Never paste URL shorteners** (e.g. `bit.ly`, `tinyurl`).
- **Never use ALL CAPS in subject lines** (e.g. "URGENT ACTION REQUIRED").
- **Never send cold spam lists.** Send only to clients and inquiries who expect communications from MEDDY.

