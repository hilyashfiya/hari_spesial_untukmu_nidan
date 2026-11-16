/* ===================================================
   ROOM 3 MINI-GAME: CAR RACING
   Genre: Coastal Highway Car Racing
   Theme: Samudra LDR — Menembus Jarak 320 KM Menuju 0 KM!
   Player Two, Forever 💖
=================================================== */

import { SoundEngine } from './sound.js';
import { drawGirlfriendPixelChar, drawPixelCat, drawPassengerCat, drawPixelFlower, drawDriftingPetals, drawFloatingCatEmote } from './characters.js';

// State
let mg3Canvas = null;
let mg3Ctx = null;
let mg3AnimId = null;
let mg3T = 0;
let mg3Phase = 'playing'; // 'playing' | 'won' | 'lost'
let mg3OnComplete = null;

// Track & Distance Physics (Calm, enjoyable cruising pace)
const TRACK_DISTANCE_TOTAL = 2200; // total world distance units (~45-50 sec relaxing cruise)
let mg3WorldDistance = 0;          // 0 to 2200
let mg3Speed = 1.4;                // relaxed cruising speed
const MIN_SPEED = 0.9;
const MAX_SPEED = 2.4;
const ACCEL_RATE = 0.08;
const BRAKE_RATE = 0.12;
const NATURAL_FRICTION = 0.03;

// Car Position & Lanes
const ROAD_Y = 175;
const ROAD_H = 190;
const LANE_TOP = ROAD_Y + 32;       // ~207
const LANE_MID = ROAD_Y + ROAD_H / 2; // 270
const LANE_BOT = ROAD_Y + ROAD_H - 32; // ~333

let mg3CarY = LANE_MID;
let mg3CarTargetY = LANE_MID;
let mg3HitCooldown = 0;
let mg3Lives = 5;
let mg3Score = 0;
let mg3CarEmote = null; // { text, timer }

// Controls State
const mg3Keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  gas: false,
  brake: false
};

let mg3TouchUp = false;
let mg3TouchDown = false;
let mg3TouchGas = false;
let mg3TouchBrake = false;

// Obstacles & Collectibles
let mg3Obstacles = [];
let mg3Collectibles = [];

function initTrackObjects() {
  mg3Obstacles = [];
  mg3Collectibles = [];

  const lanes = [LANE_TOP, LANE_MID, LANE_BOT];

  // Generous spacing between obstacles so it's relaxing and forgiving
  const obstacleCount = 14;
  for (let i = 0; i < obstacleCount; i++) {
    const laneY = lanes[Math.floor(Math.random() * lanes.length)];
    mg3Obstacles.push({
      worldX: 480 + i * 135 + Math.random() * 30,
      y: laneY,
      type: i % 2 === 0 ? 'coconut' : 'rock',
      hit: false
    });
  }

  // Generous collectibles (Hearts & Stars) along the scenic coastal route
  const collectCount = 18;
  for (let j = 0; j < collectCount; j++) {
    const laneY = lanes[Math.floor(Math.random() * lanes.length)];
    const cType = j % 3 === 0 ? 'rose' : (j % 2 === 0 ? 'heart' : 'star');
    mg3Collectibles.push({
      worldX: 380 + j * 110 + Math.random() * 40,
      y: laneY,
      type: cType,
      collected: false
    });
  }
}

