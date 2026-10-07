/* 화면 요소: 상단 이름표·상태표, 좌우로 밀어 고르는 종이 카드, 이동 중 자막 */
const SCALE_STEPS = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000];
const SCALE_TARGET_PX = 90, BAR_SEGMENTS = 10;
const SWIPE_COMMIT_PX = 90, SWIPE_TILT_DEG = .06, FLY_MS = 240, DECKLE_STEPS = 18, DECKLE_JITTER = 1.1;
const $ = (id) => document.getElementById(id);
const deck = $('deck'), cardWrap = $('cardWrap'), cardBody = $('cardBody'), picks = $('picks');
const hintL = $('hintL'), hintR = $('hintR');

/** 텍스트는 항상 textNode로 넣는다 (innerHTML 쓰지 않음) */
function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  });
  kids.flat().forEach((k) => { if (k != null && k !== false) el.append(k instanceof Node ? k : document.createTextNode(String(k))); });
  return el;
}

/** 손으로 찢은 듯한 종이 가장자리 (clip-path 다각형) */
function deckle() {
  const j = () => (Math.random() * DECKLE_JITTER).toFixed(2);
  const pts = [];
  for (let i = 0; i <= DECKLE_STEPS; i++) pts.push(`${(i / DECKLE_STEPS * 100).toFixed(1)}% ${j()}%`);
  for (let i = 1; i <= DECKLE_STEPS; i++) pts.push(`${100 - j()}% ${(i / DECKLE_STEPS * 100).toFixed(1)}%`);
  for (let i = DECKLE_STEPS - 1; i >= 0; i--) pts.push(`${(i / DECKLE_STEPS * 100).toFixed(1)}% ${100 - j()}%`);
  for (let i = DECKLE_STEPS - 1; i > 0; i--) pts.push(`${j()}% ${(i / DECKLE_STEPS * 100).toFixed(1)}%`);
  return `polygon(${pts.join(',')})`;
}

/* ── 카드 ── */
let cardActions = null;   // { left, right } : 각각 () => void

/**
 * 카드 한 장을 보여준다.
 * opts.left / opts.right = { label, act } 이면 좌우 선택, opts.next = { label, act } 이면 어느 쪽으로 밀어도 진행.
 */
function showCard(opts) {
  deck.hidden = false;
  cardWrap.style.transition = 'none';
  cardWrap.style.transform = '';
  cardWrap.style.setProperty('--deckle', deckle());
  cardWrap.classList.toggle('tilt-l', Math.random() < .5);
  cardBody.replaceChildren(...opts.body.filter(Boolean));
  const left = opts.left || opts.next, right = opts.right || opts.next;
  cardActions = { left: left.act, right: right.act };
  hintL.textContent = left.label; hintR.textContent = right.label;
  setHint(0);
  const buttons = opts.next
    ? [h('button', { class: 'pick solo', onclick: () => commit(1) }, opts.next.label, h('span', { class: 'arrow' }, ' ▶'))]
    : [h('button', { class: 'pick l', onclick: () => commit(-1) }, h('span', { class: 'arrow' }, '◀ '), left.label),
      h('button', { class: 'pick r', onclick: () => commit(1) }, right.label, h('span', { class: 'arrow' }, ' ▶'))];
  picks.replaceChildren(...buttons);
  cardWrap.classList.remove('deal'); void cardWrap.offsetWidth; cardWrap.classList.add('deal');
  const first = picks.querySelector('button');
  if (first) first.focus({ preventScroll: true });
}

function hideCard() { deck.hidden = true; cardActions = null; }

function setHint(dx) {
  const k = Math.min(Math.abs(dx) / SWIPE_COMMIT_PX, 1);
  hintL.style.opacity = dx < 0 ? k : 0;
  hintR.style.opacity = dx > 0 ? k : 0;
}

