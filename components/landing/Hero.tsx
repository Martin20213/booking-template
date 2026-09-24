import Image from "next/image";
import Link from "next/link";
import { businessConfig } from "@/config/business";

export function Hero() {
  const { hero } = businessConfig;

  return (
    <section id="top" className="relative overflow-hidden pt-32 md:pt-40">
      <div className="section grid items-end gap-12 pb-20 md:grid-cols-[1.1fr_0.9fr] md:pb-28">
        <div>
          <p
            className="eyebrow opacity-0 [animation-delay:0.1s]"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {hero.eyebrow}
          </p>

          <h1
            className="mt-6 max-w-xl text-[2.75rem] leading-[1.05] text-paper opacity-0 [animation-delay:0.22s] md:text-6xl"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {hero.headline}
          </h1>

          <p
            className="mt-6 max-w-md text-base leading-relaxed text-paper-muted opacity-0 [animation-delay:0.36s] md:text-lg"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            {hero.subheadline}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 opacity-0 [animation-delay:0.5s]"
            style={{ animation: "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) forwards" }}
          >
            <Link
              href="/foglalas"
              className="rounded-full bg-brass px-7 py-3 text-sm font-medium text-ink transition-colors hover:bg-brass-light"
            >
              {hero.primaryCtaLabel}
            </Link>
            <a
              href="#szolgaltatasok"
              className="rounded-full border border-ink-line px-7 py-3 text-sm text-paper transition-colors hover:border-paper-muted"
            >
              {hero.secondaryCtaLabel}
            </a>
          </div>
        </div>

        <div
          className="relative opacity-0 [animation-delay:0.3s]"
          style={{ animation: "fade-in 1.3s ease forwards" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-ink-line">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden rounded-md border border-ink-line bg-ink-surface px-6 py-5 shadow-xl shadow-black/40 md:block">
            <p className="font-display text-3xl text-brass-light">{hero.stat.value}</p>
            <p className="mt-1 text-sm text-paper-muted">{hero.stat.label}</p>
          </div>
        </div>
      </div>

      <div
        className="h-px w-full origin-left bg-ink-line opacity-0 [animation-delay:0.7s]"
        style={{ animation: "reveal-line 1.1s cubic-bezier(0.16,1,0.3,1) forwards, fade-in 0.1s forwards" }}
      />
    </section>
  );
}
