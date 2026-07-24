/**
 * Experience chapters + photo year data.
 * Public copy: chapters / levels — never "Impossible Quiz."
 *
 * STORY SPINE (two-fold):
 * 1) The experience chrome = technology over time (interfaces, games, systems).
 * 2) The photos = personal moments — Chris in the world as those tech eras shifted.
 * Hope about AI = deepening love of computers / what one curious person can build.
 */

import { themeForAge } from "./eras.js";

export const STORAGE_KEY = "sipnsplain-images-v1";
export const SCORE_KEY = "sipnsplain-score-v1";
export const MUTE_KEY = "sipnsplain-mute-v1";
export const AUDIENCE_KEY = "sipnsplain-audience-v1";

/** @typedef {{age:number, images:string[], hint:string, iface?:string, mission?:string, note:string, moments?:string[]}} YearSpec */

/** Append two-fold spine reminder + era lock to age speaker notes */
function withSpine(age, body) {
  const t = themeForAge(age);
  return `${body}\n\nTWO-FOLD — Chrome (${t.year} · ${t.label}) = the medium / tech over time. Photo = my life in that moment. Theme stays locked until you leave this age.`;
}

/** @type {YearSpec[]} */
export const yearsPS = [
  {
    age: 0,
    images: [],
    hint: "Yeet a baby pic here",
    iface: "Camera",
    note: "OPEN — Warm NZ 90s childhood. Motorsport → family traditions → curiosity. One beat, then move. Photos aren't here yet — drop when ready.\n\nERA LOCK · 1995 Win95 scrapbook — chrome stays on this year until you advance to age 1.",
  },
  {
    age: 1,
    images: ["/assets/years/y01-01.png"],
    hint: "Toddler + open-wheel car",
    iface: "Motorsport",
    mission: "Who's holding the camera?",
    note: "YR1 — First introduction to motorsport. Toddler beside a blue open-wheel race car (#53A Mobil 1); dad on the tire. ASK THE ROOM (A): \"Who's holding the camera?\" — usually a parent. Interface beat: others capture reality; he consumes the memory.\n\nERA LOCK · 1996 Win95 desktop — chrome stays Win95 for this age's photo(s) until you advance to age 2. Shift+click / drop replaces this photo.",
  },
  {
    age: 2,
    images: [
      "/assets/years/y02-01.png",
      "/assets/years/y02-02.png",
      "/assets/years/y02-03.png",
      "/assets/years/y02-04.png",
    ],
    hint: "Birthday throne energy",
    iface: "Birthday Photos",
    mission: "Guess the vibe",
    moments: ["ai-analysis"],
    note: "YR2 — Birthday comedy arc (4 photos). Cycle: click · ] / . next · [ / , prev. Order: 1) alone on throne → 2) wider party → 3) hero full table → 4) crying + yellow mascot (PAYOFF). On photos 3–4 press Y (or click Analyze cue) for theatrical AI age demo → lands \"Estimated age: 47.\" Then decade joke on mascot. Drop / Shift+click replaces CURRENT photo only.",
  },
  {
    age: 3,
    images: ["/assets/years/y03-01.png"],
    hint: "Red-and-white midget car",
    iface: "Motorsport",
    note: "YR3 — First time behind the wheel. Smiling in a red-and-white race car (#18) in the workshop. Themes: dreams, imagination, motorsport heritage. Short story — the fantasy of driving before you can.\n\nCHROME · Treasure Mountain homage (ref: assets/refs/treasure-mountain-1997-ref.png) — parchment riddle UI + green status bar. Homage only, no ripped sprites. Calendar year for age 3 is 1998; TM is a 1990s edutainment look (game ~1990/97).",
  },
  {
    age: 4,
    images: [
      "/assets/years/y04-01.png",
      "/assets/years/y04-02.png",
      "/assets/years/y04-03.png",
      "/assets/years/y04-04.png",
    ],
    hint: "NZ summer water fight",
    iface: "Summer",
    mission: "NZ summer or what?",
    note: "YR4 — Summer stack (4 photos). Cycle: click · ] / . · [ / ,. Hose fight → hills hoist backyard → Super Soaker ambush → BBQ sawhorse feast. ASK THE ROOM (A): \"NZ summer or what?\" Drop / Shift+click replaces current index.\n\nERA: 1999 pet-site web band (ages 4–6). Yellow sidebar / busy kid-web chrome — Neopets-era vibe in notes only; on-screen homage, no official assets.",
  },
  {
    age: 5,
    images: ["/assets/years/y05-01.png"],
    hint: "Costume + candles",
    iface: "Birthday Photos",
    note: "YR5 — Costume birthday. Teletubby Po blowing out candles (age vibes may look younger — trust the year label). Themes: school friends, birthdays, imagination. One story, under 20s.\n\nERA: Still 1999 pet-site web band (ages 4–6).",
  },
  {
    age: 6,
    images: [
      "/assets/years/y06-01.png",
      "/assets/years/y06-02.png",
    ],
    hint: "Holidays with family",
    iface: "Holidays",
    note: "YR6 — Two holiday beats. Cycle: click · ] / . · [ / ,. Queenstown picnic → NZ beach with family. Soft landing before the computer. Drop / Shift+click replaces current.\n\nERA: Last of 1999 pet-site band before age 7 → 2001 desktop / CRT.",
  },
  {
    age: 7,
    images: ["/assets/years/y07-01.png"],
    hint: "Beige CRT + floppy",
    iface: "Games",
    mission: "What interface just arrived?",
    moments: ["crt-boot"],
    note: "YR7 — KEY INTERFACE BEAT + CRT THEATRE. First computer (~2002). Press Y → CRT turns on → period boot → Windows cursor → zoom into the monitor (~30s). Esc / → skips. ASK THE ROOM (A): \"What interface just arrived?\" Land: screens begin.\n\nERA: 2001 classic desktop OS (age 7). Next: ages 8–9 → 2003 GBA; age 10 → 2005 snowball / kids-MMO homage.",
  },
  {
    age: 8,
    images: [],
    hint: "DROP PHOTO · 2003",
    iface: "Games",
    mission: "Guess the year",
    note: "GBA SP 2003 · Age 8 (born Aug 22, 1995). Pixel-art cobalt SP homage (ref: assets/refs/gba-sp-ref.png) — photo lives on the LCD, not full-bleed. Homage only: no Nintendo logos; mark reads HANDHELD SP. Drop photo when ready (path convention: /assets/years/y08-01.png). ASK THE ROOM (A): \"Guess the year.\"\n\nERA LOCK · 2003 handheld until you leave for Bebo 2006.",
  },
  {
    age: 9,
    images: [],
    hint: "DROP PHOTO · speak the story",
    iface: "Games",
    note: "PLACEHOLDER · Chris: replace. Prompt: first pocket pet? Chip: Games / Toys. Keep it light — one beat.\n\nERA LOCK · 2004 Tamagotchi — Chris first got one this year. Green LCD egg chrome (homage, no Bandai assets). Distinct from 2003 GBA. Veil on entry from age 8.",
  },
  {
    age: 10,
    images: [],
    hint: "DROP PHOTO · speak the story",
    iface: "Internet",
    note: "PLACEHOLDER · Chris: replace. ~2005 / age 10. Speculative chip: Internet — early kids-online years if the photo supports it. Still photographs, not screenshots. One story.\n\nERA: 2005 \"snowball years\" band (age 10). Icy cartoon panels / igloo-lobby chrome — Club Penguin–era vibe in speaker notes only; on-screen stays evocative (no Disney/CP logos or sprites). Island-load transition on entry.",
  },
  {
    age: 11,
    images: [],
    hint: "DROP PHOTO · 2006",
    iface: "Internet",
    mission: "Guess the year",
    note: "BEBO 2006 · Age 11 (born Aug 22, 1995). Full-screen profile homage — custom lime/black skin, Top Friends, comment box. Homage CSS only (ref: assets/refs/bebo-2006-ref.png); no scraped logos. Photo drops into the profile pic slot. ASK THE ROOM (A): \"Guess the year.\"\n\nERA LOCK · 2006 Bebo-era social profile until you leave for Minecraft 2009.",
  },
  {
    age: 12,
    images: [],
    hint: "DROP PHOTO · speak the story",
    iface: "Album",
    note: "PLACEHOLDER · Chris: replace. Chip: Album / scrapbook interface. Last stretch of other-people's-cameras. One line of story.",
  },
  {
    age: 13,
    images: [],
    hint: "Last scrapbook page",
    iface: "Camera",
    mission: "Guess what's next",
    note: "PLACEHOLDER · Chris: replace. Last of the P.S. pile. ASK THE ROOM (A): \"Guess what's next.\" Don't say After Screenshot — let the divider slam. Chip stays Camera on purpose.",
  },
];

