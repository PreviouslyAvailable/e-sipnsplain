---
id: note-rez-ui-eb4295
title: Rez PS2 — UI/HUD/Menu Design Analysis
tags: [ps2-ui-hud-aesthetics-eb4295, rez, wireframe, vector, synesthesia, tetsuya-mizuguchi, HUD, ps2, kandinsky]
status: active
sources:
  - https://www.feedme.design/rez-a-cultural-and-design-revolution-in-gaming/
  - https://shmuplations.com/rez/
  - https://www.timeextension.com/features/the-making-of-rez-tetsuya-mizuguchis-timeless-masterpiece
  - https://www.mobygames.com/game/5613/rez/
  - https://tvtropes.org/pmwiki/pmwiki.php/VideoGame/Rez
  - https://www.factmag.com/2017/01/10/rez-infinite-tetsuya-mizuguchi-interview/
  - https://www.localditch.com/sega/rez/
  - https://pspolygons.substack.com/p/what-rez-knew-about-electronic-music
  - https://kotaku.com/rez-is-now-20-and-there-was-nothing-quite-like-it-1848106449
---

## Title Screen
Rez's title screen is a pure wireframe grid on near-black — geometric line structures pulse and flow. The "REZ" wordmark appears in a clean, geometric sans-serif or display typeface (suggesting a modular grid-letter form). Everything glows — white or cyan wireframe lines against the void. No photography, no illustration, no naturalistic elements. It looks like the inside of a computer system booting up.

## Menu / Pause Menu Pattern
Menus are minimal — line-based UI elements on dark backgrounds. Text is set in clean, unornamented sans-serif. Every menu element glows with the wireframe neon quality of the game world. There are no ornate decorations; the UI is as spare as the game's wireframe environment — only information, no chrome.

## Font Character
- **Display font:** Geometric sans-serif — clean, modular, no serifs
- **Body font:** Clean sans, high legibility at game resolution
- **Character:** Futurist / constructivist — aligned with the Kandinsky/Soviet Constructivism visual heritage
- **Weight:** Medium to bold; no thin weights (too delicate for the wireframe glow effect)
- **Tracking:** Wide — letters spread across the dark background like wire segments
- **No organic curves** — everything references the wireframe geometry of the gameplay environment

## Color Palette
Rez does NOT have a fixed palette — colors shift dynamically based on player actions and game state. However, the dominant color language is:

| Color | Hex (approximate) | Role |
|---|---|---|
| Near-black void | #050510 | Background |
| Wireframe cyan | #00e5ff | Primary wireframe |
| Wireframe electric blue | #1a6bff | Enemy structures |
| Glow white | #e8f4ff | High-intensity shot explosions |
| Amber/orange | #ff8c00 | Stage heat, progression |
| Hot magenta | #ff007f | Higher-intensity areas |
| Lime green | #39ff14 | Neon accent, energy |
| Deep purple | #1a0033 | Deep space background |

**Color philosophy:** Wireframe neon on near-void black. Color is not decorative — it is functional feedback. As player progression changes, the color of the environment shifts (described by reviewers as "blasts of color exploding everywhere" during peak play). The player's shooting technique literally changes the color of the game world.

**Dynamic color:** Rez includes a mode where players can select alternate color schemes, making color itself a user-controlled parameter.

## HUD Elements
Rez has perhaps the most radical HUD design of any PS2 game — the HUD IS the player character:

- **Health system (Overdrive):** The player character evolves visually through 5 levels (Level 00–04) based on collected power-ups:
  - **Level 00:** A ball of triangles — geometric, primitive
  - **Level 01:** Stacked planar quadrilaterals in a humanoid shape — nascent digital consciousness
  - **Level 02–04:** Increasingly complex wireframe humanoid forms
  - The character's FORM is the health bar — losing levels means devolving to simpler forms; dying returns to Level 00
- **Blue power-up pieces:** Collecting blue wireframe fragments advances the player's form level — color-coded feedback in the environment itself
- **Score/chain indicators:** Minimal on-screen numeric display in clean sans-serif at screen edge
- **No map/radar** — the game is a rail shooter; navigation is automatic
- **Lock-on targeting:** Visual cursor system — geometric targeting brackets that snap to enemies, styled as wireframe reticle

## Design Philosophy

### Synesthesia as UI Principle
Mizuguchi's core concept was synesthesia: "hear the colors, see the sound." Every UI element in Rez is designed to be felt as much as seen:
- Player shots generate musical notes
- Enemy destruction triggers rhythmic beats
- The screen's color directly corresponds to the audio intensity
- The DualShock vibration ("Trance Vibrator" accessory) was designed to sync with the music

**The UI communicates through all senses, not just vision.**

### Kandinsky Influence
The visual language derives from Wassily Kandinsky's theory that abstract geometric forms carry inherent emotional and spiritual meaning:
- Geometric forms (triangles, circles, lines) are the vocabulary
- Color changes emotional state, not just aesthetic decoration
- The evolution from simple to complex forms mirrors Kandinsky's composition theory

The game was internally named "Project K" for Kandinsky.

### Street Parade Inspiration
Mizuguchi's epiphany came at the 1997 Zurich Street Parade (300,000 attendees) — the merging of techno music, light shows, and crowd energy. Rez is an attempt to recreate this synesthetic spectacle within a video game.

### Wireframe as Deliberate Choice
Art director Katsumi Yokota chose wireframe specifically because he wanted to see "how much can be expressed with only wireframes." This is NOT a technical limitation — it's an aesthetic philosophy. The wireframe is the game's artistic identity.

## Cultural Recognition
- Featured in Smithsonian American Art Museum's 2012 exhibit "The Art of Video Games"
- Included in MobyGames' historical documentation as a landmark title
- Considered a design revolution: "Rez wasn't just another game — it was a full-on cultural statement"

## Area Structure
- **Area 1:** Ancient-Egyptian-inspired architecture, medium complexity wireframe, blue-cyan palette dominant
- **Area 2:** Mesopotamian/Mars theme
- **Area 3:** Greek/Venus theme
- **Area 4:** Uranus theme, increasingly abstract
- **Area 5:** Eden — the AI antagonist's domain; maximum visual complexity and color intensity, evolutionary life narrative
- Each stage's colors shift dynamically with player performance

## Web Kit Takeaways
- **Card pattern:** Near-black (#050510) background, wireframe border (1-2px solid #00e5ff with glow effect), geometric sans text in white/cyan
- **Glow effect:** `box-shadow: 0 0 8px #00e5ff, 0 0 20px #00e5ff33` — subtle inner glow on borders
- **Button pattern:** Wireframe outline button — transparent fill, glowing border, no fill until hover (then faint cyan fill)
- **Progress indicator:** Wire-arc progress ring — animated geometric arc in cyan on near-black background
- **Avatar/level indicator:** Geometric shape progression — use increasing polygon complexity as state indicator
- **Typography:** Free alternatives: Orbitron, Rajdhani, Share Tech Mono for the geometric-futurist feel
- **Palette:** #050510 (bg), #00e5ff (primary neon), #1a6bff (secondary), #ff8c00 (warm accent), #e8f4ff (high-intensity white)
- **Motion:** Pulse animations synced to rhythm — everything pulses or oscillates; nothing is static; use CSS `animation: pulse 0.5s ease-in-out infinite`
- **Color-as-feedback:** Use color saturation changes (CSS `filter: saturate()`) to communicate state changes — more saturated = more intense/dangerous state
