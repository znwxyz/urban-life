/* 언어: 한국어(기본)와 영어. 순수 함수 부분은 Node 테스트에서도 쓴다.
   - 화면 문구는 UI_TEXT[언어][키]. tx('key', { n: 3 })처럼 {이름} 자리를 채운다.
   - 이야기 영어판은 js/data/i18n/en/<동물>.js가 registerTranslation으로 등록하고,
     registerSpecies가 동물을 등록할 때 영어면 문장만 덮어쓴다(수치·분기는 그대로). */
const LANGS = Object.freeze(['ko', 'en']);
const LANG_KEY = 'urbanlife.lang';

/** 주소 ?lang=en > /en/ 페이지가 정한 값 > 저장된 값 > 한국어 */
function detectLang() {
  if (typeof window === 'undefined') return 'ko';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
  } catch { /* 주소를 못 읽으면 다음 순서로 */ }
  if (LANGS.includes(window.URBAN_LANG)) return window.URBAN_LANG;
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch { /* 저장소를 못 쓰면 기본값 */ }
  return 'ko';
}

const LANG = detectLang();
if (typeof document !== 'undefined') document.documentElement.lang = LANG;

/** 언어를 바꾸고 다시 연다. 영어는 /en/ 페이지로, 한국어는 첫 페이지로 */
function switchLang(lang) {
  if (!LANGS.includes(lang)) return;
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* 저장 못 해도 주소로 바뀐다 */ }
  const base = location.pathname.replace(/en\/(index\.html)?$/, '').replace(/index\.html$/, '');
  location.href = lang === 'en' ? `${base}en/` : `${base}?lang=ko`;
}

/* ── 이야기 번역: 문장 필드만 같은 모양으로 덮어쓴다 ── */
const TRANSLATIONS = { en: {} };
function registerTranslation(lang, key, text) {
  if (!TRANSLATIONS[lang]) TRANSLATIONS[lang] = {};
  TRANSLATIONS[lang][key] = text;
}

const TEXT_FIELDS = Object.freeze(['name', 'place', 'intro', 'kidUnit', 'title', 'text', 't', 'msg', 'cause', 'line']);

/** base(동물 데이터)에 over(번역)의 문장만 덮어쓴 새 객체. 번역에 없는 것은 원문 그대로 */
function overlayText(base, over) {
  if (!over || typeof over !== 'object') return base;
  if (Array.isArray(base)) return base.map((item, i) => overlayText(item, over[i]));
  if (!base || typeof base !== 'object') return base;
  const out = { ...base };
  Object.keys(over).forEach((k) => {
    if (!(k in base)) return;
    if (TEXT_FIELDS.includes(k) && typeof base[k] === 'string' && typeof over[k] === 'string' && over[k]) out[k] = over[k];
    else if (base[k] && typeof base[k] === 'object') out[k] = overlayText(base[k], over[k]);
  });
  return out;
}

const localizeSpecies = (sp, lang = LANG) => (lang === 'ko' ? sp : overlayText(sp, TRANSLATIONS[lang] && TRANSLATIONS[lang][sp.key]));

/* ── 기간·계절 ── */
const DAYS_PER_WEEK_I18N = 7, DAYS_PER_MONTH_I18N = 30, MONTHS_PER_YEAR_I18N = 12;
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** 생존 기간 표기. 한국어는 engine.js의 durLabel과 같다 */
function durText(d, lang = LANG) {
  if (lang !== 'en') return typeof durLabel === 'function' ? durLabel(d) : require('./engine.js').durLabel(d);
  if (d < 14) return plural(d, 'day');
  if (d < 60) return plural(Math.round(d / DAYS_PER_WEEK_I18N), 'week');
  const months = Math.round(d / DAYS_PER_MONTH_I18N), y = Math.floor(months / MONTHS_PER_YEAR_I18N), m = months % MONTHS_PER_YEAR_I18N;
  if (!y) return plural(months, 'month');
  return m ? `${plural(y, 'year')} ${plural(m, 'month')}` : plural(y, 'year');
}

const SEASON_TEXT = Object.freeze({
  ko: { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' },
  en: { spring: 'spring', summer: 'summer', autumn: 'autumn', winter: 'winter' },
});
const seasonText = (season, lang = LANG) => (SEASON_TEXT[lang] || SEASON_TEXT.ko)[season];

/* ── 장소 이름 (배경). 영어판에 없으면 한국어 그대로 ── */
const PLACE_TEXT = { en: {} };
function registerPlaceText(lang, map) { PLACE_TEXT[lang] = { ...(PLACE_TEXT[lang] || {}), ...map }; }
function placeName(bg, sc, lang = LANG) {
  const p = lang !== 'ko' && PLACE_TEXT[lang] && PLACE_TEXT[lang][bg];
  return { name: (p && p.name) || sc.name, area: (p && p.area) || sc.area };
}

/* ── 화면 문구 ── */
const UI_TEXT = { ko: {}, en: {} };
function registerUiText(lang, map) { UI_TEXT[lang] = { ...(UI_TEXT[lang] || {}), ...map }; }

/** 화면 문구 하나. {이름} 자리에 vars를 넣는다. 영어에 없으면 한국어, 그것도 없으면 키 */
function tx(key, vars = {}, lang = LANG) {
  const raw = (UI_TEXT[lang] && UI_TEXT[lang][key]) ?? UI_TEXT.ko[key] ?? key;
  return String(raw).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LANGS, overlayText, localizeSpecies, durText, seasonText, placeName, tx, registerTranslation, registerPlaceText, registerUiText, TRANSLATIONS, UI_TEXT, PLACE_TEXT };
}
