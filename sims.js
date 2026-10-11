/* ============================================================
   SIMULASI INTERAKTIF — 5 tab
   Setiap fungsi menerima (elemen, API) dari app.js
   ============================================================ */
window.SIMS = {};
(function () {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const COL = ['#6c5ce7', '#ff6b9d', '#00c2b8', '#ffc531', '#ff8f3f', '#4dabf7'];

/* ---------- SIM 1 : Insert Object + memilih Embed/Link/Picture ---------- */
window.SIMS.s1 = function (el, A) {
  const st = { step: 0, link: false, file: false, done: false, sc: [null, null, null, null] };
  const SC = [
    { t: 'Data survei berisi nomor HP responden, tetapi yang dibagikan ke guru hanya grafiknya.', a: 0, e: 'Picture: hanya gambar grafik yang ikut. Embed/Link bisa membawa data mentah yang bersifat pribadi.' },
    { t: 'Penjualan kantin berubah tiap hari, dan slide harus selalu menampilkan angka terbaru.', a: 2, e: 'Link Data: slide mengikuti file Excel sumber setelah diperbarui.' },
    { t: 'Presentasi dikirim lewat WhatsApp tanpa file Excel terpisah, tetapi tabelnya masih ingin bisa diedit.', a: 1, e: 'Embed: salinan data tersimpan di dalam file presentasi sehingga bisa diedit tanpa file lain.' },
    { t: 'Slide final akan dicetak; tampilan tidak boleh berubah dan tidak perlu diedit lagi.', a: 0, e: 'Picture: paling sederhana dan aman untuk hasil akhir.' }
  ];
  const hint = ['Klik tab <b>Insert</b>.', 'Klik tombol <b>Object</b> pada grup Text.', 'Pilih <b>Create from file</b>.', 'Klik <b>Browse…</b> lalu pilih <b>Penjualan.xlsx</b>.', 'Centang <b>Link</b> bila ingin tertaut (opsional), lalu klik <b>OK</b>.'];
  function fl(i) { return st.step === i ? 'flash' : ''; }
  function draw() {
    const ribbon = `<div class="ribbon">${['Home', 'Insert', 'Design', 'View'].map(t => `<div class="rb ${t === 'Insert' && st.step >= 1 ? 'on' : ''} ${t === 'Insert' ? fl(0) : ''}" data-c="tab:${t}">${t}</div>`).join('')}</div>` +
      (st.step >= 1 ? `<div class="ribbon">${['Table', 'Picture', 'Chart', 'Object', 'Link'].map(t => `<div class="rb ${t === 'Object' ? fl(1) : ''}" data-c="grp:${t}">${t === 'Object' ? '📎 ' : ''}${t}</div>`).join('')}</div>` : '');
    let dlg = '';
    if (st.step >= 2 && !st.done) {
      dlg = `<div class="card" style="margin:10px;padding:14px;background:#fff"><b>Insert Object</b>
        <div class="row" style="margin:8px 0"><label style="margin:0"><input type="radio" disabled> Create new</label>
        <div class="rb ${st.step === 2 ? 'flash' : ''} ${st.step >= 3 ? 'on' : ''}" data-c="dlg:file">Create from file</div></div>
        ${st.step >= 3 ? `<div class="row" style="margin:8px 0"><div class="rb ${fl(3)}" data-c="dlg:browse">Browse…</div><span>${st.file ? '📗 Penjualan.xlsx' : '<span class="muted">belum ada file</span>'}</span></div>` : ''}
        ${st.step >= 4 ? `<div class="row" style="margin:8px 0"><label style="margin:0;cursor:pointer"><input type="checkbox" id="cLink" ${st.link ? 'checked' : ''}> Link</label><span class="muted">(biarkan kosong = Embed)</span></div>
        <div class="rb ${fl(4)}" data-c="dlg:ok" style="display:inline-block">OK</div>` : ''}</div>`;
    }
    const slide = st.done ? `<div class="slide"><h4>Hasil Penjualan Kantin</h4>
      <div style="background:#eafaf2;border:3px solid #bdeed8;border-radius:12px;padding:10px;display:flex;gap:10px;align-items:center"><span style="font-size:2rem">📗</span><div><b>Penjualan.xlsx</b><br><span class="pill ${st.link ? 'y' : 'g'}">${st.link ? '🔗 Tertaut (Link)' : '📦 Tersemat (Embed)'}</span></div></div>
      <p style="font-size:.82rem;margin:8px 0 0">Klik dua kali objek untuk membukanya di Excel.</p></div>
      <div class="tips" style="margin-bottom:0">✅ Berhasil! ${st.link ? 'Jika Penjualan.xlsx berubah, objek ini dapat diperbarui (Edit Links to Files).' : 'Salinan data kini ada di dalam file presentasi, tidak bergantung pada file Excel.'}</div>`
      : `<div class="slide"><h4>Hasil Penjualan Kantin</h4><p class="muted" style="font-size:.85rem">(area kosong, tempat objek akan muncul)</p></div>`;
    el.innerHTML = `<div class="card" style="background:#fff8e8"><b>🎯 Misi:</b> (1) Sisipkan Penjualan.xlsx lewat <b>Insert → Object</b>, lalu (2) pilih cara tempel yang tepat untuk 4 situasi.</div>
    <div class="sim-area"><div class="win p"><div class="tb"><i></i><i></i><i></i> PowerPoint — Presentasi.pptx</div>${ribbon}<div class="bd">${dlg}${slide}</div></div>
    <div><div class="card" style="margin:0 0 12px;background:#fff"><b>${st.done ? '✔ Langkah selesai' : 'Langkah ' + (st.step + 1) + ' dari 5'}</b><p style="margin:6px 0 0">${st.done ? 'Sekarang kerjakan 4 situasi di bawah.' : hint[st.step]}</p></div>
    <div class="bar"><i style="width:${(st.done ? 5 : st.step) / 5 * 100}%"></i></div></div></div>
    <h3 style="margin-top:20px">Pilih cara yang paling tepat</h3><div class="grid g2">${SC.map((s, i) => {
      const r = st.sc[i];
      return `<div class="scn"><b>Situasi ${i + 1}</b><p style="margin:6px 0">${A.esc(s.t)}</p><div class="row">${['📷 Picture', '📦 Embed', '🔗 Link Data'].map((t, k) => `<button class="btn sm ${r === k ? (k === s.a ? 'green' : 'pink') : 'ghost'}" data-s="${i}:${k}">${t}</button>`).join('')}</div>
      ${r !== null ? `<div class="feedback ${r === s.a ? 'ok' : 'bad'}" style="margin-top:10px">${r === s.a ? '✅ Tepat! ' + A.esc(s.e) : '🤔 Belum tepat, coba pilihan lain.'}</div>` : ''}</div>`;
    }).join('')}</div>`;
    bind(); check();
  }
  function bind() {
    $$('[data-c]', el).forEach(b => b.onclick = () => {
      const [g, v] = b.dataset.c.split(':');
      const need = [['tab', 'Insert'], ['grp', 'Object'], ['dlg', 'file'], ['dlg', 'browse'], ['dlg', 'ok']][st.step];
      if (st.done) return;
      if (g === need[0] && v === need[1]) { if (g === 'dlg' && v === 'browse') st.file = true; if (st.step === 4) { const c = $('#cLink', el); st.link = c ? c.checked : st.link; st.done = true; } else st.step++; draw(); }
      else A.toast('Belum langkah itu. ' + hint[st.step].replace(/<[^>]+>/g, ''));
    });
    const c = $('#cLink', el); if (c) c.onchange = () => { st.link = c.checked; };
    $$('[data-s]', el).forEach(b => b.onclick = () => { const [i, k] = b.dataset.s.split(':').map(Number); st.sc[i] = k; draw(); });
  }
  function check() { if (st.done && st.sc.every((v, i) => v === SC[i].a)) A.markDone('s1'); }
  draw();
};

/* ---------- SIM 2 : Word (Heading) -> Slide ---------- */
window.SIMS.s2 = function (el, A) {
  const L = [['Pengelolaan Sampah Sekolah', 'H1'], ['Masalah Utama', 'H1'], ['Sampah plastik menumpuk di kantin', 'H2'], ['Tong sampah sering penuh', 'H2'], ['Solusi', 'H1'], ['Bank sampah di setiap kelas', 'H2'], ['Pemilahan organik dan anorganik', 'H2']];
  let sty = L.map(() => 'N');
  const OPT = [['N', 'Normal'], ['H1', 'Heading 1'], ['H2', 'Heading 2'], ['H3', 'Heading 3']];
  function slides() {
    const o = [];
    sty.forEach((s, i) => { if (s === 'H1') o.push({ t: L[i][0], p: [] }); else if ((s === 'H2' || s === 'H3') && o.length) o[o.length - 1].p.push({ t: L[i][0], lv: s === 'H3' ? 2 : 1 }); });
    return o;
  }
  function draw(msg) {
    const sl = slides();
    el.innerHTML = `<div class="card" style="background:#fff8e8"><b>🎯 Misi:</b> Atur <b>style</b> tiap baris di Word agar menjadi <b>3 slide</b>: judul-judul utama memakai Heading 1, rinciannya memakai Heading 2. Lihat hasilnya langsung di kanan seperti <i>Slides from Outline</i>.</div>
    <div class="sim-area"><div class="win w"><div class="tb"><i></i><i></i><i></i> Word — Pengelolaan-Sampah.docx</div><div class="bd">
      ${L.map((l, i) => `<div class="wline"><select data-i="${i}">${OPT.map(([v, t]) => `<option value="${v}" ${sty[i] === v ? 'selected' : ''}>${t}</option>`).join('')}</select><span class="${sty[i] === 'H1' ? 'h1' : sty[i] === 'H2' ? 'h2' : sty[i] === 'H3' ? 'h3' : ''}">${A.esc(l[0])}</span></div>`).join('')}
      <div class="row" style="margin-top:10px"><button class="btn sm green" id="bCek">✅ Cek hasil</button><button class="btn sm ghost" id="bRes">↺ Ulang</button></div></div></div>
    <div class="win p"><div class="tb"><i></i><i></i><i></i> PowerPoint — Slides from Outline</div><div class="bd">
      <p class="muted" style="margin-top:0;font-size:.85rem">${sl.length} slide terbentuk (baris bergaya Normal diabaikan)</p>
      ${sl.length ? sl.map((s, i) => `<div class="slide mini"><h4>Slide ${i + 1}: ${A.esc(s.t)}</h4>${s.p.length ? `<ul>${s.p.map(p => `<li style="margin-left:${(p.lv - 1) * 16}px">${A.esc(p.t)}</li>`).join('')}</ul>` : '<span class="muted" style="font-size:.8rem">(tanpa poin)</span>'}</div>`).join('') : '<div class="slide mini"><span class="muted">Belum ada slide. Ubah style menjadi Heading 1.</span></div>'}
    </div></div></div>${msg ? `<div class="feedback ${msg.ok ? 'ok' : 'bad'}" style="margin-top:12px">${msg.t}</div>` : ''}`;
    $$('select', el).forEach(s => s.onchange = () => { sty[+s.dataset.i] = s.value; draw(); });
    $('#bRes', el).onclick = () => { sty = L.map(() => 'N'); draw(); };
    $('#bCek', el).onclick = () => {
      const bad = L.map((l, i) => sty[i] === l[1] ? null : i).filter(x => x !== null);
      if (!bad.length) { draw({ ok: true, t: '🎉 Benar! Heading 1 menjadi judul slide, Heading 2 menjadi poin. Di PowerPoint: Home → New Slide → Slides from Outline.' }); A.markDone('s2'); }
      else draw({ ok: false, t: 'Masih ada ' + bad.length + ' baris yang belum tepat. Petunjuk: baris <b>' + (bad[0] + 1) + '</b> (“' + A.esc(L[bad[0]][0]) + '”) ' + (L[bad[0]][1] === 'H1' ? 'adalah judul bagian, jadi slide baru.' : 'adalah rincian, jadi poin di dalam slide.') });
    };
  }
  draw();
};

/* ---------- SIM 3 : Data & grafik Excel <-> slide ---------- */
function chartHTML(type, labels, vals) {
  const max = Math.max.apply(null, vals.concat([1]));
  if (type === 'kolom') return `<div class="chartbox">${vals.map(v => `<div class="b" style="height:${v / max * 100}%"><span>${v}</span></div>`).join('')}</div><div class="chartlab">${labels.map(l => `<div>${l}</div>`).join('')}</div>`;
  if (type === 'garis') {
    const px = i => 22 + i * (256 / (vals.length - 1)), py = v => 118 - (v / max) * 96, pts = vals.map((v, i) => px(i) + ',' + py(v)).join(' ');
    return `<svg viewBox="0 0 300 140" style="width:100%;height:150px"><line x1="10" y1="118" x2="290" y2="118" stroke="#cfd2ee" stroke-width="3"/>
      <polyline points="${pts}" fill="none" stroke="#6c5ce7" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
      ${vals.map((v, i) => `<circle cx="${px(i)}" cy="${py(v)}" r="5.5" fill="#ff6b9d" stroke="#fff" stroke-width="2"/><text x="${px(i)}" y="${py(v) - 10}" font-size="11" font-weight="800" text-anchor="middle" fill="#2b2d42">${v}</text>`).join('')}</svg><div class="chartlab">${labels.map(l => `<div>${l}</div>`).join('')}</div>`;
  }
  const tot = vals.reduce((a, b) => a + b, 0) || 1; let acc = 0;
  const seg = vals.map((v, i) => { const s = acc / tot * 100; acc += v; return `${COL[i % 6]} ${s}% ${acc / tot * 100}%`; }).join(',');
  return `<div class="row" style="justify-content:center"><div style="width:130px;height:130px;border-radius:50%;background:conic-gradient(${seg});box-shadow:0 6px 0 rgba(0,0,0,.1)"></div>
    <div>${labels.map((l, i) => `<div style="font-size:.82rem;font-weight:800"><span style="display:inline-block;width:12px;height:12px;border-radius:4px;background:${COL[i % 6]}"></span> ${l}: ${vals[i]}</div>`).join('')}</div></div>`;
}
window.SIMS.s3 = function (el, A) {
  const labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const st = { data: [20, 35, 28, 40, 32], type: 'kolom', paste: null, sawLine: false, changed: false, updated: false };
  function same() { return st.paste && JSON.stringify(st.paste.data) === JSON.stringify(st.data); }
  function mission() {
    const m = [
      [st.sawLine, 'Pilih jenis grafik yang tepat untuk <b>tren penjualan per hari</b> (petunjuk: perubahan dari waktu ke waktu).'],
      [st.paste && st.paste.mode === 'link', 'Tempel grafik ke slide dengan <b>Link Data</b>.'],
      [st.paste && st.paste.mode === 'link' && st.changed, 'Ubah angka di <b>Excel</b> setelah menempel.'],
      [st.paste && st.paste.mode === 'link' && st.updated && same(), 'Klik <b>Perbarui link</b> hingga slide sama dengan Excel.']
    ];
    return m.map(x => `<li>${x[0] ? '✅' : '⬜'} ${x[1]}</li>`).join('');
  }
  function info() {
    const p = st.paste; if (!p) return '<span class="pill y">Belum ada grafik di slide</span>';
    const mode = { picture: '📷 Picture', embed: '📦 Embed', link: '🔗 Link Data' }[p.mode];
    let s = `<span class="pill ${p.mode === 'link' ? 'y' : 'g'}">${mode}</span> `;
    if (!same()) s += p.mode === 'link' ? '<span class="pill r">Data berbeda dengan Excel → klik Perbarui link</span>' : '<span class="pill r">Data berbeda: ini hanya salinan, tidak ikut berubah</span>';
    else s += '<span class="pill g">Sama dengan Excel</span>';
    return s;
  }
  function refresh() {
    $('#xChart', el).innerHTML = chartHTML(st.type, labels, st.data);
    $('#sChart', el).innerHTML = st.paste ? chartHTML(st.paste.type, labels, st.paste.data) : '<p class="muted" style="margin:30px 0;text-align:center">Belum ada grafik. Salin dari Excel lalu tempel.</p>';
    $('#sInfo', el).innerHTML = info(); $('#mis', el).innerHTML = mission();
    const full = st.sawLine && st.paste && st.paste.mode === 'link' && st.changed && st.updated && same();
    if (full) A.markDone('s3');
  }
  function draw() {
    el.innerHTML = `<div class="card" style="background:#fff8e8"><b>🎯 Misi:</b><ul style="margin:6px 0 0;list-style:none;padding:0" id="mis"></ul></div>
    <div class="sim-area"><div class="win x"><div class="tb"><i></i><i></i><i></i> Excel — Penjualan.xlsx</div><div class="bd">
      <table class="xl"><tr><th>Hari</th><th>Terjual (porsi)</th></tr>${labels.map((l, i) => `<tr><td>${l}</td><td><input type="number" min="0" max="99" data-i="${i}" value="${st.data[i]}"></td></tr>`).join('')}</table>
      <label for="tp" style="margin-top:10px">Jenis grafik</label><select id="tp"><option value="kolom" ${st.type === 'kolom' ? 'selected' : ''}>📊 Kolom</option><option value="garis" ${st.type === 'garis' ? 'selected' : ''}>📈 Garis</option><option value="pie" ${st.type === 'pie' ? 'selected' : ''}>🥧 Lingkaran</option></select>
      <div id="xChart" style="margin-top:12px"></div>
      <div class="row" style="margin-top:10px"><b>Salin lalu tempel ke slide sebagai:</b></div>
      <div class="row" style="margin-top:6px"><button class="btn sm ghost" data-m="picture">📷 Picture</button><button class="btn sm ghost" data-m="embed">📦 Embed</button><button class="btn sm teal" data-m="link">🔗 Link Data</button></div></div></div>
    <div class="win p"><div class="tb"><i></i><i></i><i></i> PowerPoint — Presentasi.pptx</div><div class="bd">
      <div class="slide" style="aspect-ratio:auto;min-height:230px"><h4>Penjualan Kantin Minggu Ini</h4><div id="sChart"></div></div>
      <div style="margin:10px 0" id="sInfo"></div>
      <button class="btn sm orange" id="bUpd">🔄 Perbarui link (File → Info → Edit Links → Update Now)</button></div></div></div>`;
    $$('input[data-i]', el).forEach(i => i.oninput = () => {
      st.data[+i.dataset.i] = Math.max(0, Math.min(99, parseFloat(i.value) || 0));
      if (st.paste) { st.changed = true; st.updated = false; }
      refresh();
    });
    $('#tp', el).onchange = e => { st.type = e.target.value; if (st.type === 'garis') st.sawLine = true; else if (!st.sawLine) A.toast('Hmm, untuk melihat tren per hari jenis grafik apa yang paling cocok?'); refresh(); };
    $$('[data-m]', el).forEach(b => b.onclick = () => {
      st.paste = { mode: b.dataset.m, data: st.data.slice(), type: st.type }; st.changed = false; st.updated = false;
      A.toast({ picture: 'Picture: hanya gambar, tidak terhubung.', embed: 'Embed: salinan data ikut tersimpan di slide.', link: 'Link Data: tersambung ke Excel sumber.' }[b.dataset.m]); refresh();
    });
    $('#bUpd', el).onclick = () => {
      if (!st.paste) return A.toast('Tempel grafik ke slide dulu.');
      if (st.paste.mode !== 'link') return A.toast('Perbarui link hanya bekerja pada Link Data. Picture/Embed adalah salinan.');
      st.paste.data = st.data.slice(); st.paste.type = st.type; st.updated = true; A.toast('Link diperbarui ✅'); refresh();
    };
    refresh();
  }
  draw();
};

/* ---------- SIM 4 : Hyperlink antar dokumen ---------- */
window.SIMS.s4 = function (el, A) {
  const N = {
    m1: { file: 'Presentasi.pptx', l: 'Slide 1 · Menu', c: 'f-p', i: '📽️' },
    m2: { file: 'Presentasi.pptx', l: 'Slide 2 · Rincian', c: 'f-p', i: '📽️' },
    w: { file: 'Laporan.docx', l: 'Laporan.docx', c: 'f-w', i: '📘' },
    x1: { file: 'Anggaran.xlsx', l: 'Anggaran · Sheet Ringkasan', c: 'f-x', i: '📗' },
    x2: { file: 'Anggaran.xlsx', l: 'Anggaran · Sheet Data', c: 'f-x', i: '📗' }
  };
  const REQ = [['m1', 'm2'], ['m2', 'm1'], ['m1', 'w'], ['w', 'm1'], ['m1', 'x1'], ['x1', 'm1'], ['x1', 'x2'], ['x2', 'x1']];
  const TY = { file: 'Existing File or Web Page', place: 'Place in This Document' };
  const st = { links: [], cur: 'm1', seen: { m1: true }, msg: null };
  const rightType = (f, t) => N[f].file === N[t].file ? 'place' : 'file';
  const has = (f, t) => st.links.some(l => l.f === f && l.t === t);
  function draw() {
    const nodesOpts = Object.keys(N).map(k => `<option value="${k}">${N[k].l}</option>`).join('');
    const reqDone = REQ.filter(r => has(r[0], r[1])).length, all = reqDone === REQ.length;
    el.innerHTML = `<div class="card" style="background:#fff8e8"><b>🎯 Misi:</b> Bangun <b>navigasi 3 file</b> tanpa tersesat: menu mengarah ke Laporan dan Anggaran, tiap file punya jalan kembali ke menu, dan ada tautan antar-slide/sheet. Buat <b>8 tautan</b> yang diperlukan (setiap tujuan harus punya jalan kembali), lalu ujilah dalam mode Slide Show.</div>
    <div class="row" style="margin-bottom:14px">${Object.keys(N).map(k => `<div class="file ${N[k].c} ${st.cur === k && all ? 'on' : ''}" style="min-width:150px"><big>${N[k].i}</big>${N[k].l}</div>`).join('')}</div>
    <div class="sim-area"><div class="card" style="margin:0;background:#fff"><h3 style="margin-top:0">🔧 Insert Hyperlink (Ctrl + K)</h3>
      <label for="hf">Dari (tempat teks/tombol berada)</label><select id="hf">${nodesOpts}</select>
      <label for="ht">Tautkan ke</label><select id="ht">${nodesOpts.replace('value="m1"', 'value="m1" selected')}</select>
      <label for="hy">Jenis tautan yang dipilih</label><select id="hy"><option value="file">${TY.file}</option><option value="place">${TY.place}</option></select>
      <div class="row" style="margin-top:12px"><button class="btn" id="bMk">🔗 Buat tautan</button></div>
      ${st.msg ? `<div class="feedback ${st.msg.ok ? 'ok' : 'bad'}" style="margin-top:12px">${st.msg.t}</div>` : ''}</div>
    <div class="card" style="margin:0;background:#fff"><h3 style="margin-top:0">✅ Daftar tautan wajib (${reqDone}/${REQ.length})</h3><ul class="linklist">${REQ.map(r => `<li>${has(r[0], r[1]) ? '✅' : '⬜'} ${N[r[0]].l} → ${N[r[1]].l}</li>`).join('')}</ul>
      ${st.links.filter(l => !REQ.some(r => r[0] === l.f && r[1] === l.t)).length ? '<small class="muted">Tautan tambahan: ' + st.links.filter(l => !REQ.some(r => r[0] === l.f && r[1] === l.t)).map(l => N[l.f].l + '→' + N[l.t].l).join(', ') + '</small>' : ''}</div></div>
    ${all ? `<div class="card" style="margin-top:18px;background:#f4f1ff"><h3 style="margin-top:0">▶️ Uji dalam Slide Show</h3>
      <p>Posisi sekarang: <b>${N[st.cur].i} ${N[st.cur].l}</b>. Klik tautan untuk berpindah. Kunjungi <b>kelima</b> tempat (${Object.keys(st.seen).length}/5).</p>
      <div class="nav-sim">${st.links.filter(l => l.f === st.cur).map(l => `<button class="btn sm teal" data-n="${l.t}">➡ ${N[l.t].l}</button>`).join('') || '<span class="muted">Tidak ada tautan dari sini. Tempat ini tidak punya jalan keluar!</span>'}</div></div>` : ''}`;
    $('#bMk', el).onclick = () => {
      const f = $('#hf', el).value, t = $('#ht', el).value, ty = $('#hy', el).value;
      if (f === t) { st.msg = { ok: false, t: 'Tautan tidak boleh mengarah ke tempat yang sama.' }; return draw(); }
      const need = rightType(f, t);
      if (ty !== need) {
        st.msg = { ok: false, t: need === 'place' ? `Keduanya berada di <b>file yang sama</b> (${N[f].file}). Gunakan <b>${TY.place}</b>.` : `Tujuannya <b>file yang berbeda</b> (${N[t].file}). Gunakan <b>${TY.file}</b>.` };
        return draw();
      }
      if (has(f, t)) { st.msg = { ok: false, t: 'Tautan itu sudah dibuat.' }; return draw(); }
      st.links.push({ f, t, ty }); st.msg = { ok: true, t: '✅ Tautan dibuat: ' + N[f].l + ' → ' + N[t].l };
      draw();
    };
    $$('[data-n]', el).forEach(b => b.onclick = () => { st.cur = b.dataset.n; st.seen[st.cur] = true; draw(); if (Object.keys(st.seen).length === 5) A.markDone('s4'); });
  }
  draw();
};

/* ---------- SIM 5 : Penerapan sehari-hari ---------- */
window.SIMS.s5 = function (el, A) {
  const SC = [
    { i: '📋', t: 'Laporan kegiatan OSIS', flow: [['a', 'Word: laporan lengkap'], ['b', 'Excel: anggaran'], ['c', 'PPT: presentasi ke pembina']],
      p: ['Slides from Outline dari Heading di Word.', 'Grafik anggaran ditempel dengan Link Data.', 'Tombol “Rincian Anggaran” ditautkan ke Anggaran.xlsx.', 'Kirim satu folder utuh agar link tidak putus.'] },
    { i: '🍜', t: 'Proposal usaha kantin', flow: [['a', 'Word: proposal'], ['b', 'Excel: modal & untung'], ['c', 'PPT: pitching']],
      p: ['Grafik untung-rugi per bulan memakai grafik Garis/Kolom.', 'Ringkasan proposal diambil dari Heading 1 & 2 di Word.', 'Embed tabel Excel agar bisa diedit saat tanya jawab.', 'Hyperlink ke dokumen rincian menu.'] },
    { i: '🎨', t: 'Portofolio digital (e-portofolio)', flow: [['c', 'PPT: beranda'], ['a', 'Word: karya tulis'], ['b', 'Excel: data karya']],
      p: ['Slide beranda berisi tombol ke setiap karya.', 'Setiap karya punya tombol “Kembali ke beranda”.', 'Semua file disimpan dalam satu folder yang sama.', 'Gunakan Action Button agar navigasi rapi.'] },
    { i: '📈', t: 'Presentasi hasil survei kelas', flow: [['b', 'Excel: jawaban survei'], ['c', 'PPT: grafik hasil'], ['a', 'Word: kesimpulan']],
      p: ['Grafik tertaut (Link Data) agar ikut berubah saat data bertambah.', 'Bila data memuat identitas, bagikan grafik sebagai Picture.', 'Pilih jenis grafik sesuai tujuan: bandingkan, tren, atau proporsi.', 'Kesimpulan diketik di Word, lalu dijadikan poin slide.'] }
  ];
  const seen = {};
  let idea = '';
  function draw() {
    const n = Object.keys(seen).length, ok = n === 4;
    el.innerHTML = `<div class="card" style="background:#fff8e8"><b>🎯 Misi:</b> Buka keempat contoh penerapan, lalu tuliskan <b>idemu sendiri</b> untuk memakai integrasi Office dan hyperlink di sekolah atau kehidupan sehari-hari.</div>
    <div class="grid g2">${SC.map((s, i) => `<div class="scn"><div class="row"><span style="font-size:2rem">${s.i}</span><b style="font-size:1.1rem">${s.t}</b><span class="spacer"></span>${seen[i] ? '<span class="badge green">✓ dibuka</span>' : ''}</div>
      <div class="flow">${s.flow.map((f, k) => `${k ? '<em>→</em>' : ''}<span class="${f[0]}">${f[1]}</span>`).join('')}</div>
      ${seen[i] ? `<ul style="margin:8px 0 0">${s.p.map(x => `<li>${A.esc(x)}</li>`).join('')}</ul>` : `<button class="btn sm" data-o="${i}">👀 Lihat penerapan</button>`}</div>`).join('')}</div>
    <div class="card" style="margin-top:18px;background:#fff"><h3 style="margin-top:0">💡 Ideku sendiri</h3>
      <label for="idea">Aku akan memakai Word + Excel + PowerPoint + hyperlink untuk … (jelaskan fiturnya)</label>
      <textarea id="idea" maxlength="400" ${ok ? '' : 'disabled'} placeholder="${ok ? 'Contoh: Membuat laporan praktikum IPA …' : 'Buka dulu keempat contoh di atas.'}">${A.esc(idea)}</textarea>
      <div class="row" style="margin-top:12px"><button class="btn green" id="bIde" ${ok ? '' : 'disabled'}>💾 Simpan ide & selesaikan</button><span class="muted">Dibuka ${n}/4</span></div></div>`;
    $$('[data-o]', el).forEach(b => b.onclick = () => { seen[+b.dataset.o] = true; draw(); });
    const t = $('#idea', el); if (t) t.oninput = () => { idea = t.value; };
    const bi = $('#bIde', el); if (bi) bi.onclick = () => {
      if (idea.trim().length < 20) return A.toast('Tuliskan idemu minimal 20 karakter ya.');
      A.setHasil('Ide_Penerapan', idea.trim()); A.markDone('s5');
    };
  }
  draw();
};
})();
