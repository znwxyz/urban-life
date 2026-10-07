# 도시에서 태어나기 (Urban Life)

도시의 동물로 랜덤하게 태어나, 주택가 ↔ 도심 ↔ 공원 사이에서 끝까지 살아남는 분기형 선택 게임.

- 플레이: https://znwxyz.github.io/urban-life/ (로컬에서는 `index.html`을 바로 열면 된다)
- 동물: 길고양이 · 바퀴벌레 · 집비둘기 · 집파리
- 장면이 영상처럼 흘러가다 멈추면 카드를 좌우로 밀어 고른다. 위험한 쪽은 확률로만 죽고, 대부분은 다치거나 배고파지며 계속 간다.
- 같은 배경을 동물마다 실제 cm 배율로 다르게 그린다 (바퀴벌레의 부엌과 고양이의 부엌).
- 그림체: 종이를 겹겹이 오려 붙인 느낌 (Alto's Adventure, Monument Valley 참고)
- 글씨: 새굴림이 있는 기기는 새굴림, 없으면 갈무리(Galmuri, SIL OFL)

## 구조
```
index.html, css/style.css
js/core/      engine.js(규칙·스탯·위험), color.js(팔레트)
js/data/      scenes.js(배경 11곳), species/*.js(동물별 시나리오)
js/render/    paper.js(종이 도구), backdrop.js·scene.js(장면), items-*.js(사물), animals.js(주인공)
js/ui.js, js/main.js
docs/scenarios/   시나리오 설계 문서 (scripts/scenario-docs.js로 생성)
tests/        node --test 로 규칙·시나리오 구조 검사
```

## 배포
```
./scripts/bump-version.sh   # js·css 주소의 ?v= 값을 바꿔 브라우저 캐시가 섞이지 않게 한다
git commit -am "..." && git push   # GitHub Pages가 1~2분 뒤 반영
```

## 테스트
```
npm test
node scripts/balance.js   # 밸런스 측정 (메인 루트 스탯 흐름, 무작위 플레이 생존율)
```
