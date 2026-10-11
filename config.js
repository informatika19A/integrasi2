/* ============================================================
   KONFIGURASI — ubah bagian ini saja sesuai kebutuhan
   ============================================================ */
window.CONFIG = {
  // 1) Tempel URL Web App Google Apps Script di sini (lihat README.md, langkah 3).
  //    Contoh: "https://script.google.com/macros/s/AKfycb.../exec"
  //    Jika dikosongkan, aplikasi berjalan MODE LOKAL (data hanya di perangkat ini).
  SCRIPT_URL: "",

  JUDUL: "Integrasi Office",
  SUBJUDUL: "PowerPoint × Word × Excel",
  MAPEL: "Informatika · Kelas X",
  KELAS: ["X3", "X4"],

  // Batas ketuntasan (untuk pewarnaan di dashboard)
  KKM: 75,

  // Syarat membuka Post-test (ubah angka bila ingin lebih longgar/ketat)
  SYARAT_POSTTEST: { materi: 4, simulasi: 4, kuis: 3 },

  // Dashboard guru: sidik jari (SHA-256) password untuk MODE LOKAL.
  // Password asli TIDAK ditulis di sini. Pada mode Google Sheet,
  // password diperiksa di server (Apps Script) pada file Code.gs.
  HASH_GURU: "60209cccb8ab77c76ce7dca520e15075aa77f62b12e5ec148fc543f3bc1846b2",

  REFRESH_DETIK: 30
};
