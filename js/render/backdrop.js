/* 배경 레이어: 하늘, 먼 풍경 2겹, 건물 외벽, 실내 벽과 붙박이 가구, 천장.
   f = { sc 배경, p 팔레트, t 색조함수, s px/cm, g 지면y, v 화면상태, scroll 스크롤px } */
const PARALLAX = Object.freeze({ cloud: .02, far1: .05, far2: .12, fg: 1.6 });
const LIT = '#ffd88a', STORE_LIT = '#fff1cf';
const FAR_SHAPES = Object.freeze({ city: { cell: 95, minH: .45 }, apartments: { cell: 150, minH: .55 }, villas: { cell: 120, minH: .3 } });
const STARS = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random() * .7, r: .6 + Math.random() * 1.1, p: Math.random() * TAU }));
let W = 0, H = 0;
const mod = (a, m) => ((a % m) + m) % m;

function drawSky(f) {
  const { sc, p, g, v } = f;
  const gr = ctx.createLinearGradient(0, 0, 0, sc.indoor ? H : g);
  gr.addColorStop(0, p.skyTop); gr.addColorStop(1, p.skyBottom);
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  if (sc.indoor) return;
  if (v.night) {
    STARS.forEach((st) => { ctx.globalAlpha = .45 + .4 * Math.sin(v.t * 1.3 + st.p); E(st.x * W, st.y * g, st.r, st.r, '#fff6dc'); });
    ctx.globalAlpha = 1;
  }
  const r = Math.min(W, H) * .05;
  paper(() => E(W * .8, g * .28, r, r, p.sun), .6);
  for (let i = 0; i < 3; i++) {
    const k = 1 - i * .18, cy = g * (.14 + .1 * i);
    const cx = mod(i * W * .43 + 90 - f.scroll * PARALLAX.cloud - v.t * 4, W + 320) - 160;
    paper(() => { E(cx, cy, 70 * k, 20 * k, p.cloud); E(cx - 30 * k, cy - 10 * k, 34 * k, 22 * k, p.cloud); E(cx + 26 * k, cy - 14 * k, 30 * k, 20 * k, p.cloud); }, .5);
  }
}

function drawFar(f) {
  const { sc, p, g } = f;
  if (!sc.far) return;
  farLayer(f, f.scroll * PARALLAX.far1, g * .62, p.farA, 0);
  farLayer(f, f.scroll * PARALLAX.far2, g * .42, p.farB, 1);
}

const ridgeY = (f, X, maxH, li) => f.g - maxH * (.5 + .22 * Math.sin(X / (240 + li * 90) + li) + .1 * Math.sin(X / 83 + li * 3)) + wobble(X, li);

function farLayer(f, off, maxH, color, li) {
  const { sc, g, v } = f;
  paper(() => {
    ctx.fillStyle = color;
    if (sc.far === 'trees') { farTrees(f, off, maxH, color, li); return; }
    const cfg = FAR_SHAPES[sc.far];
    const i0 = Math.floor(off / cfg.cell) - 1, i1 = Math.floor((off + W) / cfg.cell) + 1;
    for (let i = i0; i <= i1; i++) {
      const x = i * cfg.cell - off, r = hash(i, li * 7 + 3);
      const bh = maxH * (cfg.minH + r * (1 - cfg.minH));
      const bw = cfg.cell * (sc.far === 'apartments' ? .7 : .62 + hash(i, li + 9) * .3);
      ctx.fillStyle = color; ctx.fillRect(x, g - bh, bw, bh);
      if (sc.far === 'city' && r > .5) ctx.fillRect(x + bw * .25, g - bh * 1.1, bw * .5, bh * .1 + 1);
      if (sc.far === 'villas') { E(x + bw * .72, g - bh - 5, 9, 6, mix(color, '#ffffff', .25)); ctx.fillStyle = color; }   // 옥상 물탱크
      if (sc.far === 'apartments' && li === 1) aptFace(x, g - bh, bw, bh, i, color, v.night);
    }
  }, li ? .8 : .5);
}

