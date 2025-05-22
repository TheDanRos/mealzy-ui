import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HouseholdFormAdvanced() {
  const [members, setMembers] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [role, setRole] = useState("Elternteil");

  // TODO: Dynamisch aus Session oder Kontext holen
  const householdId = "dein-household-id";

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("household_id", householdId);

      if (!error && data) setMembers(data);
    };

    fetchMembers();
  }, []);

  const handleAddMember = async () => {
    if (!firstName || !lastName || !age || !role) {
      alert("Alle Felder müssen ausgefüllt sein.");
      return;
    }

    const { data, error } = await supabase.from("members").insert({
      first_name: firstName,
      last_name: lastName,
      age,
      role,
      household_id: householdId
    });

    if (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Speichern.");
    } else {
      setMembers((prev) => [...prev, ...(data || [])]);
      setFirstName("");
      setLastName("");
      setAge(null);
      setRole("Elternteil");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6">
      <h1 className="text-2xl font-bold">Haushalt verwalten</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Mitglied hinzufügen</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="firstName">Vorname</Label>
            <Input
              id="firstName"
              placeholder="z. B. Daniel"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Nachname</Label>
            <Input
              id="lastName"
              placeholder="z. B. Rossmann"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="age">Alter</Label>
            <Input
              id="age"
              type="number"
              min="0"
              value={age ?? ""}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="role">Rolle</Label>
            <select
              id="role"
              className="w-full border rounded p-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Elternteil</option>
              <option>Kind</option>
            </select>
          </div>
          <div className="col-span-full">
            <Button className="mt-4" onClick={handleAddMember}>
              Mitglied speichern
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Haushaltsmitglieder</h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="border p-4 rounded bg-white shadow-sm flex justify-between items-center"
            >
              <span>
                {m.first_name} {m.last_name} ({m.age}) – {m.role}
              </span>
              <Button variant="outline" size="sm">
                Geschmacksprofil generieren
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
