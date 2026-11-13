// Reads public/vo/s<N>.wav, finds the spoken phrases (ffmpeg silencedetect) and writes src/beats.json:
//   beats.scenes[i].phrases[k] = { start, end } in frames INSIDE scene i+1 (VO start offset already added)
// Scene code keys every animation beat to these numbers (see references/scene-cookbook.md).
// --apply also rewrites src/timing.json scene lengths = voStart + VO length + tail, rounded up to 5 frames.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
const timing = JSON.parse(fs.readFileSync("src/timing.json", "utf8"));
const TAIL = Number(process.env.BEATS_TAIL ?? 24); // frames after the last word (lets the last animation land)
const apply = process.argv.includes("--apply");
const scenes = [];
for (let i = 0; i < timing.scenes.length; i++) {
  const f = `public/vo/s${i + 1}.wav`;
  const err = spawnSync("ffmpeg", ["-hide_banner", "-i", f, "-af", "silencedetect=noise=-35dB:d=0.22", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], { encoding: "utf8" }).trim());
  const starts = [...String(err).matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const ends = [...String(err).matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  // speech = gaps between silences
  const sil = starts.map((s, k) => [s, ends[k] ?? dur]);
  const phrases = [];
  let cur = 0;
  for (const [s, e] of sil) {
    if (s - cur > 0.12) phrases.push([cur, s]);
    cur = e;
  }
  if (dur - cur > 0.12) phrases.push([cur, dur]);
  const fr = (t) => Math.round(timing.voStart + t * timing.fps);
  scenes.push({ voFrames: Math.ceil(dur * timing.fps), phrases: phrases.map(([a, b]) => ({ start: fr(a), end: fr(b) })) });
}
fs.writeFileSync("src/beats.json", JSON.stringify({ fps: timing.fps, voStart: timing.voStart, scenes }, null, 1));
scenes.forEach((s, i) => console.log(`s${i + 1}: ${(s.voFrames / timing.fps).toFixed(2)} s  phrases ${s.phrases.map((p) => `${p.start}-${p.end}`).join("  ")}`));
if (apply) {
  timing.scenes = scenes.map((s) => Math.ceil((timing.voStart + s.voFrames + TAIL) / 5) * 5);
  fs.writeFileSync("src/timing.json", JSON.stringify(timing, null, 2) + "\n");
  console.log("timing.json scenes =", JSON.stringify(timing.scenes));
}
