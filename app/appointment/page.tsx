import Link from "next/link";
import { businessConfig } from "@/config/business";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default function BookingPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-line">
        <div className="section flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="font-display text-lg tracking-tight text-paper">
            {businessConfig.meta.logoText}
          </Link>
          <Link href="/" className="text-sm text-paper-muted transition-colors hover:text-paper">
            Vissza a főoldalra
          </Link>
        </div>
      </header>

      <main className="section py-16 md:py-20">
        <p className="eyebrow">{businessConfig.booking.heading}</p>
        <p className="mt-3 max-w-lg text-paper-muted">{businessConfig.booking.subheading}</p>

        <div className="mt-14 max-w-2xl">
          <BookingWizard initialServiceId={searchParams.service} />
        </div>
      </main>
    </div>
  );
}
