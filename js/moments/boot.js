/**
 * Cold-open boot — Win95 blue loading screen + dial-up.
 * Funny “Starting…” copy (boot ≠ crash). Separate from any later Y2K gag.
 * Staged funny lines, then click / key to land on the desktop (no auto-advance).
 *
 * Audio: assets/audio/dialup-handshake.wav (procedural 56k homage).
 * Plays ~10s after boot overlay starts (cleared if the presenter continues earlier).
 * Autoplay may be blocked until the first user gesture — we retry on pointerdown.
 */

const DIALUP_SRC = "/assets/audio/dialup-handshake.wav";
/** Delay from boot `run()` before dial-up starts (opening-screen beat). */
const DIALUP_DELAY_MS = 10000;

/** Staged log under the lead line (lead itself is “Loading Windows 95…”). */
const BOOT_LINES = [
  "Loading presentation…",
  "Loading “Press Start”…",
  "Defragmenting existential dread…",
  "Negotiating dial-up of feelings…",
  "Almost ready…",
];

export function createBoot(ctx) {
  let overlay = null;
  let audioEl = null;
  let timers = [];
  let running = false;
  let canContinue = false;
  let reduceMotion = false;
  let unlockBound = false;
  /** @type {null | ((info:{skipped:boolean}) => void)} */
  let onDone = null;

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function ensureAudio() {
    if (audioEl) return audioEl;
    audioEl = new Audio(DIALUP_SRC);
    audioEl.preload = "auto";
    audioEl.setAttribute("playsinline", "");
    return audioEl;
  }

  function stopAudio() {
    if (!audioEl) return;
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
    } catch {
      /* ignore */
    }
  }

  function playDialup() {
    if (ctx.muted || reduceMotion) return;
    const el = ensureAudio();
    el.volume = 0.55;
    const attempt = () => {
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay blocked — retry on first gesture
          if (unlockBound) return;
          unlockBound = true;
          const unlock = () => {
            if (!running || ctx.muted) return;
            el.play().catch(() => {});
          };
          window.addEventListener("pointerdown", unlock, { once: true });
          window.addEventListener("keydown", unlock, { once: true });
        });
      }
    };
    attempt();
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "boot-bsod";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Loading Windows 95 — click or press any key to continue");
    overlay.tabIndex = -1;
    overlay.innerHTML = `
      <div class="bsod-screen" data-boot-dismiss>
        <div class="bsod-inner">
          <div class="bsod-pill">Windows</div>
          <div class="bsod-body">
            <p data-boot-lead>Loading Windows 95…</p>
            <pre class="bsod-boot-log" data-boot-log></pre>
            <p class="bsod-warn" data-boot-warn>Connecting via dial-up · please wait</p>
          </div>
          <p class="bsod-continue" data-boot-continue hidden>
            Click or press any key to continue <span class="bsod-cursor">_</span>
          </p>
        </div>
      </div>
    `;
    overlay.addEventListener("click", (e) => {
      if (!running) return;
      e.preventDefault();
      // First click also unlocks dial-up if autoplay was blocked
      if (!canContinue) {
        playDialup();
        return;
      }
      finish({ skipped: false });
    });
    (document.getElementById("stage") || document.body).appendChild(overlay);
    return overlay;
  }

  function setContinueReady(ready) {
    canContinue = ready;
    if (!overlay) return;
    overlay.classList.toggle("is-ready", ready);
    const cont = overlay.querySelector("[data-boot-continue]");
    if (cont) cont.hidden = !ready;
    if (ready) {
      overlay.setAttribute(
        "aria-label",
        "Loading complete — click or press any key to continue"
      );
    }
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.remove("is-live", "is-ready");
    overlay.setAttribute("aria-hidden", "true");
  }

  function finish({ skipped = false } = {}) {
    if (!running) return;
    clearTimers();
    running = false;
    canContinue = false;
    stopAudio();
    hideOverlay();
    document.body.classList.remove("is-booting");
    const cb = onDone;
    onDone = null;
    cb?.({ skipped });
    ctx.hooks?.onBootComplete?.({ skipped });
  }

  function typeLog(el, lines, onTyped) {
    let i = 0;
    let text = "";
    function tick() {
      if (!running) return;
      if (i >= lines.length) {
        onTyped?.();
        return;
      }
      text += (text ? "\n" : "") + lines[i];
      el.textContent = text;
      i += 1;
      // Continue only after every funny line has been shown
      if (i >= lines.length) setContinueReady(true);
      timers.push(setTimeout(tick, reduceMotion ? 16 : 320 + Math.random() * 180));
    }
    tick();
  }

  /**
   * @param {{ reason?: string, onComplete?: (info:{skipped:boolean}) => void }} [opts]
   */
  function run(opts = {}) {
    if (running) return;
    reduceMotion = Boolean(ctx.reduceMotion);
    onDone = opts.onComplete || null;
    running = true;
    canContinue = false;
    unlockBound = false;

    ctx.moments?.crtBoot?.skip?.();
    ctx.moments?.ambient?.stop?.();

    const el = ensureOverlay();
    const log = el.querySelector("[data-boot-log]");
    const lead = el.querySelector("[data-boot-lead]");
    const warn = el.querySelector("[data-boot-warn]");
    if (lead) lead.textContent = "Loading Windows 95…";
    if (log) log.textContent = "";
    if (warn) {
      warn.textContent =
        opts.reason === "restart"
          ? "You crashed · reconnecting via dial-up…"
          : "Connecting via dial-up · please wait";
    }
    setContinueReady(false);

    el.setAttribute("aria-hidden", "false");
    el.classList.add("is-live");
    document.body.classList.add("is-booting");

    // Atmosphere: wait on the opening screen, then dial-up (mute / reduced-motion skip in playDialup).
    if (!reduceMotion) {
      timers.push(
        setTimeout(() => {
          if (!running) return;
          playDialup();
        }, DIALUP_DELAY_MS)
      );
    }

    if (reduceMotion) {
      if (log) log.textContent = BOOT_LINES.join("\n");
      setContinueReady(true);
      return;
    }

    timers.push(
      setTimeout(() => {
        if (!running || !log) return;
        typeLog(log, BOOT_LINES, () => {
          setContinueReady(true);
        });
      }, 350)
    );
  }

  function skip() {
    if (!running || !canContinue) return false;
    finish({ skipped: true });
    return true;
  }

  return {
    run,
    skip,
    get isRunning() {
      return running;
    },
  };
}
