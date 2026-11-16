/* ===================================================
   GAME ENGINE MODULE — PLAYER TWO, FOREVER 💜
   Natural Open-World Parallax, Racing Physics, & 8-Step Room Surprise
   Nidan & Jinan Adventure
=================================================== */

import { GAME_W, GAME_H } from './data.js';
import { SoundEngine } from './sound.js';
import { showScreen, setupButton } from './navigation.js';
import {
  playerState,
  getActivePlayer,
  updatePlayerPhysics,
  renderPlayers,
  switchActiveCharacter,
  setCutsceneMode,
  setPlayerEmote,
  rectsOverlap
} from './player.js';
import { drawCollectible, drawStarItem } from './collectibles.js';
import {
  puzzleState,
  drawPuzzleElements,
  handlePuzzleInteraction
} from './puzzle-system.js';
import {
  ALL_ROOMS,
  currentRoomIdx,
  getCurrentRoom,
  loadRoom,
  loadNextRoom
} from './room-manager.js';
import { STORYBOOK_PAGES } from '../data/stories.js';
import { SYMBOLIC_ARTIFACTS } from '../data/memories.js';
import { triggerFinalSurprise } from './finale.js';
import { keys, touchControls } from './controls.js';

let canvas = null;
let ctx = null;

export const camera = { x: 0, y: 0 };
const playerParticles = [];

export const gameState = {
  totalStars: 0,
  collectedItems: {},
  collectedStars: {},
  movingPlats: [],
  gateUnlocked: false,
  surpriseTriggered: {},
  animT: 0
};

export let isGameRunning = false;
export let isPaused = false;
let animFrameId = null;

// Mini-game integration hook — set by main.js to avoid circular imports
let _miniGameLauncher = null;
export function setMiniGameLauncher(fn) { _miniGameLauncher = fn; }
export function getMiniGameLauncher() { return _miniGameLauncher; }

function getWorldWidth() {
  return currentRoomIdx === 2 ? 1900 : 1200;
}

function initCanvas() {
  if (!canvas) {
    canvas = document.getElementById('gameCanvas');
    if (canvas) ctx = canvas.getContext('2d');
  }
}

