"use client";

import { useState } from "react";
import { businessConfig } from "@/config/business";
import type { Service } from "@/config/business";
import type { TimeSlot } from "@/lib/types";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { ServiceStep } from "@/components/booking/ServiceStep";
import { DateStep } from "@/components/booking/DateStep";
import { TimeStep } from "@/components/booking/TimeStep";
import { DetailsStep, type CustomerDetails } from "@/components/booking/DetailsStep";
import { ConfirmStep } from "@/components/booking/ConfirmStep";
import { SuccessScreen } from "@/components/booking/SuccessScreen";

const emptyDetails: CustomerDetails = { name: "", email: "", phone: "", note: "" };

export function BookingWizard({ initialServiceId }: { initialServiceId?: string }) {
  const initialService = businessConfig.services.find((s) => s.id === initialServiceId) ?? null;

  const [step, setStep] = useState(initialService ? 2 : 1);
  const [service, setService] = useState<Service | null>(initialService);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [details, setDetails] = useState<CustomerDetails>(emptyDetails);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    service: Service;
    start: string;
    emailSent: boolean;
  } | null>(null);

  const canGoNext =
    (step === 1 && service !== null) ||
    (step === 2 && date !== null) ||
    (step === 3 && slot !== null) ||
    (step === 4 && details.name.trim() && details.email.trim() && details.phone.trim());

  async function handleConfirm() {
    if (!service || !date || !slot) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date,
          start: slot.start,
          end: slot.end,
          customerName: details.name,
          customerEmail: details.email,
          customerPhone: details.phone,
          note: details.note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Ismeretlen hiba történt.");
        setSubmitting(false);
        return;
      }

      setConfirmedBooking({ service, start: slot.start, emailSent: Boolean(data.emailSent) });
    } catch {
      setSubmitError("Nem sikerült elküldeni a foglalást. Ellenőrizd a kapcsolatot és próbáld újra.");
      setSubmitting(false);
    }
  }

  if (confirmedBooking) {
    return (
      <SuccessScreen
        service={confirmedBooking.service}
        start={confirmedBooking.start}
        emailSent={confirmedBooking.emailSent}
      />
    );
  }

  return (
    <div>
      <StepIndicator current={step} />

      <div className="mt-12">
        {step === 1 && (
          <ServiceStep
            selectedId={service?.id ?? null}
            onSelect={(s) => {
              setService(s);
              setDate(null);
              setSlot(null);
            }}
          />
        )}

        {step === 2 && (
          <DateStep
            selectedDate={date}
            onSelect={(d) => {
              setDate(d);
              setSlot(null);
            }}
          />
        )}

        {step === 3 && service && date && (
          <TimeStep serviceId={service.id} date={date} selectedStart={slot?.start ?? null} onSelect={setSlot} />
        )}

        {step === 4 && <DetailsStep details={details} onChange={setDetails} />}

        {step === 5 && service && date && slot && (
          <ConfirmStep
            service={service}
            date={date}
            start={slot.start}
            details={details}
            submitting={submitting}
            error={submitError}
          />
        )}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-ink-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1 || submitting}
          className="text-sm text-paper-muted transition-colors hover:text-paper disabled:opacity-0"
        >
          ← Vissza
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(5, s + 1))}
            disabled={!canGoNext}
            className="rounded-full bg-brass px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-30"
          >
            Tovább
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="rounded-full bg-brass px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            Foglalás véglegesítése
          </button>
        )}
      </div>
    </div>
  );
}
