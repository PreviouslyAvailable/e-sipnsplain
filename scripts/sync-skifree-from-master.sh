#!/usr/bin/env bash
# Refresh assets/skifree-js from skifree.js-master + deck patches:
#   · absolute sprite URLs (same-origin / serve-safe)
#   · Verify deck beat hooks (finish → yeti → gameover) from master main.js
#
# Deck beat flow (keep in master js/main.js — do not regress on sync):
#   1. ~200m → place finish signs → postMessage skifree-finish (phase: placed)
#   2. Cross finish → force-spawn yeti → skifree-finish (phase: crossed)
#   3. Yeti catch → skifree-yeti + skifree-gameover (+ __skifreeShowGameOver)
#   4. Game Over button in index.html → skifree-gameover-photo → parent opens photo
#
# Keeps assets/skifree-js/index.html (Game Over overlay + Esc bridge).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTER="$ROOT/skifree.js-master"
DEST="$ROOT/assets/skifree-js"

if [[ ! -f "$MASTER/dist/skifree.js" ]]; then
  echo "Missing $MASTER/dist/skifree.js — run: (cd skifree.js-master && npm run build)" >&2
  exit 1
fi

cp "$MASTER/sprite-characters.png" "$MASTER/skifree-objects.png" "$MASTER/license.md" "$DEST/"

python3 - "$MASTER/dist/skifree.js" "$DEST/skifree.js" <<'PY'
from pathlib import Path
import sys

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
out = src.read_text()
out = out.replace('"sprite-characters.png"', '"/assets/skifree-js/sprite-characters.png"')
out = out.replace('"skifree-objects.png"', '"/assets/skifree-js/skifree-objects.png"')

required = (
    "skifree-finish",
    "skifree-yeti",
    "skifree-gameover",
    "__skifreeShowGameOver",
)
missing = [k for k in required if k not in out]
if missing:
    raise SystemExit(
        "Deck beat hooks missing from dist/skifree.js: "
        + ", ".join(missing)
        + " — restore finish→yeti flow in skifree.js-master/js/main.js and rebuild."
    )

dst.write_text(out)
print(
    f"wrote {dst} ({len(out)} bytes); "
    + ", ".join(f"{k}={out.count(k)}" for k in required)
)
PY

echo "Synced SkiFree runtime into $DEST (kept index.html — Game Over + Esc)."
