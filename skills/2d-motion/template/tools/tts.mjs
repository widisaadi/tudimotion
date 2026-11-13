// One WAV per scene with Gemini TTS. Text is sent verbatim (no style prompt) so the voice adds no words.
// Usage: node tools/tts.mjs [sceneNumbers...]
import fs from "node:fs";
import { env } from "./env.mjs";
const key = env.GEMINI_API_KEY;
if (!key) { console.error("GEMINI_API_KEY missing: put it in .env (see .env.example)"); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync("audio/voiceover.json", "utf8"));
const only = process.argv.slice(2).map(Number);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync("public/vo", { recursive: true });
for (const [i, text] of cfg.scenes.entries()) {
  if (only.length && !only.includes(i + 1)) continue;
  let done = false;
  for (let attempt = 0; attempt < 10 && !done; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${cfg.model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: { temperature: cfg.temperature, responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: cfg.voice } } } },
      }),
    });
    const j = await res.json();
    if (j?.error?.code === 429) { console.log(`s${i + 1}: rate-limited (free tier = 3/min), waiting 25 s`); await wait(25000); continue; }
    const part = j?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!part) { console.error(`s${i + 1} failed:`, JSON.stringify(j).slice(0, 300)); process.exitCode = 1; break; }
    const buf = Buffer.from(part.inlineData.data, "base64");
    // Some models return raw 16-bit PCM (audio/L16) instead of WAV: wrap it.
    const mime = part.inlineData.mimeType || "";
    const out = mime.includes("wav") ? buf : pcmToWav(buf, Number((mime.match(/rate=(\d+)/) || [])[1] || 24000));
    fs.writeFileSync(`public/vo/s${i + 1}.wav`, out);
    console.log(`s${i + 1} ok`);
    done = true;
  }
}
function pcmToWav(pcm, rate) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}
