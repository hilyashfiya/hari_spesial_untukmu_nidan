/* ===================================================
   KEYBOARD & TOUCH CONTROLS MODULE
   Supports Dual-Character Switch (Q / Tab) & Interact (E)
   Player Two, Forever 💜
=================================================== */

export const keys = {};
export const touchControls = { left: false, right: false, jump: false };

let onEscapePressCallback = null;
let onSwitchPressCallback = null;
let onInteractPressCallback = null;

export function setOnEscapePress(cb) {
  onEscapePressCallback = cb;
}

export function setOnSwitchPress(cb) {
  onSwitchPressCallback = cb;
}

export function setOnInteractPress(cb) {
  onInteractPressCallback = cb;
}

function bindTouch(id, prop) {
  const el = document.getElementById(id);
  if (!el) return;

  function setVal(val) {
    touchControls[prop] = val;
    el.classList.toggle('pressed', val);
  }

  el.addEventListener('touchstart', (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVal(true);
  }, { passive: false });

  el.addEventListener('touchend', (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVal(false);
  }, { passive: false });

  el.addEventListener('touchcancel', (e) => {
    e.stopPropagation();
    e.preventDefault();
    setVal(false);
  }, { passive: false });

  el.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    setVal(true);
  });

  el.addEventListener('mouseup', (e) => {
    e.stopPropagation();
    setVal(false);
  });

  el.addEventListener('mouseleave', () => {
    setVal(false);
  });
}

export function initControls() {
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;

    // Character Switch key (Q or Tab)
    if (e.code === 'KeyQ' || e.code === 'Tab') {
      e.preventDefault();
      if (onSwitchPressCallback) onSwitchPressCallback();
    }

    // Interact key (E)
    if (e.code === 'KeyE') {
      e.preventDefault();
      if (onInteractPressCallback) onInteractPressCallback();
    }

    // Pause key (Escape)
    if (e.code === 'Escape') {
      if (onEscapePressCallback) onEscapePressCallback();
    }

    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  // Touch controls
  bindTouch('tc-left', 'left');
  bindTouch('tc-right', 'right');
  bindTouch('tc-jump', 'jump');

  // Mobile Character Switch button
  const touchSwitch = document.getElementById('tc-char-switch');
  if (touchSwitch) {
    touchSwitch.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (onSwitchPressCallback) onSwitchPressCallback();
    }, { passive: false });

    touchSwitch.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (onSwitchPressCallback) onSwitchPressCallback();
    });
  }
}
