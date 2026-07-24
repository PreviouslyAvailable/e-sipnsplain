/**
 * Sip'n'Splain experience engine — chapters / levels, not slide chrome.
 */

import {
  STORAGE_KEY,
  SCORE_KEY,
  MUTE_KEY,
  CHAPTER_META,
  buildChapters,
} from "./data.js";
import {
  eraForChapter,
  bandMeta,
  eraTransitionNote,
  AGE_THEMES,
  PHOTO_AGE_COUNT,
  themeForAge,
  layoutForAge,
  layoutForChapter,
} from "./eras.js";
import { buildSlideMap, slideIdentity } from "./slides-index.js";
import { renderShellHTML } from "./photoShells.js";
import { createAiAnalysis } from "./moments/ai-analysis.js";
import { createCrtBoot } from "./moments/crt-boot.js";
import { createAdaptive } from "./moments/adaptive.js";
import { createAmbient } from "./moments/ambient.js";
import { createSfx } from "./moments/sfx.js";
import { createFinale } from "./moments/finale.js";
import { createBoot } from "./moments/boot.js";
import { createSkiFree } from "./moments/skifree.js";
import { createPinball } from "./moments/pinball.js";
import { createMinesweeper } from "./moments/minesweeper.js";
import {
  W98_THEMES,
  CHRIS_1999_PHOTO,
  applyW98Theme,
  getW98Theme,
} from "./moments/w98-themes.js";
import { mountGbcScrapbook } from "./moments/gbc-scrapbook.js";
import { mountAtariStrip } from "./moments/atari-strip.js";
import { ATARI_ADS, GBC_ADS, GAMECUBE_ADS, PS2_ADS, WEB20_TABS } from "./moments/ad-manifests.js";
import { createProgress } from "./progress.js";
import { createTransition } from "./transition.js";
import { createY2kTransition } from "./moments/y2k-transition.js";
import { mountXpPictures } from "./moments/xp-pictures.js";
import { mountIeWeb20 } from "./moments/ie-web20.js";
import { mountTimewarp } from "./moments/timewarp.js";
import { TIMEWARP_ITEMS } from "./moments/timewarp-data.js";
import { mountPs2 } from "./moments/ps2.js";

