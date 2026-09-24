import Link from "next/link";
import { businessConfig } from "@/config/business";

function formatHUF(amount: number) {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft";
}

export function Services() {
  const { services } = businessConfig;

  return (
    <section id="szolgaltatasok" className="border-y border-ink-line bg-ink-surface/40 py-20 md:py-28">
      <div className="section">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-sm text-3xl leading-tight text-paper md:text-4xl">Szolgáltatásaink</h2>
          <p className="max-w-sm text-paper-muted">
            Az árak és időtartamok tájékoztató jellegűek, a végleges egyeztetés a foglaláskor történik.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-ink-line border-t border-ink-line">
          {services.map((service) => (
            <li key={service.id} className="group">
              <Link
                href={`/foglalas?service=${service.id}`}
                className="flex flex-col gap-2 py-6 transition-colors md:flex-row md:items-center md:justify-between md:gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-xl text-paper transition-colors group-hover:text-brass-light md:text-2xl">
                      {service.name}
                    </h3>
                    {service.featured && (
                      <span className="text-xs text-brass/80">népszerű</span>
                    )}
                  </div>
                  <p className="mt-1 max-w-md text-sm text-paper-muted">{service.shortDescription}</p>
                </div>

                <div className="flex items-center gap-8 text-sm text-paper-muted md:text-right">
                  <span>{service.durationMinutes} perc</span>
                  <span className="font-display text-lg text-paper">{formatHUF(service.priceHUF)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
