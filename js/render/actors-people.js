/* 등장인물(사람)과 위험한 물건. 원점은 발밑 가운데, 오른쪽을 본다. cm 좌표.
   d(시간, 색조함수). w·h는 화면에 보이는지 판단할 때 쓴다 */
const SKIN = '#f3c9a5';

const SHOE = '#3b3049', SOLE = '#e9e4ec';
const ARM_POSE = Object.freeze({ down: [.03, .26], out: [.2, .1], up: [.13, -.12] });
const HAND_PER_ARM = 1.8;   // 손 길이 = 팔 굵기 × 이 값 (artHandOnArm 크기)

/**
 * 사람 한 명. o: { h 키, top 윗옷, bottom 바지, hair 머리색, arm 'down'|'out'|'up', handPose 'flat'|'offer'|'grip'(기본: 내린 팔은 flat, 나머지는 grip), extra(머리장식 등) }
 * 손 끝 위치(어깨 + ARM_POSE, sin(time*3)만큼 흔들림)와 머리 중심은 장면 그림들이 물건을 쥐여 주는 기준이라 바꾸지 않는다.
 * 제자리에서 숨 쉬고 손만 살짝 흔든다 (걷는 동작이 없어야 화면이 흘러갈 때 뒷걸음질처럼 보이지 않는다)
 */
function person(time, t, o) {
  const H = o.h, legH = H * .44, bodyH = H * .32, headR = H * .1, top = -legH - bodyH;
  const swing = Math.sin(time * 3) * H * .01, breathe = Math.sin(time * 1.6) * H * .003;
  personLegs(H, legH, o, t);
  personBackArm(H, top, o, t);
  personTorso(H, top + breathe, legH, o, t);
  const sx = H * .02, sy = top + H * .05;
  const arm = ARM_POSE[o.arm || 'down'];
  personArm(sx, sy + breathe, sx + arm[0] * H, sy + arm[1] * H + swing, H, o, t);
  personHead(H, top - headR * .8 + breathe * .5, headR, o, t);
}

/** 바지 두 짝(무릎이 살짝 굽은 통), 신발 */
function personLegs(H, legH, o, t) {
  const hip = -legH, w = H * .068;
  [[-H * .04, t(shade(o.bottom))], [H * .035, t(o.bottom)]].forEach(([lx, c]) => {
    curvy([[lx - w / 2, hip], [lx + w / 2 + H * .006, hip], [lx + w * .55, hip + legH * .5, lx + w * .32, -H * .03], [lx - w * .38, -H * .03], [lx - w * .62, hip + legH * .45, lx - w / 2, hip]], c);
    R(lx - w * .38, -H * .052, w * .7, H * .006, t(mix(o.bottom, '#2f2a3a', .25)));                      // 바짓단
    personShoe(lx - w * .32, H, t);
  });
  L(H * .045, hip + legH * .45, H * .055, hip + legH * .6, t(shade(o.bottom)), H * .004);                // 무릎 주름
}

function personShoe(x, H, t) {
  const l = H * .105, h = H * .036;
  curvy([[x - l * .1, 0], [x - l * .14, -h * 1.1, x + l * .2, -h * 1.15], [x + l * .55, -h], [x + l * .95, -h * .6, x + l, 0]], t(SHOE));
  R(x - l * .12, -h * .22, l * 1.1, h * .22, t(SOLE));
  E(x + l * .45, -h * .78, l * .12, h * .12, t(mix(SHOE, '#ffffff', .25)));
}

/** 몸통: 어깨가 둥근 윗옷, 옷자락, 목선, 주름 */
function personTorso(H, top, legH, o, t) {
  const c = t(o.top), d = t(shade(o.top)), hem = -legH + H * .035;
  curvy([[-H * .1, hem], [-H * .118, top + H * .12, -H * .1, top + H * .03], [-H * .05, top - H * .006, 0, top], [H * .05, top - H * .006, H * .095, top + H * .03],
    [H * .115, top + H * .14, H * .105, hem]], c);
  curvy([[-H * .1, hem - H * .02], [H * .105, hem - H * .02], [H * .108, hem + H * .006], [-H * .103, hem + H * .006]], d);   // 밑단
  curvy([[-H * .02, top + H * .002], [0, top + H * .03, H * .025, top + H * .002]], t(SKIN));            // 목선
  R(-H * .014, top - H * .02, H * .03, H * .022, t(SKIN));
  ctx.strokeStyle = d; ctx.lineWidth = H * .0035; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(-H * .06, hem - H * .05); ctx.quadraticCurveTo(-H * .03, hem - H * .09, -H * .045, hem - H * .14);
  ctx.moveTo(H * .07, hem - H * .04); ctx.quadraticCurveTo(H * .05, hem - H * .07, H * .065, hem - H * .1);
  ctx.stroke();
}

