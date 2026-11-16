/* ===================================================
   AUDIO SYSTEM & MUSIC ENGINE — PLAYER TWO, FOREVER 💝
   High-Fidelity Dual-Engine Audio Architecture:
   1. Real Instrumental Audio Player (Streams assets/audio/*.mp3 with crossfade)
   2. Melodic Music-Box Procedural Synthesizer (Zero-dependency offline fallback)
   
   Features:
   - Independent BGM and SFX volume routing
   - Calibrated for crystal-clear playback on laptop speakers & mobile devices
   - Natural melodic progressions with harmonic warmth (no abrasive drones)
   - Smooth crossfading between scenes & rooms
   - Safe autoplay handling with user-interaction unlock
=================================================== */

let audioCtx = null;
let masterGain = null;
let bgmGain = null;
let sfxGain = null;

let isMuted = false;
let masterVolume = 0.85;
let bgmVolume = 0.70;
let sfxVolume = 0.75;

// Music Engine State
let currentTrackId = null;
let currentHtml5Audio = null;
let isSynthesizerActive = false;
let synthSequenceTimer = null;
let synthActiveNodes = [];
let synthTrackGain = null;
let happyBirthdayTimeouts = [];
let happyBirthdayPlaying = false;

// Audio File Registry (for optional real MP3/OGG drops in assets/audio/)
const TRACK_AUDIO_FILES = {
  'landing':  'assets/audio/opening.mp3',
  'room1':    'assets/audio/room1.mp3',
  'room2':    'assets/audio/room2.mp3',
  'room3':    'assets/audio/room3.mp3',
  'room4':    'assets/audio/room4.mp3',
  'finale':   'assets/audio/finale.mp3',
  'letter':   'assets/audio/letter.mp3',
  'epilogue': 'assets/audio/epilogue.mp3',
};

/**
 * Initialize Web Audio Context and audio routing graph
 */
function initCtx() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      // BGM Gain
      bgmGain = audioCtx.createGain();
      bgmGain.gain.setValueAtTime(bgmVolume, audioCtx.currentTime);
      bgmGain.connect(masterGain);

      // SFX Gain
      sfxGain = audioCtx.createGain();
      sfxGain.gain.setValueAtTime(sfxVolume, audioCtx.currentTime);
      sfxGain.connect(masterGain);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// User-interaction unlock helper for browsers with strict autoplay
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    initCtx();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
}

/**
 * Play a synthesized sound effect routed to sfxGain
 */
function playTone(freq, type, duration, startVol, endVol) {
  if (isMuted) return;
  initCtx();
  if (!audioCtx || !sfxGain) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    const baseVol = (startVol !== undefined ? startVol : 0.18);
    gain.gain.setValueAtTime(baseVol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(endVol || 0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Graceful fallback
  }
}

/* ===================================================
   MELODIC PROCEDURAL INSTRUMENTAL COMPOSITIONS
   Frequencies optimized for laptop speaker audibility (350Hz - 1400Hz).
   Each note rings out like an acoustic music-box / kalimba bell with natural decay.
=================================================== */

// Note Frequency Table (Hz)
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.00, Bb5: 932.33, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
};

