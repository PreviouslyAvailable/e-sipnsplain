/**
 * PS2 living-room hub — splash → boot towers → system menu → shutdown interstitial.
 * Visual recipe from ps2ui-main (MIT homage; no Sony assets).
 */

/**
 * @typedef {{
 *   images?: string[],
 *   reduceMotion?: boolean,
 *   getMuted?: () => boolean,
 *   onContinue?: () => void,
 *   onBrowserOpen?: () => void,
 * }} Ps2MountOpts
 */

const PS2_BOOT_AUDIO_SRC = "/assets/ps2/ps2-boot-audio.mp3";
/** Known length of ps2-boot-audio.mp3 — used when muted / metadata missing. */
const PS2_BOOT_AUDIO_MS = 9900;
/**
 * Sony boot towers + "Sony Computer Entertainment" wordmark hold.
 * Same length as the boot jingle / muted fallback before the system menu.
 */
const SONY_BOOT_HOLD_MS = PS2_BOOT_AUDIO_MS;
/**
 * Splash PS2 logo hold after XP Space handoff, relative to the Sony screen.
 * Ratio 1.75× — logo should feel longer than Sony, not a brief flash.
 */
const PS2_LOGO_TO_SONY_RATIO = 1.75;
const PS2_LOGO_HOLD_MS = Math.round(SONY_BOOT_HOLD_MS * PS2_LOGO_TO_SONY_RATIO);
/** Classic Mac OS X startup chime — plays with the Apple glow fade-in on shutdown. */
const OSX_STARTUP_AUDIO_SRC = "/assets/macos/audio/osx-startup.wav";
/** Matches `.ps2-shutdown.is-live` halo animation-delay in css/ps2ui.css */
const OSX_FADE_IN_DELAY_MS = 2700;
/** Auto-leave after black hold + Apple fade + brief glow (see css/ps2ui.css). */
const OSX_SHUTDOWN_LEAVE_MS = 6800;
/** Keep chimes alive after mount destroy so they can finish under Timewarp. */
/** @type {Set<HTMLAudioElement>} */
const appleChimeKeepAlive = new Set();

/**
 * @param {HTMLElement} root - [data-ps2]
 * @param {Ps2MountOpts} [opts]
 */
