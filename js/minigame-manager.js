/* ===================================================
   MINI-GAME MANAGER — PLAYER TWO, FOREVER 💝
   Orchestrates 4 distinct mini-game genres:
   Room 1: Memory Card Matching (Nostalgia Sekolah SD & SMP)
   Room 2: Snakes & Ladders (Nobar, DM Pertama, & Meme Kucing)
   Room 3: Coastal Car Racing (Samudra LDR — 320 KM ke 0 KM!)
   Room 4: Mountain Snake Game (Camping Pegunungan Menuju Ultah)
   
   8-Step Room Surprise Flow:
   1. Win Mini-Game
   2. Female Character Appears & Welcomes
   3. Both Approach & True Animated Hug
   4. Walk Together to ENTER Banner
   5. Player Presses ENTER
   6. Surprise Modal Opens
   7. Story / Memories / Dialogue / Gift Revealed
   8. Advance to Next Room
=================================================== */

import { startMiniGame1, retryMiniGame1, stopMiniGame1 } from './minigame-room1.js';
import {
  startMiniGame2, retryMiniGame2, stopMiniGame2,
  rollDice, beginGame2
} from './minigame-room2.js';
import {
  startMiniGame3, retryMiniGame3, stopMiniGame3,
  setMg3TouchLeft, setMg3TouchRight, setMg3TouchUp, setMg3TouchDown
} from './minigame-room3.js';
import {
  startMiniGame4, retryMiniGame4, stopMiniGame4,
  setSnakeDir
} from './minigame-room4.js';
import { SoundEngine } from './sound.js';
import { showScreen, setupButton } from './navigation.js';
import {
  drawStudentPixelChar,
  drawGirlfriendPixelChar,
  drawCoupleHug,
  drawCoupleHoldingHandsWalk
} from './characters.js';
import { STORYBOOK_PAGES } from '../data/stories.js';
import { SYMBOLIC_ARTIFACTS, ADMIRATION_NOTES, FUTURE_MESSAGE } from '../data/memories.js';
import { triggerFinalSurprise } from './finale.js';
import { showRoomTransition } from './room-manager.js';

// Active mini-game state
export let currentMiniGameRoom = 0; // 0-3
let surpriseAnimId = null;
let surpriseBoyX = 0;
let surpriseGirlX = 0;
let surprisePhase = 'idle'; // 'approaching' | 'hugging' | 'done'
let surpriseT = 0;
let mgStoryPage = 0;
let onMiniGameNextRoomCallback = null;

// Room metadata for HUD & Transitions
const ROOM_META = [
  {
    name: "WHERE IT ALL BEGAN",
    badge: "CHAPTER 1 • NOSTALGIA SEKOLAH",
    subtitle: "“Dari halaman sekolah yang asri, rasa penasaran itu mulai bersemi di bawah pohon rindang…”",
    distance: "1,500 KM",
    objName: "PAIRS",
    objMax: "8"
  },
  {
    name: "LITTLE THINGS, BIG MEMORIES",
    badge: "CHAPTER 2 • NOBAR PANTAI & MEME KUCING",
    subtitle: "“Dari DM pertama, nobar bareng di pantai, sampai pose muntah kucing saat video call!”",
    distance: "850 KM",
    objName: "PETAK",
    objMax: "100"
  },
  {
    name: "THROUGH EVERY CHAPTER",
    badge: "CHAPTER 3 • SAMUDRA RACING MINI-GAME",
    subtitle: "“Menembus ombak samudra dengan laju penuh, mendekatkan jarak LDR hingga 0 KM!”",
    distance: "320 KM",
    objName: "FINISH",
    objMax: "100%"
  },
  {
    name: "A LITTLE SOMETHING FOR YOU",
    badge: "CHAPTER 4 • CAMPING PEGUNUNGAN & API UNGGUN",
    subtitle: "“Bayangan camping di bawah langit berbintang, menghangatkan api unggun sebelum puncak kejutan…”",
    distance: "0 KM",
    objName: "MAKANAN",
    objMax: "10"
  }
];

function getCanvas() {
  return document.getElementById('gameCanvas');
}

