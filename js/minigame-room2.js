/* ===================================================
   ROOM 2 MINI-GAME: SNAKES AND LADDERS
   Genre: Coastal Boardwalk Snakes & Ladders
   Theme: Nobar Pantai, DM Pertama, & Meme Kucing Nidan-Jinan
   Player Two, Forever 💖
=================================================== */

import { SoundEngine } from './sound.js';
import { drawGirlfriendPixelChar, drawPixelCat, drawPixelFlower, drawDriftingPetals, drawFloatingCatEmote, wrapCanvasText } from './characters.js';

// Classic Board Layout (10x10, squares 1-100)
// Designed for a smooth, rewarding journey without punishing setbacks!
const SNAKES = {
  16: 8,
  47: 34,
  62: 44,
  87: 68,
  98: 86, // Gentle slip near finish, never drops player too far!
};

const LADDERS = {
  4: 16,
  9: 31,
  20: 38,
  28: 84, // Big romantic leap!
  40: 64,
  51: 76,
  71: 91, // Express ladder to the 90s!
};

// Cat meme special squares (Give fun meme dialog + forward boosts!)
const CAT_SQUARES = [7, 23, 38, 55, 72, 88];

// State
let mg2Canvas = null;
let mg2Ctx = null;
let mg2AnimId = null;
let mg2T = 0;
let mg2Phase = 'playing'; // 'playing' | 'rolling' | 'won'
let mg2PlayerPos = 1;
let mg2DiceValue = 1;
let mg2BidakX = 0;
let mg2BidakY = 0;
let mg2Moving = false;
let mg2MovePath = [];
let mg2DiceRolling = false;
let mg2DiceAnim = 0;
let mg2OnComplete = null;
let mg2Message = 'Lempar dadumu untuk melangkah di pantai kenangan!';
let mg2LastRollTime = 0;
let mg2CatCheer = null;
let mg2CatMood = 'wave'; // 'wave' | 'happy' | 'dance' | 'shocked' | 'muntah'
let mg2CatEmote = null; // { text, x, y, timer }

const CAT_MEME_QUOTES = [
  '🐱 Kucing pose muntah pelangi! Jinan ngakak mwehehe! (+2 langkah)',
  '🐱 Kucing joget absurd saat video call larut malam! (+2 langkah)',
  '🐱 Kucing loaf santai di bawah pohon kelapa pantai! (+2 langkah)',
  '🐱 Meme kucing favorit Jinan muncul! Semangat Nidanku sayang! (+2 langkah)'
];

// Board Dimensions — Left Half of 800x450 Canvas (Vertically centered at Y: 44)
const BOARD_X = 28;
const BOARD_Y = 44;
const CELL_SIZE = 36;
const COLS_B = 10;
const BOARD_SIZE = CELL_SIZE * COLS_B; // 360px

// Right Console Dimensions (X: 410 to 774, Y: 44, H: 360)
const CONSOLE_X = 410;
const CONSOLE_Y = 44;
const CONSOLE_W = 364;
const CONSOLE_H = 360;

function getSquareCoords(square) {
  if (square < 1) square = 1;
  if (square > 100) square = 100;
  const idx = square - 1;
  const row = Math.floor(idx / COLS_B); // 0 = bottom row
  const col = idx % COLS_B;
  const actualCol = row % 2 === 0 ? col : COLS_B - 1 - col;
  const boardRow = COLS_B - 1 - row;
  return {
    x: BOARD_X + actualCol * CELL_SIZE + CELL_SIZE / 2,
    y: BOARD_Y + boardRow * CELL_SIZE + CELL_SIZE / 2,
  };
}

