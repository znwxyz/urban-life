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
  const GRANNY = { top: '#a77bb0', bottom: '#5f6f86', hair: '#d9d4dc', shoe: '#5a4f5f' };
  const ALBA = { top: '#3f9f7f', under: '#f4f1ea', bottom: '#4a4f66', hair: '#2f2a3a', shoe: '#f4f1ea' };

  const at = (x, y, draw) => { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); };
  const faded = (a, draw) => { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, a)); draw(); ctx.restore(); };
  const lite = (c, k = .35) => mix(c, '#ffffff', k);
  /** 글자는 좌우가 뒤집힌 그림(flip)에서도 바로 읽히게 쓴다 */
  function text(str, x, y) {
    if (ctx.getTransform().a >= 0) { ctx.fillText(str, x, y); return; }
    ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.fillText(str, 0, 0); ctx.restore();
  }
  const sized = (k, draw) => { ctx.save(); ctx.scale(k, k); draw(); ctx.restore(); };

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
  /** 손. (x, y)는 손목, ang 방향으로 뻗는다. pose 'open' 편 손 · 'grip' 쥔 손 · 'pinch' 집은 손. 손톱과 마디를 그린다 */
  function hand(x, y, ang, s, t, pose = 'open', glove = null) {
    const base = glove || SKIN, skin = t(base), dk = t(shade(base)), nail = t(lite(base, .55));
    at(x, y, () => {
      ctx.rotate(ang); ctx.scale(s, s);
      blob([[-.6, -2.6], [4.4, -3.4], [6.8, -2.2], [7, 2.4], [4.6, 3.4], [-.6, 2.8]], skin);
      if (pose === 'open') {
        [[-2.1, 4.3], [-.7, 4.9], [.75, 4.6], [2.1, 3.8]].forEach(([fy, len]) => {
          curve([[6.2, fy], [6.2 + len * .55, fy - .1], [6.2 + len, fy + .25]], dk, 1.62);
          curve([[6.2, fy - .1], [6.2 + len * .55, fy - .2], [6.2 + len - .1, fy + .1]], skin, 1.32);
          E(6.2 + len - .35, fy - .02, .42, .4, nail);
        });
      } else {
        [-2.1, -.7, .75, 2.1].forEach((fy, i) => { E(7.2 + (i === 3 ? -.3 : 0), fy, 1.15, .78, dk); E(7.05, fy - .08, 1, .66, skin); L(6, fy + .7, 6.8, fy + .7, dk, .22); });
        if (pose === 'pinch') E(8.4, -2.3, .45, .4, nail);
      }
      curve([[1.2, -2.6], [3.6, -4.6], [6.2 + (pose === 'open' ? 0 : 1.6), -4.8]], dk, 1.9);
      curve([[1.2, -2.7], [3.6, -4.6], [6 + (pose === 'open' ? 0 : 1.6), -4.8]], skin, 1.6);
      E(6 + (pose === 'open' ? 0 : 1.6), -4.85, .45, .4, nail);
      faded(.5, () => L(1.4, -1.2, 4, -1.6, dk, .25));
    });
  }

  /** 팔: 어깨 → 팔꿈치 → 손목. 소매와 소매단까지 */
  function arm(sh, el, wr, sleeve, w, t, cuff) {
    curve([sh, el, wr], t(shade(sleeve)), w + .8);
    curve([sh, el, [wr[0] - (wr[0] - el[0]) * .02, wr[1] - (wr[1] - el[1]) * .02]], t(sleeve), w);
    const a = Math.atan2(wr[1] - el[1], wr[0] - el[0]);
    at(wr[0], wr[1], () => { ctx.rotate(a); RR(-2.6, -w * .58, 3, w * 1.16, 1, t(cuff || lite(sleeve, .25))); });
  }

  /** 쪼그려 앉은 사람(키 약 115). o: 옷색 + face(hx, hy, r) + reach: [팔꿈치, 손목, 손각도, 자세] + hold(손목 x, y) */
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
    const [el, wr, ang, pose] = o.reach;
    arm([4, -86 + br], el, wr, o.top, 7.2, t);
    if (o.hold) o.hold(wr[0], wr[1]);
    hand(wr[0], wr[1], ang, 1, t, pose);
    if (o.front) o.front(wr[0], wr[1]);
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
    const [el, wr, ang, pose] = o.reach;
    arm([4, -122 + br], el, [wr[0], wr[1] + br * .5], o.top, 7.4, t);
    if (o.hold) o.hold(wr[0], wr[1] + br * .5);
    hand(wr[0], wr[1] + br * .5, ang, 1, t, pose, o.glove);
    if (o.front) o.front(wr[0], wr[1] + br * .5);
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

  const grannyHair = (t) => (hx, hy, r) => {
    blob([[hx - r * 1.05, hy + r * .2], [hx - r * .9, hy - r * .8], [hx, hy - r * 1.12], [hx + r * .8, hy - r * .78], [hx + r * .5, hy - r * .5], [hx - r * .2, hy - r * .5], [hx - r * .5, hy + r * .1]], t(GRANNY.hair));
    [[-.75, -.6], [-.35, -.95], [.15, -1], [.55, -.8], [-.95, -.15]].forEach(([dx, dy]) => E(hx + r * dx, hy + r * dy, r * .26, r * .24, t(GRANNY.hair)));
    faded(.6, () => [[-.4, -1], [.1, -1.05]].forEach(([dx, dy]) => E(hx + r * dx, hy + r * dy, r * .12, r * .08, WHITE)));
  };
  const wrinkles = (t) => (hx, hy, r) => [[.62, .02], [.68, .12]].forEach(([dx, dy]) => L(hx + r * (dx + .14), hy + r * dy, hx + r * (dx + .26), hy + r * (dy + .04), t(shade(SKIN)), r * .04));
  const ponytail = (t, c) => (hx, hy, r) => {
    blob([[hx - r * 1.04, hy + r * .3], [hx - r * .9, hy - r * .78], [hx, hy - r * 1.1], [hx + r * .9, hy - r * .7], [hx + r * .96, hy - r * .3], [hx + r * .2, hy - r * .55], [hx - r * .4, hy + r * .05]], t(c));
    curve([[hx - r * .9, hy - r * .55], [hx - r * 1.6, hy - r * .1], [hx - r * 1.5, hy + r * .7]], t(c), r * .5);
    RR(hx - r * 1.06, hy - r * .74, r * .22, r * .36, r * .1, t('#e6765f'));
  };
  const shortHair = (t, c) => (hx, hy, r) => blob([[hx - r * 1.04, hy + r * .25], [hx - r * .95, hy - r * .78], [hx, hy - r * 1.12], [hx + r * .9, hy - r * .72], [hx + r * .9, hy - r * .4], [hx + r * .3, hy - r * .55], [hx - r * .35, hy - r * .1]], t(c));

  /* ───── 물건 ───── */
  function brick(x, y, w, h, c, t) { RR(x, y, w, h, .8, t(shade(c))); RR(x, y, w - 1, h - 1, .8, t(c)); faded(.5, () => R(x + .6, y + .5, w - 2.4, .6, t(lite(c, .4)))); }
  function nailUp(x, y, h, t) { L(x, y, x + h * .12, y - h, t(RUST), .8); E(x + h * .12, y - h, .9, .35, t('#8a4a32')); faded(.6, () => L(x - .2, y - h * .3, x - .1, y - h * .7, t('#e6b08a'), .25)); }
  function sausage(x, y, rot, len, t, peeled) {
    at(x, y, () => {
      ctx.rotate(rot);
      curve([[0, 0], [len * .5, -.4], [len, 0]], t('#c96a4a'), 2.6);
      curve([[.4, -.3], [len * .5, -.8], [len - .4, -.4]], t('#e8906a'), .9);
      if (peeled) { P([[len, 0], [len + 3, -2.6], [len + 3.6, 1.4]], t('#f2a33a')); P([[len, .2], [len + 2, 2.8], [len + .4, 2]], t('#d9822a')); }
    });
  }

  return { hero: (time, moving, eye, t) => drawDog(time, t, COATS.hero, { moving, mouth: moving ? 'open' : null }), art: {
    /* G1 마루 밑, 헌 담요 위에서 엉겨 자는 형제들 */
    'dog:pupNest': { w: 72, h: 26, d: (time, t) => {
      const wool = '#c97b7b', check = '#e9c46a';
      blob([[-34, 0], [-36, -6], [-28, -12], [-6, -14], [16, -13], [32, -9], [36, -2], [34, 0]], t(shade(wool)));
      inside([[-34, 0], [-36, -6], [-28, -12], [-6, -14], [16, -13], [32, -9], [36, -2], [34, 0]], () => {
        for (let x = -34; x < 36; x += 7) R(x, -16, 2.2, 16, t(check));
        for (let y = -12; y < 0; y += 5) R(-36, y, 72, 1.6, t(lite(wool, .3)));
      });
      at(-18, -6, () => curledDog(time, t, COATS.brindle, .42, 0));
      at(14, -6, () => curledDog(time, t, COATS.white, .44, 1));
      at(-2, -9, () => curledDog(time, t, COATS.hero, .46, 2));
      at(26, -3, () => { ctx.scale(-1, 1); curledDog(time, t, COATS.black, .36, 3); });
      blob([[-36, 0], [-30, -4], [-22, -2], [-26, 0]], t(wool)); blob([[28, 0], [33, -5], [38, -1], [36, 0]], t(wool));
    } },
    /* G1 대문에 빨간 X, 파란 방수포 지붕의 철거 예정 빈집 */
    'dog:redXHouse': { w: 172, h: 196, d: (time, t) => sized(.75, () => {
      const wall = '#d9cbb6';
      RR(-108, -200, 216, 200, 3, t(shade(wall)));
      RR(-108, -200, 196, 200, 3, t(wall));
      faded(.5, () => [[-90, -170, 30], [40, -60, 40], [-30, -40, 24]].forEach(([x, y, w]) => blob([[x, y], [x + w, y + 2], [x + w - 6, y + 14], [x + 4, y + 10]], t(lite(wall, .3)))));
      ctx.strokeStyle = t('#8d7f70'); ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(60, -200); ctx.lineTo(52, -170); ctx.lineTo(58, -150); ctx.lineTo(48, -120); ctx.stroke();
      P([[-122, -196], [0, -258], [122, -196]], t('#5a6274'));
      blob([[-110, -200], [-80, -238], [-20, -252], [40, -246], [104, -206], [60, -194], [-40, -198]], t(TARP));
      inside([[-110, -200], [-80, -238], [-20, -252], [40, -246], [104, -206], [60, -194], [-40, -198]], () => { [-60, -10, 40].forEach((x) => L(x, -260, x + 20, -190, t(shade(TARP)), 2)); faded(.6, () => E(-40, -238, 30, 5, t(lite(TARP, .4)))); });
      [[-70, -248], [10, -258], [70, -230]].forEach(([x, y]) => { RR(x - 5, y, 10, 7, 2, t('#8d8a9c')); RR(x - 5, y, 10, 2.4, 1, t('#b7b3c0')); });
      RR(-90, -150, 64, 52, 2, t('#6b5a4e')); RR(-86, -146, 56, 44, 1, t('#3a3445'));
      [[-.08, -138], [.12, -120], [-.05, -108]].forEach(([a, y]) => at(-58, y, () => { ctx.rotate(a); RR(-36, -5, 72, 9, 1.5, t('#c9a27c')); RR(-36, -5, 72, 2, 1, t(lite('#c9a27c', .3))); [-30, 28].forEach((x) => E(x, -.5, 1, 1, t('#5f6476'))); }));
      RR(4, -168, 72, 168, 2, t('#4f6f8a')); RR(10, -162, 60, 162, 1, t('#6a8aa6'));
      [[10, -162, 60, 60], [10, -96, 60, 90]].forEach(([x, y, w, h]) => { RR(x + 5, y + 5, w - 10, h - 10, 1, t(shade('#6a8aa6'))); });
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
    'dog:excavator': { w: 302, h: 238, d: (time, t) => sized(.72, () => excavator(time, t)) },
    /* D11 철거 잔해: 판자에 박힌 녹슨 못 */
    'dog:rubbleNail': { w: 70, h: 26, d: (time, t) => {
      [[-32, -8, 16, 8], [-18, -9, 15, 9], [-26, -16, 14, 8], [18, -7, 14, 7]].forEach(([x, y, w, h]) => brick(x, y, w, h, '#b36b4f', t));
      blob([[-30, 0], [-20, -5], [-6, -3], [4, -6], [12, 0]], t(CEMENT));
      at(0, -4, () => { ctx.rotate(-.08); RR(-14, -3, 40, 5, 1, t('#8f7458')); RR(-14, -3, 40, 1.4, .6, t('#b39272')); [[-6, -2.5], [6, -2.6], [18, -2.8]].forEach(([x, y]) => L(x - 3, y + 2, x + 3, y + 2.4, t(shade('#8f7458')), .3)); });
      [[-6, -7, 7], [6, -7.4, 6], [18, -7.8, 8]].forEach(([x, y, h]) => nailUp(x, y, h, t));
      faded(.5 + Math.sin(time * 3) * .3, () => E(19, -15.6, .7, .7, WHITE));
    } },

    /* G3 쪼그려 앉아 양은 냄비를 내미는 할머니 */
    'dog:grandmaBowl': { w: 90, h: 120, d: (time, t) => crouch(time, t, {
      ...GRANNY, face: face(time, t, grannyHair(t), 'smile', wrinkles(t)),
      pattern: true,
      reach: [[18, -64], [26, -40], .5, 'grip'],
      hold: (x, y) => at(x + 9, y + 6, () => {
        const pot = '#d9b45a';
        RR(-16, -4, 32, 13, 4, t(shade(pot))); RR(-16, -4, 28, 13, 4, t(pot));
        E(0, -4, 16, 3.4, t(lite(pot, .25))); E(0, -4, 14, 2.4, t('#e8c890'));
        [[-6, -4.6], [-1, -3.8], [4, -4.8], [8, -3.6]].forEach(([x2, y2]) => E(x2, y2, 1.6, .9, t('#fffaf0')));
        E(3, -4.2, 2.6, 1, t('#7fa64e'));
        [[-17.5, -1], [17.5, -1]].forEach(([x2, y2]) => RR(x2 - 2, y2 - 1, 4, 2.4, 1, t(shade(pot))));
        faded(.4, () => [[-8, 0], [2, 5], [9, 1]].forEach(([x2, y2]) => L(x2, y2, x2 + 3, y2 - 2, t(shade(pot)), .5)));
        steam(-4, -8, 16, time, t('#ffffff')); steam(5, -8, 13, time + 1.4, t('#ffffff'));
      }),
    }) },
    /* G3 담벼락에 붙은 민원 쪽지 */
    'dog:complaintNote': { w: 74, h: 130, d: (time, t) => {
      block(-36, -128, 72, 128, '#cbb8a6', t);
      for (let y = -120; y < 0; y += 10) R(-36, y, 61, .7, t('#b8a594'));
      at(-6, -92, () => {
        ctx.rotate(-.05 + Math.sin(time * 1.6) * .012);
        RR(-14, -2, 28, 38, .6, t('#d8d4cc')); RR(-15, -3, 28, 38, .6, t('#fffdf6'));
        [[-17, -5, .6], [9, -5, -.6]].forEach(([x, y, a]) => at(x + 4, y + 1, () => { ctx.rotate(a); faded(.7, () => RR(-4, -1.2, 8, 2.6, .3, t('#efe6c4'))); }));
        ctx.fillStyle = t('#d93a3a'); ctx.textAlign = 'center'; ctx.font = 'bold 5px sans-serif';
        text('개 밥', -1, 7); text('주지 마세요!!', -1, 13);
        ctx.fillStyle = t('#3b3049'); ctx.font = '2.4px sans-serif'; ['밥 주는 분 때문에', '들개가 모입니다.', '민원 넣겠습니다.', '- 203호 -'].forEach((s, i) => text(s, -1, 20 + i * 3.6));
      });
      at(20, -54, () => { ctx.rotate(.08); RR(-6, -2, 12, 16, .5, t('#fff3a8')); ctx.fillStyle = t('#3b3049'); ctx.font = '2.6px sans-serif'; ctx.textAlign = 'center'; text('불쌍해요', 0, 5); text('ㅠㅠ', 0, 9); });
    } },

    /* G4·S1·D3 구석에 놓인 고기: 파란 쥐약 알갱이와 굴러다니는 농약병 */
    'dog:poisonBait': { w: 46, h: 14, d: (time, t) => {
      blob([[-20, 0], [-18, -3], [-6, -4.4], [10, -3.6], [17, -1.4], [16, 0]], t('#e4dfd2'));
      faded(.6, () => [-14, -8, -2, 4].forEach((x) => L(x, -2.4, x + 4, -2.6, t('#9a958a'), .35)));
      blob([[-10, -2.6], [-8, -7.6], [0, -9], [7, -7], [8, -3], [0, -2]], t(MEAT));
      inside([[-10, -2.6], [-8, -7.6], [0, -9], [7, -7], [8, -3], [0, -2]], () => { curve([[-8, -6], [-2, -4.6], [4, -7.4]], t('#f2c6c0'), 1); E(4, -3, 5, 1.6, t(shade(MEAT))); });
      E(-5, -7.6, 1.6, .7, t(lite(MEAT, .5)));
      [[-13, -1], [9, -1.2], [5, -9.6], [-4, -9.6], [12, -.6], [-1, -6]].forEach(([x, y], i) => { E(x, y, .9, .7, t(i % 2 ? '#5fa8ff' : '#4fd1b0')); E(x - .3, y - .25, .3, .2, WHITE); });
      at(20, -2.4, () => { ctx.rotate(-1.45); RR(-2.4, -6, 4.8, 10, 1.6, t('#3f8f5f')); RR(-1.2, -8.4, 2.4, 2.8, .6, t('#e9e4ec')); RR(-2.4, -3, 4.8, 5, .4, t('#fffaf0')); E(0, -1.2, 1, .9, t('#3b3049')); RR(-.7, -.6, 1.4, .8, .3, t('#3b3049')); L(-1.4, 1, 1.4, 1.6, t('#3b3049'), .3); L(-1.4, 1.6, 1.4, 1, t('#3b3049'), .3); E(-.4, -1.3, .25, .25, WHITE); E(.4, -1.3, .25, .25, WHITE); faded(.5, () => R(-2, -5.6, 1, 9, t('#8fd1a8'))); });
      faded(.35, () => [-3, 3].forEach((x, i) => steam(x, -10, 8, time + i, t('#b6d68a'))));
    } },
    /* G4 감자탕집 뒷문, 등뼈를 담은 빨간 바가지 */
    'dog:backdoorCook': { w: 120, h: 210, d: (time, t) => {
      RR(-48, -208, 96, 208, 2, t('#7d8794')); RR(-42, -202, 84, 202, 1, t('#f2c27a'));
      faded(.35, () => P([[-42, 0], [42, 0], [70, 8], [-60, 8]], t('#fff0c8')));
      RR(28, -202, 22, 202, 1, t('#9aa6b4')); RR(44, -202, 6, 202, 1, t(shade('#9aa6b4')));
      stand(time, t, { top: '#f4f1ea', bottom: '#3d4c66', shoe: '#3b3049', backArm: [[-14, -100], [-12, -80]],
        vest: (br) => { blob([[-11, -120 + br], [10, -120 + br], [11, -74], [-12, -74]], t('#ffffff')); blob([[-11, -116 + br], [-6, -128 + br], [-3, -118 + br]], t('#ffffff')); L(-12, -100, 12, -100, t('#d8d4cc'), 1); },
        face: face(time, t, (hx, hy, r) => { shortHair(t, '#2f2a3a')(hx, hy, r); RR(hx - r * 1.06, hy - r * .78, r * 2, r * .36, r * .16, t('#e6765f')); }, 'smile'),
        reach: [[22, -104], [30, -86], -.2, 'grip'],
        hold: (x, y) => at(x + 9, y + 2, () => {
          RR(-11, -2, 22, 10, 4, t(shade('#d9534f'))); RR(-11, -2, 19, 10, 4, t('#d9534f')); E(0, -2, 11, 2.6, t('#b8423f'));
          [[-6, -4, .4], [0, -5, -.3], [5, -4, .2]].forEach(([bx, by, a]) => at(bx, by, () => { ctx.rotate(a); RR(-3, -1.4, 6, 2.8, 1.4, t('#f1e4cc')); E(-3, 0, 1.6, 1.6, t('#f1e4cc')); E(3, 0, 1.6, 1.6, t('#f1e4cc')); E(0, -.2, 1.4, .8, t('#c4565a')); }));
          RR(10, 1, 9, 3, 1.5, t('#d9534f'));
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
      block(-62, -230, 124, 230, '#c98f6e', t);
      for (let r = 0; r < 19; r++) { R(-62, -230 + r * 12, 106, .8, t('#e0b49a')); for (let x = -62 + (r % 2) * 13; x < 44; x += 26) R(x, -230 + r * 12, .8, 12, t('#e0b49a')); }
      RR(-26, -176, 44, 34, 2, t('#9aa3b5')); RR(-23, -173, 38, 28, 1, t('#4a4560'));
      for (let i = 0; i < 5; i++) { RR(-23, -172 + i * 5.6, 38, 3, .6, t('#b7bcc8')); R(-23, -170 + i * 5.6, 38, .8, t(shade('#b7bcc8'))); }
      RR(-21, -146, 34, 2, 1, t('#e8a35e'));
      [-14, -2, 10].forEach((x, i) => steam(x, -178, 46, time + i * .8, t('#ffffff')));
      at(40, 0, () => { ctx.rotate(-.12); RR(-1.2, -120, 2.4, 100, 1.2, t('#c9a27c')); blob([[-8, -22], [8, -22], [12, 0], [-12, 0]], t('#d9c27a')); for (let x = -10; x <= 10; x += 2.5) L(x * .8, -18, x, 0, t(shade('#d9c27a')), .5); RR(-8, -24, 16, 3, 1, t('#e6765f')); });
      RR(-62, -4, 124, 4, 1, t(CEMENT));
    }) },

    /* G7·D6 덤불에 매단 소시지와 땅에 박힌 올무 */
    'dog:snare': { w: 64, h: 66, d: (time, t) => snare(time, t) },

    /* G8·D7 "개 삽니다" 확성기 1톤 트럭과 철창, 고기를 흔드는 아저씨 */
    'dog:dogTruck': { w: 400, h: 262, d: (time, t) => dogTruck(time, t) },

    /* G9 새벽 편의점 앞, 쪼그려 앉아 빨간 목줄을 내미는 알바 누나 */
    'dog:albaLeash': { w: 92, h: 122, d: (time, t) => crouch(time, t, {
      ...ALBA, face: face(time, t, ponytail(t, ALBA.hair), null),
      vest: (br) => { const v = [[-24.6, -37], [-23.6, -62], [-12, -85 + br], [-3, -89 + br], [4, -78], [9, -61], [4, -42], [-12, -33]]; blob(v, t(ALBA.top)); inside(v, () => { blob([[4, -82], [12, -78], [9, -56], [3, -42], [0, -62]], t(shade(ALBA.top))); curve([[-3, -89], [3, -78], [7, -60]], t('#f2d16b'), 1.2); }); RR(-1, -70, 7, 3.6, .8, t('#fffaf0')); R(0, -69, 4, .7, t('#5f8fb0')); E(-6, -54, 1.2, 1.2, t(shade(ALBA.top))); },
      top: '#f4f1ea', under: null,
      reach: [[20, -70], [32, -50], .35, 'open'],
      hold: (x, y) => {
        const sway = Math.sin(time * 2) * 1.5;
        curve([[x + 6, y - 2], [x + 10, y + 12], [x + 6 + sway, y + 26], [x + 2 + sway, y + 30]], t('#a8323a'), 2.2);
        curve([[x + 6, y - 2.4], [x + 10, y + 11.6], [x + 6 + sway, y + 25.6]], t('#e04a52'), 1);
        ctx.strokeStyle = t('#d9404a'); ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(x + 3 + sway, y + 34, 5, 3.4, .3, 0, TAU); ctx.stroke();
        RR(x + 6 + sway, y + 33, 2.6, 2.4, .5, t('#d9c27a'));
      },
    }) },
    /* G9 껍질을 반쯤 깐 소시지와 편의점 비닐 */
    'dog:sausageTray': { w: 30, h: 8, d: (time, t) => {
      blob([[-14, 0], [-12, -2.4], [6, -3], [14, -1.4], [13, 0]], t('#eef3f7'));
      faded(.6, () => L(-10, -1.6, 8, -2.2, t('#ffffff'), .5));
      sausage(-8, -3, -.06, 12, t, true);
      sausage(8, -1.4, .3, 4, t, false);
    } },

    /* G10·D10 낮은 탁자 위 뜯어 둔 초콜릿 */
    'dog:chocoTable': { w: 96, h: 46, d: (time, t) => {
      const wood = '#b98a5e';
      [[-38, 0], [32, 0]].forEach(([x]) => { RR(x, -36, 6, 36, 2, t(shade(wood))); RR(x, -36, 4, 36, 2, t(wood)); });
      RR(-46, -42, 92, 7, 2, t(shade(wood))); RR(-46, -42, 92, 4, 2, t(lite(wood, .15)));
      faded(.5, () => [-30, -6, 20].forEach((x) => L(x, -40.5, x + 12, -40.5, t(shade(wood)), .4)));
      at(-6, -42, () => { ctx.rotate(-.04); RR(-14, -2.4, 26, 2.6, .6, t('#c9c4cc')); RR(-14, -2.4, 12, 2.6, .6, t('#7a3b2e')); [-12, -8.4, -4.8].forEach((x) => R(x, -2.2, .4, 2.2, t('#5a2a20'))); RR(-2, -2.6, 16, 3, .6, t('#d9534f')); ctx.fillStyle = t('#fffaf0'); ctx.font = 'bold 1.8px sans-serif'; text('CHOCO', 1, -.6); });
      [[-30, -43.4], [16, -43.4]].forEach(([x, y]) => RR(x, y, 3, 1.6, .4, t('#7a3b2e')));
      at(28, -42, () => { RR(-4.4, -9, 9, 9, 2, t('#e6765f')); RR(-4.4, -9, 3, 9, 1.5, t(lite('#e6765f', .3))); ctx.strokeStyle = t('#e6765f'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(5, -4.6, 2.6, -1.4, 1.4); ctx.stroke(); steam(0, -10, 8, time, t('#ffffff')); });
      faded(.6, () => E(-20, -.5, 3, .6, t('#7a3b2e')));
    } },
    /* G10 누나가 깔아 준 방석과 뜯어 놓은 양말 */
    'dog:cushionBed': { w: 66, h: 18, d: (time, t) => {
      const c = '#8fb8a8';
      E(0, -4, 31, 6, t(shade(c))); E(-1, -6, 29, 6.6, t(c)); E(-4, -8.4, 18, 3, t(lite(c, .35)));
      faded(.5, () => [[-24, -4], [24, -4]].forEach(([x, y]) => E(x, y, 2, 1, t(shade(c)))));
      blob([[-6, -9], [6, -12], [16, -10], [14, -7], [2, -6]], t('#f4e1a8'));
      at(18, -3, () => { ctx.rotate(.2); blob([[-6, -1.6], [3, -2.4], [6, -1], [5, 1.4], [-6, 1.2]], t('#ff8fa3')); RR(-6, -1.6, 2.4, 2.8, .6, t('#fffaf0')); [3.2, 4.4].forEach((x) => L(x, 1.4, x + .6, 3, t('#ff8fa3'), .3)); });
    } },

    /* G11 공원 산책길, 목줄을 쥔 누나 (목줄은 주인공 쪽으로 늘어진다) */
    'dog:walkOwner': { w: 80, h: 172, d: (time, t) => stand(time, t, {
      top: '#e9b44c', bottom: '#4a4f66', shoe: '#f4f1ea', backArm: [[-12, -98], [-10, -78]],
      vest: () => { [-110, -100, -90].forEach((y) => L(-13, y, 12, y + 1, t(shade('#e9b44c')), .7)); RR(-14, -128, 28, 6, 3, t('#d9534f')); },
      face: face(time, t, ponytail(t, ALBA.hair), 'smile'),
      reach: [[16, -98], [26, -86], .4, 'grip'],
      front: (x, y) => { const k = Math.sin(time * 1.6) * .6; curve([[x + 7, y + 4], [x + 15, y + 18 + k], [x + 23, y + 32], [x + 31, y + 44]], t('#d9404a'), 1.4); },
    }) },
    /* G11 멀리 산등성이, 바위 위에서 우는 검둥이와 달 */
    'dog:howlRidge': { w: 224, h: 128, d: (time, t) => sized(.8, () => {
      blob([[-140, 0], [-110, -60], [-60, -96], [-10, -84], [40, -120], [100, -88], [140, -40], [140, 0]], t('#7f9a86'));
      blob([[-140, 0], [-90, -36], [-40, -48], [20, -40], [80, -56], [140, -20], [140, 0]], t('#5f7f6c'));
      for (let i = 0; i < 9; i++) { const x = -120 + i * 30 + hash(i, 4) * 10, h = 20 + hash(i, 5) * 14, y = -30 - hash(i, 6) * 10; P([[x, y - h], [x - 6, y], [x + 6, y]], t('#46634f')); }
      blob([[22, -120], [30, -126], [46, -124], [52, -116], [18, -114]], t('#4f5a66'));
      at(36, -122, () => { ctx.scale(.42, .42); silhouetteHowl(t); });
      const p = (time * .6) % 1;
      faded(1 - p, () => [0, 1, 2].forEach((i) => { ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(45, -142, 6 + i * 6 + p * 10, -2.4, -1.2); ctx.stroke(); }));
    }) },

    /* S1 산자락 바위 밑 굴, 방수포 조각과 굴 속에서 빛나는 눈 */
    'dog:hillDen': { w: 100, h: 62, d: (time, t) => {
      blob([[-48, 0], [-44, -30], [-20, -58], [16, -60], [42, -38], [48, 0]], t('#8d8a9c'));
      inside([[-48, 0], [-44, -30], [-20, -58], [16, -60], [42, -38], [48, 0]], () => { E(20, -20, 30, 50, t(shade('#8d8a9c'))); faded(.6, () => E(-24, -44, 16, 6, t(lite('#8d8a9c', .35)))); L(-10, -56, 0, -36, t(shade('#8d8a9c')), .8); });
      blob([[-22, 0], [-20, -18], [-6, -28], [10, -24], [18, 0]], t('#2a2535'));
      const blink = Math.sin(time * 1.3) > .95;
      [[-8, -14], [-2, -14.4], [6, -9], [11, -9.4]].forEach(([x, y]) => (blink ? L(x - 1, y, x + 1, y, t('#f2d16b'), .4) : E(x, y, 1, .9, t('#f2d16b'))));
      blob([[-46, -26], [-30, -40], [-18, -30], [-28, -16]], t(TARP)); L(-40, -28, -24, -32, t(shade(TARP)), .6);
      at(30, -2, () => { ctx.rotate(.3); RR(-6, -1, 12, 2, 1, t('#f1e4cc')); E(-6, 0, 1.6, 1.6, t('#f1e4cc')); E(6, 0, 1.6, 1.6, t('#f1e4cc')); });
    } },
    /* S1 공사장 컨테이너, 문 앞에 놓인 고기 그릇 */
    'dog:containerMeat': { w: 180, h: 150, d: (time, t) => {
      RR(-86, -140, 172, 132, 3, t(shade('#d9d4c4'))); RR(-86, -140, 160, 132, 3, t('#d9d4c4')); RR(-88, -144, 176, 6, 2, t('#b7b3a6'));
      for (let x = -80; x < 70; x += 10) R(x, -140, 2, 132, t('#c9c3b2'));
      RR(-60, -110, 42, 30, 2, t('#5f6476')); RR(-57, -107, 36, 24, 1, t('#f2c27a'));
      faded(.5, () => P([[-57, -107], [-40, -107], [-50, -83], [-57, -83]], t('#fff3d0')));
      RR(16, -120, 40, 112, 2, t('#b7b3a6')); E(48, -64, 2, 2, t('#5f6476'));
      [-70, 60].forEach((x) => RR(x, -8, 16, 8, 1, t('#6b6672')));
      at(-14, 0, () => { E(0, -2, 11, 3, t('#9aa3b5')); RR(-11, -5, 22, 4, 2, t('#c9d3de')); E(0, -5, 10, 2, t(MEAT)); [[-4, -6], [3, -6.4]].forEach(([x, y]) => E(x, y, 1, .7, t('#4fd1b0'))); });
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
      hand(13, -96 + Math.sin(time * 1.8) * .35, .42, 1, t, 'grip', '#e8e1c8');
    } },
    /* S2 분리수거장에 놓인 개 포획틀 */
    'dog:cageTrap': { w: 104, h: 64, d: (time, t) => {
      const steel = '#7d8794';
      RR(-48, -2, 96, 2, 1, t(steel));
      at(-28, -2, () => { blob([[-5, 0], [-2, -4], [4, -4.4], [7, -1], [4, 0]], t('#c97a3e')); RR(5, -3, 6, 1.6, .8, t('#f1e4cc')); E(11, -2.2, 1.2, 1.2, t('#f1e4cc')); });
      ctx.strokeStyle = t(steel); ctx.lineWidth = 1; ctx.beginPath(); ctx.rect(-46, -46, 92, 46);
      for (let x = -40; x < 46; x += 6) { ctx.moveTo(x, -46); ctx.lineTo(x, 0); }
      for (let y = -38; y < 0; y += 8) { ctx.moveTo(-46, y); ctx.lineTo(46, y); }
      ctx.stroke();
      RR(-48, -50, 96, 5, 1.5, t(shade(steel))); RR(-48, -50, 96, 1.6, .8, t(lite(steel, .4)));
      [41, 47].forEach((x) => RR(x, -56, 1.6, 56, .8, t(shade(steel))));
      ctx.strokeStyle = t(steel); ctx.lineWidth = .9; ctx.beginPath(); ctx.rect(42, -56, 4.6, 40); for (let y = -50; y < -16; y += 6) { ctx.moveTo(42, y); ctx.lineTo(46.6, y); } ctx.stroke();
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

  function silhouetteHowl(t) {
    const c = t('#2a2535');
    blob([[-26, -20], [-10, -30], [10, -30], [22, -36], [30, -58], [40, -62], [38, -48], [28, -28], [20, -18], [-20, -16]], c);
    [[-18, -18], [-10, -18], [12, -18], [18, -18]].forEach(([x, y]) => RR(x, y, 4, 18, 2, c));
    curve([[-24, -24], [-34, -34], [-30, -44]], c, 5);
    P([[28, -60], [30, -72], [34, -62]], c);
  }

  function excavator(time, t) {
    const yel = '#f2b84a', dk = '#3a3445', lift = Math.sin(time * .9) * .05;
    blob([[-150, 0], [-158, -14], [-150, -40], [110, -40], [126, -16], [114, 0]], t(dk));
    for (let i = 0; i < 7; i++) { const x = -132 + i * 38; E(x, -20, 12, 12, t('#5f5a66')); E(x, -20, 5, 5, t('#8d8a9c')); }
    for (let i = 0; i < 18; i++) R(-148 + i * 15, -42, 8, 4, t('#5f5a66'));
    RR(-120, -64, 200, 22, 4, t('#6b6672'));
    RR(-140, -150, 120, 88, 8, t(shade(yel))); RR(-140, -150, 112, 84, 8, t(yel));
    RR(-140, -150, 112, 6, 3, t(lite(yel, .35)));
    RR(-150, -122, 26, 56, 6, t('#cf9a32'));
    RR(-20, -230, 74, 168, 8, t(shade(yel))); RR(-20, -230, 68, 164, 8, t(yel));
    RR(-12, -220, 50, 80, 4, t('#3a3445')); RR(-9, -217, 44, 74, 3, t('#a9cbd6'));
    faded(.6, () => P([[-6, -214], [8, -214], [-6, -170]], '#ffffff'));
    RR(-120, -110, 70, 8, 2, t(dk)); ctx.fillStyle = t(dk); ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; text('HD 210', -85, -120);
    for (let i = 0; i < 6; i++) RR(-136 + i * 15, -96, 8, 20, 2, t('#cf9a32'));
    at(40, -120, () => {
      ctx.rotate(-.75 + lift);
      RR(-10, -14, 180, 28, 12, t(shade(yel))); RR(-10, -14, 174, 24, 12, t(yel)); RR(10, -22, 120, 7, 3.5, t('#c9c4cc'));
      at(168, 0, () => {
        ctx.rotate(2.1 - lift * 3);
        RR(-8, -11, 140, 22, 10, t(shade(yel))); RR(-8, -11, 136, 18, 10, t(yel)); RR(10, 10, 90, 6, 3, t('#c9c4cc'));
        at(132, 0, () => {
          ctx.rotate(-.6 + lift * 4);
          blob([[-8, -12], [40, -18], [52, 6], [30, 30], [-4, 18]], t('#5f5a66'));
          [[50, 2], [46, 12], [38, 22]].forEach(([x, y]) => P([[x, y - 3], [x + 8, y], [x, y + 3]], t('#b7b3c0')));
          for (let i = 0; i < 4; i++) { const p = (time * .8 + i / 4) % 1; faded(1 - p, () => E(20 + i * 6, 26 + p * 90, 2 + i % 2, 2, t('#b8a594'))); }
        });
      });
    });
    faded(.35, () => [[-60, -6, 40], [80, -4, 30]].forEach(([x, y, r]) => E(x + Math.sin(time + x) * 3, y, r, 6, t('#d9cbb6'))));
  }

  function snare(time, t) {
    const sw = Math.sin(time * 1.6) * .08, g = ['#3f6b48', '#4f7a52', '#6f9f6c', '#8fbf7a'];
    L(-14, 0, -16, -30, t('#6b4f3a'), 2.4); L(-15, -18, -4, -36, t('#6b4f3a'), 1.6);
    [[-24, -22, 12, 0], [-8, -26, 12, 0], [-16, -40, 13, 0], [-2, -42, 10, 0], [-22, -10, 10, 0],
      [-20, -24, 9, 1], [-6, -30, 8, 1], [-14, -42, 9, 1], [-24, -14, 7, 1], [-2, -44, 6, 2], [-18, -45, 6, 2], [-26, -24, 5, 2], [-10, -32, 4, 3]]
      .forEach(([x, y, r, k], i) => blob([[x - r, y + r * .3], [x - r * .6, y - r * .8], [x + r * .3, y - r], [x + r, y - r * .2], [x + r * .7, y + r * .7], [x - r * .3, y + r * .9]].map(([px, py]) => [px + Math.sin(time * 1.2 + i) * .3, py]), t(g[k])));
    [[-26, -30], [-12, -50], [2, -36], [-20, -6]].forEach(([x, y], i) => at(x, y, () => { ctx.rotate(i * 1.3 - .5); blob([[0, 0], [3, -2.2], [6.4, 0], [3, 1.8]], t(g[2])); L(0, 0, 6, 0, t(g[0]), .3); }));
    [[-8, -16], [-20, -34], [-4, -38]].forEach(([x, y]) => { E(x, y, 1.3, 1.3, t('#c4565a')); E(x - .4, y - .4, .4, .4, WHITE); });
    curve([[-8, -44], [6, -50], [20, -48]], t('#6b4f3a'), 2);
    at(16, -48, () => { ctx.rotate(sw); L(0, 0, 0, 14, t('#f4f1ea'), .3); sausage(-3, 16, 1.4, 7, t, false); });
    RR(22, -14, 2.4, 14, .8, t('#8f7458')); RR(22, -14, 2.4, 3, .8, t(lite('#8f7458', .3)));
    ctx.strokeStyle = t('#b7bcc8'); ctx.lineWidth = .55; ctx.beginPath(); ctx.ellipse(14, -8, 7, 6.4, -.2, 0, TAU); ctx.moveTo(21, -6); ctx.lineTo(23, -10); ctx.stroke();
    faded(.4 + Math.sin(time * 3) * .4, () => { P([[8, -14], [8.6, -12.2], [10.4, -11.6], [8.6, -11], [8, -9.2], [7.4, -11], [5.6, -11.6], [7.4, -12.2]], WHITE); });
  }

  function dogTruck(time, t) {
    const blue = '#5f8fc4', cage = '#8d8a9c';
    [[-120, 0], [96, 0]].forEach(([x]) => { E(x, -28, 28, 28, t('#2f2a3a')); E(x, -28, 14, 14, t('#b7bcc8')); E(x, -28, 4, 4, t('#5f6476')); });
    RR(-176, -60, 352, 18, 4, t('#5f6476'));
    RR(70, -150, 92, 96, 14, t(shade(blue))); RR(70, -150, 88, 92, 14, t(blue));
    RR(98, -140, 52, 42, 6, t('#3a3445')); RR(101, -137, 46, 36, 5, t('#a9cbd6')); faded(.5, () => P([[106, -134], [118, -134], [106, -110]], '#ffffff'));
    RR(150, -84, 14, 8, 3, t('#fff3b8')); RR(76, -96, 18, 3, 1.5, t(shade(blue)));
    at(112, -150, () => { RR(-3, -14, 6, 14, 1, t('#5f6476')); P([[-14, -30], [14, -22], [14, -10], [-14, -4]], t('#e9e4ec')); E(14, -16, 3, 7, t('#8d8a9c')); });
    const p = (time * 1.2) % 1;
    faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(132, -166, 10 + i * 7 + p * 8, -.8, .4); ctx.stroke(); }));
    RR(-176, -66, 244, 8, 2, t(shade(blue)));
    for (let row = 0; row < 2; row++) for (let c = 0; c < 4; c++) cageBox(time, t, -170 + c * 58, -66 - row * 52, cage, row * 4 + c);
    at(-96, 0, () => stand(time, t, { top: '#7a8a5e', bottom: '#4a4560', shoe: '#2f2a3a', backArm: [[-10, -100], [-8, -80]],
      face: face(time, t, (hx, hy, r) => { RR(hx - r * 1.1, hy - r * 1.06, r * 2.1, r * .6, r * .3, t('#3d4c66')); RR(hx + r * .3, hy - r * .66, r, r * .22, r * .1, t('#3d4c66')); }, 'smile'),
      reach: [[18, -132], [26, -150], -1.2, 'pinch'],
      front: (x, y) => at(x + 3, y - 8, () => { ctx.rotate(Math.sin(time * 4) * .25); blob([[-3, -1], [2, -5], [6, -3], [5, 4], [-1, 5]], t(MEAT)); E(1, -2, 1.4, .8, t('#f2c6c0')); }) }));
  }

  function cageBox(time, t, x, y, c, i) {
    RR(x, y - 50, 54, 50, 2, t('#3a3445'));
    const shown = i % 3 !== 1;
    if (shown) {
      const coat = [COATS.white, COATS.brindle, COATS.hero, COATS.black][i % 4];
      at(x + 27, y - 4, () => { ctx.scale(.7, .7); drawDogHead(time + i, t, coat, { fold: i % 2 === 0, look: 3 }, -6, -26); });
    }
    ctx.strokeStyle = t(c); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.rect(x, y - 50, 54, 50);
    for (let k = 6; k < 54; k += 6) { ctx.moveTo(x + k, y - 50); ctx.lineTo(x + k, y); }
    ctx.stroke();
    RR(x, y - 52, 54, 3, 1, t(lite(c, .3)));
  }
})());
