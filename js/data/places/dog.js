/* 들개 전용 배경. 키는 'dog' 접두어로 시작한다 (예: 'dogRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다
   - dogRedevelop 재개발 골목: 반쯤 헐린 빌라와 파란 방수포 지붕, 멀리 타워크레인. 바닥엔 벽돌 잔해, 공사 가림막
   - dogJunkyard 고물상 마당: 압축 폐지 더미, 고철 더미, 리어카가 줄 서는 시멘트 마당 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  dogRedevelop: {
    name: '재개발 골목', area: '주택가', salt: 41, floor: 'asphalt', far: 'dogRuins', fg: 'curb', glow: '#f2a03d',
    items: { s: ['pebble', 'butt', 'leaf'], m: ['dogRubble', 'trashbag', 'pot'], l: ['dogFence', 'pole'] },
    pal: { skyTop: '#8fb0cf', skyMid: '#d3d6d8', skyBottom: '#f4dcc0', sun: '#fff4de', sunGlow: '#ffe9c6', far1: '#a7a6b4', far2: '#8d8a9c',
      wall: '#cdb8a4', wallAlt: '#c3ad98', wallShade: '#958a86', ceiling: '#6f6878', ground: '#8a8282',
      groundTop: '#a9a19e', ink: '#3b3440', light: '#fff6ea', glass: '#9fb6c8', accent: '#d9534f' },
  },
  dogJunkyard: {
    name: '고물상 마당', area: '도심', salt: 42, floor: 'paver', far: 'city', fg: 'curb', glow: '#f2a03d',
    items: { s: ['cap', 'pebble', 'butt'], m: ['dogBale', 'cardboard', 'crate'], l: ['dogScrap', 'pole'] },
    pal: { skyTop: '#93b4cf', skyMid: '#d6dbdb', skyBottom: '#f3dfc4', sun: '#fff6e2', sunGlow: '#fff0cc', far1: '#a4adbb', far2: '#8995a6',
      wall: '#d2c6b4', wallAlt: '#c8bba8', wallShade: '#8f8a8c', ceiling: '#7a7680', ground: '#93908e',
      groundTop: '#b3afab', ink: '#36343e', light: '#fffaf0', glass: '#a9cbd6', accent: '#3f6fa8' },
  },
}, () => {
  const TARP = '#5f8fc4', BRICK = '#b36b4f', FENCE = '#e6e3dc', STEEL = '#8d8a9c', PAPER = '#d9b27c';

  /* ── 원경: 반쯤 헐린 빌라 줄. 지붕을 방수포로 덮은 집, 위가 깨져 나간 집 ── */
  function ruinNear(f, x, i, maxH, c0) {
    const { g } = f, bw = 80 + hash(i, 132) * 44, bh = maxH * (.42 + .45 * hash(i, 133)), top = g - bh, face = bw * .82;
    const c = mix(c0, fogC(['#c47468', '#e9dcc6', '#9aa0b4'][Math.floor(hash(i, 134) * 3)]), .2);
    const kind = hash(i, 135);
    if (kind < .35) {   // 위가 깨져 나간 집: 들쭉날쭉한 윗선
      P([[x, g], [x, top + bh * .25], [x + bw * .2, top + bh * .1], [x + bw * .34, top + bh * .3], [x + bw * .55, top], [x + bw * .7, top + bh * .22], [x + bw, top + bh * .15], [x + bw, g]], c);
      P([[x + bw * .82, g], [x + bw * .82, top + bh * .2], [x + bw, top + bh * .15], [x + bw, g]], mix(shade(c), c, fog.amt));
      R(x + face * .2, top + bh * .5, face * .24, bh * .14, mix(c, fogC('#3b3049'), .45));     // 뻥 뚫린 창
      return;
    }
    farBody(x, top, bw, bh, c);
    for (let fl = 0, y = top + 10; y < g - 14; y += 18, fl++) [.12, .54].forEach((u) => R(x + face * u, y, face * .26, 8, mix(c, fogC('#3b3049'), .32)));
    if (kind < .7) {   // 방수포 지붕
      const tp = mix(c, fogC(TARP), .55);
      P([[x - 4, top + 3], [x + bw * .3, top - 10], [x + bw * .75, top - 8], [x + bw + 4, top + 4]], tp);
      P([[x + bw * .75, top - 8], [x + bw + 4, top + 4], [x + bw * .6, top + 2]], mix(shade(tp), tp, fog.amt));
    } else R(x - 2, top - 3, face + 4, 3, mix(c, fogC('#ffffff'), .2));
  }

  /** 멀리 선 타워크레인: 기둥, 긴 팔, 뒤쪽 짧은 팔과 평형추 */
  function crane(x, g, h, c) {
    const top = g - h, jibL = h * .9, back = h * .3;
    R(x - 2, top, 4, h, c);
    R(x - back, top, back + jibL, 3, c);
    P([[x - 2, top], [x + 2, top], [x, top - h * .1]], c);
    L(x, top - h * .1, x + jibL * .7, top + 1, c, .8); L(x, top - h * .1, x - back, top + 1, c, .8);
    R(x - back, top + 2, back * .28, 6, c);
    L(x + jibL * .55, top + 3, x + jibL * .55, top + h * .3, c, .6);
  }

  Object.assign(FAR, {
    dogRuins: { a: { cell: 100, h: .6, draw: villaFar }, b: { cell: 140, h: .42, draw: ruinNear },
      near(f, off, c) {
        const cell = 900, i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
        for (let i = i0; i <= i1; i++) if (hash(i, 141) < .7) crane(i * cell - off + hash(i, 142) * 300, f.g, f.g * (.5 + hash(i, 143) * .25), c);
        lowWall(f, off, mix(c, fogC(FENCE), .4), f.g * .07);
      } },
  });

  Object.assign(ITEMS, {
    /* 헐린 집에서 나온 벽돌·시멘트 더미: 잔해 한 무더기, 굴러 나온 벽돌 두 장, 휜 철근 하나 */
    dogRubble: { w: 130, h: 46, d: (x, g, s, r, t) => {
      const C = planes(t, '#c9c2b6'), B = planes(t, BRICK), heap = [[0, 0], [10, 18, 34, 34], [60, 44], [86, 40, 104, 22], [124, 0]];
      footShadow(x + 62 * s, g, 64 * s, s);
      cut(x, g, s, heap, C.mid);
      within(x, g, s, heap, () => { cut(x, g, s, [[-4, 0], [12, 22, 40, 40], [62, 48], [44, 24, 30, 0]], C.lit); cut(x, g, s, [[70, 50], [100, 30, 130, 0], [76, 0]], C.dark); });
      itemRod(x, g, s, [[62, 30], [70, 50, 84, 52]], t('#8a4a32'), 1.6);
      [[22, 0, -.1], [96, 0, .12]].forEach(([bx, by, a]) => {
        const brick = [[bx, by], [bx + 22, by + a * 20], [bx + 22, by + 9 + a * 20], [bx, by + 9]];
        cut(x, g, s, brick, B.mid);
        cut(x, g, s, [[bx, by + 9], [bx + 22, by + 9 + a * 20], [bx + 25, by + 12 + a * 20], [bx + 3, by + 12]], B.lit);
      });
    } },
    /* 공사 가림막: 흰 철판 패널 한 줄, 볕 받는 윗날, 아래로 갈수록 흙먼지 그늘, 붙인 안내문 하나 */
    dogFence: { w: 420, h: 240, d: (x, g, s, r, t) => {
      const F = planes(t, FENCE), body = [[0, 0], [0, 230], [140, 234], [280, 230], [420, 234], [420, 0]];
      footShadow(x + 210 * s, g, 214 * s, s);
      cut(x, g, s, body, F.mid);
      within(x, g, s, body, () => {
        cut(x, g, s, [[-2, 214], [422, 214], [422, 240], [-2, 240]], F.lit);
        cut(x, g, s, [[-2, -2], [422, -2], [422, 30], [210, 40], [-2, 26]], F.dark);
        [140, 280].forEach((sx) => cut(x, g, s, [[sx - 2, 0], [sx + 2, 0], [sx + 2, 234], [sx - 2, 234]], F.dark));
        cut(x, g, s, [[-2, 150], [422, 150], [422, 166], [-2, 166]], t('#5fa39a'));
      });
      if (r < .6) {
        const nx = 40 + r * 120;
        cut(x, g, s, [[nx, 70], [nx + 50, 70], [nx + 50, 130], [nx, 130]], t('#fffaf0'));
        cut(x, g, s, [[nx, 112], [nx + 50, 112], [nx + 50, 130], [nx, 130]], t('#d9534f'));
      }
    } },
    /* 압축 폐지 더미: 철끈으로 묶은 네모 덩어리. 윗면 볕, 앞면, 그늘진 옆면 */
    dogBale: { w: 120, h: 92, d: (x, g, s, r, t) => {
      const p = planes(t, r < .5 ? PAPER : '#cfc3a8'), w = 96, h = 74, d = 20, dy = 14;
      footShadow(x + 58 * s, g, 60 * s, s);
      cut(x, g, s, [[w, 0], [w + d, dy], [w + d, h + dy], [w, h]], p.dark);
      cut(x, g, s, [[0, 0], [w, 0], [w + 1, h * .5, w, h], [0, h], [-1, h * .5, 0, 0]], p.mid);
      cut(x, g, s, [[0, h], [w, h], [w + d, h + dy], [d, h + dy]], p.lit);
      [[0, h * .32], [0, h * .68]].forEach(([, y]) => cut(x, g, s, [[-1, y], [w, y], [w + d, y + dy], [w + d, y + dy + 2], [w, y + 2], [-1, y + 2]], t('#7d8794')));
    } },
    /* 고철 더미: 찌그러진 철판과 파이프가 쌓인 산 하나, 자전거 바퀴 하나가 비죽 */
    dogScrap: { w: 320, h: 170, d: (x, g, s, r, t) => {
      const K = planes(t, STEEL), heap = [[0, 0], [30, 70, 90, 130], [150, 166], [210, 150, 260, 90], [320, 0]];
      footShadow(x + 160 * s, g, 162 * s, s);
      cut(x, g, s, heap, K.mid);
      within(x, g, s, heap, () => {
        cut(x, g, s, [[-6, 0], [30, 80, 100, 150], [150, 172], [110, 90, 80, 0]], K.lit);
        cut(x, g, s, [[200, 180], [260, 100, 330, 0], [210, 0]], K.dark);
        cut(x, g, s, [[60, 40], [140, 70], [150, 54], [70, 26]], t('#c4565a'));
      });
      itemRod(x, g, s, [[150, 150], [196, 190]], K.lit, 4);
      ctx.strokeStyle = K.deep; ctx.lineWidth = Math.max(1, 3 * s);
      ctx.beginPath(); ctx.arc(x + 236 * s, g - 110 * s, 30 * s, 0, TAU); ctx.stroke();
    } },
  });
});