export function createEngine(root = document) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const chapters = buildChapters();
  const slideMap = buildSlideMap(chapters);

  const deck = root.getElementById("deck");
  const progressEl = root.getElementById("progress");
  const notesEl = root.getElementById("notes");
  const slideIndexEl = root.getElementById("slideIndex");
  const scoreVal = root.getElementById("scoreVal");
  const scorePill = root.getElementById("scorePill");
  const storyMenuEl = root.getElementById("storyMenu");
  const storyMenuListEl = root.getElementById("storyMenuList");

  let index = 0;
  let chromeTimer;
  let score = 0;
  let muted = false;
  let storyMenuOpen = false;
  try { muted = localStorage.getItem(MUTE_KEY) === "1"; } catch {}
  let currentEra = null;
  let veilEl = null;
  const missionVisible = new Set();

  const hooks = {
    // —— Phase 2+ scaffolds (stubs) ——
    /** @type {null | ((spokenNotes: string) => Promise<string>)} */
    liveAttentionQuestion: null,
    /** @type {null | ((img: HTMLImageElement) => Promise<object[]>)} */
    realVisionDetect: null,
    /** @type {null | ((chapterId: string) => void)} */
    photoshopMode: null,
    /** @type {null | ((chapterId: string) => void)} */
    figmaMode: null,
    /** @type {null | ((question: string) => void)} */
    qaGrowPages: null,
    /** @type {null | (() => void)} */
    voiceCaptions: null,
    /** @type {null | (() => void)} */
    webglParticles: null,
    // runtime signals
    onAiAnalysisComplete: null,
    onCrtComplete: null,
    onAudienceChange: null,
    onAmbientStart: null,
    onChapterEnter: null,
    onEraChange: null,
    onBootComplete: null,
  };

  const api = {
    chapters,
    slides: slideMap,
    hooks,
    reduceMotion,
    eras: AGE_THEMES,
    photoAgeCount: PHOTO_AGE_COUNT,
    get index() { return index; },
    get score() { return score; },
    get muted() { return muted; },
    get era() { return currentEra; },
    go: (i) => show(i),
    next: () => next(),
    prev: () => prev(),
    blip: (k) => blip(k),
    sfx: null,
    toast: (msg) => {
      if (notesEl && document.body.classList.contains("show-notes")) {
        notesEl.textContent = `${notesEl.textContent}\n\n· ${msg}`;
      }
    },
    getActiveChapter: () => chapters[index],
    getSlideRef: () => slideIdentity(chapters[index], index, chapters.length),
    /** Story-arc jump points for presenter menu / Sipnsplain.arc */
    storyArc: () => storyArcPoints(),
    goArc: (pointId) => goArc(pointId),
    toggleStoryMenu: (force) => toggleStoryMenu(force),
    getFlags: () => ({
      audience: adaptive.getAudience(),
      score,
      muted,
      era: currentEra,
      slide: index + 1,
      slideId: chapters[index]?.id,
      section: progress.getActiveSectionId(),
      progress: progress.requiredStatus(),
      checkpoint: progress.getCheckpointChapterId(),
    }),
  };

  const sfx = createSfx({
    getMuted: () => muted,
    reduceMotion,
    volume: 0.7,
  });
  api.sfx = sfx;

  const aiAnalysis = createAiAnalysis(api);
  const crtBoot = createCrtBoot(api);
  const adaptive = createAdaptive(api);
  const ambient = createAmbient(api);
  const finale = createFinale();
  const boot = createBoot(api);
  const progress = createProgress({
    onUnlock: (sectionId) => {
      // Section 3 has no next-OS gate — never toast / interstitial.
      if (sectionId === "section3") return;
      syncSectionUpdateUi(sectionId);
      blip("updateUnlock");
      if (sectionId === "section2") {
        // Chris, 1999 unlock arms Y2K from commitTheme — no floppy toast.
      } else {
        api.toast?.(
          `Update available · ${progress.getSectionDef(sectionId)?.label || sectionId}`
        );
      }
    },
    onChange: () => {
      syncSectionUpdateUi();
    },
  });
  const transition = createTransition({
    reduceMotion,
    blip,
  });
  const y2k = createY2kTransition({
    reduceMotion,
    getMuted: () => muted,
    blip,
    sfx,
  });
  /** @type {ReturnType<typeof setTimeout> | null} */
  let y2kArmTimer = null;

  api.moments = { aiAnalysis, crtBoot, adaptive, ambient, finale, boot, sfx, y2k };
  api.boot = boot;
  api.progress = progress;
  api.transition = transition;
  api.y2k = y2k;

  /* —— Section progress / Windows Update affordance (floppy + tray) —— */
  function syncSectionUpdateUi(sectionId) {
    const syncHub = (sel, updateSel, menuSel, sid) => {
      const unlocked =
        progress.isUpdateUnlocked(sid) && !progress.isUpdateConsumed(sid);
      deck.querySelectorAll(sel).forEach((desktop) => {
        desktop.classList.toggle("has-update", unlocked);
        desktop.querySelectorAll(updateSel).forEach((btn) => {
          btn.hidden = !unlocked;
        });
        desktop.querySelectorAll(menuSel).forEach((li) => {
          li.hidden = !unlocked;
        });
      });
    };
    if (!sectionId || sectionId === "section1") {
      syncHub("[data-w95]", "[data-w95-update]", "[data-w95-update-menu]", "section1");
    }
    // Section 2: no XP floppy / tray update affordance — Y2K starts from
    // Desktop Themes → Chris, 1999. Keep any leftover update UI hidden.
    if (!sectionId || sectionId === "section2") {
      deck.querySelectorAll("[data-w98]").forEach((desktop) => {
        desktop.classList.remove("has-update");
        desktop.querySelectorAll("[data-w98-update]").forEach((btn) => {
          btn.hidden = true;
        });
        desktop.querySelectorAll("[data-w98-update-menu]").forEach((li) => {
          li.hidden = true;
        });
      });
    }
  }

  function finishSectionUpdate(sectionId) {
    const def = progress.getSectionDef(sectionId);
    if (!def) return;
    progress.consumeUpdate(sectionId);
    const nextId = def.transition.nextChapterId;
    const nextIndex = chapters.findIndex((c) => c.id === nextId);
    // Only mark the section that actually finished — don't unlock Win98
    // advance when Section 1's update is consumed (or vice versa).
    if (sectionId === "section1") {
      deck.querySelectorAll(".chapter.mode-win95").forEach((ch) => {
        ch.classList.add("w95-unlocked", "quiz-solved");
      });
    } else if (sectionId === "section2") {
      deck.querySelectorAll(".chapter.mode-win98").forEach((ch) => {
        ch.classList.add("w98-unlocked", "quiz-solved");
      });
    }
    syncSectionUpdateUi(sectionId);
    if (nextIndex >= 0) show(nextIndex);
    else next();
    // XP startup chime after Bliss desktop lands (gesture already unlocked).
    if (def.transition.nextChapterId === "winxp") {
      requestAnimationFrame(() => {
        blip("xpStartup");
      });
    }
  }

  function showInstallInterstitial(sectionId) {
    const def = progress.getSectionDef(sectionId);
    if (!def) return;
    const t = def.transition;
    closeWin95StartMenus();
    closeWin98StartMenus();
    transition.show({
      copy: t.copy,
      title: t.interstitialType === "install-cd" ? "Windows XP Setup" : "Windows Update",
      progressStyle: t.progressStyle,
      interstitialType: t.interstitialType || "download",
      mediaAsset: t.mediaAsset,
      onPreload: () => {
        y2k.preloadXpAssets();
        sfx.preloadUrl?.("/assets/audio/winxp/startup.wav");
        sfx.preloadUrl?.("/assets/winxp-ui/win10pack/audio/notify.wav");
      },
      onContinue: () => finishSectionUpdate(sectionId),
    });
  }

  function beginY2kTransition() {
    if (y2kArmTimer != null) {
      clearTimeout(y2kArmTimer);
      y2kArmTimer = null;
    }
    if (!progress.isUpdateUnlocked("section2")) return false;
    if (progress.isUpdateConsumed("section2")) return false;
    if (y2k.isRunning || transition.isOpen) return false;

    const desktop = deck.querySelector(".chapter.active [data-w98]")
      || deck.querySelector("[data-w98]");
    const clockEl = desktop?.querySelector(".w98-clock") || null;

    closeWin98StartMenus();
    desktop?._w98StopClock?.();

    return y2k.start({
      clockEl,
      stopRealClock: () => desktop?._w98StopClock?.(),
      onTick: (d) => desktop?._w98SyncDateTime?.(d),
      onInstall: () => showInstallInterstitial("section2"),
    });
  }

  function scheduleY2kTransition() {
    if (y2kArmTimer != null) clearTimeout(y2kArmTimer);
    if (progress.isUpdateConsumed("section2")) return;
    y2kArmTimer = setTimeout(() => {
      y2kArmTimer = null;
      beginY2kTransition();
    }, reduceMotion ? 200 : 1200);
  }

  /**
   * Presenter: force the 98→XP Y2K sequence.
   * Rearms section2 so this works after a prior install consumed the update
   * (Sipnsplain.go('y2k') already did; startY2k was a silent no-op).
   */
  api.startY2k = () => {
    const required =
      progress.getSectionDef("section2")?.unlock?.allOf || ["chris1999"];
    for (const beatId of required) {
      progress.completeBeat(beatId, { sectionId: "section2" });
    }
    progress.rearmUpdate("section2");
    return beginY2kTransition();
  };
  /** Presenter: force / undo the Win10-on-XP pack gag on the live XP desktop. */
  api.applyWin10Pack = () => applyWin10PackAll();
  api.resetWin10Pack = () => resetWin10PackAll();

  function openSectionUpdate(sectionId = progress.getActiveSectionId()) {
    const def = progress.getSectionDef(sectionId);
    if (!def || !progress.isUpdateUnlocked(sectionId)) return false;
    if (progress.isUpdateConsumed(sectionId)) return false;

    // Section 2: Y2K clock → BSOD → reboot → CD install (not a plain download bar).
    if (sectionId === "section2" && def.transition?.withDeath) {
      if (y2k.isRunning) return true;
      return beginY2kTransition();
    }

    closeWin95StartMenus();
    closeWin98StartMenus();
    showInstallInterstitial(sectionId);
    return true;
  }

  function closeWin95StartMenus() {
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      const startMenu = desktop.querySelector("[data-w95-start-menu]");
      const startBtn = desktop.querySelector("[data-w95-start]");
      if (!startMenu || startMenu.hidden) return;
      startMenu.hidden = true;
      startMenu.setAttribute("aria-hidden", "true");
      startBtn?.setAttribute("aria-expanded", "false");
      startBtn?.classList.remove("is-pressed");
    });
  }

  function closeWin98StartMenus() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      const startMenu = desktop.querySelector("[data-w98-start-menu]");
      const startBtn = desktop.querySelector("[data-w98-start]");
      if (!startMenu || startMenu.hidden) return;
      startMenu.hidden = true;
      startMenu.setAttribute("aria-hidden", "true");
      startBtn?.setAttribute("aria-expanded", "false");
      startBtn?.classList.remove("is-pressed");
    });
  }

  function completeSectionBeat(beatId, info = {}) {
    return progress.completeBeat(beatId, info);
  }

  /* —— audio (central SFX; Mute + reduced-motion respected in sfx.js) —— */
  function blip(kind) {
    sfx.play(kind);
  }

  /** Keep Recycle Bin full/empty in sync with Section 1 progress (persist across revisit). */
  function applyRecycleGlyphState(glyph, empty) {
    glyph.classList.toggle("is-full", !empty);
    glyph.classList.toggle("is-empty", empty);
    glyph.classList.remove("is-emptying");
    if (glyph.tagName === "IMG") {
      const fullSrc = glyph.getAttribute("data-bin-full");
      const emptySrc = glyph.getAttribute("data-bin-empty");
      if (fullSrc && emptySrc) glyph.src = empty ? emptySrc : fullSrc;
    }
  }

  function syncRecycleBins() {
    const empty = progress.isBeatComplete("recycle", "section1");
    deck.querySelectorAll("[data-w95-recycle]").forEach((btn) => {
      const glyph = btn.querySelector(".w95-icon-glyph.is-bin");
      if (!glyph) return;
      applyRecycleGlyphState(glyph, empty);
      btn.title = empty ? "Recycle Bin (empty)" : "Recycle Bin";
    });
  }

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); }
    catch { return {}; }
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function setScore(n, bump) {
    score = Math.max(0, n);
    scoreVal.textContent = String(score);
    try { localStorage.setItem(SCORE_KEY, String(score)); } catch {}
    if (bump) {
      scorePill.classList.remove("bump");
      void scorePill.offsetWidth;
      scorePill.classList.add("bump");
      blip("score");
      setTimeout(() => scorePill.classList.remove("bump"), 280);
    }
  }

  function applyMuteUI() {
    document.body.classList.toggle("is-muted", muted);
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); } catch {}
  }

  function energyForChapter(ch) {
    if (!ch) return "full";
    if (ch.chapter === "finale") return "finale";
    if (ch.chapter === "thesis") return "story";
    if (ch.kind === "photo" && ch.era === "A.S.") {
      if (ch.age <= 16) return "softening";
      return "soft";
    }
    if (ch.id === "saving-progress" || ch.id === "as-divider") return "softening";
    return "full";
  }

  function progressLabel(ch) {
    const meta = CHAPTER_META[ch.chapter] || { label: "Chapter", short: "·" };
    if (ch.kind === "photo") {
      const t = themeForAge(ch.age);
      // 31 photo chapters (ages 0–30); theme stays locked until leaving this age
      return `Photo ${ch.age + 1}/${PHOTO_AGE_COUNT} · ${t.year}`;
    }
    return `${meta.short} · ${meta.label}`;
  }

  function ensureVeil() {
    if (veilEl) return veilEl;
    veilEl = document.createElement("div");
    veilEl.className = "era-veil";
    veilEl.setAttribute("aria-hidden", "true");
    (document.getElementById("stage") || document.body).appendChild(veilEl);
    return veilEl;
  }

  /**
   * Readable veil when leaving one year's theme for the next.
   * Multi-photo stacks within the same age share one theme — no re-veil.
   */
  function playEraTransition(fromEra, toEra) {
    if (reduceMotion || fromEra === toEra || !fromEra) return;
    const veil = ensureVeil();
    const meta = bandMeta(toEra);
    const veilMap = {
      flash: { cls: "is-flash", ms: 560 },
      morph: { cls: "is-morph", ms: 720 },
      pageload: { cls: "is-pageload", ms: 720 },
      cart: { cls: "is-cart", ms: 900 },
      petsite: { cls: "is-petsite", ms: 780 },
      island: { cls: "is-island", ms: 880 },
      lcd: { cls: "is-lcd", ms: 820 },
      touch: { cls: "is-touch", ms: 700 },
      ghost: { cls: "is-ghost", ms: 740 },
      ai: { cls: "is-ai", ms: 760 },
    };
    const pick = veilMap[meta.veil] || veilMap.morph;

    veil.className = "era-veil";
    void veil.offsetWidth;
    veil.classList.add(pick.cls);
    blip(meta.veil === "cart" || meta.veil === "flash" || meta.veil === "lcd" ? "slam" : "press");
    setTimeout(() => {
      veil.className = "era-veil";
    }, pick.ms);
  }

  /**
   * Lock chrome to the active chapter's year theme.
   * Photo ages: theme = that age's year until navigation leaves the age.
   */
  function applyEra(ch, { animate } = {}) {
    const nextEra = eraForChapter(ch);
    const meta = bandMeta(nextEra);
    const changed = currentEra && currentEra !== nextEra;
    // Win95 desktop hard-cut — the 1995 scrapbook "flash" veil reads as a
    // buggy CRT boot on top of teal OS chrome.
    const skipVeil =
      ch.kind === "win95" ||
      ch.kind === "paint" ||
      ch.kind === "win98" ||
      ch.kind === "winxp" ||
      ch.kind === "consoles" ||
      ch.kind === "ie" ||
      ch.kind === "timewarp";
    if (animate && changed && !skipVeil) playEraTransition(currentEra, nextEra);

    currentEra = nextEra;
    document.body.dataset.era = nextEra;
    document.body.dataset.themeFamily = meta.family || "";
    if (ch.kind === "photo") {
      document.body.dataset.age = String(ch.age);
      document.body.dataset.year = String(themeForAge(ch.age).year);
    } else if (meta.year != null) {
      delete document.body.dataset.age;
      document.body.dataset.year = String(meta.year);
    } else {
      delete document.body.dataset.age;
      delete document.body.dataset.year;
    }

    if (changed) hooks.onEraChange?.(nextEra, meta);
    return { nextEra, changed, meta };
  }

  function renderPhotoChapter(ch) {
    const el = document.createElement("section");
    const theme = themeForAge(ch.age);
    const layout = layoutForChapter(ch);
    el.className = `chapter photo-chapter is-shell layout-${layout}` + (ch.age === 30 ? " is-payoff" : "");
    el.dataset.id = ch.id;
    el.dataset.era = ch.era;
    el.dataset.layout = layout;
    if (ch.mission) el.dataset.mission = ch.mission;
    if (ch.moments?.length) el.dataset.moments = ch.moments.join(",");
    const images = ch.images || [];
    const multi = images.length > 1;
    const footerLabel = ch.age === 30
      ? "Hold for the laugh"
      : ch.era === "A.S." && ch.age >= 17
        ? (ch.age >= 29 ? "Almost…" : "Still learning computers")
        : "Tech outside · life inside";
    const ariaExtra = multi
      ? ` — ${images.length} photos, click or use bracket keys to cycle`
      : "";
    const momentHint = ch.moments?.includes("ai-analysis")
      ? "Y · AI analysis (photos 3–4)"
      : ch.moments?.includes("crt-boot")
        ? "Y · Enter the screenshot"
        : "";
    const shell = renderShellHTML({
      layout,
      chapterId: ch.id,
      age: ch.age,
      year: theme.year,
      hint: ch.hint,
      multi,
      ariaExtra,
    });
    el.innerHTML = `
      <div class="age-tag">${String(ch.age).padStart(2, "0")}</div>
      ${multi ? `<div class="part-tag" data-photo-count>1/${images.length}</div>` : ""}
      <div class="era-tag">${ch.era}</div>
      ${ch.iface ? `<div class="iface-tag">${ch.iface}</div>` : ""}
      ${ch.age === 30 ? `
        <div class="payoff-banner" aria-hidden="true">
          <span class="chip hot">Boss fight incoming</span>
          <span class="chip">???</span>
        </div>
      ` : ""}
      ${ch.mission ? `
        <div class="mission" data-mission-ui>
          <span class="chip" style="background:var(--amber);border-color:transparent">Ask the room</span>
          <div class="mission-prompt">${ch.mission}</div>
        </div>
      ` : ""}
      <div class="chapter-center">
        ${shell}
      </div>
      ${momentHint ? `<div class="moment-hint">${momentHint}</div>` : ""}
      <footer class="footer">
        <span class="label">${footerLabel}</span>
        <span class="label">Chris Edwards 2026</span>
      </footer>
    `;
    return el;
  }

  function renderTypeChapter(ch) {
    const el = document.createElement("section");
    if (ch.kind === "era") el.className = "chapter mode-era";
    else if (ch.kind === "flash") el.className = "chapter mode-flash";
    else if (ch.kind === "paint") el.className = "chapter mode-paint";
    else if (ch.kind === "win95") el.className = "chapter mode-win95";
    else if (ch.kind === "win98") el.className = "chapter mode-win98";
    else if (ch.kind === "winxp") el.className = "chapter mode-winxp";
    else if (ch.kind === "consoles") el.className = "chapter mode-consoles";
    else if (ch.kind === "ie") el.className = "chapter mode-ie";
    else if (ch.kind === "timewarp") el.className = "chapter mode-timewarp";
    else if (ch.kind === "finale" || ch.mode === "void") el.className = "chapter mode-void";
    else el.className = "chapter";
    el.dataset.id = ch.id;
    el.innerHTML = ch.html;
    return el;
  }

  function getChapterById(id) {
    return chapters.find((c) => c.id === id);
  }

  function slotCount(ch) {
    return Math.max(1, (ch.images || []).length);
  }

  function resolvePhotoSrc(ch, photoIndex) {
    const store = loadStore();
    const entry = store[ch.id];
    if (Array.isArray(entry) && entry[photoIndex]) return entry[photoIndex];
    if (typeof entry === "string" && photoIndex === 0) return entry;
    const defaults = ch.images || [];
    return defaults[photoIndex] || null;
  }

  function savePhotoOverride(chapterId, photoIndex, dataUrl) {
    const next = loadStore();
    const ch = getChapterById(chapterId);
    const slots = ch ? slotCount(ch) : Math.max(1, photoIndex + 1);
    let entry = next[chapterId];
    if (!Array.isArray(entry)) {
      const arr = new Array(slots).fill(null);
      if (typeof entry === "string") arr[0] = entry;
      entry = arr;
    }
    while (entry.length < slots) entry.push(null);
    entry[photoIndex] = dataUrl;
    next[chapterId] = entry.length === 1 ? entry[0] : entry;
    saveStore(next);
  }

  function applyPhotoToFrame(frame, ch, photoIndex, { animate } = {}) {
    const img = frame.querySelector("[data-main-img]") || frame.querySelector("img");
    const countEl = frame.closest(".photo-chapter")?.querySelector("[data-photo-count]");
    const wrap = frame.closest("[data-frame-wrap]");
    const peekImg = wrap?.querySelector("[data-peek-img]");
    const slots = slotCount(ch);
    const idx = ((photoIndex % slots) + slots) % slots;
    frame.dataset.photoIndex = String(idx);

    const src = resolvePhotoSrc(ch, idx);
    if (src) {
      img.src = src;
      frame.classList.add("has-image");
    } else {
      img.removeAttribute("src");
      frame.classList.remove("has-image");
    }

    if (countEl) countEl.textContent = `${idx + 1}/${slots}`;

    if (peekImg && slots > 1) {
      const nextIdx = (idx + 1) % slots;
      const peekSrc = resolvePhotoSrc(ch, nextIdx);
      if (peekSrc) peekImg.src = peekSrc;
      else peekImg.removeAttribute("src");
    }

    // Moment cue for AI analysis only on photos 3–4
    const photoEl = frame.closest(".photo-chapter");
    if (photoEl?.dataset.moments?.includes("ai-analysis")) {
      photoEl.classList.toggle("can-moment", idx === 2 || idx === 3);
    } else if (photoEl?.dataset.moments?.includes("crt-boot")) {
      photoEl.classList.add("can-moment");
    }

    if (animate && !reduceMotion) {
      frame.classList.remove("is-cycling");
      void frame.offsetWidth;
      frame.classList.add("is-cycling");
      setTimeout(() => frame.classList.remove("is-cycling"), 300);
    }
  }

  function cycleActivePhoto(delta) {
    const ch = chapters[index];
    if (!ch || ch.kind !== "photo") return false;
    if (slotCount(ch) < 2) return false;
    const frame = deck.querySelector(`.chapter.active .frame[data-image-id="${ch.id}"]`);
    if (!frame) return false;
    const cur = parseInt(frame.dataset.photoIndex || "0", 10);
    applyPhotoToFrame(frame, ch, cur + delta, { animate: true });
    blip("press");
    return true;
  }

  function activeFrame() {
    const ch = chapters[index];
    if (!ch || ch.kind !== "photo") return null;
    return deck.querySelector(`.chapter.active .frame[data-image-id="${ch.id}"]`);
  }

  function runActiveMoment() {
    const ch = chapters[index];
    if (!ch) return false;
    const frame = activeFrame();

    if (aiAnalysis.canRun(ch, parseInt(frame?.dataset.photoIndex || "0", 10))) {
      aiAnalysis.run(frame, parseInt(frame.dataset.photoIndex || "0", 10));
      return true;
    }
    if (crtBoot.canRun(ch)) {
      const src = frame ? resolvePhotoSrc(ch, 0) : null;
      if (src) {
        crtBoot.run(src);
        return true;
      }
    }
    return false;
  }

  function wireImages() {
    deck.querySelectorAll(".frame[data-image-id]").forEach((frame) => {
      const id = frame.dataset.imageId;
      const ch = getChapterById(id);
      if (!ch) return;

      applyPhotoToFrame(frame, ch, 0);

      const openPicker = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => applyFile(input.files?.[0]);
        input.click();
      };

      const applyFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const photoIndex = parseInt(frame.dataset.photoIndex || "0", 10);
        const reader = new FileReader();
        reader.onload = () => {
          savePhotoOverride(id, photoIndex, reader.result);
          applyPhotoToFrame(frame, ch, photoIndex, { animate: true });
          blip("correct");
        };
        reader.readAsDataURL(file);
      };

      frame.addEventListener("dragover", (e) => {
        e.preventDefault();
        frame.classList.add("dragover");
      });
      frame.addEventListener("dragleave", () => frame.classList.remove("dragover"));
      frame.addEventListener("drop", (e) => {
        e.preventDefault();
        frame.classList.remove("dragover");
        applyFile(e.dataTransfer.files?.[0]);
      });
      frame.addEventListener("click", (e) => {
        const multi = slotCount(ch) > 1;
        const hasImg = frame.classList.contains("has-image");
        if (multi && hasImg && !e.shiftKey) {
          cycleActivePhoto(1);
          return;
        }
        openPicker();
      });
      frame.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const multi = slotCount(ch) > 1;
          if (multi && frame.classList.contains("has-image") && !e.shiftKey) {
            cycleActivePhoto(1);
          } else {
            openPicker();
          }
        }
      });
    });
  }

  function wireWin95Desktop() {
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      const chapter = desktop.closest(".chapter");
      const win = desktop.querySelector("[data-w95-window]");
      const photoWin = desktop.querySelector("[data-w95-photo]");
      const ep2Win = desktop.querySelector("[data-w95-ep2]");
      const atariWin = desktop.querySelector("[data-w95-atari]");
      const mineWin = desktop.querySelector("[data-w95-mine]");
      const mcTask = desktop.querySelector('[data-w95-task="mc"]');
      const photoTask = desktop.querySelector('[data-w95-task="photo"]');
      const ep2Task = desktop.querySelector('[data-w95-task="ep2"]');
      const atariTask = desktop.querySelector('[data-w95-task="atari"]');
      const mineTask = desktop.querySelector('[data-w95-task="mine"]');
      const startBtn = desktop.querySelector("[data-w95-start]");
      const startMenu = desktop.querySelector("[data-w95-start-menu]");
      const mineCanvas = desktop.querySelector("[data-w95-mine-canvas]");

      /** @type {ReturnType<typeof createMinesweeper> | null} */
      let mineGame = null;
      /** @type {ReturnType<typeof mountAtariStrip> | null} */
      let atariStrip = null;

      const clockEl = desktop.querySelector(".w95-clock");
      /** @type {ReturnType<typeof setTimeout> | null} */
      let clockTimeout = null;
      /** @type {ReturnType<typeof setInterval> | null} */
      let clockTimer = null;

      const formatTrayTime = (date = new Date()) =>
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

      const tickClock = () => {
        if (clockEl) clockEl.textContent = formatTrayTime();
      };

      const clearClockTimers = () => {
        if (clockTimeout != null) {
          clearTimeout(clockTimeout);
          clockTimeout = null;
        }
        if (clockTimer != null) {
          clearInterval(clockTimer);
          clockTimer = null;
        }
      };

      const startClock = () => {
        clearClockTimers();
        tickClock();
        const now = new Date();
        const msToNextMinute =
          (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        clockTimeout = setTimeout(() => {
          clockTimeout = null;
          tickClock();
          clockTimer = setInterval(tickClock, 60_000);
        }, Math.max(msToNextMinute, 0));
      };

      const stopClock = () => {
        clearClockTimers();
      };

      desktop._w95StartClock = startClock;
      desktop._w95StopClock = stopClock;

      const closeStartMenu = () => {
        if (!startMenu || startMenu.hidden) return;
        startMenu.hidden = true;
        startMenu.setAttribute("aria-hidden", "true");
        startBtn?.setAttribute("aria-expanded", "false");
        startBtn?.classList.remove("is-pressed");
        desktop.querySelectorAll("[data-w95-start-flyout]").forEach((item) => {
          const fly = item.querySelector(".w95-start-flyout");
          const btn = item.querySelector(":scope > .w95-start-btn");
          if (fly) fly.hidden = true;
          btn?.setAttribute("aria-expanded", "false");
          item.classList.remove("is-open");
        });
      };

      const openStartMenu = () => {
        if (!startMenu) return;
        startMenu.hidden = false;
        startMenu.setAttribute("aria-hidden", "false");
        startBtn?.setAttribute("aria-expanded", "true");
        startBtn?.classList.add("is-pressed");
      };

      const syncRecycleIcon = () => syncRecycleBins();

      const destroyAtariStrip = () => {
        atariStrip?.destroy?.();
        atariStrip = null;
        desktop._w95AtariStrip = null;
      };

      const ensureAtariMounted = () => {
        if (!atariWin) return;
        destroyAtariStrip();
        atariStrip = mountAtariStrip(atariWin, { images: ATARI_ADS });
        desktop._w95AtariStrip = atariStrip;
      };

      /**
       * Empty-bin completion sting — full → empty icon (+ trash SFX).
       * Pass closePhoto to dismiss the rescued photo window first (empties via setActive).
       */
      const emptyRecycleBin = ({ animate = true, closePhoto = false } = {}) => {
        if (closePhoto) {
          const photoOpen =
            desktop.dataset.w95Active === "photo" ||
            (photoWin && !photoWin.classList.contains("is-closed"));
          if (photoOpen) {
            setActive(null, { silent: true });
            return;
          }
        }

        const glyphs = desktop.querySelectorAll(
          "[data-w95-recycle] .w95-icon-glyph.is-bin.is-full"
        );
        if (!glyphs.length) {
          syncRecycleIcon();
          return;
        }
        blip("recycleEmpty");
        glyphs.forEach((glyph) => {
          const btn = glyph.closest("[data-w95-recycle]");
          if (animate && !reduceMotion) {
            glyph.classList.add("is-emptying");
            setTimeout(() => {
              applyRecycleGlyphState(glyph, true);
              if (btn) btn.title = "Recycle Bin (empty)";
            }, 420);
          } else {
            applyRecycleGlyphState(glyph, true);
            if (btn) btn.title = "Recycle Bin (empty)";
          }
        });
      };

      /**
       * @param {'mc'|'photo'|'ep2'|'atari'|'mine'|null} which — one active window at a time
       * @param {{ silent?: boolean }} [opts]
       */
      const setActive = (which, opts = {}) => {
        const prev =
          desktop.dataset.w95Active && desktop.dataset.w95Active !== "none"
            ? desktop.dataset.w95Active
            : null;
        const leavingPhoto = prev === "photo" && which !== "photo";
        const willEmptyBin =
          leavingPhoto &&
          progress.isBeatComplete("recycle", "section1") &&
          Boolean(
            desktop.querySelector(
              "[data-w95-recycle] .w95-icon-glyph.is-bin.is-full"
            )
          );

        const mcOpen = which === "mc";
        const photoOpen = which === "photo";
        const ep2Open = which === "ep2";
        const atariOpen = which === "atari";
        const mineOpen = which === "mine";

        if (win) {
          win.classList.toggle("is-closed", !mcOpen);
          win.setAttribute("aria-hidden", mcOpen ? "false" : "true");
        }
        if (photoWin) {
          photoWin.classList.toggle("is-closed", !photoOpen);
          photoWin.setAttribute("aria-hidden", photoOpen ? "false" : "true");
        }
        if (ep2Win) {
          ep2Win.classList.toggle("is-closed", !ep2Open);
          ep2Win.setAttribute("aria-hidden", ep2Open ? "false" : "true");
        }
        if (atariWin) {
          atariWin.classList.toggle("is-closed", !atariOpen);
          atariWin.setAttribute("aria-hidden", atariOpen ? "false" : "true");
        }
        if (mineWin) {
          mineWin.classList.toggle("is-closed", !mineOpen);
          mineWin.setAttribute("aria-hidden", mineOpen ? "false" : "true");
        }

        if (mcTask) {
          mcTask.hidden = !mcOpen;
          mcTask.classList.toggle("is-pressed", mcOpen);
        }
        if (photoTask) {
          photoTask.hidden = !photoOpen;
          photoTask.classList.toggle("is-pressed", photoOpen);
        }
        if (ep2Task) {
          ep2Task.hidden = !ep2Open;
          ep2Task.classList.toggle("is-pressed", ep2Open);
        }
        if (atariTask) {
          atariTask.hidden = !atariOpen;
          atariTask.classList.toggle("is-pressed", atariOpen);
        }
        if (mineTask) {
          mineTask.hidden = !mineOpen;
          mineTask.classList.toggle("is-pressed", mineOpen);
        }

        if (mineGame) {
          if (mineOpen) {
            mineGame.start();
          } else {
            mineGame.stop();
          }
        }

        if (atariOpen) {
          ensureAtariMounted();
        } else if (prev === "atari") {
          destroyAtariStrip();
        }

        desktop.classList.toggle(
          "is-window-closed",
          !mcOpen && !photoOpen && !ep2Open && !atariOpen && !mineOpen
        );
        desktop.dataset.w95Active = which || "none";
        desktop._w95MineActive = mineOpen;
        desktop._w95AtariActive = atariOpen;
        desktop._w95Ep2Active = ep2Open;

        // Leaving the rescued photo empties the bin (×, another app, or Empty).
        if (willEmptyBin) emptyRecycleBin({ animate: true });

        if (!opts.silent) {
          if (which && which !== prev) blip("windowOpen");
          else if (!which && prev && !willEmptyBin) blip("windowClose");
        }
      };

      mineGame = mineCanvas
        ? createMinesweeper(mineCanvas, {
            // Clear still shows the reward photo for fun; unlock is on open.
            onWin: () => {
              completeSectionBeat("minesweeper", {
                photo: true,
                meta: { via: "clear" },
              });
            },
            onReward: () => {
              blip("beat");
              // Reward image reveals ~480ms after the win (see minesweeper.js
              // REWARD_DELAY_MS) — if the window got closed in that window,
              // force it back open so the photo still surfaces instead of
              // silently drawing to a hidden canvas (mirrors pinball/ski's
              // forced setActive on reveal).
              closeStartMenu();
              setActive("mine");
            },
            onFlag: () => blip("mineFlag"),
          })
        : null;
      desktop._w95MineGame = mineGame;

      const canAdvance = () => Boolean(chapter?.classList.contains("w95-unlocked"));

      const nudge = (el) => {
        if (!el) return;
        el.classList.remove("is-nudge");
        void el.offsetWidth;
        el.classList.add("is-nudge");
        setTimeout(() => el.classList.remove("is-nudge"), 600);
      };

      // → / Space blocked until Section 1 update consumed; nudge the real exit
      desktop._w95NudgeAdvance = () => {
        if (canAdvance()) return false;
        if (progress.isUpdateUnlocked("section1")) {
          nudge(
            desktop.querySelector("[data-w95-boot-disk]:not([hidden])") ||
              desktop.querySelector("[data-w95-update]:not([hidden])")
          );
          return true;
        }
        // Point at whichever required open is still missing
        if (!progress.isBeatComplete("atari", "section1")) {
          nudge(desktop.querySelector("[data-w95-atari-open]"));
        } else {
          nudge(
            desktop.querySelector("[data-w95-start]") ||
              desktop.querySelector("[data-w95-mine-open]")
          );
        }
        return true;
      };

      /** Esc / arrows when Minesweeper, Atari, EP2, or Start menu is active */
      desktop._w95HandleKey = (e) => {
        if (!startMenu?.hidden && e.key === "Escape") {
          e.preventDefault();
          closeStartMenu();
          return true;
        }
        const shutdownDlg = desktop.querySelector("[data-w95-shutdown-dlg]");
        if (
          shutdownDlg &&
          !shutdownDlg.classList.contains("is-closed") &&
          e.key === "Escape"
        ) {
          e.preventDefault();
          shutdownDlg.classList.add("is-closed");
          shutdownDlg.setAttribute("aria-hidden", "true");
          blip("windowClose");
          return true;
        }
        if (desktop._w95AtariActive) {
          if (e.key === "Escape") {
            e.preventDefault();
            setActive(null);
            return true;
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            atariStrip?.scrollByPage?.(-1);
            return true;
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            atariStrip?.scrollByPage?.(1);
            return true;
          }
        }
        if (desktop._w95Ep2Active && e.key === "Escape") {
          e.preventDefault();
          setActive(null);
          return true;
        }
        if (desktop._w95MineActive) {
          if (e.key === "Escape") {
            e.preventDefault();
            setActive(null);
            return true;
          }
          if (mineGame?.handleDeckKey?.(e)) return true;
        }
        // Minesweeper / Atari open — never let deck ←/→/↑/↓/PageUp/PageDown/Space
        // fall through to next()/prev() while playing / scrolling ads.
        if (
          (desktop._w95MineActive || desktop._w95AtariActive) &&
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            " ",
            "Spacebar",
          ].includes(e.key)
        ) {
          e.preventDefault();
          return true;
        }
        return false;
      };

      /** Hard reload to first-entry window state (clean desktop). Section progress untouched. */
      const resetWin95 = () => {
        // Keep w95-unlocked only after Section 1 update was consumed
        const keepUnlock = progress.isUpdateConsumed("section1");
        chapter?.classList.toggle("w95-unlocked", keepUnlock);
        chapter?.classList.toggle("quiz-solved", keepUnlock);
        desktop.querySelectorAll(".is-wrong, .is-nudge").forEach((el) => {
          el.classList.remove("is-wrong", "is-nudge");
        });
        closeStartMenu();
        destroyAtariStrip();
        setActive(null, { silent: true });
        const shutdownDlg = desktop.querySelector("[data-w95-shutdown-dlg]");
        if (shutdownDlg) {
          shutdownDlg.classList.add("is-closed");
          shutdownDlg.setAttribute("aria-hidden", "true");
        }
        mineGame?.reset();
        syncSectionUpdateUi("section1");
        syncRecycleIcon();
      };

      /**
       * Soft enter on hub revisit — sync progress chrome; close Atari/EP2
       * and destroy the strip. Preserve Minesweeper / readme / photo mid-beat.
       */
      const enterWin95 = () => {
        const keepUnlock = progress.isUpdateConsumed("section1");
        chapter?.classList.toggle("w95-unlocked", keepUnlock);
        chapter?.classList.toggle("quiz-solved", keepUnlock);
        destroyAtariStrip();
        const cur = desktop.dataset.w95Active;
        if (cur === "atari" || cur === "ep2") {
          setActive(null, { silent: true });
        }
        syncSectionUpdateUi("section1");
        syncRecycleIcon();
      };

      desktop._resetWin95 = resetWin95;
      desktop._w95Enter = enterWin95;

      // Initial: clean desktop — all windows closed; bin empty if beat already done
      resetWin95();

      const closePhotoWindow = () => setActive(null);

      desktop.querySelectorAll("[data-w95-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
        });
      });

      desktop.querySelectorAll("[data-w95-photo-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closePhotoWindow();
        });
      });

      desktop.querySelectorAll("[data-w95-ep2-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
        });
      });

      desktop.querySelectorAll("[data-w95-atari-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
        });
      });

      desktop.querySelectorAll("[data-w95-mine-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
        });
      });

      desktop.querySelectorAll("[data-w95-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("mc");
        });
      });

      desktop.querySelectorAll("[data-w95-my-computer]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("ep2");
        });
      });

      photoTask?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        setActive("photo");
      });

      desktop.querySelectorAll("[data-w95-atari-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("atari");
          completeSectionBeat("atari", { meta: { via: "open" } });
          syncSectionUpdateUi("section1");
        });
      });

      desktop.querySelectorAll("[data-w95-recycle]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("photo");
          const { newly } = completeSectionBeat("recycle", {
            photo: true,
            meta: { via: "open" },
          });
          // Photo reveal chime on first rescue; reopen is just windowOpen from setActive
          if (newly) blip("photo");
        });
      });

      // Right-click: Empty Recycle Bin — deletes the photo window + swaps to empty icon
      desktop.querySelectorAll("[data-w95-recycle]").forEach((btn) => {
        btn.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!progress.isBeatComplete("recycle", "section1")) {
            // Not rescued yet — open the photo first
            btn.click();
            return;
          }
          const stillFull = btn.querySelector(".w95-icon-glyph.is-bin.is-full");
          if (stillFull) emptyRecycleBin({ animate: true, closePhoto: true });
          else blip("press");
        });
      });

      desktop.querySelectorAll("[data-w95-mine-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          // Prefer close EP2 when Mine opens (setActive is single-window)
          setActive("mine");
          completeSectionBeat("minesweeper", { meta: { via: "open" } });
          syncSectionUpdateUi("section1");
        });
      });

      startBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (startMenu && !startMenu.hidden) {
          closeStartMenu();
          blip("press");
        } else {
          openStartMenu();
          blip("startMenu");
        }
      });

      desktop.querySelectorAll("[data-w95-start-flyout]").forEach((item) => {
        const btn = item.querySelector(":scope > .w95-start-btn");
        const fly = item.querySelector(".w95-start-flyout");
        const openFly = () => {
          desktop.querySelectorAll("[data-w95-start-flyout]").forEach((other) => {
            if (other === item) return;
            other.classList.remove("is-open");
            const f = other.querySelector(".w95-start-flyout");
            const b = other.querySelector(":scope > .w95-start-btn");
            if (f) f.hidden = true;
            b?.setAttribute("aria-expanded", "false");
          });
          item.classList.add("is-open");
          if (fly) fly.hidden = false;
          btn?.setAttribute("aria-expanded", "true");
        };
        btn?.addEventListener("mouseenter", openFly);
        btn?.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openFly();
          blip("press");
        });
      });

      desktop.addEventListener("pointerdown", (e) => {
        if (startMenu?.hidden) return;
        if (e.target.closest("[data-w95-start-menu], [data-w95-start]")) return;
        closeStartMenu();
      });

      desktop.querySelectorAll("[data-w95-shutdown]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          const dlg = desktop.querySelector("[data-w95-shutdown-dlg]");
          if (dlg) {
            dlg.classList.remove("is-closed");
            dlg.setAttribute("aria-hidden", "false");
            blip("windowOpen");
          } else {
            blip("press");
            api.toast?.("Nice try. This talk stays on.");
          }
        });
      });

      desktop.querySelectorAll("[data-w95-shutdown-ok], [data-w95-shutdown-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const dlg = desktop.querySelector("[data-w95-shutdown-dlg]");
          if (dlg) {
            dlg.classList.add("is-closed");
            dlg.setAttribute("aria-hidden", "true");
            blip("windowClose");
          }
        });
      });

      // Windows Update — floppy (hero), tray badge, Start menu (Section 1 gate)
      desktop.querySelectorAll("[data-w95-update]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          if (!openSectionUpdate("section1")) return;
          // Soft click for boot-disk icon; tray/Start keep transition sting
          blip(btn.hasAttribute("data-w95-boot-disk") ? "windowOpen" : "transition");
        });
      });

      // Restore floppy + tray if Section 1 already unlocked (session resume)
      syncSectionUpdateUi("section1");
      syncRecycleIcon();
    });
  }

  function win95BlocksAdvance() {
    const active = deck.querySelectorAll(".chapter")[index];
    return Boolean(
      active?.classList.contains("mode-win95") &&
        !active.classList.contains("w95-unlocked")
    );
  }

  function win98BlocksAdvance() {
    const active = deck.querySelectorAll(".chapter")[index];
    return Boolean(
      active?.classList.contains("mode-win98") &&
        !active.classList.contains("w98-unlocked")
    );
  }

  function winxpBlocksAdvance() {
    const active = deck.querySelectorAll(".chapter")[index];
    if (!active?.classList.contains("mode-winxp")) return false;
    // Power-off beat is ready — Next should leave to #consoles.
    if (active.classList.contains("wxp-powering-off")) return false;
    return true;
  }

  function consolesBlocksAdvance() {
    const active = deck.querySelectorAll(".chapter")[index];
    return Boolean(
      active?.classList.contains("mode-consoles") &&
        !active.classList.contains("consoles-done")
    );
  }

  function timewarpBlocksAdvance() {
    const active = deck.querySelectorAll(".chapter")[index];
    return Boolean(
      active?.classList.contains("mode-timewarp") &&
        !active.classList.contains("timewarp-done")
    );
  }

  /**
   * @param {{ startSystem?: boolean }} [opts]
   * startSystem — after XP Space on static, kick PS2 splash → boot.
   */
  function goToConsoles(opts = {}) {
    const startSystem = Boolean(opts.startSystem);
    const i = chapters.findIndex((c) => c.id === "consoles");
    if (i >= 0) show(i);
    else show(index + 1);
    if (!startSystem) return;
    requestAnimationFrame(() => {
      deck.querySelectorAll(".chapter.active [data-consoles]").forEach((room) => {
        room._consolesStartSystem?.();
      });
    });
  }

  /** Deep-link / Story · Web 2.0 → XP Bliss + open Mozilla Firefox. */
  function goToWeb20() {
    const i = chapters.findIndex((c) => c.id === "winxp");
    if (i < 0) return;
    show(i);
    requestAnimationFrame(() => {
      deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
        desktop._wxpOpenFirefox?.();
      });
    });
  }

  function goToTimewarp() {
    const i = chapters.findIndex((c) => c.id === "timewarp");
    if (i >= 0) show(i);
    else show(index + 1);
  }

  function goToFinale() {
    const i = chapters.findIndex((c) => c.id === "make-impossible");
    if (i >= 0) show(i);
    else show(index + 1);
  }

  function goToSourceReveal() {
    const i = chapters.findIndex((c) => c.id === "source-reveal");
    if (i >= 0) show(i);
    else show(index + 1);
  }

  function resetWin95Desktop() {
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      desktop._resetWin95?.();
    });
  }

  /** Soft hub enter — preserve open windows / in-progress games. */
  function enterWin95Desktop() {
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      if (typeof desktop._w95Enter === "function") desktop._w95Enter();
      else desktop._resetWin95?.();
    });
  }

  function resetWin98Desktop() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      desktop._resetWin98?.();
    });
  }

  function enterWin98Desktop() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      if (typeof desktop._w98Enter === "function") desktop._w98Enter();
      else desktop._resetWin98?.();
    });
  }

  /** Section 2 hub — kit-styled desktop + GBC (required) + optional Ski/Pinball/Themes. */
  function wireWin98Desktop() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      const chapter = desktop.closest(".chapter");
      const gbcWin = desktop.querySelector("[data-w98-gbc]");
      const gatesWin = desktop.querySelector("[data-w98-gates]");
      const gatesBsod = desktop.querySelector("[data-w98-gates-bsod]");
      const themesWin = desktop.querySelector("[data-w98-themes]");
      const chrisPhotoWin = desktop.querySelector("[data-w98-chris-photo]");
      const pinballWin = desktop.querySelector("[data-pinball]");
      const pinballPhotoWin = desktop.querySelector("[data-pinball-photo]");
      const skiWin = desktop.querySelector("[data-w98-ski]");
      const skiPhotoWin = desktop.querySelector("[data-w98-ski-photo]");
      const gbcTask = desktop.querySelector('[data-w98-task="gbc"]');
      const gatesTask = desktop.querySelector('[data-w98-task="gates"]');
      const themesTask = desktop.querySelector('[data-w98-task="themes"]');
      const chrisPhotoTask = desktop.querySelector('[data-w98-task="chrisphoto"]');
      const pinballTask = desktop.querySelector('[data-w98-task="pinball"]');
      const pinballPhotoTask = desktop.querySelector('[data-w98-task="pinballphoto"]');
      const skiTask = desktop.querySelector('[data-w98-task="ski"]');
      const skiPhotoTask = desktop.querySelector('[data-w98-task="skiphoto"]');
      const pinballStatus = desktop.querySelector("[data-pinball-status]");
      const skiScore = desktop.querySelector("[data-w98-ski-score]");
      const skiStatus = desktop.querySelector("[data-w98-ski-status]");
      const themesList = desktop.querySelector("[data-w98-themes-list]");
      const themesSwatch = desktop.querySelector("[data-w98-themes-swatch]");
      const themesPreviewLabel = desktop.querySelector("[data-w98-themes-preview-label]");
      const chrisPhotoImg = desktop.querySelector("[data-w98-chris-photo-img]");
      const startBtn = desktop.querySelector("[data-w98-start]");
      const startMenu = desktop.querySelector("[data-w98-start-menu]");
      const clockEl = desktop.querySelector("[data-w98-clock]") || desktop.querySelector(".w98-clock");
      const datetimeWin = desktop.querySelector("[data-w98-datetime]");
      const datetimeTask = desktop.querySelector('[data-w98-task="datetime"]');

      /** @type {{ destroy: () => void } | null} */
      let gbcScrapbook = null;

      /** Virtual “OS time” for Date/Time Properties — Dec 31 1999 until Y2K rolls. */
      /** @type {Date} */
      let virtualNow = (() => {
        const d = new Date();
        d.setFullYear(1999, 11, 31);
        return d;
      })();

      /** @type {ReturnType<typeof createPinball> | null} */
      let pinballGame = null;
      /** @type {ReturnType<typeof createSkiFree> | null} */
      let skiGame = null;
      /** Applied theme on the desktop (reversible). */
      let appliedThemeId = desktop.dataset.w98Theme || "default";
      /** Selection in the Themes dialog before Apply/OK. */
      let selectedThemeId = appliedThemeId;

      /** @type {ReturnType<typeof setTimeout> | null} */
      let clockTimeout = null;
      /** @type {ReturnType<typeof setInterval> | null} */
      let clockTimer = null;

      const formatTrayTime = (date = new Date()) =>
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

      const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];

      const formatDigital24 = (date) => {
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
      };

      const buildCalGrid = (year, month, selectedDay) => {
        const grid = datetimeWin?.querySelector("[data-w98-datetime-cal-grid]");
        if (!grid) return;
        grid.replaceChildren();
        // Monday-first grid (Win98 Date/Time Properties)
        const first = new Date(year, month, 1);
        const startPad = (first.getDay() + 6) % 7; // Sun=0 → 6
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 0; i < startPad; i++) {
          const empty = document.createElement("button");
          empty.type = "button";
          empty.className = "is-empty";
          empty.tabIndex = -1;
          empty.textContent = "";
          grid.appendChild(empty);
        }
        for (let day = 1; day <= daysInMonth; day++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = String(day);
          btn.tabIndex = -1;
          if (day === selectedDay) btn.classList.add("is-selected");
          grid.appendChild(btn);
        }
      };

      const paintDateTimeUi = (date) => {
        if (!datetimeWin) return;
        const monthEl = datetimeWin.querySelector("[data-w98-datetime-month]");
        const yearEl = datetimeWin.querySelector("[data-w98-datetime-year]");
        const digitalEl = datetimeWin.querySelector("[data-w98-datetime-digital]");
        const handH = datetimeWin.querySelector("[data-w98-datetime-hand-h]");
        const handM = datetimeWin.querySelector("[data-w98-datetime-hand-m]");
        const handS = datetimeWin.querySelector("[data-w98-datetime-hand-s]");
        const cal = datetimeWin.querySelector("[data-w98-datetime-cal]");

        if (monthEl instanceof HTMLSelectElement) {
          monthEl.selectedIndex = date.getMonth();
        }
        if (yearEl instanceof HTMLInputElement) {
          yearEl.value = String(date.getFullYear());
        }
        if (digitalEl instanceof HTMLInputElement) {
          digitalEl.value = formatDigital24(date);
        }
        if (cal) {
          cal.setAttribute(
            "aria-label",
            `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
          );
        }
        buildCalGrid(date.getFullYear(), date.getMonth(), date.getDate());

        const h = date.getHours() % 12;
        const m = date.getMinutes();
        const s = date.getSeconds();
        const hDeg = h * 30 + m * 0.5;
        const mDeg = m * 6 + s * 0.1;
        const sDeg = s * 6;
        if (handH instanceof HTMLElement) {
          handH.style.transform = `rotate(${hDeg}deg)`;
        }
        if (handM instanceof HTMLElement) {
          handM.style.transform = `rotate(${mDeg}deg)`;
        }
        if (handS instanceof HTMLElement) {
          handS.style.transform = `rotate(${sDeg}deg)`;
        }
      };

      /** Keep Date/Time Properties in sync with tray / Y2K virtual time. */
      const syncDateTime = (date) => {
        virtualNow = new Date(date.getTime());
        if (datetimeWin && !datetimeWin.classList.contains("is-closed")) {
          paintDateTimeUi(virtualNow);
        }
      };
      desktop._w98SyncDateTime = syncDateTime;

      const tickClock = () => {
        if (y2k.isRunning) return;
        const now = new Date();
        // Story date stays Dec 31 1999 until the Y2K takeover rewrites it.
        virtualNow = new Date(
          1999,
          11,
          31,
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        );
        if (clockEl) {
          clockEl.textContent = formatTrayTime(now);
          clockEl.title = "Fri Dec 31, 1999";
        }
        if (datetimeWin && !datetimeWin.classList.contains("is-closed")) {
          paintDateTimeUi(virtualNow);
        }
      };

      const clearClockTimers = () => {
        if (clockTimeout != null) {
          clearTimeout(clockTimeout);
          clockTimeout = null;
        }
        if (clockTimer != null) {
          clearInterval(clockTimer);
          clockTimer = null;
        }
      };

      const startClock = () => {
        clearClockTimers();
        // If a Y2K takeover is mid-flight, leave the scripted clock alone
        if (y2k.isRunning) return;
        clockEl?.classList.remove(
          "is-y2k-takeover",
          "is-y2k-rollover",
          "is-y2k-midnight"
        );
        tickClock();
        // Second ticks while Date/Time is open (analog second hand); else minute.
        const datetimeOpen =
          datetimeWin && !datetimeWin.classList.contains("is-closed");
        const interval = datetimeOpen ? 1000 : 60_000;
        if (datetimeOpen) {
          clockTimer = setInterval(tickClock, interval);
          return;
        }
        const now = new Date();
        const msToNextMinute =
          (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        clockTimeout = setTimeout(() => {
          clockTimeout = null;
          tickClock();
          clockTimer = setInterval(tickClock, 60_000);
        }, Math.max(msToNextMinute, 0));
      };

      const stopClock = () => {
        clearClockTimers();
      };

      desktop._w98StartClock = startClock;
      desktop._w98StopClock = stopClock;

      const closeStartMenu = () => {
        if (!startMenu || startMenu.hidden) return;
        startMenu.hidden = true;
        startMenu.setAttribute("aria-hidden", "true");
        startBtn?.setAttribute("aria-expanded", "false");
        startBtn?.classList.remove("is-pressed");
        desktop.querySelectorAll("[data-w98-start-flyout]").forEach((item) => {
          const fly = item.querySelector(".w98-start-flyout");
          const btn = item.querySelector(":scope > .w98-start-btn");
          if (fly) fly.hidden = true;
          btn?.setAttribute("aria-expanded", "false");
          item.classList.remove("is-open");
        });
      };

      const openStartMenu = () => {
        if (!startMenu) return;
        startMenu.hidden = false;
        startMenu.setAttribute("aria-hidden", "false");
        startBtn?.setAttribute("aria-expanded", "true");
        startBtn?.classList.add("is-pressed");
      };

      const destroyGbcScrapbook = () => {
        gbcScrapbook?.destroy?.();
        gbcScrapbook = null;
      };

      const mountGbcWindow = () => {
        if (!gbcWin) return;
        destroyGbcScrapbook();
        gbcScrapbook = mountGbcScrapbook(gbcWin, {
          images: GBC_ADS,
          // Continue is optional alias — beat already completes on open.
          onContinue: () => {
            completeSectionBeat("gbc", {
              sectionId: "section2",
              meta: { via: "scrapbook" },
            });
            syncWin98ContinueGate();
            syncSectionUpdateUi("section2");
            destroyGbcScrapbook();
            closeStartMenu();
            setActive(null);
            blip("correct");
          },
        });
      };

      /** @type {((e: KeyboardEvent) => void) | null} */
      let gatesBsodKeyHandler = null;

      const hideGatesBsod = () => {
        if (!gatesBsod) return;
        gatesBsod.hidden = true;
        gatesBsod.setAttribute("aria-hidden", "true");
        if (gatesBsodKeyHandler) {
          window.removeEventListener("keydown", gatesBsodKeyHandler, true);
          gatesBsodKeyHandler = null;
        }
      };

      const dismissGatesBsod = () => {
        if (!gatesBsod || gatesBsod.hidden) return;
        hideGatesBsod();
        completeSectionBeat("gates", {
          sectionId: "section2",
          meta: { via: "bsod-dismiss" },
        });
        closeStartMenu();
        setActive(null);
        blip("press");
      };

      const crashGatesDemo = () => {
        if (!gatesBsod) return;
        // Close the fake IE window; BSOD sits on the desktop as flavour only.
        if (gatesWin) {
          gatesWin.classList.add("is-closed");
          gatesWin.setAttribute("aria-hidden", "true");
        }
        if (gatesTask) {
          gatesTask.hidden = true;
          gatesTask.classList.remove("is-pressed");
        }
        desktop.classList.add("is-window-closed");
        desktop.dataset.w98Active = "gates-bsod";
        gatesBsod.hidden = false;
        gatesBsod.setAttribute("aria-hidden", "false");
        const focusEl = gatesBsod.querySelector("[data-w98-gates-dismiss]");
        if (focusEl instanceof HTMLElement) focusEl.focus?.();
        blip("wrong");
        if (gatesBsodKeyHandler) {
          window.removeEventListener("keydown", gatesBsodKeyHandler, true);
        }
        gatesBsodKeyHandler = (e) => {
          if (gatesBsod.hidden) return;
          e.preventDefault();
          e.stopPropagation();
          dismissGatesBsod();
        };
        window.addEventListener("keydown", gatesBsodKeyHandler, true);
      };

      /**
       * @param {'gbc'|'gates'|'themes'|'chrisphoto'|'datetime'|'pinball'|'pinballphoto'|'ski'|'skiphoto'|null} which
       * Era photo stacks on top of Space Cadet — pinball chrome stays open so
       * the reveal → Continue gate remains reachable (not buried under is-closed).
       * SkiFree reward is a full-bleed cover inside the Ski client (skiphoto),
       * not a separate offset photo window.
       */
      const setActive = (which) => {
        const gbcOpen = which === "gbc";
        const gatesOpen = which === "gates";
        const themesOpen = which === "themes";
        const chrisPhotoOpen = which === "chrisphoto";
        const datetimeOpen = which === "datetime";
        const pinballPhotoOpen = which === "pinballphoto";
        const pinballOpen = which === "pinball" || pinballPhotoOpen;
        const skiPhotoOpen = which === "skiphoto";
        const skiOpen = which === "ski" || skiPhotoOpen;

        if (!gbcOpen) destroyGbcScrapbook();
        if (!gatesOpen) hideGatesBsod();

        if (gbcWin) {
          gbcWin.classList.toggle("is-closed", !gbcOpen);
          gbcWin.setAttribute("aria-hidden", gbcOpen ? "false" : "true");
        }
        if (gatesWin) {
          gatesWin.classList.toggle("is-closed", !gatesOpen);
          gatesWin.setAttribute("aria-hidden", gatesOpen ? "false" : "true");
        }
        if (themesWin) {
          themesWin.classList.toggle("is-closed", !themesOpen);
          themesWin.setAttribute("aria-hidden", themesOpen ? "false" : "true");
        }
        if (datetimeWin) {
          datetimeWin.classList.toggle("is-closed", !datetimeOpen);
          datetimeWin.setAttribute(
            "aria-hidden",
            datetimeOpen ? "false" : "true"
          );
          if (datetimeOpen) {
            if (!y2k.isRunning) tickClock();
            else paintDateTimeUi(virtualNow);
            // Refresh timer cadence for second-hand while open
            if (!y2k.isRunning) startClock();
          } else if (!y2k.isRunning) {
            startClock();
          }
        }
        if (chrisPhotoWin) {
          chrisPhotoWin.classList.toggle("is-closed", !chrisPhotoOpen);
          chrisPhotoWin.setAttribute(
            "aria-hidden",
            chrisPhotoOpen ? "false" : "true"
          );
        }
        if (pinballWin) {
          pinballWin.classList.toggle("is-closed", !pinballOpen);
          pinballWin.setAttribute("aria-hidden", pinballOpen ? "false" : "true");
        }
        if (pinballPhotoWin) {
          pinballPhotoWin.classList.toggle("is-closed", !pinballPhotoOpen);
          pinballPhotoWin.setAttribute(
            "aria-hidden",
            pinballPhotoOpen ? "false" : "true"
          );
        }
        if (skiWin) {
          skiWin.classList.toggle("is-closed", !skiOpen);
          skiWin.setAttribute("aria-hidden", skiOpen ? "false" : "true");
        }
        if (skiPhotoWin) {
          // Reward is a full-bleed cover inside the Ski client — never pop the
          // separate offset photo chrome (that read as a Game Over no-op).
          skiPhotoWin.classList.add("is-closed");
          skiPhotoWin.setAttribute("aria-hidden", "true");
        }
        if (gbcTask) {
          gbcTask.hidden = !gbcOpen;
          gbcTask.classList.toggle("is-pressed", gbcOpen);
        }
        if (gatesTask) {
          gatesTask.hidden = !gatesOpen;
          gatesTask.classList.toggle("is-pressed", gatesOpen);
        }
        if (themesTask) {
          themesTask.hidden = !themesOpen;
          themesTask.classList.toggle("is-pressed", themesOpen);
        }
        if (chrisPhotoTask) {
          chrisPhotoTask.hidden = !chrisPhotoOpen;
          chrisPhotoTask.classList.toggle("is-pressed", chrisPhotoOpen);
        }
        if (datetimeTask) {
          datetimeTask.hidden = !datetimeOpen;
          datetimeTask.classList.toggle("is-pressed", datetimeOpen);
        }
        if (pinballTask) {
          pinballTask.hidden = !pinballOpen;
          pinballTask.classList.toggle("is-pressed", which === "pinball");
        }
        if (pinballPhotoTask) {
          pinballPhotoTask.hidden = !pinballPhotoOpen;
          pinballPhotoTask.classList.toggle("is-pressed", pinballPhotoOpen);
        }
        if (skiTask) {
          skiTask.hidden = !skiOpen;
          skiTask.classList.toggle("is-pressed", which === "ski");
        }
        if (skiPhotoTask) {
          skiPhotoTask.hidden = !skiPhotoOpen;
          skiPhotoTask.classList.toggle("is-pressed", skiPhotoOpen);
        }

        if (pinballGame) {
          if (pinballOpen) {
            // Keep the iframe/gate alive under the photo — don't stop() on reveal.
            if (which === "pinball" || !pinballGame.isRunning()) {
              pinballGame.start();
            }
          } else {
            pinballGame.stop();
          }
        }

        if (skiGame) {
          if (skiOpen) {
            // Keep the iframe alive under the in-client reward cover.
            if (which === "ski" || !skiGame.isRunning()) {
              skiGame.start();
            }
            if (skiPhotoOpen) {
              skiGame.showRewardCover?.();
            }
          } else {
            skiGame.stop();
          }
        }

        desktop.classList.toggle(
          "is-window-closed",
          !gbcOpen &&
            !gatesOpen &&
            !themesOpen &&
            !chrisPhotoOpen &&
            !datetimeOpen &&
            !pinballOpen &&
            !pinballPhotoOpen &&
            !skiOpen &&
            !skiPhotoOpen
        );
        desktop.dataset.w98Active = which || "none";
        // Keys only when pinball / SkiFree is the front window (not under the photo).
        desktop._w98PinballActive = which === "pinball";
        desktop._w98SkiActive = which === "ski";
      };

      const openGbc = () => {
        closeStartMenu();
        setActive("gbc");
        mountGbcWindow();
        completeSectionBeat("gbc", {
          sectionId: "section2",
          meta: { via: "open" },
        });
        syncWin98ContinueGate();
        syncSectionUpdateUi("section2");
        blip("windowOpen");
      };

      const syncWin98ContinueGate = () => {
        // Continue… removed from Win98 chrome — Y2K is Chris, 1999 only.
        // Keep this as a no-op so older call sites stay safe.
      };

      const nudge = (el) => {
        if (!el) return;
        el.classList.remove("is-nudge");
        void el.offsetWidth;
        el.classList.add("is-nudge");
        setTimeout(() => el.classList.remove("is-nudge"), 600);
      };

      // → / Space blocked until Section 2 update consumed; nudge Desktop Themes
      desktop._w98NudgeAdvance = () => {
        if (chapter?.classList.contains("w98-unlocked")) return false;
        nudge(desktop.querySelector("[data-w98-themes-open]"));
        return true;
      };

      const syncThemesListUi = () => {
        if (!themesList) return;
        themesList.querySelectorAll("[data-w98-theme-id]").forEach((btn) => {
          const id = btn.getAttribute("data-w98-theme-id");
          const selected = id === selectedThemeId;
          btn.classList.toggle("is-selected", selected);
          btn.setAttribute("aria-selected", selected ? "true" : "false");
        });
        const theme = getW98Theme(selectedThemeId) || W98_THEMES[0];
        if (themesSwatch) themesSwatch.dataset.theme = theme.id;
        if (themesPreviewLabel) themesPreviewLabel.textContent = theme.preview;
      };

      const buildThemesList = () => {
        if (!themesList || themesList.childElementCount) return;
        W98_THEMES.forEach((theme) => {
          const li = document.createElement("li");
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "w98-themes-item";
          btn.setAttribute("role", "option");
          btn.setAttribute("data-w98-theme-id", theme.id);
          btn.textContent = theme.label;
          if (theme.exitReveal) btn.classList.add("is-odd");
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedThemeId = theme.id;
            syncThemesListUi();
            blip("press");
          });
          li.appendChild(btn);
          themesList.appendChild(li);
        });
      };

      const commitTheme = (themeId, { closeDialog = false } = {}) => {
        const theme = applyW98Theme(desktop, themeId);
        appliedThemeId = theme.id;
        selectedThemeId = theme.id;
        syncThemesListUi();
        blip(theme.sfx || "press");

        if (theme.exitReveal) {
          if (chrisPhotoImg) chrisPhotoImg.src = CHRIS_1999_PHOTO;
          completeSectionBeat("chris1999", {
            sectionId: "section2",
            photo: true,
            meta: { via: "desktop-themes" },
          });
          syncWin98ContinueGate();
          syncSectionUpdateUi("section2");
          closeStartMenu();
          // Theme paints first — then Y2K clock takeover (not XP floppy).
          // Rearm so re-applying Chris, 1999 still starts Y2K after a prior
          // XP install consumed section2 (common mid-rehearsal / pinball revisit).
          setActive(null);
          if (!y2k.isRunning) {
            progress.rearmUpdate("section2");
            scheduleY2kTransition();
          }
          return theme;
        }

        if (closeDialog) {
          setActive(null);
        }
        return theme;
      };

      pinballGame = pinballWin
        ? createPinball(pinballWin, {
            statusEl: pinballStatus,
            openPhoto: () => {
              closeStartMenu();
              setActive("pinballphoto");
              blip("correct");
            },
            unlockContinue: () => {
              completeSectionBeat("pinball", {
                sectionId: "section2",
                photo: true,
                meta: { via: "reveal" },
              });
            },
            onContinue: () => {
              completeSectionBeat("pinball", {
                sectionId: "section2",
                photo: true,
                meta: { via: "continue" },
              });
              closeStartMenu();
              setActive(null);
              blip("correct");
              // Stay on hub — Pinball is optional flavour (unlock is Chris, 1999).
            },
          })
        : null;

      skiGame = skiWin
        ? createSkiFree(skiWin, {
            scoreEl: skiScore,
            statusEl: skiStatus,
            onEsc: () => {
              setActive(null);
              blip("press");
            },
            // Finish → yeti → Game Over → photo is optional reward (Ski is flavour only).
            onFinish: () => {
              blip("press");
            },
            onYeti: () => {
              blip("wrong");
            },
            onGameOverPhoto: () => {
              closeStartMenu();
              // skiphoto → Ski stays open; reward is the in-client cover (not
              // the separate offset photo chrome that looked like a no-op).
              setActive("skiphoto");
              completeSectionBeat("skifree", {
                sectionId: "section2",
                photo: true,
                meta: { via: "gameover-photo" },
              });
              blip("photo");
            },
          })
        : null;

      desktop._w98HandleKey = (e) => {
        if (!startMenu?.hidden && e.key === "Escape") {
          e.preventDefault();
          closeStartMenu();
          return true;
        }
        if (desktop._w98PinballActive) {
          if (e.key === "Escape") {
            e.preventDefault();
            setActive(null);
            blip("press");
            return true;
          }
          if (pinballGame?.handleDeckKey(e)) return true;
        }
        if (desktop._w98SkiActive) {
          if (e.key === "Escape") {
            e.preventDefault();
            setActive(null);
            blip("press");
            return true;
          }
          if (skiGame?.handleDeckKey(e)) return true;
        }
        const escClosable = ["gbc", "gates", "themes", "chrisphoto"];
        if (
          escClosable.includes(desktop.dataset.w98Active || "") &&
          e.key === "Escape"
        ) {
          e.preventDefault();
          if (desktop.dataset.w98Active === "themes") {
            selectedThemeId = appliedThemeId;
            syncThemesListUi();
          }
          setActive(null);
          blip("press");
          return true;
        }
        // Gates BSOD overlay — Esc / any key handled by gatesBsodKeyHandler
        if (desktop.dataset.w98Active === "gates-bsod") {
          e.preventDefault();
          return true;
        }
        // Any modal window open (gbc / themes / chrisphoto / datetime / photo
        // stages) — keep deck ←/→/↑/↓/PageUp/PageDown/Space from stealing focus.
        // Games (pinball/ski) already consumed their own keys above.
        const activeWin = desktop.dataset.w98Active || "none";
        if (
          activeWin !== "none" &&
          [
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            " ",
            "Spacebar",
          ].includes(e.key)
        ) {
          e.preventDefault();
          return true;
        }
        return false;
      };

      const resetWin98 = () => {
        // Keep w98-unlocked only after Section 2 update was consumed
        const keepUnlock = progress.isUpdateConsumed("section2");
        chapter?.classList.toggle("w98-unlocked", keepUnlock);
        chapter?.classList.toggle("quiz-solved", keepUnlock);
        closeStartMenu();
        destroyGbcScrapbook();
        hideGatesBsod();
        applyW98Theme(desktop, appliedThemeId || "default");
        selectedThemeId = appliedThemeId;
        buildThemesList();
        syncThemesListUi();
        setActive(null);
        pinballGame?.reset();
        skiGame?.stop();
        syncWin98ContinueGate();
        syncSectionUpdateUi("section2");
        desktop._triggerPinballEraReveal = () =>
          pinballGame?.triggerPinballEraReveal?.();
      };

      /**
       * Soft enter on hub revisit — keep theme, open windows, pinball/Ski
       * iframes. Restore w98-unlocked from consumed update (same pattern as
       * Win95). Re-sync gates + update UI.
       */
      const enterWin98 = () => {
        const keepUnlock = progress.isUpdateConsumed("section2");
        chapter?.classList.toggle("w98-unlocked", keepUnlock);
        chapter?.classList.toggle("quiz-solved", keepUnlock);
        applyW98Theme(desktop, appliedThemeId || "default");
        selectedThemeId = appliedThemeId;
        syncThemesListUi();
        syncWin98ContinueGate();
        syncSectionUpdateUi("section2");
      };

      desktop._resetWin98 = resetWin98;
      desktop._w98Enter = enterWin98;
      buildThemesList();
      resetWin98();

      desktop.querySelectorAll("[data-w98-gbc-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openGbc();
        });
      });

      desktop.querySelectorAll("[data-w98-gbc-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          destroyGbcScrapbook();
          setActive(null);
          blip("windowClose");
        });
      });

      desktop.querySelectorAll("[data-w98-gates-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          hideGatesBsod();
          setActive("gates");
          blip("windowOpen");
        });
      });

      desktop.querySelectorAll("[data-w98-gates-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          hideGatesBsod();
          setActive(null);
          blip("windowClose");
        });
      });

      desktop.querySelectorAll("[data-w98-gates-run]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          crashGatesDemo();
        });
      });

      desktop.querySelectorAll("[data-w98-gates-dismiss]").forEach((btn) => {
        btn.addEventListener("pointerdown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dismissGatesBsod();
        });
      });

      // Desktop Themes — Chris, 1999 is the required Y2K trigger.
      desktop.querySelectorAll("[data-w98-themes-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          selectedThemeId = appliedThemeId;
          buildThemesList();
          syncThemesListUi();
          setActive("themes");
          blip("windowOpen");
        });
      });

      desktop.querySelectorAll("[data-w98-themes-close], [data-w98-themes-cancel]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          selectedThemeId = appliedThemeId;
          syncThemesListUi();
          setActive(null);
          blip("windowClose");
        });
      });

      desktop.querySelectorAll("[data-w98-themes-apply]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          commitTheme(selectedThemeId, { closeDialog: false });
        });
      });

      desktop.querySelectorAll("[data-w98-themes-ok]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          commitTheme(selectedThemeId, { closeDialog: true });
        });
      });

      // Tray clock → Date/Time Properties (always shows Dec 31 1999 until Y2K rolls)
      clockEl?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        if (!y2k.isRunning) tickClock();
        setActive("datetime");
        blip("windowOpen");
      });

      desktop
        .querySelectorAll(
          "[data-w98-datetime-close], [data-w98-datetime-ok], [data-w98-datetime-task]"
        )
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.hasAttribute("data-w98-datetime-task")) {
              setActive("datetime");
              blip("press");
              return;
            }
            setActive(null);
            blip("windowClose");
          });
        });

      desktop.querySelectorAll("[data-w98-chris-photo-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
          blip("press");
        });
      });

      chrisPhotoTask?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        setActive("chrisphoto");
        blip("press");
      });

      desktop.querySelectorAll("[data-pinball-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-pinball-photo-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Return to Space Cadet so Continue stays one click away after reveal.
          setActive(pinballGame?.hasRevealed?.() ? "pinball" : null);
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-pinball-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("pinball");
          completeSectionBeat("pinball", {
            sectionId: "section2",
            meta: { via: "open" },
          });
          syncWin98ContinueGate();
          syncSectionUpdateUi("section2");
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-ski-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          // Re-open Ski to play — clear any prior reward cover and reload run.
          if (skiGame?.hasReward?.()) {
            skiGame.hideRewardCover?.();
            setActive("ski");
            skiGame.resetRun?.();
          } else {
            setActive("ski");
          }
          completeSectionBeat("skifree", {
            sectionId: "section2",
            meta: { via: "open" },
          });
          syncWin98ContinueGate();
          syncSectionUpdateUi("section2");
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-ski-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-ski-photo-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          skiGame?.hideRewardCover?.();
          setActive("ski");
          blip("press");
        });
      });

      skiPhotoTask?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        setActive("skiphoto");
        blip("press");
      });

      pinballPhotoTask?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        setActive("pinballphoto");
        blip("press");
      });

      desktop.querySelectorAll("[data-w98-icon].is-muted").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          blip("wrong");
        });
      });

      startBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (startMenu && !startMenu.hidden) {
          closeStartMenu();
          blip("press");
          return;
        }
        openStartMenu();
        blip("startMenu");
      });

      desktop.querySelectorAll("[data-w98-start-flyout]").forEach((item) => {
        const btn = item.querySelector(":scope > .w98-start-btn");
        const fly = item.querySelector(".w98-start-flyout");
        btn?.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Close sibling flyouts so Settings / Entertainment Pack don't stack
          desktop.querySelectorAll("[data-w98-start-flyout]").forEach((other) => {
            if (other === item) return;
            other.classList.remove("is-open");
            const otherFly = other.querySelector(".w98-start-flyout");
            const otherBtn = other.querySelector(":scope > .w98-start-btn");
            if (otherFly) otherFly.hidden = true;
            otherBtn?.setAttribute("aria-expanded", "false");
          });
          const open = item.classList.toggle("is-open");
          if (fly) fly.hidden = !open;
          btn.setAttribute("aria-expanded", open ? "true" : "false");
          blip("press");
        });
      });

      desktop.addEventListener("pointerdown", (e) => {
        if (startMenu?.hidden) return;
        if (e.target.closest("[data-w98-start-menu], [data-w98-start]")) return;
        closeStartMenu();
      });
    });
  }

  /** Section 3 hub — Bliss desktop + tray clock + My Pictures + Firefox (Web 2.0). */
  function wireWinXpDesktop() {
    deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
      const picturesWin = desktop.querySelector("[data-wxp-pictures-window]");
      const picturesRoot = desktop.querySelector("[data-wxp-pictures]");
      const picturesTask = desktop.querySelector("[data-wxp-pictures-task]");
      const firefoxWin = desktop.querySelector("[data-wxp-firefox-window]");
      const firefoxTask = desktop.querySelector("[data-wxp-firefox-task]");
      const startBtn = desktop.querySelector("[data-wxp-start]");
      const startMenu = desktop.querySelector("[data-wxp-start-menu]");
      const shutdownDlg = desktop.querySelector("[data-wxp-shutdown-dlg]");
      const powerOff = desktop.querySelector("[data-wxp-poweroff]");
      const chapter = desktop.closest(".chapter");
      const clockEl = desktop.querySelector(".wxp-clock");
      /** @type {ReturnType<typeof setTimeout> | null} */
      let clockTimeout = null;
      /** @type {ReturnType<typeof setInterval> | null} */
      let clockTimer = null;
      /** @type {ReturnType<typeof setTimeout> | null} */
      let win10PackTimeout = null;
      /** @type {ReturnType<typeof setTimeout>[]} */
      let powerOffTimers = [];
      /** @type {{ destroy: () => void } | null} */
      let picturesMount = null;
      /** @type {ReturnType<typeof mountIeWeb20> | null} */
      let firefoxMount = null;
      let win10PackApplied = false;
      let poweringOff = false;

      /** Win10 UI Pack gag — MIT curated assets under assets/winxp-ui/win10pack/. */
      const syncWin10PackVisibility = (on) => {
        desktop.querySelectorAll(".wxp-icon--classic, .wxp-label--classic, .wxp-meta--classic, .wxp-path--classic").forEach((el) => {
          el.hidden = on;
        });
        desktop.querySelectorAll(".wxp-icon--w10, .wxp-label--w10, .wxp-meta--w10, .wxp-path--w10").forEach((el) => {
          el.hidden = !on;
        });
        desktop.querySelectorAll("[data-wxp-w10-title]").forEach((el) => {
          const classic = el.getAttribute("title");
          const w10 = el.getAttribute("data-wxp-w10-title");
          if (!w10) return;
          if (on) {
            if (!el.hasAttribute("data-wxp-classic-title") && classic != null) {
              el.setAttribute("data-wxp-classic-title", classic);
            }
            el.setAttribute("title", w10);
          } else {
            const restore = el.getAttribute("data-wxp-classic-title");
            if (restore != null) el.setAttribute("title", restore);
          }
        });
      };

      const applyWin10Pack = ({ playSound = true } = {}) => {
        if (win10PackApplied) return;
        win10PackApplied = true;
        if (win10PackTimeout != null) {
          clearTimeout(win10PackTimeout);
          win10PackTimeout = null;
        }
        desktop.classList.remove("is-bliss");
        desktop.classList.add("is-win10pack");
        syncWin10PackVisibility(true);
        if (playSound) blip("win10Notify");
      };

      const resetWin10Pack = () => {
        win10PackApplied = false;
        if (win10PackTimeout != null) {
          clearTimeout(win10PackTimeout);
          win10PackTimeout = null;
        }
        desktop.classList.remove("is-win10pack");
        desktop.classList.add("is-bliss");
        syncWin10PackVisibility(false);
      };

      const scheduleWin10Pack = () => {
        if (win10PackApplied) return;
        if (win10PackTimeout != null) {
          clearTimeout(win10PackTimeout);
          win10PackTimeout = null;
        }
        sfx.preloadUrl?.("/assets/winxp-ui/win10pack/audio/notify.wav");
        // Prefetch Hero wallpaper so the gag doesn't flash empty.
        const warm = new Image();
        warm.src = "/assets/winxp-ui/win10pack/wallpaper-hero.jpg";
        // Talk beat: always land on classic Bliss first, then apply the gag.
        // Do NOT collapse to 0 under prefers-reduced-motion — that skipped Bliss
        // entirely and made XP look like it loaded the "wrong" (Win10) screen.
        const delay = 2200;
        win10PackTimeout = setTimeout(() => {
          win10PackTimeout = null;
          applyWin10Pack({ playSound: true });
        }, delay);
      };

      desktop._wxpApplyWin10Pack = () => applyWin10Pack({ playSound: true });
      desktop._wxpResetWin10Pack = resetWin10Pack;
      desktop._wxpScheduleWin10Pack = scheduleWin10Pack;
      desktop._wxpCancelWin10Pack = () => {
        if (win10PackTimeout != null) {
          clearTimeout(win10PackTimeout);
          win10PackTimeout = null;
        }
      };

      const formatTrayTime = (date = new Date()) =>
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

      const clearClockTimers = () => {
        if (clockTimeout != null) {
          clearTimeout(clockTimeout);
          clockTimeout = null;
        }
        if (clockTimer != null) {
          clearInterval(clockTimer);
          clockTimer = null;
        }
      };

      const tickClock = () => {
        if (clockEl) clockEl.textContent = formatTrayTime();
      };

      const startClock = () => {
        clearClockTimers();
        tickClock();
        const now = new Date();
        const msToNextMinute =
          (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        clockTimeout = setTimeout(() => {
          clockTimeout = null;
          tickClock();
          clockTimer = setInterval(tickClock, 60_000);
        }, Math.max(msToNextMinute, 0));
      };

      const stopClock = () => clearClockTimers();

      desktop._wxpStartClock = startClock;
      desktop._wxpStopClock = stopClock;
      desktop.classList.add("is-bliss");

      const closeStartMenu = () => {
        if (!startMenu) return;
        startMenu.hidden = true;
        startMenu.setAttribute("aria-hidden", "true");
        startBtn?.setAttribute("aria-expanded", "false");
      };

      const openStartMenu = () => {
        if (!startMenu) return;
        startMenu.hidden = false;
        startMenu.setAttribute("aria-hidden", "false");
        startBtn?.setAttribute("aria-expanded", "true");
      };

      const setShutdownDlg = (open) => {
        if (!shutdownDlg) return;
        shutdownDlg.classList.toggle("is-closed", !open);
        shutdownDlg.hidden = !open;
        shutdownDlg.setAttribute("aria-hidden", open ? "false" : "true");
      };

      const clearPowerOffTimers = () => {
        powerOffTimers.splice(0).forEach((t) => clearTimeout(t));
      };

      const afterPowerOff = (ms, fn) => {
        const t = setTimeout(() => {
          powerOffTimers = powerOffTimers.filter((x) => x !== t);
          if (poweringOff) fn();
        }, ms);
        powerOffTimers.push(t);
      };

      /** Shut Down OK → pure black → slow static fade. Space / Next → PS2 load. */
      const setPowerOff = (on) => {
        poweringOff = on;
        clearPowerOffTimers();
        chapter?.classList.toggle("wxp-powering-off", on);
        if (powerOff) {
          powerOff.hidden = !on;
          powerOff.setAttribute("aria-hidden", on ? "false" : "true");
          powerOff.classList.remove("is-static-in");
        }
        if (on) {
          closeStartMenu();
          setShutdownDlg(false);
          setPictures(false);
          setFirefox(false);
          desktop.classList.add("is-powering-off");
          // Black hold, then fade static in. No logo / buttons — Space when ready.
          const blackMs = reduceMotion ? 0 : 800;
          afterPowerOff(blackMs, () => {
            powerOff?.classList.add("is-static-in");
          });
        } else {
          desktop.classList.remove("is-powering-off");
        }
      };

      const leavePowerOffToConsoles = () => {
        if (!poweringOff) return false;
        clearPowerOffTimers();
        blip("press");
        // Space hand-off starts the PS2 splash → boot (logo lives there, once).
        goToConsoles({ startSystem: true });
        return true;
      };

      const destroyPicturesMount = () => {
        picturesMount?.destroy?.();
        picturesMount = null;
      };

      const destroyFirefoxMount = () => {
        firefoxMount?.destroy?.();
        firefoxMount = null;
      };

      const setWeb20Era = (on) => {
        if (on) {
          document.body.dataset.era = "web20";
          document.body.dataset.themeFamily = "firefox";
          document.body.dataset.year = "2004";
          return;
        }
        // Only restore XP era while this hub is still the active chapter
        if (chapter?.classList.contains("active")) {
          document.body.dataset.era = "winxp";
          document.body.dataset.themeFamily = "winxp";
          document.body.dataset.year = "2001";
        }
      };

      const setPictures = (open) => {
        if (!picturesWin) return;
        // Allow close during power-off; block only new opens.
        if (open && poweringOff) return;
        picturesWin.classList.toggle("is-closed", !open);
        picturesWin.hidden = !open;
        picturesWin.style.display = open ? "flex" : "none";
        picturesWin.setAttribute("aria-hidden", open ? "false" : "true");
        if (picturesTask) {
          picturesTask.hidden = !open;
          picturesTask.classList.toggle("is-pressed", open);
        }
        desktop._wxpPicturesActive = open;

        if (open && picturesRoot && !picturesMount) {
          picturesMount = mountXpPictures(picturesRoot, {
            images: GAMECUBE_ADS,
            onReady: () => {
              // Progress only — section3 unlock is empty (no next-OS interstitial).
              completeSectionBeat("gamecube", {
                sectionId: "section3",
                meta: { via: "pictures" },
              });
            },
          });
        } else if (!open) {
          destroyPicturesMount();
        }
      };

      const firefoxMaxBtn = desktop.querySelector("[data-wxp-firefox-maximize]");

      const syncFirefoxMaximizeUi = (maximized) => {
        if (!firefoxMaxBtn) return;
        firefoxMaxBtn.setAttribute("aria-pressed", maximized ? "true" : "false");
        firefoxMaxBtn.setAttribute(
          "title",
          maximized ? "Restore Down" : "Maximize"
        );
        firefoxMaxBtn.setAttribute(
          "aria-label",
          maximized ? "Restore Down" : "Maximize"
        );
        firefoxMaxBtn.textContent = maximized ? "❐" : "□";
      };

      const setFirefoxMaximized = (maximized) => {
        if (!firefoxWin) return;
        const on = !!maximized;
        firefoxWin.classList.toggle("is-maximized", on);
        syncFirefoxMaximizeUi(on);
      };

      const setFirefox = (open) => {
        if (!firefoxWin) return;
        if (open && poweringOff) return;
        firefoxWin.classList.toggle("is-closed", !open);
        firefoxWin.hidden = !open;
        firefoxWin.setAttribute("aria-hidden", open ? "false" : "true");
        if (firefoxTask) {
          firefoxTask.hidden = !open;
          firefoxTask.classList.toggle("is-pressed", open);
        }
        desktop._wxpFirefoxActive = open;
        setWeb20Era(open);

        if (open && !firefoxMount) {
          firefoxMount = mountIeWeb20(firefoxWin, {
            tabs: WEB20_TABS,
          });
          completeSectionBeat("firefox", {
            sectionId: "section3",
            meta: { via: "firefox" },
          });
        } else if (!open) {
          setFirefoxMaximized(false);
          destroyFirefoxMount();
        }
      };

      /** Arrows: Firefox tabs, else My Pictures filmstrip — swallow before deck nav. */
      desktop._wxpHandleKey = (e) => {
        if (desktop._wxpFirefoxActive && firefoxMount) {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            const before = firefoxMount.activeIndex();
            firefoxMount.cycleTab(-1);
            if (firefoxMount.activeIndex() !== before) blip("windowOpen");
            else blip("press");
            return true;
          }
          if (e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            const before = firefoxMount.activeIndex();
            firefoxMount.cycleTab(1);
            if (firefoxMount.activeIndex() !== before) blip("windowOpen");
            else blip("press");
            return true;
          }
          if (e.key === "Escape") {
            e.preventDefault();
            if (firefoxWin.classList.contains("is-maximized")) {
              setFirefoxMaximized(false);
              blip("press");
              return true;
            }
            setFirefox(false);
            blip("windowClose");
            return true;
          }
        }
        if (!desktop._wxpPicturesActive) return false;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          picturesMount?.prev?.();
          return true;
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          picturesMount?.next?.();
          return true;
        }
        return false;
      };

      desktop.querySelectorAll("[data-wxp-pictures-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (poweringOff) return;
          closeStartMenu();
          setPictures(true);
          blip("press");
        });
      });
      desktop.querySelectorAll("[data-wxp-pictures-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setPictures(false);
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-wxp-firefox-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (poweringOff) return;
          closeStartMenu();
          setFirefox(true);
          blip("windowOpen");
        });
      });
      desktop.querySelectorAll("[data-wxp-firefox-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setFirefox(false);
          blip("windowClose");
        });
      });
      desktop.querySelectorAll("[data-wxp-firefox-maximize]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (poweringOff || !desktop._wxpFirefoxActive) return;
          const next = !firefoxWin.classList.contains("is-maximized");
          setFirefoxMaximized(next);
          blip("press");
        });
      });

      startBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (poweringOff) return;
        if (startMenu && !startMenu.hidden) {
          closeStartMenu();
          blip("press");
        } else {
          openStartMenu();
          blip("windowOpen");
        }
      });

      desktop.addEventListener("pointerdown", (e) => {
        if (!startMenu || startMenu.hidden) return;
        if (e.target.closest("[data-wxp-start-menu], [data-wxp-start]")) return;
        closeStartMenu();
      });

      desktop.querySelectorAll("[data-wxp-shutdown]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (poweringOff) return;
          closeStartMenu();
          setShutdownDlg(true);
          blip("windowOpen");
        });
      });

      desktop.querySelectorAll("[data-wxp-shutdown-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setShutdownDlg(false);
          blip("windowClose");
        });
      });

      desktop.querySelectorAll("[data-wxp-shutdown-ok]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setPowerOff(true);
          blip("transition");
        });
      });

      desktop._wxpDestroyPictures = () => setPictures(false);
      desktop._wxpDestroyFirefox = () => setFirefox(false);
      desktop._wxpOpenFirefox = () => {
        if (poweringOff) return;
        closeStartMenu();
        setFirefox(true);
      };
      desktop._wxpIsPoweringOff = () => poweringOff;
      desktop._wxpLeavePowerOff = leavePowerOffToConsoles;
      desktop._wxpNudgeAdvance = () => {
        if (poweringOff) {
          // Soft-gate: Space / Next during static (or black hold) starts PS2.
          leavePowerOffToConsoles();
          return true;
        }
        if (shutdownDlg && !shutdownDlg.classList.contains("is-closed") && !shutdownDlg.hidden) {
          setPowerOff(true);
          blip("transition");
          return true;
        }
        openStartMenu();
        const shut = desktop.querySelector("[data-wxp-shutdown]");
        if (shut) {
          shut.classList.remove("is-nudge");
          void shut.offsetWidth;
          shut.classList.add("is-nudge");
          setTimeout(() => shut.classList.remove("is-nudge"), 700);
        }
        return true;
      };
      desktop._wxpResetPowerOff = () => setPowerOff(false);

      /** Soft enter — classic Bliss desktop (Pictures + Firefox closed). */
      desktop._wxpEnter = () => {
        setPowerOff(false);
        setShutdownDlg(false);
        setPictures(false);
        setFirefox(false);
        closeStartMenu();
        resetWin10Pack();
        startClock();
        // No auto Win10-pack swap — that read as a glitchy double-load after Y2K.
        // Presenter can still force: Sipnsplain.applyWin10Pack().
      };

      setPictures(false);
      setFirefox(false);
      setShutdownDlg(false);
      setPowerOff(false);
      closeStartMenu();
    });
  }

  /** Living-room PS2 — splash → boot → Browser menu → shutdown → Timewarp. */
  function wireConsolesChapter() {
    deck.querySelectorAll("[data-consoles]").forEach((room) => {
      const chapter = room.closest(".chapter");

      /** @type {ReturnType<typeof mountPs2> | null} */
      let mount = null;

      const leave = () => {
        chapter?.classList.add("consoles-done");
        blip("correct");
        goToTimewarp();
        return true;
      };

      const ensureMount = () => {
        if (mount) return mount;
        mount = mountPs2(room, {
          images: PS2_ADS,
          reduceMotion,
          getMuted: () => muted,
          onContinue: leave,
          onBrowserOpen: () => blip("windowOpen"),
        });
        return mount;
      };

      room._consolesReset = () => {
        chapter?.classList.remove("consoles-done");
        ensureMount().reset();
      };
      room._consolesStartSystem = () => {
        ensureMount().startSystem();
        return true;
      };
      room._consolesAdvance = () => {
        const m = ensureMount();
        // On menu, Next should leave (not force Browser) so the talk can skip ads.
        if (m.phase() === "menu") {
          blip("press");
          return leave();
        }
        const moved = m.advance();
        if (moved) blip("press");
        return moved;
      };
      /** ←/→ / ↑/↓ stay in hub; scrub Browser strip when open. */
      room._consolesHandleArrow = (delta) => {
        const m = ensureMount();
        if (m.phase() === "browser" && m.nudgeBrowser?.(delta)) {
          blip("press");
          return true;
        }
        blip("press");
        return true;
      };
      room._consolesDestroy = () => {
        mount?.destroy?.();
        mount = null;
      };
    });
  }

  /** Timewarp — empty OS X desktop + dock; dock year (09…) opens the card track.
   * Soft gate: while idle, ←/→/Space stay on desktop; after start, cycle cards.
   * Only Continue leaves. Hold ←/→ to scrub. Shift+Arrow still escapes. */
  function wireTimewarpChapter() {
    deck.querySelectorAll("[data-timewarp]").forEach((root) => {
      const chapter = root.closest(".chapter");

      /** @type {ReturnType<typeof mountTimewarp> | null} */
      let mount = null;

      const leave = () => {
        chapter?.classList.add("timewarp-done");
        blip("correct");
        // Continue → Switch 2 cue ("time to play a game") → then source-reveal.
        goToFinale();
        return true;
      };

      const ensureMount = () => {
        if (mount) return mount;
        mount = mountTimewarp(root, {
          items: TIMEWARP_ITEMS,
          onContinue: leave,
          reduceMotion,
        });
        return mount;
      };

      ensureMount();

      root._timewarpReset = () => {
        chapter?.classList.remove("timewarp-done");
        ensureMount().reset();
      };
      root._timewarpAdvance = () => {
        const m = ensureMount();
        if (!m.isStarted?.()) {
          blip("press");
          return true;
        }
        const before = m.activeIndex();
        m.cycle(1);
        if (m.activeIndex() !== before) blip("windowOpen");
        else blip("press");
        return true;
      };
      root._timewarpPrev = () => {
        const m = ensureMount();
        if (!m.isStarted?.()) {
          blip("press");
          return true;
        }
        const before = m.activeIndex();
        m.cycle(-1);
        if (m.activeIndex() !== before) blip("windowOpen");
        else blip("press");
        return true;
      };
      root._timewarpStartHold = (delta) => {
        ensureMount().startHold?.(delta);
        return true;
      };
      root._timewarpStopHold = () => {
        ensureMount().stopHold?.();
      };
      root._timewarpDestroy = () => {
        mount?.destroy();
        mount = null;
      };
    });
  }

  function applyWin10PackAll() {
    deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
      desktop._wxpApplyWin10Pack?.();
    });
  }

  function resetWin10PackAll() {
    deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
      desktop._wxpResetWin10Pack?.();
    });
  }

  function wireQuiz() {
    deck.querySelectorAll("[data-quiz]").forEach((group) => {
      const chapter = group.closest(".chapter");
      const feedback = chapter.querySelector("[data-feedback]");
      const cont = chapter.querySelector("[data-continue]");
      const buttons = group.querySelectorAll("[data-result]");

      buttons.forEach((btn) => {
        btn.addEventListener("pointerdown", () => {
          btn.classList.add("is-pressing");
          blip("press");
        });
        btn.addEventListener("pointerup", () => btn.classList.remove("is-pressing"));
        btn.addEventListener("pointerleave", () => btn.classList.remove("is-pressing"));

        btn.addEventListener("click", () => {
          if (btn.disabled) return;
          const result = btn.dataset.result;
          const msg = btn.dataset.msg || "";

          if (result === "wrong") {
            btn.classList.remove("is-wrong");
            void btn.offsetWidth;
            btn.classList.add("is-wrong");
            if (feedback) {
              feedback.textContent = msg;
              feedback.classList.add("show");
              feedback.classList.remove("ok");
            }
            setTimeout(() => btn.classList.remove("is-wrong"), 480);
            blip("wrong");
            return;
          }

          buttons.forEach((b) => { b.disabled = true; });
          btn.classList.add("is-correct");
          blip("correct");
          if (feedback) {
            feedback.textContent = msg;
            feedback.classList.add("show", "ok");
          }
          const pts = parseInt(btn.dataset.points || "0", 10);
          if (pts) {
            document.body.classList.add("show-score");
            setScore(score + pts, true);
          }
          chapter.classList.add("quiz-solved");
          if (cont) cont.classList.add("show");
        });
      });

      if (cont) cont.addEventListener("click", () => next());
    });

    // Standalone continue buttons (e.g. drifting thesis-3)
    // Win98 hub gates advance via Chris, 1999 / w98-unlocked — skip those roots
    deck.querySelectorAll("[data-continue]").forEach((btn) => {
      if (btn.closest("[data-quiz], [data-audience-poll], [data-w98]")) return;
      btn.addEventListener("click", () => next());
    });
  }

  function syncMissionUI() {
    const node = deck.querySelectorAll(".chapter")[index];
    if (!node) return;
    const ui = node.querySelector("[data-mission-ui]");
    if (!ui) return;
    const id = chapters[index].id;
    ui.classList.toggle("show", missionVisible.has(id));
  }

  function notesBody(ch, extra = "") {
    const id = slideIdentity(ch, index, chapters.length);
    return `${id.notesLine}\n\n${ch.note || ""}${extra}`;
  }

  function updateSlideIndexHud(ch) {
    if (!slideIndexEl || !ch) return;
    const id = slideIdentity(ch, index, chapters.length);
    slideIndexEl.textContent = id.hudLine;
    slideIndexEl.title = `${id.hudLine} · press I to toggle · Sipnsplain.go('${ch.id}')`;
  }

  function show(i) {
    if (crtBoot.isRunning) crtBoot.skip();
    ambient.stop();

    const nodes = deck.querySelectorAll(".chapter");
    const nextIndex = Math.max(0, Math.min(nodes.length - 1, i));
    const previous = nodes[index];
    if (nextIndex !== index && previous?.classList.contains("mode-consoles")) {
      previous.querySelectorAll("[data-consoles]").forEach((room) => {
        room._consolesDestroy?.();
      });
    }
    index = nextIndex;
    nodes.forEach((n, nIndex) => n.classList.toggle("active", nIndex === index));

    const ch = chapters[index];
    const prevEra = currentEra;
    const { nextEra, changed } = applyEra(ch, { animate: true });

    progressEl.textContent = progressLabel(ch);
    updateSlideIndexHud(ch);
    const eraNote = changed ? eraTransitionNote(prevEra, nextEra) : "";
    notesEl.textContent = notesBody(ch, eraNote);
    history.replaceState(null, "", `#${ch.id}`);
    syncMissionUI();
    syncStoryMenuActive();
    document.body.dataset.energy = energyForChapter(ch);

    const active = nodes[index];
    active.dataset.eraTheme = nextEra;
    if (
      (active?.classList.contains("mode-era") ||
        active?.classList.contains("mode-flash") ||
        active?.classList.contains("mode-paint") ||
        active?.classList.contains("mode-win95") ||
        active?.classList.contains("mode-win98") ||
        active?.classList.contains("mode-winxp") ||
        active?.classList.contains("mode-consoles") ||
        active?.classList.contains("mode-ie") ||
        active?.classList.contains("mode-timewarp")) &&
      !reduceMotion
    ) {
      const soft =
        active.classList.contains("mode-flash") ||
        active.classList.contains("mode-paint") ||
        active.classList.contains("mode-win95") ||
        active.classList.contains("mode-win98") ||
        active.classList.contains("mode-winxp") ||
        active.classList.contains("mode-consoles") ||
        active.classList.contains("mode-ie") ||
        active.classList.contains("mode-timewarp");
      blip(soft ? "correct" : "slam");
    }

    ambient.start(active, ch);
    hooks.onChapterEnter?.(ch, index);

    // Tray clocks: stop on every navigation, restart only while that hub is active
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      desktop._w95StopClock?.();
    });
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      desktop._w98StopClock?.();
    });
    deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
      desktop._wxpStopClock?.();
      desktop._wxpDestroyPictures?.();
      desktop._wxpDestroyFirefox?.();
      desktop._wxpCancelWin10Pack?.();
    });

    // Soft-enter hubs on revisit — preserve Mine/pinball/Ski mid-beat
    // (Win95 closes Atari/EP2 + destroys ad strip on enter).
    // Hard reset still available via desktop._resetWin95 / _resetWin98.
    if (ch.id === "win95" || active?.classList.contains("mode-win95")) {
      progress.setActiveSection("section1");
      enterWin95Desktop();
      active.querySelectorAll("[data-w95]").forEach((desktop) => {
        desktop._w95StartClock?.();
      });
      syncSectionUpdateUi("section1");
      syncRecycleBins();
    }

    if (ch.id === "win98" || active?.classList.contains("mode-win98")) {
      progress.setActiveSection("section2");
      progress.setCheckpointChapterId("win98");
      enterWin98Desktop();
      active.querySelectorAll("[data-w98]").forEach((desktop) => {
        desktop._w98StartClock?.();
      });
      syncSectionUpdateUi("section2");
    }

    if (ch.id === "winxp" || active?.classList.contains("mode-winxp")) {
      // Only promote progress once Section 2's update was actually consumed —
      // a direct/deep-link visit here (e.g. #winxp before finishing win98)
      // must still render the stub UI without corrupting section tracking.
      if (progress.isUpdateConsumed("section2")) {
        progress.setActiveSection("section3");
        progress.setCheckpointChapterId("winxp");
      }
      // Re-enter / jump: Bliss desktop; Pictures closed (no auto Win10 swap).
      active.querySelectorAll("[data-wxp]").forEach((desktop) => {
        if (typeof desktop._wxpEnter === "function") desktop._wxpEnter();
        else {
          desktop._wxpResetPowerOff?.();
          desktop._wxpResetWin10Pack?.();
          desktop.classList.add("is-bliss");
          desktop._wxpStartClock?.();
        }
      });
    }

    if (ch.id === "consoles" || active?.classList.contains("mode-consoles")) {
      active?.classList.remove("consoles-done");
      active?.querySelectorAll("[data-consoles]").forEach((room) => {
        room._consolesReset?.();
      });
    }

    if (ch.id === "timewarp" || active?.classList.contains("mode-timewarp")) {
      active?.classList.remove("timewarp-done");
      active?.querySelectorAll("[data-timewarp]").forEach((root) => {
        root._timewarpReset?.();
      });
    }

    // Auto-cue CRT hint class
    if (ch.id === "age-7") active?.classList.add("can-moment");
  }

  function next() {
    if (y2k.isRunning) {
      y2k.advance();
      return;
    }
    if (transition.isOpen) {
      if (!transition.advanceFromKey()) return;
      return;
    }
    if (boot.isRunning) {
      boot.skip();
      return;
    }
    if (crtBoot.isRunning) {
      crtBoot.skip();
      return;
    }
    if (win95BlocksAdvance()) {
      const desktop = deck.querySelector(".chapter.active [data-w95]");
      if (desktop?._w95NudgeAdvance?.()) {
        blip("press");
        return;
      }
      const hot =
        deck.querySelector(".chapter.active [data-w95-start]") ||
        deck.querySelector(".chapter.active [data-w95-mine-open]");
      if (hot) {
        hot.classList.remove("is-nudge");
        void hot.offsetWidth;
        hot.classList.add("is-nudge");
        setTimeout(() => hot.classList.remove("is-nudge"), 600);
      }
      blip("press");
      return;
    }
    if (win98BlocksAdvance()) {
      const desktop = deck.querySelector(".chapter.active [data-w98]");
      if (desktop?._w98NudgeAdvance?.()) {
        blip("press");
        return;
      }
      const themesEl = deck.querySelector(
        ".chapter.active [data-w98-themes-open]"
      );
      if (themesEl) {
        themesEl.classList.remove("is-nudge");
        void themesEl.offsetWidth;
        themesEl.classList.add("is-nudge");
        setTimeout(() => themesEl.classList.remove("is-nudge"), 600);
      }
      blip("press");
      return;
    }
    if (winxpBlocksAdvance()) {
      const desktop = deck.querySelector(".chapter.active [data-wxp]");
      if (desktop?._wxpNudgeAdvance?.()) {
        blip("press");
        return;
      }
      blip("press");
      return;
    }
    // Power-off beat: Next leaves XP → living room (soft-gate; skips black/static hold)
    const xpActive = deck.querySelector(".chapter.active.mode-winxp");
    if (xpActive?.classList.contains("wxp-powering-off")) {
      const desktop = xpActive.querySelector("[data-wxp]");
      if (desktop?._wxpLeavePowerOff?.()) return;
      goToConsoles();
      return;
    }
    if (consolesBlocksAdvance()) {
      const room = deck.querySelector(".chapter.active [data-consoles]");
      if (room?._consolesAdvance?.()) return;
      blip("press");
      return;
    }
    if (timewarpBlocksAdvance()) {
      const root = deck.querySelector(".chapter.active [data-timewarp]");
      if (root?._timewarpAdvance?.()) return;
      blip("press");
      return;
    }
    show(index + 1);
  }

  function prev() {
    if (y2k.isRunning) {
      y2k.abort();
      deck.querySelectorAll("[data-w98]").forEach((desktop) => {
        desktop._w98StartClock?.();
      });
      return;
    }
    if (transition.isOpen) {
      transition.hide();
      return;
    }
    if (boot.isRunning) {
      boot.skip();
      return;
    }
    if (crtBoot.isRunning) {
      crtBoot.skip();
      return;
    }
    if (timewarpBlocksAdvance()) {
      const root = deck.querySelector(".chapter.active [data-timewarp]");
      if (root?._timewarpPrev?.()) return;
    }
    show(index - 1);
  }

  function flashChrome() {
    document.body.classList.add("show-chrome");
    clearTimeout(chromeTimer);
    // Keep chrome visible while Story menu is open
    if (storyMenuOpen) return;
    chromeTimer = setTimeout(() => document.body.classList.remove("show-chrome"), 1600);
  }

  /**
   * Presenter story-arc beats (labels → destinations).
   * Optional points (e.g. consoles) only appear when that chapter exists.
   */
  function storyArcPoints() {
    /** @type {{ id:string, label:string, hotkey:string, chapterId?:string, kind:string }[]} */
    const points = [
      { id: "win95", label: "Win95", hotkey: "1", chapterId: "win95", kind: "chapter" },
      { id: "win98", label: "Win98", hotkey: "2", chapterId: "win98", kind: "chapter" },
      { id: "y2k", label: "Y2K (start)", hotkey: "3", chapterId: "win98", kind: "y2k" },
      { id: "winxp", label: "WinXP", hotkey: "4", chapterId: "winxp", kind: "chapter" },
      { id: "consoles", label: "PS2", hotkey: "5", chapterId: "consoles", kind: "chapter" },
      { id: "web20", label: "Firefox", hotkey: "6", chapterId: "winxp", kind: "firefox" },
      { id: "timewarp", label: "Timewarp", hotkey: "7", chapterId: "timewarp", kind: "chapter" },
      { id: "finale", label: "Switch 2 cue", hotkey: "8", chapterId: "make-impossible", kind: "chapter" },
    ];
    return points.filter((p) => {
      if (!p.chapterId) return true;
      return chapters.some((c) => c.id === p.chapterId);
    });
  }

  function chapterIndexById(id) {
    return chapters.findIndex((c) => c.id === id);
  }

  function clearPresenterOverlays() {
    if (boot.isRunning) boot.skip();
    if (crtBoot.isRunning) crtBoot.skip();
    if (y2k.isRunning) {
      y2k.abort();
      deck.querySelectorAll("[data-w98]").forEach((desktop) => {
        desktop._w98StartClock?.();
      });
    }
    if (transition.isOpen) transition.hide();
  }

  function goArc(pointId) {
    const points = storyArcPoints();
    const point =
      points.find((p) => p.id === pointId) ||
      points.find((p) => p.hotkey === String(pointId));
    if (!point) return false;

    clearPresenterOverlays();

    if (point.kind === "y2k") {
      const i = chapterIndexById("win98");
      if (i < 0) return false;
      show(i);
      progress.setActiveSection("section2");
      // Cheat-complete whatever section2.unlock.allOf requires (Chris, 1999).
      const required =
        progress.getSectionDef("section2")?.unlock?.allOf || ["chris1999"];
      for (const beatId of required) {
        progress.completeBeat(beatId, { sectionId: "section2" });
      }
      progress.rearmUpdate("section2");
      // Defer so win98 enter / clocks settle before theatre starts
      requestAnimationFrame(() => {
        beginY2kTransition();
      });
      setStoryMenuOpen(false);
      flashChrome();
      blip("press");
      return true;
    }

    if (point.kind === "firefox") {
      goToWeb20();
      setStoryMenuOpen(false);
      flashChrome();
      blip("press");
      return true;
    }

    const i = chapterIndexById(point.chapterId);
    if (i < 0) return false;
    show(i);
    setStoryMenuOpen(false);
    flashChrome();
    blip("press");
    return true;
  }

  function syncStoryMenuActive() {
    if (!storyMenuListEl) return;
    const chId = chapters[index]?.id;
    storyMenuListEl.querySelectorAll("[data-arc]").forEach((btn) => {
      const arcId = btn.getAttribute("data-arc");
      const xp = deck.querySelector(".chapter.active [data-wxp]");
      const firefoxOpen = Boolean(xp?._wxpFirefoxActive);
      const active =
        (arcId === "y2k" && y2k.isRunning && chId === "win98") ||
        (arcId === "finale" && (chId === "make-impossible" || chId === "source-reveal")) ||
        (arcId === "web20" && chId === "winxp" && firefoxOpen) ||
        (arcId === "winxp" && chId === "winxp" && !firefoxOpen) ||
        (arcId !== "y2k" &&
          arcId !== "finale" &&
          arcId !== "web20" &&
          arcId !== "winxp" &&
          arcId === chId);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  function buildStoryMenu() {
    if (!storyMenuListEl) return;
    const points = storyArcPoints();
    storyMenuListEl.innerHTML = points
      .map(
        (p) => `
      <li>
        <button type="button" class="story-menu-item" data-arc="${p.id}" data-hotkey="${p.hotkey}">
          <kbd>${p.hotkey}</kbd>
          <span>${p.label}</span>
        </button>
      </li>`
      )
      .join("");
    storyMenuListEl.querySelectorAll("[data-arc]").forEach((btn) => {
      btn.addEventListener("click", () => {
        goArc(btn.getAttribute("data-arc"));
      });
    });
    syncStoryMenuActive();
  }

  function setStoryMenuOpen(open) {
    storyMenuOpen = Boolean(open);
    document.body.classList.toggle("show-story-menu", storyMenuOpen);
    if (storyMenuEl) {
      if (storyMenuOpen) storyMenuEl.removeAttribute("hidden");
      else storyMenuEl.setAttribute("hidden", "");
    }
    if (storyMenuOpen) {
      clearTimeout(chromeTimer);
      document.body.classList.add("show-chrome");
      syncStoryMenuActive();
    } else {
      flashChrome();
    }
  }

  function toggleStoryMenu(force) {
    if (typeof force === "boolean") setStoryMenuOpen(force);
    else setStoryMenuOpen(!storyMenuOpen);
    if (storyMenuOpen) blip("press");
    return storyMenuOpen;
  }

  function toggleMission() {
    const ch = chapters[index];
    if (!ch?.mission) return;
    if (missionVisible.has(ch.id)) missionVisible.delete(ch.id);
    else missionVisible.add(ch.id);
    syncMissionUI();
    blip("press");
  }

  function mount() {
    const frag = document.createDocumentFragment();
    for (const ch of chapters) {
      frag.appendChild(ch.kind === "photo" ? renderPhotoChapter(ch) : renderTypeChapter(ch));
    }
    deck.appendChild(frag);
    finale.hydrate(deck);
    wireImages();
    wireQuiz();
    wireWin95Desktop();
    wireWin98Desktop();
    wireWinXpDesktop();
    wireConsolesChapter();
    wireTimewarpChapter();
    adaptive.wire(deck);

    for (const ch of chapters) {
      for (const src of ch.images || []) {
        const pre = new Image();
        pre.src = src;
      }
    }

    try {
      const saved = parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
      if (!Number.isNaN(saved)) score = saved;
    } catch {}
    setScore(score, false);
    applyMuteUI();

    const hash = location.hash.replace("#", "");
    // #web20 is no longer a chapter — land on XP + open Firefox
    const web20DeepLink = hash === "web20" || hash === "ie" || hash === "firefox";
    // #y2k is a story-arc beat (not a chapter id) — land win98 + start theatre
    const y2kDeepLink = hash === "y2k" || hash === "y2k-start";
    const start = hash && !web20DeepLink && !y2kDeepLink
      ? chapters.findIndex((s) => s.id === hash)
      : 0;
    const startIndex = web20DeepLink
      ? Math.max(0, chapters.findIndex((s) => s.id === "winxp"))
      : y2kDeepLink
        ? Math.max(0, chapters.findIndex((s) => s.id === "win98"))
        : start >= 0
          ? start
          : 0;
    show(startIndex);
    if (web20DeepLink) {
      requestAnimationFrame(() => {
        deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
          desktop._wxpOpenFirefox?.();
        });
      });
    }
    if (y2kDeepLink) {
      requestAnimationFrame(() => {
        goArc("y2k");
      });
    }

    // Cold open: boot overlay → Win95 hub (skip when deep-linking past #win95)
    const startCh = chapters[startIndex];
    if (!hash || startCh?.id === "win95") {
      boot.run({ reason: "start" });
    }

    root.getElementById("next")?.addEventListener("click", next);
    root.getElementById("prev")?.addEventListener("click", prev);
    root.getElementById("toggleNotes")?.addEventListener("click", () => {
      document.body.classList.toggle("show-notes");
    });
    root.getElementById("toggleStory")?.addEventListener("click", () => {
      toggleStoryMenu();
    });
    buildStoryMenu();

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", flashChrome);
    window.addEventListener("pointerdown", () => sfx.unlock(), { once: true });
  }

  function onKey(e) {
    const tag = (e.target && e.target.tagName) || "";
    const typing = tag === "INPUT" || tag === "TEXTAREA";
    const keyLower = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const isStoryToggle = !typing && (e.key === "`" || keyLower === "g");

    // Story menu — G / ` always available for presenter (even mid Y2K / boot)
    if (isStoryToggle) {
      e.preventDefault();
      toggleStoryMenu();
      flashChrome();
      return;
    }
    if (storyMenuOpen) {
      if (e.key === "Escape") {
        e.preventDefault();
        setStoryMenuOpen(false);
        flashChrome();
        return;
      }
      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        if (goArc(e.key)) return;
        flashChrome();
        return;
      }
      if (
        ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Enter"].includes(
          e.key
        )
      ) {
        e.preventDefault();
        return;
      }
    }

    // Boot opener — after load lines, key/click continues to desktop
    if (boot.isRunning) {
      if (["Escape", " ", "Spacebar", "Enter", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        if (boot.skip()) flashChrome();
      }
      return;
    }

    // Y2K theatre — Next/Space/click steps BSOD → reboot → install; Esc aborts
    if (y2k.isRunning) {
      if (["Escape"].includes(e.key)) {
        e.preventDefault();
        y2k.abort();
        deck.querySelectorAll("[data-w98]").forEach((desktop) => {
          desktop._w98StartClock?.();
        });
        flashChrome();
        return;
      }
      if (["Enter", " ", "Spacebar", "ArrowRight", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        y2k.advance();
        flashChrome();
        return;
      }
      // Any other key also advances a gate (BSOD copy says "Press any key")
      if (y2k.isGated && e.key.length === 1) {
        e.preventDefault();
        y2k.advance();
        flashChrome();
      }
      return;
    }

    // Era transition interstitial (Windows Update download gag)
    // Esc cancels; Enter/Space/→ skip fill, then advance once Continue is ready.
    if (transition.isOpen) {
      if (["Escape"].includes(e.key)) {
        e.preventDefault();
        transition.hide();
        flashChrome();
        return;
      }
      if (["Enter", " ", "Spacebar", "ArrowRight", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        transition.advanceFromKey();
        flashChrome();
        return;
      }
      return;
    }

    if (!typing && e.key === "Escape") {
      if (crtBoot.skip()) {
        e.preventDefault();
        flashChrome();
        return;
      }
    }

    // Win95 Start / Minesweeper / Atari — Esc + game keys before deck nav
    {
      const w95 = deck.querySelector(".chapter.active [data-w95]");
      if (w95?._w95HandleKey?.(e)) {
        flashChrome();
        return;
      }
    }

    // Win98 Start / Space Cadet / SkiFree — Esc + game keys before deck nav
    {
      const w98 = deck.querySelector(".chapter.active [data-w98]");
      if (w98?._w98HandleKey?.(e)) {
        flashChrome();
        return;
      }
    }

    // WinXP My Pictures — ←/→ before deck nav
    {
      const wxp = deck.querySelector(".chapter.active [data-wxp]");
      if (wxp?._wxpHandleKey?.(e)) {
        flashChrome();
        return;
      }
    }

    if (!typing && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      document.body.classList.add("show-score");
      setScore(score + 1, true);
      flashChrome();
      return;
    }
    if (!typing && (e.key === "-" || e.key === "_")) {
      e.preventDefault();
      document.body.classList.add("show-score");
      setScore(score - 1, true);
      flashChrome();
      return;
    }
    if (!typing && e.key === "0") {
      e.preventDefault();
      document.body.classList.add("show-score");
      setScore(0, true);
      flashChrome();
      return;
    }
    if (!typing && e.key.toLowerCase() === "m") {
      muted = !muted;
      applyMuteUI();
      window.dispatchEvent(
        new CustomEvent("sipnsplain:mutechange", { detail: { muted } })
      );
      if (!muted) blip("press");
      flashChrome();
      return;
    }
    if (!typing && e.key.toLowerCase() === "s") {
      document.body.classList.toggle("show-score");
      flashChrome();
      return;
    }
    if (!typing && e.key.toLowerCase() === "a") {
      e.preventDefault();
      toggleMission();
      flashChrome();
      return;
    }
    if (!typing && e.key.toLowerCase() === "y") {
      e.preventDefault();
      if (runActiveMoment()) flashChrome();
      return;
    }
    if (!typing && (e.key === "]" || e.key === ".")) {
      if (cycleActivePhoto(1)) {
        e.preventDefault();
        flashChrome();
        return;
      }
    }
    if (!typing && (e.key === "[" || e.key === ",")) {
      if (cycleActivePhoto(-1)) {
        e.preventDefault();
        flashChrome();
        return;
      }
    }
    if (!typing && e.key.toLowerCase() === "n") {
      document.body.classList.toggle("show-notes");
      flashChrome();
      return;
    }
    // I — toggle slide index HUD (canonical # / number for screenshots)
    if (!typing && e.key.toLowerCase() === "i") {
      e.preventDefault();
      document.body.classList.toggle("hide-slide-index");
      flashChrome();
      return;
    }
    if (!typing && (e.key === "f" || e.key === "F")) {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
      flashChrome();
      return;
    }

    const focusEl = document.activeElement;
    const focusIsControl =
      focusEl &&
      (focusEl.matches("button, .frame, [data-result], [data-audience]") ||
        focusEl.closest("button, .frame"));

    // Shift+Arrow — presenter escape nav (never trapped; no shame)
    if (e.shiftKey && ["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      stopTimewarpHold();
      const consoles = deck.querySelector(".chapter.active [data-consoles][data-ps2]");
      if (consoles?.dataset.ps2Phase === "shutdown") {
        consoles._consolesAdvance?.();
        flashChrome();
        return;
      }
      show(index + 1);
      flashChrome();
      return;
    }
    if (e.shiftKey && ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      stopTimewarpHold();
      show(index - 1);
      flashChrome();
      return;
    }

    // Timewarp hold-to-scrub (keydown repeat suppressed; custom interval)
    if (
      timewarpBlocksAdvance() &&
      !e.repeat &&
      (e.key === "ArrowRight" || e.key === "ArrowLeft")
    ) {
      e.preventDefault();
      const root = deck.querySelector(".chapter.active [data-timewarp]");
      const delta = e.key === "ArrowRight" ? 1 : -1;
      root?._timewarpStartHold?.(delta);
      flashChrome();
      return;
    }

    // PS2 / consoles — arrows stay in hub (scrub Browser strip when open).
    // Space / Next still soft-skip via next(); Shift+Arrow escapes above.
    if (
      consolesBlocksAdvance() &&
      ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)
    ) {
      e.preventDefault();
      const room = deck.querySelector(".chapter.active [data-consoles]");
      const delta = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      room?._consolesHandleArrow?.(delta);
      flashChrome();
      return;
    }

    if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      next();
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      prev();
    } else if (e.key === " " || e.key === "Spacebar") {
      if (focusIsControl && focusEl.matches(".frame, button")) {
        // let control handler run
      } else {
        e.preventDefault();
        next();
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
    } else if (e.key === "End") {
      e.preventDefault();
      show(chapters.length - 1);
    }
    flashChrome();
  }

  function stopTimewarpHold() {
    deck.querySelectorAll("[data-timewarp]").forEach((root) => {
      root._timewarpStopHold?.();
    });
  }

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") stopTimewarpHold();
  });
  window.addEventListener("blur", stopTimewarpHold);

  mount();
  return api;
}
