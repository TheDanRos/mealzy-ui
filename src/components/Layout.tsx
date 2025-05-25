// src/components/Layout.tsx
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF9] text-[#2B2B2B] font-inter">
      {/* Header */}
      <header className="py-4 px-6 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Image src="/images/icon.png" alt="Mealzy Logo" width={32} height={32} />
          <div>
            <h1 className="text-lg font-dm-sans font-bold">Mealzy</h1>
            <p className="text-sm text-[#2B2B2B]">Mehr Zeit. Weniger Stress. Besser essen.</p>
          </div>
        </div>
      </header>

      {/* Inhalt */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-[#FDFBF9] text-center py-8 text-sm text-[#2B2B2B] mt-8">
        <p>© 2025 Mealzy</p>
        <nav className="mt-2 space-x-4">
          <Link href="/faq">FAQ</Link>
          <Link href="/datenschutz">Datenschutz</Link>
          <Link href="/impressum">Impressum</Link>
        </nav>
      </footer>
    </div>
  );
}
