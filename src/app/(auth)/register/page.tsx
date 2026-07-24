import type { Metadata } from "next";
import Link from "next/link";
import { signInWithGoogle } from "@/app/actions/auth";
import { RegisterForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getTurnstileSiteKey, isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  const configured = isSupabaseConfigured();
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <AuthShell
      eyebrow="Personal space"
      title="Create your account"
      description="Keep your festival details, purchases, and personal check-in QR in one place."
      footer={
        <>
          Already registered?{" "}
          <Link className="font-bold text-accent hover:underline" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      {!configured && (
        <p className="mb-5 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent">
          Account registration is ready in the codebase but requires the
          Supabase setup described in the project guide.
        </p>
      )}
      <RegisterForm
        configured={configured}
        turnstileSiteKey={turnstileSiteKey}
      />
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-white/35">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <form action={signInWithGoogle}>
        <input name="next" type="hidden" value="/onboarding" />
        <button
          className="w-full rounded-full border border-white/15 bg-white/8 px-6 py-3 font-black text-white transition hover:bg-white/12 disabled:opacity-50"
          disabled={!configured}
        >
          Continue with Google
        </button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-white/48">
        Creating an account does not register you for the festival or reserve
        any festival product. Festival registration and purchases are separate
        steps.
      </p>
    </AuthShell>
  );
}
