import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MobileInstallGuide } from "./MobileInstallGuide";

describe("MobileInstallGuide", () => {
  it("shows platform-specific install instructions instead of blocking mobile users", () => {
    render(<MobileInstallGuide />);

    expect(screen.getByText(/Install Kite on your phone/i)).toBeInTheDocument();
    expect(screen.getByText(/iPhone and iPad/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Android" })).toBeInTheDocument();
    expect(screen.getByText(/Add to Home Screen/i)).toBeInTheDocument();
    expect(screen.getByText(/Install app/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Continue in browser/i }),
    ).toHaveAttribute("href", "#/welcome");
    expect(
      screen.getByRole("link", { name: /Download Mac app/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/twerpygeek/kite-video/releases/download/v0.1.0/Kite-0.1.0-arm64.dmg",
    );
  });
});
