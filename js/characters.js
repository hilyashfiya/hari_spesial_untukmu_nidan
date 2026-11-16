/* ===================================================
   CHARACTERS PIXEL ART & EMOTION MODULE — NIDAN & JINAN
   Player One: Nidan (Mahasiswa tekun pembawa laptop — Blue Palette)
   Player Two: Jinan (Mahasiswi ceria & jahil — Soft Pink / Lilac Palette)
   Complete Expressions & Smooth Animations
   Player Two, Forever 💜
=================================================== */

/**
 * Draw Nidan (Player One — Male Student with Laptop)
 * Hitbox: PW=24, PH=36
 * Modes: 'idle', 'walk', 'run', 'jump', 'type', 'cling', 'holdHand', 'hug', 'cheer', 'dance', 'shy', 'laugh', 'sit'
 */
export function drawStudentPixelChar(c, x, y, facingLeft = false, animMode = 'idle', t = 0, emote = null) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  if (facingLeft) {
    c.translate(24, 0);
    c.scale(-1, 1);
  }

  // Soft floor shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.28)';
  c.beginPath();
  c.ellipse(12, 35, 10, 3, 0, 0, Math.PI * 2);
  c.fill();

  let bob = 0;
  let legL = 0, legR = 0;
  let armSw = 0;
  let headSway = 0;

  if (animMode === 'walk' || animMode === 'run' || animMode === 'holdHand') {
    const freq = animMode === 'run' ? 0.32 : 0.22;
    const cycle = Math.sin(t * freq);
    legL = cycle * 3.8;
    legR = -cycle * 3.8;
    bob = Math.abs(Math.sin(t * freq)) * -2.2;
    armSw = cycle * 2.2;
  } else if (animMode === 'jump') {
    bob = -3.5;
    legL = -2;
    legR = 2;
  } else if (animMode === 'type') {
    bob = Math.sin(t * 0.18) * 0.7;
  } else if (animMode === 'cling') {
    bob = Math.sin(t * 0.08) * 0.9;
  } else if (animMode === 'cheer') {
    bob = Math.abs(Math.sin(t * 0.18)) * -2.8;
  } else if (animMode === 'dance') {
    // The famous hilarious absurd video call dance!
    bob = Math.abs(Math.sin(t * 0.3)) * -2.8;
    legL = Math.sin(t * 0.3) * 2.8;
    legR = -Math.sin(t * 0.3) * 2.8;
    armSw = Math.cos(t * 0.3) * 4.5;
    headSway = Math.sin(t * 0.3) * 1.8;
  } else if (animMode === 'shy') {
    bob = Math.sin(t * 0.06) * 0.7;
    headSway = 1;
  } else if (animMode === 'sit') {
    bob = 6;
  } else {
    // Smooth idle breathing
    bob = Math.sin(t * 0.05) * 0.9;
  }

  // Nidan's Distinct Blue Color Identity
  const hairDark = '#1e1b18';
  const hairMid  = '#3b2f2f';
  const hairHigh = '#574843';
  const skinBase = '#fed7aa';
  const skinShad = '#fba779';
  const blush    = 'rgba(244, 114, 182, 0.75)';
  const eyeCol   = '#0f172a';

  const hoodieMid  = '#0284c7'; // Sky / Royal Blue
  const hoodieDark = '#0369a1';
  const hoodieLite = '#38bdf8';
  const shirtCol   = '#ffffff';
  
  const jeansCol   = '#1e293b';
  const jeansDark  = '#0f172a';
  const shoeCol    = '#f8fafc';
  const shoeSole   = '#38bdf8';

  const laptopBody = '#cbd5e1';
  const laptopEdge = '#64748b';
  const laptopSticker = '#f472b6';

  // --- LEGS & SNEAKERS ---
  if (animMode === 'sit') {
    c.fillStyle = jeansCol;
    c.fillRect(7, 26, 8, 4);
    c.fillStyle = shoeCol;
    c.fillRect(14, 28, 5, 4);
    c.fillStyle = shoeSole;
    c.fillRect(14, 31, 5, 1);
  } else {
    c.fillStyle = jeansCol;
    c.fillRect(6, 24 + bob, 4, 7);
    c.fillStyle = shoeCol;
    c.fillRect(5 + legL * 0.3, 31 + bob, 6, 4);
    c.fillStyle = shoeSole;
    c.fillRect(5 + legL * 0.3, 34 + bob, 6, 1);

    c.fillStyle = jeansDark;
    c.fillRect(13, 24 + bob, 4, 7);
    c.fillStyle = shoeCol;
    c.fillRect(12 + legR * 0.3, 31 + bob, 6, 4);
    c.fillStyle = shoeSole;
    c.fillRect(12 + legR * 0.3, 34 + bob, 6, 1);
  }

  // --- HOODIE TORSO ---
  c.fillStyle = hoodieMid;
  c.fillRect(5, 12 + bob, 14, 12);
  c.fillStyle = hoodieDark;
  c.fillRect(5, 22 + bob, 14, 2);
  c.fillStyle = hoodieLite;
  c.fillRect(6, 12 + bob, 12, 1);

  // Inner white t-shirt collar V
  c.fillStyle = shirtCol;
  c.fillRect(10, 12 + bob, 4, 3);
  c.fillStyle = hoodieMid;
  c.fillRect(11, 14 + bob, 2, 2);

  // Backpack strap across shoulder
  c.fillStyle = '#1e3a8a';
  c.fillRect(6, 13 + bob, 2, 9);

  // --- LAPTOP SLUNG UNDER ARM ---
  if (animMode !== 'hug') {
    c.fillStyle = laptopEdge;
    c.fillRect(1, 16 + bob, 4, 8);
    c.fillStyle = laptopBody;
    c.fillRect(1, 17 + bob, 3, 6);
    c.fillStyle = laptopSticker;
    c.fillRect(2, 19 + bob, 1, 1); // Heart sticker on laptop lid
  }

  // --- LEFT ARM ---
  c.fillStyle = hoodieDark;
  c.fillRect(4, 13 + bob, 3, 7);
  c.fillStyle = skinBase;
  c.fillRect(4, 20 + bob, 3, 3);

  // --- RIGHT ARM ---
  c.fillStyle = hoodieMid;
  if (animMode === 'cheer' || animMode === 'dance') {
    c.fillRect(17, 7 + bob + armSw, 3, 7);
    c.fillStyle = skinBase;
    c.fillRect(17, 5 + bob + armSw, 3, 3);
  } else {
    c.fillRect(17, 13 + bob + armSw, 3, 7);
    c.fillStyle = skinBase;
    c.fillRect(17, 20 + bob + armSw, 3, 3);
  }

  // --- HEAD & FACE ---
  const headY = 2 + bob * 0.5;
  const headX = 6 + headSway;

  // Neck
  c.fillStyle = skinShad;
  c.fillRect(headX + 4, headY + 8, 4, 3);

  // Face
  c.fillStyle = skinBase;
  c.fillRect(headX, headY, 12, 9);
  c.fillStyle = skinShad;
  c.fillRect(headX, headY + 8, 12, 1);

  // Blush on cheeks
  if (emote === 'shy' || animMode === 'shy' || animMode === 'cling') {
    c.fillStyle = blush;
    c.fillRect(headX + 1, headY + 5, 3, 2);
    c.fillRect(headX + 8, headY + 5, 3, 2);
  }

  // Eyes & Eyebrows
  if (animMode === 'laugh' || animMode === 'cheer') {
    // Happy squinting ^ ^
    c.fillStyle = eyeCol;
    c.fillRect(headX + 2, headY + 3, 3, 1);
    c.fillRect(headX + 7, headY + 3, 3, 1);
  } else {
    c.fillStyle = eyeCol;
    c.fillRect(headX + 3, headY + 3, 2, 3);
    c.fillRect(headX + 8, headY + 3, 2, 3);
    // Eye catchlight
    c.fillStyle = '#ffffff';
    c.fillRect(headX + 3, headY + 3, 1, 1);
    c.fillRect(headX + 8, headY + 3, 1, 1);
  }

  // Eyebrows
  c.fillStyle = hairDark;
  c.fillRect(headX + 2, headY + 1, 3, 1);
  c.fillRect(headX + 7, headY + 1, 3, 1);

  // Gentle Smile
  c.fillStyle = '#b45309';
  c.fillRect(headX + 5, headY + 7, 3, 1);

  // --- HAIR ---
  c.fillStyle = hairDark;
  c.fillRect(headX - 1, headY - 3, 14, 4);
  c.fillRect(headX - 1, headY, 2, 5);
  c.fillRect(headX + 11, headY, 2, 5);
  c.fillStyle = hairMid;
  c.fillRect(headX, headY - 4, 12, 2);
  c.fillRect(headX + 1, headY - 1, 10, 2);
  c.fillStyle = hairHigh;
  c.fillRect(headX + 3, headY - 3, 5, 1);

  // Floating emote
  if (emote) {
    drawEmoteBubble(c, 12, headY - 6, emote, t);
  }

  c.restore();
}

/**
 * Draw Jinan (Player Two — Female Student with Lilac/Pink Palette)
 * Hitbox: PW=24, PH=36
 * Modes: 'idle', 'walk', 'wave', 'cheer', 'dance', 'shy', 'giggle', 'gift', 'holdHand', 'sit'
 */
