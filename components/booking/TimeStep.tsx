"use client";

import { useEffect, useState } from "react";
import { businessConfig } from "@/config/business";
import type { TimeSlot } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: businessConfig.meta.timeZone,
  });
}

export function TimeStep({
  serviceId,
  date,
  selectedStart,
  onSelect,
}: {
  serviceId: string;
  date: string;
  selectedStart: string | null;
  onSelect: (slot: TimeSlot) => void;
}) {
  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSlots(null);
    setError(null);

    fetch(`/api/availability?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setSlots(data.slots);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Nem sikerült betölteni a szabad időpontokat.");
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, date]);

  return (
    <div>
      <h2 className="text-2xl text-paper md:text-3xl">Válassz időpontot</h2>
      <p className="mt-2 text-paper-muted">
        {new Date(`${date}T00:00:00Z`).toLocaleDateString("hu-HU", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: businessConfig.meta.timeZone,
        })}
      </p>

      {error && <p className="mt-8 text-sm text-brass-light">{error}</p>}

      {!error && slots === null && (
        <p className="mt-8 text-sm text-paper-muted">Szabad időpontok betöltése…</p>
      )}

      {!error && slots !== null && slots.length === 0 && (
        <p className="mt-8 text-sm text-paper-muted">
          Erre a napra nincs szabad időpont. Válassz másik dátumot.
        </p>
      )}

      {!error && slots !== null && slots.length > 0 && (
        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {slots.map((slot) => {
            const isSelected = selectedStart === slot.start;
            return (
              <button
                key={slot.start}
                type="button"
                disabled={!slot.available}
                onClick={() => onSelect(slot)}
                aria-pressed={isSelected}
                className={`rounded-md border py-2.5 text-sm transition-colors ${
                  isSelected
                    ? "border-brass bg-brass text-ink"
                    : slot.available
                    ? "border-ink-line text-paper hover:border-brass/60 hover:text-brass-light"
                    : "border-ink-line/40 text-paper-muted/30 line-through"
                }`}
              >
                {formatTime(slot.start)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
