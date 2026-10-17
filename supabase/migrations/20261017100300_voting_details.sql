alter table public.votings
  add column votes_for integer not null default 0 check (votes_for >= 0),
  add column votes_against integer not null default 0 check (votes_against >= 0),
  add column mechanism text not null default 'for_against'
    check (mechanism in ('for_against'));