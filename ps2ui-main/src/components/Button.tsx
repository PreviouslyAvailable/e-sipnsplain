"use client";

import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Button.css";

export interface ButtonProps extends BaseProps {
  variant?: "primary" | "ghost" | "danger";
  /** Keyboard/selection highlight (the PS2 cursor resting on this item). */
  selected?: boolean;
  disabled?: boolean;
  /** Leading glyph / icon node. */
  icon?: React.ReactNode;
  onPress?: () => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

/**
 * The PS2 chrome button — glossy blue glass that blooms on hover/focus and
 * glides on selection (research/DESIGN.md §5). `selected` mirrors the BIOS
 * cursor highlight for menu rows.
 */
export function Button({
  variant = "primary",
  selected = false,
  disabled = false,
  icon,
  onPress,
  type = "button",
  className,
  style,
  children,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onPress}
      aria-pressed={selected || undefined}
      className={cx(
        "ps2-btn",
        `ps2-btn--${variant}`,
        selected && "ps2-btn--selected",
        className,
      )}
      style={style}
    >
      {icon && <span className="ps2-btn__icon">{icon}</span>}
      {children && <span className="ps2-btn__label">{children}</span>}
    </button>
  );
}
