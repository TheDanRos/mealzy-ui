// src/app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => cookieStore, // ✅ direkt übergeben
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(new URL("/onboarding/household", request.url));
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
