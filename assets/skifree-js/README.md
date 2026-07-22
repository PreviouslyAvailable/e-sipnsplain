# SkiFree.js (vendored for Sipnsplain)

Playable game for the **Win98** hub: **Start → Entertainment Pack → SkiFree**.

## Source

- Upstream: [basicallydan/skifree.js](https://github.com/basicallydan/skifree.js)
- Local drop-in: `/Users/chrisedwards/sns/skifree.js-master/` (symlink: `vendor/skifree.js`)
- License: **MIT** (see `license.md`) — Copyright (C) 2013 Daniel Hough
- Original SkiFree by [Chris Pirih](http://ski.ihoc.net/)
- Sprites: Wing Wang Wao / Spriters Resource (credited upstream)

This folder is a **light offline copy** of the runtime only (bundled JS + sprite sheets + borderless embed shell). Not a git submodule.

## Deck beat (primary) — finish → yeti → Game Over → photo

Logic lives in **`skifree.js-master/js/main.js`** (rebuild → sync). Do not reintroduce “yeti alone completes the beat.”

1. **~1000m** — plant a row of finish signs ahead; `postMessage` `{ type: "skifree-finish", phase: "placed" }`
2. **Cross finish** — force-spawn chasing yeti; `{ type: "skifree-finish", phase: "crossed" }`
3. **Yeti catch** — `{ type: "skifree-yeti" }` + `{ type: "skifree-gameover" }` + show Game Over overlay (`index.html` / `__skifreeShowGameOver`)
4. **Game Over button** — `{ type: "skifree-gameover-photo" }` → parent opens `assets/skifree-reward.png` and `completeBeat('skifree')`

Local test shortcut: `?finishM=50` on the embed URL (or add `&finishM=50` after `embed=1`).

## Deck patches (keep these)

`skifree.js` is master `dist/skifree.js` plus:

1. **Absolute sprite URLs** — `/assets/skifree-js/sprite-characters.png` and
   `/assets/skifree-js/skifree-objects.png` (same-origin / serve-safe).
2. **Deck beat hooks** — must remain in source (`skifree-finish`, `skifree-yeti`,
   `skifree-gameover`, `__skifreeShowGameOver`). Sync **fails** if they disappear.

Esc is forwarded from `index.html` as `{ type: "skifree-esc" }`.
`index.html` also hosts the Game Over panel and sets `<base href="/assets/skifree-js/">`.

## Files

| File | Role |
|------|------|
| `index.html` | Borderless embed + Game Over overlay + Esc bridge |
| `skifree.js` | Master `dist/skifree.js` + absolute sprites + deck beat |
| `sprite-characters.png` | Skier / yeti / snowboarder sheet |
| `skifree-objects.png` | Trees, rocks, jumps, signs |
| `license.md` | MIT text (required attribution) |

Reward photo (parent Win98 window): `/assets/skifree-reward.png` (placeholder OK).

## Controls (upstream)

| Action | Input |
|--------|--------|
| Steer | **Mouse** · **WASD** · **Arrow keys** |
| Stop | **W** / **↑** |
| Speed boost | **F** (or double-tap on touch) |
| Trick | **T** |
| Restart | **Space** |
| Debug spawn | **M** monster · **B** snowboarder |

## Refresh from local master

```bash
(cd skifree.js-master && npm run build)
./scripts/sync-skifree-from-master.sh
```

Keeps this repo’s `index.html` (Game Over + Esc + base + absolute script).
Does **not** pull marketing banners / `yeti-big.png` (unused by the runtime).

**If sync fails** complaining about missing deck hooks, restore the finish→yeti flow in
`skifree.js-master/js/main.js` and rebuild before syncing again.
