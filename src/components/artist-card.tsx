import Image from "next/image";
import Link from "next/link";
import type { Artist } from "@/types/festival";

type ArtistCardProps = {
  artist: Artist;
  variant?: "compact" | "full";
  href?: string;
  linkLabel?: string;
};

function getInitials(name: string) {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ArtistCard({
  artist,
  variant = "full",
  href,
  linkLabel = "Learn more",
}: ArtistCardProps) {
  const isCompact = variant === "compact";
  const paragraphs = isCompact ? [artist.excerpt] : artist.description;

  return (
    <article
      id={isCompact ? undefined : artist.id}
      className={[
        "brand-glass group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[2rem]",
        isCompact ? "min-h-[32rem]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "relative overflow-hidden border-b border-white/12 bg-[radial-gradient(circle_at_50%_24%,rgb(255_209_102_/_0.28),transparent_14rem),linear-gradient(135deg,#ff5e00,#ff005c_52%,#2a005f)]",
          isCompact ? "aspect-[16/11]" : "aspect-[16/10]",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgb(255_255_255_/_0.28),transparent_7rem),radial-gradient(circle_at_88%_18%,rgb(255_45_154_/_0.28),transparent_8rem)]" />
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.imageAlt ?? `${artist.name} artist portrait`}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover mix-blend-luminosity opacity-90 saturate-125 transition duration-500 group-hover:scale-105 group-hover:mix-blend-normal"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl font-black text-white drop-shadow-[0_10px_30px_rgb(18_0_20_/_0.45)]">
              {getInitials(artist.name)}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-near-black/82 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/18 bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white backdrop-blur">
          {artist.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">
          {artist.name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-accent">
          {artist.location}
        </p>

        <div
          className={[
            "mt-5 space-y-4 text-sm text-white/72",
            isCompact ? "leading-7" : "leading-7 sm:text-[0.95rem] sm:leading-8",
          ].join(" ")}
        >
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <ul
          aria-label={`${artist.name} styles`}
          className="mt-auto flex flex-wrap gap-2 pt-6"
        >
          {artist.styles.map((style) => (
            <li key={style}>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-bold text-white/82">
                {style}
              </span>
            </li>
          ))}
        </ul>

        {isCompact && href ? (
          <Link
            href={href}
            className="mt-6 inline-flex w-fit rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-black text-accent transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-near-black"
          >
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
