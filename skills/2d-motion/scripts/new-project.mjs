// Copies the 2d-motion template into a new folder.
// Usage: node <skill>/scripts/new-project.mjs <target-dir>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "..", "template");
const dst = path.resolve(process.argv[2] || "2d-motion-video");
const SKIP = new Set(["node_modules", "out", ".env", "vo", "audio"]);
if (fs.existsSync(dst) && fs.readdirSync(dst).length) {
  console.error(`${dst} exists and is not empty: choose a new folder`);
  process.exit(1);
}
function copy(from, to, rel = "") {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const r = path.posix.join(rel, e.name);
    // skip generated media and secrets; keep the audio/ JSON config folder at the root
    if (SKIP.has(e.name) && !(e.name === "audio" && rel === "")) continue;
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) copy(a, b, r);
    else fs.copyFileSync(a, b);
  }
}
copy(src, dst);
if (!fs.existsSync(path.join(dst, ".env"))) fs.copyFileSync(path.join(dst, ".env.example"), path.join(dst, ".env"));
fs.mkdirSync(path.join(dst, "public", "vo"), { recursive: true });
console.log(`template copied to ${dst}
next:
  cd "${dst}" && npm install
  put GEMINI_API_KEY (and EARSHOT_PY) in .env
  write audio/voiceover.json + storyboard.md, then: npm run tts && npm run verify-vo && npm run beats -- --apply`);
