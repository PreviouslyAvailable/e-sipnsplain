# Minesweeper master — reference only

Local drop-in: `/Users/chrisedwards/sns/minesweeper-master/`  
Symlink: `vendor/minesweeper-master`

HTML/CSS/JS clone with individual PNG faces (`images/smiley-face.png`, etc.).
Default boards: 9×9 / **10** mines, 16×16 / 40, 30×16 / 160.

## Why the talk beat does **not** switch to it

The Sip'n'Splain Win95 Minesweeper beat (`js/moments/minesweeper.js`) is a
canvas homage using Chris’s Entertainment Pack sprite sheet:

```
assets/refs/minesweeper/minesweeper-sheet.png
```

Talk board is fixed at **16×16 / 10 mines** (easy density on a large board) and
fires the reward photo on clear. Swapping to `minesweeper-master` would change
sprite language (35×35 chrome faces vs 16×16 sheet tiles), difficulty tables,
and win wiring.

## Extracted face / bomb PNGs (reference)

Copied from `minesweeper-master/images/` for side-by-side comparison — **not**
wired into the canvas beat (sheet faces/LEDs already match the 8×8 tile grid):

```
assets/refs/minesweeper/faces/
  smiley-face.png · o-face.png · dead-face.png · cool-face.png
  bomb.png · wrong-bomb.png
```

Keep the EP sheet as the live runtime. If we ever composite master faces, do it
without changing `COLS` / `ROWS` / `MINES` or the reward-photo path.
