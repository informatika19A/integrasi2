/* ============================================================
   APLIKASI UTAMA — Media Belajar Integrasi Office
   ============================================================ */
(function () {
'use strict';
const C = window.CONFIG, D = window.DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const LET = ['A', 'B', 'C', 'D', 'E'];
const round1 = n => Math.round(n * 10) / 10;
const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

/* ---------------- state ---------------- */
const fresh = () => ({ siswa: null, hasil: {}, materi: {}, sim: {}, kuis: {}, refleksi: null });
let S = null;
(function loadCurrent() {
  const cur = LS.get('mio_current', null), all = LS.get('mio_users', {});
  S = (cur && all[cur]) ? all[cur] : null;
})();
function saveS() {
  if (!S || !S.siswa) return;
  const key = S.siswa.kelas + '_' + S.siswa.nis, all = LS.get('mio_users', {});
  all[key] = S; LS.set('mio_users', all); LS.set('mio_current', key);
}
const RUN = {};            // sesi tes yang sedang berjalan (tidak disimpan)
let KUIS = null;           // sesi kuis berjalan
let simTab = 's1', matTab = 'tp1';

/* ---------------- skor, xp ---------------- */
const has = v => v !== undefined && v !== null && v !== '';
const nMateri = () => Object.values(S.materi).filter(Boolean).length;
const nSim = () => Object.values(S.sim).filter(Boolean).length;
const nKuis = () => ['mudah', 'sedang', 'rumit'].filter(k => S.kuis[k]).length;
function xp() {
  if (!S) return 0;
  let x = 0;
  if (has(S.hasil.Pre_Total)) x += 50;
  x += nMateri() * 20 + nSim() * 40;
  ['mudah', 'sedang', 'rumit'].forEach(k => { if (S.kuis[k]) x += S.kuis[k].best * 10; });
  if (has(S.hasil.Post_Total)) x += 100;
  if (S.refleksi) x += 50;
  return x;
}
const lvl = () => Math.floor(xp() / 100) + 1;
function gelar() {
  const x = xp();
  return x >= 600 ? 'Legenda Office 👑' : x >= 450 ? 'Master Integrasi 🏆' : x >= 300 ? 'Mahir 🚀' : x >= 100 ? 'Penjelajah 🧭' : 'Pemula 🌱';
}
function nGain(pre, post) {
  if (pre >= 100) return post >= 100 ? 1 : 0;
  return Math.max(-1, Math.round(((post - pre) / (100 - pre)) * 100) / 100);
}
const katGain = g => g >= 0.7 ? 'Tinggi' : g >= 0.3 ? 'Sedang' : 'Rendah';
function statusText() {
  if (S.refleksi) return 'Selesai';
  if (has(S.hasil.Post_Total)) return 'Post-test selesai';
  if (has(S.hasil.Pre_Total)) return 'Sedang belajar';
  return 'Baru masuk';
}
function progressAll() {
  const p = (has(S.hasil.Pre_Total) ? 1 : 0) + nMateri() / 4 + nSim() / 5 + nKuis() / 3 + (has(S.hasil.Post_Total) ? 1 : 0) + (S.refleksi ? 1 : 0);
  return Math.round(p / 6 * 100);
}

/* ---------------- sinkron ke Google Sheet ---------------- */
let online = null;
const outbox = () => LS.get('mio_outbox', []);
function setOnline(v) { online = v; const e = $('#syncChip'); if (e) paintSync(e); }
function paintSync(e) {
  if (!C.SCRIPT_URL) { e.className = 'sync off'; e.textContent = '💾 Mode lokal'; return; }
  e.className = 'sync ' + (online === false ? 'off' : 'on');
  e.textContent = online === false ? '⏳ Menunggu jaringan' : '☁️ Tersimpan ke Sheet';
}
function post(p) {
  return fetch(C.SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(p) });
}
function flushOutbox() {
  if (!C.SCRIPT_URL) return;
  const q = outbox(); if (!q.length) return;
  LS.set('mio_outbox', []);
  q.forEach(p => post(p).then(() => setOnline(true)).catch(() => { LS.set('mio_outbox', outbox().concat([p])); setOnline(false); }));
}
function localDb() { return LS.get('mio_db', { siswa: [], refleksi: [] }); }
function localUpsert(payload) {
  const db = localDb(), s = payload.siswa;
  if (payload.action === 'save') {
    let r = db.siswa.find(x => String(x.NIS) === String(s.nis) && x.Kelas === s.kelas);
    if (!r) { r = { Nama: s.nama, NIS: s.nis, Kelas: s.kelas }; db.siswa.push(r); }
    r.Nama = s.nama; r.Tanggal = s.tanggal; r.Waktu_Update = new Date().toLocaleString('id-ID');
    Object.assign(r, payload.data);
  } else if (payload.action === 'refleksi') {
    db.refleksi = db.refleksi.filter(x => !(String(x.NIS) === String(s.nis) && x.Kelas === s.kelas));
    db.refleksi.push(Object.assign({ Nama: s.nama, NIS: s.nis, Kelas: s.kelas, Waktu: new Date().toLocaleString('id-ID') }, payload.data));
  }
  LS.set('mio_db', db);
}
function sync(action, data) {
  if (!S || !S.siswa) return;
  S.hasil.Status = statusText();
  S.hasil.Materi = nMateri() + '/4'; S.hasil.Simulasi = nSim() + '/5';
  const k = ['mudah', 'sedang', 'rumit'];
  k.forEach(x => { if (S.kuis[x]) S.hasil['Kuis_' + x[0].toUpperCase() + x.slice(1)] = S.kuis[x].best * 20; });
  if (nKuis() > 0) S.hasil.Kuis_Total = round1(k.reduce((a, x) => a + (S.kuis[x] ? S.kuis[x].best * 20 : 0), 0) / 3);
  S.hasil.XP = xp();
  saveS();
  const payload = { action: action || 'save', siswa: S.siswa, data: data || S.hasil, waktu: new Date().toISOString() };
  if (!C.SCRIPT_URL) { localUpsert(payload); return; }
  flushOutbox();
  post(payload).then(() => setOnline(true)).catch(() => { LS.set('mio_outbox', outbox().concat([payload])); setOnline(false); });
}

/* ---------------- UI umum ---------------- */
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); }
function confetti() { /* animasi dinonaktifkan agar ringan di HP */ }

function setApp(html) { const a = $('#app'); a.innerHTML = `<div>${html}</div>`; window.scrollTo(0, 0); }
function go(v) { if (location.hash === '#' + v) route(); else location.hash = v; }

function renderTop() {
  const t = $('#topbar');
  t.innerHTML = `<div class="logo" data-go="home"><b>🧊</b><div>${esc(C.JUDUL)}<small>${esc(C.MAPEL)}</small></div></div><div class="spacer"></div>` +
    (S && S.siswa ? `<span class="chip">👤 ${esc(S.siswa.nama)} · ${esc(S.siswa.kelas)}</span><span class="chip xp">⭐ ${xp()} XP · Lv ${lvl()}</span>
     <span class="sync" id="syncChip"></span>
     <button class="btn ghost sm" data-go="home">🏠 Beranda</button><button class="btn pink sm" id="btnOut">Keluar</button>`
      : `<span class="sync" id="syncChip"></span>`);
  const e = $('#syncChip'); if (e) paintSync(e);
  $('#foot').innerHTML = `© ${new Date().getFullYear()} Media Belajar ${esc(C.MAPEL)} · dibuat dengan ♥ untuk murid hebat`;
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.dataset.go); return; }
  if (e.target.id === 'btnOut') { if (confirm('Keluar dari akun ini? Progres tetap tersimpan di perangkat ini.')) { LS.set('mio_current', null); S = null; go('login'); } }
});

