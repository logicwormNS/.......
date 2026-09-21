-- Paper OMS: one working bid + one working ask per token. Replace, don't stack.
create table if not exists working_orders (
  id text primary key,
  ts timestamptz not null default now(),
  token text not null,
  side text not null,
  px double precision not null,
  sz double precision not null,
  status text not null default 'live',
  reason text not null,
  client_id text not null
);

create unique index if not exists working_orders_live
  on working_orders (token, side) where status = 'live';

create index if not exists working_orders_token on working_orders (token, ts desc);

create table if not exists oms_log (
  id text primary key,
  ts timestamptz not null default now(),
  token text not null,
  side text,
  action text not null,
  px double precision,
  sz double precision,
  client_id text,
  reason text not null
);

create index if not exists oms_log_ts on oms_log (ts desc);
