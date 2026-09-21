import { createServerFn } from "@tanstack/react-start";
import { MEME_TOKENS } from "@/lib/data";

export type MemeQuote = {
  id: string;
  name: string;
  volume: number;
  priceUsd: number | null;
  live: boolean;
};

type DexPair = {
  baseToken?: { symbol?: string; address?: string };
  volume?: { h24?: number };
  priceUsd?: string;
  chainId?: string;
};

function bestPair(pairs: DexPair[] | undefined, seed: number) {
  const list = (pairs ?? [])
    .filter((p) => (p.volume?.h24 ?? 0) > 0)
    .sort((a, b) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
  const top = list[0];
  if (!top) return null;
  const priceUsd = top.priceUsd ? Number(top.priceUsd) : null;
  return {
    volume: top.volume?.h24 ?? seed,
    priceUsd: Number.isFinite(priceUsd) ? priceUsd : null,
  };
}

async function quoteToken(token: (typeof MEME_TOKENS)[number]): Promise<MemeQuote> {
  const fallback: MemeQuote = {
    id: token.id,
    name: token.name,
    volume: token.seedVolume,
    priceUsd: null,
    live: false,
  };
  try {
    const byAddr = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${token.address}`,
      { headers: { accept: "application/json" }, signal: AbortSignal.timeout(7000) },
    );
    if (byAddr.ok) {
      const json = (await byAddr.json()) as { pairs?: DexPair[] };
      const hit = bestPair(json.pairs, token.seedVolume);
      if (hit) return { ...fallback, ...hit, live: true };
    }
    const q = token.id === "goat" ? "GOATSEUS" : token.name;
    const search = await fetch(
      `https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`,
      { headers: { accept: "application/json" }, signal: AbortSignal.timeout(7000) },
    );
    if (!search.ok) return fallback;
    const json = (await search.json()) as { pairs?: DexPair[] };
    const hit = bestPair(json.pairs, token.seedVolume);
    if (!hit) return fallback;
    return { ...fallback, ...hit, live: true };
  } catch {
    return fallback;
  }
}

export const fetchMemeTape = createServerFn({ method: "GET" }).handler(
  async (): Promise<MemeQuote[]> => {
    const rows = await Promise.all(MEME_TOKENS.map(quoteToken));
    return rows.sort((a, b) => b.volume - a.volume);
  },
);
