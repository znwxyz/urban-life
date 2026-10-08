/* 길고양이 장면 전용 그림. 키는 'cat:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수) */
/* ── 장면 그림들이 함께 쓰는 손. Twemoji 손 이모지 경로(js/render/hands-twemoji.js)를 살색 두 톤으로 칠한다 ──
   도형을 조합하지 않고 곡선 외곽 하나로 그린 손이라야 손으로 읽힌다.
   손목 가운데가 원점, 손가락이 +x 쪽, 손 길이 1을 기준으로 그린 뒤 s(cm)배 한다.
   o: { pose: 'flat'(🫳)|'offer'(🫴)|'grip'·'pinch'(🤜), s, skin, coat 장갑색, sleeve 소매색, held(x, y) 쥔 물건 } */
const artHand = (() => {
  const UNIT = 34;
  const GLYPH = { flat: 'palmDown', offer: 'palmUp', grip: 'fist', pinch: 'fist' };
  return (t, o) => {
    const base = o.coat || o.skin || SKIN;
    const tones = base === SKIN ? TW_HAND_TONES : { base, mid: base, shade: shade(base) };
    const glyph = GLYPH[o.pose] || 'palmDown';
    ctx.save(); ctx.scale(o.s, o.s);
    if (o.held) o.held(.66, 0);
    ctx.save(); ctx.scale(1 / UNIT, 1 / UNIT); ctx.translate(0, -TW_GLYPHS[glyph].wristY); drawTwGlyph(glyph, t, tones); ctx.restore();
    if (o.sleeve) RR(-.4, -.19, .42, .38, .08, t(o.sleeve));
    ctx.restore();
  };
})();

/** 팔 끝(x, y)에 손목을 붙여 ang 방향으로 손을 그린다. 팔 굵기가 곧 소매라서 소맷부리는 따로 그리지 않는다.
    손끝이 왼쪽을 향하면 위아래를 뒤집어 손등이 위를 보게 한다. 쥔 자리(물건을 들릴 곳)를 돌려준다 */
function artHandOnArm(t, x, y, ang, s, o) {
  const [hx, hy] = HAND_HOLD[o.pose] || HAND_HOLD.flat, fy = Math.cos(ang) < 0 ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1, fy);
  artHand(t, { ...o, sleeve: null, s });
  ctx.restore();
  const c = Math.cos(ang), sn = Math.sin(ang), px = hx * s, py = hy * s * fy;
  return [x + c * px - sn * py, y + sn * px + c * py];
}

/** 손이 쥔 자리(grip·pinch) 또는 손바닥 가운데(flat)를 (x, y)에 맞춰, ang 방향으로 손을 뻗는다.
    손끝이 왼쪽을 향하면 위아래를 뒤집어 손등이 늘 위(빛 쪽)를 보게 한다 */
