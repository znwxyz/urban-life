/* 배경 레이어: 하늘, 먼 산, 먼 풍경 3겹(먼 동네 · 가까운 동네 · 담장과 전깃줄), 건물 외벽, 실내 벽, 천장.
   f = { sc 배경, p 팔레트, t 색조함수, s px/cm, g 지면y, v 화면상태, scroll 스크롤px }
   먼 풍경은 화면 px 기준으로 그리고, 건물 외벽과 실내는 cm 기준(배율 s)으로 그린다.
   모든 층은 땅과 같은 방향으로만 움직인다: 먼 층일수록 느리게(PARALLAX), 구름만 아주 느리게 왼쪽으로 흐른다 */
const PARALLAX = Object.freeze({ cloud: .02, ridge: .025, far1: .05, far2: .12, near: .3, fg: 1.6 });
const CLOUD_DRIFT = 3;   // px/초, 왼쪽으로
const LIT = '#ffd88a', STORE_LIT = '#fff1cf', LAMP = '#fff0c4';
const SIGNS = Object.freeze(['#e6765f', '#5fa39a', '#f0c27a', '#5f8fb0', '#f4f1ea', '#c97b9c']);
const STARS = Array.from({ length: 70 }, (_, i) => ({ x: hash(i, 1), y: hash(i, 2) * .7, r: .6 + hash(i, 3) * 1.1, p: hash(i, 4) * TAU }));
/* 먼 풍경 띠 그림의 최대 해상도 배율: 먼 층은 원래 흐릿해서 레티나에서도 1.5배면 충분하고 메모리를 아낀다 */
const FAR_RES_MAX = 1.5;
const MACRO_FROM = 6, MACRO_RANGE = 30, MACRO_HAZE = .45;
let W = 0, H = 0;
const mod = (a, m) => ((a % m) + m) % m;

/* ── 하늘 ── */
/* 해(밤에는 달)는 지평선 가까이, 주인공(왼쪽)과 선택 카드(오른쪽 아래) 사이 하늘에 둔다.
   큰 빛무리가 하늘의 40% 남짓을 물들여 장면의 빛을 정한다 (Alto처럼) */
const SUN = Object.freeze({ x: .42, y: .4, r: .045, glow: .6, glowAlpha: .6, core: 7, coreAlpha: .55 });
const SKY_MID_AT = .58;
const MOON_GLOW = '#9fb2ff', MOON_GLOW_ALPHA = .35;

const sunAt = (g) => ({ x: W * SUN.x, y: g * SUN.y, r: Math.min(W, H) * SUN.r });
/** 해 빛무리 색: 장면이 정해 두지 않으면 해를 지평선색 쪽으로 조금 물들인다. 밤에는 차가운 달빛 */
const glowOf = (p, night) => (night ? MOON_GLOW : p.sunGlow || mix(p.sun, p.skyBottom, .25));

function drawSky(f) {
  const { sc, p, g, v } = f;
  skyGradient(f);
  if (sc.indoor) return;
  const sun = sunAt(g);
  if (v.night) {
    STARS.forEach((st) => {
      const x = st.x * W, y = st.y * g;
      if (Math.hypot(x - sun.x, y - sun.y) < sun.r * 4) return;   // 달빛 속 별은 묻힌다
      ctx.globalAlpha = .45 + .4 * Math.sin(v.t * 1.3 + st.p); E(x, y, st.r, st.r, '#fff6dc');
    });
    ctx.globalAlpha = 1;
  }
  const pad = sun.r * 1.6 + 4;
  spriteDraw(`sun|${p.sun}|${p.skyBottom}|${v.night}|${sun.r}`, sun.x, sun.y, [pad, pad, pad * 2, pad * 2], (x, y) => drawSun(f, x, y, sun.r));
  for (let i = 0; i < 4; i++) {
    const k = (1 - i * .16) * (i % 2 ? .8 : 1), cy = g * (.12 + .085 * i);
    const cx = mod(i * W * .37 + 90 - f.scroll * PARALLAX.cloud * (1 + i * .4) - v.t * CLOUD_DRIFT * (1 - i * .16), W + 360) - 180;
    spriteDraw(`cloud|${k}|${p.cloud}|${p.cloudShade}`, cx, cy, [90 * k + 16, 60 * k + 16, 180 * k + 32, 76 * k + 32], (x, y) => cloud(x, y, k, p.cloud, p.cloudShade));
  }
}

let skyLayer = null;
/** 하늘: 위 · 가운데 · 지평선 세 색 그러데이션에 해(달) 빛무리를 더한다. 장면·밤낮·화면 크기가 같으면 한 번 그린 것을 그대로 찍는다 */
function skyGradient(f) {
  const { sc, p, g, v } = f, d = dprNow(), night = !!v.night;
  const mid = p.skyMid || mix(p.skyTop, p.skyBottom, .5), glow = glowOf(p, night);
  const key = `${p.skyTop}|${mid}|${p.skyBottom}|${glow}|${night}|${sc.indoor}|${g}|${W}|${H}|${d}`;
  if (!skyLayer || skyLayer.key !== key) {
    const c = makeLayer(W, H, d);
    bake(c, W, 0, d, () => {
      const gr = ctx.createLinearGradient(0, 0, 0, sc.indoor ? H : g);
      gr.addColorStop(0, p.skyTop); gr.addColorStop(SKY_MID_AT, mid); gr.addColorStop(1, p.skyBottom);
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      if (!sc.indoor) sunGlow(g, glow, night ? MOON_GLOW_ALPHA : SUN.glowAlpha);
    });
    skyLayer = { key, c };
  }
  ctx.drawImage(skyLayer.c, 0, 0, W, H);
}

