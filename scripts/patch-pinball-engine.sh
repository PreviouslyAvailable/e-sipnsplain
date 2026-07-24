#!/usr/bin/env bash
# Patch lrusso Space Cadet WASM inside assets/pinball/3DPinballSpaceCadet.js
# for the Sip'n'Splain talk deck:
#   - MaxBallCount 3 → 1
#   - LED "HIGH SCORE" → "MEMORY UNLOCKED"
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JS="$ROOT/assets/pinball/3DPinballSpaceCadet.js"

if [[ ! -f "$JS" ]]; then
  echo "Missing $JS — run ./scripts/ensure-pinball-engine.sh first" >&2
  exit 1
fi

PINBALL_JS="$JS" python3 - <<'PY'
from pathlib import Path
import os, re, base64, sys

js_path = Path(os.environ["PINBALL_JS"])
js = js_path.read_text(errors="replace")
m = re.search(
    r'var WASM_FILE\s*=\s*"(data:application/wasm;base64,)([^"]+)"', js
)
if not m:
    sys.exit("WASM_FILE not found in engine JS")

wasm = bytearray(base64.b64decode(m.group(2)))
changed = False

# MaxBallCount = 3 → 1 (i32.const 3; i32.store offset=0x2c4 near ballcount1 xref)
code_start = 6836
const3_file = code_start + 1012844
needle = wasm[const3_file : const3_file + 6]
if needle[:2] == b"\x41\x03" and needle[2:6] == b"\x36\x02\xc4\x02":
    wasm[const3_file + 1] = 0x01
    changed = True
    print("Patched MaxBallCount 3 → 1")
elif needle[:2] == b"\x41\x01" and needle[2:6] == b"\x36\x02\xc4\x02":
    print("MaxBallCount already 1")
elif needle[:2] == b"\x41\x02" and needle[2:6] == b"\x36\x02\xc4\x02":
    wasm[const3_file + 1] = 0x01
    changed = True
    print("Patched MaxBallCount 2 → 1")
else:
    sys.exit(f"MaxBallCount site mismatch: {needle.hex()}")

# HIGH SCORE → MEMORY UNLOCKED (overwrite into adjacent ImGui #FOCUSSCOPE slot)
hs = wasm.find(b"HIGH SCORE\x00")
mem = wasm.find(b"MEMORY UNLOCKED\x00")
if hs >= 0:
    end = hs + len(b"HIGH SCORE\x00#FOCUSSCOPE\x00")
    rep = b"MEMORY UNLOCKED\x00"
    pad = end - hs - len(rep)
    if pad < 0:
        sys.exit("Not enough room for MEMORY UNLOCKED")
    wasm[hs:end] = rep + (b"\x00" * pad)
    changed = True
    print("Patched HIGH SCORE → MEMORY UNLOCKED")
elif mem >= 0:
    print("MEMORY UNLOCKED already present")
else:
    sys.exit("Neither HIGH SCORE nor MEMORY UNLOCKED found")

if not changed:
    print("No changes needed")
    raise SystemExit(0)

b64 = base64.b64encode(bytes(wasm)).decode("ascii")
new_js = js[: m.start(2)] + b64 + js[m.end(2) :]
js_path.write_text(new_js)
print(f"Wrote {js_path}")
PY
