import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { PricingCard } from "@/components/pricing-card";
import { SectionTitle } from "@/components/section-title";
import { festivalInfo } from "@/data/festival";
import { loadPricingFromGoogleSheet } from "@/data/google-sheets-pricing";
import {
  pricingGridSection,
  pricingNotes,
  pricingNotesSection,
  pricingPageIntro,
} from "@/data/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: pricingPageIntro.description,
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const pricing = await loadPricingFromGoogleSheet();

  return (
    <>
      <PageHero
        eyebrow={pricingPageIntro.eyebrow}
        title={pricingPageIntro.title}
        description={pricingPageIntro.description}
      />

      <section className="py-16 sm:py-20" aria-labelledby="pricing-grid-title">
        <Container className="space-y-10">
          <SectionTitle
            id="pricing-grid-title"
            eyebrow={pricingGridSection.eyebrow}
            title={pricingGridSection.title}
            description={pricingGridSection.description}
          />

          {pricing.error ? (
            <div className="brand-glass rounded-3xl p-5 text-sm leading-7 text-white/76">
              Live pricing is temporarily unavailable. Showing fallback pricing
              while the sheet connection recovers.
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pricing.items.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-t border-white/10 bg-white/[0.03] py-16 sm:py-20"
        aria-labelledby="pricing-notes-title"
      >
        <Container className="space-y-8">
          <SectionTitle
            id="pricing-notes-title"
            eyebrow={pricingNotesSection.eyebrow}
            title={pricingNotesSection.title}
            description={pricingNotesSection.description}
          />

          <div className="brand-glass rounded-[2rem] p-6 sm:p-8">
            <ul className="space-y-4">
              {pricingNotes.map((note) => (
                <li key={note} className="flex gap-3 text-sm leading-7 text-white/74">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_rgb(255_209_102_/_0.7)]" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${festivalInfo.contactEmail}`}
              aria-label={`Email ${festivalInfo.name} about group or partner rates`}
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-near-black transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              {pricingNotesSection.ctaLabel}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
