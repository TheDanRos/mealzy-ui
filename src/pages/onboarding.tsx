// pages/onboarding.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Onboarding() {
  const router = useRouter();
  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/household/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: householdName }),
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      const data = await response.json();
      setError(data.error || "Fehler beim Erstellen des Haushalts");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-[#2B2B2B] mt-2">Mealzy</h1>
          <p className="text-sm text-[#2B2B2B] mt-1">Haushalt anlegen und loslegen</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Haushaltsname"
            value={householdName}
            onChange={(e) => setHouseholdName(e.target.value)}
            className="w-full p-2 border border-[#DADADA] rounded-xl"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF715B] text-white py-2 rounded-xl hover:opacity-90 transition"
          >
            {loading ? "Wird erstellt..." : "Haushalt anlegen"}
          </button>
        </form>
      </div>
    </div>
  );
}
