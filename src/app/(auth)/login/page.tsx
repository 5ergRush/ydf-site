import type { Metadata } from "next";
import Link from "next/link";
import { signInWithGoogle } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { getTurnstileSiteKey, isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    message?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const next = params.next === "/admin" ? "/admin" : "/account";
  const configured = isSupabaseConfigured();
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      description="Open your personal space or, if authorized, the team dashboard."
      footer={
        <>
          New to YDF?{" "}
          <Link
            className="font-bold text-accent hover:underline"
            href="/register"
          >
            Create an account
          </Link>
        </>
      }
    >
      {params.message && (
        <p className="mb-5 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent">
          {params.message}
        </p>
      )}
      {!configured && (
        <p className="mb-5 rounded-2xl border border-accent/25 bg-accent/10 p-4 text-sm text-accent">
          Login requires the Supabase environment values described in the
          project setup guide.
        </p>
      )}
      <LoginForm
        configured={configured}
        turnstileSiteKey={turnstileSiteKey}
        next={next}
      />
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-white/35">
        <span className="h-px flex-1 bg-white/10" />
        or
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <form action={signInWithGoogle}>
        <input name="next" type="hidden" value={next} />
        <button
          className="w-full rounded-full border border-white/15 bg-white/8 px-6 py-3 font-black text-white transition hover:bg-white/12 disabled:opacity-50"
          disabled={!configured}
        >
          Continue with Google
        </button>
      </form>
    </AuthShell>
  );
}
