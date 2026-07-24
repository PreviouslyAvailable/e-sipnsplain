"use client";

import React, { useState } from "react";
import {
  Text,
  Surface,
  Panel,
  Button,
  Cube,
  IconTile,
  List,
  Row,
  Clock,
  Progress,
  BootScreen,
  MainMenu,
  MemoryCardBrowser,
} from "../src/index";

function Section({ no, title, children }: { no: string; title: string; children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="section__head">
        <span className="section__no">{no}</span>
        <Text variant="heading">{title}</Text>
      </div>
      {children}
    </section>
  );
}

const GlyphDisc = (
  <svg width="74" height="74" viewBox="0 0 74 74" fill="none" aria-hidden>
    <circle cx="37" cy="37" r="34" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
    <circle cx="37" cy="37" r="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <circle cx="37" cy="37" r="8" fill="currentColor" opacity="0.85" />
    <circle cx="37" cy="37" r="34" stroke="var(--ps2-cyan)" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

const GlyphGear = (
  <svg width="68" height="68" viewBox="0 0 68 68" fill="none" aria-hidden stroke="currentColor">
    <circle cx="34" cy="34" r="11" strokeWidth="1.6" />
    <circle cx="34" cy="34" r="22" strokeWidth="1.2" opacity="0.6" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={34 + Math.cos(a) * 22}
          y1={34 + Math.sin(a) * 22}
          x2={34 + Math.cos(a) * 30}
          y2={34 + Math.sin(a) * 30}
          strokeWidth="2"
        />
      );
    })}
  </svg>
);

const SWATCHES: Array<[string, string]> = [
  ["bg-abyss", "#000814"],
  ["bg-deep", "#001428"],
  ["bg", "#002b5c"],
  ["bg-rise", "#0044a0"],
  ["bg-horizon", "#1e5ddb"],
  ["blue", "#003087"],
  ["blue-true", "#006fcd"],
  ["cyan", "#5cc9fb"],
  ["ice", "#cfe4ff"],
];

export default function Page() {
  const [bootKey, setBootKey] = useState(0);
  const [val, setVal] = useState(64);

  return (
    <main className="gallery ps2-root" data-ps2="" data-ps2-region="ntsc">
      <header className="gallery__hero">
        <span className="gallery__kicker">Emotion-Engine blue</span>
        <Text variant="display" glow>PS2UI</Text>
        <Text variant="body" tone="secondary" style={{ maxWidth: 540 }}>
          The PlayStation 2 system dashboard, rebuilt as a React UI kit — the boot
          screen, the floating data-cubes, the blue. Pure CSS variables, zero runtime.
        </Text>
      </header>

      <Section no="01" title="Boot sequence">
        <Surface style={{ padding: 0, overflow: "hidden" }}>
          <BootScreen key={bootKey} towers={11} onComplete={() => {}} />
        </Surface>
        <div className="row-wrap">
          <Button onPress={() => setBootKey((k) => k + 1)} icon="↻">Replay boot</Button>
          <Text variant="caption">Towers = saved titles · height = play count · comets = △○✕□</Text>
        </div>
      </Section>

      <Section no="02" title="The dashboard">
        <MainMenu
          items={[
            { id: "browser", label: "Browser", caption: "Memory Card", icon: GlyphDisc },
            { id: "config", label: "System Configuration", caption: "Console settings", icon: GlyphGear },
          ]}
        />
      </Section>

      <Section no="03" title="Memory-card browser">
        <MemoryCardBrowser
          free="6.1MB free"
          saves={[
            { id: "1", title: "GRAN TURISMO 4", detail: "Saved game", size: "192 KB" },
            { id: "2", title: "SHADOW OF THE COLOSSUS", detail: "Saved game", size: "84 KB" },
            { id: "3", title: "METAL GEAR SOLID 3", detail: "Saved game", size: "120 KB" },
            { id: "4", title: "PERSONA 4", detail: "Saved game", size: "256 KB" },
            { id: "5", title: "OKAMI", detail: "Saved game", size: "98 KB" },
          ]}
        />
      </Section>

      <Section no="04" title="Components">
        <div className="grid-2">
          <Panel title="Buttons">
            <div className="col-wrap">
              <div className="row-wrap">
                <Button>Primary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Delete</Button>
              </div>
              <div className="row-wrap">
                <Button selected icon="▸">Selected</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </Panel>

          <Panel title="Data cubes">
            <div className="row-wrap" style={{ justifyContent: "space-around" }}>
              <Cube size={72} />
              <Cube size={56} speed={9} />
              <Cube size={64} tint="rgba(255,180,210,0.16)" />
            </div>
          </Panel>

          <Panel title="List / rows">
            <List inset>
              <Row icon={<Cube size={24} spin={false} />} label="Display" value="1080p" selected />
              <Row icon={<Cube size={24} spin={false} />} label="Sound" detail="Dolby Pro Logic II" value="On" />
              <Row icon={<Cube size={24} spin={false} />} label="Language" value="English" />
            </List>
          </Panel>

          <Panel title="Clock & progress" aside={<Clock seconds date={false} />}>
            <div className="col-wrap">
              <Progress value={val} label={`Loading — ${val}%`} />
              <Progress label="Streaming…" />
              <div className="row-wrap">
                <Button variant="ghost" onPress={() => setVal((v) => Math.max(0, v - 12))}>−</Button>
                <Button variant="ghost" onPress={() => setVal((v) => Math.min(100, v + 12))}>+</Button>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Typography">
          <div className="col-wrap">
            <Text variant="display" glow>Display</Text>
            <Text variant="title">Title — wide & thin</Text>
            <Text variant="heading">Heading</Text>
            <Text variant="body">Body copy in the BIOS neo-grotesque register.</Text>
            <Text variant="label" tone="secondary">Label · uppercase · tracked</Text>
          </div>
        </Panel>
      </Section>

      <Section no="05" title="Tokens — the palette">
        <div className="swatches">
          {SWATCHES.map(([name, hex]) => (
            <div key={name} className="swatch" style={{ background: hex }}>
              <span>{name}</span>
              <code>{hex}</code>
            </div>
          ))}
        </div>
      </Section>

      <footer className="gallery__foot">
        PS2UI · reverse-engineered from the PS2 BIOS dashboard ·{" "}
        <a href="https://github.com/Timmy-Lane/ps2ui">github</a> · PlayStation is a
        trademark of Sony Interactive Entertainment — this ships no Sony assets.
      </footer>
    </main>
  );
}