export function drawGirlfriendPixelChar(c, x, y, facingLeft = true, animMode = 'idle', t = 0, emote = null) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  if (facingLeft) {
    c.translate(24, 0);
    c.scale(-1, 1);
  }

  // Soft floor shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.28)';
  c.beginPath();
  c.ellipse(12, 35, 9, 3, 0, 0, Math.PI * 2);
  c.fill();

  let bob = 0;
  let legL = 0, legR = 0;
  let waveArm = 0;
  let headTilt = 0;

  if (animMode === 'walk' || animMode === 'holdHand') {
    const cycle = Math.sin(t * 0.22);
    legL = cycle * 3.5;
    legR = -cycle * 3.5;
    bob = Math.abs(Math.sin(t * 0.22)) * -2.2;
  } else if (animMode === 'wave') {
    bob = Math.sin(t * 0.1) * 0.8;
    waveArm = Math.sin(t * 0.3) * 5;
    headTilt = 0.5;
  } else if (animMode === 'cheer') {
    bob = Math.abs(Math.sin(t * 0.18)) * -2.8;
    waveArm = -4;
  } else if (animMode === 'dance') {
    bob = Math.abs(Math.sin(t * 0.3)) * -2.8;
    legL = Math.sin(t * 0.3) * 2.8;
    legR = -Math.sin(t * 0.3) * 2.8;
    waveArm = Math.sin(t * 0.3) * 6;
    headTilt = Math.sin(t * 0.3) * 2;
  } else if (animMode === 'giggle') {
    bob = Math.abs(Math.sin(t * 0.25)) * -1.5;
    headTilt = Math.sin(t * 0.15) * 1.5;
  } else if (animMode === 'shy') {
    bob = Math.sin(t * 0.06) * 0.6;
    headTilt = -1;
  } else if (animMode === 'sit') {
    bob = 6;
  } else {
    // Smooth idle breathing
    bob = Math.sin(t * 0.05 + 1) * 0.9;
  }

  // Jinan's Soft Pink & Lilac Romantic Palette
  const hairDark = '#26120b';
  const hairMid  = '#452317';
  const hairRibbon = '#f472b6'; // Cute pink hair ribbon
  const skinBase = '#fed7aa';
  const skinShad = '#fba779';
  const blush    = '#f472b6';
  const eyeCol   = '#1e1b4b';

  const cardiganCol = '#fbcfe8'; // Pastel Soft Pink
  const cardiganMid = '#f472b6';
  const skirtCol    = '#475569';
  const shoeCol     = '#fdf2f8';
  const sleeveBagCol= '#c084fc'; // Soft Lilac Laptop Sleeve

  // --- LEGS & SHOES ---
  if (animMode === 'sit') {
    c.fillStyle = skirtCol;
    c.fillRect(7, 24, 8, 5);
    c.fillStyle = skinBase;
    c.fillRect(13, 27, 4, 3);
    c.fillStyle = shoeCol;
    c.fillRect(15, 29, 4, 3);
  } else {
    c.fillStyle = skinBase;
    c.fillRect(7, 25 + bob, 3, 6);
    c.fillStyle = shoeCol;
    c.fillRect(6 + legL * 0.25, 31 + bob, 5, 4);

    c.fillStyle = skinShad;
    c.fillRect(13, 25 + bob, 3, 6);
    c.fillStyle = shoeCol;
    c.fillRect(12 + legR * 0.25, 31 + bob, 5, 4);
  }

  // --- SKIRT ---
  c.fillStyle = skirtCol;
  c.fillRect(6, 21 + bob, 11, 5);

  // --- CARDIGAN & BLOUSE ---
  c.fillStyle = cardiganCol;
  c.fillRect(5, 12 + bob, 13, 10);
  c.fillStyle = cardiganMid;
  c.fillRect(5, 21 + bob, 13, 1);
  c.fillRect(11, 13 + bob, 1, 8); // Cardigan seam

  // White collar
  c.fillStyle = '#ffffff';
  c.fillRect(9, 12 + bob, 5, 2);

  // --- JINAN'S STUDENT LAPTOP SLEEVE ---
  c.fillStyle = sleeveBagCol;
  c.fillRect(1, 16 + bob, 4, 8);
  c.fillStyle = '#a855f7';
  c.fillRect(1, 16 + bob, 4, 1);
  c.fillStyle = '#f472b6';
  c.fillRect(2, 19 + bob, 2, 2); // Heart sticker

  // --- ARMS ---
  c.fillStyle = cardiganCol;
  if (animMode === 'wave') {
    c.fillRect(16, 7 + waveArm + bob, 3, 7);
    c.fillStyle = skinBase;
    c.fillRect(16, 5 + waveArm + bob, 3, 3);
  } else if (animMode === 'gift') {
    // Handing over envelope
    c.fillRect(15, 13 + bob, 6, 3);
    c.fillStyle = skinBase;
    c.fillRect(20, 13 + bob, 3, 3);
  } else {
    c.fillRect(15, 13 + bob, 3, 7);
    c.fillStyle = skinBase;
    c.fillRect(15, 20 + bob, 3, 3);
  }

  // --- HEAD & FACE ---
  const headY = 2 + bob * 0.5;
  const headX = 6 + headTilt;

  // Neck
  c.fillStyle = skinShad;
  c.fillRect(headX + 4, headY + 8, 4, 2);

  // Face
  c.fillStyle = skinBase;
  c.fillRect(headX, headY, 12, 9);

  // Blushing cheeks
  c.fillStyle = blush;
  c.fillRect(headX + 1, headY + 5, 3, 2);
  c.fillRect(headX + 8, headY + 5, 3, 2);

  // Eyes
  if (animMode === 'giggle' || animMode === 'dance') {
    c.fillStyle = eyeCol;
    c.fillRect(headX + 3, headY + 3, 2, 1);
    c.fillRect(headX + 7, headY + 3, 2, 1);
  } else {
    c.fillStyle = eyeCol;
    c.fillRect(headX + 3, headY + 3, 2, 3);
    c.fillRect(headX + 7, headY + 3, 2, 3);
    // Sparkle catchlight
    c.fillStyle = '#ffffff';
    c.fillRect(headX + 3, headY + 3, 1, 1);
    c.fillRect(headX + 7, headY + 3, 1, 1);
  }

  // Sweet Smile
  c.fillStyle = '#be123c';
  c.fillRect(headX + 4, headY + 7, 4, 1);

  // --- HAIR & RIBBON ---
  c.fillStyle = hairDark;
  c.fillRect(headX - 1, headY - 3, 14, 4);
  c.fillRect(headX - 2, headY, 3, 14); // Long side locks
  c.fillRect(headX + 11, headY, 3, 14);
  c.fillStyle = hairMid;
  c.fillRect(headX, headY - 4, 12, 2);
  c.fillRect(headX + 1, headY - 1, 10, 2);

  // Pink Ribbon in hair
  c.fillStyle = hairRibbon;
  c.fillRect(headX + 9, headY - 4, 3, 2);
  c.fillRect(headX + 10, headY - 2, 2, 2);

  // Emote
  if (emote) {
    drawEmoteBubble(c, 12, headY - 6, emote, t);
  }

  c.restore();
}

/**
 * Draw Floating Emote Bubbles
 */
function drawEmoteBubble(c, x, y, emote, t) {
  c.save();
  c.translate(x, y);

  if (emote === 'heart') {
    const pulse = Math.sin(t * 0.1) * 2;
    c.fillStyle = '#f472b6';
    c.font = '12px sans-serif';
    c.textAlign = 'center';
    c.fillText('♥', 0, -2 + pulse);
  } else if (emote === 'star') {
    c.fillStyle = '#fbbf24';
    c.font = '11px sans-serif';
    c.textAlign = 'center';
    c.fillText('★', 0, -2);
  } else if (emote === 'giggle') {
    c.fillStyle = '#ec4899';
    c.font = '8px "Press Start 2P"';
    c.textAlign = 'center';
    c.fillText('XD', 0, -2);
  } else if (emote === 'shy') {
    c.fillStyle = '#f472b6';
    c.font = '8px monospace';
    c.textAlign = 'center';
    c.fillText('///', 0, -2);
  } else if (emote === 'cat') {
    c.fillStyle = '#f59e0b';
    c.font = '11px sans-serif';
    c.textAlign = 'center';
    c.fillText('🐱', 0, -2);
  }
  c.restore();
}

/**
 * Draw Couple Hug (Warm, Multi-Stage Embrace)
 */
export function drawCoupleHug(c, x, y, t) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  // Radiating heart pulse aura
  const pulse = Math.sin(t * 0.08) * 4;
  c.fillStyle = 'rgba(56, 189, 248, 0.25)';
  c.beginPath();
  c.arc(14, 18, 28 + pulse, 0, Math.PI * 2);
  c.fill();

  c.fillStyle = 'rgba(244, 114, 182, 0.22)';
  c.beginPath();
  c.arc(14, 18, 38 + pulse, 0, Math.PI * 2);
  c.fill();

  // Nidan (left) and Jinan (right) embracing
  drawStudentPixelChar(c, 0, 0, false, 'idle', t, null);
  drawGirlfriendPixelChar(c, 8, 0, true, 'idle', t, null);

  // Arms wrapped around each other
  c.fillStyle = '#0369a1';
  c.fillRect(6, 17, 10, 4); // Nidan's blue hoodie arm
  c.fillStyle = '#fed7aa';
  c.fillRect(15, 17, 3, 3);

  c.fillStyle = '#f472b6';
  c.fillRect(4, 19, 10, 3); // Jinan's pink sleeve arm
  c.fillStyle = '#fed7aa';
  c.fillRect(3, 19, 3, 3);

  // Floating animated hearts above their heads
  for (let i = 0; i < 3; i++) {
    const heartY = -8 - ((t * 0.6 + i * 14) % 24);
    const heartX = 14 + Math.sin(t * 0.1 + i) * 10;
    c.fillStyle = i === 0 ? '#f472b6' : (i === 1 ? '#38bdf8' : '#fbbf24');
    c.font = `${10 + i * 2}px sans-serif`;
    c.textAlign = 'center';
    c.fillText('♥', heartX, heartY);
  }

  c.restore();
}

