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
  CHRIS_2000_PHOTO,
  applyW98Theme,
  getW98Theme,
} from "./moments/w98-themes.js";
import { createProgress } from "./progress.js";
import { createTransition } from "./transition.js";
import { createY2kTransition } from "./moments/y2k-transition.js";

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
  const eraBadge = root.getElementById("eraBadge");

  let index = 0;
  let chromeTimer;
  let score = 0;
  let muted = false;
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
      syncSectionUpdateUi(sectionId);
      blip("updateUnlock");
      if (sectionId === "section2") {
        api.toast?.("Y2K · clock takeover armed…");
        // Auto-start so it “happens to” the room (Chris, 2000 typically last).
        scheduleY2kTransition();
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
    if (!sectionId || sectionId === "section2") {
      syncHub("[data-w98]", "[data-w98-update]", "[data-w98-update-menu]", "section2");
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

  /** Presenter: force the 98→XP Y2K sequence when section2 is unlocked. */
  api.startY2k = () => beginY2kTransition();

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
      ch.kind === "winxp";
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

    if (eraBadge) {
      eraBadge.textContent = `${meta.years} · ${meta.label}`;
      eraBadge.title = meta.evoke;
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
      const netWin = desktop.querySelector("[data-w95-net]");
      const mineWin = desktop.querySelector("[data-w95-mine]");
      const paintWin = desktop.querySelector("[data-w95-paint]");
      const mcTask = desktop.querySelector('[data-w95-task="mc"]');
      const photoTask = desktop.querySelector('[data-w95-task="photo"]');
      const netTask = desktop.querySelector('[data-w95-task="net"]');
      const mineTask = desktop.querySelector('[data-w95-task="mine"]');
      const paintTask = desktop.querySelector('[data-w95-task="paint"]');
      const startBtn = desktop.querySelector("[data-w95-start]");
      const startMenu = desktop.querySelector("[data-w95-start-menu]");
      const mineCanvas = desktop.querySelector("[data-w95-mine-canvas]");

      const page = desktop.querySelector("[data-g98-page]");
      const googleLogo = desktop.querySelector("[data-g98-google]");
      const backrub = desktop.querySelector("[data-g98-backrub]");
      const earlyLogo = desktop.querySelector("[data-g98-early]");
      const tag = desktop.querySelector("[data-g98-tag]");
      const indexLine = desktop.querySelector("[data-g98-index]");
      const titleEl = desktop.querySelector("[data-g98-title]");
      const searchBtn = desktop.querySelector("[data-g98-search]");
      const luckyBtn = desktop.querySelector("[data-g98-lucky]");

      /** @type {ReturnType<typeof createMinesweeper> | null} */
      let mineGame = null;

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
       * @param {'mc'|'photo'|'net'|'mine'|'paint'|null} which — one active window at a time
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
        const netOpen = which === "net";
        const mineOpen = which === "mine";
        const paintOpen = which === "paint";

        if (win) {
          win.classList.toggle("is-closed", !mcOpen);
          win.setAttribute("aria-hidden", mcOpen ? "false" : "true");
        }
        if (photoWin) {
          photoWin.classList.toggle("is-closed", !photoOpen);
          photoWin.setAttribute("aria-hidden", photoOpen ? "false" : "true");
        }
        if (netWin) {
          netWin.classList.toggle("is-closed", !netOpen);
          netWin.setAttribute("aria-hidden", netOpen ? "false" : "true");
        }
        if (mineWin) {
          mineWin.classList.toggle("is-closed", !mineOpen);
          mineWin.setAttribute("aria-hidden", mineOpen ? "false" : "true");
        }
        if (paintWin) {
          paintWin.classList.toggle("is-closed", !paintOpen);
          paintWin.setAttribute("aria-hidden", paintOpen ? "false" : "true");
          if (paintOpen) {
            paintWin.querySelector("[data-paint]")?._paintOnOpen?.();
          }
        }

        if (mcTask) {
          mcTask.hidden = !mcOpen;
          mcTask.classList.toggle("is-pressed", mcOpen);
        }
        if (photoTask) {
          photoTask.hidden = !photoOpen;
          photoTask.classList.toggle("is-pressed", photoOpen);
        }
        if (netTask) {
          netTask.hidden = !netOpen;
          netTask.classList.toggle("is-pressed", netOpen);
        }
        if (mineTask) {
          mineTask.hidden = !mineOpen;
          mineTask.classList.toggle("is-pressed", mineOpen);
        }
        if (paintTask) {
          paintTask.hidden = !paintOpen;
          paintTask.classList.toggle("is-pressed", paintOpen);
        }

        if (mineGame) {
          if (mineOpen) {
            mineGame.start();
          } else {
            mineGame.stop();
          }
        }

        desktop.classList.toggle(
          "is-window-closed",
          !mcOpen && !photoOpen && !netOpen && !mineOpen && !paintOpen
        );
        desktop.dataset.w95Active = which || "none";
        desktop._w95MineActive = mineOpen;
        desktop._w95PaintActive = paintOpen;

        // Leaving the rescued photo empties the bin (×, another app, or Empty).
        if (willEmptyBin) emptyRecycleBin({ animate: true });

        if (!opts.silent) {
          if (which && which !== prev) blip("windowOpen");
          else if (!which && prev && !willEmptyBin) blip("windowClose");
        }
      };

      mineGame = mineCanvas
        ? createMinesweeper(mineCanvas, {
            onWin: () => {
              completeSectionBeat("minesweeper", { photo: true, meta: { via: "clear" } });
            },
            onReward: () => blip("beat"),
            onFlag: () => blip("mineFlag"),
          })
        : null;
      desktop._w95MineGame = mineGame;

      const canAdvance = () => Boolean(chapter?.classList.contains("w95-unlocked"));

      const revealBackRub = () => {
        if (!page || page.classList.contains("is-backrub")) return false;
        page.classList.add("is-backrub");
        page.classList.remove("is-early");
        if (googleLogo) googleLogo.hidden = true;
        if (earlyLogo) earlyLogo.hidden = true;
        if (backrub) {
          backrub.hidden = false;
          backrub.setAttribute("aria-hidden", "false");
        }
        if (tag) tag.textContent = "Before it was Google, it was BackRub.";
        if (indexLine) {
          indexLine.innerHTML = "<em>Answer found · ~1 result that mattered</em>";
        }
        if (titleEl) titleEl.textContent = "The Internet — BackRub";
        blip("correct");
        return true;
      };

      /** Click BackRub → classic Google! (loop; Search reveals BackRub again) */
      const restoreClassicGoogle = () => {
        if (!page || !page.classList.contains("is-backrub")) return false;
        page.classList.remove("is-backrub", "is-early");
        if (backrub) {
          backrub.hidden = true;
          backrub.setAttribute("aria-hidden", "true");
        }
        if (earlyLogo) earlyLogo.hidden = true;
        if (googleLogo) googleLogo.hidden = false;
        if (tag) tag.textContent = "Search the web using Google!";
        if (indexLine) {
          indexLine.innerHTML =
            "<em>Index contains ~25 million pages (soon to be much bigger)</em>";
        }
        if (titleEl) titleEl.textContent = "The Internet — Google!";
        blip("press");
        return true;
      };

      /** Lucky gag — early 3D logo; never advances past Section 1 gate */
      const revealFeelingLucky = () => {
        if (!page) return false;
        page.classList.add("is-early");
        page.classList.remove("is-backrub");
        if (googleLogo) googleLogo.hidden = true;
        if (backrub) {
          backrub.hidden = true;
          backrub.setAttribute("aria-hidden", "true");
        }
        if (earlyLogo) earlyLogo.hidden = false;
        if (tag) tag.textContent = "I'm Feeling Lucky took you somewhere older.";
        if (indexLine) {
          indexLine.innerHTML = "<em>Lucky result · still not Windows Update</em>";
        }
        if (titleEl) titleEl.textContent = "The Internet — Feeling Lucky";
        blip("correct");
        return true;
      };

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
        const netOpen = netWin && !netWin.classList.contains("is-closed");
        if (!netOpen) {
          nudge(desktop.querySelector("[data-w95-internet]"));
          return true;
        }
        // Internet is a room gag — nudge Search, not Lucky-as-exit
        nudge(searchBtn);
        return true;
      };

      /** Esc / arrows when Minesweeper, Paint, or Start menu is active */
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
        if (desktop._w95PaintActive && e.key === "Escape") {
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
        // Paint / Minesweeper open — never let deck ←/→/↑/↓/PageUp/PageDown/Space
        // fall through to next()/prev() while playing.
        if (
          (desktop._w95PaintActive || desktop._w95MineActive) &&
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
        // Keep w95-unlocked only after Section 1 update was consumed (not Lucky)
        const keepUnlock = progress.isUpdateConsumed("section1");
        chapter?.classList.toggle("w95-unlocked", keepUnlock);
        chapter?.classList.toggle("quiz-solved", keepUnlock);
        page?.classList.remove("is-backrub", "is-early");
        if (googleLogo) googleLogo.hidden = false;
        if (backrub) {
          backrub.hidden = true;
          backrub.setAttribute("aria-hidden", "true");
          backrub.classList.remove("is-nudge");
        }
        if (earlyLogo) earlyLogo.hidden = true;
        if (tag) tag.textContent = "Search the web using Google!";
        if (indexLine) {
          indexLine.innerHTML =
            "<em>Index contains ~25 million pages (soon to be much bigger)</em>";
        }
        if (titleEl) titleEl.textContent = "The Internet — Google!";
        searchBtn?.classList.remove("is-nudge");
        luckyBtn?.classList.remove("is-nudge");
        desktop.querySelectorAll(".is-wrong, .is-nudge").forEach((el) => {
          el.classList.remove("is-wrong", "is-nudge");
        });
        closeStartMenu();
        setActive(null, { silent: true });
        const shutdownDlg = desktop.querySelector("[data-w95-shutdown-dlg]");
        if (shutdownDlg) {
          shutdownDlg.classList.add("is-closed");
          shutdownDlg.setAttribute("aria-hidden", "true");
        }
        paintWin?.querySelector("[data-paint]")?._paintReset?.();
        mineGame?.reset();
        syncSectionUpdateUi("section1");
        syncRecycleIcon();
      };

      desktop._resetWin95 = resetWin95;

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

      desktop.querySelectorAll("[data-w95-net-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Close only — never advance (Lucky is the sole exit)
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

      desktop._w95ClosePaint = () => {
        setActive(null);
      };

      desktop.querySelectorAll("[data-w95-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("mc");
        });
      });

      desktop.querySelectorAll("[data-w95-muted]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          blip("wrong");
        });
      });

      photoTask?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeStartMenu();
        setActive("photo");
      });

      desktop.querySelectorAll("[data-w95-internet]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("net");
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
          setActive("mine");
        });
      });

      desktop.querySelectorAll("[data-w95-paint-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("paint");
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

      searchBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Google Search NEVER advances — toggles Google! → BackRub only
        if (page?.classList.contains("is-backrub")) {
          blip("press");
          return;
        }
        revealBackRub();
      });

      luckyBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Gag only — never skip Section 1 required beats / land on #win98
        if (progress.isUpdateConsumed("section1")) {
          chapter?.classList.add("w95-unlocked", "quiz-solved");
          blip("correct");
          next();
          return;
        }
        revealFeelingLucky();
      });

      backrub?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        restoreClassicGoogle();
      });
      backrub?.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        restoreClassicGoogle();
      });
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

  function resetWin95Desktop() {
    deck.querySelectorAll("[data-w95]").forEach((desktop) => {
      desktop._resetWin95?.();
    });
  }

  function resetWin98Desktop() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      desktop._resetWin98?.();
    });
  }

  /** Section 2 hub — kit-styled desktop + Desktop Themes + Space Cadet + SkiFree. */
  function wireWin98Desktop() {
    deck.querySelectorAll("[data-w98]").forEach((desktop) => {
      const welcomeWin = desktop.querySelector("[data-w98-welcome]");
      const themesWin = desktop.querySelector("[data-w98-themes]");
      const chrisPhotoWin = desktop.querySelector("[data-w98-chris-photo]");
      const pinballWin = desktop.querySelector("[data-pinball]");
      const pinballPhotoWin = desktop.querySelector("[data-pinball-photo]");
      const skiWin = desktop.querySelector("[data-w98-ski]");
      const skiPhotoWin = desktop.querySelector("[data-w98-ski-photo]");
      const welcomeTask = desktop.querySelector('[data-w98-task="welcome"]');
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

      /**
       * @param {'welcome'|'themes'|'chrisphoto'|'datetime'|'pinball'|'pinballphoto'|'ski'|'skiphoto'|null} which
       * Era photo stacks on top of Space Cadet — pinball chrome stays open so
       * the reveal → Continue gate remains reachable (not buried under is-closed).
       * SkiFree reward is a full-bleed cover inside the Ski client (skiphoto),
       * not a separate offset photo window.
       */
      const setActive = (which) => {
        const welcomeOpen = which === "welcome";
        const themesOpen = which === "themes";
        const chrisPhotoOpen = which === "chrisphoto";
        const datetimeOpen = which === "datetime";
        const pinballPhotoOpen = which === "pinballphoto";
        const pinballOpen = which === "pinball" || pinballPhotoOpen;
        const skiPhotoOpen = which === "skiphoto";
        const skiOpen = which === "ski" || skiPhotoOpen;

        if (welcomeWin) {
          welcomeWin.classList.toggle("is-closed", !welcomeOpen);
          welcomeWin.setAttribute("aria-hidden", welcomeOpen ? "false" : "true");
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
        if (welcomeTask) {
          welcomeTask.hidden = !welcomeOpen;
          welcomeTask.classList.toggle("is-pressed", welcomeOpen);
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
          !welcomeOpen &&
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

      const syncWin98ContinueGate = () => {
        const unlocked = progress.isUpdateUnlocked("section2");
        const st = progress.requiredStatus("section2");
        const missing = [
          ...(st?.allOf || []).filter((b) => !b.complete).map((b) => b.label),
        ];
        desktop.querySelectorAll("[data-w98-continue]").forEach((btn) => {
          btn.disabled = !unlocked;
          btn.title = unlocked
            ? "Y2K → Install Windows XP…"
            : missing.length
              ? `Still need: ${missing.join(" · ")}`
              : "SkiFree · Pinball · Chris, 2000";
        });
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
          if (chrisPhotoImg) chrisPhotoImg.src = CHRIS_2000_PHOTO;
          completeSectionBeat("chris2000", {
            sectionId: "section2",
            photo: true,
            meta: { via: "desktop-themes" },
          });
          syncWin98ContinueGate();
          syncSectionUpdateUi("section2");
          closeStartMenu();
          setActive("chrisphoto");
          blip("photo");
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
              // Stay on hub — Chris, 2000 / Desktop Themes is the Section 2 exit.
            },
          })
        : null;

      skiGame = skiWin
        ? createSkiFree(skiWin, {
            scoreEl: skiScore,
            statusEl: skiStatus,
            onEsc: () => {
              setActive("welcome");
              blip("press");
            },
            // Finish → yeti → Game Over panel; beat completes only on confirm → photo.
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
            setActive("welcome");
            blip("press");
            return true;
          }
          if (pinballGame?.handleDeckKey(e)) return true;
        }
        if (desktop._w98SkiActive) {
          if (e.key === "Escape") {
            e.preventDefault();
            setActive("welcome");
            blip("press");
            return true;
          }
          if (skiGame?.handleDeckKey(e)) return true;
        }
        const escClosable = ["welcome", "themes", "chrisphoto"];
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
        // Any modal window open (welcome / themes / chrisphoto / datetime / photo
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
        closeStartMenu();
        applyW98Theme(desktop, appliedThemeId || "default");
        selectedThemeId = appliedThemeId;
        buildThemesList();
        syncThemesListUi();
        setActive("welcome");
        pinballGame?.reset();
        skiGame?.stop();
        syncWin98ContinueGate();
        syncSectionUpdateUi("section2");
        desktop._triggerPinballEraReveal = () =>
          pinballGame?.triggerPinballEraReveal?.();
      };

      desktop._resetWin98 = resetWin98;
      buildThemesList();
      resetWin98();

      desktop.querySelectorAll("[data-w98-welcome-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive(null);
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-welcome-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("welcome");
          blip("press");
        });
      });

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
          setActive("welcome");
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-pinball-photo-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Return to Space Cadet so Continue stays one click away after reveal.
          setActive(pinballGame?.hasRevealed?.() ? "pinball" : "welcome");
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-pinball-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          setActive("pinball");
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
          blip("press");
        });
      });

      desktop.querySelectorAll("[data-w98-ski-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setActive("welcome");
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

      desktop.querySelectorAll("[data-w98-update]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          if (!openSectionUpdate("section2")) return;
          blip(btn.hasAttribute("data-w98-boot-disk") ? "windowOpen" : "transition");
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

      desktop.querySelectorAll("[data-w98-continue]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          closeStartMenu();
          if (!progress.isUpdateUnlocked("section2")) {
            setActive("themes");
            selectedThemeId = appliedThemeId;
            buildThemesList();
            syncThemesListUi();
            blip("press");
            return;
          }
          if (!openSectionUpdate("section2")) {
            blip("press");
            return;
          }
          blip("transition");
        });
      });

      desktop.addEventListener("pointerdown", (e) => {
        if (startMenu?.hidden) return;
        if (e.target.closest("[data-w98-start-menu], [data-w98-start]")) return;
        closeStartMenu();
      });
    });
  }

  /** Section 3 stub hub — Bliss desktop + tray clock (Luna kit later). */
  function wireWinXpDesktop() {
    deck.querySelectorAll("[data-wxp]").forEach((desktop) => {
      const welcome = desktop.querySelector("[data-wxp-welcome]");
      const clockEl = desktop.querySelector(".wxp-clock");
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

      const setWelcome = (open) => {
        if (!welcome) return;
        welcome.classList.toggle("is-closed", !open);
        welcome.setAttribute("aria-hidden", open ? "false" : "true");
      };
      desktop.querySelectorAll("[data-wxp-welcome-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setWelcome(false);
          blip("press");
        });
      });
      desktop.querySelectorAll("[data-wxp-welcome-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setWelcome(true);
          blip("press");
        });
      });
      setWelcome(true);
    });
  }

  function wirePaintTitle() {
    deck.querySelectorAll("[data-paint]").forEach((paintRoot) => {
      const surface = paintRoot.querySelector("[data-paint-surface]");
      const canvas = paintRoot.querySelector("[data-paint-draw]");
      if (!surface || !canvas) return;

      const ctx2d = canvas.getContext("2d", { willReadFrequently: true });
      const chapter = paintRoot.closest(".chapter");
      const w95Desktop = paintRoot.closest("[data-w95]");
      const fgEl = paintRoot.querySelector("[data-paint-fg]");
      const coordsEl = paintRoot.querySelector("[data-paint-coords]");
      const statusEl = paintRoot.querySelector("[data-paint-status]");
      const helpDlg = paintRoot.querySelector("[data-paint-help]");
      const optsEl = paintRoot.querySelector("[data-paint-opts]");

      /** @type {string} */
      let tool = "eraser";
      let color = "#000000";
      let toolSize = 14;
      let drawing = false;
      let lastX = 0;
      let lastY = 0;
      let startX = 0;
      let startY = 0;
      let sprayTimer = null;
      /** @type {ImageData | null} */
      let snap = null;
      let dpr = 1;
      let cssW = 0;
      let cssH = 0;
      let coverReady = false;
      let paintBeatDone = progress.isBeatComplete("paint");
      /** Erased alpha sample ratio that counts as “photo meaningfully revealed”. */
      const PAINT_REVEAL_THRESHOLD = 0.08;

      const TOOL_STATUS = {
        spray: "Airbrush — paint on the white cover (or over the reveal).",
        pencil: "Pencil — drag to draw.",
        brush: "Brush — thicker freehand.",
        eraser: "Eraser — drag to reveal the photo under the white.",
        fill: "Fill — click a region to flood-fill the cover.",
        drop: "Pick Color — click the canvas to sample.",
        text: "Text — click to type. Enter commits · Esc cancels.",
        line: "Line — click and drag.",
        rect: "Rectangle — click and drag.",
        oval: "Ellipse — click and drag.",
        round: "Rounded rectangle — click and drag.",
        select: "Select — drag a marquee (visual only).",
        lasso: "Free-form select — visual only.",
        zoom: "Magnifier — visual only (stub).",
        curve: "Curve — stub (use Line).",
        poly: "Polygon — stub (use Rectangle).",
      };

      const fillWhiteCover = () => {
        if (cssW < 8 || cssH < 8) return;
        ctx2d.save();
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx2d.globalCompositeOperation = "source-over";
        ctx2d.fillStyle = "#ffffff";
        ctx2d.fillRect(0, 0, cssW, cssH);
        ctx2d.restore();
        coverReady = true;
      };

      // Match bitmap to the surface. Init often runs while the window is
      // display:none (0×0) — never lock a tiny inline size like 320×240.
      const resizeCanvas = () => {
        const rect = surface.getBoundingClientRect();
        const w = Math.floor(rect.width);
        const h = Math.floor(rect.height);
        if (w < 8 || h < 8) return;

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const bw = Math.floor(w * dpr);
        const bh = Math.floor(h * dpr);
        cssW = w;
        cssH = h;
        if (canvas.width === bw && canvas.height === bh) {
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
          if (!coverReady) fillWhiteCover();
          return;
        }

        const prev = document.createElement("canvas");
        prev.width = canvas.width;
        prev.height = canvas.height;
        const hadPrev = prev.width > 0 && prev.height > 0 && coverReady;
        if (hadPrev) {
          prev.getContext("2d").drawImage(canvas, 0, 0);
        }
        canvas.width = bw;
        canvas.height = bh;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (hadPrev) {
          ctx2d.drawImage(prev, 0, 0, w, h);
        } else {
          fillWhiteCover();
        }
      };
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      if (typeof ResizeObserver !== "undefined") {
        const ro = new ResizeObserver(() => resizeCanvas());
        ro.observe(surface);
      }
      if (chapter && typeof MutationObserver !== "undefined") {
        const mo = new MutationObserver(() => {
          if (chapter.classList.contains("active")) {
            requestAnimationFrame(resizeCanvas);
          }
        });
        mo.observe(chapter, { attributes: true, attributeFilter: ["class"] });
      }

      const setStatus = (msg) => {
        if (statusEl) statusEl.textContent = msg;
      };

      const setTool = (name) => {
        tool = name;
        paintRoot.querySelectorAll("[data-paint-tool]").forEach((btn) => {
          btn.classList.toggle("is-on", btn.dataset.paintTool === name);
        });
        surface.dataset.tool = name;
        if (optsEl) {
          optsEl.title =
            name === "spray" ? "Spray size"
              : name === "brush" || name === "eraser" ? "Brush / eraser size"
                : "Size";
        }
        setStatus(TOOL_STATUS[name] || "Tool selected.");
        commitTextEditor(true);
      };

      const setColor = (c) => {
        color = c;
        if (fgEl) fgEl.style.background = c;
      };

      const localPos = (e) => {
        const rect = surface.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };

      const saveSnap = () => {
        ctx2d.save();
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        snap = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        ctx2d.restore();
      };

      const restoreSnap = () => {
        if (!snap) return;
        ctx2d.save();
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        ctx2d.putImageData(snap, 0, 0);
        ctx2d.restore();
      };

      const strokeStyle = () => {
        ctx2d.strokeStyle = color;
        ctx2d.fillStyle = color;
        ctx2d.lineCap = "round";
        ctx2d.lineJoin = "round";
      };

      const sprayAt = (x, y) => {
        const count = Math.max(8, Math.floor(toolSize * 1.2));
        ctx2d.fillStyle = color;
        for (let i = 0; i < count; i++) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * toolSize;
          const px = x + Math.cos(a) * r;
          const py = y + Math.sin(a) * r;
          const s = Math.random() < 0.35 ? 1.5 : 1;
          ctx2d.fillRect(px, py, s, s);
        }
      };

      const freehandTo = (x, y, width, erase = false) => {
        ctx2d.save();
        if (erase) {
          // Punch holes in the white cover → photo underneath shows through
          ctx2d.globalCompositeOperation = "destination-out";
          ctx2d.strokeStyle = "#000";
        } else {
          ctx2d.globalCompositeOperation = "source-over";
          ctx2d.strokeStyle = color;
        }
        ctx2d.lineWidth = width;
        ctx2d.lineCap = "round";
        ctx2d.lineJoin = "round";
        ctx2d.beginPath();
        ctx2d.moveTo(lastX, lastY);
        ctx2d.lineTo(x, y);
        ctx2d.stroke();
        ctx2d.restore();
        lastX = x;
        lastY = y;
      };

      const eraseAt = (x, y) => {
        ctx2d.save();
        ctx2d.globalCompositeOperation = "destination-out";
        ctx2d.fillStyle = "#000";
        ctx2d.beginPath();
        ctx2d.arc(x, y, Math.max(4, toolSize * 0.55), 0, Math.PI * 2);
        ctx2d.fill();
        ctx2d.restore();
      };

      /** Sample canvas alpha — destination-out punches transparency for the photo. */
      const measureRevealRatio = () => {
        if (!coverReady || canvas.width < 8 || canvas.height < 8) return 0;
        ctx2d.save();
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        const img = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        ctx2d.restore();
        const data = img.data;
        let erased = 0;
        let samples = 0;
        // Stride sample for perf (every 4th pixel)
        for (let i = 3; i < data.length; i += 16) {
          samples++;
          if (data[i] < 128) erased++;
        }
        return samples ? erased / samples : 0;
      };

      const maybeCompletePaint = () => {
        if (paintBeatDone) return;
        const ratio = measureRevealRatio();
        if (ratio < PAINT_REVEAL_THRESHOLD) return;
        paintBeatDone = true;
        completeSectionBeat("paint", {
          photo: true,
          meta: { via: "erase", ratio: Number(ratio.toFixed(3)) },
        });
        setStatus("Photo revealed — nice.");
        blip("beat");
      };

      const drawShape = (x0, y0, x1, y1, kind, preview = false) => {
        const left = Math.min(x0, x1);
        const top = Math.min(y0, y1);
        const w = Math.abs(x1 - x0);
        const h = Math.abs(y1 - y0);
        strokeStyle();
        ctx2d.lineWidth = kind === "select" ? 1 : Math.max(1.5, toolSize * 0.12);
        if (kind === "select") {
          ctx2d.save();
          ctx2d.strokeStyle = "#000080";
          ctx2d.setLineDash([4, 3]);
          ctx2d.strokeRect(left + 0.5, top + 0.5, w, h);
          ctx2d.restore();
          return;
        }
        if (kind === "line") {
          ctx2d.beginPath();
          ctx2d.moveTo(x0, y0);
          ctx2d.lineTo(x1, y1);
          ctx2d.stroke();
          return;
        }
        if (kind === "oval") {
          ctx2d.beginPath();
          ctx2d.ellipse(left + w / 2, top + h / 2, Math.max(0.5, w / 2), Math.max(0.5, h / 2), 0, 0, Math.PI * 2);
          ctx2d.stroke();
          return;
        }
        if (kind === "round") {
          const r = Math.min(12, w / 4, h / 4);
          ctx2d.beginPath();
          ctx2d.moveTo(left + r, top);
          ctx2d.arcTo(left + w, top, left + w, top + h, r);
          ctx2d.arcTo(left + w, top + h, left, top + h, r);
          ctx2d.arcTo(left, top + h, left, top, r);
          ctx2d.arcTo(left, top, left + w, top, r);
          ctx2d.closePath();
          ctx2d.stroke();
          return;
        }
        // rect
        ctx2d.strokeRect(left + 0.5, top + 0.5, w, h);
        if (preview) { /* keep lint quiet */ }
      };

      const hexToRgba = (hex) => {
        let h = (hex || "#000000").replace("#", "");
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        const n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
      };

      const floodFill = (cssX, cssY, fillHex) => {
        const bx = Math.floor(cssX * dpr);
        const by = Math.floor(cssY * dpr);
        if (bx < 0 || by < 0 || bx >= canvas.width || by >= canvas.height) return;

        ctx2d.save();
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        const img = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
        const data = img.data;
        const w = img.width;
        const h = img.height;
        const i0 = (by * w + bx) * 4;
        const tr = data[i0];
        const tg = data[i0 + 1];
        const tb = data[i0 + 2];
        const ta = data[i0 + 3];
        const [fr, fg, fb, fa] = hexToRgba(fillHex);

        // Treat fully transparent as white canvas bg
        const sr = ta === 0 ? 255 : tr;
        const sg = ta === 0 ? 255 : tg;
        const sb = ta === 0 ? 255 : tb;
        const sa = ta === 0 ? 255 : ta;

        if (sr === fr && sg === fg && sb === fb && sa === fa) {
          ctx2d.restore();
          return;
        }

        const match = (i) => {
          const a = data[i + 3];
          if (a === 0) return sa === 255 && sr === 255 && sg === 255 && sb === 255;
          return data[i] === sr && data[i + 1] === sg && data[i + 2] === sb && a === sa;
        };

        const stack = [bx, by];
        const seen = new Uint8Array(w * h);
        let guard = 0;
        const max = w * h;

        while (stack.length && guard < max) {
          const y = stack.pop();
          const x = stack.pop();
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const idx = y * w + x;
          if (seen[idx]) continue;
          let lx = x;
          while (lx >= 0 && match((y * w + lx) * 4) && !seen[y * w + lx]) lx--;
          lx++;
          let spanUp = false;
          let spanDown = false;
          while (lx < w && match((y * w + lx) * 4) && !seen[y * w + lx]) {
            const pi = (y * w + lx) * 4;
            data[pi] = fr;
            data[pi + 1] = fg;
            data[pi + 2] = fb;
            data[pi + 3] = fa;
            seen[y * w + lx] = 1;
            guard++;
            if (y > 0) {
              const up = match(((y - 1) * w + lx) * 4) && !seen[(y - 1) * w + lx];
              if (up && !spanUp) {
                stack.push(lx, y - 1);
                spanUp = true;
              } else if (!up) spanUp = false;
            }
            if (y < h - 1) {
              const dn = match(((y + 1) * w + lx) * 4) && !seen[(y + 1) * w + lx];
              if (dn && !spanDown) {
                stack.push(lx, y + 1);
                spanDown = true;
              } else if (!dn) spanDown = false;
            }
            lx++;
          }
        }

        ctx2d.putImageData(img, 0, 0);
        ctx2d.restore();
      };

      const pickColor = (cssX, cssY) => {
        const bx = Math.floor(cssX * dpr);
        const by = Math.floor(cssY * dpr);
        if (bx < 0 || by < 0 || bx >= canvas.width || by >= canvas.height) return;
        ctx2d.save();
        ctx2d.setTransform(1, 0, 0, 1, 0, 0);
        const [r, g, b, a] = ctx2d.getImageData(bx, by, 1, 1).data;
        ctx2d.restore();
        if (a === 0) {
          setColor("#ffffff");
          return;
        }
        const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
        setColor(hex);
      };

      /** @type {HTMLTextAreaElement | null} */
      let textEditor = null;

      const removeTextEditor = () => {
        if (textEditor) {
          textEditor.remove();
          textEditor = null;
        }
      };

      const commitTextEditor = (discard = false) => {
        if (!textEditor) return;
        const val = (textEditor.value || "").trim();
        const x = parseFloat(textEditor.dataset.x || "0");
        const y = parseFloat(textEditor.dataset.y || "0");
        if (!discard && val) {
          ctx2d.save();
          ctx2d.fillStyle = color;
          ctx2d.font = `bold ${Math.max(16, toolSize + 10)}px "Comic Sans MS", "Trebuchet MS", sans-serif`;
          ctx2d.textBaseline = "top";
          const lines = val.split("\n");
          lines.forEach((line, i) => {
            ctx2d.fillText(line, x, y + i * (Math.max(16, toolSize + 10) * 1.2));
          });
          ctx2d.restore();
          blip("press");
        }
        removeTextEditor();
      };

      const placeTextEditor = (x, y) => {
        commitTextEditor(true);
        const el = document.createElement("textarea");
        el.className = "paint-text-editor";
        el.rows = 2;
        el.placeholder = "Type… Enter to stamp";
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.color = color;
        el.dataset.x = String(x);
        el.dataset.y = String(y);
        el.addEventListener("keydown", (ev) => {
          if (ev.key === "Escape") {
            ev.preventDefault();
            commitTextEditor(true);
          } else if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            commitTextEditor(false);
          }
        });
        el.addEventListener("blur", () => commitTextEditor(false));
        surface.appendChild(el);
        textEditor = el;
        requestAnimationFrame(() => el.focus());
      };

      const stopDrawing = (e) => {
        if (!drawing) return;
        const { x, y } = e ? localPos(e) : { x: lastX, y: lastY };
        if (tool === "line" || tool === "rect" || tool === "oval" || tool === "round") {
          restoreSnap();
          drawShape(startX, startY, x, y, tool, false);
          snap = null;
        } else if (tool === "select" || tool === "lasso") {
          restoreSnap();
          snap = null;
          setStatus("Select — visual only (no cut/copy).");
        }
        const wasErase = tool === "eraser";
        drawing = false;
        if (sprayTimer) {
          clearInterval(sprayTimer);
          sprayTimer = null;
        }
        if (wasErase) maybeCompletePaint();
      };

      paintRoot.querySelectorAll("[data-paint-tool]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setTool(btn.dataset.paintTool || "eraser");
          blip("paintTool");
        });
      });

      paintRoot.querySelectorAll("[data-paint-color]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setColor(btn.dataset.paintColor || "#000000");
          blip("press");
        });
      });

      paintRoot.querySelectorAll("[data-spray-size]").forEach((el) => {
        el.addEventListener("click", (e) => {
          e.preventDefault();
          toolSize = parseInt(el.dataset.spraySize || "14", 10);
          paintRoot.querySelectorAll("[data-spray-size]").forEach((n) => {
            n.classList.toggle("is-on", n === el);
          });
        });
      });

      // Hit the full white surface — canvas may lag resize; title art is pointer-events:none
      surface.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".paint-text-editor")) return;
        if (tool === "zoom" || tool === "curve" || tool === "poly") {
          setStatus(TOOL_STATUS[tool]);
          return;
        }
        e.preventDefault();
        surface.setPointerCapture?.(e.pointerId);
        resizeCanvas();
        const { x, y } = localPos(e);
        startX = lastX = x;
        startY = lastY = y;

        if (tool === "text") {
          placeTextEditor(x, y);
          return;
        }
        if (tool === "fill") {
          floodFill(x, y, color);
          blip("press");
          return;
        }
        if (tool === "drop") {
          pickColor(x, y);
          blip("press");
          setTool("spray");
          return;
        }

        drawing = true;
        if (tool === "spray") {
          sprayAt(x, y);
          sprayTimer = setInterval(() => {
            if (drawing) sprayAt(lastX, lastY);
          }, 32);
        } else if (tool === "pencil") {
          ctx2d.fillStyle = color;
          ctx2d.fillRect(x, y, 1.5, 1.5);
        } else if (tool === "brush") {
          ctx2d.fillStyle = color;
          ctx2d.beginPath();
          ctx2d.arc(x, y, Math.max(2, toolSize * 0.35), 0, Math.PI * 2);
          ctx2d.fill();
        } else if (tool === "eraser") {
          eraseAt(x, y);
        } else if (
          tool === "line" || tool === "rect" || tool === "oval" ||
          tool === "round" || tool === "select" || tool === "lasso"
        ) {
          saveSnap();
        }
      });

      surface.addEventListener("pointermove", (e) => {
        const { x, y } = localPos(e);
        if (coordsEl) coordsEl.textContent = `${Math.round(x)}, ${Math.round(y)}`;
        if (!drawing) {
          lastX = x;
          lastY = y;
          return;
        }
        if (tool === "spray") {
          lastX = x;
          lastY = y;
          sprayAt(x, y);
        } else if (tool === "pencil") {
          freehandTo(x, y, 1.5, false);
        } else if (tool === "brush") {
          freehandTo(x, y, Math.max(3, toolSize * 0.7), false);
        } else if (tool === "eraser") {
          freehandTo(x, y, Math.max(6, toolSize * 1.1), true);
        } else if (
          tool === "line" || tool === "rect" || tool === "oval" ||
          tool === "round" || tool === "select" || tool === "lasso"
        ) {
          lastX = x;
          lastY = y;
          restoreSnap();
          drawShape(startX, startY, x, y, tool === "lasso" ? "select" : tool, true);
        }
      });

      surface.addEventListener("pointerup", stopDrawing);
      surface.addEventListener("pointercancel", stopDrawing);
      surface.addEventListener("pointerleave", () => {
        if (coordsEl) coordsEl.textContent = "";
      });

      const setHelpOpen = (open) => {
        if (!helpDlg) return;
        helpDlg.classList.toggle("is-closed", !open);
        helpDlg.setAttribute("aria-hidden", open ? "false" : "true");
      };

      paintRoot.querySelectorAll("[data-paint-help-open]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setHelpOpen(true);
          blip("press");
        });
      });

      paintRoot.querySelectorAll("[data-paint-help-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          setHelpOpen(false);
          blip("press");
        });
      });

      paintRoot.querySelectorAll("[data-paint-close]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          commitTextEditor(true);
          setHelpOpen(false);
          // App close — return to desktop; do not advance the talk
          if (w95Desktop?._w95ClosePaint) {
            w95Desktop._w95ClosePaint();
          } else {
            blip("press");
          }
        });
      });

      paintRoot._paintOnOpen = () => {
        requestAnimationFrame(() => {
          resizeCanvas();
          if (!coverReady) fillWhiteCover();
        });
      };
      paintRoot._paintReset = () => {
        coverReady = false;
        // Keep section progress; only reset the canvas cover for a fresh scribble
        paintBeatDone = progress.isBeatComplete("paint");
        requestAnimationFrame(() => {
          resizeCanvas();
          fillWhiteCover();
          setTool("eraser");
          setHelpOpen(false);
        });
      };

      setTool("eraser");
      setColor("#000000");
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
    // Win98 hub uses [data-w98-continue] with its own themes/XP gate — skip those roots
    deck.querySelectorAll("[data-continue]").forEach((btn) => {
      if (btn.closest("[data-quiz], [data-audience-poll], [data-w98]")) return;
      btn.addEventListener("click", () => next());
    });
  }

  function wirePlayAgain() {
    deck.querySelectorAll("[data-play-again]").forEach((btn) => {
      btn.addEventListener("click", () => {
        deck.querySelectorAll("[data-result]").forEach((b) => {
          b.disabled = false;
          b.classList.remove("is-correct", "is-wrong");
        });
        deck.querySelectorAll("[data-audience]").forEach((b) => {
          b.disabled = false;
          b.classList.remove("is-correct");
        });
        deck.querySelectorAll("[data-feedback]").forEach((f) => {
          f.textContent = "";
          f.classList.remove("show", "ok");
        });
        deck.querySelectorAll("[data-continue]").forEach((c) => {
          if (!c.hasAttribute("data-drift")) c.classList.remove("show");
        });
        deck.querySelectorAll(".chapter").forEach((s) => s.classList.remove("quiz-solved"));
        const win95 = chapters.findIndex((c) => c.id === "win95");
        show(win95 >= 0 ? win95 : 0);
        boot.run({ reason: "restart" });
      });
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
    index = Math.max(0, Math.min(nodes.length - 1, i));
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
    document.body.dataset.energy = energyForChapter(ch);

    const active = nodes[index];
    active.dataset.eraTheme = nextEra;
    if (
      (active?.classList.contains("mode-era") ||
        active?.classList.contains("mode-flash") ||
        active?.classList.contains("mode-paint") ||
        active?.classList.contains("mode-win95") ||
        active?.classList.contains("mode-win98") ||
        active?.classList.contains("mode-winxp")) &&
      !reduceMotion
    ) {
      const soft =
        active.classList.contains("mode-flash") ||
        active.classList.contains("mode-paint") ||
        active.classList.contains("mode-win95") ||
        active.classList.contains("mode-win98") ||
        active.classList.contains("mode-winxp");
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
    });

    // Hard-reload Win95 desktop whenever this chapter becomes active again
    if (ch.id === "win95" || active?.classList.contains("mode-win95")) {
      progress.setActiveSection("section1");
      resetWin95Desktop();
      active.querySelectorAll("[data-w95]").forEach((desktop) => {
        desktop._w95StartClock?.();
      });
      syncSectionUpdateUi("section1");
      syncRecycleBins();
    }

    if (ch.id === "win98" || active?.classList.contains("mode-win98")) {
      progress.setActiveSection("section2");
      progress.setCheckpointChapterId("win98");
      resetWin98Desktop();
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
      active.querySelectorAll("[data-wxp]").forEach((desktop) => {
        desktop.classList.add("is-bliss");
        desktop._wxpStartClock?.();
      });
    }

    // Auto-cue CRT hint class
    if (ch.id === "age-7") active?.classList.add("can-moment");
  }

  function next() {
    if (y2k.isRunning) {
      y2k.skipToInstall();
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
      const hot = deck.querySelector(".chapter.active [data-w95-internet]");
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
      const updateEl = deck.querySelector(
        ".chapter.active [data-w98-update]:not([hidden])"
      );
      if (updateEl) {
        updateEl.classList.remove("is-nudge");
        void updateEl.offsetWidth;
        updateEl.classList.add("is-nudge");
        setTimeout(() => updateEl.classList.remove("is-nudge"), 600);
      }
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
    show(index - 1);
  }

  function flashChrome() {
    document.body.classList.add("show-chrome");
    clearTimeout(chromeTimer);
    chromeTimer = setTimeout(() => document.body.classList.remove("show-chrome"), 1600);
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
    wirePaintTitle();
    adaptive.wire(deck);
    wirePlayAgain();

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
    const start = hash ? chapters.findIndex((s) => s.id === hash) : 0;
    const startIndex = start >= 0 ? start : 0;
    show(startIndex);

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

    window.addEventListener("keydown", onKey);
    window.addEventListener("mousemove", flashChrome);
    window.addEventListener("pointerdown", () => sfx.unlock(), { once: true });
  }

  function onKey(e) {
    const tag = (e.target && e.target.tagName) || "";
    const typing = tag === "INPUT" || tag === "TEXTAREA";

    // Boot opener — after load lines, key/click continues to desktop
    if (boot.isRunning) {
      if (["Escape", " ", "Spacebar", "Enter", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        if (boot.skip()) flashChrome();
      }
      return;
    }

    // Y2K theatre — Next skips to CD install; Esc aborts (cosmetic only)
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
        y2k.skipToInstall();
        flashChrome();
        return;
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

    // Win95 Start / Minesweeper / Paint — Esc + game keys before deck nav
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
      show(index + 1);
      flashChrome();
      return;
    }
    if (e.shiftKey && ["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      show(index - 1);
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

  mount();
  return api;
}
