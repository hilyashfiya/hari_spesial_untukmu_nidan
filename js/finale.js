/* ===================================================
   BIRTHDAY FINALE MODULE (7 SEAMLESS CINEMATIC SCENES)
   Scene 1: The Final Meeting (Titik Temu Nidan & Jinan)
   Scene 2: Nidan Menempel Manja & Mengajak ke Meja Kue
   Scene 3: The Birthday Cake Reveal & Candle Blowing
   Scene 4: Ucapan Ulang Tahun Spesial dari Jinan
   Scene 5: Cinema Video Message Theater
   Scene 6: Handover Amplop & Surat Spesial dari Jinan
   Scene 7: Grand Emotional Climax Hug under Starlight
   Player Two, Forever 💜
=================================================== */

import { SoundEngine } from './sound.js';
import { showScreen, setupButton } from './navigation.js';
import {
  drawStudentPixelChar,
  drawGirlfriendPixelChar,
  drawCoupleHug,
  drawCoupleCling,
  drawCoupleHoldingHandsWalk,
  drawPixelCat,
  drawPixelFlower,
  drawDriftingPetals
} from './characters.js';
import { BIRTHDAY_LETTER } from '../data/letter.js';

// Global Finale States
let onReplayAdventureCallback = null;
let currentSceneName = 'finaleMeeting';

// Scene 1 State
let meetingAnimId = null;
let meetingApproaching = false;
let meetingMet = false;
let meetingBoyX = 35;
let meetingGirlX = 205;

// Scene 2 State
let clingAnimId = null;
let clingPhase = 'cling'; // 'cling' -> 'walking'
let clingDuoX = 130;
let clingTimer = 0;

// Scene 3 State
let cakeCandlesLit = true;
let cakeAnimId = null;
let confettiActive = false;
let confettiParticles = [];
let confettiAnimId = null;
let micListening = false;
let micAudioCtx = null;
let micStream = null;

// Scene 4 State
let speechAnimId = null;
let speechTypewriterTimer = null;

// Scene 6 State
let handoverAnimId = null;

// Scene 7 State (Grand Climax Hug)
let finalHugAnimId = null;
let finalHugTimer = 0;
let finalBoyX = 40;
let finalGirlX = 190;
let finalSoundPlayed = false;

export function setOnReplayAdventure(cb) {
  onReplayAdventureCallback = cb;
}

/**
 * Entry point to start the 7-scene Birthday Finale
 */
export function triggerFinalSurprise() {
  SoundEngine.stopAmbientMusic && SoundEngine.stopAmbientMusic(1.0);
  setTimeout(() => { SoundEngine.startAmbientMusic && SoundEngine.startAmbientMusic('finale'); }, 1200);
  currentSceneName = 'finaleMeeting';
  showScreen('finaleMeeting');
  startScene1Meeting();
}

