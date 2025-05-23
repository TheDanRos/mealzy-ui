import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={64} height={64} />
          <h1 className="text-3xl font-bold text-[#2B2B2B] mt-4">Erstelle deinen Haushalt</h1>
          <p className="text-[#2B2B2B] text-sm text-center mt-2">
            Verwalte Mahlzeiten einfach und gemeinsam – für weniger Stress und mehr Genuss.
          </p>
        </div>

        <form className="bg-white shadow-lg rounded-2xl p-6 space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border border-[#DADADA] focus:outline-none" />
          <input type="password" placeholder="Passwort" className="w-full p-3 rounded-xl border border-[#DADADA] focus:outline-none" />
          <input type="text" placeholder="Vorname" className="w-full p-3 rounded-xl border border-[#DADADA] focus:outline-none" />
          <input type="text" placeholder="Nachname" className="w-full p-3 rounded-xl border border-[#DADADA] focus:outline-none" />
          <input type="text" placeholder="Haushaltsname" className="w-full p-3 rounded-xl border border-[#DADADA] focus:outline-none" />

          <button type="submit" className="w-full bg-[#FF715B] text-white py-3 rounded-xl font-semibold hover:opacity-90">
            Signup
          </button>

          <p className="text-center text-sm text-[#2B2B2B]">
            Schon registriert?{' '}
            <Link href="/login" className="text-[#FF715B] font-medium">Zum Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
