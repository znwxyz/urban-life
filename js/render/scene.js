/* 장면 합성: 배경 → 지면 → 사물 → 소품 → 주인공 → 전경 → 빛·날씨 → 종이결 → 추적 표시 */
const TONE_DAY = .14, TONE_NIGHT = .5;
const GROUND_LAYERS = Object.freeze([[.34, .1, 13], [.68, .2, 17]]);
/* 밤 가로등: 빛 기둥 두 겹과 바닥 빛 웅덩이 두 겹의 진하기 */
const LAMP_CONE = Object.freeze([.12, .1]), LAMP_POOL = Object.freeze([.22, .2]), LAMP_AHEAD = .42;
const PORTRAIT_RATIO = .9, PORTRAIT_TALL = 1.25;

/** 화면 1cm가 몇 px인지. 세로로 긴 휴대폰 화면에서도 동물이 너무 작아지지 않게, 화면 폭과 높이 중 큰 쪽을 기준으로 잡는다 */
const scaleFor = (sp) => Math.max(W, H * PORTRAIT_RATIO) / (sp ? sp.viewCm : DEFAULT_VIEW_CM);
/** 지금 화면에 보이는 폭(cm). 세로 화면에서는 viewCm보다 좁다 */
const visibleCm = (sp) => W / scaleFor(sp);
/* 넓은 화면에서는 카드가 오른쪽을 차지하므로 주인공을 더 왼쪽에 세워 앞쪽 공간을 넓힌다 */
const WIDE_SCREEN = 900;
const HERO_X_WIDE = .2, HERO_X_NARROW = .3;
const heroScreenX = () => (W >= WIDE_SCREEN ? HERO_X_WIDE : HERO_X_NARROW);
const TRACKER = '#fffaf0', DEFAULT_VIEW_CM = 600, DEFAULT_EYE = 30;
const BANDS = Object.freeze([{ k: 'l', cell: 1500, dens: .6, salt: 3 }, { k: 'm', cell: 340, dens: .55, salt: 7 }, { k: 's', cell: 26, dens: .6, salt: 11 }]);
const PARTICLES = Array.from({ length: 140 }, (_, i) => ({ x: hash(i, 201), y: hash(i, 202), v: .6 + hash(i, 203) * .6, n: i }));
let vignette = null;
let lastFrame = { s: 1, g: 0 };

function resizeStage() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth; H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  vignette = null;
}

const palMemo = new Map();
function paletteFor(key, night, snow) {
  const id = `${key}|${night}|${snow}`;
  if (palMemo.has(id)) return palMemo.get(id);
  const sc = SCENES[key];
  const base = night ? nightify(sc.pal, sc.indoor) : { ...sc.pal };
  const p = snow ? winterize(base) : base;
  const out = {
    ...p,
    cloud: night ? mix(p.skyMid || p.skyTop, '#ffffff', .1) : mix(p.skyBottom, '#ffffff', .55),
    cloudShade: night ? mix(p.skyTop, p.skyMid || p.skyTop, .6) : mix(mix(p.skyBottom, '#ffffff', .55), p.skyTop, .4),
    toneTo: night ? NIGHT_TINT : p.skyBottom, toneAmt: night ? TONE_NIGHT : TONE_DAY,
  };
  palMemo.set(id, out);
  return out;
}

/** 윗변이 살짝 울퉁불퉁한 종이 한 장을 화면 아래까지 깐다. color가 null이면 지금 채우기(재질 패턴)를 그대로 쓴다 */
function edgeFill(color, y, amp, salt, scroll, bottom = H) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, bottom);
  for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, y + amp * wobble(x + scroll, salt));
  ctx.lineTo(W, bottom); ctx.closePath(); ctx.fill();
}

/* 바닥은 비스듬히 내려다본 면이라 재질 결을 세로로 눌러 깐다. 앞쪽 띠일수록 결이 크고 빨리 지나간다 */
const FLOOR_SQUASH = .5;

