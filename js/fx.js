/* 스탯 연출: 오를 때는 결과 카드의 도장에서 별똥별이 날아가 칸을 채우고, 깎일 때는 붉게 깜빡이며 줄어든다 */
const fxLayer = document.getElementById('fxLayer');
const STAR_GLYPHS = ['✦', '+', '✧', '+'];
const STAR_MS = 700, STAR_STAGGER = 60, TRAIL = [[40, .55, .7], [80, .28, .5]], PATH_STEPS = 14;
const STAT_PER_STAR = 6, MIN_STARS = 3, MAX_STARS = 9;

const centerOf = (el) => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; };

/** 시작점에서 끝점까지 위로 휘는 곡선을 따라가는 키프레임 */
function arcFrames(a, b, bend, scaleK) {
  return Array.from({ length: PATH_STEPS + 1 }, (_, i) => {
    const u = i / PATH_STEPS;
    const x = (1 - u) ** 2 * a.x + 2 * (1 - u) * u * bend.x + u * u * b.x;
    const y = (1 - u) ** 2 * a.y + 2 * (1 - u) * u * bend.y + u * u * b.y;
    const s = (u < .2 ? .4 + u * 4 : 1.2 - u * .6) * scaleK;
    return { transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${s}) rotate(${u * 300}deg)`, opacity: u < .08 ? u / .08 : 1 };
  });
}

/** from 요소에서 to 요소로 별똥별 n개를 날린다. 마지막 별이 닿으면 onDone */
function flyStars(from, to, n, cls, onDone) {
  const a0 = centerOf(from), b = centerOf(to);
  let landed = 0;
  for (let i = 0; i < n; i++) {
    const a = { x: a0.x + (Math.random() - .5) * 40, y: a0.y + (Math.random() - .5) * 14 };
    const bend = { x: (a.x + b.x) / 2 + (Math.random() - .5) * 200, y: Math.min(a.y, b.y) - 60 - Math.random() * 90 };
    const glyph = STAR_GLYPHS[i % STAR_GLYPHS.length], delay = i * STAR_STAGGER, dur = STAR_MS + Math.random() * 180;
    [[0, 1, 1], ...TRAIL].forEach(([lag, alpha, size], j) => {
      const el = h('span', { class: `spark ${cls}`, 'aria-hidden': 'true' }, glyph);
      el.style.opacity = '0';
      fxLayer.append(el);
      const anim = el.animate(arcFrames(a, b, bend, size).map((f) => ({ ...f, opacity: f.opacity * alpha })),
        { duration: dur, delay: delay + lag, easing: 'cubic-bezier(.45,0,.75,1)', fill: 'both' });
      anim.onfinish = () => {
        el.remove();
        if (j !== 0) return;
        landed += 1;
        to.classList.remove('ping'); void to.offsetWidth; to.classList.add('ping');
        if (landed === n && onDone) onDone();
      };
    });
  }
}

/** 결과 카드가 놓인 뒤 체력·포만 변화를 보여 준다. prev → next */
function animateStats(prev, next) {
  [['hp', 'hpRow'], ['food', 'foodRow']].forEach(([stat, rowId]) => {
    const d = next[stat] - prev[stat], row = $(rowId);
    if (!d) return;
    if (d < 0 || reducedMotionUi) { setStat(stat, prev[stat], next[stat]); return; }
    const source = document.querySelector(`.stamp[data-stat="${stat}"]`) || cardWrap;
    const n = Math.max(MIN_STARS, Math.min(MAX_STARS, Math.round(d / STAT_PER_STAR)));
    flyStars(source, row, n, stat, () => setStat(stat, prev[stat], next[stat]));
  });
}
