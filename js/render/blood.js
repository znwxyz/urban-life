/* 죽음 연출: 장면은 흑백으로 바래고(#stage CSS 필터), 주인공을 완전히 덮는 피만 붉게 남는다.
   피는 필터가 걸리지 않는 위쪽 캔버스(#fx)에 그린다. 모양은 납작한 한 가지 빨강:
   울퉁불퉁한 몸통 + 끝이 동그랗게 맺힌 튀김 줄기 + 주변에 떨어진 동그란 방울 */
const fxCanvas = document.getElementById('fx');
const fxCtx = fxCanvas.getContext('2d');
const BLOOD = '#d90a14';
const SPLAT_MS = 200, ARM_MS = 260, DROP_MS = 380, MIN_BLOOD_R = 30, BLOOD_COVER = 1.2, BODY_POINTS = 64;
const ARMS = [7, 11], DROPS = [3, 7], ARM_BEADS = 14;
let death = null;

const rand = (a, b) => a + Math.random() * (b - a);
const randInt = ([a, b]) => Math.floor(rand(a, b + 1));

function resizeFx() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fxCanvas.width = Math.round(fxCanvas.clientWidth * dpr);
  fxCanvas.height = Math.round(fxCanvas.clientHeight * dpr);
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** 주인공 둘레(cx, cy, 반지름 r)에 피를 튀긴다 */
function startDeath(rect) {
  const r = Math.max(rect.r * BLOOD_COVER, MIN_BLOOD_R);
  death = {
    t0: performance.now(), cx: rect.cx, cy: rect.cy, r,
    phase: [rand(0, 6.3), rand(0, 6.3), rand(0, 6.3), rand(0, 6.3)],
    arms: Array.from({ length: randInt(ARMS) }, () => ({
      a: rand(0, Math.PI * 2), len: r * rand(.14, .42), w: r * rand(.07, .13), bulb: r * rand(.09, .15), bend: rand(-.6, .6),
    })),
    drops: Array.from({ length: randInt(DROPS) }, () => ({
      a: rand(0, Math.PI * 2), d: r * rand(1.25, 1.65), size: r * rand(.05, .12), delay: rand(0, 90),
    })),
  };
  document.body.classList.add('dead', 'shake');
  setTimeout(() => document.body.classList.remove('shake'), 380);
}

function clearDeath() {
  death = null;
  document.body.classList.remove('dead', 'shake');
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
}

const overshoot = (k) => 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
const easeOut = (u) => 1 - Math.pow(1 - u, 3);

/** 가장자리가 출렁이는 몸통 (낮은 주파수 사인 세 개를 겹친다) */
function bodyPath(cx, cy, r, ph) {
  fxCtx.beginPath();
  for (let i = 0; i <= BODY_POINTS; i++) {
    const a = i / BODY_POINTS * Math.PI * 2;
    const m = 1 + .09 * Math.sin(3 * a + ph[0]) + .06 * Math.sin(5 * a + ph[1]) + .045 * Math.sin(8 * a + ph[2]) + .03 * Math.sin(13 * a + ph[3]);
    const x = cx + Math.cos(a) * r * m, y = cy + Math.sin(a) * r * m;
    if (i === 0) fxCtx.moveTo(x, y); else fxCtx.lineTo(x, y);
  }
  fxCtx.closePath();
}

/** 몸통에서 흘러나온 굽은 줄기. 굵기가 점점 가늘어지다 끝에서 동그랗게 맺힌다 (겹친 원으로 매끈한 곡선을 만든다) */
function drawArm(cx, cy, body, s, grow) {
  const ca = Math.cos(s.a), sa = Math.sin(s.a), nx = -sa, ny = ca;
  const start = body * .62, end = body * .8 + s.len * grow, mid = (start + end) / 2, sway = s.len * s.bend * grow;
  const p0 = [cx + ca * start, cy + sa * start], p2 = [cx + ca * end, cy + sa * end];
  const p1 = [cx + ca * mid + nx * sway, cy + sa * mid + ny * sway];
  for (let i = 0; i <= ARM_BEADS; i++) {
    const u = i / ARM_BEADS;
    const x = (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0];
    const y = (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1];
    const w = s.w * (2.1 - 1.35 * Math.sin(u * Math.PI * .5));
    fxCtx.beginPath(); fxCtx.arc(x, y, w, 0, Math.PI * 2); fxCtx.fill();
  }
  fxCtx.beginPath(); fxCtx.arc(p2[0], p2[1], s.bulb * grow, 0, Math.PI * 2); fxCtx.fill();
}

function drawDeath(now) {
  if (!death) return;
  const { cx, cy, r } = death, t = now - death.t0;
  fxCtx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
  const body = r * overshoot(Math.min(1, t / SPLAT_MS));
  const arm = easeOut(Math.min(1, Math.max(0, (t - SPLAT_MS * .4) / ARM_MS)));
  fxCtx.fillStyle = BLOOD;

  bodyPath(cx, cy, body * .82, death.phase); fxCtx.fill();
  if (arm) death.arms.forEach((s) => drawArm(cx, cy, body, s, arm));
  death.drops.forEach((d) => {
    const u = Math.max(0, Math.min(1, (t - SPLAT_MS * .5 - d.delay) / DROP_MS));
    if (!u) return;
    const e = easeOut(u);
    fxCtx.beginPath(); fxCtx.arc(cx + Math.cos(d.a) * d.d * e, cy + Math.sin(d.a) * d.d * e, d.size, 0, Math.PI * 2); fxCtx.fill();
  });
}
