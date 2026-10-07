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
  return d === null ? null : h('span', { class: 'note-days' }, `${durLabel(d)} 생존`);
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
  const input = h('input', { type: 'text', maxlength: String(NOTE_MAX), placeholder: `${NOTE_MAX}자까지 짧게`, 'aria-label': `${sp.name}에게 한 마디` });
  const button = h('button', { type: 'submit', class: 'note-send' }, '남기기');
  const form = h('form', { class: 'note-form' }, input, button);
  const goWall = h('button', { type: 'button', class: 'wall-link', onclick: () => { showPicker(); openWall(sp.key); } }, '방명록 보러가기 →');
  const section = h('section', { class: 'guestbook' }, h('h3', null, `${sp.name}에게 한 마디`), form, status, list, goWall);

  if (!guestbookReady()) {
    input.disabled = true; button.disabled = true;
    return section;
  }

  const refresh = () => fetchNotes(sp.key)
    .then((rows) => {
      list.replaceChildren(...rows.map((r) => noteItem(sp, r)));
      if (!rows.length) status.textContent = `아직 ${sp.name}에게 남긴 말이 없어요. 첫 마디를 남겨 주세요.`;
    })
    .catch((err) => { console.warn(err); status.textContent = '방명록을 불러오지 못했어요. 잠시 뒤에 다시 열어 주세요.'; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = cleanNote(input.value);
    if (!note.ok) { status.textContent = note.error; return; }
    if (!canPostAt(readLastPost(), Date.now())) { status.textContent = '조금 뒤에 다시 남길 수 있어요.'; return; }
    button.disabled = true; status.textContent = '남기는 중…';
    postNote(sp.key, endingId, note.text, days)
      .then(() => {
        writeLastPost(Date.now());
        input.value = '';
        status.textContent = '남겼어요.';
        list.prepend(noteItem(sp, { message: note.text, ending: endingId, days }));
      })
      .catch((err) => { console.warn(err); status.textContent = '남기지 못했어요. 잠시 뒤에 다시 시도해 주세요.'; })
      .finally(() => { button.disabled = false; });
  });
  refresh();
  return section;
}

/* 홈 화면 "방명록 모아보기": 모든 동물에게 남긴 글. 스포일러가 되지 않게 엔딩 이름은 보여 주지 않는다 */
const WALL_LIMIT = 40;

function wallItem(row) {
  const sp = SPECIES[row.species];
  return h('li', null, h('span', { class: 'wall-who' }, sp ? `${sp.name}에게` : ''), h('span', { class: 'note-text' }, row.message), survivedLabel(row));
}

function renderWall(wall, filter) {
  const status = h('p', { class: 'note-status', role: 'status' }, '불러오는 중…');
  const list = h('ul', { class: 'notes wall-notes' });
  const tabs = h('div', { class: 'wall-tabs', role: 'tablist' },
    [['', '전체'], ...SPECIES_KEYS.map((k) => [k, SPECIES[k].name])].map(([key, label]) =>
      h('button', { class: `wall-tab${key === filter ? ' on' : ''}`, role: 'tab', 'aria-selected': String(key === filter), onclick: () => renderWall(wall, key) }, label)));
  wall.replaceChildren(tabs, status, list);
  if (!guestbookReady()) { status.textContent = '방명록은 곧 열려요.'; return; }
  fetchNotes(filter || null, WALL_LIMIT)
    .then((rows) => {
      list.replaceChildren(...rows.filter((r) => typeof r.species === 'string').map(wallItem));
      status.textContent = rows.length ? '' : '아직 남긴 말이 없어요. 한 번 살아 보고 첫 마디를 남겨 주세요.';
    })
    .catch((err) => { console.warn(err); status.textContent = '방명록을 불러오지 못했어요. 잠시 뒤에 다시 열어 주세요.'; });
}

/** 방명록 모아보기를 펼친다. filter에 동물 키를 주면 그 동물 탭으로 연다 */
function openWall(filter = '') {
  const toggle = $('wallToggle'), wall = $('wall');
  wall.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  toggle.textContent = '방명록 접기 ▲';
  wall.style.setProperty('--deckle', deckle());
  renderWall(wall, filter);
  wall.scrollIntoView({ block: 'nearest', behavior: reducedMotionUi ? 'auto' : 'smooth' });
}

function closeWall() {
  $('wall').hidden = true;
  $('wallToggle').setAttribute('aria-expanded', 'false');
  $('wallToggle').textContent = '방명록 모아보기 ▼';
}

function setupWall() {
  $('wallToggle').addEventListener('click', () => ($('wall').hidden ? openWall('') : closeWall()));
}

/* 제작자 응원: 토스·카카오페이 송금 링크를 새 탭으로 연다. 링크가 하나도 없으면 버튼을 숨긴다 */
const SUPPORT_LINKS = Object.freeze([
  ['toss', '토스로 응원하기', /^https:\/\/toss\.me\/[\w.-]+\/?$/],
  ['kakaopay', '라떼 한 잔 보내기', /^https:\/\/qr\.kakaopay\.com\/[\w-]+\/?$/],
]);

/** 설정된 링크 중 모양이 올바른 것만 쓴다 */
const supportLinks = () => SUPPORT_LINKS.filter(([key, , re]) => re.test(SUPPORT[key] || ''));

/* PC에서는 카카오페이 웹이 "모바일에서만 가능"이라, 버튼을 누르면 링크 대신 휴대폰으로 찍을 QR을 펼친다 */
const PC_QUERY = '(min-width: 900px) and (hover: hover)';

function kakaopayQr(link) {
  if (!link || !SUPPORT.kakaopayQr) return null;
  const qr = h('figure', { class: 'support-qr', id: 'supportQr', hidden: '' },
    h('img', { src: SUPPORT.kakaopayQr, width: '240', height: '224', alt: '카카오페이 송금 QR 코드', loading: 'lazy' }));
  link.setAttribute('aria-controls', 'supportQr');
  link.addEventListener('click', (e) => {
    if (!window.matchMedia(PC_QUERY).matches) return;
    e.preventDefault();
    qr.hidden = !qr.hidden;
    link.setAttribute('aria-expanded', String(!qr.hidden));
  });
  return qr;
}

function setupSupport() {
  const links = supportLinks(), toggle = $('supportToggle'), box = $('support');
  if (!links.length) return;
  toggle.hidden = false;
  const anchors = links.map(([key, label]) =>
    h('a', { class: `support-link ${key}`, href: SUPPORT[key], target: '_blank', rel: 'noopener noreferrer' }, label));
  const qr = kakaopayQr(anchors.find((a) => a.classList.contains('kakaopay')));
  box.replaceChildren(
    h('p', null, '세상이 혼란스럽고 저는 내일을 모르겠습니다. 그래도 이것저것을 만드는 디자이너입니다. 아이스 라떼를 몹시 좋아합니다.'),
    h('div', { class: 'support-links' }, anchors),
    qr,
  );
  toggle.addEventListener('click', () => {
    const open = box.hidden;
    box.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) box.style.setProperty('--deckle', deckle());
  });
}
