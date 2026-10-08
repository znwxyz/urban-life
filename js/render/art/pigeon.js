/* 비둘기 장면 전용 그림. 키는 'pigeon:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수) */
(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})((() => {
  /* ── 공용 조각: 비둘기, 실외기, 벤치, 앉은 사람 ── */
  const DOVE = Object.freeze({ body: '#aeb6cb', dark: '#8b93ab', belly: '#c5ccdc', wing: '#d3d9e6', head: '#9aa3bb',
    neckG: '#7fd1c1', neckP: '#c9a3e6', beak: '#f2b48a', leg: '#e6765f' });
  const OLD = Object.freeze({ ...DOVE, body: '#bcc0cc', head: '#b0b4c1', wing: '#dcdee5', neckG: '#a9cfc6', neckP: '#cdb9dc', leg: '#c98a7a' });
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
  /** 타원 여러 개를 한 장으로 오린다 (겹친 자리에 종이 그림자 금이 생기지 않게). list: [[cx, cy, rx, ry]] */
  function clump(list, c) {
    ctx.beginPath(); list.forEach(([x, y, rx, ry]) => { ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); });
    ctx.fillStyle = c; ctx.fill();
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
  /** 가로로 누운 원기둥(배관): 윗띠는 빛, 아랫띠는 그늘 */
  function pipeRun(t, c, x, y, w, h) {
    const p = planes(t, c);
    RR(x, y, w, h, h / 2, p.mid);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.clip();
    R(x, y, w, h * .3, p.lit); R(x, y + h * .7, w, h * .3, p.dark); ctx.restore();
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
    ctx.globalAlpha = .45; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(2.6, by - 6); ctx.quadraticCurveTo(-3, by - 7.4, -7, by - 4.6); ctx.stroke(); ctx.globalAlpha = 1;
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

  /** 비둘기 한 마리. o: { x, y, s, flip, pose: stand|sit|peck|bow, coat, puff, ruffle, flap, legs, seed } */
  function dove(time, t, o = {}) {
    const c = o.coat || DOVE, pose = o.pose || 'stand', seed = o.seed || 0, puff = o.puff || 1;
    const by = pose === 'sit' ? -8 : -11;
    const peck = pose === 'peck' ? Math.abs(Math.sin(time * 5 + seed)) * 4 : 0;
    const bow = pose === 'bow' ? Math.sin(time * 3 + seed) * 2.5 : 0;
    const [hx, hy0] = HEADS[pose], hy = hy0 - peck + bow;
    ctx.save(); ctx.translate(o.x || 0, o.y || 0); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose !== 'sit' && o.legs !== false) doveLegs(t, c);
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

  /** 공원 벤치: 위가 밝은 판자 세 장, 등받이 뒤로 이어진 무쇠 다리 */
  function bench(t) {
    const W = planes(t, '#d08c62'), F = planes(t, '#4a4f63');
    [-64, 64].forEach((x) => R(x - 2.5, -88, 5, 42, F.dark));                                  // 등받이 기둥
    [[-70, 7], [-84, 7]].forEach(([y, h]) => { RR(-80, y, 160, h, 1.6, W.mid); R(-80, y, 160, 2, W.lit); R(78, y, 2, h, W.dark); });
    [-64, 64].forEach((x) => {                                                                // 앞으로 휜 다리와 발
      const leg = [[x - 4, -44], [x + 4, -44], [x + 3, -14, x + 4.6, -3], [x + 8, 0], [x - 8, 0], [x - 4.6, -3], [x - 3, -14, x - 4, -44]];
      curvy(leg, F.mid); inside(leg, () => R(x - 9, -44, 6.6, 44, F.lit));
    });
    curvy([[-80, -44], [-76, -49], [80, -49], [80, -44]], W.lit);                              // 앉는 판 윗면
    curvy([[-80, -44], [80, -44], [80.6, -42, 80, -40], [-80, -40], [-80.6, -42, -80, -44]], W.mid);
    R(76, -44, 4, 4, W.dark);
  }

  /** 벤치에 앉은 사람. 오른쪽을 본다. hand는 팔 끝 위치 */
  function sitter(time, t, o) {
    const x = o.x, sway = Math.sin(time * 1.4) * .8, hy = -122 + sway;
    RR(x - 8, -60, 34, 13, 6, t(o.bottom)); RR(x + 17, -52, 11, 48, 5, t(shade(o.bottom)));
    RR(x + 15, -6, 19, 6, 3, t(INK));
    RR(x - 14, -108 + sway, 28, 56, 13, t(o.top));
    E(x + 2, hy, 12, 13, t(SKIN));
    o.hair(x, hy);
    E(x + 8, hy, 1.3, 1.6, t(INK)); blush(x + 9, hy + 5, 2.2, 1.2);
    ctx.strokeStyle = t(o.top); ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + 2, -98 + sway); ctx.lineTo(o.hand[0], o.hand[1]); ctx.stroke();
    const ang = Math.atan2(o.hand[1] - (-98 + sway), o.hand[0] - (x + 2));
    artHandOnArm(t, o.hand[0], o.hand[1], ang, 14, { pose: o.handPose || 'grip' });
  }

  /** 비닐 쌀 봉지 (cx, 바닥 y). full 1이면 쌀이 차서 불룩하고, 0이면 비어 납작하게 주저앉는다 */
  function riceBag(t, cx, y, full) {
    const p = planes(t, '#eef2fa'), h = 6 + full * 14, x = cx - 13;
    const bag = [[x + 1, y], [x - 1, y - h * .6, x + 6, y - h], [x + 7, y - h - 4], [x + 9.6, y - h - 1.4], [x + 13, y - h + .4],
      [x + 16.4, y - h - 3.6], [x + 19, y - h - .6], [x + 27, y - h * .6, x + 26, y], [x + 13, y + .8, x + 1, y]];
    faded(.82, () => {
      curvy(bag, p.mid);
      inside(bag, () => {
        if (full) E(cx, y - h * .3, 10.4, h * .32, t(RICE));                                  // 비쳐 보이는 쌀
        curvy([[x + 17, y + 2], [x + 22, y - h * .5, x + 18, y - h - 4], [x + 30, y - h], [x + 30, y + 2]], p.dark);
        E(x + 6, y - h * .62, 3, h * .22, p.lit);
      });
    });
  }

  /** 손에 쥔 과자 봉지 (왼쪽 아래 x, 바닥 y): 톱니 모양으로 눌러 붙인 윗단, 가운데 띠 */
  function snackBag(t, x, y) {
    const p = planes(t, '#f2a65a');
    const bag = [[x, y], [x + 12, y], [x + 13, y - 8, x + 12.4, y - 15], [x + 11, y - 16.4], [x + 9.4, y - 15.2], [x + 7.6, y - 16.4],
      [x + 6, y - 15.2], [x + 4.4, y - 16.4], [x + 2.8, y - 15.2], [x + 1.2, y - 16.4], [x - .4, y - 15], [x - 1, y - 8, x, y]];
    curvy(bag, p.mid);
    inside(bag, () => { R(x - 2, y - 17, 4.4, 18, p.lit); R(x + 8.6, y - 17, 5, 18, p.dark); R(x - 2, y - 11, 16, 4, t('#e6765f')); });
  }

  /** 시간에 따라 손에서 땅으로 포물선을 그리며 떨어지는 알갱이 */
  function falling(time, t, o) {
    for (let i = 0; i < o.n; i++) {
      const ph = (time * o.speed + i / o.n) % 1, reach = o.reach * (.6 + hash(i, o.seed) * .6);
      const x = o.hx + reach * ph, y = o.hy * (1 - ph * ph) - o.lift * ph * (1 - ph);
      E(x, y, o.size, o.size * .65, t(o.color));
    }
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

  function soaringHawk(time, t) {
    const flap = Math.sin(time * 2) * 3;
    P([[-14, -2], [-30, -8], [-30, 4]], t('#6b4f3a'));
    P([[-10, -4], [8, -4], [-6, -34 - flap], [-14, -30 - flap]], t('#6b4f3a'));
    E(0, 0, 16, 6.5, t('#8a6a52')); E(2, 2, 10, 3.5, t('#f0e2cc'));
    P([[-8, -3], [10, -3], [20, -30 + flap], [10, -32 + flap]], t('#7a5a3e'));
    E(15, -4, 6, 5.5, t('#7a5a3e'));
    P([[20, -5], [25, -3], [21, -1]], t('#ffd56b'));
    E(17, -5.5, 1.1, 1.2, t(INK)); E(17.4, -6, .4, .4, WHITE);
  }

  return {
    /* P1 첫 비행: 빌라 3층 실외기 받침 위 나뭇가지 둥지, 엄마아빠와 형제 */
    'pigeon:acNest': { w: 111, h: 104, d: (time, t) => {
      acUnit(time, t, false);
      nest(t, 2, -76, 50, 1);
      dove(time, t, { x: -12, y: -80, pose: 'sit', s: .7, coat: { ...DOVE, body: '#d9d2c4', wing: '#ece6d8', head: '#d0c8b8' }, ruffle: true, seed: 5 });
      dove(time, t, { x: 12, y: -78, pose: 'sit', seed: 2 });
      dove(time, t, { x: 34, y: -76, pose: 'stand', flip: true, seed: 3 });
    } },

    /* P2 모이 주는 할머니: 벤치에서 비닐봉지 쌀을 한 줌씩 흩뿌린다 */
    'pigeon:riceGrandma': { w: 243, h: 143, d: (time, t) => {
      bench(t);
      const hand = [32, -92 + Math.sin(time * 3) * 7];
      sitter(time, t, { x: -14, top: '#c97b9c', bottom: '#6b5f7c', hand, handPose: 'flat',
        hair: (x, hy) => { E(x - 2, hy - 6, 13, 9, t('#c9c4cc')); E(x - 10, hy - 12, 6, 5.5, t('#c9c4cc')); } });
      riceBag(t, 8, -56, 1);
      scatter(t, { n: 10, x0: 4, x1: 12, seed: 4, size: 1.1, colors: [RICE] });
      falling(time, t, { n: 22, speed: .7, hx: hand[0], hy: hand[1], reach: 80, lift: 50, size: 1.3, color: RICE, seed: 2 });
    } },
    /* P2 서른 마리가 우르르: 쌀 무더기에 머리를 박은 비둘기들 */
    'pigeon:riceRush': { w: 177, h: 34, d: (time, t) => {
      scatter(t, { n: 40, x0: -80, x1: 80, seed: 7, size: 1.2, colors: [RICE, '#efe6d2'] });
      [[-62, 0, false], [-30, 1, true], [4, 2, false], [36, 3, false], [66, 4, true]].forEach(([x, seed, flip]) =>
        dove(time, t, { x, pose: seed === 3 ? 'stand' : 'peck', flap: seed === 3 ? 1 : 0, flip, seed }));
    } },
    /* P2 하늘을 빙빙 도는 매. 땅에 그림자가 미리 떨어진다 */
    'pigeon:hawkCircle': { w: 130, h: 55, d: (time, t) => {
      const a = time * .6, ox = Math.cos(a) * 40, oy = Math.sin(a) * 8;
      ctx.save(); ctx.globalAlpha = .14; E(ox, 518, 26, 4, '#2a2240'); ctx.restore();
      ctx.save(); ctx.globalAlpha = .25; ctx.setLineDash([4, 6]); ctx.strokeStyle = WHITE; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(0, -20, 50, 10, 0, 0, TAU); ctx.stroke(); ctx.restore();
      ctx.save(); ctx.translate(ox, -20 + oy); ctx.rotate(Math.sin(a) * .12); soaringHawk(time, t); ctx.restore();
    } },

    /* P3 엉킨 실: 낚싯줄과 머리카락이 칭칭 감긴 식빵 귀퉁이 */
    'pigeon:tangledBread': { w: 95, h: 14, d: (time, t) => {
      faded(.2, () => E(0, -.4, 18, 1.2, t(INK)));
      const crust = planes(t, '#b97a3c'), crumb = planes(t, '#efd2a0');
      curvy([[-12, 0], [-14, -6, -9, -10.8], [3, -14, 15, -10.6], [18.4, -6, 17.4, 0]], crust.dark);            // 뒤로 보이는 두께
      const face = [[-15, 0], [-17, -6, -12, -10.6], [0, -13.4, 12, -10.4], [16.4, -6, 14.6, 0]];
      curvy(face, crust.mid);
      inside(face, () => curvy([[-18, 0], [-18, -14], [16, -14], [2, -11.6, -9, -9], [-13.4, -5, -14, 0]], crust.lit));   // 볕 받는 왼쪽 위 껍질
      const soft = [[-11, -1.4], [-12.4, -5.6, -9.4, -8], [-4, -7.2], [-1, -8.6], [3, -7.4], [9, -7.8], [11.4, -5, 10.4, -1.4]];
      curvy(soft, crumb.mid);
      inside(soft, () => { E(-8, -7, 7, 3.4, crumb.lit); E(12, 0, 6, 6, crumb.dark); });
      [[-4, -4], [3, -3.2]].forEach(([x, y]) => E(x, y, .7, .45, crumb.dark));                                  // 빵 구멍 두 개
      ctx.lineCap = 'round';
      ctx.strokeStyle = t('#d8ecf5'); ctx.lineWidth = .8; ctx.beginPath();
      for (let k = 0; k < 4; k++) ctx.ellipse(-1 + k * 2.6, -5, 15 - k * 2, 4.4 + k, .25 * k - .3, 0, TAU);
      ctx.moveTo(14, -1); ctx.bezierCurveTo(26, 3, 30, -6, 42 + Math.sin(time * 1.5) * 2, -1.6);
      ctx.stroke();
      ctx.strokeStyle = t('#3a3040'); ctx.lineWidth = .6; ctx.beginPath();
      ctx.moveTo(-34, -1); ctx.bezierCurveTo(-20, -14, -6, 4, 6, -11); ctx.bezierCurveTo(12, -16, 20, -2, 30, -6);
      ctx.moveTo(-26, -.5); ctx.quadraticCurveTo(-12, -8, 2, -1);
      ctx.stroke();
      E(44, -1.6, 2.6, 1.6, t('#e6765f')); E(44, -2.4, 2.6, .8, t('#fbf7ee')); L(44, -4, 44, -6.4, t('#3a3040'), .4);
    } },
    /* P3 발가락 없는 형: 줄에 감겨 발가락을 잃고 절뚝거린다 */
    'pigeon:toelessPigeon': { w: 44, h: 27, d: (time, t) => {
      const limp = Math.max(0, Math.sin(time * 3)) * 2;
      ctx.save(); ctx.rotate(-limp * .03);
      L(-1, -4, -2, 0, t(OLD.leg), 1.4); L(-2, 0, 1, 0, t(OLD.leg), 1);
      L(3, -4, 3.5, -1.5, t(OLD.leg), 1.4); E(3.6, -1.4, 1.3, 1, t('#8a5a5a'));
      dove(time, t, { pose: 'stand', coat: OLD, legs: false, ruffle: true, seed: 8 });
      ctx.restore();
    } },

    /* P4 편의점 앞 겨울: 따뜻하게 빛나는 간판과 그 위 턱, 입김 */
    'pigeon:cvsSign': { w: 254, h: 106, d: (time, t) => {
      const ledge = planes(t, '#8d8a9c');
      ctx.save(); ctx.shadowColor = '#ffd98a'; ctx.shadowBlur = 40;
      curvy([[-110, -64], [104, -64], [104, -6], [-110, -6]], '#fff4d6'); ctx.restore();       // 빛나는 앞면
      curvy([[104, -64], [110, -67], [110, -9], [104, -6]], t('#e9d6a6'));                        // 간판통 옆면
      RR(-110, -22, 214, 7, 0, '#5fa8d8'); RR(-110, -15, 214, 5, 0, '#7fd1a0'); RR(-110, -10, 214, 4, 0, '#f2a65a');
      ctx.fillStyle = t('#3b3049'); ctx.font = '700 22px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('편의점 24시', -3, -32); ctx.textAlign = 'left';
      curvy([[-116, -68], [-112, -72], [116, -72], [116, -68]], ledge.lit);                      // 비둘기가 앉는 턱 윗면
      curvy([[-116, -68], [116, -68], [116, -64], [-116, -64]], ledge.mid); R(112, -68, 4, 4, ledge.dark);
      ctx.save(); ctx.globalAlpha = .35 + Math.sin(time * 2) * .1; RR(-112, -74, 224, 3, 1.5, '#ffb86b'); ctx.restore();
      dove(time, t, { x: -40, y: -72, pose: 'sit', puff: 1.3, ruffle: true, seed: 1 });
      dove(time, t, { x: -16, y: -72, pose: 'sit', puff: 1.3, ruffle: true, flip: true, seed: 6 });
      breath(time, -26, -92); breath(time + .4, -5, -92);
    } },
    /* P4 문 앞 부스러기: 한 입 베어 문 삼각김밥과 뜯긴 비닐, 흩어진 밥알, 서리 */
    'pigeon:crumbDoor': { w: 60, h: 13.5, d: (time, t) => {
      ctx.save(); ctx.translate(-14, 0); ctx.rotate(-.12);
      ctx.globalAlpha = .75; ctx.fillStyle = t('#e9f1f5'); ctx.beginPath(); ctx.moveTo(-9, 0); ctx.lineTo(-1, -9); ctx.lineTo(2, -5.4);
      ctx.lineTo(.6, -4.6); ctx.lineTo(3.2, -3.4); ctx.lineTo(1.6, -2); ctx.lineTo(6, 0); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      L(-7.6, -.6, -1.4, -7.6, t('#e6765f'), 1.1);
      RR(-5.4, -3.6, 4, 2.4, .6, t('#7fb08a')); RR(-5, -3.2, 2, .6, .3, t('#fff3d8'));
      ctx.globalAlpha = .8; L(-3, -7.2, 0, -4.6, '#ffffff', .5); ctx.globalAlpha = 1;
      ctx.restore();
      ctx.save(); ctx.translate(6, 0);
      const rice = () => { ctx.beginPath(); ctx.moveTo(-8, -.2); ctx.quadraticCurveTo(-9, 0, -8.4, -1.4); ctx.lineTo(-1.6, -12.4);
        ctx.quadraticCurveTo(-.6, -13.6, .4, -12.4); ctx.quadraticCurveTo(-.4, -9.6, 2.2, -8.2); ctx.quadraticCurveTo(4.6, -7.6, 5, -5.6);
        ctx.lineTo(7.4, -1.4); ctx.quadraticCurveTo(8, 0, 6.6, 0); ctx.closePath(); };
      const R3 = planes(t, RICE), W3 = planes(t, '#3f4a3a');
      ctx.save(); ctx.translate(1.4, -.6); rice(); ctx.fillStyle = R3.dark; ctx.fill(); ctx.restore();       // 뒤로 보이는 두께
      rice(); ctx.fillStyle = R3.mid; ctx.fill();
      ctx.save(); rice(); ctx.clip();
      P([[-9, 0], [-2, -14], [-1, -6], [-5, 0]], R3.lit);                                                   // 볕 받는 왼쪽 모
      RR(-7, -5, 15, 5.2, .4, W3.mid); R(-7, -5, 15, 1, W3.lit); ctx.restore();                             // 김 띠
      E(.8, -9.2, 1.4, .7, t('#f2a65a'));
      ctx.restore();
      scatter(t, { n: 22, x0: -30, x1: 30, seed: 9, size: 1.2, colors: [RICE, '#efe6d2'] });
      ctx.save(); ctx.globalAlpha = .6 + Math.sin(time * 4) * .3;
      [[-24, -3], [22, -5], [28, -2]].forEach(([x, y]) => { L(x - 1.5, y, x + 1.5, y, WHITE, .5); L(x, y - 1.5, x, y + 1.5, WHITE, .5); });
      ctx.restore();
    } },
    /* D4 헤드라이트: 불빛을 정면으로 비추며 달려드는 배달 오토바이 */
    'pigeon:scooterGlare': { w: 170, h: 125, d: (time, t) => {
      ACTORS.scooter.d(time, t);
      ctx.save(); ctx.globalAlpha = .55; ctx.fillStyle = '#fff3b8';
      ctx.beginPath(); ctx.moveTo(50, -96); ctx.lineTo(300, -170); ctx.lineTo(300, -10); ctx.closePath(); ctx.fill();
      ctx.shadowColor = '#fff3b8'; ctx.shadowBlur = 30; ctx.globalAlpha = 1; E(50, -96, 8, 8, '#fffbe6'); ctx.restore();
    } },

    /* P5 목덜미의 무지갯빛: 목을 부풀리고 꼬리를 끌며 절하는 수컷 */
    'pigeon:courtingMale': { w: 64, h: 41, d: (time, t) => {
      for (let k = 0; k < 4; k++) P([[-8, -9], [-24, -1 - k * 2.5], [-23, -4 - k * 2.5]], t(k % 2 ? '#8b93ab' : '#9aa3bb'));
      dove(time, t, { pose: 'bow', puff: 1.25, seed: 4 });
      const sheen = (Math.sin(time * 2) + 1) / 2;
      ctx.save(); ctx.globalAlpha = .45 * sheen; E(9, -14, 5, 3, '#9ff5e4'); ctx.globalAlpha = .45 * (1 - sheen); E(8, -12, 5, 2.5, '#e2c2ff'); ctx.restore();
      notes(time, '구구', 16, -26, 7);
    } },
    /* P5 화단 씨앗: 배고픈 눈에 들어오는 흙 위의 씨앗들 */
    'pigeon:seedPatch': { w: 72, h: 20, d: (time, t) => {
      const soil = planes(t, '#8a6a52'), mound = [[-36, 0], [-30, -5.4, -12, -7], [0, -7.4], [14, -7, 30, -5.4, 36, 0]];
      curvy(mound, soil.mid);
      inside(mound, () => { curvy([[-40, -2.6], [-20, -4.4, 0, -4.6, 22, -3.4], [22, -9], [-40, -9]], soil.lit); E(36, 1, 18, 5, soil.dark); });
      [[-20, 9], [-4, 14], [14, 11], [26, 8]].forEach(([x, h], i) => {
        L(x, -2, x + Math.sin(time * 1.5 + i) * 1.5, -h, t('#6a9c78'), 1.2);
        E(x + Math.sin(time * 1.5 + i) * 1.5, -h, 3, 1.6, t('#93c29a'));
      });
      E(-4 + Math.sin(time * 1.5 + 1) * 1.5, -16, 3.5, 3.5, t('#ffd56b'));
      scatter(t, { n: 18, x0: -30, x1: 30, seed: 11, size: 1, colors: ['#d39d4c', '#5f4a3a', '#e8c088'] });
    } },

    /* S1 할아버지: 벤치에서 과자 부스러기를 떨어뜨린다 */
    'pigeon:grandpaBench': { w: 163, h: 141, d: (time, t) => {
      bench(t);
      const hand = [30, -76 + Math.sin(time * 2) * 2];
      sitter(time, t, { x: -12, top: '#8a6a52', bottom: '#5f6f86', hand,
        hair: (x, hy) => { E(x - 1, hy - 6, 13, 8, t('#e9e4ec')); RR(x - 13, hy - 15, 26, 8, 4, t('#4a5d7a')); RR(x + 6, hy - 10, 12, 3, 1.5, t('#4a5d7a')); } });
      snackBag(t, hand[0] - 2, hand[1]);
      falling(time, t, { n: 8, speed: .45, hx: hand[0] + 4, hy: hand[1], reach: 20, lift: 0, size: 1.6, color: '#e8c088', seed: 5 });
      scatter(t, { n: 14, x0: 20, x1: 60, seed: 12, size: 1.5, colors: ['#e8c088', '#d39d4c'] });
    } },
    /* S1 큰길 건너 분수대: 누군가 구구거리며 기다린다 */
    'pigeon:fountain': { w: 159, h: 79, d: (time, t) => {
      const st = planes(t, '#c9c4cc'), wall = [[-78, -26], [78, -26], [78, -6, 72, 0], [-72, 0], [-78, -6, -78, -26]];
      curvy(wall, st.mid);
      inside(wall, () => curvy([[30, 2], [52, -12, 58, -28], [80, -28], [80, 2]], st.dark));                  // 둥글게 돌아가는 그늘
      E(0, -26, 78, 9, st.lit); E(2, -26.6, 70, 6, t('#7fb8d2')); E(0, -27.4, 66, 4.6, t('#9fd0e6'));      // 테두리 윗면과 물
      const col = [[-7, -26], [-4.6, -44, -5, -60], [5, -60], [4.6, -44, 7, -26]];
      curvy(col, st.mid); inside(col, () => R(1.4, -62, 8, 38, st.dark));
      curvy([[-22, -64], [22, -64], [14, -57, 0, -56.6], [-14, -57, -22, -64]], st.mid); E(0, -64, 22, 4.4, st.lit);
      ctx.strokeStyle = '#d8f0fa'; ctx.lineWidth = 1.5; ctx.globalAlpha = .8;
      [-1, 1].forEach((d) => { ctx.beginPath(); ctx.moveTo(0, -70); ctx.quadraticCurveTo(d * 28, -92, d * 48, -30); ctx.stroke(); });
      ctx.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const ph = (time * .8 + i / 6) % 1; E((i % 2 ? 1 : -1) * 48 * ph, -70 - 20 * Math.sin(ph * Math.PI) + 40 * ph, 1.2, 1.2, WHITE); }
      dove(time, t, { x: 52, y: -26, pose: 'bow', puff: 1.5, flip: true, seed: 7 });
      notes(time + .5, '구구', 30, -50, 8);
    } },
    /* S1 투명 방음벽: 하늘만 비치는 유리판 (D10 가해자이기도 하다) */
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

    /* P6 필로티 천장 배관 위: 어둡지만 비바람이 안 드는 둥지와 알 두 개 */
    'pigeon:pilotisPipes': { w: 229, h: 61, d: (time, t) => {
      const slab = planes(t, '#cfcad8');
      R(-112, -60, 224, 11, slab.mid); R(-112, -60, 224, 3, slab.lit); R(-112, -49, 224, 5, slab.dark);      // 천장 앞모서리와 아랫면
      ctx.save(); ctx.globalAlpha = .25; R(-110, -44, 220, 26, '#2a2240'); ctx.restore();
      [-80, 0, 80].forEach((x) => { L(x, -44, x, -18, t('#7d7a8c'), 1.5); RR(x - 3, -21, 6, 3, 1, t('#7d7a8c')); });
      pipeRun(t, '#9aa3bb', -112, -20, 224, 10); pipeRun(t, '#e8c24a', -112, -8, 224, 8);
      L(60, -44, 60, -30, t('#3b3049'), 1); E(60, -30, 2, 2, t('#3b3049'));
      nest(t, 20, -20, 40, 3);
      egg(t, 14, -27, 3.2, 4, '#fbf7ee'); egg(t, 23, -27, 3.2, 4, '#f4efe4');
    } },
    /* P6 흔들리는 화단 나무: 넓지만 휑한 가지, 바람에 출렁이는 잎 덩어리, 가지 끝 둥지 자리 */
    'pigeon:swayTree': { w: 213, h: 351, d: (time, t) => {
      const bark = '#8a6a52', barkD = shade(bark), sway = Math.sin(time * 1.2) * .04;
      faded(.2, () => E(0, -1, 40, 4, t(INK)));
      ctx.fillStyle = t(barkD); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-8, -6, -8, -40); ctx.lineTo(-6, -205); ctx.lineTo(7, -205); ctx.lineTo(9, -40); ctx.quadraticCurveTo(10, -6, 16, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(bark); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-7, -6, -7, -40); ctx.lineTo(-5.5, -205); ctx.lineTo(3, -205); ctx.lineTo(4, -40); ctx.quadraticCurveTo(4, -6, 8, 0); ctx.closePath(); ctx.fill();
      E(-1, -110, 2.6, 3.4, t(barkD));
      ctx.save(); ctx.translate(0, -200); ctx.rotate(sway);
      const limb = (pts, w) => { ctx.strokeStyle = t(bark); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      limb([[0, 0], [30, -22], [62, -36]], 7); limb([[0, -6], [-26, -30], [-54, -46]], 6); limb([[0, -2], [4, -50], [-6, -86]], 6);
      limb([[30, -22], [42, -52]], 3.5); limb([[-26, -30], [-36, -66]], 3); limb([[62, -36], [86, -32]], 2.6);
      /* 잎 덩어리: 한 실루엣(그늘) 위에 앞면을 조금 왼쪽 위로 얹고, 위쪽 덩어리만 볕을 받는다 */
      const leaf = planes(t, '#7fb08a'), blobs = [[-62, -60, 34], [-30, -92, 42], [8, -112, 44], [40, -84, 40], [70, -58, 30], [-10, -62, 30], [24, -54, 26]];
      const wob = (i) => Math.sin(time * 1.6 + i) * 1.5;
      clump(blobs.map(([x, y, r], i) => [x + 3 + wob(i), y + 4, r, r * .72]), leaf.dark);
      clump(blobs.map(([x, y, r], i) => [x - 1 + wob(i), y - 1.4, r * .96, r * .68]), leaf.mid);
      clump(blobs.map(([x, y, r], i) => [x - r * .2 + wob(i), y - r * .22, r * .66, r * .42]).filter((b, i) => blobs[i][1] < -80), leaf.lit);
      nest(t, 84, -30, 22, 6);
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        const ph = (time * .25 + i / 3) % 1;
        faded(Math.sin(ph * Math.PI) * .8, () => at3(40 + i * 18 + Math.sin(ph * 6 + i) * 10, -230 + ph * 220, ph * 6, () => E(0, 0, 3, 1.6, t('#93c29a'))));
      }
    } },
    /* D5 까치: 둥지를 덮치는 까치와 깨진 알 */
    'pigeon:magpieRaid': { w: 102, h: 63, d: (time, t) => {
      nest(t, 0, 0, 40, 4);
      egg(t, -6, -7, 3.2, 4, '#fbf7ee');
      const shell = planes(t, '#fbf7ee');                                                                   // 깨진 껍데기: 바깥은 밝고 안쪽은 그늘
      P([[4, -5], [6, -9], [7.4, -7], [9, -9.6], [10, -4], [6, -3]], shell.mid); P([[6, -9], [7.4, -7], [9, -9.6], [9.4, -6], [6.4, -6.4]], shell.dark);
      ctx.save(); ctx.translate(-8, -16 - Math.abs(Math.sin(time * 6)) * 4);
      P([[-6, -14], [-24, -38 - Math.sin(time * 10) * 8], [6, -18]], t('#2f2a3a'));
      bird(time, t, { h: 26, body: '#2f2a3a', dark: '#2f2a3a', belly: '#f4f1ea', tail: 1.6, seed: 1, beak: .16 });
      ctx.restore();
    } },

    /* P7 사다리: 빗자루와 그물을 들고 둥지를 올려다보는 사람 */
    'pigeon:ladderBroom': { w: 136, h: 331, d: (time, t) => {
      const al = planes(t, '#a29fb2'), stick = planes(t, '#d08c62'), straw = planes(t, '#e8c24a'), net = planes(t, '#e9e4ec');
      ctx.lineCap = 'butt';
      for (let k = 1; k < 9; k++) { const f = k / 9; L(-40 + 60 * f, -230 * f, -22 + 60 * f, -230 * f, al.dark, 2.2); }   // 디딤대
      L(-22, 0, 38, -230, al.mid, 3.6); L(-40, 0, 20, -230, al.mid, 3.6);                                    // 기둥 두 개: 앞면 + 빛 받는 왼쪽 모
      L(-41.4, 0, 18.6, -230, al.lit, 1.2); L(-23.4, 0, 36.6, -230, al.lit, 1.2);
      [-40, -22].forEach((x) => RR(x - 3.4, -2.6, 6.8, 2.6, 1, t('#4a4f63')));                               // 고무 발
      ctx.save(); ctx.translate(-8, -102);
      person(time, t, { h: 165, top: '#5fa39a', bottom: '#5f6f86', hair: '#2f2a3a', arm: 'up' });
      const hx = 25, hy = -137 + Math.sin(time * 3) * 2;
      L(hx, hy, hx + 34, hy - 70, stick.mid, 2.5); L(hx - .8, hy - .4, hx + 33.2, hy - 70.4, stick.lit, .8);
      const head = [[hx + 31, hy - 66], [hx + 34, hy - 72], [hx + 48, hy - 87], [hx + 50, hy - 82], [hx + 52, hy - 68]];   // 비스듬한 빗자루 솔
      curvy(head, straw.mid); inside(head, () => P([[hx + 40, hy - 64], [hx + 48, hy - 90], [hx + 56, hy - 80], [hx + 56, hy - 64]], straw.dark));
      ctx.restore();
      ctx.save(); ctx.translate(-30, -70); ctx.rotate(Math.sin(time * 2) * .1);
      L(0, 0, 0, 31.4, t('#8d8a9c'), 1.5);
      const bag = [[-10, 34], [-9, 48, -2, 54], [2, 54.4], [9, 48, 10, 34]];                                  // 테에 매달려 처진 그물 자루
      faded(.6, () => { curvy(bag, net.mid); inside(bag, () => R(3, 30, 10, 30, net.dark)); });
      ctx.strokeStyle = net.dark; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(-8, 38); ctx.quadraticCurveTo(0, 46, 8, 38); ctx.stroke();
      ctx.lineWidth = 1.6; ctx.strokeStyle = net.lit; ctx.beginPath(); ctx.ellipse(0, 34, 10, 2.6, 0, Math.PI, TAU); ctx.stroke();
      ctx.strokeStyle = net.dark; ctx.beginPath(); ctx.ellipse(0, 34, 10, 2.6, 0, 0, Math.PI); ctx.stroke();
      ctx.restore();
    } },
    /* P7 삑삑거리는 새끼 둘: 배관 위 둥지에서 입을 벌린다 */
    'pigeon:squabs': { w: 72, h: 45, d: (time, t) => {
      pipeRun(t, '#9aa3bb', -35, -6, 70, 8);
      nest(t, 0, -6, 40, 7);
      [[-7, 0], [7, 1.3]].forEach(([x, seed]) => {
        const b = Math.abs(Math.sin(time * 6 + seed * 2)) * 2;
        E(x, -14 - b, 6.5, 6, t('#e8d9a8')); E(x + 2, -21 - b, 4.2, 4, t('#e8d9a8'));
        [-2, 0, 2].forEach((k) => L(x + k, -24 - b, x + k * 1.6, -27 - b, t('#f5ecc8'), .6));
        cuteEye(x + 3.4, -22 - b, .8, 1, time + seed, t);
        P([[x + 5.5, -22 - b], [x + 9, -23 - b - b], [x + 5.5, -19.5 - b], [x + 9, -18.5 - b]], t('#f2b48a'));
      });
      notes(time, '삑', 10, -30, 6); notes(time + .5, '삑', -14, -30, 6);
    } },
    /* D6 빗자루: 겁먹은 사람이 쥐고 휘두르는 플라스틱 빗자루. 빗살이 부채처럼 퍼지고 바람결이 남는다 */
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

    /* P8 먹이 주기 금지: 두 기둥 사이에 걸린 현수막 */
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
      ctx.fillText('비둘기 먹이 주기 금지', 14, 7); ctx.textAlign = 'left';
      E(-98, 0, 13, 13, t('#fbf7ee')); dove(time, t, { x: -100, y: 6, s: .55, seed: 9 });
      ctx.strokeStyle = t('#d24a4a'); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(-98, 0, 13, 0, TAU); ctx.moveTo(-107, -9); ctx.lineTo(-89, 9); ctx.stroke();
      ctx.restore();
    } },
    /* P8 빈 벤치: 할머니가 앉던 자리에 빈 쌀 봉지만 (D7 가해자이기도 하다) */
    'pigeon:emptyBench': { w: 163, h: 86, d: (time, t) => {
      bench(t);
      at3(-30, -49, Math.sin(time * 2.5) * .15, () => riceBag(t, 0, 0, 0));
      [[40, 0], [-50, 1], [70, 2]].forEach(([x, i]) => E(x, -.6, 4, 1.3, t(i % 2 ? '#d39d4c' : '#b98a5e')));
    } },

    /* P9 낯선 낟알: 이상한 색으로 물든 낟알과 찢긴 작은 봉지 */
    'pigeon:poisonGrain': { w: 89, h: 22.5, d: (time, t) => {
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
    /* P9 벌써 먹고 있는 무리: 머리를 박은 둘과 비틀거리는 하나 */
    'pigeon:peckers': { w: 117, h: 34, d: (time, t) => {
      scatter(t, { n: 24, x0: -55, x1: 55, seed: 14, size: 1.2, colors: ['#ff8fc0', '#6fd6c8'] });
      dove(time, t, { x: -36, pose: 'peck', seed: 1 }); dove(time, t, { x: -4, pose: 'peck', flip: true, seed: 2 });
      ctx.save(); ctx.translate(36, 0); ctx.rotate(Math.sin(time * 2.2) * .18);
      dove(time, t, { pose: 'stand', ruffle: true, seed: 3 });
      ctx.restore();
      for (let k = 0; k < 3; k++) { const a = time * 3 + k * TAU / 3; E(45 + Math.cos(a) * 6, -30 + Math.sin(a) * 2, 1.2, 1.2, t('#ffd56b')); }
    } },

    /* P10 무거운 날개: 태어난 그 실외기 위, 깃털이 부스스한 늙은 짝 */
    'pigeon:oldCoupleAc': { w: 110, h: 102, d: (time, t) => {
      acUnit(time * .3, t, true);
      nest(t, -18, -76, 26, 9);
      dove(time, t, { x: 4, y: -76, pose: 'sit', coat: OLD, ruffle: true, puff: 1.2, seed: 2 });
      dove(time, t, { x: 26, y: -76, pose: 'sit', coat: OLD, ruffle: true, flip: true, seed: 6 });
      ctx.save(); ctx.globalAlpha = .6 + Math.sin(time * 2) * .2; E(15, -98, 2, 2, t(BLUSH)); E(17.5, -98, 2, 2, t(BLUSH)); P([[13.2, -97.4], [19.3, -97.4], [16.2, -94]], t(BLUSH)); ctx.restore();
      [[-30, -2], [40, -1]].forEach(([x, y]) => E(x, y - 76, 3, .8, t('#e9e4ec')));
    } },
    /* P10 새로 생긴 통유리 건물: 나무와 하늘이 비친다 (D9 가해자이기도 하다) */
    'pigeon:glassTower': { w: 265, h: 612, d: (time, t) => {
      const frame = planes(t, '#8fa3b8');
      R(-130, -592, 244, 592, frame.mid);                                                                     // 정면
      curvy([[114, -592], [130, -600], [130, -8], [114, 0]], frame.dark);                                    // 그늘진 옆면
      curvy([[-130, -592], [-114, -600], [130, -600], [114, -592]], frame.lit);                              // 볕 받는 옥상 테
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) skyGlass(time + r + c, -124 + c * 79, -586 + r * 97.6, 75, 93);
      faded(.35, () => { for (let r = 0; r < 6; r++) curvy([[117, -584 + r * 97.6], [127, -589 + r * 97.6], [127, -501 + r * 97.6], [117, -496 + r * 97.6]], t(GLASS)); });
      ctx.save(); ctx.globalAlpha = .5;
      E(-60, -120, 50, 40, t('#7fb08a')); E(-20, -150, 40, 32, t('#93c29a')); E(70, -90, 36, 30, t('#7fb08a'));
      ctx.restore();
    } },

    /* D2 하늘의 그림자: 날개를 바짝 접고 발톱을 앞세워 내리꽂히는 매 */
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
    /* D3 발가락의 실: 줄이 파고든 까만 발로 주저앉은 비둘기 */
    'pigeon:lineFoot': { w: 50, h: 22.5, d: (time, t) => {
      dove(time, t, { pose: 'sit', coat: OLD, ruffle: true, seed: 10 });
      E(8, -1.5, 3, 1.6, t('#3a3040'));
      ctx.strokeStyle = t('#d8ecf5'); ctx.lineWidth = .8; ctx.beginPath();
      ctx.ellipse(8, -1.5, 3.5, 1.4, .3, 0, TAU); ctx.ellipse(8.5, -1.5, 2.6, 2, -.2, 0, TAU);
      ctx.moveTo(11, -1); ctx.quadraticCurveTo(18, 2, 24, -1); ctx.stroke();
    } },
  };
})());
