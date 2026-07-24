/** Curated print-ad paths for games-first talk moments. */

export const ATARI_ADS = [
  "/assets/atari/ads/atari-joust.png",
  "/assets/atari/ads/atari-pacman-is-coming.png",
  "/assets/atari/ads/atari-pacman-dutch.png",
  "/assets/atari/ads/atari-ms-pacman.png",
  "/assets/atari/ads/atari-games-lineup.png",
  "/assets/atari/ads/atari-no-comparing.png",
  "/assets/atari/ads/atari-have-you-played.png",
  "/assets/atari/ads/atari-400-800.png",
  "/assets/atari/ads/atari-computer-age-home.png",
  "/assets/atari/ads/atari-graphic-difference.png",
  "/assets/atari/ads/atari-800-intro.png",
  "/assets/atari/ads/atari-vcs-new-year.png",
];

export const GBC_ADS = [
  "/assets/gbc/ads/gbc-pokemon-red-blue.png",
  "/assets/gbc/ads/gbc-pokemon-tcg.png",
  "/assets/gbc/ads/gbc-donkey-kong-country.png",
  "/assets/gbc/ads/gbc-escape-from-cubicle.png",
  "/assets/gbc/ads/gbc-what-color-is-yours.png",
  "/assets/gbc/ads/gbc-we-there-yet.png",
  "/assets/gbc/ads/gbc-im-in-color.png",
  "/assets/gbc/ads/gbc-bionic-commando.png",
];

export const GAMECUBE_ADS = [
  "/assets/gamecube/ads/gc-wavebird.png",
  "/assets/gamecube/ads/gc-luigis-mansion-cube.png",
  "/assets/gamecube/ads/gc-luigis-mansion.png",
  "/assets/gamecube/ads/gc-zelda-collectors.png",
  "/assets/gamecube/ads/gc-walmart-sweet.png",
  "/assets/gamecube/ads/gc-get-into-it.png",
  "/assets/gamecube/ads/gc-born-to-play.png",
  "/assets/gamecube/ads/gc-start-mayhem.png",
  "/assets/gamecube/ads/gc-nba-courtside-2002.png",
  "/assets/gamecube/ads/gc-walmart-everest.png",
  "/assets/gamecube/ads/gc-relive-the-cube.png",
];

/** PS2 living-room Browser — vertical full-bleed print stack (assets/ps2/ads/). */
export const PS2_ADS = [
  "/assets/ps2/ads/ps2-third-place-start.png",
  "/assets/ps2/ads/ps2-heads-supermarket.png",
  "/assets/ps2/ads/ps2-victories-squared.png",
  "/assets/ps2/ads/ps2-face-grid.png",
  "/assets/ps2/ads/ps2-sleepless-nights.png",
  "/assets/ps2/ads/ps2-tongue-pills.png",
  "/assets/ps2/ads/ps2-freedom-squared.png",
  "/assets/ps2/ads/ps2-be-careful.png",
  "/assets/ps2/ads/ps2-exposed.png",
  "/assets/ps2/ads/ps2-open-mind.png",
  "/assets/ps2/ads/ps2-more-powerful.png",
  "/assets/ps2/ads/ps2-live-in-your-world.png",
  "/assets/ps2/ads/ps2-fingerprint-eyes.png",
  "/assets/ps2/ads/ps2-modular-face.png",
];

/**
 * Web 2.0 Firefox tabs on #winxp — year order 2004→2007.
 * Fill `images` with paths under assets/web20/<slug>/ads/; empty arrays show a quiet empty-state.
 * Each entry may be a string path (defaults to size "full") or
 * `{ src: string, size?: "full" | "half" | "third" }` for the vertical scroll feed.
 * Optional `placeholders` only used when images are present (extra soft slots); prefer 0–1.
 * @typedef {{ src: string, size?: "full" | "half" | "third" }} Web20Ad
 * @type {{ id: string, label: string, year: number, url: string, images: (string|Web20Ad)[], placeholders?: number }[]}
 */
export const WEB20_TABS = [
  {
    id: "neopets",
    label: "Neopets",
    year: 2004,
    url: "http://www.neopets.com/",
    images: [
      { src: "/assets/web20/neopets/ads/neopets-characters.png", size: "full" },
      { src: "/assets/web20/neopets/ads/neopets-maraqua.png", size: "full" },
      { src: "/assets/web20/neopets/ads/neopets-stock-market.png", size: "full" },
      { src: "/assets/web20/neopets/ads/neopets-happy-meal.png", size: "half" },
      { src: "/assets/web20/neopets/ads/neopets-magazine-spread.png", size: "full" },
    ],
  },
  {
    id: "club-penguin",
    label: "Club Penguin",
    year: 2005,
    url: "http://www.clubpenguin.com/",
    images: [
      { src: "/assets/web20/club-penguin/ads/01-penguin-style-cover.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/02-penguin-style-page-1.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/03-penguin-style-page-3.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/04-penguin-style-page-4.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/05-penguin-style-page-5.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/06-penguin-style-page-6.png", size: "full" },
      { src: "/assets/web20/club-penguin/ads/07-penguin-style-page-7.png", size: "full" },
    ],
  },
  {
    id: "runescape",
    label: "RuneScape",
    year: 2006,
    url: "http://www.runescape.com/",
    images: [
      { src: "/assets/web20/runescape/ads/rs-ge-glories-addy.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-partyhat-loser.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-mining-xp-wojak.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-pizza-hut-30.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-middle-school-woodcutting.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-ready-to-die.png", size: "third" },
      { src: "/assets/web20/runescape/ads/rs-dragon-warhammer-kids.png", size: "full" },
    ],
  },
  {
    id: "moshi-monsters",
    label: "Moshi Monsters",
    year: 2007,
    url: "http://www.moshimonsters.com/",
    images: [
      { src: "/assets/web20/moshi-monsters/ads/01-magazine-issue-1.png", size: "half" },
      { src: "/assets/web20/moshi-monsters/ads/02-magazine-issue-62.png", size: "half" },
      { src: "/assets/web20/moshi-monsters/ads/03-moshlings-map.png", size: "full" },
      { src: "/assets/web20/moshi-monsters/ads/04-magazine-issue-59.png", size: "half" },
      { src: "/assets/web20/moshi-monsters/ads/05-magazine-issue-66.png", size: "half" },
      { src: "/assets/web20/moshi-monsters/ads/06-magazine-issue-2.png", size: "half" },
      { src: "/assets/web20/moshi-monsters/ads/07-magazine-issue-32.png", size: "half" },
    ],
  },
];