function drawBoard(c) {
  // Driftwood Boardwalk Outer Frame
  c.fillStyle = '#78350f';
  c.beginPath();
  c.roundRect(BOARD_X - 6, BOARD_Y - 6, BOARD_SIZE + 12, BOARD_SIZE + 12, 12);
  c.fill();
  c.strokeStyle = '#b45309';
  c.lineWidth = 2.5;
  c.stroke();

  // Sandy Boardwalk inner base
  c.fillStyle = '#fef3c7';
  c.fillRect(BOARD_X - 2, BOARD_Y - 2, BOARD_SIZE + 4, BOARD_SIZE + 4);

  // Draw 100 Cells
  for (let sq = 1; sq <= 100; sq++) {
    const idx = sq - 1;
    const row = Math.floor(idx / COLS_B);
    const col = idx % COLS_B;
    const actualCol = row % 2 === 0 ? col : COLS_B - 1 - col;
    const boardRow = COLS_B - 1 - row;
    const x = BOARD_X + actualCol * CELL_SIZE;
    const y = BOARD_Y + boardRow * CELL_SIZE;

    // Palette: Soft coastal & pastel beach tiles
    let cellColor;
    if (sq === 100) {
      cellColor = '#fef08a'; // Golden Gazebo
    } else if (sq === 1) {
      cellColor = '#dbeafe'; // Sky blue start
    } else if (LADDERS[sq]) {
      cellColor = '#dcfce7'; // Fresh green ladder start
    } else if (SNAKES[sq]) {
      cellColor = '#fee2e2'; // Soft coral red
    } else if (CAT_SQUARES.includes(sq)) {
      cellColor = '#fef3c7'; // Sunny yellow meme cat
    } else {
      cellColor = (row + col) % 2 === 0 ? '#f0f9ff' : '#e0f2fe';
    }

    c.fillStyle = cellColor;
    c.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    c.strokeStyle = 'rgba(186, 230, 253, 0.7)';
    c.lineWidth = 1;
    c.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

    // Tile Number
    c.font = 'bold 5.5px "Press Start 2P", monospace';
    c.fillStyle = '#64748b';
    c.textAlign = 'left';
    c.fillText(sq, x + 3, y + 9);

    // Tile Decorative Icons
    if (CAT_SQUARES.includes(sq)) {
      const catMemeIcons = {
        7: '🤮',   // muntah pelangi
        23: '🕺',  // joget absurd
        38: '🍞',  // loaf santai
        55: '😳',  // shy / salting
        72: '😻',  // happy / purr
        88: '🙀'   // shocked / popcat
      };
      c.font = '12px serif';
      c.textAlign = 'center';
      c.fillText(catMemeIcons[sq] || '🐱', x + CELL_SIZE / 2, y + CELL_SIZE - 4);
    } else if (sq === 100) {
      c.font = '12px serif';
      c.textAlign = 'center';
      c.fillText('🏖️', x + CELL_SIZE / 2, y + CELL_SIZE - 5);
    } else if (sq === 1) {
      c.font = '10px serif';
      c.textAlign = 'center';
      c.fillText('⭐', x + CELL_SIZE / 2, y + CELL_SIZE - 4);
    }
  }

  // Draw Ladders (Sturdy Bamboo Bridges with Ivy)
  Object.entries(LADDERS).forEach(([from, to]) => {
    const f = getSquareCoords(parseInt(from));
    const t2 = getSquareCoords(parseInt(to));

    c.strokeStyle = '#15803d';
    c.lineWidth = 3.5;
    c.beginPath();
    c.moveTo(f.x, f.y);
    c.lineTo(t2.x, t2.y);
    c.stroke();

    // Rungs
    c.strokeStyle = '#4ade80';
    c.lineWidth = 2;
    const dx = t2.x - f.x;
    const dy = t2.y - f.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = (-dy / len) * 4.5;
    const ny = (dx / len) * 4.5;
    for (let r = 0.15; r <= 0.85; r += 0.18) {
      c.beginPath();
      c.moveTo(f.x + dx * r + nx, f.y + dy * r + ny);
      c.lineTo(f.x + dx * r - nx, f.y + dy * r - ny);
      c.stroke();
    }
    c.font = '10px serif';
    c.textAlign = 'center';
    c.fillText('🪜', t2.x, t2.y - 2);
  });

  // Draw Snakes (Gentle Coral Vine Slides)
  Object.entries(SNAKES).forEach(([from, to]) => {
    const f = getSquareCoords(parseInt(from));
    const t2 = getSquareCoords(parseInt(to));

    c.strokeStyle = '#f43f5e';
    c.lineWidth = 3.2;
    c.beginPath();
    c.moveTo(f.x, f.y);
    c.bezierCurveTo(
      f.x + (t2.x - f.x) * 0.4 + 16, f.y - 8,
      t2.x + 16, f.y + (t2.y - f.y) * 0.6,
      t2.x, t2.y
    );
    c.stroke();

    c.font = '11px serif';
    c.textAlign = 'center';
    c.fillText('🐍', f.x, f.y - 2);
  });
}

function drawBidak(c, x, y, t) {
  // Player Bidak: Nidan (Blue Hoodie Student)
  // Calm & purposeful animation: only hops while moving, stays steady when idle!
  const bounce = mg2Moving ? Math.sin(t * 0.25) * 4 : 0;

  // Drop shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.35)';
  c.beginPath();
  c.ellipse(x, y + 10, 8, 3, 0, 0, Math.PI * 2);
  c.fill();

  // Blue hoodie body
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.roundRect(x - 7, y - 10 + bounce, 14, 16, 4);
  c.fill();
  c.strokeStyle = '#38bdf8';
  c.lineWidth = 1;
  c.stroke();

  // Head
  c.fillStyle = '#fde68a';
  c.beginPath();
  c.arc(x, y - 16 + bounce, 6.5, 0, Math.PI * 2);
  c.fill();

  // Blue Hoodie rim
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.arc(x, y - 18 + bounce, 7, Math.PI * 0.9, Math.PI * 2.1);
  c.fill();

  // Face eyes
  c.fillStyle = '#1e293b';
  c.beginPath();
  c.arc(x - 2, y - 16 + bounce, 1.2, 0, Math.PI * 2);
  c.arc(x + 2, y - 16 + bounce, 1.2, 0, Math.PI * 2);
  c.fill();

  // Crown Star
  c.font = '8px serif';
  c.textAlign = 'center';
  c.fillText('⭐', x, y - 25 + bounce);
}

