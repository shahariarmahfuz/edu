import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendClient";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const qs = request.nextUrl.searchParams.toString();
    const path = qs ? `/internal/vocabulary?${qs}` : "/internal/vocabulary";
    const result = await backendFetch(path);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error proxying GET /api/vocabulary:", error);
    return NextResponse.json(
      { success: false, error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
