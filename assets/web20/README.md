# Web 2.0 ad assets (Mozilla Firefox on Windows XP)

Drop print / banner ads into each brand folder. Paths are wired via `WEB20_TABS` in `js/moments/ad-manifests.js`.

The browser chrome lives on the **Windows XP** desktop (`#winxp`) as a Mozilla Firefox 1.0 homage — open from the desktop icon or Start → Mozilla Firefox. Presenter shortcut: `Sipnsplain.go('web20')` / Story hotkey **6**.

| Tab | Year | Folder |
|-----|------|--------|
| Neopets | 2004 | `neopets/ads/` |
| Club Penguin | 2005 | `club-penguin/ads/` |
| RuneScape | 2006 | `runescape/ads/` |
| Moshi Monsters | 2007 | `moshi-monsters/ads/` |

Until images are listed in the manifest, each tab shows a single quiet empty-state (not a wall of placeholder cards) so the talk still has breathing room.

**Filled so far**

- **Neopets** — mix of `full` and paired `half` ads under `neopets/ads/`
- **Club Penguin** — Penguin Style Dec 2005 catalog, 7 sequential `full` pages under `club-penguin/ads/` (`01-…` → `07-…`)
- **RuneScape** — 7 meme/image cards as `third` under `runescape/ads/` (3-wide rows)
- **Moshi Monsters** — 5 magazine covers as `half` + dense Moshlings map as `full` under `moshi-monsters/ads/` (`01-…` → `06-…`)

Suggested filenames: `neopets-characters.png`, `01-penguin-style-cover.png`, `rs-ge-glories-addy.png`, etc. Then add entries to that tab's `images` array:

- String path → full-width stack item
- `{ src: "/assets/web20/.../file.png", size: "full" | "half" | "third" }` → size-aware feed on a **6-column** grid:
  - `full` → span 6 (full row)
  - `half` → span 3 (two per row; Neopets happy-meal still pairs)
  - `third` → span 2 (three per row; RuneScape memes)
