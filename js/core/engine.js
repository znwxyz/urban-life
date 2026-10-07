/* 게임 규칙: 분기형 장면 진행, 스탯, 시간·계절. 순수 함수만 둔다 (Node 테스트 가능) */
const RULES = Object.freeze({ MAX: 100 });
/** 선택지 순서 = 카드를 미는 방향 */
const DIRECTIONS = Object.freeze(['left', 'right', 'up', 'down']);
const DAYS_PER_MONTH = 30.4;
const DAYS_PER_WEEK = 7;
const SEASON_KO = Object.freeze({ spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' });
const ENDING_KIND = Object.freeze({
  happy: { mark: '★', label: '해피' },
  normal: { mark: '◐', label: '노멀' },
  dead: { mark: '✕', label: '데드' },
});
const PALETTE_ROLES = Object.freeze(['skyTop', 'skyBottom', 'sun', 'far1', 'far2', 'wall', 'wallAlt', 'wallShade',
  'ceiling', 'ground', 'groundTop', 'ink', 'light', 'glass', 'accent']);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** 나이 표기: 2주 미만은 일, 두 달 미만은 주, 그 이상은 개월·년 */
function durLabel(d) {
  if (d < 14) return `${d}일`;
  if (d < 60) return `${Math.round(d / DAYS_PER_WEEK)}주`;
  const m = Math.round(d / DAYS_PER_MONTH), y = Math.floor(m / 12), mm = m % 12;
  if (!y) return `${m}개월`;
  return mm ? `${y}년 ${mm}개월` : `${y}년`;
}

const monthOf = (sp, d) => ((sp.bornMonth - 1 + Math.floor(d / DAYS_PER_MONTH)) % 12) + 1;

function seasonOf(m) {
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

/** 장면·엔딩의 날짜: day(절대 나이)가 있으면 그 날, 없으면 현재 + after. 시간은 거꾸로 가지 않는다 */
function dayAt(node, curDay) {
  if (typeof node.day === 'number') return Math.max(node.day, curDay);
  return curDay + (node.after || 0);
}

/** 선택지가 이어지는 곳: to(문자열 또는 플래그 조건 목록), 없으면 장면의 next */
function resolveTarget(scene, choice, flags) {
  const to = choice.to ?? scene.next;
  if (typeof to === 'string') return to;
  if (!Array.isArray(to)) throw new Error(`갈 곳이 없는 선택지: ${choice.t}`);
  const hit = to.find((r) => !r.flag || flags.includes(r.flag));
  if (!hit) throw new Error(`갈 곳이 없는 선택지: ${choice.t}`);
  return hit.to;
}

/** 선택지가 닿을 수 있는 모든 곳 (위험·다침으로 끝나는 엔딩 포함) */
function choiceTargets(scene, choice) {
  const to = choice.to ?? scene.next;
  const routes = typeof to === 'string' ? [to] : (to || []).map((r) => r.to);
  return [...routes, choice.risk && choice.risk.ending, choice.hurt && choice.hurt.ending].filter(Boolean);
}

function newRun(sp) {
  const start = sp.scenes[sp.start];
  if (!start) throw new Error(`시작 장면이 없다: ${sp.key}`);
  return { spKey: sp.key, at: sp.start, day: dayAt(start, 0), hp: sp.stats.hp, food: sp.stats.food,
    kids: 0, flags: [], path: [], ending: null, outcome: null };
}

const addFx = (a, b) => ({ hp: (a.hp || 0) + (b.hp || 0), food: (a.food || 0) + (b.food || 0), kids: (a.kids || 0) + (b.kids || 0) });

/**
 * 선택 하나를 적용한 새 진행 상태를 돌려준다.
 * - risk: 확률로 즉사 (그 위험의 데드엔딩)
 * - hurt: 확률로 다침
 * - 체력이 0이 되면 쇠약(weakEnding, 다쳐서면 hurt.ending), 포만이 0이 되면 굶주림(starveEnding). 스토리와 상관없이 끝난다
 * rand는 테스트에서 운을 고정하려고 주입한다.
 */
function applyChoice(sp, run, idx, rand = Math.random) {
  if (run.ending) throw new Error('이미 끝난 판이다');
  const scene = sp.scenes[run.at];
  if (!scene) throw new Error(`없는 장면: ${run.at}`);
  const choice = scene.choices[idx];
  if (!choice) throw new Error(`없는 선택지: ${run.at}#${idx}`);

  const fatal = Boolean(choice.risk) && rand() < choice.risk.p;
  const hurt = !fatal && Boolean(choice.hurt) && rand() < choice.hurt.p;
  const fx = addFx(choice.fx || {}, hurt ? choice.hurt.fx || {} : {});
  const flags = choice.set && !run.flags.includes(choice.set) ? [...run.flags, choice.set] : run.flags;
  const food = clamp(run.food + fx.food - sp.stats.decay, 0, RULES.MAX);
  const starving = food === 0;
  // 체력은 가만히 있어도 장면마다 조금씩 줄고, 저절로 회복되지 않는다 (쉬는 선택만 회복)
  const hp = clamp(run.hp + fx.hp - (sp.stats.hpDecay || 0), 0, RULES.MAX);

  let target = resolveTarget(scene, choice, flags);
  if (fatal) target = choice.risk.ending;
  else if (hp <= 0) target = (hurt && choice.hurt.ending) || sp.weakEnding;
  else if (starving) target = sp.starveEnding;
  const ending = sp.endings[target];
  const next = ending ? null : sp.scenes[target];
  if (!ending && !next) throw new Error(`없는 목적지: ${target}`);

  return {
    ...run, at: target, hp, food, flags,
    day: dayAt(ending || next, run.day),
    kids: run.kids + fx.kids,
    ending: ending ? target : null,
    path: [...run.path, { at: run.at, choice: choice.t, to: target }],
    outcome: {
      msg: fatal ? choice.risk.msg || '' : choice.msg || '',
      hurtMsg: hurt ? choice.hurt.msg || '' : '',
      fatal, hurt, starving,
      dHp: hp - run.hp, dFood: food - run.food, kids: fx.kids,
    },
  };
}

function happyDay(sp) {
  const happy = Object.values(sp.endings).find((e) => e.kind === 'happy');
  return happy ? happy.day : 1;
}

/** 저장된 진행 상태(외부 데이터)를 믿기 전에 검사한다 */
function isValidRun(sp, run) {
  if (!sp || !run || typeof run !== 'object') return false;
  const nums = ['day', 'hp', 'food', 'kids'].every((k) => Number.isFinite(run[k]));
  const place = run.ending ? Boolean(sp.endings[run.ending]) : Boolean(sp.scenes[run.at]);
  return nums && place && Array.isArray(run.flags) && Array.isArray(run.path);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RULES, DIRECTIONS, SEASON_KO, ENDING_KIND, PALETTE_ROLES, clamp, durLabel, monthOf, seasonOf,
    newRun, applyChoice, choiceTargets, happyDay, isValidRun };
}
