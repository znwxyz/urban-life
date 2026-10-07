/* 게임 흐름: 탄생 → 장면으로 이동 → 좌우 선택 → 결과 → 다음 장면 … → 엔딩. 프레임 루프 */
const MOVE_MS = 2600, MOVE_MS_REDUCED = 700, FADE_S = .45, ACCEL = 3, IDLE_RATIO = .05, DEFAULT_SPEED = 60;
const ROULETTE_TICKS = 14, ROULETTE_MS = 80, PROP_SCREEN_X = .58, SETTLE_S = 1.5, SIM_DT = 1 / 60;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPECIES_KEYS = Object.keys(SPECIES);

let run = null;
let phase = 'idle';
const view = { scene: 'villaAlley', night: false, glow: null, weather: null, prop: null, propX: 0, camX: 5000, speed: 0, fade: 0, t: 0 };
let moveTimer = null, rouletteTimer = null;

const currentSp = () => (run ? SPECIES[run.spKey] : null);
const randomKey = () => SPECIES_KEYS[Math.floor(Math.random() * SPECIES_KEYS.length)];

function setScene(bg, opts = {}) {
  if (!SCENES[bg]) throw new Error(`없는 배경: ${bg}`);
  if (bg !== view.scene) { view.fade = 1; view.camX = 2000 + Math.random() * 90000; }
  Object.assign(view, { scene: bg, night: Boolean(opts.night), glow: SCENES[bg].glow || null, weather: opts.weather || null, prop: opts.prop || null });
}

/** 이동 연출 동안 카메라가 갈 거리를 미리 계산해, 멈췄을 때 소품이 주인공 앞에 오게 한다 */
function travelAhead(cruise, ms) {
  let v = view.speed, d = 0;
  for (let t = 0; t < ms / 1000; t += SIM_DT) { v += (cruise - v) * Math.min(1, SIM_DT * ACCEL); d += v * SIM_DT; }
  for (let t = 0; t < SETTLE_S; t += SIM_DT) { v += (cruise * IDLE_RATIO - v) * Math.min(1, SIM_DT * ACCEL); d += v * SIM_DT; }
  return d;
}

function startRoulette(forcedKey) {
  clearTimeout(moveTimer); clearInterval(rouletteTimer);
  run = null; phase = 'idle';
  updateHud(null, null); hideCaption(); hideCard();
  setScene(['villaAlley', 'park', 'aptGarden'][Math.floor(Math.random() * 3)]);
  const key = forcedKey || randomKey();
  if (reducedMotion) { revealBirth(key); return; }
  const name = $('roulette');
  name.hidden = false;
  let n = 0;
  rouletteTimer = setInterval(() => {
    name.textContent = SPECIES[SPECIES_KEYS[n % SPECIES_KEYS.length]].name;
    n += 1;
    if (n > ROULETTE_TICKS) { clearInterval(rouletteTimer); name.hidden = true; revealBirth(key); }
  }, ROULETTE_MS);
}

function revealBirth(key) {
  const sp = SPECIES[key];
  clearTimeout(moveTimer); clearInterval(rouletteTimer); $('roulette').hidden = true;
  run = newRun(sp); phase = 'birth';
  const first = sp.scenes[sp.start];
  setScene(first.bg, { prop: first.prop });
  view.propX = view.camX + PROP_SCREEN_X * sp.viewCm;
  updateHud(sp, run); hideCaption();
  showCard({
    body: [
      h('div', { class: 'eyebrow' }, `${sp.place}에서`),
      h('h2', null, `${sp.name}로 태어났다`),
      h('p', null, sp.intro),
    ],
    next: { label: '살아 보기', act: enterScene },
  });
}

function enterScene() {
  const sp = currentSp(), node = sp.scenes[run.at];
  phase = 'move';
  const month = monthOf(sp, run.day), sc = SCENES[node.bg];
  const weather = node.weather || (!sc.indoor && seasonOf(month) === 'winter' ? 'snow' : null);
  setScene(node.bg, { night: node.night, prop: node.prop, weather });
  const ms = reducedMotion ? MOVE_MS_REDUCED : MOVE_MS;
  view.propX = view.camX + travelAhead(sp.speedCm, ms) + PROP_SCREEN_X * sp.viewCm;
  hideCard(); updateHud(sp, run);
  showCaption(`생후 ${durLabel(run.day)} · ${SEASON_KO[seasonOf(month)]}${node.night ? ' · 밤' : ''}`, `${sc.area} · ${sc.name}`);
  clearTimeout(moveTimer);
  moveTimer = setTimeout(showChoice, ms);
}

