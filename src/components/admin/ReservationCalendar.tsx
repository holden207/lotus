"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";

export function ReservationCalendar() {
  const hydrated = useHydrated();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (hydrated) {
      setSelectedDate(new Date());
    }
  }, [hydrated]);

  if (!hydrated || !selectedDate) {
    return <Skeleton className="mx-auto h-[280px] w-full max-w-sm rounded-md" aria-hidden />;
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setSelectedDate(new Date())}
        >
          Hoje
        </Button>
      </div>
      <Calendar
        mode="single"
        month={selectedDate}
        onMonthChange={setSelectedDate}
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="mx-auto w-full rounded-md border p-3"
      />
    </>
  );
}