/** 가까운 아파트 동: 창 줄과 동 번호 */
function aptFace(x, top, bw, bh, i, color, night) {
  const win = mix(color, '#ffffff', .3);
  for (let y = top + 22; y < top + bh - 8; y += 11) {
    for (let c = 0; c < 3; c++) {
      if (night && hash(i * 97 + y, c) > .35) continue;
      R(x + bw * (.16 + c * .26), y, bw * .14, 4, night ? LIT : win);
    }
  }
  ctx.fillStyle = win; ctx.font = '11px "Galmuri11", monospace';
  ctx.fillText(String(101 + mod(i, 9)), x + bw * .32, top + 14);
}

function farTrees(f, off, maxH, color, li) {
  ctx.beginPath(); ctx.moveTo(0, f.g);
  for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, ridgeY(f, x + off, maxH * .55, li));
  ctx.lineTo(W, f.g); ctx.closePath(); ctx.fill();
  const cell = 70, i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
  for (let i = i0; i <= i1; i++) {
    if (hash(i, li + 40) > .6) continue;
    const x = i * cell - off + 20, rr = 22 + hash(i, li + 41) * 26;
    E(x, ridgeY(f, x + off, maxH * .55, li) - rr * .4, rr, rr, color);
  }
}

/* ── 바깥 건물 ── */
function drawFacades(f) {
  const { sc, p, s, g, v } = f;
  const w = sc.wall, seg = 1100;
  const i0 = Math.floor(v.camX / seg) - 1, i1 = Math.floor((v.camX + W / s) / seg) + 1;
  if (i1 - i0 > 120) return;
  for (let i = i0; i <= i1; i++) {
    const x = (i * seg - v.camX) * s, bw = seg * s * .985, hh = w.h * (.8 + hash(i, 21) * .4), top = g - hh * s;
    const face = hash(i, 22) < .5 ? p.wall : p.wallAlt;
    paper(() => R(x, top, bw, hh * s, face));
    R(x + bw * .9, top, bw * .1, hh * s, p.wallShade);
    R(x, top, bw, Math.max(2, 12 * s), p.wallShade);
    FACADES[w.style](f, x, top, bw, hh, i);
  }
}

const FACADES = {
  villa(f, x, top, bw, hh, i) {
    if (f.s > 1.2) bricks(f, x, top, bw * .9, i);
    windowGrid(f, x, bw * .9, hh, i, { from: 120, step: 280, w: 140, h: 110, gap: 320, bars: true });
  },
  concrete(f, x, top, bw, hh, i) {
    const { p, s, g } = f;
    paper(() => R(x + 120 * s, g - 210 * s, 95 * s, 210 * s, p.wallShade), .6);           // 뒷문
    E(x + 420 * s, g - 260 * s, 24 * s, 24 * s, shade(p.wall)); E(x + 420 * s, g - 260 * s, 17 * s, 17 * s, p.ink);   // 환기구
    R(x + 700 * s, top, 10 * s, g - top, shade(p.wall));                                     // 배관
    windowGrid(f, x, bw * .9, hh, i, { from: 330, step: 280, w: 100, h: 70, gap: 360 });
  },
  store(f, x, top, bw, hh, i) {
    const { p, s, g, v } = f;
    const glassW = bw * .8, mullion = 120 * s;
    paper(() => R(x + 40 * s, g - 250 * s, glassW, 240 * s, v.night ? STORE_LIT : p.glass), .6);
    for (let k = 1; k * mullion < glassW; k++) R(x + 40 * s + k * mullion, g - 250 * s, 4 * s, 240 * s, p.wallShade);
    paper(() => R(x, g - 300 * s, bw * .92, 30 * s, p.accent), .8);                         // 간판 띠
    windowGrid(f, x, bw * .9, hh, i, { from: 420, step: 300, w: 140, h: 120, gap: 320 });
  },
};

