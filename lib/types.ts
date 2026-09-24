export interface TimeSlot {
  /** ISO 8601 dátum-idő, a foglalás kezdete */
  start: string;
  /** ISO 8601 dátum-idő, a foglalás vége */
  end: string;
  available: boolean;
}

export interface BookingPayload {
  serviceId: string;
  date: string; // YYYY-MM-DD
  start: string; // ISO 8601
  end: string; // ISO 8601
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  note?: string;
}

export interface BookingRecord extends BookingPayload {
  id: string;
  createdAt: string;
  status: "confirmed" | "cancelled";
}
