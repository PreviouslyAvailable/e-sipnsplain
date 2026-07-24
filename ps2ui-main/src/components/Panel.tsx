import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import { Surface } from "./Surface";
import { Text } from "./Text";
import "./Panel.css";

export interface PanelProps extends BaseProps {
  /** Optional header label (rendered uppercase, wide-tracked). */
  title?: React.ReactNode;
  /** Right-aligned header slot — a clock, a count, an action. */
  aside?: React.ReactNode;
  variant?: "base" | "raised" | "sunken";
  glow?: boolean;
  children?: React.ReactNode;
}

/**
 * A titled glass command-box — `Surface` with the BIOS header treatment: an
 * uppercase wide-tracked label and a hairline rule (research/DESIGN.md §5).
 */
export function Panel({
  title,
  aside,
  variant = "base",
  glow = false,
  className,
  style,
  children,
}: PanelProps) {
  return (
    <Surface variant={variant} glow={glow} className={cx("ps2-panel", className)} style={style}>
      {(title || aside) && (
        <header className="ps2-panel__head">
          {title ? (
            <Text variant="label" className="ps2-panel__title">
              {title}
            </Text>
          ) : (
            <span />
          )}
          {aside && <div className="ps2-panel__aside">{aside}</div>}
        </header>
      )}
      <div className="ps2-panel__body">{children}</div>
    </Surface>
  );
}
