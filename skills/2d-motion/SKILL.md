---
name: 2d-motion
description: Make a vertical 2D explainer video (Reels / TikTok / Shorts, 1080x1920) in a flat chibi-cartoon style with narration, sound effects and music - "what if…" topics, psychology / science / social explainers, story-driven educational shorts - rendered with Remotion, voiced with Gemini TTS and scored with the earshot sound bank. Use this whenever the user asks for an animated explainer, a "video animasi", a Reels/TikTok/Shorts explainer, a "bagaimana jika…" video, a cartoon story with a narrator, or says "pakai style 2d-motion", "style jujur-reels", or "seperti video sebelumnya" - even when they do not name Remotion, Gemini or earshot.
---

# 2d-motion: flat 2D chibi explainer for Reels

This skill reproduces one specific, finished house style. The goal is that any agent (Claude Code, Codex,
Antigravity, Gemini CLI, Cursor…) produces a video that looks and sounds like the reference
(`examples/jujur-reels/`), with the same attention to detail. Consistency comes from three things, in this order:

1. **The template is the style.** Characters, colours, fonts, captions, bubbles, springs, transitions and the
   audio pipeline are already code in `template/`. Reuse them; do not restyle or rewrite them.
2. **Data, not improvisation.** Script, timing, SFX and music live in JSON files. Scripts turn them into
   picture and sound deterministically.
3. **Measured QA.** Every video passes the same checklist (`references/qa-checklist.md`) on rendered stills and
   measured audio before it is delivered.

Read the reference files when the step below points at them; each one is short.

| file | read it when |
|---|---|
| `references/storytelling.md` | writing the script and storyboard (step 2) |
| `references/style-guide.md` | before writing any scene code (step 4) |
| `references/scene-cookbook.md` | while writing scenes: layouts, components, beat timing, examples |
| `references/audio.md` | voiceover, SFX and music (steps 3, 6) and installing earshot |
| `references/qa-checklist.md` | before showing anything to the user (steps 5, 7) |
| `references/harness-notes.md` | if a tool differs on your harness (paths, shells, long Windows paths) |

## Inputs to settle first

You need a **title / topic**. Everything else has a default; state the defaults you use in one line instead of
asking: format 1080x1920 30 fps, 80-110 s, Indonesian narration (match the user's language), Gemini TTS
`gemini-3.8-flash-tts`, voice `Rami`, temperature 0, earshot SFX + earshot-composed BGM. Ask only if the topic is
missing or the user named a different voice, language or length. If the user gives a reference video or image,
analyse it first and note what differs from this style (`references/style-guide.md`, "Adapting").

## Workflow

1. **New project.** Copy the template: `node <skill>/scripts/new-project.mjs <target-dir>`, then
   `cd <target-dir> && npm install`. Put the user's Gemini key in `.env` (copy `.env.example`); never write a key
   into any other file, commit, log or message.
2. **Script + storyboard.** Write `audio/voiceover.json` (one narration string per scene) and `storyboard.md`
   (per scene: what is on screen, which character does what, which line of narration each beat illustrates).
   Follow the 10-beat arc and the line rules in `references/storytelling.md`. Facts get a real, checkable source
   shown on screen; invented items are labelled `ILUSTRASI FIKSI` / `ILUSTRASI KONSEP`.
3. **Voiceover first.** `npm run tts` (one WAV per scene, text sent verbatim, no style prompt, temperature 0),
   then `npm run verify-vo` (transcribes and diffs against the script; only number/spelling formatting may differ),
   then `npm run beats -- --apply` (finds each spoken phrase, writes `src/beats.json`, sets scene lengths).
   Picture is timed to the voice, never the other way round. Re-run `beats` after every TTS regeneration
   (temperature 0 fixes the words, not the exact pacing).
4. **Scenes.** Rewrite `src/scenes/*.tsx` for the new story using only the components in `src/lib/`
   (`Chibi`, `Brain`, `Caption`, `Bubble`, `Source`, `Tag`, `Paper`, `Pop`) and the patterns in
   `references/scene-cookbook.md`. Every animation beat that illustrates a sentence starts at
   `beat(scene, phrase, offset)`. Keep `src/scenes/ScenesA.tsx` / `ScenesB.tsx` exporting components listed in
   `src/Video.tsx` (one per entry in `timing.json`). `npm run typecheck` must pass.
5. **Visual QA.** `npm run stills` renders one still per scene into `out/qa/sheet.jpg`. Open the image and check
   it against `references/qa-checklist.md` (overlaps, safe zones, text size, cropped characters, empty frames).
   Fix and re-run until clean; also render the frames where bubbles and captions change.
6. **Sound.** Write `audio/sfx-cues.json` (one cue per visible event, same frame numbers as the scene code) and
   adjust `audio/music.json` (minor scenes for the sad beat). `npm run audio` builds `public/audio/soundtrack.wav`
   (VO + SFX + ducked BGM, mastered to -14 LUFS, peak <= -1.5 dBFS) and prints the levels; compare them with
   `references/audio.md` ("Target levels").
7. **Render + final QA.** `npm run render` -> `out/video.mp4`. Check duration, that it has an audio stream, and
   pull 6-8 frames across it into a sheet (the checklist's "final file" section). Then deliver.

## Delivering

Report in this order: the file, format/duration, what each scene shows (one line each), what was verified and how
(VO transcript diff, stills sheet, measured LUFS / peak), what was **not** verified (nobody has listened; any source
you could not confirm), and how to change things (`audio/voiceover.json` -> `npm run tts` -> `npm run beats --
--apply` -> `npm run audio` -> `npm run render`). Never claim the audio "sounds good" - you have measurements, not
ears; say so.

## Things that silently break the style

- New colours, fonts, outline widths, or a gradient/glow/shadow style that is not in `src/lib/theme.ts` and the
  components. The palette is closed.
- Characters with mouths, realistic proportions, or missing ink outline. Emotion is eyes, brows, sweat, tears,
  arm pose and bounce only.
- Text that appears all at once. Captions pop word by word; bubbles pop from their tail.
- Animation that is not tied to a spoken phrase, or a scene that ends before its narration does.
- Linear motion. Entrances are springs with a small overshoot (`pop()`); exits are short eases.
- Anything important inside the bottom 420 px or top 230 px (Reels UI covers it).
- A fact with no on-screen source, or an invented headline / chart without its fiction / concept label.
