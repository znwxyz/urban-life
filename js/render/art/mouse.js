/* 생쥐 장면 전용 그림과 주인공 생쥐. 키는 'mouse:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   생쥐 눈높이는 2.5cm라서 밥알은 주먹밥, 햄스터 철창 집은 이층집, 사람은 작업화로만 보인다.
   빛은 왼쪽 위에서 온다: 종이마다 밑색 → 오른쪽 아래 그늘 → 왼쪽 위 밝은 면 순서로 겹쳐 붙인다 */
(function register(pack) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(pack.art);
  else { Object.assign(ACTORS, pack.art); ANIMALS.mouse = pack.hero; }
})((() => {
  const FUR = Object.freeze({ base: '#a3948a', shade: '#7c6d66', light: '#c8bbb0', belly: '#ece2d6', ear: '#b3a297',
    inner: '#f2aab4', pink: '#f0a0ab', tail: '#cfa5a2', whisker: '#5e504c' });
  const PUP = Object.freeze({ base: '#f5b9bf', shade: '#e18f9b', light: '#ffdfe2' });
  const WOOD = '#c9925c', PLASTER = '#e6dccb', BLACK = '#2d2b33';

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

  /* 사물 오리기: forms.js의 cut/within을 이 파일 좌표(위가 -y)로 쓴다. 점 형식은 [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
  const up = (pts) => pts.map((p) => p.map((v, i) => (i % 2 ? -v : v)));
  const sheet = (pts, c) => cut(0, 0, 1, up(pts), c);
  const sheetIn = (pts, draw) => within(0, 0, 1, up(pts), draw);
  /** 납작한 판(앞면 + 오른쪽 위로 물러나는 윗면·옆면). x0~x1, 바닥 y0, 높이 h, 깊이 d */
  function slab(p, x0, x1, y0, h, d) {
    const dy = d * .6;
    P([[x0, y0 - h], [x1, y0 - h], [x1 + d, y0 - h - dy], [x0 + d, y0 - h - dy]], p.lit);
    P([[x1, y0], [x1 + d, y0 - dy], [x1 + d, y0 - h - dy], [x1, y0 - h]], p.dark);
    P([[x0, y0], [x1, y0], [x1, y0 - h], [x0, y0 - h]], p.mid);
  }

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
    const W = planes(t, PLASTER), B = planes(t, WOOD), d = w * .08, dy = d * .6;
    const top = (x) => -h + Math.sin(x * 1.7 + salt) * .5 + Math.sin(x * 4.1 + salt * 2) * .25;
    const xs = Array.from({ length: 17 }, (_, i) => -w / 2 + (i / 16) * w), x1 = w / 2;
    P([...xs.map((x) => [x, top(x)]), ...xs.slice().reverse().map((x) => [x + d, top(x) - dy])], W.lit);   // 부서진 윗단면 (볕)
    P([[x1, 0], [x1 + d, -dy], [x1 + d, top(x1) - dy], [x1, top(x1)]], W.dark);                            // 벽 두께 옆면
    P([[-w / 2, 0], ...xs.map((x) => [x, top(x)]), [x1, 0]], W.mid);
    slab(B, -w / 2, x1, 0, 3.2, .7);                                                                     // 걸레받이
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
    const S = planes(t, '#aeb7bd');
    const tuft = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * TAU, k = 1 + (i % 2 ? .14 : -.06) + (hash(i, salt) - .5) * .16;
      return [x + Math.cos(a) * r * k, y + Math.sin(a) * r * .85 * k];
    });
    P(tuft, S.dark);
    sheetIn(tuft, () => { E(x - r * .18, y - r * .16, r * .86, r * .7, S.mid); E(x - r * .42, y - r * .4, r * .42, r * .28, S.lit); });
    [[.1, .5, .45], [-.3, .1, .3]].forEach(([dx, dy, k]) => line(S.lit, r * .05, () => ctx.ellipse(x + dx * r, y + dy * r, r * k * 1.4, r * k * .6, -.3, 3.6, 8.4)));   // 뭉친 쇠 올 두 가닥
  }

  /** 종이 띠 하나 (둥지 재료). 영수증·신문지·휴지 */
  function strip(t, x, y, len, a, c, printed) {
    turn(x, y, a, () => {
      RR(-len / 2, -.17, len, .36, .12, t(shade(c)));
      RR(-len / 2, -.2, len - .08, .32, .12, t(c));
      if (printed) [-.3, .15].forEach((dx) => R(dx * len, -.08, len * .22, .06, t('#9aa0a8')));
    });
  }

  /** 반짝이는 별 하나 (끈끈이 광택, 쇠 반사) */
  function glint(t, x, y, r, time, seed) {
    const s = Math.max(0, Math.sin(time * 2.2 + seed * 2.7)) * r;
    if (s < .02) return;
    fill(t('#ffffff'), () => { ctx.moveTo(x, y - s * 2); ctx.lineTo(x + s * .35, y); ctx.lineTo(x, y + s * 2); ctx.lineTo(x - s * .35, y); ctx.closePath(); });
    fill(t('#ffffff'), () => { ctx.moveTo(x - s * 1.4, y); ctx.lineTo(x, y + s * .3); ctx.lineTo(x + s * 1.4, y); ctx.lineTo(x, y - s * .3); ctx.closePath(); });
  }

  /* ───────── 햄스터 만두와 철창 집 ───────── */
  const HAM = Object.freeze({ base: '#e0a65a', shade: '#b97f3e', light: '#f3cd92', belly: '#fbf3e6', inner: '#f2aab4', pink: '#f0a0ab' });
  const CAGE = Object.freeze({ tray: '#7fc3b4', wire: '#d6dadd', wireShade: '#98a1a8', bedding: '#eed9a8' });
  const SEED = '#3d383e';

  /** 해바라기씨 한 알: 끝이 뾰족한 까만 씨, 흰 줄 하나 */
  function seedAt(t, x, y, a, k = 1) {
    turn(x, y, a, () => {
      ctx.scale(k, k);
      fill(t(SEED), () => { ctx.moveTo(-.55, 0); ctx.quadraticCurveTo(-.2, -.36, .55, -.06); ctx.quadraticCurveTo(-.2, .3, -.55, 0); });
      line(t('#e9e2d4'), .07, () => { ctx.moveTo(-.38, -.02); ctx.quadraticCurveTo(0, -.1, .4, -.05); });
    });
  }

  function hamsterBodyPath() {
    ctx.moveTo(-5, -.4);
    ctx.bezierCurveTo(-5.8, -3.6, -3.6, -7.2, -.2, -7.2);
    ctx.bezierCurveTo(3, -7.2, 5.2, -5.3, 5.4, -3.4);
    ctx.bezierCurveTo(5.6, -1.6, 4.4, -.2, 2.4, -.1);
    ctx.bezierCurveTo(.5, 0, -3.5, 0, -5, -.4);
  }

  /** 앉아 있는 골든햄스터 (몸길이 약 11cm, 오른쪽을 본다). o: { cheeks 볼 부풂, seed 앞발에 든 씨 } */
  function drawHamster(time, t, o = {}) {
    const br = 1 + Math.sin(time * 2.8) * .02, chew = Math.sin(time * 9) > .3 ? .06 : 0, puff = o.cheeks ? 1.25 : 1;
    E(-3.2, -.12, .9, .25, t(HAM.pink)); E(1.6, -.12, .8, .24, t(HAM.pink));
    at(0, 0, () => {
      ctx.scale(1, br);
      turn(.7, -6.9, -.3, () => E(0, 0, .75, .8, t(HAM.shade)));
      fill(t(HAM.shade), hamsterBodyPath);
      clipped(hamsterBodyPath, () => {
        at(-.2, -.2, () => fill(t(HAM.base), hamsterBodyPath));
        turn(-1.6, -6, -.25, () => E(0, 0, 3.2, 1, t(HAM.light)));
        E(2.2, -.4, 3.6, 2.4, t(HAM.belly));
      });
      E(3.3, -2.7 + chew, 1.9 * puff, 1.6 * puff, t(shade(HAM.belly)));
      E(3.2, -2.8 + chew, 1.8 * puff, 1.5 * puff, t(HAM.belly));
      turn(2.5, -6.8, .2, () => { E(0, 0, .8, .82, t(HAM.base)); E(.08, .05, .48, .5, t(HAM.inner)); });
      cuteEye(3.75, -4.6, .4, .44, time, t);
      E(5.45, -3.55, .26, .2, t(HAM.pink));
      faded(.6, () => [-.25, .25].forEach((d) => line(t('#7a6a5c'), .04, () => { ctx.moveTo(5.3, -3.4); ctx.quadraticCurveTo(6.2, -3.4 + d, 6.9, -3.2 + d * 3); })));
    });
    if (o.seed) seedAt(t, 4.9, -1.5, -.9, 1.1);
    E(4.5, -1.15, .5, .38, t(HAM.pink)); E(3.8, -.95, .48, .36, t(HAM.pink));
  }

  /** 철창 집 (폭 46cm). 플라스틱 받침, 쳇바퀴, 톱밥, 씨 그릇, 철망. o: { empty 문 열린 빈 집, hamster 그리기 } */
  function hamsterCage(time, t, o = {}) {
    const T = planes(t, CAGE.tray), B = planes(t, CAGE.bedding), WH = planes(t, '#f2a8b6');
    const top = (x) => -31 + Math.max(0, Math.abs(x) - 18) ** 2 * .25;
    const bars = (dx, dy, c, w) => { for (let x = -22; x <= 22; x += 2) line(c, w, () => { ctx.moveTo(x + dx, -9 + dy); ctx.lineTo(x + dx, top(x) + dy); }); };
    groundShadow(0, 25, .3);
    faded(.45, () => bars(3, -1.8, t(CAGE.wireShade), .12));                                            // 뒤 철망
    P([[-23, -9], [23, -9], [26, -10.8], [-20, -10.8]], T.deep);
    turn(11, -18.5, 0, () => {                                                                         // 쳇바퀴: 테두리 고리와 받침 다리
      line(WH.dark, .5, () => { ctx.moveTo(0, 0); ctx.lineTo(-2.6, 9.5); ctx.moveTo(0, 0); ctx.lineTo(2.6, 9.5); });
      line(WH.dark, 1.3, () => ctx.arc(0, 0, 7, 0, TAU));
      line(WH.lit, .5, () => ctx.arc(0, 0, 7.3, 3.4, 5.2));
      faded(.5, () => line(WH.mid, .25, () => ctx.ellipse(.6, 0, 6.6, 6.6, 0, 0, TAU)));
      E(0, 0, .7, .7, WH.dark);
    });
    const bed = [[-22.5, -9], ...Array.from({ length: 12 }, (_, i) => [-22 + i * 4, -10.2 - Math.sin(i * 1.9) * .5 - hash(i, 7) * .5]), [22.5, -9]];
    P(bed, B.mid); sheetIn(bed, () => P([[-23, -9], [-23, -12], [-6, -12], [-10, -9]], B.lit));
    at(1, -9.6, () => { E(0, 0, 3, .9, t('#c75b4b')); E(0, -.35, 2.6, .6, t(shade('#c75b4b'))); [-1.3, -.4, .5, 1.4].forEach((x, i) => seedAt(t, x, -.6 - (i % 2) * .2, i * .7, .8)); });
    if (o.hamster) at(-12, -9.8, () => { ctx.scale(-1.2, 1.2); drawHamster(time, t, { cheeks: true, seed: true }); });
    P([[21, 0], [24, -1.8], [24, -10.6], [21, -9]], T.dark);                                           // 받침: 오른쪽 옆면 · 앞면 · 볕 받는 윗테
    RR(-23, -9, 44, 9, 1.2, T.mid);
    R(-23, -9, 44, 1.4, T.lit);
    bars(0, 0, t(CAGE.wire), .16);
    line(t(CAGE.wireShade), .25, () => { ctx.moveTo(-22, -9.2); for (let x = -22; x <= 22; x += 1) ctx.lineTo(x, top(x)); ctx.lineTo(22, -9.2); });
    const door = [[-6, -12], [4, -12], [4, -25], [-6, -25]];
    if (!o.empty) { line(t(CAGE.wireShade), .3, () => { door.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }); return; }
    faded(.9, () => fill(t(mix(CAGE.bedding, '#000000', .1)), () => { door.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }));
    const open = [[-6, -12], [-13, -14.5], [-13, -27.5], [-6, -25]];                                 // 앞으로 열린 문
    line(t(CAGE.wire), .3, () => { open.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); });
    for (let k = 1; k < 4; k++) line(t(CAGE.wire), .14, () => { ctx.moveTo(-6 - k * 1.75, -12 - k * .62); ctx.lineTo(-6 - k * 1.75, -25 - k * .62); });
  }

  const hero = (time, moving, eye, t) => drawMouse(time, t, { moving });

  const art = {
    /* M1 종이 둥지: 벽 속에 신문지·영수증을 잘게 찢어 쌓은 둥지. 안에서 형제들이 자고 있다 */
    'mouse:paperNest': { w: 15, h: 7, d: (time, t) => {
      const N = planes(t, '#e9e1d0'), F = planes(t, '#f4efe4');
      groundShadow(0, 7.5, .3);
      // 찢은 종이 끝이 삐죽삐죽한 둥지 더미 하나: 왼쪽 위는 볕, 오른쪽은 그늘
      const ragged = (n, x0, x1, base, hgt, jag, salt) => Array.from({ length: n + 1 }, (_, i) => {
        const u = i / n, bump = Math.sin(u * Math.PI);
        return [x0 + u * (x1 - x0), base - bump * hgt - (i % 2 ? jag : 0) * (.4 + bump) - hash(i, salt) * .25];
      });
      const mound = [[-7.4, 0], ...ragged(16, -7.4, 7.4, -.4, 4.4, .45, 3), [7.4, 0]];
      P(mound, N.mid);
      sheetIn(mound, () => { P([[-8, 0], [-8, -7], [-1.5, -7], [-3.6, -2.4], [-5, 0]], N.lit); P([[3.2, 0], [4.4, -3], [3, -7], [8, -7], [8, 0]], N.dark); });
      E(0, -2.5, 4.6, 1.35, N.deep);                                                                       // 움푹한 안쪽
      E(.4, -2.3, 4, 1, t('#5a4943'));
      at(-2.2, -.9, () => curledMouse(time, t, .55, 1));
      at(2.3, -1, () => { ctx.scale(-1, 1); curledMouse(time, t, .5, 2); });
      at(.2, -1.6, () => curledMouse(time, t, .48, 3));
      const lip = [[-7, 0], ...ragged(14, -7, 7, -.5, 1.1, .28, 13), [7, 0]];                              // 앞쪽 테두리
      P(lip, F.mid);
      sheetIn(lip, () => { P([[-8, -3], [-3, -3], [-4, 0], [-8, 0]], F.lit); P([[3.6, 0], [4.4, -3], [8, -3], [8, 0]], F.dark); });
      strip(t, -2.6, -1.2, 2.2, .25, '#fff6dc', true);                                                     // 영수증 한 장
    } },
    /* M1: 둥지에서 방으로 나가는 벽 구멍. 갉은 자국이 둥글게 나 있고, 엄마 발자국이 밖으로만 찍혀 있다 */
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

    /* M3·M8 끈끈이: 판때기 위에 번들거리는 접착제. 한가운데 튀김 조각 */
    'mouse:glueBoard': { w: 18, h: 2.8, d: (time, t) => {
      const B = planes(t, '#6f8fb5'), G = planes(t, '#e8c46a'), F = planes(t, '#c98234');
      groundShadow(0, 9.4, .25);
      // 얕은 판: 앞 테·오른쪽 끝면, 그 위로 번들거리는 접착제 윗면 (왼쪽이 볕)
      P([[-9, -.4], [8, -.4], [9.2, -1.2], [-7.8, -1.2]], B.lit);
      P([[8, 0], [9.2, -.8], [9.2, -1.2], [8, -.4]], B.dark);
      P([[-9, 0], [8, 0], [8, -.4], [-9, -.4]], B.mid);
      const glue = [[-8.3, -.5], [7.5, -.5], [8.5, -1.1], [-7.3, -1.1]];
      P(glue, G.mid);
      sheetIn(glue, () => { P([[-9, -.4], [-2.6, -.4], [-1.2, -1.2], [-9, -1.2]], G.lit); P([[4.6, -.4], [9, -.4], [9, -1.2], [5.8, -1.2]], G.dark); });
      at(.6, -.75, () => {   // 튀김 한 조각: 아래 그늘, 튀김옷, 볕 받는 등
        const bit = [[-1.7, .1], [-2, -1, -1, -1.75, .1, -1.6], [1.4, -1.7, 2.1, -.8, 1.8, .1]];
        sheet(bit, F.dark);
        sheet([[-1.6, -.1], [-1.85, -.95, -.95, -1.6, .05, -1.5], [1.1, -1.6, 1.8, -.9, 1.5, -.2]], F.mid);
        sheet([[-1.5, -.6], [-1.6, -1.2, -.8, -1.55, .2, -1.45], [-.2, -1.1, -.9, -.8, -1.5, -.6]], F.lit);
      });
      glint(t, -5.5, -.85, .14, time, 1); glint(t, 3.2, -.95, .12, time, 2); glint(t, 6.4, -.7, .1, time, 3);
    } },

    /* M6 뒷골목: 식당 뒷문 앞 음식물 수거통. 뚜껑이 덜 닫혀 국물이 흘러내린다 */
    'mouse:foodBin': { w: 26, h: 30, d: (time, t) => {
      const BIN = '#d9a33c';
      ctx.scale(.6, .6);
      groundShadow(0, 18, .3);
      faded(.7, () => E(9, -.1, 7, .45, t('#7a5a32')));
      binCat(time, t);
      const Y = planes(t, BIN);
      [-11, 11].forEach((x) => { E(x, -2.2, 2.2, 2.2, t(BLACK)); E(x - .4, -2.5, .9, .9, t('#6b6770')); });
      // 아래로 좁아지는 통 하나: 오른쪽으로 돌아가는 옆면, 둥근 왼쪽 어깨는 볕, 뚜껑 밑은 그늘 띠
      P([[14, -3.4], [16.8, -4.6], [18.2, -39], [15.5, -40]], Y.dark);
      const body = [[-14, -3.4], [-15.5, -40], [15.5, -40], [14, -3.4]];
      P(body, Y.mid);
      sheetIn(body, () => {
        sheet([[-17, -2], [-18, -42], [-9.5, -42], [-10.4, -22, -8.8, -2]], Y.lit);
        P([[-16, -42], [16, -42], [16, -37.6], [-16, -37.6]], Y.dark);
      });
      RR(-7, -30, 11, 7, .6, t('#fbf6ea')); R(-7, -30, 11, 1.6, t('#3f8f73'));
      ctx.fillStyle = t('#3a3445'); ctx.font = 'bold 3px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('음식물', -1.5, -24.6);
      fill(t('#7a5a32'), () => { ctx.moveTo(8.8, -40); ctx.bezierCurveTo(8.6, -33, 9.6, -25, 9.1, -16); ctx.bezierCurveTo(9.4, -13.6, 10.1, -13.6, 10, -16); ctx.bezierCurveTo(10.2, -26, 9.6, -34, 10, -40); ctx.closePath(); });
      const drip = cycle(time, .45);
      faded(1 - drip, () => E(9.55, -15 + drip * 13, .4, .55, t('#7a5a32')));
      turn(-16.5, -40, -.1, () => {   // 덜 닫힌 뚜껑: 볕 받는 윗면, 앞 테, 오른쪽 끝면
        P([[0, -2.6], [34, -2.6], [36.4, -4.6], [2.4, -4.6]], Y.lit);
        P([[34, 0], [36.4, -2], [36.4, -4.6], [34, -2.6]], Y.dark);
        RR(0, -2.6, 34, 2.6, .6, Y.mid);
        RR(14, -6.2, 7, 1.8, .8, Y.dark);
      });
      turn(-15, -.6, .4, () => { RR(-2.4, -.32, 4.8, .64, .3, t('#efe4d0')); E(-2.4, 0, .55, .5, t('#efe4d0')); E(2.4, 0, .55, .5, t('#efe4d0')); });
      scent(2, -44, 6, time, t('#c9b36a'));
    } },

    /* M4 쥐약 먹이통: 잠기는 까만 플라스틱 상자. 입구로 분홍 덩어리가 보인다 */
    'mouse:baitBox': { w: 20, h: 9, d: (time, t) => {
      const K = planes(t, '#3a3742');
      groundShadow(0, 10.5, .3);
      // 까만 상자: 앞면, 오른쪽 옆면, 잠긴 뚜껑의 볕 받는 윗면과 그 밑 그늘 한 줄
      P([[8.4, 0], [10.6, -1.2], [10.6, -8.6], [8.4, -7.6]], K.deep);
      RR(-10, -7.6, 18.4, 7.6, .8, K.mid);
      P([[-10.6, -7.4], [8.8, -7.4], [11, -8.8], [-8.4, -8.8]], K.lit);
      P([[-10.4, -6.6], [8.6, -6.6], [8.6, -7.4], [-10.6, -7.4]], K.dark);
      const door = (x) => sheet([[x - 1.7, 0], [x - 1.7, -2.8], [x - 1.7, -4.4, x + 1.7, -4.4, x + 1.7, -2.8], [x + 1.7, 0]], t('#121016'));
      door(-6.2); door(5.4);
      [[-6.8, -.6, '#f07a9a'], [-5.6, -.7, '#4fa3d9'], [-6.2, -1.3, '#f07a9a'], [5, -.6, '#f07a9a'], [6, -.75, '#f07a9a']]
        .forEach(([x, y, c]) => { RR(x - .5, y - .4, 1, .8, .2, t(shade(c))); RR(x - .5, y - .45, .9, .7, .2, t(c)); });
      fill(t('#f2c84b'), () => { ctx.moveTo(-1.2, -2); ctx.lineTo(1.4, -2); ctx.lineTo(.1, -4.6); ctx.closePath(); });
      R(-.08, -3.9, .3, 1.1, t(BLACK)); E(.07, -2.5, .17, .17, t(BLACK));
      E(-.2, -8.1, .5, .3, K.dark);
      scent(-6.2, -4.6, 3.4, time, t('#ff9fb8'));
    } },

    /* O1 빌라 주차장: 막 들어온 차의 뒷바퀴. 엔진 열기가 아른거린다 */
    'mouse:tire': { w: 64, h: 70, d: (time, t) => {
      const CY = -31, BODY = '#8a3442';   // 바퀴는 돌지 않는다 (세계가 흐를 때 뒷걸음처럼 보인다)
      faded(.18, () => fill(t('#2a2240'), () => { ctx.moveTo(-64, 0); ctx.lineTo(-64, -17); ctx.lineTo(40, -17); ctx.lineTo(46, 0); ctx.closePath(); }));
      groundShadow(0, 26, .4);
      const body = () => {
        ctx.moveTo(-64, -17); ctx.lineTo(-32.1, -17); ctx.arc(0, CY, 35, 2.731, 6.693, false);
        ctx.lineTo(34, -17); ctx.quadraticCurveTo(42, -17, 42, -26); ctx.lineTo(42, -90); ctx.lineTo(-64, -90); ctx.closePath();
      };
      const Bd = planes(t, BODY), TI = planes(t, '#3a3640'), RIM = planes(t, '#aab1b8');
      fill(Bd.dark, body);                                                                                // 아래로 말려 들어가는 문턱
      clipped(body, () => { R(-64, -90, 100, 66, Bd.mid); R(-64, -90, 100, 42, Bd.lit); R(36.6, -90, 8, 90, Bd.dark); });   // 어깨선 위는 볕, 뒤 범퍼 끝은 그늘
      line(Bd.deep, 1.2, () => ctx.arc(0, CY, 34.4, 3.3, 6.12));
      R(-56, -19, 18, 2.4, t('#3a3740')); E(-48, -18.4, 3.6, 1.3, t('#55525c')); E(-48, -18.4, 2.4, .8, t('#1f1d24'));
      // 타이어: 볕 받는 왼쪽 위 초승달, 오목한 휠 안쪽, 다섯 살
      E(0, CY, 31, 31, TI.deep); E(-1, CY - 1, 29.6, 29.6, TI.lit); E(.5, CY + .5, 29.2, 29.2, TI.mid);
      E(0, CY, 18.6, 18.6, TI.deep);
      E(0, CY, 17.4, 17.4, RIM.dark); E(-.7, CY - .7, 16.4, 16.4, RIM.lit); E(.4, CY + .4, 14.6, 14.6, RIM.deep);
      for (let i = 0; i < 5; i++) turn(0, CY, i * TAU / 5, () => { P([[-2.4, 3], [2.4, 3], [1.5, 15], [-1.5, 15]], RIM.mid); P([[-2.4, 3], [-.4, 3], [-.3, 15], [-1.5, 15]], RIM.lit); });
      E(0, CY, 4.6, 4.6, RIM.dark); E(-.5, CY - .5, 3.6, 3.6, RIM.lit);
      faded(.6, () => { ctx.fillStyle = t('#55525c'); ctx.font = 'bold 1.8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('205/55 R16', -11, -6.8); });
      for (let i = 0; i < 3; i++) faded(.3, () => line(t('#ffd9a8'), .25, () => {
        for (let k = 0; k <= 10; k++) { const u = k / 10, x = -44 + i * 4 + Math.sin(time * 3 + i + u * 5) * .7; if (k) ctx.lineTo(x, -18 + u * 14); else ctx.moveTo(x, -18); }
      }));
    } },

    /* M3 싱크대 밑: 주름 배수 호스가 바닥 배수관으로 들어가는 자리. 고무 마개가 찢겨 틈이 생겼다 */
    'mouse:sinkPipe': { w: 24, h: 90, d: (time, t) => {
      const HOSE = '#a7aeb5';
      groundShadow(2, 11, .3);
      const D = planes(t, '#e6e9eb'), H = planes(t, HOSE), TS = planes(t, '#f6f1e6');
      // 바닥 배수구: 테두리 받침, 볕 받는 왼쪽·그늘진 오른쪽 몸통, 밝은 윗면과 까만 구멍
      fill(t('#1f1a1c'), () => ctx.ellipse(2, -.2, 4.8, 1, 0, 0, TAU));
      E(2, -.55, 4.3, .9, D.dark);
      R(-2.3, -2.4, 2.6, 1.9, D.lit); R(.3, -2.4, 4.2, 1.9, D.mid); R(4.5, -2.4, 1.8, 1.9, D.dark);
      E(2, -2.4, 4.3, .8, D.lit);
      fill(t('#22262b'), () => ctx.ellipse(2, -2.5, 3.6, .62, 0, 0, TAU));
      const hose = [[-6, -90], [-6, -20], [2.6, -14], [2, -2.6]];
      taper(H.dark, hose, 3.6, 3.6, 24);
      at(-.45, 0, () => taper(H.mid, hose, 2.6, 2.6, 24));
      at(-1, 0, () => taper(H.lit, hose, .8, .8, 24));
      for (let i = 1; i < 26; i++) {   // 주름: 고리마다 그늘 한 줄
        const u = i / 26, v = 1 - u, x = v * v * v * -6 + 3 * v * v * u * -6 + 3 * v * u * u * 2.6 + u * u * u * 2;
        const y = v * v * v * -34 + 3 * v * v * u * -20 + 3 * v * u * u * -14 + u * u * u * -2.6;
        faded(.4, () => L(x - 1.7, y, x + 1.7, y, H.deep, .16));
      }
      P([[-2, -2.6], [-1.4, -4.2], [.2, -3.4], [-.4, -2.5]], t('#4a4752'));
      // 찢어 모은 휴지 뭉치 하나: 볕 받는 왼쪽 위, 그늘진 오른쪽, 빨간 영수증 끝 한 장
      const tuft = [[-12.2, 0], [-12.6, -1.6, -11.4, -3.2, -10, -3], [-9.2, -3.9, -7.6, -3.6, -7.2, -2.6], [-6, -2.4, -5.6, -1, -6, 0]];
      sheet(tuft, TS.mid);
      sheetIn(tuft, () => { E(-10.8, -2.7, 1.8, 1.2, TS.lit); P([[-7.8, 0], [-7.4, -2], [-5, -4], [-5, 0]], TS.dark); });
      strip(t, -8.6, -.5, 2.2, .7, '#e86a5a', false);
      [[8.2, -.12], [9.4, -.1]].forEach(([x, y]) => E(x, y, .2, .09, t('#3a2c26')));
    } },
    /* M7 쥐덫: 나무판에 스프링 쇠막대. 발판 위에 멸치 한 마리 */
    'mouse:snapTrap': { w: 11, h: 3, d: (time, t) => {
      const Wd = planes(t, '#d9a96e'), S = planes(t, '#b9c2c8'), Y = planes(t, '#d9b13c');
      groundShadow(0, 5.6, .3);
      slab(Wd, -5, 4.4, 0, .75, .7);                                                                        // 나무판
      line(S.dark, .16, () => { ctx.moveTo(-4.6, -1.08); ctx.lineTo(-.6, -1.08); ctx.moveTo(-4.4, -1.08); ctx.lineTo(-4.4, -1.25); });
      [-.9, -.3].forEach((x) => { E(x, -1.25, .3, .32, S.dark); E(x - .06, -1.3, .2, .22, S.lit); });   // 감긴 용수철
      line(S.lit, .08, () => { ctx.moveTo(-.5, -1.4); ctx.lineTo(2.2, -1.15); });
      P([[1.6, -1], [4.2, -1], [4.2, -1.24], [1.6, -1.24]], Y.mid); P([[1.6, -1.24], [4.2, -1.24], [4.5, -1.42], [1.9, -1.42]], Y.lit);   // 발판
      at(2.9, -1.7, () => {
        fill(t('#6f7f92'), () => { ctx.moveTo(-1.5, 0); ctx.bezierCurveTo(-.8, -.42, .7, -.42, 1.3, 0); ctx.bezierCurveTo(.7, .22, -.8, .22, -1.5, 0); ctx.closePath(); });
        fill(t('#d6dde4'), () => { ctx.moveTo(-1.3, .05); ctx.bezierCurveTo(-.6, .2, .6, .2, 1.2, .03); ctx.bezierCurveTo(.6, -.02, -.6, -.02, -1.3, .05); ctx.closePath(); });
        P([[-1.5, 0], [-1.95, -.25], [-1.85, .22]], t('#6f7f92'));
        E(.95, -.08, .07, .07, t(INK));
      });
      glint(t, -2.4, -1.15, .1, time, 4);
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

    /* M7 분홍 콩알들: 휴지 둥지 속 갓 태어난 새끼 일곱 */
    'mouse:pinkPups': { w: 11, h: 3.4, d: (time, t) => {
      groundShadow(0, 5.6, .3);
      const T = planes(t, '#efe8dc');
      // 휴지 둥지: 뒤쪽 둔덕(볕/그늘), 새끼들, 몽글몽글한 앞 테 한 장
      const back = [[-5.4, -.4], [-5.6, -1.6, -3.6, -2.2, -2, -2], [-1, -2.5, 1, -2.5, 2, -2], [3.6, -2.3, 5.6, -1.6, 5.4, -.4]];
      sheet(back, T.mid);
      sheetIn(back, () => { E(-3.2, -2, 2.4, .6, T.lit); P([[3, 0], [3.6, -3], [6, -3], [6, 0]], T.dark); });
      [[-3, -1.25, .2], [-1.5, -1.55, -.4], [.1, -1.3, .5], [1.6, -1.6, -.2], [3, -1.25, 2.9], [-.7, -.95, 3.3], [2.2, -1, .1]]
        .forEach(([x, y, a], i) => pinkPup(time, t, x, y, .62, a, i));
      const lip = [[-5.8, 0], [-6, -.9, -5, -1.0, -4.2, -.7], [-3.6, -1.0, -2.4, -1.0, -1.8, -.7], [-1.2, -1.0, 0, -1.0, .6, -.7], [1.2, -1.0, 2.4, -1.0, 3, -.7], [3.6, -1.0, 4.8, -1.0, 5.2, -.7], [5.9, -.9, 6, -.3, 5.8, 0]];
      sheet(lip, T.lit);
      sheetIn(lip, () => P([[2.8, 0], [3.4, -1.6], [7, -1.6], [7, 0]], T.mid));
    } },

    /* M11 철거 예정: 빨간 스프레이로 '철거' 쓴 빌라 담. 위엔 눈이 쌓였다 */
    'mouse:demolitionWall': { w: 40, h: 32, d: (time, t) => {
      const C = planes(t, '#b9b4ad'), N = planes(t, '#f6f2e8');
      // 블록 담: 볕 받는 윗면, 앞면, 오른쪽 두께는 그늘
      P([[-20, -30], [18.6, -30], [21, -31.4], [-17.6, -31.4]], C.lit);
      P([[18.6, 0], [21, -1.4], [21, -31.4], [18.6, -30]], C.dark);
      R(-20, -30, 38.6, 30, C.mid);
      faded(.9, () => line(t('#d8322a'), 1.1, () => ctx.ellipse(-6, -15, 9, 9.5, 0, 0, TAU)));
      ctx.fillStyle = t('#d8322a'); ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('철거', -6, -12);
      [[-10, -11, 3], [-4.6, -11, 4.6], [-.6, -9, 2.4]].forEach(([x, y, h]) => RR(x, y, .4, h, .2, t('#d8322a')));
      at(10, -22, () => {   // 철거 안내문: 아래 귀퉁이가 들린 종이 한 장
        turn(0, 0, .05, () => {
          sheet([[-4.4, -2.2], [4, -2.2], [4, 6.4], [2.4, 8.8], [-4.4, 8.8]], N.mid);
          P([[4, 6.4], [2.4, 8.8], [1.8, 6.8]], N.dark);
          P([[-4.4, -2.2], [-2.6, -2.2], [-3.4, 8.8], [-4.4, 8.8]], N.lit);
        });
        R(-3.4, -.4, 6.4, .8, t('#3a3445'));
        for (let i = 0; i < 3; i++) R(-3.4, 1.6 + i * 1.6, 5.6 - i * 1.4, .3, t('#9aa0a8'));
        faded(.7, () => { R(-4.8, -2.6, 2.4, 1, t('#e8d9a8')); R(2.6, -2.6, 2.4, 1, t('#e8d9a8')); });
      });
      fill(t('#fbfdff'), () => { ctx.moveTo(-20.4, -29.6); for (let x = -20; x <= 20; x += 2) ctx.lineTo(x, -31 - hash(x, 51) * 1.2); ctx.lineTo(20.4, -29.6); ctx.closePath(); });
      fill(t('#fbfdff'), () => { ctx.moveTo(-22, 0); ctx.quadraticCurveTo(-12, -2.4, 0, -1.4); ctx.quadraticCurveTo(12, -2.6, 22, 0); ctx.closePath(); });
    } },

    /* D5 역류: 하수구에서 거꾸로 솟아 덮치는 흙탕물 */
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
    /* D9 굴삭기: 담을 부수며 내려오는 버킷 */
    'mouse:excavator': { w: 44, h: 60, d: (time, t) => {
      const drop = Math.sin(time * 2.5) * 1.2, ARM = '#f2b43c';
      for (let i = 0; i < 7; i++) { const u = cycle(time, .4, i / 7); faded(.5 * (1 - u), () => E(-14 + hash(i, 71) * 28, -2 - u * 6, 3 + u * 4, 1.6 + u * 2.4, t('#d8d0c4'))); }
      const A = planes(t, ARM), K = planes(t, '#4a4752'), BR = planes(t, '#b8664f'), TE = planes(t, '#b9c2c8');
      [[-12, -1.2, .3], [-6, -.8, -.5], [9, -1, .9], [14, -.7, .2]].forEach(([x, y, a]) => turn(x, y, a, () => {   // 깨진 벽돌 조각
        P([[-1.4, .8], [1, .8], [1.4, -.2], [.6, -.8], [-1.2, -.6]], BR.mid); P([[-1.2, -.6], [.6, -.8], [1.4, -.2], [-.6, -.1]], BR.lit); P([[1, .8], [1.4, -.2], [1.5, .6]], BR.dark);
      }));
      at(0, drop, () => {
        // 팔: 아래로 가늘어지는 한 장, 왼쪽 볕 면과 오른쪽 그늘 면
        P([[-3, -60], [7, -60], [6.2, -27], [-2.2, -27]], A.mid);
        P([[-3, -60], [-.6, -60], [.2, -27], [-2.2, -27]], A.lit);
        P([[4.6, -60], [7, -60], [6.2, -27], [4.2, -27]], A.dark);
        E(2, -25, 3.2, 3.2, K.dark); E(1.6, -25.4, 1.5, 1.5, TE.lit);
        // 버킷: 둥근 등(볕) · 앞면 · 오른쪽 아래로 돌아가는 그늘, 이빨은 톱니 한 줄
        const teeth = [[-13.2, -7.6]];
        for (let i = 0; i < 6; i++) { const x = -12 + i * 4.6; teeth.push([x + .2, -2.4 + i * .1], [x + 2.4, -6.4 + i * .2]); }
        P(teeth, TE.mid);   // 톱니는 버킷 뒤에서 삐져나온다
        const bucket = [[-16, -24], [-4, -28, 16, -21], [13, -6], [-2, -2, -14, -8]];
        sheet(bucket, K.mid);
        sheetIn(bucket, () => { sheet([[-17, -26], [-4, -30, 17, -23], [16, -19], [-2, -23.4, -16, -19]], K.lit); sheet([[4, -2], [9, -14, 18, -18], [18, -2]], K.dark); });
      });
    } },

    /* M2: 철창 밑에 쌓인 해바라기씨 껍질. 알맹이 든 씨가 몇 개 섞여 있다 */
    'mouse:seedHulls': { w: 10, h: 1.6, d: (time, t) => {
      groundShadow(0, 5, .2);
      for (let i = 0; i < 16; i++) {
        const x = -4.4 + hash(i, 31) * 8.8, y = -.15 - Math.max(0, 1 - Math.abs(x) / 4.6) * hash(i, 32) * 1.1;
        turn(x, y, hash(i, 33) * 3, () => { E(0, 0, .5, .2, t(i % 3 ? '#4a4448' : '#5c5458')); E(-.06, -.05, .38, .1, t('#8a8288')); });
      }
      [[-2.6, -.3, .4], [1.2, -.9, -.3], [3.4, -.25, .9]].forEach(([x, y, a]) => seedAt(t, x, y, a, 1.2));
    } },
    /* M2·M5 만두의 철창 집: 볼이 터지게 씨를 문 만두가 철창 틈으로 씨 하나를 밀어 낸다 */
    'mouse:hamsterCage': { w: 46, h: 33, d: (time, t) => {
      hamsterCage(time, t, { hamster: true });
      const push = Math.sin(time * 1.4) * .3;
      seedAt(t, -23.4 + push, -10.6, .3, 1.1);
      [[-25.5, -.3, .5], [-27.2, -.25, 2.2]].forEach(([x, y, a]) => seedAt(t, x, y, a, 1.1));
    } },
    /* M5: 하수구에서 거꾸로 올라온 물이 장판 위에 얕게 찼다. 앞면은 비치는 물 한 겹, 위로 동그란 물결이 퍼진다 */
    'mouse:floorPuddle': { w: 60, h: 3, d: (time, t) => {
      const WA = planes(t, '#7f9a9c'), lap = (x) => -1.5 - Math.sin(time * 2 + x * .5) * .12;
      const water = () => { ctx.moveTo(-30, 0); for (let x = -30; x <= 30; x += 2) ctx.lineTo(x, lap(x)); ctx.lineTo(30, 0); ctx.closePath(); };
      faded(.55, () => fill(WA.mid, water));
      faded(.5, () => fill(WA.lit, () => { ctx.moveTo(-30, lap(-30)); for (let x = -30; x <= 30; x += 2) ctx.lineTo(x, lap(x)); for (let x = 30; x >= -30; x -= 2) ctx.lineTo(x, lap(x) + .35); ctx.closePath(); }));
      [[-12, 0], [6, .5]].forEach(([x, ph]) => { const u = cycle(time, .45, ph); faded(.7 * (1 - u), () => line(t('#e6f0ef'), .1, () => ctx.ellipse(x, -1.6, .8 + u * 5, .12 + u * .35, 0, 0, TAU))); });
      turn(-20, -1.6, .2, () => { E(0, 0, .5, .2, t('#4a4448')); E(-.06, -.05, .38, .1, t('#8a8288')); });
      seedAt(t, 14, -1.65, -.4, 1.1);
    } },
    /* M6: 꼬리 끝만 하얀 수컷 생쥐 */
    'mouse:mate': { w: 18, h: 6, d: (time, t) => {
      groundShadow(0, 4.5, .25);
      drawMouse(time, t, { seed: 2 });
      const sway = Math.sin(time * 1.7 + 2) * .45;
      taper(t('#fbf6ee'), [[-7.8, -.15 + sway * .3], [-8.6, -.35 + sway * .5], [-9.3, -.8 + sway * .78], [-9.8, -1.3 + sway]], .2, .08);
    } },
    /* M9: 빌라 화분 틈에서 자란 강아지풀. 이삭이 영글어 고개를 숙였다 */
    'mouse:foxtail': { w: 18, h: 30, d: (time, t) => {
      const G = planes(t, '#8a9a4a'), H = planes(t, '#c9b46a');
      groundShadow(0, 6, .25);
      [[-4, 22, -.5, 0], [1, 28, .3, 1], [5, 18, .8, 2]].forEach(([x, h, lean, i]) => {
        const sw = Math.sin(time * 1.1 + i * 1.7) * .6, tx = x + lean * 4 + sw, ty = -h;
        taper(G.mid, [[x, 0], [x + lean, -h * .4], [x + lean * 3 + sw * .5, -h * .8], [tx, ty]], .35, .14);
        turn(tx, ty, .9 + lean * .5 + sw * .1, () => {
          ctx.scale(1.7, 1.5);                                                 // 이삭: 위로 뻗은 좁은 잎 모양을 기울여 단다
          fill(H.dark, () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-1.4, -.3, -1.5, -4.8, 0, -6.2); ctx.bezierCurveTo(1.5, -4.8, 1.4, -.3, 0, 0); });
          fill(H.mid, () => { ctx.moveTo(-.1, -.2); ctx.bezierCurveTo(-1.2, -.5, -1.25, -4.6, -.05, -5.8); ctx.bezierCurveTo(.7, -4.6, .6, -.5, -.1, -.2); });
          fill(H.lit, () => { ctx.moveTo(-.4, -.8); ctx.bezierCurveTo(-1, -1.5, -1, -4, -.5, -5); ctx.bezierCurveTo(-.3, -4, -.2, -1.5, -.4, -.8); });
        });
      });
      [[-1.5, -.2, .4], [2.8, -.15, 1.9], [7, -.2, .8]].forEach(([x, y, a]) => turn(x, y, a, () => E(0, 0, .3, .14, H.mid)));   // 떨어진 풀씨
    } },
    /* M10: 문이 열린 빈 철창 집. 쳇바퀴만 멈춰 있다 */
    'mouse:emptyCage': { w: 46, h: 33, d: (time, t) => {
      hamsterCage(time, t, { empty: true });
      [[-16, -.3, .4], [-18.6, -.25, 1.9], [-14, -.2, 2.6]].forEach(([x, y, a]) => seedAt(t, x, y, a, 1.1));
    } },
    /* M11: 이삿짐 상자 옆, 눈 오는 골목 바닥에 내놓은 만두의 철창 집. 볼을 턴 씨가 철창 밖에 쌓인다 */
    'mouse:movingBoxes': { w: 70, h: 34, d: (time, t) => {
      at(18, 0, () => { const b = carton(0, 0, 1, 34, 26, 8, '#d9b27c', t); b.back(); b.front(); });   // 옆에 이삿짐 상자
      at(-12, 0, () => hamsterCage(time, t, { hamster: true }));
      const n = 3 + Math.floor(cycle(time, .25) * 4);
      for (let i = 0; i < n; i++) seedAt(t, -36.5 - hash(i, 41) * 4, -.25 - (i > 3 ? .4 : 0), hash(i, 42) * 3, 1.1);
    } },
  };
  return { art, hero };
})());
