/* 바퀴벌레 전용 배경. 키는 'cockroach' 접두어로 시작한다 (예: 'cockroachRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  /* 분식집 주방: 식당 주방보다 좁고 따뜻하다. 주황 타일 벽, 스테인리스 작업대, 바닥엔 빨간 고추장 통과 양파 망 */
  cockroachBunsik: {
    name: '분식집 주방', area: '도심', salt: 41, floor: 'tileDark', deco: 'drain', indoor: true, ceiling: 230, glow: '#ffb36b',
    wall: { pattern: 'tile', run: 'steelTable' }, dens: { l: .4, m: .7 },
    items: { s: ['crumb', 'rice', 'onion', 'crumb'], m: ['cockroachGochuTub', 'bucket', 'cockroachGochuTub', 'crate'], l: ['stove', 'shelf'] },
    pal: { skyTop: '#f4dcc0', skyBottom: '#f7e6cf', sun: '#fff4e0', far1: '#e6cdb0', far2: '#d4b898',
      wall: '#f2d4b4', wallAlt: '#ecc9a5', wallShade: '#c99e7a', ceiling: '#e6c8a6', ground: '#8f7a70',
      groundTop: '#ad978a', ink: '#4a3430', light: '#fff4e6', glass: '#d6e4e2', accent: '#bcc4c6' },
  },
}, () => {
  /* 빨간 고추장 통: 위로 살짝 벌어진 몸통, 볕 받는 왼쪽, 뚜껑 테와 앞으로 늘어진 손잡이 */
  ITEMS.cockroachGochuTub = { w: 34, h: 36, d: (x, g, s, r, t) => {
    const p = planes(t, '#d9584a'), lid = planes(t, '#c94a3e'), lab = planes(t, '#f6e7c8');
    footShadow(x + 17 * s, g, 17 * s, s);
    formed(x, g, s, [[3, 0], [31, 0], [32.6, 15, 33.4, 29], [17, 30, .6, 29], [1.4, 15, 3, 0]], p,
      [[-1, -1], [-1, 31], [5, 31], [5.6, 15, 7, -1]], [[24, -1], [26, 15, 26.4, 31], [35, 31], [35, -1]]);
    formed(x, g, s, [[5, 9], [29, 9], [29.6, 15, 30, 21], [17, 21.6, 4, 21], [4.4, 15, 5, 9]], lab,
      null, [[23, 8], [24.4, 15, 24.6, 22], [31, 22], [31, 8]]);
    cut(x, g, s, [[13, 12], [21, 12], [21.4, 15, 21.6, 18], [17, 18.3, 12.4, 18], [12.6, 15, 13, 12]], p.mid);   // 상표 가운데 빨간 고추
    cut(x, g, s, [[0, 29], [17, 30.4, 34, 29], [34.2, 32], [17, 33.8, -.2, 32]], lid.mid);
    cut(x, g, s, [[0, 31.4], [17, 33.2, 34.2, 31.4], [33.6, 34], [17, 36, .6, 34]], lid.lit);
    itemRod(x, g, s, [[1, 28], [17, 12, 33, 28]], t('#f4efe6'), .9);
  } };
});
