# Audio: voiceover, SFX, music

## Voiceover (Gemini TTS)

`audio/voiceover.json`:
```json
{ "model": "gemini-3.8-flash-tts", "voice": "Rami", "temperature": 0, "scenes": ["…scene 1…", "…"] }
```
- `npm run tts` sends each string **verbatim** (no style prompt, no tags) with `temperature` 0, so the model reads
  the script and adds nothing. `npm run tts -- 3 7` regenerates only scenes 3 and 7.
- Temperature 0 fixes the words, not the exact pacing: a regenerated take can be ~0.5-1 s shorter or longer. After
  any (re)generation run `npm run beats -- --apply` again; scenes keyed with `beat()` follow automatically.
- Free tier: 3 requests per minute for this model; the script waits and retries on 429 by itself.
- If the model or voice is unavailable, list models with
  `curl -s "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200" -H "x-goog-api-key: $KEY" | grep tts`
  and tell the user before switching.
- `npm run verify-vo` transcribes every file with `gemini-2.5-flash` and diffs it with the script. Accept only
  formatting differences (digits vs words, "apapun" vs "apa pun"); regenerate a scene with any other difference.
- The key lives only in `.env` (`GEMINI_API_KEY=`), which is git-ignored. If the user pasted it in chat, suggest
  rotating it after the job.

## earshot (sound bank + mixer dependencies)

earshot (https://github.com/Leonxlnx/earshot, MIT) ships 252 sounds as code that render by id with no models and no
network. Only its listening tools (describe, timeline, critique) need PyTorch; this pipeline does not.

Install once, outside the video project (Python 3.10-3.12):
```bash
git clone --depth 1 https://github.com/Leonxlnx/earshot ~/tools/earshot
python -m venv ~/tools/earshot-venv          # Windows: py -3.11 -m venv %USERPROFILE%\tools\earshot-venv
~/tools/earshot-venv/bin/python -m pip install numpy scipy soundfile soxr librosa pyloudnorm
~/tools/earshot-venv/bin/python -m pip install --no-deps -e ~/tools/earshot
~/tools/earshot-venv/bin/python -I -m earshot sfx list --category ui_pop     # check
```
Then set `EARSHOT_PY=` in the project's `.env` to that venv's python
(`…/earshot-venv/Scripts/python.exe` on Windows). `npm run audio` uses it. Optional: install `torch` (CPU) in the same
venv to also run `earshot timeline / sheet / critique` on the final file.

Useful: `"$EARSHOT_PY" -I -m earshot sfx list --kind hit` (or `--category swish`) shows ids, lengths, peak times and
which knobs (`pitch`, `dur`, `apex`) a sound accepts. Pitched sounds refuse notes outside their range (marimba bass
bottoms out at D#3).

## SFX: event -> sound (`audio/sfx-cues.json`)

Each cue: `{"scene": 2, "frame": 226, "sound": "ui_pop/boop", "gain_db": -13, "align": "onset", "knobs": {"pitch": "C5"}}`.
`frame` is the same number the scene code uses for that event. `onset` lands the attack on the frame (pops,
knocks, notes); `peak` lands the loudest moment on the frame (whooshes, swells) - put a whoosh's frame at the
moment the object moves fastest.

| on screen | sound | gain dB | align |
|---|---|---|---|
| speech bubble pops | `ui_pop/soft` (A), `ui_pop/boop` (B) | -13 | onset |
| sad / deflated reply bubble | `ui_pop/fall` | -13 to -15 | onset |
| caption key word / title reveal | `ui_pop/wide` + `mallet/flourish` | -14 / -12 | onset |
| chalk line written | `mallet/pluck` rising C4 E4 G4 C5 | -15 | onset |
| character slides in | `swish/flick` | -16 | peak |
| panel / card slides in | `swish/bright` or `swish/soft` | -18 to -19 | peak |
| quote text inside a panel | `ui_pop/step` rising Bb4 C5 D5 | -14 | onset |
| shock | `knock/double` + `notify/mid_tine` | -10 / -16 | onset |
| marker cross / camera-like snap | `shutter/snap` | -15 | onset |
| big number appears | `knock/wood` | -12 | onset |
| counter lands | `reverse_swell/short` (peak on landing) + `notify/mid_tine` | -20 / -14 | peak / onset |
| grid of items pops | `drip/tiny` run, 5 f apart, max 8 | -22 | onset |
| good result / green recolour / happy | `mallet/up4` | -14 to -15 | onset |
| bad subset highlighted | `glitch/mid` | -16 | onset |
| mascot appears | `drip/bloop` | -13 | onset |
| chart bars grow | `mallet/marimba` descending G5 E5 C5 A4 F4 (or ascending for growth) | -16 | onset |
| stamp / tag | `knock/desk` (+ `shutter/snap`) | -10 to -12 | onset |
| newspaper / big object spins in | `whoosh_big/thump` | -13 | peak |
| chips in a row | `ui_pop/blip` C5 E5 G5 | -15 | onset |
| harsh one-word punchline | `cut_hit/punch` | -11 | onset |
| heart cracks | `knock/snap` + `swish/soft` (falling halves) | -11 / -21 | onset / peak |
| equation cards | `knock/wood` C5, E5 for words, `ui_pop/blip` for + and =, `mallet/flourish` + `cut_hit/sub` for the result | -12 / -17 / -11 / -16 | onset |
| closing card | `whoosh_fast/tight` + `knock/desk` | -19 / -13 | peak / onset |
| CTA pill | `ui_pop/step` + `notify/mid_wood` | -13 / -15 | onset |
| transitions | slide `swish/flick`, wipe `swish/zing`, fade silent (in `transitions`) | -21 | peak |

Density: about 5-8 effects per 10 s; never two pops closer than ~4 frames; nothing on hard cuts that already have
a transition swish.

## Music (`audio/music.json`)

A soft kalimba arpeggio (eighth notes) over a marimba bass on beats 1 and 3, a wood tick on 2 and 4, 96 BPM,
C - Am - F - G. Scenes in `minor_scenes` (the turn) switch to Am - F - Dm/F - E, quarter notes, no tick. The video
ends on a ringing C major chord. Change `bpm`, the progressions or `minor_scenes`; keep the instruments.

## Mix and target levels

`npm run audio` places VO at scene frame `voStart`, ducks the music 9 dB under the voice (40 ms attack, 350 ms
release), sums VO + SFX + music, normalises to -14 LUFS and limits peaks to -1.5 dBFS. It prints:

| printed | target |
|---|---|
| `lufs` | -14.5 to -14.0 |
| `peak_dbfs` | <= -1.5 |
| `vo_lufs` (stem, before master gain) | about -17 |
| `bgm_lufs` (stem, before master gain) | 13-17 LU under `vo_lufs` (reference: -17.3 vs -30.5) |

If the music is more than 17 LU under the voice, raise `gain_db` in `music.json` by 2; less than 13, lower it.
Report the printed numbers to the user. These are measurements: do not claim how the mix sounds.
