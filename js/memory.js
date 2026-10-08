/* 해피엔딩 회상: 엔딩 카드가 놓인 뒤 그 동물의 좋았던 순간 한 장을 부드럽게 띄운다. 캡션 없이 그림만 보여 준다.
   바로 닫을 수 있고(닫기·Esc·바깥 클릭), 엔딩 카드의 '기억 다시 보기'로 다시 연다. 노멀엔딩도 해피엔딩처럼 띄우고, 죽음 엔딩에는 띄우지 않는다 */
const MEMORY_DELAY_MS = 900;
let memoryTimer = null, memoryReturnFocus = null;

/** 엔딩 직전에 그 동물 그림만 미리 받아 둔다 (첫 화면에서 13장을 다 받지 않는다) */
function preloadMemory(key) {
  if (!MEMORIES[key]) return;
  const img = new Image();
  img.src = memoryImage(key);
}

function openMemory(key) {
  const m = MEMORIES[key];
  if (!m) return;
  clearTimeout(memoryTimer);
  const box = $('memory'), img = $('memoryImg');
  memoryReturnFocus = document.activeElement;
  $('memoryFail').hidden = true;
  img.hidden = false;
  img.alt = LANG === 'ko' ? m.alt : tx('memory.alt', { name: SPECIES[key] ? nameInText(SPECIES[key]) : key });
  img.onerror = () => { img.hidden = true; $('memoryFail').hidden = false; };
  img.src = memoryImage(key);
  box.querySelector('.memory-frame').style.setProperty('--deckle', deckle());
  box.hidden = false;
  void box.offsetWidth;
  box.classList.add('open');
  $('memoryClose').focus({ preventScroll: true });
}

function closeMemory() {
  const box = $('memory');
  clearTimeout(memoryTimer);
  if (box.hidden) return;
  box.classList.remove('open');
  box.hidden = true;
  if (memoryReturnFocus && memoryReturnFocus.focus) memoryReturnFocus.focus({ preventScroll: true });
  memoryReturnFocus = null;
}

/** 해피엔딩 카드가 놓인 뒤 잠시 있다가 연다 */
function scheduleMemory(key) {
  clearTimeout(memoryTimer);
  memoryTimer = setTimeout(() => openMemory(key), MEMORY_DELAY_MS);
}

/** 엔딩 카드 안의 '기억 다시 보기' 단추 */
const memoryButton = (key) => (MEMORIES[key]
  ? h('button', { class: 'memory-again', type: 'button', onclick: () => openMemory(key) }, tx('memory.again'))
  : null);

function setupMemory() {
  const box = $('memory');
  $('memoryClose').addEventListener('click', closeMemory);
  box.addEventListener('click', (e) => { if (e.target === box) closeMemory(); });
  // 열려 있는 동안엔 키보드가 뒤의 카드를 넘기지 않게 막고, Esc로 닫는다
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    e.stopImmediatePropagation();
    if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); closeMemory(); }
  }, true);
}

/* ── 수집한 기억카드: 해피엔딩을 맞은 동물의 카드가 이 기기 브라우저에 모인다 ── */
const COLLECT_KEY = 'urbanlife.memories';

function loadCollected() {
  try {
    const raw = JSON.parse(localStorage.getItem(COLLECT_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((k) => typeof k === 'string' && MEMORIES[k]) : [];
  } catch { return []; }
}

function addCollected(key) {
  if (!MEMORIES[key]) return;
  const list = loadCollected().filter((k) => k !== key);
  try { localStorage.setItem(COLLECT_KEY, JSON.stringify([...list, key])); } catch (err) { console.warn('기억카드를 저장하지 못했다', err); }
}

/** 모은 카드를 사진 더미처럼 위아래로 겹쳐 쌓는다. 최근에 모은 카드가 맨 위 */
function renderAlbum() {
  const list = loadCollected().slice().reverse();
  $('albumCount').textContent = `${list.length} / ${Object.keys(MEMORIES).length}`;
  $('albumEmpty').hidden = list.length > 0;
  $('albumStack').replaceChildren(...list.map((key, i) => {
    const card = h('button', { class: 'album-card', type: 'button', 'aria-label': tx('album.cardLabel', { name: SPECIES[key] ? nameInText(SPECIES[key]) : key }), onclick: () => openMemory(key) },
      h('img', { src: memoryImage(key), alt: LANG === 'ko' ? MEMORIES[key].alt : tx('memory.alt', { name: SPECIES[key] ? nameInText(SPECIES[key]) : key }), loading: 'lazy', decoding: 'async', width: '700', height: '438' }));
    card.style.setProperty('--deckle', deckle());
    card.style.setProperty('--tilt', `${((hash(i, 91) - .5) * 5).toFixed(2)}deg`);
    card.style.setProperty('--shift', `${((hash(i, 92) - .5) * 24).toFixed(0)}px`);
    return h('li', null, card);
  }));
}

let albumReturnFocus = null;
function openAlbum() {
  albumReturnFocus = document.activeElement;
  renderAlbum();
  $('album').hidden = false;
  $('albumClose').focus({ preventScroll: true });
}

function closeAlbum() {
  if ($('album').hidden) return;
  $('album').hidden = true;
  if (albumReturnFocus && albumReturnFocus.focus) albumReturnFocus.focus({ preventScroll: true });
  albumReturnFocus = null;
}

function setupAlbum() {
  $('albumToggle').addEventListener('click', openAlbum);
  $('albumClose').addEventListener('click', closeAlbum);
  document.addEventListener('keydown', (e) => {
    if ($('album').hidden || !$('memory').hidden) return;
    e.stopImmediatePropagation();
    if (e.key === 'Escape') { e.preventDefault(); closeAlbum(); }
  }, true);
}
