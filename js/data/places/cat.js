/* 길고양이 전용 배경. 키는 'cat' 접두어로 시작한다 (예: 'catRooftop'). 형식은 js/data/scenes.js와 같다.
   looks(): 브라우저에서만, 모든 그림 모듈(backdrop.js·scene.js)이 읽힌 뒤 실행된다.
   새 원경(FAR)·전경(FG)·바닥 장식(FLOOR_DECO)·재질(MATERIALS)·사물(ITEMS)을 여기서 더할 수 있다 */
(function register(places, looks) {
  if (typeof module !== 'undefined' && module.exports) module.exports = places;
  else { Object.assign(SCENES, places); looks(); }
})({
}, () => {
});
