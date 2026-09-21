import { ALL_MARKETS, type Evidence, type Market } from "@/lib/data";
import type { CfbGame } from "@/lib/cfb-tape";
import type { MemeQuote } from "@/lib/meme-tape";

export type SettleStatus = "open" | "resolved";
export type SettleResult = "yes" | "no";

export type Settlement = {
  marketId: string;
  status: SettleStatus;
  result?: SettleResult;
  reason: string;
  stamp?: string;
};

export type DeskFeeds = {
  now: Date;
  evidence: Evidence[];
  memes: MemeQuote[];
  cfb: CfbGame[];
};

function teamHit(game: CfbGame, name: string) {
  const n = name.toLowerCase();
  const blob = `${game.name} ${game.shortName} ${game.home.name} ${game.away.name}`.toLowerCase();
  return blob.includes(n);
}

function findGame(cfb: CfbGame[], market: Market) {
  const meta = market.cfb;
  if (!meta) return undefined;
  return cfb.find(
    (g) => teamHit(g, meta.home) && teamHit(g, meta.away),
  );
}

function pickScore(game: CfbGame, pick: string) {
  const p = pick.toLowerCase();
  const home = game.home.name.toLowerCase().includes(p);
  const away = game.away.name.toLowerCase().includes(p);
  if (home) {
    return { pick: game.home.score ?? 0, opp: game.away.score ?? 0 };
  }
  if (away) {
    return { pick: game.away.score ?? 0, opp: game.home.score ?? 0 };
  }
  return null;
}

function settleCfb(market: Market, now: Date, cfb: CfbGame[]): Settlement {
  const game = findGame(cfb, market);
  const deadline = new Date(market.resolveAt);
  if (game?.status === "in") {
    return {
      marketId: market.id,
      status: "open",
      reason: `Live · ${game.detail || "in progress"}`,
    };
  }
  if (game?.status === "post" && game.home.score != null && game.away.score != null) {
    const meta = market.cfb!;
    const scores = pickScore(game, meta.pick);
    if (!scores) {
      return {
        marketId: market.id,
        status: "open",
        reason: `Final posted · ${game.home.score}-${game.away.score} · pick not matched`,
      };
    }
    let yes = false;
    if (meta.moneyline) yes = scores.pick > scores.opp;
    else {
      const spread = meta.spread ?? 0;
      yes = scores.pick + spread > scores.opp;
    }
    return {
      marketId: market.id,
      status: "resolved",
      result: yes ? "yes" : "no",
      reason: `Final ${game.away.score} ${game.away.name} @ ${game.home.score} ${game.home.name}`,
      stamp: now.toISOString(),
    };
  }
  if (now.getTime() < deadline.getTime()) {
    return {
      marketId: market.id,
      status: "open",
      reason: game?.detail ? `Board · ${game.detail}` : "Awaiting kickoff / final",
    };
  }
  return {
    marketId: market.id,
    status: "open",
    reason: "Timestamp reached · waiting on public box score",
  };
}

function settleAi(market: Market, now: Date, feeds: DeskFeeds): Settlement {
  const deadline = new Date(market.resolveAt);
  const open = now.getTime() < deadline.getTime();

  if (market.id === "ai-goat-volume") {
    const ranked = [...feeds.memes].sort((a, b) => b.volume - a.volume);
    const leader = ranked[0];
    const goatLeads = leader?.id === "goat";
    if (open) {
      return {
        marketId: market.id,
        status: "open",
        reason: leader
          ? `Live leader ${leader.name} · settles Sept 30`
          : "Awaiting volume tape · settles Sept 30",
      };
    }
    return {
      marketId: market.id,
      status: "resolved",
      result: goatLeads ? "yes" : "no",
      reason: leader
        ? `AI-meme 24h volume rank · leader ${leader.name}`
        : "No live ranking at timestamp",
      stamp: deadline.toISOString(),
    };
  }

  const filings = feeds.evidence.filter(
    (e) => new Date(e.at).getTime() < deadline.getTime(),
  );
  const hasFiling = filings.length > 0;

  if (open) {
    return {
      marketId: market.id,
      status: "open",
      reason:
        market.id === "ai-cross-model"
          ? "Public disclosure window open through Sept 15 timestamp"
          : `Open through ${market.resolution}`,
    };
  }

  if (market.id === "ai-cross-model") {
    return {
      marketId: market.id,
      status: "resolved",
      result: hasFiling ? "yes" : "no",
      reason: hasFiling
        ? "Public URL on the tape before the Sept 15 timestamp"
        : "No public disclosure filed before the timestamp",
      stamp: deadline.toISOString(),
    };
  }

  return {
    marketId: market.id,
    status: "resolved",
    result: hasFiling ? "yes" : "no",
    reason: hasFiling
      ? "Public evidence on record at timestamp"
      : "Timestamp reached with no qualifying public event on the tape",
    stamp: deadline.toISOString(),
  };
}

export function settleMarket(market: Market, feeds: DeskFeeds): Settlement {
  if (market.kind === "cfb") return settleCfb(market, feeds.now, feeds.cfb);
  return settleAi(market, feeds.now, feeds);
}

export function settleCard(feeds: DeskFeeds) {
  return ALL_MARKETS.map((m) => settleMarket(m, feeds));
}

export function nextOpenMarket(feeds: DeskFeeds) {
  const open = ALL_MARKETS.filter(
    (m) => settleMarket(m, feeds).status === "open",
  ).sort(
    (a, b) => new Date(a.resolveAt).getTime() - new Date(b.resolveAt).getTime(),
  );
  return open[0];
}
