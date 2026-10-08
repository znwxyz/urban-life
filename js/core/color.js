/* 색 유틸: 팔레트 혼합, 밤·눈 변환. 순수 함수 (Node 테스트 가능) */
const NIGHT_TINT = '#1d2447';
const NIGHT_AMOUNT = 0.55;
const NIGHT_AMOUNT_INDOOR = 0.4;
/* 밤 하늘 [위, 지평선]과 그 사이 색. 지평선이 위보다 1.6배 넘게 밝다 (달빛이 지평선 쪽 공기를 밝힌다) */
const NIGHT_SKY = Object.freeze(['#141a33', '#46528a']);
const NIGHT_SKY_MID = '#262f5a';
/* 깊이별 밤 보정: 깊이 0(하늘·불빛)은 예전처럼 밤빛 55%, 깊이 1(땅)은 깊은 남색 쪽으로 거의 다 섞는다.
   그래서 밤에는 지평선 하늘 > 먼 층 > 가까운 층 > 땅 순으로 어두워진다 */
const NIGHT_DEEP = '#0c0f22';
const NIGHT_AMOUNT_DEEP = 0.95;
/* 바깥 팔레트 키별 깊이. 없는 키(불빛·유리·강조색·잉크)는 0으로 밝게 남는다 */
const NIGHT_DEPTH = Object.freeze({ far1: 0.6, far2: 0.7, wall: 0.7, wallAlt: 0.7, wallShade: 0.75, ceiling: 0.75, ground: 0.9, groundTop: 0.85 });
const MOON = '#f4ecd2';
const SNOW = '#f4f1ec';
const SNOW_GROUND = '#e8e6e2';
const SNOW_GLOW = '#f2f5fc';   // 눈 오는 날의 해 빛무리: 희고 차갑게
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

/**
 * 밤빛 한 색. depth 0~1: 0은 하늘·불빛(밤빛 55%), 1은 가장 가까운 땅(깊은 남색 95%)
 * @param {string} hex @param {number} depth @returns {string}
 */
function nightTone(hex, depth) {
  if (typeof depth !== 'number' || Number.isNaN(depth)) throw new Error(`잘못된 깊이 값: ${depth}`);
  const d = Math.min(1, Math.max(0, depth));
  return mix(hex, mix(NIGHT_TINT, NIGHT_DEEP, d), NIGHT_AMOUNT + (NIGHT_AMOUNT_DEEP - NIGHT_AMOUNT) * d);
}

/** 밤 팔레트: 바깥이면 층 깊이별로 어둡게 물들이고 하늘과 해(달)를 바꾼다. 실내는 모든 색을 고르게 물들인다 */
function nightify(pal, isIndoor) {
  if (isIndoor) return mapHex(pal, (c) => mix(c, NIGHT_TINT, NIGHT_AMOUNT_INDOOR));
  const tinted = Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, isHex(v) ? nightTone(v, NIGHT_DEPTH[k] || 0) : v]));
  return { ...tinted, skyTop: NIGHT_SKY[0], skyMid: NIGHT_SKY_MID, skyBottom: NIGHT_SKY[1], sun: MOON };
}

/** 눈 덮인 땅과 차가운 햇빛 */
function winterize(pal) {
  return { ...pal, groundTop: SNOW, ground: mix(pal.ground, SNOW_GROUND, 0.3), sunGlow: SNOW_GLOW };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SNOW_GLOW, NIGHT_TINT, NIGHT_SKY, NIGHT_SKY_MID, MOON, nightTone, hexToRgb, rgbToHex, mix, rgba, nightify, winterize };
}
