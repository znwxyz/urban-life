/* 종이 공예 렌더링 도구: 기본 도형, 오린 종이 그림자, 종이결, 장면 색조 맞추기 */
const TAU = Math.PI * 2;
const canvas = document.getElementById('stage');
const STAGE_CTX = canvas.getContext('2d');
/* 지금 그리는 곳. 평소엔 화면이고, 미리 구워 두는 동안(bake)만 오프스크린 캔버스로 바뀐다 */
let ctx = STAGE_CTX;
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

/* ── 종이 질감 타일 ──
   바닥재·벽돌·타일처럼 반복되는 재질은 작은 캔버스에 한 번만 그려 패턴으로 깐다.
   타일은 실제 cm 크기(tw×th)를 갖고, 화면 배율에 맞는 해상도로 다시 만들어 기억해 둔다 */
const TEX_SIZES = Object.freeze([48, 64, 96, 128, 192, 256, 384, 512, 768]);
const TEX_CACHE_MAX = 28;
const texCache = new Map();

/** 타일 한 장의 해상도: 화면에 깔릴 크기에 가장 가까운 단계 */
const texBucket = (px) => TEX_SIZES.find((v) => v >= px) || TEX_SIZES[TEX_SIZES.length - 1];

/**
 * 재질 패턴을 만든다(또는 기억한 것을 꺼낸다).
 * build(g, k): g는 타일 캔버스의 2D 문맥, k는 타일 안에서의 px/cm. 타일 크기는 tw×th cm
 */
function texture(key, tw, th, pxPerCm, build) {
  const size = texBucket(Math.max(tw, th) * pxPerCm);
  const id = `${key}|${size}`;
  const hit = texCache.get(id);
  if (hit) { texCache.delete(id); texCache.set(id, hit); return hit; }
  const k = size / Math.max(tw, th);
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(tw * k)); c.height = Math.max(1, Math.round(th * k));
  const g = c.getContext('2d');
  build(g, k, c.width, c.height);
  const out = { pat: ctx.createPattern(c, 'repeat'), k };
  texCache.set(id, out);
  if (texCache.size > TEX_CACHE_MAX) texCache.delete(texCache.keys().next().value);
  return out;
}

/** 패턴을 화면 배율 s(px/cm)로 맞추고 (ox, oy)에 고정해 둔 채로 칠할 준비를 한다. sy는 세로 눌림(원근) */
function usePattern(tex, s, ox, oy, sy = 1) {
  const m = new DOMMatrix();
  m.translateSelf(ox, oy);
  m.scaleSelf(s / tex.k, (s / tex.k) * sy);
  tex.pat.setTransform(m);
  ctx.fillStyle = tex.pat;
}

/** 타일 캔버스용 작은 도구: 결정적 난수로 점·선을 흩뿌린다 */
function speckle(g, w, h, n, salt, colors, rMin, rMax) {
  for (let i = 0; i < n; i++) {
    const x = hash(i, salt) * w, y = hash(i, salt + 1) * h, r = rMin + hash(i, salt + 2) * (rMax - rMin);
    g.fillStyle = colors[i % colors.length];
    g.beginPath(); g.ellipse(x, y, r, r * (.6 + hash(i, salt + 3) * .4), hash(i, salt + 4) * 3, 0, TAU); g.fill();
  }
}

/** 가위로 오린 종이 띠: 윗변이 찢긴 듯 들쭉날쭉한 띠를 (x0~x1, y~bottom)에 칠한다 */
function tornBand(x0, x1, y, bottom, amp, salt, off = 0, step = 7) {
  ctx.beginPath(); ctx.moveTo(x0, bottom);
  for (let x = x0; x <= x1 + step; x += step) {
    const n = Math.floor((x + off) / step);
    ctx.lineTo(x, y + wobble(x + off, salt) * amp * .6 + (hash(n, salt) - .5) * amp);
  }
  ctx.lineTo(x1 + step, bottom); ctx.closePath(); ctx.fill();
}

/** 곡선 패스 하나를 칠한다. pts는 [x,y] 또는 [cx,cy,x,y](2차 곡선) 또는 [c1x,c1y,c2x,c2y,x,y](3차 곡선) */
function curvy(pts, c) {
  ctx.fillStyle = c; ctx.beginPath();
  pts.forEach((p, i) => {
    if (!i) ctx.moveTo(p[0], p[1]);
    else if (p.length === 2) ctx.lineTo(p[0], p[1]);
    else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
    else ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
  });
  ctx.closePath(); ctx.fill();
}

