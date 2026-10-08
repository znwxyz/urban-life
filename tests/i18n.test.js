const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const I = require('../js/core/i18n.js');

const HANGUL = /[ㄱ-ㆎ가-힣]/;
const KEYS = (process.env.SPECIES || 'cat,cockroach,pigeon,fly,mosquito,sparrow,cicada,dog,mouse,magpie,crow,butterfly,wasp').split(',');
const enFile = (key) => path.join(__dirname, '..', 'js', 'data', 'i18n', 'en', `${key}.js`);

test('overlayText는 문장만 덮어쓰고 수치·분기는 그대로 둔다', () => {
  const base = { name: '고양이', stats: { hp: 10 }, scenes: { A: { title: '가', next: 'B', choices: [{ t: '하나', fx: { hp: 1 }, risk: { p: .2, ending: 'D', msg: '앗' } }] } } };
  const out = I.overlayText(base, { name: 'Cat', stats: { hp: 99 }, scenes: { A: { title: 'A', next: 'Z', choices: [{ t: 'One', risk: { msg: 'Oops', p: 1 } }] } } });
  assert.equal(out.name, 'Cat');
  assert.equal(out.stats.hp, 10);
  assert.equal(out.scenes.A.next, 'B');
  assert.equal(out.scenes.A.choices[0].t, 'One');
  assert.equal(out.scenes.A.choices[0].risk.p, .2);
  assert.equal(out.scenes.A.choices[0].risk.msg, 'Oops');
  assert.equal(base.name, '고양이', '원본을 바꾸지 않는다');
});

test('durText는 영어 기간을 단수·복수로 쓴다', () => {
  assert.equal(I.durText(1, 'en'), '1 day');
  assert.equal(I.durText(21, 'en'), '3 weeks');
  assert.equal(I.durText(30 * 14, 'en'), '1 year 2 months');
  assert.equal(I.durText(21, 'ko'), '3주');
});

/** 동물 데이터의 문장 필드를 모두 [경로, 문장]으로 */
function textPaths(sp) {
  const out = [];
  ['name', 'place', 'intro', 'kidUnit'].forEach((f) => typeof sp[f] === 'string' && out.push([f]));
  Object.entries(sp.scenes).forEach(([id, sc]) => {
    ['title', 'text'].forEach((f) => typeof sc[f] === 'string' && out.push(['scenes', id, f]));
    sc.choices.forEach((c, i) => {
      ['t', 'msg'].forEach((f) => typeof c[f] === 'string' && out.push(['scenes', id, 'choices', i, f]));
      if (c.hurt && c.hurt.msg) out.push(['scenes', id, 'choices', i, 'hurt', 'msg']);
      if (c.risk && c.risk.msg) out.push(['scenes', id, 'choices', i, 'risk', 'msg']);
    });
  });
  Object.entries(sp.endings).forEach(([id, e]) => ['title', 'cause', 'line'].forEach((f) => typeof e[f] === 'string' && out.push(['endings', id, f])));
  return out;
}
const at = (obj, p) => p.reduce((o, k) => (o == null ? undefined : o[k]), obj);

KEYS.forEach((key) => {
  test(`${key}: 영어판 번역이 모든 문장을 덮고, 한글이 남지 않았다`, () => {
    assert.ok(fs.existsSync(enFile(key)), `번역 파일 없음: ${key}`);
    const sp = require(`../js/data/species/${key}.js`), en = require(enFile(key));
    textPaths(sp).forEach((p) => {
      const v = at(en, p);
      assert.equal(typeof v, 'string', `${key} 번역 빠짐: ${p.join('.')}`);
      assert.ok(v.trim(), `${key} 빈 번역: ${p.join('.')}`);
      assert.ok(!HANGUL.test(v), `${key} 한글이 남음: ${p.join('.')} = ${v}`);
    });
  });
});