function drawInteractiveConsole(c, t) {
  // Coastal Cabana Console Base
  c.fillStyle = 'rgba(255, 255, 255, 0.94)';
  c.beginPath();
  c.roundRect(CONSOLE_X, CONSOLE_Y, CONSOLE_W, CONSOLE_H, 12);
  c.fill();
  c.strokeStyle = '#7dd3fc';
  c.lineWidth = 1.8;
  c.stroke();

  // Bamboo header
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.roundRect(CONSOLE_X, CONSOLE_Y, CONSOLE_W, 34, [12, 12, 0, 0]);
  c.fill();

  c.font = 'bold 8px "Press Start 2P", monospace';
  c.fillStyle = '#ffffff';
  c.textAlign = 'center';
  c.fillText('KONSOL DADU & MEME PANTAI', CONSOLE_X + CONSOLE_W / 2, CONSOLE_Y + 22);

  // 1. Jinan Companion Cheering Booth (Top)
  c.fillStyle = '#f0fdf4';
  c.beginPath();
  c.roundRect(CONSOLE_X + 12, CONSOLE_Y + 44, CONSOLE_W - 24, 76, 8);
  c.fill();
  c.strokeStyle = '#86efac';
  c.lineWidth = 1.2;
  c.stroke();

  // Jinan companion sprite waving
  drawGirlfriendPixelChar(c, CONSOLE_X + 26, CONSOLE_Y + 54, false, 'wave', t, 'heart');

  // Adorable Companion Meme Cat sitting beside Jinan in the booth!
  drawPixelCat(c, CONSOLE_X + 54, CONSOLE_Y + 70, mg2CatMood, t);

  if (mg2CatEmote && mg2CatEmote.timer > 0) {
    drawFloatingCatEmote(c, mg2CatEmote.x, mg2CatEmote.y, mg2CatEmote.text, t, mg2CatEmote.timer / 25);
    mg2CatEmote.timer--;
    if (mg2CatEmote.timer === 0 && mg2Phase === 'playing') {
      mg2CatMood = 'wave';
    }
  }

  // Cheering text bubble with safe text wrapping
  c.font = 'bold 6.5px "Press Start 2P", monospace';
  c.fillStyle = '#be185d';
  c.textAlign = 'left';
  c.fillText('JINAN MENDUKUNGMU:', CONSOLE_X + 78, CONSOLE_Y + 62);
  c.font = '11px "Plus Jakarta Sans", -apple-system, sans-serif';
  c.fillStyle = '#374151';
  c.fillText(`Nidan sekarang di Petak ${mg2PlayerPos} / 100!`, CONSOLE_X + 78, CONSOLE_Y + 80);

  // Wrapped subtext
  const remaining = 100 - mg2PlayerPos;
  const remainText = remaining > 0 ? `Tinggal ${remaining} petak lagi menuju gazebo pantai! ♡` : 'Gazebo tercapai! Kamu hebat banget, Sayang!';
  c.font = '10px "Plus Jakarta Sans", -apple-system, sans-serif';
  c.fillStyle = '#64748b';
  const remainLines = wrapCanvasText(c, remainText, CONSOLE_W - 95);
  remainLines.forEach((rline, rIdx) => {
    c.fillText(rline, CONSOLE_X + 78, CONSOLE_Y + 96 + rIdx * 13);
  });

  // 2. Center Dice Stadium & Roll Button
  const diceCenterX = CONSOLE_X + CONSOLE_W / 2;
  const diceCenterY = CONSOLE_Y + 185;
  const diceSize = 64;

  // Woven Straw Dice Stadium Pad
  c.fillStyle = '#fef3c7';
  c.beginPath();
  c.arc(diceCenterX, diceCenterY, 52, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#fcd34d';
  c.lineWidth = 2;
  c.stroke();

  // Draw 3D Dice
  draw3DDice(c, diceCenterX - diceSize / 2, diceCenterY - diceSize / 2, diceSize, t);

  // Big Roll Button below dice
  const btnX = CONSOLE_X + 40;
  const btnY = CONSOLE_Y + 252;
  const btnW = CONSOLE_W - 80;
  const btnH = 42;

  const isInteractive = mg2Phase === 'playing' && !mg2Moving && !mg2DiceRolling;
  const pulse = isInteractive ? Math.sin(t * 0.1) * 1.5 : 0;

  c.fillStyle = isInteractive ? '#0284c7' : '#94a3b8';
  c.beginPath();
  c.roundRect(btnX - pulse / 2, btnY - pulse / 2, btnW + pulse, btnH + pulse, 8);
  c.fill();
  c.strokeStyle = isInteractive ? '#fef08a' : '#cbd5e1';
  c.lineWidth = 2;
  c.stroke();

  c.font = 'bold 8.5px "Press Start 2P", monospace';
  c.fillStyle = '#ffffff';
  c.textAlign = 'center';
  c.fillText(mg2DiceRolling ? '🎲 MENGOCOK DADU...' : '🎲 LEMPAR DADU', diceCenterX, btnY + 26);

  // 3. Message / Log Box
  c.fillStyle = '#f8fafc';
  c.beginPath();
  c.roundRect(CONSOLE_X + 12, CONSOLE_Y + 304, CONSOLE_W - 24, 46, 6);
  c.fill();
  c.strokeStyle = '#e2e8f0';
  c.lineWidth = 1;
  c.stroke();

  c.font = '6.5px "Press Start 2P", monospace';
  c.fillStyle = '#0284c7';
  c.textAlign = 'left';
  c.fillText('CATATAN LANGKAH:', CONSOLE_X + 20, CONSOLE_Y + 318);
  c.font = '10px "Plus Jakarta Sans", -apple-system, sans-serif';
  c.fillStyle = '#1e293b';
  const logLines = wrapCanvasText(c, mg2Message, CONSOLE_W - 40);
  logLines.slice(0, 2).forEach((ll, li) => {
    c.fillText(ll, CONSOLE_X + 20, CONSOLE_Y + 332 + li * 13);
  });
}

function draw3DDice(c, x, y, size, t) {
  // Dice Shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.22)';
  c.beginPath();
  c.roundRect(x + 4, y + 6, size, size, 12);
  c.fill();

  // Dice Body (Cream-White Ivory)
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(x, y, size, size, 12);
  c.fill();
  c.strokeStyle = '#0284c7';
  c.lineWidth = 2.5;
  c.stroke();

  const displayVal = mg2DiceRolling ? Math.ceil(Math.random() * 6) : mg2DiceValue;

  const dotPatterns = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.26, 0.26], [0.74, 0.26], [0.5, 0.5], [0.26, 0.74], [0.74, 0.74]],
    6: [[0.28, 0.22], [0.72, 0.22], [0.28, 0.5], [0.72, 0.5], [0.28, 0.78], [0.72, 0.78]],
  };

  const dots = dotPatterns[displayVal || 1] || dotPatterns[1];
  dots.forEach(([rx, ry]) => {
    // Red dot for 1, Oceanic Blue for others
    c.fillStyle = displayVal === 1 ? '#e11d48' : '#0369a1';
    c.beginPath();
    c.arc(x + rx * size, y + ry * size, displayVal === 1 ? 6.5 : 4.5, 0, Math.PI * 2);
    c.fill();
  });
}