/* ── 재질 ──
   재질 타일은 밝고 어두운 반투명 결만 그린다. 바탕색은 장면 팔레트로 먼저 칠하고 그 위에 이 결을 얹으므로
   같은 타일이 낮·밤·눈 어느 팔레트에도 맞는다 */
const DARK = (a) => `rgba(38,28,52,${a})`, LIGHT = (a) => `rgba(255,252,244,${a})`;

/** 결 하나: 시작점에서 휘어지며 뻗는 짧은 선 */
function fiber(g, x, y, len, ang, bend, w, c) {
  g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y);
  g.quadraticCurveTo(x + Math.cos(ang + bend) * len * .5, y + Math.sin(ang + bend) * len * .5, x + Math.cos(ang) * len, y + Math.sin(ang) * len);
  g.stroke();
}

/** 갈라진 금: 꺾이며 이어지다 가지를 친다 */
function crack(g, x, y, k, salt, len) {
  g.strokeStyle = DARK(.38); g.lineWidth = Math.max(.6, .22 * k); g.lineJoin = 'round'; g.beginPath(); g.moveTo(x, y);
  let a = hash(salt, 1) * TAU;
  for (let i = 0; i < len; i++) {
    a += (hash(salt + i, 2) - .5) * 1.4; x += Math.cos(a) * 2.2 * k; y += Math.sin(a) * 1.2 * k; g.lineTo(x, y);
    if (hash(salt + i, 3) > .8) { g.moveTo(x, y); g.lineTo(x + Math.cos(a + 1) * 2 * k, y + Math.sin(a + 1) * 1.4 * k); g.moveTo(x, y); }
  }
  g.stroke();
}

