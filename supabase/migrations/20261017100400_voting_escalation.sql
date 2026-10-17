-- Skalowanie głosowań o zasięgu "Całe miasto": osiedle autora -> jego okręg -> miasto.
--   osiedle: po 3 dniach przechodzi dalej przy >= 70% głosów za; od razu przy frekwencji >= 70% i > 70% za
--   okreg:   po 3 dniach przechodzi dalej przy >= 60% głosów za; od razu przy frekwencji >= 60% i > 60% za
--   miasto:  kończy się 14 dni po starcie (passed przy większości za)
-- Głosy nie są resetowane po awansie - liczą się głosy mieszkańców obszaru bieżącego etapu.
-- Pozostałe zasięgi (everyday, local) działają jak dotąd: stage = null, status zawsze 'open'.
alter table public.votings
  add column stage public.area_level,
  add column stage_area_id text references public.areas (id),
  add column stage_started_at timestamptz,
  add column status text not null default 'open'
    check (status in ('open', 'passed', 'rejected'));

-- Dotychczasowe głosowania miejskie nie mają autora - startują od razu na etapie miasta.
update public.votings
set stage = 'miasto',
    stage_area_id = (select id from public.areas where level = 'miasto' limit 1),
    stage_started_at = created_at
where scope = 'citywide';

-- Czas trwania i próg danego etapu (próg null = etap końcowy).
create or replace function public.voting_stage_rules(p_stage public.area_level)
returns table (duration interval, threshold numeric)
language sql
immutable
set search_path = ''
as $$
  select
    case p_stage
      when 'osiedle' then interval '3 days'
      when 'okreg' then interval '3 days'
      when 'miasto' then interval '14 days'
    end,
    case p_stage
      when 'osiedle' then 0.7
      when 'okreg' then 0.6
    end;
$$;

-- Czy obszar p_area_id zawiera obszar p_inner_id (lub jest nim).
create or replace function public.area_contains(p_area_id text, p_inner_id text)
returns boolean
language sql
stable
set search_path = ''
as $$
  with recursive up as (
    select id, parent_id from public.areas where id = p_inner_id
    union all
    select a.id, a.parent_id from public.areas a join up on a.id = up.parent_id
  )
  select exists (select 1 from up where id = p_area_id);
$$;

-- Uprawnieni mieszkańcy i ich głosy na bieżącym etapie (tylko agregaty, stąd security definer).
create or replace function public.voting_stage_stats(p_voting_id uuid)
returns table (eligible int, voters int, votes_for int, votes_against int)
language sql
stable
security definer
set search_path = ''
as $$
  with v as (
    select stage, stage_area_id from public.votings where id = p_voting_id
  ),
  residents as (
    select p.id from public.profiles p, v
    where v.stage = 'miasto' or public.area_contains(v.stage_area_id, p.area_id)
  )
  select
    (select count(*) from residents)::int,
    count(vv.user_id)::int,
    (count(*) filter (where vv.value = 1))::int,
    (count(*) filter (where vv.value = -1))::int
  from public.voting_votes vv
  where vv.voting_id = p_voting_id
    and vv.user_id in (select id from residents);
$$;

