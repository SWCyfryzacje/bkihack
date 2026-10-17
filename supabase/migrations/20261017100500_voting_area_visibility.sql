-- Głosowania "Moja okolica" dostają osiedle autora (w stage_area_id, bez etapów).
-- Głosowanie z obszarem widzą i mogą głosować tylko jego mieszkańcy:
--   local -> osiedle autora; citywide -> obszar bieżącego etapu (osiedle, okręg, miasto).
-- Głosowania bez obszaru (everyday, stare wpisy) są widoczne dla wszystkich.

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

  if new.scope = 'local' then
    new.stage_area_id := v_area_id;
    return new;
  end if;

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

-- Czy zalogowany mieszkaniec należy do obszaru głosowania (null/miasto = wszyscy).
create or replace function public.can_see_voting_area(p_area_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_area_id is null
    or exists (select 1 from public.areas where id = p_area_id and level = 'miasto')
    or public.area_contains(
      p_area_id,
      (select area_id from public.profiles where id = (select public.current_profile_id()))
    );
$$;

drop policy "votings: odczyt publiczny" on public.votings;
create policy "votings: odczyt w obszarze" on public.votings
  for select to anon, authenticated
  using (public.can_see_voting_area(stage_area_id));

-- Przed głosem: domknij zaległe etapy, odrzuć głos po zakończeniu lub spoza obszaru głosowania.
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

  if v_voting.stage is distinct from 'miasto'
     and v_voting.stage_area_id is not null
     and not public.area_contains(
       v_voting.stage_area_id,
       (select area_id from public.profiles where id = new.user_id)
     ) then
    raise exception 'W tym głosowaniu mogą głosować tylko mieszkańcy obszaru: %',
      (select name from public.areas where id = v_voting.stage_area_id);
  end if;

  return new;
end;
$$;
