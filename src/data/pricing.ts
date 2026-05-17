import type { PageIntro, PageSection } from "@/types/festival";
import type { PricingItem } from "@/types/pricing";

export const pricingPageIntro: PageIntro = {
  eyebrow: "Pricing",
  title: "Clear pass options for guests who want bachata socials, workshops, or the full festival week.",
  description:
    "Choose the pass that matches how much of the festival you want to experience, from evening-only access to the full premium track.",
};

export const pricingGridSection: PageSection = {
  eyebrow: "Pass options",
  title: "A simple pass structure that is easy to compare at a glance.",
  description:
    "Each option focuses on a different level of bachata access, from evening entry to the most complete YDF experience.",
};

export const pricingNotesSection: PageSection = {
  eyebrow: "Notes",
  title: "A few details to keep in mind.",
  description:
    "This first pass keeps pricing communication clear and direct while operational details are still being finalized.",
  ctaLabel: "Ask about group or partner rates",
};

export const pricingPreviewSection: PageSection = {
  eyebrow: "Pricing preview",
  title: "Passes designed for social-only, workshop-focused, or full-week bachata plans.",
  description:
    "Compare the core options now, then refine messaging and checkout details later without changing the page structure.",
  ctaLabel: "Compare passes",
  ctaHref: "/pricing",
};

export const pricingTiers: PricingItem[] = [
  {
    id: "social-pass",
    name: "Social Pass",
    prices: [{ currency: "AMD", value: "15,000", display: "֏15,000" }],
    availability: "Entry level",
    description:
      "Best for guests who want evening access, community energy, and the social side of the bachata week.",
    perks: [
      "Access to all evening bachata socials",
      "Entry to the Thursday opening social",
      "Closing night bachata social",
    ],
  },
  {
    id: "festival-pass",
    name: "Festival Pass",
    prices: [{ currency: "AMD", value: "32,000", display: "֏32,000" }],
    availability: "Most flexible",
    description:
      "The main all-round option for visitors who want bachata workshops in the day and socials at night.",
    perks: [
      "All social pass access",
      "Core workshop track",
      "Priority entry to bachata showcases",
      "Festival welcome pack",
    ],
    recommended: true,
    tag: "Popular",
  },
  {
    id: "full-experience",
    name: "Full Experience",
    prices: [{ currency: "AMD", value: "48,000", display: "֏48,000" }],
    availability: "Limited spots",
    description:
      "For dancers who want the fullest version of the YDF week, including premium sessions and smaller-group moments.",
    perks: [
      "Everything in the festival pass",
      "Small-group artist lab",
      "Reserved showcase seating area",
      "Host support for roadmap navigation",
    ],
  },
];

export const pricingNotes = [
  "Final on-sale dates, payment links, and policy details will be confirmed closer to launch.",
  "Group requests, partner bundles, and community offers can be arranged directly with the festival team.",
  "Pass names and inclusions may be refined as the workshop schedule is finalized.",
];
