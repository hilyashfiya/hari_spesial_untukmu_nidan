/* ===================================================
   ROOM 1 MINI-GAME: MATCH THE MEMORIES
   Genre: Memory Card Matching
   Theme: Masa Kecil Nidan & Jinan — Sekolah & Pohon Rindang
   Player Two, Forever 💖
=================================================== */

import { SoundEngine } from './sound.js';
import { drawStudentPixelChar, drawGirlfriendPixelChar, drawPixelCat, drawPixelFlower, drawDriftingPetals, drawFloatingCatEmote, wrapCanvasText, drawAdaptiveSpeechBubble } from './characters.js';

// Card pair definitions — schoolyard childhood memories
const CARD_PAIRS = [
  { id: 0, emoji: '📖', label: 'Buku Tulis', color: '#dc2626' },
  { id: 1, emoji: '🌳', label: 'Pohon Rindang', color: '#15803d' },
  { id: 2, emoji: '🐱', label: 'Meme Kucing', color: '#d97706' },
  { id: 3, emoji: '💌', label: 'DM Pertama', color: '#db2777' },
  { id: 4, emoji: '🎒', label: 'Tas Sekolah', color: '#7c3aed' },
  { id: 5, emoji: '⭐', label: 'Bintang', color: '#ca8a04' },
  { id: 6, emoji: '💻', label: 'Laptop', color: '#0369a1' },
  { id: 7, emoji: '🌸', label: 'Bunga Liar', color: '#be185d' },
];

// State
let mg1Canvas = null;
let mg1Ctx = null;
let mg1AnimId = null;
let mg1Cards = [];
let mg1Flipped = [];
let mg1Matched = [];
let mg1Attempts = 0;
let mg1PairsFound = 0;
let mg1Locked = false;
let mg1T = 0;
let mg1OnComplete = null;
let mg1Phase = 'playing'; // 'playing' | 'won'
let mg1CheerText = 'Cari pasangan kartunya ya, Nidan! ♡';
let mg1CatMood = 'shy'; // 'shy' | 'happy' | 'bengong' | 'dance' | 'purr'
let mg1CatEmote = null; // { text, x, y, timer }

// Card Grid Dimensions — Centered on 800x450 Canvas
const COLS = 4;
const ROWS = 4;
const CARD_W = 74;
const CARD_H = 80;
const GAP = 10;
const GRID_W = COLS * CARD_W + (COLS - 1) * GAP; // 326px
const GRID_H = ROWS * CARD_H + (ROWS - 1) * GAP; // 350px
const MG1_GRID_X = Math.round((800 - GRID_W) / 2);   // 237px
const MG1_GRID_Y = 48;                                // 48px

function shuffleCards() {
  const pairs = [...CARD_PAIRS, ...CARD_PAIRS]; // 16 cards = 8 pairs
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((p, idx) => ({
    pairId: p.id,
    emoji: p.emoji,
    label: p.label,
    color: p.color,
    col: idx % COLS,
    row: Math.floor(idx / COLS),
    idx,
    flipProgress: 0, // 0 = face-down, 1 = face-up
  }));
}

function getCardRect(card) {
  return {
    x: MG1_GRID_X + card.col * (CARD_W + GAP),
    y: MG1_GRID_Y + card.row * (CARD_H + GAP),
    w: CARD_W,
    h: CARD_H,
  };
}

