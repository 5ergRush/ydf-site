import Link from "next/link";
import { Container } from "@/components/container";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="sparkle-field min-h-screen py-12 sm:py-20">
      <Container>
        <div className="mx-auto max-w-xl">
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="brand-gradient flex h-11 w-11 items-center justify-center rounded-full text-xs font-black">
              YDF
            </span>
            <span className="font-display text-xl font-black">
              Yerevan Dance Festival
            </span>
          </Link>
          <section className="brand-glass brand-glow mt-8 rounded-[2rem] p-6 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl font-black">{title}</h1>
            <p className="mt-4 leading-7 text-white/65">{description}</p>
            <div className="mt-8">{children}</div>
            {footer && (
              <div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/65">
                {footer}
              </div>
            )}
          </section>
        </div>
      </Container>
    </main>
  );
}
