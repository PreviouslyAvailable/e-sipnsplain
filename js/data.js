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

/** Paint app markup — lives inside #win95 as a Start-menu app (not a chapter). */
function paintAppHtml() {
  return `
          <div class="w95-window is-paint is-closed" data-w95-paint role="dialog" aria-labelledby="paint-title" aria-hidden="true">
            <div class="paint-app" data-paint>
              <div class="paint-titlebar">
                <span class="paint-app-icon" aria-hidden="true"><img src="/assets/icons/w95/paint-app.png" alt="" width="16" height="16" draggable="false" /></span>
                <span class="paint-title" id="paint-title">untitled - Paint</span>
                <div class="paint-controls">
                  <span class="paint-ctrl" title="Minimize" aria-hidden="true"><i class="pc-min"></i></span>
                  <span class="paint-ctrl" title="Restore" aria-hidden="true"><i class="pc-restore"></i></span>
                  <button type="button" class="paint-ctrl is-close" data-paint-close title="Close" aria-label="Close">
                    <i class="pc-x"></i>
                  </button>
                </div>
              </div>
              <div class="paint-menubar">
                <span aria-hidden="true"><u>F</u>ile</span>
                <span aria-hidden="true"><u>E</u>dit</span>
                <span aria-hidden="true"><u>V</u>iew</span>
                <span aria-hidden="true"><u>I</u>mage</span>
                <span aria-hidden="true"><u>O</u>ptions</span>
                <button type="button" class="paint-menu-help" data-paint-help-open><u>H</u>elp</button>
              </div>
              <div class="paint-body">
                <aside class="paint-tools-col">
                  <div class="paint-toolbox">
                    <button type="button" class="paint-tool" data-paint-tool="lasso" tabindex="-1" title="Free-Form Select"><span class="pt pt-lasso"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="select" tabindex="-1" title="Select"><span class="pt pt-select"></span></button>
                    <button type="button" class="paint-tool is-on" data-paint-tool="eraser" tabindex="-1" title="Eraser"><span class="pt pt-eraser"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="fill" tabindex="-1" title="Fill With Color"><span class="pt pt-fill"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="drop" tabindex="-1" title="Pick Color"><span class="pt pt-drop"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="zoom" tabindex="-1" title="Magnifier"><span class="pt pt-zoom"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="pencil" tabindex="-1" title="Pencil"><span class="pt pt-pencil"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="brush" tabindex="-1" title="Brush"><span class="pt pt-brush"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="spray" tabindex="-1" title="Airbrush"><span class="pt pt-spray"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="text" tabindex="-1" title="Text"><span class="pt pt-text"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="line" tabindex="-1" title="Line"><span class="pt pt-line"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="curve" tabindex="-1" title="Curve"><span class="pt pt-curve"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="rect" tabindex="-1" title="Rectangle"><span class="pt pt-rect"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="poly" tabindex="-1" title="Polygon"><span class="pt pt-poly"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="oval" tabindex="-1" title="Ellipse"><span class="pt pt-oval"></span></button>
                    <button type="button" class="paint-tool" data-paint-tool="round" tabindex="-1" title="Rounded Rectangle"><span class="pt pt-round"></span></button>
                  </div>
                  <div class="paint-tool-opts" title="Eraser size" data-paint-opts>
                    <span class="paint-spray-size is-on" data-spray-size="8"></span>
                    <span class="paint-spray-size s2" data-spray-size="14"></span>
                    <span class="paint-spray-size s3" data-spray-size="22"></span>
                  </div>
                </aside>
                <div class="paint-canvas-col">
                  <div class="paint-canvas-scroll">
                    <div class="paint-canvas" data-paint-surface>
                      <img
                        class="paint-secret"
                        data-paint-secret
                        src="/assets/paint-secret.png"
                        alt=""
                        draggable="false"
                      />
                      <canvas class="paint-draw" data-paint-draw width="960" height="640" aria-label="Paint canvas — erase the white to reveal a photo"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="paint-palette">
                <div class="paint-swatch-pair">
                  <span class="paint-fg" data-paint-fg></span>
                  <span class="paint-bg"></span>
                </div>
                <div class="paint-swatches" data-paint-swatches>
                  <button type="button" style="--c:#000000" data-paint-color="#000000" title="Black"></button>
                  <button type="button" style="--c:#808080" data-paint-color="#808080" title="Gray"></button>
                  <button type="button" style="--c:#800000" data-paint-color="#800000" title="Maroon"></button>
                  <button type="button" style="--c:#808000" data-paint-color="#808000" title="Olive"></button>
                  <button type="button" style="--c:#008000" data-paint-color="#008000" title="Green"></button>
                  <button type="button" style="--c:#008080" data-paint-color="#008080" title="Teal"></button>
                  <button type="button" style="--c:#000080" data-paint-color="#000080" title="Navy"></button>
                  <button type="button" style="--c:#800080" data-paint-color="#800080" title="Purple"></button>
                  <button type="button" style="--c:#808040" data-paint-color="#808040" title="Khaki"></button>
                  <button type="button" style="--c:#004040" data-paint-color="#004040" title="Dark teal"></button>
                  <button type="button" style="--c:#0080ff" data-paint-color="#0080ff" title="Azure"></button>
                  <button type="button" style="--c:#004080" data-paint-color="#004080" title="Steel"></button>
                  <button type="button" style="--c:#8000ff" data-paint-color="#8000ff" title="Violet"></button>
                  <button type="button" style="--c:#804000" data-paint-color="#804000" title="Brown"></button>
                  <button type="button" style="--c:#ffffff" data-paint-color="#ffffff" title="White"></button>
                  <button type="button" style="--c:#c0c0c0" data-paint-color="#c0c0c0" title="Silver"></button>
                  <button type="button" style="--c:#ff0000" data-paint-color="#ff0000" title="Red"></button>
                  <button type="button" style="--c:#ffff00" data-paint-color="#ffff00" title="Yellow"></button>
                  <button type="button" style="--c:#00ff00" data-paint-color="#00ff00" title="Lime"></button>
                  <button type="button" style="--c:#00ffff" data-paint-color="#00ffff" title="Cyan"></button>
                  <button type="button" style="--c:#0000ff" data-paint-color="#0000ff" title="Blue"></button>
                  <button type="button" style="--c:#ff00ff" data-paint-color="#ff00ff" title="Magenta"></button>
                  <button type="button" style="--c:#ffff80" data-paint-color="#ffff80" title="Light yellow"></button>
                  <button type="button" style="--c:#00ff80" data-paint-color="#00ff80" title="Mint"></button>
                  <button type="button" style="--c:#80ffff" data-paint-color="#80ffff" title="Sky"></button>
                  <button type="button" style="--c:#8080ff" data-paint-color="#8080ff" title="Periwinkle"></button>
                  <button type="button" style="--c:#ff0080" data-paint-color="#ff0080" title="Pink"></button>
                  <button type="button" style="--c:#ff8040" data-paint-color="#ff8040" title="Orange"></button>
                </div>
              </div>
              <div class="paint-statusbar" aria-hidden="true">
                <span class="paint-status-help" data-paint-status>Eraser — drag to reveal the photo under the white.</span>
                <span class="paint-status-coords" data-paint-coords></span>
                <span class="paint-status-size"></span>
              </div>
              <div class="paint-help-dialog is-closed" data-paint-help role="dialog" aria-labelledby="paint-help-title" aria-hidden="true">
                <div class="paint-help-titlebar">
                  <span id="paint-help-title">Paint Help</span>
                  <button type="button" class="paint-ctrl is-close" data-paint-help-close aria-label="Close help"><i class="pc-x"></i></button>
                </div>
                <div class="paint-help-body">
                  <p>Erase the white to reveal a photo. Close (×) returns to the desktop.</p>
                  <p class="paint-help-hint">GAG: photo under white cover — swap <code>/assets/paint-secret.png</code>. Eraser punches holes; spray / brush still paint on top.</p>
                  <p class="paint-help-hint">Tip: the airbrush was always the favourite.</p>
                  <button type="button" class="paint-btn" data-paint-help-close>OK</button>
                </div>
              </div>
            </div>
          </div>`;
}

