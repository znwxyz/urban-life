/* 길고양이 장면 전용 그림. 키는 'cat:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수) */
/* ── 장면 그림들이 함께 쓰는 손. 그림 파일은 cat → cockroach → pigeon → fly 순서로 읽히므로 여기 둔다 ──
   만화 손: 통통한 손바닥 한 덩어리와 둥근 막대 손가락. 손톱·마디선·손금·하이라이트는 넣지 않는다
   (겹을 쌓을수록 징그러워진다. 실루엣 하나로 읽히게 한다). 색은 많아야 두 톤(뒤쪽 손가락만 한 톤 어둡게).
   손목 가운데가 원점, 손가락이 +x 쪽, 손 길이 1을 기준으로 그린 뒤 s(cm)배 한다.
   o: { pose: 'flat'|'pinch'|'grip', s, skin, coat 장갑색, spread 손가락 벌림, sleeve 소매색, held(x, y) 쥔 물건 } */
const artHand = (() => {
  function bar(pts, w, c) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  }
  function blobFill(c, draw) { ctx.fillStyle = c; ctx.beginPath(); draw(); ctx.fill(); }
  const palm = () => { ctx.moveTo(0, -.17); ctx.quadraticCurveTo(.3, -.22, .5, -.16); ctx.quadraticCurveTo(.58, 0, .5, .16); ctx.quadraticCurveTo(.3, .22, 0, .17); ctx.closePath(); };

  /** 편 손: 손가락 넷을 부채처럼 벌리고 엄지는 위로 */
  function flat(k, o) {
    const sp = o.spread == null ? 1 : o.spread;
    [-.15, -.05, .05, .15].forEach((y, i) => {
      const a = (y * 1.6) * sp, len = [.3, .36, .34, .27][i];
      bar([[.42, y * .9], [.42 + Math.cos(a) * len, y * .9 + Math.sin(a) * len]], .115, k.base);
    });
    bar([[.16, -.12], [.3, -.3 * sp - .02]], .13, k.base);
    blobFill(k.base, palm);
  }

  /** 집은 손(옆모습): 검지와 엄지 끝이 (.95, .11)에서 만난다. 나머지 손가락은 안으로 말린 한 덩어리 */
  function pinch(k, o) {
    blobFill(k.dark, () => { ctx.ellipse(.52, .1, .16, .11, 0, 0, TAU); });
    blobFill(k.base, palm);
    bar([[.4, -.08], [.72, -.06], [.95, .08]], .12, k.base);
    if (o.held) o.held(.95, .11);
    bar([[.25, .1], [.62, .2], [.9, .16]], .13, k.base);
  }

  /** 쥔 주먹(엄지 쪽에서 본 모습). 막대는 손끝 앞 x≈.66에서 위아래로 지나간다 */
  function grip(k, o) {
    if (o.held) o.held(.66, 0);
    blobFill(k.base, () => { ctx.moveTo(0, -.16); ctx.quadraticCurveTo(.4, -.22, .62, -.12); ctx.quadraticCurveTo(.76, .02, .62, .17); ctx.quadraticCurveTo(.3, .22, 0, .16); ctx.closePath(); });
    bar([[.2, -.12], [.5, -.17], [.66, -.08]], .12, k.dark);
    bar([[.2, -.13], [.48, -.18], [.64, -.1]], .1, k.base);
  }

  function cuff(sleeve) {
    if (!sleeve) return;
    RR(-.42, -.2, .46, .4, .08, sleeve);
  }

  const POSES = { flat, pinch, grip };
  return (t, o) => {
    const base = o.coat || o.skin || SKIN, k = { base: t(base), dark: t(shade(base)) };
    ctx.save(); ctx.scale(o.s, o.s);
    (POSES[o.pose] || flat)(k, o);
    cuff(o.sleeve && t(o.sleeve));
    ctx.restore();
  };
})();

/** 손이 쥔 자리(grip·pinch) 또는 손바닥 가운데(flat)를 (x, y)에 맞춰, ang 방향으로 손을 뻗는다.
    손끝이 왼쪽을 향하면 위아래를 뒤집어 손등이 늘 위(빛 쪽)를 보게 한다 */
const HAND_HOLD = Object.freeze({ grip: [.66, 0], pinch: [.95, .11], flat: [.5, 0] });
function artHandAt(t, x, y, ang, s, o) {
  const [hx, hy] = HAND_HOLD[o.pose] || HAND_HOLD.flat, fy = Math.cos(ang) < 0 ? -1 : 1;
  const c = Math.cos(ang), sn = Math.sin(ang), px = hx * s, py = hy * s * fy;
  ctx.save(); ctx.translate(x - (c * px - sn * py), y - (sn * px + c * py)); ctx.rotate(ang); ctx.scale(1, fy);
  artHand(t, { ...o, s });
  ctx.restore();
}

