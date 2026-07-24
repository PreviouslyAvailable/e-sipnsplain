/**
 * Finale source peel — structure / assets / prompts as curiosity.
 */

const SOURCE_TEXT = `// sip'n'splain — experience engine
// thesis demonstrated in the medium

/*
 * You just watched an interface grow up.
 * Scrapbook → OS → console → living-room TV → Mac desktop → games timeline.
 * The chrome was the argument.
 */

window.Sipnsplain = {
  version: "2026.phase-1",
  path: [
    "boot-bsod → Win95 desktop",
    "Atari + Minesweeper → Windows Update → Win98",
    "Themes → Chris, 1999 → Y2K → XP Bliss",
    "Firefox (Web 2.0) · My Pictures (GameCube)",
    "Shut Down → black → TV static → Space",
    "PS2 splash → boot jingle → Browser → Shutdown",
    "Apple glow → OS X Timewarp (2009→2025)",
    "Continue → time to play a game → Switch 2",
    "source-reveal ← you are here",
  ],
};

/* moments */
win95        // Atari strip · Minesweeper clear photo · Recycle
win98        // GBC · SkiFree · Pinball · Gates Preview · Chris, 1999
y2k          // clock drift → BSOD → CD install → XP
winxp        // Firefox kid-web tabs · GameCube filmstrip · power-off
consoles     // PS2 living room · print ads · Apple handoff
timewarp     // Mountain Lion shell · FarmVille → Mario Kart World
switch-2-cue // I think it's time to play a game.
source       // this file, scrolling

/* assets (homage · fair-use · press kits) */
/assets/minesweeper-reward.png
/assets/atari/ads/*
/assets/ps2/ps2-logo.png
/assets/ps2/ps2-boot-audio.mp3
/assets/ps2/ads/*
/assets/macos/audio/osx-startup.wav
/assets/timewarp/*
/assets/timewarp/icons/*
/mac-osx-lion-theme-master/   // MIT · Andromeda desktop chrome

/* prompt residue */
"Rebuild the ambition: browser-native presentation.
 Medium becomes the argument.
 Steal from Apple / Figma / Framer / games / AI.
 Ending is not Thanks —
 I think it's time to play a game.
 Bring in the Nintendo Switch 2.
 Then peel open the source."

/* architecture */
css/deck.css          // cinematic surface + BSOD + peel
css/ps2ui.css         // living-room hub
css/timewarp.css      // OS X shell
js/data.js            // chapters + talk notes
js/engine.js          // navigation · soft gates · score
js/moments/*.js       // signature theatre
js/main.js            // Sipnsplain.go / Story hotkeys

/* hooks scaffolded for later */
Sipnsplain.hooks.liveAttentionQuestion
Sipnsplain.hooks.realVisionDetect
Sipnsplain.hooks.photoshopMode
Sipnsplain.hooks.figmaMode
Sipnsplain.hooks.qaGrowPages
Sipnsplain.hooks.voiceCaptions
Sipnsplain.hooks.webglParticles

/* local overrides */
localStorage["sipnsplain-images-v1"]
localStorage["sipnsplain-audience-v1"]

// One curious person. One browser tab.
// Make something impossible.

/* proof of life */
/assets/finale/credits-photo.jpg
`;

export function createFinale() {
  function hydrate(deck) {
    deck.querySelectorAll("[data-source-body]").forEach((el) => {
      el.textContent = SOURCE_TEXT;
    });
  }

  return { hydrate, SOURCE_TEXT };
}
