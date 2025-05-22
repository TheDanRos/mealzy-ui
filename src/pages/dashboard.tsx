import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [household, setHousehold] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: hh } = await supabase
          .from("households")
          .select("*")
          .eq("owner_id", user.id)
          .single();
        setHousehold(hh);

        const { data: m } = await supabase
          .from("members")
          .select("*")
          .eq("household_id", hh.id);
        setMembers(m || []);
      }
    };
    loadUser();
  }, []);

  const sendInvite = async () => {
    const res = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, household_id: household.id }),
    });

    if (res.ok) {
      toast.success("Einladung verschickt");
      setEmail("");
    } else {
      toast.error("Fehler beim Versenden");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dein Haushalt</h1>

      {household && (
        <div className="p-4 border rounded bg-white shadow-sm">
          <p className="text-lg font-semibold">🏠 {household.name}</p>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6">Haushaltsmitglieder</h2>
      <ul className="space-y-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="p-4 border rounded bg-white shadow-sm flex justify-between items-center"
          >
            <span>
              {m.first_name} {m.last_name} ({m.age})
            </span>
            <Button size="sm" onClick={() => toast.info("TODO: Geschmacksprofil")}>
              Profil neu generieren
            </Button>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Mitglied einladen</h3>
        <div className="flex gap-2 items-end">
          <Input
            type="email"
            placeholder="email@getmealzy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={sendInvite}>Einladung senden</Button>
        </div>
      </div>
    </div>
  );
}
