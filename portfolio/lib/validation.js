/**
 * Centralised input validation utilities for API routes.
 * Keeps route handlers clean and consistently enforces limits.
 */

// Max lengths
export const LIMITS = {
  SLUG: 80,
  TITLE: 200,
  BLURB: 500,
  LEAD: 1000,
  SECTION_HEADING: 200,
  SECTION_BODY: 8000,
  SECTION_CODE: 4000,
  TAG: 50,
  TAG_COUNT: 10,
  SECTION_COUNT: 20,
  AUTHOR: 80,
  COMMENT: 1000,
  PASSWORD: 256,
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Strips all HTML tags and script injection patterns from a string.
 */
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>/g, "") // strip tags
    .replace(/javascript:/gi, "") // strip JS protocol
    .replace(/on\w+=/gi, "") // strip event attributes
    .trim();
}

/**
 * Validates and sanitizes incoming post data.
 * Returns { valid, errors, data } where data is the cleaned post object.
 */
export function validatePostInput(body) {
  const errors = [];

  const title = sanitize(body?.title || "");
  const slug = sanitize(body?.slug || "");
  const date = sanitize(body?.date || "");
  const readTime = sanitize(body?.readTime || "");
  const blurb = sanitize(body?.blurb || "");
  const lead = sanitize(body?.lead || "");
  const domains = Array.isArray(body?.domains) ? body.domains : [];
  const tags = Array.isArray(body?.tags)
    ? body.tags
    : typeof body?.tags === "string"
    ? body.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const sections = Array.isArray(body?.sections) ? body.sections : [];

  if (!title || title.length < 4) errors.push("Title must be at least 4 characters.");
  if (title.length > LIMITS.TITLE) errors.push(`Title must be under ${LIMITS.TITLE} chars.`);

  if (slug) {
    if (slug.length > LIMITS.SLUG) errors.push(`Slug must be under ${LIMITS.SLUG} chars.`);
    if (!SLUG_RE.test(slug)) errors.push("Slug must be lowercase letters, numbers, and hyphens only.");
  }

  if (blurb.length > LIMITS.BLURB) errors.push(`Blurb must be under ${LIMITS.BLURB} chars.`);
  if (lead.length > LIMITS.LEAD) errors.push(`Lead must be under ${LIMITS.LEAD} chars.`);

  const VALID_DOMAINS = ["vision", "rag", "systems", "data"];
  const cleanDomains = domains.filter((d) => VALID_DOMAINS.includes(d));
  if (cleanDomains.length === 0) cleanDomains.push("systems");

  const cleanTags = tags
    .slice(0, LIMITS.TAG_COUNT)
    .map((t) => sanitize(String(t)).slice(0, LIMITS.TAG))
    .filter(Boolean);

  if (sections.length === 0) errors.push("At least one section is required.");
  if (sections.length > LIMITS.SECTION_COUNT) errors.push(`Maximum ${LIMITS.SECTION_COUNT} sections allowed.`);

  const cleanSections = sections.slice(0, LIMITS.SECTION_COUNT).map((sec) => ({
    heading: sanitize(String(sec?.heading || "")).slice(0, LIMITS.SECTION_HEADING),
    body: sanitize(String(sec?.body || "")).slice(0, LIMITS.SECTION_BODY),
    code: sanitize(String(sec?.code || "")).slice(0, LIMITS.SECTION_CODE),
  }));

  const cleanSectionErrors = cleanSections.filter((s) => !s.heading || !s.body);
  if (cleanSectionErrors.length > 0) errors.push("Each section must have a heading and body.");

  return {
    valid: errors.length === 0,
    errors,
    data: {
      title,
      slug,
      date: date || new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      readTime: readTime || "5 min read",
      domains: cleanDomains,
      tags: cleanTags,
      blurb,
      lead,
      sections: cleanSections,
    },
  };
}

/**
 * Validates and sanitizes comment input.
 */
export function validateCommentInput(body) {
  const errors = [];

  const author = sanitize(String(body?.author || "Anonymous Visitor")).slice(0, LIMITS.AUTHOR);
  const text = sanitize(String(body?.text || "")).slice(0, LIMITS.COMMENT);

  if (!text || text.length < 2) errors.push("Comment text must be at least 2 characters.");
  if (text.length > LIMITS.COMMENT) errors.push(`Comment must be under ${LIMITS.COMMENT} chars.`);

  // Basic spam check: no URLs in comments (simple heuristic)
  if (/https?:\/\//.test(text)) errors.push("URLs are not permitted in comments.");

  return {
    valid: errors.length === 0,
    errors,
    data: { author: author || "Anonymous Visitor", text },
  };
}

/**
 * Validates slug format.
 */
export function isValidSlug(slug) {
  return typeof slug === "string" && SLUG_RE.test(slug) && slug.length <= LIMITS.SLUG;
}
