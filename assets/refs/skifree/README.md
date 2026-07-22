# SkiFree sheet art

Source sheets (Chris-provided) live in `sheets/`:
- `title-controls.png` — logo, NumPad / F2·F3 signs
- `characters.png` — skier poses, yeti, dog, extras
- `objects.png` — trees, rocks, jumps, mode/start/finish signs

`sliced/` contains white-keyed transparent PNGs extracted by `scripts/slice-skifree.py` (or the one-shot slicer).
`atlas.json` records sheet rectangles for each named sprite.

Gameplay loads sliced PNGs from `/assets/refs/skifree/sliced/`.
Homage framing stays in speaker notes — this talk uses provided sheet art, not a binary rip pipeline.

> **Note (Jul 2026):** The playable Win95 SkiFree window now runs vendored [skifree.js](https://github.com/basicallydan/skifree.js) from `/assets/skifree-js/`. These sliced sheets are unused by gameplay but kept as talk reference art.
