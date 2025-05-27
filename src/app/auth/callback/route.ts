import { createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const supabase = createServerClient(cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("[auth/callback] Keine Session – Redirect zu /login");
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", session.user.id)
    .single();

  if (!profile) {
    console.log("[auth/callback] Kein Profil – Redirect zu /onboarding/household");
    return redirect("/onboarding/household");
  }

  if (!profile.household_id) {
    console.log("[auth/callback] Kein Haushalt – Redirect zu /onboarding/household");
    return redirect("/onboarding/household");
  }

  if (!profile.name) {
    console.log("[auth/callback] Kein Name – Redirect zu /onboarding/profile");
    return redirect("/onboarding/profile");
  }

  console.log("[auth/callback] Alles vollständig – Redirect zu /dashboard");
  return redirect("/dashboard");
}