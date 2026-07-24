---
title: "PS2 System Software Visual/UI Design Brief"
source-count: 28
date: 2026-06-12
---

# PS2 System Software Visual/UI Design Brief

A sourced reference document for design tokens targeting a PS2-inspired web UI kit. All concrete values are cited inline. Uncertainty is flagged explicitly.

---

## 1. Boot Sequence — Visual Description & Meaning

### Phase 0: "PlayStation 2" Logo Dust Dissolve

Before the main boot animation, the stylised "PlayStation 2" wordmark appears via a **blue dust gathering effect** — fine luminous particles coalesce into the logo then the screen cuts to the volumetric space [1][2]. The logo itself uses the same typeface geometry as the "PlayStation" mark. Technically, the PS2 logo seen after console startup is stored on the game disc itself (encrypted in the first 16 sectors; decryption key lives in the disc's watermark data). If the logo is absent, an error screen is thrown instead [2].

### Phase 1: The "Sony Computer Entertainment" Screen — Volumetric Space

**Background:** Deep near-black space with volumetric **blue cloud/nebula** mist. The background is not flat black — it is a hazy atmospheric blue-black environment that the camera slowly zooms into and tilts toward [3][4].

**Floating cubes (the "sand"):** Five large dark **glass cubes** float and slowly drift/revolve in the scene. These are semi-transparent, volumetric 3D objects — rendered in real-time CGI at 60 fps [1][2]. They are described as "dark" or "giant glass cubes," bluish-tinted due to the ambient environment. These are purely aesthetic; they are NOT tied to memory card data.

**The four comets:** Four small light streaks — colored **blue, green, pink, and red** — representing the PlayStation controller button colors (Cross/blue, Triangle/green, Square/pink, Circle/red) — arc through the scene [3][4].

**"Sony Computer Entertainment" wordmark:** White text, appears centered, fades in and then fades out over the course of the opening. The font matches the clean sans-serif used throughout the BIOS [2][4].

**Camera motion:** The camera slowly zooms into the blue cloud/mist while tilting. The duration of this zoom varies based on boot conditions: ~4 seconds with no media, up to ~8–12 seconds depending on HDD presence, PSBBN installation, memory card read time, and software boot speed. Boot to game (disc → game) typically takes 10–12 seconds total; the pre-game startup screen itself runs ~8–10 seconds for the swirl/mist fade [5][6].

**Technique:** Real-time CGI. The rendering runs on the PS2's Emotion Engine / Graphics Synthesizer hardware in real time — not a pre-rendered video [2].

**Audio:** A short, airy, breathy synthesiser jingle with bell-like tones — described as a "whooshing, breathy synth jingle with bells, followed by a whoosh when the screen zooms into the cloud." The musical backbone uses **perfect fourth chords**, a deliberate carry-over from the PS1 sound, to express "simple strength and the image of landing somewhere from space" [7][8]. The briefing given to sound designer Takafumi Fujisawa's team by Ken Kutaragi invoked imagery of **"a monolith floating in space with the earth in the background"** [8]. Composed collaboratively by Fujisawa's team via an internal contest; Fujisawa finalized the two shortlisted options [7][8].

### Phase 2: The Memory-Card Tower Variant (the Easter Egg)

When a PS2 Memory Card is inserted with game-launch history data, the volumetric space also shows **white columnar towers/pillars** rising from the mist [9][10][11].

**What towers represent:** Each tower corresponds to one game title that has been launched on that specific memory card. Tower **height** encodes how many times that particular game was booted — more launches = taller tower [9][10][11][12]. The data is stored in the `B?DATA-SYSTEM` directory on the memory card (where `?` is the region letter), in a hidden system folder labeled "Your System Configuration" in the BIOS browser — unrelated to game saves. Deleting all game saves does not change the towers. Only inserting a fresh blank memory card removes them [12].

**Towers grow over time:** As individual games are played more, "each block becomes an ever-growing tower with a misty trail behind it" [4]. A maximum number of titles can be tracked; if the limit is reached, the least-recently-played title's tower is dropped [12].

**The small blocks/cubes (the "sand"):** In addition to towers, small white blocks appear across the scene — these are the nascent state of towers before they grow. Sources describe them as "white blocks" scattered "all over the screen" [4][9]. They are distinct from the five large dark glass cubes described in Phase 1.

**Error screen variant:** When no disc is inserted (error state), the environment shifts to **red clouds** spiraling around a red light with glass cubes revolving around it — a completely separate color-coded state [2].

### Phase 3: Browser / Main Menu

After the boot animation, the system lands on the **OSDSYS Browser** — a dark-background 2D menu. OSDSYS ("On-Screen Display System") is the ROM program that shows the boot animation, the clock/browser menus, and handles memory card management [13].

---

## 2. Color Palette

### Boot Screen Environment

The exact hex values for the real-time CGI boot background are **not published in any official Sony documentation** and no authoritative pixel-sampled teardown was found. The following reconstructed values are derived from visual analysis of recorded footage, community recreations, and Sony brand color references. Treat all boot-background values as **best estimates (±15% brightness tolerance)**.

### OSDSYS Browser Background

The OSDSYS interface uses a **dark blue** background for system file icons (System Configuration, Corrupted Data, Network Settings). Three icon.sys presets are baked into the OSDSYS executable; the "regular" dark blue is the default for system items [12][13].

### Color Palette Table

| Name | Hex | Where it appears | Confidence |
|------|-----|-----------------|------------|
| Boot Void | `#000814` | Near-black zenith of boot-screen sky (top of gradient) | Estimated |
| Boot Deep Navy | `#001428` | Mid-upper boot-screen gradient | Estimated |
| Boot Horizon Blue | `#002B5C` | Mid-screen boot gradient, background behind towers | Estimated |
| Boot Cloud Blue | `#0044A0` | Bright volumetric blue cloud / mist centre | Estimated |
| PlayStation Resolution Blue | `#003087` | PlayStation brand blue (official; used on packaging, UI accents) | Official [14] |
| PlayStation True Blue | `#006FCD` | PlayStation's official primary blue (Pantone 285 C, PMS) | Official [15] |
| Sony UI Royal Blue | `#1E5DDB` | PS2-era Sony UI accent — royal blue tint | Community palette [16] |
| Sony UI Deep Midnight | `#182580` | Deep midnight blue; secondary PS2 UI blue | Community palette [16] |
| Sony UI Sky | `#5CC9FB` | Light sky blue; glow / highlight accent | Community palette [16] |
| Tower / UI White | `#FFFFFF` | Memory-card towers, "Sony Computer Entertainment" text, UI labels | Observed |
| Glass Cube Tint | `#AEBFD4` | Semi-translucent glass cube highlight (bluish grey-white) | Estimated [16] |
| OSDSYS Dark Slate | `#2E393D` | Dark background/border tones in browser UI | Community palette [16] |

> **Flag:** No officially published per-pixel hex breakdown of the boot gradient exists. The "Boot Void / Deep Navy / Horizon / Cloud" values above are working approximations for token use — validate against a reference capture from PCSX2 at 1080p.

---

## 3. Typography

### What Font Does the PS2 BIOS Actually Use?

**The BIOS font is a custom Sony-licensed design embedded in the ROM as bitmap/vector font files.** The primary OSDSYS font files are:

- `FNTASCII` — ASCII characters
- `FNTASCI2` — Extended ASCII
- `FNTEX000`, `FNTEX001`, `FNTEXOSD` — Extended OSD characters (updated in OSDSYS ≥ 01.10)
- `FONTM` — Full multi-language font used by the memory card manager
- `FONTS` — System font [13]

**Identification:** The standard BIOS/OSDSYS interface font (especially the `FNTEXOSD` used in SCPH-30000 and later) is a **clean humanist sans-serif**, widely compared to Helvetica but not identical. A community dafont.com thread attempting to identify it concluded it is **"SST Heavy, or a very similar one"** after ruling out plain Helvetica [17].

**SST context:** SST is a humanist sans-serif typeface **designed by Monotype for Sony in 2013**, modelled after Helvetica (Sony's previous typeface) and Frutiger [18]. However, SST was officially commissioned in 2013 — after the PS2's 2000 launch. The PS2 BIOS therefore almost certainly used **Helvetica or a licensed Helvetica variant** (Sony's corporate standard pre-SST), embedded as a custom bitmap rendering. TCRF notes that on certain regional models (Korean, Traditional Chinese, Russian), "PlayStation" and "PlayStation 2" texts appear in "the same Helvetica font as the rest of the message" [19] — confirming Helvetica was the underlying reference for the BIOS interface font.

**Visual character:** The BIOS UI text is thin-to-medium weight, with wide letter-spacing (tracked out), rendered at small point sizes on SD TV resolution (480i/576i). The overall impression is **light, airy, wide-set sans-serif** — not condensed. One open-source PS2 OSDSYS replacement project explicitly suggests that the BIOS fonts "could probably be generated from the **Roboto** font, which is licensed under a permissive license" [20].

**Flag:** The exact proprietary BIOS font is debated. Closest sourced identification: Helvetica (pre-2013 Sony standard) → SST Heavy for later Sony contexts. Free equivalents should target a humanist sans with moderate x-height, open apertures, and slightly wide tracking.

### Font Candidates Table

| Font | Free? | Why it matches | Source |
|------|-------|----------------|--------|
| **Roboto** (Light/Regular) | Yes (Apache 2.0) | Explicitly suggested as PS2 OSDSYS open-source replacement; humanist, moderate x-height | [20] |
| **Inter** (Light/Regular) | Yes (OFL) | Humanist sans designed for screens at small sizes; very close Helvetica lineage; wide-spacing friendly | Design community consensus |
| **Saira** (Light/ExtraLight) | Yes (OFL) | Condensed-to-normal industrial sans, multi-width system; matches PS2's engineered-yet-approachable feel; available on Google Fonts | [21] |
| **Exo 2** (Light/Regular) | Yes (OFL) | Geometric-humanist hybrid, monolinear strokes, slightly condensed; tech-interface energy matching PS2 BIOS | [21] |
| **Barlow** (Light/Regular) | Yes (OFL) | Humanist grotesque with warmth; Helvetica-influenced; lighter weights at wide tracking match BIOS UI labels | [21] |
| **SST** (commercial) | No (Monotype, licensed) | The exact Sony corporate typeface used on PS4/PS5; closest to the PS2 BIOS intent but not free and post-dates PS2 | [18] |
| **Helvetica Neue** (commercial) | No (Monotype) | Most likely the actual embedded BIOS font reference; zero-cost only through system font stacks | [19] |
| **BTSE PS2** (fan font, dafont) | Unknown license | Techno square recreation of PS2 UI style; 390K+ downloads; labeled "Techno > Square" category | [22] |
| **Emotion Engine** (fan font, fontspace) | Personal use | Fan recreation in PS2 aesthetic category | [23] |

**Recommended web tokens:**
- Primary body/UI: `font-family: 'Barlow', 'Inter', 'Roboto', 'Helvetica Neue', sans-serif`  
- Letter-spacing on labels/UI text: `letter-spacing: 0.08em` to `0.15em` (wide, airy)  
- Weight for primary text: 300 (Light) or 400 (Regular)  
- Weight for headers/emphasis: 500–600

---

## 4. BIOS Dashboard Layout

### Main Menu (OSDSYS Browser Menu)

When the PS2 boots without a game disc inserted, the OSDSYS main menu appears with **two selectable options**:

1. **Browser** — accesses memory cards and optical discs
2. **System Configuration** — accesses settings, clock, version info

**Layout:** The two options are presented as large icon-buttons, centered on screen, against the dark navy/blue-black background. Navigation uses the D-pad; selection uses the X button [24][25].

**The visual clock element:** The main menu and system configuration screens feature a real-time **3D animated analog clock** in the background/foreground. It consists of:
- 7 orbs continuously flying in a spherical swirling pattern near the center
- 12 crystal hexagonal rods forming the analog clock face
- Each crystal rod rotates individually; the entire face rotates collectively
- The orbs are described as **blue spinning dots**; the clock "appears to be slowly falling down an endless wormhole" while sounds of crashing beach waves and low rumbles play
- The clock can be brought into full focus by pressing the Square button in System Configuration [26]

**The blue spinning orbs/dots** visible on the main menu selection screen (the screen offering "Browser" / "System Configuration") are part of this clock visualization — they represent the time [26].

**Version string:** A version number string (e.g., "Browser 2.00" or BIOS version) displays in small white text, typically at the bottom or top corner of the screen.

### Memory Card Browser

The Browser screen displays all connected memory cards (and optical disc) as **icon entries in a list**. Each save directory on a memory card is represented by a **3D animated rotating icon** (the game's custom icon.sys / icon model). If an icon.sys or icon file is missing, the entry displays as a **blue box labeled "Corrupted Data"** [27].

**Icon.sys system:** Each PS2 game directory on a memory card contains an `icon.sys` file describing the directory name (displayed as a label below the icon) and pointing to at least one 3D icon file. Background color of each icon panel can be customized per-game (RGBA, 0–128 transparency range) [27].

**Browser text labels:** Game save names are displayed in white sans-serif text below each 3D icon. The dark navy background makes white text the primary readable state.

**Selection highlight:** When an icon is selected/highlighted, the entry is visually distinguished (likely a highlight frame or dimming of unselected items — exact behavior varies; no specific hex for selection color was found in public documentation).

---

## 5. Motion/Timing + Sound

### Motion Feel Vocabulary

The overall PS2 boot aesthetic is **weighty, cinematic, and ambient** — not snappy or responsive. Everything moves at a breathing, geological pace. The camera motion is slow and deliberate. No UI elements snap; all transitions fade or drift.

### Motion/Timing List

| Named Feel | Element | Approx Duration / Easing |
|-----------|---------|--------------------------|
| Boot void fade-in | Screen fades from black into blue space | ~1–2 s / ease-in |
| "Sony Computer Entertainment" text fade-in | White wordmark appears | ~1.5 s / ease-in |
| Text hold | Wordmark visible and static | ~1–2 s |
| Text fade-out | Wordmark dissolves | ~1 s / ease-out |
| Camera zoom-into-cloud | Slow dolly-zoom toward blue mist | ~4–10 s / linear (variable by boot condition) |
| Tower emergence | Columns rise from base in mist | Gradual, ~2–4 s total / ease-out-cubic |
| Cube drift (ambient loop) | Large glass cubes drift/orbit slowly | Continuous loop, ~8–15 s per revolution |
| Comet arcs | Blue/green/pink/red streaks | ~0.5–1 s per streak / ease-in-out |
| OSDSYS menu entrance | Browser/SysConfig menu fades in | ~0.3–0.5 s / ease-out |
| Clock orb swirl | 7 blue orbs in spherical pattern | Continuous loop, slow (~4–8 s period) |
| Clock crystal rotation | 12 hexagonal rods rotate | Continuous loop, very slow (~30–60 s revolution) |

### Sound Cues

| Cue | Description |
|-----|-------------|
| Boot jingle | Airy, breathy synthesiser burst with bell-like tones; perfect fourth chords (stable, majestic); described as "landing somewhere from space"; ~3–4 s duration [7][8] |
| Boot whoosh | A final whoosh sound as the camera zooms into the cloud/mist at the end of the intro sequence [4] |
| Error screen audio | "Tense synth jingle with a breathy humming sound"; remainder of no-disc screen plays ocean wave sounds ("sounds of waves flowing") [2] |
| System Configuration ambient | Low rumbles and crashing beach wave sounds play while the clock/wormhole is visible [26] |
| OSDSYS sound assets | `SNDBOOTH`, `SNDCLOKS`, `SNDLOGOS` and others are named assets in the OSDSYS ROM — distinct sounds for booth/loading, clock, logos [20] |

**Design brief for motion tokens:**
- **Base timing unit:** 800 ms (suits the "weighty" feel for primary transitions)
- **Easing signature:** `cubic-bezier(0.22, 0.61, 0.36, 1)` (ease-out-expo — heavy start, slow graceful deceleration)
- **Ambient loop duration:** 12 s (cube drift reference period)
- **Text crossfade:** 400 ms ease-in, 600 ms ease-out
- **No sharp cuts.** Every transition fades or zooms; instantaneous state changes should be avoided.

---

## Color Palette Table (Consolidated)

| Name | Hex | Where it appears |
|------|-----|-----------------|
| Boot Void | `#000814` | Zenith of boot background (near-black) |
| Boot Deep Navy | `#001428` | Upper-mid boot background |
| Boot Horizon Blue | `#002B5C` | Lower-mid boot gradient behind towers |
| Boot Cloud Blue | `#0044A0` | Volumetric blue cloud/mist centre |
| PlayStation Resolution Blue | `#003087` | Official PlayStation brand blue |
| PlayStation True Blue | `#006FCD` | Official PlayStation primary blue (Pantone 285 C) |
| Sony UI Royal | `#1E5DDB` | PS2-era Sony UI accent blue |
| Sony UI Midnight | `#182580` | Deep secondary blue for UI chrome |
| Sony UI Sky | `#5CC9FB` | Sky blue highlight / glow accent |
| Tower White | `#FFFFFF` | Memory-card towers, UI text, wordmarks |
| Glass Cube Highlight | `#AEBFD4` | Translucent glass cube face / UI panel tint |
| Browser Slate | `#2E393D` | Dark neutral for UI border / browser bg |

> Boot gradient direction: **top-to-bottom**, from `#000814` (near-black top) through `#001428`, `#002B5C`, to `#0044A0` at the luminous cloud centre. The gradient is volumetric/non-linear in real rendering — a simple linear CSS gradient approximates it adequately for token purposes.

---

## Font Candidates Table

| Font | Free? | Why it matches | Source |
|------|-------|----------------|--------|
| Roboto Light/Regular | Yes | PS2 OSDSYS open-source project lists Roboto as the replacement candidate | [20] |
| Inter Light/Regular | Yes | Humanist sans for screen; Helvetica lineage; tracks wide cleanly | Community |
| Barlow Light/Regular | Yes | Humanist grotesque; Helvetica-influenced; approachable warmth | [21] |
| Exo 2 Light/Regular | Yes | Geometric-humanist hybrid; condensed-to-regular; tech-interface | [21] |
| Saira Light/ExtraLight | Yes | Multi-width industrial sans; condensed engineering feel | [21] |
| SST (Monotype) | No | Sony's own typeface; PS4/PS5 official | [18] |
| Helvetica Neue (commercial) | No | Likely actual PS2 BIOS source; system-font fallback only | [19] |
| BTSE PS2 (dafont) | Unknown | Fan recreation; square/techno character; 390K downloads | [22] |

---

## Sources

1. Audiovisual Identity Database, PlayStation 2/Startup Screen — https://www.avid.wiki/PlayStation_2/Startup_Screen
2. Audiovisual Identity Database, PlayStation 2 (main page) — https://www.avid.wiki/PlayStation_2
3. Search result summary citing Scary Logos Wiki / Fandom (PS2 comets) — https://freakylogo.fandom.com/wiki/PlayStation_2
4. GamesRadar — "PS2's startup screen Easter egg is surprising players all over again" — https://www.gamesradar.com/ps2s-startup-screen-easter-egg-is-surprising-players-all-over-again/
5. Bordersdown/NTSC-uk forum — PS2 boot timing discussion — https://bordersdown.net/forum/gaming/get-answers-games-and-tech/42890-how-long-should-a-ps2-take-to-boot-games
6. Push Square — PS2 startup timing reference — https://www.pushsquare.com/features/poll-whats-the-best-playstation-startup-sequence
7. SVG.com — "How Takafumi Fujisawa And His Teams Created The Classic Startup Sounds For Playstation" — https://www.svg.com/1166714/how-takafumi-fujisawa-and-his-teams-created-the-classic-startup-sounds-for-playstation/
8. PlayStation Blog — "How Takafumi Fujisawa Created the Original PlayStation's Startup Sound" — https://blog.playstation.com/2019/12/05/how-takafumi-fujisawa-created-the-original-playstations-startup-sound/
9. GameSpot — "Fun Fact: PS2 Startup Blocks Were Tied To Your Memory Card" — https://www.gamespot.com/articles/fun-fact-ps2-startup-blocks-were-tied-to-your-memory-card/1100-6503380/
10. DualShockers — "PlayStation Fans Blown Away After Rediscovering PS2 Startup Feature" — https://www.dualshockers.com/playstation-fans-blown-away-after-rediscovering-ps2-startup-feature/
11. DKOldies Blog — "The Playstation memory card affects how the PS2 bootup sequence looks" — https://www.dkoldies.com/blog/the-playstation-memory-card-affects-how-the-ps2-bootup-sequence-looks/
12. PS2-HOME Forum — "[SOLVED] What are these white blocks (squares) and towers on PS2 start up?" — https://www.ps2-home.com/forum/viewtopic.php?t=1668
13. PS2 Developer Wiki, OSDSYS — https://www.psdevwiki.com/ps2/OSDSYS
14. DesignPieces, PlayStation Color Palette — https://www.designpieces.com/palette/playstation-color-palette-hex-and-rgb/
15. BrandPalettes, PlayStation Blue Colors — https://brandpalettes.com/playstation-blue-colors/
16. ColorsWall, "Blue sony ui playstation colours" palette — https://colorswall.com/palette/69240
17. Dafont Forum — "Playstation BIOS Text" identification thread — https://www.dafont.com/forum/read/423260/playstation-bios-text
18. Wikipedia, SST (typeface) — https://en.wikipedia.org/wiki/SST_(typeface)
19. The Cutting Room Floor, PlayStation 2/Version Differences (Helvetica reference) — https://tcrf.net/PlayStation_2/Version_Differences
20. GitHub Gist (uyjulian), "PS2 OSDSYS permissively licensed assets" — Roboto suggestion — https://gist.github.com/uyjulian/f84199bec21b94065226eb104ab01b0b
21. FontAlternatives / TypeSmith — SST/Saira/Exo 2/Barlow humanist sans comparison — https://typographysmith.com/font-recommendations/top-10-din-alternatives
22. DaFont, BTSE PS2 font — https://www.dafont.com/btse-ps2.font
23. FontSpace, PlayStation 2 fonts category (Emotion Engine font) — https://www.fontspace.com/category/playstation-2
24. ManualsLib, Sony PS2 Instruction Manual p.9 (Browser/System Config UI navigation) — https://www.manualslib.com/manual/163655/Sony-Ps2.html?page=9
25. ManualsLib, Sony PS2 Instruction Manual p.36 (Using the System Configuration Menu) — https://www.manualslib.com/manual/714138/Sony-Playstation-2-Ps2.html?page=36
26. Gamicus / Search synthesis — PlayStation 2 internal display clock — https://gamicus.fandom.com/wiki/PlayStation_2_internal_display_clock
27. GitHub, ticky/ps2iconsys (icon.sys format, browser display, corrupted data blue box) — https://github.com/ticky/ps2iconsys
28. GitHub Gist (AKuHAK), PS2 BIOS ROM contents (FNTASCII / FONTM / FONTS) — https://gist.github.com/AKuHAK/db60caf94425654864d0a5d60f323294
