/* 모기 장면 전용 그림과 주인공. 키는 'mosquito:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   모기 눈높이(화면 폭 약 36cm)에 맞춰 실제 크기로 그린다: 장구벌레 0.6cm, 알 뗏목 0.4cm, 손 18cm, 빗방울 0.4cm.
   Node에서는 키 목록만 내보낸다 (ANIMALS·ctx는 브라우저에만 있다) */
(function register(art, hero) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else { Object.assign(ACTORS, art); ANIMALS.mosquito = hero; }
})(...(() => {
  const BODY = '#a5805c', BODY_DK = '#6e5240', STRIPE = '#f1e3c6', WING = '#eaf4ff';
  const WATER = '#9fcbe0', WATER_DK = '#5f8fa8', SKIN_SH = '#e2ab88', SKIN_HI = '#fbe0c8', NAIL = '#fde9e2';
  const LEAF = '#6fa86a', LEAF_DK = '#4f8a55', RUBBER = '#34303a', SMOKE = '#eeeae4';

  /** 투명도를 잠깐 바꿔 그린다 */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha *= Math.max(0, Math.min(1, alpha)); draw(); ctx.restore(); }
  /** 경로를 만들어 채운다 */
  function fillPath(c, build) { ctx.fillStyle = c; ctx.beginPath(); build(); ctx.fill(); }
  /** 경로를 만들어 둥근 끝으로 긋는다 */
  function strokePath(c, w, build) {
    ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); build(); ctx.stroke(); ctx.restore();
  }
  /** cm 점 목록으로 경로를 만든다 (y는 아래가 +). 점 형식은 forms.js와 같다: [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
  function trace(pts) {
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (!i) ctx.moveTo(p[0], p[1]);
      else if (p.length === 2) ctx.lineTo(p[0], p[1]);
      else if (p.length === 4) ctx.quadraticCurveTo(p[0], p[1], p[2], p[3]);
      else ctx.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
    });
    ctx.closePath();
  }
  /** 면 하나를 오려 붙인다 */
  function slab(c, pts) { trace(pts); ctx.fillStyle = c; ctx.fill(); }
  /** 외곽(pts) 안에만 draw()가 칠해진다. 빛·그늘 면이 실루엣 밖으로 삐져나오지 않게 */
  function inside(pts, draw) { ctx.save(); trace(pts); ctx.clip(); draw(); ctx.restore(); }
  /** 원 안에만 draw()가 칠해진다 */
  function inDisc(x, y, r, draw) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); draw(); ctx.restore(); }
  /** 둥근 물건(바퀴·원통 끝)을 원 하나로 오리고 왼쪽 위 테만 밝게 남긴다 */
  function litDisc(x, y, r, p) { E(x, y, r, r, p.lit); inDisc(x, y, r, () => E(x + r * .09, y + r * .09, r * .97, r * .97, p.mid)); }
  /** 세워진 원통: 가운데 톤 몸통, 왼쪽 볕 띠, 오른쪽 그늘 띠 (x0~x1 폭, y0~y1 높이) */
  function upright(x0, x1, y0, y1, p, r = 0) {
    const w = x1 - x0;
    RR(x0, y0, w, y1 - y0, r, p.mid);
    ctx.save(); ctx.beginPath(); ctx.roundRect(x0, y0, w, y1 - y0, r); ctx.clip();
    R(x0, y0, w * .22, y1 - y0, p.lit); R(x0 + w * .7, y0, w * .3, y1 - y0, p.dark);
    ctx.restore();
  }

  /** 변환을 잠깐 걸고 그린다 */
  function at(x, y, rot, sx, sy, draw) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sx, sy); draw(); ctx.restore(); }

  /** 위로 피어오르는 연기·김 줄기 */
  function wisps(xs, y0, hgt, time, color, alpha = .45) {
    faded(alpha, () => xs.forEach((x, i) => strokePath(color, Math.max(.04, hgt * .03), () => {
      for (let k = 0; k <= 14; k++) {
        const yy = y0 - k / 14 * hgt, xx = x + Math.sin(k * .8 + time * 2 + i * 2) * hgt * .07 * (k / 14 + .3);
        if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
    })));
  }
  /** 반짝이는 십자 빛 */
  function glint(x, y, r, alpha) {
    faded(alpha, () => { L(x - r, y, x + r, y, WHITE, r * .25); L(x, y - r, x, y + r, WHITE, r * .25); });
  }
  /** 떨어지는 물방울 (아래가 둥근 눈물 모양) */
  function drop(x, y, r, color) {
    fillPath(color, () => { ctx.moveTo(x, y - r * 2.6); ctx.quadraticCurveTo(x + r * 1.1, y - r * .6, x, y + r); ctx.quadraticCurveTo(x - r * 1.1, y - r * .6, x, y - r * 2.6); });
    E(x - r * .3, y - r * .1, r * .22, r * .38, WHITE);
  }
  /** 물 위로 번지는 동심원 */
  function ripples(x, y, r, time, color, n = 2) {
    for (let i = 0; i < n; i++) {
      const ph = (time * .5 + i / n) % 1;
      faded(.7 * (1 - ph), () => strokePath(color, r * .05, () => ctx.ellipse(x, y, r * (.2 + ph), r * (.2 + ph) * .25, 0, 0, TAU)));
    }
  }

  /** 모기 한 마리. 원점 = 가슴 가운데. o: { male 수컷(깃털 더듬이), fed 피로 부푼 배, flap 날갯짓(-1~1) } */
  function drawMosquito(time, t, o = {}) {
    const flap = o.flap ?? Math.sin(time * 40), ink = t(INK);
    [[.06, .05, .22, .2, .34, .44], [.01, .06, -.02, .26, -.1, .46], [-.04, .05, -.26, .2, -.5, .3]].forEach(([x0, y0, x1, y1, x2, y2], i) => {
      const sw = Math.sin(time * 2 + i) * .02;
      strokePath(ink, .016, () => { ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, y1 - .04, x1, y1); ctx.lineTo(x2 + sw, y2); if (i === 2) ctx.lineTo(x2 - .12, y2 - .14); });
    });
    at(-.02, -.07, -.35 - flap * .45, 1, 1, () => faded(.55, () => {
      E(-.3, 0, .32, .075, WING); strokePath(t('#b9c7da'), .012, () => { ctx.moveTo(-.02, 0); ctx.lineTo(-.58, -.01); });
    }));
    const swell = o.fed ? 1.35 : 1;
    at(-.1, .01, .12, 1, swell, () => {
      fillPath(t(BODY), () => { ctx.moveTo(0, -.07); ctx.bezierCurveTo(-.2, -.11, -.46, -.07, -.52, 0); ctx.bezierCurveTo(-.46, .07, -.2, .1, 0, .07); ctx.closePath(); });
      if (o.fed) faded(.55, () => E(-.25, .01, .2, .055, t('#d63a3a')));
      [-.1, -.2, -.3, -.4].forEach((x) => strokePath(t(STRIPE), .025, () => { ctx.moveTo(x, -.075); ctx.quadraticCurveTo(x - .03, 0, x, .07); }));
    });
    at(-.02, -.07, -.35 - flap * .45 + .3, 1, 1, () => faded(.7, () => E(-.27, -.02, .3, .07, WHITE)));
    E(0, -.02, .13, .11, t(BODY_DK)); faded(.5, () => E(-.03, -.08, .07, .03, t(STRIPE)));
    E(.16, -.02, .1, .095, t(BODY));
    cuteEye(.18, -.035, .066, .072, time, t);
    blush(.2, .03, .03, .018);
    strokePath(ink, .018, () => { ctx.moveTo(.22, .01); ctx.quadraticCurveTo(.4, .05, .5, .17); });
    strokePath(t(BODY_DK), .014, () => { ctx.moveTo(.21, .0); ctx.lineTo(.28, .05); });
    const ant = o.male ? 6 : 2;
    for (let i = 0; i < ant; i++) {
      const a = -.9 - i * .12 + Math.sin(time * 3 + i) * .04;
      strokePath(ink, o.male ? .01 : .012, () => { ctx.moveTo(.2, -.08); ctx.lineTo(.2 + Math.cos(a) * .2, -.08 + Math.sin(a) * .2); });
    }
  }

  /** 짝! 치는 손 하나: 손목이 원점, 손끝이 위(-y), 손바닥이 +x 쪽(🫳을 세운 옆모습). 소맷부리가 손목에 붙는다 */
  function clapHand(t) { at(0, 0, -Math.PI / 2, 1, 1, () => artHand(t, { pose: 'flat', s: 14, sleeve: '#7a9cc6' })); }

  /** 다리 털 몇 가닥 */
  function hairs(x0, x1, y0, y1, n, salt, t) {
    for (let i = 0; i < n; i++) {
      const x = x0 + hash(i, salt) * (x1 - x0), y = y0 + hash(i, salt + 1) * (y1 - y0);
      L(x, y, x - .25, y - .45, t('#5a463c'), .05);
    }
  }

  const art = {
    /* M1 — 내가 빠져나온 번데기 껍질. 등이 갈라진 채 물 위에 떠 있다 */
    'mosquito:pupaSkin': { w: 1, h: .4, d: (time, t) => {
      ripples(0, 0, .5, time, t(WATER_DK));
      faded(.35, () => strokePath(t('#b89a6a'), .08, () => { ctx.moveTo(-.05, .02); ctx.quadraticCurveTo(-.32, .12, -.22, .28); ctx.quadraticCurveTo(-.15, .34, -.1, .3); }));
      const bob = Math.sin(time * 1.6) * .015;
      fillPath(t('#c9a86a'), () => { ctx.moveTo(-.22, bob); ctx.bezierCurveTo(-.28, -.24 + bob, .12, -.32 + bob, .22, -.1 + bob); ctx.quadraticCurveTo(.25, bob, .1, bob); ctx.closePath(); });
      faded(.5, () => E(-.04, -.2 + bob, .12, .04, WHITE));
      strokePath(t('#6b4a2a'), .025, () => { ctx.moveTo(-.14, -.18 + bob); ctx.quadraticCurveTo(0, -.26 + bob, .12, -.18 + bob); });
      [[-.02, -.26], [.06, -.25]].forEach(([x, y]) => strokePath(t('#8a6a44'), .02, () => { ctx.moveTo(x, y + bob); ctx.lineTo(x - .05, y - .07 + bob); }));
    } },

    /* M1 — 대야 물 밑에 거꾸로 매달린 장구벌레 동생들. 숨관 끝만 수면에 대고 꼬물댄다 */
    'mosquito:wigglers': { w: 10, h: 1, d: (time, t) => {
      const body = t('#6b5a46'), head = t('#4a3a2e');
      for (let i = 0; i < 6; i++) {
        const x = -4.2 + i * 1.6 + hash(i, 3) * .5, wig = Math.sin(time * 4 + i * 1.9), deep = .45 + hash(i, 4) * .3;
        ripples(x, 0, .5, time + i, t('#fff6ea'), 1);
        faded(deep, () => at(x, 0, .3 + wig * .25, 1, 1, () => {
          strokePath(body, .03, () => { ctx.moveTo(0, 0); ctx.lineTo(.04, .12); });                                  // 숨관
          strokePath(body, .085, () => { ctx.moveTo(.04, .12); ctx.quadraticCurveTo(.1 + wig * .06, .35, .02, .55); });
          E(.02, .6, .07, .06, head);
        }));
      }
    } },

    /* M7 — 화단의 비비추 꽃대. 보라색 나팔꽃 같은 종이 줄줄이 달리고, 아래엔 넓은 줄무늬 잎 */
    'mosquito:hostaFlower': { w: 22, h: 30, d: (time, t) => {
      const sway = Math.sin(time * 1.1) * .03;
      [[-6, -.5, -.5], [5, -.3, .5], [0, 0, 0]].forEach(([x, y, lean], i) => at(x, y, lean, 1, 1, () => {
        const c = i === 2 ? LEAF : LEAF_DK;
        fillPath(t(c), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-5.5, -2, -5, -9, 0, -11); ctx.bezierCurveTo(5, -9, 5.5, -2, 0, 0); });
        fillPath(t(shade(c)), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(2, -3, 3, -8, 0, -11); ctx.bezierCurveTo(5, -9, 5.5, -2, 0, 0); });
        [-3, -1.4, 1.4, 3].forEach((dx) => faded(.5, () => strokePath(t('#cfe6b8'), .08, () => { ctx.moveTo(0, -.5); ctx.quadraticCurveTo(dx, -5, dx * .3, -10.4); })));
      }));
      at(0, 0, sway, 1, 1, () => {
        strokePath(t('#5f9a5a'), .35, () => { ctx.moveTo(0, -6); ctx.quadraticCurveTo(.6, -18, 1, -29); });
        [[-13, 1], [-15.5, -1], [-18, 1], [-20.5, -1], [-23, 1]].forEach(([y, side], i) => at(.4 + y * -.02, y, side > 0 ? .35 : Math.PI - .35, 1, side, () => {
          const len = 5.6 - i * .4, open = 1.5 - i * .15;
          fillPath(t('#a98fdc'), () => { ctx.moveTo(0, -.18); ctx.bezierCurveTo(len * .5, -.22, len * .75, -.5 * open, len, -1.1 * open); ctx.quadraticCurveTo(len * 1.12, 0, len, 1.1 * open); ctx.bezierCurveTo(len * .75, .5 * open, len * .5, .22, 0, .18); ctx.closePath(); });
          fillPath(t('#c7b4ee'), () => { ctx.moveTo(0, -.1); ctx.bezierCurveTo(len * .5, -.15, len * .8, -.4 * open, len, -1 * open); ctx.lineTo(len * .9, -.1); ctx.closePath(); });
          E(len, 0, .3, 1.05 * open, t('#7e60b8'));
          strokePath(t('#f4f1ea'), .05, () => { ctx.moveTo(len * .8, .1); ctx.quadraticCurveTo(len + .9, .2, len + 1.1, -.4); });
          E(len + 1.1, -.45, .1, .07, t('#ffd56b'));
        }));
        [[-25.5, .3], [-27, -.2], [-28.5, .1]].forEach(([y, a]) => at(.8, y, a, 1, 1, () => { E(.9, 0, 1, .35, t('#9a80cf')); E(.7, -.1, .5, .12, t('#c7b4ee')); }));
      });
    } },

    /* M2·D2 — 고추잠자리. 커다란 겹눈, 빨간 마디 배, 그물맥 날개 네 장이 떨린다 */
    'mosquito:dragonfly': { w: 7, h: 3, d: (time, t) => {
      const y = -1.4 + Math.sin(time * 2.2) * .1, red = '#e5463a';
      [[-.1, .55, -.15], [.15, .6, .12]].forEach(([x, len, base], i) => {
        const flick = Math.sin(time * 30 + i * 2) * .14;
        [-1, 1].forEach((side) => at(x, y - .2, base + side * (.12 + flick), 1, 1, () => faded(.45, () => {
          fillPath(t(WING), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-.6, -.45 * side * 0 - .35, -2.6, -.45, -3.1, -.12); ctx.quadraticCurveTo(-2, .05, 0, 0); });
          strokePath(t('#c9d6e8'), .02, () => { ctx.moveTo(0, 0); ctx.lineTo(-3, -.18); ctx.moveTo(-.8, -.2); ctx.lineTo(-1.6, -.05); ctx.moveTo(-1.8, -.3); ctx.lineTo(-2.4, -.08); });
          E(-2.6, -.25, .14, .05, t('#7a3a30'));
        })));
      });
      for (let k = 0; k < 9; k++) {
        const x = -.3 - k * .42, r = .17 - k * .006;
        RR(x - .24, y - r, .46, r * 2, r * .8, t(k % 2 ? red : shade(red)));
      }
      E(.4, y, .55, .42, t('#b8483a')); faded(.5, () => E(.3, y - .2, .3, .1, t('#ff9a7a')));
      [-.05, .25, .5].forEach((x, i) => strokePath(t(INK), .03, () => { ctx.moveTo(x + .2, y + .3); ctx.lineTo(x + .1 + i * .08, y + .65); ctx.lineTo(x - .05 + i * .14, y + .9); }));
      E(1.1, y - .1, .48, .5, t('#9a2a2a')); E(1.2, y - .15, .38, .4, t('#c8403a'));
      E(1.05, y - .35, .16, .12, WHITE); faded(.4, () => E(1.35, y + .1, .12, .1, WHITE));
    } },

    /* M3 — 가로등 불빛 아래 짝을 찾는 수컷 모기 떼 (깃털 더듬이) */
    'mosquito:maleSwarm': { w: 9, h: 7, d: (time, t) => {
      faded(.22 + Math.sin(time * 1.3) * .04, () => E(0, -3.5, 4.6, 3.4, '#ffe9a8'));
      faded(.12, () => P([[-1.2, -7.5], [1.2, -7.5], [4, 0], [-4, 0]], '#fff3c8'));
      for (let i = 0; i < 13; i++) {
        const p = time * (1 + hash(i, 4) * .6) + i * 1.3;
        const x = Math.sin(p) * (2 + hash(i, 5) * 1.8), y = -3.4 + Math.sin(p * 2 + i) * (1.2 + hash(i, 6));
        at(x, y, Math.cos(p) * .2, Math.cos(p) > 0 ? .7 : -.7, .7, () => drawMosquito(time + i, t, { male: true, flap: Math.sin(time * 70 + i) }));
      }
    } },

    /* M4·M10 — 경비실 의자에서 조는 할아버지 발: 바지를 걷어 올린 맨 정강이, 회색 양말에 삼선 슬리퍼. 발끝을 까딱인다 */
    'mosquito:slipperAnkle': { w: 25, h: 30, d: (time, t) => {
      const tap = Math.max(0, Math.sin(time * 2.4)) * .05;
      at(11, 0, tap, 1, 1, () => at(-11, 0, 0, 1, 1, () => {
        const Sp = planes(t, '#2f4268'), St = planes(t, '#2f5fb0');
        slab(Sp.mid, [[-12.4, 0], [-13, -1.8, -11, -1.8], [10.8, -1.8], [12, -1.4, 11.6, 0]]);                      // 슬리퍼 바닥 옆면
        slab(Sp.dark, [[-12.2, -.5], [11.8, -.5], [11.6, 0], [-12.4, 0]]);
        slab(Sp.lit, [[-12.6, -1.8], [11, -1.8], [11.6, -2.4], [-12, -2.4]]);                                         // 발 닿는 윗면
        fillPath(t('#b9b6c0'), () => { ctx.moveTo(-12, -2.4); ctx.bezierCurveTo(-12.6, -4.8, -10, -5.6, -7, -6); ctx.bezierCurveTo(-3, -6.6, 1, -8.4, 3.4, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11.6, -7, 11.8, -4, 10.4, -2.4); ctx.closePath(); });
        fillPath(t('#9e9aa8'), () => { ctx.moveTo(-12, -2.4); ctx.quadraticCurveTo(0, -3.4, 10.4, -2.4); ctx.lineTo(10.6, -3.6); ctx.quadraticCurveTo(0, -4.4, -12, -3.2); ctx.closePath(); });
        fillPath(t(SKIN), () => { ctx.moveTo(3.4, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11, -18, 11.6, -24, 12.2, -31); ctx.lineTo(4.2, -31); ctx.bezierCurveTo(4, -24, 3.6, -16, 3.4, -11); });
        fillPath(t(SKIN_SH), () => { ctx.moveTo(8.8, -11); ctx.lineTo(10.6, -11); ctx.bezierCurveTo(11, -18, 11.6, -24, 12.2, -31); ctx.lineTo(10.2, -31); ctx.bezierCurveTo(9.8, -24, 9.2, -17, 8.8, -11); });
        E(8.2, -12.4, 1, .8, t(SKIN_SH)); RR(3.2, -11.6, 7.6, 1.2, .5, t('#d0cdd6'));
        hairs(4.5, 9.5, -14, -29, 10, 71, t);
        const strap = [[-8.6, -2.4], [-8, -6.6, -2, -8.6, 1.6, -9], [4.2, -8.4], [1.4, -6.6, .4, -4, .8, -2.4]];
        slab(St.mid, strap);
        inside(strap, () => { slab(St.lit, [[-9, -2], [-8.6, -7, -3, -9.4, 1, -10], [-1, -7.4, -5.6, -5.6, -9, -2]]); slab(St.dark, [[-1, -2], [.4, -5, 1.8, -8, 3, -10], [5, -10], [5, -2]]); });   // 볕 받는 발등 쪽 · 그늘진 옆
        [0, 1, 2].forEach((i) => strokePath(WHITE, .45, () => { ctx.moveTo(-6.8 + i * 2.2, -2.8); ctx.quadraticCurveTo(-5.4 + i * 2, -5.8 + i * .2, -2.6 + i * 1.6, -7.4 + i * .2); }));
      }));
    } },

    /* D4 — 양쪽에서 짝! 하고 닫히는 두 손바닥 */
    'mosquito:palmClap': { w: 26, h: 17, d: (time, t) => {
      const gap = 1.2 + (1 + Math.sin(time * 5)) * 2.2;
      faded(.5, () => [-1, 1].forEach((s) => [0, 1, 2].forEach((i) => L(s * (gap + 10.5), -6 - i * 2.2, s * (gap + 12.5 + i * .6), -6.6 - i * 2.2, WHITE, .18))));
      at(-gap - 8, 2, .3, 1, 1, () => clapHand(t));
      at(gap + 8, 2, -.3, -1, 1, () => clapHand(t));
      faded(.6, () => [0, 1, 2, 3].forEach((i) => { const a = -Math.PI / 2 + (i - 1.5) * .45; L(Math.cos(a) * 1, -8 + Math.sin(a) * 1, Math.cos(a) * 2, -8 + Math.sin(a) * 2, t('#ffe08a'), .15); }));
    } },

    /* M2 — 분리수거장에 쓰러진 사이다 캔과 바닥에 번진 단물. 기포가 톡톡 올라온다 */
    'mosquito:sodaSpill': { w: 16, h: 7, d: (time, t) => {
      faded(.7, () => fillPath(t('#e4f2c4'), () => { ctx.moveTo(-1, 0); ctx.bezierCurveTo(1, -.5, 7, -.6, 8.6, 0); ctx.bezierCurveTo(7, .4, 1, .3, -1, 0); }));
      faded(.5, () => E(5, -.12, 2, .1, WHITE));
      const G = planes(t, '#4caf72'), Al = planes(t, '#d2d6dd');
      E(-5.4, -3.3, 1, 3.3, G.dark);                                                                                // 바닥 쪽 둥근 끝
      const can = [[-5.4, -6.6], [5, -6.6], [5, 0], [-5.4, 0]];
      slab(G.mid, can);
      inside(can, () => { slab(G.lit, [[-6, -7], [6, -7], [6, -5.2], [-6, -5.4]]); slab(G.dark, [[-6, -1.8], [6, -2], [6, 1], [-6, 1]]); });   // 위는 볕, 아래는 그늘
      strokePath(t('#f4f1ea'), .7, () => { ctx.moveTo(-5.4, -3.6); ctx.bezierCurveTo(-3, -5.6, -1, -1.6, 1.4, -3.6); ctx.bezierCurveTo(3, -5, 4, -3, 5, -3.6); });
      slab(G.dark, [[.4, -6.6], [1.2, -4.8], [.6, -3], [1.4, -6.6]]);                                              // 찌그러진 자국
      E(5, -3.3, 1.05, 3.3, Al.dark); E(5.15, -3.4, .82, 2.95, Al.lit);                                              // 따는 쪽 뚜껑
      E(5.25, -4.4, .25, .7, Al.deep); RR(5.05, -2.8, .3, 1.4, .15, Al.dark);
      for (let i = 0; i < 6; i++) {
        const ph = (time * .7 + hash(i, 14)) % 1;
        faded(1 - ph, () => strokePath(WHITE, .04, () => ctx.arc(1 + hash(i, 15) * 6.5, -.1 - ph * .6, .08 + ph * .05, 0, TAU)));
      }
    } },

    /* M4 — 경비실 발치의 초록 모기향. 받침 위 소용돌이 끝이 빨갛게 타고, 매운 연기가 감아 오른다 */
    'mosquito:mosquitoCoil': { w: 14, h: 18, d: (time, t) => {
      const St = planes(t, '#b4b8c2');
      E(0, -.55, 6.4, 1.15, St.dark); E(-.25, -.85, 6.1, .95, St.lit); E(.3, -.75, 5.2, .7, St.mid);                 // 받침 접시: 테는 볕, 바닥은 가운데 톤
      L(0, -.8, 0, -3.2, St.dark, .2);
      const pts = [];
      for (let a = 0; a <= 3.4 * TAU; a += .2) { const r = .5 + a * .24; pts.push([Math.cos(a) * r, -3.3 + Math.sin(a) * r * .38]); }
      const draw = (c, dy, w) => strokePath(c, w, () => pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))));
      draw(t('#2f6a3a'), .18, .62); draw(t('#4f9a5a'), 0, .55);
      faded(.4, () => draw(t('#9fd8a0'), -.15, .12));
      const [ex, ey] = pts[pts.length - 1];
      ctx.save(); ctx.shadowColor = '#ff6a3a'; ctx.shadowBlur = 10 + Math.sin(time * 6) * 4; E(ex, ey, .35, .3, '#ff6a3a'); ctx.restore();
      E(ex, ey, .18, .16, '#ffd08a');
      wisps([ex], ey - .4, 15, time, t(SMOKE), .6);
      wisps([ex + .4], ey - .8, 11, time + 1.7, t('#d8d4de'), .35);
    } },

    /* M11 — 물 위에 띄운 알 뗏목. 알 200개를 세워서 배 모양으로 붙였다 (길이 0.4cm) */
    'mosquito:eggRaft': { w: .6, h: .25, d: (time, t) => {
      ripples(0, 0, .5, time, t('#cfe6b8'), 2);
      const bob = Math.sin(time * 1.5) * .01;
      fillPath(t('#3a2e28'), () => { ctx.moveTo(-.26, -.04 + bob); ctx.quadraticCurveTo(0, .06 + bob, .26, -.06 + bob); ctx.lineTo(.22, -.16 + bob); ctx.quadraticCurveTo(0, -.12 + bob, -.22, -.14 + bob); ctx.closePath(); });
      for (let i = 0; i < 11; i++) { const x = -.2 + i * .04; E(x, -.15 + bob - Math.abs(x) * .1, .016, .02, t('#6b5a4a')); }
      glint(.1, -.22, .05, .5 + Math.sin(time * 2.2) * .5);
    } },

    /* M7·D7 — 방역 연무기 분사구. 하얀 연기가 뭉게뭉게 밀려 나온다 */
    'mosquito:fogNozzle': { w: 24, h: 12, d: (time, t) => {
      for (let i = 0; i < 9; i++) {
        const ph = (time * .35 + i / 9) % 1, x = -2 - ph * 14, y = -4 - Math.sin(i * 2.3) * 1.5 * ph, r = 1 + ph * 3.4;
        faded(.75 * (1 - ph * .7), () => { E(x, y, r, r * .8, t(SMOKE)); E(x + r * .5, y - r * .4, r * .6, r * .5, WHITE); });
      }
      const H = planes(t, '#9a9eaa'), G = planes(t, '#ffb347');
      strokePath(H.dark, 1.1, () => { ctx.moveTo(10, -1); ctx.quadraticCurveTo(4, -2.4, .6, -4); });               // 분사관: 아래는 그늘
      strokePath(H.lit, .45, () => { ctx.moveTo(10, -1.35); ctx.quadraticCurveTo(4, -2.75, .6, -4.35); });          // 윗등은 볕
      slab(H.mid, [[.9, -3.3], [-1.6, -5.2], [-1.9, -2.8], [.7, -4.8]]);                                            // 나팔 주둥이
      slab(H.lit, [[.9, -3.3], [-1.6, -5.2], [-1.75, -4.1], [.8, -4.1]]);
      const grip = [[6, -3.6], [9.2, -3.6], [10, -2, 9.2, -.4], [6, -.4], [5.6, -2, 6, -3.6]];
      slab(G.mid, grip); inside(grip, () => { slab(G.lit, [[5, -4], [10.5, -4], [10.5, -2.8], [5, -2.6]]); slab(G.dark, [[5, -1.2], [10.5, -1.4], [10.5, 0], [5, 0]]); });   // 손잡이
    } },

    /* M6 — 연석 밑 빗물받이. 쇠창살 사이로 어둡고 축축한 틈이 열려 있다 */
    'mosquito:drainGrate': { w: 22, h: 16, d: (time, t) => {
      const C = planes(t, '#b8b4bc'), I = planes(t, '#4a4652');
      slab(C.mid, [[-11, 0], [-11, -14], [11, -14], [11, 0]]);                                                      // 연석 앞면
      slab(C.lit, [[-11, -14], [11, -14], [10.4, -16], [-10.4, -16]]);                                              // 윗면 (볕)
      slab(C.dark, [[9.6, 0], [9.6, -14], [11, -14], [11, 0]]);
      slab(t('#1f1b26'), [[-8, -.6], [-8, -6.4], [-7.4, -7], [7.4, -7], [8, -6.4], [8, -.6]]);                      // 어둡고 축축한 틈
      slab(C.deep, [[-8, -7], [8, -7], [8, -6.2], [-8, -6.2]]);
      for (let x = -7; x <= 7; x += 1.4) { RR(x - .3, -7, .6, 6.4, .2, I.mid); R(x - .3, -7, .2, 6.4, I.lit); }     // 쇠창살: 왼쪽 모서리만 볕
      faded(.4, () => strokePath(t(WATER), .2, () => { ctx.moveTo(-5, -.6); ctx.quadraticCurveTo(-1, .2, 5, -.4); }));
      P([[-5.6, -7], [-4.2, -8.4], [-3.6, -7]], t('#c98d5a')); P([[3, -7], [4.6, -8], [5, -7]], t('#a8b86a'));
      const ph = (time * .6) % 1;
      faded(1 - ph, () => drop(2, -6.6 + ph * 5.6, .14, t(WATER)));
      glint(-6, -6, .3, .5 + Math.sin(time * 2) * .5);
    } },

    /* M10·D11 — 할아버지가 새로 산 전기 모기채. 노란 테 안 그물에서 파란 불꽃이 지지직 */
    'mosquito:racketZap': { w: 30, h: 22, d: (time, t) => {
      const swing = Math.sin(time * 2.5) * .06, H = planes(t, '#3a3445'), Y = planes(t, '#ffd23a');
      at(14, 0, swing, 1, 1, () => at(-14, 0, 0, 1, 1, () => {
        strokePath(H.mid, 2.2, () => { ctx.moveTo(5.6, -5.4); ctx.lineTo(15.6, 1); });                                // 손잡이
        strokePath(H.lit, .7, () => { ctx.moveTo(5.9, -6.1); ctx.lineTo(15.6, .2); });
        RR(11.4, -2.6, 1.6, 1, .4, t('#ff4a5a')); E(13.4, -.6, .3, .3, '#7fff9f');
        ctx.save(); ctx.beginPath(); ctx.ellipse(-3, -11, 9.2, 7.2, -.35, 0, TAU); ctx.clip();
        faded(.2, () => R(-14, -20, 22, 18, t('#9fd0ff')));
        ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .08; ctx.globalAlpha = .7; ctx.beginPath();
        for (let k = -14; k <= 8; k += .9) { ctx.moveTo(k, -20); ctx.lineTo(k + 4, -2); }
        for (let k = -20; k <= -2; k += .9) { ctx.moveTo(-14, k); ctx.lineTo(8, k - 4); }
        ctx.stroke(); ctx.restore();
        strokePath(Y.mid, 1.1, () => ctx.ellipse(-3, -11, 9.7, 7.7, -.35, 0, TAU));                                 // 노란 테
        strokePath(Y.lit, .55, () => ctx.ellipse(-3, -11, 9.85, 7.85, -.35, Math.PI * .95, Math.PI * 1.6));          // 왼쪽 위는 볕
        strokePath(Y.dark, .55, () => ctx.ellipse(-3, -11, 9.6, 7.6, -.35, Math.PI * .02, Math.PI * .7));            // 오른쪽 아래는 그늘
        const tick = Math.floor(time * 5);
        if (hash(tick, 2) > .4) {
          const sx = -7 + hash(tick, 3) * 8, sy = -14 + hash(tick, 4) * 6;
          ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 12;
          strokePath('#d6f0ff', .14, () => { ctx.moveTo(sx, sy); ctx.lineTo(sx + .6, sy + .9); ctx.lineTo(sx - .2, sy + 1.5); ctx.lineTo(sx + .5, sy + 2.4); });
          ctx.restore();
        }
      }));
    } },

    /* M9·D10 — 내 몸무게의 쉰 배짜리 빗방울(지름 0.4cm). 웅덩이에 왕관처럼 튄다 */
    'mosquito:bigRaindrop': { w: 10, h: 14, d: (time, t) => {
      const water = t('#bfe0f5');
      faded(.6, () => E(0, -.05, 4.4, .2, t(WATER)));
      for (let i = 0; i < 7; i++) {
        const x = -4 + hash(i, 21) * 8, ph = (time * .8 + hash(i, 22)) % 1, y = -14 + ph * 14;
        faded(.3, () => L(x, y - 2.6, x, y - .7, WHITE, .05));
        faded(.9, () => drop(x, y, .2, water));
        if (ph > .9) {
          const s = (ph - .9) / .1;
          faded(1 - s, () => { [-1, -.5, .5, 1].forEach((d) => E(x + d * (.3 + s * .4), -.2 - Math.abs(d) * s * .4, .05, .05, water)); strokePath(water, .05, () => ctx.ellipse(x, 0, .2 + s * .7, .08 + s * .15, 0, 0, TAU)); });
        }
      }
      const ph = (time * .55) % 1;
      faded(.95, () => drop(-.6, -9 + ph * 9, .32, water)); faded(.4, () => L(-.6, -12 + ph * 9, -.6, -10 + ph * 9, WHITE, .07));
    } },

    /* M9 — 비를 막아 주는 플라타너스 잎. 위에선 빗방울이 튕기고 끝에서 물이 흐른다 */
    'mosquito:leafShelter': { w: 12, h: 9, d: (time, t) => {
      const sway = Math.sin(time * 1.6) * .05;
      strokePath(t('#7a5a3a'), .25, () => { ctx.moveTo(3, -9); ctx.quadraticCurveTo(2, -6, 1, -3.4); });
      at(1, -3.4, sway, 1, 1, () => {
        fillPath(t(LEAF), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-1, -1.6, -4, -2, -5.6, -.6); ctx.lineTo(-4.4, -.2); ctx.lineTo(-6, .8); ctx.bezierCurveTo(-4, 1, -2, .8, 0, 0); });
        fillPath(t(LEAF_DK), () => { ctx.moveTo(0, 0); ctx.bezierCurveTo(-2, .8, -4, 1, -6, .8); ctx.lineTo(-5.4, 1.6); ctx.bezierCurveTo(-3, 2, -1, 1.2, 0, 0); });
        [[-2, -1.2], [-3.8, -.9], [-2.4, 1.1]].forEach(([x, y]) => faded(.6, () => L(0, 0, x, y, t('#cfe6b8'), .06)));
        L(0, 0, -5.8, .7, t('#cfe6b8'), .08);
        const ph = (time * .7) % 1;
        faded(1 - ph, () => drop(-5.5, 1.8 + ph * 3, .12, t('#bfe0f5')));
        for (let i = 0; i < 3; i++) {
          const u = (time * 1.3 + i * .33) % 1;
          faded(1 - u, () => E(-1.5 - i * 1.4 + u * .4, -1.4 - u * .8, .08, .08, t('#bfe0f5')));
        }
      });
    } },

    /* M9 — 우산 아래 서 있는 사람의 맨다리와 운동화. 우산 끝에서 물이 줄줄 떨어진다 */
    'mosquito:umbrellaLegs': { w: 30, h: 34, d: (time, t) => {
      [-3.8, 4.2].forEach((x, i) => {
        fillPath(t(i ? SKIN_SH : SKIN), () => { ctx.moveTo(x - 2, -10); ctx.bezierCurveTo(x - 2.8, -20, x - 2, -28, x - 2.4, -35); ctx.lineTo(x + 3.4, -35); ctx.bezierCurveTo(x + 4.4, -26, x + 3, -16, x + 2.2, -10); ctx.closePath(); });
        hairs(x - 1.6, x + 2, -14, -32, 6, 101 + i, t);
        const Sh = planes(t, '#f1efe8'), So = planes(t, '#5fa8ff');
        RR(x - 2.2, -11, 4.6, 2.2, .8, Sh.mid);
        const shoe = [[x - 3, -1], [x - 9, -1], [x - 10.4, -1.4, x - 10, -4.2, x - 7, -4.8], [x - 4, -5.6, x - 2.4, -7.4], [x - 1.4, -9.6, x + 2.4, -9.6], [x + 3.4, -1]];
        slab(Sh.mid, shoe);
        inside(shoe, () => { slab(Sh.lit, [[x - 11, -2.6], [x - 10, -5.4, x - 6, -5.6], [x - 2.6, -8.2], [x - 1.6, -10], [x - 1, -6, x - 6, -3, x - 11, -2.6]]); slab(Sh.dark, [[x + 1.4, -1], [x + 1.8, -6, x + 2, -10], [x + 4, -10], [x + 4, -1]]); });   // 앞코 윗면 볕 · 뒤꿈치 그늘
        RR(x - 10.2, -1.4, 13.8, 1.4, .6, So.mid); R(x - 10, -.5, 13.4, .5, So.dark);
        [0, 1, 2].forEach((k) => L(x - 5 + k * 1.2, -5.8 + k * .8, x - 3.4 + k * 1.2, -6.8 + k * .8, t('#8d929e'), .2));
      });
      [-12, 13].forEach((x, i) => {
        for (let k = 0; k < 4; k++) {
          const ph = (time * 1.4 + k / 4 + i * .3) % 1;
          faded(.9, () => drop(x + Math.sin(k) * .4, -34 + ph * 34, .2, t('#bfe0f5')));
        }
      });
      faded(.5, () => E(1, -.05, 14, .25, t(WATER)));
    } },

    /* M1·D1 — 대야를 비우러 온 경비 할아버지 손. 위에서 내려와 저 건너편 대야 테두리에 손끝을 건다 */
    'mosquito:rimHand': { w: 10, h: 16, d: (time, t) => {
      const Sl = planes(t, '#5a6a88'), pull = Math.sin(time * .8) * .12;
      at(0, pull, 0, 1, 1, () => {
        const arm = [[-1.6, -18], [2.8, -18], [2.6, -13, 2.2, -10.2], [-1.4, -10.2], [-1.6, -13, -1.6, -18]];
        slab(Sl.mid, arm); inside(arm, () => slab(Sl.lit, [[-2.2, -19], [-.2, -19], [-.2, -9], [-2.2, -9]]));        // 경비복 소매
        faded(.5, () => slab(Sl.deep, [[-1.4, -10.6], [2.2, -10.6], [2.2, -10.2], [-1.4, -10.2]]));
        artHandOnArm(t, .4, -10.4, Math.PI / 2 + .12, 7.6, { pose: 'flat' });                                          // 손끝이 아래로, 테두리에 걸린다
      });
      for (let i = 0; i < 3; i++) {
        const ph = (time * .9 + i / 3) % 1;
        faded(.7 * (1 - ph), () => drop(-.6 + i * .9, -3 + ph * 3, .12, t(WATER)));                                     // 손끝에서 떨어지는 물방울
      }
      ripples(.4, 0, 1.6, time, t('#fff6ea'), 2);
    } },

    /* M2 — 음식물 통 옆에 떨어진 수박 껍질. 빨간 살에 까만 씨, 하얀 속껍질, 줄무늬 초록 겉껍질 */
    'mosquito:melonRind': { w: 16, h: 6, d: (time, t) => {
      const G = planes(t, '#3f8f4a'), Rd = planes(t, '#e8505a');
      faded(.25, () => E(0, -.1, 7.6, .4, t(INK)));
      const rind = [[-7.6, -2.6], [-6, .2, 6, .2, 7.6, -2.6], [6.8, -2.4], [5, -.9, -5, -.9, -6.8, -2.4]];
      slab(G.mid, rind); inside(rind, () => slab(G.dark, [[-8, -1], [0, 0, 8, -1], [8, 1], [-8, 1]]));                 // 겉껍질: 아래로 돌아가는 면은 그늘
      inside(rind, () => [-4.2, -1.4, 1.4, 4.2].forEach((x) => faded(.45, () => slab(G.deep, [[x - .3, 1], [x + .3, 1], [x * 1.3 + .3, -3], [x * 1.3 - .3, -3]]))));   // 겉껍질 줄무늬
      slab(t('#f4f0d8'), [[-6.8, -2.4], [-5, -.9, 5, -.9, 6.8, -2.4], [6.4, -3], [4.6, -1.7, -4.6, -1.7, -6.4, -3]]);   // 하얀 속껍질
      const flesh = [[-6.4, -3], [-4.6, -1.7, 4.6, -1.7, 6.4, -3], [4, -5.6, -4, -5.6, -6.4, -3]];
      slab(Rd.mid, flesh); inside(flesh, () => { slab(Rd.lit, [[-7, -6], [7, -6], [7, -4.6], [-7, -4.2]]); slab(Rd.dark, [[3, -1], [3.6, -3.6, 7, -4], [7, -1]]); });   // 베어 낸 윗면은 볕, 오른쪽 끝은 그늘
      [[-3.4, -3.4], [-1.2, -4.4], [1.4, -3.2], [3.2, -4.2], [-.2, -2.6]].forEach(([x, y], i) => at(x, y, .4 + i * .3, 1, 1, () => fillPath(t('#2a2026'), () => { ctx.moveTo(0, -.32); ctx.quadraticCurveTo(.2, 0, 0, .2); ctx.quadraticCurveTo(-.2, 0, 0, -.32); })));
      const ph = (time * .4) % 1;
      faded(.8 * (1 - ph), () => drop(6.2, -2.4 + ph * 2.2, .18, t('#f79aa0')));                                       // 단물 한 방울
      faded(.6, () => E(6.6, -.05, 1.2, .1, t('#f0b0b0')));
    } },

    /* M3·D3 — 가로등 둘레를 도는 집박쥐. 손가락 뼈를 따라 접힌 날개막이 제자리에서 퍼덕인다 */
    'mosquito:bat': { w: 14, h: 6, d: (time, t) => {
      const B = planes(t, '#4a3a40'), flap = Math.sin(time * 9), y = -3 + flap * .3;
      [-1, 1].forEach((side) => at(side * .5, y - .4, 0, side, 1 - flap * .15 * side * 0, () => {
        const lift = flap * 1.6;
        const wing = [[0, 0], [1.6, -1.4 - lift * .4, 3.6, -2.2 - lift], [6.6, -1.4 - lift * .8], [5.8, -.4 - lift * .3, 5.2, .6 - lift * .2], [4.4, .2, 3.6, .9], [2.6, .6, 1.8, 1.2], [.8, .8, 0, .8]];
        slab(side > 0 ? B.mid : B.dark, wing);
        faded(.5, () => strokePath(B.deep, .08, () => { ctx.moveTo(.4, 0); ctx.lineTo(3.6, -2 - lift); ctx.moveTo(.4, .1); ctx.lineTo(4.6, .3); ctx.moveTo(.4, .2); ctx.lineTo(2.4, .8); }));
      }));
      E(0, y, .8, 1.1, B.mid); faded(.6, () => E(-.2, y - .3, .45, .6, B.lit));                                            // 털 난 몸통
      E(0, y - 1.3, .62, .55, B.mid);
      [-1, 1].forEach((s) => fillPath(B.mid, () => { ctx.moveTo(s * .2, y - 1.6); ctx.lineTo(s * .55, y - 2.4); ctx.lineTo(s * .62, y - 1.5); ctx.closePath(); }));   // 귀
      E(.28, y - 1.35, .1, .1, t('#fff6dc'));
      fillPath(t('#e88a9a'), () => { ctx.moveTo(.3, y - 1.05); ctx.lineTo(.62, y - 1.1); ctx.lineTo(.42, y - .9); ctx.closePath(); });
    } },

    /* M4·M10 — 경비실 바닥에 세워 둔 물파스. 초록 몸통에 하얀 띠, 스펀지 머리에 투명 뚜껑 */
    'mosquito:mulpas': { w: 4, h: 11, d: (time, t) => {
      const G = planes(t, '#3a9a6a'), Wt = planes(t, '#f4f1ea');
      faded(.25, () => E(0, -.05, 2.2, .25, t(INK)));
      upright(-1.6, 1.6, -7.6, 0, G, .4);                                                                            // 몸통
      upright(-1.6, 1.6, -5.4, -3.4, Wt, 0);                                                                          // 상표 띠
      faded(.8, () => strokePath(t('#e8503a'), .22, () => { ctx.moveTo(-.9, -4.4); ctx.lineTo(.9, -4.4); }));
      upright(-1.2, 1.2, -8.6, -7.6, Wt, .2);                                                                         // 어깨
      upright(-.9, .9, -9.6, -8.6, planes(t, '#f0e2b0'), .3);                                                         // 스펀지 머리
      faded(.35, () => { RR(-1.3, -11, 2.6, 3, .8, t('#d6eef8')); R(-1.1, -10.8, .5, 2.6, t('#ffffff')); });         // 투명 뚜껑
    } },

    /* M5 — 지하 주차장 바닥에 박힌 주차 턱. 노랑·검정 줄무늬 고무가 낮게 엎드려 있다 */
    'mosquito:parkingStop': { w: 30, h: 9, d: (time, t) => {
      const Y = planes(t, '#e8c84a'), K = planes(t, '#2f2c34');
      faded(.3, () => E(0, -.1, 15.6, .6, t(INK)));
      const front = [[-15, 0], [-13.6, -8], [13.6, -8], [15, 0]];
      slab(Y.mid, front);
      inside(front, () => {
        for (let x = -16; x < 16; x += 7) slab(K.mid, [[x, 0], [x + 3.5, 0], [x + 5, -9], [x + 1.5, -9]]);           // 비스듬한 검은 줄
        faded(.3, () => slab(t('#fffaf0'), [[-16, -8.4], [16, -8.4], [16, -6.8], [-16, -6.8]]));                       // 위 모서리 볕
        slab(Y.dark, [[11, 0], [12.6, -9], [16, -9], [16, 0]]);
      });
      slab(Y.lit, [[-13.6, -8], [13.6, -8], [12.8, -9], [-12.8, -9]]);                                                 // 윗면 (형광등 빛)
      [-8, 8].forEach((x) => { E(x, -8.5, .9, .35, K.dark); E(x - .15, -8.6, .45, .16, K.lit); });                     // 고정 볼트
    } },

    /* M6 — 화단 턱에 버려진 테이크아웃 컵. 빗물이 반쯤 차서 수면이 반짝인다 */
    'mosquito:iceCup': { w: 10, h: 17, d: (time, t) => {
      const C = planes(t, '#e6eef2'), Gs = planes(t, '#4fa86a');
      faded(.25, () => E(0, -.1, 4.4, .35, t(INK)));
      const cup = [[-3.4, 0], [-4.6, -13], [4.6, -13], [3.4, 0]];
      faded(.45, () => slab(C.mid, cup));
      inside(cup, () => {
        faded(.7, () => slab(t('#8fb8b0'), [[-5, 0], [-5, -6.6], [5, -6.6], [5, 0]]));                               // 고인 빗물
        faded(.5, () => slab(C.lit, [[-5, -13], [-3, -13], [-2.4, 0], [-4, 0]]));                                     // 볕 받는 컵 벽
      });
      E(0, -6.6, 4.1, .55, t('#a9d0c8')); faded(.7, () => E(-1.2, -6.7, 1.6, .16, t('#ffffff')));
      ripples(1.4, -6.6, 1.6, time, t('#ffffff'), 2);
      slab(C.dark, [[-4.9, -13], [4.9, -13], [4.9, -13.8], [-4.9, -13.8]]);                                             // 컵 테두리
      strokePath(Gs.mid, .5, () => { ctx.moveTo(1.2, -6); ctx.lineTo(3.4, -16.6); });                                  // 빨대
      strokePath(Gs.lit, .18, () => { ctx.moveTo(1.05, -6.4); ctx.lineTo(3.2, -16.6); });
    } },

    /* M6·D6 — 웅덩이 위의 소금쟁이. 긴 다리 끝이 수면을 오목하게 누른다 */
    'mosquito:waterStrider': { w: 9, h: 1.5, d: (time, t) => {
      const B = planes(t, '#3a3440'), sway = Math.sin(time * 1.4) * .08;
      faded(.6, () => E(0, 0, 4.6, .22, t(WATER)));
      [[-3.6, .1], [-2.2, .05], [2.6, .05], [3.8, .1]].forEach(([x], i) => {
        faded(.6, () => strokePath(t(WATER_DK), .04, () => ctx.ellipse(x + sway, .02, .35, .08, 0, 0, Math.PI)));    // 다리 끝이 만든 오목한 자국
        strokePath(B.dark, .06, () => { ctx.moveTo(i < 2 ? -.4 : .4, -.55); ctx.quadraticCurveTo((i < 2 ? -1.6 : 1.6) + sway, -1.1, x + sway, 0); });
      });
      strokePath(B.dark, .06, () => { ctx.moveTo(.8, -.55); ctx.lineTo(1.5, -.7); });                                  // 짧은 앞다리
      E(0, -.55, 1.1, .16, B.mid); faded(.6, () => E(-.2, -.63, .7, .06, B.lit));
      E(1.2, -.6, .2, .14, B.mid); E(1.3, -.65, .05, .05, t('#fff6dc'));
    } },

    /* M8·D8 — 바닥 멀티탭에 꽂힌 전자 모기향. 약병이 매달리고, 초록 불이 깜빡이며 옅은 김이 오른다 */
    'mosquito:liquidVape': { w: 15, h: 9, d: (time, t) => {
      const Wt = planes(t, '#eceae4'), Lq = planes(t, '#7fb8e0');
      faded(.25, () => E(0, -.1, 7.6, .45, t(INK)));
      const strip = [[-7.4, 0], [-7.4, -2.2], [-6.8, -2.6], [7.4, -2.6], [7.4, 0]];
      slab(Wt.mid, strip); slab(Wt.lit, [[-7.4, -2.2], [-6.8, -2.6], [7.4, -2.6], [7.4, -2.1], [-7, -2.1]]);              // 멀티탭
      [-4, -.4].forEach((x) => { RR(x, -2.5, 1.6, .3, .1, Wt.dark); });
      const body = [[1, -2.6], [1.2, -6.6, 2, -7.4], [5.6, -7.4], [6.4, -6.6, 6.6, -2.6]];
      slab(Wt.mid, body); inside(body, () => { slab(Wt.lit, [[0, -8], [2.6, -8], [2.2, -2.6], [0, -2.6]]); slab(Wt.dark, [[5.2, -8], [7, -8], [7, -2.6], [5.4, -2.6]]); });   // 본체
      faded(.6, () => slab(Lq.mid, [[2.4, -2.6], [2.4, -5], [5.2, -5], [5.2, -2.6]]));                                  // 약병
      faded(.5, () => R(2.6, -4.8, .5, 2, t('#ffffff')));
      const blink = .5 + Math.sin(time * 3) * .5;
      faded(.4 + blink * .6, () => E(3.8, -6.4, .3, .3, t('#7fff9f')));
      wisps([3.8], -7.6, 5, time, t('#e6f2ec'), .25);
      strokePath(Wt.dark, .3, () => { ctx.moveTo(-7.4, -1.2); ctx.quadraticCurveTo(-9, -1, -9.6, 0); });                // 전선
    } },

    /* M8·K1 — 아이 방 모기장. 하얀 그물이 바닥까지 드리웠고 왼쪽 아래 귀퉁이가 살짝 들렸다 */
    'mosquito:kidNet': { w: 24, h: 34, d: (time, t) => {
      const Hm = planes(t, '#dfe8f2'), lift = 2.6 + Math.sin(time * .9) * .3;
      const edge = [[-11, -lift], [-6, -lift, -3, -.2], [11, 0]];
      const net = [[-11, -36], [11, -36], [11, 0], [-3, -.2], [-6, -lift, -11, -lift]];
      faded(.12, () => slab(t('#f4f8fc'), net));
      inside(net, () => {
        ctx.save(); ctx.strokeStyle = t('#aab8c8'); ctx.globalAlpha = .22; ctx.lineWidth = .05; ctx.beginPath();
        for (let x = -11; x <= 11; x += .6) { ctx.moveTo(x, -36); ctx.lineTo(x + Math.sin(x + time * .5) * .2, 0); }
        for (let y = -36; y <= 0; y += .6) { ctx.moveTo(-11, y); ctx.lineTo(11, y); }
        ctx.stroke(); ctx.restore();
        [-7, 1, 8].forEach((x) => faded(.1, () => slab(t('#ffffff'), [[x, -36], [x + 2.4, -36], [x + 2, 0], [x - .4, 0]])));   // 주름 빛
      });
      const hem = [...edge, [11, -1], [-3, -1.2], [-6, -lift - 1, -11, -lift - 1]];
      slab(Hm.mid, hem); faded(.8, () => slab(Hm.lit, [[-11, -lift - 1], [-6, -lift - 1, -3, -1.2], [11, -1], [11, -1.3], [-3, -1.5], [-6, -lift - 1.3, -11, -lift - 1.3]]));   // 밑단 천
    } },

    /* K1 — 모기장 안, 이불 밖으로 나온 아이 발. 뒤꿈치를 요에 대고 발가락이 위를 보며 꼼지락댄다 */
    'mosquito:kidFoot': { w: 16, h: 12, d: (time, t) => {
      const Bl = planes(t, '#f2d27a'), wig = Math.sin(time * 2.2) * .1;
      const blanket = [[-8, 0], [-8.6, -6, -7, -9.4], [-3.4, -11.4, -.6, -10], [1.4, -7, .8, 0]];
      slab(Bl.mid, blanket); inside(blanket, () => { slab(Bl.lit, [[-9, -11], [0, -11], [-1, -9], [-9, -8]]); slab(Bl.dark, [[-.6, 0], [0, -6, .6, -11], [2, -11], [2, 0]]); });   // 이불 끝자락
      const foot = [[.4, -7.4], [2.2, -8.2, 3.6, -10.4], [4.4, -11.8, 5.8, -11.6], [6.9, -11.3, 6.7, -9.8], [6.2, -6, 6.5, -3], [6.6, -.6, 4.4, 0], [2, .2, .4, -.6]];
      slab(t(SKIN), foot); inside(foot, () => slab(t(SKIN_SH), [[5.2, 1], [5, -6, 5.8, -12], [8, -12], [8, 1]]));         // 발바닥 쪽은 그늘
      [[5.4, -11.7, .62], [6.2, -11.1, .5], [6.7, -10.3, .42]].forEach(([x, y, r], i) => at(x, y, wig * (i % 2 ? -1 : 1), 1, 1, () => E(0, 0, r, r * .85, t(i ? SKIN_SH : SKIN))));   // 발가락
    } },

    /* M11 — 대야 옆에서 조는 할아버지 손. 부채를 쥔 채 대야 위로 축 늘어져 살랑 흔들린다 */
    'mosquito:fanHand': { w: 14, h: 22, d: (time, t) => {
      const Sl = planes(t, '#5a6a88'), Fn = planes(t, '#7cc4d8'), Bm = planes(t, '#f1efe8'), sway = Math.sin(time * .7) * .05;
      at(-1, -24, sway, 1, 1, () => {
        const arm = [[-2, 0], [2.6, 0], [2.4, 6, 2.2, 9], [-1.4, 9], [-1.6, 6, -2, 0]];
        slab(Sl.mid, arm); inside(arm, () => slab(Sl.lit, [[-2.6, 0], [-.4, 0], [-.4, 10], [-2.6, 10]]));              // 경비복 소매
        strokePath(Bm.mid, .5, () => { ctx.moveTo(.6, 12); ctx.lineTo(2.3, 16.8); });                                   // 플라스틱 자루
        artHandOnArm(t, .4, 8.6, Math.PI / 2 - .15, 5, { pose: 'grip' });                                               // 손끝이 아래로
        at(3.6, 20, -.35 + sway * 2, 1, .82, () => {
          E(0, 0, 3.4, 3.6, Fn.mid); inDisc(0, 0, 3.4, () => { E(-1.2, -1.2, 3, 3, Fn.lit); E(1.8, 1.8, 2.4, 2.4, Fn.dark); });   // 둥근 부채: 왼쪽 위 볕
          E(-.9, -1, .9, .9, t('#fff6ea')); faded(.8, () => E(1, .8, .7, .7, t('#e8786a')));                             // 찍힌 꽃 두 송이
        });
      });
    } },

    /* D12 — 경비실 앞 벽에 달린 해충퇴치기의 아랫도리. 철망 너머 파란 등이 윙윙 빛나고 가끔 타닥 불꽃이 튄다 */
    'mosquito:zapperLamp': { w: 24, h: 14, d: (time, t) => {
      const Bx = planes(t, '#e9e4ec');
      const body = [[-12, -14], [12, -14], [12, -3], [11, -2, 10, -2], [-10, -2], [-11, -2, -12, -3]];
      slab(Bx.mid, body); inside(body, () => { slab(Bx.lit, [[-13, -15], [-9, -15], [-9, -1], [-13, -1]]); slab(Bx.dark, [[9, -15], [13, -15], [13, -1], [9, -1]]); });   // 몸통: 왼쪽 볕, 오른쪽 그늘
      slab(t('#2a3050'), [[-9, -13], [9, -13], [9, -4], [-9, -4]]);
      ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 16 + Math.sin(time * 5) * 4;
      [-11, -7.4].forEach((y) => RR(-8, y, 16, 1.6, .8, t('#9fd0ff')));
      ctx.restore();
      ctx.save(); ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .3; ctx.beginPath();
      for (let x = -8; x <= 8; x += 1.6) { ctx.moveTo(x, -13); ctx.lineTo(x, -4); }
      ctx.stroke(); ctx.restore();
      const tick = Math.floor(time * 4);
      if (hash(tick, 5) > .55) { const sx = -6 + hash(tick, 6) * 12; strokePath(t('#e6f6ff'), .2, () => { ctx.moveTo(sx, -6); ctx.lineTo(sx + .5, -5); ctx.lineTo(sx - .2, -4.4); }); }
    } },

    /* D9 — 모기장 안 모기를 집으려는 아이 엄마 손. 접은 휴지를 쥐고 다가온다 */
    'mosquito:tissuePinch': { w: 18, h: 14, d: (time, t) => {
      const near = Math.sin(time * 2) * .6, Ts = planes(t, '#f8f6f0');
      at(near, 0, 0, 1, 1, () => {
        artHandAt(t, 0, -6, Math.PI - .25, 12, { pose: 'pinch', sleeve: '#c97a8a', held: () => {
          const tissue = [[-.18, -.2], [.1, -.32], [.32, -.16], [.3, .2], [.04, .3], [-.2, .14]];
          slab(Ts.mid, tissue); slab(Ts.lit, [[-.18, -.2], [.1, -.32], [.32, -.16], [.04, -.04]]); slab(Ts.dark, [[.3, .2], [.04, .3], [.1, .06]]);
        } });
      });
    } },
  };

  /** 주인공 모기: 가볍게 둥실거리며 날갯짓한다 */
  function hero(time, moving, eye, t) {
    const y = -eye + Math.sin(time * 3) * .3, flap = Math.sin(time * (moving ? 90 : 45));
    at(0, y, Math.sin(time * 1.5) * .05, 1.15, 1.15, () => drawMosquito(time, t, { flap }));
  }

  return [art, hero];
})());
