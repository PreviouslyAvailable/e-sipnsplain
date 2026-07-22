#!/usr/bin/env python3
"""Slice Chris-provided SkiFree sheets → transparent PNGs + atlas.json.

Sheets: assets/refs/skifree/sheets/{title-controls,characters,objects}.png
Output: assets/refs/skifree/sliced/*.png and assets/refs/skifree/atlas.json
"""

from __future__ import annotations

import json
import os
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "assets" / "refs" / "skifree"
SHEETS = ROOT / "sheets"
OUT = ROOT / "sliced"


def knock_white(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= 250 and g >= 250 and b >= 250:
                px[x, y] = (0, 0, 0, 0)
    return img


def clear_sep_rows(img: Image.Image) -> list[int]:
    px = img.load()
    w, h = img.size
    cleared = []
    for y in range(h):
        gre = blu = lime = 0
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if g >= 180 and r < 80 and b < 80:
                gre += 1
            if b >= 140 and r < 90 and g < 100:
                blu += 1
            if g > 200 and 140 < r < 200 and b < 80:
                lime += 1
        if gre >= w * 0.2 or blu >= w * 0.5 or lime >= w * 0.5:
            for x in range(w):
                px[x, y] = (0, 0, 0, 0)
            cleared.append(y)
    return cleared


def content_bbox(img: Image.Image, pad: int = 0):
    px = img.load()
    w, h = img.size
    minx, miny, maxx, maxy = w, h, -1, -1
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 0:
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)
    if maxx < 0:
        return None
    return (
        max(0, minx - pad),
        max(0, miny - pad),
        min(w, maxx + 1 + pad),
        min(h, maxy + 1 + pad),
    )


def extract(img, box, name, atlas, sheet, scale=2, ax=0.5, ay=1.0):
    c = img.crop(box)
    bb = content_bbox(c)
    if not bb:
        print("EMPTY", name, box)
        return None
    c = c.crop(bb)
    c.save(OUT / f"{name}.png")
    atlas[name] = {
        "sheet": sheet,
        "x": box[0] + bb[0],
        "y": box[1] + bb[1],
        "w": c.size[0],
        "h": c.size[1],
        "scale": scale,
        "ax": ax,
        "ay": ay,
    }
    print(f"{name:20s} {c.size[0]:3d}x{c.size[1]:<3d}")
    return c


