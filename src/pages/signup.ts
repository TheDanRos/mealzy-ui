import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, first_name, last_name, household_name } = req.body;

  if (!email || !password || !first_name || !last_name || !household_name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const supabase = createServerClient({ req, res });

  // 1. User anlegen
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !signUpData.user) {
    return res.status(500).json({ error: signUpError?.message || "Signup failed" });
  }

  const user_id = signUpData.user.id;

  // 2. Household anlegen
  const { data: household, error: householdError } = await supabase
    .from("households")
    .insert({ name: household_name })
    .select()
    .single();

  if (householdError || !household) {
    return res.status(500).json({ error: "Household creation failed" });
  }

  // 3. Mitglied verknüpfen
  const { error: memberError } = await supabase.from("members").insert({
    user_id,
    household_id: household.id,
    first_name,
    last_name,
    role: "Owner",
  });

  if (memberError) {
    return res.status(500).json({ error: "Failed to link user to household" });
  }

  return res.status(200).json({ message: "Signup erfolgreich", user: signUpData.user });
}
