/* ===================================================
   ROOM 4 MINI-GAME: ALPINE MOUNTAIN SNAKE GAME
   Genre: Cozy Alpine Camping Snake / Worm Game
   Theme: Camping Pegunungan Menuju Puncak Kejutan Ulang Tahun
   Player Two, Forever 💖
=================================================== */

import { SoundEngine } from './sound.js';
import { drawPixelCat, drawCampsiteCat, drawPixelFlower, drawDriftingPetals, drawFloatingCatEmote } from './characters.js';

// Grid Dimensions — 24 Columns x 14 Rows
const GRID_COLS = 24;
const GRID_ROWS = 14;
const CELL_W = 32;
const CELL_H = 26;
const GRID_TOTAL_W = GRID_COLS * CELL_W; // 768px
const GRID_TOTAL_H = GRID_ROWS * CELL_H; // 364px
const MG4_GRID_X = Math.round((800 - GRID_TOTAL_W) / 2); // 16px
const MG4_GRID_Y = 44; // Vertically centered at 44px

// State
let mg4Canvas = null;
let mg4Ctx = null;
let mg4AnimId = null;
let mg4T = 0;
let mg4Phase = 'playing'; // 'playing' | 'won'
let mg4OnComplete = null;

// Snake state
let mg4Snake = []; // [{col, row}]
let mg4Dir = { dc: 1, dr: 0 };
let mg4NextDir = { dc: 1, dr: 0 };
let mg4Food = [];
let mg4Score = 0;
const WIN_SCORE = 10;
let mg4TickInterval = 210; // Calm, cozy, comfortable reaction time (ms per move)
let mg4LastTick = 0;
let mg4GrowPending = 0;
let mg4CatMood = 'loaf'; // 'loaf' | 'awake' | 'happy'
let mg4CatEmote = null; // { text, timer }

// Touch Swipe State
let mg4TouchStartX = 0;
let mg4TouchStartY = 0;

// Birthday & Camping Foods
const FOOD_TYPES = [
  { type: 'fish', emoji: '🐟', color: '#38bdf8', label: 'Ikan Bakar Camping' },
  { type: 'cake', emoji: '🎂', color: '#c084fc', label: 'Kue Ulang Tahun' },
  { type: 'star', emoji: '⭐', color: '#fbbf24', label: 'Bintang Harapan' },
  { type: 'heart', emoji: '💖', color: '#f472b6', label: 'Hati Kasih' },
  { type: 'flower', emoji: '🌸', color: '#fb7185', label: 'Bunga Pegunungan' },
  { type: 'pinecone', emoji: '🌲', color: '#4ade80', label: 'Ranting Cemara' },
];

function initSnake() {
  mg4Snake = [
    { col: 8, row: 7 },
    { col: 7, row: 7 },
    { col: 6, row: 7 },
  ];
  mg4Dir = { dc: 1, dr: 0 };
  mg4NextDir = { dc: 1, dr: 0 };
  mg4Score = 0;
  mg4GrowPending = 0;
  mg4TickInterval = 210;
  mg4LastTick = performance.now();
  spawnFood();
}

function spawnFood() {
  while (mg4Food.length < 4) {
    let col, row;
    let attempts = 0;
    do {
      col = Math.floor(Math.random() * GRID_COLS);
      row = Math.floor(Math.random() * GRID_ROWS);
      attempts++;
    } while (
      (mg4Snake.some(s => s.col === col && s.row === row) ||
       mg4Food.some(f => f.col === col && f.row === row)) &&
      attempts < 60
    );

    const ft = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    mg4Food.push({ col, row, type: ft.type, emoji: ft.emoji, color: ft.color });
  }
}

