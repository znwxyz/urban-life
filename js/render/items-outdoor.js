/* 바깥 사물: cm 단위 크기(w, h)와 그리기 함수 d(x, 지면y, px/cm, 난수, 색조함수).
   같은 꽁초가 파리에겐 통나무, 고라니에겐 보이지 않는 점이 된다 */
const pick = (list, r) => list[Math.floor(r * list.length) % list.length];
const LEAF = Object.freeze(['#7fb08a', '#6a9c78', '#93c29a', '#5f8f6c']);

/** 바닥에 닿는 납작한 그림자 */
const footShadow = (cx, g, rx, s) => E(cx, g - .3 * s, rx, Math.max(1, rx * .12), 'rgba(38,26,58,.18)');

/** 겹겹이 오려 붙인 잎 덩어리: 어두운 잎 → 밝은 잎 순서로 쌓는다 */
function leafMass(cx, cy, rx, ry, r, t, n = 7) {
  for (let k = 0; k < n; k++) {
    const a = (k / n) * TAU + r * 3, d = .55 + hash(k, r * 17) * .3;
    E(cx + Math.cos(a) * rx * d * .6, cy + Math.sin(a) * ry * d * .5, rx * .48, ry * .46, t(LEAF[(k + 1) % 2 ? 1 : 3]));
  }
  E(cx, cy, rx * .72, ry * .7, t(LEAF[0]));
  E(cx - rx * .2, cy - ry * .25, rx * .42, ry * .36, t(LEAF[2]));
}