// Distinct Musical Compositions per Room
const COMPOSITIONS = {
  // 1. Landing / Opening: "Dreamy Starlight" (Warm Cmaj7 celestial chime, gentle 86 BPM)
  'landing': {
    bpm: 88,
    bars: [
      // Bar 1: Cmaj7
      { chord: [N.C4, N.E4, N.G4], melody: [[0, N.G5, 1.2], [0.5, N.E5, 0.8], [1.0, N.B4, 1.0], [1.5, N.C5, 1.5]] },
      // Bar 2: Fmaj7
      { chord: [N.F3, N.A4, N.C5], melody: [[0, N.A5, 1.2], [0.5, N.C5, 0.8], [1.0, N.E5, 1.0], [1.5, N.G5, 1.5]] },
      // Bar 3: Em7
      { chord: [N.E3, N.G4, N.B4], melody: [[0, N.G5, 1.0], [0.5, N.B4, 0.8], [1.0, N.E5, 1.0], [1.5, N.D5, 1.2]] },
      // Bar 4: Gsus4 -> G
      { chord: [N.G3, N.D4, N.G4], melody: [[0, N.C5, 0.9], [0.5, N.B4, 0.9], [1.0, N.G4, 1.0], [1.5, N.D5, 1.6]] },
    ]
  },

  // 2. Room 1: "Schoolyard Nostalgia" (Sweet pentatonic music box, reflective 92 BPM)
  'room1': {
    bpm: 92,
    bars: [
      // Bar 1: G Major
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.D5, 1.0], [0.5, N.B4, 0.7], [1.0, N.G4, 0.9], [1.5, N.A4, 1.0]] },
      // Bar 2: D/F#
      { chord: [N.D3, N.A4, N.Fs5], melody: [[0, N.Fs5, 1.0], [0.5, N.A4, 0.7], [1.0, N.D5, 0.9], [1.5, N.E5, 1.0]] },
      // Bar 3: Em
      { chord: [N.E3, N.G4, N.B4], melody: [[0, N.G5, 1.1], [0.5, N.E5, 0.8], [1.0, N.D5, 0.8], [1.5, N.B4, 1.0]] },
      // Bar 4: C Major
      { chord: [N.C4, N.E4, N.G4], melody: [[0, N.C5, 1.2], [0.5, N.D5, 0.8], [1.0, N.E5, 1.0], [1.5, N.G5, 1.6]] },
    ]
  },

  // 3. Room 2: "Coastal Boardwalk & Playful Cats" (Bouncy, cheerful swing waltz, 106 BPM)
  'room2': {
    bpm: 106,
    bars: [
      // Bar 1: F Major
      { chord: [N.F3, N.A4, N.C5], melody: [[0, N.C5, 0.6], [0.5, N.F5, 0.7], [1.0, N.A5, 0.9], [1.5, N.F5, 0.6]] },
      // Bar 2: Bb Major
      { chord: [N.Bb4, N.D5, N.F5], melody: [[0, N.D5, 0.7], [0.5, N.F5, 0.7], [1.0, N.Bb5, 1.0], [1.5, N.A5, 0.6]] },
      // Bar 3: C Major
      { chord: [N.C4, N.G4, N.E5], melody: [[0, N.G5, 0.7], [0.5, N.E5, 0.6], [1.0, N.C5, 0.8], [1.5, N.D5, 0.7]] },
      // Bar 4: F Major turnaround
      { chord: [N.F3, N.C4, N.A4], melody: [[0, N.F5, 1.1], [0.5, N.A5, 0.8], [1.0, N.G5, 0.8], [1.5, N.F5, 1.2]] },
    ]
  },

  // 4. Room 3: "Ocean Breeze Highway" (Forward-cruising rolling arpeggios, 116 BPM)
  'room3': {
    bpm: 116,
    bars: [
      // Bar 1: D Major
      { chord: [N.D3, N.A4, N.Fs5], melody: [[0, N.A4, 0.6], [0.33, N.D5, 0.6], [0.66, N.Fs5, 0.8], [1.0, N.A5, 1.0], [1.5, N.Fs5, 0.7]] },
      // Bar 2: A Major
      { chord: [N.A3, N.E4, N.Cs5 || N.E5], melody: [[0, N.E4, 0.6], [0.33, N.A4, 0.6], [0.66, N.E5, 0.8], [1.0, N.G5, 0.9], [1.5, N.E5, 0.7]] },
      // Bar 3: Bm
      { chord: [N.B3, N.Fs4, N.D5], melody: [[0, N.Fs4, 0.6], [0.33, N.B4, 0.6], [0.66, N.D5, 0.8], [1.0, N.Fs5, 1.0], [1.5, N.D5, 0.7]] },
      // Bar 4: G Major
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.D4, 0.6], [0.33, N.G4, 0.6], [0.66, N.B4, 0.8], [1.0, N.D5, 1.2], [1.5, N.G5, 1.4]] },
    ]
  },

  // 5. Room 4: "Starry Mountain Campfire" (Cozy warm acoustic night embers, 88 BPM)
  'room4': {
    bpm: 88,
    bars: [
      // Bar 1: Am
      { chord: [N.A3, N.E4, N.C5], melody: [[0, N.E5, 1.2], [0.5, N.C5, 0.8], [1.0, N.A4, 1.0], [1.5, N.B4, 1.2]] },
      // Bar 2: F
      { chord: [N.F3, N.C4, N.A4], melody: [[0, N.C5, 1.1], [0.5, N.A4, 0.8], [1.0, N.F4, 0.9], [1.5, N.G4, 1.1]] },
      // Bar 3: C
      { chord: [N.C4, N.G4, N.E5], melody: [[0, N.G5, 1.2], [0.5, N.E5, 0.8], [1.0, N.D5, 0.8], [1.5, N.C5, 1.2]] },
      // Bar 4: G
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.D5, 1.0], [0.5, N.B4, 0.8], [1.0, N.G4, 1.0], [1.5, N.D5, 1.5]] },
    ]
  },

  // 6. Birthday Finale / Cake: "Joyful Celebration" (Festive music box, 96 BPM)
  'finale': {
    bpm: 96,
    bars: [
      // Bar 1: Happy birthday phrase 1
      { chord: [N.C4, N.G4, N.E5], melody: [[0, N.C5, 0.4], [0.25, N.C5, 0.4], [0.5, N.D5, 0.8], [1.0, N.C5, 0.8], [1.5, N.F5, 1.2]] },
      // Bar 2: Happy birthday phrase 2
      { chord: [N.F3, N.A4, N.C5], melody: [[0, N.E5, 1.4], [0.75, N.C5, 0.4], [1.0, N.C5, 0.4], [1.25, N.D5, 0.8], [1.75, N.C5, 0.8]] },
      // Bar 3: phrase 3
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.G5, 1.2], [0.5, N.F5, 1.4], [1.25, N.C5, 0.4], [1.5, N.C5, 0.4], [1.75, N.C6, 0.8]] },
      // Bar 4: celebration peak
      { chord: [N.C4, N.E4, N.G4], melody: [[0, N.A5, 0.9], [0.5, N.F5, 0.9], [1.0, N.E5, 0.9], [1.5, N.D5, 1.6]] },
    ]
  },

  // 7. Letter & Epilogue: "Dear Nidan" — Romantic soft piano letter theme (60 BPM, slow & tender)
  'letter': {
    bpm: 60,
    bars: [
      // Intro phrase — C major, rising tender melody
      { chord: [N.C4, N.G4, N.E5], melody: [[0, N.E5, 1.8], [0.6, N.G5, 1.5], [1.2, N.A5, 2.0], [1.8, N.G5, 1.6]] },
      // Am — longing
      { chord: [N.A3, N.E4, N.C5], melody: [[0, N.E5, 1.6], [0.5, N.C5, 1.4], [1.0, N.A4, 1.8], [1.6, N.B4, 1.5]] },
      // F major — warmth
      { chord: [N.F3, N.C4, N.A4], melody: [[0, N.F5, 1.6], [0.5, N.A5, 1.4], [1.0, N.G5, 1.8], [1.5, N.F5, 1.5]] },
      // G — resolution reaching home
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.D5, 1.6], [0.6, N.B4, 1.4], [1.2, N.C5, 2.2], [1.8, N.E5, 1.8]] },
      // C again — return, peace
      { chord: [N.C4, N.G4, N.E5], melody: [[0, N.G5, 1.8], [0.6, N.E5, 1.5], [1.2, N.D5, 1.6], [1.8, N.C5, 2.5]] },
      // Am — emotional peak
      { chord: [N.A3, N.E4, N.C5], melody: [[0, N.A5, 2.0], [0.7, N.G5, 1.5], [1.4, N.E5, 2.0]] },
      // F
      { chord: [N.F3, N.A4, N.C5], melody: [[0, N.F5, 1.6], [0.5, N.E5, 1.4], [1.0, N.D5, 1.6], [1.6, N.C5, 1.5]] },
      // G — fade resolve
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.B4, 1.6], [0.6, N.D5, 1.6], [1.2, N.G5, 2.4]] },
    ]
  },

  'epilogue': {
    bpm: 72,
    bars: [
      { chord: [N.C4, N.E4, N.G4], melody: [[0, N.C5, 1.4], [0.5, N.E5, 1.2], [1.0, N.G5, 1.6], [1.5, N.C6, 1.8]] },
      { chord: [N.F3, N.A4, N.C5], melody: [[0, N.A5, 1.4], [0.5, N.C6, 1.2], [1.0, N.F5, 1.5], [1.5, N.E5, 1.4]] },
      { chord: [N.E3, N.G4, N.B4], melody: [[0, N.G5, 1.4], [0.5, N.B5, 1.2], [1.0, N.E5, 1.5], [1.5, N.D5, 1.4]] },
      { chord: [N.G3, N.D4, N.B4], melody: [[0, N.D5, 1.2], [0.5, N.G5, 1.2], [1.0, N.B4, 1.4], [1.5, N.C5, 2.2]] },
    ]
  }
};

