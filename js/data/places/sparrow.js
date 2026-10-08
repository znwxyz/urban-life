/* 참새 전용 배경. 키는 'sparrow' 접두어로 시작한다 (예: 'sparrowRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다
   - sparrowShops 상가 골목: 빌라 1층에 세탁소·김밥집·철물점이 붙은 아침 골목. 참새가 태어난 세탁소 간판이 여기 있다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  sparrowShops: {
    name: '상가 골목', area: '주택가', salt: 41, floor: 'paver', far: 'villas', fg: 'curb', glow: '#ffd9a0',
    wall: { style: 'sparrowShops', h: 900 },
    items: { s: ['crumb', 'butt', 'leaf'], m: ['pot', 'bike', 'plasticChair'], l: ['pole'] },
    pal: { skyTop: '#9cc4dc', skyMid: '#d8e6e2', skyBottom: '#fbe6c6', sun: '#fff7e4', sunGlow: '#ffeec8', far1: '#a8b4c2', far2: '#8e9aab',
      wall: '#e3c9a8', wallAlt: '#d9bc9a', wallShade: '#a88d78', ceiling: '#8f8590', ground: '#a29a94',
      groundTop: '#c2bab2', ink: '#3d3540', light: '#fffaf0', glass: '#b6d2dc', accent: '#4f86b8' },
  },
}, () => {
  /* 가게 셋: 세탁소 · 김밥 · 철물. 반쯤 올린 주름 셔터, 천 차양, 간판 띠 */
  const SHOPS = Object.freeze([
    { name: '행복 세탁', sign: '#f6eedc', text: '#3b3049', awning: '#5f8fb0' },
    { name: '엄마 김밥', sign: '#e6765f', text: '#fffaf0', awning: '#e8c24a' },
    { name: '동네 철물', sign: '#3f9f7f', text: '#fffaf0', awning: '#8d8a9c' },
  ]);
  const SHOP_W = 330, SHOP_H = 280, SHUTTER_UP = .55;

  function shopFront(f, x0, k, shop) {
    const { p, s, g, v } = f, w = SHOP_W * s, x = x0 + 20 * s, top = g - SHOP_H * s;
    paper(() => R(x, top, w - 30 * s, SHOP_H * s - 18 * s, mix(p.wallShade, p.ink, .35)), .5);         // 가게 안 어둠
    const glassTop = top + 60 * s, glassH = (SHOP_H - 80) * s;
    R(x + 8 * s, glassTop, w - 46 * s, glassH, v.night ? mix(p.glass, '#ffe2a8', .5) : mix(p.glass, p.wallShade, .3));
    const shutH = glassH * (k === 0 ? SHUTTER_UP : hash(k, 41) * .4);                                    // 주름 셔터 (세탁소는 반쯤 올림)
    paper(() => R(x + 4 * s, glassTop, w - 38 * s, shutH, mix(p.light, p.wallShade, .5)), .6);
    ctx.fillStyle = mix(p.wallShade, p.ink, .1);
    for (let y = glassTop + 6 * s; y < glassTop + shutH; y += 7 * s) ctx.fillRect(x + 4 * s, y, w - 38 * s, Math.max(1, 1.2 * s));
    paper(() => R(x - 4 * s, top, w - 22 * s, 46 * s, shop.sign), .8);                                  // 간판 띠
    R(x - 4 * s, top + 40 * s, w - 22 * s, 6 * s, mix(shop.sign, p.ink, .25));
    label(shop.name, x + 24 * s, top + 32 * s, 26 * s, shop.text);
    const aw = top + 50 * s;                                                                             // 천 차양: 볕 받는 윗면과 물결 끝단
    paper(() => P([[x - 8 * s, aw], [x + w - 22 * s, aw], [x + w - 10 * s, aw + 30 * s], [x - 20 * s, aw + 30 * s]], shop.awning), .7);
    ctx.fillStyle = mix(shop.awning, p.ink, .25);
    for (let ax = x - 20 * s; ax < x + w - 12 * s; ax += 22 * s) { ctx.beginPath(); ctx.arc(ax + 11 * s, aw + 30 * s, 11 * s, 0, Math.PI); ctx.fill(); }
  }

  FACADES.sparrowShops = (f, x, top, bw, hh, i) => {
    SHOPS.forEach((shop, k) => shopFront(f, x + k * SHOP_W * f.s, k + i * 3, shop));
    windowGrid(f, x, bw * .9, hh, i, { from: 380, step: 260, w: 130, h: 100, gap: 300, bars: true, ac: true });
  };
});
