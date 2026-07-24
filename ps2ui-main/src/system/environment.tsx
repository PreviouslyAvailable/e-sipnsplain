"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Region, Scene } from "./types";
import "../tokens/variables.css";

interface PS2Environment {
  scene: Scene;
  region: Region;
  /** Master accent — overrides --ps2-blue-bright for selection/glow. */
  tint?: string;
  /** Disable the ambient/breathing motion regardless of OS setting. */
  reducedMotion: boolean;
}

const defaultEnv: PS2Environment = {
  scene: "browser",
  region: "ntsc",
  reducedMotion: false,
};

const Ctx = createContext<PS2Environment>(defaultEnv);

/** Read the current PS2 environment (scene, region, tint). */
export function usePS2(): PS2Environment {
  return useContext(Ctx);
}

export interface PS2ProviderProps extends Partial<PS2Environment> {
  children: React.ReactNode;
  /** Apply the dashboard background + base typography to this subtree. */
  asRoot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrap your app (or any subtree) to establish the PS2 environment — the web
 * port of the BIOS "scene". Sets `data-ps2` so the tokens apply, exposes
 * scene/region/tint via context, and (with `asRoot`) paints the dashboard
 * field behind its children.
 */
export function PS2Provider({
  children,
  scene = "browser",
  region = "ntsc",
  tint,
  reducedMotion = false,
  asRoot = false,
  className,
  style,
}: PS2ProviderProps) {
  const env = useMemo<PS2Environment>(
    () => ({ scene, region, tint, reducedMotion }),
    [scene, region, tint, reducedMotion],
  );

  const styleVars: React.CSSProperties = {
    ...(tint ? ({ ["--ps2-blue-bright"]: tint } as React.CSSProperties) : {}),
    ...style,
  };

  return (
    <Ctx.Provider value={env}>
      <div
        data-ps2=""
        data-ps2-scene={scene}
        data-ps2-region={region}
        data-ps2-reduced={reducedMotion ? "" : undefined}
        className={asRoot ? `ps2-root ${className ?? ""}` : className}
        style={styleVars}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}