const HAND_HOLD = Object.freeze({ grip: [.66, 0], pinch: [.66, 0], flat: [.5, 0], offer: [.5, 0] });
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

  /* ── 형체감 있는 색종이 오리기: forms.js의 planes·cut·within을 장면 좌표(원점 발밑)에 쓴다. 이 도구들만 y가 위로 + ── */
  const C = (pts, c) => cut(0, 0, 1, pts, c);
  const clipTo = (pts, draw) => within(0, 0, 1, pts, draw);
  const shift = (pts, dx, dy) => pts.map((q) => q.map((v, i) => v + (i % 2 ? dy : dx)));
  const rect = (x0, y0, x1, y1, c) => C([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], c);
  const O = (x, y, rx, ry, c) => E(x, -y, rx, ry, c);
  /** 굵기 있는 선(난간·손잡이·철사). 점 형식: [x,y] 또는 [cx,cy,x,y] */
  function rod(pts, c, w) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    pts.forEach((q, i) => {
      if (!i) ctx.moveTo(q[0], -q[1]);
      else if (q.length === 2) ctx.lineTo(q[0], -q[1]);
      else ctx.quadraticCurveTo(q[0], -q[1], q[2], -q[3]);
    });
    ctx.stroke();
  }

  /** 밑이 좁고 위로 벌어진 그릇. 테두리 윗면은 밝게, 오른쪽 몸통은 그늘, 안에 담긴 것(fill) */
  function bowl(t, cx, rw, h, c, fill) {
    const p = planes(t, c), bw = rw * .7;
    const body = [[cx - bw, 0], [cx + bw, 0], [cx + rw * .98, h * .45, cx + rw, h], [cx - rw, h], [cx - rw * .98, h * .45, cx - bw, 0]];
    C(body, p.mid);
    clipTo(body, () => C([[cx + rw * .32, -1], [cx + rw + 1, -1], [cx + rw + 1, h + 1], [cx + rw * .5, h + 1]], p.dark));
    O(cx, h, rw, rw * .24, p.lit);
    O(cx, h + rw * .02, rw * .84, rw * .17, t(fill));
  }

  /** 위가 열린 골판지 상자의 앞쪽(forms.js carton().front와 같은 오리기에, 왼쪽 날개가 lift만큼 들썩인다) */
  function cartonFront(ox, w, h, d, p, lift) {
    const dx = d, dy = d * .62, bow = w * .025, X = (pts) => shift(pts, ox, 0);
    C(X([[w, 0], [w + dx, dy], [w + dx + bow * .6, (h + dy) * .5, w + dx, h + dy], [w, h]]), p.dark);
    C(X([[0, 0], [w * .5, -bow * .4, w, 0], [w + bow, h * .5, w, h], [w * .78, h - bow * .5], [w * .5, h - bow * .2, 0, h], [-bow, h * .5, 0, 0]]), p.mid);
    C(X([[w * .43, h], [w * .53, h], [w * .53, h * .66], [w * .43, h * .6]]), p.lit);
    C(X([[0, h], [dx, h + dy], [-w * .08, h + dy * 1.25 + lift, -w * .22, h + dy * .7 + lift], [-w * .2, h * .9 + lift * .5], [-w * .1, h * .88, 0, h]]), p.lit);
    C(X([[w, h], [w + dx, h + dy], [w + dx + w * .14, h + dy * .2], [w + dx + w * .08, h * .62, w + w * .08, h * .52]]), p.mid);
  }

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
    const ang = o.handAng == null ? Math.atan2(ay + sway - (-80 + bob), ax - 4) : o.handAng;
    const pose = o.handPose || 'grip', S = 15;
    // 쥔 물건은 손 뒤에, 주먹이 쥔 자리에 그린다
    const [gx, gy] = [ax + Math.cos(ang) * HAND_HOLD[pose][0] * S, ay + sway + Math.sin(ang) * HAND_HOLD[pose][0] * S];
    if (o.hold) o.hold(gx, gy);
    artHandOnArm(t, ax, ay + sway, ang, S, { pose });
  }

  const auntieCurls = (t) => (hx, hy, r) => [-.6, 0, .5].forEach((k) => E(hx + r * k, hy - r * .85, r * .35, r * .3, t(AUNTIE.hair)));

  /** 앞에서 본 이동장: 둥근 지붕 껍데기 하나, 위·오른쪽으로 물러나는 면, 위아래 껍데기 이음매 한 줄.
      아치 문 안에 담요가 깔렸고, 철망 문은 오른쪽으로 열려 있다 */
  function carrierFront(t, c) {
    const p = planes(t, c), grille = planes(t, '#c9c4cc'), blanket = planes(t, '#f4b6c2');
    const front = [[-21, 0], [21, 0], [23, 18, 22, 32], [21, 41, 12, 42], [-12, 42], [-21, 41, -22, 32], [-23, 18, -21, 0]];
    const back = shift(front, 7, 5), mouth = [[-14, 4], [14, 4], [14, 24], [14, 34, 0, 34], [-14, 34, -14, 24]];
    C(back, p.lit);
    clipTo(back, () => rect(21.6, -2, 40, 33, p.dark));
    rod([[-7, 44], [0, 53, 8, 46]], p.dark, 2.6);                                                  // 손잡이
    C(front, p.mid);
    clipTo(front, () => rect(-30, 15, 30, 16.8, p.dark));                                          // 이음매
    C(mouth, t('#3b3049'));
    clipTo(mouth, () => {
      C([[-14, 4], [14, 4], [14, 9], [6, 12.5, 0, 10.5], [-7, 13, -14, 9]], blanket.mid);
      C([[3, 4], [14, 4], [14, 9], [8, 11, 4, 8]], blanket.dark);
    });
    const door = [[14, 4], [30, 1], [30, 37], [14, 34]];
    faded(.35, () => C(door, grille.lit));
    rod([...door, door[0]], grille.dark, 1.4);
    [19.5, 25].forEach((x) => { const k = (x - 14) * 3 / 16; rod([[x, 4 - k], [x, 34 + k]], grille.dark, .8); });
  }

  /** 옆에서 본 작은 승용차(오른쪽이 보닛). cab: 지붕이 시작되는 x (-80보다 작으면 뒤가 곧게 선 해치백).
      외곽 하나에 바퀴 홈을 파고, 지붕·보닛 윗면은 밝게, 어깨선 아래는 그늘. 문틈 한 줄 */
  const WHEEL_X = [-55, 60];
  function compactCar(t, c, cab) {
    const p = planes(t, c), a = cab, isHatch = a < -80;
    const rear = isHatch ? [[-102, 110, -92, 128], [-84, 139, -64, 140]] : [[-101, 94, -86, 98], [a + 2, 100], [a + 10, 132, a + 32, 139]];
    const body = [[-92, 34], [-101, 40, -101, 64], ...rear, [a + 62, 143, a + 92, 139], [a + 106, 134, a + 122, 104], [a + 150, 100, 86, 95],
      [98, 90, 98, 66], [98, 40, 93, 34], [93, 70, 27, 70, 27, 34], [-22, 34], [-22, 70, -88, 70, -88, 34]];
    const g0 = isHatch ? -88 : a + 8;
    const glass = [[g0, 103], [g0 + 4, 126, g0 + 22, 133], [a + 62, 136, a + 90, 133], [a + 104, 128, a + 115, 103]];
    ctx.save(); ctx.beginPath(); ctx.rect(-110, -72, 220, 38); ctx.clip();
    WHEEL_X.forEach((wx) => E(wx, -30, 33, 33, p.deep));                                           // 바퀴 홈 안쪽
    ctx.restore();
    C(body, p.lit);
    clipTo(body, () => {
      C(shift(body, 0, -6), p.mid);                                                                // 윗면만 밝게 남는다
      C([[-110, 60], [0, 64, 110, 58], [110, 0], [-110, 0]], p.dark);                               // 어깨선 아래 그늘
    });
    C(glass, t('#cfe3ea'));
    clipTo(glass, () => {
      rect(a + 58, 98, a + 65, 140, p.mid);                                                        // 가운데 기둥
      faded(.4, () => C([[a + 76, 105], [a + 92, 131], [a + 99, 131], [a + 83, 105]], '#ffffff'));
    });
    rod([[a + 61, 98], [a + 62, 42]], p.deep, 1.4);                                                // 문틈 한 줄
    WHEEL_X.forEach((wx) => { E(wx, -28, 27, 27, t('#3a3445')); E(wx, -28, 12, 12, t('#cfcad8')); E(wx + 2, -27, 8.5, 8.5, t('#aaa5b8')); });
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

  /* 묶은 쓰레기봉투 (items-street.js trashbag과 같은 오리기, 66×70 기준): 매듭 귀 두 개, 아래로 퍼져 주저앉은 몸통 */
  const BAG = [[8, 0], [-4, 2, -3, 22, 4, 34], [10, 44, 20, 50, 27, 54], [31, 55], [35, 54], [44, 50, 52, 42, 54, 34], [64, 26, 66, 6, 54, 0], [30, -1.5, 8, 0]];
  const BAG_DARK = [[44, -2], [40, 18, 46, 36, 36, 54], [70, 50], [70, -2]];
  const BAG_LIT = [[-4, 16], [-3, 30, 4, 38], [10, 44, 20, 50, 27, 54], [28, 50], [16, 45, 8, 36, 5, 20], [0, 14, -4, 16]];
  const BAG_KNOT = [[27, 53], [26, 58], [18, 66, 20, 70, 24, 69], [28, 66, 30, 62], [33, 66, 38, 72, 41, 70], [42, 66, 36, 60, 34, 57], [35, 53]];
  const BAG_KNOT_DARK = [[31, 61], [33, 66, 38, 72, 41, 70], [42, 66, 36, 60, 34, 57]];
  /** 봉투 한 자루: 가운데 x, 바닥 높이 y(위로 +), 폭의 반 rx, 매듭 끝까지 높이 h */
  function trashBag(x, y, rx, h, c, t) {
    const p = planes(t, c), sx = rx / 32, sy = h / 70;
    const f = (pts) => pts.map((q) => q.map((v, i) => (i % 2 ? y + v * sy : x + (v - 31) * sx)));
    const body = f(BAG);
    C(body, p.mid);
    clipTo(body, () => { C(f(BAG_DARK), p.dark); C(f(BAG_LIT), p.lit); });
    C(f(BAG_KNOT), p.mid); C(f(BAG_KNOT_DARK), p.dark);
  }

  /** 스티로폼 겨울집: 앞면과 오른쪽 그늘면, 잘린 두께가 보이는 아치 구멍, 눈 덮인 뚜껑.
      o: { x0, x1, h, lid 색, hole: [가운데 x, 폭의 반, 꼭대기 높이], brick } · fill(): 구멍 안을 그린다 */
  function styroHouse(t, o, fill) {
    const { x0, x1, h } = o, [cx, hw, top] = o.hole, S = planes(t, STYRO), Lc = planes(t, o.lid), dx = 6, dy = 4;
    C([[x1, 0], [x1 + dx, dy], [x1 + dx, h + dy], [x1, h]], S.dark);
    C([[x0, 0], [(x0 + x1) / 2, -.6, x1, 0], [x1 + .8, h / 2, x1, h], [x0, h], [x0 - .8, h / 2, x0, 0]], S.mid);
    const hole = [[cx - hw, 2.5], [cx + hw, 2.5], [cx + hw, top - hw * .8], [cx + hw, top + hw * .25, cx - hw, top + hw * .25, cx - hw, top - hw * .8]];
    C(hole, S.dark);                                                                                // 잘린 두께(오른쪽 안 벽)
    clipTo(hole, () => C(shift(hole, -2.2, 0), t('#3a3445')));
    if (fill) fill();
    const lx0 = x0 - 4, lx1 = x1 + 2, ly = h - 2, ty = h + 5;
    C([[lx1, ly], [lx1 + dx, ly + dy], [lx1 + dx, ty + dy], [lx1, ty]], Lc.dark);
    C([[lx0, ty], [lx1, ty], [lx1 + dx, ty + dy], [lx0 + dx, ty + dy]], Lc.lit);
    rect(lx0, ly, lx1, ty, Lc.mid);
    [lx0 + 8, lx0 + 20, (lx0 + lx1) / 2 + 9, lx1 - 10].forEach((x, i) => C([[x - 1.6, ly], [x + 1.6, ly], [x, ly - 5 - (i % 2) * 3]], t('#dff1fb')));   // 고드름
    const snow = [[lx0 - 1, ty - 1.5], [lx0 + 2, ty + 5, lx0 + 14, ty + 6], [lx0 + 24, ty + 7, (lx0 + lx1) / 2, ty + 4.5],
      [lx1 - 12, ty + 8, lx1 + dx - 4, ty + dy + 2], [lx1 + dx + 1, ty + dy], [lx1, ty - 1.2], [(lx0 + lx1) / 2, ty - 2.4, lx0 - 1, ty - 1.5]];
    C(snow, t(SNOW));
    clipTo(snow, () => rect(lx0 - 2, ty - 3, lx1 + 10, ty + .4, t('#dde8f2')));
    if (!o.brick) return;
    const B = planes(t, '#c9785f'), by = ty + 2;                                                     // 바람에 뚜껑이 날아가지 않게 얹은 벽돌
    C([[10, by], [14, by + 3], [14, by + 9], [10, by + 6]], B.dark);
    C([[-8, by + 6], [10, by + 6], [14, by + 9], [-4, by + 9]], B.lit);
    rect(-8, by, 10, by + 6, B.mid);
  }

  return {
    /* C1 상자 속: 꼼짝 않는 형제들과 담요 한 조각 */
    'cat:siblingsBox': { w: 92, h: 54, d: (time, t) => {
      const box = carton(-30, 0, 1, 50, 26, 9, CARD, t), blue = planes(t, '#a8c8e8');
      box.back();
      at(-9, -25, () => curledCat(time, t, KITTEN_TABBY, .62, 0));
      at(10, -26, () => curledCat(time, t, KITTEN_WHITE, .58, 1));
      box.front();
      cut(0, 0, 1, [[-27, 28], [-14, 30, 4, 27], [8, 26], [6, 20, 9, 13], [2, 15, -3, 12], [-9, 15, -16, 12], [-21, 13, -24, 16], [-27, 22, -27, 28]], blue.mid);   // 가장자리에 걸친 담요
      cut(0, 0, 1, [[-4, 27], [8, 26], [6, 20, 9, 13], [2, 15, -3, 12], [-2, 20, -4, 27]], blue.dark);
      [[-19, 22], [-11, 19], [-15, 25]].forEach(([x, y]) => E(x, -y, 1.3, 1.3, t('#f4f1ea')));
    } },
    /* C1 해 질 녘, 슬리퍼 소리가 계단을 내려온다 */
    'cat:stairSlipper': { w: 102, h: 204, d: (time, t) => {
      const st = planes(t, '#c9c2b8'), D = [6, 4];
      cut(0, 0, 1, [[50, 0], [50 + D[0], D[1]], [50 + D[0], 64 + D[1]], [50, 64]], st.dark);
      [0, 1, 2, 3].forEach((i) => {
        const x0 = -50 + i * 22, x1 = i < 3 ? x0 + 22 : 50, top = 16 * (i + 1);
        cut(0, 0, 1, [[x0, top], [x1, top], [x1 + D[0], top + D[1]], [x0 + D[0], top + D[1]]], st.lit);     // 디딤판 윗면
        cut(0, 0, 1, [[x0, 0], [50, 0], [50, top], [x0, top]], st.mid);
      });
      at(16, -48, () => {
        ctx.scale(-1, 1);
        person(time, t, { h: 158, ...AUNTIE, arm: 'down', feet: 'slipper', slipper: { sole: '#ff8fa3', strap: '#ffd56b' }, extra: (hy, r) => auntieCurls(t)(0, hy, r) });
      });
      const p = (time * 1.5) % 1;
      faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#fffaf0'); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(-8, -50, 6 + i * 5 + p * 6, Math.PI * .9, Math.PI * 1.4); ctx.stroke(); }));
    } },

    /* C2 쪼그려 앉아 주사기로 분유를 먹여 주는 302호 아줌마 */
    'cat:auntieSyringe': { w: 53, h: 121, d: (time, t) => crouchPerson(time, t, {
      ...AUNTIE, hand: [22, -42], extra: auntieCurls(t),
      hold: (x, y) => at(x, y, () => {
        ctx.rotate(.19 + Math.sin(time * 2) * .04);
        const barrel = [[-2.8, 0], [2.8, 0], [2.8, -18.6], [1.2, -20.6], [-1.2, -20.6], [-2.8, -18.6]], steel = planes(t, '#c9c4cc');
        rod([[0, 0], [0, 8]], steel.mid, 1.2); rect(-3, 8, 3, 9.4, steel.lit);                    // 밀대
        C(barrel, t('#eef3f7'));
        clipTo(barrel, () => { rect(-3, -19, 3, -7, t('#fff6e0')); rect(1.4, -21, 3, 0, t('#d6dee6')); });
        C([[-.7, -20.4], [.7, -20.4], [.35, -24], [-.35, -24]], steel.dark);                        // 바늘 없는 끝
        E(0, 26 + (time * 8) % 5, .8, 1.1, t('#fffaf0'));
      }),
    }) },
    /* C2 분유 캔과 작은 접시: 은빛 테두리 캔, 고양이 발자국 라벨, 계량 스푼, 우유가 찰랑이는 접시 */
    'cat:formulaCan': { w: 41, h: 22.5, d: (time, t) => {
      const can = '#f2e6c9', band = '#8fc3e0';
      faded(.2, () => E(-5, -.3, 10, 1.2, t(INK)));
      const tin = planes(t, can), label = planes(t, band), body = [[-14, 0], [4, 0], [4.4, 10, 4, 19.4], [-14, 19.4], [-14.4, 10, -14, 0]];
      C(body, tin.mid);
      clipTo(body, () => {                                                                          // 원통: 왼쪽 볕 · 가운데 · 오른쪽 그늘, 파란 띠도 같은 결로
        rect(-16, -1, -11.4, 21, tin.lit); rect(-.4, -1, 6, 21, tin.dark);
        rect(-16, 6, 6, 15, label.mid); rect(-16, 6, -11.4, 15, label.lit); rect(-.4, 6, 6, 15, label.dark);
      });
      E(-7, -10.4, 1.6, 1.4, t('#ff8fa3')); [[-9, -12.6], [-7.6, -13.4], [-6, -13.2], [-4.8, -12.2]].forEach(([x, y]) => E(x, y, .6, .7, t('#ff8fa3')));
      O(-5, 19.4, 9.2, 1.7, t('#c9c4cc')); O(-5.6, 19.9, 8.4, 1.3, t('#e9e4ec'));                  // 은빛 뚜껑
      bowl(t, 11, 9, 2.4, '#e9e4ec', '#fffaf0');
      const p = (time * .6) % 1;
      faded(.5 * (1 - p), () => { ctx.strokeStyle = t('#f2e6c9'); ctx.lineWidth = .25; ctx.beginPath(); ctx.ellipse(11, -2.6, 1 + p * 5, (1 + p * 5) * .2, 0, 0, TAU); ctx.stroke(); });
      ctx.save(); ctx.translate(6, -5.2); ctx.rotate(-.25);
      RR(0, -.5, 8, 1, .5, t('#c9c4cc')); E(9.2, 0, 1.8, 1.2, t('#c9c4cc')); E(9.2, -.2, 1.3, .7, t('#fffaf0'));
      ctx.restore();
    } },

    /* C3 밥자리 지붕 아래, 그릇에 머리를 박은 치즈 */
    'cat:cheeseFirst': { w: 147, h: 62, d: (time, t) => {
      const c = CAT_COATS.cheese, fur = t(c.fur), dark = t(c.dark), chew = Math.abs(Math.sin(time * 6)) * 1.2;
      const hut = planes(t, '#e9d3b0'), roof = planes(t, '#7fb08a');                                // 급식소: 아치 입구, 박공지붕 두 장
      C([[-14, 0], [-9, 3], [-9, 43], [-14, 42]], hut.dark);
      rect(-66, 0, -14, 42, hut.mid);
      C([[-60, 0], [-20, 0], [-20, 24], [-20, 34, -40, 34], [-60, 34, -60, 24]], t('#3a3445'));
      C([[-66, 42], [-40, 58], [-14, 42]], hut.lit);
      C([[-76, 39], [-40, 62], [-40, 67], [-77, 43.5]], roof.lit);
      C([[-40, 62], [-4, 39], [-3, 43.5], [-40, 67]], roof.mid);
      bowl(t, -40, 10, 4, '#5f8fb0', '#d8f0fa');
      ctx.lineCap = 'round'; ctx.strokeStyle = fur; ctx.lineWidth = 6; ctx.beginPath();
      ctx.moveTo(-16, -22); ctx.quadraticCurveTo(-32, -30, -24 + Math.sin(time * 2) * 3, -44); ctx.stroke();
      [-13, -6, 8, 14].forEach((x) => RR(x - 3.5, -12, 7, 12, 3.5, dark));
      E(0, -21, 19, 12.5, fur); E(2, -16, 12, 6, t(c.belly));
      [-8, -2, 4].forEach((x) => RR(x, -33, 2, 6, 1, dark));
      const hx = 23, hy = -13 + chew;
      P([[hx - 9, hy - 7], [hx - 10, hy - 19], [hx - 2, hy - 10]], fur); P([[hx + 2, hy - 10], [hx + 7, hy - 19], [hx + 11, hy - 6]], fur);
      E(hx, hy, 12, 10, fur); shutEye(hx - 2, hy - 1, 1.8, t, true); shutEye(hx + 6, hy - 1, 1.8, t, true);
      blush(hx - 6, hy + 3, 2.2, 1.3);
      bowl(t, 32, 13, 6, '#e6765f', '#b7864f');
      C([[22, 6.4], [26, 9.6, 32, 9.8], [38, 9.6, 42, 6.4]], t('#b7864f'));                            // 소복한 사료
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
      const wire = planes(t, '#7d8794'), cloth = planes(t, '#e6a3b5'), tin = planes(t, '#cfd6dc'), dx = 6, dy = 4;
      C([[-41, 1.6], [41, 1.6], [41 + dx, 1.6 + dy], [-41 + dx, 1.6 + dy]], wire.lit); rect(-41, 0, 41, 1.6, wire.dark);   // 바닥 판
      rect(-36, 2, -27, 9, tin.mid); rect(-36, 4, -27, 7, t('#5f8fb0')); rect(-29.4, 2, -27, 9, tin.dark);   // 참치 캔
      O(-31.5, 9, 4.5, 1.4, t('#f2c6a0'));
      steam(-31, -11, 14, time, t('#f2c6a0'));
      faded(.3, () => { C([[-40, 35], [40, 35], [40 + dx, 35 + dy], [-40 + dx, 35 + dy]], wire.lit); C([[40, 2], [40 + dx, 2 + dy], [40 + dx, 35 + dy], [40, 35]], wire.dark); });
      ctx.strokeStyle = wire.mid; ctx.lineWidth = .6; ctx.beginPath();                                // 철망: 앞면과 윗면 결만
      for (let x = -32; x < 40; x += 8) { ctx.moveTo(x, -2); ctx.lineTo(x, -35); ctx.lineTo(x + dx, -35 - dy); }
      for (let y = 13; y < 35; y += 11) { ctx.moveTo(-40, -y); ctx.lineTo(40, -y); ctx.lineTo(40 + dx, -y - dy); }
      ctx.stroke();
      rod([[-40 + dx, 35 + dy], [40 + dx, 35 + dy], [40 + dx, 2 + dy]], wire.mid, .9);
      rod([[-40, 2], [-40, 35], [40, 35], [40, 2]], wire.dark, 1.3); rod([[40, 35], [40 + dx, 35 + dy]], wire.dark, 1.1);
      const drape = [[-45, 33], [-44, 38, -38, 40], [-6, 40.5], [-1, 39.5, 0, 36], [-2, 33.5, -8, 33], [-34, 32.5], [-36, 26, -37, 17], [-40, 19, -44, 17], [-46, 25, -45, 33]];
      C(drape, cloth.mid);                                                                           // 왼쪽 끝을 덮어 늘어뜨린 천
      clipTo(drape, () => { C([[-50, 34.5], [-34, 35.5, 2, 35], [2, 45], [-50, 45]], cloth.lit); C([[-41, 14], [-39, 26, -36, 33.2], [-32, 33.2], [-32, 14]], cloth.dark); });
      at(40, -35, () => { ctx.rotate(-1.1); faded(.3, () => R(0, 0, 33, 4, wire.lit)); ctx.strokeStyle = wire.dark; ctx.lineWidth = 1.1; ctx.strokeRect(0, 0, 33, 4); });
      faded(.5, () => E(50, -.6, 11, 1.6, t('#d9b98a')));
    } },
    /* C4 왼쪽 귀 끝이 잘린 동네 형(TNR 표시) */
    'cat:earTipCat': { w: 45, h: 56, d: (time, t) => scaleBy(1.05, () => sitCat(time, t, CAT_COATS.gray, true)) },

    /* C5 영하 12도, 담요 깔린 스티로폼 겨울집과 김 나는 물그릇 */
    'cat:winterHouse': { w: 104, h: 58, d: (time, t) => {
      styroHouse(t, { x0: -30, x1: 30, h: 42, lid: '#8fb8a8', hole: [-6, 10, 29], brick: true },
        () => C([[-16, 2.5], [4, 2.5], [4, 6], [-2, 9, -6, 7.5], [-11, 9.5, -16, 6]], t('#e6a3b5')));
      [[18, -30], [-22, -10], [22, -12]].forEach(([x, y], i) => faded(.5 + Math.sin(time * 3 + i) * .4, () => E(x, y, .9, .9, WHITE)));
      bowl(t, 42, 9, 4, '#5f8fb0', '#d8f0fa');
      steam(40, -8, 16, time, t('#ffffff')); steam(45, -8, 13, time + 1.3, t('#ffffff'));
    } },
    /* C5 방금 들어온 차, 보닛 틈에서 따뜻한 김 (D4: 새벽 시동) */
    'cat:warmBonnet': { w: 204, h: 144, d: (time, t) => {
      compactCar(t, '#7f9fc4', -95);
      C([[90, 79], [98, 81], [98.4, 70], [91, 70]], t('#fff3b8'));                                      // 전조등
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
        const tube = [[-1.6, 2], [-.6, 2.8], [.5, 2], [1.5, 2.8], [2.6, 2], [2.5, -9], [1.4, -14], [-.2, -14], [-1.5, -9]], red = planes(t, '#e6765f');
        C(tube, red.mid);
        clipTo(tube, () => { rect(1.2, -15, 3, 3, red.dark); rect(-2, -7, 3, -3, t('#fffaf0')); });
        E(.5, 16 + (time * 4) % 2, 1.4, 1.8, t('#f5c26b'));
      }),
    }) },
    /* C6 왕복 4차로: 횡단보도, 빨간 보행 신호, 쌩쌩 지나가는 불빛 */
    'cat:crosswalk': { w: 191, h: 257, d: (time, t) => {
      for (let i = 0; i < 6; i++) { const x = -90 + i * 28; P([[x, 0], [x + 14, 0], [x + 20, -7], [x + 6, -7]], t('#f4f1ea')); }
      RR(-95, -10, 190, 2, 1, t('#ffd56b'));
      const pole = planes(t, '#5f6476'), head = planes(t, '#3b3049'), shaft = [[55.6, 0], [62.4, 0], [61.6, 210], [56.4, 210]];
      C(shaft, pole.mid); clipTo(shaft, () => rect(54, 0, 57.8, 210, pole.lit));                           // 위로 가늘어지는 기둥
      C([[71, 208], [75, 211], [75, 255], [71, 252]], head.dark); C([[46, 252], [71, 252], [75, 255], [50, 255]], head.lit);
      rect(46, 208, 71, 252, head.mid);
      C([[51, 249], [67, 249], [68.6, 244], [49.4, 244]], head.lit);                                         // 신호등 차양
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
      const U = planes(t, c), tips = [-54, -23, 8, 39, 70], ext = (x) => 8 + (x - 8) * 68 / 37;
      const canopy = [[-54, 198], [-54, 222, -24, 233, 8, 233], [40, 233, 70, 222, 70, 198], [54.5, 205, 39, 196], [23.5, 205, 8, 196], [-7.5, 205, -23, 196], [-38.5, 205, -54, 198]];
      C(canopy, U.mid);
      clipTo(canopy, () => [U.lit, U.mid, U.mid, U.dark].forEach((tone, k) => C([[8, 233], [ext(tips[k]) - (k ? 0 : 30), 165], [ext(tips[k + 1]) + (k === 3 ? 30 : 0), 165]], tone)));   // 살 사이 천 네 폭
      rod([[8, 232], [8, 239]], t('#3b3049'), 2.4);
      [-54, 70].forEach((x, i) => { const p = (time * 1.3 + i * .5) % 1; faded(1 - p, () => E(x, -196 + p * 80, 1, 1.6, t('#bfe3f5'))); });
    } },
    /* C7 문이 열린 이동장, 안엔 분홍 담요와 츄르 */
    'cat:openCarrier': { w: 69, h: 48, d: (time, t) => {
      faded(.35, () => E(0, -.5, 34, 2.2, t('#9fb6d0')));
      carrierFront(t, '#8fb8a8');
      at(-2, -2 - Math.abs(Math.sin(time * 2)), () => { ctx.rotate(-.2); C([[-8, -1], [4, -1.4], [6, 0], [4, 1.4], [-8, 1], [-7.2, 0]], t('#e6765f')); });
    } },

    /* C8 7층 베란다: 조금 열린 창과 방충망, 난간 위 까치 */
    'cat:balconyWindow': { w: 134, h: 199, d: (time, t) => {
      const far = planes(t, '#b9c6d8'), rail = planes(t, '#8d8a9c'), fr = planes(t, '#e9e4ec'), sill = planes(t, '#d9cfc2');
      rect(-62, 5, 62, 185, t('#cfe6f2'));
      [[-55, 70], [-18, 95], [24, 60]].forEach(([x, h]) => { rect(x, 100, x + 30, 100 + h, far.mid); rect(x + 22, 100, x + 30, 100 + h, far.dark); rect(x + 8, 88 + h, x + 12, 92 + h, far.lit); });
      for (let x = -56; x <= 56; x += 14) rect(x, 8, x + 2.4, 88, rail.mid);
      rect(-62, 87, 62, 92, rail.mid); rect(-62, 92, 62, 94, rail.lit);                               // 난간 손잡이 윗면에 볕
      at(14, -92, () => ACTORS.magpie.d(time, t));
      faded(.22, () => { RR(-60, -183, 60, 176, 2, '#ffffff'); P([[-50, -180], [-38, -180], [-56, -60], [-60, -80]], '#ffffff'); });
      at(30, -183, () => {
        ctx.rotate(Math.sin(time * 1.5) * .015 + .02);
        faded(.45, () => RR(-28, 0, 28, 176, 1, t('#6b7280')));
        ctx.strokeStyle = t('#4b5260'); ctx.lineWidth = .3; ctx.beginPath();
        for (let y = 4; y < 176; y += 4) { ctx.moveTo(-28, y); ctx.lineTo(0, y); }
        ctx.stroke();
      });
      faded(.3, () => C([[-57, 180], [57, 180], [57, 176], [-57, 172]], t('#6b7b8c')));                   // 위 틀이 드리운 그늘
      rect(-62, 180, 62, 185, fr.lit); rect(-62, 5, 62, 10, fr.mid); rect(-62, 5, -57, 185, fr.lit); rect(57, 5, 62, 185, fr.dark);
      rect(-2, 5, 2, 180, fr.mid); rect(2, 10, 3.4, 180, fr.dark);
      rect(-66, 0, 66, 4, sill.mid); C([[-66, 4], [66, 4], [69, 7], [-63, 7]], sill.lit);
    } },
    /* C8 처음 먹어 보는 비싼 사료: 원목 받침대에 얹은 금테 도자기 그릇, 생선 모양 알갱이가 소복 */
    'cat:fancyBowl': { w: 27, h: 22.5, d: (time, t) => {
      const wood = '#c9a27c', bowl = '#c9a3e6';
      faded(.2, () => E(0, -.3, 13, 1, t(INK)));
      const W1 = planes(t, wood), B1 = planes(t, bowl), K = planes(t, '#b7864f');
      C([[-12.4, 0], [-10, 0], [-8.6, 8.8], [-10.8, 8.8]], W1.mid); C([[10, 0], [12.4, 0], [10.8, 8.8], [8.6, 8.8]], W1.dark);   // 벌어진 다리
      rect(-13, 8.6, 13, 10.6, W1.mid); C([[-13, 10.6], [13, 10.6], [14.6, 11.8], [-11.4, 11.8]], W1.lit); C([[13, 8.6], [14.6, 9.8], [14.6, 11.8], [13, 10.6]], W1.dark);
      const mound = [[-9, 16.4], [-7, 18.8, -2, 19], [2, 19.6, 5, 18.6], [8, 18, 9, 16.4]];
      C(mound, K.mid); clipTo(mound, () => C([[2.4, 15], [10, 15], [10, 21], [3.4, 21]], K.dark));
      [[-4.4, 17.8], [-.6, 18.6], [3, 18]].forEach(([x, y]) => O(x, y, .9, .55, t('#d9a86a')));      // 생선 모양 알갱이 셋
      C([[-3, 11.2], [3, 11.2], [3.6, 12.4], [-3.6, 12.4]], B1.dark);                                       // 굽
      const cup = [[-4.6, 12.2], [4.6, 12.2], [10, 13, 10.6, 16.4], [-10.6, 16.4], [-10, 13, -4.6, 12.2]];
      C(cup, B1.mid); clipTo(cup, () => rect(3.6, 11, 12, 17, B1.dark));
      rect(-10.8, 16, 10.8, 17, t('#e8c05a'));                                                              // 금테
      const tw = (Math.sin(time * 3) + 1) / 2;
      faded(tw, () => { P([[7, -22], [7.8, -19.6], [10.2, -18.8], [7.8, -18], [7, -15.6], [6.2, -18], [3.8, -18.8], [6.2, -19.6]], WHITE); });
    } },

    /* C9 식탁 위 백합 꽃병, 떨어지는 노란 꽃가루 (D7) */
    'cat:lilyTable': { w: 62, h: 157, d: (time, t) => {
      const top = planes(t, '#c9a27c'), leg = planes(t, '#b08a66');
      C([[-26.5, 0], [-22.5, 0], [-21.4, 66], [-25.6, 66]], leg.mid); C([[22.5, 0], [26.5, 0], [25.6, 66], [21.4, 66]], leg.dark);   // 아래로 가늘어지는 다리
      rect(-30, 66, 30, 71, top.mid); C([[-30, 71], [30, 71], [33, 74], [-27, 74]], top.lit); C([[30, 66], [33, 69], [33, 74], [30, 71]], top.dark);
      [[-14, -128], [6, -140], [18, -116]].forEach(([x, y]) => L(0, -98, x, y + 4, t('#7fa64e'), 1.2));
      const vase = [[-5.5, 72.5], [5.5, 72.5], [10, 76, 9.6, 84], [9, 92, 4.5, 95], [4.2, 98], [6.4, 101], [-6.4, 101], [-4.2, 98], [-4.5, 95], [-9, 92, -9.6, 84], [-10, 76, -5.5, 72.5]];
      faded(.7, () => C(vase, t('#bfe3f5')));                                                          // 배가 부른 유리병
      clipTo(vase, () => {
        C([[-12, 72], [12, 72], [12, 86], [0, 87.4, -12, 86]], t('#d8f0fa'));
        faded(.25, () => rect(4.4, 72, 12, 102, t('#7fa6c0')));
        faded(.55, () => C([[-7.6, 77], [-5.8, 77], [-5.6, 91], [-7, 90]], WHITE));
      });
      const sway = Math.sin(time * 1.2) * .08;
      lily(-14, -128, 1, -.5 + sway, t); lily(6, -140, 1.1, sway, t); lily(18, -116, .9, .6 + sway, t);
      for (let i = 0; i < 6; i++) { const p = (time * .35 + i / 6) % 1; E(-10 + i * 5 + Math.sin(p * 9) * 2, -120 + p * 48, .7, .7, t('#f5b335')); }
      [[-20, -72.6], [-12, -72.6], [12, -72.6], [24, -72.6]].forEach(([x, y]) => E(x, y, 1.3, .6, t('#f5b335')));
      E(22, -1, 5, 1.5, t('#fffaf3'));
    } },
    /* C9 언제나 옳은 택배 상자 */
    'cat:openParcel': { w: 74, h: 41, d: (time, t) => {
      carton(-24, 0, 1, 42, 25, 9, CARD, t).back();
      cartonFront(-24, 42, 25, 9, planes(t, CARD), Math.sin(time * 1.4) * 1.4);
      rect(-20, 5, -8, 13, t('#fffaf0'));                                                              // 송장 한 장
      [-18.6, -17, -14.8, -13.4, -11].forEach((x, i) => rect(x, 7, x + .7 + (i % 2) * .5, 11, t(INK)));
    } },

    /* C10 열어 둔 현관문 너머 계단과 바깥 바람 */
    'cat:openDoor': { w: 212, h: 219, d: (time, t) => {
      const fr = planes(t, '#e9e4ec'), st = planes(t, '#d9cfc2'), leaf = planes(t, '#8a95a8');
      rect(-55, 0, 55, 215, fr.mid); rect(-55, 0, -48, 215, fr.lit);
      rect(-48, 0, 48, 208, t('#f6e7c4'));
      C([[-48, 208], [48, 208], [48, 203], [-48, 199]], t(shade('#f6e7c4')));                              // 문틀 위 그늘
      [0, 1, 2, 3, 4].forEach((i) => {                                                                  // 디딤판 윗면은 밝게
        const x0 = -48 + i * 18, top = 28 + i * 24;
        rect(x0, 0, 48, top, st.mid); C([[x0, top], [48, top], [48, top + 4], [x0 + 4, top + 4]], st.lit);
      });
      rod([[-40, 60], [40, 170]], t('#8d8a9c'), 2);
      C([[48, 208], [86, 198], [86, 8], [48, 0]], leaf.mid);
      C([[48, 208], [86, 198], [86, 200.4], [48, 211]], leaf.lit); C([[80, 199.6], [86, 198], [86, 8], [80, 6.6]], leaf.dark);   // 문짝 두께
      rod([[55, 108], [62, 107]], fr.lit, 2.6); E(68, -160, 1.8, 1.8, t('#3b3049'));
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
      bowl(t, 0, 13, 6, '#c9d3de', '#9fd0ff');
      const p = (time * .8) % 1;
      faded(1 - p, () => { ctx.strokeStyle = t('#e8f6ff'); ctx.lineWidth = .4; ctx.beginPath(); ctx.ellipse(0, -6.2, 2 + p * 9, (2 + p * 9) * .22, 0, 0, TAU); ctx.stroke(); });
      E(-6, -16 + p * 9, .8, 1.1, t('#9fd0ff'));
      E(17, -.3, 2, .6, t('#bfe3f5')); E(-18, -.3, 1.4, .5, t('#bfe3f5'));
    } },
    /* C11 무릎 꿇고 손바닥을 내미는 집사 */
    'cat:ownerHand': { w: 71, h: 121, d: (time, t) => crouchPerson(time, t, {
      ...OWNER, hand: [30, -34], handAng: .35,
      extra: (hx, hy, r) => L(hx + r * .2, hy - r * .35, hx + r * .65, hy - r * .25, t('#2f2a3a'), 1),
      handPose: 'offer',
    }) },
    /* C11 자주 드나드는 화장실: 모래 결과 뭉친 덩어리, 구멍 뚫린 삽 */
    'cat:litterBox': { w: 62, h: 19, d: (time, t) => {
      const box = '#8fb8a8';
      faded(.2, () => E(0, -.3, 25, 1.2, t(INK)));
      const B = planes(t, box), sand = planes(t, '#efe3c8'), scoop = planes(t, '#c97b9c');
      const heap = [[-23, 9], [-16, 14.6, -6, 14.4], [4, 15.2, 12, 14.2], [20, 13.6, 23, 9]];
      C(heap, sand.mid); clipTo(heap, () => rect(-30, 8, -8, 14, sand.lit));                                  // 수북한 모래
      [[-10, 13.6, 2.4], [-2, 14.4, 2], [7, 13.8, 2.2]].forEach(([x, y, r]) => { C([[x - r, y - .6], [x - r, y + r * .9, x, y + r * .9], [x + r, y + r * .9, x + r, y - .6]], t('#c9b48c')); O(x - r * .3, y + r * .4, r * .35, r * .2, t('#e0d0a8')); });
      const tray = [[-23, 0], [23, 0], [25.5, 10], [-25.5, 10]];                                           // 위로 벌어진 통
      C(tray, B.mid); clipTo(tray, () => rect(16, -1, 27, 11, B.dark));
      C([[-26.6, 9.4], [26.6, 9.4], [26, 11.4], [-26, 11.4]], B.lit);                                       // 테두리 윗면
      at(22, -9, () => {                                                                                  // 구멍 뚫린 삽
        ctx.rotate(-.6);
        const blade = [[-3.8, .4], [4, .4], [4.6, 7], [4.5, 8.8, .4, 8.8], [-4.4, 8.8, -4.2, 7]];
        C([[-1, .6], [1.1, .6], [.8, -14], [-.6, -14]], scoop.mid);
        C(blade, scoop.mid); clipTo(blade, () => rect(2.4, 0, 6, 10, scoop.dark));
        [-2.4, -.4, 1.6].forEach((x) => rect(x, 2, x + 1, 7.4, scoop.deep));
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
      trashBag(-30, 0, 26, 44, '#6d7a8c', t);
      trashBag(-4, 27, 22, 40, '#8a96a8', t);
      trashBag(20, 0, 28, 48, '#5d6878', t);
      at(44, 0, () => {                                                                                 // 기름 밴 치킨 상자, 뚜껑이 들렸다
        ctx.rotate(-.05);
        const Y = planes(t, '#ffd56b');
        C([[10, 0], [14, 3], [14, 22.5], [10, 20]], Y.dark);
        rect(-14, 0, 10, 20, Y.mid);
        C([[-14, 20], [10, 20], [13.4, 27], [-10.6, 27.6]], Y.lit);
        faded(.45, () => O(-4, 9, 5, 3.4, t('#d9a24a')));
        rect(-11, 13, -1, 16, t('#e6765f'));
      });
      [[-50, -2, .4], [52, -1, -.3], [8, -3, .9]].forEach(([x, y, a]) => at(x, y, () => {
        ctx.rotate(a); RR(-3.6, -.9, 7.2, 1.8, .9, t('#fffaf0')); E(-3.6, 0, 1.4, 1.2, t('#fffaf0')); E(3.6, 0, 1.4, 1.2, t('#fffaf0'));
      }));
      at(-14, -4, () => { ctx.rotate(-.4 + Math.sin(time * 2) * .05); C([[-5, 0], [-4.6, 3.6, 0, 3.4], [3, 3, 4, 1.2], [9.6, 1.2], [10.4, 0], [9.6, -1.2], [4, -1.2], [3, -3, 0, -3.4], [-4.6, -3.6, -5, 0]], t('#c9785f')); O(-1.4, 1.4, 2.2, 1, t('#e8a07a')); rect(4, -1.2, 9.6, 1.2, t('#fffaf0')); });
    } },
    /* S1 구석에 놓인 수상한 고기: 스티로폼 접시 위 마블링 고깃덩이와 파란 알갱이(쥐약) (D9) */
    'cat:poisonMeat': { w: 34, h: 18, d: (time, t) => {
      faded(.2, () => E(0, -.3, 15, .9, t(INK)));
      const tray = planes(t, '#ece6d6'), meat = planes(t, '#c4565a'), dish = [[-15, 0], [15, 0], [16.4, 3], [-16.4, 3]];
      C(dish, tray.mid); clipTo(dish, () => rect(11, -1, 18, 4, tray.dark));                                   // 비스듬한 스티로폼 접시
      C([[-16.6, 3], [16.6, 3], [16.4, 4.2], [-16.4, 4.2]], tray.lit);
      const lump = [[-8, 3.6], [-9.6, 8, -2, 9.2, 1, 8.3], [6, 9.6, 9.6, 6.4, 8, 3.6]];
      C(lump, meat.lit);
      clipTo(lump, () => { C(shift(lump, .4, -1.2), meat.mid); C([[3.6, 2], [12, 2], [12, 10], [6, 10]], meat.dark); });   // 윗면만 볕
      rod([[-5, 6.2], [-2, 4.8, 1, 6.4]], t('#f6d6d2'), .5); rod([[2, 5], [4, 6.6, 6, 5.2]], t('#f6d6d2'), .5);        // 마블링 두 줄
      [[-11, 3.6], [10, 3.8], [4, 8.6], [-4, 8.8], [12.4, 3.4], [-1, 3.6]].forEach(([x, y]) => O(x, y, .75, .6, t('#4f8ee8')));
      faded(.35, () => [-3, 3].forEach((x, i) => {
        ctx.strokeStyle = t('#b6d68a'); ctx.lineWidth = .5; ctx.beginPath();
        for (let k = 0; k <= 10; k++) { const yy = -10 - k * .7, xx = x + Math.sin(k * .8 + time * 2 + i) * .9; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
        ctx.stroke();
      }));
    } },

    /* S2 담 위에서 내려다보는 상처투성이 수컷 */
    'cat:wallTom': { w: 131, h: 179, d: (time, t) => {
      const B = planes(t, '#c98f6e'), cap = planes(t, '#a8a2a8'), brick = t(mix('#c98f6e', '#fffaf0', .12)), dx = 6, dy = 3.5;
      C([[60, 0], [60 + dx, dy], [60 + dx, 108 + dy], [60, 108]], B.dark);                                  // 담 옆면
      rect(-60, 0, 60, 108, B.mid);
      for (let row = 0; row < 9; row++) {                                                                  // 볕 받은 벽돌 몇 장만
        for (let k = 0, x = -60 + (row % 2) * 12; x < 60; x += 24, k++) if (hash(row * 7 + k, 3) < .45) rect(Math.max(-60, x + 1), row * 12 + 1, Math.min(60, x + 23), row * 12 + 11, brick);
      }
      rect(-64, 108, 64, 114, cap.mid); C([[-64, 114], [64, 114], [64 + dx, 114 + dy], [-64 + dx, 114 + dy]], cap.lit);   // 갓돌
      C([[64, 108], [64 + dx, 108 + dy], [64 + dx, 114 + dy], [64, 114]], cap.dark);
      at(-6, -116, () => scaleBy(1.15, () => drawCat(time, false, t, CAT_COATS.scar)));
    } },
    /* S2 아무도 없는 철거 빌라와 가림막 */
    'cat:demolitionFence': { w: 182, h: 306, d: (time, t) => {
      const wall = planes(t, '#d8c9b5'), glass = planes(t, '#5a6274'), sheet = planes(t, '#f4f1ea'), band = planes(t, '#5f8fb0'), dx = 10, dy = 6;
      const brk = [[70, 246], [62, 256], [65, 266], [54, 274], [57, 286], [44, 292], [40, 300]];          // 뜯겨 나간 오른쪽 위 귀퉁이
      C([[70, 0], [70 + dx, dy], [70 + dx, 238 + dy], [70, 246]], wall.dark);
      C([[-70, 300], [40, 300], [40 + dx, 300 + dy], [-70 + dx, 300 + dy]], wall.lit);
      C([[-70, 0], [70, 0], ...brk, [-70, 300]], wall.mid);
      C([...brk, [36, 297], [41, 289], [52, 283], [49, 272], [60, 264], [57, 255], [67, 243]], wall.deep);
      [[-52, 230], [12, 230], [-52, 160], [12, 160]].forEach(([x, y]) => {
        rect(x, y, x + 40, y + 40, glass.mid); C([[x, y + 40], [x + 40, y + 40], [x + 36, y + 36], [x + 4, y + 36]], glass.dark); rect(x - 3, y - 3, x + 43, y, wall.lit);
        L(x + 4, -y - 4, x + 36, -y - 36, t('#f4f1ea'), 1.8); L(x + 36, -y - 4, x + 4, -y - 36, t('#f4f1ea'), 1.8);
      });
      for (let i = 0; i < 5; i++) {                                                                        // 골판 가림막: 한 장씩 볕·그늘이 번갈아
        const x = -90 + i * 36, top = 136 + hash(i, 7) * 6, lean = (hash(i, 8) - .5) * 3, pnl = [[x, 0], [x + 36, 0], [x + 36 + lean, top + (hash(i, 9) - .5) * 3], [x + lean, top]];
        C(pnl, i % 2 ? sheet.mid : sheet.lit);
        clipTo(pnl, () => rect(x - 5, 106, x + 41, 120, i % 2 ? band.mid : band.lit));
      }
      ctx.fillStyle = t('#d9534f'); ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('철거', 0, -72);   // 가림막에 뿌린 글씨
    } },
    /* D13 판자로 막힌 창문, 틈새로 새는 빛 */
    'cat:boardedWindow': { w: 121, h: 106, d: (time, t) => {
      const fr = planes(t, '#8d7a6a'), wood = planes(t, '#c9a27c');
      rect(-48, 10, 48, 104, fr.mid); rect(-42, 16, 42, 98, t('#3a3445'));
      C([[-42, 98], [42, 98], [38, 94], [-38, 94]], fr.deep); C([[-42, 16], [-38, 19], [-38, 94], [-42, 98]], fr.deep);   // 위·왼쪽 안 벽은 그늘
      C([[42, 16], [42, 98], [38, 94], [38, 19]], fr.lit); C([[-42, 16], [42, 16], [38, 19], [-38, 19]], fr.lit);        // 오른쪽·아래 안 벽은 볕
      rect(-53, 5, 53, 10, fr.mid); C([[-53, 10], [53, 10], [56, 13], [-50, 13]], fr.lit);                               // 창턱
      faded(.25 + Math.sin(time * 1.5) * .08, () => P([[-42, -64], [42, -60], [60, 0], [-20, 0]], t('#fff3c4')));
      [[-.15, -84], [.1, -60], [-.05, -36]].forEach(([a, y], i) => at(0, y, () => {
        ctx.rotate(a);
        const board = [[-55, -6.5], [53, -7], [56, -1], [54, 6.5], [-54, 7], [-56.5, 1 + i]];
        C(board, wood.mid); clipTo(board, () => { rect(-60, 4.4, 60, 8, wood.lit); rect(-60, -8, 60, -4.6, wood.dark); });
        [-46, 44].forEach((x) => E(x, 0, 1.2, 1.2, t('#5f6476')));
      }));
    } },

    /* S3 콜록대는 애까지 꽉 찬 공원 겨울집 (D14) */
    'cat:crowdedShelter': { w: 78, h: 69, d: (time, t) => {
      styroHouse(t, { x0: -34, x1: 34, h: 40, lid: '#5f8fb0', hole: [-4, 15, 31] }, () => {
        catFace(-11, -15, 6.5, CAT_COATS.gray, time, t, 'sleep');
        catFace(2, -14, 6, KITTEN_TABBY, time, t, 'cough');
        catFace(-4, -6, 5, CAT_COATS.hero, time + 1, t);
        C([[-19, 2.5], [11, 2.5], [11, 4.6], [-4, 7.4, -19, 4.6]], t('#e6a3b5'));
      });
      at(4, -50, () => curledCat(time, t, KITTEN_WHITE, .9, 2));
    } },
    /* S3 공원 캣맘이 앉은 벤치, 열어 둔 이동장과 사료 */
    'cat:benchCarrier': { w: 153, h: 148, d: (time, t) => {
      const I = planes(t, '#5f6476'), Wd = planes(t, '#b98a5e');
      [-66, 60].forEach((lx) => {                                                                          // 무쇠 옆틀: 퍼진 발, 뒤로 젖혀진 등받이 기둥
        const leg = [[lx - 2.5, 0], [lx + 8.5, 0], [lx + 6, 4], [lx + 6, 44], [lx + 9, 88], [lx + 3, 88], [lx, 44], [lx, 4]];
        C(leg, I.mid); clipTo(leg, () => C([[lx + 4, 0], [lx + 12, 0], [lx + 12, 90], [lx + 7, 90], [lx + 4, 44]], I.dark));
      });
      [[79, 88], [63, 72]].forEach(([y0, y1]) => { rect(-75, y0, 75, y1, Wd.mid); rect(-75, y1 - 1.6, 75, y1, Wd.lit); });
      rect(-77, 40, 77, 45, Wd.mid); rect(-77, 40, 77, 41.4, Wd.dark); C([[-77, 45], [77, 45], [80, 49], [-74, 49]], Wd.lit);   // 앉는 판
      bowl(t, 10, 9, 4, '#e6765f', '#b7864f');
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
      compactCar(t, c, -70);
      ctx.save(); ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 18; C([[-101, 77], [-95, 78], [-95, 91], [-100, 92]], '#ffffff'); ctx.restore();   // 후진등
      C([[-101, 62], [-95.6, 63], [-95.6, 72], [-101, 72]], t('#e6765f'));
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
