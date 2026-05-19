import type { Metadata } from "next";
import { Container } from "@/components/container";
import { LineupPoster } from "@/components/lineup-poster";
import { SectionTitle } from "@/components/section-title";
import {
  lineup,
  lineupPageIntro,
  lineupPoster,
  lineupPosterSection,
} from "@/data/lineup";

export const metadata: Metadata = {
  title: "Lineup",
  description: lineupPageIntro.description,
};

export default function LineupPage() {
  return (
    <section
      className="sparkle-field relative overflow-hidden py-16 sm:py-20 lg:py-24"
      aria-labelledby="lineup-poster-title"
    >
      <span className="curve-lines" aria-hidden="true" />
      <Container className="relative space-y-10">
        <SectionTitle
          id="lineup-poster-title"
          eyebrow={lineupPosterSection.eyebrow}
          title={lineupPosterSection.title}
          description={lineupPosterSection.description}
        />

        <LineupPoster artists={lineup} poster={lineupPoster} />
      </Container>
    </section>
  );
}
