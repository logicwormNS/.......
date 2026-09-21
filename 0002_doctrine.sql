alter table events add column if not exists book_class text not null default 'sports';
alter table events add column if not exists flatten_at timestamptz;

alter table positions add column if not exists book_class text;
alter table positions add column if not exists role text;
alter table positions add column if not exists flatten_at timestamptz;

create table if not exists maker_quotes (
  id text primary key,
  ts timestamptz not null default now(),
  token text not null,
  condition_id text,
  event_id text,
  question text,
  fair_p double precision not null,
  bid_px double precision not null,
  ask_px double precision not null,
  ttl_ms integer not null,
  expires_at timestamptz not null,
  two_way_usd double precision not null default 0,
  status text not null default 'live',
  book_class text not null
);
