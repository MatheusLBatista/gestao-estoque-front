export async function fetchData<T>(
  url: string,
  method: string = "GET",
  token?: string,
  body?: unknown
): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const accessToken = token || process.env.NEXT_PUBLIC_ACCESS_TOKEN;

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_URL}${url}`, options);

  let json = await response.json();

  if (!response.ok) {
    const errorMessage =
      json?.message ||
      json?.error ||
      `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).response = { data: json };
    throw error;
  }

  return json as T;
}
