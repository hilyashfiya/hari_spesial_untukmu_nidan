/* ===================================================
   CO-OP PUZZLE & INTERACTIVE NATURE MECHANISMS — NIDAN & JINAN
   Shaded Tree Bench, Beach Nobar & Meme Cats, Ocean Racing Boosts, & Campfire
   Player Two, Forever 💜
=================================================== */

import { SoundEngine } from './sound.js';
import { drawPixelCat } from './characters.js';

export const puzzleState = {
  // Room 1: Schoolyard memory clues inspected
  room1Clues: [false, false, false],
  
  // Room 2: Nobar Cinema & Video Call sync
  room2Synced: false,
  room2CatInteracted: [false, false, false],
  
  // Room 3: Racing Speed Boosts & Beacons
  room3BeaconsCollected: [false, false, false],

  // Room 4: Mountain Campfire & Stargazing
  room4CampfireLit: false,
  room4TelescopeAligned: false
};

export function resetPuzzles(roomIdx) {
  if (roomIdx === 0) {
    puzzleState.room1Clues = [false, false, false];
  } else if (roomIdx === 1) {
    puzzleState.room2Synced = false;
    puzzleState.room2CatInteracted = [false, false, false];
  } else if (roomIdx === 2) {
    puzzleState.room3BeaconsCollected = [false, false, false];
  } else if (roomIdx === 3) {
    puzzleState.room4CampfireLit = false;
    puzzleState.room4TelescopeAligned = false;
  }
}

/**
 * Handle player interaction with nearby puzzle elements
 */
export function handlePuzzleInteraction(player, roomIdx, onMessage) {
  const px = player.x;
  const py = player.y;

  if (roomIdx === 0) {
    // Shaded tree bench interaction (Sit & relax together)
    if (Math.abs(px - 570) < 45 && Math.abs(py - 220) < 45) {
      SoundEngine.milestone();
      if (onMessage) {
        onMessage("🍃 Kamu dan Jinan duduk bersantai di bawah pohon rindang... angin sejuk membawa damai.");
      }
      return true;
    }

    // School Clues
    const clueNodes = [
      { x: 260, y: 320, id: 0, name: 'Buku Tulis SD' },
      { x: 520, y: 120, id: 1, name: 'Pita Pohon Rindang' },
      { x: 800, y: 240, id: 2, name: 'Catatan Meja SMP' }
    ];

    for (let node of clueNodes) {
      if (Math.abs(px - node.x) < 40 && Math.abs(py - node.y) < 40) {
        if (!puzzleState.room1Clues[node.id]) {
          puzzleState.room1Clues[node.id] = true;
          SoundEngine.collect();
          if (onMessage) {
            onMessage(`📜 [${node.name}] ditemukan! Petunjuk nostalgia masa kecil terkumpul.`);
          }
          return true;
        }
      }
    }
  }

  if (roomIdx === 1) {
    // Nobar Cinema Screen Station (x: 520, y: 215)
    if (Math.abs(px - 520) < 50 && Math.abs(py - 215) < 50) {
      if (!puzzleState.room2Synced) {
        puzzleState.room2Synced = true;
        SoundEngine.collect();
        if (onMessage) {
          onMessage(`🎬 Layar Nobar Pantai tersinkronisasi! Waktunya nonton bareng dan ketawa lepas bareng Jinan!`);
        }
        return true;
      }
    }

    // Meme Cat Interactions on Beach
    const cats = [
      { x: 220, y: 410, id: 0, type: 'muntah', msg: '🐱 [KUCING MUNTAH PELANGI]: "BLEEEEH! Gaya muntah kucing pas video call emang juara bikin salting dan ngakak!"' },
      { x: 640, y: 410, id: 1, type: 'dance', msg: '🐱 [KUCING JOGET ABSURD]: "Kucing ini joget heboh tanpa musik... persis kamu pas lagi iseng video call larut malam!"' },
      { x: 990, y: 410, id: 2, type: 'loaf', msg: '🐱 [KUCING LOAF]: "Purrr... istirahat dulu dari depan laptop ya Nidan, nikmati angin pantai bareng Jinan!"' }
    ];

    for (let c of cats) {
      if (Math.abs(px - c.x) < 45 && Math.abs(py - c.y) < 45) {
        puzzleState.room2CatInteracted[c.id] = true;
        SoundEngine.catMeow();
        if (onMessage) onMessage(c.msg);
        return true;
      }
    }
  }

  if (roomIdx === 2) {
    // Speed boost pads trigger automatically in game engine!
  }

  if (roomIdx === 3) {
    // Campfire lighting at x: 540, y: 210
    if (Math.abs(px - 540) < 50 && Math.abs(py - 210) < 50) {
      if (!puzzleState.room4CampfireLit) {
        puzzleState.room4CampfireLit = true;
        SoundEngine.milestone();
        if (onMessage) {
          onMessage("🔥 Api unggun menyala hangat di bawah taburan bintang pegunungan!");
        }
        return true;
      }
    }

    // Stargazing telescope at x: 740, y: 150
    if (Math.abs(px - 740) < 50 && Math.abs(py - 150) < 50) {
      if (!puzzleState.room4TelescopeAligned) {
        puzzleState.room4TelescopeAligned = true;
        SoundEngine.collect();
        if (onMessage) {
          onMessage("🔭 Rasi bintang teropong selaras! Gerbang perayaan ulang tahun bersinar keemasan!");
        }
        return true;
      }
    }
  }

  return false;
}

