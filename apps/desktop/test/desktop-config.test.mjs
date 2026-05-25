import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const desktopRoot = new URL("..", import.meta.url);

async function readJson(relativePath) {
  return JSON.parse(await readFile(new URL(relativePath, desktopRoot), "utf8"));
}

test("desktop package declares a Kite macOS Electron app", async () => {
  const pkg = await readJson("package.json");

  assert.equal(pkg.name, "@kite/desktop");
  assert.equal(pkg.productName, "Kite");
  assert.equal(pkg.main, "dist/main.js");
  assert.match(pkg.build.appId, /^com\.iangoh\.kite/);
  assert.deepEqual(pkg.build.mac.target, ["zip"]);
  assert.ok(pkg.scripts.build.includes("tsc"));
  assert.ok(pkg.scripts.dist.includes("scripts/build-mac.mjs"));
  assert.ok(pkg.scripts.dist.includes("scripts/create-dmg.mjs"));
  assert.ok(pkg.scripts["dist:dir"].includes("scripts/build-mac.mjs"));
});

test("desktop shell uses a secure browser window and loads the built web app", async () => {
  const mainSource = await readFile(new URL("src/main.ts", desktopRoot), "utf8");

  assert.match(mainSource, /contextIsolation:\s*true/);
  assert.match(mainSource, /nodeIntegration:\s*false/);
  assert.match(mainSource, /sandbox:\s*true/);
  assert.match(mainSource, /getWebIndexPath\(\):\s*string/);
  assert.match(mainSource, /index\.html/);
  assert.match(mainSource, /loadFile\(getWebIndexPath\(\)/);
  assert.match(mainSource, /Cross-Origin-Opener-Policy/);
  assert.match(mainSource, /Cross-Origin-Embedder-Policy/);
});

test("desktop preload exposes a minimal Kite runtime contract", async () => {
  const preloadSource = await readFile(
    new URL("src/preload.ts", desktopRoot),
    "utf8",
  );

  assert.match(preloadSource, /contextBridge\.exposeInMainWorld/);
  assert.match(preloadSource, /platform:\s*process\.platform/);
  assert.doesNotMatch(preloadSource, /ipcRenderer/);
});

test("desktop build has required branded assets", async () => {
  await access(new URL("assets/icon.png", desktopRoot));
  await access(new URL("assets/icon.icns", desktopRoot));
  await access(join(desktopRoot.pathname, "../web/dist/index.html"));
});
