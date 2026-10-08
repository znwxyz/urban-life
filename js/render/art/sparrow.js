/* 참새 장면 전용 그림과 주인공 참새. 키는 'sparrow:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   참새 눈높이(화면 폭 약 4m)에 맞춰 실제 크기로 그린다: 참새 14cm, 아이 손 13cm, 간판 120cm.
   실루엣은 SVG 경로(Path2D)로 오리고, 색은 2~4겹 종이처럼 겹친다. Node에서는 키 목록만 내보낸다 */
(function register(art, hero) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else { Object.assign(ACTORS, art); ANIMALS.sparrowHero = hero; }
})(...(() => {
  const SP = Object.freeze({ cap: '#9a5636', capDark: '#7a3f26', back: '#b98a5e', streak: '#5e4030', wing: '#a87650',
    wingTip: '#6b4a32', bar: '#f7efe0', belly: '#efe4d2', breast: '#d9ccb8', cheek: '#fbf6ec', spot: '#2f2a3a',
    beak: '#3b3049', leg: '#c9937a', tail: '#7a5a3e' });
  const JUV = Object.freeze({ ...SP, cap: '#a98262', capDark: '#8a6a52', spot: '#8a7a70', beak: '#e8c24a' });
  const STRAW = ['#d9b26a', '#c49a5a', '#e8cf94', '#b98a5e'];
  const YELLOW_STRING = '#f2c230', RICE = '#fbf7ee', GAPE = '#ffd56b', MOUTH = '#ff7a6b', LEAF = ['#5f8f68', '#6fa275', '#86b98a'];
  const HERO_SCALE = 1.35;

  /* ── 종이 오리기 도구 ── */
  const PATHS = new Map();
  function path(d) { if (!PATHS.has(d)) PATHS.set(d, new Path2D(d)); return PATHS.get(d); }
  function fp(d, c) { ctx.fillStyle = c; ctx.fill(path(d)); }
  function sp(d, c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(path(d)); }
  function faded(a, draw) { ctx.save(); ctx.globalAlpha *= a; draw(); ctx.restore(); }
  function at(x, y, r, s, draw) { ctx.save(); ctx.translate(x, y); if (r) ctx.rotate(r); if (s) ctx.scale(s[0], s[1]); draw(); ctx.restore(); }
  /** 글자는 뒤집혀 그려져도 거울글씨가 되지 않게 바로 세운다 */
  function label(text, x, y, font, color, align = 'left') {
    ctx.save(); ctx.translate(x, y); if (ctx.getTransform().a < 0) ctx.scale(-1, 1);
    ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.fillText(text, 0, 0); ctx.restore();
  }
  function notes(time, text, x, y, size) {
    const ph = (time * .5) % 1;
    faded(1 - ph, () => label(text, x, y - ph * 8, `700 ${size}px sans-serif`, INK));
  }

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
    curvy([[x, y], [x + w, y], [x + w + .5, y + h * .5, x + w, y + h], [x, y + h], [x - .5, y + h * .5, x, y]], p.mid);
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
  /** 천장 슬래브 앞모서리: 위 모서리에 볕, 아랫면은 그늘 */
  function ceiling(t, x, y, w, h) {
    const p = planes(t, '#cfcad8');
    R(x, y, w, h, p.mid); R(x, y, w, h * .22, p.lit); R(x, y + h * .7, w, h * .3, p.dark);
  }

  /* ── 참새 한 마리 (실제 크기 14cm). o: { x, y, s, flip, pose: stand|peck|puff|dust|fly, c 깃털색, seed, worm, sleepy, gape, white 하얀 깃털 } ── */
  const BODY = 'M3.2 -6.2 C5.3 -4.6 4.3 -1.3 1 -1.1 C-1.7 -.9 -3.7 -2.4 -4.3 -4.4 C-3 -6.7 0 -7.4 3.2 -6.2 Z';
  const BELLY = 'M3.7 -5 C4.4 -3 3 -1.3 .8 -1.2 C-1.4 -1.1 -2.9 -2 -3.3 -3.2 C-1 -3.4 2 -4 3.7 -5 Z';
  const TAIL = 'M-3.2 -3.4 L-7.4 -2.5 Q-7.9 -3.5 -7.3 -4.4 L-3 -5.3 Z';
  const WING = 'M2.5 -6.3 C.4 -6.9 -3.1 -6.1 -5.7 -4.2 C-3.4 -3.2 -.6 -3.3 1.7 -4.1 C2.7 -4.7 2.9 -5.7 2.5 -6.3 Z';
  const WING_TIP = 'M-2.2 -4.6 L-5.7 -4.2 L-3 -3.5 Z';
  const CAP = 'M1 -7.5 C.9 -10 5.4 -10.4 5.9 -7.9 C4.6 -8.6 2.6 -8.4 1 -7.5 Z';
  const BIB = 'M4.9 -6.3 Q5.8 -5.3 4.7 -4.6 Q4.1 -5.4 4.9 -6.3 Z';
  const FLAP = 'M.6 -.1 C-1 -2.7 -3.5 -6.2 -6.2 -7.3 C-5.8 -4.8 -4.5 -1.7 -2.4 .3 Z';
  /** 엄마(와 막내) 왼쪽 날개에 섞인 하얀 깃털 한 장 */
  const WHITE_QUILL = 'M1.2 -5.3 C-.6 -5.5 -2.6 -5 -4.6 -4.1 C-2.6 -4.3 -.6 -4.6 1.2 -4.8 Z';
  const WHITE_FEATHER = '#fbfaf4';

  function head(time, t, c, o) {
    E(3.4, -7.3, 2.5, 2.4, t(c.breast));
    fp(CAP, t(c.cap)); sp('M1.3 -8.3 Q3 -9.5 5.2 -8.7', t(c.capDark), .25);
    E(3.2, -6.8, 1.75, 1.25, t(c.cheek)); E(2.6, -6.6, .45, .38, t(c.spot));
    fp(BIB, t(c.spot));
    if (o.sleepy) sp('M4.3 -7.9 Q4.7 -7.6 5.1 -7.9', t(INK), .2); else cuteEye(4.6, -7.9, .5, .6, time + (o.seed || 0), t);
    if (o.gape) { P([[5.6, -8], [7.3, -8.9], [5.8, -7.3]], t(c.beak)); P([[5.7, -7.2], [7.1, -6.5], [5.6, -6.7]], t(c.beak)); E(5.6, -7.3, .4, .4, t(GAPE)); }
    else P([[5.6, -7.8], [7, -7.1], [5.6, -6.6]], t(c.beak));
    if (o.worm) sp('M6 -7.1 q1 1.2 2.3 .4 q1 -.8 2 .2', t('#93c26a'), .5);
  }

  function wingFolded(t, c, white) {
    fp(WING, t(c.wing)); fp(WING_TIP, t(c.wingTip));
    sp('M1.6 -5.8 C.2 -5.9 -1.8 -5.4 -3.4 -4.6', t(c.streak), .22); sp('M2 -5 C.4 -4.8 -1.2 -4.4 -2.6 -3.9', t(c.streak), .22);
    sp('M1.8 -6.2 Q.2 -6.5 -1.5 -6', t(c.bar), .3);
    if (white) fp(WHITE_QUILL, t(WHITE_FEATHER));
  }

  function wingOpen(time, t, c, o) {
    const f = o.flap === undefined ? Math.sin(time * 22 + (o.seed || 0)) : o.flap;
    at(1, -6.2, 0, [1, .25 + .75 * f], () => {
      fp(FLAP, t(c.wing)); fp('M-6.2 -7.3 C-5.4 -6 -5 -4.6 -4.6 -3.2 L-3.4 -5.8 Z', t(c.wingTip));
      sp('M-.8 -1.6 Q-2.6 -3.4 -4 -5.6', t(c.bar), .3);
      if (o.white) sp('M-1.8 -1 Q-3.6 -3.2 -5 -6', t(WHITE_FEATHER), .6);
    });
  }

  function sparrow(time, t, o = {}) {
    const c = o.c || SP, pose = o.pose || 'stand', seed = o.seed || 0;
    const hop = pose === 'stand' ? Math.max(0, Math.sin(time * 3 + seed)) ** 8 * 1.2 : 0;
    ctx.save(); ctx.translate(o.x || 0, (o.y || 0) - hop); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose === 'puff') ctx.scale(1.12, 1.18);
    if (pose === 'peck') { ctx.translate(0, -1); ctx.rotate(.45 + Math.abs(Math.sin(time * 5 + seed)) * .25); ctx.translate(0, 1); }
    if (pose === 'dust') { ctx.translate(0, 1.4); ctx.rotate(Math.sin(time * 9 + seed) * .12); }
    if (pose !== 'puff' && pose !== 'dust') {
      [[-.3, -.6], [1.2, 1.4]].forEach(([x0, x1]) => { L(x0, -1.3, x1 - .5, 0, t(c.leg), .35); L(x1 - .5, 0, x1 + .5, 0, t(c.leg), .25); });
    }
    at(0, 0, pose === 'fly' ? 0 : -.08 + Math.sin(time * 2 + seed) * .05, null, () => fp(TAIL, t(c.tail)));
    fp(BODY, t(c.back)); fp(BELLY, t(c.belly));
    sp('M-1 -6.4 L-2 -5.8 M.6 -6.7 L-.4 -6.1', t(c.streak), .25);
    if (pose === 'fly' || pose === 'dust') wingOpen(time, t, c, { seed, white: o.white, flap: pose === 'dust' ? .1 + Math.abs(Math.sin(time * 9 + seed)) * .3 : o.flap });
    else wingFolded(t, c, o.white);
    head(time, t, c, o);
    ctx.restore();
  }

  /** 둥지에서 입을 쩍 벌린 새끼 (몸통 아래가 원점). open 0~1 */
  function chick(time, t, x, y, seed, s = 1) {
    const open = .5 + Math.abs(Math.sin(time * 5 + seed * 1.7)) * .5, sway = Math.sin(time * 4 + seed) * .12;
    at(x, y, sway, [s, s], () => {
      E(0, -2, 2.6, 2.2, t('#c9b49a')); E(.4, -4.6, 2, 1.9, t('#b9a084'));
      [-1, 0, 1].forEach((k) => sp(`M${k * .6} -6.3 l${k * .3} -.9`, t('#e9dcc4'), .25));
      sp('M.6 -5 Q1 -4.7 1.4 -5', t(INK), .2);
      at(1.6, -4.6, -.9, null, () => {
        fp(`M0 -.6 L${3.4} ${-.9 - open * 1.4} L${3.2} ${-.4} Z`, t(GAPE));
        fp(`M0 .5 L${3.4} ${.9 + open * 1.2} L${3.1} ${.3} Z`, t(GAPE));
        fp(`M.2 -.4 L3 ${-.7 - open * 1.1} L3 ${.7 + open * .9} L.2 .4 Z`, t(MOUTH));
        E(.2, 0, .7, .9, t(GAPE));
      });
    });
  }

  /** 지푸라기·비닐 끈으로 엮은 둥지 덩어리 */
  function strawNest(t, cx, y, w, h, seed) {
    const p = planes(t, STRAW[0]), x0 = cx - w / 2, x1 = cx + w / 2, top = y - h, n = 18;
    const tips = Array.from({ length: n - 1 }, (_, k) => {                                // 들쭉날쭉 삐져나온 지푸라기 끝
      const x = x1 - (k + 1) * w / n;
      return k % 2 ? [x, top + h * .1] : [x + (hash(k, seed) - .5) * 1.2, top - .2 - hash(k, seed + 1) * .9];
    });
    const shape = [[x0, top + h * .2], [x0 - 2, y - h * .2, x0 + w * .2, y, cx, y], [x1 - w * .2, y, x1 + 2, y - h * .2, x1, top + h * .2], ...tips];
    curvy(shape, p.mid);
    inside(shape, () => {
      E(cx + w * .26, y + h * .1, w * .46, h * .62, p.dark);                               // 오른쪽 아래로 도는 그늘
      curvy([[x0 - 3, top - 4], [x1 + 3, top - 4], [x1 + 3, top + h * .34], [cx, top + h * .58, x0 - 3, top + h * .34]], p.lit);   // 볕 받는 테두리
    });
    [[0, YELLOW_STRING], [1, YELLOW_STRING], [2, STRAW[3]], [3, STRAW[1]]].forEach(([i, col]) => {   // 엮인 노란 비닐끈 두 가닥과 지푸라기 두 올
      const x = x0 + w * (.18 + i * .2), yy = y - h * (.3 + hash(i, seed) * .3), a = (hash(i, seed + 2) - .5) * 1.4, l = 4 + hash(i, seed + 3) * 4;
      ctx.strokeStyle = t(col); ctx.lineWidth = .5; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(x - Math.cos(a) * l / 2, yy - Math.sin(a) * l / 2); ctx.quadraticCurveTo(x, yy - 1, x + Math.cos(a) * l / 2, yy + Math.sin(a) * l / 2); ctx.stroke();
    });
  }

  /** 덤불: 잎 덩어리를 한 실루엣(그늘)으로 붙이고, 앞면을 왼쪽 위로 조금 얹고, 위쪽 덩어리만 볕을 받는다 */
  function bush(time, t, cx, w, h, seed) {
    const leaf = planes(t, LEAF[1]), blobs = [];
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 9; i++) {
        const x = cx - w / 2 + (i + .5) / 9 * w + (hash(i, seed + layer) - .5) * 8, yy = -h * (.35 + layer * .2) * (.7 + hash(i, seed + 9) * .5);
        const r = h * (.32 - layer * .06) * (.8 + hash(i, seed + 4) * .4), sway = Math.sin(time * 1.4 + i + layer) * .6;
        blobs.push([x + sway, yy, r, layer]);
      }
    }
    clump(blobs.map(([x, y, r]) => [x + 1.4, y + 1.6, r, r * .8]), leaf.dark);
    clump(blobs.filter((b) => b[3]).map(([x, y, r]) => [x - .6, y - .8, r * .94, r * .74]), leaf.mid);
    clump(blobs.filter(([x, , , layer]) => layer === 2 && x < cx).map(([x, y, r]) => [x - r * .2, y - r * .24, r * .6, r * .42]), leaf.lit);
  }

  /** 하얗게 피어오르는 연기·김 덩어리 */
  function puffs(time, t, o) {
    for (let i = 0; i < o.n; i++) {
      const ph = (time * o.speed + i / o.n) % 1, x = o.x + o.dx * ph + Math.sin(i * 2.1 + time) * o.wob, y = o.y + o.dy * ph;
      faded(o.alpha * (1 - ph), () => E(x, y, o.r * (.5 + ph), o.r * (.45 + ph * .9), t(o.color || WHITE)));
    }
  }

  /* ── 큰 새들 ── */
  function crowHead(t, open) {
    E(12, -30, 6, 5.6, t('#1f1b28'));
    fp(`M16 -32 C20 -33 25 -31 28 -29 C24 -29.5 20 -29.8 16.5 -29.6 Z`, t('#2a2535'));
    fp(`M16.5 -28.8 C20 ${-28 + open} 23 ${-26.8 + open} 26 ${-25.6 + open} C22 ${-25.5 + open} 19 -26.5 16 -27 Z`, t('#2a2535'));
    if (open > 0) fp(`M17 -29.3 L25 ${-28.5 + open * .5} L17 -27.4 Z`, t(MOUTH));
  }

  const KES = Object.freeze({ rufous: '#c8784a', grey: '#8f9bb0', buff: '#f2dcc0', tip: '#4a3a3a', cere: '#ffd56b' });

  function kestrelHead(time, t, x, y) {
    E(x, y, 4.3, 4, t(KES.grey)); E(x + .6, y + 1.4, 2.4, 1.6, t(KES.buff));
    sp(`M${x + .2} ${y + .2} L${x - .4} ${y + 2.6}`, t(KES.tip), .7);
    cuteEye(x + 1.4, y - .6, .8, .9, time, t);
    fp(`M${x + 3.2} ${y - 1} Q${x + 5.6} ${y - .8} ${x + 5} ${y + 1.6} L${x + 3.4} ${y + .6} Z`, t(KES.tip));
    E(x + 3.4, y - .6, .7, .6, t(KES.cere));
  }

  /** 정지비행: 몸을 세우고 두 날개를 머리 위로 치며 꼬리를 부채처럼 편다. 원점은 꼬리 끝 */
  function kestrelHover(time, t) {
    const f = .35 + .65 * Math.abs(Math.sin(time * 16));
    fp('M-3 -14 L-8 -1 Q-2 2 4 -1 L1 -14 Z', t(KES.grey));
    sp('M-7.2 -3 Q-2 -.4 3.4 -3', t(KES.tip), 1); sp('M-7.8 -1.2 Q-2 1.6 3.8 -1.2', t('#f4f1ea'), .5);
    at(-1, -26, 0, [1, f], () => fp('M0 0 C-4 -6 -10 -14 -18 -18 C-16 -12 -10 -4 -4 4 Z', t(shade(KES.rufous))));
    fp('M5 -30 C9 -26 7 -15 1 -13 C-3 -12 -5 -18 -4 -24 C-3 -28 1 -31 5 -30 Z', t(KES.rufous));
    fp('M6 -27 C8 -22 6 -15 2 -13.5 C1 -18 3 -23 6 -27 Z', t(KES.buff));
    [[4.6, -22], [3.6, -18], [5, -17]].forEach(([x, y]) => E(x, y, .45, .7, t(KES.tip)));
    at(1, -25, 0, [1, f], () => {
      fp('M0 0 C-2 -8 -6 -18 -12 -24 C-12 -16 -9 -6 -4 4 Z', t(KES.rufous));
      fp('M-12 -24 C-11 -20 -10 -17 -9 -14 L-6 -16 C-8 -19 -10 -22 -12 -24 Z', t(KES.tip));
      [[-4, -6], [-6, -11], [-3, -12]].forEach(([x, y]) => E(x, y, .7, .5, t(KES.tip)));
    });
    kestrelHead(time, t, 6, -33);
  }

  /** 급강하: 날개를 접고 발톱을 앞으로. 원점은 몸통 가운데 */
  function kestrelDive(time, t) {
    fp('M-13 -3 L-25 -4.4 Q-27.4 -1.6 -25 1.2 L-13 1 Z', t(KES.grey)); sp('M-24 -4 Q-25.6 -1.6 -24 .8', t(KES.tip), 1);
    fp('M10 -4 C12 1 6 3 -2 2.5 C-10 2 -14 0 -16 -2 C-10 -6 2 -8 10 -4 Z', t(KES.rufous));
    fp('M10 -1 C9 2 4 3 -2 2.5 C-6 2 -9 1 -10 .4 C-4 .4 4 0 10 -1 Z', t(KES.buff));
    fp('M6 -5 C0 -11 -12 -13 -26 -11 C-15 -8 -4 -4 2 -2 Z', t(shade(KES.rufous)));
    fp('M-14 -11 C-18 -11.6 -22 -11.6 -26 -11 C-22 -9.6 -18 -8.6 -15 -7.8 Z', t(KES.tip));
    [[-4, -7], [-8, -8], [-1, -5.5]].forEach(([x, y]) => E(x, y, .7, .5, t(KES.tip)));
    kestrelHead(time, t, 12, -4);
    const reach = Math.sin(time * 4) * .6;
    [[2, 2], [5, 1.6]].forEach(([x, y]) => { L(x, y, x + 5 + reach, y + 4, t(KES.cere), 1); sp(`M${x + 5 + reach} ${y + 4} q1.4 .2 1.8 1.6`, t(INK), .5); });
  }

  function magpieBody(time, t) {
    const f = .45 + .55 * Math.abs(Math.sin(time * 9));
    fp('M-6 -22 L-34 -36 L-32 -31 L-6 -18 Z', t('#2d3a4a')); sp('M-10 -21.5 L-31 -33', t('#4f8a8a'), .8);
    at(-1, -26, 0, [1, f], () => fp('M0 0 C-4 -6 -8 -14 -16 -20 C-14 -12 -10 -4 -4 4 Z', t('#151220')));
    fp('M10 -28 C14 -24 12 -16 4 -14 C-4 -12 -9 -16 -9 -20 C-7 -26 2 -30 10 -28 Z', t('#1f1b28'));
    fp('M8 -19 C6 -15 0 -14 -5 -15.6 C-2 -18.5 3 -19.6 8 -19 Z', t('#f4f1ea'));
    fp('M5 -27 C1 -27 -3 -25.5 -6 -23 C-2 -23.4 2 -24.6 5 -27 Z', t('#f4f1ea'));
    at(1, -25, 0, [1, f], () => {
      fp('M0 0 C-2 -8 -6 -18 -12 -24 C-13 -16 -10 -6 -5 4 Z', t('#1f1b28'));
      fp('M-12 -24 C-11.5 -20 -10.6 -16 -9.4 -12.6 L-7.4 -14 C-8.6 -17 -10 -20.6 -12 -24 Z', t('#f4f1ea'));
      sp('M-3 -3 C-5 -8 -7 -12 -9 -16', t('#4f6d9a'), .6);
    });
    E(13, -31, 4.6, 4.3, t('#1f1b28'));
    cuteEye(14.4, -32, .85, .95, time, t);
    const open = Math.abs(Math.sin(time * 5)) * 1.6;
    fp('M17 -32.6 L23 -31 L17 -30.2 Z', t('#2a2535')); fp(`M17 -30 L22 ${-29 + open} L17 -29 Z`, t('#2a2535'));
    [[4, -14], [7, -14.6]].forEach(([x, y]) => { L(x, y, x + 4, y + 10, t('#3b3049'), .9); sp(`M${x + 4} ${y + 10} q2 0 3 1.6`, t('#3b3049'), .5); });
  }

  /* ── 사람 ── */
  function crouchKid(time, t) {
    const pink = t('#ff8fa3'), pinkD = t(shade('#ff8fa3')), jean = t('#5f8fb0'), jeanD = t(shade('#5f8fb0'));
    const lean = Math.sin(time * 1.5) * 1.2;
    RR(-16, -5, 16, 5, 2.5, t(shade('#f4f1ea'))); RR(2, -5, 18, 5, 2.5, t('#f4f1ea')); RR(2, -2, 18, 2, 1, t('#e6765f'));
    fp('M-10 -40 C-2 -44 14 -44 18 -36 L12 -4 L4 -4 L9 -30 C2 -30 -6 -28 -12 -26 Z', jeanD);
    fp('M-12 -38 C-4 -42 12 -42 16 -34 C14 -30 10 -28 6 -28 C0 -28 -6 -26 -12 -24 Z', jean);
    at(lean, 0, 0, null, () => {
      fp('M-14 -34 C-16 -50 -8 -68 6 -70 C14 -70 18 -64 16 -58 C10 -50 6 -42 4 -34 Z', pink);
      fp('M-10 -36 C-11 -46 -6 -58 2 -64 C-2 -54 -4 -46 0 -36 Z', pinkD);
      ctx.strokeStyle = pink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(8, -62); ctx.quadraticCurveTo(22, -52, 28, -34); ctx.stroke();
      // 맨팔이라 손을 먼저 그리고 둥근 팔 끝으로 손목을 덮어 이음매를 숨긴다
      artHandOnArm(t, 30.6, -25, 1.15 + Math.sin(time * 2) * .08, 13, { pose: 'offer' });
      ctx.strokeStyle = t(SKIN); ctx.lineWidth = 5.5; ctx.beginPath(); ctx.moveTo(27, -36); ctx.lineTo(31, -24); ctx.stroke();
      E(15, -80, 11.5, 12, t(SKIN));
      fp('M3 -82 C2 -96 22 -98 27 -86 C22 -88 14 -90 10 -86 C8 -84 6 -80 4 -76 Z', t('#2f2a3a'));
      fp('M2 -80 C-4 -78 -6 -72 -3 -68 C0 -72 2 -76 4 -78 Z', t('#2f2a3a'));
      E(4, -86, 3, 3, t('#ff8fa3'));
      cuteEye(21.5, -80, 1.3, 1.6, time, t); blush(22, -75, 2.4, 1.3);
      sp('M23 -72 Q25 -70.5 26.5 -72.5', t('#c9645a'), .9);
    });
  }

  function hero(time, moving, eye, t) {
    const bob = Math.sin(time * 3) * 1.5;
    ctx.save(); ctx.translate(0, -eye + bob); ctx.scale(HERO_SCALE, HERO_SCALE);
    blush(4.8, -6.1, .9, .5);
    sparrow(time, t, { pose: 'fly', flap: Math.sin(time * (moving ? 26 : 16)), seed: 0 });
    ctx.restore();
  }

  const art = {
    /* S1 간판 뒤 둥지: 세탁소 간판과 벽 틈에 끼운 지푸라기 둥지, 입 벌린 새끼들, 애벌레 물고 온 엄마 */
    'sparrow:signNest': { w: 130, h: 70, d: (time, t) => {
      faded(.35, () => R(-62, -56, 124, 7, '#2a2240'));
      strawNest(t, -26, -48, 40, 12, 3);
      [[-38, 0], [-29, 1], [-20, 2]].forEach(([x, s]) => chick(time, t, x, -50, s));
      const iron = planes(t, '#7d7a8c');
      [-48, 44].forEach((x) => { R(x - 2, -55, 4, 9, iron.mid); R(x - 2, -55, 1.4, 9, iron.lit); });             // 벽에 박은 받침쇠
      box3(t, '#f6eedc', -62, -46, 112, 44, 8);
      R(-62, -46, 112, 6, t('#e6765f')); R(-62, -8, 112, 6, t('#5f8fb0'));
      label('행복 세탁', -6, -19, '800 17px sans-serif', t('#3b3049'), 'center');
      at(-46, -28, 0, null, () => { RR(-5, -8, 10, 12, 2, t('#5f8fb0')); fp('M-6 -8 L0 -12 L6 -8 Z', t('#5f8fb0')); E(0, -3, 2.4, 2.4, t('#f6eedc')); });
      sparrow(time, t, { x: 8, y: -48, flip: true, worm: true, white: true, seed: 2 });
    } },
    /* S2 덤불 속 엄마: 쥐똥나무 덤불 사이로 애벌레를 문 엄마와 꼬리 짧은 동생 */
    'sparrow:bushParent': { w: 100, h: 60, d: (time, t) => {
      bush(time, t, 0, 96, 58, 5);
      at(0, 0, 0, null, () => { L(-10, 0, -14, -30, t('#6b4f3a'), 1.6); L(6, 0, 12, -26, t('#6b4f3a'), 1.4); L(-12, -18, 6, -22, t('#6b4f3a'), 1); });
      sparrow(time, t, { x: -4, y: -21, worm: true, seed: 1 });
      sparrow(time, t, { x: 16, y: -24, c: JUV, pose: 'puff', flip: true, gape: true, seed: 3 });
      [[-30, -40, 1], [28, -46, 2], [38, -18, 3]].forEach(([x, y, i]) => E(x + Math.sin(time + i) * .5, y, 1.6, 1.6, t(i % 2 ? '#f4f1ea' : '#ffe9b0')));
    } },
    /* S2 쪼그려 앉아 손을 뻗는 아이: "아기 새다!" */
    'sparrow:kidReach': { w: 50, h: 95, d: (time, t) => {
      crouchKid(time, t);
      label('아기 새다!', 14, -102, '700 7px sans-serif', t(INK), 'center');
    } },

    /* B1 신발 상자: 수건 깐 상자, 병뚜껑 물그릇, 불린 사료 */
    'sparrow:shoeBox': { w: 72, h: 22, d: (time, t) => {
      at(0, -13, -.1, null, () => box3(t, '#e8e3d8', -20, -7, 36, 6, 4));                                       // 뒤에 기대 세운 뚜껑
      const box = planes(t, '#f4f1ea');
      curvy([[-20, -14], [-16, -16.4], [20, -16.4], [16, -14]], box.deep);                                        // 열린 안쪽
      fp('M-17 -14 C-12 -18 -2 -19 6 -16 C10 -18 14 -17 18 -15 L16 -14 Z', t('#8fc1d9'));                          // 깔아 둔 수건
      sp('M-14 -15 Q-4 -17.5 6 -15.5', t('#f4f8ff'), .8);
      curvy([[16, -14], [20, -16.4], [20, -2.4], [16, 0]], box.dark);
      curvy([[-20, -14], [16, -14], [16, 0], [-20, 0]], box.mid);
      R(-20, -14, 36, 3, t('#e6765f')); R(-20, -14, 36, .8, box.lit);
      label('SIZE 230', -16, -4, '700 3px sans-serif', t('#3b3049'));
      RR(22, -2, 6, 2, 1, t('#5fa39a')); faded(.7, () => E(25, -2.1, 2.6, .4, '#bfe3f5'));
      E(32, -.8, 3, 1, t('#d39d4c')); E(31, -1.2, 1, .5, t('#e8c088'));
    } },
    /* B1 방충망 귀퉁이가 찢어진 창문 (D10 가해자이기도 하다) */
    'sparrow:screenGap': { w: 110, h: 120, d: (time, t) => {
      const fr = planes(t, '#c9ccd4');
      RR(-55, -120, 110, 120, 3, fr.mid);
      P([[-51, -116], [51, -116], [49, -114], [-49, -114], [-49, -6], [-51, -4]], fr.dark);                       // 안으로 들어간 창틀: 위·왼쪽 안쪽 모는 그늘
      P([[51, -116], [51, -4], [-51, -4], [-49, -6], [49, -6], [49, -114]], fr.lit);                              // 아래·오른쪽 안쪽 모는 볕
      RR(-50, -115, 50, 110, 2, t('#9fc6d8'));
      faded(.5, () => { fp('M-46 -115 L-36 -115 L-10 -5 L-20 -5 Z', WHITE); E(-30, -86, 10, 3, WHITE); });
      RR(2, -115, 48, 110, 2, t('#6f7a88'));
      faded(.35, () => {
        ctx.strokeStyle = t('#2f2a3a'); ctx.lineWidth = .25; ctx.beginPath();
        for (let x = 4; x < 50; x += 1.6) { ctx.moveTo(x, -114); ctx.lineTo(x, x > 36 ? -24 + (x - 36) * 1.4 : -6); }
        for (let y = -113; y < -6; y += 1.6) { ctx.moveTo(3, y); ctx.lineTo(y > -24 ? 36 - (y + 24) / 1.4 : 49, y); }
        ctx.stroke();
      });
      fp('M36 -6 L49 -6 L49 -24 Z', t('#2a2240'));
      at(49, -24, Math.sin(time * 2) * .08, null, () => fp('M0 0 L-4 10 L-11 14 L-9 6 Z', t('#8a93a3')));
      const sill = planes(t, '#b5b9c3');                                                                          // 창턱: 볕 받는 윗면과 앞면
      curvy([[-56, -2], [-52, -6], [58, -6], [56, -2]], sill.lit); RR(-56, -2, 112, 4, 1, sill.mid); curvy([[56, -2], [58, -6], [58, -1], [56, 2]], sill.dark);
    } },

    /* S3 모래 목욕: 놀이터 모래밭에 몸을 비비는 무리와 튀는 모래 */
    'sparrow:sandBath': { w: 130, h: 22, d: (time, t) => {
      const sand = planes(t, '#dcc49a'), pit = [[-64, 0], [-56, -4.6, -30, -5.6], [0, -5.8], [30, -5.6, 56, -4.6, 64, 0], [30, 1.6, -30, 1.6, -64, 0]];
      curvy(pit, sand.mid);
      inside(pit, () => { curvy([[-66, -1.4], [-30, -3.6, 20, -3.6, 50, -2], [50, -8], [-66, -8]], sand.lit); E(62, 2, 26, 4, sand.dark); });
      [[-40, 0, 'dust'], [-14, 1, 'dust'], [10, 2, 'peck'], [34, 3, 'dust'], [54, 4, 'stand']].forEach(([x, seed, pose]) => {
        if (pose === 'dust') {
          E(x, -.4, 7, 1.6, t('#b89a6e'));
          for (let k = 0; k < 7; k++) {
            const ph = (time * 1.6 + k / 7 + seed * .3) % 1, side = k % 2 ? 1 : -1;
            faded(1 - ph, () => E(x + side * (3 + ph * 9), -2 - Math.sin(ph * Math.PI) * 9, .6, .6, t('#d9bf8e')));
          }
        }
        sparrow(time, t, { x, pose, seed, flip: seed % 2 === 1 });
      });
    } },
    /* S3 하늘에 딱 멈춘 날개: 정지비행하는 황조롱이 */
    'sparrow:kestrelHover': { w: 44, h: 52, d: (time, t) => {
      at(0, Math.sin(time * 1.5) * .6, .3, null, () => kestrelHover(time, t));
      faded(.4, () => [-1, 1].forEach((d) => sp(`M${-6 + d * 16} -44 q${d * 3} 3 0 6`, WHITE, .8)));
    } },
    /* D3 황조롱이: 발톱을 내밀고 내리꽂힌다 */
    'sparrow:kestrelDive': { w: 56, h: 44, d: (time, t) => {
      faded(.5, () => [-6, 0, 6].forEach((d) => L(-34 + d, -40 - d, -18 + d, -24 - d, WHITE, 1.2)));
      at(0, -18, .55, null, () => kestrelDive(time, t));
    } },

    /* S5 카페 통유리: 은행나무와 하늘이 그대로 비친다 (D5 가해자이기도 하다) */
    'sparrow:cafeGlass': { w: 200, h: 260, d: (time, t) => {
      const fr = planes(t, '#4a4060');
      RR(-100, -260, 200, 260, 3, fr.mid); R(-100, -230, 3, 230, fr.lit); R(97, -230, 3, 230, fr.dark);           // 문틀: 왼쪽 모 볕, 오른쪽 모 그늘
      RR(-94, -230, 188, 224, 2, t('#a9cfe0'));
      faded(.35, () => P([[-94, -230], [94, -230], [94, -224], [-88, -224], [-88, -6], [-94, -6]], t('#2a2240')));  // 유리 위·왼쪽으로 지는 틀 그림자
      at(0, 0, 0, null, () => {
        faded(.75, () => {
          R(-30, -120, 8, 114, t('#7a5a3e'));
          [[-26, -150, 46], [-50, -130, 34], [0, -128, 36], [-28, -186, 30], [16, -160, 26]].forEach(([x, y, r], i) =>
            E(x + Math.sin(time + i) * .8, y, r, r * .8, t(i % 2 ? '#f2c94c' : '#e8b33a')));
          E(52, -200, 22, 7, WHITE); E(66, -204, 14, 6, WHITE);
        });
        faded(.4, () => { fp('M-60 -230 L-40 -230 L20 -6 L0 -6 Z', WHITE); fp('M40 -230 L48 -230 L94 -60 L94 -30 Z', WHITE); });
      });
      const sign = planes(t, '#6b4f3a');                                                                           // 간판: 앞면, 볕 받는 윗면, 그늘진 아랫면
      curvy([[-100, -260], [-104, -264], [104, -264], [100, -260]], sign.lit);
      R(-100, -260, 200, 30, sign.mid); curvy([[-100, -230], [100, -230], [98, -227], [-98, -227]], sign.deep);
      label('CAFE  모퉁이', 0, -239, '700 16px serif', t('#fbf7ee'), 'center');
      RR(-3, -227, 6, 223, 1, fr.mid); R(-3, -227, 1.6, 223, fr.lit);
      const knob = planes(t, '#cfcad8'); RR(-12, -130, 3, 30, 1.5, knob.mid); R(-12, -130, 1, 30, knob.lit);
    } },
    /* S5 가게 앞 화분: 제라늄과 흙 위를 기는 애벌레 */
    'sparrow:planterBugs': { w: 50, h: 52, d: (time, t) => {
      [[-10, -38], [0, -48], [10, -40], [-4, -30]].forEach(([x, y], i) => {
        L(x * .3, -18, x, y, t('#5f8f68'), 1.1);
        E(x, y, 4.5, 4, t(i % 2 ? '#e6453a' : '#ff6b7a')); E(x, y, 1.4, 1.4, t('#ffd56b'));
      });
      [[-14, -24], [14, -26], [6, -20]].forEach(([x, y]) => fp(`M${x} ${y} c-3 -4 3 -6 4 -1 c-1 2 -3 2 -4 1 Z`, t('#6fa275')));
      const clay = planes(t, '#d9825f'), pot = [[-21, -19], [21, -19], [19.6, -8, 17, 0], [-17, 0], [-19.6, -8, -21, -19]];
      curvy(pot, clay.mid);
      inside(pot, () => { P([[-24, -20], [-16, -20], [-13, 1], [-20, 1]], clay.lit); P([[8, -20], [24, -20], [20, 1], [6, 1]], clay.dark); });
      const lip = [[-24, -22], [24, -22], [24.4, -20, 23, -18.4], [-23, -18.4], [-24.4, -20, -24, -22]];             // 두툼한 테
      curvy(lip, clay.mid); inside(lip, () => { R(-25, -23, 50, 1.8, clay.lit); R(14, -23, 11, 5, clay.dark); });
      E(0, -21.6, 21, 1.4, t('#5f4a3a'));
      const inch = Math.abs(Math.sin(time * 2));
      sp(`M10 -22 q${2 - inch} ${-2 - inch * 2} ${4 - inch} 0 q1 1 2.5 0`, t('#93c26a'), 1.2); E(16.5 - inch, -22.4, .8, .8, t('#5f8f68'));
    } },

    /* S6 쥐 끈끈이: 반들거리는 판 위에 반듯하게 놓인 쌀알 (D6 가해자이기도 하다) */
    'sparrow:glueTrap': { w: 44, h: 8, d: (time, t) => {
      const tray = planes(t, '#e8c24a');                                                                           // 끈끈이 판: 볕 받는 윗면, 앞 턱, 그늘진 오른쪽 턱
      fp('M-22 0 L22 0 L18 -5 L-18 -5 Z', tray.mid); fp('M18 -5 L22 0 L19 -.8 L16 -4.4 Z', tray.dark);
      fp('M-19 -.8 L19 -.8 L16 -4.4 L-16 -4.4 Z', tray.lit);
      faded(.55 + Math.sin(time * 1.5) * .2, () => { fp('M-12 -4 L-4 -4 L-8 -1.4 L-15 -1.4 Z', WHITE); E(10, -2.4, 4, .5, WHITE); });
      for (let i = 0; i < 10; i++) E(-9 + (i % 5) * 4, -3.6 + Math.floor(i / 5) * 1.6, .7, .35, t(RICE));
      at(14, -3, .4, null, () => { fp('M-3 0 Q0 -1.4 3 0 Q0 .4 -3 0 Z', t('#a87650')); L(-3, 0, 3, 0, t('#5e4030'), .15); });
      label('쥐끈끈이', -20, -.2, '700 1.8px sans-serif', t('#d24a4a'));
    } },
    /* S6 터진 쌀 포대: 고양이 다니는 길목에 쌀이 줄줄 샌다 */
    'sparrow:riceSack': { w: 60, h: 42, d: (time, t) => {
      const sk = planes(t, '#e8e0cc');                                                                             // 귀가 선 쌀 포대, 퍼져 주저앉은 바닥
      const sack = [[-20, 0], [-25, -12, -21, -30, -17, -38], [-20, -43], [-12, -40], [-2, -41.6, 8, -40], [16, -44], [14, -36], [21, -26, 22, -10, 19, 0], [0, 1.4, -20, 0]];
      curvy(sack, sk.mid);
      inside(sack, () => {
        fp('M-26 2 L-26 -46 L-12 -46 C-17 -34 -18 -16 -14 2 Z', sk.lit);
        fp('M6 -46 C14 -34 16 -14 12 2 L26 2 L26 -46 Z', sk.dark);
      });
      sp('M-17 -37 Q-2 -38.6 14 -36', t('#b8ab92'), .5);                                                            // 꿰맨 윗단 한 줄
      RR(-14, -30, 20, 12, 2, t('#5fa39a'));
      label('햅쌀', -10, -22, '800 5px sans-serif', t('#fbf7ee'));
      fp('M14 -10 L19 -6 L16 -2 Z', t('#3a3445'));
      fp('M17 -6 Q24 -4 30 0 L14 0 Z', t(RICE));
      for (let i = 0; i < 18; i++) E(16 + hash(i, 4) * 26, -.4, .7, .4, t(i % 3 ? RICE : '#efe6d2'));
      for (let i = 0; i < 3; i++) { const ph = (time * 1.2 + i / 3) % 1; E(18 + ph * 4, -6 + ph * 6, .6, .4, t(RICE)); }
    } },

    /* S7 눈 덮인 처마 밑: 동그랗게 부풀어 붙어 자는 무리 */
    'sparrow:huddleEave': { w: 120, h: 46, d: (time, t) => {
      const beam = planes(t, '#8d8a9c'), roof = planes(t, '#7a5a5e');
      curvy([[-60, -2], [-57, -4], [62, -4], [60, -2]], beam.lit); RR(-60, -2, 120, 4, 1, beam.mid);                 // 새들이 앉은 처마 보
      fp('M-62 -30 L62 -30 L58 -40 L-58 -40 Z', roof.mid);
      fp('M-62 -30 L62 -30 L60 -27 L-60 -27 Z', roof.deep);                                                          // 처마 밑 그늘
      for (let x = -58; x < 58; x += 8) { fp(`M${x} -30 q4 4 8 0 Z`, roof.dark); fp(`M${x} -30 q2 2.6 4 2.6 L${x + 4} -30 Z`, roof.mid); }   // 기와 끝: 왼쪽 반은 볕
      fp('M-60 -40 C-40 -46 40 -46 60 -40 L58 -38 C30 -42 -30 -42 -58 -38 Z', t(WHITE));
      [-40, 8, 44].forEach((x, i) => fp(`M${x} -30 L${x + 1.2} ${-24 - i} L${x + 2.4} -30 Z`, t('#e3f2fa')));
      [-46, -18, -4, 10, 24].forEach((x, i) => sparrow(time, t, { x, y: -2, pose: 'puff', sleepy: i > 0, white: i === 0, flip: i > 2, seed: i }));   // 맨 끝이 엄마, 그 옆자리는 비어 있다
      faded(.6, () => [[-30, 2], [10, 1]].forEach(([x, k]) => E(x + Math.sin(time * 2 + k) * 2, -14 - ((time * .4 + k * .5) % 1) * 6, .8, .8, WHITE)));
    } },
    /* S7 보일러 연통: 그을린 벽에서 따뜻한 김이 나온다 (D7 가해자이기도 하다) */
    'sparrow:flue': { w: 80, h: 50, d: (time, t) => {
      faded(.25, () => E(-24, -24, 14, 18, '#2a2240'));
      const plate = planes(t, '#cfcad8'), band = planes(t, '#b5afc0');
      RR(-38, -36, 8, 26, 2, plate.mid); R(-38, -34, 2, 22, plate.lit);                                             // 벽 고정판
      pipeRun(t, '#e3e1e8', -32, -28, 54, 12);
      [-18, 2].forEach((x) => { RR(x, -29, 3, 14, 1.2, band.mid); R(x, -29, 1, 14, band.lit); });                  // 이음 띠 두 개
      E(22, -22, 3.4, 6.4, band.lit); E(22.8, -22, 2.4, 5.2, t('#2a2240'));                                         // 볕 받는 연통 입과 까만 속
      puffs(time, t, { n: 7, speed: .35, x: 28, y: -22, dx: 4, dy: -26, wob: 2, r: 4, alpha: .75 });
      faded(.6, () => { E(18, -16, 2.6, .8, '#4a4258'); E(24, -31, 1.8, .6, '#4a4258'); });
    } },

    /* S8 짹짹 합창: 덤불 위 수컷이 까만 턱받이를 부풀리고 날개를 떤다 */
    'sparrow:chorusShrub': { w: 110, h: 70, d: (time, t) => {
      bush(time, t, 0, 104, 54, 8);
      L(-40, -30, 40, -36, t('#6b4f3a'), 1.2);
      [[-30, -31, 1], [-12, -33, 2], [20, -35.5, 3]].forEach(([x, y, seed]) => sparrow(time, t, { x, y, seed, flip: seed === 3, pose: seed === 2 ? 'fly' : 'stand' }));
      at(4, -56, 0, [1.1, 1.1], () => {
        const q = Math.sin(time * 14) * .2;
        sparrow(time, t, { pose: 'dust', flap: .3 + q, seed: 5 });
        faded(.9, () => E(5.2, -5.6, 1.2, 1.4, t(SP.spot)));
      });
      notes(time, '짹', -32, -46, 6); notes(time + .4, '짹짹', 14, -66, 6); notes(time + .7, '짹', 34, -50, 5);
    } },
    /* S8 연막 방역: 마스크 쓴 작업자가 하얀 연기를 뿜는다 (D11 가해자이기도 하다) */
    'sparrow:fogMachine': { w: 200, h: 180, d: (time, t) => {
      for (let i = 0; i < 20; i++) faded(.5, () => E(48 + i * 6.5, -96 + i * 4.6 + (hash(i, 2) - .5) * i * 1.6 + Math.sin(time * 1.2 + i) * 1.2, 4 + i * 1.2 + Math.sin(time * 1.6 + i * 1.3) * 1.2, 3.6 + i, t(i % 2 ? WHITE : '#eef0f4')));
      person(time, t, { h: 172, top: '#4a5d7a', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'out',
        extra: (hy, r) => { RR(r * .1, hy, r * .9, r * .7, r * .3, t('#f4f1ea')); RR(-r * 1.05, hy - r * 1.1, r * 2.1, r * .7, r * .3, t('#e8c24a')); } });
      const tank = planes(t, '#e8c24a'), steel = planes(t, '#8d8a9c');                                                // 연막기: 둥근 통, 위 손잡이, 앞으로 뻗은 분사관
      const body = [[10, -98], [10, -104, 16, -105], [30, -105], [36, -105, 37, -98], [36, -92, 30, -92], [16, -92], [10, -92, 10, -98]];
      curvy(body, tank.mid); inside(body, () => { R(8, -106, 30, 4, tank.lit); R(30, -106, 8, 16, tank.dark); });
      curvy([[14, -105], [15, -111], [23, -111], [24, -105], [21, -105], [20.4, -108.4], [17.6, -108.4], [17, -105]], tank.dark);
      pipeRun(t, '#8d8a9c', 34, -100, 12, 4);
      E(46.4, -98, 2.2, 3, steel.lit); E(47, -98, 1.4, 2, t('#5f5a66'));
      [[-6, 0], [6, 1]].forEach(([x, k]) => E(x + Math.sin(time * 3 + k) * 10 + 60, -1, 1.6, .5, t('#93c26a')));
    } },

    /* S9 필로티 천장 배관 틈: 보온재 감은 배관 위로 삐져나온 지푸라기 */
    'sparrow:pipeGap': { w: 150, h: 40, d: (time, t) => {
      ceiling(t, -76, -40, 152, 12);
      faded(.3, () => R(-74, -28, 148, 10, '#2a2240'));
      [-50, 30].forEach((x) => { L(x, -28, x, -14, t('#7d7a8c'), 1.2); RR(x - 4, -16, 8, 3, 1, t('#7d7a8c')); });
      const wrap = pipeRun(t, '#d8dbe2', -76, -14, 152, 9); [-46, 14].forEach((x) => L(x, -14, x - 2, -5, wrap.dark, .6));   // 보온재 감은 이음 두 줄
      pipeRun(t, '#9aa3bb', -76, -5, 152, 5);
      strawNest(t, 6, -14, 28, 12, 6);
      at(18, -24, .5 + Math.sin(time * 2) * .1, null, () => fp('M0 0 Q3 -1 6 0 Q3 .6 0 0 Z', t('#f4f1ea')));
    } },
    /* S9 실외기 앞 초록 새 그물: 찢어진 틈이 아늑해 보인다 (D8 가해자이기도 하다) */
    'sparrow:birdNet': { w: 100, h: 80, d: (time, t) => {
      box3(t, '#ebe7ef', -40, -62, 74, 56, 6);                                                                     // 실외기: 볕 받는 윗면, 그늘진 옆면
      const G = planes(t, '#c4bfcd'), S = planes(t, '#8d8a9c');
      E(-6, -35, 20, 20, G.dark); E(-5, -34, 17.4, 17.4, G.mid);
      at(-5, -34, time * .6, null, () => [0, 1, 2].forEach((k) => at(0, 0, k * TAU / 3, null, () => curvy([[1.4, -1.4], [5, -7, 12, -7], [15, -2.6, 13.6, 1.2], [8, 2.6, 1.4, 1.4]], G.lit))));
      E(-5, -34, 3, 3, S.mid);
      curvy([[-44, -6], [-41, -8.4], [47, -8.4], [44, -6]], S.lit); RR(-44, -6, 88, 6, 1.4, S.mid);
      ctx.save(); ctx.beginPath(); ctx.rect(-46, -78, 92, 76); ctx.clip();
      const sway = Math.sin(time * 1.3) * .8;
      faded(.18, () => R(-46, -78, 92, 76, t('#3f8f5a')));
      ctx.strokeStyle = t('#3f8f5a'); ctx.lineWidth = .6; ctx.beginPath();
      for (let k = -130; k <= 130; k += 5) {
        ctx.moveTo(k, -78); ctx.quadraticCurveTo(k + 38 + sway, -40, k + 76, -2);
        ctx.moveTo(k, -78); ctx.quadraticCurveTo(k - 38 + sway, -40, k - 76, -2);
      }
      ctx.stroke(); ctx.restore();
      fp('M14 -32 C18 -40 30 -38 30 -28 C29 -20 20 -18 15 -23 Z', t('#2a2240'));
      [[15, -32, -1], [30, -30, 1], [22, -19, 0]].forEach(([x, y, d], i) => sp(`M${x} ${y} q${d * 3} ${2 + i} ${d * 2 + 1} ${4 + i}`, t('#3f8f5a'), .6));
      [[-46, -78], [46, -78], [-46, -2], [46, -2], [0, -78]].forEach(([x, y]) => RR(x - 2, y - 1, 4, 2, .6, t('#f4f1ea')));
    } },
    /* S9 버드스파이크 간판: 뾰족한 침이 줄줄이 박혀 있다 */
    'sparrow:spikeSign': { w: 130, h: 52, d: (time, t) => {
      box3(t, '#5f8fb0', -62, -36, 114, 36, 8);
      label('우리 부동산', -5, -12, '800 15px sans-serif', t('#fbf7ee'), 'center');
      const strip = planes(t, '#8d8a9c'), pin = planes(t, '#e3e6ec');
      RR(-60, -42, 118, 3, 1, strip.mid); R(-60, -42, 118, 1, strip.lit);                                            // 침을 박은 띠
      for (let x = -56; x <= 54; x += 6) [-.45, 0, .45].forEach((a) => {                                            // 가는 삼각 침: 왼쪽 볕, 오른쪽 그늘
        const tx = x + Math.sin(a) * 13, ty = -42 - Math.cos(a) * 13;
        P([[x - .7, -42], [x, -42], [tx, ty]], pin.lit); P([[x, -42], [x + .7, -42], [tx, ty]], pin.dark);
      });
      faded(.5 + Math.sin(time * 2) * .4, () => { L(20, -51, 24, -51, WHITE, .5); L(22, -53, 22, -49, WHITE, .5); });
    } },

    /* S10 배관 틈 둥지: 다섯 새끼가 쩍쩍 입을 벌리고 짝이 벌레를 물고 온다 */
    'sparrow:chicksPipe': { w: 90, h: 40, d: (time, t) => {
      ceiling(t, -46, -40, 92, 10);
      const wrap = pipeRun(t, '#d8dbe2', -46, -9, 92, 9); L(-28, -9, -30, 0, wrap.dark, .6);
      strawNest(t, -6, -9, 34, 10, 8);
      [-18, -11, -4, 3].forEach((x, i) => chick(time, t, x, -12, i, .95));
      sparrow(time, t, { x: 22, y: -9, flip: true, worm: true, seed: 4 });
    } },
    /* D9 까마귀: 크게 벌린 부리로 덮친다 */
    'sparrow:crowRaid': { w: 70, h: 50, d: (time, t) => {
      const f = Math.sin(time * 8), open = 2 + Math.abs(f) * 2;
      fp('M-6 -22 L-28 -26 L-26 -18 L-8 -16 Z', t('#1f1b28'));
      at(-2, -24, 0, [1, .4 + .6 * Math.abs(f)], () => {
        fp('M4 0 C-2 -12 -14 -22 -30 -24 C-24 -14 -16 -4 -6 6 Z', t('#2a2535'));
        [-24, -19, -14].forEach((x, i) => sp(`M${x} ${-22 + i * 3} l-3 ${2 + i}`, t('#1f1b28'), 1.2));
        faded(.5, () => sp('M-2 -4 C-8 -12 -16 -18 -24 -20', t('#4f6d9a'), .8));
      });
      fp('M10 -26 C14 -20 10 -12 2 -11 C-6 -10 -10 -15 -10 -20 C-6 -26 4 -29 10 -26 Z', t('#2a2535'));
      crowHead(t, open);
      cuteEye(13.4, -31.5, .9, 1, time, t);
      [[2, -11], [6, -12]].forEach(([x, y]) => { L(x, y, x + 3, y + 8, t('#3b3049'), 1); sp(`M${x + 3} ${y + 8} q2 0 3 1.5`, t('#3b3049'), .6); });
    } },
    /* S3 세탁소 아저씨: 셔터를 올리고 가게 앞을 쓴다. 빗자루가 지나간 자리에 밥알과 빵가루 */
    'sparrow:laundryMan': { w: 70, h: 175, d: (time, t) => {
      const sweep = Math.sin(time * 2.4) * 1.5;
      at(sweep, 0, 0, null, () => {
        L(-5, -120, 33, -8, t('#c9a06a'), 2.2); L(-5.6, -120, 32.4, -8, t('#e0bd86'), .8);                    // 대나무 자루: 왼쪽 모에 볕
        const head = planes(t, '#e6765f'), brush = [[28, -11], [38, -11], [48, -1], [47, 0], [20, 0], [20, -1]];
        curvy(brush, head.mid);
        inside(brush, () => { P([[18, 1], [27, 1], [31, -12], [25, -12]], head.lit); P([[38, -12], [50, -12], [50, 1], [42, 1]], head.dark); });
        RR(27, -14, 12, 4, 1.5, t('#5f8fb0'));
      });
      person(time, t, { h: 168, top: '#7a95ab', bottom: '#4a4a5a', hair: '#8a8590', arm: 'down', handPose: 'grip',
        extra: (hy, r) => RR(-r * .9, hy - r * 1.05, r * 1.7, r * .45, r * .2, t('#5a5560')) });
      const apron = planes(t, '#eae4d6');                                                                       // 앞치마 한 장
      curvy([[-12, -118], [15, -118], [17, -80, 14, -66], [-14, -66], [-16, -84, -12, -118]], apron.mid);
      inside([[-12, -118], [15, -118], [17, -80, 14, -66], [-14, -66], [-16, -84, -12, -118]], () => R(6, -120, 14, 56, apron.dark));
      label('행복', 0, -96, '700 6px sans-serif', t('#5f8fb0'), 'center');
      for (let i = 0; i < 9; i++) E(26 + hash(i, 7) * 34, -.4, i % 3 ? .6 : 1.1, .35, t(i % 3 ? RICE : '#e8c088'));
    } },
    /* S5 해 질 녘 전깃줄: 하얀 깃털 엄마가 짹, 짹 부른다 */
    'sparrow:momCall': { w: 110, h: 24, d: (time, t) => {
      const wire = t('#3b3049');
      [[-8, 2, .5], [-18, -8, .35]].forEach(([y0, sag, w]) => {
        ctx.strokeStyle = wire; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-55, y0); ctx.quadraticCurveTo(0, y0 + sag + 10, 55, y0); ctx.stroke();
      });
      const call = Math.sin(time * 4) > 0;
      sparrow(time, t, { x: 0, y: -3, white: true, gape: call, seed: 6 });
      notes(time, '짹,', 12, -14, 5); notes(time + .5, '짹', 20, -20, 5);
    } },
    /* S12 막내 없는 난간: 짧은 꼬리 새끼 셋이 붙어 앉았고 맨 끝자리가 비어 있다 */
    'sparrow:fledglings': { w: 70, h: 20, d: (time, t) => {
      const rail = pipeRun(t, '#9aa3bb', -35, -2, 70, 3);
      [-30, 30].forEach((x) => { R(x - 1, 1, 2, 16, rail.mid); R(x - 1, 1, .7, 16, rail.lit); });                 // 난간 기둥
      [-22, -12, -2].forEach((x, i) => sparrow(time, t, { x, y: -2, c: JUV, pose: i === 1 ? 'puff' : 'stand', gape: i === 2 && Math.sin(time * 3) > .3, seed: i + 3 }));
    } },
    /* B2 밤 골목 떡집: 내린 셔터, 간판 뒤 틈, 문턱에 남은 쌀가루 */
    'sparrow:tteokShutter': { w: 120, h: 150, d: (time, t) => {
      const shut = planes(t, '#b5b9c3'), sign = planes(t, '#f6eedc');
      RR(-56, -112, 112, 112, 1, shut.mid);
      for (let y = -108; y < -2; y += 4) { R(-56, y, 112, 1, shut.dark); R(-56, y + 1, 112, .6, shut.lit); }     // 셔터 주름
      R(46, -112, 10, 112, shut.dark);
      pipeRun(t, '#8d8a9c', -60, -122, 120, 10);                                                                  // 셔터 말린 통
      faded(.85, () => R(-58, -134, 116, 4, '#1c1626'));                                                           // 간판 뒤 틈
      box3(t, '#f6eedc', -60, -150, 112, 18, 4);
      R(-60, -150, 112, 3, t('#e6765f'));
      label('떡집', -4, -136, '800 12px sans-serif', t('#3b3049'), 'center');
      faded(.4, () => R(-60, -150, 112, 18, sign.dark));
      const dust = [[-30, 0], [-20, -1.4, 0, -2], [20, -1.4, 34, 0]];
      curvy(dust, t('#f4f0e6'));
      for (let i = 0; i < 6; i++) E(-36 + hash(i, 5) * 74, -.3, .6, .3, t(RICE));
    } },
    /* D1 까치: 날개를 펴고 둥지 끝으로 덮친다 */
    'sparrow:magpieGrab': { w: 60, h: 50, d: (time, t) => {
      magpieBody(time, t);
    } },
  };

  return [art, hero];
})());
