# Audio

Presentation SFX for Sip'n'Splain. Mute with **M**; `prefers-reduced-motion` also silences hits. Audio unlocks on the first click/key (same gesture gate as boot).

## `dialup-handshake.wav`

Short procedural 56k-style dial-up homage (dial tone → DTMF → ringback → handshake screech).

- Generated for Sip'n'Splain boot opener (internal talk).
- Sample rate: 22.05 kHz mono PCM WAV.
- Played by `js/moments/boot.js` during the blue “Starting Windows 95…” overlay — **not** routed through `sfx.js`.

**Autoplay:** browsers often block sound until a user gesture. The boot screen still shows; audio starts on first click/key if the initial `play()` is rejected. Mute (`M`) skips audio.

## Authentic Win95 / Win98 WAVs (`win95/`, `win98/`)

Curated shorts from the local `all-windows-sounds-main` pack (© Microsoft). Venue/talk OK; **gitignored** (same posture as the pinball engine) so a public push doesn’t ship copyrighted samples.

Source pack stays at repo root for reference; only these files are copied into `assets/audio/`:

| File | Era | Used for |
|------|-----|----------|
| `win98/start.wav` | 98 | `startMenu` (re-encoded PCM; pack original is MS ADPCM) |
| `win98/recycle.wav` | 98 | `recycleEmpty` |
| `win98/notify.wav` | 98 | `photo` |
| `win95/ding.wav` | 95 | `windowOpen`, `windowClose`, `correct` |
| `win95/chimes.wav` | 95 | `transition`, `beat` |
| `win95/tada.wav` | 95 | `updateUnlock` (floppy / Update unlock) |
| `win95/chord.wav` | 95 | `error`, `wrong` |
| `win95/microsoft-sound.wav` | 95 | On disk for optional swap (not wired by default — prefer short `tada`) |

## Windows XP (`winxp/`)

| File | Used for |
|------|----------|
| `winxp/startup.wav` | `xpStartup` — plays when `#winxp` lands after the Y2K CD install |

Copied from local `all-windows-sounds-main/(2001) Windows XP/Windows XP Startup.wav`. Gitignored like 95/98.

Missing or failed-to-decode files fall back to procedural WebAudio in `js/moments/sfx.js` so the talk never goes silent mid-gesture.

## Procedural / WAV SFX (`js/moments/sfx.js`)

Central layer used by the engine (`blip` / `api.sfx.play`). Master volume ~0.7. WAV first when mapped + loaded; else procedural.

| Kind | When | Audio |
|------|------|-------|
| `press` | Generic UI tick | procedural |
| `windowOpen` / `windowClose` | Win95/98 window open & close | `ding.wav` |
| `startMenu` | Start menu open | `start.wav` |
| `recycleEmpty` | Recycle Bin emptied (completion sting) | `recycle.wav` |
| `photo` | Photo reveal | `notify.wav` |
| `beat` | Beat complete chime | `chimes.wav` |
| `correct` | Quiz correct | `ding.wav` |
| `score` | Score bump | procedural |
| `updateUnlock` | Windows Update unlocks (floppy + tray badge) | `tada.wav` |
| `transition` | Era interstitial (“Downloading…”) starts | `chimes.wav` |
| `wrong` / `error` | Soft wrong / UI error | `chord.wav` |
| `slam` | Era veil hits | procedural |
| `mineFlag` | Minesweeper flag place | procedural |
| `paintTool` | Paint toolbox click | procedural |

No autoplay spam — one gesture unlock, then on-demand hits only. Keep WAVs short mono PCM and wire only through `sfx.js` (don’t scatter `<audio>` tags). Dial-up stays exclusive to `boot.js`.
