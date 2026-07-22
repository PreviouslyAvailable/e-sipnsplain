/**
 * Y2K theatre — Win98 → XP (cosmetic only).
 *
 * Clock takeover (3 stages) → date rollover to 1 Jan 2000 → midnight →
 * scripted BSOD (no lives/checkpoint reset) → brief reboot → hands off to
 * the CD-install interstitial.
 *
 * Separate from cold-open boot.js (funny load lines, not a crash).
 */

const XP_PRELOAD = [
  "/assets/winxp-ui/bliss.svg",
  "/assets/audio/winxp/startup.wav",
  "/assets/icons/wxp/my-computer.png",
  "/assets/icons/wxp/recycle-empty.png",
];

/**
 * @param {{
 *   reduceMotion?: boolean,
 *   getMuted?: () => boolean,
 *   blip?: (kind: string) => void,
 *   sfx?: { play?: (k: string) => string, unlock?: () => void, ensure?: () => AudioContext | null },
 *   root?: HTMLElement | Document,
 * }} [ctx]
 */
export function createY2kTransition(ctx = {}) {
  const mountRoot =
    (ctx.root && "getElementById" in ctx.root
      ? ctx.root.getElementById("stage")
      : null) ||
    document.getElementById("stage") ||
    document.body;

  /** @type {HTMLElement | null} */
  let overlay = null;
  /** @type {HTMLElement | null} */
  let dateFlash = null;
  /** @type {ReturnType<typeof setTimeout>[]} */
  let timers = [];
  /** @type {number | null} */
  let rafId = null;
  let running = false;
  let stage = "idle";
  /** @type {(() => void) | null} */
  let onInstallCb = null;
  /** @type {HTMLElement | null} */
  let clockEl = null;
  /** @type {(() => void) | null} */
  let stopRealClock = null;
  /** @type {AudioContext | null} */
  let bedCtx = null;
  /** @type {OscillatorNode | null} */
  let tickOsc = null;
  /** @type {GainNode | null} */
  let bedGain = null;

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function wait(ms) {
    return new Promise((resolve) => {
      if (!running) {
        resolve();
        return;
      }
      timers.push(setTimeout(resolve, ms));
    });
  }

  function formatClock(d) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  function formatDateShort(d) {
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  /** @type {((d: Date) => void) | null} */
  let onTick = null;

  function setClock(d) {
    if (clockEl) clockEl.textContent = formatClock(d);
    onTick?.(d);
  }

  function ensureDateFlash() {
    if (dateFlash) return dateFlash;
    dateFlash = document.createElement("div");
    dateFlash.className = "y2k-date-flash";
    dateFlash.setAttribute("aria-hidden", "true");
    mountRoot.appendChild(dateFlash);
    return dateFlash;
  }

  function showDateFlash(text) {
    const el = ensureDateFlash();
    el.textContent = text;
    el.classList.add("is-live");
    timers.push(
      setTimeout(() => {
        el.classList.remove("is-live");
      }, ctx.reduceMotion ? 400 : 1600)
    );
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "y2k-theatre";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="y2k-bsod" data-y2k-bsod data-cosmetic-death="true" hidden>
        <div class="y2k-bsod-inner">
          <div class="y2k-bsod-pill">Windows</div>
          <div class="y2k-bsod-body">
            <p>A fatal exception 0E has occurred at 0028:C0001Y2K in VXD VMM(01) +
            00010F44. The current application will be terminated.</p>
            <p>* Press any key to terminate the current application.<br>
            * Press CTRL+ALT+DEL again to restart your computer. You will
            lose any unsaved information in all applications.</p>
            <p class="y2k-bsod-wait">Press any key to continue <span class="y2k-bsod-cursor">_</span></p>
          </div>
        </div>
      </div>
      <div class="y2k-reboot" data-y2k-reboot hidden>
        <pre class="y2k-post" data-y2k-post></pre>
      </div>
    `;
    mountRoot.appendChild(overlay);
    return overlay;
  }

  function stopAudioBed() {
    try {
      tickOsc?.stop();
    } catch {
      /* ignore */
    }
    tickOsc = null;
    if (bedGain && bedCtx) {
      try {
        bedGain.gain.cancelScheduledValues(bedCtx.currentTime);
        bedGain.gain.setValueAtTime(0.0001, bedCtx.currentTime);
      } catch {
        /* ignore */
      }
    }
    bedGain = null;
    bedCtx = null;
  }

  /** Rising tick / churn under the clock sprint — gesture-unlocked only. */
  function startAudioBed() {
    if (ctx.getMuted?.() || ctx.reduceMotion) return;
    ctx.sfx?.unlock?.();
    const ac = ctx.sfx?.ensure?.() || null;
    if (!ac) return;
    bedCtx = ac;
    try {
      bedGain = ac.createGain();
      bedGain.gain.value = 0.0001;
      bedGain.connect(ac.destination);

      // Soft HDD churn (filtered noise)
      const len = Math.floor(ac.sampleRate * 0.08);
      const buf = ac.createBuffer(1, len, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      const noise = ac.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const filter = ac.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1800;
      filter.Q.value = 0.6;
      noise.connect(filter);
      filter.connect(bedGain);
      noise.start();

      // Clock tick pulse
      tickOsc = ac.createOscillator();
      const tickGain = ac.createGain();
      tickOsc.type = "square";
      tickOsc.frequency.value = 880;
      tickGain.gain.value = 0;
      tickOsc.connect(tickGain);
      tickGain.connect(bedGain);
      tickOsc.start();

      const now = ac.currentTime;
      bedGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      bedGain.gain.linearRampToValueAtTime(0.09, now + 5);
      bedGain.gain.linearRampToValueAtTime(0.14, now + 9);

      // Pulse ticks via gain
      let beat = 0;
      const pulse = () => {
        if (!running || !bedCtx || !tickOsc) return;
        const t = bedCtx.currentTime;
        tickGain.gain.cancelScheduledValues(t);
        tickGain.gain.setValueAtTime(0.0001, t);
        tickGain.gain.linearRampToValueAtTime(0.05, t + 0.01);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
        beat += 1;
        const gap = beat < 8 ? 420 : beat < 16 ? 220 : 90;
        timers.push(setTimeout(pulse, gap));
      };
      pulse();
    } catch {
      stopAudioBed();
    }
  }

  /**
   * Animate virtual time from `from` toward target with accelerating rate.
   * @param {Date} from
   * @param {number} durationMs
   * @param {number} advanceMs  how much virtual time to jump over the stage
   * @param {{ onFrame?: (d: Date, t: number) => void }} [hooks]
   */
  function animateClock(from, durationMs, advanceMs, hooks = {}) {
    return new Promise((resolve) => {
      if (!running) {
        resolve(from);
        return;
      }
      if (ctx.reduceMotion || durationMs <= 0) {
        const end = new Date(from.getTime() + advanceMs);
        setClock(end);
        hooks.onFrame?.(end, 1);
        resolve(end);
        return;
      }
      const started = performance.now();
      const startMs = from.getTime();
      const step = (now) => {
        if (!running) {
          resolve(from);
          return;
        }
        const t = Math.min(1, (now - started) / durationMs);
        // Ease-in so late stage feels faster within the stage
        const eased = t * t;
        const d = new Date(startMs + advanceMs * eased);
        setClock(d);
        hooks.onFrame?.(d, t);
        if (t >= 1) {
          rafId = null;
          resolve(d);
          return;
        }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    });
  }

  function showBsod() {
    const node = ensureOverlay();
    node.classList.add("is-live");
    node.setAttribute("aria-hidden", "false");
    node.setAttribute("role", "alertdialog");
    node.setAttribute("aria-label", "Windows — scripted Y2K blue screen (cosmetic)");
    const bsod = node.querySelector("[data-y2k-bsod]");
    const reboot = node.querySelector("[data-y2k-reboot]");
    if (bsod instanceof HTMLElement) bsod.hidden = false;
    if (reboot instanceof HTMLElement) reboot.hidden = true;
    stage = "bsod";
    ctx.blip?.("error");
  }

  function showReboot() {
    const node = ensureOverlay();
    const bsod = node.querySelector("[data-y2k-bsod]");
    const reboot = node.querySelector("[data-y2k-reboot]");
    const post = node.querySelector("[data-y2k-post]");
    if (bsod instanceof HTMLElement) bsod.hidden = true;
    if (reboot instanceof HTMLElement) reboot.hidden = false;
    if (post) {
      post.textContent = [
        "AMI BIOS (C) 1985-1999",
        "Pentium III  ·  Memory Test: 131072K OK",
        "",
        "Detecting IDE Primary Master... CD-ROM",
        "Detecting IDE Primary Slave... None",
        "",
        "Booting from CD-ROM...",
      ].join("\n");
    }
    stage = "reboot";
    ctx.blip?.("press");
  }

  function hideTheatre() {
    if (!overlay) return;
    overlay.classList.remove("is-live");
    overlay.setAttribute("aria-hidden", "true");
    const bsod = overlay.querySelector("[data-y2k-bsod]");
    const reboot = overlay.querySelector("[data-y2k-reboot]");
    if (bsod instanceof HTMLElement) bsod.hidden = true;
    if (reboot instanceof HTMLElement) reboot.hidden = true;
  }

  /** Preload XP assets during install interstitial (and kick early here). */
  function preloadXpAssets() {
    const jobs = XP_PRELOAD.map((url) => {
      if (/\.(wav|mp3|ogg)$/i.test(url)) {
        return fetch(url, { cache: "force-cache" }).catch(() => null);
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    });
    // Warm startup WAV through SFX decode when available
    ctx.sfx?.unlock?.();
    return Promise.all(jobs);
  }

  async function runSequence() {
    const reduce = Boolean(ctx.reduceMotion);
    const armMs = reduce ? 200 : 1100;
    const s1 = reduce ? 200 : 2500;
    const s2 = reduce ? 200 : 2500;
    const s3 = reduce ? 300 : 3200;
    const bsodHold = reduce ? 400 : 2400;
    const rebootHold = reduce ? 350 : 1400;

    stage = "arm";
    await wait(armMs);
    if (!running) return;

    stopRealClock?.();
    startAudioBed();
    void preloadXpAssets();

    // Anchor near "now" on Dec 31 1999 so the sprint lands on Y2K
    let virtual = new Date();
    virtual.setFullYear(1999, 11, 31);
    // Keep wall-clock hour/minute as starting point for the gag
    const wall = new Date();
    virtual.setHours(wall.getHours(), wall.getMinutes(), wall.getSeconds(), 0);
    setClock(virtual);
    if (clockEl) {
      clockEl.classList.add("is-y2k-takeover");
      clockEl.title = formatDateShort(virtual);
    }

    // Stage 1 — drift (slightly fast)
    stage = "drift";
    virtual = await animateClock(virtual, s1, 4 * 60_000); // +4 min
    if (!running) return;

    // Stage 2 — speed-up
    stage = "speedup";
    virtual = await animateClock(virtual, s2, 55 * 60_000); // +55 min
    if (!running) return;

    // Stage 3 — sprint toward midnight + date rollover
    stage = "sprint";
    let rolled = false;
    const target = new Date(2000, 0, 1, 0, 0, 0, 0);
    const remaining = Math.max(30_000, target.getTime() - virtual.getTime());
    virtual = await animateClock(virtual, s3, remaining, {
      onFrame: (d) => {
        if (clockEl) clockEl.title = formatDateShort(d);
        if (!rolled && d.getFullYear() >= 2000) {
          rolled = true;
          showDateFlash("January 1, 2000");
          if (clockEl) {
            clockEl.classList.add("is-y2k-rollover");
            clockEl.title = "Sat Jan 1, 2000";
          }
          ctx.blip?.("updateUnlock");
        }
      },
    });
    if (!running) return;

    // Midnight snap
    virtual = new Date(2000, 0, 1, 0, 0, 0, 0);
    setClock(virtual);
    if (clockEl) {
      clockEl.textContent = "12:00:00 AM";
      clockEl.title = "Sat Jan 1, 2000";
      clockEl.classList.add("is-y2k-midnight");
    }
    showDateFlash("12:00 AM  ·  January 1, 2000");
    stopAudioBed();
    await wait(reduce ? 120 : 450);
    if (!running) return;

    // Scripted BSOD — cosmetic; never resets progress
    showBsod();
    await wait(bsodHold);
    if (!running) return;

    showReboot();
    await wait(rebootHold);
    if (!running) return;

    hideTheatre();
    stage = "install";
    const cb = onInstallCb;
    onInstallCb = null;
    onTick = null;
    running = false;
    stage = "idle";
    cb?.();
  }

  /**
   * @param {{
   *   clockEl?: HTMLElement | null,
   *   stopRealClock?: () => void,
   *   onInstall?: () => void,
   *   onTick?: (d: Date) => void,
   * }} opts
   */
  function start(opts = {}) {
    if (running) return false;
    running = true;
    clockEl = opts.clockEl || null;
    stopRealClock = opts.stopRealClock || null;
    onInstallCb = opts.onInstall || null;
    onTick = opts.onTick || null;
    ensureOverlay();
    clearTimers();
    void runSequence().catch(() => {
      running = false;
      stage = "idle";
      stopAudioBed();
      hideTheatre();
      onTick = null;
    });
    return true;
  }

  /** Skip ahead to the install handoff (presenter Next). */
  function skipToInstall() {
    if (!running) return false;
    clearTimers();
    stopAudioBed();
    hideTheatre();
    const midnight = new Date(2000, 0, 1, 0, 0, 0, 0);
    if (clockEl) {
      clockEl.textContent = "12:00:00 AM";
      clockEl.title = "Sat Jan 1, 2000";
      clockEl.classList.add("is-y2k-takeover", "is-y2k-midnight");
    }
    onTick?.(midnight);
    const cb = onInstallCb;
    onInstallCb = null;
    onTick = null;
    running = false;
    stage = "idle";
    cb?.();
    return true;
  }

  function abort() {
    if (!running) return false;
    clearTimers();
    stopAudioBed();
    hideTheatre();
    onInstallCb = null;
    onTick = null;
    running = false;
    stage = "idle";
    return true;
  }

  return {
    start,
    skipToInstall,
    abort,
    preloadXpAssets,
    XP_PRELOAD,
    get isRunning() {
      return running;
    },
    get stage() {
      return stage;
    },
  };
}