/**
 * Couple Sitting Together Peacefully (Bench / Campfire)
 */
export function drawCoupleSitting(c, x, y, t) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  // Nidan sitting on left
  drawStudentPixelChar(c, 0, 0, false, 'sit', t, 'heart');

  // Jinan sitting on right, leaning slightly toward him
  drawGirlfriendPixelChar(c, 16, 0, true, 'sit', t, 'giggle');

  // Hands gently touching between them
  c.fillStyle = '#fed7aa';
  c.fillRect(14, 25, 4, 3);

  c.restore();
}

/**
 * SPECIAL INTERACTION: Nidan Leaning Affectionately to Jinan
 */
export function drawCoupleCling(c, x, y, t) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  drawGirlfriendPixelChar(c, 14, 0, true, 'giggle', t, 'giggle');
  drawStudentPixelChar(c, 3, 0, false, 'cling', t, 'heart');

  // Head leaning on shoulder
  c.fillStyle = '#1e1b18';
  c.fillRect(12, 6, 4, 4);

  const pulse = Math.sin(t * 0.1) * 3;
  c.fillStyle = 'rgba(254, 240, 138, 0.85)';
  c.font = '12px sans-serif';
  c.fillText('✨', 8, -4 + pulse);

  c.restore();
}

/**
 * SPECIAL INTERACTION: Walking Hand-in-Hand
 */
export function drawCoupleHoldingHandsWalk(c, x, y, t) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  drawStudentPixelChar(c, 22, 0, false, 'holdHand', t, 'star');
  drawGirlfriendPixelChar(c, 2, 0, false, 'holdHand', t, 'heart');

  c.fillStyle = '#fed7aa';
  c.fillRect(18, 17, 7, 3);
  c.fillStyle = '#38bdf8';
  c.fillRect(20, 16, 3, 2);

  c.restore();
}

/**
 * Draw Meme Cat Pixel Entities
 * Diverse expressions: 'muntah', 'dance', 'loaf', 'shy', 'bengong', 'marah', 'cry', 'happy', 'shocked', 'wave'
 */
export function drawPixelCat(c, x, y, catType = 'muntah', t = 0) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  const bob = Math.sin(t * 0.1) * 1.5;

  if (catType === 'muntah' || catType === 'absurd') {
    // The famous hilarious "muntah pelangi" face!
    c.fillStyle = '#f97316';
    c.fillRect(0, 8 + bob, 18, 12);
    c.fillStyle = '#ea580c';
    c.fillRect(4, 8 + bob, 2, 6);
    c.fillRect(10, 8 + bob, 2, 6);

    // Head tilted down with wide open gagging mouth
    c.fillStyle = '#f97316';
    c.fillRect(14, 4 + bob, 12, 11);
    c.fillStyle = '#ea580c';
    c.fillRect(15, 1 + bob, 3, 3);
    c.fillRect(22, 1 + bob, 3, 3);

    // Goofy >< eyes
    c.fillStyle = '#0f172a';
    c.font = '6px "Press Start 2P"';
    c.fillText('><', 15, 9 + bob);

    // Gaping mouth spewing rainbow stream
    c.fillStyle = '#7f1d1d';
    c.fillRect(24, 11 + bob, 4, 5);

    const rColors = ['#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6'];
    for (let r = 0; r < 5; r++) {
      const rx = 28 + r * 5;
      const ry = 12 + bob + Math.sin(t * 0.2 + r) * 3;
      c.fillStyle = rColors[r % rColors.length];
      c.fillRect(rx, ry, 4, 3);
    }

    c.fillStyle = '#f97316';
    c.fillRect(2, 20 + bob, 3, 3);
    c.fillRect(13, 20 + bob, 3, 3);
    c.fillRect(-4, 9 + bob, 4, 3);

  } else if (catType === 'dance') {
    // Goofy dancing cat with paws in the air
    const danceBob = Math.abs(Math.sin(t * 0.25)) * -3;
    c.fillStyle = '#fbbf24';
    c.fillRect(2, 6 + danceBob, 14, 14);

    c.fillRect(0, 1 + danceBob, 3, 6);
    c.fillRect(15, 1 + danceBob, 3, 6);

    c.fillStyle = '#0f172a';
    c.fillRect(5, 10 + danceBob, 2, 2);
    c.fillRect(11, 10 + danceBob, 2, 2);
    c.fillStyle = '#ec4899';
    c.fillRect(8, 13 + danceBob, 2, 2);

    c.fillStyle = '#f472b6';
    c.font = '10px sans-serif';
    c.fillText('♪', 18, 2 + danceBob);

  } else if (catType === 'shy' || catType === 'blush') {
    // Shy cat with rosy blushing cheeks and twiddling paws
    const shyBob = Math.sin(t * 0.08) * 1;
    c.fillStyle = '#fed7aa'; // Cream calico
    c.fillRect(2, 8 + shyBob, 16, 12);
    c.fillStyle = '#ea580c';
    c.fillRect(12, 8 + shyBob, 6, 6); // Calico patch

    // Head
    c.fillStyle = '#fed7aa';
    c.fillRect(4, 2 + shyBob, 14, 10);
    c.fillStyle = '#f97316';
    c.fillRect(4, 0 + shyBob, 3, 3);
    c.fillRect(14, 0 + shyBob, 3, 3);

    // Blushing eyes & cheeks
    c.fillStyle = '#1e293b';
    c.fillRect(7, 5 + shyBob, 2, 2);
    c.fillRect(12, 5 + shyBob, 2, 2);

    c.fillStyle = 'rgba(244, 114, 182, 0.85)'; // Pink blush
    c.fillRect(5, 7 + shyBob, 3, 2);
    c.fillRect(13, 7 + shyBob, 3, 2);

    // Twiddling paws
    c.fillStyle = '#ffffff';
    c.fillRect(8, 11 + shyBob, 2, 2);
    c.fillRect(11, 11 + shyBob, 2, 2);

    // Tiny floating heart
    c.fillStyle = '#f472b6';
    c.font = '9px sans-serif';
    c.fillText('♡', 18, 2 + shyBob + Math.sin(t * 0.15) * 2);

  } else if (catType === 'bengong' || catType === 'derp') {
    // Blank stare cat, tongue out (blep), unblinking eyes
    c.fillStyle = '#e2e8f0'; // Grayish white
    c.fillRect(2, 8 + bob, 16, 12);

    // Big round head
    c.fillRect(3, 2 + bob, 14, 11);
    c.fillStyle = '#94a3b8';
    c.fillRect(3, 0 + bob, 3, 3);
    c.fillRect(14, 0 + bob, 3, 3);

    // Huge unblinking eyes looking in slightly different directions
    c.fillStyle = '#ffffff';
    c.fillRect(5, 4 + bob, 4, 4);
    c.fillRect(11, 4 + bob, 4, 4);
    c.fillStyle = '#0f172a';
    c.fillRect(6, 5 + bob, 2, 2);
    c.fillRect(13, 5 + bob, 2, 2);

    // Cute pink blep tongue
    c.fillStyle = '#f472b6';
    c.fillRect(9, 9 + bob, 2, 3);

    // Question mark
    c.fillStyle = '#38bdf8';
    c.font = 'bold 8px monospace';
    c.fillText('?', 18, 3 + bob);

  } else if (catType === 'marah' || catType === 'pout') {
    // Grumpy pouty cat with cross anger mark
    const poutBob = Math.sin(t * 0.2) * 1;
    c.fillStyle = '#f97316';
    c.fillRect(2, 7 + poutBob, 16, 13);

    // Puffed angry head
    c.fillRect(3, 2 + poutBob, 15, 11);
    c.fillStyle = '#ea580c';
    c.fillRect(3, 0 + poutBob, 3, 3);
    c.fillRect(14, 0 + poutBob, 3, 3);

    // Furrowed brows > <
    c.fillStyle = '#0f172a';
    c.font = '6px "Press Start 2P"';
    c.fillText('><', 6, 8 + poutBob);

    // Angry cross mark 💢
    c.fillStyle = '#ef4444';
    c.font = '8px sans-serif';
    c.fillText('💢', 17, 3 + poutBob);

  } else if (catType === 'cry' || catType === 'happy-tears') {
    // Overjoyed crying cat with anime waterfall tears
    c.fillStyle = '#fed7aa';
    c.fillRect(2, 8 + bob, 16, 12);

    c.fillRect(3, 2 + bob, 14, 11);
    c.fillStyle = '#ea580c';
    c.fillRect(3, 0 + bob, 3, 3);
    c.fillRect(14, 0 + bob, 3, 3);

    // Closed crying happy eyes T_T
    c.fillStyle = '#1e293b';
    c.font = '6px "Press Start 2P"';
    c.fillText('TT', 6, 7 + bob);

    // Waterfall blue tears
    c.fillStyle = '#38bdf8';
    c.fillRect(5, 8 + bob, 2, 7);
    c.fillRect(13, 8 + bob, 2, 7);

    c.fillStyle = '#f472b6';
    c.font = '8px sans-serif';
    c.fillText('✨', 18, 2 + bob);

  } else if (catType === 'happy' || catType === 'purr') {
    // Joyful purring golden cat with squinting happy eyes ^.^
    const happyBob = Math.abs(Math.sin(t * 0.15)) * -2;
    c.fillStyle = '#f59e0b'; // Golden warm orange
    c.fillRect(2, 8 + happyBob, 16, 12);

    c.fillRect(3, 2 + happyBob, 14, 11);
    c.fillStyle = '#d97706';
    c.fillRect(3, 0 + happyBob, 3, 3);
    c.fillRect(14, 0 + happyBob, 3, 3);

    // Happy squinting eyes ^^
    c.fillStyle = '#1e293b';
    c.font = '6px "Press Start 2P"';
    c.fillText('^^', 6, 7 + happyBob);

    // Cute smiling mouth :3
    c.fillStyle = '#ea580c';
    c.fillRect(9, 8 + happyBob, 2, 1);

    // Wagging tail
    const tailAngle = Math.sin(t * 0.3) * 4;
    c.fillStyle = '#d97706';
    c.fillRect(-2, 10 + happyBob + tailAngle, 3, 6);

    // Floating purr heart
    c.fillStyle = '#f472b6';
    c.font = '9px sans-serif';
    c.fillText('♥', 18, 1 + happyBob);

  } else if (catType === 'shocked' || catType === 'popcat') {
    // Shocked cat with huge open O mouth (popcat style!)
    c.fillStyle = '#f8fafc';
    c.fillRect(2, 8 + bob, 16, 12);

    c.fillRect(3, 1 + bob, 14, 12);
    c.fillStyle = '#e2e8f0';
    c.fillRect(3, -1 + bob, 3, 3);
    c.fillRect(14, -1 + bob, 3, 3);

    // Wide open shocked eyes
    c.fillStyle = '#0f172a';
    c.beginPath();
    c.arc(7, 5 + bob, 2, 0, Math.PI * 2);
    c.arc(13, 5 + bob, 2, 0, Math.PI * 2);
    c.fill();

    // Giant O mouth
    c.fillStyle = '#be123c';
    c.beginPath();
    c.arc(10, 9 + bob, 3.5, 0, Math.PI * 2);
    c.fill();

    // Exclamation mark
    c.fillStyle = '#ef4444';
    c.font = 'bold 9px monospace';
    c.fillText('!', 18, 1 + bob);

  } else if (catType === 'wave' || catType === 'cheer') {
    // Cheerful cat waving a little pink blossom or paw
    const waveBob = Math.sin(t * 0.2) * 1.5;
    c.fillStyle = '#fef08a'; // Cream yellow
    c.fillRect(2, 7 + waveBob, 16, 13);

    c.fillRect(3, 1 + waveBob, 14, 11);
    c.fillStyle = '#f59e0b';
    c.fillRect(3, -1 + waveBob, 3, 3);
    c.fillRect(14, -1 + waveBob, 3, 3);

    c.fillStyle = '#1e293b';
    c.font = '6px "Press Start 2P"';
    c.fillText('^^', 6, 6 + waveBob);

    // Waving paw holding pink blossom
    const pawY = -2 + Math.sin(t * 0.3) * 3;
    c.fillStyle = '#fef08a';
    c.fillRect(16, 3 + waveBob + pawY, 3, 6);
    c.fillStyle = '#f472b6';
    c.font = '9px sans-serif';
    c.fillText('🌸', 16, 2 + waveBob + pawY);

  } else {
    // Default: Loaf cat peacefully sleeping with Zzz
    c.fillStyle = '#f8fafc';
    c.fillRect(0, 8, 20, 10);
    c.fillStyle = '#e2e8f0';
    c.fillRect(2, 6, 8, 5);
    c.fillStyle = '#475569';
    c.fillRect(3, 8, 2, 1);
    c.fillStyle = '#38bdf8';
    c.font = '8px "Press Start 2P"';
    c.fillText('z', 12, 4 + Math.sin(t * 0.08) * 2);
  }

  c.restore();
}

