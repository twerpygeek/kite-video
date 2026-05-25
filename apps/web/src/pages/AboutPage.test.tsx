import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
  it("explains Kite's creator workflow and links back to editing", () => {
    render(<AboutPage />);

    expect(
      screen.getByRole("heading", {
        name: /a web video editor you can install anywhere/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No app store\. No download\. Just edit\./i)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /mobile editor caption controls/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start editing/i }),
    ).toHaveAttribute("href", "#/welcome");
    expect(
      screen.getByRole("link", { name: /download mac app/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/twerpygeek/kite-video/releases/download/v0.1.0/Kite-0.1.0-arm64.dmg",
    );
  });
});
