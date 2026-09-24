import Image from "next/image";
import { businessConfig } from "@/config/business";

export function Gallery() {
  const { gallery } = businessConfig;

  return (
    <section id="galeria" className="section py-20 md:py-28">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="max-w-sm text-3xl leading-tight text-paper md:text-4xl">{gallery.heading}</h2>
        <p className="max-w-sm text-paper-muted">{gallery.subheading}</p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {gallery.images.map((img, i) => (
          <div
            key={i}
            className={`relative aspect-square overflow-hidden rounded-md border border-ink-line ${
              img.span === 2 ? "col-span-2" : ""
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
