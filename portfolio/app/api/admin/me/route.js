import { NextResponse } from "next/server";
import { isRequestAdmin } from "../../../../lib/auth.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const isAdmin = isRequestAdmin(request);
  return NextResponse.json({
    isAdmin,
    role: isAdmin ? "admin" : "visitor",
  });
}