/**
 * Draw Pixel-Art Flowers with Gentle Natural Sway
 * Types: 'daisy', 'tulip', 'wildflower', 'heart', 'vine'
 */
export function drawPixelFlower(c, x, y, flowerType = 'daisy', t = 0, scale = 1) {
  c.save();
  c.translate(Math.round(x), Math.round(y));
  if (scale !== 1) c.scale(scale, scale);

  const sway = Math.sin(t * 0.06 + x * 0.1) * 1.5;

  if (flowerType === 'tulip') {
    // Graceful cup-shaped tulip in romantic soft crimson/pink
    // Stem
    c.strokeStyle = '#15803d';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(sway * 0.5, -8, sway, -16);
    c.stroke();

    // Leaf
    c.fillStyle = '#22c55e';
    c.beginPath();
    c.ellipse(-3 + sway * 0.3, -7, 4, 1.8, -0.4, 0, Math.PI * 2);
    c.fill();

    // Tulip Petals
    c.fillStyle = '#f43f5e';
    c.beginPath();
    c.arc(sway, -19, 5, 0, Math.PI);
    c.lineTo(sway + 5, -23);
    c.lineTo(sway + 2, -20);
    c.lineTo(sway, -24);
    c.lineTo(sway - 2, -20);
    c.lineTo(sway - 5, -23);
    c.closePath();
    c.fill();

    // Petal Highlight
    c.fillStyle = '#fbcfe8';
    c.fillRect(sway - 2, -21, 2, 3);

  } else if (flowerType === 'heart') {
    // Romantic blooming heart flower
    c.strokeStyle = '#16a34a';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(sway * 0.5, -7, sway, -14);
    c.stroke();

    // Delicate heart bloom
    c.fillStyle = '#f472b6';
    c.beginPath();
    c.arc(sway - 2.5, -18, 3, 0, Math.PI * 2);
    c.arc(sway + 2.5, -18, 3, 0, Math.PI * 2);
    c.fill();
    c.beginPath();
    c.moveTo(sway - 5.5, -17);
    c.lineTo(sway, -12);
    c.lineTo(sway + 5.5, -17);
    c.closePath();
    c.fill();

    // Golden dewdrops
    c.fillStyle = '#fef08a';
    c.fillRect(sway - 1, -17, 2, 2);

  } else if (flowerType === 'wildflower') {
    // Dainty cluster of sky-blue and lavender florets
    c.strokeStyle = '#15803d';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(sway, -12);
    c.stroke();

    const florets = [
      { dx: 0, dy: -14, col: '#38bdf8' },
      { dx: -4, dy: -11, col: '#c084fc' },
      { dx: 4, dy: -11, col: '#7dd3fc' },
      { dx: 0, dy: -8, col: '#f472b6' }
    ];
    florets.forEach(f => {
      c.fillStyle = f.col;
      c.beginPath();
      c.arc(sway + f.dx, f.dy, 2.2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = '#ffffff';
      c.fillRect(sway + f.dx - 0.5, f.dy - 0.5, 1, 1);
    });

  } else if (flowerType === 'vine') {
    // Flowing emerald vine with heart-shaped ivy leaves
    c.strokeStyle = '#15803d';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(8, -10, -8, -20, sway, -30);
    c.stroke();

    for (let v = 0; v < 3; v++) {
      const vy = -8 - v * 9;
      const vx = (v % 2 === 0 ? 5 : -5) + sway * 0.3;
      c.fillStyle = '#22c55e';
      c.beginPath();
      c.arc(vx, vy, 3, 0, Math.PI * 2);
      c.fill();
      // Tiny blossom bud
      c.fillStyle = '#fbcfe8';
      c.fillRect(vx + (v % 2 === 0 ? 2 : -2), vy - 2, 2, 2);
    }

  } else {
    // Default: Classic Daisy (White petals, sunny gold center)
    c.strokeStyle = '#16a34a';
    c.lineWidth = 1.5;
    c.beginPath();
    c.moveTo(0, 0);
    c.quadraticCurveTo(sway * 0.5, -6, sway, -13);
    c.stroke();

    // Stem leaf
    c.fillStyle = '#22c55e';
    c.beginPath();
    c.ellipse(-3 + sway * 0.4, -6, 3.5, 1.5, -0.3, 0, Math.PI * 2);
    c.fill();

    // 6 White Petals
    const px = sway;
    const py = -15;
    c.fillStyle = '#ffffff';
    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2 + t * 0.02;
      const petX = px + Math.cos(angle) * 3.8;
      const petY = py + Math.sin(angle) * 3.8;
      c.beginPath();
      c.arc(petX, petY, 2.2, 0, Math.PI * 2);
      c.fill();
    }

    // Golden Yellow Center
    c.fillStyle = '#fbbf24';
    c.beginPath();
    c.arc(px, py, 2.4, 0, Math.PI * 2);
    c.fill();
  }

  c.restore();
}

/**
 * Draw Gentle Drifting Flower Petals across Screen
 */
