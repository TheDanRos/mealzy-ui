import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF9] text-[#2B2B2B] font-sans">
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={40} height={40} />
          <span className="text-xl font-bold tracking-tight">Mealzy</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-[#2B2B2B] hover:underline">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-[#FF715B] text-white px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition"
          >
            Jetzt starten
          </Link>
        </div>
      </header>

      <section className="text-center py-32 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Mehr Zeit. Weniger Stress. <br /> Besser essen.
        </h1>
        <p className="text-lg md:text-xl text-[#2B2B2B] max-w-2xl mx-auto mb-10">
          Mealzy hilft dir, deine Essensplanung zu automatisieren und entspannt durch die Woche zu kommen – ideal für Familien und Vielbeschäftigte.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-[#FF715B] text-white px-8 py-4 text-lg rounded-full font-semibold hover:bg-opacity-90 transition"
        >
          Kostenlos starten
        </Link>
      </section>
    </main>
  );
}
