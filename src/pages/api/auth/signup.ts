// pages/api/auth/signup.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, first_name } = req.body;

  if (!email || !password || !first_name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies[name],
        set: (name, value, options) => {
          const cookie = `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`;
          res.setHeader("Set-Cookie", cookie);
        },
        remove: (name) => {
          res.setHeader("Set-Cookie", `${name}=; Path=/; Max-Age=0`);
        },
      },
    }
  );

  // 1. SignUp via Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData.user) {
    console.error("❌ Supabase Auth Error:", signUpError);
    return res.status(500).json({ error: signUpError?.message || "Signup failed" });
  }

  console.log("✅ User ID:", signUpData.user.id);

  // Der Household- und Member-Teil wird erst im Onboarding durchgeführt

  return res.status(200).json({ message: "Signup erfolgreich", user: signUpData.user });
}
