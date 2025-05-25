"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function OnboardingHousehold() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [householdName, setHouseholdName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optional: Redirect if already has household
    const checkAuth = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) {
        router.push("/login"); // nicht eingeloggt? → Login
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/household/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: householdName }),
      credentials: "include", // wichtig für Supabase Auth!
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result?.error || "Haushalt konnte nicht erstellt werden.");
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
            {loading ? "Wird erstellt..." : "Haushalt anlegen"}
          </button>
        </form>
      </div>
    </div>
  );
}
