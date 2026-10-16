-- Lista propozycji z licznikami, gotowa do wyświetlenia w aplikacji i w MCP.
create or replace view public.proposals_with_counts
with (security_invoker = true)
as
select
  p.*,
  a.name as area_name,
  pr.first_name as author_first_name,
  (count(v.*) filter (where v.value = 1))::int as votes_up,
  (count(v.*) filter (where v.value = -1))::int as votes_down,
  public.escalation_threshold(p.scope) as threshold
from public.proposals p
join public.areas a on a.id = p.area_id
join public.profiles pr on pr.id = p.author_id
left join public.votes v on v.proposal_id = p.id
group by p.id, a.name, pr.first_name;

-- Głos zalogowanego użytkownika (upsert: można zmienić zdanie).
-- Zwraca stan propozycji po głosie, w tym informację, czy awansowała.
create or replace function public.cast_vote(p_proposal_id uuid, p_value smallint default 1)
returns table (votes_up int, scope public.area_level, area_id text, escalated boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_scope_before public.area_level;
begin
  if (select auth.uid()) is null then
    raise exception 'Musisz być zalogowany, aby głosować';
  end if;

  select p.scope into v_scope_before from public.proposals p where p.id = p_proposal_id;

  insert into public.votes (proposal_id, user_id, value)
  values (p_proposal_id, (select auth.uid()), p_value)
  on conflict (proposal_id, user_id) do update set value = excluded.value;

  return query
  select c.votes_up, c.scope, c.area_id, c.scope <> v_scope_before
    from public.proposals_with_counts c where c.id = p_proposal_id;
end;
$$;
