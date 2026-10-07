# 광고 수익화 가이드 — 「도시에서 태어나기」

> 작성일: 2026-10-08. 광고 네트워크 정책과 화면 메뉴는 자주 바뀐다. 실제로 진행하기 전에 각 단계에 붙인 출처 링크를 한 번 더 열어 보고 진행한다.
> **확인 필요** 표시는 공식 문서에서 근거를 찾지 못했거나, 콘솔에 로그인해야만 볼 수 있는 항목이다.

---

## 0. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 게임 | 바닐라 JS + canvas, 정적 파일. 지금 주소는 https://znwxyz.github.io/urban-life/ (repo `znwxyz/urban-life`, `main` 브랜치 루트) |
| 도메인 | `stepintocrypto.xyz`. 네임서버는 Vercel(`ns1/ns2.vercel-dns.com`)이고, 지금은 옛 Vercel 사이트를 가리킨다 |
| 1순위 | 카카오 애드핏(AdFit) 웹 배너. 단, **지금은 제휴 문의를 거쳐 승인을 받아야 가입할 수 있다** (아래 1-1) |
| 2순위 | 구글 애드센스 배너. 트래픽이 늘면 H5 Games Ads(전면·보상형, 신청 후 승인)를 붙인다 |
| 팝업형(전면) 광고 | 애드핏의 팝업형 상품(앱 전환·앱 종료)은 **앱 SDK 전용**이다. 웹 게임에서 전면 광고를 쓰려면 애드센스 H5 Games Ads가 현실적인 선택지다 |

---

## 1. 개요와 추천

### 1-1. 결론: 애드핏을 먼저 신청하고, 애드센스는 그다음에

