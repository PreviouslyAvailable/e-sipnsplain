/**
 * Reusable era-transition interstitial.
 * Parameterized by copy, progress style, and continue callback (next step).
 *
 * Supports floppy-era download bars and XP CD-install theatre
 * (`interstitialType: "install-cd"`).
 */

/**
 * @param {{
 *   reduceMotion?: boolean,
 *   blip?: (kind: string) => void,
 *   root?: HTMLElement | Document,
 * }} [ctx]
 */
export function createTransition(ctx = {}) {
  const mountRoot =
    (ctx.root && "getElementById" in ctx.root
      ? ctx.root.getElementById("stage")
      : null) ||
    document.getElementById("stage") ||
    document.body;

  /** @type {HTMLElement | null} */
  let el = null;
  /** @type {ReturnType<typeof setInterval> | null} */
  let fillTimer = null;
  /** @type {ReturnType<typeof setTimeout>[]} */
  let timers = [];
  let open = false;
  /** @type {(() => void) | null} */
  let onContinueCb = null;

  function clearFill() {
    if (fillTimer != null) {
      clearInterval(fillTimer);
      fillTimer = null;
    }
  }

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function ensure() {
    if (el) return el;
    el = document.createElement("div");
    el.className = "era-transition";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <div class="era-transition-cd" data-transition-cd aria-hidden="true">
        <div class="era-transition-cd-tray">
          <img class="era-transition-cd-disc" data-transition-cd-img alt="" width="64" height="64" draggable="false" />
        </div>
        <p class="era-transition-cd-label">Please insert the Windows XP CD</p>
      </div>
      <div class="era-transition-panel" data-transition-panel>
        <div class="era-transition-titlebar" data-transition-chrome>
          <span class="era-transition-app-ico" aria-hidden="true"></span>
          <span class="era-transition-title" data-transition-title>Windows Update</span>
        </div>
        <div class="era-transition-body">
          <div class="era-transition-media" data-transition-media hidden>
            <img data-transition-media-img alt="" width="48" height="48" draggable="false" />
          </div>
          <p class="era-transition-copy" data-transition-copy>Downloading…</p>
          <div class="era-transition-bar" data-transition-bar role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="era-transition-fill" data-transition-fill></div>
          </div>
          <p class="era-transition-status" data-transition-status>Preparing files…</p>
          <div class="era-transition-actions">
            <button type="button" class="era-transition-btn" data-transition-continue disabled>
              Continue
            </button>
          </div>
        </div>
      </div>
    `;
    el.querySelector("[data-transition-continue]")?.addEventListener("click", () => {
      if (!open) return;
      const cb = onContinueCb;
      hide();
      ctx.blip?.("correct");
      cb?.();
    });
    mountRoot.appendChild(el);
    return el;
  }

  /**
   * @param {{
   *   copy?: string,
   *   title?: string,
   *   progressStyle?: string,
   *   durationMs?: number,
   *   interstitialType?: "download" | "install-cd",
   *   mediaAsset?: string,
   *   onPreload?: () => void | Promise<unknown>,
   *   onContinue?: () => void,
   * }} opts
   */
  function show(opts = {}) {
    const node = ensure();
    clearFill();
    clearTimers();
    open = true;
    onContinueCb = opts.onContinue || null;

    const style = opts.progressStyle || "win95-download";
    const copy = opts.copy || "Downloading…";
    const title = opts.title || "Windows Update";
    const interstitialType = opts.interstitialType || "download";
    const isCd = interstitialType === "install-cd";
    const duration = ctx.reduceMotion
      ? 0
      : Math.max(600, opts.durationMs ?? (isCd ? 3400 : 2800));
    const cdInsertMs = ctx.reduceMotion ? 0 : 1100;

    node.dataset.progressStyle = style;
    node.dataset.interstitial = interstitialType;
    node.classList.add("is-live");
    node.classList.toggle("is-cd-insert", isCd && cdInsertMs > 0);
    node.setAttribute("aria-hidden", "false");

    const copyEl = node.querySelector("[data-transition-copy]");
    const titleEl = node.querySelector("[data-transition-title]");
    const statusEl = node.querySelector("[data-transition-status]");
    const fillEl = node.querySelector("[data-transition-fill]");
    const barEl = node.querySelector("[data-transition-bar]");
    const btn = node.querySelector("[data-transition-continue]");
    const panel = node.querySelector("[data-transition-panel]");
    const cdStage = node.querySelector("[data-transition-cd]");
    const cdImg = node.querySelector("[data-transition-cd-img]");
    const media = node.querySelector("[data-transition-media]");
    const mediaImg = node.querySelector("[data-transition-media-img]");

    if (copyEl) copyEl.textContent = copy;
    if (titleEl) titleEl.textContent = isCd ? (opts.title || "Windows XP Setup") : title;
    if (btn instanceof HTMLButtonElement) {
      btn.disabled = true;
      btn.textContent = "Continue";
    }
    if (fillEl instanceof HTMLElement) fillEl.style.width = "0%";
    if (barEl) barEl.setAttribute("aria-valuenow", "0");
    if (statusEl) {
      statusEl.textContent = isCd ? "Reading CD…" : "Preparing files…";
    }

    const asset = opts.mediaAsset || "/assets/icons/w98/cd-drive.png";
    if (cdImg instanceof HTMLImageElement) cdImg.src = asset;
    if (mediaImg instanceof HTMLImageElement) mediaImg.src = asset;
    if (media instanceof HTMLElement) {
      media.hidden = !isCd;
    }

    // Kick asset preload while the gag runs
    try {
      const pre = opts.onPreload?.();
      if (pre && typeof pre.then === "function") pre.catch(() => {});
    } catch {
      /* ignore */
    }

    ctx.blip?.(isCd ? "transition" : "transition");

    const startFill = () => {
      node.classList.remove("is-cd-insert");
      if (cdStage) cdStage.setAttribute("aria-hidden", "true");
      if (panel instanceof HTMLElement) panel.hidden = false;

      if (duration === 0) {
        if (fillEl instanceof HTMLElement) fillEl.style.width = "100%";
        if (barEl) barEl.setAttribute("aria-valuenow", "100");
        if (statusEl) {
          statusEl.textContent = isCd ? "Installation complete." : "Download complete.";
        }
        if (btn instanceof HTMLButtonElement) btn.disabled = false;
        return;
      }

      const started = performance.now();
      const gags = isCd
        ? [
            "Reading CD…",
            "Copying files…",
            "Installing devices…",
            "Registering components…",
            "Finalizing installation…",
            "Installation complete.",
          ]
        : [
            "Copying system files…",
            "Updating registry…",
            "Please wait…",
            "Almost there…",
            "Download complete.",
          ];

      fillTimer = setInterval(() => {
        const t = Math.min(1, (performance.now() - started) / duration);
        let p = t;
        if (t > 0.55 && t < 0.78) p = 0.55 + (t - 0.55) * 0.35;
        const pct = Math.round(p * 100);
        if (fillEl instanceof HTMLElement) fillEl.style.width = `${pct}%`;
        if (barEl) barEl.setAttribute("aria-valuenow", String(pct));
        if (statusEl) {
          const gi = Math.min(gags.length - 1, Math.floor(t * (gags.length - 0.01)));
          statusEl.textContent = gags[gi];
        }
        if (t >= 1) {
          clearFill();
          if (fillEl instanceof HTMLElement) fillEl.style.width = "100%";
          if (barEl) barEl.setAttribute("aria-valuenow", "100");
          if (statusEl) {
            statusEl.textContent = isCd
              ? "Installation complete."
              : "Download complete.";
          }
          if (btn instanceof HTMLButtonElement) {
            btn.disabled = false;
            btn.focus?.();
          }
          ctx.blip?.("score");
        }
      }, 40);
    };

    if (isCd && cdInsertMs > 0) {
      if (panel instanceof HTMLElement) panel.hidden = true;
      if (cdStage) cdStage.setAttribute("aria-hidden", "false");
      node.classList.add("is-cd-insert");
      timers.push(setTimeout(startFill, cdInsertMs));
    } else {
      if (panel instanceof HTMLElement) panel.hidden = false;
      if (cdStage) cdStage.setAttribute("aria-hidden", "true");
      startFill();
    }
  }

  function hide() {
    clearFill();
    clearTimers();
    open = false;
    onContinueCb = null;
    if (!el) return;
    el.classList.remove("is-live", "is-cd-insert");
    el.setAttribute("aria-hidden", "true");
    const panel = el.querySelector("[data-transition-panel]");
    if (panel instanceof HTMLElement) panel.hidden = false;
  }

  function skipToContinue() {
    if (!open || !el) return false;
    clearFill();
    clearTimers();
    el.classList.remove("is-cd-insert");
    const panel = el.querySelector("[data-transition-panel]");
    const cdStage = el.querySelector("[data-transition-cd]");
    if (panel instanceof HTMLElement) panel.hidden = false;
    if (cdStage) cdStage.setAttribute("aria-hidden", "true");
    const fillEl = el.querySelector("[data-transition-fill]");
    const barEl = el.querySelector("[data-transition-bar]");
    const statusEl = el.querySelector("[data-transition-status]");
    const btn = el.querySelector("[data-transition-continue]");
    const isCd = el.dataset.interstitial === "install-cd";
    if (fillEl instanceof HTMLElement) fillEl.style.width = "100%";
    if (barEl) barEl.setAttribute("aria-valuenow", "100");
    if (statusEl) {
      statusEl.textContent = isCd ? "Installation complete." : "Download complete.";
    }
    if (btn instanceof HTMLButtonElement) {
      btn.disabled = false;
      btn.focus?.();
    }
    return true;
  }

  /** True when the download bar is done and Continue is enabled. */
  function isContinueReady() {
    if (!open || !el) return false;
    const btn = el.querySelector("[data-transition-continue]");
    return btn instanceof HTMLButtonElement && !btn.disabled;
  }

  /**
   * Keyboard / Next: skip the fill if still running; once ready, fire Continue
   * (callback / same as clicking the button). Escape cancels via hide().
   */
  function advanceFromKey() {
    if (!open || !el) return false;
    if (isContinueReady()) {
      const btn = el.querySelector("[data-transition-continue]");
      if (btn instanceof HTMLButtonElement) {
        btn.click();
        return true;
      }
    }
    return skipToContinue();
  }

  return {
    show,
    hide,
    skipToContinue,
    isContinueReady,
    advanceFromKey,
    get isOpen() {
      return open;
    },
  };
}
