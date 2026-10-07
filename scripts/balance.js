/* 밸런스 측정: 메인 루트의 스탯 흐름과, 아무렇게나 고르는 플레이를 여러 번 돌린 결과를 요약한다.
   사용: node scripts/balance.js [판 수]   */
const E = require('../js/core/engine.js');

const KEYS = ['cat', 'cockroach', 'pigeon', 'fly', 'sparrow', 'cicada', 'mosquito', 'mouse'];
const RUNS = Number(process.argv[2]) || 5000;
const pct = (n, d) => `${Math.round((n / d) * 100)}%`;

function mainRoute(sp, luck) {
  let run = E.newRun(sp), minHp = run.hp, minFood = run.food;
  const trail = [];
  for (const i of sp.main) {
    if (run.ending) break;
    run = E.applyChoice(sp, run, i, () => luck);
    trail.push(`${run.hp}/${run.food}`);
    if (!run.ending) { minHp = Math.min(minHp, run.hp); minFood = Math.min(minFood, run.food); }
  }
  return { ending: run.ending, minHp, minFood, trail };
}

function randomPlay(sp) {
  let run = E.newRun(sp), steps = 0;
  while (!run.ending && steps < 60) { run = E.applyChoice(sp, run, Math.floor(Math.random() * 4)); steps += 1; }
  return { ending: run.ending, steps };
}

/** 메인 루트 정보와 무작위 플레이 통계 */
function measure(sp, runs = RUNS) {
  const tally = {}; let steps = 0;
  for (let i = 0; i < runs; i++) { const r = randomPlay(sp); tally[r.ending] = (tally[r.ending] || 0) + 1; steps += r.steps; }
  const kind = (k) => Object.entries(tally).filter(([id]) => sp.endings[id].kind === k).reduce((a, [, n]) => a + n, 0);
  return {
    lucky: mainRoute(sp, .999), unlucky: mainRoute(sp, 0),
    happy: kind('happy') / runs, dead: kind('dead') / runs,
    weak: (tally[sp.weakEnding] || 0) / runs, starve: (tally[sp.starveEnding] || 0) / runs,
    avgScenes: steps / runs,
  };
}

if (require.main === module) {
  KEYS.forEach((k) => {
    const sp = require(`../js/data/species/${k}.js`), m = measure(sp);
    console.log(`\n■ ${sp.name}  시작 체력 ${sp.stats.hp} / 포만 ${sp.stats.food}, 장면마다 체력 -${sp.stats.hpDecay || 0} 포만 -${sp.stats.decay}`);
    console.log(`  메인 루트(운 좋음): 최저 체력 ${m.lucky.minHp}, 최저 포만 ${m.lucky.minFood}  → ${m.lucky.ending}   [${m.lucky.trail.join(' ')}]`);
    console.log(`  메인 루트(운 나쁨): 최저 체력 ${m.unlucky.minHp}, 최저 포만 ${m.unlucky.minFood}  → ${m.unlucky.ending}`);
    console.log(`  아무렇게나 ${RUNS}판: 해피 ${pct(m.happy, 1)}, 죽음 ${pct(m.dead, 1)} (쇠약 ${pct(m.weak, 1)}, 굶주림 ${pct(m.starve, 1)}), 평균 ${m.avgScenes.toFixed(1)}장면`);
  });
}

module.exports = { measure, mainRoute };
