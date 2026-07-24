---
id: note-katamari-ui-eb4295
title: Katamari Damacy PS2 — UI/HUD/Menu Design Analysis
tags: [ps2-ui-hud-aesthetics-eb4295, katamari, namco, keita-takahashi, HUD, ps2, rainbow, typography]
status: active
sources:
  - https://katamaripedia.miraheze.org/wiki/Fonts_in_the_Katamari_Damacy_series
  - https://www.gamedeveloper.com/design/postmortem-the-singular-design-of-namco-s-katamari-damacy-2004-
  - https://www.colourlovers.com/palette/146694/Katamari_Damacy
  - https://colorswall.com/palette/78705
  - https://www.moma.org/collection/works/164919
  - https://www.gameuidatabase.com/gameData.php?id=124
  - https://thesafehouse.org/forums/forum/main-house/logged-out/25926-katamari-damacy-font
---

## Title Screen
Katamari Damacy's title screen is a pure expression of the game's joyful chaos: the logo rendered in widened Futura Heavy (English) over vivid, saturated backgrounds. The Prince character (lime green) is prominently featured. The palette hits maximum saturation — golden yellows, coral reds, sky blues — against a bright ground. There is no dark moody framing; everything is open, cheerful, and front-lit.

## Menu / Pause Menu Pattern
Menus are clean, flat, and colorful — no gradients, no drop shadows. Menu items appear as bold, rounded sans-serif text in the Rodin Pro DB typeface (or modifications thereof). The background uses bright solid colors or simple geometric shapes in the franchise's signature palette. Each menu state transitions with bouncy, playful animation.

## Font Character
- **UI font:** Rodin Pro DB by Monotype (formerly Fontworks) — rounded, humanist sans-serif
  - Applied with deliberate modifications: letters repositioned or enlarged for "funky" feel
  - No sharp corners — every letterform has rounded terminals
- **Logo font (EN):** Futura Heavy, slightly widened — geometric, bold, no-nonsense
- **Kanji logo:** Custom typeface (no commercial equivalent)
- **Dialogue font:** Custom (PS2 original) — multiple fan recreations exist; later games used Seurat Pro B (Monotype)
- **Character:** Chunky, rounded, high x-height — maximum legibility at game screen resolutions
- **Tracking:** Tight, playful — letters sit close together, emphasizing the "packed" feel of the katamari

## Color Palette
| Color | Hex | Role |
|---|---|---|
| Katamari yellow | #fccc04 | Primary UI accent, The King |
| Coral red | #fc606a | Secondary accent, danger |
| Lime green (Prince) | #6bcb4e | Character, success states |
| Sky blue | #4eb8cb | HUD, size meter bg |
| Mauve purple | #9e5d79 | Cousins, variety |
| Dark olive | #635911 | Shadow, depth |
| Near-black | #34342c | Text, outlines |

**Color philosophy:** Full spectrum rainbow — the game uses ALL colors because the katamari collects ALL objects. No single hue dominates; every color exists in tension with every other. Anti-minimalist, maximally inclusive.

## HUD Elements
- **Size meter:** Primary HUD element — displays current katamari diameter vs. target size. Simple numeric/bar indicator in rounded Rodin-style type. Often shown as a circular or linear progress indicator.
- **Timer:** Countdown clock when missions have time limits — displayed in bold, high-contrast type at screen edge.
- **Size guide (optional):** Missions can run without the size guide displayed — a deliberate design choice allowing estimation/skill play.
- **No health bar, no combat HUD** — the game's single mechanic (grow the katamari) means the HUD only needs to communicate size and time.
- **King's head:** The King of All Cosmos sometimes appears at screen edge offering commentary — personality UI.

## Design Notes / Key Patterns
1. **Total aesthetic coherence:** Keita Takahashi designed every element — graphic style, color, music, cutscenes — as a unified "peaceful ambiance" system. The UI is inseparable from the world.
2. **Anti-corporate cheerfulness:** Reacting against what Takahashi saw as unoriginal game design, the Katamari UI was intentionally maximally playful, colorful, and weird.
3. **Maximum saturation, minimum complexity:** The color palette is saturated to extremes, but the UI geometry is dead simple — no complex chrome or ornamentation.
4. **Rounded everything:** From the katamari ball itself to the font terminals to the button shapes — roundness is the design grammar.
5. **MoMA recognition:** Katamari Damacy is in MoMA's permanent collection, confirming its status as a seminal design artifact.

## Web Kit Takeaways
- **Card pattern:** Bright solid-color card, no border-radius below 12px — always rounded; white or near-white text on saturated fill
- **Button pattern:** Pill-shaped or rounded-rect, Futura/Nunito weight, high saturation fill (#fccc04 primary), no gradients
- **Progress indicator:** Circular size meter — bold circular arc in coral or yellow, track in near-black (#34342c)
- **Typography:** Rodin Pro DB (paid) → free alternative: Nunito, Poppins, Varela Round (all rounded sans with similar x-height)
- **Palette:** #fccc04 (primary), #fc606a (danger/accent), #6bcb4e (success), #4eb8cb (info), #34342c (text)
- **Motion principle:** Bouncy spring animations — every UI interaction should feel like a ball rolling into place
