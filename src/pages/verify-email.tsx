import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg">
        <CheckCircle className="mx-auto text-coral" size={48} />
        <h1 className="text-2xl font-bold text-graphite mt-4 mb-2 font-headline">
          Fast geschafft!
        </h1>
        <p className="text-base text-graphite font-body mb-6">
          Bitte bestätige deine E-Mail-Adresse. Schau in dein Postfach (auch im Spam-Ordner) und klicke auf den Link. Danach kannst du dein Profil und deinen Haushalt anlegen.
        </p>
        <p className="text-sm text-soft-gray mb-6">
          Nach der Bestätigung wirst du zur Onboarding-Seite weitergeleitet.
        </p>
        <Link href="/">
          <span className="inline-block px-4 py-2 bg-coral text-white rounded-xl text-sm font-medium">
            Zur Startseite
          </span>
        </Link>
      </div>
    </div>
  );
}
