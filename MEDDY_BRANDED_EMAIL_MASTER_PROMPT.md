# MEDDY GLOBAL SOLUTIONS LTD — BRANDED EMAIL SYSTEM: MASTER DESIGN & ENGINEERING PROMPT (v4)

> **Role:** Act as a senior full-stack engineer and professional email designer with deep experience in email rendering and deliverability. Design, build, test and document the official branded email system for MEDDY GLOBAL SOLUTIONS LTD, so that every email a client receives reads as correspondence from an established industrial company: the logo, the company name as sender, a clean structured layout, a professional sign-off, and a footer that tells the client how to reach MEDDY (visit the website, call, WhatsApp, email, find the office).
>
> **Working rule:** Build real, sendable emails wired into the existing project, not a mockup. Inspect before editing. Preserve working functionality. Decide like an owner of the codebase: choose, justify briefly, document. Ask me only when a decision is genuinely mine.
>
> **Design freedom:** There is no reference email to copy. Design what a senior designer-developer would ship for an engineering firm: restrained, precise, trustworthy, consistent with the website. Do not imitate another company's email.
>
> **Honesty rule:** Nobody can guarantee inbox placement. Your job is to remove every avoidable cause of spam filtering, prove it with checks you actually ran, and tell me plainly what only real-world sending can confirm.

---

## 0. PRE-FLIGHT (no edits yet)

1. Read `AGENTS.md` in full. Follow its task sequence and completion-report format.
2. Read `MEDDY_GLOBAL_SOLUTIONS_MASTER_WEBSITE_PROMPT.md`, especially Section 0A. **Note:** Section 0A.3 says no phone or WhatsApp anywhere. The owner has since decided that phone and WhatsApp **are** wanted as contact channels (the live website already shows them). For everything in this task, **this brief supersedes 0A.3**. Do not edit the website brief or website components; record the superseded directive in `CONTENT-REQUIRED.md`.
3. Inspect: `src/app/api/contact/route.ts`, `src/components/contact/ContactForm.tsx`, `src/content/siteContent.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/Header.tsx` and `Footer.tsx` (logo lockup and contact rendering), `public/brand/*`, `package.json`, `next.config.ts`, `vercel.json`, `CONTENT-REQUIRED.md`, `tools/verify_protected_files.js`.
4. Run `node tools/verify_protected_files.js` now and record the output. Run it again at the end.
5. **Known project facts you must account for (verified by inspection):**
   - `next.config.ts` sets `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true`. **A passing `npm run build` proves nothing about type safety.** Run `npx tsc --noEmit` separately and report it. Do not change `next.config.ts` without asking me, **except** the narrow `headers()` addition authorized in Section 6B.5.
   - `package.json` has `"lint": "echo 'ESLint skipped'"`. Do not report lint as passed.
   - The contact form's `subject` is a fixed list: "General Industrial Engineering Enquiry" plus the service titles from `siteContent`.
   - The current internal-notification email in `route.ts` interpolates user input into HTML unescaped (Section 8).
   - There is **no `middleware.ts`** yet; `src/app/robots.ts` currently disallows only `/api/`; the lockfile pins Next 15.5.29 and React 19.3.1.
   - `siteContent.company` already holds `email`, `phone`, `phoneRaw`, `whatsappUrl` and `address` (with `formatted` and `googleMapsUrl`). These are the single source of truth for contact details.

---

## 1. WHAT IS BEING BUILT

A typed, **dependency-light** email system, integrated into the contact API, with a deliverability lint, a **secure owner compose page** where the client can send professionally formatted custom messages, a branded webmail signature, a credential-handover guide, and a sending-domain setup guide.

| # | Deliverable | Recipient | Purpose |
|---|---|---|---|
| T1 | **Enquiry Acknowledgement** | Visitor who submits `/contact` | Confirms receipt. The first branded message every prospect sees. Highest priority. |
| T2 | **Internal Enquiry Notification** | MEDDY inbox | Replaces the inline HTML in `route.ts`. Same layout, internal wording. |
| T3 | **Client Document Delivery** | Client | "Please find attached the document we have prepared" with a **Document Information** card. For quotations, proposals, reports, invoices, letters sent as attachments. |
| T4 | **Owner Custom Message** | Client | The owner writes a plain message; the system turns it into a polished branded email (Section 6), sent from a secure login-protected page, `/admin/compose` (Section 6B). |
| S1 | **Branded webmail signature** | Used when the owner types an email directly in the mailbox | Logo, name, title, company, contact links. |

**Out of scope:** newsletters, bulk campaigns, unsubscribe flows, tracking pixels, databases, self-service account management, a draft or sent-mail store, an inbox, a contacts list, and any admin feature other than the compose page in Section 6B.

---

## 2. CLIENT FACTS AND CONTACT DETAILS (binding)

### 2.1 Source of truth
All contact details come from `siteContent.company`. **Never hardcode them in templates.** Create `EMAIL_CONTACT` in `src/lib/email/tokens.ts` as an explicit allowlist mapper that picks only: `legalName`, `email`, `phone`, `phoneRaw`, `whatsappUrl`, `address.formatted`, `address.googleMapsUrl`, and `siteUrl` (from env, defaulting to `https://www.meddyglobalsolutions.com`, taken from `metadataBase`). Do not spread or import the whole company object into email code.

### 2.2 Consistency test (fails the build script on error)
- `phoneRaw` matches `^\+\d{8,15}$`.
- `phone` (display) contains the same digits as `phoneRaw`.
- `whatsappUrl` is `https://wa.me/<digits>` and the digits equal `phoneRaw` without `+`.
- `email` equals `info@meddyglobalsolutions.com`.
- Every rendered email contains the contact values exactly as they appear in `EMAIL_CONTACT`, and **no other** phone-like number appears anywhere.