const palKeyOf = (f) => `${f.v.scene}|${f.v.night}|${f.v.weather === 'snow'}`;
/** 스크롤만 바꾼 그리기 재료 (띠 그림을 구울 때 쓴다) */
const scrollFrame = (f, scroll) => ({ ...f, scroll, v: { ...f.v, camX: scroll / f.s } });
const bandTopOf = (f, k) => (k < GROUND_LAYERS.length ? f.g + (H - f.g) * GROUND_LAYERS[k][0] + 4 : H);

/** 땅과 같은 속도로 흐르는 것들: 벽, 땅 끝선, 첫 바닥 띠, 바닥 표시, 풀포기. 하나의 띠 그림으로 굽는다 */
function groundBody(f) {
  const { sc, p, g, s } = f;
  const amp = sc.indoor ? 0 : 1, top = clamp(1.5 * s, 3, 12), floor = sc.floor;
  drawWalls(f);
  paper(() => edgeFill(p.groundTop, g - 2, amp, 5, f.scroll), .8);
  if (floor) lay(floor, s, -f.scroll, g, FLOOR_SQUASH * .6, () => edgeFill(null, g - 2, amp, 5, f.scroll, g + top + 2));
  edgeFill(p.ground, g + top, amp, 9, f.scroll);
  if (floor) lay(floor, s, -f.scroll, g + top, FLOOR_SQUASH, () => edgeFill(null, g + top, amp, 9, f.scroll, bandTopOf(f, 0)));
  R(0, g + top, W, Math.max(2, top * .5), 'rgba(38,26,58,.14)');   // 앞 턱 아래 그늘
  if (FLOOR_DECO[sc.deco]) FLOOR_DECO[sc.deco](f, g + top);
  if (sc.floor === 'grass' || sc.floor === 'asphalt') lipTufts(f);
}

/** 앞쪽 바닥 띠 n: 가까울수록 진하고 빨리 지나간다 */
function groundBand(f, n) {
  const { sc, p, g, s } = f, [at, dark, salt] = GROUND_LAYERS[n];
  const amp = sc.indoor ? 0 : 1, y = g + (H - g) * at, k = 1 + at;
  paper(() => edgeFill(mix(p.ground, p.ink, dark), y, amp * 2, salt, f.scroll * k, bandTopOf(f, n + 1)), .9);
  if (sc.floor) lay(sc.floor, s * k, -f.scroll * k, y, FLOOR_SQUASH * (1 + at * .6), () => edgeFill(null, y, amp * 2, salt, f.scroll * k, bandTopOf(f, n + 1)));
}

const BAND_PAD = 14, TUFT_PAD_CM = 6;
/** 벽과 바닥: 구워 둔 띠 그림을 스크롤만큼 밀어 찍는다 */
function drawGround(f) {
  const { sc, g, s, v } = f, key = `${palKeyOf(f)}|${s}|${g}`;
  const y0 = sc.indoor || sc.wall ? 0 : Math.max(0, g - TUFT_PAD_CM * s - BAND_PAD);
  stripBlit(`body|${v.scene}`, key, f.scroll, y0, H - y0, (o0) => groundBody(scrollFrame(f, o0)));
  liveWalls(f);
  GROUND_LAYERS.forEach(([at], n) => {
    const k = 1 + at, y = g + (H - g) * at - BAND_PAD;
    stripBlit(`band${n}|${v.scene}`, key, f.scroll * k, y, H - y, (o0) => groundBand(scrollFrame(f, o0 / k), n));
  });
}

/** 땅 끝선에 삐죽 솟은 풀포기 (가까이 보는 작은 동물에게는 숲처럼 보인다) */
function lipTufts(f) {
  const { s, g, v, p, sc } = f, cell = 7;
  const i0 = Math.floor(v.camX / cell) - 1, i1 = Math.floor((v.camX + W / s) / cell) + 1;
  if (i1 - i0 > 260 || s < .8) return;
  const grass = sc.floor === 'grass', dens = grass ? .75 : .12;
  ctx.fillStyle = grass ? mix(p.groundTop, p.ink, .12) : mix(p.groundTop, '#6f9f6c', .45);
  ctx.beginPath();
  for (let i = i0; i <= i1; i++) {
    if (hash(i, 91) > dens) continue;
    const x = (i * cell + hash(i, 92) * cell - v.camX) * s, hgt = (grass ? 2 + hash(i, 93) * 4 : 1 + hash(i, 93) * 2.5) * s;
    for (let b = 0; b < 3; b++) {
      const bx = x + (b - 1) * .9 * s, lean = (b - 1) * .8 * s + (hash(i + b, 94) - .5) * s;
      ctx.moveTo(bx - .45 * s, g); ctx.quadraticCurveTo(bx, g - hgt * .6, bx + lean, g - hgt * (1 - b * .15)); ctx.quadraticCurveTo(bx + .15 * s, g - hgt * .5, bx + .45 * s, g);
    }
  }
  ctx.fill();
}

