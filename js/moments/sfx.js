/**
 * Presentation SFX — authentic Win95/98 WAVs when present, procedural WebAudio fallback.
 * Respects Mute (M) and prefers-reduced-motion. Gesture-unlocks once (like boot dial-up).
 *
 * Dial-up WAV stays in moments/boot.js; everything else routes through here.
 */

/** @typedef {'press'|'windowOpen'|'windowClose'|'startMenu'|'recycleEmpty'|'beat'|'photo'|'correct'|'score'|'updateUnlock'|'transition'|'wrong'|'error'|'slam'|'mineFlag'|'paintTool'|'xpStartup'} SfxKind */

/**
 * Curated Microsoft WAVs under assets/audio/win95|win98|winxp (gitignored — see README).
 * Missing / failed decode → procedural path for that kind.
 * @type {Partial<Record<SfxKind, { url: string, gain?: number }>>}
 */
const WAV_BY_KIND = {
  startMenu: { url: "/assets/audio/win98/start.wav", gain: 0.95 },
  recycleEmpty: { url: "/assets/audio/win98/recycle.wav", gain: 0.72 },
  windowOpen: { url: "/assets/audio/win95/ding.wav", gain: 0.5 },
  windowClose: { url: "/assets/audio/win95/ding.wav", gain: 0.38 },
  updateUnlock: { url: "/assets/audio/win95/tada.wav", gain: 0.62 },
  transition: { url: "/assets/audio/win95/chimes.wav", gain: 0.52 },
  beat: { url: "/assets/audio/win95/chimes.wav", gain: 0.48 },
  photo: { url: "/assets/audio/win98/notify.wav", gain: 0.42 },
  correct: { url: "/assets/audio/win95/ding.wav", gain: 0.45 },
  error: { url: "/assets/audio/win95/chord.wav", gain: 0.55 },
  wrong: { url: "/assets/audio/win95/chord.wav", gain: 0.42 },
  xpStartup: { url: "/assets/audio/winxp/startup.wav", gain: 0.78 },
};

/**
 * @param {{
 *   getMuted?: () => boolean,
 *   reduceMotion?: boolean,
 *   volume?: number,
 * }} [opts]
 */
