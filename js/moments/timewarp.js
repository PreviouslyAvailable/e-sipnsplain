/**
 * Timewarp — horizontal snap timeline of games (2009–2025).
 * Lands as an empty Mountain Lion desktop + dock (no cards).
 * Soft presenter gate (web20-style):
 *   Click a dock year tile (e.g. 09) to open the card track at that year.
 *   ←/→ cycle year cards once started; at last card → nudges Continue.
 *   Only Continue leaves (Shift+Arrow still escapes via engine).
 * Visual shell: Mac OS X Mountain Lion homage (menu bar · Aqua windows · glass dock).
 * Drop art under assets/timewarp/ and set `image` on TIMEWARP_ITEMS.
 * Dock year tiles use app icons from assets/timewarp/icons/.
 * Card face: landscape hero art with compact overlay chrome
 * (year / game / lens / short `the_moment`). why_it_landed stays in data for talk notes.
 */

import { timewarpIconSrc } from "./timewarp-data.js";

/**
 * @typedef {import("./timewarp-data.js").TimewarpItem} TimewarpItem
 */

/**
 * @param {HTMLElement} root - [data-timewarp]
 * @param {{
 *   items: TimewarpItem[],
 *   onContinue?: () => void,
 *   reduceMotion?: boolean,
 * }} opts
 * @returns {{
 *   destroy: () => void,
 *   reset: () => void,
 *   cycle: (delta: number) => boolean,
 *   goTo: (index: number) => void,
 *   startAt: (index: number) => void,
 *   isStarted: () => boolean,
 *   nudgeContinue: () => void,
 *   activeIndex: () => number,
 *   count: () => number,
 * }}
 */
