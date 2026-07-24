"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  completeOnboarding,
  login,
  register,
  requestPasswordReset,
  updatePassword,
} from "@/app/actions/auth";
import { passwordHelp } from "@/lib/passwords";
import {
  type AuthActionState,
  initialAuthState,
} from "@/lib/action-state";
import { Turnstile } from "@/components/auth/turnstile";

const inputClass =
  "w-full rounded-2xl border border-white/15 bg-near-black/45 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-accent/70 focus:ring-2 focus:ring-accent/20";

function Message({ state }: { state: AuthActionState }) {
  if (!state.message) return null;

  return (
    <p
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm ${
        state.status === "success"
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
          : "border-pink-red/35 bg-pink-red/10 text-pink-100"
      }`}
    >
      {state.message}
    </p>
  );
}

export function OnboardingForm({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [state, action, pending] = useActionState(
    completeOnboarding,
    initialAuthState,
  );

  return (
    <form action={action} className="space-y-5">
      <Message state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-bold">
          <span>First name</span>
          <input
            className={inputClass}
            name="firstName"
            defaultValue={state.fields?.firstName ?? firstName}
            autoComplete="given-name"
            maxLength={100}
            required
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Last name</span>
          <input
            className={inputClass}
            name="lastName"
            defaultValue={state.fields?.lastName ?? lastName}
            autoComplete="family-name"
            maxLength={100}
            required
          />
        </label>
      </div>
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
        <label className="flex gap-3">
          <input name="ageConfirmed" type="checkbox" required />
          <span>I confirm that I am at least 16 years old.</span>
        </label>
        <label className="flex gap-3">
          <input name="termsAccepted" type="checkbox" required />
          <span>
            I agree to the{" "}
            <Link className="text-accent underline" href="/terms">
              Terms of Use
            </Link>
            .
          </span>
        </label>
        <label className="flex gap-3">
          <input name="privacyAcknowledged" type="checkbox" required />
          <span>
            I acknowledge the{" "}
            <Link className="text-accent underline" href="/privacy">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>
      <button
        className="brand-gradient w-full rounded-full px-6 py-3 font-black text-white disabled:opacity-50"
        disabled={pending}
      >
        {pending ? "Saving…" : "Complete registration"}
      </button>
    </form>
  );
}

export function RegisterForm({
  configured,
  turnstileSiteKey,
}: {
  configured: boolean;
  turnstileSiteKey: string | null;
}) {
  const [state, action, pending] = useActionState(register, initialAuthState);

  return (
    <form action={action} className="space-y-5">
      <Message state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-bold">
          <span>First name</span>
          <input
            className={inputClass}
            name="firstName"
            defaultValue={state.fields?.firstName}
            autoComplete="given-name"
            maxLength={100}
            required
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Last name</span>
          <input
            className={inputClass}
            name="lastName"
            defaultValue={state.fields?.lastName}
            autoComplete="family-name"
            maxLength={100}
            required
          />
        </label>
      </div>
      <p className="-mt-2 text-xs leading-5 text-white/55">
        Enter the name that should appear on your festival records. You can
        correct it later.
      </p>
      <label className="block space-y-2 text-sm font-bold">
        <span>Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          defaultValue={state.fields?.email}
          autoComplete="email"
          required
        />
      </label>
      <label className="block space-y-2 text-sm font-bold">
        <span>Password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <span className="block text-xs font-normal text-white/55">
          {passwordHelp()}
        </span>
      </label>
      <label className="block space-y-2 text-sm font-bold">
        <span>Confirm password</span>
        <input
          className={inputClass}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
        <label className="flex gap-3">
          <input name="ageConfirmed" type="checkbox" required />
          <span>I confirm that I am at least 16 years old.</span>
        </label>
        <label className="flex gap-3">
          <input name="termsAccepted" type="checkbox" required />
          <span>
            I agree to the{" "}
            <Link className="text-accent underline" href="/terms">
              Terms of Use
            </Link>
            .
          </span>
        </label>
        <label className="flex gap-3">
          <input name="privacyAcknowledged" type="checkbox" required />
          <span>
            I acknowledge the{" "}
            <Link className="text-accent underline" href="/privacy">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} />}
      <button
        className="brand-gradient w-full rounded-full px-6 py-3 font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!configured || !turnstileSiteKey || pending}
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

export function LoginForm({
  configured,
  turnstileSiteKey,
  next,
}: {
  configured: boolean;
  turnstileSiteKey: string | null;
  next: string;
}) {
  const [state, action, pending] = useActionState(login, initialAuthState);

  return (
    <form action={action} className="space-y-5">
      <input name="next" type="hidden" value={next} />
      <Message state={state} />
      <label className="block space-y-2 text-sm font-bold">
        <span>Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          defaultValue={state.fields?.email}
          autoComplete="email"
          required
        />
      </label>
      <label className="block space-y-2 text-sm font-bold">
        <span>Password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} />}
      <button
        className="brand-gradient w-full rounded-full px-6 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!configured || !turnstileSiteKey || pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <Link
        className="block text-center text-sm text-accent hover:underline"
        href="/forgot-password"
      >
        Forgot your password?
      </Link>
    </form>
  );
}

export function ForgotPasswordForm({
  configured,
  turnstileSiteKey,
}: {
  configured: boolean;
  turnstileSiteKey: string | null;
}) {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initialAuthState,
  );

  return (
    <form action={action} className="space-y-5">
      <Message state={state} />
      <label className="block space-y-2 text-sm font-bold">
        <span>Email</span>
        <input
          className={inputClass}
          name="email"
          type="email"
          defaultValue={state.fields?.email}
          autoComplete="email"
          required
        />
      </label>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} />}
      <button
        className="brand-gradient w-full rounded-full px-6 py-3 font-black text-white disabled:opacity-50"
        disabled={!configured || !turnstileSiteKey || pending}
      >
        {pending ? "Sending…" : "Send reset email"}
      </button>
    </form>
  );
}

export function ResetPasswordForm({
  role,
}: {
  role: "user" | "volunteer" | "staff" | "admin";
}) {
  const [state, action, pending] = useActionState(
    updatePassword,
    initialAuthState,
  );

  return (
    <form action={action} className="space-y-5">
      <Message state={state} />
      <p className="text-sm leading-6 text-white/65">{passwordHelp(role)}</p>
      <label className="block space-y-2 text-sm font-bold">
        <span>New password</span>
        <input
          className={inputClass}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={role === "admin" ? 12 : 8}
          required
        />
      </label>
      <label className="block space-y-2 text-sm font-bold">
        <span>Confirm new password</span>
        <input
          className={inputClass}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </label>
      <button
        className="brand-gradient w-full rounded-full px-6 py-3 font-black text-white disabled:opacity-50"
        disabled={pending}
      >
        {pending ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
