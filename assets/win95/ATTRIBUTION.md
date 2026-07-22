# Windows 95 UI assets — attribution

Section 1 hub (`#win95` / `mode-win95`) pulls **Themesberg Windows 95 UI Kit**
fonts, favicons, and bevel tokens — Bootstrap-/jQuery-free.

## Themesberg Windows 95 UI Kit

**[Windows 95 UI Kit](https://github.com/themesberg/windows-95-ui-kit)** by [Themesberg](https://themesberg.com)  
License: MIT (see `LICENSE` in this folder)  
Copyright (c) 2019 Themesberg

| Path | Source |
|------|--------|
| `fonts/w-95-sans-serif.woff2` (+ `.woff`, `ms-sans-serif.ttf`) | kit `fonts/` |
| `favicon/*` | kit `img/favicon/` |
| `LICENSE` | kit root |
| Full kit snapshot | `/vendor/windows-95-ui-kit` |
| Fresh drop-in | `/windows-95-ui-kit-master` → `vendor/windows-95-ui-kit-dropin` |

Runtime CSS: `/css/win95-kit.css` (tokens + type only — **not** the kit’s Bootstrap 4 + jQuery stack).

Other runtime file in this folder: `windows-98se-boot-disk.png` (Section 1 → 98 update floppy; not from the Themesberg kit).

### Not used (blocked)

| Asset | Why |
|-------|-----|
| `css/w95.css` + Bootstrap/jQuery | Would fight the SPA chrome; Paint / Ski / Mine rely on custom windows |
| `img/w95-icons-sprite.png` | Referenced in upstream CSS but **missing** from the public kit repo |
| Login / register demos | Marketing pages only |

Desktop / Start icons stay CSS glyphs (homage), not the missing sprite.
