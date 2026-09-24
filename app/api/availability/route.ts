import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateSlotsForDate, isDateBookable } from "@/lib/booking-utils";
import { businessConfig } from "@/config/business";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!serviceId || !date) {
    return NextResponse.json({ error: "serviceId és date paraméter kötelező." }, { status: 400 });
  }

  const service = businessConfig.services.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Ismeretlen szolgáltatás." }, { status: 404 });
  }

  if (!isDateBookable(date)) {
    return NextResponse.json({ slots: [] });
  }

  const dayStart = `${date}T00:00:00.000Z`;
  const dayEnd = `${date}T23:59:59.999Z`;

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("start_time, end_time")
    .eq("status", "confirmed")
    .gte("start_time", dayStart)
    .lte("start_time", dayEnd);

  if (error) {
    return NextResponse.json({ error: "Nem sikerült lekérni a foglaltságot." }, { status: 500 });
  }

  const existingBookings = (data ?? []).map((b) => ({ start: b.start_time, end: b.end_time }));

  const slots = generateSlotsForDate({
    dateISO: date,
    serviceDurationMinutes: service.durationMinutes,
    existingBookings,
  });

  return NextResponse.json({ slots });
}
