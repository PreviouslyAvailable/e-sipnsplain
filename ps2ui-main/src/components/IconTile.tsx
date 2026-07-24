"use client";

import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./IconTile.css";

export interface IconTileProps extends BaseProps {
  label: React.ReactNode;
  /** Sub-label under the title. */
  caption?: React.ReactNode;
  /** The big glyph — an SVG, emoji, or a <Cube/>. */
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}

/**
 * A large dashboard menu tile — the "Browser" / "System Configuration" objects
 * of the PS2 BIOS: a glassy pedestal holding a floating glyph, with a wide
 * uppercase label beneath (research/DESIGN.md §1).
 */
export function IconTile({
  label,
  caption,
  icon,
  selected = false,
  onSelect,
  className,
  style,
}: IconTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected || undefined}
      className={cx("ps2-tile", selected && "ps2-tile--selected", className)}
      style={style}
    >
      <span className="ps2-tile__stage">
        {icon && <span className="ps2-tile__icon">{icon}</span>}
      </span>
      <span className="ps2-tile__meta">
        <span className="ps2-tile__label">{label}</span>
        {caption && <span className="ps2-tile__caption">{caption}</span>}
      </span>
    </button>
  );
}
