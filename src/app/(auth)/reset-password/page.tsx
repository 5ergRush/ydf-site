import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getOptionalAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  const auth = await getOptionalAuth();
  if (!auth) redirect("/forgot-password");

  return (
    <AuthShell
      eyebrow={
        auth.profile.password_reset_required
          ? "Team access requirement"
          : "Account recovery"
      }
      title="Choose a new password"
      description="After updating your password, sign in again to start a fresh secure session."
    >
      <ResetPasswordForm role={auth.profile.role} />
    </AuthShell>
  );
}
