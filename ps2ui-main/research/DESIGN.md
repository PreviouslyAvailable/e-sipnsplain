# PS2UI — Design Spec

The sourced design language behind the kit. Distilled from a three-stream research
sweep (system software · PS2-exclusive game UI · the 2000–2006 "Frutiger Aero /
chrome-and-glass" DNA). Raw evidence with per-claim citations lives in
[`research/notes/`](./notes):
- [`sys-software-findings.md`](./notes/sys-software-findings.md) — boot, dashboard, palette, font, motion, sound
- [`game-ui-findings.md`](./notes/game-ui-findings.md) — per-game UI/HUD survey + recurring patterns
- [`design-dna-findings.md`](./notes/design-dna-findings.md) — Frutiger Aero traits + CSS recipes

> Honest gap: there is **no official Sony hex/font teardown** of the PS2 boot. The
> system-software values below are best-estimate reconstructions corroborated across
> community sources; the brand blues and the game-UI patterns are well-sourced.

---

## 1. The PS2 system software

**Boot scene.** A dark-blue volumetric space. From a ground plane rise **towers/pillars
of light** — one tower per game title ever launched from the memory card, its height
set by how many times that title was booted (the data lives in the card's
`B?DATA-SYSTEM` folder, separate from saves). Translucent **cubes / "sand"** drift
slowly upward. Five large glass cubes are decorative; four colored **comets** trace the
DualShock face-button colors. The "Sony Computer Entertainment" wordmark fades in,
thin and wide-tracked. The whole sequence is ~3–4 s, slow and weighted, no hard cuts.

**Dashboard ("Browser" + "System Configuration").** Two large glassy menu icons floating
in the blue field, a clock (rendered as orbiting orbs + rotating crystal rods tied to
real system time), and a version string. Selection glides; nothing snaps.

**Memory-card browser.** Inset rows / icon grid of saves on the same blue field, each
save a small translucent tile; calm, legible, generously spaced.

## 2. Color — reproducible hexes

| Token | Hex | Where it appears |
|---|---|---|
| `bg-abyss` | `#000814` | boot zenith / screen-edge vignette |
| `bg-deep` | `#001428` | body of the space |
| `bg` | `#002b5c` | mid blue field (canonical PS2 blue) |
| `bg-rise` | `#0044a0` | rising toward horizon |
| `bg-horizon` | `#1e5ddb` | bright band where towers stand (Sony-UI royal) |
| `blue` | `#003087` | Resolution Blue — PlayStation logo blue |
| `blue-true` | `#006fcd` | True Blue (Pantone 285 C) — primary brand |
| `cyan` | `#5cc9fb` | Sony-UI sky — edge light / glow |
| `ice` | `#cfe4ff` | highlights |
| comets | `#4fd6a0` `#ff6b7e` `#7aa8ff` `#f3a0d6` | △ ○ ✕ □ button colors |

The Frutiger-Aero lineage extends the same family: sky blues `#0689e4`/`#38abe4`/`#69cfff`,
aqua greens `#3cab3b`/`#71ab23` — used sparingly for accent, never as the field.

## 3. Typography

The BIOS set type in **Sony's corporate neo-grotesque — essentially Helvetica**, drawn as
a wide-tracked bitmap (the open OSDSYS-replacement project substitutes **Roboto**). So:

- **Body** → clean neo-grotesque/humanist sans: **Inter / Roboto / Helvetica Neue / Arial**.
- **Display** (boot wordmark, menu-tile labels) → wide geometric: **Michroma / Exo 2 / Eurostile**.
- Register: **thin weights (200–300)**, **wide tracking (0.06–0.28em)**, labels **UPPERCASE**.

All are free (Google Fonts). The demo loads Inter + Exo 2 + Michroma.

## 4. Motion, timing, sound

| Feel | Value |
|---|---|
| Signature glide (selection, scene) | `~320–800ms` · `cubic-bezier(0.19,1,0.22,1)` (ease-out-expo) |
| Tower rise on boot | `~2.6s` · `cubic-bezier(0.16,1,0.3,1)` |
| Ambient cube drift | `~14s` loop (sourced ~12s), linear, continuous |
| Brightness "breathing" | `~6s` ease-in-out, infinite alternate |
| Sound | ~3–4s breathy ascending synth, perfect-4th chords — "a monolith in space". (Not shipped; informs the *calm/weighted* feel.) |

Everything is slow, floaty, weighted. Respect `prefers-reduced-motion`.

## 5. PS2-exclusive game UI — the patterns worth stealing

| Pattern | Exemplars | Web reproduction |
|---|---|---|
| **Translucent dark command box** | Kingdom Hearts, FFX/XII, MGS2, Ratchet | `rgba(0,10,40,.75)` + thin colored border + `backdrop-filter: blur()` |
| **Codec / scanline panel** | MGS2/3 | phosphor `#33ff66` on near-black + `repeating-linear-gradient` scanlines + compressed mono |
| **Gradient status bar w/ top-highlight streak** | FFX/XII, KH | red→orange / blue fill + lighter `border-top`; tri-state green→yellow→red |
| **Thin wide-tracked ALL-CAPS on dark** | SotC, Ico, GT4, FFXII | weight 100–300, `letter-spacing:.2em`, uppercase — the "premium" register |
| **Kinetic poster menu** | Persona 3/4 | bold sans at max scale + one saturated color (P3 navy/cyan, P4 yellow/black) |
| **Diegetic / zero-HUD** | Ico, SotC, Silent Hill 2 | `opacity:0` default, progressive disclosure via `:has()` / state class |
| **Discrete orb/icon health row** | Jak, Ratchet, Sly, Okami | flex row of radial-gradient circles; `.empty` dims them |
| **Sumi-e / paper** | Okami | washi `#f5f0e8` ground, sumi black, sun red `#f71b47`, brush borders |
| **Wireframe neon on void** | Rez | `#050510` void + cyan `#00e5ff` glow border + pulse — the most CSS-native |

## 6. The 2000–2006 design DNA (Frutiger Aero / chrome-and-glass)

Glossy translucent glass · vertical sheen gradients · soft blue **bloom** (not hard
shadow) · reflective top highlights · subtle **scanlines/CRT** · deep-blue volumetric
backgrounds · humanist/geometric sans, thin + wide. The PS2 dashboard is the
console-native dialect of the same lineage that produced Aqua, Windows XP/Media Center,
and Vista Aero glass.

**Caveats (carry into the kit):** `backdrop-filter: blur()` is the costliest per-frame CSS
op — cap simultaneous glass panels, lower blur on mobile. Thin glowing text on gradients
routinely fails WCAG 4.5:1 — keep a high-contrast text token and test. Wrap ambient
animation in `prefers-reduced-motion`.

## 7. From design → tokens → components

- §2 → `tokens/variables.css` color block. §3 → `--ps2-font` / `--ps2-font-display`.
  §4 → the `--ps2-ease*` / `--ps2-dur*` block.
- §1 → `BootScreen`, `AmbientBackground`, `Cube`, `IconTile`, `Clock`, `MainMenu`,
  `MemoryCardBrowser`.
- §5 → `Panel`/command-box, `Button`, `List`/`Row`, `Progress` (top-highlight streak),
  and a roadmap of stretch components (CodecPanel, OrbMeter, WireframeCard).
- §6 → the glass + sheen + bloom + scanline recipes baked into the base layer and `Surface`.