function mg4DrawBackground(c, cw, ch, t) {
  // 1. Starry Twilight to Alpine Horizon Sky Gradient (Match Image 4: Horizon of Tomorrow)
  const skyGrad = c.createLinearGradient(0, 0, 0, ch * 0.65);
  skyGrad.addColorStop(0, '#060c18'); // deep midnight navy
  skyGrad.addColorStop(0.35, '#0d1b2a'); // twilight indigo
  skyGrad.addColorStop(0.7, '#1b2a4a'); // mountain mist
  skyGrad.addColorStop(1, '#0e7490'); // cyan twilight horizon
  c.fillStyle = skyGrad;
  c.fillRect(0, 0, cw, ch * 0.65);

  // 2. Twinkling Night Starlight & Gentle Shooting Stars
  for (let s = 0; s < 26; s++) {
    const sx = (s * 67 + t * 0.08) % cw;
    const sy = 6 + (s * 18) % 95;
    const alpha = 0.3 + Math.sin(t * 0.07 + s) * 0.4;
    c.fillStyle = `rgba(254, 240, 138, ${alpha})`;
    c.beginPath();
    c.arc(sx, sy, 1.4, 0, Math.PI * 2);
    c.fill();
  }

  // Shooting star streak
  const shootT = (t * 0.018) % 1;
  if (shootT < 0.18) {
    const prog = shootT / 0.18;
    const shootX = 140 + prog * 280;
    const shootY = 12 + prog * 48;
    c.strokeStyle = `rgba(254, 240, 138, ${1 - prog})`;
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(shootX, shootY);
    c.lineTo(shootX - 26, shootY - 6);
    c.stroke();
  }

  // Soft Drifting Twilight Clouds
  c.fillStyle = 'rgba(147, 197, 253, 0.18)';
  for (let cl = 0; cl < 3; cl++) {
    const cx = ((cl * 280 + t * 0.15) % (cw + 200)) - 80;
    const cy = 35 + cl * 25;
    c.beginPath();
    c.arc(cx, cy, 32, 0, Math.PI * 2);
    c.arc(cx + 28, cy - 8, 42, 0, Math.PI * 2);
    c.arc(cx + 65, cy, 30, 0, Math.PI * 2);
    c.fill();
  }

  // ==============================================================
  // 3. LAYERED ALPINE MOUNTAINS (Match Image 4)
  // Distant Craggy Peaks & Mid-Range Ridges
  // ==============================================================
  // Far Misty Mountain Ridge (Cool Slate Blue)
  c.fillStyle = '#1e293b';
  c.beginPath();
  c.moveTo(0, ch * 0.52);
  c.lineTo(0, 140);
  c.lineTo(110, 85);
  c.lineTo(240, 135);
  c.lineTo(390, 68);
  c.lineTo(540, 130);
  c.lineTo(680, 78);
  c.lineTo(cw, 145);
  c.lineTo(cw, ch * 0.52);
  c.closePath();
  c.fill();

  // Mid-Range Alpine Peaks (Deep Teal-Indigo)
  c.fillStyle = '#13283f';
  c.beginPath();
  c.moveTo(0, ch * 0.52);
  c.lineTo(0, 175);
  c.lineTo(160, 120);
  c.lineTo(320, 168);
  c.lineTo(480, 110);
  c.lineTo(650, 165);
  c.lineTo(cw, 125);
  c.lineTo(cw, ch * 0.52);
  c.closePath();
  c.fill();

  // ==============================================================
  // 4. SERENE GLASSY ALPINE LAKE (Match Image 4)
  // Reflective Calm Water Mirroring Twilight Sky & Mountains
  // ==============================================================
  const lakeGrad = c.createLinearGradient(0, ch * 0.42, 0, ch * 0.72);
  lakeGrad.addColorStop(0, '#0e7490'); // cyan reflective horizon
  lakeGrad.addColorStop(0.5, '#083344'); // deep calm lake mirror
  lakeGrad.addColorStop(1, '#062330');
  c.fillStyle = lakeGrad;
  c.fillRect(0, ch * 0.42, cw, ch * 0.30);

  // Soft Shimmering Lake Water Ripples
  c.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  c.lineWidth = 1;
  for (let w = 0; w < 4; w++) {
    const wy = ch * 0.46 + w * 18;
    c.beginPath();
    for (let x = 0; x <= cw; x += 35) {
      const yOffset = Math.sin(x * 0.04 + t * 0.05 + w) * 1.5;
      if (x === 0) c.moveTo(x, wy + yOffset);
      else c.lineTo(x, wy + yOffset);
    }
    c.stroke();
  }

  // ==============================================================
  // 5. FOREGROUND LAKESIDE SHORELINE & GRASSY BANK
  // ==============================================================
  const shoreGrad = c.createLinearGradient(0, ch * 0.65, 0, ch);
  shoreGrad.addColorStop(0, '#134e4a'); // deep forest teal
  shoreGrad.addColorStop(0.4, '#14532d'); // alpine meadow green
  shoreGrad.addColorStop(1, '#064e3b'); // rich pine green
  c.fillStyle = shoreGrad;
  c.fillRect(0, ch * 0.65, cw, ch * 0.35);

  // ==============================================================
  // 6. LUMINOUS CYAN NEON SHORELINE STREAM (Match Image 4)
  // Glowing cyan water trail tracing the shore into tomorrow!
  // ==============================================================
  c.strokeStyle = '#22d3ee';
  c.lineWidth = 3.5;
  c.shadowColor = '#38bdf8';
  c.shadowBlur = 10;
  c.beginPath();
  c.moveTo(cw, ch * 0.78);
  c.quadraticCurveTo(cw * 0.75, ch * 0.88, cw * 0.45, ch * 0.82);
  c.quadraticCurveTo(cw * 0.28, ch * 0.76, 160, ch * 0.86);
  c.stroke();
  // Inner bright highlight
  c.strokeStyle = '#e0f2fe';
  c.lineWidth = 1.5;
  c.stroke();
  c.shadowBlur = 0; // reset shadow

  // ==============================================================
  // 7. CRACKLING LAKESHORE CAMPFIRE (Match Image 4)
  // Burning logs, glowing red embers, dancing flames & rising sparks
  // ==============================================================
  const campFireX = 52;
  const campFireY = ch - 26;

  // River stones in a circle
  c.fillStyle = '#334155';
  c.beginPath();
  c.ellipse(campFireX, campFireY + 4, 18, 7, 0, 0, Math.PI * 2);
  c.fill();

  // Burning logs
  c.fillStyle = '#451a03';
  c.fillRect(campFireX - 12, campFireY, 24, 6);
  c.fillStyle = '#78350f';
  c.fillRect(campFireX - 8, campFireY - 3, 16, 5);

  // Glowing red coals
  c.fillStyle = '#ef4444';
  c.fillRect(campFireX - 6, campFireY - 1, 12, 3);

  // Animated Dancing Flame Layers
  const flamePulse = Math.sin(t * 0.25) * 4;
  // Outer Orange Flame
  c.fillStyle = '#f97316';
  c.beginPath();
  c.moveTo(campFireX - 9, campFireY);
  c.quadraticCurveTo(campFireX - 5, campFireY - 18 - flamePulse, campFireX, campFireY - 24 - flamePulse);
  c.quadraticCurveTo(campFireX + 5, campFireY - 18 - flamePulse, campFireX + 9, campFireY);
  c.closePath();
  c.fill();

  // Mid Yellow Flame
  c.fillStyle = '#fef08a';
  c.beginPath();
  c.moveTo(campFireX - 5, campFireY);
  c.quadraticCurveTo(campFireX - 2, campFireY - 12 - flamePulse * 0.8, campFireX, campFireY - 16 - flamePulse * 0.8);
  c.quadraticCurveTo(campFireX + 2, campFireY - 12 - flamePulse * 0.8, campFireX + 5, campFireY);
  c.closePath();
  c.fill();

  // Warm Campfire Light Aura Glow onto ground & lake
  const fireAura = c.createRadialGradient(campFireX, campFireY - 8, 4, campFireX, campFireY - 8, 48);
  fireAura.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
  fireAura.addColorStop(0.6, 'rgba(249, 115, 22, 0.2)');
  fireAura.addColorStop(1, 'rgba(249, 115, 22, 0)');
  c.fillStyle = fireAura;
  c.beginPath();
  c.arc(campFireX, campFireY - 8, 48, 0, Math.PI * 2);
  c.fill();

  // Floating Fiery Ember Sparks rising from campfire
  for (let em = 0; em < 5; em++) {
    const emX = campFireX + Math.sin(t * 0.15 + em) * 8;
    const emY = campFireY - 26 - ((t * 0.8 + em * 14) % 36);
    c.fillStyle = em % 2 === 0 ? '#fef08a' : '#f97316';
    c.beginPath();
    c.arc(emX, emY, 1.2, 0, Math.PI * 2);
    c.fill();
  }

  // ==============================================================
  // 8. ILLUMINATED GLOWING CYAN DOME TENT (Match Image 4)
  // Translucent dome tent radiating soft cyan luminescence from within!
  // ==============================================================
  const tentX = 118;
  const tentY = ch - 26;
  const tentW = 54;
  const tentH = 34;

  // Tent Soft Inner Glow Aura
  const tentAura = c.createRadialGradient(tentX + tentW / 2, tentY - tentH / 2, 6, tentX + tentW / 2, tentY - tentH / 2, 45);
  tentAura.addColorStop(0, 'rgba(34, 211, 238, 0.55)');
  tentAura.addColorStop(0.6, 'rgba(56, 189, 248, 0.25)');
  tentAura.addColorStop(1, 'rgba(56, 189, 248, 0)');
  c.fillStyle = tentAura;
  c.beginPath();
  c.arc(tentX + tentW / 2, tentY - tentH / 2, 45, 0, Math.PI * 2);
  c.fill();

  // Translucent Illuminated Dome Shell
  c.fillStyle = 'rgba(224, 242, 254, 0.82)'; // radiant cyan-white dome
  c.beginPath();
  c.ellipse(tentX + tentW / 2, tentY, tentW / 2, tentH, 0, Math.PI, 0);
  c.closePath();
  c.fill();
  c.strokeStyle = '#38bdf8';
  c.lineWidth = 2;
  c.stroke();

  // Inner Dome Glow Ribs & Arched Flap
  c.strokeStyle = 'rgba(34, 211, 238, 0.6)';
  c.lineWidth = 1.2;
  c.beginPath();
  c.arc(tentX + tentW / 2, tentY, tentH * 0.7, Math.PI, 0);
  c.stroke();

  // Tent Cozy Entrance Flap
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.ellipse(tentX + tentW / 2, tentY, 10, 16, 0, Math.PI, 0);
  c.closePath();
  c.fill();

  // ==============================================================
  // 9. RICH WILDFLOWER MEADOW (Match Image 4 Foreground)
  // Purple Lavender Spikes, Golden Marigolds & Bluebells
  // ==============================================================
  // Tall Purple Lavender Stalks
  const lavenderSpikes = [
    { x: 22,  y: ch - 8 },
    { x: 38,  y: ch - 12 },
    { x: 185, y: ch - 14 },
    { x: 202, y: ch - 10 },
    { x: cw - 65, y: ch - 12 },
    { x: cw - 82, y: ch - 8 },
  ];
  lavenderSpikes.forEach(ls => {
    // Green stem
    c.fillStyle = '#16a34a';
    c.fillRect(ls.x, ls.y - 18, 2, 18);
    // Purple lavender bloom buds
    c.fillStyle = '#a855f7';
    for (let b = 0; b < 4; b++) {
      c.fillRect(ls.x - 2, ls.y - 18 + b * 4, 6, 3);
    }
    c.fillStyle = '#c084fc'; // top tip
    c.fillRect(ls.x - 1, ls.y - 21, 4, 3);
  });

  // Golden Orange Marigolds & Forest Daisies
  const wildFlowers = [
    { x: 85,  y: ch - 10, type: 'heart' },
    { x: 155, y: ch - 12, type: 'tulip' },
    { x: 235, y: ch - 10, type: 'wildflower' },
    { x: 620, y: ch - 14, type: 'tulip' },
    { x: 710, y: ch - 10, type: 'daisy' },
    { x: 755, y: ch - 12, type: 'heart' },
  ];
  wildFlowers.forEach(f => {
    drawPixelFlower(c, f.x, f.y, f.type, t);
  });

  // Campsite Cat curled up near the warm campfire
  drawCampsiteCat(c, campFireX + 22, campFireY - 8, mg4CatMood, t);

  if (mg4CatEmote && mg4CatEmote.timer > 0) {
    drawFloatingCatEmote(c, campFireX + 22, campFireY - 26, mg4CatEmote.text, t, mg4CatEmote.timer / 25);
    mg4CatEmote.timer--;
    if (mg4CatEmote.timer === 0 && mg4Phase === 'playing') {
      mg4CatMood = 'loaf';
    }
  }

  // Starlit drifting petals / fireflies in night air
  drawDriftingPetals(c, cw, ch, t);

  // ==============================================================
  // 10. PLAY ARENA FRAME (Cedar Wood & Starry Translucent Backdrop)
  // Sits gracefully on the alpine meadow, letting the scenery glow through
  // ==============================================================
  c.fillStyle = 'rgba(10, 20, 38, 0.78)'; // translucent deep starlight navy
  c.beginPath();
  c.roundRect(MG4_GRID_X - 4, MG4_GRID_Y - 4, GRID_TOTAL_W + 8, GRID_TOTAL_H + 8, 12);
  c.fill();
  c.strokeStyle = '#38bdf8';
  c.lineWidth = 2.5;
  c.stroke();

  // Subtle starry grid mesh inside arena
  c.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  c.lineWidth = 1;
  for (let cIdx = 0; cIdx <= GRID_COLS; cIdx++) {
    const gx = MG4_GRID_X + cIdx * CELL_W;
    c.beginPath();
    c.moveTo(gx, MG4_GRID_Y);
    c.lineTo(gx, MG4_GRID_Y + GRID_TOTAL_H);
    c.stroke();
  }
  for (let rIdx = 0; rIdx <= GRID_ROWS; rIdx++) {
    const gy = MG4_GRID_Y + rIdx * CELL_H;
    c.beginPath();
    c.moveTo(MG4_GRID_X, gy);
    c.lineTo(MG4_GRID_X + GRID_TOTAL_W, gy);
    c.stroke();
  }
}

