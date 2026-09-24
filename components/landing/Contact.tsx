import { businessConfig } from "@/config/business";

export function Contact() {
  const { contact } = businessConfig;

  return (
    <section id="kapcsolat" className="section py-20 md:py-28">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <h2 className="max-w-sm text-3xl leading-tight text-paper md:text-4xl">{contact.heading}</h2>
          <p className="mt-4 max-w-sm text-paper-muted">{contact.subheading}</p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-paper-muted">Cím</dt>
              <dd className="mt-1 text-paper">{contact.address}</dd>
            </div>
            <div>
              <dt className="text-paper-muted">Telefon</dt>
              <dd className="mt-1">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-paper hover:text-brass-light">
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-paper-muted">E-mail</dt>
              <dd className="mt-1">
                <a href={`mailto:${contact.email}`} className="text-paper hover:text-brass-light">
                  {contact.email}
                </a>
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex gap-4">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-paper-muted underline decoration-ink-line underline-offset-4 hover:text-paper"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm text-paper-muted">Nyitvatartás</h3>
          <ul className="mt-4 divide-y divide-ink-line border-t border-ink-line">
            {contact.openingHours.map((h) => (
              <li key={h.day} className="flex items-center justify-between py-3 text-sm">
                <span className="text-paper">{h.label}</span>
                <span className={h.open ? "text-paper-muted" : "text-paper-muted/60"}>
                  {h.open && h.close ? `${h.open} – ${h.close}` : "zárva"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
