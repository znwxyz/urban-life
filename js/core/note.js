/* 방명록 한 마디의 규칙: 입력 다듬기, 서버에서 온 행 검사, 연속 등록 막기. 순수 함수 (Node 테스트 가능) */
const NOTE_MAX = 80;
const COOLDOWN_MS = 30000;
const MAX_NOTE_DAYS = 10000;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/** 사용자가 쓴 글(외부 입력)을 다듬고 검사한다 */
function cleanNote(raw) {
  if (typeof raw !== 'string') return { ok: false, code: 'empty', error: '한 마디를 적어 주세요.' };
  const text = raw.replace(CONTROL_CHARS, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return { ok: false, code: 'empty', error: '한 마디를 적어 주세요.' };
  if ([...text].length > NOTE_MAX) return { ok: false, code: 'long', error: `${NOTE_MAX}자까지 쓸 수 있어요.` };
  return { ok: true, text };
}

/** 서버 응답 한 행이 화면에 보여도 되는 모양인지 */
function isNoteRow(row) {
  return Boolean(row) && typeof row.message === 'string' && row.message.length > 0
    && [...row.message].length <= NOTE_MAX && typeof row.ending === 'string';
}

/** 글쓴이가 게임에서 산 기간(일). 서버 값이 이상하면 null */
function noteDays(row) {
  const d = row && row.days;
  return Number.isInteger(d) && d >= 0 && d <= MAX_NOTE_DAYS ? d : null;
}

const canPostAt = (lastAt, now) => !Number.isFinite(lastAt) || now - lastAt >= COOLDOWN_MS;

if (typeof module !== 'undefined' && module.exports) module.exports = { NOTE_MAX, COOLDOWN_MS, MAX_NOTE_DAYS, cleanNote, isNoteRow, noteDays, canPostAt };
