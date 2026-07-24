---
title: "Gran Turismo 4 (PS2, 2004) — UI/HUD/Menu Aesthetics"
vault_tag: ps2-ui-hud-aesthetics-eb4295
batch: 1
game: Gran Turismo 4
platform: PS2
year: 2004
status: draft
sources:
  - https://www.feedme.design/gran-turismos-ui-wasnt-flashy-it-was-mechanical-by-design/
  - https://gran-turismo.fandom.com/wiki/Menu_Styles
  - https://gran-turismo.fandom.com/wiki/Gran_Turismo_4
  - https://www.devicefonts.co.uk/catalogue/gran-turismo
  - https://www.myfonts.com/collections/gran-turismo-font-device
  - https://fontsinuse.com/typefaces/1359/gran-turismo
  - https://www.gtplanet.net/forum/threads/gt4-hd-hud-and-user-interface-texture-pack-for-pcsx2.417873/
  - https://tcrf.net/Gran_Turismo_4
created: 2026-06-12T00:00:00Z
---

# Gran Turismo 4 — PS2 UI/HUD/Menu Aesthetics

## Title Screen

- **Look:** The title screen features a large, dominant GT logo styled in bold red and blue against a near-black background. Sharp, clean lines. No gradients or glow effects — the design is deliberately crisp and mechanical, like instrument markings on a dashboard.
- **Type treatment:** All-caps, wide-spaced lettering — the series' signature typeface. See Font Character section below.
- **Color:** Deep black (`#000000` or near), with the GT logo in **red** (`~#cc1111`) and **blue** (`~#003399`). White type for game title text. The palette is automotive — high contrast, no warmth.

## Menu / Pause Menu Pattern

- **Architecture:** The main Simulation Mode menu is built around a **city-map metaphor** — a stylized overhead map of a fictional automotive city, with different districts representing Dealerships, Race Events, License Tests, Tuning shops, etc. Players navigate spatially rather than through a traditional dropdown list.
- **Dealership UI:** Black background with **yellow ringed buttons** and a **left-aligned vertical nav bar**. Text is flush with icons; everything reads immediately. The choice of red for pricing and horsepower values is not aesthetic — it's urgency/importance signaling (red = critical data).
- **Consistency:** "Typography stays consistent with the title screen — all caps, wide spacing, white text with slight drop shadows for clarity." The all-caps sans-serif with wide kerning was optimized for readability on low-resolution CRTs.
- **Pause menu (in-race):** Minimal overlay — dark translucent panel, white all-caps text. Clean, functional. No decorative borders.
- **Overall philosophy:** "The UI is rooted in simulation logic, not marketing flash." Mechanical precision over visual spectacle. The design language mirrors the game's tagline as a "Real Driving Simulator."

## In-Race HUD

- **Layout:** Corner-anchored numerical readouts. The tachometer and speedometer are displayed digitally (not as analog dials in the main HUD overlay, though the on-screen car's actual dashboard is rendered in 3D when in cockpit view).
- **Tachometer variants:** 10,000 RPM and 12,000 RPM options. Redline indicator present.
- **Lap timer:** Top-center or top-right, white monospaced-style numerals.
- **Position/lap info:** Clean sans-serif, white, minimal.
- **Color coding:** Red for critical data (pricing, danger zones). White for primary readouts. Yellow for interactive selectors/buttons in menus.
- **No minimap** — GT4's racing HUD is stripped of track maps in default view, keeping focus on driving.
- **Font in HUD:** Appears to be the same Gran Turismo typeface family (condensed, wide-tracked) for consistency.

## Font Character

Gran Turismo 4 uses — and is the namesake of — the **Gran Turismo** typeface, designed by **Rian Hughes** and published by **Device** (devicefonts.co.uk).

| Property | Value |
|---|---|
| Font name | Gran Turismo (by Rian Hughes / Device) |
| Style | Geometric sans-serif, modular design |
| Weight | Regular to Extended |
| Tracking | Wide — commanding automotive kerning |
| Case | ALL CAPS throughout |
| Distinctive feature | Rounded terminations on horizontal strokes; diagonals that "turn up or down at their terminus" suggesting looped continuity; italic set at urgent 18° (vs. typical 12°) |
| Variants | Extended, Outline, Italic — 9 styles total |
| Character | "Reminiscent of lettering found on supercars and summer blockbuster movies" — Rian Hughes |

The font is used in-game consistently from title screen through all menus and HUD elements. It was separately adopted as a commercial typeface sold by Device and appears in other media (dance group Steps logo, etc.).

## Color Palette / Grading

| Name | Approx Hex | Usage |
|---|---|---|
| Race Black | `#000000` | Primary background everywhere |
| GT Red | `#cc1111` | Logo accent, pricing/HP emphasis |
| GT Blue | `#003399` | Logo secondary color |
| Navigation White | `#ffffff` | All primary text |
| Button Yellow | `#f5c518` | Interactive button rings in dealership |
| Drop Shadow | `rgba(0,0,0,0.6)` | Text shadow for CRT legibility |

**Overall grading:** No color grading in the decorative sense — the palette is binary: black background, white text, red/blue logo accents, yellow interactive elements. This is an automotive instrument panel aesthetic — clarity over atmosphere.

## Cross-Reference Notes

- GT4 is the last game in the main series with the "classic" quick-transition menu system that started from GT1; later games adopted 3D environments.
- The map-based Simulation Mode influenced GT7's design, which modernized it with a rendered 3D island but kept the spatial metaphor.
- The Gran Turismo typeface (Device) is a commercial font available for licensing — relevant for web UI kit reproduction.

## Sources

1. FeedMe Design — "Gran Turismo's UI Wasn't Flashy. It Was Mechanical by Design": https://www.feedme.design/gran-turismos-ui-wasnt-flashy-it-was-mechanical-by-design/
2. Gran Turismo Wiki — Menu Styles: https://gran-turismo.fandom.com/wiki/Menu_Styles
3. Gran Turismo Wiki — Gran Turismo 4: https://gran-turismo.fandom.com/wiki/Gran_Turismo_4
4. Device Fonts — Gran Turismo typeface: https://www.devicefonts.co.uk/catalogue/gran-turismo
5. MyFonts — Gran Turismo font (Rian Hughes / Device): https://www.myfonts.com/collections/gran-turismo-font-device
6. Fonts In Use — Gran Turismo typeface usage: https://fontsinuse.com/typefaces/1359/gran-turismo
7. GTPlanet — GT4 HD HUD & UI texture pack (original HUD reference): https://www.gtplanet.net/forum/threads/gt4-hd-hud-and-user-interface-texture-pack-for-pcsx2.417873/
8. The Cutting Room Floor — Gran Turismo 4: https://tcrf.net/Gran_Turismo_4