/**
 * Play a music-box acoustic bell note (triangle body + sine overtone)
 */
function playBellNote(ctx, destGain, freq, time, duration, volume = 0.22) {
  if (!ctx || !destGain || !freq) return;

  try {
    // 1. Warm Triangle Body
    const oscBody = ctx.createOscillator();
    const gainBody = ctx.createGain();
    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(freq, time);

    gainBody.gain.setValueAtTime(0, time);
    gainBody.gain.linearRampToValueAtTime(volume * 0.8, time + 0.015);
    gainBody.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.85);

    // Warm Low-Pass Filter to eliminate harsh frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);

    oscBody.connect(filter);
    filter.connect(gainBody);
    gainBody.connect(destGain);

    oscBody.start(time);
    oscBody.stop(time + duration * 0.85);

    // 2. Crystalline Bell Chime Overtone (2x octave harmonic, decaying quickly)
    const oscChime = ctx.createOscillator();
    const gainChime = ctx.createGain();
    oscChime.type = 'sine';
    oscChime.frequency.setValueAtTime(freq * 2, time);

    gainChime.gain.setValueAtTime(0, time);
    gainChime.gain.linearRampToValueAtTime(volume * 0.35, time + 0.008);
    gainChime.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.45);

    oscChime.connect(gainChime);
    gainChime.connect(destGain);

    oscChime.start(time);
    oscChime.stop(time + duration * 0.45);

    synthActiveNodes.push(oscBody, oscChime);
  } catch (e) {}
}

