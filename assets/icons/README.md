# Desktop icons (Win95 / 98 / XP)

Curated PNGs converted from [`win95-winxp_icons-master`](../../win95-winxp_icons-master/) (trapd00r default shell icons).

| Path | Source ICO |
|------|------------|
| `w95/my-computer.png` | `w95_16.ico` |
| `w95/recycle-empty.png` / `recycle-full.png` | `w95_32.ico` / `w95_33.ico` |
| `w95/internet.png` | `w95_14.ico` |
| `w95/notepad-txt.png` | `w98_notepad_file.ico` |
| `w95/start-*.png` / `tray-update.png` / `paint-app.png` | w98 paint / joystick / minesweeper / update / shut_down |
| `w98/computer.png` | `w98_computer.ico` |
| `w98/network.png` | `w98_network_normal_two_pcs.ico` |
| `w98/recycle-empty.png` | `w98_recycle_bin_empty.ico` |
| `w98/control-panel.png` | `w98_directory_control_panel.ico` |
| `w98/floppy.png` | `w98_floppy_drive_3-5.ico` |
| `w98/cd-drive.png` | `w98_cd_drive.ico` |
| `w98/start-*.png` / `tray-update.png` | joystick / settings / themes / update / mydocs |
| `wxp/my-computer.png` | `wxp_16.ico` |
| `wxp/recycle-*.png` | `wxp_32.ico` / `wxp_33.ico` |
| `wxp/my-pictures.png` | Hand-drawn XP My Pictures–style folder (also `assets/winxp-ui/icons/`) |
| `wxp/start-flag*.png` | `wxp_239.ico` |

| `w98/pinball.png` / `start-pinball.png` | Cleaned Space Cadet splash (ship crop) |
| `w98/ski.png` / `start-ski.png` | Classic SkiFree face icon |

Re-export shell icons:

```bash
python3 scripts/export-shell-icons.py
```

Desktop boot-disk photo remains `assets/win95/windows-98se-boot-disk.png` (not a shell floppy).
