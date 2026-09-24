import { businessConfig } from "@/config/business";
import type { Service } from "@/config/business";
import type { CustomerDetails } from "@/components/booking/DetailsStep";

function formatHUF(amount: number) {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft";
}

export function ConfirmStep({
  service,
  date,
  start,
  details,
  submitting,
  error,
}: {
  service: Service;
  date: string;
  start: string;
  details: CustomerDetails;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div>
      <h2 className="text-2xl text-paper md:text-3xl">Ellenőrizd az adatokat</h2>
      <p className="mt-2 text-paper-muted">A &bdquo;Foglalás véglegesítése&rdquo; gombbal erősítheted meg.</p>

      <dl className="mt-8 max-w-md divide-y divide-ink-line border-y border-ink-line text-sm">
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Szolgáltatás</dt>
          <dd className="text-paper">{service.name}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Dátum</dt>
          <dd className="text-paper">
            {new Date(`${date}T00:00:00Z`).toLocaleDateString("hu-HU", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: businessConfig.meta.timeZone,
            })}
          </dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Időpont</dt>
          <dd className="text-paper">
            {new Date(start).toLocaleTimeString("hu-HU", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: businessConfig.meta.timeZone,
            })}
          </dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Időtartam</dt>
          <dd className="text-paper">{service.durationMinutes} perc</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Ár</dt>
          <dd className="font-display text-base text-brass-light">{formatHUF(service.priceHUF)}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Név</dt>
          <dd className="text-paper">{details.name}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">E-mail</dt>
          <dd className="text-paper">{details.email}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-paper-muted">Telefon</dt>
          <dd className="text-paper">{details.phone}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-md text-sm text-paper-muted">{businessConfig.booking.confirmationNote}</p>

      {error && <p className="mt-4 text-sm text-brass-light">{error}</p>}
      {submitting && <p className="mt-4 text-sm text-paper-muted">Foglalás rögzítése…</p>}
    </div>
  );
}