### 2.3 Still forbidden in any email
Tagline or slogan, social media links, RC number, year established, certifications, client names, awards, statistics, testimonials, bank or payment details, invented response-time promises (say "as soon as we have reviewed it"), and any claim about MEDDY not already approved in `siteContent.ts`.

---

## 3. DESIGN SPECIFICATION

### 3.1 Direction: "engineering letterhead"
A **light, clean, corporate** email: white canvas, generous whitespace, strict alignment, one blue accent, a solid dark footer that carries the contact block. It should read as MEDDY's official letterhead in an inbox and match the website's palette and typography. No gradients, no shadows that Outlook drops, no emoji, no icon images, no decorative clutter, no stock-template look.

**Why light:** the MEDDY emblem is charcoal and blue on transparency, designed for a light surface, so it can stand on the header exactly as supplied.

### 3.2 The logo stands alone (binding)
- The emblem appears **by itself** on the white header at natural proportions. **No tile, badge, circle, rounded box, border, shadow, background shape, outline or tinted panel. No wordmark text beside it.**
- Do not recolor, redraw, stretch, crop into the artwork, add effects, or re-vectorize it.
- Company name appears in the sender display name, the sign-off and the footer, as a letterhead would.
- **Header:** logo left-aligned or centered (choose one for all templates), about 56px wide display size (keep the 889:1024 aspect ratio, about 64px tall), 28px or more clear space on every side, a 3px full-width rule in `#0CA3DC` at the bottom of the header band.
- **Email-safe asset (new files only; protected originals untouched):**
  - Source: `public/brand/logo.png` (889x1024, RGBA). **Read-only.**
  - Write `scripts/build-email-assets.mjs` (use `sharp` if already resolvable through Next.js; otherwise Python/Pillow or another existing tool; **no new project dependency**) that trims only the transparent margin, resizes with Lanczos to 2x display size (about 112px wide), composites onto **opaque white `#FFFFFF`**, and writes `public/email/meddy-logo.png`, optimized, **under 20 KB**, 8-bit. The opaque white prevents dark charcoal letters from ever sitting on a dark surface if a client force-inverts the page.
  - The script logs SHA-256 of the source before and after and fails if it changed.
  - Add `public/email/ASSETS.md` recording source file, source SHA-256, output SHA-256, dimensions and the regeneration command.
  - Check the result at 1x and 2x on white for halos, fringing or softness.
  - **PNG only.** Never SVG or WebP.
- Image tag: absolute HTTPS URL from `EMAIL_ASSET_BASE_URL`, explicit `width` and `height`, `alt="MEDDY GLOBAL SOLUTIONS LTD"`, `display:block`, `border:0`, no base64, no CID.
- **This is the only image in any email** (it helps deliverability; see Section 7). Footer contact links are **text, not icons**.
- Note for the report: the logo URL resolves only once the production domain is live and public (not behind Vercel deployment protection). With images blocked, the header must still look intentional.

### 3.3 Palette (one token file: `src/lib/email/tokens.ts`)
Contrast ratios below were calculated (WCAG relative luminance). **Recompute all of them in your own check and report the table.** Body text and links must reach **4.5:1**, large text 3:1.

| Role | Value | Measured contrast |
|---|---|---|
| Page background | `#F5FAFC` | n/a |
| Card / header surface | `#FFFFFF` | n/a |
| Hairline border | `#E4EDF2` | n/a |
| Heading text | `#20262B` on white | 15.3:1 |
| Body text | `#3A444C` on white | 9.9:1 |
| Muted text | `#5A6872` on white / on `#F5FAFC` | 5.7:1 / 5.5:1 |
| Decorative accent (rule, card edge) | `#0CA3DC` | **never for text on white (2.9:1)** |
| Link blue and card label blue | `#076E9C` on white / on `#F5FAFC` | 5.7:1 / 5.4:1 |
| Button | fill `#076E9C`, white bold 16px text | 5.7:1 |
| Info card | bg `#F5FAFC`, 1px `#E4EDF2` border, 3px left border `#0CA3DC` | n/a |
| Footer band | `#20262B` | n/a |
| Footer text / muted / links | `#FFFFFF` / `#B8C4CC` / `#7FD3F2` | 15.3 / 8.6 / 9.1:1 |

Do not use `#087FB5` for text or buttons (4.46:1 on white, below AA). The existing `route.ts` uses `#0EA5E0`, which is not a brand token; normalize it and note it in the report.

### 3.4 Layout and typography
- Single column, **600px max width**, fluid below, comfortable at 360px. Container radius 12px with 1px border; Outlook desktop ignores radius, so the square fallback must also look finished.
- Structure: header band (logo alone) and blue rule; greeting; intro; optional info card; closing; sign-off; **dark footer contact block**.
- Fonts: headings `Manrope, Arial, Helvetica, sans-serif`; body `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. Do not depend on web fonts.
- Scale (tune after viewing): greeting 18px/700; body 15-16px, line-height 1.6; info-card label 11px uppercase, 1.5px letter-spacing; rows 14-15px; footer 13px.
- Info card rows: two-column table (label about 38%) that stacks on narrow screens; long values wrap.
- Button: **bulletproof** (padded table cell), pill-shaped like the website buttons, 44px minimum tap height.
- Hidden **preheader** on every template: short, plain, no padding spam beyond what is needed to stop clients appending body text, and the **only** `display:none` text in the email.

### 3.5 Footer contact block (binding content)
A solid `#20262B` band at the bottom of every client-facing email (T1, T3, T4, S1 variant). Heading line: `Get in touch`. Four entries, each a small uppercase muted label above a link in `#7FD3F2`, in a two-column layout on desktop that **stacks to one column on phones**, every link with a minimum 44px touch height:

