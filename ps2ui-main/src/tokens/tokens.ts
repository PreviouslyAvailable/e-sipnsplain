/**
 * Typed mirror of the PS2UI design tokens (see variables.css).
 *
 * Each value here is `var(--ps2-…)` so it reads from the live CSS variables —
 * meaning a consumer who overrides a variable on :root automatically reskins
 * anything that uses these constants. Use this when you author styles in JS/TS
 * (inline styles, styled blocks) and want the design system, not raw hexes.
 */

export const color = {
  bgAbyss: "var(--ps2-bg-abyss)",
  bgDeep: "var(--ps2-bg-deep)",
  bg: "var(--ps2-bg)",
  bgRise: "var(--ps2-bg-rise)",
  bgHorizon: "var(--ps2-bg-horizon)",
  blue: "var(--ps2-blue)",
  blueTrue: "var(--ps2-blue-true)",
  blueBright: "var(--ps2-blue-bright)",
  cyan: "var(--ps2-cyan)",
  ice: "var(--ps2-ice)",
  btnTriangle: "var(--ps2-btn-triangle)",
  btnCircle: "var(--ps2-btn-circle)",
  btnCross: "var(--ps2-btn-cross)",
  btnSquare: "var(--ps2-btn-square)",
  cubeFill: "var(--ps2-cube-fill)",
  cubeEdge: "var(--ps2-cube-edge)",
  cubeCore: "var(--ps2-cube-core)",
  text: "var(--ps2-text)",
  textSecondary: "var(--ps2-text-secondary)",
  textTertiary: "var(--ps2-text-tertiary)",
  textOnLight: "var(--ps2-text-on-light)",
  line: "var(--ps2-line)",
  lineStrong: "var(--ps2-line-strong)",
} as const;

export const surface = {
  base: "var(--ps2-surface)",
  raised: "var(--ps2-surface-raised)",
  sunken: "var(--ps2-surface-sunken)",
  sheen: "var(--ps2-sheen)",
  blur: "var(--ps2-surface-blur)",
} as const;

export const glow = {
  sm: "var(--ps2-glow-sm)",
  base: "var(--ps2-glow)",
  lg: "var(--ps2-glow-lg)",
  text: "var(--ps2-glow-text)",
  shadow: "var(--ps2-shadow)",
  insetEdge: "var(--ps2-inset-edge)",
} as const;

export const font = {
  sans: "var(--ps2-font)",
  display: "var(--ps2-font-display)",
  mono: "var(--ps2-font-mono)",
  weight: {
    thin: "var(--ps2-weight-thin)",
    light: "var(--ps2-weight-light)",
    regular: "var(--ps2-weight-regular)",
    medium: "var(--ps2-weight-medium)",
  },
  size: {
    display: "var(--ps2-text-display)",
    title: "var(--ps2-text-title)",
    heading: "var(--ps2-text-heading)",
    body: "var(--ps2-text-body)",
    label: "var(--ps2-text-label)",
    caption: "var(--ps2-text-caption)",
  },
  tracking: {
    tight: "var(--ps2-tracking-tight)",
    base: "var(--ps2-tracking)",
    wide: "var(--ps2-tracking-wide)",
    mega: "var(--ps2-tracking-mega)",
  },
} as const;

export const space = {
  1: "var(--ps2-space-1)",
  2: "var(--ps2-space-2)",
  3: "var(--ps2-space-3)",
  4: "var(--ps2-space-4)",
  5: "var(--ps2-space-5)",
  6: "var(--ps2-space-6)",
  7: "var(--ps2-space-7)",
  8: "var(--ps2-space-8)",
} as const;

export const radius = {
  sm: "var(--ps2-radius-sm)",
  base: "var(--ps2-radius)",
  lg: "var(--ps2-radius-lg)",
  cube: "var(--ps2-radius-cube)",
  pill: "var(--ps2-radius-pill)",
} as const;

export const motion = {
  ease: "var(--ps2-ease)",
  easeSoft: "var(--ps2-ease-soft)",
  easeRise: "var(--ps2-ease-rise)",
  dur: {
    fast: "var(--ps2-dur-fast)",
    base: "var(--ps2-dur)",
    slow: "var(--ps2-dur-slow)",
    boot: "var(--ps2-dur-boot)",
    drift: "var(--ps2-dur-drift)",
    breathe: "var(--ps2-dur-breathe)",
  },
} as const;

export const tokens = { color, surface, glow, font, space, radius, motion } as const;
export type Tokens = typeof tokens;
