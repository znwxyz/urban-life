/* 나비(배추흰나비) 장면 전용 그림과 주인공 그림. 키는 'butterfly:이름'. 원점은 발밑 가운데, cm 좌표(y는 아래가 +), 오른쪽을 본다. d(시간, 색조함수)
   나비 눈높이(화면 폭 약 80cm)에 맞춰 그린다: 날개 편 길이 5cm, 케일 잎 25cm, 화단 펜스 기둥 지름 2.4cm, 사람 손 16cm.
   알·기생벌처럼 실제로는 몇 mm인 것만 읽히도록 2~3배 키웠다.
   조연은 제자리에서만 움직인다(흔들림·날갯짓·깜빡임). 걷거나 흘러가면 화면이 밀릴 때 뒷걸음처럼 보인다.
   주인공은 진행 상태(run)의 장면에 적힌 stage를 읽어 애벌레 → 번데기 → 나비로 바뀐다 (heroStage 참고) */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.butterfly = pack.hero; }
})((() => {
  const WING = '#fbf8ef', WING_FAR = '#d9d3df', TIP = '#4d4958', BODY = '#6e6878', FUZZ = '#c9c3d2', HEAD = '#d6d0dc', LEGC = '#4a4652';
  const LARVA = '#86b94f', LARVA_HEAD = '#78a948', SPIRACLE = '#f1d75a', PUPA = '#c4d39a', SILK = '#f6f3ea';
  const KALE = '#6f9c8c', KALE_RIB = '#d9e8dc', SOIL = '#6e5240', STYRO = '#eeebe2', FENCE = '#4f8a62', WOOD = '#e3c08a';
  const SLEEVE = '#b98ab0', GLOVE = '#e8e1c8', SKY = '#a9d4e8', PETAL_W = '#fbf9f3', CENTER = '#f2c14e';

  /* ── 오리기 도구 (cicada.js와 같은 형식). 점: [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] ── */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, alpha)); draw(); ctx.restore(); }
  function trace(pts) {
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (!i) ctx.moveTo(p[0], p[1]);
      else if (p.length === 2) ctx.lineTo(p[0], p[1]);
      else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
      else ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
    });
    ctx.closePath();
  }
  function slab(c, pts) { trace(pts); ctx.fillStyle = c; ctx.fill(); }
  function inside(pts, draw) { ctx.save(); trace(pts); ctx.clip(); draw(); ctx.restore(); }
  function curve(color, w, build) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(ctx); ctx.stroke(); ctx.restore();
  }
  function placed(x, y, k, rot, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); draw(); ctx.restore(); }
  function glint(x, y, r, alpha) { faded(alpha, () => { L(x - r, y, x + r, y, WHITE, r * .22); L(x, y - r, x, y + r, WHITE, r * .22); }); }
  /** 바닥 그림자 */
  const footShade = (x, rx) => faded(.18, () => E(x, -.04, rx, rx * .08, INK));

  /* ── 나비 ── 몸 가운데가 원점. 날개는 위로 접힌 모양으로 그린 뒤 세로로 눌러(k) 날갯짓을 낸다 */
  const FORE = [[0, 0], [.5, -.8, .98, -1.9, .86, -2.55], [.7, -2.98, -.32, -2.86, -1.06, -2.1], [-1.36, -1.6, -1.2, -.9, -.9, -.6], [-.5, -.25, -.2, -.05, 0, 0]];
  const HIND = [[-.1, .05], [-.25, -.6, -.62, -1.36, -1.25, -1.56], [-1.92, -1.62, -2.22, -.9, -1.8, -.34], [-1.4, .12, -.6, .2, -.1, .05]];
  const HIND_TORN = [[-.1, .05], [-.25, -.6, -.62, -1.36, -1.25, -1.56], [-1.6, -1.6], [-1.72, -1.2], [-1.98, -1.02], [-1.84, -.62], [-2.02, -.4], [-1.4, .12, -.6, .2, -.1, .05]];

  function foreWing(t, far, male) {
    const p = planes(t, far ? WING_FAR : WING), tip = t(far ? shade(TIP) : TIP);
    slab(p.mid, FORE);
    inside(FORE, () => {
      slab(p.lit, [[-1.6, -3.2], [.4, -3.2], [-.3, -1.7], [-1.6, -1.3]]);                                   // 볕 받는 앞 가장자리
      slab(p.dark, [[-1.6, -.8], [-.4, -.55, .5, -.3], [.5, .3], [-1.6, .3]]);                              // 몸 쪽 그늘
      slab(tip, [[.1, -3.1], [1.2, -3.1], [1.2, -2.0], [.95, -1.7, .55, -2.0, .4, -2.25], [.2, -2.5, -.2, -2.62, -.5, -2.75], [-.2, -3.0, .1, -3.1]]);   // 잿빛 날개 끝
      E(-.28, -1.5, .2, .22, tip);                                                                           // 검은 점
      if (!male) E(-.62, -.95, .16, .17, tip);
    });
  }
  function hindWing(t, far, torn) {
    const p = planes(t, far ? WING_FAR : WING), pts = torn ? HIND_TORN : HIND;
    slab(p.mid, pts);
    inside(pts, () => {
      slab(p.lit, [[-2.4, -1.8], [-.2, -1.8], [-.8, -1.0], [-2.4, -.7]]);
      slab(p.dark, [[-2.4, -.3], [-1.2, -.15, -.2, -.1], [.3, .4], [-2.4, .4]]);
      E(-.92, -1.38, .12, .1, t(far ? shade(TIP) : TIP));
    });
  }
  /** 날개 하나를 밑동(bx, by)에서 세로로 k만큼 눌러 그린다 */
  function wingAt(bx, by, k, rot, draw) { ctx.save(); ctx.translate(bx, by); ctx.rotate(rot); ctx.scale(1, Math.max(.12, k)); draw(); ctx.restore(); }

  /** 나비 한 마리 (몸 가운데가 원점). o: { k 날갯짓(0~1, 1이면 접힘), male, torn, noBlush } */
  function butterflyBody(time, t, o) {
    const k = o.k, B = planes(t, BODY), F = planes(t, FUZZ), H = planes(t, HEAD);
    wingAt(.02, -.2, k * .92, -.16, () => hindWing(t, true, false));                                        // 먼 쪽 날개 (그늘색)
    wingAt(.16, -.24, k * .94, -.12, () => foreWing(t, true, o.male));
    curve(t(LEGC), .045, (c) => {                                                                              // 다리 세 쌍 중 보이는 둘
      c.moveTo(.3, .1); c.lineTo(.5, .42); c.lineTo(.64, .6);
      c.moveTo(.08, .14); c.lineTo(.02, .46); c.lineTo(-.14, .62);
    });
    const belly = [[.05, -.13], [-.5, -.24, -1.2, -.2, -1.46, 0], [-1.2, .18, -.5, .2, .05, .13]];
    slab(B.mid, belly);
    inside(belly, () => slab(B.lit, [[-1.6, -.4], [.2, -.4], [.2, -.05], [-.5, -.04, -1.6, .02]]));
    curve(B.dark, .03, (c) => [-.35, -.7, -1.02].forEach((x) => { c.moveTo(x, -.17); c.quadraticCurveTo(x - .06, 0, x, .16); }));
    E(.18, -.02, .34, .27, F.mid); E(.12, -.1, .24, .14, F.lit);                                               // 털 많은 가슴
    wingAt(0, -.18, k, 0, () => hindWing(t, false, o.torn));
    wingAt(.12, -.22, k, 0, () => foreWing(t, false, o.male));
    curve(t(LEGC), .035, (c) => { c.moveTo(.72, -.3); c.quadraticCurveTo(1.0, -.9, 1.28, -1.22); c.moveTo(.62, -.32); c.quadraticCurveTo(.78, -.95, .98, -1.34); });
    [[1.3, -1.25], [1.0, -1.37]].forEach(([x, y]) => { E(x, y, .09, .07, t(LEGC)); E(x + .03, y - .02, .03, .025, WHITE); });
    E(.66, -.05, .34, .32, H.mid); E(.6, -.13, .24, .18, H.lit);
    cuteEye(.78, -.08, .15, .17, time, t);
    curve(t(LEGC), .03, (c) => { c.moveTo(.92, .18); c.quadraticCurveTo(1.08, .3, 1.0, .4); c.quadraticCurveTo(.9, .44, .92, .34); });   // 말아 둔 대롱
    if (!o.noBlush) blush(.84, .12, .09, .055);
  }

  /* ── 애벌레 ── 원점은 몸 아래 가운데. 몸마디가 볼록볼록, 기어갈 때 마디가 뒤에서 앞으로 들썩인다 */
  function larvaBody(time, t, moving) {
    const P0 = planes(t, LARVA), n = 11, x0 = -1.42, x1 = 1.02, step = (x1 - x0) / n;
    const lift = (i) => (moving ? Math.max(0, Math.sin(time * 8 - i * .75)) * .13 : Math.sin(time * 1.4 + i * .3) * .012);
    const top = [];
    for (let i = 0; i <= n; i++) top.push([x0 + i * step, -.6 - lift(i) - Math.sin(i / n * Math.PI) * .06]);
    const outline = [[x0 - .02, 0], [x0 - .3, -.04, x0 - .28, -.54, x0, -.58]];
    top.forEach(([x, y], i) => { if (i) outline.push([x - step * .5, y - .16, x, y]); });
    outline.push([x1 + .1, -.3, x1, 0]);
    footShade(0, 1.5);
    slab(P0.mid, outline);
    inside(outline, () => {
      slab(P0.lit, [[x0 - .4, -1.2], [x1 + .4, -1.2], [x1 + .4, -.48], [x0 - .4, -.44]]);                        // 등 쪽 볕
      slab(P0.dark, [[x0 - .4, -.16], [x1 + .4, -.16], [x1 + .4, .2], [x0 - .4, .2]]);                        // 배 쪽 그늘
    });
    for (let i = 1; i < n; i++) E(x0 + i * step, -.3 - lift(i) * .5, .05, .04, t(SPIRACLE));              // 옆구리 노란 숨구멍 줄
    for (let i = 2; i < n - 1; i += 2) E(x0 + i * step, -.02, .06, .04, P0.deep);                             // 배다리
    const H = planes(t, LARVA_HEAD), hy = -.44 - lift(n) * .8;
    E(1.26, hy, .46, .44, H.mid); E(1.18, hy - .14, .32, .22, H.lit);
    cuteEye(1.44, hy - .06, .14, .16, time, t);
    blush(1.56, hy + .16, .09, .055);
  }

  /* ── 번데기 ── 원점은 발밑. 펜스 기둥 앞면에 꽁무니를 붙이고 허리에 실띠를 감은 채 곧게 섰다. 눈을 감고 잔다 */
  const PUPA_PTS = [[0, -.4], [.36, -.7, .56, -1.3, .5, -1.8], [.45, -2.25, .3, -2.6, .3, -2.85], [.25, -3.15, .15, -3.35, .05, -3.45],
    [-.05, -3.2, -.15, -2.95, -.2, -2.75], [-.46, -2.4], [-.36, -2.0, -.36, -1.5, -.3, -1.1], [-.2, -.7, -.05, -.5, 0, -.4]];
  function pupaBody(time, t) {
    const P0 = planes(t, PUPA), breath = 1 + Math.sin(time * 1.1) * .012;
    ctx.save(); ctx.translate(0, -1.2); ctx.scale(breath, breath); ctx.rotate(Math.sin(time * .9) * .015);
    E(0, -.38, .14, .08, t(SILK));                                                                           // 꽁무니 실 방석
    slab(P0.mid, PUPA_PTS);
    inside(PUPA_PTS, () => {
      slab(P0.lit, [[-.6, -3.6], [.05, -3.6], [-.1, -.3], [-.6, -.3]]);
      slab(P0.dark, [[.18, -2.6], [.4, -2.1, .3, -1.2, .1, -.5], [.8, -.3], [.8, -2.6]]);                    // 날개 싹 자리 그늘
      curve(t(mix(PUPA, SPIRACLE, .7)), .05, (c) => { c.moveTo(-.44, -2.38); c.quadraticCurveTo(-.25, -1.6, -.12, -.6); });
      [[.08, -1.9], [-.1, -1.2], [.2, -1.0], [-.05, -2.3]].forEach(([x, y]) => E(x, y, .035, .035, P0.deep));
    });
    curve(t(INK), .03, (c) => { c.moveTo(.1, -2.62); c.quadraticCurveTo(.18, -2.55, .26, -2.62); });          // 감은 눈
    blush(.24, -2.42, .07, .04);
    faded(.85, () => curve(t(SILK), .035, (c) => { c.moveTo(-.4, -1.62); c.quadraticCurveTo(0, -1.5, .5, -1.7); }));   // 실띠
    ctx.restore();
  }

  /* ── 주인공 단계: 진행 상태의 장면이 stage를 정한다. 고른 직후(결과 카드)에는 방금 장면의 모습 그대로,
     이동하는 동안 몸이 바뀐다(번데기만은 매달릴 자리에 닿아 멈춘 뒤에 굳는다). 바뀔 때는 잠깐 겹쳐 녹아든다 ── */
  const ADULT = Object.freeze({ stage: 'adult', grow: 1 }), MORPH_S = .7;
  const stageOf = (sp, id) => { const sc = sp.scenes[id]; return sc ? { stage: sc.stage || 'adult', grow: sc.grow || 1 } : null; };
  function heroStage() {
    const sp = typeof SPECIES !== 'undefined' && SPECIES.butterfly;
    const r = typeof run !== 'undefined' ? run : null;
    if (!sp || !r || r.spKey !== 'butterfly') return ADULT;
    const prev = r.path.length ? r.path[r.path.length - 1].at : r.at, ph = typeof phase !== 'undefined' ? phase : '';
    const now = stageOf(sp, r.at), before = stageOf(sp, prev) || ADULT;
    if (r.ending || ph === 'outcome' || !now) return before;
    if (ph === 'move' && now.stage === 'pupa') return before;
    return now;
  }
  const morph = { key: null, from: null, t0: 0 };
  const keyOf = (s) => `${s.stage}:${s.grow}`;

  function drawStage(s, time, moving, t) {
    if (s.stage === 'larva') { placed(0, 0, s.grow, 0, () => larvaBody(time, t, moving)); return; }
    if (s.stage === 'pupa') { pupaBody(time, t); return; }
    const fly = moving ? 5 : 1.8, y = -3.4 + Math.sin(time * fly) * (moving ? .32 : .14);
    const k = moving ? .25 + Math.abs(Math.sin(time * 9)) * .75 : .74 + Math.sin(time * 1.6) * .26;
    footShade(0, 1.3);
    placed(0, y, 1, moving ? -.06 : 0, () => butterflyBody(time, t, { k }));
  }

  function hero(time, moving, eye, t) {
    const want = heroStage(), key = keyOf(want);
    if (morph.key !== key) { morph.from = morph.key ? morph.cur : null; morph.cur = want; morph.key = key; morph.t0 = time; }
    const u = morph.from ? Math.min(1, Math.max(0, (time - morph.t0) / MORPH_S)) : 1;
    if (u < 1) faded(1 - u, () => drawStage(morph.from, time, moving, t));
    faded(u, () => drawStage(want, time, moving, t));
  }

  /* ── 장면 소품 도구 ── */
  /** 케일 잎 하나: 주름진 가장자리, 연한 잎맥. 원점은 잎자루, +x로 len만큼. holes: [[u, v, r]] 갉아 먹힌 구멍 */
  function kaleLeaf(len, t, holes = [], color = KALE) {
    const p = planes(t, color), w = len * .36, N = 9, edge = (side) => {
      const pts = [];
      for (let i = 1; i <= N; i++) {
        const u = i / N, um = (i - .5) / N, h = (v) => side * Math.sin(Math.PI * Math.min(v, .97)) ** .7 * w;
        pts.push([um * len, h(um) * 1.16, u * len, h(u) * .9]);                                             // 주름마다 바깥으로 볼록
      }
      return pts;
    };
    const top = edge(-1), bot = edge(1);
    const outline = [[0, 0], ...top, [len * 1.02, 0], ...bot.slice().reverse().map((q, i, arr) => {
      const next = arr[i + 1] || [0, 0, 0, 0];
      return [q[0], q[1], next[2], next[3]];
    })];
    slab(p.mid, outline);
    inside(outline, () => {
      slab(p.lit, [[0, -w * 1.4], [len * 1.1, -w * 1.4], [len * 1.1, -w * .05], [0, -w * .1]]);             // 위 반쪽 볕
      slab(p.dark, [[0, w * .45], [len * .5, w * .25, len * 1.1, w * .3], [len * 1.1, w * 1.4], [0, w * 1.4]]);
      holes.forEach(([u, v, r]) => {
        const x = u * len, y = v * w;
        slab(p.deep, [[x - r, y], [x - r, y - r * 1.1, x + r * .2, y - r], [x + r * 1.2, y - r * .5, x + r, y + r * .3], [x + r * .2, y + r * 1.1, x - r, y]]);
        slab(p.lit, [[x - r * .5, y + r * .8], [x + r * .2, y + r * 1.1, x + r, y + r * .3], [x + r * .5, y + r * .4, x - r * .5, y + r * .8]]);   // 구멍 아래 테에 받은 볕
      });
    });
    faded(.6, () => curve(t(KALE_RIB), len * .016, (c) => {
      c.moveTo(0, 0); c.quadraticCurveTo(len * .5, -w * .06, len * .96, 0);
      for (let i = 1; i < 5; i++) { const x = len * i / 5.4; c.moveTo(x, -w * .03); c.quadraticCurveTo(x + len * .08, -w * .3, x + len * .14, -w * .62); }
    }));
  }

  /** 초록 칠한 화단 펜스 기둥 하나 (지름 2.4cm). 원점은 기둥 밑 가운데 */
  function post(t, h) {
    const p = planes(t, FENCE), r = 1.2;
    const pts = [[-r, 0], [-r, -h + .5], [-r, -h - .2, -.2, -h - .5, 0, -h - .5], [.2, -h - .5, r, -h - .2, r, -h + .5], [r, 0]];
    slab(p.mid, pts);
    inside(pts, () => { slab(p.lit, [[-2, 2], [-2, -h - 2], [-.45, -h - 2], [-.55, 2]]); slab(p.dark, [[.55, 2], [.5, -h - 2], [2, -h - 2], [2, 2]]); });
    slab(p.lit, [[-r, -h + .5], [-r, -h - .2, -.2, -h - .5, 0, -h - .5], [-.3, -h - .1, -r, -h + .5]]);
    slab(t(mix(FENCE, '#d9cbb8', .7)), [[-.6, -h * .62], [-.2, -h * .66, .2, -h * .6], [.1, -h * .56, -.4, -h * .57]]);   // 벗겨진 칠 한 조각
    faded(.25, () => E(0, -.05, 2.2, .25, INK));
  }

  /** 하얀 꽃잎이 둥글게 돌아간 작은 들국화 (개망초). 원점은 꽃 가운데 */
  function daisy(t, r, petals = 18) {
    const p = planes(t, PETAL_W), c = planes(t, CENTER), ring = [];
    for (let i = 0; i < petals; i++) {
      const a0 = i / petals * TAU, a1 = (i + .5) / petals * TAU, a2 = (i + 1) / petals * TAU;
      if (!i) ring.push([Math.cos(a0) * r * .45, Math.sin(a0) * r * .45 * .8]);
      ring.push([Math.cos(a1) * r * 1.15, Math.sin(a1) * r * .8 * 1.15, Math.cos(a2) * r * .45, Math.sin(a2) * r * .45 * .8]);
    }
    slab(p.mid, ring);
    inside(ring, () => { slab(p.lit, [[-r * 2, -r * 2], [r * 2, -r * 2], [-r * 2, r * .4]]); slab(p.dark, [[r * 2, -r * .2], [r * 2, r * 2], [-r * .6, r * 2]]); });
    E(0, 0, r * .36, r * .3, c.mid); E(-r * .08, -r * .08, r * .2, r * .15, c.lit);
  }

  /** 붉은 꽃: 꽃잎 겹을 두세 톤으로 (장미·제라늄) */
  function bloom(t, r, color) {
    const p = planes(t, color), cup = [[-r, 0], [-r * 1.1, -r * .9, -r * .2, -r * 1.2, 0, -r * .7], [r * .2, -r * 1.2, r * 1.1, -r * .9, r, 0], [r * .6, r * .7, -r * .6, r * .7, -r, 0]];
    slab(p.mid, cup);
    inside(cup, () => slab(p.dark, [[r * .1, -r * 2], [r * 2, -r * 2], [r * 2, r * 2], [-r * .2, r * 2]]));
    slab(p.lit, [[-r * .7, -r * .1], [-r * .6, -r * .8, 0, -r * .7], [r * .3, -r * .5, r * .2, 0], [-r * .2, r * .2, -r * .7, -r * .1]]);
    slab(p.deep, [[-r * .15, -r * .55], [0, -r * .75, r * .2, -r * .5], [0, -r * .35, -r * .15, -r * .55]]);
  }

  /** 톱니 잎 하나 (장미·민들레). 원점 잎자루, +x로 len */
  function toothLeaf(t, len, color, teeth = 6) {
    const p = planes(t, color), w = len * .3, pts = [[0, 0]];
    for (let i = 1; i <= teeth; i++) { const u = i / teeth, h = Math.sin(Math.PI * Math.min(u, .98)) ** .8 * w; pts.push([(u - .5 / teeth) * len, -h * 1.15], [u * len, -h * .8]); }
    for (let i = teeth; i >= 1; i--) { const u = i / teeth, h = Math.sin(Math.PI * Math.min(u, .98)) ** .8 * w; pts.push([u * len, h * .8], [(u - .5 / teeth) * len, h * 1.15]); }
    slab(p.mid, pts);
    inside(pts, () => slab(p.dark, [[0, 0], [len * 1.1, 0], [len * 1.1, w * 2], [0, w * 2]]));
    curve(p.lit, len * .03, (c) => { c.moveTo(0, 0); c.lineTo(len * .9, 0); });
  }

  /** 소매 낀 팔 하나를 어깨(sx, sy)에서 손목(hx, hy)까지 둥근 띠로. 위쪽 볕·아래쪽 그늘 */
  function sleeveArm(t, sx, sy, hx, hy, w, color) {
    const p = planes(t, color), dx = hx - sx, dy = hy - sy, len = Math.hypot(dx, dy), ux = -dy / len / 2, uy = dx / len / 2;
    const at = (u, k, side) => [sx + dx * u + ux * w * k * side, sy + dy * u + uy * w * k * side];
    const pts = [at(0, 1, 1), [...at(.5, 1.08, 1), ...at(1, .8, 1)], at(1, .8, -1), [...at(.5, 1.0, -1), ...at(0, 1, -1)]];
    slab(p.mid, pts);
    inside(pts, () => slab(uy > 0 ? p.dark : p.lit, [at(-.1, 1.4, 1), at(1.1, 1.4, 1), at(1.1, .3, 1), at(-.1, .3, 1)]));
    slab(p.lit, [at(.9, .86, 1), at(1, .8, 1), at(1, .8, -1), at(.9, .86, -1)]);                              // 소맷부리
  }

  /** 작은 애벌레(형제) 하나를 놓는다 */
  const sibling = (x, y, k, rot, time, t) => placed(x, y, k, rot, () => larvaBody(time + 2, t, false));

  const art = {
    /* B1 — 갓 나온 알껍데기. 케일 잎 조각 위에 세운 노란 병 모양(실제 1mm, 세 배로), 위가 갉혀 열렸다 */
    'butterfly:eggShell': { w: 4, h: 1.2, d: (time, t) => {
      placed(-1.9, -.1, 1, 0, () => kaleLeaf(3.8, t));
      const p = planes(t, '#f2d36b'), egg = [[-.16, -.2], [-.24, -.5, -.2, -.82, -.12, -.92], [-.06, -.86], [0, -.95], [.06, -.86], [.12, -.92], [.2, -.82, .24, -.5, .16, -.2]];
      faded(.9, () => { slab(p.mid, egg); inside(egg, () => { slab(p.lit, [[-.4, -1], [-.04, -1], [-.06, 0], [-.4, 0]]); slab(p.dark, [[.08, -1], [.4, -1], [.4, 0], [.1, 0]]); }); });
      curve(p.dark, .02, (c) => { c.moveTo(-.06, -.3); c.lineTo(-.07, -.82); c.moveTo(.06, -.3); c.lineTo(.07, -.82); });
      glint(-.1, -.7, .08, .4 + Math.sin(time * 2) * .3);
    } },

    /* B1 — 할머니 상자에서 자란 케일 한 포기. 굵은 줄기에서 주름진 청록 잎이 크게 휘어 늘어진다 */
    'butterfly:kale': { w: 30, h: 34, d: (time, t) => {
      const sway = Math.sin(time * .8) * .02, S = planes(t, '#a9c4a4');
      const stem = [[-1.2, 0], [-1, -10, -.6, -18, -.5, -24], [.7, -24], [.6, -18, 1, -10, 1.4, 0]];
      slab(S.mid, stem); inside(stem, () => slab(S.lit, [[-2, 1], [-2, -25], [-.1, -25], [0, 1]]));
      placed(0, -12, 1, Math.PI + .5 + sway, () => kaleLeaf(14, t, [], shade(KALE)));                         // 뒤로 늘어진 잎 (그늘)
      placed(.2, -23, 1, -.35 + sway, () => kaleLeaf(17, t, [[.55, -.2, .9]]));
      placed(.4, -17, 1, .55 + sway * 1.5, () => kaleLeaf(15, t, [[.7, .1, .7]]));
      placed(-.3, -21, 1, Math.PI + .25 - sway, () => kaleLeaf(13, t));
    } },

    /* B2·D2 — 할머니 손이 나무젓가락으로 내 형제를 집어 올린다. 팔은 위에서 내려오고 젓가락이 들썩인다 */
    'butterfly:chopsticks': { w: 26, h: 34, d: (time, t) => {
      const bob = Math.sin(time * 1.6) * .5, W0 = planes(t, WOOD);
      ctx.save(); ctx.translate(0, bob);
      sleeveArm(t, 16, -40, 7.4, -18.5, 6, SLEEVE);
      const [gx, gy] = artHandOnArm(t, 7.4, -18.5, 2.2, 13, { pose: 'grip' });
      [[0, -.3], [.5, .35]].forEach(([off, sp]) => {                                                        // 끝이 가늘어지는 젓가락 두 짝
        const tx = -.2 + sp, ty = -1.6 + off, ang = Math.atan2(ty - gy, tx - gx), nx = -Math.sin(ang), ny = Math.cos(ang);
        const pts = [[gx + nx * .32 + (gx - tx) * .25, gy + ny * .32 + (gy - ty) * .25], [tx + nx * .12, ty + ny * .12], [tx - nx * .12, ty - ny * .12], [gx - nx * .32 + (gx - tx) * .25, gy - ny * .32 + (gy - ty) * .25]];
        slab(sp ? W0.dark : W0.mid, pts); slab(W0.lit, [pts[0], pts[1], [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2], [(pts[0][0] + pts[3][0]) / 2, (pts[0][1] + pts[3][1]) / 2]]);
      });
      sibling(.1, -.6, .6, 1.2 + Math.sin(time * 3) * .15, time, t);                                        // 집혀 버둥대는 형제
      ctx.restore();
    } },

    /* B2·B11 — 화단 구석 스티로폼 상자텃밭. 흙 위로 케일 두 포기 */
    'butterfly:styroBox': { w: 46, h: 34, d: (time, t) => {
      const S = planes(t, STYRO), D = planes(t, SOIL), x0 = -21, x1 = 19, h = 16, dx = 4, dy = 2.6;
      placed(-9, -h - 1, .8, Math.PI + .4 + Math.sin(time * .7) * .02, () => kaleLeaf(13, t, [[.6, 0, .8]], shade(KALE)));
      placed(-6, -h - 1, .9, -.7 + Math.sin(time * .8) * .02, () => kaleLeaf(15, t, [[.5, -.2, 1]]));
      placed(8, -h - 1, .85, -.3 + Math.sin(time * .9 + 1) * .02, () => kaleLeaf(14, t));
      placed(8, -h - 1, .8, Math.PI - .5, () => kaleLeaf(11, t, [], shade(KALE)));
      slab(D.mid, [[x0 + .8, -h + .4], [x1 - .8, -h + .4], [x1 + dx - 1, -h - dy + .6], [x0 + dx + .6, -h - dy + .6]]);   // 흙 윗면
      slab(S.lit, [[x0, -h], [x1, -h], [x1 + dx, -h - dy], [x0 + dx, -h - dy], [x0 + dx + .9, -h - dy + .5], [x1 + dx - 1.1, -h - dy + .5], [x1 - .8, -h + .4], [x0 + .8, -h + .4]]);   // 상자 테 윗면
      const front = [[x0, 0], [x0 - .2, -h * .5, x0, -h], [x1, -h], [x1 + .3, -h * .5, x1, 0]];
      slab(S.mid, front);
      inside(front, () => slab(S.dark, [[x0 - 1, -1.6], [x1 + 1, -1.6], [x1 + 1, 1], [x0 - 1, 1]]));            // 아래 흙때
      slab(S.dark, [[x1, 0], [x1, -h], [x1 + dx, -h - dy], [x1 + dx, -dy + .4]]);
      faded(.25, () => E(0, -.05, 22, .5, INK));
    } },

    /* B3 — 갉아 먹힌 구멍투성이 케일 잎. 잎 끝엔 노란 솜뭉치(기생벌 고치)가 몽글몽글 */
    'butterfly:holeyLeaf': { w: 22, h: 14, d: (time, t) => {
      placed(-9, -.3, 1, -.5 + Math.sin(time * .7) * .015, () => kaleLeaf(19, t, [[.3, -.1, 1.2], [.52, .25, .9], [.7, -.3, 1.1], [.84, .1, .6]]));
      const C = planes(t, '#f4e3a1');
      [[6.9, -9.4, .36], [7.4, -9.1, .3], [7.1, -8.7, .33], [7.6, -9.6, .28], [6.6, -8.9, .27]].forEach(([x, y, r]) => { E(x, y, r, r * .8, C.mid); E(x - r * .25, y - r * .25, r * .45, r * .35, C.lit); });
    } },

    /* B3·D3 — 아주 작은 기생벌(실제 3mm, 세 배로). 제자리에서 맴돌며 배 끝 바늘을 세운다 */
    'butterfly:wasp': { w: 1.8, h: 1.2, d: (time, t) => {
      const hov = Math.sin(time * 5) * .12, buzz = Math.abs(Math.sin(time * 60));
      ctx.save(); ctx.translate(Math.sin(time * 1.3) * .15, hov);
      faded(.5 * (.5 + buzz * .5), () => { E(-.05, -.62, .42, .14, '#eaf4ff'); E(.1, -.58, .36, .12, WHITE); });
      const k = t('#2a2433');
      E(-.42, -.32, .26, .15, k); E(-.15, -.36, .05, .05, k); E(.05, -.38, .16, .13, k); E(.28, -.42, .12, .12, k);
      L(-.66, -.26, -.86, -.12, t('#5a4a46'), .03);                                                         // 산란관
      curve(k, .025, (c) => { c.moveTo(.34, -.5); c.quadraticCurveTo(.5, -.8, .7, -.78); c.moveTo(.3, -.52); c.quadraticCurveTo(.38, -.86, .56, -.92); });
      curve(t('#c9a35a'), .025, (c) => { c.moveTo(-.05, -.26); c.lineTo(-.15, -.08); c.moveTo(.08, -.27); c.lineTo(.12, -.08); });
      E(.32, -.44, .045, .045, t('#e6765f'));
      ctx.restore();
    } },

    /* B4 — 키 큰 풀줄기 하나. 이삭이 고개를 숙이고 바람에 흔들린다 */
    'butterfly:grassStem': { w: 8, h: 26, d: (time, t) => {
      const sw = Math.sin(time * 1.2) * .6, G = planes(t, '#8db86a');
      slab(G.mid, [[-.35, 0], [-.4, -10, .2 + sw * .4, -18, 1 + sw, -24], [1.2 + sw, -24], [.6 + sw * .4, -18, .3, -10, .35, 0]]);
      slab(G.lit, [[-.35, 0], [-.4, -10, .2 + sw * .4, -18, 1 + sw, -24], [.6 + sw * .4, -17, 0, -9, 0, 0]]);
      [[-1, -.9, 7], [1, .6, 6]].forEach(([s, a, len]) => {                                                  // 아래쪽 잎 두 장
        slab(s < 0 ? G.dark : G.mid, [[0, -3], [s * len * .4, -3 - len * .5, s * len, -3 - len * .3 + a], [s * len * .5, -3 - len * .2, 0, -1.8]]);
      });
      const P = planes(t, '#c9b77a');
      placed(1.1 + sw, -24, 1, .5 + sw * .05, () => slab(P.mid, [[0, 0], [1.4, -.6, 2.6, .2, 3.2, 1.6], [2, 1.2, .8, .9, 0, .3]]));
    } },

    /* B4·B5 — 화단 둘레 초록 철제 펜스. 원점 바로 위 기둥이 번데기가 매달릴 자리 */
    'butterfly:fencePost': { w: 30, h: 46, d: (time, t) => {
      const p = planes(t, FENCE);
      [[-44, -.8], [-18, -.5]].forEach(([y, th]) => {                                                       // 가로대 둘
        slab(p.mid, [[0, y], [24, y], [24, y + 1.4], [0, y + 1.4]]); slab(p.lit, [[0, y], [24, y], [24, y + .5], [0, y + .5]]);
        if (th) slab(p.dark, [[0, y + 1.4], [24, y + 1.4], [24, y + 1.7], [0, y + 1.7]]);
      });
      placed(24, 0, 1, 0, () => post(t, 46));
      post(t, 46);
    } },

    /* B4·D4 — 예초기 머리. 긴 자루 끝 주황 덮개 아래로 나일론 줄이 돌고, 풀 조각이 튄다 */
    'butterfly:trimmer': { w: 26, h: 34, d: (time, t) => {
      const O = planes(t, '#e6765f'), M = planes(t, '#9a97a8'), spin = time * 40;
      faded(.3, () => E(0, -.05, 7, .4, INK));
      const shaft = [[1.4, -4.2], [14, -36], [15.6, -35.4], [2.9, -3.6]];
      slab(M.mid, shaft); slab(M.lit, [[1.4, -4.2], [14, -36], [14.6, -35.8], [2, -4]]);
      const guard = [[-6, -2.6], [-5.6, -6.4, 4.8, -6.6, 6.2, -2.4], [3.6, -3.2, -3.4, -3.4, -6, -2.6]];
      slab(O.mid, guard); inside(guard, () => slab(O.lit, [[-7, -8], [0, -8], [-1, -3], [-7, -2]]));
      E(.4, -3, 1.3, .55, M.dark); E(.4, -3.2, .9, .35, M.lit);
      faded(.35, () => E(.4, -2.2, 6.4, .9, t('#f4f1ea')));                                                 // 도는 줄 잔상
      curve(t('#f4f1ea'), .12, (c) => { const a = Math.cos(spin) * 6.2; c.moveTo(.4 - a, -2.2 - Math.sin(spin) * .5); c.lineTo(.4 + a, -2.2 + Math.sin(spin) * .5); });
      for (let i = 0; i < 9; i++) {
        const ph = (time * 1.5 + hash(i, 301)) % 1, dir = hash(i, 302) < .5 ? -1 : 1;
        faded(1 - ph, () => placed(.4 + dir * (2 + ph * 6), -2.2 - Math.sin(ph * Math.PI) * 4, .8, ph * 9 + i, () => slab(t(i % 2 ? '#8db86a' : '#6f9f6c'), [[0, 0], [.3, -.15, .9, -.05], [.4, .1, 0, 0]])));
      }
    } },

    /* B5·D5 — 비 고인 웅덩이. 빗방울 동그라미가 제자리에서 퍼진다 */
    'butterfly:puddle': { w: 14, h: 1, d: (time, t) => {
      const Wt = planes(t, '#8fb3c4'), pool = [[-6.6, -.05], [-6, -.5, -2, -.62, 1, -.55], [4, -.5, 6.8, -.35, 6.4, -.05], [2, .12, -3, .12, -6.6, -.05]];
      slab(Wt.mid, pool);
      inside(pool, () => { slab(Wt.lit, [[-7, -1], [2, -1], [-1, 0], [-7, 0]]); faded(.6, () => E(-2.4, -.32, 1.6, .08, WHITE)); });
      for (let i = 0; i < 4; i++) {
        const ph = (time * .8 + i * .27) % 1, x = -4.4 + hash(i, 311) * 9;
        faded((1 - ph) * .8, () => curve(Wt.lit, .05, (c) => c.ellipse(x, -.25, .2 + ph * 1.4, .05 + ph * .25, 0, 0, TAU)));
      }
    } },

    /* B6 — 내가 빠져나온 빈 번데기 껍질. 펜스 기둥 앞면에 실띠째 매달려 등이 갈라졌다 */
    'butterfly:emptyPupa': { w: 4, h: 46, d: (time, t) => {
      post(t, 46);
      ctx.save(); ctx.translate(0, -1.2);
      const p = planes(t, '#e8e4cf');
      faded(.85, () => { slab(p.mid, PUPA_PTS); inside(PUPA_PTS, () => slab(p.dark, [[.15, -3.6], [.9, -3.6], [.9, 0], [.1, 0]])); });
      slab(p.deep, [[.02, -3.3], [.14, -2.8, .1, -2.3, .02, -2.0], [-.1, -2.4, -.12, -2.9, .02, -3.3]]);       // 갈라진 등
      curve(t(SILK), .035, (c) => { c.moveTo(-.4, -1.62); c.quadraticCurveTo(0, -1.5, .5, -1.7); });
      ctx.restore();
      glint(.3, -3.8, .18, .3 + Math.sin(time * 1.8) * .3);
    } },

    /* B7 — 공원 가장자리 개망초 꽃밭. 가는 줄기 끝에 하얀 작은 꽃이 여럿 흔들린다 */
    'butterfly:fleabane': { w: 18, h: 28, d: (time, t) => {
      const G = planes(t, '#7fae6a');
      [[-6, 22, -1], [-2, 26, 1], [2, 19, -1], [5.5, 24, 1], [8, 15, 1]].forEach(([x, h, s], i) => {
        const sw = Math.sin(time * 1.1 + i * 1.3) * .5, tx = x + s * 1.2 + sw;
        curve(i % 2 ? G.mid : G.dark, .22, (c) => { c.moveTo(x, 0); c.quadraticCurveTo(x - s * .4, -h * .55, tx, -h); });
        [[-1.4, -1.6, .8], [1.3, -1.1, .7]].forEach(([dx, dy, k]) => {
          curve(G.mid, .1, (c) => { c.moveTo(tx - (tx - x) * .12, -h + 2.6); c.quadraticCurveTo(tx + dx * .4, -h + 1.4, tx + dx, -h + dy + 2.2); });
          placed(tx + dx, -h + dy + 1.6, k, 0, () => daisy(t, 1));
        });
        placed(tx, -h, 1, 0, () => daisy(t, 1.15));
        placed(x + s * .6, -h * .3, 1, s < 0 ? Math.PI + .7 : -.7, () => toothLeaf(t, 3.4, '#7fae6a', 4));
      });
    } },

    /* B7·D7 — 풀줄기 사이에 친 둥근 거미줄. 실이 햇빛에 반짝이고 가운데서 거미가 기다린다 */
    'butterfly:orbWeb': { w: 18, h: 26, d: (time, t) => {
      const G = planes(t, '#8db86a'), cx = 0, cy = -14, R = 7.4;
      [[-8.4, 1], [8.2, -1]].forEach(([x, s]) => slab(s > 0 ? G.mid : G.dark, [[x - .3, 0], [x - .3 + s * .4, -14, x + s * .6, -26], [x + s * .6 + .4, -26], [x + .3 + s * .4, -14, x + .3, 0]]));
      const shimmer = (time * .4) % 1;
      faded(.55, () => curve(t('#f4f1ea'), .05, (c) => {
        for (let i = 0; i < 14; i++) { const a = i / 14 * TAU; c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * R * 1.15, cy + Math.sin(a) * R); }
        for (let r = 1; r < R; r += .8) {
          for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU, rr = r + i * .055; const x = cx + Math.cos(a) * rr * 1.15, y = cy + Math.sin(a) * rr; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        }
        c.moveTo(cx - R * 1.15, cy); c.lineTo(-8.2, cy - 2); c.moveTo(cx + R * 1.15, cy - 1); c.lineTo(8.4, cy - 3);
      }));
      glint(cx + Math.cos(shimmer * TAU) * R * .7, cy + Math.sin(shimmer * TAU) * R * .6, .45, .6);
      const bob = Math.sin(time * 1.5) * .1, Sp = planes(t, '#4a3f4f');
      ctx.save(); ctx.translate(cx, cy + bob);
      curve(Sp.mid, .09, (c) => [-1, 1].forEach((s) => [-.3, 0, .3].forEach((y) => { c.moveTo(0, y); c.quadraticCurveTo(s * .9, y - .5, s * 1.3, y + .4 + Math.abs(y)); })));
      E(0, .45, .55, .62, Sp.mid); E(-.15, .3, .3, .3, Sp.lit); E(0, -.35, .34, .3, Sp.mid);
      E(.2, .55, .12, .1, t('#f2c14e'));
      ctx.restore();
    } },

    /* B8 — 보도블록 틈에서 핀 민들레 한 송이. 톱니 잎이 바닥에 납작 붙었다 */
    'butterfly:dandelion': { w: 14, h: 8, d: (time, t) => {
      const B = planes(t, '#c9b8b0');
      [[-7, -2], [.6, 7]].forEach(([a, b]) => { slab(B.mid, [[a, 0], [a, -.5], [b, -.5], [b, 0]]); slab(B.lit, [[a, -.5], [a + .3, -.75], [b - .3, -.75], [b, -.5]]); });
      faded(.6, () => slab(t('#3f3a35'), [[-2, 0], [-2, -.5], [.6, -.5], [.6, 0]]));
      [[-.8, -.6, Math.PI + .25, 3.2], [-.6, -.6, -.3, 3.6], [-.7, -.6, Math.PI - .15, 2.6], [-.7, -.6, -.05, 2.8]].forEach(([x, y, a, len]) => placed(x, y, 1, a, () => toothLeaf(t, len, '#6f9f5c', 5)));
      const sw = Math.sin(time * 1.4) * .25;
      curve(t('#8db86a'), .14, (c) => { c.moveTo(-.7, -.7); c.quadraticCurveTo(-.9, -3, -.6 + sw, -5); });
      placed(-.6 + sw, -5.2, 1, 0, () => {
        const Y = planes(t, '#f6c637'), head = [];
        for (let i = 0; i < 22; i++) { const a = Math.PI + i / 21 * Math.PI, r = i % 2 ? 1.1 : .8; head.push([Math.cos(a) * r, Math.sin(a) * r * .9]); }
        head.push([.9, .2], [0, .5, -.9, .2]);
        slab(Y.mid, head); inside(head, () => slab(Y.dark, [[.2, -1.4], [1.4, -1.4], [1.4, .8], [-.2, .8]]));
        E(-.2, -.4, .45, .3, Y.lit);
        slab(t('#6f9f5c'), [[-.8, .15], [0, .7, .8, .15], [.3, .45, -.3, .45, -.8, .15]]);
      });
    } },

    /* B8·D8 — 주차된 차 앞부분. 비스듬한 앞유리에 파란 하늘과 구름이 비친다 */
    'butterfly:windshield': { w: 44, h: 44, d: (time, t) => {
      ctx.translate(22, 0);                                                                                    // 원점은 앞범퍼 끝, 차는 오른쪽으로
      const C = planes(t, '#e6765f'), G = planes(t, SKY), T = planes(t, '#3a3445');
      faded(.3, () => E(2, -.05, 22, .6, INK));
      const body = [[-21, -5], [-21.6, -11, -20, -14, -16, -15], [2, -18], [23, -48], [24, -48], [24, -5]];
      slab(C.mid, body);
      inside(body, () => { slab(C.lit, [[-22, -16], [3, -19.6], [4, -16.2], [-22, -12.6]]); slab(C.dark, [[-22, -8], [24, -8], [24, -2], [-22, -2]]); });
      const glass = [[3.2, -18.6], [22.4, -46], [24, -48], [24, -22], [5.6, -17.4]];
      slab(G.mid, glass);
      inside(glass, () => {
        slab(G.lit, [[0, -16], [24, -50], [24, -40], [6, -16]]);
        const drift = Math.sin(time * .3) * .6;
        faded(.85, () => { E(14 + drift, -30, 3.4, 1.1, WHITE); E(16.4 + drift, -31, 2.2, 1.4, WHITE); E(19 + drift, -38, 2.4, .8, WHITE); });
      });
      slab(T.mid, [[-21, -5], [24, -5], [24, -3.4], [-20.4, -3.4]]);
      slab(t('#fff1cf'), [[-20.4, -12.2], [-16, -13.6], [-15.4, -11.4], [-20.2, -10.6]]);                     // 전조등
      ctx.save(); ctx.beginPath(); ctx.rect(-30, -20, 60, 20); ctx.clip();
      E(-9, 0, 6.6, 6.6, T.mid); E(-9.6, -.6, 5.6, 5.6, T.lit); E(-9, 0, 3, 3, t('#cfcad8'));
      ctx.restore();
    } },

    /* B9 — 빌라 담장을 타고 오른 장미 덩굴. 붉은 꽃 세 송이와 톱니 잎 */
    'butterfly:roseVine': { w: 16, h: 30, d: (time, t) => {
      const V = planes(t, '#6b7f4a'), sw = Math.sin(time * .9) * .3;
      curve(V.mid, .35, (c) => { c.moveTo(-1, 0); c.bezierCurveTo(-3, -8, 3, -14, -1 + sw, -26); c.moveTo(.4, -12); c.quadraticCurveTo(4, -15, 5 + sw, -20); });
      [[-2.2, -6, Math.PI + .5, 3.2], [1.2, -10, -.4, 3], [-.6, -18, Math.PI + .3, 2.8], [3.6, -17, -.8, 2.6], [.6, -23, -.2, 2.4]].forEach(([x, y, a, len]) => placed(x, y, 1, a, () => toothLeaf(t, len, '#5f8a4f', 5)));
      [[-1 + sw, -26.2, 1.5], [5 + sw, -20.6, 1.3], [-1.4, -14, 1.2]].forEach(([x, y, r]) => placed(x, y, 1, 0, () => bloom(t, r, '#d9485f')));
    } },

    /* B9·D9 — 등에 멘 소독통의 긴 분무 막대. 장갑 낀 손이 쥐고, 끝에서 하얀 안개가 뿜어진다 */
    'butterfly:sprayer': { w: 34, h: 34, d: (time, t) => {
      const M = planes(t, '#b9b6c4'), sway = Math.sin(time * 1.2) * .04;
      ctx.save(); ctx.translate(14, -26); ctx.rotate(sway);
      for (let i = 0; i < 22; i++) {                                                                            // 안개: 노즐에서 왼쪽 아래로 퍼진다 (제자리에서 되풀이)
        const ph = (time * .7 + hash(i, 321)) % 1, a = Math.PI * .82 + (hash(i, 322) - .5) * .6, d = 1 + ph * 13;
        faded(.55 * (1 - ph), () => E(-16 + Math.cos(a) * d, 8.2 + Math.sin(a) * d * .7 + ph * 2, .5 + ph * 2, .45 + ph * 1.7, t('#f4f1ea')));
      }
      const wand = [[-15.4, 7.6], [10, -2], [10.4, -1], [-15, 8.6]];
      slab(M.mid, wand); slab(M.lit, [[-15.4, 7.6], [10, -2], [10.2, -1.6], [-15.2, 8]]);
      slab(M.dark, [[-16.6, 7.4], [-15.2, 7], [-14.8, 9.2], [-16.2, 9.6]]);                                   // 노즐
      sleeveArm(t, 16, -6, 6, -.4, 5, '#5f7f9a');
      artHandOnArm(t, 6, -.4, Math.PI * .86, 11, { pose: 'grip', coat: GLOVE });
      ctx.restore();
    } },

    /* K1 — 창틀에 놓인 제라늄 화분. 둥근 톱니 잎 위로 빨간 꽃송이 */
    'butterfly:geranium': { w: 12, h: 16, d: (time, t) => {
      const P = planes(t, '#c9714e'), L0 = planes(t, '#6f9f5c'), sw = Math.sin(time * .8) * .2;
      const pot = [[-4, -7], [4, -7], [3.1, 0], [-3.1, 0]];
      slab(P.mid, pot); inside(pot, () => { slab(P.lit, [[-5, -8], [-1.6, -8], [-2, 1], [-5, 1]]); slab(P.dark, [[2, -8], [5, -8], [5, 1], [1.8, 1]]); });
      slab(P.lit, [[-4.4, -7], [4.4, -7], [4.4, -8], [-4.4, -8]]);
      [[-3, -9, 2], [2.6, -9.4, 2.2], [0, -10.6, 2.4]].forEach(([x, y, r], i) => {
        const leaf = [[x + r * .9, y]];
        for (let k = 1; k <= 9; k++) { const am = (k - .5) / 9 * TAU, a = k / 9 * TAU; leaf.push([x + Math.cos(am) * r * 1.15, y + Math.sin(am) * r * .7, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .55]); }
        slab(i === 1 ? L0.dark : L0.mid, leaf); faded(.5, () => curve(L0.dark, .12, (c) => c.ellipse(x, y, r * .5, r * .3, 0, 0, TAU)));
      });
      curve(L0.mid, .16, (c) => { c.moveTo(0, -10); c.quadraticCurveTo(.2, -13, sw, -14.4); });
      [[-.7, -14.6], [.6, -14.8], [0, -15.6], [-.2, -14]].forEach(([x, y]) => placed(x + sw, y, 1, 0, () => bloom(t, .7, '#e04f5f')));
    } },

    /* K1·D10 — 알루미늄 창틀과 촘촘한 방충망. 창턱엔 말라 버린 날벌레, 망 모서리 한 곳이 살짝 벌어졌다 */
    'butterfly:screenMesh': { w: 30, h: 44, d: (time, t) => {
      const A = planes(t, '#d4d0dc'), out = .5 + Math.sin(time * .6) * .05;
      faded(out, () => slab(t(SKY), [[-13, -44], [13, -44], [13, -3], [-13, -3]]));
      faded(.5, () => slab(t('#cfe3c8'), [[-13, -12], [-6, -16, 4, -14, 13, -18], [13, -3], [-13, -3]]));
      ctx.save(); ctx.beginPath(); ctx.rect(-13, -44, 26, 41); ctx.clip();
      faded(.4, () => curve('#8d8a9c', .05, (c) => {
        for (let x = -13; x <= 13; x += .5) { c.moveTo(x, -44); c.lineTo(x, -3); }
        for (let y = -44; y <= -3; y += .5) { c.moveTo(-13, y); c.lineTo(13, y); }
      }));
      ctx.restore();
      slab(t('#fffaf0'), [[11.6, -4.6], [13, -4.6], [13, -7.4]]);                                             // 벌어진 틈
      slab(A.lit, [[-14.4, -44], [-13, -44], [-13, -3], [-14.4, -3]]); slab(A.dark, [[13, -44], [14.4, -44], [14.4, -3], [13, -3]]);
      slab(A.mid, [[-15, -3], [15, -3], [15, 0], [-15, 0]]); slab(A.lit, [[-15, -3], [15, -3], [14.4, -3.6], [-14.4, -3.6]]);
      [[-7, -3.1, .3], [3, -3.1, -.4]].forEach(([x, y, a]) => placed(x, y, 1, a, () => {                      // 마른 날벌레
        E(0, -.12, .32, .12, t('#5a5060')); faded(.6, () => E(-.1, -.28, .26, .08, t('#e9e4ec')));
        curve(t('#5a5060'), .03, (c) => { c.moveTo(-.1, -.05); c.lineTo(-.18, -.32); c.moveTo(.1, -.05); c.lineTo(.2, -.3); });
      }));
    } },

    /* B10 — 나를 찾아온 수컷. 앞날개 점이 하나뿐이고, 내 주위를 맴돌며 팔랑인다 */
    'butterfly:mate': { w: 5, h: 6, d: (time, t) => {
      const k = .35 + Math.abs(Math.sin(time * 7 + 1)) * .65, y = -2.4 + Math.sin(time * 2.2) * .3;
      placed(0, y, .92, Math.sin(time * 1.1) * .08, () => butterflyBody(time + 1.7, t, { k, male: true }));
      const ph = (time * .5) % 1;
      faded(Math.sin(ph * Math.PI) * .9, () => {
        const x = .9, hy = y - 3.2 - ph * 1.2, r = .22;
        ctx.fillStyle = BLUSH; ctx.beginPath(); ctx.moveTo(x, hy + r * 1.2);
        ctx.bezierCurveTo(x - r * 2, hy - r * .2, x - r * .8, hy - r * 1.6, x, hy - r * .5); ctx.bezierCurveTo(x + r * .8, hy - r * 1.6, x + r * 2, hy - r * .2, x, hy + r * 1.2); ctx.fill();
      });
    } },

    /* B10·D11 — 아이의 잠자리채. 노란 장대 끝 분홍 그물이 제자리에서 흔들흔들 */
    'butterfly:bugNet': { w: 22, h: 34, d: (time, t) => {
      ctx.save(); ctx.translate(4, -34); ctx.rotate(Math.sin(time * 1.3) * .08); ctx.translate(-4, 34);
      const P0 = planes(t, '#f2c14e'), N = planes(t, '#ff8fa3');
      slab(P0.mid, [[3.6, -10.4], [4, -40], [4.8, -40], [4.6, -10.4]]); slab(P0.lit, [[3.6, -10.4], [4, -40], [4.25, -40], [3.95, -10.4]]);
      const bag = [[-5.4, -9.6], [-6, -2, -2.2, 3.2, .8, 3.6], [2.8, 2.4, 5.4, -3, 5.2, -9.6]];
      faded(.7, () => { slab(N.mid, bag); inside(bag, () => { slab(N.lit, [[-7, -11], [-5, -1, -1, 3, .4, 5], [-1.6, -2, -2.4, -7, -1.6, -11]]); slab(N.dark, [[2.4, -11], [3, -2, 1.6, 3, 1, 5], [7, 5], [7, -11]]); }); });
      faded(.75, () => E(0, -9.6, 5.2, .9, N.deep));
      curve(P0.dark, .3, (c) => c.ellipse(0, -9.6, 5.3, .95, 0, Math.PI, TAU));
      curve(P0.lit, .32, (c) => c.ellipse(0, -9.6, 5.3, .95, 0, 0, Math.PI));
      ctx.restore();
    } },

    /* B11 — 할머니가 케일 쪽으로 내민 손. 주름진 손바닥을 위로, 꽃무늬 소매 */
    'butterfly:grandmaHand': { w: 26, h: 30, d: (time, t) => {
      const lift = Math.sin(time * 1.1) * .3;
      ctx.save(); ctx.translate(0, lift);
      sleeveArm(t, 18, -30, 8.6, -6.6, 6.2, SLEEVE);
      artHandOnArm(t, 8.6, -6.6, Math.PI * .9, 15, { pose: 'offer' });
      curve(t(shade(SKIN)), .08, (c) => { c.moveTo(5.2, -5.8); c.quadraticCurveTo(4, -5.4, 3, -5.7); c.moveTo(5.6, -5.2); c.quadraticCurveTo(4.6, -4.9, 3.6, -5.1); });   // 손바닥 주름
      ctx.restore();
    } },
  };

  return { art, hero };
})());
