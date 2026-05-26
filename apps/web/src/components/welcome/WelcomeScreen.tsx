import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Clapperboard,
  Download,
  GraduationCap,
  FolderOpen,
  Github,
  Layers,
  LockKeyhole,
  Monitor,
  Pause,
  Play,
  Scissors,
  Smartphone,
  Square,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { Button, Switch, Label } from "@openreel/ui";
import { useProjectStore } from "../../stores/project-store";
import { useUIStore } from "../../stores/ui-store";
import { SOCIAL_MEDIA_PRESETS, type SocialMediaCategory } from "@openreel/core";
import { TemplateGallery } from "./TemplateGallery";
import { RecentProjects } from "./RecentProjects";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { MobileInstallGuide } from "../MobileInstallGuide";
import { BRAND } from "../../config/brand";
import { useRouter } from "../../hooks/use-router";
import { useEditorPreload } from "../../hooks/useEditorPreload";
import { useAnalytics, AnalyticsEvents } from "../../hooks/useAnalytics";
import { ONBOARDING_STEPS } from "./onboarding-tour-content";
import { KiteCursorGuide } from "./KiteCursorGuide";

interface FormatOption {
  id: string;
  preset: SocialMediaCategory;
  label: string;
  description: string;
  dimensions: string;
  icon: React.ElementType;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: "vertical",
    preset: "tiktok",
    label: "Vertical",
    description: "Reels, Shorts, TikTok",
    dimensions: "1080 x 1920",
    icon: Smartphone,
  },
  {
    id: "horizontal",
    preset: "youtube-video",
    label: "Horizontal",
    description: "YouTube, Vimeo, Web",
    dimensions: "1920 x 1080",
    icon: Monitor,
  },
  {
    id: "square",
    preset: "instagram-post",
    label: "Square",
    description: "Posts, Ads, Social",
    dimensions: "1080 x 1080",
    icon: Square,
  },
];

const FEATURE_POINTS = [
  {
    title: "Local-First",
    description: "Your source files stay on your device while you edit.",
    icon: LockKeyhole,
  },
  {
    title: "GPU-Aware",
    description: "Browser rendering keeps timeline previews responsive.",
    icon: Zap,
  },
  {
    title: "Creator Scale",
    description: "Captions, audio, graphics, templates, and social exports.",
    icon: WandSparkles,
  },
];

const STUDIO_CAPABILITIES = [
  "Multi-track timeline",
  "Color grading",
  "Beat detection",
  "Auto captions",
  "Screen recording",
  "4K export",
];

const FLIGHT_STEPS = [
  {
    eyebrow: "Draft",
    title: "Original idea",
    detail: "Drop a clip, script, or screen take.",
    color: "#4AA8FF",
  },
  {
    eyebrow: "Kite AI",
    title: "Auto-adapt",
    detail: "Shape captions, cuts, and aspect ratios.",
    color: "#6C5CFF",
  },
  {
    eyebrow: "Channels",
    title: "Ready to post",
    detail: "Review each version before it flies.",
    color: "#42E0C0",
  },
];

const PLATFORM_CHIPS = ["TikTok", "Reels", "Shorts", "LinkedIn", "X"];

type ViewMode = "home" | "templates" | "recent";

interface WelcomeScreenProps {
  initialTab?: "templates" | "recent";
}

const BRAND_NAME = BRAND.name;
const BRAND_MARK_SRC = BRAND.markSrc;
const ONBOARDING_SEEN_KEY = "kite-onboarding-seen";

