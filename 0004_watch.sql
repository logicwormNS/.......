-- Watch layer: event identity, book history (open/current), Poly L2, OMS alerts.
-- Alerts are the same events the OMS already uses. Not a second brain.

alter table events add column if not exists status text not null default 'scheduled';
alter table events add column if not exists week integer;
alter table events add column if not exists conference text;
alter table events add column if not exists tv_window text;
alter table events add column if not exists venue_tz text not null default 'America/New_York';

alter table book_quotes add column if not exists period text not null default 'fg';
alter table book_quotes add column if not exists book_key text;
alter table book_quotes add column if not exists open_line double precision;
alter table book_quotes add column if not exists open_american integer;
alter table book_quotes add column if not exists prev_line double precision;
alter table book_quotes add column if not exists prev_american integer;
alter table book_quotes add column if not exists move_type text;

alter table poly_markets add column if not exists volume double precision;
alter table poly_markets add column if not exists liquidity double precision;

alter table poly_books add column if not exists bid2 double precision;
alter table poly_books add column if not exists bid2_size double precision;
alter table poly_books add column if not exists ask2 double precision;
alter table poly_books add column if not exists ask2_size double precision;
alter table poly_books add column if not exists bid3 double precision;
alter table poly_books add column if not exists bid3_size double precision;
alter table poly_books add column if not exists ask3 double precision;
alter table poly_books add column if not exists ask3_size double precision;
alter table poly_books add column if not exists spread double precision;

create table if not exists watch_alerts (
  id text primary key,
  ts timestamptz not null default now(),
  kind text not null,
  event_id text,
  token text,
  detail text not null
);

create index if not exists watch_alerts_ts on watch_alerts (ts desc);
create index if not exists watch_alerts_kind on watch_alerts (kind, event_id, ts desc);