/* ===================================================
   PARALLAX SCENERY & NATURAL OPEN-WORLD ART DIRECTION
   Dominant Sky Blue, Ocean Blue, Soft Pink & Natural Greens
=================================================== */
function drawParallaxBackground(c, t) {
  const room = getCurrentRoom();
  const theme = room.theme;
  const camX = camera.x;
  const roomW = getWorldWidth();

  if (theme === 'sunny-schoolyard') {
    // --- ROOM 1: SUNNY SCHOOLYARD & NOSTALGIA ---
    // 1. Sky Blue Daytime Atmosphere
    const skyGrad = c.createLinearGradient(0, 0, 0, GAME_H);
    skyGrad.addColorStop(0, '#0284c7');
    skyGrad.addColorStop(0.45, '#38bdf8');
    skyGrad.addColorStop(0.85, '#7dd3fc');
    skyGrad.addColorStop(1, '#e0f2fe');
    c.fillStyle = skyGrad;
    c.fillRect(0, 0, GAME_W, GAME_H);

    // 2. Warm Morning Sun
    const sunX = 680 - camX * 0.03;
    c.fillStyle = '#fef08a';
    c.beginPath();
    c.arc(sunX, 60, 26, 0, Math.PI * 2);
    c.fill();
    // Sun rays glow
    const rayPulse = Math.sin(t * 0.05) * 4;
    c.fillStyle = 'rgba(254, 240, 138, 0.25)';
    c.beginPath();
    c.arc(sunX, 60, 48 + rayPulse, 0, Math.PI * 2);
    c.fill();

    // 3. Drifting Fluffy Cumulus Clouds (Parallax 0.08x)
    c.fillStyle = 'rgba(255, 255, 255, 0.82)';
    for (let cl = 0; cl < 6; cl++) {
      const cx = (cl * 220 + t * 0.4 - camX * 0.08) % (GAME_W + 200) - 100;
      const cy = 40 + (cl * 23) % 70;
      c.beginPath();
      c.arc(cx, cy, 22, 0, Math.PI * 2);
      c.arc(cx + 18, cy - 8, 28, 0, Math.PI * 2);
      c.arc(cx + 42, cy, 22, 0, Math.PI * 2);
      c.fill();
    }

    // 4. Distant Lush Green Mountain Ridge (Parallax 0.15x)
    c.fillStyle = '#166534';
    c.beginPath();
    c.moveTo(0, GAME_H);
    c.lineTo(0, 260);
    c.lineTo(160 - camX * 0.15, 210);
    c.lineTo(380 - camX * 0.15, 270);
    c.lineTo(620 - camX * 0.15, 190);
    c.lineTo(890 - camX * 0.15, 260);
    c.lineTo(1150 - camX * 0.15, 200);
    c.lineTo(GAME_W, 250);
    c.lineTo(GAME_W, GAME_H);
    c.closePath();
    c.fill();

    // 5. Midground Pastel Blue School Academy & Clock Tower (Parallax 0.35x, Match Image 1)
    c.fillStyle = '#bae6fd'; // pastel sky-blue facade
    for (let s = 0; s < 7; s++) {
      const sx = s * 240 + 40 - (camX * 0.35);
      const sh = 130 + ((s * 29) % 50);
      c.fillStyle = '#bae6fd';
      c.fillRect(sx, GAME_H - sh, 140, sh);

      // Sky Blue Gabled Sloped Roofline
      c.fillStyle = '#0284c7';
      c.beginPath();
      c.moveTo(sx - 4, GAME_H - sh);
      c.lineTo(sx + 70, GAME_H - sh - 28);
      c.lineTo(sx + 144, GAME_H - sh);
      c.fill();

      // Arched White Windows
      c.fillStyle = '#ffffff';
      for (let r = 0; r < 2; r++) {
        for (let col = 0; col < 3; col++) {
          c.beginPath();
          c.roundRect(sx + 20 + col * 36, GAME_H - sh + 24 + r * 30, 18, 24, [9, 9, 0, 0]);
          c.fill();
        }
      }

      // School Clock Tower with Round White Dial
      if (s === 1 || s === 4) {
        c.fillStyle = '#bae6fd';
        c.fillRect(sx + 50, GAME_H - sh - 55, 40, 30);
        c.fillStyle = '#0284c7';
        c.beginPath();
        c.moveTo(sx + 45, GAME_H - sh - 55);
        c.lineTo(sx + 70, GAME_H - sh - 75);
        c.lineTo(sx + 95, GAME_H - sh - 55);
        c.fill();
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(sx + 70, GAME_H - sh - 40, 9, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = '#0284c7';
        c.lineWidth = 1;
        c.stroke();
      }

      // Pink Sakura Cherry Blossom Tree beside building (Image 1)
      c.fillStyle = '#fbcfe8';
      c.beginPath();
      c.arc(sx + 155, GAME_H - sh + 20, 24, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#f472b6';
      c.beginPath();
      c.arc(sx + 162, GAME_H - sh + 15, 18, 0, Math.PI * 2);
      c.fill();
    }

  } else if (theme === 'playful-beach') {
    // --- ROOM 2: PLAYFUL BEACH & SHORELINE ---
    // 1. Tropical Deep Turquoise & Sky Gradient
    const oceanGrad = c.createLinearGradient(0, 0, 0, GAME_H);
    oceanGrad.addColorStop(0, '#0369a1');
    oceanGrad.addColorStop(0.4, '#38bdf8');
    oceanGrad.addColorStop(0.75, '#7dd3fc');
    oceanGrad.addColorStop(1, '#fef08a');
    c.fillStyle = oceanGrad;
    c.fillRect(0, 0, GAME_W, GAME_H);

    // 2. Horizon Distant Islands with Green Palms (Parallax 0.12x)
    c.fillStyle = '#0f766e';
    for (let is = 0; is < 4; is++) {
      const ix = is * 320 + 80 - (camX * 0.12);
      c.beginPath();
      c.ellipse(ix, 260, 65, 18, 0, 0, Math.PI * 2);
      c.fill();
      // Tiny palm trunk
      c.fillStyle = '#78350f';
      c.fillRect(ix - 2, 235, 3, 20);
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(ix, 235, 12, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#0f766e';
    }

    // 3. Shimmering Turquoise Ocean Waves with Animated Rolling Foam
    for (let w = 0; w < 4; w++) {
      const waveY = 270 + w * 28;
      const waveSpeed = t * (0.04 + w * 0.02);
      c.fillStyle = w % 2 === 0 ? 'rgba(2, 132, 199, 0.75)' : 'rgba(14, 165, 233, 0.7)';
      c.beginPath();
      c.moveTo(0, GAME_H);
      c.lineTo(0, waveY);
      for (let x = 0; x <= GAME_W; x += 30) {
        const wy = waveY + Math.sin(x * 0.015 + waveSpeed) * (4 + w * 1.5);
        c.lineTo(x, wy);
      }
      c.lineTo(GAME_W, GAME_H);
      c.closePath();
      c.fill();

      // White Wave Crest Foam
      c.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      c.lineWidth = 2;
      c.beginPath();
      for (let x = 0; x <= GAME_W; x += 40) {
        const wy = waveY + Math.sin(x * 0.015 + waveSpeed) * (4 + w * 1.5);
        if (x === 0) c.moveTo(x, wy);
        else c.lineTo(x, wy);
      }
      c.stroke();
    }

    // 4. Coconut Palm Trees along the Beach Shoreline (Parallax 0.5x)
    for (let p = 0; p < 5; p++) {
      const px = p * 280 + 100 - (camX * 0.5);
      // Bent Palm Trunk
      c.strokeStyle = '#78350f';
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(px, 420);
      c.quadraticCurveTo(px + 20, 310, px + 12, 230);
      c.stroke();

      // Palm Fronds (Lush Green)
      c.fillStyle = '#15803d';
      c.beginPath();
      c.ellipse(px + 12, 225, 34, 14, -0.4, 0, Math.PI * 2);
      c.ellipse(px + 12, 225, 34, 14, 0.4, 0, Math.PI * 2);
      c.ellipse(px + 12, 225, 30, 12, 1.2, 0, Math.PI * 2);
      c.fill();

      // Coconuts
      c.fillStyle = '#451a03';
      c.beginPath();
      c.arc(px + 10, 235, 4, 0, Math.PI * 2);
      c.arc(px + 16, 236, 4, 0, Math.PI * 2);
      c.fill();
    }

  } else if (theme === 'ocean-racing') {
    // --- ROOM 3: OCEAN RACING HIGHWAY ---
    // 1. Wide Blue Marine Sky
    const raceGrad = c.createLinearGradient(0, 0, 0, GAME_H);
    raceGrad.addColorStop(0, '#0c4a6e');
    raceGrad.addColorStop(0.35, '#0284c7');
    raceGrad.addColorStop(0.8, '#38bdf8');
    raceGrad.addColorStop(1, '#bae6fd');
    c.fillStyle = raceGrad;
    c.fillRect(0, 0, GAME_W, GAME_H);

    // 2. Distant Horizon Islands (Parallax 0.1x)
    c.fillStyle = '#0f766e';
    for (let i = 0; i < 6; i++) {
      const ix = i * 360 + 50 - (camX * 0.1);
      c.beginPath();
      c.ellipse(ix, 250, 75, 16, 0, 0, Math.PI * 2);
      c.fill();
    }

    // 3. Rolling Ocean Waves with High-Speed Foam Streaks
    for (let r = 0; r < 3; r++) {
      const waveY = 270 + r * 35;
      const speed = t * 0.08 + r * 2;
      c.fillStyle = r === 0 ? 'rgba(3, 105, 161, 0.75)' : 'rgba(2, 132, 199, 0.7)';
      c.beginPath();
      c.moveTo(0, GAME_H);
      c.lineTo(0, waveY);
      for (let x = 0; x <= GAME_W; x += 40) {
        c.lineTo(x, waveY + Math.sin(x * 0.02 + speed) * 5);
      }
      c.lineTo(GAME_W, GAME_H);
      c.closePath();
      c.fill();
    }

    // Speed Lines if moving fast
    const boy = playerState.boy;
    if (Math.abs(boy.vx) > 3) {
      c.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      c.lineWidth = 1.5;
      for (let sl = 0; sl < 10; sl++) {
        const lx = (sl * 95 + t * 24) % GAME_W;
        const ly = 120 + (sl * 31) % 200;
        c.beginPath();
        c.moveTo(lx, ly);
        c.lineTo(lx - 28, ly);
        c.stroke();
      }
    }

  } else if (theme === 'mountain-camping') {
    // --- ROOM 4: MOUNTAIN SUNSET & STARLIT CAMPING ---
    // 1. Sunset-to-Twilight Starlit Gradient
    const sunsetGrad = c.createLinearGradient(0, 0, 0, GAME_H);
    sunsetGrad.addColorStop(0, '#07152b'); // Deep starry navy
    sunsetGrad.addColorStop(0.35, '#1e1b4b'); // Twilight violet
    sunsetGrad.addColorStop(0.7, '#701a75'); // Magenta glow
    sunsetGrad.addColorStop(1, '#ea580c'); // Warm sunset horizon
    c.fillStyle = sunsetGrad;
    c.fillRect(0, 0, GAME_W, GAME_H);

    // 2. Evening Starlight Twinkling
    c.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let st = 0; st < 28; st++) {
      const sx = (st * 53 - camX * 0.03 + 900) % GAME_W;
      const sy = (st * 19) % 150 + 10;
      const twinkle = Math.sin(t * 0.06 + st) * 0.4 + 0.6;
      c.globalAlpha = twinkle;
      c.fillRect(sx, sy, 1.5, 1.5);
    }
    c.globalAlpha = 1.0;

    // 3. Layered Craggy Mountain Silhouettes (Parallax 0.18x & 0.35x)
    // Far Mountains
    c.fillStyle = '#311042';
    c.beginPath();
    c.moveTo(0, GAME_H);
    c.lineTo(0, 280);
    c.lineTo(190 - camX * 0.18, 190);
    c.lineTo(410 - camX * 0.18, 260);
    c.lineTo(680 - camX * 0.18, 170);
    c.lineTo(950 - camX * 0.18, 250);
    c.lineTo(1180 - camX * 0.18, 180);
    c.lineTo(GAME_W, 270);
    c.lineTo(GAME_W, GAME_H);
    c.closePath();
    c.fill();

    // Mid Mountains with Pine Silhouettes
    c.fillStyle = '#164e28';
    c.beginPath();
    c.moveTo(0, GAME_H);
    c.lineTo(0, 320);
    c.lineTo(240 - camX * 0.32, 250);
    c.lineTo(520 - camX * 0.32, 310);
    c.lineTo(790 - camX * 0.32, 230);
    c.lineTo(1040 - camX * 0.32, 300);
    c.lineTo(GAME_W, 260);
    c.lineTo(GAME_W, GAME_H);
    c.closePath();
    c.fill();

    // Pine Trees on Ridge
    c.fillStyle = '#0f381e';
    for (let pt = 0; pt < 14; pt++) {
      const px = pt * 90 + 30 - (camX * 0.32);
      const py = 290 + Math.sin(pt * 1.5) * 35;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(px + 8, py + 24);
      c.lineTo(px - 8, py + 24);
      c.closePath();
      c.fill();
    }
  }
}

/* ===================================================
   PLATFORMS, GATES & SPRINGS (Themed Pixel Art)
=================================================== */
function drawPlatform(p) {
  const rx = p.x - camera.x;
  if (rx + p.w < -20 || rx > GAME_W + 20) return;

  const room = getCurrentRoom();
  const theme = room.theme;

  if (theme === 'sunny-schoolyard') {
    // Green Grassy Lawn Platform with Earth Base
    ctx.fillStyle = p.col || '#15803d';
    ctx.fillRect(rx, p.y, p.w, p.h);
    // Grass top blades
    ctx.fillStyle = p.border || '#4ade80';
    ctx.fillRect(rx, p.y, p.w, 4);
    // Subtle blade tufts
    for (let i = 4; i < p.w - 4; i += 12) {
      ctx.fillRect(rx + i, p.y - 2, 2, 3);
    }
  } else if (theme === 'playful-beach') {
    // Golden Beach Sand or Wooden Pier
    ctx.fillStyle = p.col || '#d97706';
    ctx.fillRect(rx, p.y, p.w, p.h);
    ctx.fillStyle = p.border || '#fde047';
    ctx.fillRect(rx, p.y, p.w, 3.5);
  } else if (theme === 'ocean-racing') {
    // Marine Ocean Pier or Water Track
    ctx.fillStyle = p.col || '#0284c7';
    ctx.fillRect(rx, p.y, p.w, p.h);
    ctx.fillStyle = p.border || '#38bdf8';
    ctx.fillRect(rx, p.y, p.w, 3.5);
  } else {
    // Mountain Forest Grass Platform with Wildflowers
    ctx.fillStyle = p.col || '#15803d';
    ctx.fillRect(rx, p.y, p.w, p.h);
    ctx.fillStyle = p.border || '#4ade80';
    ctx.fillRect(rx, p.y, p.w, 3.5);
    // Tiny pink wildflower accents
    ctx.fillStyle = '#f472b6';
    for (let f = 10; f < p.w - 10; f += 28) {
      ctx.fillRect(rx + f, p.y - 3, 3, 3);
    }
  }
}

function drawSpring(sp) {
  const rx = sp.x - camera.x;
  // Metallic Base Plate
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(rx, sp.y + sp.h - 3, sp.w, 3);

  // Coiled Spring Rings
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(rx + 4, sp.y + 5, sp.w - 8, 2);
  ctx.fillRect(rx + 5, sp.y + 9, sp.w - 10, 2);

  // Cushioned Bounce Pad
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(rx + 2, sp.y + 1, sp.w - 4, 4);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(rx + 3, sp.y, sp.w - 6, 2);
}

function drawGate(gate, isOpen, t) {
  const gx = gate.x - camera.x;
  const gy = gate.y;

  ctx.save();
  if (isOpen) {
    // Active Shimmering Celestial Portal
    const portalAura = ctx.createRadialGradient(gx, gy - 26, 6, gx, gy - 26, 32);
    portalAura.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
    portalAura.addColorStop(0.6, 'rgba(56, 189, 248, 0.4)');
    portalAura.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = portalAura;
    ctx.beginPath();
    ctx.arc(gx, gy - 26, 32, 0, Math.PI * 2);
    ctx.fill();

    // Portal archway
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(gx - 18, gy - 50, 4, 50);
    ctx.fillRect(gx + 14, gy - 50, 4, 50);
    ctx.fillRect(gx - 18, gy - 50, 36, 5);

    // Glowing core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(gx, gy - 24, 10, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('ENTER', gx, gy - 58);
  } else {
    // Sealed archway awaiting objective completion
    ctx.fillStyle = '#334155';
    ctx.fillRect(gx - 16, gy - 46, 4, 46);
    ctx.fillRect(gx + 12, gy - 46, 4, 46);
    ctx.fillRect(gx - 16, gy - 46, 32, 4);

    ctx.fillStyle = '#64748b';
    ctx.font = '7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('LOCKED', gx, gy - 52);
  }
  ctx.restore();
}

function spawnDust(x, y, count = 4) {
  for (let i = 0; i < count; i++) {
    playerParticles.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + 34,
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 1.5 - 0.4,
      size: Math.random() * 2.5 + 1.5,
      life: 1.0,
      decay: Math.random() * 0.04 + 0.03
    });
  }
}

