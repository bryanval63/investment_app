export async function api<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`http://localhost:3000/${url}`, {
    headers: { "Content-Type": "application/json" },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}