function windowGrid(f, x, w, hh, i, o) {
  const { p, s, g, v } = f;
  const cols = Math.floor((w / s - 80) / o.gap);
  for (let c = 0; c < cols; c++) {
    for (let fl = 0; o.from + fl * o.step + o.h < hh - 40; fl++) {
      const wx = x + (60 + c * o.gap) * s, wy = g - (o.from + fl * o.step + o.h) * s;
      if (wy > H || wy + o.h * s < 0 || wx > W || wx + o.w * s < 0) continue;
      const lit = v.night && hash(i * 31 + c * 7 + fl, 9) < .4;
      R(wx, wy, o.w * s, o.h * s, lit ? LIT : mix(p.wallShade, p.ink, .45));
      R(wx - 6 * s, wy + o.h * s, (o.w + 12) * s, 7 * s, p.light);                          // 창턱
      if (o.bars) for (let b = 1; b < 5; b++) R(wx + b * o.w * s / 5, wy, Math.max(1, 1.5 * s), o.h * s, p.wallShade);   // 방범창
    }
  }
}

/** 빨간 벽돌 몇 장만 다른 색 종이로 붙인다 (가까이 볼 때만) */
function bricks(f, x0, top, w, seed) {
  const { p, s, g } = f;
  const bw = 22 * s, bh = 7.5 * s;
  const rows = Math.min(Math.ceil((g - Math.max(top, 0)) / bh), 160);
  const c0 = Math.max(0, Math.floor(-x0 / bw) - 1), c1 = Math.min(Math.ceil(w / bw), c0 + Math.ceil(W / bw) + 2);
  ctx.fillStyle = p.wallShade;
  for (let r = 0; r < rows; r++) {
    const shift = (r % 2) * bw / 2;
    for (let c = c0; c < c1; c++) if (hash(c * 131 + r, seed) < .2) ctx.fillRect(x0 + c * bw + shift + 1, g - (r + 1) * bh + 1, bw - 2, bh - 2);
  }
}

/* ── 실내 ── */
function drawInterior(f) {
  const { sc, p, s, g } = f;
  const w = sc.wall;
  if (w.pattern === 'stripe') stripes(f);
  if (w.pattern === 'tile') tiles(f, 90, 150);
  if (w.pattern === 'steel') tiles(f, 0, sc.ceiling);
  if (w.window) livingWindows(f);
  R(0, g - 8 * s, W, 8 * s, p.wallShade);                                                   // 걸레받이
  if (w.run) RUNS[w.run](f);
}

function stripes(f) {
  const { p, s, g, v } = f;
  const step = 12;
  if (step * s < 3) return;
  const i0 = Math.floor(v.camX / step), i1 = i0 + Math.ceil(W / (step * s)) + 1;
  ctx.fillStyle = p.wallAlt;
  for (let i = i0; i <= i1; i++) if (mod(i, 2) === 0) ctx.fillRect((i * step - v.camX) * s, 0, step * s * .5, g);
}

function tiles(f, from, to) {
  const { p, s, g, v } = f;
  const size = 15, gap = 1;
  if (size * s < 4) return;
  const c0 = Math.floor(v.camX / size), c1 = c0 + Math.ceil(W / (size * s)) + 1;
  const r0 = Math.floor(from / size), r1 = Math.ceil(to / size);
  if ((c1 - c0) * (r1 - r0) > 4000) return;
  ctx.fillStyle = p.light;
  for (let r = r0; r < r1; r++) {
    const y = g - (r + 1) * size * s;
    if (y > H || y + size * s < 0) continue;
    for (let c = c0; c <= c1; c++) ctx.fillRect((c * size - v.camX) * s + gap * s / 2, y + gap * s / 2, (size - gap) * s, (size - gap) * s);
  }
}

