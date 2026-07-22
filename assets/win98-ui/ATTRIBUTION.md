# Windows 98 UI assets — attribution

Section 2 hub (`#win98` / `mode-win98`) uses **ui-98** type + Button/Input
chrome patterns as the preferred face, with classic gray window bevels
adapted from the Themesberg Windows 95 kit (Bootstrap-free).

## Primary — ui-98

**[ui-98](https://github.com/jaredpalmer/ui-98)** (React Win98 component kit)  
Local drop-in: `/Users/chrisedwards/sns/ui-98-master/` · symlink: `vendor/ui-98`  
License: MIT — see `LICENSE-ui98.txt` in this folder  
Copyright (c) 2017 Andrey Kondalov

| Path | Source |
|------|--------|
| `fonts/MicrosoftSansSerif.woff2` (+ `.woff`, `.ttf`) | `ui-98-master/src/fonts/` |
| `LICENSE-ui98.txt` | kit root `LICENSE` |

Runtime CSS does **not** load the React/Storybook stack — only the face fonts +
tokenized chrome in `/css/win98-kit.css` (Button/Input border colors mirrored
from `src/components/Button/Button.css` and `Input/Input.css`).

## Also used — Themesberg Windows 95 UI Kit

**[Windows 95 UI Kit](https://github.com/themesberg/windows-95-ui-kit)** by [Themesberg](https://themesberg.com)  
License: MIT (see `LICENSE` in this folder)  
Copyright (c) 2019 Themesberg

| Path | Source |
|------|--------|
| `fonts/w-95-sans-serif.woff2` (+ `.woff`, `ms-sans-serif.ttf`) | kit `fonts/` |
| `LICENSE` | kit root |
| Full kit snapshot | `/vendor/windows-95-ui-kit` (reference) |
| Fresh drop-in | `/windows-95-ui-kit-master` → `vendor/windows-95-ui-kit-dropin` |

Adapted styles live in `/css/win98-kit.css` — **not** the kit’s Bootstrap 4 + jQuery stack.

Icon sprite referenced in upstream `w95.css` (`img/w95-icons-sprite.png`) is not present in the public kit repo; desktop icons here use CSS glyphs (homage), not that sprite.

## Section roadmap

| Section | Theme | Status |
|---------|--------|--------|
| 1 · Win95 | Themesberg fonts + bevels (`assets/win95` + `css/win95-kit.css`) | **Active** |
| 2 · Win98 | **ui-98 fonts + Button chrome** + classic window bevels | **Active** |
| 3 · WinXP | XP UI Kit (Figma) | **Staged only** — see `/assets/winxp-ui/` |
