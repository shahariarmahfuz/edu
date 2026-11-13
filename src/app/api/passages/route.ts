import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendClient";

export const dynamic = "force-dynamic";

// GET /api/passages - Proxy list request to internal backend
export async function GET(request: NextRequest) {
  try {
    const qs = request.nextUrl.searchParams.toString();
    const path = qs ? `/internal/passages?${qs}` : "/internal/passages";
    const result = await backendFetch(path);
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error proxying GET /api/passages:", error);
    return NextResponse.json(
      { success: false, error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}

// POST /api/passages - Proxy create request to internal backend
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const result = await backendFetch("/internal/passages", {
      method: "POST",
      body: rawBody,
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Error proxying POST /api/passages:", error);
    return NextResponse.json(
      { success: false, error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