export function drawDriftingPetals(c, cw, ch, t) {
  c.save();
  for (let i = 0; i < 12; i++) {
    const px = ((i * 73 + t * 0.6) % (cw + 40)) - 20;
    const py = ((i * 47 + Math.sin(t * 0.04 + i) * 18 + t * 0.35) % (ch + 30)) - 15;
    const rot = t * 0.05 + i;
    const isPink = i % 2 === 0;

    c.save();
    c.translate(px, py);
    c.rotate(rot);
    c.fillStyle = isPink ? 'rgba(244, 114, 182, 0.55)' : 'rgba(254, 240, 138, 0.5)';
    c.beginPath();
    c.ellipse(0, 0, 3.5, 1.8, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
  c.restore();
}

/**
 * Draw Room 3 Water Racer (Jet-Ski / Sprint Boat)
 */
export function drawRacerVehicle(c, x, y, facingLeft = false, t = 0) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  if (facingLeft) {
    c.translate(32, 0);
    c.scale(-1, 1);
  }

  const bob = Math.sin(t * 0.2) * 1.5;

  // Water spray wake
  c.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let w = 0; w < 4; w++) {
    const wx = -10 - w * 6 - ((t * 2) % 12);
    const wy = 24 + Math.sin(t * 0.3 + w) * 3;
    c.beginPath();
    c.arc(wx, wy, 3 + w, 0, Math.PI * 2);
    c.fill();
  }

  // Jet-ski Hull (Aerodynamic Sky Blue & White)
  c.fillStyle = '#0284c7';
  c.beginPath();
  c.moveTo(-4, 22 + bob);
  c.lineTo(34, 22 + bob);
  c.lineTo(40, 16 + bob);
  c.lineTo(14, 14 + bob);
  c.lineTo(-4, 18 + bob);
  c.closePath();
  c.fill();

  // White Accent Stripe
  c.fillStyle = '#f8fafc';
  c.fillRect(0, 18 + bob, 32, 3);

  // Handlebars
  c.fillStyle = '#0f172a';
  c.fillRect(18, 8 + bob, 3, 7);
  c.fillRect(14, 7 + bob, 11, 2);

  // Nidan riding in focused racing pose!
  drawStudentPixelChar(c, 2, -10 + bob, false, 'type', t);

  c.restore();
}

/**
 * Draw Interactive PlayStation Console & Controller for Landing Screen
 */
export function drawPlayStationHub(c, x, y, t) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  // Console shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.35)';
  c.beginPath();
  c.ellipse(140, 115, 110, 16, 0, 0, Math.PI * 2);
  c.fill();

  // --- PLAYSTATION CONSOLE (Center — Sleek White Curved Body) ---
  const cx = 110;
  const cy = 40;

  // Outer White Wings
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(cx, cy);
  c.lineTo(cx + 60, cy - 8);
  c.lineTo(cx + 64, cy + 68);
  c.lineTo(cx + 4, cy + 74);
  c.closePath();
  c.fill();

  // Inner Black Core
  c.fillStyle = '#0f172a';
  c.fillRect(cx + 10, cy + 6, 44, 62);

  // Iconic Glowing Blue LED Lightbar
  const ledPulse = Math.sin(t * 0.1) * 0.3 + 0.7;
  c.fillStyle = `rgba(56, 189, 248, ${ledPulse})`;
  c.fillRect(cx + 10, cy + 8, 2, 58);
  c.fillRect(cx + 52, cy + 8, 2, 58);

  // Disc Drive Slot
  c.fillStyle = '#334155';
  c.fillRect(cx + 44, cy + 30, 2, 28);

  // PlayStation Logo Badge (△ ◯ ✕ ▢)
  c.fillStyle = '#38bdf8';
  c.font = '7px sans-serif';
  c.fillText('PS', cx + 18, cy + 22);

  // Power Button
  c.fillStyle = '#38bdf8';
  c.fillRect(cx + 20, cy + 60, 4, 2);

  // --- PLAYSTATION CONTROLLER (Floating on Right with Animation) ---
  const ctrlX = cx + 80;
  const ctrlY = cy + 20 + Math.sin(t * 0.08) * 4;

  // Controller Body
  c.fillStyle = '#f8fafc';
  c.beginPath();
  c.roundRect ? c.roundRect(ctrlX, ctrlY, 44, 28, 6) : c.fillRect(ctrlX, ctrlY, 44, 28);
  c.fill();
  c.strokeStyle = '#0284c7';
  c.lineWidth = 1;
  c.stroke();

  // Grip Wings
  c.fillStyle = '#f8fafc';
  c.fillRect(ctrlX - 4, ctrlY + 14, 8, 16);
  c.fillRect(ctrlX + 40, ctrlY + 14, 8, 16);

  // Touchpad with Blue Glow
  c.fillStyle = '#0f172a';
  c.fillRect(ctrlX + 14, ctrlY + 4, 16, 10);
  c.fillStyle = 'rgba(56, 189, 248, 0.8)';
  c.fillRect(ctrlX + 14, ctrlY + 13, 16, 1);

  // D-Pad on Left
  c.fillStyle = '#334155';
  c.fillRect(ctrlX + 4, ctrlY + 8, 6, 2);
  c.fillRect(ctrlX + 6, ctrlY + 6, 2, 6);

  // Action Buttons on Right (△ ◯ ✕ ▢)
  c.fillStyle = '#10b981'; // Triangle
  c.fillRect(ctrlX + 34, ctrlY + 6, 2, 2);
  c.fillStyle = '#ef4444'; // Circle
  c.fillRect(ctrlX + 37, ctrlY + 8, 2, 2);
  c.fillStyle = '#3b82f6'; // Cross
  c.fillRect(ctrlX + 34, ctrlY + 11, 2, 2);
  c.fillStyle = '#f43f5e'; // Square
  c.fillRect(ctrlX + 31, ctrlY + 8, 2, 2);

  // Dual Analog Sticks
  c.fillStyle = '#1e293b';
  c.beginPath();
  c.arc(ctrlX + 16, ctrlY + 19, 4, 0, Math.PI * 2);
  c.arc(ctrlX + 28, ctrlY + 19, 4, 0, Math.PI * 2);
  c.fill();

  // --- NIDAN & JINAN SITTING HAPPILY BY THE CONSOLE ---
  drawStudentPixelChar(c, cx - 65, cy + 24, false, 'idle', t, null);
  drawGirlfriendPixelChar(c, cx + 130, cy + 24, true, 'idle', t, 'heart');

  // Cute Orange Loaf Cat sleeping peacefully on top of the PlayStation console!
  drawPixelCat(c, cx + 22, cy - 14, 'loaf', t);

  // Floating PS button symbols drifting up gently
  const syms = ['△', '◯', '✕', '▢'];
  const symCols = ['#10b981', '#ef4444', '#38bdf8', '#f472b6'];
  for (let s = 0; s < 4; s++) {
    const sy = cy - ((t * 0.5 + s * 22) % 65);
    const sx = cx + 30 + Math.sin(t * 0.08 + s * 1.5) * 45;
    c.fillStyle = symCols[s];
    c.font = '10px monospace';
    c.fillText(syms[s], sx, sy);
  }

  c.restore();
}

/**
 * OPENING SCREEN — LIVING PIXEL-ART GAME WORLD
 * Full-screen panoramic indie retro landscape matching the reference composition:
 * - Dynamic cerulean sky with drifting fluffy pixel clouds
 * - Radiant warm sun with pulsing aura & light beams
 * - Distant misty blue-green mountain range
 * - Calm sparkling pixel lake / ocean with wave reflections
 * - Lush leafy tree on the right with swaying branch tips & falling leaves
 * - Cute white bird/dove perched on the tree branch
 * - Wooden platform deck with rich oak grain, nail rivets, and soil cross-section
 * - Green bushes, wild grass tufts, and blooming wildflowers
 * - Nidan (Player One) & Jinan (Player Two) standing side-by-side on the deck
 *   with idle breathing, blinking, blushing, and floating emote bubbles (♥ and !)
 * - Cute orange calico meme cat sitting on the deck with animated tail and purr
 */
