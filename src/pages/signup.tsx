import type { NextApiRequest, NextApiResponse } from "next";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase"; // optional: deine DB-Typen

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, first_name, last_name, household_name } = req.body;

  if (!email || !password || !first_name || !last_name || !household_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supabase = createServerClient<Database>({ req, res });

  // 1. User erstellen
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name,
        last_name
      }
    }
  });

  if (signUpError || !signUpData.user) {
    return res.status(500).json({ error: signUpError?.message || "User creation failed" });
  }

  const userId = signUpData.user.id;

  // 2. Household anlegen
  const { data: householdData, error: householdError } = await supabase
    .from("households")
    .insert({ name: household_name })
    .select()
    .single();

  if (householdError || !householdData) {
    return res.status(500).json({ error: householdError?.message || "Household creation failed" });
  }

  // 3. Mitglied anlegen
  const { error: memberError } = await supabase.from("members").insert({
    user_id: userId,
    household_id: householdData.id,
    first_name,
    last_name,
    role: "Elternteil"
  });

  if (memberError) {
    return res.status(500).json({ error: memberError.message });
  }

  return res.status(200).json({ message: "Signup successful" });
}
