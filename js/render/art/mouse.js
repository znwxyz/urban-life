/* 생쥐 장면 전용 그림과 주인공 생쥐. 키는 'mouse:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   생쥐 눈높이는 2.5cm라서 밥알은 주먹밥, 숟가락은 다리, 할머니는 다리 두 개와 슬리퍼로만 보인다.
   빛은 왼쪽 위에서 온다: 종이마다 밑색 → 오른쪽 아래 그늘 → 왼쪽 위 밝은 면 순서로 겹쳐 붙인다 */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.mouse = pack.hero; }
})((() => {
  const FUR = Object.freeze({ base: '#a3948a', shade: '#7c6d66', light: '#c8bbb0', belly: '#ece2d6', ear: '#b3a297',
    inner: '#f2aab4', pink: '#f0a0ab', tail: '#cfa5a2', whisker: '#5e504c' });
  const PUP = Object.freeze({ base: '#f5b9bf', shade: '#e18f9b', light: '#ffdfe2' });
  const WOOD = '#c9925c', PLASTER = '#e6dccb', STEEL = '#b9c2c8', RICE = '#fbf7ee', BLACK = '#2d2b33';

  const at = (x, y, draw) => { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); };
  const turn = (x, y, a, draw) => at(x, y, () => { ctx.rotate(a); draw(); });
  const faded = (a, draw) => { ctx.save(); ctx.globalAlpha *= a; draw(); ctx.restore(); };
  const fill = (c, build) => { ctx.fillStyle = c; ctx.beginPath(); build(); ctx.fill(); };
  const clipped = (build, draw) => { ctx.save(); ctx.beginPath(); build(); ctx.clip(); draw(); ctx.restore(); };
  function line(c, w, build) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(); ctx.stroke();
  }
  /** 0~1 사이를 되풀이하는 값 (떨어지는 물방울, 피어오르는 김) */
  const cycle = (time, speed, phase = 0) => (((time * speed + phase) % 1) + 1) % 1;

  /** 굵기가 점점 가늘어지는 3차 곡선 (꼬리·전선·빗자루 살) */
  function taper(c, p, w0, w1, n = 18) {
    const pt = (u) => {
      const v = 1 - u;
      return [v * v * v * p[0][0] + 3 * v * v * u * p[1][0] + 3 * v * u * u * p[2][0] + u * u * u * p[3][0],
        v * v * v * p[0][1] + 3 * v * v * u * p[1][1] + 3 * v * u * u * p[2][1] + u * u * u * p[3][1]];
    };
    const side = (sgn) => Array.from({ length: n + 1 }, (_, i) => {
      const u = i / n, [x, y] = pt(u), [x2, y2] = pt(Math.min(1, u + .01)), [x0, y0] = pt(Math.max(0, u - .01));
      const dx = x2 - x0, dy = y2 - y0, len = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * u) / 2;
      return [x - (dy / len) * w * sgn, y + (dx / len) * w * sgn];
    });
    const a = side(1), b = side(-1).reverse();
    fill(c, () => { [...a, ...b].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); });
  }

  /** 냄새가 피어오르는 물결선 */
  function scent(x, y, h, time, c) {
    faded(.5, () => [-1, 0, 1].forEach((k) => line(c, h * .05, () => {
      for (let i = 0; i <= 10; i++) {
        const u = i / 10, xx = x + k * h * .3 + Math.sin(time * 2.4 + k * 1.7 + u * 6) * h * .1;
        if (i) ctx.lineTo(xx, y - u * h); else ctx.moveTo(xx, y - u * h);
      }
    })));
  }

  /** 바닥에 드리운 납작한 그림자 */
  const groundShadow = (x, w, a = .22) => faded(a, () => E(x, -.05, w, w * .06 + .1, '#2a2240'));

  /* ───────── 생쥐 몸 ───────── */
  function mouseBodyPath() {
    ctx.moveTo(-3.5, -.55);
    ctx.bezierCurveTo(-4.05, -2.3, -2.6, -3.6, -.6, -3.52);
    ctx.bezierCurveTo(.9, -3.46, 1.95, -3.16, 2.72, -2.62);
    ctx.bezierCurveTo(3.45, -2.14, 4.05, -1.7, 4.42, -1.42);
    ctx.bezierCurveTo(4.18, -1.04, 3.45, -.86, 2.65, -.8);
    ctx.bezierCurveTo(1.5, -.4, -1, -.28, -2.5, -.32);
    ctx.bezierCurveTo(-3.05, -.33, -3.35, -.38, -3.5, -.55);
  }

  /** 생쥐 한 마리 (몸길이 약 7cm, 꼬리 제외). o: { moving, seed, sleepy } */
  function drawMouse(time, t, o = {}) {
    const seed = o.seed || 0, w = o.moving ? time * 24 + seed : 0;
    const step = (ph) => (o.moving ? Math.sin(w + ph) * .5 : 0), lift = (ph) => (o.moving ? Math.max(0, Math.cos(w + ph)) * .28 : 0);
    const bob = o.moving ? Math.abs(Math.sin(w)) * .16 : 0, breath = 1 + Math.sin(time * 3.2 + seed) * .025;
    const sway = Math.sin(time * 1.7 + seed) * .45 + (o.moving ? Math.sin(w * .5) * .3 : 0);
    taper(t(FUR.tail), [[-3.2, -.95], [-5.6, -.05], [-7.6, -.15], [-9.8, -1.3 + sway]], .4, .07);
    const limb = (x, y, w, h, c) => RR(x - w / 2, y, w, h, w / 2, c);
    limb(-2.6 + step(Math.PI) * .6, -.9, .5, .85 - lift(Math.PI), t(FUR.shade));
    limb(2.1 + step(0) * .6, -.9, .26, .82 - lift(0), t(FUR.shade));
    E(-2.7 + step(Math.PI), -.12 - lift(Math.PI), .6, .14, t(shade(FUR.pink)));
    E(2.05 + step(0), -.1 - lift(0), .3, .12, t(shade(FUR.pink)));
    at(0, -bob, () => {
      ctx.save(); ctx.translate(0, 0); ctx.scale(1, breath);
      mouseEars(time, t, seed, false);
      fill(t(FUR.shade), mouseBodyPath);
      clipped(mouseBodyPath, () => {
        at(-.14, -.16, () => fill(t(FUR.base), mouseBodyPath));
        turn(-1.1, -3, -.08, () => E(0, 0, 2.3, .55, t(FUR.light)));
        faded(.85, () => E(1.2, -.2, 2.9, .55, t(FUR.belly)));
        line(t(FUR.shade), .1, () => ctx.arc(-2.2, -1.3, 1.15, -1.9, .3));
      });
      mouseEars(time, t, seed, true);
      mouseFace(time, t, seed, o.sleepy);
      ctx.restore();
    });
    turn(-1.95 + step(0) * .6, -.75, .35, () => E(0, 0, .62, .5, t(FUR.base)));
    limb(-1.75 + step(0) * .8, -.6, .42, .5 - lift(0), t(FUR.base));
    limb(2.72 + step(Math.PI) * .7, -.95, .28, .85 - lift(Math.PI), t(FUR.base));
    E(-1.8 + step(0), -.13 - lift(0), .66, .15, t(FUR.pink));
    E(2.75 + step(Math.PI), -.12 - lift(Math.PI), .34, .14, t(FUR.pink));
  }

  /** 귀. near=false면 뒤쪽 귀(그늘색), true면 앞쪽 귀(분홍 속귀) */
  function mouseEars(time, t, seed, near) {
    const flick = Math.max(0, Math.sin(time * 1.3 + seed * 2) - .92) * 4;
    if (!near) { turn(1.2, -3.35, -.45, () => E(0, -.35, .78, .9, t(FUR.shade))); return; }
    turn(1.9, -3.05, -.22 - flick * .3, () => {
      E(0, -.75, .98, 1.08, t(shade(FUR.ear)));
      E(-.06, -.8, .92, 1.02, t(FUR.ear));
      E(.06, -.72, .58, .7, t(FUR.inner));
      faded(.6, () => E(-.12, -.98, .22, .3, t('#ffd3d9')));
    });
  }

  function mouseFace(time, t, seed, sleepy) {
    const sniff = Math.sin(time * 15) * (Math.sin(time * .8 + seed) > .4 ? .05 : 0);
    if (sleepy) line(t(INK), .1, () => ctx.arc(3.02, -2.25, .26, .3, Math.PI - .3));
    else cuteEye(3.02, -2.13, .3, .33, time + seed, t);
    blush(3.2, -1.42, .38, .2);
    E(4.4, -1.45 + sniff, .21, .18, t(FUR.pink)); faded(.8, () => E(4.35, -1.52 + sniff, .07, .05, t('#ffe1e5')));
    faded(.65, () => [[5.8, -2.15], [6.05, -1.55], [5.7, -.95]].forEach(([x, y], i) => line(t(FUR.whisker), .035, () => {
      ctx.moveTo(4.05, -1.48 + sniff); ctx.quadraticCurveTo(4.9, -1.6 + i * .2, x, y + sniff * 2);
    })));
  }

  /** 동그랗게 말고 자는 생쥐 (형제·새끼). k 크기, pal 털색 */
  function curledMouse(time, t, k, seed, pal = FUR) {
    const br = 1 + Math.sin(time * 2.6 + seed * 1.9) * .05;
    at(0, 0, () => {
      ctx.scale(k, k * br);
      taper(t(FUR.tail), [[-1.6, -.5], [-1.2, .1], [1, .15], [2.2, -.25]], .32, .08);
      E(0, -1.35, 2, 1.35, t(pal.shade));
      E(-.12, -1.48, 1.88, 1.22, t(pal.base));
      faded(.8, () => turn(-.6, -2.2, -.3, () => E(0, 0, .9, .3, t(pal.light))));
      turn(1.1, -2.45, .2, () => { E(0, 0, .58, .62, t(shade(pal.base))); E(.06, .03, .35, .4, t(FUR.inner)); });
      E(1.45, -1.2, .8, .7, t(pal.base));
      line(t(INK), .09, () => ctx.arc(1.55, -1.38, .2, .3, Math.PI - .3));
      E(2.18, -1.05, .13, .11, t(FUR.pink));
    });
  }

  /** 털 없는 분홍 새끼 (젤리빈 모양) */
  function pinkPup(time, t, x, y, k, a, seed) {
    turn(x, y, a + Math.sin(time * 4 + seed * 2.3) * .08, () => {
      ctx.scale(k, k);
      E(0, 0, 1, .55, t(PUP.shade)); E(-.05, -.06, .94, .48, t(PUP.base));
      faded(.85, () => E(-.25, -.26, .5, .13, t(PUP.light)));
      E(.82, -.05, .45, .4, t(PUP.base));
      E(.92, -.14, .09, .06, t('#b77a86'));
      E(1.24, .02, .08, .07, t(PUP.shade));
    });
  }

  /* ───────── 장면 소품 도우미 ───────── */
  /** 위가 찢긴 벽 한 조각과 걸레받이. 오른쪽에 그늘면 */
  function wallChunk(t, w, h, salt) {
    const top = (x) => -h + Math.sin(x * 1.7 + salt) * .5 + Math.sin(x * 4.1 + salt * 2) * .25;
    const edge = () => {
      ctx.moveTo(-w / 2, 0);
      for (let x = -w / 2; x <= w / 2 + .01; x += w / 16) ctx.lineTo(x, top(x));
      ctx.lineTo(w / 2, 0); ctx.closePath();
    };
    fill(t(shade(PLASTER)), edge);
    clipped(edge, () => {
      R(-w / 2, -h - 2, w - 1.2, h + 2, t(PLASTER));
      faded(.5, () => R(-w / 2, -h - 2, w * .3, h + 2, t('#f3ece0')));
      RR(-w / 2, -3.2, w, 3.2, .3, t(shade(WOOD)));
      R(-w / 2, -3.2, w - 1.2, 2.9, t(WOOD));
      R(-w / 2, -3.2, w - 1.2, .45, t('#e2b47f'));
    });
  }

  /** 음식물 통 뒤에서 내다보는 회색 고양이 머리와 앞발. 노란 눈이 생쥐를 따라간다 */
  function binCat(time, t) {
    const GRAY = '#8a8f9c', look = Math.sin(time * .7) * .3;
    at(17, -33, () => {
      P([[-7.5, -3], [-6.4, -12.5], [-1.4, -6.6]], t(shade(GRAY))); P([[1.5, -6.8], [6.8, -12.6], [7.6, -2.6]], t(GRAY));
      P([[3, -7], [6.3, -10.8], [6.6, -4]], t('#e8a0a8'));
      E(0, -1, 9.2, 7.6, t(shade(GRAY))); E(.5, -1.4, 8.6, 7, t(GRAY));
      faded(.6, () => E(-2.6, -5, 3.4, 1.4, t('#b3b8c4')));
      [[-3.2, 0], [3.6, 0]].forEach(([x]) => { E(x, -1.2, 2, 1.7, t('#f2d14a')); RR(x - .35 + look, -2.6, .7, 2.8, .35, t('#23202a')); E(x - .6, -1.9, .35, .3, t('#ffffff')); });
      P([[-.5, 1.8], [.9, 1.8], [.2, 2.6]], t('#e8a0a8'));
      faded(.7, () => [-1, 1].forEach((d) => [0, 1].forEach((k) => L(d * 2.4, 2.6 + k * .7, d * 8.5, 2 + k * 1.6, t('#e8e8ee'), .12))));
    });
    at(14, -2, () => { E(0, -1.2, 3, 1.6, t(shade(GRAY))); E(-.3, -1.3, 2.7, 1.4, t(GRAY)); [-1, 0, 1].forEach((k) => L(k * .9 + .8, -.6, k * .9 + .8, -2, t(shade(GRAY)), .12)); });
  }

  /** 엉킨 철수세미 */
  function steelTangle(t, x, y, r, salt) {
    E(x, y, r, r * .85, t('#7f8a92'));
    for (let i = 0; i < 26; i++) {
      const a = hash(i, salt) * TAU, rr = r * (.3 + hash(i, salt + 1) * .7), c = i % 3 ? '#c9d1d6' : '#eef2f4';
      line(t(c), .07, () => ctx.ellipse(x + Math.cos(a) * rr * .4, y + Math.sin(a) * rr * .35, rr * .6, rr * .35, a, 0, 4.6));
    }
  }

  /** 종이 띠 하나 (둥지 재료). 영수증·신문지·휴지 */
  function strip(t, x, y, len, a, c, printed) {
    turn(x, y, a, () => {
      RR(-len / 2, -.17, len, .36, .12, t(shade(c)));
      RR(-len / 2, -.2, len - .08, .32, .12, t(c));
      if (printed) [-.3, .15].forEach((dx) => R(dx * len, -.08, len * .22, .06, t('#9aa0a8')));
    });
  }

  /** 밥알 한 톨 */
  function grain(t, x, y, a, k = 1) {
    turn(x, y, a, () => { E(0, .04, .3 * k, .16 * k, t('#d9d2c4')); E(-.02, 0, .28 * k, .14 * k, t(RICE)); });
  }

  /** 반짝이는 별 하나 (끈끈이 광택, 쇠 반사) */
  function glint(t, x, y, r, time, seed) {
    const s = Math.max(0, Math.sin(time * 2.2 + seed * 2.7)) * r;
    if (s < .02) return;
    fill(t('#ffffff'), () => { ctx.moveTo(x, y - s * 2); ctx.lineTo(x + s * .35, y); ctx.lineTo(x, y + s * 2); ctx.lineTo(x - s * .35, y); ctx.closePath(); });
    fill(t('#ffffff'), () => { ctx.moveTo(x - s * 1.4, y); ctx.lineTo(x, y + s * .3); ctx.lineTo(x + s * 1.4, y); ctx.lineTo(x, y - s * .3); ctx.closePath(); });
  }

  const hero = (time, moving, eye, t) => drawMouse(time, t, { moving });

  const art = {
    /* M1 종이 둥지: 벽 속에 신문지·영수증을 잘게 찢어 쌓은 둥지. 안에서 형제들이 자고 있다 */
    'mouse:paperNest': { w: 15, h: 7, d: (time, t) => {
      const PAPERS = ['#f4efe4', '#e6dfd0', '#fff6dc', '#d6dde2', '#efe7d8'];
      groundShadow(0, 7.5, .3);
      for (let i = 0; i < 22; i++) {
        const u = hash(i, 3) * 2 - 1, h = Math.sqrt(1 - u * u);
        strip(t, u * 6.2, -1.4 - h * 3.6 * (.55 + hash(i, 4) * .45), 1.6 + hash(i, 5) * 1.4, hash(i, 6) * 3, PAPERS[i % 5], i % 4 === 3);
      }
      E(0, -2.1, 5.2, 1.5, t('#6e5c55'));
      E(0, -1.9, 4.6, 1.1, t('#5a4943'));
      at(-2.2, -.9, () => curledMouse(time, t, .55, 1));
      at(2.3, -1, () => { ctx.scale(-1, 1); curledMouse(time, t, .5, 2); });
      at(.2, -1.6, () => curledMouse(time, t, .48, 3));
      for (let i = 0; i < 26; i++) {
        const u = hash(i, 13) * 2 - 1;
        strip(t, u * 6.8, -.3 - hash(i, 14) * 1.5, 1.4 + hash(i, 15) * 1.6, (hash(i, 16) - .5) * 1.4, PAPERS[(i + 2) % 5], i % 5 === 1);
      }
    } },
    /* M1: 둥지에서 주방으로 나가는 벽 구멍. 갉은 자국이 둥글게 나 있고, 엄마 발자국이 밖으로만 찍혀 있다 */
    'mouse:wallHole': { w: 14, h: 18, d: (time, t) => {
      wallChunk(t, 14, 18, 1);
      line(t(shade(PLASTER)), .12, () => { ctx.moveTo(3, -17.5); ctx.lineTo(2.2, -13); ctx.lineTo(3.4, -10); ctx.lineTo(2.6, -7); });
      const hole = () => {
        ctx.moveTo(-2.4, 0);
        for (let i = 0; i <= 12; i++) { const a = Math.PI + (i / 12) * Math.PI, r = 2.4 + (i % 2) * .18; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 1.35); }
        ctx.lineTo(2.4, 0); ctx.closePath();
      };
      fill(t('#e8c696'), () => at(0, 0, () => { ctx.scale(1.12, 1.08); hole(); }));
      fill(t('#2b211e'), hole);
      faded(.5, () => E(0, -.2, 1.6, .5, t('#f5c46e')));
      strip(t, -1.2, -.35, 1.8, -.25, '#fff6dc', true);
      [[-4, -.12], [-5.4, -.1], [5.2, -.1]].forEach(([x, y]) => E(x, y, .2, .09, t('#3a2c26')));
      faded(.45, () => [0, 1, 2].forEach((i) => [-.25, .25].forEach((d) => E(3.4 + i * 1.3, -.06 + d * .1, .12, .06, t('#6b5a50')))));
    } },

    /* M2 마감 뒤 주방: 바닥에 떨어진 숟가락, 흘린 밥알과 김치 한 조각 */
    'mouse:riceScraps': { w: 20, h: 2.6, d: (time, t) => {
      groundShadow(1, 9);
      fill(t(shade(STEEL)), () => { ctx.moveTo(-9.5, -.25); ctx.quadraticCurveTo(-2, -.7, 3.4, -.55); ctx.lineTo(3.4, -.1); ctx.quadraticCurveTo(-2, -.15, -9.5, 0); ctx.closePath(); });
      fill(t(STEEL), () => { ctx.moveTo(-9.5, -.3); ctx.quadraticCurveTo(-2, -.8, 3.4, -.62); ctx.lineTo(3.4, -.42); ctx.quadraticCurveTo(-2, -.55, -9.5, -.12); ctx.closePath(); });
      E(6.2, -.55, 3.1, .62, t(shade(STEEL))); E(6.1, -.68, 2.9, .48, t('#dfe6ea'));
      faded(.8, () => E(5.2, -.8, 1.3, .14, t('#ffffff')));
      [[5.4, -.75, .3], [6.6, -.82, -.4], [7.3, -.7, .9], [6, -.9, 1.4]].forEach(([x, y, a]) => grain(t, x, y, a, .9));
      [[-6, -.18, .2], [-4.6, -.2, 2.4], [-3.2, -.16, .9], [-1.2, -.2, 2], [.4, -.17, .5], [9.2, -.18, 1.1], [10.2, -.2, 2.7], [-7.3, -.17, 1.6]]
        .forEach(([x, y, a]) => grain(t, x, y, a));
      fill(t('#c8452f'), () => { ctx.moveTo(-3.6, -.1); ctx.bezierCurveTo(-3.2, -1.9, -.8, -2.3, .3, -1.1); ctx.bezierCurveTo(-.4, -.8, -1, -.2, -1.6, -.1); ctx.closePath(); });
      fill(t('#e2683f'), () => { ctx.moveTo(-3.3, -.2); ctx.bezierCurveTo(-3, -1.6, -1.2, -1.9, -.3, -1.1); ctx.bezierCurveTo(-1, -.8, -1.6, -.3, -2, -.15); ctx.closePath(); });
      line(t('#f6e6c8'), .28, () => { ctx.moveTo(-3.1, -.25); ctx.quadraticCurveTo(-2.3, -1, -.6, -1.15); });
      [[-2.4, -.9], [-1.5, -1.3], [-2.9, -.6]].forEach(([x, y]) => E(x, y, .09, .07, t('#8f2a1c')));
      fill(t('#25362c'), () => { ctx.moveTo(1.2, -.08); ctx.lineTo(1.6, -.75); ctx.lineTo(2.9, -.6); ctx.lineTo(3.3, -.08); ctx.closePath(); });
      faded(.4, () => L(1.6, -.6, 2.8, -.5, t('#6f8f74'), .08));
    } },
    /* M2·M8 끈끈이: 판때기 위에 번들거리는 접착제. 한가운데 튀김 조각 */
    'mouse:glueBoard': { w: 18, h: 2.8, d: (time, t) => {
      groundShadow(0, 9.4, .25);
      fill(t('#d8d2c6'), () => { ctx.moveTo(-9, -.3); ctx.lineTo(-7.9, -1.15); ctx.lineTo(7.9, -1.15); ctx.lineTo(9, -.3); ctx.closePath(); });
      R(-9, -.32, 18, .32, t('#5f7fa8')); R(-9, -.32, 18, .08, t('#8eaacb'));
      faded(.85, () => fill(t('#e8c46a'), () => { ctx.moveTo(-8.2, -.42); ctx.lineTo(-7.3, -1.04); ctx.lineTo(7.3, -1.04); ctx.lineTo(8.2, -.42); ctx.closePath(); }));
      faded(.7, () => fill(t('#f6dc8f'), () => { ctx.moveTo(-7.6, -.55); ctx.lineTo(-7, -.95); ctx.lineTo(-1, -.95); ctx.lineTo(-2.4, -.55); ctx.closePath(); }));
      [[-5.6, -.7], [-4.7, -.62], [4.4, -.8], [5.6, -.68]].forEach(([x, y], i) => line(t('#7c6d66'), .05, () => { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + .3, y - .3 - i * .05, x + .65, y - .1); }));
      at(.6, -.75, () => {
        fill(t('#9a5a22'), () => { ctx.moveTo(-1.7, .1); ctx.bezierCurveTo(-2, -1, -1, -1.75, .1, -1.6); ctx.bezierCurveTo(1.4, -1.7, 2.1, -.8, 1.8, .1); ctx.closePath(); });
        fill(t('#d8933d'), () => { ctx.moveTo(-1.55, 0); ctx.bezierCurveTo(-1.85, -.9, -.95, -1.55, .05, -1.45); ctx.bezierCurveTo(1.1, -1.55, 1.75, -.85, 1.5, -.05); ctx.closePath(); });
        for (let i = 0; i < 11; i++) E(-1.2 + hash(i, 21) * 2.5, -1.25 + hash(i, 22) * 1.1, .16, .12, t(i % 2 ? '#f0b960' : '#b8702c'));
        faded(.7, () => E(-.6, -1.2, .45, .14, t('#ffe2a0')));
      });
      glint(t, -5.5, -.85, .14, time, 1); glint(t, 3.2, -.95, .12, time, 2); glint(t, 6.4, -.7, .1, time, 3);
    } },

    /* M3 뒷골목: 식당 뒷문 앞 음식물 수거통. 뚜껑이 덜 닫혀 국물이 흘러내린다 */
    'mouse:foodBin': { w: 26, h: 30, d: (time, t) => {
      const BIN = '#d9a33c';
      ctx.scale(.6, .6);
      groundShadow(0, 18, .3);
      faded(.7, () => E(9, -.1, 7, .45, t('#7a5a32')));
      binCat(time, t);
      [-11, 11].forEach((x) => { E(x, -2.2, 2.2, 2.2, t(BLACK)); E(x - .4, -2.5, .9, .9, t('#6b6770')); });
      const body = () => { ctx.moveTo(-14, -3.4); ctx.lineTo(-15.5, -40); ctx.lineTo(15.5, -40); ctx.lineTo(14, -3.4); ctx.closePath(); };
      fill(t(shade(BIN)), body);
      clipped(body, () => {
        fill(t(BIN), () => { ctx.moveTo(-16, -2); ctx.lineTo(-17, -42); ctx.lineTo(10.5, -42); ctx.lineTo(9.6, -2); ctx.closePath(); });
        faded(.5, () => R(-16, -42, 6, 40, t('#f0c56a')));
        for (let x = -9; x <= 12; x += 5.2) R(x, -38, .9, 33, t(shade(BIN)));
        R(-16, -8, 34, 1.2, t(shade(BIN)));
      });
      RR(-7, -30, 11, 7, .6, t('#fbf6ea')); R(-7, -30, 11, 1.6, t('#3f8f73'));
      ctx.fillStyle = t('#3a3445'); ctx.font = 'bold 3px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('음식물', -1.5, -24.6);
      fill(t('#7a5a32'), () => { ctx.moveTo(8.8, -40); ctx.bezierCurveTo(8.6, -33, 9.6, -25, 9.1, -16); ctx.bezierCurveTo(9.4, -13.6, 10.1, -13.6, 10, -16); ctx.bezierCurveTo(10.2, -26, 9.6, -34, 10, -40); ctx.closePath(); });
      const drip = cycle(time, .45);
      faded(1 - drip, () => E(9.55, -15 + drip * 13, .4, .55, t('#7a5a32')));
      turn(-16.5, -40, -.1, () => {
        RR(0, -3.4, 34, 3.4, 1, t(shade(BIN))); RR(0, -3.6, 33, 3, 1, t('#e8b54e'));
        RR(13, -5.2, 7, 1.8, .8, t(shade(BIN)));
      });
      turn(-15, -.6, .4, () => { RR(-2.4, -.32, 4.8, .64, .3, t('#efe4d0')); E(-2.4, 0, .55, .5, t('#efe4d0')); E(2.4, 0, .55, .5, t('#efe4d0')); });
      scent(2, -44, 6, time, t('#c9b36a'));
    } },

    /* M4 쥐약 먹이통: 잠기는 까만 플라스틱 상자. 입구로 분홍 덩어리가 보인다 */
    'mouse:baitBox': { w: 20, h: 9, d: (time, t) => {
      groundShadow(0, 10.5, .3);
      RR(-10, -7, 20, 7, 1.4, t('#1f1d24'));
      RR(-10, -7, 18.6, 6.6, 1.3, t(BLACK));
      RR(-10.4, -8.4, 20.8, 2, 1, t('#1f1d24')); RR(-10.4, -8.4, 19.4, 1.7, .9, t('#3d3a45'));
      faded(.5, () => RR(-9.5, -8.2, 8, .4, .2, t('#6b6772')));
      const door = (x) => { RR(x - 1.7, -4.2, 3.4, 4, 1.2, t('#121016')); };
      door(-6.2); door(5.4);
      [[-6.8, -.6, '#f07a9a'], [-5.6, -.7, '#4fa3d9'], [-6.2, -1.3, '#f07a9a'], [5, -.6, '#f07a9a'], [6, -.75, '#f07a9a']]
        .forEach(([x, y, c]) => { RR(x - .5, y - .4, 1, .8, .2, t(shade(c))); RR(x - .5, y - .45, .9, .7, .2, t(c)); });
      fill(t('#f2c84b'), () => { ctx.moveTo(-1.2, -2); ctx.lineTo(1.4, -2); ctx.lineTo(.1, -4.6); ctx.closePath(); });
      R(-.08, -3.9, .3, 1.1, t(BLACK)); E(.07, -2.5, .17, .17, t(BLACK));
      RR(1.9, -4.6, 2.6, .35, .1, t('#e65a4a')); RR(1.9, -3.9, 2, .3, .1, t('#8a8690')); RR(1.9, -3.3, 2.3, .3, .1, t('#8a8690'));
      E(-.2, -8.1, .5, .3, t('#6b6772'));
      scent(-6.2, -4.6, 3.4, time, t('#ff9fb8'));
    } },
    /* M4: 까치가 먹다 남긴 식빵 껍질 */
    'mouse:breadCrust': { w: 9, h: 3, d: (time, t) => {
      groundShadow(0, 4.4);
      fill(t('#8f5523'), () => { ctx.moveTo(-4.2, -.05); ctx.bezierCurveTo(-4.4, -2.4, 3.6, -3.2, 4.3, -.4); ctx.lineTo(3.4, -.05); ctx.closePath(); });
      fill(t('#c27a38'), () => { ctx.moveTo(-4, -.15); ctx.bezierCurveTo(-4.1, -2.2, 3.3, -2.9, 4, -.5); ctx.lineTo(3.2, -.3); ctx.bezierCurveTo(2.6, -2, -3, -1.6, -3.2, -.15); ctx.closePath(); });
      fill(t('#f1dcb0'), () => { ctx.moveTo(-3.2, -.15); ctx.bezierCurveTo(-3, -1.6, 2.6, -2, 3.2, -.3); ctx.lineTo(3.1, -.05); ctx.lineTo(-3.2, -.05); ctx.closePath(); });
      [[-1.6, -.6], [-.2, -.9], [1.4, -.7], [.6, -.4], [-2.4, -.35]].forEach(([x, y]) => E(x, y, .18, .1, t('#d8bf8e')));
      faded(.6, () => E(-2, -1.65, .9, .16, t('#e7a35e')));
      [[5, -.1], [5.8, -.12], [-5.1, -.1]].forEach(([x, y], i) => E(x, y, .22 - i * .04, .14, t('#f1dcb0')));
    } },

    /* M5 장마: 길가 빗물받이. 물이 거꾸로 솟구친다 */
    'mouse:stormDrain': { w: 26, h: 7, d: (time, t) => {
      faded(.55, () => E(0, -.1, 13 + Math.sin(time) * .6, .6, t('#7f9aa0')));
      RR(-9, -.5, 18, .5, .1, t('#9aa0a6'));
      R(-8, -.45, 16, .4, t('#3a3640'));
      for (let x = -7.2; x <= 7.2; x += 1.2) R(x, -.45, .5, .4, t('#5d5964'));
      for (let i = 0; i < 4; i++) {
        const x = -5.4 + i * 3.6, h = 2.2 + Math.sin(time * 5 + i * 1.7) * .7 + hash(i, 4) * 1.6;
        fill(t('#8aa3a8'), () => { ctx.moveTo(x - 1.4, -.4); ctx.quadraticCurveTo(x - .9, -h, x, -h - .4); ctx.quadraticCurveTo(x + .9, -h, x + 1.4, -.4); ctx.closePath(); });
        fill(t('#b5cacd'), () => { ctx.moveTo(x - .7, -.6); ctx.quadraticCurveTo(x - .4, -h + .2, x, -h - .2); ctx.quadraticCurveTo(x + .2, -h + .6, x + .2, -.6); ctx.closePath(); });
        E(x, -h - .45, .5, .25, t('#eef6f6'));
      }
      for (let i = 0; i < 8; i++) {
        const u = cycle(time, .9, i / 8), x = -6 + hash(i, 9) * 12;
        faded(1 - u, () => E(x + (hash(i, 10) - .5) * u * 6, -1 - Math.sin(u * Math.PI) * 4, .18, .18, t('#dcebed')));
      }
      [-11, 10.5].forEach((x, i) => {
        const u = cycle(time, .6, i * .5);
        faded(1 - u, () => line(t('#dcebed'), .08, () => ctx.ellipse(x, -.1, .4 + u * 2, .1 + u * .4, 0, 0, TAU)));
      });
    } },
    /* M5: 빌라 반지하 창문. 방범창 너머 창이 손가락 하나만큼 열려 있고 안은 따뜻하다 */
    'mouse:basementWindow': { w: 30, h: 26, d: (time, t) => {
      const BRICK = '#b8664f';
      fill(t(shade(BRICK)), () => { ctx.moveTo(-15, 0); ctx.lineTo(-15, -24); ctx.lineTo(-8, -25.5); ctx.lineTo(2, -24.4); ctx.lineTo(10, -25.6); ctx.lineTo(15, -24.6); ctx.lineTo(15, 0); ctx.closePath(); });
      clipped(() => ctx.rect(-15, -26, 28.8, 26), () => {
        R(-15, -26, 30, 26, t(BRICK));
        for (let r = 0; r < 9; r++) for (let c = -1; c < 6; c++) {
          const x = -15 + c * 6 + (r % 2) * 3, y = -2.9 - r * 2.9;
          RR(x + .15, y + .15, 5.7, 2.6, .3, t(hash(r * 7 + c, 2) > .6 ? '#c97a62' : BRICK));
        }
      });
      RR(-11, -3.4, 22, 2.2, .4, t('#c9c4c0')); R(-11, -3.4, 22, .5, t('#e8e4e0'));
      faded(.6, () => E(0, -1.5, 9, .3, t('#7f9aa0')));
      RR(-10, -20, 20, 16.4, .4, t('#9ea6ad'));
      R(-9.2, -19.2, 9, 14.8, t('#5f7486'));
      R(.6, -19.2, 8.6, 14.8, t('#5f7486'));
      R(-.6, -19.2, 1.6, 14.8, t('#f2c06a'));
      faded(.5, () => E(.2, -11.8, 3.2, 8, t('#ffd98a')));
      RR(-1, -19.4, .6, 15.2, .2, t('#c9d0d6')); RR(1.1, -19.4, .6, 15.2, .2, t('#c9d0d6'));
      faded(.35, () => [[-6, -16], [5, -14]].forEach(([x, y]) => turn(x, y, -.5, () => R(-.3, -3, .6, 6, t('#ffffff')))));
      [-8, -4.6, -1.2, 2.2, 5.6, 9].forEach((x) => { RR(x - .35, -21, .7, 18.2, .3, t('#2b2a30')); R(x - .35, -21, .2, 18.2, t('#55525c')); });
      RR(-10.5, -21.4, 21, .9, .3, t('#2b2a30')); RR(-10.5, -4.4, 21, .9, .3, t('#2b2a30'));
      for (let i = 0; i < 5; i++) {
        const u = cycle(time, .35, i / 5), x = -8 + hash(i, 31) * 16;
        faded(.7, () => E(x, -19 + u * 14, .13, .22, t('#dcebf2')));
      }
    } },

    /* O1 빌라 주차장: 막 들어온 차의 뒷바퀴. 엔진 열기가 아른거린다 */
    'mouse:tire': { w: 64, h: 70, d: (time, t) => {
      const spin = time * (Math.sin(time * .3) > .6 ? 1.6 : 0), CY = -31, BODY = '#8a3442';
      faded(.18, () => fill(t('#2a2240'), () => { ctx.moveTo(-64, 0); ctx.lineTo(-64, -17); ctx.lineTo(40, -17); ctx.lineTo(46, 0); ctx.closePath(); }));
      groundShadow(0, 26, .4);
      const body = () => {
        ctx.moveTo(-64, -17); ctx.lineTo(-32.1, -17); ctx.arc(0, CY, 35, 2.731, 6.693, false);
        ctx.lineTo(34, -17); ctx.quadraticCurveTo(42, -17, 42, -26); ctx.lineTo(42, -90); ctx.lineTo(-64, -90); ctx.closePath();
      };
      fill(t('#2b2730'), body);
      clipped(body, () => { R(-64, -90, 100, 66, t(BODY)); R(-64, -24, 100, 2, t(shade(BODY))); faded(.5, () => R(-64, -48, 100, 1.4, t('#c25a68'))); });
      line(t('#1f1d24'), 1.2, () => ctx.arc(0, CY, 34.4, 3.3, 6.12));
      R(-56, -19, 18, 2.4, t('#3a3740')); E(-48, -18.4, 3.6, 1.3, t('#55525c')); E(-48, -18.4, 2.4, .8, t('#1f1d24'));
      E(0, CY, 31, 31, t('#1f1d24')); E(-.6, CY - .6, 30, 30, t('#2e2b33'));
      for (let i = 0; i < 40; i++) turn(0, CY, i * TAU / 40 + spin * .1, () => RR(28.4, -1.1, 2.4, 2.2, .4, t('#3f3c46')));
      E(0, CY, 22, 22, t('#26232b'));
      E(0, CY, 17.5, 17.5, t('#8d949b')); E(-.5, CY - .5, 16.6, 16.6, t('#bfc6cc'));
      for (let i = 0; i < 5; i++) turn(0, CY, i * TAU / 5 + spin, () => { RR(-2.2, 4.5, 4.4, 12, 1.8, t('#8d949b')); RR(-1.6, 5, 2.4, 11, 1.2, t('#a7aeb5')); });
      E(0, CY, 4.6, 4.6, t('#8d949b')); E(-.4, CY - .4, 3.6, 3.6, t('#d6dce0'));
      faded(.45, () => turn(-9, CY - 9, -.7, () => E(0, 0, 7, 1.8, t('#ffffff'))));
      faded(.6, () => { ctx.fillStyle = t('#55525c'); ctx.font = 'bold 1.8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('205/55 R16', -11, -6.8); });
      for (let i = 0; i < 3; i++) faded(.3, () => line(t('#ffd9a8'), .25, () => {
        for (let k = 0; k <= 10; k++) { const u = k / 10, x = -44 + i * 4 + Math.sin(time * 3 + i + u * 5) * .7; if (k) ctx.lineTo(x, -18 + u * 14); else ctx.moveTo(x, -18); }
      }));
    } },

    /* M6 싱크대 밑: 주름 배수 호스가 바닥 배수관으로 들어가는 자리. 고무 마개가 찢겨 틈이 생겼다 */
    'mouse:sinkPipe': { w: 24, h: 90, d: (time, t) => {
      const HOSE = '#a7aeb5';
      groundShadow(2, 11, .3);
      fill(t('#1f1a1c'), () => ctx.ellipse(2, -.2, 4.8, 1, 0, 0, TAU));
      E(2, -.55, 4.3, .9, t('#d9dde0')); R(-2.3, -2.4, 8.6, 1.9, t('#eef0f1')); R(4.6, -2.4, 1.7, 1.9, t('#c3c9cd')); E(2, -2.4, 4.3, .8, t('#f6f7f8'));
      fill(t('#22262b'), () => ctx.ellipse(2, -2.5, 3.6, .62, 0, 0, TAU));
      const hose = [[-6, -90], [-6, -20], [2.6, -14], [2, -2.6]];
      taper(t(shade(HOSE)), hose, 3.6, 3.6, 24);
      at(-.35, 0, () => taper(t(HOSE), hose, 2.6, 2.6, 24));
      at(-.7, 0, () => taper(t('#d3d8dc'), hose, .7, .7, 24));
      for (let i = 1; i < 26; i++) {
        const u = i / 26, v = 1 - u, x = v * v * v * -6 + 3 * v * v * u * -6 + 3 * v * u * u * 2.6 + u * u * u * 2;
        const y = v * v * v * -34 + 3 * v * v * u * -20 + 3 * v * u * u * -14 + u * u * u * -2.6;
        faded(.55, () => L(x - 1.7, y, x + 1.7, y, t(shade(HOSE)), .16));
      }
      fill(t('#4a4752'), () => { ctx.moveTo(-2, -2.6); ctx.lineTo(-1.4, -4.2); ctx.lineTo(.2, -3.4); ctx.lineTo(-.4, -2.5); ctx.closePath(); });
      const nest = [['#fbf7ee', -9.5, -.8, .3], ['#d6e8f5', -8, -1.2, -.6], ['#fbf7ee', -10.6, -1.6, 1.1], ['#f6efe0', -8.8, -2, .2], ['#e86a5a', -7.2, -.5, .8]];
      nest.forEach(([c, x, y, a], i) => strip(t, x, y, 2 + (i % 2) * .6, a, c, false));
      faded(.8, () => [[-10.2, -2.6], [-8.4, -2.8], [-9.4, -3.1]].forEach(([x, y]) => E(x, y, .9, .55, t('#fbf7ee'))));
      [[8.2, -.12], [9.4, -.1]].forEach(([x, y]) => E(x, y, .2, .09, t('#3a2c26')));
    } },
    /* M6 쥐덫: 나무판에 스프링 쇠막대. 발판 위에 멸치 한 마리 */
    'mouse:snapTrap': { w: 11, h: 3, d: (time, t) => {
      groundShadow(0, 5.6, .3);
      RR(-5, -1, 10, 1, .2, t(shade(WOOD))); RR(-5, -1, 9.5, .85, .2, t('#d9a96e'));
      line(t('#b98450'), .05, () => { ctx.moveTo(-4.6, -.5); ctx.quadraticCurveTo(-1, -.35, 4, -.55); });
      line(t('#9aa3aa'), .16, () => { ctx.moveTo(-4.6, -1.08); ctx.lineTo(-.6, -1.08); ctx.moveTo(-4.4, -1.08); ctx.lineTo(-4.4, -1.25); });
      [-.9, -.3].forEach((x) => { E(x, -1.25, .3, .32, t('#7d868d')); E(x, -1.28, .2, .22, t('#c9d0d6')); });
      line(t('#c9d0d6'), .08, () => { ctx.moveTo(-.5, -1.4); ctx.lineTo(2.2, -1.15); });
      RR(1.6, -1.35, 2.6, .38, .1, t('#d9b13c')); RR(1.6, -1.35, 2.6, .14, .07, t('#f2d36a'));
      at(2.9, -1.7, () => {
        fill(t('#6f7f92'), () => { ctx.moveTo(-1.5, 0); ctx.bezierCurveTo(-.8, -.42, .7, -.42, 1.3, 0); ctx.bezierCurveTo(.7, .22, -.8, .22, -1.5, 0); ctx.closePath(); });
        fill(t('#d6dde4'), () => { ctx.moveTo(-1.3, .05); ctx.bezierCurveTo(-.6, .2, .6, .2, 1.2, .03); ctx.bezierCurveTo(.6, -.02, -.6, -.02, -1.3, .05); ctx.closePath(); });
        P([[-1.5, 0], [-1.95, -.25], [-1.85, .22]], t('#6f7f92'));
        E(.95, -.08, .07, .07, t(INK));
      });
      glint(t, -2.4, -1.15, .1, time, 4);
    } },

    /* M7 수수 빗자루. 할머니가 쓸어 내리는 중 */
    'mouse:broom': { w: 16, h: 42, d: (time, t) => {
      const swing = Math.sin(time * 2.4) * .06;
      groundShadow(0, 6, .25);
      turn(0, -40, swing, () => {
        for (let i = 0; i < 13; i++) {
          const u = i / 12 - .5, c = i % 3 === 0 ? '#a5793c' : i % 3 === 1 ? '#c9a25a' : '#dcbb74';
          taper(t(c), [[u * 3.2, 14], [u * 4.5, 24], [u * 10, 32], [u * 14 + Math.sin(i * 2.1) * .5, 40]], .8, .25, 10);
        }
        RR(-1.9, 12, 3.8, 3.4, .6, t('#c9a25a'));
        [12.8, 14.7].forEach((y) => { R(-2, y, 4, .6, t('#c8392f')); R(-2, y, 4, .2, t('#e8665a')); });
        RR(-1.1, 0, 2.2, 12.4, .8, t('#a5793c')); RR(-1.1, 0, 1.2, 12.4, .6, t('#c9a25a'));
      });
    } },
    /* M7 할머니 다리: 꽃무늬 몸빼 바지와 고무 슬리퍼. 생쥐 눈높이에선 이것만 보인다 */
    'mouse:grandmaLegs': { w: 30, h: 44, d: (time, t) => {
      const PANTS = '#7a5c8f', tap = Math.max(0, Math.sin(time * 6)) * .5;
      groundShadow(0, 14, .3);
      const leg = (x, dark, lift) => at(x, -lift, () => {
        fill(t(dark ? shade(PANTS) : PANTS), () => { ctx.moveTo(-4.5, -46); ctx.lineTo(4.5, -46); ctx.lineTo(4.2, -9); ctx.quadraticCurveTo(0, -7.6, -4.4, -9); ctx.closePath(); });
        for (let i = 0; i < 7; i++) {
          const fx = -3 + hash(i, x + 5) * 6, fy = -42 + i * 4.8;
          [0, 1, 2, 3, 4].forEach((k) => E(fx + Math.cos(k * 1.26) * .6, fy + Math.sin(k * 1.26) * .6, .45, .45, t(dark ? '#c98aa8' : '#f2b0c8')));
          E(fx, fy, .3, .3, t('#f6d36a'));
        }
        RR(-4.3, -10.4, 8.6, 2.2, 1, t(shade(dark ? shade(PANTS) : PANTS)));
        RR(-2.6, -9.2, 5.2, 7, 2.2, t(dark ? '#d9a888' : SKIN));
        fill(t(dark ? '#3f6e9a' : '#4f86b8'), () => { ctx.moveTo(-5.6, 0); ctx.quadraticCurveTo(-6.4, -2.6, -2, -2.6); ctx.lineTo(7.2, -2.2); ctx.quadraticCurveTo(9.6, -1.2, 8.4, 0); ctx.closePath(); });
        RR(-1.2, -4.6, 7, 2.6, 1.2, t(dark ? '#3f6e9a' : '#5f97c9'));
        faded(.5, () => RR(-.8, -4.3, 4.6, .6, .3, t('#ffffff')));
      });
      leg(-5, true, 0); leg(5, false, tap);
    } },

    /* M8 철수세미로 막힌 벽 구멍 */
    'mouse:steelWool': { w: 12, h: 14, d: (time, t) => {
      wallChunk(t, 12, 14, 4);
      fill(t('#2b211e'), () => { ctx.moveTo(-2.2, 0); ctx.quadraticCurveTo(-2.4, -3.6, 0, -3.8); ctx.quadraticCurveTo(2.4, -3.6, 2.2, 0); ctx.closePath(); });
      steelTangle(t, 0, -1.7, 2, 7);
      [[-2.2, -.6, -1], [2, -2.6, .7], [.4, -3.6, -.3]].forEach(([x, y, a]) => line(t('#dfe5e8'), .06, () => { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + a * .6, y - .8, x + a, y - .5); }));
      faded(.85, () => line(t('#f6f6f2'), .32, () => { ctx.moveTo(-2.7, -.15); ctx.quadraticCurveTo(-2.9, -4.2, 0, -4.3); ctx.quadraticCurveTo(2.9, -4.2, 2.7, -.15); }));
      glint(t, -.8, -2.6, .16, time, 5);
    } },
    /* M8 방역 업체 아저씨의 작업화와 손전등 불빛 */
    'mouse:workerBoots': { w: 30, h: 44, d: (time, t) => {
      const PANTS = '#3d4c66', sweep = Math.sin(time * 1.2) * .25;
      groundShadow(0, 15, .32);
      const boot = (x, dark) => at(x, 0, () => {
        RR(-4.4, -46, 8.8, 36, 1.4, t(dark ? shade(PANTS) : PANTS));
        R(-1, -46, .3, 36, t(dark ? '#2f3a50' : '#566683'));
        R(-4.4, -12, 8.8, 1.4, t('#f2c84b')); R(-4.4, -11.5, 8.8, .4, t('#d9d9d9'));
        fill(t(dark ? '#2b2a30' : '#3a3740'), () => { ctx.moveTo(-4.6, -10.6); ctx.lineTo(4.4, -10.6); ctx.lineTo(4.8, -5); ctx.quadraticCurveTo(10.5, -5, 10.8, -1.6); ctx.lineTo(10.8, 0); ctx.lineTo(-5, 0); ctx.closePath(); });
        R(-5, -1.3, 15.8, 1.3, t('#8a6a46'));
        faded(.5, () => E(5.8, -4, 2.4, .7, t('#6b6772')));
        [-8.6, -7, -5.4].forEach((y) => L(-2, y, 3, y + .4, t('#c9c4cc'), .25));
      });
      boot(-6, true); boot(5, false);
      faded(.5, () => [[-14, -.2], [14, -.25]].forEach(([x, y]) => E(x, y, .35 + sweep * .1, .14, t('#c9c4b8'))));
    } },

    /* M9 분홍 콩알들: 휴지 둥지 속 갓 태어난 새끼 일곱 */
    'mouse:pinkPups': { w: 11, h: 3.4, d: (time, t) => {
      groundShadow(0, 5.6, .3);
      fill(t('#d8d2c6'), () => ctx.ellipse(0, -.9, 5.4, 1.4, 0, 0, TAU));
      E(0, -1.15, 4.6, 1.05, t('#efe8dc'));
      [[-3, -1.25, .2], [-1.5, -1.55, -.4], [.1, -1.3, .5], [1.6, -1.6, -.2], [3, -1.25, 2.9], [-.7, -.95, 3.3], [2.2, -1, .1]]
        .forEach(([x, y, a], i) => pinkPup(time, t, x, y, .62, a, i));
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI, x = -Math.cos(a) * 5, y = -.6 + Math.sin(a) * .3;
        E(x, y, .9, .55, t(i % 2 ? '#fbf7ee' : '#f2ece2'));
      }
    } },
    /* M9 쌀 포대: 할머니 부엌 구석 20kg 쌀 포대. 모서리를 갉은 구멍으로 쌀이 샌다 */
    'mouse:riceBag': { w: 30, h: 26, d: (time, t) => {
      const BAG = '#f1ece0';
      groundShadow(0, 15, .3);
      const shape = () => { ctx.moveTo(-14, 0); ctx.bezierCurveTo(-15, -10, -14.4, -20, -12, -23); ctx.lineTo(12, -24); ctx.bezierCurveTo(14.6, -20, 15.4, -10, 14, 0); ctx.closePath(); };
      fill(t(shade(BAG)), shape);
      clipped(shape, () => {
        at(-.8, -.4, () => fill(t(BAG), shape));
        faded(.25, () => { for (let y = -23; y < 0; y += 1.1) L(-15, y, 15, y, t('#cfc6b4'), .12); });
        RR(-8, -18, 16, 11, 1, t('#3f8f73')); RR(-7.2, -17.2, 14.4, 9.4, .8, t('#fbf7ee'));
        ctx.fillStyle = t('#c8392f'); ctx.font = 'bold 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('쌀', 0, -10.4);
        ctx.fillStyle = t('#3f8f73'); ctx.font = 'bold 1.6px sans-serif'; ctx.fillText('경기미 20kg', 0, -8.2);
        R(-15, -4, 30, 1.4, t('#c8392f'));
      });
      fill(t('#d9cfba'), () => { ctx.moveTo(-12, -23); ctx.quadraticCurveTo(-4, -26, 0, -23.6); ctx.quadraticCurveTo(6, -26.4, 12, -24); ctx.lineTo(10, -22.6); ctx.lineTo(-10.6, -22); ctx.closePath(); });
      fill(t('#3a2c26'), () => { ctx.moveTo(-13.9, -1); ctx.lineTo(-13.6, -3.4); ctx.lineTo(-12.2, -3.8); ctx.lineTo(-11, -2.6); ctx.lineTo(-11.6, -.4); ctx.closePath(); });
      for (let i = 0; i < 16; i++) grain(t, -14 - hash(i, 41) * 6 + (i % 3), -.18 - (i % 4 === 0 ? .3 : 0) - hash(i, 43) * .25, hash(i, 42) * 3, .9);
    } },

    /* M10 철거 예정: 빨간 스프레이로 '철거' 쓴 빌라 담. 위엔 눈이 쌓였다 */
    'mouse:demolitionWall': { w: 40, h: 32, d: (time, t) => {
      const CON = '#b9b4ad';
      fill(t(shade(CON)), () => { ctx.moveTo(-20, 0); ctx.lineTo(-20, -30); ctx.lineTo(20, -30); ctx.lineTo(20, 0); ctx.closePath(); });
      R(-20, -30, 38.6, 30, t(CON));
      faded(.4, () => { for (let i = 0; i < 6; i++) R(-20, -30 + i * 5, 38.6, .15, t('#8f8a84')); });
      faded(.9, () => line(t('#d8322a'), 1.1, () => ctx.ellipse(-6, -15, 9, 9.5, 0, 0, TAU)));
      ctx.fillStyle = t('#d8322a'); ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('철거', -6, -12);
      [[-10, -11, 3], [-4.6, -11, 4.6], [-.6, -9, 2.4]].forEach(([x, y, h]) => RR(x, y, .4, h, .2, t('#d8322a')));
      at(10, -22, () => {
        turn(0, 0, .05, () => { RR(-4.2, -2, 8.4, 11, .3, t('#e2ddd2')); RR(-4.4, -2.2, 8.4, 11, .3, t('#fbf8f0')); });
        R(-3.4, -.4, 6.4, .8, t('#3a3445'));
        for (let i = 0; i < 6; i++) R(-3.4, 1.2 + i * 1.2, 6.4 - (i % 3) * 1.2, .3, t('#9aa0a8'));
        faded(.7, () => { R(-4.8, -2.6, 2.4, 1, t('#e8d9a8')); R(2.6, -2.6, 2.4, 1, t('#e8d9a8')); });
      });
      fill(t('#fbfdff'), () => { ctx.moveTo(-20.4, -29.6); for (let x = -20; x <= 20; x += 2) ctx.lineTo(x, -31 - hash(x, 51) * 1.2); ctx.lineTo(20.4, -29.6); ctx.closePath(); });
      fill(t('#fbfdff'), () => { ctx.moveTo(-22, 0); ctx.quadraticCurveTo(-12, -2.4, 0, -1.4); ctx.quadraticCurveTo(12, -2.6, 22, 0); ctx.closePath(); });
    } },
    /* M10 다 큰 새끼들: 서로 엉겨 붙어 자는 셋 */
    'mouse:grownKids': { w: 14, h: 4.4, d: (time, t) => {
      groundShadow(0, 6.5, .3);
      at(-3.4, 0, () => curledMouse(time, t, .82, 7));
      at(3.6, 0, () => { ctx.scale(-1, 1); curledMouse(time, t, .78, 8); });
      at(.2, -.2, () => curledMouse(time, t, .74, 9));
    } },

    /* D4 역류: 하수구에서 거꾸로 솟아 덮치는 흙탕물 */
    'mouse:floodSurge': { w: 22, h: 14, d: (time, t) => {
      const rise = Math.min(1, .55 + cycle(time, .15) * .9);
      const wave = (c, h, ph, dx) => fill(t(c), () => {
        ctx.moveTo(-11, 0);
        for (let i = 0; i <= 22; i++) { const x = -11 + i; ctx.lineTo(x + dx, -h * rise - Math.sin(time * 3 + i * .7 + ph) * .7 - Math.max(0, 1 - Math.abs(i - 14) / 6) * 3 * rise); }
        ctx.lineTo(11, 0); ctx.closePath();
      });
      wave('#5f6b62', 9, 0, 0); wave('#7f8a7c', 7, 1.4, -.3); wave('#a3ad9d', 4.5, 2.6, .2);
      for (let i = 0; i < 9; i++) E(-9 + i * 2.1, -8.6 * rise - Math.sin(time * 3 + i * 1.5) * .7, .7, .35, t('#eef2ea'));
      turn(-4, -5.5 * rise, Math.sin(time * 2) * .4, () => { RR(-.9, -.4, 1.8, .8, .2, t('#e6765f')); });
      turn(5, -6 * rise, Math.sin(time * 1.6) * .6, () => E(0, 0, 1.3, .35, t('#c99a4c')));
    } },
    /* D7 감전: 갉아 벗겨진 냉장고 전선에서 튀는 불꽃 */
    'mouse:sparkWire': { w: 16, h: 8, d: (time, t) => {
      taper(t('#55525c'), [[-8, -.4], [-4, -.5], [-1, -.9], [1.2, -.9]], .7, .7);
      taper(t('#55525c'), [[2.6, -.9], [4.5, -.9], [6, -.4], [8, -.4]], .7, .7);
      faded(.6, () => L(-7.6, -.6, -1.4, -1.05, t('#8a8690'), .15));
      line(t('#d9893a'), .16, () => { ctx.moveTo(1, -.9); ctx.lineTo(2.8, -.9); });
      line(t('#f2b056'), .07, () => { ctx.moveTo(1.1, -1); ctx.lineTo(2.7, -.82); });
      const flash = Math.sin(time * 37) > 0;
      [0, 1, 2, 3, 4].forEach((i) => {
        const a = -Math.PI / 2 + (i - 2) * .55 + Math.sin(time * 23 + i) * .2, r = 2.2 + hash(i + Math.floor(time * 12), 61) * 2.4;
        line(t(flash ? '#fff7c2' : '#ffd23f'), .14, () => {
          ctx.moveTo(1.9, -1);
          ctx.lineTo(1.9 + Math.cos(a) * r * .4 + .3, -1 + Math.sin(a) * r * .4);
          ctx.lineTo(1.9 + Math.cos(a) * r * .6 - .3, -1 + Math.sin(a) * r * .6);
          ctx.lineTo(1.9 + Math.cos(a) * r, -1 + Math.sin(a) * r);
        });
      });
      faded(.5, () => E(1.9, -1, 1.4, 1.4, t('#fff3a8')));
      for (let i = 0; i < 3; i++) { const u = cycle(time, .5, i / 3); faded(.4 * (1 - u), () => E(1.6 + u * 1.5, -2 - u * 5, .6 + u, .5 + u * .8, t('#9a96a0'))); }
    } },
    /* D10 굴삭기: 담을 부수며 내려오는 버킷 */
    'mouse:excavator': { w: 44, h: 60, d: (time, t) => {
      const drop = Math.sin(time * 2.5) * 1.2, ARM = '#f2b43c';
      for (let i = 0; i < 7; i++) { const u = cycle(time, .4, i / 7); faded(.5 * (1 - u), () => E(-14 + hash(i, 71) * 28, -2 - u * 6, 3 + u * 4, 1.6 + u * 2.4, t('#d8d0c4'))); }
      [[-12, -1.2, .3], [-6, -.8, -.5], [9, -1, .9], [14, -.7, .2]].forEach(([x, y, a]) => turn(x, y, a, () => { RR(-1.4, -.8, 2.8, 1.6, .2, t('#b8664f')); R(-1.4, -.8, 2.8, .4, t('#c97a62')); }));
      at(0, drop, () => {
        RR(-3, -60, 10, 36, 2, t(shade(ARM))); RR(-3, -60, 8.4, 36, 2, t(ARM));
        faded(.5, () => R(-2.4, -60, 1.6, 34, t('#ffd57a')));
        E(2, -25, 3.2, 3.2, t('#3a3740')); E(2, -25, 1.5, 1.5, t('#8d949b'));
        fill(t('#3a3740'), () => { ctx.moveTo(-16, -24); ctx.quadraticCurveTo(-4, -28, 16, -21); ctx.lineTo(13, -6); ctx.quadraticCurveTo(-2, -2, -14, -8); ctx.closePath(); });
        fill(t('#55525c'), () => { ctx.moveTo(-15, -23); ctx.quadraticCurveTo(-4, -26.5, 15, -20.5); ctx.lineTo(12.6, -7.4); ctx.quadraticCurveTo(-2, -4, -13.4, -9); ctx.closePath(); });
        faded(.6, () => E(-4, -20, 8, 1.2, t('#8a8690')));
        for (let i = 0; i < 6; i++) { const x = -12 + i * 4.6; P([[x - 1.2, -6.6 + i * .2], [x + 1.2, -6.2 + i * .2], [x + .2, -2.4 + i * .1]], t(i % 2 ? '#c9d0d6' : '#9aa3aa')); }
      });
    } },
  };
  return { art, hero };
})());
