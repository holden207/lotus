import { useEffect, useState } from "react";
import { formatRelativeTime } from "@/lib/time";

type RelativeTimeProps = {
  date: string;
  className?: string;
};

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setLabel(formatRelativeTime(date, new Date()));
    };

    update();
    const intervalId = window.setInterval(update, 60_000);
    return () => window.clearInterval(intervalId);
  }, [date]);

  if (!label) {
    return <span className={className} aria-hidden="true" />;
  }

  return <span className={className}>{label}</span>;
}
