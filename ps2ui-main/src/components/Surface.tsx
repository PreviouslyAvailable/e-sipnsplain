import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Surface.css";

export interface SurfaceProps extends BaseProps {
  /** Glass depth. */
  variant?: "base" | "raised" | "sunken";
  /** Add the soft blue bloom. */
  glow?: boolean;
  /** Paint the top sheen highlight (the console gloss). */
  sheen?: boolean;
  /** Frosted-glass backdrop blur (costs a compositing layer). */
  blur?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * The glass panel every chrome surface is built on — translucent blue fill, a
 * 1px light edge, an optional top sheen, and an optional blue bloom. This is the
 * PS2 BIOS "command box" substrate (research/DESIGN.md §5–6).
 */
export function Surface({
  variant = "base",
  glow = false,
  sheen = true,
  blur = true,
  as = "div",
  className,
  style,
  children,
}: SurfaceProps) {
  const Tag = as as "div";
  return (
    <Tag
      className={cx(
        "ps2-surface",
        `ps2-surface--${variant}`,
        glow && "ps2-surface--glow",
        sheen && "ps2-surface--sheen",
        blur && "ps2-surface--blur",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
