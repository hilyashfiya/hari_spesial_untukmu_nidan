/* ===================================================
   ROOM 2: LITTLE THINGS, BIG MEMORIES — NIDAN & JINAN
   Theme: Pantai Santai, Nobar LDR, Video Call & Meme Kucing
   Gameplay: Interactive Timing Sync & Meme Cat Exploration
   Distance: 850 km
   Player Two, Forever 💜
=================================================== */

export const ROOM_2_CONFIG = {
  id: 1,
  name: "LITTLE THINGS, BIG MEMORIES",
  subtitle: "“Dari DM pertama, nobar bareng di pantai, sampai pose muntah kucing saat video call!”",
  badge: "CHAPTER 2 • NOBAR PANTAI & MEME KUCING",
  theme: "playful-beach",
  distanceKm: 850,
  canSwitch: false,
  spawnX: 50, spawnY: 370,
  checkpoint: { x: 100, y: 390 },

  // Jinan awaits at the beach gazebo
  girlPost: { x: 1080, y: 384, facingLeft: true, label: "Gazebo Pantai Kenangan Jinan" },

  platforms: [
    // Sandy beach shoreline
    { x: 0,    y: 420, w: 280, h: 30, col: '#d97706', border: '#fde047' },
    { x: 340,  y: 420, w: 460, h: 30, col: '#d97706', border: '#fde047' },
    { x: 880,  y: 420, w: 320, h: 30, col: '#d97706', border: '#fde047' },
    // Wooden beach piers & palm tree canopies
    { x: 180,  y: 350, w: 120, h: 18, col: '#78350f', border: '#b45309' },
    { x: 340,  y: 280, w: 130, h: 18, col: '#78350f', border: '#b45309' },
    { x: 520,  y: 215, w: 150, h: 18, col: '#0284c7', border: '#38bdf8' }, // Nobar Cinema Terrace!
    { x: 740,  y: 165, w: 130, h: 18, col: '#78350f', border: '#b45309' },
    { x: 930,  y: 260, w: 120, h: 18, col: '#78350f', border: '#b45309' }
  ],

  collectibles: [
    {
      type: 'nobar',
      x: 240, y: 315,
      id: 0,
      icon: '🎬',
      title: 'Tiket Nobar Jarak Jauh',
      desc: 'Momen nonton film bersama dari kejauhan lewat layar laptop kita. Sederhana banget tapi rasanya super spesial karena kesempatan nobar kayak gini gak selalu ada di tengah padatnya kuliah!'
    },
    {
      type: 'catMeme',
      x: 590, y: 175,
      id: 1,
      catType: 'muntah',
      icon: '🐱',
      title: 'Kucing Pose Muntah Pelangi',
      desc: 'Kebiasaan kocak saat video call: tiba-tiba salah satu dari kita pasang pose "muntah kucing" yang legendaris sampai bikin ngakak sakit perut, mwehehe!'
    },
    {
      type: 'catMeme',
      x: 990, y: 220,
      id: 2,
      catType: 'dance',
      icon: '😹',
      title: 'Kucing Joget Absurd & DM Pertama',
      desc: 'Joget absurd tanpa musik pas video call larut malam. Mengingatkan momen DM pertama Nidan yang berani menyapa Jinan setelah bertahun-tahun!'
    }
  ],

  stars: [
    { x: 405, y: 245 },
    { x: 760, y: 130 },
    { x: 1040, y: 385 }
  ],

  springs: [
    { x: 360, y: 270, w: 26, h: 10 },
    { x: 540, y: 205, w: 26, h: 10 }
  ],

  movingPlatforms: [
    { x: 670, y: 330, w: 90, h: 16, col: '#0369a1', border: '#38bdf8', dx: 1.2, minX: 660, maxX: 850 }
  ],

  gate: { x: 1080, y: 380, label: 'DERMAGA SAMUDRA • 320 KM' }
};
