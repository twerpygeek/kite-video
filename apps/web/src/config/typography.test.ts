import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Kite typography", () => {
  it("uses Geist as the premium product UI typeface", () => {
    const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");
    const tailwindConfig = readFileSync(
      resolve(process.cwd(), "tailwind.config.js"),
      "utf8",
    );

    expect(css).toContain("family=Geist:wght@400;500;600;700;800");
    expect(css).toContain('font-family: "Geist"');
    expect(tailwindConfig).toContain("sans: ['Geist'");
    expect(tailwindConfig).toContain("display: ['Geist'");
  });
});
