import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Text.css";

type Variant = "display" | "title" | "heading" | "body" | "label" | "caption";

export interface TextProps extends BaseProps {
  variant?: Variant;
  /** Add the soft BIOS text-bloom. */
  glow?: boolean;
  /** Cool secondary/tertiary ink. */
  tone?: "primary" | "secondary" | "tertiary";
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
}

/**
 * BIOS typography. Thin, wide-tracked, optionally glowing — the dashboard's
 * voice. `display` is the boot wordmark; `label` is the uppercase row text.
 */
export function Text({
  variant = "body",
  glow = false,
  tone = "primary",
  as,
  className,
  style,
  children,
}: TextProps) {
  const Tag = (as ?? (variant === "display" || variant === "title" ? "h1" : "p")) as "p";
  return (
    <Tag
      className={cx(
        "ps2-text",
        `ps2-text--${variant}`,
        tone !== "primary" && `ps2-text--${tone}`,
        glow && "ps2-text--glow",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
