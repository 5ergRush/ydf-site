import type { Metadata } from "next";
import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { PricingCard } from "@/components/pricing-card";
import { SectionTitle } from "@/components/section-title";
import { VenueCard } from "@/components/venue-card";
import { festivalInfo } from "@/data/festival";
import { lineup, lineupPreviewSection } from "@/data/lineup";
import {
  pricingNotes,
  pricingPreviewSection,
  pricingTiers,
} from "@/data/pricing";
import { venues, venuesPreviewSection } from "@/data/venues";

export const metadata: Metadata = {
  title: {
    absolute: festivalInfo.name,
  },
  description: festivalInfo.tagline,
};

export default function HomePage() {
  const venuePreview = venues.slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={festivalInfo.hero.eyebrow}
        title={festivalInfo.hero.title}
        description={festivalInfo.hero.description}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            href={festivalInfo.hero.primaryCta.href}
            aria-label={festivalInfo.hero.primaryCta.label}
            className="rounded-full bg-white px-6 py-3 text-sm font-black text-near-black shadow-[0_16px_34px_rgb(18_0_20_/_0.22)] transition-all hover:-translate-y-0.5 hover:bg-accent"
          >
            {festivalInfo.hero.primaryCta.label}
          </Link>
          <Link
            href={festivalInfo.hero.secondaryCta.href}
            aria-label={festivalInfo.hero.secondaryCta.label}
            className="rounded-full border border-white/22 bg-white/12 px-6 py-3 text-sm font-black text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/18"
          >
            {festivalInfo.hero.secondaryCta.label}
          </Link>
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {festivalInfo.stats.map((stat) => (
            <div
              key={stat.label}
              className="brand-glass rounded-3xl p-5"
            >
              <dt className="text-sm font-bold uppercase tracking-widest text-white/62">
                {stat.label}
              </dt>
              <dd className="mt-2 font-display text-4xl font-black text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </PageHero>

      <section className="relative py-16 sm:py-20" aria-labelledby="home-about-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <SectionTitle
            id="home-about-title"
            eyebrow={festivalInfo.about.eyebrow}
            title={festivalInfo.about.title}
            description={festivalInfo.about.description}
          />

          <div className="grid gap-4 md:grid-cols-3">
            {festivalInfo.about.highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="brand-glass rounded-[2rem] p-6"
              >
                <h3 className="font-display text-2xl font-black text-white">
                  {highlight.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="sparkle-field border-y border-white/10 bg-white/[0.03] py-16 sm:py-20"
        aria-labelledby="home-lineup-title"
      >
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              id="home-lineup-title"
              eyebrow={lineupPreviewSection.eyebrow}
              title={lineupPreviewSection.title}
              description={lineupPreviewSection.description}
            />
            <Link
              href={lineupPreviewSection.ctaHref ?? "/lineup"}
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-black text-accent transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-near-black"
            >
              {lineupPreviewSection.ctaLabel}
            </Link>
          </div>

          <div
            className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
            aria-label="Featured bachata artists"
          >
            {lineup.map((artist) => (
              <div
                key={artist.id}
                className="min-w-[18.5rem] max-w-[21rem] snap-start lg:min-w-0 lg:max-w-none"
              >
                <ArtistCard
                  artist={artist}
                  variant="compact"
                  href={`/lineup#${artist.id}`}
                  linkLabel="Learn more"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="home-roadmap-title">
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              id="home-roadmap-title"
              eyebrow={venuesPreviewSection.eyebrow}
              title={venuesPreviewSection.title}
              description={venuesPreviewSection.description}
            />
            <Link
              href={venuesPreviewSection.ctaHref ?? "/venues"}
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-black text-accent transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-near-black"
            >
              {venuesPreviewSection.ctaLabel}
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {venuePreview.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-y border-white/10 bg-[linear-gradient(180deg,rgb(42_0_95_/_0.5),rgb(18_0_20_/_0.25))] py-16 sm:py-20"
        aria-labelledby="home-pricing-title"
      >
        <Container className="space-y-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              id="home-pricing-title"
              eyebrow={pricingPreviewSection.eyebrow}
              title={pricingPreviewSection.title}
              description={pricingPreviewSection.description}
            />
            <Link
              href={pricingPreviewSection.ctaHref ?? "/pricing"}
              className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-black text-accent transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-near-black"
            >
              {pricingPreviewSection.ctaLabel}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} />
            ))}
          </div>

          <p className="max-w-3xl text-sm leading-7 text-white/62">
            {pricingNotes[0]}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="home-final-cta-title">
        <Container>
          <div className="sparkle-field relative overflow-hidden rounded-[2rem] border border-white/14 bg-[linear-gradient(135deg,#ffb000_0%,#ff5e00_28%,#ff005c_64%,#2a005f_100%)] p-8 text-white shadow-[0_30px_90px_rgb(255_0_92_/_0.22)] sm:p-10">
            <span className="curve-lines" aria-hidden="true" />
            <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
              <div className="relative">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-white/72">
                  {festivalInfo.finalCta.eyebrow}
                </p>
                <h2
                  id="home-final-cta-title"
                  className="mt-4 max-w-2xl font-display text-4xl font-black leading-tight sm:text-6xl"
                >
                  {festivalInfo.finalCta.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base font-medium leading-8 text-white/78">
                  {festivalInfo.finalCta.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={festivalInfo.finalCta.primaryCtaHref}
                    aria-label={`Email ${festivalInfo.name}`}
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-near-black transition-all hover:-translate-y-0.5 hover:bg-accent"
                  >
                    {festivalInfo.finalCta.primaryCtaLabel}
                  </a>
                  <Link
                    href={festivalInfo.finalCta.secondaryCtaHref}
                    aria-label={festivalInfo.finalCta.secondaryCtaLabel}
                    className="rounded-full border border-white/22 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/16"
                  >
                    {festivalInfo.finalCta.secondaryCtaLabel}
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                <section className="brand-glass rounded-3xl p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-white/58">
                    {festivalInfo.finalCta.contactHeading}
                  </p>
                  <a
                    href={`mailto:${festivalInfo.contactEmail}`}
                    aria-label={`Email ${festivalInfo.name}`}
                    className="mt-4 block font-display text-2xl font-black text-white transition-colors hover:text-accent"
                  >
                    {festivalInfo.contactEmail}
                  </a>
                  <p className="mt-3 text-sm leading-7 text-white/70">
                    {festivalInfo.finalCta.note}
                  </p>
                </section>

                <section className="brand-glass rounded-3xl p-6">
                  <p className="text-xs font-black uppercase tracking-widest text-white/58">
                    {festivalInfo.finalCta.socialsHeading}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {festivalInfo.socials.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${social.label} for ${festivalInfo.name}`}
                          className="inline-flex rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/16"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
