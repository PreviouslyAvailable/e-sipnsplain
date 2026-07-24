/**
 * Windows XP My Pictures — GameCube ad filmstrip.
 * Large preview + thumb strip; Wave 2 may wire onReady → completeBeat.
 */

/**
 * @param {string} src
 * @returns {string}
 */
function basename(src) {
  try {
    const path = src.split("?")[0].split("#")[0];
    const file = path.slice(path.lastIndexOf("/") + 1) || src;
    return decodeURIComponent(file.replace(/\.[^.]+$/, "") || file);
  } catch {
    return src;
  }
}

/**
 * Ensure filmstrip DOM exists under root.
 * @param {HTMLElement} root
 */
function ensureStructure(root) {
  root.classList.add("wxp-pictures");

  // Empty Luna task pane wastes width — collapse if present with no tasks
  root.querySelectorAll(".wxp-pictures-pane, [data-wxp-task-pane]").forEach((pane) => {
    const hasTasks = pane.querySelector("a, button, [data-wxp-task]");
    if (!hasTasks) pane.setAttribute("hidden", "");
  });

  let preview = root.querySelector("[data-wxp-preview]");
  if (!preview) {
    const wrap = document.createElement("div");
    wrap.className = "wxp-pictures-stage";
    preview = document.createElement("img");
    preview.setAttribute("data-wxp-preview", "");
    preview.alt = "";
    preview.draggable = false;
    wrap.appendChild(preview);
    root.appendChild(wrap);
  }

  if (!root.querySelector(".wxp-pictures-meta")) {
    const meta = document.createElement("div");
    meta.className = "wxp-pictures-meta";
    const name = document.createElement("span");
    name.setAttribute("data-wxp-pic-name", "");
    const count = document.createElement("span");
    count.setAttribute("data-wxp-pic-count", "");
    meta.append(name, count);
    const stage = root.querySelector(".wxp-pictures-stage");
    if (stage?.nextSibling) root.insertBefore(meta, stage.nextSibling);
    else root.appendChild(meta);
  }

  let thumbs = root.querySelector("[data-wxp-thumbs]");
  if (!thumbs) {
    const row = document.createElement("div");
    row.className = "wxp-pictures-strip";

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "wxp-pictures-nav";
    prev.setAttribute("data-wxp-pic-prev", "");
    prev.setAttribute("aria-label", "Previous picture");
    prev.textContent = "‹";

    thumbs = document.createElement("div");
    thumbs.className = "wxp-pictures-thumbs";
    thumbs.setAttribute("data-wxp-thumbs", "");
    thumbs.tabIndex = 0;
    thumbs.setAttribute("role", "listbox");
    thumbs.setAttribute("aria-label", "Picture filmstrip");

    const next = document.createElement("button");
    next.type = "button";
    next.className = "wxp-pictures-nav";
    next.setAttribute("data-wxp-pic-next", "");
    next.setAttribute("aria-label", "Next picture");
    next.textContent = "›";

    row.append(prev, thumbs, next);
    root.appendChild(row);
  } else if (thumbs.tabIndex < 0) {
    thumbs.tabIndex = 0;
  }

  if (!root.querySelector("[data-wxp-pic-prev]")) {
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "wxp-pictures-nav";
    prev.setAttribute("data-wxp-pic-prev", "");
    prev.setAttribute("aria-label", "Previous picture");
    prev.textContent = "‹";
    thumbs.before(prev);
  }

  if (!root.querySelector("[data-wxp-pic-next]")) {
    const next = document.createElement("button");
    next.type = "button";
    next.className = "wxp-pictures-nav";
    next.setAttribute("data-wxp-pic-next", "");
    next.setAttribute("aria-label", "Next picture");
    next.textContent = "›";
    thumbs.after(next);
  }

  return {
    preview: /** @type {HTMLImageElement} */ (
      root.querySelector("[data-wxp-preview]")
    ),
    thumbs: /** @type {HTMLElement} */ (root.querySelector("[data-wxp-thumbs]")),
    prevBtn: root.querySelector("[data-wxp-pic-prev]"),
    nextBtn: root.querySelector("[data-wxp-pic-next]"),
    nameEl: root.querySelector("[data-wxp-pic-name]"),
    countEl: root.querySelector("[data-wxp-pic-count]"),
  };
}