/** dir: -1 왼쪽, 1 오른쪽. 카드를 그쪽으로 날려 보내고 행동을 실행한다 */
function commit(dir) {
  if (!cardActions) return;
  const act = dir < 0 ? cardActions.left : cardActions.right;
  cardActions = null;
  setHint(dir * SWIPE_COMMIT_PX);
  cardWrap.style.transition = `transform ${FLY_MS}ms ease-in`;
  cardWrap.style.transform = `translateX(${dir * 120}vw) rotate(${dir * 18}deg)`;
  setTimeout(act, reducedMotionUi ? 0 : FLY_MS);
}

const reducedMotionUi = matchMedia('(prefers-reduced-motion: reduce)').matches;
let drag = null;
cardWrap.addEventListener('pointerdown', (e) => {
  if (!cardActions) return;
  drag = { x: e.clientX, id: e.pointerId };
  cardWrap.setPointerCapture(e.pointerId);
  cardWrap.style.transition = 'none';
});
cardWrap.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x;
  cardWrap.style.transform = `translateX(${dx}px) rotate(${dx * SWIPE_TILT_DEG}deg)`;
  setHint(dx);
});
function endDrag(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x;
  drag = null;
  if (Math.abs(dx) >= SWIPE_COMMIT_PX) { commit(Math.sign(dx)); return; }
  cardWrap.style.transition = 'transform .25s cubic-bezier(.2,1.4,.4,1)';
  cardWrap.style.transform = '';
  setHint(0);
}
cardWrap.addEventListener('pointerup', endDrag);
cardWrap.addEventListener('pointercancel', endDrag);
document.addEventListener('keydown', (e) => {
  if (!cardActions) return;
  if (e.key === 'ArrowLeft') commit(-1);
  if (e.key === 'ArrowRight') commit(1);
});

/* ── 자막 · 상단 ── */
function showCaption(tc, tx) { $('capTc').textContent = tc; $('capTx').textContent = tx; $('caption').hidden = false; }
function hideCaption() { $('caption').hidden = true; }

function segBar(el, value) {
  const on = Math.round(value / RULES.MAX * BAR_SEGMENTS);
  el.replaceChildren(...Array.from({ length: BAR_SEGMENTS }, (_, i) => h('i', { class: i < on ? 'on' : '' })));
}

function updateHud(sp, run) {
  $('hud').hidden = !sp || !run;
  if (!sp || !run) return;
  $('spName').textContent = sp.name;
  $('spLatin').textContent = `${sp.latin} · ${sp.size}`;
  segBar($('hpBar'), run.hp); segBar($('foodBar'), run.food);
  $('hpNum').textContent = run.hp; $('foodNum').textContent = run.food;
  $('kids').textContent = run.kids ? `${sp.kidUnit} ${run.kids}` : '';
  $('age').textContent = `생후 ${durLabel(run.day)} · ${SEASON_KO[seasonOf(monthOf(sp, run.day))]}`;
}

let lastScale = 0;
function updateScaleBar(s) {
  if (Math.abs(s - lastScale) < 1e-6) return;
  lastScale = s;
  const dist = (v) => Math.abs(Math.log(v * s / SCALE_TARGET_PX));
  const best = SCALE_STEPS.reduce((a, b) => (dist(b) < dist(a) ? b : a));
  $('scaleBar').style.width = `${best * s}px`;
  $('scaleLabel').textContent = best >= 100 ? `${best / 100}m` : `${best}cm`;
}

/** 체력·포만 변화를 도장처럼 찍는다 */
function stamps(o, kidUnit) {
  const list = [];
  if (o.dHp) list.push(h('span', { class: `stamp ${o.dHp > 0 ? 'up' : 'down'}` }, `체력 ${o.dHp > 0 ? '+' : '-'}${Math.abs(o.dHp)}`));
  if (o.dFood) list.push(h('span', { class: `stamp ${o.dFood > 0 ? 'up' : 'down'}` }, `포만 ${o.dFood > 0 ? '+' : '-'}${Math.abs(o.dFood)}`));
  if (o.kids) list.push(h('span', { class: 'stamp kid' }, `${kidUnit} +${o.kids}`));
  if (o.starving) list.push(h('span', { class: 'stamp down' }, '굶주림'));
  return list.length ? h('div', { class: 'stamps' }, list) : null;
}