/* ===================================================
   MINIGAME ENTRY POINT
=================================================== */

/**
 * Start the mini-game for the given room index (0-3).
 */
export function startMiniGame(roomIdx) {
  if (roomIdx < 0 || roomIdx > 3) roomIdx = 0;
  currentMiniGameRoom = roomIdx;

  const canvas = getCanvas();
  if (!canvas) return;

  stopAllMiniGames();
  hideAllMiniGameOverlays();
  updateHUDForRoom(roomIdx);
  showMiniGameUI(roomIdx);

  const meta = ROOM_META[roomIdx];
  showRoomTransition(meta.badge, meta.name, meta.subtitle);
  SoundEngine.dreamyChime && SoundEngine.dreamyChime();
  // Start generative ambient background music for this room
  const _ambRoomKeys = ['room1', 'room2', 'room3', 'room4'];
  SoundEngine.startAmbientMusic && SoundEngine.startAmbientMusic(_ambRoomKeys[roomIdx] || 'room1');

  const onRoomWon = () => {
    SoundEngine.milestone && SoundEngine.milestone();
    setTimeout(() => {
      startSurpriseSequence(roomIdx);
    }, 700);
  };

  if (roomIdx === 0) {
    startMiniGame1(canvas, onRoomWon);
    setupMg1UI();
  } else if (roomIdx === 1) {
    startMiniGame2(canvas, onRoomWon);
    setupMg2UI();
  } else if (roomIdx === 2) {
    startMiniGame3(canvas, onRoomWon);
    setupMg3UI();
  } else if (roomIdx === 3) {
    startMiniGame4(canvas, onRoomWon);
    setupMg4UI();
  }
}

export function restartCurrentMiniGame() {
  startMiniGame(currentMiniGameRoom);
}

export function stopAllMiniGames() {
  SoundEngine.stopAmbientMusic && SoundEngine.stopAmbientMusic(1.0);
  stopMiniGame1();
  stopMiniGame2();
  stopMiniGame3();
  stopMiniGame4();
  if (surpriseAnimId) {
    cancelAnimationFrame(surpriseAnimId);
    surpriseAnimId = null;
  }
}

function updateHUDForRoom(roomIdx) {
  const meta = ROOM_META[roomIdx] || ROOM_META[0];
  const titleEl = document.getElementById('hud-room-title');
  const distEl = document.getElementById('hud-dist-val');
  const objEl = document.getElementById('hud-item-count');
  const maxEl = document.getElementById('hud-item-max');

  if (titleEl) titleEl.textContent = `${meta.name} — ${meta.badge}`;
  if (distEl) distEl.textContent = meta.distance;
  if (objEl) objEl.textContent = "0";
  if (maxEl) maxEl.textContent = meta.objMax;

  // Update LDR 1,500 KM route tracking in transition overlay
  const transDistEl = document.getElementById('trans-dist-text');
  if (transDistEl) {
    transDistEl.textContent = `Menempuh 1,500 KM LDR ➔ Menuju ${meta.distance}`;
  }

  // Update Room Transition Mascot Cat with tailored dialogue per room
  const transCatEl = document.getElementById('trans-cat-mascot');
  if (transCatEl) {
    const catTransitionQuotes = [
      '🐱🐾 <em>"Mew! Dari tatapan malu-malu masa SD, sekarang kita cari pasangan memorinya yaa!"</em>',
      '🐱🛋️ <em>"Meow~ Masuk ke kamar kenangan & nobar LDR sambil video call larut malam!"</em>',
      '🐱🏎️ <em>"Vroom! Kucing ngebut siap temani Nidan menembus 320 KM terakhir menuju Jinan!"</em>',
      '🐱🏕️ <em>"Purr~ Tenda camping di tepi danau starlight sudah dekat! Puncak kejutan menanti!"</em>'
    ];
    transCatEl.innerHTML = catTransitionQuotes[roomIdx] || '🐱 <em>"Mew! Semangat melangkah, Nidanku sayang!"</em>';
  }
}

/* ===================================================
   UI OVERLAYS PER MINIGAME
=================================================== */

