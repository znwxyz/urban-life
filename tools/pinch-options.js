/* 개발용: 김밥 든 손 시안 3종 (이모지 🤏·✍️·🤌 손 구조를 참고). 게임에서는 불러오지 않는다.
   tools/shoot.sh out.png "$(cat tools/hand-options.js); $(cat tools/pinch-options.js); pinchOptionsSheet()" 1800x800 */
const PO = Object.freeze({ fold: '#d9a07a', stick: '#c98a4c' });

function poShape(skin, add) { ctx.fillStyle = skin; ctx.beginPath(); add(); ctx.fill(); }
function poLine(pts, c, w) {
  ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]); ctx.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]); ctx.stroke();
}
/** 주먹 앞쪽에 접힌 손가락 세 마디: 진한 곡선 두 줄로 나눈다 */
function poFolds(x, y, h) {
  [0, 1].forEach((i) => { const yy = y + h * (i + 1) / 3; poLine([[x - .1, yy - .02], [x - .02, yy + .03], [x + .1, yy]], PO.fold, .022); });
}
/** 주먹 앞에 볼록 나온, 안으로 말린 손가락 끝 셋 (🤏처럼). (x, y)는 맨 위 손가락 끝 */
function poCurled(x, y, gap) {
  [0, 1, 2].forEach((i) => poShape(HO.skin, () => hoOval(x + i * .012, y + i * gap, .085, gap * .62)));
  [0, 1].forEach((i) => poLine([[x - .07, y + gap * (i + .5)], [x + .02, y + gap * (i + .62)], [x + .12, y + gap * (i + .5)]], PO.fold, .02));
}

/* A 옆에서 집기 (🤏): 접은 주먹 + 위로 검지, 아래로 엄지가 나란히 뻗어 끝으로 김밥을 집는다 */
function pinchA() {
  RR(.36, -.24, .42, .48, .08, HO.sleeve);
  poShape(HO.skin, () => ctx.roundRect(-.06, -.24, .5, .5, .2));
  poCurled(-.1, -.06, .1);
  poShape(HO.skin, () => { hoBar(.02, -.2, -.36, -.2, .075); hoBar(-.36, -.2, -.43, -.12, .07); });
  hoGimbap(-.55, .0, .15);
  poShape(HO.skin, () => { hoBar(.12, .2, -.34, .19, .082); hoBar(-.34, .19, -.42, .11, .075); });
}

/* B 위에서 집어 들기 (🤌): 손등이 위, 손끝을 모아 김밥을 위에서 집어 든다 */
function pinchB() {
  ctx.save(); ctx.translate(.42, -.62); ctx.rotate(-.75); RR(-.2, -.22, .42, .44, .08, HO.sleeve); ctx.restore();
  poShape(HO.skin, () => { ctx.save(); ctx.translate(.22, -.36); ctx.rotate(-.75); ctx.roundRect(-.22, -.19, .44, .38, .17); ctx.restore(); });
  [[.17, -.2, -.02, .0], [.27, -.17, .05, .02]].forEach(([x1, y1, x2, y2]) => {
    poShape(PO.fold, () => hoBar(x1 + .015, y1 + .015, x2 + .015, y2 + .015, .07));
    poShape(HO.skin, () => hoBar(x1, y1, x2, y2, .07));
  });
  hoGimbap(.0, .17, .15);
  poShape(HO.skin, () => hoBar(.02, -.3, -.06, .02, .075));
}

/* C 젓가락으로 집기 (✍️): 연필 쥐듯 젓가락을 쥔 손, 젓가락 끝에 김밥 */
function pinchC() {
  const stick = (x1, y1, x2, y2) => { ctx.strokeStyle = PO.stick; ctx.lineWidth = .035; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  RR(.42, -.36, .4, .46, .08, HO.sleeve);
  stick(.5, -.42, -.72, -.02);
  poShape(HO.skin, () => ctx.roundRect(.04, -.34, .48, .46, .19));
  poCurled(.02, -.1, .085);
  stick(.45, -.28, -.72, .05);
  hoGimbap(-.82, .02, .14);
  poShape(HO.skin, () => hoBar(.14, -.33, -.16, -.2, .072));
  poShape(HO.skin, () => hoBar(.16, -.08, -.1, -.14, .075));
}

const PINCH_OPTIONS = Object.freeze([
  ['A  옆에서 집기', '접은 주먹 위로 검지, 아래로 엄지. 끝으로 김밥을 집는다 (🤏)', pinchA],
  ['B  위에서 집어 들기', '손등이 위, 손끝을 모아 김밥을 집어 든다 (🤌)', pinchB],
  ['C  젓가락으로 집기', '연필 쥐듯 젓가락을 쥔 손, 젓가락 끝에 김밥 (✍️)', pinchC],
]);

function pinchOptionsSheet() {
  stopLoop();
  $('picker').hidden = true; hideCard(); hideCaption(); closeWall(); updateHud(null, null);
  const head = 70, cw = W / PINCH_OPTIONS.length, ch = H - head, s = Math.min(cw / 1.9, ch / 1.5);
  ctx.fillStyle = HO.paper; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = HO.ink; ctx.font = '20px sans-serif'; ctx.fillText('김밥 든 손 시안 (1번 통통 만화 손 그림체, 살색 + 접힌 선 두 톤)', 20, 34);
  PINCH_OPTIONS.forEach(([name, desc, draw], i) => {
    const x0 = i * cw;
    ctx.fillStyle = i % 2 ? '#ece0c9' : '#f6eedd'; ctx.fillRect(x0, head, cw, ch);
    ctx.fillStyle = HO.ink; ctx.font = '19px sans-serif'; ctx.fillText(name, x0 + 16, head + 30);
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#85798f'; ctx.fillText(desc, x0 + 16, head + 50);
    paper(() => { ctx.translate(x0 + cw * .58, head + ch * .58); ctx.scale(s, s); draw(); }, .7);
  });
  return 'ok';
}
