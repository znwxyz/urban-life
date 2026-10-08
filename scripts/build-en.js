/* 영문판 페이지 en/index.html을 index.html에서 만든다. 트위터 등에 공유할 영어 제목·설명·미리보기를 담고,
   <base href="../">로 같은 js·css·그림을 쓰며, window.URBAN_LANG='en'으로 영어로 시작한다.
   bump-version.sh가 매번 같이 실행한다. 사용: node scripts/build-en.js */
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const SITE = 'https://znwxyz.github.io/urban-life/';
const EN = Object.freeze({
  title: 'Down on the City Floor',
  desc: 'A stray cat, a pigeon, a wasp, a cockroach... Be born on the city floor and try to live to the end.',
  alt: 'An orange cat sleeps on a rooftop ledge, a small sparrow sitting beside it',
});

let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const set = (re, value) => {
  if (!re.test(html)) throw new Error(`build-en: 못 찾음 ${re}`);
  html = html.replace(re, value);
};
set(/<html lang="ko">/, '<html lang="en">');
set(/<meta charset="utf-8">/, '<meta charset="utf-8">\n<base href="../">\n<script>window.URBAN_LANG = \'en\';</script>');
set(/<title>[^<]*<\/title>/, `<title>${EN.title}</title>`);
set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${EN.desc}">`);
set(/<meta property="og:site_name" content="[^"]*">/, `<meta property="og:site_name" content="${EN.title}">`);
set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${EN.title}">`);
set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${EN.desc}">`);
set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${SITE}en/">`);
set(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${EN.alt}">`);
set(/<meta property="og:locale" content="[^"]*">/, '<meta property="og:locale" content="en_US">');
set(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${EN.title}">`);
set(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${EN.desc}">`);
set(/<!doctype html>/i, '<!doctype html>\n<!-- 자동 생성: scripts/build-en.js가 index.html에서 만든다. 직접 고치지 말 것 -->');

fs.mkdirSync(path.join(root, 'en'), { recursive: true });
fs.writeFileSync(path.join(root, 'en', 'index.html'), html);
console.log('wrote en/index.html');
