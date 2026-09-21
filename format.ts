export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function formatPct(n: number, digits = 0) {
  return `${n.toFixed(digits)}%`;
}

export function formatScore(n: number) {
  return n.toFixed(1);
}

export function formatUsdCompact(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 100 ? 2 : 0,
  }).format(n);
}

export function americanPayout(stake: number, american: number) {
  if (american < 0) return stake * (100 / Math.abs(american));
  return stake * (american / 100);
}

export function decimalFromAmerican(american: number) {
  if (american < 0) return 1 + 100 / Math.abs(american);
  return 1 + american / 100;
}

export function impliedFromAmerican(american: number) {
  if (american < 0) return (Math.abs(american) / (Math.abs(american) + 100)) * 100;
  return (100 / (american + 100)) * 100;
}

export function americanFromProb(pct: number) {
  const p = clamp(pct, 0.1, 99.9) / 100;
  if (p >= 0.5) return -Math.round((p / (1 - p)) * 100);
  return Math.round(((1 - p) / p) * 100);
}

export function formatAmerican(n: number) {
  if (!Number.isFinite(n)) return "—";
  const r = Math.round(n);
  return r > 0 ? `+${r}` : String(r);
}

export function parlayDecimal(americans: number[]) {
  return americans.reduce((acc, a) => acc * decimalFromAmerican(a), 1);
}

export function stakeReturn(stake: number, american: number) {
  return stake + americanPayout(stake, american);
}

export function formatStakeLine(american: number, stake = 100) {
  const profit = americanPayout(stake, american);
  return `$${stake} → +$${profit.toFixed(2)}`;
}

export function formatUtcStamp(d: Date) {
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const h = pad(d.getUTCHours());
  const min = pad(d.getUTCMinutes());
  const s = pad(d.getUTCSeconds());
  return `${y}-${m}-${day} ${h}:${min}:${s} UTC`;
}

const MONTHS_SHORT = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const MONTHS_LONG = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function formatUtcShort(d: Date) {
  return `${pad(d.getUTCDate())} ${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}  ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`;
}

export function formatLongDate(d: Date) {
  return `${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatCountdown(target: Date, now: Date) {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "REACHED";
  const total = Math.floor(ms / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}D ${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function signed(n: number, digits = 1) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(digits)}`;
}
