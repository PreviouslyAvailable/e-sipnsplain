/**
 * SkiFree — Win98 desktop integration.
 *
 * Engine: basicallydan/skifree.js (MIT), vendored under /assets/skifree-js/
 * from local drop-in skifree.js-master/ (finish → yeti → Game Over → photo).
 * Shell: borderless /assets/skifree-js/index.html inside Win98 chrome.
 *
 * Start → Entertainment Pack → SkiFree (alongside Space Cadet).
 *
 * postMessage types from embed:
 *   skifree-esc | skifree-finish | skifree-yeti | skifree-gameover | skifree-gameover-photo
 *
 * Game Over confirm paints a full-bleed reward cover inside the Ski client
 * (over the iframe) — not a separate Win98 photo window.
 */

const LOCAL_INDEX = "/assets/skifree-js/index.html";

/**
 * Keys skifree.js consumes — keep deck nav from stealing them while the
 * iframe may not have focus yet (or after Esc focus returns to the desktop).
 */
const SKI_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "w",
  "W",
  "a",
  "A",
  "s",
  "S",
  "d",
  "D",
  "f",
  "F",
  "t",
  "T",
  "m",
  "M",
  "b",
  "B",
  " ",
]);

/**
 * @param {HTMLElement} root — `[data-w98-ski]` (or legacy `[data-w95-ski]`) window
 * @param {{
 *   statusEl?: HTMLElement | null,
 *   scoreEl?: HTMLElement | null,
 *   onEsc?: () => void,
 *   onFinish?: (info?: { phase?: string, metres?: number }) => void,
 *   onYeti?: (info?: { via?: string }) => void,
 *   onGameOver?: () => void,
 *   onGameOverPhoto?: () => void,
 *   onMilestone?: (info: { kind: string }) => void,
 * }} [ui]
 */
