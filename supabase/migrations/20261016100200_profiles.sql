-- Profil tworzony automatycznie przy rejestracji.
-- Aplikacja przekazuje w signUp: options.data = { first_name, last_name, area_id }.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  area_id text references public.areas (id),
  created_at timestamptz not null default now()
);

create index profiles_area_id_idx on public.profiles (area_id);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name, area_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    -- nieznane osiedle nie blokuje rejestracji
    (select a.id from public.areas a
      where a.id = new.raw_user_meta_data ->> 'area_id' and a.level = 'osiedle')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