/* 바닥 위에 그려진 것들: 주차선, 맨홀, 점자블록, 배수구, 러그. 월드 위치에 붙어 바닥과 같이 스크롤된다 */
function decoCells(f, cell, salt, dens, draw) {
  const { s, v } = f;
  const i0 = Math.floor(v.camX / cell) - 1, i1 = Math.floor((v.camX + W / s) / cell) + 1;
  if (i1 - i0 > 80) return;
  for (let i = i0; i <= i1; i++) if (hash(i, salt) < dens) draw((i * cell - v.camX) * s, i);
}

const FLOOR_DECO = {
  parkingLines(f, y) {
    const { s, p } = f, hgt = (H - y) * .3;
    ctx.fillStyle = rgba(mix(p.light, p.groundTop, .25), .75);
    decoCells(f, 250, 95, 1, (x) => P([[x, y + 2], [x + 10 * s, y + 2], [x + 10 * s - hgt * .6, y + hgt], [x - hgt * .6, y + hgt]], ctx.fillStyle));
  },
  manhole(f, y) {
    const { s, p } = f, ry = Math.min((H - y) * .12, 18 * s);
    decoCells(f, 900, 96, .6, (x) => {
      E(x + 32 * s, y + ry * 1.3, 33 * s, ry, mix(p.ground, p.ink, .35));
      E(x + 32 * s, y + ry * 1.2, 29 * s, ry * .85, mix(p.ground, p.ink, .18));
      ctx.strokeStyle = rgba(p.ink, .35); ctx.lineWidth = Math.max(1, .8 * s); ctx.beginPath();
      for (let k = -2; k <= 2; k++) { ctx.moveTo(x + (32 + k * 9) * s, y + ry * .55); ctx.lineTo(x + (32 + k * 9) * s, y + ry * 1.85); }
      ctx.stroke();
    });
  },
  tactile(f, y) {
    const { s, p } = f, hgt = Math.min((H - y) * .07, 30 * s * FLOOR_SQUASH), y0 = y + (H - y) * .14;
    const tile = mix('#e8c24a', p.ground, .3), bump = mix(tile, p.ink, .15);
    decoCells(f, 30, 97, 1, (x) => {
      R(x, y0, 29 * s, hgt, tile);
      if (s > 2) for (let k = 0; k < 4; k++) R(x + (3 + k * 7) * s, y0 + hgt * .2, 3.5 * s, hgt * .6, bump);
    });
  },
  drain(f, y) {
    const { s, p } = f, hgt = Math.min((H - y) * .1, 14 * s);
    decoCells(f, 400, 98, .7, (x) => {
      R(x, y + hgt * .4, 60 * s, hgt, mix(p.ground, p.ink, .45));
      for (let k = 0; k < 12; k++) R(x + (2 + k * 5) * s, y + hgt * .5, 2.4 * s, hgt * .8, mix(p.ground, p.light, .25));
    });
  },
  rug(f, y) {
    const { s, p } = f, hgt = (H - y) * .5;
    decoCells(f, 700, 99, .5, (x) => {
      const c = mix(p.accent, p.light, .35), rw = 240 * s;
      P([[x, y + 3], [x + rw, y + 3], [x + rw - hgt * .4, y + hgt], [x - hgt * .4, y + hgt]], c);
      P([[x + 10 * s, y + 3 + hgt * .1], [x + rw - 10 * s, y + 3 + hgt * .1], [x + rw - 10 * s - hgt * .35, y + hgt * .9], [x + 10 * s - hgt * .35, y + hgt * .9]], mix(c, p.ink, .12));
    });
  },
};

