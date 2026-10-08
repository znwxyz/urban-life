/* 말벌(등검은말벌 여왕) 장면 전용 그림과 주인공 그림. 키는 'wasp:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   말벌 눈높이(화면 폭 약 60cm)에 맞춰 실제 크기로 그린다: 여왕 3cm, 첫 둥지 7cm, 음료수 캔 12cm, 실외기 받침 높이 11cm.
   종이 둥지는 겹겹이 물결진 종이 띠로 오린다(말벌이 나무를 씹어 만든 진짜 종이). 사물은 곡선 외곽 하나에 한 색의 2~3톤.
   조연은 제자리에서만 움직인다(날갯짓·더듬이·흔들림). 걷거나 흘러가면 화면이 밀릴 때 뒷걸음처럼 보인다 */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.wasp = pack.hero; }
})((() => {
  const DARK = '#4a3428', DARK_HI = '#6a4c3a', BAND = '#f4b844', ORANGE = '#ec8f3c', FACE = '#f2b54e', LEG = '#f3c65a';
  const WING = '#eef6ff', VEIN = '#9a8f86';
  const NEST = '#d9c19a', NEST_B = '#c4a47a', NEST_G = '#b9ab98';
  const STEEL = '#8c94a6', LEAF_C = '#6fa86a', HONEY = '#e9a43a';
  const HOVER = 1.5;

  /** 투명도를 잠깐 바꿔 그린다 */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, alpha)); draw(); ctx.restore(); }
  /** 곡선 경로를 칠한다. build(ctx)에서 moveTo/curveTo로 모양을 만든다 */
  function shape(color, build) { ctx.fillStyle = color; ctx.beginPath(); build(ctx); ctx.closePath(); ctx.fill(); }
  /** cm 점 목록으로 경로를 만든다 (y는 아래가 +). 점 형식: [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
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
  /** 면 하나를 오려 붙인다 */
  function slab(c, pts) { trace(pts); ctx.fillStyle = c; ctx.fill(); }
  /** 외곽(pts) 안에만 draw()가 칠해진다 */
  function inside(pts, draw) { ctx.save(); trace(pts); ctx.clip(); draw(); ctx.restore(); }
  /** 곡선 선 */
  function curve(color, w, build) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(ctx); ctx.stroke(); ctx.restore();
  }
  /** 위치·배율·각도로 놓고 그린다 */
  function placed(x, y, k, rot, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k); draw(); ctx.restore(); }
  /** 반짝이는 십자 빛 */
  function glint(x, y, r, alpha) {
    faded(alpha, () => { L(x - r, y, x + r, y, WHITE, r * .22); L(x, y - r, x, y + r, WHITE, r * .22); });
  }

  /* ── 말벌 몸 ── */

  /** 날개 한 장: 밑동이 원점, 뒤(왼쪽)로 뻗는다. 앞 가장자리 맥 하나만 */
  function wingLeaf(t, len, alpha) {
    faded(alpha, () => shape(t(WING), (c) => {
      c.moveTo(0, 0); c.bezierCurveTo(-.25 * len, -.3 * len, -.75 * len, -.36 * len, -len, -.2 * len);
      c.quadraticCurveTo(-1.06 * len, -.04 * len, -.86 * len, .01 * len); c.bezierCurveTo(-.55 * len, .05 * len, -.22 * len, .05 * len, 0, 0);
    }));
    faded(alpha * .9, () => curve(t(VEIN), .035, (c) => { c.moveTo(0, 0); c.bezierCurveTo(-.25 * len, -.3 * len, -.75 * len, -.36 * len, -len, -.2 * len); }));
  }

  /** 날개 한 쌍. buzz면 위쪽 두 자리에 흐릿하게 겹쳐 붕붕 떠는 것처럼 (몸 위로만 올라가 몸을 흐리게 덮지 않는다) */
  function wings(time, t, buzz) {
    const base = [.3, -.4];
    if (!buzz) { placed(...base, 1, .12, () => { wingLeaf(t, 1.55, .55); placed(-.05, .05, 1, .1, () => wingLeaf(t, 1.05, .45)); }); return; }
    const flick = Math.sin(time * 90) * .5 + .5;
    [.9 + flick * .15, .28 - flick * .12].forEach((a, i) => placed(...base, 1, a, () => {
      wingLeaf(t, 1.55, i ? .5 : .32); placed(-.05, .05, 1, .12, () => wingLeaf(t, 1.05, i ? .4 : .25));
    }));
  }

  /** 다리 하나: 갈색 허벅지, 노란 종아리와 발끝 */
  function waspLeg(pts, t) {
    curve(t(DARK), .1, (c) => { c.moveTo(...pts[0]); c.lineTo(...pts[1]); });
    curve(t(LEG), .085, (c) => { c.moveTo(...pts[1]); c.lineTo(...pts[2]); });
  }

  /** 배(복부): 진갈색 바탕에 노랑·주황 굵은 띠, 위는 볕 받아 밝고 아래는 그늘. 둥근 콩 모양 */
  const GASTER = [[-.08, -.12], [-.12, -.7, -.95, -.8, -1.42, -.46], [-1.72, -.2, -1.76, .1], [-1.62, .44, -1.05, .54], [-.48, .58, -.04, .32, -.08, -.12]];
  function gaster(t, o) {
    const D = planes(t, o.dark || DARK);
    slab(D.mid, GASTER);
    inside(GASTER, () => {
      [[-.28, .2, BAND], [-.72, .22, BAND], [-1.12, .32, ORANGE]].forEach(([x, w, c]) => {
        const B = planes(t, c);
        slab(B.mid, [[x, -1], [x - .14, -.2, x - .02, .7], [x - w, .7], [x - w - .14, -.2, x - w, -1]]);
        slab(B.lit, [[x, -1], [x - w, -1], [x - w - .06, -.55], [x - .04, -.55]]);
      });
      faded(.5, () => slab(D.lit, [[-2, -1], [.2, -1], [.1, -.5], [-.6, -.62, -1.3, -.5, -2, -.2]]));   // 볕 받는 등
      faded(.55, () => slab(D.deep, [[-2, .22], [-1.2, .26, -.5, .32, .2, .16], [.2, .8], [-2, .8]]));   // 배 밑 그늘
    });
  }

  /** 말벌 한 마리 (옆모습, 몸 가운데가 원점, 길이 약 3.2). 머리가 크고 둥글다.
      o: { k 배율, buzz, stern 눈썹, noBlush, eyeK, dark, seed } */
  function waspBody(time, t, o = {}) {
    ctx.save(); ctx.scale(o.k || 1, o.k || 1);
    const D = planes(t, DARK), F = planes(t, FACE), tw = Math.sin(time * 5 + (o.seed || 0)) * .06;
    [[[.46, .22], [.56, .5], [.44, .78]], [[.26, .26], [.2, .54], [.04, .78]], [[.08, .22], [-.12, .48], [-.34, .68]]]
      .forEach((p, i) => faded(i === 1 ? .7 : 1, () => waspLeg(p, t)));
    gaster(t, o);
    E(-.02, -.06, .14, .11, D.mid);                                                                   // 허리
    const thorax = [[0, -.1], [0, -.5, .66, -.6, .74, -.14], [.72, .2, .16, .32, 0, -.1]];
    slab(D.mid, thorax);
    inside(thorax, () => slab(D.lit, [[-.1, -.7], [.8, -.7], [.66, -.4, .28, -.32, -.1, -.22]]));
    curve(t(DARK), .055, (c) => { c.moveTo(1.02, -.52); c.quadraticCurveTo(1.08, -.9 + tw, 1.2, -.98 + tw); c.quadraticCurveTo(1.42, -1.02 + tw, 1.58, -.88 + tw * 1.5); });   // 더듬이
    const head = [[.6, -.1], [.58, -.58, .98, -.66, 1.18, -.56], [1.48, -.4, 1.52, .04, 1.34, .26], [1.1, .44, .66, .3, .6, -.1]];
    slab(F.mid, head);
    inside(head, () => {
      slab(F.lit, [[.5, -.7], [1.4, -.7], [1.16, -.24, .86, -.08, .5, .05]]);
      slab(D.mid, [[.5, -.8], [1.16, -.8], [1.08, -.5, .92, -.34, .76, -.14], [.62, .1], [.5, .1]]);   // 정수리와 뒤통수는 검은 갈색
    });
    const ek = o.eyeK || 1;
    cuteEye(1.13, -.16, .16 * ek, .2 * ek, time + (o.seed || 0), t);
    if (o.stern) curve(t(INK), .05, (c) => { c.moveTo(.96, -.46); c.lineTo(1.3, -.34); });
    if (!o.noBlush) blush(1.3, .1, .11, .065);
    curve(t(DARK), .055, (c) => { c.moveTo(1.38, .2); c.quadraticCurveTo(1.46, .32, 1.36, .37); });   // 작은 턱
    wings(time, t, o.buzz);
    ctx.restore();
  }

  /** 떠 있는 말벌: 제자리에서 둥실둥실, 날개는 붕붕 */
  function hoverWasp(time, t, o = {}) {
    const bob = Math.sin(time * 3 + (o.seed || 0)) * .12;
    placed(0, -(o.h ?? HOVER) + bob, 1, o.tilt || 0, () => waspBody(time, t, { buzz: true, ...o }));
  }

  /** 주인공: 늘 떠 있다. 날아갈 때는 몸을 앞으로 기울이고 붕붕 소리 줄이 뒤로 남는다 */
  function hero(time, moving, eye, t) {
    faded(.16, () => E(0, -.02, .9, .1, t(INK)));
    const bob = moving ? Math.sin(time * 9) * .1 : Math.sin(time * 2.6) * .14;
    placed(0, -HOVER + bob, 1, moving ? .1 : 0, () => waspBody(time, t, { buzz: true }));
    if (!moving) return;
    for (let i = 0; i < 3; i++) {
      const ph = (time * 3 + i / 3) % 1;
      faded((1 - ph) * .5, () => curve(t('#fff3c4'), .05, (c) => { c.moveTo(-1.9 - ph * .8, -HOVER - .5 + i * .35); c.lineTo(-2.4 - ph * 1.2, -HOVER - .5 + i * .35); }));
    }
  }

  /* ── 종이 둥지 ── */

  /** 물결진 종이 띠: 아래 띠부터 위로 덮어 가며 칠한다. 띠 아래 가장자리가 조개껍데기처럼 물결진다 */
  function paperBands(outline, x0, x1, yTop, yBot, n, t, salt) {
    const tones = [NEST, NEST_B, NEST, NEST_G].map((c) => planes(t, c));
    const cx = (x0 + x1) / 2, rx = (x1 - x0) / 2, wv = Math.max(.5, rx / 3.2);
    inside(outline, () => {
      slab(tones[0].mid, [[x0 - 1, yTop - 1], [x1 + 1, yTop - 1], [x1 + 1, yBot + 1], [x0 - 1, yBot + 1]]);
      for (let i = 1; i <= n; i++) {
        const y = yBot - (yBot - yTop) * i / (n + 1), tone = tones[(i + Math.floor(hash(i, salt) * 2)) % tones.length].mid;
        const sag = (x) => y + Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) * rx * .14;
        ctx.beginPath(); ctx.moveTo(x0 - 1, yTop - 1); ctx.lineTo(x0 - 1, sag(x0));
        for (let x = x0; x < x1; x += wv) {
          const xe = Math.min(x1 + wv, x + wv), d = wv * (.36 + hash(i * 31 + Math.round(x * 10), salt) * .14);
          ctx.quadraticCurveTo((x + xe) / 2, sag((x + xe) / 2) + d, xe, sag(xe));
        }
        ctx.lineTo(x1 + 1, yTop - 1); ctx.closePath(); ctx.fillStyle = tone; ctx.fill();
      }
      faded(.45, () => slab(t(mix(NEST, '#fffaf0', .45)), [[x0 - 1, yTop - 1], [cx - rx * .35, yTop - 1], [cx - rx * .55, (yTop + yBot) / 2, cx - rx * .3, yBot + 1], [x0 - 1, yBot + 1]]));   // 볕 받는 왼쪽
      faded(.38, () => slab(t('#5a4636'), [[cx + rx * .4, yTop - 1], [x1 + 1, yTop - 1], [x1 + 1, yBot + 1], [cx + rx * .3, yBot + 1], [cx + rx * .72, (yTop + yBot) / 2, cx + rx * .4, yTop - 1]]));   // 오른쪽 그늘
    });
  }

  /** 애벌레 머리: 방 입구에서 고개를 내밀고 까딱 */
  function larva(x, y, r, time, t, i) {
    const nod = Math.sin(time * 4 + i * 1.7) * r * .15;
    E(x, y + nod, r, r * .9, t('#fbf4e2')); E(x - r * .3, y - r * .35 + nod, r * .3, r * .22, WHITE);
    E(x + r * .2, y + r * .35 + nod, r * .28, r * .16, t('#c98a4a'));
  }

  /** 육각 방 하나 (아래에서 올려다본 방 입구) */
  function cell(x, y, r, c) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + Math.PI / 6; ctx[k ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r * .55); }
    ctx.closePath(); ctx.fillStyle = c; ctx.fill();
  }

  /** 잎 하나: 톱니 가장자리, 가운데 맥. len 길이, 원점은 잎자루 */
  function leaf(len, color, t, teeth = 8) {
    const wd = len * .27, edge = (side) => {
      const pts = [];
      for (let i = 0; i <= teeth; i++) { const u = i / teeth, x = u * len, y = side * Math.sin(u * Math.PI) ** .8 * wd; pts.push([x, y], [x + len / teeth * .5, y * .86]); }
      return pts;
    };
    shape(t(color), (c) => { c.moveTo(0, 0); edge(-1).forEach(([x, y]) => c.lineTo(x, y)); edge(1).reverse().forEach(([x, y]) => c.lineTo(x, y)); });
    shape(t(shade(color)), (c) => { c.moveTo(0, 0); edge(1).forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(len, 0); });
    curve(t(mix(color, '#ffffff', .35)), len * .014, (c) => { c.moveTo(0, 0); c.lineTo(len * .96, 0); });
  }

  /** 가는 나뭇가지 (볕 받는 윗면 한 줄) */
  function twig(pts, w, t, c = '#6b4f3e') {
    const p = planes(t, c);
    curve(p.mid, w, (cc) => pts.forEach((q, i) => (i ? (q.length === 4 ? cc.quadraticCurveTo(...q) : cc.lineTo(...q)) : cc.moveTo(...q))));
    curve(p.lit, w * .35, (cc) => pts.forEach((q, i) => (i ? (q.length === 4 ? cc.quadraticCurveTo(q[0], q[1] - w * .25, q[2], q[3] - w * .25) : cc.lineTo(q[0], q[1] - w * .25)) : cc.moveTo(q[0], q[1] - w * .25))));
  }

  /** 꿀벌 (1.2cm): 노랑·밤색 줄무늬 둥근 몸, 붕붕 날개 */
  function honeybee(x, y, time, t, i, flying) {
    placed(x, y + (flying ? Math.sin(time * 4 + i) * .25 : 0), .42, flying ? -.15 : 0, () => {
      const B = planes(t, '#e9b04a');
      const body = [[-1.2, 0], [-1.1, -.55, .2, -.62, .5, -.3], [.6, .1, -.4, .45, -1.2, 0]];
      slab(B.mid, body);
      inside(body, () => [-.85, -.4, .05].forEach((x0) => slab(t('#5a3f2e'), [[x0, -1], [x0 + .22, -1], [x0 + .3, 1], [x0 + .08, 1]])));
      E(.75, -.15, .32, .3, t('#5a3f2e')); E(.85, -.22, .08, .09, WHITE);
      const f = flying ? .5 + Math.abs(Math.sin(time * 70 + i)) * .5 : .7;
      faded(.6, () => shape(t(WING), (c) => { c.moveTo(.1, -.5); c.quadraticCurveTo(-.4, -1.1 * f - .3, -1, -.7 * f - .3); c.quadraticCurveTo(-.5, -.45, .1, -.5); }));
    });
  }

  const art = {
    /* Q1 — 겨울을 난 빌라 외벽 모서리. 크림색 외벽에 금이 갔고, 틈 입구에 페인트가 말려 일어났다 */
    'wasp:wallCrack': { w: 15, h: 30, d: (time, t) => {
      const W0 = planes(t, '#e8d6c0'), G = planes(t, '#a9a3a6');
      const wall = [[-9, 0], [-9, -34], [5.6, -34], [6, -16, 5.6, 0]];
      slab(W0.mid, wall);
      inside(wall, () => {
        slab(W0.lit, [[-10, 1], [-10, -35], [-6.6, -35], [-6.8, 1]]);                                            // 모서리 옆면 (볕)
        faded(.5, () => slab(W0.lit, [[-6.8, -35], [-1, -35], [-4.6, 1], [-6.8, 1]]));                              // 비스듬히 든 봄볕
        slab(G.mid, [[-13, 1], [-13, -3.4], [11, -3.6], [11, 1]]);                                               // 화강석 걸레받이
        slab(G.lit, [[-13, -3.4], [11, -3.6], [11, -2.9], [-13, -2.7]]);
        slab(G.lit, [[-13, 1], [-13, -3.4], [-6.8, -3.4], [-6.8, 1]]);
      });
      const crack = [[1.4, -24], [2.2, -18, 1.6, -15], [3.6, -10], [2.9, -6.6], [3.9, -3.7], [3.3, -3.7], [2.5, -6.4], [2.9, -9.6], [.9, -14.8], [1.2, -18, 1.4, -24]];
      slab(t('#3a2c30'), crack);                                                                                  // 갈라진 틈
      slab(W0.dark, [[3.9, -3.7], [3.6, -10], [2.2, -18, 1.4, -24], [2.6, -18, 4.3, -10], [4.5, -3.7]]);       // 틈 오른쪽 그늘진 턱
      [[2.6, -9.2, 1], [1.2, -15.4, -1]].forEach(([x, y, s], i) => {                                            // 말려 일어난 페인트 조각
        const lift = Math.sin(time * 1.5 + i) * .08;
        slab(W0.lit, [[x, y], [x - s * 1.3, y - .4 - lift, x - s * 1.6, y + .5 - lift], [x - s * .8, y + .3, x, y + .5]]);
        slab(W0.dark, [[x - s * 1.6, y + .5 - lift], [x - s * 1.1, y + .9, x, y + .5], [x - s * .8, y + .3]]);
      });
      [[-5, 2], [4.6, 1.6]].forEach(([x, h], i) => {                                                               // 틈에 난 이끼와 풀
        const sw = Math.sin(time * 1.2 + i) * .1;
        shape(t(i ? '#7fae6a' : '#5f8f5a'), (c) => { c.moveTo(x - .5, -3.4); c.quadraticCurveTo(x - .3, -3.4 - h, x + sw, -3.6 - h * 1.4); c.quadraticCurveTo(x + .4, -3.4 - h * .6, x + .6, -3.4); });
      });
    } },

    /* Q1 — 골목 쪽 반지하 창문. 방범창 너머 미닫이가 한 뼘 열렸고, 따뜻한 김이 새어 나온다 */
    'wasp:basementWindow': { w: 26, h: 18, d: (time, t) => {
      ctx.save(); ctx.scale(.8, .9);
      const F = planes(t, '#dcdfe6'), C = planes(t, '#b9b2aa'), G = planes(t, '#a9cbd6');
      slab(C.mid, [[-16, 0], [-16, -2.6], [16, -2.6], [16, 0]]);                                                // 창 아래 시멘트 턱
      slab(C.lit, [[-16, -2.6], [16, -2.6], [15.2, -3.2], [-15.2, -3.2]]);
      const frame = [[-14, -3.2], [-14, -17.4], [14, -17.4], [14, -3.2]];
      slab(F.mid, frame);
      slab(G.mid, [[-12.8, -4.4], [-12.8, -16.2], [3, -16.2], [3, -4.4]]);                                     // 닫힌 유리
      faded(.45, () => slab(WHITE, [[-11, -16.2], [-8.6, -16.2], [-12.2, -4.4], [-12.8, -4.4], [-12.8, -9]]));
      slab(t('#4a3a40'), [[3, -4.4], [3, -16.2], [12.8, -16.2], [12.8, -4.4]]);                                // 열린 틈 속 어두운 방
      faded(.4 + Math.sin(time * 1.3) * .06, () => slab(t('#ffcf8a'), [[3, -4.4], [3, -12], [7, -16.2], [12.8, -16.2], [12.8, -4.4]]));   // 방 안의 따뜻한 불빛
      slab(F.lit, [[-14, -17.4], [14, -17.4], [13, -16.2], [-12.8, -16.2], [-12.8, -3.2], [-14, -3.2]]);       // 창틀 윗면·왼쪽 (볕)
      slab(F.dark, [[3, -4.4], [3, -16.2], [4.2, -16.2], [4.2, -4.4]]);                                        // 미닫이 문짝 끝
      const bar = planes(t, '#6f6a7a');
      [-7, 0, 7.4].forEach((x) => { slab(bar.mid, [[x, -3.2], [x, -17.4], [x + .6, -17.4], [x + .6, -3.2]]); slab(bar.lit, [[x, -3.2], [x, -17.4], [x + .2, -17.4], [x + .2, -3.2]]); });   // 방범창 살
      for (let i = 0; i < 3; i++) {                                                                              // 피어오르는 김 (제자리에서 오르다 사라짐)
        const ph = (time * .35 + i / 3) % 1;
        faded(Math.sin(ph * Math.PI) * .5, () => curve('#fff6e8', .22, (c) => {
          const x = 6 + i * 2.4, y = -14 - ph * 4;
          c.moveTo(x, y + 2); c.bezierCurveTo(x - .8, y + 1, x + .8, y, x, y - 1.2);
        }));
      }
      ctx.restore();
    } },

    /* Q2 — 공원 벚나무 가지 끝. 꽃송이마다 꿀이 반짝이고, 꽃잎이 제자리에서 하나씩 진다 */
    'wasp:cherryTwig': { w: 26, h: 26, d: (time, t) => {
      const sway = Math.sin(time * .9) * .012;
      ctx.save(); ctx.rotate(sway);
      twig([[14, -30], [8, -24, 2, -20], [-4, -16, -11, -14]], .7, t, '#6a4a4a');
      twig([[4, -21], [5, -16, 3, -12]], .35, t, '#6a4a4a');
      twig([[-4, -16.5], [-6, -20, -8, -21.5]], .3, t, '#6a4a4a');
      [[-11, -14, 1.5], [-8, -21.4, 1.3], [3, -11.6, 1.6], [-3.6, -15.6, 1.4], [8.4, -23.2, 1.4], [6, -18.8, 1.2], [-6.4, -12.6, 1.2]].forEach(([x, y, k], i) => {
        placed(x, y, k, i * .9, () => blossom(t));
        if (i % 2 === 0) glint(x + .3, y - .2, .4, .3 + Math.sin(time * 2.2 + i) * .35);
      });
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        const ph = (time * .22 + i / 3) % 1, x0 = -6 + i * 6;
        faded(1 - ph * .9, () => placed(x0 + Math.sin(ph * 9 + i) * 1.2, -12 + ph * 11, .8, ph * 7 + i, () => petal(t)));
      }
    } },

    /* Q3·D3 — 실외기 받침과 실외기 아래 귀퉁이. 둥근 팬 그릴 너머로 날개가 천천히 돈다 */
    'wasp:acCorner': { w: 46, h: 30, d: (time, t) => {
      const U = planes(t, '#e9e5d9'), S = planes(t, STEEL), Fn = planes(t, '#8f8a96');
      const unit = [[-6, -11.6], [-6, -46], [40, -46], [40, -11.6]];
      slab(U.mid, unit);
      inside(unit, () => {
        slab(U.lit, [[-7, -10], [-7, -47], [-3.4, -47], [-3.4, -10]]);                                           // 실외기 왼쪽 옆면 (볕)
        E(19, -31, 14.4, 14.4, U.dark);                                                                          // 그릴 둘레 움푹한 테
        E(19, -31, 13, 13, Fn.deep);                                                                             // 팬 속 어둠
        placed(19, -31, 1, time * .6, () => [0, 1, 2].forEach((k) => placed(0, 0, 1, k * TAU / 3, () =>
          slab(Fn.mid, [[0, 0], [3, -2, 9, -3.4, 11.4, -1.2], [9, 1.6, 4, 2.4, 0, 0]]))));                         // 팬 날개 셋
        faded(.55, () => curve(U.lit, .2, (c) => [3, 4.6, 6.2, 7.8, 9.4, 11, 12.6].forEach((r) => { c.moveTo(19 + r, -31); c.arc(19, -31, r, 0, TAU); })));   // 촘촘한 그릴 살
        slab(U.dark, [[-7, -11.6], [41, -11.6], [41, -13], [-7, -13]]);                                          // 밑판 그늘
      });
      const rail = [[-8, -10.4], [42, -10.4], [42, -11.8], [-8, -11.8]];                                          // ㄱ자 받침 윗변
      slab(S.mid, rail); slab(S.lit, [[-8, -11.8], [42, -11.8], [41.4, -12.3], [-7.4, -12.3]]);
      [[-5, 1], [36, 1]].forEach(([x]) => {
        slab(S.mid, [[x, 0], [x, -10.4], [x + 1.3, -10.4], [x + 1.3, 0]]); slab(S.lit, [[x, 0], [x, -10.4], [x + .45, -10.4], [x + .45, 0]]);
        slab(S.dark, [[x - .9, 0], [x - .9, -.5], [x + 2.2, -.5], [x + 2.2, 0]]);                                // 발판
      });
      const H = planes(t, '#b9b5c0');                                                                            // 늘어진 물 호스와 물방울
      curve(H.mid, .9, (c) => { c.moveTo(30, -11.6); c.bezierCurveTo(30, -6, 26, -4, 25, -.6); });
      curve(H.lit, .3, (c) => { c.moveTo(29.7, -11.4); c.bezierCurveTo(29.7, -6.2, 25.8, -4.2, 24.7, -.8); });
      const g = (time * .5) % 1;
      E(25, -.3 + g * .2, .22 + g * .1, .3, t('#cfe3ea'));
      faded(.5, () => E(26, -.05, 2.2, .16, t('#9fb8c4')));
    } },

    /* Q4 — 비바람에 바랜 나무 울타리. 내가 긁어 간 자리는 하얀 줄무늬로 남았고, 씹은 종이 반죽 한 덩이 */
    'wasp:woodFence': { w: 28, h: 30, d: (time, t) => {
      const Wd = planes(t, '#a89a8c');
      const rail = [[-14, -12], [14, -11.4], [14, -14.4], [-14, -15]];
      slab(Wd.dark, rail); slab(Wd.mid, [[-14, -15], [14, -14.4], [14, -13.8], [-14, -14.4]]);                   // 뒤로 지나가는 가로대
      [[-11, 0], [-2.4, 1], [6.2, 2]].forEach(([x, i]) => {
        const wd = 6.6, board = [[x, 0], [x - .2, -36], [x + wd + .2, -36], [x + wd, 0]];
        slab(Wd.mid, board);
        inside(board, () => {
          slab(Wd.lit, [[x - 1, 1], [x - 1, -37], [x + wd * .32, -37], [x + wd * .26, 1]]);                   // 볕 받는 왼쪽 결
          slab(Wd.dark, [[x + wd * .82, 1], [x + wd * .86, -37], [x + wd + 1, -37], [x + wd + 1, 1]]);
          curve(Wd.dark, .12, (c) => { c.moveTo(x + wd * .55, 0); c.bezierCurveTo(x + wd * .4, -10, x + wd * .7, -20, x + wd * .5, -36); });   // 나뭇결 한 줄
          if (i === 1) {
            for (let k = 0; k < 4; k++) {                                                                        // 턱으로 긁은 하얀 줄 자국
              const y = -5.2 - k * 1.1;
              slab(t('#efe6d6'), [[x + 1.2, y], [x + 1.4 + k * .3, y - .4, x + 4.8, y - .25], [x + 4.9, y + .1], [x + 2.8, y + .15, x + 1.2, y + .3]]);
            }
          }
        });
        faded(.35, () => slab(Wd.deep, [[x, 0], [x + wd, 0], [x + wd, -.5], [x, -.7]]));                      // 땅에 닿은 물 자국
      });
      const P0 = planes(t, NEST_G);                                                                              // 씹다 만 종이 반죽
      const ball = [[-3.4, -8.2], [-3.6, -9.2, -2.4, -9.6, -1.8, -8.9], [-1.4, -8.2, -2, -7.6, -2.8, -7.7], [-3.4, -7.8, -3.4, -8.2]];
      slab(P0.mid, ball); inside(ball, () => slab(P0.lit, [[-4, -10], [-1.5, -10], [-2.4, -8.6, -4, -8.2]]));
    } },

    /* Q5·Q6 — 실외기 받침 밑에 매단 첫 둥지(7cm). 겹겹이 붙인 종이 띠, 아래 구멍으로 방과 애벌레가 보인다 */
    'wasp:primaryNest': { w: 18, h: 18, d: (time, t) => {
      const S = planes(t, STEEL), U = planes(t, '#e9e5d9');
      slab(U.mid, [[-9.4, -17], [-9.4, -30], [10, -30], [10, -17]]);                                             // 실외기 밑바닥
      slab(U.lit, [[-9.4, -17], [-9.4, -30], [-7, -30], [-7, -17]]);
      slab(U.dark, [[-9.4, -17], [10, -17], [10, -17.8], [-9.4, -17.8]]);
      slab(S.mid, [[-8.6, 0], [-8.6, -15], [-7.4, -15], [-7.4, 0]]); slab(S.lit, [[-8.6, 0], [-8.6, -15], [-8.2, -15], [-8.2, 0]]);   // 받침 다리
      slab(S.dark, [[-9.4, 0], [-9.4, -.5], [-6.6, -.5], [-6.6, 0]]);
      slab(S.mid, [[-9, -15], [9, -15], [9, -16.4], [-9, -16.4]]); slab(S.lit, [[-9, -16.4], [9, -16.4], [8.4, -17], [-8.4, -17]]);
      slab(S.dark, [[-9, -15], [9, -15], [9, -15.3], [-9, -15.3]]);
      slab(t(NEST_B), [[-.4, -15], [-.3, -14.2], [.3, -14.2], [.4, -15]]);                                      // 받침에 붙인 꼭지
      const shell = [[0, -14.4], [3, -14.5, 3.9, -11.4, 3.5, -9.4], [3.1, -7.6, 1.8, -6.9, 1.4, -6.9], [-1.4, -6.9], [-1.8, -6.9, -3.1, -7.6, -3.5, -9.4], [-3.9, -11.4, -3, -14.5, 0, -14.4]];
      paperBands(shell, -3.9, 3.9, -14.6, -6.8, 6, t, 51);
      E(0, -7, 1.55, .55, t('#4a3830'));                                                                        // 아래 구멍
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, -7, 1.45, .48, 0, 0, TAU); ctx.clip();
      [[-.75, -7], [0, -7.15], [.75, -7]].forEach(([x, y], i) => { cell(x, y, .42, t('#c9b08a')); larva(x, y + .02, .24, time, t, i); });
      ctx.restore();
    } },

    /* Q5·D5 — 둥지를 노리는 낯선 여왕. 같은 종인데 눈매가 매섭다 */
    'wasp:rivalQueen': { w: 4.5, h: 3.4, d: (time, t) => hoverWasp(time + 1.7, t, { k: 1.05, stern: true, noBlush: true, seed: 3, h: 1.6 }) },

    /* Q6·Q7 — 첫째 딸 콩이. 혼자 먹여 키워서 엄마보다 한참 작다 */
    'wasp:kongi': { w: 3, h: 2.6, d: (time, t) => hoverWasp(time + .6, t, { k: .7, eyeK: 1.25, seed: 5, h: 1.2 }) },

    /* K1 — 거실 베란다 방충망 문 아래쪽. 문틀과 망 사이가 한 뼘 벌어져 바깥 볕이 든다 */
    'wasp:screenGap': { w: 30, h: 34, d: (time, t) => {
      const A = planes(t, '#d4d0dc');
      slab(t('#f6f1e2'), [[8.4, -1.4], [8.4, -40], [11.6, -40], [11.6, -1.4]]);                              // 벌어진 틈 너머 바깥 볕
      faded(.7, () => slab(t('#93c28a'), [[8.4, -1.4], [8.4, -6], [9.6, -5.4, 11.6, -7], [11.6, -1.4]]));     // 베란다 화분 잎 끝
      const mesh = [[-14, -1.6], [-14, -40], [7.4, -40], [7.4, -1.6]];
      faded(.18, () => slab(t('#8e8a9e'), mesh));
      inside(mesh, () => faded(.22, () => curve(t('#5a5668'), .05, (c) => {
        for (let x = -14; x <= 7.4; x += .4) { c.moveTo(x, -40); c.lineTo(x, -1.6); }
        for (let y = -40; y <= -1.6; y += .4) { c.moveTo(-14, y); c.lineTo(7.4, y); }
      })));
      slab(A.mid, [[6.4, -1.6], [6.4, -40], [8.2, -40], [8.2, -1.6]]);                                       // 방충망 문 세로틀
      slab(A.lit, [[6.4, -1.6], [6.4, -40], [7, -40], [7, -1.6]]);
      slab(A.dark, [[11.8, -1.4], [11.8, -40], [14.6, -40], [14.6, -1.4]]);                                  // 문틀 (그늘)
      slab(A.mid, [[-15, 0], [15, 0], [15, -1.6], [-15, -1.6]]);                                              // 바닥 레일
      slab(A.lit, [[-15, -1.6], [15, -1.6], [14.4, -2.1], [-14.4, -2.1]]);
      faded(.25, () => slab(t('#fff4d6'), [[8.4, -1.4], [11.6, -1.4], [16, 0], [10, 0]]));                    // 바닥에 떨어진 바깥 빛
    } },

    /* Q7 — 비 오는 느티나무 가지 끝. 콩이가 처음 씹어 붙인 새 둥지가 공만 하게 매달렸다 */
    'wasp:branchNest': { w: 24, h: 22, d: (time, t) => {
      const sway = Math.sin(time * .8) * .015;
      ctx.save(); ctx.translate(0, 8); ctx.rotate(sway);
      twig([[16, -30], [9, -24, 2, -22], [-5, -20, -11, -16]], .9, t);
      [[-11, -16, 1.9], [-6, -19.6, 2.3], [7, -24, 1.4], [11, -27, 2.0]].forEach(([x, y, a], i) => placed(x, y, 1, a + Math.sin(time + i) * .04, () => leaf(5.4, i % 2 ? '#7fb87a' : LEAF_C, t, 9)));
      slab(t(NEST_B), [[1.6, -22.2], [1.8, -21], [2.6, -21], [2.8, -22.2]]);
      const ball = [[2.2, -21.4], [5.4, -21.4, 5.6, -16.6, 4.6, -15.4], [3.6, -14.2, .8, -14.2, -.2, -15.4], [-1.2, -16.6, -1, -21.4, 2.2, -21.4]];
      paperBands(ball, -1.2, 5.6, -21.6, -14.2, 5, t, 71);
      E(4.4, -16.4, .5, .42, t('#3f2f2a'));                                                                    // 옆 입구
      [[-9, -14.6], [-3, -17.6], [9.2, -25]].forEach(([x, y], i) => {                                         // 잎 끝 빗방울
        const ph = (time * .6 + i * .37) % 1;
        E(x, y + ph * 1.2, .24 + ph * .08, .3 + ph * .12, t('#d8f0ff')); E(x - .08, y + ph * 1.2 - .1, .07, .09, WHITE);
      });
      ctx.restore();
    } },

    /* Q8 — 공원 구석 도시양봉장 벌통. 입구 착륙판에 꿀벌들이 드나든다 */
    'wasp:beehive': { w: 30, h: 30, d: (time, t) => {
      const Wd = planes(t, '#c9a77a'), Bx = planes(t, '#f1e4bd');
      [-11, 8].forEach((x) => { slab(Wd.mid, [[x, 0], [x, -7.4], [x + 2.2, -7.4], [x + 2.2, 0]]); slab(Wd.lit, [[x, 0], [x, -7.4], [x + .7, -7.4], [x + .7, 0]]); });   // 받침대 다리
      slab(Wd.mid, [[-12.6, -7.4], [12.6, -7.4], [12.6, -9.2], [-12.6, -9.2]]); slab(Wd.lit, [[-12.6, -9.2], [12.6, -9.2], [14.4, -10.4], [-10.8, -10.4]]);   // 받침대 윗판
      slab(Wd.dark, [[12.6, -7.4], [14.4, -8.6], [14.4, -10.4], [12.6, -9.2]]);
      const box = [[-10.2, -10.4], [-10.4, -48], [10.4, -48], [10.2, -10.4]];
      slab(Bx.mid, box);
      inside(box, () => slab(Bx.lit, [[-11, -9], [-11, -49], [-6.6, -49], [-6.8, -9]]));
      slab(Bx.dark, [[10.2, -10.4], [10.4, -48], [13.6, -50], [13.4, -12.2]]);                                // 옆면
      slab(Bx.dark, [[-10.2, -24], [10.2, -24], [10.2, -24.6], [-10.2, -24.6]]);                              // 상자 이음매 한 줄
      slab(Bx.deep, [[11.2, -18.4], [11.6, -19.8, 12.6, -20.2], [12.6, -18.6], [12, -18, 11.2, -18.4]]);       // 옆 손잡이 홈
      slab(t('#3a2c2a'), [[-6.4, -10.4], [-6.4, -11.6], [5, -11.6], [5, -10.4]]);                              // 벌통 입구
      slab(Wd.lit, [[-9, -10.4], [7, -10.4], [7.6, -9.4], [-9.6, -9.4]]);                                     // 착륙판
      [[-4.6, -10.6, 0], [-1, -10.6, 1], [2.8, -10.7, 2]].forEach(([x, y, i]) => honeybee(x, y, time, t, i, false));
      [[-8.4, -15], [-3, -18.5], [4, -14.6], [8.4, -19]].forEach(([x, y], i) => honeybee(x, y, time, t, i + 3, true));
    } },

    /* Q8·D8 — 말벌 잡는 페트병 포획기. 노란 깔때기 입구, 바닥엔 달큰한 호박색 미끼 */
    'wasp:beeTrap': { w: 10, h: 30, d: (time, t) => {
      const sw = Math.sin(time * 1.1) * .05;
      ctx.save(); ctx.translate(0, -30); ctx.rotate(sw); ctx.translate(0, 30);
      curve(t('#e9e2d0'), .08, (c) => { c.moveTo(0, -32); c.lineTo(0, -21.4); });
      const Cp = planes(t, '#5fa39a'), Fn = planes(t, '#ffd56b'), G = planes(t, '#dcefe9');
      slab(Cp.mid, [[-.9, -21.6], [-.9, -20.4], [.9, -20.4], [.9, -21.6]]); slab(Cp.lit, [[-.9, -21.6], [-.9, -20.4], [-.4, -20.4], [-.4, -21.6]]);
      const bottle = [[-.8, -20.4], [-.9, -18.8, -3.2, -18, -3.3, -15.6], [-3.4, -4.6], [-3.4, -3, -2.6, -2.6, -1.6, -2.7], [0, -3.1], [1.6, -2.7], [2.6, -2.6, 3.4, -3, 3.4, -4.6], [3.3, -15.6], [3.2, -18, .9, -18.8, .8, -20.4]];
      faded(.42, () => slab(G.mid, bottle));
      inside(bottle, () => {
        faded(.85, () => slab(t(HONEY), [[-4, -7.8], [-1.5, -8.2, 1.5, -7.6, 4, -8], [4, 0], [-4, 0]]));   // 미끼 단물
        faded(.5, () => slab(t(mix(HONEY, '#fff4d6', .5)), [[-4, -7.8], [-1.5, -8.2, 1.5, -7.6, 4, -8], [4, -7.3], [-4, -7.2]]));
        [[-1.6, -5.6, .3], [1.2, -4.4, -.5], [.1, -6.6, .9]].forEach(([x, y, a]) => placed(x, y, .32, a, () => { E(0, 0, 1.4, .5, t(DARK)); E(-.2, 0, .25, .5, t(BAND)); }));   // 갇힌 말벌들
        faded(.45, () => slab(G.dark, [[1.8, -18], [3.6, -16], [3.6, -3], [2.2, -3]]));
      });
      faded(.6, () => slab(WHITE, [[-2.6, -15.4], [-2, -15.4], [-2.3, -5], [-2.8, -5]]));
      const funnel = [[-3.3, -12.6], [-5.6, -14.2], [-5.6, -10.4], [-3.3, -11.6]];                            // 옆 깔때기 입구
      slab(Fn.mid, funnel); slab(Fn.lit, [[-3.3, -12.6], [-5.6, -14.2], [-5.6, -13.4], [-3.3, -12.2]]);
      E(-5.6, -12.3, .3, 1.9, Fn.dark);
      ctx.restore();
      for (let i = 0; i < 3; i++) {                                                                             // 단내 줄기 (제자리에서 일렁)
        const ph = (time * .4 + i / 3) % 1;
        faded(Math.sin(ph * Math.PI) * .45, () => curve(t('#ffe2a0'), .14, (c) => {
          const x = -6.6 - i * .9, y = -12 - ph * 3;
          c.moveTo(x, y + 1.6); c.bezierCurveTo(x - .6, y + .8, x + .6, y + .2, x, y - .8);
        }));
      }
    } },

    /* Q9·D9 — 파라솔 탁자 밑에 쓰러진 음료수 캔. 입구에서 단물이 흘러 고였고, 그 안에 콩이가 있다 */
    'wasp:sodaCan': { w: 15, h: 8, d: (time, t) => {
      const Cn = planes(t, '#e6765f'), M = planes(t, '#d4d0dc');
      faded(.55, () => slab(t('#c98a3a'), [[-9.4, .05], [-8.4, -.5, -5.6, -.45, -4, -.2], [-3, .1], [-6, .5, -9, .4, -9.4, .05]]));   // 고인 단물
      glint(-7, -.15, .35, .3 + Math.sin(time * 2.4) * .3);
      const body = [[-5.4, -.1], [-5.4, -6.7], [5.6, -6.7], [6.6, -6.4, 6.9, -.4, 5.6, -.1]];
      slab(Cn.mid, body);
      inside(body, () => {
        slab(Cn.lit, [[-6, -7], [7, -7], [7, -5.3], [-6, -5.5]]);                                             // 볕 받는 윗면
        slab(Cn.dark, [[-6, -1.5], [7, -1.4], [7, .5], [-6, .5]]);
        slab(t('#fbf3e2'), [[-6, -3.6], [-2, -5, 2, -2.2, 7, -3.8], [7, -3], [2, -1.4, -2, -4.2, -6, -2.8]]);   // 크림색 물결 띠
      });
      slab(M.mid, [[-5.4, -.1], [-6.7, -1, -6.7, -5.8, -5.4, -6.7], [-4.9, -6.7], [-6.1, -5.8, -6.1, -1, -4.9, -.1]]);   // 열린 쪽 은색 테
      shape(M.lit, (c) => c.ellipse(-5.6, -3.4, 1.05, 3.2, 0, 0, TAU));
      shape(M.dark, (c) => c.ellipse(-5.5, -3.4, .8, 2.85, 0, 0, TAU));
      shape(t('#3a2c30'), (c) => c.ellipse(-5.6, -1.8, .5, .95, 0, 0, TAU));                                  // 마시는 구멍
      placed(-6.2, -1.9, .42, -.35 + Math.sin(time * 2) * .05, () => {                                        // 구멍에서 내민 콩이 얼굴
        const F = planes(t, FACE);
        curve(t(DARK), .12, (c) => { c.moveTo(-.1, -.5); c.quadraticCurveTo(-.4, -1.3, -.9, -1.4 + Math.sin(time * 6) * .1); });
        E(0, 0, .55, .52, F.mid); slab(t(DARK), [[-.5, -.2], [-.2, -.6, .4, -.55, .5, -.2], [0, -.35]]);
        cuteEye(-.2, -.05, .17, .22, time + 4, t); blush(-.35, .25, .12, .07);
      });
      slab(M.mid, [[-4.4, -6.75], [-3.8, -7.5], [-2.6, -7.3], [-3.2, -6.7]]);                                 // 따개
    } },

    /* Q9 — 바닥에 떨어져 녹아 흐르는 아이스크림과 나무 막대 */
    'wasp:iceDrip': { w: 14, h: 3, d: (time, t) => {
      const V = planes(t, '#fbf0d6'), Ch = planes(t, '#7a4e3a'), St = planes(t, '#e2c08a');
      const pool = [[-6.6, 0], [-6.8, -.5, -4, -.7, -2.2, -.55], [-.5, -.8, 3.4, -.7, 5.6, -.35], [6.8, -.1, 6.6, .1, 5.6, .15], [0, .3, -6, .2, -6.6, 0]];
      slab(V.mid, pool); inside(pool, () => slab(V.lit, [[-7, -1], [6, -1], [5, -.42], [-2, -.5, -7, -.2]]));
      const chunk = [[-2.6, -.4], [-2.8, -1.6, -1, -2.2, .6, -1.9], [1.8, -1.6, 2, -.6, 1.4, -.4]];             // 남은 초콜릿 덩어리
      slab(Ch.mid, chunk); inside(chunk, () => slab(Ch.lit, [[-3, -2.4], [1, -2.4], [-1, -1.4, -3, -1]]));
      slab(St.mid, [[1, -.7], [6.4, -1.3], [6.5, -.8], [1.1, -.3]]); slab(St.lit, [[1, -.7], [6.4, -1.3], [6.42, -1.1], [1.02, -.55]]);   // 나무 막대
      glint(-4.4, -.5, .4, .3 + Math.sin(time * 2) * .3);
      const g = (time * .4) % 1;
      E(-.4, -1.9 + g * 1.1, .18, .24 + g * .1, V.lit);                                                       // 덩어리에서 떨어지는 한 방울
    } },

    /* Q10·Q11 — 느티나무에 매단 큰 둥지(수박만 함). 물결진 종이 띠 수십 겹, 옆구리 입구로 일벌이 드나든다 */
    'wasp:bigNest': { w: 22, h: 34, d: (time, t) => {
      ctx.save(); ctx.translate(0, -3.8);
      twig([[-14, -29.4], [-4, -27.6, 4, -28.4], [10, -29, 15, -31]], 1.4, t);
      placed(-11, -29.4, 1, 2.1, () => leaf(5.4, LEAF_C, t, 9)); placed(9, -29.4, 1, 1.1, () => leaf(4.6, '#88b27a', t, 8));
      const shell = [[0, -28.4], [5, -28.6, 9.2, -24, 9.4, -16], [9.6, -8, 6, -2.4, 0, -2.2], [-6, -2.4, -9.6, -8, -9.4, -16], [-9.2, -24, -5, -28.6, 0, -28.4]];
      paperBands(shell, -9.6, 9.6, -28.6, -2.2, 13, t, 91);
      E(5.6, -8.4, 1.1, .95, t('#3f2f2a'));                                                                   // 옆 입구
      placed(5.4, -8.6, .55, 0, () => {                                                                        // 입구 문지기 얼굴
        E(0, 0, .55, .5, t(FACE)); slab(t(DARK), [[-.55, -.1], [-.3, -.6, .4, -.55, .55, -.1], [0, -.3]]); cuteEye(.15, -.05, .16, .2, time + 9, t);
      });
      [[10.6, -11, 0], [12, -6, 1]].forEach(([x, y, i]) => placed(x + Math.sin(time * 1.4 + i * 2) * .5, y, 1, 0, () => hoverWasp(time + i, t, { k: .62, seed: i * 2, h: 0 })));
      ctx.restore();
    } },

    /* Q10·D10 — 119 대원의 하얀 방호복과 장화. 말벌 눈높이에선 정강이까지만 보인다. 옆에 벌집 떼는 긴 장대 */
    'wasp:beeSuit': { w: 26, h: 40, d: (time, t) => {
      const S = planes(t, '#f1f0ea'), B = planes(t, '#3a3445'), R = planes(t, '#d8e85c'), P = planes(t, '#c9c4cc');
      const shift = Math.sin(time * .9) * .4;
      slab(P.mid, [[9.4, -1], [10.4 + shift, -62], [11.6 + shift, -62], [10.8, -1]]);                         // 장대
      slab(P.lit, [[9.4, -1], [10.4 + shift, -62], [10.8 + shift, -62], [9.9, -1]]);
      [[-7.6, 0], [1.4, 1]].forEach(([x, i]) => {
        ctx.save(); ctx.translate(x + 3, 0); ctx.rotate(i ? -.02 : .03 + shift * .01); ctx.translate(-x - 3, 0);
        const leg = [[x - .4, -14], [x - 1.2, -30, x - .6, -50, x - .8, -62], [x + 8.2, -62], [x + 8.4, -48, x + 8.8, -30, x + 7.6, -14]];
        slab(S.mid, leg);
        inside(leg, () => {
          slab(S.lit, [[x - 2, -10], [x - 2, -64], [x + 2.2, -64], [x + 1.6, -10]]);                           // 볕 받는 바짓단
          slab(S.dark, [[x + 6, -10], [x + 6.4, -64], [x + 10, -64], [x + 10, -10]]);
          curve(S.dark, .25, (c) => { c.moveTo(x + 1, -18); c.quadraticCurveTo(x + 3.5, -16.4, x + 6.6, -18.2); c.moveTo(x + .6, -34); c.quadraticCurveTo(x + 4, -32.4, x + 7, -34.6); });   // 주름 두 줄
          slab(R.mid, [[x - 2, -24], [x + 10, -24.4], [x + 10, -26], [x - 2, -25.6]]);                        // 반사띠
        });
        const bootShape = [[x - 4.2, 0], [x - 4.6, -2.6, x - 2.4, -3.6, x - .6, -4], [x - .6, -15], [x + 7.6, -15], [x + 7.8, -6, x + 8.4, -2, x + 8.2, 0]];
        slab(B.mid, bootShape);
        inside(bootShape, () => { slab(B.lit, [[x - 5, -2.4], [x - 2.4, -4.4], [x + 1.2, -4.6], [x + 1.2, -16], [x - 5, -16]]); slab(B.dark, [[x - 5, 0], [x - 5, -.9], [x + 9, -.9], [x + 9, 0]]); });
        slab(S.mid, [[x - 1.2, -14], [x + 8, -14.2], [x + 8.2, -16.2], [x - 1.4, -16]]);                       // 장화 위로 덮인 바짓단
        ctx.restore();
      });
    } },

    /* Q6·D6 — 위층 창문에서 내민 손과 살충 스프레이. 옆으로 뿜는 노즐에서 하얀 안개가 제자리에서 부풀었다 가라앉는다 */
    'wasp:sprayHand': { w: 22, h: 24, d: (time, t) => {
      const Cn = planes(t, '#e6a33a'), Cap = planes(t, '#f4f1ea'), Sl = planes(t, '#7d8fa6');
      const tilt = -.3 + Math.sin(time * 1.6) * .03;
      ctx.save(); ctx.translate(2, -7.4); ctx.rotate(tilt); ctx.scale(.85, .85);
      const arm = [[7, -2.8], [14, -3.6, 20, -8, 24, -20], [30, -16], [26, -6, 18, 3.6, 7, 3.2]];             // 팔 (소매)
      slab(Sl.mid, arm); inside(arm, () => slab(Sl.lit, [[6, -4], [14, -4.6, 20, -9, 24, -22], [26, -22], [20, -6, 14, -2, 6, -1.6]]));
      const can = [[-3, 6], [-3.1, -6.4], [-3, -8, -1.6, -8.8, 0, -8.8], [1.6, -8.8, 3, -8, 3.1, -6.4], [3, 6]];
      slab(Cn.mid, can);
      inside(can, () => {
        slab(Cn.lit, [[-4, 7], [-4, -10], [-1.6, -10], [-1.8, 7]]);
        slab(Cn.dark, [[1.8, 7], [1.9, -10], [4, -10], [4, 7]]);
        slab(t('#5fa39a'), [[-4, -2.6], [4, -3.4], [4, -1.6], [-4, -.8]]);                                     // 초록 띠 하나
      });
      slab(Cap.mid, [[-1.4, -8.6], [-1.5, -10.6], [-.4, -11.4], [1.2, -11.2], [1.5, -8.6]]);                   // 누르는 꼭지
      slab(Cap.lit, [[-1.4, -8.6], [-1.5, -10.6], [-.4, -11.4], [-.6, -8.6]]);
      E(-1.5, -10.1, .2, .2, t(INK));                                                                          // 옆으로 난 노즐 구멍
      artHandAt(t, 0, 0, Math.PI, 13, { pose: 'grip' });
      ctx.restore();
      const puffs = [];
      for (let i = 0; i < 9; i++) { const u = i / 8; puffs.push([-1.2 - u * 14, -11.4 + u * 4 + hash(i, 61) * 1.2, .8 + u * 2.4]); }
      const k0 = (j) => 1 + Math.sin(time * 3 + j * 1.3) * .08;
      faded(.42, () => shape(t('#f6f8ff'), (c) => puffs.forEach(([x, y, r], j) => { c.moveTo(x + r * k0(j), y); c.ellipse(x, y, r * k0(j), r * .7 * k0(j), 0, 0, TAU); })));
      faded(.3, () => shape(WHITE, (c) => puffs.forEach(([x, y, r], j) => { c.moveTo(x + r * .6, y - r * .2); c.ellipse(x - r * .1, y - r * .2, r * .6, r * .4, 0, 0, TAU); })));
    } },

    /* Q11 — 둥지를 떠나는 새 여왕들. 엄마만 한 딸들이 볕 속으로 날아오른다 */
    'wasp:newQueens': { w: 16, h: 12, d: (time, t) => {
      [[-5, -2.4, -.25], [.6, -7.6, -.4], [5.4, -3.6, -.15], [8, -9.6, -.5]].forEach(([x, y, a], i) => {
        placed(x, y, 1, a, () => hoverWasp(time + i * .9, t, { k: .95, seed: i * 1.3, h: 0 }));
      });
    } },
  };

  /** 벚꽃 한 송이: 끝이 갈라진 꽃잎 다섯, 분홍 두 톤, 가운데 꽃술 */
  function blossom(t) {
    const P0 = planes(t, '#f6bccb');
    for (let k = 0; k < 5; k++) placed(0, 0, 1, k * TAU / 5, () => {
      const pet = [[0, 0], [-.5, -.4, -.55, -1.05, -.2, -1.15], [0, -1.02], [.2, -1.15], [.55, -1.05, .5, -.4, 0, 0]];
      slab(k < 2 ? P0.lit : P0.mid, pet);
    });
    E(0, 0, .3, .3, t('#e0607a'));
    for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; E(Math.cos(a) * .42, Math.sin(a) * .42, .07, .07, t('#ffd56b')); }
  }

  /** 떨어지는 꽃잎 한 장 */
  function petal(t) { slab(t('#f9cdd8'), [[0, 0], [-.5, -.4, -.55, -1.05, -.2, -1.15], [0, -1.02], [.2, -1.15], [.55, -1.05, .5, -.4, 0, 0]]); }

  return { art, hero };
})());
