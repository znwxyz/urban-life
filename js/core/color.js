/* 색 유틸: 팔레트 혼합, 밤·눈 변환. 순수 함수 (Node 테스트 가능) */
const NIGHT_TINT = '#1d2447';
const NIGHT_AMOUNT = 0.55;
const NIGHT_AMOUNT_INDOOR = 0.4;
const NIGHT_SKY = Object.freeze(['#1a2242', '#4b4672']);
const MOON = '#f4ecd2';
const SNOW = '#f4f1ec';
const SNOW_GROUND = '#e8e6e2';
const HEX_RE = /^#([0-9a-f]{6})$/i;

/** @param {string} hex @returns {number[]} */
function hexToRgb(hex) {
  const m = HEX_RE.exec(String(hex));
  if (!m) throw new Error(`잘못된 색상 값: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(rgb) {
  return `#${rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('')}`;
}

/* 렌더링 중 같은 혼합을 반복하므로 결과를 기억해 둔다 */
const mixMemo = new Map();
/** @param {string} a @param {string} b @param {number} t 0~1 @returns {string} */
function mix(a, b, t) {
  const key = `${a}${b}${t}`;
  const hit = mixMemo.get(key);
  if (hit) return hit;
  const A = hexToRgb(a), B = hexToRgb(b);
  const out = rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
  mixMemo.set(key, out);
  return out;
}

function rgba(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

const isHex = (v) => typeof v === 'string' && HEX_RE.test(v);

function mapHex(pal, fn) {
  return Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, isHex(v) ? fn(v) : v]));
}

/** 밤 팔레트: 모든 색을 밤빛으로 물들이고, 바깥이면 하늘과 해를 바꾼다 */
function nightify(pal, isIndoor) {
  const tinted = mapHex(pal, (c) => mix(c, NIGHT_TINT, isIndoor ? NIGHT_AMOUNT_INDOOR : NIGHT_AMOUNT));
  if (isIndoor) return tinted;
  return { ...tinted, skyTop: NIGHT_SKY[0], skyBottom: NIGHT_SKY[1], sun: MOON };
}

/** 눈 덮인 땅 */
function winterize(pal) {
  return { ...pal, groundTop: SNOW, ground: mix(pal.ground, SNOW_GROUND, 0.3) };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NIGHT_TINT, NIGHT_SKY, MOON, hexToRgb, rgbToHex, mix, rgba, nightify, winterize };
}
