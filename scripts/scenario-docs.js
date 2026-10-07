/* 시나리오 데이터(js/data/species/*.js)에서 설계 문서(docs/scenarios/<key>.md)를 만든다.
   사용: node scripts/scenario-docs.js   — 문서는 손으로 고치지 말고 데이터를 고친 뒤 다시 만든다 */
const fs = require('node:fs');
const path = require('node:path');
const { ENDING_KIND, durLabel } = require('../js/core/engine.js');
const { SCENES } = require('../js/data/scenes.js');

const ROOT = path.join(__dirname, '..');
const KEYS = ['cat', 'cockroach', 'pigeon', 'fly'];
const pct = (p) => `${Math.round(p * 100)}%`;
const ARROWS = ['◀', '▶', '▲', '▼'];
const esc = (s) => String(s).replace(/"/g, "'");

function routes(scene, c) {
  const to = c.to ?? scene.next;
  if (typeof to === 'string') return [{ to }];
  return to.map((r) => ({ to: r.to, flag: r.flag }));
}

function mermaid(sp) {
  const lines = ['flowchart TD'];
  Object.entries(sp.scenes).forEach(([id, sc]) => {
    lines.push(`  ${id}["${id} ${esc(sc.title)}"]`);
    sc.choices.forEach((c, i) => {
      const side = ARROWS[i];
      routes(sc, c).forEach((r) => lines.push(`  ${id} -->|"${side} ${esc(c.t)}${r.flag ? ` · ${r.flag}` : ''}"| ${r.to}`));
      if (c.risk) lines.push(`  ${id} -.->|"${side} 운 나쁘면 ${pct(c.risk.p)}"| ${c.risk.ending}`);
    });
  });
  Object.entries(sp.endings).forEach(([id, e]) => lines.push(`  ${id}(["${ENDING_KIND[e.kind].mark} ${esc(e.title)}"])`));
  return lines.join('\n');
}

function choiceCell(c) {
  const fx = Object.entries(c.fx || {}).map(([k, v]) => `${{ hp: '체력', food: '포만', kids: '자손' }[k]} ${v > 0 ? '+' : ''}${v}`).join(', ');
  const hurt = c.hurt && `다침 ${pct(c.hurt.p)} 체력 ${c.hurt.fx.hp}`;
  const extra = [fx, c.risk && `즉사 ${pct(c.risk.p)}`, hurt, c.set && `플래그 ${c.set}`].filter(Boolean).join(' · ');
  return `${c.t}${extra ? ` (${extra})` : ''}`;
}

/** 메인 루트를 실제로 따라가며 장면별로 고른 선택지 번호를 모은다 */
function mainPath(sp) {
  const picks = {};
  let at = sp.start;
  sp.main.forEach((i) => {
    if (!sp.scenes[at]) return;
    picks[at] = i;
    const to = sp.scenes[at].choices[i].to ?? sp.scenes[at].next;
    at = typeof to === 'string' ? to : to[to.length - 1].to;
  });
  return picks;
}

function doc(sp) {
  const mainPicks = mainPath(sp);
  const happy = Object.values(sp.endings).find((e) => e.kind === 'happy');
  const sceneRows = Object.entries(sp.scenes).map(([id, sc]) => {
    const when = typeof sc.day === 'number' ? `생후 ${durLabel(sc.day)}` : `+${durLabel(sc.after)}`;
    const main = mainPicks[id];
    const cells = sc.choices.map((c, i) => `${choiceCell(c)}${main === i ? ' ★' : ''}`).join(' | ');
    const cast = (sc.cast || []).map((c) => c.a).join(', ');
    return `| ${id} ${sc.title} | ${SCENES[sc.bg].name}${cast ? `<br>(${cast})` : ''} | ${when} | ${cells} |`;
  });
  const endRows = Object.entries(sp.endings).map(([id, e]) =>
    `| ${id} ${e.title} | ${ENDING_KIND[e.kind].label} | ${e.cause}${e.actor ? ` (${e.actor.a})` : ''} | ${e.line} |`);
  return [
    `# ${sp.name} (${sp.latin})`,
    '',
    '> 이 문서는 `node scripts/scenario-docs.js`로 만든다. 고칠 때는 `js/data/species/' + sp.key + '.js`를 고친다.',
    '',
    `- 몸길이 ${sp.size} · 눈높이 ${sp.eye}cm · 시작 스탯 체력 ${sp.stats.hp} / 포만 ${sp.stats.food} (장면마다 체력 -${sp.stats.hpDecay} · 포만 -${sp.stats.decay})`,
    '- 체력이나 포만 중 하나라도 0이 되면 스토리와 상관없이 죽는다 (쇠약 / 굶주림)',
    `- 해피엔딩: **${happy.title}** (생후 ${durLabel(happy.day)})`,
    `- ${sp.intro}`,
    '',
    '## 흐름도',
    '실선은 진행, 점선은 운이 나쁠 때(즉사 확률).',
    '',
    '```mermaid', mermaid(sp), '```',
    '',
    '## 장면 (카드를 미는 방향 ◀ ▶ ▲ ▼, ★ 메인 루트)',
    '',
    '| 장면 | 배경(등장) | 시기 | ◀ | ▶ | ▲ | ▼ |',
    '|---|---|---|---|---|---|---|',
    ...sceneRows,
    '',
    '## 엔딩',
    '',
    '| 엔딩 | 종류 | 사인(가해자) | 마지막 문장 |',
    '|---|---|---|---|',
    ...endRows,
    '',
  ].join('\n');
}

KEYS.forEach((k) => {
  const sp = require(`../js/data/species/${k}.js`);
  const out = path.join(ROOT, 'docs', 'scenarios', `${k}.md`);
  fs.writeFileSync(out, doc(sp));
  process.stdout.write(`${out}\n`);
});
