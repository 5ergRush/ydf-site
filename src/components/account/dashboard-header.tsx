import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Container } from "@/components/container";
import type { Profile } from "@/lib/domain";
import { isTeamRole } from "@/lib/domain";

export function DashboardHeader({ profile }: { profile: Profile }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-near-black/80 backdrop-blur-xl">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="brand-gradient flex h-11 w-11 items-center justify-center rounded-full text-xs font-black">
            YDF
          </span>
          <span className="font-display text-xl font-black">
            Personal space
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold">
          <Link
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10"
            href="/account"
          >
            My account
          </Link>
          {isTeamRole(profile.role) && (
            <Link
              className="rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-accent hover:bg-accent/15"
              href="/admin"
            >
              Team dashboard
            </Link>
          )}
          <form action={logout}>
            <button className="rounded-full border border-white/10 px-4 py-2 text-white/70 hover:text-white">
              Sign out
            </button>
          </form>
        </nav>
      </Container>
    </header>
  );
}