| Label | Value shown | Link |
|---|---|---|
| `Visit us at` | `www.meddyglobalsolutions.com` | `siteUrl` |
| `Call us` | the display `phone` | `tel:` + `phoneRaw` |
| `WhatsApp` | `Message us on WhatsApp` | `whatsappUrl` |
| `Email us` | `info@meddyglobalsolutions.com` | `mailto:` |

Below them, a line with the office: `5B, Olushola Agbaje Street, Off Road 13, beside Ascon Fueling, Lekki, Lagos, Nigeria` with a `View on map` text link to `address.googleMapsUrl`. Then a muted line: `MEDDY GLOBAL SOLUTIONS LTD` and, on automated emails only, `This is an automated message. You can reply to it and our team will see your reply.`

Rules: values come from `EMAIL_CONTACT` only; phone number is **visible text as well as a link**; style the links explicitly so Apple Mail and Gmail do not restyle auto-detected numbers and addresses; no icon images; no emoji; no social links; no tagline. T2 (internal) uses a short internal footer instead.

### 3.6 Dark mode (be honest about what is controllable)
- Declare light: `<meta name="color-scheme" content="light">` and `<meta name="supported-color-schemes" content="light">` plus CSS, so clients that respect it leave the email alone.
- Some clients (Gmail apps, Outlook mobile) force-invert anyway. Defend: every cell has an explicit `bgcolor` and inline background; no transparent images; no inherited text colors; the logo is the opaque-white PNG.
- Simulate an inverted rendering in previews and fix anything unreadable. State that real-client dark mode was only simulated.

---

## 4. TEMPLATE CONTENT (use this copy; do not invent more)

Missing optional values omit their row. Never print "undefined" or an empty label. Avoid exclamation marks, ALL-CAPS words (the company name is the only exception) and sales language.

### T1. Enquiry Acknowledgement
- **Subject:** `We have received your enquiry | MEDDY GLOBAL SOLUTIONS LTD`
- **Preheader:** `Our team will review your message and reply by email.`
- **Greeting:** `Dear {firstName},` (fallback `Dear Client,` if the name is unusable)
- **Intro:** `Thank you for contacting MEDDY GLOBAL SOLUTIONS LTD. We have received your enquiry, and our technical operations team will review it and reply to you by email.`
- **Info card `ENQUIRY SUMMARY`:** Enquiry category (validated against the allowlist, Section 8.2); Submitted (`Africa/Lagos`, `en-NG`, e.g. "11 Nov 2026, 14:05 WAT"); Received by `MEDDY GLOBAL SOLUTIONS LTD`; optional enquiry reference only if the identical value also appears in T2.
- **Closing:** `If you would like to add any detail to your enquiry, simply reply to this email. If you need to reach us sooner, you can also call or message us on WhatsApp using the details below.`
- **Safety line (small):** `If you did not make this enquiry, you can safely ignore this message.`
- **Sign-off:** `Best regards,` then bold `MEDDY GLOBAL SOLUTIONS LTD`, then the footer contact block.
- **Do not echo the visitor's message text** (Section 8.3).

### T2. Internal Enquiry Notification
- Subject: `[Web Enquiry] {category} | {name}` (sanitized).
- Same layout, label `WEB ENQUIRY`. Rows: Full name, Client email (mailto), Category, Received (`Africa/Lagos`). Separate inset block with the **escaped** message, line breaks preserved. A `Reply to client` button (safely encoded `mailto:`). Short internal footer: sent from the website contact form.

### T3. Client Document Delivery
- **Subject:** `{documentType} from MEDDY GLOBAL SOLUTIONS LTD` plus ` | {projectName}` if given.
- **Preheader:** `Your {documentType} is attached.`
- **Greeting:** `Dear {clientName | "Client"},`
- **Intro:** `Please find attached the {documentType} we have prepared for you.`
- **Info card `DOCUMENT INFORMATION`:** Sender `MEDDY GLOBAL SOLUTIONS LTD`; Project Name; Format (`Quotation | Proposal | Report | Invoice | Letter | Other`); optional Reference; optional Date.
- **Closing:** `If you have any questions or would like any adjustments, please reach out to us directly by replying to this email or using the details below.`
- Attachments: PDF only by default; validate type, count and total size well under the provider limit. **No bank details and no "Pay now" links** in the body (invoice-style emails are a common phishing pattern and a spam trigger; the attachment carries the details).

### T4. Owner Custom Message
See Section 6.

---

## 5. TECHNICAL REQUIREMENTS

### 5.1 Approach
- Stack: Next.js 15, React 19, Tailwind 4. **Do not use Tailwind or `next/image` in emails.**
- **Default: no new runtime dependency.** Typed TypeScript template functions returning `{ subject, html, text, headers }`. If a library (e.g. React Email) is clearly better, justify in writing and wait for my approval. A test-runner **devDependency** (e.g. `tsx`) is acceptable if Node's built-in `node:test` cannot run the TypeScript; justify it.
- Structure:
  ```
  src/lib/email/
    tokens.ts          // palette, fonts, sizes, EMAIL_CONTACT allowlist, asset URLs
    escape.ts          // escapeHtml, escapeAttr, stripCRLF, safeUrl, nl2br
    layout.ts          // doc shell: meta, preheader, header band, container
    components.ts      // infoCard, button, paragraph, signOff, contactFooter
    compose.ts         // owner-message parser and renderer (Section 6)
    lint.ts            // deliverability lint (Section 7.4)
    templates/         // enquiryAcknowledgement, enquiryNotification, documentDelivery, ownerMessage
    send.ts            // thin Resend wrapper via fetch, env-driven, honest errors
    __tests__/         // escaping, contact consistency, lint, template smoke tests
  src/app/admin/       // login and compose pages (Section 6B)
  src/app/api/admin/   // login, logout, preview, send handlers (Section 6B)
  src/lib/admin/       // session, password hashing, CSRF, throttling, env validation
  middleware.ts        // redirect convenience only; not the security boundary
  public/email/        // meddy-logo.png, ASSETS.md
  scripts/             // build-email-assets.mjs, render-email-previews, email-compose, email-send-document
  email-signature/     // signature.html, README.md
  ```
