import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCfbTape } from "@/lib/cfb-tape";
import { ALL_MARKETS, MEME_TOKENS } from "@/lib/data";
import { useNow } from "@/lib/hooks";
import { fetchMemeTape } from "@/lib/meme-tape";
import { nextOpenMarket, settleCard, type DeskFeeds } from "@/lib/settle";
import { useBook } from "@/lib/store";
import { jviTape } from "@/lib/tape";

const SSR_CLOCK = new Date("2026-09-11T15:00:00.000Z");

const seedMemes = MEME_TOKENS.map((t) => ({
  id: t.id,
  name: t.name,
  volume: t.seedVolume,
  priceUsd: null,
  live: false,
}));

function useDeskState() {
  const now = useNow();
  const evidence = useBook((s) => s.evidence);
  const memesQ = useQuery({
    queryKey: ["meme-tape"],
    queryFn: () => fetchMemeTape(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
  const cfbQ = useQuery({
    queryKey: ["cfb-tape"],
    queryFn: () => fetchCfbTape(),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  const memes = memesQ.data && memesQ.data.length > 0 ? memesQ.data : seedMemes;
  const cfb = cfbQ.data ?? [];
  const clock = now ?? SSR_CLOCK;
  const tape = jviTape(now);

  const feeds: DeskFeeds = useMemo(
    () => ({ now: clock, evidence, memes, cfb }),
    [clock, evidence, memes, cfb],
  );

  const settlements = useMemo(() => settleCard(feeds), [feeds]);
  const byId = useMemo(
    () => Object.fromEntries(settlements.map((s) => [s.marketId, s])),
    [settlements],
  );

  return {
    now,
    clock,
    tape,
    memes,
    memesLive: Boolean(memesQ.data?.some((m) => m.live)),
    cfb,
    settlements,
    byId,
    next: nextOpenMarket(feeds),
    resolved: settlements.filter((s) => s.status === "resolved"),
    evidence,
  };
}

export type DeskState = ReturnType<typeof useDeskState>;

const DeskContext = createContext<DeskState | null>(null);

export function DeskProvider({ children }: { children: ReactNode }) {
  const value = useDeskState();
  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  const ctx = useContext(DeskContext);
  if (!ctx) throw new Error("useDesk must be used inside DeskProvider");
  return ctx;
}

export function useMarketSettle(marketId: string) {
  const desk = useDesk();
  return {
    ...desk,
    settlement: desk.byId[marketId],
    market: ALL_MARKETS.find((m) => m.id === marketId),
  };
}
