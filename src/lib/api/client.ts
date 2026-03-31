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

function buildUrl(baseUrl: string, path: string) {
  return `${baseUrl}${path}`;
}

export async function requestApiResponse({
  baseUrl,
  path,
  init,
  cache,
}: ApiRequestOptions): Promise<Response> {
  return fetch(buildUrl(baseUrl, path), {
    ...(cache ? { cache } : {}),
    ...init,
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
