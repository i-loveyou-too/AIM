export type ApiErrorMode = "status" | "detail";

export type ApiRequestOptions = {
  baseUrl: string;
  path: string;
  init?: RequestInit;
  cache?: RequestCache;
};

export type ApiJsonRequestOptions = ApiRequestOptions & {
  errorMode?: ApiErrorMode;
  defaultErrorMessage?: string;
};

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export function getApiBaseUrl() {
  const value =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    "";
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Missing env: NEXT_PUBLIC_API_BASE_URL");
  }
  return normalizeBaseUrl(trimmed);
}

function buildUrl(baseUrl: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
}

async function resolveServerCookieHeader(): Promise<string | null> {
  if (typeof window !== "undefined") return null;

  try {
    const { cookies } = await import("next/headers");
    const store = cookies();
    const cookieHeader = store
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    return cookieHeader || null;
  } catch {
    return null;
  }
}

export async function requestApiResponse({
  baseUrl,
  path,
  init,
  cache,
}: ApiRequestOptions): Promise<Response> {
  const headers = new Headers(init?.headers ?? {});
  const serverCookieHeader = await resolveServerCookieHeader();
  if (serverCookieHeader && !headers.has("cookie")) {
    headers.set("cookie", serverCookieHeader);
  }

  return fetch(buildUrl(baseUrl, path), {
    ...(cache ? { cache } : {}),
    ...init,
    credentials: init?.credentials ?? "include",
    headers,
  });
}

export async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function extractDetailMessage(data: unknown) {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data &&
    typeof (data as { detail?: unknown }).detail === "string"
  ) {
    return (data as { detail: string }).detail;
  }
  return null;
}

export async function requestJson<T>({
  baseUrl,
  path,
  init,
  cache,
  errorMode = "status",
  defaultErrorMessage,
}: ApiJsonRequestOptions): Promise<T> {
  const response = await requestApiResponse({ baseUrl, path, init, cache });
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    if (errorMode === "detail") {
      const detail = extractDetailMessage(data);
      if (detail) {
        throw new Error(detail);
      }
    }
    throw new Error(defaultErrorMessage ?? `API request failed: ${response.status}`);
  }

  return data as T;
}
