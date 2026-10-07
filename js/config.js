/* 방명록 연결 정보. Supabase 대시보드 > Project Settings > API 에서 복사한다.
   anonKey는 브라우저에 공개되도록 만들어진 키다. 실제 보호는 테이블의 행 단위 보안 정책(docs/supabase/guestbook.sql)이 한다.
   service_role 키는 절대 여기에 넣지 않는다. 비어 있으면 방명록은 "곧 열려요"로 표시된다 */
const GUESTBOOK = Object.freeze({
  url: '',
  anonKey: '',
});
