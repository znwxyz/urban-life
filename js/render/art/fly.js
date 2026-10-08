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

  /* ── 백구: 마당에 묶인 열두 살 흰 진돗개. 파리 눈높이에선 머리 하나가 화면을 채운다 (머리 길이 약 19cm) ──
     왼쪽(나 쪽)을 보고 땅에 턱을 댄 옆얼굴. 원점은 코끝 밑 땅(코끝이 x=0), 뒤로 목과 엎드린 어깨가 이어진다 */
  const FUR = '#f4efe6', NOSE = '#2e2a33', DOG_EYE = '#3a2a24', EAR_IN = '#e7aca3', MOUTH = '#6b3440', TONGUE = '#ee8f98', TIRE = '#38333a';
  const DOG_HINGE = [8.6, -2.6];
  const DOG_BODY = [[12, 0], [12.4, -6, 14.6, -9.6, 18.6, -12.4], [22, -14.4, 27, -15.4, 36, -15.4], [36, 0]];
  const DOG_UPPER = [[.2, -1.9], [-.2, -2.6, -.2, -3.9, .4, -4.4], [3, -4.9, 5.6, -5.4, 7.4, -6.6], [8.6, -7.6, 9, -9.6, 10.8, -10.6],
    [12.6, -11.6, 15, -12, 17, -11.4], [18.6, -10.8, 19.2, -8.6, 18.8, -6], [18.4, -3.6, 17, -2.4, 15.6, -2.2], [7.6, -2.2], [5.5, -1.5, 2, -1.6, .2, -1.9]];
  const DOG_JAW = [[.9, -1.7], [7.6, -2.2], [15.6, -2.3], [18, -1.6, 19, 0], [2.6, 0], [1.2, -.4, .8, -1, .9, -1.7]];
  const DOG_NOSE = [[-.05, -3.1], [-.1, -4.3, 1.3, -4.75, 1.95, -4.1], [2.4, -3.4, 1.9, -2.5, 1.1, -2.4], [.3, -2.35, 0, -2.6, -.05, -3.1]];

  /** 한 점을 경첩(h) 둘레로 a만큼 돌린다 (캔버스 rotate(-a)와 같은 방향: 양수면 턱이 아래로 벌어진다) */
  function swing(pt, h, a) {
    const dx = pt[0] - h[0], dy = pt[1] - h[1];
    return [h[0] + dx * Math.cos(a) + dy * Math.sin(a), h[1] - dx * Math.sin(a) + dy * Math.cos(a)];
  }

  /** 백구 옆얼굴과 엎드린 어깨. o: { eye: 'open'|'shut', jaw 벌린 각도, ear 귀 움찔 각도 } */
  function dogHead(t, o = {}) {
    const f = tone(t, FUR), a = o.jaw || 0;
    rim(DOG_BODY, f, .18, .24, [[12, -5], [20, -9, 28, -10.5, 37, -11], [37, 1], [12, 1]]);
    ctx.save(); ctx.translate(14.4, -11.6); ctx.rotate(.18 + (o.ear || 0));
    const ear = [[-2.2, .5], [-1.5, -2.6, -.6, -4.4, .3, -5.4], [1.1, -4.2, 1.9, -2.2, 2.2, .4]];
    form(ear, f, [[.7, 1], [1, -3, .7, -5.8], [3, -5.8], [3, 1]], null);
    curvy([[-1.4, -.1], [-.8, -2.1, -.2, -3.4, .25, -4.1], [.6, -2.9, 1, -1.6, 1.2, -.1]], t(EAR_IN));
    ctx.restore();
    if (a) {
      const jf = swing([.9, -1.7], DOG_HINGE, a);
      P([DOG_HINGE, [.2, -1.95], jf], t(MOUTH));
      if (a > .2) P([[1.4, -2], [1.7, -1.05], [2, -2]], t('#f6f0de'));                                // 위 송곳니 하나
    }
    ctx.save(); ctx.translate(DOG_HINGE[0], DOG_HINGE[1]); ctx.rotate(-a); ctx.translate(-DOG_HINGE[0], -DOG_HINGE[1]);
    form(DOG_JAW, f, [[0, -.5], [6, -.7], [10.5, -1], [11.5, -3], [20, -3], [20, 1], [0, 1]], null);
    if (a) {
      curvy([[1.6, -1.8], [4, -2.6, 7, -2.4], [6, -1.9, 3, -1.6]], t(TONGUE));
      if (a > .2) P([[2.2, -1.75], [2.5, -2.55], [2.8, -1.75]], t('#f6f0de'));                        // 아래 송곳니 하나
    }
    ctx.restore();
    rim(DOG_UPPER, f, .18, .24, [[10.5, -1.5], [12.8, -4.6, 15.6, -6.2, 19.5, -7], [19.5, -1.5]]);
    within(DOG_UPPER, () => curvy([[.4, -1.95], [3, -2.7, 6, -2.8, 7.8, -2.3], [5.5, -1.5, 2, -1.6, .4, -1.95]], f.dark));   // 윗입술 그늘
    curvy([[6.6, -2.3], [7.4, -2.9, 8.2, -2.6], [7.4, -2.15, 6.6, -2.3]], f.deep);                   // 입꼬리
    form(DOG_NOSE, tone(t, NOSE), [[1.1, -2], [1.4, -3.6, 2.4, -4], [2.6, -2]], null);
    curvy([[.1, -3.2], [.5, -3.5, .9, -3.2], [.6, -2.9, .1, -3.2]], t(shade(shade(NOSE))));          // 콧구멍
    faded(.55, () => E(.8, -4.05, .35, .13, t(WHITE)));
    if (o.eye === 'shut') curvy([[8.7, -7.5], [9.4, -7, 10.3, -7.1, 10.7, -7.5], [10.1, -7.25, 9.3, -7.2, 8.7, -7.5]], t(DOG_EYE));
    else {
      curvy([[8.7, -7.6], [9.3, -8.3, 10.2, -8.25, 10.7, -7.55], [10.1, -7.15, 9.3, -7.15, 8.7, -7.6]], t(DOG_EYE));
      E(9.45, -7.85, .15, .12, t(WHITE));
    }
  }

  /** 턱 밑에 괸 백구 앞발 (발가락 사이 홈 두 줄) */
  function dogPaw(t) {
    const f = tone(t, FUR), paw = [[-.8, 0], [-1.2, -.9, -.5, -1.9, .8, -1.9], [7, -1.9], [9.6, -1.7, 10.8, -.9, 11, 0]];
    form(paw, f, [[-2, -.5], [12, -.5], [12, .2], [-2, .2]], [[-1.4, -1.95], [12, -1.95], [12, -1.55], [-1.4, -1.55]]);
    [.4, 1.4].forEach((x) => L(x, -.2, x + .15, -1.1, f.dark, .1));
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

    /* F1 — 내 앞에 내려온 백구 코. 엎드린 늙은 백구가 고개를 낮추고 킁킁, 콧구멍이 벌름거린다 */
    'fly:dogNose': { w: 36, h: 18, d: (time, t) => {
      const sniff = Math.max(0, Math.sin(time * 5)) * .12;
      faded(.2, () => E(16, -.05, 17, .45, t(INK)));
      ctx.save(); ctx.translate(-sniff, 0); dogHead(t, { eye: 'open' }); ctx.restore();
      faded(.35 * Math.max(0, Math.sin(time * 5 + 1.2)), () => E(-.8 - sniff, -2.9, .5, .25, t(WHITE)));
    } },

    /* D2 — 허공을 덥석 무는 백구 입. 이가 몇 개 없는 늙은 개의 송곳니 두 개 */
    'fly:dogJaw': { w: 36, h: 18, d: (time, t) => {
      const snap = Math.pow(Math.abs(Math.sin(time * 3.4)), 3) * .42;
      faded(.2, () => E(16, -.05, 17, .45, t(INK)));
      ctx.save(); ctx.translate(0, -4); dogHead(t, { eye: 'open', jaw: snap }); ctx.restore();
    } },

    /* F4·F12 — 앞발에 턱을 괴고 자는 백구. 눈을 감고 숨 쉴 때마다 머리가 오르내리고, 가끔 귀가 움찔한다 */
    'fly:sleepyEar': { w: 36, h: 20, d: (time, t) => {
      const breath = Math.sin(time * 1.1) * .1, beat = time * .8, ph = beat % 1;
      const twitch = hash(Math.floor(beat), 7) > .55 ? Math.sin(ph * Math.PI * 4) * .14 * (1 - ph) : 0;
      faded(.2, () => E(16, -.05, 17, .45, t(INK)));
      ctx.save(); ctx.translate(0, -1.7 + breath); dogHead(t, { eye: 'shut', ear: twitch }); ctx.restore();
      dogPaw(t);
    } },

    /* F3·D3 — 물그릇에 고개를 숙인 백구. 분홍 혀가 국자처럼 말려 물을 할짝할짝 퍼 올린다 */
    'fly:dogTongue': { w: 18, h: 24, d: (time, t) => {
      const lap = (Math.sin(time * 4) + 1) * .5, mx = .7, my = -6.3, len = 3.4 + lap * .9, p = tone(t, TONGUE);
      const tongue = [[mx - .6, my], [mx - .9, my + len * .5, mx - 1.5, my + len * .85, mx - .8, my + len], [mx + .1, my + len + .35, mx + 1.1, my + len * .85, mx + .9, my + len * .45], [mx + .8, my]];
      form(tongue, p, [[mx + .2, my], [mx + .3, my + len], [mx + 1.5, my + len], [mx + 1.5, my]], [[mx - 1.6, my], [mx - .4, my], [mx - .6, my + len * .6], [mx - 1.6, my + len * .7]]);
      faded(.7 * lap, () => drop(mx - 1.2, my + len + .5 + (1 - lap) * .6, .12, t('#cfe8f5')));
      ctx.save(); ctx.translate(-1, -5.5); ctx.rotate(-1.2); ctx.translate(0, 3.2);
      dogHead(t, { eye: 'open', jaw: .14 });
      ctx.restore();
    } },

    /* F3 — 스테인리스 물그릇. 테두리 너머 물 위에 내가 떠 있고, 내 둘레로 물결이 번진다. 안쪽 벽이 반짝인다 */
    'fly:waterBowl': { w: 22, h: 5, d: (time, t) => {
      const st = tone(t, '#c3c9d0'), water = t('#bfe0f0'), RIM_Y = -3.1, WATER_Y = -2.5;
      faded(.22, () => E(0, -.05, 9.6, .35, t(INK)));
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, RIM_Y, 10, 1.5, 0, Math.PI, TAU); ctx.ellipse(0, WATER_Y, 9.2, 1.15, 0, TAU, Math.PI, true); ctx.closePath();
      ctx.fillStyle = st.dark; ctx.fill(); ctx.clip();
      faded(.8, () => P([[-6.4, 0], [-5.8, -5], [-4.9, -5], [-5.5, 0]], st.lit)); faded(.5, () => P([[2.6, 0], [2.9, -5], [3.3, -5], [3, 0]], st.lit));
      ctx.restore();
      faded(.85, () => E(0, WATER_Y, 9.2, 1.15, water));
      faded(.5, () => [[-7, -2.9], [-1, -3.1], [4.5, -2.7]].forEach(([x, y], i) => L(x, y, x + 1.4 + i * .3, y, t(WHITE), .06)));
      ctx.save(); ctx.strokeStyle = t(WHITE); ctx.lineWidth = .05;
      for (let k = 0; k < 3; k++) {
        const ph = (time * .45 + k / 3) % 1;
        ctx.globalAlpha = .7 * (1 - ph); ctx.beginPath(); ctx.ellipse(-4, -2.35, .6 + ph * 2.6, .15 + ph * .45, 0, 0, TAU); ctx.stroke();
      }
      ctx.restore();
      const front = [[-10, RIM_Y], [-9.6, -2.2, -7, -1.6, 0, -1.6], [7, -1.6, 9.6, -2.2, 10, RIM_Y], [9.4, -1.2, 8.8, -.3, 8.4, 0], [-8.4, 0], [-8.8, -.3, -9.4, -1.2, -10, RIM_Y]];
      form(front, st, [[4, .2], [6.5, -1.4, 8.4, -2.6, 9.8, -3.4], [10.4, -3.4], [10.4, .2]], [[-10.4, .2], [-10.4, -3.4], [-7.2, -1.8], [-6.8, -.6, -6.6, 0]]);
      ctx.save(); ctx.strokeStyle = st.lit; ctx.lineWidth = .22; ctx.beginPath(); ctx.ellipse(0, RIM_Y, 10, 1.5, 0, 0, TAU); ctx.stroke(); ctx.restore();
    } },

    /* F2·D12 — 찌그러진 양은 냄비 밥그릇. 사료와 찬밥이 소복하고, 테두리로 된장국이 흘러내렸다 */
    'fly:dogBowl': { w: 25, h: 11, d: (time, t) => {
      const pot = tone(t, '#d8b45e'), food = tone(t, '#a9693c'), soup = t('#b7863f');
      ctx.save(); ctx.translate(12.2, 0);
      faded(.22, () => E(1, -.05, 11.5, .35, t(INK)));
      const mound = [[-8, -7.9], [-6, -10.4, -2, -10.9, 1, -10.6], [5, -10.3, 8, -9.6, 9.6, -7.9]];
      form(mound, food, [[3, -7.5], [4, -9, 6, -10.5, 10, -10.6], [10, -7.5]], [[-8.4, -7.5], [-6.4, -10.2, -2, -11, 0, -11], [-.5, -10, -5, -9.4, -8.4, -7.5]]);
      [[-5.5, -9.2, .3], [-2, -10.1, -.4], [1.6, -9.9, .8], [4.8, -9.3, .2], [-3.8, -8.5, 1.2]].forEach(([x, y, a]) => grain(x, y, a, .38, t));
      [[-1, -9.6], [3, -9.1], [6.8, -8.6], [-6.4, -8.4]].forEach(([x, y], i) => { ctx.save(); ctx.translate(0, y + .2); crumb(x, .3, i, t, '#8a5530'); ctx.restore(); });
      const body = [[-10, -7.9], [-10.3, -6.2], [-9.6, -4.9], [-9.9, -3.2], [-9.5, 0], [8.9, 0], [10.6, -4, 10.4, -7.9]];
      form(body, pot, [[5.6, .3], [6.8, -4, 6.6, -8.2], [11, -8.2], [11, .3]], [[-10.6, .3], [-10.6, -8.2], [-8.2, -8.2], [-8.6, -4, -8, .3]]);
      within(body, () => {
        faded(.45, () => curvy([[-10.4, -6.6], [-7.6, -6.4, -6.2, -5.4], [-7.4, -4.6, -9.6, -4.9]], pot.dark));   // 찌그러져 들어간 자리
        faded(.6, () => curvy([[-9.6, -4.9], [-7.4, -4.6, -6.2, -5.4], [-6.6, -4, -8.4, -3.4, -10, -3.4]], pot.lit));
      });
      form([[-10.6, -7.6], [10.8, -7.6], [10.8, -8.5], [-10.6, -8.5]], pot, null, [[-11, -8.6], [11, -8.6], [11, -8.2], [-11, -8.2]]);
      [[-12.2, -8], [11.2, -8]].forEach(([x, y], i) => {
        ctx.save(); ctx.strokeStyle = i ? pot.dark : pot.lit; ctx.lineWidth = .35; ctx.beginPath(); ctx.ellipse(x + .5, y + .5, 1, .55, 0, Math.PI * .9, Math.PI * 2.1); ctx.stroke(); ctx.restore();
      });
      faded(.85, () => curvy([[-3, -7.6], [-2.6, -6.2, -2.8, -4.4], [-2.2, -4, -2, -4.6], [-1.9, -6.2, -1.6, -7.6]], soup));
      const ph = (time * .4) % 1;
      faded(1 - ph, () => drop(-2.4, -3.8 + ph * 3.4, .14, soup));
      faded(.6, () => E(-2.6, -.08, 1.4, .12, soup));
      grain(-13.4, -.15, .4, .32, t);
      ctx.restore();
    } },

    /* F2 — 마당 흙에 늘어진 백구 쇠사슬. 볕에 데워진 녹슨 고리가 누웠다 섰다 이어지고, 백구가 움직이면 철렁 흔들린다 */
    'fly:chain': { w: 18, h: 3, d: (time, t) => {
      const rust = tone(t, '#94705a'), jerk = hash(Math.floor(time * .6), 9) > .6 ? Math.sin(time * 26) * .08 * (1 - (time * .6) % 1) : 0;
      ctx.save(); ctx.translate(jerk, 0);
      for (let i = 0; i < 8; i++) {
        const x = -8 + i * 2.1, lift = i > 5 ? (i - 5) * .7 : 0, y = -.35 - lift;
        if (i % 2) {
          form(roundBox(x - 1.2, y - .2, 2.4, .42, .2), rust, [[x - 1.3, y + .05], [x + 1.3, y + .05], [x + 1.3, y + .3], [x - 1.3, y + .3]], [[x - 1.3, y - .25], [x + 1.3, y - .25], [x + 1.3, y - .1], [x - 1.3, y - .1]]);
        } else {
          ctx.save(); ctx.strokeStyle = rust.mid; ctx.lineWidth = .36; ctx.beginPath(); ctx.ellipse(x, y, 1.15, .5, -lift * .15, 0, TAU); ctx.stroke();
          ctx.strokeStyle = rust.lit; ctx.lineWidth = .14; ctx.beginPath(); ctx.ellipse(x, y - .06, 1.15, .5, -lift * .15, Math.PI * 1.05, Math.PI * 1.7); ctx.stroke(); ctx.restore();
        }
      }
      ctx.restore();
      faded(.18, () => E(-.5, -.03, 8.5, .2, t(INK)));
    } },

    /* F4 — 할아버지 의자 밑 양은 막걸리 사발. 바깥으로 막걸리가 흘렀고, 테두리엔 날 따라온 수컷이 앉았다 */
    'fly:makgeolli': { w: 13, h: 5.5, d: (time, t) => {
      const bowl = tone(t, '#dcb55e'), milk = t('#f1ece0');
      faded(.2, () => E(-2, -.05, 5, .3, t(INK)));
      const b = [[-8.2, -4.6], [-7.6, -2, -5, -.9, -3.1, -.7], [-3.2, 0], [-.8, 0], [-.9, -.7], [1.2, -.9, 3.6, -2, 4.2, -4.6]];
      form(b, bowl, [[.6, .2], [2.6, -2, 3.4, -4, 3.4, -4.9], [4.6, -4.9], [4.6, .2]], [[-8.6, .2], [-8.6, -4.9], [-6.6, -4.9], [-6, -2.6, -4.6, -1.4, -3.4, .2]]);
      form([[-8.4, -4.4], [4.4, -4.4], [4.4, -4.9], [-8.4, -4.9]], bowl, null, [[-8.6, -5], [4.6, -5], [4.6, -4.75], [-8.6, -4.75]]);
      faded(.9, () => curvy([[-5.8, -4.4], [-5.5, -3.2, -5.1, -2.2], [-4.6, -2.1, -4.5, -2.6], [-4.7, -3.6, -4.9, -4.4]], milk));
      faded(.7, () => E(-4.2, -.08, 1.6, .14, milk));
      miniFly(1.6, -4.95, 1, time, t, {});
    } },

    /* F5·F10 — 할아버지 1톤 트럭 뒷바퀴와 흙받이. 실제로는 지름 60cm라 파리 눈엔 벽처럼만 보여서, 바퀴로 읽히게 지름 24cm로 줄였다.
       무늬 블록이 땅에 닿고, 흰 휠에 너트 다섯 개. 시동이 걸려 있으면 살짝 떤다 */
    'fly:truckBed': { w: 28, h: 26, d: (time, t) => {
      const shake = Math.sin(time * 31) * .02, tire = tone(t, TIRE), wheel = tone(t, '#d6d3da'), CX = 15, CY = -12, R0 = 12;
      faded(.35, () => E(CX, -.05, 10, .45, t(INK)));
      ctx.save(); ctx.translate(0, shake);
      const pts = [];
      for (let k = 0; k <= 72; k++) { const a = k / 72 * TAU, r = R0 - (k % 2) * .28; pts.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r]); }
      form(pts, tire, [[CX + 3, .5], [CX + 9, -4, CX + 10.5, -12, CX + 8, -20], [CX + 13, -20], [CX + 13, .5]], [[CX - 12.5, -9], [CX - 11, -17, CX - 6, -22, CX - 1, -24.4], [CX - 12.5, -24.4]]);
      ctx.save(); ctx.strokeStyle = tire.deep; ctx.lineWidth = .18; ctx.beginPath(); ctx.arc(CX, CY, R0 - 1.4, 0, TAU); ctx.stroke(); ctx.restore();
      E(CX, CY, 7.4, 7.4, tire.deep);
      form([[CX, CY - 6.8], [CX + 3.8, CY - 6.8, CX + 6.8, CY - 3.8, CX + 6.8, CY], [CX + 6.8, CY + 3.8, CX + 3.8, CY + 6.8, CX, CY + 6.8],
        [CX - 3.8, CY + 6.8, CX - 6.8, CY + 3.8, CX - 6.8, CY], [CX - 6.8, CY - 3.8, CX - 3.8, CY - 6.8, CX, CY - 6.8]], wheel,
        [[CX + 2.4, CY + 7.2], [CX + 6.2, CY + 2, CX + 6.2, CY - 3, CX + 3.6, CY - 7.2], [CX + 7.4, CY - 7.2], [CX + 7.4, CY + 7.2]], null);
      E(CX, CY, 2.4, 2.4, wheel.dark); E(CX - .2, CY - .2, 1.6, 1.6, wheel.lit);
      for (let k = 0; k < 5; k++) { const a = k / 5 * TAU - Math.PI / 2; E(CX + Math.cos(a) * 4, CY + Math.sin(a) * 4, .45, .45, wheel.dark); }
      form([[0, -26], [5.4, -26], [5.6, -4.4], [.2, -4]], tone(t, '#2f2b33'), [[4, -3.6], [4, -26.4], [5.8, -26.4], [5.8, -3.6]], [[-.4, -26.4], [5.8, -26.4], [5.8, -25], [-.4, -25]]);
      ctx.restore();
    } },

    /* F10 — 트럭 바퀴 옆에 떨어진 상자 조각. 하얀 개털 몇 가닥이 붙어 바람에 나풀거린다 */
    'fly:furTuft': { w: 11, h: 3, d: (time, t) => {
      const card = tone(t, '#d9b27c');
      faded(.2, () => E(0, -.04, 5.6, .2, t(INK)));
      form([[-5.2, 0], [4.6, 0], [5.4, -.55], [-4.4, -.55]], card, [[4.4, .2], [4.6, -.7], [5.6, -.7], [5.6, .2]], [[-5.4, -.7], [5.6, -.7], [5.6, -.45], [-5.4, -.45]]);
      ctx.save(); ctx.strokeStyle = t('#fbf7ee'); ctx.lineCap = 'round';
      for (let i = 0; i < 7; i++) {
        const x = -3.4 + i * 1.05 + hash(i, 3) * .4, len = 1.2 + hash(i, 4) * 1.4, a = -1.2 - hash(i, 5) * .7 + Math.sin(time * 1.6 + i) * .14;
        ctx.lineWidth = .05 + hash(i, 6) * .04; ctx.beginPath(); ctx.moveTo(x, -.55);
        ctx.quadraticCurveTo(x + Math.cos(a + .5) * len * .5, -.55 + Math.sin(a + .5) * len * .5, x + Math.cos(a) * len, -.55 + Math.sin(a) * len); ctx.stroke();
      }
      ctx.restore();
    } },

    /* F6·K1 — 시장 생선 가게 뒷문. 뒤에 쌓인 스티로폼 상자, 앞에 뒤집어 놓은 뚜껑 쟁반엔 녹는 얼음과 고등어 머리 */
    'fly:fishCrate': { w: 26, h: 15, d: (time, t) => {
      const sty = tone(t, '#f1efe8'), ice = tone(t, '#dcedf5'), back = tone(t, '#5f8aa5'), belly = tone(t, '#dfe3e8');
      ctx.save(); ctx.translate(11, 0);
      form(roundBox(3, -15, 13, 15, .6), sty, [[13.2, .2], [13.2, -15.2], [16.2, -15.2], [16.2, .2]], [[2.8, .2], [2.8, -15.2], [4.2, -15.2], [4.2, .2]]);
      faded(.5, () => R(3, -10.6, 13, .9, t('#6f9ccf')));
      [[-6, -2.7, .9], [-1.5, -2.9, 1.1], [5.5, -2.8, 1], [8.6, -2.6, .7]].forEach(([x, y, r]) => form([[x - r, y + .5], [x - r * .8, y - r * .5], [x, y - r * .8], [x + r, y - r * .2], [x + r * .9, y + .5]], ice, [[x + .1, y + .6], [x + .2, y - r], [x + r * 1.2, y - r], [x + r * 1.2, y + .6]], null));
      ctx.save(); ctx.translate(-.5, -3.1);
      const head = [[-5.2, -.6], [-4.6, -2, -3, -3.2, -.6, -3.6], [2.4, -3.8], [2.6, -2.6, 2.7, -.8, 2.4, .3], [-1, .4, -3.8, .3, -5.2, -.6]];
      form(head, back, [[-6, -1.2], [-3, -1.8, 0, -1.6, 3, -1.2], [3, .6], [-6, .6]], null);
      within(head, () => {
        curvy([[-6, -1.25], [-3, -1.85, 0, -1.65, 3, -1.25], [3, .6], [-6, .6]], belly.mid);
        curvy([[-6, -.2], [3, -.4], [3, .6], [-6, .6]], belly.dark);
        [[-.4, 0], [.9, .2]].forEach(([x]) => L(x, -3.7, x + .7, -2.3, back.deep, .22));
      });
      curvy([[2.4, -3.8], [3, -2.4, 3, -.8, 2.4, .3], [2.9, -.6, 2.9, -2.6, 2.4, -3.8]], t('#c4505a'));
      L(-1.4, -3, -1.9, -.3, back.deep, .12);
      E(-3.4, -1.9, .55, .55, t('#f4e9c0')); E(-3.35, -1.9, .3, .3, t(INK)); E(-3.5, -2.05, .1, .1, t(WHITE));
      ctx.restore();
      form([[-9.4, 0], [-9.6, -2.6], [11, -2.6], [10.8, 0]], sty, [[9.4, .2], [9.4, -2.8], [11.2, -2.8], [11.2, .2]], [[-9.8, -2.8], [11.2, -2.8], [11.2, -2.3], [-9.8, -2.3]]);
      const ph = (time * .5) % 1;
      faded(1 - ph, () => drop(-9.7, -2 + ph * 1.9, .13, ice.mid));
      faded(.5, () => E(-10.6, -.06, 1.3, .12, ice.mid));
      ctx.restore();
    } },

    /* K1 — 생선 쟁반 테두리에서 꼬물거리는 내 새끼 구더기들 */
    'fly:maggots': { w: 3.4, h: .6, d: (time, t) => {
      const p = tone(t, '#f3ead2');
      for (let i = 0; i < 5; i++) {
        const x = -1.4 + i * .7, w = Math.sin(time * 3 + i * 1.7);
        ctx.save(); ctx.translate(x, -.16); ctx.rotate(w * .12 + (i % 2 ? .2 : -.15)); ctx.scale(1 + w * .1, 1 - w * .06);
        form([[-.36, 0], [-.3, -.17, .2, -.2, .36, -.06], [.38, .06, .2, .14, -.3, .12]], p, [[-.4, .03], [.4, .03], [.4, .2], [-.4, .2]], null);
        L(-.08, -.15, -.1, .1, p.dark, .025); L(.12, -.16, .1, .1, p.dark, .025);
        ctx.restore();
      }
    } },

    /* F11 — 비 오는 밤의 나무 개집 입구. 문턱에 턱을 괸 백구가 자고, 따뜻한 숨이 입구 밖으로 흘러나온다 */
    'fly:doghouse': { w: 24, h: 26, d: (time, t) => {
      const wood = tone(t, '#c48f5e'), roof = tone(t, '#4f6b5a'), door = [[0, -2], [0, -12], [0, -16, 6, -18, 12, -16], [12, -12], [12, -2]];
      ctx.save(); ctx.translate(6.4, 0);
      form([[-6, 0], [-6, -24], [18, -24], [18, 0]], wood, [[14, .2], [14, -24.2], [18.2, -24.2], [18.2, .2]], [[-6.2, .2], [-6.2, -24.2], [-4.8, -24.2], [-4.8, .2]]);
      [-2.8, 15].forEach((x) => L(x, -1, x, -23.6, wood.dark, .1));
      curvy(door, t('#2c2430'));
      within(door, () => {
        faded(.35, () => E(6, -6, 7, 5, t('#5a4650')));
        ctx.save(); ctx.translate(1.4, -3 + Math.sin(time * 1.1) * .06); ctx.scale(.6, .6); dogHead(t, { eye: 'shut' }); ctx.restore();
        ctx.save(); ctx.translate(1.4, -2); ctx.scale(.6, .6); dogPaw(t); ctx.restore();
      });
      form([[-6.4, -2], [12.4, -2], [12.4, -.8], [-6.4, -.8]], wood, null, [[-6.6, -2.1], [12.6, -2.1], [12.6, -1.7], [-6.6, -1.7]]);
      form([[-8, -24], [20, -24], [21, -27], [-9, -27]], roof, [[17, -23.8], [17, -27.2], [21.2, -27.2], [21.2, -23.8]], null);
      const ph = (time * .35) % 1;
      faded(.4 * Math.sin(ph * Math.PI), () => wisps([.6], -3.6, 3.2, time, t('#fff3e0'), .8));
      ctx.restore();
    } },

    /* F12 — 내가 태어난 마당 구석. 백구가 아침에 눈 똥 무더기와, 그 밑에 낳아 둔 하얀 알 몇 알 */
    'fly:dungPile': { w: 5.5, h: 2.8, d: (time, t) => {
      const p = tone(t, '#6e4b30');
      faded(.22, () => E(0, -.04, 2.6, .16, t(INK)));
      [[0, -.55, 2.3, .6], [-.2, -1.35, 1.7, .5], [.1, -2, 1.05, .42]].forEach(([x, y, rx, ry]) => {
        const lump = [[x - rx, y + ry * .6], [x - rx * 1.05, y - ry * .5, x - rx * .4, y - ry * 1.1, x, y - ry], [x + rx * .6, y - ry * 1.1, x + rx * 1.05, y - ry * .3, x + rx, y + ry * .6]];
        form(lump, p, [[x + rx * .35, y + ry], [x + rx * .5, y - ry * 1.2], [x + rx * 1.2, y - ry * 1.2], [x + rx * 1.2, y + ry]], [[x - rx * 1.1, y - ry * .2], [x - rx * .6, y - ry * 1.2], [x, y - ry * 1.2], [x - rx * .5, y - ry * .6]]);
      });
      faded(.6, () => E(-.5, -2.25, .2, .07, t(WHITE)));
      [[-2.1, -.1], [-1.9, -.18], [-1.7, -.08], [-1.95, -.02]].forEach(([x, y], i) => E(x, y, .1, .045, t(i % 2 ? '#f6f1e2' : WHITE)));
      wisps([-.6, .6], -2.4, 1.6, time, t('#e8dcc8'), .25);
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
  };
})());
