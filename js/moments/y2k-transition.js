/**
 * Y2K theatre — Win98 → XP (cosmetic only).
 *
 * Clock takeover (3 stages) → date rollover to 1 Jan 2000 → midnight →
 * scripted BSOD (wait for click/key) → POST/CD reboot (wait for click/key) →
 * hands off to the CD-install interstitial.
 *
 * After midnight there are two presenter gates so pacing stays in your hands.
 * Next / Space / Enter / click advances one gate; Esc aborts (cosmetic only).
 *
 * Separate from cold-open boot.js (funny load lines, not a crash).
 */

const XP_PRELOAD = [
  "/assets/winxp-ui/bliss.jpg",
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
  /** Resolves the current click/key gate (BSOD or reboot). */
  /** @type {(() => void) | null} */
  let gateResolve = null;
  /** @type {((e: Event) => void) | null} */
  let overlayClickHandler = null;
  /** Resolvers for in-flight wait()/animateClock — flushed by clearTimers(). */
  /** @type {Set<() => void>} */
  const pendingWaits = new Set();
  /** Bumped to abandon an in-flight runSequence when jumping to a gate. */
  let seqId = 0;

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // Unblock awaited wait()/animateClock so runSequence can exit cleanly.
    const blocked = [...pendingWaits];
    pendingWaits.clear();
    blocked.forEach((resolve) => resolve());
  }

  function wait(ms) {
    return new Promise((resolve) => {
      if (!running) {
        resolve();
        return;
      }
      const done = () => {
        pendingWaits.delete(done);
        resolve();
      };
      pendingWaits.add(done);
      timers.push(
        setTimeout(() => {
          pendingWaits.delete(done);
          resolve();
        }, ms)
      );
    });
  }

  /** Pause until presenter click / key / Next via advance(). */
  function waitForGate() {
    return new Promise((resolve) => {
      if (!running) {
        resolve();
        return;
      }
      if (gateResolve) {
        const prev = gateResolve;
        gateResolve = null;
        prev();
      }
      gateResolve = () => {
        gateResolve = null;
        resolve();
      };
    });
  }

  function releaseGate() {
    if (!gateResolve) return false;
    const done = gateResolve;
    gateResolve = null;
    done();
    return true;
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
        <p class="y2k-reboot-wait" data-y2k-reboot-wait hidden>
          Press any key to continue <span class="y2k-bsod-cursor">_</span>
        </p>
      </div>
    `;
    overlayClickHandler = (e) => {
      e.preventDefault();
      advance();
    };
    // pointerdown only — click would fire after and skip both gates in one press
    overlay.addEventListener("pointerdown", overlayClickHandler);
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
      // Stretched to match longer drift→sprint (~14s post-arm)
      bedGain.gain.linearRampToValueAtTime(0.04, now + 1.5);
      bedGain.gain.linearRampToValueAtTime(0.09, now + 8);
      bedGain.gain.linearRampToValueAtTime(0.14, now + 14);

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
        // Slow → medium → frantic across the longer run-up
        const gap = beat < 12 ? 420 : beat < 28 ? 220 : 90;
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
      const finish = (d) => {
        pendingWaits.delete(cancel);
        rafId = null;
        resolve(d);
      };
      const cancel = () => finish(from);
      pendingWaits.add(cancel);
      const step = (now) => {
        if (!running || !pendingWaits.has(cancel)) {
          finish(from);
          return;
        }
        const t = Math.min(1, (now - started) / durationMs);
        // Ease-in so late stage feels faster within the stage
        const eased = t * t;
        const d = new Date(startMs + advanceMs * eased);
        setClock(d);
        hooks.onFrame?.(d, t);
        if (t >= 1) {
          finish(d);
          return;
        }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    });
  }

  function showBsod() {
    const node = ensureOverlay();
    node.classList.add("is-live", "is-gated");
    node.setAttribute("aria-hidden", "false");
    node.setAttribute("role", "alertdialog");
    node.setAttribute("aria-label", "Windows — scripted Y2K blue screen (cosmetic)");
    const bsod = node.querySelector("[data-y2k-bsod]");
    const reboot = node.querySelector("[data-y2k-reboot]");
    const rebootWait = node.querySelector("[data-y2k-reboot-wait]");
    if (bsod instanceof HTMLElement) bsod.hidden = false;
    if (reboot instanceof HTMLElement) reboot.hidden = true;
    if (rebootWait instanceof HTMLElement) rebootWait.hidden = true;
    stage = "bsod-gate";
    ctx.blip?.("error");
  }

  function showReboot() {
    const node = ensureOverlay();
    node.classList.add("is-live", "is-gated");
    const bsod = node.querySelector("[data-y2k-bsod]");
    const reboot = node.querySelector("[data-y2k-reboot]");
    const post = node.querySelector("[data-y2k-post]");
    const rebootWait = node.querySelector("[data-y2k-reboot-wait]");
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
    if (rebootWait instanceof HTMLElement) rebootWait.hidden = false;
    stage = "reboot-gate";
    ctx.blip?.("press");
  }

  function hideTheatre() {
    if (!overlay) return;
    overlay.classList.remove("is-live", "is-gated");
    overlay.setAttribute("aria-hidden", "true");
    const bsod = overlay.querySelector("[data-y2k-bsod]");
    const reboot = overlay.querySelector("[data-y2k-reboot]");
    const rebootWait = overlay.querySelector("[data-y2k-reboot-wait]");
    if (bsod instanceof HTMLElement) bsod.hidden = true;
    if (reboot instanceof HTMLElement) reboot.hidden = true;
    if (rebootWait instanceof HTMLElement) rebootWait.hidden = true;
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

  function snapToMidnight() {
    const midnight = new Date(2000, 0, 1, 0, 0, 0, 0);
    setClock(midnight);
    if (clockEl) {
      clockEl.textContent = "12:00:00 AM";
      clockEl.title = "Sat Jan 1, 2000";
      clockEl.classList.add(
        "is-y2k-takeover",
        "is-y2k-rollover",
        "is-y2k-midnight"
      );
    }
    onTick?.(midnight);
    return midnight;
  }

  function handOffInstall() {
    hideTheatre();
    const cb = onInstallCb;
    onInstallCb = null;
    onTick = null;
    running = false;
    stage = "idle";
    cb?.();
  }

  /** Shared post-midnight gates — used by the natural sequence and by advance(). */
  async function runPostMidnightGates(mySeq) {
    const reduce = Boolean(ctx.reduceMotion);
    stopAudioBed();
    snapToMidnight();
    // Strike midnight — glass/impact crash, not a celebratory unlock chime.
    ctx.blip?.("crash");
    showDateFlash("12:00 AM  ·  January 1, 2000");
    await wait(reduce ? 120 : 450);
    if (!running || mySeq !== seqId) return;

    // Gate 1 — scripted BSOD (cosmetic; never resets progress). Hold for talk.
    showBsod();
    await waitForGate();
    if (!running || mySeq !== seqId) return;

    // Gate 2 — POST / boot from CD. Hold again for pacing.
    showReboot();
    await waitForGate();
    if (!running || mySeq !== seqId) return;

    handOffInstall();
  }

  async function runSequence(mySeq) {
    const reduce = Boolean(ctx.reduceMotion);
    // Pre-midnight run-up (~1.8× prior wall time). Arm/drift longest for
    // sound recognition, talk, and tray clock / Date-Time open.
    const armMs = reduce ? 200 : 2800;
    const s1 = reduce ? 200 : 5500; // drift
    const s2 = reduce ? 200 : 4000; // speedup
    const s3 = reduce ? 300 : 4800; // sprint

    stage = "arm";
    await wait(armMs);
    if (!running || mySeq !== seqId) return;

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
    if (!running || mySeq !== seqId) return;

    // Stage 2 — speed-up
    stage = "speedup";
    virtual = await animateClock(virtual, s2, 55 * 60_000); // +55 min
    if (!running || mySeq !== seqId) return;

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
        }
      },
    });
    if (!running || mySeq !== seqId) return;

    await runPostMidnightGates(mySeq);
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
    seqId += 1;
    const mySeq = seqId;
    clockEl = opts.clockEl || null;
    stopRealClock = opts.stopRealClock || null;
    onInstallCb = opts.onInstall || null;
    onTick = opts.onTick || null;
    ensureOverlay();
    clearTimers();
    void runSequence(mySeq).catch(() => {
      if (mySeq !== seqId) return;
      running = false;
      stage = "idle";
      stopAudioBed();
      hideTheatre();
      onTick = null;
    });
    return true;
  }

  /**
   * Presenter advance — one step at a time after midnight.
   * · At a gate (BSOD / reboot): release that gate.
   * · Still in the clock run-up: jump to BSOD gate (keep both click beats).
   */
  function advance() {
    if (!running) return false;
    if (releaseGate()) {
      ctx.blip?.("press");
      return true;
    }
    // Gate armed but resolver not set yet (same tick) — ignore.
    if (stage === "bsod-gate" || stage === "reboot-gate") return true;

    // Mid clock takeover — abandon run-up, land on BSOD gate.
    if (
      stage === "arm" ||
      stage === "drift" ||
      stage === "speedup" ||
      stage === "sprint"
    ) {
      seqId += 1;
      const mySeq = seqId;
      clearTimers();
      stopAudioBed();
      void runPostMidnightGates(mySeq);
      ctx.blip?.("press");
      return true;
    }
    return skipToInstall();
  }

  /** Hard-skip straight to the install handoff (escape hatch). */
  function skipToInstall() {
    if (!running) return false;
    seqId += 1;
    clearTimers();
    releaseGate();
    stopAudioBed();
    snapToMidnight();
    handOffInstall();
    return true;
  }

  function abort() {
    if (!running) return false;
    seqId += 1;
    clearTimers();
    releaseGate();
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
    advance,
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
    /** True while paused on BSOD or reboot waiting for click/key. */
    get isGated() {
      return Boolean(gateResolve);
    },
  };
}
