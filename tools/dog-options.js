/* 개발용: 들개 디자인 시안 4종을 한 장에 그린다. 게임에서는 불러오지 않는다.
   tools/shoot.sh out.png "$(cat tools/dog-options.js); dogOptionsSheet()" 1600x1300 */
const DOG_COATS = Object.freeze({
  hwang: { fur: '#e3a96b', dark: '#c98a4c', cream: '#fbeedb' },
  white: { fur: '#f3eee6', dark: '#d8cfc0', cream: '#ffffff' },
  black: { fur: '#4c4553', dark: '#38323f', cream: '#d9cfc3' },
});

function dogMotion(time, moving) {
  const w = moving ? time * 10 : 0;
  return { w, bob: moving ? Math.abs(Math.sin(w)) * 1.2 : Math.sin(time * 2) * .4, wag: Math.sin(time * (moving ? 9 : 5)) * 2.5 };
}

function dogLegs(w, colors, width = 6.5, height = 11, paws) {
  [[-12, 0], [-5, Math.PI], [7, Math.PI], [13, 0]].forEach(([lx, ph], i) => {
    const x = lx + Math.sin(w + ph) * 2.5 - width / 2;
    RR(x, -height, width, height, width / 2, colors[i % 2]);
    if (paws) E(x + width / 2, -1.2, width * .55, 1.6, paws);
  });
}

/* A 동글 강아지: 고양이 주인공과 같은 비율. 한쪽 귀가 접힌 황구 */
function dogOptionA(time, moving, t, c) {
  const { w, bob, wag } = dogMotion(time, moving), fur = t(c.fur), dark = t(c.dark), cream = t(c.cream);
  ctx.strokeStyle = fur; ctx.lineWidth = 5.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-15, -20 - bob); ctx.quadraticCurveTo(-27, -24, -24 + wag, -34); ctx.stroke();
  dogLegs(w, [dark, fur], 6.5, 11, cream);
  E(0, -18 - bob, 19, 12, fur); E(3, -13 - bob, 12, 6, cream);
  const hx = 17, hy = -35 - bob;
  P([[hx - 12, hy - 6], [hx - 7, hy - 13], [hx - 15, hy + 5]], dark);
  P([[hx + 4, hy - 9], [hx + 11, hy - 18], [hx + 13, hy - 5]], fur); P([[hx + 6, hy - 9], [hx + 10.5, hy - 14.5], [hx + 11.5, hy - 7]], t('#ff9aa8'));
  E(hx, hy, 13.5, 12, fur);
  E(hx + 6, hy + 5, 7.5, 5.2, cream);
  cuteEye(hx - 2.5, hy - 1, 2.6, 2.2, time, t); cuteEye(hx + 7, hy - 1.5, 2.6, 2.2, time, t);
  blush(hx - 7, hy + 4.5, 2.4, 1.5); blush(hx + 12.5, hy + 4, 2, 1.3);
  E(hx + 10.5, hy + 2.6, 2.2, 1.6, t(INK));
  if (moving) E(hx + 8, hy + 9.2, 1.5, 2.1, t('#ff8fa0'));
}

