import { NextResponse } from "next/server";
import { getAllPosts, savePost } from "../../../lib/blogStore.js";
import { isRequestAdmin } from "../../../lib/auth.js";
import { validatePostInput } from "../../../lib/validation.js";
import { rateLimit, getClientIp, rateLimitResponse } from "../../../lib/rateLimit.js";

export const dynamic = "force-dynamic";

// Cache headers for public GET (revalidate every 60s)
const PUBLIC_CACHE = "public, s-maxage=60, stale-while-revalidate=120";

export async function GET(request) {
  try {
    const posts = getAllPosts();

    // Strip internal voter data from public response
    const publicPosts = posts.map(({ ...post }) => {
      if (post.voters) delete post.voters;
      return post;
    });

    return NextResponse.json(
      { success: true, posts: publicPosts, count: publicPosts.length },
      {
        headers: {
          "Cache-Control": PUBLIC_CACHE,
          "Vary": "Accept",
        },
      }
    );
  } catch (err) {
    console.error("[GET /api/posts] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve posts." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit even admin: max 30 post operations per hour
  const { limited, retryAfter } = rateLimit(ip, "post-create", 30, 60 * 60 * 1000);
  if (limited) return rateLimitResponse(retryAfter);

  if (!isRequestAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin access required to publish posts." },
      { status: 403 }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
    }

    const { valid, errors, data } = validatePostInput(body);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Validation failed.", details: errors },
        { status: 422 }
      );
    }

    const saved = savePost(data);
    return NextResponse.json(
      { success: true, message: "Post published.", post: saved },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/posts] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save post." },
      { status: 500 }
    );
  }
}