/** 해(달) 둘레로 부드럽게 번지는 큰 빛무리 */
function sunGlow(g, color, alpha) {
  const { x, y } = sunAt(g), rad = Math.max(W, H) * SUN.glow;
  const rg = ctx.createRadialGradient(x, y, 0, x, y, rad);
  rg.addColorStop(0, rgba(color, alpha)); rg.addColorStop(.25, rgba(color, alpha * .5));
  rg.addColorStop(.6, rgba(color, alpha * .2)); rg.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
  const r = Math.min(W, H) * SUN.r * SUN.core, core = ctx.createRadialGradient(x, y, 0, x, y, r);   // 해 바로 둘레의 뜨거운 빛
  core.addColorStop(0, rgba(color, SUN.coreAlpha)); core.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = core; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** 해(밤에는 달): 빛나는 원판. 그림자 없이 바로 둘레만 한 겹 밝힌다 */
function drawSun(f, x, y, r) {
  const { p, v } = f;
  ctx.globalAlpha = .3; E(x, y, r * 1.45, r * 1.45, p.sun);
  ctx.globalAlpha = 1;
  E(x, y, r, r, p.sun);
  if (!v.night) return;
  const crater = mix(p.sun, p.skyBottom, .14);
  E(x - r * .32, y - r * .18, r * .2, r * .18, crater); E(x + r * .3, y + r * .28, r * .14, r * .12, crater); E(x + r * .1, y - r * .45, r * .08, r * .08, crater);
}

const CLOUD_BUMPS = Object.freeze([[-40, 0, 30, 15], [-10, -10, 32, 24], [24, -5, 27, 19], [52, 1, 19, 12]]);
/** 바닥이 판판한 구름 (알토 풍): 아래에 그늘 종이를 한 장 더 댄다 */
function cloud(cx, cy, k, c, under) {
  const puff = (dy, color, cut) => {
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 90 * k, cy - 60 * k, 180 * k, 60 * k + cut * k); ctx.clip();
    CLOUD_BUMPS.forEach(([dx, by, rx, ry]) => E(cx + dx * k, cy + (by + dy) * k, rx * k, ry * k, color));
    ctx.restore();
  };
  puff(5, under, 10);
  puff(0, c, 6);
}

/* ── 먼 풍경 ── */
/** 아주 작은 동물에게는 먼 풍경이 뿌옇게 흐려 보인다 (접사 렌즈의 얕은 심도) */
const hazeOf = (s) => clamp((s - MACRO_FROM) / MACRO_RANGE, 0, MACRO_HAZE);

/* 대기 원근: 먼 층일수록 지평선 하늘색 쪽으로 고정 비율만큼 섞는다 (색상과 밝기 모두).
   층 이름 → [섞는 비율, 밑동 안개띠 진하기]. 안개띠는 층 바닥에서 층 높이의 FOG_RISE까지 올라오며 옅어진다 */
const FAR_FOG = Object.freeze({ ridge0: [.85, .8], ridge1: [.72, .8], a: [.55, .75], b: [.35, .6], near: [.15, .35] });
const FOG_RISE = .25, FOG_MAX = .92;
/* 지금 굽고 있는 층의 안개: 층 안 디테일 색도 같은 비율로 지평선색에 섞는다.
   밤에는 디테일 색(유리·간판·나무색)도 먼 층 깊이만큼 밤빛으로 어둡게 한 뒤 섞는다. 불 켜진 창(LIT)만 그대로 밝다 */
const FAR_NIGHT_DEPTH = .6;
let fog = { to: '#ffffff', amt: 0, night: false };
const fogC = (c) => mix(fog.night ? nightTone(c, FAR_NIGHT_DEPTH) : c, fog.to, fog.amt);

function drawFar(f) {
  const { sc, p, g, s } = f;
  const cfg = FAR[sc.far];
  if (!cfg) return;
  const hz = hazeOf(s), key = `${f.v.scene}|${f.v.night}|${p.far1}|${p.far2}|${p.skyBottom}|${hz}|${g}`;
  const res = Math.min(dprNow(), FAR_RES_MAX);
  /* 층 하나: 섞는 비율을 정하고, 그 색으로 그린 뒤 밑동에 안개띠를 덮는다 */
  const strip = (name, layer, off, y0, hgt, base, draw) => {
    const top = Math.max(0, y0), [amt, fogA] = FAR_FOG[layer];
    stripBlit(`${name}|${f.v.scene}`, key, off, top, g + 6 - top, (o) => {
      fog = { to: p.skyBottom, amt: Math.min(FOG_MAX, amt + hz * (1 - amt)), night: !!f.v.night };
      draw(o, fogC(base));
      fogBand(g, hgt * FOG_RISE, fogA);
    }, res);
  };
  const maxR = g * .34;
  [[1, 0, 'ridge0'], [.7, 1.7, 'ridge1']].forEach(([k, ph, layer]) => {
    strip(`ridge${ph}`, layer, f.scroll * PARALLAX.ridge * (1 + ph * .2), g - maxR * k * 1.05 - 8, maxR * k, p.far1, (o, c) => ridgeLayer(f, o, maxR, c, k, ph));
  });
  [[cfg.a, PARALLAX.far1, p.far1, 0, 'a'], [cfg.b, PARALLAX.far2, p.far2, 1, 'b']].forEach(([L, k, base, li, layer]) => {
    strip(`far${li}`, layer, f.scroll * k, g - g * L.h - 50, g * L.h, base, (o, c) => farLayer(f, L, o, g * L.h, c, li));
  });
  if (cfg.near) strip('near', 'near', f.scroll * PARALLAX.near, g * .2 - 30, g * .1, mix(p.far2, p.ink, .3), (o, c) => cfg.near(f, o, c));
}

