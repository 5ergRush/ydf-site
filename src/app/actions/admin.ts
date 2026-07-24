"use server";

import { revalidatePath } from "next/cache";
import { writeAudit } from "@/lib/audit";
import { requireAdmin, requireTeam } from "@/lib/auth";
import {
  ACCOUNT_STATES,
  CURRENCIES,
  PAYMENT_METHODS,
  PRODUCT_CATEGORIES,
  PURCHASE_STATUSES,
  USER_ROLES,
  canEditNames,
  type PaymentMethod,
  type PurchaseStatus,
  type UserRole,
} from "@/lib/domain";
import { getSiteUrl, getSupabasePublicConfig } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function mustAdminClient() {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error("Supabase service access is not configured.");
  return admin;
}

async function sendPasswordReset(email: string) {
  const config = getSupabasePublicConfig();
  const resendApiKey = process.env.RESEND_API_KEY;
  const admin = mustAdminClient();
  if (!config || !resendApiKey) {
    throw new Error("Supabase Auth or Resend email is not configured.");
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: `${getSiteUrl()}/reset-password`,
    },
  });
  if (error || !data.properties?.hashed_token) {
    throw new Error(error?.message ?? "Could not create a password reset link.");
  }

  const resetUrl = new URL("/auth/confirm", getSiteUrl());
  resetUrl.searchParams.set("token_hash", data.properties.hashed_token);
  resetUrl.searchParams.set("type", "recovery");
  resetUrl.searchParams.set("next", "/reset-password");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `role-reset-${crypto.randomUUID()}`,
      "User-Agent": "YDF account administration",
    },
    body: JSON.stringify({
      from: "Yerevan Dance Festival <no-reply@auth.yerevandancefestival.com>",
      to: [email],
      subject: "Set your YDF team password",
      text: `Your YDF account was granted team access. Set a password that meets the team security rules:\n\n${resetUrl.toString()}\n\nIf you were not expecting this change, contact info@yerevandancefestival.com.`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend could not send the reset email (${response.status}).`);
  }
}

export async function updateTeamMemberName(userId: string, formData: FormData) {
  const auth = await requireTeam();
  if (!canEditNames(auth.profile.role) || !isUuid(userId)) {
    throw new Error("Not authorized.");
  }

  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const reason = text(formData, "reason");
  if (
    !firstName ||
    firstName.length > 100 ||
    !lastName ||
    lastName.length > 100
  ) {
    throw new Error("Enter valid first and last names.");
  }

  const admin = mustAdminClient();
  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("first_name,last_name")
    .eq("id", userId)
    .single();
  if (readError) throw new Error(readError.message);

  const { error } = await admin
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", userId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: userId,
    entityType: "profile",
    entityId: userId,
    action: "name_updated_by_team",
    oldData: existing,
    newData: { first_name: firstName, last_name: lastName },
    reason: reason || null,
  });
  revalidatePath(`/admin/users/${userId}`);
}

export async function updatePurchaseStatus(
  purchaseId: string,
  formData: FormData,
) {
  const auth = await requireTeam();
  const requested = text(formData, "status") as PurchaseStatus;
  const reason = text(formData, "reason");
  if (!isUuid(purchaseId) || !PURCHASE_STATUSES.includes(requested)) {
    throw new Error("Invalid purchase update.");
  }

  const admin = mustAdminClient();
  const { data: purchase, error: readError } = await admin
    .from("purchases")
    .select("id,user_id,status,status_reason")
    .eq("id", purchaseId)
    .single();
  if (readError) throw new Error(readError.message);

  if (auth.profile.role !== "admin") {
    const allowed =
      (purchase.status === "pending" && requested === "active") ||
      ((purchase.status === "active" || purchase.status === "pending") &&
        requested === "suspended");
    if (!allowed) throw new Error("Staff cannot make that status change.");
  }

  if ((requested === "suspended" || requested === "cancelled") && !reason) {
    throw new Error("A reason is required.");
  }

  const { error } = await admin
    .from("purchases")
    .update({ status: requested, status_reason: reason || null })
    .eq("id", purchaseId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: purchase.user_id,
    entityType: "purchase",
    entityId: purchaseId,
    action: "purchase_status_updated",
    oldData: { status: purchase.status, reason: purchase.status_reason },
    newData: { status: requested, reason: reason || null },
    reason: reason || null,
  });
  revalidatePath(`/admin/users/${purchase.user_id}`);
  revalidatePath("/account");
}

export async function updateUserAccess(userId: string, formData: FormData) {
  const auth = await requireAdmin();
  if (!isUuid(userId)) throw new Error("Invalid user.");

  const role = text(formData, "role") as UserRole;
  const accountState = text(formData, "accountState");
  const skipReset = formData.get("skipPasswordReset") === "on";
  const reason = text(formData, "reason");
  if (
    !USER_ROLES.includes(role) ||
    !ACCOUNT_STATES.includes(accountState as (typeof ACCOUNT_STATES)[number]) ||
    !reason
  ) {
    throw new Error("Role, account state, and reason are required.");
  }
  if (userId === auth.userId && accountState === "suspended") {
    throw new Error("You cannot suspend your own account.");
  }

  const admin = mustAdminClient();
  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("email,role,account_state,password_reset_required")
    .eq("id", userId)
    .single();
  if (readError) throw new Error(readError.message);

  const newlyPrivileged = existing.role === "user" && role !== "user";
  const passwordResetRequired =
    role === "user"
      ? false
      : newlyPrivileged
        ? !skipReset
        : existing.password_reset_required;

  const { error } = await admin
    .from("profiles")
    .update({
      role,
      account_state: accountState,
      password_reset_required: passwordResetRequired,
    })
    .eq("id", userId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: userId,
    entityType: "profile",
    entityId: userId,
    action: "access_updated",
    oldData: existing,
    newData: {
      role,
      account_state: accountState,
      password_reset_required: passwordResetRequired,
      password_reset_skipped: newlyPrivileged && skipReset,
    },
    reason,
  });

  if (newlyPrivileged && !skipReset) {
    await sendPasswordReset(existing.email);
  }

  revalidatePath(`/admin/users/${userId}`);
}

export async function correctUserEmail(userId: string, formData: FormData) {
  const auth = await requireAdmin();
  if (!isUuid(userId)) throw new Error("Invalid user.");

  const email = text(formData, "email").toLowerCase();
  const emailConfirmation = text(formData, "emailConfirmation").toLowerCase();
  const reason = text(formData, "reason");
  if (
    email !== emailConfirmation ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !reason
  ) {
    throw new Error("Enter the new email twice and provide a reason.");
  }

  const admin = mustAdminClient();
  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .single();
  if (readError) throw new Error(readError.message);

  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    email,
    email_confirm: true,
  });
  if (authError) throw new Error(authError.message);

  const { error } = await admin
    .from("profiles")
    .update({ email })
    .eq("id", userId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: userId,
    entityType: "profile",
    entityId: userId,
    action: "email_corrected_by_admin",
    oldData: { email: existing.email },
    newData: { email },
    reason,
  });
  revalidatePath(`/admin/users/${userId}`);
}

export async function rotateUserQr(userId: string, formData: FormData) {
  const auth = await requireAdmin();
  if (!isUuid(userId)) throw new Error("Invalid user.");
  const reason = text(formData, "reason");
  if (!reason) throw new Error("A reason is required.");

  const admin = mustAdminClient();
  const { data: existing, error: readError } = await admin
    .from("profiles")
    .select("qr_token")
    .eq("id", userId)
    .single();
  if (readError) throw new Error(readError.message);

  const nextToken = Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const { error } = await admin
    .from("profiles")
    .update({ qr_token: nextToken })
    .eq("id", userId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: userId,
    entityType: "profile",
    entityId: userId,
    action: "qr_rotated",
    oldData: { tokenSuffix: existing.qr_token.slice(-6) },
    newData: { tokenSuffix: nextToken.slice(-6) },
    reason,
  });
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/account");
}

export async function createProduct(formData: FormData) {
  const auth = await requireAdmin();
  const admin = mustAdminClient();
  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  const category = text(formData, "category");
  const description = text(formData, "description");
  const currency = text(formData, "currency");
  const amountDisplay = text(formData, "amount");
  const published = formData.get("published") === "on";
  const active = formData.get("active") === "on";

  if (
    !name ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !PRODUCT_CATEGORIES.includes(
      category as (typeof PRODUCT_CATEGORIES)[number],
    ) ||
    !CURRENCIES.includes(currency as (typeof CURRENCIES)[number])
  ) {
    throw new Error("Complete all product fields.");
  }

  const amount = Number(amountDisplay);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Enter a valid non-negative price.");
  }
  const amountMinor =
    currency === "AMD" ? Math.round(amount) : Math.round(amount * 100);

  const { data: product, error } = await admin
    .from("products")
    .insert({
      name,
      slug,
      category,
      description: description || null,
      active,
      published,
      created_by: auth.userId,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  const { error: priceError } = await admin.from("product_prices").insert({
    product_id: product.id,
    currency,
    amount_minor: amountMinor,
    created_by: auth.userId,
  });
  if (priceError) throw new Error(priceError.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    entityType: "product",
    entityId: product.id,
    action: "product_created",
    newData: {
      name,
      slug,
      category,
      currency,
      amount_minor: amountMinor,
      active,
      published,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/pricing");
}

export async function addProductPrice(productId: string, formData: FormData) {
  const auth = await requireAdmin();
  if (!isUuid(productId)) throw new Error("Invalid product.");
  const admin = mustAdminClient();
  const currency = text(formData, "currency");
  const amount = Number(text(formData, "amount"));
  if (
    !CURRENCIES.includes(currency as (typeof CURRENCIES)[number]) ||
    !Number.isFinite(amount) ||
    amount < 0
  ) {
    throw new Error("Enter a valid currency and price.");
  }
  const amountMinor =
    currency === "AMD" ? Math.round(amount) : Math.round(amount * 100);

  await admin
    .from("product_prices")
    .update({ active: false, retired_at: new Date().toISOString() })
    .eq("product_id", productId)
    .eq("currency", currency)
    .eq("active", true);
  const { data: price, error } = await admin
    .from("product_prices")
    .insert({
      product_id: productId,
      currency,
      amount_minor: amountMinor,
      created_by: auth.userId,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    entityType: "product_price",
    entityId: price.id,
    action: "product_price_created",
    newData: { productId, currency, amount_minor: amountMinor },
  });
  revalidatePath("/admin/products");
  revalidatePath("/pricing");
}

export async function updateProductState(
  productId: string,
  formData: FormData,
) {
  const auth = await requireAdmin();
  if (!isUuid(productId)) throw new Error("Invalid product.");
  const admin = mustAdminClient();
  const active = formData.get("active") === "on";
  const published = formData.get("published") === "on";
  const { data: existing, error: readError } = await admin
    .from("products")
    .select("active,published")
    .eq("id", productId)
    .single();
  if (readError) throw new Error(readError.message);
  const { error } = await admin
    .from("products")
    .update({ active, published })
    .eq("id", productId);
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    entityType: "product",
    entityId: productId,
    action: "product_state_updated",
    oldData: existing,
    newData: { active, published },
  });
  revalidatePath("/admin/products");
  revalidatePath("/pricing");
}

export async function assignPurchase(userId: string, formData: FormData) {
  const auth = await requireAdmin();
  if (!isUuid(userId)) throw new Error("Invalid user.");
  const admin = mustAdminClient();
  const priceId = text(formData, "priceId");
  const paymentMethod = text(formData, "paymentMethod") as PaymentMethod;
  if (!isUuid(priceId) || !PAYMENT_METHODS.includes(paymentMethod)) {
    throw new Error("Choose a price and payment method.");
  }

  const { data: price, error: priceError } = await admin
    .from("product_prices")
    .select(
      "id,product_id,currency,amount_minor,active,products(id,name,category,active)",
    )
    .eq("id", priceId)
    .eq("active", true)
    .single();
  if (priceError) throw new Error(priceError.message);
  const productValue = price.products;
  const product = Array.isArray(productValue) ? productValue[0] : productValue;
  if (!product?.active) throw new Error("That product is inactive.");

  const status: PurchaseStatus =
    paymentMethod === "cash" ? "pending" : "active";
  const { data: purchase, error } = await admin
    .from("purchases")
    .insert({
      user_id: userId,
      product_id: product.id,
      product_name_snapshot: product.name,
      product_category_snapshot: product.category,
      amount_minor_snapshot: price.amount_minor,
      currency_snapshot: price.currency,
      payment_method: paymentMethod,
      status,
      created_by: auth.userId,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: userId,
    entityType: "purchase",
    entityId: purchase.id,
    action: "purchase_assigned",
    newData: {
      productId: product.id,
      priceId,
      amount_minor: price.amount_minor,
      currency: price.currency,
      paymentMethod,
      status,
    },
  });
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/account");
}
