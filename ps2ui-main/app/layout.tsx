import React from "react";
import type { Metadata } from "next";
import "../src/styles/ps2ui.css";
import "./gallery.css";

export const metadata: Metadata = {
  title: "PS2UI — the PlayStation 2 system dashboard, as a web UI kit",
  description:
    "Boot screen, floating data-cubes, Emotion-Engine blue. A React UI kit reverse-engineered from the PS2 BIOS dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&family=Exo+2:wght@200;300;400;600&family=Michroma&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
