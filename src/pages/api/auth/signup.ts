// Next.js API route simport type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, first_name, last_name, household_name } = req.body;

  // 1. User registrieren
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return res.status(400).json({ error: authError?.message });
  }

  const user_id = authData.user.id;

  // 2. Haushalt anlegen
  const { data: hhData, error: hhError } = await supabase
    .from("households")
    .insert({ name: household_name, owner_id: user_id })
    .select()
    .single();

  if (hhError || !hhData) {
    return res.status(400).json({ error: hhError?.message });
  }

  // 3. Mitglied anlegen
  const { error: memberError } = await supabase.from("members").insert({
    user_id,
    household_id: hhData.id,
    first_name,
    last_name,
    role: "owner",
  });

  if (memberError) {
    return res.status(400).json({ error: memberError.message });
  }

  return res.status(200).json({ success: true });
}
