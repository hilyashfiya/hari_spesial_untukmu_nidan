/* ===================================================
   NAVIGATION & SCREEN MANAGER MODULE
   Player Two, Forever 💜
=================================================== */

const BASE_SCREEN_MAP = {
  landing:         'screen-landing',
  game:            'screen-game',
  finaleMeeting:   'screen-finale-meeting',
  finaleCling:     'screen-finale-cling',
  finaleCake:      'screen-finale-cake',
  finaleSpeech:    'screen-finale-speech',
  finaleVideo:     'screen-finale-video',
  finaleLetter:    'screen-finale-letter',
  finaleHug:       'screen-finale-hug'
};

const OVERLAY_SCREEN_MAP = {
  howto: 'screen-howto',
  pause: 'screen-pause'
};

let currentScreenName = 'landing';

export function showScreen(name) {
  // 1. Hide all overlays first
  Object.values(OVERLAY_SCREEN_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // 2. Switch base screen
  Object.entries(BASE_SCREEN_MAP).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (key === name) {
      el.classList.remove('hidden');
      currentScreenName = name;
    } else {
      el.classList.add('hidden');
    }
  });
}

export function showOverlay(name) {
  const id = OVERLAY_SCREEN_MAP[name];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}

export function hideOverlay(name) {
  const id = OVERLAY_SCREEN_MAP[name];
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

export function getCurrentScreen() {
  return currentScreenName;
}

/**
 * Robust Button click binder
 * - Validates element presence
 * - Prevents default form / link actions
 * - Stops bubbling to avoid unintended triggers
 */
export function setupButton(id, callback) {
  const btn = document.getElementById(id);
  if (!btn) {
    console.warn('[setupButton] Element not found with ID:', id);
    return null;
  }
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    callback(e);
  });
  return btn;
}