**애드핏을 먼저 하는 이유**
- 이용자가 대부분 국내 모바일이고, 카카오 광고주 소재가 들어온다.
- 정산이 원화이고, 개인 유형으로 가입할 수 있다. 지급 요청은 확정 적립금 5만 원부터 가능하다 ([지급 문서](https://kakaobusiness.gitbook.io/main/partner/adfit/start/pay)).
- 웹 배너는 스크립트 한 줄만 붙이면 된다 ([WEB SDK 가이드](https://adfit.github.io/wiki/web-guide/)).

**미리 알아 둘 점 (중요)**
1. **애드핏은 아무나 바로 가입할 수 없다.** 공식 문서에 "AdFit은 사전에 승인 또는 초대받은 매체를 대상으로 서비스를 제공합니다"라고 적혀 있다. [애드핏 제휴 문의](https://with.kakao.com/proposition?type=service&page=adfit)를 먼저 넣고, 승인이 나면 받은 **인증코드**로 가입한다 ([가입하기](https://kakaobusiness.gitbook.io/main/partner/adfit/join), [애드핏 소개](https://adfit.kakao.com/info)). 블로그에 흔한 "가입 → 매체 등록 → 바로 심사" 순서는 지금 절차와 다르다.
   - 제휴 문의를 어떤 기준으로 승인하는지(최소 방문자 수 등)는 공개 문서에 없다 → **확인 필요**. 갓 연 개인 게임이라면 승인이 안 날 수도 있다고 보고 계획을 세운다.
2. **웹에서 쓸 수 있는 건 배너뿐이다.** 웹 SDK가 지원하는 유형은 "배너 타입 광고" 하나이고, 사이즈는 `160x600`, `250x250`, `300x250`, `320x100`, `320x50`, `728x90` 여섯 가지다 ([WEB SDK 가이드](https://adfit.github.io/wiki/web-guide/)). 팝업처럼 뜨는 "앱 전환·앱 종료"는 앱 전용 상품이다 ([AdFit 상품 소개](https://kakaobusiness.gitbook.io/main/partner/adfit)). 네이티브 상품도 있지만, 광고 관리 문서를 보면 Web 매체에서 스크립트를 주는 건 배너뿐이고 나머지 유형은 SDK 가이드 링크만 준다 ([광고 관리 §3](https://kakaobusiness.gitbook.io/main/partner/adfit/start/ad-manage)).
3. 수익은 노출·클릭량에 비례한다. 하루 방문자가 적을 때는 월 5만 원(지급 기준)을 넘기기도 쉽지 않을 수 있다.

**애드센스를 그다음에 두는 이유**
- 승인 심사가 며칠에서 2~4주 걸린다 ([사이트 추가 도움말](https://support.google.com/adsense/answer/12169212)).
- 웹 게임용 전면·보상형 광고(H5 Games Ads)는 **신청을 받아 개별 승인**하는 방식이다 ([H5 Games Ads 소개](https://adsense.google.com/start/solutions/h5-games-ads/), [베타 신청 안내](https://developers.google.com/ad-placement/docs/beta)). 그래서 트래픽이 생긴 뒤에 신청하는 게 맞다.
- 애드핏과 함께 써도 된다. 다만 한 화면에 광고가 너무 많으면 두 쪽 심사에서 모두 불리하므로, 처음에는 한 네트워크만 쓴다.

### 1-2. 도메인 이름(crypto)과 관련한 위험

- 이번 조사에서는 "도메인 이름에 crypto가 들어갔다는 이유만으로 게시자(매체) 심사가 거절된다"는 공식 근거를 **찾지 못했다**. 구글의 암호화폐 제한 정책은 **광고주** 쪽 규정이다 ([Google Ads: Cryptocurrencies and related products](https://support.google.com/adspolicy/answer/14009787)). 애드핏 매체 심사 기준은 "매체 콘텐츠 속성, 광고 배치, 광고 정상 호출 여부"라고만 공개돼 있다 ([애드핏 소개 > 광고 시작하기](https://adfit.kakao.com/info)).
- 다만 심사자가 도메인 이름과 실제 내용이 다르다고 느끼거나, 예전 크립토 사이트의 흔적(검색 색인, 백링크)을 보고 카테고리를 다르게 판단할 수는 있다 → **확인 필요**. 이 위험을 줄이는 방법은 이렇다.
  - 사이트 안에는 게임 내용만 둔다. 크립토 관련 문구, 링크, 옛 페이지 경로는 남기지 않는다.
  - 매체 카테고리는 "게임"으로 등록한다.
  - 장기적으로 브랜드를 생각하면 게임에 맞는 도메인을 새로 사는 편이 깔끔하다. `.com`/`.kr` 도메인은 1년에 1~2만 원 정도다.

### 1-3. 도메인 연결 방식: 루트(apex) vs 서브도메인

| | A안: 루트 `stepintocrypto.xyz` | B안: 서브도메인 `game.stepintocrypto.xyz` |
|---|---|---|
| DNS | A 4개 + AAAA 4개 + `www` CNAME | CNAME 1개 |
| 애드핏 | 매체 URL로 등록하면 된다 | 매체 URL로 등록하면 된다 (서브도메인 제한 문서는 없음 → **확인 필요**) |
| 애드센스 | 사이트 목록에 루트 도메인을 추가하고, `ads.txt`는 루트에 둔다. 가장 단순하다 | 애드센스는 2023년부터 사이트 목록에 **서브도메인을 따로 추가할 수 없고** 루트 도메인만 받는다 ([도움말](https://support.google.com/adsense/answer/12170421?hl=en)). `ads.txt`도 **루트 도메인에서 응답해야** 한다 ([ads.txt 가이드](https://support.google.com/adsense/answer/7679060?hl=en)). 그래서 루트에 따로 무언가(예: `ads.txt`와 게임으로 넘기는 리디렉트만 있는 작은 Pages repo)를 올려야 한다 |
| 이름 위화감 | 큼 (주소창에 crypto만 보임) | 조금 덜함 (`game.`) |

**추천: A안(루트).** 옛 사이트를 더는 쓰지 않으므로 루트를 게임에 주는 게 가장 단순하고, 애드센스로 넘어갈 때 `ads.txt`도 게임 repo 루트에 파일 하나만 두면 끝난다. 나중에 크립토 관련 사이트를 다시 운영할 계획이 있다면 B안을 쓴다.

> 참고: `znwxyz.github.io/urban-life/`처럼 github.io 주소를 계속 쓰면, 애드센스 `ads.txt`는 `znwxyz.github.io/ads.txt`(별도 repo `znwxyz/znwxyz.github.io`)에 둬야 한다. 지금 이 주소는 404다. 자체 도메인을 쓰는 편이 훨씬 단순하다.

---

## 2. 도메인을 GitHub Pages로 옮기기

조사 시점(2026-10-08)의 실제 DNS 상태:

```
NS    stepintocrypto.xyz       → ns1.vercel-dns.com, ns2.vercel-dns.com
A     stepintocrypto.xyz       → 216.198.79.1, 216.198.79.65   (Vercel)
A     www.stepintocrypto.xyz   → 64.29.17.1, 64.29.17.65       (Vercel)
A     game.stepintocrypto.xyz  → 64.29.17.65, 216.198.79.65    (Vercel. 와일드카드 * 레코드가 있을 가능성 큼)
CAA   0 issue "letsencrypt.org" 포함 (GitHub Pages HTTPS 발급에 필요한 값이 이미 있음)
```

GitHub Pages 공식 IP ([GitHub Docs: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):

- A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- AAAA: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
- 서브도메인: `CNAME → znwxyz.github.io` (repo 이름은 붙이지 않는다)

### 2-0. (권장) GitHub에서 도메인 소유 인증 먼저

도메인 탈취(takeover)를 막기 위해 GitHub는 repo에 연결하기 **전에** 도메인을 인증하라고 권한다 ([Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)).

1. GitHub 오른쪽 위 프로필 사진 → **Settings** → 왼쪽 "Code, planning, and automation" → **Pages** → **Add a domain** → `stepintocrypto.xyz` 입력.
2. 화면에 나오는 TXT 레코드를 Vercel DNS에 추가한다 (이름: `_github-pages-challenge-znwxyz`, 값: 화면에 나온 코드).
3. 확인:
   ```bash
   dig _github-pages-challenge-znwxyz.stepintocrypto.xyz +nostats +nocomments +nocmd TXT
   ```
4. GitHub 화면에서 **Verify** 클릭. 이 TXT 레코드는 지우지 않고 계속 둔다.

### 2-1. Vercel 쪽

**(1) 옛 프로젝트에서 도메인 떼기** (팀 전체 Domains 목록에서 "삭제"하는 게 아니다)

1. Vercel 대시보드 → 옛 사이트 **프로젝트** 선택 → **Settings** → **Domains**.
2. `stepintocrypto.xyz`, `www.stepintocrypto.xyz`(그리고 있다면 `*.stepintocrypto.xyz`) 행의 **⋯ / Edit → Remove**.
3. 주의: 팀 단위 **Domains** 페이지에서 도메인 자체를 지우면 Vercel DNS 영역(zone)까지 없어질 수 있다. 우리는 Vercel을 **DNS 서버로는 계속 쓰므로** 도메인 자체는 남겨 둔다 → 정확한 동작은 **확인 필요**. 프로젝트에서 떼기만 하면 안전하다.

**(2) DNS 레코드 넣기** — 대시보드 왼쪽 **Domains** → `stepintocrypto.xyz` 클릭 → DNS Records 폼 ([Managing DNS Records](https://vercel.com/docs/domains/managing-dns-records)). 폼의 Name 칸에는 접두어만 넣는다(루트는 비우거나 `@`, `www` 등).

A안(루트) 기준:

| Type | Name | Value |
|---|---|---|
| A | (비움/@) | 185.199.108.153 |
| A | (비움/@) | 185.199.109.153 |
| A | (비움/@) | 185.199.110.153 |
| A | (비움/@) | 185.199.111.153 |
| AAAA | (비움/@) | 2606:50c0:8000::153 |
| AAAA | (비움/@) | 2606:50c0:8001::153 |
| AAAA | (비움/@) | 2606:50c0:8002::153 |
| AAAA | (비움/@) | 2606:50c0:8003::153 |
| CNAME | www | znwxyz.github.io |
| TXT | _github-pages-challenge-znwxyz | (2-0에서 받은 값) |

B안(서브도메인) 기준:

| Type | Name | Value |
|---|---|---|
| CNAME | game | znwxyz.github.io |
| TXT | _github-pages-challenge-znwxyz | (2-0에서 받은 값) |

같은 이름에 A와 CNAME을 함께 넣지 않는다 ([Vercel 문서](https://vercel.com/docs/domains/managing-dns-records)).

**(3) Vercel 기본 레코드와 와일드카드 정리**

- Vercel이 만든 기본 레코드(ALIAS, CAA 등)는 지울 수 없고, 새 레코드로 덮어써야 한다고 문서에 나와 있다 ([How to manage Vercel DNS records](https://vercel.com/kb/guide/how-to-manage-vercel-dns-records)). 레코드를 넣은 뒤 `dig` 결과에 Vercel IP(216.198.x, 64.29.x, 76.76.21.21)가 **섞여 나오지 않는지** 반드시 확인한다. 섞여 나오면 프로젝트에서 도메인을 덜 뗀 것이다.
- `game.`도 Vercel로 풀리는 걸 보면 `*` 와일드카드 레코드가 있는 것으로 보인다. GitHub는 와일드카드 DNS를 쓰지 말라고 경고한다 ([Verifying your custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)). 내가 직접 만든 와일드카드면 지운다.

CLI로 할 때 ([Vercel KB](https://vercel.com/kb/guide/how-to-manage-vercel-dns-records)):

```bash
vercel dns ls stepintocrypto.xyz                    # 레코드 ID 확인
vercel dns rm <record-id>                           # 와일드카드 등 지울 레코드
vercel dns add stepintocrypto.xyz www CNAME znwxyz.github.io
vercel dns add stepintocrypto.xyz game CNAME znwxyz.github.io     # B안일 때
vercel dns add stepintocrypto.xyz '@' A 185.199.108.153            # 루트 표기('@' 또는 '')는 확인 필요
```

> 루트 레코드는 대시보드에서 넣는 쪽이 헷갈리지 않는다.

### 2-2. GitHub 쪽

1. repo `znwxyz/urban-life` → **Settings** → **Pages**.
2. **Custom domain**에 `stepintocrypto.xyz`(B안이면 `game.stepintocrypto.xyz`) 입력 → **Save**. DNS 확인이 끝나면 초록색 체크가 뜬다.
3. 브랜치에서 배포하는 경우 GitHub는 도메인을 publishing source 루트의 `CNAME` 파일로 저장한다 ([Troubleshooting custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)). 대시보드에서 저장하면 보통 이 파일이 자동으로 커밋된다. 그 뒤 `git pull`로 받아 둔다. 파일 이름은 대문자 `CNAME`이고, 내용은 도메인 한 줄뿐이다.
   ```
   stepintocrypto.xyz
   ```
4. **Enforce HTTPS** 체크. 인증서 발급에 최대 1시간(옵션이 활성화되기까지는 최대 24시간) 걸릴 수 있다. 회색으로 비활성 상태면 기다린다. 오래 걸리면 도메인을 지웠다 다시 넣는다.

`gh` CLI로 할 때 ([REST API: Pages](https://docs.github.com/en/rest/pages/pages)):

```bash
# 현재 설정 보기
gh api repos/znwxyz/urban-life/pages

# 커스텀 도메인 지정 (source는 필수)
gh api -X PUT repos/znwxyz/urban-life/pages \
  -f cname='stepintocrypto.xyz' \
  -f 'source[branch]=main' -f 'source[path]=/'

# DNS 상태 점검 (202면 잠시 뒤 다시)
gh api repos/znwxyz/urban-life/pages/health

# 인증서가 나온 뒤 HTTPS 강제
gh api -X PUT repos/znwxyz/urban-life/pages \
  -F https_enforced=true \
  -f 'source[branch]=main' -f 'source[path]=/'
```

> API로 cname을 넣었을 때 `CNAME` 파일까지 자동 커밋되는지는 **확인 필요**. repo에 `CNAME` 파일이 안 생겼다면 직접 추가해 커밋한다.

### 2-3. 기다리고 확인하기

DNS 반영은 길게는 24시간까지 걸린다. Vercel 레코드의 기본 TTL은 60초라서 보통은 빠르다.

```bash
# Vercel 네임서버가 실제로 내주는 값 (전파와 관계없이 즉시 확인)
dig @ns1.vercel-dns.com stepintocrypto.xyz A +short
dig @ns1.vercel-dns.com stepintocrypto.xyz AAAA +short

# 일반 리졸버 기준 (GitHub 문서 권장 형식)
dig stepintocrypto.xyz +noall +answer -t A        # 185.199.108~111.153 네 개만 나와야 함
dig stepintocrypto.xyz +noall +answer -t AAAA
dig www.stepintocrypto.xyz +nostats +nocomments +nocmd   # CNAME znwxyz.github.io
dig stepintocrypto.xyz CAA +short                 # letsencrypt.org 포함 확인

# HTTP 확인
curl -sI https://stepintocrypto.xyz/ | head -5            # server: GitHub.com, 200
curl -sI https://www.stepintocrypto.xyz/ | head -5        # 루트로 301
curl -sI https://znwxyz.github.io/urban-life/ | head -5   # 새 도메인으로 301
```

옛 주소로 공유된 링크는 GitHub가 새 도메인으로 자동 리디렉트해 준다. 그래서 따로 할 일은 없다.

---

## 3. 신청 전에 사이트에 있어야 할 페이지

애드핏 심사는 "매체 콘텐츠 속성"을 보고, 애드센스는 고유한 콘텐츠와 정책 준수를 본다 ([애드센스 자격 요건](https://support.google.com/adsense/answer/9724)). 게임 화면 하나만 있는 사이트보다 아래 페이지들이 함께 있는 편이 심사에 유리하다. 이건 일반적인 권장이고 어느 네트워크도 필수 조건으로 명시하진 않았다 → **확인 필요**. 또 개인정보처리방침은 광고와 관계없이 **법에 따라** 공개해야 한다 (개인정보 보호법 제30조).

### 3-1. 개인정보처리방침 (`privacy.html`)

초안: [`privacy-draft.md`](./privacy-draft.md) (**초안이며 법률 자문이 아님**).

이 게임이 실제로 다루는 정보 (코드 기준):

| 구분 | 내용 | 위치 |
|---|---|---|
| 방명록 | 동물 종류(`species`), 엔딩(`ending`), 남긴 말(`message`), 생존 일수(`days`), 작성 시각(`created_at`) | Supabase `guestbook` 테이블 (`js/guestbook.js`) |
| 기기 저장 | 게임 진행 상태, 방명록 연속 작성 방지 시각(`urbanlife.guestbook.lastAt`) | 브라우저 localStorage (서버로 보내지 않음) |
| 계정 | 없음 (회원가입·로그인 없음) | — |
| 외부 리소스 | 글꼴 CDN(jsDelivr), 카카오페이 송금 링크(누를 때만) | `index.html`, `js/config.js` |
| 광고 (추가 예정) | 광고 사업자의 쿠키, 광고 식별자 등 **행태정보** | AdFit / AdSense 스크립트 |

방침에 넣어야 할 항목 (개인정보 보호법 제30조, 시행령 제31조 기준. 개인정보보호위원회 「개인정보 처리방침 작성지침」 참고: [개인정보위](https://www.pipc.go.kr), [개인정보 포털 처리방침 만들기](https://www.privacy.go.kr)):
1. 처리 목적 2. 처리 항목 3. 보유·이용 기간 4. 파기 절차·방법 5. 제3자 제공 여부 6. 처리 위탁·국외 이전(Supabase 서버 리전) 7. 정보주체의 권리와 행사 방법 8. 안전성 확보 조치 9. 자동 수집 장치(쿠키·localStorage)의 설치·운영과 거부 방법 10. **행태정보 수집·이용과 맞춤형 광고**(광고를 붙이면 필수) 11. 개인정보 보호책임자와 연락처 12. 권익침해 구제 방법 13. 변경 이력과 시행일.

확인할 것:
- Supabase 프로젝트 리전 (대시보드 → Project Settings → General). 서울(ap-northeast-2)이 아니면 "국외 이전" 항목을 넣는다 → **확인 필요**.
- Supabase가 API 요청 로그에 IP 주소를 남기는지, 얼마나 보관하는지 → **확인 필요** ([Supabase Privacy Policy](https://supabase.com/privacy)).
- 방명록은 자유 입력란이다. 이용자가 전화번호 같은 개인정보를 적을 수 있으니 "개인정보를 적지 마세요"라는 안내와 삭제 요청 방법을 함께 둔다.

### 3-2. 게임 소개 (`about.html` 또는 홈 하단 섹션)

- 게임 한 줄 소개, 플레이 방법(카드 좌우로 밀기), 등장 동물, 그림체·글꼴 출처(Galmuri SIL OFL 등).
- 만든 사람 (닉네임 또는 실명, LinkedIn 링크는 이미 있음).
- 업데이트 기록 몇 줄. "살아 있는 사이트"라는 신호가 된다.

### 3-3. 문의 (`contact` 섹션)

- 연락용 이메일 주소. 스팸을 줄이려면 `mailto:`와 함께 이미지가 아닌 텍스트로 쓴다.
- 방명록 글 삭제 요청 방법 (예: "어느 동물, 대략 몇 시에 쓴 글인지 적어 보내 주세요").

### 3-4. 공통

- 모든 페이지 하단에 `개인정보처리방침 · 소개 · 문의` 링크를 둔다. 게임 화면에서는 홈(picker) 하단에 작게 둔다.
- `404.html`, `robots.txt`, `sitemap.xml`이 있으면 좋다. 애드센스 크롤러가 사이트를 파악하기 쉬워진다.

---

## 4. 카카오 애드핏 단계별 진행

### 4-1. 제휴 문의 (사전 승인)

1. https://with.kakao.com/proposition?type=service&page=adfit 접속 ([가입하기 문서](https://kakaobusiness.gitbook.io/main/partner/adfit/join)).
2. 정리해서 적을 내용 (양식 항목은 로그인 후 확인 → **확인 필요**):
   - 매체명: 도시에서 태어나기
   - URL: `https://stepintocrypto.xyz/` (2단계를 마친 뒤 넣는다. github.io 주소로 신청한 뒤 도메인을 바꾸면 다시 등록해야 할 수 있다)
   - 매체 유형: Web, 모바일 비중이 높음
   - 콘텐츠: 도시 동물로 태어나 살아남는 선택형 웹 게임 (전체 이용가 수준, 폭력 묘사는 동물 사망 장면 정도)
   - 월 방문자·페이지뷰: 정직하게. GoatCounter, Cloudflare Web Analytics, GA4 같은 통계 도구를 미리 붙여 두면 숫자를 댈 수 있다
   - 희망 광고 형식: 웹 배너 320x50, 320x100, 300x250
3. 승인되면 담당자가 **인증코드**를 보내 준다. 승인 기준과 소요 기간은 공개돼 있지 않다 → **확인 필요**.

### 4-2. 가입

([가입하기](https://kakaobusiness.gitbook.io/main/partner/adfit/join))
1. https://adfit.kakao.com 에 **카카오계정**으로 로그인한다. 애드핏 계정이 없으면 가입 화면으로 넘어간다.
2. 받은 **인증코드** 입력 → 인증 (한 번 쓰면 재사용 불가).
3. 이용약관 동의 → 회원 유형 **개인** 선택. 사업자가 없어도 된다. 간이과세자도 개인 유형으로 가입한다. 개인 계정은 본인 명의로 하나만 만들 수 있다.
4. 이메일·휴대전화번호 입력과 인증(필수) → 알림 설정 → 가입 완료.

### 4-3. 매체 등록

([매체 관리](https://kakaobusiness.gitbook.io/main/partner/adfit/start/media-manage))
1. 왼쪽 메뉴 **대시보드 → [+ 애드핏 매체 등록하기]** (또는 **광고관리 → 매체 탭 → [+ 매체 등록]**).
2. 매체 유형 **Web** 선택.
3. **URL**: `https://stepintocrypto.xyz` / **매체 카테고리**: 주 카테고리와 보조 카테고리를 모두 고른다. 게임 관련 항목을 고르면 되고, 정확한 목록은 화면에서 확인한다. 카테고리는 심사 중에 바뀔 수 있다.
4. **[다음]** → 등록 정보 확인 → **[광고단위 생성]**으로 바로 넘어간다.

### 4-4. 광고단위 생성

([광고 관리](https://kakaobusiness.gitbook.io/main/partner/adfit/start/ad-manage))
1. **광고관리 → 광고단위 탭 → [광고단위 생성]** → 매체 선택 → 상품 **배너** 선택.
2. 광고단위명(예: `home-bottom-320x100`, `ending-300x250`)과 광고 유형(사이즈)을 고른다.
3. 옵션:
   - **소재 새로고침**: 30~120초 사이에서 설정할 수 있고, 60초 이상이 권장이다. 홈 화면처럼 오래 머무는 곳은 60초로 둔다.
   - **광고영역 테두리**: 없음.
   - **대체 광고**: 광고 응답이 없을 때 보여 줄 대체물. 게임 배경색과 맞춘 색상(Hex)으로 지정하면 빈칸이 덜 어색하다. 지정하지 않으면 애드핏 기본 소재가 나온다.
4. 생성 완료 화면에 **광고 스크립트**가 나온다. 나중에는 **광고단위 → 스크립트 [보기]**에서 다시 볼 수 있다.
5. 처음에는 단위 2개(홈 하단 1, 엔딩 1)면 충분하다.

### 4-5. 스크립트 설치

공식 형식 ([WEB SDK 가이드](https://adfit.github.io/wiki/web-guide/)):

```html
<ins class="kakao_ad_area" style="display:none;width:100%;"
 data-ad-unit    = "광고단위ID"
 data-ad-width   = "320"
 data-ad-height  = "100"></ins>
<script async type="text/javascript" src="//t1.kakaocdn.net/kas/static/ba.min.js"></script>
```

- **콘솔에서 복사한 코드를 그대로** 쓴다. 광고단위 정보를 바꾸거나 코드를 고치면 요청이 실패하거나 잘못된 요청으로 처리될 수 있다. SDK를 변형하거나 등록하지 않은 매체에 설치하면 제재를 받는다 ([AdFit SDK 주의사항](https://kakaobusiness.gitbook.io/main/partner/adfit/adfit-sdk)).
- 우리 쪽에서 바꿔도 되는 건 `<ins>`를 감싸는 **바깥 컨테이너**(위치, 여백, 높이 예약)뿐이다. 자세한 내용은 5-2에 있다.
- `ba.min.js`는 페이지에 한 번만 넣는다.
- 실제 도메인에 배포한 뒤 광고가 호출되는지 확인한다. 개발자도구 Network 탭에서 `kakaocdn`, `kakao` 요청이 나가는지 본다.

### 4-6. 심사

- 매체 심사는 **광고단위를 만들고, 스크립트를 설치하고, 광고가 실제로 호출된 뒤에** 시작된다. 평균 영업일 1~2일 걸린다 ([매체 관리](https://kakaobusiness.gitbook.io/main/partner/adfit/start/media-manage), [FAQ](https://kakaobusiness.gitbook.io/main/partner/adfit/faq)).
- **"광고 미설치"로 심사 보류**되는 경우는 두 가지다 ([FAQ Q4](https://kakaobusiness.gitbook.io/main/partner/adfit/faq)).
  1. 매체만 등록하고 광고단위를 만들지 않은 경우
  2. 광고단위를 만들었지만 사이트에 제대로 설치되지 않은 경우
  → 그래서 **심사 기간에는 광고가 첫 화면에서 바로 보이는 위치**(홈 하단)에 있어야 한다. 엔딩까지 가야 나오는 광고 하나뿐이면 심사자가 못 보고 지나칠 수 있다.
- 심사 항목: 매체 콘텐츠 속성, 광고 배치, 광고 정상 호출 여부 ([애드핏 소개](https://adfit.kakao.com/info)).
- 상태는 매체 상세 페이지 위쪽 메시지로 확인한다. **보류**면 사유를 확인하고, 고친 다음 **즉시 재심사 요청**을 할 수 있다. 반려나 관리자 정지는 사유를 보고 대응한다 ([매체 관리 §2](https://kakaobusiness.gitbook.io/main/partner/adfit/start/media-manage)).

### 4-7. 정산 정보

([지급](https://kakaobusiness.gitbook.io/main/partner/adfit/start/pay), [FAQ](https://kakaobusiness.gitbook.io/main/partner/adfit/faq))
- 지급 요청 기준: 확정 적립금 **5만 원 이상**.
- 주기: 1일~말일에 쌓인 적립금은 **다음 달 21일~말일**에 지급 요청하고, 그다음 달(익익월)에 입금된다.
- 개인 유형에서 등록하는 정보: 애드핏 가입 실명, 정산 대상자명, 예금주(셋이 모두 일치해야 함), **주민등록번호**. 지급 요청 기간이나 첫 지급 요청 때 등록한다.
- **자동 지급 요청**을 켜 두면 매월 21일 오전에 5만 원 이상일 때 자동으로 요청된다.
- 세금: 개인 유형은 지급할 때 **원천징수**된다 (FAQ Q8). 3.3%라는 블로그 후기가 있지만 ([예시](https://jab-guyver.co.kr/1866)) 공식 문서에 세율은 없다 → **확인 필요**. 연간 수익이 생기면 5월 종합소득세 신고 대상인지 세무서나 홈택스에서 확인한다 (세무 조언 아님).
- 사업자 유형은 세금계산서를 발행해야 하고, 마스터 계정만 지급 요청을 할 수 있다. 처음에는 개인 유형이 간편하다.
- 만 나이 제한 → **확인 필요** (문서에 없음).

### 4-8. ads.txt (애드핏)

애드핏 공식 문서에서는 ads.txt 요구 사항을 찾지 못했다 → **확인 필요**. 콘솔에 ads.txt 안내가 있으면 그 줄을 루트 `ads.txt`에 추가한다. 애드센스와 함께 쓰면 한 파일에 두 줄이 들어간다.

---

## 5. 게임 안 광고 배치

### 5-1. 원칙

| 위치 | 광고 | 메모 |
|---|---|---|
| 홈(picker) 하단, "방명록 모아보기/제작자 응원하기" 아래 | 배너 320x100 (좁으면 320x50) | **심사용 필수 위치**. 첫 화면에서 스크롤 없이 보이게 |
| 방명록 모아보기(`#wall`) 펼친 목록 중간·끝 | 배너 300x250 1개 | 글 사이에 끼우되, 광고라고 알아볼 수 있게 "광고" 라벨을 붙인다 |
| 엔딩 카드 아래 (`showEnding`) | 배너 300x250 또는 320x100 | "○○로 다시 / 다른 동물 고르기" 버튼과 **세로로 충분히 떨어뜨린다** |
| 선택 카드(`#deck`)·스와이프 영역 위 | **금지** | 실수 클릭(무효 클릭)이 생기고 정책 위반 위험이 크다 |
| 장면 이동(캡션·이동 애니메이션) 중 | **금지** | 플레이 흐름을 끊는다 |
| HUD 위, canvas 위 겹침 | **금지** | |
| 전면(팝업) | "○○로 다시 / 다른 동물 고르기"를 누른 직후에만. **애드센스 H5 Games Ads 승인 후** `adBreak({type:'next'})`로. 빈도 제한 필요 | 애드핏 웹에는 이 형식이 없다 |

전면 광고 빈도 기준(제안): 한 세션에서 엔딩 2회마다 최대 1번, 그리고 직전 전면 광고 후 3분 이상 지났을 때만. H5 Games Ads 자체에도 빈도 조절이 있지만, 우리 쪽에서도 막는다.

### 5-2. 기술 계획 (아직 구현하지 않음)

지금 구조: `<main class="app">` 안에 canvas 두 장(`#stage`, `#fx`)이 깔리고, 그 위에 `#picker`, `#deck`, `#hud`가 `hidden` 속성으로 켜고 꺼진다. 엔딩은 `js/main.js`의 `showEnding()`이 `showCard({ top: guestbookSection(...), choices: [...] })`로 그린다.

1. **설정 분리** — `js/config.js`에 `ADS` 객체를 추가한다. 비어 있으면 광고 기능 전체를 끈다 (방명록 `GUESTBOOK`과 같은 패턴).
   ```js
   const ADS = Object.freeze({
     provider: '',            // '' | 'adfit' | 'adsense'
     adfit: { home: '', ending: '', wall: '' },   // 광고단위 ID
   });
   ```
2. **슬롯 컨테이너** — `index.html`의 `#picker` 안 `.home-actions` 다음에 배치한다.
   ```html
   <aside class="ad-slot ad-slot--home" id="adHome" aria-label="광고" hidden></aside>
   ```
   엔딩 슬롯은 `showEnding()`에서 카드 아래(선택 버튼 바깥)에 같은 클래스로 만든다.
3. **스크립트는 늦게, 한 번만** — 새 파일 `js/ads.js`에 `mountAd(slotEl, unitId, w, h)`를 만든다.
   - 슬롯이 **처음 보일 때**(`showPicker()`, `showEnding()`에서 호출) 콘솔에서 받은 형태 그대로 `<ins class="kakao_ad_area" ...>`를 만들어 넣고, `ba.min.js`를 아직 넣지 않았으면 `<script async>`로 한 번 추가한다.
   - 게임 장면(`#deck`이 보이는 동안)에는 아무것도 불러오지 않는다. 그래서 첫 로딩과 canvas 성능에 영향이 없다.
   - `<ins>`를 동적으로 넣은 뒤 `ba.min.js`가 그것을 다시 찾아 그리는지는 공식 문서에 없다 → **확인 필요**. 안 되면 대안이 두 가지다. (a) 홈 슬롯은 `index.html`에 정적으로 두고 스크립트도 정적으로 넣는다. (b) 엔딩 슬롯은 처음부터 DOM에 두고 위치만 옮긴다. 광고 응답 실패 시 콜백(`data-ad-onfail` 등)도 문서에서 확인되지 않았다 → **확인 필요**.
   - 같은 광고단위를 한 화면에 두 번 넣지 않는다.
4. **레이아웃 (CLS·여백)**
   ```css
   .ad-slot { display:flex; justify-content:center; margin-block: var(--space-ad, 16px);
              min-height: var(--ad-h); contain: layout; }
   .ad-slot::before { content:'광고'; /* 작은 라벨 */ }
   .ad-slot--home   { --ad-h: 100px; }
   .ad-slot--ending { --ad-h: 250px; }
   ```
   - 광고 높이만큼 미리 `min-height`로 자리를 잡아, 광고가 늦게 떠도 화면이 밀리지 않게 한다(CLS).
   - **16px 좌우 여백**: 화면 폭 375px에서는 375 − 32 = 343px라 320 배너가 들어간다. **320px 기기**에서는 288px만 남아 320 배너가 넘친다. 이 경우 슬롯만 `margin-inline: -16px`로 여백 밖까지 펼치거나, 화면 폭이 352px 미만이면 광고를 안 넣는다. 광고 자체를 `transform: scale()`로 줄이는 건 "코드 수정"으로 볼 수 있어 하지 않는다 → **확인 필요**.
   - 광고 슬롯은 canvas와 겹치지 않는 문서 흐름 안(`#picker`의 자식)에 두고, `position: fixed` 하단 고정 배너는 쓰지 않는다. 고정 배너는 모바일에서 카드 스와이프 영역을 가린다.
   - 엔딩 카드에서는 광고와 선택 버튼 사이를 최소 24px 띄운다(실수 클릭 방지).
5. **숨김 처리** — 장면으로 넘어갈 때(`#picker`가 `hidden`) 광고 노드는 그대로 두되 다시 호출하지 않는다. 새로고침 주기는 애드핏 콘솔 설정(60초)에 맡긴다.
6. **테스트** — `tests/`에 `ADS` 설정이 비었을 때 슬롯이 숨는지, 같은 스크립트를 두 번 넣지 않는지 단위 테스트를 둔다. 320/375/768/1440px 폭 스크린샷으로 넘침이 없는지 확인한다.
7. 배포할 때는 기존처럼 `./scripts/bump-version.sh`를 실행한다.

---

## 6. 대안: 구글 애드센스

1. **가입 조건**: 만 18세 이상, 사이트 HTML 수정 권한, 고유한 콘텐츠, 정책 준수 ([자격 요건](https://support.google.com/adsense/answer/9724)).
2. **사이트 추가**: AdSense → **사이트** → **+새 사이트** → `stepintocrypto.xyz`(루트 도메인) → 저장 → 확인 방법(코드 스니펫, ads.txt, 메타태그 중 하나) 선택 → **확인** → **검토 요청**. 검토는 보통 며칠, 길면 2~4주 걸린다 ([사이트 추가](https://support.google.com/adsense/answer/12169212)). 서브도메인은 사이트로 따로 추가할 수 없다 ([도움말](https://support.google.com/adsense/answer/12170421?hl=en)).
3. **ads.txt**: repo 루트에 `ads.txt` 파일을 만든다. Pages가 그대로 `https://stepintocrypto.xyz/ads.txt`로 내보낸다. 내용 형식 ([ads.txt 가이드](https://support.google.com/adsense/answer/12171612)):
   ```
   google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
   ```
   크롤링은 루트 도메인에서 시작한다. 서브도메인을 쓰면 루트 쪽 ads.txt에서 `subdomain=` 줄로 참조해야 한다 ([ads.txt 크롤링](https://support.google.com/adsense/answer/7679060?hl=en)). 반영에는 며칠, 길면 한 달까지 걸린다.
4. **배너**: 승인 후 디스플레이 광고 단위를 만들어 5-1의 같은 자리에 넣는다.
5. **H5 Games Ads(전면·보상형)**: [신청 양식](https://adsense.google.com/start/h5-beta/?src=devsite)을 제출한다. 승인된 애드센스 계정이 필요하고, 승인은 보장되지 않는다 ([베타 안내](https://developers.google.com/ad-placement/docs/beta)). 승인 후 설치 형태는 아래와 같다 ([Ad Placement API 예제](https://developers.google.com/ad-placement/docs/example)).
   ```html
   <script async data-adbreak-test="on"
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXX"
     crossorigin="anonymous"></script>
   <script>
     window.adsbygoogle = window.adsbygoogle || [];
     const adBreak = adConfig = function (o) { adsbygoogle.push(o); };
   </script>
   ```
   "다시 태어나기" 버튼에서는 이렇게 호출한다.
   ```js
   adBreak({ type: 'next', name: 'rebirth',
     beforeAd: () => { /* 버튼 잠금, 사운드 끄기 */ },
     afterAd:  () => { /* 버튼 풀기 */ },
     adBreakDone: () => revealBirth(sp.key) });   // 광고가 안 나와도 반드시 게임이 이어지게
   ```
   보상형(`type: 'reward'`)은 "한 번 더 살아나기" 같은 보상 설계가 있을 때만 쓴다. `data-adbreak-test="on"`은 테스트용이라 실제 배포 전에 지운다.
6. **지급**: 미화 100달러 기준 ([지급 기준](https://support.google.com/adsense/answer/1709871)). 원화 기준 금액과 한국 세금 정보(W-8BEN 등) 제출 절차 → **확인 필요**.
7. 광고를 붙이면 개인정보처리방침의 "행태정보·맞춤형 광고" 항목에 구글을 추가한다.

---

## 7. 할 일 체크리스트

| # | 할 일 | 누가 할 일 (사용자) | 제가 할 수 있는 일 (Claude) |
|---|---|---|---|
| 1 | 도메인 방식 결정 (A안 루트 / B안 `game.`) | 결정 | 장단점 정리 (이 문서 1-3) |
| 2 | GitHub 계정에서 도메인 인증 (TXT) | GitHub·Vercel 로그인 후 진행 | `dig`로 반영 확인 |
| 3 | 옛 Vercel 프로젝트에서 도메인 떼기 | Vercel 대시보드에서 진행 | — |
| 4 | Vercel DNS에 A/AAAA/CNAME 넣기, 와일드카드 정리 | 대시보드 또는 `vercel` CLI (계정 권한 필요) | 명령어 준비, 결과 `dig` 점검 |
| 5 | Pages 커스텀 도메인 + `CNAME` 파일 + Enforce HTTPS | 승인 (repo 설정 변경) | `gh api`로 설정, `CNAME` 파일 추가, `curl`로 HTTPS·리디렉트 확인 |
| 6 | 개인정보처리방침 확정 | 연락처·책임자 이름 기입, Supabase 리전 확인, 최종 검토 | `privacy-draft.md` → `privacy.html` 페이지로 만들기 |
| 7 | 소개·문의 페이지, 하단 링크, robots/sitemap/404 | 소개 문구·이메일 제공 | 페이지 작성과 연결 |
| 8 | 방문 통계 도구 붙이기 (제휴 문의에 숫자를 쓰기 위해) | 서비스 선택·가입 | 스크립트 삽입, 처리방침 반영 |
| 9 | 애드핏 제휴 문의 | 카카오계정으로 직접 신청 | 신청 문구 초안 |
| 10 | 애드핏 가입 (인증코드), 개인 유형 | 직접 진행 | — |
| 11 | 매체 등록, 광고단위 생성 (홈 320x100, 엔딩 300x250) | 콘솔에서 진행 후 **광고단위 ID 전달** | — |
| 12 | 광고 슬롯 구현 (`ADS` 설정, `js/ads.js`, CSS, 테스트) | 리뷰·승인 | 구현, 320~1440px 스크린샷 확인, `bump-version.sh` |
| 13 | 배포 후 광고 호출 확인 → 심사 대기 → 보류 시 재심사 | 콘솔에서 상태 확인, 재심사 요청 | 네트워크 요청·배치 점검, 보류 사유 대응 수정 |
| 14 | 정산 정보 등록 (실명, 주민등록번호, 계좌) | **직접만 가능** | — |
| 15 | (나중) 애드센스 신청, `ads.txt` | 계정 생성, pub-ID 전달 | `ads.txt` 추가, 코드 삽입 |
| 16 | (나중) H5 Games Ads 신청, 전면 광고 | 신청서 제출 | `adBreak` 연동, 빈도 제한 구현 |

---

## 출처 모음

- 애드핏: [소개](https://adfit.kakao.com/info) · [상품 소개](https://kakaobusiness.gitbook.io/main/partner/adfit) · [가입하기](https://kakaobusiness.gitbook.io/main/partner/adfit/join) · [매체 관리](https://kakaobusiness.gitbook.io/main/partner/adfit/start/media-manage) · [광고 관리](https://kakaobusiness.gitbook.io/main/partner/adfit/start/ad-manage) · [지급](https://kakaobusiness.gitbook.io/main/partner/adfit/start/pay) · [FAQ](https://kakaobusiness.gitbook.io/main/partner/adfit/faq) · [AdFit SDK](https://kakaobusiness.gitbook.io/main/partner/adfit/adfit-sdk) · [WEB SDK 가이드](https://adfit.github.io/wiki/web-guide/) · [제휴 문의](https://with.kakao.com/proposition?type=service&page=adfit)
- GitHub Pages: [커스텀 도메인 관리](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) · [도메인 인증](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) · [문제 해결](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages) · [REST API](https://docs.github.com/en/rest/pages/pages)
- Vercel: [DNS 레코드 관리](https://vercel.com/docs/domains/managing-dns-records) · [DNS 관리 KB(CLI)](https://vercel.com/kb/guide/how-to-manage-vercel-dns-records)
- 애드센스: [자격 요건](https://support.google.com/adsense/answer/9724) · [사이트 추가](https://support.google.com/adsense/answer/12169212) · [서브도메인 변경](https://support.google.com/adsense/answer/12170421?hl=en) · [ads.txt](https://support.google.com/adsense/answer/12171612) · [ads.txt 크롤링](https://support.google.com/adsense/answer/7679060?hl=en) · [지급 기준](https://support.google.com/adsense/answer/1709871) · [H5 Games Ads](https://adsense.google.com/start/solutions/h5-games-ads/) · [베타 신청](https://developers.google.com/ad-placement/docs/beta) · [Ad Placement API 예제](https://developers.google.com/ad-placement/docs/example)
- 정책: [Google Ads 암호화폐 정책(광고주 대상)](https://support.google.com/adspolicy/answer/14009787) · [개인정보보호위원회](https://www.pipc.go.kr) · [개인정보 포털](https://www.privacy.go.kr)
