#!/usr/bin/env python3
"""Convert curated win95-winxp_icons-master ICOs → assets/icons PNGs."""

from pathlib import Path

from PIL import Image, IcoImagePlugin

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "win95-winxp_icons-master" / "icons"
OUT = ROOT / "assets" / "icons"

# (out_rel, src_ico, size)
MAP = [
    ("w95/my-computer.png", "w95_16.ico", 32),
    ("w95/recycle-empty.png", "w95_32.ico", 32),
    ("w95/recycle-full.png", "w95_33.ico", 32),
    ("w95/internet.png", "w95_14.ico", 32),
    ("w95/notepad-txt.png", "w98_notepad_file.ico", 32),
    ("w95/start-paint.png", "w98_paint.ico", 16),
    ("w95/start-games.png", "w98_joystick.ico", 16),
    ("w95/start-minesweeper.png", "w98_minesweeper.ico", 16),
    ("w95/start-update.png", "w98_windows_update_small.ico", 16),
    ("w95/start-shutdown.png", "w98_shut_down_normal.ico", 16),
    ("w95/tray-update.png", "w98_windows_update_small.ico", 16),
    ("w95/paint-app.png", "w98_paint.ico", 16),
    ("w98/computer.png", "w98_computer.ico", 32),
    ("w98/network.png", "w98_network_normal_two_pcs.ico", 32),
    ("w98/recycle-empty.png", "w98_recycle_bin_empty.ico", 32),
    ("w98/control-panel.png", "w98_directory_control_panel.ico", 32),
    ("w98/floppy.png", "w98_floppy_drive_3-5.ico", 32),
    ("w98/start-games.png", "w98_joystick.ico", 16),
    ("w98/start-settings.png", "w98_settings_gear.ico", 16),
    ("w98/start-themes.png", "w98_themes.ico", 16),
    ("w98/start-update.png", "w98_windows_update_small.ico", 16),
    ("w98/start-continue.png", "w98_directory_open_file_mydocs.ico", 16),
    ("w98/tray-update.png", "w98_windows_update_small.ico", 16),
    ("wxp/my-computer.png", "wxp_16.ico", 32),
    ("wxp/recycle-empty.png", "wxp_32.ico", 32),
    ("wxp/recycle-full.png", "wxp_33.ico", 32),
]


def extract(path: Path, size: int) -> Image.Image:
    with open(path, "rb") as f:
        ico = IcoImagePlugin.IcoFile(f)
        avail = sorted(
            ico.sizes(),
            key=lambda s: (abs(s[0] - size) + abs(s[1] - size), -s[0] * s[1]),
        )
        frame = ico.getimage(avail[0]).convert("RGBA")
    if frame.size != (size, size):
        frame = frame.resize((size, size), Image.Resampling.NEAREST)
    return frame


def main() -> None:
    missing = []
    for out_rel, src, size in MAP:
        src_path = SRC / src
        if not src_path.exists():
            missing.append(src)
            continue
        out_path = OUT / out_rel
        out_path.parent.mkdir(parents=True, exist_ok=True)
        extract(src_path, size).save(out_path)
        print(f"OK {out_rel}")
    if missing:
        raise SystemExit(f"Missing sources: {missing}")


if __name__ == "__main__":
    main()
