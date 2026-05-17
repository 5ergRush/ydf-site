import Link from "next/link";
import { Container } from "@/components/container";
import { festivalInfo } from "@/data/festival";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-near-black/70 backdrop-blur-xl">
        <Container className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-full text-xs font-black uppercase tracking-widest text-white shadow-[0_0_32px_rgb(255_0_92_/_0.35)] transition-transform group-hover:scale-105">
              {festivalInfo.shortName}
            </span>
            <div>
              <p className="font-display text-xl font-black leading-none text-white">
                {festivalInfo.name}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/58">
                {festivalInfo.dates} / {festivalInfo.location}
              </p>
            </div>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/78"
          >
            {festivalInfo.navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-full border px-4 py-2 transition-all hover:-translate-y-0.5 hover:text-white",
                  item.href === "/pricing"
                    ? "border-accent/40 bg-accent/15 text-accent shadow-[0_0_24px_rgb(255_209_102_/_0.14)] hover:bg-accent/22"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="sparkle-field border-t border-white/10 bg-near-black/92 text-white">
        <Container className="grid gap-10 py-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-display text-3xl font-black">
              <span className="brand-gradient-text">{festivalInfo.shortName}</span>{" "}
              {festivalInfo.name}
            </p>
            <p className="max-w-md text-sm leading-7 text-white/70">
              {festivalInfo.tagline}
            </p>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent/80">
              {festivalInfo.dates} / {festivalInfo.location}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {festivalInfo.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/76 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/50">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${festivalInfo.contactEmail}`}
                  aria-label={`Email ${festivalInfo.name}`}
                  className="text-white/76 transition-colors hover:text-accent"
                >
                  {festivalInfo.contactEmail}
                </a>
              </li>
              {festivalInfo.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                  rel="noreferrer"
                  aria-label={`${social.label} for ${festivalInfo.name}`}
                  className="text-white/76 transition-colors hover:text-accent"
                >
                  {social.label}
                </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </footer>
    </div>
  );
}
