import { NextResponse } from "next/server";
import { verifyPassword, createAdminToken } from "../../../../lib/auth.js";
import { rateLimit, getClientIp, rateLimitResponse } from "../../../../lib/rateLimit.js";

export const dynamic = "force-dynamic";

export async function POST(request) {
  // Strict rate limit: 5 login attempts per 15 minutes per IP
  const ip = getClientIp(request);
  const { limited, retryAfter } = rateLimit(ip, "admin-login", 5, 15 * 60 * 1000);
  if (limited) {
    return rateLimitResponse(retryAfter);
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { password } = body;

    if (!password || typeof password !== "string" || password.length > 256) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials format." },
        { status: 400 }
      );
    }

    if (!verifyPassword(password)) {
      // Intentional small delay to slow brute-force even further
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid Security Key" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Security clearance granted. Welcome, Admin.",
    });

    // Set secure HTTP-only cookie — token NOT exposed in response body
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("[admin/login] Error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication system failure." },
      { status: 500 }
    );
  }
}
