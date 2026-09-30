import { NextResponse } from "next/server";
import { getPostVotes, castPostVote } from "../../../../../lib/blogStore.js";
import { isValidSlug } from "../../../../../lib/validation.js";
import { rateLimit, getClientIp, rateLimitResponse } from "../../../../../lib/rateLimit.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const visitorId = searchParams.get("visitorId");

  // Sanitise visitorId: only allow safe characters
  const safeVisitorId = visitorId
    ? String(visitorId).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64)
    : null;

  try {
    const data = getPostVotes(slug, safeVisitorId);
    return NextResponse.json(
      { success: true, ...data },
      { headers: { "Cache-Control": "no-store" } } // votes must always be fresh
    );
  } catch (err) {
    console.error(`[GET /api/posts/${slug}/vote] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to retrieve votes." }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  // Rate limit: max 10 vote events per IP per hour (to allow toggle/swap)
  const ip = getClientIp(request);
  const { limited, retryAfter } = rateLimit(ip, `vote:${slug}`, 10, 60 * 60 * 1000);
  if (limited) return rateLimitResponse(retryAfter);

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
    }

    const { type, visitorId } = body;

    if (!type || !["up", "down"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid vote type. Must be 'up' or 'down'." },
        { status: 400 }
      );
    }

    // Build effective visitor ID: sanitise client-provided ID or fall back to IP
    const safeProvidedId = visitorId
      ? String(visitorId).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64)
      : null;
    const effectiveVisitorId = safeProvidedId || ip;

    const result = castPostVote(slug, type, effectiveVisitorId);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error(`[POST /api/posts/${slug}/vote] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to record vote." }, { status: 500 });
  }
}
