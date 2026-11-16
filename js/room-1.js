/* ===================================================
   ROOM 1: WHERE IT ALL BEGAN — NIDAN & JINAN
   Theme: Nostalgia Sekolah (SD & Awal SMP) & Pohon Rindang
   Gameplay: Exploration & Clue Puzzle
   Distance: 1,500 km
   Player Two, Forever 💜
=================================================== */

export const ROOM_1_CONFIG = {
  id: 0,
  name: "WHERE IT ALL BEGAN",
  subtitle: "“Dari halaman sekolah yang asri, rasa penasaran itu mulai bersemi di bawah pohon rindang…”",
  badge: "CHAPTER 1 • NOSTALGIA SEKOLAH & CLUE EXPLORATION",
  theme: "sunny-schoolyard",
  distanceKm: 1500,
  spawnX: 50, spawnY: 370,
  checkpoint: { x: 100, y: 390 },

  // Jinan awaits at the school courtyard archway
  girlPost: { x: 1120, y: 384, facingLeft: true, label: "Gerbang Kenangan Sekolah" },
  
  platforms: [
    // Grassy schoolyard ground
    { x: 0,    y: 420, w: 320, h: 30, col: '#15803d', border: '#4ade80' },
    { x: 380,  y: 420, w: 420, h: 30, col: '#15803d', border: '#4ade80' },
    { x: 860,  y: 420, w: 340, h: 30, col: '#15803d', border: '#4ade80' },
    // Red brick school balconies & playground steps
    { x: 200,  y: 350, w: 120, h: 18, col: '#991b1b', border: '#f87171' },
    { x: 370,  y: 285, w: 130, h: 18, col: '#991b1b', border: '#f87171' },
    { x: 550,  y: 220, w: 140, h: 18, col: '#166534', border: '#86efac' }, // Shaded tree branch platform!
    { x: 740,  y: 275, w: 140, h: 18, col: '#991b1b', border: '#f87171' },
    { x: 920,  y: 340, w: 120, h: 18, col: '#991b1b', border: '#f87171' },
    // Secret treehouse terrace
    { x: 450,  y: 150, w: 150, h: 18, col: '#15803d', border: '#4ade80' }
  ],

  collectibles: [
    {
      type: 'clue',
      x: 260, y: 315,
      id: 0,
      title: 'Petunjuk 1: Buku Tulis & Bangku SD Kelas 3',
      desc: 'Di lorong sekolah dasar, ada anak cewek yang diam-diam suka banget merhatiin seorang anak laki-laki dari kejauhan. Masih malu-malu dan belum berani menyapa.'
    },
    {
      type: 'clue',
      x: 520, y: 115,
      id: 1,
      title: 'Petunjuk 2: Pita di Bawah Pohon Rindang',
      desc: 'Pohon rindang dengan angin sejuk, tempat impian untuk duduk berdua. Di masa SMP, rasa penasaran itu makin tumbuh meskipun tiap kali papasan selalu salting dan kabur!'
    },
    {
      type: 'clue',
      x: 800, y: 240,
      id: 2,
      title: 'Petunjuk 3: Catatan Meja Kelas 1 SMP',
      desc: 'Nidan yang mulai menyadari keberadaan Jinan dan ikut menyimpan rasa manis di dalam hati, menanti saat yang tepat untuk kembali dipertemukan.'
    }
  ],

  stars: [
    { x: 160, y: 385 },
    { x: 620, y: 185 },
    { x: 1040, y: 385 }
  ],

  springs: [
    { x: 395, y: 275, w: 26, h: 10 }
  ],

  movingPlatforms: [],

  gate: { x: 1120, y: 380, label: 'GERBANG KENANGAN • 850 KM' }
};