/** 층 밑동의 안개띠: 이 층의 그림 위에만(source-atop) 지평선색을 아래에서 위로 옅어지게 덮는다 */
function fogBand(g, rise, alpha) {
  if (alpha <= 0 || rise <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  const gr = ctx.createLinearGradient(0, g, 0, g - rise);
  gr.addColorStop(0, rgba(fog.to, alpha)); gr.addColorStop(1, rgba(fog.to, 0));
  ctx.fillStyle = gr; ctx.fillRect(0, g - rise, W, rise + 8);
  ctx.restore();
}

/** 도시를 둘러싼 먼 산 한 겹 (찢은 종이 능선, 그림자 없는 실루엣). off는 이 능선의 스크롤 px */
function ridgeLayer(f, off, maxH, c, k, ph) {
  const { g } = f;
  ctx.fillStyle = c;
  ctx.beginPath(); ctx.moveTo(-10, g);
  for (let x = -10; x <= W + 12; x += 12) {
    const X = (x + off) / (1 + ph * .3);
    const y = g - maxH * k * (.55 + .28 * Math.sin(X / 310 + ph) + .14 * Math.sin(X / 97 + 1 + ph) + .04 * Math.sin(X / 23));
    ctx.lineTo(x, y + (hash(Math.floor(X / 12), 5 + ph) - .5) * 2.4);
  }
  ctx.lineTo(W + 12, g); ctx.closePath(); ctx.fill();
}

function farLayer(f, cfg, off, maxH, color, li) {
  const i0 = Math.floor(off / cfg.cell) - 1, i1 = Math.floor((off + W) / cfg.cell) + 1;
  for (let i = i0; i <= i1; i++) cfg.draw(f, i * cfg.cell - off, i, maxH, color, li);
}

/** 앞면 + 오른쪽 그늘면을 가진 먼 건물 몸통. 먼 층일수록 그늘면도 공기에 묻혀 옅어진다 (그림자 없음) */
function farBody(x, top, bw, bh, c, side = .18) {
  R(x, top, bw, bh, c);
  R(x + bw * (1 - side), top, bw * side, bh, mix(shade(c), c, fog.amt));
}

/* 가장 먼 건물 층은 디테일 없는 실루엣: 밤에만 작은 불빛 몇 개가 남는다 */
const farLit = (x, y, w, h) => { ctx.globalAlpha = FAR_LIT_ALPHA; R(x, y, w, h, LIT); ctx.globalAlpha = 1; };

const litAt = (f, a, b, p) => f.v.night && hash(a, b) < p;
const FAR_LIT_ALPHA = .7;

/* 아파트: 판상형 동, 확장한 베란다 줄, 엘리베이터 탑, 동 번호 */
function aptFar(f, x, i, maxH, c) {
  const { g } = f, bw = 92 + hash(i, 2) * 20, bh = maxH * (.62 + .38 * hash(i, 3)), top = g - bh;
  R(x, top, bw, bh, c);
  R(x + bw * .34, top - 7, bw * .18, 7, c);
  if (!f.v.night) return;
  for (let y = top + 8, r = 0; y < g - 4; y += 7, r++) if (hash(i * 53 + r, 7) < .14) farLit(x + 4 + hash(i + r, 8) * bw * .7, y - 1.5, 4, 2.5);
}

function aptNear(f, x, i, maxH, c) {
  const { g, p } = f, bw = 128 + hash(i, 12) * 36, bh = maxH * (.72 + .28 * hash(i, 13)), top = g - bh, face = bw * .84;
  farBody(x, top, bw, bh, c, .16);
  const glass = mix(c, fogC(p.glass), .4), rail = mix(c, fogC('#ffffff'), .2), core = mix(shade(c), c, fog.amt);
  R(x + face * .45, top, face * .1, bh, core);                                                    // 계단실
  for (let y = top + 22, fl = 0; y < g - 8; y += 10, fl++) {
    [[.05, 0], [.58, 1]].forEach(([u, side]) => {
      const lit = litAt(f, i * 97 + fl * 3 + side, 9, .15);
      R(x + face * u, y, face * .37, 5.5, lit ? LIT : glass);
    });
    R(x + face * .03, y + 6.5, face * .94, 1.2, rail);
  }
  R(x - 2, top - 3, face + 4, 3, rail);                                                           // 옥상 난간
  farBody(x + face * .38, top - 15, face * .24, 12, c, .25);                                     // 엘리베이터 탑
  E(x + face * .5, top - 9, 3, 3, rail);
}

/* 빌라: 4~5층 상자, 옥상 물탱크·옥탑방, 방범창, 실외기, 가스관 */
const VILLA_TINTS = Object.freeze(['#c47468', '#e9dcc6', '#9aa0b4', '#d9b27c']);
function villaFar(f, x, i, maxH, c) {
  const { g } = f, bw = 58 + hash(i, 22) * 34, bh = maxH * (.32 + .36 * hash(i, 23)), top = g - bh;
  R(x, top, bw, bh, c);
  if (hash(i, 24) > .62) P([[x - 3, top + 1], [x + bw * .45, top - 13], [x + bw + 3, top + 1]], c);
  else R(x + bw * .58, top - 9, 11, 9, c);
  if (!f.v.night) return;
  for (let fl = 0; fl < 4; fl++) if (hash(i * 11 + fl, 25) < .3) farLit(x + bw * (.15 + hash(i + fl, 26) * .5), top + 8 + fl * (bh / 4.4), 5, 3);
}

function villaNear(f, x, i, maxH, c0) {
  const { g, p } = f, bw = 84 + hash(i, 32) * 40, bh = maxH * (.48 + .45 * hash(i, 33)), top = g - bh, face = bw * .82;
  const c = mix(c0, fogC(VILLA_TINTS[Math.floor(hash(i, 34) * VILLA_TINTS.length)]), .22);
  farBody(x, top, bw, bh, c);
  const frame = mix(c, fogC('#ffffff'), .22), glassC = mix(c, fogC(p.ink), .32), bar = mix(c, fogC('#ffffff'), .12);
  R(x + face * .9, top + 6, 1.6, bh - 6, mix(c, fogC('#e8c24a'), .35));                           // 가스관
  for (let fl = 0, y = top + 9; y < g - 14; y += 17, fl++) {
    [.1, .52].forEach((u, k) => {
      const wx = x + face * u, ww = face * .26, lit = litAt(f, i * 41 + fl * 5 + k, 35, .22);
      R(wx - 1, y - 1, ww + 2, 11, frame); R(wx, y, ww, 9, lit ? LIT : glassC);
      ctx.fillStyle = bar; for (let b = 1; b < 4; b++) ctx.fillRect(wx + (ww * b) / 4, y, .9, 9);   // 방범창
      if (hash(i * 13 + fl * 3 + k, 36) > .6) { R(wx + ww + 1.5, y + 4, 7, 5.5, frame); E(wx + ww + 5, y + 6.7, 1.6, 1.6, glassC); }   // 실외기
    });
  }
  R(x - 1.5, top - 3, face + 3, 3, frame);
  const tank = mix(c, fogC('#7fb3d9'), .3);
  if (hash(i, 37) > .45) { RR(x + face * .6, top - 15, 15, 12, 3, tank); R(x + face * .6, top - 11, 15, 1.4, shade(tank)); R(x + face * .64, top - 3, 1.5, 3, tank); R(x + face * .6 + 11, top - 3, 1.5, 3, tank); }
  else { E(x + face * .66, top - 9, 7, 8, tank); E(x + face * .66, top - 16, 7, 2.2, mix(tank, fogC('#ffffff'), .25)); }
  if (hash(i, 38) < .35) { farBody(x + face * .08, top - 13, face * .3, 13, c, .2); R(x + face * .14, top - 10, 5, 10, glassC); }   // 옥탑방
}

/* 도심: 층마다 간판, 세로 간판, 옥상 광고판, 안테나 */
function cityFar(f, x, i, maxH, c) {
  const { g } = f, bw = 52 + hash(i, 42) * 30, bh = maxH * (.42 + .58 * hash(i, 43)), top = g - bh;
  R(x, top, bw, bh, c);
  if (hash(i, 44) > .5) R(x + bw * .2, top - bh * .08, bw * .5, bh * .08 + 1, c);
  if (hash(i, 45) > .6) R(x + bw * .4, top - bh * .08 - 14, 1.2, 14, c);
  if (!f.v.night) return;
  for (let r = 0; r < 6; r++) if (hash(i * 7 + r, 46) < .3) farLit(x + 4 + hash(i + r, 47) * bw * .6, top + 6 + hash(i + r, 48) * (bh - 12), 3, 2.5);
}

function cityNear(f, x, i, maxH, c) {
  const { g, p, v } = f, bw = 78 + hash(i, 52) * 36, bh = maxH * (.45 + .5 * hash(i, 53)), top = g - bh, face = bw * .82;
  farBody(x, top, bw, bh, c);
  const glassC = mix(c, fogC(p.glass), .35), signGlow = v.night ? .12 : 0;
  for (let fl = 0, y = top + 7; y < g - 10; y += 15, fl++) {
    R(x + face * .06, y, face * .88, 6, litAt(f, i * 19 + fl, 54, .16) ? LIT : glassC);
    for (let m = 1; m < 4; m++) R(x + face * (.06 + .22 * m), y, 1, 6, c);
    if (hash(i * 23 + fl, 55) < .55) {
      const sc = mix(mix(fogC(SIGNS[Math.floor(hash(i + fl, 56) * SIGNS.length)]), c, .35), '#ffffff', signGlow);
      R(x + face * .04, y + 7.5, face * .92, 5.5, sc);
      R(x + face * .2, y + 9.5, face * .3, 1.4, mix(sc, '#ffffff', .5));
    }
  }
  const vs = mix(mix(fogC(SIGNS[Math.floor(hash(i, 57) * SIGNS.length)]), c, .25), '#ffffff', signGlow);
  RR(x + face - 3, top + bh * .12, 8, bh * .45, 1.5, vs);                                         // 세로 간판
  for (let k = 0; k < 4; k++) R(x + face - .5, top + bh * .15 + k * bh * .1, 3, bh * .05, mix(vs, fogC('#3b3049'), .3));
  if (hash(i, 58) > .62) {                                                                         // 옥상 광고판
    L(x + face * .3, top, x + face * .3, top - 10, c, 1.2); L(x + face * .7, top, x + face * .7, top - 10, c, 1.2);
    R(x + face * .15, top - 24, face * .7, 14, mix(c, fogC('#ffffff'), .2 + signGlow));
  } else { R(x + face * .1, top - 5, 9, 5, mix(c, fogC('#ffffff'), .2)); R(x + face * .3, top - 5, 9, 5, mix(c, fogC('#ffffff'), .2)); }
}

/* 공원: 산자락 숲, 나무 무리, 정자, 운동기구, 가로등 */
function treesFar(f, x, i, maxH, c) {
  const { g } = f, base = g - maxH * (.18 + .12 * Math.sin(i * .7));
  const r = 14 + hash(i, 62) * 12;
  if (hash(i, 63) > .55) P([[x - r * .7, g], [x, base - r * 2.2], [x + r * .7, g]], c);
  else { R(x - 1.5, base, 3, g - base, c); E(x, base - r * .6, r, r * 1.05, c); }
}

function parkNear(f, x, i, maxH, c) {
  const kind = hash(i, 72);
  if (kind < .16) pavilion(f, x, maxH, c);
  else if (kind < .28) gymBars(f, x, maxH, c);
  else treeClump(f, x, i, maxH, c);
}

function treeClump(f, x, i, maxH, c) {
  const { g } = f, n = 2 + Math.floor(hash(i, 73) * 2);
  for (let k = 0; k < n; k++) {
    const tx = x + k * 38 + hash(i + k, 74) * 16, th = maxH * (.55 + hash(i + k, 75) * .4), r = 18 + hash(i + k, 76) * 14;
    const dark = mix(shade(c), c, fog.amt);
    R(tx - 2, g - th * .55, 4, th * .55, dark);
    E(tx, g - th * .62, r, r * .9, dark); E(tx - r * .35, g - th * .7, r * .8, r * .75, c); E(tx + r * .3, g - th * .8, r * .6, r * .55, mix(c, fogC('#ffffff'), .1));
  }
}

/** 정자: 처마 끝이 살짝 들린 지붕 */
function pavilion(f, x, maxH, c) {
  const { g } = f, w = 70, h = maxH * .5, roof = mix(c, fogC('#3b3049'), .2);
  [.12, .88].forEach((u) => R(x + w * u - 1.5, g - h, 3, h, mix(shade(c), c, fog.amt)));
  R(x + 4, g - h * .35, w - 8, 2.5, c);
  curvy([[x - 12, g - h + 2], [x + 4, g - h - 2, x + 14, g - h - 14], [x + w - 14, g - h - 14], [x + w - 4, g - h - 2, x + w + 12, g - h + 2], [x + w / 2, g - h - 4]], roof);
  R(x + w * .4, g - h - 22, w * .2, 8, roof);
}

/** 운동기구: 철봉과 허리 돌리기 */
function gymBars(f, x, maxH, c) {
  const { g } = f, h = maxH * .3, k = mix(c, fogC('#5f8fb0'), .3);
  L(x, g, x, g - h, k, 2.4); L(x + 34, g, x + 34, g - h, k, 2.4); L(x, g - h, x + 34, g - h, k, 2);
  L(x + 52, g, x + 52, g - h * .7, k, 2.4);
  ctx.strokeStyle = k; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x + 52, g - h * .7, 9, 3, 0, 0, TAU); ctx.stroke();
}