function drawCard(c, card, t) {
  const { x, y, w, h } = getCardRect(card);
  const fp = card.flipProgress;

  // Card Drop Shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.2)';
  c.beginPath();
  c.roundRect(x + 2, y + 4, w, h, 8);
  c.fill();

  const isMatched = mg1Matched.includes(card.idx);
  const showFront = fp > 0.5;

  // Scale-X trick for 3D card flip
  const scaleX = Math.abs(Math.cos(fp * Math.PI));
  const cx = x + w / 2;

  c.save();
  c.translate(cx, y + h / 2);
  c.scale(scaleX < 0.04 ? 0.04 : scaleX, 1);
  c.translate(-w / 2, -h / 2);

  if (showFront) {
    // Face-up: colored card with emoji and label
    const grad = c.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(1, '#f8fafc');
    c.fillStyle = isMatched ? '#ecfdf5' : grad;
    c.beginPath();
    c.roundRect(0, 0, w, h, 8);
    c.fill();

    // Border
    c.strokeStyle = isMatched ? '#10b981' : card.color;
    c.lineWidth = isMatched ? 3 : 2;
    c.beginPath();
    c.roundRect(0, 0, w, h, 8);
    c.stroke();

    // Top colored decorative strip
    c.fillStyle = card.color;
    c.beginPath();
    c.roundRect(0, 0, w, 18, [8, 8, 0, 0]);
    c.fill();

    // Emoji icon
    c.font = '28px serif';
    c.textAlign = 'center';
    c.fillText(card.emoji, w / 2, h / 2 + 10);

    // Label
    c.font = 'bold 7px "Press Start 2P", monospace';
    c.fillStyle = '#374151';
    c.textAlign = 'center';
    c.fillText(card.label, w / 2, h - 8);

    // Matched checkmark
    if (isMatched) {
      c.fillStyle = '#10b981';
      c.font = '10px serif';
      c.fillText('✓', w - 10, 14);
    }
  } else {
    // Face-down: decorative retro gaming back
    const backGrad = c.createLinearGradient(0, 0, 0, h);
    backGrad.addColorStop(0, '#0284c7');
    backGrad.addColorStop(0.5, '#0369a1');
    backGrad.addColorStop(1, '#0c4a6e');
    c.fillStyle = backGrad;
    c.beginPath();
    c.roundRect(0, 0, w, h, 8);
    c.fill();

    // Border
    c.strokeStyle = '#38bdf8';
    c.lineWidth = 2;
    c.beginPath();
    c.roundRect(0, 0, w, h, 8);
    c.stroke();

    // Subtle diamond pattern on back
    c.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    c.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 16) {
      c.beginPath(); c.moveTo(gx, 0); c.lineTo(gx, h); c.stroke();
    }
    for (let gy = 0; gy < h; gy += 16) {
      c.beginPath(); c.moveTo(0, gy); c.lineTo(w, gy); c.stroke();
    }

    // Centered Heart icon
    c.font = '20px serif';
    c.textAlign = 'center';
    c.fillText('💝', w / 2, h / 2 + 6);

    c.font = 'bold 6.5px "Press Start 2P", monospace';
    c.fillStyle = '#fef08a';
    c.fillText('N & J', w / 2, h - 9);
  }

  c.restore();
}