/* ============================================================
   LOGIN
   ============================================================ */
function viewLogin() {
  renderTop();
  setApp(`
  <div class="hero">
    <div>
      <span class="badge pink">${esc(C.MAPEL)}</span>
      <h1>Belajar <span class="grad">${esc(C.JUDUL)}</span><br>jadi seru dan nyata! ✨</h1>
      <p class="muted" style="font-size:1.1rem">Pelajari cara menghubungkan <b>PowerPoint</b>, <b>Word</b>, dan <b>Excel</b>, lalu pakai <b>hyperlink</b> untuk membuat karya digital yang rapi, cepat, dan keren.</p>
      <div class="logos"><span class="lg w">W</span><span class="lg x">X</span><span class="lg p">P</span></div>
    </div>
    <form class="card" id="fLogin" autocomplete="off">
      <h2>👋 Yuk, masuk dulu!</h2>
      <label for="nama">Nama lengkap</label><input type="text" id="nama" placeholder="Contoh: Lestari Ayu" required maxlength="60">
      <label for="nis">NIS</label><input type="text" id="nis" inputmode="numeric" placeholder="Nomor Induk Siswa (4 digit)" required maxlength="15">
      <label for="tgl">Tanggal</label><input type="date" id="tgl" required value="${todayISO()}">
      <label for="kls">Kelas</label>
      <select id="kls" required><option value=""> Pilih kelas </option>${C.KELAS.map(k => `<option>${esc(k)}</option>`).join('')}</select>
      <div class="err" id="eLogin"></div>
      <div class="row" style="margin-top:16px"><button class="btn" type="submit">🚀 Mulai Belajar</button>
      <button class="btn ghost sm" type="button" data-go="guru">🔐 Dashboard Guru</button></div>
    </form>
  </div>`);
  $('#fLogin').onsubmit = e => {
    e.preventDefault();
    const nama = $('#nama').value.trim().replace(/\s+/g, ' '), nis = $('#nis').value.trim(), tgl = $('#tgl').value, kls = $('#kls').value, er = $('#eLogin');
    if (nama.length < 3) return er.textContent = 'Nama minimal 3 huruf ya.';
    if (!/^\d{4,15}$/.test(nis)) return er.textContent = 'NIS harus berupa angka (4–15 digit).';
    if (!tgl) return er.textContent = 'Tanggal belum diisi.';
    if (!kls) return er.textContent = 'Pilih kelas terlebih dahulu.';
    const key = kls + '_' + nis, all = LS.get('mio_users', {});
    S = all[key] || fresh(); S.siswa = { nama, nis, kelas: kls, tanggal: tgl };
    S.hasil.Status = statusText(); saveS(); sync();
    toast('Selamat datang, ' + nama.split(' ')[0] + '! 🎉'); go('home');
  };
}

/* ============================================================
   BERANDA
   ============================================================ */
function stageInfo() {
  const preDone = has(S.hasil.Pre_Total), postDone = has(S.hasil.Post_Total), R = C.SYARAT_POSTTEST;
  const postOK = preDone && nMateri() >= R.materi && nSim() >= R.simulasi && nKuis() >= R.kuis;
  return [
    { id: 'pretest', ico: '🧪', t: 'Pre-test', d: 'Cek kemampuan awalmu (10 soal)', c: ['#ff6b9d', '#ff95b8', '#d63c74'], open: true, st: preDone ? 'Skor ' + S.hasil.Pre_Total : 'Mulai di sini' },
    { id: 'materi', ico: '📚', t: 'Materi', d: '4 tujuan belajar lengkap dengan langkah & tips', c: ['#6c5ce7', '#8b7bff', '#4b3fc2'], open: preDone, st: nMateri() + '/4' },
    { id: 'sim', ico: '🕹️', t: 'Simulasi', d: 'Praktik interaktif + penerapan sehari-hari', c: ['#00c2b8', '#46ddd3', '#00877f'], open: preDone, st: nSim() + '/5' },
    { id: 'kuis', ico: '🎮', t: 'Kuis Interaktif', d: 'Mudah → Sedang → Rumit', c: ['#ff8f3f', '#ffb277', '#cc5f10'], open: preDone, st: nKuis() + '/3 level' },
    { id: 'posttest', ico: '🏁', t: 'Post-test', d: 'Buktikan perkembanganmu (20 soal)', c: ['#4dabf7', '#8cc9fb', '#1f7fcc'], open: postOK, st: postDone ? 'Skor ' + S.hasil.Post_Total : (postOK ? 'Siap!' : 'Terkunci') },
    { id: 'refleksi', ico: '🪞', t: 'Refleksi Diri', d: 'Kenali cara belajarmu (metakognisi)', c: ['#2ecc71', '#6fe3a2', '#1a9b52'], open: postDone, st: S.refleksi ? 'Selesai' : (postDone ? 'Siap!' : 'Terkunci') }
  ];
}
function viewHome() {
  renderTop();
  const st = stageInfo(), pr = progressAll(), R = C.SYARAT_POSTTEST;
  const next = st.find(s => s.open && !((s.id === 'pretest' && has(S.hasil.Pre_Total)) || (s.id === 'materi' && nMateri() >= 4) || (s.id === 'sim' && nSim() >= 5) || (s.id === 'kuis' && nKuis() >= 3) || (s.id === 'posttest' && has(S.hasil.Post_Total)) || (s.id === 'refleksi' && S.refleksi)));
  setApp(`
  <div class="card welcome">
    <div class="avatar">${esc(S.siswa.nama.charAt(0).toUpperCase())}</div>
    <div style="flex:1;min-width:230px">
      <h2 style="margin:0">Halo, ${esc(S.siswa.nama.split(' ')[0])}! 👋</h2>
      <div class="muted">Gelar kamu: <b>${gelar()}</b> · ${xp()} XP · Kelas ${esc(S.siswa.kelas)}</div>
      <div class="bar" style="margin-top:10px"><i style="width:${pr}%"></i></div>
      <small class="muted">Progres belajar ${pr}%</small>
    </div>
    ${next ? `<button class="btn sun" data-go="${next.id}">${next.ico} Lanjut: ${next.t}</button>` : `<span class="badge green">Semua tahap selesai! 🎉</span>`}
  </div>
  <div class="grid g3 tg">${st.map(s => `
    <button class="tile ${s.open ? '' : 'locked'}" style="--t1:${s.c[0]};--t2:${s.c[1]};--t3:${s.c[2]}" data-act="${s.id}" ${s.open ? '' : 'aria-disabled="true"'}>
      <span class="state">${s.open ? s.st : '🔒 ' + s.st}</span>
      <div class="ico">${s.ico}</div><h3>${s.t}</h3><p>${s.d}</p>
    </button>`).join('')}</div>
  <div class="card" style="margin-top:22px"><h3>🎯 Tujuan pembelajaran</h3>
    <ol><li>Menggunakan fitur integrasi PowerPoint dengan Word dan Excel.</li>
    <li>Membuat teks di halaman dokumen Word dan mengintegrasikannya ke slide presentasi.</li>
    <li>Mengintegrasikan data dan grafik pada slide presentasi dan lembar kerja Excel.</li>
    <li>Menggunakan hyperlink untuk menghubungkan dokumen, lembar kerja, dan slide presentasi.</li></ol>
    <p class="muted" style="margin-bottom:0">🔓 Syarat Post-test: baca ${R.materi} materi, selesaikan ${R.simulasi} simulasi, dan coba ${R.kuis} level kuis.</p></div>`);
  $$('.tile').forEach(t => t.onclick = () => {
    const s = st.find(x => x.id === t.dataset.act);
    if (!s.open) return toast(s.id === 'posttest' ? `Selesaikan dulu: materi ${nMateri()}/${R.materi}, simulasi ${nSim()}/${R.simulasi}, kuis ${nKuis()}/${R.kuis}` : s.id === 'refleksi' ? 'Selesaikan Post-test dulu ya 🙂' : 'Kerjakan Pre-test dulu ya 🙂');
    go(s.id);
  });
}

