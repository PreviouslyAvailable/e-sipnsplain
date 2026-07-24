/**
 * Sip'n'Splain — boot the experience engine.
 * Phase 1: architecture + signature moments.
 * Hooks below are extension points for later phases.
 */

import { createEngine } from "./engine.js";

const engine = createEngine(document);

/** Aliases → story-arc / chapter ids (resolved by Sipnsplain.go) */
const GO_ALIASES = {
  "95": "win95",
  win95: "win95",
  "98": "win98",
  win98: "win98",
  y2k: "y2k",
  "y2k-start": "y2k",
  xp: "winxp",
  winxp: "winxp",
  consoles: "consoles",
  console: "consoles",
  web20: "web20",
  ie: "web20",
  firefox: "web20",
  timewarp: "timewarp",
  games: "timewarp",
  finale: "finale",
  "make-impossible": "finale",
};

function resolveGo(idOrIndex) {
  if (typeof idOrIndex === "number") {
    // 1-based slide numbers from SLIDES.md / HUD, or 0-based engine index
    if (idOrIndex >= 1 && idOrIndex <= engine.chapters.length) {
      return engine.go(idOrIndex - 1);
    }
    return engine.go(idOrIndex);
  }
  if (typeof idOrIndex !== "string") return;

  const raw = idOrIndex.replace(/^#/, "").trim();
  const alias = GO_ALIASES[raw.toLowerCase()];
  if (alias) {
    return engine.goArc(alias);
  }
  const i = engine.chapters.findIndex((c) => c.id === raw);
  if (i >= 0) engine.go(i);
}

function printArc() {
  const points = engine.storyArc();
  const rows = points.map((p) => ({
    key: p.hotkey,
    label: p.label,
    go: p.kind === "y2k" ? "Sipnsplain.go('y2k')" : `Sipnsplain.go('${p.id}')`,
    dest:
      p.kind === "y2k"
        ? "win98 + startY2k"
        : p.kind === "firefox"
          ? "winxp + Mozilla Firefox"
          : `#${p.chapterId}`,
  }));
  console.info(
    "%cSip'n'Splain%c story arc · press G or ` · Story menu · Sipnsplain.go('y2k'|'consoles'|'web20'|'timewarp'|'finale')",
    "font-weight:800;color:#14b8a6",
    "color:#94a3b8"
  );
  console.table(rows);
  return points;
}

/** Public API for presenter console / future modules */
window.Sipnsplain = {
  version: "2026.phase-1",
  engine,
  hooks: engine.hooks,
  eras: engine.eras,
  /** Canonical slide map — same order as the deck (1-based `n`, hash `id`) */
  slides: engine.slides,
  go: resolveGo,
  /** Print story-arc jump list (same as on-screen Story menu) */
  arc: printArc,
  next: () => engine.next(),
  prev: () => engine.prev(),
  flags: () => engine.getFlags(),
  runMoment: () => engine.moments,
  boot: engine.boot,
  progress: engine.progress,
  transition: engine.transition,
  y2k: engine.y2k,
  startY2k: () => engine.startY2k?.(),
  applyWin10Pack: () => engine.applyWin10Pack?.(),
  resetWin10Pack: () => engine.resetWin10Pack?.(),
  /**
   * Jump helpers for live rehearsal
   * Sipnsplain.go(1) · Sipnsplain.go('win95'|'win98'|'y2k'|'winxp'|'consoles'|'web20'|'timewarp'|'finale')
   * Sipnsplain.arc() — print Story menu destinations
   * On stage: G or ` → Story menu · 1–8 jump · Esc close · N notes · I slide HUD
   * Progress: Sipnsplain.progress.completeBeat('minesweeper'|'gbc'|'skifree'|'pinball'|'chris1999') · .snapshot() · .requiredStatus()
   * Y2K: Sipnsplain.startY2k() / go('y2k') · Next skips theatre → CD install
   * XP: Sipnsplain.go('winxp') · Story hotkey 4 · lands Bliss desktop (stays classic)
   * XP gag (manual): Sipnsplain.applyWin10Pack() / .resetWin10Pack()
   * Map: Sipnsplain.slides · HUD top-left · press I to toggle · N for notes
   * Age themes: engine.eras (AGE_THEMES) · body[data-era] locked per age until leave
   * Boot: funny load lines + dial-up → click/key after all lines → Win95 hub
   * Section 1: Atari + Minesweeper → floppy / tray Windows Update → #win98
   * Section 2: play optional (GBC/Ski/Pinball/Gates) → Themes → Chris, 1999 last → Y2K → #winxp
   * Section 3: Bliss · Firefox (Neopets→Moshi Monsters) · My Pictures / GameCube · optional applyWin10Pack()
   * Web 2.0: go('web20') / Story 6 → #winxp + open Mozilla Firefox (not a linear slide)
   * Consoles: #consoles PS2 splash → boot → Browser ads → Shutdown → Apple → #timewarp
   * Timewarp: empty OS X desktop + dock · click 09 (or any year) to open cards · ←/→ scrub · Continue → Switch 2 cue → #source-reveal
   * Lucky is a gag only (no Section 1 skip)
   * Recycle: open photo → close empties bin · SFX: M mute · js/moments/sfx.js
   * Shift+Arrow escape · no lives / death mechanic · Y2K BSOD is cosmetic only
   */
};

console.info(
  "%cSip'n'Splain%c phase-1 · G/` Story · go('win95'|'win98'|'y2k'|'winxp'|'consoles'|'web20'|'timewarp'|'finale') · Sipnsplain.arc()",
  "font-weight:800;color:#14b8a6",
  "color:#94a3b8"
);
console.table(
  engine.slides.map((s) => ({
    "#": s.n,
    id: s.id,
    label: s.label,
    theme: s.theme,
  }))
);
