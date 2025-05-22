import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, first_name, last_name } = req.body;

  // 1. Sign-Up
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return res.status(400).json({ error: authError?.message });
  }

  const user_id = authData.user.id;

  // 2. Einladung suchen
  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("email", email)
    .single();

  if (inviteError || !invite) {
    return res.status(404).json({ error: "Keine Einladung gefunden" });
  }

  // 3. Mitglied anlegen
  const { error: memberError } = await supabase.from("members").insert({
    user_id,
    household_id: invite.household_id,
    first_name,
    last_name,
    role: "member",
  });

  if (memberError) {
    return res.status(400).json({ error: memberError.message });
  }

  // 4. Einladung löschen
  await supabase.from("invites").delete().eq("email", email);

  return res.status(200).json({ success: true });
}
