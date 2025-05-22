import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  role: string;
}

export default function HouseholdFormAdvanced() {
  const [members, setMembers] = useState<Member[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState("Elternteil");
  const householdId = "demo-household-id"; // TODO: dynamisch setzen

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*").eq("household_id", householdId);
    if (!error && data) setMembers(data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const saveMember = async () => {
    if (!firstName || !lastName || !age) {
      toast.error("Bitte alle Felder ausfüllen");
      return;
    }
    const { error } = await supabase.from("members").insert({
      first_name: firstName,
      last_name: lastName,
      age: parseInt(age),
      role,
      household_id: householdId
    });
    if (!error) {
      toast.success("Mitglied gespeichert");
      setFirstName("");
      setLastName("");
      setAge("");
      setRole("Elternteil");
      fetchMembers();
    } else {
      toast.error("Fehler beim Speichern");
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
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="z. B. Daniel" />
          </div>
          <div>
            <Label htmlFor="lastName">Nachname</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="z. B. Rossmann" />
          </div>
          <div>
            <Label htmlFor="age">Alter</Label>
            <Input id="age" type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="role">Rolle</Label>
            <select id="role" className="w-full border rounded p-2" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Elternteil</option>
              <option>Kind</option>
            </select>
          </div>
          <div className="col-span-full">
            <Button className="mt-4" onClick={saveMember}>Mitglied speichern</Button>
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
