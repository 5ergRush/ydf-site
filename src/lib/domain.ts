export const USER_ROLES = ["user", "volunteer", "staff", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATES = ["active", "suspended"] as const;
export type AccountState = (typeof ACCOUNT_STATES)[number];

export const PRODUCT_CATEGORIES = [
  "pass",
  "masterclass",
  "competition",
  "other",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PURCHASE_STATUSES = [
  "pending",
  "active",
  "cancelled",
  "suspended",
] as const;
export type PurchaseStatus = (typeof PURCHASE_STATUSES)[number];

export const PAYMENT_METHODS = ["card", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const CURRENCIES = ["AMD", "EUR", "RUB", "AED"] as const;
export type Currency = (typeof CURRENCIES)[number];

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  account_state: AccountState;
  password_reset_required: boolean;
  onboarding_completed: boolean;
  qr_token: string;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  active: boolean;
  published: boolean;
  created_at: string;
};

export type ProductPrice = {
  id: string;
  product_id: string;
  currency: Currency;
  amount_minor: number;
  active: boolean;
  created_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  product_category_snapshot: ProductCategory;
  amount_minor_snapshot: number;
  currency_snapshot: Currency;
  payment_method: PaymentMethod;
  status: PurchaseStatus;
  status_reason: string | null;
  purchased_at: string;
};

export function isTeamRole(role: UserRole) {
  return role === "volunteer" || role === "staff" || role === "admin";
}

export function canEditNames(role: UserRole) {
  return role === "staff" || role === "admin";
}

export function canManageEverything(role: UserRole) {
  return role === "admin";
}

export function formatMoney(amountMinor: number, currency: Currency) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: currency === "AMD" ? 0 : 2,
  }).format(amountMinor / (currency === "AMD" ? 1 : 100));
}
