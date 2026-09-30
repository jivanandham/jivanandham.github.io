import crypto from "crypto";

// Default admin password if not provided in environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "jeeva-portfolio-secure-terminal-secret-key-2026";

/**
 * Verifies if the provided plain text password matches the admin password.
 */
export function verifyPassword(password) {
  if (!password || typeof password !== "string") return false;
  // Constant-time comparison to prevent timing attacks
  const buffA = Buffer.from(password.trim());
  const buffB = Buffer.from(ADMIN_PASSWORD.trim());
  if (buffA.length !== buffB.length) return false;
  return crypto.timingSafeEqual(buffA, buffB);
}

/**
 * Creates a signed admin token with timestamp (valid for 7 days).
 */
export function createAdminToken() {
  const payload = {
    role: "admin",
    issuedAt: Date.now(),
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(str)
    .digest("base64url");
  return `${str}.${signature}`;
}

/**
 * Verifies a signed admin token.
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadStr, sig] = parts;
  const expectedSig = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payloadStr)
    .digest("base64url");

  if (sig !== expectedSig) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());
    if (payload.role !== "admin") return false;
    if (Date.now() > payload.expiresAt) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks Next.js request for admin privileges via cookie or header.
 */
export function isRequestAdmin(request) {
  // Check cookie
  const cookie = request.cookies.get("admin_token")?.value;
  if (cookie && verifyAdminToken(cookie)) return true;

  // Check custom authorization or header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (verifyAdminToken(token)) return true;
  }

  const customHeader = request.headers.get("x-admin-token");
  if (customHeader && verifyAdminToken(customHeader)) return true;

  return false;
}
