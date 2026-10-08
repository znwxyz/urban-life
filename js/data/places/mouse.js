/* 생쥐 전용 배경. 키는 'mouse' 접두어로 시작한다 (예: 'mouseRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  /* 반지하 방: 누렇게 바랜 꽃무늬 벽지, 노란 장판, 앉은뱅이 밥상과 방석. 생쥐 눈높이에선 벽 아래쪽과 장판만 보인다 */
  mouseBanjiha: {
    name: '반지하 방', area: '주택가', salt: 21, floor: 'mouseLinoleum', indoor: true, ceiling: 215, glow: '#ffe2a8',
    wall: { pattern: 'stripe' }, dens: { m: .5 },
    items: { s: ['mouseHull', 'crumb', 'rice'], m: ['mouseLowTable', 'cushion', 'box'], l: [] },
    pal: { skyTop: '#e6dcc2', skyBottom: '#ede4cd', sun: '#fff6df', far1: '#c9d2cf', far2: '#aebab6',
      wall: '#e6dcc2', wallAlt: '#ddd1b3', wallShade: '#b9ab8c', ceiling: '#ddd3bb', ground: '#c99a52',
      groundTop: '#ddb36b', ink: '#4a3a2c', light: '#fff9ea', glass: '#b9cfd2', accent: '#8fae9a' },
  },
}, () => {
  /* 노란 장판: 은은한 마름모 눌림 무늬와 바랜 얼룩 */
  MATERIALS.mouseLinoleum = { tw: 48, th: 24, build(g, k, w, h) {
    const cell = 6 * k;
    for (let y = 0; y < h; y += cell) {
      for (let x = (y / cell) % 2 ? cell / 2 : 0; x < w; x += cell) {
        g.fillStyle = LIGHT(.07); g.beginPath();
        g.moveTo(x, y + cell * .5); g.lineTo(x + cell * .5, y); g.lineTo(x + cell, y + cell * .5); g.lineTo(x + cell * .5, y + cell); g.closePath(); g.fill();
      }
    }
    g.fillStyle = DARK(.06); g.beginPath(); g.ellipse(w * .25, h * .6, 5 * k, 2 * k, 0, 0, TAU); g.fill();   // 바랜 얼룩
  } };

  Object.assign(ITEMS, {
    /* 까먹은 해바라기씨 껍질: 갈라진 줄무늬 껍질 반쪽 */
    mouseHull: { w: 1.2, h: .3, d: (x, g, s, r, t) => {
      const p = planes(t, '#4a4448');
      formed(x, g, s, [[0, .05], [.3, .32, .9, .3], [1.2, .2], [.8, 0, 0, .05]], p, [[0, .2], [.6, .4], [1.2, .3], [1.2, .5], [0, .5]], [[.9, -.1], [1.3, -.1], [1.3, .4], [1, .4]]);
      cut(x, g, s, [[.2, .12], [.7, .2], [1, .18], [.7, .14]], t('#e9e2d4'));
    } },
    /* 앉은뱅이 밥상: 둥근 모서리 상판(윗면 볕·앞 테), 접히는 다리 두 쌍 */
    mouseLowTable: { w: 70, h: 30, d: (x, g, s, r, t) => {
      const p = planes(t, '#a8724a');
      footShadow(x + 35 * s, g, 34 * s, s);
      [[5, 9], [61, 65]].forEach(([a, b]) => {
        cut(x, g, s, [[a, 0], [b, 0], [b + .6, 26], [a - .6, 26]], p.dark);
        cut(x, g, s, [[a, 0], [a + 1.4, 0], [a + 1.2, 26], [a - .6, 26]], p.mid);
      });
      cut(x, g, s, [[-2, 26], [35, 25.4, 72, 26], [74, 27.4, 72, 29], [35, 29.4, -2, 29], [-4, 27.4, -2, 26]], p.mid);   // 앞 테
      cut(x, g, s, [[-1, 29], [35, 29.4, 71, 29], [76, 31, 74, 32], [36, 32.3, 3, 32], [-2, 31, -1, 29]], p.lit);         // 윗면
      cut(x, g, s, [[64, 26], [72, 26], [74, 27.4, 72, 29], [64, 29]], p.dark);
    } },
  });
});