/* 가장 가까운 먼 층: 담장, 전봇대와 늘어진 전깃줄, 화단 울타리, 가로등 */
function poleRow(f, off, c, cell, hgt, lamps, wires = true) {
  const { g, v } = f;
  const i0 = Math.floor(off / cell) - 1, i1 = Math.floor((off + W) / cell) + 2;
  let prev = null;
  ctx.lineCap = 'round';
  for (let i = i0; i <= i1; i++) {
    const x = i * cell - off + hash(i, 81) * cell * .2, top = g - hgt * (.9 + hash(i, 82) * .1);
    R(x - 3, top, 6, g - top, c);
    R(x - 16, top + 10, 32, 3, c); R(x - 11, top + 22, 22, 2.5, c);
    if (hash(i, 83) > .55) RR(x + 4, top + 30, 9, 14, 3, c);                                        // 변압기
    if (lamps) {
      L(x, top + 40, x + 16, top + 34, c, 2);
      if (v.night) { ctx.globalAlpha = .3; E(x + 18, top + 38, 16, 16, LAMP); ctx.globalAlpha = 1; }
      E(x + 18, top + 36, 4, 2.5, v.night ? LAMP : c);
    }
    if (prev && wires) {
      ctx.strokeStyle = c; ctx.lineWidth = 1;
      [[-15, 10, 26], [15, 10, 20], [-10, 22, 30]].forEach(([dx, dy, sag]) => {
        ctx.beginPath(); ctx.moveTo(prev.x + dx, prev.top + dy);
        ctx.quadraticCurveTo((prev.x + x) / 2, Math.max(prev.top, top) + dy + sag, x + dx, top + dy); ctx.stroke();
      });
    }
    prev = { x, top };
  }
}