/* ===================================================
   SCENE 1: THE FINAL MEETING (TITIK TEMU NIDAN & JINAN)
   PENTING: NO premature hug here! Grand hug is in Scene 7.
=================================================== */
function startScene1Meeting() {
  const canvas = document.getElementById('meeting-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  meetingApproaching = false;
  meetingMet = false;
  meetingBoyX = 35;
  meetingGirlX = 205;

  const btnApproach = document.getElementById('btn-meeting-approach');
  const btnNext = document.getElementById('btn-meeting-next');
  const bubble = document.getElementById('meeting-speech-bubble');

  if (btnApproach) btnApproach.style.display = 'inline-flex';
  if (btnNext) btnNext.style.display = 'none';
  if (bubble) bubble.style.display = 'none';

  let t = 0;
  if (meetingAnimId) cancelAnimationFrame(meetingAnimId);

  function loop() {
    t += 0.5;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cosmic floor platform
    ctx.fillStyle = '#2e1053';
    ctx.fillRect(20, 130, 220, 16);
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(20, 130, 220, 3);

    // Starlight glow background
    ctx.fillStyle = 'rgba(244, 114, 182, 0.15)';
    ctx.beginPath();
    ctx.ellipse(130, 100, 75, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    if (meetingMet) {
      // Standing close together face-to-face, smiling warmly
      // Nidan on left (x=114), Jinan on right (x=146)
      drawStudentPixelChar(ctx, 114, 94, false, 'idle', t, 'heart');
      drawGirlfriendPixelChar(ctx, 146, 94, true, 'wave', t, 'heart');

      // Floating gentle hearts
      for (let h = 0; h < 3; h++) {
        const hy = 76 - ((t * 0.6 + h * 20) % 40);
        const hx = 130 + Math.sin(t * 0.1 + h) * 12;
        ctx.fillStyle = h % 2 === 0 ? '#f472b6' : '#fef08a';
        ctx.font = '11px sans-serif';
        ctx.fillText('♥', hx, hy);
      }
    } else {
      if (meetingApproaching) {
        if (meetingBoyX < 114) meetingBoyX += 1.2;
        if (meetingGirlX > 146) meetingGirlX -= 0.8;

        if (meetingBoyX >= 114) {
          meetingBoyX = 114;
          meetingGirlX = 146;
          meetingApproaching = false;
          meetingMet = true;
          SoundEngine.milestone();
          if (bubble) bubble.style.display = 'block';
          if (btnApproach) btnApproach.style.display = 'none';
          if (btnNext) btnNext.style.display = 'inline-flex';
        }
      }

      // Draw Nidan (walking or idle)
      drawStudentPixelChar(
        ctx,
        meetingBoyX,
        94,
        false,
        meetingApproaching ? 'walk' : 'idle',
        t,
        null
      );

      // Draw Jinan (waiting or walking to meet him)
      drawGirlfriendPixelChar(
        ctx,
        meetingGirlX,
        94,
        true,
        meetingApproaching ? 'walk' : 'wave',
        t,
        'heart'
      );
    }

    // Faithful companion cat watching the romantic meeting
    drawPixelCat(ctx, 218, 115, meetingMet ? 'happy' : 'loaf', t);

    meetingAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ===================================================
   SCENE 2: NIDAN MENEMPEL MANJA & MENGAJAK KE KUE
=================================================== */
function startScene2Cling() {
  const canvas = document.getElementById('cling-walk-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  clingPhase = 'cling';
  clingDuoX = 135;
  clingTimer = 0;

  let t = 0;
  if (clingAnimId) cancelAnimationFrame(clingAnimId);

  function loop() {
    t += 0.5;
    clingTimer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Warm wooden / starlight floor
    ctx.fillStyle = '#381363';
    ctx.fillRect(10, 130, 300, 18);
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(10, 130, 300, 3);

    // Cute loaf cat resting on floor edge
    drawPixelCat(ctx, 20, 114, 'loaf', t);

    // Ambient heart particles
    const heartFloatY = 70 + Math.sin(t * 0.1) * 4;
    ctx.fillStyle = '#f472b6';
    ctx.font = '14px sans-serif';
    ctx.fillText('💜', clingDuoX + 16, heartFloatY);

    if (clingPhase === 'cling') {
      // Nidan leaning affectionately on Jinan's shoulder
      drawCoupleCling(ctx, clingDuoX, 94, t);

      // Switch to walking hand in hand after 180 frames (~3 sec)
      if (clingTimer > 180) {
        clingPhase = 'walking';
      }
    } else {
      // Walking together hand-in-hand
      clingDuoX += 0.7;
      if (clingDuoX > 250) clingDuoX = 30;
      drawCoupleHoldingHandsWalk(ctx, clingDuoX, 94, t);
    }

    clingAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ===================================================
   SCENE 3: THE BIRTHDAY CAKE REVEAL (HAPPY BIRTHDAY, NIDAN!)
=================================================== */
export function initCake3DRenderer() {
  const cakeCanvas = document.getElementById('cake-3d-canvas');
  if (!cakeCanvas) return;
  const c = cakeCanvas.getContext('2d');
  let t = 0;

  if (cakeAnimId) cancelAnimationFrame(cakeAnimId);

  function renderCake() {
    t += 0.5;
    c.clearRect(0, 0, cakeCanvas.width, cakeCanvas.height);
    const cx = cakeCanvas.width / 2;
    const cy = cakeCanvas.height / 2 + 15;

    // Both characters standing beside the cake
    // Nidan on the left carrying his laptop
    drawStudentPixelChar(c, cx - 145, cy - 8, false, 'idle', t, cakeCandlesLit ? null : 'heart');
    // Jinan on the right with her lilac sleeve
    drawGirlfriendPixelChar(c, cx + 115, cy - 8, true, 'idle', t, cakeCandlesLit ? 'wave' : 'heart');

    // Cute celebratory meme cats on the birthday cake stage!
    drawPixelCat(c, cx - 175, cy + 28, cakeCandlesLit ? 'loaf' : 'happy', t);
    drawPixelCat(c, cx + 152, cy + 28, cakeCandlesLit ? 'wave' : 'happy', t);

    // Pedestal Plate (White/Gold)
    c.fillStyle = 'rgba(0,0,0,0.35)';
    c.beginPath();
    c.ellipse(cx, cy + 54, 110, 32, 0, 0, Math.PI * 2);
    c.fill();

    c.fillStyle = '#fef08a';
    c.beginPath();
    c.ellipse(cx, cy + 50, 105, 28, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#fefce8';
    c.beginPath();
    c.ellipse(cx, cy + 47, 98, 24, 0, 0, Math.PI * 2);
    c.fill();

    // Bottom Layer: Pastel Lavender & Berry Mousse
    c.fillStyle = '#8b5cf6';
    c.beginPath();
    c.ellipse(cx, cy + 26, 84, 22, 0, 0, Math.PI);
    c.lineTo(cx + 84, cy - 6);
    c.ellipse(cx, cy - 6, 84, 22, 0, 0, Math.PI, true);
    c.lineTo(cx - 84, cy + 26);
    c.fill();

    c.fillStyle = '#c4b5fd';
    c.beginPath();
    c.ellipse(cx, cy - 6, 84, 22, 0, 0, Math.PI * 2);
    c.fill();

    // Cream dollops on bottom rim
    for (let d = 0; d < 8; d++) {
      const angle = (d / 8) * Math.PI * 2;
      const dx = cx + Math.cos(angle) * 76;
      const dy = cy - 6 + Math.sin(angle) * 19;
      c.fillStyle = '#f472b6';
      c.beginPath();
      c.arc(dx, dy, 5.5, 0, Math.PI * 2);
      c.fill();
    }

    // Top Layer: Strawberry & Whipped Cream
    c.fillStyle = '#ec4899';
    c.beginPath();
    c.ellipse(cx, cy - 16, 56, 16, 0, 0, Math.PI);
    c.lineTo(cx + 56, cy - 40);
    c.ellipse(cx, cy - 40, 56, 16, 0, 0, Math.PI, true);
    c.lineTo(cx - 56, cy - 16);
    c.fill();

    c.fillStyle = '#fbcfe8';
    c.beginPath();
    c.ellipse(cx, cy - 40, 56, 16, 0, 0, Math.PI * 2);
    c.fill();

    // 3 Lit Birthday Candles with Natural Animated Flames
    const candlePositions = [
      { x: cx - 26, y: cy - 44 },
      { x: cx,      y: cy - 48 },
      { x: cx + 26, y: cy - 44 }
    ];

    candlePositions.forEach((cp, i) => {
      // Candle stick
      c.fillStyle = '#ffffff';
      c.fillRect(cp.x - 3, cp.y - 18, 6, 18);
      c.fillStyle = '#a855f7';
      c.fillRect(cp.x - 3, cp.y - 14, 6, 3);
      c.fillRect(cp.x - 3, cp.y - 7,  6, 3);

      // Wick
      c.fillStyle = '#374151';
      c.fillRect(cp.x - 0.75, cp.y - 22, 1.5, 4);

      if (cakeCandlesLit) {
        // Natural Dancing Flame
        const fSize = 6.5 + Math.sin(t * 0.2 + i * 2) * 1.5;
        const fSway = Math.sin(t * 0.15 + i) * 1.6;

        // Radiating light aura
        c.fillStyle = 'rgba(251, 191, 36, 0.4)';
        c.beginPath();
        c.arc(cp.x + fSway, cp.y - 28, 12, 0, Math.PI * 2);
        c.fill();

        // Outer amber flame
        c.fillStyle = '#f59e0b';
        c.beginPath();
        c.ellipse(cp.x + fSway, cp.y - 28, fSize * 0.8, fSize * 1.3, 0, 0, Math.PI * 2);
        c.fill();

        // Inner hot yellow core
        c.fillStyle = '#fef08a';
        c.beginPath();
        c.ellipse(cp.x + fSway, cp.y - 27, fSize * 0.45, fSize * 0.75, 0, 0, Math.PI * 2);
        c.fill();
      } else {
        // Smoke wisps drifting up
        const sY = cp.y - 26 - ((t * 0.8 + i * 10) % 36);
        const sX = cp.x + Math.sin(t * 0.1 + i) * 8;
        c.fillStyle = 'rgba(209, 213, 219, 0.5)';
        c.beginPath();
        c.arc(sX, sY, 3.5, 0, Math.PI * 2);
        c.fill();
      }
    });

    cakeAnimId = requestAnimationFrame(renderCake);
  }
  renderCake();
}

/**
 * Blow Out Candles transition inside Scene 3
 */
export function blowOutCandles() {
  if (!cakeCandlesLit) return;
  cakeCandlesLit = false;
  SoundEngine.candleBlow();

  const preBlow = document.getElementById('cake-actions-pre-blow');
  const postBlow = document.getElementById('cake-actions-post-blow');
  const wishText = document.getElementById('cake-wish-text');
  const statusBadge = document.getElementById('cake-status-badge');

  if (wishText) wishText.textContent = 'Lilin telah ditiup! Harapan tulusmu telah melesat ke langit semesta.';
  if (statusBadge) {
    statusBadge.textContent = 'HAPPY BIRTHDAY, NIDAN!';
    statusBadge.style.background = 'rgba(251,191,36,0.2)';
    statusBadge.style.borderColor = '#fbbf24';
  }

  if (preBlow) preBlow.style.display = 'none';
  if (postBlow) postBlow.style.display = 'flex';

  setTimeout(() => {
    confettiActive = true;
    initConfettiRenderer();
    SoundEngine.fanfare();
    SoundEngine.playHappyBirthdaySong();
  }, 400);
}

/**
 * Confetti celebration particles
 */
export function initConfettiRenderer() {
  const cc = document.getElementById('confetti-canvas');
  if (!cc) return;
  const c = cc.getContext('2d');

  function resizeConfetti() {
    const parent = cc.parentElement;
    cc.width  = parent ? parent.offsetWidth  : window.innerWidth;
    cc.height = parent ? parent.offsetHeight : window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  confettiParticles = [];
  const colors = ['#f472b6', '#c084fc', '#fbbf24', '#fef08a', '#fb7185', '#818cf8', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * cc.width,
      y: Math.random() * -cc.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 3,
      col: colors[i % colors.length],
      vy: Math.random() * 2.5 + 2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8
    });
  }

  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);

  function loopConfetti() {
    if (confettiActive) {
      c.clearRect(0, 0, cc.width, cc.height);
      for (let j = 0; j < confettiParticles.length; j++) {
        const p = confettiParticles[j];
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vrot;
        if (p.y > cc.height) {
          p.y = -20;
          p.x = Math.random() * cc.width;
        }
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot * Math.PI / 180);
        c.fillStyle = p.col;
        c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        c.restore();
      }
      confettiAnimId = requestAnimationFrame(loopConfetti);
    } else {
      c.clearRect(0, 0, cc.width, cc.height);
    }
  }
  loopConfetti();
}

/* ===================================================
   SCENE 4: UCAPAN ULANG TAHUN SPESIAL DARI JINAN
=================================================== */
const GIRL_SPEECH_TEXT = 
  "Hai Nidanku sayang... Selamat ulang tahun ya!\n\n" +
  "Game petualangan kecil ini kusiapkan khusus untuk merayakan hari kelahiranmu. " +
  "Dari masa SD dan awal SMP saat aku cuma bisa curi-curi pandang dan salting kalau kamu lewat, DM pertama yang kamu kirim, sesi nobar LDR kita, sampai video call malam penuh tawa absurd dan pose muntah kucing kita... setiap detik bersamamu selalu jadi memori paling berharga.\n\n" +
  "Aku tahu betapa keras perjuanganmu setiap hari di depan laptop, bergulat dengan tugas dan impian besarmu. Tapi kamu selalu ada, selalu sabar, dan selalu menjadi rumah paling hangat untukku.\n\n" +
  "Terima kasih sudah jadi Player One terbaikku. Selamat bertambah usia, Nidanku. Aku selalu bangga dan sayang padamu, hari ini dan selamanya!";

function startScene4Speech() {
  const canvas = document.getElementById('speech-duo-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let t = 0;
    if (speechAnimId) cancelAnimationFrame(speechAnimId);

    function loop() {
      t += 0.5;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor
      ctx.fillStyle = '#2a0c47';
      ctx.fillRect(10, 110, 220, 14);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(10, 110, 220, 2);

      // Jinan on left gesturing and speaking
      drawGirlfriendPixelChar(ctx, 60, 76, false, 'wave', t, 'heart');

      // Nidan on right listening attentively with glowing smile
      drawStudentPixelChar(ctx, 140, 76, true, 'idle', t, null);

      // Sweet companion meme cat listening attentively
      drawPixelCat(ctx, 185, 94, 'loaf', t);

      speechAnimId = requestAnimationFrame(loop);
    }
    loop();
  }

  // Typewriter effect
  runSpeechTypewriter();
}

function runSpeechTypewriter() {
  const container = document.getElementById('speech-text-content');
  if (!container) return;
  container.innerHTML = '';

  if (speechTypewriterTimer) clearInterval(speechTypewriterTimer);

  let charIdx = 0;
  const speed = 25;

  speechTypewriterTimer = setInterval(() => {
    if (charIdx < GIRL_SPEECH_TEXT.length) {
      const char = GIRL_SPEECH_TEXT[charIdx];
      if (char === '\n') {
        container.innerHTML += '<br>';
      } else {
        container.innerHTML += char;
      }
      charIdx++;
    } else {
      clearInterval(speechTypewriterTimer);
      speechTypewriterTimer = null;
    }
  }, speed);
}

/* ===================================================
   SCENE 6: ENVELOPE HANDOVER & LETTER DARI JINAN
=================================================== */
function startScene6Letter() {
  SoundEngine.stopAmbientMusic && SoundEngine.stopAmbientMusic(1.5);
  setTimeout(() => { SoundEngine.startAmbientMusic && SoundEngine.startAmbientMusic('letter'); }, 1800);
  const canvas = document.getElementById('envelope-handover-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let t = 0;
    if (handoverAnimId) cancelAnimationFrame(handoverAnimId);

    function loop() {
      t += 0.5;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor
      ctx.fillStyle = '#29104a';
      ctx.fillRect(10, 95, 200, 12);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(10, 95, 200, 2);

      // Jinan hands over the envelope
      drawGirlfriendPixelChar(ctx, 60, 62, false, 'gift', t, 'heart');

      // Golden Letter Envelope floating between them
      const envY = 70 + Math.sin(t * 0.1) * 3;
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(98, envY, 24, 16);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(98, envY, 24, 16);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(108, envY + 5, 4, 4); // Wax seal

      // Nidan receives with joy
      drawStudentPixelChar(ctx, 134, 62, true, 'idle', t, null);

      // Cute courier cat witnessing the romantic letter handover
      drawPixelCat(ctx, 18, 79, 'happy', t);

      handoverAnimId = requestAnimationFrame(loop);
    }
    loop();
  }

  // Populate letter paragraphs from data/letter.js (bilingual)
  renderLetter('id'); // default Indonesian
  SoundEngine.dreamyChime && SoundEngine.dreamyChime();

  // Language toggle handlers
  const btnLangId = document.getElementById('btn-letter-lang-id');
  const btnLangEn = document.getElementById('btn-letter-lang-en');

  if (btnLangId) {
    btnLangId.addEventListener('click', () => {
      renderLetter('id');
      btnLangId.classList.add('btn-primary'); btnLangId.classList.remove('btn-secondary');
      if (btnLangEn) { btnLangEn.classList.add('btn-secondary'); btnLangEn.classList.remove('btn-primary'); }
    });
  }
  if (btnLangEn) {
    btnLangEn.addEventListener('click', () => {
      renderLetter('en');
      btnLangEn.classList.add('btn-primary'); btnLangEn.classList.remove('btn-secondary');
      if (btnLangId) { btnLangId.classList.add('btn-secondary'); btnLangId.classList.remove('btn-primary'); }
    });
  }
}

function renderLetter(lang) {
  const letterBody = document.getElementById('letter-content-body');
  if (!letterBody || !BIRTHDAY_LETTER) return;
  const data = BIRTHDAY_LETTER[lang] || BIRTHDAY_LETTER.id;
  let html = `<p><strong>${data.salutation}</strong></p>`;
  data.paragraphs.forEach(p => {
    html += `<p>${p}</p>`;
  });
  const signOffLines = data.signOff.split(/\r?\n|\\n/);
  html += `<div class="letter-sign-off">${signOffLines.join('<br>')}<br><strong>— ${data.from}</strong></div>`;
  letterBody.innerHTML = html;
  // keep the scroll at top
  letterBody.scrollTop = 0;
}

/* ===================================================
   SCENE 7: THE GRAND EMOTIONAL CLIMAX HUG & EPILOGUE
   The sacred hug reserved exclusively for the finale climax!
   Multi-phase cinematic sequence:
   Phase 1: Walking toward each other slowly
   Phase 2: Face-to-face eye contact, blushing smiles
   Phase 3: Warm, tight embrace with radiant starlight aura
=================================================== */
function startScene7FinalHug() {
  SoundEngine.stopAmbientMusic && SoundEngine.stopAmbientMusic(1.5);
  const canvas = document.getElementById('final-hug-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;
  finalHugTimer = 0;
  finalBoyX = 40;
  finalGirlX = 190;
  finalSoundPlayed = false;

  const wishBox = document.getElementById('haven-star-wish');
  if (wishBox) wishBox.style.display = 'none';

  if (finalHugAnimId) cancelAnimationFrame(finalHugAnimId);

  function loop() {
    t += 0.5;
    finalHugTimer++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Floor platform
    ctx.fillStyle = '#2f0f4a';
    ctx.fillRect(20, 130, 220, 16);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(20, 130, 220, 3);

    // Haven Garden Flowers on platform edges
    drawPixelFlower(ctx, 28, 126, 'heart', t);
    drawPixelFlower(ctx, 42, 126, 'daisy', t);
    drawPixelFlower(ctx, 214, 126, 'tulip', t);
    drawPixelFlower(ctx, 228, 126, 'wildflower', t);

    // Cute Loaf Cat sleeping peacefully on haven platform
    drawPixelCat(ctx, 204, 115, 'loaf', t);

    // Drifting pastel starlight petals
    drawDriftingPetals(ctx, canvas.width, canvas.height, t);

    // Shooting star effect when wish is active
    if (wishBox && wishBox.style.display === 'block') {
      const shootProg = (t * 0.05) % 1;
      const sx = 30 + shootProg * 200;
      const sy = 15 + shootProg * 45;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 18, sy - 4);
      ctx.stroke();
    }

    if (finalHugTimer < 80) {
      // Phase 1: Walking toward each other slowly
      if (finalBoyX < 114) finalBoyX += 0.95;
      if (finalGirlX > 146) finalGirlX -= 0.6;

      drawStudentPixelChar(ctx, finalBoyX, 94, false, 'walk', t, 'shy');
      drawGirlfriendPixelChar(ctx, finalGirlX, 94, true, 'walk', t, 'shy');

    } else if (finalHugTimer < 140) {
      // Phase 2: Face to face, looking into each other's eyes with blushing smile
      finalBoyX = 114;
      finalGirlX = 146;

      drawStudentPixelChar(ctx, finalBoyX, 94, false, 'shy', t, 'heart');
      drawGirlfriendPixelChar(ctx, finalGirlX, 94, true, 'shy', t, 'heart');

      // Floating gentle heart between them
      ctx.fillStyle = '#f472b6';
      ctx.font = '13px sans-serif';
      ctx.fillText('♥', 128, 76 + Math.sin(t * 0.1) * 3);

    } else {
      // Phase 3: THE GRAND CLIMAX HUG
      if (!finalSoundPlayed) {
        SoundEngine.fanfare();
        finalSoundPlayed = true;
      }

      // Radiant pulsating starlight aura
      const auraPulse = Math.sin(t * 0.08) * 8;
      const gradient = ctx.createRadialGradient(130, 80, 5, 130, 80, 65 + auraPulse);
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      gradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.3)');
      gradient.addColorStop(1, 'rgba(244, 114, 182, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(130, 80, 65 + auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Couple in eternal warm hug
      drawCoupleHug(ctx, 116, 92, t);

      // Two faithful companion meme cats resting peacefully beside them on the seaside grass!
      drawPixelCat(ctx, 58, 112, 'loaf', t);
      drawPixelCat(ctx, 184, 112, 'happy', t);

      // Gentle wildflowers in the twilight haven
      drawPixelFlower(ctx, 32, 126, 'heart', t);
      drawPixelFlower(ctx, 226, 126, 'tulip', t);

      // Drifting pastel stars and heart petals
      for (let p = 0; p < 8; p++) {
        const py = 75 - ((t * 0.65 + p * 12) % 60);
        const px = 130 + Math.sin(t * 0.08 + p * 1.4) * (22 + p * 5);
        ctx.fillStyle = p % 2 === 0 ? '#f472b6' : '#fde047';
        ctx.font = '11px sans-serif';
        ctx.fillText(p % 3 === 0 ? '★' : '♥', px, py);
      }
    }

    finalHugAnimId = requestAnimationFrame(loop);
  }
  loop();
}

/* ===================================================
   FINALE EVENT BINDINGS & ORCHESTRATION
=================================================== */
export function initFinale() {
  // Scene 1: The Meeting
  setupButton('btn-meeting-approach', () => {
    meetingApproaching = true;
    SoundEngine.collect();
  });

  setupButton('btn-meeting-next', () => {
    if (meetingAnimId) cancelAnimationFrame(meetingAnimId);
    currentSceneName = 'finaleCling';
    showScreen('finaleCling');
    startScene2Cling();
  });

  // Scene 2: Cling & Hand-in-Hand
  setupButton('btn-cling-to-cake', () => {
    if (clingAnimId) cancelAnimationFrame(clingAnimId);
    currentSceneName = 'finaleCake';
    cakeCandlesLit = true;
    confettiActive = false;
    showScreen('finaleCake');
    initCake3DRenderer();
  });

  // Scene 3: Cake & Candles
  setupButton('btn-cake-blow', blowOutCandles);

  setupButton('btn-cake-mic', () => {
    const statusMsg = document.getElementById('mic-status-text');
    if (micListening) {
      if (statusMsg) statusMsg.textContent = 'Mikrofon dinonaktifkan.';
      micListening = false;
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      if (statusMsg) statusMsg.textContent = 'Meminta izin mikrofon...';
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        micStream = stream;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        micAudioCtx = new AudioContextClass();
        const micSource = micAudioCtx.createMediaStreamSource(stream);
        const analyser = micAudioCtx.createAnalyser();
        analyser.fftSize = 256;
        micSource.connect(analyser);

        micListening = true;
        if (statusMsg) statusMsg.textContent = '🎙️ Mikrofon aktif! Tiup mikrofonmu sekarang...';

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        function checkBlow() {
          if (!micListening || !cakeCandlesLit) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          if (avg > 55) {
            blowOutCandles();
            if (statusMsg) statusMsg.textContent = '✨ Tiupan terdeteksi! Lilin padam!';
            micListening = false;
          } else {
            requestAnimationFrame(checkBlow);
          }
        }
        checkBlow();
      }).catch(() => {
        if (statusMsg) statusMsg.textContent = 'Akses mic tidak tersedia. Silakan gunakan tombol TIUP LILIN ya!';
      });
    } else {
      if (statusMsg) statusMsg.textContent = 'Browser tidak mendukung mic. Silakan gunakan tombol di atas!';
    }
  });

  setupButton('btn-cake-to-speech', () => {
    confettiActive = false;
    SoundEngine.stopHappyBirthdaySong();
    if (cakeAnimId) cancelAnimationFrame(cakeAnimId);
    currentSceneName = 'finaleSpeech';
    showScreen('finaleSpeech');
    startScene4Speech();
  });

  // Scene 4: Speech
  setupButton('btn-speech-replay', () => {
    runSpeechTypewriter();
  });

  setupButton('btn-speech-to-video', () => {
    SoundEngine.stopHappyBirthdaySong();
    if (speechAnimId) cancelAnimationFrame(speechAnimId);
    if (speechTypewriterTimer) clearInterval(speechTypewriterTimer);
    currentSceneName = 'finaleVideo';
    showScreen('finaleVideo');
  });

  // Scene 5: Video Theater
  const video = document.getElementById('birthday-video');
  const mockup = document.getElementById('video-mockup-box');

  const markVideoHasSource = () => {
    if (video) video.classList.add('has-source');
    if (mockup) mockup.style.display = 'none';
  };

  if (video) {
    if (video.readyState >= 1) {
      markVideoHasSource();
    }
    video.addEventListener('loadedmetadata', markVideoHasSource);
    video.addEventListener('loadeddata', markVideoHasSource);
    video.addEventListener('canplay', markVideoHasSource);
    video.addEventListener('canplaythrough', markVideoHasSource);
    video.addEventListener('play', markVideoHasSource);
    video.load();
  }

  setupButton('btn-vid-play', () => {
    if (video) {
      markVideoHasSource();
      if (video.paused) {
        video.play().catch(e => console.log('Video play:', e));
      } else {
        video.pause();
      }
    }
  });

  setupButton('btn-vid-replay', () => {
    if (video) {
      markVideoHasSource();
      video.currentTime = 0;
      video.play().catch(e => console.log('Video replay:', e));
    }
  });

  setupButton('btn-vid-sound', (e) => {
    if (video) {
      video.muted = !video.muted;
      e.target.textContent = video.muted ? '🔇 BIKIN BERSUARA' : '🔊 SUARA AKTIF';
    }
  });

  setupButton('btn-to-letter', () => {
    if (video && !video.paused) video.pause();
    currentSceneName = 'finaleLetter';
    showScreen('finaleLetter');
    startScene6Letter();
  });

  // Scene 6: Letter -> Final Hug
  setupButton('btn-letter-to-hug', () => {
    if (handoverAnimId) cancelAnimationFrame(handoverAnimId);
    currentSceneName = 'finaleHug';
    showScreen('finaleHug');
    startScene7FinalHug();
  });

  // Scene 7: Final Hug Actions
  setupButton('btn-haven-wish', () => {
    const wishBox = document.getElementById('haven-star-wish');
    if (wishBox) {
      const isHidden = wishBox.style.display === 'none' || !wishBox.style.display;
      wishBox.style.display = isHidden ? 'block' : 'none';
      if (isHidden) {
        SoundEngine.star();
      }
    }
  });

  setupButton('btn-haven-letter', () => {
    if (finalHugAnimId) cancelAnimationFrame(finalHugAnimId);
    currentSceneName = 'finaleLetter';
    showScreen('finaleLetter');
    startScene6Letter();
  });

  setupButton('btn-replay-adventure', () => {
    if (finalHugAnimId) cancelAnimationFrame(finalHugAnimId);
    if (onReplayAdventureCallback) {
      onReplayAdventureCallback();
    }
  });

  setupButton('btn-return-menu', () => {
    if (finalHugAnimId) cancelAnimationFrame(finalHugAnimId);
    SoundEngine.stopAmbientMusic && SoundEngine.stopAmbientMusic(1.0);
    setTimeout(() => { SoundEngine.startAmbientMusic && SoundEngine.startAmbientMusic('landing'); }, 1200);
    showScreen('landing');
  });
}
