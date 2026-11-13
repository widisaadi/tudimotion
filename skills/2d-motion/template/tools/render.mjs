// Renders out/video.mp4 with Remotion (uses REMOTION_BROWSER from .env when set).
import { spawnSync } from "node:child_process";
import { env } from "./env.mjs";
const r = spawnSync("npx", ["remotion", "render", "Main", process.argv[2] || "out/video.mp4", "--log=error"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, ...(env.REMOTION_BROWSER ? { REMOTION_BROWSER: env.REMOTION_BROWSER } : {}) },
});
process.exit(r.status ?? 1);
