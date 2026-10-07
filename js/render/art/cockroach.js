/* 바퀴벌레 장면 전용 그림. 키는 'cockroach:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   바퀴 눈높이는 0.5cm라서 부스러기는 바위, 슬리퍼는 건물, 젤 한 방울은 연못처럼 보인다 */

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

(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})({
  /* R1 방역하는 날: 타일 이음매를 따라 짜 놓은 젤 방울 줄 */
  'cockroach:gelSeam': { w: 9.5, h: 1.9, d: (time, t) => {
    R(-4.5, -.08, 9, .1, t('#a89e90'));
    [-4, -2.4, -.8, .9, 2.6, 4.2].forEach((x, i) => {
      const k = 1 + Math.sin(time * 3 + i) * .04, r = .32 + hash(i, 5) * .12;
      ctx.globalAlpha = .9; E(x, -.2 * k, r, .22 * k, t('#f2b04a')); ctx.globalAlpha = 1;
      E(x - r * .35, -.3, r * .3, .06, WHITE);
      if (i % 2 === 0) crScent(x, -.6, 1.2, time + i, t, '#ffb98a');
    });
  } },
  /* R1: 형들이 나간 벽 틈. 나간 발자국만 있고 돌아온 발자국은 없다 */
  'cockroach:emptyCrack': { w: 10, h: 3.5, d: (time, t) => {
    RR(-2, -3.2, 4, 3.2, .3, t('#d9cbb5')); R(-2, -3.3, 4, .3, t(shade('#d9cbb5')));
    P([[-.5, 0], [-.7, -.9], [-.35, -1.6], [-.6, -2.4], [-.2, -2.1], [.15, -1.4], [.05, -.7], [.5, 0]], t('#2e2420'));
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = .55 - i * .07;
      E(-1.1 - i * .55, -.03, .07, .03, t('#6b4126')); E(-1.35 - i * .55, -.05, .07, .03, t('#6b4126'));
    }
    ctx.globalAlpha = 1;
    E(.02, -1.1 + Math.sin(time * 1.5) * .05, .07, .07, t('#f6f3ec'));
  } },

  /* R2 배달 봉투: 바닥에 놓인 봉투 밑동, 매듭과 삐져나온 냅킨 */
  'cockroach:napkinBag': { w: 37, h: 28, d: (time, t) => {
    ctx.save(); ctx.rotate(Math.sin(time * 1.6) * .015);
    RR(-13, -21, 26, 21, 5, t(shade('#f6f3ec'))); RR(-13, -21, 22, 21, 5, t('#f6f3ec'));
    ctx.globalAlpha = .22; RR(-9, -14, 14, 9, 2, t('#e6765f')); ctx.globalAlpha = 1;
    E(-4, -24, 4, 3, t('#f6f3ec')); E(4, -24, 4, 3, t(shade('#f6f3ec'))); E(0, -21.5, 2.2, 1.6, t('#e9e4ec'));
    RR(3, -16, 5, 7, .4, t('#fffaf0')); [-14.8, -13.6, -12.4].forEach((y) => L(3.8, y, 7.2, y, t('#c9c4cc'), .2));
    [[-.55, '#fffaf0'], [-.3, '#f4efe6'], [-.08, '#fbfaf6']].forEach(([a, c], i) => {
      ctx.save(); ctx.translate(-11 + i * 1.2, -2.2 - i * .6); ctx.rotate(a);
      RR(-7, -2.4, 8, 2.4, .4, t(shade(c))); RR(-7, -2.4, 8, 2, .4, t(c)); L(-6.4, -1.2, .4, -1.2, t('#ff9aa8'), .15);
      ctx.restore();
    });
    E(-13.6, -1.6, .9, .5, t('#4a3a30'));
    ctx.restore();
  } },
  /* R2: 포장대 밑에 새로 생긴 종이집(바퀴 끈끈이 트랩). 창문엔 붙어 버린 애들이 보인다 */
  'cockroach:roachHouse': { w: 11.5, h: 7.5, d: (time, t) => {
    R(-5, -.3, 10, .3, t('#d9c39b'));
    block(-4.5, -4.2, 9, 3.9, '#f6efe0', t);
    P([[-5.4, -4], [0, -7.2], [5.4, -4]], t('#e6765f')); P([[0, -7.2], [5.4, -4], [3.5, -4]], t(shade('#e6765f')));
    RR(2.4, -7, .9, 1.8, .2, t('#c99a6e'));
    RR(-1.1, -2.4, 2.2, 2.1, 1, t('#4a3a30'));
    ctx.globalAlpha = .7; R(-1.1, -.5, 2.2, .2, t('#f5d76e')); ctx.globalAlpha = 1;
    [[-3.4, -3.4], [2.2, -3.4]].forEach(([x, y], i) => {
      RR(x, y, 1.3, 1.1, .2, t('#4a3a30'));
      crBug(time + i, t, { x: x + .65, y: y + 1, k: .55, body: '#8e5530', head: '#b5733f', flip: i === 1 });
    });
    [-2.6, 2.6].forEach((x) => E(x, -1.4, .35, .3, t('#ffb3c1')));
    crScent(0, -2.6, 1.6, time, t, '#f7c27a');
  } },

  /* R3 현관: 바퀴에겐 빌딩만 한 운동화. 끈 구멍과 밑창 홈이 계단 같다 */
  'cockroach:sneaker': { w: 32, h: 11.5, d: (time, t) => {
    const up = '#5f8fb0', mid = '#f4f1ea';
    ctx.globalAlpha = .2; E(0, -.05, 13.4, .45, t(INK)); ctx.globalAlpha = 1;
    RR(-13.2, -1.4, 26.4, 1.4, .7, t('#a29fb2'));
    for (let x = -12.4; x < 12.6; x += 1.4) RR(x, -.5, .8, .5, .2, t('#7d7a8c'));
    ctx.fillStyle = t(shade(mid)); ctx.beginPath(); ctx.moveTo(-13.2, -1.2); ctx.lineTo(12.4, -1.2);
    ctx.quadraticCurveTo(13.8, -1.4, 13.4, -3.2); ctx.lineTo(-13, -3.2); ctx.quadraticCurveTo(-13.8, -2, -13.2, -1.2); ctx.fill();
    ctx.fillStyle = t(mid); ctx.beginPath(); ctx.moveTo(-13, -1.8); ctx.lineTo(12.4, -1.8); ctx.quadraticCurveTo(13.6, -2, 13.3, -3.3); ctx.lineTo(-13, -3.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t(shade(up)); ctx.beginPath(); ctx.moveTo(-13, -3.2);
    ctx.bezierCurveTo(-13.6, -7.6, -12.4, -10.4, -10, -10.4); ctx.quadraticCurveTo(-7, -10, -5.4, -8.6);
    ctx.lineTo(1.6, -7.6); ctx.bezierCurveTo(7, -7, 12.4, -5.6, 13.2, -3.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t(up); ctx.beginPath(); ctx.moveTo(-12.4, -3.4);
    ctx.bezierCurveTo(-12.8, -7.4, -11.8, -10, -10, -10); ctx.quadraticCurveTo(-7.2, -9.6, -5.6, -8.4);
    ctx.lineTo(1.6, -7.4); ctx.bezierCurveTo(6.6, -6.8, 11.4, -5.4, 12.4, -3.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t(mid); ctx.beginPath(); ctx.moveTo(7, -3.4); ctx.bezierCurveTo(8.6, -6.4, 11.8, -5.4, 12.6, -3.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t('#3b5f80'); ctx.beginPath(); ctx.moveTo(-10.6, -3.4); ctx.quadraticCurveTo(-4, -6.6, 4.6, -4.4); ctx.lineTo(4.2, -3.4); ctx.closePath(); ctx.fill();
    RR(-12.6, -10.2, 2.4, 3.4, .8, t('#e6765f'));
    ctx.fillStyle = t(mix(up, '#ffffff', .25)); ctx.beginPath(); ctx.moveTo(-6, -8.5); ctx.quadraticCurveTo(-4.5, -11.4, -1.6, -10.6); ctx.lineTo(1.4, -7.6); ctx.closePath(); ctx.fill();
    [-4.6, -2.6, -.6].forEach((x, i) => {
      E(x, -8.1 + i * .22, .32, .26, t('#2f3a4f'));
      L(x, -8.1 + i * .22, x + 1.8, -9.4 + i * .3, t('#fffaf0'), .38);
    });
    ctx.globalAlpha = .45; RR(-11, -9.2, 7, .3, .15, WHITE); ctx.globalAlpha = 1;
    E(-14.2, -.25, .5, .25, t('#d9c39b')); E(-15.1, -.2, .35, .2, t('#cdb48a'));
  } },
  /* R3: 신발장 밑 1cm 틈. 먼지 뭉치와 모래알 */
  'cockroach:cabinetGap': { w: 14.5, h: 22.5, d: (time, t) => {
    block(-7, -22, 14, 20.8, '#c99a6e', t);
    R(-7, -1.2, 14, 1.2, t('#2f2a3a')); RR(-7, -1.2, 1.2, 1.2, .2, t('#a77c56')); RR(5.8, -1.2, 1.2, 1.2, .2, t('#a77c56'));
    RR(4.4, -12, .5, 3, .25, t('#e9e4ec'));
    [[-3.6, .45], [-.4, .35], [2.6, .5]].forEach(([x, r], i) => {
      const b = Math.sin(time * 1.2 + i) * .03;
      [[-.3, 0], [.25, -.1], [0, -.3], [.35, .1]].forEach(([dx, dy]) => E(x + dx * r * 2, -r + dy * r + b, r * .7, r * .6, t('#b8b2bd')));
    });
    [-5.2, -4.8, 1.1, 4.6].forEach((x) => E(x, -.08, .1, .08, t('#d9c39b')));
  } },

  /* R4 불 꺼진 부엌: 냉장고 뒤 웅웅대는 모터와 방열 코일. 따뜻하다 */
  'cockroach:motorGrille': { w: 37, h: 27, d: (time, t) => {
    const glow = .3 + Math.sin(time * 2) * .06;
    ctx.globalAlpha = glow; E(6, -1, 12, 1.2, t('#ffb36b')); E(6, -5, 8, 6, t('#ffcf8a')); ctx.globalAlpha = 1;
    RR(-14, -26, 1, 24, .4, t('#6b6478')); RR(13, -26, 1, 24, .4, t('#6b6478'));
    for (let y = -24; y <= -6; y += 2.2) RR(-13, y, 26, .7, .35, t('#3a3445'));
    for (let x = -11; x <= 11; x += 2.8) L(x, -24.5, x, -5.5, t('#8d8a9c'), .15);
    E(7, -3.2, 4.6, 3.2, t('#4a4258')); E(5.6, -4.6, 1.6, .7, t('#6b6478'));
    RR(-1, -2.2, 3.5, 1.4, .3, t('#6b6478'));
    [-.15, .15].forEach((d, i) => {
      ctx.save(); ctx.globalAlpha = .5; ctx.strokeStyle = t('#ffd56b'); ctx.lineWidth = .18; ctx.beginPath();
      ctx.arc(7, -3.4, 5.6 + i * 1.1 + Math.sin(time * 12 + i) * .15, -1.2 + d, -.5 + d); ctx.stroke(); ctx.restore();
    });
    crScent(-4, -6, 3, time, t, '#ffb27a');
    [-10, -6.4, -2.2].forEach((x, i) => E(x, -.2, .28 + hash(i, 8) * .2, .2, t('#e0b47a')));
  } },
  /* R4: 싱크대 거름망에서 떨어지는 물방울과 젖은 밥알 */
  'cockroach:sinkDrip': { w: 6, h: 14, d: (time, t) => {
    const u = crCycle(time, .7, 0, 1), y = -14 + u * u * 14;
    E(0, y, .22, .32, t('#bfe3f5')); E(-.07, y - .1, .06, .08, WHITE);
    ctx.globalAlpha = .6; E(0, -.04, 1.6 + (u > .9 ? .4 : 0), .14, t('#9fd0ff')); ctx.globalAlpha = 1;
    E(1.3, -.2, .38, .2, t('#fbf7ee')); E(-1.4, -.18, .34, .18, t('#fbf7ee'));
    RR(1.9, -.22, 1, .2, .1, t('#7fb08a'));
    crScent(1.4, -.6, 2.4, time, t, '#b8c77a');
  } },

  /* R5 하얀 동그란 통: 입구 구멍이 뚫린 먹이형 살충제 통 */
  'cockroach:baitDisc': { w: 6, h: 3.5, d: (time, t) => {
    ctx.globalAlpha = .25; E(0, -.03, 2.8, .12, t(INK)); ctx.globalAlpha = 1;
    RR(-2.5, -1.25, 5, 1.25, .35, t('#ece8e1')); E(0, -1.25, 2.5, .38, t('#fbfaf6')); E(0, -1.3, 1.1, .16, t('#e6e1d8'));
    [-1.9, -.8, .3, 1.4].forEach((x) => RR(x, -.75, .5, .55, .22, t('#3b3049')));
    E(-.55, -.3, .14, .08, t('#f2b04a'));
    crScent(-.6, -1.6, 1.5, time, t, '#ffb98a');
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
  /* R6: 화장실 바닥 배수구. 물방울이 떨어지고, 거름 틈에서 뭔가 다리가 삐죽 */
  'cockroach:bathDrain': { w: 12.5, h: 15, d: (time, t) => {
    ctx.globalAlpha = .4; E(0, -.05, 6, .5, t('#bfe3f5')); ctx.globalAlpha = 1;
    E(0, -.1, 4.5, .9, t('#c9cfd6')); E(0, -.12, 3.6, .65, t('#2f2a3a'));
    for (let x = -3; x <= 3; x += 1) L(x, -.12 - .5 * Math.sqrt(1 - (x / 3.6) ** 2), x, -.12 + .5 * Math.sqrt(1 - (x / 3.6) ** 2), t('#9aa5aa'), .22);
    const u = crCycle(time, .55, 0, 1);
    if (u < .8) { const y = -14 + (u / .8) ** 2 * 13.8; E(.8, y, .25, .35, t('#bfe3f5')); E(.72, y - .1, .07, .09, WHITE); }
    else { ctx.save(); ctx.globalAlpha = 1 - (u - .8) * 5; ctx.strokeStyle = t('#dff0ff'); ctx.lineWidth = .1;
      ctx.beginPath(); ctx.ellipse(.8, -.15, 1 + (u - .8) * 10, .2 + (u - .8), 0, 0, TAU); ctx.stroke(); ctx.restore(); }
    const tw = Math.sin(time * 9) * .1;
    L(-2.1, -.2, -2.4 + tw, -1.1, t('#c49a5a'), .06); L(-1.7, -.2, -1.6 - tw, -.95, t('#c49a5a'), .06);
  } },

  /* R7 연막탄: 치익 소리와 함께 바닥부터 차오르는 하얀 연기 */
  'cockroach:smokeBomb': { w: 27, h: 18, d: (time, t) => {
    ctx.save(); ctx.globalAlpha = .55; RR(-11, -1.6, 22, 1.6, .8, t('#f4f8ff')); ctx.restore();
    RR(-2.2, -8, 4.4, 8, 1, t('#e6765f')); R(-2.2, -5.6, 4.4, 2.2, t('#ffd56b')); R(1.4, -8, .8, 8, t(shade('#e6765f')));
    RR(-2.4, -8.7, 4.8, .9, .4, t('#9aa5aa')); RR(-.5, -9.5, 1, .9, .3, t('#6b6478'));
    for (let i = 0; i < 12; i++) {
      const u = crCycle(time, .22, i, 12), r = .8 + u * 3.2;
      ctx.globalAlpha = .75 * (1 - u * .7);
      E((i % 2 ? -1 : 1) * u * 8 + Math.sin(i * 2.1) * 1.5, -10 - u * 4 - Math.sin(u * 3) * 2, r, r * .8, t('#f4f8ff'));
    }
    ctx.globalAlpha = 1;
    [0, 1, 2].forEach((i) => L(.8 + i * .5, -10 - i * .3, 1.4 + i * .6, -10.8 - i * .5 + Math.sin(time * 30 + i) * .1, t('#c9c4cc'), .08));
  } },
  /* R7: 위로, 밖으로 우르르. 배관을 타고 오르는 애와 내달리는 애 */
  'cockroach:fleeingRoaches': { w: 6.5, h: 16.5, d: (time, t) => {
    RR(1.6, -16, 1.3, 16, .6, t('#b9c3c7')); R(2.5, -16, .4, 16, t(shade('#b9c3c7')));
    RR(1.3, -5, 1.9, .6, .2, t('#9aa5aa'));
    const climb = (time * 1.5) % 6;
    ctx.save(); ctx.translate(1.5, -3 - climb); ctx.rotate(-Math.PI / 2);
    crBug(time, t, { x: 0, y: 0, k: 1, body: '#b5733f', head: '#d49a62', run: true }); ctx.restore();
    crBug(time + .7, t, { x: -1.6, y: 0, k: 1, body: '#a8683a', head: '#d49a62', run: true, flip: true });
    [-.4, -.6].forEach((y, i) => L(-.6 + i * .2, y, .3 + i * .2, y, t('#c9c4cc'), .05));
    E(-1.2, -1, .08, .12, t('#bfe3f5'));
  } },

  /* R8 한겨울 이삿짐: 테이프 붙인 상자 더미와 열린 문으로 들이치는 찬바람 */
  'cockroach:movingBoxes': { w: 31, h: 28.5, d: (time, t) => {
    block(-13, -14, 20, 14, '#d9a96a', t); block(-9.5, -27.5, 16, 13.5, '#e0b47a', t);
    ctx.globalAlpha = .75; R(-13, -14.6, 17, 1.2, t('#c9b28a')); R(-3.4, -27.5, 3, 13.5, t('#c9b28a')); ctx.globalAlpha = 1;
    [[-10.5, -9], [-8.5, -9]].forEach(([x, y]) => { P([[x, y - 1.4], [x + .7, y - .4], [x - .7, y - .4]], t('#8a5a3e')); R(x - .2, y - .5, .4, 1.4, t('#8a5a3e')); });
    for (let i = 0; i < 9; i++) {
      const u = crCycle(time, .18, i, 9), x = 9 + hash(i, 3) * 6 + Math.sin(time * 2 + i) * .8, y = -26 + u * 25;
      ctx.globalAlpha = .8; E(x, y, .25, .25, t('#f4f8ff'));
    }
    ctx.globalAlpha = .3 + Math.sin(time * 2) * .15; [-6, -12].forEach((y, i) => L(15 - i * 2, y, 10 - i * 2, y + .4, t('#dff0ff'), .15)); ctx.globalAlpha = 1;
  } },
  /* R8: 다리를 하나 뜯어 간 상자 테이프. 반투명한 겹, 종이 심, 끈끈하게 늘어진 끝자락 */
  'cockroach:tapeRoll': { w: 13.5, h: 5, d: (time, t) => {
    const tape = '#e8c27a';
    ctx.globalAlpha = .2; E(0, -.05, 2.8, .2, t(INK)); ctx.globalAlpha = 1;
    ctx.globalAlpha = .75; ctx.fillStyle = t(tape); ctx.beginPath(); ctx.moveTo(-1.5, -.8);
    ctx.quadraticCurveTo(-4, -.1, -6.6, 0); ctx.lineTo(-6.6, -.06); ctx.quadraticCurveTo(-4, -.3, -1.2, -1.4); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    E(.25, -2.4, 2.45, 2.45, t(shade(tape)));
    ctx.globalAlpha = .9; E(0, -2.4, 2.45, 2.45, t(tape)); ctx.globalAlpha = 1;
    ctx.strokeStyle = t(mix(tape, '#ffffff', .35)); ctx.lineWidth = .05; ctx.globalAlpha = .6; ctx.beginPath();
    [2.1, 1.85, 1.65].forEach((r) => { ctx.moveTo(r, -2.4); ctx.arc(0, -2.4, r, 0, TAU); }); ctx.stroke(); ctx.globalAlpha = 1;
    E(0, -2.4, 1.5, 1.5, t('#c99a6e')); E(0, -2.4, 1.22, 1.22, t('#5a4a40')); E(.2, -2.25, 1.05, 1.05, t('#3e322c'));
    ctx.globalAlpha = .7; ctx.strokeStyle = WHITE; ctx.lineWidth = .16; ctx.beginPath(); ctx.arc(0, -2.4, 2.15, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke(); ctx.globalAlpha = 1;
    L(-5.4, -.1, -3.6, -.36, WHITE, .05);
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

  /* K1 식당의 밤: 튀김기와 스테인리스 다리. 아래로 기름이 똑 */
  'cockroach:fryer': { w: 29.5, h: 43, d: (time, t) => {
    RR(-14, -40, 1.6, 40, .8, t('#b9c3c7')); E(-13.2, -.2, 1.3, .3, t('#8d8a9c'));
    block(-8, -42, 22, 30, '#c9cfd6', t);
    RR(-8, -12.5, 22, 1, .4, t('#8d8a9c'));
    [-6.5, 11].forEach((x) => { RR(x, -12, 1.2, 11, .5, t('#9aa5aa')); E(x + .6, -.4, 1, .4, t('#6b6478')); });
    ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 8;
    [-1, 1.5, 4, 6.5].forEach((x, i) => E(x, -11.2 + Math.sin(time * 14 + i) * .08, .4, .7, t('#8fc3ff')));
    ctx.restore();
    const u = crCycle(time, .5, 0, 1);
    E(9, -11.5 + u * u * 11.2, .2, .28, t('#e8b84a'));
    ctx.globalAlpha = .6; E(9, -.05, 3, .2, t('#e8b84a')); ctx.globalAlpha = 1;
    crScent(3, -13, 3, time, t, '#ffd08a');
  } },
  /* K1: 바닥에 식어 굳은 기름 웅덩이와 튀김 부스러기 */
  'cockroach:oilPuddle': { w: 5, h: 2.1, d: (time, t) => {
    ctx.globalAlpha = .7; E(0, -.06, 2.4, .18, t('#e8b84a')); ctx.globalAlpha = 1;
    E(-.8, -.12, .7, .05, WHITE);
    [[1.2, .35], [1.7, .28], [1.45, .5]].forEach(([x, r]) => E(x, -r, r, r * .8, t('#e9b35f')));
    E(1.35, -.6, .12, .08, t('#fff3b8'));
    crScent(.4, -.6, 1.4, time, t, '#ffd08a');
  } },

  /* 엔딩 가해자 */
  /* D1 단내: 연못만 한 젤 한 방울 */
  'cockroach:gelDrop': { w: 2.5, h: 3.5, d: (time, t) => {
    const k = 1 + Math.sin(time * 2.5) * .04;
    ctx.globalAlpha = .9; E(0, -.12, 1.25, .16, t('#e8a23a')); E(0, -.55 * k, 1, .55 * k, t('#f2b04a')); ctx.globalAlpha = 1;
    E(-.35, -.8 * k, .3, .12, WHITE); E(.3, -.35, .1, .06, WHITE);
    crScent(0, -1.3, 1.8, time, t, '#ffb98a');
  } },
  /* D2 종이집 안: 지붕 아래 끈끈한 바닥, 먼저 붙은 친구들 */
  'cockroach:stuckInHouse': { w: 13.5, h: 9, d: (time, t) => {
    P([[-6.4, -5], [0, -8.8], [6.4, -5]], t('#e6765f')); P([[-5.6, -5.2], [0, -8.2], [5.6, -5.2]], t('#f6efe0'));
    RR(-6.2, -5.2, .5, 5.2, .2, t('#f6efe0')); RR(5.7, -5.2, .5, 5.2, .2, t(shade('#f6efe0')));
    crBug(time, t, { x: -3.4, k: .9, body: '#8e5530', head: '#b5733f' });
    crBug(time + 2, t, { x: 3, k: .9, body: '#8e5530', head: '#b5733f', flip: true });
    ctx.globalAlpha = .65; RR(-6, -.2, 12, .24, .1, t('#f5d76e')); ctx.globalAlpha = 1;
    [-4, -1.5, 1.8, 4.2].forEach((x) => E(x, -.17, .3, .03, WHITE));
    [-.35, -.05, .25].forEach((x, i) => L(x, -.02, x + Math.sin(time * 18 + i) * .03, -.22, t('#f5d76e'), .04));
  } },
  /* D3 슬리퍼: 머리 위로 내려오는 거대한 욕실 슬리퍼. 밑창 홈이 하늘을 가린다 */
  'cockroach:slipperSole': { w: 29, h: 16, d: (time, t) => {
    const drop = Math.abs(Math.sin(time * 3)) * .5, sole = '#ff8fa3', bed = '#ffd56b';
    ctx.globalAlpha = .18 + drop * .2; E(0, -.05, 12 - drop * 4, .5, t(INK)); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(0, drop - 4); ctx.rotate(-.05);
    const outline = (dy) => {
      ctx.beginPath(); ctx.moveTo(-13.4, -2 + dy); ctx.quadraticCurveTo(-14.6, 1 + dy, -12, 1.4 + dy);
      ctx.lineTo(10, 1.4 + dy); ctx.bezierCurveTo(14, 1.4 + dy, 15.2, -1.4 + dy, 13.6, -2.6 + dy); ctx.lineTo(-13.4, -2.6 + dy); ctx.closePath();
    };
    outline(.5); ctx.fillStyle = t(shade(sole)); ctx.fill();
    outline(0); ctx.fillStyle = t(sole); ctx.fill();
    for (let x = -11.5; x <= 11.5; x += 1.6) RR(x - .4, .6, .8, .9, .3, t(shade(shade(sole))));
    ctx.globalAlpha = .4; RR(-12, -2.2, 22, .3, .15, WHITE); ctx.globalAlpha = 1;
    ctx.fillStyle = t(shade(bed)); ctx.beginPath(); ctx.moveTo(-13.2, -2.6); ctx.lineTo(13.4, -2.6); ctx.quadraticCurveTo(13.6, -3.6, 12, -3.6); ctx.lineTo(-12.4, -3.6); ctx.quadraticCurveTo(-13.6, -3.4, -13.2, -2.6); ctx.fill();
    const strap = (dy, w, c) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(.2, -3.2 + dy); ctx.bezierCurveTo(1.6, -8.4 + dy, 11, -8.4 + dy, 12.4, -3.2 + dy); ctx.stroke(); };
    strap(.3, 2.4, t(shade(bed))); strap(0, 2, t(bed));
    ctx.globalAlpha = .5; ctx.strokeStyle = WHITE; ctx.lineWidth = .25; ctx.beginPath(); ctx.moveTo(2.2, -5.8); ctx.bezierCurveTo(3.4, -8.4, 6, -8.6, 7.6, -8.4); ctx.stroke(); ctx.globalAlpha = 1;
    [[3, -6.6], [5.2, -7.9], [7.6, -7.9], [9.8, -6.6]].forEach(([x, y]) => { E(x, y, .32, .32, t(shade(shade(bed)))); E(x - .06, y - .06, .18, .18, t('#fff3b8')); });
    ctx.restore();
    ctx.globalAlpha = .6; [-8, -2, 4, 10].forEach((x, i) => L(x, -15.5 + i % 2, x, -12.2 + i % 2, t('#c9c4cc'), .22)); ctx.globalAlpha = 1;
  } },
  /* D7 아래층도 연기: 연막탄 그림 재사용 */
  /* D8 빈집의 겨울: 휑한 바닥에 서리, 부스러기 위에도 하얗게 */
  'cockroach:coldDraft': { w: 14.5, h: 10, d: (time, t) => {
    [[-1.5, .5], [-.7, .35], [-1.1, .7]].forEach(([x, r]) => { E(x, -r, r, r * .8, t('#e0b47a')); E(x, -r * 1.6, r * .7, r * .25, t('#f4f8ff')); });
    for (let x = -5; x <= 6; x += 1.3) P([[x, 0], [x + .15, -.5 - hash(x, 2) * .4], [x + .3, 0]], t('#e6f3ff'));
    for (let i = 0; i < 10; i++) {
      const u = crCycle(time, .2, i, 10), x = -6 + hash(i, 4) * 13 + Math.sin(time * 1.5 + i) * .5, y = -9.5 + u * 9, r = .18;
      L(x - r, y, x + r, y, t('#f4f8ff'), .06); L(x, y - r, x, y + r, t('#f4f8ff'), .06);
    }
    ctx.globalAlpha = .25 + Math.sin(time * 1.7) * .15; [-3, -6].forEach((y, i) => L(6 - i * 2, y, 1 - i * 2, y + .4, t('#dff0ff'), .12)); ctx.globalAlpha = 1;
  } },
  /* D9 형광등 아래: 밝은 빛을 뚫고 내려오는 손. 구겨 쥔 휴지가 치맛자락처럼 퍼진다 */
  'cockroach:tissueHand': { w: 20, h: 37, d: (time, t) => {
    const y = Math.sin(time * 2) * .5;
    ctx.globalAlpha = .22; P([[-3, -36], [3, -36], [10, 0], [-10, 0]], t('#fff8d8')); ctx.globalAlpha = 1;
    ctx.globalAlpha = .18 + y * .04; E(0, -.1, 6 - y, .5, t(INK)); ctx.globalAlpha = 1;
    ctx.save(); ctx.translate(0, y);
    const tissue = '#fbfaf6', fold = t(shade(tissue));
    ctx.fillStyle = fold; ctx.beginPath(); ctx.moveTo(-2.6, -17);
    ctx.bezierCurveTo(-5.5, -12, -6.4, -6, -5.6, -2.6); ctx.quadraticCurveTo(-4.2, -1.4, -3, -2.4); ctx.quadraticCurveTo(-1.8, -1, -.4, -2);
    ctx.quadraticCurveTo(1, -.8, 2.4, -2.2); ctx.quadraticCurveTo(3.8, -1.2, 5.2, -2.8); ctx.bezierCurveTo(6, -6, 5.2, -12, 2.6, -17); ctx.closePath(); ctx.fill();
    ctx.fillStyle = t(tissue); ctx.beginPath(); ctx.moveTo(-2.6, -17.4);
    ctx.bezierCurveTo(-5.2, -12, -5.8, -6.4, -5, -3.2); ctx.quadraticCurveTo(-3.8, -2.2, -2.8, -3); ctx.quadraticCurveTo(-1.6, -1.8, -.4, -2.7);
    ctx.quadraticCurveTo(.9, -1.6, 2.2, -2.8); ctx.quadraticCurveTo(3.4, -2, 4.4, -3.4); ctx.bezierCurveTo(4.8, -6.4, 4.2, -12, 2.6, -17.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = fold; ctx.lineWidth = .14; ctx.lineCap = 'round'; ctx.beginPath();
    [[-2.6, -15, -3.6, -4], [-.4, -15.5, -.6, -3.4], [1.6, -15, 2.4, -3.6], [-1.6, -11, -1.2, -7]].forEach(([x1, y1, x2, y2]) => {
      ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2 + .6, (y1 + y2) / 2, x2, y2);
    });
    ctx.stroke();
    ctx.globalAlpha = .7; E(-3.4, -9, .5, 3, WHITE); ctx.globalAlpha = 1;
    artHandAt(t, -.2, -17.4, Math.PI / 2 - .12, 15, { pose: 'grip', sleeve: '#5f8fb0' });
    ctx.restore();
  } },
  /* D10 거품 물: 쏟아져 들어오는 설거지 물과 세제 거품 */
  'cockroach:soapFlood': { w: 16.5, h: 6, d: (time, t) => {
    ctx.save(); ctx.globalAlpha = .62; ctx.fillStyle = t('#bfe3f5'); ctx.beginPath(); ctx.moveTo(-8, 0);
    for (let x = -8; x <= 8; x += .5) ctx.lineTo(x, -.9 - (x + 8) * .12 - Math.sin(x * .9) * Math.sin(time * 3) * .2);
    ctx.lineTo(8, 0); ctx.closePath(); ctx.fill(); ctx.restore();
    for (let i = 0; i < 9; i++) {
      const x = -7 + i * 1.8, r = .3 + hash(i, 6) * .35;
      E(x, -1.05 - (x + 8) * .12, r, r, t('#fbfdff')); E(x - r * .3, -1.05 - (x + 8) * .12 - r * .35, r * .25, r * .25, WHITE);
    }
    for (let i = 0; i < 5; i++) {
      const u = crCycle(time, .3, i, 5), r = .2 + hash(i, 9) * .2;
      ctx.save(); ctx.globalAlpha = .7 * (1 - u); ctx.strokeStyle = WHITE; ctx.lineWidth = .05;
      ctx.beginPath(); ctx.arc(-5 + i * 2.4, -2 - u * 4, r, 0, TAU); ctx.stroke(); ctx.restore();
    }
  } },
});
