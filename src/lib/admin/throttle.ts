/**
 * MEDDY GLOBAL SOLUTIONS LTD — Admin Throttling & Daily Send Guard
 *
 * In-memory brute-force defense and daily dispatch limiter.
 * Serverless defense-in-depth layer (Vercel Firewall rules recommended as primary).
 */

import crypto from "node:crypto";

interface ThrottleRecord {
  failures: number;
  lastFailureAt: number;
  blockedUntil: number;
}

const loginFailuresByIp = new Map<string, ThrottleRecord>();
const loginFailuresByEmail = new Map<string, ThrottleRecord>();

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").substring(0, 16);
}

export function getClientIp(request: Request): string {
  const xForwarded = request.headers.get("x-forwarded-for");
  if (xForwarded) {
    return xForwarded.split(",")[0].trim();
  }
  const xReal = request.headers.get("x-real-ip");
  if (xReal) return xReal.trim();
  return "127.0.0.1";
}

export function checkLoginThrottled(request: Request, email: string): { isThrottled: boolean; waitSeconds?: number } {
  const now = Date.now();
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const cleanEmail = email.trim().toLowerCase();

  const ipRecord = loginFailuresByIp.get(ipHash);
  if (ipRecord && ipRecord.blockedUntil > now) {
    const waitSeconds = Math.ceil((ipRecord.blockedUntil - now) / 1000);
    return { isThrottled: true, waitSeconds };
  }

  const emailRecord = loginFailuresByEmail.get(cleanEmail);
  if (emailRecord && emailRecord.blockedUntil > now) {
    const waitSeconds = Math.ceil((emailRecord.blockedUntil - now) / 1000);
    return { isThrottled: true, waitSeconds };
  }

  return { isThrottled: false };
}

export function recordLoginFailure(request: Request, email: string): void {
  const now = Date.now();
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const cleanEmail = email.trim().toLowerCase();

  // Update IP record
  const currentIp = loginFailuresByIp.get(ipHash) || { failures: 0, lastFailureAt: 0, blockedUntil: 0 };
  if (now - currentIp.lastFailureAt > WINDOW_MS) {
    currentIp.failures = 1;
  } else {
    currentIp.failures += 1;
  }
  currentIp.lastFailureAt = now;
  if (currentIp.failures >= MAX_FAILURES) {
    currentIp.blockedUntil = now + COOLDOWN_MS;
    console.warn(`[ADMIN AUTH THROTTLE] IP hash ${ipHash} blocked for 15 minutes after ${currentIp.failures} failures.`);
  }
  loginFailuresByIp.set(ipHash, currentIp);

  // Update Email record
  if (cleanEmail) {
    const currentEmail = loginFailuresByEmail.get(cleanEmail) || { failures: 0, lastFailureAt: 0, blockedUntil: 0 };
    if (now - currentEmail.lastFailureAt > WINDOW_MS) {
      currentEmail.failures = 1;
    } else {
      currentEmail.failures += 1;
    }
    currentEmail.lastFailureAt = now;
    if (currentEmail.failures >= MAX_FAILURES) {
      currentEmail.blockedUntil = now + COOLDOWN_MS;
      console.warn(`[ADMIN AUTH THROTTLE] Account ${cleanEmail} blocked for 15 minutes after ${currentEmail.failures} failures.`);
    }
    loginFailuresByEmail.set(cleanEmail, currentEmail);
  }
}

export function clearLoginFailures(request: Request, email: string): void {
  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  const cleanEmail = email.trim().toLowerCase();
  loginFailuresByIp.delete(ipHash);
  loginFailuresByEmail.delete(cleanEmail);
}

// In-memory daily send tracker
interface DailySendRecord {
  dateStr: string; // YYYY-MM-DD
  count: number;
}
let currentDailySend: DailySendRecord = {
  dateStr: new Date().toISOString().substring(0, 10),
  count: 0,
};

export function checkAndIncrementDailySend(limit: number): { allowed: boolean; currentCount: number; limit: number } {
  const today = new Date().toISOString().substring(0, 10);
  if (currentDailySend.dateStr !== today) {
    currentDailySend = { dateStr: today, count: 0 };
  }

  if (currentDailySend.count >= limit) {
    return { allowed: false, currentCount: currentDailySend.count, limit };
  }

  currentDailySend.count += 1;
  return { allowed: true, currentCount: currentDailySend.count, limit };
}

export function getRemainingDailySends(limit: number): number {
  const today = new Date().toISOString().substring(0, 10);
  if (currentDailySend.dateStr !== today) {
    return limit;
  }
  return Math.max(0, limit - currentDailySend.count);
}

