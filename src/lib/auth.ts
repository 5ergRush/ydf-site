import "server-only";

import { redirect } from "next/navigation";
import type { Profile } from "@/lib/domain";
import { isTeamRole } from "@/lib/domain";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuthContext = {
  userId: string;
  email: string;
  profile: Profile;
  passwordAuthenticated: boolean;
};

function hasPasswordAuthentication(claims: unknown) {
  if (!claims || typeof claims !== "object") return false;
  const amr = (claims as { amr?: unknown }).amr;
  if (!Array.isArray(amr)) return false;

  return amr.some(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      (entry as { method?: unknown }).method === "password",
  );
}

export async function getOptionalAuth(): Promise<AuthContext | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const [{ data: userData }, { data: claimData }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getClaims(),
  ]);
  const user = userData.user;

  if (!user?.email) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id,email,first_name,last_name,role,account_state,password_reset_required,onboarding_completed,qr_token,created_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    userId: user.id,
    email: user.email,
    profile: profile as Profile,
    passwordAuthenticated: hasPasswordAuthentication(claimData?.claims),
  };
}

export async function requireUser() {
  const auth = await getOptionalAuth();

  if (!auth) {
    redirect("/login");
  }

  if (auth.profile.account_state === "suspended") {
    redirect("/account-suspended");
  }

  if (!auth.profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return auth;
}

export async function requireTeam() {
  const auth = await requireUser();

  if (!isTeamRole(auth.profile.role)) {
    redirect("/account");
  }

  if (auth.profile.password_reset_required) {
    redirect("/reset-password?required=1");
  }

  if (!auth.passwordAuthenticated) {
    redirect(
      "/login?next=%2Fadmin&message=Use+your+password+to+open+the+team+dashboard.",
    );
  }

  return auth;
}

export async function requireAdmin() {
  const auth = await requireTeam();

  if (auth.profile.role !== "admin") {
    redirect("/admin");
  }

  return auth;
}