export function buildChapters() {
  return [
    {
      id: "win95",
      kind: "win95",
      chapter: "origin",
      note: "HUB · WINDOWS 95 DESKTOP — Section 1. Default entry after boot overlay. Not a slide deck title; this desktop IS home.\n\nSECTION 1 PROGRESS — Required to unlock Windows Update:\n  Paint + Recycle Bin + Minesweeper (all three).\nWhen required set is done → desktop \"WINDOWS 98SE\" boot-disk floppy appears (hero) + tray \"Windows Update\" badge (secondary) → click either → \"Downloading Windows 98…\" interstitial → Continue → #win98 (Section 2). Floppy persists on hub revisit while unlocked & unconsumed.\n\nBEAT HOOKS\n· Paint [OWN]: erase ~8%+ of white cover → Paint complete (photo reveal).\n· Recycle Bin [OWN]: open baby photo → Recycle complete → leaving photo (× / other app / Empty) swaps to empty bin icon; persists.\n· Minesweeper [OWN]: clear board → reward photo in grid → Minesweeper complete.\n\nROOM BEAT · Open/close windows like a real machine:\n· readme.txt (desktop) → Notepad gag · OK / × close (stay). My Computer is muted décor.\n· Recycle Bin → photo (y01-01). × closes → bin empties (completion mark; persists).\n· Start → Paint (erase white → reveal /assets/paint-secret.png).\n· Start → Entertainment Pack Two → Minesweeper.\n· Shut Down… → harmless gag dialog (no crash / no lives).\n· The Internet → IE + 1998 Google. × closes. \"I'm feeling lucky\" is a gag only (early logo) — does NOT skip Section 1 or land on #win98.\n\nADVANCE — Floppy / update flow only (required beats → floppy or tray → interstitial → #win98). → / Space blocked until Section 1 update consumed. Shift+Arrow escapes.\n\nSkiFree and Space Cadet pinball live on #win98 (Section 2), not here.\n\nHomage refs: win95-desktop-ref.png, paint-win95-ref.png, google-1998-ref.png. Boot disk: assets/win95/windows-98se-boot-disk.png. ERA: body[data-era=1995].",
      html: `
        <div class="w95-desktop" data-w95>
          <div class="w95-icons">
            <button type="button" class="w95-icon is-muted" data-w95-muted title="My Computer">
              <img class="w95-icon-glyph" src="/assets/icons/w95/my-computer.png" alt="" width="32" height="32" draggable="false" />
              <span>My Computer</span>
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
            <button type="button" class="w95-icon is-hot" data-w95-internet title="The Internet">
              <img class="w95-icon-glyph" src="/assets/icons/w95/internet.png" alt="" width="32" height="32" draggable="false" />
              <span>The Internet</span>
            </button>
            <button type="button" class="w95-icon" data-w95-open title="readme.txt">
              <img class="w95-icon-glyph" src="/assets/icons/w95/notepad-txt.png" alt="" width="32" height="32" draggable="false" />
              <span>readme.txt</span>
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
          <div class="g98-browser w95-window is-closed" data-w95-net role="dialog" aria-labelledby="w95-net-title" aria-hidden="true">
            <div class="w95-titlebar g98-titlebar">
              <span class="w95-title" id="w95-net-title" data-g98-title>The Internet — Google!</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w95-net-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="g98-menubar" aria-hidden="true">
              <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>G</u>o</span><span><u>H</u>elp</span>
            </div>
            <div class="g98-toolbar" aria-hidden="true">
              <span class="g98-tb-btn">Back</span>
              <span class="g98-tb-btn">Forward</span>
              <span class="g98-tb-btn">Stop</span>
              <span class="g98-tb-btn">Refresh</span>
              <span class="g98-tb-btn">Home</span>
            </div>
            <div class="g98-address" aria-hidden="true">
              <span class="g98-addr-label">Address</span>
              <div class="g98-addr-field">http://google.stanford.edu/</div>
            </div>
            <div class="g98-page" data-g98-page>
              <div class="g98-band">
                <div class="g98-logo-stage">
                  <h1 class="g98-logo" data-g98-google aria-label="Google!">
                    <span class="c-b">G</span><span class="c-r">o</span><span class="c-y">o</span><span class="c-b">g</span><span class="c-g">l</span><span class="c-r">e</span><span class="c-b">!</span>
                  </h1>
                  <div
                    class="g98-backrub"
                    data-g98-backrub
                    hidden
                    role="button"
                    tabindex="0"
                    aria-label="BackRub — click to return to Google"
                    title="Click to return to Google"
                  >
                    <img
                      class="g98-backrub-img"
                      src="/assets/refs/backrub-logo-trans.png"
                      alt="BackRub"
                      width="1024"
                      height="229"
                      draggable="false"
                    />
                  </div>
                  <div class="g98-early" data-g98-early hidden aria-label="Early Google logo">
                    <img
                      class="g98-early-img"
                      src="/assets/refs/google-early-3d.png"
                      alt="Early 3D Google logo"
                      width="300"
                      height="150"
                      draggable="false"
                    />
                  </div>
                </div>
                <p class="g98-tag" data-g98-tag>Search the web using Google!</p>
                <form class="g98-form" data-google98-form onsubmit="return false">
                  <input class="g98-input" type="text" value="what was google first called" readonly tabindex="-1" aria-label="Search query" />
                  <div class="g98-row">
                    <select class="g98-select" tabindex="-1" aria-hidden="true"><option>10 results</option></select>
                    <button type="button" class="g98-btn" data-g98-search>Google Search</button>
                    <button type="button" class="g98-btn" data-g98-lucky>I'm feeling lucky</button>
                  </div>
                </form>
                <p class="g98-index" data-g98-index><em>Index contains ~25 million pages (soon to be much bigger)</em></p>
              </div>
              <div class="g98-mid">
                <p class="g98-about"><a href="#" tabindex="-1" onclick="return false">About Google!</a></p>
                <p class="g98-subs">
                  <a href="#" tabindex="-1" onclick="return false">Stanford Search</a>
                  &nbsp;&nbsp;
                  <a href="#" tabindex="-1" onclick="return false">Linux Search</a>
                </p>
              </div>
              <div class="g98-band g98-band-foot">
                <p>Get Google! updates monthly!</p>
                <p class="g98-copy">Copyright ©1997-8 Stanford University · homage recreation</p>
              </div>
            </div>
            <div class="g98-statusbar" aria-hidden="true">
              <span>Done</span>
              <span>Internet</span>
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
              <span>16×16 · 10 mines · clear → photo in grid</span>
              <span>Entertainment Pack</span>
            </div>
          </div>
${paintAppHtml()}
          <div class="w95-start-menu" data-w95-start-menu hidden aria-hidden="true">
            <div class="w95-start-banner" aria-hidden="true"><span>Windows</span>95</div>
            <ul class="w95-start-list" role="menu">
              <li>
                <button type="button" class="w95-start-btn" data-w95-paint-open role="menuitem">
                  <img class="w95-start-ico" src="/assets/icons/w95/start-paint.png" alt="" width="16" height="16" draggable="false" />
                  <span>Paint</span>
                </button>
              </li>
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
            <button type="button" class="w95-task" data-w95-task="net" data-w95-internet hidden title="The Internet">The Internet</button>
            <button type="button" class="w95-task" data-w95-task="mine" data-w95-mine-open hidden title="Minesweeper">Minesweeper</button>
            <button type="button" class="w95-task" data-w95-task="paint" data-w95-paint-open hidden title="Paint">Paint</button>
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
      note: "SECTION 2 · WINDOWS 98 — Landed from Section 1 update interstitial (\"Downloading Windows 98…\").\n\nDESKTOP HUB — ui-98 Microsoft Sans Serif + classic gray chrome (assets/win98-ui + css/win98-kit.css).\n\nREQUIRED BEATS (all three) → arms Y2K → XP:\n· SKIFREE — ski to ~1000m → yeti → Game Over photo → completeBeat('skifree').\n· PINBALL — trivial score (Space/flipper) or Open era photo → completeBeat('pinball').\n· DESKTOP THEMES → Chris, 2000 (typically last) → completeBeat('chris2000') → arms clock takeover.\n\nY2K SEQUENCE (auto after arm): tray clock drift→speed-up→sprint → date rollover 1 Jan 2000 → midnight → cosmetic BSOD → reboot → CD install “Installing Windows XP…” → #winxp + Bliss + startup chime.\n\nEra badge: Windows 98 hub. Presenter: Sipnsplain.go('win95'|'win98'|'winxp').",
      html: `
        <div class="w98-desktop" data-w98 data-w98-theme="default">
          <div class="w98-icons">
            <button type="button" class="w98-icon is-muted" data-w98-icon="computer" title="My Computer (coming soon)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/computer.png" alt="" width="32" height="32" draggable="false" />
              <span>My Computer</span>
            </button>
            <button type="button" class="w98-icon is-muted" data-w98-icon="network" title="Network Neighborhood (coming soon)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/network.png" alt="" width="32" height="32" draggable="false" />
              <span>Network Neighborhood</span>
            </button>
            <button type="button" class="w98-icon is-muted" data-w98-icon="bin" title="Recycle Bin (coming soon)">
              <img class="w98-icon-glyph" src="/assets/icons/w98/recycle-empty.png" alt="" width="32" height="32" draggable="false" />
              <span>Recycle Bin</span>
            </button>
            <button type="button" class="w98-icon" data-w98-themes-open title="Control Panel — Desktop Themes">
              <img class="w98-icon-glyph" src="/assets/icons/w98/control-panel.png" alt="" width="32" height="32" draggable="false" />
              <span>Control Panel</span>
            </button>
            <button type="button" class="w98-icon" data-w98-pinball-open title="3D Pinball for Windows - Space Cadet">
              <img class="w98-icon-glyph" src="/assets/icons/w98/pinball.png" alt="" width="32" height="32" draggable="false" />
              <span>Space Cadet</span>
            </button>
            <button type="button" class="w98-icon" data-w98-ski-open title="SkiFree">
              <img class="w98-icon-glyph" src="/assets/icons/w98/ski.png" alt="" width="32" height="32" draggable="false" />
              <span>SkiFree</span>
            </button>
            <button type="button" class="w98-icon is-boot-disk" data-w98-update data-w98-boot-disk hidden title="Windows XP — an update is available">
              <img class="w98-icon-glyph" src="/assets/icons/w98/floppy.png" alt="" width="32" height="32" draggable="false" />
              <span>WINDOWS XP</span>
            </button>
          </div>
          <div class="w95-window w98-welcome" data-w98-welcome role="dialog" aria-labelledby="w98-welcome-title">
            <div class="w95-titlebar">
              <span class="w95-title" id="w98-welcome-title">Welcome - Windows 98</span>
              <div class="w95-controls">
                <span class="w95-ctrl" aria-hidden="true">_</span>
                <span class="w95-ctrl" aria-hidden="true">□</span>
                <button type="button" class="w95-ctrl is-close" data-w98-welcome-close title="Close" aria-label="Close">×</button>
              </div>
            </div>
            <div class="w98-welcome-body">
              <p class="w98-welcome-lead">You made it past Windows Update. This is the <strong>Windows 98</strong> hub — try <strong>Desktop Themes</strong>, <strong>Space Cadet</strong>, or <strong>SkiFree</strong>.</p>
              <p class="w98-welcome-meta">Section 2 · Themes foreshadow re-skins · Chris, 2000 unlocks XP.</p>
              <div class="w98-welcome-actions">
                <button type="button" class="w98-kit-btn" data-w98-themes-open>Desktop Themes</button>
                <button type="button" class="w98-kit-btn" data-w98-pinball-open>Play Space Cadet</button>
                <button type="button" class="w98-kit-btn" data-w98-ski-open>Play SkiFree</button>
                <button type="button" class="w98-kit-btn" data-w98-continue disabled title="Try Desktop Themes first">Continue…</button>
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
              <span class="w95-title" id="w98-chris-photo-title">C:\\WINDOWS\\THEMES\\chris-2000.bmp</span>
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
              <img class="w95-photo-img" data-w98-chris-photo-img src="/assets/chris-2000.png" alt="Chris, 2000 — swap assets/chris-2000.png" />
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
                  src="/assets/skifree-reward.png"
                  alt="SkiFree era reward — swap assets/skifree-reward.png"
                />
              </div>
            </div>
            <div class="w95-statusbar">
              <span data-w98-ski-status>↓ Finish @ ~1000m · Esc closes</span>
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
              <img class="w95-photo-img" src="/assets/skifree-reward.png" alt="SkiFree era reward — swap assets/skifree-reward.png" />
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
                <button type="button" class="w95-pinball-reveal" data-pinball-reveal>
                  Open era photo…
                </button>
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
                    <button type="button" class="w98-start-btn" data-w98-themes-open role="menuitem">
                      <img class="w98-start-ico" src="/assets/icons/w98/start-themes.png" alt="" width="16" height="16" draggable="false" />
                      <span>Desktop Themes</span>
                    </button>
                  </li>
                </ul>
              </li>
              <li class="w98-start-sep" aria-hidden="true"></li>
              <li>
                <button type="button" class="w98-start-btn" data-w98-welcome-open role="menuitem">
                  <img class="w98-start-ico" src="/assets/icons/w98/start-continue.png" alt="" width="16" height="16" draggable="false" />
                  <span>Welcome</span>
                </button>
              </li>
              <li data-w98-update-menu hidden>
                <button type="button" class="w98-start-btn is-update" data-w98-update role="menuitem">
                  <img class="w98-start-ico" src="/assets/icons/w98/start-update.png" alt="" width="16" height="16" draggable="false" />
                  <span>Windows Update</span>
                </button>
              </li>
              <li>
                <button type="button" class="w98-start-btn" data-w98-continue role="menuitem" disabled title="Try Desktop Themes first">
                  <img class="w98-start-ico" src="/assets/icons/w98/start-continue.png" alt="" width="16" height="16" draggable="false" />
                  <span>Continue…</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="w98-taskbar">
            <button type="button" class="w98-start" data-w98-start title="Start" aria-haspopup="true" aria-expanded="false">
              <span class="w98-start-logo" aria-hidden="true"></span>
              Start
            </button>
            <button type="button" class="w98-task" data-w98-task="welcome" data-w98-welcome-open title="Welcome - Windows 98">Welcome</button>
            <button type="button" class="w98-task" data-w98-task="themes" data-w98-themes-open hidden title="Desktop Themes">Themes</button>
            <button type="button" class="w98-task" data-w98-task="pinball" data-w98-pinball-open hidden title="3D Pinball for Windows - Space Cadet">3D Pinball</button>
            <button type="button" class="w98-task" data-w98-task="ski" data-w98-ski-open hidden title="SkiFree">SkiFree</button>
            <button type="button" class="w98-task" data-w98-task="skiphoto" data-w98-ski-photo-task hidden title="reward.bmp">skifree.bmp</button>
            <button type="button" class="w98-task" data-w98-task="pinballphoto" data-pinball-photo-task hidden title="reward.bmp">pinball.bmp</button>
            <button type="button" class="w98-task" data-w98-task="chrisphoto" data-w98-chris-photo-task hidden title="chris-2000.bmp">chris-2000.bmp</button>
            <button type="button" class="w98-task" data-w98-task="datetime" data-w98-datetime-task hidden title="Date/Time Properties">Date/Time</button>
            <div class="w98-tray">
              <button
                type="button"
                class="w98-update-badge"
                data-w98-update
                hidden
                title="Windows Update — Windows XP is available"
                aria-label="Windows Update available"
              >
                <img class="w98-update-ico" src="/assets/icons/w98/tray-update.png" alt="" width="16" height="16" draggable="false" />
                <span class="w98-update-pulse" aria-hidden="true"></span>
              </button>
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
      note: "SECTION 3 · WINDOWS XP — Landed from Section 2 Y2K sequence (clock → BSOD → reboot → CD install).\n\nBliss-homage wallpaper + startup chime. Full Luna/Figma kit still staged at assets/winxp-ui.\nPresenter: Sipnsplain.go('winxp').",
      html: `
        <div class="wxp-desktop is-bliss" data-wxp>
          <div class="wxp-icons">
            <button type="button" class="wxp-icon is-muted" title="My Computer (coming soon)">
              <img class="wxp-icon-glyph" src="/assets/icons/wxp/my-computer.png" alt="" width="32" height="32" draggable="false" />
              <span>My Computer</span>
            </button>
            <button type="button" class="wxp-icon is-muted" title="Recycle Bin (coming soon)">
              <img class="wxp-icon-glyph" src="/assets/icons/wxp/recycle-empty.png" alt="" width="32" height="32" draggable="false" />
              <span>Recycle Bin</span>
            </button>
          </div>
          <div class="wxp-welcome" data-wxp-welcome role="dialog" aria-labelledby="wxp-welcome-title">
            <div class="wxp-titlebar">
              <span class="wxp-title" id="wxp-welcome-title">Welcome - Windows XP</span>
              <button type="button" class="wxp-ctrl" data-wxp-welcome-close title="Close" aria-label="Close">×</button>
            </div>
            <div class="wxp-welcome-body">
              <p class="wxp-welcome-lead"><strong>Windows XP</strong> — Y2K was overblown. You made it. Section 3 starts here.</p>
              <p class="wxp-welcome-meta">Unlocked via SkiFree · Pinball · Chris, 2000 · #winxp</p>
            </div>
          </div>
          <div class="wxp-taskbar">
            <button type="button" class="wxp-start" title="Start">
              <span class="wxp-start-orb" aria-hidden="true"></span>
              start
            </button>
            <button type="button" class="wxp-task is-pressed" data-wxp-welcome-open>Welcome</button>
            <div class="wxp-tray">
              <span class="wxp-clock" aria-hidden="true">3:01 PM</span>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: "continue",
      kind: "type",
      chapter: "origin",
      note: "Legacy blank stage after hubs. Prefer #win98 / #winxp for section hubs. Sparse on purpose.",
      html: `
        <div class="chapter-center">
          <p class="line muted" style="opacity:0.55">Continue…</p>
        </div>
      `,
    },
    ...photoChaptersFrom(
      yearsPS.filter((y) => y.age === 8),
      "P.S."
    ),
    ...photoChaptersFrom(
      yearsPS.filter((y) => y.age === 11),
      "P.S."
    ),
    ...photoChaptersFrom(
      yearsAS.filter((y) => y.age === 14),
      "A.S."
    ),
    {
      id: "make-impossible",
      kind: "type",
      chapter: "finale",
      mode: "void",
        note: "FINALE LINE — Hold. \"Make something impossible.\" Don't rush. Next peels open the source. Not \"Thanks.\"\n\nERA: 2026 AI-native peak. The room has watched the interface evolve from scrapbook → OS → game → social → flat → design-tool → this. The journey of the chrome IS the AI thesis.",
      html: `
        <div class="chapter-center finale-void" style="position:absolute;inset:0;border-radius:0">
          <p class="finale-line is-slam">Make something impossible.</p>
        </div>
        <footer class="footer" style="position:relative;z-index:1">
          <span class="label" style="color:rgba(248,250,252,0.35)">The argument was the medium</span>
          <span class="label" style="color:rgba(248,250,252,0.35)">→</span>
        </footer>
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
              <pre data-source-body></pre>
            </div>
            <div class="source-meta">
              <p class="display">Not magic. A browser tab.</p>
              <p class="line muted" style="color:rgba(248,250,252,0.55);max-width:28ch">HTML · CSS · JS · assets · prompts · one curious person</p>
              <button type="button" class="play-again" data-play-again>Run it again?</button>
              <p class="keys-hint" style="color:rgba(248,250,252,0.35)">+ / = score · − deduct · 0 reset · M mute · A mission · S score · N notes · Y moment · F fullscreen · [ ] photos</p>
            </div>
          </div>
        </div>
        <footer class="footer" style="position:relative;z-index:4">
          <span class="label" style="color:rgba(248,250,252,0.35)">Source as curiosity</span>
          <span class="label" style="color:rgba(248,250,252,0.35)">Chris Edwards 2026</span>
        </footer>
      `,
    },
  ];
}
