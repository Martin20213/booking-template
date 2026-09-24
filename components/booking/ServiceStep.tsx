import { businessConfig } from "@/config/business";
import type { Service } from "@/config/business";

function formatHUF(amount: number) {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft";
}

export function ServiceStep({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (service: Service) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-paper md:text-3xl">Válaszd ki a szolgáltatást</h2>
      <p className="mt-2 text-paper-muted">Az időtartam és az ár tájékoztató jellegű.</p>

      <ul className="mt-8 divide-y divide-ink-line border-y border-ink-line">
        {businessConfig.services.map((service) => {
          const isSelected = service.id === selectedId;
          return (
            <li key={service.id}>
              <button
                type="button"
                onClick={() => onSelect(service)}
                aria-pressed={isSelected}
                className={`flex w-full flex-col gap-2 py-5 text-left transition-colors md:flex-row md:items-center md:justify-between ${
                  isSelected ? "text-brass-light" : "text-paper hover:text-brass-light/80"
                }`}
              >
                <div>
                  <p className="text-lg">{service.name}</p>
                  <p className="mt-1 text-sm text-paper-muted">{service.shortDescription}</p>
                </div>
                <div className="flex items-center gap-6 text-sm text-paper-muted">
                  <span>{service.durationMinutes} perc</span>
                  <span className="font-display text-base text-paper">{formatHUF(service.priceHUF)}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
