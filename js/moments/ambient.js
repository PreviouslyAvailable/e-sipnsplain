/**
 * Subtle "the deck is reacting" ambient beat during thesis chapters.
 * Headings rewrite, a button drifts, captions improve — before you name it.
 */

const CAPTIONS = [
  "The experience is listening",
  "Rewriting…",
  "Taste still required",
  "Interfaces compound",
];

export function createAmbient(ctx) {
  let timer = null;
  let captionTimer = null;
  let active = false;
  let captionIdx = 0;

  function stop() {
    active = false;
    clearTimeout(timer);
    clearInterval(captionTimer);
    timer = null;
    captionTimer = null;
  }

  function rewriteHeadings(root) {
    root.querySelectorAll("[data-react-heading]").forEach((el, i) => {
      const a = el.dataset.reactA || el.textContent;
      const b = el.dataset.reactB;
      if (!b) return;
      setTimeout(() => {
        if (!active) return;
        el.classList.add("is-rewriting");
        setTimeout(() => {
          if (!active) return;
          el.textContent = el.textContent.trim() === a.trim() ? b : a;
          el.classList.remove("is-rewriting");
          ctx.blip?.("press");
        }, 420);
      }, 900 + i * 1400);
    });
  }

  function driftButtons(root) {
    root.querySelectorAll("[data-drift]").forEach((btn) => {
      setTimeout(() => {
        if (!active) return;
        btn.classList.add("is-drifting");
      }, 1600);
    });
  }

  function cycleCaptions(root) {
    const caps = root.querySelectorAll("[data-ambient-caption]");
    if (!caps.length) return;
    captionTimer = setInterval(() => {
      if (!active) return;
      captionIdx = (captionIdx + 1) % CAPTIONS.length;
      caps.forEach((el) => {
        el.classList.add("is-swapping");
        setTimeout(() => {
          el.textContent = CAPTIONS[captionIdx];
          el.classList.remove("is-swapping");
        }, 280);
      });
    }, 3200);
  }

  function start(chapterEl, chapter) {
    stop();
    if (!chapterEl || chapter?.chapter !== "thesis") return;
    if (ctx.reduceMotion) return;
    // Only on select thesis beats so it stays tasteful
    if (!["turn", "thesis-1", "thesis-3"].includes(chapter.id)) return;

    active = true;
    timer = setTimeout(() => {
      if (!active) return;
      rewriteHeadings(chapterEl);
      driftButtons(chapterEl);
      cycleCaptions(chapterEl);
      ctx.hooks?.onAmbientStart?.(chapter.id);
    }, 700);
  }

  return { start, stop };
}
