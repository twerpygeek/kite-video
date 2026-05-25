import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TutorialPage } from "./TutorialPage";

describe("TutorialPage", () => {
  it("shows the five-step Kite editing tutorial with onboarding images", () => {
    render(<TutorialPage />);

    expect(
      screen.getByRole("heading", {
        name: /how to use kite/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Import footage, shape the timeline/i)).toBeInTheDocument();

    const tutorialImages = screen.getAllByRole("img", {
      name: /mobile editor/i,
    });
    expect(tutorialImages).toHaveLength(5);

    expect(screen.getByRole("link", { name: /Start editing/i })).toHaveAttribute(
      "href",
      "#/welcome",
    );
    expect(screen.getByRole("link", { name: /Download Mac app/i })).toHaveAttribute(
      "href",
      "https://github.com/twerpygeek/kite-video/releases/download/v0.1.0/Kite-0.1.0-arm64.dmg",
    );
  });
});