def valley(img, y0, y1, max_valley=4, min_sep=8, min_w=8, smooth=1):
    px = img.load()
    W = img.size[0]
    cols = [sum(1 for y in range(y0, y1) if px[x, y][3] > 0) for x in range(W)]
    s = [
        sum(cols[max(0, i - smooth) : min(W, i + smooth + 1)])
        / (min(W, i + smooth + 1) - max(0, i - smooth))
        for i in range(W)
    ]
    cuts = [0]
    for i in range(2, W - 2):
        if s[i] <= max_valley and s[i] <= s[i - 1] and s[i] <= s[i + 1]:
            left = max(s[max(0, i - 20) : i]) if i else 0
            right = max(s[i + 1 : min(W, i + 21)])
            if left > max_valley + 3 and right > max_valley + 3 and i - cuts[-1] >= min_sep:
                cuts.append(i)
    cuts.append(W)
    regs = []
    for a, b in zip(cuts, cuts[1:]):
        xs = [x for x in range(a, b) if cols[x] > 0]
        if xs and xs[-1] - xs[0] + 1 >= min_w:
            regs.append((xs[0], xs[-1]))
    return regs


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*.png"):
        f.unlink()

    atlas: dict = {}

    title = knock_white(Image.open(SHEETS / "title-controls.png"))
    extract(title, (0, 0, 100, 79), "title-logo", atlas, "title-controls")
    extract(title, (98, 6, 194, 42), "sign-numpad", atlas, "title-controls")
    extract(title, (112, 40, 182, 78), "sign-fkeys", atlas, "title-controls")

    obj = knock_white(Image.open(SHEETS / "objects.png"))
    clear_sep_rows(obj)
    for name, box in [
        ("sign-freestyle", (130, 94, 172, 132)),
        ("sign-slalom", (172, 94, 214, 132)),
        ("sign-treeslalom", (214, 94, 258, 132)),
        ("sign-start", (258, 100, 302, 132)),
        ("sign-start-l", (0, 133, 44, 162)),
        ("sign-finish", (100, 133, 152, 162)),
        ("sign-finish-l", (152, 133, 204, 162)),
        ("tree", (0, 28, 30, 64)),
        ("tree-1", (279, 28, 311, 64)),
        ("tree-2", (309, 28, 337, 64)),
        ("rock", (28, 48, 54, 64)),
        ("jump", (160, 50, 250, 64)),
        ("lift-tower", (53, 0, 80, 64)),
        ("lift-chair", (80, 28, 112, 64)),
        ("stump", (250, 48, 280, 64)),
    ]:
        extract(obj, box, name, atlas, "objects")

    char = knock_white(Image.open(SHEETS / "characters.png"))
    clear_sep_rows(char)
    px = char.load()
    W, H = char.size
    for y in range(326, H):
        for x in range(W):
            px[x, y] = (0, 0, 0, 0)

    # Hardcoded column ranges — valley split is brittle if green baselines shift
    skier = [
        "skier-left-hard",
        "skier-left",
        "skier-down-left",
        "skier-down",
        "skier-jump",
        "skier-flip",
        "skier-down-right",
        "skier-right",
        "skier-right-hard",
        "skier-ouch",
    ]
    skier_xs = [
        (0, 22),
        (23, 46),
        (47, 64),
        (65, 82),
        (83, 115),
        (116, 147),
        (148, 175),
        (176, 209),
        (210, 239),
        (240, 272),
    ]
    for name, (x0, x1) in zip(skier, skier_xs):
        extract(char, (x0, 0, x1 + 1, 40), name, atlas, "characters")

    yeti = [
        "yeti-scare1",
        "yeti-scare2",
        "yeti-stand-l",
        "yeti-stand-r",
        "yeti-grab",
        "yeti-eat1",
        "yeti-eat2",
        "yeti-eat3",
        "yeti-pick",
    ]
    for i, (x0, x1) in enumerate(valley(char, 76, 105, 5, 4, 10, 0)[:9]):
        extract(char, (x0, 76, x1 + 1, 105), yeti[i], atlas, "characters")

    # Dog row (tight)
    for i, (x0, x1) in enumerate(valley(char, 163, 178, 3, 3, 8, 0)[:4]):
        extract(char, (x0, 163, x1 + 1, 178), "dog" if i == 0 else f"dog-{i}", atlas, "characters")

    # Convenience aliases as duplicate files
    for src, dst in [
        ("yeti-stand-r", "yeti-run1"),
        ("yeti-scare1", "yeti-run2"),
        ("yeti-stand-l", "yeti-walk1"),
        ("yeti-stand-r", "yeti-walk2"),
        ("skier-ouch", "skier-crash"),
        ("yeti-stand-r", "yeti"),
    ]:
        if src in atlas:
            shutil.copy(OUT / f"{src}.png", OUT / f"{dst}.png")
            atlas[dst] = dict(atlas[src])

    atlas["_aliases"] = {
        "skier-crash": "skier-ouch",
        "yeti": "yeti-stand-r",
        "yeti-walk": "yeti-stand-l",
        "yeti-eat": "yeti-eat2",
    }
    atlas["_sheets"] = {
        "title-controls": "sheets/title-controls.png",
        "characters": "sheets/characters.png",
        "objects": "sheets/objects.png",
    }

    for dst, src in [
        ("skier-down", "skier-down"),
        ("skier-left", "skier-left"),
        ("skier-right", "skier-right"),
        ("skier-crash", "skier-ouch"),
        ("dog", "dog"),
        ("tree", "tree"),
        ("rock", "rock"),
        ("yeti", "yeti-stand-r"),
        ("jump", "jump"),
    ]:
        shutil.copy(OUT / f"{src}.png", ROOT / f"{dst}.png")

    (ROOT / "atlas.json").write_text(json.dumps(atlas, indent=2))
    print("wrote", len([k for k in atlas if not k.startswith("_")]), "sprites")


if __name__ == "__main__":
    main()
