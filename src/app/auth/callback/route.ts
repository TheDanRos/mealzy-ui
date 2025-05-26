import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: (key, value, options) => {
          const response = NextResponse.next();
          response.cookies.set({ name: key, value, ...options });
          return response;
        },
        remove: (key) => {
          const response = NextResponse.next();
          response.cookies.set(key, "", { maxAge: -1 });
          return response;
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Weiterleitung zur Onboarding-Seite
  return NextResponse.redirect(new URL("/onboarding/household", request.url));
}