const MATERIALS = {
  asphalt: { tw: 40, th: 40, macro: 'grit', build(g, k, w, h) {
    g.fillStyle = DARK(.05); g.fillRect(0, 0, w, h);
    speckle(g, w, h, 520, 3, [DARK(.28), DARK(.16), LIGHT(.22)], .1 * k, .45 * k);
    speckle(g, w, h, 40, 8, [LIGHT(.35), DARK(.35)], .35 * k, .8 * k);
    g.fillStyle = DARK(.08); g.beginPath(); g.ellipse(w * .7, h * .3, 7 * k, 3 * k, .2, 0, TAU); g.fill();   // 땜질 자국
    crack(g, w * .15, h * .6, k, 11, 9);
  } },
  /* 아주 가까이서 본 콘크리트·보도블록 표면: 모래알과 잔돌 */
  grit: { tw: 6, th: 6, build(g, k, w, h) {
    g.fillStyle = DARK(.04); g.fillRect(0, 0, w, h);
    speckle(g, w, h, 160, 15, [DARK(.22), LIGHT(.25), DARK(.12)], .03 * k, .12 * k);
    speckle(g, w, h, 6, 17, [LIGHT(.3), DARK(.25)], .15 * k, .35 * k);
  } },
  /* 파리 눈높이의 잔디: 굵은 풀잎 몇 가닥이 거의 곧게 선다 */
  grassMacro: { tw: 8, th: 8, build(g, k, w, h) {
    g.fillStyle = DARK(.05); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 34; i++) {
      const x = hash(i, 121) * w, y = hash(i, 122) * h, len = (1.2 + hash(i, 123) * 2.4) * k;
      fiber(g, x, y, len, -Math.PI / 2 + (hash(i, 124) - .5) * .4, (hash(i, 125) - .5) * .3, Math.max(.8, .22 * k), i % 3 ? DARK(.12) : LIGHT(.16));
    }
  } },
  paver: { tw: 40, th: 20, macro: 'grit', build(g, k, w, h) {
    const bw = 20 * k, bh = 10 * k, j = Math.max(1, .9 * k);
    for (let r = 0; r < 2; r++) {
      for (let c = -1; c < 3; c++) {
        const x = c * bw + (r % 2) * bw / 2, y = r * bh, v = hash(c + 5 + r * 7, 4);
        g.fillStyle = v < .5 ? DARK(v * .22) : LIGHT((v - .5) * .3); g.fillRect(x, y, bw, bh);
        g.fillStyle = LIGHT(.22); g.fillRect(x + j, y + j, bw - 2 * j, Math.max(1, .5 * k));   // 모서리 빛
        g.fillStyle = DARK(.4); g.fillRect(x, y, j, bh); g.fillRect(x, y, bw, j);              // 줄눈
      }
    }
    speckle(g, w, h, 120, 13, [DARK(.18), LIGHT(.2)], .08 * k, .25 * k);
  } },
  grass: { tw: 24, th: 24, macro: 'grassMacro', build(g, k, w, h) {
    g.fillStyle = DARK(.06); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = hash(i, 21) * w, y = hash(i, 22) * h, len = (1.5 + hash(i, 23) * 3.5) * k;
      fiber(g, x, y, len, -Math.PI / 2 + (hash(i, 24) - .5) * .9, (hash(i, 25) - .5) * .6, Math.max(.6, .28 * k), i % 3 ? DARK(.2) : LIGHT(.22));
    }
    speckle(g, w, h, 14, 27, [LIGHT(.35)], .3 * k, .55 * k);   // 토끼풀
  } },
  /* 아주 가까이서 본 유약 타일: 매끈한 면에 물기 자국과 먼지 몇 점 */
  glaze: { tw: 10, th: 10, build(g, k, w, h) {
    g.fillStyle = LIGHT(.08); g.beginPath(); g.ellipse(w * .3, h * .4, 2.6 * k, .7 * k, -.2, 0, TAU); g.fill();
    g.fillStyle = DARK(.06); g.beginPath(); g.ellipse(w * .75, h * .8, 1.8 * k, .9 * k, .3, 0, TAU); g.fill();
    speckle(g, w, h, 18, 37, [DARK(.18), LIGHT(.3)], .03 * k, .1 * k);
  } },
  tileLight: { tw: 30, th: 30, macro: 'glaze', build(g, k, w, h) { floorTiles(g, k, w, h, 30, LIGHT(.55), 31); } },
  tileDark: { tw: 40, th: 40, macro: 'glaze', build(g, k, w, h) {
    floorTiles(g, k, w, h, 20, DARK(.2), 33);
    g.fillStyle = DARK(.1); g.beginPath(); g.ellipse(w * .3, h * .7, 6 * k, 2.4 * k, 0, 0, TAU); g.fill();   // 물기·기름 얼룩
  } },
  wood: { tw: 120, th: 36, build(g, k, w, h) {
    const ph = 12 * k;
    for (let r = 0; r < 3; r++) {
      const y = r * ph, cut = (hash(r, 41) * .6 + .2) * w;
      g.fillStyle = r % 2 ? DARK(.06) : LIGHT(.06); g.fillRect(0, y, w, ph);
      for (let i = 0; i < 7; i++) {
        const gy = y + (1 + i * 1.5) * k;
        g.strokeStyle = DARK(.07 + hash(i + r * 9, 42) * .08); g.lineWidth = Math.max(.5, .2 * k); g.beginPath(); g.moveTo(0, gy);
        for (let x = 0; x <= w; x += 6 * k) g.lineTo(x, gy + Math.sin(x / (9 * k) + i + r) * .5 * k);
        g.stroke();
      }
      g.fillStyle = DARK(.12); g.beginPath(); g.ellipse(cut * .5, y + ph * .5, 1.4 * k, .7 * k, 0, 0, TAU); g.fill();   // 옹이
      g.fillStyle = DARK(.32); g.fillRect(0, y, w, Math.max(1, .35 * k)); g.fillRect(cut, y, Math.max(1, .35 * k), ph);
      g.fillStyle = LIGHT(.18); g.fillRect(0, y + Math.max(1, .35 * k), w, Math.max(1, .3 * k));
    }
  } },
  brick: { tw: 44, th: 28, build(g, k, w, h) {
    const bw = 22 * k, bh = 7 * k, m = Math.max(1, 1 * k);
    g.fillStyle = LIGHT(.32); g.fillRect(0, 0, w, h);   // 줄눈
    for (let r = 0; r < 4; r++) {
      for (let c = -1; c < 3; c++) {
        const x = c * bw + (r % 2) * bw / 2, y = r * bh, v = hash(c + 3 + r * 5, 51);
        g.fillStyle = v < .25 ? DARK(.22) : v > .8 ? LIGHT(.12) : DARK(.04 + v * .08);
        g.fillRect(x + m / 2, y + m / 2, bw - m, bh - m);
        g.fillStyle = DARK(.12); g.fillRect(x + m / 2, y + bh - m * 1.2, bw - m, m * .7);   // 아랫면 그늘
      }
    }
    speckle(g, w, h, 60, 53, [DARK(.2), LIGHT(.18)], .1 * k, .3 * k);
  } },
  concrete: { tw: 90, th: 60, build(g, k, w, h) {
    g.fillStyle = DARK(.18); g.fillRect(0, 0, w, Math.max(1, .5 * k)); g.fillRect(0, 0, Math.max(1, .5 * k), h);   // 거푸집 이음
    [[.25, .25], [.75, .25], [.25, .75], [.75, .75]].forEach(([u, v]) => {   // 폼타이 구멍
      g.fillStyle = DARK(.3); g.beginPath(); g.arc(w * u, h * v, 1.3 * k, 0, TAU); g.fill();
      g.fillStyle = LIGHT(.25); g.beginPath(); g.arc(w * u - .3 * k, h * v - .3 * k, .6 * k, 0, TAU); g.fill();
    });
    speckle(g, w, h, 200, 61, [DARK(.12), LIGHT(.15)], .12 * k, .5 * k);
    g.fillStyle = DARK(.07); g.fillRect(w * .55, h * .3, 3 * k, h * .7);   // 빗물 자국
  } },
  wallTile: { tw: 30, th: 30, build(g, k, w, h) {
    floorTiles(g, k, w, h, 15, DARK(.2), 71);
    g.fillStyle = LIGHT(.35); g.fillRect(2 * k, 2 * k, 4 * k, .8 * k); g.fillRect(17 * k, 17 * k, 4 * k, .8 * k);   // 유약 반짝임
  } },
  steel: { tw: 100, th: 60, build(g, k, w, h) {
    for (let i = 0; i < 40; i++) { g.fillStyle = i % 2 ? LIGHT(.08 + hash(i, 81) * .1) : DARK(.04); g.fillRect(0, hash(i, 82) * h, w, Math.max(.6, .25 * k)); }
    g.fillStyle = DARK(.3); g.fillRect(w - Math.max(1, .6 * k), 0, Math.max(1, .6 * k), h); g.fillRect(0, h - Math.max(1, .6 * k), w, Math.max(1, .6 * k));
    g.fillStyle = LIGHT(.4); g.fillRect(0, 0, Math.max(1, .5 * k), h);
    [[3, 3], [3, h / k - 3], [w / k - 4, 3], [w / k - 4, h / k - 3]].forEach(([x, y]) => { g.fillStyle = DARK(.35); g.beginPath(); g.arc(x * k, y * k, .7 * k, 0, TAU); g.fill(); });
  } },
  wallpaper: { tw: 24, th: 24, build(g, k, w, h) {
    g.fillStyle = DARK(.05); g.fillRect(0, 0, w / 2, h);
    g.fillStyle = LIGHT(.25); g.fillRect(w / 2 - Math.max(1, .3 * k), 0, Math.max(1, .3 * k), h);
    [[w * .75, h * .3], [w * .75, h * .8]].forEach(([x, y]) => {   // 작은 꽃무늬
      for (let a = 0; a < 4; a++) { g.fillStyle = DARK(.08); g.beginPath(); g.ellipse(x + Math.cos(a * 1.57) * .8 * k, y + Math.sin(a * 1.57) * .8 * k, .6 * k, .6 * k, 0, 0, TAU); g.fill(); }
    });
  } },
};

