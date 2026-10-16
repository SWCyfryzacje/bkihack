-- Osobisty token do serwera MCP: https://<host>/mcp/<token>
-- W bazie trzymamy tylko sha256; jawny token zwracany jest raz, przy generowaniu.
create table public.mcp_tokens (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  token_hash text not null unique,
  created_at timestamptz not null default now()
);

alter table public.mcp_tokens enable row level security;
-- brak polityk: tabelę czyta wyłącznie serwer MCP (service_role)
revoke all on public.mcp_tokens from anon, authenticated;

-- Generuje nowy token dla zalogowanego użytkownika (stary przestaje działać).
create or replace function public.create_mcp_token()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_token text;
begin
  if v_uid is null then
    raise exception 'Musisz być zalogowany';
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