function mg2DrawWon(c, cw, ch) {
  const grad = c.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#0c4a6e');
  grad.addColorStop(1, '#0284c7');
  c.fillStyle = grad;
  c.fillRect(0, 0, cw, ch);

  for (let i = 0; i < 18; i++) {
    const sx = (i * 89 + mg2T * 2) % cw;
    const sy = (i * 47) % ch;
    c.fillStyle = i % 2 === 0 ? '#fbbf24' : '#f472b6';
    c.font = '14px serif';
    c.textAlign = 'center';
    c.fillText(i % 2 === 0 ? '🎉' : '🏖️', sx, sy);
  }

  c.fillStyle = 'rgba(255, 255, 255, 0.96)';
  c.beginPath();
  c.roundRect(cw / 2 - 160, ch / 2 - 110, 320, 220, 16);
  c.fill();
  c.strokeStyle = '#0284c7';
  c.lineWidth = 3;
  c.stroke();

  c.font = 'bold 11px "Press Start 2P", monospace';
  c.fillStyle = '#0284c7';
  c.textAlign = 'center';
  c.fillText('PETAK 100 TERCAPAI!', cw / 2, ch / 2 - 65);
  c.fillText('🏖️ GAZEBO PANTAI 🏖️', cw / 2, ch / 2 - 45);

  c.font = '8px "Press Start 2P", monospace';
  c.fillStyle = '#374151';
  c.fillText('Nidan & Jinan bersatu di pantai!', cw / 2, ch / 2 - 10);

  c.font = '7px "Press Start 2P", monospace';
  c.fillStyle = '#64748b';
  c.fillText('Jinan datang menyambutmu... ♡', cw / 2, ch / 2 + 35);
}

function moveBidakAlongPath() {
  if (!mg2Moving || mg2MovePath.length === 0) return;

  const target = getSquareCoords(mg2MovePath[0]);
  const dx = target.x - mg2BidakX;
  const dy = target.y - mg2BidakY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 3) {
    mg2BidakX = target.x;
    mg2BidakY = target.y;
    mg2MovePath.shift();
    SoundEngine.pionStep && SoundEngine.pionStep();

    if (mg2MovePath.length === 0) {
      setTimeout(() => {
        resolvePosition();
      }, 250);
    }
  } else {
    mg2BidakX += (dx / dist) * 4.5;
    mg2BidakY += (dy / dist) * 4.5;
  }
}

