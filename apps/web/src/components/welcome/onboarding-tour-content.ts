import type { ElementType } from "react";
import { Download, Scissors, Sparkles, Type, UploadCloud } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: ElementType;
  accent: string;
  imageSrc: string;
  imageAlt: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: "Start with media",
    description: "Drop in footage, stills, audio, or a screen recording.",
    icon: UploadCloud,
    accent: "#4AA8FF",
    imageSrc: "/brand/onboarding/tutorial-import.webp",
    imageAlt: "Mobile editor import view with media thumbnails and upload controls.",
  },
  {
    title: "Shape the timeline",
    description: "Trim clips, stack tracks, and line edits up to the beat.",
    icon: Scissors,
    accent: "#ff4e6b",
    imageSrc: "/brand/onboarding/tutorial-timeline.webp",
    imageAlt: "Mobile video timeline with trim handles, waveforms, and a playhead.",
  },
  {
    title: "Add captions",
    description: "Create titles, subtitles, graphics, and animated text.",
    icon: Type,
    accent: "#2d66ff",
    imageSrc: "/brand/onboarding/tutorial-captions.webp",
    imageAlt: "Mobile editor caption controls with text boxes and subtitle timing tracks.",
  },
  {
    title: "Polish the look",
    description: "Tune color, audio, motion, masks, effects, and transitions.",
    icon: Sparkles,
    accent: "#b85cff",
    imageSrc: "/brand/onboarding/tutorial-polish.webp",
    imageAlt: "Mobile editor polish panel with color, audio, motion, masks, and effects.",
  },
  {
    title: "Export locally",
    description: "Choose a format and render the finished cut from the browser.",
    icon: Download,
    accent: "#f9f5ec",
    imageSrc: "/brand/onboarding/tutorial-export.webp",
    imageAlt: "Mobile editor export sheet with format choices and render controls.",
  },
];
