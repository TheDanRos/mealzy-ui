// src/pages/api/household/create.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => req.cookies[key],
        set: (key, value, options) => {
          const cookie = `${key}=${value}; Path=/; HttpOnly; SameSite=Lax`;
          res.setHeader("Set-Cookie", cookie);
        },
        remove: (key) => {
          res.setHeader("Set-Cookie", `${key}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Missing household name" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { error: insertError } = await supabase.from("households").insert({ name });

  if (insertError) {
    console.error("❌ Insert error:", insertError);
    return res.status(500).json({ error: "Insert failed" });
  }

  return res.status(200).json({ message: "Household created" });
}
