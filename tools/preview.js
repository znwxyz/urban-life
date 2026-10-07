/* 개발용 미리보기. 게임 페이지에 주입해서 쓴다 (tools/shoot.sh 참고). 배포 화면에서는 불러오지 않는다
   - previewScene('fly', 'F8'): 그 장면에서 동물이 멈춰 선 순간을 그린다 (선택 카드 포함)
   - artSheet('fly:'): 키가 그 접두어로 시작하는 그림을 격자로 한 장에 그린다 (칸마다 키와 폭 cm 표시) */
function stopLoop() { window.requestAnimationFrame = () => 0; }

function previewScene(spKey, sceneId, opts = {}) {
  stopLoop();
  const sp = SPECIES[spKey];
  if (!sp || !sp.scenes[sceneId]) throw new Error(`없는 장면: ${spKey} ${sceneId}`);
  closeWall(); $('picker').hidden = true; stopIris();
  run = { ...newRun(sp), at: sceneId, day: sp.scenes[sceneId].day || 1 };
  enterScene(); clearTimeout(moveTimer);
  Object.assign(view, { trans: null, fade: 0, speed: 0, t: opts.t || 1.3 });
  view.camX = view.propX - PROP_SCREEN_X * sp.viewCm;
  if (opts.card !== false) showChoice(); else { hideCard(); hideCaption(); }
  drawScene(view, sp, 0);
  return 'ok';
}

function previewEnding(spKey, endingId) {
  stopLoop();
  const sp = SPECIES[spKey], e = sp.endings[endingId];
  if (!e) throw new Error(`없는 엔딩: ${spKey} ${endingId}`);
  hideCard(); hideCaption(); $('picker').hidden = true; closeWall();
  Object.assign(view, { trans: null, fade: 0, speed: 0, t: 1.3, killer: e.actor ? { ...e.actor, t0: performance.now() - 1000 } : null });
  drawScene(view, sp, 0);
  return 'ok';
}

function artSheet(prefix, cols = 4) {
  stopLoop();
  $('picker').hidden = true; hideCard(); hideCaption(); closeWall(); updateHud(null, null);
  const keys = Object.keys(ACTORS).filter((k) => k.startsWith(prefix));
  const rows = Math.ceil(keys.length / cols), cw = W / cols, ch = H / Math.max(rows, 1);
  ctx.fillStyle = '#f3ead8'; ctx.fillRect(0, 0, W, H);
  keys.forEach((k, i) => {
    const a = ACTORS[k], cx = (i % cols) * cw, cy = Math.floor(i / cols) * ch;
    ctx.fillStyle = (i + Math.floor(i / cols)) % 2 ? '#ece0c9' : '#f6eedd'; ctx.fillRect(cx, cy, cw, ch);
    const s = Math.min((cw * .8) / Math.max(a.w, .1), (ch * .7) / Math.max(a.h, .1));
    drawActor(k, cx + cw / 2, cy + ch * .86, s, false, 1.3, (c) => c);
    ctx.fillStyle = '#3b3049'; ctx.font = '12px sans-serif'; ctx.fillText(`${k}  (${a.w}×${a.h}cm)`, cx + 8, cy + 16);
  });
  return keys.length;
}
