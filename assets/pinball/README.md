# 3D Pinball — Space Cadet (lrusso web build)

Microsoft game **resources are not included** (copyrighted). This folder ships a
**borderless embed shell** (`index.html`) for the Sipnsplain Win98 desktop so the
deck’s window chrome is the only frame the audience sees.

Packaging lineage: [lrusso/3DPinballSpaceCadet](https://github.com/lrusso/3DPinballSpaceCadet)
(based on [alula/SpaceCadetPinball](https://github.com/alula/SpaceCadetPinball) /
[k4zmu2a/SpaceCadetPinball](https://github.com/k4zmu2a/SpaceCadetPinball)).

## Local source drop-in (Chris’s machine)

Preferred venue copy lives at repo root:

```
/Users/chrisedwards/sns/3DPinballSpaceCadet-main/
  3DPinballSpaceCadet.js   ← ~9 MB lrusso package (wasm + data URIs)
  3DPinballSpaceCadet.htm
  README.md
```

Symlink for agents / docs: `vendor/3DPinballSpaceCadet` → that folder.

Hardlink (or copy) the JS into this folder so the served app stays same-origin:

```bash
./scripts/ensure-pinball-engine.sh
# → assets/pinball/3DPinballSpaceCadet.js  (required at runtime)
```

Live reference (fallback only — **not** the primary path):
https://lrusso.github.io/3DPinballSpaceCadet/3DPinballSpaceCadet.htm

## Drop layout (required)

```
assets/pinball/
  index.html                  ← already in repo (iframe embed shell) — keep it
  3DPinballSpaceCadet.js      ← lrusso packaged glue (probe target) — YOU drop this
```

The deck probes `/assets/pinball/3DPinballSpaceCadet.js` **and**
`/assets/pinball/index.html` (explicit file — not a directory URL).
Both must exist. A bare folder / README alone will not load.

The embed shell is the stock lrusso HTM, adapted so **Play works inside the
deck iframe** (upstream only wires Play when `window.top == window.self`).
Engine script stays **relative** (`3DPinballSpaceCadet.js` beside `index.html`).
The deck always sets the iframe to `/assets/pinball/index.html` (explicit file)
so relative resolution stays under `/assets/pinball/` — including under
`npx serve`.

### What’s inside lrusso’s `.js`

One ~9 MB file embeds:

| Payload | Notes |
|---------|--------|
| `WASM_FILE` | Engine as `data:application/wasm;base64,…` |
| `DATA_FILE` | Emscripten VFS package as `data:application/octet-stream;base64,…` — includes **Microsoft table/audio assets** (`PINBALL*`, WAVs, etc.) |

There is **no** separate `.wasm` / `.data` beside the page, and **no** runtime fetch to
CDN / github.io once the script is same-origin. Fully **offline** after the local
drop-in is present.

**Do not commit** `3DPinballSpaceCadet.js` — it embeds copyrighted game data (same
policy as the old alula `.data` bundle). See `.gitignore` in this folder.

## How Chris gets a legal local build

1. Own a Windows / XP / Full Tilt copy with Space Cadet resources (or otherwise
   have rights to the assets you bake in).
2. Preferred for this talk: use the local folder `3DPinballSpaceCadet-main/`
   (or download lrusso’s
   [`3DPinballSpaceCadet.js`](https://github.com/lrusso/3DPinballSpaceCadet/blob/main/3DPinballSpaceCadet.js)
   only for **local / venue** use — do **not** add it to git).
3. Place / hardlink it next to this folder’s `index.html`.
4. Reload → Win98 → Start → Entertainment Pack → 3D Pinball (or desktop icon).

## Offline vs network

| Mode | Result |
|------|--------|
| Same-origin `index.html` + local `3DPinballSpaceCadet.js` | **Works offline** (WASM + data are data-URIs inside the JS). |
| Hotlink github.io in the iframe | Works if venue has net — **not** the primary path. |
| Shell only (no `.js`) | Placeholder in the Win98 window; status asks for the drop-in. |

## Hosting requirements

| Need | Status |
|------|--------|
| MIME for scripts | Normal `text/javascript` — any static server. |
| COOP / COEP / SharedArrayBuffer | **Not required**. |
| Same-origin iframe | Required — load `/assets/pinball/index.html`. |

## Controls (lrusso packaging)

| Action | Input |
|--------|--------|
| Left flipper | **Z** · left mouse |
| Right flipper | **C** · right mouse |
| Tilt / nudge | **X** |
| Launch ball | **Space** |
| Restart | **R** |
| Sound on/off | **T** |

Esc closes the Win98 chrome when the desktop shell has focus.

## Talk-deck WASM patches (applied to local `3DPinballSpaceCadet.js`)

Re-run after replacing the engine drop-in:

```bash
./scripts/patch-pinball-engine.sh
```

| Patch | Effect |
|-------|--------|
| `MaxBallCount` `3` → `1` | One ball, then Game Over |
| LED string `HIGH SCORE` → `MEMORY UNLOCKED` | Side-panel copy on Game Over |

These patch the embedded WASM inside the JS (same hardlink as
`3DPinballSpaceCadet-main/`). Do not commit the JS.

## Black canvas / stuck spinner

**Do not auto-inject the engine on page load.** Upstream only starts after the
red **Play** control; matching that click-to-start path is what renders the table
in the deck iframe. Immediate script injection left a black canvas (WASM reached
`calledRun` without a main loop).

Also note: the packaged glue’s `instantiateStreaming` path is buggy (it wraps the
`WASM_FILE` data-URI *string* in `new Response(...)`), so the console may show
many `"wasm streaming compile failed"` lines before the ArrayBuffer fallback
succeeds — noisy but usually harmless.

If Play stays on the spinner with a black table after a long wait, hard-reload
the tab (WebGL context exhaustion after many reloads can look identical).

## Talk / reveal asset

Era photo for the pinball beat (outside the iframe):

```
assets/pinball-reward.png
```

Swap that file. Placeholder until you drop a real photo.
