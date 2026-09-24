import Link from "next/link";
import { businessConfig } from "@/config/business";

export function CTA() {
  return (
    <section className="border-t border-ink-line">
      <div className="section flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-24">
        <h2 className="max-w-lg text-3xl leading-tight text-paper md:text-4xl">
          Foglald le a következő időpontod, mielőtt betelne a naptárunk.
        </h2>
        <Link
          href="/appointment"
          className="shrink-0 rounded-full bg-brass px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-brass-light"
        >
          {businessConfig.hero.primaryCtaLabel}
        </Link>
      </div>
    </section>
  );
}
