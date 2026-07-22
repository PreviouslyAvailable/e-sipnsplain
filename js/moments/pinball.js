/**
 * 3D Pinball: Space Cadet — Win98 desktop integration (Section 2).
 *
 * Engine packaging: lrusso’s single-file web build (alula / k4zmu2a lineage).
 * Resources: NOT redistributed. Local play needs 3DPinballSpaceCadet.js under
 * /assets/pinball/ (embeds wasm + copyrighted data — see folder README).
 * Shell: borderless /assets/pinball/index.html (auto-loads in iframe; no double chrome).
 *
 * Reveal + continue gate live in this wrapper — not inside the iframe game.
 * Swap handler: onPinballReveal / triggerPinballEraReveal.
 *
 * Easter egg: type `hidden test` (with space) while the pinball window is active
 * → Win98-style fake debug panel (no WASM hooks). Z/C/Space play keys untouched.
 */

/**
 * Explicit index.html — under `npx serve`, bare `/assets/pinball` rewrites and
 * would break relative engine loads. Shell always loads the engine with an
 * absolute `/assets/pinball/3DPinballSpaceCadet.js` URL (see assets/pinball/).
 * Hardlink that JS from repo-root `3DPinballSpaceCadet-main/` (gitignored).
 */
const LOCAL_INDEX = "/assets/pinball/index.html";
/** lrusso packaged glue — directory listings must not count as a build. */
const LOCAL_ENGINE = "/assets/pinball/3DPinballSpaceCadet.js";

/**
 * Keys the pinball port consumes — keep deck nav from stealing them.
 * lrusso: Z left · C right · X tilt · Space launch · R restart · T sound.
 */
const PINBALL_KEYS = new Set([
  "z",
  "Z",
  "c",
  "C",
  "x",
  "X",
  "r",
  "R",
  "t",
  "T",
  "/",
  ".",
  " ",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Shift",
  "F2",
  "F3",
  "F4",
  "F8",
]);

const STATUS_PLAYING =
  "Click Play · Z left · C right · X tilt · Space launch · R restart · T sound";

const HIDDEN_TEST = "hidden test";

/**
 * Default era-photo reveal — period button opens reward window via opts.onReveal.
 * Swap by passing `{ onPinballReveal }` into createPinball, or call
 * `game.triggerPinballEraReveal()` from the deck.
 *
 * @param {{ openPhoto?: () => void, unlockContinue?: () => void }} hooks
 */
export function onPinballReveal(hooks = {}) {
  hooks.openPhoto?.();
  hooks.unlockContinue?.();
}

/**
 * @param {HTMLElement} root — `[data-pinball]` window
 * @param {{
 *   statusEl?: HTMLElement | null,
 *   onPinballReveal?: (hooks: { openPhoto?: () => void, unlockContinue?: () => void }) => void,
 *   openPhoto?: () => void,
 *   unlockContinue?: () => void,
 *   onContinue?: () => void,
 * }} [ui]
 */
