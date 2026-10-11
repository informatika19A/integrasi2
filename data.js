/* ============================================================
   BANK SOAL & MATERI — Media Belajar Integrasi Office
   Informatika Kelas X
   Format opsi: o = daftar 5 opsi, a = indeks jawaban benar (0-4)
   Untuk pilihan ganda kompleks: a = array indeks benar
   ============================================================ */
window.DATA = {

/* ------------------------- PRE-TEST ------------------------- */
pretest: {
  pg: [
    { q: "Fitur PowerPoint yang dipakai untuk memasukkan file Excel ke dalam slide sehingga bisa dibuka dengan aplikasi aslinya adalah …",
      o: ["Insert > Object", "Design > Variants", "Transitions > Morph", "Review > Spelling", "View > Zoom"], a: 0 },
    { q: "Pintasan keyboard untuk membuka kotak dialog Insert Hyperlink adalah …",
      o: ["Ctrl + H", "Ctrl + L", "Ctrl + K", "Ctrl + J", "Ctrl + G"], a: 2 },
    { q: "Saat membuat slide dari outline Word, teks berformat Heading 1 akan menjadi …",
      o: ["Isi paragraf", "Catatan pembicara", "Footer slide", "Nomor slide", "Judul slide"], a: 4 },
    { q: "Grafik Excel ditempel ke PowerPoint dengan opsi Keep Source Formatting & Link Data. Jika data di Excel diubah, grafik di slide akan …",
      o: ["Tetap, tidak pernah berubah", "Diperbarui mengikuti file Excel sumber", "Terhapus otomatis", "Berubah menjadi gambar", "Berubah menjadi tabel Word"], a: 1 },
    { q: "Untuk membuat hyperlink dari sebuah teks ke slide lain pada presentasi yang sama, pilih opsi …",
      o: ["Existing File or Web Page", "Create New Document", "E-mail Address", "Place in This Document", "Insert Comment"], a: 3 }
  ],
  pgk: [
    { q: "Pilih SEMUA objek yang dapat disisipkan ke slide PowerPoint dari aplikasi lain:",
      o: ["Dokumen Word", "Lembar kerja Excel", "Grafik dari Excel", "Driver printer", "Program antivirus"], a: [0, 1, 2] },
    { q: "Pilih SEMUA opsi tempel (Paste Options) yang tersedia saat menempel grafik dari Excel ke slide:",
      o: ["Use Destination Theme", "Keep Source Formatting", "Picture", "Encrypt Data", "Defragment"], a: [0, 1, 2] },
    { q: "Pilih SEMUA hal yang dapat dihubungkan melalui hyperlink:",
      o: ["Slide lain", "Halaman web", "File Word", "Kecepatan prosesor", "Resolusi layar"], a: [0, 1, 2] },
    { q: "Pilih SEMUA keuntungan memakai Link Data dibanding Embed:",
      o: ["Slide selalu sejalan dengan file Excel sumber", "Cukup memperbarui data di satu tempat (file Excel)", "Ukuran file presentasi cenderung lebih kecil", "File Excel boleh dihapus tanpa masalah", "Tidak memerlukan file sumber sama sekali"], a: [0, 1, 2] },
    { q: "Pilih SEMUA pernyataan yang benar tentang membuat slide dari outline Word:",
      o: ["Judul slide memakai style Heading 1", "Sub-poin memakai style Heading 2", "Dipilih lewat New Slide > Slides from Outline", "Foto otomatis dibuat dari teks", "Semua teks harus diketik ulang di PowerPoint"], a: [0, 1, 2] }
  ]
},

/* ------------------------- POST-TEST ------------------------- */
posttest: {
  pg: [
    { q: "Pada kotak dialog Insert Object, mencentang opsi \"Link to file\" bertujuan agar …",
      o: ["Objek dienkripsi", "Objek terhubung ke file aslinya", "Ukuran gambar diperkecil", "Objek dijadikan animasi", "Objek dikunci"], a: 1 },
    { q: "Agar judul slide otomatis mengikuti outline dokumen Word, teks judul harus berformat …",
      o: ["Normal", "Caption", "Heading 1", "Footnote", "Quote"], a: 2 },
    { q: "Dokumen Word berisi 3 Heading 1 dan setiap Heading 1 memiliki 2 Heading 2. Jika diimpor lewat Slides from Outline, hasilnya adalah …",
      o: ["6 slide, tiap slide 1 poin", "3 slide, tiap slide 2 poin", "9 slide tanpa poin", "2 slide, tiap slide 3 poin", "1 slide berisi 6 poin"], a: 1 },
    { q: "Agar grafik Excel tampil di slide sebagai gambar statis, gunakan …",
      o: ["Paste Special > Link", "Paste > Keep Source Formatting & Link Data", "Paste Options > Picture", "Insert > Hyperlink", "File > Share"], a: 2 },
    { q: "Untuk memperbarui grafik yang tertaut ke Excel secara manual, buka …",
      o: ["File > Info > Edit Links to Files > Update Now", "Home > Find > Replace", "Insert > Header & Footer", "Slide Show > Rehearse Timings", "View > Ruler"], a: 0 },
    { q: "Teks \"Lihat Data\" di slide ingin membuka file anggaran.xlsx. Jenis hyperlink yang dipilih adalah …",
      o: ["Place in This Document", "Create New Document", "E-mail Address", "Existing File or Web Page", "Insert Table"], a: 3 },
    { q: "Link ke file Word sering putus saat file dipindahkan. Pencegahan terbaik adalah …",
      o: ["Mengganti nama file berkali-kali", "Menyimpan semua file dalam satu folder yang sama sebelum membuat link", "Menghapus file sumber", "Memperbesar ukuran slide", "Mematikan komputer"], a: 1 },
    { q: "Di Excel, hyperlink ke sheet lain dalam workbook yang sama dibuat dengan opsi …",
      o: ["Place in This Document", "E-mail Address", "Existing File or Web Page", "Create New Document", "Insert Object"], a: 0 },
    { q: "Rumus =HYPERLINK(\"#Data!A1\",\"Ke Data\") akan membawa pengguna ke …",
      o: ["Halaman web bernama Data", "Slide nomor 1", "Sheet Data sel A1", "File Word Data", "Folder Data"], a: 2 },
    { q: "Action Button (Insert > Shapes > Action Buttons) berguna untuk …",
      o: ["Mengubah tema slide", "Membuat tombol yang menjalankan hyperlink/aksi saat diklik", "Menghitung rata-rata data", "Memeriksa ejaan", "Mencetak slide"], a: 1 }
  ],
  pgk: [
    { q: "Pilih SEMUA opsi tempel yang tersedia saat menempel teks dari Word ke PowerPoint:",
      o: ["Keep Source Formatting", "Use Destination Theme", "Keep Text Only", "Paste as Virus", "Delete Source File"], a: [0, 1, 2] },
    { q: "Pilih SEMUA alasan yang tepat untuk memilih Embed (bukan Link):",
      o: ["Presentasi akan dikirim tanpa file Excel terpisah", "Data tidak perlu berubah otomatis", "Ingin bisa Edit Data langsung dari slide", "Ingin data berubah mengikuti file sumber", "Ingin menghapus file Excel setelah ditempel"], a: [0, 1, 2] },
    { q: "Pilih SEMUA objek yang dapat dijadikan sumber hyperlink di slide:",
      o: ["Teks", "Gambar", "Bentuk (shape)", "Ukuran slide", "Resolusi layar"], a: [0, 1, 2] },
    { q: "Pilih SEMUA contoh penerapan integrasi Word–Excel–PowerPoint dalam kehidupan sehari-hari:",
      o: ["Laporan kegiatan OSIS (narasi Word, anggaran Excel, presentasi)", "Presentasi hasil survei kelas dengan grafik Excel", "Portofolio digital dengan tautan ke dokumen karya", "Mengganti RAM laptop", "Memasang driver printer"], a: [0, 1, 2] },
    { q: "Pilih SEMUA langkah yang benar untuk membuat grafik slide yang tertaut ke Excel:",
      o: ["Salin grafik di Excel", "Tempel di slide dengan opsi Link Data", "Simpan kedua file dalam folder yang sama", "Hapus file Excel setelah menempel", "Ubah ekstensi file menjadi .txt"], a: [0, 1, 2] }
  ],
  jodoh: {
    intro: "Jodohkan setiap pilihan tempel (kiri) dengan hasilnya (kanan).",
    premis: [
      "Keep Source Formatting & Link Data",
      "Use Destination Theme & Embed Workbook",
      "Picture"
    ],
    pilihan: [
      "Grafik ikut berubah mengikuti file Excel sumber",
      "Data tersimpan di dalam file presentasi dan warna mengikuti tema slide",
      "Gambar statis, datanya tidak dapat diedit",
      "Teks Heading 1 menjadi judul slide",
      "Membuka kotak dialog Insert Hyperlink"
    ],
    kunci: [0, 1, 2]
  },
  isian: [
    { q: "Pintasan keyboard untuk menyisipkan hyperlink adalah Ctrl + … (isi satu huruf)", jawab: ["k", "ctrl+k", "ctrl + k"] },
    { q: "Menu pada tab Insert untuk memasukkan file Word atau Excel ke dalam slide disebut …", jawab: ["object", "objek", "insert object"] }
  ]
},

/* ------------------------- KUIS 3 LEVEL ------------------------- */
kuis: {
  mudah: [
    { q: "Aplikasi Microsoft Office yang paling cocok untuk mengolah data angka dan membuat grafik adalah …",
      o: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Notepad", "Paint"], a: 1,
      e: "Excel dirancang untuk mengolah data angka, rumus, dan grafik." },
    { q: "Aplikasi yang paling cocok untuk mengetik laporan atau surat adalah …",
      o: ["Microsoft Excel", "Microsoft PowerPoint", "Microsoft Word", "Calculator", "Task Manager"], a: 2,
      e: "Word adalah pengolah kata untuk dokumen teks." },
    { q: "Tab yang berisi menu Link/Hyperlink pada PowerPoint adalah …",
      o: ["Home", "Insert", "Design", "Review", "View"], a: 1,
      e: "Hyperlink ada di tab Insert > Link." },
    { q: "Aplikasi yang dipakai untuk menampilkan presentasi berupa slide adalah …",
      o: ["Microsoft PowerPoint", "Microsoft Excel", "Microsoft Word", "File Explorer", "Windows Update"], a: 0,
      e: "PowerPoint dipakai untuk membuat dan menampilkan slide presentasi." },
    { q: "Teks yang jika diklik membuka halaman atau file lain disebut …",
      o: ["Footer", "Hyperlink", "Header", "Watermark", "Footnote"], a: 1,
      e: "Hyperlink (tautan) menghubungkan teks/objek ke tujuan lain." }
  ],
  sedang: [
    { q: "Pada dokumen Word, teks dengan style Heading 2 akan menjadi … saat diimpor ke slide lewat Slides from Outline.",
      o: ["Judul slide baru", "Poin/sub-poin di dalam slide", "Catatan pembicara", "Nomor halaman", "Gambar latar"], a: 1,
      e: "Heading 1 menjadi judul slide; Heading 2 menjadi poin tingkat pertama dalam slide." },
    { q: "Agar grafik dari Excel tampak persis seperti aslinya ketika ditempel ke slide, pilih opsi …",
      o: ["Use Destination Theme", "Keep Text Only", "Keep Source Formatting", "Picture", "Paste Special > Unformatted"], a: 2,
      e: "Keep Source Formatting mempertahankan tampilan asli dari Excel." },
    { q: "Link grafik di slide menampilkan pesan bahwa file tertaut tidak tersedia. Penyebab paling mungkin adalah …",
      o: ["Warna tema terlalu terang", "File Excel sumber dipindah, dihapus, atau diganti nama", "Slide terlalu banyak", "Font tidak terpasang", "Layar terlalu kecil"], a: 1,
      e: "Link bergantung pada lokasi dan nama file sumber; jika berubah, link putus." },
    { q: "Sebuah Action Button pada slide paling tepat dipakai untuk …",
      o: ["Mengecek ejaan", "Berpindah ke slide, file, atau halaman lain saat diklik", "Menghitung total kolom", "Mengubah ukuran font", "Menyimpan otomatis"], a: 1,
      e: "Action Button menjalankan aksi hyperlink, misalnya pindah slide atau membuka file." },
    { q: "Perbedaan utama Embed dan Link pada objek Excel di slide adalah …",
      o: ["Embed menyimpan salinan data di dalam presentasi; Link menghubungkan ke file sumber", "Embed selalu lebih cepat dari Link", "Link menyimpan salinan data; Embed tidak", "Keduanya identik", "Embed hanya untuk teks"], a: 0,
      e: "Embed = data ikut tersimpan di file presentasi. Link = slide membaca data dari file Excel sumber." }
  ],
  rumit: [
    { q: "Rina menyusun laporan OSIS: narasi di Word, anggaran di Excel. Ia ingin grafik anggaran di slide ikut berubah saat bendahara memperbarui Excel, lalu mengirimkan semuanya ke pembina. Rancangan paling tepat adalah …",
      o: ["Tempel grafik sebagai Picture, kirim hanya file PPTX", "Simpan semua file dalam satu folder, tempel grafik dengan Keep Source Formatting & Link Data, kirim satu folder utuh", "Embed grafik lalu hapus file Excel", "Ketik ulang angka di slide setiap bulan", "Kirim PPTX saja karena link otomatis mengambil file dari internet"], a: 1,
      e: "Link butuh file sumber; karena itu file disimpan dalam satu folder dan dikirim lengkap agar link tidak putus." },
    { q: "Dokumen Word memiliki urutan: H1 'Pendahuluan' (H2: Latar Belakang, Tujuan), H1 'Isi' (H2: Data, Analisis, Grafik), H1 'Penutup' (tanpa H2). Setelah Slides from Outline, jumlah slide dan jumlah poin pada slide 'Isi' adalah …",
      o: ["3 slide; slide 'Isi' memiliki 3 poin", "6 slide; slide 'Isi' memiliki 1 poin", "3 slide; slide 'Isi' memiliki 2 poin", "8 slide; tiap slide 1 poin", "2 slide; slide 'Isi' memiliki 3 poin"], a: 0,
      e: "Ada 3 Heading 1 → 3 slide. Di bawah 'Isi' terdapat 3 Heading 2 → 3 poin." },
    { q: "Slide menu berisi tombol 'Laporan' (Word) dan 'Anggaran' (Excel). Setiap file harus punya jalan kembali ke slide menu. Hyperlink minimal yang diperlukan adalah …",
      o: ["2 hyperlink", "3 hyperlink", "4 hyperlink: 2 dari slide ke file, 2 dari file kembali ke slide menu", "6 hyperlink", "1 hyperlink saja"], a: 2,
      e: "Dua tautan keluar (slide → Word, slide → Excel) ditambah dua tautan kembali (Word → slide, Excel → slide)." },
    { q: "Data survei 300 responden berisi nama dan nomor HP. Kamu hanya ingin membagikan ringkasan berupa grafik kepada guru. Cara tempel yang paling aman adalah …",
      o: ["Embed seluruh workbook agar mudah diedit", "Link Data, lalu kirim folder beserta file Excel sumber", "Picture (gambar grafik), karena data mentah tidak ikut tersimpan", "Keep Source Formatting & Embed Workbook", "Hyperlink ke file Excel asli di Drive umum"], a: 2,
      e: "Embed membawa seluruh workbook (termasuk data pribadi yang tersembunyi). Picture hanya membawa tampilan grafik." },
    { q: "Sebuah presentasi berisi grafik 'Link Data'. Saat dibuka di komputer lain, grafik tidak bisa diperbarui. Rencana perbaikan terbaik …",
      o: ["Hapus semua grafik", "Salin file Excel sumber ke komputer itu, buka File > Info > Edit Links to Files, lalu Change Source dan Update Now", "Instal ulang Windows", "Ubah ekstensi PPTX menjadi XLSX", "Ganti tema presentasi"], a: 1,
      e: "Link perlu diarahkan ulang (Change Source) ke lokasi file Excel di komputer baru, lalu diperbarui (Update Now)." }
  ]
},

/* ------------------------- MATERI (4 TUJUAN) ------------------------- */
materi: [
  {
    id: "tp1", ikon: "🧩", warna: "#7c5cff",
    judul: "Fitur Integrasi PowerPoint dengan Word dan Excel",
    ringkas: "Mengenal konsep objek, embed, link, dan opsi tempel.",
    html: `
<h3>🎯 Tujuan 1</h3>
<p>Kamu mampu menggunakan fitur integrasi PowerPoint dengan Word dan Excel.</p>

<h3>📘 Apa itu integrasi aplikasi Office?</h3>
<p><b>Integrasi</b> adalah kemampuan beberapa aplikasi untuk saling berbagi isi. Dokumen Word, lembar kerja Excel, dan slide PowerPoint dapat dihubungkan sehingga kerja kita lebih cepat, rapi, dan konsisten.</p>
<div class="kartu-mini">
  <div><b>Word</b><br>Teks, laporan, narasi</div>
  <div><b>Excel</b><br>Angka, tabel, grafik</div>
  <div><b>PowerPoint</b><br>Presentasi visual</div>
</div>

<h3>🔑 Tiga cara menggabungkan isi</h3>
<table class="tbl">
<tr><th>Cara</th><th>Artinya</th><th>Kalau file sumber berubah</th><th>Cocok untuk</th></tr>
<tr><td><b>Picture</b> (gambar)</td><td>Hanya tampilan, tidak bisa diedit datanya</td><td>Tidak berubah</td><td>Hasil final, data rahasia</td></tr>
<tr><td><b>Embed</b> (sematkan)</td><td>Salinan data ikut tersimpan di file presentasi</td><td>Tidak ikut berubah (karena salinan)</td><td>Dikirim tanpa file terpisah</td></tr>
<tr><td><b>Link</b> (tautan)</td><td>Slide terhubung ke file sumber</td><td>Ikut diperbarui</td><td>Data sering berubah</td></tr>
</table>

<h3>🛠️ Langkah memasukkan file lewat Insert Object</h3>
<ol class="langkah">
<li>Buka PowerPoint, pilih slide tujuan.</li>
<li>Klik tab <b>Insert</b> → grup <b>Text</b> → <b>Object</b>.</li>
<li>Pilih <b>Create from file</b> → <b>Browse</b> → pilih file Word atau Excel.</li>
<li>Centang <b>Link</b> bila ingin tersambung ke file asli. Biarkan kosong untuk Embed.</li>
<li>Klik <b>OK</b>. Klik dua kali objek untuk membukanya di aplikasi aslinya.</li>
</ol>

<h3>🧷 Opsi tempel (Paste Options)</h3>
<ul>
<li><b>Use Destination Theme</b>: tampilan mengikuti tema slide.</li>
<li><b>Keep Source Formatting</b>: tampilan tetap seperti aslinya.</li>
<li><b>Embed</b>: data disematkan (bisa Edit Data di slide).</li>
<li><b>Link Data</b>: data tertaut ke file sumber.</li>
<li><b>Picture</b>: ditempel sebagai gambar.</li>
<li><b>Keep Text Only</b>: hanya teks polos tanpa format.</li>
</ul>

<div class="tips"><b>💡 Tips:</b> Setelah menempel, ikon kecil (Ctrl) muncul di dekat hasil tempel. Klik untuk mengganti opsi tanpa mengulang dari awal.</div>
<div class="salah"><b>⚠️ Kesalahan umum:</b> Memakai Link, tetapi file Excel tidak ikut dikirim. Akibatnya data tidak bisa diperbarui.</div>`
  },
  {
    id: "tp2", ikon: "📝", warna: "#ff5c8a",
    judul: "Teks di Halaman Word → Slide Presentasi",
    ringkas: "Mengubah outline Word menjadi slide dengan Heading.",
    html: `
<h3>🎯 Tujuan 2</h3>
<p>Kamu mampu membuat teks di halaman dokumen Word dan mengintegrasikannya ke slide presentasi.</p>

<h3>📘 Gagasan utama: Heading = kerangka (outline)</h3>
<p>PowerPoint membaca <b>style Heading</b> pada dokumen Word. Style inilah yang menentukan mana judul slide dan mana poin.</p>
<table class="tbl">
<tr><th>Style di Word</th><th>Menjadi … di PowerPoint</th></tr>
<tr><td><b>Heading 1</b></td><td>Judul slide baru</td></tr>
<tr><td><b>Heading 2</b></td><td>Poin tingkat 1 dalam slide</td></tr>
<tr><td><b>Heading 3</b></td><td>Poin tingkat 2 (sub-poin)</td></tr>
<tr><td>Normal</td><td>Tidak dipakai sebagai kerangka (tidak menjadi judul slide)</td></tr>
</table>

<h3>🛠️ Cara 1 — Slides from Outline</h3>
<ol class="langkah">
<li>Di <b>Word</b>, ketik teks lalu terapkan style: <b>Home → Styles → Heading 1 / Heading 2</b>.</li>
<li>Simpan file Word, tutup, lalu buka <b>PowerPoint</b>.</li>
<li>Klik <b>Home → New Slide ▾ → Slides from Outline…</b></li>
<li>Pilih file Word → <b>Insert</b>. Slide terbentuk otomatis.</li>
<li>Pilih layout, tema, dan tambahkan gambar untuk mempercantik.</li>
</ol>

<h3>🛠️ Cara 2 — Salin & Tempel (Copy–Paste)</h3>
<ol class="langkah">
<li>Blok teks di Word → <b>Ctrl + C</b>.</li>
<li>Di PowerPoint, klik kotak teks pada slide → <b>Ctrl + V</b>.</li>
<li>Pilih opsi: <b>Use Destination Theme</b> (ikut tema slide) atau <b>Keep Text Only</b> (teks bersih).</li>
</ol>

<h3>🛠️ Cara 3 — Sisipkan sebagai Object</h3>
<p>Gunakan <b>Insert → Object → Create from file</b> bila seluruh halaman Word ingin tampil utuh dan bisa diedit dengan klik ganda.</p>

<div class="tips"><b>💡 Tips:</b> Ketik teks poin singkat. Slide bukan tempat paragraf panjang. Simpan kalimat panjang di Word, ringkas di slide.</div>
<div class="salah"><b>⚠️ Kesalahan umum:</b> Teks hanya dibesarkan manual (tanpa style Heading). PowerPoint tidak mengenali sebagai judul, sehingga slide tidak terbentuk.</div>`
  },
  {
    id: "tp3", ikon: "📊", warna: "#00b5a5",
    judul: "Data & Grafik: Slide ↔ Lembar Kerja Excel",
    ringkas: "Menghubungkan grafik dan tabel Excel ke slide.",
    html: `
<h3>🎯 Tujuan 3</h3>
<p>Kamu mampu mengintegrasikan data dan grafik yang ada di slide presentasi dan lembar kerja Excel.</p>

<h3>📘 Dua jalur membuat grafik di slide</h3>
<ol class="langkah">
<li><b>Dari Excel ke slide</b>: buat grafik di Excel, lalu salin ke slide.</li>
<li><b>Langsung di slide</b>: <b>Insert → Chart</b>. PowerPoint membuka jendela mini Excel untuk mengisi data.</li>
</ol>

<h3>🛠️ Langkah Link Data (grafik ikut berubah)</h3>
<ol class="langkah">
<li>Simpan file Excel dan file presentasi dalam <b>satu folder</b>.</li>
<li>Di Excel, klik grafik → <b>Ctrl + C</b>.</li>
<li>Di PowerPoint, klik slide → <b>Paste ▾ → Keep Source Formatting & Link Data</b>.</li>
<li>Ubah angka di Excel → simpan.</li>
<li>Di PowerPoint, klik kanan grafik → <b>Edit Data</b>/<b>Refresh Data</b>, atau <b>File → Info → Edit Links to Files → Update Now</b>.</li>
</ol>

<h3>🛠️ Memasukkan tabel Excel ke slide</h3>
<ul>
<li><b>Insert → Table → Excel Spreadsheet</b>: tabel Excel mini yang bisa dihitung dengan rumus.</li>
<li>Atau salin rentang sel di Excel → tempel sebagai tabel/gambar.</li>
</ul>

<h3>📏 Memilih grafik yang tepat</h3>
<table class="tbl">
<tr><th>Tujuan</th><th>Jenis grafik</th></tr>
<tr><td>Membandingkan kategori</td><td>Kolom / Batang</td></tr>
<tr><td>Melihat perubahan dari waktu ke waktu</td><td>Garis</td></tr>
<tr><td>Melihat bagian terhadap keseluruhan</td><td>Lingkaran (Pie)</td></tr>
</table>

<h3>🔄 Memperbarui & memperbaiki link</h3>
<ul>
<li><b>Update Now</b>: tarik data terbaru dari Excel sumber.</li>
<li><b>Change Source</b>: arahkan ulang bila file dipindah.</li>
<li><b>Break Link</b>: putuskan link (data jadi salinan).</li>
</ul>

<div class="tips"><b>💡 Tips:</b> Beri judul dan label sumbu yang jelas. Grafik yang baik bisa dipahami dalam 5 detik.</div>
<div class="salah"><b>⚠️ Kesalahan umum:</b> Memindah atau mengganti nama file Excel sehingga link putus.</div>
<div class="salah"><b>🔒 Keamanan data:</b> Embed membawa seluruh workbook. Untuk data pribadi, bagikan sebagai Picture.</div>`
  },
  {
    id: "tp4", ikon: "🔗", warna: "#ff9f1c",
    judul: "Hyperlink: Menghubungkan Dokumen, Lembar Kerja, dan Slide",
    ringkas: "Tautan antarfile, antarslide, dan tombol aksi.",
    html: `
<h3>🎯 Tujuan 4</h3>
<p>Kamu mampu menggunakan hyperlink untuk menghubungkan dokumen, lembar kerja, dan slide presentasi.</p>

<h3>📘 Apa itu hyperlink?</h3>
<p>Hyperlink adalah tautan pada teks atau objek yang membawa pengguna ke tujuan lain saat diklik. Pintasan: <b>Ctrl + K</b>.</p>

<h3>🧭 Pilihan tujuan pada kotak Insert Hyperlink</h3>
<table class="tbl">
<tr><th>Opsi</th><th>Dipakai untuk</th></tr>
<tr><td><b>Existing File or Web Page</b></td><td>Membuka file Word/Excel/PPT lain atau alamat web</td></tr>
<tr><td><b>Place in This Document</b></td><td>Pindah ke slide lain (PPT), sheet/sel (Excel), atau bookmark/heading (Word)</td></tr>
<tr><td><b>Create New Document</b></td><td>Membuat file baru lalu menautkannya</td></tr>
<tr><td><b>E-mail Address</b></td><td>Membuka aplikasi email dengan alamat tujuan</td></tr>
</table>

<h3>🛠️ Dari slide ke file Word / Excel</h3>
<ol class="langkah">
<li>Blok teks/gambar/shape di slide.</li>
<li>Tekan <b>Ctrl + K</b> → pilih <b>Existing File or Web Page</b>.</li>
<li>Cari file <b>.docx</b> atau <b>.xlsx</b> → <b>OK</b>.</li>
<li>Mulai <b>Slide Show</b>, lalu klik tautan untuk mengujinya.</li>
</ol>

<h3>🛠️ Dari slide ke slide lain</h3>
<ol class="langkah">
<li>Blok objek → <b>Ctrl + K</b> → <b>Place in This Document</b>.</li>
<li>Pilih slide tujuan → <b>OK</b>.</li>
<li>Alternatif: <b>Insert → Shapes → Action Buttons</b> (misalnya tombol Home, Back).</li>
</ol>

<h3>🛠️ Dari Word atau Excel kembali ke slide / sheet lain</h3>
<ul>
<li><b>Word</b>: sisipkan <b>Bookmark</b> (Insert → Bookmark), lalu tautkan lewat <i>Place in This Document</i>.</li>
<li><b>Excel</b>: <b>Ctrl + K → Place in This Document</b>, pilih sheet dan alamat sel (misalnya <code>Data!A1</code>).</li>
<li><b>Rumus Excel</b>: <code>=HYPERLINK("#Data!A1","Ke Data")</code>.</li>
<li>Kembali ke file PowerPoint: tautkan ke file <b>.pptx</b> memakai <i>Existing File</i>.</li>
</ul>

<h3>🗂️ Rancangan navigasi yang baik</h3>
<div class="kartu-mini">
<div><b>Slide Menu</b><br>pusat tautan</div>
<div><b>Word</b><br>tombol kembali</div>
<div><b>Excel</b><br>tombol kembali</div>
</div>
<p>Setiap tujuan perlu <b>jalan pulang</b> ke menu agar pengguna tidak tersesat.</p>

<div class="tips"><b>💡 Tips:</b> Simpan semua file dalam satu folder. Hindari memindah folder setelah link dibuat. Beri nama file sederhana tanpa spasi.</div>
<div class="salah"><b>⚠️ Kesalahan umum:</b> Menguji link hanya di mode Normal. Link slide aktif saat <b>Slide Show</b> (F5).</div>

<h3>🏠 Penerapan sehari-hari</h3>
<ul>
<li><b>Laporan kegiatan OSIS</b>: narasi Word, anggaran Excel, presentasi, semua saling tertaut.</li>
<li><b>Proposal usaha kantin</b>: grafik penjualan Excel di slide, rincian di Word.</li>
<li><b>Portofolio digital</b>: slide daftar karya dengan tautan ke file tiap karya.</li>
<li><b>Presentasi hasil survei</b>: grafik tertaut ke data survei yang terus bertambah.</li>
</ul>`
  }
],

/* ------------------------- REFLEKSI ------------------------- */
refleksi: {
  skala: [
    { k: "r1", t: "Sebelum belajar, saya menentukan target: apa yang ingin saya kuasai hari ini." , jenis: "Perencanaan" },
    { k: "r2", t: "Saya memilih cara belajar yang cocok (membaca, mencoba simulasi, bertanya teman)." , jenis: "Perencanaan" },
    { k: "r3", t: "Saat belajar, saya menyadari ketika saya mulai tidak paham." , jenis: "Pemantauan" },
    { k: "r4", t: "Saat bingung, saya mengulang materi atau mencoba cara lain, bukan menyerah." , jenis: "Pemantauan" },
    { k: "r5", t: "Saya tetap fokus meski ada gangguan (HP, suasana kelas)." , jenis: "Regulasi diri" },
    { k: "r6", t: "Saya memeriksa kembali jawaban dan memperbaiki kesalahan saya." , jenis: "Evaluasi" },
    { k: "r7", t: "Saya tahu bagian mana yang sudah dan belum saya kuasai." , jenis: "Evaluasi" },
    { k: "r8", t: "Saya yakin bisa memakai ilmu ini untuk tugas sekolah atau kehidupan sehari-hari." , jenis: "Efikasi diri" }
  ],
  terbuka: [
    { k: "t1", t: "Bagian materi yang paling mudah bagi saya adalah … karena …" },
    { k: "t2", t: "Bagian yang paling sulit bagi saya adalah … dan saya mengatasinya dengan cara …" },
    { k: "t3", t: "Strategi belajar yang paling membantu saya hari ini adalah …" },
    { k: "t4", t: "Hal yang akan saya lakukan berbeda pada pembelajaran berikutnya adalah …" },
    { k: "t5", t: "Saya akan memakai integrasi Word–Excel–PowerPoint dan hyperlink untuk … (tulis contoh nyata)" }
  ],
  perasaan: ["😄 Senang", "🤩 Bersemangat", "🙂 Biasa saja", "😕 Bingung", "😓 Cemas", "😴 Bosan"]
}

};
