// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) => {
          // Du kannst hier `options` für Sicherheit weiter anpassen (z. B. maxAge, secure, etc.)
          document.cookie = `${name}=${value}; Path=/; HttpOnly`;
        },
        remove: (name: string) => {
          document.cookie = `${name}=; Path=/; HttpOnly; Max-Age=0`;
        },
      },
    }
  );
}
