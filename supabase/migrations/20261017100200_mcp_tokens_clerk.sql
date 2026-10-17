-- Token MCP dla kont Clerka. Clerk podaje sub = 'user_…' (nie uuid), więc auth.uid() się wywraca.
-- Każde konto Clerka dostaje własny wiersz w profiles (uuid), na który wskazuje mcp_tokens
-- i z którego korzysta serwer MCP (autor propozycji, głosy).
alter table public.profiles drop constraint profiles_id_fkey;
alter table public.profiles alter column id set default gen_random_uuid();
alter table public.profiles add column clerk_id text unique;

create or replace function public.create_mcp_token()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub text := (select auth.jwt() ->> 'sub');
  v_uid uuid;
  v_token text;
begin
  if v_sub is null then
    raise exception 'Musisz być zalogowany';
  end if;

  if v_sub ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    v_uid := v_sub::uuid; -- konto Supabase Auth (profil tworzy trigger rejestracji)
  else
    insert into public.profiles (clerk_id) values (v_sub)
    on conflict (clerk_id) do update set clerk_id = excluded.clerk_id
    returning id into v_uid;
  end if;

  v_token := 'wtm_' || replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');

  insert into public.mcp_tokens (user_id, token_hash)
  values (v_uid, encode(sha256(convert_to(v_token, 'UTF8')), 'hex'))
  on conflict (user_id) do update
    set token_hash = excluded.token_hash, created_at = now();

  return v_token;
end;
$$;

revoke execute on function public.create_mcp_token() from public, anon;
grant execute on function public.create_mcp_token() to authenticated;
