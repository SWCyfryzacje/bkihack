create type public.proposal_category as enum ('general', 'city_task', 'legislative');
create type public.proposal_status as enum ('open', 'escalated', 'closed');
create type public.proposal_source as enum ('app', 'mcp');

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 3 and 140),
  body text not null default '',
  category public.proposal_category not null default 'general',
  -- scope zawsze równy poziomowi area_id (pilnuje trigger poniżej)
  scope public.area_level not null default 'osiedle',
  area_id text not null references public.areas (id),
  status public.proposal_status not null default 'open',
  source public.proposal_source not null default 'app',
  agent_note text, -- uzasadnienie agenta AI, gdy zgłoszenie przyszło przez MCP
  created_at timestamptz not null default now()
);

create index proposals_area_id_idx on public.proposals (area_id);
create index proposals_author_id_idx on public.proposals (author_id);
create index proposals_created_at_idx on public.proposals (created_at desc);

-- scope wynika z obszaru, więc klient nie musi (i nie może) go ustawiać niezgodnie.
create or replace function private.proposals_sync_scope()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select level into new.scope from public.areas where id = new.area_id;
  return new;
end;
$$;

create trigger proposals_sync_scope
  before insert or update of area_id on public.proposals
  for each row execute function private.proposals_sync_scope();
