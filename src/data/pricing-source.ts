import { createClient } from "@supabase/supabase-js";
import { loadPricingFromGoogleSheet } from "@/data/google-sheets-pricing";
import { getSupabasePublicConfig } from "@/lib/env";
import type {
  PricingCurrency,
  PricingItem,
  PricingLoadResult,
} from "@/types/pricing";

const SYMBOLS: Record<PricingCurrency, string> = {
  AMD: "֏",
  EUR: "€",
  RUB: "₽",
  AED: "AED ",
};

function displayAmount(amountMinor: number, currency: PricingCurrency) {
  const divisor = currency === "AMD" ? 1 : 100;
  const value = new Intl.NumberFormat("en", {
    minimumFractionDigits: currency === "AMD" ? 0 : 2,
    maximumFractionDigits: currency === "AMD" ? 0 : 2,
  }).format(amountMinor / divisor);

  return {
    currency,
    value,
    display: `${SYMBOLS[currency]}${value}`,
  };
}

export async function loadPublicPricing(): Promise<PricingLoadResult> {
  const config = getSupabasePublicConfig();
  if (!config) return loadPricingFromGoogleSheet();

  try {
    const supabase = createClient(config.url, config.publishableKey, {
      auth: { persistSession: false },
    });
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,description,product_prices(currency,amount_minor,active)",
      )
      .eq("published", true)
      .eq("active", true)
      .eq("product_prices.active", true)
      .order("created_at");

    if (error) throw error;
    if (!data?.length) return loadPricingFromGoogleSheet();

    const items = data.map((product): PricingItem => ({
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      prices: (product.product_prices ?? []).map((price) =>
        displayAmount(
          Number(price.amount_minor),
          price.currency as PricingCurrency,
        ),
      ),
    }));

    return { items, source: "supabase" };
  } catch {
    const fallback = await loadPricingFromGoogleSheet();
    return {
      ...fallback,
      error: "Supabase pricing was unavailable.",
    };
  }
}
