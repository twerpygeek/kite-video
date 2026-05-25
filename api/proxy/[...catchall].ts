interface ServiceConfig {
  baseUrl: string;
  allowedPaths: RegExp;
  authHeaders: (key: string) => Record<string, string>;
}

const SERVICE_CONFIG: Record<string, ServiceConfig> = {
  elevenlabs: {
    baseUrl: "https://api.elevenlabs.io/v1",
    allowedPaths: /^(voices|models|text-to-speech\/[\w-]+)$/,
    authHeaders: (key) => ({ "xi-api-key": key }),
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    allowedPaths: /^(chat\/completions|models)$/,
    authHeaders: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  anthropic: {
    baseUrl: "https://api.anthropic.com/v1",
    allowedPaths: /^(messages)$/,
    authHeaders: (key) => ({
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    }),
  },
};

const MAX_REQUEST_BODY_BYTES = 1_048_576;
const UPSTREAM_TIMEOUT_MS = 25_000;

function getCorsHeaders(request: Request): Record<string, string> {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  const isSameOrigin = origin === requestOrigin;
  const isLocalhost = origin?.startsWith("http://localhost:") ?? false;
  const allowedOrigin = isSameOrigin || isLocalhost ? origin : requestOrigin;

  return {
    "Access-Control-Allow-Origin": allowedOrigin ?? requestOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-proxy-api-key",
    Vary: "Origin",
  };
}

function jsonError(
  message: string,
  status: number,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const requestUrl = new URL(request.url);
  const remaining = requestUrl.pathname.replace(/^\/api\/proxy\/?/, "");
  const pathParts = remaining.split("/").filter(Boolean);

  if (pathParts.length < 1) {
    return jsonError("Missing service in URL path", 400, corsHeaders);
  }

  const service = pathParts[0];
  const remainingPath = pathParts.slice(1).join("/");

  if (remainingPath.includes("..") || remainingPath.includes("//")) {
    return jsonError("Invalid path", 400, corsHeaders);
  }

  const configForService = SERVICE_CONFIG[service];
  if (!configForService) {
    return jsonError(`Unknown service: ${service}`, 400, corsHeaders);
  }

  if (remainingPath && !configForService.allowedPaths.test(remainingPath)) {
    return jsonError("Path not allowed for this service", 403, corsHeaders);
  }

  const apiKey = request.headers.get("x-proxy-api-key");
  if (!apiKey) {
    return jsonError("Missing x-proxy-api-key header", 401, corsHeaders);
  }

  const contentLength = request.headers.get("Content-Length");
  if (request.method === "POST" && contentLength) {
    const parsedLength = parseInt(contentLength, 10);
    if (parsedLength > MAX_REQUEST_BODY_BYTES) {
      return jsonError("Request body too large", 413, corsHeaders);
    }
  }

  const targetUrl = remainingPath
    ? `${configForService.baseUrl}/${remainingPath}${requestUrl.search}`
    : `${configForService.baseUrl}${requestUrl.search}`;

  const upstreamHeaders = new Headers();
  const contentType = request.headers.get("Content-Type");
  if (contentType) {
    upstreamHeaders.set("Content-Type", contentType);
  }
  for (const [key, value] of Object.entries(configForService.authHeaders(apiKey))) {
    upstreamHeaders.set(key, value);
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: upstreamHeaders,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "TimeoutError"
        ? "Upstream request timed out"
        : "Failed to reach upstream service";
    return jsonError(message, 502, corsHeaders);
  }

  const responseHeaders = new Headers(upstreamResponse.headers);
  for (const [key, value] of Object.entries(corsHeaders)) {
    responseHeaders.set(key, value);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}