/** 몸 뒤로 늘어진 반대쪽 팔 (그늘색) */
function personBackArm(H, top, o, t) {
  ctx.strokeStyle = t(shade(o.top)); ctx.lineWidth = H * .05; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-H * .06, top + H * .05); ctx.quadraticCurveTo(-H * .095, top + H * .17, -H * .08, top + H * .27); ctx.stroke();
  // 손바닥이 몸 쪽(+x)으로 굽게 뒤집어 그려 손끝이 몸통 밖으로 삐져나오지 않게 한다
  ctx.save(); ctx.translate(-H * .08, top + H * .27); ctx.rotate(Math.atan2(H * .1, H * .015)); ctx.scale(1, -1);
  artHand(t, { pose: 'flat', s: H * .05 * HAND_PER_ARM, coat: shade(SKIN) });
  ctx.restore();
}

/** 앞쪽 팔: 팔꿈치에서 살짝 굽은 소매 끝에 손목을 붙인 Twemoji 손. 쥔 자리(주먹 가운데)가 손 끝 위치(hx, hy)에 온다 */
function personArm(sx, sy, hx, hy, H, o, t) {
  const dx = hx - sx, dy = hy - sy, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
  const ex = sx + dx * .5 - nx * H * .025, ey = sy + dy * .5 - ny * H * .025, ang = Math.atan2(hy - ey, hx - ex);
  const pose = o.handPose || (o.arm === 'down' || !o.arm ? 'flat' : 'grip'), s = H * .055 * HAND_PER_ARM;
  const reach = HAND_HOLD[pose][0] * s, wx = hx - Math.cos(ang) * reach, wy = hy - Math.sin(ang) * reach;
  ctx.strokeStyle = t(o.top); ctx.lineWidth = H * .055; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(ex, ey, wx, wy); ctx.stroke();
  artHandOnArm(t, wx, wy, ang, s, { pose });
}

/** 머리: 얼굴, 귀, 코, 머리카락 덩어리, 눈썹, 눈, 볼터치 */
function personHead(H, hy, headR, o, t) {
  const r = headR;
  E(0, hy, r, r * 1.08, t(SKIN));
  curvy([[r * .72, hy - r * .5], [r * .55, hy - r * 1.25, -r * .3, hy - r * 1.22], [-r * 1.25, hy - r * .9, -r * 1.12, hy + r * .2], [-r * 1.05, hy + r * .62],
    [-r * .55, hy + r * .55], [-r * .4, hy - r * .1, -r * .05, hy - r * .42], [r * .3, hy - r * .28, r * .72, hy - r * .5]], t(o.hair));
  E(-r * .2, hy + r * .12, r * .17, r * .22, t(SKIN)); E(-r * .2, hy + r * .12, r * .08, r * .12, t(shade(SKIN)));   // 귀
  if (o.extra) o.extra(hy, r);
  L(r * .3, hy - r * .22, r * .6, hy - r * .25, t(mix(o.hair, INK, .4)), r * .07);                      // 눈썹
  E(r * .45, hy + r * .05, r * .1, r * .13, t(INK));
  L(r * .62, hy + r * .55, r * .78, hy + r * .52, t(mix(SKIN, INK, .45)), r * .05);                     // 입
  blush(r * .55, hy + r * .38, r * .17, r * .1);
}

/** 휘두르는 손바닥: 소맷부리에서 손끝이 위로 선 🫳 손을 옆에서 본 모양 */
function slapHand(t) {
  ctx.save(); ctx.translate(0, -6.4); ctx.rotate(-Math.PI / 2);
  artHand(t, { pose: 'flat', s: 16, sleeve: '#8fa9c4' });
  ctx.restore();
}

