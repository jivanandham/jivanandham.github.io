/**
 * In-memory rate limiter for API routes.
 * Keyed by IP + route identifier. Limits per sliding window.
 *
 * Usage:
 *   const { limited, remaining } = rateLimit(ip, 'comments', 5, 60_000);
 *   if (limited) return 429;
 */

const store = new Map(); // key → { count, windowStart }

// Prune stale windows every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now - val.windowStart > val.windowMs) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * @param {string} identifier  - typically client IP
 * @param {string} action      - 'login', 'comment', 'vote', etc.
 * @param {number} max         - max requests per window
 * @param {number} windowMs    - window size in milliseconds
 * @returns {{ limited: boolean, remaining: number, retryAfter: number }}
 */
export function rateLimit(identifier, action, max = 10, windowMs = 60_000) {
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const record = store.get(key);

  if (!record || now - record.windowStart > windowMs) {
    // Fresh window
    store.set(key, { count: 1, windowStart: now, windowMs });
    return { limited: false, remaining: max - 1, retryAfter: 0 };
  }

  record.count += 1;
  store.set(key, record);

  const remaining = Math.max(0, max - record.count);
  const retryAfter = Math.ceil((record.windowStart + windowMs - now) / 1000);

  return {
    limited: record.count > max,
    remaining,
    retryAfter,
  };
}

/**
 * Extracts a reliable client IP from a Next.js Request.
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first && first !== "::1") return first;
  }
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

/**
 * Returns a standard 429 Too Many Requests response.
 */
export function rateLimitResponse(retryAfter = 60) {
  const { NextResponse } = require("next/server");
  return NextResponse.json(
    { success: false, error: `Rate limit exceeded. Please wait ${retryAfter}s before retrying.` },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "true",
      },
    }
  );
}
