/* 매미 장면 전용 그림과 주인공 그림. 키는 'cicada:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   매미 눈높이(화면 폭 약 80cm)에 맞춰 실제 크기로 그린다: 허물 2.5cm, 개미 0.4cm, 운동화 24cm, 느티나무 줄기 30cm.
   조연은 제자리에서만 움직인다(숨쉬기·더듬이·날개 떨림·깜빡임). 걷거나 흘러가면 화면이 밀릴 때 뒷걸음처럼 보인다 */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.cicada = pack.hero; }
})((() => {
  const BODY = '#2f2a2b', BODY_HI = '#4d4446', MARK = '#7fae6a', BELLY = '#e2cfa4', WING = '#eaf6ff', VEIN = '#56664a';
  const BARK = '#8a7564', BARK_HI = '#a8927e', BARK_PEEL = '#c98d5a', SAP = '#e0a03a', SHELL = '#b07a3e';
  const LEAF = '#6fa86a', LEAF_DK = '#4f8a55', SOIL = '#7a5a44', SOIL_DK = '#4f3a2e', SMOKE = '#f4f1ea';

  /** 투명도를 잠깐 바꿔 그린다 */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, alpha)); draw(); ctx.restore(); }

  /** 곡선 경로를 칠한다. build(ctx)에서 moveTo/curveTo로 모양을 만든다 */
  function shape(color, build) { ctx.fillStyle = color; ctx.beginPath(); build(ctx); ctx.closePath(); ctx.fill(); }

  /** 곡선 선 */
  function curve(color, w, build) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(ctx); ctx.stroke(); ctx.restore();
  }

  /** 꺾인 다리 하나 (관절 두 개) */
  function leg(pts, color, w) { curve(color, w, (c) => pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))); }

  /** 반짝이는 십자 빛 */
  function glint(x, y, r, alpha) {
    faded(alpha, () => { L(x - r, y, x + r, y, WHITE, r * .22); L(x, y - r, x, y + r, WHITE, r * .22); });
  }

  /** 아래가 둥근 물방울 */
  function drop(x, y, r, color) {
    shape(color, (c) => { c.moveTo(x, y - r * 2.4); c.quadraticCurveTo(x + r * 1.1, y - r * .3, x, y + r); c.quadraticCurveTo(x - r * 1.1, y - r * .3, x, y - r * 2.4); });
    E(x - r * .3, y - r * .1, r * .22, r * .35, WHITE);
  }

  /** 앞날개: 투명한 막, 굵은 앞 가장자리 맥, 부채꼴 날개맥과 끝의 칸들 */
  function wing(t, o = {}) {
    const base = [.9, -1.3], tip = [-2.55, -1.0];
    faded(o.alpha || .5, () => shape(o.color || WING, (c) => {
      c.moveTo(...base); c.bezierCurveTo(.2, -1.95, -1.6, -1.85, ...tip);
      c.quadraticCurveTo(-2.4, -.7, -1.9, -.72); c.bezierCurveTo(-1, -.8, 0, -.9, .6, -1.05);
    }));
    faded(.25, () => shape(WHITE, (c) => { c.moveTo(.6, -1.45); c.bezierCurveTo(0, -1.8, -1.2, -1.75, -2, -1.4); c.quadraticCurveTo(-1, -1.55, .6, -1.45); }));
    const v = t(o.vein || VEIN);
    curve(v, .06, (c) => { c.moveTo(...base); c.bezierCurveTo(.2, -1.95, -1.6, -1.85, ...tip); });
    curve(v, .025, (c) => {
      [[-1.9, -.78], [-2.2, -.86], [-2.45, -.98]].forEach(([x, y], i) => { c.moveTo(.5, -1.15 - i * .08); c.quadraticCurveTo(-.6, -1.2 - i * .12, x, y); });
      c.moveTo(-1.3, -1.72); c.lineTo(-1.45, -.92); c.moveTo(-1.75, -1.6); c.lineTo(-1.95, -.9); c.moveTo(-2.15, -1.38); c.lineTo(-2.3, -.95);
    });
  }

  /** 매미 한 마리 (옆모습, 4.5cm). o: { pale 갓 나온 연둣빛, sing 배를 떤다, female, lash, noBlush } */
  function cicadaBody(time, t, o = {}) {
    const body = t(o.pale ? '#cfe9d6' : BODY), hi = t(o.pale ? '#e8f5ea' : BODY_HI);
    const legC = t(o.pale ? '#b9d8c0' : '#3d3433'), farLeg = t(o.pale ? '#d7ecdc' : '#6b5f5c');
    const buzz = o.sing ? Math.sin(time * 70) * .025 : 0;
    leg([[1.05, -.62], [1.25, -.32], [1.55, 0]], farLeg, .07); leg([[.45, -.55], [.35, -.25], [.15, 0]], farLeg, .07);
    wing(t, { alpha: o.pale ? .7 : .5, color: o.pale ? '#d8f2dc' : WING, vein: o.pale ? '#9cc7a4' : VEIN });
    ctx.save(); ctx.translate(buzz, 0);
    shape(body, (c) => { c.moveTo(.35, -1.32); c.bezierCurveTo(-.5, -1.45, -1.55, -1.1, -1.85, -.62); c.bezierCurveTo(-1.55, -.32, -.5, -.28, .35, -.4); });
    curve(hi, .035, (c) => [-.35, -.8, -1.25].forEach((x) => { c.moveTo(x, -1.3 + (x < -1 ? .15 : 0)); c.quadraticCurveTo(x - .12, -.85, x + .02, -.36); }));
    if (o.female) shape(t('#a07a5a'), (c) => { c.moveTo(-1.85, -.62); c.lineTo(-2.1, -.55); c.lineTo(-1.75, -.48); });
    ctx.restore();
    if (!o.female) E(.3, -.48, .5, .17, t(o.pale ? '#eef7ef' : BELLY));
    E(.72, -1, .72, .56, body);
    if (!o.pale) curve(t(MARK), .09, (c) => { c.moveTo(.3, -1.45); c.quadraticCurveTo(.75, -1.25, 1.15, -1.45); c.moveTo(.45, -1.2); c.lineTo(.7, -.95); c.lineTo(.95, -1.2); });
    faded(.35, () => E(.6, -1.35, .3, .07, WHITE));
    E(1.45, -1.02, .52, .48, body);
    E(1.25, -1.48, .26, .26, t(o.pale ? '#e9c9c9' : '#5a3f3a'));
    cuteEye(1.78, -1.36, .3, .3, time + 2, t);
    if (o.lash) curve(t(INK), .03, (c) => { c.moveTo(1.6, -1.62); c.lineTo(1.5, -1.75); c.moveTo(1.78, -1.68); c.lineTo(1.75, -1.82); });
    curve(t(o.pale ? '#9cc7a4' : '#5a4a46'), .05, (c) => { c.moveTo(1.75, -.72); c.quadraticCurveTo(1.55, -.5, 1.3, -.38); });
    if (!o.noBlush) blush(1.88, -.92, .17, .1);
    leg([[1.25, -.65], [1.7, -.42], [1.85, 0]], legC, .09);
    curve(legC, .05, (c) => { c.moveTo(1.6, -.48); c.lineTo(1.72, -.6); });
    leg([[.6, -.55], [.82, -.22], [.68, 0]], legC, .09); leg([[.05, -.48], [-.35, -.22], [-.5, 0]], legC, .09);
  }

  /** 주인공: 쉬는 동안엔 가끔 배를 떨며 운다 (소리 물결이 퍼진다) */
  function hero(time, moving, eye, t) {
    const singing = !moving && Math.sin(time * 1.1) > .1;
    ctx.save(); ctx.translate(0, moving ? -Math.abs(Math.sin(time * 14)) * .05 : 0);
    cicadaBody(time, t, { sing: singing });
    ctx.restore();
    if (!singing) return;
    for (let i = 0; i < 3; i++) {
      const ph = (time * 1.6 + i / 3) % 1;
      faded((1 - ph) * .7, () => curve(t('#fff3c4'), .06, (c) => c.arc(-.4, -.75, .4 + ph * 1.6, Math.PI * .55, Math.PI * 1.05)));
    }
  }

  /** 작은 매미를 위치·배율·각도로 놓는다 */
  function placed(x, y, k, rot, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); draw(); ctx.restore(); }

  /** 개미 한 마리 (0.45cm). 제자리에서 더듬이만 까딱 */
  function ant(x, y, time, t, rot = 0, k = 1) {
    placed(x, y, k, rot, () => {
      const c = t('#3a2522'), tw = Math.sin(time * 9 + x * 7) * .04;
      leg([[-.02, -.06], [-.12, -.03], [-.16, 0]], c, .018); leg([[.02, -.06], [.05, -.02], [.02, 0]], c, .018); leg([[.06, -.06], [.16, -.03], [.2, 0]], c, .018);
      E(-.15, -.08, .1, .07, c); E(.02, -.07, .07, .035, c); E(.15, -.08, .055, .05, c);
      curve(c, .014, (cc) => { cc.moveTo(.18, -.11); cc.lineTo(.24, -.18 + tw); cc.lineTo(.3, -.14 + tw); });
      faded(.5, () => E(-.17, -.11, .04, .015, WHITE));
    });
  }

  /** 나무껍질 판과 갈라진 틈 (사각형 영역 안에 흩뿌림) */
  function barkTexture(x0, y0, w, h, t, salt) {
    for (let i = 0; i < Math.round(w * h / 18); i++) {
      const x = x0 + hash(i, salt) * w, y = y0 + hash(i, salt + 1) * h, r = .8 + hash(i, salt + 2) * 1.6;
      const peel = hash(i, salt + 3) > .78;
      shape(t(peel ? BARK_PEEL : BARK_HI), (c) => { c.moveTo(x - r, y); c.quadraticCurveTo(x - r * .6, y - r * 1.4, x + r * .3, y - r * 1.2); c.quadraticCurveTo(x + r * 1.1, y - r * .2, x + r * .5, y + r * .6); c.quadraticCurveTo(x - r * .3, y + r * .9, x - r, y); });
    }
    curve(t(shade(BARK)), .18, (c) => {
      for (let i = 0; i < Math.round(w / 3); i++) {
        const x = x0 + hash(i, salt + 5) * w, y = y0 + hash(i, salt + 6) * h * .6;
        c.moveTo(x, y); c.quadraticCurveTo(x + .6, y + h * .15, x - .2, y + h * .3);
      }
    });
  }

  /** 잎 하나: 톱니 가장자리, 잎맥. len은 길이, 원점은 잎자루 */
  function leaf(len, color, t, teeth = 9) {
    const wd = len * .26, edge = (side) => {
      const pts = [];
      for (let i = 0; i <= teeth; i++) {
        const u = i / teeth, x = u * len, y = side * Math.sin(u * Math.PI) ** .8 * wd;
        pts.push([x, y], [x + len / teeth * .5, y * .86]);
      }
      return pts;
    };
    shape(t(color), (c) => { c.moveTo(0, 0); edge(-1).forEach(([x, y]) => c.lineTo(x, y)); edge(1).reverse().forEach(([x, y]) => c.lineTo(x, y)); });
    shape(t(shade(color)), (c) => { c.moveTo(0, 0); edge(1).forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(len, 0); });
    curve(t(mix(color, '#ffffff', .35)), len * .012, (c) => {
      c.moveTo(0, 0); c.lineTo(len * .98, 0);
      for (let i = 1; i < teeth - 1; i++) { const x = i / teeth * len; c.moveTo(x, 0); c.lineTo(x + len * .08, -wd * .7); c.moveTo(x, 0); c.lineTo(x + len * .08, wd * .7); }
    });
  }

  /** 뭉게뭉게 연기 구름. 동그라미들을 한 경로로 합쳐 칠해 한 덩어리처럼 보이게 한다 (제자리에서 부풀었다 줄었다) */
  function cloud(puffs, time, t) {
    const layer = (color, dx, dy, grow) => shape(color, (c) => puffs.forEach(([x, y, r], i) => {
      const k = (1 + Math.sin(time * 1.4 + i * 1.9) * .06) * grow;
      c.moveTo(x + dx + r * k, y + dy); c.ellipse(x + dx, y + dy, r * k, r * .82 * k, 0, 0, TAU);
    }));
    layer(t(mix(SMOKE, '#b9b4c2', .3)), .5, .6, 1);
    faded(.85, () => layer(t(SMOKE), 0, 0, .9));
    faded(.35, () => layer(WHITE, -.4, -.7, .7));
  }

  const art = {
    /* C1 — 칠 년 만에 뚫고 나온 흙 구멍. 엄지손가락만 한 구멍 둘레로 흙 알갱이가 쌓였다 */
    'cicada:soilHole': { w: 7, h: 2, d: (time, t) => {
      shape(t(SOIL), (c) => { c.moveTo(-3.4, 0); c.bezierCurveTo(-2.6, -.9, -1.4, -1.2, -.4, -1.05); c.bezierCurveTo(.8, -1.3, 2.2, -.9, 3.4, 0); });
      shape(t(mix(SOIL, '#ffffff', .15)), (c) => { c.moveTo(-2.6, -.5); c.bezierCurveTo(-1.8, -1, -.9, -1.15, -.3, -1.02); c.quadraticCurveTo(-1.6, -.8, -2.6, -.5); });
      E(0, -.95, .82, .32, t(SOIL_DK)); E(0, -.9, .62, .22, t('#22181a'));
      curve(t('#e9dcc4'), .06, (c) => { c.moveTo(.3, -.9); c.bezierCurveTo(.9, -1.6, 1.5, -1.2, 1.3, -.8); });
      for (let i = 0; i < 16; i++) {
        const a = hash(i, 71) * Math.PI, r = 1.1 + hash(i, 72) * 1.9, s = .1 + hash(i, 73) * .14;
        E(Math.cos(a) * r * (i % 2 ? 1 : -1), -Math.sin(a) * .5 - .25, s, s * .8, t(i % 3 ? SOIL : SOIL_DK));
      }
      [[-3, 2.4], [2.6, 2], [3.2, 1.4]].forEach(([x, h], i) => {
        const sw = Math.sin(time * 1.3 + i) * .12;
        shape(t(i ? LEAF : LEAF_DK), (c) => { c.moveTo(x - .1, 0); c.quadraticCurveTo(x - .2, -h * .6, x + sw, -h); c.quadraticCurveTo(x + .2, -h * .5, x + .12, 0); });
      });
      glint(.4, -1.1, .14, .3 + Math.sin(time * 2) * .3);
    } },

    /* C1 — 화단과 맞닿은 보도블록 가장자리. 블록 틈에 이끼와 풀이 났다 */
    'cicada:paverEdge': { w: 34, h: 2, d: (time, t) => {
      for (let i = 0; i < 3; i++) {
        const x = -16.5 + i * 11, c = i % 2 ? '#b9a7a0' : '#c98f7a';
        RR(x, -1.5, 10.4, 1.5, .25, t(shade(c))); RR(x, -1.5, 10.4, .45, .2, t(mix(c, '#ffffff', .25)));
        for (let k = 0; k < 6; k++) E(x + 1 + hash(i * 9 + k, 81) * 8.4, -.8 + hash(i * 9 + k, 82) * .5, .08, .06, t(shade(shade(c))));
        if (i < 2) {
          RR(x + 10.4, -.9, .6, .9, .1, t('#5f7f4f'));
          shape(t(LEAF), (c2) => { c2.moveTo(x + 10.6, -.8); c2.quadraticCurveTo(x + 10.2, -2.2, x + 9.6 + Math.sin(time + i) * .1, -2.6); c2.quadraticCurveTo(x + 10.6, -2, x + 10.9, -.8); });
        }
      }
    } },

    /* C1·D1 — 밤 산책 나온 아이의 운동화. 들렸다 쿵 내려앉는다 (발끝이 왼쪽) */
    'cicada:sneaker': { w: 26, h: 12, d: (time, t) => {
      const lift = Math.max(0, Math.sin(time * 2.2)) * 3.5;
      faded(.25 - lift * .04, () => E(0, -.05, 12 - lift, .45, t(INK)));
      ctx.save(); ctx.translate(0, -lift); ctx.rotate(-lift * .015);
      const blue = '#5f8fb0';
      RR(-12.2, -1.8, 24.4, 1.8, .9, t('#f4f1ea')); RR(-12.2, -.6, 24.4, .6, .3, t('#cfc8bc'));
      for (let x = -11; x < 11; x += 1.4) P([[x, 0], [x + .7, -.35], [x + 1.4, 0]], t('#a8a294'));
      shape(t(blue), (c) => { c.moveTo(-12, -1.7); c.bezierCurveTo(-12.6, -4, -10.5, -5.3, -7, -5.6); c.lineTo(-1, -7.8); c.bezierCurveTo(1, -10, 5, -10.6, 8.5, -10.2); c.bezierCurveTo(11, -9.6, 12.2, -6, 12, -1.7); });
      shape(t(shade(blue)), (c) => { c.moveTo(6, -1.7); c.bezierCurveTo(7, -6, 9, -9.6, 9.8, -10); c.bezierCurveTo(11.4, -9, 12.2, -6, 12, -1.7); });
      shape(t('#f4f1ea'), (c) => { c.moveTo(-12, -1.7); c.bezierCurveTo(-12.5, -3.8, -10.5, -5, -7.5, -5.3); c.quadraticCurveTo(-8.5, -3, -7.6, -1.7); });
      curve(t('#ffd56b'), .5, (c) => { c.moveTo(-5, -2.6); c.bezierCurveTo(-1, -2.4, 3, -4, 6, -6.4); });
      shape(t('#3d4c66'), (c) => { c.moveTo(1.2, -9.4); c.bezierCurveTo(3, -10.6, 6.5, -10.8, 8.6, -10.2); c.quadraticCurveTo(5, -9.4, 1.2, -9.4); });
      curve(t(WHITE), .2, (c) => [0, 1, 2, 3].forEach((i) => { const x = -4.6 + i * 1.5, y = -6.6 - i * .75; c.moveTo(x, y); c.lineTo(x + 1.6, y - 1.2); c.moveTo(x + 1.6, y); c.lineTo(x, y - 1.2); }));
      [0, 1, 2, 3].forEach((i) => E(-4.6 + i * 1.5, -6.6 - i * .75, .18, .18, t('#cfc8bc')));
      RR(10.6, -9.8, 1.2, 2.6, .5, t('#ff8fa3'));
      ctx.restore();
    } },

    /* C2 — 키 낮은 회양목. 반들반들한 작은 잎이 촘촘하다 */
    'cicada:boxwood': { w: 14, h: 15, d: (time, t) => {
      const stem = t('#6b4f3e'), sway = Math.sin(time * .9) * .015;
      ctx.save(); ctx.rotate(sway);
      curve(stem, .35, (c) => { c.moveTo(0, 0); c.quadraticCurveTo(-.5, -7, -3, -13); c.moveTo(-.2, -4); c.quadraticCurveTo(3, -8, 5, -12); c.moveTo(-.6, -8); c.quadraticCurveTo(-4, -9, -6, -10); });
      for (let i = 0; i < 46; i++) {
        const u = hash(i, 91), br = i % 3, x = br === 0 ? -3 * u - .2 : br === 1 ? 5 * u : -6 * u, y = br === 0 ? -13 * u - 1 : br === 1 ? -4 - 8 * u : -8 - 2 * u;
        const ox = (hash(i, 92) - .5) * 2.6, oy = (hash(i, 93) - .5) * 2;
        placed(x + ox, y + oy, 1, hash(i, 94) * Math.PI, () => {
          E(0, 0, .62, .36, t(i % 4 ? LEAF_DK : '#3f6f48')); faded(.45, () => E(-.15, -.12, .3, .08, WHITE));
        });
      }
      ctx.restore();
    } },

    /* C2·D2 — 밑동으로 오르내리는 개미 행렬. 제자리에서 더듬이를 까딱인다 */
    'cicada:antLine': { w: 14, h: 1, d: (time, t) => {
      faded(.25, () => curve(t(SOIL_DK), .25, (c) => { c.moveTo(-7, -.02); c.bezierCurveTo(-3, -.1, 2, .05, 7, -.05); }));
      for (let i = 0; i < 14; i++) {
        const x = -6.6 + i * .95 + hash(i, 101) * .3, bob = Math.sin(time * 5 + i) * .015;
        ant(x, bob, time, t, (hash(i, 102) - .5) * .25, i % 3 ? 1 : 1.15);
      }
      E(2.3, -.12, .14, .1, t('#f4ead8')); E(-3.1, -.1, .1, .08, t('#f4ead8'));
    } },

    /* C2·C3 — 단지 느티나무 줄기 아랫부분(지름 30cm). 비늘처럼 벗겨진 껍질 사이로 주황 속껍질이 보인다 */
    'cicada:barkTrunk': { w: 34, h: 46, d: (time, t) => {
      shape(t(shade(BARK)), (c) => { c.moveTo(-17, 0); c.bezierCurveTo(-13, -1.5, -12.5, -6, -12.5, -12); c.lineTo(-11.8, -48); c.lineTo(12.2, -48); c.lineTo(12.8, -12); c.bezierCurveTo(13, -5, 14, -1.5, 18, 0); });
      shape(t(BARK), (c) => { c.moveTo(-17, 0); c.bezierCurveTo(-13, -1.5, -12.5, -6, -12.5, -12); c.lineTo(-11.8, -48); c.lineTo(6, -48); c.lineTo(6.6, -12); c.bezierCurveTo(7, -5, 8, -1.5, 10, 0); });
      ctx.save(); ctx.beginPath(); ctx.rect(-12.6, -48, 24.6, 48); ctx.clip();
      barkTexture(-12, -46, 24, 44, t, 111);
      ctx.restore();
      shape(t('#6f9a5a'), (c) => { c.moveTo(-17, 0); c.quadraticCurveTo(-14, -1.6, -12, -2.6); c.quadraticCurveTo(-10, -1, -8, 0); });
      faded(.18, () => RR(-10.5, -48, 2.2, 46, 1, WHITE));
    } },

    /* C3 — 옆 가지에서 먼저 껍질을 벗는 매미. 연둣빛 몸을 뒤로 젖혔고, 한쪽 날개가 구겨졌다 */
    'cicada:molting': { w: 5, h: 8, d: (time, t) => {
      shape(t(BARK), (c) => { c.moveTo(.5, 0); c.lineTo(.7, -8.4); c.lineTo(1.5, -8.4); c.lineTo(1.4, 0); });
      faded(.35, () => RR(.65, -8.4, .2, 8.4, .1, WHITE));
      placed(.55, -3.2, .85, -Math.PI / 2, () => shellShape(t, true));
      placed(-.3, -4.4, .8, Math.PI * .58 + Math.sin(time * .8) * .04, () => {
        cicadaBody(time, t, { pale: true, noBlush: true });
        faded(.85, () => shape(t('#bfe3c8'), (c) => { c.moveTo(.8, -1.3); c.quadraticCurveTo(.4, -2.3, .05, -1.7); c.quadraticCurveTo(-.3, -2.4, -.6, -1.5); c.quadraticCurveTo(0, -1.1, .8, -1.3); }));
      });
    } },

    /* C4·D3 — 내가 빠져나온 허물(2.5cm). 등이 갈라졌고, 흙 파던 앞다리 갈고리가 그대로다 */
    'cicada:emptyShell': { w: 3.4, h: 1.8, d: (time, t) => shellShape(t, false) },

    /* C4 — 아침 이슬이 맺힌 느티나무 잎 */
    'cicada:dewLeaf': { w: 10, h: 12, d: (time, t) => {
      curve(t('#6b4f3e'), .3, (c) => { c.moveTo(-5, -12); c.quadraticCurveTo(-1, -11, 2, -12.5); });
      placed(-1.2, -11.3, 1, 1.25 + Math.sin(time * .8) * .03, () => leaf(8.5, '#8cc77a', t, 11));
      [[-1.5, -6.6, .28], [.2, -4.6, .22], [-2.4, -9, .18], [-.4, -2.6, .32]].forEach(([x, y, r], i) => {
        E(x, y, r, r * .9, t('#d8f0ff')); E(x - r * .3, y - r * .3, r * .3, r * .25, WHITE);
        glint(x + r * .4, y - r * .5, r * .9, Math.sin(time * 2.4 + i * 2));
      });
    } },

    /* C5 — 벚나무 줄기(지름 14cm). 가로 줄무늬 껍질 상처에서 호박색 수액이 배어 흐른다 */
    'cicada:sapOoze': { w: 16, h: 30, d: (time, t) => {
      const cherry = '#7a5560';
      shape(t(shade(cherry)), (c) => { c.moveTo(-7.5, 0); c.lineTo(-6.8, -32); c.lineTo(7, -32); c.lineTo(7.6, 0); });
      shape(t(cherry), (c) => { c.moveTo(-7.5, 0); c.lineTo(-6.8, -32); c.lineTo(3.4, -32); c.lineTo(3.8, 0); });
      for (let i = 0; i < 9; i++) {
        const y = -2 - i * 3.3 - hash(i, 171) * 1.2;
        RR(-6.6 + hash(i, 172) * 3, y, 3 + hash(i, 173) * 4, .32, .16, t('#c9a3a0'));
      }
      faded(.25, () => RR(-6, -32, 1.4, 32, .7, WHITE));
      shape(t('#4a3036'), (c) => { c.moveTo(-1.6, -12.4); c.bezierCurveTo(-.6, -13.6, .8, -13.2, 1.2, -12.2); c.bezierCurveTo(.4, -11.2, -.9, -11.3, -1.6, -12.4); });
      shape(t(SAP), (c) => { c.moveTo(-1.1, -12); c.bezierCurveTo(-1.3, -9.5, -.2, -7.5, -.6, -5); c.quadraticCurveTo(-.2, -4.2, .3, -5.2); c.bezierCurveTo(.5, -7.6, 1.1, -10, .7, -12.1); });
      faded(.7, () => curve(t('#ffd98a'), .14, (c) => { c.moveTo(-.75, -11.4); c.bezierCurveTo(-.9, -9.4, -.2, -7.8, -.45, -6); }));
      const g = (time * .3) % 1;
      E(-.15, -4.6 + g * .5, .3 + g * .1, .38 + g * .14, t(SAP)); E(-.25, -4.75 + g * .5, .08, .11, WHITE);
      for (let i = 0; i < 3; i++) { const ph = (time * .6 + i / 3) % 1; faded(1 - ph, () => E(.3 + i * .2, -11 + i * 1.6, .08 + ph * .06, .08 + ph * .06, t('#ffe2a0'))); }
    } },

    /* C5·D5 — 가지에 앉은 직박구리(28cm). 부스스한 머리깃, 밤색 뺨, 긴 꼬리 */
    'cicada:bulbul': { w: 30, h: 24, d: (time, t) => {
      const breath = 1 + Math.sin(time * 2.4) * .015, grey = '#8d8f9e', dark = '#5f6070';
      curve(t('#6b4f3e'), 1, (c) => { c.moveTo(-15, 0); c.quadraticCurveTo(0, -1.2, 15, .4); });
      shape(t(dark), (c) => { c.moveTo(-5, -8); c.bezierCurveTo(-10, -6, -15, -1, -16, 2); c.lineTo(-13.5, 2.6); c.bezierCurveTo(-11, -1, -7, -4, -3, -6); });
      ctx.save(); ctx.translate(0, -8); ctx.scale(breath, breath);
      shape(t(grey), (c) => { c.moveTo(6, -6); c.bezierCurveTo(2, -8, -5, -5, -6, 0); c.bezierCurveTo(-5, 4, 0, 6, 4, 5); c.bezierCurveTo(7, 3, 8, -2, 6, -6); });
      shape(t(dark), (c) => { c.moveTo(5, -5.5); c.bezierCurveTo(0, -6.5, -5, -4, -6, 0); c.bezierCurveTo(-3, -1.4, 1, -1.6, 4, -2); });
      for (let i = 0; i < 9; i++) faded(.55, () => E(1 + (i % 3) * 1.4, -.6 + Math.floor(i / 3) * 1.4, .55, .2, t('#e4e4ea')));
      ctx.restore();
      ctx.save(); ctx.translate(7, -16);
      shape(t(grey), (c) => { c.moveTo(-3, 2); c.bezierCurveTo(-3.5, -2.5, 0, -4.4, 2.6, -3); c.bezierCurveTo(4.5, -1.6, 4, 2, 2, 3.4); });
      [[-2.4, -3, -.7], [-1.2, -3.9, -.45], [.2, -4.1, -.2]].forEach(([x, y, a], i) => placed(x, y, 1, a + Math.sin(time * 2 + i) * .05, () =>
        shape(t(i === 1 ? grey : dark), (c) => { c.moveTo(-.5, .8); c.quadraticCurveTo(-.9, -.6, -.2, -1.6); c.quadraticCurveTo(.1, -.6, .6, .7); })));
      shape(t('#a4553a'), (c) => { c.moveTo(.2, .2); c.bezierCurveTo(1.8, -.6, 3.2, .4, 2.4, 1.8); c.quadraticCurveTo(1, 2.2, .2, .2); });
      cuteEye(1.4, -1, .5, .5, time, t);
      shape(t('#2f2a3a'), (c) => { c.moveTo(3.4, -1.6); c.quadraticCurveTo(5.6, -1.2, 6, -.4); c.quadraticCurveTo(4.8, -.4, 3.4, -.2); });
      ctx.restore();
      leg([[1, -3.6], [.6, -1.2], [1.4, 0]], t('#3b3049'), .35); leg([[3, -3.4], [3.2, -1.2], [3.8, 0]], t('#3b3049'), .35);
    } },

    /* C6·D7 — 기다란 장대 끝의 초록 잠자리채. 그물이 축 늘어져 흔들린다 */
    'cicada:bugNet': { w: 26, h: 30, d: (time, t) => {
      ctx.save(); ctx.rotate(Math.sin(time * 1.1) * .05);
      const green = '#5fbf7a';
      RR(4.5, -30, .9, 22, .45, t('#e9c46a')); faded(.4, () => RR(4.6, -30, .25, 22, .12, WHITE));
      faded(.45, () => shape(t(green), (c) => { c.moveTo(-5, -8); c.bezierCurveTo(-5.5, -1, -2, 4, 1, 4.5); c.bezierCurveTo(2.5, 3, 5, -2, 5, -8); }));
      curve(t(shade(green)), .05, (c) => {
        for (let i = 1; i < 7; i++) { const u = i / 7; c.moveTo(-5 + u * 10, -8); c.quadraticCurveTo(-3 + u * 6, -1, 1, 4.4); }
        for (let j = 1; j < 6; j++) { const y = -8 + j * 2.2, w = 5 * (1 - j / 6.5); c.moveTo(1 - w - .2, y); c.quadraticCurveTo(1, y + .6, 1 + w - .2, y); }
      });
      E(0, -8, 5.3, 1.1, t('#3d8a52')); E(0, -8, 4.7, .7, t(mix('#ffffff', green, .3)));
      curve(t('#ffd56b'), .25, (c) => { c.ellipse(0, -8, 5, .9, 0, 0, TAU); });
      ctx.restore();
    } },

    /* C6·K1·D6 — 초록 뚜껑 투명 채집통. 숨구멍 뚫린 뚜껑과 노란 어깨끈 */
    'cicada:bugBox': { w: 14, h: 10, d: (time, t) => {
      faded(.2, () => E(0, -.05, 7, .3, t(INK)));
      faded(.3, () => RR(-6.5, -8, 13, 8, .8, t('#cfe8f5')));
      faded(.5, () => curve(t('#9fc4d8'), .12, (c) => c.roundRect(-6.5, -8, 13, 8, .8)));
      faded(.5, () => { P([[-5.6, -7.2], [-4.6, -7.2], [-5.8, -.8], [-6, -.8]], WHITE); P([[5, -7], [5.4, -7], [4.4, -1], [4.1, -1]], WHITE); });
      RR(-7, -9.4, 14, 1.6, .5, t('#4fae6a')); RR(-7, -8.3, 14, .5, .25, t(shade('#4fae6a')));
      RR(-2.6, -10, 5.2, .7, .3, t('#3d8a52'));
      for (let i = 0; i < 7; i++) E(-5.4 + i * 1.8, -8.8, .16, .1, t('#2f6a40'));
      curve(t('#ffd56b'), .3, (c) => { c.moveTo(-6.6, -8.6); c.bezierCurveTo(-8, -14, 8, -14, 6.6, -8.6); });
    } },

    /* K1 — 아이가 넣어 준 시든 잎 한 장 */
    'cicada:wiltLeaf': { w: 5, h: 1.2, d: (time, t) => {
      placed(-2.4, -.2, 1, -.08, () => leaf(4.8, '#b98a4a', t, 8));
      curve(t('#8a6232'), .08, (c) => { c.moveTo(1.8, -.4); c.quadraticCurveTo(2.4, -1, 2.2, -1.3); });
    } },

    /* C7 — 느티나무 가지에 빼곡히 붙어 우는 수컷들. 배를 떨 때마다 소리 물결이 퍼진다 */
    'cicada:chorus': { w: 14, h: 24, d: (time, t) => {
      shape(t(BARK), (c) => { c.moveTo(-3, 0); c.lineTo(-2.4, -26); c.lineTo(2.6, -26); c.lineTo(3.2, 0); });
      ctx.save(); ctx.beginPath(); ctx.rect(-3, -26, 6.2, 26); ctx.clip(); barkTexture(-3, -25, 6, 24, t, 131); ctx.restore();
      [[-2.4, -6, 1], [2.6, -13, -1], [-2.2, -20, 1]].forEach(([x, y, s], i) => {
        placed(x, y, 1, s > 0 ? -Math.PI / 2 : Math.PI / 2, () => { ctx.scale(1, s); cicadaBody(time + i * .7, t, { sing: true, noBlush: i === 1 }); });
        for (let k = 0; k < 2; k++) {
          const ph = (time * 1.4 + k / 2 + i * .3) % 1;
          faded((1 - ph) * .6, () => curve(t('#fff3c4'), .07, (c) => c.arc(x - s * .8, y + 1, .6 + ph * 2.2, s > 0 ? Math.PI * .6 : -Math.PI * .4, s > 0 ? Math.PI * 1.3 : Math.PI * .3)));
        }
      });
    } },

    /* C7 — 1층 창문 아래쪽. 회색 외벽, 알루미늄 창틀, 촘촘한 방충망 너머로 텔레비전 빛이 깜빡인다 */
    'cicada:windowScreen': { w: 34, h: 48, d: (time, t) => {
      const wall = '#d8d2c8', alu = '#d4d0dc';
      RR(-17, -48, 34, 48, 0, t(wall)); RR(-17, -3, 34, 3, 0, t(shade(wall)));
      curve(t('#c6bfb3'), .12, (c) => [-9, -25].forEach((y) => { c.moveTo(-17, y); c.lineTo(17, y); }));
      RR(-12, -48, 24, 34, 0, t('#2c2a3a'));
      const tv = .45 + Math.sin(time * 5) * .12 + (hash(Math.floor(time * 3), 3) - .5) * .25;
      faded(tv, () => E(5, -32, 7, 6, '#8fb8ff'));
      faded(.3, () => E(-4, -22, 6, 3, '#ffd9a8'));
      ctx.save(); ctx.beginPath(); ctx.rect(-11.4, -48, 22.8, 33.4); ctx.clip();
      faded(.55, () => curve('#b9b4c8', .05, (c) => {
        for (let x = -11.4; x <= 11.4; x += .45) { c.moveTo(x, -48); c.lineTo(x, -14.6); }
        for (let y = -48; y <= -14.6; y += .45) { c.moveTo(-11.4, y); c.lineTo(11.4, y); }
      }));
      ctx.restore();
      RR(-12.6, -48, 1.2, 34, .3, t(alu)); RR(11.4, -48, 1.2, 34, .3, t(shade(alu))); RR(-.5, -48, 1, 33.4, .3, t(alu));
      faded(.3, () => P([[-9, -48], [-6.5, -48], [-10, -15], [-11, -15]], WHITE));
      RR(-14, -15, 28, 1.6, .4, t('#e9e6ee')); RR(-14, -13.8, 28, .5, .2, t(shade('#e9e6ee')));
      [[-7, -14.9], [6, -14.9]].forEach(([x, y]) => faded(.5, () => E(x, y, .9, .16, t('#8a8494'))));
    } },

    /* C8·D8 — 골목 가로등 기둥 아랫부분과 위에서 쏟아지는 주황 불빛 */
    'cicada:streetlamp': { w: 30, h: 46, d: (time, t) => {
      const pulse = .22 + Math.sin(time * 1.6) * .03;
      faded(pulse, () => P([[-4, -60], [4, -60], [15, 0], [-15, 0]], '#ffd27a'));
      faded(pulse + .1, () => E(0, -.1, 15, 1.2, '#ffe2a8'));
      RR(-7, -3, 14, 3, .6, t('#a8a294')); RR(-7, -3, 14, .7, .3, t('#c9c4b8'));
      shape(t('#7f8a88'), (c) => { c.moveTo(-5.5, -3); c.lineTo(-4.2, -60); c.lineTo(4.2, -60); c.lineTo(5.5, -3); });
      shape(t(shade('#7f8a88')), (c) => { c.moveTo(2.4, -3); c.lineTo(2, -60); c.lineTo(4.2, -60); c.lineTo(5.5, -3); });
      faded(.35, () => RR(-3.8, -60, .9, 57, .4, WHITE));
      RR(-2.6, -18, 4, 6, .5, t('#6f7a78')); E(-.6, -15, .3, .3, t('#4a5250'));
      RR(-4.2, -30, 6, 4.4, .2, t('#f4f1ea')); RR(-3.7, -29.2, 5, .6, .1, t('#e6765f'));
      [0, 1, 2].forEach((i) => RR(-3.7, -28 + i * .9, 4 - i, .35, .1, t('#8d8a9c')));
      faded(.8, () => RR(-4, -36, 5, 3.2, .2, t('#ffd56b')));
      RR(-3.6, -35.4, 3.6, .4, .1, t('#3b3049')); RR(-3.6, -34.6, 2.6, .4, .1, t('#3b3049'));
    } },

    /* C8 — 불빛 아래 맴도는 나방과 날벌레 (제자리에서 팔랑) */
    'cicada:moths': { w: 12, h: 10, d: (time, t) => {
      [[-3, -5, 1], [2.5, -7, .8], [.5, -2.5, .9], [4, -3.5, .7]].forEach(([x, y, k], i) => {
        const flap = .35 + Math.abs(Math.sin(time * 16 + i * 2)) * .65, bob = Math.sin(time * 3 + i) * .3;
        placed(x, y + bob, k, Math.sin(time * 2 + i) * .2, () => {
          shape(t('#d9cbb0'), (c) => { c.moveTo(0, 0); c.lineTo(-1.2, -1.1 * flap); c.quadraticCurveTo(-1.6, .2, 0, .2); });
          shape(t('#efe3c8'), (c) => { c.moveTo(0, 0); c.lineTo(1, -1 * flap); c.quadraticCurveTo(1.4, .3, 0, .2); });
          E(0, .1, .16, .55, t('#8a7a64'));
        });
      });
      for (let i = 0; i < 14; i++) E(-5 + hash(i, 141) * 10 + Math.sin(time * 4 + i) * .3, -9 + hash(i, 142) * 9 + Math.cos(time * 5 + i) * .3, .07, .07, t('#5a5060'));
    } },

    /* C9·D10 — 방역차가 뿜고 지나간 하얀 연무. 오른쪽에서 밀려와 낮게 깔리고, 제자리에서 부풀었다 가라앉는다. 모기가 떨어진다 */
    'cicada:foggingSmoke': { w: 46, h: 20, d: (time, t) => {
      const puffs = [];
      for (let i = 0; i < 26; i++) { const u = i / 25; puffs.push([-21 + u * 44, -2 - Math.sin(u * Math.PI * .9) * 6 * hash(i, 155) - u * 4, 2 + hash(i, 156) * 3 + u * 2]); }
      faded(.9, () => cloud(puffs, time, t));
      for (let i = 0; i < 7; i++) { const ph = (time * .45 + hash(i, 151)) % 1; faded(.8 * (1 - ph), () => placed(-15 + hash(i, 152) * 26, -15 + ph * 14, 1, ph * 6, () => { E(0, 0, .1, .04, t('#3b3049')); L(-.08, 0, -.3, -.1, t('#8d8a9c'), .03); })); }
    } },

    /* C10·D11 — 한여름 주차장 아스팔트. 흰 주차선이 갈라지고 열기가 아지랑이처럼 일렁인다 */
    'cicada:hotAsphalt': { w: 26, h: 7, d: (time, t) => {
      shape(t('#4a4652'), (c) => { c.moveTo(-13, 0); c.lineTo(-12.4, -.35); c.lineTo(12.6, -.3); c.lineTo(13, 0); });
      faded(.35, () => E(-2, -.3, 7, .12, '#fff1cf'));
      for (let i = 0; i < 30; i++) E(-12.5 + hash(i, 161) * 25, -.18 + hash(i, 162) * .16, .08, .05, t(i % 2 ? '#6d6877' : '#2f2c38'));
      RR(2, -.4, 6, .42, .1, t('#f4f1ea'));
      curve(t('#bdb6b0'), .05, (c) => { c.moveTo(3.4, -.4); c.lineTo(3.9, -.1); c.lineTo(3.6, 0); c.moveTo(6.2, -.38); c.lineTo(5.8, -.05); });
      ctx.save(); ctx.strokeStyle = '#fff1cf'; ctx.lineWidth = .14; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const x0 = -11 + i * 4.4, ph = (time * .7 + i * .37) % 1;
        ctx.globalAlpha = Math.sin(ph * Math.PI) * .75; ctx.beginPath();
        for (let k = 0; k <= 10; k++) { const y = -.6 - k * .55 - ph * 1.2, x = x0 + Math.sin(k * 1.3 + time * 4 + i) * .3; if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
      }
      ctx.restore();
      placed(-7, -.2, .7, .3, () => { E(0, -.05, .6, .1, t('#8a6232')); RR(-.6, -.18, 1.2, .2, .1, t('#e9c46a')); });
    } },

    /* C10 — 주차된 차 밑 그늘. 깜깜한 틈에서 고양이 눈 두 개가 깜빡인다 */
    'cicada:catUnderCar': { w: 34, h: 30, d: (time, t) => {
      const car = '#8c7fa8';
      faded(.55, () => shape(t('#2a2533'), (c) => { c.moveTo(-17, 0); c.lineTo(-15, -16); c.lineTo(17, -16); c.lineTo(17, 0); }));
      shape(t(shade(car)), (c) => { c.moveTo(-17, -15); c.quadraticCurveTo(-17.5, -19, -14, -20); c.lineTo(17, -20); c.lineTo(17, -15); });
      RR(-17, -34, 34, 15, 2, t(car)); faded(.3, () => RR(-15, -33, 30, 1.2, .6, WHITE));
      RR(-17.6, -21.5, 4, 2.4, 1, t('#ff9a6a'));
      ctx.save(); ctx.beginPath(); ctx.rect(-17, -40, 34, 40); ctx.clip();
      E(24, -16, 16.5, 16.5, t('#3a3445')); E(24, -16, 7, 7, t('#cfcad8'));
      curve(t('#5f5a6c'), .5, (c) => { c.arc(24, -16, 12, 0, TAU); });
      ctx.restore();
      const blink = Math.sin(time * .9) > .95 ? .15 : 1;
      [[-3.4, -7], [-.2, -7.2]].forEach(([x, y]) => {
        ctx.save(); ctx.shadowColor = '#d8ff8a'; ctx.shadowBlur = 10;
        E(x, y, .9, .7 * blink, '#d8f07a'); ctx.restore();
        E(x, y, .22, .6 * blink, t('#2a2533'));
      });
      faded(.35, () => curve(t('#cfcad8'), .05, (c) => { c.moveTo(-1.8, -5.6); c.lineTo(-5.5, -5.2); c.moveTo(-1.6, -5.3); c.lineTo(-5.2, -4.4); c.moveTo(-.6, -5.6); c.lineTo(2.8, -5.3); }));
    } },

    /* C11 — 내 노래를 듣고 내려앉은 암컷. 수컷과 달리 배에 울림판이 없고 산란관이 있다 */
    'cicada:mate': { w: 5, h: 2.6, d: (time, t) => {
      cicadaBody(time + 1.1, t, { female: true, lash: true });
      const ph = (time * .5) % 1;
      faded(Math.sin(ph * Math.PI), () => {
        const x = 1.2, y = -2.3 - ph * 1.2, r = .22;
        shape(BLUSH, (c) => { c.moveTo(x, y + r * 1.2); c.bezierCurveTo(x - r * 2, y - r * .2, x - r * .8, y - r * 1.6, x, y - r * .5); c.bezierCurveTo(x + r * .8, y - r * 1.6, x + r * 2, y - r * .2, x, y + r * 1.2); });
      });
    } },

    /* C11 — 알 낳기 좋은 마른 잔가지. 껍질에 비스듬한 산란 자국이 줄지어 있다 */
    'cicada:deadTwig': { w: 18, h: 5, d: (time, t) => {
      const grey = '#a2948a';
      shape(t(grey), (c) => { c.moveTo(-9, -.1); c.quadraticCurveTo(0, -.9, 9, -.5); c.lineTo(9, .1); c.quadraticCurveTo(0, -.2, -9, .5); });
      curve(t(grey), .22, (c) => { c.moveTo(-3, -.5); c.quadraticCurveTo(-4, -2.4, -5.6, -3.6); c.moveTo(4, -.6); c.quadraticCurveTo(5, -2, 6.4, -2.6); });
      faded(.4, () => curve(WHITE, .06, (c) => { c.moveTo(-8.6, -.05); c.quadraticCurveTo(0, -.82, 8.6, -.45); }));
      for (let i = 0; i < 9; i++) {
        const x = -6 + i * 1.3, y = -.4 - Math.sin((x + 9) / 18 * Math.PI) * .25;
        L(x - .18, y + .2, x + .18, y - .2, t('#5a4a3e'), .1);
        E(x + .2, y - .2, .07, .04, t('#fbf7ee'));
      }
    } },

    /* C11·D13 — 관리인의 긴 자루 가지치기 가위. 날이 철컥철컥 열렸다 닫힌다 */
    'cicada:pruningShears': { w: 30, h: 22, d: (time, t) => {
      const open = (Math.sin(time * 2.6) + 1) * .18;
      curve(t('#6b4f3e'), .5, (c) => { c.moveTo(-14, -8); c.quadraticCurveTo(-6, -9, 0, -8); });
      placed(-4, -8.6, 1, .1, () => leaf(3.4, LEAF, t, 7));
      ctx.save(); ctx.translate(-1, -9);
      [[-open, '#c9c4cc', '#e9e6ee'], [open, '#a29fb2', '#cfcad8']].forEach(([a, c1, c2]) => {
        ctx.save(); ctx.rotate(a);
        shape(t(c1), (c) => { c.moveTo(0, 0); c.bezierCurveTo(-1.5, -1.2, -4.2, -1, -5.2, -.2); c.quadraticCurveTo(-3, .4, 0, .4); });
        faded(.6, () => shape(t(c2), (c) => { c.moveTo(-.4, -.2); c.bezierCurveTo(-1.5, -.9, -3.6, -.8, -4.8, -.3); c.quadraticCurveTo(-2.6, -.1, -.4, -.2); }));
        RR(0, -.45, 17, .9, .45, t('#e6765f')); RR(12, -.6, 6, 1.2, .5, t('#3b3445'));
        ctx.restore();
      });
      E(0, 0, .5, .5, t('#5f5a6c')); E(0, 0, .2, .2, t('#cfcad8'));
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        const ph = (time * .4 + i / 3) % 1;
        faded(1 - ph, () => placed(-6 + i * 2, -7 + ph * 7, .8, ph * 3 + i, () => leaf(1.8, '#7fbf6a', t, 5)));
      }
    } },
  };

  /** 허물: 갈색 반투명 껍질, 갈라진 등, 흙 파는 앞다리 갈고리. pale이면 갓 벗은 것 */
  function shellShape(t, fresh) {
    const c1 = t(SHELL), c2 = t(mix(SHELL, '#ffffff', .35)), dk = t(shade(SHELL));
    leg([[.1, -.5], [-.2, -.2], [-.4, 0]], dk, .1); leg([[.5, -.5], [.6, -.2], [.45, 0]], dk, .1);
    shape(c1, (c) => { c.moveTo(.4, -1.3); c.bezierCurveTo(-.3, -1.45, -1.1, -1.1, -1.25, -.4); c.bezierCurveTo(-1, -.15, -.2, -.15, .4, -.3); });
    curve(dk, .04, (c) => [-.2, -.5, -.8].forEach((x) => { c.moveTo(x, -1.3); c.quadraticCurveTo(x - .1, -.8, x + .05, -.25); }));
    E(.65, -.85, .58, .5, c1);
    faded(.55, () => E(.5, -1.15, .35, .1, c2));
    shape(t(fresh ? '#cfe9d6' : '#3b2a22'), (c) => { c.moveTo(.1, -1.32); c.quadraticCurveTo(.6, -1.55, 1.05, -1.25); c.quadraticCurveTo(.6, -1.3, .1, -1.32); });
    curve(c2, .04, (c) => { c.moveTo(.1, -1.34); c.quadraticCurveTo(.6, -1.6, 1.08, -1.28); });
    E(1.2, -.85, .38, .38, c1); E(1.35, -1.08, .14, .14, c2); E(1.37, -1.09, .07, .07, dk);
    leg([[1.15, -.6], [1.6, -.55], [1.75, -.2]], c1, .16);
    curve(dk, .05, (c) => { c.moveTo(1.75, -.2); c.lineTo(1.95, -.3); c.moveTo(1.7, -.35); c.lineTo(1.9, -.48); c.moveTo(1.75, -.2); c.lineTo(1.6, 0); });
    faded(.4, () => E(-.5, -1.1, .3, .06, WHITE));
  }

  return { art, hero };
})());