function mg1DrawBackground(c, cw, ch, t) {
  // 1. Dreamy Pastel Sky Daytime Gradient (Sky Blue to Warm Morning Mist)
  const bg = c.createLinearGradient(0, 0, 0, ch);
  bg.addColorStop(0, '#38bdf8');   // vibrant sky blue
  bg.addColorStop(0.35, '#7dd3fc'); // pastel blue
  bg.addColorStop(0.68, '#bae6fd'); // soft morning mist
  bg.addColorStop(0.85, '#e0f2fe'); // light horizon glow
  bg.addColorStop(1, '#f0fdf4');   // fresh lawn tint
  c.fillStyle = bg;
  c.fillRect(0, 0, cw, ch);

  // 2. Soft Warm Sun Glow in upper sky
  c.fillStyle = 'rgba(254, 240, 138, 0.45)';
  c.beginPath();
  c.arc(cw - 95, 42, 54, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255, 255, 255, 0.65)';
  c.beginPath();
  c.arc(cw - 95, 42, 22, 0, Math.PI * 2);
  c.fill();

  // 3. Gentle Drifting Pixel Clouds (Soft Cumulus)
  c.fillStyle = 'rgba(255, 255, 255, 0.86)';
  for (let i = 0; i < 5; i++) {
    const cx = ((i * 190 + t * 0.22) % (cw + 160)) - 80;
    const cy = 24 + (i * 20) % 45;
    c.beginPath();
    c.arc(cx, cy, 18, 0, Math.PI * 2);
    c.arc(cx + 15, cy - 8, 24, 0, Math.PI * 2);
    c.arc(cx + 34, cy - 2, 20, 0, Math.PI * 2);
    c.arc(cx + 48, cy, 15, 0, Math.PI * 2);
    c.fill();
  }

  // 4. Distant Soft Mountain & Pine Ridge Silhouette
  c.fillStyle = '#0284c7';
  c.globalAlpha = 0.20;
  c.beginPath();
  c.moveTo(0, ch);
  c.lineTo(0, 175);
  c.lineTo(120, 150);
  c.lineTo(260, 165);
  c.lineTo(400, 138);
  c.lineTo(550, 160);
  c.lineTo(690, 142);
  c.lineTo(cw, 170);
  c.lineTo(cw, ch);
  c.closePath();
  c.fill();
  c.globalAlpha = 1.0;

  // ==============================================================
  // 5. PASTEL BLUE SCHOOL ACADEMY (Match Image 1 Reference)
  // Grand Symmetrical Facade with 3 Tiers of Arched Windows & Clock Tower
  // ==============================================================
  const schW = 540;
  const schH = 210;
  const schX = (cw - schW) / 2; // 130px
  const schY = 48; // Sits regally behind cards and lawn

  // Main Academy Building Block (Pastel Sky Blue Facade)
  c.fillStyle = '#bae6fd'; // pastel sky-blue facade
  c.fillRect(schX, schY + 45, schW, schH - 45);

  // Building Shadow Layer & Trim
  c.fillStyle = '#7dd3fc';
  c.fillRect(schX, schY + 45, schW, 6); // cornice top shadow
  c.fillRect(schX, schY + 115, schW, 4); // floor 2 belt trim
  c.fillRect(schX, schY + 175, schW, 4); // floor 1 belt trim

  // Crisp White Architectural Trims & Corner Pilasters
  c.fillStyle = '#ffffff';
  c.fillRect(schX - 4, schY + 43, 10, schH - 41);
  c.fillRect(schX + schW - 6, schY + 43, 10, schH - 41);
  c.fillRect(schX + 160, schY + 43, 8, schH - 41);
  c.fillRect(schX + schW - 168, schY + 43, 8, schH - 41);

  // Sky Blue Gabled Sloped Roofline across Main Building
  c.fillStyle = '#0284c7'; // deep sky-blue roof
  c.beginPath();
  c.moveTo(schX - 8, schY + 45);
  c.lineTo(schX + 30, schY + 18);
  c.lineTo(schX + schW - 30, schY + 18);
  c.lineTo(schX + schW + 8, schY + 45);
  c.closePath();
  c.fill();
  c.strokeStyle = '#ffffff';
  c.lineWidth = 2;
  c.stroke();

  // Central Clock Tower Pavilion
  const twW = 120;
  const twX = (cw - twW) / 2; // 340px
  const twY = schY - 18;

  // Tower Base & Body
  c.fillStyle = '#bae6fd';
  c.fillRect(twX, twY + 22, twW, 45);
  c.strokeStyle = '#ffffff';
  c.lineWidth = 2.5;
  c.strokeRect(twX, twY + 22, twW, 45);

  // Tower Triangular Gabled Pediment
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.moveTo(twX - 6, twY + 22);
  c.lineTo(twX + twW / 2, twY - 14);
  c.lineTo(twX + twW + 6, twY + 22);
  c.closePath();
  c.fill();
  c.strokeStyle = '#ffffff';
  c.lineWidth = 2.5;
  c.stroke();

  // White Pediment Inner Triangle
  c.fillStyle = '#f0f9ff';
  c.beginPath();
  c.moveTo(twX + 8, twY + 18);
  c.lineTo(twX + twW / 2, twY - 6);
  c.lineTo(twX + twW - 8, twY + 18);
  c.closePath();
  c.fill();

  // Clock Face (Round White Pixel Dial)
  const clockX = twX + twW / 2;
  const clockY = twY + 26;
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(clockX, clockY, 15, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#0284c7';
  c.lineWidth = 2;
  c.stroke();

  // Clock Hour Marks & Hands
  c.fillStyle = '#0369a1';
  c.fillRect(clockX - 1, clockY - 12, 2, 3); // 12
  c.fillRect(clockX - 1, clockY + 9, 2, 3);  // 6
  c.fillRect(clockX - 12, clockY - 1, 3, 2); // 9
  c.fillRect(clockX + 9, clockY - 1, 3, 2);  // 3

  // Animated Clock Hands
  const minuteAngle = t * 0.03;
  const hourAngle = t * 0.005 + 1.2;
  c.strokeStyle = '#0f172a';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(clockX, clockY);
  c.lineTo(clockX + Math.cos(minuteAngle) * 9, clockY + Math.sin(minuteAngle) * 9);
  c.moveTo(clockX, clockY);
  c.lineTo(clockX + Math.cos(hourAngle) * 6, clockY + Math.sin(hourAngle) * 6);
  c.stroke();

  // Classical Arched Windows (3 Tiers across the facade)
  // Left Wing Windows (cols 0, 1, 2) and Right Wing Windows (cols 4, 5, 6)
  const windowCols = [
    schX + 22, schX + 68, schX + 114,
    schX + schW - 150, schX + schW - 104, schX + schW - 58
  ];
  const windowFloors = [schY + 58, schY + 124]; // 2 visible upper tiers

  windowFloors.forEach(wy => {
    windowCols.forEach(wx => {
      // Arched Window Frame (White)
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.roundRect(wx, wy, 28, 42, [14, 14, 0, 0]);
      c.fill();
      c.strokeStyle = '#7dd3fc';
      c.lineWidth = 1.5;
      c.stroke();

      // Glass Panes (Sky-Blue Reflection)
      c.fillStyle = '#e0f2fe';
      c.beginPath();
      c.roundRect(wx + 3, wy + 3, 22, 36, [11, 11, 0, 0]);
      c.fill();

      // Window Mullions (Crossbars)
      c.fillStyle = '#bae6fd';
      c.fillRect(wx + 13, wy + 4, 2, 35);
      c.fillRect(wx + 3, wy + 20, 22, 2);
    });
  });

  // Central Entrance Double Doors with White Arched Portico
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(clockX - 26, schY + 165, 52, 60, [18, 18, 0, 0]);
  c.fill();
  c.fillStyle = '#0284c7';
  c.fillRect(clockX - 20, schY + 182, 18, 43);
  c.fillRect(clockX + 2, schY + 182, 18, 43);
  c.fillStyle = '#fef08a'; // Golden door knobs
  c.fillRect(clockX - 5, schY + 202, 2, 3);
  c.fillRect(clockX + 3, schY + 202, 2, 3);

  // ==============================================================
  // 6. COURTYARD GROUND & HERRINGBONE STONE PAVING (Match Image 1)
  // ==============================================================
  // Warm Peach-Ivory Brick Pathway down the center
  const courtyardGrad = c.createLinearGradient(0, 220, 0, ch);
  courtyardGrad.addColorStop(0, '#fed7aa'); // warm cobblestone
  courtyardGrad.addColorStop(0.5, '#fde68a'); // soft sunny brick
  courtyardGrad.addColorStop(1, '#fed7aa');
  c.fillStyle = courtyardGrad;
  c.fillRect(0, 225, cw, ch - 225);

  // Paved Brick Pattern Lines
  c.strokeStyle = 'rgba(217, 119, 6, 0.22)';
  c.lineWidth = 1;
  for (let py = 228; py < ch; py += 14) {
    c.beginPath();
    c.moveTo(0, py);
    c.lineTo(cw, py);
    c.stroke();
    const xShift = ((py / 14) % 2) * 16;
    for (let px = xShift; px < cw; px += 32) {
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(px, py + 14);
      c.stroke();
    }
  }

  // Soft Green Lawn Borders along courtyard sides
  const lawnL = c.createLinearGradient(0, 0, 180, 0);
  lawnL.addColorStop(0, '#22c55e');
  lawnL.addColorStop(0.7, '#16a34a');
  lawnL.addColorStop(1, 'rgba(22, 163, 74, 0)');
  c.fillStyle = lawnL;
  c.fillRect(0, 220, 180, ch - 220);

  const lawnR = c.createLinearGradient(cw - 180, 0, cw, 0);
  lawnR.addColorStop(0, 'rgba(22, 163, 74, 0)');
  lawnR.addColorStop(0.3, '#16a34a');
  lawnR.addColorStop(1, '#22c55e');
  c.fillStyle = lawnR;
  c.fillRect(cw - 180, 220, 180, ch - 220);

  // ==============================================================
  // 7. MAGNIFICENT PINK SAKURA CHERRY BLOSSOM TREES (Match Image 1)
  // Large Luscious Pink Blossom Canopies Flanking Left and Right!
  // ==============================================================
  // LEFT SAKURA TREE
  // Sturdy warm trunk & branches
  c.fillStyle = '#6b3710';
  c.fillRect(18, 120, 24, 160);
  c.fillStyle = '#52280a';
  c.fillRect(20, 120, 8, 160);
  // Branch splits
  c.beginPath();
  c.moveTo(30, 160);
  c.lineTo(85, 110);
  c.lineTo(92, 116);
  c.lineTo(34, 172);
  c.closePath();
  c.fill();

  // Left Pink Sakura Canopy (Fluffy Clouds of Cherry Blossom Petals)
  const leftSakuraClusters = [
    { x: 30,  y: 75,  r: 52, col: '#fbcfe8' },
    { x: 85,  y: 65,  r: 48, col: '#f472b6' },
    { x: 135, y: 80,  r: 42, col: '#fbcfe8' },
    { x: 55,  y: 40,  r: 44, col: '#fda4af' },
    { x: 105, y: 35,  r: 40, col: '#fbcfe8' },
    { x: 155, y: 65,  r: 34, col: '#f472b6' },
    { x: 185, y: 95,  r: 28, col: '#fda4af' },
  ];
  leftSakuraClusters.forEach(cl => {
    c.fillStyle = cl.col;
    c.beginPath();
    c.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
    c.fill();
    // Inner softer blossom highlight
    c.fillStyle = 'rgba(255, 255, 255, 0.45)';
    c.beginPath();
    c.arc(cl.x - cl.r * 0.25, cl.y - cl.r * 0.25, cl.r * 0.55, 0, Math.PI * 2);
    c.fill();
  });

  // RIGHT SAKURA TREE (Flanking Right Side of Academy)
  c.fillStyle = '#6b3710';
  c.fillRect(cw - 42, 120, 24, 160);
  c.fillStyle = '#52280a';
  c.fillRect(cw - 40, 120, 8, 160);
  c.beginPath();
  c.moveTo(cw - 32, 160);
  c.lineTo(cw - 88, 110);
  c.lineTo(cw - 95, 116);
  c.lineTo(cw - 36, 172);
  c.closePath();
  c.fill();

  const rightSakuraClusters = [
    { x: cw - 30,  y: 75,  r: 50, col: '#fbcfe8' },
    { x: cw - 80,  y: 65,  r: 46, col: '#f472b6' },
    { x: cw - 130, y: 80,  r: 40, col: '#fbcfe8' },
    { x: cw - 55,  y: 38,  r: 42, col: '#fda4af' },
    { x: cw - 105, y: 34,  r: 38, col: '#fbcfe8' },
    { x: cw - 150, y: 68,  r: 32, col: '#f472b6' },
  ];
  rightSakuraClusters.forEach(cl => {
    c.fillStyle = cl.col;
    c.beginPath();
    c.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255, 255, 255, 0.45)';
    c.beginPath();
    c.arc(cl.x - cl.r * 0.25, cl.y - cl.r * 0.25, cl.r * 0.55, 0, Math.PI * 2);
    c.fill();
  });

  // 8. Ivy Vines & Blossom Petals on Trunks
  drawPixelFlower(c, 26, 210, 'vine', t);
  drawPixelFlower(c, cw - 34, 210, 'vine', t);

  // 9. Diverse Swaying Wildflowers across the courtyard lawn edges
  const flowers = [
    { x: 35, y: 395, type: 'daisy' },
    { x: 75, y: 410, type: 'tulip' },
    { x: 125, y: 385, type: 'wildflower' },
    { x: 190, y: 420, type: 'heart' },
    { x: 280, y: 425, type: 'daisy' },
    { x: 380, y: 415, type: 'wildflower' },
    { x: 470, y: 428, type: 'tulip' },
    { x: 550, y: 420, type: 'heart' },
    { x: 640, y: 410, type: 'daisy' },
    { x: 730, y: 425, type: 'wildflower' },
    { x: 775, y: 395, type: 'tulip' },
  ];
  flowers.forEach(f => {
    drawPixelFlower(c, f.x, f.y, f.type, t);
  });

  // 10. Pink Sakura Blossom Petals Drifting in the Gentle Spring Breeze
  drawDriftingPetals(c, cw, ch, t);
}

