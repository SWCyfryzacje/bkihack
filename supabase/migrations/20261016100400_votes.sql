-- Jeden głos na użytkownika na propozycję (PK). value: 1 = za, -1 = przeciw.
create table public.votes (
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  value smallint not null default 1 check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (proposal_id, user_id)
);

create index votes_user_id_idx on public.votes (user_id);