function floorTiles(g, k, w, h, size, grout, salt) {
  const n = Math.round(w / (size * k)), m = Math.round(h / (size * k)), j = Math.max(1, .5 * k);
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const v = hash(c + r * 13, salt), x = c * size * k, y = r * size * k;
      g.fillStyle = v < .5 ? DARK(v * .1) : LIGHT((v - .5) * .2); g.fillRect(x, y, size * k, size * k);
      g.fillStyle = LIGHT(.18); g.fillRect(x + j, y + j, size * k - 2 * j, Math.max(1, .4 * k));
    }
  }
  g.fillStyle = grout;
  for (let c = 0; c < n; c++) g.fillRect(c * size * k, 0, j, h);
  for (let r = 0; r < m; r++) g.fillRect(0, r * size * k, w, j);
  speckle(g, w, h, 30, salt + 1, [DARK(.12)], .08 * k, .2 * k);
}

/* 이보다 크게 확대해 보면(작은 동물) 재질의 큰 무늬 대신 표면의 잔결을 깐다 */
const MACRO_PX_PER_CM = 12;

/** 재질을 화면 배율 s에 맞춰 꺼낸다 */
function material(name, s) {
  const key = s > MACRO_PX_PER_CM && MATERIALS[name].macro ? MATERIALS[name].macro : name;
  const m = MATERIALS[key];
  return texture(key, m.tw, m.th, s, m.build);
}

