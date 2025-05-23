// pages/onboarding.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [householdName, setHouseholdName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      alert("Fehler beim Laden des Benutzers. Bitte erneut anmelden.");
      router.push("/login");
      return;
    }

    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({ name: householdName })
      .select()
      .single();

    if (householdError || !household) {
      alert("Fehler beim Erstellen des Haushalts");
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from("members").insert({
      user_id: user.id,
      household_id: household.id,
      first_name: firstName,
      last_name: lastName,
      role: "Owner",
    });

    if (memberError) {
      alert("Fehler beim Verknüpfen des Benutzers");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-graphite p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Willkommen bei Mealzy</h1>
        <p className="text-center">Bitte richte deinen Haushalt ein</p>
        <Input
          placeholder="Haushaltsname"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
        />
        <Input
          placeholder="Vorname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Nachname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Button onClick={handleCreate} disabled={loading} className="w-full bg-coral hover:bg-opacity-90">
          {loading ? "Wird erstellt..." : "Haushalt erstellen"}
        </Button>
      </div>
    </div>
  );
}