/**
 * Play a soft chord pad (warm background wash)
 */
function playChordPad(ctx, destGain, freqArray, time, duration, volume = 0.08) {
  if (!ctx || !destGain || !freqArray) return;
  freqArray.forEach((freq, idx) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(gain);
      gain.connect(destGain);
      osc.start(time);
      osc.stop(time + duration);

      synthActiveNodes.push(osc);
    } catch (e) {}
  });
}

/**
 * Start the procedural melodic instrumental synthesizer loop
 */
function startProceduralSynth(trackId) {
  stopProceduralSynth(0.5);
  initCtx();
  if (!audioCtx || !bgmGain) return;

  const comp = COMPOSITIONS[trackId] || COMPOSITIONS['landing'];
  if (!comp) return;

  isSynthesizerActive = true;
  synthTrackGain = audioCtx.createGain();
  synthTrackGain.gain.setValueAtTime(0, audioCtx.currentTime);
  // Letter track fades in gently over 2.5s for romantic entrance
  const fadeInDur = (trackId === 'letter') ? 2.5 : 1.2;
  synthTrackGain.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + fadeInDur);
  synthTrackGain.connect(bgmGain);

  const secondsPerBeat = 60 / comp.bpm;
  const barDuration = secondsPerBeat * 2.0; // 2 beats per mini bar
  let currentBarIdx = 0;

  function scheduleNextBar() {
    if (!isSynthesizerActive || !audioCtx) return;

    const now = audioCtx.currentTime;
    const bar = comp.bars[currentBarIdx];

    // Schedule Chord Pad — softer for letter track
    const padVol = (trackId === 'letter') ? 0.045 : 0.07;
    playChordPad(audioCtx, synthTrackGain, bar.chord, now + 0.05, barDuration * 1.05, padVol);

    // Schedule Melody Notes — use warmer volume for letter track
    const noteVol = (trackId === 'letter') ? 0.18 : 0.22;
    bar.melody.forEach(([offsetBeat, freq, dur]) => {
      const noteTime = now + 0.05 + offsetBeat * secondsPerBeat;
      playBellNote(audioCtx, synthTrackGain, freq, noteTime, dur * secondsPerBeat * 1.3, noteVol);
    });

    currentBarIdx = (currentBarIdx + 1) % comp.bars.length;
    synthSequenceTimer = setTimeout(scheduleNextBar, (barDuration - 0.05) * 1000);
  }

  scheduleNextBar();
}

