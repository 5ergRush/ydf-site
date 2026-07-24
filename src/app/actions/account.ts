"use server";

import { revalidatePath } from "next/cache";
import { writeAudit } from "@/lib/audit";
import type { AccountActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateOwnName(
  _previous: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const auth = await requireUser();
  const admin = createSupabaseAdminClient();
  if (!admin)
    return { status: "error", message: "Account data is unavailable." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  if (
    firstName.length < 1 ||
    firstName.length > 100 ||
    lastName.length < 1 ||
    lastName.length > 100
  ) {
    return {
      status: "error",
      message: "Enter a first and last name of 100 characters or fewer.",
    };
  }

  const oldData = {
    firstName: auth.profile.first_name,
    lastName: auth.profile.last_name,
  };
  const newData = { firstName, lastName };
  const { error } = await admin
    .from("profiles")
    .update({ first_name: firstName, last_name: lastName })
    .eq("id", auth.userId);

  if (error) return { status: "error", message: error.message };

  await writeAudit(admin, {
    actorId: auth.userId,
    targetUserId: auth.userId,
    entityType: "profile",
    entityId: auth.userId,
    action: "name_updated_by_user",
    oldData,
    newData,
  });

  revalidatePath("/account");
  return { status: "success", message: "Your name has been updated." };
}
