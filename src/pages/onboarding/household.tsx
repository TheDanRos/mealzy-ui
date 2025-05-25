// pages/onboarding/household.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function OnboardingHousehold() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [householdName, setHouseholdName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Du musst angemeldet sein, um fortzufahren.");
      setLoading(false);
      return;
    }

    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({ name: householdName })
      .select()
      .single();

    if (householdError || !household) {
      setError("Haushalt konnte nicht erstellt werden.");
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from("members").insert({
      user_id: user.id,
      household_id: household.id,
      first_name: "", // wird im nächsten Schritt ergänzt
      last_name: "",
      role: "Owner",
    });

    if (memberError) {
      setError("Fehler beim Verknüpfen des Benutzers.");
      setLoading(false);
      return;
    }

    router.push("/onboarding/profile");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-[#2B2B2B] mt-2">Mealzy</h1>
          <p className="text-sm text-[#2B2B2B] mt-1">Wie soll euer Haushalt heißen?</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="z. B. Familie Schneider"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            className="w-full p-2 border border-[#DADADA] rounded-xl"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#FF715B] text-white py-2 rounded-xl hover:opacity-90 transition"
            disabled={loading}
          >
            Haushalt anlegen
          </button>
        </form>
      </div>
    </div>
  );
}
