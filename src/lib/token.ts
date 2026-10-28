import crypto from "crypto";

/**
 * Generates an unguessable, URL-safe crypto-random token.
 * Uses 12 bytes encoded as base64url (16 characters) or 16 bytes (22 characters).
 * Both satisfy the requirement (>= 16 chars, crypto-random, URL-safe).
 */
export function generateToken(): string {
  return crypto.randomBytes(15).toString("base64url");
}

/**
 * Validates token format (must be alphanumeric or urlsafe characters, >= 12 chars).
 */
export function isValidTokenFormat(token: unknown): token is string {
  if (typeof token !== "string") return false;
  return /^[A-Za-z0-9_-]{12,64}$/.test(token);
}