function drawItems(f) {
  const { sc, s, g, v, t } = f;
  BANDS.forEach((b) => {
    const list = sc.items[b.k];
    if (!list || !list.length) return;
    const i0 = Math.floor(v.camX / b.cell) - 2, i1 = Math.floor((v.camX + W / s) / b.cell) + 1;
    if (i1 - i0 > 600) return;
    const salt = b.salt + sc.salt * 13, dens = (sc.dens && sc.dens[b.k]) ?? b.dens;
    for (let i = i0; i <= i1; i++) {
      if (hash(i, salt) > dens) continue;
      const it = ITEMS[list[Math.floor(hash(i, salt + 1) * list.length)]];
      if (!it || Math.max(it.w, it.h) * s < 1.5) continue;
      const x = (i * b.cell + hash(i, salt + 2) * b.cell * .7 - v.camX) * s;
      if (x > W || x + it.w * s < 0) continue;
      itemSprite(f, list[Math.floor(hash(i, salt + 1) * list.length)], it, x, hash(i, salt + 3), b.k === 's' ? .35 : 1);
    }
  });
}

function drawProp(f) {
  const { v, s, g, t } = f;
  const it = v.prop && ITEMS[v.prop];
  if (!it) return;
  const x = (v.propX - v.camX) * s;
  if (x > W || x + it.w * s < 0) return;
  itemSprite(f, v.prop, it, x, .5, 1.1);
}

/** 사물 하나를 그림자째 구워 두고 찍는다 (사물은 시간에 따라 변하지 않는다) */
function itemSprite(f, name, it, x, r, strength) {
  const { s, g, t } = f, padX = 24 + it.w * s * .3, padT = 24 + it.h * s * .3;
  // 사물은 땅(y)에서 위로 그려지므로, 구운 그림 안에서 땅은 사물 높이와 여백만큼 내려온 자리에 둔다
  const box = [padX, it.h * s + padT, it.w * s + padX * 2, it.h * s + padT + 24];
  spriteDraw(`${name}|${r}|${s}|${palKeyOf(f)}|${strength}`, x, g, box, (ox, oy) => paper(() => it.d(ox, oy, s, r, t), strength));
}

const KILLER_POP_MS = 240;
/* 넓은 화면에서는 오른쪽 아래를 카드가 차지하므로, 등장인물이 카드 밑으로 들어가지 않게 간격을 좁힌다 */
const CAST_LIMIT_WIDE = .6, CAST_LIMIT_NARROW = .94;

/** 등장인물 하나. sx, sy는 발밑의 화면 좌표, pop은 튀어나오는 크기(0~1) */
function drawActor(key, sx, sy, s, flip, time, t, pop = 1) {
  const act = ACTORS[key];
  if (!act || sx - act.w * s > W || sx + act.w * s < 0) return;
  paper(() => { ctx.translate(sx, sy); ctx.scale(s * pop * (flip ? -1 : 1), s * pop); act.d(time, t); }, .9);
}

/** 장면 속 인물들: 주인공이 멈춰 설 자리(heroStopX)를 기준으로 cm만큼 떨어져 선다 */
function drawCast(f) {
  const { v, s, g, t } = f, cast = v.cast || [];
  if (!cast.length) return;
  const heroX = (v.heroStopX - v.camX) * s, limit = W * (W >= WIDE_SCREEN ? CAST_LIMIT_WIDE : CAST_LIMIT_NARROW);
  const far = Math.max(...cast.map((c) => c.x + ((ACTORS[c.a] && ACTORS[c.a].w) || 0) / 2));
  // 간격은 주인공이 멈춰 설 화면 위치로 한 번만 정한다. 지금 위치로 매번 다시 재면 이동 중에 인물이 땅과 따로 미끄러진다
  const k = far > 0 ? Math.min(1, (limit - W * heroScreenX()) / (far * s)) : 1;
  cast.forEach((c) => drawActor(c.a, heroX + c.x * Math.max(k, .3) * s, g - (c.y || 0) * s, s, c.flip, v.t, t));
}

