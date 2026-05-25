#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const appPath = resolve("release/mac-arm64/Kite.app");
const dmgPath = resolve("release/Kite-0.1.0-arm64.dmg");

if (process.platform !== "darwin") {
  console.error("DMG creation requires macOS.");
  process.exit(1);
}

if (!existsSync(appPath)) {
  console.error(`Cannot create DMG because ${appPath} does not exist.`);
  process.exit(1);
}

if (existsSync(dmgPath)) {
  rmSync(dmgPath, { force: true });
}

const result = spawnSync(
  "hdiutil",
  [
    "create",
    "-volname",
    "Kite",
    "-srcfolder",
    appPath,
    "-ov",
    "-format",
    "UDZO",
    dmgPath,
  ],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
