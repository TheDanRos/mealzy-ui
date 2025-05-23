import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createSupabaseServerClient() {
  const cookieStore = cookies(); // KEIN await hier nötig – nur im API-Kontext!
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(), // ← KEIN await nötig, weil cookies() in Middleware/Server-Komponenten synchron ist
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name) => cookieStore.set(name, "", { maxAge: -1 }),
      },
    }
  );
}
