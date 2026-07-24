"use client";

import React, { useState } from "react";
import { cx } from "../lib/cx";
import type { BaseProps } from "../system/types";
import { Panel } from "../components/Panel";
import { List, Row } from "../components/List";
import { Cube } from "../components/Cube";
import "./MemoryCardBrowser.css";

export interface SaveEntry {
  id: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  /** e.g. "128 KB" */
  size?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface MemoryCardBrowserProps extends BaseProps {
  saves: SaveEntry[];
  /** Header label. */
  title?: React.ReactNode;
  /** Right-aligned header note (e.g. free space). */
  free?: React.ReactNode;
  onOpen?: (id: string) => void;
}

/**
 * The memory-card browser — a glass command-box of saves on the blue field,
 * each row a translucent data tile (research/DESIGN.md §1, §5).
 */
export function MemoryCardBrowser({
  saves,
  title = "Memory Card (8MB)",
  free,
  onOpen,
  className,
  style,
}: MemoryCardBrowserProps) {
  const [sel, setSel] = useState<string>(saves[0]?.id ?? "");

  return (
    <Panel
      title={title}
      aside={free ?? `${saves.length} items`}
      glow
      className={cx("ps2-mcb", className)}
      style={style}
    >
      <List inset>
        {saves.map((s) => (
          <Row
            key={s.id}
            icon={s.icon ?? <Cube size={26} spin={false} />}
            label={s.title}
            detail={s.detail}
            value={s.size}
            selected={sel === s.id}
            onSelect={() => {
              setSel(s.id);
              onOpen?.(s.id);
            }}
          />
        ))}
      </List>
    </Panel>
  );
}
