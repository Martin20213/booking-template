"use client";

import { useMemo, useState } from "react";
import { businessConfig } from "@/config/business";
import { isDateBookable } from "@/lib/booking-utils";

const WEEKDAY_LABELS = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];
const MONTH_LABELS = [
  "Január", "Február", "Március", "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember", "Október", "November", "December",
];

function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function DateStep({
  selectedDate,
  onSelect,
}: {
  selectedDate: string | null;
  onSelect: (dateISO: string) => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + businessConfig.booking.maxAdvanceDays);
    return d;
  }, [today]);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    // hétfő=0 alapú offset (JS getDay(): vasárnap=0)
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

    const result: (Date | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
    }
    return result;
  }, [viewMonth]);

  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() && viewMonth.getMonth() > today.getMonth());
  const canGoNext =
    viewMonth.getFullYear() < maxDate.getFullYear() ||
    (viewMonth.getFullYear() === maxDate.getFullYear() && viewMonth.getMonth() < maxDate.getMonth());

  return (
    <div>
      <h2 className="text-2xl text-paper md:text-3xl">Válassz dátumot</h2>
      <p className="mt-2 text-paper-muted">
        Legfeljebb {businessConfig.booking.maxAdvanceDays} nappal előre foglalhatsz.
      </p>

      <div className="mt-8 max-w-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
            disabled={!canGoPrev}
            className="rounded-full border border-ink-line px-3 py-1 text-sm text-paper-muted transition-colors hover:text-paper disabled:opacity-30"
            aria-label="Előző hónap"
          >
            ←
          </button>
          <p className="text-paper">
            {MONTH_LABELS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
          </p>
          <button
            type="button"
            onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
            disabled={!canGoNext}
            className="rounded-full border border-ink-line px-3 py-1 text-sm text-paper-muted transition-colors hover:text-paper disabled:opacity-30"
            aria-label="Következő hónap"
          >
            →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-paper-muted">
          {WEEKDAY_LABELS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <span key={i} />;
            const iso = toISODate(date);
            const bookable = isDateBookable(iso);
            const isSelected = selectedDate === iso;

            return (
              <button
                key={iso}
                type="button"
                disabled={!bookable}
                onClick={() => onSelect(iso)}
                aria-pressed={isSelected}
                className={`aspect-square rounded-md text-sm transition-colors ${
                  isSelected
                    ? "bg-brass text-ink"
                    : bookable
                    ? "text-paper hover:bg-ink-surface"
                    : "text-paper-muted/30"
                }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
