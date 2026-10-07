/* 장면 합성: 배경 → 지면 → 사물 → 소품 → 주인공 → 전경 → 빛·날씨 → 종이결 → 추적 표시 */
const TONE_DAY = .14, TONE_NIGHT = .5;
const GROUND_LAYERS = Object.freeze([[.34, .1, 13], [.68, .2, 17]]);
const PORTRAIT_RATIO = .9;
const HERO_SCREEN_X = .3, TRACKER = '#fffaf0', DEFAULT_VIEW_CM = 600, DEFAULT_EYE = 30;
const BANDS = Object.freeze([{ k: 'l', cell: 1500, dens: .6, salt: 3 }, { k: 'm', cell: 340, dens: .55, salt: 7 }, { k: 's', cell: 26, dens: .6, salt: 11 }]);
const PARTICLES = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), v: .6 + Math.random() * .6 }));
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
    cloud: night ? mix(p.skyTop, '#ffffff', .12) : mix(p.skyBottom, '#ffffff', .55),
    farA: mix(p.far1, p.skyBottom, .3), farB: p.far2,
    toneTo: night ? NIGHT_TINT : p.skyBottom, toneAmt: night ? TONE_NIGHT : TONE_DAY,
  };
  palMemo.set(id, out);
  return out;
}

function edgeFill(color, y, amp, salt, scroll) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, H);
  for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, y + amp * wobble(x + scroll, salt));
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
}

function drawGround(f) {
  const { sc, p, g } = f;
  const amp = sc.indoor ? 0 : 1, top = clamp(1.5 * f.s, 3, 12);
  paper(() => edgeFill(p.groundTop, g - 2, amp, 5, f.scroll), .8);
  edgeFill(p.ground, g + top, amp, 9, f.scroll);
  // 앞쪽 땅을 종이 두 장으로 더 겹쳐, 가까울수록 진하고 빨리 지나가게 한다
  const depth = H - g;
  GROUND_LAYERS.forEach(([at, dark, salt]) => {
    paper(() => edgeFill(mix(p.ground, p.ink, dark), g + depth * at, amp * 2, salt, f.scroll * (1 + at)), .9);
  });
}

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
      paper(() => it.d(x, g, s, hash(i, salt + 3), t), b.k === 's' ? .35 : 1);
    }
  });
}

function drawProp(f) {
  const { v, s, g, t } = f;
  const it = v.prop && ITEMS[v.prop];
  if (!it) return;
  const x = (v.propX - v.camX) * s;
  if (x > W || x + it.w * s < 0) return;
  paper(() => it.d(x, g, s, .5, t), 1.1);
}

function drawHero(f, sp) {
  const { s, g, v } = f;
  const draw = ANIMALS[sp.body];
  if (!draw) return;
  const moving = v.speed > sp.speedCm * .3;
  paper(() => { ctx.translate(W * HERO_SCREEN_X, g); ctx.scale(s, s); draw(v.t, moving, sp.eye, f.t); }, .8);
}

const FG = {
  curb(off, fh) {
    edgeFill(ctx.fillStyle, H - fh * .5, 1, 3, off);
    const cell = 260, i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
    for (let i = i0; i <= i1; i++) {
      if (hash(i, 61) > .35) continue;
      const x = i * cell - off + 60;
      ctx.fillRect(x, H - fh * 1.7, 12, fh * 1.7); ctx.beginPath(); ctx.arc(x + 6, H - fh * 1.7, 6, 0, TAU); ctx.fill();
    }
  },
  grass(off, fh) {
    ctx.fillRect(0, H - fh * .3, W, fh * .3);
    const cell = 12, i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 1;
    ctx.beginPath();
    for (let i = i0; i <= i1; i++) {
      const x = i * cell - off, hgt = fh * (.4 + hash(i, 62) * .9);
      ctx.moveTo(x, H - fh * .28); ctx.lineTo(x + 3 + hash(i, 63) * 6, H - fh * .28 - hgt); ctx.lineTo(x + 9, H - fh * .28);
    }
    ctx.fill();
  },
};

function drawForeground(f) {
  const { sc, p } = f;
  if (!sc.fg) return;
  const fh = clamp(H * .08, 26, 70);
  paper(() => { ctx.fillStyle = p.ink; FG[sc.fg](f.scroll * PARALLAX.fg, fh); }, 1.4);
}

function drawGlow(f) {
  const { v, g, s } = f;
  if (!v.night || !v.glow) return;
  const gx = W * .72, gy = Math.max(60, g - Math.min(H * .3, 600 * s)), rad = Math.min(W, H) * .5;
  const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
  rg.addColorStop(0, rgba(v.glow, .32)); rg.addColorStop(1, rgba(v.glow, 0));
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
}

function drawWeather(f, dt) {
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
    pt.y += dt * pt.v * (rain ? 1.6 : .12);
    if (pt.y > 1) { pt.y -= 1; pt.x = Math.random(); }
    const x = pt.x * W + (rain ? 0 : Math.sin(v.t + pt.v * 9) * 8), y = pt.y * H;
    if (rain) { ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 14); } else ctx.rect(x, y, 2.4, 2.4);
  });
  if (rain) ctx.stroke(); else ctx.fill();
}

function drawVignette() {
  if (!vignette) {
    vignette = ctx.createRadialGradient(W / 2, H * .45, Math.min(W, H) * .35, W / 2, H * .45, Math.max(W, H) * .75);
    vignette.addColorStop(0, 'rgba(30,20,45,0)'); vignette.addColorStop(1, 'rgba(30,20,45,.28)');
  }
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);
}

function drawTracker(f, sp) {
  const { s, g } = f;
  const [x0, y0, x1, y1] = sp.box, pad = 6, cx = W * HERO_SCREEN_X;
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
  return { cx: W * HERO_SCREEN_X + (x0 + x1) / 2 * s, cy: g + (y0 + y1) / 2 * s, r: Math.max(x1 - x0, y1 - y0) * s / 2 };
}

/** 한 프레임을 그리고 이번 프레임의 배율(px/cm)을 돌려준다 */
function drawScene(v, sp, dt) {
  const sc = SCENES[v.scene];
  // 세로로 긴 휴대폰 화면에서도 동물이 너무 작아지지 않게, 화면 폭과 높이 중 큰 쪽을 기준으로 배율을 잡는다
  const s = Math.max(W, H * PORTRAIT_RATIO) / (sp ? sp.viewCm : DEFAULT_VIEW_CM);
  const eye = sp ? sp.eye : DEFAULT_EYE;
  const g = clamp(H * .5 + eye * s, H * .56, H * .78);
  const p = paletteFor(v.scene, v.night, v.weather === 'snow');
  const f = { sc, p, t: makeTone(p), s, g, v, scroll: v.camX * s };
  lastFrame = { s, g };
  drawSky(f); drawFar(f); drawWalls(f); drawCeiling(f); drawGround(f);
  drawItems(f); drawProp(f);
  if (sp) drawHero(f, sp);
  drawForeground(f); drawGlow(f); drawWeather(f, dt);
  drawGrain(W, H); drawVignette();
  if (sp) drawTracker(f, sp);
  if (v.fade > 0) R(0, 0, W, H, `rgba(42,36,56,${v.fade})`);
  return s;
}
