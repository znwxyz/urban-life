/* 바깥 사물: cm 단위 크기(w, h)와 그리기 함수 d(x, 지면y, px/cm, 난수, 색조함수).
   같은 꽁초가 파리에겐 통나무, 고라니에겐 보이지 않는 점이 된다 */
const pick = (list, r) => list[Math.floor(r * list.length) % list.length];

const ITEMS = {
  pebble: { w: 2.4, h: 1.4, d: (x, g, s, r, t) => E(x + 1.2 * s, g - .6 * s, 1.2 * s, .7 * s, t(r < .5 ? '#bdb2a6' : '#a0968d')) },
  crumb: { w: 1, h: .6, d: (x, g, s, r, t) => E(x + .5 * s, g - .3 * s, .5 * s, .3 * s, t('#e8c088')) },
  butt: { w: 8, h: .8, d: (x, g, s, r, t) => { R(x, g - .8 * s, 5.5 * s, .8 * s, t('#f7f2e8')); R(x + 5.5 * s, g - .8 * s, 2.5 * s, .8 * s, t('#ea9a5e')); } },
  cap: { w: 3, h: .7, d: (x, g, s, r, t) => R(x, g - .7 * s, 3 * s, .7 * s, t(r < .5 ? '#5fa39a' : '#e6765f')) },
  leaf: { w: 6, h: .6, d: (x, g, s, r, t) => E(x + 3 * s, g - .3 * s, 3 * s, .35 * s, t(r < .5 ? '#d39d4c' : '#93b26a')) },
  feather: { w: 7, h: .6, d: (x, g, s, r, t) => E(x + 3.5 * s, g - .3 * s, 3.5 * s, .4 * s, t('#dfe2e8')) },
  trashbag: { w: 62, h: 72, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#f5f0df' : '#d6e09a';
    E(x + 31 * s, g - 28 * s, 31 * s, 28 * s, t(c)); E(x + 42 * s, g - 22 * s, 16 * s, 20 * s, t(shade(c))); E(x + 31 * s, g - 60 * s, 8 * s, 12 * s, t(c));
  } },
  box: { w: 55, h: 40, d: (x, g, s, r, t) => { block(x, g - 40 * s, 55 * s, 40 * s, '#d9b27c', t); R(x + 20 * s, g - 40 * s, 10 * s, 40 * s, t('#efe3c8')); } },
  bike: { w: 175, h: 100, d: (x, g, s, r, t) => {
    ctx.strokeStyle = t('#4a4f63'); ctx.lineWidth = Math.max(1, 3 * s); const rr = 33 * s;
    ctx.beginPath(); ctx.arc(x + 35 * s, g - rr, rr, 0, TAU); ctx.moveTo(x + 140 * s + rr, g - rr); ctx.arc(x + 140 * s, g - rr, rr, 0, TAU);
    ctx.moveTo(x + 35 * s, g - rr); ctx.lineTo(x + 80 * s, g - 75 * s); ctx.lineTo(x + 130 * s, g - 75 * s); ctx.lineTo(x + 140 * s, g - rr);
    ctx.moveTo(x + 80 * s, g - 75 * s); ctx.lineTo(x + 92 * s, g - rr); ctx.lineTo(x + 35 * s, g - rr); ctx.stroke();
  } },
  pot: { w: 40, h: 65, d: (x, g, s, r, t) => { block(x + 5 * s, g - 34 * s, 30 * s, 34 * s, '#d9825f', t); E(x + 20 * s, g - 50 * s, 20 * s, 16 * s, t('#7fb08a')); E(x + 12 * s, g - 44 * s, 10 * s, 9 * s, t('#6a9c78')); } },
  bin: { w: 50, h: 100, d: (x, g, s, r, t) => { block(x, g - 95 * s, 50 * s, 95 * s, '#5fa39a', t); R(x - 3 * s, g - 101 * s, 56 * s, 8 * s, t('#4c8a82')); } },
  bench: { w: 160, h: 85, d: (x, g, s, r, t) => {
    R(x + 12 * s, g - 45 * s, 8 * s, 45 * s, t('#4a4f63')); R(x + 140 * s, g - 45 * s, 8 * s, 45 * s, t('#4a4f63'));
    [48, 70, 85].forEach((y) => R(x, g - y * s, 160 * s, 7 * s, t('#d08c62')));
  } },
  car: { w: 430, h: 145, d: (x, g, s, r, t) => {
    const c = pick(['#f3e9dc', '#e6765f', '#5fa39a', '#8c7fa8'], r);
    RR(x + 90 * s, g - 158 * s, 270 * s, 90 * s, 40 * s, t(c));
    RR(x + 115 * s, g - 145 * s, 100 * s, 50 * s, 18 * s, t('#d8edf3')); RR(x + 228 * s, g - 145 * s, 100 * s, 50 * s, 18 * s, t('#d8edf3'));
    RR(x, g - 108 * s, 430 * s, 76 * s, 34 * s, t(c)); RR(x, g - 62 * s, 430 * s, 26 * s, 13 * s, t(shade(c)));
    E(x + 18 * s, g - 86 * s, 9 * s, 7 * s, t('#fff1b8'));
    [95, 340].forEach((wx) => { E(x + wx * s, g - 32 * s, 32 * s, 32 * s, t('#3a3445')); E(x + wx * s, g - 32 * s, 13 * s, 13 * s, t('#cfcad8')); });
  } },
  tree: { w: 300, h: 620, d: (x, g, s, r, t) => {
    R(x + 139 * s, g - 330 * s, 24 * s, 330 * s, t('#8a6a52'));
    E(x + 150 * s, g - 430 * s, 150 * s, 150 * s, t('#7fb08a')); E(x + 80 * s, g - 370 * s, 80 * s, 70 * s, t('#6a9c78')); E(x + 215 * s, g - 505 * s, 70 * s, 60 * s, t('#93c29a'));
  } },
  pole: { w: 30, h: 900, d: (x, g, s, r, t) => {
    block(x, g - 900 * s, 26 * s, 900 * s, '#a29fb2', t); R(x - 50 * s, g - 840 * s, 130 * s, 10 * s, t('#8d8a9c'));
    P([[x + 26 * s, g - 760 * s], [x + 120 * s, g - 760 * s], [x + 110 * s, g - 740 * s], [x + 26 * s, g - 745 * s]], t('#e9e4f0'));
  } },
  column: { w: 60, h: 250, d: (x, g, s, r, t) => block(x, g - 250 * s, 60 * s, 250 * s, '#cbb2a6', t) },
  shrub: { w: 90, h: 60, d: (x, g, s, r, t) => { E(x + 45 * s, g - 28 * s, 45 * s, 30 * s, t('#6a9c78')); E(x + 30 * s, g - 40 * s, 25 * s, 22 * s, t('#7fb08a')); } },
  recycleBin: { w: 70, h: 112, d: (x, g, s, r, t) => {
    const c = pick(['#5f8fb0', '#6fae7f', '#f0c27a', '#e6765f'], r);
    block(x, g - 100 * s, 70 * s, 100 * s, c, t); R(x - 3 * s, g - 112 * s, 76 * s, 12 * s, t(shade(c))); E(x + 30 * s, g - 60 * s, 13 * s, 13 * s, t('#fffaf0'));
  } },
  cardboard: { w: 96, h: 32, d: (x, g, s, r, t) => { for (let k = 0; k < 4; k++) R(x + (k % 2) * 6 * s, g - (k + 1) * 8 * s, 90 * s, 7 * s, t(k % 2 ? '#d9b27c' : '#c9a06a')); } },
  gasTank: { w: 36, h: 128, d: (x, g, s, r, t) => {
    block(x, g - 110 * s, 36 * s, 110 * s, '#b9c2cc', t); E(x + 18 * s, g - 110 * s, 18 * s, 9 * s, t('#b9c2cc')); R(x + 12 * s, g - 128 * s, 12 * s, 14 * s, t('#8d97a3'));
  } },
  crate: { w: 55, h: 30, d: (x, g, s, r, t) => { const c = r < .5 ? '#3f8f73' : '#d9584a'; block(x, g - 30 * s, 55 * s, 30 * s, c, t); R(x + 5 * s, g - 24 * s, 45 * s, 6 * s, t(shade(c))); } },
  plasticChair: { w: 50, h: 80, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#f4f1ea' : '#6fae7f';
    R(x, g - 45 * s, 50 * s, 6 * s, t(c)); R(x + 3 * s, g - 45 * s, 5 * s, 45 * s, t(c)); R(x + 42 * s, g - 45 * s, 5 * s, 45 * s, t(c)); R(x + 42 * s, g - 82 * s, 7 * s, 40 * s, t(shade(c)));
  } },
  parasolTable: { w: 200, h: 235, d: (x, g, s, r, t) => {
    R(x + 40 * s, g - 72 * s, 120 * s, 5 * s, t('#f4f1ea')); R(x + 97 * s, g - 72 * s, 6 * s, 72 * s, t('#d6d1c6')); R(x + 98 * s, g - 225 * s, 4 * s, 155 * s, t('#a9a4b8'));
    P([[x, g - 200 * s], [x + 100 * s, g - 235 * s], [x + 200 * s, g - 200 * s]], t('#3f9f7f')); P([[x + 70 * s, g - 210 * s], [x + 100 * s, g - 235 * s], [x + 130 * s, g - 210 * s]], t('#f4f1ea'));
  } },
  slide: { w: 300, h: 190, d: (x, g, s, r, t) => {
    R(x, g - 180 * s, 8 * s, 180 * s, t('#5f8fb0')); R(x + 60 * s, g - 180 * s, 8 * s, 180 * s, t('#5f8fb0'));
    for (let k = 1; k < 5; k++) R(x, g - k * 36 * s, 68 * s, 5 * s, t('#5f8fb0'));
    R(x - 4 * s, g - 190 * s, 76 * s, 12 * s, t('#e98a6d'));
    P([[x + 70 * s, g - 186 * s], [x + 300 * s, g - 16 * s], [x + 300 * s, g - 4 * s], [x + 70 * s, g - 172 * s]], t('#f0c27a'));
  } },
  toilet: { w: 450, h: 320, d: (x, g, s, r, t) => {
    block(x, g - 300 * s, 420 * s, 300 * s, '#d9cbb8', t); R(x - 15 * s, g - 322 * s, 450 * s, 24 * s, t('#8c7fa8'));
    R(x + 60 * s, g - 210 * s, 90 * s, 210 * s, t('#7d8fa6')); R(x + 230 * s, g - 210 * s, 90 * s, 210 * s, t('#e6765f'));
  } },
  /* 장면 소품 */
  feeder: { w: 40, h: 8, d: (x, g, s, r, t) => { E(x + 9 * s, g - 3.5 * s, 9 * s, 3.5 * s, t('#e6765f')); E(x + 30 * s, g - 3.5 * s, 9 * s, 3.5 * s, t('#5f8fb0')); E(x + 9 * s, g - 6 * s, 6 * s, 1.5 * s, t('#b7864f')); } },
  trapCage: { w: 80, h: 35, d: (x, g, s, r, t) => {
    ctx.strokeStyle = t('#7d8794'); ctx.lineWidth = Math.max(1, .8 * s); ctx.strokeRect(x, g - 35 * s, 80 * s, 35 * s);
    ctx.beginPath(); for (let k = 1; k < 13; k++) { ctx.moveTo(x + k * 6 * s, g - 35 * s); ctx.lineTo(x + k * 6 * s, g); } ctx.stroke();
    E(x + 62 * s, g - 2.5 * s, 5 * s, 2.5 * s, t('#cfd6dc'));
  } },
  styroHouse: { w: 60, h: 45, d: (x, g, s, r, t) => { block(x, g - 45 * s, 60 * s, 45 * s, '#fbfaf5', t); E(x + 22 * s, g - 18 * s, 10 * s, 12 * s, t('#3a3445')); } },
  carrier: { w: 55, h: 46, d: (x, g, s, r, t) => {
    block(x, g - 38 * s, 55 * s, 38 * s, '#8fb8a8', t); R(x + 44 * s, g - 34 * s, 9 * s, 30 * s, t('#3f4a48')); R(x + 15 * s, g - 46 * s, 25 * s, 5 * s, t('#3f4a48'));
  } },
  foodBin: { w: 45, h: 55, d: (x, g, s, r, t) => { block(x, g - 50 * s, 45 * s, 50 * s, '#7a9a55', t); R(x - 2 * s, g - 55 * s, 49 * s, 7 * s, t('#5f7d42')); } },
};
