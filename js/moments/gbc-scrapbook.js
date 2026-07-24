/**
 * Game Boy Color scrapbook — 2-column scrollable ad grid.
 * Prefer building DOM here so Wave 2 HTML can stay a thin shell.
 */

/**
 * @param {HTMLElement} root
 * @param {{ images: string[], onContinue?: () => void }} opts
 * @returns {{ destroy: () => void }}
 */
export function mountGbcScrapbook(root, opts) {
  const images = Array.isArray(opts?.images) ? opts.images : [];
  const onContinue = opts?.onContinue;

  /** @type {HTMLElement[]} */
  const created = [];
  let continued = false;
  let destroyed = false;

  const collage =
    root.querySelector("[data-gbc-collage]") || ensureCollage(root, created);

  collage.replaceChildren();

  images.forEach((src) => {
    const card = document.createElement("figure");
    card.className = "w98-gbc-card";

    const img = document.createElement("img");
    img.className = "w98-gbc-photo";
    img.src = src;
    img.alt = "";
    img.draggable = false;

    card.append(img);
    collage.appendChild(card);
  });

  const continueBtns = [
    ...root.querySelectorAll("[data-w98-gbc-continue], [data-gbc-continue]"),
  ];

  const handleContinue = (e) => {
    e?.preventDefault?.();
    if (destroyed || continued) return;
    continued = true;
    onContinue?.();
  };

  continueBtns.forEach((btn) => {
    btn.addEventListener("click", handleContinue);
  });

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      continueBtns.forEach((btn) => {
        btn.removeEventListener("click", handleContinue);
      });
      created.forEach((el) => el.remove());
    },
  };
}

/**
 * @param {HTMLElement} root
 * @param {HTMLElement[]} created
 * @returns {HTMLElement}
 */
function ensureCollage(root, created) {
  const el = document.createElement("div");
  el.className = "w98-gbc-collage";
  el.setAttribute("data-gbc-collage", "");
  root.appendChild(el);
  created.push(el);
  return el;
}
