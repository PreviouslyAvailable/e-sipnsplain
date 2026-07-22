/**
 * Canonical slide index — shared ids for chat ("slide 2", "#win95").
 * Labels stay short; theme comes from eraForChapter / bandMeta at runtime.
 * Boot overlay is not a numbered slide.
 */

import { bandMeta, eraForChapter } from "./eras.js";

/** @type {Record<string, string>} */
export const SLIDE_LABELS = {
  win95: "Win95 desktop hub",
  win98: "Windows 98 hub",
  winxp: "Windows XP",
  continue: "Continue…",
  "age-8": "GBA SP · 2003",
  "age-11": "Bebo · 2006",
  "age-14": "Minecraft · craft web",
  "make-impossible": "Make something impossible",
  "source-reveal": "Source reveal",
};

/**
 * @param {{ id:string, kind?:string, age?:number, hint?:string }[]} chapters
 * @returns {{ n:number, id:string, label:string, theme:string, era:string }[]}
 */
export function buildSlideMap(chapters) {
  return chapters.map((ch, i) => {
    const eraId = eraForChapter(ch);
    const meta = bandMeta(eraId);
    const label =
      SLIDE_LABELS[ch.id] ||
      (ch.kind === "photo" ? ch.hint || `Age ${ch.age}` : ch.id);
    return {
      n: i + 1,
      id: ch.id,
      label,
      theme: meta.label,
      era: eraId,
    };
  });
}

/**
 * On-screen / notes identity line.
 * HUD: `Slide 2/58 · #blue-screen · Win95 blue`
 * Notes: `Slide 2 · #blue-screen`
 * @param {{ id:string }} ch
 * @param {number} index0
 * @param {number} total
 */
export function slideIdentity(ch, index0, total) {
  const n = index0 + 1;
  const label = SLIDE_LABELS[ch.id] || ch.id;
  return {
    n,
    id: ch.id,
    label,
    notesLine: `Slide ${n} · #${ch.id}`,
    hudLine: `Slide ${n}/${total} · #${ch.id} · ${label}`,
  };
}

/** Markdown table for SLIDES.md */
export function slidesMarkdown(map) {
  const rows = map
    .map(
      (s) =>
        `| ${s.n} | \`${s.id}\` | ${s.label} | ${s.theme} (\`${s.era}\`) |`
    )
    .join("\n");
  return `# Sip'n'Splain — slide index

Canonical 1-based map. Prefer **\`#id\`** in chat; numbers drift if slides are inserted.

Say: \`slide 1\` or \`#win95\` — both resolve via \`Sipnsplain.go\` / this table.

**Overlays (not numbered):**
- **Boot** (\`boot-bsod\`) — cold open: funny load lines + dial-up → click/key (after all lines) → \`#win95\`.

| # | id | label | theme / era |
|---:|---|---|---|
${rows}
`;
}
