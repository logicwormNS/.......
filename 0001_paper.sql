create table if not exists teams (
  id text primary key,
  name text not null,
  abbr text not null
);

create table if not exists team_aliases (
  alias text primary key,
  team_id text not null references teams(id)
);

create table if not exists events (
  id text primary key,
  sport text not null,
  league text not null,
  start_at timestamptz not null,
  home_id text not null references teams(id),
  away_id text not null references teams(id),
  slug text,
  title text not null
);

create table if not exists book_quotes (
  id text primary key,
  event_id text not null references events(id),
  market_type text not null,
  selection text not null,
  line double precision,
  american integer not null,
  implied_p double precision not null,
  fair_p double precision not null,
  source text not null,
  ts timestamptz not null default now()
);

create index if not exists book_quotes_lookup
  on book_quotes (event_id, market_type, selection, ts desc);

create table if not exists poly_markets (
  condition_id text primary key,
  event_id text references events(id),
  slug text not null,
  question text not null,
  market_type text not null,
  selection text not null,
  line double precision,
  token_yes text not null,
  token_no text,
  tick double precision not null default 0.01,
  min_size double precision not null default 5,
  taker_fee_bps integer not null default 0,
  fee_type text
);

create table if not exists poly_books (
  token text not null,
  ts timestamptz not null,
  bid double precision,
  ask double precision,
  bid_size double precision,
  ask_size double precision,
  last_trade double precision,
  primary key (token, ts)
);

create index if not exists poly_books_token_ts on poly_books (token, ts desc);

create table if not exists signals (
  id text primary key,
  ts timestamptz not null default now(),
  event_id text,
  book_quote_id text,
  condition_id text,
  side text not null,
  edge_bps double precision not null,
  fair_p double precision not null,
  poly_p double precision not null,
  ask_size double precision,
  reason text not null,
  tradeable integer not null default 0
);

create index if not exists signals_ts on signals (ts desc);

create table if not exists orders (
  id text primary key,
  ts timestamptz not null default now(),
  signal_id text,
  venue text not null default 'poly_paper',
  token text not null,
  side text not null,
  limit_px double precision not null,
  shares double precision not null,
  status text not null,
  phase text not null default 'paper'
);

create table if not exists fills (
  id text primary key,
  order_id text not null references orders(id),
  ts timestamptz not null default now(),
  px double precision not null,
  shares double precision not null,
  fee_usd double precision not null,
  delay_ms integer not null
);

create table if not exists positions (
  token text primary key,
  condition_id text,
  event_id text,
  question text,
  selection text,
  shares double precision not null default 0,
  avg_px double precision not null default 0,
  fees_usd double precision not null default 0,
  realized_usd double precision not null default 0
);

create table if not exists tape_meta (
  k text primary key,
  v text not null
);
