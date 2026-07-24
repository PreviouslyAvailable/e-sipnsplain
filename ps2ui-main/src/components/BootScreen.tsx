"use client";

import React, { useEffect, useMemo, useState } from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import { AmbientBackground } from "./AmbientBackground";
import "./BootScreen.css";

export interface BootScreenProps extends BaseProps {
  /** The fade-in wordmark. */
  wordmark?: React.ReactNode;
  /** Number of light-towers, or explicit heights (0–1) — "saved data". */
  towers?: number | number[];
  /** Fire once the rise + fade settle (ms ≈ boot duration). */
  onComplete?: () => void;
  /** Render the four DualShock-colored comets. */
  comets?: boolean;
}

function deterministicHeights(n: number): number[] {
  // Stable per-index heights so SSR matches client.
  return Array.from({ length: n }, (_, i) => 0.32 + (Math.sin((i + 1) * 2.4) * 0.5 + 0.5) * 0.66);
}

/**
 * The PS2 boot sequence — towers of light rising from the dark-blue plane (one
 * per saved title, height = play count), drifting data-cubes, the four
 * face-button comets, and the wordmark fading in (research/DESIGN.md §1).
 */
export function BootScreen({
  wordmark = "Sony Computer Entertainment",
  towers = 9,
  onComplete,
  comets = true,
  className,
  style,
}: BootScreenProps) {
  const heights = useMemo(
    () => (Array.isArray(towers) ? towers : deterministicHeights(towers)),
    [towers],
  );
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    const r = requestAnimationFrame(() => setRisen(true));
    const done = onComplete ? setTimeout(onComplete, 3000) : undefined;
    return () => {
      cancelAnimationFrame(r);
      if (done) clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div
      className={cx("ps2-boot", risen && "ps2-boot--risen", className)}
      style={style}
      data-ps2=""
    >
      <AmbientBackground density={22} field />

      <div className="ps2-boot__towers" aria-hidden="true">
        {heights.map((h, i) => (
          <span
            key={i}
            className="ps2-boot__tower"
            style={
              { ["--tower-h"]: `${Math.round(h * 100)}%`, ["--tower-delay"]: `${i * 90}ms` } as React.CSSProperties
            }
          />
        ))}
      </div>

      {comets && (
        <div className="ps2-boot__comets" aria-hidden="true">
          <span className="ps2-boot__comet ps2-boot__comet--a" />
          <span className="ps2-boot__comet ps2-boot__comet--b" />
          <span className="ps2-boot__comet ps2-boot__comet--c" />
          <span className="ps2-boot__comet ps2-boot__comet--d" />
        </div>
      )}

      {wordmark && <div className="ps2-boot__wordmark">{wordmark}</div>}
    </div>
  );
}
