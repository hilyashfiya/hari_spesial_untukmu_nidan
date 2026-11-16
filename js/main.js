/* ===================================================
   MAIN BOOTSTRAP MODULE — PLAYER TWO, FOREVER 💝
   PlayStation & Noise Mini-Game, Ambient Nature & Initialization
   4 Distinct Mini-Games, Nidan & Jinan Authentic Storytelling
=================================================== */

import { SoundEngine } from './sound.js';
import { showScreen, showOverlay, hideOverlay, setupButton } from './navigation.js';
import {
  startGameAdventure,
  pauseGame,
  resumeGame,
  restartCurrentRoom,
  setMiniGameLauncher,
  isPaused,
  isGameRunning
} from './game-engine.js';
import {
  startMiniGame,
  initMiniGameModals,
  executeRoomSurprise,
  restartCurrentMiniGame,
  currentMiniGameRoom,
  stopAllMiniGames
} from './minigame-manager.js';
import {
  playerState,
  switchActiveCharacter,
  getActivePlayer
} from './player.js';
import { handlePuzzleInteraction } from './puzzle-system.js';
import { currentRoomIdx } from './room-manager.js';
import { initFinale, setOnReplayAdventure } from './finale.js';
import {
  initControls,
  setOnEscapePress,
  setOnSwitchPress,
  setOnInteractPress
} from './controls.js';
import {
  drawStudentPixelChar,
  drawGirlfriendPixelChar,
  drawPlayStationHub,
  drawOpeningPixelWorld
} from './characters.js';

let toastTimeout = null;
let psAnimId = null;
let openingAnimId = null;
let openingState = {
  catClicked: false,
  charactersClicked: false,
  timer: 0
};

/**
 * Display gentle floating feedback above gameplay viewport
 */
export function showInteractionToast(msg) {
  const toast = document.getElementById('interaction-toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.style.display = 'block';

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 2800);
}

/**
 * Sky clouds generator for dreamy atmosphere
 */
function setupSkyClouds() {
  const container = document.getElementById('clouds-sky-box');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud-drifter';
    const w = Math.random() * 80 + 90;
    const h = w * 0.38;
    cloud.style.width = `${w}px`;
    cloud.style.height = `${h}px`;
    cloud.style.top = `${15 + i * 16}%`;
    cloud.style.setProperty('--dur', `${Math.random() * 15 + 25}s`);
    cloud.style.animationDelay = `${i * -6}s`;
    container.appendChild(cloud);
  }
}

/**
 * Multi-layer ambient starfield & floating hearts generator
 */
