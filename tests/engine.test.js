const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../js/core/engine.js');

/* 테스트용 작은 동물. rand가 0이면 위험이 터지고, 1에 가까우면 피한다 */
const HIT = () => 0, MISS = () => .999;
const SP = {
  key: 'test', bornMonth: 11, stats: { hp: 100, food: 50, decay: 10 },
  start: 'A', weakEnding: 'W0', starveEnding: 'W1',
  scenes: {
    A: { bg: 'x', day: 10, next: 'B', title: 'A', text: '', choices: [
      { t: '먹는다', fx: { food: 30 }, msg: '배부르다' },
      { t: '뛰어든다', fx: { food: 10 }, msg: '건넜다', risk: { p: .3, ending: 'D1', msg: '차가 왔다' } },
      { t: '알을 버린다', set: 'lost', msg: '가볍다', hurt: { p: .5, fx: { hp: -100 }, msg: '다쳤다' } },
    ] },
    B: { bg: 'x', after: 20, title: 'B', text: '', choices: [
      { t: '쉰다', to: [{ flag: 'lost', to: 'N1' }, { to: 'H1' }] },
      { t: '돌아간다', to: 'A' },
    ] },
  },
  endings: {
    H1: { kind: 'happy', day: 100, title: 'h', cause: 'c', line: 'l' },
    N1: { kind: 'normal', day: 100, title: 'n', cause: 'c', line: 'l' },
    D1: { kind: 'dead', after: 1, title: 'd', cause: 'c', line: 'l' },
    W0: { kind: 'dead', after: 0, title: 'w', cause: 'c', line: 'l' },
    W1: { kind: 'dead', after: 0, title: 'starve', cause: 'c', line: 'l' },
  },
};

function deepFreeze(o) { Object.values(o).forEach((v) => v && typeof v === 'object' && deepFreeze(v)); return Object.freeze(o); }

test('durLabel은 2주 미만은 일, 두 달 미만은 주, 그 이상은 개월·년으로 쓴다', () => {
  assert.equal(E.durLabel(3), '3일');
  assert.equal(E.durLabel(42), '6주');
  assert.equal(E.durLabel(120), '4개월');
  assert.equal(E.durLabel(365), '1년');
  assert.equal(E.durLabel(430), '1년 2개월');
});

test('monthOf는 태어난 달에서 시작해 12월 다음에 1월로 넘어간다', () => {
  assert.equal(E.monthOf({ bornMonth: 11 }, 0), 11);
  assert.equal(E.monthOf({ bornMonth: 11 }, 61), 1);
});

test('seasonOf는 달을 계절로 바꾼다', () => {
  assert.deepEqual([1, 4, 7, 10, 12].map(E.seasonOf), ['winter', 'spring', 'summer', 'autumn', 'winter']);
});

test('newRun은 시작 장면과 시작 스탯으로 시작한다', () => {
  const run = E.newRun(SP);
  assert.equal(run.at, 'A');
  assert.equal(run.day, 10);
  assert.deepEqual([run.hp, run.food], [100, 50]);
});

test('to가 없는 선택지는 장면의 next로 이어진다', () => {
  const run = E.applyChoice(SP, E.newRun(SP), 0, MISS);
  assert.equal(run.at, 'B');
  assert.equal(run.food, 70);   // 50 + 30 - 10
  assert.equal(run.day, 30);    // 10 + after 20
  assert.equal(run.outcome.msg, '배부르다');
});

test('위험을 피하면 다음 장면으로 계속 간다', () => {
  const run = E.applyChoice(SP, E.newRun(SP), 1, MISS);
  assert.equal(run.at, 'B');
  assert.equal(run.ending, null);
  assert.equal(run.outcome.fatal, false);
});

test('위험이 터지면 그 위험의 데드엔딩으로 끝난다', () => {
  const run = E.applyChoice(SP, E.newRun(SP), 1, HIT);
  assert.equal(run.ending, 'D1');
  assert.equal(run.outcome.fatal, true);
  assert.equal(run.outcome.msg, '차가 왔다');
});

test('다치면 체력이 깎이고, 0이 되면 쇠약 엔딩으로 끝난다', () => {
  const run = E.applyChoice(SP, E.newRun(SP), 2, HIT);
  assert.equal(run.hp, 0);
  assert.equal(run.ending, 'W0');
  assert.equal(run.outcome.hurtMsg, '다쳤다');
});

test('applyChoice는 입력 상태를 바꾸지 않는다', () => {
  const before = deepFreeze(E.newRun(SP));
  const after = E.applyChoice(SP, before, 0, MISS);
  assert.notEqual(after, before);
  assert.equal(before.at, 'A');
});

test('포만이 0이 되면 스토리와 상관없이 굶주림 엔딩으로 끝난다', () => {
  const hungry = { ...E.newRun(SP), food: 5, hp: 50 };
  const run = E.applyChoice(SP, hungry, 2, MISS);
  assert.equal(run.food, 0);
  assert.equal(run.ending, 'W1');
  assert.equal(run.outcome.starving, true);
});

test('체력이 0이 되면 포만이 남아 있어도 쇠약 엔딩이 먼저다', () => {
  const run = E.applyChoice(SP, { ...E.newRun(SP), food: 5 }, 2, HIT);
  assert.equal(run.ending, 'W0');
});

test('플래그에 따라 같은 선택이 다른 엔딩으로 간다', () => {
  const clean = E.applyChoice(SP, E.applyChoice(SP, E.newRun(SP), 0, MISS), 0, MISS);
  const lost = E.applyChoice(SP, E.applyChoice(SP, E.newRun(SP), 2, MISS), 0, MISS);
  assert.equal(clean.ending, 'H1');
  assert.equal(lost.ending, 'N1');
});

test('시간은 거꾸로 가지 않는다', () => {
  const atB = E.applyChoice(SP, E.newRun(SP), 0, MISS);
  const back = E.applyChoice(SP, atB, 1, MISS);
  assert.equal(back.at, 'A');
  assert.equal(back.day, atB.day);
});

test('없는 선택지나 끝난 판에서는 에러를 낸다', () => {
  assert.throws(() => E.applyChoice(SP, E.newRun(SP), 9, MISS), /없는 선택지/);
  const ended = E.applyChoice(SP, E.newRun(SP), 1, HIT);
  assert.throws(() => E.applyChoice(SP, ended, 0, MISS), /이미 끝난/);
});

test('choiceTargets는 선택지가 갈 수 있는 모든 곳을 돌려준다', () => {
  assert.deepEqual(E.choiceTargets(SP.scenes.A, SP.scenes.A.choices[1]).sort(), ['B', 'D1']);
  assert.deepEqual(E.choiceTargets(SP.scenes.B, SP.scenes.B.choices[0]).sort(), ['H1', 'N1']);
});

test('happyDay는 해피엔딩의 날짜를 돌려준다', () => {
  assert.equal(E.happyDay(SP), 100);
});

test('isValidRun은 저장된 진행 상태를 검사한다', () => {
  assert.equal(E.isValidRun(SP, E.newRun(SP)), true);
  assert.equal(E.isValidRun(SP, { ...E.newRun(SP), at: 'ZZ' }), false);
  assert.equal(E.isValidRun(SP, { ...E.newRun(SP), hp: 'a' }), false);
  assert.equal(E.isValidRun(SP, null), false);
});
