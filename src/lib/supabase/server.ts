// src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import type { NextApiRequest, NextApiResponse } from 'next';

// For API routes (req, res based)
export function createSupabaseApiClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies[name],
        set: (name, value, options) => {
          res.setHeader(
            'Set-Cookie',
            `${name}=${value}; Path=/; HttpOnly`
          );
        },
        remove: (name) => {
          res.setHeader(
            'Set-Cookie',
            `${name}=; Path=/; Max-Age=0; HttpOnly`
          );
        },
      },
    }
  );
}

// For Middleware or Server Components (no req/res, use next/headers)
export function createSupabaseMiddlewareClient() {
  const cookieStore = nextCookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );
}
