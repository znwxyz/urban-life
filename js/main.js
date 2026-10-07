/* 게임 흐름: 탄생 → 장면으로 이동 → 좌우 선택 → 결과 → 다음 장면 … → 엔딩. 프레임 루프 */
const MOVE_MS = 2600, MOVE_MS_REDUCED = 700, FADE_S = .45, ACCEL = 3, IDLE_RATIO = .05, DEFAULT_SPEED = 60;
const SEAM_GAP_CM_K = .02, PASS_MARGIN = 1.12, DEAL_MS = 380, DEATH_HOLD_MS = 1250, KILLER_LEAD_MS = 320, PROP_SCREEN_X = .58, SETTLE_S = 1.5, SIM_DT = 1 / 60;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SPECIES_KEYS = Object.keys(SPECIES);

let run = null;
let phase = 'idle';
const view = { scene: 'villaAlley', night: false, glow: null, weather: null, prop: null, propX: 0, camX: 5000, speed: 0, fade: 0, t: 0,
  cast: [], heroStopX: 0, killer: null, trans: null, cruise: 0 };
let moveTimer = null;

const currentSp = () => (run ? SPECIES[run.spKey] : null);

/** 장소를 바꾼다. opts.continuous면 화면을 새로 시작하지 않고, 지금 장소 오른쪽 끝에 다음 장소를 이어 붙인다 */
function setScene(bg, opts = {}) {
  if (!SCENES[bg]) throw new Error(`없는 배경: ${bg}`);
  const changed = bg !== view.scene;
  if (changed && opts.continuous) {
    view.trans = { prev: { scene: view.scene, night: view.night, glow: view.glow, weather: view.weather, prop: view.prop,
      propX: view.propX, cast: view.cast, heroStopX: view.heroStopX }, boundaryX: view.camX + W / lastFrame.s + SEAM_GAP_CM_K * W / lastFrame.s };
  } else if (changed) {
    view.fade = 1; view.camX = 2000 + Math.random() * 90000; view.trans = null;
  }
  Object.assign(view, { scene: bg, night: Boolean(opts.night), glow: SCENES[bg].glow || null, weather: opts.weather || null,
    prop: opts.prop || null, cast: opts.cast || [], killer: null });
}

/** 주인공이 멈춰 설 자리: 소품 자리에서 화면 간격만큼 뒤 */
const placeCast = (sp) => { view.heroStopX = view.propX - (PROP_SCREEN_X - heroScreenX()) * sp.viewCm; };

/** 이동 연출 동안 카메라가 갈 거리를 미리 계산해, 멈췄을 때 소품이 주인공 앞에 오게 한다 */
function travelAhead(cruise, ms, v0 = view.speed, idle = currentSp().speedCm * IDLE_RATIO) {
  let v = v0, d = 0;
  for (let t = 0; t < ms / 1000; t += SIM_DT) { v += (cruise - v) * Math.min(1, SIM_DT * ACCEL); d += v * SIM_DT; }
  for (let t = 0; t < SETTLE_S; t += SIM_DT) { v += (idle - v) * Math.min(1, SIM_DT * ACCEL); d += v * SIM_DT; }
  return d;
}

/** 장소가 바뀌는 이동이면, 이음선이 화면을 다 지나갈 만큼 걸음을 재촉한다 (거리는 속도에 비례) */
function cruiseFor(sp, ms, needCm) {
  const perCruise = travelAhead(1, ms, 0, 0) - travelAhead(0, ms, 0, 0), fromNow = travelAhead(0, ms);
  return Math.max(sp.speedCm, (needCm - fromNow) / perCruise);
}

/** 처음 화면: 동물 4종을 2×2 카드로 보여 주고 고르게 한다 */
function showPicker() {
  clearTimeout(moveTimer);
  run = null; phase = 'picker';
  clearDeath(); stopIris(); closeWall();
  updateHud(null, null); hideCaption(); hideCard();
  setScene('villaAlley');
  $('pickGrid').replaceChildren(...SPECIES_KEYS.map((key) => {
    const sp = SPECIES[key];
    // 그림은 일부러 넣지 않는다. 직접 태어나 봐야 어떻게 생겼는지 알 수 있다
    const btn = h('button', { class: 'species', onclick: () => revealBirth(key) },
      h('b', null, sp.name), h('small', null, `${sp.size} · 해피엔딩 ${durLabel(happyDay(sp))}`));
    btn.style.setProperty('--deckle', deckle());
    return h('div', { class: 'species-wrap' }, btn);
  }));
  $('picker').hidden = false;
  $('pickGrid').querySelector('button').focus({ preventScroll: true });
}