const ITEMS = {
  pebble: { w: 2.4, h: 1.4, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#bdb2a6' : '#a0968d';
    E(x + 1.2 * s, g - .6 * s, 1.2 * s, .7 * s, t(c)); E(x + 1 * s, g - .85 * s, .6 * s, .25 * s, t(mix(c, '#ffffff', .3)));
  } },
  crumb: { w: 1, h: .6, d: (x, g, s, r, t) => { E(x + .5 * s, g - .3 * s, .5 * s, .3 * s, t('#e8c088')); E(x + .4 * s, g - .38 * s, .2 * s, .1 * s, t('#f6dcae')); } },
  butt: { w: 8, h: .8, d: (x, g, s, r, t) => {
    RR(x, g - .8 * s, 5.5 * s, .8 * s, .3 * s, t('#f7f2e8')); RR(x + 5.3 * s, g - .8 * s, 2.7 * s, .8 * s, .3 * s, t('#ea9a5e'));
    E(x + .2 * s, g - .4 * s, .25 * s, .38 * s, t('#5a4e4e'));
    if (s > 6) for (let k = 0; k < 4; k++) E(x + (5.8 + k * .55) * s, g - (.25 + (k % 2) * .3) * s, .1 * s, .1 * s, t('#c97b4a'));
  } },
  cap: { w: 3, h: .7, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#5fa39a' : '#e6765f';
    RR(x, g - .7 * s, 3 * s, .7 * s, .2 * s, t(c));
    if (s > 4) for (let k = 0; k < 6; k++) R(x + (.2 + k * .48) * s, g - .6 * s, .15 * s, .5 * s, t(shade(c)));
  } },
  leaf: { w: 6, h: .6, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#d39d4c' : '#93b26a';
    curvy([[x, g - .2 * s], [x + 2 * s, g - .9 * s, x + 6 * s, g - .3 * s], [x + 3 * s, g + .1 * s, x, g - .2 * s]], t(c));
    L(x + .3 * s, g - .25 * s, x + 5.6 * s, g - .3 * s, t(shade(c)), Math.max(.5, .08 * s));
  } },
  feather: { w: 7, h: .6, d: (x, g, s, r, t) => {
    E(x + 3.8 * s, g - .3 * s, 3.2 * s, .45 * s, t('#dfe2e8')); L(x, g - .2 * s, x + 7 * s, g - .3 * s, t('#c4c9d4'), Math.max(.5, .1 * s));
  } },
  trashbag: { w: 62, h: 72, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#f5f0df' : '#d6e09a', d = shade(c);
    footShadow(x + 31 * s, g, 30 * s, s);
    curvy([[x + 4 * s, g], [x - 6 * s, g - 40 * s, x + 20 * s, g - 52 * s], [x + 26 * s, g - 56 * s], [x + 31 * s, g - 50 * s], [x + 36 * s, g - 56 * s], [x + 44 * s, g - 52 * s], [x + 70 * s, g - 38 * s, x + 58 * s, g]], t(c));
    curvy([[x + 40 * s, g], [x + 52 * s, g - 30 * s, x + 46 * s, g - 48 * s], [x + 66 * s, g - 30 * s, x + 58 * s, g]], t(d));
    curvy([[x + 25 * s, g - 54 * s], [x + 22 * s, g - 70 * s], [x + 30 * s, g - 62 * s], [x + 38 * s, g - 72 * s], [x + 36 * s, g - 54 * s]], t(c));   // 묶은 매듭
    L(x + 14 * s, g - 30 * s, x + 22 * s, g - 12 * s, t(d), Math.max(.6, 1.2 * s)); L(x + 30 * s, g - 44 * s, x + 28 * s, g - 20 * s, t(d), Math.max(.6, 1 * s));
  } },
  box: { w: 55, h: 40, d: (x, g, s, r, t) => {
    footShadow(x + 27 * s, g, 28 * s, s);
    block(x, g - 40 * s, 55 * s, 40 * s, '#d9b27c', t); R(x + 20 * s, g - 40 * s, 10 * s, 40 * s, t('#efe3c8'));
    P([[x, g - 40 * s], [x + 8 * s, g - 50 * s], [x + 22 * s, g - 48 * s], [x + 20 * s, g - 40 * s]], t('#c9a06a'));   // 들린 뚜껑
    R(x + 34 * s, g - 30 * s, 14 * s, 8 * s, t('#f4f1ea')); R(x + 36 * s, g - 28 * s, 10 * s, 1 * s, t('#8d8a9c'));
  } },
  bike: { w: 175, h: 100, d: (x, g, s, r, t) => {
    const frame = t(r < .5 ? '#4a4f63' : '#5f8fb0'), tire = t('#2f2a3a'), rr = 33 * s, lw = Math.max(1, 3 * s);
    [35, 140].forEach((wx) => {
      ctx.strokeStyle = tire; ctx.lineWidth = Math.max(1, 4.5 * s); ctx.beginPath(); ctx.arc(x + wx * s, g - rr, rr - 2 * s, 0, TAU); ctx.stroke();
      ctx.strokeStyle = t('#b9b3c4'); ctx.lineWidth = Math.max(.5, .6 * s); ctx.beginPath();
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 8; ctx.moveTo(x + wx * s - Math.cos(a) * rr * .85, g - rr - Math.sin(a) * rr * .85); ctx.lineTo(x + wx * s + Math.cos(a) * rr * .85, g - rr + Math.sin(a) * rr * .85); }
      ctx.stroke();
    });
    ctx.strokeStyle = frame; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.beginPath();
    ctx.moveTo(x + 35 * s, g - rr); ctx.lineTo(x + 80 * s, g - 72 * s); ctx.lineTo(x + 128 * s, g - 72 * s); ctx.lineTo(x + 140 * s, g - rr);
    ctx.moveTo(x + 80 * s, g - 72 * s); ctx.lineTo(x + 92 * s, g - rr); ctx.lineTo(x + 35 * s, g - rr); ctx.moveTo(x + 92 * s, g - rr); ctx.lineTo(x + 128 * s, g - 72 * s);
    ctx.moveTo(x + 76 * s, g - 72 * s); ctx.lineTo(x + 72 * s, g - 84 * s); ctx.moveTo(x + 128 * s, g - 72 * s); ctx.lineTo(x + 124 * s, g - 92 * s); ctx.lineTo(x + 112 * s, g - 96 * s);
    ctx.stroke();
    RR(x + 60 * s, g - 90 * s, 26 * s, 7 * s, 3.5 * s, t('#3b3049'));                                // 안장
    E(x + 92 * s, g - rr, 7 * s, 7 * s, t('#8d8a9c'));
    RR(x + 128 * s, g - 88 * s, 30 * s, 16 * s, 3 * s, t('#c9c4cc'));                               // 앞 바구니
  } },
  pot: { w: 40, h: 65, d: (x, g, s, r, t) => {
    footShadow(x + 20 * s, g, 18 * s, s);
    P([[x + 4 * s, g - 34 * s], [x + 36 * s, g - 34 * s], [x + 31 * s, g], [x + 9 * s, g]], t('#d9825f'));
    P([[x + 26 * s, g - 34 * s], [x + 36 * s, g - 34 * s], [x + 31 * s, g], [x + 23 * s, g]], t(shade('#d9825f')));
    R(x + 2 * s, g - 37 * s, 36 * s, 6 * s, t('#e39a78'));
    if (r < .5) leafMass(x + 20 * s, g - 50 * s, 22 * s, 18 * s, r, t, 5);
    else { [-10, 0, 10].forEach((dx, k) => { L(x + 20 * s, g - 37 * s, x + (20 + dx) * s, g - (52 + k * 4) * s, t('#6a9c78'), Math.max(1, 1.6 * s)); E(x + (20 + dx) * s, g - (54 + k * 4) * s, 6 * s, 4 * s, t(k === 1 ? '#f0c27a' : '#e98a6d')); }); }
  } },
  bin: { w: 50, h: 100, d: (x, g, s, r, t) => {
    footShadow(x + 25 * s, g, 26 * s, s);
    block(x, g - 95 * s, 50 * s, 95 * s, '#5fa39a', t); R(x - 3 * s, g - 101 * s, 56 * s, 8 * s, t('#4c8a82'));
    RR(x + 12 * s, g - 88 * s, 20 * s, 6 * s, 3 * s, t('#2f4a48')); R(x + 6 * s, g - 50 * s, 30 * s, 14 * s, t('#f4f1ea'));
  } },
  bench: { w: 160, h: 85, d: (x, g, s, r, t) => {
    const wood = '#d08c62', iron = t('#4a4f63');
    footShadow(x + 80 * s, g, 80 * s, s);
    [12, 140].forEach((lx) => { R(x + lx * s, g - 45 * s, 8 * s, 45 * s, iron); curvy([[x + (lx - 2) * s, g - 45 * s], [x + (lx + 2) * s, g - 70 * s, x + (lx + 4) * s, g - 90 * s], [x + (lx + 9) * s, g - 90 * s], [x + (lx + 6) * s, g - 70 * s, x + (lx + 10) * s, g - 45 * s]], iron); });
    [[48, 7], [62, 6], [78, 7], [90, 6]].forEach(([y, h], k) => { R(x, g - y * s, 160 * s, h * s, t(k % 2 ? shade(wood) : wood)); R(x, g - y * s, 160 * s, Math.max(.6, .8 * s), t(mix(wood, '#ffffff', .25))); });
  } },
  car: { w: 430, h: 145, d: (x, g, s, r, t) => {
    const c = pick(['#f3e9dc', '#e6765f', '#5fa39a', '#8c7fa8'], r), d = shade(c), glass = t('#cfe3ea');
    footShadow(x + 215 * s, g, 210 * s, s);
    curvy([[x + 70 * s, g - 100 * s], [x + 110 * s, g - 158 * s], [x + 300 * s, g - 158 * s], [x + 350 * s, g - 104 * s]], t(c));
    curvy([[x + 112 * s, g - 104 * s], [x + 132 * s, g - 148 * s], [x + 212 * s, g - 148 * s], [x + 212 * s, g - 104 * s]], glass);
    curvy([[x + 222 * s, g - 104 * s], [x + 222 * s, g - 148 * s], [x + 292 * s, g - 148 * s], [x + 330 * s, g - 104 * s]], glass);
    ctx.globalAlpha = .4; P([[x + 150 * s, g - 108 * s], [x + 170 * s, g - 146 * s], [x + 182 * s, g - 146 * s], [x + 162 * s, g - 108 * s]], '#ffffff'); ctx.globalAlpha = 1;
    RR(x, g - 108 * s, 430 * s, 76 * s, 30 * s, t(c));
    RR(x, g - 66 * s, 430 * s, 30 * s, 14 * s, t(d));
    R(x + 215 * s, g - 104 * s, 2 * s, 66 * s, t(d)); R(x + 175 * s, g - 92 * s, 22 * s, 4 * s, t(d)); R(x + 265 * s, g - 92 * s, 22 * s, 4 * s, t(d));
    E(x + 16 * s, g - 86 * s, 10 * s, 8 * s, t('#fff1b8')); RR(x + 412 * s, g - 92 * s, 16 * s, 14 * s, 4 * s, t('#e6765f'));
    RR(x + 180 * s, g - 48 * s, 70 * s, 14 * s, 3 * s, t('#f4f1ea'));                                // 번호판
    [95, 335].forEach((wx) => {
      E(x + wx * s, g - 34 * s, 40 * s, 40 * s, t(mix(d, '#2f2a3a', .5)));
      E(x + wx * s, g - 32 * s, 32 * s, 32 * s, t('#3a3445')); E(x + wx * s, g - 32 * s, 15 * s, 15 * s, t('#cfcad8'));
      for (let k = 0; k < 5; k++) { const a = k * TAU / 5; E(x + wx * s + Math.cos(a) * 9 * s, g - 32 * s + Math.sin(a) * 9 * s, 2.4 * s, 2.4 * s, t('#9a95a8')); }
    });
  } },
  tree: { w: 300, h: 620, d: (x, g, s, r, t) => {
    const bark = '#8a6a52';
    footShadow(x + 150 * s, g, 110 * s, s);
    curvy([[x + 128 * s, g], [x + 142 * s, g - 200 * s, x + 136 * s, g - 360 * s], [x + 166 * s, g - 360 * s], [x + 158 * s, g - 200 * s, x + 176 * s, g]], t(bark));
    curvy([[x + 150 * s, g - 300 * s], [x + 110 * s, g - 360 * s, x + 80 * s, g - 380 * s], [x + 84 * s, g - 390 * s], [x + 120 * s, g - 380 * s, x + 156 * s, g - 330 * s]], t(bark));
    R(x + 160 * s, g - 340 * s, 6 * s, 340 * s, t(shade(bark)));
    for (let k = 0; k < 6; k++) R(x + (140 + hash(k, r) * 18) * s, g - (40 + k * 50) * s, 8 * s, 2 * s, t(shade(bark)));   // 나무껍질 결
    leafMass(x + 85 * s, g - 380 * s, 85 * s, 70 * s, r + .1, t);
    leafMass(x + 205 * s, g - 420 * s, 95 * s, 80 * s, r + .3, t);
    leafMass(x + 150 * s, g - 500 * s, 120 * s, 100 * s, r + .5, t);
    E(x + 150 * s, g - 280 * s, 60 * s, 18 * s, t(mix(LEAF[3], '#2f2a3a', .2)));                   // 잎 아래 그늘
  } },
  pole: { w: 30, h: 900, d: (x, g, s, r, t) => {
    const concrete = '#a29fb2';
    footShadow(x + 13 * s, g, 18 * s, s);
    P([[x, g], [x + 3 * s, g - 900 * s], [x + 23 * s, g - 900 * s], [x + 26 * s, g]], t(concrete));
    R(x + 18 * s, g - 900 * s, 6 * s, 900 * s, t(shade(concrete)));
    for (let k = 0; k < 4; k++) R(x - 2 * s, g - (160 + k * 18) * s, 30 * s, 10 * s, t(k % 2 ? '#f4f1ea' : '#e8c24a'));   // 전단지 붙였다 뗀 자국 띠
    R(x - 60 * s, g - 840 * s, 146 * s, 10 * s, t('#8d8a9c')); R(x - 40 * s, g - 790 * s, 106 * s, 8 * s, t('#8d8a9c'));
    [-55, -20, 50, 80].forEach((dx) => RR(x + dx * s, g - 852 * s, 6 * s, 12 * s, 2 * s, t('#f4f1ea')));   // 애자
    RR(x + 28 * s, g - 720 * s, 40 * s, 70 * s, 12 * s, t('#8d8a9c'));                              // 변압기
    for (let k = 0; k < 6; k++) R(x + (5 + (k % 2) * 6) * s, g - (300 + k * 40) * s, 16 * s, 3 * s, t('#5f5a6e'));   // 발판 못
    P([[x + 26 * s, g - 760 * s], [x + 120 * s, g - 760 * s], [x + 110 * s, g - 740 * s], [x + 26 * s, g - 745 * s]], t('#e9e4f0'));
  } },
  column: { w: 60, h: 250, d: (x, g, s, r, t) => {
    block(x, g - 250 * s, 60 * s, 250 * s, '#cbb2a6', t);
    for (let k = 0; k < 4; k++) R(x, g - (40 + k * 8) * s, 50 * s, 4 * s, t(k % 2 ? '#f4f1ea' : '#3b3049'));   // 주차 기둥 경고 띠
    R(x, g - 250 * s, 60 * s, 3 * s, t('#e3d6cc'));
  } },
  shrub: { w: 90, h: 60, d: (x, g, s, r, t) => { footShadow(x + 45 * s, g, 44 * s, s); leafMass(x + 45 * s, g - 30 * s, 45 * s, 30 * s, r, t, 6); } },
  recycleBin: { w: 70, h: 112, d: (x, g, s, r, t) => {
    const c = pick(['#5f8fb0', '#6fae7f', '#f0c27a', '#e6765f'], r);
    footShadow(x + 35 * s, g, 36 * s, s);
    P([[x + 2 * s, g - 100 * s], [x + 68 * s, g - 100 * s], [x + 64 * s, g], [x + 6 * s, g]], t(c));
    P([[x + 52 * s, g - 100 * s], [x + 68 * s, g - 100 * s], [x + 64 * s, g], [x + 50 * s, g]], t(shade(c)));
    RR(x - 3 * s, g - 112 * s, 76 * s, 13 * s, 3 * s, t(shade(c))); R(x + 18 * s, g - 108 * s, 30 * s, 4 * s, t('#2f2a3a'));
    E(x + 30 * s, g - 64 * s, 14 * s, 14 * s, t('#fffaf0'));
    ctx.strokeStyle = t(c); ctx.lineWidth = Math.max(1, 2 * s); ctx.beginPath();                    // 재활용 화살표
    for (let k = 0; k < 3; k++) { const a = k * TAU / 3 - .3; ctx.moveTo(x + 30 * s + Math.cos(a) * 8 * s, g - 64 * s + Math.sin(a) * 8 * s); ctx.lineTo(x + 30 * s + Math.cos(a + 1.6) * 8 * s, g - 64 * s + Math.sin(a + 1.6) * 8 * s); }
    ctx.stroke();
    [14, 56].forEach((wx) => { E(x + wx * s, g - 5 * s, 5 * s, 5 * s, t('#2f2a3a')); E(x + wx * s, g - 5 * s, 2 * s, 2 * s, t('#9a95a8')); });
  } },
  cardboard: { w: 96, h: 32, d: (x, g, s, r, t) => {
    for (let k = 0; k < 4; k++) {
      const c = k % 2 ? '#d9b27c' : '#c9a06a', dx = (k % 2) * 6 * s;
      R(x + dx, g - (k + 1) * 8 * s, 90 * s, 7 * s, t(c)); R(x + dx, g - (k + 1) * 8 * s, 90 * s, Math.max(.5, 1 * s), t(mix(c, '#ffffff', .3)));
    }
    R(x + 40 * s, g - 32 * s, 3 * s, 32 * s, t('#f4f1ea')); R(x + 30 * s, g - 32 * s, 3 * s, 32 * s, t('#f4f1ea'));   // 노끈
  } },
  gasTank: { w: 36, h: 128, d: (x, g, s, r, t) => {
    footShadow(x + 18 * s, g, 18 * s, s);
    RR(x, g - 112 * s, 36 * s, 112 * s, 14 * s, t('#b9c2cc')); R(x + 26 * s, g - 104 * s, 8 * s, 96 * s, t(shade('#b9c2cc')));
    R(x, g - 70 * s, 36 * s, 14 * s, t('#e6765f')); R(x + 6 * s, g - 66 * s, 16 * s, 3 * s, t('#f4f1ea'));
    RR(x + 8 * s, g - 124 * s, 20 * s, 14 * s, 4 * s, t('#8d97a3')); R(x + 14 * s, g - 130 * s, 8 * s, 8 * s, t('#5f6a76'));
    ctx.strokeStyle = t('#3b3049'); ctx.lineWidth = Math.max(1, 2 * s); ctx.beginPath(); ctx.moveTo(x + 22 * s, g - 126 * s); ctx.quadraticCurveTo(x + 60 * s, g - 130 * s, x + 50 * s, g); ctx.stroke();
  } },
  crate: { w: 55, h: 30, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#3f8f73' : '#d9584a';
    footShadow(x + 27 * s, g, 28 * s, s);
    block(x, g - 30 * s, 55 * s, 30 * s, c, t);
    for (let k = 0; k < 4; k++) RR(x + (5 + k * 12) * s, g - 24 * s, 8 * s, 14 * s, 2 * s, t(shade(c)));   // 손잡이 구멍
    R(x, g - 30 * s, 55 * s, Math.max(.6, 1.5 * s), t(mix(c, '#ffffff', .3)));
  } },
  plasticChair: { w: 50, h: 80, d: (x, g, s, r, t) => {
    const c = r < .5 ? '#f4f1ea' : '#6fae7f', d = t(shade(c));
    curvy([[x + 40 * s, g - 45 * s], [x + 44 * s, g - 70 * s, x + 42 * s, g - 82 * s], [x + 50 * s, g - 82 * s], [x + 52 * s, g - 64 * s, x + 47 * s, g - 45 * s]], d);
    P([[x + 3 * s, g - 45 * s], [x + 8 * s, g - 45 * s], [x + 4 * s, g], [x, g]], t(c)); P([[x + 40 * s, g - 45 * s], [x + 46 * s, g - 45 * s], [x + 50 * s, g], [x + 45 * s, g]], d);
    RR(x - 2 * s, g - 48 * s, 52 * s, 7 * s, 3 * s, t(c));
    for (let k = 0; k < 3; k++) R(x + 43 * s, g - (75 - k * 8) * s, 5 * s, 3 * s, t(c));
  } },
  parasolTable: { w: 200, h: 235, d: (x, g, s, r, t) => {
    footShadow(x + 100 * s, g, 70 * s, s);
    R(x + 40 * s, g - 72 * s, 120 * s, 5 * s, t('#f4f1ea')); R(x + 97 * s, g - 72 * s, 6 * s, 72 * s, t('#d6d1c6')); R(x + 98 * s, g - 225 * s, 4 * s, 155 * s, t('#a9a4b8'));
    E(x + 100 * s, g - 2 * s, 30 * s, 4 * s, t('#d6d1c6'));
    curvy([[x, g - 198 * s], [x + 40 * s, g - 228 * s, x + 100 * s, g - 236 * s], [x + 160 * s, g - 228 * s, x + 200 * s, g - 198 * s],
      [x + 175 * s, g - 204 * s], [x + 150 * s, g - 198 * s], [x + 125 * s, g - 204 * s], [x + 100 * s, g - 198 * s], [x + 75 * s, g - 204 * s], [x + 50 * s, g - 198 * s], [x + 25 * s, g - 204 * s]], t('#3f9f7f'));
    P([[x + 70 * s, g - 204 * s], [x + 100 * s, g - 236 * s], [x + 130 * s, g - 204 * s]], t('#f4f1ea'));
  } },
  slide: { w: 300, h: 190, d: (x, g, s, r, t) => {
    const post = t('#5f8fb0');
    footShadow(x + 150 * s, g, 150 * s, s);
    R(x, g - 180 * s, 8 * s, 180 * s, post); R(x + 60 * s, g - 180 * s, 8 * s, 180 * s, post);
    for (let k = 1; k < 5; k++) RR(x, g - k * 36 * s, 68 * s, 5 * s, 2 * s, post);
    curvy([[x - 6 * s, g - 186 * s], [x + 34 * s, g - 230 * s], [x + 76 * s, g - 186 * s]], t('#e98a6d'));   // 지붕
    R(x - 4 * s, g - 190 * s, 76 * s, 10 * s, t('#e98a6d'));
    curvy([[x + 70 * s, g - 186 * s], [x + 200 * s, g - 110 * s, x + 260 * s, g - 22 * s], [x + 300 * s, g - 14 * s], [x + 300 * s, g - 2 * s], [x + 250 * s, g - 8 * s], [x + 190 * s, g - 100 * s, x + 70 * s, g - 170 * s]], t('#f0c27a'));
    curvy([[x + 70 * s, g - 186 * s], [x + 200 * s, g - 110 * s, x + 260 * s, g - 22 * s], [x + 300 * s, g - 14 * s], [x + 300 * s, g - 10 * s], [x + 256 * s, g - 18 * s], [x + 196 * s, g - 106 * s, x + 70 * s, g - 180 * s]], t(shade('#f0c27a')));
  } },
  toilet: { w: 450, h: 320, d: (x, g, s, r, t) => {
    footShadow(x + 210 * s, g, 220 * s, s);
    block(x, g - 300 * s, 420 * s, 300 * s, '#d9cbb8', t);
    lay('brick', s, x, g, 1, () => ctx.fillRect(x, g - 300 * s, 352 * s, 120 * s));
    curvy([[x - 20 * s, g - 296 * s], [x + 210 * s, g - 350 * s], [x + 440 * s, g - 296 * s]], t('#8c7fa8'));
    R(x - 15 * s, g - 302 * s, 450 * s, 10 * s, t(shade('#8c7fa8')));
    [[60, '#7d8fa6'], [230, '#e6765f']].forEach(([dx, c]) => {
      R(x + dx * s, g - 210 * s, 90 * s, 210 * s, t(c)); R(x + (dx + 70) * s, g - 110 * s, 8 * s, 20 * s, t('#f4f1ea'));
      E(x + (dx + 45) * s, g - 240 * s, 16 * s, 16 * s, t(c)); E(x + (dx + 45) * s, g - 244 * s, 5 * s, 5 * s, t('#f4f1ea'));   // 남녀 표지
    });
    for (let k = 0; k < 5; k++) R(x + (330 + k * 14) * s, g - 280 * s, 8 * s, 40 * s, t('#9aa0b4'));   // 환기창 살
  } },
  /* 식당가: 빨간 고무대야 */
  basin: { w: 70, h: 28, d: (x, g, s, r, t) => {
    const c = '#d9584a';
    footShadow(x + 35 * s, g, 34 * s, s);
    P([[x, g - 26 * s], [x + 70 * s, g - 26 * s], [x + 60 * s, g], [x + 10 * s, g]], t(c));
    E(x + 35 * s, g - 26 * s, 36 * s, 4 * s, t(mix(c, '#ffffff', .2))); E(x + 35 * s, g - 26 * s, 31 * s, 2.8 * s, t(r < .5 ? '#cfe3ea' : shade(c)));
    R(x + 46 * s, g - 22 * s, 10 * s, 20 * s, t(shade(c)));
  } },
  /* 장면 소품 */
  feeder: { w: 40, h: 8, d: (x, g, s, r, t) => { E(x + 9 * s, g - 3.5 * s, 9 * s, 3.5 * s, t('#e6765f')); E(x + 30 * s, g - 3.5 * s, 9 * s, 3.5 * s, t('#5f8fb0')); E(x + 9 * s, g - 6 * s, 6 * s, 1.5 * s, t('#b7864f')); E(x + 30 * s, g - 6 * s, 6 * s, 1.5 * s, t('#cfe3ea')); } },
  trapCage: { w: 80, h: 35, d: (x, g, s, r, t) => {
    ctx.strokeStyle = t('#7d8794'); ctx.lineWidth = Math.max(1, .8 * s); ctx.strokeRect(x, g - 35 * s, 80 * s, 35 * s);
    ctx.beginPath(); for (let k = 1; k < 13; k++) { ctx.moveTo(x + k * 6 * s, g - 35 * s); ctx.lineTo(x + k * 6 * s, g); } ctx.stroke();
    E(x + 62 * s, g - 2.5 * s, 5 * s, 2.5 * s, t('#cfd6dc'));
  } },
  styroHouse: { w: 60, h: 45, d: (x, g, s, r, t) => { block(x, g - 45 * s, 60 * s, 45 * s, '#fbfaf5', t); E(x + 22 * s, g - 18 * s, 10 * s, 12 * s, t('#3a3445')); } },
  carrier: { w: 55, h: 46, d: (x, g, s, r, t) => {
    block(x, g - 38 * s, 55 * s, 38 * s, '#8fb8a8', t); R(x + 44 * s, g - 34 * s, 9 * s, 30 * s, t('#3f4a48')); R(x + 15 * s, g - 46 * s, 25 * s, 5 * s, t('#3f4a48'));
  } },
  foodBin: { w: 45, h: 55, d: (x, g, s, r, t) => {
    footShadow(x + 22 * s, g, 24 * s, s);
    block(x, g - 50 * s, 45 * s, 50 * s, '#7a9a55', t); RR(x - 2 * s, g - 55 * s, 49 * s, 7 * s, 2 * s, t('#5f7d42'));
    R(x + 8 * s, g - 34 * s, 22 * s, 10 * s, t('#f4f1ea')); E(x + 6 * s, g - 2 * s, 4 * s, 4 * s, t('#2f2a3a'));
    ctx.globalAlpha = .25; E(x + 22 * s, g - 10 * s, 16 * s, 6 * s, t('#5a4e2e')); ctx.globalAlpha = 1;   // 흘러내린 국물 자국
  } },
};
