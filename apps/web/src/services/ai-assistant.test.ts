import { afterEach, describe, expect, it, vi } from "vitest";
import { requestAIAssist } from "./ai-assistant";

describe("requestAIAssist", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the same-origin AI endpoint without exposing provider credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          result: "1. Open with the problem\n2. Show the cut\n3. End with the payoff",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await requestAIAssist({
      action: "hooks",
      prompt: "A phone-first video editor launch",
      platform: "TikTok",
      tone: "concise",
    });

    expect(result.result).toMatch(/Open with the problem/);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ai/assist",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers).not.toHaveProperty("Authorization");
    expect(options.headers).not.toHaveProperty("x-proxy-api-key");
    expect(options.body).toContain("phone-first video editor");
  });
});
