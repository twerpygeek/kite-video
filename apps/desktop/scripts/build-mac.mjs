#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function findCommand(command) {
  const result = spawnSync("which", [command], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

async function withPythonShim() {
  if (findCommand("python")) {
    return { cleanup: async () => {}, pathPrefix: "" };
  }

  const python3 = findCommand("python3");
  if (!python3) {
    return { cleanup: async () => {}, pathPrefix: "" };
  }

  const shimDir = await mkdtemp(join(tmpdir(), "kite-electron-python-"));
  await symlink(python3, join(shimDir, "python"));

  return {
    cleanup: async () => {
      await rm(shimDir, { force: true, recursive: true });
    },
    pathPrefix: shimDir,
  };
}

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const { cleanup, pathPrefix } = await withPythonShim();

try {
  const result = spawnSync(
    pnpmCommand,
    ["exec", "electron-builder", ...process.argv.slice(2)],
    {
      env: {
        ...process.env,
        CSC_IDENTITY_AUTO_DISCOVERY:
          process.env.CSC_IDENTITY_AUTO_DISCOVERY ?? "false",
        PATH: pathPrefix
          ? `${pathPrefix}:${process.env.PATH ?? ""}`
          : process.env.PATH,
      },
      stdio: "inherit",
    },
  );

  process.exit(result.status ?? 1);
} finally {
  await cleanup();
}
