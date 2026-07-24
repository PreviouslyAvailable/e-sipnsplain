---
id: note-okami-ui-eb4295
title: Okami PS2 — UI/HUD/Menu Design Analysis
tags: [ps2-ui-hud-aesthetics-eb4295, okami, sumi-e, japanese-art, HUD, ps2]
status: active
sources:
  - https://en.wikipedia.org/wiki/%C5%8Ckami
  - https://medium.com/@gio.c.diiorio/why-remastered-games-should-revamp-their-ux-365b5f345d54
  - https://gamefaqs.gamespot.com/ps2/920500-okami/faqs/76318
  - https://www.fanatical.com/en/blog/okami-hd-traditional-art-graphics-in-a-modern-game
  - https://www.gameuidatabase.com/gameData.php?id=410
  - https://www.colourlovers.com/palette/1299863/Okami
  - https://www.color-hex.com/color-palette/1025606
  - https://champicky.com/2019/08/30/okami-amaterasu-design-analysis/
---

## Title Screen
The Okami title screen renders the logo in brushstroke calligraphy over a traditional Japanese scroll/washi paper texture with ink-wash landscape imagery. The sun-disk (Amaterasu's emblem) is the dominant visual element — a bold crimson circle on cream/off-white paper. The overall feel is a living sumi-e painting, not a digital menu.

## Menu / Pause Menu Pattern
Menus appear as scrolls or flat ink-paper panels. The pause screen overlays the world with a muted washi-paper wash. Menu text is set in brushstroke-styled calligraphy. There are no hard rectangular UI boxes — every panel has irregular, hand-painted edges. Item descriptions are set in a lighter, thinner brushstroke weight.

## Font Character
- **Primary display font:** Custom brushstroke calligraphy — irregular, weighted, ink-splatter terminals
- **Body/UI text:** Lighter brushstroke variant, resembling traditional Japanese brush writing
- **No geometric sans or serif** — all typography is organic and hand-rendered
- **Tracking:** Loose, mimicking the natural spacing of calligraphic writing
- **Weight:** Variable — display strokes are bold/heavy; body text uses medium weight

## Color Palette
Derived from multiple community palette analyses and game art documentation:

| Color | Hex | Role |
|---|---|---|
| Sun red / crimson | #f71b47 | Health, sun motif, Amaterasu |
| Deep crimson | #c20f3d | Accent, flames |
| Washi cream (approx.) | #f5f0e8 | Canvas/paper background |
| Sumi ink black | #000000 | Outlines, brushstrokes |
| Ink dark gray | #2a2a2a | Secondary text |
| Nature gold | #d4a017 | Accents, sacred objects |
| Cherry blossom pink | #f4b8c8 | Seasonal motifs |
| Muted sage green | #7a9a6a | Nature/landscape elements |

**Color philosophy:** Red-on-cream-on-black — a traditional Japanese ukiyo-e tricolor. The paper (cream) is always the base; ink black defines form; red indicates life/divinity.

## HUD Elements
- **Health:** Solar Units — 3 sun-disc symbols rendered in brushstroke style, positioned top-left. Each unit is a small circular sun glyph painted in red/gold.
- **Ink pots:** Below health — 3 ink pot icons. Each pot drains as Celestial Brush is used; regenerates 1 pot per 9 seconds (without equipment upgrades).
- **HUD visibility:** Optional — can disappear to reveal the full painting; player presses L2/Z to briefly summon it.
- **Celestial Brush overlay:** Full-screen washi-paper canvas with ink-black cursor trail. The world freezes behind a cream-paper wash. Player draws symbols with analog sticks.
- **No minimap, no waypoints** — navigation is non-diegetic free exploration.

## Design Notes / Key Patterns
1. **Art-as-UI:** Every UI element is a painted object, not a digital chrome element.
2. **Mechanic born from aesthetic:** The Celestial Brush mechanic was conceived after the sumi-e art style was locked — the art direction dictated the gameplay system.
3. **PS2 constraint → art triumph:** Clover's PS2 hardware limits on photorealism forced the sumi-e style, which became the game's defining identity.
4. **Diegetic HUD philosophy:** Hiding the HUD is a first-class feature — the game is designed to be enjoyed as a painting without overlay.
5. **Paper texture as UI ground:** The canvas/paper metaphor extends from the title screen through every menu and HUD element — consistent, total immersion in the sumi-e world.

## Developer Quotes
- Atsushi Inaba (CEO, Clover Studio): "Once we fixed ourselves on a graphical style and got down to the brushwork, we thought 'Wouldn't it be great if we could somehow get the player involved and participate in this artwork instead of just watching it?' That's how the idea of the Celestial Brush was born."

## Web Kit Takeaways
- **Card pattern:** Scroll/paper card with brushstroke border, ink-black text on washi-cream (#f5f0e8) background
- **Button pattern:** Ink-seal style — round or rectangular with brushstroke border, red (#f71b47) fill for primary action
- **Progress indicator:** Sun-disc fill — circular progress indicator using the solar glyph motif
- **Typography:** Use a Japanese brush font (e.g., Zen Brush, Shippori Mincho for body); irregular stroke weight variation is essential
- **Texture:** Paper grain / rice paper texture as CSS background — `background-image: url(washi-texture.png)`
- **Palette:** #f5f0e8 (bg), #000000 (text), #f71b47 (primary), #d4a017 (accent)
