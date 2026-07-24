/**
 * Web 2.0 browser content — year-ordered tabs of kid-web ad collections.
 * Hosted inside Mozilla Firefox 1.0 chrome on the Windows XP desktop.
 * Soft presenter gate when used as a chapter (legacy):
 *   ←/→ cycle year tabs; at last tab → nudges Continue (if present).
 * On XP: engine arrows cycle tabs while the Firefox window is open.
 * Drop real ads under assets/web20/<brand>/ads/ (see WEB20_TABS / README).
 * Empty image lists → one quiet empty-state (not a placeholder wall).
 */

/**
 * @typedef {{ src: string, size?: "full" | "half" | "third" }} Web20Ad
 * @typedef {{ id: string, label: string, year: number, url: string, images: (string|Web20Ad)[], placeholders?: number }} Web20Tab
 */

/**
 * @param {HTMLElement} root - [data-ie-web20]
 * @param {{ tabs: Web20Tab[], onContinue?: () => void }} opts
 * @returns {{
 *   destroy: () => void,
 *   selectTab: (id: string) => void,
 *   reset: () => void,
 *   cycleTab: (delta: number) => boolean,
 *   nudgeContinue: () => void,
 *   activeIndex: () => number,
 * }}
 */
export function mountIeWeb20(root, opts) {
  const tabs = Array.isArray(opts?.tabs) ? opts.tabs : [];
  const onContinue = opts?.onContinue;

  let destroyed = false;
  let continued = false;
  let activeId = tabs[0]?.id || "";
  /** @type {ReturnType<typeof setTimeout> | null} */
  let nudgeTimer = null;

  const tablist =
    root.querySelector("[data-ie-tabs]") || ensureTablist(root);
  const page =
    root.querySelector("[data-ie-page]") || ensurePage(root);
  const addr =
    root.querySelector("[data-ie-addr]") || null;
  const status =
    root.querySelector("[data-ie-status]") || null;
  const titleEl =
    root.querySelector("[data-ie-title]") || null;

  /** @type {Map<string, HTMLElement>} */
  const panels = new Map();

  tablist.replaceChildren();
  page.replaceChildren();

  tabs.forEach((tab, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ie-tab";
    btn.setAttribute("role", "tab");
    btn.setAttribute("data-ie-tab", tab.id);
    btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
    btn.id = `ie-tab-${tab.id}`;
    btn.innerHTML = `<span class="ie-tab-label">${escapeHtml(tab.label)}</span><span class="ie-tab-year">${tab.year}</span>`;
    tablist.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "ie-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("data-ie-panel", tab.id);
    panel.setAttribute("aria-labelledby", btn.id);
    panel.hidden = i !== 0;

    const grid = document.createElement("div");
    grid.className = "ie-ad-grid";
    grid.setAttribute("data-ie-grid", "");

    const images = Array.isArray(tab.images) ? tab.images : [];

    if (images.length === 0) {
      // Single quiet empty-state — no wall of placeholder cards.
      grid.classList.add("ie-ad-grid--empty");
      grid.appendChild(makeEmptyState(tab));
    } else {
      images.forEach((entry) => {
        grid.appendChild(makeAdCard(tab, normalizeAd(entry)));
      });
      // Optional soft slots only when explicitly requested alongside real ads.
      const placeholderCount = Math.max(0, Math.min(2, tab.placeholders ?? 0));
      for (let p = 0; p < placeholderCount; p++) {
        grid.appendChild(makePlaceholder(tab, p));
      }
    }

    panel.appendChild(grid);
    page.appendChild(panel);
    panels.set(tab.id, panel);
  });

  function activeIndex() {
    const i = tabs.findIndex((t) => t.id === activeId);
    return i < 0 ? 0 : i;
  }

  /**
   * @param {string} id
   */
  function selectTab(id) {
    if (destroyed || !panels.has(id)) return;
    activeId = id;
    const tab = tabs.find((t) => t.id === id);

    tablist.querySelectorAll("[data-ie-tab]").forEach((el) => {
      const on = el.getAttribute("data-ie-tab") === id;
      el.classList.toggle("is-active", on);
      el.setAttribute("aria-selected", on ? "true" : "false");
    });

    panels.forEach((panel, pid) => {
      const on = pid === id;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });

    if (addr && tab) addr.textContent = tab.url;
    if (status && tab) {
      status.textContent = "Done";
    }
    if (titleEl && tab) {
      titleEl.textContent = `${tab.label} - Mozilla Firefox`;
    }
    root.dataset.ieTab = id;
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
   * Cycle year tabs. Does not leave the chapter.
   * At the last tab on +delta → nudges Continue (soft gate).
   * @param {number} delta
   * @returns {boolean} always true while mounted (advance consumed)
   */
  function cycleTab(delta) {
    if (destroyed || tabs.length === 0) return true;
    const i = activeIndex();
    const next = i + delta;
    if (next < 0 || next >= tabs.length) {
      if (delta > 0) nudgeContinue();
      return true;
    }
    selectTab(tabs[next].id);
    return true;
  }

  /** @param {MouseEvent} e */
  const onTabClick = (e) => {
    const btn = /** @type {HTMLElement|null} */ (
      e.target instanceof Element ? e.target.closest("[data-ie-tab]") : null
    );
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    selectTab(btn.getAttribute("data-ie-tab") || "");
  };

  const handleContinue = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (destroyed || continued) return;
    continued = true;
    onContinue?.();
  };

  const continueBtns = [
    ...root.querySelectorAll("[data-ie-continue]"),
  ];

  tablist.addEventListener("click", onTabClick);
  continueBtns.forEach((btn) => {
    btn.addEventListener("click", handleContinue);
  });

  // Stop arrow/space from bubbling out of the page scroll area
  const stopNav = (e) => e.stopPropagation();
  page.addEventListener("keydown", stopNav);
  page.addEventListener("wheel", stopNav, { passive: true });

  selectTab(activeId);

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (nudgeTimer) clearTimeout(nudgeTimer);
      nudgeTimer = null;
      tablist.removeEventListener("click", onTabClick);
      continueBtns.forEach((btn) => {
        btn.removeEventListener("click", handleContinue);
        btn.classList.remove("is-nudge");
      });
      page.removeEventListener("keydown", stopNav);
      page.removeEventListener("wheel", stopNav);
      panels.clear();
    },
    selectTab,
    cycleTab,
    nudgeContinue,
    activeIndex,
    reset() {
      continued = false;
      continueBtns.forEach((btn) => btn.classList.remove("is-nudge"));
      selectTab(tabs[0]?.id || "");
    },
  };
}

