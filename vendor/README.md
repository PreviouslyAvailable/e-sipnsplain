# Vendor & local drop-ins

Inventory of Chris’s local project folders under `/Users/chrisedwards/sns` and how
the talk deck consumes them. Prefer **symlinks / hardlinks** over duplicating
huge trees; runtime assets that must work offline live under `/assets/`.

## Drop-ins (repo root)

| Folder | What it is |
|--------|------------|
| `3DPinballSpaceCadet-main/` | lrusso Space Cadet web package (~9 MB JS) |
| `skifree.js-master/` | basicallydan/skifree.js (MIT) |
| `minesweeper-master/` | HTML minesweeper clone (reference) |
| `windows-95-ui-kit-master/` | Themesberg Win95 UI Kit (MIT) |
| `win95-winxp_icons-master/` | trapd00r default 95/98/2k/XP shell icons → `assets/icons/` |
| `ui-98-master/` | ui-98 React Win98 kit (fonts used live) |
| `Windows-XP-UI-Kit-main/` | XP Figma UI kit (~36 MB `.fig`) — staged |

## Symlinks in this directory

| Link | Target |
|------|--------|
| `3DPinballSpaceCadet` | `../3DPinballSpaceCadet-main` |
| `skifree.js` | `../skifree.js-master` |
| `minesweeper-master` | `../minesweeper-master` |
| `ui-98` | `../ui-98-master` |
| `windows-95-ui-kit-dropin` | `../windows-95-ui-kit-master` |
| `windows-xp-ui-kit` | `../Windows-XP-UI-Kit-main` |
| `windows-95-ui-kit/` | Full Themesberg snapshot (real copy + `VENDOR.md`) |

## What’s active vs staged

| Era / beat | Active runtime | Staged / reference |
|------------|----------------|--------------------|
| **Pinball (Win98)** | `assets/pinball/` (hardlink to drop-in JS) | `vendor/3DPinballSpaceCadet` |
| **SkiFree (Win98)** | `assets/skifree-js/` (master + finish→yeti→Game Over `postMessage`) | `vendor/skifree.js` |
| **Minesweeper (Win95)** | `js/moments/minesweeper.js` + EP sheet | `vendor/minesweeper-master` |
| **Win95 Section 1** | `css/win95-kit.css` + `assets/win95/` (fonts, favicons) + `assets/icons/w95/` | Full Themesberg Bootstrap kit (reference only) |
| **Win98 Section 2** | `css/win98-kit.css` + `assets/win98-ui/` + `assets/icons/w98/` | Themesberg window bevel lineage |
| **WinXP Section 3** | `assets/icons/wxp/` (stub desktop) | `assets/winxp-ui/` + `vendor/windows-xp-ui-kit` (Figma only) |

## Do not commit

- `assets/pinball/3DPinballSpaceCadet.js` (copyrighted game data — gitignored)
- Secrets / `.env`
- Prefer leaving 36 MB XP `.fig` out of git remotes if the repo is public
