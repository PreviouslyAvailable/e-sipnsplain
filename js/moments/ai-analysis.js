/**
 * Theatrical "AI analysis" on Year 2 birthday stack.
 * Simulated detections — no vision API required (Phase 1).
 */

/** Bounding boxes as % of frame (left, top, width, height) + label */
const MAPS = {
  // Hero full table (photo index 2 / y02-03)
  2: [
    { l: 58, t: 18, w: 18, h: 28, label: "party_hat" },
    { l: 42, t: 48, w: 8, h: 14, label: "coca_cola_cup" },
    { l: 22, t: 52, w: 14, h: 16, label: "french_fries" },
    { l: 55, t: 42, w: 22, h: 38, label: "subject_face" },
    { l: 12, t: 58, w: 18, h: 14, label: "snack_platter" },
  ],
  // Crying + mascot payoff (photo index 3 / y02-04)
  3: [
    { l: 48, t: 12, w: 20, h: 22, label: "party_hat" },
    { l: 18, t: 8, w: 32, h: 55, label: "unknown_creature" },
    { l: 38, t: 58, w: 10, h: 16, label: "coca_cola_cup" },
    { l: 52, t: 28, w: 22, h: 32, label: "subject_face" },
    { l: 28, t: 62, w: 16, h: 14, label: "french_fries" },
  ],
};

export function createAiAnalysis(ctx) {
  let running = false;
  let timers = [];

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function ensureLayer(frame) {
    let layer = frame.querySelector(".ai-layer");
    if (layer) return layer;
    layer = document.createElement("div");
    layer.className = "ai-layer";
    layer.innerHTML = `
      <div class="ai-scan"></div>
      <div class="ai-hud">
        <div class="scanline" data-ai-status>Initializing vision model…</div>
        <div class="verdict" data-ai-verdict>Estimated age: <em>47</em></div>
      </div>
    `;
    frame.appendChild(layer);
    return layer;
  }

  function reset(frame) {
    clearTimers();
    running = false;
    const layer = frame?.querySelector(".ai-layer");
    if (!layer) return;
    layer.classList.remove("is-on", "is-scanning");
    layer.querySelectorAll(".ai-box").forEach((b) => b.remove());
    const status = layer.querySelector("[data-ai-status]");
    const verdict = layer.querySelector("[data-ai-verdict]");
    if (status) status.textContent = "Initializing vision model…";
    if (verdict) verdict.classList.remove("show");
  }

  async function run(frame, photoIndex) {
    if (!frame || running) return;
    const map = MAPS[photoIndex];
    if (!map) {
      ctx.toast?.("Cycle to the hero or mascot photo, then press Y");
      return;
    }

    running = true;
    const layer = ensureLayer(frame);
    reset(frame);
    running = true;

    layer.classList.add("is-on", "is-scanning");
    const status = layer.querySelector("[data-ai-status]");
    const verdict = layer.querySelector("[data-ai-verdict]");
    ctx.blip?.("press");

    const steps = [
      { t: 200, text: "Detecting objects…" },
      { t: 700, text: "Segmenting party_hat · beverage · subject…" },
      { t: 1300, text: "Running age estimator v3.2…" },
    ];

    steps.forEach(({ t, text }) => {
      timers.push(setTimeout(() => {
        if (status) status.textContent = text;
      }, t));
    });

    map.forEach((box, i) => {
      timers.push(setTimeout(() => {
        const el = document.createElement("div");
        el.className = "ai-box";
        el.style.left = `${box.l}%`;
        el.style.top = `${box.t}%`;
        el.style.width = `${box.w}%`;
        el.style.height = `${box.h}%`;
        el.innerHTML = `<span class="tag">${box.label} · ${(0.72 + i * 0.04).toFixed(2)}</span>`;
        layer.appendChild(el);
        requestAnimationFrame(() => el.classList.add("is-drawn"));
        ctx.blip?.(i === map.length - 1 ? "correct" : "press");
      }, 400 + i * 320));
    });

    timers.push(setTimeout(() => {
      layer.classList.remove("is-scanning");
      if (status) status.textContent = "Confidence: 98.7% · model: party-vision-xl";
      if (verdict) verdict.classList.add("show");
      ctx.blip?.("slam");
      ctx.hooks?.onAiAnalysisComplete?.({ photoIndex, age: 47 });
      running = false;
    }, 400 + map.length * 320 + 500));
  }

  function canRun(chapter, photoIndex) {
    return chapter?.id === "age-2" && (photoIndex === 2 || photoIndex === 3);
  }

  return { run, reset, canRun, MAPS };
}
