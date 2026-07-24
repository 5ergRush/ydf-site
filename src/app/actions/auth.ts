"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { writeAudit } from "@/lib/audit";
import type { AuthActionState } from "@/lib/action-state";
import { getOptionalAuth } from "@/lib/auth";
import { getSiteUrl, getSupabasePublicConfig } from "@/lib/env";
import { validatePassword } from "@/lib/passwords";
import { POLICY_VERSION } from "@/lib/policies";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function validateName(value: string, label: string) {
  if (!value) return `${label} is required.`;
  if (value.length > 100) return `${label} must be 100 characters or fewer.`;
  return null;
}

function safeNext(value: string) {
  return value === "/admin" ? "/admin" : "/account";
}

export async function register(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const captchaToken = text(formData, "captchaToken");
  const ageConfirmed = formData.get("ageConfirmed") === "on";
  const termsAccepted = formData.get("termsAccepted") === "on";
  const privacyAcknowledged = formData.get("privacyAcknowledged") === "on";
  const errors = [
    validateName(firstName, "First name"),
    validateName(lastName, "Last name"),
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Enter a valid email address."
      : null,
    ...validatePassword(password, "user"),
    password !== confirmPassword ? "Passwords do not match." : null,
    !ageConfirmed ? "You must confirm that you are at least 16." : null,
    !termsAccepted ? "You must accept the Terms of Use." : null,
    !privacyAcknowledged ? "You must acknowledge the Privacy Policy." : null,
    !captchaToken ? "Complete the anti-bot check." : null,
  ].filter(Boolean);

  if (errors.length > 0) {
    return {
      status: "error",
      message: errors[0] ?? "Check the form and try again.",
      fields: { firstName, lastName, email },
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Registration is not configured yet.",
      fields: { firstName, lastName, email },
    };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
      emailRedirectTo: getSiteUrl(),
      data: {
        first_name: firstName,
        last_name: lastName,
        age_16_confirmed: true,
        terms_accepted: true,
        terms_version: POLICY_VERSION,
        privacy_acknowledged: true,
        privacy_version: POLICY_VERSION,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
      fields: { firstName, lastName, email },
    };
  }

  return {
    status: "success",
    message: "Check your email and follow the verification link to continue.",
  };
}

export async function login(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const captchaToken = text(formData, "captchaToken");
  const next = safeNext(text(formData, "next"));
  const supabase = await createSupabaseServerClient();

  if (!captchaToken) {
    return {
      status: "error",
      message: "Complete the anti-bot check.",
      fields: { email },
    };
  }

  if (!supabase) {
    return {
      status: "error",
      message: "Login is not configured yet.",
      fields: { email },
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    return {
      status: "error",
      message: "The email or password is incorrect.",
      fields: { email },
    };
  }

  redirect(next);
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(text(formData, "next"));
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login?error=setup");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=google");
  }

  redirect(data.url);
}

export async function requestPasswordReset(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = text(formData, "email").toLowerCase();
  const captchaToken = text(formData, "captchaToken");
  const config = getSupabasePublicConfig();

  if (!captchaToken) {
    return {
      status: "error",
      message: "Complete the anti-bot check.",
      fields: { email },
    };
  }

  if (!config) {
    return {
      status: "error",
      message: "Password reset is not configured yet.",
    };
  }

  const supabase = createClient(config.url, config.publishableKey, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteUrl(),
    captchaToken,
  });

  if (error) {
    return { status: "error", message: error.message, fields: { email } };
  }

  return {
    status: "success",
    message:
      "If an account exists for that address, a password reset email is on its way.",
  };
}

export async function completeOnboarding(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const auth = await getOptionalAuth();
  const admin = createSupabaseAdminClient();
  if (!auth || !admin) {
    return { status: "error", message: "Your session has expired." };
  }

  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const errors = [
    validateName(firstName, "First name"),
    validateName(lastName, "Last name"),
    formData.get("ageConfirmed") !== "on"
      ? "You must confirm that you are at least 16."
      : null,
    formData.get("termsAccepted") !== "on"
      ? "You must accept the Terms of Use."
      : null,
    formData.get("privacyAcknowledged") !== "on"
      ? "You must acknowledge the Privacy Policy."
      : null,
  ].filter(Boolean);

  if (errors.length > 0) {
    return {
      status: "error",
      message: errors[0] ?? "Check the form and try again.",
      fields: { firstName, lastName },
    };
  }

  const now = new Date().toISOString();
  const { error } = await admin
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      onboarding_completed: true,
      age_16_confirmed_at: now,
      terms_version: POLICY_VERSION,
      terms_accepted_at: now,
      privacy_version: POLICY_VERSION,
      privacy_acknowledged_at: now,
    })
    .eq("id", auth.userId);

  if (error) {
    return { status: "error", message: error.message };
  }

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: auth.userId,
    entityType: "profile",
    entityId: auth.userId,
    action: "onboarding_completed",
    newData: { firstName, lastName, policyVersion: POLICY_VERSION },
  });

  redirect("/account");
}

export async function updatePassword(
  _previous: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const auth = await getOptionalAuth();
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!auth || !supabase || !admin) {
    return {
      status: "error",
      message: "Open a fresh reset link and try again.",
    };
  }

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const errors = validatePassword(password, auth.profile.role);
  if (password !== confirmPassword) errors.push("Passwords do not match.");

  if (errors.length > 0) {
    return { status: "error", message: errors[0] };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };

  const { error: profileError } = await admin
    .from("profiles")
    .update({ password_reset_required: false })
    .eq("id", auth.userId);
  if (profileError) {
    return { status: "error", message: profileError.message };
  }

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: auth.userId,
    entityType: "profile",
    entityId: auth.userId,
    action: "password_updated",
  });

  await supabase.auth.signOut();
  redirect("/login?message=Password+updated.+Sign+in+with+your+new+password.");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/");
}
