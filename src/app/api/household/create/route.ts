// src/app/api/household/create/route.ts

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies,
    }
  );

  const { name } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "Missing household name" }, { status: 400 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: insertError } = await supabase
    .from("households")
    .insert({ name }, { returning: "minimal" }); // <- keine SELECT-Policy nötig

  if (insertError) {
    console.error("❌ Insert error:", insertError);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  return NextResponse.json({ message: "Household created" });
}
