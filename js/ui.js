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

/* ── 카드: 상하좌우로 밀어 고른다 ── */
const DIR_VEC = Object.freeze({ left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] });
const DIR_ARROW = Object.freeze({ left: '◀', right: '▶', up: '▲', down: '▼' });
const hints = { left: hintL, right: hintR, up: $('hintU'), down: $('hintD') };
let cardActions = null;   // { left, right, up, down } : 각각 () => void

/**
 * 카드 한 장을 보여준다.
 * opts.choices = [{ label, act }] 를 순서대로 ← → ↑ ↓ 에 놓는다. opts.next = { label, act } 이면 어느 쪽으로 밀어도 진행.
 */
function showCard(opts) {
  deck.hidden = false;
  cardWrap.style.transition = 'none';
  cardWrap.style.transform = '';
  cardWrap.style.setProperty('--deckle', deckle());
  cardWrap.classList.toggle('tilt-l', Math.random() < .5);
  cardBody.replaceChildren(...opts.body.filter(Boolean));
  // 위에 따로 붙이는 엽서 (엔딩의 '○○에게 한 마디')
  $('noteWrap').hidden = !opts.top;
  if (opts.top) { $('noteWrap').style.setProperty('--deckle', deckle()); $('noteCard').replaceChildren(opts.top); }
  const slots = opts.next ? DIRECTIONS.map(() => opts.next) : opts.choices;
  cardActions = Object.fromEntries(DIRECTIONS.map((d, i) => [d, slots[i] ? slots[i].act : null]));
  DIRECTIONS.forEach((d, i) => { hints[d].textContent = slots[i] ? slots[i].label : ''; });
  setHint(0, 0);
  const buttons = opts.next
    ? [h('button', { class: 'pick solo', 'data-dir': 'right', onclick: () => commit('right') }, opts.next.label, h('span', { class: 'arrow' }, ' ▶'))]
    : opts.choices.map((c, i) => {
      const d = DIRECTIONS[i];
      return h('button', { class: `pick ${d}`, 'data-dir': d, onclick: () => commit(d) }, h('span', { class: 'arrow' }, `${DIR_ARROW[d]} `), c.label);
    });
  picks.classList.toggle('four', !opts.next);
  picks.replaceChildren(...buttons);
  cardWrap.classList.remove('deal'); void cardWrap.offsetWidth; cardWrap.classList.add('deal');
  const first = picks.querySelector('button');
  if (first) first.focus({ preventScroll: true });
}

function hideCard() { deck.hidden = true; cardActions = null; $('noteWrap').hidden = true; }

/** 끄는 방향 쪽 선택지를 드러낸다 */
function setHint(dx, dy) {
  const dir = dragDir(dx, dy), k = Math.min(Math.hypot(dx, dy) / SWIPE_COMMIT_PX, 1);
  DIRECTIONS.forEach((d) => { hints[d].style.opacity = d === dir ? k : 0; });
}

function dragDir(dx, dy) {
  if (!dx && !dy) return null;
  if (Math.abs(dx) >= Math.abs(dy)) return dx < 0 ? 'left' : 'right';
  return dy < 0 ? 'up' : 'down';
}

/** dir 쪽으로 카드를 날려 보내고 행동을 실행한다 */
function commit(dir) {
  if (!cardActions || !cardActions[dir]) return;
  const act = cardActions[dir], [vx, vy] = DIR_VEC[dir];
  cardActions = null;
  setHint(vx * SWIPE_COMMIT_PX, vy * SWIPE_COMMIT_PX);
  // 고른 꼬리표는 카드와 같이 날아가고, 나머지는 작아지며 사라진다
  picks.querySelectorAll('.pick').forEach((p) => p.classList.add(p.dataset.dir === dir || p.classList.contains('solo') ? `gone-${dir}` : 'fade'));
  cardWrap.style.transition = `transform ${FLY_MS}ms ease-in`;
  cardWrap.style.transform = `translate(${vx * 120}vw, ${vy * 120}vh) rotate(${vx * 18}deg)`;
  setTimeout(act, reducedMotionUi ? 0 : FLY_MS);
}

