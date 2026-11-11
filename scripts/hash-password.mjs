#!/usr/bin/env node

/**
 * MEDDY GLOBAL SOLUTIONS LTD — Password Hash Generator
 *
 * Scrypt-based credential hasher with secure random password generator.
 * Format: scrypt$N$r$p$<saltHex>$<derivedKeyHex>
 */

import crypto from "node:crypto";
import readline from "node:readline";

const SCRYPT_N = 32768; // 2^15
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEYLEN = 32;

function hashPassword(password) {
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

function generateStrongPassword(length = 20) {
  // Excluding look-alikes: 0, O, o, 1, l, I
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*()-_=+";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const isGenerate = args.includes("--generate");

  if (isGenerate) {
    const generatedPassword = generateStrongPassword(20);
    const hash = await hashPassword(generatedPassword);

    console.log("\n=======================================================");
    console.log("MEDDY CREDENTIAL GENERATOR (ONE-TIME OUTPUT)");
    console.log("=======================================================");
    console.log(`Generated Password: ${generatedPassword}`);
    console.log("-------------------------------------------------------");
    console.log(`ADMIN_USERS passwordHash:`);
    console.log(hash);
    console.log("-------------------------------------------------------");
    console.log("Example ADMIN_USERS JSON snippet:");
    console.log(
      JSON.stringify(
        [
          {
            email: "owner@meddyglobalsolutions.com",
            passwordHash: hash,
            name: "Engr. Ahmed",
            title: "Managing Director",
          },
        ],
        null,
        2
      )
    );
    console.log("=======================================================\n");
    console.log("IMPORTANT: Copy the password now. It cannot be recovered.\n");
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter password to hash: ", async (password) => {
    rl.close();
    if (!password || password.length < 12) {
      console.error("\nError: Password must be at least 12 characters.");
      process.exit(1);
    }

    const hash = await hashPassword(password);
    console.log("\nComputed Scrypt Hash:");
    console.log(hash);
    console.log("\nPaste this hash into your ADMIN_USERS configuration.\n");
  });
}

main().catch((err) => {
  console.error("Error generating hash:", err);
  process.exit(1);
});

