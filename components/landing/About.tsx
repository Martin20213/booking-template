import Image from "next/image";
import { businessConfig } from "@/config/business";

export function About() {
  const { about } = businessConfig;

  return (
    <section id="bemutatkozas" className="section grid gap-14 py-20 md:grid-cols-2 md:py-28">
      <div className="relative aspect-[5/6] overflow-hidden rounded-md border border-ink-line md:order-2">
        <Image
          src={about.image}
          alt={about.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          className="object-cover"
        />
      </div>

      <div className="md:order-1">
        <h2 className="max-w-sm text-3xl leading-tight text-paper md:text-4xl">{about.heading}</h2>

        <div className="mt-8 space-y-5">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="max-w-prose text-paper-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-line pt-8">
          {about.highlights.map((h) => (
            <div key={h.label}>
              <dt className="font-display text-2xl text-brass-light md:text-3xl">{h.value}</dt>
              <dd className="mt-1 text-sm text-paper-muted">{h.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