export function mountPs2(root, opts = {}) {
  const images = Array.isArray(opts.images) ? opts.images : [];
  const reduceMotion = Boolean(opts.reduceMotion);
  const getMuted = opts.getMuted || (() => false);
  const onContinue = opts.onContinue;
  const onBrowserOpen = opts.onBrowserOpen;

  /** @type {'splash'|'boot'|'menu'|'browser'|'shutdown'} */
  let phase = "splash";
  let destroyed = false;
  /** @type {ReturnType<typeof setTimeout>[]} */
  const timers = [];
  /** @type {number | null} */
  let bootRaf = null;
  /** @type {HTMLAudioElement | null} */
  let bootAudio = null;
  let bootAudioStarted = false;
  let retryBootAudioOnGesture = false;
  /** @type {((this: HTMLAudioElement, ev: Event) => void) | null} */
  let bootAudioMenuHandler = null;
  /** @type {HTMLAudioElement | null} */
  let appleAudio = null;
  let appleAudioStarted = false;
  let retryAppleAudioOnGesture = false;

  const splash = /** @type {HTMLElement} */ (ensure(root, "[data-ps2-splash]", buildSplash));
  const boot = /** @type {HTMLElement} */ (ensure(root, "[data-ps2-boot]", buildBoot));
  const menu = /** @type {HTMLElement} */ (ensure(root, "[data-ps2-menu]", buildMenu));
  const browser = /** @type {HTMLElement} */ (
    ensure(root, "[data-ps2-browser]", buildBrowser)
  );
  const shutdown = /** @type {HTMLElement} */ (
    ensure(root, "[data-ps2-shutdown-screen]", buildShutdown)
  );

  paintAmbient(boot.querySelector("[data-ps2-ambient]") || boot, 22);
  paintAmbient(menu.querySelector("[data-ps2-ambient]") || menu, 26);
  paintAmbient(browser.querySelector("[data-ps2-ambient]") || browser, 18);
  paintTowers(boot);
  paintCampaigns(browser, images);

  const syncBootAudioMute = () => {
    if (!bootAudio) return;
    bootAudio.muted = Boolean(getMuted());
    if (bootAudio.muted) {
      bootAudio.pause();
      return;
    }
    if (bootAudioStarted && !bootAudio.ended) resumeBootAudio();
  };

  // Only call this when the PS2 chapter is being torn down. Phase changes within
  // the chapter intentionally leave the startup jingle playing underneath.
  const stopBootAudio = () => {
    retryBootAudioOnGesture = false;
    if (!bootAudio) return;
    try {
      bootAudio.pause();
      bootAudio.currentTime = 0;
    } catch {
      /* Native audio can fail if the document is unloading. */
    }
  };

  const resumeBootAudio = () => {
    if (!bootAudio || getMuted() || bootAudio.ended) return;
    try {
      const play = bootAudio.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          retryBootAudioOnGesture = true;
        });
      }
    } catch {
      retryBootAudioOnGesture = true;
    }
  };

  const playBootAudio = () => {
    if (reduceMotion || getMuted()) return;
    if (!bootAudio) {
      bootAudio = new Audio(PS2_BOOT_AUDIO_SRC);
      bootAudio.preload = "auto";
      bootAudio.volume = 0.68;
      bootAudio.setAttribute("playsinline", "");
      bootAudio.addEventListener("ended", () => {
        bootAudioStarted = false;
        retryBootAudioOnGesture = false;
      });
    }
    if (!bootAudioStarted) {
      bootAudio.currentTime = 0;
      bootAudioStarted = true;
    }
    // Reset starts after a timer, which some browsers do not count as a gesture.
    resumeBootAudio();
  };

  const clearBootAudioMenuHandler = () => {
    if (!bootAudio || !bootAudioMenuHandler) return;
    bootAudio.removeEventListener("ended", bootAudioMenuHandler);
    bootAudioMenuHandler = null;
  };

  /** Stay on the boot / loading screen until the jingle finishes, then open the menu. */
  const scheduleMenuAfterBootAudio = () => {
    clearBootAudioMenuHandler();
    const finish = () => {
      clearBootAudioMenuHandler();
      if (destroyed || phase !== "boot") return;
      setPhase("menu");
    };
    if (reduceMotion) {
      after(80, finish);
      return;
    }
    if (bootAudio && !getMuted()) {
      bootAudioMenuHandler = () => finish();
      bootAudio.addEventListener("ended", bootAudioMenuHandler);
      const durMs =
        Number.isFinite(bootAudio.duration) && bootAudio.duration > 0
          ? bootAudio.duration * 1000
          : PS2_BOOT_AUDIO_MS;
      // Safety net if `ended` never fires (tab backgrounded, decode stall).
      after(durMs + 500, finish);
      return;
    }
    // Muted / no audio — keep the same talk beat as the jingle length.
    after(PS2_BOOT_AUDIO_MS, finish);
  };

  const syncAppleAudioMute = () => {
    if (!appleAudio) return;
    appleAudio.muted = Boolean(getMuted());
    if (appleAudio.muted) {
      appleAudio.pause();
      return;
    }
    if (appleAudioStarted && !appleAudio.ended) resumeAppleAudio();
  };

  const resumeAppleAudio = () => {
    if (!appleAudio || getMuted() || appleAudio.ended) return;
    try {
      const play = appleAudio.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => {
          retryAppleAudioOnGesture = true;
        });
      }
    } catch {
      retryAppleAudioOnGesture = true;
    }
  };

  /** Play the OS X chime once from the start; do not cut it short on leave. */
  const playAppleStartupAudio = () => {
    if (getMuted()) return;
    if (!appleAudio) {
      appleAudio = new Audio(OSX_STARTUP_AUDIO_SRC);
      appleAudio.preload = "auto";
      appleAudio.volume = 0.85;
      appleAudio.setAttribute("playsinline", "");
      appleAudio.addEventListener("ended", () => {
        appleAudioStarted = false;
        retryAppleAudioOnGesture = false;
      });
    }
    if (!appleAudioStarted) {
      try {
        appleAudio.currentTime = 0;
      } catch {
        /* ignore seek failures before metadata */
      }
      appleAudioStarted = true;
    }
    resumeAppleAudio();
  };

  const setPhase = (next) => {
    if (destroyed) return;
    phase = next;
    root.dataset.ps2Phase = next;
    [splash, boot, menu, browser, shutdown].forEach((el) => el.classList.remove("is-live"));
    const map = { splash, boot, menu, browser, shutdown };
    map[next]?.classList.add("is-live");
  };

  const clearTimers = () => {
    timers.splice(0).forEach((t) => clearTimeout(t));
    if (bootRaf != null) {
      cancelAnimationFrame(bootRaf);
      bootRaf = null;
    }
    clearBootAudioMenuHandler();
  };

  const after = (ms, fn) => {
    const t = setTimeout(() => {
      if (!destroyed) fn();
    }, ms);
    timers.push(t);
  };

  const startBoot = () => {
    setPhase("boot");
    playBootAudio();
    boot.classList.remove("ps2-boot--risen");
    bootRaf = requestAnimationFrame(() => {
      bootRaf = requestAnimationFrame(() => {
        boot.classList.add("ps2-boot--risen");
      });
    });
    scheduleMenuAfterBootAudio();
  };

  const openBrowser = () => {
    setPhase("browser");
    onBrowserOpen?.();
  };

  const startShutdown = () => {
    if (destroyed || phase === "shutdown") return false;
    clearTimers();
    setPhase("shutdown");
    // Black hold + slow Apple glow; chime with fade-in, then → #timewarp (idle desktop)
    after(reduceMotion ? 0 : OSX_FADE_IN_DELAY_MS, playAppleStartupAudio);
    after(reduceMotion ? 250 : OSX_SHUTDOWN_LEAVE_MS, leave);
    return true;
  };

  const leave = () => {
    if (destroyed) return false;
    onContinue?.();
    return true;
  };

  /** Soft advance: splash/boot skip forward; menu opens Browser; shutdown leaves. */
  const advance = () => {
    if (destroyed) return false;
    if (phase === "splash") {
      clearTimers();
      startBoot();
      return true;
    }
    if (phase === "boot") {
      clearTimers();
      setPhase("menu");
      return true;
    }
    if (phase === "menu") {
      openBrowser();
      return true;
    }
    if (phase === "browser") {
      return leave();
    }
    if (phase === "shutdown") {
      clearTimers();
      return leave();
    }
    return false;
  };

  /** In-hub ←/→ (or ↑/↓): scrub the Browser ad strip one viewport; no-op otherwise. */
  const nudgeBrowser = (dir) => {
    if (destroyed || phase !== "browser") return false;
    const strip = /** @type {HTMLElement | null} */ (browser.querySelector("[data-ps2-strip]"));
    if (!strip || strip.hidden) return false;
    const amount = strip.clientHeight || 400;
    const delta = (dir < 0 ? -1 : 1) * amount;
    strip.scrollBy({ top: delta, behavior: reduceMotion ? "auto" : "smooth" });
    return true;
  };

  /**
   * Land on splash and wait — do not auto-boot.
   * Talk / Story deep-links: Next, Space, or click splash to start the system.
   * XP "Press to start" handoff calls startSystem() after enter.
   */
  const reset = () => {
    clearTimers();
    boot.classList.remove("ps2-boot--risen");
    splash.classList.remove("ps2-splash--handoff");
    setPhase("splash");
  };

  /**
   * Begin the PS2 system after an explicit start (XP Space on static / presenter).
   * Holds the splash PS2 logo (PS2_LOGO_HOLD_MS ≈ 1.75× Sony), then runs boot.
   * Soft skip (click / Next / Space) still advances via advance().
   */
  const startSystem = () => {
    if (destroyed) return false;
    if (phase === "boot" || phase === "menu" || phase === "browser" || phase === "shutdown") {
      return false;
    }
    clearTimers();
    setPhase("splash");
    splash.classList.add("ps2-splash--handoff");
    after(reduceMotion ? 60 : PS2_LOGO_HOLD_MS, () => {
      splash.classList.remove("ps2-splash--handoff");
      startBoot();
    });
    return true;
  };

  // Menu interactions
  menu.querySelectorAll("[data-ps2-open-browser]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.querySelectorAll("[data-ps2-menu-item]").forEach((el) => {
        el.classList.toggle("is-selected", el === btn);
      });
      openBrowser();
    });
  });

  menu.querySelectorAll("[data-ps2-shutdown]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      startShutdown();
    });
  });

  browser.querySelectorAll("[data-ps2-browser-back]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPhase("menu");
    });
  });

  // Click splash/boot to skip ahead
  splash.addEventListener("click", (e) => {
    e.preventDefault();
    advance();
  });
  boot.addEventListener("click", (e) => {
    e.preventDefault();
    advance();
  });

  const onMuteChange = () => {
    syncBootAudioMute();
    syncAppleAudioMute();
  };
  const retryAudio = () => {
    if (destroyed || getMuted()) return;
    if (retryBootAudioOnGesture) {
      retryBootAudioOnGesture = false;
      resumeBootAudio();
    }
    if (retryAppleAudioOnGesture) {
      retryAppleAudioOnGesture = false;
      resumeAppleAudio();
    }
  };
  window.addEventListener("sipnsplain:mutechange", onMuteChange);
  window.addEventListener("pointerdown", retryAudio, { capture: true });
  window.addEventListener("keydown", retryAudio, { capture: true });

  reset();

  return {
    destroy() {
      destroyed = true;
      clearTimers();
      stopBootAudio();
      // Keep Apple chime playing start-to-finish under the Timewarp handoff.
      retryAppleAudioOnGesture = false;
      if (appleAudio && appleAudioStarted && !appleAudio.ended) {
        const chime = appleAudio;
        appleChimeKeepAlive.add(chime);
        chime.addEventListener(
          "ended",
          () => {
            appleChimeKeepAlive.delete(chime);
          },
          { once: true }
        );
      }
      appleAudio = null;
      window.removeEventListener("sipnsplain:mutechange", onMuteChange);
      window.removeEventListener("pointerdown", retryAudio, { capture: true });
      window.removeEventListener("keydown", retryAudio, { capture: true });
    },
    reset,
    startSystem,
    advance,
    nudgeBrowser,
    phase: () => phase,
    openBrowser,
    startShutdown,
    leave,
  };
}

