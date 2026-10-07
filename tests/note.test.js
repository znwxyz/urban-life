const test = require('node:test');
const assert = require('node:assert/strict');
const N = require('../js/core/note.js');

test('cleanNote는 앞뒤 공백을 지우고 줄바꿈·연속 공백을 한 칸으로 합친다', () => {
  assert.deepEqual(N.cleanNote('  잘 살아\n\n  줘서   고마워  '), { ok: true, text: '잘 살아 줘서 고마워' });
});

test('cleanNote는 빈 글을 거부한다', () => {
  assert.equal(N.cleanNote('   ').ok, false);
  assert.equal(N.cleanNote('').ok, false);
  assert.equal(N.cleanNote(null).ok, false);
});

test(`cleanNote는 ${N.NOTE_MAX}자를 넘으면 거부한다`, () => {
  assert.equal(N.cleanNote('가'.repeat(N.NOTE_MAX)).ok, true);
  assert.equal(N.cleanNote('가'.repeat(N.NOTE_MAX + 1)).ok, false);
});

test('cleanNote는 제어 문자를 지운다', () => {
  assert.deepEqual(N.cleanNote('안녕\u0000하세요\u0007'), { ok: true, text: '안녕 하세요' });
});

test('isNoteRow는 서버에서 온 행(외부 데이터)을 검사한다', () => {
  assert.equal(N.isNoteRow({ message: '고마워', ending: 'H1', created_at: '2026-10-07T00:00:00Z' }), true);
  assert.equal(N.isNoteRow({ message: '', ending: 'H1' }), false);
  assert.equal(N.isNoteRow({ message: 3, ending: 'H1' }), false);
  assert.equal(N.isNoteRow({ message: 'x'.repeat(N.NOTE_MAX + 1), ending: 'H1' }), false);
  assert.equal(N.isNoteRow(null), false);
});

test('canPostAt은 마지막으로 남긴 뒤 쿨다운이 지나야 true다', () => {
  assert.equal(N.canPostAt(null, 1000), true);
  assert.equal(N.canPostAt(1000, 1000 + N.COOLDOWN_MS - 1), false);
  assert.equal(N.canPostAt(1000, 1000 + N.COOLDOWN_MS), true);
});
