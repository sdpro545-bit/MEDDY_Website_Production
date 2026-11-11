# MEDDY GLOBAL SOLUTIONS LTD — Executive Admin & Portal Handover

This document contains security architecture specifications, credential creation and rotation procedures, and deployment instructions for the MEDDY Owner Compose Portal and branded email system.

---

## 1. Security Architecture & Threat Model

The Admin Compose Portal (`/admin/login` and `/admin/compose`) is designed with a defense-in-depth, fail-closed security model:

1. **Fail-Closed Gatekeeper (`middleware.ts`)**:
   - If `ADMIN_COMPOSE_ENABLED !== "true"`, all `/admin/*` routes return an immediate `404 Not Found`. An attacker cannot even detect the portal's existence.
   - If enabled, non-authenticated requests to `/admin/compose` or `/api/admin/*` are intercepted and redirected to `/admin/login` (or rejected with `401 Unauthorized`).
   - If required server secrets (`ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD_HASH`) are missing or improperly configured, the portal fails safely with `503 Service Unavailable` and logs the issue server-side without leaking configuration details.

2. **Credential Authentication (`src/lib/admin/auth.ts`)**:
   - **Password Storage**: Stored exclusively as an **scrypt** cryptographic hash formatted as `scrypt$N$r$p$salt$hash`.
   - **Timing-Attack Defense**: Password comparisons utilize `crypto.timingSafeEqual`. Failed username lookups execute a dummy scrypt verification against a constant pre-computed hash to eliminate timing side-channels.
   - **Brute-Force Rate Limiting**: In-memory IP throttle allows a maximum of **5 failed login attempts per 15-minute window**. Exceeding this limit locks out the IP with `429 Too Many Requests`.

3. **Session & CSRF Management**:
   - **Session Cookie**: `meddy_admin_session`, encrypted/authenticated with HMAC-SHA256, marked `HttpOnly; Secure; SameSite=Strict; Path=/`.
   - **Session Lifespan**: 8 hours maximum.
   - **CSRF Token**: Dual-token pattern (`meddy_admin_csrf`), verified on all mutating POST requests (`/api/admin/send`, `/api/admin/logout`).

4. **Outbound Protection & Hard Rate Limits**:
   - Outbound dispatch through the portal is throttled to a configurable ceiling (`ADMIN_DAILY_SEND_LIMIT=50` messages per day).
   - Recipient addresses are strictly validated against RFC 5322 regex.
   - Header injection is actively prevented by stripping `\r`, `\n`, `\0`, and Unicode line terminators.

---

## 2. Generating & Rotating Credentials

### Step 1: Generate Session Secret
Generate a cryptographically secure 256-bit random hex string:
```bash
# Using OpenSSL (bash / git bash):
openssl rand -hex 32

# Or using Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Set this value as `ADMIN_SESSION_SECRET` in your environment.

### Step 2: Generate Password Hash
To create or update the admin password:
```bash
node scripts/hash-password.mjs "YourSuperSecurePasswordHere"
```
The script will output a string similar to:
```text
scrypt$16384$8$1$6b92f7c2a1...$d58e391a0c4...
```
Copy the full string and set it as `ADMIN_PASSWORD_HASH` in your environment.

> [!CAUTION]
> Never commit plaintext passwords or active secrets to Git. Always configure them through the hosting provider dashboard (e.g. Vercel Environment Variables).

---

## 3. Emergency Kill-Switch

If unauthorized access is ever suspected or you wish to deactivate the executive compose portal:

1. In the Vercel Dashboard, go to **Settings** -> **Environment Variables**.
2. Change:
   ```env
   ADMIN_COMPOSE_ENABLED=false
   ```
3. Trigger a redeploy (or save).
4. All `/admin/*` routes will immediately return `404 Not Found`, cutting off all portal access.

---

## 4. Operational Maintenance & Monitoring

- **Active Audit Logs**: Review Vercel runtime logs for `[ADMIN AUTH]` and `[ADMIN SEND]` tags to audit login attempts and outbound dispatches.
- **Resend Dashboard**: Monitor bounce, delivery, and spam complaint rates at [https://resend.com](https://resend.com).
- **Deliverability Threshold**: Spam complaints should stay strictly under 0.05% (1 complaint per 2,000 sent emails).