/** (x, y, w, h) 칸에 재질 결을 얹는다. 패턴은 월드 위치 ox에 붙어서 함께 스크롤된다 */
function lay(name, s, ox, oy, sy, drawShape) {
  if (!MATERIALS[name]) return;
  usePattern(material(name, s), s, ox, oy, sy);
  drawShape();
}

/* ── 미리 구워 두기 ──
   매 프레임 똑같이 다시 그리는 층(바닥 띠, 벽, 먼 풍경, 전경, 사물)은 오프스크린 캔버스에 한 번 그려 두고
   스크롤 위치만큼 밀어서 찍는다. 그리는 함수들은 전역 ctx와 화면 크기 W·H를 쓰므로, 굽는 동안만 그 둘을 바꿔 끼운다 */
const STRIP_SPAN = 1.5, BAKE_CACHE_MAX = 20, SPRITE_CACHE_MAX = 64, SPRITE_MAX_PX = 4e6;
const dprNow = () => canvas.width / Math.max(1, canvas.clientWidth);

function makeLayer(w, h, res) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w * res)); c.height = Math.max(1, Math.ceil(h * res));
  return c;
}

/** c 위에 draw()를 그린다. 그동안 원점은 (0, -y0)으로 밀리고 화면 폭 W는 w로 바뀐다 */
function bake(c, w, y0, res, draw) {
  const prevCtx = ctx, prevW = W;
  ctx = c.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
  ctx.setTransform(res, 0, 0, res, 0, -y0 * res);
  W = w;
  try { draw(); } finally { ctx = prevCtx; W = prevW; }
}

/** 오래 안 쓴 것부터 버리는 작은 기억 상자 */
function lruGet(map, key) { const v = map.get(key); if (v) { map.delete(key); map.set(key, v); } return v; }
function lruSet(map, key, v, max) { map.set(key, v); if (map.size > max) map.delete(map.keys().next().value); }

const strips = new Map();
/**
 * 옆으로 흐르는 층 하나를 띠 그림으로 구워 찍는다.
 * slot: 층 이름(장면마다 따로), key: 그림을 바꾸는 모든 것(팔레트·배율·지면 높이), off: 지금 층의 스크롤 px,
 * (y0, h): 화면에서 차지하는 세로 범위, render(o0): 스크롤이 o0일 때의 층을 그린다, res: 해상도 배율(기본 화면 dpr)
 */
function stripBlit(slot, key, off, y0, h, render, res = dprNow()) {
  const step = W * (STRIP_SPAN - 1), o0 = Math.floor(off / step) * step;
  const full = `${key}|${W}|${H}|${Math.round(y0)}|${Math.round(h)}|${res}`;
  let st = lruGet(strips, slot);
  if (!st || st.key !== full || st.o0 !== o0) {
    const sw = Math.ceil(W * STRIP_SPAN);
    const c = st && st.key === full ? st.c : makeLayer(sw, h, res);
    bake(c, sw, y0, res, () => render(o0));
    st = { key: full, o0, c, sw };
    lruSet(strips, slot, st, BAKE_CACHE_MAX);
  }
  const d = dprNow(), x = Math.round((o0 - off) * d) / d;
  ctx.drawImage(st.c, x, y0, st.sw, h);
}

const sprites = new Map();
/**
 * 움직이지 않는 그림 하나를 그림자까지 구워 두고 찍는다. draw(ox, oy)는 (ox, oy)를 기준점으로 그린다.
 * box = [왼쪽 여백, 위 여백, 폭, 높이](px, 기준점에서). 너무 크면 굽지 않고 바로 그린다
 */
function spriteDraw(key, x, y, box, draw) {
  const [l, t, w, h] = box, d = dprNow();
  if (w * h * d * d > SPRITE_MAX_PX) { draw(x, y); return; }
  let sp = lruGet(sprites, key);
  if (!sp) {
    const c = makeLayer(w, h, d);
    bake(c, w, 0, d, () => draw(l, t));
    sp = { c, l, t, w, h };
    lruSet(sprites, key, sp, SPRITE_CACHE_MAX);
  }
  const px = Math.round((x - sp.l) * d) / d, py = Math.round((y - sp.t) * d) / d;
  ctx.drawImage(sp.c, px, py, sp.w, sp.h);
}
