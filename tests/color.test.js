const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/core/color.js');

test('mix는 두 색 사이를 비율대로 섞는다', () => {
  assert.equal(C.mix('#000000', '#ffffff', 0), '#000000');
  assert.equal(C.mix('#000000', '#ffffff', 1), '#ffffff');
  assert.equal(C.mix('#000000', '#ffffff', 0.5), '#808080');
});

test('hexToRgb는 잘못된 색을 거부한다', () => {
  assert.throws(() => C.hexToRgb('red'), /잘못된 색상/);
  assert.deepEqual(C.hexToRgb('#ff8000'), [255, 128, 0]);
});

test('nightify는 새 팔레트를 만들고 원본을 바꾸지 않는다', () => {
  const pal = Object.freeze({ skyTop: '#aaccee', skyBottom: '#ffeedd', sun: '#ffffff', ground: '#808080' });
  const night = C.nightify(pal, false);
  assert.notEqual(night, pal);
  assert.equal(night.skyTop, C.NIGHT_SKY[0]);
  assert.equal(night.sun, C.MOON);
  assert.notEqual(night.ground, pal.ground);
});

test('실내 장면의 밤은 하늘색 대신 벽색을 어둡게만 한다', () => {
  const pal = { skyTop: '#f0e0c0', skyBottom: '#f0e0c0', sun: '#ffffff' };
  const night = C.nightify(pal, true);
  assert.notEqual(night.skyTop, C.NIGHT_SKY[0]);
});

test('rgba는 알파값이 들어간 CSS 색을 만든다', () => {
  assert.equal(C.rgba('#ff0000', 0.5), 'rgba(255,0,0,0.5)');
});

const lum = (hex) => { const [r, g, b] = C.hexToRgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b; };

test('nightTone은 깊이 0에서 예전처럼 밤빛을 55% 섞는다', () => {
  assert.equal(C.nightTone('#d8c6c2', 0), C.mix('#d8c6c2', C.NIGHT_TINT, 0.55));
});

test('nightTone은 가까운 층(깊이가 클수록)일수록 더 어둡게 만든다', () => {
  const c = '#d8c6c2';
  const steps = [0, 0.25, 0.5, 0.75, 1].map((d) => lum(C.nightTone(c, d)));
  steps.slice(1).forEach((v, i) => assert.ok(v < steps[i], `깊이 ${i + 1}이 ${i}보다 어두워야 한다`));
});

test('nightTone은 0~1 밖의 깊이를 잘라 쓰고 잘못된 깊이를 거부한다', () => {
  assert.equal(C.nightTone('#808080', 2), C.nightTone('#808080', 1));
  assert.equal(C.nightTone('#808080', -1), C.nightTone('#808080', 0));
  assert.throws(() => C.nightTone('#808080', NaN), /깊이/);
});

test('바깥 밤 팔레트: 지평선 하늘 > 먼 층 > 벽 > 땅 순으로 밝다', () => {
  const pal = { skyTop: '#9cc6d6', skyBottom: '#f4e3cc', sun: '#fff4dc', far1: '#d8c6c2', far2: '#bea9a8',
    wall: '#cbb2a6', ground: '#8e8a8e', groundTop: '#b0acaf', light: '#fffaf0' };
  const n = C.nightify(pal, false);
  assert.equal(n.skyBottom, C.NIGHT_SKY[1]);
  assert.equal(n.skyMid, C.NIGHT_SKY_MID);
  assert.ok(lum(n.skyBottom) > lum(n.skyTop) * 1.6, '지평선이 하늘 위보다 1.6배 밝다');
  assert.ok(lum(n.skyBottom) > lum(n.far1));
  assert.ok(lum(n.far1) > lum(n.wall));
  assert.ok(lum(n.wall) > lum(n.ground));
  assert.equal(n.light, C.nightTone(pal.light, 0), '불빛 색은 밝게 남는다');
});

test('winterize는 눈 덮인 땅과 차가운 해 빛무리를 가진 새 팔레트를 만든다', () => {
  const pal = Object.freeze({ ground: '#808080', groundTop: '#909090', sunGlow: '#ffd9ae' });
  const w = C.winterize(pal);
  assert.notEqual(w, pal);
  assert.equal(w.sunGlow, C.SNOW_GLOW);
  assert.equal(pal.sunGlow, '#ffd9ae');
});
