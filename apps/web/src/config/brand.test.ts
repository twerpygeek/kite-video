import { describe, expect, it } from "vitest";
import { BRAND, PWA_INSTALL_STEPS } from "./brand";

describe("BRAND", () => {
  it("uses a distinct non-EditCut product name with PWA asset paths", () => {
    expect(BRAND.name).toBe("Kite");
    expect(BRAND.name).not.toMatch(/editcut|edits/i);
    expect(BRAND.domain).toBe("https://kitevideo.vercel.app");
    expect(BRAND.markSrc).toBe("/brand/kite-mark.svg");
    expect(BRAND.ogImage).toBe("/brand/kite-og.png");
    expect(BRAND.appleTouchIcon).toBe("/icons/apple-touch-icon.png");
    expect(BRAND.icon192).toBe("/icons/icon-192.png");
    expect(BRAND.icon512).toBe("/icons/icon-512.png");
    expect(BRAND.maskableIcon).toBe("/icons/maskable-icon-512.png");
  });

  it("uses clearer creator-focused ad copy", () => {
    expect(BRAND.tagline).toBe("Create once. Let it fly.");
    expect(BRAND.heroLine).toBe(
      "Turn one idea into platform-ready posts for every channel.",
    );
    expect(BRAND.heroHeadline).toBe("No app store. No download. Just edit.");
    expect(BRAND.heroCopy).toMatch(/Install Kite in about 5 seconds/i);
    expect(BRAND.heroCopy).toMatch(/Kite AI/i);
    expect(BRAND.heroCopy).toMatch(/iOS, Android, or desktop/i);
    expect(BRAND.description).toMatch(/PWA-first video editor/i);
    expect(BRAND.description).toMatch(/without app-store friction/i);
    expect(BRAND.proofPoints).toEqual([
      "Install in about 5 seconds",
      "No app store account",
      "Same workflow on phone, tablet, and desktop",
      "Local files stay on your device",
    ]);
  });

  it("documents install guidance for iOS and Android", () => {
    expect(PWA_INSTALL_STEPS.ios).toHaveLength(3);
    expect(PWA_INSTALL_STEPS.android).toHaveLength(3);
    expect(PWA_INSTALL_STEPS.ios.join(" ")).toMatch(/Open Kite in Safari/i);
    expect(PWA_INSTALL_STEPS.ios.join(" ")).toMatch(/Add to Home Screen/i);
    expect(PWA_INSTALL_STEPS.android.join(" ")).toMatch(/Install app/i);
  });
});
