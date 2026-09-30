import { NextResponse } from "next/server";
import { getAllCommentsFlat } from "../../../../lib/blogStore.js";
import { isRequestAdmin } from "../../../../lib/auth.js";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isRequestAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin clearance required." },
      { status: 403 }
    );
  }

  try {
    const comments = getAllCommentsFlat();
    return NextResponse.json({ success: true, comments });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
