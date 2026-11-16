/* ===================================================
   COLLECTIBLES & INTERACTIVE ITEMS SYSTEM
   Exquisite Pixel Art & Themed Atmospheric Renderers
   Player Two, Forever 💜
=================================================== */

/**
 * Draw animated collectible items with distinct pixel art design
 */
export function drawCollectible(ctx, item, cameraX, isCollected, t, idx = 0) {
  const rx = item.x - cameraX;
  if (rx < -40 || rx > 840) return; // Off-screen culling

  const bob = Math.sin(t * 0.06 + idx * 1.5) * 3.5;

  if (isCollected) {
    // Subtle faint silhouette indicating already retrieved
    ctx.fillStyle = 'rgba(192, 132, 252, 0.15)';
    ctx.fillRect(rx - 5, item.y - 5, 10, 10);
    return;
  }

  ctx.save();
  ctx.translate(Math.round(rx), Math.round(item.y + bob));

  if (item.type === 'fragment') {
    // Vintage Parchment Journal Fragment with Wax Seal
    // Soft ambient aura
    ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.fill();

    // Parchment paper
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-7, -9, 14, 18);
    // Torn edge detail
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-7, 7, 3, 2);
    ctx.fillRect(4, 7, 3, 2);

    // Written ink lines
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-5, -6, 10, 1.5);
    ctx.fillRect(-5, -2, 8, 1.5);
    ctx.fillRect(-5, 2, 9, 1.5);

    // Crimson wax seal in corner
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(4, 3, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (item.type === 'symbolic') {
    // Symbolic LDR Artifacts
    ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Dark showcase casing
    ctx.fillStyle = '#240f3f';
    ctx.fillRect(-9, -9, 18, 18);
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-9, -9, 18, 18);

    // Icon
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.icon || '☕', 0, 0);

  } else if (item.type === 'beacon') {
    // Starlight Beacon / Brass Astral Lantern
    // Glow aura
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // Brass top cap & ring
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-3, -10, 6, 2);
    ctx.fillRect(-5, -8, 10, 3);
    // Glass cylinder
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-4, -5, 8, 11);
    // Inner luminous stardust
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -3, 4, 7);
    // Brass bottom base
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-6, 6, 12, 3);

  } else if (item.type === 'goldenKey') {
    // Golden Heart Portal Key
    ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // Heart bow
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-3, -5, 4, 0, Math.PI * 2);
    ctx.arc(3, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(0, 1);
    ctx.lineTo(6, -4);
    ctx.closePath();
    ctx.fill();

    // Inner hollow
    ctx.fillStyle = '#170c2e';
    ctx.beginPath();
    ctx.arc(0, -4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Stem and teeth
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-1.5, 1, 3, 12);
    ctx.fillRect(1.5, 6, 3, 2.5);
    ctx.fillRect(1.5, 10, 4, 2.5);

  } else if (item.type === 'polaroid' || item.type === 'galleryPhoto') {
    // Mini Polaroid Memory Tile
    ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fill();

    // White paper frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-8, -10, 16, 20);
    // Photo window
    ctx.fillStyle = '#3b1763';
    ctx.fillRect(-6, -8, 12, 11);
    // Soft heart inside photo
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(-2, -3, 4, 3);

  } else if (item.type === 'mysteryGift') {
    // Royal Birthday Gift Box
    ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Box body
    ctx.fillStyle = '#db2777';
    ctx.fillRect(-9, -6, 18, 16);
    // Gold ribbon band
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-9, 0, 18, 4);
    ctx.fillRect(-2, -6, 4, 16);
    // Gold ribbon bow
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-5, -9, 10, 3);
  }

  ctx.restore();
}

/**
 * Draw collectible stars with subtle pixel diamond sparkle
 */
export function drawStarItem(ctx, star, cameraX, isCollected, t, idx = 0) {
  if (isCollected) return;

  const rx = star.x - cameraX;
  if (rx < -30 || rx > 830) return;

  const bob = Math.sin(t * 0.08 + idx * 2) * 3.5;
  ctx.save();
  ctx.translate(Math.round(rx), Math.round(star.y + bob));

  // Soft glow
  ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  // Five-pointed star
  ctx.fillStyle = '#fbbf24';
  ctx.font = '15px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 0, 0);

  // Sparkle gleam point
  const sparkle = Math.sin(t * 0.15 + idx) > 0.6;
  if (sparkle) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1, -1, 2, 2);
  }

  ctx.restore();
}
