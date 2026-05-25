import {
  buildAIAssistMessages,
  normalizeAIAssistRequest,
  readAssistantText,
} from "../../apps/web/src/services/ai-assistant-contract.js";

declare const process: {
  env: Record<string, string | undefined>;
};

const MAX_REQUEST_BODY_BYTES = 16_384;
const UPSTREAM_TIMEOUT_MS = 30_000;
const DEFAULT_MODEL = "openai/gpt-oss-20b:free";

export const config = {
  runtime: "edge",
};

function getCorsHeaders(request: Request): Record<string, string> {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  const isSameOrigin = origin === requestOrigin;
  const isLocalhost = origin?.startsWith("http://localhost:") ?? false;
  const allowedOrigin = isSameOrigin || isLocalhost ? origin : requestOrigin;

  return {
    "Access-Control-Allow-Origin": allowedOrigin ?? requestOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  corsHeaders: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function getEnv(name: string): string {
  const value = process.env[name];
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(request: Request): Promise<Response> {
  const corsHeaders = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, corsHeaders);
  }

  const contentLength = request.headers.get("Content-Length");
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_BYTES) {
    return jsonResponse({ error: "Request body too large." }, 413, corsHeaders);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400, corsHeaders);
  }

  const normalized = normalizeAIAssistRequest(body);
  if (normalized.ok === false) {
    return jsonResponse({ error: normalized.error }, 400, corsHeaders);
  }

  const baseUrl = getEnv("KITE_AI_BASE_URL").replace(/\/$/, "");
  const apiKey = getEnv("KITE_AI_API_KEY");
  const model = getEnv("KITE_AI_MODEL") || DEFAULT_MODEL;

  if (!baseUrl || !apiKey) {
    return jsonResponse(
      { error: "AI assistant is not configured." },
      503,
      corsHeaders,
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: buildAIAssistMessages(normalized.value),
        temperature: 0.7,
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch {
    return jsonResponse(
      { error: "AI assistant could not reach the model router." },
      502,
      corsHeaders,
    );
  }

  const payload = await upstreamResponse.json().catch(() => null);
  if (!upstreamResponse.ok) {
    return jsonResponse(
      { error: "AI assistant model request failed." },
      502,
      corsHeaders,
    );
  }

  const result = readAssistantText(payload);
  if (!result) {
    return jsonResponse(
      { error: "AI assistant returned an empty response." },
      502,
      corsHeaders,
    );
  }

  return jsonResponse({ result }, 200, corsHeaders);
}
