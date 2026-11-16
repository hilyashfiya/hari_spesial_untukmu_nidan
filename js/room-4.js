/* ===================================================
   ROOM 4: A LITTLE SOMETHING FOR YOU — NIDAN & JINAN
   Theme: Camping Pegunungan Luas, Api Unggun & Bunga Liar
   Distance: 0 km — Bersama Menuju Puncak Kejutan Ulang Tahun!
   Player Two, Forever 💜
=================================================== */

export const ROOM_4_CONFIG = {
  id: 3,
  name: "A LITTLE SOMETHING FOR YOU",
  subtitle: "“Bayangan camping di bawah langit berbintang, menghangatkan api unggun sebelum puncak kejutan…”",
  badge: "CHAPTER 4 • CAMPING PEGUNUNGAN & API UNGGUN",
  theme: "mountain-camping",
  distanceKm: 0,
  canSwitch: false,
  showBothInWorld: false,
  spawnX: 50, spawnY: 370,
  checkpoint: { x: 100, y: 390 },

  // Jinan awaits at the cozy camping tent area
  girlPost: { x: 1040, y: 384, facingLeft: true, label: "Tenda Camping Romantis Jinan" },

  platforms: [
    // Rolling mountain plateau ground
    { x: 0,    y: 420, w: 1200, h: 30, col: '#15803d', border: '#4ade80' },
    // Ascending mountain terraces with wildflowers & stones
    { x: 140,  y: 350, w: 140,  h: 18, col: '#166534', border: '#86efac' },
    { x: 340,  y: 280, w: 140,  h: 18, col: '#166534', border: '#86efac' },
    { x: 540,  y: 210, w: 150,  h: 18, col: '#166534', border: '#86efac' }, // Campfire & Stargazing summit!
    { x: 740,  y: 150, w: 170,  h: 18, col: '#14532d', border: '#4ade80' },
    { x: 970,  y: 260, w: 130,  h: 18, col: '#166534', border: '#86efac' }
  ],

  collectibles: [
    {
      type: 'campingItem',
      x: 210, y: 315,
      id: 0,
      title: 'Kayu Bakar Cemara Api Unggun',
      desc: 'Ranting pinus kering aromatik untuk menyalakan kehangatan api unggun camping impian kita.'
    },
    {
      type: 'campingItem',
      x: 615, y: 175,
      id: 1,
      title: 'Teleskop Rasi Bintang Kenangan',
      desc: 'Meneropong langit malam yang cerah, menghubungkan bintang nostalgia sekolah, nobar film, dan samudra LDR.'
    },
    {
      type: 'mysteryGift',
      x: 825, y: 110,
      id: 2,
      title: 'Kotak Hadiah Spesial Ulang Tahun Nidan',
      desc: 'Kotak berpita emas yang disiapkan Jinan khusus di depan tenda camping untuk membuka gerbang Birthday Finale!'
    }
  ],

  stars: [
    { x: 410, y: 245 },
    { x: 920, y: 180 },
    { x: 1035, y: 225 }
  ],

  springs: [
    { x: 360, y: 270, w: 26, h: 10 }
  ],

  movingPlatforms: [
    { x: 780, y: 310, w: 90, h: 16, col: '#15803d', border: '#4ade80', dx: 1.1, minX: 740, maxX: 940 }
  ],

  gate: { x: 1100, y: 380, isGrandFinale: true, label: 'GERBANG PERAYAAN ULANG TAHUN' }
};
