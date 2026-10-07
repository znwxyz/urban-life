const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/core/engine.js');
const C = require('../js/core/color.js');
const { SCENES } = require('../js/data/scenes.js');

const KEYS = ['cat', 'cockroach', 'pigeon', 'fly'];
const ALL = KEYS.map((k) => require(`../js/data/species/${k}.js`));
const MAX_FATAL_P = .4;
/* 위험(risk)과 다침(hurt)이 터지거나 안 터지는 모든 조합 */
const LUCK = [[0, 0], [0, .999], [.999, 0], [.999, .999]];
const seq = (vals) => { let i = 0; return () => vals[Math.min(i++, vals.length - 1)]; };

/** 운까지 포함한 모든 경로를 따라가며 들른 장면과 엔딩을 모은다 (같은 상태는 한 번만) */
function explore(sp) {
  const scenes = new Set(), endings = new Set(), seen = new Set();
  const stack = [E.newRun(sp)];
  while (stack.length) {
    const run = stack.pop();
    if (run.ending) { endings.add(run.ending); continue; }
    const key = `${run.at}|${run.hp}|${run.food}|${run.flags.join()}`;
    if (seen.has(key)) continue;
    seen.add(key); scenes.add(run.at);
    sp.scenes[run.at].choices.forEach((_, i) => LUCK.forEach((l) => stack.push(E.applyChoice(sp, run, i, seq(l)))));
  }
  return { scenes, endings };
}

const isDead = (sp, id) => sp.endings[id] && sp.endings[id].kind === 'dead';

ALL.forEach((sp) => {
  test(`${sp.name}: 모든 목적지가 장면이나 엔딩이다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => sc.choices.forEach((c) => {
      E.choiceTargets(sc, c).forEach((t) => assert.ok(sp.scenes[t] || sp.endings[t], `${id} → ${t}`));
    }));
  });

  test(`${sp.name}: 장면마다 배경이 있고 선택지는 왼쪽·오른쪽 2개다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => {
      assert.ok(SCENES[sc.bg], `${id}의 배경 ${sc.bg}`);
      assert.equal(sc.choices.length, 2, `${id} 선택지 수`);
      assert.ok(sc.title && sc.text, `${id} 문구`);
    });
  });

  test(`${sp.name}: 고르자마자 죽는 선택지는 없고, 즉사 확률은 ${MAX_FATAL_P * 100}% 이하다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => sc.choices.forEach((c) => {
      const direct = typeof c.to === 'string' ? [c.to] : Array.isArray(c.to) ? c.to.map((r) => r.to) : [sc.next];
      direct.forEach((t) => assert.ok(!isDead(sp, t), `${id} "${c.t}"이 곧장 ${t}로 간다`));
      if (c.risk) assert.ok(c.risk.p > 0 && c.risk.p <= MAX_FATAL_P, `${id} "${c.t}" 즉사 확률 ${c.risk.p}`);
    }));
  });

  test(`${sp.name}: 엔딩마다 종류·사인·마지막 문장이 있다`, () => {
    Object.entries(sp.endings).forEach(([id, e]) => {
      assert.ok(E.ENDING_KIND[e.kind], `${id} 종류`);
      assert.ok(e.title && e.cause && e.line, `${id} 문구`);
    });
    assert.equal(Object.values(sp.endings).filter((e) => e.kind === 'happy').length, 1);
  });

  test(`${sp.name}: 모든 장면·엔딩에 닿을 수 있다`, () => {
    const { scenes, endings } = explore(sp);
    Object.keys(sp.scenes).forEach((id) => assert.ok(scenes.has(id), `닿지 않는 장면 ${id}`));
    Object.keys(sp.endings).filter((id) => id !== sp.weakEnding)
      .forEach((id) => assert.ok(endings.has(id), `닿지 않는 엔딩 ${id}`));
  });

  test(`${sp.name}: 메인 루트는 즉사 위험이 없고, 불운이 겹쳐도 해피엔딩까지 산다`, () => {
    let run = E.newRun(sp);
    sp.main.forEach((i) => {
      assert.equal(run.ending, null, `메인 루트가 ${run.at}에서 먼저 끝남`);
      const c = sp.scenes[run.at].choices[i];
      assert.ok(!c.risk, `${run.at} 메인 선택지 "${c.t}"에 즉사 위험`);
      run = E.applyChoice(sp, run, i, () => 0);
      assert.ok(run.food > 0, `${run.at} 직전 굶주림`);
    });
    assert.equal(sp.endings[run.ending].kind, 'happy');
  });
});

test('배경 팔레트는 모두 올바른 색상값이다', () => {
  Object.entries(SCENES).forEach(([id, sc]) => {
    E.PALETTE_ROLES.forEach((role) => assert.doesNotThrow(() => C.hexToRgb(sc.pal[role]), `${id}.${role}`));
  });
});
