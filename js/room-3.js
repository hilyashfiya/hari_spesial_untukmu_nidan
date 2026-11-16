/* ===================================================
   ROOM 3: THROUGH EVERY CHAPTER — NIDAN & JINAN
   Theme: Balapan Samudra LDR (Ocean Racing Mini-Game)
   Gameplay: High-Speed Racing & Distance Reduction
   Distance: 320 km -> 0 km
   Player Two, Forever 💜
=================================================== */

export const ROOM_3_CONFIG = {
  id: 2,
  name: "THROUGH EVERY CHAPTER",
  subtitle: "“Menembus ombak samudra dengan laju penuh, mendekatkan jarak LDR hingga 0 KM!”",
  badge: "CHAPTER 3 • SAMUDRA RACING MINI-GAME",
  theme: "ocean-racing",
  mode: "racing",
  distanceKm: 320,
  canSwitch: false,
  showBothInWorld: false,
  spawnX: 60, spawnY: 370,
  checkpoint: { x: 120, y: 390 },

  // Jinan awaits at the tropical finish line pier
  girlPost: { x: 1720, y: 384, facingLeft: true, label: "Garis Finish Pulau Jinan" },

  platforms: [
    // Starting pier
    { x: 0,    y: 420, w: 260, h: 30, col: '#78350f', border: '#b45309' },
    // Water racing tracks & ramps across the ocean
    { x: 300,  y: 420, w: 350, h: 30, col: '#0369a1', border: '#38bdf8' },
    { x: 690,  y: 420, w: 320, h: 30, col: '#0369a1', border: '#38bdf8' },
    { x: 1050, y: 420, w: 380, h: 30, col: '#0369a1', border: '#38bdf8' },
    { x: 1470, y: 420, w: 350, h: 30, col: '#78350f', border: '#b45309' }, // Finish island sand & pier

    // Upper elevated bypass piers & wave ramps
    { x: 220,  y: 350, w: 140, h: 18, col: '#0284c7', border: '#7dd3fc' },
    { x: 420,  y: 280, w: 150, h: 18, col: '#0284c7', border: '#7dd3fc' }, // High-speed ramp
    { x: 620,  y: 220, w: 160, h: 18, col: '#0284c7', border: '#7dd3fc' }, // Aerial speed bridge
    { x: 840,  y: 290, w: 140, h: 18, col: '#0284c7', border: '#7dd3fc' },
    { x: 1120, y: 320, w: 150, h: 18, col: '#0284c7', border: '#7dd3fc' },
    { x: 1340, y: 260, w: 130, h: 18, col: '#0284c7', border: '#7dd3fc' }
  ],

  // Speed Boost Pads along the track
  boostPads: [
    { x: 440, y: 276, w: 36, h: 6 },
    { x: 740, y: 416, w: 42, h: 6 },
    { x: 1180, y: 316, w: 40, h: 6 }
  ],

  collectibles: [
    {
      type: 'racingBeacon',
      x: 480, y: 240,
      id: 0,
      msg: '🚀 [BOOST 1] Kecepatan maksimal! Jarak terpangkas 120 KM! “Nidan, laju terus jangan kasih kendor!”'
    },
    {
      type: 'racingBeacon',
      x: 700, y: 180,
      id: 1,
      msg: '⚡ [BOOST 2] Gelombang laut terlewati! “Setiap kayuhan membawamu makin dekat ke pelukanku!”'
    },
    {
      type: 'racingBeacon',
      x: 1220, y: 280,
      id: 2,
      msg: '🏆 [BOOST 3] Garis finish di depan mata! Jarak LDR mencapai 0 KM — Kita bersatu di pulau yang sama!'
    }
  ],

  stars: [
    { x: 320, y: 385 },
    { x: 920, y: 250 },
    { x: 1580, y: 385 }
  ],

  springs: [
    { x: 400, y: 270, w: 26, h: 10 },
    { x: 1100, y: 310, w: 26, h: 10 }
  ],

  movingPlatforms: [
    { x: 970, y: 340, w: 80, h: 16, col: '#0284c7', border: '#38bdf8', dx: 1.5, minX: 960, maxX: 1100 }
  ],

  gate: { x: 1720, y: 380, label: 'PULAU IMPIAN • 0 KM BERSAMA' }
};
