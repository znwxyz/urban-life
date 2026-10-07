-- 엔딩 방명록 "○○에게 한 마디" 테이블.
-- Supabase 대시보드 > SQL Editor에 그대로 붙여 넣고 Run.
-- 누구나(로그인 없이) 읽고 짧은 글을 남길 수 있지만, 수정·삭제는 아무도 못 한다(대시보드에서 관리자만 가능).

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  species text not null check (species in ('cat', 'cockroach', 'pigeon', 'fly')),
  ending text not null check (char_length(ending) between 1 and 8),
  message text not null check (char_length(message) between 1 and 80),
  days integer check (days between 0 and 10000),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_species_created_idx on public.guestbook (species, created_at desc);

-- 행 단위 보안: 정책에 적힌 것만 허용된다
alter table public.guestbook enable row level security;

drop policy if exists "guestbook read" on public.guestbook;
create policy "guestbook read" on public.guestbook
  for select to anon using (true);

drop policy if exists "guestbook write" on public.guestbook;
create policy "guestbook write" on public.guestbook
  for insert to anon with check (char_length(message) between 1 and 80);

-- 수정(update)·삭제(delete) 정책은 만들지 않는다 → 공개 키로는 불가능

-- 프로젝트를 만들 때 "Automatically expose new tables"를 껐다면, 공개 키(anon)에 필요한 권한만 직접 준다
grant usage on schema public to anon;
grant select, insert on public.guestbook to anon;

-- 동물을 추가하면 species 목록도 늘린다. 예:
-- alter table public.guestbook drop constraint guestbook_species_check;
-- alter table public.guestbook add constraint guestbook_species_check
--   check (species in ('cat', 'cockroach', 'pigeon', 'fly', 'sparrow'));

-- [추가] 이미 테이블을 만들었다면, 글쓴이의 생존 기간(일) 칸만 따로 추가한다
alter table public.guestbook add column if not exists days integer check (days between 0 and 10000);
