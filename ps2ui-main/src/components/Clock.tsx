"use client";

import React, { useEffect, useState } from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import "./Clock.css";

export interface ClockProps extends BaseProps {
  /** Show seconds. */
  seconds?: boolean;
  /** Show the date line above the time. */
  date?: boolean;
}

function two(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * The dashboard clock — a thin wide-tracked BIOS readout (the PS2's real clock
 * was orbiting orbs + crystal rods; this is the legible web register of it,
 * research/DESIGN.md §1). Renders empty on the server and fills in on mount to
 * avoid a hydration mismatch.
 */
export function Clock({ seconds = true, date = true, className, style }: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? `${two(now.getHours())}:${two(now.getMinutes())}${seconds ? `:${two(now.getSeconds())}` : ""}`
    : seconds
      ? "--:--:--"
      : "--:--";

  const dateStr = now
    ? now.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
    : "--- -- ----";

  return (
    <div className={cx("ps2-clock", className)} style={style} role="timer" aria-live="off">
      <div className="ps2-clock__orbs" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="ps2-clock__readout">
        {date && <span className="ps2-clock__date">{dateStr}</span>}
        <span className="ps2-clock__time">{time}</span>
      </div>
    </div>
  );
}