function resolvePosition() {
  // Check Snake
  if (SNAKES[mg2PlayerPos]) {
    const dest = SNAKES[mg2PlayerPos];
    mg2Message = `🐍 Meluncur santai dari petak ${mg2PlayerPos} ke ${dest}...`;
    SoundEngine.snakeSlide && SoundEngine.snakeSlide();
        mg2CatMood = 'bengong';
        mg2CatEmote = { text: 'Pelan-pelan Sayang! 🐾', x: CONSOLE_X + 54, y: CONSOLE_Y + 52, timer: 80 };
    setTimeout(() => {
      mg2PlayerPos = dest;
      const pos = getSquareCoords(mg2PlayerPos);
      mg2BidakX = pos.x;
      mg2BidakY = pos.y;
      mg2Moving = false;
      mg2Phase = 'playing';
    }, 600);
    return;
  }

  // Check Ladder
  if (LADDERS[mg2PlayerPos]) {
    const dest = LADDERS[mg2PlayerPos];
    mg2Message = `🪜 Naik tangga kenangan! Melompat pesat ke petak ${dest}!`;
    SoundEngine.ladderClimb && SoundEngine.ladderClimb();
        mg2CatMood = 'dance';
        mg2CatEmote = { text: 'Naik tangga pesat! 🪜✨', x: CONSOLE_X + 54, y: CONSOLE_Y + 52, timer: 90 };
    setTimeout(() => {
      mg2PlayerPos = dest;
      const pos = getSquareCoords(mg2PlayerPos);
      mg2BidakX = pos.x;
      mg2BidakY = pos.y;
      mg2Moving = false;
      mg2Phase = 'playing';
    }, 600);
    return;
  }

  // Check Cat Meme Square (Gives cute quote + bonus +2 steps forward!)
  if (CAT_SQUARES.includes(mg2PlayerPos)) {
    const quote = CAT_MEME_QUOTES[Math.floor(Math.random() * CAT_MEME_QUOTES.length)];
    mg2Message = quote;
    SoundEngine.catMeow && SoundEngine.catMeow();

    // Bonus +2 forward steps
    setTimeout(() => {
      const bonusTarget = Math.min(100, mg2PlayerPos + 2);
      if (bonusTarget > mg2PlayerPos) {
        startMoveBidak(bonusTarget - mg2PlayerPos);
      }
    }, 700);
    return;
  }

  // Check Win (Square 100) — Always Guaranteed to Win!
  if (mg2PlayerPos >= 100) {
    mg2PlayerPos = 100;
    mg2Phase = 'won';
    SoundEngine.fanfare && SoundEngine.fanfare();
    setTimeout(() => {
      if (mg2OnComplete) mg2OnComplete();
    }, 2200);
    return;
  }

  mg2Message = `Bidak di petak ${mg2PlayerPos}. Giliran lempar dadu lagi!`;
  mg2Moving = false;
  mg2Phase = 'playing';
}

export function rollDice() {
  if (mg2Phase !== 'playing' || mg2Moving || mg2DiceRolling) return;
  const now = Date.now();
  if (now - mg2LastRollTime < 400) return;
  mg2LastRollTime = now;

  SoundEngine.diceRoll && SoundEngine.diceRoll();
  mg2DiceValue = Math.floor(Math.random() * 6) + 1;
  mg2DiceRolling = true;
  mg2CatMood = 'shocked';
  mg2CatEmote = { text: 'Kocok dadunya! 🎲', x: CONSOLE_X + 54, y: CONSOLE_Y + 52, timer: 60 };
  mg2DiceAnim = 0;
  mg2Phase = 'rolling';
}

