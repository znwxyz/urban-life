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
    E(cx, y - 3, w / 2, 5, t(TWIG_DARK)); E(cx, y - 4, w / 2 - 2, 3.5, t(TWIG));
    for (let i = 0; i < 9; i++) {
      const x = cx - w / 2 + hash(i, seed) * w, a = (hash(i, seed + 1) - .5) * 1.2, l = 6 + hash(i, seed + 2) * 8;
      L(x - Math.cos(a) * l / 2, y - 4 - Math.sin(a) * l / 2, x + Math.cos(a) * l / 2, y - 4 + Math.sin(a) * l / 2, t(i % 2 ? TWIG : TWIG_DARK), 1);
    }
  }

  /** 벽 받침대 위 실외기. 원점은 받침대 아래 */
  function acUnit(time, t, isRusty) {
    RR(-40, -16, 5, 18, 2, t('#7d7a8c')); RR(35, -16, 5, 18, 2, t('#7d7a8c')); RR(-46, -18, 92, 4, 2, t('#8d8a9c'));
    block(-40, -76, 80, 58, '#ece8ef', t);
    E(-6, -47, 21, 21, t('#c9c4d2')); E(-6, -47, 17, 17, t('#b5afc0'));
    for (let k = 0; k < 3; k++) {
      ctx.save(); ctx.translate(-6, -47); ctx.rotate(time * 5 + k * TAU / 3); E(8, 0, 9, 3.5, t('#9a94a8')); ctx.restore();
    }
    E(-6, -47, 3.5, 3.5, t('#7d7a8c'));
    ctx.strokeStyle = t('#d8d3df'); ctx.lineWidth = .8;
    [8, 13, 18].forEach((r) => { ctx.beginPath(); ctx.arc(-6, -47, r, 0, TAU); ctx.stroke(); });
    RR(40, -40, 14, 4, 2, t('#d8d3df')); RR(50, -40, 4, 40, 2, t('#d8d3df'));
    if (isRusty) [[-30, -20], [22, -70], [26, -24]].forEach(([x, y], i) => E(x, y, 3 + i, 2, t('#c98a5e')));
  }

  function bench(t) {
    R(-68, -45, 7, 45, t('#4a4f63')); R(61, -45, 7, 45, t('#4a4f63'));
    [[-48, 8], [-70, 7], [-84, 7]].forEach(([y, h]) => RR(-80, y, 160, h, 2, t('#d08c62')));
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
      ctx.save(); ctx.globalAlpha = .75;
      E(8, -66, 13, 10, '#f4f8ff'); ctx.restore();
      ctx.strokeStyle = t('#d6dbe6'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(4, -78, 4, 5, 0, 0, TAU); ctx.stroke();
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
      ctx.fillStyle = t('#a9692f'); ctx.beginPath(); ctx.moveTo(-15, 0); ctx.quadraticCurveTo(-17, -6, -12, -10.6);
      ctx.quadraticCurveTo(0, -13.4, 12, -10.4); ctx.quadraticCurveTo(16.4, -6, 14.6, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t('#c98a4a'); ctx.beginPath(); ctx.moveTo(-14, -.6); ctx.quadraticCurveTo(-15.6, -6, -11.4, -9.8);
      ctx.quadraticCurveTo(0, -12.4, 11.4, -9.6); ctx.quadraticCurveTo(14.6, -6, 13.4, -.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t('#f3dcae'); ctx.beginPath(); ctx.moveTo(-11, -1.4); ctx.quadraticCurveTo(-12.4, -5.6, -9.4, -8);
      ctx.lineTo(-4, -7.2); ctx.lineTo(-1, -8.6); ctx.lineTo(3, -7.4); ctx.lineTo(9, -7.8); ctx.quadraticCurveTo(11.4, -5, 10.4, -1.4); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 10; i++) E(-8 + hash(i, 4) * 16, -2.4 - hash(i, 5) * 4.6, .5, .35, t('#e3c48e'));
      faded(.5, () => E(-6, -10.6, 4, .6, WHITE));
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
      ctx.save(); ctx.shadowColor = '#ffd98a'; ctx.shadowBlur = 40;
      RR(-110, -64, 220, 58, 8, '#fff4d6'); ctx.restore();
      RR(-110, -22, 220, 7, 0, '#5fa8d8'); RR(-110, -15, 220, 5, 0, '#7fd1a0'); RR(-110, -10, 220, 4, 0, '#f2a65a');
      ctx.fillStyle = t('#3b3049'); ctx.font = '700 22px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('편의점 24시', 0, -32); ctx.textAlign = 'left';
      RR(-116, -72, 232, 8, 3, t('#8d8a9c'));
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
      ctx.save(); ctx.translate(.6, .4); rice(); ctx.fillStyle = t(shade(RICE)); ctx.fill(); ctx.restore();
      rice(); ctx.fillStyle = t(RICE); ctx.fill();
      ctx.save(); rice(); ctx.clip(); RR(-6, -5, 10, 5.2, .4, t('#3f4a3a')); ctx.globalAlpha = .35; L(-5, -4.2, 3, -4.2, '#9fb69a', .5); ctx.restore();
      for (let i = 0; i < 9; i++) E(-5 + hash(i, 3) * 9, -6.2 - hash(i, 4) * 4 + Math.abs(hash(i, 3) * 9 - 4.6) * .4, .55, .3, t(i % 2 ? '#efe6d2' : '#ffffff'));
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
      E(0, 0, 35, 6, t('#8a6a52'));
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
      RR(hand[0] - 2, hand[1] - 16, 12, 16, 3, t('#f2a65a')); RR(hand[0] - 2, hand[1] - 11, 12, 4, 0, t('#e6765f'));
      falling(time, t, { n: 8, speed: .45, hx: hand[0] + 4, hy: hand[1], reach: 20, lift: 0, size: 1.6, color: '#e8c088', seed: 5 });
      scatter(t, { n: 14, x0: 20, x1: 60, seed: 12, size: 1.5, colors: ['#e8c088', '#d39d4c'] });
    } },
    /* S1 큰길 건너 분수대: 누군가 구구거리며 기다린다 */
    'pigeon:fountain': { w: 159, h: 79, d: (time, t) => {
      RR(-78, -26, 156, 26, 8, t('#c9c4cc')); E(0, -26, 78, 9, t('#dcd8e0')); E(0, -27, 70, 6, t('#9fd0e6'));
      RR(-6, -64, 12, 38, 4, t('#c9c4cc')); E(0, -64, 22, 5, t('#dcd8e0'));
      ctx.strokeStyle = '#d8f0fa'; ctx.lineWidth = 1.5; ctx.globalAlpha = .8;
      [-1, 1].forEach((d) => { ctx.beginPath(); ctx.moveTo(0, -70); ctx.quadraticCurveTo(d * 28, -92, d * 48, -30); ctx.stroke(); });
      ctx.globalAlpha = 1;
      for (let i = 0; i < 6; i++) { const ph = (time * .8 + i / 6) % 1; E((i % 2 ? 1 : -1) * 48 * ph, -70 - 20 * Math.sin(ph * Math.PI) + 40 * ph, 1.2, 1.2, WHITE); }
      dove(time, t, { x: 52, y: -26, pose: 'bow', puff: 1.5, flip: true, seed: 7 });
      notes(time + .5, '구구', 30, -50, 8);
    } },
    /* S1 투명 방음벽: 하늘만 비치는 유리판 (D10 가해자이기도 하다) */
    'pigeon:noiseBarrier': { w: 314, h: 412, d: (time, t) => {
      RR(-152, -40, 304, 40, 4, t('#a29fb2'));
      [-150, -50, 50].forEach((x) => skyGlass(time, x, -400, 100, 360));
      [-152, -52, 48, 148].forEach((x) => RR(x - 3, -404, 7, 368, 3, t('#7d7a8c')));
    } },

    /* P6 필로티 천장 배관 위: 어둡지만 비바람이 안 드는 둥지와 알 두 개 */
    'pigeon:pilotisPipes': { w: 229, h: 61, d: (time, t) => {
      RR(-112, -60, 224, 16, 3, t('#cfcad8'));
      ctx.save(); ctx.globalAlpha = .25; R(-110, -44, 220, 26, '#2a2240'); ctx.restore();
      [-80, 0, 80].forEach((x) => L(x, -44, x, -18, t('#7d7a8c'), 1.5));
      RR(-112, -20, 224, 10, 5, t('#9aa3bb')); RR(-112, -8, 224, 8, 4, t('#e8c24a'));
      L(60, -44, 60, -30, t('#3b3049'), 1); E(60, -30, 2, 2, t('#3b3049'));
      nest(t, 20, -20, 40, 3);
      E(14, -27, 3.2, 4, t('#fbf7ee')); E(23, -27, 3.2, 4, t('#f4efe4'));
      E(13, -28.5, .9, 1.2, WHITE);
    } },
    /* P6 흔들리는 화단 나무: 넓지만 휑한 가지, 바람에 출렁이는 잎 덩어리, 가지 끝 둥지 자리 */
    'pigeon:swayTree': { w: 213, h: 351, d: (time, t) => {
      const bark = '#8a6a52', barkD = shade(bark), sway = Math.sin(time * 1.2) * .04;
      faded(.2, () => E(0, -1, 40, 4, t(INK)));
      ctx.fillStyle = t(barkD); ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-8, -6, -8, -40); ctx.lineTo(-6, -205); ctx.lineTo(7, -205); ctx.lineTo(9, -40); ctx.quadraticCurveTo(10, -6, 16, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(bark); ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(-7, -6, -7, -40); ctx.lineTo(-5.5, -205); ctx.lineTo(3, -205); ctx.lineTo(4, -40); ctx.quadraticCurveTo(4, -6, 8, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = t(barkD); ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath();
      [[-3, -30, -2, -60], [1, -90, 0, -120], [-4, -140, -3, -170], [2, -50, 3, -72]].forEach(([a, b, c, d]) => { ctx.moveTo(a, b); ctx.quadraticCurveTo(a + 2, (b + d) / 2, c, d); });
      ctx.stroke();
      E(-1, -110, 2.6, 3.4, t(barkD));
      ctx.save(); ctx.translate(0, -200); ctx.rotate(sway);
      const limb = (pts, w) => { ctx.strokeStyle = t(bark); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); };
      limb([[0, 0], [30, -22], [62, -36]], 7); limb([[0, -6], [-26, -30], [-54, -46]], 6); limb([[0, -2], [4, -50], [-6, -86]], 6);
      limb([[30, -22], [42, -52]], 3.5); limb([[-26, -30], [-36, -66]], 3); limb([[62, -36], [86, -32]], 2.6);
      const blob = (x, y, r, i) => {
        const c = i % 3 === 0 ? '#7fb08a' : i % 3 === 1 ? '#93c29a' : '#6a9c78', wob = Math.sin(time * 1.6 + i) * 1.5;
        E(x + 3, y + 4, r, r * .72, t(shade(c))); E(x + wob, y, r, r * .72, t(c));
        faded(.35, () => E(x - r * .35 + wob, y - r * .3, r * .4, r * .2, t(mix(c, '#ffffff', .5))));
      };
      [[-62, -60, 34], [-30, -92, 42], [8, -112, 44], [40, -84, 40], [70, -58, 30], [-10, -62, 30], [24, -54, 26]].forEach(([x, y, r], i) => blob(x, y, r, i));
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
      E(-6, -6, 3.2, 4, t('#fbf7ee')); P([[4, -5], [9, -9], [10, -4], [6, -3]], t('#fbf7ee'));
      ctx.save(); ctx.translate(-8, -16 - Math.abs(Math.sin(time * 6)) * 4);
      P([[-6, -14], [-24, -38 - Math.sin(time * 10) * 8], [6, -18]], t('#2f2a3a'));
      bird(time, t, { h: 26, body: '#2f2a3a', dark: '#2f2a3a', belly: '#f4f1ea', tail: 1.6, seed: 1, beak: .16 });
      ctx.restore();
    } },

    /* P7 사다리: 빗자루와 그물을 들고 둥지를 올려다보는 사람 */
    'pigeon:ladderBroom': { w: 136, h: 331, d: (time, t) => {
      L(-40, 0, 20, -230, t('#a29fb2'), 3); L(-22, 0, 38, -230, t('#a29fb2'), 3);
      for (let k = 1; k < 9; k++) { const f = k / 9; L(-40 + 60 * f, -230 * f, -22 + 60 * f, -230 * f, t('#a29fb2'), 2); }
      ctx.save(); ctx.translate(-8, -102);
      person(time, t, { h: 165, top: '#5fa39a', bottom: '#5f6f86', hair: '#2f2a3a', arm: 'up' });
      const hx = 25, hy = -137 + Math.sin(time * 3) * 2;
      L(hx, hy, hx + 34, hy - 70, t('#d08c62'), 2.5);
      P([[hx + 30, hy - 68], [hx + 46, hy - 84], [hx + 50, hy - 66]], t('#e8c24a'));
      ctx.restore();
      ctx.save(); ctx.translate(-30, -70); ctx.rotate(Math.sin(time * 2) * .1);
      L(0, 0, 0, 24, t('#8d8a9c'), 1.5); ctx.strokeStyle = t('#e9e4ec'); ctx.lineWidth = .8;
      ctx.beginPath(); ctx.ellipse(0, 34, 10, 10, 0, 0, TAU); ctx.moveTo(-10, 34); ctx.lineTo(10, 34); ctx.moveTo(0, 24); ctx.lineTo(0, 44); ctx.stroke();
      ctx.restore();
    } },
    /* P7 삑삑거리는 새끼 둘: 배관 위 둥지에서 입을 벌린다 */
    'pigeon:squabs': { w: 72, h: 45, d: (time, t) => {
      RR(-35, -6, 70, 8, 4, t('#9aa3bb'));
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
      const pole = '#d08c62', head = '#e8c24a';
      RR(-1.8, -102, 3.6, 102, 1.8, t(shade(pole))); RR(-1.8, -102, 2.6, 102, 1.3, t(pole));
      ctx.globalAlpha = .5; RR(-1.2, -98, .8, 80, .4, WHITE); ctx.globalAlpha = 1;
      RR(-2.4, -4, 4.8, 6, 2.4, t('#5f6476'));
      ctx.fillStyle = t(shade(head)); ctx.beginPath(); ctx.moveTo(-9, -104); ctx.lineTo(9, -104); ctx.lineTo(8, -110); ctx.lineTo(-8, -110); ctx.closePath(); ctx.fill();
      RR(-3, -106, 6, 4, 1.5, t('#5f6476'));
      ctx.strokeStyle = t(head); ctx.lineCap = 'round'; ctx.lineWidth = 1.3; ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const u = i / 12 - .5, len = 22 + hash(i, 7) * 3;
        ctx.moveTo(u * 15, -109); ctx.lineTo(u * 24 + Math.sin(time * 6) * 1.2 * u, -109 - len);
      }
      ctx.stroke();
      ctx.strokeStyle = t(shade(head)); ctx.lineWidth = .6; ctx.beginPath();
      for (let i = 0; i < 6; i++) { const u = i / 5 - .5; ctx.moveTo(u * 13 + .6, -111); ctx.lineTo(u * 21 + .6, -129); }
      ctx.stroke();
      artHandAt(t, 0, -10, 0, 11, { pose: 'grip', sleeve: '#5fa39a' });
      ctx.restore();
    } },

    /* P8 먹이 주기 금지: 두 기둥 사이에 걸린 현수막 */
    'pigeon:banBanner': { w: 252, h: 204, d: (time, t) => {
      RR(-124, -200, 6, 200, 3, t('#7d7a8c')); RR(118, -200, 6, 200, 3, t('#7d7a8c'));
      ctx.save(); ctx.translate(0, -165); ctx.transform(1, 0, Math.sin(time * 1.3) * .03, 1, 0, 0);
      RR(-118, -26, 236, 52, 3, t('#fbf7ee')); RR(-118, -26, 236, 6, 0, t('#e6765f')); RR(-118, 20, 236, 6, 0, t('#e6765f'));
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
      ctx.save(); ctx.translate(-30, -55); ctx.rotate(Math.sin(time * 2.5) * .15);
      ctx.globalAlpha = .7; E(0, -6, 10, 7, '#f4f8ff'); ctx.restore();
      [[40, 0], [-50, 1], [70, 2]].forEach(([x, i]) => E(x, -.6, 4, 1.3, t(i % 2 ? '#d39d4c' : '#b98a5e')));
    } },

    /* P9 낯선 낟알: 이상한 색으로 물든 낟알과 찢긴 작은 봉지 */
    'pigeon:poisonGrain': { w: 89, h: 22.5, d: (time, t) => {
      scatter(t, { n: 46, x0: -42, x1: 42, seed: 13, size: 1.3, colors: ['#ff8fc0', '#6fd6c8', '#f5a3cf'] });
      RR(26, -12, 16, 12, 2, t('#e9e4ec')); P([[26, -12], [32, -16], [36, -12]], t('#e9e4ec'));
      RR(28, -8, 12, 4, 1, t('#ff8fc0'));
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
      RR(-130, -600, 260, 600, 4, t('#8fa3b8'));
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) skyGlass(time + r + c, -124 + c * 84, -594 + r * 99, 80, 95);
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
