-- Autor głosowania w prywatnej tabeli: anonimowych głosowań nie da się powiązać z osobą.
-- Głosowania "Moja okolica" i "Całe miasto" wymagają osiedla w profilu autora
-- (wcześniej autor bez osiedla tworzył głosowanie widoczne dla wszystkich).
create table private.voting_authors (
  voting_id uuid primary key references public.votings (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade
);

create index voting_authors_profile_id_idx on private.voting_authors (profile_id);

create or replace function private.init_voting_stage()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_area_id text;
begin
  if new.scope not in ('local', 'citywide') then
    return new;
  end if;

  select area_id into v_area_id from public.profiles
    where id = (select public.current_profile_id());

  if v_area_id is null then
    raise exception 'Uzupełnij osiedle w profilu, aby utworzyć to głosowanie';
  end if;

  new.stage_area_id := v_area_id;
  if new.scope = 'citywide' then
    new.status := 'open';
    new.stage := 'osiedle';
    new.stage_started_at := now();
  end if;
  return new;
end;
$$;

create or replace function private.save_voting_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile_id uuid := (select public.current_profile_id());
begin
  if v_profile_id is not null then
    insert into private.voting_authors (voting_id, profile_id)
    values (new.id, v_profile_id);
  end if;
  return null;
end;
$$;

create trigger votings_save_author
  after insert on public.votings
  for each row execute function private.save_voting_author();

-- Imię i nazwisko autora; null dla anonimowych i niewidocznych dla pytającego.
create or replace function public.voting_author_name(p_voting_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.first_name || ' ' || p.last_name
  from public.votings v
  join private.voting_authors va on va.voting_id = v.id
  join public.profiles p on p.id = va.profile_id
  where v.id = p_voting_id
    and not v.is_anonymous
    and public.can_see_voting_area(v.stage_area_id);
$$;

-- Widok rozszerzony o autora (nowa kolumna na końcu).
create or replace view public.votings_with_counts
with (security_invoker = true)
as
select
  v.id,
  v.title,
  v.description,
  v.category,
  v.scope,
  v.is_anonymous,
  v.created_at,
  (v.baseline_votes_for + count(vv.voting_id) filter (where vv.value = 1))::integer as votes_for,
  (v.baseline_votes_against + count(vv.voting_id) filter (where vv.value = -1))::integer as votes_against,
  max(vv.value) filter (where vv.user_id = (select public.current_profile_id())) as my_vote,
  v.status,
  v.stage,
  a.name as stage_area_name,
  v.stage_started_at + r.duration as stage_ends_at,
  r.threshold as stage_threshold,
  s.eligible as stage_eligible,
  s.voters as stage_voters,
  s.votes_for as stage_votes_for,
  s.votes_against as stage_votes_against,
  public.voting_author_name(v.id) as author_name
from public.votings v
left join public.voting_votes vv on vv.voting_id = v.id
left join public.areas a on a.id = v.stage_area_id
left join lateral public.voting_stage_rules(v.stage) r on true
left join lateral public.voting_stage_stats(v.id) s on true
group by v.id, a.name, r.duration, r.threshold,
  s.eligible, s.voters, s.votes_for, s.votes_against;