function livingWindows(f) {
  const { p, s, g, v } = f;
  const seg = 700, ww = 200, bottom = 90, top = 230;
  const i0 = Math.floor(v.camX / seg) - 1, i1 = Math.floor((v.camX + W / s) / seg) + 1;
  if (i1 - i0 > 60) return;
  const curtain = mix(p.accent, p.light, .45);
  for (let i = i0; i <= i1; i++) {
    const x = (i * seg + 250 - v.camX) * s, y = g - top * s, w = ww * s, hgt = (top - bottom) * s;
    paper(() => R(x - 6 * s, y - 6 * s, w + 12 * s, hgt + 12 * s, p.light), .8);
    const gr = ctx.createLinearGradient(0, y, 0, y + hgt);
    gr.addColorStop(0, v.night ? NIGHT_SKY[0] : p.glass); gr.addColorStop(1, v.night ? NIGHT_SKY[1] : p.far1);
    ctx.fillStyle = gr; ctx.fillRect(x, y, w, hgt);
    for (let k = 0; k < 3; k++) { const bh = hgt * (.35 + hash(i * 3 + k, 8) * .4); R(x + w * (.08 + k * .32), y + hgt - bh, w * .22, bh, p.far2); }
    R(x + w / 2 - 2 * s, y, 4 * s, hgt, p.light);
    paper(() => { R(x - 20 * s, y - 10 * s, 28 * s, hgt + 30 * s, curtain); R(x + w - 8 * s, y - 10 * s, 28 * s, hgt + 30 * s, curtain); }, .6);
  }
}

/* 붙박이 가구: 장면 전체 길이로 이어진다 */
const RUNS = {
  counter(f) {
    const { p, s, g } = f;
    R(0, g - 10 * s, W, 10 * s, mix(p.ink, p.wall, .35));                // 걸레받이 틈 (바퀴가 숨는 곳)
    paper(() => R(0, g - 86 * s, W, 76 * s, p.accent));
    paper(() => R(0, g - 90 * s, W, 5 * s, p.light), .7);
    paper(() => R(0, g - 230 * s, W, 80 * s, p.accent), .9);
    doorLines(f, 60, g - 84 * s, 72 * s); doorLines(f, 60, g - 228 * s, 76 * s);
  },
  steelTable(f) {
    const { p, s, g, v } = f;
    const leg = 150;
    paper(() => R(0, g - 88 * s, W, 4 * s, p.accent), .8);
    paper(() => R(0, g - 28 * s, W, 3 * s, p.accent), .6);
    const i0 = Math.floor(v.camX / leg), i1 = i0 + Math.ceil(W / (leg * s)) + 1;
    if (i1 - i0 < 300) for (let i = i0; i <= i1; i++) R((i * leg - v.camX) * s, g - 88 * s, 4 * s, 88 * s, shade(p.accent));
    paper(() => R(0, g - 180 * s, W, 3 * s, p.accent), .6);
  },
  shoeCabinet(f) {
    const { p, s, g } = f;
    R(0, g - 10 * s, W, 10 * s, mix(p.ink, p.wall, .35));
    paper(() => R(0, g - 112 * s, W, 102 * s, p.accent));
    paper(() => R(0, g - 116 * s, W, 5 * s, p.light), .7);
    doorLines(f, 45, g - 110 * s, 98 * s);
  },
};

function doorLines(f, door, y, hgt) {
  const { p, s, v } = f;
  if (door * s < 6) return;
  const i0 = Math.floor(v.camX / door), i1 = i0 + Math.ceil(W / (door * s)) + 1;
  for (let i = i0; i <= i1; i++) {
    const x = (i * door - v.camX) * s;
    R(x, y, Math.max(1, .8 * s), hgt, shade(p.accent));
    R(x + door * s * .78, y + hgt * .1, Math.max(1.5, 1.5 * s), Math.max(3, 8 * s), p.light);
  }
}

function drawWalls(f) {
  if (f.sc.indoor) drawInterior(f);
  else if (f.sc.wall) drawFacades(f);
}

function drawCeiling(f) {
  const { sc, p, s, g } = f;
  if (!sc.ceiling) return;
  const cy = g - sc.ceiling * s;
  if (cy <= 0) return;
  paper(() => R(0, 0, W, cy, p.ceiling), 1.3);
  R(0, cy - Math.max(3, 8 * s), W, Math.max(3, 8 * s), p.wallShade);
}
