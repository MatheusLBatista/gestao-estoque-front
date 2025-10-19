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

  return json as T;
}