export function mountTimewarp(root, opts) {
  const items = Array.isArray(opts?.items) ? opts.items : [];
  const onContinue = opts?.onContinue;
  const reduceMotion = Boolean(opts?.reduceMotion);

  let destroyed = false;
  let continued = false;
  /** False until a dock year is clicked — empty desktop + dock only. */
  let started = false;
  let active = 0;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let nudgeTimer = null;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let holdTimer = null;
  /** @type {ReturnType<typeof setInterval> | null} */
  let holdInterval = null;

  const track =
    root.querySelector("[data-timewarp-track]") || ensureShell(root);
  const yearRail = root.querySelector("[data-timewarp-years]");
  const progressEl = root.querySelector("[data-timewarp-progress]");
  const continueBtns = [
    ...root.querySelectorAll("[data-timewarp-continue]"),
  ];

  track.replaceChildren();
  if (yearRail) yearRail.replaceChildren();

  /** @type {HTMLElement[]} */
  const cards = [];
  /** @type {HTMLElement[]} */
  const yearDots = [];

  items.forEach((item, i) => {
    const card = buildCard(item);
    track.appendChild(card);
    cards.push(card);

    if (yearRail) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "tw-year-dot";
      dot.setAttribute("data-timewarp-year", String(i));
      dot.setAttribute(
        "aria-label",
        `Open ${item.timeline_year} · ${item.game}`
      );
      dot.title = `${item.timeline_year} · ${item.game}`;
      const yy = String(item.timeline_year).slice(-2);
      const iconSrc = timewarpIconSrc(item);
      const iconHtml = iconSrc
        ? `<img class="tw-year-dot__icon" src="${escapeAttr(iconSrc)}" alt="" draggable="false" width="40" height="40" />`
        : "";
      dot.innerHTML = `${iconHtml}<span class="tw-year-dot__n">${yy}</span>`;
      if (iconSrc) dot.classList.add("has-icon");
      yearRail.appendChild(dot);
      yearDots.push(dot);
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        startAt(i);
      });
    }
  });

  function activeIndex() {
    return active;
  }

  function count() {
    return items.length;
  }

  function isStarted() {
    return started;
  }

  function setIdleChrome(idle) {
    root.classList.toggle("tw-idle", idle);
    root.dataset.twIdle = idle ? "1" : "0";
    if (track) {
      track.setAttribute("aria-hidden", idle ? "true" : "false");
      track.inert = idle;
    }
  }

  function syncChrome() {
    const item = items[active];
    cards.forEach((card, i) => {
      const on = started && i === active;
      card.classList.toggle("is-active", on);
      if (on) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
    yearDots.forEach((dot, i) => {
      const on = started && i === active;
      dot.classList.toggle("is-active", on);
      if (on) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (progressEl) {
      progressEl.textContent = started
        ? `${active + 1} / ${items.length}`
        : "";
    }
    root.dataset.twIndex = started ? String(active) : "";
    root.dataset.twYear = started && item ? String(item.timeline_year) : "";
    root.dataset.twLens = started && item?.lens ? item.lens : "";
  }

  /**
   * @param {number} i
   * @param {{ instant?: boolean }} [opts]
   */
  function goTo(i, goOpts = {}) {
    if (destroyed || !items.length || !started) return;
    const next = Math.max(0, Math.min(items.length - 1, i));
    active = next;
    const card = cards[active];
    if (card) {
      const behavior =
        goOpts.instant || reduceMotion ? "auto" : "smooth";
      card.scrollIntoView({
        behavior,
        inline: "center",
        block: "nearest",
      });
    }
    syncChrome();
  }

  /**
   * Open the card track at a year (dock tile click). No-op-safe if already started.
   * @param {number} i
   * @param {{ instant?: boolean }} [goOpts]
   */
  function startAt(i, goOpts = {}) {
    if (destroyed || !items.length) return;
    const next = Math.max(0, Math.min(items.length - 1, i));
    const wasIdle = !started;
    started = true;
    setIdleChrome(false);
    active = next;
    const card = cards[active];
    if (card) {
      const behavior =
        goOpts.instant || reduceMotion || wasIdle ? "auto" : "smooth";
      card.scrollIntoView({
        behavior,
        inline: "center",
        block: "nearest",
      });
    }
    syncChrome();
  }

  function nudgeContinue() {
    continueBtns.forEach((btn) => {
      btn.classList.remove("is-nudge");
      void btn.offsetWidth;
      btn.classList.add("is-nudge");
    });
    if (nudgeTimer) clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => {
      continueBtns.forEach((btn) => btn.classList.remove("is-nudge"));
      nudgeTimer = null;
    }, 650);
  }

  /**
   * Cycle cards. Does not leave the chapter.
   * While idle (dock-only), consumes advance without opening cards.
   * At the last card on +delta → nudges Continue.
   * @param {number} delta
   * @returns {boolean} always true while mounted (advance consumed)
   */
  function cycle(delta) {
    if (destroyed || !items.length) return true;
    // Soft-gate on empty desktop — presenter clicks 09 (or any year) to begin.
    if (!started) return true;
    const next = active + delta;
    if (next < 0) {
      goTo(0);
      return true;
    }
    if (next >= items.length) {
      goTo(items.length - 1);
      nudgeContinue();
      return true;
    }
    goTo(next);
    return true;
  }

  function leave() {
    if (continued) return;
    continued = true;
    onContinue?.();
  }

  continueBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      leave();
    });
  });

  /** Trackpad / wheel → horizontal when over the strip */
  /** @param {WheelEvent} e */
  const onWheel = (e) => {
    if (destroyed || !started) return;
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX > absY && absX > 8) {
      e.preventDefault();
      cycle(e.deltaX > 0 ? 1 : -1);
    } else if (absY > absX && absY > 28 && e.shiftKey) {
      e.preventDefault();
      cycle(e.deltaY > 0 ? 1 : -1);
    }
  };
  track.addEventListener("wheel", onWheel, { passive: false });

  /** Snap sync after free scroll / swipe */
  let scrollRaf = 0;
  const onScroll = () => {
    if (destroyed || !started) return;
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(() => {
      const mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      if (best !== active) {
        active = best;
        syncChrome();
      }
    });
  };
  track.addEventListener("scroll", onScroll, { passive: true });

  /** Hold ←/→ to keep scrubbing (engine calls startHold / stopHold) */
  function clearHold() {
    if (holdTimer) clearTimeout(holdTimer);
    if (holdInterval) clearInterval(holdInterval);
    holdTimer = null;
    holdInterval = null;
  }

  /**
   * @param {number} delta
   */
  function startHold(delta) {
    clearHold();
    cycle(delta);
    holdTimer = setTimeout(() => {
      holdInterval = setInterval(() => cycle(delta), reduceMotion ? 220 : 140);
    }, 380);
  }

  function stopHold() {
    clearHold();
  }

  function reset() {
    continued = false;
    started = false;
    active = 0;
    clearHold();
    setIdleChrome(true);
    if (track) track.scrollLeft = 0;
    syncChrome();
  }

  function destroy() {
    destroyed = true;
    clearHold();
    if (nudgeTimer) clearTimeout(nudgeTimer);
    cancelAnimationFrame(scrollRaf);
    track.removeEventListener("wheel", onWheel);
    track.removeEventListener("scroll", onScroll);
  }

  // Expose hold helpers for engine keydown/keyup
  root._twStartHold = startHold;
  root._twStopHold = stopHold;

  reset();

  return {
    destroy,
    reset,
    cycle,
    goTo,
    startAt,
    isStarted,
    nudgeContinue,
    activeIndex,
    count,
    startHold,
    stopHold,
  };
}

