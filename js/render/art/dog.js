/* 들개 장면 전용 그림 + 주인공 들개(ANIMALS.dog). 키는 'dog:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다.
   d(시간, 색조함수). 빛은 왼쪽 위에서 온다: 오른쪽·아래가 그늘, 왼쪽 위 가장자리에 밝은 종이를 한 겹 더 붙인다.
   등장인물은 제자리에서만 움직인다(숨쉬기·깜빡임·귀·꼬리). 걷거나 바퀴가 도는 움직임은 세계가 흐를 때 뒷걸음처럼 보인다 */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.dog = pack.hero; }
})((() => {
  const COATS = Object.freeze({
    hero: { fur: '#dca064', dark: '#b8773f', cream: '#fbefd9', ear: '#f2a7a0' },
    mom: { fur: '#efe4cf', dark: '#cdbb9c', cream: '#fffaf0', ear: '#f2b3ab' },
    black: { fur: '#3d3742', dark: '#29242e', cream: '#c79a62', ear: '#8a5a62' },
    white: { fur: '#f4efe6', dark: '#d6cbb9', cream: '#ffffff', ear: '#f2b3ab' },
    brindle: { fur: '#8a6a4e', dark: '#5f4836', cream: '#e8d3b4', ear: '#c98a7c' },
  });
  const RUST = '#a65a3a', TARP = '#5f8fc4', CEMENT = '#c9c2b6', SNOWC = '#f7fbff', MEAT = '#c4565a';
  const GRANDPA = { top: '#9a9aa4', bottom: '#5a5560', shoe: '#3b3440', hair: '#e4e0e6', hat: '#8a6a5a', vest: '#6b6a52', glove: '#f1ece0' };
  const CART = '#6f8f9a', CART_LEN = 150;

  const at = (x, y, draw) => { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); };
  const faded = (a, draw) => { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, a)); draw(); ctx.restore(); };
  const lite = (c, k = .35) => mix(c, '#ffffff', k);
  /** 글자는 좌우가 뒤집힌 그림(flip)에서도 바로 읽히게 쓴다 */
  function text(str, x, y) {
    if (ctx.getTransform().a >= 0) { ctx.fillText(str, x, y); return; }
    ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.fillText(str, 0, 0); ctx.restore();
  }
  const sized = (k, draw) => { ctx.save(); ctx.scale(k, k); draw(); ctx.restore(); };

  /* 사물 오리기: forms.js의 cut/within을 이 파일 좌표(위가 -y)로 쓴다. 점 형식은 [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
  const up = (pts) => pts.map((p) => p.map((v, i) => (i % 2 ? -v : v)));
  const sheet = (pts, c) => cut(0, 0, 1, up(pts), c);
  const sheetIn = (pts, draw) => within(0, 0, 1, up(pts), draw);
  /** 상자 면 셋: 앞면(x0~x1, 바닥 y0, 높이 h) + 오른쪽 위로 물러나는 윗면(볕)·옆면(그늘). d 깊이 */
  function boxFaces(p, x0, x1, y0, h, d) {
    const dy = d * .6;
    P([[x0, y0 - h], [x1, y0 - h], [x1 + d, y0 - h - dy], [x0 + d, y0 - h - dy]], p.lit);
    P([[x1, y0], [x1 + d, y0 - dy], [x1 + d, y0 - h - dy], [x1, y0 - h]], p.dark);
    P([[x0, y0], [x1, y0], [x1, y0 - h], [x0, y0 - h]], p.mid);
  }

  /** 점들을 부드럽게 잇는 닫힌 곡선 (Catmull-Rom → 베지어). 오린 종이의 둥근 윤곽 */
  function blobPath(pts) {
    const n = pts.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!i) ctx.moveTo(p1[0], p1[1]);
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    ctx.closePath();
  }
  const blob = (pts, c) => { ctx.fillStyle = c; blobPath(pts); ctx.fill(); };
  /** 윤곽 안쪽에만 그늘·무늬를 칠한다 */
  const inside = (pts, draw) => { ctx.save(); blobPath(pts); ctx.clip(); draw(); ctx.restore(); };
  /** 점들을 지나는 열린 곡선(굵은 종이띠) */
  function curve(pts, c, w) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    ctx.stroke();
  }
  /** 감은 눈. up이면 ∩(웃는 눈), 아니면 U(잠든 눈) */
  function shutEye(x, y, r, t, up) {
    ctx.strokeStyle = t(INK); ctx.lineWidth = r * .5; ctx.lineCap = 'round'; ctx.beginPath();
    if (up) ctx.arc(x, y + r * .4, r, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(x, y - r * .4, r, Math.PI * .15, Math.PI * .85);
    ctx.stroke();
  }
  function steam(x, y, h, time, c) {
    faded(.5, () => curve(Array.from({ length: 7 }, (_, i) => [x + Math.sin(i + time * 2.4) * h * .1, y - (i / 6) * h]), c, Math.max(.8, h * .07)));
  }

  /* ───── 개 ───── */
  /* 복슬이 그림체: 오래 떠돌며 길게 자라 뭉친 털을 동글동글한 털뭉치로 그린다. 길고양이 주인공과 같은 비율(큰 머리, 짧은 다리) */
  /** 타원 둘레에 털뭉치(작은 원)를 n개 붙인다 */
  /* 털뭉치는 한 경로로 모아 한 번에 칠한다. 원마다 따로 칠하면 종이 그림자가 겹쳐 비쳐 보인다 */
  function puffPath(cx, cy, rx, ry, n, r) {
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry; ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
  }
  function puffs(cx, cy, rx, ry, n, r, c) { ctx.fillStyle = c; ctx.beginPath(); puffPath(cx, cy, rx, ry, n, r); ctx.fill(); }
  /** 털뭉치로 둘러싼 몸통 한 덩어리 */
  function fluff(cx, cy, rx, ry, n, r, c) {
    ctx.fillStyle = c; ctx.beginPath(); puffPath(cx, cy, rx, ry, n, r);
    ctx.moveTo(cx + rx, cy); ctx.ellipse(cx, cy, rx, ry + r * .2, 0, 0, TAU); ctx.fill();
  }
  /** 그림자 없이 겹쳐 칠하는 무늬(그늘·하이라이트) */
  const flat = (draw) => { ctx.save(); ctx.shadowColor = 'transparent'; draw(); ctx.restore(); };

  /** 들개 한 마리(몸길이 약 55cm). o: { moving, fold 늘어진 귀(false면 조금 선 귀), collar 낡은 목줄, mouth 'open'|'growl', look 고개 숙임, scar, sleepy } */
  function drawDog(time, t, coat, o = {}) {
    const fur = t(coat.fur), dark = t(coat.dark), w = o.moving ? time * 10 : 0;
    const bob = o.moving ? Math.abs(Math.sin(w)) * 1.4 : Math.sin(time * 2) * .45;
    const wag = Math.sin(time * (o.moving ? 12 : 5)) * 2.4;
    // 꼬리: 엉덩이 위 동그란 털뭉치. 살랑살랑
    E(-25 + wag, -36 - bob, 7, 7, fur); faded(.45, () => E(-26.5 + wag, -38.5 - bob, 3.4, 2.6, t(lite(coat.fur, .35))));
    [[-15, 0], [-6, Math.PI], [9, Math.PI], [16, 0]].forEach(([lx, ph], i) => {
      const x = lx + Math.sin(w + ph) * 3 - 4.2;
      RR(x, -12.5, 8.5, 12.5, 4.2, i % 2 ? fur : dark);
      E(x + 4.6, -1.3, 4.4, 1.7, t(i % 2 ? lite(coat.fur, .2) : coat.fur));
    });
    fluff(0, -24 - bob, 21, 11, 12, 6.2, fur);
    flat(() => faded(.3, () => E(2, -16.5 - bob, 15, 3.6, t(shade(coat.fur)))));
    flat(() => faded(.5, () => E(-5, -31.5 - bob, 11, 3, t(lite(coat.fur, .3)))));
    if (o.collar) collar(time, t, 20, -42 - bob);
    drawDogHead(time, t, coat, o, 20, -42 - bob);
  }

  /** 머리(지름 약 28cm). (hx0, hy0)는 머리 가운데 */
  function drawDogHead(time, t, coat, o, hx0, hy0) {
    const fur = t(coat.fur), dark = t(coat.dark), cream = t(coat.cream);
    const twitch = Math.sin(time * 1.7) > .93 ? .16 : 0, perk = o.fold === false ? -.25 : 0;
    at(hx0, hy0 + (o.look || 0), () => {
      ctx.rotate(Math.sin(time * 1.3) * .04 + (o.look ? .18 : 0));
      at(5, -7.5, () => { ctx.rotate(-.35 + perk); E(0, 7.5, 4.5, 9.4, dark); });
      fluff(0, 0, 13, 12, 10, 5, fur);
      flat(() => faded(.4, () => E(-4, -6, 6, 3, t(lite(coat.fur, .35)))));
      E(7.5, 6.2, 8, 5.6, cream);
      flat(() => faded(.35, () => E(8, 10, 5.5, 1.4, t(shade(coat.cream)))));
      if (o.sleepy) { shutEye(-1.9, .4, 2.2, t); shutEye(8.8, -.2, 2.2, t); }
      else { cuteEye(-1.9, 0, 2.7, 2.4, time, t); cuteEye(8.8, -.6, 2.7, 2.4, time, t); }
      // 앞머리: 눈썹 위를 덮은 털뭉치
      puffs(1.2, -8.8, 7.5, 1.9, 6, 4.2, fur);
      if (o.mouth === 'growl') [[-4.5, -4.6], [6, -5.2]].forEach(([x, y], i) => L(x, y + (i ? 0 : -1), x + 3.6, y + (i ? -1 : 0), t(INK), .7));
      at(-10, -5, () => { ctx.rotate(.3 + twitch - perk); E(0, 8.7, 5.6, 11.2, dark); faded(.4, () => E(-1.4, 6, 1.8, 6, t(lite(coat.dark, .25)))); });
      blush(-5.6, 6.4, 2.7, 1.7);
      E(13.1, 3.7, 2.5, 1.9, t(INK)); E(12.4, 3, .8, .5, WHITE);
      if (o.mouth === 'growl') {
        E(9.6, 9.6, 3.8, 2.2, t('#5a2a36'));
        [[7.4, 8.2], [9.6, 8], [11.8, 8.2]].forEach(([x, y]) => P([[x - .8, y], [x + .8, y], [x, y + 1.7]], WHITE));
      } else if (o.mouth === 'open') { E(9.6, 9.2, 2.6, 1.6, t('#7a3b48')); E(9.8, 10.6, 1.8, 2.3, t('#ff8fa3')); }
      else { ctx.strokeStyle = t(INK); ctx.lineWidth = .5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(13, 5.4); ctx.quadraticCurveTo(11.8, 7.4, 9.8, 6.8); ctx.stroke(); }
      if (o.scar) { L(4.6, -6, 8.6, -1, t('#f2d6c4'), .9); L(5.6, -3.8, 7.8, -4.4, t('#f2d6c4'), .6); }
    });
  }

  /** 엄마 목의 낡은 빨간 목줄: 털 속에 반쯤 묻히고, 버클은 녹슬고, 끊어진 끝이 달랑거린다 */
  function collar(time, t, hx0, hy0) {
    const x = hx0 - 9, y = hy0 + 12;
    curve([[x - 5.6, y - 2.4], [x, y + 1.2], [x + 6, y - 1.4]], t('#a8424a'), 3);
    curve([[x - 5.2, y - 3], [x, y + .4], [x + 5.6, y - 2]], t('#d9585f'), 1.1);
    RR(x - 1.4, y - 1.4, 2.8, 3.2, .6, t('#b8a27a')); L(x - 1.4, y + .2, x + 1.4, y + .2, t('#8a5a32'), .4);
    at(x, y + 1.8, () => { ctx.rotate(Math.sin(time * 2.2) * .2); curve([[0, 0], [.6, 3], [-.4, 5.6]], t('#c24b52'), 1.5); [-.4, .4].forEach((dx) => L(dx - .4, 5.4, dx - .9, 7, t('#c24b52'), .4)); });
  }

  /** 둥글게 말고 자는 강아지/개 (길이 약 34cm × k). 털뭉치 빵처럼, 숨쉬며 오르내린다 */
  function curledDog(time, t, coat, k, seed) {
    const br = 1 + Math.sin(time * 1.6 + seed * 2) * .035, fur = t(coat.fur), cream = t(coat.cream);
    ctx.save(); ctx.scale(k, k * br);
    E(-16, -6, 5, 5, fur);
    fluff(-1, -8, 14, 6.5, 10, 4.4, fur);
    flat(() => faded(.3, () => E(0, -2, 13, 2.6, t(shade(coat.fur)))));
    fluff(9, -9, 7, 6.2, 8, 3.2, fur);
    E(13, -6.4, 4.4, 3.2, cream);
    at(4, -10, () => { ctx.rotate(.5); E(0, 4, 3, 5.6, t(coat.dark)); });
    shutEye(9.6, -9.6, 1.5, t);
    puffs(8.6, -14.4, 4, 1.2, 5, 2.4, fur);
    E(16.4, -7.4, 1.3, 1, t(INK));
    blush(10.6, -5.6, 1.6, 1);
    ctx.restore();
  }

  /* ───── 사람 ───── */
  /** 팔 끝(손목 x, y)에 Twemoji 손을 붙인다. o.reach[3] 자세, o.glove 장갑색.
      hold(손목 x, y, 쥔 x, 쥔 y)는 손 뒤에(쥔 물건이 주먹을 지나가게), front(손목 x, y)는 손 앞에 그린다 */
  function armHand(t, x, y, ang, w, o) {
    const pose = o.reach[3], s = w * HAND_PER_ARM, k = HAND_HOLD[pose][0] * s;
    if (o.hold) o.hold(x, y, x + Math.cos(ang) * k, y + Math.sin(ang) * k);
    artHandOnArm(t, x, y, ang, s, { pose, coat: o.glove });
    if (o.front) o.front(x, y);
  }

  /** 팔: 어깨 → 팔꿈치 → 손목. 소매와 소매단까지 */
  function arm(sh, el, wr, sleeve, w, t, cuff) {
    curve([sh, el, wr], t(shade(sleeve)), w + .8);
    curve([sh, el, [wr[0] - (wr[0] - el[0]) * .02, wr[1] - (wr[1] - el[1]) * .02]], t(sleeve), w);
    const a = Math.atan2(wr[1] - el[1], wr[0] - el[0]);
    at(wr[0], wr[1], () => { ctx.rotate(a); RR(-2.6, -w * .58, 3, w * 1.16, 1, t(cuff || lite(sleeve, .25))); });
  }

  /** 쪼그려 앉은 사람(키 약 115). o: 옷색 + face(hx, hy, r) + reach: [팔꿈치, 손목, 손각도, 자세] + hold(손목 x, y, 쥔 x, 쥔 y) */
  function crouch(time, t, o) {
    const br = Math.sin(time * 1.8) * .6, pants = o.bottom;
    const legPath = (dx, c, w) => { curve([[-14 + dx, -38], [14 + dx, -47]], c, w + 1); curve([[14 + dx, -47], [5 + dx, -5]], c, w - 1); };
    legPath(-4, t(shade(pants)), 13);
    blob([[-4, -7], [9, -7], [13, -3], [12, 0], [-5, 0]], t(shade(o.shoe)));
    const body = [[-25, -36], [-24, -62], [-12, -86 + br], [3, -92 + br], [12, -83 + br], [9, -60], [3, -42], [-12, -32]];
    blob(body, t(o.top));
    inside(body, () => { blob([[6, -88], [14, -80], [10, -58], [4, -42], [0, -60]], t(shade(o.top))); blob([[-24, -40], [-23, -62], [-14, -82], [-19, -60]], t(lite(o.top, .18))); if (o.under) blob([[3, -92], [10, -86], [7, -74], [1, -80]], t(o.under)); });
    if (o.vest) o.vest(br);
    legPath(0, t(pants), 14);
    if (o.pattern) [[-10, -42], [-4, -39], [2, -44], [7, -41], [12, -47], [13, -38], [10, -30], [11, -22], [8, -15], [6, -8], [-12, -36]].forEach(([x, y], i) => [0, 1, 2, 3, 4].forEach((k) => E(x + Math.cos(k * 1.26 + i) * .9, y + Math.sin(k * 1.26 + i) * .9, .6, .6, t(i % 2 ? '#f2c6d0' : '#e9e4f0'))));
    blob([[0, -7], [12, -7], [17, -3], [16, 0], [-1, 0]], t(o.shoe));
    faded(.6, () => L(1, -6, 12, -6, t(lite(o.shoe, .35)), .8));
    const hx = 12, hy = -106 + br;
    blob([[6, -96 + br], [14, -96 + br], [14, -88 + br], [6, -88 + br]], t(shade(SKIN)));
    o.face(hx, hy, 12.4);
    const [el, wr, ang] = o.reach;
    arm([4, -86 + br], el, wr, o.top, 7.2, t);
    armHand(t, wr[0], wr[1], ang, 7.2, o);
  }

  /** 서 있는 사람(키 약 168). 다리는 제자리에 서 있고, 몸만 숨 쉬듯 오르내린다 */
  function stand(time, t, o) {
    const br = Math.sin(time * 1.8) * .7;
    blob([[-1, -80], [10, -80], [8.6, -40], [7.6, -6], [1.6, -6], [1, -40]], t(shade(o.bottom)));
    blob([[1, -6], [13, -6], [16, -2], [15, 0], [0, 0]], t(shade(o.shoe)));
    blob([[-12, -80], [2, -80], [1, -40], [-.4, -6], [-7.4, -6], [-9.6, -40]], t(o.bottom));
    faded(.5, () => L(-4, -66, -5, -14, t(lite(o.bottom, .15)), .8));
    blob([[-9, -6], [1, -6], [4.4, -2], [3.6, 0], [-10, 0]], t(o.shoe));
    faded(.6, () => L(-8, -5.2, 1, -5.2, t(lite(o.shoe, .35)), .7));
    const body = [[-13, -74], [-14, -112], [-8, -128 + br], [8, -128 + br], [13, -112], [12, -74]];
    if (o.backArm) arm([-6, -122 + br], o.backArm[0], o.backArm[1], shade(o.top), 7, t);
    blob(body, t(o.top));
    inside(body, () => { E(12, -100, 6, 34, t(shade(o.top))); faded(.6, () => E(-12, -104, 2.4, 20, t(lite(o.top, .25)))); });
    if (o.vest) o.vest(br);
    blob([[-3, -134 + br], [5, -134 + br], [5, -126 + br], [-3, -126 + br]], t(shade(SKIN)));
    o.face(2, -146 + br, 12.4);
    const [el, wr, ang] = o.reach;
    arm([4, -122 + br], el, [wr[0], wr[1] + br * .5], o.top, 7.4, t);
    armHand(t, wr[0], wr[1] + br * .5, ang, 7.4, o);
  }

  /** 옆얼굴(오른쪽을 본다). hair(hx, hy, r): 머리 모양. mood 'smile' | 'squint' | 기본 */
  function face(time, t, hair, mood, extra) {
    return (hx, hy, r) => {
      E(hx - r * .9, hy + r * .1, r * .28, r * .34, t(shade(SKIN)));
      blob([[hx - r, hy - r * .2], [hx - r * .4, hy - r], [hx + r * .6, hy - r * .9], [hx + r, hy - r * .1], [hx + r * 1.08, hy + r * .25], [hx + r * .8, hy + r * .8], [hx, hy + r * 1.05], [hx - r * .8, hy + r * .6]], t(SKIN));
      hair(hx, hy, r);
      E(hx - r * .25, hy + r * .1, r * .22, r * .26, t(SKIN)); E(hx - r * .25, hy + r * .12, r * .1, r * .14, t(shade(SKIN)));
      if (mood === 'smile') shutEye(hx + r * .5, hy, r * .14, t, true);
      else { const blink = Math.sin(time * 1.1) > .97; if (blink) L(hx + r * .38, hy, hx + r * .62, hy, t(INK), r * .06); else { E(hx + r * .5, hy, r * .09, r * .12, t(INK)); E(hx + r * .53, hy - r * .04, r * .03, r * .03, WHITE); } }
      L(hx + r * .32, hy - r * .3, hx + r * .66, hy - r * (mood === 'squint' ? .18 : .32), t(shade(shade(SKIN))), r * .07);
      ctx.strokeStyle = t('#b0645a'); ctx.lineWidth = r * .06; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(hx + r * .55, hy + r * .58); ctx.quadraticCurveTo(hx + r * .72, hy + r * (mood === 'smile' ? .7 : .6), hx + r * .88, hy + r * .52); ctx.stroke();
      blush(hx + r * .45, hy + r * .38, r * .17, r * .1);
      if (extra) extra(hx, hy, r);
    };
  }

  const wrinkles = (t) => (hx, hy, r) => [[.62, .02], [.68, .12]].forEach(([dx, dy]) => L(hx + r * (dx + .14), hy + r * dy, hx + r * (dx + .26), hy + r * (dy + .04), t(shade(SKIN)), r * .04));
  const shortHair = (t, c) => (hx, hy, r) => blob([[hx - r * 1.04, hy + r * .25], [hx - r * .95, hy - r * .78], [hx, hy - r * 1.12], [hx + r * .9, hy - r * .72], [hx + r * .9, hy - r * .4], [hx + r * .3, hy - r * .55], [hx - r * .35, hy - r * .1]], t(c));

  /* ───── 리어카 할아버지 ───── */
  /** 털모자: 머리를 덮고 단을 한 번 접어 올렸다. 귀 옆으로 흰 머리가 비친다 */
  const grandpaHair = (t) => (hx, hy, r) => {
    E(hx - r * .62, hy + r * .22, r * .34, r * .36, t(GRANDPA.hair));
    blob([[hx - r * 1.08, hy - r * .1], [hx - r * .9, hy - r * .9], [hx, hy - r * 1.24], [hx + r * .86, hy - r * .86], [hx + r * .96, hy - r * .36], [hx - r * .2, hy - r * .4]], t(GRANDPA.hat));
    blob([[hx - r * 1.12, hy - r * .02], [hx - r * 1.04, hy - r * .44], [hx + r, hy - r * .52], [hx + r * 1.02, hy - r * .24], [hx - r * .1, hy - r * .14]], t(lite(GRANDPA.hat, .2)));
  };
  /** 허리 굽은 할아버지(서서, 키 약 160). 몸을 앞으로 기울여(밀림 변환) 굽은 허리를 낸다. o: reach, hold, bare(맨손), stoop */
  function grandpa(time, t, o) {
    ctx.save(); ctx.transform(1, 0, -(o.stoop || .16), 1, 0, 0); ctx.scale(.95, .95);
    stand(time, t, { ...GRANDPA, glove: o.bare ? null : GRANDPA.glove, backArm: [[-4, -100], [0, -82]],
      face: face(time, t, grandpaHair(t), 'smile', wrinkles(t)),
      vest: (br) => { const v = [[-13, -120 + br], [9, -120 + br], [11, -76], [-13, -76]]; blob(v, t(GRANDPA.vest)); inside(v, () => blob([[3, -124], [14, -120], [14, -72], [5, -72]], t(shade(GRANDPA.vest)))); },
      reach: o.reach, hold: o.hold });
    ctx.restore();
  }
  /** 할아버지 손이 닿는 자리(밀림 변환을 거친 화면 좌표) */
  const gripAt = (o, x, y) => [(x - (o.stoop || .16) * y) * .95, y * .95];
  /** 리어카(옆에서 본). 짐칸은 x0~x0+CART_LEN, 손잡이 끝은 (hx, hy). load(): 짐칸 위 짐. 바퀴는 돌지 않는다 */
  function cartBack(t, x0, hx, hy, load) {
    const K = planes(t, CART), TI = planes(t, '#3a3445'), x1 = x0 + CART_LEN;
    curve([[x1 - 4, -60], [hx - 6, hy - 3]], K.dark, 3);                                              // 뒤 손잡이(그늘)
    L(x0 + 8, -46, x0 + 4, 0, K.dark, 2.4);                                                           // 받침 다리
    if (load) load();
    // 짐칸 옆판: 볕 받는 윗테 · 판 · 그늘진 아랫단
    const side = [[x0, -38], [x1, -38], [x1 + 2, -62], [x0 - 2, -62]];
    sheet(side, K.mid);
    sheetIn(side, () => { P([[x0 - 4, -62], [x1 + 4, -62], [x1 + 4, -57], [x0 - 4, -57]], K.lit); P([[x0 - 4, -44], [x1 + 4, -44], [x1 + 4, -38], [x0 - 4, -38]], K.dark); });
    const wx = x0 + CART_LEN * .5;                                                                    // 바퀴: 고무 테, 볕 받는 왼쪽 위 초승달, 휠
    E(wx, -30, 30, 30, TI.deep); E(wx - 1.2, -31.2, 28.4, 28.4, TI.lit); E(wx + .6, -29.4, 27.6, 27.6, TI.mid);
    E(wx, -30, 17, 17, t('#b7bcc8')); E(wx + 1, -29, 13, 13, t('#9aa0ab')); E(wx, -30, 4, 4, K.dark);
  }
  /** 앞 손잡이: 짐칸 앞에서 손 쪽으로 올라간다. 끝에 검은 고무 손잡이 */
  function cartFront(t, x0, hx, hy) {
    const K = planes(t, CART);
    curve([[x0 + CART_LEN - 2, -58], [(x0 + CART_LEN + hx) / 2, (hy - 58) / 2 - 2], [hx, hy]], K.mid, 3.4);
    curve([[x0 + CART_LEN - 2, -59.4], [hx, hy - 1.4]], K.lit, 1);
    at(hx, hy, () => { ctx.rotate(Math.atan2(hy + 58, hx - x0 - CART_LEN)); RR(-2, -2.4, 12, 4.8, 2.4, t('#2f2a3a')); });
  }
  /** 짐칸에 실은 납작한 상자 더미: 장마다 어긋난 끝, 볕 받는 윗면, 노끈 한 줄 */
  function boxLoad(t, x0, n) {
    const A = planes(t, '#d9b27c'), B = planes(t, '#c9a06a'), th = 7.6;
    for (let k = 0; k < n; k++) {
      const o = [2, -6, 5, -3, 7, -2][k % 6], y = -62 - k * th, p = k % 2 ? B : A, a = x0 + o, b = x0 + CART_LEN + o - 6;
      sheet([[a, y], [b, y], [b + 2, y - th * .5, b, y - th], [(a + b) / 2, y - th + .8, a, y - th]], p.mid);
      sheet([[b - 6, y], [b, y], [b + 2, y - th * .5, b, y - th], [b - 6, y - th]], p.dark);
    }
    const top = -62 - n * th;
    sheet([[x0 + 4, top], [x0 + CART_LEN - 10, top], [x0 + CART_LEN - 4, top - 3], [x0 + 8, top - 3]], A.lit);
    curve([[x0 + 40, -60], [x0 + 46, top - 2], [x0 + 104, top - 3], [x0 + 110, -60]], t('#f4f1ea'), 1.2);
  }
  /** 막걸리 병: 하얀 플라스틱 병, 초록 뚜껑 */
  function makgeolli(x, t) {
    const B = planes(t, '#f4f1ea'), b = [[x - 3.6, 0], [x - 3.6, -13], [x - 1.6, -17], [x - 1.4, -20], [x + 1.4, -20], [x + 1.6, -17], [x + 3.6, -13], [x + 3.6, 0]];
    sheet(b, B.mid); sheetIn(b, () => { P([[x - 4, 0], [x - 1.8, 0], [x - 1.8, -20], [x - 4, -20]], B.lit); P([[x + 1.8, 0], [x + 4, 0], [x + 4, -20], [x + 1.8, -20]], B.dark); });
    RR(x - 1.8, -22.6, 3.6, 3, .8, t('#3f9f5f')); RR(x - 3.6, -10, 7.2, 4.4, .4, t('#7fb08a'));
  }
  /** 목장갑 한 짝(누운 것): 흰 면장갑에 빨간 고무를 입힌 손바닥 쪽이 살짝 보인다. 손가락은 오른쪽 */
  function gloveFlat(t) {
    const G = planes(t, GRANDPA.glove), red = t('#d9534f'), palm = [[-7, -7.6], [3, -8.4], [5, -5], [5, 4], [3, 7.6], [-7, 6.8]];
    ctx.save(); ctx.translate(0, -3); ctx.scale(1, .55);                                              // 위에서 내려다본 손 모양을 바닥에 눕혀 납작하게
    RR(-13, -7, 7, 12, 2, G.dark);                                                                    // 손목 고무단
    blob(palm, G.mid);
    [11, 12.6, 12, 9.6].forEach((len, k) => at(3, -6.4 + k * 4.2, () => {                            // 손가락 넷: 끝마다 빨간 코팅
      ctx.rotate([-.12, -.04, .04, .14][k]); RR(0, -1.8, len, 3.6, 1.8, k % 2 ? G.mid : G.lit); RR(len - 3.4, -1.8, 3.4, 3.6, 1.8, red);
    }));
    at(-2, 7, () => { ctx.rotate(.7); RR(0, -1.9, 8.4, 3.8, 1.9, G.dark); RR(5.2, -1.9, 3.2, 3.8, 1.9, red); });   // 엄지
    inside(palm, () => blob([[-9, -9], [2, -10], [-2, -2], [-9, 0]], G.lit));
    ctx.restore();
  }
  /** 손잡이 끝에 걸려 흔들리는 장갑 한 짝 */
  function gloveHung(time, t, x, y) {
    at(x, y, () => {
      ctx.rotate(Math.sin(time * 1.8) * .12); ctx.scale(1.4, 1.4);
      const G = planes(t, GRANDPA.glove), g = [[-2.6, 0], [2.6, 0], [3.4, 8], [4.6, 15], [2.4, 16], [1.4, 12], [0, 16.6], [-1.4, 12.4], [-3, 15.6], [-4.4, 9], [-5.4, 7]];
      blob(g, G.mid); inside(g, () => { blob([[-6, 6], [-1, 4], [-1, 9], [-6, 10]], G.lit); blob([[-6, 12.4], [6, 12.4], [6, 18], [-6, 18]], t('#d9534f')); });
      RR(-2.8, -1, 5.6, 3, 1, G.dark);
    });
  }

  /* ───── 물건 ───── */
  /** 벽돌 한 장: 앞면, 볕 받는 윗면, 그늘진 오른쪽 끝면 */
  function brick(x, y, w, h, c, t) { const d = Math.min(2.4, w * .16); boxFaces(planes(t, c), x, x + w - d, y + h, h - d * .6, d); }
  function nailUp(x, y, h, t) { L(x, y, x + h * .12, y - h, t(RUST), .8); E(x + h * .12, y - h, .9, .35, t('#8a4a32')); faded(.6, () => L(x - .2, y - h * .3, x - .1, y - h * .7, t('#e6b08a'), .25)); }
  function sausage(x, y, rot, len, t, peeled) {
    at(x, y, () => {
      ctx.rotate(rot);
      const S = planes(t, '#d0704f');
      curve([[0, .2], [len * .5, -.2], [len, .2]], S.dark, 2.6);
      curve([[0, -.1], [len * .5, -.5], [len, -.1]], S.mid, 2.1);
      curve([[.4, -.5], [len * .5, -.9], [len - .4, -.5]], S.lit, .8);
      if (peeled) { P([[len, 0], [len + 3, -2.6], [len + 3.6, 1.4]], t('#f2a33a')); P([[len, .2], [len + 2, 2.8], [len + .4, 2]], t('#d9822a')); }
    });
  }

  return { hero: (time, moving, eye, t) => drawDog(time, t, COATS.hero, { moving, mouth: moving ? 'open' : null }), art: {
    /* G1 마루 밑, 헌 담요 위에서 엉겨 자는 형제들 */
    'dog:pupNest': { w: 72, h: 26, d: (time, t) => {
      const Wl = planes(t, '#c97b7b'), CK = planes(t, '#e9c46a'), rug = [[-34, 0], [-36, -6], [-28, -12], [-6, -14], [16, -13], [32, -9], [36, -2], [34, 0]];
      // 헌 담요 한 장: 볕 받는 윗면, 아래로 처진 앞 자락은 그늘. 굵은 체크 두 줄만
      blob(rug, Wl.dark);
      inside(rug, () => {
        blob([[-38, -5], [-28, -13], [-6, -15], [16, -14], [34, -9], [30, -5], [8, -6.4], [-14, -6], [-32, -4]], Wl.mid);
        blob([[-38, -7], [-28, -14], [-6, -16], [4, -14], [-10, -10.4], [-30, -7]], Wl.lit);
        [-18, 10].forEach((x) => P([[x, -16], [x + 4, -16], [x + 5, 0], [x + 1, 0]], CK.mid));
      });
      at(-18, -6, () => curledDog(time, t, COATS.brindle, .42, 0));
      at(14, -6, () => curledDog(time, t, COATS.white, .44, 1));
      at(-2, -9, () => curledDog(time, t, COATS.hero, .46, 2));
      at(26, -3, () => { ctx.scale(-1, 1); curledDog(time, t, COATS.black, .36, 3); });
      blob([[-36, 0], [-30, -4], [-22, -2], [-26, 0]], Wl.mid); blob([[28, 0], [33, -5], [38, -1], [36, 0]], Wl.dark);
    } },
    /* G1 대문에 빨간 X, 파란 방수포 지붕의 철거 예정 빈집 */
    'dog:redXHouse': { w: 172, h: 196, d: (time, t) => sized(.75, () => {
      const Wa = planes(t, '#d9cbb6'), TP = planes(t, TARP), RF = planes(t, '#5a6274'), DR = planes(t, '#6a8aa6'), BD = planes(t, '#c9a27c'), FR = planes(t, '#6b5a4e');
      // 집 한 채: 앞벽, 오른쪽으로 물러나는 옆벽(그늘), 처마 밑 그늘 띠
      P([[88, 0], [110, -13], [110, -210], [88, -200]], Wa.dark);
      R(-108, -200, 196, 200, Wa.mid);
      P([[-108, -200], [88, -200], [88, -190], [-108, -186]], Wa.dark);
      ctx.strokeStyle = Wa.deep; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(60, -200); ctx.lineTo(52, -170); ctx.lineTo(58, -150); ctx.lineTo(48, -120); ctx.stroke();
      P([[-122, -196], [0, -258], [122, -196]], RF.mid);
      // 파란 방수포: 볕 받는 왼쪽 비탈 · 가운데 · 그늘진 오른쪽 비탈 세 면
      const tarp = [[-110, -200], [-80, -238], [-20, -252], [40, -246], [104, -206], [60, -194], [-40, -198]];
      blob(tarp, TP.mid);
      inside(tarp, () => { P([[-130, -270], [-22, -270], [-36, -196], [-130, -196]], TP.lit); P([[38, -270], [130, -270], [130, -180], [62, -190]], TP.dark); });
      [[-70, -248], [10, -258], [70, -230]].forEach(([x, y]) => { RR(x - 5, y, 10, 7, 2, RF.mid); RR(x - 5, y, 10, 2.4, 1, RF.lit); });   // 누름돌 대신 얹은 헌 타이어
      // 판자로 막은 창
      RR(-90, -150, 64, 52, 2, FR.mid); RR(-86, -146, 56, 44, 1, FR.deep);
      [[-.08, -138], [.12, -120], [-.05, -108]].forEach(([a, y]) => at(-58, y, () => { ctx.rotate(a); RR(-36, -5, 72, 9, 1.5, BD.mid); RR(-36, -5, 72, 2.4, 1, BD.lit); R(-36, 2.6, 72, 1.4, BD.dark); }));
      // 문: 문틀(그늘) · 문짝 · 오목한 판 두 개
      RR(4, -168, 72, 168, 2, DR.dark); RR(10, -162, 60, 162, 1, DR.mid);
      [[10, -162, 60, 60], [10, -96, 60, 90]].forEach(([x, y, w, h]) => { RR(x + 5, y + 5, w - 10, h - 10, 1, DR.dark); RR(x + 7, y + 7, w - 12, h - 12, 1, DR.lit); });
      faded(.75, () => [[18, -150, 60, -40], [60, -150, 20, -42]].forEach(([x1, y1, x2, y2]) => { curve([[x1, y1], [(x1 + x2) / 2 + 3, (y1 + y2) / 2], [x2, y2]], t('#d93a3a'), 7); }));
      [[22, -38, 10], [58, -40, 16], [40, -94, 8]].forEach(([x, y, h]) => { RR(x - 1, y, 2, h, 1, t('#d93a3a')); E(x, y + h, 1.6, 1.8, t('#d93a3a')); });
      ctx.fillStyle = t('#d93a3a'); ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; text('공가', -58, -60); text('철거', 40, -176);
      E(62, -84, 2.4, 2.4, t('#c9a27c'));
      faded(.85, () => { RR(-104, -8, 90, 8, 2, t(CEMENT)); [[-96, -6], [-70, -10], [-40, -7]].forEach(([x, y]) => brick(x, y, 14, 7, '#b36b4f', t)); });
    }) },

    /* G2 새끼를 물어 옮기는 엄마. 버려진 개라 목에 끊어진 목줄이 그대로다 */
    'dog:motherDog': { w: 80, h: 64, d: (time, t) => {
      ctx.save(); ctx.scale(1.08, 1.08);
      drawDog(time, t, COATS.mom, { collar: true, fold: false, look: 2 });
      at(43, -40, () => { ctx.rotate(Math.sin(time * 1.4) * .08 + .2); curledDog(time, t, COATS.hero, .34, 4); });
      ctx.restore();
    } },
    /* G2·D1 지붕을 뜯어내는 노란 포크레인. 바퀴(궤도)는 돌지 않고 팔만 천천히 들썩인다 */
    'dog:excavator': { w: 215, h: 175, d: (time, t) => sized(.72, () => excavator(time, t)) },
    /* D11 철거 잔해: 판자에 박힌 녹슨 못 */
    'dog:rubbleNail': { w: 70, h: 26, d: (time, t) => {
      [[-32, -8, 16, 8], [-18, -9, 15, 9], [-26, -16, 14, 8], [18, -7, 14, 7]].forEach(([x, y, w, h]) => brick(x, y, w, h, '#b36b4f', t));
      const CM = planes(t, CEMENT), PL = planes(t, '#a3845f'), chunk = [[-30, 0], [-20, -5], [-6, -3], [4, -6], [12, 0]];
      blob(chunk, CM.mid);
      inside(chunk, () => { P([[-34, -1], [-20, -7], [-6, -5], [-10, -1.6]], CM.lit); P([[0, -8], [14, -8], [14, 1], [3, 1]], CM.dark); });
      at(0, -4, () => { ctx.rotate(-.08); boxFaces(PL, -14, 24, 2, 4, 2.4); });   // 판자: 볕 받는 윗면 · 앞 모서리 · 끝면
      [[-6, -7, 7], [6, -7.4, 6], [18, -7.8, 8]].forEach(([x, y, h]) => nailUp(x, y, h, t));
      faded(.5 + Math.sin(time * 3) * .3, () => E(19, -15.6, .7, .7, WHITE));
    } },


    /* G2 리어카 옆에 쪼그려 앉아 단팥빵 반쪽을 내미는 할아버지, 발치에 막걸리 병 */
    'dog:breadGrandpa': { w: 230, h: 130, d: (time, t) => {
      cartBack(t, -220, -66, -26, () => boxLoad(t, -220, 4));
      cartFront(t, -220, -66, -26);
      makgeolli(-30, t);
      crouch(time, t, { ...GRANDPA, glove: null, face: face(time, t, grandpaHair(t), 'smile', wrinkles(t)),
        vest: (br) => { const v = [[-24.6, -37], [-23.6, -62], [-12, -85 + br], [-3, -89 + br], [4, -78], [9, -61], [4, -42], [-12, -33]]; blob(v, t(GRANDPA.vest)); inside(v, () => blob([[4, -82], [12, -78], [9, -56], [3, -42], [0, -62]], t(shade(GRANDPA.vest)))); },
        reach: [[22, -70], [36, -60], -.15, 'offer'],
        hold: (x, y, gx, gy) => at(gx + 1, gy - 3.4, () => {
          const Bn = planes(t, '#c98a4a'), bun = [[-6, 2], [-6.4, -2, -3, -5], [1, -5.6], [4, -4], [4, 2]];
          blob(bun, Bn.mid); inside(bun, () => blob([[-8, -2], [-4, -6], [0, -7], [-2, -3]], Bn.lit));
          E(4, -1.4, 1.6, 3.4, t('#f3e2c4')); E(4.2, -1.4, 1, 2.2, t('#7a3b3e'));                     // 쪼갠 단면: 빵살과 팥
        }) });
    } },
    /* G4 새벽, 상자를 실은 리어카를 끄는 할아버지(장갑 낀 손) */
    'dog:cartPull': { w: 250, h: 170, d: (time, t) => {
      const o = { reach: [[8, -102], [9, -84], 1.45, 'grip'] }, [hx, hy] = gripAt(o, 9, -78);
      cartBack(t, -225, hx, hy, () => boxLoad(t, -225, 6));
      grandpa(time, t, o);
      cartFront(t, -225, hx, hy);
    } },
    /* G5 이삿짐(이불 보따리·밥솥·화분)을 묶은 리어카와 할아버지. 장갑 한 짝을 두고 가서 손은 맨손이다 */
    'dog:movingCart': { w: 250, h: 170, d: (time, t) => {
      const o = { bare: true, reach: [[8, -102], [9, -84], 1.45, 'grip'] }, [hx, hy] = gripAt(o, 9, -78);
      cartBack(t, -225, hx, hy, () => {
        const Q = planes(t, '#e58fa3'), quilt = [[-218, -60], [-222, -84], [-200, -104], [-150, -108], [-128, -96], [-126, -60]];
        blob(quilt, Q.mid);                                                                           // 꽃무늬 이불 보따리: 볕 받는 어깨, 그늘진 오른쪽 자락, 매듭 귀
        inside(quilt, () => { blob([[-230, -80], [-204, -112], [-160, -114], [-190, -92]], Q.lit); blob([[-150, -120], [-120, -100], [-120, -54], [-146, -58]], Q.dark); [[-196, -84], [-170, -96], [-150, -74], [-206, -66]].forEach(([x, y]) => E(x, y, 3, 3, t('#fff3a8'))); });
        blob([[-168, -106], [-160, -118], [-150, -116], [-154, -104]], Q.mid);
        const C = planes(t, '#f4f1ea'), ck = [[-120, -60], [-121, -84], [-116, -90], [-94, -90], [-89, -84], [-90, -60]];
        blob(ck, C.mid); inside(ck, () => { blob([[-124, -64], [-124, -88], [-112, -92], [-114, -64]], C.lit); blob([[-96, -92], [-86, -92], [-86, -58], [-96, -58]], C.dark); });   // 전기밥솥
        RR(-110, -95, 10, 4, 2, t('#5a5560')); RR(-112, -76, 6, 3, 1, t('#d9534f'));
        const Pt = planes(t, '#b36b4f');                                                              // 화분과 고추 모종
        sheet([[-86, -60], [-66, -60], [-68, -76], [-84, -76]], Pt.mid); sheet([[-72, -60], [-66, -60], [-68, -76], [-73, -76]], Pt.dark);
        at(-76, -76, () => leafMass(0, -8, 9, 8, .4, t, 6));
        curve([[-214, -62], [-180, -110], [-110, -100], [-70, -62]], t('#f4f1ea'), 1.2);
      });
      grandpa(time, t, o);
      cartFront(t, -225, hx, hy);
    } },
    /* G5·G8 할아버지가 두고 간 목장갑 한 짝 */
    'dog:glove': { w: 26, h: 10, d: (time, t) => gloveFlat(t) },
    /* G11 왕복 8차로 앞 보행 신호등: 초록 사람 불, 줄어드는 숫자, 바닥의 횡단보도 줄 */
    'dog:crossSignal': { w: 200, h: 200, d: (time, t) => {
      const K = planes(t, '#7d8794'), BX = planes(t, '#3a3445'), Z = planes(t, '#f4f1ea');
      [-90, -40, 10, 60, 110].forEach((x) => sheet([[x, 0], [x + 30, 0], [x + 38, -4], [x + 8, -4]], Z.mid));   // 횡단보도 흰 줄(바닥에 눕힌)
      RR(-4, -190, 8, 190, 3, K.mid); RR(-4, -190, 3, 190, 1.5, K.lit); RR(2.4, -190, 1.8, 190, .9, K.dark);
      at(6, -192, () => {
        RR(0, 0, 30, 58, 3, BX.mid); RR(0, 0, 4, 58, 2, BX.lit); RR(27, 0, 3, 58, 1.5, BX.dark);
        E(15, 15, 10, 10, t('#4a3a40')); E(15, 43, 10, 10, t('#1f2a26'));
        const on = .75 + Math.sin(time * 4) * .25;
        faded(.35 * on, () => E(15, 43, 16, 16, t('#7fffc0')));
        const gr = t('#6bf2a8');                                                                          // 걷는 사람 그림
        E(16, 36.6, 1.9, 1.9, gr); curve([[15.4, 39], [14.6, 45]], gr, 2.4); curve([[14.6, 45], [11.6, 50]], gr, 1.8); curve([[14.6, 45], [18, 50]], gr, 1.8); curve([[15.2, 40.4], [19, 43.4]], gr, 1.4); curve([[15.2, 40.4], [12, 43]], gr, 1.4);
      });
      at(38, -156, () => {
        RR(0, 0, 22, 20, 2, BX.mid); RR(0, 0, 3, 20, 1.5, BX.lit);
        const n = 3 - Math.floor(time % 3);
        ctx.fillStyle = t('#6bf2a8'); ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; text(String(n), 11.4, 15.6);
      });
    } },
    /* G12 고물상 바닥 저울: 쇠판 위에 묶은 상자 더미, 기둥 위 둥근 눈금판(바늘이 살짝 떨린다) */
    'dog:junkScale': { w: 150, h: 130, d: (time, t) => {
      const K = planes(t, '#8d8a9c'), D = planes(t, '#f4f1ea');
      boxFaces(K, -66, 46, 0, 8, 12);                                                                     // 바닥 저울판
      at(-62, 48, () => boxLoad(t, 0, 5));
      RR(58, -118, 6, 118, 2, K.mid); RR(58, -118, 2, 118, 1, K.lit);
      at(61, -128, () => {
        E(0, 0, 17, 17, K.dark); E(-.8, -.8, 15.6, 15.6, D.mid); faded(.5, () => E(-5, -5, 7, 6, D.lit));
        for (let i = 0; i < 10; i++) { const a = -Math.PI * .9 + i * .2 * Math.PI; L(Math.cos(a) * 12, Math.sin(a) * 12, Math.cos(a) * 14, Math.sin(a) * 14, t('#3b3049'), .5); }
        ctx.save(); ctx.rotate(-.3 + Math.sin(time * 3) * .04); L(0, 0, 11, 0, t('#d9534f'), 1); ctx.restore();
        E(0, 0, 1.6, 1.6, t('#3b3049'));
      });
    } },
    /* G12 고물상 줄 끝, 더 굽은 할아버지와 리어카. 손잡이에 장갑 한 짝만 걸려 있다 */
    'dog:oldCart': { w: 250, h: 165, d: (time, t) => {
      const o = { bare: true, stoop: .24, reach: [[8, -100], [9, -82], 1.45, 'grip'] }, [hx, hy] = gripAt(o, 9, -76);
      cartBack(t, -225, hx, hy, () => boxLoad(t, -225, 3));
      gloveHung(time, t, -44, -66);
      grandpa(time, t, o);
      cartFront(t, -225, hx, hy);
    } },

    /* G6·S1·D3 구석에 놓인 고기: 파란 쥐약 알갱이와 굴러다니는 농약병 */
    'dog:poisonBait': { w: 46, h: 14, d: (time, t) => {
      const NP = planes(t, '#e4dfd2'), M = planes(t, MEAT), news = [[-20, 0], [-18, -3], [-6, -4.4], [10, -3.6], [17, -1.4], [16, 0]];
      blob(news, NP.mid);                                                                                   // 깔아 둔 신문지
      inside(news, () => { P([[-22, -5], [-6, -6], [-10, 0], [-22, 0]], NP.lit); faded(.6, () => [-14, 4].forEach((x) => L(x, -2.4, x + 4, -2.6, t('#9a958a'), .35))); });
      const meat = [[-10, -2.6], [-8, -7.6], [0, -9], [7, -7], [8, -3], [0, -2]];
      blob(meat, M.mid);                                                                                    // 고깃덩이: 볕 받는 등 · 그늘진 아랫배 · 비계 한 줄
      inside(meat, () => { P([[-12, -6], [-6, -10], [3, -10.4], [-2, -6.6], [-10, -4]], M.lit); P([[0, -1], [3, -4.4], [10, -6], [10, -1]], M.dark); curve([[-8, -6], [-2, -4.6], [4, -7.4]], t('#f2c6c0'), 1); });
      [[-13, -1], [9, -1.2], [5, -9.6], [-4, -9.6], [12, -.6], [-1, -6]].forEach(([x, y], i) => { E(x, y, .9, .7, t(i % 2 ? '#5fa8ff' : '#4fd1b0')); E(x - .3, y - .25, .3, .2, WHITE); });
      at(20, -2.4, () => { ctx.rotate(-1.45); const B = planes(t, '#3f8f5f'); RR(-2.4, -6, 4.8, 10, 1.6, B.mid); R(1, -5, 1.4, 8.4, B.dark); RR(-1.2, -8.4, 2.4, 2.8, .6, t('#e9e4ec')); RR(-2.4, -3, 4.8, 5, .4, t('#fffaf0')); E(0, -1.2, 1, .9, t('#3b3049')); RR(-.7, -.6, 1.4, .8, .3, t('#3b3049')); L(-1.4, 1, 1.4, 1.6, t('#3b3049'), .3); L(-1.4, 1.6, 1.4, 1, t('#3b3049'), .3); E(-.4, -1.3, .25, .25, WHITE); E(.4, -1.3, .25, .25, WHITE); R(-2, -5.6, 1, 9, B.lit); });
      faded(.35, () => [-3, 3].forEach((x, i) => steam(x, -10, 8, time + i, t('#b6d68a'))));
    } },
    /* G4 감자탕집 뒷문, 등뼈를 담은 빨간 바가지 */
    'dog:backdoorCook': { w: 120, h: 210, d: (time, t) => {
      const FR = planes(t, '#7d8794'), DL = planes(t, '#9aa6b4');
      // 문틀: 볕 받는 왼쪽 기둥·위 인방, 그늘진 오른쪽 기둥. 안은 불 켜진 주방
      RR(-48, -208, 96, 208, 2, FR.mid); P([[-48, -208], [48, -208], [42, -202], [-42, -202], [-42, 0], [-48, 0]], FR.lit); P([[42, -202], [48, -208], [48, 0], [42, 0]], FR.dark);
      R(-42, -202, 84, 202, t('#f2c27a'));
      faded(.35, () => P([[-42, 0], [42, 0], [70, 8], [-60, 8]], t('#fff0c8')));
      P([[28, -202], [44, -202], [44, 0], [28, 0]], DL.mid); P([[44, -202], [50, -206], [50, 2], [44, 0]], DL.dark); R(28, -202, 3, 202, DL.lit);   // 열어 둔 문짝
      stand(time, t, { top: '#f4f1ea', bottom: '#3d4c66', shoe: '#3b3049', backArm: [[-14, -100], [-12, -80]],
        vest: (br) => { blob([[-11, -120 + br], [10, -120 + br], [11, -74], [-12, -74]], t('#ffffff')); blob([[-11, -116 + br], [-6, -128 + br], [-3, -118 + br]], t('#ffffff')); L(-12, -100, 12, -100, t('#d8d4cc'), 1); },
        face: face(time, t, (hx, hy, r) => { shortHair(t, '#2f2a3a')(hx, hy, r); RR(hx - r * 1.06, hy - r * .78, r * 2, r * .36, r * .16, t('#e6765f')); }, 'smile'),
        reach: [[22, -104], [30, -86], -.2, 'grip'],
        hold: (x, y) => at(x + 9, y + 2, () => {
          const Bw = planes(t, '#d9534f'), bowl = [[-11, -2], [11, -2], [10, 5, 4, 8], [-4, 8], [-10, 5, -11, -2]];
          sheet(bowl, Bw.mid); sheetIn(bowl, () => { P([[-12, -3], [-6, -3], [-5, 9], [-12, 9]], Bw.lit); P([[5, -3], [12, -3], [12, 9], [3, 9]], Bw.dark); });
          E(0, -2, 11, 2.6, Bw.deep);
          [[-6, -4, .4], [0, -5, -.3], [5, -4, .2]].forEach(([bx, by, a]) => at(bx, by, () => { ctx.rotate(a); RR(-3, -1.4, 6, 2.8, 1.4, t('#f1e4cc')); E(-3, 0, 1.6, 1.6, t('#f1e4cc')); E(3, 0, 1.6, 1.6, t('#f1e4cc')); E(0, -.2, 1.4, .8, t('#c4565a')); }));
          RR(10, 1, 9, 3, 1.5, Bw.dark);
          steam(0, -6, 14, time, t('#ffffff'));
        }) });
    } },

    /* G5·D4 산자락 무리의 우두머리, 귀가 찢기고 주둥이에 흉터가 있는 검둥이 */
    'dog:packLeader': { w: 84, h: 74, d: (time, t) => {
      ctx.save(); ctx.scale(1.2, 1.2);
      drawDog(time, t, COATS.black, { mouth: 'growl', fold: false, scar: true, look: 1.5 });
      [-10, -5, 0, 5].forEach((x, i) => P([[x - 2, -37.4], [x + .6, -40 - (i % 2) * .8 - Math.sin(time * 3 + i) * .2], [x + 2.4, -37.2]], t(COATS.black.dark)));
      ctx.restore();
      faded(.5 + Math.sin(time * 5) * .3, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(50, -56, 5 + i * 4, -.7, .7); ctx.stroke(); }));
    } },
    /* G5·G7 엎드려 쉬는 무리: 하얀 개와 얼룩 개 */
    'dog:packDogs': { w: 130, h: 48, d: (time, t) => {
      at(-30, 0, () => { ctx.scale(-.95, .95); lyingDog(time, t, COATS.brindle, 1.2); });
      at(34, 0, () => lyingDog(time, t, COATS.white, 0));
    } },

    /* G6·D5 낙엽 더미 위에 눈을 맞으며 붙어 자는 무리 */
    'dog:snowHuddle': { w: 116, h: 46, d: (time, t) => {
      const leaf = ['#c9783f', '#a8603a', '#d9a05f', '#8a5a3a'];
      blob([[-56, 0], [-50, -10], [-20, -16], [20, -15], [50, -9], [56, 0]], t('#8a5a3a'));
      for (let i = 0; i < 26; i++) at(-50 + hash(i, 7) * 100, -2 - hash(i, 8) * 12, () => { ctx.rotate(hash(i, 9) * 6); E(0, 0, 3.4, 1.4, t(leaf[i % 4])); L(-3, 0, 3, 0, t(shade(leaf[i % 4])), .3); });
      at(-20, -8, () => curledDog(time, t, COATS.brindle, .9, 0));
      at(18, -8, () => { ctx.scale(-1, 1); curledDog(time, t, COATS.white, .86, 1); });
      at(0, -12, () => curledDog(time, t, COATS.hero, .7, 2));
      [[-30, -21, 9], [-4, -22, 7], [22, -21, 10], [40, -12, 6], [-46, -10, 5]].forEach(([x, y, w]) => blob([[x - w, y + 2], [x - w * .4, y - 2], [x + w * .5, y - 1.6], [x + w, y + 2]], t(SNOWC)));
      const p = (time * .7) % 1;
      faded((1 - p) * .7, () => [[-6, -18], [26, -14]].forEach(([x, y]) => E(x + p * 4, y - p * 8, 1.4 + p * 3, 1 + p * 2, WHITE)));
    } },
    /* G6 공원 화장실 벽, 김이 솟는 환풍구와 세워 둔 빗자루 */
    'dog:ventSteam': { w: 104, h: 186, d: (time, t) => sized(.8, () => {
      const BR = planes(t, '#c98f6e'), V = planes(t, '#9aa3b5'), BRM = planes(t, '#d9c27a'), HD = planes(t, '#c9a27c');
      // 화장실 벽: 앞면, 오른쪽 두께(그늘). 벽돌은 몇 장만 비친다
      P([[44, 0], [62, -10], [62, -240], [44, -230]], BR.dark);
      R(-62, -230, 106, 230, BR.mid);
      [[10, -200], [-40, -110], [18, -60], [-56, -36]].forEach(([x, y]) => RR(x, y, 24, 10, 1, t(mix('#c98f6e', '#2a2240', .1))));
      // 환풍구: 볕 받는 위 턱, 그늘진 오른쪽 테, 비늘살 넷 (살마다 윗면은 볕, 밑은 그늘)
      RR(-26, -176, 44, 34, 2, V.mid); P([[-26, -176], [18, -176], [22, -180], [-22, -180]], V.lit); P([[18, -176], [22, -180], [22, -146], [18, -142]], V.dark);
      RR(-23, -173, 38, 28, 1, t('#4a4560'));
      for (let i = 0; i < 4; i++) { const y = -171 + i * 7; P([[-23, y], [15, y], [15, y + 3.4], [-23, y + 3.4]], V.mid); R(-23, y, 38, 1.2, V.lit); }
      RR(-21, -146, 34, 2, 1, t('#e8a35e'));
      [-14, -2, 10].forEach((x, i) => steam(x, -178, 46, time + i * .8, t('#ffffff')));
      at(40, 0, () => {   // 세워 둔 빗자루: 자루(볕/그늘 반쪽), 퍼진 솔 한 장, 빨간 묶음 띠
        ctx.rotate(-.12);
        RR(-1.2, -120, 2.4, 100, 1.2, HD.dark); RR(-1.2, -120, 1.2, 100, .6, HD.lit);
        const head = [[-8, -22], [8, -22], [12, 0], [6, -1.4], [3, 0], [-1, -1.4], [-5, 0], [-9, -1.4], [-12, 0]];
        P(head, BRM.mid);
        sheetIn(head, () => { P([[-14, -24], [-3, -24], [-5, 2], [-14, 2]], BRM.lit); P([[4, -24], [14, -24], [14, 2], [7, 2]], BRM.dark); });
        RR(-8, -24, 16, 3, 1, t('#e6765f'));
      });
      RR(-62, -4, 124, 4, 1, t(CEMENT));
    }) },

    /* G7·D6 덤불에 매단 소시지와 땅에 박힌 올무 */
    'dog:snare': { w: 64, h: 66, d: (time, t) => snare(time, t) },

    /* G8·D7 "개 삽니다" 확성기 1톤 트럭과 철창, 고기를 흔드는 아저씨 */
    'dog:dogTruck': { w: 400, h: 262, d: (time, t) => dogTruck(time, t) },


    /* S1 산자락 바위 밑 굴, 방수포 조각과 굴 속에서 빛나는 눈 */
    'dog:hillDen': { w: 100, h: 62, d: (time, t) => {
      const Rk = planes(t, '#8d8a9c'), Tp = planes(t, TARP), rock = [[-48, 0], [-44, -30], [-20, -58], [16, -60], [42, -38], [48, 0]];
      // 큰 바위 하나: 볕 받는 왼쪽 위 어깨, 앞면, 그늘진 오른쪽 면. 금 한 줄
      blob(rock, Rk.mid);
      inside(rock, () => { P([[4, -66], [56, -66], [56, 4], [20, 4], [26, -30]], Rk.dark); P([[-56, -24], [-24, -66], [4, -66], [-12, -42], [-34, -26]], Rk.lit); L(-10, -50, -2, -34, Rk.deep, .8); });
      blob([[-22, 0], [-20, -18], [-6, -28], [10, -24], [18, 0]], t('#2a2535'));
      const blink = Math.sin(time * 1.3) > .95;
      [[-8, -14], [-2, -14.4], [6, -9], [11, -9.4]].forEach(([x, y]) => (blink ? L(x - 1, y, x + 1, y, t('#f2d16b'), .4) : E(x, y, 1, .9, t('#f2d16b'))));
      const tarp = [[-46, -26], [-30, -40], [-18, -30], [-28, -16]];
      blob(tarp, Tp.mid); inside(tarp, () => P([[-50, -26], [-30, -44], [-34, -27]], Tp.lit)); inside(tarp, () => P([[-36, -27], [-14, -34], [-14, -10], [-30, -10]], Tp.dark));
      at(30, -2, () => { ctx.rotate(.3); RR(-6, -1, 12, 2, 1, t('#f1e4cc')); E(-6, 0, 1.6, 1.6, t('#f1e4cc')); E(6, 0, 1.6, 1.6, t('#f1e4cc')); });
    } },
    /* S1 공사장 컨테이너, 문 앞에 놓인 고기 그릇 */
    'dog:containerMeat': { w: 180, h: 150, d: (time, t) => {
      const Ct = planes(t, '#d9d4c4'), Fm = planes(t, '#5f6476');
      // 컨테이너: 볕 받는 지붕, 골진 앞면, 그늘진 오른쪽 끝면. 골은 굵게 몇 줄만
      boxFaces(Ct, -86, 74, -8, 132, 12);
      for (let x = -70; x < 70; x += 24) { R(x, -140, 3, 132, Ct.lit); R(x + 3, -140, 1.6, 132, Ct.dark); }
      RR(-60, -110, 42, 30, 2, Fm.mid); P([[-60, -110], [-18, -110], [-18, -107], [-57, -107], [-57, -80], [-60, -80]], Fm.dark); RR(-57, -107, 36, 24, 1, t('#f2c27a'));
      faded(.5, () => P([[-57, -107], [-40, -107], [-50, -83], [-57, -83]], t('#fff3d0')));
      RR(16, -120, 40, 112, 2, Ct.dark); RR(18, -118, 36, 110, 1, t(mix('#d9d4c4', '#2a2240', .12))); E(48, -64, 2, 2, Fm.mid);
      [-70, 60].forEach((x) => RR(x, -8, 16, 8, 1, t('#6b6672')));
      at(-14, 0, () => { const Bw = planes(t, '#b9c3cf'); E(0, -2, 11, 3, Bw.dark); RR(-11, -5, 22, 4, 2, Bw.mid); RR(-11, -5, 6, 4, 2, Bw.lit); E(0, -5, 11, 2.2, Bw.lit); E(0, -5, 10, 2, t(MEAT)); [[-4, -6], [3, -6.4]].forEach(([x, y]) => E(x, y, 1, .7, t('#4fd1b0'))); });
      ctx.fillStyle = t('#d93a3a'); ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; text('관계자 외 출입금지', 0, -124);
    } },

    /* S2·D9 구청 포획반: 형광 조끼에 장갑, 포획봉 고리를 앞으로 내민다 */
    'dog:catchPole': { w: 140, h: 180, d: (time, t) => {
      const vest = '#f29a3a';
      stand(time, t, { top: '#4a5d7a', bottom: '#3d4c66', shoe: '#2f2a3a', glove: '#e8e1c8', backArm: [[-4, -102], [8, -96]],
        vest: (br) => { blob([[-12, -118 + br], [11, -118 + br], [12, -80], [-13, -80]], t(vest)); [-104, -92].forEach((y) => RR(-12, y, 24, 2.6, .6, t('#f4f1ea'))); ctx.fillStyle = t('#3b3049'); ctx.font = 'bold 3px sans-serif'; ctx.textAlign = 'center'; text('구청', 0, -110 + br); },
        face: face(time, t, (hx, hy, r) => { shortHair(t, '#2f2a3a')(hx, hy, r); blob([[hx - r * 1.1, hy - r * .5], [hx - r * .8, hy - r * 1.15], [hx + r * .6, hy - r * 1.15], [hx + r * .9, hy - r * .55]], t('#3d4c66')); RR(hx + r * .4, hy - r * .66, r * .9, r * .2, r * .1, t('#3d4c66')); }, 'squint'),
        reach: [[18, -104], [28, -90], .1, 'grip'],
        hold: (x, y) => {
          const k = Math.sin(time * 1.8) * .02;
          at(x + 4, y, () => { ctx.rotate(.42 + k); RR(-30, -1.6, 100, 3.2, 1.6, t('#b7bcc8')); RR(-30, -1.6, 100, 1, .5, t(lite('#b7bcc8', .5))); RR(-34, -2.4, 14, 4.8, 2, t('#3b3049')); ctx.strokeStyle = t('#e6765f'); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(76, 0, 7, 5, 0, 0, TAU); ctx.stroke(); });
        } });
      artHandOnArm(t, 8, -96, -.1, 7 * HAND_PER_ARM, { pose: 'grip', coat: '#e8e1c8' });   // 뒤쪽 팔 끝에서 장대를 함께 쥔다
    } },
    /* S2 분리수거장에 놓인 개 포획틀 */
    'dog:cageTrap': { w: 104, h: 64, d: (time, t) => {
      const steel = '#7d8794', K = planes(t, steel), D = 8, DY = 5;
      // 철창 상자: 뒤·오른쪽 면은 어둡게, 볕 받는 윗면 틀, 앞면 살은 성기게
      ctx.strokeStyle = K.dark; ctx.lineWidth = .8; ctx.beginPath();
      for (let x = -46 + D; x <= 46 + D; x += 8) { ctx.moveTo(x, -46 - DY); ctx.lineTo(x, -DY); }
      ctx.stroke();
      P([[-48, 0], [46, 0], [46 + D, -DY], [46 + D, -DY - 1.6], [-48 + D, -DY - 1.6]], K.dark);   // 바닥판
      at(-28, -2, () => { blob([[-5, 0], [-2, -4], [4, -4.4], [7, -1], [4, 0]], t('#c97a3e')); RR(5, -3, 6, 1.6, .8, t('#f1e4cc')); E(11, -2.2, 1.2, 1.2, t('#f1e4cc')); });
      ctx.strokeStyle = K.mid; ctx.lineWidth = 1; ctx.beginPath();
      for (let x = -38; x < 46; x += 8) { ctx.moveTo(x, -46); ctx.lineTo(x, 0); }
      ctx.moveTo(-46, -23); ctx.lineTo(46, -23);
      ctx.stroke();
      RR(-48, -2, 96, 2, 1, K.mid); RR(-48, -46, 2.4, 46, 1, K.lit); RR(44.6, -46, 2.4, 46, 1, K.dark);
      P([[-48, -46], [46, -46], [46 + D, -46 - DY], [-48 + D, -46 - DY]], K.lit);                          // 윗면 틀
      RR(-48, -48, 96, 2.6, 1, K.mid);
      [41, 47].forEach((x) => RR(x, -56, 1.6, 56, .8, K.dark));
      ctx.strokeStyle = K.mid; ctx.lineWidth = .9; ctx.beginPath(); ctx.rect(42, -56, 4.6, 40); for (let y = -50; y < -16; y += 6) { ctx.moveTo(42, y); ctx.lineTo(46.6, y); } ctx.stroke();
      at(-10, -48, () => { ctx.rotate(Math.sin(time * 1.6) * .06); L(0, 0, 0, 4, t('#3b3049'), .4); RR(-9, 4, 18, 10, .8, t('#fff3a8')); ctx.fillStyle = t('#d93a3a'); ctx.font = 'bold 2.6px sans-serif'; ctx.textAlign = 'center'; text('포획 중', 0, 8.4); ctx.fillStyle = t('#3b3049'); ctx.font = '1.9px sans-serif'; text('건드리지 마세요', 0, 11.6); });
    } },
  } };

  /* ───── 큰 그림 (길어서 따로 둔다) ───── */
  function lyingDog(time, t, coat, seed) {
    const br = Math.sin(time * 1.5 + seed) * .4, fur = t(coat.fur), cream = t(coat.cream);
    E(-30, -7 + Math.sin(time * 3 + seed) * 1.2, 6, 6, fur);
    [[12, -2], [22, -2]].forEach(([x, y]) => { RR(x - 8, y - 3, 13, 6, 3, fur); E(x + 5, y + .6, 3.2, 2, cream); });
    fluff(-6, -11 - br * .5, 22, 9, 12, 5.4, fur);
    flat(() => faded(.3, () => E(-4, -3, 20, 3, t(shade(coat.fur)))));
    flat(() => faded(.45, () => E(-12, -18 - br, 10, 2.6, t(lite(coat.fur, .3)))));
    at(0, 2 - br * .5, () => drawDogHead(time + seed, t, coat, { sleepy: seed > 1, fold: seed < 1 }, 22, -22));
  }

  function excavator(time, t) {
    const yel = '#f2b84a', lift = Math.sin(time * .9) * .05;
    const Y = planes(t, yel), TR = planes(t, '#4a4552'), ST = planes(t, '#c9c4cc'), BK = planes(t, '#5f5a66');
    // 무한궤도: 둥근 고무띠 한 장, 볕 받는 윗면 띠, 양 끝 바퀴와 가운데 롤러 몇 개
    blob([[-150, 0], [-158, -14], [-150, -40], [110, -40], [126, -16], [114, 0]], TR.deep);
    P([[-148, -40], [110, -40], [116, -34], [-152, -34]], TR.lit);
    [[-134, 13], [104, 13]].forEach(([x, r]) => { E(x, -20, r, r, TR.mid); E(x - 1.5, -21.5, r * .45, r * .45, TR.lit); });
    for (let i = 0; i < 4; i++) { const x = -88 + i * 46; E(x, -14, 7, 7, TR.mid); E(x - .8, -14.8, 3, 3, TR.lit); }
    boxFaces(TR, -120, 70, -42, 20, 10);                                                                 // 선회대
    // 몸통: 볕 받는 윗면, 앞면, 둥근 뒤 평형추는 그늘
    boxFaces(Y, -140, -28, -62, 84, 12);
    sheet([[-140, -66], [-158, -70, -160, -120, -140, -124]], Y.dark);
    RR(-120, -110, 70, 8, 2, TR.deep); ctx.fillStyle = TR.deep; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; text('HD 210', -85, -120);
    // 운전석: 앞면 · 볕 받는 지붕 · 그늘진 오른쪽 옆면, 유리에 비친 빛 한 조각
    boxFaces(Y, -20, 48, -62, 168, 12);
    RR(-12, -220, 50, 80, 4, TR.deep); RR(-9, -217, 44, 74, 3, t('#a9cbd6'));
    faded(.6, () => P([[-6, -214], [8, -214], [-6, -170]], '#ffffff'));
    const arm = (len, w) => {   // 팔 한 마디: 볕 받는 윗날, 몸, 그늘진 아랫날
      RR(-10, -w / 2, len, w, w / 2, Y.dark); RR(-10, -w / 2, len - 4, w * .78, w * .4, Y.mid); RR(-4, -w / 2, len - 18, w * .26, w * .13, Y.lit);
    };
    at(40, -120, () => {
      ctx.rotate(-.75 + lift);
      arm(180, 28); RR(10, -22, 120, 7, 3.5, ST.mid); RR(10, -22, 120, 2.4, 1.2, ST.lit);
      at(168, 0, () => {
        ctx.rotate(2.1 - lift * 3);
        arm(140, 22); RR(10, 10, 90, 6, 3, ST.mid); RR(10, 10, 90, 2, 1, ST.lit);
        at(132, 0, () => {
          ctx.rotate(-.6 + lift * 4);
          const bucket = [[-8, -12], [40, -18], [52, 6], [30, 30], [-4, 18]];
          [[50, 2], [46, 12], [38, 22]].forEach(([x, y]) => P([[x, y - 3], [x + 8, y], [x, y + 3]], ST.lit));
          blob(bucket, BK.mid);
          inside(bucket, () => { P([[-12, -20], [44, -24], [20, 2], [-12, 6]], BK.lit); P([[30, 40], [60, 0], [60, 40]], BK.dark); });
          for (let i = 0; i < 4; i++) { const p = (time * .8 + i / 4) % 1; faded(1 - p, () => E(20 + i * 6, 26 + p * 90, 2 + i % 2, 2, t('#b8a594'))); }
        });
      });
    });
    faded(.35, () => [[-60, -6, 40], [80, -4, 30]].forEach(([x, y, r]) => E(x + Math.sin(time + x) * 3, y, r, 6, t('#d9cbb6'))));
  }

  function snare(time, t) {
    const sw = Math.sin(time * 1.6) * .08, BK = planes(t, '#6b4f3a'), ST = planes(t, '#8f7458');
    // 덤불: 잎 덩어리 한 장(볕 받는 왼쪽 위, 그늘진 오른쪽 아래)이 바람에 살짝 흔들린다
    L(-14, 0, -16, -24, BK.mid, 2.4);
    at(Math.sin(time * 1.2) * .3, 0, () => leafMass(-14, -28, 17, 18, .37, t, 7));
    [[-8, -16], [-20, -34], [-4, -38]].forEach(([x, y]) => { E(x, y, 1.3, 1.3, t('#c4565a')); E(x - .4, y - .4, .4, .4, WHITE); });
    curve([[-8, -44], [6, -50], [20, -48]], BK.mid, 2);
    at(16, -48, () => { ctx.rotate(sw); L(0, 0, 0, 14, t('#f4f1ea'), .3); sausage(-3, 16, 1.4, 7, t, false); });
    RR(22, -14, 2.4, 14, .8, ST.dark); RR(22, -14, 1.2, 14, .6, ST.lit); P([[22, -14], [24.4, -14], [23.2, -15.6]], ST.lit);   // 땅에 박은 말뚝
    ctx.strokeStyle = t('#b7bcc8'); ctx.lineWidth = .55; ctx.beginPath(); ctx.ellipse(14, -8, 7, 6.4, -.2, 0, TAU); ctx.moveTo(21, -6); ctx.lineTo(23, -10); ctx.stroke();
    faded(.4 + Math.sin(time * 3) * .4, () => { P([[8, -14], [8.6, -12.2], [10.4, -11.6], [8.6, -11], [8, -9.2], [7.4, -11], [5.6, -11.6], [7.4, -12.2]], WHITE); });
  }

  function dogTruck(time, t) {
    const blue = '#5f8fc4', cage = '#8d8a9c', B = planes(t, blue), CH = planes(t, '#5f6476'), TI = planes(t, '#3a3445'), SP = planes(t, '#e9e4ec');
    [[-120, 0], [96, 0]].forEach(([x]) => {   // 바퀴는 돌지 않는다: 볕 받는 왼쪽 위 초승달, 휠
      E(x, -28, 28, 28, TI.deep); E(x - 1.2, -29.2, 26.6, 26.6, TI.lit); E(x + .5, -27.5, 26, 26, TI.mid);
      E(x, -28, 14, 14, t('#b7bcc8')); E(x + .8, -27.2, 10, 10, t('#9aa0ab')); E(x, -28, 4, 4, CH.mid);
    });
    boxFaces(CH, -176, 170, -42, 18, 6);                                                                // 차대
    // 운전석: 둥근 앞코 한 장, 볕 받는 지붕, 그늘진 앞면(오른쪽)
    const cab = [[70, -60], [70, -136], [72, -148, 84, -150], [140, -150], [154, -150, 160, -136], [162, -100], [162, -60]];
    sheet(cab, B.mid);
    sheetIn(cab, () => { P([[60, -160], [170, -160], [170, -142], [60, -142]], B.lit); P([[150, -150], [170, -150], [170, -50], [154, -50]], B.dark); });
    RR(98, -140, 52, 42, 6, TI.mid); RR(101, -137, 46, 36, 5, t('#a9cbd6')); faded(.5, () => P([[106, -134], [118, -134], [106, -110]], '#ffffff'));
    RR(150, -84, 14, 8, 3, t('#fff3b8')); RR(76, -96, 18, 3, 1.5, B.dark);
    at(112, -150, () => { RR(-3, -14, 6, 14, 1, CH.mid); P([[-14, -30], [14, -22], [14, -10], [-14, -4]], SP.mid); P([[-14, -30], [14, -22], [14, -18], [-14, -24]], SP.lit); E(14, -16, 3, 7, SP.dark); });   // 확성기
    const p = (time * 1.2) % 1;
    faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(132, -166, 10 + i * 7 + p * 8, -.8, .4); ctx.stroke(); }));
    boxFaces(B, -176, 68, -58, 8, 4);                                                                    // 짐칸 바닥
    for (let row = 0; row < 2; row++) for (let c = 0; c < 4; c++) cageBox(time, t, -170 + c * 58, -66 - row * 52, cage, row * 4 + c);
    at(-96, 0, () => stand(time, t, { top: '#7a8a5e', bottom: '#4a4560', shoe: '#2f2a3a', backArm: [[-10, -100], [-8, -80]],
      face: face(time, t, (hx, hy, r) => { RR(hx - r * 1.1, hy - r * 1.06, r * 2.1, r * .6, r * .3, t('#3d4c66')); RR(hx + r * .3, hy - r * .66, r, r * .22, r * .1, t('#3d4c66')); }, 'smile'),
      reach: [[18, -132], [26, -150], -1.2, 'grip'],
      hold: (x, y, gx, gy) => at(gx + 1.5, gy - 4, () => { ctx.rotate(Math.sin(time * 4) * .25); blob([[-3, -1], [2, -5], [6, -3], [5, 4], [-1, 5]], t(MEAT)); E(1, -2, 1.4, .8, t('#f2c6c0')); }) }));
  }

  function cageBox(time, t, x, y, c, i) {
    const K = planes(t, c);
    RR(x, y - 50, 54, 50, 2, t('#3a3445'));
    const shown = i % 3 !== 1;
    if (shown) {
      const coat = [COATS.white, COATS.brindle, COATS.hero, COATS.black][i % 4];
      at(x + 27, y - 4, () => { ctx.scale(.7, .7); drawDogHead(time + i, t, coat, { fold: i % 2 === 0, look: 3 }, -6, -26); });
    }
    // 철창: 살은 성기게, 틀은 볕 받는 윗날·그늘진 오른쪽 기둥
    ctx.strokeStyle = K.mid; ctx.lineWidth = 1.4; ctx.beginPath();
    for (let k = 9; k < 54; k += 9) { ctx.moveTo(x + k, y - 50); ctx.lineTo(x + k, y); }
    ctx.stroke();
    R(x, y - 50, 2, 50, K.lit); R(x + 52, y - 50, 2.4, 50, K.dark); R(x, y - 2, 54, 2, K.dark);
    P([[x, y - 50], [x + 54, y - 50], [x + 56, y - 53], [x + 2, y - 53]], K.lit);
  }
})());
