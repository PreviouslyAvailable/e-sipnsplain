---
title: "Metal Gear Solid 2: Sons of Liberty (PS2, 2001) — UI/HUD/Menu Aesthetics"
vault_tag: ps2-ui-hud-aesthetics-eb4295
batch: 1
game: Metal Gear Solid 2
platform: PS2
year: 2001
status: draft
sources:
  - https://metalgearstuff.wordpress.com/2020/01/29/the-fonts-of-metal-gear-solid/
  - https://fontsaga.com/magic-behind-metal-gear-solids-iconic-codec-font/
  - https://metalgear.fandom.com/wiki/Soliton_Radar
  - https://metalgear.fandom.com/wiki/List_of_fonts_used_in_Metal_Gear_logos
  - https://metalgear.konami.net/manual/mc1/mgs2/pc/en/page10.html
  - http://selmiak.bplaced.net/games/ps2/index.php?lang=eng&game=Metal-Gear-Solid-2&page=Radar
  - https://www.artofthetitle.com/title/metal-gear-solid-2-sons-of-liberty/
  - https://fontstruct.com/fontstructions/show/1130977/av07-ration-mgs2
  - https://github.com/NathanHigley/MGS2-HD-UI
created: 2026-06-12T00:00:00Z
---

# Metal Gear Solid 2: Sons of Liberty — PS2 UI/HUD/Menu Aesthetics

## Title Screen

- **Look:** The MGS2 title screen uses a very dark, near-black background with the large "METAL GEAR SOLID 2" logo in silver-grey, rendered in **Helvetica Ultra Compressed**. A colored "2" numeral was present in the original PS2 version (color matching either Snake or Raiden depending on context) — this was controversially removed in the HD Collection and later restoration mods have re-added it.
- **Title sequence:** Designed by **Kyle Cooper** (Imaginary Forces — the firm that did the Se7en title sequence). The opening cinematic title sequence is CGI-driven with typographic montage, digital overlays, and rapid-cut military imagery. Cooper was specifically hired by Kojima.
- **Type:** Helvetica Ultra Compressed for the logo wordmark. Clean, compressed, authoritative — military industrial aesthetic.
- **Motion:** The pre-title Tanker chapter opens with a rain-soaked bridge scene; the main title appears after this dramatic prologue. The title treatment is spare — white/silver type on near-black.

## Menu / Pause Menu Pattern

- **Codec screen:** The signature UI element of the MGS series. A split-screen panel showing the caller's portrait on the left and receiver on right, with a **green phosphor/amber display** aesthetic — evoking 1980s military radio equipment. The codec screen uses a digital/monospace typeface for call sign readouts and status text.
- **Main menu:** Minimalist — dark background, white sans-serif list items (Helvetica Compressed family). Options are left-aligned, wide-tracked.
- **VR Missions mode:** Uses a distinct sans-serif (described in community research as a clean geometric sans) — slightly different from the main game's typography, reflecting the simulation/virtual environment context.
- **Pause overlay:** Translucent dark panel over the game world. Options in clean white sans-serif. "PAUSE" or status text in the codec/military monospace style.
- **Alert/status messages:** Prominent colored text in the top-right corner — ALERT, CAUTION, EVASION states in large bold type using the same compressed sans.

## In-Game HUD

### Radar (Soliton Radar)
The Soliton Radar in MGS2 is one of the most design-studied PS2 HUD elements:

- **Shape:** Circular, positioned in the top-right corner of the screen.
- **Color-coding by alert state:**
  - **Normal / Caution mode:** Radar window colored **bright green** (`~#00cc44`) — classic military phosphor display aesthetic.
  - **Evasion mode:** Radar window colored **orange** (`~#ff8800`).
  - **Alert mode:** Radar window colored **dark red** (`~#880000`) — and shows no useful enemy position data (intentionally hostile to the player).
- **Outline variation:** The radar's outlines are **straight on NTSC-U/NTSC-J** versions but **angled in PAL and Korean** region releases — a subtle regional design difference.
- **Life gauge:** When health is critically low, the gauge turns **orange** and the player bleeds continuously.

