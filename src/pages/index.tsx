import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#FDFBF9] text-[#2B2B2B]">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Mealzy Logo" width={40} height={40} />
          <span className="font-bold text-xl">Mealzy</span>
        </div>
        <Link
          href="/signup"
          className="bg-[#FF716B] text-white px-4 py-2 rounded-xl hover:opacity-90"
        >
          Jetzt starten
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold max-w-xl leading-tight">
          Mehr Zeit. Weniger Stress. <br /> Besser essen.
        </h1>
        <p className="mt-4 max-w-md text-lg">
          Mealzy hilft Familien, ihre Mahlzeiten einfach zu planen – automatisch und stressfrei.
        </p>
        <Link
          href="/signup"
          className="mt-6 bg-[#8EE4AF] text-[#2B2B2B] px-6 py-3 rounded-full font-semibold hover:opacity-90"
        >
          Kostenlos loslegen
        </Link>
      </section>

      {/* Screenshot */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/images/app-screenshot.png"
            alt="Mealzy App Screenshot"
            width={1200}
            height={800}
            className="rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-[#2B2B2B]">
        &copy; {new Date().getFullYear()} Mealzy – Alle Rechte vorbehalten.
      </footer>
    </main>
  );
}
