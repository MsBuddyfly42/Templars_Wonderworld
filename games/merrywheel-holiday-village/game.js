/* Merrywheel: The Holiday Village */
(() => {
'use strict';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const stage = $('#stage');

function fit() { const k = Math.min(innerWidth / 1200, innerHeight / 800); stage.style.setProperty('--k', k); }
addEventListener('resize', fit); fit();

/* ---------- sound ---------- */
const Snd = {
  ctx: null, on: true,
  init() { if (!this.ctx) try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } },
  tone(f, t = 0, d = .25, type = 'sine', v = .12) {
    if (!this.on || !this.ctx) return; const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(0, c.currentTime + t); g.gain.linearRampToValueAtTime(v, c.currentTime + t + .02);
    g.gain.exponentialRampToValueAtTime(.001, c.currentTime + t + d); o.connect(g); g.connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + d + .05);
  },
  sfx(k) {
    const T = this.tone.bind(this);
    if (k === 'good') { T(660, 0, .18); T(880, .1, .25); }
    else if (k === 'bad') { T(220, 0, .2, 'triangle'); }
    else if (k === 'bell') { [523, 659, 784, 1047].forEach((f, i) => T(f, i * .12, 1.2, 'sine', .1)); }
    else if (k === 'stamp') { T(140, 0, .12, 'square', .08); T(988, .08, .4); T(1319, .18, .5); }
    else if (k === 'pop') { T(rnd(500, 900), 0, .12, 'triangle', .1); }
    else if (k === 'boom') { T(80, 0, .5, 'sawtooth', .08); T(rnd(900, 1400), .05, .5, 'sine', .05); }
    else if (k === 'coin') { T(1200, 0, .08); T(1600, .06, .15); }
    else if (k === 'whoosh') { T(rnd(1200, 1800), 0, .08, 'sine', .05); }
  },
};

/* ---------- state & calendar ---------- */
const S = {
  scene: 'title', name: '', y: 1, doy: 0, slot: 0, coins: 30, fund: 0, stamps: {}, skills: {}, bag: [], treats: [],
  upgrades: {}, bellDay: -1, hourFree: 0, hourDay: -1, secTries: 0, jubilee: {}, best: {}, snow: 0, snowUser: false, weather: 'clear',
  notes: [], found: {}, street: null, favor: {}, sulk: {}, sulkBy: {}, smug: {}, harmony: 0, argDay: -1, argId: null, argDone: -1, kidArgDay: -1, kidArgId: null, kidArgDone: -1, trust: 0, pout: {}, fr: {}, talked: {}, gave: {}, keeps: [], mail: 0,
};
const SLOTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const doyOf = (m, d) => MDAYS.slice(0, m).reduce((a, b) => a + b, 0) + d - 1;
function dateOf(doy) { let m = 0; while (doy >= MDAYS[m]) { doy -= MDAYS[m]; m++; } return { m, d: doy + 1 }; }
const absDay = () => (S.y - 1) * 365 + S.doy;
const weekday = () => (absDay() + 4) % 7; /* Year 1 begins on a Thursday */
const fmtDate = doy => { const { m, d } = dateOf(doy); return `${MONTHS[m]} ${d}`; };
const lanternOpen = () => !!S.upgrades.lantern;
const openStreets = () => ALL_STREETS.filter(s => !s.world || lanternOpen());
const until = st => (doyOf(st.m, st.d) - S.doy + 365) % 365;
const isLive = st => until(st) <= 2;
const inSeason = st => until(st) <= 10;
const famOf = st => FAMILIES[st.m];
const stColor = st => st.world ? '#c8862a' : famOf(st).color;
const streetById = id => ALL_STREETS.find(s => s.id === id);
function upcoming(n = 3) { return openStreets().map(s => [s, until(s)]).sort((a, b) => a[1] - b[1]).slice(0, n); }
const stampCount = () => Object.keys(S.stamps).length;
const totalStamps = () => openStreets().length;
const season = () => { const m = dateOf(S.doy).m; return m === 11 || m < 2 ? 'winter' : m < 5 ? 'spring' : m < 8 ? 'summer' : 'autumn'; };

/* ---------- ui helpers ---------- */
let toastT;
function toast(t, ms = 2600) { const el = $('#toast'); el.innerHTML = t; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms); }
let modalRes = null;
function modal(html, buttons = [{ label: 'Close', primary: true }], wide = false) {
  return new Promise(res => {
    if (modalRes) modalRes(null);
    modalRes = res;
    const card = $('#modal-card'); card.className = 'modal-card' + (wide ? ' wide' : '');
    card.innerHTML = html + `<div class="modal-actions">${buttons.map((b, i) => `<button class="btn ${b.primary ? 'primary' : b.gold ? 'gold' : 'ghost'}" data-mi="${i}" ${b.disabled ? 'disabled' : ''}>${b.label}</button>`).join('')}</div>`;
    $('#modal').hidden = false;
    card.querySelectorAll('[data-mi]').forEach(btn => btn.onclick = () => { const b = buttons[+btn.dataset.mi]; closeModal(b.value !== undefined ? b.value : b.label); });
    const f = card.querySelector('[data-mi]'); f && f.focus();
  });
}
function closeModal(v) { $('#modal').hidden = true; const r = modalRes; modalRes = null; r && r(v); }
addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(null); });

function updateHUD() {
  $('#hud-date').textContent = `${fmtDate(S.doy)}, Year ${S.y}`;
  $('#hud-slot').textContent = `${DAYS[weekday()][0]} ${SLOTS[S.slot]}`;
  $('#hud-coins').textContent = S.coins;
  $('#hud-fund').textContent = S.fund;
  $('#hud-stamps').textContent = `${stampCount()}/${totalStamps()}`;
  const up = upcoming(1)[0], el = $('#hud-next');
  if (up) {
    const [st, n] = up;
    el.classList.toggle('live', n <= 2);
    el.textContent = n === 0 ? `Today: ${st.holiday}` : `${st.holiday} in ${n} day${n > 1 ? 's' : ''}`; el.title = `Next celebration: ${st.holiday} on ${st.name}`;
  }
  $('#btn-back').hidden = S.scene === 'map';
}

/* ---------- characters ---------- */
const SKINS = ['#f1d3b5', '#e0b48e', '#c68c5f', '#9a6440', '#6e4428', '#4f3020'];
function personSVG(o = {}) {
  const w = o.w || 70, c = o.color || '#c8344f', sk = o.skin || SKINS[2], hat = o.hat || 'none', h = w * 1.5;
  let hatS = '';
  if (hat === 'crown') hatS = `<path d="M24 16l4-9 6 6 6-8 6 8 6-6 4 9z" fill="#e2b04a" stroke="#a87a20" stroke-width="1.5"/>`;
  else if (hat === 'top') hatS = `<rect x="26" y="0" width="28" height="18" rx="2" fill="#2a2233"/><rect x="18" y="16" width="44" height="5" rx="2" fill="#2a2233"/><rect x="26" y="12" width="28" height="4" fill="${c}"/>`;
  else if (hat === 'witch') hatS = `<path d="M40 -12 L56 17 H24z" fill="#3a2a5a"/><rect x="16" y="15" width="48" height="5" rx="2" fill="#3a2a5a"/>`;
  else if (hat === 'santa') hatS = `<path d="M22 18 Q40 -6 60 10 L58 18z" fill="#c8344f"/><rect x="20" y="15" width="42" height="6" rx="3" fill="#fff"/><circle cx="61" cy="9" r="4" fill="#fff"/>`;
  else if (hat === 'flower') hatS = `<g fill="#f2a7b8"><circle cx="30" cy="14" r="5"/><circle cx="40" cy="10" r="5"/><circle cx="50" cy="14" r="5"/></g><circle cx="40" cy="12" r="2.5" fill="#e2b04a"/>`;
  else if (hat === 'cap') hatS = `<path d="M22 20 Q40 2 58 20z" fill="${c}"/><rect x="40" y="17" width="24" height="4" rx="2" fill="${c}"/>`;
  else if (hat === 'star') hatS = `<path d="M40 -2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L30 5.5l7-.5z" fill="#e2b04a"/>`;
  else if (hat === 'bow') hatS = `<path d="M28 14l10 5-10 5zM52 14l-10 5 10 5z" fill="${c}"/><circle cx="40" cy="19" r="3" fill="${c}"/>`;
  else if (hat === 'leaf') hatS = `<path d="M40 2 Q52 8 44 20 Q32 14 40 2z" fill="#c9762a"/>`;
  else if (hat === 'shamrock') hatS = `<g fill="#3f9a4a"><circle cx="35" cy="10" r="5"/><circle cx="45" cy="10" r="5"/><circle cx="40" cy="4" r="5"/></g>`;
  else if (hat === 'umbrella') hatS = `<path d="M14 6 Q40 -18 66 6z" fill="#9ec7e6" stroke="#5d8fb3"/><path d="M40 6v14" stroke="#5d5368" stroke-width="2"/>`;
  else if (hat === 'sun') hatS = `<path d="M18 19 Q40 -4 62 19z" fill="#f2c230"/><rect x="10" y="17" width="60" height="5" rx="2.5" fill="#e9a23b"/>`;
  return `<svg width="${w}" height="${h}" viewBox="0 -14 80 134"><ellipse cx="40" cy="118" rx="26" ry="5" fill="rgba(0,0,0,.18)"/>
    <path d="M14 116 Q16 56 40 54 Q64 56 66 116z" fill="${c}"/><path d="M28 60 L40 74 L52 60" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
    <circle cx="40" cy="36" r="20" fill="${sk}"/><circle cx="33" cy="35" r="2.4" fill="#2a2233"/><circle cx="47" cy="35" r="2.4" fill="#2a2233"/>
    <path d="M34 44 Q40 49 46 44" stroke="#2a2233" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="29" cy="42" r="3" fill="rgba(220,90,90,.25)"/><circle cx="51" cy="42" r="3" fill="rgba(220,90,90,.25)"/>
    <path d="M20 32 Q22 14 40 15 Q58 14 60 32 Q52 22 40 22 Q28 22 20 32z" fill="${o.hair || '#3a2a20'}"/>${hatS}</svg>`;
}
/* time's children */
function kidSVG(kind, size) {
  const s = size || 26;
  if (kind === 'sec') return `<svg width="${s}" height="${s}" viewBox="0 0 30 30"><circle cx="15" cy="16" r="10" fill="#ffe9a8" stroke="#e2b04a" stroke-width="2"/><circle cx="12" cy="15" r="1.3" fill="#2a2233"/><circle cx="18" cy="15" r="1.3" fill="#2a2233"/><path d="M12 19 Q15 21 18 19" stroke="#2a2233" fill="none" stroke-width="1.2"/><path d="M15 6 V2" stroke="#e2b04a" stroke-width="2" stroke-linecap="round"/></svg>`;
  if (kind === 'min') return `<svg width="${s}" height="${s * 1.3}" viewBox="0 0 30 40"><path d="M5 38 Q6 20 15 19 Q24 20 25 38z" fill="#9ec7e6"/><circle cx="15" cy="13" r="8" fill="#f6dfc4"/><circle cx="12" cy="13" r="1.2" fill="#2a2233"/><circle cx="18" cy="13" r="1.2" fill="#2a2233"/><path d="M12 16.5 Q15 18.5 18 16.5" stroke="#2a2233" fill="none" stroke-width="1.2"/><path d="M15 5 V0" stroke="#2a3560" stroke-width="2" stroke-linecap="round"/><circle cx="15" cy="0" r="1.8" fill="#2a3560"/></svg>`;
  if (kind === 'hour') return `<svg width="${s}" height="${s * 1.4}" viewBox="0 0 30 42"><path d="M4 40 Q5 18 15 17 Q25 18 26 40z" fill="#b48ad6"/><path d="M11 24h8l-3 5 3 5h-8l3-5z" fill="#fbf6ea"/><circle cx="15" cy="11" r="8" fill="#e0b48e"/><path d="M12 11 Q13 10 14 11M16 11 Q17 10 18 11" stroke="#2a2233" fill="none" stroke-width="1.2"/><path d="M12 14.5 Q15 16.5 18 14.5" stroke="#2a2233" fill="none" stroke-width="1.2"/></svg>`;
  if (kind === 'day') return `<svg width="${s}" height="${s * 1.4}" viewBox="0 0 30 42"><path d="M4 40 Q5 18 15 17 Q25 18 26 40z" fill="#f2c230"/><circle cx="15" cy="11" r="8" fill="#c68c5f"/><circle cx="12" cy="11" r="1.2" fill="#2a2233"/><circle cx="18" cy="11" r="1.2" fill="#2a2233"/><path d="M12 14.5 Q15 16 18 14.5" stroke="#2a2233" fill="none" stroke-width="1.2"/><circle cx="15" cy="29" r="4" fill="#fff6d8"/></svg>`;
  if (kind === 'week') return `<svg width="${s}" height="${s * 1.6}" viewBox="0 0 30 48"><path d="M4 46 Q5 20 15 19 Q25 20 26 46z" fill="#5d8f6e"/><circle cx="15" cy="12" r="8" fill="#9a6440"/><path d="M8 9 Q15 1 22 9 Q15 6 8 9z" fill="#2a2233"/><circle cx="12" cy="13" r="1.2" fill="#2a2233"/><circle cx="18" cy="13" r="1.2" fill="#2a2233"/><path d="M12 16 H18" stroke="#2a2233" stroke-width="1.2"/><rect x="17" y="25" width="10" height="13" rx="1.5" fill="#fbf6ea" stroke="#5d5368"/><path d="M19 29h6M19 32h6M19 35h4" stroke="#5d5368" stroke-width=".8"/></svg>`;
}
const HOST_LOOK = [
  { hat: 'star', skin: SKINS[0], hair: '#cfd6de' }, { hat: 'bow', skin: SKINS[3], hair: '#2a1a14' }, { hat: 'shamrock', skin: SKINS[1], hair: '#a8452a' },
  { hat: 'umbrella', skin: SKINS[2], hair: '#5a3a20' }, { hat: 'flower', skin: SKINS[4], hair: '#1a1010' }, { hat: 'sun', skin: SKINS[5], hair: '#1a1010' },
  { hat: 'top', skin: SKINS[1], hair: '#6b4a2a' }, { hat: 'crown', skin: SKINS[4], hair: '#e8e0d0' }, { hat: 'cap', skin: SKINS[2], hair: '#3a2a20' },
  { hat: 'witch', skin: SKINS[0], hair: '#2a2233' }, { hat: 'leaf', skin: SKINS[3], hair: '#d8d0c8' }, { hat: 'santa', skin: SKINS[5], hair: '#e8e0d0' },
];
const WORLD_HOSTS = {
  diwali: ['Auntie Asha', SKINS[3], ['Light one diya and the whole lane gets brighter. That is the point.', 'Come see my rangoli. I started at five this morning.']],
  lunar: ['Grandma Mei', SKINS[1], ['Eat a dumpling. Eat another. It is for luck.', 'Red envelopes are for the children. And for you, because you are polite.']],
  eid: ['Uncle Yusuf', SKINS[2], ['Eid Mubarak. Come, have a cookie, and tell me about your family.', 'We look for the new crescent moon together. Someone always spots it first and shouts.']],
  hanukkah: ['Bubbe Ruth', SKINS[0], ['Eight nights, eight candles, and far too many latkes. Perfect.', 'Spin the dreidel. If it lands on gimel, you get the whole pot.']],
  kwanzaa: ['Mama Imani', SKINS[4], ['Habari gani? That means "what is the news?" Today we answer with the principle of the day.', 'Umoja means unity. You are standing in it right now.']],
};

