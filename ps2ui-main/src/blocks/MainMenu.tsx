"use client";

import React, { useState } from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import { AmbientBackground } from "../components/AmbientBackground";
import { Clock } from "../components/Clock";
import { IconTile } from "../components/IconTile";
import "./MainMenu.css";

export interface MainMenuItem {
  id: string;
  label: React.ReactNode;
  caption?: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export interface MainMenuProps extends BaseProps {
  items: MainMenuItem[];
  /** Bottom-left version / system string. */
  version?: React.ReactNode;
  /** Show the dashboard clock (top-right). */
  clock?: boolean;
  /** Controlled selected id. */
  selectedId?: string;
}

/**
 * The PS2 dashboard — drifting blue field, a clock, and the floating menu tiles
 * ("Browser" / "System Configuration"). Drop in any items
 * (research/DESIGN.md §1).
 */
export function MainMenu({
  items,
  version = "PS2UI · Browser version 2.00",
  clock = true,
  selectedId,
  className,
  style,
}: MainMenuProps) {
  const [internal, setInternal] = useState<string>(items[0]?.id ?? "");
  const selected = selectedId ?? internal;

  return (
    <div className={cx("ps2-menu", "ps2-root", className)} style={style} data-ps2="" data-ps2-region="ntsc">
      <AmbientBackground density={26} field />

      {clock && (
        <div className="ps2-menu__clock">
          <Clock />
        </div>
      )}

      <div className="ps2-menu__tiles">
        {items.map((it) => (
          <IconTile
            key={it.id}
            label={it.label}
            caption={it.caption}
            icon={it.icon}
            selected={selected === it.id}
            onSelect={() => {
              setInternal(it.id);
              it.onSelect?.();
            }}
          />
        ))}
      </div>

      {version && <div className="ps2-menu__version">{version}</div>}
    </div>
  );
}
