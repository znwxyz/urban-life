const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/core/engine.js');
const C = require('../js/core/color.js');
const { SCENES } = require('../js/data/scenes.js');
const { CAST } = require('../js/data/cast.js');
const fs = require('node:fs');
const path = require('node:path');

/** 동물별 장면 전용 그림(js/render/art/<동물>.js)의 키 목록. 키는 '동물:이름' 형식 */
function artKeys(key) {
  const file = path.join(__dirname, '..', 'js', 'render', 'art', `${key}.js`);
  return fs.existsSync(file) ? require(file) : [];
}
const castOk = (sp, a) => Boolean(CAST[a]) || (a.startsWith(`${sp.key}:`) && artKeys(sp.key).includes(a));

/* SPECIES=cat npm test 처럼 한 종만 검사할 수 있다 */
const KEYS = (process.env.SPECIES || 'cat,cockroach,pigeon,fly,sparrow,cicada,mosquito,mouse,dog').split(',');
const ALL = KEYS.map((k) => require(`../js/data/species/${k}.js`));
const CHOICES = 4, MAX_FATAL_P = .4, TENSION_FOOD = 30, TENSION_HP = 40, MIN_SAFE_CHOICES = 2;
const LUCK = [[0, 0], [0, .999], [.999, 0], [.999, .999]];
const seq = (vals) => { let i = 0; return () => vals[Math.min(i++, vals.length - 1)]; };
const isDead = (sp, id) => sp.endings[id] && sp.endings[id].kind === 'dead';
const SYSTEM_ENDINGS = (sp) => [sp.weakEnding, sp.starveEnding];

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