/** 낮은 담장: 위에 기와 대신 시멘트 갓돌 */
function lowWall(f, off, c, hgt) {
  const { g } = f, cap = mix(c, fogC('#ffffff'), .2);
  R(0, g - hgt, W, hgt, c);
  R(0, g - hgt - 3, W, 4, cap);
  ctx.fillStyle = shade(c);
  for (let x = -mod(off, 46); x < W; x += 46) ctx.fillRect(x, g - hgt + 1, 1.2, hgt - 1);
}

/** 둥근 덤불 울타리 */
function hedge(f, off, c, hgt, cell) {
  const { g } = f;
  ctx.fillStyle = c;
  ctx.beginPath(); ctx.moveTo(-cell, g);
  for (let x = -mod(off, cell) - cell; x < W + cell; x += cell) {
    const n = Math.floor((x + off) / cell), r = cell * (.55 + hash(n, 85) * .35);
    ctx.arc(x + cell / 2, g - hgt + r * .4, r, Math.PI, 0);
  }
  ctx.lineTo(W + cell, g); ctx.closePath(); ctx.fill();
}

function railFence(f, off, c, hgt) {
  const { g } = f;
  ctx.fillStyle = c;
  ctx.fillRect(0, g - hgt, W, 2); ctx.fillRect(0, g - hgt * .45, W, 1.5);
  for (let x = -mod(off, 9); x < W; x += 9) ctx.fillRect(x, g - hgt - 3, 1.4, hgt + 3);
}

const FAR = {
  apartments: { a: { cell: 150, h: .66, draw: aptFar }, b: { cell: 230, h: .5, draw: aptNear },
    near(f, off, c) { const green = mix(c, fogC('#5f8f6c'), .45); hedge(f, off, green, f.g * .07, 26); railFence(f, off, c, f.g * .06); } },
  villas: { a: { cell: 100, h: .62, draw: villaFar }, b: { cell: 140, h: .44, draw: villaNear },
    near(f, off, c) { hedge(f, off * .9, mix(c, fogC('#6a9c78'), .35), f.g * .085, 22); lowWall(f, off, c, f.g * .06); poleRow(f, off, c, 360, f.g * .62, false); } },
  city: { a: { cell: 95, h: .66, draw: cityFar }, b: { cell: 122, h: .48, draw: cityNear },
    near(f, off, c) { poleRow(f, off, c, 330, f.g * .66, true); } },
  trees: { a: { cell: 22, h: .5, draw: treesFar }, b: { cell: 150, h: .36, draw: parkNear },
    near(f, off, c) { hedge(f, off, mix(c, fogC('#5f8f6c'), .5), f.g * .05, 30); poleRow(f, off, c, 520, f.g * .3, true, false); } },
};

