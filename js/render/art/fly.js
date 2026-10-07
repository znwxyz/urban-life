/* 똥파리 장면 전용 그림. 키는 'fly:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
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

  /** 김밥 한 조각의 단면 (반지름 r cm): 김 테두리와 윤기, 밥알 결, 가운데 속재료 */
  function gimbapSlice(r, t) {
    const GIM = '#26302a';
    E(r * .22, r * .12, r, r, t('#1c241f'));
    E(0, 0, r, r, t(GIM));
    ctx.save(); ctx.strokeStyle = t('#6f8a76'); ctx.globalAlpha = .55; ctx.lineWidth = r * .08; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 0, r * .93, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke(); ctx.restore();
    E(0, 0, r * .86, r * .86, t(RICE)); E(r * .1, r * .1, r * .74, r * .74, t('#f1ead9'));
    for (let i = 0; i < 16; i++) {
      const a = hash(i, 51) * TAU, rr = r * (.58 + hash(i, 52) * .24);
      ctx.save(); ctx.translate(Math.cos(a) * rr, Math.sin(a) * rr); ctx.rotate(a + hash(i, 53));
      E(0, 0, r * .11, r * .055, t(i % 3 ? '#e4dac4' : WHITE)); ctx.restore();
    }
    const f = r * .19;
    RR(-f * 1.4, -f * 2.3, f * 2.8, f * .95, f * .3, t('#ffe08a')); RR(-f * 1.4, -f * 2.3, f * 2.8, f * .35, f * .2, t('#fff3b8'));
    RR(-f * 2.5, -f * 1.2, f * 1, f * 2.3, f * .4, t('#4f9a4a')); RR(-f * 2.3, -f * .9, f * .4, f * 1.4, f * .2, t('#7fc070'));
    RR(-f * .9, -f * .9, f * 1.8, f * 1.8, f * .25, t('#ffd23a')); E(-f * .4, -f * .45, f * .35, f * .2, t('#fff6c0'));
    RR(f * 1.1, -f * 1.1, f * 1.3, f * 1.9, f * .25, t('#ff9aa8')); L(f * 1.25, -f * .4, f * 2.25, -f * .4, t('#ffc4cc'), f * .2);
    RR(-f * 1.5, f * 1.1, f * 1.3, f * .7, f * .3, t('#f2884a')); RR(-f * .1, f * 1.15, f * 1.2, f * .65, f * .3, t('#f29a5a'));
    RR(f * 1.2, f * 1.0, f * .45, f * 1.1, f * .2, t('#8a5a3a'));
    [[-.62, -.5], [.55, -.62], [.7, .45]].forEach(([x, y]) => E(x * r * 1.02, y * r * 1.02, r * .06, r * .035, t('#f4e3b8')));
    glint(-r * .45, -r * .5, r * .16, .8);
  }

  /** 휘두르는 손끝 뒤로 남는 바람결 호 */
  function shooLines(wx, wy, rot, vel, t) {
    const dir = vel > 0 ? -1 : 1, a0 = Math.PI + rot;
    ctx.save(); ctx.strokeStyle = t(WHITE); ctx.lineCap = 'round'; ctx.globalAlpha = .55 * Math.abs(vel);
    [9.6, 10.8, 12].forEach((r, i) => {
      ctx.lineWidth = .16 - i * .03; ctx.beginPath();
      ctx.arc(wx, wy, r, Math.min(a0, a0 + dir * (.32 - i * .06)), Math.max(a0, a0 + dir * (.32 - i * .06))); ctx.stroke();
    });
    ctx.restore();
  }

  return {
    /* F1 — 내가 찢고 나온 번데기 껍질. 뚜껑이 톡 떨어져 있다 */
    'fly:pupaCase': { w: 1.3, h: .4, d: (time, t) => {
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
    'fly:sourPuddle': { w: 8, h: 3.5, d: (time, t) => {
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

    /* F2 — 반코팅 작업 장갑이 들어 올리는 음식물 통 뚜껑. 테두리 아래로 국물이 뚝뚝 */
    'fly:liftedLid': { w: 14.5, h: 12, d: (time, t) => {
      const lid = '#f2b33d', lift = Math.sin(time * 1.1) * .3;
      ctx.save(); ctx.translate(-1.5, -2.2 - lift); ctx.rotate(-.16 + Math.sin(time * .7) * .03);
      for (let i = 0; i < 3; i++) {
        const ph = (time * .7 + i * .33) % 1;
        faded(1 - ph, () => drop(-4 + i * 2.6, .5 + ph * 3.4, .14, t(BROTH)));
      }
      faded(.85, () => { [-3.6, -1, 1.8].forEach((x, i) => E(x, .28, .22 + i * .04, .3, t(BROTH))); });
      ctx.fillStyle = t(shade(lid)); ctx.beginPath(); ctx.moveTo(-5.2, .4); ctx.lineTo(5.2, .4); ctx.lineTo(4.9, -1.2);
      ctx.quadraticCurveTo(0, -2.6, -4.9, -1.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(lid); ctx.beginPath(); ctx.moveTo(-5.2, -.1); ctx.lineTo(5.2, -.1); ctx.lineTo(4.9, -1.4);
      ctx.quadraticCurveTo(0, -2.8, -4.9, -1.4); ctx.closePath(); ctx.fill();
      RR(-5.4, -.35, 10.8, .65, .3, t(shade(lid))); RR(-5.4, -.4, 10.8, .3, .15, t(mix(lid, '#ffffff', .25)));
      [-3.2, -1.6, 1.6, 3.2].forEach((x) => L(x, -2 + Math.abs(x) * .14, x * 1.04, -.5, t(shade(lid)), .09));
      RR(-1.3, -2.75, 2.6, .8, .35, t('#d99a2b')); RR(-1, -2.65, 2, .3, .15, t(mix(lid, '#ffffff', .3)));
      faded(.45, () => E(-2.6, -1.45, 1.6, .16, WHITE));
      artHandAt(t, 4.6, -1.9, 2.15, 7.4, { pose: 'flat', curl: .42, spread: .55, skin: '#f4f1ea', coat: '#e6765f', nails: false, sleeve: '#4a5d7a' });
      ctx.restore();
    } },

    /* F2 — 수거차 꽁무니 모서리: 깜빡이는 후진등, 삐 삐 소리, 범퍼에서 흐르는 국물 */
    'fly:reverseLight': { w: 33, h: 31, d: (time, t) => {
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
    'fly:ventDrip': { w: 8.5, h: 9, d: (time, t) => {
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
    'fly:eavesWeb': { w: 14.5, h: 13.5, d: (time, t) => {
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
    'fly:windowFrame': { w: 16.5, h: 16, d: (time, t) => {
      RR(-6, -.8, 12, .8, .3, t('#c9c4cc')); L(-6, -.4, 6, -.4, t('#a29fb2'), .08);
      faded(.6, () => { E(-3, -.85, .6, .12, t('#c0503a')); E(-2.2, -.82, .2, .07, t('#c0503a')); });
      faded(.35, () => RR(3, -15, 5, 14.2, 0, t('#bfe3f5')));
      faded(.5, () => { P([[3.4, -10], [4.4, -12], [5.4, -6], [4.4, -4]], WHITE); P([[5.8, -13], [6.3, -14], [7.2, -9], [6.7, -8]], WHITE); });
      RR(2, -15.2, 1, 14.4, .3, t('#d8d4de')); RR(2.65, -15.2, .35, 14.4, .15, t(shade('#d8d4de')));
    } },

    /* F4 — 조리대 위 떡볶이 접시: 윤기 도는 떡, 어묵, 삶은 달걀 반쪽, 파, 깨. 접시 가장자리에 소스 방울 */
    'fly:tteokbokki': { w: 9, h: 5, d: (time, t) => {
      const plate = '#fbfaf6';
      E(0, -.32, 4.3, .5, t(shade(plate))); E(0, -.55, 4.1, .6, t(plate)); E(0, -.62, 3.5, .44, t(shade(plate)));
      E(0, -.66, 3.3, .38, t('#c8402a')); E(-.2, -.72, 3, .3, t(SAUCE));
      P([[1.2, -.9], [2.5, -1.75], [2.9, -.85]], t('#e8b878')); L(1.5, -.95, 2.55, -1.55, t('#f4d6a0'), .06);
      P([[-2.9, -.85], [-2.2, -1.6], [-1.6, -.9]], t('#e1aa6c'));
      const cake = (x, y, a) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        RR(-.75, -.27, 1.5, .54, .27, t('#e0503a')); RR(-.72, -.27, 1.44, .3, .15, t('#ff7a5c'));
        E(.72, 0, .17, .26, t('#f6e2d0')); faded(.8, () => E(-.25, -.18, .3, .045, WHITE));
        ctx.restore();
      };
      [[-1.9, -.95, .1], [-.5, -1.02, -.15], [.9, -.98, .2], [-1.2, -1.4, -.3], [.25, -1.5, .1], [1.6, -1.35, -.1]].forEach(([x, y, a]) => cake(x, y, a));
      E(-.2, -1.9, .5, .38, t(WHITE)); E(-.12, -1.92, .26, .22, t('#ffc93a')); E(-.24, -2.02, .08, .05, t('#fff2b0'));
      [[-2.4, -.9], [.4, -1.15], [1.9, -1.0], [-.9, -1.75]].forEach(([x, y]) => { E(x, y, .17, .11, t('#5fa35a')); E(x, y, .08, .05, t('#d8f0b8')); });
      [[-1.5, -1.1], [.9, -1.35], [-.3, -1.3], [1.3, -.85]].forEach(([x, y]) => E(x, y, .05, .03, t('#fff3d8')));
      E(3.9, -.4, .13, .17, t('#c8402a')); E(3.86, -.45, .04, .05, WHITE);
      faded(.5, () => E(-2.6, -.85, .9, .08, WHITE));
      wisps([-1.5, .5, 2], -2.2, 2.6, time, WHITE, .35);
    } },

    /* D12 — 가스레인지 위 찌개 냄비: 보글보글 끓는 빨간 국물, 두부와 파, 푸른 불꽃, 뜨거운 김 */
    'fly:stewPot': { w: 24.5, h: 21, d: (time, t) => {
      const pot = '#a8adb8';
      RR(-10, -.6, 20, .6, .3, t('#3a3445'));
      for (let x = -6; x <= 6; x += 2) {
        const h = 1 + Math.sin(time * 12 + x) * .25;
        faded(.85, () => { ctx.fillStyle = '#6fb7ff'; ctx.beginPath(); ctx.moveTo(x - .5, -.6); ctx.quadraticCurveTo(x - .4, -h * .7, x, -h - .6); ctx.quadraticCurveTo(x + .4, -h * .7, x + .5, -.6); ctx.fill(); });
        faded(.9, () => E(x, -.9, .18, .3, '#d8efff'));
      }
      ctx.save(); ctx.translate(0, -1.6);
      [-1, 1].forEach((d) => {
        ctx.strokeStyle = t('#3a3445'); ctx.lineWidth = .8; ctx.lineCap = 'round'; ctx.beginPath();
        ctx.moveTo(d * 9, -8.6); ctx.quadraticCurveTo(d * 11.6, -8.8, d * 11.4, -7); ctx.quadraticCurveTo(d * 11, -6.4, d * 9, -6.8); ctx.stroke();
      });
      ctx.fillStyle = t(shade(pot)); ctx.beginPath(); ctx.moveTo(-9, -9.4); ctx.lineTo(9, -9.4); ctx.lineTo(8.6, -1.6); ctx.quadraticCurveTo(8.4, -.6, 7, -.6); ctx.lineTo(-7, -.6); ctx.quadraticCurveTo(-8.4, -.6, -8.6, -1.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(pot); ctx.beginPath(); ctx.moveTo(-9, -9.4); ctx.lineTo(5, -9.4); ctx.lineTo(4.6, -.6); ctx.lineTo(-7, -.6); ctx.quadraticCurveTo(-8.4, -.6, -8.6, -1.6); ctx.closePath(); ctx.fill();
      faded(.5, () => { RR(-7.8, -8.6, .9, 7.2, .45, WHITE); RR(-6.4, -8.6, .35, 7.2, .2, WHITE); });
      E(0, -9.6, 9.4, 1.3, t('#cfd3db')); E(0, -9.6, 8.8, 1, t('#c8402a')); E(-.6, -9.7, 7.6, .7, t('#e2683a'));
      [[-4, -9.8], [1.5, -9.6], [4.5, -9.9]].forEach(([x, y]) => { RR(x - .7, y - .55, 1.4, .9, .15, t(shade('#fbf7ee'))); RR(x - .7, y - .6, 1.2, .7, .15, t('#fbf7ee')); });
      [[-2, -9.5], [3, -10], [-6, -9.6]].forEach(([x, y]) => { E(x, y, .32, .2, t('#5fa35a')); E(x, y, .14, .09, t('#d8f0b8')); });
      for (let i = 0; i < 4; i++) {
        const ph = (time * .8 + hash(i, 9)) % 1, x = -6 + i * 4, r = .15 + ph * .45;
        faded(1 - ph, () => { E(x, -9.7 - r * .4, r, r * .6, t('#ff9a7a')); E(x - r * .3, -9.8 - r * .7, r * .3, r * .2, WHITE); });
      }
      wisps([-5, -1.5, 2, 5.5], -10.6, 8, time, WHITE, .4);
      ctx.restore();
      [-8, 8].forEach((x) => RR(x - .3, -2.2, .6, 1.6, .2, t('#3a3445')));
    } },

    /* F5 — 천장에서 내려온 꿀 냄새 끈끈이 리본의 끝자락. 먼저 붙은 친구들이 발버둥 친다 */
    'fly:honeyRibbon': { w: 5.5, h: 24.5, d: (time, t) => {
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
    'fly:zapperGlow': { w: 15.5, h: 10, d: (time, t) => {
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
    'fly:friedCrumbs': { w: 4, h: .5, d: (time, t) => {
      for (let i = 0; i < 6; i++) {
        const x = -1.8 + hash(i, 31) * 3.6, r = .14 + hash(i, 32) * .2;
        P([[x - r, 0], [x - r * .6, -r * 1.1], [x + r * .3, -r * 1.4], [x + r, -r * .5], [x + r * .8, 0]], t('#d99a3e'));
        E(x, -r * .8, r * .5, r * .35, t('#f2c46a'));
        faded(.5, () => E(x - r * .2, -r, r * .2, r * .1, WHITE));
      }
    } },

    /* F6 — 앞이 찢어진 골목 음식물 봉투. 묶은 귀가 쫑긋하고, 찢긴 틈으로 김치·달걀 껍데기·생선 가시가 쏟아졌다 */
    'fly:tornBag': { w: 12.5, h: 9, d: (time, t) => {
      const bag = '#eef0e6', fold = t(shade(bag));
      faded(.6, () => E(.6, -.06, 5.4, .32, t(BROTH)));
      ctx.fillStyle = fold; ctx.beginPath(); ctx.moveTo(-4.4, 0);
      ctx.bezierCurveTo(-5.4, -2.4, -4.6, -5.6, -2, -6.4); ctx.quadraticCurveTo(0, -7, 1.8, -6.2);
      ctx.bezierCurveTo(4.6, -5.4, 5.2, -2.4, 4.6, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(bag); ctx.beginPath(); ctx.moveTo(-4.4, -.2);
      ctx.bezierCurveTo(-5.2, -2.4, -4.4, -5.5, -2, -6.3); ctx.quadraticCurveTo(0, -6.9, 1.6, -6.2);
      ctx.bezierCurveTo(3.6, -5.4, 3.6, -2.6, 3, -.2); ctx.closePath(); ctx.fill();
      P([[-.8, -6.4], [-1.9, -8.4], [-1, -8], [-.2, -6.6]], fold); P([[-.2, -6.5], [.7, -8.6], [1.3, -8], [.4, -6.4]], t(bag));
      E(-.4, -6.5, .55, .32, fold);
      faded(.12, () => E(-1.2, -2.4, 2.2, 1.6, t(BROTH)));
      faded(.7, () => { E(-3, -4.2, .35, 1.3, WHITE); E(2.4, -4.6, .2, .7, WHITE); });
      ctx.strokeStyle = fold; ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(-3.4, -2); ctx.quadraticCurveTo(-2.6, -3.2, -2.9, -4.6); ctx.moveTo(1.2, -5.6); ctx.quadraticCurveTo(2.2, -4, 1.8, -2.6);
      ctx.moveTo(-1, -5.4); ctx.lineTo(-.4, -4.4); ctx.stroke();
      ctx.fillStyle = t('#8a7462'); ctx.beginPath(); ctx.moveTo(-1.6, -.1); ctx.lineTo(-1.2, -1.8); ctx.lineTo(-.7, -1.3); ctx.lineTo(-.2, -2.9);
      ctx.lineTo(.4, -1.7); ctx.lineTo(1, -2.4); ctx.lineTo(1.5, -1.1); ctx.lineTo(1.9, -.1); ctx.closePath(); ctx.fill();
      [[-1.1, -.55, .3], [.2, -.9, -.4], [1.1, -.5, .8]].forEach(([x, y, a]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        ctx.fillStyle = t(SAUCE); ctx.beginPath(); ctx.moveTo(-.7, .2); ctx.quadraticCurveTo(-.6, -.45, 0, -.3);
        ctx.quadraticCurveTo(.5, -.55, .75, .15); ctx.quadraticCurveTo(0, .02, -.7, .2); ctx.fill();
        L(-.5, .08, .55, -.05, t('#f7e2c0'), .12); faded(.5, () => E(-.2, -.25, .2, .05, WHITE));
        ctx.restore();
      });
      ctx.save(); ctx.translate(2.6, -.35); ctx.rotate(-.3);
      ctx.fillStyle = t('#f6efe2'); ctx.beginPath(); ctx.arc(0, 0, .55, Math.PI, 0); ctx.lineTo(.3, -.1); ctx.lineTo(.1, .05); ctx.lineTo(-.2, -.12); ctx.closePath(); ctx.fill();
      E(0, -.1, .38, .2, t('#e8d4b0')); ctx.restore();
      L(3.4, -.12, 5.4, -.16, t('#e9e4ec'), .07);
      [3.8, 4.25, 4.7, 5.1].forEach((x, i) => { L(x, -.14, x - .2, -.55 + i * .05, t('#e9e4ec'), .04); L(x, -.14, x - .2, .22, t('#e9e4ec'), .04); });
      P([[5.4, -.16], [5.9, -.5], [5.9, .2]], t('#d8d4de'));
      E(-3, -.15, .3, .13, t(RICE)); E(-2.4, -.1, .22, .1, t(RICE));
      wisps([-.4, 1.2], -2.8, 2.4, time, t('#d9c27a'), .3);
    } },

    /* F6 — 봉투 찢어진 틈에 낳은 하얀 알 무더기 (알 하나 1mm) */
    'fly:eggCluster': { w: .7, h: .5, d: (time, t) => {
      for (let i = 0; i < 18; i++) {
        const x = (hash(i, 41) - .5) * .6, y = -.05 - hash(i, 42) * .2;
        ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i, 43) - .5) * 1.4);
        E(0, 0, .055, .022, t(RICE)); E(-.015, -.008, .02, .006, WHITE);
        ctx.restore();
      }
      glint(.15, -.3, .06, .5 + Math.sin(time * 2.5) * .5);
    } },

    /* F6 — 봉투를 킁킁대는 길고양이. 파리 눈높이에선 옆얼굴 하나가 언덕만 하다 */
    'fly:catNose': { w: 42, h: 16.5, d: (time, t) => {
      const fur = '#a3a9b5', sniff = Math.sin(time * 9) * .05, ear = Math.sin(time * 1.3) > .96 ? .12 : 0;
      ctx.save(); ctx.translate(4, -1);
      P([[3.2, -9.5], [5.6, -14.4 - ear * 4], [8.4, -9.2]], t(shade(fur)));
      P([[4.2, -9.7], [5.7, -12.9 - ear * 4], [7.4, -9.6]], t('#f2b6c0'));
      ctx.fillStyle = t(shade(fur)); ctx.beginPath(); ctx.moveTo(17, 2.6); ctx.bezierCurveTo(15, -4, 12, -8, 9.6, -9.6);
      ctx.bezierCurveTo(7.6, -11.2, 2.5, -11.4, -.2, -9.3); ctx.bezierCurveTo(-2.4, -7.6, -4.6, -6.6, -5.6, -5.2);
      ctx.quadraticCurveTo(-6.1, -3.8, -5, -3.2); ctx.quadraticCurveTo(-3.6, -1.6, -1, -1.4); ctx.quadraticCurveTo(3, -.6, 5, 0); ctx.quadraticCurveTo(6.4, 1, 6.6, 2.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(fur); ctx.beginPath(); ctx.moveTo(16, 2.6); ctx.bezierCurveTo(14.4, -4, 11.6, -8, 9.4, -9.8);
      ctx.bezierCurveTo(7.6, -11.4, 2.5, -11.6, -.2, -9.5); ctx.bezierCurveTo(-2.4, -7.8, -4.6, -6.8, -5.4, -5.4);
      ctx.quadraticCurveTo(-4, -4.6, -1.6, -4.4); ctx.quadraticCurveTo(4, -3.6, 8, -2); ctx.quadraticCurveTo(10.6, -.4, 11.4, 2.6); ctx.closePath(); ctx.fill();
      [[9.4, -6.6], [10.2, -4.6], [8.6, -3.6]].forEach(([x, y]) => L(x, y, x + 1.4, y + .5, t(shade(fur)), .28));
      [1.5, 3.2, 4.9].forEach((x, i) => L(x, -10.7 + i * .15, x + .8, -9.1, t(shade(fur)), .32));
      faded(.4, () => E(2, -9.6, 2.6, .5, t(mix(fur, '#ffffff', .5))));
      ctx.fillStyle = t('#eef0f4'); ctx.beginPath(); ctx.moveTo(-5.4, -5.4); ctx.quadraticCurveTo(-4.4, -3, -1.4, -2.2);
      ctx.quadraticCurveTo(1.6, -2, 2.4, -3.9); ctx.quadraticCurveTo(-1.4, -4.2, -5.4, -5.4); ctx.fill();
      E(-2, -4.9, 1.5, .95, t('#f4f5f8'));
      [[-2.6, -4.9], [-1.5, -4.5], [-.4, -4.9], [-2, -5.6], [-.8, -5.5]].forEach(([x, y]) => E(x, y, .1, .1, t('#8d93a3')));
      ctx.save(); ctx.translate(-5.4, -5.6); ctx.scale(1.5 + sniff, 1.5 + sniff);
      P([[0, -.5], [.9, -.9], [.9, .4], [-.2, .3]], t('#ff9aa8')); E(.15, -.1, .22, .14, t(INK)); E(.55, -.6, .3, .1, t('#ffd0d8'));
      ctx.restore();
      L(-4.8, -4.3, -4.1, -3.4, t(INK), .12);
      ctx.fillStyle = t(INK); ctx.beginPath(); ctx.moveTo(.6, -7.6); ctx.quadraticCurveTo(2, -8.9, 3.4, -7.8); ctx.quadraticCurveTo(2, -7.2, .6, -7.6); ctx.fill();
      E(2.3, -8, .25, .2, t('#c8f08a'));
      ctx.strokeStyle = t('#f4f1ea'); ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.beginPath();
      [-.7, 0, .7].forEach((dy, i) => {
        const wig = Math.sin(time * 3 + i) * .35;
        ctx.moveTo(-1.6, -4.9 + dy * .4); ctx.quadraticCurveTo(-6, -5.5 + dy, -10.5, -4.6 + dy * 1.8 + wig);
      });
      ctx.stroke();
      ctx.restore();
      const ph = (time * 1.5) % 1;
      faded(.6 * (1 - ph), () => [-.3, .3].forEach((dy) => L(-1.8 - ph * 1.6, -4.6 + dy, -2.8 - ph * 1.6, -4.6 + dy * 1.4, t(WHITE), .08)));
    } },

    /* F7 — 내 몸보다 무거운 빗방울 (지름 0.4cm)이 쏟아지고, 땅에 왕관처럼 튄다 */
    'fly:raindrops': { w: 13, h: 16.5, d: (time, t) => {
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
    'fly:benchUnderside': { w: 18, h: 10.5, d: (time, t) => {
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

    /* F8 — 김밥 한 조각을 엄지와 검지로 집은 손. 훠이훠이 파리를 쫓느라 손목째 흔들리고, 밥알이 하나 떨어진다 */
    'fly:gimbapHand': { w: 21, h: 17, d: (time, t) => {
      // Twemoji ✍️ 손(js/render/hands-twemoji.js)이 젓가락으로 김밥 한 조각을 집고 훠이훠이 흔든다. 원본 1단위 = .4cm
      const K = .4, rot = Math.sin(time * 3.2) * .14, vel = Math.cos(time * 3.2), ph = (time * .6) % 1;
      faded((1 - ph) * .9, () => E(-5 + ph * .6, -1.6 + ph * 1.8, .32, .16, t(RICE)));
      shooLines(4, -9, rot, vel, t);
      const stick = (x1, y1, x2, y2) => { ctx.strokeStyle = t('#c98a4c'); ctx.lineWidth = .9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
      const sticks = () => { stick(31.2, .6, 1.4, 34.4); stick(33.6, 3, 2.4, 35); };
      ctx.save(); ctx.translate(3, -8); ctx.scale(K, K); ctx.translate(-18, -22);
      ctx.translate(35, 23); ctx.rotate(rot); ctx.translate(-35, -23);
      drawWriteHand(t, sticks);
      ctx.save(); ctx.translate(-.6, 37.4); ctx.scale(1 / K, 1 / K); gimbapSlice(1.9, t); ctx.restore();
      ctx.restore();
    } },

    /* D7 — 위에서 내리치는 손바닥. 파리 눈높이에선 손바닥과 손금이 하늘을 덮는다 */
    'fly:palmSlap': { w: 22.5, h: 13.5, d: (time, t) => {
      const d = (Math.sin(time * 5) + 1) * .6;
      faded(.12 + d * .08, () => E(-1, 3, 7 - d * 1.2, .45, t(INK)));
      faded(.45, () => [-6, -2, 2].forEach((x, i) => L(x, -11.5 - d + i * .4, x + .3, -9.3 - d + i * .4, WHITE, .14)));
      ctx.save(); ctx.translate(3.6, -5.2 - d); ctx.rotate(.1); ctx.scale(-1, .68);
      artHand(t, { pose: 'flat', palm: true, s: 14, spread: 1.25, curl: .03, sleeve: '#e6a35a' });
      ctx.restore();
    } },

    /* F9 — 식탁 위 수박 한 조각 (폭 약 14cm). 씨가 박히고 단물이 식탁에 고였다 */
    'fly:watermelon': { w: 17.5, h: 8, d: (time, t) => {
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

    /* F9 — 싱크대 밑 음식물 통. 뚜껑이 들썩이고, 수박 껍질과 바나나 껍질이 삐져나왔다 */
    'fly:wasteCaddy': { w: 10, h: 14.5, d: (time, t) => {
      const body = '#8fb8a8', lidC = '#6f9a8a', bob = Math.sin(time * 1.5) * .04;
      faded(.2, () => E(0, -.05, 4.8, .3, t(INK)));
      ctx.fillStyle = t(shade(body)); ctx.beginPath(); ctx.moveTo(-4, -9); ctx.lineTo(4, -9); ctx.lineTo(3.5, -.4);
      ctx.quadraticCurveTo(3.4, 0, 3, 0); ctx.lineTo(-3, 0); ctx.quadraticCurveTo(-3.4, 0, -3.5, -.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = t(body); ctx.beginPath(); ctx.moveTo(-4, -9); ctx.lineTo(2.4, -9); ctx.lineTo(2.1, 0); ctx.lineTo(-3, 0);
      ctx.quadraticCurveTo(-3.4, 0, -3.5, -.4); ctx.closePath(); ctx.fill();
      faded(.35, () => P([[-3.5, -8.6], [-2.9, -8.6], [-2.5, -.6], [-3.1, -.6]], WHITE));
      RR(-2.6, -6.2, 4.2, 2.2, .4, t('#f4f1ea')); E(-1.9, -5.1, .5, .5, t('#7fbf6a'));
      [-1.1, -.5].forEach((x, i) => L(x, -5.6 + i * .4, x + 2.2, -5.6 + i * .4, t('#b9b4c2'), .14));
      RR(-4.2, -9.4, 8.4, .6, .3, t(shade(lidC)));
      ctx.save(); ctx.translate(-4.1, -9.4); ctx.beginPath(); ctx.rect(-1, -6, 10, 6); ctx.clip();
      ctx.save(); ctx.translate(2.8, 0); ctx.rotate(-.35);
      ctx.fillStyle = t('#5f9e6a'); ctx.beginPath(); ctx.arc(0, 0, 2.2, Math.PI, 0); ctx.fill();
      ctx.fillStyle = t('#e8f2d8'); ctx.beginPath(); ctx.arc(0, 0, 1.9, Math.PI, 0); ctx.fill();
      ctx.fillStyle = t('#ff8f9a'); ctx.beginPath(); ctx.arc(0, 0, 1.6, Math.PI, 0); ctx.fill();
      [[-.7, -.7], [.4, -1], [.9, -.4]].forEach(([x, y]) => E(x, y, .08, .13, t('#2f2a3a')));
      ctx.restore(); ctx.restore();
      ctx.save(); ctx.translate(3.2, -9.3);
      ctx.strokeStyle = t('#ffd56b'); ctx.lineWidth = .55; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(-1.2, 0); ctx.quadraticCurveTo(-.4, -1.6, .2, -1.4); ctx.moveTo(-.6, 0); ctx.quadraticCurveTo(.6, -.9, 1.2, 1.4); ctx.stroke();
      E(1.2, 1.6, .22, .3, t('#6b4f3a')); E(.25, -1.4, .2, .18, t('#6b4f3a'));
      ctx.restore();
      ctx.save(); ctx.translate(-4.4, -9.4); ctx.rotate(-.3 + bob);
      RR(0, -.85, 8.8, .85, .4, t(shade(lidC))); RR(0, -.95, 8.8, .6, .3, t(lidC));
      RR(7.6, -1.5, 1.2, .7, .3, t(lidC)); faded(.4, () => RR(.6, -.85, 6, .16, .08, WHITE));
      ctx.restore();
      wisps([-1.5, 1.5], -11, 3, time, t('#d9c27a'), .35);
    } },

    /* F9 — 식탁 옆에 세워 둔 살충제 통. 띠지에 파리 그림이 X로 지워져 있다 */
    'fly:sprayIdle': { w: 5.5, h: 22.5, d: (time, t) => {
      RR(-2.6, -19, 5.2, 19, 1.2, t('#5f8fb0')); RR(1.2, -19, 1.4, 19, .7, t(shade('#5f8fb0')));
      RR(-2.6, -12.5, 5.2, 4.2, 0, t('#ffd56b'));
      miniFly(-.2, -10.3, 1.6, time, t, { sleep: true });
      L(-1.2, -11.8, 1, -9, t(SAUCE), .22); L(1, -11.8, -1.2, -9, t(SAUCE), .22);
      RR(-1.6, -21.6, 3.2, 2.6, .8, t('#e9e4ec')); RR(.8, -21.2, 1.4, .7, .3, t(INK));
      faded(.35, () => RR(-2, -18, .6, 16, .3, WHITE));
    } },

    /* F10 — 햇볕 드는 창틀. 빛줄기 속에 먼지가 떠다니고, 말라붙은 양념 자국이 남아 있다 */
    'fly:sunnySill': { w: 22.5, h: 16.5, d: (time, t) => {
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
    'fly:oldFriend': { w: 1.9, h: 1.9, d: (time, t) => {
      miniFly(0, -.42 + Math.sin(time * 1.2) * .02, 1, time, t, { frayed: true, old: true, sleep: true });
      ctx.save(); ctx.fillStyle = t(INK); ctx.font = '0.32px sans-serif';
      for (let i = 0; i < 2; i++) {
        const ph = (time * .4 + i * .5) % 1;
        ctx.globalAlpha = Math.sin(ph * Math.PI); ctx.fillText('z', .35 + ph * .5, -.9 - ph * .9);
      }
      ctx.restore();
    } },

    /* F10·D11 — 닫힌 창문 유리. 바깥 나무와 하늘이 비치고, 부딪힌 자국이 점점이 남았다 */
    'fly:windowGlass': { w: 14.5, h: 17, d: (time, t) => {
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
