import type { Metadata } from "next";
import { Container } from "@/components/container";
import { DashboardHeader } from "@/components/account/dashboard-header";
import { NameForm } from "@/components/account/name-form";
import { PersonalQr } from "@/components/account/personal-qr";
import { requireUser } from "@/lib/auth";
import { formatMoney, type Purchase } from "@/lib/domain";
import { getSiteUrl } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account" };

const statusStyle: Record<Purchase["status"], string> = {
  active: "bg-emerald-300/12 text-emerald-100 border-emerald-300/25",
  pending: "bg-accent/12 text-accent border-accent/25",
  cancelled: "bg-white/8 text-white/60 border-white/15",
  suspended: "bg-pink-red/12 text-pink-100 border-pink-red/25",
};

export default async function AccountPage() {
  const auth = await requireUser();
  const supabase = await createSupabaseServerClient();
  const { data } = supabase
    ? await supabase
        .from("purchases")
        .select(
          "id,user_id,product_id,product_name_snapshot,product_category_snapshot,amount_minor_snapshot,currency_snapshot,payment_method,status,status_reason,purchased_at",
        )
        .eq("user_id", auth.userId)
        .order("purchased_at", { ascending: false })
    : { data: [] };
  const purchases = (data ?? []) as Purchase[];
  const qrUrl = `${getSiteUrl()}/q/${auth.profile.qr_token}`;

  return (
    <div className="min-h-screen">
      <DashboardHeader profile={auth.profile} />
      <main className="py-10 sm:py-14">
        <Container className="space-y-8">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
              Your festival hub
            </p>
            <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">
              Hello, {auth.profile.first_name}
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-white/65">
              Review your account details and the authoritative status of every
              festival product connected to you.
            </p>
          </section>

          <div className="grid gap-7 lg:grid-cols-[1.35fr_0.8fr]">
            <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/45">
                    Profile
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-black">
                    Your information
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase text-white/55">
                  {auth.profile.role}
                </span>
              </div>
              <div className="mt-6 rounded-2xl border border-white/10 bg-near-black/30 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">
                  Email
                </p>
                <p className="mt-1 font-bold">{auth.profile.email}</p>
                <p className="mt-2 text-xs text-white/45">
                  Email changes require festival administrator assistance.
                </p>
              </div>
              <div className="mt-6">
                <NameForm
                  firstName={auth.profile.first_name}
                  lastName={auth.profile.last_name}
                />
              </div>
            </section>

            <section className="brand-glass rounded-[2rem] p-6 text-center sm:p-8">
              <p className="text-xs font-black uppercase tracking-widest text-accent">
                Personal QR
              </p>
              <h2 className="mt-2 font-display text-3xl font-black">
                Team lookup
              </h2>
              <div className="mt-6">
                <PersonalQr value={qrUrl} />
              </div>
              <p className="mt-5 text-sm leading-6 text-white/58">
                This QR contains no personal information. It only opens your
                record for an authorized volunteer, staff member, or admin.
              </p>
            </section>
          </div>

          <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-widest text-accent">
              Purchases
            </p>
            <h2 className="mt-2 font-display text-3xl font-black">
              Your festival products
            </h2>
            {purchases.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/4 px-6 py-12 text-center">
                <p className="font-bold">No products yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/55">
                  Products such as passes, masterclasses, and competition
                  participation will appear here once connected to your account.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {purchases.map((purchase) => (
                  <article
                    key={purchase.id}
                    className="rounded-3xl border border-white/10 bg-near-black/30 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-white/40">
                          {purchase.product_category_snapshot}
                        </p>
                        <h3 className="mt-1 text-xl font-black">
                          {purchase.product_name_snapshot}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${statusStyle[purchase.status]}`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                    <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-white/40">Locked price</dt>
                        <dd className="mt-1 font-bold">
                          {formatMoney(
                            purchase.amount_minor_snapshot,
                            purchase.currency_snapshot,
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-white/40">Payment</dt>
                        <dd className="mt-1 font-bold capitalize">
                          {purchase.payment_method}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-white/40">Purchase date</dt>
                        <dd className="mt-1 font-bold">
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                          }).format(new Date(purchase.purchased_at))}
                        </dd>
                      </div>
                    </dl>
                    {purchase.status === "pending" &&
                      purchase.payment_method === "cash" && (
                        <p className="mt-5 rounded-2xl bg-accent/10 p-3 text-sm text-accent">
                          Amount due at the door:{" "}
                          <strong>
                            {formatMoney(
                              purchase.amount_minor_snapshot,
                              purchase.currency_snapshot,
                            )}
                          </strong>
                        </p>
                      )}
                    {purchase.status_reason && (
                      <p className="mt-4 text-sm text-white/55">
                        Note: {purchase.status_reason}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
