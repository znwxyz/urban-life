/* 실내 사물과 실내 장면 소품. 형식은 items-outdoor.js와 같다 */
Object.assign(ITEMS, {
  rice: { w: .7, h: .4, d: (x, g, s, r, t) => E(x + .35 * s, g - .2 * s, .35 * s, .2 * s, t('#fbf7ee')) },
  onion: { w: 3, h: .4, d: (x, g, s, r, t) => E(x + 1.5 * s, g - .2 * s, 1.5 * s, .25 * s, t('#efdcb4')) },
  dropping: { w: 2, h: .15, d: (x, g, s, r, t) => { for (let k = 0; k < 5; k++) E(x + k * .4 * s, g - .07 * s, .08 * s, .07 * s, t('#2e2420')); } },
  fridge: { w: 75, h: 180, d: (x, g, s, r, t) => {
    block(x, g - 180 * s, 75 * s, 180 * s, '#f6f3ec', t); R(x, g - 120 * s, 75 * s, 2 * s, t('#cfc9bd')); R(x + 8 * s, g - 168 * s, 4 * s, 36 * s, t('#b9b3a8'));
  } },
  table: { w: 140, h: 75, d: (x, g, s, r, t) => {
    R(x + 8 * s, g - 75 * s, 6 * s, 75 * s, t('#a77c56')); R(x + 126 * s, g - 75 * s, 6 * s, 75 * s, t('#a77c56')); R(x, g - 78 * s, 140 * s, 6 * s, t('#c99a6e'));
  } },
  chair: { w: 45, h: 90, d: (x, g, s, r, t) => {
    R(x + 2 * s, g - 45 * s, 4 * s, 45 * s, t('#a77c56')); R(x + 38 * s, g - 90 * s, 5 * s, 90 * s, t('#a77c56')); R(x, g - 47 * s, 45 * s, 5 * s, t('#c99a6e'));
  } },
  trashcan: { w: 30, h: 42, d: (x, g, s, r, t) => { block(x, g - 40 * s, 30 * s, 40 * s, '#e9e4ec', t); R(x - 1 * s, g - 42 * s, 32 * s, 4 * s, t('#cfc8d6')); } },
  sofa: { w: 220, h: 85, d: (x, g, s, r, t) => {
    R(x + 15 * s, g - 8 * s, 6 * s, 8 * s, t('#6b4f3e')); R(x + 200 * s, g - 8 * s, 6 * s, 8 * s, t('#6b4f3e'));
    R(x + 10 * s, g - 85 * s, 200 * s, 45 * s, t(shade('#e08a6c'))); block(x, g - 45 * s, 220 * s, 37 * s, '#e08a6c', t);
    R(x, g - 65 * s, 22 * s, 57 * s, t('#e08a6c')); R(x + 198 * s, g - 65 * s, 22 * s, 57 * s, t('#e08a6c'));
  } },
  tvstand: { w: 180, h: 130, d: (x, g, s, r, t) => { block(x, g - 45 * s, 180 * s, 45 * s, '#c99a6e', t); R(x + 20 * s, g - 130 * s, 140 * s, 80 * s, t('#2f2a3a')); R(x + 85 * s, g - 50 * s, 10 * s, 6 * s, t('#2f2a3a')); } },
  plant: { w: 60, h: 150, d: (x, g, s, r, t) => {
    E(x + 30 * s, g - 95 * s, 16 * s, 50 * s, t('#6a9c78')); E(x + 14 * s, g - 75 * s, 13 * s, 36 * s, t('#7fb08a')); E(x + 46 * s, g - 80 * s, 13 * s, 40 * s, t('#5f8f6c'));
    block(x + 10 * s, g - 40 * s, 40 * s, 40 * s, '#f4f1ea', t);
  } },
  cushion: { w: 45, h: 18, d: (x, g, s, r, t) => E(x + 22 * s, g - 9 * s, 22 * s, 9 * s, t(r < .5 ? '#f0c27a' : '#8fb8a8')) },
  door: { w: 100, h: 210, d: (x, g, s, r, t) => {
    block(x, g - 210 * s, 100 * s, 210 * s, '#7d8fa6', t); R(x + 70 * s, g - 125 * s, 10 * s, 24 * s, t('#2f2a3a')); R(x + 66 * s, g - 100 * s, 16 * s, 4 * s, t('#cfcad8'));
  } },
  shoes: { w: 60, h: 12, d: (x, g, s, r, t) => { const c = pick(['#2f2a3a', '#e6765f', '#f4f1ea', '#5f8fb0'], r); E(x + 14 * s, g - 5 * s, 14 * s, 5 * s, t(c)); E(x + 44 * s, g - 5 * s, 14 * s, 5 * s, t(shade(c))); } },
  umbrella: { w: 18, h: 90, d: (x, g, s, r, t) => P([[x, g], [x + 8 * s, g], [x + 18 * s, g - 90 * s], [x + 8 * s, g - 88 * s]], t('#5f8fb0')) },
  stove: { w: 90, h: 125, d: (x, g, s, r, t) => {
    block(x, g - 85 * s, 90 * s, 85 * s, '#b9c3c7', t); R(x, g - 90 * s, 90 * s, 5 * s, t('#3a4442'));
    block(x + 12 * s, g - 122 * s, 40 * s, 32 * s, '#d6dde0', t); R(x + 6 * s, g - 124 * s, 52 * s, 4 * s, t('#9aa5aa'));
  } },
  shelf: { w: 120, h: 180, d: (x, g, s, r, t) => {
    R(x, g - 180 * s, 4 * s, 180 * s, t('#9aa5aa')); R(x + 116 * s, g - 180 * s, 4 * s, 180 * s, t('#9aa5aa'));
    [40, 100, 160].forEach((y, k) => { R(x, g - y * s, 120 * s, 3 * s, t('#b9c3c7')); block(x + (10 + k * 30) * s, g - (y + 25) * s, 30 * s, 25 * s, pick(['#e6765f', '#f0c27a', '#f4f1ea'], hash(k, r * 9)), t); });
  } },
  bucket: { w: 30, h: 35, d: (x, g, s, r, t) => block(x, g - 35 * s, 30 * s, 35 * s, '#5f8fb0', t) },
  /* 장면 소품 */
  vaseTable: { w: 140, h: 150, d: (x, g, s, r, t) => {
    ITEMS.table.d(x, g, s, r, t);
    ctx.strokeStyle = t('#6a9c78'); ctx.lineWidth = Math.max(1, .8 * s);
    ctx.beginPath(); [[-8, -140], [0, -148], [9, -138]].forEach(([dx, dy]) => { ctx.moveTo(x + 68 * s, g - 100 * s); ctx.lineTo(x + (68 + dx) * s, g + dy * s); }); ctx.stroke();
    [[-8, -140], [0, -148], [9, -138]].forEach(([dx, dy]) => { E(x + (68 + dx) * s, g + dy * s, 6 * s, 4 * s, t('#fffaf0')); E(x + (68 + dx) * s, g + (dy - 1) * s, 1.5 * s, 1.5 * s, t('#e8955a')); });
    block(x + 60 * s, g - 108 * s, 16 * s, 30 * s, '#8fb8a8', t);
    [30, 34, 90, 96].forEach((dx) => E(x + dx * s, g - 79 * s, .8 * s, .5 * s, t('#e8955a')));
  } },
  baitStation: { w: 5, h: 1.2, d: (x, g, s, r, t) => {
    R(x, g - 1.2 * s, 5 * s, 1.2 * s, t('#f6f3ec')); R(x + 1.5 * s, g - 1.4 * s, 2 * s, .3 * s, t('#d6d0c6'));
    R(x + .3 * s, g - .8 * s, .6 * s, .5 * s, t('#4a4550')); R(x + 4.1 * s, g - .8 * s, .6 * s, .5 * s, t('#4a4550'));
  } },
  deliveryBag: { w: 40, h: 38, d: (x, g, s, r, t) => {
    R(x, g - 30 * s, 40 * s, 30 * s, t('#f6f3ec')); R(x + 30 * s, g - 30 * s, 10 * s, 30 * s, t(shade('#f6f3ec')));
    E(x + 20 * s, g - 33 * s, 8 * s, 5 * s, t('#f6f3ec')); R(x + 5 * s, g - 20 * s, 25 * s, 4 * s, t('#e6765f'));
  } },
});
