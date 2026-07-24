"use client";

import { useActionState } from "react";
import { updateOwnName } from "@/app/actions/account";
import { initialAccountState } from "@/lib/action-state";

const inputClass =
  "w-full rounded-2xl border border-white/15 bg-near-black/40 px-4 py-3 text-white outline-none focus:border-accent/70";

export function NameForm({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [state, action, pending] = useActionState(
    updateOwnName,
    initialAccountState,
  );

  return (
    <form action={action} className="space-y-4">
      {state.message && (
        <p
          aria-live="polite"
          className={`rounded-xl p-3 text-sm ${
            state.status === "success"
              ? "bg-emerald-300/10 text-emerald-100"
              : "bg-pink-red/10 text-pink-100"
          }`}
        >
          {state.message}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-bold">
          <span>First name</span>
          <input
            className={inputClass}
            name="firstName"
            defaultValue={firstName}
            maxLength={100}
            required
          />
        </label>
        <label className="space-y-2 text-sm font-bold">
          <span>Last name</span>
          <input
            className={inputClass}
            name="lastName"
            defaultValue={lastName}
            maxLength={100}
            required
          />
        </label>
      </div>
      <button
        className="rounded-full border border-accent/40 bg-accent/12 px-5 py-2.5 text-sm font-black text-accent disabled:opacity-50"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save name"}
      </button>
    </form>
  );
}
