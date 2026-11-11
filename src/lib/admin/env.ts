/**
 * MEDDY GLOBAL SOLUTIONS LTD — Admin Environment Configuration & Fail-Closed Guard
 *
 * Enforces strict presence and format validation of security-critical credentials.
 */

export interface AdminUserRecord {
  email: string;
  passwordHash: string;
  name?: string;
  title?: string;
}

export interface AdminConfig {
  enabled: boolean;
  users: AdminUserRecord[];
  sessionSecret: Buffer;
  sessionVersion: number;
  dailySendLimit: number;
  archiveBcc: string;
}

export interface EnvValidationResult {
  valid: boolean;
  config?: AdminConfig;
  error?: string;
}

export function validateAdminEnv(): EnvValidationResult {
  const enabledStr = (process.env.ADMIN_COMPOSE_ENABLED || "").trim().toLowerCase();
  if (enabledStr !== "true") {
    return {
      valid: false,
      error: "ADMIN_COMPOSE_DISABLED: Feature flag is inactive or false.",
    };
  }

  const rawUsers = process.env.ADMIN_USERS;
  if (!rawUsers) {
    return {
      valid: false,
      error: "MISSING_ADMIN_USERS: ADMIN_USERS environment variable is missing.",
    };
  }

  let users: AdminUserRecord[] = [];
  try {
    const parsed = JSON.parse(rawUsers);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        valid: false,
        error: "INVALID_ADMIN_USERS: ADMIN_USERS must be a non-empty JSON array.",
      };
    }
    for (const u of parsed) {
      if (!u.email || typeof u.email !== "string" || !u.passwordHash || typeof u.passwordHash !== "string") {
        return {
          valid: false,
          error: "INVALID_ADMIN_USER_ENTRY: Each admin user must specify email and passwordHash.",
        };
      }
      users.push({
        email: u.email.trim().toLowerCase(),
        passwordHash: u.passwordHash.trim(),
        name: u.name ? String(u.name).trim() : undefined,
        title: u.title ? String(u.title).trim() : undefined,
      });
    }
  } catch (err) {
    return {
      valid: false,
      error: "MALFORMED_ADMIN_USERS_JSON: Failed to parse ADMIN_USERS as JSON.",
    };
  }

  const rawSecret = (process.env.ADMIN_SESSION_SECRET || "").trim();
  if (!rawSecret) {
    return {
      valid: false,
      error: "MISSING_SESSION_SECRET: ADMIN_SESSION_SECRET is required.",
    };
  }

  let sessionSecret: Buffer;
  // Try base64 decoding first, fallback to utf8
  try {
    const b64 = Buffer.from(rawSecret, "base64");
    if (b64.length >= 32) {
      sessionSecret = b64;
    } else {
      sessionSecret = Buffer.from(rawSecret, "utf8");
    }
  } catch {
    sessionSecret = Buffer.from(rawSecret, "utf8");
  }

  if (sessionSecret.length < 32) {
    return {
      valid: false,
      error: "WEAK_SESSION_SECRET: ADMIN_SESSION_SECRET must be at least 32 bytes (256 bits).",
    };
  }

  const rawVersion = parseInt(process.env.SESSION_VERSION || "1", 10);
  const sessionVersion = Number.isSafeInteger(rawVersion) && rawVersion > 0 ? rawVersion : 1;

  const rawLimit = parseInt(process.env.ADMIN_DAILY_SEND_LIMIT || "25", 10);
  const dailySendLimit = Number.isSafeInteger(rawLimit) && rawLimit > 0 ? rawLimit : 25;

  const archiveBcc = (process.env.EMAIL_ARCHIVE_BCC || "info@meddyglobalsolutions.com").trim();

  return {
    valid: true,
    config: {
      enabled: true,
      users,
      sessionSecret,
      sessionVersion,
      dailySendLimit,
      archiveBcc,
    },
  };
}