### Life and O2 Gauges
- **Life bar:** Horizontal bar, left side of screen, with segmented blocks. Green when healthy, turns orange when critically low.
- **O2 gauge:** Appears when underwater — a separate horizontal bar indicating oxygen remaining.
- **Grip gauge:** Appears when hanging from ledges — shows grip strength draining over time.

### Alert State Typography
- Alert mode triggers large, bold **"!"** icons with colored text.
- Status readouts (ALERT, CAUTION, EVASION, NORMAL) use wide-tracked compressed type — appears to be the same Helvetica Ultra Compressed family.

### Ration and Item Display
- Item/weapon equip display: Top of screen, icon + monospace text label.
- The ration pickup prompt and codec PTT sound meters use a custom "low-tech display type inspired by the digital age of tactical espionage" — community recreations on FontStruct identify this as "AV07 Ration MGS2."

## Font Character

| Property | Value |
|---|---|
| Primary logo font | Helvetica Ultra Compressed (confirmed: Metal Gear Stuff blog) |
| Codec / HUD display | Custom monospace/digital — community approximation: "AV07 Ration MGS2" (FontStruct recreation) |
| Alert text | Helvetica Ultra Compressed or close variant |
| VR Missions | Clean geometric sans (slightly different from main game) |
| Weight | Ultra-compressed, all caps — no variation in weight across UI |
| Tracking | Compressed horizontally; wide vertical; minimal letter-spacing |
| Character | Military-industrial; zero decorative elements; function-only aesthetic |

## Color Palette / Grading

| Name | Approx Hex | Usage |
|---|---|---|
| Near Black | `#0a0a0a` | Universal background |
| Military Green (radar normal) | `#00cc44` | Radar in normal/caution mode |
| Alert Orange (radar evasion) | `#ff8800` | Radar in evasion mode |
| Alert Red (radar alert) | `#880000` | Radar in full alert |
| Life Critical Orange | `#ff6600` | Life gauge when critically low |
| White / Silver | `#e8e8e8` | Primary text everywhere |
| Codec Green Phosphor | `#33ff66` | Codec screen text tint |
| Codec Amber | `#ffb300` | Alternative codec display tint |

**Overall grading:** MGS2's palette is intentionally monochromatic-with-signal-color. The near-black world is punctuated only by functional color signals (green=safe, orange=danger, red=maximum threat). No decorative color anywhere. This binary structure — darkness + emergency signal — is the defining aesthetic of military-tactical game UI.

## Cross-Reference Notes

- Helvetica Ultra Compressed has been "the series' go-to font since Metal Gear 2 [1990]" and persists through MGS3, MGS Portable Ops, and Peace Walker.
- Kyle Cooper's title sequence design for MGS2 represents a rare instance of a Hollywood title-sequence designer (Se7en, Mission: Impossible) being hired specifically for a video game's UI/intro design.
- The codec screen design is among the most recognizable UI elements in PS2-era gaming — a split-panel portrait display with green phosphor aesthetics that has been widely imitated.

## Sources

1. Metal Gear Stuff — "The Fonts of Metal Gear Solid": https://metalgearstuff.wordpress.com/2020/01/29/the-fonts-of-metal-gear-solid/
2. FontSaga — "The Magic Behind Metal Gear Solid's Iconic Codec Font": https://fontsaga.com/magic-behind-metal-gear-solids-iconic-codec-font/
3. Metal Gear Wiki — Soliton Radar (color coding): https://metalgear.fandom.com/wiki/Soliton_Radar
4. Metal Gear Wiki — List of fonts used in Metal Gear logos: https://metalgear.fandom.com/wiki/List_of_fonts_used_in_Metal_Gear_logos
5. Konami MGS2 Online Manual: https://metalgear.konami.net/manual/mc1/mgs2/pc/en/page10.html
6. Selmiak — MGS2 Radar guide: http://selmiak.bplaced.net/games/ps2/index.php?lang=eng&game=Metal-Gear-Solid-2&page=Radar
7. Art of the Title — MGS2 title sequence (Kyle Cooper): https://www.artofthetitle.com/title/metal-gear-solid-2-sons-of-liberty/
8. FontStruct — AV07 Ration MGS2 recreation: https://fontstruct.com/fontstructions/show/1130977/av07-ration-mgs2
9. GitHub — MGS2 HD UI texture pack (original texture reference): https://github.com/NathanHigley/MGS2-HD-UI
