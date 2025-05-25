"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InvitePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHousehold = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("members")
        .select("household_id")
        .eq("user_id", userId)
        .single();

      if (data) setHouseholdId(data.household_id);
    };

    fetchHousehold();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const response = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      setSuccess(true);
      setEmail("");
    } else {
      const data = await response.json();
      setError(data.error || "Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={60} height={60} />
          <h1 className="text-3xl font-bold text-[#2B2B2B] mt-2">Mealzy</h1>
          <p className="text-base text-[#2B2B2B] mt-1">Lade deine Haushaltsmitglieder ein</p>
        </div>

        {success && (
          <p className="text-[#8EE4AF] mb-4">Einladung wurde verschickt!</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-[#DADADA] rounded-xl"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#FF715B] text-white py-2 rounded-xl hover:opacity-90 transition"
          >
            Einladung senden
          </button>
        </form>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 text-sm text-[#2B2B2B] underline"
        >
          Überspringen und zum Dashboard
        </button>
      </div>
    </div>
  );
}