function drawSnake(c, t) {
  mg4Snake.forEach((seg, i) => {
    const x = MG4_GRID_X + seg.col * CELL_W;
    const y = MG4_GRID_Y + seg.row * CELL_H;
    const isHead = i === 0;

    if (isHead) {
      // Head: Nidan's face with Blue Hoodie
      c.fillStyle = '#0284c7';
      c.beginPath();
      c.roundRect(x + 2, y + 2, CELL_W - 4, CELL_H - 4, 8);
      c.fill();
      c.strokeStyle = '#38bdf8';
      c.lineWidth = 1.5;
      c.stroke();

      // Cat-ear Beanie on Snake Head (Cozy Alpine Theme!)
      c.fillStyle = '#38bdf8';
      c.beginPath();
      c.moveTo(x + 4, y + 5);
      c.lineTo(x + 1, y - 2);
      c.lineTo(x + 8, y + 3);
      c.closePath();
      c.fill();
      c.beginPath();
      c.moveTo(x + CELL_W - 4, y + 5);
      c.lineTo(x + CELL_W - 1, y - 2);
      c.lineTo(x + CELL_W - 8, y + 3);
      c.closePath();
      c.fill();

      // Face
      c.fillStyle = '#fde68a';
      c.beginPath();
      c.arc(x + CELL_W / 2, y + CELL_H / 2, Math.min(CELL_W, CELL_H) * 0.35, 0, Math.PI * 2);
      c.fill();

      // Eyes facing movement direction
      const offX = mg4Dir.dc * 2.5;
      const offY = mg4Dir.dr * 2.5;
      c.fillStyle = '#1e293b';
      c.beginPath();
      c.arc(x + CELL_W / 2 - 2.5 + offX, y + CELL_H / 2 - 1.5 + offY, 1.2, 0, Math.PI * 2);
      c.arc(x + CELL_W / 2 + 2.5 + offX, y + CELL_H / 2 - 1.5 + offY, 1.2, 0, Math.PI * 2);
      c.fill();
    } else {
      // Body Segments: Gradient Ocean Blue with soft rounded joints
      const alpha = Math.max(0.5, 1 - (i / mg4Snake.length) * 0.45);
      c.fillStyle = `rgba(2, 132, 199, ${alpha})`;
      c.beginPath();
      c.roundRect(x + 3, y + 3, CELL_W - 6, CELL_H - 6, 6);
      c.fill();

      c.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      c.lineWidth = 1;
      c.stroke();
    }
  });
}