(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})((() => {
  const CARD = '#d9b27c', STYRO = '#fbfaf5', SNOW = '#f7fbff', AUNTIE = { top: '#8fb8a8', bottom: '#5f6f86', hair: '#4a3a3a' };
  const OWNER = { top: '#f0c27a', bottom: '#5f8fb0', hair: '#2f2a3a' };
  const KITTEN_WHITE = { fur: '#fbf3e8', dark: '#e3d3bf', belly: '#ffffff' };
  const KITTEN_TABBY = { fur: '#c9a27c', dark: '#9c7a58', belly: '#f0e2cc' };

  const scaleBy = (k, draw) => { ctx.save(); ctx.scale(k, k); draw(); ctx.restore(); };
  const at = (x, y, draw) => { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); };
  const faded = (a, draw) => { ctx.save(); ctx.globalAlpha = a; draw(); ctx.restore(); };

  /** 감은 눈. up이면 ∩(웃는 눈), 아니면 U(잠든 눈) */
  function shutEye(x, y, r, t, up) {
    ctx.strokeStyle = t(INK); ctx.lineWidth = r * .55; ctx.lineCap = 'round'; ctx.beginPath();
    if (up) ctx.arc(x, y + r * .4, r, Math.PI * 1.15, Math.PI * 1.85); else ctx.arc(x, y - r * .4, r, Math.PI * .15, Math.PI * .85);
    ctx.stroke();
  }

  /** 위로 흔들리며 올라가는 김 */
  function steam(x, y, h, time, c) {
    faded(.55, () => {
      ctx.strokeStyle = c; ctx.lineWidth = Math.max(.8, h * .08); ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i <= 12; i++) {
        const k = i / 12, yy = y - k * h, xx = x + Math.sin(k * 6 + time * 3) * h * .12;
        if (i) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
      ctx.stroke();
    });
  }

  /** 동그랗게 말고 자는 새끼 고양이 (길이 약 30cm × k) */
  function curledCat(time, t, coat, k, seed) {
    const fur = t(coat.fur), br = 1 + Math.sin(time * 1.5 + seed * 2) * .04;
    ctx.save(); ctx.scale(k, k * br);
    E(0, -8, 13, 8, fur); E(-1, -2.5, 12, 2.8, t(coat.dark));
    P([[4, -12], [5, -19], [9, -13]], fur); P([[10, -13], [14, -19], [15, -11]], fur);
    E(9.5, -8, 6.5, 5.8, fur);
    shutEye(7.4, -8, 1.3, t); shutEye(11.8, -8, 1.3, t);
    blush(6, -5.5, 1.6, 1); blush(13.5, -5.5, 1.6, 1);
    ctx.restore();
  }

  /** 정면을 보는 고양이 얼굴. mood: 'sleep' | 'cough' | 기본 */
  function catFace(x, y, r, coat, time, t, mood) {
    const fur = t(coat.fur);
    P([[x - r * .95, y - r * .2], [x - r * .75, y - r * 1.45], [x - r * .1, y - r * .85]], fur);
    P([[x + r * .1, y - r * .85], [x + r * .75, y - r * 1.45], [x + r * .95, y - r * .2]], fur);
    E(x, y, r, r * .88, fur);
    if (mood === 'sleep' || mood === 'cough') { shutEye(x - r * .38, y, r * .17, t, mood === 'cough'); shutEye(x + r * .38, y, r * .17, t, mood === 'cough'); }
    else { cuteEye(x - r * .38, y, r * .17, r * .15, time, t); cuteEye(x + r * .38, y, r * .17, r * .15, time, t); }
    E(x, y + r * .3, r * .1, r * .07, t(BLUSH));
    blush(x - r * .62, y + r * .35, r * .18, r * .11); blush(x + r * .62, y + r * .35, r * .18, r * .11);
    if (mood !== 'cough') return;
    const p = (time * 1.4) % 1;
    faded(1 - p, () => [-.4, 0, .4].forEach((a) => E(x + Math.sin(a) * r * (.6 + p * 1.4), y + r * (.5 + p * .8), r * .07, r * .07, t('#cfe8f5'))));
  }

  /** 앉아 있는 고양이. earTip이면 왼쪽 귀 끝이 잘려 있다(TNR 표시) */
  function sitCat(time, t, coat, earTip) {
    const fur = t(coat.fur), dark = t(coat.dark), pink = t(BLUSH), sway = Math.sin(time * 1.8);
    ctx.lineCap = 'round'; ctx.strokeStyle = fur; ctx.lineWidth = 5; ctx.beginPath();
    ctx.moveTo(-8, -4); ctx.quadraticCurveTo(-20, -2, -17 + sway * 2, -18); ctx.stroke();
    E(0, -15, 12, 15, fur); E(4, -13, 7, 10, t(coat.belly));
    RR(2, -12, 4.5, 12, 2.2, dark); RR(8, -12, 4.5, 12, 2.2, fur);
    const hx = 6, hy = -35 + Math.sin(time * 2) * .4;
    if (earTip) P([[hx - 10, hy - 4], [hx - 9.4, hy - 12], [hx - 5.6, hy - 12.8], [hx - 1, hy - 9]], fur);
    else P([[hx - 10, hy - 4], [hx - 8, hy - 17], [hx - 1, hy - 9]], fur);
    P([[hx + 2, hy - 9], [hx + 9, hy - 17], [hx + 11, hy - 4]], fur);
    P([[hx + 4, hy - 8], [hx + 8.5, hy - 14], [hx + 9.5, hy - 6]], pink);
    E(hx, hy, 12, 10.5, fur);
    [-2, 1.5, 5].forEach((dx) => RR(hx + dx, hy - 10.5, 1.5, 4, .7, dark));
    cuteEye(hx - 1.5, hy + 1, 2.5, 2, time, t); cuteEye(hx + 7.5, hy + 1, 2.5, 2, time, t);
    blush(hx - 6, hy + 5, 2.2, 1.4); blush(hx + 11.5, hy + 5, 2.2, 1.4);
    E(hx + 3, hy + 3.4, 1.1, .8, pink);
  }

  /** 쪼그려 앉은 사람(키 약 160). o: 옷색, hand [x,y], hold(hx,hy) 손에 든 것 */
  function crouchPerson(time, t, o) {
    const bob = Math.sin(time * 2) * .8, r = 13.4, sway = Math.sin(time * 2.6) * 1.2;
    ctx.lineCap = 'round';
    L(-14, -36, 12, -46, t(shade(o.bottom)), 13); L(12, -46, 9, -6, t(shade(o.bottom)), 11);
    L(-18, -34, 7, -42, t(o.bottom), 14); L(7, -42, 1, -6, t(o.bottom), 12);
    RR(3, -6, 17, 6, 3, t(shade(INK))); RR(-5, -6, 17, 6, 3, t(INK));
    at(-12, -40 + bob, () => { ctx.rotate(.3); RR(-15, -52, 30, 56, 14, t(o.top)); });
    const hx = 9, hy = -101 + bob, [ax, ay] = o.hand;
    E(hx, hy, r, r * 1.08, t(SKIN));
    E(hx - r * .15, hy - r * .45, r * 1.05, r * .75, t(o.hair));
    if (o.extra) o.extra(hx, hy, r);
    E(hx + r * .45, hy + r * .05, r * .1, r * .13, t(INK));
    blush(hx + r * .55, hy + r * .38, r * .17, r * .1);
    L(4, -80 + bob, ax, ay + sway, t(o.top), 8);
    if (o.hold) o.hold(ax, ay + sway);
    const ang = o.handAng == null ? Math.atan2(ay + sway - (-80 + bob), ax - 4) : o.handAng;
    artHandAt(t, ax, ay + sway, ang, 11, { pose: o.handPose || 'grip', curl: .12, spread: .7, sleeve: o.top });
  }

  const auntieCurls = (t) => (hx, hy, r) => [-.6, 0, .5].forEach((k) => E(hx + r * k, hy - r * .85, r * .35, r * .3, t(AUNTIE.hair)));

  /** 앞에서 본 이동장. 문이 열려 있고 안에 담요가 깔렸다 */
  function carrierFront(t, c) {
    RR(-30, -42, 22, 42, 10, t(shade(c)));
    RR(-22, -40, 44, 40, 12, t(c)); RR(-10, -46, 20, 6, 3, t(shade(c)));
    RR(-14, -32, 28, 28, 10, t('#3b3049')); E(0, -6, 12, 3.5, t('#f4b6c2'));
    P([[14, -32], [30, -36], [30, -2], [14, -4]], t('#c9c4cc'));
    ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .8; ctx.beginPath();
    [18, 22, 26].forEach((x) => { ctx.moveTo(x, -32 - (x - 14) * .25); ctx.lineTo(x, -3); });
    ctx.stroke();
  }

  /** 옆에서 본 승용차 앞부분(오른쪽이 보닛) */
  function carSide(t, c) {
    [-55, 60].forEach((x) => { E(x, -28, 28, 28, t('#3a3445')); E(x, -28, 11, 11, t('#cfcad8')); });
    RR(-95, -140, 120, 70, 30, t(c)); RR(-80, -128, 45, 38, 14, t('#d8edf3')); RR(-28, -128, 45, 38, 14, t('#d8edf3'));
    RR(-100, -100, 195, 68, 30, t(c)); RR(-100, -50, 195, 18, 9, t(shade(c)));
    L(25, -99, 88, -92, t(shade(c)), 1.5); E(86, -80, 8, 6, t('#fff3b8'));
    faded(.6, () => { E(-50, -118, 12, 4, '#ffffff'); E(-5, -121, 9, 3, '#ffffff'); });
  }

  function lily(cx, cy, s, ang, t) {
    for (let k = 0; k < 6; k++) at(cx, cy, () => { ctx.rotate(ang + k * TAU / 6); E(0, -6 * s, 2.6 * s, 6.5 * s, t('#fffaf3')); });
    E(cx, cy, 2 * s, 2 * s, t('#d9ecc0'));
    [-.8, -.3, .3, .8].forEach((a) => {
      const ex = cx + Math.sin(ang + a) * 6 * s, ey = cy - Math.cos(ang + a) * 6 * s;
      L(cx, cy, ex, ey, t('#9cc46a'), .4 * s); E(ex, ey, 1 * s, .7 * s, t('#f2a13a'));
    });
  }

  function fishHead(x, y, rot, t) {
    at(x, y, () => {
      ctx.rotate(rot);
      E(0, 0, 6, 4.2, t('#9fb3c4')); E(1, 1.2, 4.5, 2.2, t('#dfe7ee'));
      RR(-7, -4, 3, 8, 1.5, t('#e6765f'));
      E(2.2, -1, 1.5, 1.5, WHITE); E(2.5, -1, .8, .8, t(INK));
      P([[6, 0], [4.4, .6], [5.6, 1.6]], t('#7d8fa6'));
    });
  }

  /** 묶은 귀가 선 쓰레기봉투 한 자루 (x, 바닥 y, 폭의 반 rx, 높이 h) */
  function trashBag(x, y, rx, h, c, t, seed) {
    const hull = (dy) => {
      ctx.beginPath(); ctx.moveTo(x - rx * .9, y + dy);
      ctx.bezierCurveTo(x - rx * 1.15, y - h * .55 + dy, x - rx * .5, y - h * .9 + dy, x - rx * .12, y - h * .86 + dy);
      ctx.lineTo(x + rx * .12, y - h * .86 + dy);
      ctx.bezierCurveTo(x + rx * .55, y - h * .9 + dy, x + rx * 1.15, y - h * .5 + dy, x + rx * .9, y + dy); ctx.closePath();
    };
    hull(1.5); ctx.fillStyle = t(shade(c)); ctx.fill();
    hull(0); ctx.fillStyle = t(c); ctx.fill();
    const top = y - h * .86;
    P([[x - 1.4, top + 1], [x - 5, top - 7 - hash(seed, 1) * 2], [x - 1.6, top - 5.6], [x, top - 2]], t(shade(c)));
    P([[x + 1.4, top + 1], [x + 5.4, top - 6 - hash(seed, 2) * 2], [x + 1.8, top - 5], [x, top - 2]], t(c));
    E(x, top, 2.6, 1.8, t(shade(shade(c))));
    ctx.strokeStyle = t(shade(c)); ctx.lineWidth = .9; ctx.lineCap = 'round'; ctx.beginPath();
    [[-.5, .2, -.25, .6], [.35, .3, .5, .7], [-.1, .55, .15, .85]].forEach(([a, b, cc, d]) => {
      ctx.moveTo(x + rx * a, y - h * b); ctx.quadraticCurveTo(x + rx * (a + cc) / 2 + 2, y - h * (b + d) / 2, x + rx * cc, y - h * d);
    });
    ctx.stroke();
    faded(.35, () => { E(x - rx * .45, y - h * .55, rx * .14, h * .16, '#ffffff'); E(x - rx * .3, y - h * .3, rx * .06, h * .06, '#ffffff'); });
  }

  return {
    /* C1 상자 속: 꼼짝 않는 형제들과 담요 한 조각 */
    'cat:siblingsBox': { w: 92, h: 54, d: (time, t) => {
      RR(-29, -38, 58, 38, 4, t(shade(shade(CARD))));
      P([[-29, -38], [-41, -47], [-36, -52], [-24, -38]], t(shade(CARD)));
      P([[29, -38], [42, -49], [45, -44], [33, -36]], t(CARD));
      at(-9, -25, () => curledCat(time, t, KITTEN_TABBY, .62, 0));
      at(10, -26, () => curledCat(time, t, KITTEN_WHITE, .58, 1));
      RR(-26, -29, 22, 5, 2.5, t('#a8c8e8'));
      block(-29, -27, 58, 27, CARD, t); R(-3, -27, 7, 12, t('#ecd3a6'));
      P([[-24, -28], [6, -28], [3, -15], [-21, -17]], t('#a8c8e8'));
      [[-18, -24], [-9, -22], [0, -24], [-14, -19]].forEach(([x, y]) => E(x, y, 1.3, 1.3, t('#f4f1ea')));
    } },
    /* C1 해 질 녘, 슬리퍼 소리가 계단을 내려온다 */
    'cat:stairSlipper': { w: 102, h: 204, d: (time, t) => {
      [0, 1, 2, 3].forEach((i) => { block(-50 + i * 22, -16 * (i + 1), 100 - i * 22, 16 * (i + 1), '#c9c2b8', t); R(-50 + i * 22, -16 * (i + 1), 100 - i * 22, 2, t('#e3ddd4')); });
      at(16, -48, () => {
        ctx.scale(-1, 1);
        person(time, t, { h: 158, ...AUNTIE, arm: 'down', extra: (hy, r) => auntieCurls(t)(0, hy, r) });
        E(-6, -2, 10, 3.5, t('#ff8fa3')); E(8, -2, 10, 3.5, t('#ff8fa3')); RR(-10, -6, 9, 4, 2, t('#ffd56b')); RR(4, -6, 9, 4, 2, t('#ffd56b'));
      });
      const p = (time * 1.5) % 1;
      faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#fffaf0'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-8, -50, 6 + i * 5 + p * 6, Math.PI * .9, Math.PI * 1.4); ctx.stroke(); }));
    } },

    /* C2 쪼그려 앉아 주사기로 분유를 먹여 주는 302호 아줌마 */
    'cat:auntieSyringe': { w: 53, h: 121, d: (time, t) => crouchPerson(time, t, {
      ...AUNTIE, hand: [22, -42], extra: auntieCurls(t),
      hold: (x, y) => at(x, y, () => {
        ctx.rotate(.19 + Math.sin(time * 2) * .04);
        RR(-.6, -8, 1.2, 8, .6, t('#c9c4cc')); RR(-3, -9, 6, 1.4, .7, t('#c9c4cc'));
        RR(-2.8, 0, 5.6, 20, 2, t('#eef3f7')); RR(-2.1, 7, 4.2, 12, 1.2, t('#fff6e0'));
        RR(-.6, 20, 1.2, 4, .6, t('#c9c4cc'));
        E(0, 26 + (time * 8) % 5, .8, 1.1, t('#fffaf0'));
      }),
    }) },
    /* C2 분유 캔과 작은 접시: 은빛 테두리 캔, 고양이 발자국 라벨, 계량 스푼, 우유가 찰랑이는 접시 */
    'cat:formulaCan': { w: 41, h: 22.5, d: (time, t) => {
      const can = '#f2e6c9', band = '#8fc3e0';
      faded(.2, () => E(-5, -.3, 10, 1.2, t(INK)));
      RR(-14, -20, 18, 20, 2.4, t(shade(can))); RR(-14, -20, 15, 20, 2.4, t(can));
      RR(-14, -15, 18, 9, 0, t(shade(band))); RR(-14, -15, 15, 9, 0, t(band));
      E(-7, -10.4, 1.6, 1.4, t('#ff8fa3')); [[-9, -12.6], [-7.6, -13.4], [-6, -13.2], [-4.8, -12.2]].forEach(([x, y]) => E(x, y, .6, .7, t('#ff8fa3')));
      [-13, -12.2].forEach((y, i) => L(-12, y + 9.4 + i * 1.2, -2 - i * 3, y + 9.4 + i * 1.2, t('#c9b48c'), .5));
      faded(.5, () => RR(-13, -19, 1.4, 18, .7, WHITE));
      E(-5, -20, 9, 1.6, t('#c9c4cc')); E(-5, -20.4, 9, 1.4, t('#e9e4ec')); E(-5, -20.6, 7.4, .9, t('#d8d3df'));
      faded(.6, () => E(-8, -20.7, 3, .3, WHITE));
      E(11, -1.4, 9, 2.4, t(shade('#e9e4ec'))); E(11, -2.2, 9, 2.2, t('#f4f1f6')); E(11, -2.5, 7, 1.4, t('#fffaf0'));
      const p = (time * .6) % 1;
      faded(.5 * (1 - p), () => { ctx.strokeStyle = t('#f2e6c9'); ctx.lineWidth = .25; ctx.beginPath(); ctx.ellipse(11, -2.5, 1 + p * 5, (1 + p * 5) * .2, 0, 0, TAU); ctx.stroke(); });
      ctx.save(); ctx.translate(6, -5.2); ctx.rotate(-.25);
      RR(0, -.5, 8, 1, .5, t('#c9c4cc')); E(9.2, 0, 1.8, 1.2, t('#c9c4cc')); E(9.2, -.2, 1.3, .7, t('#fffaf0'));
      ctx.restore();
    } },

    /* C3 밥자리 지붕 아래, 그릇에 머리를 박은 치즈 */
    'cat:cheeseFirst': { w: 147, h: 62, d: (time, t) => {
      const c = CAT_COATS.cheese, fur = t(c.fur), dark = t(c.dark), chew = Math.abs(Math.sin(time * 6)) * 1.2;
      RR(-66, -44, 52, 44, 4, t('#e9d3b0')); P([[-72, -42], [-40, -60], [-8, -42]], t('#7fb08a')); RR(-72, -44, 64, 4, 2, t(shade('#7fb08a')));
      E(-40, -4, 11, 4, t('#5f8fb0')); E(-40, -6, 8.5, 1.8, t('#d8f0fa'));
      ctx.lineCap = 'round'; ctx.strokeStyle = fur; ctx.lineWidth = 6; ctx.beginPath();
      ctx.moveTo(-16, -22); ctx.quadraticCurveTo(-32, -30, -24 + Math.sin(time * 2) * 3, -44); ctx.stroke();
      [-13, -6, 8, 14].forEach((x) => RR(x - 3.5, -12, 7, 12, 3.5, dark));
      E(0, -21, 19, 12.5, fur); E(2, -16, 12, 6, t(c.belly));
      [-8, -2, 4].forEach((x) => RR(x, -33, 2, 6, 1, dark));
      const hx = 23, hy = -13 + chew;
      P([[hx - 9, hy - 7], [hx - 10, hy - 19], [hx - 2, hy - 10]], fur); P([[hx + 2, hy - 10], [hx + 7, hy - 19], [hx + 11, hy - 6]], fur);
      E(hx, hy, 12, 10, fur); shutEye(hx - 2, hy - 1, 1.8, t, true); shutEye(hx + 6, hy - 1, 1.8, t, true);
      blush(hx - 6, hy + 3, 2.2, 1.3);
      E(32, -6, 11, 3.5, t('#b7864f')); RR(19, -7, 27, 7, 3.5, t('#e6765f'));
      [0, 1, 2].forEach((i) => { const p = (time * 1.2 + i / 3) % 1; E(38 + p * 10, -8 - Math.sin(p * Math.PI) * 6, .9, .8, t('#b7864f')); });
    } },
    /* C3 화단의 메뚜기 한 마리: 접은 날개, 톱니 무늬 뒷다리, 긴 더듬이 */
    'cat:grasshopper': { w: 21.5, h: 16.5, d: (time, t) => {
      const g = '#9cc46a', dk = '#6f9a48', hop = Math.max(0, Math.sin(time * 2.5)) ** 4 * 3;
      [[-7, -1, 9], [-3, 1, 12], [4, -1, 10], [8, 1, 8]].forEach(([x, lean, h], i) => {
        ctx.fillStyle = t(i % 2 ? '#7fb08a' : '#6fa07a'); ctx.beginPath(); ctx.moveTo(x - 1.4, 0);
        ctx.quadraticCurveTo(x + lean * .4, -h * .6, x + lean * 2 + Math.sin(time * 1.4 + i) * .4, -h); ctx.quadraticCurveTo(x + lean * .6, -h * .5, x + 1.4, 0); ctx.fill();
      });
      at(0, -hop, () => {
        ctx.lineCap = 'round';
        L(2.6, -8.4, 1.6, -6.4, t(dk), .35); L(3.6, -8.4, 3.8, -6.4, t(dk), .35);
        ctx.fillStyle = t(dk); ctx.beginPath(); ctx.moveTo(-.6, -9.4); ctx.quadraticCurveTo(-3.6, -12.6, -5, -11.6); ctx.quadraticCurveTo(-4.2, -10.4, -1.6, -8.6); ctx.fill();
        L(-4.6, -11.8, -6.2, -7.2, t(dk), .4); L(-6.2, -7.2, -5.4, -7, t(dk), .3);
        ctx.fillStyle = t(shade(g)); ctx.beginPath(); ctx.moveTo(5.6, -10.4); ctx.quadraticCurveTo(0, -12, -5.6, -9.4); ctx.quadraticCurveTo(-2, -7.8, 5, -8); ctx.fill();
        ctx.fillStyle = t(g); ctx.beginPath(); ctx.moveTo(5.6, -10.6); ctx.quadraticCurveTo(0, -11.8, -5.2, -9.6); ctx.quadraticCurveTo(-1, -9.4, 5, -9.2); ctx.fill();
        E(1, -8.6, 4.6, 1.3, t(g)); [-1.6, 0, 1.6].forEach((x) => L(x, -9.4, x - .2, -7.6, t(dk), .15));
        ctx.fillStyle = t('#b9d88a'); ctx.beginPath(); ctx.moveTo(-.8, -9); ctx.quadraticCurveTo(-3.4, -11.6, -4.4, -11.2); ctx.quadraticCurveTo(-3.6, -10.4, -1.2, -8.6); ctx.fill();
        [-3.4, -2.6, -1.8].forEach((x, i) => L(x, -10.8 + i * .5, x + .4, -10 + i * .5, t(dk), .12));
        E(5.4, -9.4, 1.8, 1.6, t(g)); E(6, -10, .55, .6, t(INK)); E(6.15, -10.2, .2, .2, WHITE);
        ctx.strokeStyle = t(dk); ctx.lineWidth = .18; ctx.beginPath(); ctx.moveTo(6, -10.8);
        ctx.quadraticCurveTo(8, -13.4, 10 + Math.sin(time * 3) * .4, -14); ctx.moveTo(5.6, -10.9); ctx.quadraticCurveTo(7, -13.8, 8.4 + Math.sin(time * 3 + 1) * .4, -15); ctx.stroke();
      });
    } },

    /* C4 참치 캔이 든 TNR 포획틀, 문이 들려 있다 */
    'cat:tnrTrap': { w: 124, h: 67, d: (time, t) => {
      RR(-41, -2, 82, 2, 1, t('#7d8794'));
      RR(-36, -10, 9, 10, 2, t('#cfd6dc')); RR(-36, -7, 9, 4, 0, t('#5f8fb0')); E(-31.5, -10, 4.5, 1.4, t('#f2c6a0'));
      steam(-31, -12, 14, time, t('#f2c6a0'));
      ctx.strokeStyle = t('#7d8794'); ctx.lineWidth = .8; ctx.beginPath(); ctx.rect(-40, -35, 80, 35);
      for (let x = -34; x < 40; x += 6) { ctx.moveTo(x, -35); ctx.lineTo(x, 0); }
      for (let y = -28; y < 0; y += 7) { ctx.moveTo(-40, y); ctx.lineTo(40, y); }
      ctx.stroke();
      RR(-43, -39, 44, 9, 3, t('#e6a3b5')); P([[-43, -33], [-37, -33], [-39, -18], [-43, -20]], t('#e6a3b5'));
      at(40, -35, () => { ctx.rotate(-1.1); ctx.strokeStyle = t('#7d8794'); ctx.lineWidth = .8; ctx.strokeRect(0, 0, 33, 4); });
      faded(.5, () => E(50, -.6, 11, 1.6, t('#d9b98a')));
    } },
    /* C4 왼쪽 귀 끝이 잘린 동네 형(TNR 표시) */
    'cat:earTipCat': { w: 45, h: 56, d: (time, t) => scaleBy(1.05, () => sitCat(time, t, CAT_COATS.gray, true)) },

    /* C5 영하 12도, 담요 깔린 스티로폼 겨울집과 김 나는 물그릇 */
    'cat:winterHouse': { w: 104, h: 58, d: (time, t) => {
      block(-30, -42, 60, 42, STYRO, t);
      RR(-34, -48, 66, 8, 4, t('#8fb8a8')); RR(-8, -56, 18, 8, 2, t('#c9785f'));
      E(-16, -48, 13, 3.5, t(SNOW)); E(14, -48, 15, 3.5, t(SNOW));
      [-26, -14, 4, 20].forEach((x, i) => P([[x - 1.6, -40], [x + 1.6, -40], [x, -34 - (i % 2) * 3]], t('#dff1fb')));
      E(-6, -18, 10, 11, t('#3a3445')); E(-6, -9.5, 8.5, 3, t('#e6a3b5'));
      [[18, -30], [-22, -10], [22, -12]].forEach(([x, y], i) => faded(.5 + Math.sin(time * 3 + i) * .4, () => E(x, y, .9, .9, WHITE)));
      E(42, -3, 9, 3, t('#5f8fb0')); E(42, -5, 7, 1.5, t('#d8f0fa'));
      steam(40, -8, 16, time, t('#ffffff')); steam(45, -8, 13, time + 1.3, t('#ffffff'));
    } },
    /* C5 방금 들어온 차, 보닛 틈에서 따뜻한 김 (D4: 새벽 시동) */
    'cat:warmBonnet': { w: 204, h: 144, d: (time, t) => {
      carSide(t, '#7f9fc4');
      [40, 58, 76].forEach((x, i) => steam(x, -101, 32, time + i * .9, t('#ffffff')));
    } },
    /* C5 기둥 사이로 몰아치는 눈바람 */
    'cat:snowWind': { w: 181, h: 124, d: (time, t) => {
      for (let i = 0; i < 18; i++) {
        const x = hash(i, 1) * 170 - 85 + Math.sin(time * 1.6 + i) * 5, y = -122 + ((hash(i, 3) * 110 + time * (14 + hash(i, 2) * 10)) % 110);
        faded(.85, () => E(x, y, .8 + hash(i, 4) * 1.2, .8 + hash(i, 4) * 1.2, WHITE));
      }
      faded(.35, () => [-90, -55, -25].forEach((y, i) => {
        const x = -50 + i * 45 + Math.sin(time * 1.4 + i) * 6;
        ctx.globalAlpha = .35 * (.5 + Math.sin(time * 2 + i * 2) * .5);
        ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.quadraticCurveTo(x, y - 6, x + 30, y); ctx.stroke();
      }));
    } },

    /* C6 밤 11시, 쪼그려 앉아 츄르를 짜 주는 사람 */
    'cat:churuOwner': { w: 57, h: 121, d: (time, t) => crouchPerson(time, t, {
      ...OWNER, hand: [24, -36],
      hold: (x, y) => at(x, y, () => {
        ctx.rotate(.5);
        RR(-1.5, -2, 4, 16, 1.5, t('#e6765f')); RR(-1.5, 3, 4, 4, 0, t('#fffaf0'));
        E(.5, 16 + (time * 4) % 2, 1.4, 1.8, t('#f5c26b'));
      }),
    }) },
    /* C6 왕복 4차로: 횡단보도, 빨간 보행 신호, 쌩쌩 지나가는 불빛 */
    'cat:crosswalk': { w: 191, h: 257, d: (time, t) => {
      for (let i = 0; i < 6; i++) { const x = -90 + i * 28; P([[x, 0], [x + 14, 0], [x + 20, -7], [x + 6, -7]], t('#f4f1ea')); }
      RR(-95, -10, 190, 2, 1, t('#ffd56b'));
      RR(56, -250, 6, 250, 3, t('#5f6476')); RR(46, -252, 26, 44, 6, t('#3b3049'));
      const isOn = Math.sin(time * 4) > -.6;
      ctx.save(); if (isOn) { ctx.shadowColor = '#ff6b7a'; ctx.shadowBlur = 12; }
      E(59, -241, 3, 3, t(isOn ? '#ff6b7a' : '#7a4a55')); RR(56, -237, 6, 11, 2.5, t(isOn ? '#ff6b7a' : '#7a4a55'));
      ctx.restore();
      [['#fff3b8', -60, 0], ['#ff8f8f', 10, 2.1]].forEach(([c, x, ph]) => {
        const a = Math.max(0, Math.sin(time * 2.4 + ph));
        faded(.75 * a, () => { RR(x, -46 - ph * 9, 46, 3, 1.5, c); RR(x + 10, -40 - ph * 9, 26, 2, 1, c); });
      });
    } },

    /* C7 비 오는 밤, 우산을 쓰고 기다리는 사람 */
    'cat:umbrellaOwner': { w: 141, h: 243, d: (time, t) => {
      person(time, t, { h: 168, ...OWNER, arm: 'out' });
      const hy = -102.5 + Math.sin(time * 3) * 1.68, c = '#7fb3d9';
      L(37, hy, 10, -200, t('#3b3049'), 2);
      ctx.fillStyle = t(c); ctx.beginPath(); ctx.ellipse(8, -200, 62, 32, 0, Math.PI, TAU); ctx.closePath(); ctx.fill();
      [-46, -15, 15, 46].forEach((dx, i) => E(8 + dx, -200, 15.5, 5, t(i % 2 ? shade(c) : c)));
      P([[8, -232], [-12, -200], [8, -200]], t('#a8cbe6')); P([[8, -232], [28, -200], [44, -200]], t('#a8cbe6'));
      RR(6, -238, 4, 7, 2, t('#3b3049'));
      [-54, 70].forEach((x, i) => { const p = (time * 1.3 + i * .5) % 1; faded(1 - p, () => E(x, -196 + p * 80, 1, 1.6, t('#bfe3f5'))); });
    } },
    /* C7 문이 열린 이동장, 안엔 분홍 담요와 츄르 */
    'cat:openCarrier': { w: 69, h: 48, d: (time, t) => {
      faded(.35, () => E(0, -.5, 34, 2.2, t('#9fb6d0')));
      carrierFront(t, '#8fb8a8');
      at(-2, -2 - Math.abs(Math.sin(time * 2)), () => { ctx.rotate(-.2); RR(-8, -2, 14, 3, 1.5, t('#e6765f')); });
    } },

    /* C8 7층 베란다: 조금 열린 창과 방충망, 난간 위 까치 */
    'cat:balconyWindow': { w: 134, h: 199, d: (time, t) => {
      RR(-62, -185, 124, 180, 4, t('#cfe6f2'));
      [[-55, 70], [-18, 95], [24, 60]].forEach(([x, h]) => { RR(x, -100 - h, 30, h, 2, t('#b9c6d8')); [8, 20].forEach((dx) => RR(x + dx, -92 - h + 10, 4, 4, 1, t('#e9eef5'))); });
      for (let x = -58; x <= 58; x += 12) RR(x, -88, 2, 80, 1, t('#8d8a9c'));
      RR(-62, -92, 124, 5, 2, t('#8d8a9c'));
      at(14, -92, () => ACTORS.magpie.d(time, t));
      faded(.22, () => { RR(-60, -183, 60, 176, 2, '#ffffff'); P([[-50, -180], [-38, -180], [-56, -60], [-60, -80]], '#ffffff'); });
      at(30, -183, () => {
        ctx.rotate(Math.sin(time * 1.5) * .015 + .02);
        faded(.45, () => RR(-28, 0, 28, 176, 1, t('#6b7280')));
        ctx.strokeStyle = t('#4b5260'); ctx.lineWidth = .3; ctx.beginPath();
        for (let y = 4; y < 176; y += 4) { ctx.moveTo(-28, y); ctx.lineTo(0, y); }
        ctx.stroke();
      });
      [[-62, -185, 124, 5], [-62, -10, 124, 5], [-62, -185, 5, 180], [57, -185, 5, 180], [-2, -185, 4, 180]].forEach(([x, y, w, h]) => R(x, y, w, h, t('#e9e4ec')));
      RR(-66, -6, 132, 6, 2, t('#d9cfc2'));
    } },
    /* C8 처음 먹어 보는 비싼 사료: 원목 받침대에 얹은 금테 도자기 그릇, 생선 모양 알갱이가 소복 */
    'cat:fancyBowl': { w: 27, h: 22.5, d: (time, t) => {
      const wood = '#c9a27c', bowl = '#c9a3e6';
      faded(.2, () => E(0, -.3, 13, 1, t(INK)));
      [[-10, -.12], [10, .12]].forEach(([x, a]) => at(x, 0, () => { ctx.rotate(a); RR(-1.4, -9, 2.8, 9, 1.2, t(shade(wood))); RR(-1.4, -9, 1.8, 9, .9, t(wood)); }));
      RR(-13, -10.6, 26, 2.4, 1.2, t(shade(wood))); RR(-13, -10.8, 26, 1.6, .8, t(wood));
      E(-.6, -15.8, 8.4, 2, t('#94683a'));
      [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((i) => {
        const x = -6.6 + i * 1.65, y = -16 - Math.sin((i / 8) * Math.PI) * 1.8;
        at(x, y, () => { ctx.rotate(hash(i, 3) * 2); E(0, 0, 1.1, .7, t(i % 2 ? '#b7864f' : '#a0703f')); E(-.3, -.2, .4, .2, t('#d9a86a')); });
      });
      [[-3, -17.6], [1.6, -18], [4.4, -16.6]].forEach(([x, y]) => E(x, y, .9, .55, t('#c99a62')));
      ctx.fillStyle = t(shade(bowl)); ctx.beginPath(); ctx.moveTo(-10, -15); ctx.quadraticCurveTo(-9, -10, -5, -10.4); ctx.lineTo(5, -10.4); ctx.quadraticCurveTo(9, -10, 10, -15); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(bowl); ctx.beginPath(); ctx.moveTo(-10, -15); ctx.quadraticCurveTo(-9, -10.8, -5, -11); ctx.lineTo(3, -11); ctx.quadraticCurveTo(7.6, -11.4, 8.4, -15); ctx.closePath(); ctx.fill();
      RR(-10.4, -15.6, 20.8, 1, .5, t('#e8c05a')); RR(-10, -15.6, 12, .4, .2, t('#fff0b0'));
      [-5, 0, 5].forEach((x) => E(x, -13, .6, .6, t('#f4e6ff')));
      faded(.55, () => E(-6.6, -13.4, 1, 1.4, WHITE));
      const tw = (Math.sin(time * 3) + 1) / 2;
      faded(tw, () => { P([[7, -22], [7.8, -19.6], [10.2, -18.8], [7.8, -18], [7, -15.6], [6.2, -18], [3.8, -18.8], [6.2, -19.6]], WHITE); });
    } },

    /* C9 식탁 위 백합 꽃병, 떨어지는 노란 꽃가루 (D7) */
    'cat:lilyTable': { w: 62, h: 157, d: (time, t) => {
      RR(-26, -66, 5, 66, 2, t('#b08a66')); RR(21, -66, 5, 66, 2, t(shade('#b08a66')));
      RR(-30, -72, 60, 6, 3, t('#c9a27c'));
      [[-14, -128], [6, -140], [18, -116]].forEach(([x, y]) => L(0, -98, x, y + 4, t('#7fa64e'), 1.2));
      faded(.7, () => RR(-8, -100, 16, 28, 6, t('#bfe3f5')));
      RR(-7, -86, 14, 12, 5, t('#d8f0fa'));
      const sway = Math.sin(time * 1.2) * .08;
      lily(-14, -128, 1, -.5 + sway, t); lily(6, -140, 1.1, sway, t); lily(18, -116, .9, .6 + sway, t);
      for (let i = 0; i < 6; i++) { const p = (time * .35 + i / 6) % 1; E(-10 + i * 5 + Math.sin(p * 9) * 2, -120 + p * 48, .7, .7, t('#f5b335')); }
      [[-20, -72.6], [-12, -72.6], [12, -72.6], [24, -72.6]].forEach(([x, y]) => E(x, y, 1.3, .6, t('#f5b335')));
      E(22, -1, 5, 1.5, t('#fffaf3'));
    } },
    /* C9 언제나 옳은 택배 상자 */
    'cat:openParcel': { w: 74, h: 41, d: (time, t) => {
      RR(-22, -30, 44, 30, 3, t(shade(shade(CARD))));
      P([[-22, -30], [-33, -38 + Math.sin(time * 1.4)], [-26, -40], [-14, -30]], t(shade(CARD)));
      P([[22, -30], [32, -40], [36, -35], [26, -28]], t(CARD));
      block(-22, -26, 44, 26, CARD, t); R(-2, -26, 6, 10, t('#ecd3a6'));
      RR(-17, -18, 14, 9, 1.5, t('#fffaf0'));
      [-15, -13, -10, -8.5, -6].forEach((x) => R(x, -15, .7, 4, t(INK)));
    } },

    /* C10 열어 둔 현관문 너머 계단과 바깥 바람 */
    'cat:openDoor': { w: 212, h: 219, d: (time, t) => {
      RR(-55, -215, 110, 215, 4, t('#e9e4ec')); RR(-48, -208, 96, 208, 2, t('#f6e7c4'));
      [0, 1, 2, 3, 4].forEach((i) => block(-48 + i * 18, -28 - i * 24, 96 - i * 18, 28 + i * 24, '#d9cfc2', t));
      L(-40, -60, 40, -170, t('#8d8a9c'), 2);
      P([[48, -208], [86, -198], [86, -8], [48, 0]], t('#8a95a8')); P([[80, -199], [86, -198], [86, -8], [80, -6]], t(shade('#8a95a8')));
      RR(54, -110, 8, 4, 2, t('#e9e4ec')); E(68, -160, 1.8, 1.8, t('#3b3049'));
      faded(.28, () => P([[-48, 0], [48, 0], [-10, 12], [-110, 12]], t('#fff3c4')));
      faded(.4, () => [-150, -110, -70].forEach((y, i) => {
        const x = -70 + i * 14 + Math.sin(time * 1.5 + i) * 5;
        ctx.globalAlpha = .4 * (.5 + Math.sin(time * 2.2 + i * 2) * .5);
        ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 30, y); ctx.quadraticCurveTo(x + 15, y - 5, x, y); ctx.stroke();
      }));
    } },
    /* C10 계단 밑에서 올라온 산책 개, 목줄이 위로 이어진다 (D8) */
    'cat:leashDog': { w: 123, h: 154, d: (time, t) => {
      scaleBy(.75, () => ACTORS.dog.d(time, t));
      RR(20, -42, 6, 2.4, 1.2, t('#e6765f'));
      ctx.strokeStyle = t('#e6765f'); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(23, -41); ctx.quadraticCurveTo(40, -70, 60, -150); ctx.stroke();
      const p = (time * 2) % 1;
      faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#fffaf0'); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(38, -40, 5 + i * 4 + p * 4, -.6, .6); ctx.stroke(); }));
    } },
    /* C10 문을 열어 둔 채 통화 중인 집사 */
    'cat:phoneOwner': { w: 75, h: 166, d: (time, t) => {
      person(time, t, { h: 168, ...OWNER, arm: 'up' });
      const y = -139.5 + Math.sin(time * 3) * 1.68;
      RR(22, y - 10, 5, 11, 1.5, t('#3b3049')); RR(23, y - 9, 3, 7, 1, t('#9fd0ff'));
      faded(.6, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#3b3049'); ctx.lineWidth = .8; ctx.beginPath(); ctx.arc(28, y - 6, 5 + i * 4, -.7, .7); ctx.stroke(); }));
    } },

    /* C11 자꾸 비게 되는 물그릇, 퍼지는 물결 */
    'cat:waterBowl': { w: 40, h: 17.5, d: (time, t) => {
      E(0, -2, 13, 3.5, t('#9aa7b5')); RR(-13, -7, 26, 5, 2.5, t('#c9d3de')); E(0, -7, 12, 2.6, t('#9fd0ff'));
      const p = (time * .8) % 1;
      faded(1 - p, () => { ctx.strokeStyle = t('#e8f6ff'); ctx.lineWidth = .4; ctx.beginPath(); ctx.ellipse(0, -7, 2 + p * 9, (2 + p * 9) * .22, 0, 0, TAU); ctx.stroke(); });
      E(-6, -16 + p * 9, .8, 1.1, t('#9fd0ff'));
      E(17, -.3, 2, .6, t('#bfe3f5')); E(-18, -.3, 1.4, .5, t('#bfe3f5'));
    } },
    /* C11 무릎 꿇고 손바닥을 내미는 집사 */
    'cat:ownerHand': { w: 71, h: 121, d: (time, t) => crouchPerson(time, t, {
      ...OWNER, hand: [30, -34], handAng: .35,
      extra: (hx, hy, r) => L(hx + r * .2, hy - r * .35, hx + r * .65, hy - r * .25, t('#2f2a3a'), 1),
      handPose: 'flat',
    }) },
    /* C11 자주 드나드는 화장실: 모래 결과 뭉친 덩어리, 구멍 뚫린 삽 */
    'cat:litterBox': { w: 62, h: 19, d: (time, t) => {
      const box = '#8fb8a8';
      faded(.2, () => E(0, -.3, 25, 1.2, t(INK)));
      E(0, -9.4, 22, 3.4, t(shade('#efe3c8'))); E(-1, -9.8, 21, 2.8, t('#efe3c8'));
      for (let i = 0; i < 14; i++) E(-18 + hash(i, 5) * 36, -10.2 + hash(i, 6) * 1.6, .35, .25, t(i % 2 ? '#e0d2b2' : '#fbf5e6'));
      [[-10, -11, 2.4], [-2, -11.6, 2], [7, -11, 2.2]].forEach(([x, y, r]) => { E(x + .3, y + .3, r, r * .7, t('#b39d74')); E(x, y, r, r * .7, t('#c9b48c')); E(x - r * .3, y - r * .3, r * .35, r * .2, t('#e0d0a8')); });
      ctx.fillStyle = t(shade(box)); ctx.beginPath(); ctx.moveTo(-25, -10); ctx.lineTo(25, -10); ctx.lineTo(23, 0); ctx.lineTo(-23, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(box); ctx.beginPath(); ctx.moveTo(-25, -10); ctx.lineTo(18, -10); ctx.lineTo(16.6, 0); ctx.lineTo(-23, 0); ctx.closePath(); ctx.fill();
      RR(-26, -11, 52, 2, 1, t(mix(box, '#ffffff', .25)));
      faded(.4, () => RR(-21, -7, 30, .5, .25, WHITE));
      at(22, -9, () => {
        ctx.rotate(-.6);
        RR(-.9, 0, 2.2, 14, 1.1, t(shade('#c97b9c'))); RR(-.9, 0, 1.6, 14, .8, t('#c97b9c'));
        RR(-4, -8.4, 9, 8, 1.6, t(shade('#c97b9c'))); RR(-4, -8.4, 8, 7.4, 1.6, t('#c97b9c'));
        [-2.4, -.4, 1.6].forEach((x) => RR(x, -7.4, 1, 5.4, .5, t(shade(shade('#c97b9c')))));
      });
    } },

    /* S1 생선 대가리를 던져 주는 횟집 아저씨 */
    'cat:fishTosser': { w: 174, h: 168, d: (time, t) => {
      person(time, t, { h: 170, top: '#7d8fa6', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'up',
        extra: (hy, r) => RR(-r * 1.05, hy - r * .7, r * 2.1, r * .35, r * .17, t('#f4f1ea')) });
      RR(-15, -125, 30, 70, 8, t('#e9f1f4')); RR(-14, -40, 13, 38, 4, t('#ffd56b')); RR(1, -40, 13, 38, 4, t(shade('#ffd56b')));
      const p = (time * .45) % 1;
      if (p < .7) { const q = p / .7; fishHead(25 + q * 55, -150 + q * 146 - Math.sin(q * Math.PI) * 45, q * 7, t); }
      else fishHead(80, -4, 0, t);
    } },
    /* S1 길 건너 치킨집 앞 봉투 산더미: 묶은 귀가 선 쓰레기봉투, 기름 밴 치킨 상자, 뼈다귀 */
    'cat:chickenBags': { w: 118, h: 71, d: (time, t) => {
      faded(.2, () => E(0, -.5, 56, 2.4, t(INK)));
      trashBag(-30, 0, 26, 40, '#6d7a8c', t, 1);
      trashBag(-4, -30, 22, 36, '#8a96a8', t, 2);
      trashBag(20, 0, 28, 44, '#5d6878', t, 3);
      at(44, 0, () => {
        ctx.rotate(-.05);
        RR(-14, -20, 28, 20, 2, t(shade('#ffd56b'))); RR(-14, -20, 24, 20, 2, t('#ffd56b'));
        P([[-14, -20], [-10, -26], [12, -25], [14, -20]], t('#f2c24a'));
        faded(.45, () => E(-4, -9, 5, 3.4, t('#d9a24a')));
        RR(-11, -16, 10, 3, 1.5, t('#e6765f')); RR(-11, -11, 6, 1.4, .7, t('#e6765f'));
      });
      [[-50, -2, .4], [52, -1, -.3], [8, -3, .9]].forEach(([x, y, a]) => at(x, y, () => {
        ctx.rotate(a); RR(-3.6, -.9, 7.2, 1.8, .9, t('#fffaf0')); E(-3.6, 0, 1.4, 1.2, t('#fffaf0')); E(3.6, 0, 1.4, 1.2, t('#fffaf0'));
      }));
      at(-14, -4, () => { ctx.rotate(-.4 + Math.sin(time * 2) * .05); E(0, 0, 5, 3.4, t('#c9785f')); E(-1, -1, 2.4, 1.2, t('#e8a07a')); RR(3, -1.2, 7, 2.4, 1.2, t('#fffaf0')); });
    } },
    /* S1 구석에 놓인 수상한 고기: 스티로폼 접시 위 마블링 고깃덩이와 파란 알갱이(쥐약) (D9) */
    'cat:poisonMeat': { w: 34, h: 18, d: (time, t) => {
      faded(.2, () => E(0, -.3, 15, .9, t(INK)));
      ctx.fillStyle = t(shade('#ece6d6')); ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.lineTo(16.4, -3); ctx.lineTo(-16.4, -3); ctx.closePath(); ctx.fill();
      RR(-16.4, -3.6, 32.8, 1.2, .6, t('#f6f2e8'));
      ctx.fillStyle = t('#a8434a'); ctx.beginPath(); ctx.moveTo(-8, -3); ctx.bezierCurveTo(-9.4, -8, -2, -9, 1, -8.2);
      ctx.bezierCurveTo(6, -9.4, 9.6, -6.4, 8, -3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t('#c4565a'); ctx.beginPath(); ctx.moveTo(-7.4, -3.6); ctx.bezierCurveTo(-8.4, -7.6, -2, -8.4, 1, -7.6);
      ctx.bezierCurveTo(5, -8.6, 8, -6.2, 7, -3.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = t('#f6d6d2'); ctx.lineWidth = .45; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(-5, -6.4); ctx.quadraticCurveTo(-2, -5, 1, -6.6); ctx.moveTo(2, -5); ctx.quadraticCurveTo(4, -6.6, 6, -5.2); ctx.moveTo(-6, -4.6); ctx.lineTo(-3, -4.4); ctx.stroke();
      faded(.5, () => E(-3, -7.4, 2.4, .5, WHITE));
      [[-11, -3.4], [10, -3.6], [4, -8.4], [-4, -8.6], [12, -3.2], [-1, -3.5], [6.6, -4]].forEach(([x, y]) => { E(x, y, .75, .6, t('#4f8ee8')); E(x - .2, y - .2, .25, .2, t('#bfe0ff')); });
      faded(.35, () => [-3, 3].forEach((x, i) => {
        ctx.strokeStyle = t('#b6d68a'); ctx.lineWidth = .5; ctx.beginPath();
        for (let k = 0; k <= 10; k++) { const yy = -10 - k * .7, xx = x + Math.sin(k * .8 + time * 2 + i) * .9; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
        ctx.stroke();
      }));
    } },

    /* S2 담 위에서 내려다보는 상처투성이 수컷 */
    'cat:wallTom': { w: 131, h: 179, d: (time, t) => {
      block(-60, -110, 120, 110, '#c98f6e', t);
      for (let row = 0; row < 9; row++) R(-60, -110 + row * 12.2, 120, .8, t('#e0b49a'));
      for (let row = 0; row < 9; row++) for (let x = -60 + (row % 2) * 12; x < 60; x += 24) R(x, -110 + row * 12.2, .8, 12.2, t('#e0b49a'));
      RR(-64, -116, 128, 7, 3, t('#a8a2a8'));
      at(-6, -116, () => scaleBy(1.15, () => drawCat(time, false, t, CAT_COATS.scar)));
    } },
    /* S2 아무도 없는 철거 빌라와 가림막 */
    'cat:demolitionFence': { w: 182, h: 306, d: (time, t) => {
      block(-70, -300, 140, 300, '#d8c9b5', t);
      [[-52, -270], [12, -270], [-52, -200], [12, -200]].forEach(([x, y]) => {
        RR(x, y, 40, 40, 2, t('#5a6274')); L(x + 3, y + 3, x + 37, y + 37, t('#f4f1ea'), 1.6); L(x + 37, y + 3, x + 3, y + 37, t('#f4f1ea'), 1.6);
      });
      ctx.fillStyle = t('#d9534f'); ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('철거', 0, -160);
      for (let i = 0; i < 5; i++) { const x = -90 + i * 36; RR(x, -140, 35, 140, 2, t('#f4f1ea')); RR(x, -120, 35, 14, 0, t('#5f8fb0')); }
    } },
    /* D13 판자로 막힌 창문, 틈새로 새는 빛 */
    'cat:boardedWindow': { w: 121, h: 106, d: (time, t) => {
      RR(-48, -104, 96, 94, 4, t('#8d7a6a')); RR(-42, -98, 84, 82, 2, t('#3a3445'));
      faded(.25 + Math.sin(time * 1.5) * .08, () => P([[-42, -64], [42, -60], [60, 0], [-20, 0]], t('#fff3c4')));
      [[-.15, -84], [.1, -60], [-.05, -36]].forEach(([a, y]) => at(0, y, () => { ctx.rotate(a); RR(-54, -8, 108, 14, 2, t('#c9a27c')); [-44, 40].forEach((x) => E(x, -1, 1.2, 1.2, t('#5f6476'))); }));
    } },

    /* S3 콜록대는 애까지 꽉 찬 공원 겨울집 (D14) */
    'cat:crowdedShelter': { w: 78, h: 69, d: (time, t) => {
      block(-34, -40, 68, 40, STYRO, t);
      RR(-38, -46, 76, 8, 4, t('#5f8fb0')); E(-18, -46, 14, 3.5, t(SNOW)); E(14, -46, 16, 3.5, t(SNOW));
      at(4, -50, () => curledCat(time, t, KITTEN_WHITE, .9, 2));
      E(-4, -18, 15, 13, t('#3a3445'));
      catFace(-11, -15, 6.5, CAT_COATS.gray, time, t, 'sleep');
      catFace(2, -14, 6, KITTEN_TABBY, time, t, 'cough');
      catFace(-4, -6, 5, CAT_COATS.hero, time + 1, t);
      E(-4, -1, 14, 2.4, t('#e6a3b5'));
    } },
    /* S3 공원 캣맘이 앉은 벤치, 열어 둔 이동장과 사료 */
    'cat:benchCarrier': { w: 153, h: 148, d: (time, t) => {
      [-66, 60].forEach((x) => RR(x, -45, 6, 45, 2, t('#5f6476')));
      RR(-75, -88, 150, 9, 4, t('#b98a5e')); RR(-75, -72, 150, 9, 4, t('#b98a5e')); RR(-75, -48, 150, 8, 4, t(shade('#b98a5e')));
      E(10, -3, 10, 3, t('#e6765f')); E(10, -5, 7, 1.6, t('#b7864f'));
      const bob = Math.sin(time * 2) * .6;
      RR(-46, -56, 30, 12, 6, t('#4a4560')); RR(-20, -50, 11, 46, 5, t('#4a4560')); RR(-22, -6, 17, 6, 3, t(INK));
      RR(-56, -108 + bob, 30, 60, 14, t('#6f7fa8'));
      E(-40, -120 + bob, 13, 14, t(SKIN)); RR(-54, -138 + bob, 28, 13, 6, t('#e6765f')); E(-40, -140 + bob, 4, 4, t('#fffaf0'));
      E(-34, -119 + bob, 1.3, 1.7, t(INK)); blush(-33, -114 + bob, 2.2, 1.3);
      ctx.lineCap = 'round'; L(-38, -96 + bob, -8, -62, t('#6f7fa8'), 8); E(-8, -62, 3.4, 3.4, t(SKIN));
      at(30, -48, () => { ctx.scale(-1, 1); carrierFront(t, '#c97b9c'); });
    } },

    /* D1 후진등을 켜고 다가오는 차 */
    'cat:reversingCar': { w: 306, h: 144, d: (time, t) => {
      const c = '#9aa3b5';
      faded(.3, () => P([[-100, -84], [-150, -110], [-150, -40]], t('#fff9e0')));
      [-55, 60].forEach((x) => { E(x, -28, 28, 28, t('#3a3445')); E(x, -28, 11, 11, t('#cfcad8')); E(x, -28, 4, 4, t('#8d8a9c')); });
      RR(-70, -140, 120, 70, 30, t(c)); RR(-55, -128, 45, 38, 14, t('#d8edf3')); RR(-3, -128, 45, 38, 14, t('#d8edf3'));
      RR(-100, -100, 195, 68, 30, t(c)); RR(-100, -50, 195, 18, 9, t(shade(c)));
      ctx.save(); ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 18; E(-95, -84, 6, 8, '#ffffff'); ctx.restore();
      E(-96, -66, 4, 4, t('#e6765f'));
      [-110, -90, -70].forEach((y, i) => L(105 + i * 8, y, 130 + i * 8, y, t('#ffffff'), 3));
    } },
    /* D2 앞발을 치켜든 치즈 */
    'cat:cheeseSwipe': { w: 136, h: 62, d: (time, t) => scaleBy(1.15, () => {
      const c = CAT_COATS.cheese;
      drawCat(time, false, t, c);
      L(9, -42, 14, -40, t(INK), .9); L(23, -40, 28, -42, t(INK), .9);
      at(28, -18, () => {
        ctx.rotate(.6 + Math.sin(time * 8) * .3);
        ctx.fillStyle = t(shade(c.fur)); ctx.beginPath(); ctx.moveTo(-3.4, 2); ctx.quadraticCurveTo(-4.6, -8, -4.4, -14);
        ctx.quadraticCurveTo(0, -19, 4.4, -14); ctx.quadraticCurveTo(4, -8, 3.4, 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = t(c.fur); ctx.beginPath(); ctx.moveTo(-3, 2); ctx.quadraticCurveTo(-4, -8, -3.8, -13.6);
        ctx.quadraticCurveTo(-.4, -17.6, 3.2, -14.2); ctx.quadraticCurveTo(2.8, -8, 2.6, 2); ctx.closePath(); ctx.fill();
        [-1.4, 1.2].forEach((x) => L(x, -6, x + .2, -2, t(c.dark), .7));
        E(0, -12.6, 2.2, 1.7, t(BLUSH)); E(.1, -12.4, 1.4, 1, t('#ffc0c8'));
        [[-2.4, -15.2], [-.8, -16.4], [1, -16.4], [2.6, -15.2]].forEach(([x, y]) => E(x, y, .75, .7, t(BLUSH)));
        ctx.strokeStyle = WHITE; ctx.lineWidth = .55; ctx.lineCap = 'round'; ctx.beginPath();
        [[-2.6, -16], [-.8, -17.4], [1.1, -17.4], [2.9, -16]].forEach(([x, y]) => { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + .2, y - 2, x + 1.4, y - 2.4); });
        ctx.stroke();
      });
      faded(.6, () => [0, 1, 2].forEach((i) => { ctx.strokeStyle = '#ffffff'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(38, -32, 14 + i * 3, -1.4, -.2); ctx.stroke(); }));
    }) },
  };
})());
