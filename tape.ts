import { VULN_MODELS, type VulnModel } from "@/lib/data";
import { clamp, formatLongDate } from "@/lib/format";

export const FIRST_TAPE = "2026-09-11T08:00:00.000Z";
export const TAPE_HOUR_UTC = 8;

export function tapePrintAt(now: Date) {
  const first = new Date(FIRST_TAPE);
  const t = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), TAPE_HOUR_UTC, 0, 0),
  );
  if (now.getTime() < t.getTime()) t.setUTCDate(t.getUTCDate() - 1);
  if (t.getTime() < first.getTime()) return first;
  return t;
}

export function nextTapeAt(print: Date) {
  const n = new Date(print);
  n.setUTCDate(n.getUTCDate() + 1);
  return n;
}

export function tapeDays(print: Date) {
  const first = new Date(FIRST_TAPE);
  return Math.max(
    0,
    Math.round((print.getTime() - first.getTime()) / 86_400_000),
  );
}

export function rollModels(print: Date): VulnModel[] {
  const days = tapeDays(print);
  return VULN_MODELS.map((m) => {
    const score = clamp(m.score + m.change * days, 0, 100);
    const history = [...m.history];
    for (let i = 0; i < days; i += 1) {
      history.push(clamp(m.score + m.change * (i + 1), 0, 100));
    }
    let tone: VulnModel["tone"] = "low";
    if (score >= 80) tone = "crit";
    else if (score >= 45) tone = "mid";
    return { ...m, score, tone, history };
  });
}

export function jviTape(now: Date | null) {
  const clock = now ?? new Date(FIRST_TAPE);
  const print = tapePrintAt(clock);
  return {
    print,
    next: nextTapeAt(print),
    label: formatLongDate(print),
    days: tapeDays(print),
    models: rollModels(print),
  };
}