/* B 진도 꼬마: 쫑긋 선 세모 귀, 동그랗게 말린 꼬리, 흰 가슴과 흰 양말 */
function dogOptionB(time, moving, t, c) {
  const { w, bob, wag } = dogMotion(time, moving), fur = t(c.fur), dark = t(c.dark), cream = t(c.cream);
  ctx.strokeStyle = fur; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-17 + wag * .3, -30 - bob, 5.5, Math.PI * .2, Math.PI * 1.95); ctx.stroke();
  ctx.strokeStyle = cream; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(-17 + wag * .3, -30 - bob, 5.5, Math.PI * 1.1, Math.PI * 1.7); ctx.stroke();
  dogLegs(w, [dark, fur], 6, 12, cream);
  RR(-18, -27 - bob, 36, 16, 8, fur); E(9, -16 - bob, 9, 6.5, cream);
  const hx = 16, hy = -34 - bob;
  P([[hx - 10, hy - 6], [hx - 7, hy - 19], [hx - 1, hy - 9]], fur); P([[hx - 8, hy - 8], [hx - 6.5, hy - 15], [hx - 3, hy - 9]], t('#ff9aa8'));
  P([[hx + 2, hy - 10], [hx + 8, hy - 20], [hx + 11, hy - 6]], fur); P([[hx + 4, hy - 10], [hx + 8, hy - 16.5], [hx + 9.5, hy - 8]], t('#ff9aa8'));
  E(hx, hy, 12.5, 11, fur);
  E(hx + 5, hy + 5, 8, 5, cream); E(hx - 2, hy + 6, 6, 3.6, cream);
  cuteEye(hx - 3, hy - 1, 2.4, 2.1, time, t); cuteEye(hx + 6.5, hy - 1.5, 2.4, 2.1, time, t);
  blush(hx - 7.5, hy + 3.5, 2.2, 1.4); blush(hx + 11, hy + 3, 2, 1.3);
  E(hx + 9.5, hy + 2.5, 2.1, 1.5, t(INK));
  if (moving) E(hx + 7, hy + 8.6, 1.4, 2, t('#ff8fa0'));
}

/* C 복슬이: 뭉게뭉게한 털, 길게 늘어진 귀, 앞머리에 반쯤 가린 눈 */
function dogOptionC(time, moving, t, c) {
  const { w, bob, wag } = dogMotion(time, moving), fur = t(c.fur), dark = t(c.dark), cream = t(c.cream);
  E(-20 + wag * .3, -29 - bob, 5.5, 5.5, fur);
  dogLegs(w, [dark, fur], 7, 10);
  const puffs = (cx, cy, rx, ry, n, r, color) => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; E(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, r, r, color); } };
  puffs(0, -19 - bob, 17, 9, 12, 5, fur); E(0, -19 - bob, 17, 10, fur);
  const hx = 16, hy = -34 - bob;
  ctx.save(); ctx.translate(hx + 4, hy - 6); ctx.rotate(-.35); E(0, 6, 3.6, 7.5, dark); ctx.restore();
  puffs(hx, hy, 10.5, 9.5, 10, 4, fur); E(hx, hy, 11.5, 10.5, fur);
  E(hx + 6, hy + 5, 6.5, 4.6, cream);
  cuteEye(hx - 1.5, hy, 2.2, 1.9, time, t); cuteEye(hx + 7, hy - .5, 2.2, 1.9, time, t);
  puffs(hx + 1, hy - 7, 6, 1.5, 6, 3.4, fur);
  ctx.save(); ctx.translate(hx - 8, hy - 4); ctx.rotate(.3); E(0, 7, 4.5, 9, dark); ctx.restore();
  blush(hx - 5, hy + 5, 2.2, 1.4);
  E(hx + 10.5, hy + 3, 2, 1.5, t(INK));
}