export function createPinball(root, ui = {}) {
  const frame = root.querySelector("[data-pinball-frame]");
  const placeholder = root.querySelector("[data-pinball-placeholder]");
  const statusEl = ui.statusEl ?? root.querySelector("[data-pinball-status]");
  const client = root.querySelector("[data-pinball-client]");
  const revealBtn = root.querySelector("[data-pinball-reveal]");
  const continueBtn = root.querySelector("[data-pinball-continue]");
  const gate = root.querySelector("[data-pinball-gate]");

  let active = false;
  /** @type {'idle' | 'local' | 'missing'} */
  let mode = "idle";
  let revealed = false;
  /** Beat complete — trivial “scored” threshold (launch / reveal). */
  let scored = false;
  /** @type {AbortController | null} */
  let probeAbort = null;
  let cheatBuf = "";
  /** @type {HTMLElement | null} */
  let cheatPanel = null;
  /** @type {((e: KeyboardEvent) => void) | null} */
  let iframeKeyHandler = null;

  const revealHandler = ui.onPinballReveal ?? onPinballReveal;

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  /** Mark pinball beat complete (idempotent) — launch counts as a trivial score. */
  const markScored = () => {
    if (scored) return;
    scored = true;
    ui.unlockContinue?.();
  };

  const syncGate = () => {
    if (!gate) return;
    gate.hidden = mode !== "local";
    if (revealBtn) {
      revealBtn.hidden = revealed;
      revealBtn.disabled = mode !== "local";
    }
    if (continueBtn) {
      continueBtn.hidden = !revealed;
      continueBtn.disabled = !revealed;
    }
  };

  const hideCheatPanel = () => {
    if (!cheatPanel) return;
    cheatPanel.hidden = true;
    cheatPanel.setAttribute("aria-hidden", "true");
  };

  /**
   * Named swappable entry — reveal era photo(s), then enable continue gate.
   * Does not touch the iframe game.
   */
  function triggerPinballEraReveal() {
    if (revealed) {
      ui.openPhoto?.();
      syncGate();
      return true;
    }
    revealed = true;
    markScored();
    root.classList.add("is-revealed");
    revealHandler({
      openPhoto: ui.openPhoto,
      unlockContinue: ui.unlockContinue,
    });
    syncGate();
    setStatus("Photo unlocked · Continue when ready");
    return true;
  }

  const ensureCheatPanel = () => {
    if (cheatPanel || !client) return cheatPanel;
    const panel = document.createElement("div");
    panel.className = "w95-pinball-cheat";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Hidden Test");
    panel.setAttribute("aria-hidden", "true");
    panel.innerHTML = `
      <div class="w95-pinball-cheat-title">
        <span>Hidden Test</span>
        <button type="button" class="w95-pinball-cheat-x" data-pinball-cheat-close title="Close" aria-label="Close">×</button>
      </div>
      <div class="w95-pinball-cheat-body">
        <p class="w95-pinball-cheat-wink">;) debug menu — wrapper only (no WASM)</p>
        <label class="w95-pinball-cheat-row"><input type="checkbox" data-pinball-cheat-opt="gravity" /> Zero gravity (fake)</label>
        <label class="w95-pinball-cheat-row"><input type="checkbox" data-pinball-cheat-opt="balls" /> Extra balls ×99 (fake)</label>
        <label class="w95-pinball-cheat-row"><input type="checkbox" data-pinball-cheat-opt="sound" /> Dump sound table (noop)</label>
        <div class="w95-pinball-cheat-actions">
          <button type="button" class="w95-pinball-cheat-btn" data-pinball-cheat-reveal>Force reveal photo…</button>
          <button type="button" class="w95-pinball-cheat-btn" data-pinball-cheat-close>OK</button>
        </div>
      </div>
    `;
    client.appendChild(panel);
    panel.querySelectorAll("[data-pinball-cheat-close]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideCheatPanel();
      });
    });
    panel
      .querySelector("[data-pinball-cheat-reveal]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (gate) gate.hidden = false;
        if (revealBtn) {
          revealBtn.hidden = false;
          revealBtn.disabled = false;
        }
        triggerPinballEraReveal();
        setStatus("Hidden Test · photo unlocked — nice try, Space Cadet");
        hideCheatPanel();
      });
    cheatPanel = panel;
    return panel;
  };

  const showCheatPanel = () => {
    const panel = ensureCheatPanel();
    if (!panel) return;
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    setStatus("Hidden Test · wink wink");
  };

  /**
   * Observe keys for `hidden test` without eating Z/C/Space play controls.
   * @param {KeyboardEvent} e
   */
  const feedHiddenTest = (e) => {
    if (!active) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    // Space / flippers = “you scored” for the section gate (trivial threshold).
    if (
      e.code === "Space" ||
      e.key === " " ||
      e.key === "z" ||
      e.key === "Z" ||
      e.key === "c" ||
      e.key === "C"
    ) {
      markScored();
    }
    /** @type {string} */
    let ch = "";
    if (e.key === " " || e.code === "Space") ch = " ";
    else if (e.key.length === 1) ch = e.key.toLowerCase();
    else {
      if (e.key === "Escape" && cheatPanel && !cheatPanel.hidden) {
        hideCheatPanel();
      }
      return;
    }

    const next = cheatBuf + ch;
    if (HIDDEN_TEST.startsWith(next)) {
      cheatBuf = next;
      if (cheatBuf === HIDDEN_TEST) {
        cheatBuf = "";
        showCheatPanel();
      }
      return;
    }
    if (HIDDEN_TEST.startsWith(ch)) cheatBuf = ch;
    else cheatBuf = "";
  };

  const attachIframeKeys = () => {
    detachIframeKeys();
    if (!frame) return;
    try {
      const win = frame.contentWindow;
      if (!win) return;
      // Capture so we see keys even if the WASM shell stops them later.
      iframeKeyHandler = (e) => feedHiddenTest(e);
      win.addEventListener("keydown", iframeKeyHandler, true);
    } catch {
      /* ignore */
    }
  };

  const detachIframeKeys = () => {
    if (!iframeKeyHandler || !frame) return;
    try {
      frame.contentWindow?.removeEventListener(
        "keydown",
        iframeKeyHandler,
        true
      );
    } catch {
      /* cross-origin or unloaded */
    }
    iframeKeyHandler = null;
  };

  const showPlaceholder = (visible) => {
    if (placeholder) placeholder.hidden = !visible;
    if (frame) {
      frame.hidden = visible;
      if (visible) {
        detachIframeKeys();
        frame.removeAttribute("src");
        frame.setAttribute("aria-hidden", "true");
      }
    }
    client?.classList.toggle("is-playing", !visible);
  };

  const loadFrame = (url, label) => {
    if (!frame) return;
    showPlaceholder(false);
    frame.setAttribute("aria-hidden", "false");
    // Cache-bust shell only — engine file stays cacheable beside it.
    const sep = url.includes("?") ? "&" : "?";
    frame.src = `${url}${sep}embed=1`;
    setStatus(label);
    syncGate();
    const onLoad = () => {
      frame.removeEventListener("load", onLoad);
      attachIframeKeys();
      requestAnimationFrame(() => {
        try {
          frame.focus({ preventScroll: true });
        } catch {
          /* ignore */
        }
      });
    };
    frame.addEventListener("load", onLoad);
  };

  const probeLocal = async () => {
    probeAbort?.abort();
    probeAbort = new AbortController();
    const { signal } = probeAbort;
    setStatus("Looking for local build…");
    try {
      const engine = await fetch(LOCAL_ENGINE, {
        method: "HEAD",
        cache: "no-store",
        signal,
      });
      if (signal.aborted) return;
      if (engine.ok) {
        const shell = await fetch(LOCAL_INDEX, {
          method: "HEAD",
          cache: "no-store",
          signal,
        });
        if (signal.aborted) return;
        if (shell.ok) {
          mode = "local";
          loadFrame(LOCAL_INDEX, STATUS_PLAYING);
          return;
        }
      }
    } catch {
      if (signal.aborted) return;
    }
    mode = "missing";
    showPlaceholder(true);
    syncGate();
    setStatus("Drop 3DPinballSpaceCadet.js in assets/pinball/ — see README");
  };

  revealBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerPinballEraReveal();
  });

  continueBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!revealed) return;
    ui.unlockContinue?.();
    ui.onContinue?.();
  });

  function start() {
    active = true;
    cheatBuf = "";
    if (mode === "local") {
      if (frame?.src) {
        showPlaceholder(false);
        setStatus(STATUS_PLAYING);
        syncGate();
        attachIframeKeys();
        requestAnimationFrame(() => {
          try {
            frame.focus({ preventScroll: true });
          } catch {
            /* ignore */
          }
        });
      } else {
        void probeLocal();
      }
      return;
    }
    void probeLocal();
  }

  function stop() {
    active = false;
    cheatBuf = "";
    hideCheatPanel();
    detachIframeKeys();
    probeAbort?.abort();
    probeAbort = null;
    if (mode === "missing" || mode === "idle") {
      showPlaceholder(true);
      if (frame) frame.removeAttribute("src");
    }
    setStatus("Closed");
  }

  function reset() {
    active = false;
    mode = "idle";
    revealed = false;
    scored = false;
    cheatBuf = "";
    hideCheatPanel();
    detachIframeKeys();
    root.classList.remove("is-revealed");
    probeAbort?.abort();
    probeAbort = null;
    showPlaceholder(true);
    if (frame) {
      frame.removeAttribute("src");
      frame.setAttribute("aria-hidden", "true");
    }
    syncGate();
    setStatus("Ready");
  }

  function isRunning() {
    return active;
  }

  function hasRevealed() {
    return revealed;
  }

  /**
   * Consume keys while pinball chrome is open so deck ←/→ / Space don't steal them.
   * Also feeds the `hidden test` cheat buffer (does not block play keys beyond
   * the existing deck-steal prevention).
   *
   * If the iframe itself already has focus, play keys reach the WASM shell
   * directly (this handler is only reached at all when the parent document
   * has focus — e.g. right after clicking the Win98 title bar) and we don't
   * need to touch them. Otherwise forward the key into the embed so Z/C/X/
   * Space/R/T keep working without requiring a click inside the canvas.
   */
  function handleDeckKey(e) {
    if (!active) return false;
    feedHiddenTest(e);
    const isPinballKey =
      PINBALL_KEYS.has(e.key) ||
      e.key === "Shift" ||
      e.code === "ShiftLeft" ||
      e.code === "ShiftRight";
    if (!isPinballKey) {
      // Quiet deck +/- while typing the cheat phrase
      if (cheatBuf.length > 0 && e.key.length === 1) {
        return true;
      }
      return false;
    }

    // Embed already focused — it eats keys natively; parent must not preventDefault.
    let embedFocused = false;
    try {
      embedFocused =
        Boolean(frame && document.activeElement === frame) ||
        Boolean(frame?.contentDocument?.hasFocus?.());
    } catch {
      embedFocused = Boolean(frame && document.activeElement === frame);
    }
    if (embedFocused) return false;

    // Parent (e.g. title bar) has focus — stop deck nav and hand the key to the game.
    e.preventDefault();
    e.stopPropagation();
    try {
      const win = frame?.contentWindow;
      const doc = frame?.contentDocument;
      const canvas = doc?.getElementById("canvas");
      const target = canvas || doc || win;
      if (target && typeof target.dispatchEvent === "function") {
        const opts = {
          key: e.key,
          code: e.code,
          keyCode: e.keyCode,
          which: e.which,
          bubbles: true,
          cancelable: true,
          shiftKey: e.shiftKey,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          metaKey: e.metaKey,
        };
        target.dispatchEvent(new KeyboardEvent(e.type || "keydown", opts));
      }
      frame?.focus?.({ preventScroll: true });
      canvas?.focus?.({ preventScroll: true });
    } catch {
      try {
        frame?.focus?.({ preventScroll: true });
      } catch {
        /* ignore */
      }
    }
    return true;
  }

  reset();

  return {
    start,
    stop,
    reset,
    isRunning,
    hasRevealed,
    handleDeckKey,
    triggerPinballEraReveal,
    onPinballReveal: triggerPinballEraReveal,
  };
}