function revealBirth(key) {
  const sp = SPECIES[key];
  clearTimeout(moveTimer); $('picker').hidden = true;
  run = newRun(sp); phase = 'birth';
  clearDeath();
  startIris(() => heroRect(sp));
  const first = sp.scenes[sp.start];
  setScene(first.bg, { prop: first.prop, cast: first.cast });
  view.propX = view.camX + PROP_SCREEN_X * sp.viewCm;
  placeCast(sp);
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
  const ms = reducedMotion ? MOVE_MS_REDUCED : MOVE_MS;
  setScene(node.bg, { night: node.night, prop: node.prop, weather, cast: node.cast, continuous: !reducedMotion });
  view.cruise = view.trans ? cruiseFor(sp, ms, (view.trans.boundaryX - view.camX) * PASS_MARGIN) : sp.speedCm;
  view.propX = view.camX + travelAhead(view.cruise, ms) + PROP_SCREEN_X * sp.viewCm;
  placeCast(sp);
  hideCard(); updateHud(sp, run);
  showCaption(`생후 ${durLabel(run.day)} · ${SEASON_KO[seasonOf(month)]}${node.night ? ' · 밤' : ''}`, `${sc.area} · ${sc.name}`);
  clearTimeout(moveTimer);
  moveTimer = setTimeout(showChoice, ms);
}

function showChoice() {
  const sp = currentSp(), node = sp.scenes[run.at];
  phase = 'choice';
  hideCaption();
  showCard({
    body: [h('div', { class: 'eyebrow' }, SCENES[node.bg].name), h('h2', null, node.title), h('p', null, node.text)],
    choices: node.choices.map((c, i) => ({ label: c.t, act: () => chooseOption(i) })),
  });
}

function chooseOption(i) {
  if (phase !== 'choice') return;
  const sp = currentSp();
  const prev = run;
  try {
    run = applyChoice(sp, run, i);
  } catch (err) {
    console.error('선택을 처리하지 못했다', err);
    showCard({ body: [h('h2', null, '이 장면에서 문제가 생겼다'), h('p', null, '시나리오 데이터를 확인해 주세요.')],
      next: { label: '처음으로', act: showPicker } });
    return;
  }
  if (!run.ending) { updateHud(sp, run, prev); showOutcome(prev); return; }
  updateHud(sp, run);
  if (sp.endings[run.ending].kind !== 'dead') { showEnding(); return; }
  phase = 'ending';
  const killer = sp.endings[run.ending].actor;
  if (killer) view.killer = { ...killer, t0: performance.now() };
  setTimeout(() => startDeath(() => heroRect(sp)), killer && !reducedMotion ? KILLER_LEAD_MS : 0);
  setTimeout(showEnding, reducedMotion ? 0 : DEATH_HOLD_MS);
}

function showOutcome(prev) {
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
  if (prev) setTimeout(() => animateStats(prev, run), reducedMotion ? 0 : DEAL_MS);
}

function showEnding() {
  const sp = currentSp(), end = sp.endings[run.ending];
  phase = 'ending';
  view.prop = null;
  if (end.kind === 'dead' && !document.body.classList.contains('dead')) startDeath(() => heroRect(sp));
  hideCaption();
  showCard({
    body: [
      run.outcome && run.outcome.fatal && run.outcome.msg ? h('p', { class: 'ouch' }, run.outcome.msg) : null,
      h('h2', null, end.title),
      h('p', { class: 'result' }, end.line),
      h('p', { class: 'meta' }, `생후 ${durLabel(run.day)} · ${end.cause}${run.kids ? ` · 남긴 ${sp.kidUnit} ${run.kids}` : ''}`),
    ],
    top: guestbookSection(sp, run.ending, run.day),
    choices: [{ label: `${sp.name}로 다시`, act: () => revealBirth(sp.key) }, { label: '다른 동물 고르기', act: showPicker }],
  });
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, .05);
  last = now; view.t += dt;
  const sp = currentSp();
  const base = sp ? sp.speedCm : DEFAULT_SPEED;
  view.speed += ((phase === 'move' ? view.cruise || base : base * IDLE_RATIO) - view.speed) * Math.min(1, dt * ACCEL);
  view.camX += view.speed * dt;
  view.fade = Math.max(0, view.fade - dt / FADE_S);
  const s = drawScene(view, sp, dt);
  drawDeath(now);
  updateIris(now);
  if (sp) updateScaleBar(s);
  requestAnimationFrame(frame);
}

/* 시작. 뷰어가 페이지를 갱신해도 진행 중인 판을 이어 간다 */
window.claude?.hot?.snapshot?.(() => ({ run, phase }));
function boot(data) {
  resizeStage(); resizeFx(); setupWall();
  addEventListener('resize', () => { resizeStage(); resizeFx(); });
  requestAnimationFrame(frame);
  const saved = data && data.run;
  const sp = saved && SPECIES[saved.spKey];
  if (!sp || !isValidRun(sp, saved)) { showPicker(); return; }
  run = saved;
  const lastAt = run.path.length ? run.path[run.path.length - 1].at : sp.start;
  if (run.ending) { setScene(sp.scenes[lastAt].bg); showEnding(); return; }
  if (data.phase === 'outcome') { setScene(sp.scenes[run.at].bg); showOutcome(); return; }
  enterScene();
}
window.claude?.hot?.ready ? window.claude.hot.ready(boot) : boot(window.claude?.hot?.data ?? {});
