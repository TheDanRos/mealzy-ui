// HouseholdFormAdvanced.tsx – bereinigt und typisiert
import { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";

type MemberFormData = {
  firstName: string;
  lastName: string;
  age: string;
  role: string;
  preferences: string[];
  allergies: string[];
  equipment: string[];
};

export default function HouseholdFormAdvanced() {
  const [formData, setFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    age: "",
    role: "",
    preferences: [],
    allergies: [],
    equipment: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    name: "preferences" | "allergies" | "equipment",
    value: string
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...prev[name], value.trim()],
      }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"
        placeholder="Vorname"
        value={formData.firstName}
        onChange={handleChange}
      />
      <input
        name="lastName"
        placeholder="Nachname"
        value={formData.lastName}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        placeholder="Alter"
        value={formData.age}
        onChange={handleChange}
      />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="">Rolle wählen</option>
        <option value="Elternteil">Elternteil</option>
        <option value="Kind">Kind</option>
      </select>
      <input
        placeholder="Ernährungspräferenz hinzufügen"
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            handleArrayChange("preferences", target.value);
            target.value = "";
          }
        }}
      />
      <input
        placeholder="Allergie hinzufügen"
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            handleArrayChange("allergies", target.value);
            target.value = "";
          }
        }}
      />
      <input
        placeholder="Küchengerät hinzufügen"
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            handleArrayChange("equipment", target.value);
            target.value = "";
          }
        }}
      />
      <button type="submit">Speichern</button>
    </form>
  );
}
