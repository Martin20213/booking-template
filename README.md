# Prémium szolgáltatói weboldal sablon

Next.js (App Router) + TypeScript + Tailwind CSS + Supabase alapú, config-vezérelt
landing page + online időpontfoglalás. Jelen állapotban egy fiktív prémium
fodrászat ("Noir Atelier") adataival van feltöltve — ezt cseréld le a saját
ügyfeled adataira.

## Gyors indítás

```bash
npm install
cp .env.local.example .env.local   # töltsd ki a Supabase és Resend kulcsokkal
```

Supabase oldalon futtasd le a `supabase/schema.sql` fájlt (Dashboard > SQL Editor),
ez létrehozza a `bookings` táblát.

A visszaigazoló email küldéséhez hozz létre egy ingyenes [Resend](https://resend.com)
fiókot, generálj egy API kulcsot, és állítsd be a `.env.local`-ban. Amíg nincs
hitelesített domained a Resend-ben, a `BOOKING_EMAIL_FROM` értékéhez tesztelésre
használhatod a `onboarding@resend.dev` küldő címet — élesben viszont a saját
domainedet hitelesítened kell (Resend Dashboard > Domains), különben a levelek
spam-be kerülhetnek vagy elutasításra kerülnek.

Ha `RESEND_API_KEY` vagy `BOOKING_EMAIL_FROM` nincs beállítva, a foglalás
attól még sikeresen létrejön — csak a visszaigazoló email marad ki, és a
szerver konzolján egy figyelmeztetést látsz. Ez szándékos: fejlesztés közben
nem kötelező azonnal email-fiókot beállítani.

```bash
npm run dev
```

## Új ügyfélhez való újrahasznosítás

**Nincs admin felület és nincs multi-tenant réteg** — ez szándékos, hogy a sablon
egyszerű és átlátható maradjon. Új ügyfélhez ennyi a teendő:

1. **`config/business.ts`** — az EGYETLEN fájl, amit módosítanod kell. Minden
   szöveg, ár, nyitvatartás, szolgáltatás, elérhetőség és kép innen töltődik be.
   Egyetlen komponens sem tartalmaz hardcode-olt adatot.
2. **Képek** — a configban jelenleg Unsplash linkek vannak placeholder gyanánt.
   Cseréld le saját képekre (akár `/public/images` alá téve, akár külső URL-lel
   — a `next.config.js` `images.remotePatterns` listáját bővítsd, ha új domaint
   használsz).
3. **Színek** — a `config/business.ts` `theme` blokkja tájékoztató jellegű
   (meta tag-ekhez); a tényleges Tailwind színtokenek a `tailwind.config.ts`
   `colors` blokkjában vannak (`ink`, `paper`, `brass`). Ha a márka színvilága
   eltér, itt módosítsd.
4. **Supabase** — hozz létre egy új Supabase projektet az ügyfélnek, futtasd le
   a `supabase/schema.sql`-t, és állítsd be az új kulcsokat a `.env.local`-ban.
   A `bookings` tábla sémája ügyfél-független, nem kell módosítani.
   Megjegyzés: a tábla minden foglaláskor elmenti a szolgáltatás akkori árát
   (`price_huf`) is — ha később a configban módosítod az árat, a régi
   foglalások a korabeli, valós árukat őrzik meg.
5. **Email küldő cím** — a `BOOKING_EMAIL_FROM` értékét és a Resend-ben
   hitelesített domaint is cseréld az új ügyfél saját domainjére.

## Architektúra

```
config/business.ts       ← Az egyetlen ügyfél-specifikus fájl
app/page.tsx              ← Landing page (a szekciók összeállítása)
app/foglalas/page.tsx     ← Foglalási oldal
components/landing/*      ← Hero, Bemutatkozás, Szolgáltatások, Galéria,
                             Vélemények, Kapcsolat, CTA, Header, Footer
components/booking/*      ← BookingWizard és az 5 lépés (szolgáltatás → dátum
                             → időpont → adatok → megerősítés)
lib/booking-utils.ts      ← Szabad időpontok generálása (nyitvatartás +
                             szolgáltatás időtartama + meglévő foglalások
                             alapján) — tiszta függvény, client és server is
                             ugyanazt futtatja
lib/supabase/client.ts    ← Böngésző-oldali Supabase kliens (anon kulcs)
lib/supabase/server.ts    ← Szerver-oldali kliens (service role, csak API
                             route-okban használva)
app/api/availability      ← GET: szabad időpontok egy adott napra
app/api/bookings          ← POST: foglalás létrehozása, szerver-oldali
                             ütközés-ellenőrzéssel + visszaigazoló email
lib/email.ts               ← Visszaigazoló email a Resend API-n keresztül —
                             a foglalás sosem bukik el, ha az email küldése
                             sikertelen
supabase/schema.sql       ← A bookings tábla SQL sémája + RLS megjegyzések
```

## Foglalási logika

- A szabad időpontokat a `config/business.ts` `contact.openingHours` (napi
  nyitvatartás), `booking.slotIntervalMinutes` (léptékköz) és az adott
  szolgáltatás `durationMinutes` értéke alapján generáljuk.
- A `booking.minNoticeHours` határozza meg, mennyi idővel korábban kell
  foglalni (pl. ne lehessen 5 perc múlvára foglalni).
- **Az ütközés-ellenőrzés mindig a szerveren történik** (`app/api/bookings`),
  még ha a kliens "szabadnak" is mutatott egy slotot — így ha időközben más
  lefoglalta ugyanazt az időpontot, a rendszer 409-es hibával jelzi, és a
  felhasználó másikat választhat.

## Fontos, amit még érdemes hozzáadni éles használat előtt

Ez a sablon a *funkcionális vázat* adja — az alábbiakat érdemes hozzátenni
egy valódi ügyfél-projektben:

- **Lemondás/módosítás** felhasználói felület (jelenleg csak telefonon jelezhető,
  a `booking.confirmationNote` szövege ezt írja le).
- Valódi galéria- és portré-fotók a placeholder Unsplash képek helyett.
