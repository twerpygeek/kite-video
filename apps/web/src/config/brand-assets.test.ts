import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Kite brand assets", () => {
  it("uses a premium gradient kite mark instead of a flat tile", () => {
    const mark = readFileSync(
      resolve(process.cwd(), "public/brand/kite-mark.svg"),
      "utf8",
    );

    expect(mark).toContain("tileGlass");
    expect(mark).toContain("kiteTop");
    expect(mark).toContain("premium-rim");
  });

  it("keeps social and install metadata aligned with the current device promise", () => {
    const index = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "public/manifest.json"), "utf8"),
    ) as { description: string };

    expect(index).toContain('content="Kite - One editor. Every device."');
    expect(index).toContain("<title>Kite - One editor. Every device.</title>");
    expect(index).not.toContain("No app store. No download. Just edit.");
    expect(manifest.description).toContain("One editor. Every device.");
    expect(manifest.description).toContain("Mac");
  });
});