function drawSidePanels(c, cw, ch, t) {
  // Center Lawn Mat for Cards (grounds the 16 cards seamlessly)
  c.fillStyle = 'rgba(255, 251, 235, 0.94)';
  c.beginPath();
  c.roundRect(227, 38, 346, 370, 12);
  c.fill();
  c.strokeStyle = '#86efac';
  c.lineWidth = 2;
  c.stroke();

  // Subtle stitched picnic inner border
  c.strokeStyle = 'rgba(22, 163, 74, 0.35)';
  c.setLineDash([4, 4]);
  c.strokeRect(233, 44, 334, 358);
  c.setLineDash([]);

  // ==========================================
  // LEFT: Park Bench & Nidan & Jinan Under Tree
  // ==========================================

  // Natural wooden park bench
  c.fillStyle = '#78350f';
  c.beginPath();
  c.roundRect(34, 260, 166, 9, 3);
  c.fill();
  c.fillStyle = '#451a03';
  c.fillRect(44, 269, 8, 24);
  c.fillRect(182, 269, 8, 24);
  c.fillStyle = '#92400e';
  c.fillRect(36, 236, 162, 6);
  c.fillRect(36, 246, 162, 6);
  c.fillRect(50, 232, 6, 28);
  c.fillRect(174, 232, 6, 28);

  // Nidan (left) & Jinan (right) sitting together happily
  drawStudentPixelChar(c, 46, 222, false, 'idle', t, null);
  drawGirlfriendPixelChar(c, 138, 222, true, 'idle', t, 'heart');

  // Cute Blushing Shy Meme Cat sitting between their feet!
  drawPixelCat(c, 94, 252, mg1CatMood, t);

  // Render floating reaction emote if active
  if (mg1CatEmote && mg1CatEmote.timer > 0) {
    drawFloatingCatEmote(c, mg1CatEmote.x, mg1CatEmote.y, mg1CatEmote.text, t, mg1CatEmote.timer / 25);
    mg1CatEmote.timer--;
    if (mg1CatEmote.timer === 0 && mg1Phase === 'playing') {
      mg1CatMood = 'shy';
    }
  }

  // Organic Speech Bubble floating above Jinan with safe text wrapping
  // Positioned with exact height calculation so it never overlaps characters or bench
  c.font = '10.5px "Plus Jakarta Sans", -apple-system, sans-serif';
  const cheerLines = wrapCanvasText(c, mg1CheerText, 188 - 24);
  const totalBubbleH = 24 + 18 + Math.max(1, cheerLines.length) * 15;
  const bubbleY = Math.max(16, 182 - totalBubbleH);

  drawAdaptiveSpeechBubble(c, {
    x: 22,
    y: bubbleY,
    width: 188,
    title: 'JINAN BERKATA:',
    titleColor: '#be185d',
    text: mg1CheerText,
    textColor: '#1e293b',
    bg: '#ffffff',
    border: '#f472b6',
    font: '10.5px "Plus Jakarta Sans", -apple-system, sans-serif',
    lineHeight: 15,
    pointerX: 154,
    pointerDir: 'down'
  });

  // Wooden Garden Signpost (Score & Progress)
  c.fillStyle = '#78350f';
  c.beginPath();
  c.roundRect(30, 302, 174, 76, 8);
  c.fill();
  c.strokeStyle = '#b45309';
  c.lineWidth = 1.5;
  c.stroke();

  c.fillStyle = '#451a03';
  c.fillRect(113, 378, 8, 30);

  c.font = 'bold 7px "Press Start 2P", monospace';
  c.fillStyle = '#fef08a';
  c.textAlign = 'center';
  c.fillText(`PASANGAN : ${mg1PairsFound} / 8`, 117, 322);

  c.font = '6.5px "Press Start 2P", monospace';
  c.fillStyle = '#7dd3fc';
  c.fillText(`PERCOBAAN: ${mg1Attempts}`, 117, 342);

  const stars = mg1Attempts <= 12 ? '★★★' : mg1Attempts <= 18 ? '★★☆' : '★☆☆';
  c.font = '13px serif';
  c.fillStyle = '#fbbf24';
  c.fillText(stars, 117, 362);

  // ==========================================
  // RIGHT: Rustic Wooden Bulletin Noticeboard
  // ==========================================
  // Sleepy Loaf Cat curled up on top edge of noticeboard!
  drawPixelCat(c, 746, 24, 'loaf', t, 0.9);

  c.fillStyle = '#78350f';
  c.beginPath();
  c.roundRect(590, 38, 196, 370, 10);
  c.fill();
  c.strokeStyle = '#b45309';
  c.lineWidth = 2;
  c.stroke();

  c.fillStyle = '#fef3c7';
  c.beginPath();
  c.roundRect(596, 44, 184, 358, 6);
  c.fill();

  c.fillStyle = '#0284c7';
  c.beginPath();
  c.roundRect(602, 50, 172, 28, 6);
  c.fill();
  c.font = 'bold 7.5px "Press Start 2P", monospace';
  c.fillStyle = '#ffffff';
  c.textAlign = 'center';
  c.fillText('MEMORI SEKOLAH', 688, 68);

  // 8 Childhood Memory Items
  CARD_PAIRS.forEach((item, i) => {
    const isFound = mg1Cards.some(card => card.pairId === item.id && mg1Matched.includes(card.idx));
    const itemY = 88 + i * 38;

    c.fillStyle = isFound ? '#ecfdf5' : '#ffffff';
    c.beginPath();
    c.roundRect(604, itemY, 168, 32, 6);
    c.fill();
    c.strokeStyle = isFound ? '#10b981' : '#e2e8f0';
    c.lineWidth = isFound ? 1.5 : 1;
    c.stroke();

    c.font = '14px serif';
    c.textAlign = 'left';
    c.fillText(item.emoji, 612, itemY + 22);

    c.font = 'bold 6.5px "Press Start 2P", monospace';
    c.fillStyle = isFound ? '#065f46' : '#64748b';
    c.fillText(item.label, 636, itemY + 20);

    if (isFound) {
      c.fillStyle = '#10b981';
      c.font = 'bold 11px sans-serif';
      c.textAlign = 'right';
      c.fillText('✓', 762, itemY + 22);
    }
  });
}