/* ── 바깥 건물 (cm 기준) ── */
function drawFacades(f) {
  const { sc, p, s, g, v } = f;
  const w = sc.wall, seg = 1100;
  const i0 = Math.floor(v.camX / seg) - 1, i1 = Math.floor((v.camX + W / s) / seg) + 1;
  if (i1 - i0 > 120) return;
  for (let i = i0; i <= i1; i++) {
    const x = (i * seg - v.camX) * s, bw = seg * s * .985, hh = w.h * (.8 + hash(i, 21) * .4), top = g - hh * s;
    if (x > W || x + bw < 0) continue;
    const face = hash(i, 22) < .5 ? p.wall : p.wallAlt;
    paper(() => R(x, top, bw, hh * s, face));
    const mat = FACADE_MATERIAL[w.style];
    if (mat) lay(mat, s, -v.camX * s, g, 1, () => ctx.fillRect(x, top, bw * .9, hh * s));
    R(x + bw * .9, top, bw * .1, hh * s, p.wallShade);
    R(x, top, bw, Math.max(2, 12 * s), p.wallShade);
    R(x, g - Math.max(2, 18 * s), bw * .9, Math.max(2, 18 * s), mix(p.wallShade, p.ink, .2));       // 밑단 물받이 띠
    FACADES[w.style](f, x, top, bw, hh, i);
  }
}

const FACADE_MATERIAL = Object.freeze({ villa: 'brick', concrete: 'concrete' });
/** 글자가 너무 작거나 너무 크면 그리지 않는다 */
function label(text, x, y, sizePx, color) {
  if (sizePx < 6 || sizePx > 260) return;
  ctx.fillStyle = color; ctx.font = `${Math.round(sizePx)}px "Galmuri11", monospace`; ctx.fillText(text, x, y);
}

const FACADES = {
  villa(f, x, top, bw, hh, i) {
    const { p, s, g } = f;
    windowGrid(f, x, bw * .9, hh, i, { from: 120, step: 280, w: 140, h: 110, gap: 320, bars: true, ac: true });
    gasPipe(f, x + bw * .82, top);
    RR(x + 40 * s, g - 232 * s, 64 * s, 22 * s, 3 * s, '#3f6fa8');                                  // 번지 표지판
    label(`골목 ${12 + mod(i, 30)}`, x + 45 * s, g - 216 * s, 10 * s, p.light);
  },
  concrete(f, x, top, bw, hh, i) {
    const { p, s, g, v } = f;
    paper(() => R(x + 112 * s, g - 218 * s, 111 * s, 218 * s, shade(p.wallShade)), .6);            // 뒷문
    R(x + 120 * s, g - 210 * s, 95 * s, 210 * s, mix(p.wallShade, '#6f8a9a', .3));
    R(x + 120 * s, g - 60 * s, 95 * s, 40 * s, mix(p.wallShade, p.light, .2));
    RR(x + 196 * s, g - 115 * s, 6 * s, 26 * s, 2 * s, p.light);
    exhaustFan(f, x + 420 * s, g - 260 * s);
    R(x + 700 * s, top, 10 * s, g - top, shade(p.wall));                                             // 배관
    for (let y = g - 80 * s; y > top; y -= 160 * s) R(x + 694 * s, y, 22 * s, 5 * s, mix(p.wallShade, p.ink, .2));
    const lit = v.night;
    paper(() => RR(x + 820 * s, g - 360 * s, 200 * s, 60 * s, 8 * s, lit ? mix(p.accent, '#ffffff', .25) : p.accent), .8);   // 간판
    label('맛 집', x + 850 * s, g - 318 * s, 34 * s, p.light);
    windowGrid(f, x, bw * .9, hh, i, { from: 420, step: 280, w: 100, h: 70, gap: 360, bars: true });
  },
  store(f, x, top, bw, hh, i) {
    const { p, s, g, v } = f;
    const glassW = bw * .8, gx = x + 40 * s, mullion = 120 * s;
    paper(() => R(gx, g - 250 * s, glassW, 240 * s, v.night ? STORE_LIT : p.glass), .6);
    storeShelves(f, gx, glassW);
    for (let k = 1; k * mullion < glassW; k++) R(gx + k * mullion, g - 250 * s, 4 * s, 240 * s, p.wallShade);
    for (let k = 0; k < 3; k++) {                                                                      // 유리에 붙은 행사 포스터
      const px = gx + (40 + k * 360 + hash(i + k, 3) * 60) * s;
      if (px > gx + glassW - 70 * s) continue;
      RR(px, g - 210 * s, 60 * s, 80 * s, 3 * s, k % 2 ? '#f0c27a' : p.accent);
      label(k % 2 ? '1+1' : '2+1', px + 8 * s, g - 160 * s, 20 * s, p.light);
    }
    paper(() => R(x, g - 300 * s, bw * .92, 34 * s, p.accent), .8);                                 // 간판 띠
    R(x, g - 272 * s, bw * .92, 4 * s, mix(p.accent, '#ffffff', .4));
    label('편의점 24', x + 60 * s, g - 276 * s, 22 * s, p.light);
    windowGrid(f, x, bw * .9, hh, i, { from: 420, step: 300, w: 140, h: 120, gap: 320, ac: true });
  },
};

/** 편의점 진열대: 유리 너머로 줄지은 상품 */
function storeShelves(f, gx, glassW) {
  const { p, s, g, v } = f;
  if (s < .6) return;
  const shelf = mix(p.wallShade, p.glass, .4), cols = Math.min(Math.ceil(glassW / (12 * s)), 260);
  [60, 110, 160, 205].forEach((hy, r) => {
    R(gx, g - hy * s, glassW, 3 * s, shelf);
    for (let c = 0; c < cols; c++) {
      const hgt = (14 + hash(c, r + 1) * 14) * s;
      ctx.globalAlpha = v.night ? .8 : .5;
      R(gx + c * 12 * s + s, g - hy * s - hgt, 10 * s, hgt, SIGNS[Math.floor(hash(c, r + 7) * SIGNS.length)]);
    }
  });
  ctx.globalAlpha = 1;
}

