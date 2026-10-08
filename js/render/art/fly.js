/* 똥파리 장면 전용 그림. 키는 'fly:이름'. 원점은 발밑 가운데, cm 좌표, 오른쪽을 본다. d(시간, 색조함수)
   파리 눈높이(화면 폭 약 36cm)에 맞춰 실제 크기로 그린다: 번데기 껍질 0.6cm, 빗방울 0.4cm, 밥알 0.6cm, 알 1mm
   사물은 곡선 외곽 하나로 오리고, 왼쪽 위에서 오는 빛으로 윗면·왼쪽(밝음)·앞면·오른쪽(그늘) 2~3톤만 나눈다 */
(function register(art) {
  if (typeof module !== 'undefined' && module.exports) module.exports = Object.keys(art);
  else Object.assign(ACTORS, art);
})((() => {
  const FLY_BODY = '#4a4258', FLY_EYE = '#ff6b7a', WING = '#eaf4ff';
  const HONEY = '#f2a23a', BROTH = '#d9a84a', SAUCE = '#e0503a', RICE = '#fbf7ee';
  const LIT_TO = '#fffaf0', LIT_AMOUNT = .24;

  /** 한 색에서 나온 면 톤: 윗면·왼쪽(lit) · 앞면(mid) · 오른쪽 옆면(dark) · 안쪽 그늘(deep) */
  function tone(t, c) { return { lit: t(mix(c, LIT_TO, LIT_AMOUNT)), mid: t(c), dark: t(shade(c)), deep: t(shade(shade(c))) }; }

  /** curvy 형식의 패스를 칠하지 않고 그리기만 한다 */
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

  /** 외곽(pts) 안쪽에만 draw()가 칠해지게 한다 */
  function within(pts, draw) { ctx.save(); trace(pts); ctx.clip(); draw(); ctx.restore(); }

  /** 실루엣을 앞면 톤으로 오리고, 안을 그늘 면(dark)·볕 면(lit)으로 나눈다 */
  function form(pts, p, dark, lit) {
    curvy(pts, p.mid);
    within(pts, () => { if (dark) curvy(dark, p.dark); if (lit) curvy(lit, p.lit); });
  }

  /** 실루엣의 왼쪽 위 테두리만 볕으로 남긴다 (윗면이 빛을 받는 둥근 물건). dark는 그 위에 얹는 그늘 면 */
  function rim(pts, p, dx, dy, dark) {
    curvy(pts, p.lit);
    within(pts, () => { ctx.save(); ctx.translate(dx, dy); curvy(pts, p.mid); ctx.restore(); if (dark) curvy(dark, p.dark); });
  }

  /** 모서리가 둥근 사각 외곽 (curvy 형식) */
  function roundBox(x, y, w, h, r) {
    return [[x + r, y], [x + w - r, y], [x + w, y, x + w, y + r], [x + w, y + h - r], [x + w, y + h, x + w - r, y + h], [x + r, y + h], [x, y + h, x, y + h - r], [x, y + r], [x, y, x + r, y]];
  }

  /** 바위만 한 부스러기 하나: 울퉁불퉁한 윗변, 볕 받는 왼쪽 위, 그늘진 오른쪽 */
  function crumb(x, r, i, t, c) {
    const pts = [];
    for (let k = 0; k <= 6; k++) {
      const a = Math.PI + k / 6 * Math.PI, rr = r * (.78 + hash(i * 7 + k, 13) * .42);
      pts.push([x + Math.cos(a) * rr * 1.15, Math.min(0, Math.sin(a) * rr)]);
    }
    form(pts, tone(t, c), [[x + r * .2, .1], [x + r * .4, -r * 2], [x + r * 2, -r * 2], [x + r * 2, .1]],
      [[x - r * 1.6, -r * .45], [x - r * .2, -r * 1.5], [x + r * .2, -r * 2], [x - r * 1.6, -r * 2]]);
  }

  /** 밥알 하나: 양끝이 갸름한 낟알, 아래쪽 그늘과 윤기 한 점 */
  function grain(x, y, a, len, t) {
    const p = tone(t, RICE), g = [[-len, 0], [-len * .6, -len * .46, len * .6, -len * .46, len, 0], [len * .6, len * .42, -len * .6, len * .42, -len, 0]];
    ctx.save(); ctx.translate(x, y); ctx.rotate(a);
    form(g, p, [[-len, len * .05], [0, -len * .05, len, len * .05], [len, len], [-len, len]], null);
    E(-len * .3, -len * .18, len * .3, len * .07, t(WHITE));
    ctx.restore();
  }

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
    /* F1 — 내가 찢고 나온 번데기 껍질: 마디진 술통 모양, 찢긴 앞쪽 구멍. 뚜껑이 톡 떨어져 있다 */
    'fly:pupaCase': { w: 1.3, h: .4, d: (time, t) => {
      const p = tone(t, '#9a6440');
      faded(.4, () => E(.05, -.01, .45, .05, t('#c9a86a')));
      const shell = [[-.29, 0], [-.38, -.04, -.38, -.24, -.28, -.28], [.2, -.29], [.27, -.26, .3, -.16, .3, -.14], [.28, -.04, .21, 0]];
      rim(shell, p, .025, .05, [[-.4, -.08], [.4, -.08], [.4, .05], [-.4, .05]]);
      [-.16, -.04, .08].forEach((x) => L(x, -.27, x, -.02, p.dark, .018));
      E(.27, -.14, .045, .11, t('#3b2a24'));
      ctx.save(); ctx.translate(.48, -.08); ctx.rotate(.7 + Math.sin(time * 1.2) * .04);
      const cap = [[-.07, .09], [-.1, -.02, -.06, -.1, 0, -.1], [.06, -.1, .1, -.02, .07, .09]];
      form(cap, p, [[.02, .12], [.03, -.12], [.12, -.12], [.12, .12]], [[-.12, .12], [-.12, -.12], [-.03, -.12], [-.04, .12]]);
      ctx.restore();
    } },

    /* F1 — 수거통 가장자리의 시큼한 국물 웅덩이 (배춧잎, 밥알, 고춧가루, 거품) */
    'fly:sourPuddle': { w: 8, h: 3.5, d: (time, t) => {
      faded(.85, () => E(0, -.06, 3.8, .32, t(BROTH)));
      E(-.6, -.1, 2.6, .18, t('#e8c46a'));
      faded(.6, () => E(-1.4, -.14, 1, .06, t(WHITE)));
      const leaf = [[1.3, -.1], [1.6, -.55, 2.3, -.78, 2.85, -.66], [3.2, -.6, 3.15, -.44, 3, -.4], [3.2, -.32, 3.12, -.14, 2.9, -.1]];
      form(leaf, tone(t, '#a8cf7a'), [[2.6, 0], [2.7, -.4, 2.9, -.8], [3.4, -.8], [3.4, 0]], [[1.2, -.3], [1.7, -.7, 2.4, -.85, 2.8, -.75], [2.2, -.6, 1.8, -.48, 1.4, -.24]]);
      curvy([[1.3, -.1], [2, -.3, 2.9, -.22], [2.9, -.1]], t('#eef4dc'));            // 하얀 배추 줄기
      grain(-2.4, -.17, .15, .3, t);
      curvy([[.38, -.12], [.55, -.3, .8, -.26], [.7, -.16, .48, -.1]], t(SAUCE));
      for (let i = 0; i < 4; i++) {
        const ph = (time * .5 + hash(i, 5)) % 1, r = .08 + ph * .08;
        faded(1 - ph, () => E(-2.6 + i * 1.5, -.15 - ph * .15, r, r, t('#f6e3a8')));
      }
      wisps([-2, -.4, 1.4], -.4, 2.6, time, t('#d9c27a'));
    } },

    /* F2 — 반코팅 작업 장갑이 들어 올리는 음식물 통 뚜껑: 둥근 지붕, 두툼한 테, 가운데 손잡이. 테두리 아래로 국물이 뚝뚝 */
    'fly:liftedLid': { w: 14.5, h: 12, d: (time, t) => {
      const p = tone(t, '#f2b33d'), lift = Math.sin(time * 1.1) * .3;
      ctx.save(); ctx.translate(-1.5, -2.2 - lift); ctx.rotate(-.16 + Math.sin(time * .7) * .03);
      for (let i = 0; i < 3; i++) {
        const ph = (time * .7 + i * .33) % 1;
        faded(1 - ph, () => drop(-4 + i * 2.6, .5 + ph * 3.4, .14, t(BROTH)));
      }
      faded(.85, () => { [-3.6, -1, 1.8].forEach((x, i) => E(x, .28, .22 + i * .04, .3, t(BROTH))); });
      const dome = [[-5.1, -.3], [-5, -1.1], [-3.6, -2.7, 3.6, -2.7, 5, -1.1], [5.1, -.3]];
      rim(dome, p, .25, .45, [[2.4, .2], [3.6, -1.2, 3.2, -2.2, 2, -3], [6, -3], [6, .2]]);
      const lip = [[-5.5, .35], [-5.75, -.05, -5.5, -.45], [5.5, -.45], [5.75, -.05, 5.5, .35]];
      form(lip, p, [[4.6, .5], [4.6, -.6], [6, -.6], [6, .5]], [[-6, -.6], [6, -.6], [6, -.25], [-6, -.25]]);
      const grip = [[-1.3, -2.35], [-1.25, -3, 1.25, -3, 1.3, -2.35]];
      form(grip, tone(t, '#d99a2b'), [[.5, -2.2], [.6, -3.1], [1.5, -3.1], [1.5, -2.2]], [[-1.4, -3.1], [.4, -3.1], [.2, -2.8], [-1.4, -2.7]]);
      artHandAt(t, 4.6, -1.9, 2.15, 7.4, { pose: 'flat', curl: .42, spread: .55, skin: '#f4f1ea', coat: '#e6765f', nails: false, sleeve: '#4a5d7a' });
      ctx.restore();
    } },

    /* F2 — 수거차 꽁무니 모서리: 둥근 모서리 차체, 반사띠, 발판 범퍼와 바퀴. 후진등이 깜빡이고 범퍼에서 국물이 흐른다 */
    'fly:reverseLight': { w: 33, h: 31, d: (time, t) => {
      const lit = Math.sin(time * 7) > 0, body = tone(t, '#6fae7f'), ink = tone(t, '#3a3445'), hub = tone(t, '#cfcad8');
      const tire = [[6.5, -4.5], [6.5, -7, 8.5, -9, 11, -9], [13.5, -9, 15.5, -7, 15.5, -4.5], [15.5, -2, 13.5, 0, 11, 0], [8.5, 0, 6.5, -2, 6.5, -4.5]];
      form(tire, ink, [[12.4, .2], [14.4, -3, 14, -7, 12, -9.4], [16, -9.4], [16, .2]], null);
      form([[9.2, -4.5], [9.2, -5.5, 10, -6.3, 11, -6.3], [12, -6.3, 12.8, -5.5, 12.8, -4.5], [12.8, -3.5, 12, -2.7, 11, -2.7], [10, -2.7, 9.2, -3.5, 9.2, -4.5]], hub,
        [[11.3, -2.4], [11.6, -6.6], [13, -6.6], [13, -2.4]], null);
      const panel = [[-2, -5], [-2, -28.4], [-2, -30, -.4, -30], [16, -30], [16, -5]];
      form(panel, body, [[13.6, -4], [13.6, -31], [17, -31], [17, -4]], [[-3, -4], [-3, -31], [-.9, -31], [-.9, -4]]);
      form([[-2, -13], [16, -13], [16, -12], [-2, -12]], tone(t, '#f4f1ea'), [[13.6, -11.8], [13.6, -13.2], [16.2, -13.2], [16.2, -11.8]], null);   // 반사띠
      const bump = [[-3, -3.2], [-3.2, -4.4, -2.8, -5.5], [16, -5.5], [16.2, -3.2]];
      form(bump, ink, [[13.8, -3], [13.8, -5.7], [16.4, -5.7], [16.4, -3]], [[-3.4, -5.7], [16.4, -5.7], [16.4, -5.1], [-3.4, -5.1]]);
      [0, 2, 4, 6].forEach((x) => RR(x, -4.6, 1.2, .4, .2, ink.deep));
      form(roundBox(-.8, -10, 3, 3.2, .6), ink, [[1.6, -6.6], [1.6, -10.2], [2.4, -10.2], [2.4, -6.6]], null);
      if (lit) {
        ctx.save(); ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 24; RR(-.4, -9.6, 2.2, 2.4, .4, '#ffb347'); ctx.restore();
        ctx.save(); ctx.strokeStyle = '#ffe1a8'; ctx.lineWidth = .18; ctx.lineCap = 'round'; ctx.globalAlpha = .8;
        [1.6, 2.6, 3.6].forEach((r) => { ctx.beginPath(); ctx.arc(-.6, -8.4, r, Math.PI * .75, Math.PI * 1.25); ctx.stroke(); });
        ctx.restore();
      } else RR(-.4, -9.6, 2.2, 2.4, .4, t('#8a5a2a'));
      const ph = (time * .6) % 1;
      faded(1 - ph, () => drop(-2.2, -3 + ph * 3, .14, t(BROTH)));
    } },

    /* F3 — 골목 환기구: 두꺼운 테두리와 비스듬히 누운 날개살. 기름이 맺혔다가 뚝 떨어지고, 따뜻한 냄새가 올라온다 */
    'fly:ventDrip': { w: 8.5, h: 9, d: (time, t) => {
      const fr = tone(t, '#b9b4c2'), slat = tone(t, '#cfcad8');
      form(roundBox(-4, -5, 8, 5, .5), fr, [[3.3, .2], [3.3, -5.2], [4.2, -5.2], [4.2, .2]], [[-4.2, -5.2], [4.2, -5.2], [4.2, -4.65], [-4.2, -4.65]]);
      RR(-3.4, -4.5, 6.8, 3.9, .2, t('#6f6a7c'));
      for (let y = -4.3; y < -.9; y += .8) {
        curvy([[-3.4, y], [3.4, y], [3.4, y + .28], [-3.4, y + .32]], slat.lit);                // 날개살 윗면 (볕)
        curvy([[-3.4, y + .32], [3.4, y + .28], [3.4, y + .5], [-3.4, y + .56]], slat.mid);
      }
      faded(.75, () => P([[-1, 0], [1.2, 0], [.7, 1.1], [.3, 1.9], [-.4, 1.1]], t('#c9a14a')));
      const swell = (time * .5) % 1;
      E(.25, 1.95 + swell * .3, .12 + swell * .08, .16 + swell * .12, t('#e8c25a'));
      E(.2, 1.9 + swell * .25, .04, .06, t(WHITE));
      const fall = (time * .5 + .5) % 1, fy = 2.4 + fall * fall * 4;
      faded(1 - fall * .6, () => drop(.25, fy, .14, t('#e8c25a')));
      wisps([-2.5, 0, 2.5], -5.2, 3.5, time, t('#f4f1ea'), .3);
    } },

    /* F3 — 처마 귀퉁이 거미줄. 기와 끝 막새가 줄지어 있고, 이슬이 반짝이며, 지름길 쪽으로 실 한 가닥이 늘어져 있다 */
    'fly:eavesWeb': { w: 14.5, h: 13.5, d: (time, t) => {
      const beam = tone(t, '#8b8fa3'), tile = tone(t, '#6f7388'), post = tone(t, '#9aa3bb');
      form([[-7, -11.2], [7, -11.2], [7, -12.9], [-7, -12.9]], beam, [[-7.2, -11], [7.2, -11], [7.2, -11.5], [-7.2, -11.5]], [[-7.2, -13], [7.2, -13], [7.2, -12.5], [-7.2, -12.5]]);
      for (let x = -6.5; x <= 6.5; x += 1) {
        const m = [[x - .48, -11.25], [x - .48, -10.5, x + .48, -10.5, x + .48, -11.25]];
        form(m, tile, [[x + .1, -10], [x + .1, -11.4], [x + .6, -11.4], [x + .6, -10]], null);
      }
      form([[4.4, -10.7], [5.4, -10.7], [5.4, 0], [4.4, 0]], post, [[5, .2], [5, -11], [5.6, -11], [5.6, .2]], [[4.2, .2], [4.2, -11], [4.65, -11], [4.65, .2]]);
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

    /* F4 — 반쯤 열린 주방 창문: 홈 파인 알루미늄 레일, 미닫이 유리와 창틀 기둥, 레일에 말라붙은 소스 자국 */
    'fly:windowFrame': { w: 16.5, h: 16, d: (time, t) => {
      const al = tone(t, '#c9c4cc'), st = tone(t, '#d8d4de');
      form([[-6.2, 0], [6, 0], [6, -.8], [-6.2, -.8]], al, [[5.4, .2], [5.4, -1], [6.2, -1], [6.2, .2]], [[-6.4, -1], [6.2, -1], [6.2, -.62], [-6.4, -.62]]);
      L(-6, -.38, 5.4, -.38, al.deep, .1);
      faded(.6, () => { E(-3, -.85, .6, .12, t('#c0503a')); E(-2.2, -.82, .2, .07, t('#c0503a')); });
      faded(.35, () => RR(3, -15, 5, 14.2, 0, t('#bfe3f5')));
      faded(.5, () => { P([[3.4, -10], [4.4, -12], [5.4, -6], [4.4, -4]], t(WHITE)); P([[5.8, -13], [6.3, -14], [7.2, -9], [6.7, -8]], t(WHITE)); });
      form([[2, -.8], [3, -.8], [3, -15.2], [2, -15.2]], st, [[2.62, 0], [2.62, -15.4], [3.2, -15.4], [3.2, 0]], [[1.8, 0], [1.8, -15.4], [2.25, -15.4], [2.25, 0]]);
    } },

    /* F4 — 조리대 위 떡볶이 접시: 윤기 도는 빨간 떡, 접힌 어묵, 삶은 달걀 반쪽, 파, 깨. 접시 가장자리에 소스 방울 */
    'fly:tteokbokki': { w: 9, h: 5, d: (time, t) => {
      const plate = tone(t, '#fbfaf6'), sauce = tone(t, SAUCE), cake = tone(t, '#ec6446'), fish = tone(t, '#e8b878');
      E(0, -.32, 4.3, .5, plate.dark); E(0, -.55, 4.1, .6, plate.lit); E(0, -.62, 3.5, .44, plate.mid);
      E(0, -.66, 3.3, .38, sauce.dark); E(-.2, -.72, 3, .3, sauce.mid);
      const mound = [[-2.9, -.72], [-2.2, -1.75, 2.2, -1.85, 2.9, -.72]];
      rim(mound, sauce, .2, .22, [[1.2, -.6], [1.8, -1.2, 2, -1.6], [3.2, -1.6], [3.2, -.6]]);
      const sheet = (pts, dark) => form(pts, fish, dark, null);
      sheet([[1.1, -.85], [1.6, -1.6, 2.4, -1.85, 2.6, -1.7], [2.9, -.85], [2, -1.05, 1.1, -.85]], [[2.3, -.7], [2.5, -1.7], [3, -1.7], [3, -.7]]);
      sheet([[-2.95, -.82], [-2.5, -1.5, -2, -1.65, -1.9, -1.55], [-1.55, -.88], [-2.3, -1.02, -2.95, -.82]], [[-2.05, -.7], [-1.95, -1.7], [-1.4, -1.7], [-1.4, -.7]]);
      const tteok = (x, y, a) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        const body = [[-.72, -.27], [.72, -.27], [.8, 0, .72, .27], [-.72, .27], [-.8, 0, -.72, -.27]];
        rim(body, cake, 0, .16, [[-.9, .1], [.9, .1], [.9, .4], [-.9, .4]]);
        E(.72, 0, .19, .28, t('#fff3e6')); E(.75, .04, .11, .18, t('#f4e2d0'));                 // 잘린 단면: 하얀 떡살
        faded(.8, () => E(-.25, -.17, .3, .045, t(WHITE)));
        ctx.restore();
      };
      [[-1.9, -.95, .1], [-.5, -1.02, -.15], [.9, -.98, .2], [-1.2, -1.42, -.3], [.25, -1.52, .1], [1.6, -1.35, -.1]].forEach(([x, y, a]) => tteok(x, y, a));
      const egg = [[-.72, -1.82], [-.7, -2.32, .3, -2.4, .32, -1.86], [.3, -1.5, -.7, -1.46, -.72, -1.82]];
      form(egg, tone(t, '#fbfaf6'), [[-.1, -1.4], [.1, -1.9, .35, -2.1], [.6, -2.1], [.6, -1.4]], null);
      E(-.14, -1.92, .26, .2, t('#ffc93a')); E(-.22, -1.98, .11, .07, t('#fff2b0'));
      [[-2.4, -.9], [.4, -1.15], [1.9, -1.0], [-.9, -1.75]].forEach(([x, y]) => { E(x, y, .17, .11, t('#5fa35a')); E(x, y, .08, .05, t('#d8f0b8')); });
      [[-1.5, -1.1], [.9, -1.35], [-.3, -1.3], [1.3, -.85]].forEach(([x, y]) => E(x, y, .05, .03, t('#fff3d8')));
      E(3.9, -.4, .13, .17, sauce.dark); E(3.86, -.45, .04, .05, t(WHITE));
      wisps([-1.5, .5, 2], -2.2, 2.6, time, t(WHITE), .35);
    } },

    /* D12 — 가스레인지 위 찌개 냄비: 배가 살짝 부른 냄비, 귀 손잡이, 보글보글 끓는 빨간 국물, 두부와 파, 푸른 불꽃, 뜨거운 김 */
    'fly:stewPot': { w: 24.5, h: 21, d: (time, t) => {
      const pot = tone(t, '#a8adb8'), ink = tone(t, '#3a3445'), tofu = tone(t, '#fbf7ee');
      form([[-10, 0], [10, 0], [10, -.6], [-10, -.6]], ink, null, [[-10.2, -.75], [10.2, -.75], [10.2, -.5], [-10.2, -.5]]);
      for (let x = -6; x <= 6; x += 2) {
        const h = 1 + Math.sin(time * 12 + x) * .25;
        faded(.85, () => { ctx.fillStyle = '#6fb7ff'; ctx.beginPath(); ctx.moveTo(x - .5, -.6); ctx.quadraticCurveTo(x - .4, -h * .7, x, -h - .6); ctx.quadraticCurveTo(x + .4, -h * .7, x + .5, -.6); ctx.fill(); });
        faded(.9, () => E(x, -.9, .18, .3, '#d8efff'));
      }
      ctx.save(); ctx.translate(0, -1.6);
      [-1, 1].forEach((d) => {
        const ear = [[d * 8.8, -8.8], [d * 11.4, -9.2, d * 11.8, -7.4], [d * 11.6, -6.4, d * 8.8, -6.6]];
        curvy(ear, d < 0 ? ink.lit : ink.mid); curvy([[d * 9, -8.1], [d * 10.6, -8.2, d * 10.7, -7.5], [d * 10.4, -7.1, d * 9, -7.2]], ink.deep);
      });
      const belly = [[-9, -9.4], [9, -9.4], [9.3, -4.4, 8.8, -1.8], [8.4, -.6, 7, -.6], [-7, -.6], [-8.4, -.6, -8.8, -1.8], [-9.3, -4.4, -9, -9.4]];
      form(belly, pot, [[4.8, 0], [5.2, -5, 5, -10], [10, -10], [10, 0]], [[-10, 0], [-10, -10], [-7, -10], [-7.4, -5, -7, 0]]);
      faded(.5, () => RR(-6.4, -8.6, .35, 7.2, .2, t(WHITE)));
      E(0, -9.6, 9.4, 1.3, pot.lit); E(0, -9.75, 8.8, 1, pot.deep);
      E(0, -9.5, 8.7, .85, t('#c8402a')); E(-.6, -9.6, 7.6, .62, t('#e2683a'));
      [[-4, -9.8], [1.5, -9.6], [4.5, -9.9]].forEach(([x, y]) => {
        curvy([[x - .7, y], [x + .5, y], [x + .5, y + .5], [x - .7, y + .5]], tofu.mid);
        curvy([[x - .7, y], [x + .5, y], [x + .75, y - .3], [x - .45, y - .3]], tofu.lit);
        curvy([[x + .5, y], [x + .75, y - .3], [x + .75, y + .25], [x + .5, y + .5]], tofu.dark);
      });
      [[-2, -9.5], [3, -10], [-6, -9.6]].forEach(([x, y]) => { E(x, y, .32, .2, t('#5fa35a')); E(x, y, .14, .09, t('#d8f0b8')); });
      for (let i = 0; i < 4; i++) {
        const ph = (time * .8 + hash(i, 9)) % 1, x = -6 + i * 4, r = .15 + ph * .45;
        faded(1 - ph, () => { E(x, -9.7 - r * .4, r, r * .6, t('#ff9a7a')); E(x - r * .3, -9.8 - r * .7, r * .3, r * .2, t(WHITE)); });
      }
      wisps([-5, -1.5, 2, 5.5], -10.6, 8, time, t(WHITE), .4);
      ctx.restore();
      [-8, 8].forEach((x) => form([[x - .3, -.6], [x + .3, -.6], [x + .3, -2.2], [x - .3, -2.2]], ink, [[x + .05, 0], [x + .05, -2.4], [x + .5, -2.4], [x + .5, 0]], null));
    } },

    /* F5 — 천장에서 내려온 꿀 냄새 끈끈이 리본의 끝자락. 반 바퀴 비틀려 앞뒤 면이 번갈아 보이고, 먼저 붙은 친구들이 발버둥 친다 */
    'fly:honeyRibbon': { w: 5.5, h: 24.5, d: (time, t) => {
      const sway = Math.sin(time * 1.5) * .25, g = tone(t, '#ffd56b'), STEP = .4;
      const ang = (y) => (y + 24) * .14 + .2, off = (y) => sway * (1 + y / 24), half = (y) => 1.3 * Math.max(.2, Math.abs(Math.cos(ang(y))));
      wisps([-2.2, 2.4], -1.5, 5, time, t('#ffe08a'), .35);
      const left = [], right = [];
      for (let y = -24; y <= 0; y += STEP) { left.push([off(y) - half(y), y]); right.unshift([off(y) + half(y), y]); }
      const strip = [...left, ...right], flip = (Math.PI / 2 - .2) / .14 - 24, litEnd = (Math.acos(.7) - .2) / .14 - 24;
      P(strip, g.dark);                                                                          // 비틀려 드러난 뒷면 (그늘)
      ctx.save(); ctx.beginPath(); strip.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.clip();
      R(-3, -24.1, 6, flip + 24.1, g.mid); R(-3, -24.1, 6, litEnd + 24.1, g.lit);                // 앞면: 위쪽은 볕, 비틀리는 곳은 앞면 톤
      ctx.restore();
      E(sway, 0, Math.max(.3, Math.abs(half(0))), .22, g.dark);
      const gl = (time * .4) % 1;
      E(sway + .3, .35 + gl * .3, .22 + gl * .08, .28 + gl * .12, t(HONEY));
      E(sway + .22, .28 + gl * .3, .06, .09, t(WHITE));
      [[-4, .3], [-9.5, -.4], [-15, .2]].forEach(([y, tilt], i) => miniFly(off(y) - .1, y, 1, time + i, t, { stuck: true, tilt }));
    } },

    /* F5·F10·D9 — 구석의 파란 전기 해충퇴치기: 고리에 매단 둥근 상자, 안쪽 푸른 등과 철망. 웅웅 빛나고 가끔 지지직 */
    'fly:zapperGlow': { w: 15.5, h: 10, d: (time, t) => {
      const hs = tone(t, '#e9e4ec');
      faded(.12, () => P([[-4, 0], [4, 0], [7, 6], [-7, 6]], '#9fd0ff'));
      faded(.15 + Math.sin(time * 4) * .06, () => E(0, -4, 7.5, 5.5, '#5fa8ff'));
      ctx.strokeStyle = hs.dark; ctx.lineWidth = .3; ctx.beginPath(); ctx.arc(0, -8.7, .6, 0, TAU); ctx.stroke();
      form(roundBox(-5, -8, 10, 8, 1), hs, [[3.9, .2], [3.9, -8.2], [5.2, -8.2], [5.2, .2]], [[-5.2, -8.2], [5.2, -8.2], [5.2, -7.5], [-5.2, -7.5]]);
      RR(-4.3, -7.3, 8.6, 6.6, .6, t('#3b3049'));
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

    /* F5 — 불빛 아래 떨어진 바삭한 튀김 부스러기 */
    'fly:friedCrumbs': { w: 4, h: .5, d: (time, t) => {
      for (let i = 0; i < 6; i++) crumb(-1.8 + hash(i, 31) * 3.6, .14 + hash(i, 32) * .14, i, t, '#e0a24a');
    } },

    /* F6 — 앞이 찢어진 골목 음식물 봉투. 묶은 귀가 쫑긋하고, 찢긴 틈으로 김치·달걀 껍데기·생선 가시가 쏟아졌다 */
    'fly:tornBag': { w: 12.5, h: 9, d: (time, t) => {
      const bag = tone(t, '#eef0e6');
      faded(.6, () => E(.6, -.06, 5.4, .32, t(BROTH)));
      curvy([[-4.4, 0], [-5.4, -2.4, -4.6, -5.6, -2, -6.4], [0, -7, 1.8, -6.2], [4.6, -5.4, 5.2, -2.4, 4.6, 0]], bag.dark);   // 뒤로 돌아가는 봉투 옆구리
      const front = [[-4.4, -.2], [-5.2, -2.4, -4.4, -5.5, -2, -6.3], [0, -6.9, 1.6, -6.2], [3.6, -5.4, 3.6, -2.6, 3, -.2]];
      form(front, bag, null, [[-5.4, -1], [-5.2, -4, -3.6, -6, -1.4, -6.8], [-1.6, -6], [-3, -5.2, -4, -3.6, -4.2, -1]]);
      P([[-.8, -6.4], [-1.9, -8.4], [-1, -8], [-.2, -6.6]], bag.dark); P([[-.2, -6.5], [.7, -8.6], [1.3, -8], [.4, -6.4]], bag.lit);
      E(-.4, -6.5, .55, .32, bag.dark);
      faded(.12, () => E(-1.2, -2.4, 2.2, 1.6, t(BROTH)));
      ctx.strokeStyle = bag.dark; ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(1.2, -5.6); ctx.quadraticCurveTo(2.2, -4, 1.8, -2.6); ctx.moveTo(-1, -5.4); ctx.lineTo(-.4, -4.4); ctx.stroke();
      ctx.fillStyle = t('#8a7462'); ctx.beginPath(); ctx.moveTo(-1.6, -.1); ctx.lineTo(-1.2, -1.8); ctx.lineTo(-.7, -1.3); ctx.lineTo(-.2, -2.9);
      ctx.lineTo(.4, -1.7); ctx.lineTo(1, -2.4); ctx.lineTo(1.5, -1.1); ctx.lineTo(1.9, -.1); ctx.closePath(); ctx.fill();
      const kimchi = tone(t, SAUCE);
      [[-1.1, -.55, .3], [.2, -.9, -.4], [1.1, -.5, .8]].forEach(([x, y, a]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        const leaf = [[-.7, .2], [-.6, -.45, 0, -.3], [.5, -.55, .75, .15], [0, .02, -.7, .2]];
        form(leaf, kimchi, [[.2, .3], [.3, -.6], [.9, -.6], [.9, .3]], [[-.8, .3], [-.7, -.55, 0, -.4], [-.2, -.2, -.5, .1]]);
        L(-.5, .08, .55, -.05, t('#f7e2c0'), .12);
        ctx.restore();
      });
      ctx.save(); ctx.translate(2.6, -.35); ctx.rotate(-.3);
      ctx.fillStyle = t('#f6efe2'); ctx.beginPath(); ctx.arc(0, 0, .55, Math.PI, 0); ctx.lineTo(.3, -.1); ctx.lineTo(.1, .05); ctx.lineTo(-.2, -.12); ctx.closePath(); ctx.fill();
      E(0, -.1, .38, .2, t('#e8d4b0')); ctx.restore();
      L(3.4, -.12, 5.4, -.16, t('#e9e4ec'), .07);
      [3.8, 4.25, 4.7, 5.1].forEach((x, i) => { L(x, -.14, x - .2, -.55 + i * .05, t('#e9e4ec'), .04); L(x, -.14, x - .2, .22, t('#e9e4ec'), .04); });
      P([[5.4, -.16], [5.9, -.5], [5.9, .2]], t('#d8d4de'));
      grain(-3, -.15, .1, .3, t); grain(-2.4, -.1, -.3, .24, t);
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

    /* F7 — 숨어든 벤치 밑. 볕 받는 판자 윗면과 그늘진 앞 모서리, 무쇠 다리. 가장자리로 빗물이 떨어진다 */
    'fly:benchUnderside': { w: 18, h: 10.5, d: (time, t) => {
      const wood = tone(t, '#c98d5a'), iron = tone(t, '#5f5a6c');
      faded(.18, () => E(0, -.05, 7, .25, t(INK)));
      [-7.6, 6.6].forEach((lx) => {
        const leg = [[lx, -8.6], [lx + 1, -8.6], [lx + .9, -1.2], [lx + 1.5, 0], [lx - .5, 0], [lx + .1, -1.2]];
        form(leg, iron, [[lx + .55, .2], [lx + .55, -8.8], [lx + 1.6, -8.8], [lx + 1.6, .2]], null);
      });
      form([[-8, -8.8], [8, -8.8], [8, -8.3], [-8, -8.3]], iron, [[-8.2, -8.2], [8.2, -8.2], [8.2, -8.45], [-8.2, -8.45]], null);
      form([[-8.4, -10.7], [8.4, -10.7], [8.4, -10.15], [-8.4, -10.15]], tone(t, shade('#c98d5a')), null, null);   // 뒤 판자
      form([[-8.6, -8.8], [8.6, -8.8], [8.6, -9.9], [-8.6, -9.9]], wood, [[7.6, -8.6], [7.6, -10], [8.8, -10], [8.8, -8.6]], null);
      curvy([[-8.6, -9.9], [8.6, -9.9], [8.9, -10.25], [-8.3, -10.25]], wood.lit);
      R(-8.6, -9.05, 17.2, .25, wood.dark);
      [-8.4, 8.4].forEach((x, i) => {
        const ph = (time * 1.2 + i * .5) % 1;
        faded(1 - ph * .7, () => drop(x, -9 + ph * 9, .12, t('#bfe0f5')));
      });
    } },

    /* F8 — 벤치 밑에 떨어진 밥알 두 개, 참깨 한 톨, 단무지 부스러기, 김 조각 */
    'fly:riceGrains': { w: 2.5, h: .4, d: (time, t) => {
      grain(-.6, -.15, -.2, .3, t); grain(.1, -.14, .35, .3, t);
      E(.85, -.06, .1, .05, t('#f2e2b8')); E(.83, -.08, .05, .02, t(WHITE));
      const dan = tone(t, '#ffd56b');
      form([[-1.3, 0], [-1.3, -.2, -1.05, -.2], [-1, 0]], dan, [[-1.15, .05], [-1.12, -.25], [-.9, -.25], [-.9, .05]], null);
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

    /* F9 — 식탁 위 수박 한 조각 (폭 약 14cm). 두께가 보이는 반달, 씨가 박히고 단물이 식탁에 고였다 */
    'fly:watermelon': { w: 17.5, h: 8, d: (time, t) => {
      const board = tone(t, '#d9b38a'), rind = tone(t, '#5f9e6a'), flesh = tone(t, '#ff6f7f'), white = tone(t, '#e8f2d8');
      R(-8.5, -.6, 17, .6, board.mid); R(-8.5, -.6, 17, .18, board.lit);
      const cy = -7.6, half = (r, c, dx = 0, dy = 0) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(dx, cy + dy, r, 0, Math.PI); ctx.closePath(); ctx.fill(); };
      half(7, rind.deep, .8, -.45);                                                                // 뒤로 물러난 껍질 두께
      P([[-7, cy], [7, cy], [7.8, cy - .45], [-6.2, cy - .45]], rind.dark);
      P([[-6.4, cy], [6.4, cy], [7.2, cy - .45], [-5.6, cy - .45]], white.mid);
      P([[-5.9, cy], [5.9, cy], [6.7, cy - .45], [-5.1, cy - .45]], flesh.lit);                     // 잘린 윗면
      half(7, rind.mid); half(6.4, white.mid);
      ctx.save(); ctx.beginPath(); ctx.arc(0, cy, 5.9, 0, Math.PI); ctx.clip(); half(5.9, flesh.dark); half(5.9, flesh.mid, -.55, -.4); ctx.restore();   // 껍질 쪽으로 깊어지는 과육
      [[-3, -6.4], [-1, -5.2], [1.2, -6.2], [3.2, -5.5], [-1.8, -3.6], [.6, -3.8], [2.2, -4.2], [-.2, -6.8]].forEach(([x, y]) => {
        curvy([[x, y - .26], [x + .18, y, x, y + .2], [x - .18, y, x, y - .26]], t('#2f2a3a')); E(x - .04, y - .05, .035, .05, t(WHITE));
      });
      const ph = (time * .4) % 1;
      faded(1 - ph, () => drop(5.6, -2.2 + ph * 1.5, .12, t('#ff8a96')));
      faded(.6, () => E(5.8, -.62, 1, .1, t('#ff9aa8')));
    } },

    /* F9 — 싱크대 밑 음식물 통: 배가 살짝 부른 통, 비스듬히 들린 뚜껑. 수박 껍질과 바나나 껍질이 삐져나왔다 */
    'fly:wasteCaddy': { w: 10, h: 14.5, d: (time, t) => {
      const body = tone(t, '#8fb8a8'), lid = tone(t, '#6f9a8a'), bob = Math.sin(time * 1.5) * .04;
      faded(.2, () => E(0, -.05, 4.8, .3, t(INK)));
      const tub = [[-4, -9], [4, -9], [4.1, -4, 3.5, -.6], [3.4, 0, 3, 0], [-3, 0], [-3.4, 0, -3.5, -.6], [-4.1, -4, -4, -9]];
      form(tub, body, [[2.2, .2], [2.6, -4, 2.5, -9.2], [4.4, -9.2], [4.4, .2]], [[-4.4, .2], [-4.4, -9.2], [-3, -9.2], [-3.2, -4, -2.8, .2]]);
      RR(-2.6, -6.2, 4.2, 2.2, .4, t('#f4f1ea')); E(-1.9, -5.1, .5, .5, t('#7fbf6a'));
      [-1.1, -.5].forEach((x, i) => L(x, -5.6 + i * .4, x + 2.2, -5.6 + i * .4, t('#b9b4c2'), .14));
      form([[-4.2, -8.8], [4.2, -8.8], [4.2, -9.4], [-4.2, -9.4]], lid, [[3.2, -8.6], [3.2, -9.6], [4.4, -9.6], [4.4, -8.6]], null);
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
      const top = [[0, 0], [8.8, 0], [8.8, -.9], [8.4, -1.1, 7.8, -1.1], [.6, -1.1], [0, -1.1, 0, -.6]];
      form(top, lid, [[-.2, .2], [9, .2], [9, -.35], [-.2, -.35]], [[-.2, -1.2], [9, -1.2], [9, -.8], [-.2, -.8]]);
      form(roundBox(7.6, -1.6, 1.3, .7, .3), lid, null, [[7.5, -1.7], [9, -1.7], [9, -1.4], [7.5, -1.4]]);
      ctx.restore();
      wisps([-1.5, 1.5], -11, 3, time, t('#d9c27a'), .35);
    } },

    /* F9 — 식탁 옆에 세워 둔 살충제 통: 둥근 어깨의 깡통과 분사 뚜껑. 띠지에 파리 그림이 X로 지워져 있다 */
    'fly:sprayIdle': { w: 5.5, h: 22.5, d: (time, t) => {
      const can = tone(t, '#5f8fb0'), lab = tone(t, '#ffd56b'), cap = tone(t, '#e9e4ec');
      const body = [[-2.6, 0], [-2.6, -17.4], [-2.6, -18.7, -1.3, -19.3], [1.3, -19.3], [2.6, -18.7, 2.6, -17.4], [2.6, 0]];
      form(body, can, [[1.2, .2], [1.2, -19.6], [3, -19.6], [3, .2]], [[-3, .2], [-3, -19.6], [-1.8, -19.6], [-1.8, .2]]);
      R(-2.6, -.5, 5.2, .5, can.deep);
      const band = [[-2.6, -12.6], [0, -12.3, 2.6, -12.6], [2.6, -8.3], [0, -8, -2.6, -8.3]];
      form(band, lab, [[1.2, -7.8], [1.2, -12.8], [3, -12.8], [3, -7.8]], [[-3, -7.8], [-3, -12.8], [-1.8, -12.8], [-1.8, -7.8]]);
      miniFly(-.2, -10.3, 1.6, time, t, { sleep: true });
      L(-1.2, -11.8, 1, -9, t(SAUCE), .22); L(1, -11.8, -1.2, -9, t(SAUCE), .22);
      const cp = [[-1.6, -19.1], [-1.6, -21], [-1.4, -21.7, -.6, -21.8], [.6, -21.8], [1.4, -21.7, 1.6, -21], [1.6, -19.1]];
      form(cp, cap, [[.7, -19], [.7, -22], [1.8, -22], [1.8, -19]], [[-1.8, -19], [-1.8, -22], [-1, -22], [-1, -19]]);
      RR(.8, -21.2, 1.4, .7, .3, t(INK));
    } },

    /* F10 — 햇볕 드는 창틀. 앞으로 튀어나온 턱, 빛줄기 속에 먼지가 떠다니고, 말라붙은 양념 자국이 남아 있다 */
    'fly:sunnySill': { w: 22.5, h: 16.5, d: (time, t) => {
      const sill = tone(t, '#f4ead8');
      faded(.16 + Math.sin(time * .8) * .03, () => {
        P([[-11, -16], [-6, -16], [4, 0], [-1, 0]], '#fff3b8'); P([[-4, -16], [-2, -16], [8, 0], [6, 0]], '#fff3b8');
      });
      form([[-8.4, 0], [8, 0], [8, -.55], [-8.4, -.55]], sill, [[7.4, .2], [7.4, -.7], [8.2, -.7], [8.2, .2]], [[-8.6, -.7], [8.2, -.7], [8.2, -.42], [-8.6, -.42]]);
      R(-8.4, -.12, 16.4, .12, sill.dark);
      faded(.4, () => P([[-1, -.55], [4, -.55], [4.3, 0], [-.7, 0]], '#fff3b8'));
      faded(.55, () => { E(-3, -.55, .7, .1, t('#c0503a')); E(-4.1, -.53, .2, .06, t('#c0503a')); });
      for (let i = 0; i < 7; i++) {
        const ph = (time * .08 + hash(i, 61)) % 1, x = -8 + hash(i, 62) * 10 + ph * 3, y = -2 - hash(i, 63) * 11 + Math.sin(time + i) * .4;
        faded(.7 * Math.sin(ph * Math.PI), () => E(x, y, .06, .06, t(WHITE)));
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

    /* F10·D11 — 닫힌 창문 유리. 볕 받는 창틀 기둥과 아래 레일, 바깥 나무와 하늘이 비치고, 부딪힌 자국이 점점이 남았다 */
    'fly:windowGlass': { w: 14.5, h: 17, d: (time, t) => {
      const fr = tone(t, '#d8d4de'), rail = tone(t, '#c9c4cc');
      faded(.3, () => RR(-2.2, -16, 8.2, 15.4, 0, t('#bfe3f5')));
      faded(.22, () => { E(2, -5, 3, 2.4, t('#7fb08a')); E(3.5, -11, 3.5, 2, t(WHITE)); });
      faded(.5 + Math.sin(time * .7) * .1, () => {
        P([[-1.6, -12], [-.6, -14], [2.4, -6], [1.4, -4]], t(WHITE)); P([[2.8, -14.5], [3.3, -15.5], [5.2, -11], [4.7, -10]], t(WHITE));
      });
      [[0, -3.2], [.4, -3.6], [-.3, -4.1], [.8, -2.9]].forEach(([x, y]) => faded(.45, () => E(x, y, .07, .05, t('#8a8494'))));
      form([[-3, 0], [-3, -16.4], [-2.1, -16.4], [-2.1, 0]], fr, [[-2.45, .2], [-2.45, -16.6], [-2, -16.6], [-2, .2]], [[-3.2, .2], [-3.2, -16.6], [-2.8, -16.6], [-2.8, .2]]);
      form([[-3, 0], [6.6, 0], [6.6, -.7], [-3, -.7]], rail, [[6, .2], [6, -.9], [6.8, -.9], [6.8, .2]], [[-3.2, -.9], [6.8, -.9], [6.8, -.52], [-3.2, -.52]]);
    } },
  };
})());
