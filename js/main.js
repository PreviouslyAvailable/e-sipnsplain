/**
 * Sip'n'Splain — boot the experience engine.
 * Phase 1: architecture + signature moments.
 * Hooks below are extension points for later phases.
 */

import { createEngine } from "./engine.js";

const engine = createEngine(document);

/** Public API for presenter console / future modules */
window.Sipnsplain = {
  version: "2026.phase-1",
  engine,
  hooks: engine.hooks,
  eras: engine.eras,
  /** Canonical slide map — same order as the deck (1-based `n`, hash `id`) */
  slides: engine.slides,
  go: (idOrIndex) => {
    if (typeof idOrIndex === "number") {
      // 1-based slide numbers from SLIDES.md / HUD, or 0-based engine index
      if (idOrIndex >= 1 && idOrIndex <= engine.chapters.length) {
        return engine.go(idOrIndex - 1);
      }
      return engine.go(idOrIndex);
    }
    const i = engine.chapters.findIndex((c) => c.id === idOrIndex);
    if (i >= 0) engine.go(i);
  },
  next: () => engine.next(),
  prev: () => engine.prev(),
  flags: () => engine.getFlags(),
  runMoment: () => engine.moments,
  boot: engine.boot,
  progress: engine.progress,
  transition: engine.transition,
  y2k: engine.y2k,
  startY2k: () => engine.startY2k?.(),
  /**
   * Jump helpers for live rehearsal
   * Sipnsplain.go(1) · Sipnsplain.go('win95') · Sipnsplain.go('win98') · Sipnsplain.go('winxp')
   * Progress: Sipnsplain.progress.completeBeat('paint') · .snapshot() · .requiredStatus()
   * Y2K: Sipnsplain.startY2k() when section2 unlocked · Next skips theatre → CD install
   * Map: Sipnsplain.slides · HUD top-left · press I to toggle · N for notes
   * Age themes: engine.eras (AGE_THEMES) · body[data-era] locked per age until leave
   * Boot: funny load lines + dial-up → click/key after all lines · Paint is Start menu app, not slide 1
   * Section 1: Paint + Recycle + Minesweeper → floppy / tray Windows Update → #win98
   * Section 2: SkiFree + Pinball + Chris, 2000 → Y2K clock/BSOD → CD install → #winxp
   * Lucky is a gag only (no Section 1 skip)
   * Recycle: open photo → close empties bin · SFX: M mute · js/moments/sfx.js
   * Shift+Arrow escape · no lives / death mechanic · Y2K BSOD is cosmetic only
   */
};

console.info(
  "%cSip'n'Splain%c phase-1 · boot→Win95 hub · Section progress · Sipnsplain.progress · go('win95'|'win98')",
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
