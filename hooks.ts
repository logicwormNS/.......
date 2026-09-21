import { useEffect, useState } from "react";
import { clamp } from "@/lib/format";

export function useNow(ms = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}

export function useLiveYes(base: number, seed: number) {
  const [yes, setYes] = useState(base);
  useEffect(() => {
    const tick = () => {
      const t = Date.now() / 1000;
      const wave =
        Math.sin(t / 13 + seed) * 0.42 +
        Math.sin(t / 4.6 + seed * 1.7) * 0.16;
      setYes(clamp(base + wave, 1, 99));
    };
    tick();
    const id = window.setInterval(tick, 2400);
    return () => window.clearInterval(id);
  }, [base, seed]);
  return yes;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
