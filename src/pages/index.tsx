// app/page.tsx – Mealzy Landingpage

import Image from "next/image";
import Link from "next/link";
import { Brain, Users, ShoppingCart } from "lucide-react";

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#FDFBF9] py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Image
            src="/images/mealzy_familie_laptop_zusammen.png"
            alt="Mealzy Familie"
            width={800}
            height={400}
            className="mx-auto rounded-2xl shadow-md mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-dm-sans font-bold text-[#2B2B2B] mb-4">
            Mehr Zeit. Weniger Stress. Besser essen.
          </h1>
          <p className="text-lg text-[#2B2B2B] font-inter mb-6">
            Mealzy automatisiert deine Essensplanung – ideal für Familien.
          </p>
          <Link href="#cta">
            <button className="bg-[#FF715B] hover:bg-[#e65d4a] text-white rounded-full px-6 py-3 text-base transition">
              Kostenlos starten
            </button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[{ icon: Brain, title: 'Automatisierte Planung' }, { icon: Users, title: 'Familienfreundlich' }, { icon: ShoppingCart, title: 'Einkauf per Klick' }].map(({ icon: Icon, title }) => (
            <div key={title} className="p-6 rounded-2xl border border-[#DADADA] shadow-sm">
              <Icon className="mx-auto mb-4 text-[#8EE4AF]" size={32} />
              <p className="font-semibold text-[#2B2B2B]">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Story Flow */}
      <section className="bg-[#FDFBF9] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Image
            src="/images/mealzy_step_flow_story_flat.png"
            alt="So funktioniert Mealzy"
            width={1280}
            height={720}
            className="rounded-2xl shadow-md w-full aspect-video object-cover"
          />
        </div>
      </section>

      {/* Einkaufszettel Feature */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Image
            src="/images/mealzy_einkaufszettel_emoji_flat.png"
            alt="Einkaufszettel"
            width={600}
            height={400}
            className="rounded-xl mx-auto shadow-md mb-6"
          />
          <p className="text-[#2B2B2B] font-inter text-lg">
            Erhalte automatisch strukturierte Einkaufslisten – sortiert nach Kategorien und direkt druckbar.
          </p>
        </div>
      </section>

      {/* Brand Character */}
      <section className="bg-[#FDFBF9] py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <Image
            src="/images/mealzy_smiling_spoon_character.png"
            alt="Smiling Spoon"
            width={128}
            height={128}
            className="w-32 h-32 mx-auto mb-6"
          />
          <h2 className="text-2xl font-dm-sans font-bold text-[#2B2B2B]">
            Mealzy ist dein smarter Küchenhelfer
          </h2>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-white py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-dm-sans font-bold text-[#2B2B2B] mb-4">
            Starte deine Woche stressfrei
          </h2>
          <Link href="/signup">
            <button className="bg-[#FF715B] hover:bg-[#e65d4a] text-white rounded-full px-6 py-3 text-base transition">
              Jetzt kostenlos starten
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FDFBF9] text-center py-8 text-sm text-[#2B2B2B] font-inter">
        <p>© 2025 Mealzy</p>
        <nav className="mt-2 space-x-4">
          <Link href="/faq">FAQ</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/impressum">Impressum</Link>
        </nav>
      </footer>
    </main>
  );
}