/** 노란 가스관과 계량기 */
function gasPipe(f, x, top) {
  const { s, g } = f, pipe = '#e8c24a';
  R(x, top + 20 * s, 5 * s, g - top - 20 * s, pipe);
  for (let y = g - 60 * s; y > top + 40 * s; y -= 150 * s) R(x - 3 * s, y, 11 * s, 3 * s, shade(pipe));
  paper(() => RR(x - 14 * s, g - 175 * s, 32 * s, 40 * s, 3 * s, '#e9e4ec'), .5);
  E(x + 2 * s, g - 160 * s, 8 * s, 8 * s, '#f6f3ec'); L(x + 2 * s, g - 160 * s, x + 6 * s, g - 165 * s, '#3b3049', Math.max(.6, s));
}

/** 식당 환풍기: 기름때 낀 사각 틀과 천천히 도는 날개 */
function exhaustFan(f, cx, cy) {
  const { p, s } = f;
  paper(() => RR(cx - 38 * s, cy - 38 * s, 76 * s, 76 * s, 6 * s, shade(p.wall)), .7);
  fanBlades(f, cx, cy);
  ctx.fillStyle = rgba(p.ink, .2);
  curvy([[cx - 30 * s, cy + 38 * s], [cx + 30 * s, cy + 38 * s], [cx + 22 * s, cy + 70 * s], [cx + 10 * s, cy + 52 * s], [cx, cy + 95 * s], [cx - 12 * s, cy + 55 * s], [cx - 26 * s, cy + 64 * s]], ctx.fillStyle);   // 흘러내린 기름때
}

/** 환풍기 안쪽: 어두운 구멍, 천천히 도는 날개, 축 */
function fanBlades(f, cx, cy) {
  const { p, s, v } = f;
  E(cx, cy, 30 * s, 30 * s, p.ink);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(v.t * 2.2);
  for (let k = 0; k < 4; k++) { ctx.rotate(TAU / 4); E(14 * s, 0, 13 * s, 5 * s, mix(p.wallShade, p.ink, .3)); }
  ctx.restore();
  E(cx, cy, 5 * s, 5 * s, p.wallShade);
}

function windowGrid(f, x, w, hh, i, o) {
  const { p, s, g, v } = f;
  const cols = Math.floor((w / s - 80) / o.gap);
  const frame = mix(p.light, p.wall, .25), bars = mix(p.ink, p.wall, .35), glassC = mix(p.wallShade, p.ink, .45);
  for (let c = 0; c < cols; c++) {
    for (let fl = 0; o.from + fl * o.step + o.h < hh - 40; fl++) {
      const wx = x + (60 + c * o.gap) * s, wy = g - (o.from + fl * o.step + o.h) * s, ww = o.w * s, wh = o.h * s;
      if (wy > H || wy + wh < 0 || wx > W || wx + ww < 0) continue;
      const lit = v.night && hash(i * 31 + c * 7 + fl, 9) < .4;
      paper(() => R(wx - 6 * s, wy - 6 * s, ww + 12 * s, wh + 12 * s, frame), .5);
      R(wx, wy, ww, wh, lit ? LIT : glassC);
      if (!lit) { ctx.globalAlpha = .16; P([[wx + ww * .1, wy + wh], [wx + ww * .45, wy], [wx + ww * .6, wy], [wx + ww * .25, wy + wh]], '#ffffff'); ctx.globalAlpha = 1; }
      R(wx + ww / 2 - 2 * s, wy, 4 * s, wh, frame);
      R(wx - 10 * s, wy + wh + 4 * s, ww + 20 * s, 8 * s, p.light);                                 // 창턱
      if (o.bars) {                                                                                    // 방범창
        ctx.fillStyle = bars;
        for (let b = 1; b < 7; b++) ctx.fillRect(wx + (b * ww) / 7, wy - 3 * s, Math.max(1, 1.6 * s), wh + 6 * s);
        ctx.fillRect(wx - 3 * s, wy + wh * .5, ww + 6 * s, Math.max(1, 1.6 * s));
      }
      if (o.ac && hash(i * 17 + c * 5 + fl, 12) < .55) acUnit(f, wx + ww + 18 * s, wy + wh - 50 * s);
    }
  }
}

/** 벽에 매달린 에어컨 실외기 */
function acUnit(f, x, y) {
  const { p, s } = f, body = mix(p.light, p.wallShade, .2);
  L(x + 6 * s, y + 55 * s, x + 6 * s, y + 70 * s, p.wallShade, Math.max(1, 2 * s)); L(x + 74 * s, y + 55 * s, x + 74 * s, y + 70 * s, p.wallShade, Math.max(1, 2 * s));
  paper(() => RR(x, y, 80 * s, 55 * s, 3 * s, body), .6);
  E(x + 30 * s, y + 27 * s, 19 * s, 19 * s, mix(body, p.ink, .35));
  E(x + 30 * s, y + 27 * s, 15 * s, 15 * s, mix(body, p.ink, .18));
  ctx.fillStyle = mix(body, p.ink, .25);
  for (let k = 0; k < 5; k++) ctx.fillRect(x + 56 * s, y + (10 + k * 8) * s, 16 * s, Math.max(1, 2 * s));
}

/* ── 실내 ── */
const WALL_MATERIAL = Object.freeze({ stripe: 'wallpaper', steel: 'steel' });

