/**
 * Atari-era ad strip — horizontal scroll of stitched images.
 *
 * Root may already contain `[data-atari-strip-track]` (and optional
 * `[data-atari-prev]` / `[data-atari-next]`). Otherwise a `.w95-ad-strip`
 * shell is created inside root.
 */

/**
 * @param {HTMLElement} root - element with [data-atari-strip-track] or the strip itself
 * @param {{ images: string[] }} opts
 * @returns {{ destroy: () => void, scrollByPage: (dir: -1|1) => void, el: HTMLElement }}
 */
export function mountAtariStrip(root, opts) {
  const images = Array.isArray(opts?.images) ? opts.images : [];

  let track = root.querySelector("[data-atari-strip-track]");
  /** @type {HTMLElement} */
  let strip;

  if (track) {
    strip = /** @type {HTMLElement} */ (
      track.closest(".w95-ad-strip") || track.parentElement || root
    );
  } else if (root.matches?.("[data-atari-strip-track]")) {
    track = root;
    strip = /** @type {HTMLElement} */ (root.parentElement || root);
  } else {
    strip = document.createElement("div");
    strip.className = "w95-ad-strip";
    track = document.createElement("div");
    track.setAttribute("data-atari-strip-track", "");
    strip.appendChild(track);
    root.appendChild(strip);
  }

  Object.assign(strip.style, {
    overflowX: "auto",
    overflowY: "hidden",
    scrollSnapType: "x proximity",
    webkitOverflowScrolling: "touch",
    overscrollBehaviorX: "contain",
  });

  Object.assign(track.style, {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    height: "100%",
    width: "max-content",
  });

  track.replaceChildren();
  for (const src of images) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.draggable = false;
    Object.assign(img.style, {
      height: "100%",
      width: "auto",
      display: "block",
      flexShrink: "0",
      scrollSnapAlign: "start",
    });
    track.appendChild(img);
  }

  /**
   * @param {-1|1} dir
   */
  function scrollByPage(dir) {
    const amount = strip.clientWidth || 0;
    if (!amount) return;
    strip.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  /** @param {Event} e */
  const stopNavSteal = (e) => {
    e.stopPropagation();
  };

  strip.addEventListener("pointerdown", stopNavSteal);
  strip.addEventListener("wheel", stopNavSteal, { passive: true });

  const prevBtn = root.querySelector("[data-atari-prev]");
  const nextBtn = root.querySelector("[data-atari-next]");

  /** @type {(() => void) | null} */
  let onPrev = null;
  /** @type {(() => void) | null} */
  let onNext = null;

  if (prevBtn) {
    onPrev = () => scrollByPage(-1);
    prevBtn.addEventListener("click", onPrev);
  }
  if (nextBtn) {
    onNext = () => scrollByPage(1);
    nextBtn.addEventListener("click", onNext);
  }

  function destroy() {
    strip.removeEventListener("pointerdown", stopNavSteal);
    strip.removeEventListener("wheel", stopNavSteal);
    if (prevBtn && onPrev) prevBtn.removeEventListener("click", onPrev);
    if (nextBtn && onNext) nextBtn.removeEventListener("click", onNext);
    onPrev = null;
    onNext = null;
  }

  return { destroy, scrollByPage, el: strip };
}
