# Harness notes

The workflow only needs: a shell, Node 18+ (npm), ffmpeg/ffprobe on PATH, Python 3.10-3.12 for earshot, network
for `npm install`, Gemini and the earshot clone, and a way to look at an image (`out/qa/sheet.jpg`).

| harness | where the skill lives | notes |
|---|---|---|
| Claude Code | `~/.claude/skills/2d-motion/` (or `.claude/skills/` in a project) | open the sheet with the Read tool |
| Codex (CLI / app) | `~/.codex/skills/2d-motion/` (or `.codex/skills/` in a repo) | view the sheet image with Codex's image viewing |
| Antigravity | `~/.gemini/config/skills/2d-motion/` (global; legacy `~/.gemini/antigravity/skills/`) or `.agents/skills/` in a workspace | use the browser/artifact viewer for the sheet |
| Gemini CLI | `~/.gemini/skills/2d-motion/` | `@out/qa/sheet.jpg` to view |
| anything else | point it at `AGENTS.md` in the repo root, which links here | |

`<skill>` in the instructions = the folder that contains this skill's `SKILL.md`.

## Shell differences

- Commands are written for a POSIX shell. In PowerShell use `;` instead of `&&` (Windows PowerShell 5.1) and
  `$env:NAME` for variables; the npm scripts themselves work in both.
- On Windows, `python` may be the Microsoft Store stub: use `py -3.11` to create the earshot venv, and point
  `EARSHOT_PY` at the venv's `Scripts\python.exe`.
- If Remotion fails with `spawn …chrome-headless-shell.exe ENOENT` although the file exists, the path is too long:
  copy `node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64` to a short folder and set
  `REMOTION_BROWSER=<that folder>\chrome-headless-shell.exe` in `.env`.

## Sub-agents

Harnesses with sub-agents may split work by scene (scenes are independent files of components), but one agent owns
`timing.json`, `beats.json`, `sfx-cues.json` and the final QA so the frame numbers stay consistent.
