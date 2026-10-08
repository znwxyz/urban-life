/* 까치 장면 전용 그림과 주인공 까치. 키는 'magpie:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   까치 눈높이(화면 폭 약 12m)에 맞춰 실제 크기로 그린다: 까치 45cm(꼬리 절반), 큰부리까마귀 57cm, 사람 170cm.
   전봇대 조각(poleNest·poleTop·hangerNest·oldDad·sparkPole)은 땅에서 POLE_Y(230cm) 위에 원점을 두고 기둥을 땅까지 내린다.
   사물은 곡선 실루엣 하나에 한 색의 2~3톤(왼쪽 위 빛)만 쓴다. Node에서는 키 목록만 내보낸다 */
(function register(art, hero) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else { Object.assign(ACTORS, art); ANIMALS.magpieHero = hero; }
})(...(() => {
  const MG = Object.freeze({ black: '#2f2b40', white: '#f7f4ee', whiteShade: '#d6d3e0', blue: '#4d72c2', teal: '#2f8a8c',
    violet: '#5f4f9e', beak: '#2a2636', leg: '#3a3546' });
  const CROW = Object.freeze({ black: '#25212f', sheen: '#4a5590', beak: '#1f1c28' });
  const TWIG = '#9a7656', CONCRETE = '#a7a3b5', STEEL = '#7f7c90', PORCELAIN = '#f1eee8', WIRE = '#3a3546';
  const YELLOW = '#f2bf45', PERSIMMON = '#f08a3c', GINKGO = '#8a6a52', GAPE = '#ffd56b', MOUTH = '#ff7a6b';
  const POLE_Y = 230, HERO_SCALE = 1.3, EYE_RING = '#d9d4e6';

  /* ── 종이 오리기 도구 (이 파일 좌표 그대로, 위가 -y) ── */
  const PATHS = new Map();
  function path(d) { if (!PATHS.has(d)) PATHS.set(d, new Path2D(d)); return PATHS.get(d); }
  function fp(d, c) { ctx.fillStyle = c; ctx.fill(path(d)); }
  function inPath(d, draw) { ctx.save(); ctx.clip(path(d)); draw(); ctx.restore(); }
  function faded(a, draw) { ctx.save(); ctx.globalAlpha *= a; draw(); ctx.restore(); }
  function at(x, y, r, s, draw) { ctx.save(); ctx.translate(x, y); if (r) ctx.rotate(r); if (s) ctx.scale(s[0], s[1]); draw(); ctx.restore(); }
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
  /** 실루엣(pts) 안쪽에만 칠한다 */
  function inside(pts, draw) { ctx.save(); outline(pts); ctx.clip(); draw(); ctx.restore(); }
  /** 글자는 뒤집혀 그려져도 거울글씨가 되지 않게 바로 세운다 */
  function label(text, x, y, font, color, align = 'center') {
    ctx.save(); ctx.translate(x, y); if (ctx.getTransform().a < 0) ctx.scale(-1, 1);
    ctx.fillStyle = color; ctx.font = font; ctx.textAlign = align; ctx.fillText(text, 0, 0); ctx.restore();
  }
  /** 제자리에서 떠올랐다 사라지는 울음소리 */
  function call(time, t, text, x, y, size) {
    const ph = (time * .7) % 1;
    faded(Math.min(1, (1 - ph) * 1.6), () => label(text, x, y - ph * size * .8, `800 ${size}px sans-serif`, t(INK)));
  }
  /** 끝으로 갈수록 가늘어지는 가지·줄기 하나 (x0,y0 → 휘는 점 cx,cy → x1,y1) */
  function limb(x0, y0, cx, cy, x1, y1, w0, w1, c) {
    const nrm = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l]; };
    const [ax, ay] = nrm(x0, y0, cx, cy), [bx, by] = nrm(cx, cy, x1, y1), [mx, my] = nrm(x0, y0, x1, y1), wm = (w0 + w1) / 2;
    ctx.fillStyle = c; ctx.beginPath();
    ctx.moveTo(x0 + ax * w0 / 2, y0 + ay * w0 / 2);
    ctx.quadraticCurveTo(cx + mx * wm / 2, cy + my * wm / 2, x1 + bx * w1 / 2, y1 + by * w1 / 2);
    ctx.lineTo(x1 - bx * w1 / 2, y1 - by * w1 / 2);
    ctx.quadraticCurveTo(cx - mx * wm / 2, cy - my * wm / 2, x0 - ax * w0 / 2, y0 - ay * w0 / 2);
    ctx.closePath(); ctx.fill();
  }
  /** 가지 묶음: 오른쪽으로 비낀 그늘 한 겹 위에 앞면 한 겹. list: [x0,y0,cx,cy,x1,y1,w0,w1] */
  function limbs(t, c, list) {
    const p = planes(t, c);
    list.forEach(([x0, y0, cx, cy, x1, y1, w0, w1]) => limb(x0 + w0 * .22, y0, cx + w0 * .2, cy, x1 + w1 * .2, y1, w0, w1, p.dark));
    list.forEach(([x0, y0, cx, cy, x1, y1, w0, w1]) => limb(x0, y0, cx, cy, x1, y1, w0 * .78, w1 * .7, p.mid));
    list.filter((b, i) => i % 2 === 0).forEach(([x0, y0, cx, cy, x1, y1, w0, w1]) => limb(x0 - w0 * .2, y0, cx - w0 * .2, cy, x1 - w1 * .1, y1, w0 * .26, w1 * .2, p.lit));
  }

  /* ── 까치 한 마리 (몸 45cm 중 꼬리가 절반). o: { x, y, s, flip, pose: stand|mob|fly|puff|call, seed, flap, tail(꼬리 길이 배수), sleepy, twig, bent(꺾인 꼬리깃) } ── */
  const BODY = 'M9.5 -20 C13.5 -15 11.5 -7.5 3.5 -6 C-3 -4.8 -9 -7.5 -11.5 -11.5 C-9 -16.5 -1 -21.5 9.5 -20 Z';
  const FLANK = 'M8 -11.4 C6.6 -7.6 3 -6.1 -1 -6 C-4.6 -6 -7.6 -7.4 -9.2 -9.6 C-4 -10.8 2 -11.8 8 -11.4 Z';
  const WING = 'M7 -18.5 C2 -20.5 -6 -18.6 -13.5 -12.5 C-8 -10.6 -2 -11 2.5 -12.6 C6 -14 8 -16.4 7 -18.5 Z';
  const SCAPULAR = 'M6.4 -18.6 C2 -20 -3.4 -19 -8 -15.8 C-3 -16.4 2 -16.9 6.2 -16.3 Z';
  const WING_TIP = 'M-5.5 -13.6 L-13.5 -12.5 L-6.6 -11.2 Z';
  const TAIL = 'M0 -1.6 C-8 -2.4 -18 -1.8 -24 0 C-26.8 .8 -27 3.6 -24.6 4.6 C-18 5.8 -8 3.8 0 2 Z';
  const OPEN = 'M2 2 C-1 -6 -6 -14 -15 -19.5 C-17.6 -21 -19.8 -19.6 -19.4 -17 C-18.4 -11.4 -15.4 -6.4 -11.4 -3.2 C-7.4 -.2 -3 1.8 2 3.4 Z';
  const OPEN_WHITE = 'M-8.6 -15 C-12 -17 -15 -19 -17.6 -19.9 C-19.6 -19.8 -19.8 -18 -19.2 -15.8 C-18 -11 -15.6 -7 -12.4 -4.2 C-11.6 -8 -10.4 -11.6 -8.6 -15 Z';

  function magTail(t, bent) {
    const p = planes(t, MG.teal);
    fp(TAIL, p.mid);
    inPath(TAIL, () => {
      fp('M2 -3 C-8 -2.6 -18 -1 -26 1.6 L-26 2.6 C-18 .8 -8 -.6 2 -.8 Z', p.lit);
      fp('M-17 -2 L-27 0 L-27 8 L-17 6 Z', t(MG.violet));
      fp('M2 1.2 C-8 1.8 -17 3.6 -26 5 L-26 8 L2 8 Z', p.dark);
    });
    if (bent) fp('M-12 1.6 L-19 6.4 L-18.4 7.2 L-11.4 2.6 Z', p.dark);                                      // 꺾인 꼬리깃 하나
  }

  function magHead(time, t, o, pose) {
    const hx = pose === 'puff' ? 7 : 8, hy = pose === 'puff' ? -19.4 : pose === 'call' ? -22.4 : -21;
    E(hx, hy, 6.2, 6, t(MG.black));
    faded(.5, () => E(hx - 2.2, hy - 2.6, 2.6, 1.8, t(mix(MG.black, MG.blue, .5))));                             // 정수리 윤기
    if (o.sleepy) { ctx.strokeStyle = t(EYE_RING); ctx.lineWidth = .5; ctx.beginPath(); ctx.arc(hx + 2.2, hy - 1.4, 1, .2, Math.PI - .2); ctx.stroke(); }
    else { E(hx + 2.2, hy - 1, 1.55, 1.7, t(EYE_RING)); cuteEye(hx + 2.2, hy - 1, .95, 1.1, time + (o.seed || 0), t); }
    blush(hx + 2.8, hy + 2.4, 1.3, .7);
    const open = pose === 'mob' || pose === 'call' ? .6 + Math.abs(Math.sin(time * 9 + (o.seed || 0))) * 1.6 : 0;
    const bx = hx + 5;
    if (open) {
      fp(`M${bx} ${hy - 1.6} L${bx + 5.6} ${hy - .6 - open * .6} L${bx} ${hy + .2} Z`, t(MG.beak));
      fp(`M${bx} ${hy + .4} L${bx + 5} ${hy + .8 + open * .5} L${bx} ${hy + 1.6} Z`, t(MG.beak));
      E(bx + .4, hy + .3, .5, .4, t(MOUTH));
    } else {
      fp(`M${bx} ${hy - 1.6} L${bx + 5.6} ${hy} L${bx} ${hy + 1.6} Z`, t(MG.beak));
      fp(`M${bx} ${hy - 1.6} L${bx + 5.6} ${hy} L${bx} ${hy - .2} Z`, t(mix(MG.beak, '#ffffff', .18)));
    }
    if (o.twig) at(bx + 2.6, hy + .2, -.25, null, () => limb(-9, 0, 0, -1, 10, .6, 1.2, .7, t(TWIG)));
  }

  function magWingOpen(time, t, o, far) {
    const f = o.flap !== undefined ? o.flap : o.pose === 'mob' ? .35 + Math.sin(time * 18 + (o.seed || 0)) * .2 : Math.sin(time * 12 + (o.seed || 0));
    at(far ? 5 : 3, far ? -19.4 : -18, far ? -.12 : 0, [1, .2 + .8 * f], () => {
      if (far) { fp(OPEN, t(shade(MG.black))); fp(OPEN_WHITE, t(MG.whiteShade)); return; }
      fp(OPEN, t(MG.black));
      inPath(OPEN, () => fp('M4 4 C0 -4 -4 -10 -8.6 -15 C-6 -8 -4 -2 -6 4 Z', t(MG.blue)));                       // 안쪽 깃 푸른 윤기
      fp(OPEN_WHITE, t(MG.white));
      fp('M-17.6 -19.9 C-19.6 -19.8 -19.8 -18 -19.2 -15.8 L-17.6 -17.4 Z', t(MG.black));                       // 날개 끝 검은 테
    });
  }

  function magpie(time, t, o = {}) {
    const pose = o.pose || 'stand', seed = o.seed || 0;
    const hop = pose === 'stand' ? Math.max(0, Math.sin(time * 2.4 + seed)) ** 12 * 1.4 : 0;
    ctx.save(); ctx.translate(o.x || 0, (o.y || 0) - hop); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose === 'puff') ctx.scale(1.1, 1.1);
    const winged = pose === 'fly' || pose === 'mob';
    if (winged) magWingOpen(time, t, { ...o, pose }, true);
    if (pose !== 'fly' && pose !== 'puff') {
      [[1, 0], [4.4, .6]].forEach(([x, dx]) => { L(x, -6.4, x + dx, 0, t(MG.leg), .9); L(x + dx - 1, 0, x + dx + 2.2, 0, t(MG.leg), .6); });
    }
    const flick = pose === 'mob' ? .42 + Math.sin(time * 10 + seed) * .1 : pose === 'fly' ? .06 : pose === 'puff' ? -.1 : -.04 + Math.max(0, Math.sin(time * 1.7 + seed)) ** 6 * .3;
    at(-8.5, -11.5, flick, [o.tail || 1, 1], () => {
      if (pose === 'mob') at(0, 0, -.16, null, () => fp(TAIL, t(shade(MG.teal))));                              // 부채처럼 편 꼬리
      magTail(t, o.bent);
    });
    fp(BODY, t(MG.black));
    fp(FLANK, t(MG.white)); inPath(FLANK, () => E(-2, -5.6, 9, 2.4, t(MG.whiteShade)));
    if (winged) magWingOpen(time, t, { ...o, pose }, false);
    else {
      const w = planes(t, MG.blue);
      fp(WING, w.mid); inPath(WING, () => { fp('M-14 -10 C-6 -12 2 -13 9 -15 L9 -10 L-14 -8 Z', w.dark); });
      fp(SCAPULAR, t(MG.white)); fp(WING_TIP, t(MG.black));
    }
    magHead(time, t, o, pose);
    ctx.restore();
  }

  /** 둥지 입구로 머리만 내민 새끼 (입을 쩍 벌린다) */
  function chick(time, t, x, y, seed, s = 1) {
    const open = .5 + Math.abs(Math.sin(time * 5 + seed * 1.7)) * .5, sway = Math.sin(time * 4 + seed) * .12;
    at(x, y, sway, [s, s], () => {
      E(0, 0, 4.2, 4, t(MG.black)); E(-1, 2.6, 3, 1.6, t(MG.white));
      cuteEye(1.4, -1, .7, .8, time + seed, t);
      at(3.2, .2, -.5, null, () => {
        fp(`M0 -1 L5 ${-1.6 - open * 2} L4.6 -.6 Z`, t(GAPE)); fp(`M0 1 L5 ${1.6 + open * 1.6} L4.4 .6 Z`, t(GAPE));
        fp(`M.2 -.8 L4.4 ${-1.2 - open * 1.6} L4.4 ${1.2 + open * 1.3} L.2 .8 Z`, t(MOUTH));
      });
    });
  }

  /* ── 큰부리까마귀 (57cm). pose: stand|peck|lunge|fly ── */
  const CROW_BODY = 'M12 -25 C16 -17 12 -8 3 -7 C-6 -6 -12 -10.5 -15 -16 C-11 -23 0 -28 12 -25 Z';
  const CROW_WING = 'M9 -23 C2 -25.5 -8 -23 -17 -15 C-10 -12.6 -2 -13 3.6 -15 C8 -16.6 10.6 -20.4 9 -23 Z';
  const CROW_TAIL = 'M-12 -16.4 L-26 -12.4 Q-27.4 -9.6 -25.4 -8.6 L-11 -11.6 Z';
  const CROW_OPEN = 'M2 2 C-2 -8 -9 -17 -21 -23 C-24 -24 -26.4 -22 -25.4 -19 C-24 -13 -20 -7 -15 -3.6 C-10 -.4 -4 1.6 2 3.6 Z';
  function crowHead(time, t, open, hx, hy) {
    E(hx, hy, 7.4, 7, t(CROW.black));
    fp(`M${hx - 4} ${hy - 6} C${hx} ${hy - 9.4} ${hx + 5} ${hy - 8} ${hx + 6.6} ${hy - 3} L${hx} ${hy - 3} Z`, t(CROW.black));    // 솟은 이마
    E(hx + 2.6, hy - 1.4, 1.7, 1.85, t('#7d7890')); cuteEye(hx + 2.6, hy - 1.4, 1.05, 1.2, time + 3, t);
    const bx = hx + 5.4;
    fp(`M${bx} ${hy - 4.4} C${bx + 5} ${hy - 6} ${bx + 10} ${hy - 3.6} ${bx + 12} ${hy + .4 - open * .3} C${bx + 8} ${hy - .4} ${bx + 4} ${hy - .2} ${bx} ${hy + .4} Z`, t(CROW.beak));
    fp(`M${bx} ${hy - 4.4} C${bx + 5} ${hy - 6} ${bx + 10} ${hy - 3.6} ${bx + 12} ${hy + .4 - open * .3} C${bx + 7} ${hy - 3} ${bx + 3} ${hy - 3.4} ${bx} ${hy - 2.4} Z`, t(mix(CROW.beak, '#ffffff', .16)));
    fp(`M${bx} ${hy + 1.2} C${bx + 4} ${hy + 1.2 + open} ${bx + 8} ${hy + 1.4 + open * 1.4} ${bx + 10.4} ${hy + 1.6 + open * 1.8} C${bx + 6} ${hy + 3.2 + open} ${bx + 2} ${hy + 3} ${bx} ${hy + 2.6} Z`, t(CROW.beak));
    if (open > .5) fp(`M${bx + .4} ${hy + .6} L${bx + 8} ${hy + .8 + open * .6} L${bx + .4} ${hy + 1.4} Z`, t(MOUTH));
  }
  function crow(time, t, o = {}) {
    const pose = o.pose || 'stand', seed = o.seed || 0;
    ctx.save(); ctx.translate(o.x || 0, o.y || 0); ctx.scale((o.flip ? -1 : 1) * (o.s || 1), o.s || 1);
    if (pose === 'peck') { ctx.translate(0, -2); ctx.rotate(.5 + Math.abs(Math.sin(time * 4 + seed)) * .2); ctx.translate(0, 2); }
    const f = pose === 'lunge' ? .6 + Math.sin(time * 9 + seed) * .4 : pose === 'fly' ? Math.sin(time * 9 + seed) : 0;
    const winged = pose === 'lunge' || pose === 'fly';
    if (winged) at(6, -24, -.1, [1, .2 + .8 * f], () => fp(CROW_OPEN, t(shade(CROW.black))));
    if (!winged) [[1, 0], [5, .8]].forEach(([x, dx]) => { L(x, -7.4, x + dx, 0, t(CROW.beak), 1.2); L(x + dx - 1.4, 0, x + dx + 2.6, 0, t(CROW.beak), .8); });
    at(0, 0, winged ? .08 : Math.sin(time * 1.3 + seed) * .03, null, () => fp(CROW_TAIL, t(CROW.black)));
    fp(CROW_BODY, t(CROW.black));
    if (winged) at(3, -22, 0, [1, .2 + .8 * f], () => { fp(CROW_OPEN, t(CROW.black)); inPath(CROW_OPEN, () => fp('M4 4 C0 -6 -6 -14 -12 -19 C-9 -10 -6 -3 -6 4 Z', t(CROW.sheen))); });
    else { fp(CROW_WING, t(CROW.sheen)); inPath(CROW_WING, () => fp('M-18 -11 C-8 -14 2 -15 11 -17 L11 -10 L-18 -8 Z', t(CROW.black))); }
    const breathe = Math.sin(time * 1.6 + seed) * .3;
    crowHead(time + seed, t, pose === 'lunge' ? 2.4 + Math.abs(Math.sin(time * 6)) * 1.6 : 0, 11, -28 + breathe);
    ctx.restore();
  }

  /* ── 나뭇가지 둥지: 지붕까지 덮인 공 모양, 삐져나온 가지 끝, 옆구리 입구 ── */
  function twigNest(t, cx, cy, r, seed, o = {}) {
    const p = planes(t, TWIG), rx = r, ry = r * .82;
    /** 공 안쪽에서 바깥으로 비스듬히 삐져나온 가지 한 올 (방향이 제각각이라 고슴도치처럼 보이지 않는다) */
    const stick = (k, c, wk) => {
      const a = Math.PI * (.95 + hash(k, seed) * 1.1), tilt = (hash(k, seed + 1) - .5) * 1.4, len = r * (.35 + hash(k, seed + 2) * .5);
      const bx = cx + Math.cos(a) * rx * .55, by = cy + Math.sin(a) * ry * .55, d = a + tilt;
      const tx = cx + Math.cos(a) * rx * .9 + Math.cos(d) * len, ty = cy + Math.sin(a) * ry * .9 + Math.sin(d) * len;
      limb(bx, by, (bx + tx) / 2 + (hash(k, seed + 4) - .5) * r * .2, (by + ty) / 2, tx, ty, r * .08 * wk, r * .03 * wk, c);
    };
    for (let k = 0; k < 12; k++) stick(k, k % 3 ? p.mid : p.dark, 1);
    if (o.hangers) [[-.55, -.45, -.3], [.35, -.62, .4]].forEach(([u, v, a]) => at(cx + u * r, cy + v * r, a, null, () => {   // 엮어 넣은 철사 옷걸이
      ctx.strokeStyle = t('#c3c0cf'); ctx.lineWidth = r * .045; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      ctx.moveTo(-r * .5, r * .22); ctx.lineTo(0, -r * .22); ctx.lineTo(r * .5, r * .22);
      ctx.moveTo(0, -r * .22); ctx.quadraticCurveTo(0, -r * .48, r * .14, -r * .46); ctx.stroke();
    }));
    const lump = (k) => 1 + (hash(k, seed + 9) - .5) * .16;                                                     // 울퉁불퉁한 공
    const ball = [[cx - rx * lump(0), cy], [cx - rx, cy - ry * .7 * lump(1), cx - rx * .5, cy - ry * lump(2), cx, cy - ry * lump(3)],
      [cx + rx * .6, cy - ry * lump(4), cx + rx, cy - ry * .6, cx + rx * lump(5), cy], [cx + rx, cy + ry * .7, cx + rx * .4, cy + ry, cx, cy + ry * lump(6)],
      [cx - rx * .5, cy + ry, cx - rx, cy + ry * .6, cx - rx * lump(0), cy]];
    outline(ball); ctx.fillStyle = p.mid; ctx.fill();
    inside(ball, () => {
      E(cx + rx * .5, cy + ry * .45, rx * .95, ry * .8, p.dark);
      E(cx - rx * .45, cy - ry * .55, rx * .7, ry * .42, p.lit);
    });
    if (o.door !== false) E(cx + rx * .4, cy + ry * .02, rx * .24, ry * .3, p.deep);                            // 옆구리 입구
    [[-.7, -.1, .2, -.5], [-.3, .5, .75, .2]].forEach(([a, b, c, d], i) => limb(cx + a * rx, cy + b * ry, cx + (a + c) / 2 * rx, cy + ((b + d) / 2 - .12) * ry, cx + c * rx, cy + d * ry, r * .07, r * .04, i ? p.dark : p.lit));   // 앞에 걸친 가지 두 올
  }

  /* ── 전봇대 꼭대기: 원점은 땅에서 POLE_Y 위. 기둥은 땅(+POLE_Y)까지, 완목·애자·전깃줄 ── */
  function poleTop(time, t, o = {}) {
    const c = planes(t, CONCRETE), st = planes(t, STEEL);
    const body = [[-12, POLE_Y], [-8.6, -150], [8.6, -150], [12, POLE_Y]];
    outline(body); ctx.fillStyle = c.mid; ctx.fill();
    inside(body, () => { R(-14, -152, 7, POLE_Y + 154, c.lit); R(4, -152, 10, POLE_Y + 154, c.dark); });
    E(0, -150, 8.6, 2.4, c.lit);
    ctx.strokeStyle = t(WIRE); ctx.lineWidth = 1.1;                                                            // 전깃줄: 화면 밖까지 처지며 이어진다
    [-62, 38, 70].forEach((x, i) => {
      const y = -112 - (i === 1 ? 2 : 0);
      ctx.beginPath(); ctx.moveTo(x - 1100, y + 14); ctx.quadraticCurveTo(x - 550, y + 40, x, y); ctx.quadraticCurveTo(x + 550, y + 40, x + 1100, y + 14); ctx.stroke();
    });
    curvy([[-80, -100], [-82, -104], [82, -104], [80, -100]], st.lit);                                         // 완목: 윗면 볕, 앞면
    RR(-80, -100, 160, 6, 1.5, st.mid); R(-80, -96, 160, 2, st.dark);
    limb(-50, -94, -30, -78, -10, -60, 2.4, 2.4, st.dark); limb(50, -94, 30, -78, 10, -60, 2.4, 2.4, st.dark);   // 받침대
    const ins = planes(t, PORCELAIN);
    [-62, 38, 70].forEach((x) => {                                                                              // 애자: 주름진 사기 종
      const bell = [[x - 2, -104], [x - 6, -105, x - 5.6, -108.6], [x - 4, -109], [x - 5, -110.6, x - 4, -112], [x + 4, -112], [x + 5, -110.6, x + 4, -109], [x + 5.6, -108.6, x + 6, -105, x + 2, -104]];
      outline(bell); ctx.fillStyle = ins.mid; ctx.fill(); inside(bell, () => R(x + 1.4, -114, 6, 12, ins.dark));
    });
    if (o.spark) {
      const k = (Math.sin(time * 31) + Math.sin(time * 17)) > .2 ? 1 : .55;
      faded(.9, () => {
        ctx.save(); ctx.translate(30, -112); ctx.rotate(time * 3);
        ctx.fillStyle = t('#fff3b0'); ctx.beginPath();
        for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, rr = (i % 2 ? 5 : 22) * k; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        ctx.closePath(); ctx.fill(); ctx.restore();
        E(30, -112, 6 * k, 6 * k, t('#ffffff'));
      });
      faded(.45, () => [0, 1, 2].forEach((i) => { const ph = (time * .5 + i / 3) % 1; E(26 + ph * 6, -122 - ph * 30, 5 + ph * 8, 4 + ph * 6, t('#8d8a9c')); }));
    }
  }

  /* ── 사람: 노란 고소작업차 바구니에 탄 한전 작업자 (최소한으로) ── */
  function bucketWorker(time, t, x, y) {
    const reach = Math.sin(time * 1.4) * .06;
    E(x, y - 30, 8.6, 9, t(SKIN));                                                                             // 얼굴
    fp(`M${x - 10} ${y - 31} C${x - 10} ${y - 44} ${x + 10} ${y - 44} ${x + 10} ${y - 31} Z`, t('#f4f1ea'));     // 안전모
    R(x - 11, y - 32, 22, 2.4, t('#d9d6e0'));
    cuteEye(x + 4, y - 27, 1, 1.3, time, t); blush(x + 5, y - 23, 1.8, 1);
    fp(`M${x - 13} ${y} C${x - 14} ${y - 12} ${x - 8} ${y - 20} ${x} ${y - 20} C${x + 8} ${y - 20} ${x + 13} ${y - 12} ${x + 12} ${y} Z`, t('#4a5d7a'));
    ctx.strokeStyle = t('#4a5d7a'); ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(x - 6, y - 14); ctx.quadraticCurveTo(x - 18, y - 16, x - 26, y - 22); ctx.stroke();
    const [gx, gy] = artHandOnArm(t, x - 26, y - 22, Math.PI + .5 + reach, 12, { pose: 'grip', coat: '#f2f0ea' });
    limb(gx + 2, gy + 1, gx - 20, gy - 6, gx - 44, gy - 14, 1.8, 1.4, t('#e6765f'));                          // 둥지 떼는 장대
  }

  /* ── 사물: 담장, 음식물 통, 감나무, 은행나무, 유리창 ── */
  function wallBlock(t, x0, x1, h) {
    const p = planes(t, '#b8b3c2');
    curvy([[x0, 0], [x1, 0], [x1 + 1, -h * .5, x1, -h], [x0, -h], [x0 - 1, -h * .5, x0, 0]], p.mid);
    curvy([[x1, 0], [x1 + 8, -5], [x1 + 8, -h - 5], [x1, -h]], p.dark);
    curvy([[x0 - 3, -h], [x1 + 3, -h], [x1 + 10, -h - 6], [x0 + 4, -h - 6]], p.lit);                          // 갓돌 윗면
    curvy([[x0 - 3, -h], [x1 + 3, -h], [x1 + 3, -h + 4], [x0 - 3, -h + 4]], p.mid);
  }

  /** 잎 진 나무: 줄기 하나에서 굵은 가지 다섯, 가지마다 잔가지 둘. 가지 끝 자리(tips)를 돌려준다 */
  function bareTree(t, c, top, spread, seed) {
    const trunkTop = top * .5, list = [[0, 0, -3, -trunkTop * .5, 2, -trunkTop, 24, 14]], tips = [], perches = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI * (.86 - i * .18) + (hash(i, seed) - .5) * .2, len = (top - trunkTop) * (.75 + hash(i, seed + 1) * .3) * (i === 2 ? 1.1 : 1);
      const x0 = 2 + (i - 2) * 2, y0 = -trunkTop + 6 - Math.abs(i - 2) * 8, kx = spread / (top - trunkTop);
      const x1 = x0 + Math.cos(a) * len * kx, y1 = y0 + Math.sin(a) * len, mx = x0 + (x1 - x0) * .5 - Math.sin(a) * 6, my = y0 + (y1 - y0) * .5;
      list.push([x0, y0, mx, my, x1, y1, 12 - Math.abs(i - 2) * 1.5, 2.6]);
      const u = .72, pu = 1 - u;                                                                                  // 가지 위 앉을 자리 (2차 곡선 위의 점, 가지 윗면)
      perches.push([pu * pu * x0 + 2 * pu * u * mx + u * u * x1, pu * pu * y0 + 2 * pu * u * my + u * u * y1 - 2]);
      [-.55, .5].forEach((d, j) => {
        const bx = x0 + (x1 - x0) * .6, by = y0 + (y1 - y0) * .6, b = a + d, l = len * (.32 + hash(i * 2 + j, seed + 2) * .14);
        const ex = bx + Math.cos(b) * l * kx, ey = by + Math.sin(b) * l;
        list.push([bx, by, (bx + ex) / 2, (by + ey) / 2 - 3, ex, ey, 3.6, 1.2]);
        tips.push([ex, ey]);
      });
      tips.push([x1, y1]);
    }
    limbs(t, c, list);
    return { tips, perches };
  }

  /** 알루미늄 틀 통유리 두 장: 구름·빛 반사, 왼쪽 유리 속 까치(나를 따라 한다). cracked면 금이 간다 */
  function glassPane(time, t, x0, y0, w, h, cracked) {
    const fr = planes(t, '#8d8a9c'), half = (w - 12) / 2;
    curvy([[x0, y0 + h], [x0 + w, y0 + h], [x0 + w, y0], [x0, y0]], fr.mid);
    curvy([[x0, y0], [x0 + w, y0], [x0 + w + 6, y0 - 6], [x0 + 6, y0 - 6]], fr.lit); curvy([[x0 + w, y0 + h], [x0 + w + 6, y0 + h - 6], [x0 + w + 6, y0 - 6], [x0 + w, y0]], fr.dark);
    [x0 + 4, x0 + 8 + half].forEach((x) => {
      const gy = y0 + 4, gh = h - 8;
      RR(x, gy, half, gh, 2, t('#a9cfe0'));
      ctx.save(); ctx.beginPath(); ctx.rect(x, gy, half, gh); ctx.clip();
      faded(.55, () => { E(x + half * .3, gy + gh * .28, 30, 10, t('#ffffff')); E(x + half * .65, gy + gh * .2, 20, 7, t('#ffffff')); });
      faded(.3, () => fp(`M${x + 10} ${gy} L${x + 30} ${gy} L${x + 70} ${gy + gh} L${x + 50} ${gy + gh} Z`, t('#ffffff')));
      if (x === x0 + 4) faded(.6, () => magpie(time, t, { x: x + half * .55, y: gy + gh * .5, pose: 'mob', flip: true, seed: 0, s: 1.15 }));
      ctx.restore();
    });
    if (cracked) {
      ctx.strokeStyle = t('#ffffff'); ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath();
      const cx = x0 + 4 + half * .55, cy = y0 + h * .45;
      [0, 1.1, 2.3, 3.4, 4.6, 5.5].forEach((a, i) => { ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (18 + i * 4), cy + Math.sin(a) * (16 + i * 3)); });
      ctx.stroke();
    }
    curvy([[x0 - 6, y0 + h], [x0 + w + 6, y0 + h], [x0 + w + 10, y0 + h - 6], [x0 - 2, y0 + h - 6]], fr.lit);
  }

  const art = {
    /* M1·M2 전봇대 꼭대기 둥지: 완목 위 공 모양 둥지와 머리를 내민 형제들 */
    'magpie:poleNest': { w: 180, h: 160, d: (time, t) => {
      poleTop(time, t);
      twigNest(t, -18, -136, 34, 2, { hangers: true });
      [[-2, -136, 0], [5, -128, 1]].forEach(([x, y, s]) => chick(time, t, x, y, s, 1.1));
    } },
    /* M1 아빠: 꼬리를 쫙 펴고 까마귀를 쫓는다 (둘 다 제자리에서 날갯짓) */
    'magpie:dadMob': { w: 120, h: 70, d: (time, t) => {
      at(0, Math.sin(time * 2) * 2, -.15, null, () => crow(time, t, { x: 34, y: 0, pose: 'fly', s: 1.05 }));
      at(0, Math.sin(time * 2.4 + 1) * 2, .12, null, () => magpie(time, t, { x: -28, y: 6, pose: 'mob', seed: 1, bent: true, flap: .2 + Math.abs(Math.sin(time * 16)) * .8 }));
      call(time, t, '깍깍깍!', -24, -44, 15);
    } },
    /* M2·B1 노란 고소작업차: 트럭에서 꺾여 올라간 팔, 바구니 속 작업자, 둥지로 뻗은 장대 */
    'magpie:bucketTruck': { w: 440, h: 320, d: (time, t) => {
      const y = planes(t, YELLOW), cab = planes(t, '#f4f1ea'), tire = t('#3a3445');
      limb(110, -128, 40, -210, -60, -240, 18, 14, y.dark);                                                    // 아래 팔
      limb(-60, -240, -76, -246, -92, -232, 14, 12, y.dark);
      limb(108, -132, 38, -212, -60, -244, 12, 9, y.mid); limb(108, -136, 40, -214, -58, -248, 4, 3, y.lit);
      E(-60, -242, 9, 9, y.mid); E(-62, -244, 4, 4, y.lit);
      E(110, -128, 16, 14, y.dark); E(108, -131, 11, 10, y.mid);                                               // 회전대
      const bucket = [[-122, -228], [-74, -228], [-70, -262], [-126, -262]];
      bucketWorker(time, t, -96, -258);
      outline(bucket); ctx.fillStyle = y.mid; ctx.fill(); inside(bucket, () => { R(-130, -266, 14, 40, y.lit); R(-84, -266, 16, 40, y.dark); });
      curvy([[-128, -262], [-124, -266], [-70, -266], [-68, -262]], y.lit);
      const bed = [[10, -42], [230, -42], [232, -96], [12, -96]];
      outline(bed); ctx.fillStyle = y.mid; ctx.fill(); inside(bed, () => R(10, -96, 222, 10, y.lit));
      const body = [[226, -40], [228, -150], [270, -170, 330, -170], [358, -164, 368, -130], [372, -90], [372, -40]];
      outline(body); ctx.fillStyle = cab.mid; ctx.fill();
      inside(body, () => { R(220, -175, 160, 22, cab.lit); R(340, -175, 40, 140, cab.dark); R(220, -82, 160, 14, y.mid); });
      curvy([[296, -156], [340, -156], [356, -150, 360, -112], [300, -112]], t('#a9cbd6'));                     // 앞 유리
      faded(.45, () => curvy([[306, -154], [316, -154], [306, -114], [300, -114]], t('#ffffff')));
      curvy([[0, -40], [380, -40], [380, -30], [0, -30]], t('#4a4658'));
      [70, 300].forEach((x) => { E(x, -34, 34, 34, tire); E(x, -34, 15, 15, t('#cfcad8')); E(x + 2, -32, 10, 10, t('#aaa5b8')); });
      faded(.6 + Math.sin(time * 6) * .4, () => E(366, -146, 5, 4, t('#ffb84a')));                              // 경광등
    } },
    /* M3 담장 위 엄마아빠: 꼬리를 세우고 고양이한테 깍깍댄다 */
    'magpie:mobWall': { w: 150, h: 120, d: (time, t) => {
      wallBlock(t, -70, 60, 70);
      magpie(time, t, { x: -34, y: -76, pose: 'mob', seed: 2 });
      magpie(time, t, { x: 22, y: -76, pose: 'mob', seed: 5, bent: true });
      call(time, t, '깍깍깍', -34, -118, 15); call(time + .45, t, '깍깍!', 30, -122, 15);
    } },
    /* M4 화단 흙에 반짝이는 초록 병뚜껑, 낙엽 밑에 숨긴 빵 귀퉁이 */
    'magpie:capGlint': { w: 90, h: 40, d: (time, t) => {
      const soil = planes(t, '#8a6a52'), leaf = planes(t, '#c9a24a');
      curvy([[-44, 0], [-36, -6, -10, -8], [20, -8, 40, -5, 46, 0]], soil.mid);
      curvy([[-40, -1], [-30, -6, -10, -7.4], [6, -7.6, 14, -6], [-20, -4, -40, -1]], soil.lit);
      E(-18, -6, 9, 4, t('#e9c48a')); E(-20, -7, 6, 2, t('#f6ddb0'));                                            // 빵 귀퉁이
      [[-26, -8, -.4, 0], [-12, -9, .3, 1], [-20, -11, .1, 2]].forEach(([x, y, r, i]) => at(x, y, r, null, () => {   // 덮어 둔 낙엽
        const p = i === 1 ? leaf.dark : i === 2 ? leaf.lit : leaf.mid;
        fp('M-9 0 C-6 -5 4 -5 9 0 C4 4 -6 4 -9 0 Z', p);
      }));
      const cap = planes(t, '#4fae74');
      at(22, -8, -.25, [1.6, 1.6], () => {                                                                       // 소주 병뚜껑: 톱니 테두리 한 장 (눈에 띄게 조금 크게)
        fp('M-5 0 L-5.4 -3 L-4 -3.8 L-3 -3 L-2 -3.8 L-1 -3 L0 -3.8 L1 -3 L2 -3.8 L3 -3 L4 -3.8 L5.4 -3 L5 0 Z', cap.mid);
        fp('M-5.4 -3 L-4 -3.8 L-3 -3 L-2 -3.8 L-1 -3 L0 -3.8 L1 -3 L2 -3.8 L3 -3 L4 -3.8 L5.4 -3 L4 -4.6 L-4 -4.6 Z', cap.lit);
        R(2, -3, 3, 3, cap.dark);
      });
      const tw = .6 + Math.abs(Math.sin(time * 2.2)) * .8, tw2 = .5 + Math.abs(Math.sin(time * 2.2 + 1.6)) * .6;   // 반짝임 두 점
      at(24, -20, time * .6, [tw * 1.8, tw * 1.8], () => fp('M0 -9 L1.4 -1.4 L9 0 L1.4 1.4 L0 9 L-1.4 1.4 L-9 0 L-1.4 -1.4 Z', t('#fffbe0')));
      at(34, -12, -time * .5, [tw2, tw2], () => fp('M0 -9 L1.4 -1.4 L9 0 L1.4 1.4 L0 9 L-1.4 1.4 L-9 0 L-1.4 -1.4 Z', t('#ffffff')));
    } },
    /* M4 빵 숨기는 걸 지켜보는 큰부리까마귀 */
    'magpie:bigCrow': { w: 60, h: 40, d: (time, t) => {
      crow(time, t, { pose: 'stand', seed: 1 });
    } },
    /* M5 까치밥: 잎 진 감나무 꼭대기에 남겨 둔 홍시 */
    'magpie:persimmon': { w: 300, h: 420, d: (time, t) => {
      const { tips } = bareTree(t, '#6b5040', 400, 140, 3), fruit = planes(t, PERSIMMON);
      tips.filter((q, i) => i % 2 === 0).forEach(([x, y], i) => {
        const sway = Math.sin(time * 1.3 + i) * .8, fx = x + sway, fy = y + 9;
        E(fx, fy, 8, 7.4, fruit.mid); E(fx + 2.6, fy + 2.6, 5, 3.6, fruit.dark); E(fx - 2.6, fy - 2.4, 3.4, 2.4, fruit.lit);
        fp(`M${fx - 4} ${fy - 6.4} L${fx} ${fy - 8.4} L${fx + 4} ${fy - 6.4} L${fx} ${fy - 5} Z`, t('#5f7d4a'));
      });
      tips.filter((q, i) => i % 5 === 3).forEach(([x, y], i) => at(x, y, i ? .8 : -.6, null, () => fp('M0 0 C3 -5 10 -5 13 0 C10 3 3 3 0 0 Z', t('#c9643a'))));   // 남은 잎 몇 장
    } },
    /* M5·D3 버려진 낚싯줄 뭉치: 찌 하나, 바늘 끝 떡밥 */
    'magpie:lineTangle': { w: 70, h: 24, d: (time, t) => {
      faded(.8, () => {
        ctx.strokeStyle = t('#eef4fa'); ctx.lineWidth = .7;
        [[-6, -6, 14, 5, .2], [2, -7, 11, 6, -.3], [-2, -5, 9, 4, .6]].forEach(([x, y, rx, ry, a]) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, TAU); ctx.stroke(); });
        ctx.beginPath(); ctx.moveTo(10, -4); ctx.quadraticCurveTo(22, -1, 30, -3 + Math.sin(time * 2) * .6); ctx.stroke();
      });
      const fl = planes(t, '#e6453a');                                                                           // 찌: 가운데가 불룩한 방추형
      at(-24, -6, -.3, null, () => {
        fp('M-12 0 C-6 -3.2 4 -3.2 10 0 C4 3.2 -6 3.2 -12 0 Z', t('#f4f1ea'));
        fp('M-12 0 C-9 -2.2 -5 -3 -2 -3 L-2 3 C-5 3 -9 2.2 -12 0 Z', fl.mid); fp('M-12 0 C-9 -2.2 -5 -3 -2 -3 L-2 -1 C-6 -1 -9 -.6 -12 0 Z', fl.lit);
        L(10, 0, 15, 0, t(WIRE), .6);
      });
      const bait = planes(t, '#d9b27c');
      E(32, -4, 3.4, 3, bait.mid); E(31, -5, 1.6, 1.2, bait.lit);
      ctx.strokeStyle = t('#9a95a8'); ctx.lineWidth = .6; ctx.beginPath(); ctx.arc(33.6, -4, 2.4, -1.2, 1.6); ctx.stroke();
    } },
    /* M6 열린 음식물 수거통: 뒤로 젖힌 뚜껑, 넘친 배춧잎 */
    'magpie:foodBin': { w: 90, h: 110, d: (time, t) => {
      const p = planes(t, '#e8a33a');
      const body = [[-26, 0], [26, 0], [30, -50, 34, -90], [-34, -90], [-30, -50, -26, 0]];
      curvy([[34, -90], [40, -94], [36, -4], [26, 0]], p.dark);
      outline(body); ctx.fillStyle = p.mid; ctx.fill();
      inside(body, () => { R(-36, -92, 14, 94, p.lit); R(14, -92, 24, 94, p.dark); });
      curvy([[-38, -90], [38, -90], [44, -96], [-30, -98]], p.deep);                                             // 열린 속
      fp('M-24 -96 C-20 -104 -8 -106 -2 -98 C4 -106 16 -104 22 -96 Z', t('#8fbf6a'));                            // 넘친 배춧잎
      fp('M-24 -96 C-20 -104 -8 -106 -2 -98 L-10 -96 Z', t('#b6d98e'));
      at(10, -98, -.2, null, () => { fp('M0 0 L14 -2 L16 0 L14 2 Z', t('#f4f1ea')); [4, 8, 12].forEach((x) => L(x, -1.6, x - 1, -4, t('#f4f1ea'), .6)); });   // 생선 가시
      at(-36, -98, -.4 + Math.sin(time * 1.2) * .03, null, () => curvy([[0, 0], [-6, -46], [-2, -48], [6, -2]], p.lit));   // 뒤로 젖힌 뚜껑
      E(-30, -6, 6, 6, t('#3a3445')); E(30, -6, 6, 6, t('#3a3445'));
    } },
    /* M6·D7 큰부리까마귀 셋: 쪼는 녀석, 버티는 녀석, 날개를 반쯤 든 녀석 */
    'magpie:crowGang': { w: 170, h: 60, d: (time, t) => {
      crow(time, t, { x: 64, pose: 'stand', seed: 4, s: 1.05 });
      crow(time, t, { x: -62, pose: 'peck', seed: 2 });
      crow(time, t, { x: 6, y: -2, pose: 'lunge', seed: 7, s: .95 });
    } },
    /* M7 겨울 햇볕: 빌라 벽 노란 가스관에 부풀어 졸고 있는 어린 까치들 */
    'magpie:sunWall': { w: 200, h: 120, d: (time, t) => {
      faded(.16, () => { E(-10, -30, 110, 70, t('#fff1b8')); E(-20, -26, 70, 44, t('#fff6d0')); });                // 벽에 든 볕
      const gas = planes(t, '#f2c14e');
      limb(-96, 160, -96, 60, -96, -2, 6, 6, gas.mid);                                                           // 땅에서 올라온 관
      E(-96, -2, 4.6, 4.6, gas.mid);
      curvy([[-96, -5], [92, -5], [92, 1], [-96, 1]], gas.mid); curvy([[-96, -5], [92, -5], [92, -3], [-96, -3]], gas.lit);
      curvy([[-96, -1], [92, -1], [92, 1], [-96, 1]], gas.dark);
      [-50, 40].forEach((x) => { RR(x - 2, -6, 4, 9, 1, t(STEEL)); });                                           // 고정쇠 둘
      const box = planes(t, '#d9d6e0');                                                                          // 가스 계량기
      curvy([[92, -18], [120, -18], [122, 14], [90, 14]], box.mid); curvy([[110, -18], [120, -18], [122, 14], [112, 14]], box.dark);
      E(104, -6, 6, 6, t('#f4f1ea'));
      [[-60, 0], [-22, 1], [16, 2]].forEach(([x, seed]) => magpie(time, t, { x, y: -5, pose: 'puff', sleepy: seed !== 1, seed, s: .95 }));
    } },
    /* M7 꼬리깃 꺾인 아빠: 올해도 같은 전봇대에 가지를 물어 나른다 */
    'magpie:oldDad': { w: 180, h: 160, d: (time, t) => {
      poleTop(time, t);
      const p = planes(t, TWIG);
      [[-40, -104, -10, -112, 20, -106], [-30, -104, 0, -118, 30, -110], [-34, -106, -14, -120, 4, -124]].forEach(([a, b, c, d, e, f], i) => limb(a, b, c, d, e, f, 2.2, 1.2, i ? p.mid : p.dark));   // 쌓기 시작한 가지
      magpie(time, t, { x: -54, y: -104, pose: 'stand', twig: true, bent: true, seed: 3 });
    } },
    /* M8 은행나무 가지에서 길게 한 번, 짧게 두 번 우는 까치 */
    'magpie:mateCall': { w: 220, h: 340, d: (time, t) => {
      const { perches } = bareTree(t, GINKGO, 330, 110, 4), [px, py] = perches[1];
      magpie(time, t, { x: px, y: py, pose: 'call', seed: 6, flip: true });
      const ph = (time * .45) % 1, show = (k) => faded(ph > k ? Math.min(1, (ph - k) * 6) * (1 - ph) * 1.5 : 0, () => label(k ? '깍깍' : '깍—', px - 30 + (k ? 46 : 0), py - 40, '800 16px sans-serif', t(INK)));
      show(0); show(.3);
    } },
    /* M9 세탁소 뒤에 버려진 철사 옷걸이 더미 */
    'magpie:hangerPile': { w: 100, h: 40, d: (time, t) => {
      ctx.scale(1.3, 1.3);
      const w = planes(t, '#b9b6c6');
      [[-18, -6, -.2, w.dark], [4, -8, .25, w.mid], [-6, -12, -.05, w.lit], [18, -5, .1, w.mid]].forEach(([x, y, r, c]) => at(x, y, r, null, () => {
        ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(-18, 6); ctx.lineTo(0, -6); ctx.lineTo(18, 6); ctx.closePath();
        ctx.moveTo(0, -6); ctx.lineTo(0, -9); ctx.quadraticCurveTo(0, -13, 3, -12.6); ctx.stroke();
      }));
      fp('M-34 0 C-30 -4 -24 -4 -20 0 Z', t('#f4f1ea'));                                                        // 세탁소 비닐 한 조각
    } },
    /* M9 비어 있는 전봇대 꼭대기 (둥지 짓기 좋아 보인다) */
    'magpie:poleTop': { w: 180, h: 160, d: (time, t) => {
      poleTop(time, t);
      magpie(time, t, { x: -40, y: -104, pose: 'stand', seed: 9, flip: true });
      at(-58, -121, .2, null, () => {                                                                            // 짝이 물고 있는 옷걸이
        ctx.strokeStyle = t('#c3c0cf'); ctx.lineWidth = 1.2; ctx.lineJoin = 'round'; ctx.beginPath();
        ctx.moveTo(-14, 10); ctx.lineTo(0, 0); ctx.lineTo(14, 10); ctx.closePath(); ctx.stroke();
      });
    } },
    /* B1 옷걸이로 지은 둥지에서 알을 품는 짝 */
    'magpie:hangerNest': { w: 180, h: 160, d: (time, t) => {
      poleTop(time, t);
      twigNest(t, -18, -136, 34, 7, { hangers: true, door: false });
      at(-6, -132, 0, null, () => { E(0, 0, 9, 9, t(shade(TWIG))); });
      magpie(time, t, { x: -4, y: -118, pose: 'call', seed: 8, s: .8, tail: .6 });
      call(time, t, '깍깍깍', -10, -190, 15);
    } },
    /* B2 해 질 녘 공원 나무에 모인 짝 없는 까치 무리 */
    'magpie:duskFlock': { w: 260, h: 380, d: (time, t) => {
      const { perches } = bareTree(t, '#6b5a6e', 380, 140, 9);
      perches.forEach(([x, y], i) => magpie(time, t, { x, y, pose: i % 2 ? 'stand' : 'call', flip: x > 0, seed: i * 2, s: .85 }));
      call(time, t, '깍깍', -60, -360, 16); call(time + .5, t, '깍', 70, -330, 16);
    } },
    /* M10 은행나무 가지 사이 둥지에서 알을 품는 짝 (머리와 꼬리만 보인다) */
    'magpie:broodNest': { w: 280, h: 420, d: (time, t) => {
      bareTree(t, GINKGO, 420, 130, 11);
      twigNest(t, 2, -226, 38, 11, { door: false });
      const breathe = Math.sin(time * 1.5) * .4;
      at(-26, -238, -.55 + Math.sin(time * 1.4) * .05, null, () => magTail(t, false));                         // 지붕 틈으로 삐져나온 꼬리
      E(17, -229, 11, 12, t(shade(shade(TWIG))));                                                               // 옆구리 입구
      at(18, -230 + breathe, 0, null, () => {
        E(0, 0, 6.2, 6, t(MG.black)); E(2.4, -1.4, 1.55, 1.7, t(EYE_RING)); cuteEye(2.4, -1.4, .95, 1.1, time, t); blush(3, 1.8, 1.3, .7);
        fp('M5 -1.6 L10.6 0 L5 1.6 Z', t(MG.beak));
      });
    } },
    /* M10 아파트 1층 끝 벽: 베란다 통유리에 하늘과 내 모습이 비친다 */
    'magpie:glassWindow': { w: 360, h: 700, d: (time, t) => {
      const wall = planes(t, '#e6dfd2');
      curvy([[-180, 0], [180, 0], [180, -700], [-180, -700]], wall.mid);
      curvy([[150, 0], [180, 0], [180, -700], [150, -700]], wall.dark);
      curvy([[-180, -246], [180, -246], [180, -256], [-180, -256]], wall.lit);                                   // 2층 슬래브 띠
      glassPane(time, t, -120, -226, 230, 214);
    } },
    /* D5 부딪힌 유리: 금 간 자리 */
    'magpie:glassPane': { w: 360, h: 700, d: (time, t) => {
      const wall = planes(t, '#e6dfd2');
      curvy([[-180, 0], [180, 0], [180, -700], [-180, -700]], wall.mid);
      curvy([[150, 0], [180, 0], [180, -700], [150, -700]], wall.dark);
      glassPane(time, t, -120, -330, 230, 214, true);
    } },
    /* M11 은행나무 둥지: 입 벌린 새끼들, 꼬리 세운 짝, 위 가지의 큰부리까마귀 */
    'magpie:chickNest': { w: 300, h: 440, d: (time, t) => {
      const { perches } = bareTree(t, GINKGO, 420, 140, 11);
      twigNest(t, 2, -226, 38, 11);
      [[13, -226, 0], [20, -218, 1], [17, -234, 2]].forEach(([x, y, s]) => chick(time, t, x, y, s, 1.2));
      const [mx, my] = perches[1], [cx, cy] = perches[3];
      magpie(time, t, { x: mx, y: my, pose: 'mob', seed: 4 });
      crow(time, t, { x: cx, y: cy, pose: 'stand', flip: true, seed: 2 });
      call(time, t, '깍깍깍!', mx, my - 48, 16);
    } },
    /* D1·D8 큰부리까마귀: 날개를 펴고 부리를 벌리며 덮친다 */
    'magpie:crowLunge': { w: 80, h: 60, d: (time, t) => {
      at(0, Math.sin(time * 3) * 1.4, -.2, [1.3, 1.3], () => crow(time, t, { pose: 'lunge', seed: 1 }));
    } },
    /* D6 옷걸이 둥지가 전깃줄에 닿아 번쩍 */
    'magpie:sparkPole': { w: 180, h: 160, d: (time, t) => {
      poleTop(time, t, { spark: true });
      twigNest(t, -18, -136, 34, 5, { hangers: true });
    } },
  };

  function hero(time, moving, eye, t) {
    const bob = Math.sin(time * 2.6) * 2.4;
    ctx.save(); ctx.translate(0, -eye + bob); ctx.scale(HERO_SCALE, HERO_SCALE);
    magpie(time, t, { pose: 'fly', flap: Math.sin(time * (moving ? 14 : 8)), seed: 0 });
    ctx.restore();
  }

  return [art, hero];
})());
