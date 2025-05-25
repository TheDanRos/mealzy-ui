// pages/api/household-create.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          Object.entries(req.cookies || {}).map(([name, value]) => ({
            name,
            value,
          })),
        setAll: (cookiesToSet) => {
          res.setHeader(
            "Set-Cookie",
            cookiesToSet.map(({ name, value }) => `${name}=${value}; Path=/; HttpOnly`)
          );
        },
      },
    }
  );

  const { name } = req.body;

  const { error } = await supabase.from("households").insert({ name });

  if (error) {
    console.error("❌ Household creation failed:", error);
    return res.status(500).json({ error: "Failed to create household" });
  }

  return res.status(200).json({ message: "Haushalt erstellt" });
}
