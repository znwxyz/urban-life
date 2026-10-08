/* 엔딩 방명록 "○○에게 한 마디". Supabase REST API로 읽고 쓴다.
   글은 항상 textContent로 넣는다 (다른 사람이 쓴 글을 HTML로 해석하지 않음) */
const GUESTBOOK_LIST_LIMIT = 20;
const COOLDOWN_KEY = 'urbanlife.guestbook.lastAt';

const guestbookReady = () => Boolean(GUESTBOOK.url && GUESTBOOK.anonKey);
/* 새 publishable 키(sb_publishable_…)는 apikey 헤더로만 보낸다. 예전 anon 키(JWT)는 Authorization에도 넣는다 */
const isLegacyKey = () => !GUESTBOOK.anonKey.startsWith('sb_');
const gbHeaders = (extra = {}) => ({
  apikey: GUESTBOOK.anonKey,
  ...(isLegacyKey() ? { Authorization: `Bearer ${GUESTBOOK.anonKey}` } : {}),
  ...extra,
});

/* 생존 기간(days) 칸은 나중에 추가한 칸이라, 테이블에 아직 없으면 빼고 다시 요청한다 */
const BASE_FIELDS = 'species,message,ending,created_at';
let hasDaysColumn = true;

/** species를 주면 그 동물에게 남긴 글만, 없으면 모든 동물의 글을 최신순으로 */
async function fetchNotes(species, limit = GUESTBOOK_LIST_LIMIT) {
  const query = (fields) => {
    const q = new URLSearchParams({ select: fields, order: 'created_at.desc', limit: String(limit) });
    if (species) q.set('species', `eq.${species}`);
    return fetch(`${GUESTBOOK.url}/rest/v1/guestbook?${q}`, { headers: gbHeaders() });
  };
  let res = await query(hasDaysColumn ? `${BASE_FIELDS},days` : BASE_FIELDS);
  if (res.status === 400 && hasDaysColumn) { hasDaysColumn = false; res = await query(BASE_FIELDS); }
  if (!res.ok) throw new Error(`방명록 읽기 실패 (${res.status})`);
  const rows = await res.json();
  return Array.isArray(rows) ? rows.filter(isNoteRow) : [];
}

async function postNote(species, ending, message, days) {
  const send = (body) => fetch(`${GUESTBOOK.url}/rest/v1/guestbook`, {
    method: 'POST',
    headers: gbHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify(body),
  });
  let res = await send(hasDaysColumn ? { species, ending, message, days } : { species, ending, message });
  if (res.status === 400 && hasDaysColumn) { hasDaysColumn = false; res = await send({ species, ending, message }); }
  if (!res.ok) throw new Error(`방명록 쓰기 실패 (${res.status})`);
}

/** "9개월 생존" 같은 라벨. 생존 기간이 없으면 null */
function survivedLabel(row) {
  const d = noteDays(row);
  return d === null ? null : h('span', { class: 'note-days' }, tx('note.survived', { age: durText(d) }));
}

function readLastPost() {
  try { return Number(localStorage.getItem(COOLDOWN_KEY)) || null; } catch { return null; }
}
function writeLastPost(now) {
  try { localStorage.setItem(COOLDOWN_KEY, String(now)); } catch (err) { console.warn('방명록 시간을 저장하지 못했다', err); }
}

function noteItem(sp, row) {
  const end = sp.endings[row.ending];
  const meta = h('span', { class: 'note-meta' }, survivedLabel(row), end ? h('span', { class: 'note-end' }, end.title) : null);
  return h('li', null, h('span', { class: 'note-text' }, row.message), meta);
}

