/* 집파리 장면 전용 그림. 키는 'fly:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   파리 눈높이(화면 폭 약 36cm)에 맞춰 실제 크기로 그린다: 번데기 껍질 0.6cm, 빗방울 0.4cm, 밥알 0.6cm, 알 1mm */
(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})((() => {
  const FLY_BODY = '#4a4258', FLY_EYE = '#ff6b7a', WING = '#eaf4ff';
  const HONEY = '#f2a23a', BROTH = '#d9a84a', SAUCE = '#e0503a', RICE = '#fbf7ee';

  /** 투명도를 잠깐 바꿔 그린다 */
  function faded(alpha, draw) { ctx.save(); ctx.globalAlpha = alpha; draw(); ctx.restore(); }

  /** 위로 피어오르는 냄새·김 줄기 */
  function wisps(xs, y0, hgt, time, color, alpha = .45) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = Math.max(.04, hgt * .03); ctx.lineCap = 'round'; ctx.globalAlpha = alpha;
    xs.forEach((x, i) => {
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const yy = y0 - k / 12 * hgt, xx = x + Math.sin(k * .9 + time * 2 + i * 2) * hgt * .06;
        if (k) ctx.lineTo(xx, yy); else ctx.moveTo(xx, yy);
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  /** 반짝이는 십자 빛 */
  function glint(x, y, r, alpha) {
    faded(Math.max(0, alpha), () => { L(x - r, y, x + r, y, WHITE, r * .25); L(x, y - r, x, y + r, WHITE, r * .25); });
  }

  /** 떨어지는 물방울 하나 (아래가 둥근 눈물 모양) */
  function drop(x, y, r, color) {
    E(x, y, r, r * 1.15, color);
    P([[x - r * .85, y - r * .4], [x, y - r * 2.6], [x + r * .85, y - r * .4]], color);
    E(x - r * .3, y - r * .2, r * .25, r * .4, WHITE);
  }

  /** 다른 파리 한 마리. o: { stuck 발버둥, sleep 눈 감음, frayed 해진 날개, old 바랜 몸 } */
  function miniFly(x, y, k, time, t, o = {}) {
    ctx.save(); ctx.translate(x, y); ctx.scale(k, k); if (o.tilt) ctx.rotate(o.tilt);
    faded(.75, () => {
      if (o.frayed) {
        P([[-.02, -.2], [-.5, -.44], [-.42, -.34], [-.52, -.3], [-.4, -.24], [-.47, -.16], [-.1, -.13]], WING);
        P([[.06, -.22], [-.3, -.5], [-.26, -.4], [-.36, -.36], [-.24, -.3], [-.02, -.18]], WHITE);
      } else { E(-.16, -.3, .28, .14, WING); E(.02, -.33, .24, .13, WHITE); }
    });
    E(0, 0, .32, .24, t(o.old ? '#6d6577' : FLY_BODY));
    [-.16, -.02].forEach((sx) => RR(sx, -.2, .06, .4, .03, t(INK)));
    E(.3, -.04, .18, .17, t(o.old ? '#6d6577' : FLY_BODY));
    E(.36, -.1, .14, .15, t(FLY_EYE));
    if (o.sleep) L(.26, -.1, .46, -.08, t(INK), .04); else E(.32, -.15, .04, .04, WHITE);
    const kick = o.stuck ? Math.sin(time * 14 + x * 7) * .1 : 0;
    L(-.1, .2, -.16 + kick, .38, t(INK), .03); L(.12, .2, .14 - kick, .38, t(INK), .03);
    ctx.restore();
  }

  return {
    /* F1 — 내가 찢고 나온 번데기 껍질. 뚜껑이 톡 떨어져 있다 */
    'fly:pupaCase': { w: 1.2, h: .5, d: (time, t) => {
      const brown = t('#9a6440'), dark = t('#6b4126');
      faded(.4, () => E(.05, -.01, .45, .05, t('#c9a86a')));
      E(-.02, -.14, .3, .14, brown);
      [-.16, -.04, .08].forEach((x) => L(x, -.26, x, -.03, dark, .018));
      E(.27, -.15, .045, .11, t('#3b2a24'));
      L(.22, -.27, .17, -.22, dark, .015); L(.17, -.22, .2, -.18, dark, .015);
      ctx.save(); ctx.translate(.48, -.08); ctx.rotate(.7 + Math.sin(time * 1.2) * .04);
      E(0, 0, .06, .1, brown); L(-.02, -.08, -.02, .08, dark, .015);
      ctx.restore();
      faded(.45, () => E(-.1, -.23, .13, .03, WHITE));
    } },

    /* F1 — 수거통 가장자리의 시큼한 국물 웅덩이 (배추 조각, 밥알, 고춧가루, 거품) */
    'fly:sourPuddle': { w: 8, h: 3, d: (time, t) => {
      faded(.85, () => E(0, -.06, 3.8, .32, t(BROTH)));
      E(-.6, -.1, 2.6, .18, t('#e8c46a'));
      faded(.6, () => E(-1.4, -.14, 1, .06, WHITE));
      P([[1.4, -.1], [2.6, -.55], [3.1, -.12]], t('#a8cf7a')); L(1.6, -.12, 2.75, -.38, t('#d8ecb8'), .05);
      E(-2.4, -.2, .3, .14, t(RICE)); RR(.4, -.24, .35, .14, .07, t(SAUCE));
      for (let i = 0; i < 4; i++) {
        const ph = (time * .5 + hash(i, 5)) % 1, r = .08 + ph * .08;
        faded(1 - ph, () => E(-2.6 + i * 1.5, -.15 - ph * .15, r, r, t('#f6e3a8')));
      }
      wisps([-2, -.4, 1.4], -.4, 2.6, time, t('#d9c27a'));
    } },

    /* F2 — 작업복 장갑이 들어 올리는 음식물 통 뚜껑, 아래로 국물이 뚝뚝 */
    'fly:liftedLid': { w: 10, h: 6, d: (time, t) => {
      const lid = '#f2b33d', lift = Math.sin(time * 1.1) * .3;
      ctx.save(); ctx.translate(0, -1 - lift); ctx.rotate(-.18 + Math.sin(time * .7) * .03);
      for (let i = 0; i < 3; i++) {
        const ph = (time * .7 + i * .33) % 1;
        faded(1 - ph, () => drop(-3 + i * 2.4, .4 + ph * 3.2, .13, t(BROTH)));
      }
      RR(-5, -1, 10, 1.1, .5, t(lid)); RR(-5, -.2, 10, .4, .18, t(shade(lid)));
      RR(-1.2, -1.5, 2.4, .6, .3, t('#d99a2b'));
      RR(5.4, -4.4, 2.6, 2.6, .6, t('#4a5d7a'));
      RR(3.6, -2.7, 2.9, 2.3, .9, t('#f4f1ea'));
      [0, 1, 2, 3].forEach((i) => RR(3.7 + i * .65, -.7, .55, 1.4, .27, t('#e6765f')));
      ctx.restore();
    } },

    /* F2 — 수거차 꽁무니 모서리: 깜빡이는 후진등, 삐 삐 소리, 범퍼에서 흐르는 국물 */
    'fly:reverseLight': { w: 8, h: 16, d: (time, t) => {
      const lit = Math.sin(time * 7) > 0;
      E(11, -4.5, 4.5, 4.5, t('#3a3445')); E(11, -4.5, 1.8, 1.8, t('#cfcad8'));
      RR(-2, -30, 18, 25, 1.2, t('#6fae7f')); RR(-2, -13, 18, 1, 0, t('#f4f1ea'));
      RR(-3, -5.4, 19, 2.2, .6, t('#3a3445'));
      [0, 2, 4, 6].forEach((x) => RR(x, -4.9, 1.2, .4, .2, t('#5f5a6c')));
      RR(-.8, -10, 3, 3.2, .6, t('#3a3445'));
      if (lit) {
        ctx.save(); ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 24; RR(-.4, -9.6, 2.2, 2.4, .4, '#ffb347'); ctx.restore();
        ctx.save(); ctx.strokeStyle = '#ffe1a8'; ctx.lineWidth = .18; ctx.lineCap = 'round'; ctx.globalAlpha = .8;
        [1.6, 2.6, 3.6].forEach((r) => { ctx.beginPath(); ctx.arc(-.6, -8.4, r, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); });
        ctx.restore();
      } else RR(-.4, -9.6, 2.2, 2.4, .4, t('#8a5a2a'));
      const ph = (time * .6) % 1;
      faded(1 - ph, () => drop(-2.2, -3 + ph * 3, .14, t(BROTH)));
    } },

    /* F3 — 골목 환기구. 기름이 맺혔다가 뚝 떨어지고, 따뜻한 냄새가 올라온다 */
    'fly:ventDrip': { w: 8, h: 6, d: (time, t) => {
      RR(-4, -5, 8, 5, .5, t('#b9b4c2')); RR(-3.5, -4.5, 7, 4, .3, t('#6f6a7c'));
      for (let y = -4.2; y < -.8; y += .8) RR(-3.5, y, 7, .45, .2, t('#cfcad8'));
      faded(.75, () => P([[-1, 0], [1.2, 0], [.7, 1.1], [.3, 1.9], [-.4, 1.1]], t('#c9a14a')));
      const swell = (time * .5) % 1;
      E(.25, 1.95 + swell * .3, .12 + swell * .08, .16 + swell * .12, t('#e8c25a'));
      E(.2, 1.9 + swell * .25, .04, .06, WHITE);
      const fall = (time * .5 + .5) % 1, fy = 2.4 + fall * fall * 4;
      faded(1 - fall * .6, () => drop(.25, fy, .14, t('#e8c25a')));
      wisps([-2.5, 0, 2.5], -5.2, 3.5, time, t('#f4f1ea'), .3);
    } },

    /* F3 — 처마 귀퉁이 거미줄. 이슬이 반짝이고, 지름길 쪽으로 실 한 가닥이 늘어져 있다 */
    'fly:eavesWeb': { w: 10, h: 12, d: (time, t) => {
      RR(-7, -12.8, 14, 1.8, .4, t('#8b8fa3'));
      for (let x = -6.5; x <= 6.5; x += 1) E(x, -11, .5, .3, t('#6f7388'));
      RR(4.4, -11, 1, 11, .4, t('#9aa3bb'));
      const c = [0, -8], anchors = [[-4.5, -11], [-1.5, -11], [1.5, -11], [4.4, -10.4], [4.4, -7.5], [4.4, -4.6], [1.2, -4], [-2.2, -4.8], [-4.4, -7.6]];
      ctx.save(); ctx.strokeStyle = t('#f4f1ea'); ctx.lineWidth = .04; ctx.globalAlpha = .85; ctx.beginPath();
      anchors.forEach(([x, y]) => { ctx.moveTo(c[0], c[1]); ctx.lineTo(x, y); });
      [.25, .45, .65, .85].forEach((f) => anchors.forEach(([x, y], i) => {
        const px = c[0] + (x - c[0]) * f, py = c[1] + (y - c[1]) * f;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }));
      ctx.stroke();
      const sway = Math.sin(time * 1.4) * .4;
      ctx.beginPath(); ctx.moveTo(-4.5, -11); ctx.quadraticCurveTo(-5.5 + sway, -7, -6 + sway, -3.5); ctx.stroke();
      ctx.restore();
      anchors.forEach(([x, y], i) => glint(c[0] + (x - c[0]) * .65, c[1] + (y - c[1]) * .65, .18, Math.sin(time * 3 + i * 1.7)));
      glint(-6 + sway, -3.5, .22, .5 + Math.sin(time * 2) * .5);
    } },

    /* F4 — 반쯤 열린 주방 창문: 알루미늄 창틀 레일과 미닫이 유리, 레일에 말라붙은 소스 자국 */
    'fly:windowFrame': { w: 10, h: 15, d: (time, t) => {
      RR(-6, -.8, 12, .8, .3, t('#c9c4cc')); L(-6, -.4, 6, -.4, t('#a29fb2'), .08);
      faded(.6, () => { E(-3, -.85, .6, .12, t('#c0503a')); E(-2.2, -.82, .2, .07, t('#c0503a')); });
      faded(.35, () => RR(3, -15, 5, 14.2, 0, t('#bfe3f5')));
      faded(.5, () => { P([[3.4, -10], [4.4, -12], [5.4, -6], [4.4, -4]], WHITE); P([[5.8, -13], [6.3, -14], [7.2, -9], [6.7, -8]], WHITE); });
      RR(2, -15.2, 1, 14.4, .3, t('#d8d4de')); RR(2.65, -15.2, .35, 14.4, .15, t(shade('#d8d4de')));
    } },

    /* F4 — 조리대 위 떡볶이 접시: 떡, 어묵, 파, 김, 접시 가장자리의 반들반들한 소스 방울 */
    'fly:tteokbokki': { w: 8, h: 3, d: (time, t) => {
      E(0, -.35, 4, .45, t(shade('#f4f1ea'))); E(0, -.6, 3.8, .5, t('#fbfaf6'));
      E(0, -.65, 3.2, .38, t(SAUCE));
      P([[1.2, -.8], [2.6, -1.5], [2.7, -.7]], t('#e8b878'));
      [[-1.8, -.9], [-.4, -1.0], [.9, -.95], [-1.1, -1.45], [.3, -1.6]].forEach(([x, y]) => {
        RR(x - .8, y - .35, 1.6, .55, .27, t('#f6e2d0')); RR(x - .8, y - .35, 1.6, .24, .12, t('#e8604a'));
        faded(.6, () => E(x - .3, y - .25, .3, .05, WHITE));
      });
      [[-2.4, -.8], [.1, -1.25], [1.6, -1.1]].forEach(([x, y]) => RR(x, y, .4, .18, .09, t('#7fbf6a')));
      E(3.65, -.35, .13, .17, t('#c8402a')); E(3.61, -.4, .04, .05, WHITE);
      wisps([-1.5, .5, 2], -1.8, 3, time, WHITE, .35);
    } },

    /* D12 — 가스레인지 위 찌개 냄비: 끓는 국물, 두부, 뜨거운 김 */
    'fly:stewPot': { w: 20, h: 12, d: (time, t) => {
      for (let x = -6; x <= 6; x += 2) {
        const h = .8 + Math.sin(time * 12 + x) * .25;
        faded(.8, () => P([[x - .5, 0], [x, -h], [x + .5, 0]], '#6fb7ff'));
      }
      RR(-11.6, -8.6, 2.4, 1, .5, t('#3a3445')); RR(9.2, -8.6, 2.4, 1, .5, t('#3a3445'));
      RR(-9, -9.4, 18, 9, 1.5, t(shade('#a8adb8'))); RR(-9, -9.4, 15, 9, 1.5, t('#a8adb8'));
      E(0, -9.6, 9.4, 1.3, t('#cfd3db')); E(0, -9.6, 8.8, 1, t('#e2683a'));
      [[-4, -9.7], [1.5, -9.5], [4.5, -9.8]].forEach(([x, y]) => RR(x - .6, y - .5, 1.2, .8, .15, t('#fbf7ee')));
      [[-2, -9.4], [3, -9.9]].forEach(([x, y]) => RR(x, y, .9, .25, .12, t('#7fbf6a')));
      ctx.save(); ctx.strokeStyle = t('#ffb08a'); ctx.lineWidth = .08;
      for (let i = 0; i < 4; i++) {
        const ph = (time * .8 + hash(i, 9)) % 1;
        ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.arc(-6 + i * 4, -9.6, .1 + ph * .4, Math.PI, 0); ctx.stroke();
      }
      ctx.restore();
      wisps([-5, -1.5, 2, 5.5], -10.6, 8, time, WHITE, .4);
    } },

    /* F5 — 천장에서 내려온 꿀 냄새 끈끈이 리본의 끝자락. 먼저 붙은 친구들이 발버둥 친다 */
    'fly:honeyRibbon': { w: 3, h: 22, d: (time, t) => {
      const sway = Math.sin(time * 1.5) * .25, gold = '#ffd56b';
      wisps([-2.2, 2.4], -1.5, 5, time, t('#ffe08a'), .35);
      P([[-1.3, -24], [1.3, -24], [1.3 + sway, 0], [-1.3 + sway, 0]], t(gold));
      faded(.4, () => P([[-.9, -24], [-.4, -24], [-.4 + sway, 0], [-.9 + sway, 0]], WHITE));
      E(sway, 0, 1.3, .22, t(shade(gold)));
      const g = (time * .4) % 1;
      E(sway + .3, .35 + g * .3, .22 + g * .08, .28 + g * .12, t(HONEY));
      E(sway + .22, .28 + g * .3, .06, .09, WHITE);
      [[-4, .3], [-9.5, -.4], [-15, .2]].forEach(([y, tilt], i) => miniFly(sway * (1 + y / 24) - .1, y, 1, time + i, t, { stuck: true, tilt }));
    } },

    /* F5·F10·D9 — 구석의 파란 전기 해충퇴치기. 웅웅 빛나고 가끔 지지직 */
    'fly:zapperGlow': { w: 10, h: 8, d: (time, t) => {
      faded(.12, () => P([[-4, 0], [4, 0], [7, 6], [-7, 6]], '#9fd0ff'));
      faded(.15 + Math.sin(time * 4) * .06, () => E(0, -4, 7.5, 5.5, '#5fa8ff'));
      RR(-5, -8, 10, 8, 1, t('#e9e4ec')); RR(-4.3, -7.3, 8.6, 6.6, .6, t('#3b3049'));
      ctx.save(); ctx.shadowColor = '#5fa8ff'; ctx.shadowBlur = 18;
      [-6.3, -4.4, -2.5].forEach((y) => RR(-3.8, y, 7.6, .9, .45, '#9fd0ff'));
      ctx.restore();
      ctx.strokeStyle = t('#8d8a9c'); ctx.lineWidth = .1; ctx.beginPath();
      for (let x = -3.6; x <= 3.6; x += .8) { ctx.moveTo(x, -7); ctx.lineTo(x, -1); }
      ctx.stroke();
      const tick = Math.floor(time * 6);
      if (hash(tick, 2) > .7) {
        const sx = -3 + hash(tick, 3) * 6;
        ctx.save(); ctx.strokeStyle = WHITE; ctx.lineWidth = .12; ctx.shadowColor = '#bfe6ff'; ctx.shadowBlur = 10; ctx.beginPath();
        ctx.moveTo(sx, -6.5); ctx.lineTo(sx + .4, -5.6); ctx.lineTo(sx - .3, -4.9); ctx.lineTo(sx + .3, -4); ctx.stroke(); ctx.restore();
      }
    } },

    /* F5 — 불빛 아래 떨어진 튀김 부스러기 */
    'fly:friedCrumbs': { w: 4, h: .6, d: (time, t) => {
      for (let i = 0; i < 6; i++) {
        const x = -1.8 + hash(i, 31) * 3.6, r = .14 + hash(i, 32) * .2;
        P([[x - r, 0], [x - r * .6, -r * 1.1], [x + r * .3, -r * 1.4], [x + r, -r * .5], [x + r * .8, 0]], t('#d99a3e'));
        E(x, -r * .8, r * .5, r * .35, t('#f2c46a'));
        faded(.5, () => E(x - r * .2, -r, r * .2, r * .1, WHITE));
      }
    } },

    /* F6 — 앞이 찢어진 골목 음식물 봉투. 김치, 달걀 껍데기, 생선 가시가 쏟아졌다 */
    'fly:tornBag': { w: 9, h: 6, d: (time, t) => {
      const bag = '#eef0e6';
      faded(.6, () => E(.5, -.05, 4.5, .3, t(BROTH)));
      E(0, -2.6, 4.2, 2.6, t(bag)); E(-.8, -3.9, 2.8, 2, t(bag));
      P([[-1.6, -5.6], [-2.4, -6.6], [-1.3, -6], [-.6, -6.8], [-.9, -5.5]], t(shade(bag)));
      faded(.3, () => E(-1.6, -3, 2.2, 1.6, t(BROTH)));
      L(-3.2, -2, -2.4, -4, t(shade(bag)), .08); L(2.6, -3.6, 3.4, -2.2, t(shade(bag)), .08);
      P([[-1.4, -.6], [-1, -2.2], [-.5, -1.7], [0, -3.1], [.5, -1.9], [1.1, -2.5], [1.4, -.6]], t('#5a4a3e'));
      P([[-.9, -.6], [-.2, -1.4], [.4, -.6]], t(SAUCE));
      ctx.save(); ctx.strokeStyle = t(RICE); ctx.lineWidth = .12; ctx.beginPath(); ctx.arc(1.8, -.3, .45, Math.PI, Math.PI * 1.9); ctx.stroke(); ctx.restore();
      L(2.6, -.15, 4, -.15, t('#e9e4ec'), .06);
      [2.9, 3.3, 3.7].forEach((x) => L(x, -.15, x - .15, -.45, t('#e9e4ec'), .04));
      E(-2.6, -.15, .3, .13, t(RICE));
    } },

    /* F6 — 봉투 찢어진 틈에 낳은 하얀 알 무더기 (알 하나 1mm) */
    'fly:eggCluster': { w: .8, h: .3, d: (time, t) => {
      for (let i = 0; i < 18; i++) {
        const x = (hash(i, 41) - .5) * .6, y = -.05 - hash(i, 42) * .2;
        ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i, 43) - .5) * 1.4);
        E(0, 0, .055, .022, t(RICE)); E(-.015, -.008, .02, .006, WHITE);
        ctx.restore();
      }
      glint(.15, -.3, .06, .5 + Math.sin(time * 2.5) * .5);
    } },

    /* F6 — 봉투를 킁킁대는 길고양이의 거대한 코와 수염 */
    'fly:catNose': { w: 8, h: 9, d: (time, t) => {
      const sniff = 1 + Math.sin(time * 9) * .03;
      ctx.save(); ctx.translate(1.6, -4.4); ctx.scale(sniff, sniff); ctx.translate(-1.6, 4.4);
      E(8, -4, 7.5, 5, t('#a3a9b5'));
      [6, 8, 10].forEach((x) => RR(x, -9.2, .5, 1.6, .25, t('#717887')));
      E(4.2, -3.2, 3.6, 2.6, t('#e3e6ec'));
      cuteEye(9.8, -7.2, 1.3, 1.1, time, t);
      E(1.7, -4.5, 1.1, .8, t('#ff9aa8'));
      E(1.25, -4.3, .2, .13, t(INK)); E(2.05, -4.25, .2, .13, t(INK));
      L(1.8, -3.7, 1.8, -3.1, t(INK), .07);
      ctx.restore();
      ctx.save(); ctx.strokeStyle = t('#f4f1ea'); ctx.lineWidth = .06; ctx.beginPath();
      [-.8, 0, .8].forEach((dy, i) => {
        const wig = Math.sin(time * 3 + i) * .3;
        ctx.moveTo(3.2, -3.4 + dy * .3); ctx.quadraticCurveTo(-1, -3.6 + dy, -4.5, -3.2 + dy * 1.6 + wig);
      });
      ctx.stroke(); ctx.restore();
      const ph = (time * 1.5) % 1;
      faded(.5 * (1 - ph), () => [-.2, .3].forEach((dy) => L(.4 - ph * 1.2, -4.4 + dy, -.2 - ph * 1.2, -4.4 + dy, WHITE, .06)));
    } },

    /* F7 — 내 몸보다 무거운 빗방울 (지름 0.4cm)이 쏟아지고, 땅에 왕관처럼 튄다 */
    'fly:raindrops': { w: 12, h: 14, d: (time, t) => {
      const water = t('#bfe0f5');
      faded(.45, () => { E(-3, -.04, 1.6, .1, water); E(3.5, -.04, 2, .12, water); });
      for (let i = 0; i < 8; i++) {
        const x = -6 + hash(i, 21) * 12, ph = (time * .9 + hash(i, 22)) % 1, y = -14 + ph * 14;
        faded(.35, () => L(x, y - 2.4, x, y - .6, WHITE, .05));
        faded(.9, () => drop(x, y, .2, water));
        if (ph > .88) {
          const s = (ph - .88) / .12;
          ctx.save(); ctx.strokeStyle = water; ctx.lineWidth = .06; ctx.globalAlpha = 1 - s;
          ctx.beginPath(); ctx.arc(x, 0, .2 + s * .5, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); ctx.restore();
        }
      }
    } },

    /* F7 — 숨어든 벤치 밑. 나무 판자 위로 비가 쏟아지고 가장자리로 물이 떨어진다 */
    'fly:benchUnderside': { w: 16, h: 10, d: (time, t) => {
      const wood = '#c98d5a', iron = '#5f5a6c';
      faded(.18, () => E(0, -.05, 7, .25, t(INK)));
      RR(-7.6, -8.6, 1, 8.6, .3, t(iron)); RR(6.6, -8.6, 1, 8.6, .3, t(iron));
      RR(-8, -8.8, 16, .5, .2, t(iron));
      RR(-8.6, -9.9, 17.2, 1.1, .4, t(shade(wood))); RR(-8.6, -10.2, 17.2, .7, .35, t(wood));
      [-5, -1, 3].forEach((x) => L(x, -10.1, x + 1.8, -10.1, t(shade(wood)), .06));
      [-8.4, 8.4].forEach((x, i) => {
        const ph = (time * 1.2 + i * .5) % 1;
        faded(1 - ph * .7, () => drop(x, -9 + ph * 9, .12, t('#bfe0f5')));
      });
    } },

    /* F8 — 벤치 밑에 떨어진 밥알 두 개, 참깨 한 톨, 단무지 부스러기 */
    'fly:riceGrains': { w: 2.5, h: .4, d: (time, t) => {
      [[-.6, -.15, -.2], [.1, -.14, .35]].forEach(([x, y, a]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        E(0, 0, .3, .15, t(RICE)); faded(.7, () => E(-.08, -.05, .12, .03, WHITE));
        ctx.restore();
      });
      E(.85, -.06, .1, .05, t('#f2e2b8'));
      RR(-1.2, -.12, .18, .12, .04, t('#ffd56b'));
      RR(.5, -.06, .14, .06, .03, t('#2f3a2f'));
    } },

    /* F8 — 김밥 한 조각을 집은 손. 단무지·당근·시금치·햄이 보이고, 밥알이 하나 떨어진다 */
    'fly:gimbapHand': { w: 9, h: 9, d: (time, t) => {
      const bob = Math.sin(time * 2) * .6, sway = Math.sin(time * 1.3) * .4, ph = (time * .6) % 1;
      faded(1 - ph, () => E(-1 + sway, -2 + ph * 4, .3, .15, t(RICE)));
      ctx.save(); ctx.translate(sway, -bob);
      E(0, -4, 2, 2, t('#2f3a2f')); E(0, -4, 1.72, 1.72, t(RICE));
      for (let i = 0; i < 10; i++) {
        const a = hash(i, 51) * TAU, r = 1.1 + hash(i, 52) * .5;
        E(Math.cos(a) * r, -4 + Math.sin(a) * r, .2, .1, t('#ece4d2'));
      }
      RR(-.35, -4.35, .7, .7, .12, t('#ffd56b'));
      RR(-1.05, -4.25, .55, .35, .1, t('#f2994a')); RR(.55, -4.3, .5, .4, .1, t('#ff9aa8'));
      RR(-.4, -5.1, .8, .4, .15, t('#5fa35a')); RR(-.35, -3.55, .7, .35, .1, t('#ffe08a'));
      RR(4.6, -6.4, 4.4, 4.2, 1.6, t('#f0c27a'));
      RR(1.6, -5.8, 3.6, 3, 1.2, t(SKIN));
      RR(1.1, -6.3, 1.8, 1, .5, t(SKIN)); RR(1.1, -3.2, 1.8, 1, .5, t(shade(SKIN)));
      ctx.restore();
    } },

    /* D7 — 위에서 내리치는 손바닥 */
    'fly:palmSlap': { w: 12, h: 12, d: (time, t) => {
      const d = (Math.sin(time * 5) + 1) * .6;
      faded(.2, () => E(0, 3 - d * .5, 5, .35, t(INK)));
      ctx.save(); ctx.translate(0, -d);
      faded(.5, () => [-5.5, -6.5, -7.5].forEach((y, i) => L(-6 + i, y, -2 + i, y, WHITE, .12)));
      RR(3, -10, 3.6, 8, 1.6, t('#f0c27a'));
      RR(-5, -3.2, 10, 3.2, 1.4, t(SKIN));
      [0, 1, 2].forEach((i) => RR(-9.2 + i * .3, -3 + i * 1, 4.8, 1.05, .5, t(i % 2 ? shade(SKIN) : SKIN)));
      RR(-3, -4.4, 3.2, 1.2, .6, t(shade(SKIN)));
      ctx.restore();
    } },

    /* F9 — 식탁 위 수박 한 조각 (폭 약 14cm). 씨가 박히고 단물이 식탁에 고였다 */
    'fly:watermelon': { w: 14, h: 8, d: (time, t) => {
      RR(-8.5, -.6, 17, .6, .2, t('#d9b38a'));
      const cy = -7.6;
      const half = (r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, cy, r, 0, Math.PI); ctx.closePath(); ctx.fill(); };
      half(7, t('#5f9e6a')); half(6.4, t('#e8f2d8')); half(5.9, t('#ff6f7f'));
      [[-3, -6.4], [-1, -5.2], [1.2, -6.2], [3.2, -5.5], [-1.8, -3.6], [.6, -3.8], [2.2, -4.2], [-.2, -6.8]].forEach(([x, y]) => {
        E(x, y, .14, .22, t('#2f2a3a')); E(x - .04, y - .07, .04, .06, WHITE);
      });
      faded(.4, () => RR(-5.5, -7.7, 11, .25, .12, WHITE));
      const ph = (time * .4) % 1;
      faded(1 - ph, () => drop(5.6, -2.2 + ph * 1.5, .12, t('#ff8a96')));
      faded(.6, () => E(5.8, -.62, 1, .1, t('#ff9aa8')));
    } },

    /* F9 — 싱크대 밑 음식물 통. 뚜껑이 들썩이고 수박 껍질과 바나나 껍질이 삐져나왔다 */
    'fly:wasteCaddy': { w: 9, h: 12, d: (time, t) => {
      const body = '#8fb8a8';
      RR(2.6, -16, 1, 6.4, .4, t('#c9c4cc')); RR(2.6, -10.4, 2.4, .8, .4, t('#c9c4cc'));
      RR(-4, -9, 8, 9, 1, t(shade(body))); RR(-4, -9, 6.8, 9, 1, t(body));
      RR(-3, -6, 5, 1.6, .4, t('#f4f1ea')); E(-.5, -5.2, .5, .3, t('#7fbf6a'));
      P([[-2.6, -9], [-1.4, -11.2], [-.4, -9]], t('#5f9e6a')); P([[-2.3, -9], [-1.4, -10.6], [-.8, -9]], t('#ff9aa8'));
      P([[.6, -9], [1.6, -10.4], [2.6, -9]], t('#ffd56b'));
      ctx.save(); ctx.translate(-4.2, -9); ctx.rotate(-.3 + Math.sin(time * 1.5) * .04);
      RR(0, -.8, 8.6, .8, .4, t('#6f9a8a')); RR(7.6, -1.3, .9, .6, .3, t('#6f9a8a'));
      ctx.restore();
      wisps([-1.5, 1.5], -11, 3, time, t('#d9c27a'), .35);
    } },

    /* F9 — 식탁 옆에 세워 둔 살충제 통. 띠지에 파리 그림이 X로 지워져 있다 */
    'fly:sprayIdle': { w: 6, h: 22, d: (time, t) => {
      RR(-2.6, -19, 5.2, 19, 1.2, t('#5f8fb0')); RR(1.2, -19, 1.4, 19, .7, t(shade('#5f8fb0')));
      RR(-2.6, -12.5, 5.2, 4.2, 0, t('#ffd56b'));
      miniFly(-.2, -10.3, 1.6, time, t, { sleep: true });
      L(-1.2, -11.8, 1, -9, t(SAUCE), .22); L(1, -11.8, -1.2, -9, t(SAUCE), .22);
      RR(-1.6, -21.6, 3.2, 2.6, .8, t('#e9e4ec')); RR(.8, -21.2, 1.4, .7, .3, t(INK));
      faded(.35, () => RR(-2, -18, .6, 16, .3, WHITE));
    } },

    /* F10 — 햇볕 드는 창틀. 빛줄기 속에 먼지가 떠다니고, 말라붙은 양념 자국이 남아 있다 */
    'fly:sunnySill': { w: 14, h: 14, d: (time, t) => {
      faded(.16 + Math.sin(time * .8) * .03, () => {
        P([[-11, -16], [-6, -16], [4, 0], [-1, 0]], '#fff3b8'); P([[-4, -16], [-2, -16], [8, 0], [6, 0]], '#fff3b8');
      });
      RR(-8, -.5, 16, .5, .2, t('#f4ead8'));
      faded(.4, () => P([[-1, -.5], [4, -.5], [4.3, 0], [-.7, 0]], '#fff3b8'));
      faded(.55, () => { E(-3, -.5, .7, .1, t('#c0503a')); E(-4.1, -.48, .2, .06, t('#c0503a')); });
      for (let i = 0; i < 7; i++) {
        const ph = (time * .08 + hash(i, 61)) % 1, x = -8 + hash(i, 62) * 10 + ph * 3, y = -2 - hash(i, 63) * 11 + Math.sin(time + i) * .4;
        faded(.7 * Math.sin(ph * Math.PI), () => E(x, y, .06, .06, WHITE));
      }
    } },

    /* F10 — 창틀에서 같이 볕을 쬐는 늙은 이웃 파리. 날개 끝이 해져 있고 꾸벅꾸벅 존다 */
    'fly:oldFriend': { w: 1.2, h: 1.4, d: (time, t) => {
      miniFly(0, -.42 + Math.sin(time * 1.2) * .02, 1, time, t, { frayed: true, old: true, sleep: true });
      ctx.save(); ctx.fillStyle = t(INK); ctx.font = '0.32px sans-serif';
      for (let i = 0; i < 2; i++) {
        const ph = (time * .4 + i * .5) % 1;
        ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.fillText('z', .35 + ph * .5, -.9 - ph * .9);
      }
      ctx.restore();
    } },

    /* F10·D11 — 닫힌 창문 유리. 바깥 나무와 하늘이 비치고, 부딪힌 자국이 점점이 남았다 */
    'fly:windowGlass': { w: 6, h: 16, d: (time, t) => {
      faded(.3, () => RR(-2.2, -16, 8.2, 15.4, 0, t('#bfe3f5')));
      faded(.22, () => { E(2, -5, 3, 2.4, t('#7fb08a')); E(3.5, -11, 3.5, 2, WHITE); });
      faded(.5 + Math.sin(time * .7) * .1, () => {
        P([[-1.6, -12], [-.6, -14], [2.4, -6], [1.4, -4]], WHITE); P([[2.8, -14.5], [3.3, -15.5], [5.2, -11], [4.7, -10]], WHITE);
      });
      [[0, -3.2], [.4, -3.6], [-.3, -4.1], [.8, -2.9]].forEach(([x, y]) => faded(.45, () => E(x, y, .07, .05, t('#8a8494'))));
      RR(-3, -16.4, .9, 16.4, .3, t('#d8d4de')); RR(-3, -.7, 9.6, .7, .3, t('#c9c4cc'));
    } },
  };
})());
