import React from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Cube.css";

export interface CubeProps extends BaseProps {
  /** Edge length in px. */
  size?: number;
  /** Slowly tumble (off → a static iso cube). */
  spin?: boolean;
  /** Seconds per rotation. */
  speed?: number;
  /** Override the glass tint (any CSS color). */
  tint?: string;
}

/**
 * The iconic PS2 boot "data cube" — a translucent glass cube tumbling in space.
 * Pure CSS 3D, six faces, edge-lit. The single most recognizable PS2 motif
 * (research/DESIGN.md §1).
 */
export function Cube({
  size = 96,
  spin = true,
  speed = 16,
  tint,
  className,
  style,
}: CubeProps) {
  const vars = {
    ["--cube-size"]: `${size}px`,
    ["--cube-speed"]: `${speed}s`,
    ...(tint ? { ["--ps2-cube-fill"]: tint } : {}),
  } as React.CSSProperties;

  return (
    <div
      className={cx("ps2-cube", spin && "ps2-cube--spin", className)}
      style={{ ...vars, ...style }}
      aria-hidden="true"
    >
      <div className="ps2-cube__box">
        <span className="ps2-cube__face ps2-cube__face--front" />
        <span className="ps2-cube__face ps2-cube__face--back" />
        <span className="ps2-cube__face ps2-cube__face--right" />
        <span className="ps2-cube__face ps2-cube__face--left" />
        <span className="ps2-cube__face ps2-cube__face--top" />
        <span className="ps2-cube__face ps2-cube__face--bottom" />
      </div>
    </div>
  );
}