/* ---------- map ---------- */
const CX = 600, CY = 450, SY = 0.72, R_PLAZA = 118, R_IN = 138, R_OUT = 392;
const P = (r, deg) => [CX + r * Math.cos(deg * Math.PI / 180), CY + r * Math.sin(deg * Math.PI / 180) * SY];
const wedgeAng = m => -90 + m * 30;
const LANTERN_POS = [1080, 690];
const map = $('#map'), mctx = map.getContext('2d');
const base = document.createElement('canvas'); base.width = 1200; base.height = 800;
let seed = 7; const srnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const GROUND = { winter: ['#e9eef2', '#d5dfe6'], spring: ['#b7d89a', '#9cc77e'], summer: ['#9ccb75', '#83b860'], autumn: ['#d8b27a', '#c99a5e'] };

function glyph(c, m, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const F = (col) => { c.fillStyle = col; c.fill(); };
  c.beginPath();
  switch (m) {
    case 0: star(c, 0, 0, 5, 2.2); F('#e2b04a'); break;
    case 1: c.moveTo(0, 3); c.bezierCurveTo(-6, -2, -3, -6, 0, -3); c.bezierCurveTo(3, -6, 6, -2, 0, 3); F('#c8344f'); break;
    case 2: [[-2, -1], [2, -1], [0, -4]].forEach(([a, b]) => { c.moveTo(a + 2.2, b); c.arc(a, b, 2.2, 0, 7); }); F('#3f9a4a'); break;
    case 3: c.ellipse(0, 0, 2.6, 3.4, 0, 0, 7); F(pick(['#9ec7e6', '#f2c2d4', '#f5e08a'])); break;
    case 4: for (let i = 0; i < 5; i++) { const a = i * 1.256; c.moveTo(Math.cos(a) * 2.5 + 1.6, Math.sin(a) * 2.5); c.arc(Math.cos(a) * 2.5, Math.sin(a) * 2.5, 1.6, 0, 7); } F('#e8a3c4'); break;
    case 5: c.arc(0, 0, 3, 0, 7); F('#f2c230'); break;
    case 6: c.rect(-4, -3, 8, 6); F('#fff'); c.beginPath(); c.rect(-4, -3, 8, 1.2); c.rect(-4, -.6, 8, 1.2); c.rect(-4, 1.8, 8, 1.2); F('#d24a4a'); c.beginPath(); c.rect(-4, -3, 3.5, 3); F('#2f4f8a'); break;
    case 7: star(c, 0, 0, 5, 2.4); F('#f5d061'); break;
    case 8: c.moveTo(0, -4); c.quadraticCurveTo(4, 0, 0, 4); c.quadraticCurveTo(-4, 0, 0, -4); F('#c9762a'); break;
    case 9: c.ellipse(0, 0, 4, 3, 0, 0, 7); F('#e0702a'); c.beginPath(); c.rect(-.6, -4.5, 1.2, 2); F('#4d6b40'); break;
    case 10: c.moveTo(0, -4); c.quadraticCurveTo(4, 0, 0, 4); c.quadraticCurveTo(-4, 0, 0, -4); F('#9a5a2e'); break;
    case 11: c.moveTo(0, -5); c.lineTo(4, 3); c.lineTo(-4, 3); F('#2f7a55'); c.beginPath(); c.arc(0, -5, 1, 0, 7); F('#e2b04a'); break;
    default: c.arc(0, 0, 3, 0, 7); F('#f2a03a');
  }
  c.restore();
}
function star(c, x, y, R, r) { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
function house(c, x, y, roof, m, sc = 1, lit = true) {
  c.save(); c.translate(x, y); c.scale(sc, sc);
  c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 1, 14, 3.5, 0, 0, 7); c.fill();
  c.fillStyle = '#fbf3e2'; c.fillRect(-10, -12, 20, 13);
  c.fillStyle = roof; c.beginPath(); c.moveTo(-13, -11); c.lineTo(0, -22); c.lineTo(13, -11); c.closePath(); c.fill();
  c.fillStyle = lit ? '#ffd76a' : '#9fb3c8'; c.fillRect(-7, -8, 4, 4); c.fillRect(3, -8, 4, 4);
  c.fillStyle = '#7a5236'; c.fillRect(-2, -6, 4, 7);
  c.restore();
  if (m !== undefined) glyph(c, m, x, y - 26 * sc, 1.25 * sc);
}
function tree(c, x, y, s, sea) {
  c.fillStyle = 'rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(x, y + 1, 7 * s, 2.5 * s, 0, 0, 7); c.fill();
  c.fillStyle = '#6b4a2a'; c.fillRect(x - 1.2 * s, y - 6 * s, 2.4 * s, 6 * s);
  c.fillStyle = sea === 'autumn' ? pick(['#d0702a', '#e0a030', '#b8502a']) : sea === 'winter' ? '#4f7a66' : sea === 'spring' ? pick(['#5f9e4e', '#f2b8c8']) : '#4f8e44';
  c.beginPath(); c.arc(x, y - 10 * s, 7 * s, 0, 7); c.fill();
  if (sea === 'winter') { c.fillStyle = '#fff'; c.beginPath(); c.arc(x - 2 * s, y - 14 * s, 3.5 * s, 0, 7); c.fill(); }
}
function drawBase(cv = base) {
  const c = cv.getContext('2d'), sea = season(), [g1, g2] = GROUND[sea];
  seed = 11;
  const night = S.slot >= 2;
  c.fillStyle = night ? '#1b2340' : '#8fb6d6'; c.fillRect(0, 0, 1200, 800);
  const gr = c.createRadialGradient(CX, CY, 100, CX, CY, 700); gr.addColorStop(0, g1); gr.addColorStop(1, g2);
  c.fillStyle = gr; c.fillRect(0, 0, 1200, 800);
  /* river */
  c.strokeStyle = sea === 'winter' ? '#c7dbe8' : '#7fb3d6'; c.lineWidth = 26; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-20, 120); c.bezierCurveTo(200, 60, 160, 260, 70, 420); c.bezierCurveTo(-10, 560, 120, 700, 330, 830); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 4; c.stroke();
  /* outer trees */
  for (let i = 0; i < 140; i++) {
    const x = srnd() * 1200, y = 60 + srnd() * 740; const dx = (x - CX), dy = (y - CY) / SY;
    if (Math.hypot(dx, dy) < R_OUT + 20) continue;
    if (Math.hypot(x - LANTERN_POS[0], (y - LANTERN_POS[1]) * 1.4) < 120) continue;
    if (x > 950 && y < 330) continue;
    tree(c, x, y, .8 + srnd() * .6, sea);
  }
  /* wedges */
  for (let m = 0; m < 12; m++) {
    const a0 = (wedgeAng(m) - 15) * Math.PI / 180, a1 = (wedgeAng(m) + 15) * Math.PI / 180, f = FAMILIES[m];
    c.save(); c.translate(CX, CY); c.scale(1, SY);
    c.beginPath(); c.arc(0, 0, R_OUT, a0, a1); c.arc(0, 0, R_IN, a1, a0, true); c.closePath();
    c.fillStyle = f.color; c.globalAlpha = .34; c.fill(); c.globalAlpha = 1;
    c.strokeStyle = '#f3e6c8'; c.lineWidth = 7; c.beginPath(); c.moveTo(Math.cos(a0) * R_IN, Math.sin(a0) * R_IN); c.lineTo(Math.cos(a0) * R_OUT, Math.sin(a0) * R_OUT); c.stroke();
    c.restore();
  }
  /* avenues */
  c.save(); c.translate(CX, CY); c.scale(1, SY);
  c.strokeStyle = '#f3e6c8'; c.lineWidth = 12; c.beginPath(); c.arc(0, 0, R_IN, 0, 7); c.stroke();
  c.lineWidth = 7; c.beginPath(); c.arc(0, 0, 265, 0, 7); c.stroke();
  c.strokeStyle = 'rgba(140,110,70,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, R_OUT, 0, 7); c.stroke();
  /* plaza */
  c.fillStyle = '#eadcc0'; c.beginPath(); c.arc(0, 0, R_PLAZA, 0, 7); c.fill();
  c.strokeStyle = 'rgba(150,120,80,.25)'; c.lineWidth = 1.5; for (let r = 24; r < R_PLAZA; r += 18) { c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); }
  c.restore();
  /* houses per wedge */
  for (let m = 0; m < 12; m++) {
    const f = FAMILIES[m];
    for (let k = 0; k < 9; k++) {
      const r = 160 + srnd() * 220, a = wedgeAng(m) + (srnd() - .5) * 22;
      const [x, y] = P(r, a); house(c, x, y, shade(f.color, -25), m, .85 + srnd() * .3, night || true);
    }
  }
  /* family names */
  c.textAlign = 'center'; c.font = '15px "Young Serif", Georgia, serif';
  for (let m = 0; m < 12; m++) {
    const [x, y] = P(R_OUT + 26, wedgeAng(m));
    const t = FAMILIES[m].name; c.lineWidth = 4; c.strokeStyle = 'rgba(251,246,234,.85)'; c.strokeText(t, x, y + 5); c.fillStyle = shade(FAMILIES[m].color, -45); c.fillText(t, x, y + 5);
    const hh = heartsOf(m); for (let k = 0; k < 5; k++) { c.globalAlpha = k < hh ? 1 : .25; glyph(c, 1, x - 24 + k * 12, y + 17, 1); } c.globalAlpha = 1;
  }
  /* lantern quarter island */
  const [lx, ly] = LANTERN_POS;
  c.strokeStyle = '#a07a50'; c.lineWidth = 10; c.beginPath(); const [bx, by] = P(R_OUT - 6, 40); c.moveTo(bx, by); c.lineTo(lx - 70, ly - 30); c.stroke();
  c.fillStyle = lanternOpen() ? '#e7c48a' : '#c9c2b4'; c.beginPath(); c.ellipse(lx, ly, 100, 62, 0, 0, 7); c.fill();
  if (lanternOpen()) {
    [[-50, -10], [-15, -30], [25, -18], [55, 10], [-20, 20]].forEach(([dx, dy], i) => house(c, lx + dx, ly + dy, ['#c8862a', '#c8344f', '#2fa3a0', '#2f4f8a', '#2f7a55'][i], undefined, .9, true));
  } else { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(lx, ly, 100, 62, 0, 0, 7); c.fill(); }
  /* upgrades (static parts) */
  const U = S.upgrades;
  if (U.gardens) { for (let i = 0; i < 48; i++) { const [x, y] = P(R_PLAZA - 6, i * 7.5); c.fillStyle = ['#e8a3c4', '#f2c230', '#c8344f', '#fff'][i % 4]; c.beginPath(); c.arc(x, y, 3.2, 0, 7); c.fill(); } }
  if (U.banners) { for (let m = 0; m < 12; m++) { const [x, y] = P(R_IN + 2, wedgeAng(m)); c.fillStyle = '#6b4a2a'; c.fillRect(x - 1, y - 30, 2, 30); c.fillStyle = FAMILIES[m].color; c.beginPath(); c.moveTo(x + 1, y - 30); c.lineTo(x + 13, y - 26); c.lineTo(x + 1, y - 21); c.fill(); } }
  if (U.carousel) { const x = 170, y = 690; c.fillStyle = '#c8344f'; c.beginPath(); c.ellipse(x, y, 46, 18, 0, 0, 7); c.fill(); c.fillStyle = '#fbf3e2'; c.fillRect(x - 38, y - 40, 76, 30); c.fillStyle = '#e2b04a'; c.beginPath(); c.moveTo(x - 48, y - 40); c.lineTo(x, y - 70); c.lineTo(x + 48, y - 40); c.fill(); }
  if (U.clock) { const [x, y] = [CX, CY - 60]; c.fillStyle = '#b89a70'; c.fillRect(x - 12, y - 70, 24, 70); c.fillStyle = '#7a5236'; c.beginPath(); c.moveTo(x - 16, y - 70); c.lineTo(x, y - 96); c.lineTo(x + 16, y - 70); c.fill(); c.fillStyle = '#fbf6ea'; c.beginPath(); c.arc(x, y - 52, 9, 0, 7); c.fill(); }
}
function shade(hex, amt) { const n = parseInt(hex.slice(1), 16); let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt; return `rgb(${clamp(r, 0, 255)},${clamp(g, 0, 255)},${clamp(b, 0, 255)})`; }

let mapT = 0, mapRaf = 0;
function mapFrame(t) {
  mapT = t / 1000; const c = mctx;
  c.drawImage(base, 0, 0);
  /* live wedge glow */
  for (const [st, n] of upcoming(4)) {
    if (n > 2 || st.world) continue;
    const a0 = (wedgeAng(st.m) - 15) * Math.PI / 180, a1 = (wedgeAng(st.m) + 15) * Math.PI / 180;
    c.save(); c.translate(CX, CY); c.scale(1, SY); c.beginPath(); c.arc(0, 0, R_OUT, a0, a1); c.arc(0, 0, R_IN, a1, a0, true); c.closePath();
    c.fillStyle = `rgba(255,220,120,${.18 + .12 * Math.sin(mapT * 3)})`; c.fill(); c.restore();
  }
  const U = S.upgrades;
  if (U.lights) { for (let i = 0; i < 60; i++) { const [x, y] = P(R_PLAZA + 6, i * 6); c.fillStyle = ['#ffd76a', '#ff8a8a', '#8ad0ff', '#a8ffa0'][i % 4]; c.globalAlpha = .55 + .45 * Math.sin(mapT * 4 + i); c.beginPath(); c.arc(x, y, 2.6, 0, 7); c.fill(); } c.globalAlpha = 1; }
  if (U.fountain) { c.fillStyle = '#9fc6e0'; c.beginPath(); c.ellipse(CX, CY + 6, 30, 12, 0, 0, 7); c.fill(); c.strokeStyle = '#d8cbb0'; c.lineWidth = 4; c.stroke(); for (let i = 0; i < 12; i++) { const h = 14 + 4 * Math.sin(mapT * 5 + i); c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(CX, CY); c.quadraticCurveTo(CX + Math.cos(i * .52) * 14, CY - h, CX + Math.cos(i * .52) * 24, CY + 4 + Math.sin(i * .52) * 6); c.stroke(); } }
  if (U.wheel) { const x = 1060, y = 200, r = 70; c.strokeStyle = '#2a3560'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 40, y + 110); c.lineTo(x, y); c.lineTo(x + 40, y + 110); c.stroke(); c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); for (let i = 0; i < 12; i++) { const a = mapT * .25 + i * Math.PI / 6; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.stroke(); c.fillStyle = FAMILIES[i].color; c.fillRect(x + Math.cos(a) * r - 7, y + Math.sin(a) * r, 14, 11); } }
  if (U.carousel) { for (let i = 0; i < 6; i++) { const a = mapT + i; c.fillStyle = FAMILIES[i * 2].color; c.beginPath(); c.arc(170 + Math.cos(a) * 30, 668 + Math.sin(a) * 8, 4, 0, 7); c.fill(); } }
  /* lantern quarter glow */
  if (lanternOpen()) { for (let i = 0; i < 14; i++) { const x = LANTERN_POS[0] + Math.cos(i) * 80 * (.4 + (i % 3) * .25), y = LANTERN_POS[1] + Math.sin(i * 1.7) * 40; c.fillStyle = `rgba(255,190,90,${.5 + .5 * Math.sin(mapT * 3 + i)})`; c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); } }
  if (S.slot >= 2) { c.fillStyle = 'rgba(20,24,60,.28)'; c.fillRect(0, 0, 1200, 800); }
  mapRaf = requestAnimationFrame(mapFrame);
}
map.addEventListener('click', e => {
  const r = map.getBoundingClientRect(), x = (e.clientX - r.left) * 1200 / r.width, y = (e.clientY - r.top) * 800 / r.height;
  const dx = x - CX, dy = (y - CY) / SY, d = Math.hypot(dx, dy);
  if (d > R_IN && d < R_OUT) { let a = Math.atan2(dy, dx) * 180 / Math.PI + 90 + 15; a = ((a % 360) + 360) % 360; familyCard(Math.floor(a / 30)); }
});

