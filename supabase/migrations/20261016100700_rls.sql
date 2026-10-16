-- Odczyt publiczny, zapis tylko zalogowani i tylko we własnym imieniu.
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.proposal_events enable row level security;

create policy "areas: odczyt publiczny" on public.areas
  for select to anon, authenticated using (true);

create policy "profiles: odczyt publiczny" on public.profiles
  for select to anon, authenticated using (true);
create policy "profiles: edycja własnego" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "proposals: odczyt publiczny" on public.proposals
  for select to anon, authenticated using (true);
create policy "proposals: dodawanie własnych" on public.proposals
  for insert to authenticated
  with check ((select auth.uid()) = author_id and status = 'open');

create policy "votes: odczyt publiczny" on public.votes
  for select to anon, authenticated using (true);
create policy "votes: własny głos" on public.votes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "votes: zmiana własnego głosu" on public.votes
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "votes: cofnięcie własnego głosu" on public.votes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "proposal_events: odczyt publiczny" on public.proposal_events
  for select to anon, authenticated using (true);

-- Uprawnienia jawnie: klient może wstawić tylko wybrane kolumny propozycji.
revoke insert, update, delete on public.proposals from anon, authenticated;
grant select on public.areas, public.profiles, public.proposals, public.votes,
  public.proposal_events, public.proposals_with_counts to anon, authenticated;
grant update (first_name, last_name, area_id) on public.profiles to authenticated;
grant insert (title, body, category, area_id, author_id) on public.proposals to authenticated;
grant insert, update, delete on public.votes to authenticated;
revoke execute on function public.cast_vote(uuid, smallint) from public, anon;
grant execute on function public.cast_vote(uuid, smallint) to authenticated;

-- Realtime dla listy z licznikami
alter publication supabase_realtime add table public.proposals, public.votes, public.proposal_events;
