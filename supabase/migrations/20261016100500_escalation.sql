-- Eskalacja: po przekroczeniu progu głosów "za" propozycja awansuje o poziom wyżej.
-- Progi są kumulatywne (liczymy wszystkie głosy za, bez resetu po awansie).
create table public.proposal_events (
  id bigint generated always as identity primary key,
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  from_scope public.area_level not null,
  to_scope public.area_level not null,
  from_area_id text not null references public.areas (id),
  to_area_id text not null references public.areas (id),
  votes_at_escalation int not null,
  created_at timestamptz not null default now()
);

create index proposal_events_proposal_id_idx on public.proposal_events (proposal_id);

-- Próg awansu z danego poziomu; null = brak wyższego poziomu.
create or replace function public.escalation_threshold(p_scope public.area_level)
returns int
language sql
immutable
set search_path = ''
as $$
  select case p_scope
    when 'osiedle' then 10
    when 'okreg' then 50
    else null
  end;
$$;

create or replace function private.escalate_on_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_proposal public.proposals%rowtype;
  v_up int;
  v_parent text;
begin
  -- blokada wiersza: równoległe głosy nie wywołają podwójnego awansu
  select * into v_proposal from public.proposals
    where id = new.proposal_id for update;

  select count(*) into v_up from public.votes
    where proposal_id = new.proposal_id and value = 1;

  if v_proposal.status <> 'open'
     or public.escalation_threshold(v_proposal.scope) is null
     or v_up < public.escalation_threshold(v_proposal.scope) then
    return null;
  end if;

  v_parent := public.area_parent(v_proposal.area_id);
  if v_parent is null then
    return null;
  end if;

  -- trigger proposals_sync_scope sam ustawi nowy scope
  update public.proposals set area_id = v_parent where id = v_proposal.id;

  insert into public.proposal_events
    (proposal_id, from_scope, to_scope, from_area_id, to_area_id, votes_at_escalation)
  select v_proposal.id, v_proposal.scope, p.scope, v_proposal.area_id, v_parent, v_up
    from public.proposals p where p.id = v_proposal.id;

  -- na poziomie miasta propozycja trafia do urzędu
  update public.proposals set status = 'escalated'
    where id = v_proposal.id and scope = 'miasto';

  return null;
end;
$$;

create trigger votes_escalate
  after insert or update of value on public.votes
  for each row execute function private.escalate_on_vote();