const PLAZA = [
  ['bell', 'The Mystery Bell', CX, CY - 78], ['archive', 'Celebration Archive', CX - 92, CY - 30], ['council', 'Village Council', CX + 92, CY - 30],
  ['market', 'Market Stalls', CX - 70, CY + 46], ['food', 'Food Stalls', CX + 70, CY + 46], ['inn', 'The Inn', CX, CY + 72],
];
function buildSpots() {
  const box = $('#map-spots'); let h = '';
  for (const st of STREETS) {
    const fam = FAMILIES[st.m].name, list = STREETS.filter(s => s.m === st.m), i = list.indexOf(st), n = list.length;
    const off = n === 1 ? [0] : n === 2 ? [-7, 7] : [-9, 0, 9], rad0 = n === 1 ? [300] : n === 2 ? [245, 345] : [232, 300, 368], rad = st.m % 2 && n === 2 ? rad0.slice().reverse() : rad0;
    const [x, y] = P(rad[i], wedgeAng(st.m) + off[i]);
    const s = S.stamps[st.id];
    h += `<button class="spot${isLive(st) ? ' live' : ''}" data-st="${st.id}" style="left:${x}px;top:${y}px;--c:${shade(FAMILIES[st.m].color, -30)}" aria-label="${esc(st.name)}, ${esc(fam)}"><span class="sign"><span class="st ${s ? (s.gold ? 'gold' : 'on') : ''}"></span>${esc(st.name)}</span></button>`;
  }
  const [lx, ly] = LANTERN_POS;
  h += `<button class="spot${lanternOpen() ? '' : ' locked'}" data-place="lantern" style="left:${lx}px;top:${ly + 50}px;--c:#c8862a"><span class="sign">${lanternOpen() ? 'The Lantern Quarter' : 'Lantern Quarter (closed)'}</span></button>`;
  for (const [id, name, x, y] of PLAZA) h += `<button class="spot plaza" data-place="${id}" style="left:${x}px;top:${y}px"><span class="sign">${name}</span></button>`;
  box.innerHTML = h;
  relax([...box.querySelectorAll('.spot:not(.plaza)')]);
  box.querySelectorAll('[data-st]').forEach(b => b.onclick = () => openStreet(b.dataset.st));
  box.querySelectorAll('[data-place]').forEach(b => b.onclick = () => plaza(b.dataset.place));
}

function relax(els) {
  const R = els.map(e => ({ e, x: parseFloat(e.style.left), y: parseFloat(e.style.top), w: e.offsetWidth + 6, h: e.offsetHeight + 4 }));
  for (let it = 0; it < 60; it++) {
    let moved = false;
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const a = R[i], b = R[j], ox = (a.w + b.w) / 2 - Math.abs(a.x - b.x), oy = (a.h + b.h) / 2 - Math.abs(a.y - b.y);
      if (ox > 0 && oy > 0) { moved = true; if (oy < ox) { const d = (oy / 2 + .5) * (a.y < b.y ? -1 : 1); a.y += d; b.y -= d; } else { const d = (ox / 2 + .5) * (a.x < b.x ? -1 : 1); a.x += d; b.x -= d; } }
    }
    if (!moved) break;
  }
  R.forEach(r => { r.e.style.left = r.x + 'px'; r.e.style.top = r.y + 'px'; });
}
/* ---------- time's children on the map ---------- */
const kidsBox = $('#kids');
let kidTimers = [];
const SEC_LINES = ['It slipped right through your fingers.', 'Gone. Seconds never stay.', 'You almost had it. Almost is all anyone gets with a Second.', 'A giggle, a blur, and it was gone.', 'You can never hold onto a Second.'];
const MIN_LINES = ['Hi. I can only stay a minute. Literally.', 'Did you know there are sixty of us in every Hour? We take turns.', 'The Seconds are my little brothers. All three thousand six hundred of them. Per Hour.', 'I like it here. I might stay a whole extra minute.', 'Shh. Don\'t tell the Weeks I\'m running late.'];
function placeKid(kind, x, y, extra = '') {
  const d = document.createElement('div'); d.className = 'kid ' + kind; d.style.left = x + 'px'; d.style.top = y + 'px';
  d.innerHTML = kidSVG(kind) + extra; kidsBox.appendChild(d); return d;
}
function spawnSecond() {
  if (S.scene !== 'map') return;
  const a = rnd(0, 6.28), r1 = rnd(150, 380), [x, y] = P(r1, a * 57.3), [x2, y2] = P(rnd(150, 380), a * 57.3 + rnd(60, 160));
  const k = placeKid('sec', x, y);
  const dash = (tx, ty) => { k.style.left = tx + 'px'; k.style.top = ty + 'px'; };
  requestAnimationFrame(() => requestAnimationFrame(() => dash(x2, y2)));
  k.addEventListener('pointerenter', () => { Snd.sfx('whoosh'); const [tx, ty] = P(rnd(150, 390), rnd(0, 360)); dash(tx, ty); });
  k.addEventListener('click', e => { e.stopPropagation(); S.secTries++; toast(pick(SEC_LINES) + (S.secTries > 4 ? ` (Seconds caught: 0. Attempts: ${S.secTries}.)` : '')); k.remove(); });
  setTimeout(() => k.remove(), 2600);
}
function bubbleAt(x, y, html, ms = 6000) {
  $$('.bubble.kidb').forEach(b => b.remove());
  const b = document.createElement('div'); b.className = 'bubble kidb'; b.style.left = clamp(x, 150, 1050) + 'px'; b.style.top = (y - 40) + 'px'; b.innerHTML = html;
  kidsBox.appendChild(b); if (ms) setTimeout(() => b.remove(), ms); return b;
}
function spawnMinute() {
  if (S.scene !== 'map' || $$('.kid.min').length >= 2) return;
  let [x, y] = P(rnd(160, 370), rnd(0, 360));
  const k = placeKid('min', x, y); k.style.transition = 'left 4s linear, top 4s linear';
  const wander = setInterval(() => { [x, y] = P(rnd(160, 370), rnd(0, 360)); k.style.left = x + 'px'; k.style.top = y + 'px'; }, 4200);
  requestAnimationFrame(() => requestAnimationFrame(() => { [x, y] = P(rnd(160, 370), rnd(0, 360)); k.style.left = x + 'px'; k.style.top = y + 'px'; }));
  k.onclick = e => { e.stopPropagation(); const rr = k.getBoundingClientRect(), sr = stage.getBoundingClientRect(), kk = sr.width / 1200; bubbleAt((rr.left - sr.left) / kk, (rr.top - sr.top) / kk, `<b>A Minute</b>${pick(MIN_LINES)}`); Snd.sfx('pop'); };
  setTimeout(() => { clearInterval(wander); k.remove(); }, 60000);
}
function staticKids() {
  $$('.kid.hour,.kid.day,.kid.week').forEach(k => k.remove());
  const day = DAYS[weekday()];
  const dk = placeKid('day', CX + 40, CY + 34, `<span class="tag">${day[0]}</span>`);
  dk.onclick = e => { e.stopPropagation(); const p = S.pout && S.pout[day[0]] !== undefined && absDay() - S.pout[day[0]] < 7; bubbleAt(CX + 40, CY - 10, `<b>${day[0]}</b>${p ? `${day[0]} is still pouting. "You took their side. I remember." Then, a little quieter: "...Do you want to be friends again?"` : `${day[0]} ${day[1]}`}`); if (p) delete S.pout[day[0]]; };
  const wk = placeKid('week', CX, CY - 12, `<span class="tag">A Week</span>`);
  wk.onclick = e => { e.stopPropagation(); const up = upcoming(3); bubbleAt(CX, CY - 60, `<b>A Week, with a clipboard</b>Okay, here's the schedule. Nobody asked, but here: ${up.map(([s, n]) => `${esc(s.holiday)} ${n === 0 ? 'is today' : `in ${n} day${n > 1 ? 's' : ''}`}`).join('; ')}. Try to keep up.`, 9000); };
  if (S.slot >= 1 && S.hourDay !== absDay()) {
    const hk = placeKid('hour', CX - 40, CY + 34, `<span class="tag">An Hour</span>`);
    hk.onclick = e => { e.stopPropagation(); hourVisit(); };
  }
}
/* ---------- the families argue ---------- */
function freeSpot(a0, a1, step, rmax = 380) {
  const signs = [...document.querySelectorAll('#map-spots .spot, .kid.arg')].map(e => ({ x: parseFloat(e.style.left), y: parseFloat(e.style.top) - (e.classList.contains('kid') ? 30 : 0), w: (e.offsetWidth || 70) / 2 + 40, h: (e.offsetHeight || 40) / 2 + 40 }));
  let best = P(300, a0), bestD = -1;
  for (let r = 190; r <= rmax; r += 15) for (let a = a0; a <= a1; a += step) {
    const [cx, cy] = P(r, a);
    let dmin = 1e9; for (const g of signs) { const dx = Math.max(0, Math.abs(cx - g.x) - g.w), dy = Math.max(0, Math.abs(cy - 35 - g.y) - g.h - 12); dmin = Math.min(dmin, Math.hypot(dx, dy)); }
    if (dmin > bestD) { bestD = dmin; best = [cx, cy]; }
  }
  return best;
}
const famShort = m => FAMILIES[m].name.replace('The ', '');
function todaysArgument() {
  if (S.argDone === absDay()) return null;
  if (S.argDay !== absDay() || !S.argId) {
    const pool = ARGUMENTS.filter(a => a.id !== S.argId);
    const live = pool.filter(a => [a.a, a.b].includes(dateOf(S.doy).m));
    S.argId = (live.length && Math.random() < .6 ? pick(live) : pick(pool)).id; S.argDay = absDay();
  }
  return ARGUMENTS.find(a => a.id === S.argId);
}
function argSpot() {
  $$('.kid.arg').forEach(k => k.remove());
  const A = todaysArgument(); if (!A) return;
  const [x, y] = freeSpot(wedgeAng(A.a) - 12, wedgeAng(A.a) + 12, 3);
  const d = document.createElement('div'); d.className = 'kid arg'; d.style.left = x + 'px'; d.style.top = y + 'px';
  const fa = FAMILIES[A.a], fb = FAMILIES[A.b];
  d.innerHTML = `<div class="arg-pair"><div class="arg-l">${personSVG({ w: 30, color: fa.color, ...HOST_LOOK[A.a] })}</div><div class="arg-r">${personSVG({ w: 30, color: fb.color, ...HOST_LOOK[A.b] })}</div></div><span class="shout" id="shout"></span><span class="tag">An argument</span>`;
  d.onclick = e => { e.stopPropagation(); settleArgument(A); };
  kidsBox.appendChild(d);
  const SH = ['Most important!', 'Are not!', 'Are too!', 'Says who?', 'Hmph!', 'Ask anyone!', 'Ridiculous!', 'We were here first!'];
  let k = 0; const sh = d.querySelector('#shout');
  const tick = () => { if (!d.isConnected) return; sh.textContent = SH[k++ % SH.length]; sh.className = 'shout ' + (k % 2 ? 'l' : 'r'); };
  tick(); kidTimers.push(setInterval(tick, 1500));
}
function settleArgument(A) {
  const fa = FAMILIES[A.a], fb = FAMILIES[A.b];
  const who = sp => sp === 'a' ? fa : fb;
  const augustHere = A.a === 7 || A.b === 7;
  const choices = [
    { label: `Side with the ${famShort(A.a)}`, value: 'a' },
    { label: `Side with the ${famShort(A.b)}`, value: 'b' },
    { label: `"${A.wise}"`, value: 'wise', gold: true },
  ];
  if (!augustHere) choices.push({ label: 'Fetch Lady August', value: 'aug' });
  Snd.sfx('pop');
  modal(`<p class="kicker">The months are arguing again</p><h2>${esc(A.title)}</h2>
    <div class="arg-stage"><div>${personSVG({ w: 64, color: fa.color, ...HOST_LOOK[A.a] })}<small>${esc(fa.host)}</small></div><div class="vs">vs</div><div>${personSVG({ w: 64, color: fb.color, ...HOST_LOOK[A.b] })}<small>${esc(fb.host)}</small></div></div>
    <div class="dialog">${A.lines.map(([sp, t], i) => sp === 'x' ? `<p class="narr" style="animation-delay:${i * .7}s">${esc(t)}</p>` : `<p class="say ${sp}" style="animation-delay:${i * .7}s;--c:${shade(who(sp).color, -35)}"><b>${esc(who(sp).host)}</b>${esc(t)}</p>`).join('')}</div>
    <p style="color:var(--ink-2);font-size:14px">They both turn to look at you. How do you settle it?</p>`, choices.map(c => ({ ...c, primary: false })), true).then(v => {
      if (!v || v === 'Close') return;
      S.argDone = absDay(); $$('.kid.arg').forEach(k => k.remove());
      let h, b;
      if (v === 'a' || v === 'b') {
        const win = v === 'a' ? A.a : A.b, lose = v === 'a' ? A.b : A.a;
        var argUps = addFriend(win, 1); S.favor[win] = (S.favor[win] || 0) + 2; S.sulk[lose] = 3; S.sulkBy[lose] = win; S.smug[win] = absDay(); S.favor[lose] = Math.max(0, (S.favor[lose] || 0) - 1);
        h = `The ${famShort(win)} win this round`;
        b = `${esc(FAMILIES[win].host)} throws both arms in the air. The ${famShort(win)} will remember this kindly. <br><br>${esc(FAMILIES[lose].host)} folds both arms and turns away. The ${famShort(lose)} will sulk for a few days, and their students pay you half while they do.`;
        Snd.sfx('good');
      } else if (v === 'wise') {
        var argUps = [...addFriend(A.a, 1), ...addFriend(A.b, 1)]; S.favor[A.a] = (S.favor[A.a] || 0) + 1; S.favor[A.b] = (S.favor[A.b] || 0) + 1; S.harmony = (S.harmony || 0) + 2;
        h = 'Peace on the ring road';
        b = `Both families stop. ${esc(fa.host)} looks at ${esc(fb.host)}. ${esc(fb.host)} looks at ${esc(fa.host)}. Then they both laugh, and somebody goes to get snacks.<br><br><b>Village harmony grows.</b> The more harmony Merrywheel has, the bigger the August Jubilee.`;
        Snd.sfx('bell');
      } else {
        S.harmony = (S.harmony || 0) + 1;
        h = 'Lady August arrives';
        b = `Lady August glides in, says "Now, now," and both families apologize immediately. Nobody knows how she does it. Harmony grows a little.`;
        Snd.sfx('good');
      }
      updateHUD();
      modal(`<p class="kicker">${esc(A.title)}</p><h2>${h}</h2><p>${b}</p><p style="color:var(--ink-2);font-size:14px">Village harmony: ${harmonyStars()}</p>`).then(() => showUps(typeof argUps !== 'undefined' ? argUps : []));
    });
}
const harmonyStars = () => { const n = clamp(Math.floor((S.harmony || 0) / 2), 0, 10); return `<span class="stars">${'★'.repeat(n)}${'☆'.repeat(10 - n)}</span>`; };
/* ---------- time's children squabble ---------- */
function todaysKidArg() {
  if (S.kidArgDone === absDay()) return null;
  if (S.kidArgDay !== absDay() || !S.kidArgId) {
    const today = DAYS[weekday()][0], pool = KID_ARGS.filter(a => a.id !== S.kidArgId);
    const mine = pool.filter(a => a.a.n === today || a.b.n === today);
    S.kidArgId = (mine.length && Math.random() < .5 ? pick(mine) : pick(pool)).id; S.kidArgDay = absDay();
  }
  return KID_ARGS.find(a => a.id === S.kidArgId);
}
const kidSize = k => ({ sec: 22, min: 24, hour: 26, day: 26, week: 24 }[k]);
function kidArgSpot() {
  $$('.kid.karg').forEach(k => k.remove());
  const A = todaysKidArg(); if (!A) return;
  const [x, y] = freeSpot(0, 357, 9, 330);
  const d = document.createElement('div'); d.className = 'kid arg karg'; d.style.left = x + 'px'; d.style.top = y + 'px';
  d.innerHTML = `<div class="arg-pair"><div class="arg-l">${kidSVG(A.a.k, kidSize(A.a.k))}</div><div class="arg-r">${kidSVG(A.b.k, kidSize(A.b.k))}</div></div><span class="shout" id="kshout"></span><span class="tag kidtag">${esc(A.a.n.replace(/^(A|An|The) /, ''))} vs ${esc(A.b.n.replace(/^(A|An|The|Another) /, ''))}</span>`;
  d.onclick = e => { e.stopPropagation(); settleKidArg(A); };
  kidsBox.appendChild(d);
  const SH = A.rush ? ['Mine!', 'MINE!', 'No, mine!', 'Wheee!'] : ['Not fair!', 'Says who?', 'I was first!', 'Nuh-uh!', 'Yuh-huh!', 'Tell them!'];
  let k = 0; const sh = d.querySelector('#kshout');
  const tick = () => { if (!d.isConnected) return; sh.textContent = SH[k++ % SH.length]; sh.className = 'shout ' + (k % 2 ? 'l' : 'r'); };
  tick(); kidTimers.push(setInterval(tick, A.rush ? 700 : 1300));
}
function settleKidArg(A) {
  const nm = sp => sp === 'a' ? A.a.n : A.b.n, kd = sp => sp === 'a' ? A.a.k : A.b.k;
  const hoursIn = A.a.k === 'hour' || A.b.k === 'hour';
  const stageH = `<div class="arg-stage"><div>${kidSVG(A.a.k, kidSize(A.a.k) * 2.2)}<small>${esc(A.a.n)}</small></div><div class="vs">vs</div><div>${kidSVG(A.b.k, kidSize(A.b.k) * 2.2)}<small>${esc(A.b.n)}</small></div></div>`;
  const dlg = `<div class="dialog">${A.lines.map(([sp, t], i) => sp === 'x' ? `<p class="narr" style="animation-delay:${i * .6}s">${esc(t)}</p>` : `<p class="say ${sp}" style="animation-delay:${i * .6}s;--c:${{ sec: '#b5852a', min: '#4f7fa3', hour: '#7d55a8', day: '#b5852a', week: '#3f7a52' }[kd(sp)]}"><b>${esc(nm(sp))}</b>${esc(t)}</p>`).join('')}</div>`;
  Snd.sfx('pop');
  if (A.rush) {
    S.kidArgDone = absDay(); $$('.kid.karg').forEach(k => k.remove());
    for (let i = 0; i < 6; i++) setTimeout(() => Snd.sfx('whoosh'), i * 90);
    return modal(`<p class="kicker">Time's children are squabbling</p><h2>${esc(A.title)}</h2>${stageH}${dlg}`, [{ label: 'Laugh and let them go', primary: true }], true);
  }
  const choices = [{ label: `Side with ${A.a.n.replace(/^A |^An /, 'the ')}`, value: 'a' }, { label: `Side with ${A.b.n.replace(/^A |^An /, 'the ')}`, value: 'b' }, { label: `"${A.wise}"`, value: 'wise', gold: true },
    hoursIn ? { label: 'Ask a Week to check the schedule', value: 'ref' } : { label: 'Call an Hour to sort it out', value: 'ref' }];
  modal(`<p class="kicker">Time's children are squabbling</p><h2>${esc(A.title)}</h2>${stageH}${dlg}<p style="color:var(--ink-2);font-size:14px">They both look up at you. Little kids take this stuff very seriously.</p>`, choices, true).then(v => {
    if (!v || v === 'Close') return;
    S.kidArgDone = absDay(); $$('.kid.karg').forEach(k => k.remove());
    let h, b;
    const pout = n => { const d = DAYS.find(x => x[0] === n); if (d) S.pout[n] = absDay(); };
    if (v === 'a' || v === 'b') {
      const win = v === 'a' ? A.a.n : A.b.n, lose = v === 'a' ? A.b.n : A.a.n;
      const gift = Math.random() < .5 ? (S.coins += 6, '6 shiny coins from a very small pocket') : (S.treats.push(pick(TREATS)), `a slightly squished ${S.treats[S.treats.length - 1]}`);
      pout(lose);
      h = `${esc(win)} wins`; b = `${esc(win)} does a victory dance and hands you ${gift}.<br><br>${esc(lose)} sticks out a bottom lip and pouts${DAYS.some(d => d[0] === lose) ? ` and will still be pouting next time you see ${esc(lose)} in the plaza` : ''}.`;
      Snd.sfx('coin');
    } else {
      S.trust = (S.trust || 0) + (v === 'wise' ? 2 : 1); S.harmony = (S.harmony || 0) + (v === 'wise' ? 1 : 0);
      h = v === 'wise' ? 'They both go quiet and think about it' : hoursIn ? 'A Week checks the clipboard' : 'An Hour steps in';
      const lc = n => n.replace(/^(A|An|The|Another) /, m => m.toLowerCase());
      b = v === 'wise' ? `Then ${esc(lc(A.a.n))} offers ${esc(lc(A.b.n))} half a cookie, and that's the end of that. Somewhere nearby, an Hour nods with approval.` : hoursIn ? 'The Week flips three pages, announces that "it says here you are both important," and walks off. It works.' : 'An Hour, one of the responsible older kids, kneels down, listens to both sides, and gets everyone to shake hands. It nods at you on its way out.';
      if (S.trust >= 3) { S.trust -= 3; S.hourFree += 1; b += `<br><br><b>The Hours trust you now.</b> One will sit with you during your next lesson, so it won't use up any time.`; }
      else b += `<br><br><small style="color:var(--ink-2)">The Hours notice kindness. Keep it up and one will sit with you a while.</small>`;
      Snd.sfx('good');
    }
    updateHUD(); modal(`<p class="kicker">${esc(A.title)}</p><h2>${h}</h2><p>${b}</p>`);
  });
}

