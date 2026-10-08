/* 바퀴벌레 장면 전용 그림. 키는 'cockroach:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   바퀴 눈높이는 0.5cm라서 부스러기는 바위, 슬리퍼는 건물, 젤 한 방울은 연못처럼 보인다.
   사물은 곡선 외곽 하나로 오리고, 왼쪽 위에서 오는 빛으로 윗면·왼쪽(밝음)·앞면·오른쪽(그늘) 2~3톤만 나눈다 */

const CR_LIT_TO = '#fffaf0', CR_LIT_AMOUNT = .24;

/** 한 색에서 나온 면 톤: 윗면·왼쪽(lit) · 앞면(mid) · 오른쪽 옆면(dark) · 안쪽 그늘(deep) */
function crPlanes(t, c) {
  return { lit: t(mix(c, CR_LIT_TO, CR_LIT_AMOUNT)), mid: t(c), dark: t(shade(c)), deep: t(shade(shade(c))) };
}

/** curvy 형식의 패스를 칠하지 않고 그리기만 한다 */
function crTrace(pts) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (!i) ctx.moveTo(p[0], p[1]);
    else if (p.length === 2) ctx.lineTo(p[0], p[1]);
    else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
    else ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
  });
  ctx.closePath();
}

/** 외곽(pts) 안쪽에만 draw()가 칠해지게 한다 */
function crWithin(pts, draw) { ctx.save(); crTrace(pts); ctx.clip(); draw(); ctx.restore(); }

/** 실루엣 하나를 앞면 톤으로 오리고, 그 안을 그늘 면(dark)·볕 면(lit)으로 나눈다 */
function crForm(pts, p, dark, lit) {
  curvy(pts, p.mid);
  crWithin(pts, () => { if (dark) curvy(dark, p.dark); if (lit) curvy(lit, p.lit); });
}

/** 짜 놓은 젤 한 방울: 바닥이 퍼진 둥근 봉우리, 끝이 살짝 꺾였다. 왼쪽 위 테두리는 볕, 오른쪽은 그늘 */
function crBead(x, r, h, t, c, lean) {
  const p = crPlanes(t, c), tip = x + lean;
  const pts = [[x - r, 0], [x - r * .95, -h * .72, x - r * .45, -h, tip, -h], [x + r * .5, -h, x + r * .98, -h * .7, x + r, 0], [x, r * .06, x - r, 0]];
  ctx.save(); ctx.globalAlpha = .93;
  curvy(pts, p.lit);
  crWithin(pts, () => {
    ctx.save(); ctx.translate(r * .2, h * .18); curvy(pts, p.mid); ctx.restore();       // 왼쪽 위 테두리만 볕으로 남는다
    ctx.save(); ctx.translate(r * .78, h * .05); curvy(pts, p.dark); ctx.restore();     // 오른쪽으로 돌아가는 그늘
  });
  ctx.restore();
  E(x - r * .42, -h * .66, r * .14, h * .1, t(WHITE));
}

/** 바위만 한 부스러기 하나: 울퉁불퉁한 윗변, 볕 받는 왼쪽 위, 그늘진 오른쪽 */
function crCrumb(x, r, i, t, c) {
  const pts = [];
  for (let k = 0; k <= 6; k++) {
    const a = Math.PI + k / 6 * Math.PI, rr = r * (.78 + hash(i * 7 + k, 13) * .42);
    pts.push([x + Math.cos(a) * rr * 1.15, Math.min(0, Math.sin(a) * rr)]);
  }
  crForm(pts, crPlanes(t, c), [[x + r * .2, .1], [x + r * .4, -r * 2], [x + r * 2, -r * 2], [x + r * 2, .1]],
    [[x - r * 1.6, -r * .45], [x - r * .2, -r * 1.5], [x + r * .2, -r * 2], [x - r * 1.6, -r * 2]]);
}

/** 밥알 하나: 양끝이 갸름한 낟알, 아래쪽 그늘 */
function crGrain(x, y, a, len, t) {
  const p = crPlanes(t, '#fbf7ee'), g = [[-len, 0], [-len * .6, -len * .46, len * .6, -len * .46, len, 0], [len * .6, len * .42, -len * .6, len * .42, -len, 0]];
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  crForm(g, p, [[-len, len * .05], [0, -len * .05, len, len * .05], [len, len], [-len, len]], null);
  E(-len * .3, -len * .18, len * .3, len * .07, t(WHITE));
  ctx.restore();
}

/** 상자 하나: 살짝 부푼 앞면, 오른쪽 옆면(그늘), 윗면(볕). x,y는 앞면 왼쪽 아래 */
function crBox(x, y, w, h, dx, dy, c, t) {
  const p = crPlanes(t, c), bow = w * .025, top = y - h;
  curvy([[x + w, y], [x + w + dx, y - dy], [x + w + dx, top - dy], [x + w, top]], p.dark);
  curvy([[x, top], [x + w, top], [x + w + dx, top - dy], [x + dx, top - dy]], p.lit);
  curvy([[x, y], [x + w / 2, y + bow * .4, x + w, y], [x + w + bow, y - h / 2, x + w, top], [x + w / 2, top - bow * .2, x, top], [x - bow, y - h / 2, x, y]], p.mid);
  return p;
}

/** 상자 테이프 한 줄: 윗면을 가로질러 앞면으로 내려온다 */
function crTape(x, top, tw, dx, dy, down, t) {
  ctx.save(); ctx.globalAlpha = .8;
  curvy([[x, top], [x + tw, top], [x + tw + dx, top - dy], [x + dx, top - dy]], t('#efdcae'));
  curvy([[x, top], [x + tw, top], [x + tw, top + down], [x + tw * .5, top + down * .92], [x, top + down * .96]], t('#c9b28a'));
  ctx.restore();
}

/** 달거나 고소한 냄새가 피어오르는 물결선 */
function crScent(x, y, h, time, t, c) {
  ctx.save(); ctx.strokeStyle = t(c); ctx.lineWidth = h * .06; ctx.lineCap = 'round'; ctx.globalAlpha = .55;
  for (let k = 0; k < 3; k++) {
    const ox = x + (k - 1) * h * .35, ph = time * 2.2 + k * 1.7;
    ctx.beginPath(); ctx.moveTo(ox, y);
    for (let i = 1; i <= 8; i++) { const u = i / 8; ctx.lineTo(ox + Math.sin(ph + u * 6) * h * .12, y - u * h); }
    ctx.stroke();
  }
  ctx.restore();
}

/** 작은 바퀴 한 마리. o: { x, y, k 크기, body 몸색, head 머리색, flip, run 달리는 중 } */
function crBug(time, t, o) {
  const w = o.run ? Math.sin(time * 7 + o.x) * .6 : 0; /* 제자리 발 구르기만: 화면이 흐를 때 뒷걸음질로 보이지 않게 */
  ctx.save(); ctx.translate(o.x, o.y || 0); ctx.scale((o.flip ? -1 : 1) * o.k, o.k);
  ctx.strokeStyle = t(o.leg || '#6b4126'); ctx.lineWidth = .08; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < 3; i++) { const x = -.3 + i * .3, sw = Math.sin(w + i * 2) * .1; ctx.moveTo(x, -.18); ctx.lineTo(x - .08 + sw, 0); }
  ctx.stroke();
  E(0, -.32, .62, .3, t(o.body)); E(.6, -.36, .24, .22, t(o.head));
  E(.68, -.42, .09, .1, WHITE); E(.7, -.41, .05, .06, t(INK));
  blush(.7, -.29, .06, .04);
  ctx.strokeStyle = t(o.leg || '#6b4126'); ctx.lineWidth = .04; ctx.beginPath();
  ctx.moveTo(.72, -.55); ctx.quadraticCurveTo(.95, -1, 1.3, -.85 + Math.sin(time * 4 + o.x) * .08); ctx.stroke();
  ctx.restore();
}

