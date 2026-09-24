/**
 * config/business.ts
 * ---------------------------------------------------------------------------
 * EZ AZ EGYETLEN FÁJL, AMIT MÁS ÜGYFÉLHEZ MÓDOSÍTANOD KELL.
 *
 * Minden szöveg, szín, szolgáltatás, ár, nyitvatartás és kép innen töltődik
 * be a komponensekbe. Egyetlen komponens sem tartalmaz hardcode-olt
 * ügyfél-adatot — ha új projekthez akarod használni a sablont:
 *   1. Másold ki ezt a fájlt egy másik ügyfélhez.
 *   2. Cseréld le a lenti mezőket + a /public/images alatti képeket.
 *   3. Állítsd be a .env.local-ban a Supabase kulcsokat.
 * Nincs admin felület, nincs multi-tenant réteg — ez egy statikus,
 * build-időben beégetett konfiguráció.
 * ---------------------------------------------------------------------------
 */

export type ServiceId = string;

export interface Service {
  id: ServiceId;
  name: string;
  shortDescription: string;
  durationMinutes: number;
  priceHUF: number;
  /** Ha true, a Szolgáltatások szekcióban kiemelve jelenik meg. */
  featured?: boolean;
}

export interface GalleryImage {
  src: string;
  alt: string;
  /** Opcionális: rács-elrendezésben mekkora helyet foglaljon (1 = normál, 2 = széles). */
  span?: 1 | 2;
}

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface OpeningHours {
  /** 0 = vasárnap ... 6 = szombat, az ISO hét kezdete hétfő (1) a UI-ban. */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  label: string;
  /** null = zárva aznap */
  open: string | null;
  close: string | null;
}

export interface BusinessConfig {
  meta: {
    name: string;
    tagline: string;
    /** SEO title / <title> tag */
    seoTitle: string;
    seoDescription: string;
    logoText: string;
    /** Elérési út a /public alatt, vagy külső URL */
    logoImage?: string;
    faviconEmoji: string;
    /** IANA időzóna-azonosító (pl. "Europe/Budapest"). Ez alapján számolja
     * ki a rendszer a nyitvatartási órákat és a foglalási időpontokat. */
    timeZone: string;
  };

  theme: {
    /** A theme tokenek a tailwind.config.ts-ben is definiálva vannak;
     * ez a blokk azokra a helyekre kell, ahol inline stílus / meta tag
     * szükséges (pl. theme-color, OG kép háttere). */
    background: string;
    surface: string;
    accent: string;
    accentLight: string;
    textPrimary: string;
    textMuted: string;
  };

  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    image: string;
    imageAlt: string;
    stat: {
      value: string;
      label: string;
    };
  };

  about: {
    heading: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
    highlights: { label: string; value: string }[];
  };

  services: Service[];

  gallery: {
    heading: string;
    subheading: string;
    images: GalleryImage[];
  };

  testimonials: {
    heading: string;
    items: Testimonial[];
  };

  contact: {
    heading: string;
    subheading: string;
    address: string;
    mapEmbedUrl?: string;
    phone: string;
    email: string;
    openingHours: OpeningHours[];
    socials: { label: string; url: string }[];
  };

  booking: {
    heading: string;
    subheading: string;
    /** Hány napra előre lehet foglalni */
    maxAdvanceDays: number;
    /** Foglalás minimum ennyi órával a kezdés előtt */
    minNoticeHours: number;
    /** Időpontok léptéke percben a szabad slotok generálásához */
    slotIntervalMinutes: number;
    confirmationNote: string;
  };

  footer: {
    note: string;
  };
}