/* ---------- friendships ---------- */
const heartsOf = m => HEART_AT.filter(t => (S.fr[m] || 0) >= t).length - 1;
const heartStr = m => { const h = heartsOf(m); return `<span class="hearts" style="--c:${shade(FAMILIES[m].color, -30)}">${'♥'.repeat(h)}<span class="off">${'♥'.repeat(5 - h)}</span></span>`; };
function addFriend(m, n) {
  if (m === undefined || m === null || !(m in FAMILIES) || n <= 0) return [];
  const before = heartsOf(m); S.fr[m] = (S.fr[m] || 0) + n; const after = heartsOf(m), ups = [];
  for (let h = before + 1; h <= after; h++) ups.push([m, h]);
  return ups;
}
async function showUps(ups) {
  for (const [m, h] of ups) {
    const f = FAMILIES[m];
    Snd.sfx('stamp');
    if (h === 1) await modal(`<p class="kicker">${esc(f.name)}</p><h2>${heartStr(m)}<br>${esc(f.host)} likes you</h2><p>"You're alright," ${esc(f.host)} says. "Come by again sometime." Keep visiting, chatting, and bringing gifts.</p>`);
    else if (h === 2 || h === 4) await modal(`<p class="kicker">${esc(f.name)} · ${h} hearts</p><h2>A moment with ${esc(f.host)}</h2><p>${esc(MOMENTS[m][h === 2 ? 0 : 1])}</p>${h === 2 ? '<p style="color:var(--ink-2);font-size:14px">At 3 hearts, they\'ll start sending you gifts in the morning mail.</p>' : '<p style="color:var(--ink-2);font-size:14px">One more heart, and you\'ll be an honorary member of the family.</p>'}`, [{ label: 'Close', primary: true }], true);
    else if (h === 3) { const [n, d] = KEEPSAKES[m][0]; if (!S.keeps.includes(m + ':0')) S.keeps.push(m + ':0'); await modal(`<p class="kicker">${esc(f.name)} · 3 hearts</p><h2>A family keepsake</h2><p>${esc(f.host)} gives you <b>${esc(n)}</b>. ${esc(d)}</p><p>From now on, ${esc(f.name)} will sometimes leave gifts in your morning mail.</p>`); }
    else if (h === 5) { const [n, d] = KEEPSAKES[m][1]; if (!S.keeps.includes(m + ':1')) S.keeps.push(m + ':1'); await modal(`<p class="kicker">${esc(f.name)} · 5 hearts</p><h2>Honorary ${esc(f.name.replace('The ', '').replace(/s$/, ''))}</h2><p>The whole family gathers on their street. ${esc(f.host)} makes a speech that goes on a little long, and everybody claps. You are officially family.</p><p>They give you their most treasured keepsake: <b>${esc(n)}</b>. ${esc(d)}</p><p><b>Family perk:</b> students on ${esc(f.name)}'s streets now pay you double.</p>`, [{ label: 'Close', primary: true }], true); }
  }
  updateHUD(); if (S.scene === 'map') drawBase();
}
function giftValue(m, it) {
  if (it.treat) return it.name === TREATS[m] ? ['love', 3] : ['like', 1];
  const st = streetById(it.st), dis = GIFT_DISLIKE[m];
  if (dis && st && st.id === dis[0]) return ['dislike', 0, dis[1]];
  if (st && !st.world && st.m === m) return ['love', 4];
  return ['like', 2];
}
function giftMenu(st) {
  const m = st.m, f = FAMILIES[m];
  if (S.gave[m] === absDay()) return modal(`<h2>One gift a day</h2><p>${esc(f.host)} is still admiring today's gift. Come back tomorrow.</p>`);
  const items = [...S.bag.map((it, i) => ({ ...it, i })), ...S.treats.map((t, i) => ({ name: t, treat: true, i }))];
  if (!items.length) return modal(`<h2>Nothing to give yet</h2><p>Make crafts on any street, or buy treats at the Food Stalls. ${esc(f.name)} love anything from their own streets, and their favorite treat is <b>${esc(TREATS[m])}</b>.</p>`);
  modal(`<p class="kicker">A gift for ${esc(f.host)}</p><h2>What will you give?</h2><p style="font-size:14px;color:var(--ink-2)">Hint: ${esc(f.name)} love things made on their own streets, and their favorite treat is ${esc(TREATS[m])}.</p>
    <ul class="list">${items.map((it, k) => `<li class="row"><div class="grow"><b>${esc(it.name)}</b><small>${it.treat ? 'A treat' : `<span class="stars">${'★'.repeat(it.stars)}</span> · from ${esc(streetById(it.st).name)}`}</small></div><button class="btn sm gold" data-g="${k}">Give</button></li>`).join('')}</ul>`, [{ label: 'Never mind' }], true);
  $$('[data-g]').forEach(b => b.onclick = () => {
    const it = items[+b.dataset.g]; closeModal();
    if (it.treat) S.treats.splice(it.i, 1); else S.bag.splice(it.i, 1);
    const [kind, pts, line] = giftValue(m, it);
    S.gave[m] = absDay();
    const wasSulk = S.sulk[m] > 0; if (wasSulk) S.sulk[m] = 0;
    const ups = addFriend(m, pts);
    Snd.sfx(kind === 'love' ? 'bell' : kind === 'like' ? 'good' : 'bad');
    modal(`<p class="kicker">${esc(f.name)} ${heartStr(m)}</p><h2>${kind === 'love' ? 'They love it' : kind === 'like' ? 'They like it' : 'Hmm'}</h2><p>${esc(f.host)}: "${esc(line || pick(kind === 'love' ? GIFT_LOVE : GIFT_LIKE))}"</p>${wasSulk ? `<p><b>All is forgiven.</b> ${esc(f.host)} stops sulking about the argument.</p>` : ''}`).then(() => showUps(ups)).then(() => openStreet(st.id));
  });
}

function hostLine(st) {
  if (st.world) return pick(hostOf(st).lines);
  const m = st.m;
  if (S.sulk[m] > 0) return pick(SULK_LINES).replace('{r}', famShort(S.sulkBy[m] ?? 0));
  if (S.smug[m] !== undefined && absDay() - S.smug[m] <= 2 && Math.random() < .6) return pick(SMUG_LINES);
  return pick(hostOf(st).lines);
}

function hourVisit() {
  const b = bubbleAt(CX - 40, CY - 10, `<b>An Hour, resting on the bench</b>The Hours will sit with you a while, if you're kind to them.<br>
    <button class="btn sm gold" id="hr-treat" ${S.treats.length ? '' : 'disabled'}>Share a treat${S.treats.length ? '' : ' (buy one at the Food Stalls)'}</button>
    <button class="btn sm" id="hr-talk">Ask how its day is going</button>`, 0);
  const sit = n => {
    S.hourFree += n; S.hourDay = absDay(); b.remove(); staticKids(); Snd.sfx('good'); updateHUD();
    modal(`<p class="kicker">Time slows down</p><h2>An Hour sits with you</h2><p>It leans on your shoulder and tells you about all the afternoons it has been. Everything feels slower and softer.</p><p><b>Your next ${n === 1 ? 'lesson won\'t' : n + ' lessons won\'t'} use up any time.</b></p>`);
  };
  $('#hr-treat').onclick = () => { const t = S.treats.shift(); toast(`You share your ${esc(t)}.`); sit(2); };
  $('#hr-talk').onclick = () => sit(1);
}
function startKids() {
  stopKids(); kidsBox.innerHTML = ''; staticKids(); argSpot(); kidArgSpot();
  kidTimers.push(setInterval(() => { if (Math.random() < .8) spawnSecond(); }, 1100));
  kidTimers.push(setInterval(spawnMinute, 9000)); setTimeout(spawnMinute, 1500);
}
function stopKids() { kidTimers.forEach(clearInterval); kidTimers = []; }

/* ---------- weather ---------- */
const wcv = $('#weather'), wc = wcv.getContext('2d'); let flakes = [], drops = [];
function weatherLoop() {
  wc.clearRect(0, 0, 1200, 800);
  const want = Math.round(S.snow * 3);
  while (flakes.length < want) flakes.push({ x: rnd(0, 1200), y: rnd(-800, 0), r: rnd(1.2, 3.6), v: rnd(.5, 1.6), w: rnd(0, 6) });
  if (flakes.length > want) flakes.length = want;
  wc.fillStyle = 'rgba(255,255,255,.9)';
  for (const f of flakes) { f.y += f.v; f.x += Math.sin(f.y / 40 + f.w) * .5; if (f.y > 810) { f.y = -10; f.x = rnd(0, 1200); } wc.beginPath(); wc.arc(f.x, f.y, f.r, 0, 7); wc.fill(); }
  if (S.weather === 'rain' && S.scene !== 'title') {
    while (drops.length < 160) drops.push({ x: rnd(0, 1200), y: rnd(-800, 800), v: rnd(9, 14) });
    wc.strokeStyle = 'rgba(180,200,230,.55)'; wc.lineWidth = 1.2; wc.beginPath();
    for (const d of drops) { d.y += d.v; d.x -= 1.5; if (d.y > 810) { d.y = -20; d.x = rnd(0, 1250); } wc.moveTo(d.x, d.y); wc.lineTo(d.x + 3, d.y - 12); }
    wc.stroke();
  }
  requestAnimationFrame(weatherLoop);
}
requestAnimationFrame(weatherLoop);
$('#snow').addEventListener('input', e => { S.snow = +e.target.value; S.snowUser = true; });
function autoWeather() {
  const m = dateOf(S.doy).m;
  if (!S.snowUser) { S.snow = (m === 11 || m <= 1) ? 40 : 0; $('#snow').value = S.snow; }
  S.weather = m === 3 ? (Math.random() < .5 ? 'rain' : 'clear') : (m === 4 || m === 9) && Math.random() < .2 ? 'rain' : 'clear';
}

