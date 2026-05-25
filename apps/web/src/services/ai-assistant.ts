import type { AIAssistRequest } from "./ai-assistant-contract";

export interface AIAssistResult {
  result: string;
}

export async function requestAIAssist(input: AIAssistRequest): Promise<AIAssistResult> {
  const response = await fetch("/api/ai/assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    result?: unknown;
    error?: unknown;
  };

  if (!response.ok) {
    const message =
      typeof payload.error === "string"
        ? payload.error
        : "AI assistant request failed.";
    throw new Error(message);
  }

  if (typeof payload.result !== "string" || !payload.result.trim()) {
    throw new Error("AI assistant returned an empty response.");
  }

  return { result: payload.result.trim() };
}
