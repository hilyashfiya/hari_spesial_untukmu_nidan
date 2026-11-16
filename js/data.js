/* ===================================================
   DATA MODULE — ROOMS, STORIES & CONFIGURATION
   Player Two, Forever 💜 — Nidan & Jinan
=================================================== */

export const WORLD_W = 1200;
export const GAME_W = 800;
export const GAME_H = 450;

export const ROOMS_DATA = [
  {
    id: 0,
    name: "WHERE IT ALL BEGAN",
    subtitle: "“Dari seragam putih merah, rasa penasaran itu mulai disimpan…”",
    badge: "CHAPTER 1 • NOSTALGIA SEKOLAH",
    theme: "twilight-campus",
    spawnX: 50, spawnY: 370,
    checkpoint: { x: 100, y: 390 },
    platforms: [
      { x: 0,    y: 420, w: 320, h: 30, col: '#3b0d59', border: '#7c3aed' },
      { x: 380,  y: 420, w: 420, h: 30, col: '#3b0d59', border: '#7c3aed' },
      { x: 860,  y: 420, w: 340, h: 30, col: '#3b0d59', border: '#7c3aed' },
      { x: 200,  y: 350, w: 120, h: 18, col: '#581c87', border: '#a855f7' },
      { x: 370,  y: 285, w: 130, h: 18, col: '#581c87', border: '#a855f7' },
      { x: 550,  y: 220, w: 130, h: 18, col: '#581c87', border: '#a855f7' },
      { x: 730,  y: 275, w: 140, h: 18, col: '#581c87', border: '#a855f7' },
      { x: 920,  y: 340, w: 120, h: 18, col: '#581c87', border: '#a855f7' },
      { x: 420,  y: 150, w: 140, h: 18, col: '#6b21a8', border: '#c084fc' }
    ],
    collectibles: [
      { type: 'fragment', x: 260, y: 315, id: 0, title: 'Sobekan 1: Kenangan SD Kelas 3' },
      { type: 'fragment', x: 490, y: 115, id: 1, title: 'Sobekan 2: Masa Awal SMP Kelas 1' },
      { type: 'fragment', x: 790, y: 240, id: 2, title: 'Sobekan 3: Rasa yang Disimpan Rapi' }
    ],
    stars: [
      { x: 160, y: 385 }, { x: 615, y: 185 }, { x: 1040, y: 385 }
    ],
    springs: [
      { x: 395, y: 275, w: 26, h: 10 }
    ],
    movingPlatforms: [],
    gate: { x: 1120, y: 380, label: 'GERBANG 2 • 850 KM' }
  },
  {
    id: 1,
    name: "LITTLE THINGS, BIG MEMORIES",
    subtitle: "“Dari DM pertama, nobar bareng, sampai joget absurd di video call!”",
    badge: "CHAPTER 2 • KEBIASAAN KOCAK & MANIS",
    theme: "cozy-pastel",
    spawnX: 50, spawnY: 370,
    checkpoint: { x: 100, y: 390 },
    platforms: [
      { x: 0,    y: 420, w: 280, h: 30, col: '#4a044e', border: '#a21caf' },
      { x: 340,  y: 420, w: 460, h: 30, col: '#4a044e', border: '#a21caf' },
      { x: 880,  y: 420, w: 320, h: 30, col: '#4a044e', border: '#a21caf' },
      { x: 180,  y: 350, w: 120, h: 18, col: '#701a75', border: '#c026d3' },
      { x: 340,  y: 280, w: 130, h: 18, col: '#701a75', border: '#c026d3' },
      { x: 520,  y: 215, w: 140, h: 18, col: '#701a75', border: '#c026d3' },
      { x: 730,  y: 165, w: 130, h: 18, col: '#701a75', border: '#c026d3' },
      { x: 930,  y: 260, w: 120, h: 18, col: '#701a75', border: '#c026d3' }
    ],
    collectibles: [
      { type: 'symbolic', x: 240, y: 315, id: 0, icon: '🎬', title: 'Tiket Nobar Jarak Jauh', desc: 'Momen nonton film bersama dari kejauhan lewat layar laptop kita.' },
      { type: 'symbolic', x: 590, y: 175, id: 1, icon: '😹', title: 'Kapsul Joget Absurd & Muntah Kucing', desc: 'Kebiasaan kocak saat video call: joget absurd dan pose muntah kucing yang bikin ngakak!' },
      { type: 'symbolic', x: 990, y: 220, id: 2, icon: '💌', title: 'DM Keberanian Pertama Nidan', desc: 'Setelah Jinan follow duluan, Nidan memberanikan diri mengirim DM pertama.' }
    ],
    stars: [
      { x: 405, y: 245 }, { x: 760, y: 130 }, { x: 1040, y: 385 }
    ],
    springs: [
      { x: 360, y: 270, w: 26, h: 10 },
      { x: 540, y: 205, w: 26, h: 10 }
    ],
    movingPlatforms: [
      { x: 670, y: 330, w: 90, h: 16, col: '#9d174d', border: '#f43f5e', dx: 1.1, minX: 660, maxX: 850 }
    ],
    gate: { x: 1110, y: 380, label: 'GERBANG 3 • 320 KM' }
  },
  {
    id: 2,
    name: "THROUGH EVERY CHAPTER",
    subtitle: "“Jarak memisahkan koordinat, tapi usaha saling hadir menyatukan kita.”",
    badge: "CHAPTER 3 • DUAL CO-OP LDR",
    theme: "starlight-storm",
    spawnX: 50, spawnY: 370,
    checkpoint: { x: 100, y: 390 },
    platforms: [
      { x: 0,    y: 420, w: 250, h: 30, col: '#1e1b4b', border: '#4338ca' },
      { x: 320,  y: 420, w: 260, h: 30, col: '#1e1b4b', border: '#4338ca' },
      { x: 160,  y: 350, w: 100, h: 18, col: '#312e81', border: '#6366f1' },
      { x: 300,  y: 290, w: 110, h: 18, col: '#312e81', border: '#6366f1' },
      { x: 450,  y: 230, w: 120, h: 18, col: '#312e81', border: '#6366f1' },
      { x: 800,  y: 210, w: 120, h: 18, col: '#4a154b', border: '#a21caf' },
      { x: 950,  y: 270, w: 110, h: 18, col: '#4a154b', border: '#a21caf' },
      { x: 820,  y: 420, w: 380, h: 30, col: '#1e1b4b', border: '#4338ca' }
    ],
    collectibles: [
      { type: 'beacon', x: 210, y: 315, id: 0, msg: '“Nidan... ingat gak dulu waktu awal SMP kita masih malu-malu banget kalau ketemu? Suka salting terus kabur-kaburan, hihi.”' },
      { type: 'beacon', x: 510, y: 195, id: 1, msg: '“Kuliah dan tugas laptopmu padat banget ya? Tapi aku selalu kagum melihat kegigihanmu berjuang. Jangan lupa istirahat ya Sayang!”' },
      { type: 'beacon', x: 860, y: 175, id: 2, msg: '“Perjalanan LDR kita butuh kesabaran dan saling jaga. Tapi selama kita saling dukung, aku yakin kita bakal sampai ke happy ending kita!”' }
    ],
    stars: [
      { x: 350, y: 255 }, { x: 685, y: 190 }, { x: 1040, y: 385 }
    ],
    springs: [
      { x: 320, y: 280, w: 26, h: 10 }
    ],
    movingPlatforms: [
      { x: 620, y: 320, w: 85, h: 16, col: '#4338ca', border: '#818cf8', dx: 1.2, minX: 600, maxX: 750 }
    ],
    gate: { x: 1120, y: 380, label: 'GERBANG 4 • 0 KM' }
  },
  {
    id: 3,
    name: "A LITTLE SOMETHING FOR YOU",
    subtitle: "“Sebuah kejutan rahasia yang kusiapkan sepenuh hati untukmu…”",
    badge: "CHAPTER 4 • PERAYAAN ULANG TAHUN",
    theme: "romantic-gallery",
    spawnX: 50, spawnY: 370,
    checkpoint: { x: 100, y: 390 },
    platforms: [
      { x: 0,    y: 420, w: 1200, h: 30, col: '#24083d', border: '#7e22ce' },
      { x: 140,  y: 350, w: 140,  h: 18, col: '#4c1d95', border: '#a855f7' },
      { x: 340,  y: 280, w: 140,  h: 18, col: '#4c1d95', border: '#a855f7' },
      { x: 540,  y: 210, w: 150,  h: 18, col: '#4c1d95', border: '#a855f7' },
      { x: 740,  y: 150, w: 170,  h: 18, col: '#581c87', border: '#c084fc' },
      { x: 970,  y: 260, w: 130,  h: 18, col: '#4c1d95', border: '#a855f7' }
    ],
    collectibles: [
      { type: 'goldenKey', x: 210, y: 315, id: 0, title: 'Kunci Hati Pertama: Ketekunan Nidan', desc: 'Melambangkan kerja kerasmu yang tak kenal lelah berjuang di depan laptop setiap hari demi masa depan.' },
      { type: 'goldenKey', x: 615, y: 175, id: 1, title: 'Kunci Hati Kedua: Tawa & Kebersamaan', desc: 'Melambangkan setiap tawa nobar, obrolan manis, dan joget kocak yang menghapus lelah kita berdua.' },
      { type: 'mysteryGift', x: 825, y: 110, id: 2, title: 'Kotak Hadiah Spesial Ulang Tahun Nidan', desc: 'Kotak berpita emas yang disiapkan Jinan khusus untuk membuka puncak perayaan ulang tahunmu!' }
    ],
    stars: [
      { x: 410, y: 245 }, { x: 920, y: 180 }, { x: 1035, y: 225 }
    ],
    springs: [
      { x: 360, y: 270, w: 26, h: 10 }
    ],
    movingPlatforms: [
      { x: 780, y: 310, w: 90, h: 16, col: '#7e22ce', border: '#c084fc', dx: 1.1, minX: 740, maxX: 940 }
    ],
    gate: { x: 1100, y: 380, isGrandFinale: true, label: 'CELESTIAL BIRTHDAY REALM' }
  }
];
