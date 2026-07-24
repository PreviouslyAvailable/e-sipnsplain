# Windows 95 UI Kit — vendored snapshot

Upstream: https://github.com/themesberg/windows-95-ui-kit (MIT, Themesberg)

This folder is a **reference copy** of the kit (fonts, `css/w95.css`, demos).
Fresh drop-in also at repo root: `windows-95-ui-kit-master/` →
`vendor/windows-95-ui-kit-dropin`.

The Sip'n'Splain deck does **not** load Bootstrap or jQuery from here.

## How kits map to sections

| Section | Kit | Status |
|---------|-----|--------|
| 1 · `#win95` | Themesberg fonts + bevel tokens (`css/win95-kit.css`) | **Active** |
| 2 · `#win98` | **ui-98 fonts** + classic tokens in `css/win98-kit.css` | **Active** |
| 3 · XP | `css/winxp-kit.css` + `assets/winxp-ui` (Figma kit = reference) | **Active** |

Runtime assets:

- `/assets/win95/` — W95 kit faces + favicons + LICENSE + ATTRIBUTION
- `/assets/win98-ui/` — MicrosoftSansSerif (ui-98) + W95 kit faces + LICENSE + ATTRIBUTION
- `/css/win95-kit.css` · `/css/win98-kit.css` — adapted classic chrome (Bootstrap-free)
