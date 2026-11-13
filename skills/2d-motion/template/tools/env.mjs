// Reads .env (KEY=VALUE lines) without extra dependencies. Real environment variables win.
import fs from "node:fs";
export const env = (() => {
  const out = {};
  if (fs.existsSync(".env")) {
    for (const line of fs.readFileSync(".env", "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[2]) out[m[1]] = m[2];
    }
  }
  return { ...out, ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k in out || /^(GEMINI_API_KEY|REMOTION_BROWSER|EARSHOT_PY)$/.test(k))) };
})();