/* ---------- scenes ---------- */
function go(scene) {
  $$('.scene').forEach(s => s.hidden = true);
  $('#scene-' + scene).hidden = false; S.scene = scene;
  cancelAnimationFrame(mapRaf); stopKids(); clearInterval(Game.timer); cancelAnimationFrame(Game.raf);
  if (scene === 'map') { drawBase(); buildSpots(); mapRaf = requestAnimationFrame(mapFrame); startKids(); }
  updateHUD();
}
$('#btn-back').onclick = () => { if (S.scene === 'lesson') { clearInterval(Game.timer); cancelAnimationFrame(Game.raf); openStreet(S.street); } else go('map'); };

function familyCard(m) {
  const f = FAMILIES[m], list = STREETS.filter(s => s.m === m);
  modal(`<p class="kicker" style="color:${shade(f.color, -40)}">${MONTHS[m]}</p><h2>${f.name} ${heartStr(m)}</h2><p>${f.traits}</p><p style="font-size:14px"><b>Mood:</b> ${S.sulk[m] > 0 ? `Sulking at you for siding with the ${famShort(S.sulkBy[m] ?? 0)} (${S.sulk[m]} more day${S.sulk[m] > 1 ? 's' : ''})` : (S.favor[m] || 0) >= 2 ? 'Fond of you' : 'Friendly'} · <b>Favor:</b> ${'●'.repeat(clamp(S.favor[m] || 0, 0, 4))}${'○'.repeat(4 - clamp(S.favor[m] || 0, 0, 4))} <small style="color:var(--ink-2)">(fill it and they give you a gift)</small></p>
    <ul class="list">${list.map(s => `<li class="row"><div class="grow"><b>${esc(s.name)}</b><small>${esc(s.holiday)} · ${fmtDate(doyOf(s.m, s.d))}${S.stamps[s.id] ? ' · Stamped' : ''}</small></div><button class="btn sm primary" data-go="${s.id}">Visit</button></li>`).join('')}</ul>`, [{ label: 'Close' }]);
  $$('[data-go]').forEach(b => b.onclick = () => { closeModal(); openStreet(b.dataset.go); });
}

function hostOf(st) {
  if (st.world) { const [n, skin, lines] = WORLD_HOSTS[st.id]; return { name: n, color: '#c8862a', look: { skin, hat: 'none', hair: '#2a1a14' }, lines }; }
  const f = famOf(st); return { name: f.host, color: f.color, look: HOST_LOOK[st.m], lines: f.lines };
}
function openStreet(id) {
  const st = streetById(id); if (!st) return;
  S.street = id; go('street');
  const c = shade(stColor(st), -30), n = until(st), host = hostOf(st);
  $('#street-bg').style.backgroundImage = `url(img/${st.img}.jpg)`;
  const p = $('#street-panel'); p.style.setProperty('--c', c);
  const fam = st.world ? 'The Lantern Quarter' : famOf(st).name;
  const stamp = S.stamps[id];
  p.innerHTML = `<span class="fam">${fam}</span><h2>${esc(st.name)}</h2>
    <div class="when">${esc(st.holiday)} · ${fmtDate(doyOf(st.m, st.d))}${st.world ? ' (this year)' : ''}</div>
    ${n <= 2 ? `<div class="live-banner">${n === 0 ? 'Celebrating today' : 'Celebrating now'}. Lessons earn a gold seal on your passport.</div>` : inSeason(st) ? `<div class="live-banner" style="background:#f6e3b0">Coming up in ${n} days. Lessons earn a gold seal now.</div>` : ''}
    <h3>Traditions</h3><ul class="facts">${st.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
    <h3>${st.solemn ? 'Take part' : 'Learn a craft'}</h3>
    <div class="lessons">${st.lessons.map((l, i) => {
      const key = id + ':' + i, best = S.best[key], learned = S.skills[key];
      return `<button class="lesson-btn" data-l="${i}"><span>${esc(l.name)}<small>${l.type === 'reflect' ? 'A quiet, respectful tradition' : learned ? `You teach this now. Best: <span class="stars">${'★'.repeat(best || 1)}${'☆'.repeat(3 - (best || 1))}</span>` : `Learn it, then teach it to visitors for income`}</small></span>
        <span class="badge ${learned ? 'on' : ''}">${learned ? (l.type === 'reflect' ? 'Done' : 'Learned') : S.hourFree ? 'Free time' : SLOTS[S.slot] === 'Night' ? 'Rest first' : 'Takes a while'}</span></button>`;
    }).join('')}
    ${st.jubilee ? `<button class="lesson-btn" id="btn-jub"><span>${n <= 2 ? 'Watch the August Jubilee' : 'Watch the Jubilee rehearsal'}<small>${n <= 2 ? 'All twelve families. All of time\'s children. Tonight.' : 'The real show is August 20. The children are practicing.'}</small></span><span class="badge ${S.jubilee[S.y] ? 'gold' : ''}">${S.jubilee[S.y] ? 'Seen' : 'Show'}</span></button>` : ''}
    </div>
    <h3>Passport</h3><p style="margin:4px 0;font-size:14px">${stamp ? `Stamped${stamp.gold ? ' with a gold seal' : ''}. ${stamp.gold ? '' : 'Come back during the celebration for the gold seal.'}` : 'Finish a lesson here to earn this street\'s stamp.'}</p>`;
  p.querySelectorAll('[data-l]').forEach(b => b.onclick = () => startLesson(st, +b.dataset.l));
  const jb = $('#btn-jub'); if (jb) jb.onclick = () => jubilee(n <= 2);
  if (!st.world && (S.favor[st.m] || 0) >= 4) {
    S.favor[st.m] -= 4; const t = pick(TREATS); S.coins += 25; S.treats.push(t); updateHUD();
    setTimeout(() => modal(`<p class="kicker">${esc(famOf(st).name)}</p><h2>A gift, for being on our side</h2><p>${esc(host.name)} presses a little parcel into your hands: <b>25 coins</b> and a <b>${esc(t)}</b>. "You always know who's right," they whisper.</p>`), 300);
  }
  const hostEl = $('#street-host');
  hostEl.innerHTML = personSVG({ w: 110, color: host.color, ...host.look });
  hostEl.onclick = () => {
    $$('#street-host .bubble').forEach(b => b.remove());
    const b = document.createElement('div'); b.className = 'bubble';
    let ups = [], chatNote = '';
    if (!st.world) {
      const m = st.m;
      if (S.talked[m] !== absDay()) { S.talked[m] = absDay(); if (!(S.sulk[m] > 0)) { ups = addFriend(m, 1); chatNote = '<small class="fr-note">+1 friendship for chatting today</small>'; } else chatNote = '<small class="fr-note">Still sulking. A gift might help.</small>'; }
    }
    b.innerHTML = `<b>${esc(host.name)}</b>${st.world ? '' : heartStr(st.m)}${esc(hostLine(st))}${chatNote}${st.world ? '' : `<br><button class="btn sm gold" id="btn-gift">Give a gift</button>`}`;
    hostEl.appendChild(b); Snd.sfx('pop');
    const gb = b.querySelector('#btn-gift'); if (gb) gb.onclick = e => { e.stopPropagation(); b.remove(); giftMenu(st); };
    b.onclick = e => e.stopPropagation();
    setTimeout(() => b.remove(), 9000);
    if (ups.length) setTimeout(() => showUps(ups), 900);
  };
}

/* ---------- lessons ---------- */
const Game = { timer: 0, raf: 0 };
function startLesson(st, i) {
  const l = st.lessons[i];
  if (S.slot >= 3 && !S.hourFree) {
    modal(`<h2>The lanterns are lit</h2><p>It's late in Merrywheel. Rest at the Inn, and the families will be teaching again in the morning.</p>`, [{ label: 'Go to the Inn', primary: true, value: 'inn' }, { label: 'Not yet' }]).then(v => { if (v === 'inn') { go('map'); plaza('inn'); } });
    return;
  }
  go('lesson'); S.street = st.id;
  $('#lesson-bg').style.backgroundImage = `url(img/${st.img}.jpg)`;
  const card = $('#lesson-card'); card.style.setProperty('--c', shade(stColor(st), -30));
  const done = score => finishLesson(st, i, score);
  ({ order: lessonOrder, paint: lessonPaint, find: lessonFind, timing: lessonTiming, clock: lessonClock, reflect: lessonReflect })[l.type](card, l, st, done);
}
const head = (l, st, sub) => `<div class="lesson-head"><div><p class="kicker">${esc(st.name)}</p><h2>${esc(l.name)}</h2></div><p>${sub}</p></div>`;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }

function lessonOrder(card, l, st, done) {
  let next = 0, miss = 0; const order = shuffle(l.steps.map((s, i) => i));
  const host = hostOf(st);
  card.innerHTML = head(l, st, `${esc(host.name)} is teaching. Pick the steps in the right order.`) +
    `<div class="steps-grid">${order.map(i => `<button class="step" data-i="${i}">${esc(l.steps[i])}</button>`).join('')}</div><div class="recipe"><b>Your steps</b><ol id="rec"></ol></div><p id="ord-msg" style="color:var(--ink-2);margin-top:8px">Mistakes: 0</p>`;
  card.querySelectorAll('.step').forEach(b => b.onclick = () => {
    if (b.classList.contains('done')) return;
    if (+b.dataset.i === next) {
      b.classList.add('done'); $('#rec').insertAdjacentHTML('beforeend', `<li>${esc(l.steps[next])}</li>`); next++; Snd.sfx('pop');
      if (next === l.steps.length) setTimeout(() => done(Math.max(30, 100 - miss * 15)), 500);
    } else { miss++; b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); Snd.sfx('bad'); $('#ord-msg').textContent = `Mistakes: ${miss}. Hint: what comes right after "${next ? l.steps[next - 1] : 'the very start'}"?`; }
  });
}

