import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreatorAssistantPanel } from "./CreatorAssistantPanel";
import * as aiAssistant from "../../services/ai-assistant";

describe("CreatorAssistantPanel", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates creator suggestions from the secure assistant endpoint", async () => {
    vi.spyOn(aiAssistant, "requestAIAssist").mockResolvedValue({
      result:
        "1. Create once. Let it fly.\n2. Install once and keep creating.\n3. Cut on phone, finish on desktop.",
    });

    render(<CreatorAssistantPanel />);

    fireEvent.change(screen.getByLabelText("Content brief"), {
      target: { value: "Launch post for Kite" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Generate hooks" }));

    await waitFor(() => {
      expect(screen.getByText(/Create once\. Let it fly/i)).toBeInTheDocument();
    });

    expect(aiAssistant.requestAIAssist).toHaveBeenCalledWith({
      action: "hooks",
      prompt: "Launch post for Kite",
      platform: "TikTok",
      tone: "direct",
    });
  });
});