/** 죽음의 가해자: 주인공 바로 옆에 통 튀어나온다 */
function drawKiller(f) {
  const { v, s, g, t } = f, k = v.killer;
  if (!k) return;
  const u = Math.min(1, (performance.now() - k.t0) / KILLER_POP_MS);
  const pop = u < 1 ? Math.sin(u * Math.PI * .5) * 1.15 : 1;
  drawActor(k.a, W * heroScreenX() + k.x * s, g - (k.y || 0) * s, s, k.flip, v.t, t, pop);
}

function drawHero(f, sp) {
  const { s, g, v } = f;
  const draw = ANIMALS[sp.body];
  if (!draw) return;
  const moving = v.speed > sp.speedCm * .3;
  paper(() => { ctx.translate(W * heroScreenX(), g); ctx.scale(s, s); draw(v.t, moving, sp.eye, f.t); }, .8);
}

/* 가장 앞 종이: 화면 아래를 스치는 연석·풀숲. 땅보다 빨리(PARALLAX.fg) 같은 방향으로 지나간다 */
const FG_CURB_JOINT = 118, FG_BOLLARD_CELL = 520;
const FG = {
  curb(f, off, fh) {
    const { p } = f, stone = mix(p.ink, p.groundTop, .38), top = mix(p.ink, p.groundTop, .62), y = H - fh * .62;
    edgeFill(stone, y, 1, 3, off);
    edgeFill(top, y - 1, 1, 3, off); edgeFill(stone, y + fh * .13, 1, 3, off);
    const i0 = Math.floor(off / FG_CURB_JOINT) - 1, i1 = Math.floor((off + W) / FG_CURB_JOINT) + 1;
    const weed = mix(p.ink, '#5f8f6c', .45);
    for (let i = i0; i <= i1; i++) {
      const x = i * FG_CURB_JOINT - off;
      R(x, y, 2.5, fh, mix(p.ink, stone, .4));                                                      // 연석 이음매
      if (hash(i, 64) < .3) E(x + 40 + hash(i, 65) * 40, y + fh * .08, 7, 2.5, mix(top, p.ink, .25));   // 깨진 모서리
      if (hash(i, 66) < .45) fgTuft(x, y + 2, fh * (.35 + hash(i, 67) * .4), weed, i);
    }
    const b0 = Math.floor(off / FG_BOLLARD_CELL) - 1, b1 = Math.floor((off + W) / FG_BOLLARD_CELL) + 1;
    for (let i = b0; i <= b1; i++) {
      if (hash(i, 61) > .45) continue;
      const x = i * FG_BOLLARD_CELL - off + 160, bh = fh * 1.9;
      RR(x, H - bh, 18, bh, 9, mix(p.ink, '#8d8a9c', .25));
      R(x, H - bh + 12, 18, 6, mix(p.ink, '#fffaf0', .45)); R(x + 13, H - bh + 6, 5, bh - 6, mix(p.ink, '#2f2a3a', .3));
    }
  },
  grass(f, off, fh) {
    const { p } = f, back = mix(p.ink, p.groundTop, .3), front = p.ink;
    [[back, .55, 9, 1.15, 0], [front, .3, 12, .95, 31]].forEach(([c, base, cell, tall, salt]) => {
      ctx.fillStyle = c; ctx.fillRect(0, H - fh * base, W, fh * base);
      const i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
      ctx.beginPath();
      for (let i = i0; i <= i1; i++) {
        const x = i * cell - off, hgt = fh * tall * (.35 + hash(i, 62 + salt) * .8), lean = (hash(i, 63 + salt) - .4) * 10;
        ctx.moveTo(x, H - fh * base + 1); ctx.quadraticCurveTo(x + 2 + lean * .3, H - fh * base - hgt * .6, x + 4 + lean, H - fh * base - hgt);
        ctx.quadraticCurveTo(x + 5 + lean * .3, H - fh * base - hgt * .5, x + 9, H - fh * base + 1);
      }
      ctx.fill();
    });
    const i0 = Math.floor(off / 210) - 1, i1 = Math.floor((off + W) / 210) + 1;
    for (let i = i0; i <= i1; i++) {                                                                // 클로버와 민들레 홀씨
      const x = i * 210 - off + hash(i, 68) * 120, y = H - fh * (.45 + hash(i, 69) * .3);
      if (hash(i, 70) < .4) [0, 1, 2].forEach((k) => E(x + Math.cos(k * 2.1) * 5, y + Math.sin(k * 2.1) * 4, 5, 4, mix(front, '#6a9c78', .25)));
      else if (hash(i, 71) < .3) { L(x, H, x + 4, y - fh * .5, front, 2); ctx.globalAlpha = .7; E(x + 4, y - fh * .5, 9, 9, mix(p.light, p.ink, .25)); ctx.globalAlpha = 1; }
    }
  },
};