ALL.forEach((sp) => {
  test(`${sp.name}: 모든 목적지가 장면이나 엔딩이다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => sc.choices.forEach((c) => {
      E.choiceTargets(sc, c).forEach((t) => assert.ok(sp.scenes[t] || sp.endings[t], `${id} → ${t}`));
    }));
  });

  test(`${sp.name}: 장면마다 배경이 있고 선택지는 상하좌우 ${CHOICES}개다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => {
      assert.ok(SCENES[sc.bg], `${id}의 배경 ${sc.bg}`);
      assert.equal(sc.choices.length, CHOICES, `${id} 선택지 수`);
      assert.ok(sc.title && sc.text, `${id} 문구`);
    });
  });

  test(`${sp.name}: 고르자마자 죽는 선택지는 없고, 즉사 확률은 ${MAX_FATAL_P * 100}% 이하, 장면마다 안전한 선택지가 ${MIN_SAFE_CHOICES}개 이상`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => {
      sc.choices.forEach((c) => {
        const direct = typeof c.to === 'string' ? [c.to] : Array.isArray(c.to) ? c.to.map((r) => r.to) : Array.isArray(sc.next) ? sc.next.map((r) => r.to) : [sc.next];
        direct.forEach((t) => assert.ok(!isDead(sp, t), `${id} "${c.t}"이 곧장 ${t}로 간다`));
        if (c.risk) assert.ok(c.risk.p > 0 && c.risk.p <= MAX_FATAL_P, `${id} "${c.t}" 즉사 확률 ${c.risk.p}`);
      });
      assert.ok(sc.choices.filter((c) => !c.risk).length >= MIN_SAFE_CHOICES, `${id} 안전한 선택지 부족`);
    });
  });

  test(`${sp.name}: 엔딩마다 종류·사인·문장이 있고, 굶주림·쇠약 엔딩이 있다`, () => {
    Object.entries(sp.endings).forEach(([id, e]) => {
      assert.ok(E.ENDING_KIND[e.kind], `${id} 종류`);
      assert.ok(e.title && e.cause && e.line, `${id} 문구`);
    });
    assert.equal(Object.values(sp.endings).filter((e) => e.kind === 'happy').length, 1);
    SYSTEM_ENDINGS(sp).forEach((id) => assert.ok(isDead(sp, id), `시스템 엔딩 ${id}`));
  });

  test(`${sp.name}: 등장인물은 CAST나 장면 전용 그림에 있고, 이야기 속 데드엔딩에는 가해자(actor)가 있다`, () => {
    Object.entries(sp.scenes).forEach(([id, sc]) => (sc.cast || []).forEach((c) => assert.ok(castOk(sp, c.a), `${id} cast ${c.a}`)));
    Object.entries(sp.endings).forEach(([id, e]) => {
      if (e.actor) assert.ok(castOk(sp, e.actor.a), `${id} actor ${e.actor.a}`);
      if (e.kind === 'dead' && !SYSTEM_ENDINGS(sp).includes(id)) assert.ok(e.actor, `${id}에 actor 없음`);
    });
  });

  test(`${sp.name}: 모든 장면·엔딩에 닿을 수 있다`, () => {
    const { scenes, endings } = explore(sp);
    Object.keys(sp.scenes).forEach((id) => assert.ok(scenes.has(id), `닿지 않는 장면 ${id}`));
    Object.keys(sp.endings).forEach((id) => assert.ok(endings.has(id), `닿지 않는 엔딩 ${id}`));
  });

  test(`${sp.name}: 체력은 장면마다 저절로 줄어든다`, () => {
    assert.ok(sp.stats.hpDecay > 0, 'stats.hpDecay가 없다');
  });

  test(`${sp.name}: 운이 좋아도 메인 루트에서 체력은 ${TENSION_HP} 이하, 포만은 ${TENSION_FOOD} 이하로 떨어지는 순간이 있다`, () => {
    let run = E.newRun(sp), minHp = run.hp, minFood = run.food;
    sp.main.forEach((i) => {
      if (run.ending) return;
      run = E.applyChoice(sp, run, i, () => .999);
      if (!run.ending) { minHp = Math.min(minHp, run.hp); minFood = Math.min(minFood, run.food); }
    });
    assert.ok(minHp <= TENSION_HP, `체력이 늘 넉넉함 (최저 ${minHp})`);
    assert.ok(minFood <= TENSION_FOOD, `포만이 늘 넉넉함 (최저 ${minFood})`);
  });

  test(`${sp.name}: 메인 루트는 즉사 위험이 없고, 불운이 겹쳐도 해피엔딩까지 살아남는다`, () => {
    let run = E.newRun(sp), minFood = run.food;
    sp.main.forEach((i) => {
      assert.equal(run.ending, null, `메인 루트가 ${run.at}에서 먼저 끝남 (${run.ending})`);
      const c = sp.scenes[run.at].choices[i];
      assert.ok(!c.risk, `${run.at} 메인 선택지 "${c.t}"에 즉사 위험`);
      run = E.applyChoice(sp, run, i, () => 0);
      if (!run.ending) minFood = Math.min(minFood, run.food);
    });
    assert.equal(sp.endings[run.ending].kind, 'happy', `메인 루트 끝: ${run.ending}`);
  });
});

ALL.forEach((sp) => {
  test(`${sp.name}: 장면마다 그 장면에만 나오는 전용 그림이 하나 이상 있다`, () => {
    const used = Object.entries(sp.scenes).map(([id, sc]) => [id, (sc.cast || []).map((c) => c.a).filter((a) => a.startsWith(`${sp.key}:`))]);
    used.forEach(([id, keys]) => assert.ok(keys.length > 0, `${id}에 전용 그림이 없다`));
    const all = used.flatMap(([, keys]) => [...new Set(keys)]);
    const repeated = all.filter((k, i) => all.indexOf(k) !== i);
    assert.ok(repeated.length <= Math.floor(used.length / 3), `전용 그림 재사용이 너무 많다: ${[...new Set(repeated)]}`);
  });
});

test('배경 팔레트는 모두 올바른 색상값이다', () => {
  Object.entries(SCENES).forEach(([id, sc]) => {
    E.PALETTE_ROLES.forEach((role) => assert.doesNotThrow(() => C.hexToRgb(sc.pal[role]), `${id}.${role}`));
  });
});