export function createSkiFree(root, ui = {}) {
  const frame = root.querySelector(
    "[data-w98-ski-frame], [data-w95-ski-frame]"
  );
  const statusEl =
    ui.statusEl ??
    root.querySelector("[data-w98-ski-status], [data-w95-ski-status]");
  const scoreEl =
    ui.scoreEl ??
    root.querySelector("[data-w98-ski-score], [data-w95-ski-score]");
  const client = root.querySelector(
    "[data-w98-ski-client], [data-w95-ski-client]"
  );
  const rewardCover = root.querySelector("[data-w98-ski-reward-cover]");

  let active = false;
  /** @type {((e: MessageEvent) => void) | null} */
  let onMessage = null;

  const setStatus = (text) => {
    if (statusEl) statusEl.textContent = text;
  };

  const setScore = (text) => {
    if (scoreEl) scoreEl.textContent = text;
  };

  const showRewardCover = () => {
    if (!rewardCover) return false;
    rewardCover.hidden = false;
    rewardCover.setAttribute("aria-hidden", "false");
    client?.classList.add("has-reward");
    return true;
  };

  const hideRewardCover = () => {
    if (!rewardCover) return;
    rewardCover.hidden = true;
    rewardCover.setAttribute("aria-hidden", "true");
    client?.classList.remove("has-reward");
  };

  const unloadFrame = () => {
    if (!frame) return;
    frame.removeAttribute("src");
    frame.hidden = true;
    frame.setAttribute("aria-hidden", "true");
    client?.classList.remove("is-playing");
    hideRewardCover();
  };

  const loadFrame = () => {
    if (!frame) return;
    hideRewardCover();
    client?.classList.add("is-playing");
    frame.hidden = false;
    frame.setAttribute("aria-hidden", "false");
    const params = new URLSearchParams();
    params.set("embed", "1");
    // Forward ?finishM=N from the deck URL for local beat testing.
    try {
      const finishM = new URLSearchParams(window.location.search).get("finishM");
      if (finishM) params.set("finishM", finishM);
    } catch {
      /* ignore */
    }
    frame.src = `${LOCAL_INDEX}?${params.toString()}`;
    setStatus("WASD / arrows · mouse · F boost · finish @ ~1000m");
    setScore("skifree.js");
    requestAnimationFrame(() => {
      try {
        frame.focus({ preventScroll: true });
      } catch {
        /* ignore */
      }
    });
  };

  function start() {
    if (active) return;
    active = true;
    onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      const type = e.data?.type;
      if (type === "skifree-esc") {
        ui.onEsc?.();
        return;
      }
      if (type === "skifree-finish") {
        const phase = e.data?.phase || "placed";
        if (phase === "crossed") {
          setStatus("Finish! · yeti incoming");
          setScore("finish");
        } else {
          setStatus("Finish line ahead · keep skiing");
          setScore(`${Math.round(Number(e.data?.metres) || 0)}m`);
        }
        ui.onFinish?.(e.data);
        ui.onMilestone?.({ kind: "finish", ...e.data });
        return;
      }
      if (type === "skifree-yeti") {
        setStatus("Yeti! · wipeout");
        setScore("caught");
        ui.onYeti?.(e.data);
        ui.onMilestone?.({ kind: "yeti", ...e.data });
        return;
      }
      if (type === "skifree-gameover") {
        setStatus("Game Over · confirm for photo");
        setScore("game over");
        ui.onGameOver?.(e.data);
        ui.onMilestone?.({ kind: "gameover", ...e.data });
        return;
      }
      // Confirm Game Over → full-bleed reward in Ski client + completeBeat('skifree')
      if (type === "skifree-gameover-photo") {
        showRewardCover();
        setStatus("Photo beat · reward.bmp");
        setScore("reward");
        ui.onGameOverPhoto?.(e.data);
        ui.onMilestone?.({ kind: "gameover-photo", ...e.data });
      }
    };
    window.addEventListener("message", onMessage);
    loadFrame();
  }

  function stop() {
    if (!active) return;
    active = false;
    if (onMessage) {
      window.removeEventListener("message", onMessage);
      onMessage = null;
    }
    unloadFrame();
    setStatus("↓ Finish @ ~1000m · Esc closes");
    setScore("ready");
  }

  function isRunning() {
    return active;
  }

  function hasReward() {
    return Boolean(rewardCover && !rewardCover.hidden);
  }

  /**
   * While SkiFree is open, keep deck ←/→ / Space from stealing game keys —
   * but never trap Shift+Arrow (presenter escape), and don't swallow keys the
   * iframe already owns. If the parent has focus, forward into the embed.
   */
  function handleDeckKey(e) {
    if (!active) return false;
    // Presenter escape — let engine onKey handle Shift+Arrow nav
    if (
      e.shiftKey &&
      (e.key.startsWith("Arrow") || e.key === "PageUp" || e.key === "PageDown")
    ) {
      return false;
    }
    const isSkiKey = SKI_KEYS.has(e.key) || e.code.startsWith("Arrow");
    if (!isSkiKey) return false;

    // Embed already focused — it eats keys; parent must not preventDefault.
    let embedFocused = false;
    try {
      embedFocused =
        Boolean(frame && document.activeElement === frame) ||
        Boolean(frame?.contentDocument?.hasFocus?.());
    } catch {
      embedFocused = Boolean(frame && document.activeElement === frame);
    }
    if (embedFocused) return false;

    // Parent has focus: stop deck nav and hand the key to the game.
    e.preventDefault();
    e.stopPropagation();
    try {
      const win = frame?.contentWindow;
      const doc = frame?.contentDocument;
      const canvas = doc?.getElementById("skifree-canvas");
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

  function resetRun() {
    if (!active) return;
    unloadFrame();
    loadFrame();
  }

  setStatus("↓ Finish @ ~1000m · Esc closes");
  setScore("ready");

  return {
    start,
    stop,
    isRunning,
    handleDeckKey,
    resetRun,
    showRewardCover,
    hideRewardCover,
    hasReward,
  };
}
