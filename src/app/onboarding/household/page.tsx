// src/app/onboarding/household/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function OnboardingHousehold() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkHousehold = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("household_id")
        .eq("id", user?.id)
        .single();

      if (profile?.household_id) {
        router.push("/onboarding/profile");
      }
    };
    checkHousehold();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/household/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Fehler beim Erstellen.");
      setLoading(false);
      return;
    }

    router.push("/onboarding/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Wie soll euer Haushalt heißen?</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="z. B. Familie Müller"
        required
        className="w-full p-2 border rounded-xl"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF715B] text-white py-2 rounded-xl"
      >
        {loading ? "Wird erstellt..." : "Haushalt anlegen"}
      </button>
    </form>
  );
}
