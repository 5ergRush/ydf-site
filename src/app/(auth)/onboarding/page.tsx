import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getOptionalAuth } from "@/lib/auth";

export const metadata: Metadata = { title: "Complete registration" };

export default async function OnboardingPage() {
  const auth = await getOptionalAuth();
  if (!auth) redirect("/login");
  if (auth.profile.onboarding_completed) redirect("/account");

  const firstName =
    auth.profile.first_name === "Pending" ? "" : auth.profile.first_name;
  const lastName =
    auth.profile.last_name === "Profile" ? "" : auth.profile.last_name;

  return (
    <AuthShell
      eyebrow="One final step"
      title="Confirm your details"
      description="Google supplied your email. Confirm the festival record name and required account terms."
    >
      <OnboardingForm firstName={firstName} lastName={lastName} />
    </AuthShell>
  );
}
