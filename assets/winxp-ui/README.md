# Windows XP UI — Luna hub (live) + Win10 gag

Section 3 `#winxp` uses a **CSS Luna Blue** skin (`css/winxp-kit.css`) with the
Bliss hills photo wallpaper and curated desktop icons. Lands from Section 2 Y2K
(clock → BSOD → CD install) and stays classic XP until Shut Down → `#consoles`.

## Paths

| Location | Role |
|----------|------|
| `css/winxp-kit.css` | **Live** Luna chrome (taskbar, Start, titlebars, Start menu) |
| `assets/winxp-ui/bliss.jpg` | Bliss hills photo wallpaper (`.wxp-desktop.is-bliss`) |
| `assets/winxp-ui/icons/` | Served desktop + Start glyphs |
| `assets/icons/wxp/` | Same icons (export script / shared with shell set) |
| `assets/winxp-ui/win10pack/` | Optional Win10-on-XP gag (MIT) |
| `Windows-XP-UI-Kit-main/` | Chris’s Figma Luna kit (reference only) |
| `vendor/windows-xp-ui-kit` | Symlink → Figma drop-in |

## Live assets (web-usable)

| Path | Notes |
|------|-------|
| `bliss.jpg` | Bliss hills photo for desktop background |
| `icons/my-computer.png` | From `wxp_16.ico` (trapd00r) |
| `icons/recycle-empty.png` | From `wxp_32.ico` |
| `icons/my-pictures.png` | Folder + Bliss peek (XP My Pictures style) |
| `icons/start-flag.png` / `start-flag-22.png` | From `wxp_239.ico` (XP flag) |
| `win10pack/*` | Optional gag wallpaper / icons / notify.wav |

## Figma kit (still not web CSS)

Upstream: `Windows-XP-UI-Kit-main` · **CC-BY-NC-ND-4.0**

| Path | Notes |
|------|-------|
| `src/Windows XP UI Kit.fig` | ~36 MB Figma source — design reference, not runtime |
| `public/Cover.jpg` | Marketing cover (Luna + Bliss mockup) |

There is **no** shipped CSS/WOFF from the Figma kit. Luna chrome is rebuilt in
`css/winxp-kit.css` from XP visual tokens (same approach as Win95/98 kits).

### If you want pixel-perfect kit chrome later

Drop or export any of:

1. **PNG slices** from the `.fig`: Start button, titlebar caps, close/min/max, Start menu header
2. **Tahoma / Franklin Gothic** WOFF2 under `assets/winxp-ui/fonts/` (optional — stack already uses Tahoma)

## Win10-on-XP gag (optional)

Upstream: [WinXP655/Win10UIforXP](https://github.com/WinXP655/Win10UIforXP) · MIT  
Presenter: `Sipnsplain.applyWin10Pack()` / `.resetWin10Pack()` — not auto-applied after Y2K.

## Activation notes

- Scoped to `.mode-winxp` / `#winxp` only — Win95/Win98 hubs untouched
- Y2K → `#winxp` path unchanged
- Load order: `winxp-kit.css` after `ad-moments.css` so Luna overrides stub chrome

## Attribution

- Shell icons: trapd00r `win95-winxp_icons` (see `assets/icons/README.md`)
- Win10 pack: WinXP655 · MIT
- Figma Luna kit: CC-BY-NC-ND-4.0 (reference; see `LICENSE`) — not redistributed as web chrome
- Bliss wallpaper: classic hills photograph (`bliss.jpg`)