/* ============================================================
   TES (PRE & POST)
   ============================================================ */
function buildPages(key) {
  const T = D[key], pages = [];
  const mk = (it, type) => ({ type, q: it.q, ord: shuffle([0, 1, 2, 3, 4]), o: it.o, a: it.a });
  T.pg.forEach(it => pages.push(mk(it, 'pg')));
  T.pgk.forEach(it => pages.push(mk(it, 'pgk')));
  if (T.jodoh) pages.push({ type: 'jodoh', intro: T.jodoh.intro, premis: T.jodoh.premis, pilihan: T.jodoh.pilihan, ord: shuffle(T.jodoh.pilihan.map((_, i) => i)), kunci: T.jodoh.kunci });
  (T.isian || []).forEach(it => pages.push({ type: 'isian', q: it.q, jawab: it.jawab }));
  return pages;
}
const SEC = { pg: ['Pilihan Ganda', 'pink'], pgk: ['Pilihan Ganda Kompleks', 'orange'], jodoh: ['Menjodohkan', 'teal'], isian: ['Isian Singkat', 'sun'] };
function answered(p, a) {
  if (p.type === 'pg') return a !== undefined;
  if (p.type === 'pgk') return Array.isArray(a) && a.length > 0;
  if (p.type === 'jodoh') return Array.isArray(a) && a.length === p.premis.length && a.every(x => x !== undefined && x !== -1);
  return !!(a && a.trim());
}
function viewTest(key) {
  renderTop();
  const isPre = key === 'pretest', label = isPre ? 'Pre-test' : 'Post-test';
  const done = isPre ? has(S.hasil.Pre_Total) : has(S.hasil.Post_Total);
  if (done) return viewTestResult(key);
  if (!isPre && !stageInfo()[4].open) { toast('Post-test masih terkunci.'); return go('home'); }
  if (!RUN[key]) RUN[key] = { pages: buildPages(key), ans: {}, i: 0 };
  const R = RUN[key], P = R.pages[R.i], n = R.pages.length;
  const sec = SEC[P.type];
  let body = '';
  if (P.type === 'pg' || P.type === 'pgk') {
    const a = R.ans[R.i];
    body = `<div class="qtext">${esc(P.q)}</div>${P.type === 'pgk' ? '<div class="hint-hand">☑️ Pilih SEMUA jawaban yang benar (boleh lebih dari satu).</div>' : ''}` +
      P.ord.map((oi, k) => {
        const sel = P.type === 'pg' ? a === oi : (a || []).includes(oi);
        return `<button class="opt ${sel ? 'sel' : ''}" data-oi="${oi}"><span class="k">${P.type === 'pgk' ? (sel ? '✓' : LET[k]) : LET[k]}</span><span>${esc(P.o[oi])}</span></button>`;
      }).join('');
  } else if (P.type === 'jodoh') {
    const a = R.ans[R.i] || [];
    body = `<div class="qtext">${esc(P.intro)}</div>` + P.premis.map((pr, r) => `
      <div class="match-row"><div class="prem">${r + 1}. ${esc(pr)}</div>
      <select data-r="${r}"><option value="-1">— pilih pasangan —</option>${P.ord.map(oi => `<option value="${oi}" ${a[r] === oi ? 'selected' : ''}>${esc(P.pilihan[oi])}</option>`).join('')}</select></div>`).join('') +
      `<div class="hint-hand">Satu pilihan boleh dipakai untuk satu pasangan saja. Ada pilihan pengecoh.</div>`;
  } else {
    body = `<div class="qtext">${esc(P.q)}</div><input type="text" id="isian" placeholder="Ketik jawabanmu…" value="${esc(R.ans[R.i] || '')}" autocomplete="off">`;
  }
  const dots = R.pages.map((p, k) => `<i class="${answered(p, R.ans[k]) ? 'done' : ''} ${k === R.i ? 'now' : ''}" data-k="${k}">${k + 1}</i>`).join('');
  const last = R.i === n - 1, un = R.pages.filter((p, k) => !answered(p, R.ans[k])).length;
  setApp(`<div class="card">
    <div class="qhead"><span class="badge ${isPre ? 'pink' : ''}">${label}</span><span class="badge ${sec[1]}">${sec[0]}</span><span class="spacer"></span><b>Halaman ${R.i + 1} / ${n}</b></div>
    <div class="dots">${dots}</div>${body}
    <div class="row" style="margin-top:14px">
      <button class="btn ghost" id="bPrev" ${R.i === 0 ? 'disabled' : ''}>◀ Sebelumnya</button><span class="spacer"></span>
      ${last ? `<button class="btn green" id="bSubmit">✅ Kirim Jawaban${un ? ` (${un} belum dijawab)` : ''}</button>` : `<button class="btn" id="bNext">Lanjut ▶</button>`}
    </div></div>`);
  $$('.opt').forEach(b => b.onclick = () => {
    const oi = +b.dataset.oi;
    if (P.type === 'pg') R.ans[R.i] = oi;
    else { const s = new Set(R.ans[R.i] || []); s.has(oi) ? s.delete(oi) : s.add(oi); R.ans[R.i] = [...s]; }
    viewTest(key);
  });
  $$('select[data-r]').forEach(s => s.onchange = () => { const a = R.ans[R.i] || P.premis.map(() => -1); a[+s.dataset.r] = +s.value; R.ans[R.i] = a; $$('.dots i')[R.i].className = 'now ' + (answered(P, a) ? 'done' : ''); });
  const inp = $('#isian'); if (inp) { inp.oninput = () => { R.ans[R.i] = inp.value; $$('.dots i')[R.i].className = 'now ' + (answered(P, inp.value) ? 'done' : ''); }; inp.focus(); }
  $$('.dots i').forEach(d => d.onclick = () => { R.i = +d.dataset.k; viewTest(key); });
  $('#bPrev').onclick = () => { R.i--; viewTest(key); };
  if ($('#bNext')) $('#bNext').onclick = () => { R.i++; viewTest(key); };
  if ($('#bSubmit')) $('#bSubmit').onclick = () => { if (un && !confirm(`Masih ada ${un} halaman yang belum dijawab. Tetap kirim?`)) return; submitTest(key); };
}
function sameSet(a, b) { a = [...(a || [])].sort(); b = [...b].sort(); return a.length === b.length && a.every((v, i) => v === b[i]); }
function submitTest(key) {
  const R = RUN[key], isPre = key === 'pretest', sc = { pg: 0, pgk: 0, jodoh: 0, isian: 0 };
  const cnt = { pg: 0, pgk: 0, jodoh: 0, isian: 0 };
  R.pages.forEach((p, k) => {
    const a = R.ans[k];
    if (p.type === 'pg') { cnt.pg++; if (a === p.a) sc.pg++; }
    else if (p.type === 'pgk') { cnt.pgk++; if (sameSet(a, p.a)) sc.pgk++; }
    else if (p.type === 'jodoh') { p.kunci.forEach((ko, r) => { cnt.jodoh++; if (a && a[r] === ko) sc.jodoh++; }); }
    else { cnt.isian++; if (a && p.jawab.map(norm).includes(norm(a))) sc.isian++; }
  });
  if (isPre) {
    S.hasil.Pre_PG = sc.pg * 10; S.hasil.Pre_PGK = sc.pgk * 10; S.hasil.Pre_Total = S.hasil.Pre_PG + S.hasil.Pre_PGK;
  } else {
    S.hasil.Post_PG = sc.pg * 4; S.hasil.Post_PGK = sc.pgk * 6; S.hasil.Post_Jodoh = sc.jodoh * 5; S.hasil.Post_Isian = round1(sc.isian * 7.5);
    S.hasil.Post_Total = round1(S.hasil.Post_PG + S.hasil.Post_PGK + S.hasil.Post_Jodoh + S.hasil.Post_Isian);
    const g = nGain(S.hasil.Pre_Total || 0, S.hasil.Post_Total); S.hasil.N_Gain = g; S.hasil.Kategori_NGain = katGain(g);
  }
  S.detail = S.detail || {}; S.detail[key] = { sc, cnt };
  delete RUN[key]; sync(); confetti(isPre ? 70 : 150);
  viewTestResult(key);
}
function viewTestResult(key) {
  renderTop();
  const isPre = key === 'pretest', H = S.hasil, tot = isPre ? H.Pre_Total : H.Post_Total;
  const rows = isPre
    ? [['Pilihan Ganda', H.Pre_PG, 50], ['Pilihan Ganda Kompleks', H.Pre_PGK, 50]]
    : [['Pilihan Ganda', H.Post_PG, 40], ['Pilihan Ganda Kompleks', H.Post_PGK, 30], ['Menjodohkan', H.Post_Jodoh, 15], ['Isian Singkat', H.Post_Isian, 15]];
  let extra = '';
  if (!isPre && has(H.Pre_Total)) {
    extra = `<div class="card" style="background:#f4f1ff"><h3>📈 Perkembanganmu</h3>
      <div class="cmp"><span>Pre-test</span><div class="tr"><i style="width:${H.Pre_Total}%;background:var(--pink)"></i></div><span></span><b>${H.Pre_Total}</b></div>
      <div class="cmp"><span>Post-test</span><div class="tr"><i style="width:${H.Post_Total}%;background:var(--teal)"></i></div><span></span><b>${H.Post_Total}</b></div>
      <p>Kenaikan: <b>${round1(H.Post_Total - H.Pre_Total) >= 0 ? '+' : ''}${round1(H.Post_Total - H.Pre_Total)}</b> poin · N-Gain <b>${H.N_Gain}</b> (${H.Kategori_NGain})</p></div>`;
  }
  const pesan = tot >= 90 ? 'Luar biasa! Kamu sudah sangat paham. 🌟' : tot >= C.KKM ? 'Hebat! Kamu sudah tuntas. Terus asah ya! 💪' : isPre ? 'Tidak apa-apa, ini baru titik awal. Pelajari materinya dan lihat perkembanganmu! 🌱' : 'Jangan menyerah. Ulangi materi & simulasi, lalu diskusikan bagian sulit dengan gurumu. 🔁';
  setApp(`<div class="card center"><span class="badge ${isPre ? 'pink' : ''}">${isPre ? 'Pre-test' : 'Post-test'} selesai</span>
    <div class="scorebox" style="--p:${Math.min(100, tot)}%"><span>${tot}</span></div>
    <div class="stars">${tot >= 90 ? '⭐⭐⭐' : tot >= C.KKM ? '⭐⭐' : '⭐'}</div>
    <p style="font-size:1.1rem;font-weight:700">${pesan}</p>
    <div class="tablewrap" style="max-width:520px;margin:12px auto"><table class="tbl" style="margin:0"><tr><th>Bagian</th><th>Skor</th><th>Maks</th></tr>${rows.map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td><td>${r[2]}</td></tr>`).join('')}</table></div>
    <div class="row" style="justify-content:center;margin-top:14px">
      <button class="btn" data-go="${isPre ? 'materi' : 'refleksi'}">${isPre ? '📚 Belajar Materi' : '🪞 Lanjut Refleksi'}</button>
      <button class="btn ghost" data-go="home">🏠 Beranda</button></div></div>${extra}`);
}

/* ============================================================
   MATERI
   ============================================================ */
function viewMateri() {
  renderTop();
  const m = D.materi.find(x => x.id === matTab) || D.materi[0];
  setApp(`<div class="card"><h2>📚 Materi Pembelajaran</h2><p class="muted">Baca satu per satu, lalu tekan <b>“Saya sudah paham”</b> pada setiap tujuan.</p>
    <div class="tabs">${D.materi.map((x, i) => `<div class="tab ${x.id === m.id ? 'on' : ''} ${S.materi[x.id] ? 'done' : ''}" style="--c:${x.warna}" data-id="${x.id}">${x.ikon} Tujuan ${i + 1}</div>`).join('')}</div>
    <div class="bar"><i style="width:${nMateri() / 4 * 100}%"></i></div></div>
    <div class="card materi"><span class="badge" style="background:${m.warna};color:#fff">Tujuan ${D.materi.indexOf(m) + 1}</span>
    <h2>${m.ikon} ${esc(m.judul)}</h2>${m.html}
    <div class="row" style="margin-top:20px">
      <button class="btn green" id="bPaham" ${S.materi[m.id] ? 'disabled' : ''}>${S.materi[m.id] ? '✓ Sudah dipahami' : '✅ Saya sudah paham'}</button>
      <button class="btn teal" data-go="sim">🕹️ Coba di Simulasi</button><span class="spacer"></span>
      <button class="btn ghost" data-go="home">🏠 Beranda</button></div></div>`);
  $$('.tab').forEach(t => t.onclick = () => { matTab = t.dataset.id; viewMateri(); });
  $('#bPaham').onclick = () => {
    S.materi[m.id] = true; sync(); toast('Mantap! +20 XP 🎉');
    const nx = D.materi.find(x => !S.materi[x.id]); if (nx) matTab = nx.id; else confetti(100);
    viewMateri();
  };
}

/* ============================================================
   SIMULASI (isi simulasi ada di sims.js)
   ============================================================ */
const SIMS_LIST = [
  ['s1', '🧩 1. Integrasi & Insert Object'], ['s2', '📝 2. Word → Slide'], ['s3', '📊 3. Data & Grafik'],
  ['s4', '🔗 4. Hyperlink'], ['s5', '🏠 5. Penerapan Sehari-hari']
];
const API = {
  esc, toast, confetti, shuffle, LET,
  isDone: id => !!S.sim[id],
  setHasil(k, v) { S.hasil[k] = v; },
  markDone(id) { if (S.sim[id]) return; S.sim[id] = true; sync(); toast('Simulasi selesai! +40 XP 🎉'); confetti(110); renderTop(); const t = $(`.tab[data-id="${id}"]`); if (t) t.classList.add('done'); const b = $('#simStatus'); if (b) b.innerHTML = '<span class="badge green">✓ Selesai</span>'; }
};
function viewSim() {
  renderTop();
  setApp(`<div class="card"><h2>🕹️ Simulasi Interaktif</h2><p class="muted">Praktik langsung seperti di aplikasi sebenarnya. Selesaikan misi pada tiap tab untuk mendapat XP.</p>
    <div class="tabs">${SIMS_LIST.map(([id, t]) => `<div class="tab ${id === simTab ? 'on' : ''} ${S.sim[id] ? 'done' : ''}" data-id="${id}">${t}</div>`).join('')}</div>
    <div class="bar"><i style="width:${nSim() / 5 * 100}%"></i></div></div>
    <div class="card"><div class="row"><h3 style="margin:0">${SIMS_LIST.find(x => x[0] === simTab)[1]}</h3><span class="spacer"></span><span id="simStatus">${S.sim[simTab] ? '<span class="badge green">✓ Selesai</span>' : '<span class="badge sun">Misi belum selesai</span>'}</span></div>
    <div id="simBody" style="margin-top:12px"></div></div>
    <div class="row"><button class="btn ghost" data-go="home">🏠 Beranda</button><button class="btn" data-go="kuis">🎮 Ke Kuis</button></div>`);
  $$('.tab').forEach(t => t.onclick = () => { simTab = t.dataset.id; viewSim(); });
  if (window.SIMS && window.SIMS[simTab]) window.SIMS[simTab]($('#simBody'), API);
  else $('#simBody').textContent = 'Simulasi belum dimuat.';
}

/* ============================================================
   KUIS 3 LEVEL
   ============================================================ */
const LV = {
  mudah: { t: 'Mudah', ico: '🌱', c: ['#2ecc71', '#6fe3a2', '#1a9b52'], d: 'Konsep dasar' },
  sedang: { t: 'Sedang', ico: '🔥', c: ['#ff8f3f', '#ffb277', '#cc5f10'], d: 'Pemahaman langkah & fungsi' },
  rumit: { t: 'Rumit', ico: '🚀', c: ['#6c5ce7', '#8b7bff', '#4b3fc2'], d: 'Studi kasus & analisis' }
};
function viewKuis() {
  renderTop();
  if (KUIS && !KUIS.done) return viewKuisQ();
  const keys = ['mudah', 'sedang', 'rumit'];
  setApp(`<div class="card"><h2>🎮 Kuis Interaktif</h2><p class="muted">Tiga level, masing-masing 5 soal dengan 5 opsi. Kamu langsung tahu benar/salahnya beserta penjelasannya. Level berikutnya terbuka setelah level sebelumnya diselesaikan.</p></div>
  <div class="grid g3">${keys.map((k, i) => {
    const open = i === 0 || !!S.kuis[keys[i - 1]], b = S.kuis[k];
    return `<button class="tile ${open ? '' : 'locked'}" style="--t1:${LV[k].c[0]};--t2:${LV[k].c[1]};--t3:${LV[k].c[2]}" data-k="${k}">
      <span class="state">${open ? (b ? 'Terbaik ' + b.best + '/5' : 'Siap!') : '🔒 Terkunci'}</span>
      <div class="ico">${LV[k].ico}</div><h3>Level ${LV[k].t}</h3><p>${LV[k].d}</p>${b ? '<p style="margin-top:6px">' + '⭐'.repeat(Math.max(1, Math.round(b.best / 5 * 3))) + '</p>' : ''}</button>`;
  }).join('')}</div>
  <div class="row" style="margin-top:20px"><button class="btn ghost" data-go="home">🏠 Beranda</button></div>`);
  $$('.tile').forEach(t => t.onclick = () => {
    const i = keys.indexOf(t.dataset.k);
    if (i > 0 && !S.kuis[keys[i - 1]]) return toast('Selesaikan level sebelumnya dulu ya 🙂');
    const k = t.dataset.k;
    KUIS = { k, qs: D.kuis[k].map(q => ({ q, ord: shuffle([0, 1, 2, 3, 4]) })), i: 0, benar: 0, pick: null, streak: 0, done: false };
    viewKuisQ();
  });
}
function viewKuisQ() {
  renderTop();
  const K = KUIS, it = K.qs[K.i], q = it.q, L = LV[K.k], n = K.qs.length;
  const ans = K.pick !== null;
  setApp(`<div class="card"><div class="qhead"><span class="badge" style="background:${L.c[0]};color:#fff">${L.ico} Level ${L.t}</span><span class="spacer"></span>
    <span class="chip">🔥 Beruntun ${K.streak}</span><b>Soal ${K.i + 1}/${n}</b></div>
    <div class="bar" style="margin-bottom:12px"><i style="width:${(K.i + (ans ? 1 : 0)) / n * 100}%"></i></div>
    <div class="qtext">${esc(q.q)}</div>
    ${it.ord.map((oi, k) => {
      let cl = ''; if (ans) { if (oi === q.a) cl = 'ok'; else if (oi === K.pick) cl = 'bad'; }
      return `<button class="opt ${cl}" data-oi="${oi}" ${ans ? 'disabled' : ''}><span class="k">${cl === 'ok' ? '✓' : cl === 'bad' ? '✗' : LET[k]}</span><span>${esc(q.o[oi])}</span></button>`;
    }).join('')}
    ${ans ? `<div class="feedback ${K.pick === q.a ? 'ok' : 'bad'}">${K.pick === q.a ? '🎉 Benar! ' : '🤔 Belum tepat. '}${esc(q.e)}</div>
      <div class="row" style="margin-top:14px"><span class="spacer"></span><button class="btn" id="bNextQ">${K.i === n - 1 ? '🏁 Lihat Hasil' : 'Soal Berikutnya ▶'}</button></div>` : ''}
    </div>`);
  $$('.opt').forEach(b => b.onclick = () => {
    if (K.pick !== null) return;
    K.pick = +b.dataset.oi;
    if (K.pick === q.a) { K.benar++; K.streak++; if (K.streak >= 3) confetti(40); } else K.streak = 0;
    viewKuisQ();
  });
  if ($('#bNextQ')) $('#bNextQ').onclick = () => { if (K.i === n - 1) return finishKuis(); K.i++; K.pick = null; viewKuisQ(); };
}
function finishKuis() {
  const K = KUIS; K.done = true;
  const prev = S.kuis[K.k]; if (!prev || K.benar > prev.best) S.kuis[K.k] = { best: K.benar }; else S.kuis[K.k] = prev;
  sync(); if (K.benar >= 4) confetti(140);
  const L = LV[K.k], keys = ['mudah', 'sedang', 'rumit'], nxt = keys[keys.indexOf(K.k) + 1];
  setApp(`<div class="card center"><span class="badge" style="background:${L.c[0]};color:#fff">${L.ico} Level ${L.t} selesai</span>
    <div class="scorebox" style="--p:${K.benar / 5 * 100}%"><span>${K.benar}/5</span></div>
    <div class="stars">${K.benar === 5 ? '⭐⭐⭐' : K.benar >= 3 ? '⭐⭐' : '⭐'}</div>
    <p style="font-size:1.1rem;font-weight:700">${K.benar === 5 ? 'Sempurna! Kamu jagoan integrasi Office!' : K.benar >= 3 ? 'Bagus! Sedikit lagi sempurna.' : 'Semangat! Baca ulang materi dan coba lagi.'}</p>
    <p class="muted">Skor level (maks 100): ${S.kuis[K.k].best * 20} · +${K.benar * 10} XP</p>
    <div class="row" style="justify-content:center">
      <button class="btn orange" id="bAgain">🔁 Ulangi Level</button>
      ${nxt ? `<button class="btn green" id="bNextLv">➡ Level ${LV[nxt].t}</button>` : ''}
      <button class="btn ghost" id="bBack">🎮 Daftar Level</button></div></div>`);
  $('#bAgain').onclick = () => { const k = K.k; KUIS = null; $$('.tile'); KUIS = { k, qs: D.kuis[k].map(q => ({ q, ord: shuffle([0, 1, 2, 3, 4]) })), i: 0, benar: 0, pick: null, streak: 0, done: false }; viewKuisQ(); };
  if ($('#bNextLv')) $('#bNextLv').onclick = () => { const k = nxt; KUIS = { k, qs: D.kuis[k].map(q => ({ q, ord: shuffle([0, 1, 2, 3, 4]) })), i: 0, benar: 0, pick: null, streak: 0, done: false }; viewKuisQ(); };
  $('#bBack').onclick = () => { KUIS = null; viewKuis(); };
}

/* ============================================================
   REFLEKSI
   ============================================================ */
function viewRefleksi() {
  renderTop();
  if (!has(S.hasil.Post_Total)) { toast('Selesaikan Post-test dulu ya.'); return go('home'); }
  if (S.refleksi) return viewSertifikat();
  const r = D.refleksi, draft = S._ref || { skala: {}, perasaan: '', t: {} };
  setApp(`<div class="card"><h2>🪞 Refleksi Pembelajaran</h2>
    <p class="muted">Tidak ada jawaban benar atau salah. Jawab jujur untuk mengenali <b>cara belajarmu sendiri</b>: bagaimana kamu merencanakan, memantau, dan menilai proses belajarmu. Ini melatih <b>regulasi diri</b> dan <b>metakognisi</b>.</p></div>
  <div class="card"><h3>1️⃣ Seberapa sesuai pernyataan ini denganmu?</h3><p class="muted">1 = Tidak pernah · 2 = Jarang · 3 = Kadang · 4 = Sering · 5 = Selalu</p>
    ${r.skala.map(s => `<div style="margin-bottom:10px"><b>${esc(s.t)}</b> <span class="badge">${esc(s.jenis)}</span>
      <div class="likert" data-k="${s.k}">${[1, 2, 3, 4, 5].map(v => `<button type="button" data-v="${v}" class="${draft.skala[s.k] === v ? 'on' : ''}">${v}</button>`).join('')}</div></div>`).join('')}</div>
  <div class="card"><h3>2️⃣ Perasaanmu setelah belajar hari ini</h3><div class="moods">${r.perasaan.map(p => `<button type="button" class="mood ${draft.perasaan === p ? 'on' : ''}" data-p="${esc(p)}">${p}</button>`).join('')}</div></div>
  <div class="card"><h3>3️⃣ Ceritakan prosesmu</h3>
    ${r.terbuka.map(t => `<label for="${t.k}">${esc(t.t)}</label><textarea id="${t.k}" maxlength="500">${esc(draft.t[t.k] || '')}</textarea>`).join('')}
    <div class="err" id="eRef"></div>
    <div class="row" style="margin-top:16px"><button class="btn green" id="bRef">💾 Simpan Refleksi</button><button class="btn ghost" data-go="home">Nanti saja</button></div></div>`);
  const keep = () => { draft.t = {}; r.terbuka.forEach(t => draft.t[t.k] = $('#' + t.k).value); S._ref = draft; saveS(); };
  $$('.likert').forEach(l => $$('button', l).forEach(b => b.onclick = () => { draft.skala[l.dataset.k] = +b.dataset.v; $$('button', l).forEach(x => x.classList.toggle('on', x === b)); keep(); }));
  $$('.mood').forEach(m => m.onclick = () => { draft.perasaan = m.dataset.p; $$('.mood').forEach(x => x.classList.toggle('on', x === m)); keep(); });
  r.terbuka.forEach(t => $('#' + t.k).oninput = keep);
  $('#bRef').onclick = () => {
    keep();
    if (Object.keys(draft.skala).length < r.skala.length) return $('#eRef').textContent = 'Lengkapi semua skala 1–5 ya.';
    if (!draft.perasaan) return $('#eRef').textContent = 'Pilih perasaanmu.';
    if (r.terbuka.slice(0, 3).some(t => !(draft.t[t.k] || '').trim())) return $('#eRef').textContent = 'Isi minimal tiga pertanyaan cerita pertama.';
    const data = {}; r.skala.forEach(s => data[s.k] = draft.skala[s.k]);
    data.Perasaan = draft.perasaan; r.terbuka.forEach(t => data[t.k] = (draft.t[t.k] || '').trim());
    const avg = round1(r.skala.reduce((a, s) => a + draft.skala[s.k], 0) / r.skala.length); data.Rata_Skala = avg;
    S.refleksi = { avg, perasaan: draft.perasaan }; delete S._ref;
    S.hasil.Refleksi_Skala = avg; S.hasil.Refleksi_Selesai = 'Ya';
    sync('refleksi', data); sync(); confetti(160);
    viewSertifikat();
  };
}
function viewSertifikat() {
  renderTop();
  const H = S.hasil, avg = S.refleksi.avg;
  const kat = avg >= 4 ? 'Kamu sudah punya kebiasaan belajar mandiri yang kuat. Pertahankan dan bantu temanmu!' : avg >= 3 ? 'Kebiasaan belajarmu mulai terbentuk. Pilih satu kebiasaan (misalnya menentukan target sebelum belajar) untuk ditingkatkan minggu ini.' : 'Mulailah dari langkah kecil: tulis satu target sebelum belajar dan periksa kembali setelahnya. Kamu pasti bisa!';
  setApp(`<div class="card center" style="background:linear-gradient(135deg,#fff,#fff6e0)"><div style="font-size:3rem">🏆</div>
    <h2>Sertifikat Petualang Office</h2><p class="muted">diberikan kepada</p>
    <h1 class="grad" style="margin:0">${esc(S.siswa.nama)}</h1><p>NIS ${esc(S.siswa.nis)} · Kelas ${esc(S.siswa.kelas)} · ${esc(S.siswa.tanggal)}</p>
    <p>telah menyelesaikan pembelajaran <b>Integrasi PowerPoint, Word, dan Excel serta Hyperlink</b></p>
    <div class="row" style="justify-content:center"><span class="chip">Pre-test ${H.Pre_Total}</span><span class="chip">Post-test ${H.Post_Total}</span><span class="chip">N-Gain ${H.N_Gain} (${H.Kategori_NGain})</span><span class="chip xp">⭐ ${xp()} XP</span></div>
    <p style="margin-top:14px"><b>Gelar:</b> ${gelar()}</p></div>
  <div class="card"><h3>🧠 Pesan metakognisi untukmu</h3><p>Rata-rata regulasi diri: <b>${avg}</b> dari 5. ${kat}</p>
    <ul><li>Sebelum belajar: tanyakan <i>“Apa targetku?”</i></li><li>Saat belajar: tanyakan <i>“Aku paham atau hanya merasa paham?”</i></li><li>Sesudah belajar: tanyakan <i>“Apa yang berhasil, dan apa yang akan kuubah?”</i></li></ul>
    <div class="row"><button class="btn sun" onclick="window.print()">🖨️ Cetak</button><button class="btn ghost" data-go="home">🏠 Beranda</button></div></div>`);
}

/* ============================================================
   DASHBOARD GURU
   ============================================================ */
let GURU = { pw: null, siswa: [], refleksi: [], timer: null, q: '', kelas: '', sort: 'Nama', asc: true };
async function sha256(t) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) { return ''; }
}
function viewGuruLogin() {
  renderTop(); clearInterval(GURU.timer);
  setApp(`<div class="card" style="max-width:480px;margin:40px auto"><h2>🔐 Dashboard Guru</h2>
    <p class="muted">Masukkan password untuk memantau hasil pengerjaan murid.</p>
    <form id="fG"><label for="pw">Password</label><input type="password" id="pw" autocomplete="current-password" required>
    <div class="err" id="eG"></div><div class="row" style="margin-top:14px"><button class="btn" type="submit">Masuk</button><button class="btn ghost" type="button" data-go="${S && S.siswa ? 'home' : 'login'}">Kembali</button></div></form>
    <p class="muted" style="margin-top:14px;font-size:.85rem">${C.SCRIPT_URL ? '☁️ Terhubung ke Google Sheet.' : '💾 Mode lokal: menampilkan data yang tersimpan di perangkat ini saja.'}</p></div>`);
  $('#fG').onsubmit = async e => {
    e.preventDefault(); const pw = $('#pw').value, er = $('#eG'); er.textContent = 'Memeriksa…';
    if (await loadGuru(pw, er)) { GURU.pw = pw; go('dashboard'); }
  };
}
async function loadGuru(pw, er) {
  if (C.SCRIPT_URL) {
    try {
      const r = await fetch(C.SCRIPT_URL + '?action=list&pw=' + encodeURIComponent(pw), { redirect: 'follow' });
      const j = await r.json();
      if (!j.ok) { if (er) er.textContent = j.error || 'Password salah.'; return false; }
      GURU.siswa = j.siswa || []; GURU.refleksi = j.refleksi || []; return true;
    } catch (e) { if (er) er.textContent = 'Gagal terhubung ke Google Sheet. Periksa SCRIPT_URL & deploy Apps Script.'; return false; }
  }
  if ((await sha256(pw)) !== C.HASH_GURU) { if (er) er.textContent = 'Password salah.'; return false; }
  const db = localDb(); GURU.siswa = db.siswa; GURU.refleksi = db.refleksi; return true;
}
const num = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
const avg = a => { a = a.filter(x => x !== null); return a.length ? round1(a.reduce((s, x) => s + x, 0) / a.length) : null; };
const scCls = v => v === null ? '' : v >= C.KKM ? 'hi' : v >= C.KKM - 15 ? 'mid' : 'lo';
function viewDashboard() {
  renderTop();
  if (!GURU.pw) return go('guru');
  clearInterval(GURU.timer);
  GURU.timer = setInterval(async () => { if (location.hash !== '#dashboard') return clearInterval(GURU.timer); if (await loadGuru(GURU.pw)) drawDash(); }, C.REFRESH_DETIK * 1000);
  drawDash(true);
}
function drawDash(first) {
  const rows = GURU.siswa.map(r => Object.assign({}, r, { _pre: num(r.Pre_Total), _post: num(r.Post_Total), _ng: num(r.N_Gain), _kuis: num(r.Kuis_Total) }));
  const f = rows.filter(r => (!GURU.kelas || r.Kelas === GURU.kelas) && (!GURU.q || (String(r.Nama) + ' ' + r.NIS).toLowerCase().includes(GURU.q.toLowerCase())));
  const keyMap = { Nama: 'Nama', NIS: 'NIS', Kelas: 'Kelas', Pre: '_pre', Kuis: '_kuis', Post: '_post', NGain: '_ng' };
  const sk = keyMap[GURU.sort] || 'Nama';
  f.sort((a, b) => { const x = a[sk], y = b[sk]; const c = (x === null ? -1e9 : x) > (y === null ? -1e9 : y) ? 1 : (x === null ? -1e9 : x) < (y === null ? -1e9 : y) ? -1 : 0; return GURU.asc ? c : -c; });
  const tuntas = rows.filter(r => r._post !== null && r._post >= C.KKM).length, sel = rows.filter(r => r.Status === 'Selesai').length;
  const html = `
  <div class="card"><div class="row"><h2 style="margin:0">📊 Dashboard Guru</h2><span class="spacer"></span>
    <span class="sync ${C.SCRIPT_URL ? 'on' : 'off'}">${C.SCRIPT_URL ? '☁️ Google Sheet' : '💾 Lokal'}</span>
    <button class="btn teal sm" id="bRef">🔄 Muat ulang</button><button class="btn sun sm" id="bCsv">⬇️ Unduh CSV</button><button class="btn pink sm" id="bLogout">Keluar</button></div>
    <p class="muted" style="margin:6px 0 0">Diperbarui otomatis tiap ${C.REFRESH_DETIK} detik · Terakhir: ${new Date().toLocaleTimeString('id-ID')}</p></div>
  <div class="stats">
    <div class="stat" style="--t1:#6c5ce7;--t2:#8b7bff;--t3:#4b3fc2"><b>${rows.length}</b><span>Murid terdaftar</span></div>
    <div class="stat" style="--t1:#ff6b9d;--t2:#ff95b8;--t3:#d63c74"><b>${avg(rows.map(r => r._pre)) ?? '–'}</b><span>Rata-rata Pre-test</span></div>
    <div class="stat" style="--t1:#00c2b8;--t2:#46ddd3;--t3:#00877f"><b>${avg(rows.map(r => r._post)) ?? '–'}</b><span>Rata-rata Post-test</span></div>
    <div class="stat" style="--t1:#ff8f3f;--t2:#ffb277;--t3:#cc5f10"><b>${avg(rows.map(r => r._ng)) ?? '–'}</b><span>Rata-rata N-Gain</span></div>
    <div class="stat" style="--t1:#4dabf7;--t2:#8cc9fb;--t3:#1f7fcc"><b>${tuntas}/${rows.filter(r => r._post !== null).length}</b><span>Tuntas (≥ ${C.KKM})</span></div>
    <div class="stat" style="--t1:#2ecc71;--t2:#6fe3a2;--t3:#1a9b52"><b>${sel}</b><span>Menyelesaikan semua</span></div></div>
  <div class="card"><h3>Perbandingan kelas</h3>${C.KELAS.map(k => {
    const rr = rows.filter(r => r.Kelas === k), a = avg(rr.map(r => r._pre)), b = avg(rr.map(r => r._post));
    return `<div class="cmp"><b>${k} (${rr.length})</b><div><div class="tr"><i style="width:${a || 0}%;background:var(--pink)"></i></div><small>Pre-test ${a ?? '–'}</small><div class="tr" style="margin-top:4px"><i style="width:${b || 0}%;background:var(--teal)"></i></div><small>Post-test ${b ?? '–'}</small></div></div>`;
  }).join('')}</div>
  <div class="card"><div class="row" style="margin-bottom:12px"><input type="text" id="gq" placeholder="🔎 Cari nama / NIS" style="max-width:260px" value="${esc(GURU.q)}">
    <select id="gk" style="max-width:160px"><option value="">Semua kelas</option>${C.KELAS.map(k => `<option ${GURU.kelas === k ? 'selected' : ''}>${k}</option>`).join('')}</select>
    <span class="muted">${f.length} murid ditampilkan</span></div>
  <div class="tablewrap"><table class="dt"><thead><tr>${[['No', ''], ['Nama', 'Nama'], ['NIS', 'NIS'], ['Kelas', 'Kelas'], ['Pre-test', 'Pre'], ['Materi', ''], ['Simulasi', ''], ['Kuis', 'Kuis'], ['Post-test', 'Post'], ['N-Gain', 'NGain'], ['Status', ''], ['Pembaruan', ''], ['', '']].map(([t, k]) => `<th data-s="${k}">${t}${GURU.sort === k && k ? (GURU.asc ? ' ▲' : ' ▼') : ''}</th>`).join('')}</tr></thead><tbody>
  ${f.map((r, i) => `<tr><td>${i + 1}</td><td><b>${esc(r.Nama)}</b></td><td>${esc(r.NIS)}</td><td>${esc(r.Kelas)}</td>
    <td><span class="sc ${scCls(r._pre)}">${r._pre ?? '–'}</span></td><td>${esc(r.Materi || '0/4')}</td><td>${esc(r.Simulasi || '0/5')}</td>
    <td><span class="sc ${scCls(r._kuis)}">${r._kuis ?? '–'}</span></td><td><span class="sc ${scCls(r._post)}">${r._post ?? '–'}</span></td>
    <td>${r._ng ?? '–'} ${r.Kategori_NGain ? '<small class="muted">' + esc(r.Kategori_NGain) + '</small>' : ''}</td><td>${esc(r.Status || '')}</td><td>${esc(r.Waktu_Update || '')}</td>
    <td><button class="btn sm ghost" data-d="${esc(r.NIS)}|${esc(r.Kelas)}">👁</button></td></tr>`).join('') || '<tr><td colspan="13" class="center muted" style="padding:30px">Belum ada data.</td></tr>'}
  </tbody></table></div></div>`;
  if (first) setApp(html); else { const a = $('#app'); a.innerHTML = `<div>${html}</div>`; }
  $('#bRef').onclick = async () => { if (await loadGuru(GURU.pw)) { drawDash(); toast('Data diperbarui'); } };
  $('#bLogout').onclick = () => { GURU.pw = null; clearInterval(GURU.timer); go(S && S.siswa ? 'home' : 'login'); };
  $('#bCsv').onclick = () => csv();
  $('#gq').oninput = e => { GURU.q = e.target.value; const p = e.target.selectionStart; drawDash(); const n = $('#gq'); n.focus(); n.setSelectionRange(p, p); };
  $('#gk').onchange = e => { GURU.kelas = e.target.value; drawDash(); };
  $$('.dt th[data-s]').forEach(t => t.onclick = () => { if (!t.dataset.s) return; GURU.asc = GURU.sort === t.dataset.s ? !GURU.asc : true; GURU.sort = t.dataset.s; drawDash(); });
  $$('[data-d]').forEach(b => b.onclick = () => detail(b.dataset.d));
}
function detail(k) {
  const [nis, kls] = k.split('|'), r = GURU.siswa.find(x => String(x.NIS) === nis && x.Kelas === kls); if (!r) return;
  const rf = GURU.refleksi.find(x => String(x.NIS) === nis && x.Kelas === kls);
  const kv = [['Nama', r.Nama], ['NIS', r.NIS], ['Kelas', r.Kelas], ['Tanggal', r.Tanggal], ['Pre-test PG / PGK / Total', `${r.Pre_PG ?? '–'} / ${r.Pre_PGK ?? '–'} / ${r.Pre_Total ?? '–'}`], ['Materi', r.Materi], ['Simulasi', r.Simulasi],
  ['Kuis Mudah / Sedang / Rumit', `${r.Kuis_Mudah ?? '–'} / ${r.Kuis_Sedang ?? '–'} / ${r.Kuis_Rumit ?? '–'}`], ['Post-test PG / PGK / Jodoh / Isian', `${r.Post_PG ?? '–'} / ${r.Post_PGK ?? '–'} / ${r.Post_Jodoh ?? '–'} / ${r.Post_Isian ?? '–'}`], ['Post-test Total', r.Post_Total ?? '–'], ['N-Gain', `${r.N_Gain ?? '–'} ${r.Kategori_NGain || ''}`], ['XP', r.XP ?? '–'], ['Ide penerapan', r.Ide_Penerapan || '–'], ['Status', r.Status]];
  let rh = '<p class="muted">Murid belum mengisi refleksi.</p>';
  if (rf) rh = `<p>Rata-rata skala regulasi diri: <b>${rf.Rata_Skala}</b> · Perasaan: <b>${esc(rf.Perasaan)}</b></p>
    <div class="cmp" style="grid-template-columns:auto">${D.refleksi.skala.map(s => `<div>${esc(s.jenis)} — ${esc(s.t)} <b>(${rf[s.k] ?? '–'})</b></div>`).join('')}</div>` +
    D.refleksi.terbuka.map(t => `<p><b>${esc(t.t)}</b><br>${esc(rf[t.k] || '–')}</p>`).join('');
  const d = document.createElement('div'); d.className = 'drawer';
  d.innerHTML = `<div class="card"><div class="row"><h3 style="margin:0">Detail murid</h3><span class="spacer"></span><button class="btn pink sm" id="xD">Tutup ✕</button></div>
    <table class="tbl">${kv.map(([a, b]) => `<tr><td><b>${a}</b></td><td>${esc(b ?? '–')}</td></tr>`).join('')}</table><h3>🪞 Refleksi</h3>${rh}</div>`;
  document.body.appendChild(d); d.onclick = e => { if (e.target === d || e.target.id === 'xD') d.remove(); };
}
function csv() {
  const cols = ['Nama', 'NIS', 'Kelas', 'Tanggal', 'Pre_PG', 'Pre_PGK', 'Pre_Total', 'Materi', 'Simulasi', 'Kuis_Mudah', 'Kuis_Sedang', 'Kuis_Rumit', 'Kuis_Total', 'Post_PG', 'Post_PGK', 'Post_Jodoh', 'Post_Isian', 'Post_Total', 'N_Gain', 'Kategori_NGain', 'XP', 'Refleksi_Skala', 'Status', 'Waktu_Update'];
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const t = [cols.join(',')].concat(GURU.siswa.map(r => cols.map(c => q(r[c])).join(','))).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + t], { type: 'text/csv;charset=utf-8' }));
  a.download = 'hasil-integrasi-office.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* ============================================================
   ROUTER
   ============================================================ */
function route() {
  const v = (location.hash || '').slice(1) || (S && S.siswa ? 'home' : 'login');
  if (v !== 'dashboard' && v !== 'guru') clearInterval(GURU.timer);
  if (v === 'guru') return viewGuruLogin();
  if (v === 'dashboard') return viewDashboard();
  if (!S || !S.siswa) { if (v !== 'login') { history.replaceState(null, '', '#login'); } return viewLogin(); }
  if (v === 'login') return go('home');
  const pre = has(S.hasil.Pre_Total);
  if (['materi', 'sim', 'kuis'].includes(v) && !pre) { toast('Kerjakan Pre-test dulu ya 🙂'); history.replaceState(null, '', '#pretest'); return viewTest('pretest'); }
  ({ home: viewHome, pretest: () => viewTest('pretest'), posttest: () => viewTest('posttest'), materi: viewMateri, sim: viewSim, kuis: () => { if (KUIS && KUIS.done) KUIS = null; viewKuis(); }, refleksi: viewRefleksi }[v] || viewHome)();
}
window.addEventListener('hashchange', route);
window.addEventListener('online', flushOutbox);
flushOutbox();
route();
window.MIO = API;
})();
