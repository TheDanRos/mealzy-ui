// pages/api/auth/signup.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📩 Signup-Request erhalten", req.body);

  if (req.method !== "POST") return res.status(405).end();

  const { email, password, first_name, last_name, household_name } = req.body;

  if (!email || !password || !first_name || !last_name || !household_name) {
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

  // Step 1: Benutzer anlegen
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("✅ Auth Antwort:", signUpData, signUpError);

  if (signUpError || !signUpData?.user) {
    return res.status(500).json({ error: signUpError?.message || "Signup failed" });
  }

  const user_id = signUpData.user.id;

  // Step 2: Household anlegen
  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({ name: household_name })
    .select()
    .single();

  console.log("🏠 Household Antwort:", household, householdError);

  if (householdError || !household) {
    return res.status(500).json({ error: "Household creation failed" });
  }

  // Step 3: Verknüpfen
  const { error: memberError } = await supabase.from("members").insert({
    user_id,
    household_id: household.id,
    first_name,
    last_name,
    role: "Owner",
  });

  console.log("👤 Member Insert Antwort:", memberError);

  if (memberError) {
    return res.status(500).json({ error: "Failed to link user to household" });
  }

  return res.status(200).json({ message: "Signup erfolgreich", user: signUpData.user });
}
