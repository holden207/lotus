"use client";

import { subMinutes } from "date-fns";
import { useEffect, useState } from "react";
import { formatRelativeTimeFromDate } from "@/lib/time";

export function ActivityRelativeTime({ minutesAgo }: { minutesAgo: number }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLabel(formatRelativeTimeFromDate(subMinutes(now, minutesAgo), now));
    };

    update();
    const intervalId = window.setInterval(update, 60_000);
    return () => window.clearInterval(intervalId);
  }, [minutesAgo]);

  if (!label) {
    return <span className="shrink-0 text-xs text-muted-foreground" aria-hidden="true" />;
  }

  return <span className="shrink-0 text-xs text-muted-foreground">{label}</span>;
}
