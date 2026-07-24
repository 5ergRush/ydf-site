import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getTurnstileSiteKey, isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your account email and we will send a secure reset link."
      footer={
        <Link className="font-bold text-accent hover:underline" href="/login">
          Return to sign in
        </Link>
      }
    >
      <ForgotPasswordForm
        configured={isSupabaseConfigured()}
        turnstileSiteKey={getTurnstileSiteKey()}
      />
    </AuthShell>
  );
}