function hideAllMiniGameOverlays() {
  ['mg1-overlay', 'mg2-overlay', 'mg3-overlay', 'mg4-overlay',
   'room-surprise-enter-banner', 'modal-storybook', 'modal-vault',
   'modal-dialogue', 'modal-giftbox'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'none';
      if (el.classList) el.classList.remove('active');
    }
  });
}

function showMiniGameUI(roomIdx) {
  const overlayId = `mg${roomIdx + 1}-overlay`;
  const el = document.getElementById(overlayId);
  if (el) {
    el.style.display = 'flex';
  }
}

let mg1Bound = false;
function setupMg1UI() {
  if (mg1Bound) return;
  mg1Bound = true;
  setupButton('mg1-btn-play', () => {
    retryMiniGame1();
  });
  setupButton('mg1-btn-retry', () => {
    retryMiniGame1();
  });
}

let mg2Bound = false;
function setupMg2UI() {
  if (mg2Bound) return;
  mg2Bound = true;
  setupButton('mg2-btn-play', () => {
    beginGame2();
  });
  setupButton('mg2-btn-roll', () => {
    rollDice();
  });
  setupButton('mg2-btn-retry', () => {
    retryMiniGame2();
  });
}

let mg3Bound = false;
function setupMg3UI() {
  if (mg3Bound) return;
  mg3Bound = true;

  const upBtn = document.getElementById('mg3-btn-up');
  const downBtn = document.getElementById('mg3-btn-down');
  const gasBtn = document.getElementById('mg3-btn-gas');
  const brakeBtn = document.getElementById('mg3-btn-brake');

  function addTouchControl(btn, onDown, onUp) {
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); }, { passive: false });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); }, { passive: false });
    btn.addEventListener('mousedown', onDown);
    btn.addEventListener('mouseup', onUp);
    btn.addEventListener('mouseleave', onUp);
  }

  addTouchControl(upBtn, () => setMg3TouchUp(true), () => setMg3TouchUp(false));
  addTouchControl(downBtn, () => setMg3TouchDown(true), () => setMg3TouchDown(false));
  addTouchControl(gasBtn, () => setMg3TouchRight(true), () => setMg3TouchRight(false));
  addTouchControl(brakeBtn, () => setMg3TouchLeft(true), () => setMg3TouchLeft(false));

  setupButton('mg3-btn-retry', () => {
    retryMiniGame3();
  });
}

let mg4Bound = false;
function setupMg4UI() {
  if (mg4Bound) return;
  mg4Bound = true;

  const dirs = [
    { id: 'mg4-btn-up', dc: 0, dr: -1 },
    { id: 'mg4-btn-down', dc: 0, dr: 1 },
    { id: 'mg4-btn-left', dc: -1, dr: 0 },
    { id: 'mg4-btn-right', dc: 1, dr: 0 },
  ];
  dirs.forEach(({ id, dc, dr }) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      setSnakeDir(dc, dr);
    }, { passive: false });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setSnakeDir(dc, dr);
    });
  });

  setupButton('mg4-btn-retry', () => {
    retryMiniGame4();
  });
}

/* ===================================================
   SURPRISE SEQUENCE (After each mini-game win)
   Step 1: Mini-game won
   Step 2: Jinan appears & welcomes Nidan
   Step 3: Couple approaches and warm embrace
   Step 4: Walk together to ENTER checkpoint
   Step 5: Player presses ENTER
   Step 6: Room surprise modal opens
   Step 7: Personal storytelling / artifact revealed
   Step 8: Smooth advance to next room
=================================================== */

