"use client";

import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import { Surface } from "./Surface";
import "./List.css";

export interface ListProps extends BaseProps {
  /** Inset-grouped glass card (default) vs. flush rows. */
  inset?: boolean;
  children?: React.ReactNode;
}

/** A grouped list — the memory-card browser substrate (research/DESIGN.md §1, §5). */
export function List({ inset = true, className, style, children }: ListProps) {
  if (!inset) {
    return (
      <div className={cx("ps2-list", className)} style={style} role="list">
        {children}
      </div>
    );
  }
  return (
    <Surface variant="sunken" sheen={false} className={cx("ps2-list", "ps2-list--inset", className)} style={style}>
      <div role="list">{children}</div>
    </Surface>
  );
}

export interface RowProps extends BaseProps {
  /** Leading glyph / icon. */
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Secondary line under the label. */
  detail?: React.ReactNode;
  /** Right-aligned value / accessory. */
  value?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

/** One memory-card-browser row: leading icon · label/detail · trailing value. */
export function Row({
  icon,
  label,
  detail,
  value,
  selected = false,
  disabled = false,
  onSelect,
  className,
  style,
}: RowProps) {
  const interactive = !!onSelect && !disabled;
  return (
    <div
      role="listitem"
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cx(
        "ps2-row",
        interactive && "ps2-row--interactive",
        selected && "ps2-row--selected",
        disabled && "ps2-row--disabled",
        className,
      )}
      style={style}
    >
      {icon && <span className="ps2-row__icon">{icon}</span>}
      <span className="ps2-row__text">
        <span className="ps2-row__label">{label}</span>
        {detail && <span className="ps2-row__detail">{detail}</span>}
      </span>
      {value != null && <span className="ps2-row__value">{value}</span>}
    </div>
  );
}
