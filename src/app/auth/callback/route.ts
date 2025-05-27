import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/signup");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("household_id, name")
    .eq("id", user.id)
    .single();

  if (!profile?.household_id) {
    return redirect("/onboarding/household");
  }

  if (!profile?.name) {
    return redirect("/onboarding/profile");
  }

  return redirect("/dashboard");
}