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
});
