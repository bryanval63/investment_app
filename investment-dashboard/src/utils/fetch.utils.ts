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

  return res.json();
}
