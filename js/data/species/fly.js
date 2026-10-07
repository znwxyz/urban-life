/* 집파리 시나리오. 설계 문서: docs/scenarios/fly.md (문구는 이 파일이 기준) */
(function register(sp) {
  if (typeof module !== 'undefined' && module.exports) module.exports = sp;
  else registerSpecies(sp);
})({
  key: 'fly', name: '집파리', latin: 'Musca domestica', size: '0.7cm', body: 'fly',
  viewCm: 36, eye: 2.5, speedCm: 8, bornMonth: 7, kidUnit: '알',
  box: [-.55, -3.4, .65, -1.8],
  stats: { hp: 100, food: 50, decay: 8 },
  place: '분리수거장 음식물 수거통',
  intro: '아파트 분리수거장, 음식물 수거통 가장자리에서 번데기 껍질을 찢고 나왔다. 집파리의 한살이는 길어야 한 달이다.',
  start: 'F1', weakEnding: 'W0',
  main: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],

  scenes: {
    F1: { bg: 'recycling', day: 1, prop: 'foodBin', next: 'F2', title: '젖은 날개',
      text: '번데기에서 막 나왔다. 날개가 아직 구겨져 있고 축축하다.',
      choices: [
        { t: '바로 날아오른다', msg: '비틀거리며 떠올랐다.',
          risk: { p: .3, ending: 'D1', msg: '구겨진 날개로는 뜨지 못했다.' } },
        { t: '날개가 마를 때까지 기다린다', msg: '한 시간 뒤, 날개가 펴졌다.' },
      ] },
    F2: { bg: 'recycling', day: 2, night: true, prop: 'foodBin', next: 'F3', title: '수거차',
      text: '새벽, 수거차 후진 경고음이 가까워진다.',
      choices: [
        { t: '수거통 밖으로 날아오른다', fx: { food: -5 }, msg: '수거통이 들려 올라가는 걸 공중에서 봤다.' },
        { t: '통 깊숙이 파고든다', fx: { food: 15 }, msg: '수거차는 옆 동 통부터 비웠다. 그 틈에 빠져나왔다.',
          risk: { p: .35, ending: 'D2', msg: '수거통이 기울어졌다.' } },
      ] },
    F3: { bg: 'foodAlley', day: 4, next: 'F4', title: '식당가의 냄새',
      text: '식당가 뒷골목. 튀김기름, 생선, 음식물 봉투. 처마 밑 지름길에는 거미줄이 언뜻 보인다.',
      choices: [
        { t: '처마 밑 지름길로 간다', fx: { food: 5 }, msg: '실 한 가닥이 다리에 닿았지만 끊어냈다.',
          risk: { p: .3, ending: 'D3', msg: '날개가 실에 붙었다. 줄이 떨린다.' } },
        { t: '환기구 냄새를 따라간다', fx: { food: 10 }, msg: '환기구 아래 기름때에서 배를 채웠다.' },
      ] },
    F4: { bg: 'restaurant', day: 6, next: 'F5', title: '열린 주방 창문',
      text: '주방 창문이 반쯤 열려 있다. 조리대 위에 떡볶이 접시가 있다.',
      choices: [
        { t: '창틀에서 기다렸다가 밤에 들어간다', fx: { food: 15 }, msg: '영업이 끝난 주방. 조리대 위 소스 자국이 그대로다.' },
        { t: '지금 바로 조리대 위로', fx: { food: 30 }, msg: '떡볶이 접시 가장자리에 앉았다. 아무도 보지 못했다.',
          risk: { p: .35, ending: 'D4', msg: '"파리다!"' } },
      ] },
    F5: { bg: 'restaurant', day: 8, night: true, next: 'F6', title: '노란 리본',
      text: '천장에 노란 리본이 매달려 있다. 꿀 냄새가 난다. 동료 몇이 이미 붙어 있다.',
      choices: [
        { t: '꿀 냄새를 따라간다', fx: { food: 15 }, msg: '끈끈한 표면 바로 위에서 정신이 들었다.',
          risk: { p: .4, ending: 'D5', msg: '발이 붙었다.' } },
        { t: '리본을 피해 벽을 따라 나간다', fx: { food: -5 }, msg: '꿀 냄새가 오래 따라왔다.' },
      ] },
    F6: { bg: 'foodAlley', day: 10, prop: 'trashbag', next: 'F7', title: '첫 산란',
      text: '골목의 음식물 봉투가 찢어져 있다. 알을 낳기 좋은 곳이다.',
      choices: [
        { t: '봉투 깊숙이 알을 낳는다', fx: { kids: 120, hp: -10, food: 10 }, msg: '알 120개. 하루면 구더기가 된다.' },
        { t: '먹기만 하고 떠난다', set: 'noEggs', fx: { food: 20 }, msg: '배불리 먹고 날아올랐다.' },
      ] },
    F7: { bg: 'park', day: 14, weather: 'rain', next: 'F8', title: '소나기',
      text: '하늘이 갑자기 어두워졌다. 빗방울 하나가 내 몸무게보다 몇 배는 무겁다.',
      choices: [
        { t: '빗속을 뚫고 간다', fx: { food: 10 }, msg: '빗방울 사이로 빠져나가 쓰레기통에 먼저 닿았다.',
          risk: { p: .35, ending: 'D6', msg: '빗방울에 맞아 웅덩이에 처박혔다.' } },
        { t: '벤치 밑으로 숨는다', msg: '비가 그칠 때까지 꼼짝 않았다.' },
      ] },
    F8: { bg: 'park', day: 18, next: 'F9', title: '휘두르는 손',
      text: '벤치에서 김밥을 먹는 사람. 손이 계속 나를 쫓는다.',
      choices: [
        { t: '다른 냄새를 찾아 떠난다', msg: '바람을 따라 아파트 단지 쪽으로 날았다.' },
        { t: '한 번 더 앉아 본다', fx: { food: 20 }, msg: '세 번째 시도에 밥알 하나를 챙겼다.',
          risk: { p: .3, ending: 'D7', msg: '세 번째는 피하지 못했다.' } },
      ] },
    F9: { bg: 'kitchen', day: 22, next: 'F10', title: '열린 부엌 창',
      text: '아파트 저층 부엌 창이 열려 있다. 식탁 위엔 수박, 싱크대 아래엔 음식물 통.',
      choices: [
        { t: '식탁 위 수박으로', fx: { food: 30 }, msg: '달았다. 전기 파리채가 아슬아슬하게 비껴갔다.',
          risk: { p: .35, ending: 'D8', msg: '테니스채처럼 생긴 것이 휘둘러졌다.' } },
        { t: '싱크대 아래 음식물 통으로', fx: { food: 25 }, msg: '음식물 통 가장자리에서 실컷 먹었다. 집주인은 아직 모른다.' },
      ] },
    F10: { bg: 'kitchen', day: 28, next: [{ flag: 'noEggs', to: 'N1' }, { to: 'H1' }], title: '해진 날개',
      text: '날개 끝이 해졌다. 한 달 가까이 살았다.',
      choices: [
        { t: '창틀 햇볕에서 쉰다' },
        { t: '형광등을 향해 마지막으로 난다', msg: '형광등을 세 바퀴 돌고 창틀로 돌아왔다.',
          risk: { p: .4, ending: 'D9', msg: '형광등 주위를 맴돌다 떨어졌다.' } },
      ] },
  },

  endings: {
    H1: { kind: 'happy', day: 31, title: '창틀의 오후', cause: '노쇠', line: '햇볕 아래에서 다리를 모았다. 골목 어딘가에서 120마리가 날개를 말리고 있다.' },
    N1: { kind: 'normal', day: 31, title: '홀가분한 한 달', cause: '노쇠', line: '한 달을 다 살았다. 남긴 것은 없었다.' },
    D1: { kind: 'dead', after: 0, title: '젖은 날개', cause: '익사', line: '음식물 국물 속으로 떨어졌다.' },
    D2: { kind: 'dead', after: 0, title: '압착', cause: '쓰레기 수거차', line: '압착기가 닫혔다.' },
    D3: { kind: 'dead', after: 0, title: '처마 밑', cause: '거미', line: '줄 끝에서 주인이 내려왔다.' },
    D4: { kind: 'dead', after: 0, title: '파리채', cause: '파리채', line: '떡볶이는 맛있었다.' },
    D5: { kind: 'dead', after: 0, title: '노란 리본', cause: '끈끈이', line: '버둥댈수록 날개도 붙었다.' },
    D6: { kind: 'dead', after: 0, title: '빗방울', cause: '빗방울', line: '소나기는 금방 그쳤다.' },
    D7: { kind: 'dead', after: 0, title: '손바닥', cause: '손바닥', line: '김밥 한 줄의 대가였다.' },
    D8: { kind: 'dead', after: 0, title: '전기 파리채', cause: '전기 파리채', line: '타닥.' },
    D9: { kind: 'dead', after: 0, title: '형광등', cause: '탈진', line: '파리는 빛을 떠나지 못한다.' },
    W0: { kind: 'dead', after: 0, title: '쇠약', cause: '굶주림', line: '날개가 더는 떨리지 않았다.' },
  },
});
