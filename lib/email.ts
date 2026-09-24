import { businessConfig } from "@/config/business";
import type { Service } from "@/config/business";

interface ConfirmationEmailParams {
  service: Service;
  date: string;
  start: string;
  customerName: string;
  customerEmail: string;
}

function formatHUF(amount: number) {
  return new Intl.NumberFormat("hu-HU").format(amount) + " Ft";
}

function buildConfirmationHtml(params: ConfirmationEmailParams) {
  const { service, start, customerName } = params;
  const { meta, theme, booking, contact } = businessConfig;

  const formattedDate = new Date(start).toLocaleDateString("hu-HU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: meta.timeZone,
  });
  const formattedTime = new Date(start).toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: meta.timeZone,
  });

  return `
  <div style="background:${theme.background};padding:32px;font-family:Georgia,serif;color:${theme.textPrimary};">
    <div style="max-width:480px;margin:0 auto;">
      <p style="color:${theme.accent};font-size:13px;letter-spacing:0.05em;margin:0 0 24px;">
        ${meta.name}
      </p>
      <h1 style="font-size:26px;margin:0 0 16px;font-weight:500;">Foglalásod megerősítve</h1>
      <p style="color:${theme.textMuted};font-size:15px;line-height:1.6;margin:0 0 28px;">
        Kedves ${customerName}! Az alábbi időpontot rögzítettük.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;color:${theme.textMuted};">Szolgáltatás</td>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;text-align:right;">${service.name}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;color:${theme.textMuted};">Dátum</td>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;text-align:right;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;color:${theme.textMuted};">Időpont</td>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;text-align:right;">${formattedTime}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;color:${theme.textMuted};">Időtartam</td>
          <td style="padding:10px 0;border-bottom:1px solid #2a3331;text-align:right;">${service.durationMinutes} perc</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:${theme.textMuted};">Ár</td>
          <td style="padding:10px 0;text-align:right;color:${theme.accentLight};">${formatHUF(service.priceHUF)}</td>
        </tr>
      </table>

      <p style="color:${theme.textMuted};font-size:13px;line-height:1.6;margin:0 0 4px;">
        ${booking.confirmationNote}
      </p>
      <p style="color:${theme.textMuted};font-size:13px;line-height:1.6;margin:0;">
        ${contact.address} · ${contact.phone}
      </p>
    </div>
  </div>`;
}

/**
 * Visszaigazoló e-mail küldése a Resend API-n keresztül (https://resend.com).
 * Ha nincs beállítva RESEND_API_KEY, a foglalás létrehozása nem bukik el —
 * csak egy figyelmeztetést írunk a szerver logba, hogy fejlesztés közben ne
 * kelljen kötelezően email-fiókot beállítani.
 *
 * Más szolgáltatóra (Postmark, SendGrid stb.) váltáshoz csak ezt a fájlt
 * kell módosítani, a hívó API route-ot nem.
 */
export async function sendBookingConfirmationEmail(params: ConfirmationEmailParams): Promise<{
  sent: boolean;
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.BOOKING_EMAIL_FROM;

  if (!apiKey || !fromAddress) {
    console.warn(
      "[email] RESEND_API_KEY vagy BOOKING_EMAIL_FROM nincs beállítva — a visszaigazoló email kimarad. Lásd .env.local.example."
    );
    return { sent: false, error: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: params.customerEmail,
        subject: `Foglalás visszaigazolva — ${businessConfig.meta.name}`,
        html: buildConfirmationHtml(params),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend hiba:", res.status, body);
      return { sent: false, error: `resend_${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error("[email] Küldési hiba:", err);
    return { sent: false, error: "network_error" };
  }
}
