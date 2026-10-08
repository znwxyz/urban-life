/* 비둘기 전용 배경. 키는 'pigeon' 접두어로 시작한다 (예: 'pigeonRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다
   - pigeonStation: 지하철역 2번 출구 앞 광장 (돌 건물 아래로 내려가는 계단 입구, 초록 노선 표지)
   - pigeonOverpass: 고가도로 밑 (머리 위를 덮은 상판, 버섯 모양 콘크리트 교각)
   - pigeonSubway: 지하철 안 (긴 의자, 깜깜한 창, 손잡이, 스테인리스 기둥) */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  pigeonStation: {
    name: '지하철역 출구 광장', area: '도심', salt: 31, floor: 'paver', deco: 'tactile', far: 'city', fg: 'curb', glow: '#fff1cf',
    wall: { style: 'pigeonExit', h: 900 },
    items: { s: ['butt', 'cap', 'crumb', 'feather'], m: ['bin', 'bench'], l: ['pole', 'tree'] },
    pal: { skyTop: '#8db7d4', skyMid: '#d3e1e6', skyBottom: '#f6e2c6', sun: '#fff7e6', sunGlow: '#fff0d0', far1: '#a7b3c4', far2: '#8c99ad',
      wall: '#d9d0c2', wallAlt: '#cfc6b8', wallShade: '#a39a8e', ceiling: '#7d8794', ground: '#9a958f',
      groundTop: '#bdb8b0', ink: '#383c48', light: '#fffdf5', glass: '#bcd8e2', accent: '#3fa36b' },
  },
  pigeonOverpass: {
    name: '고가도로 밑', area: '도심', salt: 32, floor: 'asphalt', deco: 'manhole', ceiling: 380, far: 'city', fg: 'curb',
    wall: { style: 'pigeonPiers', h: 34 }, dens: { m: .4 },
    items: { s: ['butt', 'leaf', 'cap', 'feather'], m: ['trashbag', 'box'] },
    pal: { skyTop: '#8ea3b8', skyMid: '#c3ccd4', skyBottom: '#e2dcd0', sun: '#f6f2e8', sunGlow: '#efe6d4', far1: '#a0a9b6', far2: '#87919f',
      wall: '#b9b6b0', wallAlt: '#b0ada7', wallShade: '#8a8781', ceiling: '#9a9894', ground: '#6f6e72',
      groundTop: '#8d8c90', ink: '#33343c', light: '#f6f4ee', glass: '#a9c3d0', accent: '#5f9a6a' },
  },
  pigeonSubway: {
    name: '지하철 안', area: '도심', salt: 33, floor: 'tileLight', indoor: true, ceiling: 230, glow: '#e8f2ff',
    wall: { pattern: 'plain', run: 'pigeonSeats' }, dens: { l: .7, m: .3 },
    items: { s: ['crumb', 'cap'], m: ['umbrella', 'shoes'], l: ['pigeonPole'] },
    pal: { skyTop: '#e6ebee', skyBottom: '#eef1f2', sun: '#fafcfc', far1: '#cfd8de', far2: '#b6c2ca',
      wall: '#e4e8ea', wallAlt: '#dadfe2', wallShade: '#b9c1c6', ceiling: '#eef1f2', ground: '#9ea3a8',
      groundTop: '#b7bcc0', ink: '#38404a', light: '#fbfcfc', glass: '#3c4656', accent: '#4f86b8' },
  },
}, () => {
  /* ── 2번 출구: 돌 건물 1층에 뚫린 계단 입구, 유리 지붕, 초록 노선 기둥 표지 ── */
  FACADES.pigeonExit = (f, x, top, bw, hh, i) => {
    const { p, s, g } = f;
    windowGrid(f, x, bw * .9, hh, i, { from: 420, step: 260, w: 170, h: 120, gap: 300 });
    const ox = x + 180 * s, ow = 360 * s, oh = 250 * s, deep = mix(p.wallShade, p.ink, .6);
    paper(() => R(ox - 14 * s, g - oh - 14 * s, ow + 28 * s, oh + 14 * s, mix(p.wall, p.light, .35)), .6);   // 돌 테두리
    R(ox, g - oh, ow, oh, deep);                                                                             // 깜깜한 입구
    const fx0 = ox + ow * .34, fx1 = ox + ow * .66, fy0 = g - oh * .78, fy1 = g - oh * .5;                    // 계단 끝 통로 (멀리 보이는 불빛)
    P([[ox, g - oh], [ox + ow, g - oh], [fx1, fy0], [fx0, fy0]], mix(deep, p.ink, .35));                    // 기울어 내려가는 천장
    P([[ox, g - oh], [fx0, fy0], [fx0, fy1], [ox, g]], mix(deep, p.wall, .25));                             // 왼쪽 벽 (볕 쪽)
    P([[ox + ow, g - oh], [fx1, fy0], [fx1, fy1], [ox + ow, g]], mix(deep, p.ink, .15));                    // 오른쪽 벽
    R(fx0, fy0, fx1 - fx0, fy1 - fy0, mix(p.light, deep, .35));
    const STEPS = 9;
    for (let k = 0; k < STEPS; k++) {                                                                        // 앞 단은 넓고 밝게, 먼 단은 좁고 어둡게
      const u0 = k / STEPS, u1 = (k + 1) / STEPS, y0 = g + (fy1 - g) * u0, y1 = g + (fy1 - g) * u1;
      const l0 = ox + (fx0 - ox) * u0, r0 = ox + ow + (fx1 - ox - ow) * u0, l1 = ox + (fx0 - ox) * u1, r1 = ox + ow + (fx1 - ox - ow) * u1;
      const ym = y0 + (y1 - y0) * .55;
      P([[l0, y0], [r0, y0], [r0 + (r1 - r0) * .55, ym], [l0 + (l1 - l0) * .55, ym]], mix(deep, p.light, .34 - u0 * .26));   // 디딤판
      P([[l0 + (l1 - l0) * .55, ym], [r0 + (r1 - r0) * .55, ym], [r1, y1], [l1, y1]], mix(deep, p.ink, .1 + u0 * .2));       // 챌판
    }
    ctx.strokeStyle = mix(p.wallShade, p.light, .5); ctx.lineWidth = Math.max(1, 3 * s); ctx.lineCap = 'round';   // 벽 따라 내려가는 손잡이
    ctx.beginPath(); ctx.moveTo(ox + 14 * s, g - 90 * s); ctx.lineTo(fx0 + 6 * s, fy1 - 30 * s);
    ctx.moveTo(ox + ow - 14 * s, g - 90 * s); ctx.lineTo(fx1 - 6 * s, fy1 - 30 * s); ctx.stroke();
    paper(() => P([[ox - 40 * s, g - oh - 30 * s], [ox + ow + 40 * s, g - oh - 30 * s], [ox + ow + 60 * s, g - oh + 4 * s], [ox - 20 * s, g - oh + 4 * s]], mix(p.glass, p.light, .3)), .7);   // 유리 지붕
    R(ox - 40 * s, g - oh - 30 * s, ow + 80 * s, Math.max(1, 4 * s), mix(p.wallShade, p.ink, .2));
    const sx = ox + ow + 70 * s;                                                                             // 노선 기둥 표지
    paper(() => RR(sx, g - 330 * s, 54 * s, 210 * s, 6 * s, mix(p.ink, p.wall, .2)), .7);
    R(sx + 4 * s, g - 124 * s, 46 * s, 124 * s, mix(p.wallShade, p.ink, .35));
    E(sx + 27 * s, g - 296 * s, 19 * s, 19 * s, p.accent);
    label('2', sx + 20 * s, g - 287 * s, 26 * s, p.light);
    label('출구', sx + 10 * s, g - 230 * s, 16 * s, p.light);
  };

  /* ── 고가도로 밑: 낮은 중앙분리대 위로 버섯처럼 벌어진 교각이 상판(ceiling)을 받친다. 한 칸(1100cm)에 하나 ── */
  FACADES.pigeonPiers = (f, x, top, bw) => {
    const { p, s, g, sc } = f;
    const H = sc.ceiling, px = x + bw * .35, w = 130;
    const X = (u) => px + u * s, Y = (v) => g - v * s;
    const body = [[0, 0], [w, 0], [w, H - 110], [w + 26, H - 30], [w + 26, H], [-26, H], [-26, H - 30], [0, H - 110]];
    const shape = (pts, c) => { ctx.beginPath(); pts.forEach(([u, v], k) => (k ? ctx.lineTo(X(u), Y(v)) : ctx.moveTo(X(u), Y(v)))); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); };
    paper(() => shape(body, p.wall), .8);
    shape([[w * .72, 0], [w, 0], [w, H - 110], [w + 26, H - 30], [w + 26, H], [w * .72 + 20, H], [w * .72 + 20, H - 30], [w * .72, H - 110]], p.wallShade);   // 그늘 면
    shape([[0, 0], [10, 0], [10, H - 110], [-14, H - 30], [-14, H], [-26, H], [-26, H - 30], [0, H - 110]], mix(p.wall, p.light, .3));                    // 볕 받는 모서리
    shape([[0, 0], [w, 0], [w, 70], [w * .5, 46], [0, 64]], mix(p.wall, p.ink, .18));                                                                  // 밑동 빗물 얼룩
    shape([[-8, 220], [w + 8, 220], [w + 8, 228], [-8, 228]], mix(p.wall, p.light, .35));                                                               // 비둘기가 앉는 턱
  };

  /* ── 지하철 안 스테인리스 기둥 ── */
  ITEMS.pigeonPole = { w: 8, h: 230, d: (x, g, s, r, t) => {
    const p = planes(t, '#c9d0d6');
    cut(x, g, s, [[2, 0], [6, 0], [6, 230], [2, 230]], p.mid);
    cut(x, g, s, [[2, 0], [3.4, 0], [3.4, 230], [2, 230]], p.lit);
    cut(x, g, s, [[5, 0], [6, 0], [6, 230], [5, 230]], p.dark);
    cut(x, g, s, [[0, 0], [8, 0], [8, 2], [0, 2]], p.dark);
  } };

  /* ── 지하철 안 벽: 깜깜한 창 아래 긴 의자, 천장 봉에 매달린 손잡이 ── */
  RUNS.pigeonSeats = (f) => {
    const { p, s, g } = f;
    const steel = mix(p.wall, '#ffffff', .25), seat = p.accent, dark = mix(p.ink, p.wall, .3);
    R(0, g - 112 * s, W, 102 * s, steel);                                                                  // 의자 뒤 벽판
    runCells(f, 210, (x) => {                                                                             // 창: 터널 벽에 스치는 불빛 두 줄
      paper(() => RR(x + 20 * s, g - 200 * s, 170 * s, 82 * s, 8 * s, mix(p.light, p.wall, .5)), .5);
      RR(x + 26 * s, g - 194 * s, 158 * s, 70 * s, 6 * s, p.glass);
      ctx.globalAlpha = .55; R(x + 40 * s, g - 170 * s, 90 * s, Math.max(1, 2 * s), '#f2d79a'); R(x + 90 * s, g - 150 * s, 70 * s, Math.max(1, 1.5 * s), '#f2d79a'); ctx.globalAlpha = 1;
      ctx.globalAlpha = .12; P([[x + 40 * s, g - 124 * s], [x + 80 * s, g - 194 * s], [x + 100 * s, g - 194 * s], [x + 60 * s, g - 124 * s]], '#ffffff'); ctx.globalAlpha = 1;
    });
    paper(() => RR(0, g - 96 * s, W, 44 * s, 6 * s, seat), .8);                                         // 등받이
    R(0, g - 96 * s, W, 6 * s, mix(seat, '#ffffff', .25));
    paper(() => R(0, g - 52 * s, W, 12 * s, mix(seat, '#ffffff', .12)), .9);                            // 앉는 면
    R(0, g - 40 * s, W, 30 * s, mix(seat, p.ink, .35));                                                 // 의자 앞판 그늘
    runCells(f, 210, (x) => R(x + 4 * s, g - 100 * s, 6 * s, 90 * s, mix(steel, p.ink, .15)));          // 칸막이 봉
    R(0, g - 10 * s, W, 10 * s, dark);
    R(0, g - 218 * s, W, Math.max(1, 3 * s), mix(steel, p.ink, .25));                                   // 천장 봉
    runCells(f, 46, (x) => {                                                                              // 손잡이 끈과 고리
      R(x + 20 * s, g - 218 * s, 3 * s, 20 * s, mix(seat, p.light, .3));
      ctx.strokeStyle = mix(p.light, p.ink, .1); ctx.lineWidth = Math.max(1, 2 * s);
      ctx.beginPath(); ctx.moveTo(x + 21.5 * s, g - 198 * s); ctx.lineTo(x + 15 * s, g - 186 * s); ctx.lineTo(x + 28 * s, g - 186 * s); ctx.closePath(); ctx.stroke();
    });
  };
});
