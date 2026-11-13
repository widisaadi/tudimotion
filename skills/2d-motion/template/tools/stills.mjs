// Renders still frames for visual QA and joins them into a contact sheet.
//   node tools/stills.mjs                 -> one still per scene (at 75% of the scene) -> out/qa/sheet.jpg
//   node tools/stills.mjs 120 480 1210    -> those absolute frames
// Open the sheet image and check it against references/qa-checklist.md before rendering the video.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env.mjs";

const timing = JSON.parse(fs.readFileSync("src/timing.json", "utf8"));
let frames = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
if (!frames.length) {
  let start = 0;
  frames = timing.scenes.map((d) => {
    const f = start + Math.round(d * 0.75);
    start += d - timing.transition;
    return f;
  });
}
const browserExecutable = env.REMOTION_BROWSER || null;
fs.mkdirSync("out/qa", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Main", browserExecutable });
const files = [];
for (const frame of frames) {
  const output = `out/qa/f${frame}.jpg`;
  await renderStill({ serveUrl, composition, frame, output, imageFormat: "jpeg", scale: 0.5, browserExecutable });
  files.push(output);
  console.log("still", frame);
}
const rows = [];
for (let i = 0; i < files.length; i += 5) rows.push(files.slice(i, i + 5));
const rowFiles = rows.map((r, k) => {
  const out = `out/qa/row${k}.jpg`;
  const pad = r.length < 5 ? `,pad=${5 * 540}:960:0:0:white` : "";
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...r.flatMap((f) => ["-i", f]), "-filter_complex", `${r.length > 1 ? `hstack=inputs=${r.length}` : "null"}${pad}`, out]);
  return out;
});
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...rowFiles.flatMap((f) => ["-i", f]), "-filter_complex", rowFiles.length > 1 ? `vstack=inputs=${rowFiles.length}` : "null", "out/qa/sheet.jpg"]);
console.log("contact sheet: out/qa/sheet.jpg");