/**
 * Stop the procedural melodic synthesizer with smooth fade
 */
function stopProceduralSynth(fadeDuration = 1.0) {
  isSynthesizerActive = false;
  if (synthSequenceTimer) {
    clearTimeout(synthSequenceTimer);
    synthSequenceTimer = null;
  }
  if (synthTrackGain && audioCtx) {
    try {
      synthTrackGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + fadeDuration);
    } catch (e) {}
  }
  setTimeout(() => {
    synthActiveNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
      try { node.disconnect(); } catch (e) {}
    });
    synthActiveNodes = [];
    if (synthTrackGain) {
      try { synthTrackGain.disconnect(); } catch (e) {}
      synthTrackGain = null;
    }
  }, fadeDuration * 1000 + 100);
}

/* ===================================================
   PUBLIC SOUND ENGINE API
=================================================== */
export const SoundEngine = {
  init: initCtx,

  // --- Volume & Mute Controls ---
  toggleMute() {
    isMuted = !isMuted;
    initCtx();
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(isMuted ? 0 : masterVolume, audioCtx.currentTime);
    }
    if (currentHtml5Audio) {
      currentHtml5Audio.muted = isMuted;
    }

    const btn = document.getElementById('btn-sound-toggle');
    if (btn) btn.textContent = isMuted ? '🔇 MUTE' : '🔊 SUARA';
    const pauseSoundBtn = document.getElementById('btn-pause-sound-toggle');
    if (pauseSoundBtn) pauseSoundBtn.textContent = isMuted ? '🔇 SUARA: NONAKTIF' : '🔊 SUARA: AKTIF';

    return isMuted;
  },

  isMuted() {
    return isMuted;
  },

  setMasterVolume(vol) {
    masterVolume = Math.max(0, Math.min(1, vol));
    initCtx();
    if (masterGain && audioCtx && !isMuted) {
      masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    }
  },

  getMasterVolume() {
    return masterVolume;
  },

  setBgmVolume(vol) {
    bgmVolume = Math.max(0, Math.min(1, vol));
    initCtx();
    if (bgmGain && audioCtx) {
      bgmGain.gain.setValueAtTime(bgmVolume, audioCtx.currentTime);
    }
    if (currentHtml5Audio) {
      currentHtml5Audio.volume = bgmVolume;
    }
  },

  getBgmVolume() {
    return bgmVolume;
  },

  setSfxVolume(vol) {
    sfxVolume = Math.max(0, Math.min(1, vol));
    initCtx();
    if (sfxGain && audioCtx) {
      sfxGain.gain.setValueAtTime(sfxVolume, audioCtx.currentTime);
    }
  },

  getSfxVolume() {
    return sfxVolume;
  },

  // --- Background Music Orchestration ---
  /**
   * Start background music with crossfade.
   * Plays local assets/audio/<trackId>.mp3 if available,
   * otherwise seamlessly runs the procedural music-box synthesizer.
   */
  startMusic(trackId) {
    if (currentTrackId === trackId) return;
    this.stopMusic(1.0);
    currentTrackId = trackId;

    if (isMuted) return;
    initCtx();

    const audioFilePath = TRACK_AUDIO_FILES[trackId];
    if (audioFilePath) {
      // Attempt HTML5 Audio first
      const audio = new Audio();
      audio.src = audioFilePath;
      audio.loop = true;
      audio.volume = 0;

      let played = false;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.then(() => {
          // File found and browser allowed playback!
          played = true;
          currentHtml5Audio = audio;
          // Smooth fade in HTML5 audio
          let fadeVol = 0;
          const targetVol = bgmVolume;
          const fadeSteps = 20;
          const stepTime = 100; // 2.0s romantic fade-in
          const volStep = targetVol / fadeSteps;
          const fadeInterval = setInterval(() => {
            fadeVol += volStep;
            if (fadeVol >= targetVol) {
              audio.volume = targetVol;
              clearInterval(fadeInterval);
            } else {
              audio.volume = Math.min(targetVol, fadeVol);
            }
          }, stepTime);
        }).catch(() => {
          // File not found or blocked
          if (!played) {
            // For the letter track, user explicitly instructed not to use synthetic fallback:
            if (trackId === 'letter') {
              console.info('[SoundEngine] assets/audio/letter.mp3 belum tersedia. Synthetic fallback dinonaktifkan.');
            } else {
              startProceduralSynth(trackId);
            }
          }
        });
      } else {
        if (trackId === 'letter') {
          console.info('[SoundEngine] assets/audio/letter.mp3 belum tersedia. Synthetic fallback dinonaktifkan.');
        } else {
          startProceduralSynth(trackId);
        }
      }
    } else {
      if (trackId === 'letter') {
        console.info('[SoundEngine] assets/audio/letter.mp3 belum tersedia. Synthetic fallback dinonaktifkan.');
      } else {
        startProceduralSynth(trackId);
      }
    }
  },

  stopMusic(fadeDuration = 1.0) {
    // Fade out HTML5 audio if active
    if (currentHtml5Audio) {
      const audioToStop = currentHtml5Audio;
      currentHtml5Audio = null;
      let curVol = audioToStop.volume;
      const step = curVol / 10;
      const fadeInterval = setInterval(() => {
        curVol -= step;
        if (curVol <= 0.01) {
          audioToStop.pause();
          audioToStop.currentTime = 0;
          clearInterval(fadeInterval);
        } else {
          audioToStop.volume = curVol;
        }
      }, (fadeDuration * 1000) / 10);
    }

    // Fade out procedural synth
    stopProceduralSynth(fadeDuration);
    currentTrackId = null;
  },

  // Aliases for compatibility
  startAmbientMusic(roomId) {
    this.startMusic(roomId);
  },

  stopAmbientMusic(fadeDuration) {
    this.stopMusic(fadeDuration);
  },

  // --- Sound Effects Suite ---
  jump() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(170, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.13);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.13);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {}
  },

  spring() {
    playTone(260, 'sine', 0.22, 0.20, 0.001);
    setTimeout(() => { playTone(520, 'sine', 0.18, 0.16, 0.001); }, 60);
  },

  collect() {
    playTone(523.25, 'triangle', 0.1, 0.20, 0.01);
    setTimeout(() => { playTone(659.25, 'triangle', 0.18, 0.20, 0.001); }, 70);
  },

  star() {
    playTone(880, 'sine', 0.12, 0.18, 0.01);
    setTimeout(() => { playTone(1174.66, 'sine', 0.22, 0.20, 0.001); }, 80);
  },

  milestone() {
    playTone(440, 'triangle', 0.15, 0.22, 0.02);
    setTimeout(() => { playTone(554.37, 'triangle', 0.15, 0.22, 0.02); }, 90);
    setTimeout(() => { playTone(659.25, 'triangle', 0.25, 0.25, 0.001); }, 180);
  },

  gateOpen() {
    [392, 493.88, 587.33, 783.99].forEach((freq, i) => {
      setTimeout(() => { playTone(freq, 'triangle', 0.2, 0.18, 0.005); }, i * 90);
    });
  },

  candleBlow() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.45;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.18;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(140, audioCtx.currentTime + 0.45);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.24, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGain);
      whiteNoise.start();
    } catch (e) {}
  },

  fanfare() {
    const notes = [523.25, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const times = [0, 120, 240, 360, 480, 600, 750];
    notes.forEach((n, i) => {
      setTimeout(() => { playTone(n, 'triangle', 0.25, 0.22, 0.005); }, times[i]);
    });
  },

  psBootChime() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx) return;
    const freqs = [130.81, 196.00, 261.63, 329.63, 392.00, 523.25, 659.25];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        playTone(f, 'sine', 1.8, 0.12, 0.0001);
      }, i * 110);
    });
    setTimeout(() => {
      playTone(1046.5, 'triangle', 2.0, 0.18, 0.0001);
    }, 850);
  },

  noiseGlitch() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.setValueAtTime(240, audioCtx.currentTime + 0.06);
      osc.frequency.setValueAtTime(60, audioCtx.currentTime + 0.12);
      osc.frequency.setValueAtTime(320, audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  },

  retrySound() {
    playTone(330, 'triangle', 0.15, 0.18, 0.01);
    setTimeout(() => { playTone(440, 'triangle', 0.15, 0.18, 0.01); }, 80);
    setTimeout(() => { playTone(587.33, 'triangle', 0.3, 0.22, 0.001); }, 160);
  },

  catMeow() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(820, audioCtx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.32);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  },

  engineRev() {
    playTone(110, 'sawtooth', 0.18, 0.12, 0.005);
  },

  cardFlip() {
    playTone(620, 'sine', 0.06, 0.14, 0.001);
    setTimeout(() => { playTone(940, 'triangle', 0.06, 0.12, 0.001); }, 35);
  },

  cardMatch() {
    playTone(523.25, 'triangle', 0.12, 0.20, 0.01); // C5
    setTimeout(() => { playTone(659.25, 'triangle', 0.12, 0.20, 0.01); }, 80); // E5
    setTimeout(() => { playTone(783.99, 'triangle', 0.22, 0.24, 0.001); }, 160); // G5
  },

  cardMismatch() {
    playTone(293.66, 'sine', 0.12, 0.14, 0.01); // D4
    setTimeout(() => { playTone(233.08, 'sine', 0.18, 0.12, 0.001); }, 90); // Bb3
  },

  diceRoll() {
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        const f = 340 + Math.random() * 120;
        playTone(f, 'triangle', 0.04, 0.16, 0.001);
      }, i * 45);
    }
  },

  pionStep() {
    playTone(349.23, 'triangle', 0.06, 0.16, 0.001);
  },

  ladderClimb() {
    const ladderNotes = [261.63, 329.63, 392.00, 523.25, 659.25];
    ladderNotes.forEach((f, i) => {
      setTimeout(() => {
        playTone(f, 'triangle', 0.1, 0.20, 0.005);
      }, i * 65);
    });
  },

  snakeSlide() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220.00, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  },

  heartPickup() {
    playTone(880.00, 'sine', 0.08, 0.20, 0.01);
    setTimeout(() => { playTone(1318.51, 'sine', 0.18, 0.22, 0.001); }, 60);
  },

  bumpSoft() {
    playTone(130.81, 'sine', 0.12, 0.18, 0.001);
  },

  eatItem() {
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !sfxGain) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {}
  },

  snakeGrow() {
    playTone(523.25, 'triangle', 0.08, 0.16, 0.01);
    setTimeout(() => { playTone(659.25, 'triangle', 0.14, 0.18, 0.001); }, 70);
  },

  dreamyChime() {
    const harpNotes = [739.99, 932.33, 1108.73, 1479.98];
    harpNotes.forEach((f, i) => {
      setTimeout(() => {
        playTone(f, 'sine', 0.6, 0.18, 0.0001);
      }, i * 90);
    });
  },

  playHappyBirthdaySong() {
    this.stopHappyBirthdaySong();
    if (isMuted) return;
    initCtx();
    if (!audioCtx || !bgmGain) return;

    happyBirthdayPlaying = true;
    const melody = [
      [261.63, 0.25], [261.63, 0.25], [293.66, 0.50], [261.63, 0.50], [349.23, 0.50], [329.63, 0.95],
      [261.63, 0.25], [261.63, 0.25], [293.66, 0.50], [261.63, 0.50], [392.00, 0.50], [349.23, 0.95],
      [261.63, 0.25], [261.63, 0.25], [523.25, 0.50], [440.00, 0.50], [349.23, 0.50], [329.63, 0.50], [293.66, 0.85],
      [466.16, 0.25], [466.16, 0.25], [440.00, 0.50], [349.23, 0.50], [392.00, 0.50], [349.23, 1.20],
    ];

    let accumTime = 0;
    melody.forEach(([freq, dur]) => {
      const tId = setTimeout(() => {
        if (!happyBirthdayPlaying || isMuted) return;
        playTone(freq, 'triangle', dur * 0.9, 0.22, 0.002);
        playTone(freq * 0.5, 'sine', dur * 0.85, 0.10, 0.001);
      }, accumTime * 1000);
      happyBirthdayTimeouts.push(tId);
      accumTime += dur;
    });

    const loopTimer = setTimeout(() => {
      if (happyBirthdayPlaying && !isMuted) {
        this.playHappyBirthdaySong();
      }
    }, (accumTime + 1.2) * 1000);
    happyBirthdayTimeouts.push(loopTimer);
  },

  stopHappyBirthdaySong() {
    happyBirthdayPlaying = false;
    happyBirthdayTimeouts.forEach(t => clearTimeout(t));
    happyBirthdayTimeouts = [];
  }
};