- **Email-client rules:** table layout (`role="presentation"`, `cellpadding`, `cellspacing`, `border="0"`), essential styles inline, `bgcolor` plus CSS, `<!DOCTYPE html>`, `lang="en"`, charset and viewport metas, MSO conditional comments where needed, no flexbox/grid/JS/forms/iframes, no essential background images, `-webkit-text-size-adjust:100%`, balanced valid markup, `<title>` set.
- **Always send a good plain-text alternative** with the same information and the same contact block (as plain lines, URLs written out).
- Total HTML under about **100 KB** (Gmail clips near 102 KB); aim for under 40 KB.

### 5.2 Integration into the contact API
- Refactor `route.ts` to build T2 with the new system. **Preserve** all existing validation, honeypot, gibberish checks, status codes and user-facing messages.
- After the internal notification is accepted by the provider, send T1 to the visitor, **best effort**: if T1 fails, log a minimal safe message and still return success, because the enquiry itself was delivered. If the internal notification fails, keep the honest 502. **Never return success unless the provider accepted the internal message.**
- Sender: `from` is built from `EMAIL_FROM` (default `MEDDY GLOBAL SOLUTIONS <info@meddyglobalsolutions.com>`); the display name is what shows in the inbox. `reply_to` is `info@meddyglobalsolutions.com` for client-facing emails and the visitor's address for T2. The existing `enquiries@meddyglobalsolutions.com` sender stays only if I confirm that address exists. Everything comes from env vars with documented defaults.
- T3: server-only function plus CLI. **No public HTTP endpoint that sends arbitrary email.**

---

## 6. OWNER CUSTOM MESSAGES (T4): "I type, it looks professional"

When the domain owner writes their own message, the system formats it professionally. **It must never rewrite, reword, "improve", shorten or add claims to the owner's words.** It formats; it does not edit.

### 6.1 Input
A plain text or Markdown file (and optionally stdin) with a small header block:

```
to: client@example.com
toName: Mr. Adewale Okafor
subject: Site visit schedule for next week
senderName: <optional>
senderTitle: <optional>
attachments: <optional, PDF paths>
---
Body text starts here...
```
Validate every header (single recipient, valid address, subject required, 5 to 150 characters after sanitizing). Optional `cc`, at most 3. `bcc` to the archive mailbox (`EMAIL_ARCHIVE_BCC`) so the owner keeps a copy.

### 6.2 Body formatting rules (deterministic)
Supported: paragraphs (blank line separated), single line breaks, one optional `## Heading`, bullet lists (`- item`), numbered lists (`1. item`), `**bold**`, `[text](https://...)` links and bare `https://` URLs auto-linked. **Everything else is escaped as text. Raw HTML is never allowed.** Collapse more than two blank lines, trim trailing spaces, keep the owner's wording and punctuation exactly, allow long words and URLs to wrap.

### 6.3 Professional defaults (added only when missing)
- If the body does not start with a greeting (`Dear`, `Hello`, `Hi`), add `Dear {toName},` or `Dear Client,`.
- If the body does not end with a sign-off, add `Best regards,`.
- Signature block: `senderName` and `senderTitle` if given, then `MEDDY GLOBAL SOLUTIONS LTD`, then the standard footer contact block.
- Do not add a call-to-action button unless the header contains `cta` (`label` and an `https://` url).

### 6.4 Safety and quality gates (run before any send)
- Escaping rules from Section 8. `safeUrl` for every link.
- **Lint** (Section 7.4) on subject and body. **Warnings** are printed with the exact phrase and line; **errors** (for example a URL shortener, a non-allowlisted scheme, an all-caps or exclamation-mark subject) block sending unless `--force` is passed.
- Attachments: PDF only, size checked, count checked.

### 6.5 Commands (developer tool; the owner uses the page in Section 6B)
```
npm run email:compose -- message.md              # default: preview only, writes HTML and text to /qa/email/previews/, prints a summary
npm run email:compose -- message.md --send --confirm   # sends; refuses without --confirm
```
The preview summary shows: from, to, cc, bcc, subject, attachment names and sizes, HTML size, and lint results. Sending requires `--confirm`.

### 6.6 For messages typed directly in webmail
Deliver **S1**: `email-signature/signature.html`, a table-based branded signature (logo alone, sender name and title placeholders, company name, phone, WhatsApp, email, website, address line), under 15 KB, using the same hosted PNG and the same `EMAIL_CONTACT` values, plus `README.md` explaining how to paste it into the mailbox's webmail signature settings (use Namecheap's current Private Email documentation for exact menu names; do not guess them).

The secure compose page is **approved and required**; it is specified in Section 6B. The CLI in 6.5 remains as a developer tool.

---

## 6B. SECURE OWNER COMPOSE PAGE (`/admin/compose`): BUILD IT

**Decision made by the owner:** a login-protected page on the website where the client signs in with his email and a password and sends branded custom messages from his phone or computer. The client will receive these credentials, so this page can send email as MEDDY and is a **high-value target**. Treat it as security-critical software. Prefer fewer features done safely.

