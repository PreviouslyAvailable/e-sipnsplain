# Windows XP UI Kit — staged (not active)

**Do not apply the full Luna/Figma kit as the live Section 3 skin yet.**
Section 2 unlocks `#winxp` via the Y2K sequence (SkiFree + Pinball + Chris, 2000
→ clock takeover → cosmetic BSOD → CD install). Live hub uses a Bliss-*homage*
wallpaper (`bliss.svg`) + XP startup chime; full Luna kit activation still
follows the checklist below.

## Paths

| Location | Role |
|----------|------|
| `/Users/chrisedwards/sns/Windows-XP-UI-Kit-main/` | Chris’s drop-in (source of truth) |
| `vendor/windows-xp-ui-kit` | Symlink → drop-in |
| `assets/winxp-ui/` | Runtime staging notes + LICENSE (this folder) |

## What’s in the Figma kit

Upstream: local drop-in `Windows-XP-UI-Kit-main` (Figma Luna-style kit; CC-BY-NC-ND-4.0)  
License: **CC-BY-NC-ND-4.0** (see `LICENSE`) — non-commercial, no derivatives without care.

| Path | Size / notes |
|------|----------------|
| `src/Windows XP UI Kit.fig` | ~36 MB Figma source — **design system, not web CSS** |
| `public/Cover.jpg` | Marketing cover (~2 MB) |
| `public/{behance,dribbble,linkedin}/` | Portfolio metadata YAML only |
| `README.md` | Upstream blurb (Luna-style windows & frames) |
| `LICENSE` | Copied here |

### Surfaces the `.fig` is built for (from upstream README)

- Iconic **Windows XP / Luna** controls and UI elements (Assets Library)
- Vector-scaled commons icons
- Window **templates & examples**
- **Desktop + Start Menu** showcase frames for mockups

There is **no** shipped CSS, WOFF, or PNG icon sheet for the web — only the Figma file.

## What we’ll need for web later (Section 3)

Before activating an XP hub, extract / vendor:

1. **Tokens** — Luna blue titlebar gradient, olive/silver taskbar, button bevels, selection blue, desktop Bliss-adjacent teal (or custom photo wallpaper).
2. **Type** — Tahoma / Franklin Gothic homage faces (self-hosted WOFF2), scoped under `.mode-winxp`.
3. **Chrome sprites or CSS** — Start orb, taskbar grips, window controls (min/max/close), XP-style buttons — export from `.fig` or redraw as CSS.
4. **Icons** — My Computer, Recycle, folder, Start menu glyphs as PNG/SVG under `assets/winxp-ui/icons/` (offline-safe).
5. **CSS module** — `css/winxp-kit.css` mirroring `win95-kit.css` / `win98-kit.css`, Bootstrap-free, no Figma runtime.
6. **License check** — CC-BY-NC-ND may restrict derivative web chrome for a public talk site; confirm attribution + allowed use before shipping, or redraw from public-domain references.

### Activation checklist (when Section 3 starts)

1. Export needed surfaces from the `.fig` (or use Figma MCP / Code Connect).
2. Vendor lightweight CSS/fonts/icons under `assets/winxp-ui/` (served, offline-safe).
3. Scope to `.mode-winxp` / `#winxp` the same way Win98 uses `.mode-win98`.
4. Leave `#win98` on the ui-98 + classic chrome stack.
5. Do **not** load XP skins on Win95/Win98 hubs.

## Attribution stub

When live: credit the Figma kit author + CC-BY-NC-ND-4.0 link in an
`assets/winxp-ui/ATTRIBUTION.md` (create at activation time). Until then this
folder only holds staging docs + LICENSE.
