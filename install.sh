#!/usr/bin/env sh
# Installs the 2d-motion skill for every agent harness found on this machine (or the ones you name).
# Usage: ./install.sh            -> all harnesses whose config folder exists
#        ./install.sh claude codex antigravity gemini
set -e
SRC="$(cd "$(dirname "$0")" && pwd)/skills/2d-motion"
targets="$*"
[ -z "$targets" ] && targets="claude codex antigravity gemini"
for t in $targets; do
  case "$t" in
    claude) base="$HOME/.claude"; dir="$base/skills" ;;
    codex) base="${CODEX_HOME:-$HOME/.codex}"; dir="$base/skills" ;;
    antigravity) base="$HOME/.gemini"; dir="$base/config/skills" ;;
    gemini) base="$HOME/.gemini"; dir="$base/skills" ;;
    *) echo "unknown harness: $t"; continue ;;
  esac
  if [ -z "$*" ] && [ ! -d "$base" ]; then continue; fi
  mkdir -p "$dir"
  rm -rf "$dir/2d-motion"
  cp -R "$SRC" "$dir/2d-motion"
  echo "installed for $t -> $dir/2d-motion"
done
