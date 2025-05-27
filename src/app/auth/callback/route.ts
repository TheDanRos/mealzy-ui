// src/app/auth/callback/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, household_id, name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.redirect(new URL("/onboarding/household", request.url));
  }

  if (!profile.household_id) {
    return NextResponse.redirect(new URL("/onboarding/household", request.url));
  }

  if (!profile.name) {
    return NextResponse.redirect(new URL("/onboarding/profile", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
