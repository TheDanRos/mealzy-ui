"use client";
import type { NextApiRequest, NextApiResponse } from "next";

import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. SignUp bei Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Signup fehlgeschlagen", { description: error.message });
      setLoading(false);
      return;
    }

    const user = data.user;

    // 2. Haushalts-Eintrag anlegen
    const { error: householdError } = await supabase.from("households").insert({
      name: householdName,
      owner_id: user?.id,
    });

    if (householdError) {
      toast.error("Fehler beim Erstellen des Haushalts", { description: householdError.message });
      setLoading(false);
      return;
    }

    toast.success("Konto erstellt! Bitte E-Mail bestätigen.");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Haushalt anlegen</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Passwort</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="household">Haushaltsname</Label>
          <Input id="household" required value={householdName} onChange={(e) => setHouseholdName(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird erstellt..." : "Konto erstellen"}
        </Button>
      </form>
    </div>
  );
}