/**
 * Draw interactive puzzle elements & nature features in world
 */
export function drawPuzzleElements(ctx, cameraX, roomIdx, t) {
  if (roomIdx === 0) {
    // --- ROOM 1: Giant Shaded Tree (Pohon Rindang) & Park Bench ---
    const treeX = 580 - cameraX;
    if (treeX >= -200 && treeX <= 1000) {
      // Tree Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(treeX - 18, 140, 36, 280);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(treeX - 10, 140, 12, 280);

      // Wide Foliage Canopy (Multi-layered lush greens)
      const sway = Math.sin(t * 0.05) * 3;
      ctx.fillStyle = 'rgba(21, 128, 61, 0.85)';
      ctx.beginPath();
      ctx.arc(treeX + sway, 100, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(22, 163, 74, 0.9)';
      ctx.beginPath();
      ctx.arc(treeX - 45 - sway, 120, 70, 0, Math.PI * 2);
      ctx.arc(treeX + 45 + sway, 120, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(treeX, 85, 45, 0, Math.PI * 2);
      ctx.fill();

      // Drifting falling green leaves
      ctx.fillStyle = '#86efac';
      for (let l = 0; l < 5; l++) {
        const ly = 100 + ((t * 0.8 + l * 35) % 300);
        const lx = treeX + Math.sin(t * 0.06 + l) * 60;
        ctx.fillRect(lx, ly, 3, 3);
      }

      // Wooden Park Bench under the Tree (x: 570, y: 220)
      ctx.fillStyle = '#b45309';
      ctx.fillRect(treeX - 25, 215, 50, 6);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(treeX - 22, 221, 4, 12);
      ctx.fillRect(treeX + 18, 221, 4, 12);
      ctx.fillRect(treeX - 25, 204, 50, 4); // Backrest
    }

  } else if (roomIdx === 1) {
    // --- ROOM 2: Outdoor Cinema Nobar Screen, Palm Trees & Meme Cats ---
    const scrX = 520 - cameraX;
    if (scrX >= -100 && scrX <= 900) {
      // Cinema Screen Frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(scrX - 35, 150, 70, 45);
      ctx.strokeStyle = puzzleState.room2Synced ? '#f472b6' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(scrX - 35, 150, 70, 45);

      // Screen Display
      ctx.fillStyle = puzzleState.room2Synced ? '#0284c7' : '#1e293b';
      ctx.fillRect(scrX - 32, 153, 64, 39);

      // Video content
      if (puzzleState.room2Synced) {
        ctx.fillStyle = '#fef08a';
        ctx.font = '9px "Press Start 2P"';
        ctx.fillText('NOBAR', scrX - 24, 175);
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.font = '8px sans-serif';
        ctx.fillText('PRESS E', scrX - 20, 175);
      }
    }

    // Draw the 3 Meme Cats
    drawPixelCat(ctx, 220 - cameraX, 395, 'muntah', t);
    drawPixelCat(ctx, 640 - cameraX, 395, 'dance', t);
    drawPixelCat(ctx, 990 - cameraX, 398, 'loaf', t);

  } else if (roomIdx === 2) {
    // --- ROOM 3: Ocean Racing Track Speed Boost Pads & Buoys ---
    const pads = [
      { x: 440, y: 276 },
      { x: 740, y: 416 },
      { x: 1180, y: 316 }
    ];

    pads.forEach(p => {
      const rx = p.x - cameraX;
      if (rx >= -50 && rx <= 850) {
        // Glowing cyan-gold speed arrow
        const pulse = Math.sin(t * 0.2) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
        ctx.fillRect(rx, p.y, 36, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(rx + 24, p.y - 2);
        ctx.lineTo(rx + 36, p.y + 3);
        ctx.lineTo(rx + 24, p.y + 8);
        ctx.closePath();
        ctx.fill();
      }
    });

  } else if (roomIdx === 3) {
    // --- ROOM 4: Mountain Campfire, Stargazing Telescope & Cozy Tent ---
    const fireX = 540 - cameraX;
    if (fireX >= -40 && fireX <= 840) {
      // Campfire Stone Ring & Wood Logs
      ctx.fillStyle = '#78350f';
      ctx.fillRect(fireX - 10, 204, 20, 6);
      ctx.fillStyle = '#475569';
      ctx.fillRect(fireX - 12, 208, 24, 4);

      // Crackling Animated Fire Flames
      const fPulse = Math.sin(t * 0.25) * 3;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(fireX, 198, 8 + fPulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(fireX, 196, 5 + fPulse * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(fireX, 200, 3, 0, Math.PI * 2);
      ctx.fill();

      // Rising sparks
      for (let sp = 0; sp < 4; sp++) {
        const spy = 190 - ((t * 0.9 + sp * 14) % 36);
        const spx = fireX + Math.sin(t * 0.15 + sp) * 8;
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(spx, spy, 2, 2);
      }
    }

    // Stargazing Telescope at x: 740, y: 150
    const telX = 740 - cameraX;
    if (telX >= -40 && telX <= 840) {
      // Tripod
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(telX - 4, 144, 2, 16);
      ctx.fillRect(telX + 4, 144, 2, 16);
      ctx.fillRect(telX, 142, 2, 18);
      // Brass Telescope tube angled upward
      ctx.save();
      ctx.translate(telX, 140);
      ctx.rotate(-0.5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-10, -3, 24, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(14, -4, 3, 8); // Lens
      ctx.restore();
    }

    // Canvas Camping Tent at x: 1040, y: 384
    const tentX = 1040 - cameraX;
    if (tentX >= -60 && tentX <= 860) {
      ctx.fillStyle = '#0284c7'; // Sky-blue tent canvas
      ctx.beginPath();
      ctx.moveTo(tentX - 28, 420);
      ctx.lineTo(tentX, 360);
      ctx.lineTo(tentX + 28, 420);
      ctx.closePath();
      ctx.fill();
      // Tent entrance flap
      ctx.fillStyle = '#075985';
      ctx.beginPath();
      ctx.moveTo(tentX - 10, 420);
      ctx.lineTo(tentX, 375);
      ctx.lineTo(tentX + 10, 420);
      ctx.closePath();
      ctx.fill();
    }
  }
}
