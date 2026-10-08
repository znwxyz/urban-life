/* 모기 장면 전용 그림과 주인공. 키는 'mosquito:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   모기 눈높이(화면 폭 약 36cm)에 맞춰 실제 크기로 그린다: 장구벌레 0.6cm, 알 뗏목 0.4cm, 손 18cm, 빗방울 0.4cm.
   Node에서는 키 목록만 내보낸다 (ANIMALS·ctx는 브라우저에만 있다) */
(function register(art, hero) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else { Object.assign(ACTORS, art); ANIMALS.mosquito = hero; }
})(...(() => {
  const BODY = '#a5805c', BODY_DK = '#6e5240', STRIPE = '#f1e3c6', WING = '#eaf4ff';
  const WATER = '#9fcbe0', WATER_DK = '#5f8fa8', SKIN_SH = '#e2ab88', SKIN_HI = '#fbe0c8', NAIL = '#fde9e2';
  const LEAF = '#6fa86a', LEAF_DK = '#4f8a55', RUBBER = '#34303a', SMOKE = '#eeeae4';

  /** 투명도를 잠깐 바꿔 그린다 */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, alpha)); draw(); ctx.restore(); }
  /** 경로를 만들어 채운다 */
  function fillPath(c, build) { ctx.fillStyle = c; ctx.beginPath(); build(); ctx.fill(); }
  /** 경로를 만들어 둥근 끝으로 긋는다 */
  function strokePath(c, w, build) {
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(); ctx.stroke(); ctx.restore();
  }
  /** cm 점 목록으로 경로를 만든다 (y는 아래가 +). 점 형식은 forms.js와 같다: [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
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
  /** 외곽(pts) 안에만 draw()가 칠해진다. 빛·그늘 면이 실루엣 밖으로 삐져나오지 않게 */
  function inside(pts, draw) { ctx.save(); trace(pts); ctx.clip(); draw(); ctx.restore(); }
  /** 원 안에만 draw()가 칠해진다 */
  function inDisc(x, y, r, draw) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); draw(); ctx.restore(); }
  /** 둥근 물건(바퀴·원통 끝)을 원 하나로 오리고 왼쪽 위 테만 밝게 남긴다 */
  function litDisc(x, y, r, p) { E(x, y, r, r, p.lit); inDisc(x, y, r, () => E(x + r * .09, y + r * .09, r * .97, r * .97, p.mid)); }
  /** 세워진 원통: 가운데 톤 몸통, 왼쪽 볕 띠, 오른쪽 그늘 띠 (x0~x1 폭, y0~y1 높이) */
  function upright(x0, x1, y0, y1, p, r = 0) {
    const w = x1 - x0;
    RR(x0, y0, w, y1 - y0, r, p.mid);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w, y1 - y0, r); ctx.clip();
    R(x0, y0, w * .22, y1 - y0, p.lit); R(x0 + w * .7, y0, w * .3, y1 - y0, p.dark);
    ctx.restore();
  }

  /** 변환을 잠깐 걸고 그린다 */
  function at(x, y, rot, sx, sy, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, sy); draw(); ctx.restore(); }

  /** 위로 피어오르는 연기·김 줄기 */
  function wisps(xs, y0, hgt, time, color, alpha = .45) {
    faded(alpha, () => xs.forEach((x, i) => strokePath(color, Math.max(.04, hgt * .03), () => {
      for (let k = 0; k <= 14; k++) {
        const yy = y0 - k / 14 * hgt, xx = x + Math.sin(k * .8 + time * 2 + i * 2) * hgt * .07 * (k / 14 + .3);
        if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
    })));
  }
  /** 반짝이는 십자 빛 */
  function glint(x, y, r, alpha) {
    faded(alpha, () => { L(x - r, y, x + r, y, WHITE, r * .25); L(x, y - r, x, y + r, WHITE, r * .25); });
  }
  /** 떨어지는 물방울 (아래가 둥근 눈물 모양) */
  function drop(x, y, r, color) {
    fillPath(color, () => { ctx.moveTo(x, y - r * 2.6); ctx.quadraticCurveTo(x + r * 1.1, y - r * .6, x, y + r); ctx.quadraticCurveTo(x - r * 1.1, y - r * .6, x, y - r * 2.6); });
    E(x - r * .3, y - r * .1, r * .22, r * .38, WHITE);
  }
  /** 물 위로 번지는 동심원 */
  function ripples(x, y, r, time, color, n = 2) {
    for (let i = 0; i < n; i++) {
      const ph = (time * .5 + i / n) % 1;
      faded(.7 * (1 - ph), () => strokePath(color, r * .05, () => ctx.ellipse(x, y, r * (.2 + ph), r * (.2 + ph) * .25, 0, 0, TAU)));
    }
  }

  /** 모기 한 마리. 원점 = 가슴 가운데. o: { male 수컷(깃털 더듬이), fed 피로 부푼 배, flap 날갯짓(-1~1) } */
  function drawMosquito(time, t, o = {}) {
    const flap = o.flap ?? Math.sin(time * 40), ink = t(INK);
    [[.06, .05, .22, .2, .34, .44], [.01, .06, -.02, .26, -.1, .46], [-.04, .05, -.26, .2, -.5, .3]].forEach(([x0, y0, x1, y1, x2, y2], i) => {
      const sw = Math.sin(time * 2 + i) * .02;
      strokePath(ink, .016, () => { ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y1 - .04, x1, y1); ctx.lineTo(x2 + sw, y2); if (i === 2) ctx.lineTo(x2 - .12, y2 - .14); });
    });
    at(-.02, -.07, -.35 - flap * .45, 1, 1, () => faded(.55, () => {
      E(-.3, 0, .32, .075, WING); strokePath(t('#b9c7da'), .012, () => { ctx.moveTo(-.02, 0); ctx.lineTo(-.58, -.01); });
    }));
    const swell = o.fed ? 1.35 : 1;
    at(-.1, .01, .12, 1, swell, () => {
      fillPath(t(BODY), () => { ctx.moveTo(0, -.07); ctx.bezierCurveTo(-.2, -.11, -.46, -.07, -.52, 0); ctx.bezierCurveTo(-.46, .07, -.2, .1, 0, .07); ctx.closePath(); });
      if (o.fed) faded(.55, () => E(-.25, .01, .2, .055, t('#d63a3a')));
      [-.1, -.2, -.3, -.4].forEach((x) => strokePath(t(STRIPE), .025, () => { ctx.moveTo(x, -.075); ctx.quadraticCurveTo(x - .03, 0, x, .07); }));
    });
    at(-.02, -.07, -.35 - flap * .45 + .3, 1, 1, () => faded(.7, () => E(-.27, -.02, .3, .07, WHITE)));
    E(0, -.02, .13, .11, t(BODY_DK)); faded(.5, () => E(-.03, -.08, .07, .03, t(STRIPE)));
    E(.16, -.02, .1, .095, t(BODY));
    cuteEye(.18, -.035, .066, .072, time, t);
    blush(.2, .03, .03, .018);
    strokePath(ink, .018, () => { ctx.moveTo(.22, .01); ctx.quadraticCurveTo(.4, .05, .5, .17); });
    strokePath(t(BODY_DK), .014, () => { ctx.moveTo(.21, .0); ctx.lineTo(.28, .05); });
    const ant = o.male ? 6 : 2;
    for (let i = 0; i < ant; i++) {
      const a = -.9 - i * .12 + Math.sin(time * 3 + i) * .04;
      strokePath(ink, o.male ? .01 : .012, () => { ctx.moveTo(.2, -.08); ctx.lineTo(.2 + Math.cos(a) * .2, -.08 + Math.sin(a) * .2); });
    }
  }

  /** 짝! 치는 손 하나: 손목이 원점, 손끝이 위(-y), 손바닥이 +x 쪽(🫳을 세운 옆모습). 소맷부리가 손목에 붙는다 */
  function clapHand(t) { at(0, 0, -Math.PI / 2, 1, 1, () => artHand(t, { pose: 'flat', s: 14, sleeve: '#7a9cc6' })); }

  /** 다리 털 몇 가닥 */
  function hairs(x0, x1, y0, y1, n, salt, t) {
    for (let i = 0; i < n; i++) {
      const x = x0 + hash(i, salt) * (x1 - x0), y = y0 + hash(i, salt + 1) * (y1 - y0);
      L(x, y, x - .25, y - .45, t('#5a463c'), .05);
    }
  }

  /** 살충제 통 (모기 그림에 X 표시). 원점은 통 바닥 가운데 */
  function drawCan(t, time) {
    const G = planes(t, '#2f8f6a'), M = planes(t, '#d9dde3'), Y = planes(t, '#ffd23a');
    upright(-3, 3, -18, 0, G, .8);                                                                                  // 원통 몸통
    const dome = [[-3, -18], [-3, -20.4, 0, -20.6], [3, -20.4, 3, -18]];
    slab(M.mid, dome); inside(dome, () => { slab(M.lit, [[-3.2, -17.8], [-3.2, -21], [-.6, -21], [-1.6, -19.4, -1.4, -17.8]]); slab(M.dark, [[1.6, -17.8], [1.8, -19.4, 1.4, -21], [3.4, -21], [3.4, -17.8]]); });   // 어깨
    RR(-1.2, -22.6, 2.4, 2.2, .5, t('#f4f1ea')); R(.6, -22.6, .6, 2.2, t('#cfccc4')); RR(-.4, -22.2, 1.9, .7, .3, t(INK));   // 분사 꼭지
    R(-3, -12.6, 6, 5.6, Y.mid); R(-3, -12.6, 1.3, 5.6, Y.lit); R(1.2, -12.6, 1.8, 5.6, Y.dark); R(-3, -12.6, 6, .5, t('#e8603a'));   // 상표 띠도 원통을 따라 휘어 보이게
    at(-.1, -9.6, 0, 3.4, 3.4, () => drawMosquito(time, t, { flap: .2 }));
    L(-1.4, -11.4, 1.4, -8, t('#e8403a'), .32); L(1.4, -11.4, -1.4, -8, t('#e8403a'), .32);
  }

  const art = {
    /* M1 — 내가 빠져나온 번데기 껍질. 등이 갈라진 채 물 위에 떠 있다 */
    'mosquito:pupaSkin': { w: 1, h: .4, d: (time, t) => {
      ripples(0, 0, .5, time, t(WATER_DK));
      faded(.35, () => strokePath(t('#b89a6a'), .08, () => { ctx.moveTo(-.05, .02); ctx.quadraticCurveTo(-.32, .12, -.22, .28); ctx.quadraticCurveTo(-.15, .34, -.1, .3); }));
      const bob = Math.sin(time * 1.6) * .015;
      fillPath(t('#c9a86a'), () => { ctx.moveTo(-.22, bob); ctx.bezierCurveTo(-.28, -.24 + bob, .12, -.32 + bob, .22, -.1 + bob); ctx.quadraticCurveTo(.25, bob, .1, bob); ctx.closePath(); });
      faded(.5, () => E(-.04, -.2 + bob, .12, .04, WHITE));
      strokePath(t('#6b4a2a'), .025, () => { ctx.moveTo(-.14, -.18 + bob); ctx.quadraticCurveTo(0, -.26 + bob, .12, -.18 + bob); });
      [[-.02, -.26], [.06, -.25]].forEach(([x, y]) => strokePath(t('#8a6a44'), .02, () => { ctx.moveTo(x, y + bob); ctx.lineTo(x - .05, y - .07 + bob); }));
    } },

    /* M1 — 주차장 웅덩이 단면. 기름 무지개가 뜬 수면에 장구벌레가 거꾸로 매달려 꼬물댄다 */
    'mosquito:puddleLarvae': { w: 12, h: 1, d: (time, t) => {
      const Wt = planes(t, WATER), pool = [[-6, 0], [-4, 1.6, 4, 1.7, 6, 0]];
      faded(.75, () => { slab(Wt.mid, pool); inside(pool, () => slab(Wt.dark, [[-6, .5], [-2, 1.1, 2, 1.2, 6, .5], [6, 2], [-6, 2]])); });   // 물속은 아래로 갈수록 어둡게
      for (let i = 0; i < 6; i++) {
        const x = -4.4 + i * 1.7 + hash(i, 3) * .5, wig = Math.sin(time * 4 + i * 1.9);
        at(x, .02, .35 + wig * .25, 1, 1, () => {
          strokePath(t('#6b5a46'), .03, () => { ctx.moveTo(0, 0); ctx.lineTo(.04, .12); });
          strokePath(t('#8a7458'), .085, () => { ctx.moveTo(.04, .12); ctx.quadraticCurveTo(.1 + wig * .06, .35, .02, .55); });
          E(.02, .6, .07, .06, t('#5a4a3a'));
          [.25, .38].forEach((y) => L(-.05, y, .14, y + .02, t('#d8c8a8'), .015));
        });
      }
      [[-1.6, .05], [3, .05]].forEach(([x, y], i) => at(x, y, Math.sin(time + i) * .1, 1, 1, () => {
        E(0, .1, .14, .12, t('#4a3a2e')); strokePath(t('#4a3a2e'), .06, () => { ctx.moveTo(-.06, .18); ctx.quadraticCurveTo(-.16, .34, -.02, .4); });
      }));
      E(0, 0, 6, .14, Wt.lit); faded(.55, () => E(-1.5, -.03, 2.2, .05, WHITE));                                  // 볕 받는 수면
      ['#ff9ac2', '#ffe08a', '#8fe0d0'].forEach((c, i) => faded(.35, () => strokePath(c, .07, () => ctx.ellipse(2.4, -.02, 1.6 - i * .25, .1, 0, Math.PI, TAU))));
      ripples(-3, 0, 1, time, WHITE, 2);
    } },

    /* D1 — 웅덩이로 굴러 들어오는 자동차 바퀴. 원점은 바퀴가 땅에 닿는 곳, 물보라 벽이 왼쪽으로 솟는다 */
    'mosquito:tireSplash': { w: 72, h: 60, d: (time, t) => {
      const R0 = 30, spin = .2, T = planes(t, RUBBER), M = planes(t, '#b8bcc6');
      litDisc(0, -R0, R0, T);                                                                                       // 타이어: 왼쪽 위 테만 볕
      for (let k = 0; k < 20; k++) {                                                                                // 바깥 홈
        const a = spin + k * TAU / 20;
        at(Math.cos(a) * (R0 - .6), -R0 + Math.sin(a) * (R0 - .6), a, 1, 1, () => RR(-.9, -1.4, 1.8, 2.8, .4, T.deep));
      }
      E(0, -R0, R0 - 6.5, R0 - 6.5, T.dark);                                                                        // 옆벽 안쪽 그늘
      litDisc(0, -R0, 19, M);                                                                                       // 휠
      E(.6, -R0 + .6, 16.6, 16.6, M.dark);
      for (let k = 0; k < 5; k++) at(0, -R0, spin + k * TAU / 5, 1, 1, () => {
        slab(M.lit, [[-1.6, -3], [-2.6, -16.4], [2.6, -16.4], [1.6, -3]]);
        slab(M.mid, [[0, -3], [.2, -16.4], [2.6, -16.4], [1.6, -3]]);                                               // 살의 한쪽 면은 그늘
      });
      litDisc(0, -R0, 4, M); E(0, -R0, 1.6, 1.6, M.deep);
      const ph = (time * .9) % 1;
      faded(.6, () => fillPath(t(WATER), () => { ctx.moveTo(-6, 0); ctx.bezierCurveTo(-12, -4, -24, -26 * (.6 + ph * .4), -34, -14); ctx.quadraticCurveTo(-22, -10, -14, 0); ctx.closePath(); }));
      faded(.45, () => strokePath(WHITE, .5, () => { ctx.moveTo(-8, -1.5); ctx.bezierCurveTo(-14, -6, -22, -20, -30, -14); }));
      for (let i = 0; i < 14; i++) {
        const u = (ph + hash(i, 7)) % 1, vx = 14 + hash(i, 8) * 22, vy = 16 + hash(i, 9) * 12;
        faded(1 - u, () => drop(-6 - vx * u, -vy * u + 22 * u * u, .35 + hash(i, 10) * .4, t(WATER)));
      }
    } },

    /* M2 — 화단의 비비추 꽃대. 보라색 나팔꽃 같은 종이 줄줄이 달리고, 아래엔 넓은 줄무늬 잎 */
    'mosquito:hostaFlower': { w: 22, h: 30, d: (time, t) => {
      const sway = Math.sin(time * 1.1) * .03;
      [[-6, -.5, -.5], [5, -.3, .5], [0, 0, 0]].forEach(([x, y, lean], i) => at(x, y, lean, 1, 1, () => {
        const c = i === 2 ? LEAF : LEAF_DK;
        fillPath(t(c), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-5.5, -2, -5, -9, 0, -11); ctx.bezierCurveTo(5, -9, 5.5, -2, 0, 0); });
        fillPath(t(shade(c)), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(2, -3, 3, -8, 0, -11); ctx.bezierCurveTo(5, -9, 5.5, -2, 0, 0); });
        [-3, -1.4, 1.4, 3].forEach((dx) => faded(.5, () => strokePath(t('#cfe6b8'), .08, () => { ctx.moveTo(0, -.5); ctx.quadraticCurveTo(dx, -5, dx * .3, -10.4); })));
      }));
      at(0, 0, sway, 1, 1, () => {
        strokePath(t('#5f9a5a'), .35, () => { ctx.moveTo(0, -6); ctx.quadraticCurveTo(.6, -18, 1, -29); });
        [[-13, 1], [-15.5, -1], [-18, 1], [-20.5, -1], [-23, 1]].forEach(([y, side], i) => at(.4 + y * -.02, y, side > 0 ? .35 : Math.PI - .35, 1, side, () => {
          const len = 5.6 - i * .4, open = 1.5 - i * .15;
          fillPath(t('#a98fdc'), () => { ctx.moveTo(0, -.18); ctx.bezierCurveTo(len * .5, -.22, len * .75, -.5 * open, len, -1.1 * open); ctx.quadraticCurveTo(len * 1.12, 0, len, 1.1 * open); ctx.bezierCurveTo(len * .75, .5 * open, len * .5, .22, 0, .18); ctx.closePath(); });
          fillPath(t('#c7b4ee'), () => { ctx.moveTo(0, -.1); ctx.bezierCurveTo(len * .5, -.15, len * .8, -.4 * open, len, -1 * open); ctx.lineTo(len * .9, -.1); ctx.closePath(); });
          E(len, 0, .3, 1.05 * open, t('#7e60b8'));
          strokePath(t('#f4f1ea'), .05, () => { ctx.moveTo(len * .8, .1); ctx.quadraticCurveTo(len + .9, .2, len + 1.1, -.4); });
          E(len + 1.1, -.45, .1, .07, t('#ffd56b'));
        }));
        [[-25.5, .3], [-27, -.2], [-28.5, .1]].forEach(([y, a]) => at(.8, y, a, 1, 1, () => { E(.9, 0, 1, .35, t('#9a80cf')); E(.7, -.1, .5, .12, t('#c7b4ee')); }));
      });
    } },

    /* M2 — 진딧물이 줄지어 붙은 잎. 단물 방울이 반짝이고, 개미 한 마리가 지킨다 */
    'mosquito:aphidLeaf': { w: 10, h: 2.5, d: (time, t) => {
      strokePath(t(LEAF_DK), .14, () => { ctx.moveTo(-4.6, -.6); ctx.quadraticCurveTo(-5.4, 1.4, -4.8, 3); });
      fillPath(t(LEAF), () => { ctx.moveTo(-4.8, -.6); ctx.bezierCurveTo(-2.5, -2.6, 2.5, -2.4, 4.8, -1.3); ctx.bezierCurveTo(2.5, .2, -2.5, .6, -4.8, -.6); });
      fillPath(t(LEAF_DK), () => { ctx.moveTo(-4.8, -.6); ctx.quadraticCurveTo(0, -.9, 4.8, -1.3); ctx.bezierCurveTo(2.5, .2, -2.5, .6, -4.8, -.6); });
      strokePath(t('#cfe6b8'), .06, () => { ctx.moveTo(-4.6, -.62); ctx.quadraticCurveTo(0, -.95, 4.6, -1.3); });
      [-3, -1.5, 0, 1.5, 3].forEach((x) => faded(.6, () => strokePath(t('#cfe6b8'), .04, () => { ctx.moveTo(x, -.8 - x * .05); ctx.lineTo(x + .8, -1.7 - x * .05); })));
      for (let i = 0; i < 8; i++) {
        const x = -3.4 + i * .8, y = -.95 - x * .05;
        E(x, y - .08, .13, .09, t('#a8d878')); E(x - .03, y - .12, .05, .03, t('#e2f4c8'));
        L(x - .1, y - .1, x - .2, y - .2, t(LEAF_DK), .02);
        if (i % 3 === 1) { E(x - .2, y - .02, .06, .06, t('#e8f4ff')); glint(x - .2, y - .1, .08, .5 + Math.sin(time * 3 + i) * .5); }
      }
      const ax = 2.6, ay = -1.33;
      at(ax, ay, -.05, 1, 1, () => {
        const legs = 0;
        [-.08, 0, .08].forEach((x, i) => L(x, -.05, x + (i - 1) * .12 + legs, .05, t(INK), .02));
        E(-.2, -.14, .14, .1, t('#2a2430')); E(0, -.12, .07, .05, t('#2a2430')); E(.17, -.15, .09, .08, t('#2a2430'));
        strokePath(t(INK), .02, () => { ctx.moveTo(.22, -.2); ctx.lineTo(.3, -.32); ctx.lineTo(.38, -.26 + Math.sin(time * 6) * .04); });
        E(.2, -.17, .025, .025, WHITE);
      });
    } },

    /* M2·D2 — 고추잠자리. 커다란 겹눈, 빨간 마디 배, 그물맥 날개 네 장이 떨린다 */
    'mosquito:dragonfly': { w: 7, h: 3, d: (time, t) => {
      const y = -1.4 + Math.sin(time * 2.2) * .1, red = '#e5463a';
      [[-.1, .55, -.15], [.15, .6, .12]].forEach(([x, len, base], i) => {
        const flick = Math.sin(time * 30 + i * 2) * .14;
        [-1, 1].forEach((side) => at(x, y - .2, base + side * (.12 + flick), 1, 1, () => faded(.45, () => {
          fillPath(t(WING), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-.6, -.45 * side * 0 - .35, -2.6, -.45, -3.1, -.12); ctx.quadraticCurveTo(-2, .05, 0, 0); });
          strokePath(t('#c9d6e8'), .02, () => { ctx.moveTo(0, 0); ctx.lineTo(-3, -.18); ctx.moveTo(-.8, -.2); ctx.lineTo(-1.6, -.05); ctx.moveTo(-1.8, -.3); ctx.lineTo(-2.4, -.08); });
          E(-2.6, -.25, .14, .05, t('#7a3a30'));
        })));
      });
      for (let k = 0; k < 9; k++) {
        const x = -.3 - k * .42, r = .17 - k * .006;
        RR(x - .24, y - r, .46, r * 2, r * .8, t(k % 2 ? red : shade(red)));
      }
      E(.4, y, .55, .42, t('#b8483a')); faded(.5, () => E(.3, y - .2, .3, .1, t('#ff9a7a')));
      [-.05, .25, .5].forEach((x, i) => strokePath(t(INK), .03, () => { ctx.moveTo(x + .2, y + .3); ctx.lineTo(x + .1 + i * .08, y + .65); ctx.lineTo(x - .05 + i * .14, y + .9); }));
      E(1.1, y - .1, .48, .5, t('#9a2a2a')); E(1.2, y - .15, .38, .4, t('#c8403a'));
      E(1.05, y - .35, .16, .12, WHITE); faded(.4, () => E(1.35, y + .1, .12, .1, WHITE));
    } },

    /* M3 — 가로등 불빛 아래 짝을 찾는 수컷 모기 떼 (깃털 더듬이) */
    'mosquito:maleSwarm': { w: 9, h: 7, d: (time, t) => {
      faded(.22 + Math.sin(time * 1.3) * .04, () => E(0, -3.5, 4.6, 3.4, '#ffe9a8'));
      faded(.12, () => P([[-1.2, -7.5], [1.2, -7.5], [4, 0], [-4, 0]], '#fff3c8'));
      for (let i = 0; i < 13; i++) {
        const p = time * (1 + hash(i, 4) * .6) + i * 1.3;
        const x = Math.sin(p) * (2 + hash(i, 5) * 1.8), y = -3.4 + Math.sin(p * 2 + i) * (1.2 + hash(i, 6));
        at(x, y, Math.cos(p) * .2, Math.cos(p) > 0 ? .7 : -.7, .7, () => drawMosquito(time + i, t, { male: true, flap: Math.sin(time * 70 + i) }));
      }
    } },

    /* M3 — 계단에 앉은 사람이 내쉬는 따뜻한 숨. 냄새 알갱이가 내 쪽으로 흘러온다 */
    'mosquito:breathCloud': { w: 12, h: 7, d: (time, t) => {
      for (let i = 0; i < 6; i++) {
        const ph = (time * .25 + i / 6) % 1, x = 5 - ph * 10, y = -3.5 - Math.sin(ph * 3 + i) * 1.2, r = .8 + ph * 1.6;
        faded(.22 * Math.sin(ph * Math.PI), () => { E(x, y, r, r * .7, t('#ffe2cc')); E(x + r * .4, y - r * .3, r * .6, r * .45, t('#fff1e4')); });
        faded(.35 * Math.sin(ph * Math.PI), () => strokePath(t('#f0b8a0'), .06, () => ctx.arc(x, y, r * .55, Math.PI * .2, Math.PI * 1.5)));
      }
      for (let i = 0; i < 16; i++) {
        const ph = (time * .4 + hash(i, 12)) % 1;
        faded(.7 * Math.sin(ph * Math.PI), () => E(5 - ph * 11, -3.5 + (hash(i, 13) - .5) * 4 + Math.sin(time * 2 + i) * .3, .07, .07, t('#ff9aa8')));
      }
    } },

    /* M3 — 계단에 앉아 통화하는 사람의 발: 회색 양말에 삼선 슬리퍼, 발끝을 까딱인다 */
    'mosquito:slipperAnkle': { w: 25, h: 30, d: (time, t) => {
      const tap = Math.max(0, Math.sin(time * 2.4)) * .05;
      at(11, 0, tap, 1, 1, () => at(-11, 0, 0, 1, 1, () => {
        const Sp = planes(t, '#2f4268'), St = planes(t, '#2f5fb0');
        slab(Sp.mid, [[-12.4, 0], [-13, -1.8, -11, -1.8], [10.8, -1.8], [12, -1.4, 11.6, 0]]);                      // 슬리퍼 바닥 옆면
        slab(Sp.dark, [[-12.2, -.5], [11.8, -.5], [11.6, 0], [-12.4, 0]]);
        slab(Sp.lit, [[-12.6, -1.8], [11, -1.8], [11.6, -2.4], [-12, -2.4]]);                                         // 발 닿는 윗면
        fillPath(t('#b9b6c0'), () => { ctx.moveTo(-12, -2.4); ctx.bezierCurveTo(-12.6, -4.8, -10, -5.6, -7, -6); ctx.bezierCurveTo(-3, -6.6, 1, -8.4, 3.4, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11.6, -7, 11.8, -4, 10.4, -2.4); ctx.closePath(); });
        fillPath(t('#9e9aa8'), () => { ctx.moveTo(-12, -2.4); ctx.quadraticCurveTo(0, -3.4, 10.4, -2.4); ctx.lineTo(10.6, -3.6); ctx.quadraticCurveTo(0, -4.4, -12, -3.2); ctx.closePath(); });
        fillPath(t(SKIN), () => { ctx.moveTo(3.4, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11, -18, 11.6, -24, 12.2, -31); ctx.lineTo(4.2, -31); ctx.bezierCurveTo(4, -24, 3.6, -16, 3.4, -11); });
        fillPath(t(SKIN_SH), () => { ctx.moveTo(8.8, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11, -18, 11.6, -24, 12.2, -31); ctx.lineTo(10.2, -31); ctx.bezierCurveTo(9.8, -24, 9.2, -17, 8.8, -11); });
        E(8.2, -12.4, 1, .8, t(SKIN_SH)); RR(3.2, -11.6, 7.6, 1.2, .5, t('#d0cdd6'));
        hairs(4.5, 9.5, -14, -29, 10, 71, t);
        const strap = [[-8.6, -2.4], [-8, -6.6, -2, -8.6, 1.6, -9], [4.2, -8.4], [1.4, -6.6, .4, -4, .8, -2.4]];
        slab(St.mid, strap);
        inside(strap, () => { slab(St.lit, [[-9, -2], [-8.6, -7, -3, -9.4, 1, -10], [-1, -7.4, -5.6, -5.6, -9, -2]]); slab(St.dark, [[-1, -2], [.4, -5, 1.8, -8, 3, -10], [5, -10], [5, -2]]); });   // 볕 받는 발등 쪽 · 그늘진 옆
        [0, 1, 2].forEach((i) => strokePath(WHITE, .45, () => { ctx.moveTo(-6.8 + i * 2.2, -2.8); ctx.quadraticCurveTo(-5.4 + i * 2, -5.8 + i * .2, -2.6 + i * 1.6, -7.4 + i * .2); }));
      }));
    } },

    /* D3 — 양쪽에서 짝! 하고 닫히는 두 손바닥 */
    'mosquito:palmClap': { w: 26, h: 17, d: (time, t) => {
      const gap = 1.2 + (1 + Math.sin(time * 5)) * 2.2;
      faded(.5, () => [-1, 1].forEach((s) => [0, 1, 2].forEach((i) => L(s * (gap + 10.5), -6 - i * 2.2, s * (gap + 12.5 + i * .6), -6.6 - i * 2.2, WHITE, .18))));
      at(-gap - 8, 2, .3, 1, 1, () => clapHand(t));
      at(gap + 8, 2, -.3, -1, 1, () => clapHand(t));
      faded(.6, () => [0, 1, 2, 3].forEach((i) => { const a = -Math.PI / 2 + (i - 1.5) * .45; L(Math.cos(a) * 1, -8 + Math.sin(a) * 1, Math.cos(a) * 2, -8 + Math.sin(a) * 2, t('#ffe08a'), .15); }));
    } },

    /* M4 — 파라솔 의자에 앉은 아저씨 종아리: 쪼리를 신고 다리를 달달 떤다. 털이 숭숭 */
    'mosquito:hairyCalf': { w: 22, h: 34, d: (time, t) => {
      upright(7, 8.6, -34, 0, planes(t, '#4fae7a'), .4);                                                              // 파라솔 의자 다리
      const jig = Math.abs(Math.sin(time * 14)) * .35;
      ctx.save(); ctx.translate(0, -jig);
      fillPath(t(SKIN), () => { ctx.moveTo(-1.6, -9); ctx.bezierCurveTo(-1.8, -18, -2.6, -26, -2, -35); ctx.lineTo(5.6, -35); ctx.bezierCurveTo(6.8, -28, 6.6, -20, 4.6, -14); ctx.bezierCurveTo(4, -11.5, 4, -10, 4.2, -9); ctx.closePath(); });
      fillPath(t(SKIN_SH), () => { ctx.moveTo(3.2, -9); ctx.bezierCurveTo(3.8, -14, 6.2, -20, 4.4, -35); ctx.lineTo(5.6, -35); ctx.bezierCurveTo(6.8, -28, 6.6, -20, 4.6, -14); ctx.bezierCurveTo(4, -11.5, 4, -10, 4.2, -9); ctx.closePath(); });
      faded(.4, () => E(-1.2, -24, .3, 6, t(SKIN_HI)));
      hairs(-1.6, 5.4, -12, -34, 26, 81, t);
      fillPath(t(SKIN), () => { ctx.moveTo(-1.6, -9.5); ctx.bezierCurveTo(-3, -5, -8, -3.6, -11.2, -2.6); ctx.quadraticCurveTo(-12.2, -1.8, -11.4, -1.1); ctx.lineTo(4.4, -1.1); ctx.bezierCurveTo(5, -4, 4.6, -7, 4.2, -9.5); ctx.closePath(); });
      fillPath(t(SKIN_SH), () => { ctx.moveTo(-11.4, -1.1); ctx.lineTo(4.4, -1.1); ctx.lineTo(4.5, -2); ctx.quadraticCurveTo(-4, -2.4, -11.6, -1.8); ctx.closePath(); });
      [[-11, .55], [-9.8, .45], [-8.8, .4], [-7.9, .38], [-7.1, .34]].forEach(([x, r], i) => { E(x, -1.1 - r, r, r, t(i ? SKIN_SH : SKIN)); if (!i) E(x - .1, -1.4 - r, .3, .2, t(NAIL)); });
      E(2.4, -8.6, .8, .6, t(SKIN_SH));
      ctx.restore();
      const Fp = planes(t, '#3a8ad0');
      slab(Fp.mid, [[-12.2, 0], [-12.8, -.6, -12, -1.1], [4.4, -1.1], [5.2, -.6, 4.8, 0]]);                          // 쪼리 바닥
      slab(Fp.dark, [[-12.4, -.4], [5, -.4], [4.8, 0], [-12.2, 0]]);
      slab(Fp.lit, [[-12, -1.1], [4.4, -1.1], [4.8, -1.5], [-11.6, -1.5]]);
      strokePath(t('#1f4f88'), .3, () => { ctx.moveTo(-8.8, -1.6); ctx.quadraticCurveTo(-6, -5, -2, -6.6 - jig); ctx.moveTo(-8.8, -1.6); ctx.quadraticCurveTo(-5, -2.8, 2.6, -2.2); });
    } },

    /* M4 — 쓰러진 사이다 캔과 바닥에 번진 단물. 기포가 톡톡 올라온다 */
    'mosquito:sodaSpill': { w: 16, h: 7, d: (time, t) => {
      faded(.7, () => fillPath(t('#e4f2c4'), () => { ctx.moveTo(-1, 0); ctx.bezierCurveTo(1, -.5, 7, -.6, 8.6, 0); ctx.bezierCurveTo(7, .4, 1, .3, -1, 0); }));
      faded(.5, () => E(5, -.12, 2, .1, WHITE));
      const G = planes(t, '#4caf72'), Al = planes(t, '#d2d6dd');
      E(-5.4, -3.3, 1, 3.3, G.dark);                                                                                // 바닥 쪽 둥근 끝
      const can = [[-5.4, -6.6], [5, -6.6], [5, 0], [-5.4, 0]];
      slab(G.mid, can);
      inside(can, () => { slab(G.lit, [[-6, -7], [6, -7], [6, -5.2], [-6, -5.4]]); slab(G.dark, [[-6, -1.8], [6, -2], [6, 1], [-6, 1]]); });   // 위는 볕, 아래는 그늘
      strokePath(t('#f4f1ea'), .7, () => { ctx.moveTo(-5.4, -3.6); ctx.bezierCurveTo(-3, -5.6, -1, -1.6, 1.4, -3.6); ctx.bezierCurveTo(3, -5, 4, -3, 5, -3.6); });
      slab(G.dark, [[.4, -6.6], [1.2, -4.8], [.6, -3], [1.4, -6.6]]);                                              // 찌그러진 자국
      E(5, -3.3, 1.05, 3.3, Al.dark); E(5.15, -3.4, .82, 2.95, Al.lit);                                              // 따는 쪽 뚜껑
      E(5.25, -4.4, .25, .7, Al.deep); RR(5.05, -2.8, .3, 1.4, .15, Al.dark);
      for (let i = 0; i < 6; i++) {
        const ph = (time * .7 + hash(i, 14)) % 1;
        faded(1 - ph, () => strokePath(WHITE, .04, () => ctx.arc(1 + hash(i, 15) * 6.5, -.1 - ph * .6, .08 + ph * .05, 0, TAU)));
      }
    } },

    /* M4 — 창문을 내린 개인택시의 아랫도리: 주황색 문짝, 문턱, 뒷바퀴 */
    'mosquito:taxiDoor': { w: 44, h: 40, d: (time, t) => {
      const D = planes(t, '#ef9a3c'), T = planes(t, RUBBER), M = planes(t, '#b8bcc6');
      faded(.25, () => E(0, -.2, 22, .6, t(INK)));
      const door = [[-22, -40], [22, -40], [22, -19], [-22, -19]];
      slab(D.mid, door);
      inside(door, () => {
        slab(D.lit, [[-23, -41], [23, -41], [23, -36.4], [-23, -37]]);                                               // 어깨선 위 (볕)
        slab(D.dark, [[-23, -26.4], [0, -27.2, 23, -27], [23, -18], [-23, -18]]);                                    // 문 아랫단 그늘
        E(20, -13.6, 15, 15, D.deep);                                                                                // 바퀴 홈
      });
      slab(t('#3a3445'), [[-22, -22.4], [5, -22.4], [5, -19], [-22, -19]]);                                         // 문턱 고무
      slab(D.deep, [[-4.1, -40], [-3.9, -40], [-3.9, -22.4], [-4.1, -22.4]]);                                        // 문틈 한 줄
      faded(.3, () => P([[-18, -38], [-10, -38], [-14, -30], [-20, -30]], WHITE));
      ctx.save(); ctx.fillStyle = t('#3a3445'); ctx.font = 'bold 4.2px sans-serif'; ctx.fillText('개인', -16, -27.6); ctx.restore();
      at(20, -13, 0, 1, 1, () => {
        litDisc(0, 0, 13, T); litDisc(0, 0, 8.4, M); E(.4, .4, 7.4, 7.4, M.dark);
        for (let k = 0; k < 5; k++) at(0, 0, k * TAU / 5, 1, 1, () => slab(M.lit, [[-.9, -2], [-1.1, -7.4], [1.1, -7.4], [.9, -2]]));
        E(0, 0, 2, 2, M.deep);
      });
      slab(t('#ffb347'), [[-21.4, -20.6], [-18.6, -20.8], [-18.6, -19.6], [-21.4, -19.4]]);
    } },

    /* M5 — 소파에서 잠든 사람의 팔. 손등을 바닥에 대고 손가락을 살짝 오므린 손이 내 쪽으로 늘어졌다 */
    'mosquito:sleepingArm': { w: 36, h: 32, d: (time, t) => {
      const b = Math.sin(time * 1.2) * .25, sk = t(SKIN), sh = t(SKIN_SH);
      faded(.25, () => E(-5, -.05, 10, .35, t(INK)));
      artHandOnArm(t, .5, -3.2, Math.PI + .06, 16, { pose: 'offer' });   // 손목 끝은 팔 아래로 숨긴다
      fillPath(sk, () => { ctx.moveTo(-1.5, -4.9); ctx.bezierCurveTo(3, -8, 9, -18 + b, 12, -32); ctx.lineTo(20, -32); ctx.bezierCurveTo(16, -18 + b, 8, -4, 2, -.2); ctx.lineTo(-1.5, -.2); ctx.quadraticCurveTo(-3.4, -2.55, -1.5, -4.9); ctx.closePath(); });
      fillPath(sh, () => { ctx.moveTo(.6, -.2); ctx.bezierCurveTo(7, -4.2, 14.6, -17 + b, 18, -32); ctx.lineTo(20, -32); ctx.bezierCurveTo(16, -18 + b, 8, -4, 2, -.2); ctx.closePath(); });
      faded(.45, () => strokePath(t('#8fa9d8'), .16, () => { ctx.moveTo(1, -3.2); ctx.bezierCurveTo(5, -6, 9, -12, 12.6, -22); ctx.moveTo(6.4, -8.4); ctx.quadraticCurveTo(9.6, -10, 11, -15); }));
      faded(.35, () => E(5.5, -9, 1.2, 4, t(SKIN_HI)));
      hairs(5, 15, -8, -28, 12, 91, t);
    } },

    /* M5·D6 — 초록 모기향. 받침 위 소용돌이 끝이 빨갛게 타고, 매운 연기가 감아 오른다 */
    'mosquito:mosquitoCoil': { w: 14, h: 18, d: (time, t) => {
      const St = planes(t, '#b4b8c2');
      E(0, -.55, 6.4, 1.15, St.dark); E(-.25, -.85, 6.1, .95, St.lit); E(.3, -.75, 5.2, .7, St.mid);                 // 받침 접시: 테는 볕, 바닥은 가운데 톤
      L(0, -.8, 0, -3.2, St.dark, .2);
      const pts = [];
      for (let a = 0; a <= 3.4 * TAU; a += .2) { const r = .5 + a * .24; pts.push([Math.cos(a) * r, -3.3 + Math.sin(a) * r * .38]); }
      const draw = (c, dy, w) => strokePath(c, w, () => pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))));
      draw(t('#2f6a3a'), .18, .62); draw(t('#4f9a5a'), 0, .55);
      faded(.4, () => draw(t('#9fd8a0'), -.15, .12));
      const [ex, ey] = pts[pts.length - 1];
      ctx.save(); ctx.shadowColor = '#ff6a3a'; ctx.shadowBlur = 10 + Math.sin(time * 6) * 4; E(ex, ey, .35, .3, '#ff6a3a'); ctx.restore();
      E(ex, ey, .18, .16, '#ffd08a');
      wisps([ex], ey - .4, 15, time, t(SMOKE), .6);
      wisps([ex + .4], ey - .8, 11, time + 1.7, t('#d8d4de'), .35);
    } },

    /* M5 — 거실 선풍기의 받침과 기둥. 위에서 바람 줄기가 쓸고 지나간다 */
    'mosquito:electricFan': { w: 28, h: 34, d: (time, t) => {
      const F = planes(t, '#e6ebf2');
      upright(-1.3, 1.3, -34, -2, F, 1);                                                                             // 기둥
      const base = [[-12, -1.2], [-11.6, -3.4, -6, -4.6, 0, -4.6], [6, -4.6, 11.6, -3.4, 12, -1.2], [12, 0, 0, .2, -12, -1.2]];
      slab(F.mid, base);
      inside(base, () => { slab(F.lit, [[-13, -5], [3, -5], [-2, -2.6, -13, -1.6]]); slab(F.dark, [[-13, -1.5], [0, -1.2, 13, -1.6], [13, 1], [-13, 1]]); });   // 둥근 받침: 위는 볕, 앞 테는 그늘
      ['#5fa8ff', '#6fcf8a', '#ffb347', '#ff6b7a'].forEach((c, i) => { const B = planes(t, c); RR(-4.8 + i * 2.4, -1.9, 2, .9, .3, B.mid); RR(-4.8 + i * 2.4, -1.9, 2, .3, .15, B.lit); });
      strokePath(t('#8d929e'), .3, () => { ctx.moveTo(11, -1); ctx.quadraticCurveTo(14, 0, 18, -.2); });
      const sweep = Math.sin(time * .8);
      for (let i = 0; i < 6; i++) {
        const ph = (time * 1.4 + i / 6) % 1, y = -10 - i * 3.6 - sweep * 2;
        faded(.5 * Math.sin(ph * Math.PI), () => strokePath(WHITE, .14, () => { ctx.moveTo(-2 - ph * 16, y); ctx.quadraticCurveTo(-6 - ph * 16, y - 1.2, -10 - ph * 16, y + .2); }));
      }
    } },

    /* M6 — 주차장 구석에 누운 폐타이어. 안쪽 고인 빗물이 초록빛으로 썩어 간다 */
    'mosquito:oldTire': { w: 40, h: 18, d: (time, t) => {
      const T = planes(t, '#4a4550');
      faded(.25, () => E(0, 0, 20, 1.2, t(INK)));
      const band = () => { ctx.beginPath(); ctx.ellipse(0, -3, 19, 3, 0, 0, Math.PI); ctx.lineTo(-19, -13); ctx.ellipse(0, -13, 19, 4.6, 0, Math.PI, 0, true); ctx.closePath(); };
      band(); ctx.fillStyle = T.dark; ctx.fill();                                                                   // 바퀴 옆 띠
      ctx.save(); band(); ctx.clip();
      R(-20, -20, 9, 22, T.mid); R(-20, -20, 3.4, 22, T.lit);                                                       // 왼쪽으로 돌아 나오는 볕
      for (let i = 0; i < 9; i++) { const x = -15 + i * 3.8; slab(T.deep, [[x, -12], [x + 1.1, -8], [x, -4], [x + .6, -4], [x + 1.7, -8], [x + .6, -12]]); }   // 트레드 홈
      ctx.restore();
      E(0, -13, 19, 4.6, T.lit); E(.6, -12.8, 15.4, 3.6, T.mid);                                                    // 윗면 고리
      E(0, -13, 11, 2.6, T.deep);
      fillPath(t('#5e7a52'), () => { ctx.ellipse(0, -12.6, 10.2, 2.1, 0, 0, TAU); });
      faded(.5, () => E(-3, -12.9, 4, .5, t('#9fc48a')));
      P([[4.4, -12.4], [6.6, -13.2], [6.2, -12.2]], t('#c98d5a'));
      ripples(-4, -12.6, 2.4, time, t('#cfe6b8'), 2);
      [[-15, 0], [-12.5, -.5], [16, 0]].forEach(([x, y], i) => strokePath(t(LEAF), .25, () => { ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 1 + i, y - 3, x - .5 + Math.sin(time + i) * .3, y - 4.4); }));
    } },

    /* M6 — 물 위에 띄운 알 뗏목. 알 200개를 세워서 배 모양으로 붙였다 (길이 0.4cm) */
    'mosquito:eggRaft': { w: .6, h: .25, d: (time, t) => {
      ripples(0, 0, .5, time, t('#cfe6b8'), 2);
      const bob = Math.sin(time * 1.5) * .01;
      fillPath(t('#3a2e28'), () => { ctx.moveTo(-.26, -.04 + bob); ctx.quadraticCurveTo(0, .06 + bob, .26, -.06 + bob); ctx.lineTo(.22, -.16 + bob); ctx.quadraticCurveTo(0, -.12 + bob, -.22, -.14 + bob); ctx.closePath(); });
      for (let i = 0; i < 11; i++) { const x = -.2 + i * .04; E(x, -.15 + bob - Math.abs(x) * .1, .016, .02, t('#6b5a4a')); }
      glint(.1, -.22, .05, .5 + Math.sin(time * 2.2) * .5);
    } },

    /* M6 — 화분 받침에 고인 물. 테라코타 화분 밑동이 잠겨 있다 */
    'mosquito:saucerWater': { w: 24, h: 16, d: (time, t) => {
      const C = planes(t, '#d9825f');
      slab(C.dark, [[-11.5, -3], [-10.4, 0], [10.4, 0], [11.5, -3]]);                                                // 받침 앞 테
      E(0, -3, 11.5, 1.8, C.lit); E(0, -3, 10.6, 1.4, t('#6f9a9a'));
      faded(.5, () => E(-5, -3.1, 3, .3, WHITE));
      ripples(6.5, -3, 2, time, t('#cfe6f0'), 2);
      const pot = [[-6.4, -3], [-7.6, -15], [7.6, -15], [6.4, -3]];
      slab(C.mid, pot);
      inside(pot, () => { slab(C.lit, [[-8, -3], [-8, -15], [-4, -15], [-3.6, -3]]); slab(C.dark, [[3.2, -3], [3.8, -15], [8, -15], [8, -3]]); });   // 원뿔 화분: 왼쪽 볕, 오른쪽 그늘
      slab(C.mid, [[-8.4, -14.6], [8.4, -14.6], [8.4, -16.4], [-8.4, -16.4]]);                                       // 화분 테
      slab(C.lit, [[-8.4, -14.6], [-5, -14.6], [-5, -16.4], [-8.4, -16.4]]); slab(C.dark, [[5.6, -14.6], [8.4, -14.6], [8.4, -16.4], [5.6, -16.4]]);
      faded(.35, () => slab(C.deep, [[-7.6, -14.6], [7.6, -14.6], [7.5, -13.9], [-7.5, -13.9]]));                     // 테 밑 그림자
      faded(.5, () => fillPath(t('#6a4a3a'), () => ctx.ellipse(0, -3.4, 6.4, .5, 0, 0, Math.PI)));
    } },

    /* M7·D7 — 방역 연무기 분사구. 하얀 연기가 뭉게뭉게 밀려 나온다 */
    'mosquito:fogNozzle': { w: 24, h: 12, d: (time, t) => {
      for (let i = 0; i < 9; i++) {
        const ph = (time * .35 + i / 9) % 1, x = -2 - ph * 14, y = -4 - Math.sin(i * 2.3) * 1.5 * ph, r = 1 + ph * 3.4;
        faded(.75 * (1 - ph * .7), () => { E(x, y, r, r * .8, t(SMOKE)); E(x + r * .5, y - r * .4, r * .6, r * .5, WHITE); });
      }
      const H = planes(t, '#9a9eaa'), G = planes(t, '#ffb347');
      strokePath(H.dark, 1.1, () => { ctx.moveTo(10, -1); ctx.quadraticCurveTo(4, -2.4, .6, -4); });               // 분사관: 아래는 그늘
      strokePath(H.lit, .45, () => { ctx.moveTo(10, -1.35); ctx.quadraticCurveTo(4, -2.75, .6, -4.35); });          // 윗등은 볕
      slab(H.mid, [[.9, -3.3], [-1.6, -5.2], [-1.9, -2.8], [.7, -4.8]]);                                            // 나팔 주둥이
      slab(H.lit, [[.9, -3.3], [-1.6, -5.2], [-1.75, -4.1], [.8, -4.1]]);
      const grip = [[6, -3.6], [9.2, -3.6], [10, -2, 9.2, -.4], [6, -.4], [5.6, -2, 6, -3.6]];
      slab(G.mid, grip); inside(grip, () => { slab(G.lit, [[5, -4], [10.5, -4], [10.5, -2.8], [5, -2.6]]); slab(G.dark, [[5, -1.2], [10.5, -1.4], [10.5, 0], [5, 0]]); });   // 손잡이
    } },

    /* M7 — 연석 밑 빗물받이. 쇠창살 사이로 어둡고 축축한 틈이 열려 있다 */
    'mosquito:drainGrate': { w: 22, h: 16, d: (time, t) => {
      const C = planes(t, '#b8b4bc'), I = planes(t, '#4a4652');
      slab(C.mid, [[-11, 0], [-11, -14], [11, -14], [11, 0]]);                                                      // 연석 앞면
      slab(C.lit, [[-11, -14], [11, -14], [10.4, -16], [-10.4, -16]]);                                              // 윗면 (볕)
      slab(C.dark, [[9.6, 0], [9.6, -14], [11, -14], [11, 0]]);
      slab(t('#1f1b26'), [[-8, -.6], [-8, -6.4], [-7.4, -7], [7.4, -7], [8, -6.4], [8, -.6]]);                      // 어둡고 축축한 틈
      slab(C.deep, [[-8, -7], [8, -7], [8, -6.2], [-8, -6.2]]);
      for (let x = -7; x <= 7; x += 1.4) { RR(x - .3, -7, .6, 6.4, .2, I.mid); R(x - .3, -7, .2, 6.4, I.lit); }     // 쇠창살: 왼쪽 모서리만 볕
      faded(.4, () => strokePath(t(WATER), .2, () => { ctx.moveTo(-5, -.6); ctx.quadraticCurveTo(-1, .2, 5, -.4); }));
      P([[-5.6, -7], [-4.2, -8.4], [-3.6, -7]], t('#c98d5a')); P([[3, -7], [4.6, -8], [5, -7]], t('#a8b86a'));
      const ph = (time * .6) % 1;
      faded(1 - ph, () => drop(2, -6.6 + ph * 5.6, .14, t(WATER)));
      glint(-6, -6, .3, .5 + Math.sin(time * 2) * .5);
    } },

    /* M8 — 싱크대 밑 배수관. 이음새 너트에서 물방울이 똑똑 맺혀 떨어진다 */
    'mosquito:faucetDrip': { w: 14, h: 32, d: (time, t) => {
      const Pp = planes(t, '#ece8e0'), N = planes(t, '#c9c4d4');
      upright(-4.4, -1.8, -34, -12, Pp, 1);                                                                          // 내려오는 관
      strokePath(Pp.dark, 2.6, () => { ctx.moveTo(-3.1, -12.4); ctx.quadraticCurveTo(-3.1, -7, 1, -7); ctx.quadraticCurveTo(4.6, -7, 4.6, -11); ctx.lineTo(4.6, -13); ctx.lineTo(8, -13); });   // U자 트랩
      strokePath(Pp.mid, 1.8, () => { ctx.moveTo(-3.5, -12.4); ctx.quadraticCurveTo(-3.5, -7.6, 1, -7.6); ctx.quadraticCurveTo(4.1, -7.6, 4.1, -11); ctx.lineTo(4.1, -13.4); ctx.lineTo(8, -13.4); });
      strokePath(Pp.lit, .6, () => { ctx.moveTo(-3.9, -12.4); ctx.quadraticCurveTo(-3.9, -8.2, 1, -8.2); });
      [[-4.8, -14.4, 3.4, 1.8], [3.2, -14.4, 3, 2.6]].forEach(([x, y, w, h]) => {                                    // 이음새 너트
        RR(x, y, w, h, .4, N.mid); R(x + .2, y, w * .28, h, N.lit); R(x + w * .72, y, w * .24, h, N.dark);
      });
      const ph = (time * .5) % 1, swell = Math.min(1, ph * 1.6);
      E(-3.1, -12.4 + swell * .3, .16 + swell * .08, .2 + swell * .14, t(WATER));
      if (ph > .62) { const u = (ph - .62) / .38; drop(-3.1, -12 + u * u * 11.6, .14, t(WATER)); }
      faded(.7, () => E(-3.1, -.06, 1.6, .12, t(WATER)));
      ripples(-3.1, 0, 1.2, time, WHITE, 1);
    } },

    /* M8·D8 — 전기 모기채. 노란 테 안 그물에서 파란 불꽃이 지지직 */
    'mosquito:racketZap': { w: 30, h: 22, d: (time, t) => {
      const swing = Math.sin(time * 2.5) * .06, H = planes(t, '#3a3445'), Y = planes(t, '#ffd23a');
      at(14, 0, swing, 1, 1, () => at(-14, 0, 0, 1, 1, () => {
        strokePath(H.mid, 2.2, () => { ctx.moveTo(5.6, -5.4); ctx.lineTo(15.6, 1); });                                // 손잡이
        strokePath(H.lit, .7, () => { ctx.moveTo(5.9, -6.1); ctx.lineTo(15.6, .2); });
        RR(11.4, -2.6, 1.6, 1, .4, t('#ff4a5a')); E(13.4, -.6, .3, .3, '#7fff9f');
        ctx.save(); ctx.beginPath(); ctx.ellipse(-3, -11, 9.2, 7.2, -.35, 0, TAU); ctx.clip();
        faded(.2, () => R(-14, -20, 22, 18, t('#9fd0ff')));
        ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .08; ctx.globalAlpha = .7; ctx.beginPath();
        for (let k = -14; k <= 8; k += .9) { ctx.moveTo(k, -20); ctx.lineTo(k + 4, -2); }
        for (let k = -20; k <= -2; k += .9) { ctx.moveTo(-14, k); ctx.lineTo(8, k - 4); }
        ctx.stroke(); ctx.restore();
        strokePath(Y.mid, 1.1, () => ctx.ellipse(-3, -11, 9.7, 7.7, -.35, 0, TAU));                                 // 노란 테
        strokePath(Y.lit, .55, () => ctx.ellipse(-3, -11, 9.85, 7.85, -.35, Math.PI * .95, Math.PI * 1.6));          // 왼쪽 위는 볕
        strokePath(Y.dark, .55, () => ctx.ellipse(-3, -11, 9.6, 7.6, -.35, Math.PI * .02, Math.PI * .7));            // 오른쪽 아래는 그늘
        const tick = Math.floor(time * 5);
        if (hash(tick, 2) > .4) {
          const sx = -7 + hash(tick, 3) * 8, sy = -14 + hash(tick, 4) * 6;
          ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 12;
          strokePath('#d6f0ff', .14, () => { ctx.moveTo(sx, sy); ctx.lineTo(sx + .6, sy + .9); ctx.lineTo(sx - .2, sy + 1.5); ctx.lineTo(sx + .5, sy + 2.4); });
          ctx.restore();
        }
      }));
    } },

    /* M9·D9 — 내 몸무게의 쉰 배짜리 빗방울(지름 0.4cm). 웅덩이에 왕관처럼 튄다 */
    'mosquito:bigRaindrop': { w: 10, h: 14, d: (time, t) => {
      const water = t('#bfe0f5');
      faded(.6, () => E(0, -.05, 4.4, .2, t(WATER)));
      for (let i = 0; i < 7; i++) {
        const x = -4 + hash(i, 21) * 8, ph = (time * .8 + hash(i, 22)) % 1, y = -14 + ph * 14;
        faded(.3, () => L(x, y - 2.6, x, y - .7, WHITE, .05));
        faded(.9, () => drop(x, y, .2, water));
        if (ph > .9) {
          const s = (ph - .9) / .1;
          faded(1 - s, () => { [-1, -.5, .5, 1].forEach((d) => E(x + d * (.3 + s * .4), -.2 - Math.abs(d) * s * .4, .05, .05, water)); strokePath(water, .05, () => ctx.ellipse(x, 0, .2 + s * .7, .08 + s * .15, 0, 0, TAU)); });
        }
      }
      const ph = (time * .55) % 1;
      faded(.95, () => drop(-.6, -9 + ph * 9, .32, water)); faded(.4, () => L(-.6, -12 + ph * 9, -.6, -10 + ph * 9, WHITE, .07));
    } },

    /* M9 — 비를 막아 주는 플라타너스 잎. 위에선 빗방울이 튕기고 끝에서 물이 흐른다 */
    'mosquito:leafShelter': { w: 12, h: 9, d: (time, t) => {
      const sway = Math.sin(time * 1.6) * .05;
      strokePath(t('#7a5a3a'), .25, () => { ctx.moveTo(3, -9); ctx.quadraticCurveTo(2, -6, 1, -3.4); });
      at(1, -3.4, sway, 1, 1, () => {
        fillPath(t(LEAF), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-1, -1.6, -4, -2, -5.6, -.6); ctx.lineTo(-4.4, -.2); ctx.lineTo(-6, .8); ctx.bezierCurveTo(-4, 1, -2, .8, 0, 0); });
        fillPath(t(LEAF_DK), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-2, .8, -4, 1, -6, .8); ctx.lineTo(-5.4, 1.6); ctx.bezierCurveTo(-3, 2, -1, 1.2, 0, 0); });
        [[-2, -1.2], [-3.8, -.9], [-2.4, 1.1]].forEach(([x, y]) => faded(.6, () => L(0, 0, x, y, t('#cfe6b8'), .06)));
        L(0, 0, -5.8, .7, t('#cfe6b8'), .08);
        const ph = (time * .7) % 1;
        faded(1 - ph, () => drop(-5.5, 1.8 + ph * 3, .12, t('#bfe0f5')));
        for (let i = 0; i < 3; i++) {
          const u = (time * 1.3 + i * .33) % 1;
          faded(1 - u, () => E(-1.5 - i * 1.4 + u * .4, -1.4 - u * .8, .08, .08, t('#bfe0f5')));
        }
      });
    } },

    /* M9 — 우산 아래 서 있는 사람의 맨다리와 운동화. 우산 끝에서 물이 줄줄 떨어진다 */
    'mosquito:umbrellaLegs': { w: 30, h: 34, d: (time, t) => {
      [-3.8, 4.2].forEach((x, i) => {
        fillPath(t(i ? SKIN_SH : SKIN), () => { ctx.moveTo(x - 2, -10); ctx.bezierCurveTo(x - 2.8, -20, x - 2, -28, x - 2.4, -35); ctx.lineTo(x + 3.4, -35); ctx.bezierCurveTo(x + 4.4, -26, x + 3, -16, x + 2.2, -10); ctx.closePath(); });
        hairs(x - 1.6, x + 2, -14, -32, 6, 101 + i, t);
        const Sh = planes(t, '#f1efe8'), So = planes(t, '#5fa8ff');
        RR(x - 2.2, -11, 4.6, 2.2, .8, Sh.mid);
        const shoe = [[x - 3, -1], [x - 9, -1], [x - 10.4, -1.4, x - 10, -4.2, x - 7, -4.8], [x - 4, -5.6, x - 2.4, -7.4], [x - 1.4, -9.6, x + 2.4, -9.6], [x + 3.4, -1]];
        slab(Sh.mid, shoe);
        inside(shoe, () => { slab(Sh.lit, [[x - 11, -2.6], [x - 10, -5.4, x - 6, -5.6], [x - 2.6, -8.2], [x - 1.6, -10], [x - 1, -6, x - 6, -3, x - 11, -2.6]]); slab(Sh.dark, [[x + 1.4, -1], [x + 1.8, -6, x + 2, -10], [x + 4, -10], [x + 4, -1]]); });   // 앞코 윗면 볕 · 뒤꿈치 그늘
        RR(x - 10.2, -1.4, 13.8, 1.4, .6, So.mid); R(x - 10, -.5, 13.4, .5, So.dark);
        [0, 1, 2].forEach((k) => L(x - 5 + k * 1.2, -5.8 + k * .8, x - 3.4 + k * 1.2, -6.8 + k * .8, t('#8d929e'), .2));
      });
      [-12, 13].forEach((x, i) => {
        for (let k = 0; k < 4; k++) {
          const ph = (time * 1.4 + k / 4 + i * .3) % 1;
          faded(.9, () => drop(x + Math.sin(k) * .4, -34 + ph * 34, .2, t('#bfe0f5')));
        }
      });
      faded(.5, () => E(1, -.05, 14, .25, t(WATER)));
    } },

    /* M10 — 베란다 방충망. 그물 너머는 여름밤, 아래 귀퉁이가 찢어져 철사가 삐죽 */
    'mosquito:windowScreen': { w: 18, h: 34, d: (time, t) => {
      const F = planes(t, '#d8d4de');
      RR(-8, -34, 16, 34, 0, t('#2a3050'));
      faded(.5, () => { E(4, -26, 1.6, 1.6, '#fff4c8'); E(-3, -12, 3, 1.2, t('#ffd88a')); });
      faded(.25, () => E(4, -26, 3.6, 3.6, '#fff4c8'));
      ctx.save(); ctx.strokeStyle = t('#8d8a9c'); ctx.globalAlpha = .45; ctx.lineWidth = .04; ctx.beginPath();
      for (let x = -8; x <= 8; x += .35) { ctx.moveTo(x, -34); ctx.lineTo(x, x > 1.5 && x < 4.4 ? -4.4 : 0); }
      for (let y = -34; y <= 0; y += .35) { ctx.moveTo(-8, y); ctx.lineTo(y > -4.4 ? 1.5 : 8, y); if (y > -4.4) { ctx.moveTo(4.4, y); ctx.lineTo(8, y); } }
      ctx.stroke(); ctx.restore();
      [[1.6, -4.4, 1, -3.4], [4.3, -4.2, 5.2, -3], [2.6, -4.4, 2.4, -2.8]].forEach(([x1, y1, x2, y2]) => L(x1, y1, x2, y2, t('#b8b4c4'), .06));
      slab(F.lit, [[-9, -34], [-7.6, -34], [-7.6, -.9], [-9, -.9]]);                                                  // 왼쪽 틀 (볕)
      slab(F.dark, [[7.6, -34], [9, -34], [9, -.9], [7.6, -.9]]);                                                     // 오른쪽 틀 (그늘)
      faded(.3, () => slab(t('#141830'), [[-7.6, -34], [7.6, -34], [7.6, -33.2], [-7.6, -32.6]]));                   // 윗틀 그림자
      slab(F.mid, [[-9, 0], [-9, -.9], [9, -.9], [9, 0]]); slab(F.lit, [[-9, -.9], [9, -.9], [8.6, -1.3], [-8.6, -1.3]]);   // 아랫틀
      faded(.4, () => strokePath(t('#b8c8e8'), .08, () => { for (let i = 0; i < 3; i++) { const y = -20 + i * 4 + Math.sin(time + i) * .5; ctx.moveTo(-6, y); ctx.quadraticCurveTo(-2, y - .8, 2, y); } }));
    } },

    /* M10·D11 — 스탠드 에어컨 아랫단. 차가운 바람이 바닥으로 흘러내리고 서리가 반짝인다 */
    'mosquito:acVent': { w: 22, h: 34, d: (time, t) => {
      const A = planes(t, '#eef1f6'), G = planes(t, '#c9d2de');
      const body = [[-8, 0], [-8, -32.6], [-7.2, -34], [5.4, -34], [5.4, 0]];
      slab(A.mid, body);
      slab(A.lit, [[-8, -1], [-8, -32.6], [-7.2, -34], [-5.6, -34], [-6.2, -32.6], [-6.2, -1]]);                       // 둥근 왼쪽 모서리 (볕)
      slab(A.dark, [[5.4, 0], [5.4, -34], [8, -33], [8, 0]]);                                                         // 옆면
      slab(G.dark, [[-6.6, -4], [-6.6, -16], [4.4, -16], [4.4, -4]]);                                                 // 바람 나오는 칸
      for (let y = -15.2; y < -4.5; y += 1.5) { slab(G.lit, [[-6.2, y], [4, y], [4, y + .5], [-6.2, y + .7]]); }       // 날개살: 윗면만 볕
      slab(G.mid, [[-8, 0], [-8, -2], [5.4, -2], [5.4, 0]]); slab(G.dark, [[5.4, 0], [5.4, -2], [8, -1.6], [8, 0]]);   // 받침
      for (let i = 0; i < 7; i++) {
        const ph = (time * .6 + i / 7) % 1, x0 = -8 - ph * 4;
        faded(.55 * Math.sin(ph * Math.PI), () => strokePath(t('#a8d8ff'), .12, () => { ctx.moveTo(x0, -30 + i * 3); ctx.quadraticCurveTo(x0 - 3, -26 + i * 3 + ph * 8, x0 - 5, -20 + i * 3 + ph * 12); }));
      }
      for (let i = 0; i < 6; i++) glint(-10 - hash(i, 33) * 4, -4 - hash(i, 34) * 20, .25, Math.sin(time * 3 + i * 1.7));
    } },

    /* M10 — 침대 옆 탁자에 세워 둔 모기약 스프레이 */
    'mosquito:sprayIdle': { w: 7, h: 23, d: (time, t) => drawCan(t, time) },

    /* D10 — 칙! 기울어진 스프레이에서 하얀 안개가 뿜어져 나온다 */
    'mosquito:sprayMist': { w: 20, h: 26, d: (time, t) => {
      for (let i = 0; i < 26; i++) {
        const ph = (time * .9 + hash(i, 41)) % 1, a = Math.PI + (hash(i, 42) - .5) * .7;
        faded(.6 * (1 - ph), () => E(4 + Math.cos(a) * ph * 12, -22 + Math.sin(a) * ph * 12 + ph * 3, .2 + ph * .9, .2 + ph * .9, t(SMOKE)));
      }
      at(6, 0, .25, 1, 1, () => drawCan(t, time));
      at(6, 0, .25, 1, 1, () => artHandAt(t, 0, -14, Math.PI, 12, { pose: 'grip', sleeve: '#7a9cc6' }));
    } },

    /* D5 — 달리는 차 안에서 본 앞유리. 바깥 가로등이 줄이 되어 지나간다 */
    'mosquito:windshield': { w: 26, h: 24, d: (time, t) => {
      const D = planes(t, '#3a3445');
      fillPath(t('#1f2440'), () => { ctx.moveTo(-12, -3); ctx.lineTo(8, -24); ctx.lineTo(14, -24); ctx.lineTo(14, -3); ctx.closePath(); });
      ctx.save(); ctx.beginPath(); ctx.moveTo(-12, -3); ctx.lineTo(8, -24); ctx.lineTo(14, -24); ctx.lineTo(14, -3); ctx.closePath(); ctx.clip();
      for (let i = 0; i < 8; i++) {
        const ph = (time * 1.8 + hash(i, 51)) % 1, y = -6 - hash(i, 52) * 16;
        faded(.8, () => L(16 - ph * 34, y, 16 - ph * 34 + 4, y, i % 2 ? '#ffd88a' : '#ff8a6a', .4));
      }
      faded(.2, () => P([[-4, -6], [4, -18], [6, -18], [-2, -6]], WHITE));
      ctx.restore();
      slab(D.mid, [[-12.6, -2.4], [7.6, -24.4], [8.8, -24.4], [-11.2, -2.6]]); slab(D.lit, [[-12.6, -2.4], [7.6, -24.4], [8, -24.4], [-12, -2.4]]);   // 앞 기둥
      slab(D.mid, [[-13, 0], [-13, -2.6], [14, -2.6], [14, 0]]);                                                      // 대시보드 앞면
      slab(D.lit, [[-13, -2.6], [14, -2.6], [13.4, -3.6], [-12.2, -3.6]]);                                            // 대시보드 윗면 (볕)
      faded(.6, () => slab(D.deep, [[-6, -3.6], [8, -3.9], [8, -4.4], [-6, -4.1]]));                                  // 와이퍼 그림자
      [[-3, -9], [0, -12], [3, -8]].forEach(([x, y]) => faded(.45, () => E(x, y, .08, .06, t('#8a8494'))));
    } },
  };

  /** 주인공 모기: 가볍게 둥실거리며 날갯짓한다 */
  function hero(time, moving, eye, t) {
    const y = -eye + Math.sin(time * 3) * .3, flap = Math.sin(time * (moving ? 90 : 45));
    at(0, y, Math.sin(time * 1.5) * .05, 1.15, 1.15, () => drawMosquito(time, t, { flap }));
  }

  return [art, hero];
})());