function shapeDef(shape) {
  /* returns {clip: svg path for outline, regions: [svg element strings with __F__], extra} in a 200x200 box */
  const R = [];
  if (shape === 'heart' || shape === 'egg' || shape === 'diya') {
    const clip = shape === 'heart' ? 'M100 180 C20 120 10 70 40 45 C65 25 92 38 100 60 C108 38 135 25 160 45 C190 70 180 120 100 180z'
      : shape === 'egg' ? 'M100 15 C150 15 172 95 168 128 C163 168 135 188 100 188 C65 188 37 168 32 128 C28 95 50 15 100 15z'
      : 'M20 100 Q100 98 180 100 Q170 165 100 170 Q30 165 20 100z';
    const top = shape === 'diya' ? 98 : 15, bot = shape === 'diya' ? 172 : 190, n = shape === 'egg' ? 6 : shape === 'diya' ? 4 : 5, h = (bot - top) / n;
    for (let i = 0; i < n; i++) R.push(`<rect x="0" y="${top + i * h}" width="200" height="${h + .5}" fill="__F__" clip-path="url(#clp)"/>`);
    if (shape === 'egg') [70, 100, 130].forEach(x => R.push(`<circle cx="${x}" cy="${top + 2.5 * h}" r="8" fill="__F__"/>`));
    if (shape === 'heart') R.push(`<path d="M100 120 C80 104 74 92 82 85 C89 79 97 83 100 90 C103 83 111 79 118 85 C126 92 120 104 100 120z" fill="__F__"/>`);
    if (shape === 'diya') [60, 100, 140].forEach(x => R.push(`<circle cx="${x}" cy="${top + 1.5 * h}" r="6" fill="__F__"/>`));
    const extra = shape === 'diya' ? `<path d="M100 60 Q114 80 100 96 Q86 80 100 60z" fill="#f5b52a"/><path d="M100 72 Q106 84 100 94 Q94 84 100 72z" fill="#fff3b0"/>` : '';
    return { clip, regions: R, extra };
  }
  if (shape === 'flags') {
    for (let i = 0; i < 5; i++) { const x = 8 + i * 38; R.push(`<path d="M${x} 40 h34 v70 l-17 14 l-17 -14z" fill="__F__"/>`); }
    for (let i = 0; i < 5; i++) { const x = 25 + i * 38; R.push(`<circle cx="${x}" cy="78" r="9" fill="__F__"/>`); }
    return { clip: null, regions: R, extra: `<path d="M0 40 Q100 34 200 40" stroke="#5d5368" stroke-width="2" fill="none"/>` };
  }
  if (shape === 'mask') {
    const clip = 'M15 80 Q20 45 60 50 Q100 60 140 50 Q180 45 185 80 Q190 125 150 130 Q120 132 100 112 Q80 132 50 130 Q10 125 15 80z';
    for (let i = 0; i < 4; i++) R.push(`<rect x="${i * 50}" y="40" width="50.5" height="100" fill="__F__" clip-path="url(#clp)"/>`);
    R.push(`<ellipse cx="62" cy="88" rx="24" ry="17" fill="__F__"/>`, `<ellipse cx="138" cy="88" rx="24" ry="17" fill="__F__"/>`);
    return { clip, regions: R, extra: `<ellipse cx="62" cy="88" rx="13" ry="9" fill="#fbf6ea"/><ellipse cx="138" cy="88" rx="13" ry="9" fill="#fbf6ea"/>` };
  }
  if (shape === 'wreath') {
    for (let i = 0; i < 8; i++) {
      const a0 = i * Math.PI / 4, a1 = a0 + Math.PI / 4, p = (r, a) => `${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`;
      R.push(`<path d="M${p(80, a0)} A80 80 0 0 1 ${p(80, a1)} L${p(48, a1)} A48 48 0 0 0 ${p(48, a0)}z" fill="__F__"/>`);
    }
    R.push(`<path d="M100 168 L72 150 L74 186z" fill="__F__"/>`, `<path d="M100 168 L128 150 L126 186z" fill="__F__"/>`, `<circle cx="100" cy="168" r="9" fill="__F__"/>`);
    return { clip: null, regions: R, extra: '' };
  }
}
function lessonPaint(card, l, st, done) {
  const def = shapeDef(l.shape), n = def.regions.length;
  const target = def.regions.map(() => pick(l.palette)), mine = def.regions.map(() => '#fbf6ea');
  let cur = l.palette[0];
  const svg = (cols, id, click) => `<svg viewBox="0 0 200 200" width="${click ? 340 : 190}" height="${click ? 340 : 190}">${def.clip ? `<defs><clipPath id="clp${id}"><path d="${def.clip}"/></clipPath></defs><path d="${def.clip}" fill="#fbf6ea" stroke="#5d5368" stroke-width="2"/>` : ''}
    ${def.regions.map((r, i) => r.replace('__F__', cols[i]).replace('url(#clp)', `url(#clp${id})`).replace(/^<(\w+)/, `<$1 class="${click ? 'region' : ''}" data-r="${i}" stroke="#5d5368" stroke-width="${click ? 1.2 : .8}"`)).join('')}${def.extra}</svg>`;
  const draw = () => {
    card.innerHTML = head(l, st, `Copy the design. Pick a color, then tap each part.`) +
      `<div class="paint-wrap"><div class="target">The design${svg(target, 't', false)}</div><div>${svg(mine, 'm', true)}</div></div>
      <div class="palette">${l.palette.map(c => `<button class="swatch ${c === cur ? 'on' : ''}" data-c="${c}" style="background:${c}" aria-label="color"></button>`).join('')}</div>
      <div class="row-btns"><button class="btn primary" id="paint-done">I'm finished</button></div>`;
    card.querySelectorAll('.swatch').forEach(b => b.onclick = () => { cur = b.dataset.c; draw(); });
    card.querySelectorAll('.region').forEach(r => r.onclick = () => { mine[+r.dataset.r] = cur; Snd.sfx('pop'); draw(); });
    $('#paint-done').onclick = () => done(Math.round(100 * mine.filter((c, i) => c === target[i]).length / n));
  };
  draw();
}

function itemSVG(kind, decoy) {
  if (kind === 'eggs') { const c = pick(['#9ec7e6', '#f2c2d4', '#f5e08a', '#a8d5a2', '#c7a6e0']); return `<svg width="30" height="38" viewBox="0 0 30 38"><ellipse cx="15" cy="20" rx="12" ry="16" fill="${c}" stroke="#fff" stroke-width="2"/><path d="M4 18 Q9 14 15 18 Q21 22 26 18" stroke="#fff" stroke-width="2.5" fill="none"/></svg>`; }
  if (kind === 'clover') { const leaves = decoy ? [[-6, -4], [6, -4], [0, -12]] : [[-6, -5], [6, -5], [-6, -15], [6, -15]]; return `<svg width="46" height="54" viewBox="-17 -26 34 40"><path d="M0 -6 Q2 4 -2 13" stroke="#2f6f3a" stroke-width="2" fill="none"/>${leaves.map(([x, y]) => `<circle cx="${x * .75}" cy="${y * .75}" r="5.4" fill="${decoy ? '#4f9a4a' : '#3f8f3a'}"/>`).join('')}</svg>`; }
}
function lessonFind(card, l, st, done) {
  let found = 0, t = 40, rained = false;
  card.innerHTML = head(l, st, `Find ${l.count} ${l.target}s before time runs out.`) + `<div class="field" id="fld" style="${l.theme === 'clover' ? 'background:radial-gradient(circle at 30% 30%,#8fc96f,#5d9e48 60%,#4a8a3a)' : `background-image:url(img/${st.img}.jpg)`}"><div class="hud-l" id="fhud"></div></div>`;
  const f = $('#fld');
  const add = (decoy) => {
    const b = document.createElement('button'); b.className = 'itm'; b.style.left = rnd(5, 95) + '%'; b.style.top = rnd(12, 92) + '%';
    b.innerHTML = itemSVG(l.theme, decoy); b.style.opacity = decoy ? 1 : .9; b.style.transform += ` scale(${rnd(.8, 1.1)}) rotate(${rnd(-30, 30)}deg)`;
    b.onclick = e => { e.stopPropagation(); if (decoy) { Snd.sfx('bad'); toast('Only three leaves on that one.', 1200); b.remove(); return; } found++; Snd.sfx('good'); b.remove(); upd(); if (found >= l.count) end(); };
    f.appendChild(b);
    if (l.theme === 'eggs') { const g = document.createElement('div'); g.style.cssText = `position:absolute;left:${b.style.left};top:calc(${b.style.top} + 8px);pointer-events:none;transform:translate(-50%,-50%)`; g.innerHTML = `<svg width="46" height="22" viewBox="0 0 46 22">${Array.from({ length: 8 }, (_, k) => `<path d="M${3 + k * 5.5} 22 Q${5 + k * 5.5 + rnd(-3, 3)} ${rnd(8, 13)} ${6 + k * 5.5 + rnd(-4, 4)} ${rnd(2, 7)}" stroke="${pick(['#3f7a36', '#4f8e44', '#5a944a'])}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}</svg>`; f.appendChild(g); }
  };
  for (let i = 0; i < l.count; i++) add(false);
  if (l.decoy) for (let i = 0; i < 70; i++) add(true);
  /* grass tufts to hide things */
  const upd = () => $('#fhud').textContent = `Found ${found} of ${l.count} · ${t}s`;
  upd();
  let over = false;
  const end = () => { if (over) return; over = true; clearInterval(Game.timer); S.weather = rained ? 'clear' : S.weather; setTimeout(() => done(Math.round(100 * found / l.count * (found >= l.count ? 1 : .9))), 400); };
  Game.timer = setInterval(() => {
    t--; upd();
    if (l.rain && !rained && t === 25 && Math.random() < .6) { rained = true; S.weather = 'rain'; toast('Cousin April: "Surprise. Rain." The hunt goes on.'); f.style.filter = 'brightness(.8) saturate(.8)'; }
    if (t <= 0) end();
  }, 1000);
}

function lessonTiming(card, l, st, done) {
  const th = l.theme; let spawned = 0, hits = 0, resolved = 0;
  const help = th === 'fireworks' ? 'Tap each rocket right at the top, when it glows, to make it burst.' : th === 'grill' ? 'Flip each patty when it turns golden brown. Not too early, not burnt.' : 'Catch the falling stars before they reach the ground.';
  card.innerHTML = head(l, st, help) + `<div class="field" id="fld" style="background:${th === 'grill' ? '#3a3a3a' : 'linear-gradient(#141a35,#2a3560)'}"><div class="hud-l" id="fhud"></div></div>`;
  const f = $('#fld'), W = 824, H = 430, items = [];
  const upd = () => $('#fhud').textContent = `${hits} of ${l.count}`;
  upd();
  const spawn = () => {
    if (spawned >= l.count) return; spawned++;
    const b = document.createElement('button'); b.className = 'itm';
    const it = { el: b, t: 0, x: rnd(60, W - 60), done: false };
    if (th === 'fireworks') { it.apex = rnd(70, 200); it.dur = rnd(1.6, 2.2); b.innerHTML = `<svg width="24" height="51" viewBox="0 0 16 34"><rect x="5" y="4" width="6" height="22" rx="2" fill="#d24a4a"/><path d="M8 0l5 6H3z" fill="#e2b04a"/><path d="M8 26v8" stroke="#ffd76a" stroke-width="2"/></svg>`; }
    else if (th === 'grill') { const slot = spawned - 1; it.x = 110 + (slot % 5) * 150; it.y = 140 + Math.floor(slot / 5 % 2) * 160; it.dur = rnd(5, 7); b.innerHTML = `<svg width="80" height="56"><ellipse cx="40" cy="28" rx="36" ry="24" fill="#c97a7a" class="pt"/><path d="M14 22h52M14 34h52" stroke="rgba(0,0,0,.35)" stroke-width="4"/></svg>`; }
    else { it.dur = rnd(2.6, 3.6); b.innerHTML = `<svg width="34" height="34" viewBox="-17 -17 34 34"><path d="M0 -15l4 10 11 1-8 7 3 11-10-6-10 6 3-11-8-7 11-1z" fill="#f5d061" stroke="#fff3b0"/></svg>`; }
    b.onclick = e => { e.stopPropagation(); hit(it); };
    f.appendChild(b); items.push(it);
  };
  const resolve = (it, good, msg) => {
    if (it.done) return; it.done = true; resolved++; if (good) hits++; upd();
    if (good) { Snd.sfx(th === 'fireworks' ? 'boom' : 'good'); burst(it); } else { Snd.sfx('bad'); msg && toast(msg, 900); }
    setTimeout(() => it.el.remove(), good ? 700 : 300);
    if (resolved >= l.count) setTimeout(() => { cancelAnimationFrame(Game.raf); clearInterval(Game.timer); done(Math.round(100 * hits / l.count)); }, 900);
  };
  const burst = it => {
    const col = pick(['#ff6b6b', '#ffd76a', '#8ad0ff', '#c7a6ff', '#7dff9a']);
    if (th === 'grill') { it.el.innerHTML = `<svg width="80" height="56"><ellipse cx="40" cy="28" rx="36" ry="24" fill="#8a5a30"/><path d="M14 22h52M14 34h52" stroke="#4a2a14" stroke-width="4"/></svg>`; return; }
    it.el.innerHTML = `<svg width="120" height="120" viewBox="-60 -60 120 120" style="animation:burst .7s ease-out forwards">${Array.from({ length: 14 }, (_, i) => { const a = i * Math.PI / 7; return `<line x1="0" y1="0" x2="${Math.cos(a) * 50}" y2="${Math.sin(a) * 50}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`; }).join('')}</svg>`;
  };
  const hit = it => {
    if (it.done) return; const p = it.t / it.dur;
    if (th === 'fireworks') { if (p >= .78 && p <= 1.08) resolve(it, true); else resolve(it, false, p < .78 ? 'Too early. Fizzle.' : 'Too late.'); }
    else if (th === 'grill') { if (p >= .55 && p <= .8) resolve(it, true); else resolve(it, false, p < .55 ? 'Still raw.' : 'A little crispy.'); }
    else resolve(it, true);
  };
  let last = performance.now();
  const frame = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    for (const it of items) {
      if (it.done) continue; it.t += dt; const p = it.t / it.dur;
      if (th === 'fireworks') {
        const y = H - 20 - (H - 20 - it.apex) * Math.min(1, p / .85);
        it.el.style.left = it.x + 'px'; it.el.style.top = y + 'px'; it.el.style.filter = p >= .78 ? 'drop-shadow(0 0 10px #ffd76a) brightness(1.4)' : '';
        if (p > 1.08) resolve(it, false, 'That one fizzled out.');
      } else if (th === 'grill') {
        it.el.style.left = it.x + 'px'; it.el.style.top = it.y + 'px';
        const pt = it.el.querySelector('.pt'); if (pt) pt.setAttribute('fill', p < .55 ? '#c97a7a' : p <= .8 ? '#b0703a' : '#3a2a1a');
        if (p > 1.05) resolve(it, false, 'Burnt. Uncle June sighs.');
      } else {
        it.el.style.left = it.x + Math.sin(it.t * 2) * 20 + 'px'; it.el.style.top = (-20 + (H + 20) * p) + 'px';
        if (p > 1) resolve(it, false, 'It touched the ground.');
      }
    }
    Game.raf = requestAnimationFrame(frame);
  };
  Game.raf = requestAnimationFrame(frame);
  spawn(); Game.timer = setInterval(spawn, th === 'grill' ? 1100 : 1000);
}

function lessonClock(card, l, st, done) {
  let tries = 0, best = 0, t0 = 0, running = false;
  card.innerHTML = head(l, st, 'Press the button exactly at midnight. The numbers fade at 3, so you have to count the last seconds yourself.') +
    `<div class="clockface"><div class="digits" id="ck">10</div><button class="btn gold big" id="ck-go">Start the countdown</button><p id="ck-msg">Three tries. Your best one counts.</p></div>`;
  const ck = $('#ck'), btn = $('#ck-go');
  const tick = () => { const left = 10 - (performance.now() - t0) / 1000; ck.textContent = left > 3 ? Math.ceil(left) : left > 0 ? '·' : '·'; ck.style.opacity = left > 3 ? 1 : .25; if (left < -2 && running) press(); else if (running) Game.raf = requestAnimationFrame(tick); };
  const press = () => {
    running = false; cancelAnimationFrame(Game.raf); tries++;
    const err = Math.abs(10 - (performance.now() - t0) / 1000), sc = err < .1 ? 100 : err < .25 ? 88 : err < .5 ? 70 : err < 1 ? 50 : 30;
    best = Math.max(best, sc); ck.style.opacity = 1; ck.textContent = err < .1 ? 'Midnight' : `${err.toFixed(2)}s off`; ck.style.fontSize = '64px';
    Snd.sfx(sc >= 70 ? 'boom' : 'bad');
    $('#ck-msg').textContent = sc >= 88 ? 'Happy New Year. The whole court cheers.' : sc >= 70 ? 'Close. The Decembers cheer anyway.' : 'The Seconds raced past you. They do that.';
    btn.textContent = tries < 3 ? 'Try again' : 'Finish';
  };
  btn.onclick = () => {
    if (running) return press();
    if (tries >= 3) return done(best);
    t0 = performance.now(); running = true; ck.style.fontSize = ''; btn.textContent = 'Midnight. Now.'; Game.raf = requestAnimationFrame(tick);
  };
}

function lessonReflect(card, l, st, done) {
  const did = l.actions.map(() => false);
  const draw = () => {
    card.innerHTML = head(l, st, 'Take your time. There is no score here.') + `<div class="reflect">${l.actions.map(([a, r], i) => `<div class="row"><div class="grow"><b>${esc(a)}</b>${did[i] && r ? `<small>${esc(r)}</small>` : did[i] ? '<small>You stood quietly with everyone else.</small>' : ''}</div><button class="btn sm ${did[i] ? 'ghost' : 'primary'}" data-a="${i}" ${did[i] ? 'disabled' : ''}>${did[i] ? 'Done' : 'Do this'}</button></div>`).join('')}
      ${l.ask ? `<label><b>${esc(l.ask)}</b> <small style="color:var(--ink-2)">(optional, kept in your passport)</small></label><textarea id="rf-note" maxlength="300"></textarea>` : ''}
      <div class="row-btns"><button class="btn gold" id="rf-done" ${did.every(Boolean) ? '' : 'disabled'}>Receive the stamp</button></div></div>`;
    card.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const i = +b.dataset.a;
      if (!l.actions[i][1]) { hush(() => { did[i] = true; draw(); }); return; }
      did[i] = true; Snd.tone(523, 0, 1.2, 'sine', .06); draw();
    });
    const note = $('#rf-note'); if (note && draw.note) note.value = draw.note; if (note) note.oninput = () => draw.note = note.value;
    $('#rf-done').onclick = () => { if (draw.note && draw.note.trim()) S.notes.push({ st: st.id, text: draw.note.trim().slice(0, 300), y: S.y }); done(100); };
  };
  draw();
}
function hush(cb) {
  const h = document.createElement('div'); h.className = 'hush'; let n = 8;
  h.innerHTML = `<div>A moment of silence</div><small id="hs">${n}</small>`; stage.appendChild(h);
  const iv = setInterval(() => { n--; const el = h.querySelector('#hs'); if (el) el.textContent = n || ''; if (n <= 0) { clearInterval(iv); h.style.transition = 'opacity 1s'; h.style.opacity = 0; setTimeout(() => { h.remove(); cb(); }, 1000); } }, 1000);
}

