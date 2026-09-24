"use client";

import { useState, useEffect } from "react";
import { businessConfig } from "@/config/business";

export function Testimonials() {
  const { testimonials } = businessConfig;
  const [active, setActive] = useState(0);
  const [fade, setFade] = useState(true);

  // Automatikus lapozás 5 másodpercenként
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Elhalványítás
      setTimeout(() => {
        setActive((prev) => (prev + 1) % testimonials.items.length);
        setFade(true); // Megjelenítés
      }, 300); // 300ms a váltási idő
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.items.length]);

  const handleDotClick = (i: number) => {
    if (i === active) return;
    setFade(false);
    setTimeout(() => {
      setActive(i);
      setFade(true);
    }, 300);
  };

  const current = testimonials.items[active];

  return (
    <section id="velemenyek" className="border-y border-ink-line bg-ink-surface/40 py-20 md:py-28">
      <div className="section max-w-3xl text-center">
        <h2 className="text-3xl leading-tight text-paper md:text-4xl">{testimonials.heading}</h2>

        <blockquote className="mt-10 min-h-[9rem]">
          <div
            className={`transition-opacity duration-300 ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <p className="font-display text-2xl italic leading-relaxed text-paper md:text-3xl">
              &bdquo;{current.quote}&rdquo;
            </p>
            <footer className="mt-6 text-sm text-paper-muted">
              {current.author}
              {current.role ? `, ${current.role}` : ""}
            </footer>
          </div>
        </blockquote>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.items.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              aria-label={`${i + 1}. vélemény`}
              aria-current={active === i}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? "w-6 bg-brass" : "w-1.5 bg-ink-line"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}