/** 엔딩 카드에 붙는 방명록 영역 */
function guestbookSection(sp, endingId, days) {
  const list = h('ul', { class: 'notes' });
  const status = h('p', { class: 'note-status', role: 'status' });
  const input = h('input', { type: 'text', maxlength: String(NOTE_MAX), placeholder: tx('note.placeholder', { n: NOTE_MAX }), 'aria-label': tx('note.title', { name: nameInText(sp) }) });
  const button = h('button', { type: 'submit', class: 'note-send' }, tx('note.send'));
  const form = h('form', { class: 'note-form' }, input, button);
  const goWall = h('button', { type: 'button', class: 'wall-link', onclick: () => { showPicker(); openWall(sp.key); } }, tx('note.toWall'));
  const section = h('section', { class: 'guestbook' }, h('h3', null, tx('note.title', { name: nameInText(sp) })), form, status, list, goWall);

  if (!guestbookReady()) {
    input.disabled = true; button.disabled = true;
    return section;
  }

  const refresh = () => fetchNotes(sp.key)
    .then((rows) => {
      list.replaceChildren(...rows.map((r) => noteItem(sp, r)));
      if (!rows.length) status.textContent = tx('note.emptyFor', { name: nameInText(sp) });
    })
    .catch((err) => { console.warn(err); status.textContent = tx('note.loadFail'); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = cleanNote(input.value);
    if (!note.ok) { status.textContent = tx(`note.${note.code}`, { n: NOTE_MAX }); return; }
    if (!canPostAt(readLastPost(), Date.now())) { status.textContent = tx('note.cooldown'); return; }
    button.disabled = true; status.textContent = tx('note.sending');
    postNote(sp.key, endingId, note.text, days)
      .then(() => {
        writeLastPost(Date.now());
        input.value = '';
        status.textContent = tx('note.sent');
        list.prepend(noteItem(sp, { message: note.text, ending: endingId, days }));
      })
      .catch((err) => { console.warn(err); status.textContent = tx('note.sendFail'); })
      .finally(() => { button.disabled = false; });
  });
  refresh();
  return section;
}

/* 홈 화면 "방명록 모아보기": 모든 동물에게 남긴 글. 스포일러가 되지 않게 엔딩 이름은 보여 주지 않는다 */
const WALL_LIMIT = 40;

function wallItem(row) {
  const sp = SPECIES[row.species];
  return h('li', null, h('span', { class: 'wall-who' }, sp ? tx('wall.to', { name: nameInText(sp) }) : ''), h('span', { class: 'note-text' }, row.message), survivedLabel(row));
}

function renderWall(wall, filter) {
  const status = h('p', { class: 'note-status', role: 'status' }, tx('wall.loading'));
  const list = h('ul', { class: 'notes wall-notes' });
  const tabs = h('div', { class: 'wall-tabs', role: 'tablist' },
    [['', tx('wall.all')], ...SPECIES_KEYS.map((k) => [k, SPECIES[k].name])].map(([key, label]) =>
      h('button', { class: `wall-tab${key === filter ? ' on' : ''}`, role: 'tab', 'aria-selected': String(key === filter), onclick: () => renderWall(wall, key) }, label)));
  wall.replaceChildren(tabs, status, list);
  if (!guestbookReady()) { status.textContent = tx('wall.soon'); return; }
  fetchNotes(filter || null, WALL_LIMIT)
    .then((rows) => {
      list.replaceChildren(...rows.filter((r) => typeof r.species === 'string').map(wallItem));
      status.textContent = rows.length ? '' : tx('wall.none');
    })
    .catch((err) => { console.warn(err); status.textContent = tx('note.loadFail'); });
}

/** 방명록 모아보기를 펼친다. filter에 동물 키를 주면 그 동물 탭으로 연다 */
function openWall(filter = '') {
  const toggle = $('wallToggle'), wall = $('wall');
  wall.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  toggle.textContent = tx('wall.close');
  wall.style.setProperty('--deckle', deckle());
  renderWall(wall, filter);
  wall.scrollIntoView({ block: 'nearest', behavior: reducedMotionUi ? 'auto' : 'smooth' });
}

function closeWall() {
  $('wall').hidden = true;
  $('wallToggle').setAttribute('aria-expanded', 'false');
  $('wallToggle').textContent = tx('wall.open');
}

function setupWall() {
  $('wallToggle').addEventListener('click', () => ($('wall').hidden ? openWall('') : closeWall()));
}

/* 제작자 응원: 토스·카카오페이 송금 링크를 새 탭으로 연다. 링크가 하나도 없으면 버튼을 숨긴다 */
const SUPPORT_LINKS = Object.freeze([
  ['toss', 'support.toss', /^https:\/\/toss\.me\/[\w.-]+\/?$/],
  ['kakaopay', 'support.kakaopay', /^https:\/\/qr\.kakaopay\.com\/[\w-]+\/?$/],
]);

