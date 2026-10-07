/* 등장 동물. 원점은 발밑 가운데, 오른쪽을 본다. cm 좌표 */
function scaled(k, draw) { ctx.save(); ctx.scale(k, k); draw(); ctx.restore(); }

function bird(time, t, o) {
  const hop = Math.abs(Math.sin(time * 4 + o.seed)) * o.h * .06;
  ctx.save(); ctx.translate(0, -hop);
  P([[-o.h * .45, -o.h * .45], [-o.h * (o.tail || .9), -o.h * .3], [-o.h * (o.tail || .9), -o.h * .52]], t(o.dark));
  E(0, -o.h * .42, o.h * .45, o.h * .32, t(o.body));
  if (o.belly) E(o.h * .08, -o.h * .34, o.h * .3, o.h * .2, t(o.belly));
  E(o.h * .38, -o.h * .72, o.h * .24, o.h * .23, t(o.head || o.body));
  P([[o.h * .58, -o.h * .75], [o.h * (.58 + (o.beak || .18)), -o.h * .7], [o.h * .58, -o.h * .66]], t(o.beakColor || '#3b3049'));
  E(o.h * .45, -o.h * .76, o.h * .05, o.h * .06, t(INK)); E(o.h * .465, -o.h * .78, o.h * .02, o.h * .02, WHITE);
  L(-o.h * .02, -o.h * .12, -o.h * .05, 0, t('#e6765f'), o.h * .04); L(o.h * .1, -o.h * .12, o.h * .12, 0, t('#e6765f'), o.h * .04);
  ctx.restore();
}

Object.assign(ACTORS, {
  cheeseCat: { w: 70, h: 45, d: (time, t) => scaled(1.15, () => drawCat(time, false, t, CAT_COATS.cheese)) },
  scarCat: { w: 70, h: 45, d: (time, t) => scaled(1.1, () => drawCat(time, false, t, CAT_COATS.scar)) },
  strayCat: { w: 60, h: 40, d: (time, t) => scaled(.95, () => drawCat(time, false, t, CAT_COATS.gray)) },
  kitten: { w: 30, h: 20, d: (time, t) => scaled(.42, () => drawCat(time, false, t, CAT_COATS.hero)) },
  roachFriend: { w: 2, h: 1, d: (time, t) => ANIMALS.cockroach(time + 1.3, true, 0, t) },
  dog: { w: 80, h: 60, d: (time, t) => {
    const fur = t('#d9a05f'), wag = Math.sin(time * 12) * .4;
    ctx.save(); ctx.translate(-30, -38); ctx.rotate(-.6 + wag); RR(-3, -14, 6, 16, 3, fur); ctx.restore();
    [-22, -12, 12, 22].forEach((x) => RR(x - 3, -22, 6.5, 22, 3, t('#c4884a')));
    E(0, -32, 33, 15, fur); E(4, -27, 20, 8, t('#fbe6c8'));
    E(30, -50, 15, 14, fur); E(40, -46, 8, 6, t('#fbe6c8')); E(47, -48, 2.2, 1.8, t(INK));
    P([[22, -60], [25, -72], [32, -61]], fur); P([[32, -62], [38, -73], [41, -59]], fur);
    E(36, -52, 2, 2.4, t(INK)); E(36.6, -53, .8, .8, WHITE); blush(36, -45, 2.8, 1.6);
  } },
  spider: { w: 4, h: 4, d: (time, t) => {
    const bob = Math.sin(time * 2) * .4;
    L(0, -2.4 + bob, 0, -400, t('#e9e4ec'), .05);
    ctx.save(); ctx.translate(0, bob);
    ctx.strokeStyle = t('#2f2a3a'); ctx.lineWidth = .18; ctx.lineCap = 'round'; ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const y = -1.6 + i * .35, k = Math.sin(time * 6 + i) * .15;
      ctx.moveTo(-.4, y); ctx.quadraticCurveTo(-1.6, y - .8, -2 - k, y + .5);
      ctx.moveTo(.4, y); ctx.quadraticCurveTo(1.6, y - .8, 2 + k, y + .5);
    }
    ctx.stroke();
    E(0, -1.2, 1, 1.15, t('#2f2a3a')); E(0, -2.3, .65, .6, t('#3b3049'));
    E(-.25, -2.35, .2, .24, WHITE); E(.25, -2.35, .2, .24, WHITE); E(-.22, -2.3, .1, .12, INK); E(.28, -2.3, .1, .12, INK);
    E(-.3, -.9, .25, .14, t('#e6765f'));
    ctx.restore();
  } },
  magpie: { w: 50, h: 26, d: (time, t) => bird(time, t, { h: 26, body: '#2f2a3a', dark: '#2f2a3a', belly: '#f4f1ea', tail: 1.6, seed: 1, beak: .16 }) },
  crow: { w: 50, h: 30, d: (time, t) => bird(time, t, { h: 30, body: '#2a2535', dark: '#1f1b28', tail: 1.1, seed: 2, beak: .3 }) },
  sparrow: { w: 14, h: 9, d: (time, t) => bird(time, t, { h: 9, body: '#b98a5e', dark: '#7a5a3e', belly: '#f0e2cc', head: '#8a5a3e', seed: 3, beak: .14, beakColor: '#3b3049' }) },
  pigeonFlock: { w: 140, h: 30, d: (time, t) => {
    [[-50, 0], [0, 1], [45, 2], [90, 3]].forEach(([x, seed]) => {
      ctx.save(); ctx.translate(x, 0); if (seed % 2) ctx.scale(-1, 1);
      bird(time + seed, t, { h: 26, body: '#aeb6cb', dark: '#8b93ab', belly: '#c5ccdc', head: '#9aa3bb', seed, beak: .14, beakColor: '#f2b48a' });
      ctx.restore();
    });
  } },
});
