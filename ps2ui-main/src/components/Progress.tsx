import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Progress.css";

export interface ProgressProps extends BaseProps {
  /** 0–100. Omit for an indeterminate "loading" sweep. */
  value?: number;
  /** Optional label above the track. */
  label?: React.ReactNode;
}

/**
 * A loading bar with the era's signature top-highlight streak on the fill
 * (FFX/KH status-bar pattern, research/DESIGN.md §5). Omit `value` for the
 * indeterminate boot-style sweep.
 */
export function Progress({ value, label, className, style }: ProgressProps) {
  const indeterminate = value == null;
  const pct = indeterminate ? 100 : Math.max(0, Math.min(100, value));

  return (
    <div className={cx("ps2-progress", className)} style={style}>
      {label && <div className="ps2-progress__label">{label}</div>}
      <div
        className="ps2-progress__track"
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cx(
            "ps2-progress__fill",
            indeterminate && "ps2-progress__fill--indeterminate",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
