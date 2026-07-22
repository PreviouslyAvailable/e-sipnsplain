/**
 * Minesweeper homage — sprites from Chris's Entertainment Pack sheet
 * (assets/refs/minesweeper/minesweeper-sheet.png).
 *
 * Easy talk board: 16×16 / 10 mines. Clear the board → onWin().
 *
 * Easter egg: type `xyzzy` (classic) → top-left client pixel tells mine-under-cursor
 * (black = mine, white = safe). Type again to toggle off.
 */

const SHEET = "/assets/refs/minesweeper/minesweeper-sheet.png";
const REWARD = "/assets/minesweeper-reward.png";

const COLS = 16;
const ROWS = 16;
const MINES = 10;

const TILE = 8;
const DIGIT_W = 16;
const DIGIT_H = 16;
const FACE = 16;
/**
 * Display scale — 3 → 24px tiles (presentation-friendly).
 * CSS max-width/height on .w95-mine-canvas shrinks when the 16:9 stage is tight.
 */
const SCALE = 3;
/** Cool-face beat before the clear photo fills the board well. */
const REWARD_DELAY_MS = 480;

/** Sprite rects on the sheet: [sx, sy, sw, sh] */
const SPR = {
  digit: (n) => {
    const i = ((n % 10) + 10) % 10;
    const row = i < 5 ? 0 : 1;
    const col = i % 5;
    return [164 + col * 18, 16 + row * 18, DIGIT_W, DIGIT_H];
  },
  happy: [200, 64, FACE, FACE],
  ooh: [218, 64, FACE, FACE],
  dead: [236, 64, FACE, FACE],
  cool: [254, 64, FACE, FACE],
  raised: [200, 87, 7, 7],
  empty: [208, 86, TILE, TILE],
  mine: [217, 86, TILE, TILE],
  boom: [226, 86, TILE, TILE],
  flag: [235, 86, TILE, TILE],
  quest: [244, 86, TILE, TILE],
  wrong: [253, 86, TILE, TILE],
  num: (n) => {
    // 1–7 at 208 + (n-1)*9; 8 sits at 262 (sheet edge)
    const x = n === 8 ? 262 : 208 + (n - 1) * 9;
    return [x, 95, TILE, TILE];
  },
};

const PAD = 6;
const HEADER_H = FACE + 10;
const LED_GAP = 4;

const BOARD_W = COLS * TILE;
const BOARD_H = ROWS * TILE;
const INNER_W = Math.max(BOARD_W, FACE + 2 * (DIGIT_W * 3 + LED_GAP * 2) + 24);
const VIEW_W = (INNER_W + PAD * 2) * SCALE;
const VIEW_H = (HEADER_H + BOARD_H + PAD * 3) * SCALE;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ onWin?: () => void, onReward?: () => void, onFlag?: () => void }} opts
 */
