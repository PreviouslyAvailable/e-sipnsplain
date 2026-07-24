import React, { useMemo } from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./AmbientBackground.css";

export interface AmbientBackgroundProps extends BaseProps {
  /** How many drifting motes. */
  density?: number;
  /** Paint the deep-blue field behind the motes (else transparent). */
  field?: boolean;
}

/** Deterministic 0..1 pseudo-random from an integer seed (SSR-stable). */
function rnd(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * The ambient "sand" — translucent cubes drifting slowly up the blue field, the
 * living backdrop of the PS2 dashboard (research/DESIGN.md §1, §4). Positions are
 * deterministic so server and client render identically. Honors reduced-motion.
 */
export function AmbientBackground({
  density = 28,
  field = true,
  className,
  style,
}: AmbientBackgroundProps) {
  const motes = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => {
        const size = 6 + rnd(i + 1) * 26;
        return {
          key: i,
          left: `${rnd(i + 7) * 100}%`,
          size,
          delay: `${-rnd(i + 13) * 14}s`,
          duration: `${14 + rnd(i + 21) * 16}s`,
          drift: `${(rnd(i + 31) - 0.5) * 60}px`,
          opacity: 0.12 + rnd(i + 41) * 0.4,
        };
      }),
    [density],
  );

  return (
    <div
      className={cx("ps2-ambient", field && "ps2-ambient--field", className)}
      style={style}
      aria-hidden="true"
    >
      {motes.map((m) => (
        <span
          key={m.key}
          className="ps2-ambient__mote"
          style={
            {
              left: m.left,
              width: `${m.size}px`,
              height: `${m.size}px`,
              opacity: m.opacity,
              ["--mote-delay"]: m.delay,
              ["--mote-duration"]: m.duration,
              ["--mote-drift"]: m.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
