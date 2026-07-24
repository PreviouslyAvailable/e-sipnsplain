/**
 * Windows 98 Desktop Themes — foreshadows app re-skins.
 * Presented as “Desktop Themes” (not “Plus! for Windows 95”).
 *
 * Chris photo swap: replace `/assets/chris-1999.png` (see assets/chris-1999.README.md).
 */

/** @typedef {{
 *   id: string,
 *   label: string,
 *   preview: string,
 *   sfx?: string,
 *   exitReveal?: boolean,
 * }} W98ThemeDef
 */

/** @type {W98ThemeDef[]} */
export const W98_THEMES = [
  {
    id: "default",
    label: "Windows Standard",
    preview: "Classic teal desktop",
    sfx: "press",
  },
  {
    id: "underwater",
    label: "Underwater",
    preview: "Deep teal · fishy vibes",
    sfx: "beat",
  },
  {
    id: "dangerous",
    label: "Dangerous Creatures",
    preview: "Jungle ochre · fang accents",
    sfx: "beat",
  },
  {
    id: "space",
    label: "Space",
    preview: "Midnight void · starfield",
    sfx: "beat",
  },
  {
    id: "chris1999",
    label: "Chris, 1999",
    preview: "Happy New Year…?",
    sfx: "photo",
    exitReveal: true,
  },
];

/** Era photo for Chris, 1999 wallpaper + exit reveal — Chris can swap this file. */
export const CHRIS_1999_PHOTO = "/assets/chris-1999.png";

/**
 * @param {string} id
 * @returns {W98ThemeDef | undefined}
 */
export function getW98Theme(id) {
  return W98_THEMES.find((t) => t.id === id);
}

/**
 * Apply a reversible desktop theme via data-w98-theme.
 * @param {HTMLElement} desktop
 * @param {string} themeId
 */
export function applyW98Theme(desktop, themeId) {
  const theme = getW98Theme(themeId) || W98_THEMES[0];
  desktop.dataset.w98Theme = theme.id;
  const chapter = desktop.closest(".chapter.mode-win98");
  if (chapter) chapter.dataset.w98Theme = theme.id;
  return theme;
}