/**
 * @param {HTMLElement} root
 */
function ensureShell(root) {
  let track = root.querySelector("[data-timewarp-track]");
  if (track) return /** @type {HTMLElement} */ (track);
  track = document.createElement("div");
  track.className = "tw-track";
  track.setAttribute("data-timewarp-track", "");
  root.appendChild(track);
  return track;
}

/**
 * @param {TimewarpItem} item
 */
function buildCard(item) {
  const card = document.createElement("article");
  card.className = "tw-card";
  card.setAttribute("data-timewarp-card", item.id);
  card.setAttribute("data-lens", item.lens === "Campaign-led" ? "campaign" : "design");
  card.setAttribute("tabindex", "-1");
  card.setAttribute("aria-label", `${item.timeline_year} · ${item.game}`);

  const lensClass =
    item.lens === "Campaign-led" ? "tw-lens--campaign" : "tw-lens--design";
  const hasImage = Boolean(item.image && String(item.image).trim());

  const media = hasImage
    ? `<img class="tw-card__img" src="${escapeAttr(item.image)}" alt="" draggable="false" loading="lazy" />`
    : `<div class="tw-card__ph" role="img" aria-label="Image placeholder">
        <span class="tw-card__ph-kicker">${escapeHtml(item.artifact_type || "Drop art")}</span>
        <span class="tw-card__ph-hint">${escapeHtml(item.iconic_artifact)}</span>
        <span class="tw-card__ph-search">search · ${escapeHtml(item.search_lead)}</span>
        <span class="tw-card__ph-path">assets/timewarp/${escapeHtml(item.id)}.png</span>
      </div>`;

  const sourceUrl = String(item.source_url || "").trim();
  const sourceNote = String(item.source_note || "").trim();
  const sourceMeta = sourceUrl
    ? `<span aria-hidden="true">·</span>
        <a class="tw-card__source" href="${escapeAttr(sourceUrl)}" target="_blank" rel="noopener noreferrer"${
          sourceNote ? ` title="${escapeAttr(sourceNote)}"` : ""
        }>Source</a>`
    : "";

  card.classList.add("window", "windows-vis");
  card.innerHTML = `
    <nav class="control-window" aria-hidden="true">
      <span class="close">close</span>
      <span class="minimize">minimize</span>
      <span class="maximize">maximize</span>
    </nav>
    <h1 class="titleInside">${escapeHtml(item.game)} — ${item.timeline_year}</h1>
    <div class="container tw-card__body">
      <div class="tw-card__media">${media}</div>
      <div class="tw-card__chrome">
        <div class="tw-card__year">${item.timeline_year}</div>
        <span class="tw-lens ${lensClass}">${escapeHtml(item.lens)}</span>
        <h2 class="tw-card__title">${escapeHtml(item.game)}</h2>
        <p class="tw-card__dev">${escapeHtml(item.developer)}</p>
        <p class="tw-card__story">${escapeHtml(item.the_moment)}</p>
        <p class="tw-card__meta">
          <span>Shipped ${escapeHtml(item.actual_release)}</span>
          ${sourceMeta}
        </p>
      </div>
    </div>
  `;
  return card;
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {string} s */
function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
