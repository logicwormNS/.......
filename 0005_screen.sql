-- Odds screen: multi-shop books, Kalshi venue, horizon windows.
-- PIN is the MM. DK/MGM/FD/CZR are squares. Poly/Kalshi are cents.

alter table events add column if not exists horizon text not null default 'weekly';
alter table events add column if not exists venue text not null default 'poly';

create table if not exists kalshi_markets (
  ticker text primary key,
  event_id text references events(id),
  event_ticker text,
  title text not null,
  market_type text not null,
  selection text not null,
  line double precision,
  yes_bid double precision,
  yes_ask double precision,
  no_bid double precision,
  no_ask double precision,
  last_px double precision,
  volume double precision,
  status text,
  close_time timestamptz,
  ts timestamptz not null default now()
);

create index if not exists kalshi_markets_event
  on kalshi_markets (event_id, market_type, selection);
