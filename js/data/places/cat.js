/* 길고양이 전용 배경. 키는 'cat' 접두어로 시작한다. 형식은 js/data/scenes.js와 같다.
   서울 언덕 꼭대기 골목이 재개발로 사라지고 아파트가 되기까지:
   - catHillAlley 언덕 골목: 낮은 시멘트 담장 너머로 아랫집 기와지붕이 보이고, 그 뒤로 집들이 언덕을 타고 쌓였다
   - catRooftop 옥상: 초록 방수 바닥, 장독, 스티로폼 텃밭
   - catRedevelop 이주가 시작된 골목: 같은 담장에 빨간 '공가' 글씨, 지붕이 내려앉은 빈집
   - catEmptyRoom 빈집 안방: 누런 벽지, 뜯긴 자리, 장판
   - catDemolition 철거 현장: 벽돌 부스러기, 반쯤 헐린 집들, 멀리 타워크레인
   - catSiteFence 공사장 가림막 앞 인도
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  catHillAlley: {
    name: '언덕 골목', area: '주택가', salt: 41, floor: 'catCement', far: 'catHillside', fg: 'curb', glow: '#f2a03d',
    wall: { style: 'catDamjang', h: 62 },
    items: { s: ['leaf', 'cap', 'butt'], m: ['catPepperPot', 'catYeontanStack', 'pot'], l: ['pole'] },
    pal: { skyTop: '#86b4d6', skyMid: '#d3e2e2', skyBottom: '#f6dcbd', sun: '#fff4dc', sunGlow: '#ffe6bf', far1: '#b2a9b8', far2: '#968ca6',
      wall: '#ddd3c2', wallAlt: '#d3c8b4', wallShade: '#a39887', ceiling: '#7b7280', ground: '#a19a8f',
      groundTop: '#c2bbae', ink: '#3d3540', light: '#fff8ec', glass: '#a9c4d0', accent: '#4f86b8' },
  },
  catRooftop: {
    name: '옥상', area: '주택가', salt: 42, floor: 'catCement', far: 'catHillside', fg: 'curb',
    wall: { style: 'catDamjang', h: 40, roof: true },
    items: { s: ['leaf', 'pebble', 'feather'], m: ['catJangdok', 'catPepperPot', 'catJangdok'], l: ['catClothesline'] },
    dens: { m: .7 },
    pal: { skyTop: '#7fb7dc', skyMid: '#cfe4e6', skyBottom: '#f7e6c4', sun: '#fff7e0', sunGlow: '#fff0c8', far1: '#b4adbd', far2: '#988fa9',
      wall: '#d9d2c4', wallAlt: '#cfc6b4', wallShade: '#a39887', ceiling: '#7b7280', ground: '#5f9a7c',
      groundTop: '#7fb397', ink: '#2f4440', light: '#fffbea', glass: '#a9c4d0', accent: '#e0694c' },
  },
  catRedevelop: {
    name: '이주가 시작된 골목', area: '주택가', salt: 43, floor: 'catCement', far: 'catHillside', fg: 'curb', glow: '#f2c46d',
    wall: { style: 'catDamjang', h: 62, empty: true },
    items: { s: ['leaf', 'butt', 'pebble'], m: ['catRubblePile', 'trashbag', 'catYeontanStack'], l: ['pole'] },
    pal: { skyTop: '#9fb2c6', skyMid: '#d6d9d6', skyBottom: '#ecdcc4', sun: '#fff4e0', sunGlow: '#fbe9cc', far1: '#b0a8b2', far2: '#958c9e',
      wall: '#d4cbbb', wallAlt: '#c9bfad', wallShade: '#9a8f80', ceiling: '#6f6875', ground: '#98928a',
      groundTop: '#b8b2a8', ink: '#3a343c', light: '#fbf4e8', glass: '#9fb4bf', accent: '#5f7f9e' },
  },
  catEmptyRoom: {
    name: '빈집 안방', area: '주택가', salt: 44, floor: 'catJangpan', indoor: true, ceiling: 230, glow: '#cfd8ff',
    wall: { pattern: 'plain', run: 'catEmptyWall' }, dens: { m: .4, l: .2 },
    items: { s: ['crumb', 'pebble', 'leaf'], m: ['box', 'cushion'], l: ['tvstand'] },
    pal: { skyTop: '#e6d6b0', skyBottom: '#eadcb8', sun: '#fff6e0', far1: '#c9d6de', far2: '#aebfcb',
      wall: '#e6d6b0', wallAlt: '#dcc9a0', wallShade: '#b8a47e', ceiling: '#ddd0b2', ground: '#d9a75e',
      groundTop: '#e8bd78', ink: '#4a3a32', light: '#fff8e8', glass: '#b5ccd6', accent: '#8a9a7a' },
  },
  catDemolition: {
    name: '철거 현장', area: '주택가', salt: 45, floor: 'catCement', deco: 'catRubble', far: 'catCranes', fg: 'curb',
    items: { s: ['pebble', 'cap', 'leaf'], m: ['catRubblePile', 'catRubblePile', 'trashbag'], l: ['catRubblePile'] },
    pal: { skyTop: '#a7b6c4', skyMid: '#dad9d2', skyBottom: '#eadfcb', sun: '#fff6e6', sunGlow: '#f6ead2', far1: '#b7b1b4', far2: '#9b949e',
      wall: '#cfc6b8', wallAlt: '#c4baa9', wallShade: '#958b7e', ceiling: '#6f6875', ground: '#a29a8c',
      groundTop: '#c1b8a8', ink: '#3b3538', light: '#fbf6ec', glass: '#a9bcc6', accent: '#e8a03d' },
  },
  catSiteFence: {
    name: '공사장 가림막', area: '주택가', salt: 46, floor: 'paver', far: 'catCranes', fg: 'curb', glow: '#ffe2a8',
    wall: { style: 'catHoarding', h: 240 },
    items: { s: ['butt', 'cap', 'leaf'], m: ['catCone', 'bin', 'catCone'], l: ['pole'] },
    pal: { skyTop: '#8fb0cf', skyMid: '#d2dee2', skyBottom: '#f1e2c8', sun: '#fff6e2', sunGlow: '#fbecd0', far1: '#aab2bf', far2: '#8e98a8',
      wall: '#eef0ea', wallAlt: '#e3e8df', wallShade: '#a9b2a8', ceiling: '#7f8a97', ground: '#8d8f94',
      groundTop: '#adafb4', ink: '#363a44', light: '#fffdf5', glass: '#b9d2dc', accent: '#3f8f6f' },
  },
}, () => {
  const STONE = '#c9c2b6', TILE_ROOF = '#6f7488', SLAB = '#7fae92', BRICK = '#b8735c', TIN = '#5f86ad', CROSS = '#ff5f6d';

  /* ── 먼 풍경 ── */
  const HOUSE_TINTS = Object.freeze(['#e9dcc6', '#d9b27c', '#c47468', '#9aa0b4', '#e9dcc6', '#b9c9a8']);
  /** 맨 뒤: 언덕 하나를 빽빽이 덮은 작은 집들. 집마다 벽색이 조금씩 다르고 지붕은 어둡다, 밤엔 창 몇 개 */
  function hillFar(f, x, i, maxH, c) {
    const foot = (n) => f.g - maxH * (.42 + .24 * Math.sin(n * .07) + .08 * Math.sin(n * .29 + 1)), base = foot(i);
    P([[x - 1, base], [x + 16, foot(i + 1)], [x + 16, f.g], [x - 1, f.g]], c);
    [[0, 0], [6, -9]].forEach(([dx, dy], n) => {
      const k = i * 2 + n, bw = 9 + hash(k, 301) * 6, bh = 6 + hash(k, 302) * 6, top = base + dy - bh;
      const wall = mix(c, fogC(HOUSE_TINTS[Math.floor(hash(k, 305) * HOUSE_TINTS.length)]), .3);
      R(x + dx, top, bw, bh + 2, wall); R(x + dx + bw * .75, top, bw * .25, bh + 2, mix(wall, fogC('#3b3049'), .12));
      const roof = mix(c, fogC(hash(k, 306) > .5 ? TILE_ROOF : SLAB), .35);
      if (hash(k, 303) > .45) P([[x + dx - 1.5, top + .5], [x + dx + bw / 2, top - 4], [x + dx + bw + 1.5, top + .5]], roof);
      else R(x + dx - .5, top - 1.5, bw + 1, 1.8, roof);
      if (f.v.night && hash(k, 304) < .3) { ctx.globalAlpha = .75; R(x + dx + bw * .3, top + 2, 2.4, 2, LIT); ctx.globalAlpha = 1; }
    });
  }

  /** 가운데: 언덕 아랫자락 집들. 2~3층 몸통 + 그늘 면, 기와 또는 초록 옥상, 가끔 교회 십자가 */
  function hillNear(f, x, i, maxH, c0) {
    const { g, v } = f, foot = (n) => g - maxH * (.4 + .14 * Math.sin(n * .23)), base = foot(i) - 4 * hash(i, 310);
    const bw = 30 + hash(i, 311) * 22, bh = 16 + hash(i, 312) * 20, top = base - bh;
    P([[x - 1, foot(i)], [x + 57, foot(i + 1)], [x + 57, g], [x - 1, g]], mix(c0, fogC('#7f9a7c'), .25));   // 언덕 자락
    const c = mix(c0, fogC(['#d9b27c', '#e9dcc6', '#c47468', '#9aa0b4', '#e9dcc6'][Math.floor(hash(i, 313) * 5)]), .22);
    farBody(x, top, bw, bh + 1, c, .22);
    const glassC = mix(c, fogC('#3b3049'), .32);
    for (let y = top + 5, r = 0; y < base - 4; y += 9, r++) {
      [.14, .52].forEach((u, n) => R(x + bw * u, y, bw * .2, 4, v.night && hash(i * 7 + r * 2 + n, 314) < .3 ? LIT : glassC));
    }
    if (hash(i, 315) < .55) {                                                                       // 기와: 처마 끝이 살짝 들린 지붕
      const roof = mix(c, fogC(TILE_ROOF), .65);
      curvy([[x - 5, top + 1.5], [x + bw * .08, top - 2, x + bw * .2, top - 7], [x + bw * .8, top - 7], [x + bw * .92, top - 2, x + bw + 5, top + 1.5]], roof);
    } else {
      R(x - 1, top - 2.5, bw + 2, 2.5, mix(c, fogC(SLAB), .6));                                       // 초록 방수 옥상 턱
      if (hash(i, 316) > .4) { E(x + bw * .25, top - 4, 3, 2.6, mix(c, fogC('#8a5a3e'), .5)); E(x + bw * .38, top - 3.4, 2.2, 2, mix(c, fogC('#8a5a3e'), .5)); }
    }
    if (hash(i, 317) > .88) {                                                                       // 교회 첨탑과 십자가
      const cx = x + bw * .6, ty = top - 22;
      R(cx - 3, ty, 6, 22, c);
      const cc = v.night ? CROSS : mix(c, fogC('#c97b9c'), .4);
      R(cx - .8, ty - 11, 1.6, 10, cc); R(cx - 3.4, ty - 8, 6.8, 1.5, cc);
      if (v.night) { ctx.globalAlpha = .25; E(cx, ty - 6, 8, 8, CROSS); ctx.globalAlpha = 1; }
    }
  }

  /** 철거·공사 쪽 맨 뒤: 새 아파트 골조와 타워크레인 */
  function craneFar(f, x, i, maxH, c) {
    const { g } = f, bw = 80 + hash(i, 321) * 20, bh = maxH * (.5 + .4 * hash(i, 322)), top = g - bh;
    R(x, top, bw, bh, c);
    if (hash(i, 323) > .45) {
      const mx = x + bw * .7, mt = top - maxH * .25;
      R(mx - 1.5, mt, 3, g - mt, c);
      R(mx - bw * .7, mt, bw * 1.2, 2.5, c); R(mx - bw * .5, mt + 2, 8, 5, c);                     // 지브와 평형추
      L(mx, mt - 8, mx - bw * .6, mt, c, .8); L(mx, mt - 8, mx + bw * .5, mt, c, .8); R(mx - 1, mt - 8, 2, 8, c);
    }
    if (!f.v.night) return;
    for (let r = 0; r < 4; r++) if (hash(i * 5 + r, 324) < .3) { ctx.globalAlpha = .7; R(x + 6 + hash(i + r, 325) * bw * .7, top + 10 + r * 12, 4, 2.5, LIT); ctx.globalAlpha = 1; }
  }

  /** 철거 중인 집들: 지붕이 뜯겨 들쭉날쭉한 윗변, 드러난 층 */
  function craneNear(f, x, i, maxH, c0) {
    const { g } = f, bw = 60 + hash(i, 331) * 40, bh = maxH * (.3 + .4 * hash(i, 332)), top = g - bh;
    const c = mix(c0, fogC(['#d9c9b0', '#c9a08a', '#bfb8b0'][Math.floor(hash(i, 333) * 3)]), .2);
    const jag = [0, .2, .35, .5, .7, .85, 1].map((u, k) => [x + bw * u, top + (k % 2 ? 6 + hash(i + k, 334) * 14 : hash(i + k, 335) * 5)]);
    P([[x, g], ...jag, [x + bw, g]], c);
    R(x + bw * .82, top + 10, bw * .18, bh - 10, mix(shade(c), c, fog.amt));
    const hole = mix(c, fogC('#3b3049'), .4);
    for (let y = top + 18; y < g - 10; y += 18) R(x + bw * .12, y, bw * .22, 7, hole);
    if (hash(i, 336) > .6) R(x + bw * .45, top + 16, bw * .3, 2.5, mix(c, fogC('#ffffff'), .25));   // 드러난 바닥판
  }

  Object.assign(FAR, {
    catHillside: { a: { cell: 15, h: .8, draw: hillFar }, b: { cell: 56, h: .5, draw: hillNear },
      near(f, off, c) { poleRow(f, off, c, 300, f.g * .6, true); } },
    catCranes: { a: { cell: 150, h: .6, draw: craneFar }, b: { cell: 110, h: .38, draw: craneNear },
      near(f, off, c) { poleRow(f, off, c, 420, f.g * .55, false); } },
  });

  /* ── 바깥 벽 (cm 기준, x·top은 화면 px) ── */
  /** 낮은 시멘트 담장, 파란 철대문, 담장 너머로 내려다보이는 아랫집 기와지붕. empty면 빨간 '공가' 글씨와 내려앉은 지붕 */
  function damjang(f, x, top, bw, hh, i) {
    const { p, s, g, v, t } = f, { empty, roof } = f.sc.wall, face = hash(i, 22) < .5 ? p.wall : p.wallAlt, full = bw + 20 * s;
    R(x + bw * .9 - 1, top, full - bw * .9 + 1, hh * s, face);                                              // 담장은 옆면 없이 다음 칸까지 잇는다
    lay('catBlock', s, -v.camX * s, g, 1, () => ctx.fillRect(x, top, full, hh * s));
    R(x, top, full, Math.max(2, 6 * s), p.wallShade);
    R(x, g - Math.max(2, 10 * s), full, Math.max(2, 10 * s), mix(p.wallShade, p.ink, .2));
    roofsBeyond(f, x, top, bw, i, empty);
    paper(() => R(x - 4 * s, top - 7 * s, full + 8 * s, 8 * s, mix(p.wall, p.light, .35)), .6);          // 갓돌
    R(x - 4 * s, top + 1 * s, full + 8 * s, 2 * s, p.wallShade);
    if (roof) return;                                                                                          // 옥상 난간: 대문·화분 없이 담만
    gate(f, x + (260 + hash(i, 341) * 200) * s, top, i, empty);
    if (empty) {
      label('공가', x + 640 * s, g - 34 * s, 30 * s, t('#d9473f'));
      L(x + 780 * s, g - 70 * s, x + 840 * s, g - 20 * s, t('#d9473f'), 4 * s); L(x + 840 * s, g - 70 * s, x + 780 * s, g - 20 * s, t('#d9473f'), 4 * s);
    } else if (hash(i, 342) > .4) {
      const px = x + (700 + hash(i, 343) * 200) * s;                                                       // 담장 위 고무 대야 화분
      paper(() => P([[px, top - 7 * s], [px + 34 * s, top - 7 * s], [px + 38 * s, top - 26 * s], [px - 4 * s, top - 26 * s]], t('#d9473f')), .7);
      E(px + 17 * s, top - 26 * s, 21 * s, 4 * s, t(shade('#d9473f')));
      [[6, 18], [17, 26], [28, 20]].forEach(([dx, hgt]) => E(px + dx * s, top - (26 + hgt * .6) * s, 7 * s, hgt * .55 * s, t(['#6a9c78', '#5f8f6c'][dx % 2])));
    }
  }

  /** 담장 너머 아랫집 지붕들 (담장 윗변 위로만 보인다) */
  function roofsBeyond(f, x, top, bw, i, empty) {
    const { s, t } = f;
    [[40, 260, 30], [560, 300, 42]].forEach(([u, w, rise], k) => {
      if (hash(i * 3 + k, 351) < .25) return;
      const rx = x + u * s, rw = w * s, ry = top - 4 * s, h = (rise + hash(i + k, 352) * 20) * s;
      const isSlab = hash(i * 3 + k, 353) > .62;
      if (isSlab) {
        paper(() => R(rx, ry - h * .7, rw, h * .7, t('#e2d6c2')), .5);
        R(rx + rw * .86, ry - h * .7, rw * .14, h * .7, t(shade('#e2d6c2')));
        R(rx - 3 * s, ry - h * .7 - 6 * s, rw + 6 * s, 6 * s, t(SLAB));                                          // 초록 방수 옥상 턱
        [.2, .32].forEach((u2, n) => E(rx + rw * u2, ry - h * .7 - (10 + n * 2) * s, (10 - n * 2) * s, (9 - n) * s, t('#8a5a3e')));   // 장독
        return;
      }
      const roof = planes(t, empty && k ? '#8a8e9a' : TILE_ROOF), sag = empty && k ? h * .35 : 0;
      const shape = [[rx - 14 * s, ry], [rx + rw * .06, ry - h * .2, rx + rw * .16, ry - h + sag], [rx + rw * .5, ry - h + sag * 1.6, rx + rw * .84, ry - h + sag * .2], [rx + rw * .94, ry - h * .2, rx + rw + 14 * s, ry]];
      paper(() => curvy(shape, roof.mid), .6);
      ctx.save(); curvy(shape, roof.mid); ctx.clip();
      R(rx + rw * .55, ry - h - 10 * s, rw * .6, h + 12 * s, roof.dark);                                           // 오른쪽 내림마루 그늘
      ctx.fillStyle = roof.lit;
      for (let k2 = 0; k2 < rw / (16 * s); k2++) ctx.fillRect(rx + k2 * 16 * s, ry - h, 2.5 * s, h);              // 기왓골
      ctx.restore();
      R(rx + rw * .16, ry - h + sag - 3 * s, rw * .68, 5 * s, roof.lit);                                         // 용마루
      if (!empty && hash(i + k, 354) > .5) L(rx + rw * .7, ry - h, rx + rw * .7, ry - h - 50 * s, t('#5f6476'), 1.5 * s);   // TV 안테나
    });
  }

  /** 파란 철대문: 문기둥 둘, 두 짝 문, 문패 */
  function gate(f, gx, top, i, empty) {
    const { s, g, t } = f, gw = 110 * s, gh = g - top + 45 * s, gy = g - gh;
    const post = planes(t, STONE), door = planes(t, empty ? '#7f8fa0' : TIN);
    paper(() => { R(gx - 18 * s, gy - 8 * s, 18 * s, gh + 8 * s, post.mid); R(gx + gw, gy - 8 * s, 18 * s, gh + 8 * s, post.mid); }, .7);
    R(gx - 22 * s, gy - 12 * s, 26 * s, 6 * s, post.lit); R(gx + gw - 4 * s, gy - 12 * s, 26 * s, 6 * s, post.lit);
    R(gx, gy, gw, gh, door.mid);
    R(gx, gy, gw, 14 * s, door.lit);                                                                              // 문 윗살
    R(gx + gw / 2 - 1.5 * s, gy, 3 * s, gh, door.dark);
    for (let k = 1; k < 6; k++) R(gx + (k * gw) / 6, gy + 18 * s, 1.5 * s, gh - 26 * s, door.dark);               // 세로 살
    R(gx + gw * .6, g - 100 * s, 22 * s, 9 * s, t('#fffaf0'));                                                     // 문패
    if (empty) R(gx + gw * .1, g - 120 * s, 40 * s, 30 * s, t('#f4f1ea'));                                          // 이주 안내문
  }

  /** 공사장 가림막: 흰 철판 줄, 초록 띠, 완공 조감도 한 폭과 안내 문구 */
  function hoarding(f, x, top, bw, hh, i) {
    const { p, s, g, t } = f, panel = 92 * s;
    for (let k = 0; k * panel < bw * .9; k++) {
      R(x + k * panel, top, 2 * s, hh * s, p.wallShade);
      if (k % 2) R(x + k * panel, top, panel, hh * s, mix(p.wall, p.wallShade, .12));
    }
    R(x, g - 40 * s, bw * .9, 40 * s, t('#9a9a9a'));                                                              // 밑단 콘크리트 블록
    R(x, top + 26 * s, bw * .9, 22 * s, p.accent);
    R(x, top + 48 * s, bw * .9, 3 * s, mix(p.accent, '#ffffff', .4));
    const ax = x + 120 * s, aw = 520 * s, ay = top + 70 * s, ah = 110 * s;                                          // 완공 조감도
    paper(() => R(ax, ay, aw, ah, t('#bfe0f0')), .5);
    [[.04, .7], [.2, .9], [.38, .78], [.56, .95], [.74, .8]].forEach(([u, k]) => {
      const bx = ax + aw * u, bh2 = ah * k * .8;
      R(bx, ay + ah - bh2, aw * .14, bh2, t('#f4f1ea')); R(bx + aw * .11, ay + ah - bh2, aw * .03, bh2, t('#d6dce4'));
    });
    R(ax, ay + ah - 10 * s, aw, 10 * s, t('#8fc29a'));
    label('살기 좋은 언덕마을', ax + 20 * s, ay + 28 * s, 20 * s, t('#3b3049'));
    label('안전제일', x + 760 * s, top + 44 * s, 18 * s, t('#fffdf5'));
    for (let k = 0; k * 46 * s < bw * .9; k++) E(x + (k * 46 + 20) * s, top + 8 * s, 2 * s, 2 * s, p.wallShade);    // 볼트 줄
  }

  Object.assign(FACADES, { catDamjang: damjang, catHoarding: hoarding });

  /* ── 실내 벽: 빈집 안방 ── */
  RUNS.catEmptyWall = (f) => {
    const { p, s, g, t } = f;
    runCells(f, 520, (x, i) => {
      const torn = mix(p.wall, '#b8b0a2', .55);
      if (hash(i, 361) < .7) paper(() => P([[x + 40 * s, g - 180 * s], [x + 120 * s, g - 186 * s], [x + 130 * s, g - 120 * s], [x + 96 * s, g - 108 * s], [x + 60 * s, g - 126 * s], [x + 36 * s, g - 118 * s]], torn), .3);   // 벽지 뜯긴 자리
      if (hash(i, 362) < .5) {                                                                                    // 걸려 있던 달력
        paper(() => R(x + 220 * s, g - 170 * s, 44 * s, 60 * s, t('#fffaf0')), .6);
        R(x + 220 * s, g - 170 * s, 44 * s, 12 * s, t('#d9473f'));
        L(x + 242 * s, g - 176 * s, x + 242 * s, g - 170 * s, t(p.ink), 1);
      } else {                                                                                                    // 떼어 간 액자 자국
        R(x + 220 * s, g - 168 * s, 52 * s, 40 * s, mix(p.wall, '#ffffff', .25));
      }
      if (hash(i, 363) < .45) {                                                                                   // 문 떼어 간 문틀, 건넌방 어둠
        R(x + 340 * s, g - 200 * s, 96 * s, 200 * s, t('#4a4048'));
        R(x + 334 * s, g - 206 * s, 108 * s, 6 * s, t('#a8845e')); R(x + 334 * s, g - 200 * s, 6 * s, 200 * s, t('#a8845e')); R(x + 436 * s, g - 200 * s, 6 * s, 200 * s, t(shade('#a8845e')));
      }
    });
  };

  /* ── 바닥·벽 재질 ── */
  /** 골목 시멘트 바닥: 빗자루 결, 잔금, 땜질 자국 */
  MATERIALS.catCement = { tw: 80, th: 40, build(gc, k, w, h) {
    speckle(gc, w, h, 260, 381, ['rgba(38,28,52,.16)', 'rgba(255,252,244,.2)'], .08 * k, .3 * k);
    gc.fillStyle = 'rgba(38,28,52,.07)';
    for (let y = 0; y < h; y += 3 * k) gc.fillRect(0, y, w, Math.max(.5, .15 * k));
    gc.fillStyle = 'rgba(38,28,52,.08)'; gc.beginPath(); gc.ellipse(w * .3, h * .55, 9 * k, 4 * k, .1, 0, TAU); gc.fill();
    crack(gc, w * .62, h * .3, k, 383, 8);
  } };
  /** 시멘트 블록 담장: 39×19cm 블록, 줄눈 */
  MATERIALS.catBlock = { tw: 80, th: 40, build(gc, k, w, h) {
    const bw = 40 * k, bh = 20 * k, j = Math.max(1, .8 * k);
    for (let r = 0; r < 2; r++) for (let c = -1; c < 3; c++) {
      const x = c * bw + (r % 2) * bw / 2, y = r * bh, v = hash(c + 4 + r * 5, 385);
      gc.fillStyle = v < .5 ? `rgba(38,28,52,${v * .14})` : `rgba(255,252,244,${(v - .5) * .2})`; gc.fillRect(x, y, bw, bh);
      gc.fillStyle = 'rgba(38,28,52,.22)'; gc.fillRect(x, y, j, bh); gc.fillRect(x, y, bw, j);
    }
    speckle(gc, w, h, 90, 387, ['rgba(38,28,52,.14)', 'rgba(255,252,244,.18)'], .1 * k, .3 * k);
  } };
  MATERIALS.catJangpan = { tw: 60, th: 60, build(gc, k, w, h) {
    gc.fillStyle = 'rgba(38,28,52,.05)'; gc.fillRect(0, 0, w / 2, h / 2); gc.fillRect(w / 2, h / 2, w / 2, h / 2);
    gc.fillStyle = 'rgba(38,28,52,.16)'; gc.fillRect(0, 0, w, Math.max(1, .3 * k)); gc.fillRect(0, 0, Math.max(1, .3 * k), h);
  } };

  FLOOR_DECO.catRubble = (f, y) => {
    const { s, p } = f, ry = Math.min((H - y) * .2, 30 * s);
    decoCells(f, 60, 371, .7, (x, i) => {
      const c = hash(i, 372) < .5 ? mix(BRICK, p.ground, .25) : mix(p.groundTop, '#ffffff', .2), w = (8 + hash(i, 373) * 14) * s, yy = y + hash(i, 374) * ry;
      P([[x, yy + 3 * s], [x + w * .3, yy], [x + w, yy + 1 * s], [x + w * .8, yy + 4 * s]], c);
      P([[x + w * .8, yy + 4 * s], [x + w, yy + 1 * s], [x + w + 2 * s, yy + 3 * s]], shade(c));
    });
  };

  /* ── 사물 (d(x, 지면y, px/cm, 난수, 색조함수)) ──
     scene.js의 itemSprite는 땅 위로 (24px + h의 30%)만큼만 구워 둔다. 그래서 h는 실제 높이를 SPRITE_ROOM으로 나눈 값으로 적는다
     (실제 높이는 각 사물 주석에) */
  const SPRITE_ROOM = .3, tall = (cm) => Math.ceil(cm / SPRITE_ROOM);
  Object.assign(ITEMS, {
    /* 스티로폼 상자 텃밭: 흰 상자 앞면·그늘 옆면, 고추 포기 둘 */
    catPepperPot: { w: 66, h: tall(62), d: (x, g, s, r, t) => {
      const box = planes(t, '#f4f1ea'), leaf = planes(t, '#6a9c78');
      footShadow(x + 32 * s, g, 32 * s, s);
      [[16, 58], [42, 50]].forEach(([cx, h]) => {
        itemRod(x, g, s, [[cx, 20], [cx + 2, h]], leaf.dark, 1.4);
        [[-7, h - 8, -.5], [6, h - 14, .5], [-2, h - 2, 0]].forEach(([dx, y, a]) => { ctx.save(); ctx.translate(x + (cx + dx) * s, g - y * s); ctx.rotate(a); E(0, 0, 6 * s, 3.4 * s, leaf.mid); E(-1 * s, -1 * s, 4 * s, 2 * s, leaf.lit); ctx.restore(); });
        [[3, h - 18], [-4, h - 22]].forEach(([dx, y]) => { ctx.save(); ctx.translate(x + (cx + dx) * s, g - y * s); ctx.rotate(.2); RR(-1.5 * s, 0, 3 * s, 10 * s, 1.5 * s, t(r < .5 ? '#d9473f' : '#5f9a4c')); ctx.restore(); });
      });
      cut(x, g, s, [[54, 0], [62, 5], [62, 29], [54, 24]], box.dark);
      cut(x, g, s, [[0, 0], [54, 0], [54, 24], [0, 24]], box.mid);
      cut(x, g, s, [[0, 24], [54, 24], [62, 29], [8, 29]], t('#7a5a3e'));                                       // 흙
    } },
    /* 장독: 배가 부른 독 하나와 작은 항아리, 뚜껑 */
    catJangdok: { w: 74, h: tall(66), d: (x, g, s, r, t) => {
      const jar = planes(t, '#8a5a3e');
      footShadow(x + 36 * s, g, 36 * s, s);
      [[22, 58, 22], [56, 36, 15]].forEach(([cx, h, rx]) => {
        const body = [[cx - rx * .55, 0], [cx + rx * .55, 0], [cx + rx * 1.05, h * .4, cx + rx * .62, h * .9], [cx - rx * .62, h * .9], [cx - rx * 1.05, h * .4, cx - rx * .55, 0]];
        cut(x, g, s, body, jar.mid);
        within(x, g, s, body, () => { cut(x, g, s, [[cx + rx * .25, -1], [cx + rx * 1.2, -1], [cx + rx * 1.2, h], [cx + rx * .35, h]], jar.dark); cut(x, g, s, [[cx - rx, h * .5], [cx - rx * .55, h * .78], [cx - rx * .3, h * .5]], jar.lit); });
        E(x + cx * s, g - h * .92 * s, rx * .7 * s, rx * .16 * s, jar.lit);                                     // 뚜껑
        E(x + cx * s, g - h * .97 * s, rx * .2 * s, rx * .1 * s, jar.dark);
      });
    } },
    /* 연탄 더미: 까만 새 연탄 위에 다 탄 흰 연탄재 */
    catYeontanStack: { w: 40, h: tall(50), d: (x, g, s, r, t) => {
      footShadow(x + 20 * s, g, 20 * s, s);
      [['#3a3445', 0, 0], ['#3a3445', 16, 2], ['#3a3445', 1, 14], [r < .5 ? '#e9e2d6' : '#d9a78a', 15, 16], ['#e9e2d6', 8, 28]].forEach(([c, dx, y]) => {
        const p = planes(t, c);
        cut(x, g, s, [[dx, y], [dx + 15, y], [dx + 15, y + 14], [dx, y + 14]], p.mid);
        cut(x, g, s, [[dx + 11, y], [dx + 15, y], [dx + 15, y + 14], [dx + 11, y + 14]], p.dark);
        E(x + (dx + 7.5) * s, g - (y + 14) * s, 7.5 * s, 2 * s, p.lit);
        [-3, 0, 3].forEach((k) => E(x + (dx + 7.5 + k) * s, g - (y + 14) * s, .7 * s, .4 * s, p.deep));          // 구멍
      });
    } },
    /* 벽돌과 시멘트 덩이 더미, 삐져나온 철근 */
    catRubblePile: { w: 110, h: tall(62), d: (x, g, s, r, t) => {
      const conc = planes(t, '#c4bcae'), brick = planes(t, BRICK);
      footShadow(x + 55 * s, g, 55 * s, s);
      const heap = [[0, 0], [10, 20, 30, 34], [50, 50, 70, 38], [90, 30, 110, 0]];
      cut(x, g, s, heap, conc.mid);
      within(x, g, s, heap, () => { cut(x, g, s, [[60, -1], [72, 40], [112, 40], [112, -1]], conc.dark); cut(x, g, s, [[4, 6], [20, 26], [44, 40], [40, 32], [20, 20]], conc.lit); });
      [[18, 14, .3], [44, 30, -.2], [70, 20, .5], [86, 8, -.4]].forEach(([cx, y, a], k) => {
        ctx.save(); ctx.translate(x + cx * s, g - y * s); ctx.rotate(a);
        R(-8 * s, -3.5 * s, 16 * s, 7 * s, k % 2 ? brick.dark : brick.mid); R(-8 * s, -3.5 * s, 16 * s, 2 * s, brick.lit);
        ctx.restore();
      });
      itemRod(x, g, s, [[56, 40], [62, 60, 76, 62]], t('#7a5a50'), 1.2);
    } },
    /* 라바콘: 주황 원뿔에 흰 띠 두 줄, 네모 받침 */
    catCone: { w: 36, h: tall(72), d: (x, g, s, r, t) => {
      const o = planes(t, '#ee7a3a'), base = planes(t, '#3b3445');
      footShadow(x + 18 * s, g, 18 * s, s);
      cut(x, g, s, [[0, 0], [36, 0], [36, 5], [0, 5]], base.mid);
      const cone = [[6, 5], [30, 5], [20, 72], [16, 72]];
      cut(x, g, s, cone, o.mid);
      within(x, g, s, cone, () => {
        cut(x, g, s, [[19, 4], [32, 4], [21, 74], [19, 74]], o.dark);
        [[22, 30], [44, 50]].forEach(([y0, y1]) => cut(x, g, s, [[0, y0], [40, y0], [40, y1 - 10], [0, y1 - 10]], t('#fffaf0')));
      });
    } },
    /* 옥상 빨랫줄: 쇠파이프 기둥 둘, 처진 줄에 수건과 양말 */
    catClothesline: { w: 260, h: tall(170), d: (x, g, s, r, t) => {
      const pipe = planes(t, '#9aa0ac');
      [6, 250].forEach((px) => { itemRod(x, g, s, [[px, 0], [px, 168]], pipe.mid, 3.4); itemRod(x, g, s, [[px - 1, 0], [px - 1, 168]], pipe.lit, 1); });
      itemRod(x, g, s, [[6, 160], [128, 140, 250, 160]], t('#f4f1ea'), .6);
      [[40, '#7fb3d9', 34, 40], [90, '#f4f1ea', 40, 48], [150, '#f0c27a', 30, 36], [196, '#e6a3b5', 14, 22]].forEach(([cx, c, w, h], k) => {
        const p = planes(t, c), y = 160 - 20 * Math.sin(((cx - 6) / 244) * Math.PI) * .9;
        cut(x, g, s, [[cx - w / 2, y], [cx + w / 2, y], [cx + w / 2 + 1, y - h], [cx - w / 2 - 1, y - h]], p.mid);
        cut(x, g, s, [[cx + w / 4, y], [cx + w / 2, y], [cx + w / 2 + 1, y - h], [cx + w / 4, y - h]], p.dark);
        [cx - w / 2 + 2, cx + w / 2 - 2].forEach((qx) => cut(x, g, s, [[qx - 1.5, y + 2], [qx + 1.5, y + 2], [qx + 1.5, y - 4], [qx - 1.5, y - 4]], t(k % 2 ? '#ffd56b' : '#5f8fb0')));   // 빨래집게
      });
    } },
  });
});