function finishLesson(st, i, score) {
  clearInterval(Game.timer); cancelAnimationFrame(Game.raf);
  const l = st.lessons[i], key = st.id + ':' + i, stars = score >= 85 ? 3 : score >= 60 ? 2 : 1, first = !S.skills[key];
  const gold = inSeason(st), had = S.stamps[st.id];
  S.skills[key] = true; S.best[key] = Math.max(S.best[key] || 0, stars);
  const lessonUps = st.world ? [] : addFriend(st.m, 1);
  const newStamp = !had || (gold && !had.gold);
  S.stamps[st.id] = { gold: gold || !!(had && had.gold) };
  if (l.item) S.bag.push({ name: l.item, stars, price: l.price, st: st.id });
  let used = '';
  if (S.hourFree) { S.hourFree--; used = 'The Hour kept time still for you.'; } else { S.slot = Math.min(3, S.slot + 1); }
  if (newStamp) Snd.sfx('stamp'); else Snd.sfx('good');
  const reflect = l.type === 'reflect';
  modal(`<p class="kicker">${esc(st.name)}</p><h2>${reflect ? 'Thank you for taking part' : stars === 3 ? 'Beautifully done' : stars === 2 ? 'Nicely done' : 'You got through it'}</h2>
    ${reflect ? `<p>${st.id === 'valor' ? 'The Veterans Hall thanks you. Somewhere, a veteran will read your words.' : 'You carry a little of this day with you now.'}</p>` : `<p><span class="stars" style="font-size:22px">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span></p>`}
    ${l.item ? `<p>You made: <b>${esc(l.item)}</b>. It's in your bag, ready for the Market Stalls.</p>` : ''}
    ${first && !reflect ? `<p><b>You can teach this now.</b> Every day, visitors pay to learn ${esc(l.name)} from you, and part of it goes to the village fund. You earn more when ${esc(st.holiday)} is near.</p>` : ''}
    ${newStamp ? `<p><b>Passport stamped${S.stamps[st.id].gold ? ' with a gold seal' : ''}.</b> ${stampCount()} of ${totalStamps()}.</p>` : ''}
    ${used ? `<p>${used}</p>` : ''}`, [{ label: 'Back to the street', primary: true }]).then(() => showUps(lessonUps)).then(() => { openStreet(st.id); checkComplete(); });
}
function checkComplete() {
  if (stampCount() >= ALL_STREETS.length && !S.found.allStamps) { S.found.allStamps = true; modal(`<p class="kicker">The full set</p><h2>Every stamp in Merrywheel</h2><p>All twelve families and the Lantern Quarter have stamped your passport. Grandpa January and Papa December, for once, agree on something: you belong here.</p>`); }
}

/* ---------- plaza ---------- */
const TREATS = ['hot cocoa', 'candy hearts', 'shamrock cookie', 'lemon cake', 'churro', 'peach cobbler', 'snow cone', 'honey bun', 'caramel apple', 'pumpkin bread', 'slice of pecan pie', 'gingerbread'];
function plaza(id) {
  if (id === 'bell') return ringBell();
  if (id === 'archive') return archive();
  if (id === 'council') return council();
  if (id === 'market') return market();
  if (id === 'food') return food();
  if (id === 'inn') return inn();
  if (id === 'lantern') return lantern();
}
function lantern() {
  if (!lanternOpen()) return modal(`<p class="kicker">Across the little bridge</p><h2>The Lantern Quarter</h2><p>A quarter for the world's festivals of light and family: Diwali, Lunar New Year, Eid al-Fitr, Hanukkah, and Kwanzaa. The neighbors are ready, and the lanterns are hung, but the bridge needs fixing.</p><p>The Village Council can open it once the fund reaches <b>220</b>. The fund is at <b>${S.fund}</b>.</p>`);
  modal(`<p class="kicker">Festivals of light and family</p><h2>The Lantern Quarter</h2><ul class="list">${LANTERN.map(s => `<li class="row"><div class="grow"><b>${esc(s.name)}</b><small>${esc(s.holiday)} · ${fmtDate(doyOf(s.m, s.d))} this year${S.stamps[s.id] ? ' · Stamped' : ''}</small></div><button class="btn sm primary" data-go="${s.id}">Visit</button></li>`).join('')}</ul><p style="font-size:13px;color:var(--ink-2)">These holidays follow lunar or religious calendars, so their dates move each year. Merrywheel uses this year's dates.</p>`);
  $$('[data-go]').forEach(b => b.onclick = () => { closeModal(); openStreet(b.dataset.go); });
}
function ringBell() {
  if (S.bellDay === absDay()) return modal(`<h2>The Mystery Bell</h2><p>The bell is still humming from this morning. It rings once a day. Come back tomorrow.</p>`);
  S.bellDay = absDay(); Snd.sfx('bell');
  const m = dateOf(S.doy).m;
  const opts = [
    () => { S.kidArgDone = -1; S.kidArgDay = -1; todaysKidArg(); setTimeout(kidArgSpot, 50); return ['The kids are squabbling', 'The bell wakes up a nap-time argument among time\'s children. Look for the little ones shouting on the map.']; },
    () => { S.argDone = -1; S.argDay = -1; todaysArgument(); setTimeout(argSpot, 50); return ['An argument breaks out', `The bell clangs, and ${pick(FAMILIES).host} shouts, "See? Even the bell agrees with me." Somebody else disagrees, loudly. Look for the new argument on the map.`]; },
    () => { S.coins += 15; return ['A shower of coins', 'Coins tumble out of the bell tower like it had been saving them. You catch fifteen.']; },
    () => { for (let i = 0; i < 30; i++) setTimeout(spawnSecond, i * 60); return ['A parade of Seconds', 'Hundreds of tiny Seconds race across the village at once, giggling. You don\'t catch a single one. Nobody ever does.']; },
    () => m === 9 ? (S.fund += 20, ['The Octobers', 'Count October bows from the bell tower and donates 20 to the fund. Dramatically.']) : ['A costume, out of season', `Count October strolls by dressed as a giant carrot. It is ${MONTHS[m]}. Nobody asks.`],
    () => { S.weather = 'rain'; setTimeout(() => { S.weather = 'clear'; }, 9000); return ['Cousin April strikes', 'A sudden rain shower, out of nowhere. Then sunshine. Somewhere, an April is laughing.']; },
    () => { S.hourFree += 1; return ['A lost Hour', 'A sleepy Hour wandered away from its family and found you. It will sit with you for your next lesson, so that one won\'t use up any time.']; },
    () => ['A bonus Februarys child', 'Twenty-Nine, the Februarys\' leap-year baby, waves at you from a tiny throne someone keeps carrying for him. "You may approach," he says.'],
    () => { S.fund += 30; return ['A visiting family', `${pick(FAMILIES).name} drop by with a gift for the village fund: 30.`]; },
    () => { S.snow = 90; $('#snow').value = 90; S.snowUser = true; return ['A snow flurry', 'Snow pours out of a perfectly blue sky. Use the Snow slider to turn it back down.']; },
    () => { S.treats.push(pick(TREATS)); return ['A treat', `A Minute runs up, hands you a ${S.treats[S.treats.length - 1]}, and is gone before you can say thank you.`]; },
    () => { for (let i = 0; i < 6; i++) setTimeout(() => Snd.sfx('boom'), i * 350); return ['The Julys couldn\'t wait', 'Fireworks go off over the village in broad daylight. Big Jim July yells "TEST." It was not a test.']; },
  ];
  const [t, b] = pick(opts)();
  updateHUD(); drawBase();
  modal(`<p class="kicker">The Mystery Bell</p><h2>${t}</h2><p>${b}</p>`);
}
function archive() {
  modal(`<p class="kicker">The Celebration Archive</p><h2>Even more days worth honoring</h2><p>The Septembers keep this archive in perfect order: observances that don't have a street of their own yet.</p>
    <div class="arch">${ARCHIVE.map(([d, n, t]) => `<div class="row"><div class="grow"><span class="d">${esc(d)}</span><b style="display:block">${esc(n)}</b><small>${esc(t)}</small></div></div>`).join('')}</div>`, [{ label: 'Close' }], true);
}
function council() {
  const U = S.upgrades;
  modal(`<p class="kicker">The Village Council</p><h2>The village fund: ${S.fund}</h2><p style="font-size:14px"><b>Village harmony:</b> ${harmonyStars()} <small style="color:var(--ink-2)">Settle the months' arguments kindly to raise it.</small></p><p>Every coin visitors spend and every lesson you teach adds to the fund. Spend it to make Merrywheel more beautiful. You'll see each change on the map.</p>
    <ul class="list">${UPGRADES.map(u => `<li class="row"><div class="grow"><b>${u.name}</b><small>${u.desc}</small></div>${U[u.id] ? '<span class="badge on" style="--c:#2f7a55">Built</span>' : `<button class="btn sm ${S.fund >= u.cost ? 'gold' : 'ghost'}" data-u="${u.id}" ${S.fund >= u.cost ? '' : 'disabled'}>${u.cost}</button>`}</li>`).join('')}</ul>`, [{ label: 'Close' }], true);
  $$('[data-u]').forEach(b => b.onclick = () => {
    const u = UPGRADES.find(x => x.id === b.dataset.u); if (S.fund < u.cost) return;
    S.fund -= u.cost; U[u.id] = true; Snd.sfx('stamp'); closeModal(); go('map');
    toast(u.id === 'lantern' ? 'The bridge is fixed. The Lantern Quarter is open.' : `${u.name}: built. Merrywheel glows a little brighter.`, 3500);
  });
}
const sellPrice = it => { const st = streetById(it.st); return Math.round(it.price * (.7 + .15 * it.stars) * (st && inSeason(st) ? 1.5 : 1)); };
function market() {
  const draw = () => {
    modal(`<p class="kicker">The Market Stalls</p><h2>Sell what you've made</h2><p>Crafts sell for half again as much when their holiday is near. One coin in ten goes to the village fund.</p>
      ${S.bag.length ? `<ul class="list">${S.bag.map((it, i) => `<li class="row"><div class="grow"><b>${esc(it.name)}</b><small><span class="stars">${'★'.repeat(it.stars)}</span>${inSeason(streetById(it.st)) ? ' · In season' : ''}</small></div><button class="btn sm gold" data-s="${i}">Sell ${sellPrice(it)}</button></li>`).join('')}</ul>` : '<p><b>Your bag is empty.</b> Visit a street and learn a craft.</p>'}`, [{ label: 'Done', primary: true }]);
    $$('[data-s]').forEach(b => b.onclick = () => { const it = S.bag.splice(+b.dataset.s, 1)[0], p = sellPrice(it); S.coins += p; S.fund += Math.max(1, Math.round(p / 10)); Snd.sfx('coin'); updateHUD(); draw(); });
  };
  draw();
}
function food() {
  const m = dateOf(S.doy).m, t = TREATS[m];
  modal(`<p class="kicker">The Food Stalls</p><h2>Today's special: ${t}</h2><p>Every treat you buy goes straight into the village fund. Treats are also perfect for sharing with a tired Hour.</p><p>You have ${S.treats.length ? S.treats.map(esc).join(', ') : 'no treats'}.</p>`,
    [{ label: `Buy a ${t} (4 coins)`, gold: true, value: 'buy', disabled: S.coins < 4 }, { label: 'Close' }]).then(v => {
      if (v === 'buy') { S.coins -= 4; S.fund += 4; S.treats.push(t); Snd.sfx('coin'); updateHUD(); toast(`One ${t}. The stall keeper adds a wink for free.`); }
    });
}
function innOccupancy() { const up = upcoming(1)[0]; const n = up ? up[1] : 30; return clamp(Math.round(40 + Object.keys(S.upgrades).length * 6 + (n <= 3 ? 40 : n <= 10 ? 20 : 0)), 10, 100); }
function inn() {
  const up = upcoming(2), next = up.find(([s, n]) => n > 0) || up[0];
  modal(`<p class="kicker">The Inn at the Hub</p><h2>${innOccupancy()}% full tonight</h2><p>There's always a next celebration, so the rooms are never empty for long.</p>
    <ul class="list"><li class="row"><div class="grow"><b>Sleep until morning</b><small>A new day. The bell resets, and your students pay for their lessons.</small></div><button class="btn sm primary" data-n="1">Sleep</button></li>
    <li class="row"><div class="grow"><b>Ride the Calendar Coach</b><small>Skip ahead ${next[1]} day${next[1] > 1 ? 's' : ''} to ${esc(next[0].holiday)} on ${esc(next[0].name)}. You still earn from teaching while you're gone.</small></div><button class="btn sm gold" data-n="${next[1]}">Ride</button></li></ul>`, [{ label: 'Not yet' }]);
  $$('[data-n]').forEach(b => b.onclick = () => { closeModal(); nextDays(+b.dataset.n); });
}
function nextDays(n) {
  let visitors = 0, taught = 0, earned = 0, fund = 0;
  const before = S.y;
  for (let k = 0; k < n; k++) {
    S.doy++; if (S.doy >= 365) { S.doy = 0; S.y++; }
    const live = openStreets().some(isLive);
    const v = 25 + Object.keys(S.upgrades).length * 8 + stampCount() * 2 + (live ? 60 : 0); visitors += v; fund += Math.round(v * .4);
    for (const m in S.sulk) if (S.sulk[m] > 0) S.sulk[m]--;
    for (const key in S.skills) {
      const [id, i] = key.split(':'), st = streetById(id); if (!st || st.lessons[+i].type === 'reflect') continue;
      const students = 1 + (inSeason(st) ? 3 : 0) + (Math.random() < .3 ? 1 : 0); taught += students; earned += ((!st.world && S.sulk[st.m] > 0) ? Math.ceil(students * 1.5) : students * 3) * ((!st.world && heartsOf(st.m) >= 5) ? 2 : 1); fund += students;
    }
  }
  const mail = [];
  for (let m = 0; m < 12; m++) if (heartsOf(m) >= 3 && mail.length < 3 && Math.random() < Math.min(.9, .25 * n)) {
    if (Math.random() < .5) { S.coins += 10; mail.push(`${FAMILIES[m].name} sent you 10 coins tucked in a card.`); }
    else { S.treats.push(TREATS[m]); mail.push(`${FAMILIES[m].name} sent you a ${TREATS[m]}.`); }
  }
  S.coins += earned; S.fund += fund; S.slot = 0; autoWeather();
  const m = dateOf(S.doy).m;
  go('map');
  const live = openStreets().filter(isLive);
  modal(`<p class="kicker">${n > 1 ? `The Calendar Coach rolls in · ${n} days later` : 'Good morning, Merrywheel'}</p><h2>${fmtDate(S.doy)}</h2>
    ${S.y > before ? `<p><b>Happy New Year. Year ${S.y} begins.</b> The Januarys are already marching.</p>` : ''}
    <ul class="list"><li class="row"><div class="grow"><b>${visitors.toLocaleString()} visitors</b><small>The inns were ${innOccupancy()}% full.</small></div></li>
    <li class="row"><div class="grow"><b>${taught} lesson${taught === 1 ? '' : 's'} taught</b><small>${taught ? `Your students paid you ${earned} coins.` : 'Learn a craft on any street, and visitors will pay you to teach it.'}</small></div></li>
    <li class="row"><div class="grow"><b>Village fund +${fund}</b><small>Now ${S.fund}. Spend it at the Village Council.</small></div></li>
    ${mail.length ? `<li class="row"><div class="grow"><b>Morning mail</b>${mail.map(t => `<small>${esc(t)}</small>`).join('')}</div></li>` : ''}</ul>
    ${live.length ? `<p><b>Celebrating now:</b> ${live.map(s => esc(s.holiday) + ' on ' + esc(s.name)).join(', ')}.</p>` : ''}
    <p style="color:var(--ink-2)">${esc(FAMILIES[m].name)} are hosting this month. ${esc(FAMILIES[m].traits)}</p>`);
}

/* ---------- passport & bag ---------- */
function friendsList() {
  modal(`<p class="kicker">${esc(S.name)}'s friends</p><h2>The twelve families</h2><p style="font-size:14px;color:var(--ink-2)">Chat with each family's host once a day, give gifts, take their lessons, and settle their arguments to earn hearts. At 2 and 4 hearts you share a moment, at 3 you get a keepsake and morning mail, and at 5 you're family.</p>
    <div class="arch">${FAMILIES.map((f, m) => `<div class="row"><div class="grow"><b>${esc(f.name)}</b> ${heartStr(m)}<small>${esc(f.host)} · ${S.sulk[m] > 0 ? 'Sulking about an argument' : heartsOf(m) >= 5 ? 'Family' : heartsOf(m) >= 3 ? 'Close friends' : heartsOf(m) >= 1 ? 'Friendly' : 'Just met'} · loves ${esc(TREATS[m])}</small></div></div>`).join('')}</div>`, [{ label: 'Close' }], true);
}
$('#btn-passport').onclick = () => {
  const list = openStreets();
  modal(`<p class="kicker">${esc(S.name)}'s passport</p><h2>${stampCount()} of ${list.length} stamps</h2><p>A stamp for every street. Earn a gold seal by visiting while the celebration is near.</p>
    <div class="stamps">${list.map(s => { const st = S.stamps[s.id]; return `<div class="stamp ${st ? 'on' : ''} ${st && st.gold ? 'gold' : ''}" style="--c:${shade(stColor(s), -20)}" title="${esc(s.holiday)}">${esc(s.name)}</div>`; }).join('')}</div>
    ${!lanternOpen() ? '<p style="font-size:13px;color:var(--ink-2)">Five more stamps wait in the Lantern Quarter, once the Village Council opens it.</p>' : ''}
    ${S.notes.length ? `<h3>Your words</h3>${S.notes.map(n => `<p style="font-size:14px">"${esc(n.text)}" <small style="color:var(--ink-2)">(${esc(streetById(n.st).name)})</small></p>`).join('')}` : ''}`, [{ label: 'Close' }], true);
};
$('#btn-friends').onclick = () => friendsList();
$('#btn-bag').onclick = () => modal(`<h2>Your bag</h2>${S.bag.length ? `<ul class="list">${S.bag.map(it => `<li class="row"><div class="grow"><b>${esc(it.name)}</b><small><span class="stars">${'★'.repeat(it.stars)}</span></small></div></li>`).join('')}</ul>` : '<p>Nothing yet. Crafts you make go here.</p>'}<p><b>Treats:</b> ${S.treats.length ? S.treats.map(esc).join(', ') : 'none'}</p>${S.keeps.length ? `<h3>Keepsakes</h3><ul class="list">${S.keeps.map(k => { const [m, i] = k.split(':').map(Number), [n, d] = KEEPSAKES[m][i]; return `<li class="row"><div class="grow"><b>${esc(n)}</b><small>${esc(d)} · from ${esc(FAMILIES[m].name)}</small></div></li>`; }).join('')}</ul>` : ''}<p><b>Crafts you teach:</b> ${Object.keys(S.skills).filter(k => { const [id, i] = k.split(':'); return streetById(id).lessons[+i].type !== 'reflect'; }).map(k => { const [id, i] = k.split(':'); return esc(streetById(id).lessons[+i].name); }).join(', ') || 'none yet'}</p>`);
$('#btn-sound').onclick = () => { Snd.on = !Snd.on; $('#btn-sound').classList.toggle('off', !Snd.on); };

/* ---------- the August Jubilee ---------- */
function jubilee(real) {
  const banners = FAMILIES.map((f, i) => `<div class="banner" style="left:${4 + i * 7.8}%;background:${f.color}"></div>`).join('');
  const acts = [
    ['The families arrive', 'All twelve families file into the Grand Pavilion. The Januarys are early. The Julys are loud. The Februarys bring a tiny throne for Twenty-Nine. For one night, nobody argues about who is most important. (The Julys argue a little.)', () => FAMILIES.map((f, i) => `<div class="jub-actor" style="left:${3 + i * 8}%;animation:bob ${1 + i % 3 * .3}s ease-in-out infinite">${personSVG({ w: 46, color: f.color, ...HOST_LOOK[i] })}</div>`).join('')],
    ['Act one: The Seconds', 'Hundreds of Seconds dash across the stage. The audience tries to count them. Nobody can. They take a bow, but they\'re gone before the applause lands.', () => Array.from({ length: 40 }, (_, i) => `<div class="jub-actor" style="bottom:${20 + (i % 6) * 30}px;animation:dash ${1 + Math.random()}s linear ${Math.random() * 2}s infinite both">${kidSVG('sec', 22)}</div>`).join('')],
    ['Act two: The Minutes', 'Sixty Minutes sing a round. Each one sings for exactly one minute, then hands the song to the next. It is surprisingly beautiful.', () => Array.from({ length: 10 }, (_, i) => `<div class="jub-actor" style="left:${6 + i * 9}%;animation:sway 1.6s ease-in-out ${i * .16}s infinite">${kidSVG('min', 34)}</div>`).join('')],
    ['Act three: The Hours', 'The Hours slow-dance under the lanterns. Time itself seems to stretch. Lady August wipes a tear.', () => Array.from({ length: 6 }, (_, i) => `<div class="jub-actor" style="left:${10 + i * 14}%;animation:sway 4s ease-in-out ${i * .5}s infinite">${kidSVG('hour', 44)}</div>`).join('')],
    ['Act four: The Days', 'Each Day takes the spotlight. Monday grumbles through his line. Friday turns it into a dance party. Sunday falls asleep on stage, and everyone agrees that\'s the best part.', () => DAYS.map((d, i) => `<div class="jub-actor" style="left:${6 + i * 13}%;${i === 0 ? 'transform:rotate(80deg);bottom:10px' : i === 5 ? 'animation:bob .4s ease-in-out infinite' : ''}">${kidSVG('day', 40)}<div style="color:#fff;font-size:11px;font-weight:800;text-align:center">${d[0]}</div></div>`).join('')],
    ['Finale: The Weeks', 'All fifty-two Weeks march out in perfect formation, holding up the schedule for next year. Then the Julys set off the fireworks, a little early, and every family cheers together.', () => Array.from({ length: 13 }, (_, i) => `<div class="jub-actor" style="left:${2 + i * 7.5}%">${kidSVG('week', 30)}</div>`).join('') + Array.from({ length: 6 }, (_, i) => `<div style="position:absolute;left:${10 + i * 15}%;top:${20 + (i % 2) * 40}px;width:90px;height:90px;border-radius:50%;border:3px dotted ${pick(['#ffd76a', '#ff8a8a', '#8ad0ff'])};animation:burst 1.4s ease-out ${i * .3}s infinite"></div>`).join('')],
  ];
  let i = 0;
  const show = () => {
    const [t, b, f] = acts[i];
    if (i === acts.length - 1) for (let k = 0; k < 6; k++) setTimeout(() => Snd.sfx('boom'), k * 400); else Snd.sfx('bell');
    modal(`<p class="kicker">${real ? 'The August Jubilee' : 'Jubilee rehearsal'}</p><h2>${t}</h2><div class="jub-stage">${banners}${f()}</div><p>${b}</p>`,
      [{ label: i < acts.length - 1 ? 'Next act' : 'Applaud', primary: true, value: 'n' }, { label: 'Leave' }], true).then(v => {
        if (v !== 'n') return;
        i++; if (i < acts.length) return show();
        if (real && !S.jubilee[S.y]) { const bonus = 100 + (S.harmony || 0) * 10; S.jubilee[S.y] = true; S.fund += bonus; S.stamps.pavilion = { gold: true }; updateHUD(); modal(`<h2>The best night of the year</h2><p>${(S.harmony || 0) >= 10 ? 'Thanks to you, the families have barely argued all year. Grandpa January and Papa December share a bench. Big Jim July whispers. Everybody cries a little.' : 'The families mostly behave themselves. Mostly.'}</p><p>They give the village fund <b>${bonus}</b> to celebrate (100, plus 10 for every point of village harmony), and your passport gets the Jubilee's gold seal.</p>`).then(() => openStreet('pavilion')); }
        else if (!real) toast('The real Jubilee is August 20. The Calendar Coach can take you there.');
      });
  };
  show();
}

/* ---------- save ---------- */
const API = 'port/8001';
const SAVE_KEYS = ['name', 'y', 'doy', 'slot', 'coins', 'fund', 'stamps', 'skills', 'bag', 'treats', 'upgrades', 'bellDay', 'hourFree', 'hourDay', 'secTries', 'jubilee', 'best', 'snow', 'snowUser', 'notes', 'found', 'favor', 'sulk', 'sulkBy', 'smug', 'harmony', 'argDay', 'argId', 'argDone', 'kidArgDay', 'kidArgId', 'kidArgDone', 'trust', 'pout', 'fr', 'talked', 'gave', 'keeps'];
const Save = {
  base: API.startsWith('__PORT') ? 'http://localhost:8001' : API, last: '', busy: false,
  headers() { const h = { 'Content-Type': 'application/json' }; if (this.base.includes('localhost')) h['X-Save-Id'] = 'local-test'; return h; },
  snapshot() { const o = { v: 1 }; for (const k of SAVE_KEYS) o[k] = S[k]; return o; },
  async load() { try { const r = await fetch(this.base + '/api/save', { headers: this.headers() }); if (!r.ok) throw 0; return (await r.json()).save; } catch (e) { return null; } },
  async push(force) {
    if (S.scene === 'title' || this.busy) return;
    const snap = this.snapshot(), key = JSON.stringify(snap); if (!force && key === this.last) return;
    this.busy = true;
    try { const r = await fetch(this.base + '/api/save', { method: 'POST', headers: this.headers(), body: key, keepalive: true }); if (!r.ok) throw 0; this.last = key; ind('Saved'); }
    catch (e) { ind('Not saving right now', true); }
    this.busy = false;
  },
  async wipe() { try { await fetch(this.base + '/api/save', { method: 'DELETE', headers: this.headers() }); } catch (e) { } this.last = ''; },
  apply(d) {
    for (const k of SAVE_KEYS) if (d[k] !== undefined) S[k] = d[k];
    for (const k of ['y', 'doy', 'slot', 'coins', 'fund', 'bellDay', 'hourFree', 'hourDay', 'secTries', 'snow', 'harmony', 'argDay', 'argDone', 'kidArgDay', 'kidArgDone', 'trust']) S[k] = Math.round(Number(S[k]) || 0);
    S.y = Math.max(1, S.y); S.doy = clamp(S.doy, 0, 364); S.slot = clamp(S.slot, 0, 3); S.snow = clamp(S.snow, 0, 100);
    S.name = String(S.name || 'Friend').slice(0, 18);
    for (const k of ['stamps', 'skills', 'upgrades', 'jubilee', 'best', 'found', 'favor', 'sulk', 'sulkBy', 'smug', 'pout', 'fr', 'talked', 'gave']) if (!S[k] || typeof S[k] !== 'object' || Array.isArray(S[k])) S[k] = {};
    for (const k of ['bag', 'treats', 'notes']) if (!Array.isArray(S[k])) S[k] = [];
    S.bag = S.bag.filter(it => it && streetById(it.st)).map(it => ({ name: String(it.name), stars: clamp(Math.round(+it.stars || 1), 1, 3), price: Math.round(+it.price || 0), st: it.st }));
    S.treats = S.treats.map(String); S.notes = S.notes.filter(n => n && streetById(n.st)).map(n => ({ st: n.st, text: String(n.text).slice(0, 300), y: +n.y || 1 }));
    for (const k of Object.keys(S.stamps)) if (!streetById(k)) delete S.stamps[k];
    for (const o of [S.favor, S.sulk, S.smug]) for (const k of Object.keys(o)) { if (!(k in FAMILIES)) delete o[k]; else o[k] = Math.round(+o[k] || 0); }
    for (const k of Object.keys(S.sulkBy)) S.sulkBy[k] = clamp(Math.round(+S.sulkBy[k] || 0), 0, 11);
    if (!ARGUMENTS.some(a => a.id === S.argId)) S.argId = null;
    if (!KID_ARGS.some(a => a.id === S.kidArgId)) S.kidArgId = null;
    for (const o of [S.fr, S.talked, S.gave]) for (const k of Object.keys(o)) { if (!(k in FAMILIES)) delete o[k]; else o[k] = Math.round(+o[k] || 0); }
    if (!Array.isArray(S.keeps)) S.keeps = []; S.keeps = S.keeps.filter(k => /^\d+:[01]$/.test(k) && +k.split(':')[0] < 12);
    for (const k of Object.keys(S.pout)) { if (!DAYS.some(d => d[0] === k)) delete S.pout[k]; else S.pout[k] = Math.round(+S.pout[k] || 0); }
  },
};
let indT; function ind(t, bad) { const el = $('#save-ind'); el.textContent = t; el.classList.toggle('bad', !!bad); el.classList.add('show'); clearTimeout(indT); if (!bad) indT = setTimeout(() => el.classList.remove('show'), 1500); }
setInterval(() => Save.push(), 4000);
addEventListener('pagehide', () => Save.push());
document.addEventListener('visibilitychange', () => { if (document.hidden) Save.push(); });

/* ---------- title ---------- */
(function titleBg() { const tc = $('#title-canvas'); S.slot = 2; drawBase(tc); S.slot = 0; const c = tc.getContext('2d'); c.fillStyle = 'rgba(15,20,45,.35)'; c.fillRect(0, 0, 1200, 800); })();
function enter() {
  Snd.init(); Snd.ctx && Snd.ctx.resume(); Snd.sfx('bell');
  $('#hud').hidden = false; $('#snow').value = S.snow; go('map');
}
$('#btn-start').onclick = async () => {
  const n = $('#player-name').value.trim(); if (!n) { $('#player-name').focus(); toast('Tell the families your name first.'); return; }
  S.name = n; S.doy = doyOf(11, 20); autoWeather(); enter();
  await modal(`<p class="kicker">Welcome to Merrywheel</p><h2>Hello, ${esc(n)}</h2>
    <p>Merrywheel is laid out like a calendar. Twelve families live around the wheel, one for each month, and every family keeps its own holiday streets. Click any neighborhood to meet its family.</p>
    <p><b>The village never has an off-season.</b> When one celebration winds down, the next one is already lighting up.</p>
    <p><b>How it works:</b> visit a street and learn its craft. Once you know it, visitors pay you to teach it. Sell what you make at the Market Stalls. Your coins and theirs grow the <b>village fund</b>, and the Village Council spends it to make the plaza more beautiful.</p>
    <p><b>Collect every passport stamp.</b> Visit while a holiday is near to earn its gold seal.</p>
    <p>The month families love arguing about who is most important. When you spot an argument on the map, step in and settle it. Take a side, or find the answer that makes peace. Time's children squabble too, and the Hours notice who is kind to the little ones.</p>
    <p>Make friends with the families: chat with their hosts, bring gifts, and they'll share moments, keepsakes, and morning mail with you.</p>
    <p>Watch for time's children around the village. You can never hold onto a Second. But the Hours will sit with you a while, if you're kind to them.</p>
    <p>It's a few days before Christmas, and Papa December is warming up Twinkle Lane. Look for the glowing signs: those streets are celebrating now.</p>`, [{ label: 'Start exploring', primary: true }]);
  Save.push(true);
};
$('#player-name').addEventListener('keydown', e => { if (e.key === 'Enter') $('#btn-start').click(); });
(async () => {
  const d = await Save.load(); if (!d || !d.name) return;
  $('#name-box').hidden = true; $('#btn-start').hidden = true; $('#continue-box').hidden = false;
  $('#continue-info').innerHTML = `Welcome back, <b>${esc(d.name)}</b>.<br>${fmtDate(clamp(Math.round(+d.doy || 0), 0, 364))}, Year ${Math.round(+d.y || 1)} · ${Object.keys(d.stamps || {}).length} stamps · fund ${Math.round(+d.fund || 0)}`;
  $('#btn-continue').onclick = () => { Save.apply(d); autoWeather(); if (d.snowUser) S.snow = d.snow; enter(); toast(`Welcome back to Merrywheel, ${esc(S.name)}.`); };
  $('#btn-newgame').onclick = async () => {
    const v = await modal(`<h2>Start a brand-new game?</h2><p>This erases ${esc(d.name)}'s passport, coins, fund, and every upgrade. It can't be undone.</p>`, [{ label: 'Keep my game', primary: true }, { label: 'Erase and start over', value: 'wipe' }]);
    if (v !== 'wipe') return; await Save.wipe(); $('#continue-box').hidden = true; $('#name-box').hidden = false; $('#btn-start').hidden = false;
  };
})();

window.__S = S; window.__go = go; window.__next = nextDays;
})();
