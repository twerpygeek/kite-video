import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KiteCursorGuide } from "./KiteCursorGuide";

describe("KiteCursorGuide", () => {
  it("renders an accessible clickable guide with creator tips", () => {
    render(<KiteCursorGuide />);

    const guide = screen.getByRole("button", {
      name: /Cycle Kite guide tip/i,
    });

    expect(guide).toBeInTheDocument();
    expect(screen.getByText("Drop a clip.")).toBeInTheDocument();

    fireEvent.click(guide);

    expect(screen.getByText("Shape the timeline.")).toBeInTheDocument();
  });
});
