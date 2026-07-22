/**
 * Age → Year → Theme — single source of truth.
 * Chris born Aug 22, 1995 → age N ≈ calendar year 1995+N
 * (age 0 = 1995, age 30 ≈ 2025/2026).
 *
 * DESIGN SYSTEM (Chris):
 * While on a given age's photo chapter(s), chrome stays locked to that year's
 * theme (body[data-era]). Theme only transitions when navigating off that age
 * into the next (age N → N+1). Multi-photo stacks within one age do not re-veil.
 * Opening chapters use prologue / Win95 desktop (Google lives inside that desktop);
 * age photos begin the year-locked system.
 *
 * Homage only — CSS recreation, no trademark assets.
 */

/** @typedef {"flash"|"morph"|"pageload"|"cart"|"petsite"|"island"|"lcd"|"touch"|"ghost"|"ai"} VeilKind */

/**
 * @typedef {{
 *   age: number,
 *   year: number,
 *   id: string,
 *   label: string,
 *   family: string,
 *   veil: VeilKind,
 *   evoke: string,
 *   note: string
 * }} AgeTheme
 */

/** @type {AgeTheme[]} */
export const AGE_THEMES = [
  {
    age: 0,
    year: 1995,
    id: "1995",
    label: "Win95 scrapbook",
    family: "scrapbook",
    veil: "flash",
    evoke: "Teal desktop birth → warm photo corners. Newborn scrapbook; Win95 opened two days later.",
    note: "ERA · 1995 Win95 scrapbook — ties to Win95 opening chapter.",
  },
  {
    age: 1,
    year: 1996,
    id: "1996",
    label: "Win95 desktop year",
    family: "win95",
    veil: "flash",
    evoke: "Still living in Windows 95 — teal desktop chrome, system fonts, toddler scrapbook on a 90s PC.",
    note: "ERA · 1996 Win95 desktop year — locked Win95 chrome for age-1 photos until you leave.",
  },
  {
    age: 2,
    year: 1997,
    id: "1997",
    label: "Early web / GeoCities",
    family: "early-web",
    veil: "pageload",
    evoke: "Visitor counters, tiled backgrounds, under-construction energy — first public web denseness.",
    note: "ERA · 1997 early web — GeoCities energy (homage).",
  },
  {
    age: 3,
    year: 1998,
    id: "1998",
    label: "1998 search",
    family: "search98",
    veil: "pageload",
    evoke: "Gray bands, multicolor wordmark homage, I'm Feeling Lucky — lives inside the Win95 Internet window.",
    note: "ERA · 1998 search — matches Google! opening beat.",
  },
  {
    age: 4,
    year: 1999,
    id: "1999",
    label: "Pet-site web",
    family: "petsite",
    veil: "petsite",
    evoke: "Bright yellow sidebar, busy kid-web denseness — virtual-pet site era (homage; no official assets).",
    note: "ERA · 1999 pet-site web — Neopets-era vibe in notes only.",
  },
  {
    age: 5,
    year: 2000,
    id: "2000",
    label: "Y2K chrome",
    family: "y2k",
    veil: "flash",
    evoke: "Midnight blues, LED countdown, bug anxiety chrome — millennium rollover theatre.",
    note: "ERA · 2000 Y2K / Millennium bug chrome.",
  },
  {
    age: 6,
    year: 2001,
    id: "2001",
    label: "Classic desktop OS",
    family: "desktop",
    veil: "pageload",
    evoke: "Beige-to-blue window chrome, system fonts, Start-menu energy — classic PC desktop.",
    note: "ERA · 2001 classic desktop OS.",
  },
  {
    age: 7,
    year: 2002,
    id: "2002",
    label: "Broadband messenger",
    family: "messenger",
    veil: "pageload",
    evoke: "Chat bubbles, online/away status, early broadband — messenger-era desktop (homage).",
    note: "ERA · 2002 broadband / messenger. CRT theatre (Y) still lives here.",
  },
  {
    age: 8,
    year: 2003,
    id: "2003",
    label: "GBA SP · 2003",
    family: "handheld",
    veil: "cart",
    evoke: "Cobalt clamshell, lit LCD, D-pad + A/B — handheld as interface (pixel homage, no Nintendo IP).",
    note: "ERA · 2003 GBA SP pixel homage. Ref: assets/refs/gba-sp-ref.png. Photo sits on the SP screen.",
  },
  {
    age: 9,
    year: 2004,
    id: "2004",
    label: "Tamagotchi",
    family: "tamagotchi",
    veil: "lcd",
    evoke: "Tiny green LCD, egg shell, pixel pet hunger — Chris first got a Tamagotchi in 2004 (homage; no Bandai assets).",
    note: "ERA · 2004 Tamagotchi — Chris's first pocket pet. Distinct from 2003 GBA.",
  },
  {
    age: 10,
    year: 2005,
    id: "2005",
    label: "Snowball years",
    family: "snowball",
    veil: "island",
    evoke: "Icy blues, cartoon panels, igloo-lobby energy — early kids-MMO web (homage only).",
    note: "ERA · 2005 snowball / kids-MMO homage.",
  },
  {
    age: 11,
    year: 2006,
    id: "2006",
    label: "Bebo · 2006",
    family: "bebo",
    veil: "pageload",
    evoke: "Custom lime/black profile skin, Top Friends grid, comment wall — Bebo-era homage (no scraped logos).",
    note: "ERA · 2006 Bebo profile homage. Ref: assets/refs/bebo-2006-ref.png.",
  },
  {
    age: 12,
    year: 2007,
    id: "2007",
    label: "Touch announce",
    family: "touch",
    veil: "touch",
    evoke: "Black glass slab, multitouch ripples, one home affordance — pocket computer arrives (homage).",
    note: "ERA · 2007 touch / iPhone-announce energy.",
  },
  {
    age: 13,
    year: 2008,
    id: "2008",
    label: "Chunky game UI",
    family: "adventure",
    veil: "morph",
    evoke: "Low-poly adventure HUD, gold XP chrome — curiosity + games (original homage, not a clone).",
    note: "ERA · 2008 chunky game / adventure HUD.",
  },
  {
    age: 14,
    year: 2009,
    id: "2009",
    label: "Early craft web",
    family: "minecraft-web",
    veil: "pageload",
    evoke: "Dark cobble-tile site, chunky wordmark, centered login energy — early minecraft.net May 2009 homage (no official logo/assets).",
    note: "ERA · 2009 early craft-web / minecraft.net homage (ref: assets/refs/minecraft-2009-ref.png).",
  },
  {
    age: 15,
    year: 2010,
    id: "2010",
    label: "Tumblr dashboard",
    family: "tumblr",
    veil: "morph",
    evoke: "Dashboard blues, reblog sincerity, GIFs-as-identity — early blog-social aesthetic.",
    note: "ERA · 2010 Tumblr / early social aesthetic.",
  },
  {
    age: 16,
    year: 2011,
    id: "2011",
    label: "Square feed",
    family: "square-feed",
    veil: "morph",
    evoke: "Square crop obsession, filter warmth, grid of moments — photo-feed era (homage).",
    note: "ERA · 2011 square photo feed (Instagram-era homage).",
  },
  {
    age: 17,
    year: 2012,
    id: "2012",
    label: "Six-second loop",
    family: "vine",
    veil: "morph",
    evoke: "Looping micro-clips, teal accents, attention in six seconds — short-video seed (homage).",
    note: "ERA · 2012 Vine → short-loop seed (homage).",
  },
  {
    age: 18,
    year: 2013,
    id: "2013",
    label: "Ghost stories",
    family: "snap",
    veil: "ghost",
    evoke: "Bright yellow, ephemeral frames, ghost silhouette energy — disappearing photo chat (homage).",
    note: "ERA · 2013 Snapchat ghost energy (homage).",
  },
  {
    age: 19,
    year: 2014,
    id: "2014",
    label: "Flat Material v1",
    family: "material",
    veil: "morph",
    evoke: "Paper cards, bold primary, Roboto confidence — first flat/Material wave.",
    note: "ERA · 2014 flat / Material v1.",
  },
  {
    age: 20,
    year: 2015,
    id: "2015",
    label: "Material bold",
    family: "material",
    veil: "morph",
    evoke: "Deeper shadows, FAB energy, saturated accents — Material growing teeth.",
    note: "ERA · 2015 Material bold variant.",
  },
  {
    age: 21,
    year: 2016,
    id: "2016",
    label: "Workspace chat",
    family: "slack",
    veil: "pageload",
    evoke: "Sidebar aubergine, channel lists, emoji reactions — work chat as OS (homage).",
    note: "ERA · 2016 workspace chat / Slack-ish homage.",
  },
  {
    age: 22,
    year: 2017,
    id: "2017",
    label: "Clean product UI",
    family: "product",
    veil: "morph",
    evoke: "Whitespace, product sans, soft elevation — startup marketing UI peaks.",
    note: "ERA · 2017 clean product / marketing UI.",
  },
  {
    age: 23,
    year: 2018,
    id: "2018",
    label: "Design canvas early",
    family: "designtool",
    veil: "morph",
    evoke: "Dark canvas, artboard frames, purple selection — design tool arrives.",
    note: "ERA · 2018 design-tool early (Figma-ish homage).",
  },
  {
    age: 24,
    year: 2019,
    id: "2019",
    label: "Multiplayer canvas",
    family: "designtool",
    veil: "morph",
    evoke: "Cursor presence, comments, shared files — design goes multiplayer.",
    note: "ERA · 2019 design-tool multiplayer.",
  },
  {
    age: 25,
    year: 2020,
    id: "2020",
    label: "Glass design tool",
    family: "designtool",
    veil: "morph",
    evoke: "Tighter glass, Auto Layout energy, remote-work precision — peak tool chrome.",
    note: "ERA · 2020 glass design-tool.",
  },
  {
    age: 26,
    year: 2021,
    id: "2021",
    label: "Token system",
    family: "designtool",
    veil: "morph",
    evoke: "Variables, modes, systematic color — design systems enter the canvas.",
    note: "ERA · 2021 design tokens / variables.",
  },
  {
    age: 27,
    year: 2022,
    id: "2022",
    label: "Design-tool peak",
    family: "designtool",
    veil: "morph",
    evoke: "Dev Mode adjacency, polished panels — last pure-tool year before AI chrome.",
    note: "ERA · 2022 design-tool peak.",
  },
  {
    age: 28,
    year: 2023,
    id: "2023",
    label: "AI-native early",
    family: "ai",
    veil: "ai",
    evoke: "Chat panes, prompt bars, soft neon — generative UI first wave.",
    note: "ERA · 2023 AI-native early.",
  },
  {
    age: 29,
    year: 2024,
    id: "2024",
    label: "AI-native mid",
    family: "ai",
    veil: "ai",
    evoke: "Agents, sidekicks, ambient rewrite — the deck starts listening.",
    note: "ERA · 2024 AI-native mid.",
  },
  {
    age: 30,
    year: 2025,
    id: "2025",
    label: "AI-native finale",
    family: "ai",
    veil: "ai",
    evoke: "Living surface, source as curiosity — 2025/26 peak; the medium was the argument.",
    note: "ERA · 2025/26 AI-native finale.",
  },
];

