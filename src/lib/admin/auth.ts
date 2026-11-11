/**
 * MEDDY GLOBAL SOLUTIONS LTD — Admin Authentication & Session Management
 *
 * Scrypt password verification, constant-time comparisons, dummy hash timing defenses,
 * HMAC-signed stateless session cookies, and per-session CSRF tokens.
 */

import crypto from "node:crypto";
import { AdminConfig } from "./env";

export interface AdminSession {
  email: string;
  name?: string;
  title?: string;
  issuedAt: number;
  expiresAt: number;
  sessionVersion: number;
}

const SCRYPT_N = 32768; // 2^15
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;

// Precomputed dummy hash to prevent timing attacks when an unknown email is submitted
export const DUMMY_SCRYPT_HASH =
  "scrypt$32768$8$1$0123456789abcdef0123456789abcdef$0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (err, derivedKey) => {
        if (err) return reject(err);
        const hash = derivedKey.toString("hex");
        resolve(`scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${hash}`);
      }
    );
  });
}

export function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parts = storedHash.split("$");
      if (parts.length !== 6 || parts[0] !== "scrypt") {
        return resolve(false);
      }

      const N = parseInt(parts[1], 10);
      const r = parseInt(parts[2], 10);
      const p = parseInt(parts[3], 10);
      const salt = parts[4];
      const expectedKeyHex = parts[5];
      const expectedBuffer = Buffer.from(expectedKeyHex, "hex");

      crypto.scrypt(
        password,
        salt,
        expectedBuffer.length,
        { N, r, p },
        (err, derivedKey) => {
          if (err || derivedKey.length !== expectedBuffer.length) {
            return resolve(false);
          }
          const matches = crypto.timingSafeEqual(derivedKey, expectedBuffer);
          resolve(matches);
        }
      );
    } catch {
      resolve(false);
    }
  });
}

export function getCookieName(): string {
  return process.env.NODE_ENV === "production"
    ? "__Host-meddy_admin"
    : "meddy_admin_dev";
}

export function createSessionCookie(
  session: AdminSession,
  config: AdminConfig
): string {
  const jsonPayload = JSON.stringify(session);
  const b64Payload = Buffer.from(jsonPayload, "utf8").toString("base64url");
  const hmac = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(b64Payload)
    .digest("base64url");

  return `${b64Payload}.${hmac}`;
}

export function verifySessionCookie(
  cookieValue: string | undefined,
  config: AdminConfig
): AdminSession | null {
  if (!cookieValue) return null;
  const parts = cookieValue.split(".");
  if (parts.length !== 2) return null;

  const [b64Payload, signature] = parts;

  const expectedHmac = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(b64Payload)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedHmac, "utf8");

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const rawJson = Buffer.from(b64Payload, "base64url").toString("utf8");
    const session = JSON.parse(rawJson) as AdminSession;

    // Check session version
    if (session.sessionVersion !== config.sessionVersion) {
      return null;
    }

    // Check expiration
    const now = Date.now();
    if (session.expiresAt <= now) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function generateCsrfToken(session: AdminSession, config: AdminConfig): string {
  return crypto
    .createHmac("sha256", config.sessionSecret)
    .update(`csrf:${session.email}:${session.issuedAt}:${config.sessionVersion}`)
    .digest("base64url");
}

export function verifyCsrfToken(
  token: string | undefined,
  session: AdminSession,
  config: AdminConfig
): boolean {
  if (!token) return false;
  const expected = generateCsrfToken(session, config);
  const tokenBuf = Buffer.from(token, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  return (
    tokenBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(tokenBuf, expectedBuf)
  );
}

export function checkSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) return false;

  if (origin) {
    try {
      const u = new URL(origin);
      return u.host === host;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const u = new URL(referer);
      return u.host === host;
    } catch {
      return false;
    }
  }

  return false;
}

