import { Container } from "@/components/container";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: PageHeroProps) {
  return (
    <section className="sparkle-field relative overflow-hidden border-b border-white/10 bg-[linear-gradient(135deg,#ffb000_0%,#ff5e00_28%,#ff005c_58%,#a100ff_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgb(255_255_255_/_0.2),transparent_18rem),linear-gradient(135deg,rgb(18_0_20_/_0.08),rgb(18_0_20_/_0.58))]" />
      <span className="curve-lines" aria-hidden="true" />
      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl">
          {eyebrow ? (
            <p className="inline-flex rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white shadow-[0_0_28px_rgb(255_255_255_/_0.1)] backdrop-blur">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-5 max-w-5xl font-display text-5xl font-black leading-[0.95] text-white drop-shadow-[0_10px_28px_rgb(18_0_20_/_0.38)] sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/82 sm:text-xl">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
