/* 바퀴벌레(독일바퀴) 시나리오. 설계 문서: docs/scenarios/cockroach.md (문구는 이 파일이 기준) */
(function register(sp) {
  if (typeof module !== 'undefined' && module.exports) module.exports = sp;
  else registerSpecies(sp);
})({
  key: 'cockroach', name: '바퀴벌레', latin: 'Blattella germanica', size: '1.3cm', body: 'cockroach',
  viewCm: 40, eye: .5, speedCm: 10, bornMonth: 6, kidUnit: '새끼',
  box: [-.75, -1.1, 1.45, 0],
  stats: { hp: 100, food: 60, decay: 12 },
  place: '식당 주방',
  intro: '도심 식당가, 분식집 주방 벽 틈의 알집에서 형제 39마리와 함께 깼다. 독일바퀴는 식당과 아파트에 사는 종이다. 암컷은 알집을 부화 직전까지 몸에 달고 다닌다.',
  start: 'R1', weakEnding: 'W0',
  main: [1, 0, 1, 0, 0, 1, 0, 1, 0],

  scenes: {
    R1: { bg: 'restaurant', day: 7, next: 'R2', title: '방역하는 날',
      text: '오늘은 방역업체가 다녀간 날. 바닥 여기저기에서 처음 맡는 단 냄새가 난다.',
      choices: [
        { t: '부스러기를 먹으러 나간다', fx: { food: 25 }, msg: '바닥은 부스러기 천국이었다.',
          risk: { p: .3, ending: 'D1', msg: '단 냄새 나는 젤을 한 입 먹었다.' } },
        { t: '벽 틈 깊숙이 숨는다', fx: { food: -5 }, msg: '벽 틈 깊은 곳에서 사흘을 버텼다. 나갔던 형제들은 돌아오지 않았다.' },
      ] },
    R2: { bg: 'restaurant', day: 42, prop: 'deliveryBag', next: 'R3', title: '배달 봉투',
      text: '주문이 밀린 저녁. 포장대 위에 배달 봉투가 줄지어 있다.',
      choices: [
        { t: '봉투 속 냅킨 사이로 숨는다', fx: { food: 5 }, msg: '봉투가 흔들린다. 오토바이 엔진의 진동, 그리고 엘리베이터의 띵 소리.' },
        { t: '주방에 남는다', to: 'K1', fx: { food: 20 }, msg: '주방은 넓고 먹을 것은 많다. 사람도 많다.' },
      ] },
    R3: { bg: 'entrance', day: 43, night: true, prop: 'deliveryBag', next: 'R4', title: '현관의 봉투',
      text: '아파트 12층. 봉투가 현관 바닥에 놓이고, 사람이 매듭을 푼다.',
      choices: [
        { t: '거실을 가로질러 달린다', msg: '소파 밑까지 단숨에 달렸다. 아무도 못 봤다.',
          risk: { p: .3, ending: 'D3', msg: '"꺄악!" 슬리퍼가 날아왔다.' } },
        { t: '곧장 신발장 밑으로', msg: '신발장 밑 10cm 틈. 먼지와 모래 냄새가 난다. 아무도 보지 못했다.' },
      ] },
    R4: { bg: 'kitchen', day: 49, night: true, next: 'R5', title: '불 꺼진 부엌',
      text: '불이 꺼졌다. 냉장고 모터가 웅웅거리며 열을 낸다. 싱크대에서는 음식물 냄새가 난다.',
      choices: [
        { t: '냉장고 뒤 모터 옆 틈으로', fx: { food: 25, hp: 10 }, msg: '모터 옆은 따뜻하고, 바닥엔 부스러기가 굴러온다. 여기다.' },
        { t: '싱크대 음식물 거름망으로', fx: { food: 35 }, msg: '배가 터지도록 먹고 냉장고 뒤로 숨었다.',
          risk: { p: .25, ending: 'D4', msg: '물 마시러 나온 사람이 불을 켰다.' } },
      ] },
    R5: { bg: 'kitchen', day: 90, prop: 'baitStation', next: 'R6', title: '하얀 동그란 통',
      text: '집주인이 바닥의 까만 점들을 발견했다. 다음 날 부엌 구석마다 하얀 동그란 통이 놓였다. 안에서 단 냄새가 난다.',
      choices: [
        { t: '단맛이 이상하다, 피한다', fx: { food: 10 }, msg: '단맛 속에 다른 냄새가 섞여 있었다. 다음 날, 동료 여럿이 뒤집힌 채 발견됐다.' },
        { t: '통 안의 젤을 먹는다', fx: { food: 20 }, msg: '맛있었다. 이상하게 멀쩡했다. 오래된 통이었나 보다.',
          risk: { p: .4, ending: 'D5', msg: '독은 천천히 퍼졌다.' } },
      ] },
    R6: { bg: 'kitchen', day: 120, next: 'R7', title: '첫 알집',
      text: '배 끝에 알집이 생겼다. 몸이 무겁고 느려졌다.',
      choices: [
        { t: '무거워서 일찍 떨군다', set: 'alone', fx: { food: 10 }, msg: '몸은 가벼워졌다. 떨군 알집은 바싹 말라 버렸다.' },
        { t: '부화 직전까지 달고 다닌다', fx: { kids: 40, food: -5 }, msg: '3주 동안 알집을 달고 다녔다. 냉장고 뒤에서 하얀 새끼 40마리가 나왔다.' },
      ] },
    R7: { bg: 'kitchen', day: 150, weather: 'smoke', next: 'R8', title: '연막탄',
      text: '집주인이 연막 살충제를 터뜨리고 외출했다. 하얀 연기가 바닥부터 차오른다.',
      choices: [
        { t: '냉장고 모터 깊숙이 숨는다', fx: { hp: -15, food: 5 }, msg: '연기가 바닥을 덮었다가 걷혔다. 냉장고 뒤 깊은 곳까지는 닿지 않았다.' },
        { t: '배관을 타고 아래층으로 간다', fx: { food: 10 }, msg: '아래층 부엌에서 하루를 보내고 돌아왔다.',
          risk: { p: .35, ending: 'D6', msg: '아래층 부엌도 연기로 가득했다.' } },
      ] },
    R8: { bg: 'kitchen', day: 210, prop: 'box', next: 'R9', title: '이삿짐',
      text: '알집이 둘 더 생겼다. 그런데 집주인이 이삿짐 상자를 싸고 있다.',
      choices: [
        { t: '이삿짐 상자에 올라탄다', set: 'alone', msg: '새 집에 도착했다. 새 집 부엌에도 냉장고는 있었다. 하지만 식구들은 두고 왔다.',
          risk: { p: .35, ending: 'D7', msg: '상자가 열리자 고양이가 들여다봤다.' } },
        { t: '냉장고 뒤에 남는다', fx: { kids: 80, food: 25 }, msg: '알집 둘이 부화했다. 새로 온 세입자는 밤늦게 라면만 끓여 먹고, 부엌 불은 거의 켜지 않는다.' },
      ] },
    R9: { bg: 'kitchen', day: 270, night: true, next: [{ flag: 'alone', to: 'N2' }, { to: 'H1' }], title: '느려진 다리',
      text: '다리가 느려졌다. 냉장고 뒤에서 마지막 겨울을 맞는다.',
      choices: [
        { t: '무리 한가운데서 쉰다' },
        { t: '불 켜진 부엌을 마지막으로 가로지른다', msg: '형광등 아래를 끝까지 가로질렀다. 아무도 보지 못했다.',
          risk: { p: .4, ending: 'D8', msg: '마지막으로 본 것은 형광등 불빛이었다.' } },
      ] },
    K1: { bg: 'restaurant', day: 60, night: true, title: '식당의 밤',
      text: '주방은 넓고 먹을 것은 많지만, 사람도 많다. 오늘도 배달 봉투가 줄지어 나간다.',
      choices: [
        { t: '배달 봉투를 다시 노린다', to: 'R3', fx: { food: 5 }, msg: '이번엔 봉투 냅킨 사이에 숨었다. 엘리베이터의 띵 소리.',
          risk: { p: .3, ending: 'D2', msg: '배달통 바깥에 붙었다가, 오토바이가 출발했다.' } },
        { t: '영업이 끝난 밤에만 움직인다', to: 'N1' },
      ] },
  },

  endings: {
    H1: { kind: 'happy', day: 280, title: '냉장고 뒤의 대가족', cause: '노쇠', line: '알 120개, 손주까지 300마리. 냉장고 모터의 온기 속에서 조용히 멈췄다.' },
    N1: { kind: 'normal', day: 210, title: '식당의 원로', cause: '노쇠', line: '주방 벽 틈의 최고령. 다음 방역은 다음 주다.' },
    N2: { kind: 'normal', day: 280, title: '외로운 노후', cause: '노쇠', line: '오래 살았지만 냉장고 뒤는 조용했다.' },
    D1: { kind: 'dead', after: 1, title: '젤 한 방울', cause: '먹이형 살충제', line: '바퀴가 먹으면 독이 천천히 온몸에 퍼진다.' },
    D2: { kind: 'dead', after: 0, title: '시속 50km', cause: '추락', line: '배달통은 생각보다 미끄러웠다.' },
    D3: { kind: 'dead', after: 0, title: '슬리퍼', cause: '슬리퍼', line: '거실 한가운데에는 숨을 데가 없다.' },
    D4: { kind: 'dead', after: 0, title: '새벽 2시의 불', cause: '슬리퍼', line: '불이 켜지면 바퀴는 0.5초 늦는다.' },
    D5: { kind: 'dead', after: 2, title: '달콤한 젤', cause: '먹이형 살충제', line: '일부 독일바퀴는 이 단맛을 피하도록 진화했다. 당신은 아니었다.' },
    D6: { kind: 'dead', after: 0, title: '아래층도 방역 중', cause: '연막 살충제', line: '아파트 단지 일괄 방역의 날이었다.' },
    D7: { kind: 'dead', after: 3, title: '새 집의 고양이', cause: '고양이', line: '새 집에는 고양이가 있었다. 길에서 데려온 고양이라고 했다.' },
    D8: { kind: 'dead', after: 0, title: '마지막 산책', cause: '슬리퍼', line: '형광등은 생각보다 밝았다.' },
    W0: { kind: 'dead', after: 0, title: '쇠약', cause: '굶주림', line: '더듬이가 더는 움직이지 않았다.' },
  },
});
