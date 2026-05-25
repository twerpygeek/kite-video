import { describe, expect, it } from "vitest";
import { ONBOARDING_STEPS } from "./onboarding-tour-content";

describe("ONBOARDING_STEPS", () => {
  it("uses five distinct tutorial images", () => {
    expect(ONBOARDING_STEPS).toHaveLength(5);

    const imageSources = ONBOARDING_STEPS.map((step) => step.imageSrc);

    expect(new Set(imageSources).size).toBe(5);
    imageSources.forEach((src) => {
      expect(src).toMatch(/^\/brand\/onboarding\/.+\.webp$/);
    });
  });
});
