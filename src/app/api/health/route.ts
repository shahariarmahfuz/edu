import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendClient";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await backendFetch<{ ok: boolean }>("/internal/health");
    return NextResponse.json(
      {
        ok: result.ok,
        frontend: "ok",
        backend: result.ok ? "ok" : "error",
      },
      { status: result.status }
    );
  } catch {
    return NextResponse.json(
      { ok: false, frontend: "ok", backend: "unreachable" },
      { status: 503 }
    );
  }
}
