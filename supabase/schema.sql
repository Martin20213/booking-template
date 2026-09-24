-- ---------------------------------------------------------------------------
-- Noir Atelier — foglalási tábla
-- Futtasd le a Supabase projekt SQL Editorában (Database > SQL Editor).
--
-- Ha korábban MÁR lefuttattad ezt a sémát `price_huf` oszlop nélkül, ne a
-- teljes fájlt futtasd újra — helyette csak ezt az egy sort:
--   alter table public.bookings add column if not exists price_huf integer not null default 0;
-- ---------------------------------------------------------------------------

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_name text not null,
  -- A foglalás pillanatában érvényes ár, forintban. Direkt nem a configból
  -- olvassuk ki utólag riportoláskor — ha az ár időközben változik, a régi
  -- foglalásoknak így is megmarad a korabeli, valós ára.
  price_huf integer not null,
  date date not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  note text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists bookings_date_idx on public.bookings (date);
create index if not exists bookings_start_time_idx on public.bookings (start_time);

alter table public.bookings enable row level security;

-- Az API route-ok a service role kulccsal írnak/olvasnak, ami megkerüli az
-- RLS-t, ezért publikus (anon) írási policy-ra NINCS szükség — ez direkt
-- biztonsági döntés: a foglalás mindig a szerveren keresztül validálva
-- történik (ütközés-ellenőrzés, minimum előzetes értesítési idő stb.).
--
-- Ha mégis szeretnél közvetlen kliens-oldali írást engedélyezni (nem
-- ajánlott), a lenti policy-t veheted fel mintaként:
--
-- create policy "Anonim foglalás létrehozása"
--   on public.bookings for insert
--   to anon
--   with check (true);

-- Publikus olvasás NEM javasolt, mert személyes adatot (név, email, telefon)
-- tartalmaz a tábla. Az elérhetőség lekérdezése (app/api/availability) is a
-- service role kulccsal, szerver oldalon történik.
