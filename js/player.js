/* ===================================================
   PLAYER ENTITY & CHARACTER CONTROLLER MODULE
   Player One (Male Student with Laptop - Main Controlled)
   Player Two (Female Partner - Active Narrative & Welcome Partner)
   Player Two, Forever 💜
=================================================== */

import {
  drawStudentPixelChar,
  drawGirlfriendPixelChar,
  drawCoupleHug,
  drawCoupleCling,
  drawCoupleHoldingHandsWalk,
  drawCoupleSitting,
  drawRacerVehicle
} from './characters.js';
import { SoundEngine } from './sound.js';

export const PW = 24;
export const PH = 36;
const GRAVITY  = 0.54;
const JUMP_VEL = -12.4;
const MOVE_SPD = 4.4;
const MAX_FALL = 14;

export const playerState = {
  activeChar: 'boy', // Boy is the primary player-controlled character
  distanceKm: 1500,
  cutsceneMode: 'none', // 'none', 'hugging', 'cling', 'walkingHandInHand', 'sitting'
  isRacing: false,
  canSwitch: false,
  merged: false,

  boy: {
    x: 50, y: 370,
    vx: 0, vy: 0,
    facingLeft: false,
    onGround: false,
    animMode: 'idle',
    emote: null,
    emoteTimer: 0,
    coyoteTimer: 0
  },

  girl: {
    x: 1120, y: 384,
    vx: 0, vy: 0,
    facingLeft: true,
    onGround: true,
    animMode: 'idle',
    emote: null,
    emoteTimer: 0
  }
};

let jumpKeyLocked = false;

export function getBoy() {
  return playerState.boy;
}

export function getGirl() {
  return playerState.girl;
}

export function getActivePlayer() {
  return playerState.activeChar === 'girl' ? playerState.girl : playerState.boy;
}

export function switchActiveCharacter() {
  if (!playerState.canSwitch) return;
  playerState.activeChar = playerState.activeChar === 'boy' ? 'girl' : 'boy';
  const boyBadge = document.getElementById('char-badge-boy');
  const girlBadge = document.getElementById('char-badge-girl');
  if (boyBadge && girlBadge) {
    if (playerState.activeChar === 'boy') {
      boyBadge.classList.add('active');
      boyBadge.classList.remove('inactive');
      girlBadge.classList.remove('active');
      girlBadge.classList.add('inactive');
    } else {
      girlBadge.classList.add('active');
      girlBadge.classList.remove('inactive');
      boyBadge.classList.remove('active');
      boyBadge.classList.add('inactive');
    }
  }
}

export function setCanSwitch(val) {
  playerState.canSwitch = !!val;
  const btn = document.getElementById('btn-char-switch');
  const tcBtn = document.getElementById('tc-char-switch');
  if (btn) btn.style.display = val ? 'inline-flex' : 'none';
  if (tcBtn) tcBtn.style.display = val ? 'flex' : 'none';
}

export function setDistanceKm(km) {
  playerState.distanceKm = km;
  const distEl = document.getElementById('hud-dist-val');
  if (distEl) {
    distEl.textContent = km === 0 ? '0 KM — BERSAMA! 💜' : `${km} KM`;
  }
}

export function setPlayerEmote(charName, emoteType, durationFrames = 90) {
  const char = charName === 'boy' ? playerState.boy : playerState.girl;
  char.emote = emoteType;
  char.emoteTimer = durationFrames;
}

export function setCutsceneMode(mode) {
  playerState.cutsceneMode = mode;
}

/**
 * Update player physics & collision against room platforms
 */