function mg2DrawBackground(c, cw, ch, t) {
  // 1. Deep Dreamy Bedroom Wall Gradient (Match Image 2: Memory Vault)
  const wallGrad = c.createLinearGradient(0, 0, 0, ch);
  wallGrad.addColorStop(0, '#0a1628'); // deep celestial indigo
  wallGrad.addColorStop(0.35, '#132845'); // starry night blue
  wallGrad.addColorStop(0.7, '#1b3b64'); // dreamy teal-blue
  wallGrad.addColorStop(1, '#244e82'); // ambient floor glow
  c.fillStyle = wallGrad;
  c.fillRect(0, 0, cw, ch);

  // 2. Celestial Constellation & Blueprint Sketches on Wall (Match Image 2)
  c.strokeStyle = 'rgba(186, 230, 253, 0.18)';
  c.lineWidth = 1;

  // Star map blueprint rectangles & coordinate lines
  c.strokeRect(cw * 0.42, 12, 110, 55);
  c.strokeRect(cw * 0.45, 18, 55, 24);
  c.beginPath();
  c.moveTo(cw * 0.42, 38); c.lineTo(cw * 0.42 + 110, 38);
  c.moveTo(cw * 0.78, 15); c.lineTo(cw * 0.88, 50);
  c.moveTo(cw * 0.88, 50); c.lineTo(cw * 0.94, 25);
  c.stroke();

  // Subtle circular compass & geometric memory arcs
  c.beginPath();
  c.arc(cw * 0.9, 85, 28, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.arc(cw * 0.9, 85, 16, 0, Math.PI * 2);
  c.stroke();

  // 3. Cozy Bedroom Window with Warm Sunlight Beams (Match Image 2: Window on Left)
  const winX = 12;
  const winY = 10;
  const winW = 110;
  const winH = 135;

  // Window Outer Frame (White)
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(winX, winY, winW, winH, [10, 10, 0, 0]);
  c.fill();
  c.strokeStyle = '#bae6fd';
  c.lineWidth = 2;
  c.stroke();

  // Sunlit Window Glass (Warm Dawn / Morning Sky)
  const glassGrad = c.createLinearGradient(winX, winY, winX, winY + winH);
  glassGrad.addColorStop(0, '#fef08a'); // golden dawn
  glassGrad.addColorStop(0.45, '#fed7aa'); // warm peach
  glassGrad.addColorStop(1, '#bae6fd'); // sky blue
  c.fillStyle = glassGrad;
  c.beginPath();
  c.roundRect(winX + 6, winY + 6, winW - 12, winH - 12, [6, 6, 0, 0]);
  c.fill();

  // Window Mullions (Crossbars)
  c.fillStyle = '#ffffff';
  c.fillRect(winX + winW / 2 - 2, winY + 6, 4, winH - 12);
  c.fillRect(winX + 6, winY + 55, winW - 12, 4);
  c.fillRect(winX + 6, winY + 95, winW - 12, 4);

  // Warm Translucent Sunlight Rays Streaming In Across Room
  const sunBeam = c.createRadialGradient(winX + winW / 2, winY + 40, 10, winX + 220, winY + 220, 280);
  sunBeam.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
  sunBeam.addColorStop(0.5, 'rgba(253, 230, 138, 0.14)');
  sunBeam.addColorStop(1, 'rgba(253, 230, 138, 0)');
  c.fillStyle = sunBeam;
  c.beginPath();
  c.moveTo(winX + 10, winY + 15);
  c.lineTo(winX + winW - 10, winY + 15);
  c.lineTo(cw * 0.65, ch);
  c.lineTo(cw * 0.15, ch);
  c.closePath();
  c.fill();

  // ==============================================================
  // 4. FLOATING MEMORY ARTIFACTS IN THE AIR (Match Image 2)
  // Origami Paper Planes, Love Letters with Wax Seals, Polaroid Cards
  // ==============================================================
  // (a) Floating Origami Paper Planes (Drifting Gently)
  const paperPlanes = [
    { baseX: 160, baseY: 32, speed: 0.15, scale: 1.1, rot: 0.1 },
    { baseX: 430, baseY: 22, speed: 0.12, scale: 0.9, rot: -0.15 },
    { baseX: 680, baseY: 36, speed: 0.18, scale: 0.8, rot: 0.05 },
    { baseX: 280, baseY: 418, speed: 0.14, scale: 0.85, rot: -0.08 },
  ];
  paperPlanes.forEach((plane, pi) => {
    const px = (plane.baseX + t * plane.speed * 8) % (cw + 60) - 30;
    const py = plane.baseY + Math.sin(t * 0.04 + pi * 1.5) * 6;
    c.save();
    c.translate(px, py);
    c.rotate(plane.rot + Math.sin(t * 0.03 + pi) * 0.06);
    c.scale(plane.scale, plane.scale);

    // Paper Plane Shadow
    c.fillStyle = 'rgba(7, 21, 43, 0.2)';
    c.beginPath();
    c.moveTo(2, 6); c.lineTo(24, 18); c.lineTo(4, 20);
    c.closePath(); c.fill();

    // Paper Plane Wings (Soft White / Peach Fold)
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(0, 0); c.lineTo(20, 12); c.lineTo(2, 14);
    c.closePath(); c.fill();

    c.fillStyle = '#fef3c7'; // Underwing shade
    c.beginPath();
    c.moveTo(0, 0); c.lineTo(14, 13); c.lineTo(2, 14);
    c.closePath(); c.fill();

    c.strokeStyle = '#fbcfe8';
    c.lineWidth = 0.8;
    c.stroke();
    c.restore();
  });

  // (b) Floating Sealed Love Letters with Pink Heart Wax Seals
  const floatingLetters = [
    { x: 395, y: 30,  size: 22 },
    { x: 535, y: 38,  size: 18 },
    { x: 745, y: 422, size: 20 },
  ];
  floatingLetters.forEach((fl, fi) => {
    const ly = fl.y + Math.sin(t * 0.05 + fi * 2) * 5;
    c.save();
    c.translate(fl.x, ly);
    c.rotate(Math.sin(t * 0.04 + fi) * 0.1);

    // Envelope Body
    c.fillStyle = '#ffffff';
    c.fillRect(-fl.size / 2, -fl.size * 0.35, fl.size, fl.size * 0.7);
    c.strokeStyle = '#bae6fd';
    c.lineWidth = 1;
    c.strokeRect(-fl.size / 2, -fl.size * 0.35, fl.size, fl.size * 0.7);

    // Envelope Flap
    c.beginPath();
    c.moveTo(-fl.size / 2, -fl.size * 0.35);
    c.lineTo(0, 0);
    c.lineTo(fl.size / 2, -fl.size * 0.35);
    c.strokeStyle = '#7dd3fc';
    c.stroke();

    // Pink Heart Wax Seal
    c.fillStyle = '#ec4899';
    c.font = `${fl.size * 0.42}px serif`;
    c.textAlign = 'center';
    c.fillText('💌', 0, 2);
    c.restore();
  });

  // (c) Floating Polaroid Photo Cards with Star Sparkles
  const floatingPhotos = [
    { x: 235, y: 34, title: 'Nobar' },
    { x: 625, y: 28, title: 'DM SD' },
  ];
  floatingPhotos.forEach((fp, fpi) => {
    const py = fp.y + Math.sin(t * 0.035 + fpi * 3) * 4;
    c.save();
    c.translate(fp.x, py);
    c.rotate(Math.sin(t * 0.03 + fpi) * 0.08);

    // Polaroid Frame
    c.fillStyle = '#ffffff';
    c.fillRect(-12, -15, 24, 30);
    c.strokeStyle = 'rgba(186, 230, 253, 0.8)';
    c.lineWidth = 1;
    c.strokeRect(-12, -15, 24, 30);

    // Photo Picture Area
    c.fillStyle = fpi === 0 ? '#38bdf8' : '#f472b6';
    c.fillRect(-10, -13, 20, 18);

    // Little heart/star inside photo
    c.fillStyle = '#ffffff';
    c.font = '8px serif';
    c.textAlign = 'center';
    c.fillText(fpi === 0 ? '🎬' : '⭐', 0, 0);
    c.restore();
  });

  // (d) Floating Glowing Stardust / Memory Motive Dust
  for (let s = 0; s < 18; s++) {
    const sx = (s * 87 + t * 0.3) % cw;
    const sy = (s * 39 + Math.sin(t * 0.06 + s) * 12) % ch;
    const alpha = 0.25 + Math.sin(t * 0.08 + s) * 0.25;
    c.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    c.beginPath();
    c.arc(sx, sy, 1.3, 0, Math.PI * 2);
    c.fill();
  }

  // ==============================================================
  // 5. BLOOMING FLORAL BLOSSOM BRANCHES FRAMING ROOM (Match Image 2)
  // Soft Pink and White Blossom Vines Along Top Edge and Window
  // ==============================================================
  // Wooden Branch Sprigs
  c.strokeStyle = '#5a2e14';
  c.lineWidth = 2.5;
  c.beginPath();
  c.moveTo(0, 18);
  c.quadraticCurveTo(80, 8, 160, 22);
  c.stroke();
  c.beginPath();
  c.moveTo(cw, 14);
  c.quadraticCurveTo(cw - 80, 28, cw - 170, 18);
  c.stroke();

  // Blossom Clusters on Branches (Soft Pink & White)
  const blossomClusters = [
    { x: 22,  y: 18, r: 8, col: '#fbcfe8' },
    { x: 55,  y: 12, r: 10, col: '#f472b6' },
    { x: 92,  y: 16, r: 9, col: '#fbcfe8' },
    { x: 135, y: 22, r: 8, col: '#ffffff' },
    { x: cw - 25,  y: 16, r: 9, col: '#fbcfe8' },
    { x: cw - 65,  y: 24, r: 10, col: '#f472b6' },
    { x: cw - 110, y: 20, r: 8, col: '#ffffff' },
    { x: cw - 150, y: 18, r: 8, col: '#fbcfe8' },
  ];
  blossomClusters.forEach(b => {
    c.fillStyle = b.col;
    c.beginPath();
    c.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    c.fill();
    // Yellow flower stamen center
    c.fillStyle = '#fbbf24';
    c.beginPath();
    c.arc(b.x, b.y, b.r * 0.3, 0, Math.PI * 2);
    c.fill();
  });

  // Warm Cozy Wooden Floor / Desk Trim at Base
  const deskGrad = c.createLinearGradient(0, ch - 28, 0, ch);
  deskGrad.addColorStop(0, '#78350f'); // warm wood
  deskGrad.addColorStop(0.3, '#92400e');
  deskGrad.addColorStop(1, '#451a03');
  c.fillStyle = deskGrad;
  c.fillRect(0, ch - 28, cw, 28);
  c.fillStyle = '#b45309';
  c.fillRect(0, ch - 28, cw, 2);

  // Stack of Books on Floor / Desk (Matching Image 2)
  c.fillStyle = '#0284c7';
  c.fillRect(18, ch - 24, 38, 8);
  c.fillStyle = '#ec4899';
  c.fillRect(16, ch - 16, 42, 8);
  c.fillStyle = '#fef3c7'; // book pages
  c.fillRect(18, ch - 22, 36, 4);
  c.fillRect(16, ch - 14, 40, 4);

  // Steaming Cozy Tea Cup on Floor / Desk
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(68, ch - 22, 14, 12, [0, 0, 4, 4]);
  c.fill();
  // Rising Steam
  c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(75, ch - 24);
  c.quadraticCurveTo(73 + Math.sin(t * 0.1) * 3, ch - 30, 75, ch - 34);
  c.stroke();

  // Cheering Cats in Memory Vault:
  // Companion Cat waving from console cabana booth
  drawPixelCat(c, 360, 22, 'wave', t, 0.85);
  // Sleeping Loaf Cat curled up near warm sunlight on desk
  drawPixelCat(c, cw - 48, ch - 32, 'loaf', t, 0.95);

  // Soft romantic drifting petals
  drawDriftingPetals(c, cw, ch, t);
}

function mg2Loop() {
  if (!mg2Ctx) return;
  mg2T += 0.5;

  const cw = mg2Canvas.width;
  const ch = mg2Canvas.height;
  mg2Ctx.clearRect(0, 0, cw, ch);

  if (mg2Phase === 'won') {
    mg2DrawWon(mg2Ctx, cw, ch);
  } else {
    mg2DrawBackground(mg2Ctx, cw, ch, mg2T);
    drawBoard(mg2Ctx);

    if (mg2Moving) {
      moveBidakAlongPath();
    }

    drawBidak(mg2Ctx, mg2BidakX, mg2BidakY, mg2T);
    drawInteractiveConsole(mg2Ctx, mg2T);

    // Dice rolling animation ticker
    if (mg2DiceRolling) {
      mg2DiceAnim++;
      if (mg2DiceAnim > 18) {
        mg2DiceRolling = false;
        startMoveBidak(mg2DiceValue);
      }
    }
  }

  mg2AnimId = requestAnimationFrame(mg2Loop);
}

function startMoveBidak(steps) {
  const path = [];
  let pos = mg2PlayerPos;
  for (let i = 0; i < steps; i++) {
    pos = Math.min(pos + 1, 100);
    path.push(pos);
  }
  mg2PlayerPos = pos;
  mg2MovePath = path;
  mg2Moving = true;
  mg2Phase = 'rolling';
  SoundEngine.jump && SoundEngine.jump();
}

/**
 * Bulletproof coordinate mapping
 */
function mg2GetCanvasCoords(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
  const clientY = e.touches ? e.touches[0].clientY : (e.changedTouches ? e.changedTouches[0].clientY : e.clientY);

  const canvasRatio = canvas.width / canvas.height;
  const elemRatio = rect.width / rect.height;

  let actualWidth = rect.width;
  let actualHeight = rect.height;
  let offsetX = 0;
  let offsetY = 0;

  if (elemRatio > canvasRatio) {
    actualWidth = rect.height * canvasRatio;
    offsetX = (rect.width - actualWidth) / 2;
  } else {
    actualHeight = rect.width / canvasRatio;
    offsetY = (rect.height - actualHeight) / 2;
  }

  const x = ((clientX - rect.left - offsetX) / actualWidth) * canvas.width;
  const y = ((clientY - rect.top - offsetY) / actualHeight) * canvas.height;

  return {
    x: Math.max(0, Math.min(canvas.width, x)),
    y: Math.max(0, Math.min(canvas.height, y))
  };
}

function handleInteraction(x, y) {
  if (mg2Phase === 'playing') {
    // Check if clicked the Dice stadium or the Roll Button on the right
    const diceCenterX = CONSOLE_X + CONSOLE_W / 2;
    const diceCenterY = CONSOLE_Y + 185;
    const distToDice = Math.hypot(x - diceCenterX, y - diceCenterY);

    const btnX = CONSOLE_X + 40;
    const btnY = CONSOLE_Y + 252;
    const btnW = CONSOLE_W - 80;
    const btnH = 42;
    const clickedBtn = (x >= btnX && x <= btnX + btnW && y >= btnY && y <= btnY + btnH);

    if (distToDice < 60 || clickedBtn) {
      rollDice();
    }
  }
}

function mg2OnCanvasClick(e) {
  const { x, y } = mg2GetCanvasCoords(mg2Canvas, e);

  // Easter egg: Click on Companion Cat in Cabana Booth
  if (x >= CONSOLE_X + 45 && x <= CONSOLE_X + 78 && y >= CONSOLE_Y + 55 && y <= CONSOLE_Y + 85) {
    SoundEngine.catMeow && SoundEngine.catMeow();
    mg2CatMood = 'happy';
    mg2CatEmote = { text: 'Mew! Nidan pasti menang! 🏖️🐾', x: CONSOLE_X + 54, y: CONSOLE_Y + 52, timer: 100 };
    return;
  }
  handleInteraction(x, y);
}

function mg2OnCanvasTouch(e) {
  e.preventDefault();
  const { x, y } = mg2GetCanvasCoords(mg2Canvas, e);
  handleInteraction(x, y);
}

export function startMiniGame2(canvas, onComplete) {
  stopMiniGame2();

  mg2Canvas = canvas;
  mg2Ctx = canvas.getContext('2d');
  mg2OnComplete = onComplete;
  mg2T = 0;

  // Immediately initialize game board, bidak & interactive console
  beginGame2();

  mg2Canvas.addEventListener('click', mg2OnCanvasClick);
  mg2Canvas.addEventListener('touchstart', mg2OnCanvasTouch, { passive: false });

  if (mg2AnimId) cancelAnimationFrame(mg2AnimId);
  mg2AnimId = requestAnimationFrame(mg2Loop);
}

export function beginGame2() {
  mg2Phase = 'playing';
  mg2PlayerPos = 1;
  mg2DiceValue = 1;
  mg2Moving = false;
  mg2DiceRolling = false;
  const startPos = getSquareCoords(1);
  mg2BidakX = startPos.x;
  mg2BidakY = startPos.y;
  mg2Message = 'Game dimulai! Lempar dadumu untuk melangkah!';
}

export function retryMiniGame2() {
  beginGame2();
}

export function stopMiniGame2() {
  if (mg2AnimId) {
    cancelAnimationFrame(mg2AnimId);
    mg2AnimId = null;
  }
  if (mg2Canvas) {
    mg2Canvas.removeEventListener('click', mg2OnCanvasClick);
    mg2Canvas.removeEventListener('touchstart', mg2OnCanvasTouch);
  }
}