-- Przesuwa głosowanie przez kolejne etapy, póki spełnia warunki (także zaległe czasowo).
create or replace function private.advance_voting(p_voting_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_voting public.votings%rowtype;
  v_rules record;
  v_stats record;
  v_deadline timestamptz;
  v_share numeric;
  v_turnout numeric;
  v_promote_at timestamptz;
  v_next_area public.areas%rowtype;
begin
  loop
    -- blokada wiersza: równoległe głosy nie wywołają podwójnego awansu
    select * into v_voting from public.votings
      where id = p_voting_id for update;
    if not found or v_voting.stage is null or v_voting.status <> 'open' then
      return;
    end if;

    select * into v_rules from public.voting_stage_rules(v_voting.stage);
    select * into v_stats from public.voting_stage_stats(p_voting_id);
    v_deadline := v_voting.stage_started_at + v_rules.duration;
    v_share := v_stats.votes_for::numeric
      / nullif(v_stats.votes_for + v_stats.votes_against, 0);
    v_turnout := v_stats.voters::numeric / nullif(v_stats.eligible, 0);

    if v_rules.threshold is null then
      if now() < v_deadline then
        return;
      end if;
      update public.votings
        set status = case when coalesce(v_share, 0) > 0.5 then 'passed' else 'rejected' end
        where id = p_voting_id;
      return;
    end if;

    if v_turnout >= v_rules.threshold and v_share > v_rules.threshold then
      v_promote_at := least(now(), v_deadline);
    elsif now() >= v_deadline and v_share >= v_rules.threshold then
      v_promote_at := v_deadline;
    elsif now() >= v_deadline then
      update public.votings set status = 'rejected' where id = p_voting_id;
      return;
    else
      return;
    end if;

    select * into v_next_area from public.areas
      where id = public.area_parent(v_voting.stage_area_id);
    if not found then
      return;
    end if;

    update public.votings
      set stage = v_next_area.level,
          stage_area_id = v_next_area.id,
          stage_started_at = v_promote_at
      where id = p_voting_id;
  end loop;
end;
$$;

-- Przejścia czasowe (brak pg_cron) - wywoływane przez aplikację przed pobraniem listy.
create or replace function public.advance_votings()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  for v_id in
    select id from public.votings where stage is not null and status = 'open'
  loop
    perform private.advance_voting(v_id);
  end loop;
end;
$$;

revoke all on function public.advance_votings() from public;
grant execute on function public.advance_votings() to anon, authenticated;

-- Nowe głosowanie miejskie startuje na osiedlu autora.
create or replace function private.init_voting_stage()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_area_id text;
begin
  if new.scope <> 'citywide' then
    return new;
  end if;

  select area_id into v_area_id from public.profiles
    where id = (select public.current_profile_id());

  new.status := 'open';
  new.stage_started_at := now();
  if v_area_id is null then
    -- autor bez osiedla: od razu etap miasta
    new.stage := 'miasto';
    new.stage_area_id := (select id from public.areas where level = 'miasto' limit 1);
  else
    new.stage := 'osiedle';
    new.stage_area_id := v_area_id;
  end if;
  return new;
end;
$$;

create trigger votings_init_stage
  before insert on public.votings
  for each row execute function private.init_voting_stage();

-- Przed głosem: domknij zaległe etapy, odrzuć głos po zakończeniu lub spoza obszaru etapu.
create or replace function private.check_voting_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_voting public.votings%rowtype;
begin
  perform private.advance_voting(new.voting_id);

  select * into v_voting from public.votings where id = new.voting_id;
  if v_voting.status <> 'open' then
    raise exception 'Głosowanie jest już zakończone';
  end if;

  if v_voting.stage in ('osiedle', 'okreg') and not public.area_contains(
    v_voting.stage_area_id,
    (select area_id from public.profiles where id = new.user_id)
  ) then
    raise exception 'Na tym etapie mogą głosować tylko mieszkańcy obszaru: %',
      (select name from public.areas where id = v_voting.stage_area_id);
  end if;

  return new;
end;
$$;

create trigger voting_votes_check
  before insert or update of value on public.voting_votes
  for each row execute function private.check_voting_vote();

-- Po głosie: szybka ścieżka (wysoka frekwencja) przenosi głosowanie od razu.
create or replace function private.advance_on_vote()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.advance_voting(new.voting_id);
  return null;
end;
$$;

create trigger voting_votes_advance
  after insert or update of value on public.voting_votes
  for each row execute function private.advance_on_vote();

-- Widok rozszerzony o etap (nowe kolumny na końcu - wymóg create or replace view).
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
  s.votes_against as stage_votes_against
from public.votings v
left join public.voting_votes vv on vv.voting_id = v.id
left join public.areas a on a.id = v.stage_area_id
left join lateral public.voting_stage_rules(v.stage) r on true
left join lateral public.voting_stage_stats(v.id) s on true
group by v.id, a.name, r.duration, r.threshold,
  s.eligible, s.voters, s.votes_for, s.votes_against;
