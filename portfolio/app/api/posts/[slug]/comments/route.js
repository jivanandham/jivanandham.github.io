import { NextResponse } from "next/server";
import { getPostComments, addPostComment } from "../../../../../lib/blogStore.js";
import { validateCommentInput, isValidSlug } from "../../../../../lib/validation.js";
import { rateLimit, getClientIp, rateLimitResponse } from "../../../../../lib/rateLimit.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  try {
    const comments = getPostComments(slug);
    return NextResponse.json(
      { success: true, comments, count: comments.length },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error(`[GET /api/posts/${slug}/comments] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to load comments." }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  // Rate limit: max 3 comments per IP per hour per post
  const ip = getClientIp(request);
  const { limited, retryAfter } = rateLimit(ip, `comment:${slug}`, 3, 60 * 60 * 1000);
  if (limited) {
    return rateLimitResponse(retryAfter);
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
    }

    const { valid, errors, data } = validateCommentInput(body);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", details: errors },
        { status: 422 }
      );
    }

    const newComment = addPostComment(slug, data);
    return NextResponse.json(
      { success: true, comment: newComment, message: "Transmission logged." },
      { status: 201 }
    );
  } catch (err) {
    console.error(`[POST /api/posts/${slug}/comments] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to save comment." }, { status: 500 });
  }
}
