/* ===================================================
   ROOM MANAGER MODULE
   Orchestrates Rooms, Checkpoints & Transitions
   Player Two, Forever 💜
=================================================== */

import { ROOM_1_CONFIG } from './room-1.js';
import { ROOM_2_CONFIG } from './room-2.js';
import { ROOM_3_CONFIG } from './room-3.js';
import { ROOM_4_CONFIG } from './room-4.js';
import { playerState, setCanSwitch, setDistanceKm, setIsRacing } from './player.js';
import { resetPuzzles } from './puzzle-system.js';

export const ALL_ROOMS = [
  ROOM_1_CONFIG,
  ROOM_2_CONFIG,
  ROOM_3_CONFIG,
  ROOM_4_CONFIG
];

export let currentRoomIdx = 0;

export function getCurrentRoom() {
  return ALL_ROOMS[currentRoomIdx];
}

export function loadRoom(idx, onRoomLoaded) {
  if (idx < 0 || idx >= ALL_ROOMS.length) return;
  currentRoomIdx = idx;
  const room = ALL_ROOMS[idx];

  // 1. Position Characters
  playerState.activeChar = 'boy';
  playerState.merged = false;

  if (room.boySpawn) {
    playerState.boy.x = room.boySpawn.x;
    playerState.boy.y = room.boySpawn.y;
  } else {
    playerState.boy.x = room.spawnX;
    playerState.boy.y = room.spawnY;
  }
  playerState.boy.vx = 0;
  playerState.boy.vy = 0;
  playerState.boy.onGround = false;
  playerState.boy.animMode = 'idle';

  playerState.cutsceneMode = 'none';

  if (room.girlPost) {
    playerState.girl.x = room.girlPost.x;
    playerState.girl.y = room.girlPost.y;
    playerState.girl.facingLeft = room.girlPost.facingLeft !== undefined ? room.girlPost.facingLeft : true;
  } else if (room.girlSpawn) {
    playerState.girl.x = room.girlSpawn.x;
    playerState.girl.y = room.girlSpawn.y;
  } else {
    playerState.girl.x = room.spawnX + 40;
    playerState.girl.y = room.spawnY;
  }
  playerState.girl.vx = 0;
  playerState.girl.vy = 0;
  playerState.girl.onGround = false;
  playerState.girl.animMode = 'idle';

  // 2. Set Capabilities & LDR Distance
  setCanSwitch(room.canSwitch);
  setDistanceKm(room.distanceKm);
  setIsRacing(room.mode === 'racing');

  // 3. Reset room puzzle mechanisms
  resetPuzzles(idx);

  // 4. Show Cinematic Transition
  showRoomTransition(room.badge, room.name, room.subtitle);

  if (onRoomLoaded) onRoomLoaded(room);
}

export function loadNextRoom(onRoomLoaded) {
  if (currentRoomIdx + 1 < ALL_ROOMS.length) {
    loadRoom(currentRoomIdx + 1, onRoomLoaded);
    return true;
  }
  return false;
}

export function showRoomTransition(badge, title, subtitle) {
  const overlay = document.getElementById('room-transition');
  const bEl = document.getElementById('trans-badge');
  const tEl = document.getElementById('trans-title');
  const sEl = document.getElementById('trans-sub');

  if (bEl) bEl.textContent = badge;
  if (tEl) tEl.textContent = title;
  if (sEl) sEl.textContent = subtitle;

  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 1800);
  }
}

