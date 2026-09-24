import Link from "next/link";
import { businessConfig } from "@/config/business";
import type { Service } from "@/config/business";

export function SuccessScreen({
  service,
  start,
  emailSent,
}: {
  service: Service;
  start: string;
  emailSent: boolean;
}) {
  return (
    <div className="max-w-md">
      <p className="eyebrow">Foglalás megerősítve</p>
      <h2 className="mt-4 text-3xl text-paper md:text-4xl">Várunk!</h2>
      <p className="mt-4 text-paper-muted">
        {service.name} —{" "}
        {new Date(start).toLocaleString("hu-HU", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: businessConfig.meta.timeZone,
        })}
      </p>

      {emailSent ? (
        <p className="mt-2 text-sm text-paper-muted">
          A visszaigazolást e-mailben is elküldtük. Ha módosítanod kell, keress minket telefonon.
        </p>
      ) : (
        <p className="mt-2 text-sm text-brass-light">
          A foglalásod rögzítettük, de a visszaigazoló e-mail küldése most nem sikerült — mentsd el ezt az
          oldalt, vagy ha bizonytalan vagy, keress minket telefonon.
        </p>
      )}

      <Link
        href="/"
        className="mt-10 inline-block rounded-full border border-ink-line px-7 py-3 text-sm text-paper transition-colors hover:border-paper-muted"
      >
        Vissza a főoldalra
      </Link>
    </div>
  );
}