### 6B.1 Scope
- Routes: `/admin/login`, `/admin/compose`; API: `POST /api/admin/login`, `POST /api/admin/logout`, `POST /api/admin/preview`, `POST /api/admin/send`. All route handlers use `export const runtime = "nodejs"`.
- It reuses `compose.ts` (Section 6.2 to 6.4), the template system, the lint and `send.ts`. **Preview and send must use the same renderer**, so what the client previews is exactly what is sent.
- **No new dependencies.** Use Node's built-in `crypto` (route handlers) and Web Crypto (middleware). If you believe a dependency is truly required (for example shared storage for rate limits), stop and ask me.

### 6B.2 Accounts and configuration (fail closed)
Small allowlist of users (up to 3: the client, and optionally me) from env vars, **no database**:

| Env var | Purpose |
|---|---|
| `ADMIN_COMPOSE_ENABLED` | Must equal `"true"`, otherwise every `/admin/*` and `/api/admin/*` route returns 404. This is the instant kill switch. |
| `ADMIN_USERS` | JSON array of `{ "email", "passwordHash", "name", "title" }`. `name` and `title` fill the signature automatically. |
| `ADMIN_SESSION_SECRET` | At least 32 random bytes (base64). Signs session cookies. |
| `SESSION_VERSION` | Integer inside the signed cookie. Increase it to invalidate every session at once. |
| `ADMIN_DAILY_SEND_LIMIT` | Default 25. |

If any required value is missing, malformed or too short, the admin routes **fail closed** (generic 503, no details to the browser, a clear server log line). **Never fall back to a default secret or default password.** Never commit real values; document placeholders in `.env.example` only.

### 6B.3 Password handling
- Hash with `crypto.scrypt` (per-user random salt, at least N=2^15, r=8, p=1), stored as a self-describing string such as `scrypt$N$r$p$<salt>$<hash>`. Compare with `crypto.timingSafeEqual`.
- Provide `npm run admin:hash-password` (hidden input, never echoes) that prints the hash for `ADMIN_USERS`, plus a `--generate` option that creates a strong random password (at least 16 characters, no look-alike characters) and prints it once with the hash.
- Plaintext passwords are never stored, logged or committed.
- On login, **always perform a hash comparison**, even for an unknown email (compare against a dummy hash), so timing does not reveal which emails exist.
- Generic failure message: `Incorrect email or password.` (never say which part was wrong).

### 6B.4 Sessions
- Signed, stateless cookie: HMAC-SHA256 over `{ userId, issuedAt, expiresAt, sessionVersion }`. Name `__Host-meddy_admin`, `Secure`, `HttpOnly`, `SameSite=Strict`, `Path=/`, no `Domain`. (Use a non-`__Host-` name only on `localhost`, where `Secure` cannot apply; document it.)
- Idle timeout 2 hours (reissue the cookie on activity) and absolute lifetime 12 hours. Log out clears the cookie. Verify signature with constant-time comparison. Reject expired, tampered or old-version cookies.
- Because sessions are stateless they cannot be revoked one by one; the `SESSION_VERSION` bump and `ADMIN_COMPOSE_ENABLED` are the revocation tools. Say so in the handover document.

### 6B.5 Defense layers (all required)
1. **Middleware** (`middleware.ts`, Edge runtime, Web Crypto only) redirects unauthenticated visits to `/admin/login`. **It is a convenience, not the security boundary.** Next.js has had middleware-bypass vulnerabilities (for example CVE-2025-29927), so **every admin page and every admin API handler must independently verify the session** on the server and reject with 401 if invalid.
2. **CSRF:** all POSTs require a same-origin `Origin` (or `Referer`) match **and** a per-session CSRF token sent in a header (derive it from the session with HMAC; do not store tokens in localStorage).
3. **Login throttling:** per-IP and per-email. After 5 failures in 15 minutes, apply a cooldown (state the values you choose). Add a small constant artificial delay to failed attempts. Log failures (timestamp, hashed IP, no passwords, no full emails).
4. **Rate limiting storage honesty:** serverless functions cannot rely on in-memory counters. Document and recommend Vercel Firewall rate-limit rules on `/api/admin/*` as the primary control; implement the in-code limits as best-effort defense in depth and say so. If durable shared storage (for example Vercel KV or Upstash from the Vercel Marketplace) would make the limits reliable, **recommend it and wait for my approval**; do not add it yourself.
5. **Response headers** for `/admin/*` and `/api/admin/*`: `Cache-Control: no-store`, `X-Robots-Tag: noindex, nofollow, noarchive`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, a restrictive `Permissions-Policy`, and a strict Content-Security-Policy (nonce-based if you can wire it cleanly with the existing Next setup; otherwise the strictest policy that works, and report the limitation). **You are authorized to add a `headers()` entry to `next.config.ts` for these two path patterns only.** Do not change anything else in `next.config.ts` (including `ignoreBuildErrors`).
6. **Discoverability:** `<meta name="robots" content="noindex, nofollow">` on admin pages; add `/admin/` to the disallow list in `src/app/robots.ts` (only that change); keep it out of the sitemap; **no link to it anywhere on the public site**.
7. **No secrets in the browser:** no auth tokens in localStorage or sessionStorage; no secret env var referenced by client code. Verify by searching the production build output for the names and values of the secret env vars.
8. **Dependency and framework hygiene:** the lockfile currently pins Next 15.5.29 and React 19.3.1. Run `npm audit`, check the official Next.js and React security advisories for the versions in use, and report exactly what you found. Do not upgrade major versions; propose any needed patch upgrade and wait for my approval.

