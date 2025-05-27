// src/app/api/profile/create/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return NextResponse.json({ error: "Nicht authentifiziert." }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Ungültiger Name." }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ name })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: "Profil konnte nicht aktualisiert werden." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