export const businessConfig: BusinessConfig = {
  meta: {
    name: "Noir Atelier",
    tagline: "Prémium fodrászat és szakállápoló műhely",
    seoTitle: "Noir Atelier — Prémium fodrászat Budapesten",
    seoDescription:
      "Kézműves hajvágás, szakállformázás és borotválás Budapest szívében. Foglaljon időpontot egyszerűen, online.",
    logoText: "Noir Atelier",
    faviconEmoji: "✂️",
    timeZone: "Europe/Budapest",
  },

  theme: {
    background: "#0B0F0E",
    surface: "#141B1A",
    accent: "#C9A227",
    accentLight: "#E0BE4F",
    textPrimary: "#F3F1EA",
    textMuted: "#8F9C97",
  },

  hero: {
    eyebrow: "Budapest, V. kerület",
    headline: "A részletek adója a valódi minőség.",
    subheadline:
      "Kézműves hajvágás és szakállápolás, ahol minden mozdulat mögött szakértelem áll. Foglaljon időpontot, és tapasztalja meg a prémium színvonalat.",
    primaryCtaLabel: "Időpontfoglalás",
    secondaryCtaLabel: "Szolgáltatásaink",
    image:
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Fodrász műhely belső tere, meleg fényekkel",
    stat: { value: "12 éve", label: "a szakmában" },
  },

  about: {
    heading: "Kézművesség, nem futószalag",
    paragraphs: [
      "A Noir Atelier 2014 óta várja vendégeit egy olyan exkluzív térben, ahol a hajvágás nem csupán tízperces rutin, hanem teljes körű odafigyelés. Minden vendéggel alapos konzultációval indítunk, mielőtt a hajához érkeznénk.",
      "Csapatunk tagjai rendszeresen fejlesztik tudásukat nemzetközi képzéseken, így a modern irányzatok mellett a klasszikus borotválási technikákat is mesteri szinten képviselik.",
    ],
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Fodrász munka közben, portré",
    highlights: [
      { label: "Elégedett vendég", value: "4200+" },
      { label: "Átlagos értékelés", value: "4.9/5" },
      { label: "Aktív szakember", value: "6" },
    ],
  },

  services: [
    {
      id: "haircut-classic",
      name: "Klasszikus hajvágás",
      shortDescription: "Személyre szabott konzultáció, frissítő mosás, precíziós vágás és stílusos befejezés.",
      durationMinutes: 45,
      priceHUF: 9500,
      featured: true,
    },
    {
      id: "beard-trim",
      name: "Szakállformázás",
      shortDescription: "Precíz kontúrozás, formára igazítás és forró törölközős előkészítés.",
      durationMinutes: 30,
      priceHUF: 6500,
    },
    {
      id: "haircut-beard",
      name: "Hajvágás + szakállcsomag",
      shortDescription: "A két legnépszerűbb szolgáltatásunk kombinációja egyetlen prémium alkalom alatt.",
      durationMinutes: 75,
      priceHUF: 14500,
      featured: true,
    },
    {
      id: "shave-classic",
      name: "Hagyományos borotválás",
      shortDescription: "Egyenes pengés technika, gőzös meleg vizes törölköző és tápláló utókezelés.",
      durationMinutes: 40,
      priceHUF: 8500,
    },
    {
      id: "kids-cut",
      name: "Gyerekhajvágás",
      shortDescription: "Türelmes, barátságos hangulatú és gyors hajvágás 12 éves korig.",
      durationMinutes: 30,
      priceHUF: 6000,
    },
  ],

  gallery: {
    heading: "A műhely",
    subheading: "Olyan hangulat, amely már az első pillanatban elárulja, hova érkezett.",
    images: [
      {
        src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=1000&auto=format&fit=crop",
        alt: "Fodrászszék közelről",
        span: 2,
      },
      {
        src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=800&auto=format&fit=crop",
        alt: "Borotválkozó eszközök rendezetten",
      },
      {
        src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop",
        alt: "Stílusos szalonbelsőség meleg fényekkel",
      },
      {
        src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
        alt: "Szakállápolás közelről",
      },
      {
        src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
        alt: "A műhely belső tere",
        span: 2,
      },
    ],
  },

  testimonials: {
    heading: "Vendégeink mondták",
    items: [
      {
        quote:
          "Nem csupán egy hajvágás — valóban figyelnek arra, hogy mit szeretnék, és amit javasolnak, az mindig telitalálat. Négy éve kizárólag ide járok.",
        author: "Kovács Bence",
      },
      {
        quote:
          "A hagyományos borotválás igazi élmény volt, nem pedig egy egyszerű szolgáltatás. Pontosan tudták, mikor kell megállni a részleteknél.",
        author: "Nagy Dávid",
      },
      {
        quote:
          "Az online foglalási rendszer annyira zökkenőmentes, hogy két perc alatt lefoglaltam az időpontot ebédszünetben. A szalon pedig élőben még szebb, mint a képeken.",
        author: "Tóth Márk",
      },
    ],
  },

  contact: {
    heading: "Keressen fel minket",
    subheading: "A belváros szívében vagyunk, két percre a Deák tértől.",
    address: "1052 Budapest, Váci utca 24.",
    phone: "+36 30 123 4567",
    email: "hello@noiratelier.hu",
    openingHours: [
      { day: 1, label: "Hétfő", open: "10:00", close: "19:00" },
      { day: 2, label: "Kedd", open: "10:00", close: "19:00" },
      { day: 3, label: "Szerda", open: "10:00", close: "19:00" },
      { day: 4, label: "Csütörtök", open: "10:00", close: "20:00" },
      { day: 5, label: "Péntek", open: "10:00", close: "20:00" },
      { day: 6, label: "Szombat", open: "09:00", close: "15:00" },
      { day: 0, label: "Vasárnap", open: null, close: null },
    ],
    socials: [
      { label: "Instagram", url: "https://instagram.com" },
      { label: "Facebook", url: "https://facebook.com" },
    ],
  },

  booking: {
    heading: "Foglaljon időpontot",
    subheading: "Válassza ki a szolgáltatást, a dátumot, majd az időpontot — kevesebb mint két perc alatt megvan.",
    maxAdvanceDays: 30,
    minNoticeHours: 2,
    slotIntervalMinutes: 15,
    confirmationNote:
      "A foglalásról szóló visszaigazolást e-mailben küldjük. Lemondást legkésőbb 24 órával korábban tudunk elfogadni telefonon.",
  },

  footer: {
    note: "Noir Atelier — kézműves hajvágás és szakállápolás 2014 óta.",
  },
};