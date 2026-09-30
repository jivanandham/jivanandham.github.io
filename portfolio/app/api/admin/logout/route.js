import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated. Root access revoked.",
  });

  response.cookies.delete("admin_token");
  return response;
}