const reducedMotionUi = matchMedia('(prefers-reduced-motion: reduce)').matches;
let drag = null;
$('noteWrap').addEventListener('keydown', (e) => e.stopPropagation());
const isTyping = (el) => Boolean(el && el.closest && el.closest('input, textarea, button, form'));
cardWrap.addEventListener('pointerdown', (e) => {
  if (!cardActions || isTyping(e.target)) return;
  drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
  cardWrap.setPointerCapture(e.pointerId);
  cardWrap.style.transition = 'none';
});
cardWrap.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  cardWrap.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * SWIPE_TILT_DEG}deg)`;
  setHint(dx, dy);
});
function endDrag(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  drag = null;
  if (Math.hypot(dx, dy) >= SWIPE_COMMIT_PX && cardActions && cardActions[dragDir(dx, dy)]) { commit(dragDir(dx, dy)); return; }
  cardWrap.style.transition = 'transform .25s cubic-bezier(.2,1.4,.4,1)';
  cardWrap.style.transform = '';
  setHint(0, 0);
}
cardWrap.addEventListener('pointerup', endDrag);
cardWrap.addEventListener('pointercancel', endDrag);
const KEY_DIR = Object.freeze({ ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' });
document.addEventListener('keydown', (e) => {
  if (!cardActions || !KEY_DIR[e.key] || isTyping(e.target)) return;
  e.preventDefault();
  commit(KEY_DIR[e.key]);
});

/* ── 자막 · 상단 ── */
function showCaption(tc, tx) { $('capTc').textContent = tc; $('capTx').textContent = tx; $('caption').hidden = false; }
function hideCaption() { $('caption').hidden = true; }

const segCount = (v) => Math.round(v / RULES.MAX * BAR_SEGMENTS);

/** 칸 막대. prev가 있으면 새로 찬 칸은 반짝(gain), 줄어든 칸은 붉게 깜빡(lost) */
function segBar(el, value, prev = value) {
  const on = segCount(value), was = segCount(prev);
  el.replaceChildren(...Array.from({ length: BAR_SEGMENTS }, (_, i) => {
    const cls = i < on ? (i >= was ? 'on gain' : 'on') : (i < was ? 'lost' : '');
    return h('i', { class: cls });
  }));
}

/** 스탯 하나를 from → to로 바꾸며 연출한다 */
function setStat(stat, from, to) {
  const bar = $(stat === 'hp' ? 'hpBar' : 'foodBar'), num = $(stat === 'hp' ? 'hpNum' : 'foodNum');
  const row = $(stat === 'hp' ? 'hpRow' : 'foodRow');
  segBar(bar, to, from);
  num.textContent = to;
  const cls = to < from ? 'hurt' : 'fill';
  row.classList.remove('hurt', 'fill'); void row.offsetWidth; row.classList.add(cls);
}

/** shown을 주면 막대는 그 값(이전 상태)으로 두고, 연출이 끝난 뒤 setStat으로 바꾼다 */
function updateHud(sp, run, shown = run) {
  $('hud').hidden = !sp || !run;
  if (!sp || !run) return;
  $('spName').textContent = sp.name;
  $('spLatin').textContent = `${sp.latin} · ${sp.size}`;
  segBar($('hpBar'), shown.hp); segBar($('foodBar'), shown.food);
  $('hpNum').textContent = shown.hp; $('foodNum').textContent = shown.food;
  $('kids').textContent = run.kids ? `${sp.kidUnit} ${run.kids}` : '';
  $('age').textContent = tx('caption.age', { age: durText(run.day), season: seasonText(seasonOf(monthOf(sp, run.day))) });
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
  if (o.dHp) list.push(h('span', { class: `stamp ${o.dHp > 0 ? 'up' : 'down'}`, 'data-stat': 'hp' }, `${tx('stamp.hp')} ${o.dHp > 0 ? '+' : '-'}${Math.abs(o.dHp)}`));
  if (o.dFood) list.push(h('span', { class: `stamp ${o.dFood > 0 ? 'up' : 'down'}`, 'data-stat': 'food' }, `${tx('stamp.food')} ${o.dFood > 0 ? '+' : '-'}${Math.abs(o.dFood)}`));
  if (o.kids) list.push(h('span', { class: 'stamp kid' }, `${kidUnit} +${o.kids}`));
  if (o.starving) list.push(h('span', { class: 'stamp down' }, tx('stamp.starving')));
  return list.length ? h('div', { class: 'stamps' }, list) : null;
}
