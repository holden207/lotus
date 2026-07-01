import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

export function useSystemTime(intervalMs = 60_000): Date | null {
  const hydrated = useHydrated();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!hydrated) return;

    const update = () => setNow(new Date());
    update();

    const intervalId = window.setInterval(update, intervalMs);
    return () => window.clearInterval(intervalId);
  }, [hydrated, intervalMs]);

  return now;
}