/** 설정된 링크 중 모양이 올바른 것만 쓴다 */
const supportLinks = () => SUPPORT_LINKS.filter(([key, , re]) => re.test(SUPPORT[key] || ''));

/* PC에서는 카카오페이 웹이 "모바일에서만 가능"이라, 버튼을 누르면 링크 대신 휴대폰으로 찍을 QR을 펼친다 */
const PC_QUERY = '(min-width: 900px) and (hover: hover)';

function kakaopayQr(link) {
  if (!link || !SUPPORT.kakaopayQr) return null;
  const qr = h('figure', { class: 'support-qr', id: 'supportQr', hidden: '' },
    h('img', { src: SUPPORT.kakaopayQr, width: '240', height: '224', alt: tx('support.qrAlt'), loading: 'lazy' }));
  link.setAttribute('aria-controls', 'supportQr');
  link.addEventListener('click', (e) => {
    if (!window.matchMedia(PC_QUERY).matches) return;
    e.preventDefault();
    qr.hidden = !qr.hidden;
    link.setAttribute('aria-expanded', String(!qr.hidden));
  });
  return qr;
}

/* 제작자 링크드인: 송금 버튼 오른쪽에 붙는 정사각형 로고 버튼 */
const LINKEDIN_RE = /^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/;
const LINKEDIN_PATH = 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z';
const SVG_NS = 'http://www.w3.org/2000/svg';

function linkedinLink() {
  if (!LINKEDIN_RE.test(SUPPORT.linkedin || '')) return null;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', LINKEDIN_PATH);
  svg.append(path);
  return h('a', { class: 'support-link linkedin', href: SUPPORT.linkedin, target: '_blank', rel: 'noopener noreferrer', 'aria-label': tx('support.linkedin'), title: tx('support.linkedin') }, svg);
}

/* 영어판 후원: 해외에서는 카카오페이를 못 쓰므로 EVM 지갑 주소. PC는 QR, 휴대폰은 주소 복사와 '지갑 앱으로 열기'(보조) */
const EVM_RE = /^0x[0-9a-fA-F]{40}$/;

function copyText(text, button) {
  const done = (ok) => { button.textContent = tx(ok ? 'support.copied' : 'support.copyFail'); setTimeout(() => { button.textContent = tx('support.copy'); }, 1800); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
  else done(false);
}

function evmSupport() {
  const addr = SUPPORT.evm;
  if (!EVM_RE.test(addr || '')) return null;
  const code = h('code', { class: 'evm-addr' }, addr);
  const copy = h('button', { type: 'button', class: 'support-link evm-copy', onclick: () => copyText(addr, copy) }, tx('support.copy'));
  return h('div', { class: 'evm' },
    SUPPORT.evmQr ? h('img', { class: 'evm-qr', src: SUPPORT.evmQr, width: '200', height: '200', alt: tx('support.evmQrAlt'), loading: 'lazy' }) : null,
    h('div', { class: 'evm-side' },
      h('span', { class: 'evm-label' }, tx('support.evmLabel')),
      code,
      h('div', { class: 'evm-actions' }, copy, h('a', { class: 'support-link evm-open', href: `ethereum:${addr}` }, tx('support.openWallet'))),
      h('span', { class: 'evm-note' }, tx('support.evmNote'))));
}

function setupSupport() {
  const english = LANG === 'en';
  const links = english ? [] : supportLinks(), toggle = $('supportToggle'), box = $('support');
  const evm = english ? evmSupport() : null;
  if (!links.length && !evm) return;
  toggle.hidden = false;
  const anchors = links.map(([key, label]) =>
    h('a', { class: `support-link ${key}`, href: SUPPORT[key], target: '_blank', rel: 'noopener noreferrer' }, tx(label)));
  const qr = kakaopayQr(anchors.find((a) => a.classList.contains('kakaopay')));
  // replaceChildren은 null을 글자 'null'로 넣으므로 없는 조각은 걸러 낸다
  box.replaceChildren(...[
    h('p', null, tx('support.intro')),
    evm,
    h('div', { class: 'support-links' }, anchors, linkedinLink()),
    qr,
  ].filter(Boolean));
  toggle.addEventListener('click', () => {
    const open = box.hidden;
    box.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) box.style.setProperty('--deckle', deckle());
  });
}