function mg1DrawWon(c, cw, ch) {
  const grad = c.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#064e3b');
  grad.addColorStop(1, '#059669');
  c.fillStyle = grad;
  c.fillRect(0, 0, cw, ch);

  for (let i = 0; i < 18; i++) {
    const sx = (i * 89 + mg1T * 2) % cw;
    const sy = (i * 47) % ch;
    c.fillStyle = i % 2 === 0 ? '#fbbf24' : '#f472b6';
    c.font = '14px serif';
    c.textAlign = 'center';
    c.fillText(i % 2 === 0 ? '⭐' : '💝', sx, sy);
  }

  c.fillStyle = 'rgba(255, 255, 255, 0.96)';
  c.beginPath();
  c.roundRect(cw / 2 - 160, ch / 2 - 120, 320, 240, 16);
  c.fill();
  c.strokeStyle = '#10b981';
  c.lineWidth = 3;
  c.stroke();

  c.font = 'bold 11px "Press Start 2P", monospace';
  c.fillStyle = '#059669';
  c.textAlign = 'center';
  c.fillText('SEMUA KENANGAN', cw / 2, ch / 2 - 75);
  c.fillText('BERHASIL DITEMUKAN! 💝', cw / 2, ch / 2 - 55);

  c.font = '8px "Press Start 2P", monospace';
  c.fillStyle = '#374151';
  c.fillText(`Total Percobaan: ${mg1Attempts}`, cw / 2, ch / 2 - 15);

  const rating = mg1Attempts <= 12 ? '⭐⭐⭐ Sempurna!' : mg1Attempts <= 18 ? '⭐⭐☆ Bagus Banget!' : '★☆☆ Hebat!';
  c.font = '16px serif';
  c.fillText(rating, cw / 2, ch / 2 + 20);

  c.font = '7px "Press Start 2P", monospace';
  c.fillStyle = '#6b7280';
  c.fillText('Jinan datang menyambutmu... ♡', cw / 2, ch / 2 + 55);
}