/**
 * @param {HTMLElement} root - My Pictures window client root
 * @param {{ images: string[], onReady?: () => void }} opts
 * @returns {{ destroy: () => void, select: (i: number) => void, next: () => void, prev: () => void }}
 */
export function mountXpPictures(root, opts) {
  const images = Array.isArray(opts?.images) ? opts.images.filter(Boolean) : [];
  const els = ensureStructure(root);

  let index = 0;
  let readyFired = false;
  let destroyed = false;

  /** @type {HTMLButtonElement[]} */
  const thumbButtons = [];

  function updateMeta() {
    if (els.nameEl) {
      els.nameEl.textContent = images.length ? basename(images[index]) : "";
    }
    if (els.countEl) {
      els.countEl.textContent = images.length
        ? `${index + 1} / ${images.length}`
        : "0 / 0";
    }
  }

  /**
   * @param {number} i
   */
  function select(i) {
    if (!images.length) {
      index = 0;
      if (els.preview) {
        els.preview.removeAttribute("src");
        els.preview.alt = "";
      }
      thumbButtons.forEach((btn) => {
        btn.classList.remove("is-selected");
        btn.setAttribute("aria-selected", "false");
      });
      updateMeta();
      return;
    }

    const next = ((i % images.length) + images.length) % images.length;
    index = next;
    const src = images[index];

    if (els.preview) {
      els.preview.src = src;
      els.preview.alt = basename(src);
    }

    thumbButtons.forEach((btn, ti) => {
      const on = ti === index;
      btn.classList.toggle("is-selected", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
      if (on) {
        const reduce =
          typeof matchMedia === "function" &&
          matchMedia("(prefers-reduced-motion: reduce)").matches;
        btn.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reduce ? "auto" : "smooth",
        });
      }
    });

    updateMeta();
  }

  function next() {
    select(index + 1);
  }

  function prev() {
    select(index - 1);
  }

  function buildThumbs() {
    els.thumbs.replaceChildren();
    thumbButtons.length = 0;

    images.forEach((src, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wxp-pictures-thumb";
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-label", basename(src));
      btn.dataset.index = String(i);

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.draggable = false;
      btn.appendChild(img);

      btn.addEventListener("click", () => select(i));
      els.thumbs.appendChild(btn);
      thumbButtons.push(btn);
    });
  }

  /** @param {KeyboardEvent} e */
  function onKeyDown(e) {
    if (destroyed) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

    const active = document.activeElement;
    const focusInWin = active instanceof Node && keyRoot.contains(active);
    if (!focusInWin) return;

    e.preventDefault();
    e.stopPropagation();
    if (e.key === "ArrowLeft") prev();
    else next();
  }

  /** @param {Event} e */
  function onPrevClick(e) {
    e.preventDefault();
    prev();
  }

  /** @param {Event} e */
  function onNextClick(e) {
    e.preventDefault();
    next();
  }

  function fireReady() {
    if (readyFired || destroyed) return;
    readyFired = true;
    opts?.onReady?.();
  }

  /** Explorer window (or root) — arrows work from chrome/filmstrip focus */
  const keyRoot =
    root.closest("[data-wxp-pictures-window]") || root;

  buildThumbs();
  select(0);

  els.prevBtn?.addEventListener("click", onPrevClick);
  els.nextBtn?.addEventListener("click", onNextClick);
  keyRoot.addEventListener("keydown", onKeyDown);

  requestAnimationFrame(() => {
    requestAnimationFrame(fireReady);
  });

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      els.prevBtn?.removeEventListener("click", onPrevClick);
      els.nextBtn?.removeEventListener("click", onNextClick);
      keyRoot.removeEventListener("keydown", onKeyDown);
    },
    select,
    next,
    prev,
  };
}