const BrandLockup: React.FC<{ compact?: boolean; inverted?: boolean }> = ({
  compact = false,
  inverted = false,
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-lg border border-[#0B1020]/10 bg-white dark:border-white/10 ${
        compact ? "h-10 w-10" : "h-12 w-12"
      }`}
    >
      <img
        src={BRAND_MARK_SRC}
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
    <div className="leading-none">
      <p
        className={`font-semibold ${inverted ? "text-[#F7FBFF]" : "text-[#0B1020] dark:text-[#F7FBFF]"} ${
          compact ? "text-lg" : "text-xl"
        }`}
      >
        {BRAND_NAME}
      </p>
      {!compact && (
        <p className={`mt-1 text-xs font-medium ${inverted ? "text-[#4AA8FF]" : "text-[#6C5CFF] dark:text-[#4AA8FF]"}`}>
          {BRAND.lockupLabel}
        </p>
      )}
    </div>
  </div>
);

const KineticFlightPath: React.FC = () => (
  <motion.section
    aria-label="Kite content flight path"
    role="region"
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.28 }}
    className="relative mt-8 overflow-hidden rounded-lg border border-[#0B1020]/10 bg-white p-4 shadow-[0_18px_45px_rgba(11,16,32,0.08)] dark:border-white/10 dark:bg-background-secondary dark:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
  >
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4AA8FF] to-transparent" />
    <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 640 190"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M34 134 C 174 18, 298 178, 456 70 S 590 86, 616 42"
          fill="none"
          stroke="url(#flightGradient)"
          strokeDasharray="10 14"
          strokeWidth="2.4"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -72 }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />
        <defs>
          <linearGradient id="flightGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#4AA8FF" stopOpacity="0.22" />
            <stop offset="48%" stopColor="#6C5CFF" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#42E0C0" stopOpacity="0.28" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div className="relative grid gap-3 md:grid-cols-3">
      {FLIGHT_STEPS.map((step, index) => (
        <motion.div
          key={step.title}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="group rounded-lg border border-[#0B1020]/10 bg-[#F7FBFF]/92 p-4 shadow-[0_1px_0_rgba(11,16,32,0.08)] dark:border-white/10 dark:bg-background-tertiary/84"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="rounded-md px-2 py-1 text-xs font-semibold text-[#0B1020]"
              style={{ backgroundColor: step.color }}
            >
              {step.eyebrow}
            </span>
            <motion.span
              aria-hidden="true"
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
                delay: index * 0.24,
              }}
              className="text-[#6C5CFF] dark:text-primary"
            >
              <ArrowRight size={16} />
            </motion.span>
          </div>
          <h2 className="mt-5 text-base font-semibold text-[#0B1020] dark:text-text-primary">
            {step.title}
          </h2>
          <p className="mt-2 min-h-10 text-sm leading-5 text-[#5F6B7A] dark:text-text-secondary">
            {step.detail}
          </p>
        </motion.div>
      ))}
    </div>

    <div className="relative mt-4 flex flex-wrap items-center gap-2">
      {PLATFORM_CHIPS.map((platform, index) => (
        <motion.span
          key={platform}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.42 + index * 0.07 }}
          className="rounded-md border border-[#0B1020]/10 bg-[#EEF6FF] px-3 py-1.5 text-xs font-semibold text-[#0B1020] dark:border-white/10 dark:bg-background-elevated dark:text-text-primary"
        >
          {platform}
        </motion.span>
      ))}
    </div>
  </motion.section>
);

const LaunchTourSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(2);
  const active = ONBOARDING_STEPS[activeStep];
  const ActiveIcon = active.icon;

  return (
    <motion.section
      aria-label="First launch tour walkthrough"
      role="region"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
      className="mx-auto w-full max-w-[1040px] text-[#F7FBFF]"
    >
      <div className="grid overflow-hidden rounded-lg border border-white/10 bg-[#10182D] shadow-[0_28px_80px_rgba(11,16,32,0.35)] md:grid-cols-[0.92fr_1.08fr]">
        <div className="relative min-h-[480px] overflow-hidden border-b border-white/10 md:border-b-0 md:border-r lg:min-h-[620px]">
          <motion.img
            key={active.imageSrc}
            src={active.imageSrc}
            alt={active.imageAlt}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 0.82, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020]/14 via-[#0B1020]/38 to-[#0B1020]/88" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#0B1020]/72 to-transparent" />

          <div className="relative flex h-full min-h-[480px] flex-col justify-between p-5 sm:p-7 lg:min-h-[620px]">
            <div className="flex items-center justify-between gap-4">
              <BrandLockup compact inverted />
              <div className="rounded-md bg-white px-4 py-2 text-sm font-extrabold text-[#0B1020] shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:text-base">
                {String(activeStep + 1).padStart(2, "0")} /{" "}
                {String(ONBOARDING_STEPS.length).padStart(2, "0")}
              </div>
            </div>

            <div className="space-y-4">
              <motion.div
                key={active.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg border border-white/12 bg-[#10182D]/82 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.3)] backdrop-blur-md"
              >
                <div
                  className="grid h-16 w-16 place-items-center rounded-md bg-white"
                  style={{ color: active.accent }}
                >
                  <ActiveIcon size={28} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#F7FBFF]">
                    {active.title}
                  </h2>
                  <p className="mt-2 text-base leading-6 text-[#DDE7F2]">
                    {active.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-[#0E1730] p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-bold text-[#6C5CFF]">
            First launch tour
          </p>
          <h2 className="mt-5 max-w-md font-display text-4xl font-semibold leading-tight text-[#F7FBFF] sm:text-5xl xl:text-6xl">
            Make your first edit in five moves.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#C7D1DF]">
            This startup walkthrough mirrors the editor workflow: gather assets,
            cut the timeline, style the story, then export.
          </p>

          <div className="mt-8 space-y-3">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <button
                  key={step.title}
                  onClick={() => {
                    setActiveStep(index);
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4AA8FF] ${
                    isActive
                      ? "border-[#4AA8FF] bg-[#20345F]"
                      : "border-white/10 bg-[#17223E] hover:border-[#4AA8FF]/70 hover:bg-[#1B294B]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#080C18]"
                      style={{ color: step.accent }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#F7FBFF]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#C7D1DF]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const active = ONBOARDING_STEPS[activeStep];
  const ActiveIcon = active.icon;

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % ONBOARDING_STEPS.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [isOpen, isPlaying]);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setIsPlaying(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] grid place-items-center bg-[#0B1020]/72 px-4 py-6 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid max-h-[92svh] w-full max-w-5xl overflow-hidden rounded-lg border border-[#0B1020]/10 bg-[#F7FBFF] text-[#0B1020] shadow-2xl shadow-black/25 dark:border-white/10 dark:bg-background-secondary dark:text-text-primary lg:grid-cols-[1.2fr_0.8fr]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-md border border-[#0B1020]/10 bg-white text-[#0B1020] transition hover:bg-[#4AA8FF]/20 dark:border-white/10 dark:bg-background-tertiary dark:text-text-primary"
          aria-label="Close onboarding"
        >
          <X size={17} />
        </button>

        <div className="relative min-h-[420px] overflow-hidden bg-[#0B1020] p-5 text-[#F7FBFF] sm:p-6">
          <motion.img
            key={active.imageSrc}
            src={active.imageSrc}
            alt={active.imageAlt}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 0.72, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020]/35 via-[#0B1020]/62 to-[#0B1020]/84" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="mb-5 flex items-center justify-between pr-12">
              <BrandLockup compact inverted />
              <div className="rounded-md border border-white/10 bg-white px-3 py-1 text-xs font-semibold text-[#0B1020]">
                {String(activeStep + 1).padStart(2, "0")} /{" "}
                {String(ONBOARDING_STEPS.length).padStart(2, "0")}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-lg border border-white/12 bg-[#0B1020]/72 p-4 backdrop-blur-md">
                <div
                  className="grid h-12 w-12 place-items-center rounded-md bg-white"
                  style={{ color: active.accent }}
                >
                  <ActiveIcon size={22} />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#F7FBFF]">
                    {active.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#DDE7F2]">
                    {active.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <button
                  onClick={() => setIsPlaying((value) => !value)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-[#4AA8FF] text-[#0B1020]"
                  aria-label={isPlaying ? "Pause onboarding" : "Play onboarding"}
                >
                  {isPlaying ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" />
                  )}
                </button>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    key={activeStep}
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "18%" }}
                    transition={{ duration: isPlaying ? 3.2 : 0.2, ease: "linear" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: active.accent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          <p className="mb-3 text-sm font-semibold text-[#6C5CFF]">
            First launch tour
          </p>
          <h2
            id="onboarding-title"
            className="max-w-sm text-3xl font-semibold text-[#0B1020] dark:text-text-primary"
          >
            Make your first edit in five moves.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#5F6B7A] dark:text-text-secondary">
            This startup walkthrough mirrors the editor workflow: gather assets,
            cut the timeline, style the story, then export.
          </p>

          <div className="mt-7 space-y-3">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;

              return (
                <button
                  key={step.title}
                  onClick={() => {
                    setActiveStep(index);
                    setIsPlaying(false);
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isActive
                      ? "border-[#4AA8FF] bg-[#4AA8FF]/15"
                      : "border-[#0B1020]/10 bg-white hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-tertiary dark:hover:bg-background-elevated"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#0B1020]"
                      style={{ color: step.accent }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0B1020] dark:text-text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-[#5F6B7A] dark:text-text-secondary">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              onClick={onCreateProject}
              className="bg-[#4AA8FF] text-[#0B1020] hover:bg-[#8CC9FF]"
            >
              <Scissors size={16} />
              Start editing
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#0B1020]/15 bg-white text-[#0B1020] hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-tertiary dark:text-text-primary dark:hover:bg-background-elevated"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ initialTab }) => {
  const setSkipWelcomeScreen = useUIStore(
    (state) => state.setSkipWelcomeScreen,
  );
  const skipWelcomeScreen = useUIStore((state) => state.skipWelcomeScreen);
  const createNewProject = useProjectStore((state) => state.createNewProject);
  const { navigate } = useRouter();
  const { track } = useAnalytics();

  const [viewMode, setViewMode] = useState<ViewMode>(initialTab ?? "home");
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEditorPreload(true);

  const handleCreateProject = useCallback(
    (option: FormatOption) => {
      const preset = SOCIAL_MEDIA_PRESETS[option.preset];
      createNewProject(`New ${option.label} Video`, {
        width: preset.width,
        height: preset.height,
        frameRate: preset.frameRate,
      });
      track(AnalyticsEvents.PROJECT_CREATED, {
        preset: option.preset,
        width: preset.width,
        height: preset.height,
        frameRate: preset.frameRate ?? 30,
        source: "kite_home",
      });
      navigate("editor");
    },
    [createNewProject, navigate, track],
  );

  const handleTemplateApplied = useCallback(() => {
    navigate("editor");
  }, [navigate]);

  const handleProjectSelected = useCallback(() => {
    navigate("editor");
  }, [navigate]);

  const closeOnboarding = useCallback(() => {
    window.localStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewMode !== "home") {
          setViewMode("home");
        } else {
          navigate("editor");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, viewMode]);

  useEffect(() => {
    if (viewMode !== "home") return;
    if (window.localStorage.getItem(ONBOARDING_SEEN_KEY) === "true") {
      return;
    }

    const timeout = window.setTimeout(() => setShowOnboarding(true), 900);
    return () => window.clearTimeout(timeout);
  }, [viewMode]);

  if (viewMode === "templates") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F7FBFF] text-[#0B1020] dark:bg-background dark:text-text-primary">
        <header className="flex items-center justify-between border-b border-[#0B1020]/10 px-6 py-4 dark:border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("home")}
            className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
          >
            <ArrowRight className="rotate-180" size={16} />
            Back
          </Button>
          <BrandLockup compact />
          <div className="flex w-16 justify-end">
            <ThemeToggleButton />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <TemplateGallery onTemplateApplied={handleTemplateApplied} />
        </div>
      </div>
    );
  }

  if (viewMode === "recent") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#F7FBFF] text-[#0B1020] dark:bg-background dark:text-text-primary">
        <header className="flex items-center justify-between border-b border-[#0B1020]/10 px-6 py-4 dark:border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("home")}
            className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
          >
            <ArrowRight className="rotate-180" size={16} />
            Back
          </Button>
          <BrandLockup compact />
          <div className="flex w-16 justify-end">
            <ThemeToggleButton />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <RecentProjects onProjectSelected={handleProjectSelected} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[linear-gradient(180deg,#F7FBFF_0%,#EEF6FF_44%,#FFFFFF_100%)] text-[#0B1020] dark:bg-background dark:bg-none dark:text-text-primary">
      <header className="sticky top-0 z-20 border-b border-[#0B1020]/10 bg-[#F7FBFF]/92 backdrop-blur-xl dark:border-white/10 dark:bg-background/92">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <BrandLockup />
          <nav className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
            >
              <a href="#/tutorial">
                <GraduationCap size={16} />
                Tutorial
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("templates")}
              className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
            >
              <Layers size={16} />
              Templates
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("recent")}
              className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
            >
              <Clock size={16} />
              Recent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[#0B1020] hover:bg-[#4AA8FF]/15 dark:text-text-primary"
            >
              <a
                href={BRAND.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} />
                GitHub
              </a>
            </Button>
            <ThemeToggleButton />
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggleButton className="md:hidden" />
            <Button
              onClick={() => navigate("editor")}
              className="bg-[#0B1020] text-[#F7FBFF] hover:bg-[#23262c] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-hover"
            >
              <FolderOpen size={16} />
              Open editor
            </Button>
          </div>
        </div>
      </header>
      <KiteCursorGuide className="kite-cursor-guide--floating" />

      <main className="relative z-10">
        <section className="mx-auto flex min-h-[calc(100svh-120px)] max-w-7xl flex-col items-center gap-10 px-5 py-8 lg:px-8 lg:py-10">
          <LaunchTourSection />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.12,
            }}
            className="w-full max-w-5xl"
          >
            <div className="mx-auto max-w-3xl text-left sm:text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#0B1020]/10 bg-white px-3 py-1.5 text-sm font-medium text-[#0B1020] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary">
                <Clapperboard size={16} />
                {BRAND.tagline}
              </div>

              <h1 className="font-display text-5xl font-semibold text-[#0B1020] dark:text-text-primary sm:text-6xl lg:text-7xl">
                {BRAND_NAME}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl font-display text-2xl font-semibold leading-tight text-[#6C5CFF] dark:text-primary sm:text-3xl">
                {BRAND.heroLine}
              </p>
              <p className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight text-[#0B1020] dark:text-text-primary sm:text-4xl">
                {BRAND.heroHeadline}
              </p>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-[#4c4b49] dark:text-text-secondary">
                {BRAND.heroCopy}
              </p>
            </div>

            <div className="mx-auto mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
              {BRAND.proofPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-sm font-medium text-[#4c4b49] dark:text-text-secondary"
                >
                  <CheckCircle2 size={16} className="shrink-0 text-[#4AA8FF]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-start gap-3 sm:justify-center">
              <Button
                onClick={() => handleCreateProject(FORMAT_OPTIONS[0])}
                className="h-12 bg-[#4AA8FF] px-6 text-[#0B1020] hover:bg-[#8CC9FF]"
              >
                <Scissors size={17} />
                Start editing
                <ArrowRight size={17} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOnboarding(true)}
                className="h-12 border-[#0B1020]/15 bg-white px-6 text-[#0B1020] hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary dark:hover:bg-background-tertiary"
              >
                <Play size={17} />
                Watch tour
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-12 border-[#0B1020]/15 bg-white px-6 text-[#0B1020] hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary dark:hover:bg-background-tertiary"
              >
                <a href={BRAND.macDownloadUrl} target="_blank" rel="noreferrer">
                  <Download size={17} />
                  Download Mac app
                </a>
              </Button>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {FORMAT_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleCreateProject(option)}
                    className="group rounded-lg border border-[#0B1020]/10 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#4AA8FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4AA8FF] dark:border-white/10 dark:bg-background-secondary dark:hover:border-primary"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-md bg-[#0B1020] text-[#F7FBFF] dark:bg-background-tertiary dark:text-primary">
                        <Icon size={18} />
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[#6C5CFF] opacity-0 transition group-hover:opacity-100"
                      />
                    </div>
                    <h2 className="text-base font-semibold text-[#0B1020] dark:text-text-primary">
                      {option.label}
                    </h2>
                    <p className="mt-1 text-sm text-[#5F6B7A] dark:text-text-secondary">
                      {option.description}
                    </p>
                    <p className="mt-3 font-mono text-xs text-[#6C5CFF] dark:text-primary">
                      {option.dimensions}
                    </p>
                  </button>
                );
              })}
            </div>

            <KineticFlightPath />
          </motion.div>
        </section>

        <MobileInstallGuide />

        <section className="border-y border-[#0B1020]/10 bg-white text-[#0B1020] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary">
          <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 md:grid-cols-3 lg:px-8">
            {FEATURE_POINTS.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0B1020] text-[#4AA8FF] dark:bg-background-tertiary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-[#5F6B7A] dark:text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#F044A3]">
              What it does
            </p>
            <h2 className="mt-3 max-w-lg font-display text-4xl font-semibold text-[#0B1020] dark:text-text-primary">
              A focused web studio for clean, publish-ready edits.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STUDIO_CAPABILITIES.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-[#0B1020]/10 bg-white px-4 py-5 text-sm font-medium text-[#0B1020] shadow-[0_1px_0_rgba(8,9,12,0.08)] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-[#0B1020]/10 px-5 py-8 dark:border-white/10 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <BrandLockup compact />
            <div className="flex items-center gap-3">
              <ThemeToggleButton className="md:hidden" />
              <Switch
                id="skip-welcome"
                checked={skipWelcomeScreen}
                onCheckedChange={setSkipWelcomeScreen}
              />
              <Label
                htmlFor="skip-welcome"
                className="cursor-pointer text-sm text-[#5F6B7A] dark:text-text-secondary"
              >
                Skip startup screen
              </Label>
            </div>
          </div>
        </footer>
      </main>
      <OnboardingTourModal
        isOpen={showOnboarding}
        onClose={closeOnboarding}
        onCreateProject={() => {
          closeOnboarding();
          handleCreateProject(FORMAT_OPTIONS[0]);
        }}
      />
    </div>
  );
};

export default WelcomeScreen;
