import { NextResponse } from "next/server";
import { deletePostComment } from "../../../../../../lib/blogStore.js";
import { isRequestAdmin } from "../../../../../../lib/auth.js";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  if (!isRequestAdmin(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Admin access required to moderate comments." },
      { status: 403 }
    );
  }

  const { slug, id } = params;
  try {
    const deleted = deletePostComment(slug, id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Comment not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment purged by administrator.",
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
