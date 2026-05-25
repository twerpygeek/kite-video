import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Vercel asset upload rules", () => {
  it("does not ignore PNG assets needed for PWA icons and social previews", () => {
    const ignoreRules = readFileSync(
      resolve(process.cwd(), "../../.vercelignore"),
      "utf8",
    );

    expect(ignoreRules).toContain("node_modules/");
    expect(ignoreRules).not.toMatch(/(^|\n)\/?\*\.png($|\n)/);
  });
});
