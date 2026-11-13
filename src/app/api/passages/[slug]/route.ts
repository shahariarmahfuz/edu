import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendClient";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const result = await backendFetch(
      `/internal/passages/${encodeURIComponent(slug)}`
    );
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error proxying GET /api/passages/[slug]:", error);
    return NextResponse.json(
      { success: false, error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