/** 움직이는 연기·거품 알갱이처럼 반복해서 흐르는 0~1 값 */
const crCycle = (time, speed, i, n) => (time * speed + i / n) % 1;

/** 두 톤 뭉게 연기 한 덩이: 아래 오른쪽 그늘 위에 왼쪽 위 볕 */
function crPuff(x, y, r, t) {
  E(x + r * .12, y + r * .1, r, r * .8, t('#d9dfea'));
  E(x - r * .14, y - r * .14, r * .8, r * .62, t('#f4f8ff'));
}

(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})({
  /* R1 방역하는 날: 타일 이음매를 따라 짜 놓은 젤 방울 줄 */
  'cockroach:gelSeam': { w: 9.5, h: 1.9, d: (time, t) => {
    const g = crPlanes(t, '#a89e90');
    R(-4.75, -.1, 9.5, .1, g.dark); R(-4.75, -.13, 9.5, .035, g.lit);
    [-4, -2.4, -.8, .9, 2.6, 4.2].forEach((x, i) => {
      const k = 1 + Math.sin(time * 3 + i) * .04, r = .3 + hash(i, 5) * .12;
      crBead(x, r, .48 * k, t, '#f2b04a', (hash(i, 6) - .3) * r * .5);
      if (i % 2 === 0) crScent(x, -.7, 1.2, time + i, t, '#ffb98a');
    });
  } },
  /* R1: 형들이 나간 벽 틈. 걸레받이 아래 갈라진 구멍, 나간 발자국만 있고 돌아온 발자국은 없다 */
  'cockroach:emptyCrack': { w: 10, h: 3.5, d: (time, t) => {
    const w = crPlanes(t, '#d9cbb5');
    curvy([[1.8, 0], [2.4, -.35], [2.45, -3.45], [1.9, -3.2]], w.dark);
    curvy([[-2.2, 0], [1.8, 0], [1.88, -2.6], [-2.26, -2.6]], w.mid);
    curvy([[-2.4, -2.6], [1.95, -2.6], [2.4, -2.8, 2.15, -3.25], [-2.2, -3.3], [-2.55, -3.05, -2.4, -2.6]], w.lit);   // 걸레받이 둥근 윗턱
    R(-2.26, -2.62, 4.14, .14, w.dark);
    curvy([[-.62, 0], [-.78, -.7], [-.45, -1.2], [-.66, -1.9], [-.22, -2.3], [-.3, -1.6], [.12, -1.2], [-.04, -.6], [.56, 0]], t('#2e2420'));
    curvy([[-.78, -.7], [-.45, -1.2], [-.66, -1.9], [-.86, -1.3]], w.dark);   // 깨진 가장자리 두께
    crCrumb(-1.5, .13, 1, t, '#d9cbb5'); crCrumb(1, .09, 2, t, '#d9cbb5');
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = .55 - i * .07;
      E(-2 - i * .55, -.03, .07, .03, t('#6b4126')); E(-2.25 - i * .55, -.05, .07, .03, t('#6b4126'));
    }
    ctx.globalAlpha = 1;
    E(.02, -1.1 + Math.sin(time * 1.5) * .05, .07, .07, t('#f6f3ec'));
  } },

  /* R2 배달 봉투: 바닥에 주저앉은 비닐 봉투, 묶은 귀, 스테이플로 찍은 영수증, 삐져나온 냅킨 */
  'cockroach:napkinBag': { w: 37, h: 28, d: (time, t) => {
    ctx.save(); ctx.rotate(Math.sin(time * 1.6) * .015);
    const p = crPlanes(t, '#f6f3ec');
    const body = [[-12, 0], [-17, -1, -17.4, -10, -12.4, -15.6], [-9, -19.4, -5, -20.6, -2.4, -21], [2.4, -21], [6, -20.4, 10, -19, 12.6, -15.6], [17, -10, 16.4, -1, 12, 0], [0, .7, -12, 0]];
    crForm(body, p, [[5, 1], [9.6, -5, 9.4, -13, 3.4, -21.6], [20, -22], [20, 1]],
      [[-17.6, -5], [-16.6, -12, -12, -17.6, -3, -21.4], [-3.6, -19.6], [-10.4, -16.4, -13.4, -11, -14, -4]]);
    const knot = [[-2.6, -20.6], [-3.4, -23], [-8.4, -26.6, -6.6, -28.4, -4.2, -27.6], [-1.8, -26.4, -.4, -24.4, 0, -23.4], [1.4, -25.6, 4.6, -28.2, 6.6, -27.4], [7.8, -25.6, 3.4, -23, 2.6, -20.6]];
    crForm(knot, p, [[0, -23.2], [1.4, -25.6, 4.6, -28.6, 7, -27.8], [8, -20], [0, -20]], null);
    curvy([[-2.6, -20.6], [0, -22.4, 2.6, -20.6], [0, -19.8, -2.6, -20.6]], p.dark);
    const rc = crPlanes(t, '#fffaf0');
    curvy([[3, -16], [8, -16], [8.2, -11, 8.6, -9.4], [7.4, -8.6, 5.6, -9.2], [3.2, -9], [3.1, -12.5, 3, -16]], rc.mid);
    curvy([[8.6, -9.4], [7.4, -8.6, 5.6, -9.2], [7.2, -10.2, 8.6, -9.4]], rc.dark);              // 말려 올라간 귀퉁이
    [-14.4, -13].forEach((y) => L(3.8, y, 7.2, y, t('#c9c4cc'), .2));
    RR(4.6, -16.3, 1.6, .36, .15, t('#9a95a8'));
    [[-.55, '#fffaf0'], [-.3, '#f4efe6'], [-.08, '#fbfaf6']].forEach(([a, c], i) => {
      const n = crPlanes(t, c);
      ctx.save(); ctx.translate(-11 + i * 1.2, -2.2 - i * .6); ctx.rotate(a);
      curvy([[-7.4, -2.2], [-.2, -2.5], [.6, -2.3, .8, -1.2], [.6, 0], [-7.4, 0], [-7.8, -1.1, -7.4, -2.2]], n.mid);
      curvy([[-7.4, -2.2], [-.2, -2.5], [.5, -2.3, .7, -1.7], [-7.6, -1.6]], n.lit);
      curvy([[.2, -2.4], [.9, -1.3, .6, 0], [.1, 0], [.35, -1.2, .2, -2.4]], n.dark);
      L(-6.6, -1, -.4, -1, t('#ff9aa8'), .15);
      ctx.restore();
    });
    E(-13.6, -1.6, .9, .5, t('#4a3a30'));
    ctx.restore();
  } },
  /* R2: 포장대 밑에 새로 생긴 종이집(바퀴 끈끈이 트랩). 접은 판지 집, 옆창엔 붙어 버린 애들이 보인다 */
  'cockroach:roachHouse': { w: 11.5, h: 7.5, d: (time, t) => {
    const wall = crPlanes(t, '#f6efe0'), roof = crPlanes(t, '#e6765f'), brick = crPlanes(t, '#c99a6e');
    curvy([[-5.6, 0], [5.6, -.1], [5.9, -.4], [-5.4, -.32]], t('#d9c39b'));
    curvy([[.6, -.3], [5.2, -.6], [5.2, -4.5], [.6, -4.1]], wall.dark);                          // 옆벽 (그늘)
    curvy([[-5, -.3], [.6, -.3], [.6, -4.1], [-2.2, -6.6], [-5, -4.1]], wall.mid);               // 앞 박공벽
    curvy([[2.1, -6.1], [3, -6.2], [3, -7.7], [2.1, -7.6]], brick.mid);                          // 굴뚝
    curvy([[3, -6.2], [3.4, -6.4], [3.4, -7.9], [3, -7.7]], brick.dark);
    curvy([[2.1, -7.6], [3, -7.7], [3.4, -7.9], [2.5, -7.8]], brick.lit);
    curvy([[-2.2, -6.6], [2.8, -7.2], [5.9, -4.4], [.9, -3.8]], roof.mid);                       // 지붕 긴 면
    curvy([[-5.7, -3.8], [-2.2, -7.15], [1, -3.8], [.35, -3.8], [-2.2, -6.3], [-5.05, -3.8]], roof.lit);   // 접힌 처마 끝
    curvy([[.9, -3.8], [5.9, -4.4], [5.9, -4.1], [1, -3.55]], roof.dark);
    curvy([[-3.1, -.3], [-3.1, -1.8], [-3.1, -2.75, -1.3, -2.75, -1.3, -1.8], [-1.3, -.3]], t('#4a3a30'));   // 둥근 문
    ctx.globalAlpha = .7; R(-3.1, -.5, 1.8, .2, t('#f5d76e')); ctx.globalAlpha = 1;
    [[1.3, -1.95], [3.4, -2.1]].forEach(([x, y], i) => {
      curvy([[x, y], [x + 1.2, y - .1], [x + 1.2, y - 1.2], [x, y - 1.1]], t('#4a3a30'));
      crBug(time + i, t, { x: x + .6, y: y - .05, k: .55, body: '#8e5530', head: '#b5733f', flip: i === 1 });
    });
    crScent(-2.2, -2.8, 1.6, time, t, '#f7c27a');
  } },

  /* R3 현관: 바퀴에겐 빌딩만 한 운동화. 앞코가 들린 밑창, 끈 구멍과 밑창 홈이 계단 같다 */
  'cockroach:sneaker': { w: 32, h: 11.5, d: (time, t) => {
    const up = crPlanes(t, '#5f8fb0'), wh = crPlanes(t, '#f4f1ea'), gum = crPlanes(t, '#a29fb2');
    ctx.globalAlpha = .2; E(0, -.05, 13.4, .45, t(INK)); ctx.globalAlpha = 1;
    const sole = [[-12.8, 0], [9, 0], [12, -.2, 13.6, -1.2], [14.1, -2], [-13.5, -1.7], [-13.7, -.7, -12.8, 0]];
    crForm(sole, gum, [[-14, -.6], [14.5, -.6], [14.5, .2], [-14, .2]], null);
    for (let x = -11.6; x < 9; x += 2.1) RR(x, -.32, 1.1, .34, .14, gum.deep);
    const ms = [[-13.5, -1.6], [14.1, -1.9], [14.7, -2.8, 13.7, -3.7], [-13, -3.4], [-13.9, -2.6, -13.5, -1.6]];
    crForm(ms, wh, [[-14, -1.5], [14.7, -1.8], [14.7, -2.25], [-14, -2.05]], [[-14, -3.7], [14, -4], [14, -3.25], [-14, -2.95]]);
    const U = [[-13, -3.3], [-13.7, -7.2, -12.7, -10.3, -10.2, -10.5], [-8.4, -10.6, -7, -10, -6.2, -9.3], [-4.6, -10.9, -2.6, -11.2, -1.8, -10.4],
      [-.8, -9.2, .4, -8], [6.6, -7.2, 12.2, -5.6, 13.7, -3.5]];
    curvy(U, up.lit);
    crWithin(U, () => {
      ctx.save(); ctx.translate(.5, .75); curvy(U, up.mid); ctx.restore();                         // 윗면만 밝게 남는다
      curvy([[-14, -3.2], [0, -3.3, 14, -3.4], [14, -4.3], [0, -4.4, -14, -4.2]], up.dark);       // 발등 아래로 돌아가는 그늘
    });
    curvy([[-10.6, -10.1], [-8.8, -10.6, -7, -10.1, -6.3, -9.25], [-8, -9.5, -9.6, -9.6, -10.6, -10.1]], up.deep);   // 발 넣는 구멍
    curvy([[-6.2, -9.3], [-4.6, -10.9, -2.6, -11.2, -1.8, -10.4], [-1.2, -9.7, -.8, -9.2], [-3, -9.4, -5, -9.1]], up.lit);   // 혀
    ctx.fillStyle = t('#3b5f80'); ctx.beginPath(); ctx.moveTo(-10.6, -4.3); ctx.quadraticCurveTo(-4, -7.4, 4.6, -5.2); ctx.lineTo(4.2, -4.3); ctx.closePath(); ctx.fill();
    crForm([[7, -3.4], [8.6, -6.3, 12, -5.7, 13.7, -3.5]], wh, [[11.6, -3], [12.4, -4.6, 12.6, -5.4], [14.2, -5.4], [14.2, -3]], null);   // 고무 앞코
    curvy([[-13.4, -6.4], [-13.8, -9, -12.8, -10.6, -11, -10.7], [-11.5, -9.6, -12.2, -8, -12.2, -6.4]], t('#e6765f'));   // 뒤꿈치 고리
    [-4.6, -2.6, -.6].forEach((x, i) => {
      E(x, -8.1 + i * .22, .32, .26, t('#2f3a4f'));
      L(x, -8.1 + i * .22, x + 1.8, -9.4 + i * .3, t('#fffaf0'), .38);
    });
    E(-14.2, -.25, .5, .25, t('#d9c39b')); E(-15.1, -.2, .35, .2, t('#cdb48a'));
  } },
  /* R3: 신발장 밑 1cm 틈. 문짝과 옆판, 다리 사이 어둠 속 먼지 뭉치와 모래알 */
  'cockroach:cabinetGap': { w: 14.5, h: 22.5, d: (time, t) => {
    const wood = crPlanes(t, '#c99a6e'), steel = crPlanes(t, '#e9e4ec'), dust = crPlanes(t, '#b8b2bd');
    R(-7, -1.25, 14.2, 1.25, t('#2f2a3a'));
    curvy([[5.4, -1.2], [7.2, -2.1], [7.2, -22.5], [5.4, -22.5]], wood.dark);
    curvy([[-7, -1.2], [5.4, -1.2], [5.5, -22.5], [-7, -22.5]], wood.mid);
    R(-7, -1.6, 12.4, .4, wood.dark);                                                             // 문짝 아래 모서리
    curvy([[-5.6, -3.4], [3.9, -3.4], [3.4, -3.9], [-5.1, -3.9]], wood.lit);                        // 들어간 판: 아래 턱은 볕
    curvy([[-5.6, -3.4], [-5.1, -3.9], [-5.1, -22.5], [-5.6, -22.5]], wood.dark);                   // 왼쪽 턱은 그늘
    curvy([[4.4, -12.2], [5, -12.2], [5, -8.8], [4.4, -8.8]], steel.mid); R(4.4, -12.2, .2, 3.4, steel.lit);
    [[-6.9, -5.7], [5.5, 7.1]].forEach(([a, b]) => curvy([[a, -1.25], [b, -1.25], [b - .2, 0], [a + .3, 0]], wood.deep));   // 다리
    [[-3.6, .45], [-.4, .35], [2.6, .5]].forEach(([x, r], i) => {
      const b = Math.sin(time * 1.2 + i) * .03;
      [[-.3, 0], [.25, -.1], [0, -.3], [.35, .1]].forEach(([dx, dy]) => E(x + dx * r * 2, -r + dy * r + b, r * .7, r * .6, dust.dark));
      [[-.35, -.1], [.05, -.38]].forEach(([dx, dy]) => E(x + dx * r * 2, -r + dy * r + b - r * .1, r * .55, r * .45, dust.lit));
    });
    [-5.2, -4.8, 1.1, 4.6].forEach((x) => E(x, -.08, .1, .08, t('#d9c39b')));
  } },

  /* R4 불 꺼진 부엌: 냉장고 뒤 웅웅대는 둥근 압축기와 뱀처럼 이어진 방열 코일. 따뜻하다 */
  'cockroach:motorGrille': { w: 37, h: 27, d: (time, t) => {
    const glow = .3 + Math.sin(time * 2) * .06, rail = crPlanes(t, '#6b6478'), coil = crPlanes(t, '#3a3445'), cu = crPlanes(t, '#c98a5a'), cm = crPlanes(t, '#4a4258');
    ctx.globalAlpha = glow; E(6, -1, 12, 1.2, t('#ffb36b')); E(6, -5, 8, 6, t('#ffcf8a')); ctx.globalAlpha = 1;
    [-14, 13].forEach((x) => { RR(x, -26, 1.2, 24, .5, rail.mid); RR(x, -26, .4, 24, .2, rail.lit); });
    for (let x = -11; x <= 11; x += 2.8) L(x, -24.6, x, -5.6, t('#8d8a9c'), .15);
    const tube = () => {
      ctx.beginPath(); ctx.moveTo(-13, -24);
      for (let k = 0; k < 8; k++) {
        const y0 = -24 + k * 2.2, y1 = y0 + 2.2, right = k % 2 === 0;
        ctx.lineTo(right ? 11.4 : -11.4, y0); ctx.arc(right ? 11.4 : -11.4, (y0 + y1) / 2, 1.1, -Math.PI / 2, Math.PI / 2, !right);
      }
      ctx.lineTo(-13, -6.4);
    };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [[.14, .18, coil.deep, .8], [0, 0, coil.mid, .7], [-.1, -.14, coil.lit, .22]].forEach(([dx, dy, c, w]) => {
      ctx.save(); ctx.translate(dx, dy); tube(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.stroke(); ctx.restore();
    });
    curvy([[1.4, 0], [12.6, 0], [12.2, -.55], [1.8, -.55]], rail.dark);
    const C = [[2.4, -.5], [2.2, -2.8, 2.6, -4.8, 4.2, -5.8], [5.6, -6.7, 8.4, -6.7, 9.8, -5.8], [11.4, -4.8, 11.8, -2.8, 11.6, -.5]];
    crForm(C, cm, [[8.6, .2], [9.8, -2.4, 9.8, -5, 8.4, -7], [12.5, -7], [12.5, .2]],
      [[1.8, -3], [2.4, -5.4, 4.6, -6.9, 7, -6.9], [5.2, -6.1, 3.7, -5, 3.3, -2.6]]);
    ctx.strokeStyle = cu.mid; ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(5.2, -6.3); ctx.quadraticCurveTo(4.6, -8.6, 2.4, -9); ctx.lineTo(-1, -9); ctx.stroke();
    ctx.strokeStyle = cu.lit; ctx.lineWidth = .15; ctx.beginPath(); ctx.moveTo(5.05, -6.4); ctx.quadraticCurveTo(4.5, -8.6, 2.4, -9.15); ctx.lineTo(-1, -9.15); ctx.stroke();
    crForm([[-1, -.55], [2.4, -.55], [2.4, -2.4], [-1, -2.4]], rail, [[1.9, 0], [1.9, -3], [3, -3], [3, 0]], [[-1.2, -2.4], [2.6, -2.4], [2.6, -2.1], [-1.2, -2.1]]);
    [-.15, .15].forEach((d, i) => {
      ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = t('#ffd56b'); ctx.lineWidth = .18; ctx.beginPath();
      ctx.arc(7, -3.4, 5.6 + i * 1.1 + Math.sin(time * 12 + i) * .15, -1.2 + d, -.5 + d); ctx.stroke(); ctx.restore();
    });
    crScent(-4, -6, 3, time, t, '#ffb27a');
    [-10, -6.4, -2.2].forEach((x, i) => crCrumb(x, .22 + hash(i, 8) * .16, i + 3, t, '#e0b47a'));
  } },
  /* R4: 싱크대 거름망에서 떨어지는 물방울과 젖은 밥알 */
  'cockroach:sinkDrip': { w: 6, h: 14, d: (time, t) => {
    const u = crCycle(time, .7, 0, 1), y = -14 + u * u * 14;
    E(0, y, .22, .32, t('#bfe3f5')); E(-.07, y - .1, .06, .08, t(WHITE));
    ctx.globalAlpha = .6; E(0, -.04, 1.6 + (u > .9 ? .4 : 0), .14, t('#9fd0ff')); ctx.globalAlpha = 1;
    crGrain(1.3, -.2, .15, .4, t); crGrain(-1.4, -.18, -.25, .36, t);
    const sc = crPlanes(t, '#7fb08a');
    curvy([[1.9, -.02], [2.9, -.08], [2.95, -.24], [1.95, -.2]], sc.mid); R(1.9, -.22, 1, .06, sc.lit);
    crScent(1.4, -.6, 2.4, time, t, '#b8c77a');
  } },

  /* R5 하얀 동그란 통: 가운데가 볼록 솟은 먹이형 살충제 통, 옆 띠에 아치형 입구 */
  'cockroach:baitDisc': { w: 6, h: 3.5, d: (time, t) => {
    const p = crPlanes(t, '#ece8e1');
    ctx.globalAlpha = .25; E(0, -.03, 2.8, .12, t(INK)); ctx.globalAlpha = 1;
    crForm([[-2.75, -.05], [-2.55, -1.2], [2.55, -1.2], [2.75, -.05], [0, .22, -2.75, -.05]], p, [[1.4, .3], [1.6, -1.3], [3, -1.3], [3, .3]], null);
    E(0, -1.2, 2.55, .42, p.lit);
    const dome = [[-1.15, -1.22], [-1.05, -1.95, 1.05, -1.95, 1.15, -1.22], [0, -1.02, -1.15, -1.22]];
    crForm(dome, p, [[.35, -.9], [.55, -1.5, .5, -1.8], [1.4, -2], [1.4, -.9]], null);
    [[-2.05, .38], [-.85, .5], [.35, .5], [1.5, .4]].forEach(([x, w]) => curvy([[x, -.2], [x, -.78, x + w, -.78, x + w, -.2]], t('#3b3049')));
    E(-.6, -.32, .12, .08, t('#f2b04a'));
    crScent(-.6, -1.9, 1.5, time, t, '#ffb98a');
  } },
  /* R5: 어제 저걸 먹고 뒤집혀 버린 친구. 배 마디가 드러나고, 마디진 다리만 바르르 */
  'cockroach:flippedFriend': { w: 3.5, h: 1.3, d: (time, t) => {
    ctx.globalAlpha = .25; E(0, -.02, .75, .06, t(INK)); ctx.globalAlpha = 1;
    ctx.strokeStyle = t('#6b4126'); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [[-.32, -.18], [0, .02], [.3, .2]].forEach(([x, lean], i) => {
      const tw = Math.sin(time * 22 + i * 2) * .05;
      ctx.lineWidth = .06; ctx.beginPath(); ctx.moveTo(x, -.48); ctx.lineTo(x + lean - .1 + tw, -.86); ctx.lineTo(x + lean * 1.6 + tw * 1.5, -1.12); ctx.stroke();
      ctx.lineWidth = .025; ctx.beginPath(); ctx.moveTo(x + lean - .1 + tw, -.86); ctx.lineTo(x + lean - .18 + tw, -.8); ctx.stroke();
    });
    E(0, -.28, .64, .27, t('#8e5530'));
    E(-.04, -.34, .54, .19, t('#c98d58'));
    ctx.strokeStyle = t('#8e5530'); ctx.lineWidth = .025; ctx.beginPath();
    [-.36, -.22, -.08, .06].forEach((x) => { ctx.moveTo(x, -.5); ctx.quadraticCurveTo(x - .04, -.34, x, -.18); });
    ctx.stroke();
    E(.42, -.34, .16, .14, t('#b5733f')); E(.64, -.28, .16, .15, t('#d49a62'));
    L(.58, -.34, .7, -.22, t(INK), .03); L(.7, -.34, .58, -.22, t(INK), .03);
    ctx.strokeStyle = t('#6b4126'); ctx.lineWidth = .025; ctx.beginPath();
    ctx.moveTo(.76, -.2); ctx.quadraticCurveTo(1.1, -.05, 1.45, -.12); ctx.moveTo(.76, -.24); ctx.quadraticCurveTo(1.05, -.5, 1.4, -.46 + Math.sin(time * 3) * .04); ctx.stroke();
    E(-.66, -.24, .1, .06, t('#6b4126'));
    ctx.globalAlpha = .5; E(-.2, -.42, .22, .04, WHITE); ctx.globalAlpha = 1;
  } },

  /* R6 첫 알집: 꽁무니에 달고 다니는 강낭콩 모양 알집. 등줄기 톱니와 칸칸이 든 알, 안에서 꼼지락 */
  'cockroach:eggCase': { w: 1.5, h: 1.1, d: (time, t) => {
    const k = 1 + Math.sin(time * 5) * .025, base = '#8e5a35';
    ctx.globalAlpha = .25; E(0, -.02, .5, .05, t(INK)); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(0, -.3); ctx.scale(k, k);
    const bean = () => { ctx.beginPath(); ctx.moveTo(-.46, -.12); ctx.quadraticCurveTo(-.5, .26, -.2, .28); ctx.lineTo(.22, .28);
      ctx.quadraticCurveTo(.52, .26, .46, -.12); ctx.quadraticCurveTo(0, -.24, -.46, -.12); ctx.closePath(); };
    ctx.save(); ctx.translate(.02, .03); bean(); ctx.fillStyle = t(shade(shade(base))); ctx.fill(); ctx.restore();
    bean(); ctx.fillStyle = t(base); ctx.fill();
    ctx.save(); bean(); ctx.clip(); E(.18, .2, .4, .14, t(shade(base))); ctx.restore();
    ctx.strokeStyle = t('#5f3a22'); ctx.lineWidth = .018; ctx.beginPath();
    for (let x = -.33; x <= .34; x += .095) { ctx.moveTo(x, -.15 + Math.abs(x) * .1); ctx.quadraticCurveTo(x + .015, .08, x - .01, .25); }
    ctx.stroke();
    ctx.fillStyle = t('#b5733f'); ctx.beginPath(); ctx.moveTo(-.42, -.13);
    for (let i = 0; i <= 8; i++) { const x = -.42 + i * .105; ctx.lineTo(x, -.17 - Math.abs(x) * .04 - (i % 2 ? .07 : 0)); }
    ctx.lineTo(.42, -.12); ctx.quadraticCurveTo(0, -.2, -.42, -.13); ctx.fill();
    ctx.globalAlpha = .55; E(-.18, -.06, .14, .035, WHITE); ctx.globalAlpha = 1;
    ctx.restore();
    [[-.7, -.85], [.68, -.7]].forEach(([x, y], i) => {
      const s = .05 + Math.max(0, Math.sin(time * 3 + i * 2)) * .05;
      P([[x, y - s * 2], [x + s * .5, y], [x, y + s * 2], [x - s * .5, y]], WHITE);
    });
  } },
  /* R6: 화장실 바닥 배수구. 둥근 스테인리스 테두리와 거름 뚜껑, 물방울이 떨어지고 틈에서 다리가 삐죽 */
  'cockroach:bathDrain': { w: 12.5, h: 15, d: (time, t) => {
    const m = crPlanes(t, '#c9cfd6');
    ctx.globalAlpha = .4; E(0, -.05, 6, .5, t('#bfe3f5')); ctx.globalAlpha = 1;
    E(0, -.08, 4.6, .9, m.dark);
    E(0, -.26, 4.5, .82, m.mid);
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, -.26, 4.5, .82, 0, 0, TAU); ctx.clip(); E(-.3, -.56, 4.4, .6, m.lit); ctx.restore();   // 테 윗면 볕
    E(0, -.24, 3.6, .58, t('#2f2a3a'));
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, -.24, 3.6, .58, 0, 0, TAU); ctx.clip();
    E(0, -.42, 3.6, .5, m.deep);                                                                 // 안쪽 벽
    for (let x = -3; x <= 3; x += 1) { const hh = .46 * Math.sqrt(1 - (x / 3.6) ** 2); L(x, -.2 - hh, x, -.2 + hh, m.mid, .22); L(x - .07, -.2 - hh, x - .07, -.2 + hh, m.lit, .07); }
    ctx.restore();
    const u = crCycle(time, .55, 0, 1);
    if (u < .8) { const y = -14 + (u / .8) ** 2 * 13.8; E(.8, y, .25, .35, t('#bfe3f5')); E(.72, y - .1, .07, .09, t(WHITE)); }
    else { ctx.save(); ctx.globalAlpha = 1 - (u - .8) * 5; ctx.strokeStyle = t('#dff0ff'); ctx.lineWidth = .1;
      ctx.beginPath(); ctx.ellipse(.8, -.15, 1 + (u - .8) * 10, .2 + (u - .8), 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    const tw = Math.sin(time * 9) * .1;
    L(-2.1, -.2, -2.4 + tw, -1.1, t('#c49a5a'), .06); L(-1.7, -.2, -1.6 - tw, -.95, t('#c49a5a'), .06);
  } },

  /* R7 연막탄: 둥근 어깨의 깡통, 감싼 띠지, 치익 소리와 함께 바닥부터 차오르는 하얀 연기 */
  'cockroach:smokeBomb': { w: 27, h: 18, d: (time, t) => {
    const can = crPlanes(t, '#e6765f'), lab = crPlanes(t, '#ffd56b'), cap = crPlanes(t, '#9aa5aa');
    const bank = [[-11.5, 0], [-12, -1, -10.6, -1.6], [-10, -2.6, -8, -2.4], [-7, -3, -5.4, -2.2], [-4, -2.8, -2.6, -1.8], [2.6, -1.8], [4, -2.9, 5.6, -2.2],
      [7, -3, 8.6, -2.3], [10.4, -2.5, 10.8, -1.4], [12, -.8, 11.5, 0]];
    ctx.save(); ctx.globalAlpha = .7; curvy(bank, t('#f4f8ff'));
    crWithin(bank, () => { ctx.translate(.5, .7); curvy(bank, t('#d9dfea')); }); ctx.restore();   // 바닥에 깔린 연기: 윗자락만 밝게
    const body = [[-2.3, 0], [-2.4, -7.6], [2.4, -7.6], [2.3, 0], [0, .3, -2.3, 0]];
    crForm(body, can, [[1.1, .5], [1.2, -8], [3, -8], [3, .5]], [[-3, .5], [-3, -8], [-1.5, -8], [-1.6, .5]]);
    const band = [[-2.4, -5.6], [0, -5.3, 2.4, -5.6], [2.36, -3.4], [0, -3.1, -2.36, -3.4]];
    crForm(band, lab, [[1.1, -3], [1.2, -6], [3, -6], [3, -3]], [[-3, -3], [-3, -6], [-1.5, -6], [-1.6, -3]]);
    crForm([[-2.4, -7.55], [-2.2, -8.5, 2.2, -8.5, 2.4, -7.55]], cap, [[.9, -7.4], [1, -8.6], [3, -8.6], [3, -7.4]], null);
    E(0, -8.4, 1.5, .26, cap.lit);
    crForm([[-.5, -8.4], [-.5, -9.4], [.5, -9.4], [.5, -8.4]], cap, [[.15, -8.3], [.15, -9.5], [.6, -9.5], [.6, -8.3]], null);
    for (let i = 0; i < 12; i++) {
      const u = crCycle(time, .22, i, 12), r = .8 + u * 3.2;
      ctx.save(); ctx.globalAlpha = .75 * (1 - u * .7);
      crPuff((i % 2 ? -1 : 1) * u * 8 + Math.sin(i * 2.1) * 1.5, -10 - u * 4 - Math.sin(u * 3) * 2, r, t);
      ctx.restore();
    }
    [0, 1, 2].forEach((i) => L(.8 + i * .5, -10 - i * .3, 1.4 + i * .6, -10.8 - i * .5 + Math.sin(time * 30 + i) * .1, t('#c9c4cc'), .08));
  } },
  /* R7: 위로, 밖으로 우르르. 배관을 타고 오르는 애와 내달리는 애 */
  'cockroach:fleeingRoaches': { w: 6.5, h: 16.5, d: (time, t) => {
    const pipe = crPlanes(t, '#b9c3c7'), clamp = crPlanes(t, '#9aa5aa');
    crForm([[1.6, 0], [1.6, -16], [2.9, -16], [2.9, 0]], pipe, [[2.5, .2], [2.5, -16.2], [3, -16.2], [3, .2]], [[1.5, .2], [1.5, -16.2], [1.9, -16.2], [1.9, .2]]);
    crForm([[1.25, -4.5], [3.25, -4.5], [3.3, -5.3], [1.2, -5.3]], clamp, [[2.7, -4.4], [2.7, -5.4], [3.4, -5.4], [3.4, -4.4]], [[1.1, -5.4], [3.4, -5.4], [3.4, -5.15], [1.1, -5.15]]);
    const climb = (time * 1.5) % 6;
    ctx.save(); ctx.translate(1.5, -3 - climb); ctx.rotate(-Math.PI / 2);
    crBug(time, t, { x: 0, y: 0, k: 1, body: '#b5733f', head: '#d49a62', run: true }); ctx.restore();
    crBug(time + .7, t, { x: -1.6, y: 0, k: 1, body: '#a8683a', head: '#d49a62', run: true, flip: true });
    [-.4, -.6].forEach((y, i) => L(-.6 + i * .2, y, .3 + i * .2, y, t('#c9c4cc'), .05));
    E(-1.2, -1, .08, .12, t('#bfe3f5'));
  } },

  /* R8 한겨울 이삿짐: 테이프로 봉한 상자 두 개를 비껴 쌓았고, 열린 문으로 찬바람이 들이친다 */
  'cockroach:movingBoxes': { w: 31, h: 28.5, d: (time, t) => {
    const lo = crBox(-13, 0, 18, 14, 2.6, 1.6, '#d9a96a', t);
    crTape(-5.4, -14, 2.4, 2.6, 1.6, 5, t);
    crBox(-9.4, -14.8, 14, 12.4, 2.2, 1.4, '#e0b47a', t);
    crTape(-3.6, -27.2, 2.4, 2.2, 1.4, 4.6, t);
    [[-10.5, -9], [-8.5, -9]].forEach(([x, y]) => { P([[x, y - 1.4], [x + .7, y - .4], [x - .7, y - .4]], lo.deep); R(x - .2, y - .5, .4, 1.4, lo.deep); });
    for (let i = 0; i < 9; i++) {
      const u = crCycle(time, .18, i, 9), x = 9 + hash(i, 3) * 6 + Math.sin(time * 2 + i) * .8, y = -26 + u * 25;
      ctx.globalAlpha = .8; E(x, y, .25, .25, t('#f4f8ff'));
    }
    ctx.globalAlpha = .3 + Math.sin(time * 2) * .15; [-6, -12].forEach((y, i) => L(15 - i * 2, y, 10 - i * 2, y + .4, t('#dff0ff'), .15)); ctx.globalAlpha = 1;
  } },
  /* R8: 다리를 하나 뜯어 간 상자 테이프. 옆 두께가 보이는 롤, 종이 심 안쪽 벽, 끈끈하게 늘어진 끝자락 */
  'cockroach:tapeRoll': { w: 13.5, h: 5, d: (time, t) => {
    const tp = crPlanes(t, '#e8c27a'), core = crPlanes(t, '#c99a6e');
    ctx.globalAlpha = .2; E(.3, -.05, 2.9, .2, t(INK)); ctx.globalAlpha = 1;
    ctx.globalAlpha = .75; curvy([[-1.5, -.8], [-4, -.1, -6.6, 0], [-6.6, -.06], [-4, -.3, -1.2, -1.4]], tp.mid); ctx.globalAlpha = 1;
    L(-5.4, -.1, -3.6, -.36, tp.lit, .05);
    E(.75, -2.4, 2.2, 2.45, tp.dark); R(0, -4.85, .75, 4.9, tp.dark);                              // 롤 옆 두께
    ctx.save(); ctx.globalAlpha = .92;
    E(0, -2.4, 2.2, 2.45, tp.mid);
    ctx.beginPath(); ctx.ellipse(0, -2.4, 2.2, 2.45, 0, 0, TAU); ctx.clip();
    ctx.strokeStyle = tp.lit; ctx.lineWidth = .5; ctx.beginPath(); ctx.ellipse(-.1, -2.5, 2.05, 2.3, 0, Math.PI * .95, Math.PI * 1.6); ctx.stroke();
    ctx.restore();
    E(0, -2.4, 1.38, 1.52, core.mid);
    E(0, -2.4, 1.12, 1.26, core.dark);                                                            // 심 안쪽 벽
    E(-.32, -2.4, .82, 1.2, t('#3e322c'));
    ctx.strokeStyle = t('#6b4126'); ctx.lineCap = 'round'; ctx.lineWidth = .07; ctx.beginPath();
    ctx.moveTo(-4.3, -.12); ctx.lineTo(-3.9, -.42); ctx.lineTo(-3.5, -.33); ctx.stroke();
    ctx.lineWidth = .025; ctx.beginPath(); [-4.15, -3.95].forEach((x) => { ctx.moveTo(x, -.3); ctx.lineTo(x - .08, -.4); }); ctx.stroke();
  } },
  /* R9 느려진 다리: 냉장고 뒤에서 북적이는 새끼들 (갓 깬 하얀 애, 갈색 애) */
  'cockroach:babyCrowd': { w: 7.5, h: 1.4, d: (time, t) => {
    [[-2.6, .32, 'w', false], [-1.8, .45, 'b', true], [1.6, .3, 'w', true], [2.3, .5, 'b', true], [2.9, .3, 'w', false], [-3.2, .5, 'b', false]]
      .forEach(([x, k, kind, flip], i) => {
        const body = kind === 'w' ? '#f4efe6' : '#c98d58', head = kind === 'w' ? '#fffaf0' : '#e0b07e';
        crBug(time + i * .9, t, { x, k, body, head, flip, leg: kind === 'w' ? '#d9cbb5' : '#6b4126' });
      });
    [-1.2, .9].forEach((x, i) => {
      const s = .1 + Math.sin(time * 2 + i) * .03;
      E(x - s * .5, -1.2, s * .6, s * .6, BLUSH); E(x + s * .5, -1.2, s * .6, s * .6, BLUSH); P([[x - s, -1.15], [x + s, -1.15], [x, -1.15 + s * 1.3]], BLUSH);
    });
  } },

  /* K1 식당의 밤: 스테인리스 튀김기. 윗면의 기름 통, 비스듬히 꽂힌 바구니 손잡이, 아래로 기름이 똑 */
  'cockroach:fryer': { w: 29.5, h: 43, d: (time, t) => {
    const st = crPlanes(t, '#c9cfd6'), pipe = crPlanes(t, '#b9c3c7'), ink = crPlanes(t, '#3a3445');
    crForm([[-14, 0], [-14, -40], [-12.4, -40], [-12.4, 0]], pipe, [[-13, .2], [-13, -40.2], [-12.2, -40.2], [-12.2, .2]], [[-14.2, .2], [-14.2, -40.2], [-13.7, -40.2], [-13.7, .2]]);
    E(-13.2, -.2, 1.3, .3, t('#8d8a9c'));
    [-6.5, 10].forEach((x) => {
      crForm([[x - .1, -12], [x + 1.3, -12], [x + 1, -.8], [x + .2, -.8]], st, [[x + .65, -12], [x + 1.4, -12], [x + 1.4, 0], [x + .65, 0]], null);
      curvy([[x - .3, -.8], [x + 1.5, -.8], [x + 1.3, 0], [x - .1, 0]], ink.mid);
    });
    curvy([[11.4, -12], [14, -13.2], [14.2, -39.2], [11.6, -38]], st.dark);
    curvy([[-8, -12], [11.4, -12], [11.6, -38], [-8.2, -38]], st.mid);
    curvy([[-8.2, -38], [11.6, -38], [14.2, -39.2], [-5.6, -39.2]], st.lit);
    curvy([[-5.6, -38.35], [9.4, -38.35], [11.2, -38.95], [-3.8, -38.95]], t('#7a5a2a'));          // 기름 통
    R(-8, -13, 19.4, 1, st.dark);
    R(-8, -34.6, 19.5, .3, st.dark);                                                              // 조작부 이음매
    E(8.4, -31.2, .95, .95, ink.mid); E(8.15, -31.45, .4, .4, ink.lit);
    ctx.lineCap = 'round'; L(5.6, -38.7, 1.6, -41.6, st.dark, .45); L(1.6, -41.6, -2.4, -42.6, ink.mid, .9);   // 바구니 손잡이
    curvy([[8.5, -12], [9.5, -12], [9.5, -11.4], [9, -11.1], [8.6, -11.4]], st.deep);              // 기름 빼는 꼭지
    ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 8;
    [-1, 1.5, 4, 6.5].forEach((x, i) => E(x, -11.2 + Math.sin(time * 14 + i) * .08, .4, .7, t('#8fc3ff')));
    ctx.restore();
    const u = crCycle(time, .5, 0, 1);
    E(9, -11.3 + u * u * 11, .2, .28, t('#e8b84a'));
    ctx.globalAlpha = .6; E(9, -.05, 3, .2, t('#e8b84a')); ctx.globalAlpha = 1;
    crScent(3, -13, 3, time, t, '#ffd08a');
  } },
  /* K1: 바닥에 식어 굳은 기름 웅덩이와 바위만 한 튀김 부스러기 */
  'cockroach:oilPuddle': { w: 5, h: 2.1, d: (time, t) => {
    ctx.globalAlpha = .7; E(0, -.06, 2.4, .18, t('#e8b84a')); ctx.globalAlpha = 1;
    E(-.8, -.12, .7, .05, t(WHITE));
    [[1.15, .32], [1.75, .26], [1.45, .44]].forEach(([x, r], i) => crCrumb(x, r, i + 11, t, '#e9b35f'));
    crScent(.4, -.6, 1.4, time, t, '#ffd08a');
  } },

  /* 엔딩 가해자 */
  /* D1 단내: 연못만 한 젤 한 방울 */
  'cockroach:gelDrop': { w: 2.5, h: 3.5, d: (time, t) => {
    const k = 1 + Math.sin(time * 2.5) * .04;
    ctx.globalAlpha = .9; E(0, -.1, 1.25, .16, t('#e8a23a')); ctx.globalAlpha = 1;
    crBead(0, 1.02, 1.15 * k, t, '#f2b04a', .18);
    E(.3, -.3, .1, .06, t(WHITE));
    crScent(0, -1.4, 1.8, time, t, '#ffb98a');
  } },
  /* D2 종이집 안: 접힌 지붕 안쪽, 끈끈한 바닥, 먼저 붙은 친구들 */
  'cockroach:stuckInHouse': { w: 13.5, h: 9, d: (time, t) => {
    const roof = crPlanes(t, '#e6765f'), wall = crPlanes(t, '#f6efe0');
    ctx.globalAlpha = .55; R(-5.7, -5.2, 11.4, 5.2, wall.dark); ctx.globalAlpha = 1;                  // 안쪽 뒷벽
    P([[-6.6, -4.9], [0, -8.9], [6.6, -4.9]], roof.mid);
    P([[-5.6, -5.2], [0, -8.2], [0, -5.2]], wall.lit); P([[0, -8.2], [5.6, -5.2], [0, -5.2]], wall.deep);   // 지붕 안쪽 두 면
    crForm([[-6.2, -5.2], [-5.6, -5.2], [-5.6, 0], [-6.2, 0]], wall, null, null);
    crForm([[5.6, -5.2], [6.2, -5.2], [6.2, 0], [5.6, 0]], wall, [[5.5, .2], [5.5, -5.4], [6.4, -5.4], [6.4, .2]], null);
    crBug(time, t, { x: -3.4, k: .9, body: '#8e5530', head: '#b5733f' });
    crBug(time + 2, t, { x: 3, k: .9, body: '#8e5530', head: '#b5733f', flip: true });
    ctx.globalAlpha = .65; RR(-6, -.2, 12, .24, .1, t('#f5d76e')); ctx.globalAlpha = 1;
    [-4, -1.5, 1.8, 4.2].forEach((x) => E(x, -.17, .3, .03, t(WHITE)));
    [-.35, -.05, .25].forEach((x, i) => L(x, -.02, x + Math.sin(time * 18 + i) * .03, -.22, t('#f5d76e'), .04));
  } },
  /* D3 슬리퍼: 머리 위로 내려오는 거대한 욕실 슬리퍼. 두툼한 밑창의 홈과 지압 돌기 박힌 끈이 하늘을 가린다 */
  'cockroach:slipperSole': { w: 29, h: 16, d: (time, t) => {
    const drop = Math.abs(Math.sin(time * 3)) * .5, so = crPlanes(t, '#ff8fa3'), bd = crPlanes(t, '#ffd56b');
    ctx.globalAlpha = .18 + drop * .2; E(0, -.05, 12 - drop * 4, .5, t(INK)); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(0, drop - 4); ctx.rotate(-.05);
    const sole = [[-13.4, -2.6], [-14.8, .8, -12, 1.4], [10, 1.4], [14, 1.4, 15.2, -1.4, 13.6, -2.6]];
    crForm(sole, so, [[-15, .3], [15.5, .3], [15.5, 2], [-15, 2]], [[-15, -2.8], [15.5, -2.8], [15.5, -2.05], [-15, -2.05]]);
    crWithin(sole, () => { for (let x = -11.5; x <= 11.5; x += 1.6) RR(x - .4, .6, .8, .9, .3, so.deep); });
    curvy([[-13.2, -2.6], [13.4, -2.6], [13.6, -3.6, 12, -3.6], [-12.4, -3.6], [-13.6, -3.4, -13.2, -2.6]], bd.mid);
    const strap = [[.2, -3.2], [1.6, -9, 11, -9, 12.4, -3.2], [11, -3.2], [9.8, -7.2, 2.8, -7.2, 1.6, -3.2]];
    crForm(strap, bd, [[1.6, -3.2], [2.8, -7.2, 9.8, -7.2, 11, -3.2], [11.7, -3.2], [10.4, -7.9, 2.2, -7.9, 1, -3.2]],
      [[-1, -4], [1, -9.6, 6, -9.8, 7.4, -9.8], [6, -8.6, 2.8, -8.2, 1.3, -4]]);
    [[3.4, -6.9], [6.3, -7.85], [9.2, -6.9]].forEach(([x, y]) => { E(x, y, .34, .34, bd.dark); E(x - .07, y - .07, .2, .2, bd.lit); });
    ctx.restore();
    ctx.globalAlpha = .6; [-8, -2, 4, 10].forEach((x, i) => L(x, -15.5 + i % 2, x, -12.2 + i % 2, t('#c9c4cc'), .22)); ctx.globalAlpha = 1;
  } },
  /* D7 아래층도 연기: 연막탄 그림 재사용 */
  /* D8 빈집의 겨울: 휑한 바닥에 서릿발, 부스러기 위에도 하얗게 */
  'cockroach:coldDraft': { w: 14.5, h: 10, d: (time, t) => {
    const ice = crPlanes(t, '#e6f3ff');
    [[-1.5, .5], [-.7, .35], [-1.1, .7]].forEach(([x, r], i) => {
      crCrumb(x, r, i + 21, t, '#e0b47a');
      curvy([[x - r * .9, -r * .9], [x - r * .2, -r * 1.75, x + r * .5, -r * 1.3], [x + r * .1, -r * 1.1, x - r * .9, -r * .9]], t('#f4f8ff'));
    });
    for (let x = -5; x <= 6; x += 1.3) {
      const hh = .5 + hash(x, 2) * .4;
      P([[x, 0], [x + .15, -hh], [x + .15, 0]], ice.lit); P([[x + .15, 0], [x + .15, -hh], [x + .3, 0]], ice.dark);
    }
    for (let i = 0; i < 10; i++) {
      const u = crCycle(time, .2, i, 10), x = -6 + hash(i, 4) * 13 + Math.sin(time * 1.5 + i) * .5, y = -9.5 + u * 9, r = .18;
      L(x - r, y, x + r, y, t('#f4f8ff'), .06); L(x, y - r, x, y + r, t('#f4f8ff'), .06);
    }
    ctx.globalAlpha = .25 + Math.sin(time * 1.7) * .15; [-3, -6].forEach((y, i) => L(6 - i * 2, y, 1 - i * 2, y + .4, t('#dff0ff'), .12)); ctx.globalAlpha = 1;
  } },
  /* D9 형광등 아래: 밝은 빛을 뚫고 내려오는 손. 구겨 쥔 휴지가 치맛자락처럼 퍼진다 */
  'cockroach:tissueHand': { w: 20, h: 37, d: (time, t) => {
    const y = Math.sin(time * 2) * .5, ts = crPlanes(t, '#fbfaf6');
    ctx.globalAlpha = .22; P([[-3, -36], [3, -36], [10, 0], [-10, 0]], t('#fff8d8')); ctx.globalAlpha = 1;
    ctx.globalAlpha = .18 + y * .04; E(0, -.1, 6 - y, .5, t(INK)); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(0, y);
    curvy([[-2.6, -17], [-5.5, -12, -6.4, -6, -5.6, -2.6], [-4.2, -1.4, -3, -2.4], [-1.8, -1, -.4, -2], [1, -.8, 2.4, -2.2], [3.8, -1.2, 5.2, -2.8], [6, -6, 5.2, -12, 2.6, -17]], ts.dark);   // 뒤로 접힌 자락
    const front = [[-2.6, -17.4], [-5.2, -12, -5.8, -6.4, -5, -3.2], [-3.8, -2.2, -2.8, -3], [-1.6, -1.8, -.4, -2.7], [.9, -1.6, 2.2, -2.8], [3.4, -2, 4.4, -3.4], [4.8, -6.4, 4.2, -12, 2.6, -17.4]];
    crForm(front, ts, [[1.2, -17.6], [1.6, -12, 2.2, -6, 2.2, -1], [6, -1], [6, -17.6]],
      [[-6, -1], [-6, -17.6], [-1.4, -17.6], [-2.6, -12, -3, -6, -2.8, -1]]);
    ctx.strokeStyle = ts.dark; ctx.lineWidth = .14; ctx.lineCap = 'round'; ctx.beginPath();
    [[-.4, -15.5, -.6, -3.4], [-1.6, -11, -1.2, -7]].forEach(([x1, y1, x2, y2]) => { ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2 + .6, (y1 + y2) / 2, x2, y2); });
    ctx.stroke();
    artHandAt(t, -.2, -17.4, Math.PI / 2 - .12, 15, { pose: 'grip', sleeve: '#5f8fb0' });
    ctx.restore();
  } },
  /* D10 거품 물: 쏟아져 들어오는 설거지 물과 볕 받은 세제 거품 더미 */
  'cockroach:soapFlood': { w: 16.5, h: 6, d: (time, t) => {
    const wt = crPlanes(t, '#bfe3f5'), fm = crPlanes(t, '#e9f2fb');
    const surf = (x) => -.9 - (x + 8) * .12 - Math.sin(x * .9) * Math.sin(time * 3) * .2;
    ctx.save(); ctx.globalAlpha = .62; ctx.fillStyle = wt.mid; ctx.beginPath(); ctx.moveTo(-8, 0);
    for (let x = -8; x <= 8; x += .5) ctx.lineTo(x, surf(x));
    ctx.lineTo(8, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = wt.dark; ctx.fillRect(-8, -.25, 16, .25);
    ctx.restore();
    for (let i = 0; i < 9; i++) {
      const x = -7 + i * 1.8, r = .3 + hash(i, 6) * .35, y = -1.05 - (x + 8) * .12;
      E(x + r * .12, y + r * .12, r, r, fm.dark); E(x - r * .08, y - r * .08, r * .86, r * .86, fm.mid); E(x - r * .3, y - r * .35, r * .3, r * .3, fm.lit);
    }
    for (let i = 0; i < 5; i++) {
      const u = crCycle(time, .3, i, 5), r = .2 + hash(i, 9) * .2;
      ctx.save(); ctx.globalAlpha = .7 * (1 - u); ctx.strokeStyle = t(WHITE); ctx.lineWidth = .05;
      ctx.beginPath(); ctx.arc(-5 + i * 2.4, -2 - u * 4, r, 0, TAU); ctx.stroke(); ctx.restore();
    }
  } },
});
