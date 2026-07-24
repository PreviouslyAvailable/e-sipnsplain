/**
 * Section progress — reusable beat unlock rules.
 *
 * Core loop: explore beats → satisfy required set → unlock “update available”
 * → interstitial → continue → next era/section.
 *
 * Unlock rules support:
 *   allOf: [...beatIds]  — every listed beat must be complete
 *   oneOf: [...beatIds]  — at least one listed beat must be complete
 * Both may appear on the same section (AND’d together).
 * Empty allOf + empty oneOf = never unlock (terminal section / no next OS).
 */

export const PROGRESS_KEY = "sipnsplain-progress-v2";

/** @typedef {"OWN"|"EMBED-JS"|"EMBED-BB"} BeatKind */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   kind: BeatKind,
 * }} BeatDef
 */

/**
 * @typedef {{
 *   allOf?: string[],
 *   oneOf?: string[],
 * }} UnlockRules
 */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   era: string,
 *   hubChapterId: string,
 *   beats: Record<string, BeatDef>,
 *   unlock: UnlockRules,
 *   transition: {
 *     id: string,
 *     copy: string,
 *     progressStyle: string,
 *     interstitialType?: "download" | "install-cd",
 *     mediaAsset?: string,
 *     withDeath?: boolean,
 *     nextSectionId: string,
 *     nextChapterId: string,
 *     nextTheme?: string,
 *   },
 * }} SectionDef
 */

/** @type {Record<string, SectionDef>} */
export const SECTIONS = {
  section1: {
    id: "section1",
    label: "Windows 95",
    era: "1995",
    hubChapterId: "win95",
    beats: {
      // Recycle Bin: optional / ungated (tracked but not required for unlock)
      recycle: { id: "recycle", label: "Recycle Bin", kind: "OWN" },
      atari: { id: "atari", label: "Atari", kind: "OWN" },
      minesweeper: { id: "minesweeper", label: "Minesweeper", kind: "OWN" },
    },
    // Open Atari + Minesweeper windows — Recycle Bin does not gate the Win98 update
    unlock: {
      allOf: ["atari", "minesweeper"],
    },
    transition: {
      id: "win95-to-win98",
      copy: "Downloading Windows 98…",
      progressStyle: "win95-download",
      nextSectionId: "section2",
      nextChapterId: "win98",
      nextTheme: "1998",
    },
  },
  // Section 2 hub — Chris, 1999 theme → starts Y2K → XP
  section2: {
    id: "section2",
    label: "Windows 98",
    era: "1998",
    hubChapterId: "win98",
    beats: {
      // Required for unlock / Y2K
      chris1999: {
        id: "chris1999",
        label: "Chris, 1999",
        kind: "OWN",
      },
      // Optional flavour — tracked but do not gate XP
      gbc: { id: "gbc", label: "Game Boy Color", kind: "OWN" },
      gates: { id: "gates", label: "Gates Preview", kind: "OWN" },
      pinball: {
        id: "pinball",
        label: "3D Pinball Space Cadet",
        kind: "EMBED-BB",
      },
      skifree: { id: "skifree", label: "SkiFree", kind: "EMBED-JS" },
    },
    // Required: Desktop Themes → Chris, 1999 → starts Y2K.
    // GBC, SkiFree, Pinball, Gates are optional flavour only.
    unlock: { allOf: ["chris1999"] },
    transition: {
      id: "win98-to-xp",
      copy: "Installing Windows XP…",
      progressStyle: "install-cd",
      interstitialType: "install-cd",
      mediaAsset: "/assets/icons/w98/cd-drive.png",
      withDeath: true,
      nextSectionId: "section3",
      nextChapterId: "winxp",
      nextTheme: "winxp",
    },
  },
  // Section 3 hub — terminal era; no further OS update
  section3: {
    id: "section3",
    label: "Windows XP",
    era: "2001",
    hubChapterId: "winxp",
    beats: {
      // Optional progress only — does not gate a next era
      gamecube: { id: "gamecube", label: "My Pictures", kind: "OWN" },
      firefox: {
        id: "firefox",
        label: "Mozilla Firefox",
        kind: "OWN",
      },
    },
    // Terminal era — empty unlock never fires (see evaluateUnlock).
    unlock: { allOf: [] },
    transition: {
      id: "xp-terminal",
      copy: "",
      progressStyle: "win98-download",
      // No-op: next section is self — do not advance to another era
      nextSectionId: "section3",
      nextChapterId: "winxp",
      nextTheme: "winxp",
    },
  },
};

