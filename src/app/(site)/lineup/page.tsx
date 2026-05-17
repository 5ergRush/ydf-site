import type { Metadata } from "next";
import { ArtistCard } from "@/components/artist-card";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionTitle } from "@/components/section-title";
import { lineup, lineupGridSection, lineupPageIntro } from "@/data/lineup";

export const metadata: Metadata = {
  title: "Lineup",
  description: lineupPageIntro.description,
};

export default function LineupPage() {
  return (
    <>
      <PageHero
        eyebrow={lineupPageIntro.eyebrow}
        title={lineupPageIntro.title}
        description={lineupPageIntro.description}
      />

      <section
        className="sparkle-field py-16 sm:py-20"
        aria-labelledby="lineup-grid-title"
      >
        <Container className="space-y-10">
          <SectionTitle
            id="lineup-grid-title"
            eyebrow={lineupGridSection.eyebrow}
            title={lineupGridSection.title}
            description={lineupGridSection.description}
          />

          <div className="grid gap-7 lg:grid-cols-2">
            {lineup.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
