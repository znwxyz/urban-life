/* 개발용: 손 그림 시안 6종. 게임에서는 불러오지 않는다.
   tools/shoot.sh out.png "$(cat tools/hand-options.js); handOptionsSheet()" 1800x1150 */
const HO = Object.freeze({ skin: '#f3c9a4', skinDark: '#dba783', sleeve: '#8fb3d9', ink: '#3b3049', paper: '#f3ead8' });

/** 두 점을 잇는 둥근 막대를 지금 경로에 더한다 (같은 색으로 한 번에 칠하면 실루엣 하나가 된다) */
function hoBar(x1, y1, x2, y2, r) {
  const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1);
  ctx.save(); ctx.translate(x1, y1); ctx.rotate(a); ctx.roundRect(-r, -r, len + r * 2, r * 2, r); ctx.restore();
}
function hoOval(x, y, rx, ry) { ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); }

/* 손 모양(경로). 편 손: 손목이 아래(0, .2), 손가락이 위. 집은 손: 손목이 오른쪽, 손끝이 왼쪽 (-.45, .08)에서 만난다 */
const HAND_SHAPES = {
  open: {
    full() {
      ctx.roundRect(-.3, -.36, .6, .56, .2);
      hoBar(-.2, -.3, -.27, -.76, .085); hoBar(-.07, -.32, -.08, -.86, .088);
      hoBar(.07, -.32, .1, -.8, .085); hoBar(.2, -.28, .28, -.64, .075);
      hoBar(-.24, -.02, -.5, -.36, .09);
    },
    mitten() {
      ctx.roundRect(-.3, -.36, .6, .56, .2);
      ctx.roundRect(-.29, -.86, .56, .62, .26);
      hoBar(-.24, -.02, -.5, -.36, .095);
    },
    icon() {
      hoOval(0, -.1, .3, .3);
      [-.2, -.067, .067, .2].forEach((x) => hoBar(x, -.3, x, -.78, .07));
      hoBar(-.26, -.08, -.48, -.34, .07);
    },
  },
  pinch: {
    /* 위에서 비스듬히 본 손등. 검지는 앞으로 뻗다 끝이 아래로 꺾이고, 엄지는 아래에서 올라와 끝이 만난다.
       둘 사이 빈 틈이 보여야 '집었다'로 읽힌다 */
    full() {
      ctx.roundRect(-.05, -.22, .52, .42, .19);
      hoBar(.02, -.14, -.32, -.13, .078); hoBar(-.32, -.13, -.47, .0, .072);
      hoBar(.1, .13, -.18, .17, .085); hoBar(-.18, .17, -.45, .07, .078);
    },
    mitten() {
      ctx.roundRect(-.05, -.22, .52, .42, .19);
      ctx.roundRect(-.42, -.24, .5, .2, .1);
      hoBar(.1, .13, -.18, .17, .09); hoBar(-.18, .17, -.45, .07, .082);
    },
    icon() {
      hoOval(.22, 0, .25, .21);
      hoBar(.02, -.12, -.46, -.02, .06);
      hoBar(.05, .13, -.44, .08, .06);
    },
  },
};

function hoGimbap(x, y, r) {
  E(x, y, r, r, '#2f3a2f'); E(x, y, r * .82, r * .82, '#fbf7ee');
  RR(x - r * .22, y - r * .22, r * .44, r * .44, r * .08, '#ffd56b');
  RR(x - r * .62, y - r * .12, r * .3, r * .24, r * .06, '#f2994a');
  RR(x + r * .32, y - r * .14, r * .28, r * .28, r * .06, '#ff9aa8');
  RR(x - r * .2, y - r * .62, r * .4, r * .22, r * .08, '#5fa35a');
}

function hoSleeve(kind) {
  if (kind === 'open') RR(-.32, .12, .64, .4, .08, HO.sleeve);
  else RR(.42, -.24, .42, .48, .08, HO.sleeve);
}

