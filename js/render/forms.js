/* 형체감 있는 색종이 오리기 도구.
   사물은 곡선 외곽 하나로 오리고, 왼쪽 위에서 오는 빛으로 면을 2~3톤만 나눈다 (모뉴먼트 밸리식).
   좌표는 cm, 위쪽이 +y. (ox, oy)는 화면 위 원점(보통 왼쪽 발밑), s는 px/cm */
const LIT_TO = '#fffaf0', LIT_AMOUNT = .24;

/** 한 색에서 나온 면 톤: 윗면·왼쪽(lit) · 앞면(mid) · 오른쪽 옆면(dark) · 안쪽 그늘(deep) */
function planes(t, c) {
  return { lit: t(mix(c, LIT_TO, LIT_AMOUNT)), mid: t(c), dark: t(shade(c)), deep: t(shade(shade(c))) };
}

/** cm 패스를 화면 좌표로 그린다 (칠하지 않는다). 점 형식은 curvy와 같다: [x,y] · [cx,cy,x,y] · [c1x,c1y,c2x,c2y,x,y] */
function tracePath(ox, oy, s, pts) {
  const X = (v) => ox + v * s, Y = (v) => oy - v * s;
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (!i) ctx.moveTo(X(p[0]), Y(p[1]));
    else if (p.length === 2) ctx.lineTo(X(p[0]), Y(p[1]));
    else if (p.length === 4) ctx.quadraticCurveTo(X(p[0]), Y(p[1]), X(p[2]), Y(p[3]));
    else ctx.bezierCurveTo(X(p[0]), Y(p[1]), X(p[2]), Y(p[3]), X(p[4]), Y(p[5]));
  });
  ctx.closePath();
}

/** cm 패스 하나를 오려 붙인다 */
function cut(ox, oy, s, pts, c) { tracePath(ox, oy, s, pts); ctx.fillStyle = c; ctx.fill(); }

/** 외곽(pts) 안쪽에만 draw()가 칠해지게 한다. 면 나누기를 실루엣 밖으로 삐져나오지 않게 할 때 쓴다 */
function within(ox, oy, s, pts, draw) {
  ctx.save(); tracePath(ox, oy, s, pts); ctx.clip(); draw(); ctx.restore();
}

/**
 * 골판지 상자 (위가 열린). 원점은 앞면 왼쪽 아래. w·h 앞면 크기, d 깊이(오른쪽 위로 물러나는 양)
 * back(): 안쪽 그늘과 뒤 날개 — 그 다음 상자 안 물건을 그리고 — front(): 앞면·옆면·옆 날개·테이프
 */
function carton(ox, oy, s, w, h, d, c, t) {
  const p = planes(t, c), dx = d, dy = d * .62, bow = w * .025;
  return {
    back() {
      cut(ox, oy, s, [[dx, h + dy], [dx - w * .04, h + dy + h * .3], [w * .66 + dx, h + dy + h * .36], [w * .84 + dx, h + dy + h * .26, w + dx, h + dy]], p.lit);   // 뒤로 젖혀진 날개
      cut(ox, oy, s, [[w * .66 + dx, h + dy + h * .36], [w * .84 + dx, h + dy + h * .26], [w * .78 + dx, h + dy + h * .42]], p.mid);                      // 꺾인 귀
      cut(ox, oy, s, [[0, h], [w, h], [w + dx, h + dy], [dx, h + dy]], p.deep);                                                                  // 열린 안쪽
      cut(ox, oy, s, [[0, h], [w, h], [w + dx * .5, h + dy * .5], [dx * .5, h + dy * .5]], p.dark);                                               // 앞 벽 안쪽
    },
    front() {
      cut(ox, oy, s, [[w, 0], [w + dx, dy], [w + dx + bow * .6, (h + dy) * .5, w + dx, h + dy], [w, h]], p.dark);                                  // 옆면
      cut(ox, oy, s, [[0, 0], [w * .5, -bow * .4, w, 0], [w + bow, h * .5, w, h], [w * .78, h - bow * .5], [w * .5, h - bow * .2, 0, h], [-bow, h * .5, 0, 0]], p.mid);
      cut(ox, oy, s, [[w * .43, h], [w * .53, h], [w * .53, h * .66], [w * .43, h * .6]], p.lit);                             // 테이프 한 줄
      cut(ox, oy, s, [[0, h], [dx, h + dy], [-w * .08, h + dy * 1.25, -w * .22, h + dy * .7], [-w * .2, h * .9], [-w * .1, h * .88, 0, h]], p.lit);   // 왼쪽 날개 (밖으로 젖혀짐)
      cut(ox, oy, s, [[w, h], [w + dx, h + dy], [w + dx + w * .14, h + dy * .2], [w + dx + w * .08, h * .62, w + w * .08, h * .52]], p.mid);       // 오른쪽 날개 (옆으로 처짐)
    },
  };
}
