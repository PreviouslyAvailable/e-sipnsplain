---
id: note-batch3-cross-patterns-eb4295
title: Batch 3 Cross-Game UI Patterns — Okami, Katamari, Silent Hill 2/3, Rez
tags: [ps2-ui-hud-aesthetics-eb4295, cross-game-patterns, ui-patterns, web-kit, ps2]
status: active
---

## Summary

Batch 3 covers five PS2 games: Okami (2006), Katamari Damacy (2004), Silent Hill 2 (2001), Silent Hill 3 (2003), and Rez (2001). Despite radically different aesthetics, they share several structural UI design principles that are distinct to this era of console game design.

## Cross-Game Pattern 1: UI = Art Identity (not neutral chrome)

All five games use the interface as an extension of the game's core artistic identity. None use "default" UI conventions:

| Game | Art Identity | UI Extension |
|---|---|---|
| Okami | Sumi-e ink wash / washi paper | All menus as ink-on-paper scrolls; HUD as brushstroke symbols |
| Katamari | Maximalist rainbow / rounded forms | Rodin Pro DB rounded font; saturated solid-color menus; pill buttons |
| Silent Hill 2/3 | Horror decay / institutional fog | Times-serif on near-black; paper-texture map; no visible health bar |
| Rez | Kandinsky wireframe / synesthesia | Wireframe character as health meter; dynamic color = state feedback |

## Cross-Game Pattern 2: Diegetic Health / Minimal HUD

Three of five games encode health non-traditionally:
- **Okami:** Health as painted sun-disc symbols (styled as brushstroke art, not numeric bars)
- **Silent Hill 2/3:** Health as character posture/audio (no on-screen health at all)
- **Rez:** Health as avatar form complexity (character evolves/devolves = health level)
- **Katamari:** Only game with explicit HUD (size meter) — but this is the ONE mechanic, so the HUD is entirely the game's feedback
- **Pattern:** PS2-era prestige games lean toward hiding or art-ifying health indicators

## Cross-Game Pattern 3: Four Distinct Color Extremes

Each game occupies a different extreme of the color spectrum:

| Game | Color Extreme | Palette Philosophy |
|---|---|---|
| Okami | Traditional Japanese tricolor | Red (#f71b47), ink black (#000000), washi cream (#f5f0e8) |
| Katamari | Maximum saturation, full spectrum | Yellow (#fccc04), coral (#fc606a), all rainbow hues |
| Silent Hill | Maximum desaturation | Fog sage (#aecf92), teal (#244454), near-black (#1f2123) |
| Rez | Neon on void | Cyan (#00e5ff), near-black (#050510), dynamic glow |

No two games share a color strategy. Each owns its palette extreme completely.

## Cross-Game Pattern 4: Typography as World-Building

Each game's font is a direct expression of its world, not just a legibility choice:

| Game | Font | World Expression |
|---|---|---|
| Okami | Brushstroke calligraphy (custom) | "You are in a living sumi-e painting" |
| Katamari | Rodin Pro DB (rounded, modified) | "This is playful, weird, and cheerful" |
| Silent Hill | Times-derived serif (18pt bold) | "This is institutional, decayed, official" |
| Rez | Geometric sans (constructivist) | "This is inside a computer, pure geometry" |

## Cross-Game Pattern 5: PS2 Hardware as Creative Catalyst

Two games directly transformed hardware limitations into artistic identity:
- **Okami:** PS2 couldn't handle photorealism → sumi-e style invented → Celestial Brush mechanic born from art style
- **Rez:** Wireframe graphics chosen despite not being a technical requirement — pure aesthetic preference by art director Yokota

This suggests a PS2-era design principle: constraint embraced, not hidden.

## Web UI Kit Component Ideas (Batch 3 Derived)

### Component Library: "PS2-Aesthetic Pack v3"

**1. Okami Paper Card** (`paper-card`)
- Background: washi-cream (#f5f0e8), paper grain texture
- Border: brushstroke SVG (irregular ink-line border)
- Text: brushstroke serif or Shippori Mincho
- Accent: sun-red (#f71b47) for primary action

**2. Katamari Pill Button** (`katamari-pill`)
- Background: #fccc04 (primary) or any high-saturation hue
- Border-radius: 999px (full pill)
- Font: Nunito ExtraBold or Varela Round (Rodin Pro DB substitute)
- Text: #34342c (near-black) for contrast on bright fills

**3. Silent Hill Dark Menu** (`sh-menu-overlay`)
- Background: #1f2123 (near-black)
- Text: #c5d0bc (cement gray — NOT pure white, slightly green-tinted)
- Border: 1px solid #495b69 (fiord gray)
- Font: Noto Serif Regular
- Texture overlay: noise/grain CSS filter

**4. Rez Wireframe Card** (`rez-wire-card`)
- Background: #050510 (near-void)
- Border: 1-2px solid #00e5ff with `box-shadow: 0 0 8px #00e5ff`
- Text: #e8f4ff (glow white)
- Font: Orbitron or Share Tech Mono
- Hover: faint `background: rgba(0,229,255,0.05)` fill

**5. Okami Brush Progress Ring** (`okami-sun-progress`)
- SVG circular arc in #f71b47 on cream background
- Stroke style: variable width to suggest brushstroke weight
- Fill: cream (#f5f0e8) interior with subtle paper texture

**6. Rez Level Avatar** (`rez-form-indicator`)
- SVG polygon that increases vertex count with state level
- Level 0: circle (3-vertex triangle approximation)
- Level 1-4: hexagon → dodecagon → complex form
- Stroke: #00e5ff glow; no fill

**7. Silent Hill Fog Text** (`sh-fog-label`)
- Font: Noto Serif
- Color: #aecf92 (fog sage green)
- `text-shadow: 0 0 6px rgba(174,207,146,0.4)` — ambient fog glow
- Letter-spacing: 0.05em

**8. Katamari Size Meter** (`katamari-size-meter`)
- Horizontal progress bar, pill-shaped (border-radius: 999px)
- Track: #34342c; Fill: gradient from #fc606a to #fccc04
- Label: Nunito ExtraBold showing "XCM / TARGET"

## Unfetched Leads (beyond cap)
- shmuplations.com/rez — primary developer interview with full wireframe design quotes (partial quotes obtained via search; full text not fetched)
- gamedeveloper.com Katamari Damacy postmortem — full text (20th anniversary release); partial quotes obtained
- timeextension.com "Making of Rez" — full feature on Katsumi Yokota's wireframe philosophy
- silenthill.fandom.com font list — full table of all logo fonts across the franchise
- katamaripedia.miraheze.org/wiki/Fonts_in_the_Katamari_series — complete font breakdown per game
