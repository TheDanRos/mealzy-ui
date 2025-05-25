// pages/onboarding/profile.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function OnboardingProfile() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Fehler beim Abrufen des Benutzers.");
      setLoading(false);
      return;
    }

    const { data: household } = await supabase
      .from("members")
      .select("household_id")
      .eq("user_id", user.id)
      .single();

    const { error: insertError } = await supabase.from("members").upsert({
      user_id: user.id,
      household_id: household?.household_id,
      first_name: firstName,
      last_name: lastName,
      age: parseInt(age, 10),
      role: "Owner",
    });

    if (insertError) {
      setError("Fehler beim Speichern der Profildaten.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-[#2B2B2B]">Dein Profil</h1>

        <input
          type="text"
          placeholder="Vorname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-2 border border-[#DADADA] rounded-xl"
        />

        <input
          type="text"
          placeholder="Nachname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-2 border border-[#DADADA] rounded-xl"
        />

        <input
          type="number"
          placeholder="Alter"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 border border-[#DADADA] rounded-xl"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF715B] text-white py-2 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Speichern..." : "Weiter"}
        </button>
      </form>
    </div>
  );
}