/** 모양을 하나의 실루엣으로 칠한다. style: fill · outline · shadow · cutout */
function hoPaint(shape, style) {
  ctx.beginPath(); shape();
  if (style === 'shadow') { ctx.fillStyle = 'rgba(59,48,73,.82)'; ctx.fill(); return; }
  if (style === 'outline') { ctx.strokeStyle = HO.ink; ctx.lineWidth = .05; ctx.lineJoin = 'round'; ctx.stroke(); }
  if (style === 'cutout') { ctx.save(); ctx.translate(.02, .035); ctx.fillStyle = HO.skinDark; ctx.fill(); ctx.restore(); ctx.beginPath(); shape(); }
  ctx.fillStyle = HO.skin; ctx.fill();
}

function hoDraw(kind, variant, style, withGimbap) {
  const shape = HAND_SHAPES[kind][variant];
  if (style !== 'shadow') hoSleeve(kind);
  if (kind === 'pinch' && withGimbap) hoGimbap(-.62, .04, .17);
  hoPaint(shape, style);
  if (kind === 'pinch' && withGimbap && style === 'outline') { ctx.strokeStyle = HO.ink; ctx.lineWidth = .04; ctx.beginPath(); ctx.arc(-.62, .04, .17, 0, TAU); ctx.stroke(); }
}

/* 시안: [이름, 설명, 손 모양, 칠하기, 집은 손 대신 젓가락] */
const HAND_OPTIONS = Object.freeze([
  ['1  통통 만화 손', '손가락 넷+엄지를 한 덩어리로. 선 없음, 살색 한 톤', 'full', 'fill'],
  ['2  벙어리장갑 손', '손가락을 하나로 뭉친 미튼 모양. 엄지만 따로', 'mitten', 'fill'],
  ['3  외곽선 만화 손', '1과 같은 모양에 진한 외곽선 한 줄 (만화책 느낌)', 'full', 'outline'],
  ['4  그림자 손', '살색 없이 보라빛 그림자 실루엣. 벌레 눈에 덮쳐 오는 느낌', 'full', 'shadow'],
  ['5  아이콘 손', '동그라미 손바닥+같은 길이 막대 손가락. 픽토그램처럼', 'icon', 'fill'],
  ['6  종이 오린 손', '1 모양을 종이 두 장(살색+그늘색)으로 살짝 어긋나게', 'full', 'cutout'],
]);

function handOptionsSheet() {
  stopLoop();
  $('picker').hidden = true; hideCard(); hideCaption(); closeWall(); updateHud(null, null);
  const cols = 3, rows = 2, head = 70, cw = W / cols, ch = (H - head) / rows;
  ctx.fillStyle = HO.paper; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = HO.ink; ctx.font = '20px sans-serif'; ctx.fillText('손 그림 시안: 왼쪽은 김밥 집은 손, 오른쪽은 편 손바닥', 20, 34);
  ctx.font = '13px sans-serif'; ctx.fillStyle = '#85798f'; ctx.fillText('마음에 드는 번호나, 번호를 섞어서(예: 3의 선 + 2의 모양) 알려 주세요', 20, 56);
  const s = Math.min(cw / 2.6, ch / 1.5);
  HAND_OPTIONS.forEach(([name, desc, variant, style], i) => {
    const x0 = (i % cols) * cw, y0 = head + Math.floor(i / cols) * ch;
    ctx.fillStyle = (i + Math.floor(i / cols)) % 2 ? '#ece0c9' : '#f6eedd'; ctx.fillRect(x0, y0, cw, ch);
    ctx.fillStyle = HO.ink; ctx.font = '19px sans-serif'; ctx.fillText(name, x0 + 16, y0 + 30);
    ctx.font = '12px sans-serif'; ctx.fillStyle = '#85798f'; ctx.fillText(desc, x0 + 16, y0 + 50);
    paper(() => { ctx.translate(x0 + cw * .32, y0 + ch * .6); ctx.scale(s, s); hoDraw('pinch', variant, style, true); }, .7);
    paper(() => { ctx.translate(x0 + cw * .76, y0 + ch * .72); ctx.scale(s * .9, s * .9); hoDraw('open', variant === 'full' ? 'full' : variant, style, false); }, .7);
  });
  return 'ok';
}
