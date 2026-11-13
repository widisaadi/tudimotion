// Transcribes each VO file with a Gemini text model and compares it word-by-word with the script.
import fs from "node:fs";
import { env } from "./env.mjs";
const key = env.GEMINI_API_KEY;
const cfg = JSON.parse(fs.readFileSync("audio/voiceover.json", "utf8"));
const model = process.argv[2] || "gemini-2.5-flash";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [i, text] of cfg.scenes.entries()) {
  const data = fs.readFileSync(`public/vo/s${i + 1}.wav`).toString("base64");
  let out;
  for (let a = 0; a < 6; a++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType: "audio/wav", data } }, { text: "Transcribe this Indonesian speech verbatim. Output only the transcript." }] }], generationConfig: { temperature: 0 } }),
    });
    const j = await r.json();
    if (j?.error?.code === 429) { await wait(20000); continue; }
    out = j?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? JSON.stringify(j).slice(0, 200);
    break;
  }
  const same = norm(out) === norm(text);
  console.log(`s${i + 1} ${same ? "MATCH" : "DIFF"}${same ? "" : `\n   script: ${norm(text)}\n   heard : ${norm(out)}`}`);
}
