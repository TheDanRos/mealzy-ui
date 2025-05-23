import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    household_name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup erfolgreich!");
    } else {
      alert(`Fehler: ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input name="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Passwort" required />
      <input name="first_name" onChange={handleChange} placeholder="Vorname" required />
      <input name="last_name" onChange={handleChange} placeholder="Nachname" required />
      <input name="household_name" onChange={handleChange} placeholder="Haushaltsname" required />
      <button type="submit">Signup</button>
    </form>
  );
}