const ACTORS = {
  grandma: { w: 60, h: 150, d: (time, t) => person(time, t, { h: 150, top: '#c97b9c', bottom: '#6b5f7c', hair: '#c9c4cc', arm: 'out', handPose: 'flat',
    extra: (hy, r) => E(-r * .7, hy - r * .8, r * .45, r * .4, t('#c9c4cc')) }) },
  auntie: { w: 60, h: 158, d: (time, t) => person(time, t, { h: 158, top: '#8fb8a8', bottom: '#5f6f86', hair: '#4a3a3a', arm: 'out', handPose: 'offer',
    extra: (hy, r) => [-.6, 0, .5].forEach((k) => E(r * k, hy - r * .85, r * .35, r * .3, t('#4a3a3a'))) }) },
  owner: { w: 60, h: 168, d: (time, t) => person(time, t, { h: 168, top: '#f0c27a', bottom: '#5f8fb0', hair: '#2f2a3a', arm: 'down' }) },
  kid: { w: 45, h: 120, d: (time, t) => person(time, t, { h: 120, top: '#ff8fa3', bottom: '#5f8fb0', hair: '#2f2a3a', arm: 'out',
    extra: (hy, r) => { RR(-r * 1.1, hy - r * 1.05, r * 2.1, r * .6, r * .3, t('#ffd56b')); RR(r * .6, hy - r * .6, r * .8, r * .2, r * .1, t('#ffd56b')); } }) },
  worker: { w: 60, h: 172, d: (time, t) => person(time, t, { h: 172, top: '#4a5d7a', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'out',
    extra: (hy, r) => { RR(-r * 1.1, hy - r * 1.1, r * 2.1, r * .7, r * .3, t('#e6765f')); RR(r * .1, hy + r * .1, r * .9, r * .5, r * .2, t('#f4f1ea')); } }) },

  slipper: { w: 26, h: 9, d: (time, t) => {
    ctx.rotate(-.3 + Math.sin(time * 9) * .15);
    const sole = '#ff8fa3';
    curvy([[-13, -2], [-14, -6.5, -9, -7], [0, -5.6], [9, -7.4, 13.5, -5], [13.5, -1, 9, 0], [-9, 0, -13, -2]], t(sole));   // 밑창 (가운데가 잘록)
    curvy([[-12.5, -2.2], [12.8, -2.4], [12.6, -.8, 9, 0], [-9, 0, -12.5, -2.2]], t(shade(sole)));
    curvy([[-1, -5.5], [1, -11.5, 7, -11.5], [11, -5.8]], t('#ffd56b'));                                    // 발등 끈
    curvy([[1, -5.6], [3, -9.4, 6.6, -9.4], [9.4, -5.8]], t(shade('#ffd56b')));
    for (let k = 0; k < 3; k++) E(-9 + k * 4, -4.6, .6, .4, t(mix(sole, '#ffffff', .4)));
  } },
  hand: { w: 22, h: 22, d: (time, t) => {
    ctx.rotate(Math.sin(time * 6) * .25);
    slapHand(t);
  } },
  swatter: { w: 16, h: 45, d: (time, t) => {
    ctx.rotate(-.4 + Math.sin(time * 8) * .3);
    RR(-.6, -45, 1.2, 30, .6, t('#e6765f'));
    RR(-1.1, -45, 2.2, 9, 1.1, t(shade('#e6765f'))); E(0, -45.5, 1.6, 1.2, t('#e6765f'));                    // 손잡이 고리
    RR(-7, -15, 14, 15, 2.5, t('#5fa39a'));
    ctx.strokeStyle = t('#3f8a82'); ctx.lineWidth = .4; ctx.beginPath();
    for (let k = -5; k <= 5; k += 2.5) { ctx.moveTo(k, -14); ctx.lineTo(k, -1); ctx.moveTo(-6, -7.5 + k); ctx.lineTo(6, -7.5 + k); }
    ctx.stroke();
  } },
  eSwatter: { w: 26, h: 50, d: (time, t) => {
    ctx.rotate(-.3 + Math.sin(time * 7) * .25);
    RR(-1.4, -18, 2.8, 18, 1.4, t('#3b3049'));
    ctx.strokeStyle = t('#ffd56b'); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(0, -33, 12, 15, 0, 0, TAU); ctx.stroke();
    ctx.strokeStyle = t('#c9c4cc'); ctx.lineWidth = .3; ctx.beginPath();
    for (let k = -10; k <= 10; k += 2) { ctx.moveTo(k, -47); ctx.lineTo(k, -19); ctx.moveTo(-11, -33 + k); ctx.lineTo(11, -33 + k); }
    ctx.stroke();
  } },
  ribbon: { w: 6, h: 60, d: (time, t) => {
    const sway = Math.sin(time * 1.5) * 1.5;
    RR(-2.5 + sway, -60, 5, 60, 1.5, t('#ffd56b'));
    [-48, -30, -14].forEach((y, i) => E(sway + (i % 2 ? 1 : -1), y, .6, .4, t(INK)));
    RR(-1, -64, 2, 5, .5, t('#e6765f'));
  } },
  zapper: { w: 40, h: 35, d: (time, t) => {
    RR(-20, -35, 40, 35, 5, t('#e9e4ec'));
    ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 25;
    [-25, -17, -9].forEach((y) => RR(-15, y, 30, 3, 1.5, '#9fd0ff'));
    ctx.restore();
    ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .8; ctx.beginPath();
    for (let x = -16; x <= 16; x += 4) { ctx.moveTo(x, -31); ctx.lineTo(x, -4); }
    ctx.stroke();
  } },
  gel: { w: .8, h: .6, d: (time, t) => { ctx.globalAlpha = .85; E(0, -.25, .4, .25, t('#f2b04a')); ctx.globalAlpha = 1; E(-.12, -.33, .1, .05, WHITE); } },
  rice: { w: 60, h: 1, d: (time, t) => {
    for (let i = 0; i < 26; i++) E((hash(i, 3) - .5) * 60, -.25, .35, .2, t('#fbf7ee'));
  } },
  web: { w: 40, h: 40, d: (time, t) => {
    ctx.strokeStyle = t('#e9e4ec'); ctx.globalAlpha = .75; ctx.lineWidth = .18; ctx.beginPath();
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; ctx.moveTo(0, -20); ctx.lineTo(Math.cos(a) * 20, -20 + Math.sin(a) * 20); }
    for (let r = 4; r <= 18; r += 3.5) { ctx.moveTo(r, -20); for (let k = 1; k <= 16; k++) { const a = k / 16 * TAU; ctx.lineTo(Math.cos(a) * r, -20 + Math.sin(a) * r); } }
    ctx.stroke(); ctx.globalAlpha = 1;
  } },
  truck: { w: 700, h: 300, d: (time, t) => {
    RR(-350, -290, 470, 250, 30, t('#6fae7f')); RR(-340, -280, 450, 50, 20, t('#f4f1ea'));
    RR(130, -230, 200, 190, 40, t('#6fae7f')); RR(170, -215, 130, 80, 20, t('#cfe3ea'));
    [-250, -40, 230].forEach((x) => { E(x, -45, 45, 45, t('#3a3445')); E(x, -45, 18, 18, t('#cfcad8')); });
    RR(-372, -230, 24, 150, 8, t('#ffd56b'));
  } },
  car: { w: 430, h: 150, d: (time, t) => {
    const c = '#e6765f';
    [-140, 140].forEach((x) => { E(x, -32, 32, 32, t('#3a3445')); E(x, -32, 13, 13, t('#cfcad8')); });
    RR(-125, -158, 270, 90, 40, t(c)); RR(-100, -145, 100, 50, 18, t('#d8edf3')); RR(12, -145, 100, 50, 18, t('#d8edf3'));
    RR(-215, -108, 430, 76, 34, t(c)); RR(-215, -62, 430, 26, 13, t(shade(c)));
    E(200, -86, 12, 9, '#fff3b8');
    ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = '#fff3b8';
    ctx.beginPath(); ctx.moveTo(205, -92); ctx.lineTo(420, -140); ctx.lineTo(420, -30); ctx.closePath(); ctx.fill(); ctx.restore();
    [-80, -60, -40].forEach((y, i) => L(-260 - i * 30, y, -320 - i * 30, y, t('#ffffff'), 4));
  } },
  glassWall: { w: 320, h: 420, d: (time, t) => {
    ctx.save(); ctx.globalAlpha = .38; RR(-160, -420, 320, 420, 6, '#bfe3f5'); ctx.restore();
    ctx.save(); ctx.globalAlpha = .45;
    E(-60, -170, 70, 60, '#7fb08a'); E(40, -300, 90, 50, '#ffffff');
    P([[-120, -400], [-60, -400], [40, 0], [-20, 0]], '#ffffff');
    P([[30, -400], [55, -400], [140, -60], [115, -60]], '#ffffff');
    ctx.restore();
    RR(-164, -424, 8, 424, 3, t('#a29fb2')); RR(156, -424, 8, 424, 3, t('#a29fb2')); RR(-164, -424, 328, 8, 3, t('#a29fb2'));
  } },
  sprayCan: { w: 30, h: 28, d: (time, t) => {
    RR(-6, -24, 12, 24, 4, t('#5f8fb0')); RR(-6, -17, 12, 6, 0, t('#ffd56b')); RR(-3, -28, 6, 5, 2, t('#e9e4ec')); RR(2, -27, 4, 2, 1, t('#3b3049'));
    ctx.save(); ctx.globalAlpha = .35 + Math.sin(time * 20) * .1; ctx.fillStyle = '#f4f8ff';
    ctx.beginPath(); ctx.moveTo(6, -26); ctx.lineTo(34, -36); ctx.lineTo(34, -12); ctx.closePath(); ctx.fill(); ctx.restore();
  } },
  scooter: { w: 170, h: 125, d: (time, t) => {
    [-55, 60].forEach((x) => { E(x, -27, 27, 27, t('#3a3445')); E(x, -27, 11, 11, t('#cfcad8')); });
    RR(-60, -70, 110, 30, 15, t('#e6765f')); RR(35, -110, 12, 50, 6, t('#3b3049')); RR(25, -118, 34, 8, 4, t('#3b3049'));
    RR(-85, -125, 60, 55, 8, t('#f4f1ea')); RR(-85, -110, 60, 10, 0, t('#e6765f'));
  } },
};
