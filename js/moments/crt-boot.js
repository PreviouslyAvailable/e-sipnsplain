/**
 * CRT boot / enter-the-screenshot theatre for Year 7 computer photo.
 * ~30s cinematic sequence; Esc / arrows skip.
 */

const BOOT_LINES = [
  "Award Modular BIOS v4.51PG",
  "Copyright (C) 1984-97",
  "",
  "CPU: Pentium II @ 333MHz",
  "Memory Test: 65536K OK",
  "Detecting IDE Primary Master... QUANTUM FIREBALL",
  "Detecting IDE Primary Slave... None",
  "",
  "Starting Windows 98...",
  "",
  "Loading C:\\WINDOWS\\SYSTEM\\...",
  "Initializing display driver...",
  "Entering screenshot...",
];

export function createCrtBoot(ctx) {
  let stage = null;
  let timers = [];
  let running = false;
  let reduceMotion = false;

  function clearTimers() {
    timers.forEach((t) => clearTimeout(t));
    timers = [];
  }

  function ensureStage() {
    if (stage) return stage;
    stage = document.createElement("div");
    stage.className = "crt-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `
      <div class="crt-photo" data-crt-photo></div>
      <div class="crt-overlay"></div>
      <pre class="crt-boot" data-crt-boot></pre>
      <div class="crt-skip">Esc to skip · arrows escape</div>
    `;
    (document.getElementById("stage") || document.body).appendChild(stage);
    return stage;
  }

  function stop() {
    clearTimers();
    running = false;
    document.body.classList.remove("is-crt-live");
    if (!stage) return;
    stage.className = "crt-stage";
    stage.style.display = "none";
    const boot = stage.querySelector("[data-crt-boot]");
    if (boot) boot.textContent = "";
  }

  function skip() {
    if (!running) return false;
    stop();
    ctx.hooks?.onCrtComplete?.({ skipped: true });
    return true;
  }

  function typeBoot(el, lines, onDone) {
    let i = 0;
    let text = "";
    function tick() {
      if (!running) return;
      if (i >= lines.length) {
        onDone?.();
        return;
      }
      text += (text ? "\n" : "") + lines[i];
      el.textContent = text;
      i += 1;
      timers.push(setTimeout(tick, reduceMotion ? 20 : 180 + Math.random() * 120));
    }
    tick();
  }

  function run(src) {
    if (running || !src) return;
    reduceMotion = ctx.reduceMotion;
    running = true;
    const el = ensureStage();
    const photo = el.querySelector("[data-crt-photo]");
    const boot = el.querySelector("[data-crt-boot]");
    photo.style.backgroundImage = `url("${src}")`;
    photo.style.transform = "";
    photo.style.filter = "";
    boot.textContent = "";
    el.className = "crt-stage is-live";
    el.style.display = "block";
    document.body.classList.add("is-crt-live");
    ctx.blip?.("slam");

    if (reduceMotion) {
      el.classList.add("phase-on", "phase-enter");
      timers.push(setTimeout(() => {
        stop();
        ctx.hooks?.onCrtComplete?.({ skipped: false, reduced: true });
      }, 800));
      return;
    }

    // Phase 1: black → CRT on (~2s)
    timers.push(setTimeout(() => {
      if (!running) return;
      el.classList.add("phase-on");
      ctx.blip?.("correct");
    }, 600));

    // Phase 2: boot text (~12s)
    timers.push(setTimeout(() => {
      if (!running) return;
      el.classList.add("phase-boot");
      typeBoot(boot, BOOT_LINES, () => {
        // Phase 3: zoom into monitor (~3s)
        timers.push(setTimeout(() => {
          if (!running) return;
          boot.style.opacity = "0";
          el.classList.add("phase-enter");
          ctx.blip?.("slam");
        }, 400));

        timers.push(setTimeout(() => {
          if (!running) return;
          stop();
          ctx.hooks?.onCrtComplete?.({ skipped: false });
        }, 3600));
      });
    }, 1600));
  }

  function canRun(chapter) {
    return chapter?.id === "age-7";
  }

  return { run, stop, skip, canRun, get isRunning() { return running; } };
}