function drawFoodItems(c, t) {
  mg4Food.forEach((food, idx) => {
    const x = MG4_GRID_X + food.col * CELL_W;
    const y = MG4_GRID_Y + food.row * CELL_H;
    const bob = Math.sin(t * 0.15 + idx * 2) * 2;

    // Glowing circle aura
    c.fillStyle = food.color + '44';
    c.beginPath();
    c.arc(x + CELL_W / 2, y + CELL_H / 2 + bob, CELL_W * 0.45, 0, Math.PI * 2);
    c.fill();

    // Emoji icon
    c.font = '16px serif';
    c.textAlign = 'center';
    c.fillText(food.emoji, x + CELL_W / 2, y + CELL_H / 2 + 6 + bob);
  });
}

function mg4DrawHeaderLanternBadge(c, cw) {
  // Cozy floating lantern card at top-right
  c.fillStyle = 'rgba(15, 23, 42, 0.88)';
  c.beginPath();
  c.roundRect(cw - 240, 10, 222, 28, 8);
  c.fill();
  c.strokeStyle = '#a5b4fc';
  c.lineWidth = 1.5;
  c.stroke();

  c.font = 'bold 7px "Press Start 2P", monospace';
  c.fillStyle = '#fde047';
  c.textAlign = 'center';
  c.fillText(`🎂 HADIAH: ${mg4Score} / ${WIN_SCORE} KOLEKSI`, cw - 129, 28);
}

