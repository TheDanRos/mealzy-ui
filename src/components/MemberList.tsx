import { useState } from "react";
import { toast } from "sonner";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function MemberList({ members }: { members: Member[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const generateTasteProfile = async (memberId: string) => {
    setLoadingId(memberId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-taste-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ member_id: memberId }),
        }
      );

      if (!res.ok) throw new Error("Fehler beim Generieren");
      toast.success("Geschmacksprofil erfolgreich generiert!");
    } catch (err) {
      toast.error("Fehler beim Generieren des Profils.");
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ul className="space-y-4">
      {members.map((member) => (
        <li key={member.id} className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <span>
              {member.first_name} {member.last_name}
            </span>
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
              onClick={() => generateTasteProfile(member.id)}
              disabled={loadingId === member.id}
            >
              {loadingId === member.id ? "Lädt..." : "Profil generieren"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
