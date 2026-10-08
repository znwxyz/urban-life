/* 실내 사물과 실내 장면 소품. 형식은 items-outdoor.js와 같다 (부엌 쪽 사물은 items-kitchen.js).
   곡선 외곽 하나로 오리고, 왼쪽 위 빛으로 밝은 면·앞면·그늘 면만 나눈다 */
Object.assign(ITEMS, {
  /* 밥알: 한쪽 끝이 뾰족한 낟알 */
  rice: { w: .7, h: .4, d: (x, g, s, r, t) => {
    const p = planes(t, '#f1ecdf');
    formed(x, g, s, [[0, .17], [.04, .38, .4, .42, .6, .31], [.73, .21, .66, .02, .4, 0], [.14, 0, 0, .17]], p, [[-.1, .22], [.2, .5, .6, .4], [.3, .3, -.1, .22]], [[.5, -.1], [.62, .16, .6, .3], [.8, .4], [.8, -.1]]);
  } },
  /* 양파 조각: 휘어진 한 겹, 볕 받는 윗날과 그늘진 잘린 끝 */
  onion: { w: 3, h: .4, d: (x, g, s, r, t) => {
    const p = planes(t, '#efdcb4');
    formed(x, g, s, [[0, .06], [1.5, -.06, 3, .1], [3, .42], [1.5, .2, .1, .4]], p, [[0, .3], [1.5, .1, 3, .32], [3, .5], [0, .5]], [[2.6, -.1], [3.1, -.1], [3.1, .5], [2.85, .5]]);
  } },
  /* 쥐똥: 양끝이 좁은 알갱이 다섯, 윗등만 밝다 */
  dropping: { w: 2, h: .15, d: (x, g, s, r, t) => {
    const p = planes(t, '#2e2420');
    for (let k = 0; k < 5; k++) {
      const a = k * .4 - .02, lift = k % 2 ? .015 : 0;
      formed(x, g, s, [[a, lift + .02], [a + .06, .15, a + .2, .155], [a + .32, .15, a + .36, lift + .03], [a + .2, -.005, a, lift + .02]], p, [[a, .1], [a + .4, .1], [a + .4, .2], [a, .2]], null);
    }
  } },
  /* 소파: 부푼 등받이 두 장, 둥글게 말린 팔걸이(볕 쪽 밝게, 그늘 쪽 어둡게), 앉는 쿠션 윗면 */
  sofa: { w: 220, h: 85, d: (x, g, s, r, t) => {
    const p = planes(t, '#e08a6c'), wood = t('#6b4f3e');
    footShadow(x + 110 * s, g, 108 * s, s);
    [[16, 22], [196, 202]].forEach(([a, b]) => cut(x, g, s, [[a, 0], [b, 0], [b + 1, 9], [a - 1, 9]], wood));   // 다리
    formed(x, g, s, [[10, 40], [9, 70], [10, 82, 24, 83], [100, 84], [107, 84.5, 110, 80], [113, 84.5, 120, 84], [196, 83], [210, 82, 211, 70], [210, 40]], p,
      [[0, 79], [110, 81], [220, 79], [220, 90], [0, 90]], [[0, 30], [220, 30], [220, 44], [0, 44]]);
    cut(x, g, s, [[110, 82], [111.5, 60, 110, 40], [108.5, 60, 110, 82]], p.dark);                       // 등받이 두 장 사이
    cut(x, g, s, [[2, 8], [218, 8], [218, 38], [2, 38]], p.mid);                                        // 앉는 쿠션 앞면
    cut(x, g, s, [[2, 8], [218, 8], [218, 13], [2, 13]], p.dark);
    cut(x, g, s, [[18, 37], [109, 37], [109, 44], [104, 46, 22, 46], [17, 45, 18, 37]], p.lit);          // 쿠션 윗면
    cut(x, g, s, [[111, 37], [202, 37], [203, 45, 198, 46], [116, 46, 111, 44]], p.lit);
    cut(x, g, s, [[109, 13], [111, 13], [111, 40], [109, 40]], p.dark);
    const arm = (a, c, lit) => {
      cut(x, g, s, [[a, 8], [a + 22, 8], [a + 22, 56], [a + 21, 66, a + 11, 66], [a + 1, 66, a, 56]], c);
      cut(x, g, s, [[a, 56], [a + 1, 66, a + 11, 66], [a + 21, 66, a + 22, 56], [a + 11, 60, a, 56]], lit);   // 말린 윗면
    };
    arm(0, p.mid, p.lit); arm(198, p.dark, p.mid);
  } },
  /* TV와 거실장: 위는 밝고 오른쪽 옆면은 그늘진 낮은 장, 얇은 화면에 사선 반사 하나 */
  tvstand: { w: 180, h: 130, d: (x, g, s, r, t) => {
    const p = planes(t, '#c99a6e'), ink = t('#2f2a3a'), inkD = t(shade('#2f2a3a'));
    footShadow(x + 90 * s, g, 90 * s, s);
    [[6, 12], [148, 154]].forEach(([a, b]) => cut(x, g, s, [[a, 0], [b, 0], [b, 7], [a, 7]], p.deep));
    cut(x, g, s, [[160, 6], [178, 9], [178, 44], [160, 42]], p.dark);
    cut(x, g, s, [[0, 6], [160, 6], [160, 42], [0, 42]], p.mid);
    cut(x, g, s, [[-1, 42], [160, 42], [178, 44], [178, 45.5], [17, 45.5]], p.lit);
    cut(x, g, s, [[79.4, 9], [80.6, 9], [80.6, 39], [79.4, 39]], p.deep);                              // 문짝 틈
    cut(x, g, s, [[78, 45], [102, 45], [96, 51], [84, 51]], ink);
    cut(x, g, s, [[160, 50], [163, 52], [163, 128], [160, 130]], inkD);
    cut(x, g, s, [[20, 50], [160, 50], [160, 130], [20, 130]], ink);
    ctx.save(); ctx.globalAlpha = .1; cut(x, g, s, [[42, 130], [78, 130], [44, 50], [20, 50], [20, 74]], t('#ffffff')); ctx.restore();
  } },
  /* 고무나무 화분: 줄기마다 끝이 뾰족한 잎, 잎맥을 따라 볕 쪽 반과 그늘 쪽 반 */
  plant: { w: 60, h: 150, d: (x, g, s, r, t) => {
    const pot = planes(t, '#f4f1ea'), stem = t('#5f7d52');
    footShadow(x + 30 * s, g, 22 * s, s);
    const leaves = [[[30, 92], [30, 149], 7.5, LEAF[1]], [[24, 78], [5, 124], 7, LEAF[3]], [[36, 82], [56, 128], 7, LEAF[3]], [[26, 58], [3, 84], 6.5, LEAF[0]], [[34, 60], [57, 86], 6.5, LEAF[1]]];
    leaves.forEach(([b]) => itemRod(x, g, s, [[30, 38], [30 + (b[0] - 30) * .3, (38 + b[1]) / 2, b[0], b[1]]], stem, 1.2));
    leaves.forEach(([b, tip, w, c]) => {
      const L2 = planes(t, c), h2 = spindleHalves(b, tip, w);
      cut(x, g, s, h2.right, L2.dark); cut(x, g, s, h2.left, L2.lit);
    });
    formed(x, g, s, [[13, 0], [47, 0], [49.5, 18, 51, 36], [9, 36], [10.5, 18, 13, 0]], pot, null, [[41, -1], [43.5, 18, 44, 37], [52, 37], [52, -1]]);
    cut(x, g, s, [[7.5, 34], [52.5, 34], [52.5, 40], [7.5, 40]], pot.lit);
    cut(x, g, s, [[46, 34], [52.5, 34], [52.5, 40], [46, 40]], pot.mid);
  } },
  /* 방석: 네 귀가 뾰족하게 집히고 가운데가 부푼 통통한 사각. 윗면은 밝고 오른쪽 끝은 그늘 */
  cushion: { w: 45, h: 18, d: (x, g, s, r, t) => {
    const p = planes(t, r < .5 ? '#f0c27a' : '#8fb8a8');
    const body = [[-1.5, 0], [22, .6, 46.5, 0], [48.6, 7.5, 46.5, 15], [22, 19.6, -1.5, 15], [-3.6, 7.5, -1.5, 0]];
    formed(x, g, s, body, p, [[-3, 12.4], [12, 9.6, 22, 10], [33, 10.4, 48, 13], [48, 21], [-3, 21]], [[39.5, -1], [44, 8, 41, 19], [50, 19], [50, -1]]);
    cut(x, g, s, [[20.5, 13.2], [22.5, 14.4, 24.5, 13.2], [22.5, 12.4, 20.5, 13.2]], p.dark);           // 가운데 누름
  } },
  /* 현관문: 볕 받는 왼쪽 문틀과 그늘진 오른쪽 문틀, 안으로 들어간 판 두 장, 레버 손잡이 */
  door: { w: 100, h: 210, d: (x, g, s, r, t) => {
    const p = planes(t, '#7d8fa6'), metal = planes(t, '#cfcad8');
    cut(x, g, s, [[-5, 0], [105, 0], [105, 214], [-5, 214]], p.dark);                                  // 문틀
    cut(x, g, s, [[-5, 0], [0, 0], [0, 210], [-5, 214]], p.lit);
    cut(x, g, s, [[0, 0], [100, 0], [100, 210], [0, 210]], p.mid);
    [[14, 130, 86, 196], [14, 18, 86, 104]].forEach(([x0, y0, x1, y1]) => {                             // 들어간 판: 윗·왼쪽 날은 그늘, 아래·오른쪽 날은 볕
      cut(x, g, s, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], p.dark);
      cut(x, g, s, [[x0 + 2, y0], [x1, y0], [x1, y1 - 2], [x0 + 2, y1 - 2]], p.lit);
      cut(x, g, s, [[x0 + 2, y0 + 2], [x1 - 2, y0 + 2], [x1 - 2, y1 - 2], [x0 + 2, y1 - 2]], p.mid);
    });
    E(x + 80 * s, g - 112 * s, 4 * s, 4 * s, metal.dark);
    cut(x, g, s, [[66, 110.5], [80, 110.5], [80, 114.5], [66, 113.5]], metal.lit);                       // 레버
  } },
  /* 운동화 한 켤레: 높은 뒤꿈치, 파인 발목, 혀, 앞으로 낮아지는 발등과 흰 밑창. 뒤쪽 한 짝은 그늘 톤 */
  shoes: { w: 60, h: 12, d: (x, g, s, r, t) => {
    const p = planes(t, pick(['#2f2a3a', '#e6765f', '#f4f1ea', '#5f8fb0'], r)), sole = planes(t, '#f4f1ea');
    const shoe = (x0, up, top, so) => {
      cut(x, g, s, [[x0, .2], [x0 + 26, 0], [x0 + 28.6, 1, x0 + 28.6, 3], [x0, 3], [x0 - 1.2, 1.5, x0, .2]], so);
      const upper = [[x0 + .4, 2.8], [x0 - .6, 7, x0 + .8, 10], [x0 + 3, 10.2], [x0 + 6, 8.2, x0 + 9, 8.4], [x0 + 11.5, 10.6], [x0 + 13, 10.2], [x0 + 15, 7.6, x0 + 21, 6.2], [x0 + 27, 5.2, x0 + 28.5, 3], [x0 + 28.5, 2.8]];
      cut(x, g, s, upper, up);
      within(x, g, s, upper, () => cut(x, g, s, [[x0 - 2, 8], [x0 + 12, 7.4], [x0 + 20, 5.6], [x0 + 30, 4.4], [x0 + 30, 12], [x0 - 2, 12]], top));
      cut(x, g, s, [[x0 + 2.6, 9.8], [x0 + 6, 7.4, x0 + 9.4, 8.3], [x0 + 6, 9.2, x0 + 2.6, 9.8]], p.deep);   // 발목 구멍
    };
    shoe(30, p.dark, p.mid, sole.dark);
    shoe(1, p.mid, p.lit, sole.lit);
  } },
  /* 접은 우산: 끝이 땅에 닿고, 천이 아래쪽에서 부풀었다 위로 좁아진다. 묶음 띠와 J자 손잡이 */
  umbrella: { w: 18, h: 90, d: (x, g, s, r, t) => {
    const p = planes(t, '#5f8fb0'), h2 = spindleHalves([3.4, 4], [14.5, 70], 4.6, .3);
    itemRod(x, g, s, [[14, 68], [16.6, 82], [17.4, 88, 13.6, 88.5], [11.4, 88, 11.2, 85.4]], t('#6b4f3e'), 2.2);   // 손잡이
    cut(x, g, s, h2.right, p.mid); cut(x, g, s, h2.left, p.lit);
    cut(x, g, s, [[5.6, 31], [11.6, 31.6], [12, 34], [6, 33.6]], p.dark);                               // 묶음 띠
    itemRod(x, g, s, [[3.6, 4.4], [2.4, 0]], t('#3a3445'), 1);
  } },
  /* 장면 소품 */
  baitStation: { w: 5, h: 1.2, d: (x, g, s, r, t) => {
    const p = planes(t, '#ece8de'), hole = t('#4a4550');
    cut(x, g, s, [[4.6, 0], [5, .1], [5, .9], [4.6, .82]], p.dark);
    cut(x, g, s, [[0, 0], [4.6, 0], [4.6, .84], [0, .84]], p.mid);
    cut(x, g, s, [[-.1, .82], [4.7, .82], [4.9, .95], [4.5, 1.22], [.3, 1.22]], p.lit);                // 비스듬한 뚜껑
    [.3, 3.7].forEach((hx) => cut(x, g, s, [[hx, 0], [hx, .4], [hx + .1, .66, hx + .3, .66], [hx + .5, .66, hx + .6, .4], [hx + .6, 0]], hole));
  } },
  /* 배달 봉투: 그릇이 든 네모진 몸통, 묶은 손잡이 귀 둘, 휘어 붙은 빨간 띠 */
  deliveryBag: { w: 40, h: 38, d: (x, g, s, r, t) => {
    const p = planes(t, '#ece8df'), red = planes(t, '#e6765f');
    footShadow(x + 20 * s, g, 20 * s, s);
    cut(x, g, s, [[17, 29], [13, 33, 12, 37], [15, 38.5, 18, 36], [20, 33], [22, 36], [25, 38.5, 28, 37], [27, 33, 23, 29]], p.dark);   // 묶은 귀
    const body = [[4, 0], [36, 0], [40.5, 12, 38.5, 27], [33, 31, 20, 31], [7, 31, 1.5, 27], [-.5, 12, 4, 0]];
    formed(x, g, s, body, p, [[-2, 20], [4, 26, 14, 32], [-2, 34]], [[31, -1], [35, 12, 33, 32], [42, 32], [42, -1]]);
    const band = [[-2, 14], [20, 12.6, 42, 14], [42, 18.4], [20, 17, -2, 18.4]], shadeSide = [[31, -1], [35, 12, 33, 32], [42, 32], [42, -1]];
    within(x, g, s, body, () => { cut(x, g, s, band, red.mid); within(x, g, s, shadeSide, () => cut(x, g, s, band, red.dark)); });
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
