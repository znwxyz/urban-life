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
  /* 길고양이 눈높이(화면 폭 약 5m)에 맞춘 실제 크기: 참새 14cm, 사람 160~170cm, 포클레인 4.5m.
     참새는 작아서 1.8배로 키워 그린다. 흰 점 참새(정수리에 흰 깃 하나)가 이야기 내내 같은 새다 */
  const SP = Object.freeze({ back: '#a5744c', dark: '#6b4630', crown: '#8e4a2c', cheek: '#f6f1e8', belly: '#ddd3c6', bib: '#2f2a3a', beak: '#3b3049', leg: '#c9927a' });
  const GRANNY = { top: '#c97b9c', bottom: '#6b5f7c', hair: '#d6d2da' };
  const GUARD = { top: '#3d4c66', bottom: '#2f3a50', hair: '#8d8a9c' };
  const POT = '#e3b65a', TUFT = '#f2a65a', SPARROW_K = 1.8;

  const scaleBy = (k, draw) => { ctx.save(); ctx.scale(k, k); draw(); ctx.restore(); };
  const at = (x, y, draw) => { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); };
  const faded = (a, draw) => { ctx.save(); ctx.globalAlpha *= a; draw(); ctx.restore(); };

  /* ── 형체감 있는 색종이 오리기: forms.js의 planes·cut·within을 장면 좌표(원점 발밑)에 쓴다. 이 도구들만 y가 위로 + ── */
  const C = (pts, c) => cut(0, 0, 1, pts, c);
  const clipTo = (pts, draw) => within(0, 0, 1, pts, draw);
  const shift = (pts, dx, dy) => pts.map((q) => q.map((v, i) => v + (i % 2 ? dy : dx)));
  const rect = (x0, y0, x1, y1, c) => C([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], c);
  const O = (x, y, rx, ry, c) => E(x, -y, rx, ry, c);
  /** 굵기 있는 선(난간·손잡이·철사). 점 형식: [x,y] 또는 [cx,cy,x,y] (y는 위로 +) */
  function rod(pts, c, w) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    pts.forEach((q, i) => {
      if (!i) ctx.moveTo(q[0], -q[1]);
      else if (q.length === 2) ctx.lineTo(q[0], -q[1]);
      else ctx.quadraticCurveTo(q[0], -q[1], q[2], -q[3]);
    });
    ctx.stroke();
  }
  /** 글자는 뒤집혀 그려져도 거울글씨가 되지 않게 바로 세운다 */
  function say(text, x, y, size, c) {
    ctx.save(); ctx.translate(x, y); if (ctx.getTransform().a < 0) ctx.scale(-1, 1);
    ctx.fillStyle = c; ctx.font = `800 ${size}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(text, 0, 0); ctx.restore();
  }
  /** 제자리에서 떠올랐다 사라지는 울음소리 */
  function call(time, t, text, x, y, size) {
    const ph = (time * .8) % 1;
    faded(Math.min(1, (1 - ph) * 1.6), () => say(text, x, y - ph * size * .7, size, t(INK)));
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

  /* ── 참새(Passer montanus). 원점 발밑, 오른쪽을 본다, 몸길이 14cm × k.
     o: { k, pose: 'perch'|'alarm'|'fur'|'chick', spot(정수리 흰 점), seed } ── */
  function sparrow(time, t, o = {}) {
    const k = o.k || SPARROW_K, pose = o.pose || 'perch', seed = o.seed || 0, chick = pose === 'chick';
    const hop = pose === 'perch' ? Math.max(0, Math.sin(time * 2.2 + seed)) ** 10 * 1.2 : 0;
    const flick = pose === 'alarm' ? -.45 - Math.abs(Math.sin(time * 9 + seed)) * .35 : -.12;
    ctx.save(); ctx.translate(0, -hop); ctx.scale(k, chick ? k * (1 + Math.sin(time * 3) * .03) : k);
    const back = t(chick ? mix(SP.back, '#ffffff', .2) : SP.back), dark = t(SP.dark), belly = t(SP.belly);
    at(-4.2, -5.4, () => { ctx.rotate(flick); curvy([[0, -1.3], [-(chick ? 2 : 6.2), -1.5], [-(chick ? 2.6 : 6.8), 0, -(chick ? 2 : 6.2), .9], [0, 1.2]], dark); });
    ctx.lineCap = 'round'; L(-.4, -2.4, -.9, 0, t(SP.leg), .55); L(1.2, -2.4, 1.4, 0, t(SP.leg), .55);
    L(-1.6, 0, .2, 0, t(SP.leg), .4); L(.5, 0, 2.4, 0, t(SP.leg), .4);
    E(0, -5, chick ? 5 : 5.4, chick ? 4.2 : 3.7, belly);
    curvy([[-5.3, -5.6], [-3.4, -9.3, 1.6, -8.8], [4.2, -8.2, 4.8, -6.4], [1.6, -6.2, -1, -4.6], [-3.8, -3.8, -5.3, -5.6]], back);
    curvy([[-4.6, -6], [-2.4, -8.2, 1.4, -7.6], [-.2, -6.2, -1.4, -5], [-3.4, -4.6, -4.6, -6]], dark);   // 날개
    L(-3, -6.4, .4, -7.2, t(SP.cheek), .5);                                                           // 흰 날개띠
    const hx = 4.2, hy = chick ? -8.4 : -8.8;
    E(hx, hy, 3.1, 2.9, t(SP.cheek));
    curvy([[hx - 3.1, hy], [hx - 3, hy - 3.2, hx + .4, hy - 3.1], [hx + 3, hy - 3, hx + 3.2, hy - .6], [hx + 1.4, hy - 1.4, hx - .4, hy - .9], [hx - 2, hy - .6, hx - 3.1, hy]], t(chick ? mix(SP.crown, '#ffffff', .25) : SP.crown));
    if (o.spot) E(hx + .2, hy - 2.7, .9, .55, t('#ffffff'));
    if (!chick) { E(hx + .6, hy + 1.1, .85, .7, t(SP.bib)); E(hx + 2.2, hy + 2.4, .9, .9, t(SP.bib)); }   // 뺨 점과 턱 밑 검은 턱받이
    cuteEye(hx + 1.6, hy - .6, .65, .7, time + seed, t);
    blush(hx + 1.4, hy + 1.4, .7, .4);
    const bx = hx + 2.9, open = pose === 'alarm' ? .5 + Math.abs(Math.sin(time * 10 + seed)) * .9 : chick ? .4 + Math.abs(Math.sin(time * 6)) * .8 : 0;
    P([[bx, hy - .6 - open * .3], [bx + 1.8, hy - .1 - open * .5], [bx, hy + .1]], t(SP.beak));
    P([[bx, hy + .2], [bx + 1.6, hy + .4 + open * .4], [bx, hy + .9]], t(SP.beak));
    if (chick) { E(bx - .1, hy + .1, .5, .7, t('#ffe07a')); }                                           // 노란 부리 가장자리
    if (pose === 'fur') {                                                                             // 부리에 문 털 뭉치
      const w = Math.sin(time * 3) * .3;
      [[2.2, .6, 2.2, 1.5, 0], [3.6, 1.8 + w, 1.8, 1.3, .25], [1.4, 2.4, 1.6, 1.1, .1]].forEach(([dx, dy, rx, ry, l]) => E(bx + dx, hy + dy, rx, ry, t(mix(TUFT, '#ffffff', l))));
      ctx.strokeStyle = t(TUFT); ctx.lineWidth = .25; ctx.beginPath();
      [-.4, .3, 1].forEach((a, i) => { ctx.moveTo(bx + 4.6, hy + 1.6); ctx.quadraticCurveTo(bx + 6, hy + 1 + a + w, bx + 7 + i * .4, hy + 2.4 + a * 1.4 + w); });
      ctx.stroke();
    }
    ctx.restore();
  }

  /** 쪼그려 앉은 사람(키 약 160). o: 옷색, hand [x,y], hold(hx,hy) 손에 든 것, extra 머리장식 */
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
    const [gx, gy] = [ax + Math.cos(ang) * HAND_HOLD[pose][0] * S, ay + sway + Math.sin(ang) * HAND_HOLD[pose][0] * S];
    if (o.hold) o.hold(gx, gy);
    artHandOnArm(t, ax, ay + sway, ang, S, { pose });
  }

  /** 양은 냄비: 금빛 몸통, 양쪽 손잡이, 밥에 비빈 멸치 (y는 위로 +, 바닥 가운데가 원점) */
  function pot(t, x, y, w, heap) {
    const p = planes(t, POT), h = w * .42;
    at(x, -y, () => {
      rod([[-w / 2 - 3, h * .8], [-w / 2, h * .8]], p.dark, 1.6); rod([[w / 2, h * .8], [w / 2 + 3, h * .8]], p.dark, 1.6);
      const body = [[-w / 2 + 1, 0], [w / 2 - 1, 0], [w / 2, h], [-w / 2, h]];
      C(body, p.mid); clipTo(body, () => { rect(w * .18, -1, w, h + 1, p.dark); rect(-w, h * .55, w, h * .62, p.lit); });
      O(0, h, w / 2, w * .1, p.lit); O(0, h + .3, w / 2 - 1.2, w * .08, t('#f6efe0'));
      if (heap) [[-.25, .2], [0, -.1], [.22, .15], [-.05, .3]].forEach(([u, v]) => at(u * w, -h - 1 + v * 2, () => { ctx.rotate(u * 3); E(0, 0, 2.2, .6, t('#b9c2cc')); E(1.8, 0, .5, .45, t(INK)); }));
    });
  }

  /** 앞에서 본 통덫 위로 천을 덮었다 (참치 캔은 열린 입구 쪽) */
  function trapUnderCloth(time, t) {
    const wire = planes(t, '#7d8794'), cloth = planes(t, '#8fa3c4'), tin = planes(t, '#cfd6dc');
    C([[-46, 1.6], [46, 1.6], [52, 5.6], [-40, 5.6]], wire.lit); rect(-46, 0, 46, 1.6, wire.dark);
    rect(30, 2, 39, 9, tin.mid); rect(30, 4, 39, 7, t('#5f8fb0')); rect(36.6, 2, 39, 9, tin.dark);
    O(34.5, 9, 4.5, 1.4, t('#f2c6a0')); steam(35, -11, 14, time, t('#f2c6a0'));
    ctx.strokeStyle = wire.mid; ctx.lineWidth = .6; ctx.beginPath();
    for (let x = 18; x < 46; x += 8) { ctx.moveTo(x, -2); ctx.lineTo(x, -36); }
    ctx.stroke(); rod([[46, 2], [46, 36]], wire.dark, 1.3);
    const drape = [[-52, 0], [-50, 20, -47, 36], [-40, 44, -20, 43], [20, 43], [26, 42, 28, 36], [26, 26, 24, 14], [20, 18, 16, 12], [12, 30, 8, 4], [-20, 2], [-40, -1, -52, 0]];
    C(drape, cloth.mid);
    clipTo(drape, () => { C([[-60, 34], [-10, 40, 30, 37], [30, 50], [-60, 50]], cloth.lit); C([[0, -2], [12, 40], [30, 40], [30, -2]], cloth.dark); });
    rod([[-44, 30], [-30, 34, -10, 33]], cloth.dark, .8);
  }

  /** 뒤에서 본 1톤 트럭: 바퀴 둘, 범퍼, 은색 뒷문, 빨간 미등. load(): 짐칸 위에 실린 것 (y는 위로 +, 짐칸 바닥 = 72) */
  function truckRear(t, load) {
    const gate = planes(t, '#c9ced6'), blue = planes(t, '#5f86ad');
    [-62, 62].forEach((x) => { C([[x - 15, 0], [x + 15, 0], [x + 16, 30], [x - 16, 30]], t('#2f2a3a')); rect(x - 15, 26, x + 15, 30, t('#4a4458')); });
    rect(-80, 26, 80, 40, blue.dark); rect(-80, 38, 80, 40, blue.mid);                                       // 범퍼
    rect(-12, 28, 12, 36, t('#f4f1ea'));                                                                     // 번호판
    C([[-84, 40], [84, 40], [84, 74], [-84, 74]], gate.mid);
    clipTo([[-84, 40], [84, 40], [84, 74], [-84, 74]], () => { rect(-90, 70, 90, 76, gate.lit); rect(50, 38, 90, 76, gate.dark); [-42, 0, 42].forEach((x) => rect(x - 1, 44, x + 1, 70, gate.dark)); });
    [-82, 76].forEach((x) => rect(x, 46, x + 6, 58, t('#e2483f')));                                           // 미등
    if (load) load();
  }

  return {
    /* C1 꽁지깃 세 개: 계단 바닥에 떨어진 갈색 깃털, 끝이 바람에 들썩 */
    'cat:threeFeathers': { w: 40, h: 8, d: (time, t) => scaleBy(1.5, () => {
      [[-8, -.6, .25, 0], [0, -.4, -.15, 1], [8, -.8, .4, 2]].forEach(([x, y, a, i]) => at(x, y, () => {
        ctx.rotate(a + Math.sin(time * 2 + i) * .05);
        const f = planes(t, i === 1 ? SP.back : SP.dark);
        curvy([[-6, 0], [-2, -1.6, 4, -1.2], [6.5, -.4, 6, .3], [1, 1.2, -6, 0]], f.mid);
        curvy([[-6, 0], [0, -.4, 6, .1], [1, 1.2, -6, 0]], f.dark);
        L(-6.5, .1, 5.5, -.2, t('#f4f1ea'), .25);
      }));
    }) },
    /* C1 장독 뚜껑 위에서 짹짹 화를 내는 흰 점 참새 */
    'cat:jangdokSparrow': { w: 64, h: 84, d: (time, t) => {
      const jar = planes(t, '#8a5a3e'), lid = planes(t, '#7a4e36');
      const body = [[-13, 0], [13, 0], [30, 26, 16, 54], [-16, 54], [-30, 26, -13, 0]];
      C(body, jar.mid);
      clipTo(body, () => { C([[6, -1], [34, -1], [34, 56], [10, 56]], jar.dark); C([[-30, 6], [-22, 30, -24, 54], [-16, 54], [-15, 30, -20, 6]], jar.lit); });
      C([[-20, 53], [20, 53], [17, 60], [-17, 60]], lid.mid); O(0, 60, 17, 2.4, lid.lit); O(0, 61.2, 4, 1.6, lid.dark);
      at(2, -62, () => sparrow(time, t, { pose: 'alarm', spot: true, seed: 1 }));
      call(time, t, '짹짹!', 22, -86, 7);
    } },
    /* C2 낮 동안 볕을 먹은 평상, 그 위 낡은 라디오 */
    'cat:pyeongsang': { w: 150, h: 58, d: (time, t) => {
      const wood = planes(t, '#c9a27c'), radio = planes(t, '#d9584a');
      [-66, -6, 54].forEach((x, i) => { rect(x, 0, x + 6, 38, i === 2 ? wood.dark : wood.mid); });
      C([[-72, 38], [68, 38], [76, 44], [-64, 44]], wood.lit);
      rect(-72, 34, 68, 38, wood.mid); C([[68, 34], [76, 40], [76, 44], [68, 38]], wood.dark);
      for (let x = -60; x < 68; x += 14) rod([[x, 38.4], [x + 6, 43.6]], wood.dark, .5);
      C([[20, 44], [44, 44], [44, 58], [20, 58]], radio.mid); C([[44, 44], [48, 47], [48, 61], [44, 58]], radio.dark); C([[20, 58], [44, 58], [48, 61], [24, 61]], radio.lit);
      O(27, 51, 4, 4, t('#3b3049')); rect(34, 49, 41, 54, t('#f4f1ea')); rod([[42, 61], [52, 80]], t('#c9c4cc'), .7);
      const p = (time * .7) % 1;
      faded(1 - p, () => [0, 1].forEach((i) => { ctx.strokeStyle = t('#3b3049'); ctx.lineWidth = .7; ctx.beginPath(); ctx.arc(14, -52, 3 + i * 3 + p * 3, Math.PI * .8, Math.PI * 1.2); ctx.stroke(); }));
    } },
    /* C2 쪼그려 앉아 평상 밑에 양은 냄비를 놓는 가게 할머니 */
    'cat:grandmaPot': { w: 60, h: 122, d: (time, t) => crouchPerson(time, t, {
      ...GRANNY, hand: [24, -22],
      extra: (hx, hy, r) => [-.7, -.2, .3].forEach((k) => E(hx + r * k, hy - r * .8, r * .38, r * .34, t(GRANNY.hair))),
      hold: (x, y) => pot(t, x + 2, 2, 22, true),
    }) },
    /* C3 전봇대 발판 위에서 짹짹짹짹 깨우는 흰 점 참새 */
    'cat:sparrowAlarm': { w: 70, h: 236, d: (time, t) => {
      const pole = planes(t, '#b9b4ae'), shaft = [[-8, 0], [8, 0], [6.4, 236], [-6.4, 236]];
      C(shaft, pole.mid); clipTo(shaft, () => { rect(-10, -1, -3, 240, pole.lit); rect(3, -1, 10, 240, pole.dark); });
      [70, 110, 150].forEach((y, i) => { rod([[i % 2 ? -6 : 6, y], [i % 2 ? -20 : 20, y]], t('#6f6a74'), 2.2); });
      rect(-8, 120, 8, 150, t('#f4f1ea')); [-1, 1].forEach((k) => rod([[-5, 135 + k * 6], [5, 135 + k * 6]], t('#5f8fb0'), 1.4));   // 붙은 전단지
      at(17, -152, () => sparrow(time, t, { pose: 'alarm', spot: true, seed: 2 }));
      call(time, t, '짹짹짹짹!', 30, -180, 8);
    } },
    /* C4 대문 앞에 내놓은 다 탄 연탄재, 아직 김이 오른다 */
    'cat:yeontanAsh': { w: 52, h: 48, d: (time, t) => {
      const ash = planes(t, '#ece2d4'), burnt = planes(t, '#d9a88a');
      [[-14, 0, ash], [4, 0, burnt], [-5, 15, ash]].forEach(([x, y, p]) => {
        C([[x, y], [x + 15, y], [x + 15, y + 14], [x, y + 14]], p.mid);
        C([[x + 11, y], [x + 15, y], [x + 15, y + 14], [x + 11, y + 14]], p.dark);
        O(x + 7.5, y + 14, 7.5, 2, p.lit);
        [-3, 0, 3].forEach((k) => O(x + 7.5 + k, y + 14, .8, .45, t('#8d8a9c')));
      });
      O(2.5, 30, 6, 1.6, t('#ffffff'));                                                               // 맨 위에 쌓인 눈
      steam(-2, -32, 16, time, t('#ffffff')); steam(4, -32, 13, time + 1.4, t('#ffffff'));
    } },
    /* C4·D4 골목 끝에 세워 둔 용달차, 그 밑에 고인 물. 단맛이 나는 부동액이 섞였다 */
    'cat:antifreeze': { w: 180, h: 80, d: (time, t) => {
      faded(.85, () => O(0, .3, 60, 4, t('#9fd0c6')));
      faded(.7, () => { O(-20, .5, 22, 1.6, t('#d8f07a')); O(14, .4, 12, 1.1, t('#f2a3d0')); });
      truckRear(t);
      const p = (time * .9) % 1;
      O(-24, 40 - p * 38, 1, 1.5, t('#b6e3a0'));
    } },
    /* C5 옥상 바닥에 날린 내 털 뭉치 */
    'cat:furTufts': { w: 30, h: 4, d: (time, t) => {
      [[-10, 0], [0, 1], [9, 2]].forEach(([x, i]) => at(x, -1, () => {
        ctx.rotate(Math.sin(time * 1.6 + i) * .12);
        E(-1.4, .2, 2, 1.1, t(TUFT)); E(1.2, -.2, 2.2, 1.3, t(TUFT)); E(0, -.9, 1.6, 1, t(mix(TUFT, '#ffffff', .35)));
        ctx.strokeStyle = t(TUFT); ctx.lineWidth = .25; ctx.beginPath(); ctx.moveTo(3, 0); ctx.quadraticCurveTo(4.4, -.8, 5.4, -.2 + i * .3); ctx.stroke();
      }));
    } },
    /* C5 내 털을 부리 가득 문 흰 점 참새 */
    'cat:furSparrow': { w: 26, h: 16, d: (time, t) => sparrow(time, t, { pose: 'fur', spot: true, seed: 3 }) },
    /* C6 평상 밑에 남기고 간 냄비, 통째로 부은 멸치 봉지 */
    'cat:potLeft': { w: 54, h: 16, d: (time, t) => {
      faded(.2, () => E(0, -.3, 26, 1.4, t(INK)));
      pot(t, -6, 0, 26, true);
      at(16, -1, () => { ctx.rotate(-.12);                                                          // 뜯어서 다 부은 멸치 봉지
        faded(.75, () => curvy([[0, 0], [16, 0], [18, -5, 15, -10], [3, -11], [0, -6, 0, 0]], t('#eef3f6')));
        [[3, -2.4], [8, -3.4], [12, -2], [6, -6.4], [11, -7]].forEach(([x, y], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(i * .5); E(0, 0, 2, .55, t('#b9c2cc')); E(1.7, 0, .45, .4, t(INK)); ctx.restore(); });
        R(2, -10.6, 12, 2.4, t('#d9473f')); });
    } },
    /* C6 할머니 이삿짐을 실은 1톤 트럭(뒤에서 본): 서랍장, 꽃무늬 이불 보따리, 고무 대야, 고무줄로 묶었다 */
    'cat:movingTruck': { w: 170, h: 210, d: (time, t) => truckRear(t, () => {
      const ward = planes(t, '#b98a5e'), quilt = planes(t, '#e6a3b5'), tub = planes(t, '#d9473f');
      C([[-78, 74], [-6, 74], [-6, 170], [-78, 170]], ward.mid);
      clipTo([[-78, 74], [-6, 74], [-6, 170], [-78, 170]], () => { rect(-20, 72, -4, 172, ward.dark); [100, 126, 152].forEach((y) => rect(-80, y, -4, y + 2, ward.dark)); });
      C([[-78, 170], [-6, 170], [-12, 176], [-72, 176]], ward.lit);
      [113, 139, 162].forEach((y) => O(-42, y, 3, 1.2, t('#e8c05a')));
      const bundle = [[-2, 74], [70, 74], [80, 96, 72, 124], [50, 140, 26, 136], [2, 142, -6, 118], [-10, 96, -2, 74]];
      C(bundle, quilt.mid); clipTo(bundle, () => { rect(44, 70, 84, 146, quilt.dark); [[16, 92], [40, 116], [58, 90], [20, 124]].forEach(([x, y]) => O(x, y, 5, 5, t('#fff3c4'))); });
      C([[30, 140], [32, 128, 46, 126], [60, 128, 62, 140], [50, 144, 38, 144]], quilt.lit);                   // 보따리 매듭
      C([[-70, 176], [-14, 176], [-20, 200], [-64, 200]], tub.mid); O(-42, 200, 22, 4, tub.lit);
      rod([[-80, 150], [0, 130], [76, 110]], t('#2f2a3a'), 1.4); rod([[-80, 100], [0, 96], [80, 90]], t('#2f2a3a'), 1.4);   // 고무줄
    }) },
    /* C7 빈집 걸레받이에 난 쥐구멍, 어둠 속에서 쥐 코가 들락날락 */
    'cat:ratHole': { w: 40, h: 22, d: (time, t) => {
      const hole = [[-12, 0], [12, 0], [12, 8], [10, 16, 0, 16], [-10, 16, -12, 8]];
      C(hole, t('#2a2330'));
      const peek = Math.max(0, Math.sin(time * 1.3)) * 4;
      clipTo(hole, () => {
        E(-1 + peek, -6, 5, 4, t('#8d8590')); E(3.4 + peek, -6.4, 1.2, 1, t(BLUSH));
        E(.6 + peek, -8, .9, .9, t(INK)); E(.8 + peek, -8.3, .3, .3, WHITE);
        ctx.strokeStyle = t('#d6d0d8'); ctx.lineWidth = .2; ctx.beginPath(); [-1, 0, 1].forEach((k) => { ctx.moveTo(3.4 + peek, -6.2); ctx.lineTo(8 + peek, -6.6 + k * 1.2); }); ctx.stroke();
      });
      [[-15, 1], [15, 1], [-6, 17], [7, 17]].forEach(([x, y]) => O(x, y, 1.6, .9, t('#c9b89a')));
    } },
    /* C7 두고 간 배불뚝이 TV: 나무 무늬 상자, 볼록한 브라운관, 토끼 귀 안테나 */
    'cat:oldTv': { w: 76, h: 86, d: (time, t) => {
      const box = planes(t, '#9a7656'), glass = planes(t, '#5f6a70');
      C([[30, 0], [36, 5], [36, 55], [30, 50]], box.dark);
      C([[-30, 50], [30, 50], [36, 55], [-24, 55]], box.lit);
      rect(-30, 0, 30, 50, box.mid);
      const scr = [[-25, 8], [12, 8], [14, 26, 12, 44], [-25, 44], [-27, 26, -25, 8]];
      C(scr, glass.mid); clipTo(scr, () => { C([[-30, 30], [-20, 46], [-4, 46], [-24, 28]], glass.lit); faded(.25, () => rect(-30, 6, 16, 46, t('#9fb6c4'))); });
      [32, 22].forEach((y) => O(21, y, 2.4, 2.4, t('#3b3049')));
      rect(17, 8, 26, 12, t('#3b3049'));
      rod([[0, 55], [-16, 84]], t('#8d8a9c'), .9); rod([[2, 55], [20, 82]], t('#8d8a9c'), .9);
      O(1, 55.5, 4, 1.6, t('#3b3049'));
      faded(.3, () => O(-6, 50.8, 22, 1, t('#fffaf0')));                                           // 위에 쌓인 먼지
    } },
    /* C7·D5 쥐 끈끈이: 노란 끈끈한 판 위에 멸치 두 마리 */
    'cat:glueTrap': { w: 50, h: 6, d: (time, t) => scaleBy(1.4, () => {
      const tray = planes(t, '#f4f1ea');
      C([[-17, 0], [17, 0], [18.4, 2.4], [-15.6, 2.4]], tray.lit); rect(-17, 0, 17, .6, tray.dark);
      C([[-15, .8], [15, .8], [16, 2], [-14, 2]], t('#f2d36b'));
      faded(.5 + Math.sin(time * 2) * .3, () => O(-6, 1.7, 5, .3, '#ffffff'));
      [[-5, 1.8, .2], [5, 1.6, -.3]].forEach(([x, y, a]) => at(x, -y, () => { ctx.rotate(a); E(0, 0, 3, .7, t('#b9c2cc')); E(2.6, 0, .6, .55, t(INK)); }));
    }) },
    /* C8 천 덮인 철망 상자, 열린 입구 쪽에 참치 캔 */
    'cat:coveredTrap': { w: 106, h: 46, d: (time, t) => trapUnderCloth(time, t) },
    /* C8 손전등으로 빈집을 들여다보는 구조 활동가 */
    'cat:flashlightPerson': { w: 120, h: 166, d: (time, t) => {
      const H = 162, hx = .22 * H, hy = -.61 * H + Math.sin(time * 3) * H * .01;
      faded(.28, () => P([[hx + 6, hy - 1], [hx + 6, hy + 3], [hx + 80, 0], [hx + 30, 0]], t('#fff3c4')));
      person(time, t, { h: H, top: '#7fae92', bottom: '#4a5060', hair: '#2f2a3a', arm: 'out' });
      at(hx + 1, hy, () => { ctx.rotate(.5); RR(-2, -2.2, 10, 4.4, 1.5, t('#3b3049')); RR(7, -3, 3, 6, 1, t('#fff3c4')); });
    } },
    /* C9 포클레인이 뜯어낸 기왓장 더미, 그 위를 오가는 흰 점 참새 */
    'cat:tileRubble': { w: 120, h: 50, d: (time, t) => {
      const tile = planes(t, '#5d6478'), wood = planes(t, '#9a7656');
      at(0, -10, () => { ctx.rotate(-.2); RR(-40, -3, 80, 6, 2, wood.mid); R(-40, -3, 80, 2, wood.lit); });
      [[-40, 4, .4], [-22, 10, -.3], [-4, 16, .2], [16, 8, -.5], [34, 4, .3], [-12, 4, 0], [6, 24, .1], [24, 14, .6], [-30, 14, -.1]].forEach(([x, y, a], i) => at(x, -y, () => {
        ctx.rotate(a);
        curvy([[-9, 2], [-8, -4, 0, -5], [8, -4, 9, 2], [6, 1, 0, 0], [-6, 1, -9, 2]], i % 3 ? tile.mid : tile.dark);
        curvy([[-7, -2], [-4, -4.2, 2, -4.2], [-2, -3, -7, -2]], tile.lit);
      }));
      at(4, -28, () => sparrow(time, t, { spot: true, seed: 4 }));
      for (let i = 0; i < 6; i++) { const p = (time * .3 + i / 6) % 1; faded((1 - p) * .5, () => E(-40 + i * 16 + Math.sin(p * 6 + i) * 4, -10 - p * 40, 3 + p * 6, 2 + p * 4, t('#e9e2d6'))); }
    } },
    /* C9·D6 지붕을 물어뜯는 포클레인 팔: 위에서 내려온 노란 붐과 암, 기와를 문 버킷 */
    'cat:excavator': { w: 190, h: 330, d: (time, t) => {
      const Y = planes(t, '#f2b632'), steel = planes(t, '#8d8a9c'), sw = Math.sin(time * .9) * .03;
      at(70, -330, () => {
        ctx.rotate(sw);
        ctx.lineCap = 'round';
        ctx.strokeStyle = Y.dark; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(80, -60); ctx.lineTo(0, 0); ctx.stroke();
        ctx.strokeStyle = Y.mid; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, 230); ctx.stroke();
        ctx.strokeStyle = Y.lit; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(-34, 220); ctx.stroke();
        ctx.strokeStyle = steel.lit; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(14, 20); ctx.lineTo(-8, 200); ctx.stroke();   // 유압 실린더
        O(0, 0, 14, 14, Y.dark); O(-30, -230, 10, 10, steel.dark);
        at(-30, 260, () => {
          ctx.rotate(.15);
          curvy([[-46, -24], [40, -30], [50, 4, 30, 38], [-10, 44, -46, 24]], steel.mid);
          curvy([[-46, -24], [40, -30], [36, -18], [-42, -12]], steel.lit);
          curvy([[20, -20], [44, -26], [48, 4, 30, 36], [24, 10]], steel.dark);
          [[-22, -30], [-4, -36], [14, -30]].forEach(([x, y]) => curvy([[x - 11, y + 4], [x, y - 7, x + 11, y + 4]], t('#5d6478')));
          [-36, -18, 0, 18].forEach((x) => P([[x, 40], [x + 8, 40], [x + 4, 52]], steel.dark));
        });
      });
      for (let i = 0; i < 5; i++) { const p = (time * .35 + i / 5) % 1; faded((1 - p) * .45, () => E(-30 + i * 22, -20 - p * 50, 6 + p * 10, 4 + p * 6, t('#e9e2d6'))); }
    } },
    /* C10 종이컵에 사료를 담아 내려놓는 공사장 경비 아저씨 */
    'cat:guardCup': { w: 64, h: 128, d: (time, t) => crouchPerson(time, t, {
      ...GUARD, hand: [26, -24],
      extra: (hx, hy, r) => { RR(hx - r * 1.05, hy - r * 1.05, r * 2, r * .7, r * .3, t(GUARD.top)); RR(hx + r * .4, hy - r * .55, r * 1, r * .22, r * .1, t('#2f2a3a')); },
      hold: (x, y) => at(x + 2, y + 4, () => {
        const cup = planes(t, '#f4f1ea');
        P([[-4, -6], [4, -6], [3, 4], [-3, 4]], cup.mid); R(-3.6, -2, 7.2, 2.4, t('#b98a5e')); P([[1.6, -6], [4, -6], [3, 4], [1.2, 4]], cup.dark);
        E(0, -6, 4, 1, cup.lit);
      }),
    }) },
    /* C10 공사 안내판 쇠파이프 구멍에서 고개를 내민 흰 점 참새, 삐져나온 지푸라기 */
    'cat:signSparrow': { w: 120, h: 170, d: (time, t) => {
      const pipe = planes(t, '#9aa0ac'), board = planes(t, '#f4f1ea');
      [-42, 42].forEach((x, i) => { rect(x - 2.5, 0, x + 2.5, 118, i ? pipe.dark : pipe.mid); rect(x - 2.5, 0, x - 1, 118, pipe.lit); });
      C([[-50, 118], [50, 118], [50, 168], [-50, 168]], board.mid); C([[50, 118], [54, 121], [54, 171], [50, 168]], board.dark);
      rect(-50, 156, 50, 168, t('#3f6fa8'));
      say('공사 안내', 0, -159, 9, t('#fffdf5'));
      [146, 138, 130].forEach((y, i) => rod([[-40, y], [30 - i * 12, y]], t('#8d8a9c'), 1.4));
      rect(-56, 104, 54, 111, pipe.mid); rect(-56, 109, 54, 111, pipe.lit);                            // 가로 파이프
      O(54, 107.5, 3.6, 3.6, t('#2a2330'));                                                         // 열린 끝
      rod([[56, 106], [60, 102]], t('#e8cf8a'), .5); rod([[56, 109], [61, 111]], t('#e8cf8a'), .5);
      const peek = Math.max(0, Math.sin(time * 1.1)) * 2.4;
      ctx.save(); ctx.beginPath(); ctx.rect(53, -150, 40, 50); ctx.clip();
      at(46 + peek, -100, () => sparrow(time, t, { spot: true, seed: 5 }));
      ctx.restore();
    } },
    /* C11 회양목 밑으로 떨어진 참새 새끼: 짧은 꽁지, 노란 부리 가장자리 */
    'cat:fallenChick': { w: 16, h: 13, d: (time, t) => {
      sparrow(time, t, { pose: 'chick', seed: 6, k: 1.2 });
      const fl = Math.abs(Math.sin(time * 7)) * .6;
      faded(.8, () => at(-1, -6.5, () => { ctx.rotate(-.6 - fl); E(-2, 0, 3.4, 1.4, t(SP.dark)); }));
    } },
    /* C11·D9 처음 보는 젊은 고양이: 턱시도 무늬, 몸을 낮추고 엉덩이를 씰룩 */
    'cat:youngTom': { w: 66, h: 40, d: (time, t) => {
      const wig = Math.sin(time * 9) * .05;
      at(0, 0, () => { ctx.scale(1, .82); at(-8, -14, () => { ctx.rotate(wig); ctx.translate(8, 14); drawCat(time, false, t, { fur: '#3b3445', dark: '#2a2433', belly: '#f4f1ea' }); }); });
    } },
    /* C11 둥근 회양목 위에서 짹짹대는 늙은 흰 점 참새 */
    'cat:shrubSparrow': { w: 90, h: 76, d: (time, t) => {
      const leaf = planes(t, '#4f7f5c');
      const bush = [[-42, 0], [-50, 12, -44, 24], [-50, 38, -34, 44], [-30, 58, -12, 56], [-4, 66, 12, 58], [28, 64, 34, 50], [48, 46, 44, 30], [52, 14, 40, 0]];
      C(bush, leaf.mid);
      clipTo(bush, () => { C([[10, -2], [16, 40, 6, 64], [50, 64], [50, -2]], leaf.dark); C([[-40, 20], [-30, 42, -8, 54], [-20, 40, -32, 22]], leaf.lit); });
      at(-2, -58, () => sparrow(time, t, { pose: 'alarm', spot: true, seed: 7 }));
      call(time, t, '짹짹짹!', -20, -82, 8);
    } },
    /* D8 뒤로 오는 덤프트럭: 흙 실은 짐칸, 후진등, 삐삐 */
    'cat:dumpTruck': { w: 440, h: 300, d: (time, t) => {
      const bed = planes(t, '#e07a3a'), cab = planes(t, '#f4f1ea'), dirt = planes(t, '#9a7656');
      C([[-200, 100], [-180, 250], [130, 250], [130, 100]], bed.mid);
      clipTo([[-200, 100], [-180, 250], [130, 250], [130, 100]], () => { rect(90, 90, 140, 260, bed.dark); rect(-210, 236, 140, 252, bed.lit); });
      curvy([[-180, -250], [-140, -290, -60, -284], [40, -292, 128, -252]], dirt.mid);
      C([[140, 70], [230, 70], [236, 210], [190, 250], [140, 250]], cab.mid);
      C([[160, 160], [214, 160], [212, 220], [160, 230]], t('#cfe3ea'));
      rect(-200, 70, 236, 100, t('#3a3445'));
      [-150, -70, 180].forEach((wx) => { O(wx, 44, 44, 44, t('#2f2a3a')); O(wx, 44, 18, 18, t('#cfcad8')); });
      ctx.save(); ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 18; rect(-206, 120, -198, 140, '#ffffff'); ctx.restore();
      if (Math.sin(time * 8) > 0) call(time, t, '삐- 삐-', -170, -170, 22);
    } },
    /* B1 생선 대가리를 던져 주는 시장 생선 가게 아저씨 */
    'cat:fishTosser': { w: 174, h: 168, d: (time, t) => {
      person(time, t, { h: 170, top: '#7d8fa6', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'up',
        extra: (hy, r) => RR(-r * 1.05, hy - r * .7, r * 2.1, r * .35, r * .17, t('#f4f1ea')) });
      RR(-15, -125, 30, 70, 8, t('#e9f1f4')); RR(-14, -40, 13, 38, 4, t('#ffd56b')); RR(1, -40, 13, 38, 4, t(shade('#ffd56b')));
      const p = (time * .45) % 1, fishHead = (x, y, rot) => at(x, y, () => {
        ctx.rotate(rot);
        E(0, 0, 6, 4.2, t('#9fb3c4')); E(1, 1.2, 4.5, 2.2, t('#dfe7ee'));
        RR(-7, -4, 3, 8, 1.5, t('#e6765f'));
        E(2.2, -1, 1.5, 1.5, WHITE); E(2.5, -1, .8, .8, t(INK));
      });
      if (p < .7) { const q = p / .7; fishHead(25 + q * 55, -150 + q * 146 - Math.sin(q * Math.PI) * 45, q * 7); }
      else fishHead(80, -4, 0);
    } },
    /* B1·D7 구석에 놓인 수상한 고기: 스티로폼 접시 위 고깃덩이와 파란 알갱이(쥐약) */
    'cat:poisonMeat': { w: 34, h: 18, d: (time, t) => {
      faded(.2, () => E(0, -.3, 15, .9, t(INK)));
      const tray = planes(t, '#ece6d6'), meat = planes(t, '#c4565a'), dish = [[-15, 0], [15, 0], [16.4, 3], [-16.4, 3]];
      C(dish, tray.mid); clipTo(dish, () => rect(11, -1, 18, 4, tray.dark));
      C([[-16.6, 3], [16.6, 3], [16.4, 4.2], [-16.4, 4.2]], tray.lit);
      const lump = [[-8, 3.6], [-9.6, 8, -2, 9.2, 1, 8.3], [6, 9.6, 9.6, 6.4, 8, 3.6]];
      C(lump, meat.lit);
      clipTo(lump, () => { C(shift(lump, .4, -1.2), meat.mid); C([[3.6, 2], [12, 2], [12, 10], [6, 10]], meat.dark); });
      [[-11, 3.6], [10, 3.8], [4, 8.6], [-4, 8.8], [12.4, 3.4], [-1, 3.6]].forEach(([x, y]) => O(x, y, .75, .6, t('#4f8ee8')));
      faded(.35, () => [-3, 3].forEach((x, i) => {
        ctx.strokeStyle = t('#b6d68a'); ctx.lineWidth = .5; ctx.beginPath();
        for (let k = 0; k <= 10; k++) { const yy = -10 - k * .7, xx = x + Math.sin(k * .8 + time * 2 + i) * .9; if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy); }
        ctx.stroke();
      }));
    } },
  };
})());
