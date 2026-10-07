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

/* ── 붙박이 가구: 장면 전체 길이로 이어진다 (backdrop.js의 실내 벽이 부른다) ── */
/** 화면에 보이는 칸마다 draw(화면x, 칸번호)를 부른다. 칸은 cm 단위 cell 간격으로 월드에 붙어 있다 */
function runCells(f, cell, draw) {
  const { s, v } = f;
  if (cell * s < 4) return;
  const i0 = Math.floor(v.camX / cell) - 1, i1 = Math.floor((v.camX + W / s) / cell) + 1;
  if (i1 - i0 > 300) return;
  for (let i = i0; i <= i1; i++) draw((i * cell - v.camX) * s, i);
}

/** 문짝 이음선과 손잡이 */
function cabinetDoors(f, door, y, hgt, c, handleAt) {
  const { s, p } = f;
  runCells(f, door, (x) => {
    R(x, y, Math.max(1, .8 * s), hgt, shade(c));
    R(x + Math.max(1, .8 * s), y, Math.max(1, .6 * s), hgt, mix(c, p.light, .3));
    const hy = handleAt < 0 ? y + hgt + handleAt * s : y + handleAt * s;
    paper(() => RR(x + door * s * .35, hy, door * s * .3, Math.max(1.5, 2 * s), s, mix(p.light, '#b9b3a8', .4)), .3);
  });
}

/** 걸레받이 아래 어두운 틈: 바퀴벌레의 길. 조절 다리와 먼지 뭉치가 보인다 */
function toeKick(f, hgt) {
  const { p, s, g } = f, dark = mix(p.ink, p.wall, .3);
  R(0, g - hgt * s, W, hgt * s, dark);
  R(0, g - hgt * s, W, Math.max(1, 1.5 * s), mix(dark, p.ink, .4));
  runCells(f, 60, (x, i) => {
    R(x + 20 * s, g - hgt * s, 3.2 * s, hgt * s, mix(dark, '#b9c3c7', .35));
    E(x + 21.6 * s, g - .6 * s, 3 * s, .8 * s, mix(dark, '#b9c3c7', .3));
    if (hash(i, 111) < .45) {   // 먼지 뭉치
      const dx = x + (34 + hash(i, 112) * 18) * s, r = (1.2 + hash(i, 113) * 1.4) * s;
      E(dx, g - r * .7, r * 1.4, r * .8, mix(dark, '#d6d0c6', .35)); E(dx + r * .5, g - r * 1.1, r * .7, r * .5, mix(dark, '#d6d0c6', .45));
    }
  });
}

const RUNS = {
  counter(f) {
    const { p, s, g, v } = f;
    toeKick(f, 10);
    paper(() => R(0, g - 86 * s, W, 76 * s, p.accent));
    cabinetDoors(f, 60, g - 84 * s, 72 * s, p.accent, 6);
    paper(() => R(0, g - 92 * s, W, 6 * s, p.light), .7);                                            // 상판
    R(0, g - 87 * s, W, Math.max(1, 1 * s), mix(p.light, p.ink, .2));
    paper(() => R(0, g - 232 * s, W, 82 * s, p.accent), .9);
    cabinetDoors(f, 60, g - 230 * s, 78 * s, p.accent, -8);
    R(0, g - 151 * s, W, 3 * s, mix(p.accent, p.ink, .25));
    if (v.night) { ctx.globalAlpha = .28; R(0, g - 148 * s, W, 40 * s, LIT); ctx.globalAlpha = 1; }   // 상부장 밑 조명
  },
  steelTable(f) {
    const { p, s, g } = f;
    const steel = p.accent, leg = 150;
    paper(() => R(0, g - 90 * s, W, 6 * s, steel), .8);
    R(0, g - 85 * s, W, Math.max(1, 1 * s), mix(steel, p.ink, .3));
    R(0, g - 90 * s, W, Math.max(1, .8 * s), mix(steel, '#ffffff', .5));
    paper(() => R(0, g - 30 * s, W, 3 * s, steel), .6);                                               // 아래 선반
    runCells(f, 75, (x, i) => {                                                                        // 선반 위 스테인리스 그릇·대야
      const k = hash(i, 121);
      if (k < .35) [0, 1, 2].forEach((n) => E(x + 30 * s, g - (31 + n * 3) * s, (18 - n * 1.5) * s, 2.4 * s, mix(steel, n % 2 ? '#ffffff' : p.ink, .15)));
      else if (k < .55) { RR(x + 10 * s, g - 50 * s, 46 * s, 20 * s, 4 * s, '#d9584a'); R(x + 8 * s, g - 52 * s, 50 * s, 3 * s, mix('#d9584a', '#ffffff', .2)); }
    });
    runCells(f, leg, (x) => {
      R(x, g - 88 * s, 4 * s, 86 * s, shade(steel)); R(x + .8 * s, g - 88 * s, 1 * s, 86 * s, mix(steel, '#ffffff', .4));
      E(x + 2 * s, g - 1.2 * s, 3.4 * s, 1.4 * s, mix(steel, p.ink, .5));
    });
    paper(() => R(0, g - 182 * s, W, 3 * s, steel), .6);                                              // 벽 선반
    runCells(f, 110, (x, i) => {
      if (hash(i, 122) > .6) return;
      const c = mix(steel, p.ink, .1);
      RR(x + 15 * s, g - 210 * s, 34 * s, 28 * s, 3 * s, c); R(x + 10 * s, g - 212 * s, 44 * s, 3 * s, mix(c, '#ffffff', .3));
      R(x + 49 * s, g - 200 * s, 14 * s, 2.4 * s, c);
    });
  },
  shoeCabinet(f) {
    const { p, s, g } = f;
    toeKick(f, 10);
    paper(() => R(0, g - 112 * s, W, 102 * s, p.accent));
    cabinetDoors(f, 45, g - 110 * s, 98 * s, p.accent, 40);
    paper(() => R(0, g - 117 * s, W, 6 * s, p.light), .7);
  },
};
