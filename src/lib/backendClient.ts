export interface BackendResponse<T> {
  status: number;
  ok: boolean;
  body: T;
}

/**
 * Performs an internal-only HTTP call from the Next.js frontend server
 * to the local/private backend service.
 */
export async function backendFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<BackendResponse<T>> {
  const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:4000";
  const internalApiKey = process.env.INTERNAL_API_KEY || "";

  const headers = new Headers(init.headers);
  if (internalApiKey) {
    headers.set("x-internal-key", internalApiKey);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const body = (await res.json()) as T;
  return {
    status: res.status,
    ok: res.ok,
    body,
  };
}
