-- Schemat na funkcje wewnętrzne (niewystawiony przez API).
create schema if not exists private;

-- Obszary: miasto -> okreg -> osiedle. id to czytelny slug (np. 'rubinkowo').
create type public.area_level as enum ('osiedle', 'okreg', 'miasto');

create table public.areas (
  id text primary key,
  name text not null,
  level public.area_level not null,
  parent_id text references public.areas (id)
);

create index areas_parent_id_idx on public.areas (parent_id);

-- Rodzic obszaru o jeden poziom wyżej (null dla miasta).
create or replace function public.area_parent(p_area_id text)
returns text
language sql
stable
set search_path = ''
as $$
  select parent_id from public.areas where id = p_area_id;
$$;
