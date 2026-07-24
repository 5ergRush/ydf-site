import { NextResponse, type NextRequest } from "next/server";
import { requireTeam } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  await requireTeam();
  const { token } = await params;
  const admin = createSupabaseAdminClient();

  if (!/^[a-f0-9]{48}$/i.test(token) || !admin) {
    return NextResponse.redirect(new URL("/admin?qr=invalid", request.url));
  }

  const { data, error } = await admin
    .from("profiles")
    .select("id")
    .eq("qr_token", token.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("QR profile lookup failed", { code: error.code });
    return NextResponse.redirect(
      new URL("/admin?qr=lookup-error", request.url),
    );
  }

  return NextResponse.redirect(
    new URL(
      data ? `/admin/users/${data.id}` : "/admin?qr=not-found",
      request.url,
    ),
  );
}
