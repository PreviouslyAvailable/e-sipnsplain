#!/usr/bin/env bash
# Hardlink lrusso Space Cadet JS into assets/pinball/ (same-origin offline play).
# Source is gitignored (embeds Microsoft table/audio). Safe to re-run.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/3DPinballSpaceCadet-main/3DPinballSpaceCadet.js"
DST="$ROOT/assets/pinball/3DPinballSpaceCadet.js"

if [[ ! -f "$SRC" ]]; then
  echo "Missing $SRC — drop lrusso’s 3DPinballSpaceCadet.js into 3DPinballSpaceCadet-main/" >&2
  exit 1
fi

if [[ -f "$DST" ]]; then
  src_ino=$(stat -f '%i' "$SRC" 2>/dev/null || stat -c '%i' "$SRC")
  dst_ino=$(stat -f '%i' "$DST" 2>/dev/null || stat -c '%i' "$DST")
  if [[ "$src_ino" == "$dst_ino" ]]; then
    echo "OK hardlink $DST → $SRC (inode $src_ino)"
    exit 0
  fi
  echo "Replacing non-hardlinked $DST"
  rm -f "$DST"
fi

ln "$SRC" "$DST"
echo "Linked $DST → $SRC"
