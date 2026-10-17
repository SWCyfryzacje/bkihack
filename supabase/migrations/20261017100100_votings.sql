-- Głosowania zgodne z typem Voting z src/types/type.ts (front z brancha dev).
create type public.voting_category as enum (
  'transport', 'greenery', 'safety', 'cleanliness', 'noise',
  'housing', 'services', 'culture', 'community', 'other'
);
create type public.voting_scope as enum ('everyday', 'local', 'citywide');

create table public.votings (
  id uuid primary key default gen_random_uuid(),
  -- limity jak w ReportFormSchema (src/types/zod-types.ts)
  title text not null check (char_length(title) between 5 and 80),
  description text not null check (char_length(description) between 20 and 1000),
  category public.voting_category not null,
  scope public.voting_scope not null,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

create index votings_created_at_idx on public.votings (created_at desc);

-- Odczyt publiczny, dodawanie tylko zalogowani.
alter table public.votings enable row level security;

create policy "votings: odczyt publiczny" on public.votings
  for select to anon, authenticated using (true);
create policy "votings: dodawanie" on public.votings
  for insert to authenticated with check (true);

revoke all on public.votings from anon, authenticated;
grant select on public.votings to anon, authenticated;
grant insert (title, description, category, scope, is_anonymous)
  on public.votings to authenticated;

-- Realtime dla listy na ekranie głównym (subscribeToVotings)
alter publication supabase_realtime add table public.votings;
