/* 거리에서 자주 보이는 큰 사물. 형식은 items-outdoor.js와 같다: d(x, 지면y, px/cm, 난수, 색조함수).
   곡선 외곽 하나로 오리고, 왼쪽 위 빛으로 윗면(밝음)·앞면·오른쪽 옆면(그늘) 2~3톤만 나눈다.
   안쪽 무늬는 의미 있는 선 한두 개(상자 테이프, 차 문틈)만 남긴다 */
const STREET_INK = '#2f2a3a';

/** 굵기가 있는 선을 둥근 끝으로 긋는다 (자전거 관·끈) */
function rodAt(ox, oy, s, pts, c, w) {
  ctx.strokeStyle = c; ctx.lineWidth = Math.max(.8, w * s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  pts.forEach((p, i) => {
    const X = (k) => ox + p[k] * s, Y = (k) => oy - p[k + 1] * s;
    if (!i) ctx.moveTo(X(0), Y(0));
    else if (p.length === 2) ctx.lineTo(X(0), Y(0));
    else ctx.quadraticCurveTo(X(0), Y(0), X(2), Y(2));
  });
  ctx.stroke();
}

/** 바퀴 하나: 타이어 고리, 밝은 휠, 가운데 축 */
function wheelAt(cx, cy, rad, s, t, tire, rim, hubR) {
  ctx.strokeStyle = t(tire); ctx.lineWidth = Math.max(1, rad * .2 * s);
  ctx.beginPath(); ctx.arc(cx, cy, rad * .9 * s, 0, TAU); ctx.stroke();
  ctx.strokeStyle = t(rim); ctx.lineWidth = Math.max(.5, rad * .035 * s);
  ctx.beginPath(); ctx.arc(cx, cy, rad * .76 * s, 0, TAU); ctx.stroke();
  E(cx, cy, hubR * s, hubR * s, t(rim));
}

Object.assign(ITEMS, {
  /* 위가 열린 골판지 상자: 살짝 부푼 앞면, 젖혀진 날개, 테이프 한 줄 */
  box: { w: 55, h: 40, d: (x, g, s, r, t) => {
    footShadow(x + 27 * s, g, 28 * s, s);
    const b = carton(x, g, s, 44, 31, 10, '#d9b27c', t);
    b.back(); b.front();
  } },
  /* 납작하게 접어 노끈으로 묶은 상자 더미: 장마다 어긋난 끝, 맨 위 장은 귀퉁이가 들림 */
  cardboard: { w: 96, h: 32, d: (x, g, s, r, t) => {
    const A = planes(t, '#d9b27c'), B = planes(t, '#c9a06a'), offs = [1, 6, 0, 4], th = 6.4;
    footShadow(x + 48 * s, g, 48 * s, s);
    offs.forEach((o, k) => {
      const y = k * th, p = k % 2 ? B : A, L0 = o, R0 = o + 84;
      cut(x, g, s, [[R0, y], [R0 + 5, y + 3], [R0 + 5, y + th + 3], [R0, y + th]], p.dark);
      cut(x, g, s, [[L0, y], [R0, y], [R0 + .6, y + th * .5, R0, y + th], [(L0 + R0) / 2, y + th - .7, L0, y + th], [L0 - .8, y + th * .5, L0, y]], p.mid);
    });
    const top = offs.length * th, o = offs[offs.length - 1];
    cut(x, g, s, [[o, top], [o + 66, top], [o + 74, top + 6], [o + 6, top + 3]], A.lit);
    cut(x, g, s, [[o + 66, top], [o + 84, top], [o + 92, top + 6], [o + 74, top + 9]], B.lit);     // 들린 귀퉁이
    [30, 58].forEach((cx) => rodAt(x, g, s, [[cx, 0], [cx, top], [cx + 4, top + 3]], t('#f4f1ea'), 1.2));   // 노끈
  } },
  /* 묶은 쓰레기봉투: 매듭 귀 두 개, 아래로 퍼져 주저앉은 몸통 */
  trashbag: { w: 62, h: 72, d: (x, g, s, r, t) => {
    const p = planes(t, r < .5 ? '#f5f0df' : '#d6e09a');
    const body = [[8, 0], [-4, 2, -3, 22, 4, 34], [10, 44, 20, 50, 27, 54], [31, 55], [35, 54], [44, 50, 52, 42, 54, 34], [64, 26, 66, 6, 54, 0], [30, -1.5, 8, 0]];
    footShadow(x + 31 * s, g, 31 * s, s);
    cut(x, g, s, body, p.mid);
    within(x, g, s, body, () => {
      cut(x, g, s, [[44, -2], [40, 18, 46, 36, 36, 54], [70, 50], [70, -2]], p.dark);                // 오른쪽으로 돌아가는 그늘
      cut(x, g, s, [[-4, 16], [-3, 30, 4, 38], [10, 44, 20, 50, 27, 54], [28, 50], [16, 45, 8, 36, 5, 20], [0, 14, -4, 16]], p.lit);   // 어깨에 받은 볕
    });
    cut(x, g, s, [[27, 53], [26, 58], [18, 66, 20, 70, 24, 69], [28, 66, 30, 62], [33, 66, 38, 72, 41, 70], [42, 66, 36, 60, 34, 57], [35, 53]], p.mid);   // 매듭
    cut(x, g, s, [[31, 61], [33, 66, 38, 72, 41, 70], [42, 66, 36, 60, 34, 57]], p.dark);
  } },
  /* 동네 장바구니 자전거: 내려앉은 프레임, 뒤로 휜 핸들, 펜더와 앞 바구니 */
  bike: { w: 175, h: 100, d: (x, g, s, r, t) => {
    const fc = r < .5 ? '#4a4f63' : '#5f8fb0', F = planes(t, fc), M = planes(t, '#c9c4cc');
    [[35, 33], [140, 33]].forEach(([wx, wy]) => wheelAt(x + wx * s, g - wy * s, 33, s, t, STREET_INK, '#b9b3c4', 3));
    [[35, Math.PI * 1.05, Math.PI * 1.85], [140, Math.PI * 1.15, Math.PI * 1.95]].forEach(([wx, a0, a1]) => {          // 펜더
      ctx.strokeStyle = M.mid; ctx.lineWidth = Math.max(.8, 2.4 * s); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(x + wx * s, g - 33 * s, 36 * s, a0, a1); ctx.stroke();
    });
    rodAt(x, g, s, [[35, 33], [88, 28], [80, 76]], F.dark, 2.6);                                          // 뒤 삼각(그늘 쪽)
    rodAt(x, g, s, [[35, 33], [80, 72]], F.dark, 2.2);
    rodAt(x, g, s, [[129, 70], [96, 34, 88, 28]], F.mid, 4.4);                                            // 내려앉은 앞 관
    rodAt(x, g, s, [[129, 70], [133, 52, 140, 33]], F.mid, 3);                                            // 휜 앞 포크
    rodAt(x, g, s, [[127, 66], [131, 82], [129, 90], [120, 97, 108, 92]], F.mid, 2.8);                     // 핸들 기둥과 뒤로 휜 핸들
    rodAt(x, g, s, [[110, 93], [104, 91]], t(STREET_INK), 4);                                             // 손잡이
    rodAt(x, g, s, [[80, 76], [76, 86]], M.dark, 2.4);                                                   // 안장 기둥
    cut(x, g, s, [[64, 87], [62, 92, 70, 93, 76, 91], [88, 90], [89, 88, 86, 86, 78, 86], [72, 84, 66, 84, 64, 87]], t(STREET_INK));   // 안장
    E(x + 88 * s, g - 28 * s, 7 * s, 7 * s, F.dark); rodAt(x, g, s, [[88, 28], [94, 18]], M.mid, 2); RR(x + 89 * s, g - 19 * s, 10 * s, 3 * s, 1.5 * s, t(STREET_INK));
    cut(x, g, s, [[132, 70], [164, 70], [168, 88], [128, 88]], M.mid);                                   // 앞 바구니
    cut(x, g, s, [[164, 70], [168, 72], [172, 90], [168, 88]], M.dark);
    cut(x, g, s, [[128, 88], [168, 88], [172, 90], [132, 91]], M.lit);
  } },
  /* 동네 세단: 앞이 왼쪽. 외곽 하나에 바퀴 홈을 파고, 지붕·보닛 윗면은 밝게, 어깨선 아래는 그늘 */
  car: { w: 430, h: 145, d: (x, g, s, r, t) => {
    const p = planes(t, pick(['#f3e9dc', '#e6765f', '#5fa39a', '#8c7fa8'], r)), glass = t('#cfe3ea');
    const body = [[10, 24], [2, 34, 2, 52], [3, 60, 8, 66], [40, 78, 112, 86], [140, 128, 170, 140], [196, 146, 288, 146, 304, 138], [328, 120, 352, 98],
      [400, 94, 420, 90], [430, 82, 430, 52], [430, 34, 424, 26], [372, 26], [370, 80, 300, 80, 298, 26], [134, 26], [132, 80, 60, 80, 58, 26]];
    footShadow(x + 215 * s, g, 210 * s, s);
    ctx.save(); ctx.beginPath(); ctx.rect(x, g - 120 * s, 430 * s, 94 * s); ctx.clip();
    [95, 335].forEach((wx) => E(x + wx * s, g - 30 * s, 40 * s, 40 * s, p.deep));                   // 바퀴 홈 안쪽
    ctx.restore();
    cut(x, g, s, body, p.lit);
    within(x, g, s, body, () => {
      ctx.save(); ctx.translate(0, 7 * s); cut(x, g, s, body, p.mid); ctx.restore();                 // 윗면만 밝게 남는다
      cut(x, g, s, [[-5, 56], [140, 60, 300, 62, 440, 58], [440, 0], [-5, 0]], p.dark);              // 어깨선 아래 그늘
    });
    cut(x, g, s, [[124, 90], [150, 126, 172, 134], [210, 136], [210, 92]], glass);                     // 앞 유리창
    cut(x, g, s, [[222, 92], [222, 136], [282, 136, 296, 130], [312, 114, 326, 96]], glass);           // 뒤 유리창
    ctx.save(); ctx.globalAlpha = .4; cut(x, g, s, [[146, 94], [168, 132], [178, 132], [158, 94]], '#ffffff'); ctx.restore();
    rodAt(x, g, s, [[216, 92], [218, 40]], p.deep, 1.6);                                               // 문틈 한 줄
    cut(x, g, s, [[6, 58], [12, 66, 26, 70], [30, 62], [8, 56]], t('#fff1b8'));                        // 전조등
    cut(x, g, s, [[420, 86], [429, 84, 430, 72], [418, 74]], t('#e6765f'));                           // 후미등
    RR(x + 182 * s, g - 50 * s, 66 * s, 13 * s, 3 * s, t('#f4f1ea'));                                 // 번호판
    [95, 335].forEach((wx) => {
      E(x + wx * s, g - 32 * s, 32 * s, 32 * s, t('#3a3445'));
      E(x + wx * s, g - 32 * s, 17 * s, 17 * s, t('#cfcad8')); E(x + (wx + 3) * s, g - 30 * s, 13 * s, 13 * s, t('#aaa5b8'));
    });
  } },
  /* 가로수: 볕 받는 왼쪽 위와 그늘진 오른쪽 아래로 나뉜 수관 하나, 뿌리가 퍼진 줄기 */
  tree: { w: 300, h: 620, d: (x, g, s, r, t) => {
    const bark = planes(t, '#8a6a52');
    const trunk = [[122, 0], [134, 8, 136, 30], [142, 160, 136, 250], [108, 300, 92, 340], [106, 344], [134, 306, 150, 282], [164, 310, 194, 340], [206, 334], [178, 300, 164, 250],
      [158, 160, 164, 30], [168, 8, 184, 0]];
    footShadow(x + 150 * s, g, 110 * s, s);
    cut(x, g, s, trunk, bark.mid);
    within(x, g, s, trunk, () => cut(x, g, s, [[154, 0], [150, 120, 152, 270], [212, 350], [212, 0]], bark.dark));
    leafMass(x + 150 * s, g - 450 * s, 142 * s, 140 * s, r, t, 8);
  } },
  /* 땅에 붙은 덤불: 밑동이 땅에 눌려 반구가 된 잎 덩어리 */
  shrub: { w: 90, h: 60, d: (x, g, s, r, t) => {
    footShadow(x + 45 * s, g, 44 * s, s);
    ctx.save(); ctx.beginPath(); ctx.rect(x - 20 * s, g - 90 * s, 130 * s, 90 * s); ctx.clip();
    leafMass(x + 45 * s, g - 24 * s, 46 * s, 34 * s, r, t, 6);
    ctx.restore();
  } },
  /* 공원 벤치: 무쇠 옆틀 두 개, 볕 받는 앉는 판 윗면, 등받이 두 장 */
  bench: { w: 160, h: 85, d: (x, g, s, r, t) => {
    const W = planes(t, '#d08c62'), I = planes(t, '#4a4f63');
    footShadow(x + 80 * s, g, 80 * s, s);
    [10, 140].forEach((lx) => {
      cut(x, g, s, [[lx - 3, 0], [lx + 2, 4, lx + 3, 14], [lx + 2, 44], [lx + 4, 66, lx + 1, 88], [lx + 8, 88], [lx + 11, 66, lx + 9, 44], [lx + 8, 14], [lx + 9, 4, lx + 14, 0]], I.mid);
      cut(x, g, s, [[lx + 6, 2], [lx + 8, 14], [lx + 9, 44], [lx + 11, 66, lx + 8, 88], [lx + 11, 0]], I.dark);
    });
    [[64, 72], [76, 84]].forEach(([y0, y1]) => {                                                     // 등받이 두 장
      cut(x, g, s, [[0, y0], [160, y0], [160, y1], [0, y1]], W.mid);
      cut(x, g, s, [[0, y1 - 1.6], [160, y1 - 1.6], [160, y1], [0, y1]], W.lit);
    });
    cut(x, g, s, [[-2, 50], [162, 50], [166, 57], [2, 57]], W.lit);                                  // 앉는 판 윗면
    cut(x, g, s, [[-2, 43], [162, 43], [162, 50], [-2, 50]], W.mid);                                 // 앉는 판 앞 모서리
    cut(x, g, s, [[-2, 43], [162, 43], [162, 44.6], [-2, 44.6]], W.dark);
  } },
  /* 바퀴 달린 분리수거통: 뚜껑 윗면은 밝게, 오른쪽 옆면은 그늘, 뚜껑 밑 그림자 */
  recycleBin: { w: 70, h: 112, d: (x, g, s, r, t) => {
    const c = pick(['#5f8fb0', '#6fae7f', '#f0c27a', '#e6765f'], r), p = planes(t, c);
    footShadow(x + 35 * s, g, 36 * s, s);
    cut(x, g, s, [[56, 98], [66, 104], [62, 6], [54, 2]], p.dark);                                 // 옆면
    cut(x, g, s, [[8, 0], [54, 0], [55, 50, 57, 98], [3, 98], [5, 50, 8, 0]], p.mid);                // 앞면 (아래로 좁아짐)
    cut(x, g, s, [[3, 98], [57, 98], [57, 93], [4, 92]], p.dark);                                     // 뚜껑 밑 그림자
    cut(x, g, s, [[58, 106], [60, 113, 72, 113, 72, 106], [70, 106], [69, 110, 62, 110, 61, 106]], p.deep);   // 뒤 손잡이
    cut(x, g, s, [[-1, 97], [58, 97], [70, 106], [12, 106]], p.lit);                                 // 뚜껑 윗면
    cut(x, g, s, [[-2, 101], [-1, 96], [59, 96], [58, 101]], p.mid);                                  // 뚜껑 앞 테
    E(x + 59 * s, g - 7 * s, 7 * s, 7 * s, t(STREET_INK)); E(x + 59 * s, g - 7 * s, 2.6 * s, 2.6 * s, t('#9a95a8'));
    E(x + 30 * s, g - 62 * s, 13 * s, 13 * s, t('#fffaf0'));
    ctx.strokeStyle = p.mid; ctx.lineWidth = Math.max(1, 2 * s); ctx.lineCap = 'round'; ctx.beginPath();   // 재활용 화살표
    for (let k = 0; k < 3; k++) { const a = k * TAU / 3 - .3; ctx.moveTo(x + 30 * s + Math.cos(a) * 7.5 * s, g - 62 * s + Math.sin(a) * 7.5 * s); ctx.lineTo(x + 30 * s + Math.cos(a + 1.6) * 7.5 * s, g - 62 * s + Math.sin(a + 1.6) * 7.5 * s); }
    ctx.stroke();
  } },
  /* 콘크리트 전봇대: 둥근 기둥을 세 톤 띠로, 변압기 통, 완목과 애자, 떼다 남은 전단지 */
  pole: { w: 30, h: 900, d: (x, g, s, r, t) => {
    const p = planes(t, '#a29fb2'), K = planes(t, '#8d8a9c'), body = [[0, 0], [3, 900], [23, 900], [26, 0]];
    footShadow(x + 13 * s, g, 18 * s, s);
    cut(x, g, s, body, p.mid);
    within(x, g, s, body, () => { cut(x, g, s, [[-2, 0], [2, 900], [8, 900], [6, 0]], p.lit); cut(x, g, s, [[18, 0], [17, 900], [28, 900], [28, 0]], p.dark); });
    cut(x, g, s, [[-2, 150], [28, 152], [27, 196], [24, 192], [20, 197], [14, 191], [8, 196], [3, 191], [-2, 194]], t('#e8c24a'));   // 떼다 남은 전단지
    for (let k = 0; k < 6; k++) RR(x + (k % 2 ? 22 : -4) * s, g - (300 + k * 40) * s, 8 * s, 3 * s, 1.5 * s, t('#5f5a6e'));   // 발판 못
    cut(x, g, s, [[-60, 840], [86, 840], [86, 850], [-60, 850]], K.mid); cut(x, g, s, [[-60, 840], [86, 840], [86, 843], [-60, 843]], K.dark);
    cut(x, g, s, [[-40, 790], [66, 790], [66, 798], [-40, 798]], K.mid);
    [-55, -20, 50, 80].forEach((dx) => cut(x, g, s, [[dx, 850], [dx - 1, 856, dx + 1, 862], [dx + 5, 862], [dx + 7, 856, dx + 6, 850]], t('#f4f1ea')));   // 애자
    const T = [[30, 650], [28, 690, 30, 718], [49, 726, 68, 718], [70, 690, 68, 650], [49, 644, 30, 650]];   // 변압기
    cut(x, g, s, T, K.mid);
    within(x, g, s, T, () => { cut(x, g, s, [[26, 640], [36, 640], [36, 730], [26, 730]], K.lit); cut(x, g, s, [[58, 640], [72, 640], [72, 730], [58, 730]], K.dark); });
    cut(x, g, s, [[30, 718], [49, 728, 68, 718], [49, 712, 30, 718]], K.lit);
    cut(x, g, s, [[26, 760], [120, 760], [110, 740], [26, 745]], t('#e9e4f0'));
  } },
});