/** @param {number} seed */
function rnd(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * @param {HTMLElement} root
 * @param {string} sel
 * @param {(el: HTMLElement) => void} build
 */
function ensure(root, sel, build) {
  let el = root.querySelector(sel);
  if (el) return el;
  el = document.createElement("div");
  build(el);
  root.appendChild(el);
  return el;
}

/** @param {HTMLElement} el */
function buildSplash(el) {
  el.className = "ps2-phase ps2-splash";
  el.setAttribute("data-ps2-splash", "");
  el.innerHTML = `
    <img
      class="ps2-splash__logo"
      src="/assets/ps2/ps2-logo.png"
      alt="PlayStation 2"
      width="1024"
      height="305"
      draggable="false"
    />
    <p class="ps2-splash__cue">Press to start</p>
  `;
}

/** @param {HTMLElement} el */
function buildBoot(el) {
  el.className = "ps2-phase ps2-boot";
  el.setAttribute("data-ps2-boot", "");
  el.innerHTML = `
    <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
    <div class="ps2-boot__towers" data-ps2-towers aria-hidden="true"></div>
    <div class="ps2-boot__comets" aria-hidden="true">
      <span class="ps2-boot__comet ps2-boot__comet--a"></span>
      <span class="ps2-boot__comet ps2-boot__comet--b"></span>
      <span class="ps2-boot__comet ps2-boot__comet--c"></span>
      <span class="ps2-boot__comet ps2-boot__comet--d"></span>
    </div>
    <div class="ps2-boot__wordmark">Sony Computer Entertainment</div>
    <p class="ps2-boot__skip">Click to skip</p>
  `;
}

/** @param {HTMLElement} el */
function buildMenu(el) {
  el.className = "ps2-phase ps2-sys";
  el.setAttribute("data-ps2-menu", "");
  el.innerHTML = `
    <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
    <div class="ps2-sys__stage">
      <div class="ps2-sys__orbs" aria-hidden="true">
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
        <span class="ps2-sys__orb"></span>
      </div>
      <div class="ps2-sys__list" role="menu">
        <button type="button" class="ps2-sys__item is-selected" data-ps2-menu-item data-ps2-open-browser role="menuitem">
          Browser
        </button>
        <button type="button" class="ps2-sys__item" data-ps2-menu-item data-ps2-shutdown role="menuitem">
          Shutdown
        </button>
      </div>
    </div>
  `;
}

/** @param {HTMLElement} el */
function buildBrowser(el) {
  el.className = "ps2-phase ps2-browser";
  el.setAttribute("data-ps2-browser", "");
  el.innerHTML = `
    <div class="ps2-ambient ps2-ambient--field" data-ps2-ambient aria-hidden="true"></div>
    <div class="ps2-browser__bar">
      <h2 class="ps2-browser__title">Browser · Print campaigns</h2>
      <div class="ps2-browser__actions">
        <button type="button" class="ps2-browser__btn" data-ps2-browser-back>Back</button>
      </div>
    </div>
    <div class="ps2-browser__panel">
      <div class="ps2-browser__strip" data-ps2-strip hidden>
        <div class="ps2-browser__track" data-ps2-track></div>
      </div>
      <div class="ps2-browser__empty" data-ps2-empty>
        <div>
          <p class="ps2-browser__empty-kicker">Memory Card /ads</p>
          <p>Drop PS2 print ads into <code>assets/ps2/ads/</code> and list them in <code>PS2_ADS</code>.</p>
        </div>
      </div>
    </div>
  `;
}

/** @param {HTMLElement} el */
function buildShutdown(el) {
  el.className = "ps2-phase ps2-shutdown";
  el.setAttribute("data-ps2-shutdown-screen", "");
  el.setAttribute("aria-label", "Starting Timewarp");
  el.innerHTML = `
    <div class="ps2-shutdown__halo" aria-hidden="true"></div>
    <svg class="ps2-shutdown__mark" viewBox="0 0 512 512" role="img" aria-label="Apple logo">
      <path d="M349.8 277.5c-.2-45.8 37.4-67.9 39.1-69-21.1-30.8-53.8-35-65.5-35.5-27.9-2.8-54.5 16.4-68.6 16.4-14.5 0-36.4-16.1-60-15.6-30.4.5-58.8 18.1-74.4 45.3-32.2 55.8-8.2 137.8 22.7 182.9 15.5 22.1 33.6 46.8 57.3 45.9 23.2-1 31.9-14.8 59.9-14.8 27.7 0 35.9 14.8 60.1 14.3 24.9-.4 40.6-22.2 55.6-44.5 17.9-25.3 25.1-50.3 25.4-51.6-.6-.2-51.4-19.6-51.6-77.8zM331.5 142.2c12.5-15.7 21-37.1 18.6-58.7-18.1.8-40.7 12.5-53.7 27.9-11.5 13.5-21.8 35.7-19.1 56.5 20.4 1.5 41.3-10.3 54.2-25.7z"/>
    </svg>
  `;
}

/**
 * @param {HTMLElement} host
 * @param {number} density
 */
function paintAmbient(host, density) {
  let field = host.querySelector("[data-ps2-ambient]");
  if (!field) {
    field = document.createElement("div");
    field.className = "ps2-ambient ps2-ambient--field";
    field.setAttribute("data-ps2-ambient", "");
    field.setAttribute("aria-hidden", "true");
    host.prepend(field);
  }
  field.replaceChildren();
  for (let i = 0; i < density; i++) {
    const size = 6 + rnd(i + 1) * 26;
    const mote = document.createElement("span");
    mote.className = "ps2-ambient__mote";
    mote.style.left = `${rnd(i + 7) * 100}%`;
    mote.style.width = `${size}px`;
    mote.style.height = `${size}px`;
    mote.style.opacity = String(0.12 + rnd(i + 41) * 0.4);
    mote.style.setProperty("--mote-delay", `${-rnd(i + 13) * 14}s`);
    mote.style.setProperty("--mote-duration", `${14 + rnd(i + 21) * 16}s`);
    mote.style.setProperty("--mote-drift", `${(rnd(i + 31) - 0.5) * 60}px`);
    field.appendChild(mote);
  }
}

/** @param {HTMLElement} boot */
function paintTowers(boot) {
  const row = boot.querySelector("[data-ps2-towers]");
  if (!row) return;
  row.replaceChildren();
  const n = 11;
  for (let i = 0; i < n; i++) {
    const h = 0.32 + (Math.sin((i + 1) * 2.4) * 0.5 + 0.5) * 0.66;
    const tower = document.createElement("span");
    tower.className = "ps2-boot__tower";
    tower.style.setProperty("--tower-h", `${Math.round(h * 100)}%`);
    tower.style.setProperty("--tower-delay", `${i * 90}ms`);
    row.appendChild(tower);
  }
}

/**
 * @param {HTMLElement} browser
 * @param {string[]} images
 */
function paintCampaigns(browser, images) {
  const strip = browser.querySelector("[data-ps2-strip]");
  const track = browser.querySelector("[data-ps2-track]");
  const empty = browser.querySelector("[data-ps2-empty]");
  if (!strip || !track || !empty) return;

  track.replaceChildren();
  const has = images.length > 0;
  strip.hidden = !has;
  empty.hidden = has;
  if (!has) return;

  images.forEach((src, i) => {
    const card = document.createElement("figure");
    card.className = "ps2-browser__card";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.draggable = false;
    img.loading = i < 2 ? "eager" : "lazy";
    img.decoding = "async";
    card.appendChild(img);
    track.appendChild(card);
  });

  strip.scrollTop = 0;
}