/**
 * Evaluate unlock rules against a completed-beat map.
 * Empty allOf + empty oneOf → false (never unlock). `[].every()` is vacuously
 * true in JS; that must not arm an update toast / interstitial.
 * @param {UnlockRules} rules
 * @param {Record<string, boolean>} complete
 */
export function evaluateUnlock(rules, complete = {}) {
  const allOf = rules?.allOf || [];
  const oneOf = rules?.oneOf || [];
  if (allOf.length === 0 && oneOf.length === 0) return false;
  const allOk = allOf.every((id) => Boolean(complete[id]));
  const oneOk = oneOf.length === 0 || oneOf.some((id) => Boolean(complete[id]));
  return allOk && oneOk;
}

/**
 * @param {{
 *   storage?: Storage | null,
 *   onChange?: (snapshot: object) => void,
 *   onUnlock?: (sectionId: string, section: SectionDef) => void,
 * }} [opts]
 */
export function createProgress(opts = {}) {
  const storage = opts.storage === undefined
    ? (typeof sessionStorage !== "undefined" ? sessionStorage : null)
    : opts.storage;

  /** @type {string} */
  let activeSectionId = "section1";
  /** @type {string} */
  let checkpointChapterId = SECTIONS.section1.hubChapterId;

  /**
   * @type {Record<string, {
   *   complete: Record<string, boolean>,
   *   photos: Record<string, boolean>,
   *   updateUnlocked: boolean,
   *   updateConsumed: boolean,
   * }>}
   */
  let sections = {};

  function freshSectionState() {
    return {
      complete: {},
      photos: {},
      updateUnlocked: false,
      updateConsumed: false,
    };
  }

  function ensureSection(sectionId) {
    if (!sections[sectionId]) sections[sectionId] = freshSectionState();
    return sections[sectionId];
  }

  /** Migrate legacy chris2000 beat keys → chris1999 (session progress). */
  function migrateSectionBeats(st) {
    if (!st || typeof st !== "object") return;
    for (const mapKey of ["complete", "photos"]) {
      const map = st[mapKey];
      if (!map || typeof map !== "object") continue;
      if (map.chris2000 && !map.chris1999) map.chris1999 = map.chris2000;
      delete map.chris2000;
    }
  }

  function load() {
    if (!storage) return;
    try {
      const raw = storage.getItem(PROGRESS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.sections && typeof parsed.sections === "object") {
        sections = parsed.sections;
        Object.values(sections).forEach(migrateSectionBeats);
      }
      if (typeof parsed?.activeSectionId === "string" && SECTIONS[parsed.activeSectionId]) {
        activeSectionId = parsed.activeSectionId;
      }
      if (typeof parsed?.checkpointChapterId === "string") {
        checkpointChapterId = parsed.checkpointChapterId;
      }
    } catch {
      /* ignore corrupt store */
    }
  }

  function save() {
    if (!storage) return;
    try {
      storage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          activeSectionId,
          checkpointChapterId,
          sections,
        })
      );
    } catch {
      /* quota / private mode */
    }
  }

  function emit() {
    const snap = snapshot();
    opts.onChange?.(snap);
    return snap;
  }

  function getSectionDef(sectionId = activeSectionId) {
    return SECTIONS[sectionId] || null;
  }

  function isBeatComplete(beatId, sectionId = activeSectionId) {
    return Boolean(ensureSection(sectionId).complete[beatId]);
  }

  function markPhoto(beatId, sectionId = activeSectionId) {
    const st = ensureSection(sectionId);
    st.photos[beatId] = true;
    save();
    return emit();
  }

  /**
   * Mark a beat complete. Idempotent.
   * @param {string} beatId
   * @param {{ sectionId?: string, photo?: boolean, meta?: object }} [info]
   * @returns {{ newly: boolean, unlocked: boolean, snapshot: object }}
   */
  function completeBeat(beatId, info = {}) {
    const sectionId = info.sectionId || activeSectionId;
    const def = SECTIONS[sectionId];
    if (!def?.beats?.[beatId]) {
      return { newly: false, unlocked: false, snapshot: snapshot() };
    }

    const st = ensureSection(sectionId);
    const newly = !st.complete[beatId];
    st.complete[beatId] = true;
    if (info.photo) st.photos[beatId] = true;

    let unlocked = false;
    if (!st.updateUnlocked && evaluateUnlock(def.unlock, st.complete)) {
      st.updateUnlocked = true;
      unlocked = true;
      opts.onUnlock?.(sectionId, def);
    }

    save();
    emit();
    return { newly, unlocked, snapshot: snapshot() };
  }

  function isUpdateUnlocked(sectionId = activeSectionId) {
    return Boolean(ensureSection(sectionId).updateUnlocked);
  }

  function isUpdateConsumed(sectionId = activeSectionId) {
    return Boolean(ensureSection(sectionId).updateConsumed);
  }

  /** Call when interstitial continue fires and we enter the next section. */
  function consumeUpdate(sectionId = activeSectionId) {
    const def = SECTIONS[sectionId];
    const st = ensureSection(sectionId);
    st.updateConsumed = true;
    st.updateUnlocked = true;
    if (def?.transition?.nextSectionId) {
      activeSectionId = def.transition.nextSectionId;
      ensureSection(activeSectionId);
      const nextDef = SECTIONS[activeSectionId];
      if (nextDef?.hubChapterId) checkpointChapterId = nextDef.hubChapterId;
    }
    save();
    return emit();
  }

  /** Presenter: re-arm an update so Y2K / install can be jumped to mid-talk. */
  function rearmUpdate(sectionId = activeSectionId) {
    if (!SECTIONS[sectionId]) return snapshot();
    const st = ensureSection(sectionId);
    st.updateUnlocked = true;
    st.updateConsumed = false;
    save();
    return emit();
  }

  function setActiveSection(sectionId) {
    if (!SECTIONS[sectionId]) return snapshot();
    activeSectionId = sectionId;
    const def = SECTIONS[sectionId];
    if (def?.hubChapterId) checkpointChapterId = def.hubChapterId;
    ensureSection(sectionId);
    save();
    return emit();
  }

  function getCheckpointChapterId() {
    return checkpointChapterId;
  }

  function setCheckpointChapterId(id) {
    checkpointChapterId = id;
    save();
    return emit();
  }

  function requiredStatus(sectionId = activeSectionId) {
    const def = SECTIONS[sectionId];
    const st = ensureSection(sectionId);
    if (!def) return null;
    const allOf = (def.unlock.allOf || []).map((id) => ({
      id,
      label: def.beats[id]?.label || id,
      complete: Boolean(st.complete[id]),
    }));
    const oneOf = (def.unlock.oneOf || []).map((id) => ({
      id,
      label: def.beats[id]?.label || id,
      complete: Boolean(st.complete[id]),
    }));
    return {
      sectionId,
      allOf,
      oneOf,
      oneOfSatisfied: oneOf.length === 0 || oneOf.some((b) => b.complete),
      unlocked: st.updateUnlocked,
      consumed: st.updateConsumed,
    };
  }

  function snapshot() {
    return {
      activeSectionId,
      checkpointChapterId,
      sections: structuredClone
        ? structuredClone(sections)
        : JSON.parse(JSON.stringify(sections)),
      status: requiredStatus(activeSectionId),
    };
  }

  function reset({ hard = false } = {}) {
    if (hard) {
      sections = {};
      activeSectionId = "section1";
      checkpointChapterId = SECTIONS.section1.hubChapterId;
    } else {
      // Soft: keep section identity, clear only active section beats
      sections[activeSectionId] = freshSectionState();
    }
    save();
    return emit();
  }

  load();
  ensureSection(activeSectionId);

  return {
    SECTIONS,
    evaluateUnlock,
    completeBeat,
    markPhoto,
    isBeatComplete,
    isUpdateUnlocked,
    isUpdateConsumed,
    consumeUpdate,
    rearmUpdate,
    setActiveSection,
    getActiveSectionId: () => activeSectionId,
    getSectionDef,
    getCheckpointChapterId,
    setCheckpointChapterId,
    requiredStatus,
    snapshot,
    reset,
  };
}
