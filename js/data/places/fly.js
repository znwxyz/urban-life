/* 똥파리 전용 배경. 키는 'fly' 접두어로 시작한다 (예: 'flyRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다
   flyJunkyard — 빌라촌 끝 고물상 마당. 다져진 흙바닥에 백구 털과 사료 알갱이, 녹슨 너트가 굴러다니고,
   앞쪽엔 반쯤 묻힌 폐타이어와 잡초가 지나간다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  flyJunkyard: {
    name: '고물상 마당', area: '주택가', salt: 23, floor: 'flyDirt', far: 'villas', fg: 'flyJunk',
    items: { s: ['pebble', 'flyNut', 'flyKibble', 'cap'], m: ['cardboard'] }, dens: { m: .25 },
    pal: { skyTop: '#9ec3d6', skyMid: '#d8e2dc', skyBottom: '#f6e2bf', sun: '#fff6e0', sunGlow: '#fff0c8', far1: '#a8b0b8', far2: '#8e97a3',
      wall: '#c9b8a6', wallAlt: '#bfae9a', wallShade: '#8f8478', ceiling: '#8a8076', ground: '#9a8670',
      groundTop: '#b9a487', ink: '#3d342e', light: '#fff9ec', glass: '#a9cbd6', accent: '#d9823b' },
  },
}, () => {
  const RUST = '#b0673f', STEEL = '#9b958f', KIBBLE = '#9a5f34', TIRE = '#4a434a';

  /* 다져진 흙: 굵은 모래알과 납작한 자갈, 바퀴 자국 */
  MATERIALS.flyDirt = { tw: 40, th: 40, macro: 'flyDirtMacro', build(g, k, w, h) {
    g.fillStyle = DARK(.04); g.fillRect(0, 0, w, h);
    speckle(g, w, h, 420, 41, [DARK(.22), LIGHT(.2), DARK(.12)], .1 * k, .4 * k);
    speckle(g, w, h, 30, 47, [LIGHT(.3), DARK(.3)], .4 * k, .9 * k);
    g.fillStyle = DARK(.07);
    for (let i = 0; i < 6; i++) g.fillRect(0, h * (.2 + i * .05), w, Math.max(1, .35 * k));   // 트럭 바퀴 자국
  } };

  /* 파리 눈높이의 흙: 흙 알갱이 사이로 하얀 개털이 휘어 누웠다 */
  MATERIALS.flyDirtMacro = { tw: 6, th: 6, build(g, k, w, h) {
    g.fillStyle = DARK(.05); g.fillRect(0, 0, w, h);
    speckle(g, w, h, 130, 51, [DARK(.24), LIGHT(.22), DARK(.12)], .04 * k, .16 * k);
    speckle(g, w, h, 5, 55, [LIGHT(.28), DARK(.3)], .2 * k, .4 * k);
    fiber(g, w * .3, h * .6, 1.6 * k, -.4, .6, Math.max(.5, .025 * k), LIGHT(.4));
  } };

  /* 녹슨 육각 너트: 납작하게 누워 옆 세 면과 윗면 구멍이 보인다 */
  ITEMS.flyNut = { w: 1.8, h: .8, d: (x, g, s, r, t) => {
    const p = planes(t, r < .5 ? RUST : STEEL);
    footShadow(x + .9 * s, g, .9 * s, s);
    cut(x, g, s, [[0, .05], [.15, .5], [.5, .5], [.5, .05]], p.lit);
    cut(x, g, s, [[.5, .05], [.5, .5], [1.3, .5], [1.3, .05]], p.mid);
    cut(x, g, s, [[1.3, .05], [1.3, .5], [1.7, .5], [1.8, .05]], p.dark);
    cut(x, g, s, [[.15, .5], [.5, .75], [1.3, .75], [1.7, .5], [1.3, .52], [.5, .52]], p.lit);
    cut(x, g, s, [[.62, .6], [.9, .7, 1.18, .6], [.9, .55, .62, .6]], p.deep);
  } };

  /* 사료 알갱이 두 개: 백구 냄비에서 튀어나온 갈색 도넛 */
  ITEMS.flyKibble = { w: 1.6, h: .6, d: (x, g, s, r, t) => {
    const p = planes(t, KIBBLE);
    [[0, .55], [.8, .48]].forEach(([dx, rr], i) => {
      const body = [[dx, 0], [dx - .04, rr * .9, dx + rr * .5, rr], [dx + rr * 1.1, rr * .9, dx + rr * 1.05, 0]];
      formed(x, g, s, body, p, [[dx - .2, rr * .5], [dx - .2, rr * 1.2], [dx + rr * .5, rr * 1.2], [dx + rr * .3, rr * .6]], [[dx + rr * .6, -.1], [dx + rr * .6, rr * 1.2], [dx + rr * 1.3, rr * 1.2], [dx + rr * 1.3, -.1]]);
      if (!i) cut(x, g, s, [[dx + .18, rr * .62], [dx + .28, rr * .76, dx + .38, rr * .62], [dx + .28, rr * .52, dx + .18, rr * .62]], p.deep);
    });
  } };

  /* 앞 종이: 마당 끝 잡초, 반쯤 묻힌 폐타이어, 녹슨 철근 끝 */
  FG.flyJunk = (f, off, fh) => {
    const { p } = f, dirt = mix(p.ink, p.ground, .45), y = H - fh * .5;
    edgeFill(dirt, y, 2, 7, off);
    const weed = mix(p.ink, '#6a8f5c', .5), tire = mix(p.ink, TIRE, .5), rust = mix(p.ink, RUST, .45);
    const cell = 150, i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
    for (let i = i0; i <= i1; i++) {
      const x = i * cell - off + hash(i, 81) * 60, kind = hash(i, 82);
      if (kind < .14) {
        const r = fh * (.8 + hash(i, 83) * .3);
        ctx.fillStyle = tire; ctx.beginPath(); ctx.arc(x, y + fh * .3, r, Math.PI, 0); ctx.fill();
        ctx.fillStyle = dirt; ctx.beginPath(); ctx.arc(x, y + fh * .3, r * .58, Math.PI, 0); ctx.fill();
        R(x - r * .95, y - r * .45, r * .3, 2, mix(tire, p.light, .2));
      } else if (kind < .24) {
        L(x, H, x + fh * .25, y - fh * .7, rust, Math.max(3, fh * .1));                                // 녹슨 철근 끝
      }
      if (hash(i, 84) < .7) fgTuft(x + 40, y + 2, fh * (.5 + hash(i, 85) * .6), weed, i);
    }
  };
});