function handleFlipAnimations(dt) {
  mg1Cards.forEach(card => {
    const isFlipped = mg1Flipped.includes(card.idx);
    const isMatched = mg1Matched.includes(card.idx);
    const targetFP = (isFlipped || isMatched) ? 1 : 0;

    if (card.flipProgress < targetFP) {
      card.flipProgress = Math.min(card.flipProgress + dt * 4, targetFP);
    } else if (card.flipProgress > targetFP) {
      card.flipProgress = Math.max(card.flipProgress - dt * 4, targetFP);
    }
  });
}

function mg1Loop() {
  if (!mg1Ctx) return;
  mg1T += 0.5;
  handleFlipAnimations(0.06);

  const cw = mg1Canvas.width;
  const ch = mg1Canvas.height;
  mg1Ctx.clearRect(0, 0, cw, ch);

  if (mg1Phase === 'won') {
    mg1DrawWon(mg1Ctx, cw, ch);
  } else {
    mg1DrawBackground(mg1Ctx, cw, ch, mg1T);
    drawSidePanels(mg1Ctx, cw, ch, mg1T);
    mg1Cards.forEach(card => drawCard(mg1Ctx, card, mg1T));
  }

  mg1AnimId = requestAnimationFrame(mg1Loop);
}

function getClickedCard(x, y) {
  for (const card of mg1Cards) {
    const r = getCardRect(card);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
      return card;
    }
  }
  return null;
}

