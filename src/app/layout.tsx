// src/app/layout.tsx

import "./globals.css";
import { DM_Sans, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = { title: "Mealzy – Besser essen" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="font-inter bg-[#FDFBF9] text-[#2B2B2B]">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/icon.png" alt="Mealzy Logo" width={48} height={48} />
            <span className="text-2xl font-dm-sans font-bold">Mealzy</span>
          </div>
          <nav className="text-base space-x-4">
            <Link href="/signup">
              <button className="bg-[#FF715B] text-white px-4 py-2 rounded-full hover:bg-[#e65d4a] transition">
                Kostenlos starten
              </button>
            </Link>
            <Link href="/login" className="text-[#2B2B2B] hover:underline">
              Login
            </Link>
          </nav>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="bg-[#FDFBF9] text-center py-8 text-sm text-[#2B2B2B] font-inter">
          <p>© 2025 Mealzy</p>
          <nav className="mt-2 space-x-4">
            <Link href="/faq">FAQ</Link>
            <Link href="/datenschutz">Datenschutz</Link>
            <Link href="/impressum">Impressum</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}
