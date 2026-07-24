---
title: "PS2 Exclusive Game UI/HUD Aesthetics — Design Brief"
source-count: 52
date: 2026-06-12
vault_tag: ps2-ui-hud-aesthetics-eb4295
---

# PS2 Exclusive Game UI/HUD Aesthetics — Design Brief

A sourced design reference for a PS2-inspired web UI kit. All values are derived from game documentation, font identification threads, fandom wikis, and design retrospectives. Hex values marked `~` are community-approximated from screenshots; unadorned hexes are community-confirmed or directly sourced.

---

## Per-Game UI/HUD Reference Table

| Game | Title Screen | Menu / HUD Pattern | Font Character | Palette / Grading | Sources |
|---|---|---|---|---|---|
| **Shadow of the Colossus** (2005) | Deep charcoal-sepia; large centered **Caslon Antique** serif logotype (antiqued/eroded strokes); slow atmospheric fade; no saturation | Design-by-subtraction; bare near-black pause menu; no minimap/compass; sword-refraction replaces waypoints; HUD suppressed during traversal, appears only during climbing or low health | Caslon Antique (1894 decorative serif); wide tracking; commanding negative space; thin-to-medium weight | `#1a1410` charcoal · `#c8a96e` parchment · `#e8dfc8` bone · `~#a8a890` health bar (muted neutral) · `~#d4607a` grip bar (pink) | [1][2][3][4] |
| **Ico** (2001) | Pale cream-stone palette; minimalist compressed logotype (custom condensed, stone-engraving feel); tight tracking; bleached ivory tone | Zero HUD — no health, stamina, map, inventory, prompts, or waypoints; diegetic save points (stone couches); Yorda subtitles in thin archaic serif (fictional language, untranslated) | Custom condensed — near geometric sans, hand-finished; Light weight; tight tracking | `#f0ead8` bleached ivory · `#9a9488` stone grey · `#e8e0cc` warm white · `#3a3228` deep shadow · `#c8bfa8` dusty taupe | [5][6][7] |
| **Gran Turismo 4** (2004) | Near-black bg; GT logo in bold red/blue; all-caps wide-tracked type; crisp — no gradients or glow; automotive instrument-panel aesthetic | Spatial city-map metaphor (overhead map of districts); dealership = black bg + yellow ringed buttons + left-aligned vertical nav bar; red for pricing/HP (urgency); in-race HUD = corner-anchored digital readouts; no minimap | **Gran Turismo** typeface by Rian Hughes / Device [8]; geometric sans; ALL CAPS; wide kerning; 18° italic for urgency; rounded horizontal terminations | `#000000` race black · `#cc1111` GT red · `#003399` GT blue · `#ffffff` nav white · `#f5c518` button yellow | [8][9][10][11] |
| **Metal Gear Solid 2** (2001) | Near-black; logo in **Helvetica Ultra Compressed** (silver-grey); Kyle Cooper / Imaginary Forces title sequence (typographic montage + military imagery) [12] | Codec: split-panel portrait display, green-phosphor aesthetic, monospace/digital "AV07 Ration" font [13]; radar top-right — color-codes alert state: green → orange → red; life gauge turns orange when critical; alert text in wide-tracked compressed caps | **Helvetica Ultra Compressed** (series standard since MG2, 1990) [14]; ultra-compressed, all-caps; zero decorative elements; codec supplement: "AV07 Ration MGS2" custom digital monospace | `#0a0a0a` near-black · `#00cc44` radar green (normal) · `#ff8800` radar orange (evasion) · `#880000` radar red (alert) · `#33ff66` codec phosphor | [12][13][14][15] |
| **Metal Gear Solid 3** (2004) | Olive-green/earth-brown title; Helvetica Ultra Compressed; naturalistic snake illustration; jungle Cold War aesthetic | "Survival Viewer" full-screen pause — camouflage selector grid + food/medicine management; field-manual analog warmth vs. MGS2's clinical digital; camo index % in top-right: **blue when safe ≥70%, red when dangerous** | Helvetica Ultra Compressed (series constant) [14]; Survival Viewer slightly rougher/analog feel vs. MGS2; condensed digits for camo readout | `#0a0c08` jungle black · `#4a5a30` olive green · `#2a3820` dark jungle · `#5a4030` earth brown · `#4488ff` camo safe blue · `#ff3333` camo danger red | [14][16][17] |
| **Final Fantasy X** (2001) | Deep ocean blue-black; slow water-caustic animation; Tidus silhouette; luminous cream serif logo with gold inner glow; soft bloom throughout | Left-aligned vertical list; party portraits right; **semi-transparent dark navy panel** (`#001A3A` ~75% opacity) with thin `#3399CC` border; CTB turn-order queue (portrait row) unique in JRPG; all submenus maintain translucent blue language | **Optima** or Optima-adjacent humanist sans [18] (flared stroke endings, "serif-adjacent"); mixed case for items; all-caps for headers; medium weight, ~0.05em tracking | `#001A3A` panel navy · `#3399CC` panel border · `#E8E0C8` warm cream text · `#F0A830` HP bar amber · `#4ABCF0` MP bar sky blue · `#001428` title bg | [18][19][20] |
| **Final Fantasy XII** (2006) | Warm amber-gold/parchment tones; Ivalice medieval fantasy; logo in **Trajan**-adjacent serif, all-caps, gold fill; cinematic FMV intro | Warm charcoal-brown panel (`#1A1410` ~80% opacity); **License Board** = hex-node grid on near-black; **Gambit system** = clean tabular rule-editor (condition→action pairs); real-time menu access; two-font system: Trajan for headers, Gill Sans-narrow for data | **Trajan** (or close) for headers/logo; **Gill Sans** narrow (or equiv.) for body/data; Gambit table monospace-adjacent; higher text density than FFX | `#1A1410` warm charcoal panel · `#C8960A` amber-gold border · `#E8DCC0` parchment text · `#28B428` HP green · `#C8A428` license board gold · `#0A0806` near-black warm bg | [21][22][23] |
| **Persona 3** (2006) | Midnight navy (`#001736`); bold condensed BM Space display sans; moon motif; wide-tracked all-caps; kinetic animated intro | Graphic-design poster aesthetic (not "interface"); solid-color high-contrast blocks; radial **revolving barrel battle menu** (mirrors Evoker pistol gesture) [24]; additive red cursor over navy; calendar/social link UI in bold date typography | **Arial + Verdana** bold (confirmed system fonts [25]); large scale + high contrast + strong color = kinetic look — not the typeface itself; wide tracking; ExtraBold weight dominant | `#001736` midnight navy · `#00183e` near-black navy · `#00BBFA` cyan accent · `#79D7FD` pale sky · `#FFC54A` moon gold · `#FF0000` battle cursor red | [24][25][26][27] |
| **Persona 4** (2008) | Warm golden yellow (`#F5D000`) bg; bold black numeral "4"; Baskerville-adjacent "PERSONA" serif; energetic quick-cut animation | Yellow/black graphic-design system; CRT scan-line overlay on battle (TV medium-critique) [28]; multicolor TV-stripe bands on menus/loading; rounded containers (softer than P3's angular shapes); Gambit retains rotating menu approach | **Arial + Verdana** bold (same as P3 [25]); dialogue: **Skip** (Fontworks) rounded sans; logo: Baskerville-adjacent serif; moderate tracking; rounded `border-radius` throughout | `#F5D000` golden yellow · `#C8A000` deeper gold · `#000000` pure black · `#E83228` TV stripe red · `#2864E8` TV stripe blue · `#28C828` HP green | [25][28][29][30] |
| **Devil May Cry** (2001) | Near-black + deep crimson; custom gothic calligraphic / Art Nouveau display logo; hard impact cuts (not soft fades); gothic revival + action-movie poster | Near-opaque dark panels (~90% opacity) — stone-tablet feel vs. Square's translucent glass; style meter (D→SSS) as theatrically dominant HUD element; DT gauge = **line of rune glyphs** (iconographic, not geometry — unique in PS2 era) | Logo: custom calligraphic gothic/Art Nouveau; menus: **Octin Spraypaint** (confirmed [31]) bold condensed stencil; tight tracking; no thin weights | `#080404` near-black · `#0A0806` dark panel · `#CC1818` crimson red · `#9040F0` DT rune violet · `#28B428` HP green · `#3264E8` HP regen blue | [31][32][33] |
| **Okami** (2006) | Brushstroke calligraphy logo on washi-paper/scroll texture; crimson sun-disc dominant motif; living sumi-e painting aesthetic | Scroll/ink-panel overlays — no rectangular UI chrome; irregular hand-painted panel edges; Celestial Brush = full-screen washi-paper canvas with ink cursor; HUD hideable (L2); 3 solar-unit glyphs (health) + 3 ink pots (below) | Custom brushstroke calligraphy throughout — no geometric/digital type; loose tracking (calligraphic natural spacing); variable weight — bold for display, medium for body | `#f5f0e8` washi cream · `#000000` sumi black · `#f71b47` sun red · `#d4a017` nature gold · `#7a9a6a` sage green · `#c20f3d` deep crimson | [34][35][36] |
| **Katamari Damacy** (2004) | Max-saturation bright bg; **Futura Heavy** widened (EN logo); lime-green Prince; full spectrum rainbow; open, front-lit — no dark framing | Flat solid-color backgrounds — no gradients, no drop shadows; bouncy animation; only HUD element = size meter (diameter vs. target); timer when relevant; full-spectrum palette intentional (katamari collects ALL objects) | **Rodin Pro DB** (Monotype/Fontworks) for UI — rounded humanist sans, deliberately modified for funky feel [37]; **Futura Heavy** widened for EN logo; all rounded terminals | `#fccc04` katamari yellow · `#fc606a` coral red · `#6bcb4e` lime green · `#4eb8cb` sky blue · `#9e5d79` mauve · `#34342c` near-black text | [37][38][39] |
| **Jak & Daxter** (2001) | Warm amber/ochre ground; custom display face with organic curves; teal-cyan eco particles; golden-hour lighting | Minimal HUD by design (Naughty Dog immersion philosophy); health = **3 golden-yellow 3D orbs** (`#F0C030`) — not bars; eco meter = circular radial gauge color-coded to eco type (5 types × 5 colors); no minimap, ammo, or quest markers | Custom bitmap — rounded, moderate weight, no serifs, slightly condensed; Futura-spirit without strict geometry | `#C47A2A` warm amber · `#1A5C4A` deep jungle teal · `#F0C030` health orb gold · `#44FF44` green eco · `#4488FF` blue eco · `#FF3333` red eco · `#330044` dark eco | [40][41] |
| **Ratchet & Clank** (2002) | Orange + deep space blue; bold chunky custom type; slight italic; hard drop shadow; Saturday-morning-cartoon energy | Health = horizontal row of **turquoise orbs** (`#40E8C0`) at bottom-left, upgradable from 4→40+; weapon carousel = dark translucent rounded-rect at screen edge; prototype used white text, final shipped **blue text on dark translucent bg** (deliberate evolution [42]) | Bold humanist sans — Myriad Pro Bold-adjacent; decorative dialogue face differs; medium-wide tracking; good PS2-res contrast | `#E8621A` signature orange · `#1A1A3E` deep space blue · `#40E8C0` nanotech teal · `#FFD040` warm highlight · `#A0A8B0` Clank silver | [42][43] |
| **Sly Cooper** (2002) | Bold flat black/yellow/red; ink-splatter shapes; diagonal cuts; hard geometric — no gradients or glow; heist/noir comic aesthetic | Pure cel-shaded flat HUD — NO gradients, NO translucency (outlier); health = gold coin icons (discrete); ink-outline panels look hand-drawn; pause map = flat-fill top-down view; **comic-book panel aesthetic** throughout | **SF Port McKenzie Extended** (UI/dialogue) + **Chinese Rocks** (HUD numerals) — both confirmed by fandom [44]; bold outline style; no thin weights | `#0A0A0A` black dominant · `#F0C01A` yellow-gold · `#CC1A1A` red accent · `#F0EAD6` parchment (some screens) | [44][45] |
| **Silent Hill 2** (2001) | Pure black; compressed grotesque/grunge logo in desaturated grey; no color; fog vignette edges; oppressive, institutional — like a police file | Near-black menu bg (`#1f2123`); thin **Times**-derived serif items — minimal visual differentiation; inventory = dark grid + rough-sketch icons; maps = hand-drawn on aged paper; **diegetic health** (James's posture) — no on-screen health bar | **Times** (Apple Times, 18pt bold modified) for cutscene/subtitle font [46]; Haettenschweiler-adjacent for logo; bold display, regular body; tight tracking — claustrophobic | `#1f2123` near-black menu · `#aecf92` fog sage · `#cee49d` light sage · `#244454` dark teal · `#c5d0bc` cement · `#6b7c94` lynch blue-grey | [46][47][48] |
| **Silent Hill 3** (2003) | Same compressed-grunge logo; Heather Mason's face through fog — photorealistic unsettling; slight violet-gray overtone vs. SH2 | Identical design language to SH2 (fontsh234 tool confirms shared font system across SH2/3/4 [49]); typewriter-input meta-UI for costume codes — typed-text animation, analog mechanical horror extends to meta-screens | Same Times-derived serif as SH2 (confirmed by fontsh234 spanning SH2/3/4 [49]); logo adds decay/grunge texture | Same core palette as SH2; slight violet-gray skin-tone addition; ambient violet-grey overtones | [46][47][49] |
| **Rez** (2001) | Wireframe grid on near-black void; "REZ" in geometric modular sans; everything glows cyan; computer-system-boot aesthetic | Minimal line-based UI — information only, no chrome; **player character IS the HUD** (evolves through 5 wireframe forms = health system [50]); lock-on targeting brackets as wireframe reticle; dynamic color palette shifts with player performance | Geometric sans — constructivist-inspired, no serifs, modular letterforms; wide tracking; medium-bold weight (thin too delicate for glow effect); Kandinsky/Soviet Constructivism heritage | `#050510` near-void black · `#00e5ff` wireframe cyan · `#1a6bff` electric blue · `#ff8c00` amber · `#ff007f` magenta · `#e8f4ff` glow white — **no fixed palette; shifts dynamically** | [50][51][52] |
| **Kingdom Hearts** (2002) | Midnight indigo (`#0A0F2A`); starfield particles; **Century Gothic** (confirmed by modding community [53]); soft rounded type; warm gold crown/logo; bloom-lit | **Translucent command box** (lower-left): dark navy gradient ~70% opacity; **color-shifts blue→red during combat** [54]; HP/MP gradient bars bottom-left; Sora portrait flinches on damage; party bars (Donald, Goofy) stacked below | **Century Gothic** (or close geometric sans, confirmed [53]); uniform stroke weight; generous x-height; normal tracking; small caps for menu labels | `#0A0F2A` midnight navy · `#C8D8FF` starfield pale blue · `#C8A84B` accent gold · `rgba(0,20,80,0.75)` command box noncombat · `rgba(80,10,10,0.75)` combat | [53][54][55] |

---

## Recurring Cross-Game Patterns

### Pattern 1 — Translucent Command Box (`dark-glass`)
**Exemplars:** Kingdom Hearts · Final Fantasy X · Final Fantasy XII · Metal Gear Solid 2 · Ratchet & Clank · Gran Turismo 4 (pause)

Dark semi-transparent rounded rectangle floating over gameplay. Opacity 60–80%. Near-universal PS2 menu substrate. Ensures legibility against any background color.

```css
.ps2-command-box {
  background: rgba(0, 10, 40, 0.75);
  border-radius: 4px 4px 8px 8px;
  border: 1px solid rgba(100, 140, 220, 0.3);
  box-shadow: 0 2px 12px rgba(0, 0, 80, 0.5);
  backdrop-filter: blur(2px);
}
```

**Variants by game:**
- FFX: `rgba(0, 26, 58, 0.75)` + `#3399CC` border (aquatic)
- FFXII: `rgba(26, 20, 16, 0.80)` + `#C8960A` amber border (medieval warmth)
- KH: `rgba(0, 20, 80, 0.75)` noncombat → `rgba(80, 10, 10, 0.75)` in combat (contextual color-shift)
- MGS2: codec uses `#002200` green-phosphor tint; no translucency — full-screen split panel
- DMC: near-opaque `rgba(10, 8, 6, 0.92)` — stone tablet weight, not glass

---

### Pattern 2 — Gradient Fill Status Bars (`ps2-bar`)
**Exemplars:** Kingdom Hearts · Final Fantasy X/XII · Persona 3/4 · Devil May Cry · Ratchet & Clank

Horizontal bars with gradient fill (not solid color), a top-edge highlight streak, and optional segmentation marks. Communicated "filled liquid" or "lit crystal" feel suited to PS2's visual language.

```css
.ps2-hp-bar {
  background: linear-gradient(to right, #CC0000, #FF5500);
  border-top: 1px solid rgba(255, 160, 100, 0.6);
  height: 8px;
  border-radius: 2px;
}
.ps2-mp-bar {
  background: linear-gradient(to right, #0033AA, #0099FF);
  border-top: 1px solid rgba(100, 200, 255, 0.6);
}
/* FFXII tri-state HP: full green → yellow mid → red critical */
.ffxii-hp-bar[data-state="mid"]  { background: linear-gradient(to right, #887000, #E8C830); }
.ffxii-hp-bar[data-state="crit"] { background: linear-gradient(to right, #880000, #E83228); }
```

---

### Pattern 3 — Thin Wide-Tracked Type on Dark (`ps2-label`)
**Exemplars:** Shadow of the Colossus · Ico · Gran Turismo 4 · Final Fantasy XII · Metal Gear Solid 2

Light weight (100–300), wide letter-spacing (0.1–0.25em), white or pale-blue, dark background. Creates airy premium feel despite PS2's low resolution. Gran Turismo 4's ALL CAPS + 0.2em tracking is the canonical expression.

```css
.ps2-menu-label {
  font-family: 'Optima', 'Futura', 'Gill Sans', sans-serif;
  font-weight: 200;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  font-size: 11px;
}
/* GT4 automotive variant */
.gt4-label {
  font-family: 'Gran Turismo', 'Barlow Condensed', sans-serif;
  font-weight: 400;
  letter-spacing: 0.25em;
  font-style: italic;
  text-transform: uppercase;
}
```

---

### Pattern 4 — Diagonal Kinetic Poster Typography (`persona-kinetic`)
**Exemplar:** Persona 3 · Persona 4

Atlus achieved the signature "kinetic" look using **Arial and Verdana** [25] — system fonts — at maximum scale, bold weight, high contrast, and strong color identity. The lesson: compositional boldness matters more than custom typefaces. Persona 3 = navy + cyan + moon gold; Persona 4 = golden yellow + black + TV stripes.

```css
.persona3-title {
  font-family: Arial, Verdana, sans-serif;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: #001736;
  /* Sub-color accent on key words: */
  /* Use <span style="color:#FFC54A"> for moon-gold highlights */
}
.persona4-title {
  font-family: Arial, Verdana, sans-serif;
  font-weight: 900;
  color: #000000;
  background: #F5D000;
  letter-spacing: 0.1em;
}
/* P4 TV stripe decorative band */
.p4-stripe-band {
  height: 4px;
  background: linear-gradient(to right,
    #E83228 0% 20%, #2864E8 20% 40%,
    #28C828 40% 60%, #F5D000 60% 80%,
    #E83228 80% 100%);
}
```

---

### Pattern 5 — Military Codec / Scanline Panel (`mgs-codec`)
**Exemplar:** Metal Gear Solid 2 · Metal Gear Solid 3

Split-panel portrait display; green-phosphor or amber tint; monospace digital font; functional signal-color system (green = safe, orange = caution, red = maximum threat). Helvetica Ultra Compressed [14] for all status text.

```css
.codec-panel {
  background: #050F05;
  border: 1px solid #00cc44;
  box-shadow: 0 0 12px rgba(0, 204, 68, 0.3), inset 0 0 20px rgba(0, 100, 20, 0.15);
  font-family: 'Courier New', 'Share Tech Mono', monospace;
  color: #33ff66;
  /* Scanline overlay */
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px, transparent 2px,
    rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px
  );
}
.codec-alert { color: #ff8800; border-color: #ff8800; }
.codec-alert-max { color: #cc0000; border-color: #880000; }
/* Alert state heading — Helvetica Ultra Compressed equivalent */
.mgs-status-label {
  font-family: 'Barlow Condensed', 'Impact', sans-serif;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 10px;
}
```

---

### Pattern 6 — Sumi-e / Organic Brush Aesthetic (`okami-brush`)
**Exemplar:** Okami

Art-as-UI: every element is a painted object. Paper texture as the UI ground. No hard rectangular chrome — irregular hand-painted edges. Crimson-on-cream-on-black is the traditional Japanese ukiyo-e tricolor.

```css
.okami-panel {
  background: #f5f0e8;             /* washi cream */
  border: none;
  /* SVG brush-stroke border or rough clip-path — no CSS border-radius */
  background-image: url('washi-texture.png');
  background-blend-mode: multiply;
  color: #000000;                  /* sumi ink */
  font-family: 'Zen Brush 2', 'Shippori Mincho', serif;
}
.okami-primary-action {
  background: #f71b47;             /* sun red */
  color: #f5f0e8;
  /* Brush-stroke button: use SVG shape or border-image with brush SVG */
  border-radius: 50%;              /* ink-seal circle */
}
/* Celestial Brush overlay */
.okami-brush-overlay {
  position: fixed; inset: 0;
  background: rgba(245, 240, 232, 0.92);
  backdrop-filter: blur(0px);
  cursor: url('brush-cursor.svg') 8 40, crosshair;
}
```

---

### Pattern 7 — Wireframe Neon on Void (`rez-wireframe`)
**Exemplar:** Rez

Geometric sans on near-void black. All elements glow — `box-shadow` with cyan outerglow. Color is functional feedback, not decoration. Player character form = health system (radical diegetic HUD). Kandinsky: geometric form + color = emotion [52].

```css
.rez-card {
  background: #050510;
  border: 1px solid #00e5ff;
  box-shadow: 0 0 8px #00e5ff, 0 0 20px rgba(0, 229, 255, 0.2);
  color: #e8f4ff;
  font-family: 'Orbitron', 'Rajdhani', 'Share Tech Mono', sans-serif;
  letter-spacing: 0.2em;
}
.rez-btn {
  background: transparent;
  border: 1px solid #00e5ff;
  color: #00e5ff;
  transition: background 0.2s, box-shadow 0.2s;
}
.rez-btn:hover {
  background: rgba(0, 229, 255, 0.08);
  box-shadow: 0 0 16px rgba(0, 229, 255, 0.5);
}
/* Pulse animation */
@keyframes rez-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
.rez-glow { animation: rez-pulse 1s ease-in-out infinite; }
```

---

### Pattern 8 — Diegetic / Zero HUD (`ico-zero-hud`)
**Exemplars:** Ico · Shadow of the Colossus · Silent Hill 2/3 · Okami (hideable) · Rez (character = HUD)

Removing UI elements is a design choice, not a limitation. Ico has no HUD whatsoever [6]. SotC suppresses the HUD during traversal [3]. Silent Hill 2 communicates health through posture animation [46]. Rez's player form IS the health bar [50]. Web translation: default to content-first, progressive-disclosure UI elements.

```css
/* Progressive disclosure: HUD elements appear on interaction/low state */
.ps2-hud-element {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.ps2-hud-element.active,
:root:has(.player--low-health) .ps2-hud-element {
  opacity: 1;
}
```

---

### Pattern 9 — Icon-Row / Orb Discrete Health (`ps2-orbs`)
**Exemplars:** Jak & Daxter (3 gold orbs) · Ratchet & Clank (4–40 teal orbs) · Sly Cooper (gold coins) · Okami (3 sun glyphs)

Discrete icon row instead of analog bar. Player sees exact hit-count remaining. Scales to screen size, reads at very small sizes. Avoids fraction-bar ambiguity.

```css
.ps2-orb-health { display: flex; gap: 4px; align-items: center; }
.ps2-orb {
  width: 12px; height: 12px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #80FF80, #20A020);
  box-shadow: 0 0 4px rgba(64, 255, 64, 0.5);
  transition: opacity 0.3s, background 0.3s;
}
.ps2-orb.empty { background: rgba(40, 40, 40, 0.6); box-shadow: none; }
/* Ratchet teal variant */
.ratchet-orb { background: radial-gradient(circle at 35% 35%, #80FFF0, #20C0A0); box-shadow: 0 0 4px rgba(64, 230, 200, 0.5); }
/* Sly coin variant */
.sly-coin { border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE066, #C8A000); width: 11px; height: 11px; }
```

---

### Pattern 10 — Photographic + Clean Automotive Sans (`gt4-auto`)
**Exemplar:** Gran Turismo 4

Photographic backgrounds (car photography, track imagery) paired with a clean, wide-tracked, all-caps geometric sans. Mechanical precision over visual spectacle. Palette binary: black ground + white text + red/blue accent + yellow interactive. This is the PS2 "editorial" aesthetic — print magazine meets dashboard.

```css
.gt4-panel {
  background: #000000;
  color: #ffffff;
  font-family: 'Gran Turismo', 'Barlow Condensed', 'Bebas Neue', sans-serif;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
.gt4-accent { color: #cc1111; }                   /* pricing / urgency */
.gt4-interactive { color: #f5c518; }              /* selectable elements */
.gt4-secondary { color: #003399; }                /* logo blue */
```

---

## Component Ideas for a PS2-Inspired Web UI Kit

| Component | Pattern Inspired By | Key Visual Property | CSS / Implementation Notes |
|---|---|---|---|
| **`<CommandBox>`** | Kingdom Hearts, FFX | Translucent dark navy panel, thin colored border, rounded corners | `rgba(0,10,40,0.75)` bg; `1px solid rgba(100,140,220,0.3)` border; `backdrop-filter: blur(2px)` |
| **`<CodecPanel>`** | MGS2 codec screen | Split portrait display; green-phosphor scanline tint; monospace font | Repeating gradient scanlines; `#33ff66` text on `#050F05`; `Share Tech Mono` or `Courier New` |
| **`<AlertBadge>`** | MGS2/3 alert states | Color-coded status badge: green/orange/red | CSS custom property `--alert-color`; three states: `#00cc44` · `#ff8800` · `#880000` |
| **`<StatusBar>`** | FFX, FFXII, KH | Gradient fill bar (HP red→orange, MP blue); top highlight streak | `linear-gradient` fill; `border-top` highlight; tri-state color change for FFXII HP |
| **`<OrbHealth>`** | Jak & Daxter, Ratchet & Clank, Sly Cooper | Row of discrete orb/icon health units | Radial gradient spheres; empty state = dim; gap-flex layout |
| **`<PersonaMenu>`** | Persona 3/4 | Bold Arial/Verdana at maximum scale + strong color identity | Background color as primary design element; `font-weight: 900`; wide `letter-spacing` |
| **`<TVStripeBand>`** | Persona 4 | Multicolor horizontal stripe band (TV metaphor) | `linear-gradient` with hard color stops in 5-color spectrum |
| **`<WashiCard>`** | Okami | Paper-texture card; ink-black text; brushstroke border / clip-path | `background: #f5f0e8`; paper texture SVG filter; `font-family: 'Zen Brush 2'` |
| **`<WireframeCard>`** | Rez | Near-void black bg; cyan neon border with glow; geometric sans | `box-shadow: 0 0 8px #00e5ff`; `border: 1px solid #00e5ff`; `Orbitron` or `Rajdhani` |
| **`<BrushProgress>`** | Okami (sun glyphs) | Circular progress ring in brushstroke or solar-disc style | SVG `<circle>` with stroke-dasharray animation; ink-black track; `#f71b47` fill |
| **`<FogLabel>`** | Silent Hill 2/3 | Near-black bg; thin serif; subtle fog-green vignette | `#1f2123` bg; `Noto Serif` or `Times`; `#aecf92` accent; no decorative chrome |
| **`<AutomotivePanel>`** | Gran Turismo 4 | Black bg; wide-tracked ALL CAPS sans; red/blue/yellow accent system | `Gran Turismo` or `Barlow Condensed`; `letter-spacing: 0.2em`; color roles strictly separated |
| **`<RevolverMenu>`** | Persona 3 | Radial/circular rotating command menu | CSS `transform: rotate()` on positioned elements; radial layout; selection via rotation |
| **`<StyeMeter>`** | Devil May Cry | Large theatrical letter-grade display (D/C/B/A/S/SS/SSS) | `font-size: clamp(2rem, 8vw, 6rem)`; `font-weight: 900`; upper-left anchor; fade in/out on change |
| **`<ContextualCommandBox>`** | Kingdom Hearts | Command box that shifts color on state change (noncombat/combat) | CSS custom property + class swap; `transition: background 0.3s ease` |
| **`<DiegethicHUD>`** | Ico, SotC, Silent Hill 2 | Zero-chrome progressive-disclosure HUD wrapper | Default `opacity: 0`; reveal on danger state or interaction via CSS `:has()` or JS class |

---

## Sources

1. FontMeme — Shadow of the Colossus font (Caslon Antique): https://fontmeme.com/shadow-of-the-colossus-font/
2. GameFAQs — Shadow of the Colossus font discussion: https://gamefaqs.gamespot.com/boards/924364-shadow-of-the-colossus/53116664
3. PlayStation Forum — SotC HUD too gaudy (PS2 original cited as neutral/muted): https://community.eu.playstation.com/t5/Action-Adventure/Shadow-of-the-Colossus-HUD-UI-is-too-gaudy/td-p/25519146
4. Game Developer — Art of Shadow of the Colossus (visual design): https://www.gamedeveloper.com/design/the-art-of-shadow-of-the-colossus-4-6-visual-design
5. Wikipedia — Ico: https://en.wikipedia.org/wiki/Ico
6. Gamefa.com — The Artistry of Ico: Design By Subtraction: https://en.gamefa.com/2845/the-artistry-of-ico-a-deep-dive-into-design-by-subtraction/
7. Sabukaru — An Ode to Ico: The Cult Minimalist Game: https://sabukaru.online/articles/an-ode-to-ico-the-cult-minimalist-game
8. Device Fonts — Gran Turismo typeface (Rian Hughes): https://www.devicefonts.co.uk/catalogue/gran-turismo
9. FeedMe Design — Gran Turismo's UI Wasn't Flashy. It Was Mechanical by Design: https://www.feedme.design/gran-turismos-ui-wasnt-flashy-it-was-mechanical-by-design/
10. Gran Turismo Wiki — Menu Styles: https://gran-turismo.fandom.com/wiki/Menu_Styles
11. Fonts In Use — Gran Turismo typeface: https://fontsinuse.com/typefaces/1359/gran-turismo
12. Art of the Title — Metal Gear Solid 2 title sequence (Kyle Cooper): https://www.artofthetitle.com/title/metal-gear-solid-2-sons-of-liberty/
13. FontSaga — The Magic Behind Metal Gear Solid's Iconic Codec Font: https://fontsaga.com/magic-behind-metal-gear-solids-iconic-codec-font/
14. Metal Gear Stuff — The Fonts of Metal Gear Solid (Helvetica Ultra Compressed confirmed): https://metalgearstuff.wordpress.com/2020/01/29/the-fonts-of-metal-gear-solid/
15. Metal Gear Wiki — Soliton Radar (color state documentation): https://metalgear.fandom.com/wiki/Soliton_Radar
16. Metal Gear Wiki — Survival Viewer: https://metalgear.fandom.com/wiki/Survival_Viewer
17. StrategyWiki — MGS3 Camouflage (camo index color coding): https://strategywiki.org/wiki/Metal_Gear_Solid_3:_Snake_Eater/Camouflage
18. DaFont forum — Final Fantasy X PS2 subtitles and menu font (Optima-adjacent): https://www.dafont.com/forum/read/273501/final-fantasy-x-original-ps2-subtitles-and-menu-font
19. Game UI Database — Final Fantasy X: https://www.gameuidatabase.com/gameData.php?id=474
20. Final Fantasy Wiki — Menu (Final Fantasy X): https://finalfantasy.fandom.com/wiki/Menu_(Final_Fantasy_X)
21. Game UI Database — Final Fantasy XII: https://gameuidatabase.com/gameData.php?id=28
22. Final Fantasy Wiki — Menu (Final Fantasy XII): https://finalfantasy.fandom.com/wiki/Menu_(Final_Fantasy_XII)
23. World Wide Intertubes — Final Fantasy User Interface (2008 FFXII design analysis): https://worldwideintertubes.wordpress.com/2008/07/10/final-fantasy-user-interface/
24. Kotaku — RIP To The Best Part Of Persona 3's UI (revolving barrel): https://kotaku.com/persona-3-reload-ui-loses-the-originals-best-feature-1851225937
25. @MeovvCAT (X/Twitter) — Arial/Verdana as Persona 3 PS2 typeface confirmed: https://x.com/osu_MeovvCAT/status/1911165615307669966
26. Persona Central — P3 Reload Developer Interview on UI: https://personacentral.com/p3r-interview-menu-ui/
27. Color-Hex — Persona 3 Color Palette #95744: https://www.color-hex.com/color-palette/95744
28. Persona Central — Persona 5 UI Development Panel (covers P3/P4 color history): https://personacentral.com/persona-5-panel-concept-development-ui/
29. Game UI Database — Persona 4: https://www.gameuidatabase.com/gameData.php?id=595
30. Ridwan Khan — The Typography of Atlus USA: https://ridwankhan.com/the-typography-of-atlus-usa-35efa4d4220b
31. DaFont forum — Devil May Cry Menu font identification (Octin Spraypaint): https://www.dafont.com/forum/read/239893/devil-may-cry-menu
32. Devil May Cry Wiki — Gauges / Devil Trigger: https://devilmaycry.fandom.com/wiki/Gauges
33. Wikipedia — Devil May Cry (gothic aesthetic, European trip): https://en.wikipedia.org/wiki/Devil_May_Cry_(video_game)
34. Wikipedia — Ōkami: https://en.wikipedia.org/wiki/%C5%8Ckami
35. COLOURlovers — Okami palette: https://www.colourlovers.com/palette/1299863/Okami
36. Fanatical — Okami HD: Traditional Art Graphics in a Modern Game: https://www.fanatical.com/en/blog/okami-hd-traditional-art-graphics-in-a-modern-game
37. Katamaripedia — Fonts in the Katamari Damacy series (Rodin Pro DB confirmed): https://katamaripedia.miraheze.org/wiki/Fonts_in_the_Katamari_Damacy_series
38. Game Developer — Postmortem: Katamari Damacy (Keita Takahashi primary source): https://www.gamedeveloper.com/design/postmortem-the-singular-design-of-namco-s-katamari-damacy-2004-
39. MoMA — Katamari Damacy permanent collection: https://www.moma.org/collection/works/164919
40. Jak and Daxter Fandom Wiki — Eco (color coding): https://jakanddaxter.fandom.com/wiki/Eco
41. Interface Design at Expression (2012) — Best and Worst UI: Jak and Daxter: http://students.expression.edu/interfacedesign/2012/02/14/best-and-worst-ui-dragon-quest-and-jak-and-daxter/
42. The Cutting Room Floor — Ratchet & Clank PS2 August 2002 prototype (white→blue text evolution): https://tcrf.net/Proto:Ratchet_%26_Clank_(PlayStation_2)/August_2,_2002_build
43. The Cutting Room Floor — Ratchet & Clank PS2: https://tcrf.net/Ratchet_%26_Clank_(PlayStation_2)
44. Sly Cooper Fandom — Font identification (SF Port McKenzie Extended + Chinese Rocks): https://slycooper.fandom.com/f/p/4400000000000000854
45. The Spriters Resource — Sly Cooper HUD Icons: https://www.spriters-resource.com/playstation_2/slycooperthethieviusraccoonus/asset/516550/
46. Silent Hill Heaven Forum — Cutscene and map fonts (Times 18pt bold identified): https://silenthillforum.com/viewtopic.php?t=26778
47. Silent Hill Wiki — List of fonts used in Silent Hill logos: https://silenthill.fandom.com/wiki/List_of_fonts_used_in_Silent_Hill_logos
48. ColorsWall — Silent Hill palette: https://colorswall.com/palette/2366
49. GitHub — fontsh234 (font extractor covering SH2/3/4 as consistent system): https://github.com/belek666/fontsh234
50. FeedMe Design — Rez: A Cultural and Design Revolution in Gaming: https://www.feedme.design/rez-a-cultural-and-design-revolution-in-gaming/
51. Shmuplations — Rez 2001 Developer Interview (wireframe = aesthetic choice): https://shmuplations.com/rez/
52. Time Extension — The Making of Rez (Katsumi Yokota wireframe philosophy; Kandinsky influence): https://www.timeextension.com/features/the-making-of-rez-tetsuya-mizuguchis-timeless-masterpiece
53. Nexus Mods — KH PS2-ish Title Menu mod (Century Gothic confirmed for PS2 KH1): https://www.nexusmods.com/kingdomheartsfinalmix/mods/216
54. KH Wiki — Commands (command menu color behavior, blue→red combat shift): https://www.khwiki.com/Commands
55. KH Wiki — Fonts in the Kingdom Hearts series: https://www.khwiki.com/Fonts_in_the_Kingdom_Hearts_series
