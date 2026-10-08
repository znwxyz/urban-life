/* 까마귀 장면 전용 그림과 주인공 까마귀. 키는 'crow:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   까마귀 눈높이(화면 폭 약 15m)에 맞춰 실제 크기로 그린다: 까마귀 55cm, 사람 120~170cm, 전봇대 5m.
   땅콩·병뚜껑·호두처럼 너무 작은 것만 알아보게 두세 배로 키운다.
   실루엣은 곡선 하나로 오리고, 색은 왼쪽 위 빛으로 2~3톤만 나눈다. Node에서는 키 목록만 내보낸다 */
(function register(art, hero) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else { Object.assign(ACTORS, art); ANIMALS.crowHero = hero; }
})(...(() => {
  /* 까만 깃에 도는 푸른빛·보랏빛. 부리는 깃보다 조금 더 까맣고, 윗날만 볕을 받는다 */
  const CR = Object.freeze({ body: '#2c2939', back: '#24212f', wing: '#1f1d2b', tip: '#16141f', belly: '#38344a', head: '#2c2939',
    sheen: '#5b6fb0', sheen2: '#8a6fc0', beak: '#1b1924', beakLit: '#55526c', leg: '#2a2733', ring: '#4b4762', mouth: '#e8506a' });
  const JUV = Object.freeze({ ...CR, body: '#3b3748', head: '#3b3748', belly: '#4b465a', wing: '#2e2b3a', ring: '#6d7fa8', mouth: '#f28aa0' });
  const OLDC = Object.freeze({ ...CR, body: '#34303f', head: '#3a3546', sheen: '#6f7aa0' });
  const BARK = '#8a6a52', TWIG = '#7a5a3e', WIRE = '#c9ccd4', PEANUT = '#d9b27c', SNOW = '#f7fbff', PIN = '#e0454f', BLUE_CAP = '#3f6fb8';
  const CAPS = ['#3f9f7f', '#e8c24a', '#d24a4a'];
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
    faded(1 - ph, () => label(text, x, y - ph * 10, `700 ${size}px sans-serif`, INK));
  }
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
  /** 실루엣 하나를 오리고 왼쪽(lit)·오른쪽(dark) 면을 x 경계로 나눈다 */
  function formed(t, c, pts, litX, darkX, top = -999, bottom = 999) {
    const p = planes(t, c);
    curvy(pts, p.mid);
    inside(pts, () => { R(-999, top, litX + 999, bottom - top, p.lit); R(darkX, top, 999, bottom - top, p.dark); });
    return p;
  }
  /** 굵기 있는 선 (철사·전선·막대) */
  function rod(pts, c, w) {
    ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    pts.forEach((q, i) => { if (!i) ctx.moveTo(q[0], q[1]); else if (q.length === 2) ctx.lineTo(q[0], q[1]); else ctx.quadraticCurveTo(q[0], q[1], q[2], q[3]); });
    ctx.stroke();
  }
  /** 세로 원기둥(기둥·관): 왼쪽 띠는 볕, 오른쪽 띠는 그늘. 아래 x0~x1, 위 x2~x3 */
  function column(t, c, x0, x1, y0, x2, x3, y1) {
    const p = planes(t, c), body = [[x0, y0], [x1, y0], [x3, y1], [x2, y1]];
    curvy(body, p.mid);
    inside(body, () => { P([[x0 - 1, y0], [x0 + (x1 - x0) * .28, y0], [x2 + (x3 - x2) * .28, y1], [x2 - 1, y1]], p.lit); P([[x1 - (x1 - x0) * .3, y0], [x1 + 1, y0], [x3 + 1, y1], [x3 - (x3 - x2) * .3, y1]], p.dark); });
    return p;
  }

  /* ── 작은 물건: 땅콩(겉껍질째), 병뚜껑, 호두. 실제보다 두세 배 크게 ── */
  function peanut(t, x, y, a = 0, s = 2) {
    const p = planes(t, PEANUT);
    at(x, y, a, [s, s], () => {
      fp('M-2.2 0 C-2.3 -1.5 -.8 -1.7 -.1 -.9 C.5 -1.6 2.3 -1.5 2.3 0 C2.3 1.5 .5 1.6 -.1 .9 C-.8 1.7 -2.3 1.5 -2.2 0 Z', p.mid);
      fp('M-1.9 -.2 C-1.8 -1.1 -.9 -1.2 -.5 -.7 C-1 -.6 -1.5 -.4 -1.9 -.2 Z', p.lit);
      fp('M2.3 0 C2.3 1.5 .5 1.6 -.1 .9 C.6 .8 1.6 .7 2.3 0 Z', p.dark);
    });
  }
  function bottleCap(t, x, y, c, s = 2.4) {
    const p = planes(t, c);
    at(x, y, 0, [s, s], () => {
      fp('M-1.6 0 L1.6 0 L1.7 -.9 L1.3 -1.1 L1 -.9 L.6 -1.1 L.2 -.9 L-.2 -1.1 L-.6 -.9 L-1 -1.1 L-1.4 -.9 L-1.7 -.9 Z', p.mid);
      fp('M-1.7 -.9 C-1.2 -1.5 1.2 -1.5 1.7 -.9 C1.2 -.6 -1.2 -.6 -1.7 -.9 Z', p.lit);
      fp('M1 0 L1.6 0 L1.7 -.9 L1.1 -.8 Z', p.dark);
      faded(.7, () => E(-.7, -1.05, .35, .12, WHITE));
    });
  }

  /* ── 까마귀 한 마리 (실제 크기 55cm). o: { x, y, s, flip, pose: stand|bow|peck|sit|fly|gape, c 깃털색, seed, flap, shortTail } ── */
  const BODY = 'M8 -30 C15 -27 15 -17 7 -13 C0 -10 -9 -11 -14 -15 C-17 -18 -16 -23 -12 -26 C-6 -30 2 -31.5 8 -30 Z';
  const BELLY = 'M14 -22 C13 -16 8 -12.5 2 -12 C-4 -11.6 -9 -12.6 -12 -15 C-4 -15 6 -17 14 -22 Z';
  const WING = 'M9 -29 C3 -31.5 -6 -29.5 -13 -24 C-17 -21 -20 -18 -24 -15.5 C-16 -14.6 -8 -15 -1 -17 C5 -19 9 -23 9 -29 Z';
  const WING_TIP = 'M-12 -19.5 C-16 -18 -20 -16.8 -24 -15.5 C-19 -15.2 -14 -15.4 -10 -16.4 Z';
  const TAIL = 'M0 -2 L-19 3 Q-20.6 6.4 -17.6 7.6 L1 4 Z';
  const OPEN_WING = 'M3 -2 C-1 -10 -9 -20 -21 -26 C-23 -23.5 -22 -21.5 -24.5 -19.5 C-26.5 -17 -25.5 -15 -27.5 -13 C-29 -10.5 -27.5 -8.5 -28.5 -6.5 C-23 -2 -13 2 -1 3 Z';
  const OPEN_TIP = 'M-21 -26 C-23 -23.5 -22 -21.5 -24.5 -19.5 C-26.5 -17 -25.5 -15 -27.5 -13 C-29 -10.5 -27.5 -8.5 -28.5 -6.5 L-19 -12 Z';
  const BILL_UP = 'M18 -40 C23 -40.6 28.6 -37 30.6 -31.6 C27 -33 23 -33.2 19 -32.6 Z';
  const BILL_LO = 'M19 -32.6 C23 -33 27 -32.4 30 -31.4 C27 -29.4 23 -28.6 19.4 -29.6 Z';
  const BRISTLE = 'M16.8 -41 C20.4 -41 22.6 -39.4 23.6 -37.8 C21.2 -37.8 19.2 -37.2 17.6 -36.2 Z';

  /** 까만 머리 위에서도 보이게 둘레를 밝힌 눈. 가끔 깜빡인다 */
  function crowEye(x, y, time, t, c) {
    E(x, y, 2.5, 2.7, t(c.ring));
    if (Math.sin(time * .9 + x) > .985) { L(x - 1.8, y, x + 1.8, y, t('#120f1a'), .9); return; }
    E(x, y, 1.75, 2, t('#120f1a')); E(x + .6, y - .8, .75, .75, WHITE); E(x - .6, y + .8, .3, .3, WHITE);
  }

  function crowHead(time, t, c, o) {
    E(11.6, -34, 10.2, 9.8, t(c.head));
    faded(.55, () => sp('M5 -38 Q8 -42.6 14.5 -43', t(c.sheen2), 1.4));
    const open = o.pose === 'gape' ? .5 + Math.abs(Math.sin(time * 5 + (o.seed || 0))) * .25 : (o.open || 0);
    if (open) {
      fp('M19 -33 L30 -31.5 L19.4 -29.4 Z', t(c.mouth));
      at(19.2, -31.4, open, null, () => { ctx.translate(-19.2, 31.4); fp(BILL_LO, t(c.beak)); });
    } else fp(BILL_LO, t(c.beak));
    fp(BILL_UP, t(c.beak)); sp('M19.4 -39.4 C23.4 -39.6 27.4 -36.8 29.4 -33', t(c.beakLit), .8);
    fp(BRISTLE, t(c.head));
    crowEye(15.4, -35.4, time + (o.seed || 0), t, c);
    blush(16.6, -30.4, 2.1, 1.1);
  }

  function crowBird(time, t, o = {}) {
    const c = o.c || CR, pose = o.pose || 'stand', seed = o.seed || 0, flying = pose === 'fly';
    ctx.save(); ctx.translate(o.x || 0, o.y || 0); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose === 'bow') { ctx.translate(0, -12); ctx.rotate(.38 + Math.sin(time * 3 + seed) * .06); ctx.translate(0, 12); }
    if (pose === 'peck') { ctx.translate(0, -12); ctx.rotate(.5 + Math.abs(Math.sin(time * 4 + seed)) * .25); ctx.translate(0, 12); }
    if (pose === 'gape') { ctx.translate(0, -12); ctx.rotate(-.22); ctx.translate(0, 12); }
    if (!flying && pose !== 'sit') {
      [[-1, -2.2], [4.2, 4.8]].forEach(([x0, x1]) => { L(x0, -12.5, x1, 0, t(c.leg), 1.7); sp(`M${x1 - 2} 0 L${x1 + 3.4} 0 M${x1} 0 L${x1 + 1.6} -1`, t(c.leg), 1); });
    }
    if (flying) at(-1, -25, 0, [.85, .25 + .75 * (o.flap ?? Math.sin(time * 9 + seed))], () => fp(OPEN_WING, t(c.tip)));      // 몸 뒤 먼 날개 (가까운 날개와 같이 친다)
    const fan = pose === 'bow' ? .2 : 0;
    at(-12, -19, (flying ? .05 : -.06 + Math.sin(time * 2 + seed) * .04) - fan, o.shortTail ? [.6, 1] : null, () => {
      fp(TAIL, t(c.back)); if (fan) at(0, 0, .22, null, () => fp(TAIL, t(c.tip)));
    });
    fp(BODY, t(c.body)); fp(BELLY, t(c.belly));
    if (flying) {
      const f = o.flap ?? Math.sin(time * 9 + seed);
      L(-3, -12.5, -7, -10.5, t(c.leg), 1.6);
      at(3, -24, 0, [1, .25 + .75 * f], () => {
        fp(OPEN_WING, t(c.wing)); fp(OPEN_TIP, t(c.tip));
        faded(.7, () => sp('M2 -1 C-3 -8 -10 -16 -19 -22', t(c.sheen), 1.2));
      });
    } else if (pose !== 'sit') {
      at(0, 0, pose === 'bow' ? .12 : 0, null, () => {
        fp(WING, t(c.wing)); fp(WING_TIP, t(c.tip));
        faded(.75, () => sp('M6 -28 C0 -29.4 -7 -27.6 -12 -23.6', t(c.sheen), 1.2));
      });
    } else faded(.6, () => sp('M7 -28 C1 -29.6 -6 -28 -11 -24', t(c.sheen), 1.2));
    crowHead(time, t, c, o);
    ctx.restore();
  }

  /** 둥지 속 새끼: 솜털 머리를 위로 쳐들고 빨간 입을 쩍 벌린다 (몸 아래가 원점) */
  function chick(time, t, x, y, seed) {
    const open = .35 + Math.abs(Math.sin(time * 5 + seed * 1.7)) * .4, sway = Math.sin(time * 4 + seed) * .1;
    at(x, y, sway - .3, null, () => {
      E(0, -5, 7, 6, t(JUV.body)); E(1.5, -12, 5.2, 5, t(JUV.head));
      [-1, 0, 1].forEach((k) => sp(`M${1 + k * 1.8} -16.6 l${k * .8} -2.4`, t('#6d6878'), .8));
      E(2.6, -13, 1.1, 1.2, t(JUV.ring)); E(2.8, -13.1, .6, .7, t('#120f1a'));
      at(4.8, -12.4, -.9, null, () => {
        fp(`M0 -1.6 L8 ${-2 - open * 3} L7.6 -.8 Z`, t('#f2d0d6'));
        fp(`M0 1.4 L8 ${2 + open * 2.6} L7.4 .8 Z`, t('#f2d0d6'));
        fp(`M.4 -1.2 L7.2 ${-1.6 - open * 2.6} L7.2 ${1.6 + open * 2.2} L.4 1.2 Z`, t(CR.mouth));
      });
    });
  }

  /** 나뭇가지와 철사 옷걸이를 엮은 둥지 (가운데 x, 바닥 y) */
  function wireNest(t, cx, y, w, h, seed) {
    const p = planes(t, TWIG), x0 = cx - w / 2, x1 = cx + w / 2, top = y - h, n = 14;
    const tips = Array.from({ length: n - 1 }, (_, k) => {
      const x = x1 - (k + 1) * w / n;
      return k % 2 ? [x, top + h * .12] : [x + (hash(k, seed) - .5) * 3, top - 1 - hash(k, seed + 1) * 4];
    });
    const shape = [[x0, top + h * .2], [x0 - 4, y - h * .2, x0 + w * .2, y, cx, y], [x1 - w * .2, y, x1 + 4, y - h * .2, x1, top + h * .2], ...tips];
    curvy(shape, p.mid);
    inside(shape, () => {
      E(cx + w * .28, y + h * .1, w * .46, h * .7, p.dark);
      curvy([[x0 - 4, top - 6], [x1 + 4, top - 6], [x1 + 4, top + h * .32], [cx, top + h * .6, x0 - 4, top + h * .32]], p.lit);
    });
    const wire = planes(t, WIRE);
    rod([[x0 + 4, y - h * .45], [cx - 6, y - h * .2, cx + 10, y - h * .5]], wire.mid, 1);                        // 둥지 앞을 가로지른 철사
    rod([[cx + 2, y - h * .25], [cx + 16, y - h * .1, x1 - 2, y - h * .42]], wire.dark, 1);
    rod([[x0 + 8, top + 2], [x0 + 6, top - 6], [x0 + 2, top - 10, x0 - 1, top - 7], [x0 - 2, top - 4, x0 + 1, top - 3]], wire.lit, 1.1);   // 삐져나온 옷걸이 고리
    rod([[x1 - 10, top + 1], [x1 - 2, top - 8]], t('#5fa8d8'), 1.1);                                              // 비닐 씌운 파란 옷걸이 한 가닥
  }

  /* ── 사람 ── */
  const capExtra = (t, c) => (hy, r) => {
    const p = planes(t, c);
    curvy([[-r * 1.08, hy - r * .2], [-r * 1.05, hy - r * 1.35, r * .9, hy - r * 1.4, r * .95, hy - r * .42]], p.mid);
    curvy([[-r * 1.08, hy - r * .2], [-r * .9, hy - r * 1.1, 0, hy - r * 1.3], [-r * .3, hy - r * .9, -r * .7, hy - r * .4]], p.lit);
    curvy([[r * .5, hy - r * .48], [r * 1.2, hy - r * .58, r * 1.75, hy - r * .36], [r * 1.2, hy - r * .22, r * .6, hy - r * .3]], p.dark);   // 앞으로 나온 챙
  };
  const pinExtra = (t) => (hy, r) => {
    at(-r * .15, hy - r * .95, -.3, [r * .1, r * .1], () => {
      const p = planes(t, PIN);
      fp('M0 0 C-3 -4 -7 -3 -6.4 0 C-7 3 -3 4 0 0 C3 -4 7 -3 6.4 0 C7 3 3 4 0 0 Z', p.mid);
      fp('M0 0 C-3 -4 -7 -3 -6.4 0 C-4 -1 -2 -.6 0 0 Z', p.lit); E(0, 0, 1.6, 1.6, p.dark);
    });
  };

  /** 쪼그려 앉은 아이: 손바닥을 펴서 땅콩을 내민다 (빨간 머리핀) */
  function crouchGirl(time, t) {
    const top = planes(t, '#ffd56b'), jean = planes(t, '#5f8fb0');
    const lean = Math.sin(time * 1.5) * 1.2;
    RR(-16, -5, 16, 5, 2.5, t(shade('#f4f1ea'))); RR(2, -5, 18, 5, 2.5, t('#f4f1ea')); RR(2, -2, 18, 2, 1, t('#e6765f'));
    fp('M-10 -40 C-2 -44 14 -44 18 -36 L12 -4 L4 -4 L9 -30 C2 -30 -6 -28 -12 -26 Z', jean.dark);
    fp('M-12 -38 C-4 -42 12 -42 16 -34 C14 -30 10 -28 6 -28 C0 -28 -6 -26 -12 -24 Z', jean.mid);
    at(lean, 0, 0, null, () => {
      fp('M-14 -34 C-16 -50 -8 -68 6 -70 C14 -70 18 -64 16 -58 C10 -50 6 -42 4 -34 Z', top.mid);
      fp('M-10 -36 C-11 -46 -6 -58 2 -64 C-2 -54 -4 -46 0 -36 Z', top.dark);
      ctx.strokeStyle = top.mid; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(8, -62); ctx.quadraticCurveTo(22, -52, 28, -36); ctx.stroke();
      const [hx, hy] = artHandOnArm(t, 29.6, -33, .5 + Math.sin(time * 2) * .06, 13, { pose: 'offer' });
      peanut(t, hx + 1, hy - 4, .3, 1.6); peanut(t, hx + 5, hy - 3, -.4, 1.6);
      E(15, -80, 11.5, 12, t(SKIN));
      fp('M3 -82 C2 -96 22 -98 27 -86 C22 -88 14 -90 10 -86 C8 -84 6 -80 4 -76 Z', t('#2f2a3a'));
      fp('M2 -80 C-6 -78 -8 -62 -2 -58 C0 -66 2 -74 4 -78 Z', t('#2f2a3a'));                                  // 어깨까지 오는 단발
      at(10, -91, -.4, [1.1, 1.1], () => { const p = planes(t, PIN); fp('M0 0 C-3 -4 -7 -3 -6.4 0 C-7 3 -3 4 0 0 C3 -4 7 -3 6.4 0 C7 3 3 4 0 0 Z', p.mid); E(0, 0, 1.6, 1.6, p.dark); });
      cuteEye(21.5, -80, 1.3, 1.6, time, t); blush(22, -75, 2.4, 1.3);
      sp('M23 -72 Q25 -70.5 26.5 -72.5', t('#c9645a'), .9);
    });
  }

  function hero(time, moving, eye, t) {
    const bob = Math.sin(time * 2.4) * 3;
    ctx.save(); ctx.translate(0, -eye + bob + 26 * HERO_SCALE); ctx.scale(HERO_SCALE, HERO_SCALE);
    crowBird(time, t, { pose: 'fly', flap: Math.sin(time * (moving ? 11 : 6)) });
    ctx.restore();
  }

  const art = {
    /* K1 옷걸이 둥지: 느티나무 꼭대기 가지 틈에 철사 옷걸이를 엮은 둥지, 빨간 입 형제들, 먹이 물고 온 아빠 */
    'crow:hangerNest': { w: 260, h: 420, d: (time, t) => {
      leafMass(-60, -360, 90, 56, .3, t, 7); leafMass(70, -350, 80, 50, .7, t, 6);
      const bark = planes(t, BARK);
      const trunk = [[-14, 0], [-12, -150, -10, -270], [-60, -330, -90, -372], [-82, -376], [-50, -336, -4, -300], [10, -300], [40, -330, 72, -360], [80, -354], [50, -320, 14, -276], [12, -150, 16, 0]];
      curvy(trunk, bark.mid);
      inside(trunk, () => { P([[-30, 0], [-6, 0], [-4, -290], [-90, -380], [-100, -370]], bark.lit); P([[6, 0], [30, 0], [90, -350], [12, -276]], bark.dark); });
      wireNest(t, 0, -298, 82, 24, 2);
      [[-22, 0], [-8, 1], [6, 2]].forEach(([x, s]) => chick(time, t, x, -312, s));
      crowBird(time, t, { x: 38, y: -302, flip: true, pose: 'stand', seed: 1, open: .18 });
      sp('M14.6 -333 q2 -1 3 .6 q1.4 1.6 3 .6', t('#93c26a'), 1.6);
      leafMass(-110, -300, 34, 22, .5, t, 5);
    } },

    /* K2 땅콩 내미는 아이: 빨간 머리핀, 펼친 손바닥 위 땅콩 두 알, 화단 턱에 놓아 둔 한 알 */
    'crow:peanutGirl': { w: 60, h: 100, d: (time, t) => {
      crouchGirl(time, t);
      peanut(t, 40, -1.5, .2, 2.2);
      label('안 만질게', 14, -106, '700 14px sans-serif', t(INK), 'center');
    } },
    /* K2 덮치는 엄마: 고개를 감싼 아저씨 뒤통수로 날개 편 까마귀가 내리꽂힌다 */
    'crow:swoopParent': { w: 120, h: 240, d: (time, t) => {
      person(time, t, { h: 172, top: '#8fa0b8', bottom: '#4a4f63', hair: '#4a4258', arm: 'up', handPose: 'flat' });
      const dip = Math.sin(time * 2) * 6;
      at(-34, -214 + dip, .55, null, () => crowBird(time, t, { pose: 'fly', flap: Math.sin(time * 14), seed: 3, open: .3 }));
      faded(.5, () => [0, 8].forEach((d) => sp(`M${-80 + d} ${-250 - d} q14 6 22 18`, WHITE, 1.4)));
      label('깍!', -60, -252, '800 18px sans-serif', t(INK), 'center');
    } },

    /* K3·D3 돌 주운 남자애: 파란 모자, 치켜든 손에 돌멩이 */
    'crow:stoneBoy': { w: 70, h: 150, d: (time, t) => {
      const H = 135, stone = planes(t, '#a0968d');
      [[30, 1], [38, .8]].forEach(([x, k]) => { E(x + .6, -1.6 * k, 3 * k, 2 * k, stone.dark); E(x, -2 * k, 2.6 * k, 1.8 * k, stone.mid); E(x - .8, -2.6 * k, 1.1 * k, .6 * k, stone.lit); });
      person(time, t, { h: H, top: '#5fa39a', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'up', handPose: 'grip', extra: capExtra(t, BLUE_CAP) });
      const sx = .15 * H, sy = -.83 * H + Math.sin(time * 3) * H * .01;
      E(sx + 2, sy - 2.6, 3.4, 2.8, stone.dark); E(sx + 1.4, sy - 3, 3, 2.4, stone.mid); E(sx + .4, sy - 4, 1.3, .8, stone.lit);
      const ph = (time * .8) % 1, fx = sx + 14 + ph * 110, fy = sy - 10 - Math.sin(ph * Math.PI) * 40 - ph * 30;   // 날아가는 돌 하나
      faded(Math.min(1, (1 - ph) * 3), () => {
        faded(.45, () => sp(`M${fx - 22} ${fy + 6} Q${fx - 10} ${fy - 2} ${fx - 4} ${fy}`, WHITE, 1.6));
        E(fx + .6, fy + .5, 3.2, 2.6, stone.dark); E(fx, fy, 2.8, 2.2, stone.mid); E(fx - .8, fy - .8, 1.1, .7, stone.lit);
      });
    } },

    /* K4 횡단보도 호두: 빨간 사람이 켜진 보행 신호등, 흰 줄 위에 금 간 호두 */
    'crow:walnutCross': { w: 300, h: 270, d: (time, t) => {
      [-150, -90, -30, 30].forEach((x) => faded(.85, () => curvy([[x, 0], [x + 40, 0], [x + 12, 46], [x - 28, 46]], t('#f4f1ea'))));   // 바닥에 누운 흰 줄
      column(t, '#9aa3bb', 106, 112, 0, 107, 111, -230);
      const head = [[96, -268], [124, -268], [125, -250, 124, -204], [96, -204], [95, -250, 96, -268]];
      formed(t, '#3a3445', head, 99, 119);
      RR(100, -264, 20, 26, 3, t('#241f2c')); RR(100, -234, 20, 26, 3, t('#241f2c'));
      const glow = .75 + Math.sin(time * 2) * .15;
      faded(glow, () => {                                                                                   // 서 있는 빨간 사람
        E(110, -258, 2.4, 2.4, t('#ff5a4f'));
        fp('M106.6 -254 L113.4 -254 L113 -246 L111.6 -246 L111.4 -240 L108.6 -240 L108.4 -246 L107 -246 Z', t('#ff5a4f'));
      });
      faded(.35, () => { E(108, -224, 2.2, 2.2, t('#3fbf7f')); });
      faded(.18 * glow, () => E(110, -251, 18, 18, '#ff8a7a'));
      at(-14, 10, .1, [1.6, 1.6], () => {                                                                   // 금 간 호두 (실제의 세 배)
        const w = planes(t, '#b98a5e');
        fp('M-8 0 C-9 -6 -4 -9.6 0 -9.6 C4 -9.6 9 -6 8 0 C7 1.6 -7 1.6 -8 0 Z', w.mid);
        fp('M-8 0 C-9 -6 -4 -9.6 0 -9.6 C-3 -8 -6 -5 -6.4 0 Z', w.lit); fp('M8 0 C9 -6 4 -9.6 1.6 -9.4 C4 -7 5 -3 4.6 .9 C6 .8 7.4 .6 8 0 Z', w.dark);
        sp('M0 -9.6 L-1 -6 L1 -3.6 L-.6 0', t('#5e4030'), .8);
        sp('M-5 -6 q1.4 1 0 2.4 M4 -7 q-1.2 1.2 .2 2.6', t('#8a6a52'), .6);
      });
      at(6, 12, -.5, [1.6, 1.6], () => { fp('M-5 0 C-5 -3.6 -1 -5 2 -4 C5 -3 6 -1 5 0 Z', t('#b98a5e')); fp('M-3.4 -.6 C-3 -2.8 0 -3.4 2 -2.6 C3.6 -2 4 -1 3.6 -.6 Z', t('#efe0bf')); });
    } },

    /* K5 겨울 잠자리: 전봇대 변압기 양옆으로 늘어진 전깃줄마다 다닥다닥 붙은 까마귀들 (D5 가해자이기도 하다) */
    'crow:roostWires': { w: 640, h: 560, d: (time, t) => {
      const wires = [[-320, -470, -150, -436, -30, -496], [-320, -440, -150, -406, -30, -466], [30, -496, 170, -432, 320, -462], [30, -466, 170, -404, 320, -432]];
      ctx.strokeStyle = t('#241f2c'); ctx.lineWidth = 1.3; ctx.beginPath();
      wires.forEach(([x0, y0, cx, cy, x1, y1]) => { ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cx, cy, x1, y1); }); ctx.stroke();
      column(t, '#a29fb2', -14, 14, 0, -10, 10, -540);
      const arm = planes(t, '#8d8a9c');
      RR(-70, -506, 140, 8, 2, arm.mid); R(-70, -506, 140, 2.6, arm.lit);
      [-56, -30, 30, 56].forEach((x) => { const p = planes(t, '#f4f1ea'); fp(`M${x - 3} -506 C${x - 4} -512 ${x - 2} -518 ${x} -519 C${x + 2} -518 ${x + 4} -512 ${x + 3} -506 Z`, p.mid); E(x - 1, -514, 1, 3, p.lit); });
      const can = [[14, -390], [14, -446, 20, -452, 34, -452], [48, -452, 54, -446, 54, -390], [54, -384, 46, -380, 34, -380], [22, -380, 14, -384, 14, -390]];
      formed(t, '#8d8a9c', can, 22, 44);
      RR(12, -456, 44, 6, 2, arm.mid); R(12, -456, 44, 2, arm.lit);
      faded(.4 + Math.sin(time * 3) * .2, () => { E(46, -462, 2, 2, t('#ffd56b')); });
      const q = (w, k) => { const [x0, y0, cx, cy, x1, y1] = w, u = 1 - k; return [u * u * x0 + 2 * u * k * cx + k * k * x1, u * u * y0 + 2 * u * k * cy + k * k * y1]; };
      [[0, .1], [0, .28], [0, .46], [0, .7], [1, .2], [1, .55], [1, .84], [2, .2], [2, .42], [2, .66], [2, .88], [3, .34], [3, .62]].forEach(([wi, k], i) => {
        const [x, y] = q(wires[wi], k);
        crowBird(time, t, { x, y: y + 1, s: .82, pose: i % 4 === 1 ? 'stand' : 'sit', flip: hash(i, 4) > .55, seed: i });
      });
    } },

    /* K6 찢긴 종량제 봉투(1.3배): 눈 덮인 매듭, 쭉 찢긴 옆구리로 쏟아진 치킨 뼈 */
    'crow:tornBag': { w: 104, h: 82, d: (time, t) => at(0, 0, 0, [1.3, 1.3], () => {
      const p = planes(t, '#efeadb'), body = [[-26, 0], [-34, -14, -26, -40, -8, -48], [0, -50], [8, -48], [26, -42, 32, -18, 26, 0], [0, 1.6, -26, 0]];
      curvy(body, p.mid);
      inside(body, () => { E(22, -6, 22, 40, p.dark); curvy([[-40, -10], [-34, -40, -10, -54, 4, -52], [-6, -44, -22, -32, -30, -8]], p.lit); R(-40, -30, 80, 8, t('#f2a03d')); });
      label('종량제', -18, -24, '800 5px sans-serif', t('#fbf7ee'));
      curvy([[-6, -48], [-10, -56, -8, -60, -4, -59], [0, -55], [4, -60, 10, -58, 8, -50]], p.mid);         // 매듭
      curvy([[-8, -50], [-12, -58, -2, -64, 2, -56], [6, -64, 14, -58, 10, -50], [4, -54, -4, -54, -8, -50]], t(SNOW));
      curvy([[-24, -44], [-10, -52, 10, -52, 22, -44], [8, -47, -10, -47, -24, -44]], t(SNOW));
      fp('M26 -4 C20 -10 18 -22 24 -30 C28 -22 30 -12 29 -4 Z', t('#2a2240'));                                // 찢긴 틈
      const bone = planes(t, '#f3e6cf');
      [[34, -3, .3], [44, -1.6, -.2], [28, -10, .9]].forEach(([x, y, a]) => at(x, y, a, null, () => {
        fp('M-5 -.8 L5 -.8 C6 -2.6 8.4 -1.6 7.4 0 C8.4 1.6 6 2.6 5 .8 L-5 .8 C-6 2.6 -8.4 1.6 -7.4 0 C-8.4 -1.6 -6 -2.6 -5 -.8 Z', bone.mid);
        R(-5, -.8, 10, .6, bone.lit);
      }));
      fp('M30 -.2 C32 -4 40 -4 42 -.2 Z', t('#c98a4a'));
    }) },
    /* K6·D6 눈 위의 쥐(알아보게 1.6배): 옆으로 누워 꼼짝 않는 쥐와 찢긴 쥐약 봉지, 흩어진 푸른 알갱이 */
    'crow:poisonRat': { w: 112, h: 26, d: (time, t) => at(0, 0, 0, [1.6, 1.6], () => {
      const f = planes(t, '#8f8a96'), pink = t('#d9a6a6');
      sp('M-14 -2 C-24 -1 -26 -6 -34 -3', t('#c99a9a'), 1.2);
      [[-9, -9, -11, -15], [-4, -10, -4, -16], [3, -10, 4, -16], [8, -9, 10, -14]].forEach(([x0, y0, x1, y1]) => sp(`M${x0} ${y0} L${x1} ${y1}`, pink, 1.1));   // 하늘로 뻗은 네 발
      const body = [[-15, -1], [-17, -8, -6, -11, 4, -10], [10, -9, 14, -6, 18, -2.4], [14, -.4, 6, 0, -2, 0], [-10, 0, -15, -1]];
      curvy(body, f.mid); inside(body, () => { R(-20, -14, 40, 4.6, t('#d8d2dc')); R(-20, -3, 40, 4, f.dark); });   // 위로 뒤집힌 하얀 배
      E(9, -2.6, 2.6, 2, f.dark); E(9, -2.6, 1.4, 1, pink);
      sp('M12.4 -5.6 q1 .9 2 0', t(INK), .5); E(18.2, -2.6, .8, .7, pink);
      at(28, -.2, -.15, null, () => {
        const pk = planes(t, '#d24a4a'), bag = [[-7, 0], [6, 0], [7, -9], [3, -10], [1, -8.4], [-1, -10.4], [-7, -10]];
        curvy(bag, pk.mid); inside(bag, () => { R(-8, -11, 4, 12, pk.lit); R(4, -11, 4, 12, pk.dark); R(-8, -7, 16, 3.6, t('#fbf7ee')); });
        label('쥐약', -5.4, -4.4, '800 3.2px sans-serif', t('#d24a4a'));
      });
      [[18, -.6], [21, -.4], [23.5, -.8], [38, -.5], [41, -.4]].forEach(([x, y]) => E(x, y, .9, .6, t('#5fb8a8')));
    }) },

    /* K7 꾸룩꾸룩: 공원 가로등 위에서 고개 숙이고 꼬리를 편 젊은 수컷이 땅콩을 툭 내려놓는다 */
    'crow:suitor': { w: 90, h: 340, d: (time, t) => {
      column(t, '#4f6d5f', -4, 4, 0, -2.6, 2.6, -280);
      const lamp = [[-16, -282], [-14, -300, -6, -306], [6, -306], [14, -300, 16, -282]];
      formed(t, '#4f6d5f', lamp, -10, 8);
      faded(.85, () => curvy([[-12, -282], [12, -282], [9, -272, 0, -270], [-9, -272, -12, -282]], t('#fff1b8')));
      curvy([[-22, -304], [0, -316], [22, -304], [0, -300]], planes(t, '#4f6d5f').lit);
      peanut(t, 18, -306, .2, 2.4);
      crowBird(time, t, { y: -306, x: -6, pose: 'bow', seed: 2 });
      notes(time, '꾸룩', -6, -362, 11); notes(time + .5, '꾸룩', 20, -352, 10);
    } },

    /* B1 떠돌이 무리: 음식물 통 뚜껑을 들어 올리는 녀석, 흘린 밥알을 쪼는 녀석, 망보는 녀석 */
    'crow:youngGang': { w: 160, h: 110, d: (time, t) => {
      const bin = [[-24, 0], [-27, -30, -27, -56], [27, -56], [27, -30, 24, 0], [0, 1.4, -24, 0]];
      formed(t, '#e8a33a', bin, -16, 14);
      RR(-14, -40, 24, 12, 2, t('#fbf7ee')); label('음식물', -2, -31.6, '800 6px sans-serif', t('#c2702a'), 'center');
      const lift = .35 + Math.abs(Math.sin(time * 2.4)) * .2;
      at(-28, -57, -lift, null, () => {                                                                     // 들린 뚜껑
        const lid = planes(t, '#f2b85a');
        curvy([[0, 0], [2, -6, 28, -6, 56, -2], [56, 2], [28, 1, 0, 2]], lid.mid); curvy([[0, 0], [2, -6, 28, -6, 56, -2], [28, -3, 10, -2, 0, 0]], lid.lit);
      });
      crowBird(time, t, { x: 24, y: -56, flip: true, pose: 'peck', s: .95, seed: 1 });
      [[38, -1], [46, -.6], [52, -1.2], [60, -.8]].forEach(([x, y], i) => E(x, y, 2.2, 1.2, t(i % 2 ? '#fbf7ee' : '#e6765f')));
      crowBird(time, t, { x: 58, pose: 'peck', seed: 3 });
      crowBird(time, t, { x: -54, pose: 'stand', seed: 5 });
    } },

    /* K8 세탁소 행거: 바퀴 달린 옷걸이대에 철사 옷걸이가 주렁주렁, 한 녀석이 부리로 하나를 빼 간다 */
    'crow:hangerRack': { w: 160, h: 180, d: (time, t) => {
      const chrome = planes(t, '#c9ccd4');
      [-60, 60].forEach((x) => { rod([[x, -6], [x, -150]], chrome.mid, 3.2); rod([[x - 1, -8], [x - 1, -148]], chrome.lit, 1); });
      rod([[-64, -150], [64, -150]], chrome.mid, 3.4); rod([[-64, -151.2], [64, -151.2]], chrome.lit, 1);
      rod([[-74, -6], [-46, -6]], chrome.dark, 3); rod([[46, -6], [74, -6]], chrome.dark, 3);
      [-72, -48, 48, 72].forEach((x) => E(x, -3, 3, 3, t('#3a3445')));
      const hanger = (x, a, c) => at(x, -150, a, null, () => rod([[0, 0], [0, -3, 3, -3], [5, -3, 4, 0], [0, 4], [-15, 14], [15, 14], [0, 4]], c, 1.1));
      [-46, -36, -26, 18, 28, 38].forEach((x, i) => hanger(x, Math.sin(time * 1.4 + i) * .04, chrome.dark));
      at(-8, -150, 0, null, () => {                                                                         // 비닐 씌운 와이셔츠 한 벌
        rod([[0, 0], [0, -3, 3, -3], [5, -3, 4, 0], [0, 4]], chrome.dark, 1.1);
        const sh = planes(t, '#a9c4e0'), shirt = [[-14, 6], [0, 3], [14, 6], [17, 14, 15, 70], [-15, 70], [-17, 14, -14, 6]];
        curvy(shirt, sh.mid); inside(shirt, () => { R(-20, 0, 8, 80, sh.lit); R(9, 0, 10, 80, sh.dark); });
        faded(.45, () => { curvy([[-17, 4], [17, 4], [19, 74], [-19, 74]], WHITE); });
      });
      const tug = Math.sin(time * 3) * .12;
      at(62, -146, .5 + tug, null, () => rod([[0, 0], [-15, 12], [15, 12], [0, 0], [0, -4]], chrome.lit, 1.2));   // 빼내는 옷걸이
      crowBird(time, t, { x: 76, y: -151, flip: true, pose: 'peck', s: .95, seed: 2 });
      label('행복 세탁', 0, -164, '800 11px sans-serif', t('#5f8fb0'), 'center');
    } },

    /* K9 까마귀 주의 입간판 */
    'crow:warnSign': { w: 70, h: 112, d: (time, t) => {
      const legs = planes(t, '#c9a23a');
      fp('M-22 0 L-26 0 L-10 -104 L-6 -104 Z', legs.dark); fp('M22 0 L26 0 L10 -104 L6 -104 Z', legs.dark);
      const board = [[-28, -20], [-20, -108], [20, -108], [28, -20]];
      formed(t, '#f2c94c', board, -24, 22);
      fp('M0 -100 L9 -86 L-9 -86 Z', t('#d24a4a')); label('!', 0, -88, '900 9px sans-serif', t('#fbf7ee'), 'center');
      label('까마귀', 0, -70, '900 11px sans-serif', t('#3b3049'), 'center');
      label('공격 주의', 0, -57, '900 10px sans-serif', t('#d24a4a'), 'center');
      ['번식기 4~6월', '우산을 쓰고', '지나가세요'].forEach((s, i) => label(s, 0, -44 + i * 6.4, '600 5px sans-serif', t('#3b3049'), 'center'));
      label('관리사무소', 0, -24, '700 4.4px sans-serif', t('#6b5a3a'), 'center');
    } },
    /* K9 바닥의 새끼들: 꼬리 짧고 눈이 아직 푸른 둘, 하나는 입을 벌려 조른다 */
    'crow:fledglings': { w: 90, h: 44, d: (time, t) => {
      crowBird(time, t, { x: -18, s: .78, c: JUV, shortTail: true, pose: 'gape', seed: 1 });
      crowBird(time, t, { x: 22, s: .74, c: JUV, shortTail: true, pose: 'stand', flip: true, seed: 4 });
    } },
    /* K9 다 큰 파란 모자: 휴대폰을 들고 걸어오는 키 큰 중학생 */
    'crow:blueCapTeen': { w: 70, h: 180, d: (time, t) => {
      const H = 168, bag = planes(t, '#3a3445'), pack = [[-.06 * H, -.74 * H], [-.17 * H, -.72 * H, -.17 * H, -.5 * H], [-.06 * H, -.48 * H]];
      curvy(pack, bag.mid); inside(pack, () => R(-.2 * H, -.75 * H, .04 * H, .3 * H, bag.lit));
      person(time, t, { h: H, top: '#e9e4ec', bottom: '#2f3a4f', hair: '#2f2a3a', arm: 'out', handPose: 'grip', extra: capExtra(t, BLUE_CAP) });
      const hx = .22 * H, hy = -.61 * H + Math.sin(time * 3) * H * .01;
      at(hx + 1, hy - 5, -.25, null, () => { RR(-2.6, -6, 5.2, 10, 1.2, t('#241f2c')); faded(.5, () => R(-1.6, -5, 3.2, 7.4, '#9fc6d8')); });
    } },

    /* K10·D8 까마귀 포획틀: 위로 깔때기처럼 열린 입구, 안에는 고기와 갇힌 한 마리, 앞엔 자물쇠와 안내판 */
    'crow:trapCage': { w: 240, h: 210, d: (time, t) => {
      const fr = planes(t, '#7d7a8c'), x0 = -100, x1 = 100, top = -160, d = 22;
      faded(.18, () => { R(x0, top, x1 - x0, -top, t('#5f5a66')); });
      curvy([[x0, top], [x0 + d, top - d * .6], [x1 + d, top - d * .6], [x1, top]], fr.lit);
      fp(`M-30 ${top} L30 ${top} L10 ${top + 26} L-10 ${top + 26} Z`, t('#2a2240'));                            // 위에서 안으로 좁아지는 입구
      const meat = planes(t, '#d9646a');
      curvy([[-30, -1], [-34, -10, -16, -14, -6, -10], [2, -12, 6, -4, 2, -1]], meat.mid); curvy([[-30, -1], [-34, -10, -16, -14, -6, -10], [-16, -8, -24, -5, -30, -1]], meat.lit);
      E(-14, -8, 3, 2, t('#f4e1d8'));
      crowBird(time, t, { x: 34, pose: 'gape', flip: true, seed: 6 });
      ctx.save(); ctx.beginPath(); ctx.rect(x0, top, x1 - x0, -top); ctx.clip();
      ctx.strokeStyle = t('#5f5a66'); ctx.lineWidth = .5; ctx.beginPath();
      for (let x = x0; x <= x1; x += 5) { ctx.moveTo(x, top); ctx.lineTo(x, 0); }
      for (let y = top; y <= 0; y += 5) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); }
      ctx.stroke(); ctx.restore();
      [[x0, 4], [x1 - 4, 4], [-4, 3]].forEach(([x, w], i) => { R(x, top, w, -top, i === 1 ? fr.dark : fr.mid); if (i !== 1) R(x, top, 1.2, -top, fr.lit); });
      R(x0, top, x1 - x0, 4, fr.mid); R(x0, -4, x1 - x0, 4, fr.dark);
      curvy([[x1, top], [x1 + d, top - d * .6], [x1 + d, -d * .6], [x1, 0]], fr.dark);
      const lock = planes(t, '#e8c24a'); rod([[-1.6, -84], [-1.6, -90, 2, -90], [5.6, -90, 5.6, -84]], t('#8d8a9c'), 1.4); RR(-3.6, -84, 11, 9, 1.6, lock.mid); R(-3.6, -84, 3, 9, lock.lit);
      const sign = planes(t, '#f4f1ea'); RR(40, -120, 52, 24, 2, sign.mid); R(40, -120, 52, 3, sign.lit);
      label('유해야생동물', 66, -110, '800 6px sans-serif', t('#d24a4a'), 'center'); label('포획 중 · 구청', 66, -101, '700 5px sans-serif', t('#3b3049'), 'center');
    } },

    /* K11 화단 담장: 땅콩 세 알과 한 줄로 세운 병뚜껑 */
    'crow:capLedge': { w: 170, h: 66, d: (time, t) => {
      const wall = [[-80, 0], [-80, -50], [-79, -54, -75, -55], [75, -55], [79, -54, 80, -50], [80, 0]];
      const p = formed(t, '#c9b8a6', wall, -76, 72);
      curvy([[-80, -50], [-76, -60], [84, -60], [80, -50]], p.lit);
      [-40, 0, 40].forEach((x) => R(x, -48, 1.2, 48, p.dark));
      [[-30, .2], [-20, -.3], [-24, .7]].forEach(([x, a], i) => peanut(t, x, -58 - (i === 2 ? 2 : 0), a, 2.2));
      CAPS.forEach((c, i) => bottleCap(t, 12 + i * 12, -57, c));
      faded(.5 + Math.sin(time * 2.4) * .4, () => { L(34, -66, 38, -66, WHITE, .8); L(36, -68, 36, -64, WHITE, .8); });
    } },
    /* K11 어른이 된 그 애: 정장에 어깨 가방, 빨간 머리핀은 그대로. 담장에 땅콩을 내려놓는다 */
    'crow:grownGirl': { w: 70, h: 175, d: (time, t) => {
      const H = 165, strap = planes(t, '#b06a4a');
      person(time, t, { h: H, top: '#3d4c66', bottom: '#2f2a3a', hair: '#2f2a3a', arm: 'out', handPose: 'flat', extra: pinExtra(t) });
      rod([[.06 * H, -.75 * H], [-.02 * H, -.62 * H, -.1 * H, -.5 * H]], strap.dark, 1.6);
      const bag = [[-.15 * H, -.52 * H], [-.04 * H, -.52 * H], [-.03 * H, -.36 * H], [-.16 * H, -.36 * H]];
      curvy(bag, strap.mid); inside(bag, () => R(-.17 * H, -.53 * H, .04 * H, .2 * H, strap.lit));
      const ph = (time * .6) % 1;
      faded(1 - ph * .6, () => peanut(t, .25 * H, -.6 * H + 8 + ph * 18, ph * 3, 2));
    } },

    /* ── 죽음의 순간에만 튀어나오는 그림 ── */
    /* D3 날아든 돌멩이: 오른쪽에서 쉭 날아온다 */
    'crow:flyingStone': { w: 120, h: 40, d: (time, t) => at(0, 0, 0, [2, 2], () => {
      const stone = planes(t, '#a0968d');
      faded(.55, () => [-4, 0, 4].forEach((d, i) => sp(`M${10 + i * 4} ${d - 8} L${44 + i * 6} ${d * 1.6 - 12}`, WHITE, 1.6)));
      E(1, -7, 7, 5.6, stone.dark); E(0, -8, 6.4, 5, stone.mid); E(-2, -10, 2.6, 1.6, stone.lit);
    }) },
    /* D5 감전: 전선 한 토막과 번쩍 튀는 불꽃 */
    'crow:spark': { w: 260, h: 170, d: (time, t) => at(0, 0, 0, [2.2, 2.2], () => {
      rod([[-60, -30], [0, -38, 60, -30]], t('#241f2c'), 1.4);
      const flick = .6 + Math.abs(Math.sin(time * 23)) * .4;
      faded(.35 * flick, () => E(4, -34, 30, 26, t('#fff1b8')));
      [[0, -1], [.9, 1], [2.1, -1], [3.3, 1], [4.4, -1], [5.4, 1]].forEach(([a, k]) => at(4, -34, a + Math.sin(time * 9) * .1, null, () =>
        fp(`M0 -1.6 L${10 * flick} ${-3 * k} L${8 * flick} 0 L${20 * flick} ${1.4 * k} L${9 * flick} 2 L${10 * flick} ${.6 * k} L0 1.6 Z`, t('#ffd56b'))));
      E(4, -34, 4, 4, WHITE);
    }) },
    /* D6 쥐약 봉지: 찢긴 봉지에서 푸른 알갱이가 쏟아져 있다 */
    'crow:poisonPacket': { w: 84, h: 48, d: (time, t) => at(0, 0, -.12, [3.6, 3.6], () => {
      const pk = planes(t, '#d24a4a'), bag = [[-7, 0], [6, 0], [7, -9], [3, -10], [1, -8.4], [-1, -10.4], [-7, -10]];
      curvy(bag, pk.mid); inside(bag, () => { R(-8, -11, 4, 12, pk.lit); R(4, -11, 4, 12, pk.dark); R(-8, -7, 16, 3.6, t('#fbf7ee')); });
      label('쥐약', -5.4, -4.4, '800 3.2px sans-serif', t('#d24a4a'));
      [[8, -.5], [9.6, -.3], [11, -.6], [12.6, -.3], [10.4, -1.4]].forEach(([x, y]) => E(x, y, .7, .5, t('#5fb8a8')));
    }) },
    /* D8 철망 안: 주인공 앞을 막아선 포획틀 철망 한 면 */
    'crow:cageInside': { w: 160, h: 150, d: (time, t) => {
      const fr = planes(t, '#7d7a8c');
      faded(.2, () => R(-80, -150, 160, 150, t('#5f5a66')));
      ctx.strokeStyle = t('#5f5a66'); ctx.lineWidth = .7; ctx.beginPath();
      for (let x = -80; x <= 80; x += 6) { ctx.moveTo(x, -150); ctx.lineTo(x, 0); }
      for (let y = -150; y <= 0; y += 6) { ctx.moveTo(-80, y); ctx.lineTo(80, y); }
      ctx.stroke();
      R(-84, -154, 168, 5, fr.lit); R(-84, -5, 168, 5, fr.dark); R(-84, -154, 5, 154, fr.mid); R(79, -154, 5, 154, fr.dark);
    } },
  };

  return [art, hero];
})());