### 6B.6 Sending safeguards
- `From` is fixed to `EMAIL_FROM`; `Reply-To` is `info@meddyglobalsolutions.com`. The user **cannot** set From, Reply-To or any header. No HTML mode.
- One `To` recipient, at most 3 `CC`. **Always BCC `EMAIL_ARCHIVE_BCC`** so every sent message is kept in the company mailbox (this is the audit trail, since there is no database).
- Subject 5 to 150 characters; body up to 20,000 characters; PDF attachments only, up to 3 files. **Check Vercel's current serverless request-body limit in its documentation** (historically about 4.5 MB) and set the total attachment limit safely below it (about 3 MB), explaining it in the UI.
- Daily limit (`ADMIN_DAILY_SEND_LIMIT`, default 25) and a per-minute throttle, with clear messages when reached.
- The same escaping, formatting rules and lint as the CLI. **Lint errors block sending in the UI with no override**; warnings are shown with the exact phrase and the option to edit.
- Structured server log per send: timestamp, user, recipient domain only, subject length, provider message ID, result. **Never log the body or the full recipient address.**
- Show friendly errors; never display provider error text, stack traces or secrets in the browser.

### 6B.7 UX specification (mobile-first, because the client will likely use a phone)
- Visual style consistent with the website (MEDDY palette, Manrope headings, Inter body) but a **clean utility interface**: header with the logo alone and a `Sign out` button; no marketing visuals.
- **Login page:** email, password (with show/hide), `Sign in` button, generic error area, cooldown message, no "forgot password" (see handover).
- **Compose page:** fields `To (name)`, `To (email)`, optional `CC`, `Subject`, `Message`, and optional `Attach PDF`. A short collapsible "Formatting help" panel (paragraphs, bullets, bold, links) and a three-button toolbar (Bold, Bullet list, Link) that inserts the syntax.
- **Live preview** of the exact branded email: side by side on desktop, a `Write` and `Preview` tab on phones. Render it in a `sandbox`ed `iframe` using `srcdoc` from the server-rendered HTML (debounced call to `/api/admin/preview`). Show the subject, the from and to lines and the lint results above the preview.
- `Send` opens a confirmation dialog summarizing recipient, CC, subject and attachment names. States: idle, previewing, sending (button disabled, spinner, `aria-live` status), success (time and message ID, button `Write another`), error (friendly text). Warn before leaving with unsent text. Do not store drafts on the server.
- Accessibility: real labels, visible focus, keyboard operation, AA contrast (use the Section 3.3 tokens), 44px touch targets, `prefers-reduced-motion` respected, no layout shift when the keyboard opens on mobile.
- No new UI dependency. Use the project's existing Tailwind and components.

### 6B.8 Credential handover guide (`ADMIN-HANDOVER.md`) and client guide (`CLIENT-GUIDE.md`)
**`ADMIN-HANDOVER.md` (for me, the developer):**
- Exactly what the client receives, in **two separate logins**: (1) his **mailbox** login for `info@` in webmail (to read and reply), and (2) the **compose page** URL, his email and his generated password. Deliver the password through a different channel from the link and the username, ideally a password-manager share link, and ask him to store it in a password manager.
- **Never give the client:** the Namecheap account, DNS access, the Resend account or API key, the Vercel account, GitHub, or any environment variable.
- Steps to create his account: run `admin:hash-password --generate`, put the hash and his name and title into `ADMIN_USERS`, set the other env vars in Vercel, redeploy, test the login myself first.
- Password change: he cannot self-change the compose-page password (no database); I rotate it by generating a new hash, updating `ADMIN_USERS`, bumping `SESSION_VERSION` and redeploying. State this limitation plainly. For his mailbox password he changes it in webmail himself.
- **If compromise is suspected:** set `ADMIN_COMPOSE_ENABLED=false`, bump `SESSION_VERSION`, rotate the compose password and the Resend API key, review the archive mailbox and the Resend sending logs, then re-enable.
- Pre-launch checklist: env vars set, kill switch tested, a wrong password tested, rate-limit rule added in the Vercel Firewall, archive BCC verified, a test message received at Gmail with SPF, DKIM and DMARC passing.

**`CLIENT-GUIDE.md` (plain language, one page, for the client):** how to sign in, write a message, use formatting, preview, attach a PDF, send, what the red errors and yellow warnings mean, the daily limit, how to sign out, what to do if the page says it cannot send, and who to contact. No technical jargon, no screenshots of secrets.

---

## 7. DELIVERABILITY: ENGINEER OUT EVERY AVOIDABLE SPAM SIGNAL

### 7.1 Authentication (a precondition; document it, you cannot configure DNS)
- The `From` domain must be the authenticated domain (`meddyglobalsolutions.com`). Never send from a Gmail address or an unverified domain.
- SPF, DKIM and DMARC must all pass and **align** with the `From` domain. DKIM must be the signing-domain match.
- Verify by sending to a Gmail address and reading "Show original": SPF, DKIM and DMARC must each say PASS. I will do this; give me the exact checklist.

### 7.2 Content hygiene (enforced in code)
- **Real text, one tiny image.** The logo is the only image; the message is real text. Never image-only content.
- Links only to: the site domain, `wa.me`, `tel:`, `mailto:`, and the Google Maps link from `siteContent`. No URL shorteners, no tracking-redirect links, no raw IP links, no mismatched link text and destination.
- At most about 6 links per email.
- Subject: 6 to 60 characters, sentence or title case, **no ALL CAPS words (except the company name), no `!`, no `$`/`£`/`₦` price bait, no emoji, no "RE:"/"FWD:" tricks**, no spammy phrases (maintain a list in `lint.ts`, for example: free, urgent, act now, limited time, guarantee, winner, click here, 100%, risk-free, no obligation, congratulations, cash, earn).
- Body: normal sentence case, no repeated punctuation, no hidden text other than the single preheader, no tiny fonts (minimum 12px), no color-on-same-color text, no JavaScript, forms, iframes, embeds or external CSS.
- Always include the physical address (it is in the footer).
- Valid, balanced HTML, a `<title>`, `alt` on the image, and a plain-text part that mirrors the HTML.
- No attachments on T1 or T2. Attachments on T3 and T4 are PDF only.

