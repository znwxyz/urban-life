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
