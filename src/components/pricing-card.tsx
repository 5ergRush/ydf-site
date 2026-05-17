import { festivalInfo } from "@/data/festival";
import type { PricingItem } from "@/types/pricing";

type PricingCardProps = {
  tier: PricingItem;
};

export function PricingCard({ tier }: PricingCardProps) {
  const contactHref = `mailto:${festivalInfo.contactEmail}?subject=${encodeURIComponent(
    `${tier.name} reservation`,
  )}`;
  const priceLine =
    tier.prices.length > 0
      ? tier.prices.map((price) => price.display).join(" · ")
      : "Contact for price";
  const perks = tier.perks ?? [];

  return (
    <article
      className={[
        "festival-ticket flex h-full flex-col rounded-[2rem] border p-6 text-white",
        tier.recommended
          ? "premium-border bg-[linear-gradient(145deg,#ffb000_0%,#ff5e00_32%,#ff005c_72%,#2a005f_100%)]"
          : "border-white/14 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.14),rgb(255_45_154_/_0.12)_42%,rgb(42_0_95_/_0.72))]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {tier.availability ? (
            <p className="text-xs font-black uppercase tracking-[0.22em] text-accent">
              {tier.availability}
            </p>
          ) : null}
          <h3
            className={[
              "font-display text-3xl font-black leading-tight text-white",
              tier.availability ? "mt-4" : "",
            ].join(" ")}
          >
            {tier.name}
          </h3>
        </div>
        {tier.tag ? (
          <span className="rounded-full border border-accent/35 bg-accent px-3 py-1 text-xs font-black uppercase tracking-widest text-near-black">
            {tier.tag}
          </span>
        ) : null}
      </div>

      <p className="mt-6 font-display text-3xl font-black leading-tight text-white drop-shadow-[0_8px_26px_rgb(18_0_20_/_0.35)] sm:text-4xl">
        {priceLine}
      </p>
      {tier.description ? (
        <p className="mt-4 text-sm leading-7 text-white/74">
          {tier.description}
        </p>
      ) : null}

      {perks.length > 0 ? (
        <>
          <div className="my-7 border-t border-dashed border-white/24" />

          <ul aria-label={`${tier.name} perks`} className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex gap-3 text-sm leading-7 text-white/78">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_14px_rgb(255_209_102_/_0.7)]" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <a
        href={contactHref}
        aria-label={`Reserve ${tier.name}`}
        className={[
          "mt-8 inline-flex justify-center rounded-full px-5 py-3 text-sm font-black transition-all hover:-translate-y-0.5",
          tier.recommended
            ? "bg-white text-near-black hover:bg-accent"
            : "border border-white/16 bg-white/10 text-white hover:bg-white/16",
        ].join(" ")}
      >
        Reserve pass
      </a>
    </article>
  );
}