export function drawOpeningPixelWorld(c, cw, ch, t, state = {}) {
  try {
    c.save();

    // Helper for safe rounded rects without array exceptions
    function safeBox(ctx, x, y, w, h, r = 0) {
      if (r > 0 && typeof ctx.roundRect === 'function') {
        try {
          ctx.roundRect(x, y, w, h, typeof r === 'number' ? r : 4);
          return;
        } catch (e) {}
      }
      ctx.rect(x, y, w, h);
    }

    const isMobile = cw < 768 || ch > cw;

    // ---------------------------------------------------------
    // 1. SKY GRADIENT (Bright & Atmospheric)
    // ---------------------------------------------------------
    const skyGrad = c.createLinearGradient(0, 0, 0, ch * 0.65);
    skyGrad.addColorStop(0, '#38bdf8');   // vibrant sky blue
    skyGrad.addColorStop(0.45, '#7dd3fc'); // soft sky
    skyGrad.addColorStop(0.85, '#bae6fd'); // pale horizon mist
    skyGrad.addColorStop(1, '#e0f2fe');
    c.fillStyle = skyGrad;
    c.fillRect(0, 0, cw, ch * 0.65);

    // ---------------------------------------------------------
    // 2. RADIANT WARM SUN & LIGHT BEAMS
    // ---------------------------------------------------------
    const sunX = Math.round(isMobile ? cw * 0.82 : cw * 0.84);
    const sunY = Math.round(ch * 0.12);
    const sunPulse = Math.sin(t * 0.04) * 4;

    // Soft glowing outer sun aura
    const sunAura = c.createRadialGradient(sunX, sunY, 15, sunX, sunY, 115);
    sunAura.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
    sunAura.addColorStop(0.5, 'rgba(253, 224, 71, 0.22)');
    sunAura.addColorStop(1, 'rgba(253, 224, 71, 0)');
    c.fillStyle = sunAura;
    c.beginPath();
    c.arc(sunX, sunY, 115 + sunPulse, 0, Math.PI * 2);
    c.fill();

    // Golden sun core
    c.fillStyle = '#fef08a';
    c.beginPath();
    c.arc(sunX, sunY, 26, 0, Math.PI * 2);
    c.fill();

    // ---------------------------------------------------------
    // 3. DRIFTING FLUFFY PIXEL CLOUDS
    // ---------------------------------------------------------
    const cloudConfigs = [
      { startX: 40,  y: Math.round(ch * 0.08),  scale: 1.3, speed: 0.25 },
      { startX: 320, y: Math.round(ch * 0.15),  scale: 0.9, speed: 0.18 },
      { startX: 680, y: Math.round(ch * 0.07),  scale: 1.4, speed: 0.22 },
      { startX: 920, y: Math.round(ch * 0.17),  scale: 0.85, speed: 0.16 }
    ];

    cloudConfigs.forEach((cl) => {
      const loopSpan = cw + 300;
      const curX = ((cl.startX + t * cl.speed) % loopSpan + loopSpan) % loopSpan - 150;
      c.save();
      c.translate(Math.round(curX), cl.y);
      c.scale(cl.scale, cl.scale);

      // Cloud shadow underside
      c.fillStyle = '#94a3b8';
      c.fillRect(-22, 10, 48, 8);
      c.fillRect(-12, 14, 30, 4);

      // Cloud puffy body
      c.fillStyle = '#ffffff';
      c.fillRect(-20, 6, 44, 8);
      c.fillRect(-14, -2, 22, 12);
      c.fillRect(0, -6, 20, 14);
      c.fillRect(-26, 8, 12, 6);
      c.fillRect(16, 8, 14, 6);
      c.fillRect(-6, -8, 14, 6);

      c.restore();
    });

    // ---------------------------------------------------------
    // 4. DISTANT MOUNTAIN RANGE
    // ---------------------------------------------------------
    // Layer 1: Far misty mountain peaks (light cyan-blue)
    c.fillStyle = '#93c5fd';
    c.beginPath();
    c.moveTo(0, ch * 0.58);
    c.lineTo(cw * 0.10, ch * 0.45);
    c.lineTo(cw * 0.24, ch * 0.53);
    c.lineTo(cw * 0.38, ch * 0.42);
    c.lineTo(cw * 0.55, ch * 0.52);
    c.lineTo(cw * 0.72, ch * 0.44);
    c.lineTo(cw * 0.86, ch * 0.51);
    c.lineTo(cw, ch * 0.45);
    c.lineTo(cw, ch * 0.65);
    c.lineTo(0, ch * 0.65);
    c.closePath();
    c.fill();

    // Layer 2: Near mountain peaks (richer blue with green tint)
    c.fillStyle = '#60a5fa';
    c.beginPath();
    c.moveTo(0, ch * 0.60);
    c.lineTo(cw * 0.16, ch * 0.50);
    c.lineTo(cw * 0.32, ch * 0.57);
    c.lineTo(cw * 0.48, ch * 0.47);
    c.lineTo(cw * 0.66, ch * 0.56);
    c.lineTo(cw * 0.82, ch * 0.51);
    c.lineTo(cw, ch * 0.55);
    c.lineTo(cw, ch * 0.65);
    c.lineTo(0, ch * 0.65);
    c.closePath();
    c.fill();

    // ---------------------------------------------------------
    // 5. CALM GLISTENING LAKE / WATER HORIZON
    // ---------------------------------------------------------
    const lakeTop = Math.round(ch * 0.52);
    const lakeBottom = Math.round(ch * 0.66);
    const waterGrad = c.createLinearGradient(0, lakeTop, 0, lakeBottom);
    waterGrad.addColorStop(0, '#0284c7');
    waterGrad.addColorStop(0.5, '#0369a1');
    waterGrad.addColorStop(1, '#075985');
    c.fillStyle = waterGrad;
    c.fillRect(0, lakeTop, cw, lakeBottom - lakeTop);

    // Sparkling wave reflections
    for (let w = 0; w < 16; w++) {
      const wx = (w * 62 + Math.sin(t * 0.05 + w) * 24) % cw;
      const wy = lakeTop + 4 + ((w * 6) % (lakeBottom - lakeTop - 8));
      const ww = 18 + ((w * 9) % 24);
      c.fillStyle = w % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(186, 230, 253, 0.65)';
      c.fillRect(Math.round(wx), wy, ww, 2);
    }

    // ---------------------------------------------------------
    // 6. MIDGROUND GREEN ROLLING BANKS & SHRUBS
    // ---------------------------------------------------------
    c.fillStyle = '#15803d';
    c.beginPath();
    c.ellipse(cw * 0.22, ch * 0.66, Math.max(cw * 0.32, 120), 28, 0, 0, Math.PI * 2);
    c.ellipse(cw * 0.82, ch * 0.66, Math.max(cw * 0.30, 110), 32, 0, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#16a34a';
    c.beginPath();
    c.ellipse(cw * 0.12, ch * 0.70, Math.max(cw * 0.24, 100), 38, 0, 0, Math.PI * 2);
    c.ellipse(cw * 0.72, ch * 0.69, Math.max(cw * 0.32, 120), 42, 0, 0, Math.PI * 2);
    c.fill();

    // ---------------------------------------------------------
    // 7. DECK COORDINATES & CHARACTER SCALE
    // ---------------------------------------------------------
    const deckY = isMobile ? Math.round(ch - 110) : Math.round(ch - 120);
    const deckX = isMobile ? 0 : Math.round(cw * 0.33);
    const deckW = isMobile ? cw : (cw - deckX + 30);

    const charScale = isMobile ? 2.0 : 2.4;
    const charBaseY = deckY - Math.round(34 * charScale);

    const treeX = isMobile ? Math.round(cw * 0.14) : Math.round(cw * 0.58);
    const treeBaseY = deckY;

    const nidanX = isMobile ? Math.round(cw * 0.44) : Math.round(cw * 0.70);
    const jinanX = isMobile ? Math.round(cw * 0.64) : Math.round(cw * 0.80);

    // ---------------------------------------------------------
    // 8. LUSH PIXEL TREE (with perched white bird)
    // ---------------------------------------------------------
    // Tree Trunk & Branches (Warm Rich Wood Grain)
    c.fillStyle = '#451a03'; // dark bark outline
    c.fillRect(treeX - 10, treeBaseY - 140, 20, 142);
    c.fillRect(treeX - 30, treeBaseY - 120, 24, 10); // left branch
    c.fillRect(treeX + 6, treeBaseY - 105, 28, 9);  // right branch

    c.fillStyle = '#78350f'; // trunk body
    c.fillRect(treeX - 8, treeBaseY - 138, 16, 140);
    c.fillRect(treeX - 28, treeBaseY - 118, 20, 7);
    c.fillRect(treeX + 8, treeBaseY - 103, 24, 6);

    c.fillStyle = '#b45309'; // warm wood highlight
    c.fillRect(treeX - 5, treeBaseY - 135, 4, 130);

    // White Pixel Bird perched on left branch
    const birdX = treeX - 22;
    const birdY = treeBaseY - 126;
    const birdBob = Math.sin(t * 0.08) * 1;
    c.fillStyle = '#ffffff';
    c.fillRect(birdX, birdY + birdBob, 10, 7);
    c.fillRect(birdX + 2, birdY - 5 + birdBob, 6, 6); // head
    c.fillStyle = '#fbbf24'; // beak
    c.fillRect(birdX - 2, birdY - 3 + birdBob, 3, 2);
    c.fillStyle = '#1e1b4b'; // eye
    c.fillRect(birdX + 3, birdY - 4 + birdBob, 2, 2);
    c.fillStyle = '#cbd5e1'; // wing shading
    c.fillRect(birdX + 5, birdY + 2 + birdBob, 6, 4);

    // Sprawling Leafy Tree Canopy (Swaying gently in breeze)
    const leafSway = Math.sin(t * 0.05) * 3;
    const canopyLayers = [
      { x: treeX - 55, y: treeBaseY - 215, w: 110, h: 80, col: '#14532d' },
      { x: treeX - 45 + leafSway, y: treeBaseY - 225, w: 90, h: 75, col: '#16a34a' },
      { x: treeX - 35, y: treeBaseY - 235, w: 70, h: 65, col: '#22c55e' },
      { x: treeX - 20 - leafSway, y: treeBaseY - 240, w: 42, h: 45, col: '#4ade80' }
    ];

    canopyLayers.forEach(l => {
      c.fillStyle = l.col;
      c.beginPath();
      safeBox(c, l.x, l.y, l.w, l.h, 24);
      c.fill();
    });

    // Falling leaves drifting gracefully in the breeze
    for (let lf = 0; lf < 4; lf++) {
      const lfy = (treeBaseY - 180 + (t * 0.8 + lf * 55)) % 220;
      const lfx = treeX - 20 + Math.sin(t * 0.08 + lf * 2) * 45 - lf * 18;
      c.fillStyle = lf % 2 === 0 ? '#4ade80' : '#86efac';
      c.fillRect(Math.round(lfx), Math.round(treeBaseY - 180 + lfy), 4, 3);
    }

    // ---------------------------------------------------------
    // 9. THE WOODEN PLATFORM DECK & SOIL CROSS-SECTION
    // ---------------------------------------------------------
    // Solid Earth Soil Layer (underneath the deck)
    c.fillStyle = '#26120b'; // dark ground
    c.fillRect(deckX, deckY + 20, deckW, ch - deckY - 20);

    c.fillStyle = '#381d0f'; // mid earth
    c.fillRect(deckX, deckY + 24, deckW, ch - deckY - 24);

    // Embedded pebbles & stones in soil
    const pebbles = [
      { x: deckX + 45,  y: deckY + 45, w: 8, h: 5 },
      { x: deckX + 130, y: deckY + 70, w: 10, h: 6 },
      { x: deckX + 260, y: deckY + 50, w: 7, h: 4 },
      { x: deckX + 390, y: deckY + 75, w: 9, h: 6 },
      { x: deckX + 480, y: deckY + 42, w: 11, h: 5 }
    ];
    c.fillStyle = '#78716c';
    pebbles.forEach(p => c.fillRect(p.x, p.y, p.w, p.h));

    // Wooden Platform Planks (Warm Rich Golden Oak Grain)
    c.fillStyle = '#78350f'; // plank bottom shadow
    c.fillRect(deckX, deckY + 16, deckW, 6);

    c.fillStyle = '#d97706'; // main oak plank wood
    c.fillRect(deckX, deckY, deckW, 18);

    c.fillStyle = '#fef3c7'; // top plank edge highlight
    c.fillRect(deckX, deckY, deckW, 2);

    // Individual vertical wooden plank seams & iron nail rivets
    const plankW = 72;
    const numPlanks = Math.ceil(deckW / plankW);
    for (let p = 0; p < numPlanks; p++) {
      const px = deckX + p * plankW;
      c.fillStyle = '#451a03';
      c.fillRect(px, deckY, 2, 20);
      c.fillStyle = '#292524';
      c.fillRect(px + 8, deckY + 5, 2, 2);
      c.fillRect(px + 8, deckY + 13, 2, 2);
      c.fillRect(px + plankW - 8, deckY + 5, 2, 2);
      c.fillRect(px + plankW - 8, deckY + 13, 2, 2);
    }

    // ---------------------------------------------------------
    // 10. NATURAL GRASSY RIVERBANK TO THE LEFT OF DECK (Desktop)
    // ---------------------------------------------------------
    if (!isMobile && deckX > 0) {
      c.fillStyle = '#14532d';
      c.fillRect(0, deckY + 8, deckX + 10, ch - deckY - 8);

      c.fillStyle = '#16a34a';
      c.beginPath();
      safeBox(c, 0, deckY - 12, deckX + 16, 26, 12);
      c.fill();

      // Tufts of wild grass along the left edge
      c.fillStyle = '#22c55e';
      for (let g = 0; g < 14; g++) {
        const gx = g * 24 + 10;
        if (gx < deckX) {
          c.fillRect(gx, deckY - 18, 2, 8);
          c.fillRect(gx + 3, deckY - 22, 2, 12);
          c.fillRect(gx + 6, deckY - 16, 2, 6);
        }
      }

      // Blooming Wildflowers
      drawPixelFlower(c, 40, deckY - 14, 'tulip', t, 1.2);
      drawPixelFlower(c, 90, deckY - 18, 'daisy', t, 1.3);
      drawPixelFlower(c, 160, deckY - 12, 'heart', t, 1.2);
      drawPixelFlower(c, 230, deckY - 16, 'wildflower', t, 1.1);
      drawPixelFlower(c, 290, deckY - 14, 'daisy', t, 1.2);
    }

    // ---------------------------------------------------------
    // 11. CHARACTERS ON THE WOODEN DECK (Nidan & Jinan)
    // ---------------------------------------------------------
    const interactionPulse = state.charactersClicked ? Math.sin(t * 0.2) * 4 : 0;

    // Draw Nidan (Player One, Boy — facing right towards Jinan)
    c.save();
    c.translate(nidanX, charBaseY - interactionPulse);
    c.scale(charScale, charScale);
    drawStudentPixelChar(c, 0, 0, false, 'idle', t, null);
    c.restore();

    // Draw Jinan (Player Two, Girl — facing left towards Nidan)
    c.save();
    c.translate(jinanX, charBaseY - interactionPulse);
    c.scale(charScale, charScale);
    drawGirlfriendPixelChar(c, 0, 0, true, 'idle', t, null);
    c.restore();

    // Floating Emote Bubble above Nidan (Beating Red Heart ♥)
    const heartPulse = Math.sin(t * 0.12) * 1.5;
    const bubble1X = nidanX + Math.round(18 * (charScale / 2.3));
    const bubble1Y = charBaseY - 26;

    c.fillStyle = 'rgba(7, 21, 43, 0.25)'; // shadow
    c.beginPath();
    safeBox(c, bubble1X - 11, bubble1Y - 11, 26, 22, 6);
    c.fill();

    c.fillStyle = '#ffffff'; // body
    c.beginPath();
    safeBox(c, bubble1X - 12, bubble1Y - 12, 26, 22, 6);
    c.fill();
    c.strokeStyle = '#f472b6';
    c.lineWidth = 1.6;
    c.stroke();

    // Pointer tail pointing to Nidan's head
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(bubble1X - 2, bubble1Y + 10);
    c.lineTo(bubble1X + 3, bubble1Y + 16);
    c.lineTo(bubble1X + 6, bubble1Y + 10);
    c.closePath();
    c.fill();
    c.strokeStyle = '#f472b6';
    c.stroke();

    // Beating Red Heart inside
    c.fillStyle = '#ef4444';
    c.font = `${Math.round(13 + heartPulse)}px sans-serif`;
    c.textAlign = 'center';
    c.fillText('♥', bubble1X + 1, bubble1Y + 4);

    // Floating Emote Bubble above Jinan (Blushing Exclamation !)
    const bubble2X = jinanX + Math.round(38 * (charScale / 2.3));
    const bubble2Y = charBaseY - 26;

    c.fillStyle = 'rgba(7, 21, 43, 0.25)';
    c.beginPath();
    safeBox(c, bubble2X - 11, bubble2Y - 11, 24, 22, 6);
    c.fill();

    c.fillStyle = '#ffffff';
    c.beginPath();
    safeBox(c, bubble2X - 12, bubble2Y - 12, 24, 22, 6);
    c.fill();
    c.strokeStyle = '#fbbf24';
    c.lineWidth = 1.6;
    c.stroke();

    // Pointer tail pointing to Jinan's head
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(bubble2X - 2, bubble2Y + 10);
    c.lineTo(bubble2X - 4, bubble2Y + 16);
    c.lineTo(bubble2X + 4, bubble2Y + 10);
    c.closePath();
    c.fill();
    c.strokeStyle = '#fbbf24';
    c.stroke();

    c.fillStyle = '#d97706';
    c.font = 'bold 11px monospace';
    c.textAlign = 'center';
    c.fillText('!', bubble2X, bubble2Y + 3);

    // ---------------------------------------------------------
    // 12. MASCOT PIXEL CAT ON THE WOODEN DECK PLATFORM
    // ---------------------------------------------------------
    const catX = isMobile ? Math.round(cw * 0.28) : (nidanX - 58);
    const catY = deckY - 24;
    const catBounce = state.catClicked ? Math.abs(Math.sin(t * 0.3)) * -6 : 0;

    drawPixelCat(c, catX, catY + catBounce, 'loaf', t, 1.15);

    // Purring little heart above cat
    const catHeartY = catY - 16 - ((t * 0.4) % 18);
    const catHeartAlpha = 1 - (((t * 0.4) % 18) / 18);
    c.fillStyle = `rgba(244, 114, 182, ${catHeartAlpha})`;
    c.font = '9px sans-serif';
    c.textAlign = 'center';
    c.fillText('♡', catX + 16, catHeartY);

    c.restore();
  } catch (err) {
    console.error('Opening world render error:', err);
    try { c.restore(); } catch (e) {}
  }
}

/**
 * States: 'idle', 'happy', 'shocked'
 */
export function drawPassengerCat(c, x, y, state = 'idle', t = 0) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  const earWind = Math.sin(t * 0.3) * 1.5;

  // Cat Head (Cream Calico)
  c.fillStyle = '#fed7aa';
  c.fillRect(-6, -7, 12, 10);

  // Calico Orange Patch on Left Ear
  c.fillStyle = '#f97316';
  c.fillRect(-6, -7, 4, 5);

  // Ears (Twitching in the coastal breeze)
  c.fillStyle = '#f97316';
  c.beginPath();
  c.moveTo(-6, -7);
  c.lineTo(-8 + earWind, -12);
  c.lineTo(-3, -7);
  c.closePath();
  c.fill();

  c.fillStyle = '#fed7aa';
  c.beginPath();
  c.moveTo(3, -7);
  c.lineTo(6 - earWind, -12);
  c.lineTo(6, -7);
  c.closePath();
  c.fill();

  // Pink Inner Ears
  c.fillStyle = '#f472b6';
  c.fillRect(-5, -9, 2, 2);
  c.fillRect(4, -9, 2, 2);

  if (state === 'shocked') {
    // Shocked Popcat Eyes & Open O mouth when car hits a bump!
    c.fillStyle = '#0f172a';
    c.beginPath();
    c.arc(-3, -3, 2, 0, Math.PI * 2);
    c.arc(3, -3, 2, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#be123c';
    c.beginPath();
    c.arc(0, 1, 2.5, 0, Math.PI * 2);
    c.fill();

    // Sweatdrop
    c.fillStyle = '#38bdf8';
    c.font = '8px monospace';
    c.fillText('💦', 6, -8);
  } else if (state === 'happy') {
    // Happy Purring Squinting Eyes ^^
    c.fillStyle = '#1e293b';
    c.font = 'bold 5px "Press Start 2P"';
    c.fillText('^^', -4, -2);

    // Cute pink nose
    c.fillStyle = '#f472b6';
    c.fillRect(-1, 0, 2, 1);

    // Floating heart
    c.fillStyle = '#f472b6';
    c.font = '8px sans-serif';
    c.fillText('💖', 4, -9 + Math.sin(t * 0.2) * 2);
  } else {
    // Normal / Cruising: Calm peaceful eyes with catchlight
    c.fillStyle = '#0f172a';
    c.fillRect(-4, -4, 2, 2);
    c.fillRect(2, -4, 2, 2);
    c.fillStyle = '#ffffff';
    c.fillRect(-4, -4, 1, 1);
    c.fillRect(2, -4, 1, 1);

    // Cute nose
    c.fillStyle = '#f472b6';
    c.fillRect(-1, -1, 2, 1);

    // Whiskers
    c.strokeStyle = '#94a3b8';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(-6, -1); c.lineTo(-9, -2);
    c.moveTo(-6, 0);  c.lineTo(-9, 1);
    c.moveTo(6, -1);  c.lineTo(9, -2);
    c.moveTo(6, 0);   c.lineTo(9, 1);
    c.stroke();
  }

  // Paws resting over the car window ledge
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(-4, 3, 2, 0, Math.PI * 2);
  c.arc(4, 3, 2, 0, Math.PI * 2);
  c.fill();
  c.strokeStyle = '#fed7aa';
  c.lineWidth = 0.6;
  c.stroke();

  c.restore();
}

/**
 * Draw Interactive Campsite Cat (Room 4)
 * States: 'loaf', 'awake', 'happy', 'purr'
 */
export function drawCampsiteCat(c, x, y, state = 'loaf', t = 0) {
  c.save();
  c.translate(Math.round(x), Math.round(y));

  const breath = Math.sin(t * 0.08) * 1;

  if (state === 'awake' || state === 'happy') {
    // Calico cat sitting upright, looking at Nidan with tail swishing
    const tailSwish = Math.sin(t * 0.25) * 4;

    // Body
    c.fillStyle = '#fed7aa';
    c.fillRect(-7, -10 + breath, 14, 12);
    // Orange & Gray Calico Patches
    c.fillStyle = '#ea580c';
    c.fillRect(-7, -8 + breath, 5, 6);
    c.fillStyle = '#475569';
    c.fillRect(2, -10 + breath, 4, 5);

    // Head
    c.fillStyle = '#fed7aa';
    c.fillRect(-6, -18 + breath, 12, 9);
    // Ears
    c.fillStyle = '#ea580c';
    c.fillRect(-6, -21 + breath, 3, 3);
    c.fillStyle = '#475569';
    c.fillRect(3, -21 + breath, 3, 3);

    // Big shiny green eyes
    c.fillStyle = '#22c55e';
    c.fillRect(-4, -15 + breath, 2.5, 2.5);
    c.fillRect(1.5, -15 + breath, 2.5, 2.5);
    c.fillStyle = '#ffffff';
    c.fillRect(-4, -15 + breath, 1, 1);
    c.fillRect(1.5, -15 + breath, 1, 1);

    // Tail
    c.strokeStyle = '#ea580c';
    c.lineWidth = 2.5;
    c.beginPath();
    c.moveTo(6, -2 + breath);
    c.quadraticCurveTo(12, -8 + tailSwish, 9, -14 + tailSwish);
    c.stroke();

    // Paws
    c.fillStyle = '#ffffff';
    c.fillRect(-5, 0 + breath, 3, 3);
    c.fillRect(2, 0 + breath, 3, 3);

    if (state === 'happy') {
      c.fillStyle = '#f472b6';
      c.font = '10px sans-serif';
      c.fillText('🐾', 8, -16 + Math.sin(t * 0.2) * 3);
    }
  } else {
    // Cozy Loaf Sleeping beside campfire
    c.fillStyle = '#fed7aa';
    c.beginPath();
    c.roundRect(-10, -8 + breath * 0.5, 20, 10, 4);
    c.fill();

    // Calico Patches
    c.fillStyle = '#ea580c';
    c.fillRect(-8, -8 + breath * 0.5, 6, 6);
    c.fillStyle = '#475569';
    c.fillRect(2, -7 + breath * 0.5, 5, 5);

    // Tucked Head
    c.fillStyle = '#fed7aa';
    c.fillRect(-11, -7 + breath * 0.5, 7, 7);
    c.fillStyle = '#ea580c';
    c.fillRect(-11, -9 + breath * 0.5, 2.5, 2.5);
    c.fillRect(-6, -9 + breath * 0.5, 2.5, 2.5);

    // Sleeping closed eyes - -
    c.fillStyle = '#64748b';
    c.fillRect(-10, -4 + breath * 0.5, 2, 1);
    c.fillRect(-7, -4 + breath * 0.5, 2, 1);

    // Floating Zzz
    c.fillStyle = '#7dd3fc';
    c.font = '7px "Press Start 2P", monospace';
    c.fillText('z', 6, -11 + Math.sin(t * 0.08) * 2);
  }

  c.restore();
}

/**
 * Universal Canvas Text Wrapping Helper
 * Splits a long string into an array of lines that fit within maxWidth.
 */
export function wrapCanvasText(ctx, text, maxWidth) {
  if (!text) return [];
  const paragraphs = String(text).split(/\r?\n/);
  const lines = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;

      // Break word if it exceeds maxWidth by itself
      if (ctx.measureText(word).width > maxWidth) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        let chunk = '';
        for (let c = 0; c < word.length; c++) {
          const char = word[c];
          if (ctx.measureText(chunk + char).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = char;
          } else {
            chunk += char;
          }
        }
        currentLine = chunk;
        continue;
      }

      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

/**
 * Adaptive Speech Bubble Generator
 * Creates an elegant, perfectly fitted speech bubble with text wrapping,
 * dynamic height expansion, and aligned pointer.
 */
export function drawAdaptiveSpeechBubble(ctx, {
  x, y,
  width,
  title = '',
  titleColor = '#be185d',
  text = '',
  textColor = '#1e293b',
  font = '11px "Plus Jakarta Sans", -apple-system, sans-serif',
  lineHeight = 16,
  pointerX = null,
  pointerDir = 'down',
  bg = 'rgba(255, 255, 255, 0.96)',
  border = '#f472b6',
  radius = 10,
  padding = 12
}) {
  if (!font || font.includes('var')) {
    font = '11px "Plus Jakarta Sans", -apple-system, sans-serif';
  }
  ctx.save();
  ctx.font = font;

  const maxTextWidth = width - padding * 2;
  const lines = wrapCanvasText(ctx, text, maxTextWidth);
  const titleHeight = title ? 18 : 0;
  const contentHeight = Math.max(1, lines.length) * lineHeight;
  const totalHeight = padding * 2 + titleHeight + contentHeight;

  // Drop shadow
  ctx.fillStyle = 'rgba(7, 21, 43, 0.22)';
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 4, width, totalHeight, radius);
  ctx.fill();

  // Bubble body
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y, width, totalHeight, radius);
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // Pointer
  if (pointerX !== null) {
    const pX = Math.max(x + radius + 4, Math.min(x + width - radius - 4, pointerX));
    ctx.fillStyle = bg;
    ctx.beginPath();
    if (pointerDir === 'down') {
      const pY = y + totalHeight;
      ctx.moveTo(pX - 7, pY);
      ctx.lineTo(pX, pY + 10);
      ctx.lineTo(pX + 7, pY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.beginPath();
      ctx.moveTo(pX - 7, pY);
      ctx.lineTo(pX, pY + 10);
      ctx.lineTo(pX + 7, pY);
      ctx.stroke();
    } else {
      ctx.moveTo(pX - 7, y);
      ctx.lineTo(pX, y - 10);
      ctx.lineTo(pX + 7, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.beginPath();
      ctx.moveTo(pX - 7, y);
      ctx.lineTo(pX, y - 10);
      ctx.lineTo(pX + 7, y);
      ctx.stroke();
    }
  }

  // Draw Title
  let curY = y + padding + 4;
  if (title) {
    ctx.font = 'bold 6.5px "Press Start 2P", monospace';
    ctx.fillStyle = titleColor;
    ctx.textAlign = 'left';
    ctx.fillText(title, x + padding, curY);
    curY += 16;
  }

  // Draw wrapped text lines
  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  lines.forEach((line) => {
    ctx.fillText(line, x + padding, curY);
    curY += lineHeight;
  });

  ctx.restore();
  return { totalHeight, linesCount: lines.length };
}

/**
 * Draw Floating Cat Emote / Reaction Bubble with Auto Text-Wrapping & Boundary Clamping
 */
export function drawFloatingCatEmote(c, x, y, text, t = 0, alpha = 1) {
  if (alpha <= 0.01) return;
  c.save();
  c.globalAlpha = Math.max(0, Math.min(1, alpha));

  c.font = 'bold 6.5px "Press Start 2P", monospace';
  const maxW = 150;
  const lines = wrapCanvasText(c, text, maxW);
  const textW = Math.min(maxW, Math.max(...lines.map(l => c.measureText(l).width)));
  const width = Math.max(60, textW + 18);
  const lineHeight = 11;
  const height = 12 + lines.length * lineHeight;

  // Clamp x and y inside 800x450 canvas
  const clampX = Math.max(width / 2 + 6, Math.min(800 - width / 2 - 6, x));
  const clampY = Math.max(height + 8, Math.min(440, y));

  c.translate(Math.round(clampX), Math.round(clampY));

  // Bubble Shadow
  c.fillStyle = 'rgba(7, 21, 43, 0.35)';
  c.beginPath();
  c.roundRect(-width / 2 + 2, -height + 2, width, height, 6);
  c.fill();

  // Bubble Body
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.roundRect(-width / 2, -height, width, height, 6);
  c.fill();
  c.strokeStyle = '#f472b6';
  c.lineWidth = 1.5;
  c.stroke();

  // Pointer Tail
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.moveTo(-3, 0);
  c.lineTo(0, 4);
  c.lineTo(3, 0);
  c.closePath();
  c.fill();
  c.strokeStyle = '#f472b6';
  c.beginPath();
  c.moveTo(-3, 0);
  c.lineTo(0, 4);
  c.lineTo(3, 0);
  c.stroke();

  // Text Lines
  c.fillStyle = '#be185d';
  c.textAlign = 'center';
  lines.forEach((line, idx) => {
    c.fillText(line, 0, -height + 11 + idx * lineHeight);
  });

  c.restore();
}