### 7.3 Headers and provider settings
- Consistent `From` name and address across all client emails; real `Reply-To`.
- **T1 (auto-acknowledgement):** add headers `Auto-Submitted: auto-generated` and `X-Auto-Response-Suppress: All` so mailbox auto-replies cannot create loops.
- Do **not** add a fake `List-Unsubscribe` (these are transactional or one-to-one messages).
- **Open and click tracking must be OFF** for this domain in Resend (tracking pixels and rewritten links hurt deliverability). Put "verify tracking is off in the Resend domain settings" in the setup guide, since you cannot check it.
- Pass any custom headers through the provider's `headers` field and sanitize values (no CR/LF).

### 7.4 Automated lint
Create `src/lib/email/lint.ts` and run it in the preview script, in the tests, and in the compose command. It checks: subject rules, spam-phrase list, link allowlist and count, image count (exactly one), `alt` present, plain-text part exists and contains the contact values, HTML size, no `display:none` except the preheader, no external CSS or scripts, balanced tags, minimum font size, contrast pairs from the token file, and the contact consistency test (Section 2.2). Output a clear report; any **error** fails the script.

### 7.5 Sending behavior
Start low volume and send only wanted, expected mail. Handle provider errors honestly. Rate limit by IP and by recipient (Section 8.3) so the form cannot be used to send repeated mail to one person. Note that bounce and complaint webhooks are a recommended later step and out of scope.

### 7.6 Honest limit
You cannot test real inbox placement. In the report, say what lint proves (the message has no detectable spam signals in its content and structure) and what only real sending proves (domain reputation and provider filtering). Provide a manual seed-test checklist: Gmail, Outlook.com and an Apple Mail account, checking Inbox versus Spam, "Show original" authentication results, and rendering on a phone.

---

## 8. SECURITY (fix the real issues in the current code)

### 8.1 Output encoding
Every dynamic value is escaped for its context. Minimum helpers in `escape.ts`:

