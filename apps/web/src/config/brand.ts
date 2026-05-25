export const BRAND = {
  name: "Kite",
  shortName: "Kite",
  domain: "https://kitevideo.iangoh.com",
  githubUrl: "https://github.com/twerpygeek/kite-video",
  tagline: "Create once. Let it fly.",
  heroLine: "Turn one idea into platform-ready posts for every channel.",
  heroHeadline: "No app store. No download. Just edit.",
  lockupLabel: "AI video workflow",
  heroCopy:
    "Install Kite in about 5 seconds on iOS, Android, or desktop. Drop in one idea, use Kite AI to shape platform-ready cuts and captions, then keep control of every version.",
  description:
    "Kite is a PWA-first video editor for creators who want phone-to-desktop editing and platform-ready posts without app-store friction.",
  proofPoints: [
    "Install in about 5 seconds",
    "No app store account",
    "Same workflow on phone, tablet, and desktop",
    "Local files stay on your device",
  ],
  markSrc: "/brand/kite-mark.svg",
  ogImage: "/brand/kite-og.png",
  appleTouchIcon: "/icons/apple-touch-icon.png",
  icon192: "/icons/icon-192.png",
  icon512: "/icons/icon-512.png",
  maskableIcon: "/icons/maskable-icon-512.png",
} as const;

export const PWA_INSTALL_STEPS = {
  ios: [
    "Open Kite in Safari.",
    "Tap Share, then Add to Home Screen.",
    "Launch Kite from the new home-screen icon.",
  ],
  android: [
    "Open Kite in Chrome.",
    "Tap Install app when prompted, or choose Install app from the menu.",
    "Launch Kite from your home screen and keep editing.",
  ],
} as const;
