import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { VenueCard } from "@/components/venue-card";
import {
  venueNotes,
  venues,
  venuesGridSection,
  venuesNotesSection,
  venuesPageIntro,
} from "@/data/venues";

export const metadata: Metadata = {
  title: "Roadmap",
  description: venuesPageIntro.description,
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow={venuesPageIntro.eyebrow}
        title={venuesPageIntro.title}
        description={venuesPageIntro.description}
      />

      <section className="py-16 sm:py-20" aria-labelledby="roadmap-grid-title">
        <Container className="space-y-10">
          <SectionTitle
            id="roadmap-grid-title"
            eyebrow={venuesGridSection.eyebrow}
            title={venuesGridSection.title}
            description={venuesGridSection.description}
          />

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        </Container>
      </section>

      <section
        className="border-t border-white/10 bg-white/[0.03] py-16 sm:py-20"
        aria-labelledby="roadmap-notes-title"
      >
        <Container className="space-y-8">
          <SectionTitle
            id="roadmap-notes-title"
            eyebrow={venuesNotesSection.eyebrow}
            title={venuesNotesSection.title}
            description={venuesNotesSection.description}
          />

          <ul className="grid gap-4 md:grid-cols-2">
            {venueNotes.map((note) => (
              <li
                key={note}
                className="brand-glass rounded-3xl p-5 text-sm leading-7 text-white/72"
              >
                {note}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