/** 연석 틈에 난 풀 한 포기 */
function fgTuft(x, y, hgt, c, i) {
  ctx.fillStyle = c; ctx.beginPath();
  for (let b = 0; b < 4; b++) {
    const lean = (b - 1.5) * 5 + (hash(i + b, 72) - .5) * 4, bx = x + b * 3 - 4;
    ctx.moveTo(bx - 2, y + 2); ctx.quadraticCurveTo(bx, y - hgt * .6, bx + lean, y - hgt * (1 - b * .12)); ctx.quadraticCurveTo(bx + 1, y - hgt * .4, bx + 2, y + 2);
  }
  ctx.fill();
}

function drawForeground(f) {
  const { sc } = f;
  if (!FG[sc.fg]) return;
  const fh = clamp(H * .08, 26, 70), y0 = H - fh * 2.4;
  stripBlit(`fg|${f.v.scene}`, `${palKeyOf(f)}|${fh}`, f.scroll * PARALLAX.fg, y0, H - y0, (o0) => paper(() => FG[sc.fg](f, o0, fh), 1.4));
}

function drawGlow(f) {
  const { v, g, s, sc } = f;
  if (!v.night || !v.glow) return;
  // 가로등은 땅에 서 있다: 주인공이 멈춰 설 자리에서 화면 폭의 LAMP_AHEAD만큼 앞. 걸으면 다가왔다가 지나간다
  const stop = Number.isFinite(v.heroStopX) ? (v.heroStopX - v.camX) * s : W * (.72 - LAMP_AHEAD);
  const gx = stop + W * LAMP_AHEAD, gy = Math.max(60, g - Math.min(H * .3, 600 * s)), rad = Math.min(W, H) * .5;
  const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
  rg.addColorStop(0, rgba(v.glow, .32)); rg.addColorStop(1, rgba(v.glow, 0));
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  if (sc.indoor) return;
  // 가로등 불빛: 위에서 내려오는 빛 기둥과 바닥에 고인 빛 웅덩이를 얇은 종이처럼 겹친다
  const spread = Math.min(rad * .55, (g - gy) * .6);
  P([[gx - 10, gy], [gx + 10, gy], [gx + spread, g], [gx - spread, g]], rgba(v.glow, LAMP_CONE[0]));
  P([[gx - 6, gy], [gx + 6, gy], [gx + spread * .6, g], [gx - spread * .6, g]], rgba(v.glow, LAMP_CONE[1]));
  E(gx, g + 6, spread * 1.05, Math.max(6, (H - g) * .08), rgba(v.glow, LAMP_POOL[0]));
  E(gx, g + 6, spread * .6, Math.max(4, (H - g) * .05), rgba(v.glow, LAMP_POOL[1]));
}

/** 비·눈 알갱이를 한 프레임에 한 번만 움직인다 (이음선 양쪽을 따로 그려도 두 배로 빨라지지 않게) */
function stepWeather(v, dt) {
  const kinds = [v.weather, v.trans && v.trans.prev.weather];
  if (!kinds.includes('rain') && !kinds.includes('snow')) return;
  const rain = kinds.includes('rain');
  PARTICLES.forEach((pt) => {
    pt.y += dt * pt.v * (rain ? 1.6 : .12);
    if (pt.y > 1) { pt.y -= 1; pt.n += PARTICLES.length; pt.x = hash(pt.n, 204); }
  });
}

