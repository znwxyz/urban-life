/* 동물별 해피엔딩 공략(메인 루트)을 게임 데이터에서 뽑아 docs/happy-routes.md로 쓴다.
   다른 사람이나 AI가 이 순서대로 끝까지 플레이하며 게임 전체를 점검할 수 있게 한다.
   사용: node scripts/happy-routes.js */
const fs = require('node:fs');
const path = require('node:path');
const E = require('../js/core/engine.js');
const { SCENES } = require('../js/data/scenes.js');

const KEYS = ['cat', 'cockroach', 'pigeon', 'fly', 'mosquito', 'sparrow', 'cicada', 'dog', 'mouse', 'magpie', 'crow', 'butterfly', 'wasp'];
const DIR_LABEL = Object.freeze({ left: '◀ 왼쪽 (← 키)', right: '▶ 오른쪽 (→ 키)', up: '▲ 위 (↑ 키)', down: '▼ 아래 (↓ 키)' });
const LUCKY = () => .999;
const OUT = path.join(__dirname, '..', 'docs', 'happy-routes.md');

const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

/** 메인 루트를 따라가며 장면마다 고를 방향과 그 결과를 모은다 */
function walk(sp) {
  let run = E.newRun(sp);
  const steps = [];
  for (const i of sp.main) {
    if (run.ending) break;
    const node = sp.scenes[run.at], choice = node.choices[i], place = SCENES[node.bg];
    const next = E.applyChoice(sp, run, i, LUCKY);
    steps.push({ id: run.at, title: node.title, place: place ? place.name : node.bg, night: node.night,
      dir: E.DIRECTIONS[i], choice: choice.t, msg: next.outcome ? next.outcome.msg : '', hp: next.hp, food: next.food });
    run = next;
  }
  return { steps, ending: sp.endings[run.ending], endingId: run.ending };
}

function section(sp) {
  const { steps, ending, endingId } = walk(sp);
  if (!ending || ending.kind !== 'happy') throw new Error(`${sp.name} 메인 루트가 해피엔딩이 아님: ${endingId}`);
  const rows = steps.map((s, n) => `| ${n + 1} | ${cell(s.title)} | ${cell(s.place)}${s.night ? ' · 밤' : ''} | **${DIR_LABEL[s.dir]}** | ${cell(s.choice)} | ${cell(s.msg)} | ${s.hp} / ${s.food} |`);
  return [
    `## ${sp.name} (${sp.size})`,
    '',
    `- 시작: ${sp.place} · 시작 체력 ${sp.stats.hp} / 포만 ${sp.stats.food}`,
    `- 해피엔딩: **${ending.title}** — "${ending.line}"`,
    '',
    '| # | 장면 제목 | 장소 | 고를 방향 | 선택지 문구 | 고른 뒤 나오는 문장 | 체력 / 포만 (운이 좋을 때) |',
    '|---|---|---|---|---|---|---|',
    ...rows,
    '',
  ].join('\n');
}

function intro() {
  return `# 해피엔딩 루트 (전체 점검용)

> \`node scripts/happy-routes.js\`가 게임 데이터(\`js/data/species/*.js\`)에서 자동으로 만든 문서. 시나리오를 고치면 다시 실행한다.

## 이 문서로 점검하는 법

1. 사이트를 연다: https://znwxyz.github.io/urban-life/ (PC는 1280×800 이상, 휴대폰은 세로 화면)
2. 홈 화면 **오른쪽 아래 "캐릭터 직접 고르기"** 를 누르고 동물 이름을 고른다. (가운데 "태어나기"는 동물이 무작위로 정해진다)
3. "○○로 태어났다" 카드에서 **살아 보기 ▶** (카드를 오른쪽으로 밀거나 → 키)
4. 장면마다 동물이 걸어간 뒤 선택 카드가 뜬다. 아래 표의 **고를 방향**대로 카드를 밀거나 화살표 키를 누른다.
   - 고를 방향은 선택지 문구로도 확인할 수 있다. 문구가 다르면 장면이 어긋난 것이다.
5. 결과 카드에서 **계속 ▶** (→ 키). 다음 장면으로 이어진다.
6. 마지막에 해피엔딩 카드가 뜨면 성공. 엔딩 카드 위 "○○에게 한 마디" 방명록은 실제로 글이 남으니 점검 중에는 쓰지 않는다.

- 이 루트에는 즉사 위험이 없다. 다만 확률로 다치는 선택이 있어서, 표의 체력·포만(운이 좋을 때)보다 낮게 나올 수 있다. 운이 나빠도 해피엔딩까지 살아남도록 테스트로 확인되어 있다.
- 진행 상황은 새로고침해도 이어진다. 처음부터 하려면 엔딩 뒤 "다른 동물 고르기"를 누른다.

## 점검할 것 (전체)

- **이야기**: 1인칭 반말 속마음이 자연스러운지, 장면끼리 이야기가 이어지는지, 맞춤법·어색한 문장
- **그림**: 장면 설명과 그림이 맞는지, 어색하거나 징그러운 그림, 잘리거나 카드에 가려지는 그림, 동물이 잘 보이는지
- **움직임**: 걸어갈 때 조연·소품이 뒤로 미끄러져 보이지 않는지, 장면이 찢어진 종이처럼 이어 붙는지, 불빛·연기·비·눈이 다음 장면에서 먼저 나오지 않는지
- **스탯**: 체력·포만이 아슬아슬하게 느껴지는지, 늘거나 깎일 때 연출(별똥별, 붉게 깜빡임)
- **화면**: 휴대폰 세로·PC 가로에서 카드·글자가 넘치거나 겹치지 않는지, 홈 화면 종이 조각의 미세한 떨림
- **버그**: 멈춤, 콘솔 오류, 같은 장면 반복, 엔딩이 안 뜸

`;
}

const doc = intro() + KEYS.map((k) => section(require(`../js/data/species/${k}.js`))).join('\n');
fs.writeFileSync(OUT, doc);
console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