export const PHOTO_AGE_COUNT = AGE_THEMES.length; // 31 (ages 0–30)

/** @type {Map<number, AgeTheme>} */
const BY_AGE = new Map(AGE_THEMES.map((t) => [t.age, t]));
/** @type {Map<string, AgeTheme>} */
const BY_ID = new Map(AGE_THEMES.map((t) => [t.id, t]));

/**
 * Non-photo chapter → theme id.
 * Specials sync to the matching year theme when possible.
 */
const CHAPTER_ERA = {
  win95: "1995",
  win98: "win98",
  winxp: "winxp",
  continue: "prologue",
  "make-impossible": "2025",
  "source-reveal": "2025",
};

/**
 * @param {number} age
 * @returns {AgeTheme}
 */
export function themeForAge(age) {
  return BY_AGE.get(age) || AGE_THEMES[AGE_THEMES.length - 1];
}

/**
 * @param {string} eraId
 * @returns {{ era:string, years:string, label:string, evoke:string, family?:string, veil?:string, age?:number, year?:number, note?:string }}
 */
export function bandMeta(eraId) {
  if (eraId === "prologue") {
    return {
      era: "prologue",
      years: "now → then",
      label: "Prologue",
      evoke: "Contemporary mischief — then the deck drops into history.",
      family: "prologue",
      veil: "morph",
    };
  }
  if (eraId === "win98") {
    return {
      era: "win98",
      years: "1998",
      label: "Windows 98 hub",
      evoke: "Section 2 desktop hub — Desktop Themes + Space Cadet.",
      family: "win98",
      veil: "flash",
      year: 1998,
      note: "ERA · Windows 98 hub (Section 2) — not the age-3 search theme.",
    };
  }
  if (eraId === "winxp") {
    return {
      era: "winxp",
      years: "2001",
      label: "Windows XP hub",
      evoke: "Section 3 stub desktop — Luna kit staged, not applied yet.",
      family: "winxp",
      veil: "flash",
      year: 2001,
      note: "ERA · Windows XP stub hub (Section 3) — full kit later.",
    };
  }
  const t = BY_ID.get(eraId);
  if (t) {
    return {
      era: t.id,
      years: String(t.year),
      label: t.label,
      evoke: t.evoke,
      family: t.family,
      veil: t.veil,
      age: t.age,
      year: t.year,
      note: t.note,
    };
  }
  const last = AGE_THEMES[AGE_THEMES.length - 1];
  return {
    era: last.id,
    years: String(last.year),
    label: last.label,
    evoke: last.evoke,
    family: last.family,
    veil: last.veil,
    age: last.age,
    year: last.year,
    note: last.note,
  };
}

