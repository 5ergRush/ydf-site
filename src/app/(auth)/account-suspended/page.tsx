import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { festivalInfo } from "@/data/festival";

export const metadata: Metadata = { title: "Account suspended" };

export default function AccountSuspendedPage() {
  return (
    <AuthShell
      eyebrow="Account unavailable"
      title="This account is suspended"
      description={`Contact ${festivalInfo.contactEmail} if you believe this is a mistake or need help accessing your festival information.`}
    >
      <form action={logout}>
        <button className="w-full rounded-full border border-white/15 bg-white/8 px-6 py-3 font-black">
          Sign out
        </button>
      </form>
    </AuthShell>
  );
}
