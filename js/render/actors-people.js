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

/** 바지 두 짝: 엉덩이에서 무릎을 지나 발목으로 가늘어지고 종아리가 뒤로 살짝 부푼다. 뒷다리는 그늘색.
    o.feet가 'slipper'면 맨발에 슬리퍼({ sole, strap })를 신는다 */
function personLegs(H, legH, o, t) {
  const leg = (lx) => [[lx - .046 * H, legH], [lx + .04 * H, legH], [lx + .044 * H, legH * .72, lx + .03 * H, legH * .5], [lx + .022 * H, legH * .25, lx + .019 * H, H * .045],
    [lx - .016 * H, H * .045], [lx - .036 * H, legH * .3, lx - .03 * H, legH * .5], [lx - .05 * H, legH * .75, lx - .046 * H, legH]];
  [[-H * .04, t(shade(o.bottom)), true], [H * .035, t(o.bottom), false]].forEach(([lx, c, isBack]) => {
    if (o.feet === 'slipper') personSlipper(lx - H * .03, H, o, t, isBack); else personShoe(lx - H * .03, H, t, isBack);
    cut(0, 0, 1, leg(lx), c);
  });
}

/** 옆에서 본 운동화: 높은 뒤꿈치에서 발등을 타고 둥근 앞코로 내려가는 갑피 한 장, 그 아래 밝은 밑창 */
function personShoe(x, H, t, isBack) {
  const l = H * .108, c = isBack ? shade(SHOE) : SHOE;
  cut(x, 0, 1, [[0, 0], [-l * .06, l * .2, -l * .02, l * .4], [l * .3, l * .44], [l * .52, l * .38, l * .72, l * .3], [l * .98, l * .24, l * 1.02, l * .1], [l, 0]], t(c));
  cut(x, 0, 1, [[-l * .03, 0], [l * 1.01, 0], [l * 1.03, l * .06, l * 1.01, l * .1], [l * .5, l * .08], [-l * .04, l * .1]], t(isBack ? shade(SOLE) : SOLE));
}

/** 맨발에 끈 슬리퍼: 납작한 밑창, 발등을 가로지르는 끈, 끈 밖으로 나온 발가락 */
function personSlipper(x, H, o, t, isBack) {
  const l = H * .115, f = (c) => t(isBack ? shade(c) : c), sl = o.slipper || {};
  cut(x, 0, 1, [[l * .02, l * .14], [-l * .02, l * .32, l * .12, l * .42], [l * .5, l * .32], [l * .86, l * .26, l * .98, l * .16], [l * .94, l * .1, l * .8, l * .12]], f(SKIN));
  cut(x, 0, 1, [[-l * .08, 0], [l * 1.06, 0], [l * 1.12, l * .14, l * 1, l * .16], [-l * .06, l * .17]], f(sl.sole || '#ff8fa3'));
  cut(x, 0, 1, [[l * .3, l * .14], [l * .34, l * .46, l * .56, l * .44], [l * .78, l * .14]], f(sl.strap || '#ffd56b'));
}

/** 몸통: 어깨가 둥글게 떨어지는 윗옷 한 장. 빛이 왼쪽 위에서 와서 오른쪽 옆구리가 그늘진다 */
function personTorso(H, top, legH, o, t) {
  const T = -top, hem = legH - H * .035;
  const shirt = [[-H * .02, T], [H * .025, T], [H * .07, T - H * .005, H * .095, T - H * .03], [H * .112, T - H * .1, H * .106, T - H * .2], [H * .104, hem + H * .04, H * .112, hem],
    [0, hem - H * .012, -H * .104, hem], [-H * .114, T - H * .2, -H * .104, T - H * .08], [-H * .095, T - H * .01, -H * .02, T]];
  cut(0, 0, 1, shirt, t(o.top));
  within(0, 0, 1, shirt, () => cut(0, 0, 1, [[H * .07, T], [H * .05, T - H * .12, H * .066, hem - H * .02], [H * .2, hem - H * .02], [H * .2, T]], t(shade(o.top))));
  R(-H * .014, top - H * .02, H * .03, H * .022, t(SKIN));                                                  // 목
  cut(0, 0, 1, [[-H * .022, T + H * .001], [0, T - H * .028, H * .027, T + H * .001]], t(SKIN));            // 목선
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