function handleCardClick(x, y) {
  if (mg1Locked || mg1Phase !== 'playing') return;

  const card = getClickedCard(x, y);
  if (!card) return;
  if (mg1Matched.includes(card.idx)) return;
  if (mg1Flipped.includes(card.idx)) return;
  if (mg1Flipped.length >= 2) return;

  SoundEngine.cardFlip && SoundEngine.cardFlip();
  mg1Flipped.push(card.idx);

  if (mg1Flipped.length === 2) {
    mg1Attempts++;
    mg1Locked = true;

    const [a, b] = mg1Flipped;
    const cardA = mg1Cards[a];
    const cardB = mg1Cards[b];

    if (cardA.pairId === cardB.pairId) {
      // Match!
      mg1Matched.push(a, b);
      mg1Flipped = [];
      mg1PairsFound++;
      mg1Locked = false;
      mg1CheerText = 'Wah cocok! Keren banget, Sayang! ♡';
      SoundEngine.cardMatch && SoundEngine.cardMatch();
      mg1CatMood = 'happy';
      mg1CatEmote = null;

      if (mg1PairsFound === 8) {
        mg1Phase = 'won';
        mg1CatMood = 'dance';
        mg1CatEmote = null;
        mg1CheerText = 'Semua kenangan terbuka! Luar biasa! 💝';
        SoundEngine.fanfare && SoundEngine.fanfare();
        setTimeout(() => {
          if (mg1OnComplete) mg1OnComplete();
        }, 2200);
      }
    } else {
      // No match — flip back after brief pause
      mg1CheerText = 'Coba ingat-ingat lagi posisinya yaa~';
      SoundEngine.cardMismatch && SoundEngine.cardMismatch();
      mg1CatMood = 'bengong';
      mg1CatEmote = null;
      setTimeout(() => {
        mg1Flipped = [];
        mg1Locked = false;
      }, 700);
    }
  }
}

