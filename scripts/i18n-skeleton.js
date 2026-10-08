/* 영어판 번역 파일의 뼈대를 만든다: 동물 데이터의 문장 필드만 같은 모양으로 뽑아 js/data/i18n/en/<동물>.js에 쓴다.
   값은 한국어 원문으로 채워 두고, 번역할 때 영어로 바꾼다(tests/i18n.test.js가 한글이 남았는지 검사한다).
   사용: node scripts/i18n-skeleton.js cat   (이미 있으면 덮어쓰지 않는다. --force로 덮어씀) */
const fs = require('node:fs');
const path = require('node:path');

const key = process.argv[2], force = process.argv.includes('--force');
if (!key) { console.error('사용: node scripts/i18n-skeleton.js <동물>'); process.exit(1); }
const sp = require(`../js/data/species/${key}.js`);
const out = path.join(__dirname, '..', 'js', 'data', 'i18n', 'en', `${key}.js`);
if (fs.existsSync(out) && !force) { console.error(`이미 있음: ${out}`); process.exit(1); }

const pick = (obj, fields) => Object.fromEntries(fields.filter((f) => typeof obj[f] === 'string').map((f) => [f, obj[f]]));
const choice = (c) => ({
  ...pick(c, ['t', 'msg']),
  ...(c.hurt && c.hurt.msg ? { hurt: { msg: c.hurt.msg } } : {}),
  ...(c.risk && c.risk.msg ? { risk: { msg: c.risk.msg } } : {}),
});
const text = {
  ...pick(sp, ['name', 'place', 'intro', 'kidUnit']),
  scenes: Object.fromEntries(Object.entries(sp.scenes).map(([id, sc]) => [id, { ...pick(sc, ['title', 'text']), choices: sc.choices.map(choice) }])),
  endings: Object.fromEntries(Object.entries(sp.endings).map(([id, e]) => [id, pick(e, ['title', 'cause', 'line'])])),
};
const body = `/* ${sp.name} 영어판 문장. 모양은 js/data/species/${key}.js와 같고 문장만 담는다 (js/core/i18n.js overlayText) */
(function register(text) {
  if (typeof module !== 'undefined' && module.exports) module.exports = text;
  else registerTranslation('en', '${key}', text);
})(${JSON.stringify(text, null, 2)});
`;
fs.writeFileSync(out, body);
console.log(`wrote ${path.relative(process.cwd(), out)}`);