function spawnCutsceneHearts(x, y) {
  for (let i = 0; i < 6; i++) {
    playerParticles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y - Math.random() * 10,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -Math.random() * 1.6 - 0.8,
      size: 10,
      isHeart: true,
      life: 1.0,
      decay: 0.015
    });
  }
}

function updateAndDrawParticles(c) {
  for (let i = playerParticles.length - 1; i >= 0; i--) {
    const p = playerParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;

    if (p.life <= 0) {
      playerParticles.splice(i, 1);
      continue;
    }

    if (p.isHeart) {
      c.save();
      c.globalAlpha = p.life;
      c.fillStyle = '#f472b6';
      c.font = '12px sans-serif';
      c.fillText('♥', p.x - camera.x, p.y);
      c.restore();
    } else {
      c.save();
      c.globalAlpha = p.life * 0.6;
      c.fillStyle = '#bae6fd';
      c.beginPath();
      c.arc(p.x - camera.x, p.y, p.size, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }
}

/* ===================================================
   MOVING PLATFORMS
=================================================== */
function initRoomMovingPlatforms(room) {
  gameState.movingPlats = [];
  if (room.movingPlatforms) {
    room.movingPlatforms.forEach((mp) => {
      gameState.movingPlats.push({
        x: mp.x,
        y: mp.y,
        w: mp.w,
        h: mp.h,
        col: mp.col,
        border: mp.border,
        dx: mp.dx,
        minX: mp.minX,
        maxX: mp.maxX
      });
    });
  }
}

function updateMovingPlatforms() {
  gameState.movingPlats.forEach((mp) => {
    mp.x += mp.dx;
    if (mp.x <= mp.minX || mp.x + mp.w >= mp.maxX) {
      mp.dx = -mp.dx;
    }
  });
}

function getAllCurrentPlatforms() {
  const room = getCurrentRoom();
  return [...room.platforms, ...gameState.movingPlats];
}

/* ===================================================
   CHECKPOINT & COLLISIONS
=================================================== */
function checkItemCollisions() {
  const room = getCurrentRoom();
  const active = getActivePlayer();
  const boy = playerState.boy;

  // Collectibles
  for (let i = 0; i < room.collectibles.length; i++) {
    const item = room.collectibles[i];
    const itemKey = `${currentRoomIdx}-${item.id}`;
    if (!gameState.collectedItems[itemKey]) {
      if (rectsOverlap(active.x, active.y, 24, 36, item.x - 14, item.y - 14, 28, 28)) {
        gameState.collectedItems[itemKey] = true;
        SoundEngine.collect();
        spawnDust(item.x, item.y, 8);
        handleCollectibleCollected(item);
        updateHUD();
      }
    }
  }

  // Room 3 Speed Boost Pads
  if (room.mode === 'racing' && room.boostPads) {
    for (let bp of room.boostPads) {
      if (rectsOverlap(boy.x, boy.y, 24, 36, bp.x, bp.y, bp.w, bp.h)) {
        boy.vx = 11.5; // High speed turbo boost!
        SoundEngine.engineRev();
        spawnDust(boy.x, boy.y + 20, 8);
      }
    }
  }

  // Stars
  for (let si = 0; si < room.stars.length; si++) {
    const star = room.stars[si];
    const sKey = `${currentRoomIdx}-${si}`;
    if (!gameState.collectedStars[sKey]) {
      if (rectsOverlap(active.x, active.y, 24, 36, star.x - 12, star.y - 12, 24, 24)) {
        gameState.collectedStars[sKey] = true;
        gameState.totalStars++;
        SoundEngine.star();
        updateHUD();
      }
    }
  }
}

// rectsOverlap imported from player.js

function handleCollectibleCollected(item) {
  const room = getCurrentRoom();
  const count = getCollectedCount();

  // If all room collectibles gathered, unlock the area and trigger the 8-step sequence!
  if (count >= room.collectibles.length) {
    if (!gameState.surpriseTriggered[currentRoomIdx]) {
      gameState.surpriseTriggered[currentRoomIdx] = true;
      triggerRoomSurpriseSequence(currentRoomIdx);
    }
  } else {
    // Intermediate discovery feedback
    if (item.type === 'nobar' || item.type === 'catMeme') {
      openPolaroidModal({
        title: item.title,
        desc: item.desc,
        photoKey: item.photoKey || '',
        date: item.type === 'catMeme' ? '🐱 Meme Kucing Absurd' : 'LDR Special Memory'
      });
    } else if (item.type === 'racingBeacon') {
      SoundEngine.engineRev();
      openDialogueModal(item.msg);
    }
  }
}

/* ===================================================
   THE 8-STEP MANDATORY ROOM SURPRISE SEQUENCE
   1. Player completes gameplay & objective
   2. Pathway to Jinan opens
   3. Jinan welcomes Nidan warmly
   4. Natural multi-stage hug
   5. Move together to the ENTER checkpoint
   6. Press ENTER / E / Click button
   7. Room Surprise opens with tailored storytelling
   8. Advance to next room smoothly
=================================================== */
export function triggerRoomSurpriseSequence(roomIdx) {
  isPaused = true;
  const boy = playerState.boy;
  const girl = playerState.girl;
  const room = getCurrentRoom();

  let cutsceneStep = 0;
  const targetCamX = Math.max(0, Math.min(getWorldWidth() - GAME_W, girl.x - GAME_W / 2));

  const cutsceneInterval = setInterval(() => {
    cutsceneStep++;
    // Smooth camera pan
    camera.x += (targetCamX - camera.x) * 0.12;

    if (cutsceneStep < 45) {
      // Step 3: Nidan walks towards Jinan; Jinan waves
      if (boy.x < girl.x - 22) {
        boy.x += 2.2;
        boy.animMode = 'walk';
        boy.facingLeft = false;
      } else if (boy.x > girl.x + 22) {
        boy.x -= 2.2;
        boy.animMode = 'walk';
        boy.facingLeft = true;
      }
      girl.animMode = 'wave';
      girl.facingLeft = (boy.x < girl.x);
      girl.emote = 'heart';
    } else if (cutsceneStep === 45) {
      // Step 3.5: Face-to-face look, smiling & blushing
      boy.animMode = 'idle';
      boy.emote = 'shy';
      girl.animMode = 'idle';
      girl.emote = 'shy';
      SoundEngine.milestone();
    } else if (cutsceneStep >= 55 && cutsceneStep < 105) {
      // Step 4: Multi-stage natural hug!
      setCutsceneMode('hugging');
      spawnCutsceneHearts((boy.x + girl.x) / 2, Math.min(boy.y, girl.y));
    } else if (cutsceneStep >= 105 && cutsceneStep < 160) {
      // Step 5: Walk together hand-in-hand toward the ENTER checkpoint
      setCutsceneMode('walkingHandInHand');
      const targetEnterX = room.gate.x - 10;
      if (boy.x < targetEnterX) {
        boy.x += 1.8;
        girl.x += 1.8;
      }
    } else if (cutsceneStep >= 160) {
      // Step 5.5: Stopped at ENTER checkpoint
      clearInterval(cutsceneInterval);
      setCutsceneMode('none');
      boy.animMode = 'idle';
      girl.animMode = 'idle';
      boy.emote = 'heart';
      girl.emote = 'heart';

      // Step 6: Reveal the interactive ENTER Prompt Banner
      const banner = document.getElementById('room-surprise-enter-banner');
      if (banner) banner.style.display = 'flex';
      SoundEngine.milestone();
    }

    if (ctx) renderGame(performance.now());
  }, 1000 / 60);
}

/**
 * Step 6 -> 7: Execute Room Surprise upon pressing ENTER / Key E / Button
 */
export function executeRoomSurpriseEnter() {
  const banner = document.getElementById('room-surprise-enter-banner');
  if (banner) banner.style.display = 'none';

  SoundEngine.fanfare();
  if (currentRoomIdx === 0) {
    openStorybookModal();
  } else if (currentRoomIdx === 1) {
    openVaultModal();
  } else if (currentRoomIdx === 2) {
    openDialogueModal('“Menembus 320 KM gelombang laut samudra, akhirnya jarak kita terlampaui menjadi 0 KM! Di tengah pusingnya tugas kuliah kita berdua di depan laptop, tahu ada kamu selalu bikin aku tenang dan bahagia. Kita sudah melangkah sejauh ini bersama, Sayang 💜”');
  } else if (currentRoomIdx === 3) {
    openGiftModal();
  }
}

export function getCollectedCount() {
  const room = getCurrentRoom();
  let count = 0;
  for (let i = 0; i < room.collectibles.length; i++) {
    if (gameState.collectedItems[`${currentRoomIdx}-${room.collectibles[i].id}`]) {
      count++;
    }
  }
  return count;
}

function checkRoomCompletion() {
  const room = getCurrentRoom();
  const count = getCollectedCount();
  if (count >= room.collectibles.length) {
    if (!gameState.gateUnlocked) {
      gameState.gateUnlocked = true;
      SoundEngine.gateOpen();
      updateHUD();
    }
  }
}

/* ===================================================
   MODALS
=================================================== */
let currentStoryPage = 0;

export function openStorybookModal() {
  isPaused = true;
  currentStoryPage = 0;
  renderStorybookPage();
  const m = document.getElementById('modal-storybook');
  if (m) m.classList.add('active');
}

function renderStorybookPage() {
  const p = STORYBOOK_PAGES[currentStoryPage];
  const titleEl = document.getElementById('book-page-title');
  const contentEl = document.getElementById('book-page-content');
  const indEl = document.getElementById('book-page-indicator');
  const btnPrev = document.getElementById('btn-book-prev');
  const btnNext = document.getElementById('btn-book-next');
  const btnClose = document.getElementById('btn-book-close');

  if (titleEl) titleEl.textContent = p.title;
  if (contentEl) contentEl.innerHTML = `<p>${p.content}</p>`;
  if (indEl) indEl.textContent = `Halaman ${currentStoryPage + 1} / ${STORYBOOK_PAGES.length}`;

  if (btnPrev) btnPrev.style.display = currentStoryPage === 0 ? 'none' : 'inline-block';
  if (btnNext) btnNext.style.display = currentStoryPage === STORYBOOK_PAGES.length - 1 ? 'none' : 'inline-block';
  if (btnClose) btnClose.style.display = currentStoryPage === STORYBOOK_PAGES.length - 1 ? 'inline-block' : 'none';
}

export function openVaultModal() {
  isPaused = true;
  selectVaultPedestal(0);
  const m = document.getElementById('modal-vault');
  if (m) m.classList.add('active');
}

function selectVaultPedestal(idx) {
  const art = SYMBOLIC_ARTIFACTS[idx];
  const titleEl = document.getElementById('vault-detail-title');
  const descEl = document.getElementById('vault-detail-desc');

  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`vault-btn-${i}`);
    if (btn) {
      if (i === idx) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  if (titleEl) titleEl.textContent = art.title;
  if (descEl) descEl.textContent = art.desc;
  SoundEngine.collect();
}

export function openPolaroidModal(data) {
  isPaused = true;
  const titleEl = document.getElementById('polaroid-title-view');
  const descEl = document.getElementById('polaroid-desc-view');
  const dateEl = document.getElementById('polaroid-date-view');
  const imgEl = document.getElementById('polaroid-img-view');
  const fallback = document.getElementById('polaroid-fallback-canvas');

  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;
  if (dateEl) dateEl.textContent = data.date;

  if (imgEl && data.photoKey) {
    imgEl.src = `assets/photos/${data.photoKey}.jpg`;
    imgEl.style.display = 'block';
    if (fallback) fallback.style.display = 'none';
    imgEl.onerror = () => {
      imgEl.style.display = 'none';
      if (fallback) {
        fallback.style.display = 'block';
        drawPolaroidFallback(fallback, data.title);
      }
    };
  } else {
    if (imgEl) imgEl.style.display = 'none';
    if (fallback) {
      fallback.style.display = 'block';
      drawPolaroidFallback(fallback, data.title);
    }
  }

  const m = document.getElementById('modal-polaroid');
  if (m) m.classList.add('active');
}

function drawPolaroidFallback(canvas, title) {
  const c = canvas.getContext('2d');
  c.fillStyle = '#0f172a';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#38bdf8';
  c.font = '10px "Press Start 2P"';
  c.textAlign = 'center';
  c.fillText('MEMORI NIDAN & JINAN', canvas.width / 2, canvas.height / 2 - 10);
  c.fillStyle = '#f472b6';
  c.font = '22px sans-serif';
  c.fillText('♥', canvas.width / 2, canvas.height / 2 + 25);
}

export function openDialogueModal(msg) {
  isPaused = true;
  const msgEl = document.getElementById('dialog-message');
  if (msgEl) msgEl.textContent = msg;
  const m = document.getElementById('modal-dialogue');
  if (m) m.classList.add('active');
}

export function openGiftModal() {
  isPaused = true;
  const m = document.getElementById('modal-giftbox');
  if (m) m.classList.add('active');
}

/* ===================================================
   HUD & STATE REFRESH
=================================================== */
function updateHUD() {
  const room = getCurrentRoom();
  const objEl = document.getElementById('hud-item-count');
  const maxEl = document.getElementById('hud-item-max');
  const titleEl = document.getElementById('hud-room-title');
  const starEl = document.getElementById('hud-stars');

  if (objEl) objEl.textContent = getCollectedCount();
  if (maxEl) maxEl.textContent = room.collectibles.length;
  if (titleEl) titleEl.textContent = `${room.name} — ${room.badge}`;
  if (starEl) starEl.textContent = gameState.totalStars;
}

/* ===================================================
   MAIN RENDER LOOP
=================================================== */
function renderGame(t) {
  if (!ctx) return;
  ctx.clearRect(0, 0, GAME_W, GAME_H);

  // 1. Layered Parallax Scenery
  drawParallaxBackground(ctx, t);

  // 2. Platforms & Springs
  const plats = getAllCurrentPlatforms();
  plats.forEach(drawPlatform);

  const room = getCurrentRoom();
  if (room.springs) {
    room.springs.forEach(drawSpring);
  }

  // 3. Puzzles & Nature Features
  drawPuzzleElements(ctx, camera.x, currentRoomIdx, t);

  // 4. Gate
  drawGate(room.gate, gameState.gateUnlocked, t);

  // 5. Collectibles & Stars
  room.collectibles.forEach((item, idx) => {
    drawCollectible(ctx, item, camera.x, gameState.collectedItems[`${currentRoomIdx}-${item.id}`], t, idx);
  });
  room.stars.forEach((star, idx) => {
    drawStarItem(ctx, star, camera.x, gameState.collectedStars[`${currentRoomIdx}-${idx}`], t, idx);
  });

  // 6. Dust & Heart Particles
  updateAndDrawParticles(ctx);

  // 7. Render Players
  renderPlayers(ctx, camera.x, t);
}

function gameLoop(timestamp) {
  if (!isGameRunning) return;
  if (!isPaused) {
    const room = getCurrentRoom();
    const active = getActivePlayer();
    const worldW = getWorldWidth();

    updateMovingPlatforms();
    updatePlayerPhysics(keys, touchControls, getAllCurrentPlatforms(), room.springs, worldW, GAME_H, spawnDust, timestamp);
    checkItemCollisions();

    // Smooth Camera Tracking (Natural Easing)
    let targetCamX = active.x - GAME_W / 2 + 12;
    targetCamX = Math.max(0, Math.min(worldW - GAME_W, targetCamX));
    camera.x += (targetCamX - camera.x) * 0.12;

    renderGame(timestamp);
    gameState.animT++;
  }
  animFrameId = requestAnimationFrame(gameLoop);
}

/* ===================================================
   GAME ENGINE LIFECYCLE CONTROLS
=================================================== */
export function startGameAdventure() {
  initCanvas();
  SoundEngine.init();
  showScreen('game');

  isGameRunning = true;
  isPaused = false;
  gameState.totalStars = 0;
  gameState.collectedItems = {};
  gameState.collectedStars = {};
  gameState.surpriseTriggered = {};

  // If mini-game launcher is registered, use it (mini-game mode)
  if (_miniGameLauncher) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    _miniGameLauncher(0); // Start Room 1 mini-game
    return;
  }

  // Fallback: platformer mode (legacy)
  loadRoom(0, (room) => {
    initRoomMovingPlatforms(room);
  });

  updateHUD();

  if (animFrameId) cancelAnimationFrame(animFrameId);
  animFrameId = requestAnimationFrame(gameLoop);
}

export function pauseGame() {
  isPaused = true;
}

export function resumeGame() {
  isPaused = false;
}

export function restartCurrentRoom() {
  loadRoom(currentRoomIdx, (room) => {
    initRoomMovingPlatforms(room);
  });
  isPaused = false;
  gameState.gateUnlocked = false;
  gameState.surpriseTriggered[currentRoomIdx] = false;
  setCutsceneMode('none');
  const banner = document.getElementById('room-surprise-enter-banner');
  if (banner) banner.style.display = 'none';
  updateHUD();
}

export function initGameModals() {
  // Storybook modal (Room 1)
  setupButton('btn-book-prev', () => {
    if (currentStoryPage > 0) {
      currentStoryPage--;
      renderStorybookPage();
      SoundEngine.collect();
    }
  });

  setupButton('btn-book-next', () => {
    if (currentStoryPage < STORYBOOK_PAGES.length - 1) {
      currentStoryPage++;
      renderStorybookPage();
      SoundEngine.collect();
    }
  });

  // Closing Storybook -> Step 8: Advances smoothly to Room 2!
  setupButton('btn-book-close', () => {
    const m = document.getElementById('modal-storybook');
    if (m) m.classList.remove('active');
    isPaused = false;
    setCutsceneMode('none');
    loadNextRoom((nextRoom) => {
      initRoomMovingPlatforms(nextRoom);
    });
  });

  // Memory Vault inspector modal (Room 2)
  setupButton('vault-btn-0', () => selectVaultPedestal(0));
  setupButton('vault-btn-1', () => selectVaultPedestal(1));
  setupButton('vault-btn-2', () => selectVaultPedestal(2));

  // Closing Vault -> Step 8: Advances smoothly to Room 3 (Racing)!
  setupButton('btn-vault-close', () => {
    const m = document.getElementById('modal-vault');
    if (m) m.classList.remove('active');
    isPaused = false;
    setCutsceneMode('none');
    loadNextRoom((nextRoom) => {
      initRoomMovingPlatforms(nextRoom);
    });
  });

  // Polaroid modal
  setupButton('btn-polaroid-close', () => {
    const m = document.getElementById('modal-polaroid');
    if (m) m.classList.remove('active');
    isPaused = false;
    setCutsceneMode('none');
  });

  // Dialogue modal (Room 3) -> Step 8: Advances smoothly to Room 4!
  setupButton('btn-dialog-continue', () => {
    const m = document.getElementById('modal-dialogue');
    if (m) m.classList.remove('active');
    isPaused = false;
    setCutsceneMode('none');
    loadNextRoom((nextRoom) => {
      initRoomMovingPlatforms(nextRoom);
    });
  });

  // Giftbox modal (Room 4) -> Step 8: Advances into the Birthday Finale!
  setupButton('btn-giftbox-close', () => {
    const m = document.getElementById('modal-giftbox');
    if (m) m.classList.remove('active');
    isPaused = false;
    setCutsceneMode('none');
    isGameRunning = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    triggerFinalSurprise();
  });

  // The Room Surprise ENTER Checkpoint Button
  setupButton('btn-room-surprise-enter', () => {
    executeRoomSurpriseEnter();
  });
}