function startSurpriseSequence(roomIdx) {
  stopAllMiniGames();
  hideAllMiniGameOverlays();

  const canvas = getCanvas();
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const cw = canvas.width;
  const ch = canvas.height;

  surprisePhase = 'approaching';
  surpriseT = 0;
  surpriseBoyX = cw * 0.22;
  surpriseGirlX = cw * 0.82;

  SoundEngine.collect && SoundEngine.collect();

  if (surpriseAnimId) cancelAnimationFrame(surpriseAnimId);

  function drawThemedSurpriseBackground(ctx, cw, ch, t, room) {
    if (room === 0) {
      // Room 0: Pastel Blue Academy & Pink Sakura Cherry Blossoms (Image 1)
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#bae6fd');
      grad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // School building facade behind
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(cw * 0.2, 80, cw * 0.6, ch - 120);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cw * 0.2 - 4, 78, cw * 0.6 + 8, 6);
      // Clock tower
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(cw * 0.42, 80); ctx.lineTo(cw * 0.5, 30); ctx.lineTo(cw * 0.58, 80);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(cw * 0.5, 60, 12, 0, Math.PI * 2); ctx.fill();

      // Sakura trees flanking left and right
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(60, 110, 65, 0, Math.PI * 2);
      ctx.arc(cw - 60, 110, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(95, 95, 45, 0, Math.PI * 2);
      ctx.arc(cw - 95, 95, 45, 0, Math.PI * 2);
      ctx.fill();

      // Courtyard pavement
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(0, ch - 42, cw, 42);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(0, ch - 42, cw, 4);

    } else if (room === 1) {
      // Room 1: Dreamy Memory Vault Bedroom & Floating Letters (Image 2)
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#0a1628');
      grad.addColorStop(0.5, '#132845');
      grad.addColorStop(1, '#244e82');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // Warm sunlit window rays on left
      const beam = ctx.createRadialGradient(80, 70, 5, 260, 200, 260);
      beam.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(120, 20); ctx.lineTo(380, ch); ctx.lineTo(60, ch); ctx.fill();

      // Floating origami paper planes & letters
      for (let p = 0; p < 4; p++) {
        const px = (p * 180 + t * 1.2) % (cw + 60) - 30;
        const py = 70 + (p * 35) % 90 + Math.sin(t * 0.08 + p) * 8;
        ctx.font = '14px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p % 2 === 0 ? '✈️' : '💌', px, py);
      }

      // Cozy wooden floor
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, ch - 42, cw, 42);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, ch - 42, cw, 4);

    } else if (room === 2) {
      // Room 2: Pastel Romantic Courtyard Garden Promenade (Image 3)
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#c084fc');
      grad.addColorStop(0.55, '#d8b4fe');
      grad.addColorStop(1, '#f5f3ff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // Garden stone fountain & rose topiary
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath(); ctx.roundRect(cw * 0.5 - 28, ch - 110, 56, 16, 6); ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(cw * 0.5, ch - 115, 6, 0, Math.PI * 2); ctx.fill();

      // Balloon heart archway
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cw * 0.5, ch - 42, 70, Math.PI, 0); ctx.stroke();
      ['#f472b6', '#c084fc', '#38bdf8'].forEach((bc, bi) => {
        const ba = Math.PI + (bi + 1) * (Math.PI / 4);
        ctx.fillStyle = bc;
        ctx.font = '12px serif';
        ctx.fillText('💖', cw * 0.5 + Math.cos(ba) * 70, ch - 42 + Math.sin(ba) * 70);
      });

      // Marble terrace floor
      ctx.fillStyle = '#f5f3ff';
      ctx.fillRect(0, ch - 42, cw, 42);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(0, ch - 42, cw, 4);

    } else {
      // Room 3: Alpine Mountain Lake Campfire & Glowing Dome Tent (Image 4)
      const grad = ctx.createLinearGradient(0, 0, 0, ch);
      grad.addColorStop(0, '#060c18');
      grad.addColorStop(0.4, '#0d1b2a');
      grad.addColorStop(0.75, '#0e7490');
      grad.addColorStop(1, '#14532d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // Starry sky
      for (let s = 0; s < 18; s++) {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
        ctx.fillRect((s * 73 + t * 0.05) % cw, 8 + (s * 15) % 90, 1.5, 1.5);
      }

      // Glowing Cyan Dome Tent
      const tentX = cw * 0.75;
      const tentY = ch - 42;
      ctx.fillStyle = 'rgba(34, 211, 238, 0.75)';
      ctx.beginPath(); ctx.ellipse(tentX, tentY, 32, 24, 0, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 1.5; ctx.stroke();

      // Crackling campfire
      const fireX = cw * 0.25;
      const fireY = ch - 42;
      ctx.fillStyle = '#f97316';
      ctx.beginPath(); ctx.arc(fireX, fireY - 10, 8 + Math.sin(t * 0.3) * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath(); ctx.arc(fireX, fireY - 8, 4, 0, Math.PI * 2); ctx.fill();

      // Lakeside grass & wildflowers
      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, ch - 42, cw, 42);
      ctx.fillStyle = '#22d3ee'; // luminous cyan shoreline
      ctx.fillRect(0, ch - 42, cw, 4);
    }

    // Drifting petals & starlight
    for (let i = 0; i < 6; i++) {
      const hx = (i * 130 + t * 0.8) % cw;
      const hy = ch * 0.38 - ((t * 0.45 + i * 28) % (ch * 0.45));
      ctx.font = '13px serif';
      ctx.textAlign = 'center';
      ctx.fillText(i % 2 === 0 ? '🌸' : '✨', hx, hy);
    }
  }

  function surpriseLoop() {
    surpriseT += 0.5;
    ctx.clearRect(0, 0, cw, ch);

    // Draw Authentically Themed Surprise Background for each room!
    drawThemedSurpriseBackground(ctx, cw, ch, surpriseT, roomIdx);

    // Approach & Hug Logic
    const hugPoint = cw * 0.5;

    if (surprisePhase === 'approaching') {
      if (surpriseBoyX < hugPoint - 28) {
        surpriseBoyX += 1.5;
      }
      if (surpriseGirlX > hugPoint + 28) {
        surpriseGirlX -= 1.3;
      }

      if (surpriseBoyX >= hugPoint - 28 && surpriseGirlX <= hugPoint + 28) {
        surprisePhase = 'hugging';
        surpriseT = 0; // reset timer for hug duration
        SoundEngine.dreamyChime && SoundEngine.dreamyChime();
      }

      // Draw walking characters
      drawStudentPixelChar(ctx, surpriseBoyX, ch - 82, false, 'walk', surpriseT, 'heart');
      drawGirlfriendPixelChar(ctx, surpriseGirlX, ch - 82, true, 'walk', surpriseT, 'heart');

    } else if (surprisePhase === 'hugging') {
      // Both in warm embrace
      drawCoupleHug(ctx, hugPoint - 20, ch - 82, surpriseT);

      // Radiant Warm Starlight Aura
      const auraPulse = Math.sin(surpriseT * 0.08) * 6;
      const aura = ctx.createRadialGradient(hugPoint, ch - 65, 5, hugPoint, ch - 65, 50 + auraPulse);
      aura.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      aura.addColorStop(0.6, 'rgba(244, 114, 182, 0.25)');
      aura.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(hugPoint, ch - 65, 50 + auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Sparkles around hug
      for (let s = 0; s < 6; s++) {
        const angle = (s / 6) * Math.PI * 2 + surpriseT * 0.04;
        const sr = 45 + Math.sin(surpriseT * 0.1 + s) * 5;
        const sx = hugPoint + Math.cos(angle) * sr;
        const sy = ch - 70 + Math.sin(angle) * sr * 0.5;
        ctx.fillStyle = s % 2 === 0 ? '#fbbf24' : '#f472b6';
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', sx, sy);
      }

      // After 2.5 seconds of hugging, show ENTER banner
      if (surpriseT > 75) {
        surprisePhase = 'done';
        showEnterBanner(roomIdx);
      }

    } else if (surprisePhase === 'done') {
      // Couple standing close holding hands
      drawCoupleHoldingHandsWalk(ctx, hugPoint - 20, ch - 82, surpriseT);
    }

    const banner = document.getElementById('room-surprise-enter-banner');
    if (surprisePhase !== 'done' || (banner && banner.style.display !== 'none')) {
      surpriseAnimId = requestAnimationFrame(surpriseLoop);
    }
  }

  surpriseLoop();
}

function showEnterBanner(roomIdx) {
  const bannerLabels = [
    '✨ BUKA KENANGAN SEKOLAH — TEKAN ENTER',
    '💝 BUKA VAULT LDR & MEME KUCING — TEKAN ENTER',
    '🏁 REFLEKSI SAMUDRA LDR — TEKAN ENTER',
    '🎂 BUKA KOTAK HADIAH ULANG TAHUN — TEKAN ENTER',
  ];

  const banner = document.getElementById('room-surprise-enter-banner');
  if (banner) {
    banner.style.display = 'flex';
    const label = banner.querySelector('.prompt-text');
    if (label) label.textContent = bannerLabels[roomIdx] || '✨ KEJUTAN ROOM TERSEDIA!';
  }

  const btn = document.getElementById('btn-room-surprise-enter');
  if (btn) {
    btn._mgRoomIdx = roomIdx;
  }
}

/**
 * Called when player presses ENTER or clicks the surprise banner.
 */
export function executeRoomSurprise(roomIdx) {
  const banner = document.getElementById('room-surprise-enter-banner');
  if (banner) banner.style.display = 'none';

  if (surpriseAnimId) {
    cancelAnimationFrame(surpriseAnimId);
    surpriseAnimId = null;
  }

  SoundEngine.collect && SoundEngine.collect();

  if (roomIdx === 0) mgOpenStorybookModal();
  else if (roomIdx === 1) mgOpenVaultModal();
  else if (roomIdx === 2) mgOpenDialogueModal();
  else if (roomIdx === 3) mgOpenGiftboxModal();
}

/* ===================================================
   ROOM SURPRISE MODALS
=================================================== */

function mgOpenStorybookModal() {
  mgStoryPage = 0;
  mgRenderStorybookPage();
  const m = document.getElementById('modal-storybook');
  if (m) m.classList.add('active');
}

function mgRenderStorybookPage() {
  const p = STORYBOOK_PAGES[mgStoryPage];
  if (!p) return;

  const titleEl = document.getElementById('book-page-title');
  const subtitleEl = document.getElementById('book-page-subtitle');
  const contentEl = document.getElementById('book-page-content');
  const quoteEl = document.getElementById('book-page-quote');
  const indEl = document.getElementById('book-page-indicator');
  const btnPrev = document.getElementById('btn-book-prev');
  const btnNext = document.getElementById('btn-book-next');
  const btnClose = document.getElementById('btn-book-close');

  if (titleEl) titleEl.textContent = p.title;
  if (subtitleEl) subtitleEl.textContent = p.subtitle || '';
  if (contentEl) contentEl.innerHTML = p.content;
  if (quoteEl) {
    if (p.quote) {
      quoteEl.textContent = p.quote;
      quoteEl.style.display = 'block';
    } else {
      quoteEl.style.display = 'none';
    }
  }
  if (indEl) indEl.textContent = `Halaman ${mgStoryPage + 1} / ${STORYBOOK_PAGES.length}`;

  if (btnPrev) btnPrev.style.display = mgStoryPage === 0 ? 'none' : 'inline-block';
  if (btnNext) btnNext.style.display = mgStoryPage === STORYBOOK_PAGES.length - 1 ? 'none' : 'inline-block';
  if (btnClose) btnClose.style.display = mgStoryPage === STORYBOOK_PAGES.length - 1 ? 'inline-block' : 'none';
}

function mgOpenVaultModal() {
  const m = document.getElementById('modal-vault');
  if (m) m.classList.add('active');
  mgSelectVaultPedestal(0);
}

function mgSelectVaultPedestal(idx) {
  const artifact = SYMBOLIC_ARTIFACTS[idx];
  if (!artifact) return;

  const titleEl = document.getElementById('vault-detail-title');
  const descEl = document.getElementById('vault-detail-desc');

  if (titleEl) titleEl.textContent = artifact.title;
  if (descEl) descEl.textContent = artifact.desc;

  for (let i = 0; i < 3; i++) {
    const btn = document.getElementById(`vault-btn-${i}`);
    if (btn) {
      if (i === idx) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  SoundEngine.collect && SoundEngine.collect();
}

function mgOpenDialogueModal() {
  const m = document.getElementById('modal-dialogue');
  if (m) m.classList.add('active');
  mgSelectAdmireTab(0);
}

function mgSelectAdmireTab(idx) {
  const note = ADMIRATION_NOTES[idx];
  if (!note) return;

  const titleEl = document.getElementById('admire-detail-title');
  const subEl = document.getElementById('admire-detail-sub');
  const textEl = document.getElementById('admire-detail-text');

  if (titleEl) titleEl.innerHTML = `${note.icon} ${note.title}`;
  if (subEl) subEl.textContent = note.subtitle;
  if (textEl) textEl.textContent = note.text;

  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`admire-tab-${i}`);
    if (btn) {
      if (i === idx) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  }

  SoundEngine.collect && SoundEngine.collect();
}

function mgOpenGiftboxModal() {
  const m = document.getElementById('modal-giftbox');
  if (!m) return;

  // Dynamically populate content from FUTURE_MESSAGE data
  const titleEl = document.getElementById('gift-modal-title');
  const bodyEl = document.getElementById('gift-modal-body');
  const quoteEl = document.getElementById('gift-modal-quote');

  if (titleEl) titleEl.textContent = FUTURE_MESSAGE.title;
  if (bodyEl) {
    bodyEl.innerHTML = FUTURE_MESSAGE.paragraphs
      .map(para => `<p style="font-family:var(--font-body);font-size:13.5px;color:var(--text-main);line-height:1.75;margin-bottom:12px;text-align:justify;text-justify:inter-word;hyphens:auto;overflow-wrap:break-word;word-break:break-word;">${para}</p>`)
      .join('');
  }
  if (quoteEl) quoteEl.textContent = FUTURE_MESSAGE.quote;

  m.classList.add('active');
}

/* ===================================================
   MODAL ACTIONS & PROGRESSION BINDINGS
=================================================== */

export function initMiniGameModals(onNextRoom) {
  onMiniGameNextRoomCallback = onNextRoom;

  // Storybook modal (Room 1)
  setupButton('btn-book-prev', () => {
    if (mgStoryPage > 0) {
      mgStoryPage--;
      mgRenderStorybookPage();
      SoundEngine.collect && SoundEngine.collect();
    }
  });

  setupButton('btn-book-next', () => {
    if (mgStoryPage < STORYBOOK_PAGES.length - 1) {
      mgStoryPage++;
      mgRenderStorybookPage();
      SoundEngine.collect && SoundEngine.collect();
    }
  });

  // Advance Room 1 -> Room 2
  setupButton('btn-book-close', () => {
    const m = document.getElementById('modal-storybook');
    if (m) m.classList.remove('active');
    if (onMiniGameNextRoomCallback) onMiniGameNextRoomCallback(1);
  });

  // Memory Vault (Room 2)
  setupButton('vault-btn-0', () => mgSelectVaultPedestal(0));
  setupButton('vault-btn-1', () => mgSelectVaultPedestal(1));
  setupButton('vault-btn-2', () => mgSelectVaultPedestal(2));

  // Advance Room 2 -> Room 3
  setupButton('btn-vault-close', () => {
    const m = document.getElementById('modal-vault');
    if (m) m.classList.remove('active');
    if (onMiniGameNextRoomCallback) onMiniGameNextRoomCallback(2);
  });

  // Little Things I Admire Tabs (Room 3)
  setupButton('admire-tab-0', () => mgSelectAdmireTab(0));
  setupButton('admire-tab-1', () => mgSelectAdmireTab(1));
  setupButton('admire-tab-2', () => mgSelectAdmireTab(2));
  setupButton('admire-tab-3', () => mgSelectAdmireTab(3));

  // Advance Room 3 -> Room 4
  setupButton('btn-dialog-continue', () => {
    const m = document.getElementById('modal-dialogue');
    if (m) m.classList.remove('active');
    if (onMiniGameNextRoomCallback) onMiniGameNextRoomCallback(3);
  });

  // Room 4 Giftbox -> Birthday Finale Climax!
  setupButton('btn-giftbox-close', () => {
    const m = document.getElementById('modal-giftbox');
    if (m) m.classList.remove('active');
    stopAllMiniGames();
    triggerFinalSurprise();
  });

  // Surprise ENTER banner button
  setupButton('btn-room-surprise-enter', () => {
    const btn = document.getElementById('btn-room-surprise-enter');
    const rIdx = btn?._mgRoomIdx ?? currentMiniGameRoom;
    executeRoomSurprise(rIdx);
  });
}