```ts
const MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
export const escapeHtml = (v: unknown): string => String(v ?? "").replace(/[&<>"'`]/g, (c) => MAP[c]);
export const escapeAttr = escapeHtml;
export const stripCRLF = (v: unknown): string => String(v ?? "").replace(/[\r\n\u2028\u2029\0]+/g, " ").trim();
export const nl2br = (escaped: string): string => escaped.replace(/\r?\n/g, "<br>");
export function safeUrl(u: string, allowed = ["https:", "mailto:"]): string | null {
  try { const x = new URL(u); return allowed.includes(x.protocol) ? x.toString() : null; } catch { return null; }
}
```
Rule: message text is `nl2br(escapeHtml(message))`. Tests must prove that `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`, `javascript:alert(1)` and `</td><td>` payloads in name, email, subject, message and owner-composed bodies render inert in HTML and text. `tel:` links are produced only from `EMAIL_CONTACT`, never from user input, so `safeUrl` never allows `tel:` by default.

### 8.2 Input validation and header injection
- Cap lengths: name 100, subject 150, message 5,000, email 254. Require `Content-Type: application/json`. Reject oversized bodies. Strip CR/LF/NUL from anything used in a subject or header.
- **Subject allowlist:** only values from the form's fixed list, derived from `siteContent` on the server; anything else becomes "General Industrial Engineering Enquiry".
- Tighten the email check (single `@`, valid domain label, no whitespace or control characters); lowercase the domain.
- Same-origin check on the POST. Replace `new Date().toUTCString()` with a Lagos-time formatter.

### 8.3 Abuse prevention and backscatter
T1 goes to an address a stranger typed, so the form could be abused to spam a third party. Layer the defenses and say what each does and does not protect:
1. Keep the honeypot.
2. Do not echo user content in T1; never render user-supplied URLs in it; keep the "if you did not make this enquiry" line.
3. **Rate limiting:** serverless functions cannot rely on in-memory counters. Recommend and document a Vercel Firewall rate-limit rule on `/api/contact`, and add a lightweight in-code per-IP and per-recipient guard only as best-effort defense in depth, with the limits stated. No paid service or dependency without asking me.
4. Optionally a minimum-time-to-submit check if it does not break the existing form.

### 8.4 Secrets and logging
`RESEND_API_KEY` server-side only. Never log keys. Do not log full message bodies; log request IDs and error classes. Gate the current no-key branch logging behind `NODE_ENV !== "production"`.

### 8.5 Claims
Do not claim a security audit. List residual risks.

---

## 9. SENDING DOMAIN AND MAILBOX (document; you cannot do it)

The owner uses **Namecheap** (domain, DNS and Private Email mailbox) and **Resend** for website email, with the site on **Vercel**. You cannot buy domains, create mailboxes or edit DNS. Produce `/EMAIL-SETUP.md` with step-by-step instructions, verifying every provider-specific value against the providers' **current official documentation** (search it; do not rely on memory; do not invent record values). It must cover, in this order:

1. Create the `info@` mailbox in Namecheap Private Email; enable two-factor on the Namecheap account.
2. Namecheap Advanced DNS, Mail Settings **Custom MX**, then the root records for Private Email: two MX records (`mx1.privateemail.com`, `mx2.privateemail.com`, priority 10), the single root SPF TXT record (`v=spf1 include:spf.privateemail.com ~all`), and the Private Email DKIM TXT record (host name depends on purchase date: `privateemail._domainkey` for plans bought on or after 2 June 2026, `default._domainkey` for older plans; copy exactly what Namecheap shows).
3. Resend: add the domain, add the three records Resend shows (MX and SPF TXT on the `send` host, DKIM TXT on `resend._domainkey`), pasting **only the short host name** (not the full domain); use a different MX priority if 10 is already used (Namecheap's priority column is unlabeled, the empty column after Value); verify; create a sending-only API key limited to the domain; **confirm open and click tracking are off**.
4. Explain that there must be **exactly one SPF record at the root**, and why the Resend SPF on the `send` host does not conflict.
5. DMARC: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:info@meddyglobalsolutions.com`, then tighten to `quarantine` and later `reject` after reviewing reports for a few weeks.
6. Website on Vercel: add the domain in Vercel, add the web records in Namecheap, **do not switch to Vercel nameservers** (it would remove the mail records).
7. Vercel env var names (names only): `RESEND_API_KEY`, `CONTACT_RECIPIENT`, `EMAIL_FROM`, `EMAIL_ASSET_BASE_URL`, `EMAIL_ARCHIVE_BCC`, `ADMIN_COMPOSE_ENABLED`, `ADMIN_USERS`, `ADMIN_SESSION_SECRET`, `SESSION_VERSION`, `ADMIN_DAILY_SEND_LIMIT`, plus any you add. Redeploy after changing them. Document how to generate each secret safely.
8. Switching `CONTACT_RECIPIENT` from the current Gmail address to the new domain mailbox safely.
9. How the sender appears in inboxes (display name and subject from headers, logo in the body, avatar is the client's default unless BIMI with a verified mark certificate, which is optional and later).
10. The seed-test checklist from Section 7.6 and a "what to do if mail lands in spam" troubleshooting list.

---

## 10. VERIFICATION (evidence only; never claim what you did not run)

1. `npx tsc --noEmit` (required, since the build ignores type errors), `npm run build`, the email tests and the lint. Report exact results. Do not report project lint as passed.
2. `node tools/verify_protected_files.js` before and after; nothing protected may change. Do not edit that script.
3. Preview renderer writing every template (T1, T2, T3, T4, S1) with realistic sample data to `/qa/email/previews/`, plus edge cases: very long name, long unbroken email, missing optional fields, diacritics (Igbo, Yoruba names), hostile payloads, 5,000-character message, owner message with every supported formatting feature and one with only plain text.
4. Screenshots at **600px** and **375px**, a **simulated inverted/dark** rendering and an **images-blocked** state, saved to `/qa/email/screenshots/`. Review the header and footer against the website's own header and footer for brand consistency.
5. Verify: logo has nothing around it; contrast table; all contact links work (`tel:`, `wa.me`, `mailto:`, site, map) and match `EMAIL_CONTACT`; footer stacks cleanly on phone width; HTML size; plain-text output; escaping tests; lint passes.
6. **Compose page security tests (automated where possible):** wrong password; unknown email (same response and similar timing); missing or short env values fail closed; kill switch returns 404; tampered, expired and old-`SESSION_VERSION` cookies rejected; missing or wrong CSRF token and wrong `Origin` rejected; admin APIs return 401 without a session even if middleware is bypassed; throttling works; lint errors block sending; header injection and hostile HTML payloads inert; `/admin` has `noindex`, is in `robots.ts` disallow and absent from the sitemap; no secret appears in the client bundle; `npm audit` result and the Next and React advisory check reported.
7. **Compose page UX checks:** screenshots at 375px, 768px and 1280px for login, compose, preview, confirmation, success and error states; keyboard-only run-through; screen-reader labels; verify the previewed HTML is byte-identical to what is sent.
8. State plainly what you could **not** verify: real Gmail, Outlook desktop and Apple Mail rendering, live DNS, real inbox placement, and any penetration-test-level assurance (you have not performed a security audit). Give me a short manual test script.

---

## 11. DELIVERABLES

Template system, assets and build script, refactored contact route, the secure compose page (`/admin/login`, `/admin/compose`, admin API routes, middleware, `admin:hash-password` script, `.env.example`), the owner CLI composer with `package.json` entries, the webmail signature, `ADMIN-HANDOVER.md` and `CLIENT-GUIDE.md`, deliverability lint, tests, `EMAIL-SETUP.md`, `/qa/email/` evidence, a README section on editing copy and tokens, adding a template and composing a custom message (with a worked example file), and updates to `CONTENT-REQUIRED.md` (mailbox confirmed, Resend key, live domain, and the superseded no-phone directive).

## 12. FINAL REPORT (format from `AGENTS.md`)

Outcome; design decisions (light letterhead, logo alone, contrast table, token normalization, footer contact block); engineering changes and dependencies added or avoided; exact commands with pass, fail or blocked; the deliverability measures and their honest limits; the `ignoreBuildErrors` finding; residual risks; and a **"things only I can do"** list (confirm domain, create the mailbox, add Namecheap DNS records, verify Resend and confirm tracking is off, set env vars, run real seed tests, paste the signature into webmail, generate the client's password hash and set the admin env vars, add the Vercel Firewall rate-limit rule, hand the credentials to the client through separate channels).

## 13. HARD DON'TS

No tile, badge, circle, box, outline or effect around the logo. No wordmark beside it. No icon images or emoji. No modification of protected files or `tools/verify_protected_files.js`. No hardcoded contact details. No social links, tagline, bank details or invented claims. No unescaped input. No raw HTML from any message. No base64, SVG or WebP logos. No tracking pixels or link tracking. No URL shorteners. No public send endpoint. No rewriting of the owner's words. No success message unless the provider accepted the email. No hardcoded, default or committed credentials or secrets. No authentication that relies only on middleware or only on client-side checks. No tokens in localStorage. No user-settable From, Reply-To or headers. No lint override in the UI. No public link to `/admin`. No claim of guaranteed inbox delivery. No completion claim while any required check or security fix is outstanding.
