"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
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
            <button
              type="submit"
              className="w-full bg-[#2B2B2B] text-white p-3 rounded-xl hover:bg-[#1f1f1f] transition"
            >
              Registrieren
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}