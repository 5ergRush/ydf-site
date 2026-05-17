import type { PageIntro, PageSection, Venue } from "@/types/festival";

export const venuesPageIntro: PageIntro = {
  eyebrow: "Roadmap",
  title: "Roadmap",
  description:
    "Follow the bachata week from daytime workshops and connection labs to social dance nights and closing moments across Yerevan.",
};

export const venuesGridSection: PageSection = {
  eyebrow: "Festival flow",
  title: "A bachata roadmap designed for classes, socials, and evening transitions.",
  description:
    "Each stop has a clear role in the YDF experience, with room for maps, access notes, and schedule details as the program is finalized.",
};

export const venuesNotesSection: PageSection = {
  eyebrow: "Planning notes",
  title: "Roadmap details can grow without changing the page structure.",
  description:
    "Map embeds, transit guidance, and access notes can slot into the existing layout when operational details are ready.",
};

export const venueNotes = [
  "Each roadmap card already includes a dedicated placeholder area for a future map or directions block.",
  "Transit, parking, and accessibility details can be added as data once the final logistics are confirmed.",
];

export const venuesPreviewSection: PageSection = {
  eyebrow: "Roadmap preview",
  title: "A clear route through the bachata week.",
  description:
    "Each stop has a distinct role, from daytime workshops to rooftop-style bachata after-hours.",
  ctaLabel: "View roadmap",
  ctaHref: "/venues",
};

export const venues: Venue[] = [
  {
    id: "cascade-hall",
    name: "Cascade Hall",
    area: "City center",
    address: "10 Cascade Avenue, Yerevan",
    description:
      "The main daytime venue for bachata workshops and early-evening gatherings, with a bright studio layout and easy access from the city core.",
    spaces: ["Workshop rooms", "Registration desk", "Coffee corner"],
    mapLabel: "Map placeholder for Cascade Hall",
  },
  {
    id: "riverside-loft",
    name: "Riverside Loft",
    area: "Hrazdan river district",
    address: "24 Riverside Street, Yerevan",
    description:
      "An industrial-feeling social venue designed for long bachata sets, open floors, and a stronger nighttime sound profile.",
    spaces: ["Main social floor", "Lounge zone", "Bar area"],
    mapLabel: "Map placeholder for Riverside Loft",
  },
  {
    id: "opera-terrace",
    name: "Opera Terrace",
    area: "Opera quarter",
    address: "1 Freedom Square, Yerevan",
    description:
      "A rooftop-style setting reserved for golden-hour gatherings, bachata moments, and a relaxed transition into evening programming.",
    spaces: ["Sunset terrace", "Photo backdrop", "Warm-up corner"],
    mapLabel: "Map placeholder for Opera Terrace",
  },
];
