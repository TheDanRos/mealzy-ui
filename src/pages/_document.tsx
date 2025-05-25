import { DM_Sans, Inter } from "next/font/google";
import type { ReactNode } from "react";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = { title: "Mealzy – Besser essen" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${dmSans.variable} ${inter.variable}`}>
      <body className="font-inter bg-[#FDFBF9] text-[#2B2B2B]">
        {children}
      </body>
    </html>
  );
}
