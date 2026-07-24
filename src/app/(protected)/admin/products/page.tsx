import type { Metadata } from "next";
import Link from "next/link";
import {
  addProductPrice,
  createProduct,
  updateProductState,
} from "@/app/actions/admin";
import { DashboardHeader } from "@/components/account/dashboard-header";
import { Container } from "@/components/container";
import { requireAdmin } from "@/lib/auth";
import {
  CURRENCIES,
  PRODUCT_CATEGORIES,
  formatMoney,
  type Product,
  type ProductPrice,
} from "@/lib/domain";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Product catalog" };

const fieldClass =
  "w-full rounded-2xl border border-white/15 bg-near-black/40 px-4 py-3 text-sm text-white outline-none focus:border-accent/60";

export default async function ProductsPage() {
  const auth = await requireAdmin();
  const admin = createSupabaseAdminClient();
  const [{ data: productData }, { data: priceData }] = admin
    ? await Promise.all([
        admin.from("products").select("*").order("created_at"),
        admin
          .from("product_prices")
          .select("*")
          .eq("active", true)
          .order("created_at"),
      ])
    : [{ data: [] }, { data: [] }];
  const products = (productData ?? []) as Product[];
  const prices = (priceData ?? []) as ProductPrice[];

  return (
    <div className="min-h-screen">
      <DashboardHeader profile={auth.profile} />
      <main className="py-10 sm:py-14">
        <Container className="space-y-8">
          <div>
            <Link className="text-sm font-bold text-accent" href="/admin">
              ← Team dashboard
            </Link>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-accent">
              Admin only
            </p>
            <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">
              Product catalog
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-white/65">
              Active controls assignment and future sales. Published controls
              appearance on the public pricing page.
            </p>
          </div>

          <section className="brand-glass rounded-[2rem] p-6 sm:p-8">
            <h2 className="font-display text-3xl font-black">
              Create a product
            </h2>
            <form
              action={createProduct}
              className="mt-6 grid gap-4 lg:grid-cols-2"
            >
              <input
                className={fieldClass}
                name="name"
                placeholder="Product name"
                required
              />
              <input
                className={fieldClass}
                name="slug"
                placeholder="stable-product-slug"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
              />
              <select className={fieldClass} name="category">
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                <select className={fieldClass} name="currency">
                  {CURRENCIES.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <input
                  className={fieldClass}
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  required
                />
              </div>
              <textarea
                className={`${fieldClass} lg:col-span-2`}
                name="description"
                placeholder="Optional public description"
                maxLength={2000}
                rows={3}
              />
              <div className="flex flex-wrap gap-5 text-sm">
                <label className="flex gap-2">
                  <input name="active" type="checkbox" defaultChecked />
                  Active
                </label>
                <label className="flex gap-2">
                  <input name="published" type="checkbox" />
                  Published publicly
                </label>
              </div>
              <button className="brand-gradient justify-self-start rounded-full px-6 py-3 font-black">
                Create product
              </button>
            </form>
          </section>

          <section className="grid gap-5">
            {products.length === 0 ? (
              <div className="brand-glass rounded-[2rem] p-10 text-center text-white/55">
                No products yet. Create the first catalog item above.
              </div>
            ) : (
              products.map((product) => {
                const productPrices = prices.filter(
                  (price) => price.product_id === product.id,
                );
                return (
                  <article
                    key={product.id}
                    className="brand-glass rounded-[2rem] p-6"
                  >
                    <div className="flex flex-wrap justify-between gap-5">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-accent">
                          {product.category}
                        </p>
                        <h2 className="mt-1 text-2xl font-black">
                          {product.name}
                        </h2>
                        <p className="mt-1 font-mono text-xs text-white/40">
                          {product.slug}
                        </p>
                        {product.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <form
                        action={updateProductState.bind(null, product.id)}
                        className="flex flex-wrap items-center gap-4 text-sm"
                      >
                        <label className="flex gap-2">
                          <input
                            name="active"
                            type="checkbox"
                            defaultChecked={product.active}
                          />
                          Active
                        </label>
                        <label className="flex gap-2">
                          <input
                            name="published"
                            type="checkbox"
                            defaultChecked={product.published}
                          />
                          Published
                        </label>
                        <button className="rounded-full border border-white/15 px-4 py-2 font-black">
                          Save
                        </button>
                      </form>
                    </div>
                    <div className="mt-6 flex flex-wrap items-end gap-4 border-t border-white/10 pt-5">
                      <div className="flex flex-wrap gap-2">
                        {productPrices.map((price) => (
                          <span
                            key={price.id}
                            className="rounded-full border border-accent/20 bg-accent/8 px-3 py-1.5 text-sm font-bold text-accent"
                          >
                            {formatMoney(price.amount_minor, price.currency)}
                          </span>
                        ))}
                      </div>
                      <form
                        action={addProductPrice.bind(null, product.id)}
                        className="ml-auto flex flex-wrap gap-2"
                      >
                        <select className={fieldClass} name="currency">
                          {CURRENCIES.map((currency) => (
                            <option key={currency} value={currency}>
                              {currency}
                            </option>
                          ))}
                        </select>
                        <input
                          className={fieldClass}
                          name="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="New price"
                          required
                        />
                        <button className="rounded-full border border-accent/35 px-4 py-2 text-sm font-black text-accent">
                          Set current price
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}