/** @type {YearSpec[]} */
export const yearsAS = [
  {
    age: 14,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Screens",
    mission: "Guess the year",
    note: "PLACEHOLDER · Chris: replace. A.S. begins (~2009, age 14). Softening: fewer wrong-answer bits. ASK THE ROOM (A): \"Guess the year.\" Chip: Screens / Games — he starts capturing his own interface.\n\nTWO-FOLD — Chrome = early craft-web (minecraft.net May 2009 homage; no official logo). Photo = my life in that moment, sitting in the site’s content well. Theme locked until you leave age 14.",
  },
  {
    age: 15,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Games",
    note: "PLACEHOLDER · Chris: replace. Softening continues. Speculative chip: Games. One story, under 20s. Prompt: what was on the screen?",
  },
  {
    age: 16,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Internet",
    note: "PLACEHOLDER · Chris: replace. Last soft-landing year — after this, chrome fades further. Chip: Internet. One beat.",
  },
  {
    age: 17,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Photoshop",
    note: "PLACEHOLDER · Chris: replace. Soft mode: quieter chrome. Speculative chip: Photoshop (only if the receipt supports it). Story > novelty.",
  },
  {
    age: 18,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Phones",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Phones — pocket cameras arrive. Interface stack growing.\n\nERA: 2014 flat / Material-ish band (ages 18–22). Chrome cleans up — early career modernism.",
  },
  {
    age: 19,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Social",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Speculative chip: Social. Prompt: what feed / profile / status felt new?",
  },
  {
    age: 20,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Design tools",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Design tools. One quiet interface story.",
  },
  {
    age: 21,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Flash",
    mission: "Name the tool",
    note: "PLACEHOLDER · Chris: replace. Soft ask (A): \"Name the tool\" if the shot shows Photoshop / Flash / Figma-era software. Reflective — not a gotcha. Chip: Flash (swap if wrong).",
  },
  {
    age: 22,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Social",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Social. Keep under 20s.",
  },
  {
    age: 23,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Phones",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Phones. One beat.",
  },
  {
    age: 24,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Figma",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Speculative chip: Figma (or whatever tool the photo proves). Don't invent.\n\nERA: 2020 design-tool band (ages 23–27). Dark glass, tight type — tools for people who make interfaces.",
  },
  {
    age: 25,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Figma",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Figma. If designers raised hands earlier, this chapter already adapted — lean into their language.",
  },
  {
    age: 26,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Screens",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Chip: Screens. Quiet year — don't force a bit.",
  },
  {
    age: 27,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "Figma",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Nearly the payoff. Chip: Figma. One story.",
  },
  {
    age: 28,
    images: [],
    hint: "DROP SCREENSHOT · speak the story",
    iface: "AI tools",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Speculative chip: AI tools — only if true. Don't spoil age 30.",
  },
  {
    age: 29,
    images: [],
    hint: "One more… then the funny one",
    iface: "AI tools",
    note: "PLACEHOLDER · Chris: replace. Soft mode. Set up age 30 without spoiling the laugh. Chip: AI tools. Pause longer than you think. Then →.",
  },
  {
    age: 30,
    images: [],
    hint: "THE PAYOFF · drop when ready",
    iface: "AI?",
    mission: "What happens next?",
    note: "YR30 — PAYOFF. Stage it: hold the empty frame a beat, then drop/reveal. Don't step on the laugh. ASK THE ROOM (A): \"What happens next?\" Exact joke TBD — Chris to caption. Then Loading… → thesis sequence → Make something impossible.",
  },
];

export function photoChaptersFrom(years, era) {
  return years.map((y) => ({
    id: `age-${y.age}`,
    kind: "photo",
    chapter: era === "P.S." ? "pre-screenshot" : "after-screenshot",
    era,
    age: y.age,
    images: y.images || [],
    hint: y.hint,
    mission: y.mission,
    iface: y.iface,
    moments: y.moments || [],
    note: y.note,
  }));
}

/** Chapter meta for level-style progress */
export const CHAPTER_META = {
  cold: { label: "Cold open", short: "01" },
  origin: { label: "Origin", short: "02" },
  "pre-screenshot": { label: "P.S.", short: "P.S." },
  "after-screenshot": { label: "A.S.", short: "A.S." },
  thesis: { label: "Thesis", short: "Θ" },
  finale: { label: "Finale", short: "∞" },
};