export function createMinesweeper(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  canvas.width = VIEW_W;
  canvas.height = VIEW_H;
  ctx.imageSmoothingEnabled = false;

  /** @type {HTMLImageElement | null} */
  let sheet = null;
  /** @type {HTMLImageElement | null} */
  let rewardImg = null;
  let ready = false;
  /** Clear photo drawn inside the 16×16 board well (window size unchanged). */
  let rewardVisible = false;
  /** @type {ReturnType<typeof setTimeout> | null} */
  let rewardTimer = null;

  /** @type {'ready' | 'play' | 'won' | 'lost'} */
  let status = "ready";
  /** @type {'happy' | 'ooh' | 'dead' | 'cool'} */
  let face = "happy";

  /** @type {boolean[][]} */
  let mines = [];
  /** @type {number[][]} */
  let adj = [];
  /** @type {boolean[][]} */
  let revealed = [];
  /** @type {('none' | 'flag' | 'quest')[][]} */
  let marks = [];

  let flagsLeft = MINES;
  let timerSec = 0;
  let timerOn = false;
  /** @type {ReturnType<typeof setInterval> | null} */
  let timerId = null;
  let firstClick = true;
  let active = false;
  let pressTile = null;
  /** @type {{ r: number, c: number } | null} */
  let boomCell = null;
  let winFired = false;

  /** Classic WinMine `xyzzy` — pixel at (0,0) encodes mine under cursor. */
  let xyzzyOn = false;
  let xyzzyBuf = "";
  /** @type {{ r: number, c: number } | null} */
  let hoverCell = null;

  const boardOrigin = () => {
    const ox = PAD + Math.floor((INNER_W - BOARD_W) / 2);
    const oy = PAD * 2 + HEADER_H;
    return { ox, oy };
  };

  const faceRect = () => {
    const fx = PAD + Math.floor((INNER_W - FACE) / 2);
    const fy = PAD + Math.floor((HEADER_H - FACE) / 2);
    return { fx, fy };
  };

  const ledLeftOrigin = () => ({
    lx: PAD + 4,
    ly: PAD + Math.floor((HEADER_H - DIGIT_H) / 2),
  });

  const ledRightOrigin = () => ({
    rx: PAD + INNER_W - 4 - DIGIT_W * 3,
    ry: PAD + Math.floor((HEADER_H - DIGIT_H) / 2),
  });

  function emptyGrid(fill) {
    return Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => (typeof fill === "function" ? fill() : fill))
    );
  }

  function stopTimer() {
    if (timerId != null) {
      clearInterval(timerId);
      timerId = null;
    }
    timerOn = false;
  }

  function clearRewardTimer() {
    if (rewardTimer == null) return;
    clearTimeout(rewardTimer);
    rewardTimer = null;
  }

  function scheduleRewardReveal() {
    clearRewardTimer();
    rewardTimer = setTimeout(() => {
      rewardTimer = null;
      rewardVisible = true;
      draw();
      opts.onReward?.();
    }, REWARD_DELAY_MS);
  }

  /** object-fit: cover into the board well (logical → canvas px via SCALE). */
  function drawRewardInBoard() {
    if (!rewardImg || !rewardImg.naturalWidth) return;
    const { ox, oy } = boardOrigin();
    const dx = ox * SCALE;
    const dy = oy * SCALE;
    const dw = BOARD_W * SCALE;
    const dh = BOARD_H * SCALE;
    const iw = rewardImg.naturalWidth;
    const ih = rewardImg.naturalHeight;
    const cover = Math.max(dw / iw, dh / ih);
    const sw = dw / cover;
    const sh = dh / cover;
    const sx = (iw - sw) / 2;
    const sy = (ih - sh) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(rewardImg, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.imageSmoothingEnabled = false;
  }

  function startTimer() {
    if (timerOn) return;
    timerOn = true;
    timerId = setInterval(() => {
      if (status !== "play") return;
      timerSec = clamp(timerSec + 1, 0, 999);
      draw();
    }, 1000);
  }

  function resetBoard() {
    stopTimer();
    clearRewardTimer();
    rewardVisible = false;
    status = "ready";
    face = "happy";
    mines = emptyGrid(false);
    adj = emptyGrid(0);
    revealed = emptyGrid(false);
    marks = emptyGrid(() => "none");
    flagsLeft = MINES;
    timerSec = 0;
    firstClick = true;
    pressTile = null;
    boomCell = null;
    winFired = false;
    hoverCell = null;
    // Keep xyzzyOn across resets (classic stayed on for the session)
    draw();
  }

  function neighbors(r, c) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr;
        const cc = c + dc;
        if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS) out.push([rr, cc]);
      }
    }
    return out;
  }

  function placeMines(safeR, safeC) {
    const banned = new Set(
      [[safeR, safeC], ...neighbors(safeR, safeC)].map(([r, c]) => `${r},${c}`)
    );
    const slots = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!banned.has(`${r},${c}`)) slots.push([r, c]);
      }
    }
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    mines = emptyGrid(false);
    const n = Math.min(MINES, slots.length);
    for (let i = 0; i < n; i++) {
      const [r, c] = slots[i];
      mines[r][c] = true;
    }
    adj = emptyGrid(0);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (mines[r][c]) continue;
        adj[r][c] = neighbors(r, c).reduce((s, [rr, cc]) => s + (mines[rr][cc] ? 1 : 0), 0);
      }
    }
  }

  function countFlags() {
    let n = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (marks[r][c] === "flag") n++;
      }
    }
    flagsLeft = MINES - n;
  }

  function floodReveal(r, c) {
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop();
      if (cr < 0 || cc < 0 || cr >= ROWS || cc >= COLS) continue;
      if (revealed[cr][cc] || marks[cr][cc] === "flag") continue;
      revealed[cr][cc] = true;
      if (mines[cr][cc]) continue;
      if (adj[cr][cc] === 0) {
        for (const [nr, nc] of neighbors(cr, cc)) {
          if (!revealed[nr][nc]) stack.push([nr, nc]);
        }
      }
    }
  }

  function checkWin() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!mines[r][c] && !revealed[r][c]) return false;
      }
    }
    return true;
  }

  function loseAt(r, c) {
    status = "lost";
    face = "dead";
    boomCell = { r, c };
    stopTimer();
    revealed[r][c] = true;
    for (let rr = 0; rr < ROWS; rr++) {
      for (let cc = 0; cc < COLS; cc++) {
        if (mines[rr][cc]) revealed[rr][cc] = true;
      }
    }
    draw();
  }

  function winGame() {
    status = "won";
    face = "cool";
    stopTimer();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (mines[r][c] && marks[r][c] !== "flag") marks[r][c] = "flag";
        if (!mines[r][c]) revealed[r][c] = true;
      }
    }
    countFlags();
    draw();
    if (!winFired) {
      winFired = true;
      opts.onWin?.();
      scheduleRewardReveal();
    }
  }

  /** Presenter / test helper — clear board and fire reward. */
  function forceWin() {
    if (firstClick) {
      placeMines(0, 0);
      firstClick = false;
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!mines[r][c]) revealed[r][c] = true;
      }
    }
    winGame();
  }

  function revealCell(r, c) {
    if (status === "won" || status === "lost") return;
    if (marks[r][c] === "flag") return;
    if (revealed[r][c]) return;

    if (firstClick) {
      placeMines(r, c);
      firstClick = false;
      status = "play";
      startTimer();
    }

    if (mines[r][c]) {
      loseAt(r, c);
      return;
    }

    floodReveal(r, c);
    if (checkWin()) winGame();
    else {
      face = "happy";
      draw();
    }
  }

  function cycleMark(r, c) {
    if (status === "won" || status === "lost") return;
    if (revealed[r][c]) return;
    const cur = marks[r][c];
    marks[r][c] = cur === "none" ? "flag" : cur === "flag" ? "quest" : "none";
    if (marks[r][c] === "flag") opts.onFlag?.();
    countFlags();
    draw();
  }

  function blit(sx, sy, sw, sh, dx, dy, dw = sw, dh = sh) {
    if (!sheet) return;
    ctx.drawImage(
      sheet,
      sx,
      sy,
      sw,
      sh,
      Math.round(dx * SCALE),
      Math.round(dy * SCALE),
      Math.round(dw * SCALE),
      Math.round(dh * SCALE)
    );
  }

  function drawDigitTriplet(value, x, y) {
    const v = clamp(Math.abs(value) | 0, 0, 999);
    const s = String(v).padStart(3, "0");
    for (let i = 0; i < 3; i++) {
      const [sx, sy, sw, sh] = SPR.digit(Number(s[i]));
      blit(sx, sy, sw, sh, x + i * DIGIT_W, y);
    }
  }

  function tileSprite(r, c) {
    const isMine = mines[r][c];
    const mark = marks[r][c];
    const show = revealed[r][c];

    if (status === "lost") {
      if (boomCell && boomCell.r === r && boomCell.c === c) return SPR.boom;
      if (!isMine && mark === "flag") return SPR.wrong;
      if (isMine && mark === "flag") return SPR.flag;
      if (isMine) return SPR.mine;
    }

    if (!show) {
      if (mark === "flag") return SPR.flag;
      if (mark === "quest") return SPR.quest;
      if (
        pressTile &&
        pressTile.r === r &&
        pressTile.c === c &&
        status !== "lost" &&
        status !== "won"
      ) {
        return SPR.empty;
      }
      return SPR.raised;
    }

    if (isMine) {
      if (pressTile && pressTile.r === r && pressTile.c === c) return SPR.boom;
      return SPR.mine;
    }
    if (adj[r][c] > 0) return SPR.num(adj[r][c]);
    return SPR.empty;
  }

  function drawChrome() {
    // Classic grey client with sunken wells
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // Outer raised bevel (in CSS pixels already scaled via fill on canvas)
    const inset = (x, y, w, h, up) => {
      ctx.fillStyle = up ? "#ffffff" : "#808080";
      ctx.fillRect(x * SCALE, y * SCALE, w * SCALE, 1 * SCALE);
      ctx.fillRect(x * SCALE, y * SCALE, 1 * SCALE, h * SCALE);
      ctx.fillStyle = up ? "#808080" : "#ffffff";
      ctx.fillRect(x * SCALE, (y + h - 1) * SCALE, w * SCALE, 1 * SCALE);
      ctx.fillRect((x + w - 1) * SCALE, y * SCALE, 1 * SCALE, h * SCALE);
    };

    inset(2, 2, INNER_W + PAD * 2 - 4, HEADER_H + BOARD_H + PAD * 2 - 2, false);

    // LED wells
    const { lx, ly } = ledLeftOrigin();
    const { rx, ry } = ledRightOrigin();
    const well = (x, y, w, h) => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(x * SCALE, y * SCALE, w * SCALE, h * SCALE);
      inset(x - 1, y - 1, w + 2, h + 2, false);
    };
    well(lx - 1, ly - 1, DIGIT_W * 3 + 2, DIGIT_H + 2);
    well(rx - 1, ry - 1, DIGIT_W * 3 + 2, DIGIT_H + 2);

    // Board well
    const { ox, oy } = boardOrigin();
    inset(ox - 2, oy - 2, BOARD_W + 4, BOARD_H + 4, false);
    ctx.fillStyle = "#808080";
    ctx.fillRect((ox - 1) * SCALE, (oy - 1) * SCALE, (BOARD_W + 2) * SCALE, (BOARD_H + 2) * SCALE);
  }

  function draw() {
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    drawChrome();

    if (!ready || !sheet) {
      ctx.fillStyle = "#000";
      ctx.font = `${10 * SCALE}px monospace`;
      ctx.fillText("Loading…", 12 * SCALE, 24 * SCALE);
      return;
    }

    const { lx, ly } = ledLeftOrigin();
    const { rx, ry } = ledRightOrigin();
    drawDigitTriplet(flagsLeft, lx, ly);
    drawDigitTriplet(timerSec, rx, ry);

    const { fx, fy } = faceRect();
    const faceKey = face === "ooh" ? "ooh" : face;
    const [fsx, fsy, fsw, fsh] = SPR[faceKey];
    // Face button raised bevel
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect((fx - 1) * SCALE, (fy - 1) * SCALE, (FACE + 2) * SCALE, (FACE + 2) * SCALE);
    blit(fsx, fsy, fsw, fsh, fx, fy, FACE, FACE);

    const { ox, oy } = boardOrigin();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const [sx, sy, sw, sh] = tileSprite(r, c);
        blit(sx, sy, sw, sh, ox + c * TILE, oy + r * TILE, TILE, TILE);
      }
    }

    // Clear reward fills the board well only — Minesweeper chrome stays put.
    if (rewardVisible) drawRewardInBoard();

    // Classic xyzzy: 1×1 top-left pixel — black if mine under cursor, white if safe.
    if (xyzzyOn) {
      let isMine = false;
      if (hoverCell && !firstClick && mines[hoverCell.r]?.[hoverCell.c]) {
        isMine = true;
      }
      ctx.fillStyle = isMine ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, 1, 1);
    }
  }

  function feedXyzzy(e) {
    if (!active) return false;
    if (e.metaKey || e.ctrlKey || e.altKey) return false;
    if (e.key.length !== 1) return false;
    const ch = e.key.toLowerCase();
    if (!/[a-z]/.test(ch)) return false;

    const next = xyzzyBuf + ch;
    if ("xyzzy".startsWith(next)) {
      xyzzyBuf = next;
      if (xyzzyBuf === "xyzzy") {
        xyzzyBuf = "";
        xyzzyOn = !xyzzyOn;
        draw();
      }
      return true;
    }
    if ("xyzzy".startsWith(ch)) xyzzyBuf = ch;
    else xyzzyBuf = "";
    return false;
  }

  /**
   * Deck/window key hook — xyzzy while Mine is open (canvas need not be focused).
   */
  function handleDeckKey(e) {
    if (!active) return false;
    return feedXyzzy(e);
  }

  function canvasToCell(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * VIEW_W / SCALE;
    const y = ((clientY - rect.top) / rect.height) * VIEW_H / SCALE;
    const { fx, fy } = faceRect();
    if (x >= fx && x < fx + FACE && y >= fy && y < fy + FACE) {
      return { kind: "face" };
    }
    const { ox, oy } = boardOrigin();
    const c = Math.floor((x - ox) / TILE);
    const r = Math.floor((y - oy) / TILE);
    if (r >= 0 && c >= 0 && r < ROWS && c < COLS) return { kind: "tile", r, c };
    return { kind: "none" };
  }

  function onPointerDown(e) {
    if (!active) return;
    if (e.button === 2) {
      e.preventDefault();
      const hit = canvasToCell(e.clientX, e.clientY);
      if (hit.kind === "tile") cycleMark(hit.r, hit.c);
      return;
    }
    if (e.button !== 0) return;
    const hit = canvasToCell(e.clientX, e.clientY);
    if (hit.kind === "face") {
      resetBoard();
      return;
    }
    if (hit.kind === "tile" && status !== "won" && status !== "lost") {
      if (marks[hit.r][hit.c] === "flag") return;
      pressTile = { r: hit.r, c: hit.c };
      face = "ooh";
      draw();
    }
  }

  function onPointerUp(e) {
    if (!active) return;
    if (e.button !== 0) return;
    const hit = canvasToCell(e.clientX, e.clientY);
    const was = pressTile;
    pressTile = null;
    if (was && hit.kind === "tile" && hit.r === was.r && hit.c === was.c) {
      revealCell(hit.r, hit.c);
    } else if (status === "play" || status === "ready") {
      face = status === "won" ? "cool" : status === "lost" ? "dead" : "happy";
      draw();
    }
  }

  function onPointerLeave() {
    if (hoverCell) {
      hoverCell = null;
      if (xyzzyOn) draw();
    }
    if (!pressTile) return;
    pressTile = null;
    if (status === "play" || status === "ready") {
      face = "happy";
      draw();
    }
  }

  function onPointerMove(e) {
    if (!active) return;
    const hit = canvasToCell(e.clientX, e.clientY);
    const next =
      hit.kind === "tile" ? { r: hit.r, c: hit.c } : null;
    const changed =
      (hoverCell?.r ?? null) !== (next?.r ?? null) ||
      (hoverCell?.c ?? null) !== (next?.c ?? null);
    hoverCell = next;
    if (xyzzyOn && changed) draw();
  }

  function onContextMenu(e) {
    e.preventDefault();
  }

  function bind() {
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);
    canvas.addEventListener("contextmenu", onContextMenu);
  }

  function unbind() {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("pointercancel", onPointerLeave);
    canvas.removeEventListener("contextmenu", onContextMenu);
  }

  async function ensureAssets() {
    if (ready) return;
    const [s, r] = await Promise.all([loadImage(SHEET), loadImage(REWARD)]);
    sheet = s;
    rewardImg = r;
    ready = Boolean(sheet);
    draw();
  }

  function start() {
    active = true;
    bind();
    ensureAssets().then(() => {
      if (status === "ready" && firstClick) resetBoard();
      else draw();
    });
    requestAnimationFrame(() => canvas.focus({ preventScroll: true }));
  }

  function stop() {
    active = false;
    unbind();
    pressTile = null;
    hoverCell = null;
    xyzzyBuf = "";
  }

  function destroy() {
    stop();
    stopTimer();
    clearRewardTimer();
  }

  resetBoard();

  return {
    start,
    stop,
    destroy,
    reset: resetBoard,
    forceWin,
    handleDeckKey,
    get status() {
      return status;
    },
    get xyzzyOn() {
      return xyzzyOn;
    },
    COLS,
    ROWS,
    MINES,
  };
}
