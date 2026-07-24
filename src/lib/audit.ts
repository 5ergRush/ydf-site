import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

type AuditInput = {
  actorId: string;
  targetUserId?: string | null;
  entityType: string;
  entityId?: string | null;
  action: string;
  oldData?: unknown;
  newData?: unknown;
  reason?: string | null;
};

export async function writeAudit(admin: SupabaseClient, input: AuditInput) {
  const { error } = await admin.from("audit_log").insert({
    actor_id: input.actorId,
    target_user_id: input.targetUserId ?? null,
    entity_type: input.entityType,
    entity_id: input.entityId ?? null,
    action: input.action,
    old_data: input.oldData ?? null,
    new_data: input.newData ?? null,
    reason: input.reason ?? null,
  });

  if (error) {
    throw new Error(`Could not write audit log: ${error.message}`);
  }
}
