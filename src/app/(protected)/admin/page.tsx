import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { DashboardHeader } from "@/components/account/dashboard-header";
import { QrScanner } from "@/components/admin/qr-scanner";
import { requireTeam } from "@/lib/auth";
import type { Profile } from "@/lib/domain";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Team dashboard" };

function cleanSearch(value: string) {
  return value
    .trim()
    .replace(/[%_,().]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

function qrMessage(value: string | undefined) {
  if (value === "invalid") {
    return "This is not a valid YDF participant QR code.";
  }
  if (value === "not-found") {
    return "No participant is linked to this QR code.";
  }
  if (value === "lookup-error") {
    return "The QR code could not be checked. Try again or use participant search.";
  }
  return null;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; qr?: string }>;
}) {
  const auth = await requireTeam();
  const { q = "", qr } = await searchParams;
  const query = cleanSearch(q);
  const scannerMessage = qrMessage(qr);
  const admin = createSupabaseAdminClient();
  let results: Profile[] = [];

  if (query.length >= 2 && admin) {
    if (query.includes("@")) {
      const { data } = await admin
        .from("profiles")
        .select(
          "id,email,first_name,last_name,role,account_state,password_reset_required,onboarding_completed,qr_token,created_at",
        )
        .eq("email", query.toLowerCase())
        .limit(20);
      results = (data ?? []) as Profile[];
    } else {
      const terms = query.split(" ").filter(Boolean);
      const searchTerm = terms[0] ?? query;
      const { data } = await admin
        .from("profiles")
        .select(
          "id,email,first_name,last_name,role,account_state,password_reset_required,onboarding_completed,qr_token,created_at",
        )
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .order("last_name")
        .limit(20);
      results = (data ?? []).filter((profile) => {
        const haystack =
          `${profile.first_name} ${profile.last_name}`.toLowerCase();
        return terms.every((term) => haystack.includes(term.toLowerCase()));
      }) as Profile[];
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader profile={auth.profile} />
      <main className="py-10 sm:py-14">
        <Container className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
                {auth.profile.role} access
              </p>
              <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">
                Team dashboard
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-white/65">
                Search participant records by name or exact email, or scan their
                personal QR.
              </p>
            </div>
            {auth.profile.role === "admin" && (
              <Link
                className="rounded-full border border-white/15 bg-white/7 px-5 py-3 font-black"
                href="/admin/products"
              >
                Product catalog
              </Link>
            )}
          </div>

          {scannerMessage && (
            <p
              className="rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent"
              role="status"
            >
              {scannerMessage}
            </p>
          )}

          <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
            <form className="flex flex-col gap-3 sm:flex-row" action="/admin">
              <label className="sr-only" htmlFor="participant-search">
                Search users
              </label>
              <input
                id="participant-search"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Name or exact email"
                className="min-w-0 flex-1 rounded-full border border-white/15 bg-near-black/40 px-5 py-3 text-white outline-none placeholder:text-white/35 focus:border-accent/60"
              />
              <button className="brand-gradient rounded-full px-6 py-3 font-black">
                Search
              </button>
              <QrScanner />
            </form>

            <div className="mt-7">
              {!query ? (
                <p className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-white/55">
                  Start with a name, exact email, or QR scan.
                </p>
              ) : query.length < 2 ? (
                <p className="text-sm text-accent">
                  Enter at least two characters.
                </p>
              ) : results.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-white/15 p-8 text-center text-white/55">
                  No matching participant was found.
                </p>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-white/10">
                  <ul className="divide-y divide-white/10">
                    {results.map((profile) => (
                      <li key={profile.id}>
                        <Link
                          href={`/admin/users/${profile.id}`}
                          className="flex flex-wrap items-center justify-between gap-4 bg-white/3 px-5 py-4 transition hover:bg-white/7"
                        >
                          <div>
                            <p className="font-black">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="mt-1 text-sm text-white/50">
                              {profile.email}
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs font-black uppercase">
                            <span className="rounded-full border border-white/10 px-3 py-1 text-white/55">
                              {profile.role}
                            </span>
                            <span
                              className={`rounded-full border px-3 py-1 ${
                                profile.account_state === "active"
                                  ? "border-emerald-300/20 text-emerald-100"
                                  : "border-pink-red/25 text-pink-100"
                              }`}
                            >
                              {profile.account_state}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