/**
 * @param {HTMLElement} root
 * @returns {HTMLElement}
 */
function ensureTablist(root) {
  const el = document.createElement("div");
  el.className = "ie-tabs";
  el.setAttribute("data-ie-tabs", "");
  el.setAttribute("role", "tablist");
  el.setAttribute("aria-label", "Web 2.0 years");
  const page = root.querySelector("[data-ie-page]");
  if (page) page.before(el);
  else root.appendChild(el);
  return el;
}

/**
 * @param {HTMLElement} root
 * @returns {HTMLElement}
 */
function ensurePage(root) {
  const el = document.createElement("div");
  el.className = "ie-page";
  el.setAttribute("data-ie-page", "");
  root.appendChild(el);
  return el;
}

/**
 * @param {string|Web20Ad} entry
 * @returns {Required<Web20Ad>}
 */
function normalizeAd(entry) {
  if (typeof entry === "string") {
    return { src: entry, size: "full" };
  }
  const size =
    entry?.size === "half" || entry?.size === "third" ? entry.size : "full";
  return { src: String(entry?.src || ""), size };
}

/**
 * @param {Web20Tab} tab
 * @param {Required<Web20Ad>} ad
 * @returns {HTMLElement}
 */
function makeAdCard(tab, ad) {
  const fig = document.createElement("figure");
  fig.className = "ie-ad-card";
  fig.setAttribute("data-ie-size", ad.size);

  const img = document.createElement("img");
  img.className = "ie-ad-img";
  img.src = ad.src;
  img.alt = `${tab.label} ad`;
  img.draggable = false;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    fig.replaceWith(makePlaceholder(tab, ad.src));
  });

  fig.appendChild(img);
  return fig;
}

/**
 * Quiet page empty-state when a tab has no ads yet (breathing room for the talk).
 * @param {Web20Tab} tab
 * @returns {HTMLElement}
 */
function makeEmptyState(tab) {
  const el = document.createElement("div");
  el.className = "ie-ad-empty";
  el.setAttribute("data-ie-empty", "");
  el.innerHTML = `
    <p class="ie-ad-empty-label">${escapeHtml(tab.label)} · ${tab.year}</p>
    <p class="ie-ad-empty-hint">Ads coming soon</p>
  `;
  return el;
}

/**
 * Soft optional slot beside real ads (or broken-image fallback).
 * @param {Web20Tab} tab
 * @param {string|number} key
 * @returns {HTMLElement}
 */
function makePlaceholder(tab, key) {
  const fig = document.createElement("figure");
  fig.className = "ie-ad-card ie-ad-placeholder";
  fig.setAttribute("data-ie-placeholder", String(key));
  fig.innerHTML = `
    <div class="ie-ad-placeholder-inner">
      <span class="ie-ad-placeholder-hint">${escapeHtml(tab.label)} · more soon</span>
    </div>
  `;
  return fig;
}

/**
 * @param {string} s
 * @returns {string}
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