function drawInterior(f) {
  const { sc, p, s, g, v } = f;
  const w = sc.wall, top = sc.ceiling ? Math.max(0, g - sc.ceiling * s) : 0;
  const mat = WALL_MATERIAL[w.pattern];
  if (mat) lay(mat, s, -v.camX * s, g, 1, () => ctx.fillRect(0, top, W, g - top));
  if (w.pattern === 'tile') {
    const y0 = g - 150 * s, y1 = g - 90 * s;
    R(0, y0, W, y1 - y0, p.light);
    lay('wallTile', s, -v.camX * s, g, 1, () => ctx.fillRect(0, y0, W, y1 - y0));
  }
  if (w.window) livingWindows(f);
  wallFixtures(f);
  R(0, g - 9 * s, W, 9 * s, p.wallShade);                                                           // 걸레받이
  R(0, g - 9 * s, W, Math.max(1, 1.2 * s), mix(p.wallShade, p.light, .35));
  if (w.run) RUNS[w.run](f);
}

/** 콘센트와 스위치: 벽에 붙은 작은 것들 (가까이 보는 동물에게 크게 보인다) */
function wallFixtures(f) {
  const { p, s, g, v } = f, cell = 380;
  if (s < .8) return;
  const i0 = Math.floor(v.camX / cell) - 1, i1 = Math.floor((v.camX + W / s) / cell) + 1;
  if (i1 - i0 > 60) return;
  const plate = mix(p.light, p.wall, .2), hole = mix(p.wallShade, p.ink, .4);
  for (let i = i0; i <= i1; i++) {
    if (hash(i, 101) > .5) continue;
    const x = (i * cell + 90 - v.camX) * s, y = g - 30 * s;
    paper(() => RR(x, y, 12 * s, 7 * s, 1 * s, plate), .4);
    [3.5, 8.5].forEach((dx) => { E(x + dx * s, y + 3.5 * s, 1.6 * s, 1.6 * s, hole); E(x + (dx - .5) * s, y + 3.5 * s, .25 * s, .6 * s, plate); E(x + (dx + .5) * s, y + 3.5 * s, .25 * s, .6 * s, plate); });
  }
}

function livingWindows(f) {
  const { p, s, g, v } = f;
  const seg = 700, ww = 200, bottom = 90, top = 230;
  const i0 = Math.floor(v.camX / seg) - 1, i1 = Math.floor((v.camX + W / s) / seg) + 1;
  if (i1 - i0 > 60) return;
  const curtain = mix(p.accent, p.light, .45);
  for (let i = i0; i <= i1; i++) {
    const x = (i * seg + 250 - v.camX) * s, y = g - top * s, w = ww * s, hgt = (top - bottom) * s;
    if (x > W + 30 * s || x + w < -30 * s) continue;
    paper(() => R(x - 6 * s, y - 6 * s, w + 12 * s, hgt + 12 * s, p.light), .8);
    const gr = ctx.createLinearGradient(0, y, 0, y + hgt);
    gr.addColorStop(0, v.night ? NIGHT_SKY[0] : p.glass); gr.addColorStop(1, v.night ? NIGHT_SKY[1] : p.far1);
    ctx.fillStyle = gr; ctx.fillRect(x, y, w, hgt);
    for (let k = 0; k < 4; k++) {                                                                      // 창밖 맞은편 아파트
      const bh = hgt * (.4 + hash(i * 3 + k, 8) * .45), bx = x + w * (.04 + k * .25), bw = w * .2;
      R(bx, y + hgt - bh, bw, bh, p.far2);
      ctx.fillStyle = v.night ? LIT : mix(p.far2, '#ffffff', .2);
      for (let r = y + hgt - bh + 4 * s; r < y + hgt - 3 * s; r += 7 * s) if (!v.night || hash(k + i, Math.floor(r)) < .3) ctx.fillRect(bx + bw * .12, r, bw * .76, Math.max(1, 2 * s));
    }
    R(x + w / 2 - 2 * s, y, 4 * s, hgt, p.light);
    R(x - 10 * s, y + hgt + 4 * s, w + 20 * s, 6 * s, p.light);
    paper(() => { curtainPanel(x - 22 * s, y - 12 * s, 30 * s, hgt + 34 * s, curtain); curtainPanel(x + w - 8 * s, y - 12 * s, 30 * s, hgt + 34 * s, curtain); }, .6);
    R(x - 30 * s, y - 16 * s, w + 60 * s, 4 * s, mix(p.wallShade, p.ink, .2));                       // 커튼 레일
  }
}

/** 주름진 커튼: 세로 주름을 번갈아 밝고 어둡게 */
function curtainPanel(x, y, w, h, c) {
  R(x, y, w, h, c);
  for (let k = 0; k < 4; k++) R(x + (k + .5) * w / 4, y, w / 9, h, shade(c));
  R(x, y + h * .52, w, h * .04, mix(c, '#ffffff', .3));
}

/** 굽지 않고 매 프레임 그리는 벽의 움직이는 것: 식당 환풍기 날개 */
function liveWalls(f) {
  const { sc, s, g, v } = f;
  if (sc.indoor || !sc.wall || sc.wall.style !== 'concrete') return;
  const seg = 1100, i0 = Math.floor(v.camX / seg) - 1, i1 = Math.floor((v.camX + W / s) / seg) + 1;
  if (i1 - i0 > 120) return;
  for (let i = i0; i <= i1; i++) {
    const cx = (i * seg - v.camX) * s + 420 * s;
    if (cx + 40 * s < 0 || cx - 40 * s > W) continue;
    fanBlades(f, cx, g - 260 * s);
  }
}

function drawWalls(f) {
  if (f.sc.indoor) drawInterior(f);
  else if (f.sc.wall) drawFacades(f);
}

function drawCeiling(f) {
  const { sc, p, s, g } = f;
  if (!sc.ceiling) return;
  const cy = g - sc.ceiling * s;
  if (cy <= 0) return;
  paper(() => R(0, 0, W, cy, p.ceiling), 1.3);
  R(0, cy - Math.max(3, 8 * s), W, Math.max(3, 8 * s), p.wallShade);
  R(0, cy - Math.max(3, 8 * s), W, Math.max(1, 1.5 * s), mix(p.wallShade, p.light, .3));           // 몰딩 빛
}