function drawWeather(f) {
  const { v, g } = f;
  if (v.weather === 'smoke') {
    for (let k = 0; k < 6; k++) {
      const x = mod(k * W * .3 + v.t * 18 * (k % 2 ? 1 : -1), W + 400) - 200;
      E(x, g - H * .04 + (k % 3) * H * .05, W * .35, H * .12, 'rgba(246,243,236,.32)');
    }
    return;
  }
  if (v.weather !== 'rain' && v.weather !== 'snow') return;
  const rain = v.weather === 'rain';
  ctx.strokeStyle = 'rgba(225,232,245,.55)'; ctx.fillStyle = 'rgba(250,250,252,.9)'; ctx.lineWidth = 1;
  ctx.beginPath();
  PARTICLES.forEach((pt) => {
    const x = pt.x * W + (rain ? 0 : Math.sin(v.t + pt.v * 9) * 8), y = pt.y * H;
    if (rain) { ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 14); } else ctx.rect(x, y, 2.4, 2.4);
  });
  if (rain) ctx.stroke(); else ctx.fill();
  if (rain) rainRipples(f);
}

/** 빗방울이 땅에 떨어져 퍼지는 동그란 물결 (제자리에서 퍼지고 땅과 함께 지나간다) */
function rainRipples(f) {
  const { v, g } = f;
  ctx.strokeStyle = 'rgba(225,232,245,.4)'; ctx.lineWidth = 1; ctx.beginPath();
  for (let k = 0; k < 14; k++) {
    const ph = (v.t * .9 + hash(k, 211)) % 1, x = mod(hash(k, 212) * W * 1.3 - f.scroll, W + 40) - 20;
    const y = g + 4 + hash(k, 213) * (H - g) * .5, r = 3 + ph * 16;
    ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * .28, 0, 0, TAU);
  }
  ctx.stroke();
}