function mg4DrawWon(c, cw, ch) {
  const grad = c.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#1e1b4b');
  grad.addColorStop(1, '#4c1d95');
  c.fillStyle = grad;
  c.fillRect(0, 0, cw, ch);

  for (let i = 0; i < 20; i++) {
    const sx = (i * 77 + mg4T * 2) % cw;
    const sy = (i * 49) % ch;
    c.fillStyle = i % 2 === 0 ? '#fbbf24' : '#f472b6';
    c.font = '14px serif';
    c.textAlign = 'center';
    c.fillText(i % 2 === 0 ? '🎂' : '🎁', sx, sy);
  }

  c.fillStyle = 'rgba(255, 255, 255, 0.96)';
  c.beginPath();
  c.roundRect(cw / 2 - 160, ch / 2 - 110, 320, 220, 16);
  c.fill();
  c.strokeStyle = '#a855f7';
  c.lineWidth = 3;
  c.stroke();

  c.font = 'bold 11px "Press Start 2P", monospace';
  c.fillStyle = '#4c1d95';
  c.textAlign = 'center';
  c.fillText('SEMUA HADIAH TERKUMPUL!', cw / 2, ch / 2 - 65);
  c.fillText('🎂 KEJUTAN MENANTI 🎂', cw / 2, ch / 2 - 45);

  c.font = '8px "Press Start 2P", monospace';
  c.fillStyle = '#374151';
  c.fillText(`Total Koleksi: ${mg4Score} / ${WIN_SCORE}`, cw / 2, ch / 2 - 10);

  c.font = '7px "Press Start 2P", monospace';
  c.fillStyle = '#64748b';
  c.fillText('Jinan menantimu di tenda camping... ♡', cw / 2, ch / 2 + 35);
}