export function updatePlayerPhysics(keys, touchControls, platforms, springs, worldWidth, gameHeight, spawnDust, t) {
  const boy = playerState.boy;
  const girl = playerState.girl;

  // Decrement emote timers
  if (boy.emoteTimer > 0) {
    boy.emoteTimer--;
    if (boy.emoteTimer <= 0) boy.emote = null;
  }
  if (girl.emoteTimer > 0) {
    girl.emoteTimer--;
    if (girl.emoteTimer <= 0) girl.emote = null;
  }

  // Freeze physics during cutscenes
  if (playerState.cutsceneMode !== 'none') {
    return;
  }

  // Controls for Player One (Boy with Laptop)
  const leftKey  = keys['ArrowLeft']  || keys['KeyA'] || touchControls.left;
  const rightKey = keys['ArrowRight'] || keys['KeyD'] || touchControls.right;
  const jumpInput = keys['Space'] || keys['ArrowUp'] || keys['KeyW'] || touchControls.jump;

  const doJump = jumpInput && !jumpKeyLocked;
  jumpKeyLocked = !!jumpInput;

  // Horizontal motion
  if (leftKey) {
    boy.vx = -MOVE_SPD;
    boy.facingLeft = true;
  } else if (rightKey) {
    boy.vx = MOVE_SPD;
    boy.facingLeft = false;
  } else {
    boy.vx *= 0.72;
    if (Math.abs(boy.vx) < 0.1) boy.vx = 0;
  }

  // Jump with coyote time
  if (doJump && (boy.onGround || boy.coyoteTimer > 0)) {
    boy.vy = JUMP_VEL;
    boy.onGround = false;
    boy.coyoteTimer = 0;
    SoundEngine.jump();
    if (spawnDust) spawnDust(boy.x + 12, boy.y, 5);
  }

  // Gravity
  boy.vy += GRAVITY;
  if (boy.vy > MAX_FALL) boy.vy = MAX_FALL;

  // X Move & Boundaries
  boy.x += boy.vx;
  if (boy.x < 0) boy.x = 0;
  if (boy.x + PW > worldWidth) boy.x = worldWidth - PW;

  // Y Move & Platform Collisions
  const prevY = boy.y;
  boy.y += boy.vy;
  const wasOnGround = boy.onGround;
  boy.onGround = false;

  for (let i = 0; i < platforms.length; i++) {
    const p = platforms[i];
    if (rectsOverlap(boy.x, boy.y, PW, PH, p.x, p.y, p.w, p.h)) {
      if (boy.vy >= 0 && prevY + PH <= p.y + 8) {
        boy.y = p.y - PH;
        boy.vy = 0;
        boy.onGround = true;
        if (!wasOnGround && spawnDust) {
          spawnDust(boy.x + 12, boy.y, 4);
        }
      } else if (boy.vy < 0 && prevY >= p.y + p.h - 6) {
        boy.y = p.y + p.h;
        boy.vy = 0;
      } else {
        if (boy.vx > 0) boy.x = p.x - PW;
        else if (boy.vx < 0) boy.x = p.x + p.w;
        boy.vx = 0;
      }
    }
  }

  // Springs
  if (springs) {
    for (let s = 0; s < springs.length; s++) {
      const sp = springs[s];
      if (rectsOverlap(boy.x, boy.y, PW, PH, sp.x, sp.y, sp.w, sp.h)) {
        if (boy.vy > 0) {
          boy.vy = -16.5;
          SoundEngine.spring();
          if (spawnDust) spawnDust(boy.x + 12, boy.y, 8);
        }
      }
    }
  }

  if (boy.onGround) {
    boy.coyoteTimer = 6;
  } else if (boy.coyoteTimer > 0) {
    boy.coyoteTimer--;
  }

  // Animation mode
  if (!boy.onGround) boy.animMode = 'jump';
  else if (Math.abs(boy.vx) > 0.5) boy.animMode = 'walk';
  else boy.animMode = 'idle';

  // Fall off-screen safety
  if (boy.y > gameHeight + 60) {
    boy.x = 60;
    boy.y = 360;
    boy.vx = 0;
    boy.vy = 0;
  }

  // Proximity check with girl
  const distToGirl = Math.abs(boy.x - girl.x);
  if (distToGirl < 100) {
    // Girl looks towards boy and waves
    girl.facingLeft = (boy.x < girl.x);
    if (distToGirl < 50 && girl.animMode !== 'wave') {
      girl.animMode = 'wave';
      if (!girl.emote) setPlayerEmote('girl', 'heart', 60);
    }
  } else {
    if (girl.animMode === 'wave') girl.animMode = 'idle';
  }
}

export function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function setIsRacing(val) {
  playerState.isRacing = !!val;
}

/**
 * Render both characters smoothly without glitches or disappearing
 */
export function renderPlayers(ctx, cameraX, t) {
  const boy = playerState.boy;
  const girl = playerState.girl;

  if (playerState.cutsceneMode === 'hugging') {
    // Emotional embrace in secret area
    drawCoupleHug(ctx, (boy.x + girl.x) / 2 - cameraX - 10, Math.min(boy.y, girl.y), t);
    return;
  } else if (playerState.cutsceneMode === 'cling') {
    // Boy clinging affectionately to girl
    drawCoupleCling(ctx, (boy.x + girl.x) / 2 - cameraX - 10, Math.min(boy.y, girl.y), t);
    return;
  } else if (playerState.cutsceneMode === 'walkingHandInHand') {
    // Walking hand-in-hand
    drawCoupleHoldingHandsWalk(ctx, boy.x - cameraX, boy.y, t);
    return;
  } else if (playerState.cutsceneMode === 'sitting') {
    // Sitting together peacefully under shaded tree / by campfire
    drawCoupleSitting(ctx, (boy.x + girl.x) / 2 - cameraX - 10, Math.min(boy.y, girl.y), t);
    return;
  }

  // 1. Draw Girl Character (Always visible at her area, correctly layered)
  drawGirlfriendPixelChar(
    ctx,
    girl.x - cameraX,
    girl.y,
    girl.facingLeft,
    girl.animMode,
    t,
    girl.emote
  );

  // 2. Draw Boy Character (Player One — On foot or on water jet-ski in racing mode)
  if (playerState.isRacing) {
    drawRacerVehicle(
      ctx,
      boy.x - cameraX,
      boy.y,
      boy.facingLeft,
      t
    );
  } else {
    drawStudentPixelChar(
      ctx,
      boy.x - cameraX,
      boy.y,
      boy.facingLeft,
      boy.animMode,
      t,
      boy.emote
    );
  }
}
