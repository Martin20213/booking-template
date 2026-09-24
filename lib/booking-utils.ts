import { fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { businessConfig } from "@/config/business";
import type { TimeSlot } from "@/lib/types";

const TIME_ZONE = businessConfig.meta.timeZone;

/**
 * Egy adott naptári nap adott órájából/percéből épít UTC időpontot, a
 * config-ban megadott üzleti időzóna (pl. Europe/Budapest) szerint.
 *
 * FONTOS: szándékosan NEM a `new Date(...).setHours(...)` mintát használjuk,
 * mert az a szerver futtatási környezetének helyi idejét venné alapul
 * (Vercel/Node éles környezetben jellemzően UTC) — emiatt korábban a
 * budapesti "13:45" ténylegesen 2 órás csúszással, "11:45"-ként került
 * mentésre a nyári időszámítás idején.
 */
function zonedWallTime(dateISO: string, hh: number, mm: number): Date {
  const wallTime = `${dateISO}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`;
  return fromZonedTime(wallTime, TIME_ZONE);
}

/** A mai dátum (YYYY-MM-DD) az üzlet időzónájában, nem a szerverében. */
function todayISOInBusinessZone(): string {
  return formatInTimeZone(new Date(), TIME_ZONE, "yyyy-MM-dd");
}

function addDaysToISODate(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * A hét napja (0=vasárnap ... 6=szombat) egy YYYY-MM-DD naptári dátumhoz.
 * Ez tisztán naptári számítás — a "T00:00:00Z" explicit UTC jelölés miatt
 * a szerver időzónájától teljesen független, tehát a nyitvatartás napjait
 * mindig helyesen azonosítja.
 */
function weekdayOf(dateISO: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return new Date(`${dateISO}T00:00:00Z`).getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Egy adott napra és szolgáltatásra generálja a lehetséges időpontokat,
 * a config nyitvatartása, a slot lépésköze és a már meglévő foglalások
 * alapján. Tisztán függvény — nincs I/O, ezért a kliens és a szerver is
 * ugyanazt a logikát futtatja.
 */
export function generateSlotsForDate(params: {
  dateISO: string; // YYYY-MM-DD
  serviceDurationMinutes: number;
  existingBookings: { start: string; end: string }[];
}): TimeSlot[] {
  const { dateISO, serviceDurationMinutes, existingBookings } = params;

  const weekday = weekdayOf(dateISO);
  const hours = businessConfig.contact.openingHours.find((h) => h.day === weekday);

  if (!hours || !hours.open || !hours.close) return [];

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);

  const dayStart = zonedWallTime(dateISO, openH, openM);
  const dayEnd = zonedWallTime(dateISO, closeH, closeM);

  const now = new Date();
  const earliestBookable = new Date(now.getTime() + businessConfig.booking.minNoticeHours * 60 * 60 * 1000);

  const slots: TimeSlot[] = [];
  const step = businessConfig.booking.slotIntervalMinutes * 60 * 1000;
  const duration = serviceDurationMinutes * 60 * 1000;

  for (let t = dayStart.getTime(); t + duration <= dayEnd.getTime(); t += step) {
    const start = new Date(t);
    const end = new Date(t + duration);

    if (start < earliestBookable) continue;

    const overlaps = existingBookings.some((b) => {
      const bStart = new Date(b.start).getTime();
      const bEnd = new Date(b.end).getTime();
      return start.getTime() < bEnd && end.getTime() > bStart;
    });

    slots.push({
      start: start.toISOString(),
      end: end.toISOString(),
      available: !overlaps,
    });
  }

  return slots;
}

export function isDateBookable(dateISO: string): boolean {
  const weekday = weekdayOf(dateISO);
  const hours = businessConfig.contact.openingHours.find((h) => h.day === weekday);
  if (!hours || !hours.open) return false;

  const today = todayISOInBusinessZone();
  const maxDate = addDaysToISODate(today, businessConfig.booking.maxAdvanceDays);

  return dateISO >= today && dateISO <= maxDate;
}
