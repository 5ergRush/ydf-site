import type { Venue } from "@/types/festival";

type VenueCardProps = {
  venue: Venue;
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <article className="brand-glass sparkle-field flex h-full flex-col overflow-hidden rounded-[2rem] p-6">
      <div>
        <p className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-accent">
          {venue.area}
        </p>
        <h3 className="mt-5 font-display text-3xl font-black leading-tight text-white">
          {venue.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-white/74">
          {venue.address}
        </p>
      </div>

      <p className="mt-5 text-sm leading-7 text-white/72">{venue.description}</p>

      <ul aria-label={`${venue.name} spaces`} className="mt-5 flex flex-wrap gap-2">
        {venue.spaces.map((space) => (
          <li key={space}>
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-bold text-white/82">
              {space}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex min-h-44 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/20 bg-[radial-gradient(circle_at_50%_0%,rgb(255_209_102_/_0.18),transparent_11rem),linear-gradient(135deg,rgb(255_94_0_/_0.16),rgb(161_0_255_/_0.22))] px-4 text-center">
        <div className="absolute inset-x-8 top-1/2 border-t border-white/16" />
        <div className="absolute inset-y-8 left-1/2 border-l border-white/16" />
        <span className="relative rounded-full border border-white/16 bg-near-black/55 px-4 py-2 text-sm font-bold text-white/78 backdrop-blur">
          {venue.mapLabel}
        </span>
      </div>
    </article>
  );
}
