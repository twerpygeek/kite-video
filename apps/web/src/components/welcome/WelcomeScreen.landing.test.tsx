import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WelcomeScreen } from "./WelcomeScreen";

const mockCreateNewProject = vi.fn();
const mockSetSkipWelcomeScreen = vi.fn();
const mockNavigate = vi.fn();
const mockTrack = vi.fn();

vi.mock("../../stores/project-store", () => ({
  useProjectStore: (selector: (state: unknown) => unknown) =>
    selector({ createNewProject: mockCreateNewProject }),
}));

vi.mock("../../stores/ui-store", () => ({
  useUIStore: (selector: (state: unknown) => unknown) =>
    selector({
      skipWelcomeScreen: false,
      setSkipWelcomeScreen: mockSetSkipWelcomeScreen,
    }),
}));

vi.mock("../../hooks/use-router", () => ({
  useRouter: () => ({ navigate: mockNavigate }),
}));

vi.mock("../../hooks/useEditorPreload", () => ({
  useEditorPreload: vi.fn(),
}));

vi.mock("../../hooks/useAnalytics", () => ({
  AnalyticsEvents: { PROJECT_CREATED: "project_created" },
  useAnalytics: () => ({ track: mockTrack }),
}));

vi.mock("@openreel/core", () => ({
  SOCIAL_MEDIA_PRESETS: {
    tiktok: { width: 1080, height: 1920, frameRate: 30 },
    "youtube-video": { width: 1920, height: 1080, frameRate: 30 },
    "instagram-post": { width: 1080, height: 1080, frameRate: 30 },
  },
}));

vi.mock("./TemplateGallery", () => ({
  TemplateGallery: () => <div>Template gallery</div>,
}));

vi.mock("./RecentProjects", () => ({
  RecentProjects: () => <div>Recent projects</div>,
}));

vi.mock("../MobileInstallGuide", () => ({
  MobileInstallGuide: () => <section>Mobile install guide</section>,
}));

vi.mock("../ThemeToggleButton", () => ({
  ThemeToggleButton: () => <button type="button">Theme</button>,
}));

describe("WelcomeScreen landing experience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.setItem("kite-onboarding-seen", "true");
  });

  it("shows the kinetic flight path and tour-style hero preview on the landing page", () => {
    render(<WelcomeScreen />);

    expect(
      screen.getByRole("region", { name: "Kite content flight path" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("region", { name: "Live editor motion preview" }),
    ).not.toBeInTheDocument();

    const heroTour = screen.getByRole("region", {
      name: "First launch tour walkthrough",
    });
    expect(heroTour).toBeInTheDocument();
    expect(within(heroTour).getByText("03 / 05")).toBeInTheDocument();
    expect(
      within(heroTour).getByRole("button", { name: /Add captions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Auto-adapt")).toBeInTheDocument();
    expect(screen.getByText("Ready to post")).toBeInTheDocument();
  });

  it("embeds the five-step launch tour on the main landing page", () => {
    render(<WelcomeScreen />);

    const tour = screen.getByRole("region", {
      name: "First launch tour walkthrough",
    });

    expect(tour).toBeInTheDocument();
    expect(
      within(tour).getByRole("heading", {
        name: "Make your first edit in five moves.",
      }),
    ).toBeInTheDocument();
    expect(
      within(tour).getByRole("button", { name: /Start with media/i }),
    ).toBeInTheDocument();
    expect(
      within(tour).getByRole("button", { name: /Shape the timeline/i }),
    ).toBeInTheDocument();
    expect(
      within(tour).getByRole("button", { name: /Add captions/i }),
    ).toBeInTheDocument();
    expect(
      within(tour).getByRole("button", { name: /Polish the look/i }),
    ).toBeInTheDocument();
    expect(
      within(tour).getByRole("button", { name: /Export locally/i }),
    ).toBeInTheDocument();
  });

  it("places the onboarding tour before the app-store copy block", () => {
    render(<WelcomeScreen />);

    const tour = screen.getByRole("region", {
      name: "First launch tour walkthrough",
    });
    const copy = screen.getByText("One editor. Every device.");

    expect(
      tour.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("links the GitHub button to the Kite repository", () => {
    render(<WelcomeScreen />);

    expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
      "href",
      "https://github.com/twerpygeek/kite-video",
    );
  });

  it("links to the tutorial from the landing navigation", () => {
    render(<WelcomeScreen />);

    expect(screen.getByRole("link", { name: /Tutorial/i })).toHaveAttribute(
      "href",
      "#/tutorial",
    );
  });

  it("offers the macOS app download from the hero actions", () => {
    render(<WelcomeScreen />);

    expect(
      screen.getByRole("link", { name: /Download Mac app/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/twerpygeek/kite-video/releases/download/v0.1.0/Kite-0.1.0-arm64.dmg",
    );
  });
});
