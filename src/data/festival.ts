import type { FestivalInfo } from "@/types/festival";

export const festivalInfo: FestivalInfo = {
  name: "Yerevan Dance Festival",
  shortName: "YDF",
  tagline:
    "A bachata-focused summer festival of workshops, socials, and late-night magic in Yerevan.",
  dates: "July 9-13, 2026",
  location: "Yerevan, Armenia",
  siteUrl: "https://ydf-festival.example",
  contactEmail: "hello@ydf-festival.example",
  navigation: [
    { label: "Home", href: "/" },
    { label: "Lineup", href: "/lineup" },
    { label: "Roadmap", href: "/venues" },
    { label: "Pricing", href: "/pricing" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com/ydf.festival" },
    { label: "Facebook", href: "https://facebook.com/ydf.festival" },
    { label: "YouTube", href: "https://youtube.com/@ydf-festival" },
  ],
  hero: {
    eyebrow: "July 9-13, 2026 / Yerevan, Armenia",
    title: "Yerevan Dance Festival",
    description:
      "Five warm nights of bachata, musicality, partner connection, and social dance magic with artists and dancers gathered in the heart of Armenia.",
    primaryCta: {
      label: "See pricing",
      href: "/pricing",
    },
    secondaryCta: {
      label: "Browse lineup",
      href: "/lineup",
    },
  },
  about: {
    eyebrow: "Festival overview",
    title: "Built for bachata dancers who want depth in class and heat on the social floor.",
    description:
      "Expect a balanced mix of technique labs, musical partnerwork, warm socials, and late-night rooms spread across spaces that each carry a different part of the YDF rhythm.",
    highlights: [
      {
        title: "Bachata foundations",
        description:
          "Grounded sessions focused on connection, timing, posture, partnerwork quality, and clean social-floor fundamentals.",
      },
      {
        title: "Sensual and Modern Bachata",
        description:
          "A dedicated lane for musical detail, controlled energy, and smooth late-night textures within the bachata family.",
      },
      {
        title: "Dominican Bachata and social nights",
        description:
          "Evening programming built around playful rhythm, joyful footwork, and intimate socials that can run deep into the night.",
      },
    ],
  },
  stats: [
    { value: "5", label: "festival days" },
    { value: "6", label: "guest artists" },
    { value: "3", label: "roadmap stops" },
    { value: "5", label: "social nights" },
  ],
  finalCta: {
    eyebrow: "Stay in the loop",
    title: "Ready to shape your Yerevan dance week?",
    description:
      "Start with the lineup, review the roadmap, then pick the pass that matches how much bachata energy you want from day classes to sunrise sets.",
    note:
      "Group requests, partner questions, and community inquiries can be handled manually before any checkout flow is introduced.",
    primaryCtaLabel: "Contact the team",
    primaryCtaHref: "mailto:hello@ydf-festival.example",
    secondaryCtaLabel: "View pricing",
    secondaryCtaHref: "/pricing",
    contactHeading: "Contact",
    socialsHeading: "Socials",
  },
};
