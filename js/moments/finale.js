/**
 * Finale source peel — structure / assets / prompts as curiosity.
 */

const SOURCE_TEXT = `// sip'n'splain — experience engine
// thesis demonstrated in the medium

window.Sipnsplain = {
  version: "2026.phase-1",
  chapters: ["win95", "continue", "age-8", "age-11", "age-14", "finale"],
  eras: {
    "8": "2003 GBA SP pixel homage",
    "11": "2006 Bebo profile homage",
    "14": "2009 early craft web (minecraft.net homage)",
  },
  moments: [
    "boot-bsod (funny load lines + dial-up → click/key → desktop hub)",
    "win95-desktop (Start→Paint · Minesweeper · Internet · Lucky → continue)",
    "win98-desktop (SkiFree · Space Cadet · Desktop Themes → Chris, 2000 → XP)",
    "paint-app (erase white → /assets/paint-secret.png)",
    "continue (fresh rebuild stage)",
    "gba-sp-2003 (age-8 · photo on LCD)",
    "bebo-2006 (age-11 profile skin)",
    "minecraft-2009 (age-14 craft web)",
    "source-reveal (make something impossible)",
  ],
};

/* assets */
/assets/years/y01-01.png
/assets/years/y02-01.png … y02-04.png   // birthday → mascot payoff
/assets/years/y03-01.png
/assets/years/y04-01.png … y04-04.png   // NZ summer
/assets/years/y05-01.png
/assets/years/y06-01.png … y06-02.png
/assets/years/y07-01.png                 // CRT · enter screenshot

/* prompt residue (how this was made) */
"Rebuild the ambition: browser-native presentation.
 Medium becomes the argument.
 Steal from Apple / Figma / Framer / games / AI.
 Ending is not Thanks — Make something impossible.
 Then peel open the source."

/* architecture */
css/deck.css          // cinematic surface
js/data.js            // chapters + year stacks
js/engine.js          // navigation · photos · score
js/moments/*.js       // signature theatre
js/main.js            // boot + hooks scaffold

/* hooks scaffolded for later */
Sipnsplain.hooks.liveAttentionQuestion  // LLM from spoken notes
Sipnsplain.hooks.realVisionDetect       // vision API boxes
Sipnsplain.hooks.photoshopMode          // chapter takeover
Sipnsplain.hooks.figmaMode              // spatial takeover
Sipnsplain.hooks.qaGrowPages            // Q&A grows the deck
Sipnsplain.hooks.voiceCaptions          // voice / captions
Sipnsplain.hooks.webglParticles         // particles

/* local overrides */
localStorage["sipnsplain-images-v1"]    // dropped photos
localStorage["sipnsplain-audience-v1"]  // designer | other | mixed

// One curious person. One browser tab.
// Make something impossible.
`;

export function createFinale() {
  function hydrate(deck) {
    deck.querySelectorAll("[data-source-body]").forEach((el) => {
      el.textContent = SOURCE_TEXT;
    });
  }

  return { hydrate, SOURCE_TEXT };
}