function showChoice() {
  const sp = currentSp(), node = sp.scenes[run.at];
  phase = 'choice';
  hideCaption();
  const side = (i) => ({ label: node.choices[i].t, act: () => chooseOption(i) });
  showCard({
    body: [h('div', { class: 'eyebrow' }, SCENES[node.bg].name), h('h2', null, node.title), h('p', null, node.text)],
    left: side(0), right: side(1),
  });
}

function chooseOption(i) {
  if (phase !== 'choice') return;
  const sp = currentSp();
  try {
    run = applyChoice(sp, run, i);
  } catch (err) {
    console.error('선택을 처리하지 못했다', err);
    showCard({ body: [h('h2', null, '이 장면에서 문제가 생겼다'), h('p', null, '시나리오 데이터를 확인해 주세요.')],
      next: { label: '다시 태어나기', act: () => startRoulette() } });
    return;
  }
  updateHud(sp, run);
  if (run.ending) showEnding(); else showOutcome();
}

function showOutcome() {
  const sp = currentSp(), o = run.outcome;
  phase = 'outcome';
  showCard({
    body: [
      h('div', { class: 'eyebrow' }, run.path[run.path.length - 1].choice),
      h('p', { class: 'result' }, o.msg || '시간이 흘렀다.'),
      o.hurt ? h('p', { class: 'ouch' }, o.hurtMsg) : null,
      stamps(o, sp.kidUnit),
    ],
    next: { label: '계속', act: enterScene },
  });
}

function showEnding() {
  const sp = currentSp(), end = sp.endings[run.ending], kind = ENDING_KIND[end.kind];
  phase = 'ending';
  view.prop = null;
  if (end.kind === 'dead') view.night = true;
  hideCaption();
  showCard({
    body: [
      h('div', { class: `seal ${end.kind}` }, `${kind.label} 엔딩`),
      run.outcome && run.outcome.fatal && run.outcome.msg ? h('p', { class: 'ouch' }, run.outcome.msg) : null,
      h('h2', null, end.title),
      h('p', { class: 'result' }, end.line),
      h('p', { class: 'meta' }, `생후 ${durLabel(run.day)} · ${end.cause}${run.kids ? ` · 남긴 ${sp.kidUnit} ${run.kids}` : ''}`),
    ],
    left: { label: `${sp.name}로 다시`, act: () => revealBirth(sp.key) },
    right: { label: '다시 태어나기', act: () => startRoulette() },
  });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, .05);
  last = now; view.t += dt;
  const sp = currentSp();
  const cruise = sp ? sp.speedCm : DEFAULT_SPEED;
  view.speed += ((phase === 'move' ? cruise : cruise * IDLE_RATIO) - view.speed) * Math.min(1, dt * ACCEL);
  view.camX += view.speed * dt;
  view.fade = Math.max(0, view.fade - dt / FADE_S);
  const s = drawScene(view, sp, dt);
  if (sp) updateScaleBar(s);
  requestAnimationFrame(frame);
}

/* 시작. 뷰어가 페이지를 갱신해도 진행 중인 판을 이어 간다 */
window.claude?.hot?.snapshot?.(() => ({ run, phase }));
function boot(data) {
  resizeStage();
  addEventListener('resize', resizeStage);
  requestAnimationFrame(frame);
  const saved = data && data.run;
  const sp = saved && SPECIES[saved.spKey];
  if (!sp || !isValidRun(sp, saved)) { startRoulette(); return; }
  run = saved;
  const lastAt = run.path.length ? run.path[run.path.length - 1].at : sp.start;
  if (run.ending) { setScene(sp.scenes[lastAt].bg); showEnding(); return; }
  if (data.phase === 'outcome') { setScene(sp.scenes[run.at].bg); showOutcome(); return; }
  enterScene();
}
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
