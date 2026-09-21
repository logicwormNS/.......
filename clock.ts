import { formatCountdown, formatUtcShort } from "@/lib/format";

export function stampOrDash(now: Date | null, targetIso: string) {
  if (!now) return "—";
  return formatCountdown(new Date(targetIso), now);
}

export function utcOrDash(now: Date | null) {
  if (!now) return "—";
  return formatUtcShort(now);
}

export function remainOrDash(now: Date | null, target: Date) {
  if (!now) return "—";
  return formatCountdown(target, now);
}
