/* 방명록 연결 정보. Supabase 대시보드 > Project Settings > API 에서 복사한다.
   anonKey는 publishable(또는 예전 anon) 키로, 브라우저에 공개되도록 만들어진 키다. 실제 보호는 테이블의 행 단위 보안 정책(docs/supabase/guestbook.sql)이 한다.
   service_role 키는 절대 여기에 넣지 않는다. 비어 있으면 방명록은 "곧 열려요"로 표시된다 */
/* 제작자 응원 링크. 비어 있는 건 버튼을 숨긴다.
   토스: 토스 앱 > 전체 > 토스 아이디 → https://toss.me/아이디
   카카오페이: 카카오페이 앱 > 송금 > 송금코드 → https://qr.kakaopay.com/... */
const SUPPORT = Object.freeze({
  toss: '',
  kakaopay: '',
});

const GUESTBOOK = Object.freeze({
  url: 'https://afyvtzcfxprhmoewbkzr.supabase.co',
  anonKey: 'sb_publishable_D5bwQie2ypnzy0C5beOcAQ_iMKhCjaz',
});
