import type React from "react";

/** Props every PS2UI surface-ish component accepts. */
export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

/** The PS2 system has three visual "scenes". */
export type Scene = "boot" | "browser" | "config";

/** Video standard — purely cosmetic (scanline cadence / clock format). */
export type Region = "ntsc" | "pal";
