/**
 * Every request goes through the API gateway, which checks the JWT
 * and forwards the call to the right microservice.
 */
export const API_URL: string = (import.meta.env.VITE_API_URL || "http://localhost:8083").replace(/\/$/, "");

export const GRAPHQL_URL = `${API_URL}/graphql/`;

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function clearSession(): void {
  ["access_token", "refresh_token", "username", "isAuthenticated"].forEach((k) =>
    localStorage.removeItem(k),
  );
}

/** Called when the gateway answers 401: the token is missing or expired. */
export function handleUnauthorized(): void {
  clearSession();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
}

/** fetch() with the gateway URL and the Authorization header added. */
export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
  const headers = new Headers(init.headers);
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(fullUrl, { ...init, headers });
  if (response.status === 401 && token) handleUnauthorized();
  return response;
}
