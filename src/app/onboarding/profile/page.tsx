// src/app/onboarding/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/profile/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || "Profil konnte nicht erstellt werden.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Wie heißt du?</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="z. B. Daniel"
        required
        className="w-full p-2 border rounded-xl"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF715B] text-white py-2 rounded-xl"
      >
        {loading ? "Speichern..." : "Profil anlegen"}
      </button>
    </form>
  );
}
