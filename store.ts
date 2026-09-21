import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SEEDED_EVIDENCE, type Evidence } from "@/lib/data";

export type Side = "yes" | "no";

export type Position = {
  marketId: string;
  side: Side;
  size: number;
  at: number;
  yesAtChip: number;
};

type BookState = {
  positions: Record<string, Position>;
  evidence: Evidence[];
  chipPosition: (marketId: string, side: Side, yesAtChip: number) => void;
  clearPosition: (marketId: string) => void;
  addEvidence: (entry: Omit<Evidence, "id" | "locked">) => void;
};

const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export const useBook = create<BookState>()(
  persist(
    (set, get) => ({
      positions: {},
      evidence: SEEDED_EVIDENCE,
      chipPosition: (marketId, side, yesAtChip) => {
        const current = get().positions[marketId];
        if (current && current.side === side) {
          const next = { ...get().positions };
          delete next[marketId];
          set({ positions: next });
          return;
        }
        set({
          positions: {
            ...get().positions,
            [marketId]: {
              marketId,
              side,
              size: 100,
              at: Date.now(),
              yesAtChip,
            },
          },
        });
      },
      clearPosition: (marketId) => {
        const next = { ...get().positions };
        delete next[marketId];
        set({ positions: next });
      },
      addEvidence: (entry) => {
        const id = `ev-${Date.now()}`;
        set({
          evidence: [{ ...entry, id, locked: false }, ...get().evidence],
        });
      },
    }),
    {
      name: "skitchmarkets-book",
      version: 2,
      partialize: (s) => ({ positions: s.positions, evidence: s.evidence }),
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : localStorage,
      ),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<
          Pick<BookState, "positions" | "evidence">
        >;
        const saved = p.evidence ?? [];
        const byId = new Map<string, Evidence>();
        for (const row of SEEDED_EVIDENCE) byId.set(row.id, row);
        for (const row of saved) byId.set(row.id, row);
        return {
          ...current,
          positions: p.positions ?? current.positions,
          evidence: Array.from(byId.values()).sort((a, b) =>
            a.at < b.at ? 1 : -1,
          ),
        };
      },
    },
  ),
);