function setDirSafe(dc, dr) {
  // Prevent immediate 180-degree reverse turn
  if (dc !== 0 && mg4Dir.dc === -dc) return;
  if (dr !== 0 && mg4Dir.dr === -dr) return;
  mg4NextDir = { dc, dr };
}

function tickSnake(timestamp) {
  if (timestamp - mg4LastTick < mg4TickInterval) return;
  mg4LastTick = timestamp;

  mg4Dir = { ...mg4NextDir };

  const head = mg4Snake[0];
  let newCol = head.col + mg4Dir.dc;
  let newRow = head.row + mg4Dir.dr;

  // Seamless Torus Wrap-around: no harsh wall crashes!
  if (newCol < 0) newCol = GRID_COLS - 1;
  if (newCol >= GRID_COLS) newCol = 0;
  if (newRow < 0) newRow = GRID_ROWS - 1;
  if (newRow >= GRID_ROWS) newRow = 0;

  const newHead = { col: newCol, row: newRow };

  // Forgiving Self Collision Check: gentle tail push without losing game
  if (mg4Snake.some(s => s.col === newHead.col && s.row === newHead.row)) {
    // Soft wobble & shorten tail slightly instead of game over!
    if (mg4Snake.length > 3) {
      mg4Snake.pop();
    }
    SoundEngine.step && SoundEngine.step();
    return;
  }

  mg4Snake.unshift(newHead);

  // Check Food Collision
  const foodIdx = mg4Food.findIndex(f => f.col === newHead.col && f.row === newHead.row);
  if (foodIdx !== -1) {
    mg4Food.splice(foodIdx, 1);
    mg4Score++;
    mg4GrowPending += 1;
    // Gentle speed curve with a cozy floor at 160ms
    mg4TickInterval = Math.max(160, mg4TickInterval - 3);
    SoundEngine.eatItem && SoundEngine.eatItem();
      mg4CatMood = 'happy';
      mg4CatEmote = { text: 'Mew! Lezat! 🐟✨', timer: 70 };
    SoundEngine.snakeGrow && SoundEngine.snakeGrow();

    // Win Check (10 items)
    if (mg4Score >= WIN_SCORE) {
      mg4Phase = 'won';
      SoundEngine.fanfare && SoundEngine.fanfare();
      setTimeout(() => {
        if (mg4OnComplete) mg4OnComplete();
      }, 2200);
      return;
    }

    spawnFood();
  }

  if (mg4GrowPending > 0) {
    mg4GrowPending--;
  } else {
    mg4Snake.pop();
  }
}