/** 가장자리를 어둡게: 한 번 그려 둔 그림을 찍는다 */
function drawVignette() {
  const d = dprNow();
  if (!vignette || vignette.width !== Math.ceil(W * d) || vignette.height !== Math.ceil(H * d)) {
    vignette = makeLayer(W, H, d);
    bake(vignette, W, 0, d, () => {
      const gr = ctx.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .35, W / 2, H * .45, Math.max(W, H) * .75);
      gr.addColorStop(0, 'rgba(30,20,45,0)'); gr.addColorStop(1, 'rgba(30,20,45,.28)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    });
  }
  ctx.drawImage(vignette, 0, 0, W, H);
}

function drawTracker(f, sp) {
  const { s, g } = f;
  const [x0, y0, x1, y1] = sp.box, pad = 6, cx = W * heroScreenX();
  const L0 = cx + x0 * s - pad, T = g + y0 * s - pad, R0 = cx + x1 * s + pad, B = g + y1 * s + pad, k = Math.min(10, (R0 - L0) / 3);
  ctx.save();
  ctx.shadowColor = 'rgba(30,20,45,.55)'; ctx.shadowBlur = 4;
  ctx.strokeStyle = TRACKER; ctx.lineWidth = 1.5; ctx.beginPath();
  [[L0, T, 1, 1], [R0, T, -1, 1], [L0, B, 1, -1], [R0, B, -1, -1]].forEach(([x, y, dx, dy]) => { ctx.moveTo(x + dx * k, y); ctx.lineTo(x, y); ctx.lineTo(x, y + dy * k); });
  ctx.stroke();
  ctx.fillStyle = TRACKER; ctx.font = '11px "New Gulim", "Galmuri11", monospace'; ctx.fillText(`나 · ${sp.size}`, L0, T - 7);
  ctx.restore();
}

/** 지금 화면에서 주인공이 차지하는 원 (피 연출 위치) */
function heroRect(sp) {
  const { s, g } = lastFrame, [x0, y0, x1, y1] = sp.box;
  return { cx: W * heroScreenX() + (x0 + x1) / 2 * s, cy: g + (y0 + y1) / 2 * s, r: Math.max(x1 - x0, y1 - y0) * s / 2 };
}

/** 한 프레임을 그리고 이번 프레임의 배율(px/cm)을 돌려준다 */
/** 한 장소의 그리기 재료. v는 그 장소의 상태(장소·밤·날씨·소품·인물).
    pageShift만큼 세상을 옆으로 밀어, 같은 장소라도 장면마다 다른 건물·사물 배치(새 종이)가 나오게 한다 */
function frameFor(v0, s, g) {
  const k = v0.pageShift || 0;
  const v = k ? { ...v0, camX: v0.camX + k, propX: v0.propX + k, heroStopX: v0.heroStopX + k } : v0;
  const sc = SCENES[v.scene];
  const p = paletteFor(v.scene, v.night, v.weather === 'snow');
  return { sc, p, t: makeTone(p), s, g, v, scroll: v.camX * s };
}

const drawPlace = (f) => { drawSky(f); drawFar(f); drawGround(f); drawCeiling(f); drawItems(f); drawProp(f); drawCast(f); };

/* 장소가 바뀌면 화면을 새로 시작하지 않고, 걸어가는 동안 오른쪽에서 다음 장소가
   찢은 종이 이음선과 함께 이어 붙어 들어온다. v.trans = { prev: 이전 장소 상태, boundaryX: 이음선의 월드 위치(cm) } */
const SEAM_STEP = 14, SEAM_AMP = 2.4, SEAM_SHADE = 16;

function seamClip(bx, rightSide) {
  ctx.beginPath();
  ctx.moveTo(rightSide ? W + 10 : -10, -10);
  for (let y = -10; y <= H + SEAM_STEP; y += SEAM_STEP) ctx.lineTo(bx + wobble(y * 1.3, 7) * SEAM_AMP, y);
  ctx.lineTo(rightSide ? W + 10 : -10, H + 10);
  ctx.closePath();
  ctx.clip();
}

function drawSplit(v, s, g, bx, layer, shade = true) {
  const prev = frameFor({ ...v, ...v.trans.prev }, s, g), next = frameFor(v, s, g);
  ctx.save(); seamClip(bx, false); layer(prev); ctx.restore();
  ctx.save(); seamClip(bx, true); layer(next);
  if (!shade) { ctx.restore(); return next; }
  const shadeGr = ctx.createLinearGradient(bx, 0, bx + SEAM_SHADE, 0);
  shadeGr.addColorStop(0, 'rgba(38,26,58,.28)'); shadeGr.addColorStop(1, 'rgba(38,26,58,0)');
  ctx.fillStyle = shadeGr; ctx.fillRect(bx - 4, 0, SEAM_SHADE + 6, H);
  ctx.restore();
  return next;
}

function drawScene(v, sp, dt) {
  const s = scaleFor(sp);
  const eye = sp ? sp.eye : DEFAULT_EYE;
  // 세로로 긴 휴대폰 화면은 아래쪽을 선택 카드가 덮으므로, 땅과 인물을 화면 위쪽 절반으로 올린다
  const g = H > W * PORTRAIT_TALL ? clamp(H * .35 + eye * s, H * .45, H * .53) : clamp(H * .5 + eye * s, H * .56, H * .78);
  lastFrame = { s, g };
  const bx = v.trans ? (v.trans.boundaryX - v.camX) * s : -1;
  if (v.trans && bx < -SEAM_SHADE) v.trans = null;
  const splitting = v.trans && bx < W + SEAM_SHADE;
  const f = splitting ? drawSplit(v, s, g, bx, drawPlace) : frameFor(v, s, g);
  if (v.trans && !splitting) drawPlace(frameFor({ ...v, ...v.trans.prev }, s, g));
  if (!v.trans) drawPlace(f);
  if (sp) drawHero(f, sp);
  drawKiller(f);
  if (splitting) drawSplit(v, s, g, bx, drawForeground); else drawForeground(v.trans ? frameFor({ ...v, ...v.trans.prev }, s, g) : f);
  // 불빛·연기·비·눈은 장면마다 자기 종이 위에만: 이음선 전에는 지난 장면 것, 이음선이 지나는 동안은 양쪽을 나눠 그린다
  const overlays = (fr) => { drawGlow(fr); drawWeather(fr); };
  stepWeather(v, dt);
  if (splitting) drawSplit(v, s, g, bx, overlays, false);
  else overlays(v.trans ? frameFor({ ...v, ...v.trans.prev }, s, g) : f);
  drawGrain(W, H); drawVignette();
  if (sp) drawTracker(f, sp);
  if (v.fade > 0) R(0, 0, W, H, `rgba(42,36,56,${v.fade})`);
  return s;
}
