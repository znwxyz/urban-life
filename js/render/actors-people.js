/* 등장인물(사람)과 위험한 물건. 원점은 발밑 가운데, 오른쪽을 본다. cm 좌표.
   d(시간, 색조함수). w·h는 화면에 보이는지 판단할 때 쓴다 */
const SKIN = '#f3c9a5';

/** 사람 한 명. o: { h 키, top 윗옷, bottom 바지, hair 머리색, arm 'down'|'out'|'up', extra(머리장식 등) } */
function person(time, t, o) {
  const H = o.h, legH = H * .44, bodyH = H * .32, headR = H * .1, top = -legH - bodyH;
  const swing = Math.sin(time * 3) * H * .01;
  RR(-H * .075, -legH, H * .065, legH, H * .03, t(o.bottom)); RR(H * .01, -legH, H * .065, legH, H * .03, t(shade(o.bottom)));
  RR(-H * .09, -H * .03, H * .1, H * .03, H * .015, t(INK)); RR(H * .0, -H * .03, H * .1, H * .03, H * .015, t(INK));
  RR(-H * .11, top, H * .22, bodyH + H * .03, H * .07, t(o.top));
  const sx = H * .02, sy = top + H * .05;
  const arm = { down: [H * .03, H * .26], out: [H * .2, H * .1], up: [H * .13, -H * .12] }[o.arm || 'down'];
  ctx.strokeStyle = t(o.top); ctx.lineWidth = H * .055; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + arm[0], sy + arm[1] + swing); ctx.stroke();
  E(sx + arm[0], sy + arm[1] + swing, H * .03, H * .03, t(SKIN));
  const hy = top - headR * .8;
  E(0, hy, headR, headR * 1.08, t(SKIN));
  E(-headR * .15, hy - headR * .45, headR * 1.05, headR * .75, t(o.hair));
  if (o.extra) o.extra(hy, headR);
  E(headR * .45, hy + headR * .05, headR * .1, headR * .13, t(INK));
  blush(headR * .55, hy + headR * .38, headR * .17, headR * .1);
}

const ACTORS = {
  grandma: { w: 60, h: 150, d: (time, t) => person(time, t, { h: 150, top: '#c97b9c', bottom: '#6b5f7c', hair: '#c9c4cc', arm: 'out',
    extra: (hy, r) => E(-r * .7, hy - r * .8, r * .45, r * .4, t('#c9c4cc')) }) },
  auntie: { w: 60, h: 158, d: (time, t) => person(time, t, { h: 158, top: '#8fb8a8', bottom: '#5f6f86', hair: '#4a3a3a', arm: 'out',
    extra: (hy, r) => [-.6, 0, .5].forEach((k) => E(r * k, hy - r * .85, r * .35, r * .3, t('#4a3a3a'))) }) },
  owner: { w: 60, h: 168, d: (time, t) => person(time, t, { h: 168, top: '#f0c27a', bottom: '#5f8fb0', hair: '#2f2a3a', arm: 'down' }) },
  kid: { w: 45, h: 120, d: (time, t) => person(time, t, { h: 120, top: '#ff8fa3', bottom: '#5f8fb0', hair: '#2f2a3a', arm: 'out',
    extra: (hy, r) => { RR(-r * 1.1, hy - r * 1.05, r * 2.1, r * .6, r * .3, t('#ffd56b')); RR(r * .6, hy - r * .6, r * .8, r * .2, r * .1, t('#ffd56b')); } }) },
  worker: { w: 60, h: 172, d: (time, t) => person(time, t, { h: 172, top: '#4a5d7a', bottom: '#3d4c66', hair: '#2f2a3a', arm: 'out',
    extra: (hy, r) => { RR(-r * 1.1, hy - r * 1.1, r * 2.1, r * .7, r * .3, t('#e6765f')); RR(r * .1, hy + r * .1, r * .9, r * .5, r * .2, t('#f4f1ea')); } }) },

  slipper: { w: 26, h: 9, d: (time, t) => {
    ctx.rotate(-.3 + Math.sin(time * 9) * .15);
    E(0, -4, 13, 4.5, t('#ff8fa3')); RR(-2, -9, 12, 5, 2.5, t('#ffd56b'));
  } },
  hand: { w: 22, h: 22, d: (time, t) => {
    ctx.rotate(Math.sin(time * 6) * .25);
    RR(-8, -14, 16, 14, 6, t(SKIN));
    [-6.5, -2.5, 1.5, 5.5].forEach((x, i) => RR(x - 1.6, -24 + (i % 3), 3.6, 12, 1.8, t(SKIN)));
    RR(6, -10, 9, 3.6, 1.8, t(shade(SKIN)));
  } },
  swatter: { w: 16, h: 45, d: (time, t) => {
    ctx.rotate(-.4 + Math.sin(time * 8) * .3);
    RR(-.6, -45, 1.2, 30, .6, t('#e6765f'));
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
