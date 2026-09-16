export async function api<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: unknown,
): Promise<T> {
  const baseUrl = import.meta.env?.VITE_API_URL || "";

  const res = await fetch(`${baseUrl}/${url}`, {
    headers: { "Content-Type": "application/json" },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  if (
    res.status === 204 ||
    !res.headers.get("content-type")?.includes("application/json")
  ) {
    return undefined as T;
  }

  return res.json();
}
