// src/pages/invite.tsx
import { useState } from "react";
import Head from "next/head";

export default function InvitePage() {
  const [email, setEmail] = useState("");
  const [householdId, setHouseholdId] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(
      "https://havusmlajpbmxrznabhz.supabase.co/functions/v1/send-invite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, household_id: householdId }),
      }
    );

    if (res.ok) {
      alert("Einladung gesendet!");
      setEmail("");
    } else {
      alert("Fehler beim Senden der Einladung.");
    }
  };

  return (
    <>
      <Head>
        <title>Haushaltsmitglied einladen</title>
      </Head>
      <main className="p-4 max-w-xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Haushaltsmitglied einladen</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Haushalts-ID"
            value={householdId}
            onChange={(e) => setHouseholdId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Einladung senden
          </button>
        </form>
      </main>
    </>
  );
}