export function createSfx(opts = {}) {
  const reduceMotion = Boolean(opts.reduceMotion);
  let volume = clamp(opts.volume ?? 0.7, 0, 1);
  /** @type {AudioContext | null} */
  let audioCtx = null;
  /** @type {GainNode | null} */
  let master = null;
  let unlocked = false;
  /** @type {number} */
  let lastPlayAt = 0;
  /** @type {Map<string, AudioBuffer | null>} url → buffer (null = failed) */
  const buffers = new Map();
  /** @type {Map<string, Promise<AudioBuffer | null>>} */
  const loading = new Map();
  let preloadStarted = false;

  function muted() {
    return Boolean(opts.getMuted?.());
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function ensure() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    if (!master) {
      master = audioCtx.createGain();
      master.gain.value = volume * 0.55;
      master.connect(audioCtx.destination);
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  /**
   * @param {string} url
   * @returns {Promise<AudioBuffer | null>}
   */
  function loadBuffer(url) {
    if (buffers.has(url)) return Promise.resolve(buffers.get(url) ?? null);
    const inflight = loading.get(url);
    if (inflight) return inflight;

    const p = (async () => {
      const ctx = ensure();
      if (!ctx) {
        buffers.set(url, null);
        return null;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(String(res.status));
        const raw = await res.arrayBuffer();
        const buf = await ctx.decodeAudioData(raw.slice(0));
        buffers.set(url, buf);
        return buf;
      } catch {
        buffers.set(url, null);
        return null;
      } finally {
        loading.delete(url);
      }
    })();

    loading.set(url, p);
    return p;
  }

  function preloadWavs() {
    if (preloadStarted) return;
    preloadStarted = true;
    const urls = new Set();
    for (const entry of Object.values(WAV_BY_KIND)) {
      if (entry?.url) urls.add(entry.url);
    }
    urls.forEach((url) => {
      loadBuffer(url).catch(() => {});
    });
  }

  /** Explicit preload (e.g. XP Startup during CD install). */
  function preloadUrl(url) {
    if (!url) return Promise.resolve(null);
    return loadBuffer(url);
  }

  /**
   * Play a decoded WAV through master. Returns false if buffer missing.
   * @param {string} url
   * @param {number} [gainMul]
   */
  function playWav(url, gainMul = 0.55) {
    const ctx = ensure();
    if (!ctx || !master) return false;
    const buf = buffers.get(url);
    if (!buf) return false;
    try {
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const v = Math.max(0.0001, gainMul * volume);
      gain.gain.setValueAtTime(v, now);
      src.connect(gain);
      gain.connect(master);
      src.start(now);
      return true;
    } catch {
      return false;
    }
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    const ctx = ensure();
    if (!ctx) return;
    // Tiny silent buffer primes the context after a user gesture
    try {
      const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(master || ctx.destination);
      src.start(0);
    } catch {
      /* ignore */
    }
    preloadWavs();
  }

  function bindGestureUnlock() {
    if (typeof window === "undefined") return;
    const once = () => unlock();
    window.addEventListener("pointerdown", once, { once: true, capture: true });
    window.addEventListener("keydown", once, { once: true, capture: true });
  }

  /**
   * Schedule a short osc blip into master.
   * @param {{
   *   f: number,
   *   d: number,
   *   type?: OscillatorType,
   *   v?: number,
   *   slide?: number,
   *   delay?: number,
   * }} tone
   */
  function tone(toneOpts) {
    const ctx = ensure();
    if (!ctx || !master) return;
    const now = ctx.currentTime + (toneOpts.delay || 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = toneOpts.type || "square";
    osc.frequency.setValueAtTime(toneOpts.f, now);
    if (toneOpts.slide != null) {
      osc.frequency.linearRampToValueAtTime(toneOpts.slide, now + toneOpts.d);
    }
    const v = (toneOpts.v ?? 0.05) * volume;
    gain.gain.setValueAtTime(Math.max(0.0001, v), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + toneOpts.d);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + toneOpts.d + 0.02);
  }

  /** Soft noise burst (recycle empty / trash-ish). */
  function noiseBurst({ d = 0.12, v = 0.04, hp = 800 } = {}) {
    const ctx = ensure();
    if (!ctx || !master) return;
    const len = Math.max(1, Math.floor(ctx.sampleRate * d));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const env = 1 - i / len;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = hp;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(v * volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + d);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(now);
    src.stop(now + d + 0.02);
  }

  /** Procedural fallback when WAV missing / not yet loaded. */
  function playProcedural(kind) {
    switch (kind) {
      case "windowOpen":
        tone({ f: 380, d: 0.05, type: "square", v: 0.035 });
        tone({ f: 520, d: 0.06, type: "triangle", v: 0.03, delay: 0.03 });
        break;
      case "windowClose":
        tone({ f: 320, d: 0.05, type: "square", v: 0.03, slide: 180 });
        break;
      case "startMenu":
        tone({ f: 280, d: 0.04, type: "square", v: 0.032 });
        tone({ f: 420, d: 0.05, type: "triangle", v: 0.028, delay: 0.025 });
        break;
      case "recycleEmpty":
        noiseBurst({ d: 0.14, v: 0.045, hp: 1200 });
        tone({ f: 160, d: 0.1, type: "sawtooth", v: 0.025, slide: 70, delay: 0.02 });
        break;
      case "beat":
      case "photo":
        tone({ f: 523, d: 0.08, type: "triangle", v: 0.04 });
        tone({ f: 659, d: 0.1, type: "triangle", v: 0.035, delay: 0.07 });
        tone({ f: 784, d: 0.12, type: "sine", v: 0.03, delay: 0.14 });
        break;
      case "correct":
        tone({ f: 520, d: 0.12, type: "square", v: 0.045, slide: 780 });
        break;
      case "score":
        tone({ f: 660, d: 0.08, type: "triangle", v: 0.04 });
        break;
      case "updateUnlock":
        tone({ f: 440, d: 0.06, type: "triangle", v: 0.04 });
        tone({ f: 660, d: 0.08, type: "triangle", v: 0.038, delay: 0.06 });
        tone({ f: 880, d: 0.12, type: "sine", v: 0.032, delay: 0.12 });
        break;
      case "transition":
        tone({ f: 220, d: 0.1, type: "sine", v: 0.035, slide: 440 });
        tone({ f: 330, d: 0.14, type: "triangle", v: 0.028, delay: 0.08 });
        break;
      case "xpStartup":
        // Soft ascending chime when Startup.wav missing
        tone({ f: 392, d: 0.18, type: "sine", v: 0.04 });
        tone({ f: 523, d: 0.22, type: "sine", v: 0.038, delay: 0.14 });
        tone({ f: 659, d: 0.35, type: "triangle", v: 0.034, delay: 0.3 });
        tone({ f: 784, d: 0.5, type: "sine", v: 0.028, delay: 0.5 });
        break;
      case "wrong":
        tone({ f: 140, d: 0.18, type: "sawtooth", v: 0.045, slide: 90 });
        break;
      case "error":
        tone({ f: 180, d: 0.09, type: "square", v: 0.035, slide: 110 });
        break;
      case "slam":
        tone({ f: 90, d: 0.15, type: "sine", v: 0.055 });
        break;
      case "mineFlag":
        tone({ f: 480, d: 0.035, type: "square", v: 0.028 });
        break;
      case "paintTool":
        tone({ f: 300, d: 0.03, type: "triangle", v: 0.025 });
        break;
      case "press":
      default:
        tone({ f: 220, d: 0.04, type: "square", v: 0.035 });
        break;
    }
  }

  /**
   * @param {SfxKind | string} kind
   * @returns {'wav' | 'procedural' | 'skipped'}
   */
  function play(kind) {
    if (muted() || reduceMotion) return "skipped";
    // Mild de-dupe so open+complete doesn't stack into a blast
    const t = performance.now();
    if (t - lastPlayAt < 28 && kind === "press") return "skipped";
    lastPlayAt = t;

    unlock();
    if (!ensure()) return "skipped";

    const wav = WAV_BY_KIND[/** @type {SfxKind} */ (kind)];
    if (wav) {
      // Kick load if needed; play WAV when ready, else procedural this hit
      const ready = buffers.get(wav.url);
      if (ready) {
        if (playWav(wav.url, wav.gain ?? 0.55)) return "wav";
      } else if (!buffers.has(wav.url)) {
        loadBuffer(wav.url).catch(() => {});
      }
    }

    playProcedural(kind);
    return "procedural";
  }

  function setVolume(v) {
    volume = clamp(v, 0, 1);
    if (master && audioCtx) {
      master.gain.setValueAtTime(volume * 0.55, audioCtx.currentTime);
    }
  }

  bindGestureUnlock();

  return {
    play,
    unlock,
    ensure,
    setVolume,
    preloadUrl,
    preloadWavs,
    /** Expose map for debugging / venue checks */
    wavMap: WAV_BY_KIND,
    get volume() {
      return volume;
    },
    get unlocked() {
      return unlocked;
    },
  };
}
