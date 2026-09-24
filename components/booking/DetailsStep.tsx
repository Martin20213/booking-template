"use client";

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  note: string;
}

export function DetailsStep({
  details,
  onChange,
}: {
  details: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
}) {
  const field = (key: keyof CustomerDetails) => ({
    value: details[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...details, [key]: e.target.value }),
  });

  return (
    <div>
      <h2 className="text-2xl text-paper md:text-3xl">Add meg az adataidat</h2>
      <p className="mt-2 text-paper-muted">A visszaigazolást e-mailben küldjük.</p>

      <div className="mt-8 max-w-md space-y-5">
        <label className="block">
          <span className="text-sm text-paper-muted">Teljes név</span>
          <input
            {...field("name")}
            type="text"
            required
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-ink-line bg-ink-surface px-4 py-3 text-paper placeholder:text-paper-muted/50 focus:border-brass"
            placeholder="Kovács Anna"
          />
        </label>

        <label className="block">
          <span className="text-sm text-paper-muted">E-mail cím</span>
          <input
            {...field("email")}
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-ink-line bg-ink-surface px-4 py-3 text-paper placeholder:text-paper-muted/50 focus:border-brass"
            placeholder="anna@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm text-paper-muted">Telefonszám</span>
          <input
            {...field("phone")}
            type="tel"
            required
            autoComplete="tel"
            className="mt-2 w-full rounded-md border border-ink-line bg-ink-surface px-4 py-3 text-paper placeholder:text-paper-muted/50 focus:border-brass"
            placeholder="+36 30 123 4567"
          />
        </label>

        <label className="block">
          <span className="text-sm text-paper-muted">Megjegyzés (opcionális)</span>
          <textarea
            {...field("note")}
            rows={3}
            className="mt-2 w-full resize-none rounded-md border border-ink-line bg-ink-surface px-4 py-3 text-paper placeholder:text-paper-muted/50 focus:border-brass"
            placeholder="Van valami, amit tudnunk kell?"
          />
        </label>
      </div>
    </div>
  );
}
