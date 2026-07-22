/**
 * Adaptive branch: optional designer audience flag → later thesis copy.
 * Poll slide removed — defaults to general path unless set via console
 * (Sipnsplain.moments.adaptive.setAudience('designer')).
 */

import { AUDIENCE_KEY } from "../data.js";

export function createAdaptive(ctx) {
  let audience = null;

  try {
    audience = localStorage.getItem(AUDIENCE_KEY) || null;
  } catch {
    audience = null;
  }

  function apply() {
    if (audience) document.body.dataset.audience = audience;
    else delete document.body.dataset.audience;
    ctx.hooks?.onAudienceChange?.(audience);
  }

  function setAudience(value) {
    audience = value;
    try { localStorage.setItem(AUDIENCE_KEY, value); } catch {}
    apply();
  }

  function wire(deck) {
    deck.querySelectorAll("[data-audience-poll]").forEach((group) => {
      const chapter = group.closest(".chapter");
      const feedback = chapter?.querySelector("[data-feedback]");
      const cont = chapter?.querySelector("[data-continue]");
      group.querySelectorAll("[data-audience]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const value = btn.dataset.audience;
          setAudience(value);
          group.querySelectorAll("[data-audience]").forEach((b) => {
            b.disabled = true;
            b.classList.toggle("is-correct", b === btn);
          });
          ctx.blip?.("correct");
          if (feedback) {
            const msgs = {
              designer: "Noted. The deck will lean designer later.",
              other: "Noted. Keeping the general path.",
              mixed: "Noted. Dual citizens — we'll split the difference.",
            };
            feedback.textContent = msgs[value] || "Noted.";
            feedback.classList.add("show", "ok");
          }
          chapter?.classList.add("quiz-solved");
          cont?.classList.add("show");
        });
      });
      cont?.addEventListener("click", () => ctx.next?.());
    });
  }

  apply();

  return {
    wire,
    setAudience,
    getAudience: () => audience,
    apply,
  };
}