function mg4Loop(timestamp) {
  if (!mg4Ctx) return;
  mg4T += 0.5;

  const cw = mg4Canvas.width;
  const ch = mg4Canvas.height;
  mg4Ctx.clearRect(0, 0, cw, ch);

  if (mg4Phase === 'won') {
    mg4DrawWon(mg4Ctx, cw, ch);
  } else {
    tickSnake(timestamp);

    mg4DrawBackground(mg4Ctx, cw, ch, mg4T);
    drawFoodItems(mg4Ctx, mg4T);
    drawSnake(mg4Ctx, mg4T);
    mg4DrawHeaderLanternBadge(mg4Ctx, cw);
  }

  mg4AnimId = requestAnimationFrame(mg4Loop);
}

function mg4OnKeyDown(e) {
  if (mg4Phase !== 'playing') return;

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      setDirSafe(0, -1);
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      setDirSafe(0, 1);
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      setDirSafe(-1, 0);
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      setDirSafe(1, 0);
      e.preventDefault();
      break;
  }
}

function mg4OnTouchStart(e) {
  if (e.touches && e.touches[0]) {
    mg4TouchStartX = e.touches[0].clientX;
    mg4TouchStartY = e.touches[0].clientY;
  }
}

function mg4OnTouchEnd(e) {
  if (mg4Phase !== 'playing') return;
  if (!e.changedTouches || !e.changedTouches[0]) return;

  const dx = e.changedTouches[0].clientX - mg4TouchStartX;
  const dy = e.changedTouches[0].clientY - mg4TouchStartY;

  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 18) {
    setDirSafe(dx > 0 ? 1 : -1, 0);
  } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 18) {
    setDirSafe(0, dy > 0 ? 1 : -1);
  }
}

export function startMiniGame4(canvas, onComplete) {
  stopMiniGame4();

  mg4Canvas = canvas;
  mg4Ctx = canvas.getContext('2d');
  mg4OnComplete = onComplete;
  mg4T = 0;

  // Immediately initialize mountain campsite, snake & birthday collectibles
  mg4StartPlaying();

  window.addEventListener('keydown', mg4OnKeyDown);
  canvas.addEventListener('touchstart', mg4OnTouchStart, { passive: true });
  canvas.addEventListener('touchend', mg4OnTouchEnd, { passive: true });

  if (mg4AnimId) cancelAnimationFrame(mg4AnimId);
  mg4AnimId = requestAnimationFrame(mg4Loop);
}

function mg4StartPlaying() {
  mg4Phase = 'playing';
  initSnake();
  mg4Food = [];
  spawnFood();
}

export function retryMiniGame4() {
  mg4StartPlaying();
}

export function setSnakeDir(dc, dr) {
  if (mg4Phase === 'playing') {
    setDirSafe(dc, dr);
  }
}

export function stopMiniGame4() {
  if (mg4AnimId) {
    cancelAnimationFrame(mg4AnimId);
    mg4AnimId = null;
  }
  window.removeEventListener('keydown', mg4OnKeyDown);
  if (mg4Canvas) {
    mg4Canvas.removeEventListener('touchstart', mg4OnTouchStart);
    mg4Canvas.removeEventListener('touchend', mg4OnTouchEnd);
  }
}