function mg3DrawBackground(c, cw, ch, t, speed) {
  // 1. Pastel Lilac & Dreamy Twilight Sky Gradient (Match Image 3: Little Things I Admire About You)
  const skyGrad = c.createLinearGradient(0, 0, 0, ROAD_Y);
  skyGrad.addColorStop(0, '#c084fc');   // soft lilac / lavender
  skyGrad.addColorStop(0.45, '#d8b4fe'); // pastel mauve
  skyGrad.addColorStop(0.8, '#bae6fd');  // dreamy sky blue
  skyGrad.addColorStop(1, '#fbcfe8');  // soft rose horizon
  c.fillStyle = skyGrad;
  c.fillRect(0, 0, cw, ROAD_Y);

  // 2. Soft Warm Evening Sun / Moon & Twinkling Starlight
  c.fillStyle = 'rgba(254, 240, 138, 0.45)';
  c.beginPath();
  c.arc(cw - 75, 36, 42, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = 'rgba(255, 255, 255, 0.7)';
  c.beginPath();
  c.arc(cw - 75, 36, 18, 0, Math.PI * 2);
  c.fill();

  // Twinkling Twilight Stars & Floating Hearts
  for (let s = 0; s < 16; s++) {
    const sx = (s * 82 - mg3WorldDistance * 0.03 + 800) % cw;
    const sy = 12 + (s * 17) % 65;
    const twinkle = 0.35 + Math.sin(t * 0.08 + s) * 0.35;
    c.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    c.beginPath();
    c.arc(sx, sy, 1.4, 0, Math.PI * 2);
    c.fill();
  }

  // Drifting Pastel Butterflies in the Garden Sky
  for (let b = 0; b < 3; b++) {
    const bx = ((b * 260 + t * 0.8 - mg3WorldDistance * 0.1) % (cw + 120)) - 50;
    const by = 25 + Math.sin(t * 0.1 + b * 2) * 14;
    c.font = '13px serif';
    c.textAlign = 'center';
    c.fillText(b % 2 === 0 ? '🦋' : '✨', bx, by);
  }

  // 3. Distant Rolling Lavender Hills & Cypress Trees Silhouette
  c.fillStyle = '#a855f7';
  c.globalAlpha = 0.22;
  c.beginPath();
  c.moveTo(0, ROAD_Y);
  c.lineTo(0, ROAD_Y - 35);
  c.lineTo(120, ROAD_Y - 55);
  c.lineTo(280, ROAD_Y - 30);
  c.lineTo(440, ROAD_Y - 60);
  c.lineTo(620, ROAD_Y - 32);
  c.lineTo(cw, ROAD_Y - 50);
  c.lineTo(cw, ROAD_Y);
  c.closePath();
  c.fill();
  c.globalAlpha = 1.0;

  // 4. Pastel Courtyard Terrace & Wrought-Iron Fences (Match Image 3)
  // Terrace upper strip
  const terraceGrad = c.createLinearGradient(0, ROAD_Y - 45, 0, ROAD_Y);
  terraceGrad.addColorStop(0, '#f5f3ff'); // soft marble white
  terraceGrad.addColorStop(1, '#e0e7ff');
  c.fillStyle = terraceGrad;
  c.fillRect(0, ROAD_Y - 45, cw, 45);

  // Pastel Wrought-Iron Decorative Fence Railing along the top
  c.strokeStyle = '#c084fc';
  c.lineWidth = 1.5;
  c.beginPath();
  c.moveTo(0, ROAD_Y - 38);
  c.lineTo(cw, ROAD_Y - 38);
  c.moveTo(0, ROAD_Y - 26);
  c.lineTo(cw, ROAD_Y - 26);
  c.stroke();

  // Vertical fence pickets with decorative curved loops
  const fenceOffset = -(mg3WorldDistance * 0.8) % 24;
  for (let fx = fenceOffset; fx < cw + 24; fx += 24) {
    c.strokeRect(fx, ROAD_Y - 38, 1, 14);
    // Heart finial loop
    c.fillStyle = '#f472b6';
    c.beginPath();
    c.arc(fx + 0.5, ROAD_Y - 40, 2.5, 0, Math.PI * 2);
    c.fill();
  }

  // ==============================================================
  // 5. SCROLLING GARDEN LANDMARKS FROM IMAGE 3
  // Scrolling alongside the drive as monuments of love & admiration!
  // ==============================================================
  const gardenLandmarks = [
    // Landmark 1: Romantic Swing Bench with climbing roses (Image 3)
    { worldDist: 220, type: 'swing' },
    // Landmark 2: Multi-tier Stone Fountain splashing water (Image 3)
    { worldDist: 620, type: 'fountain' },
    // Landmark 3: Flowering Rose Topiary Tree with Cello (Image 3)
    { worldDist: 1040, type: 'tree_cello' },
    // Landmark 4: Afternoon Tea Party Table with Treats (Image 3)
    { worldDist: 1460, type: 'tea_table' },
    // Landmark 5: Grand Floral Heart-Balloon Archway (Image 3)
    { worldDist: 1880, type: 'balloon_arch' },
  ];

  gardenLandmarks.forEach(lm => {
    const screenX = lm.worldDist - mg3WorldDistance + 350;
    if (screenX < -120 || screenX > cw + 120) return;

    if (lm.type === 'swing') {
      // Romantic Swing Bench (Adorned in roses & ivy)
      c.fillStyle = '#ffffff';
      c.fillRect(screenX - 22, ROAD_Y - 52, 4, 48); // Left A-frame
      c.fillRect(screenX + 18, ROAD_Y - 52, 4, 48); // Right A-frame
      c.fillRect(screenX - 25, ROAD_Y - 52, 50, 4);  // Top bar

      // Swing bench seat (lavender)
      const swingSway = Math.sin(t * 0.08) * 3;
      c.fillStyle = '#d8b4fe';
      c.fillRect(screenX - 16 + swingSway, ROAD_Y - 24, 32, 6);
      c.fillRect(screenX - 16 + swingSway, ROAD_Y - 32, 32, 4);

      // Climbing pink roses on swing frame
      c.fillStyle = '#f472b6';
      c.font = '10px serif';
      c.fillText('🌹', screenX - 24, ROAD_Y - 42);
      c.fillText('🌹', screenX + 16, ROAD_Y - 38);

    } else if (lm.type === 'fountain') {
      // Multi-tier Classical Stone Fountain (Splashing Water)
      // Bottom basin
      c.fillStyle = '#e2e8f0';
      c.beginPath();
      c.roundRect(screenX - 28, ROAD_Y - 22, 56, 18, [0, 0, 8, 8]);
      c.fill();
      c.strokeStyle = '#cbd5e1';
      c.stroke();

      // Clear blue water in basin
      c.fillStyle = '#38bdf8';
      c.fillRect(screenX - 25, ROAD_Y - 20, 50, 6);

      // Central pedestal
      c.fillStyle = '#e2e8f0';
      c.fillRect(screenX - 6, ROAD_Y - 45, 12, 26);

      // Upper tier bowl
      c.beginPath();
      c.roundRect(screenX - 18, ROAD_Y - 48, 36, 8, 4);
      c.fill();

      // Splashing water fountain spray
      const waterH = 10 + Math.sin(t * 0.2) * 3;
      c.fillStyle = 'rgba(56, 189, 248, 0.75)';
      c.beginPath();
      c.arc(screenX, ROAD_Y - 48 - waterH, 5, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#ffffff';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(screenX, ROAD_Y - 48);
      c.lineTo(screenX - 12, ROAD_Y - 38);
      c.moveTo(screenX, ROAD_Y - 48);
      c.lineTo(screenX + 12, ROAD_Y - 38);
      c.stroke();

    } else if (lm.type === 'tree_cello') {
      // Manicured Round Rose Topiary Tree with Wooden Cello
      // Tree trunk
      c.fillStyle = '#6b3710';
      c.fillRect(screenX - 4, ROAD_Y - 38, 8, 36);

      // Lush Spherical Green Canopy
      c.fillStyle = '#16a34a';
      c.beginPath();
      c.arc(screenX, ROAD_Y - 52, 26, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#22c55e';
      c.beginPath();
      c.arc(screenX - 6, ROAD_Y - 56, 18, 0, Math.PI * 2);
      c.fill();

      // Blooming pastel roses embedded in canopy
      c.fillStyle = '#f472b6';
      c.beginPath();
      c.arc(screenX - 12, ROAD_Y - 56, 4, 0, Math.PI * 2);
      c.arc(screenX + 10, ROAD_Y - 60, 4.5, 0, Math.PI * 2);
      c.arc(screenX + 4, ROAD_Y - 44, 4, 0, Math.PI * 2);
      c.fill();

      // Wooden Cello leaning against trunk
      c.fillStyle = '#92400e';
      c.beginPath();
      c.ellipse(screenX + 12, ROAD_Y - 20, 7, 13, 0.2, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#451a03';
      c.lineWidth = 1;
      c.stroke();
      // Cello neck
      c.fillRect(screenX + 8, ROAD_Y - 38, 3, 16);

    } else if (lm.type === 'tea_table') {
      // Afternoon Tea Party Table (Lavender Tablecloth & Sweets)
      c.fillStyle = '#d8b4fe'; // lavender tablecloth
      c.beginPath();
      c.roundRect(screenX - 22, ROAD_Y - 26, 44, 16, [6, 6, 0, 0]);
      c.fill();
      c.fillStyle = '#c084fc';
      c.fillRect(screenX - 20, ROAD_Y - 14, 40, 12); // cloth drape

      // Teapot & Teacups on Table
      c.fillStyle = '#ffffff';
      c.font = '12px serif';
      c.textAlign = 'center';
      c.fillText('🫖', screenX - 8, ROAD_Y - 26);
      c.fillText('🍰', screenX + 10, ROAD_Y - 26);

    } else if (lm.type === 'balloon_arch') {
      // Grand Floral Heart-Balloon Archway
      c.strokeStyle = '#ffffff';
      c.lineWidth = 3;
      c.beginPath();
      c.arc(screenX, ROAD_Y - 28, 36, Math.PI, 0);
      c.stroke();

      // Heart Balloons on Arch (Pink, Purple, Sky Blue)
      const balloonColors = ['#f472b6', '#c084fc', '#38bdf8', '#fbcfe8'];
      for (let ba = 0; ba < 6; ba++) {
        const bAngle = Math.PI + (ba / 5) * Math.PI;
        const bx = screenX + Math.cos(bAngle) * 36;
        const by = ROAD_Y - 28 + Math.sin(bAngle) * 36;
        c.fillStyle = balloonColors[ba % balloonColors.length];
        c.font = '12px serif';
        c.textAlign = 'center';
        c.fillText('💖', bx, by + 4);
      }
    }
  });

  // 6. Ornate Wrought-Iron Street Lamps with Glowing Lanterns (Image 3)
  const lampOffset = -(mg3WorldDistance * 0.85) % 180;
  for (let lx = lampOffset; lx < cw + 60; lx += 180) {
    // Lamp post (white wrought iron)
    c.fillStyle = '#ffffff';
    c.fillRect(lx, ROAD_Y - 48, 3, 44);
    c.beginPath();
    c.arc(lx + 1.5, ROAD_Y - 48, 5, 0, Math.PI * 2);
    c.fill();

    // Curved bracket arm holding lantern
    c.strokeStyle = '#ffffff';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(lx + 1.5, ROAD_Y - 46);
    c.quadraticCurveTo(lx + 12, ROAD_Y - 54, lx + 14, ROAD_Y - 42);
    c.stroke();

    // Glowing Warm Amber Lantern
    c.fillStyle = '#fef08a';
    c.fillRect(lx + 11, ROAD_Y - 42, 6, 8);
    // Translucent Lantern Aura
    c.fillStyle = 'rgba(254, 240, 138, 0.35)';
    c.beginPath();
    c.arc(lx + 14, ROAD_Y - 38, 14, 0, Math.PI * 2);
    c.fill();
  }

  // 7. Cheering Easter Egg: Cute White Pet Cat with Rose in Mouth! (Image 3)
  const catX = ((520 - mg3WorldDistance * 0.8) % (cw + 240) + (cw + 240)) % (cw + 240) - 40;
  drawPixelCat(c, catX, ROAD_Y - 42, 'dance', t, 0.95);
  c.font = '10px serif';
  c.fillText('🌹', catX + 16, ROAD_Y - 40); // holding rose!

  // ==============================================================
  // 8. LOWER ROADSIDE PROMENADE & MARBLE FLOWERBED (Below Road)
  // ==============================================================
  const lowerGrad = c.createLinearGradient(0, ROAD_Y + ROAD_H, 0, ch);
  lowerGrad.addColorStop(0, '#fef08a'); // golden curb
  lowerGrad.addColorStop(0.12, '#f5f3ff'); // marble promenade
  lowerGrad.addColorStop(1, '#e0e7ff');
  c.fillStyle = lowerGrad;
  c.fillRect(0, ROAD_Y + ROAD_H, cw, ch - (ROAD_Y + ROAD_H));

  // Polished Rose-Gold Curb Edge
  c.fillStyle = '#f472b6';
  c.fillRect(0, ROAD_Y + ROAD_H, cw, 4);

  // Blooming Rose Bushes & Lavender along lower verge
  const lowerFlowers = [
    { x: 30,  type: 'heart' },
    { x: 120, type: 'tulip' },
    { x: 230, type: 'wildflower' },
    { x: 350, type: 'daisy' },
    { x: 480, type: 'heart' },
    { x: 620, type: 'tulip' },
    { x: 740, type: 'daisy' },
  ];
  lowerFlowers.forEach(f => {
    const fx = ((f.x - mg3WorldDistance * 0.9) % (cw + 60) + (cw + 60)) % (cw + 60) - 30;
    drawPixelFlower(c, fx, ROAD_Y + ROAD_H + 16, f.type, t);
  });

  // Sleeping Loaf Cat lounging on the sunny promenade
  const loafX = ((710 - mg3WorldDistance * 0.9) % (cw + 200) + (cw + 200)) % (cw + 200) - 30;
  drawPixelCat(c, loafX, ROAD_Y + ROAD_H + 10, 'loaf', t, 0.9);

  // Soft drifting rose petals in the romantic garden breeze
  drawDriftingPetals(c, cw, ch, t);
}

function drawRoad(c, cw) {
  // Road Asphalt
  const roadGrad = c.createLinearGradient(0, ROAD_Y, 0, ROAD_Y + ROAD_H);
  roadGrad.addColorStop(0, '#1e293b');
  roadGrad.addColorStop(0.5, '#334155');
  roadGrad.addColorStop(1, '#1e293b');
  c.fillStyle = roadGrad;
  c.fillRect(0, ROAD_Y, cw, ROAD_H);

  // Yellow Curb Edges
  c.fillStyle = '#fef08a';
  c.fillRect(0, ROAD_Y, cw, 4);
  c.fillRect(0, ROAD_Y + ROAD_H - 4, cw, 4);

  // White Dashed Lane Dividers (Lane 1/2 and Lane 2/3)
  c.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  c.lineWidth = 2.5;
  c.setLineDash([28, 20]);
  const dashOffset = -(mg3WorldDistance * 1.2) % 48;

  const lane1Y = ROAD_Y + ROAD_H / 3;
  const lane2Y = ROAD_Y + (ROAD_H / 3) * 2;

  c.lineDashOffset = dashOffset;
  c.beginPath();
  c.moveTo(0, lane1Y); c.lineTo(cw, lane1Y);
  c.moveTo(0, lane2Y); c.lineTo(cw, lane2Y);
  c.stroke();
  c.setLineDash([]);
}

function drawCar(c, screenX, carY, t, speed) {
  const isBlinking = mg3HitCooldown > 0 && Math.floor(t * 0.5) % 2 === 0;
  if (isBlinking) c.globalAlpha = 0.4;

  // Drop Shadow
  c.fillStyle = 'rgba(0, 0, 0, 0.4)';
  c.beginPath();
  c.ellipse(screenX + 2, carY + 16, 28, 6, 0, 0, Math.PI * 2);
  c.fill();

  // Headlight Light Beam casting forward
  const beamGrad = c.createRadialGradient(screenX + 32, carY, 5, screenX + 110, carY, 65);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  c.fillStyle = beamGrad;
  c.beginPath();
  c.moveTo(screenX + 28, carY - 8);
  c.lineTo(screenX + 130, carY - 24);
  c.lineTo(screenX + 130, carY + 24);
  c.lineTo(screenX + 28, carY + 8);
  c.closePath();
  c.fill();

  // Car Main Body — Nidan's Signature Oceanic Blue
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.roundRect(screenX - 26, carY - 14, 56, 26, 6);
  c.fill();
  c.strokeStyle = '#38bdf8';
  c.lineWidth = 1.5;
  c.stroke();

  // Cabin / Roof
  c.fillStyle = '#0369a1';
  c.beginPath();
  c.roundRect(screenX - 12, carY - 11, 28, 20, 4);
  c.fill();

  // Windshield & Rear Window (Sky Blue tint)
  c.fillStyle = '#bae6fd';
  c.fillRect(screenX + 4, carY - 9, 8, 16);
  c.fillRect(screenX - 10, carY - 9, 7, 16);

  // Adorable Pixel Cat Copilot / Passenger sitting by Nidan looking out the window!
  const passengerState = mg3HitCooldown > 0 ? 'shocked' : (mg3Speed > 1.8 ? 'happy' : 'idle');
  drawPassengerCat(c, screenX - 2, carY - 1, passengerState, t);

  // Wheels (Black with Silver hubcaps)
  const wheelW = 12;
  const wheelH = 6;
  c.fillStyle = '#0f172a';
  c.fillRect(screenX - 20, carY - 18, wheelW, wheelH);
  c.fillRect(screenX + 10, carY - 18, wheelW, wheelH);
  c.fillRect(screenX - 20, carY + 12, wheelW, wheelH);
  c.fillRect(screenX + 10, carY + 12, wheelW, wheelH);

  // Headlights (Golden Yellow)
  c.fillStyle = '#fef08a';
  c.fillRect(screenX + 27, carY - 11, 4, 6);
  c.fillRect(screenX + 27, carY + 5, 4, 6);

  // Taillights (Red)
  c.fillStyle = '#ef4444';
  c.fillRect(screenX - 28, carY - 10, 3, 5);
  c.fillRect(screenX - 28, carY + 5, 3, 5);

  // Exhaust gentle smoke puffs
  if (speed > 1.2) {
    for (let p = 0; p < 3; p++) {
      const px = screenX - 32 - p * 8 - (t * 2) % 8;
      const py = carY + 7 + (Math.sin(t * 0.2 + p) * 2.5);
      c.fillStyle = `rgba(226, 232, 240, ${0.55 - p * 0.18})`;
      c.beginPath();
      c.arc(px, py, 2.8 - p * 0.5, 0, Math.PI * 2);
      c.fill();
    }
  }

  // Floating Copilot Cat Emote
  if (mg3CarEmote && mg3CarEmote.timer > 0) {
    drawFloatingCatEmote(c, screenX, carY - 26, mg3CarEmote.text, t, mg3CarEmote.timer / 25);
    mg3CarEmote.timer--;
  }

  c.globalAlpha = 1.0;
}

function drawTrackObjects(c, cw) {
  const carScreenX = cw * 0.25;

  // Draw Collectibles (Hearts & Stars)
  mg3Collectibles.forEach((item) => {
    if (item.collected) return;
    const screenX = item.worldX - mg3WorldDistance + carScreenX;
    if (screenX < -30 || screenX > cw + 30) return;

    const bobY = Math.sin(mg3T * 0.15 + item.worldX) * 3;
    const emoji = item.type === 'rose' ? '🌹' : (item.type === 'star' ? '⭐' : '💖');
    c.font = '17px serif';
    c.textAlign = 'center';
    c.fillText(emoji, screenX, item.y + 6 + bobY);
  });

  // Draw Obstacles (Coconuts & Rocks)
  mg3Obstacles.forEach((ob) => {
    if (ob.hit) return;
    const screenX = ob.worldX - mg3WorldDistance + carScreenX;
    if (screenX < -30 || screenX > cw + 30) return;

    if (ob.type === 'coconut') {
      c.font = '18px serif';
      c.textAlign = 'center';
      c.fillText('🥥', screenX, ob.y + 6);
    } else {
      c.fillStyle = '#64748b';
      c.beginPath();
      c.ellipse(screenX, ob.y + 4, 11, 8, 0, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#94a3b8';
      c.beginPath();
      c.ellipse(screenX - 2, ob.y + 2, 6, 4, 0, 0, Math.PI * 2);
      c.fill();
    }
  });

  // Draw Finish Line Banner Archway
  const finishScreenX = TRACK_DISTANCE_TOTAL - mg3WorldDistance + carScreenX;
  if (finishScreenX > -100 && finishScreenX < cw + 100) {
    // Checkered Finish Gate Pillars
    c.fillStyle = '#ffffff';
    c.fillRect(finishScreenX - 8, ROAD_Y - 28, 16, ROAD_H + 32);
    c.strokeStyle = '#0284c7';
    c.lineWidth = 2;
    c.strokeRect(finishScreenX - 8, ROAD_Y - 28, 16, ROAD_H + 32);

    // Archway Top Banner
    c.fillStyle = '#0284c7';
    c.beginPath();
    c.roundRect(finishScreenX - 75, ROAD_Y - 42, 150, 26, 6);
    c.fill();
    c.strokeStyle = '#fef08a';
    c.lineWidth = 1.5;
    c.stroke();

    c.font = 'bold 7.5px "Press Start 2P", monospace';
    c.fillStyle = '#fef08a';
    c.textAlign = 'center';
    c.fillText('🏖️ PULAU JINAN — 0 KM 🏖️', finishScreenX, ROAD_Y - 25);

  // Cheerful Spectator Meme Cats along the scenic coastal route
  const spectatorLocations = [
    { worldX: 380, y: ROAD_Y + ROAD_H + 28, type: 'cheer' },
    { worldX: 850, y: ROAD_Y - 22, type: 'wave' },
    { worldX: 1350, y: ROAD_Y + ROAD_H + 28, type: 'dance' },
    { worldX: 1800, y: ROAD_Y - 22, type: 'happy' },
  ];
  spectatorLocations.forEach(spec => {
    const specScreenX = spec.worldX - mg3WorldDistance + carScreenX;
    if (specScreenX > -40 && specScreenX < cw + 40) {
      drawPixelCat(c, specScreenX, spec.y, spec.type, mg3T);
    }
  });

    // Jinan waiting at the finish island pier
    drawGirlfriendPixelChar(c, finishScreenX + 26, ROAD_Y - 32, true, 'wave', mg3T, 'heart');
    // Affectionate purring meme cat greeting Nidan at 0 KM pier!
    drawPixelCat(c, finishScreenX + 54, ROAD_Y - 30, 'happy', mg3T);
    drawPixelFlower(c, finishScreenX - 55, ROAD_Y - 32, 'heart', mg3T);
    drawPixelFlower(c, finishScreenX + 80, ROAD_Y - 32, 'daisy', mg3T);
  }
}

function mg3DrawDashboardInstruments(c, cw) {
  // Sleek in-car dashboard dials floating neatly at top left & top right
  // (Leaves the center open sky clear and elegant under #game-hud)

  // 1. Top-Left Speedometer Dial
  const kmh = Math.round(mg3Speed * 32);
  c.fillStyle = 'rgba(15, 23, 42, 0.85)';
  c.beginPath();
  c.roundRect(18, 14, 126, 32, 8);
  c.fill();
  c.strokeStyle = '#38bdf8';
  c.lineWidth = 1.5;
  c.stroke();

  c.font = 'bold 7px "Press Start 2P", monospace';
  c.fillStyle = '#7dd3fc';
  c.textAlign = 'left';
  c.fillText('KECEPATAN', 28, 28);

  c.font = 'bold 8.5px "Press Start 2P", monospace';
  c.fillStyle = '#ffffff';
  c.fillText(`${kmh} KM/H`, 28, 41);

  // 2. Top-Right Distance Remaining & Lives Badge
  const remainingKm = Math.max(0, Math.round(320 * (1 - mg3WorldDistance / TRACK_DISTANCE_TOTAL)));
  c.fillStyle = 'rgba(15, 23, 42, 0.85)';
  c.beginPath();
  c.roundRect(cw - 216, 14, 198, 32, 8);
  c.fill();
  c.strokeStyle = remainingKm === 0 ? '#10b981' : '#f59e0b';
  c.lineWidth = 1.5;
  c.stroke();

  c.font = 'bold 7px "Press Start 2P", monospace';
  c.fillStyle = remainingKm === 0 ? '#10b981' : '#fef08a';
  c.textAlign = 'left';
  c.fillText(`JARAK: ${remainingKm} KM`, cw - 206, 28);

  // Heart Lives
  c.font = '12px serif';
  c.textAlign = 'left';
  let heartsStr = '';
  for (let l = 0; l < mg3Lives; l++) heartsStr += '💖';
  c.fillText(heartsStr, cw - 206, 42);
}

function mg3DrawWon(c, cw, ch) {
  const grad = c.createLinearGradient(0, 0, 0, ch);
  grad.addColorStop(0, '#064e3b');
  grad.addColorStop(1, '#059669');
  c.fillStyle = grad;
  c.fillRect(0, 0, cw, ch);

  for (let i = 0; i < 20; i++) {
    const sx = (i * 77 + mg3T * 2) % cw;
    const sy = (i * 49) % ch;
    c.fillStyle = i % 2 === 0 ? '#fbbf24' : '#f472b6';
    c.font = '14px serif';
    c.textAlign = 'center';
    c.fillText(i % 2 === 0 ? '🏁' : '💖', sx, sy);
  }

  c.fillStyle = 'rgba(255, 255, 255, 0.96)';
  c.beginPath();
  c.roundRect(cw / 2 - 160, ch / 2 - 110, 320, 220, 16);
  c.fill();
  c.strokeStyle = '#10b981';
  c.lineWidth = 3;
  c.stroke();

  c.font = 'bold 11px "Press Start 2P", monospace';
  c.fillStyle = '#059669';
  c.textAlign = 'center';
  c.fillText('GARIS FINISH TERCAPAI!', cw / 2, ch / 2 - 65);
  c.fillText('JARAK = 0 KM! 🏖️', cw / 2, ch / 2 - 45);

  c.font = '8px "Press Start 2P", monospace';
  c.fillStyle = '#374151';
  c.fillText(`Skor Balapan: ${mg3Score} Poin`, cw / 2, ch / 2 - 10);

  c.font = '7px "Press Start 2P", monospace';
  c.fillStyle = '#64748b';
  c.fillText('Jinan menantimu di garis pantai... ♡', cw / 2, ch / 2 + 35);
}

function mg3DrawLost(c, cw, ch) {
  c.fillStyle = 'rgba(7, 21, 43, 0.92)';
  c.fillRect(0, 0, cw, ch);

  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(cw / 2 - 150, ch / 2 - 90, 300, 180, 14);
  c.fill();
  c.strokeStyle = '#ef4444';
  c.lineWidth = 2.5;
  c.stroke();

  c.font = 'bold 12px "Press Start 2P", monospace';
  c.fillStyle = '#ef4444';
  c.textAlign = 'center';
  c.fillText('MOBIL MOGOK!', cw / 2, ch / 2 - 45);

  c.font = '7.5px "Press Start 2P", monospace';
  c.fillStyle = '#475569';
  c.fillText('Nidan butuh istirahat sejenak...', cw / 2, ch / 2 - 15);

  c.fillStyle = '#0284c7';
  c.beginPath();
  c.roundRect(cw / 2 - 80, ch / 2 + 15, 160, 38, 8);
  c.fill();

  c.font = 'bold 8.5px "Press Start 2P", monospace';
  c.fillStyle = '#ffffff';
  c.fillText('↺ COBA LAGI', cw / 2, ch / 2 + 38);
}

function checkCollisions(cw) {
  const carScreenX = cw * 0.25;

  // Collectibles check (Hearts restore life, Stars give score!)
  mg3Collectibles.forEach((item) => {
    if (item.collected) return;
    const screenX = item.worldX - mg3WorldDistance + carScreenX;
    if (Math.abs(screenX - carScreenX) < 28 && Math.abs(item.y - mg3CarY) < 24) {
      item.collected = true;
      if (item.type === 'heart') {
        mg3Lives = Math.min(5, mg3Lives + 1);
        mg3Score += 100;
      } else {
        mg3Score += 200;
      }
      SoundEngine.heartPickup && SoundEngine.heartPickup();
        mg3CarEmote = { text: 'Yeay! Hati LDR! 💖', timer: 50 };
    }
  });

  // Obstacles check (Forgiving: gentle bump with ample invulnerability)
  if (mg3HitCooldown <= 0) {
    mg3Obstacles.forEach((ob) => {
      if (ob.hit) return;
      const screenX = ob.worldX - mg3WorldDistance + carScreenX;
      if (Math.abs(screenX - carScreenX) < 22 && Math.abs(ob.y - mg3CarY) < 16) {
        ob.hit = true;
        mg3Lives--;
        mg3HitCooldown = 80; // ~1.5 sec invulnerability
        mg3Speed = Math.max(MIN_SPEED, mg3Speed * 0.7);
        SoundEngine.bumpSoft && SoundEngine.bumpSoft();
      mg3CarEmote = { text: 'Waaa! 🙀💦', timer: 45 };

        if (mg3Lives <= 0) {
          mg3Phase = 'lost';
        }
      }
    });
  }
}

function updatePhysics() {
  const isUp = mg3Keys.up || mg3TouchUp;
  const isDown = mg3Keys.down || mg3TouchDown;
  const isGas = mg3Keys.gas || mg3Keys.right || mg3TouchGas;
  const isBrake = mg3Keys.brake || mg3Keys.left || mg3TouchBrake;

  // Acceleration / Braking (smooth & responsive)
  if (isGas) {
    mg3Speed = Math.min(MAX_SPEED, mg3Speed + ACCEL_RATE);
  } else if (isBrake) {
    mg3Speed = Math.max(MIN_SPEED, mg3Speed - BRAKE_RATE);
  } else {
    // Return naturally to comfortable cruise speed (1.4)
    if (mg3Speed > 1.4) mg3Speed = Math.max(1.4, mg3Speed - NATURAL_FRICTION);
    else if (mg3Speed < 1.4) mg3Speed = Math.min(1.4, mg3Speed + NATURAL_FRICTION);
  }

  // Smooth Lane Switching (Up / Down)
  const laneSpeed = 3.2;
  if (isUp) {
    mg3CarTargetY = Math.max(LANE_TOP, mg3CarTargetY - laneSpeed);
  }
  if (isDown) {
    mg3CarTargetY = Math.min(LANE_BOT, mg3CarTargetY + laneSpeed);
  }

  // Ease carY toward carTargetY smoothly
  mg3CarY += (mg3CarTargetY - mg3CarY) * 0.18;

  // Advance Track Distance
  mg3WorldDistance += mg3Speed;

  if (mg3HitCooldown > 0) mg3HitCooldown--;

  // Check Win Condition (Finish Line)
  if (mg3WorldDistance >= TRACK_DISTANCE_TOTAL && mg3Phase === 'playing') {
    mg3Phase = 'won';
    SoundEngine.fanfare && SoundEngine.fanfare();
    setTimeout(() => {
      if (mg3OnComplete) mg3OnComplete();
    }, 2400);
  }
}

function mg3Loop() {
  if (!mg3Ctx) return;
  mg3T += 0.5;

  const cw = mg3Canvas.width;
  const ch = mg3Canvas.height;
  mg3Ctx.clearRect(0, 0, cw, ch);

  if (mg3Phase === 'won') {
    mg3DrawWon(mg3Ctx, cw, ch);
  } else if (mg3Phase === 'lost') {
    mg3DrawLost(mg3Ctx, cw, ch);
  } else {
    updatePhysics();
    checkCollisions(cw);

    mg3DrawBackground(mg3Ctx, cw, ch, mg3T, mg3Speed);
    drawRoad(mg3Ctx, cw);
    drawTrackObjects(mg3Ctx, cw);
    drawCar(mg3Ctx, cw * 0.25, mg3CarY, mg3T, mg3Speed);
    mg3DrawDashboardInstruments(mg3Ctx, cw);
  }

  mg3AnimId = requestAnimationFrame(mg3Loop);
}

function mg3OnKeyDown(e) {
  if (mg3Phase === 'lost') {
    retryMiniGame3();
    return;
  }
  if (mg3Phase !== 'playing') return;

  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      mg3Keys.up = true;
      e.preventDefault();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      mg3Keys.down = true;
      e.preventDefault();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      mg3Keys.gas = true;
      e.preventDefault();
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      mg3Keys.brake = true;
      e.preventDefault();
      break;
  }
}

function mg3OnKeyUp(e) {
  switch (e.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      mg3Keys.up = false;
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      mg3Keys.down = false;
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      mg3Keys.gas = false;
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      mg3Keys.brake = false;
      break;
  }
}

function mg3OnCanvasClick() {
  if (mg3Phase === 'lost') {
    retryMiniGame3();
  }
}

export function startMiniGame3(canvas, onComplete) {
  stopMiniGame3();

  mg3Canvas = canvas;
  mg3Ctx = canvas.getContext('2d');
  mg3OnComplete = onComplete;
  mg3T = 0;

  // Immediately initialize coastal highway track, car & dashboard
  mg3StartPlaying();

  window.addEventListener('keydown', mg3OnKeyDown);
  window.addEventListener('keyup', mg3OnKeyUp);
  canvas.addEventListener('click', mg3OnCanvasClick);

  if (mg3AnimId) cancelAnimationFrame(mg3AnimId);
  mg3AnimId = requestAnimationFrame(mg3Loop);
}

function mg3StartPlaying() {
  mg3Phase = 'playing';
  mg3WorldDistance = 0;
  mg3Speed = 1.4;
  mg3CarY = LANE_MID;
  mg3CarTargetY = LANE_MID;
  mg3Lives = 5;
  mg3Score = 0;
  mg3HitCooldown = 0;
  initTrackObjects();
}

export function retryMiniGame3() {
  mg3StartPlaying();
}

export function setMg3TouchUp(v) { mg3TouchUp = v; }
export function setMg3TouchDown(v) { mg3TouchDown = v; }
export function setMg3TouchLeft(v) { mg3TouchBrake = v; }
export function setMg3TouchRight(v) { mg3TouchGas = v; }

export function stopMiniGame3() {
  if (mg3AnimId) {
    cancelAnimationFrame(mg3AnimId);
    mg3AnimId = null;
  }
  window.removeEventListener('keydown', mg3OnKeyDown);
  window.removeEventListener('keyup', mg3OnKeyUp);
  if (mg3Canvas) {
    mg3Canvas.removeEventListener('click', mg3OnCanvasClick);
  }
}