/* D 종이 기하: 모뉴먼트 밸리처럼 면으로 접은 개. 그림자 면 하나, 점 눈 하나 */
function dogOptionD(time, moving, t, c) {
  const { w, bob, wag } = dogMotion(time, moving), fur = t(c.fur), dark = t(c.dark), cream = t(c.cream);
  P([[-17, -24 - bob], [-25 + wag * .5, -37 - bob], [-21, -23 - bob]], dark);
  [[-12, 0], [-5, Math.PI], [7, Math.PI], [13, 0]].forEach(([lx, ph], i) => RR(lx + Math.sin(w + ph) * 2.2 - 2, -12, 4, 12, 1, i % 2 ? fur : dark));
  P([[-19, -27 - bob], [12, -29 - bob], [17, -12 - bob], [-17, -11 - bob]], fur);
  P([[-17, -11 - bob], [17, -12 - bob], [15, -15 - bob], [-18, -15 - bob]], dark);
  P([[6, -27 - bob], [12, -29 - bob], [17, -12 - bob], [9, -12 - bob]], cream);
  const hx = 16, hy = -34 - bob;
  P([[hx - 8, hy - 6], [hx - 5, hy - 17], [hx, hy - 8]], dark); P([[hx + 1, hy - 9], [hx + 6, hy - 18], [hx + 9, hy - 7]], fur);
  E(hx, hy, 10, 10, fur);
  P([[hx + 2, hy - 1], [hx + 14, hy + 1], [hx + 14, hy + 7], [hx + 2, hy + 8]], cream);
  P([[hx + 2, hy + 5], [hx + 14, hy + 5], [hx + 14, hy + 7], [hx + 2, hy + 8]], t(c.dark === DOG_COATS.white.dark ? '#e6ddd0' : c.cream));
  E(hx + 2, hy - 2, 1.6, 1.6, t(INK));
  RR(hx + 12, hy, 3, 2.4, .8, t(INK));
}

const DOG_OPTIONS = Object.freeze([
  ['A  동글 강아지', '고양이 주인공과 같은 비율. 한쪽 귀가 접힌 황구', dogOptionA],
  ['B  진도 꼬마', '쫑긋 선 세모 귀, 말린 꼬리, 흰 가슴·흰 양말', dogOptionB],
  ['C  복슬이', '뭉게뭉게 털, 늘어진 귀, 앞머리에 반쯤 가린 눈', dogOptionC],
  ['D  종이 기하', '면을 접은 듯한 각진 실루엣, 점 눈 (모뉴먼트 밸리 쪽)', dogOptionD],
]);

function dogOptionsSheet() {
  stopLoop();
  $('picker').hidden = true; hideCard(); hideCaption(); closeWall(); updateHud(null, null);
  const cols = [['황구 · 서 있기', 'hwang', false], ['황구 · 걷기', 'hwang', true], ['흰둥이 (무리)', 'white', false], ['검둥이 (무리 대장)', 'black', false]];
  const head = 80, labelW = 330, rows = DOG_OPTIONS.length, cw = (W - labelW) / cols.length, ch = (H - head) / rows;
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#3b3049'; ctx.font = '20px sans-serif'; ctx.fillText('들개 디자인 시안', 20, 34);
  ctx.font = '13px sans-serif'; ctx.fillStyle = '#85798f'; ctx.fillText('이름 옆 작은 그림은 지금의 길고양이 (같은 비율로 비교). 고른 시안을 주인공과 무리 개들에 모두 적용해요', 20, 56);
  ctx.font = '14px sans-serif'; cols.forEach(([label], j) => { ctx.fillStyle = '#3b3049'; ctx.fillText(label, labelW + j * cw + 16, head - 6); });
  const s = Math.min(cw / 80, ch / 64);
  DOG_OPTIONS.forEach(([name, desc, draw], i) => {
    const y0 = head + i * ch;
    ctx.fillStyle = i % 2 ? '#ece0c9' : '#f6eedd'; ctx.fillRect(0, y0, W, ch);
    ctx.fillStyle = '#3b3049'; ctx.font = '22px sans-serif'; ctx.fillText(name, 20, y0 + 36);
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#85798f';
    desc.match(/.{1,18}/g).forEach((line, k) => ctx.fillText(line, 20, y0 + 60 + k * 17));
    paper(() => { ctx.translate(labelW - 70, y0 + ch * .9); ctx.scale(s * .75, s * .75); drawCat(2.2, false, (x) => x, CAT_COATS.hero); }, .8);
    cols.forEach(([, coat, moving], j) => {
      paper(() => { ctx.translate(labelW + j * cw + cw * .42, y0 + ch * .9); ctx.scale(s * 1.2, s * 1.2); draw(moving ? 2.35 : 2.2, moving, (x) => x, DOG_COATS[coat]); }, .8);
    });
  });
  return 'ok';
}
