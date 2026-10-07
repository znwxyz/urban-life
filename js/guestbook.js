/* 엔딩 방명록 "○○에게 한 마디". Supabase REST API로 읽고 쓴다.
   글은 항상 textContent로 넣는다 (다른 사람이 쓴 글을 HTML로 해석하지 않음) */
const GUESTBOOK_LIST_LIMIT = 20;
const COOLDOWN_KEY = 'urbanlife.guestbook.lastAt';

const guestbookReady = () => Boolean(GUESTBOOK.url && GUESTBOOK.anonKey);
const gbHeaders = (extra = {}) => ({ apikey: GUESTBOOK.anonKey, Authorization: `Bearer ${GUESTBOOK.anonKey}`, ...extra });

async function fetchNotes(species) {
  const q = new URLSearchParams({ species: `eq.${species}`, select: 'message,ending,created_at', order: 'created_at.desc', limit: String(GUESTBOOK_LIST_LIMIT) });
  const res = await fetch(`${GUESTBOOK.url}/rest/v1/guestbook?${q}`, { headers: gbHeaders() });
  if (!res.ok) throw new Error(`방명록 읽기 실패 (${res.status})`);
  const rows = await res.json();
  return Array.isArray(rows) ? rows.filter(isNoteRow) : [];
}

async function postNote(species, ending, message) {
  const res = await fetch(`${GUESTBOOK.url}/rest/v1/guestbook`, {
    method: 'POST',
    headers: gbHeaders({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ species, ending, message }),
  });
  if (!res.ok) throw new Error(`방명록 쓰기 실패 (${res.status})`);
}

function readLastPost() {
  try { return Number(localStorage.getItem(COOLDOWN_KEY)) || null; } catch { return null; }
}
function writeLastPost(now) {
  try { localStorage.setItem(COOLDOWN_KEY, String(now)); } catch (err) { console.warn('방명록 시간을 저장하지 못했다', err); }
}

function noteItem(sp, row) {
  const end = sp.endings[row.ending];
  return h('li', null, h('span', { class: 'note-text' }, row.message), end ? h('span', { class: 'note-end' }, end.title) : null);
}

/** 엔딩 카드에 붙는 방명록 영역 */
function guestbookSection(sp, endingId) {
  const list = h('ul', { class: 'notes' });
  const status = h('p', { class: 'note-status', role: 'status' });
  const input = h('input', { type: 'text', maxlength: String(NOTE_MAX), placeholder: `${NOTE_MAX}자까지 짧게`, 'aria-label': `${sp.name}에게 한 마디` });
  const button = h('button', { type: 'submit', class: 'note-send' }, '남기기');
  const form = h('form', { class: 'note-form' }, input, button);
  const section = h('section', { class: 'guestbook' }, h('h3', null, `${sp.name}에게 한 마디`), form, status, list);

  if (!guestbookReady()) {
    input.disabled = true; button.disabled = true;
    status.textContent = '방명록은 곧 열려요.';
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
    postNote(sp.key, endingId, note.text)
      .then(() => {
        writeLastPost(Date.now());
        input.value = '';
        status.textContent = '남겼어요.';
        list.prepend(noteItem(sp, { message: note.text, ending: endingId }));
      })
      .catch((err) => { console.warn(err); status.textContent = '남기지 못했어요. 잠시 뒤에 다시 시도해 주세요.'; })
      .finally(() => { button.disabled = false; });
  });
  refresh();
  return section;
}