export function buildChapters() {
  return [
    {
      id: "win95",
      kind: "win95",
      chapter: "origin",
      note: "HUB · WINDOWS 95 DESKTOP — Section 1. Default entry after boot overlay. Not a slide deck title; this desktop IS home.\n\nSECTION 1 PROGRESS — Required to unlock Windows Update:\n  Atari + Minesweeper (first open of each window — Minesweeper board clear optional for reward photo).\nWhen both are opened → desktop \"WINDOWS 98SE\" boot-disk floppy appears (hero) + tray \"Windows Update\" badge (secondary) → click either → \"Downloading Windows 98…\" interstitial → Continue → #win98 (Section 2). Floppy persists on hub revisit while unlocked & unconsumed.\n\nBEAT HOOKS\n· Atari [OWN · REQUIRED]: desktop Atari icon → horizontal print-ad strip (assets/atari/ads via ATARI_ADS) → completeBeat on open.\n· Minesweeper [OWN · REQUIRED]: Start → Entertainment Pack Two → Minesweeper → completeBeat on open.\n· Both required → unlocks update. Recycle Bin does not gate unlock.\n· Recycle Bin [OPTIONAL]: open baby photo → Recycle complete → leaving photo (× / other app / Empty) swaps to empty bin icon; persists.\n· readme.txt [OPTIONAL]: Notepad gag · OK / × close (stay).\n\nROOM BEAT · Open/close windows like a real machine:\n· Desktop icons (top→bottom): readme.txt · Atari · Recycle Bin · (WINDOWS 98SE floppy when unlocked).\n· Atari → wide ad-strip window (prev/next · swipe). × closes.\n· readme.txt (desktop) → Notepad gag.\n· Recycle Bin → photo (y01-01).\n· Start → Entertainment Pack Two → Minesweeper.\n· Shut Down… → harmless gag dialog (no crash / no lives).\n\nCUT · Paint and The Internet are gone from this hub.\n\nADVANCE — Floppy / update flow only (Atari + Mine open → floppy or tray → interstitial → #win98). → / Space blocked until Section 1 update consumed. Shift+Arrow escapes.\n\nSkiFree and Space Cadet pinball live on #win98 (Section 2), not here.\n\nHomage refs: win95-desktop-ref.png. Boot disk: assets/win95/windows-98se-boot-disk.png. Atari ads: assets/atari/ads/. ERA: body[data-era=1995].",
      html: `
        <div class="w95-desktop" data-w95>
          <div class="w95-icons">
            <button type="button" class="w95-icon" data-w95-open title="readme.txt">
              <img class="w95-icon-glyph" src="/assets/icons/w95/notepad-txt.png" alt="" width="32" height="32" draggable="false" />
              <span>readme.txt</span>
            </button>
            <button type="button" class="w95-icon is-hot" data-w95-atari-open title="Atari">
              <img class="w95-icon-glyph" src="/assets/icons/w95/start-games.png" alt="" width="32" height="32" draggable="false" />
              <span>Atari</span>
            </button>
            <button type="button" class="w95-icon" data-w95-recycle title="Recycle Bin">
              <img
                class="w95-icon-glyph is-bin is-full"
                src="/assets/icons/w95/recycle-full.png"
                data-bin-full="/assets/icons/w95/recycle-full.png"
                data-bin-empty="/assets/icons/w95/recycle-empty.png"
                alt=""
                width="32"
                height="32"
                draggable="false"
              />
              <span>Recycle Bin</span>
            </button>
            <button
              type="button"
              class="w95-icon is-hot is-boot-disk"
              data-w95-update
              data-w95-boot-disk
              hidden
              title="Windows 98SE Boot Disk"
              aria-label="Windows 98SE Boot Disk — install Windows 98"
            >
              <img
                class="w95-icon-glyph is-floppy"
                src="/assets/win95/windows-98se-boot-disk.png"
                alt=""
                width="32"
                height="32"
                draggable="false"
              />
              <span>WINDOWS 98SE</span>
            </button>
          </div>
          <div class="w95-window is-explorer is-closed" data-w95-window role="dialog" aria-labelledby="w95-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-title">readme.txt - Notepad</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>S</u>earch</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-client is-white">
              <div class="w95-readme">
                <p class="w95-lead">readme.txt — August 1995</p>
                <p>August 22, 1995 — I arrived.</p>
                <p>August 22, 1995 — Dua Lipa also arrives.</p>
                <p>August 24, 1995 — Windows 95 launched.</p>
                <p class="w95-punch">Talk about a Start menu.</p>
              </div>
              <div class="w95-actions">
                <button type="button" class="w95-btn" data-w95-close autofocus>OK</button>
              </div>
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Ln 1, Col 1</span>
              <span>Notepad</span>
            </div>
          </div>
          <div class="w95-window is-photo is-closed" data-w95-photo role="dialog" aria-labelledby="w95-photo-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-photo-title">C:\\RECYCLED\\y01-01.bmp</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-photo-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-photo-client">
              <img class="w95-photo-img" src="/assets/years/y01-01.png" alt="First photo from the talk — rescued from the Recycle Bin" />
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Recovered from Recycle Bin</span>
              <span>Bitmap</span>
            </div>
          </div>
          <div class="w95-window is-explorer is-ep2 is-closed" data-w95-ep2 role="dialog" aria-labelledby="w95-ep2-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-ep2-title">Entertainment Pack Two</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-ep2-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-client">
              <div class="w95-folder-icons" style="display:flex;flex-wrap:wrap;gap:16px;padding:12px;min-height:120px">
                <button type="button" class="w95-icon" data-w95-mine-open title="Minesweeper" style="color:#000;text-shadow:none">
                  <img class="w95-icon-glyph" src="/assets/icons/w95/start-minesweeper.png" alt="" width="32" height="32" draggable="false" />
                  <span>Minesweeper</span>
                </button>
              </div>
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>1 object(s)</span>
              <span>Entertainment Pack Two</span>
            </div>
          </div>
          <div
            class="w95-window is-atari is-closed"
            data-w95-atari
            role="dialog"
            aria-labelledby="w95-atari-title"
            aria-hidden="true"
            style="width:min(1380px,calc(100cqw - 28px));max-height:calc(100cqh - 40px);z-index:5"
          >
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-atari-title">Atari</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-atari-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-atari-client" style="display:flex;align-items:stretch;gap:4px;height:min(630px,82cqh);padding:4px;background:#000;min-height:0">
              <button type="button" class="w95-btn" data-atari-prev title="Previous" aria-label="Previous ads" style="flex:0 0 auto;align-self:center">◀</button>
              <div class="w95-ad-strip" style="flex:1 1 auto;min-width:0;min-height:0;height:100%">
                <div data-atari-strip-track></div>
              </div>
              <button type="button" class="w95-btn" data-atari-next title="Next" aria-label="Next ads" style="flex:0 0 auto;align-self:center">▶</button>
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Scroll · ← / → · swipe</span>
              <span>Print ads</span>
            </div>
          </div>
          <div class="w95-window is-minesweeper is-closed" data-w95-mine role="dialog" aria-labelledby="w95-mine-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-mine-title">Minesweeper</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-mine-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>G</u>ame</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-mine-client">
              <canvas class="w95-mine-canvas" data-w95-mine-canvas width="492" height="516" tabindex="0" aria-label="Minesweeper — left click reveal, right click flag, smiley resets"></canvas>
            </div>
            <div class="w95-statusbar">
              <span>16×16 · 10 mines · clear → photo (optional)</span>
              <span>Entertainment Pack</span>
            </div>
          </div>
          <div class="w95-start-menu" data-w95-start-menu hidden aria-hidden="true">
            <div class="w95-start-banner" aria-hidden="true"><span>Windows</span>95</div>
            <ul class="w95-start-list" role="menu">
              <li class="w95-start-item has-flyout" data-w95-start-flyout>
                <button type="button" class="w95-start-btn" role="menuitem" aria-haspopup="true" aria-expanded="false">
                  <img class="w95-start-ico" src="/assets/icons/w95/start-games.png" alt="" width="16" height="16" draggable="false" />
                  <span>Entertainment Pack Two</span>
                  <span class="w95-start-arrow" aria-hidden="true">▶</span>
                </button>
                <ul class="w95-start-flyout" role="menu" hidden>
                  <li>
                    <button type="button" class="w95-start-btn" data-w95-mine-open role="menuitem">
                      <img class="w95-start-ico" src="/assets/icons/w95/start-minesweeper.png" alt="" width="16" height="16" draggable="false" />
                      <span>Minesweeper</span>
                    </button>
                  </li>
                </ul>
              </li>
              <li class="w95-start-sep" aria-hidden="true"></li>
              <li data-w95-update-menu hidden>
                <button type="button" class="w95-start-btn is-update" data-w95-update role="menuitem">
                  <img class="w95-start-ico" src="/assets/icons/w95/start-update.png" alt="" width="16" height="16" draggable="false" />
                  <span>Windows Update</span>
                </button>
              </li>
              <li>
                <button type="button" class="w95-start-btn" data-w95-shutdown role="menuitem">
                  <img class="w95-start-ico" src="/assets/icons/w95/start-shutdown.png" alt="" width="16" height="16" draggable="false" />
                  <span>Shut Down…</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="w95-window is-shutdown is-closed" data-w95-shutdown-dlg role="dialog" aria-labelledby="w95-shutdown-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w95-shutdown-title">Shut Down Windows</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-shutdown-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-shutdown-client">
              <p class="w95-shutdown-lead">What do you want the computer to do?</p>
              <p class="w95-shutdown-gag">Just kidding. This talk stays on.</p>
              <div class="w95-shutdown-actions">
                <button type="button" class="w95-btn" data-w95-shutdown-ok>OK</button>
              </div>
            </div>
          </div>
          <div class="w95-taskbar">
            <button type="button" class="w95-start" data-w95-start title="Start" aria-haspopup="true" aria-expanded="false">Start</button>
            <button type="button" class="w95-task" data-w95-task="mc" data-w95-open hidden title="readme.txt">readme.txt</button>
            <button type="button" class="w95-task" data-w95-task="photo" data-w95-photo-task hidden title="y01-01.bmp">y01-01.bmp</button>
            <button type="button" class="w95-task" data-w95-task="ep2" data-w95-my-computer hidden title="Entertainment Pack Two">Entertainment Pack Two</button>
            <button type="button" class="w95-task" data-w95-task="atari" data-w95-atari-open hidden title="Atari">Atari</button>
            <button type="button" class="w95-task" data-w95-task="mine" data-w95-mine-open hidden title="Minesweeper">Minesweeper</button>
            <div class="w95-tray">
              <button
                type="button"
                class="w95-update-badge"
                data-w95-update
                hidden
                title="Windows Update — an update is available"
                aria-label="Windows Update available"
              >
                <img class="w95-update-ico" src="/assets/icons/w95/tray-update.png" alt="" width="16" height="16" draggable="false" />
                <span class="w95-update-pulse" aria-hidden="true"></span>
              </button>
              <span class="w95-clock" aria-hidden="true">8:24 AM</span>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "win98",
      kind: "win98",
      chapter: "origin",
      note: "SECTION 2 · WINDOWS 98 — Landed from Section 1 update interstitial (\"Downloading Windows 98…\").\n\nDESKTOP HUB — ui-98 Microsoft Sans Serif + classic gray chrome (assets/win98-ui + css/win98-kit.css).\n\nROOM FLOW — play around first (optional flavour), THEN Desktop Themes → apply Chris, 1999 last → Y2K / XP.\n\nREQUIRED BEAT → starts Y2K:\n· DESKTOP THEMES → apply Chris, 1999 → completeBeat('chris1999') → Y2K clock takeover (no XP floppy / tray update).\n\nOPTIONAL FLAVOUR (tracked beats OK; do NOT gate XP):\n· GAME BOY COLOR scrapbook — open → completeBeat('gbc').\n· SKIFREE — open (yeti / Game Over photo optional reward) → completeBeat('skifree').\n· PINBALL — open (score / era photo optional) → completeBeat('pinball').\n· Gates Preview — short COMDEX-demo crash → cosmetic BSOD → completeBeat('gates') on dismiss.\n\nY2K SEQUENCE (on Chris, 1999 apply, ~17s pre-midnight): arm (~2.8s — hear sound shift) → drift (~5.5s — open tray clock / Date-Time, speak to date) → speed-up (~4s) → sprint (~4.8s) → date rollover 1 Jan 2000 → midnight → cosmetic BSOD (click/key) → POST/CD reboot (click/key) → CD install “Installing Windows XP…” → #winxp + Bliss + startup chime. Tray clock stays openable during arm/drift/speedup without aborting.\n\nPresenter: Sipnsplain.go('win95'|'win98'|'winxp'|'y2k'). Escape hatch: Sipnsplain.startY2k() once unlocked. Story hotkey 3 / go('y2k') cheat-completes chris1999.",
      html: `
        <div class="w98-desktop" data-w98 data-w98-theme="default">
          <div class="w98-icons">
            <button type="button" class="w98-icon is-hot" data-w98-themes-open title="Desktop Themes — apply Chris, 1999 last to start Y2K">
              <img class="w98-icon-glyph" src="/assets/icons/w98/control-panel.png" alt="" width="32" height="32" draggable="false" />
              <span>Desktop Themes</span>
            </button>
            <button type="button" class="w98-icon" data-w98-gbc-open title="Game Boy Color — Nov 1998 (optional)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/start-games.png" alt="" width="32" height="32" draggable="false" />
              <span>Game Boy Color</span>
            </button>
            <button type="button" class="w98-icon" data-w98-pinball-open title="3D Pinball for Windows - Space Cadet (optional)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/pinball.png" alt="" width="32" height="32" draggable="false" />
              <span>Space Cadet</span>
            </button>
            <button type="button" class="w98-icon" data-w98-ski-open title="SkiFree (optional)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/ski.png" alt="" width="32" height="32" draggable="false" />
              <span>SkiFree</span>
            </button>
          </div>
          <div class="w95-window w98-gbc is-closed" data-w98-gbc role="dialog" aria-labelledby="w98-gbc-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-gbc-title">Game Boy Color — Nov 1998</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-gbc-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w98-gbc-client">
              <div class="w98-gbc-collage" data-gbc-collage></div>
              <div class="w98-gbc-actions">
                <button type="button" class="w98-kit-btn" data-w98-gbc-continue>Continue…</button>
              </div>
            </div>
          </div>
          <div class="w95-window w98-gates is-closed" data-w98-gates role="dialog" aria-labelledby="w98-gates-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-gates-title">Gates Preview — Live Demo</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-gates-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w98-gates-chrome" aria-hidden="true">
              <span class="w98-gates-addr-label">Address</span>
              <span class="w98-gates-addr">http://www.microsoft.com/windows/demo/</span>
            </div>
            <div class="w98-gates-client">
              <p class="w98-gates-kicker">COMDEX ’98 · private preview</p>
              <h3 class="w98-gates-headline">The future of computing… live!</h3>
              <p class="w98-gates-copy">Watch as we casually browse the web, open a few windows, and definitely do not crash in front of the entire industry.</p>
              <p class="w98-gates-copy is-muted">Homage only — no real logos. Flavour beat; skip anytime.</p>
              <button type="button" class="w98-kit-btn" data-w98-gates-run>Start demo…</button>
            </div>
          </div>
          <div
            class="w98-gates-bsod"
            data-w98-gates-bsod
            hidden
            role="dialog"
            aria-modal="true"
            aria-label="Cosmetic blue screen — Gates demo crash homage"
          >
            <div class="bsod-screen" data-w98-gates-dismiss tabindex="0">
              <div class="bsod-inner">
                <div class="bsod-pill">Windows</div>
                <div class="bsod-body">
                  <p>A fatal exception 0E has occurred at 0028:C000GATE in VXD DEMO(01) + 00010F44. The current application will be terminated.</p>
                  <ul class="bsod-list">
                    <li>Press any key to pretend this never happened.</li>
                    <li>Press CTRL+ALT+DEL to restart your dignity. You will lose any unsaved COMDEX applause.</li>
                  </ul>
                  <p class="bsod-warn">* While demonstrating the browser to a room full of journalists (1998).</p>
                </div>
                <p class="bsod-continue">
                  Click or press any key to return to the desktop <span class="bsod-cursor">_</span>
                </p>
              </div>
            </div>
          </div>
          <div class="w95-window w98-themes is-closed" data-w98-themes role="dialog" aria-labelledby="w98-themes-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-themes-title">Desktop Themes</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-themes-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w98-themes-body">
              <p class="w98-themes-lead">Theme:</p>
              <div class="w98-themes-layout">
                <ul class="w98-themes-list" data-w98-themes-list role="listbox" aria-label="Desktop themes"></ul>
                <div class="w98-themes-preview" data-w98-themes-preview aria-live="polite">
                  <div class="w98-themes-swatch" data-w98-themes-swatch></div>
                  <p class="w98-themes-preview-label" data-w98-themes-preview-label>Classic teal desktop</p>
                </div>
              </div>
              <div class="w98-themes-actions">
                <button type="button" class="w98-kit-btn" data-w98-themes-ok>OK</button>
                <button type="button" class="w98-kit-btn" data-w98-themes-cancel>Cancel</button>
                <button type="button" class="w98-kit-btn" data-w98-themes-apply>Apply</button>
              </div>
            </div>
          </div>
          <div class="w95-window is-photo is-chris-reward is-closed" data-w98-chris-photo role="dialog" aria-labelledby="w98-chris-photo-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-chris-photo-title">C:\\WINDOWS\\THEMES\\chris-1999.bmp</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-chris-photo-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-photo-client">
              <img class="w95-photo-img" data-w98-chris-photo-img src="/assets/chris-1999.png" alt="Chris, 1999 — swap assets/chris-1999.png" />
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Theme reveal</span>
              <span>Bitmap</span>
            </div>
          </div>
          <div class="w95-window is-skifree is-closed" data-w98-ski role="dialog" aria-labelledby="w98-ski-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-ski-title">SkiFree</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-ski-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>G</u>ame</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-ski-client" data-w98-ski-client>
              <iframe
                class="w95-ski-frame"
                data-w98-ski-frame
                title="SkiFree.js"
                tabindex="0"
                hidden
                aria-hidden="true"
                allow="gamepad"
              ></iframe>
              <!-- Full-bleed reward over the game client (not a separate Win98 window). -->
              <div
                class="w95-ski-reward-cover"
                data-w98-ski-reward-cover
                hidden
                aria-hidden="true"
              >
                <img
                  class="w95-ski-reward-img"
                  src="/assets/skifree-reward.png?v=2"
                  alt="Kid at a beige Compaq CRT — SkiFree era reward"
                />
              </div>
            </div>
            <div class="w95-statusbar">
              <span data-w98-ski-status>↓ Finish @ ~200m · Esc closes</span>
              <span data-w98-ski-score>ready</span>
            </div>
          </div>
          <div class="w95-window is-photo is-ski-reward is-closed" data-w98-ski-photo role="dialog" aria-labelledby="w98-ski-photo-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-ski-photo-title">C:\\WINDOWS\\SKIFREE\\reward.bmp</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-ski-photo-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-photo-client">
              <img class="w95-photo-img" src="/assets/skifree-reward.png?v=2" alt="Kid at a beige Compaq CRT — SkiFree era reward" />
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Finish · yeti · Game Over</span>
              <span>Bitmap</span>
            </div>
          </div>
          <div class="w95-window is-pinball is-closed" data-pinball role="dialog" aria-labelledby="w98-pinball-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-pinball-title">3D Pinball for Windows - Space Cadet</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-pinball-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-pinball-client" data-pinball-client>
              <div class="w95-pinball-stage">
                <iframe
                  class="w95-pinball-frame"
                  data-pinball-frame
                  title="3D Pinball Space Cadet"
                  tabindex="0"
                  hidden
                  aria-hidden="true"
                  allow="autoplay; gamepad; fullscreen"
                ></iframe>
                <div class="w95-pinball-placeholder" data-pinball-placeholder>
                  <div class="w95-pinball-table" aria-hidden="true"></div>
                  <div class="w95-pinball-copy">
                    <p class="w95-pinball-kicker">Space Cadet</p>
                    <p>Drop the lrusso local build and this table lights up — same-origin, no double chrome.</p>
                    <p class="w95-pinball-path">Keep <code>assets/pinball/index.html</code>. Drop <code>3DPinballSpaceCadet.js</code> beside it (see folder README — do not commit game data).</p>
                    <p class="w95-pinball-keys"><kbd>Z</kbd> left · <kbd>C</kbd> right · <kbd>X</kbd> tilt · <kbd>Space</kbd> launch · <kbd>R</kbd> restart · <kbd>T</kbd> sound</p>
                  </div>
                </div>
              </div>
              <div class="w95-pinball-gate" data-pinball-gate hidden>
                <button type="button" class="w95-pinball-continue" data-pinball-continue hidden>
                  Continue →
                </button>
              </div>
            </div>
            <div class="w95-statusbar">
              <span data-pinball-status>Ready</span>
              <span>Space Cadet</span>
            </div>
          </div>
          <div class="w95-window is-photo is-pinball-reward is-closed" data-pinball-photo role="dialog" aria-labelledby="w98-pinball-photo-title" aria-hidden="true">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-pinball-photo-title">C:\\WINDOWS\\PINBALL\\reward.bmp</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-pinball-photo-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w95-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
            </div>
            <div class="w95-photo-client">
              <img class="w95-photo-img" src="/assets/pinball-reward.png" alt="Pinball era reward — swap assets/pinball-reward.png" />
            </div>
            <div class="w95-statusbar" aria-hidden="true">
              <span>Space Cadet clear</span>
              <span>Bitmap</span>
            </div>
          </div>
          <div class="w98-start-menu" data-w98-start-menu hidden aria-hidden="true">
            <div class="w98-start-banner" aria-hidden="true"><span>Windows</span>98</div>
            <ul class="w98-start-list" role="menu">
              <li class="w98-start-item has-flyout" data-w98-start-flyout>
                <button type="button" class="w98-start-btn" role="menuitem" aria-haspopup="true" aria-expanded="false">
                  <img class="w98-start-ico" src="/assets/icons/w98/start-games.png" alt="" width="16" height="16" draggable="false" />
                  <span>Entertainment Pack</span>
                  <span class="w98-start-arrow" aria-hidden="true">▶</span>
                </button>
                <ul class="w98-start-flyout" role="menu" hidden>
                  <li>
                    <button type="button" class="w98-start-btn" data-w98-gbc-open role="menuitem">
                      <img class="w98-start-ico" src="/assets/icons/w98/start-games.png" alt="" width="16" height="16" draggable="false" />
                      <span>Game Boy Color</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="w98-start-btn" data-w98-pinball-open role="menuitem">
                      <img class="w98-start-ico" src="/assets/icons/w98/start-pinball.png" alt="" width="16" height="16" draggable="false" />
                      <span>3D Pinball Space Cadet</span>
                    </button>
                  </li>
                  <li>
                    <button type="button" class="w98-start-btn" data-w98-ski-open role="menuitem">
                      <img class="w98-start-ico" src="/assets/icons/w98/start-ski.png" alt="" width="16" height="16" draggable="false" />
                      <span>SkiFree</span>
                    </button>
                  </li>
                </ul>
              </li>
              <li class="w98-start-item has-flyout" data-w98-start-flyout>
                <button type="button" class="w98-start-btn" role="menuitem" aria-haspopup="true" aria-expanded="false">
                  <img class="w98-start-ico" src="/assets/icons/w98/start-settings.png" alt="" width="16" height="16" draggable="false" />
                  <span>Settings</span>
                  <span class="w98-start-arrow" aria-hidden="true">▶</span>
                </button>
                <ul class="w98-start-flyout" role="menu" hidden>
                  <li>
                    <button type="button" class="w98-start-btn" data-w98-themes-open role="menuitem" title="Desktop Themes — Chris, 1999 starts Y2K">
                      <img class="w98-start-ico" src="/assets/icons/w98/start-themes.png" alt="" width="16" height="16" draggable="false" />
                      <span>Desktop Themes</span>
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <button type="button" class="w98-start-btn" data-w98-gates-open role="menuitem" title="Gates Preview — COMDEX demo homage">
                  <img class="w98-start-ico" src="/assets/icons/w95/internet.png" alt="" width="16" height="16" draggable="false" />
                  <span>Gates Preview</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="w98-taskbar">
            <button type="button" class="w98-start" data-w98-start title="Start" aria-haspopup="true" aria-expanded="false">
              <span class="w98-start-logo" aria-hidden="true"></span>
              Start
            </button>
            <button type="button" class="w98-task" data-w98-task="themes" data-w98-themes-open hidden title="Desktop Themes">Themes</button>
            <button type="button" class="w98-task" data-w98-task="gbc" data-w98-gbc-open hidden title="Game Boy Color — Nov 1998">Game Boy Color</button>
            <button type="button" class="w98-task" data-w98-task="gates" data-w98-gates-open hidden title="Gates Preview — Live Demo">Gates Preview</button>
            <button type="button" class="w98-task" data-w98-task="pinball" data-w98-pinball-open hidden title="3D Pinball for Windows - Space Cadet">3D Pinball</button>
            <button type="button" class="w98-task" data-w98-task="ski" data-w98-ski-open hidden title="SkiFree">SkiFree</button>
            <button type="button" class="w98-task" data-w98-task="skiphoto" data-w98-ski-photo-task hidden title="reward.bmp">skifree.bmp</button>
            <button type="button" class="w98-task" data-w98-task="pinballphoto" data-pinball-photo-task hidden title="reward.bmp">pinball.bmp</button>
            <button type="button" class="w98-task" data-w98-task="chrisphoto" data-w98-chris-photo-task hidden title="chris-1999.bmp">chris-1999.bmp</button>
            <button type="button" class="w98-task" data-w98-task="datetime" data-w98-datetime-task hidden title="Date/Time Properties">Date/Time</button>
            <div class="w98-tray">
              <span class="w98-tray-icon" aria-hidden="true" title="Volume"></span>
              <button
                type="button"
                class="w98-clock"
                data-w98-clock
                title="Double-click to adjust date/time"
                aria-label="Clock — open Date/Time Properties"
              >10:02 AM</button>
            </div>
          </div>
          <div
            class="w95-window w98-datetime is-closed"
            data-w98-datetime
            role="dialog"
            aria-labelledby="w98-datetime-title"
            aria-hidden="true"
          >
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-datetime-title">Date/Time Properties</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true" title="Help">?</span>
                <button type="button" class="w95-ctrl is-close" data-w98-datetime-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w98-datetime-body">
              <div class="w98-datetime-tabs" role="tablist" aria-label="Date/Time tabs">
                <button type="button" class="w98-datetime-tab is-active" role="tab" aria-selected="true" data-w98-datetime-tab="datetime">Date &amp; Time</button>
                <button type="button" class="w98-datetime-tab" role="tab" aria-selected="false" data-w98-datetime-tab="tz" disabled title="Time Zone (decorative)">Time Zone</button>
              </div>
              <div class="w98-datetime-panel" data-w98-datetime-panel>
                <fieldset class="w98-datetime-group is-date">
                  <legend>Date</legend>
                  <div class="w98-datetime-date-controls">
                    <select class="w98-datetime-month" data-w98-datetime-month aria-label="Month" tabindex="-1">
                      <option>January</option><option>February</option><option>March</option>
                      <option>April</option><option>May</option><option>June</option>
                      <option>July</option><option>August</option><option>September</option>
                      <option>October</option><option>November</option><option selected>December</option>
                    </select>
                    <div class="w98-datetime-year-wrap">
                      <input class="w98-datetime-year" data-w98-datetime-year type="text" value="1999" readonly aria-label="Year" tabindex="-1" />
                      <span class="w98-datetime-spinner" aria-hidden="true"><span></span><span></span></span>
                    </div>
                  </div>
                  <div class="w98-datetime-cal" data-w98-datetime-cal aria-label="December 1999">
                    <div class="w98-datetime-cal-head" aria-hidden="true">
                      <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                    </div>
                    <div class="w98-datetime-cal-grid" data-w98-datetime-cal-grid></div>
                  </div>
                </fieldset>
                <fieldset class="w98-datetime-group is-time">
                  <legend>Time</legend>
                  <div class="w98-datetime-analog" data-w98-datetime-analog aria-hidden="true">
                    <div class="w98-datetime-face">
                      <span class="w98-datetime-hand is-hour" data-w98-datetime-hand-h></span>
                      <span class="w98-datetime-hand is-minute" data-w98-datetime-hand-m></span>
                      <span class="w98-datetime-hand is-second" data-w98-datetime-hand-s></span>
                      <span class="w98-datetime-pivot"></span>
                    </div>
                  </div>
                  <div class="w98-datetime-digital-wrap">
                    <input class="w98-datetime-digital" data-w98-datetime-digital type="text" value="11:59:50" readonly aria-label="Time" tabindex="-1" />
                    <span class="w98-datetime-spinner" aria-hidden="true"><span></span><span></span></span>
                  </div>
                </fieldset>
              </div>
              <p class="w98-datetime-tz" data-w98-datetime-tz>Current time zone: AUS Eastern Standard Time</p>
              <div class="w98-datetime-actions">
                <button type="button" class="w98-kit-btn" data-w98-datetime-ok>OK</button>
                <button type="button" class="w98-kit-btn" data-w98-datetime-close>Cancel</button>
                <button type="button" class="w98-kit-btn" disabled>Apply</button>
              </div>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "winxp",
      kind: "winxp",
      chapter: "origin",
      note: "SECTION 3 · WINDOWS XP — Landed from Section 2 Y2K sequence (clock → BSOD · CD install).\n\nLands on Bliss + Luna chrome (css/winxp-kit.css · assets/winxp-ui) + XP startup chime. Stays classic (no auto Win10-pack swap). Optional gag: Sipnsplain.applyWin10Pack() / .resetWin10Pack() (assets/winxp-ui/win10pack, MIT).\n\nOPTIONAL BEATS (progress only):\n· MY PICTURES — desktop / Start → Explorer filmstrip of GameCube print ads → completeBeat('gamecube').\n· MOZILLA FIREFOX — desktop / Start → Firefox 1.0 homage window with Web 2.0 year tabs (Neopets 2004 → Moshi Monsters 2007) → completeBeat('firefox'). ←/→ cycle tabs while open.\n\nPATH FORWARD (required for Next):\n· Start → Shut Down… → OK → pure black → slow TV-static fade-in (no logo / buttons) → Space / Next → #consoles PS2 splash + boot.\n· → / Space blocked until power-off; on the static beat, Space / Next starts PS2. Shift+Arrow escapes.\n\nPresenter: Sipnsplain.go('winxp') · go('web20') / Story 6 opens Firefox on XP · optional applyWin10Pack().",
      html: `
        <div class="wxp-desktop is-bliss" data-wxp>
          <div class="wxp-icons">
            <button type="button" class="wxp-icon is-muted" title="My Computer (coming soon)" data-wxp-w10-title="This PC (coming soon)">
              <img class="wxp-icon-glyph wxp-icon--classic" src="/assets/winxp-ui/icons/my-computer.png" alt="" width="32" height="32" draggable="false" />
              <img class="wxp-icon-glyph wxp-icon--w10" src="/assets/winxp-ui/win10pack/icons/this-pc.png" alt="" width="32" height="32" draggable="false" hidden />
              <span class="wxp-label--classic">My Computer</span>
              <span class="wxp-label--w10" hidden>This PC</span>
            </button>
            <button type="button" class="wxp-icon" data-wxp-pictures-open title="My Pictures" data-wxp-w10-title="Pictures">
              <img class="wxp-icon-glyph wxp-icon--classic" src="/assets/winxp-ui/icons/my-pictures.png" alt="" width="32" height="32" draggable="false" />
              <img class="wxp-icon-glyph wxp-icon--w10" src="/assets/winxp-ui/win10pack/icons/pictures.png" alt="" width="32" height="32" draggable="false" hidden />
              <span class="wxp-label--classic">My Pictures</span>
              <span class="wxp-label--w10" hidden>Pictures</span>
            </button>
            <button type="button" class="wxp-icon" data-wxp-firefox-open title="Mozilla Firefox">
              <span class="wxp-icon-glyph wxp-ff-glyph" aria-hidden="true"></span>
              <span>Mozilla Firefox</span>
            </button>
            <button type="button" class="wxp-icon is-muted" title="Recycle Bin (coming soon)" data-wxp-w10-title="Recycle Bin (coming soon)">
              <img class="wxp-icon-glyph wxp-icon--classic" src="/assets/winxp-ui/icons/recycle-empty.png" alt="" width="32" height="32" draggable="false" />
              <img class="wxp-icon-glyph wxp-icon--w10" src="/assets/winxp-ui/win10pack/icons/recycle-empty.png" alt="" width="32" height="32" draggable="false" hidden />
              <span class="wxp-label--classic">Recycle Bin</span>
              <span class="wxp-label--w10" hidden>Recycle Bin</span>
            </button>
          </div>
          <div
            class="wxp-explorer is-closed"
            data-wxp-pictures-window
            role="dialog"
            aria-labelledby="wxp-pictures-title"
            aria-hidden="true"
            hidden
          >
            <div class="wxp-titlebar">
              <span class="wxp-title" id="wxp-pictures-title">
                <span class="wxp-label--classic">My Pictures</span>
                <span class="wxp-label--w10" hidden>Pictures</span>
              </span>
              <button type="button" class="wxp-ctrl" data-wxp-pictures-close title="Close" aria-label="Close">×</button>
            </div>
            <div class="wxp-explorer-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>F</u>avorites</span><span><u>T</u>ools</span><span><u>H</u>elp</span>
            </div>
            <div class="wxp-explorer-toolbar" aria-hidden="true">
              <span class="wxp-explorer-tool">Back</span>
              <span class="wxp-explorer-tool">Forward</span>
              <span class="wxp-explorer-tool">Up</span>
              <span class="wxp-explorer-sep">|</span>
              <span class="wxp-explorer-tool">Views</span>
            </div>
            <div class="wxp-explorer-address" aria-hidden="true">
              <span>Address</span>
              <div class="wxp-explorer-path wxp-path--classic">C:\\Documents and Settings\\Chris\\My Documents\\My Pictures</div>
              <div class="wxp-explorer-path wxp-path--w10" hidden>This PC \\ Chris \\ Pictures</div>
              <span class="wxp-explorer-go">Go</span>
            </div>
            <div class="wxp-pictures" data-wxp-pictures>
              <div class="wxp-pictures-stage">
                <img data-wxp-preview alt="" draggable="false" />
              </div>
              <div class="wxp-pictures-meta">
                <span data-wxp-pic-name></span>
                <span data-wxp-pic-count></span>
              </div>
              <div class="wxp-pictures-strip">
                <button type="button" class="wxp-pictures-nav" data-wxp-pic-prev aria-label="Previous picture">‹</button>
                <div class="wxp-pictures-thumbs" data-wxp-thumbs tabindex="0" role="listbox" aria-label="Picture filmstrip"></div>
                <button type="button" class="wxp-pictures-nav" data-wxp-pic-next aria-label="Next picture">›</button>
              </div>
            </div>
          </div>
          <div
            class="wxp-firefox is-closed"
            data-wxp-firefox-window
            data-ie-web20
            role="dialog"
            aria-labelledby="wxp-firefox-title"
            aria-hidden="true"
            hidden
          >
            <div class="wxp-titlebar ff-titlebar">
              <span class="ff-app-ico" aria-hidden="true"></span>
              <span class="wxp-title" id="wxp-firefox-title" data-ie-title>Neopets - Mozilla Firefox</span>
              <div class="ff-win-controls">
                <span class="ff-win-btn" title="Minimize" aria-hidden="true">_</span>
                <button
                  type="button"
                  class="ff-win-btn"
                  data-wxp-firefox-maximize
                  title="Maximize"
                  aria-label="Maximize"
                  aria-pressed="false"
                >□</button>
                <button type="button" class="wxp-ctrl" data-wxp-firefox-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="ff-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>G</u>o</span><span><u>B</u>ookmarks</span><span><u>T</u>ools</span><span><u>H</u>elp</span>
            </div>
            <div class="ff-navtoolbar" aria-hidden="true">
              <div class="ff-nav-btns">
                <button type="button" class="ff-nav-btn ff-nav-btn--back" disabled title="Back"><span class="ff-nav-ico"></span><span class="ff-nav-label">Back</span></button>
                <button type="button" class="ff-nav-btn ff-nav-btn--fwd" disabled title="Forward"><span class="ff-nav-ico"></span></button>
                <button type="button" class="ff-nav-btn ff-nav-btn--reload" disabled title="Reload"><span class="ff-nav-ico"></span></button>
                <button type="button" class="ff-nav-btn ff-nav-btn--stop" disabled title="Stop"><span class="ff-nav-ico"></span></button>
                <button type="button" class="ff-nav-btn ff-nav-btn--home" disabled title="Home"><span class="ff-nav-ico"></span></button>
              </div>
              <div class="ff-location">
                <span class="ff-loc-label">Location</span>
                <div class="ff-loc-field" data-ie-addr>http://www.neopets.com/</div>
                <span class="ff-go" title="Go">▶</span>
              </div>
              <div class="ff-search" title="Google">
                <span class="ff-search-g" aria-hidden="true">G</span>
                <span class="ff-search-field">Google</span>
              </div>
            </div>
            <div class="ie-tabs ff-tabs" data-ie-tabs role="tablist" aria-label="Web 2.0 years"></div>
            <div class="ie-page ff-page" data-ie-page></div>
            <div class="ff-statusbar" aria-hidden="true">
              <span data-ie-status>Done</span>
              <span class="ff-status-zone"></span>
            </div>
          </div>
          <div class="wxp-start-menu" data-wxp-start-menu hidden aria-hidden="true">
            <div class="wxp-start-banner" aria-hidden="true">
              <span class="wxp-start-user">Chris</span>
            </div>
            <ul class="wxp-start-list" role="menu">
              <li>
                <button type="button" class="wxp-start-btn" data-wxp-firefox-open role="menuitem">
                  <span class="wxp-start-ico wxp-start-ico--ff" aria-hidden="true"></span>
                  <span>Mozilla Firefox</span>
                </button>
              </li>
              <li>
                <button type="button" class="wxp-start-btn" data-wxp-pictures-open role="menuitem">
                  <span class="wxp-start-ico wxp-start-ico--pics" aria-hidden="true"></span>
                  <span class="wxp-label--classic">My Pictures</span>
                  <span class="wxp-label--w10" hidden>Pictures</span>
                </button>
              </li>
              <li class="wxp-start-sep" aria-hidden="true"></li>
              <li>
                <button type="button" class="wxp-start-btn is-shutdown" data-wxp-shutdown role="menuitem">
                  <span class="wxp-start-ico wxp-start-ico--power" aria-hidden="true"></span>
                  <span>Shut Down…</span>
                </button>
              </li>
            </ul>
          </div>
          <div
            class="wxp-window is-shutdown is-closed"
            data-wxp-shutdown-dlg
            role="dialog"
            aria-labelledby="wxp-shutdown-title"
            aria-hidden="true"
            hidden
          >
            <div class="wxp-titlebar">
              <span class="wxp-title" id="wxp-shutdown-title">Shut Down Windows</span>
              <button type="button" class="wxp-ctrl" data-wxp-shutdown-close title="Close" aria-label="Close">×</button>
            </div>
            <div class="wxp-shutdown-client">
              <p class="wxp-shutdown-lead">What do you want the computer to do?</p>
              <label class="wxp-shutdown-option is-selected">
                <input type="radio" name="wxp-shutdown-choice" value="shutdown" checked />
                <span>Shut down</span>
              </label>
              <p class="wxp-shutdown-hint">Turn off the PC — then the living-room consoles.</p>
              <div class="wxp-shutdown-actions">
                <button type="button" class="wxp-btn" data-wxp-shutdown-ok>OK</button>
                <button type="button" class="wxp-btn" data-wxp-shutdown-close>Cancel</button>
              </div>
            </div>
          </div>
          <div
            class="wxp-poweroff"
            data-wxp-poweroff
            hidden
            aria-hidden="true"
            role="presentation"
            aria-label="Television static — press Space when ready for PlayStation 2"
          >
            <div class="wxp-tv-static" aria-hidden="true">
              <div class="wxp-tv-static-noise"></div>
              <div class="wxp-tv-static-scan"></div>
              <div class="wxp-tv-static-roll"></div>
              <div class="wxp-tv-static-vignette"></div>
            </div>
          </div>
          <div class="wxp-taskbar">
            <button type="button" class="wxp-start" data-wxp-start title="Start" aria-haspopup="true" aria-expanded="false">
              <span class="wxp-start-orb" aria-hidden="true">
                <img class="wxp-start-flag" src="/assets/winxp-ui/icons/start-flag-22.png" alt="" width="18" height="18" draggable="false" />
              </span>
              <span class="wxp-start-label wxp-label--classic">start</span>
              <span class="wxp-start-label wxp-label--w10" hidden>Start</span>
            </button>
            <button type="button" class="wxp-task" data-wxp-firefox-task data-wxp-firefox-open hidden>
              Mozilla Firefox
            </button>
            <button type="button" class="wxp-task" data-wxp-pictures-task data-wxp-pictures-open hidden>
              <span class="wxp-label--classic">My Pictures</span>
              <span class="wxp-label--w10" hidden>Pictures</span>
            </button>
            <div class="wxp-tray">
              <span class="wxp-clock" aria-hidden="true">3:01 PM</span>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "consoles",
      kind: "consoles",
      chapter: "origin",
      note: "LIVING ROOM · PS2 — After XP Shut Down → black → slow TV static → Space → PS2 splash/boot.\n\nPS2-only hub (Xbox / GBA SP cut):\n  1. Splash · PS2 logo (assets/ps2/ps2-logo.png) then boot towers (started from XP Space handoff)\n  2. System Browser menu · Browser → print campaigns\n  3. Shutdown → black screen → glowing Apple logo → #timewarp (empty OS X desktop + dock; click 09 to open the games timeline)\n\nADVANCE — Soft gate:\n  • Entered after Space / Next on the XP static beat — does not auto-boot from laptop alone\n  • XP handoff calls startSystem() so splash → boot runs; Next / Space / click advances boot → menu\n  • Next from menu can skip directly ahead\n  • Browser opens ads; Shutdown plays the Apple beat before Timewarp desktop\n  • From Browser: Back → menu; Next → #timewarp; ←/→ scrub the ad strip\n  • ←/→ / ↑/↓ never leave the hub (stay put outside Browser)\n  • Apple beat auto-leaves; Shift+Arrow escapes\n\nWeb 2.0 kid-web tabs live on XP as Mozilla Firefox (go('web20') / Story 6).\n\nAds: assets/ps2/ads/ via PS2_ADS — Browser opens a near-fullscreen vertical snap scroll.\nUI recipe: ps2ui-main (MIT homage — no Sony assets). Sipnsplain.go('consoles').",
      html: `
        <div class="ps2-hub" data-consoles data-ps2>
          <div class="ps2-phase ps2-splash" data-ps2-splash>
            <img
              class="ps2-splash__logo"
              src="/assets/ps2/ps2-logo.png"
              alt="PlayStation 2"
              width="1024"
              height="305"
              draggable="false"
            />
            <p class="ps2-splash__cue">Press to start</p>
          </div>
          <div class="ps2-phase ps2-boot" data-ps2-boot>
            <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
            <div class="ps2-boot__towers" data-ps2-towers aria-hidden="true"></div>
            <div class="ps2-boot__comets" aria-hidden="true">
              <span class="ps2-boot__comet ps2-boot__comet--a"></span>
              <span class="ps2-boot__comet ps2-boot__comet--b"></span>
              <span class="ps2-boot__comet ps2-boot__comet--c"></span>
              <span class="ps2-boot__comet ps2-boot__comet--d"></span>
            </div>
            <div class="ps2-boot__wordmark">Sony Computer Entertainment</div>
            <p class="ps2-boot__skip">Click to skip</p>
          </div>
          <div class="ps2-phase ps2-sys" data-ps2-menu>
            <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
            <div class="ps2-sys__stage">
              <div class="ps2-sys__orbs" aria-hidden="true">
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
                <span class="ps2-sys__orb"></span>
              </div>
              <div class="ps2-sys__list" role="menu">
                <button type="button" class="ps2-sys__item is-selected" data-ps2-menu-item data-ps2-open-browser role="menuitem">Browser</button>
                <button type="button" class="ps2-sys__item" data-ps2-menu-item data-ps2-shutdown role="menuitem">Shutdown</button>
              </div>
            </div>
          </div>
          <div class="ps2-phase ps2-browser" data-ps2-browser>
            <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
            <div class="ps2-browser__bar">
              <h2 class="ps2-browser__title">Browser · Print campaigns</h2>
              <div class="ps2-browser__actions">
                <button type="button" class="ps2-browser__btn" data-ps2-browser-back>Back</button>
              </div>
            </div>
            <div class="ps2-browser__panel">
              <div class="ps2-browser__strip" data-ps2-strip hidden>
                <div class="ps2-browser__track" data-ps2-track></div>
              </div>
              <div class="ps2-browser__empty" data-ps2-empty>
                <div>
                  <p class="ps2-browser__empty-kicker">Memory Card /ads</p>
                  <p>Drop PS2 print ads into <code>assets/ps2/ads/</code> and list them in <code>PS2_ADS</code>.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="ps2-phase ps2-shutdown" data-ps2-shutdown-screen aria-label="Starting Timewarp">
            <div class="ps2-shutdown__halo" aria-hidden="true"></div>
            <svg class="ps2-shutdown__mark" viewBox="0 0 512 512" role="img" aria-label="Apple logo">
              <path d="M349.8 277.5c-.2-45.8 37.4-67.9 39.1-69-21.1-30.8-53.8-35-65.5-35.5-27.9-2.8-54.5 16.4-68.6 16.4-14.5 0-36.4-16.1-60-15.6-30.4.5-58.8 18.1-74.4 45.3-32.2 55.8-8.2 137.8 22.7 182.9 15.5 22.1 33.6 46.8 57.3 45.9 23.2-1 31.9-14.8 59.9-14.8 27.7 0 35.9 14.8 60.1 14.3 24.9-.4 40.6-22.2 55.6-44.5 17.9-25.3 25.1-50.3 25.4-51.6-.6-.2-51.4-19.6-51.6-77.8zM331.5 142.2c12.5-15.7 21-37.1 18.6-58.7-18.1.8-40.7 12.5-53.7 27.9-11.5 13.5-21.8 35.7-19.1 56.5 20.4 1.5 41.3-10.3 54.2-25.7z"/>
            </svg>
          </div>
        </div>
      `,
    },
    // Games-first default path skips blank #continue + empty age-8/11/14.
    // Year specs remain in yearsPS / yearsAS; re-spread via photoChaptersFrom if Story needs them.
    // Web 2.0 kid-web (Neopets→Moshi Monsters) lives on #winxp as Mozilla Firefox — not a linear slide.
    {
      id: "timewarp",
      kind: "timewarp",
      chapter: "finale",
      note: "TIMEWARP · OS X DESKTOP → GAMES TIMELINE — Entered from PS2 Shutdown → Apple logo. Lands as an empty Mountain Lion desktop (Andromeda wallpaper · menu bar · glass dock with year icons). No cards until you click a dock year — talk beat: click 09 (FarmVille / 2009) to open the scrub.\n\nMountain Lion shell via mac-osx-lion-theme-master (MIT). FarmVille → … → Mario Kart World (17 beats).\n\nLENS — each card badges Design-led (green) vs Campaign-led (amber). Card face shows short the_moment (line-clamped); why_it_landed stays in data for talk notes. Images: assets/timewarp/ via timewarp-data.js.\n\nADVANCE — Soft gate (talk-friendly):\n  • Idle desktop: ←/→ / Space / Next stay put (do not auto-open cards); Shift+Arrow escapes\n  • Click dock 09 (or any year tile) to start the card track at that year\n  • After start: ←/→ (Space / Next = →) cycle cards; hold ←/→ to scrub; dock years jump\n  • At the 2025 card, Continue → #make-impossible (Switch 2 cue) → Next → #source-reveal\n\nWhy here: PS2 living room (2001) → Apple mark → Mac home → 2009 FarmVille → … → 2025. Sipnsplain.go('timewarp') · Story hotkey 8.",
      html: `
        <div class="timewarp-room ml-desktop tw-idle" data-timewarp data-tw-idle="1">
          <header class="ml-head" aria-hidden="true">
            <nav class="ml-menu">
              <ul>
                <li class="apple"><span>Apple</span></li>
                <li class="here"><span>Timewarp</span></li>
                <li><span>File</span></li>
                <li><span>Edit</span></li>
                <li><span>View</span></li>
                <li><span>Go</span></li>
                <li><span>Window</span></li>
                <li><span>Help</span></li>
              </ul>
            </nav>
            <nav class="ml-menu-dx">
              <ul>
                <li class="wireless"><span>Wi‑Fi</span></li>
                <li class="time">
                  <span class="tw-progress" data-timewarp-progress aria-live="polite"></span>
                  <span class="ml-clock">Fri 7:36 AM</span>
                </li>
              </ul>
            </nav>
          </header>
          <div class="ml-stage">
            <div
              class="tw-track"
              data-timewarp-track
              role="list"
              aria-label="Game timeline 2009 to 2025"
            ></div>
          </div>
          <div class="dock ml-dock tw-bar">
            <ul class="ml-dock__shelf">
              <li class="ml-dock__years">
                <div class="tw-years" data-timewarp-years aria-label="Jump to year"></div>
              </li>
              <li class="ml-dock__sep" aria-hidden="true"></li>
              <li class="ml-dock__continue">
                <button type="button" class="tw-continue" data-timewarp-continue>Continue</button>
              </li>
            </ul>
          </div>
        </div>
      `,
    },
    {
      id: "make-impossible",
      kind: "type",
      chapter: "finale",
      mode: "void",
      note: "SWITCH 2 CUE — After Timewarp Continue, before source-reveal credits. Hold for the turn: \"I think it's time to play a game. Bring in the Nintendo Switch 2.\" Then Next / Space → #source-reveal.\n\nERA: 2026 AI-native peak. The room has watched the interface evolve from scrapbook → OS → game → social → flat → design-tool → this. The journey of the chrome IS the AI thesis.",
      html: `
        <div class="chapter-center finale-void finale-cue" style="position:absolute;inset:0;border-radius:0">
          <div class="finale-cue__panel">
            <p class="finale-cue__meta">// one last level</p>
            <p class="finale-cue__line">I think it’s time to play a game.</p>
            <p class="finale-cue__line">Bring in the Nintendo Switch 2.</p>
            <p class="finale-cue__prompt">Press any key to continue<span class="finale-cue__cursor" aria-hidden="true">_</span></p>
          </div>
        </div>
      `,
    },
    {
      id: "source-reveal",
      kind: "finale",
      chapter: "finale",
      note: "SOURCE REVEAL — Experience peels open: structure, assets, prompts. Meta without saying \"two years ago.\" Show curiosity, not magic. Play again? → boot → Win95 desktop. Score until 0.",
      html: `
        <div class="chapter-center finale-void" style="position:absolute;inset:0" data-finale-root>
          <div class="source-peel is-open" data-source-peel>
            <div class="source-scroll">
              <div class="source-scroll__track">
                <pre data-source-body></pre>
                <figure class="source-scroll__photo">
                  <img
                    src="/assets/finale/credits-photo.jpg"
                    alt="Three kids around a home CRT computer"
                    width="768"
                    height="1024"
                    draggable="false"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      `,
    },
  ];
}
