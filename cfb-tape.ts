import { createServerFn } from "@tanstack/react-start";

export type CfbGame = {
  id: string;
  name: string;
  shortName: string;
  status: "pre" | "in" | "post" | "other";
  detail: string;
  home: { name: string; score: number | null };
  away: { name: string; score: number | null };
};

type EspnCompetitor = {
  homeAway?: string;
  score?: string;
  team?: { displayName?: string; shortDisplayName?: string; name?: string };
};

type EspnEvent = {
  id?: string;
  name?: string;
  shortName?: string;
  status?: { type?: { state?: string; description?: string; shortDetail?: string } };
  competitions?: { competitors?: EspnCompetitor[] }[];
};

function teamName(c: EspnCompetitor) {
  return c.team?.displayName || c.team?.name || c.team?.shortDisplayName || "";
}

function parseState(state?: string): CfbGame["status"] {
  if (state === "pre") return "pre";
  if (state === "in") return "in";
  if (state === "post") return "post";
  return "other";
}

async function loadDate(date: string): Promise<CfbGame[]> {
  const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=${date}&limit=200`;
  const res = await fetch(url, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { events?: EspnEvent[] };
  return (json.events ?? []).map((ev) => {
    const comps = ev.competitions?.[0]?.competitors ?? [];
    const home = comps.find((c) => c.homeAway === "home");
    const away = comps.find((c) => c.homeAway === "away");
    const homeScore = home?.score != null ? Number(home.score) : null;
    const awayScore = away?.score != null ? Number(away.score) : null;
    return {
      id: ev.id ?? ev.name ?? date,
      name: ev.name ?? "",
      shortName: ev.shortName ?? "",
      status: parseState(ev.status?.type?.state),
      detail:
        ev.status?.type?.shortDetail ||
        ev.status?.type?.description ||
        "",
      home: {
        name: home ? teamName(home) : "",
        score: Number.isFinite(homeScore) ? homeScore : null,
      },
      away: {
        name: away ? teamName(away) : "",
        score: Number.isFinite(awayScore) ? awayScore : null,
      },
    };
  });
}

export const fetchCfbTape = createServerFn({ method: "GET" }).handler(
  async (): Promise<CfbGame[]> => {
    try {
      const [d12, d13] = await Promise.all([
        loadDate("20260912"),
        loadDate("20260913"),
      ]);
      const byId = new Map<string, CfbGame>();
      for (const g of [...d12, ...d13]) byId.set(g.id, g);
      return Array.from(byId.values());
    } catch {
      return [];
    }
  },
);
