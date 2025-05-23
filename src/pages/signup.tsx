// pages/signup.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, first_name: firstName }),
    });

    if (response.ok) {
      setSuccess(true);
    } else {
      const data = await response.json();
      setError(data.error || "Ein Fehler ist aufgetreten.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={40} height={40} />
          <h1 className="text-2xl font-bold text-[#2B2B2B] mt-2">Mealzy</h1>
          <p className="text-sm text-[#2B2B2B] mt-1">Mehr Zeit. Weniger Stress. Besser essen.</p>
        </div>
        <h2 className="text-xl font-semibold text-[#2B2B2B] mb-4">Registrieren</h2>
        {success ? (
          <p className="text-[#8EE4AF]">Bitte bestätige deine E-Mail-Adresse.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-[#DADADA] rounded-xl"
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-[#DADADA] rounded-xl"
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-[#DADADA] rounded-xl"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#FF715B] text-white py-2 rounded-xl hover:opacity-90 transition"
            >
              Registrieren
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
