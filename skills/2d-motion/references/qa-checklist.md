# QA checklist

Run it on what you rendered, not on the code. Fix every failed line, re-render the affected stills, and only then
continue. Report to the user which checks you ran.

## A. Script and voice (after `npm run tts`, `verify-vo`)
- [ ] `verify-vo` shows MATCH, or differences that are only number/spelling formatting.
- [ ] Every scene's VO is 6-16 s; the total is 80-110 s.
- [ ] Every fact on screen has a source you verified; fiction/concept items are stamped.

## B. Stills (`npm run stills`, open `out/qa/sheet.jpg`; add frames where bubbles/captions change)
- [ ] Caption fully visible, inside x 70-1010, top >= 230, at most 2 lines, highlighter on the right words.
- [ ] No text or face inside the bottom 420 px; the source line sits just above it (~1488).
- [ ] No element covers another element's text: bubble vs caption, bubble vs bubble, bubble vs board/card,
      labels vs bars. (This is the most common failure - check every bubble frame.)
- [ ] Characters whole (not cut by the frame or a panel unless inside a panel by design), feet on the floor line,
      the right one flipped to face the other.
- [ ] Every scene has its own background tint; the turn scene is the desaturated one.
- [ ] Text sizes: caption >= 70, bubble >= 40, labels >= 26 at 1080 width.
- [ ] Decorative overlays (floating hearts, "!", stamps) do not sit on top of text.

## C. Motion (scrub in `npm run dev` or render short ranges)
- [ ] Every bubble / card / chart appears within 0-6 frames before its phrase (compare with `src/beats.json`).
- [ ] Nothing new appears in the last 15 frames of a scene; the narration ends before the scene does.
- [ ] Characters breathe and blink; nothing stays frozen longer than ~1 s.
- [ ] Transitions vary (slide / wipe / fade), 12 frames each.

## D. Sound (`npm run audio` output)
- [ ] `lufs` -14.5 to -14.0, `peak_dbfs` <= -1.5.
- [ ] `bgm_lufs` 13-17 LU below `vo_lufs`.
- [ ] Every visible event in `storyboard.md` has its SFX cue at the same frame; no two pops < 4 frames apart.

## E. Final file (`npm run render`)
- [ ] `ffprobe out/video.mp4` shows 1080x1920, 30 fps, an AAC audio stream, duration = sum(scenes) - 12 x (n-1)
      frames.
- [ ] 6-8 frames pulled across the MP4 (`ffmpeg -ss <t> -i out/video.mp4 -frames:v 1 …`) look like the stills.
- [ ] Optional, with torch installed: `"$EARSHOT_PY" -m earshot timeline out/video.mp4` - effects land near
      their cues, no silent gaps where you expected sound.

## Known failures from the reference build (check these first)
1. The title key word on the chalkboard hidden behind the hello bubble -> move the bubble below the board.
2. Bar-chart labels wrapping into two lines and overlapping the bars -> `whiteSpace: nowrap`, wider label box.
3. Floating hearts drawn over a bubble -> start them beside the head, away from the bubble's x range.
4. Remotion cannot launch its browser on Windows when the project path is very long (ENOENT) -> copy
   `node_modules/.remotion/chrome-headless-shell/<os>/…` to a short path and set `REMOTION_BROWSER` in `.env`.