/**
 * @param {{ kind?:string, age?:number, id?:string }} ch
 * @returns {string}
 */
export function eraForChapter(ch) {
  if (!ch) return "prologue";
  if (ch.kind === "photo" && typeof ch.age === "number") {
    return themeForAge(ch.age).id;
  }
  return CHAPTER_ERA[ch.id] || "prologue";
}

/** Speaker-notes blurb when theme changes */
export function eraTransitionNote(fromEra, toEra) {
  if (fromEra === toEra) return "";
  const meta = bandMeta(toEra);
  const ageBit = typeof meta.age === "number" ? ` · age ${String(meta.age).padStart(2, "0")}` : "";
  return `\n\n⏱ ERA SHIFT → ${meta.years}${ageBit} · ${meta.label}\nThe deck itself is time-travelling — not just the photos. ${meta.evoke}`;
}

/** @deprecated Use AGE_THEMES — kept as alias for console / finale scaffolding */
export const ERA_BANDS = AGE_THEMES;

/**
 * Photo chapter layout templates — screenshot-of-that-year UI shells.
 * Photo sits *inside* the interface, not as a full-bleed Polaroid.
 */
export const LAYOUT_BY_YEAR = {
  "1995": "win95-window",
  "1996": "win95-window",
  "1997": "geocities-page",
  "1998": "search98",
  "1999": "petsite-well",
  "2000": "y2k-terminal",
  "2001": "desktop-window",
  "2002": "messenger",
  "2003": "gba",
  "2004": "tamagotchi",
  "2005": "snowball",
  "2006": "social-profile",
  "2007": "touch-device",
  "2008": "game-hud",
  "2009": "minecraft-2009",
  "2010": "social-feed",
  "2011": "social-feed",
  "2012": "social-feed",
  "2013": "social-feed",
  "2014": "flat-card",
  "2015": "flat-card",
  "2016": "workspace",
  "2017": "flat-card",
  "2018": "design-artboard",
  "2019": "design-artboard",
  "2020": "design-artboard",
  "2021": "design-artboard",
  "2022": "design-artboard",
  "2023": "ai-pane",
  "2024": "ai-pane",
  "2025": "ai-pane",
};

/**
 * Chapter-specific layout overrides (slide chrome ≠ calendar-year default).
 * Slide 16 `#age-3` → Treasure Mountain homage (game is 1990/97; calendar age-3 is 1998).
 */
const LAYOUT_BY_CHAPTER = {
  "age-3": "treasure-mountain",
};

/** @param {number} age */
export function layoutForAge(age) {
  const t = themeForAge(age);
  return LAYOUT_BY_YEAR[t.id] || "inset-card";
}

/**
 * @param {{ id?:string, age?:number }} ch
 */
export function layoutForChapter(ch) {
  if (ch?.id && LAYOUT_BY_CHAPTER[ch.id]) return LAYOUT_BY_CHAPTER[ch.id];
  if (typeof ch?.age === "number") return layoutForAge(ch.age);
  return "inset-card";
}

/** Ages still waiting on Chris's photos (empty default stacks in data.js). */
export function agesNeedingPhotos(yearsPS, yearsAS) {
  const all = [...(yearsPS || []), ...(yearsAS || [])];
  return all.filter((y) => !y.images?.length).map((y) => y.age);
}
