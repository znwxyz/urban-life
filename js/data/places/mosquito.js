/* 모기 전용 배경. 키는 'mosquito' 접두어로 시작한다 (예: 'mosquitoRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다
   - mosquitoBasin: 경비실 옆 수돗가의 빨간 고무 대야 안. 바닥이 물이고, 뒤로 대야 안벽, 앞으로 대야 테두리가 보인다
   - mosquitoBooth: 아파트 경비실 안. 노란 장판 바닥, 민트색 페인트 벽, 형광등 빛
   - mosquitoBasement: 아파트 지하 주차장. 초록 에폭시 바닥, 흰 주차선, 회색 콘크리트 벽 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
  mosquitoBasin: {
    name: '경비실 옆 빨간 대야', area: '주택가', salt: 41, floor: 'mosquitoBasinWater', far: 'mosquitoBasin', fg: 'mosquitoBasinRim',
    items: { s: [], m: [], l: [] },
    pal: { skyTop: '#8fc0d6', skyMid: '#d0e4e0', skyBottom: '#f6e6c8', sun: '#fff7e4', sunGlow: '#fff1cc', far1: '#a9b8c4', far2: '#8f9fb0',
      wall: '#d64a3c', wallAlt: '#c94236', wallShade: '#9a2f2a', ceiling: '#8a9a8a', ground: '#a3625a',
      groundTop: '#cf968b', ink: '#4a2428', light: '#fff6ea', glass: '#a9cbd6', accent: '#d8473a' },
  },
  mosquitoBooth: {
    name: '아파트 경비실', area: '주택가', salt: 42, floor: 'mosquitoJangpan', indoor: true, ceiling: 230, glow: '#e4f4ff',
    wall: { pattern: 'plain' }, dens: { s: .25 },
    items: { s: ['crumb'], m: [], l: [] },
    pal: { skyTop: '#d9e4d3', skyBottom: '#c9d8c6', sun: '#fffaf0', far1: '#c9d6de', far2: '#aebfcb',
      wall: '#d3dfcf', wallAlt: '#c9d7c4', wallShade: '#8fa596', ceiling: '#e6eadf', ground: '#c99a52',
      groundTop: '#dcb46c', ink: '#3f3828', light: '#fffbea', glass: '#a9cbd6', accent: '#5f8fb0' },
  },
  mosquitoBasement: {
    name: '지하 주차장', area: '주택가', salt: 43, floor: 'mosquitoEpoxy', deco: 'parkingLines', indoor: true, ceiling: 260, glow: '#e2f5e8',
    wall: { pattern: 'plain' }, dens: { s: .3 },
    items: { s: ['butt', 'pebble'], m: [], l: [] },
    pal: { skyTop: '#c4c8c2', skyBottom: '#b3b8b1', sun: '#f4f8f2', far1: '#b9c4c0', far2: '#9fabab',
      wall: '#c6cac2', wallAlt: '#bcc1b8', wallShade: '#4f8466', ceiling: '#a9ada6', ground: '#4f7f62',
      groundTop: '#6f9e80', ink: '#26332c', light: '#f2f8ee', glass: '#a9cbd6', accent: '#e8c84a' },
  },
}, () => {
  /* 물결이 이는 대야 물: 옅은 물결 고리와 떠다니는 먼지 */
  MATERIALS.mosquitoBasinWater = { tw: 24, th: 24, build(g, k, w, h) {
    g.fillStyle = LIGHT(.06); g.fillRect(0, 0, w, h * .5);
    [[.3, .35, 5], [.75, .7, 4], [.15, .85, 3]].forEach(([u, v, r]) => {
      g.strokeStyle = LIGHT(.22); g.lineWidth = Math.max(1, .18 * k);
      g.beginPath(); g.ellipse(w * u, h * v, r * k, r * k * .3, 0, 0, TAU); g.stroke();
      g.strokeStyle = DARK(.1); g.beginPath(); g.ellipse(w * u, h * v + .3 * k, r * .7 * k, r * .2 * k, 0, 0, TAU); g.stroke();
    });
    speckle(g, w, h, 40, 141, [LIGHT(.3), DARK(.15)], .05 * k, .14 * k);
  } };

  /* 경비실 노란 장판: 은은한 얼룩무늬와 이음매 한 줄 */
  MATERIALS.mosquitoJangpan = { tw: 30, th: 30, build(g, k, w, h) {
    for (let i = 0; i < 18; i++) {
      g.fillStyle = i % 2 ? LIGHT(.08) : DARK(.05);
      g.beginPath(); g.ellipse(hash(i, 151) * w, hash(i, 152) * h, (2 + hash(i, 153) * 4) * k, (1 + hash(i, 154) * 2) * k, hash(i, 155) * 3, 0, TAU); g.fill();
    }
    g.fillStyle = DARK(.18); g.fillRect(0, h * .62, w, Math.max(1, .25 * k));
    g.fillStyle = LIGHT(.25); g.fillRect(0, h * .62 + Math.max(1, .25 * k), w, Math.max(1, .15 * k));
    speckle(g, w, h, 50, 156, [DARK(.12), LIGHT(.2)], .04 * k, .12 * k);
  } };

  /* 지하 주차장 초록 에폭시: 형광등이 길게 비친 자국과 바퀴 자국 */
  MATERIALS.mosquitoEpoxy = { tw: 40, th: 30, build(g, k, w, h) {
    g.fillStyle = LIGHT(.16); g.fillRect(w * .1, h * .3, w * .5, Math.max(1, .5 * k));
    g.fillStyle = LIGHT(.08); g.fillRect(w * .55, h * .72, w * .35, Math.max(1, .4 * k));
    g.strokeStyle = DARK(.12); g.lineWidth = Math.max(1, 1.6 * k);
    g.beginPath(); g.moveTo(0, h * .5); g.quadraticCurveTo(w * .5, h * .42, w, h * .55); g.stroke();
    speckle(g, w, h, 60, 161, [DARK(.15), LIGHT(.18)], .05 * k, .16 * k);
  } };

  /* 대야 안벽이 물 위로 솟은 높이(cm). 할아버지 손끝(mosquito:rimHand)이 이 테두리에 걸린다 */
  const RIM_CM = 2.6;
  /* 대야 안에서 본 먼 풍경: 아파트 위로 대야 안벽이 지평선을 두른다 */
  FAR.mosquitoBasin = { a: FAR.apartments.a, b: FAR.apartments.b,
    near(f, off) {
      const { g, p, s } = f, top = g - Math.min(g * .3, RIM_CM * s), red = mix(p.accent, p.skyBottom, .12);
      ctx.fillStyle = red; ctx.fillRect(0, top, W, g - top + 6);
      ctx.fillStyle = mix(red, p.light, .3); ctx.fillRect(0, top, W, (g - top) * .16);                               // 테두리 윗면 (볕)
      ctx.fillStyle = mix(red, p.ink, .22); ctx.fillRect(0, top + (g - top) * .16, W, (g - top) * .12);                       // 테 밑 그늘
      const gr = ctx.createLinearGradient(0, g - g * .06, 0, g + 6);                                           // 물에 닿는 안벽은 젖어서 어둡다
      gr.addColorStop(0, rgba(p.ink, 0)); gr.addColorStop(1, rgba(p.ink, .28));
      ctx.fillStyle = gr; ctx.fillRect(0, g - g * .06, W, g * .06 + 6);
      for (let x = -mod(off * .4, 260); x < W; x += 260) ctx.fillRect(x, top + (g - top) * .3, 2, (g - top) * .5);          // 사출 이음 자국
    } };

  /* 앞쪽 대야 테두리: 두툼하게 말린 빨간 고무 입술 */
  FG.mosquitoBasinRim = (f, off, fh) => {
    const { p } = f, red = p.accent, y = H - fh * 1.15;
    edgeFill(mix(red, p.ink, .25), y, 1, 41, off * .2);
    edgeFill(red, y + fh * .12, 1, 41, off * .2);
    edgeFill(mix(red, p.light, .35), y - 1, 0, 41, off * .2, y + fh * .14);
    edgeFill(mix(red, p.ink, .35), H - fh * .3, 0, 42, off * .2);
  };
});
