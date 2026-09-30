import { NextResponse } from "next/server";
import { getPostBySlug, savePost, deletePost } from "../../../../lib/blogStore.js";
import { isRequestAdmin } from "../../../../lib/auth.js";
import { validatePostInput, isValidSlug } from "../../../../lib/validation.js";
import { rateLimit, getClientIp, rateLimitResponse } from "../../../../lib/rateLimit.js";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { slug } = params;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  try {
    const post = getPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found." }, { status: 404 });
    }

    // Strip internal voter map from public response
    const { voters, ...publicPost } = post;
    return NextResponse.json(
      { success: true, post: publicPost },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    console.error(`[GET /api/posts/${slug}] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to retrieve post." }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!isRequestAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 403 }
    );
  }

  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const { limited, retryAfter } = rateLimit(ip, "post-update", 30, 60 * 60 * 1000);
  if (limited) return rateLimitResponse(retryAfter);

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
    }

    const { valid, errors, data } = validatePostInput({ ...body, slug });
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", details: errors },
        { status: 422 }
      );
    }

    const updated = savePost({ ...data, slug });
    return NextResponse.json({ success: true, message: "Post updated.", post: updated });
  } catch (err) {
    console.error(`[PUT /api/posts/${slug}] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isRequestAdmin(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 403 });
  }

  const { slug } = params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ success: false, error: "Invalid slug." }, { status: 400 });
  }

  try {
    const deleted = deletePost(slug);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Post not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: `Post '${slug}' deleted.` });
  } catch (err) {
    console.error(`[DELETE /api/posts/${slug}] Error:`, err);
    return NextResponse.json({ success: false, error: "Failed to delete post." }, { status: 500 });
  }
}
