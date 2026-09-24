import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { businessConfig } from "@/config/business";
import { sendBookingConfirmationEmail } from "@/lib/email";
import type { BookingPayload } from "@/lib/types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<BookingPayload>;

  const { serviceId, date, start, end, customerName, customerEmail, customerPhone, note } = body;

  if (!serviceId || !date || !start || !end || !customerName || !customerEmail || !customerPhone) {
    return NextResponse.json({ error: "Hiányzó mezők." }, { status: 400 });
  }

  const service = businessConfig.services.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Ismeretlen szolgáltatás." }, { status: 404 });
  }

  if (!isValidEmail(customerEmail)) {
    return NextResponse.json({ error: "Érvénytelen e-mail cím." }, { status: 400 });
  }

  if (new Date(start) < new Date(Date.now() + businessConfig.booking.minNoticeHours * 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: `A foglalás legalább ${businessConfig.booking.minNoticeHours} órával korábban lehetséges.` },
      { status: 400 }
    );
  }

  // Szerver-oldali ütközés-ellenőrzés — sosem bízunk a kliens által küldött
  // "available: true" flagben, mert azóta más lefoglalhatta ugyanazt a slotot.
  const { data: overlapping, error: overlapError } = await supabaseAdmin
    .from("bookings")
    .select("id")
    .eq("status", "confirmed")
    .lt("start_time", end)
    .gt("end_time", start);

  if (overlapError) {
    return NextResponse.json({ error: "Nem sikerült ellenőrizni a szabad időpontokat." }, { status: 500 });
  }

  if (overlapping && overlapping.length > 0) {
    return NextResponse.json(
      { error: "Ezt az időpontot időközben már lefoglalták. Válassz másikat." },
      { status: 409 }
    );
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("bookings")
    .insert({
      service_id: serviceId,
      service_name: service.name,
      price_huf: service.priceHUF,
      date,
      start_time: start,
      end_time: end,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      note: note ?? null,
      status: "confirmed",
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: "Nem sikerült létrehozni a foglalást." }, { status: 500 });
  }

  // Az email-küldés sosem buktatja el a foglalást: a foglalás a Supabase-ben
  // már rögzítve van, a visszaigazoló levél ettől függetlenül próbál kimenni.
  // Ha nem sikerül, a kliens a "confirmationNote" szöveg alapján így is tudja,
  // hogy telefonon ellenőrizheti a foglalást.
  const emailResult = await sendBookingConfirmationEmail({
    service,
    date,
    start,
    customerName,
    customerEmail,
  });

  return NextResponse.json(
    { booking: inserted, emailSent: emailResult.sent },
    { status: 201 }
  );
}
