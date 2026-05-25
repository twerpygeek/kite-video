import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditorInterface } from "./EditorInterface";

const mockInitialize = vi.fn().mockResolvedValue(undefined);
const mockInitializeAutoSave = vi.fn().mockResolvedValue(undefined);
const mockUpdateClipKeyframes = vi.fn();
const mockSetShowShortcutsOverlay = vi.fn();
const mockSetKeyframeEditorOpen = vi.fn();
const mockSetPanelVisible = vi.fn();

const projectState = {
  project: {
    name: "Mobile Draft",
    settings: { width: 1080, height: 1920, frameRate: 30 },
    timeline: { duration: 12, tracks: [] },
  },
  initializeAutoSave: mockInitializeAutoSave,
  updateClipKeyframes: mockUpdateClipKeyframes,
};

const uiState = {
  showShortcutsOverlay: false,
  setShowShortcutsOverlay: mockSetShowShortcutsOverlay,
  keyframeEditorOpen: false,
  setKeyframeEditorOpen: mockSetKeyframeEditorOpen,
  getSelectedClipIds: () => [],
  panels: { audioMixer: { visible: false } },
  setPanelVisible: mockSetPanelVisible,
};

const engineState = {
  initialize: mockInitialize,
  initialized: true,
  initializing: false,
  initError: null,
};

vi.mock("../../stores/project-store", () => ({
  useProjectStore: Object.assign(
    (selector?: (state: typeof projectState) => unknown) =>
      selector ? selector(projectState) : projectState,
    {
      getState: () => projectState,
    },
  ),
}));

vi.mock("../../stores/ui-store", () => ({
  useUIStore: (selector?: (state: typeof uiState) => unknown) =>
    selector ? selector(uiState) : uiState,
}));

vi.mock("../../stores/engine-store", () => ({
  useEngineStore: Object.assign(() => engineState, {
    getState: () => engineState,
    subscribe: vi.fn(),
  }),
}));

vi.mock("../../hooks/useKeyboardShortcuts", () => ({
  useKeyboardShortcuts: () => ({
    showShortcutsOverlay: false,
    setShowShortcutsOverlay: mockSetShowShortcutsOverlay,
  }),
}));

vi.mock("../../bridges/playback-bridge", () => ({
  initializePlaybackBridge: vi.fn().mockResolvedValue(undefined),
  disposePlaybackBridge: vi.fn(),
}));

vi.mock("../../bridges/media-bridge", () => ({
  initializeMediaBridge: vi.fn().mockResolvedValue(undefined),
  disposeMediaBridge: vi.fn(),
}));

vi.mock("../../bridges/render-bridge", () => ({
  initializeRenderBridge: vi.fn().mockResolvedValue(undefined),
  disposeRenderBridge: vi.fn(),
}));

vi.mock("../../bridges/effects-bridge", () => ({
  initializeEffectsBridge: vi.fn().mockResolvedValue(undefined),
  disposeEffectsBridge: vi.fn(),
}));

vi.mock("../../bridges/transition-bridge", () => ({
  initializeTransitionBridge: vi.fn(),
  disposeTransitionBridge: vi.fn(),
}));

vi.mock("./Toolbar", () => ({
  Toolbar: () => (
    <header data-testid="toolbar">
      <button type="button">Export video</button>
    </header>
  ),
}));

vi.mock("./AssetsPanel", () => ({
  AssetsPanel: () => <section>Media library panel</section>,
}));

vi.mock("./Preview", () => ({
  Preview: () => <section>Video preview panel</section>,
}));

vi.mock("./InspectorPanel", () => ({
  InspectorPanel: () => <section>Inspector controls panel</section>,
}));

vi.mock("./Timeline", () => ({
  Timeline: () => <section>Timeline editor panel</section>,
}));

vi.mock("./AIGenTab", () => ({
  AIGenTab: () => <section>AI tools panel</section>,
}));

vi.mock("./KeyframeEditorPanel", () => ({
  KeyframeEditorPanel: () => <section>Keyframe editor panel</section>,
}));

vi.mock("../audio-mixer", () => ({
  AudioMixer: () => <section>Audio mixer panel</section>,
}));

vi.mock("./KeyboardShortcutsOverlay", () => ({
  KeyboardShortcutsOverlay: () => null,
}));

vi.mock("./tour", () => ({
  SpotlightTour: () => null,
  MoGraphTour: () => null,
}));

function setMobileViewport() {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    value: 390,
  });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("767px"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("EditorInterface mobile layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMobileViewport();
  });

  it("uses a mobile editor shell with preview, timeline, tabs, and a reachable export action", async () => {
    render(<EditorInterface />);

    const workspace = await screen.findByRole("region", {
      name: "Mobile editor workspace",
    });

    expect(workspace).toBeInTheDocument();
    expect(screen.getByTestId("toolbar")).toHaveTextContent("Export video");
    expect(screen.getByText("Video preview panel")).toBeInTheDocument();
    expect(screen.getByText("Timeline editor panel")).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Media" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Media library panel")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Edit" }));
    await waitFor(() => {
      expect(screen.getByText("Inspector controls panel")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: "AI" }));
    await waitFor(() => {
      expect(screen.getByText("AI tools panel")).toBeInTheDocument();
    });
  }, 15000);
});