function setupAmbient() {
  const sf = document.getElementById('ambient-starfield');
  if (!sf) return;
  sf.innerHTML = '';

  for (let i = 0; i < 28; i++) {
    const star = document.createElement('div');
    star.className = 'ambient-star';
    const size = Math.random() * 1.8 + 0.8;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top  = `${Math.random() * 100}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--op', (Math.random() * 0.35 + 0.2).toFixed(2));
    star.style.setProperty('--dur', `${(Math.random() * 3.5 + 2.5).toFixed(1)}s`);
    star.style.animationDelay = `${(Math.random() * 4).toFixed(1)}s`;
    sf.appendChild(star);
  }

  const heartColors = ['#f472b6', '#38bdf8', '#fbcfe8'];
  for (let j = 0; j < 3; j++) {
    const heart = document.createElement('div');
    heart.className = 'ambient-heart';
    heart.textContent = '♡';
    heart.style.left = `${Math.random() * 90 + 5}%`;
    heart.style.setProperty('--sz', `${Math.random() * 6 + 10}px`);
    heart.style.setProperty('--dur', `${Math.random() * 8 + 12}s`);
    heart.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
    heart.style.animationDelay = `${Math.random() * 8}s`;
    heart.style.color = heartColors[j % heartColors.length];
    sf.appendChild(heart);
  }
}

/**
 * Living Pixel-Art Game World on Opening Screen
 * Matching reference image:
 * Nidan & Jinan on wooden deck, tree with bird, animated cat, drifting clouds, glistening lake
 */
function setupOpeningWorld() {
  const canvas = document.getElementById('opening-world-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;

  function updateSize() {
    const w = window.innerWidth || document.documentElement.clientWidth || 960;
    const h = window.innerHeight || document.documentElement.clientHeight || 540;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }
  updateSize();
  window.addEventListener('resize', updateSize);

  if (openingAnimId) cancelAnimationFrame(openingAnimId);

  function loop() {
    try {
      t += 0.5;
      if (openingState.timer > 0) {
        openingState.timer--;
        if (openingState.timer === 0) {
          openingState.catClicked = false;
          openingState.charactersClicked = false;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawOpeningPixelWorld(ctx, canvas.width, canvas.height, t, openingState);
    } catch (err) {
      console.error('Error rendering opening scene:', err);
    }
    openingAnimId = requestAnimationFrame(loop);
  }
  loop();

  // Click on canvas (interact with characters, cat, or world)
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const cw = canvas.width;
    const ch = canvas.height;
    const isMobile = cw < 768 || ch > cw;

    const deckY = isMobile ? Math.round(ch - 110) : Math.round(ch - 120);
    const catX = isMobile ? Math.round(cw * 0.28) : Math.round(cw * 0.70 - 58);
    const catY = deckY - 24;

    // Check click on cat
    if (Math.hypot(clickX - (catX + 10), clickY - (catY + 8)) < 45) {
      openingState.catClicked = true;
      openingState.timer = 50;
      SoundEngine.catMeow && SoundEngine.catMeow();
      return;
    }

    const nidanX = isMobile ? Math.round(cw * 0.44) : Math.round(cw * 0.70);
    const jinanX = isMobile ? Math.round(cw * 0.64) : Math.round(cw * 0.80);
    const charScale = isMobile ? 2.0 : 2.4;
    const charBaseY = deckY - Math.round(34 * charScale);

    // Check click on Nidan or Jinan
    if (clickX >= nidanX - 20 && clickX <= jinanX + 60 &&
        clickY >= charBaseY - 30 && clickY <= deckY + 10) {
      openingState.charactersClicked = true;
      openingState.timer = 60;
      SoundEngine.star && SoundEngine.star();
      return;
    }
  });

  // Sound toggle button on opening screen
  const btnSoundMenu = document.getElementById('btn-sound-toggle-menu');
  if (btnSoundMenu) {
    btnSoundMenu.addEventListener('click', () => {
      SoundEngine.toggleMute();
      updateMenuSoundButton();
    });
  }
}

function updateMenuSoundButton() {
  const icon = document.getElementById('menu-sound-icon');
  const text = document.getElementById('menu-sound-text');
  const isMuted = SoundEngine.isMuted ? SoundEngine.isMuted() : false;
  if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
  if (text) text.textContent = isMuted ? 'AUDIO: MATI' : 'AUDIO: NYALA';
}

/**
 * Dialogue avatar preview
 */
function setupDialogAvatar() {
  const cv = document.getElementById('dialog-avatar-canvas');
  if (!cv) return;
  const c = cv.getContext('2d');
  drawGirlfriendPixelChar(c, 12, 8, false, 'idle', 0);
}

/**
 * Fullscreen toggle helper
 */
function toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

/**
 * Main application bootstrap
 */
function initApp() {
  if (window.__GAME_INITIALIZED__) return;

  // 1. Ambient Background & Clouds
  setupAmbient();
  setupSkyClouds();
  setupOpeningWorld();
  setupDialogAvatar();

  // 2. Landing Screen Buttons
  setupButton('btn-start-quest', () => {
    SoundEngine.psBootChime();
    startGameAdventure();
  });

  setupButton('btn-show-how', () => {
    showOverlay('howto');
  });

  setupButton('btn-close-how', () => {
    hideOverlay('howto');
  });

  // 3. HUD Actions
  setupButton('btn-sound-toggle', () => {
    SoundEngine.toggleMute();
  });

  setupButton('btn-fullscreen-toggle', () => {
    toggleFullscreen();
  });

  setupButton('btn-game-pause', () => {
    pauseGame();
    showOverlay('pause');
  });

  setupButton('tc-pause', () => {
    pauseGame();
    showOverlay('pause');
  });

  // 4. Character Switch Handlers
  setupButton('btn-char-switch', () => {
    switchActiveCharacter();
  });

  setupButton('char-badge-boy', () => {
    if (playerState.canSwitch && playerState.activeChar !== 'boy') {
      switchActiveCharacter();
    }
  });

  setupButton('char-badge-girl', () => {
    if (playerState.canSwitch && playerState.activeChar !== 'girl') {
      switchActiveCharacter();
    }
  });

  setOnSwitchPress(() => {
    switchActiveCharacter();
  });

  // 5. Environmental & Surprise Interaction (Key E / Enter)
  setOnInteractPress(() => {
    const banner = document.getElementById('room-surprise-enter-banner');
    if (banner && banner.style.display !== 'none') {
      executeRoomSurprise(currentMiniGameRoom);
      return;
    }

    const active = getActivePlayer();
    handlePuzzleInteraction(active, currentRoomIdx, (msg) => {
      showInteractionToast(msg);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const banner = document.getElementById('room-surprise-enter-banner');
      if (banner && banner.style.display !== 'none') {
        executeRoomSurprise(currentMiniGameRoom);
      }
    }
  });

  // 6. Pause Screen Actions
  setupButton('btn-pause-resume', () => {
    hideOverlay('pause');
    resumeGame();
  });

  setupButton('btn-pause-sound-toggle', () => {
    SoundEngine.toggleMute();
  });

  // Audio Sliders
  const bgmSlider = document.getElementById('slider-bgm-volume');
  const bgmLabel = document.getElementById('label-bgm-val');
  if (bgmSlider) {
    bgmSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      SoundEngine.setBgmVolume(val / 100);
      if (bgmLabel) bgmLabel.textContent = `${val}%`;
    });
  }

  const sfxSlider = document.getElementById('slider-sfx-volume');
  const sfxLabel = document.getElementById('label-sfx-val');
  if (sfxSlider) {
    sfxSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      SoundEngine.setSfxVolume(val / 100);
      if (sfxLabel) sfxLabel.textContent = `${val}%`;
    });
  }

  setupButton('btn-pause-restart', () => {
    hideOverlay('pause');
    restartCurrentMiniGame();
  });

  setupButton('btn-pause-menu', () => {
    hideOverlay('pause');
    stopAllMiniGames();
    showScreen('landing');
  });

  // 7. Escape Key Handler
  setOnEscapePress(() => {
    if (isPaused) {
      hideOverlay('pause');
      resumeGame();
    } else if (isGameRunning) {
      pauseGame();
      showOverlay('pause');
    }
  });

  // 8. Replay Adventure Callback & Modules
  setOnReplayAdventure(() => {
    startGameAdventure();
  });

  initControls();
  initFinale();

  // 9. Wire Mini-Games Orchestration
  setMiniGameLauncher((roomIdx) => {
    startMiniGame(roomIdx);
  });

  initMiniGameModals((nextRoomIdx) => {
    startMiniGame(nextRoomIdx);
  });


  // Interactive Landing Meme Cat Mascot
  const landingCatBtn = document.getElementById('btn-landing-cat');
  const landingCatText = document.getElementById('landing-cat-text');
  const catQuotes = [
    'Meme Kucing: "Nidan, jangan lupa senyum & istirahat yaa! ♡"',
    'Meme Kucing: "Pose muntah pelangi pas video call larut malam! 🐱🌈"',
    'Meme Kucing: "Joget absurd jam 2 pagi di depan webcam bareng Jinan! 🕺🐾"',
    'Meme Kucing: "Loaf santai anti overthinking tugas kuliah! 🍞✨"',
    'Meme Kucing: "Dari zaman SD salting, sekarang pacaran selamanya! 💌"',
    'Meme Kucing: "Nidan, jangan lupa minum air putih pas ngoding! 💻♡"'
  ];
  let catQuoteIdx = 0;
  if (landingCatBtn) {
    landingCatBtn.addEventListener('click', () => {
      SoundEngine.catMeow && SoundEngine.catMeow();
      catQuoteIdx = (catQuoteIdx + 1) % catQuotes.length;
      if (landingCatText) landingCatText.textContent = catQuotes[catQuoteIdx];
    });
  }
  // 10. Show Landing Screen on Start
  showScreen('landing');
  // Gentle ambient opening music start on first landing
  SoundEngine.startMusic && SoundEngine.startMusic('landing');
  window.__GAME_INITIALIZED__ = true;
}

// Bootstrap once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
