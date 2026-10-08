/* 비둘기 장면 전용 그림. 키는 'pigeon:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수) */
(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})((() => {
  /* ── 공용 조각: 비둘기, 실외기, 벤치, 앉은 사람 ── */
  const DOVE = Object.freeze({ body: '#aeb6cb', dark: '#8b93ab', belly: '#c5ccdc', wing: '#d3d9e6', head: '#9aa3bb',
    neckG: '#7fd1c1', neckP: '#c9a3e6', beak: '#f2b48a', leg: '#e6765f' });
  const OLD = Object.freeze({ ...DOVE, body: '#bcc0cc', head: '#b0b4c1', wing: '#dcdee5', neckG: '#a9cfc6', neckP: '#cdb9dc', leg: '#c98a7a' });
  /* 초록발: 발목에 초록 고리를 찬 길 잃은 경주 비둘기. 날개에 바둑판 무늬 */
  const CHECK = Object.freeze({ ...DOVE, body: '#a9aab9', dark: '#5f6078', belly: '#c2c4d2', wing: '#c6c8d6', head: '#9798ad', neckG: '#86c9b6', neckP: '#b7a0d8' });
  const WET = Object.freeze({ ...CHECK, body: '#8f90a3', wing: '#a9abbc', head: '#84859c', belly: '#a8aabb' });
  const CHECK_OLD = Object.freeze({ ...CHECK, body: '#bdbec9', wing: '#d6d7df', head: '#b3b4c1', neckG: '#a9cfc6', neckP: '#cdb9dc', leg: '#c98a7a' });
  const OLDISH = OLD, RING = '#3fbf6f';
  const HEADS = Object.freeze({ stand: [9, -21], sit: [9, -17], peck: [14, -5], bow: [11, -12] });
  const TWIG = '#b98a5e', TWIG_DARK = '#8a6a52', RICE = '#fbf7ee', GLASS = '#bfe3f5';
  const faded = (alpha, draw) => { ctx.save(); ctx.globalAlpha = alpha; draw(); ctx.restore(); };
  /** (x, y)로 옮기고 a만큼 돌려 그린다 */
  const at3 = (x, y, a, draw) => { ctx.save(); ctx.translate(x, y); ctx.rotate(a); draw(); ctx.restore(); };

  /* ── 형체감 도구: 사물은 실루엣 하나에 왼쪽 위 빛으로 윗면(lit)·앞면(mid)·오른쪽 옆면(dark)만 나눈다.
     planes()는 forms.js, 점 형식은 curvy와 같다 (이 파일 좌표 그대로, 위가 -y) ── */
  function outline(pts) {
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (!i) ctx.moveTo(p[0], p[1]);
      else if (p.length === 2) ctx.lineTo(p[0], p[1]);
      else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
      else ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
    });
    ctx.closePath();
  }
  /** 실루엣 안쪽에만 칠한다 (면 나누기가 밖으로 삐지지 않게) */
  function inside(pts, draw) { ctx.save(); outline(pts); ctx.clip(); draw(); ctx.restore(); }
  /** 앞면 (x, y, w, h)에 뒤로 물러나는 윗면(빛)과 오른쪽 옆면(그늘)을 붙인 상자. d는 깊이 */
  function box3(t, c, x, y, w, h, d) {
    const p = planes(t, c), dy = d * .6;
    curvy([[x, y], [x + d, y - dy], [x + w + d, y - dy], [x + w, y]], p.lit);
    curvy([[x + w, y], [x + w + d, y - dy], [x + w + d, y + h - dy], [x + w, y + h]], p.dark);
    curvy([[x, y], [x + w, y], [x + w + .6, y + h * .5, x + w, y + h], [x, y + h], [x - .6, y + h * .5, x, y]], p.mid);
    return p;
  }
  /** 알 하나: 오른쪽 아래 그늘 위에 앞면, 왼쪽 위 작은 볕 */
  function egg(t, x, y, rx, ry, c) {
    const p = planes(t, c);
    E(x + rx * .18, y + ry * .1, rx, ry, p.dark); E(x - rx * .06, y - ry * .04, rx * .9, ry * .94, p.mid);
    E(x - rx * .32, y - ry * .38, rx * .32, ry * .26, p.lit);
  }

  /** 부스스하게 선 등깃: 끝이 둥근 깃 다발 */
  function ruffle(t, c, by, seed) {
    for (let i = 0; i < 5; i++) {
      const x = -8 + i * 3.2, h = 3 + hash(i, seed) * 2.5, lean = (hash(i, seed + 3) - .5) * 2;
      ctx.fillStyle = t(i % 2 ? c.wing : c.body); ctx.beginPath(); ctx.moveTo(x - 1.4, by - 5.5);
      ctx.quadraticCurveTo(x + lean - 1, by - 6 - h, x + lean, by - 6.5 - h); ctx.quadraticCurveTo(x + lean + 1.2, by - 6 - h, x + 1.6, by - 5.5); ctx.closePath(); ctx.fill();
    }
  }

  /** 몸통·꼬리·접은 날개(두 줄 날개띠)를 종이 세 겹으로 */
  function doveBody(time, t, c, by, o) {
    P([[-8, by - 1.5], [-20.5, by + .2], [-21.2, by + 4.4], [-8, by + 4]], t(c.dark));
    P([[-17.6, by - .2], [-20.5, by + .2], [-21.2, by + 4.4], [-18, by + 4.1]], t(shade(shade(c.dark))));
    const hull = (dy) => {
      ctx.beginPath(); ctx.moveTo(7, by - 6 + dy); ctx.bezierCurveTo(12.4, by - 3 + dy, 10.4, by + 7.4 + dy, 2, by + 7.6 + dy);
      ctx.bezierCurveTo(-5, by + 8 + dy, -10, by + 5 + dy, -11, by + 1 + dy); ctx.bezierCurveTo(-11, by - 5.4 + dy, -4, by - 8.6 + dy, 7, by - 6 + dy); ctx.closePath();
    };
    hull(1); ctx.fillStyle = t(shade(c.body)); ctx.fill();
    hull(0); ctx.fillStyle = t(c.body); ctx.fill();
    ctx.save(); hull(0); ctx.clip(); E(3, by + 4, 7.4, 3.8, t(c.belly)); ctx.restore();
    if (o.flap) {
      const up = Math.sin(time * 14 + (o.seed || 0)) * 4;
      ctx.fillStyle = t(c.wing); ctx.beginPath(); ctx.moveTo(4, by - 4);
      ctx.bezierCurveTo(2, by - 12, -3, by - 17 - up, -6 - o.flap * 2, by - 19 - up);
      for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(-6.5 - k * .8, by - 15 + k * 3 - up * (1 - k / 4), -8 + k * .6, by - 14 + k * 3.4 - up * (1 - k / 4));
      ctx.lineTo(-6, by - 2); ctx.closePath(); ctx.fill();
      L(-1, by - 9 - up * .4, -5, by - 7 - up * .3, t(c.dark), 1.1);
      return;
    }
    ctx.fillStyle = t(shade(c.wing)); ctx.beginPath(); ctx.moveTo(4, by - 5.4);
    ctx.bezierCurveTo(-2, by - 8, -10, by - 5, -16, by + 1.6); ctx.quadraticCurveTo(-8, by + 3.6, -3, by + 3); ctx.quadraticCurveTo(3, by + 2, 4, by - 5.4); ctx.fill();
    ctx.fillStyle = t(c.wing); ctx.beginPath(); ctx.moveTo(4, by - 5.4);
    ctx.bezierCurveTo(-2, by - 8, -9, by - 5, -12, by - .4); ctx.quadraticCurveTo(-6, by + 2.4, -2, by + 2.2); ctx.quadraticCurveTo(3, by + 1.4, 4, by - 5.4); ctx.fill();
    ctx.strokeStyle = t(c.dark); ctx.lineCap = 'round'; ctx.lineWidth = .8; ctx.beginPath();
    ctx.moveTo(-1.4, by - 4.6); ctx.quadraticCurveTo(-3, by - 1.6, -2.6, by + 1.6);
    ctx.moveTo(-5, by - 4); ctx.quadraticCurveTo(-6.6, by - 1.2, -6.4, by + 1.8); ctx.stroke();
    if (o.checker) checkerMarks(t, c, by);
    ctx.globalAlpha = .45; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(2.6, by - 6); ctx.quadraticCurveTo(-3, by - 7.4, -7, by - 4.6); ctx.stroke(); ctx.globalAlpha = 1;
  }

  /** 접은 날개 위 바둑판 무늬: 날개 실루엣 안에만 작은 마름모를 엇갈려 찍는다 */
  function checkerMarks(t, c, by) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(4, by - 5.4);
    ctx.bezierCurveTo(-2, by - 8, -9, by - 5, -12, by - .4); ctx.quadraticCurveTo(-6, by + 2.4, -2, by + 2.2); ctx.quadraticCurveTo(3, by + 1.4, 4, by - 5.4); ctx.clip();
    ctx.fillStyle = t(mix(c.dark, c.wing, .35));
    for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) {
      const x = -.6 - k * 3.4 + (r % 2) * 1.7, y = by - 3.8 + r * 2.8;
      ctx.beginPath(); ctx.moveTo(x, y - .9); ctx.lineTo(x + .9, y); ctx.lineTo(x, y + .9); ctx.lineTo(x - .9, y); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  /** 발목 초록 고리. loose면 가늘어진 다리에서 발등까지 흘러내려 있다 */
  function legRing(t, pose, loose) {
    const y = pose === 'sit' ? -1.2 : loose ? -.9 : -2.6;
    if (pose === 'sit') L(3, -2.4, 3.4, -.2, t(DOVE.leg), 1.2);
    RR(1.9, y - .8, 2.8, 1.6, .6, t(RING)); R(1.9, y - .8, 2.8, .5, t(mix(RING, '#ffffff', .4)));
  }

  /** 둥근 머리, 주황 눈테, 하얀 콧등(납막)이 붙은 짧은 부리 */
  function doveHead(time, t, c, hx, hy, seed) {
    E(hx + .5, hy + .6, 5, 4.8, t(shade(c.head))); E(hx, hy, 5, 4.8, t(c.head));
    ctx.globalAlpha = .4; E(hx - 1.4, hy - 2.4, 2.4, 1.1, '#ffffff'); ctx.globalAlpha = 1;
    E(hx + 1.7, hy - 1, 1.75, 1.85, t('#f2a65a'));
    cuteEye(hx + 1.7, hy - 1, 1.05, 1.2, time + seed, t);
    P([[hx + 4.2, hy - .9], [hx + 7.6, hy + .4], [hx + 4.4, hy + 1.1]], t('#6f6880'));
    L(hx + 4.4, hy + .2, hx + 7.2, hy + .45, t('#4e4860'), .3);
    E(hx + 4.9, hy - .8, 1, .6, t('#f1eef4'));
    blush(hx + 2, hy + 2.2, 1.3, .8);
  }

  function doveLegs(t, c) {
    const leg = t(c.leg);
    L(-1, -4, -1.6, -.4, leg, 1.4); L(3, -4, 3.4, -.4, leg, 1.4);
    [-1.6, 3.4].forEach((x) => { L(x, -.4, x + 1.8, 0, leg, .7); L(x, -.4, x + .6, .1, leg, .7); L(x, -.4, x - 1, 0, leg, .7); });
  }

  /** 비둘기 한 마리. o: { x, y, s, flip, pose: stand|sit|peck|bow, coat, puff, ruffle, flap, legs, seed, checker 바둑무늬, ring 초록 고리(true|'loose') } */
  function dove(time, t, o = {}) {
    const c = o.coat || DOVE, pose = o.pose || 'stand', seed = o.seed || 0, puff = o.puff || 1;
    const by = pose === 'sit' ? -8 : -11;
    const peck = pose === 'peck' ? Math.abs(Math.sin(time * 5 + seed)) * 4 : 0;
    const bow = pose === 'bow' ? Math.sin(time * 3 + seed) * 2.5 : 0;
    const [hx, hy0] = HEADS[pose], hy = hy0 - peck + bow;
    ctx.save(); ctx.translate(o.x || 0, o.y || 0); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose !== 'sit' && o.legs !== false) doveLegs(t, c);
    if (o.ring && o.legs !== false) legRing(t, pose, o.ring === 'loose');
    doveBody(time, t, c, by, o);
    if (o.ruffle) ruffle(t, c, by, seed);
    const nk = pose === 'bow' ? .25 : .5, nx = 6 + (hx - 6) * nk, ny = (by - 3) + (hy - by + 3) * nk + 1;
    E(nx + .6, ny + .8, 4.5 * puff, 4.5 * puff, t(shade(c.neckG)));
    E(nx, ny, 4.5 * puff, 4.5 * puff, t(c.neckG)); E(nx + .5, ny + 1.2 * puff, 3.8 * puff, 2 * puff, t(c.neckP));
    ctx.globalAlpha = .35; E(nx - 1.2 * puff, ny - 1.6 * puff, 1.8 * puff, .9 * puff, '#ffffff'); ctx.globalAlpha = 1;
    doveHead(time, t, c, hx, hy, seed);
    ctx.restore();
  }

  /** 얼기설기 엮은 나뭇가지 둥지 (cx, 바닥 y) */
  function nest(t, cx, y, w, seed) {
    const p = planes(t, TWIG), x0 = cx - w / 2, x1 = cx + w / 2, rim = y - 6, n = 10;
    const tips = Array.from({ length: n - 1 }, (_, k) => {
      const x = x1 - (k + 1) * w / n;
      return k % 2 ? [x, rim + .6] : [x + (hash(k, seed) - .5) * 2, rim - 2 - hash(k, seed + 1) * 2.4];
    });
    const shape = [[x0, rim - .6], [x0 - 2, y - 1.6, x0 + w * .16, y + .6, cx, y + .6], [x1 - w * .16, y + .6, x1 + 2, y - 1.6, x1, rim - .6], ...tips];
    L(x1 - 3, rim - 1, x1 + 5, rim - 4.4, p.dark, 1.1); L(x0 + 3, rim, x0 - 5, rim - 3, p.mid, 1.1);   // 삐져나온 잔가지
    curvy(shape, p.mid);
    inside(shape, () => {
      E(cx + w * .22, y + 1.4, w * .48, 5, p.dark);                                       // 오른쪽 아래로 도는 그늘
      curvy([[x0 - 3, rim - 6], [x1 + 3, rim - 6], [x1 + 3, rim - .4], [cx, rim + 2.4, x0 - 3, rim - .4]], p.lit);   // 볕 받는 테두리
    });
    E(cx, rim - .4, w * .32, 1.6, p.deep);                                                // 오목한 안쪽
    L(x0 + w * .2, y - 2, x0 + w * .55, y - 4.4, p.dark, .9); L(x0 + w * .5, y - 1.6, x0 + w * .8, y - 3.6, p.dark, .9);   // 엮인 가지 두 줄
  }

  /** 벽 받침대 위 실외기. 원점은 받침대 아래 */
  function acUnit(time, t, isRusty) {
    const S = planes(t, '#8d8a9c'), G = planes(t, '#c4bfcd'), pipe = planes(t, '#d8d3df');
    [-40, 34].forEach((x) => { R(x, -16, 6, 18, S.mid); R(x, -16, 2, 18, S.lit); });                // 앵글 다리
    R(-46, -18, 92, 3.6, S.mid); curvy([[-46, -18], [-43, -20.6], [49, -20.6], [46, -18]], S.lit); curvy([[46, -18], [49, -20.6], [49, -17], [46, -14.4]], S.dark);
    box3(t, '#ebe7ef', -40, -76, 74, 56, 6);
    E(-6, -47, 21, 21, G.dark); E(-5, -46, 18.4, 18.4, G.mid);                              // 오목하게 파인 팬 자리
    for (let k = 0; k < 3; k++) at3(-5, -46, time * 5 + k * TAU / 3, () => curvy([[1.6, -1.6], [6, -8, 13, -8], [16.4, -3, 15, 1.4], [9, 3, 1.6, 1.6]], G.lit));
    E(-5, -46, 3.4, 3.4, S.mid);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = pipe.mid; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(40, -38); ctx.lineTo(48, -38); ctx.quadraticCurveTo(52, -38, 52, -33); ctx.lineTo(52, 0); ctx.stroke();
    ctx.strokeStyle = pipe.lit; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(40, -39.2); ctx.lineTo(48, -39.2); ctx.quadraticCurveTo(50.8, -39.2, 50.8, -33); ctx.lineTo(50.8, 0); ctx.stroke();
    if (isRusty) [[-30, -24], [22, -70], [26, -26]].forEach(([x, y], i) => E(x, y, 3 + i, 2, t('#c98a5e')));
  }






  function scatter(t, o) {
    for (let i = 0; i < o.n; i++) {
      const x = o.x0 + hash(i, o.seed) * (o.x1 - o.x0);
      E(x, -.6, o.size, o.size * .6, t(o.colors[i % o.colors.length]));
    }
  }

  function notes(time, text, x, y, size) {
    const ph = (time * .5) % 1;
    ctx.save(); ctx.globalAlpha = 1 - ph; ctx.fillStyle = INK; ctx.font = `700 ${size}px sans-serif`;
    ctx.fillText(text, x + ph * 4, y - ph * 10); ctx.restore();
  }

  function breath(time, x, y) {
    for (let k = 0; k < 3; k++) {
      const ph = (time * .6 + k / 3) % 1;
      ctx.save(); ctx.globalAlpha = (1 - ph) * .7; E(x + ph * 10, y - ph * 10, 1.5 + ph * 3.5, 1.2 + ph * 2.5, WHITE); ctx.restore();
    }
  }

  /** 하늘이 비치는 투명 유리 한 판 */
  function skyGlass(time, x, y, w, h) {
    ctx.save(); ctx.globalAlpha = .32; RR(x, y, w, h, 4, GLASS); ctx.globalAlpha = .55;
    const drift = Math.sin(time * .3) * 6;
    E(x + w * .35 + drift, y + h * .25, w * .3, h * .06, WHITE); E(x + w * .65 + drift, y + h * .32, w * .22, h * .05, WHITE);
    ctx.globalAlpha = .4;
    P([[x + w * .1, y], [x + w * .28, y], [x + w * .6, y + h], [x + w * .42, y + h]], WHITE);
    ctx.restore();
  }



  /** 깃털·턱 끝에서 똑똑 떨어지는 물방울 (제자리에서 되풀이). from: [[x, y]], fall: 떨어지는 길이 */
  function drips(time, t, from, fall) {
    from.forEach(([x, y], i) => {
      const ph = (time * .7 + hash(i, 31)) % 1;
      faded((1 - ph) * .8, () => E(x, y + ph * fall, .7, 1.1, t(GLASS)));
    });
  }

  /** 자갈 하나: 오른쪽 아래 그늘, 왼쪽 위 볕. (x, 바닥에서 dy) */
  function pebble(t, x, r, dy = 0) {
    const p = planes(t, '#a8a2a0');
    E(x + r * .15, -r * .55 + dy, r, r * .62, p.dark); E(x, -r * .62 + dy, r * .9, r * .55, p.mid); E(x - r * .3, -r * .85 + dy, r * .4, r * .22, p.lit);
  }

  return {
    'pigeon:acNest': { w: 111, h: 104, d: (time, t) => {
      acUnit(time, t, false);
      nest(t, 2, -76, 50, 1);
      dove(time, t, { x: -12, y: -80, pose: 'sit', s: .7, coat: { ...DOVE, body: '#d9d2c4', wing: '#ece6d8', head: '#d0c8b8' }, ruffle: true, seed: 5 });
      dove(time, t, { x: 12, y: -78, pose: 'sit', seed: 2 });
      dove(time, t, { x: 34, y: -76, pose: 'stand', flip: true, seed: 3 });
    } },

    /* P1 옆집 실외기: 밤새 비를 맞고 떠는 바둑무늬 비둘기. 발목에 초록 고리, 깃털 끝에서 물방울이 떨어진다 */
    'pigeon:soakedRing': { w: 111, h: 104, d: (time, t) => {
      acUnit(time, t, false);
      ctx.save(); ctx.translate(Math.sin(time * 31) * .25, 0);
      dove(time, t, { x: 2, y: -77, pose: 'stand', coat: WET, checker: true, ring: true, ruffle: true, puff: .9, seed: 4 });
      ctx.restore();
      drips(time, t, [[-14, -78], [-6, -76], [36, -20]], 46);
      faded(.35, () => E(-4, -77.4, 16, 1.2, t(GLASS)));                                                       // 받침대에 고인 물
    } },

    /* P2 자갈 쪼는 애: 초록발이 자갈을 콩인 줄 알고 쪼았다가 뱉는다 */
    'pigeon:pebblePeck': { w: 70, h: 30, d: (time, t) => {
      [[-22, 0], [-14, 1], [20, 2], [27, 3], [33, 4]].forEach(([x, i]) => pebble(t, x, 1.6 + hash(i, 3) * 1.2));
      dove(time, t, { pose: 'peck', coat: CHECK, checker: true, ring: true, seed: 2 });
      const ph = (time * .9) % 1;                                                                              // 뱉은 자갈 하나가 앞으로 톡
      if (ph < .6) { const k = ph / .6; pebble(t, 15 + k * 12, 1.4, -5 + 4 * k * k - 6 * k * (1 - k)); }
      notes(time + .3, '퉤', 18, -16, 5);
    } },

    /* P3 출구 앞 토스트: 계란 붙은 토스트 반쪽과 부스러기 */
    'pigeon:toastDrop': { w: 40, h: 8, d: (time, t) => {
      faded(.2, () => E(0, -.3, 15, 1, t(INK)));
      const crust = planes(t, '#c98a4a'), crumb = planes(t, '#f1d9a8');
      const slice = [[-12, 0], [-13, -3.4, -10, -4.2], [8, -4.6], [12.6, -4.2, 13, -2], [12, 0]];
      curvy(slice, crust.mid);
      inside(slice, () => { R(-14, -6, 30, 1.6, crust.lit); R(10, -6, 6, 7, crust.dark); });
      const soft = [[-10, -.8], [-10.6, -3, -8, -3.4], [8, -3.6], [10.6, -3, 10, -.8]];
      curvy(soft, crumb.mid); inside(soft, () => E(-6, -3.4, 6, 1.2, crumb.lit));
      E(0, -3.6, 5.4, 1.4, t('#fbf7ee')); E(.8, -3.9, 2.4, .9, t('#ffc24a'));                                   // 계란
      scatter(t, { n: 9, x0: -22, x1: 22, seed: 21, size: .9, colors: ['#f1d9a8', '#c98a4a'] });
    } },
    /* P3 광장 가장자리에서 망설이는 초록발 */
    'pigeon:shyRing': { w: 44, h: 27, d: (time, t) => {
      dove(time, t, { pose: Math.sin(time * .7) > .6 ? 'bow' : 'stand', coat: CHECK, checker: true, ring: true, puff: 1.1, seed: 6 });
    } },

    /* B1 지하철 안: 휴대폰을 보는 엄마와, 비둘기를 가리키며 엄마 옷자락을 잡은 아이 */
    'pigeon:subwayKid': { w: 100, h: 175, d: (time, t) => {
      ctx.save(); ctx.translate(-22, 0);
      person(time, t, { h: 165, top: '#8f9ab8', bottom: '#4a4f63', hair: '#2f2a3a', arm: 'up' });
      const H = 165, hx = H * .15, hy = -H * .83 + Math.sin(time * 3) * H * .01;
      at3(hx + 2, hy - 4, -.25, () => { RR(-3, -6, 6, 11, 1.2, t('#2f2a3a')); RR(-2.2, -5, 4.4, 8, .8, t('#9fd0e6')); });
      ctx.restore();
      ctx.save(); ctx.translate(30, 0);
      person(time, t, { h: 108, top: '#ffd56b', bottom: '#5f8fb0', hair: '#2f2a3a', arm: 'out', handPose: 'flat',
        extra: (hy, r) => { E(-r * .9, hy - r * .7, r * .38, r * .34, t('#2f2a3a')); E(r * .2, hy - r * 1.05, r * .4, r * .3, t('#2f2a3a')); } });
      ctx.restore();
    } },
    /* B1 아이가 떨어뜨린 과자 */
    'pigeon:snackDrop': { w: 26, h: 5, d: (time, t) => {
      const c = planes(t, '#efcf8e');
      [[-6, 0, 0], [5, 1, .4]].forEach(([x, i, a]) => at3(x, -1.4, a, () => {
        E(.4, .4, 4.2, 1.6, c.dark); E(0, 0, 4.2, 1.6, c.mid); E(-1.2, -.5, 2, .6, c.lit);
      }));
      scatter(t, { n: 7, x0: -12, x1: 12, seed: 23, size: .7, colors: ['#efcf8e'] });
    } },

    /* P4 고가도로 밑: 철심이 줄지어 박힌 콘크리트 턱, 그 아래 비를 피하는 초록발 */
    'pigeon:spikeLedge': { w: 220, h: 86, d: (time, t) => {
      const cc = planes(t, '#b4b1aa'), D = 12, top = -66;
      curvy([[-80, top], [-80 + D, top - D * .6], [80 + D, top - D * .6], [80, top]], cc.lit);                // 턱 윗면
      curvy([[80, 0], [80, top], [80 + D, top - D * .6], [80 + D, -D * .6]], cc.dark);                         // 오른쪽 옆면
      const face = [[-80, 0], [-80, top], [80, top], [80.8, top * .5, 80, 0]];
      curvy(face, cc.mid);
      inside(face, () => { curvy([[-90, -20], [30, -6, 90, -30], [90, 4], [-90, 4]], t('#8c8983')); R(-80, top, 160, 3, cc.lit); });   // 아래쪽 빗물 얼룩
      R(-74, top - 4.4, 156, 1.6, t('#8d8a9c'));                                                               // 철심 띠
      ctx.strokeStyle = t('#d8dbe4'); ctx.lineWidth = .7; ctx.lineCap = 'round'; ctx.beginPath();
      for (let x = -70; x <= 78; x += 6) [-.45, 0, .45].forEach((a) => { ctx.moveTo(x, top - 4.4); ctx.lineTo(x + Math.sin(a) * 9, top - 4.4 - Math.cos(a) * 9); });
      ctx.stroke();
      dove(time, t, { x: -104, pose: 'stand', coat: WET, checker: true, ring: true, ruffle: true, puff: 1.15, seed: 9 });
      drips(time, t, [[-60, top], [10, top], [62, top]], -top - 2);
    } },
    /* P4 상판 밑 초록 그물: 한쪽에 구멍이 뚫렸다 */
    'pigeon:netHole': { w: 190, h: 70, d: (time, t) => {
      const sway = Math.sin(time * .8) * 1.5;
      const sheet = [[-92, -70], [92, -70], [92, -30], [40, sway, -10, sway], [-60, -6 + sway, -92, -30]];
      ctx.save(); outline(sheet);
      ctx.moveTo(18 + 13, -30); ctx.ellipse(18, -30, 13, 10, .2, 0, TAU);                                     // 구멍 (evenodd로 뚫는다)
      ctx.clip('evenodd');
      faded(.35, () => curvy(sheet, t('#4f8a5c')));
      ctx.strokeStyle = t('#3f7a4c'); ctx.lineWidth = .7; ctx.beginPath();
      for (let k = -100; k < 100; k += 6) { ctx.moveTo(k, -72); ctx.lineTo(k + 60, 2); ctx.moveTo(k + 60, -72); ctx.lineTo(k, 2); }
      ctx.stroke(); ctx.restore();
      ctx.strokeStyle = t('#3f7a4c'); ctx.lineWidth = 1; ctx.beginPath();                                       // 끊어진 그물코 끝
      for (let k = 0; k < 7; k++) { const a = k * TAU / 7, r1 = 12, r2 = 15 + hash(k, 5) * 3; ctx.moveTo(18 + Math.cos(a) * r1, -30 + Math.sin(a) * r1 * .8); ctx.lineTo(18 + Math.cos(a) * r2, -30 + Math.sin(a) * r2 * .8); }
      ctx.stroke();
      R(-94, -72, 188, 2.4, t('#5f5d66'));                                                                     // 그물을 건 줄
    } },

    /* P5 지하철 환기구: 철망 틈으로 올라오는 더운 바람, 그 위에 공처럼 부푼 비둘기들 */
    'pigeon:ventGrate': { w: 170, h: 40, d: (time, t) => {
      const cc = planes(t, '#a9a6a0'), grill = planes(t, '#6f7480');
      const box = [[-80, 0], [80, 0], [80, -12], [-80, -12]];
      curvy(box, cc.mid); inside(box, () => R(66, -14, 16, 16, cc.dark));
      curvy([[-80, -12], [80, -12], [84, -15], [-76, -15]], grill.mid);
      ctx.strokeStyle = grill.deep; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let x = -74; x < 80; x += 5) { ctx.moveTo(x, -12.4); ctx.lineTo(x + 3.6, -14.8); }
      ctx.stroke();
      ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = .8;                                                   // 일렁이는 더운 바람
      for (let i = 0; i < 6; i++) {
        const ph = (time * .4 + i / 6) % 1, x0 = -66 + i * 26;
        ctx.globalAlpha = Math.sin(ph * Math.PI) * .45; ctx.beginPath();
        for (let y = 0; y < 22; y += 2) ctx.lineTo(x0 + Math.sin(y * .5 + time * 3 + i) * 1.6, -16 - ph * 10 - y);
        ctx.stroke();
      }
      ctx.restore();
      [[-52, OLDISH, false, 1], [-26, DOVE, true, 3], [6, CHECK, false, 5], [30, DOVE, true, 7]].forEach(([x, coat, flip, seed]) =>
        dove(time, t, { x, y: -15, pose: 'sit', coat, checker: coat === CHECK, puff: 1.35, ruffle: true, flip, seed }));
      breath(time, 16, -34); breath(time + .5, -16, -34);
    } },

    /* P6 빙글빙글: 목을 부풀리고 꼬리를 끌며 절하는 초록발 */
    'pigeon:ringCourt': { w: 64, h: 41, d: (time, t) => {
      for (let k = 0; k < 4; k++) P([[-8, -9], [-24, -1 - k * 2.5], [-23, -4 - k * 2.5]], t(k % 2 ? CHECK.dark : CHECK.body));
      dove(time, t, { pose: 'bow', coat: CHECK, checker: true, ring: true, puff: 1.3, seed: 4 });
      notes(time, '구구', 16, -26, 7);
    } },

    /* S1 해 질 녘 광장 가장자리: 볼라드 위에서 남쪽을 보는 초록발 */
    'pigeon:duskWatch': { w: 50, h: 70, d: (time, t) => {
      const st = planes(t, '#c9c4bc'), post = [[-10, 0], [-10, -40], [-8, -46, 0, -46], [8, -46, 10, -40], [10, 0]];
      curvy(post, st.mid); inside(post, () => { R(4, -50, 8, 52, st.dark); R(-10, -50, 3, 52, st.lit); });
      R(-10, -16, 20, 3, t('#e8c24a'));                                                                        // 반사띠
      dove(time, t, { y: -45, pose: 'sit', coat: CHECK, checker: true, seed: 3 });
    } },

    /* P7 둥지 짓기: 실외기 위 덜 지은 둥지, 나뭇가지를 물고 온 초록발 */
    'pigeon:twigRelay': { w: 111, h: 112, d: (time, t) => {
      acUnit(time, t, false);
      nest(t, -10, -76, 34, 11);
      [[-30, -77, .2], [8, -76.6, -.4]].forEach(([x, y, a]) => at3(x, y, a, () => L(-6, 0, 6, 0, t(TWIG), 1)));   // 아직 안 깐 가지
      ctx.save(); ctx.translate(26, -77);
      dove(time, t, { pose: 'stand', coat: CHECK, checker: true, ring: true, seed: 8 });
      const [hx, hy0] = HEADS.stand;
      L(hx + 3, hy0 + 1.4, hx + 15, hy0 - 3, t(TWIG_DARK), 1.1); L(hx + 9, hy0 - 1, hx + 12, hy0 + 1.5, t(TWIG_DARK), .6);
      ctx.restore();
    } },

    /* P8 교대: 알 두 개 옆에서 고개를 숙이고 '비켜, 내 차례야' 하는 초록발 */
    'pigeon:shiftChange': { w: 111, h: 106, d: (time, t) => {
      acUnit(time, t, false);
      nest(t, -10, -76, 40, 12);
      egg(t, -15, -83, 3.2, 4, '#fbf7ee'); egg(t, -6, -83, 3.2, 4, '#f4efe4');
      dove(time, t, { x: 24, y: -77, pose: 'bow', coat: CHECK, checker: true, ring: true, flip: true, seed: 5 });
      notes(time, '콕콕', -2, -102, 5);
    } },

    /* P9 새끼 둘: 노란 솜털이 듬성한 새끼들과, 날개를 반쯤 펴고 막아선 초록발 */
    'pigeon:acSquabs': { w: 111, h: 110, d: (time, t) => {
      acUnit(time, t, false);
      nest(t, -14, -76, 40, 7);
      [[-21, 0], [-7, 1.3]].forEach(([x, seed]) => {
        const b = Math.abs(Math.sin(time * 6 + seed * 2)) * 1.6, y = -82;
        E(x, y - b, 6.5, 6, t('#e8d9a8')); E(x + 2, y - 7 - b, 4.2, 4, t('#e8d9a8'));
        [-2, 0, 2].forEach((k) => L(x + k, y - 10 - b, x + k * 1.6, y - 13 - b, t('#f5ecc8'), .6));
        cuteEye(x + 3.4, y - 8 - b, .8, 1, time + seed, t);
        P([[x + 5.5, y - 8 - b], [x + 9, y - 9 - b], [x + 5.5, y - 5.5 - b], [x + 8.6, y - 5 - b]], t('#6f6880'));
      });
      dove(time, t, { x: 26, y: -77, pose: 'stand', coat: CHECK, checker: true, ring: true, flap: 1, puff: 1.2, seed: 2 });
    } },
    /* P9 드르륵: 빗자루를 든 채 창밖으로 둥지를 내다보는 아주머니 */
    'pigeon:windowBroom': { w: 120, h: 160, d: (time, t) => {
      const fr = planes(t, '#e9e4dc'), room = t('#4a4458');
      R(-50, -156, 100, 146, fr.mid); R(-50, -156, 100, 4, fr.lit); R(46, -156, 4, 146, fr.dark);              // 창틀
      R(-44, -150, 88, 136, room);
      ctx.save(); ctx.beginPath(); ctx.rect(-44, -150, 88, 136); ctx.clip();
      ctx.save(); ctx.translate(-4, 52);
      person(time, t, { h: 160, top: '#c97b9c', bottom: '#6b5f7c', hair: '#4a3a3a', arm: 'out',
        extra: (hy, r) => E(-r * .6, hy - r * .9, r * .5, r * .42, t('#4a3a3a')) });
      ctx.restore();
      ctx.restore();
      const stick = planes(t, '#d08c62'), straw = planes(t, '#e8c24a'), hx = 31, hy = -49;              // 손에 쥔 빗자루 (솔이 위로)
      L(hx, hy + 18, hx + 8, hy - 70, stick.mid, 2.4); L(hx - .8, hy + 18, hx + 7.2, hy - 70, stick.lit, .8);
      const head = [[hx + 2, hy - 68], [hx + 14, hy - 68], [hx + 18, hy - 92], [hx + 11, hy - 95], [hx + 4, hy - 93], [hx - 2, hy - 90]];
      curvy(head, straw.mid); inside(head, () => P([[hx + 9, hy - 66], [hx + 20, hy - 66], [hx + 20, hy - 98], [hx + 12, hy - 98]], straw.dark));
      artHandAt(t, hx + 1, hy - 4, -1.45, 13, { pose: 'grip', sleeve: '#c97b9c' });
      R(-58, -14, 116, 6, fr.lit); R(-58, -8, 116, 4, fr.dark);                                                // 창턱
    } },

    /* D2 닫히는 문: 지하철 문 두 짝이 가운데로 모이고, 문틈에 깃털 하나 */
    'pigeon:screenDoor': { w: 140, h: 220, d: (time, t) => {
      const fr = planes(t, '#b9c1c6'), gap = Math.max(0, Math.sin(time * 1.5)) * 10;
      R(-70, -220, 140, 16, fr.mid); R(-70, -220, 140, 3, fr.lit); R(-70, -207, 140, 3, t('#3fa36b'));
      [-1, 1].forEach((d) => {
        const x0 = d < 0 ? -66 : gap / 2, w = 66 - gap / 2;
        R(x0, -204, w, 204, fr.mid);
        faded(.55, () => RR(x0 + 6, -190, w - 12, 120, 4, t('#cfe3ea')));
        R(d < 0 ? x0 + w - 3 : x0, -204, 3, 204, fr.dark);
      });
      at3(gap / 2, -60, .4, () => { P([[0, 0], [-3, -14], [0, -22], [3, -14]], t('#c5ccdc')); L(0, 2, 0, -20, t('#8b93ab'), .5); });
    } },
    /* D3 그물에 감긴 비둘기: 발가락과 날개가 그물코에 걸려 거꾸로 매달린다 */
    'pigeon:netTangle': { w: 70, h: 70, d: (time, t) => {
      L(0, -70, 0, -54, t('#5f5d66'), 1.2);
      const bag = [[-26, -56], [26, -56], [24, -24, 6, -8], [-6, -8], [-24, -24, -26, -56]];
      ctx.save(); outline(bag); ctx.clip();
      faded(.22, () => curvy(bag, t('#4f8a5c')));
      ctx.globalAlpha = .55; ctx.strokeStyle = t('#3f7a4c'); ctx.lineWidth = .5; ctx.beginPath();
      for (let k = -40; k < 30; k += 8) { ctx.moveTo(k, -56); ctx.lineTo(k + 30, -6); ctx.moveTo(k + 30, -56); ctx.lineTo(k, -6); }
      ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(0, -34); ctx.rotate(2.6 + Math.sin(time * 5) * .08);
      dove(time, t, { pose: 'stand', flap: .5, ruffle: true, seed: 3 });
      ctx.restore();
      ctx.save(); ctx.globalAlpha = .7; ctx.strokeStyle = t('#3f7a4c'); ctx.lineWidth = .6; ctx.beginPath();     // 몸을 감은 그물코 몇 가닥
      ctx.moveTo(-14, -40); ctx.quadraticCurveTo(0, -30, 14, -42); ctx.moveTo(-10, -26); ctx.quadraticCurveTo(2, -20, 12, -28); ctx.stroke(); ctx.restore();
    } },

    /* P10 빈손 할머니: 식빵 봉지를 넣은 주머니에 손을 넣고 광장을 지나간다 */
    'pigeon:pocketGrandma': { w: 60, h: 150, d: (time, t) => {
      person(time, t, { h: 150, top: '#c97b9c', bottom: '#6b5f7c', hair: '#c9c4cc', arm: 'down',
        extra: (hy, r) => E(-r * .7, hy - r * .8, r * .45, r * .4, t('#c9c4cc')) });
      const bread = planes(t, '#e9c48a');                                                                    // 주머니 밖으로 삐죽 나온 식빵 귀퉁이
      curvy([[4, -84], [5, -92, 10, -93], [14, -92, 14, -84]], bread.mid); R(4, -86, 10, 2, bread.dark);
      RR(0, -86, 18, 14, 3, t(shade('#c97b9c')));                                                             // 주머니
    } },

    /* D4 헤드라이트: 불빛을 정면으로 비추며 달려드는 배달 오토바이 */
    'pigeon:scooterGlare': { w: 170, h: 125, d: (time, t) => {
      ACTORS.scooter.d(time, t);
      ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = '#fff3b8';
      ctx.beginPath(); ctx.moveTo(50, -96); ctx.lineTo(300, -170); ctx.lineTo(300, -10); ctx.closePath(); ctx.fill();
      ctx.shadowColor = '#fff3b8'; ctx.shadowBlur = 30; ctx.globalAlpha = 1; E(50, -96, 8, 8, '#fffbe6'); ctx.restore();
    } },

    /* S1 반짝이는 수컷: 목을 부풀리고 꼬리를 끌며 절한다 */
    'pigeon:courtingMale': { w: 64, h: 41, d: (time, t) => {
      for (let k = 0; k < 4; k++) P([[-8, -9], [-24, -1 - k * 2.5], [-23, -4 - k * 2.5]], t(k % 2 ? '#8b93ab' : '#9aa3bb'));
      dove(time, t, { pose: 'bow', puff: 1.25, seed: 4 });
      const sheen = (Math.sin(time * 2) + 1) / 2;
      ctx.save(); ctx.globalAlpha = .45 * sheen; E(9, -14, 5, 3, '#9ff5e4'); ctx.globalAlpha = .45 * (1 - sheen); E(8, -12, 5, 2.5, '#e2c2ff'); ctx.restore();
      notes(time, '구구', 16, -26, 7);
    } },

    /* S1·D9 투명 방음벽: 하늘만 비치는 유리판 */
    'pigeon:noiseBarrier': { w: 314, h: 412, d: (time, t) => {
      const base = planes(t, '#a29fb2'), post = planes(t, '#7d7a8c');
      curvy([[-152, -36], [-148, -40], [156, -40], [152, -36]], base.lit);                                  // 콘크리트 턱 윗면
      R(-152, -36, 304, 36, base.mid); curvy([[152, -36], [156, -40], [156, -4], [152, 0]], base.dark);
      [-150, -50, 50].forEach((x) => skyGlass(time, x, -400, 100, 360));
      [-152, -52, 48, 148].forEach((x) => {                                                                 // H형강 기둥: 빛 받는 왼쪽 날개, 그늘진 오른쪽
        R(x - 3.5, -404, 8, 368, post.mid); R(x - 3.5, -404, 2.4, 368, post.lit); R(x + 2.6, -404, 1.9, 368, post.dark);
        curvy([[x - 4.5, -404], [x - 2.5, -407], [x + 6.5, -407], [x + 4.5, -404]], post.lit);
      });
    } },

    'pigeon:broomSwing': { w: 216, h: 137, d: (time, t) => {
      const a = -.5 + Math.sin(time * 6) * .45, vel = Math.cos(time * 6);
      ctx.save(); ctx.globalAlpha = .45 * Math.abs(vel); ctx.strokeStyle = WHITE; ctx.lineCap = 'round';
      [118, 126].forEach((r, i) => { ctx.lineWidth = 2.2 - i * .8; ctx.beginPath(); const b = a - Math.PI / 2; ctx.arc(0, 0, r, Math.min(b, b - vel * .5), Math.max(b, b - vel * .5)); ctx.stroke(); });
      ctx.restore();
      ctx.save(); ctx.rotate(a);
      const pole = planes(t, '#d08c62'), head = planes(t, '#e8c24a'), cap = planes(t, '#5f6476');
      RR(-1.8, -102, 3.6, 102, 1.8, pole.dark); RR(-1.8, -102, 2.6, 102, 1.3, pole.mid); RR(-1.8, -100, 1, 96, .5, pole.lit);
      RR(-2.4, -4, 4.8, 6, 2.4, cap.mid);
      curvy([[-9, -104], [9, -104], [8, -110], [-8, -110]], head.dark);                                      // 솔 몸통
      RR(-3, -106, 6, 4, 1.5, cap.mid);
      /* 부채처럼 퍼진 빗살: 실루엣 하나, 끝은 들쭉날쭉. 왼쪽 볕 · 오른쪽 그늘 */
      const fan = Math.sin(time * 6) * 1.2, tip = (u) => [u * 24 + fan * u, -131 - hash(Math.round((u + .5) * 8), 7) * 3];
      const bristle = [[-7.5, -109], [7.5, -109], tip(.5), ...[.375, .25, .125, 0, -.125, -.25, -.375, -.5].map(tip)];
      curvy(bristle, head.mid);
      inside(bristle, () => { P([[-8, -108], [-2.6, -108], [-6.6, -136], [-16, -136]], head.lit); P([[3.4, -108], [8, -108], [16, -136], [6.6, -136]], head.dark); });
      L(-.6, -110, -1.4, -128, head.dark, .5);                                                              // 빗살 갈래 한 줄
      artHandAt(t, 0, -10, 0, 11, { pose: 'grip', sleeve: '#5fa39a' });
      ctx.restore();
    } },

    /* P10 과태료 현수막: 두 기둥 사이에 걸린 현수막 */
    'pigeon:banBanner': { w: 252, h: 204, d: (time, t) => {
      const post = planes(t, '#7d7a8c'), cloth = planes(t, '#fbf7ee');
      [-124, 118].forEach((x) => { RR(x, -198, 6, 198, 3, post.mid); R(x + 4, -196, 2, 196, post.dark); R(x + .6, -196, 1.6, 196, post.lit); E(x + 3, -199, 3.6, 3.6, post.lit); });
      ctx.save(); ctx.translate(0, -165); ctx.transform(1, 0, Math.sin(time * 1.3) * .03, 1, 0, 0);
      const sheet = [[-118, -26], [118, -26], [117, 0, 118, 26], [60, 23, 0, 23.4], [-60, 23, -118, 26], [-117, 0, -118, -26]];   // 아래가 살짝 처진 천
      curvy(sheet, cloth.mid);
      inside(sheet, () => {
        R(-120, -26, 240, 6, t('#e6765f')); R(-120, 19, 240, 8, t('#e6765f'));
        P([[96, -26], [120, -26], [120, 28], [104, 28]], cloth.dark);                                         // 끈에 당겨 접힌 오른쪽 자락
      });
      ctx.fillStyle = t('#d24a4a'); ctx.font = '800 17px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('비둘기 먹이 주면 과태료', 14, 7); ctx.textAlign = 'left';
      E(-98, 0, 13, 13, t('#fbf7ee')); dove(time, t, { x: -100, y: 6, s: .55, seed: 9 });
      ctx.strokeStyle = t('#d24a4a'); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(-98, 0, 13, 0, TAU); ctx.moveTo(-107, -9); ctx.lineTo(-89, 9); ctx.stroke();
      ctx.restore();
    } },

    /* P10·D8 분홍 낟알: 이상한 색으로 물든 낟알과 찢긴 작은 봉지 */
    'pigeon:pinkGrain': { w: 89, h: 22.5, d: (time, t) => {
      scatter(t, { n: 46, x0: -42, x1: 42, seed: 13, size: 1.3, colors: ['#ff8fc0', '#6fd6c8', '#f5a3cf'] });
      const sack = planes(t, '#e9e4ec');                                                                      // 위가 찢긴 작은 종이 봉지
      const torn = [[26, 0], [42, 0], [42.6, -6, 42, -12], [39, -10], [37, -14.6], [34, -11.4], [31, -16], [28.6, -12], [26, -12.6], [25.4, -6, 26, 0]];
      curvy(torn, sack.mid);
      inside(torn, () => { R(24, -17, 4, 18, sack.lit); R(37.4, -17, 6, 18, sack.dark); R(24, -8, 20, 4, t('#ff8fc0')); });
      ctx.save(); ctx.globalAlpha = .45; ctx.strokeStyle = t('#93c29a'); ctx.lineWidth = 1;
      [-20, 0, 18].forEach((x, i) => {
        ctx.beginPath(); ctx.moveTo(x, -3);
        for (let y = -3; y > -22; y -= 3) ctx.lineTo(x + Math.sin(y * .5 + time * 3 + i) * 2, y);
        ctx.stroke();
      });
      ctx.restore();
    } },

    /* P11 남쪽: 태어난 골목 실외기 위, 늙은 나의 짝 초록발. 다리가 가늘어져 고리가 헐렁하다 */
    'pigeon:oldCoupleAc': { w: 110, h: 102, d: (time, t) => {
      acUnit(time * .3, t, true);
      nest(t, -22, -76, 26, 9);
      dove(time, t, { x: 14, y: -77, pose: 'stand', coat: CHECK_OLD, checker: true, ring: 'loose', ruffle: true, puff: 1.1, seed: 6 });
      [[-30, -2], [40, -1]].forEach(([x, y]) => E(x, y - 76, 3, .8, t('#e9e4ec')));
    } },

    /* D7 하늘의 그림자: 날개를 바짝 접고 발톱을 앞세워 내리꽂히는 매 */
    'pigeon:hawkDive': { w: 100, h: 91, d: (time, t) => {
      const back = '#6b4f3a', mid = '#8a6a52', belly = '#f0e2cc', jit = Math.sin(time * 18) * .04;
      ctx.save(); ctx.globalAlpha = .5; [-12, 0, 12].forEach((d) => L(-36 + d, -76 - d, -18 + d, -50 - d, WHITE, 1.5)); ctx.restore();
      ctx.save(); ctx.translate(2, -32); ctx.rotate(.85 + jit);
      P([[-12, -2.4], [-27, -4.6], [-28.4, 1.2], [-12, 2.6]], t(back));
      [-17, -21, -25].forEach((x) => L(x, -3.4 - (x + 12) * .12, x - .4, 2 - (x + 12) * .04, t('#4a3628'), 1));
      ctx.fillStyle = t(mid); ctx.beginPath(); ctx.moveTo(15, -4); ctx.bezierCurveTo(8, -7.4, -6, -6.6, -14, -2);
      ctx.quadraticCurveTo(-6, 4, 4, 5.6); ctx.bezierCurveTo(12, 6.4, 17, 2, 15, -4); ctx.fill();
      ctx.save(); ctx.clip(); ctx.fillStyle = t(belly); ctx.beginPath(); ctx.ellipse(4, 4, 12, 4.4, -.06, 0, TAU); ctx.fill();
      ctx.strokeStyle = t('#b99a7a'); ctx.lineWidth = .7; ctx.beginPath();
      for (let x = -6; x <= 10; x += 2.6) { ctx.moveTo(x, 1.6 + Math.abs(x) * .05); ctx.lineTo(x + 1.2, 2.2); } ctx.stroke(); ctx.restore();
      ctx.fillStyle = t(back); ctx.beginPath(); ctx.moveTo(10, -5.4); ctx.bezierCurveTo(2, -9, -14, -8, -31, -6.4);
      ctx.lineTo(-27, -4.6); ctx.lineTo(-29, -3.4); ctx.lineTo(-24, -2.6); ctx.quadraticCurveTo(-8, -1, 8, -1.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = t('#4a3628'); ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(6, -5); ctx.quadraticCurveTo(-8, -6, -22, -4.6); ctx.stroke();
      ctx.globalAlpha = .35; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(8, -6.6); ctx.quadraticCurveTo(-4, -8.4, -18, -6.8); ctx.stroke(); ctx.globalAlpha = 1;
      E(16.6, -2.4, 6, 5.2, t(back)); E(17.4, -1.6, 4.4, 3.8, t(mid));
      P([[16.6, -.4], [19.6, -1.4], [18.8, 3.6], [16.2, 2.6]], t('#4a3628'));
      E(20.4, -2.6, 1.7, 1.7, t('#ffd56b')); E(20.6, -2.6, 1, 1.1, t(INK)); E(20.9, -3, .35, .35, WHITE);
      ctx.fillStyle = t('#ffd56b'); ctx.beginPath(); ctx.moveTo(22, -3.6); ctx.lineTo(23.6, -3.2); ctx.lineTo(23.4, -1.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t('#3b3049'); ctx.beginPath(); ctx.moveTo(23.2, -3.4); ctx.quadraticCurveTo(26.4, -3, 25.6, .4); ctx.quadraticCurveTo(24.6, -1.4, 23.2, -1.2); ctx.closePath(); ctx.fill();
      ctx.restore();
      [[-3, 1.5], [3, 0]].forEach(([dx, dy]) => {
        L(4 + dx, -24 + dy, 10 + dx, -10 + dy, t('#ffd56b'), 2.2);
        ctx.strokeStyle = t(INK); ctx.lineWidth = .9; ctx.lineCap = 'round'; ctx.beginPath();
        [-1.4, 0, 1.4].forEach((k) => { ctx.moveTo(10 + dx, -10 + dy); ctx.quadraticCurveTo(11.6 + dx + k, -7.6 + dy, 10.4 + dx + k * 1.4, -6 + dy); });
        ctx.stroke();
      });
    } },
    /* D5 발가락의 실: 줄이 파고든 까만 발로 주저앉은 비둘기 */
    'pigeon:lineFoot': { w: 50, h: 22.5, d: (time, t) => {
      dove(time, t, { pose: 'sit', coat: OLD, ruffle: true, seed: 10 });
      E(8, -1.5, 3, 1.6, t('#3a3040'));
      ctx.strokeStyle = t('#d8ecf5'); ctx.lineWidth = .8; ctx.beginPath();
      ctx.ellipse(8, -1.5, 3.5, 1.4, .3, 0, TAU); ctx.ellipse(8.5, -1.5, 2.6, 2, -.2, 0, TAU);
      ctx.moveTo(11, -1); ctx.quadraticCurveTo(18, 2, 24, -1); ctx.stroke();
    } },
  };
})());
