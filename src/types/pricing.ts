export type PricingCurrency = "AMD" | "EURO" | "RUBLY" | "AED";

export type PricingAmount = {
  currency: PricingCurrency;
  value: string;
  display: string;
};

export type PricingItem = {
  id: string;
  name: string;
  prices: PricingAmount[];
  availability?: string;
  description?: string;
  perks?: string[];
  recommended?: boolean;
  tag?: string;
};

export type PricingLoadResult = {
  items: PricingItem[];
  source: "google-sheet" | "fallback";
  error?: string;
};