/**
 * Bulletproof coordinate mapping regardless of element scale or letterboxing
 */
function mg1GetCanvasCoords(canvas, e) {
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

function mg1OnCanvasClick(e) {
  const { x, y } = mg1GetCanvasCoords(mg1Canvas, e);

  // Easter egg: Click on Bench Cat (near Nidan & Jinan)
  if (x >= 75 && x <= 125 && y >= 235 && y <= 275) {
    SoundEngine.catMeow && SoundEngine.catMeow();
    mg1CatMood = 'happy';
    mg1CatEmote = { text: 'Mew! Nidan hebat! 🐾', x: 94, y: 228, timer: 100 };
    return;
  }

  // Easter egg: Click on Noticeboard Sleepy Loaf Cat
  if (x >= 720 && x <= 775 && y >= 10 && y <= 45) {
    SoundEngine.catMeow && SoundEngine.catMeow();
    mg1CatEmote = { text: 'Purrr~ N & J ♡', x: 746, y: 15, timer: 100 };
    return;
  }

  if (mg1Phase === 'playing') {
    handleCardClick(x, y);
  }
}

function mg1OnCanvasTouch(e) {
  e.preventDefault();
  const { x, y } = mg1GetCanvasCoords(mg1Canvas, e);
  if (mg1Phase === 'playing') {
    handleCardClick(x, y);
  }
}

export function startMiniGame1(canvas, onComplete) {
  stopMiniGame1();

  mg1Canvas = canvas;
  mg1Ctx = canvas.getContext('2d');
  mg1OnComplete = onComplete;
  mg1T = 0;
  mg1CheerText = 'Cari pasangan kartunya ya, Nidan! ♡';

  // Immediately initialize game world, cards & characters so Room 1 is never empty
  mg1StartPlaying();

  mg1Canvas.addEventListener('click', mg1OnCanvasClick);
  mg1Canvas.addEventListener('touchstart', mg1OnCanvasTouch, { passive: false });

  if (mg1AnimId) cancelAnimationFrame(mg1AnimId);
  mg1AnimId = requestAnimationFrame(mg1Loop);
}

function mg1StartPlaying() {
  mg1Phase = 'playing';
  mg1Cards = shuffleCards();
  mg1Cards.forEach(c => { c.flipProgress = 0; });
  mg1Flipped = [];
  mg1Matched = [];
  mg1Attempts = 0;
  mg1PairsFound = 0;
  mg1Locked = false;
  mg1CheerText = 'Cari pasangan kartunya ya, Nidan! ♡';
}

export function retryMiniGame1() {
  mg1StartPlaying();
}

export function stopMiniGame1() {
  if (mg1AnimId) {
    cancelAnimationFrame(mg1AnimId);
    mg1AnimId = null;
  }
  if (mg1Canvas) {
    mg1Canvas.removeEventListener('click', mg1OnCanvasClick);
    mg1Canvas.removeEventListener('touchstart', mg1OnCanvasTouch);
  }
}
