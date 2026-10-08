/* 해피엔딩 회상: 엔딩 카드가 놓인 뒤 그 동물의 좋았던 순간 한 장을 부드럽게 띄운다. 캡션 없이 그림만 보여 준다.
   바로 닫을 수 있고(닫기·Esc·바깥 클릭), 엔딩 카드의 '기억 다시 보기'로 다시 연다. 실패 엔딩에는 띄우지 않는다 */
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
  img.alt = m.alt;
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
  ? h('button', { class: 'memory-again', type: 'button', onclick: () => openMemory(key) }, '기억 다시 보기')
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
