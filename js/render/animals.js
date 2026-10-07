/* 주인공: 큰 머리, 반짝이는 눈, 볼터치. 몸 기준 원점(앞발 아래 지면)에서 cm 좌표로 그린다.
   (시간, 움직이는 중, 눈높이, 색조함수) */
const INK = '#3b3049', WHITE = '#ffffff', BLUSH = '#ff9aa8';

/** 반짝이는 눈. 가끔 깜빡인다 */
function cuteEye(x, y, rx, ry, time, t) {
  if (Math.sin(time * .9 + x) > .985) { L(x - rx, y, x + rx, y, t(INK), ry * .5); return; }
  E(x, y, rx, ry, t(INK));
  E(x + rx * .3, y - ry * .35, rx * .38, rx * .38, WHITE);
}

function blush(x, y, rx, ry) {
  ctx.globalAlpha = .55; E(x, y, rx, ry, BLUSH); ctx.globalAlpha = 1;
}

const ANIMALS = {
  cat(time, moving, eye, t) {
    const fur = t('#f2a65a'), dark = t('#d9823f'), belly = t('#fde6c4'), pink = t('#ff9aa8');
    const w = moving ? time * 10 : 0, bob = moving ? Math.abs(Math.sin(w)) * 1.2 : Math.sin(time * 2) * .4;
    ctx.strokeStyle = fur; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-14, -16 - bob); ctx.quadraticCurveTo(-30, -18, -27 + Math.sin(time * 2.4) * 3, -36); ctx.stroke();
    [[-11, 0], [-4, Math.PI], [7, Math.PI], [13, 0]].forEach(([lx, ph]) => RR(lx + Math.sin(w + ph) * 2.5 - 3, -10, 6.5, 10, 3, dark));
    E(0, -16 - bob, 17, 11.5, fur); E(2, -12 - bob, 11, 6, belly);
    const hx = 16, hy = -33 - bob;
    P([[hx - 11, hy - 6], [hx - 9, hy - 19], [hx - 1, hy - 10]], fur); P([[hx + 2, hy - 11], [hx + 10, hy - 19], [hx + 12, hy - 5]], fur);
    P([[hx - 9, hy - 8], [hx - 8.5, hy - 15], [hx - 3, hy - 10]], pink); P([[hx + 4, hy - 10], [hx + 9, hy - 15], [hx + 10, hy - 7]], pink);
    E(hx, hy, 13, 11.5, fur);
    [-2, 1.5, 5].forEach((dx) => RR(hx + dx, hy - 11.5, 1.6, 4.5, .8, dark));
    // 눈 사이를 넓게 벌려 살짝 멍한 얼굴로
    cuteEye(hx - 1.8, hy + 1, 2.8, 2.2, time, t); cuteEye(hx + 8.8, hy + 1, 2.8, 2.2, time, t);
    blush(hx - 6, hy + 5.5, 2.4, 1.5); blush(hx + 13, hy + 5.5, 2.4, 1.5);
    E(hx + 3.5, hy + 3.6, 1.2, .9, pink);
  },

  cockroach(time, moving, eye, t) {
    const w = moving ? time * 26 : 0;
    ctx.strokeStyle = t('#6b4126'); ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i < 3; i++) { const x = -.3 + i * .3, sw = Math.sin(w + i * 2) * .1; ctx.moveTo(x, -.18); ctx.lineTo(x - .08 + sw, 0); }
    ctx.stroke();
    E(0, -.32, .62, .3, t('#b5733f'));
    L(-.5, -.32, .3, -.32, t('#8e5530'), .03);
    ctx.globalAlpha = .35; E(-.15, -.48, .3, .07, WHITE); ctx.globalAlpha = 1;
    E(.6, -.36, .24, .22, t('#d49a62'));
    E(.68, -.42, .09, .1, WHITE); E(.7, -.41, .05, .06, t(INK));
    blush(.7, -.29, .06, .04);
    ctx.strokeStyle = t('#6b4126'); ctx.lineWidth = .035; ctx.beginPath();
    ctx.moveTo(.72, -.55); ctx.quadraticCurveTo(.95, -1, 1.3, -.85 + Math.sin(time * 4) * .06); ctx.stroke();
  },

  pigeon(time, moving, eye, t) {
    const y = -eye + Math.sin(time * 2) * 5, f = Math.sin(time * (moving ? 12 : 4));
    P([[-12, y - 1], [-24, y + 4], [-24, y - 5]], t('#8b93ab'));
    E(2, y + 11, 2.2, 1.5, t(BLUSH));
    E(0, y, 15, 12, t('#aeb6cb')); E(3, y + 3, 10, 7, t('#c5ccdc'));
    ctx.fillStyle = t('#d3d9e6'); ctx.beginPath(); ctx.moveTo(-9, y - 2); ctx.quadraticCurveTo(-2, y - 2 - 16 * f, 10, y - 2); ctx.closePath(); ctx.fill();
    E(9, y - 4, 6, 3.5, t('#7fd1c1')); E(9, y - 2.4, 5, 2, t('#c9a3e6'));
    E(12, y - 10, 8, 7.5, t('#9aa3bb'));
    cuteEye(14.5, y - 11, 1.9, 2.2, time, t);
    P([[19, y - 10], [23.5, y - 8.5], [19, y - 7.5]], t('#f2b48a')); E(19.6, y - 10, 1.2, .8, WHITE);
    blush(15.5, y - 6.6, 2, 1.2);
  },

  fly(time, moving, eye, t) {
    const y = -eye + Math.sin(time * 3) * .35, flap = moving ? (Math.sin(time * 80) > 0 ? 1 : .35) : .8;
    ctx.globalAlpha = .75; E(-.14, y - .3, .28, .16 * flap + .04, '#eaf4ff'); E(.04, y - .33, .26, .15 * flap + .04, WHITE); ctx.globalAlpha = 1;
    E(0, y, .32, .24, t('#4a4258'));
    [-.16, -.02].forEach((x) => RR(x, y - .2, .06, .4, .03, t(INK)));
    E(.3, y - .04, .18, .17, t('#4a4258'));
    E(.36, y - .1, .14, .15, t('#ff6b7a')); E(.32, y - .15, .04, .04, WHITE);
    L(-.1, y + .2, -.16, y + .38, t(INK), .03); L(.12, y + .2, .14, y + .38, t(INK), .03);
  },
};
