export async function fetchData<T>(url: string, method: string = "GET", token?: string, body?: unknown): Promise<T> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }

  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body), headers: { ...headers, "Content-type": "application/json" } } : {} )
  }

  const response = await fetch(`${API_URL}${url}`, options);

  let json = await response.json()

  return json as T;
}
