import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  assignPurchase,
  correctUserEmail,
  rotateUserQr,
  updatePurchaseStatus,
  updateTeamMemberName,
  updateUserAccess,
} from "@/app/actions/admin";
import { DashboardHeader } from "@/components/account/dashboard-header";
import { Container } from "@/components/container";
import { requireTeam } from "@/lib/auth";
import {
  ACCOUNT_STATES,
  PAYMENT_METHODS,
  PURCHASE_STATUSES,
  USER_ROLES,
  canEditNames,
  formatMoney,
  type Product,
  type ProductPrice,
  type Profile,
  type Purchase,
  type PurchaseStatus,
} from "@/lib/domain";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Participant record" };

const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-near-black/40 px-4 py-3 text-sm text-white outline-none focus:border-accent/60";

function allowedStatuses(
  role: Profile["role"],
  current: PurchaseStatus,
): PurchaseStatus[] {
  if (role === "admin") return [...PURCHASE_STATUSES];
  if (role === "staff") {
    if (current === "pending") return ["active", "suspended"];
    if (current === "active") return ["suspended"];
  }
  return [];
}

export default async function AdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await requireTeam();
  const { id } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) notFound();

  const [
    { data: profileData },
    { data: purchaseData },
    { data: productData },
    { data: priceData },
    { data: auditData },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select(
        "id,email,first_name,last_name,role,account_state,password_reset_required,onboarding_completed,qr_token,created_at",
      )
      .eq("id", id)
      .maybeSingle(),
    admin
      .from("purchases")
      .select(
        "id,user_id,product_id,product_name_snapshot,product_category_snapshot,amount_minor_snapshot,currency_snapshot,payment_method,status,status_reason,purchased_at",
      )
      .eq("user_id", id)
      .order("purchased_at", { ascending: false }),
    auth.profile.role === "admin"
      ? admin.from("products").select("*").eq("active", true).order("name")
      : Promise.resolve({ data: [] }),
    auth.profile.role === "admin"
      ? admin.from("product_prices").select("*").eq("active", true)
      : Promise.resolve({ data: [] }),
    auth.profile.role === "admin"
      ? admin
          .from("audit_log")
          .select("id,action,reason,created_at,actor_id,old_data,new_data")
          .eq("target_user_id", id)
          .order("created_at", { ascending: false })
          .limit(30)
      : Promise.resolve({ data: [] }),
  ]);

  if (!profileData) notFound();
  const profile = profileData as Profile;
  const purchases = (purchaseData ?? []) as Purchase[];
  const products = (productData ?? []) as Product[];
  const prices = (priceData ?? []) as ProductPrice[];
  const productMap = new Map(products.map((product) => [product.id, product]));

  return (
    <div className="min-h-screen">
      <DashboardHeader profile={auth.profile} />
      <main className="py-10 sm:py-14">
        <Container className="space-y-8">
          <div>
            <Link className="text-sm font-bold text-accent" href="/admin">
              ← Back to search
            </Link>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
                  Participant record
                </p>
                <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">
                  {profile.first_name} {profile.last_name}
                </h1>
                <p className="mt-2 text-white/58">{profile.email}</p>
              </div>
              <div className="flex gap-2 text-xs font-black uppercase">
                <span className="rounded-full border border-white/15 px-3 py-1">
                  {profile.role}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1">
                  {profile.account_state}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-2">
            <section className="brand-glass rounded-[2rem] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-white/45">
                Contact and identity
              </p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div>
                  <dt className="text-white/45">Email</dt>
                  <dd className="mt-1 font-bold">{profile.email}</dd>
                </div>
                <div>
                  <dt className="text-white/45">Account created</dt>
                  <dd className="mt-1 font-bold">
                    {new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                    }).format(new Date(profile.created_at))}
                  </dd>
                </div>
                <div>
                  <dt className="text-white/45">Team password reset</dt>
                  <dd className="mt-1 font-bold">
                    {profile.password_reset_required ? "Required" : "Clear"}
                  </dd>
                </div>
              </dl>
              {canEditNames(auth.profile.role) && (
                <form
                  action={updateTeamMemberName.bind(null, profile.id)}
                  className="mt-6 space-y-3 border-t border-white/10 pt-6"
                >
                  <p className="font-black">Correct participant name</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className={fieldClass}
                      name="firstName"
                      defaultValue={profile.first_name}
                      required
                    />
                    <input
                      className={fieldClass}
                      name="lastName"
                      defaultValue={profile.last_name}
                      required
                    />
                  </div>
                  <input
                    className={fieldClass}
                    name="reason"
                    placeholder="Reason or correction note"
                  />
                  <button className="rounded-full border border-accent/35 px-4 py-2 text-sm font-black text-accent">
                    Save name
                  </button>
                </form>
              )}
            </section>

            <section className="brand-glass rounded-[2rem] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-accent">
                Purchases
              </p>
              <h2 className="mt-2 font-display text-3xl font-black">
                Owned products
              </h2>
              {purchases.length === 0 ? (
                <p className="mt-5 rounded-2xl border border-dashed border-white/15 p-6 text-center text-white/50">
                  No products assigned.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {purchases.map((purchase) => {
                    const options = allowedStatuses(
                      auth.profile.role,
                      purchase.status,
                    );
                    return (
                      <article
                        key={purchase.id}
                        className="rounded-3xl border border-white/10 bg-near-black/30 p-5"
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="font-black">
                              {purchase.product_name_snapshot}
                            </p>
                            <p className="mt-1 text-sm text-white/50">
                              {formatMoney(
                                purchase.amount_minor_snapshot,
                                purchase.currency_snapshot,
                              )}{" "}
                              · {purchase.payment_method}
                            </p>
                          </div>
                          <span className="text-xs font-black uppercase text-accent">
                            {purchase.status}
                          </span>
                        </div>
                        {purchase.status_reason && (
                          <p className="mt-3 text-sm text-white/55">
                            {purchase.status_reason}
                          </p>
                        )}
                        {options.length > 0 && (
                          <form
                            action={updatePurchaseStatus.bind(
                              null,
                              purchase.id,
                            )}
                            className="mt-4 grid gap-3"
                          >
                            <select
                              className={fieldClass}
                              name="status"
                              defaultValue={purchase.status}
                              required
                            >
                              <option disabled value={purchase.status}>
                                Change from {purchase.status}
                              </option>
                              {options.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <input
                              className={fieldClass}
                              name="reason"
                              placeholder="Reason (required for cancelled/suspended)"
                            />
                            <button className="justify-self-start rounded-full border border-white/15 px-4 py-2 text-sm font-black">
                              Update status
                            </button>
                          </form>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {auth.profile.role === "admin" && (
            <>
              <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  Admin controls
                </p>
                <div className="mt-6 grid gap-7 lg:grid-cols-2">
                  <form
                    action={assignPurchase.bind(null, profile.id)}
                    className="space-y-3 rounded-3xl border border-white/10 p-5"
                  >
                    <h2 className="text-xl font-black">Assign product</h2>
                    <select className={fieldClass} name="priceId" required>
                      <option value="">Choose active product and price</option>
                      {prices.map((price) => {
                        const product = productMap.get(price.product_id);
                        if (!product) return null;
                        return (
                          <option key={price.id} value={price.id}>
                            {product.name} —{" "}
                            {formatMoney(price.amount_minor, price.currency)}
                          </option>
                        );
                      })}
                    </select>
                    <select
                      className={fieldClass}
                      name="paymentMethod"
                      required
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method === "cash"
                            ? "Cash — starts pending"
                            : "Card — starts active"}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-full border border-accent/35 px-4 py-2 text-sm font-black text-accent">
                      Assign purchase snapshot
                    </button>
                  </form>

                  <form
                    action={updateUserAccess.bind(null, profile.id)}
                    className="space-y-3 rounded-3xl border border-white/10 p-5"
                  >
                    <h2 className="text-xl font-black">Role and access</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <select
                        className={fieldClass}
                        name="role"
                        defaultValue={profile.role}
                      >
                        {USER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <select
                        className={fieldClass}
                        name="accountState"
                        defaultValue={profile.account_state}
                      >
                        {ACCOUNT_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex gap-3 text-sm text-white/65">
                      <input name="skipPasswordReset" type="checkbox" />
                      <span>
                        Skip the default password reset when promoting this user
                        (audited override).
                      </span>
                    </label>
                    <input
                      className={fieldClass}
                      name="reason"
                      placeholder="Required reason"
                      required
                    />
                    <button className="rounded-full border border-accent/35 px-4 py-2 text-sm font-black text-accent">
                      Update access
                    </button>
                  </form>

                  <form
                    action={correctUserEmail.bind(null, profile.id)}
                    className="space-y-3 rounded-3xl border border-pink-red/20 bg-pink-red/5 p-5"
                  >
                    <h2 className="text-xl font-black">
                      Rare email correction
                    </h2>
                    <p className="text-sm leading-6 text-white/55">
                      This immediately changes the verified login address.
                      Confirm it twice and record why.
                    </p>
                    <input
                      className={fieldClass}
                      type="email"
                      name="email"
                      placeholder="New email"
                      required
                    />
                    <input
                      className={fieldClass}
                      type="email"
                      name="emailConfirmation"
                      placeholder="Repeat new email"
                      required
                    />
                    <input
                      className={fieldClass}
                      name="reason"
                      placeholder="Required reason"
                      required
                    />
                    <button className="rounded-full border border-pink-red/35 px-4 py-2 text-sm font-black text-pink-100">
                      Correct email
                    </button>
                  </form>

                  <form
                    action={rotateUserQr.bind(null, profile.id)}
                    className="space-y-3 rounded-3xl border border-white/10 p-5"
                  >
                    <h2 className="text-xl font-black">Rotate QR token</h2>
                    <p className="text-sm leading-6 text-white/55">
                      Invalidates every saved or printed copy of the current QR.
                    </p>
                    <input
                      className={fieldClass}
                      name="reason"
                      placeholder="Required reason"
                      required
                    />
                    <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-black">
                      Rotate QR
                    </button>
                  </form>
                </div>
              </section>

              <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
                <p className="text-xs font-black uppercase tracking-widest text-accent">
                  Audit trail
                </p>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-widest text-white/40">
                      <tr>
                        <th className="pb-3">Time</th>
                        <th className="pb-3">Action</th>
                        <th className="pb-3">Reason</th>
                        <th className="pb-3">Actor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {(auditData ?? []).map((entry) => (
                        <tr key={entry.id}>
                          <td className="py-3 pr-5 text-white/55">
                            {new Intl.DateTimeFormat("en", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }).format(new Date(entry.created_at))}
                          </td>
                          <td className="py-3 pr-5 font-bold">
                            {entry.action}
                          </td>
                          <td className="py-3 pr-5 text-white/55">
                            {entry.reason || "—"}
                          </td>
                          <td className="py-3 font-mono text-xs text-white/45">
                            {entry.actor_id?.slice(0, 8) ?? "system"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}
