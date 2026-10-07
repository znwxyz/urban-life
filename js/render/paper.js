/* 종이 공예 렌더링 도구: 기본 도형, 오린 종이 그림자, 종이결, 장면 색조 맞추기 */
const TAU = Math.PI * 2;
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');
const PAPER_SHADOW = Object.freeze({ color: 'rgba(38,26,58,.3)', blur: 9, offY: 3 });
const SHADE_TO = '#2a2240', SHADE_AMOUNT = .2;
const GRAIN_SIZE = 160, GRAIN_ALPHA = .16, GRAIN_FIBERS = 40;

const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const E = (cx, cy, rx, ry, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, TAU); ctx.fill(); };
const P = (pts, c) => { ctx.fillStyle = c; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); };
/** 모서리가 둥근 종이 조각 (귀여운 느낌의 기본 도형) */
function RR(x, y, w, h, r, c) {
  ctx.fillStyle = c; ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
  ctx.fill();
}
function L(x1, y1, x2, y2, c, w) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }

function hash(n, salt) { const x = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); }
/* 가위로 오린 듯 살짝 울퉁불퉁한 가장자리 */
const wobble = (x, salt) => Math.sin(x * .045 + salt) * 1.4 + Math.sin(x * .11 + salt * 2.3) * .7;

/** 종이 한 장을 붙이듯, 아래로 부드러운 그림자를 드리운다 */
function paper(draw, strength = 1) {
  ctx.save();
  ctx.shadowColor = PAPER_SHADOW.color;
  ctx.shadowBlur = PAPER_SHADOW.blur * strength;
  ctx.shadowOffsetY = PAPER_SHADOW.offY * strength;
  draw();
  ctx.restore();
}

/** 모뉴먼트 밸리처럼 면을 두 톤으로 나눌 때 쓰는 그늘색 */
const shade = (hex) => mix(hex, SHADE_TO, SHADE_AMOUNT);

/** 장면 팔레트 쪽으로 색을 끌어당겨 사물과 배경의 톤을 맞춘다 */
const toneMemo = new WeakMap();
function makeTone(pal) {
  if (!toneMemo.has(pal)) toneMemo.set(pal, (hex) => mix(hex, pal.toneTo, pal.toneAmt));
  return toneMemo.get(pal);
}

/** 앞면 + 오른쪽 그늘면 */
function block(x, y, w, h, c, t) {
  const r = Math.min(w, h) * .14;
  RR(x, y, w, h, r, t(shade(c)));
  RR(x, y, w * .84, h, r, t(c));
}

let grainPattern = null;
function buildGrain() {
  const c = document.createElement('canvas');
  c.width = c.height = GRAIN_SIZE;
  const g = c.getContext('2d');
  const img = g.createImageData(GRAIN_SIZE, GRAIN_SIZE);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + (Math.random() - .5) * 90;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  g.strokeStyle = 'rgba(255,255,255,.3)';
  for (let k = 0; k < GRAIN_FIBERS; k++) {
    const x = Math.random() * GRAIN_SIZE, y = Math.random() * GRAIN_SIZE, a = Math.random() * TAU, l = 4 + Math.random() * 10;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  return ctx.createPattern(c, 'repeat');
}

/** 화면 전체에 종이결을 얹는다 */
function drawGrain(w, h) {
  if (!grainPattern) grainPattern = buildGrain();
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.globalAlpha = GRAIN_ALPHA;
  ctx.fillStyle = grainPattern;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
