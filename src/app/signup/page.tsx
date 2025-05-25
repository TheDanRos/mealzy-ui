// app/signup/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";

export default function SignupPage() {
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
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center px-4 py-12 font-inter text-[#2B2B2B]">
      <div className="flex flex-col items-center mb-6 text-center">
        <Image src="/images/icon.png" alt="Mealzy Logo" width={60} height={60} />
        <h1 className="text-3xl font-bold font-dm-sans mt-2">Mealzy</h1>
        <p className="text-sm mt-1">Mehr Zeit. Weniger Stress. Besser essen.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Registrieren</h2>

        {success ? (
          <p className="text-[#8EE4AF] text-center font-medium">
            ✅ Fast geschafft – bitte bestätige deine E-Mail-Adresse.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-[#DADADA] rounded-xl"
              required
            />
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#DADADA] rounded-xl"
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#DADADA] rounded-xl"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#FF715B] text-white py-3 rounded-xl hover:opacity-90 transition font-semibold"
            >
              Jetzt kostenlos registrieren
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
