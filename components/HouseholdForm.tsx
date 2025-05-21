import { useState } from "react"

export default function HouseholdForm() {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [members, setMembers] = useState([
    { name: "", age: "", role: "" },
    { name: "", age: "", role: "" },
  ])
  const [preferences, setPreferences] = useState([""])
  const [allergies, setAllergies] = useState([""])
  const [equipment, setEquipment] = useState([""])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://havusmlajpbmxrznabhz.supabase.co/functions/v1/create-household", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhdnVzbWxhanBibXhyem5hYmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjA0NTQsImV4cCI6MjA2MzM5NjQ1NH0.YzgrYEINzHxUU2t4Vyz5SDHCdVaigDdBDuNTx50-cwE",
        },
        body: JSON.stringify({
          owner_id: "a2d3c7b3-d5a0-478d-bb19-a321246862a3",
          name,
          members: members.map((m) => ({ ...m, age: parseInt(m.age || "0") })),
          preferences: preferences.filter(Boolean),
          allergies: allergies.filter(Boolean),
          equipment: equipment.filter(Boolean),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        alert("Haushalt erfolgreich gespeichert! ID: " + data.household_id)
      } else {
        const error = await res.json()
        console.error(error)
        alert("Fehler: " + error.message)
      }
    } catch (e) {
      console.error(e)
      alert("Netzwerkfehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Haushalt anlegen</h2>
      <input
        className="w-full p-2 border rounded"
        placeholder="Haushaltsname"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <h3 className="font-semibold mt-4">Mitglieder</h3>
      {members.map((member, i) => (
        <div key={i} className="grid grid-cols-3 gap-2">
          <input
            className="p-2 border rounded"
            placeholder="Name"
            value={member.name}
            onChange={(e) => {
              const copy = [...members]
              copy[i].name = e.target.value
              setMembers(copy)
            }}
          />
          <input
            className="p-2 border rounded"
            placeholder="Alter"
            type="number"
            value={member.age}
            onChange={(e) => {
              const copy = [...members]
              copy[i].age = e.target.value
              setMembers(copy)
            }}
          />
          <input
            className="p-2 border rounded"
            placeholder="Rolle"
            value={member.role}
            onChange={(e) => {
              const copy = [...members]
              copy[i].role = e.target.value
              setMembers(copy)
            }}
          />
        </div>
      ))}

      <h3 className="font-semibold mt-4">Präferenzen</h3>
      <input
        className="w-full p-2 border rounded"
        placeholder="z. B. vegetarisch"
        value={preferences[0]}
        onChange={(e) => setPreferences([e.target.value])}
      />

      <h3 className="font-semibold mt-4">Allergien</h3>
      <input
        className="w-full p-2 border rounded"
        placeholder="z. B. Gluten"
        value={allergies[0]}
        onChange={(e) => setAllergies([e.target.value])}
      />

      <h3 className="font-semibold mt-4">Küchenausstattung</h3>
      <input
        className="w-full p-2 border rounded"
        placeholder="z. B. Backofen"
        value={equipment[0]}
        onChange={(e) => setEquipment([e.target.value])}
      />

      <button
        onClick={handleSubmit}
        className="bg-coral text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Speichern..." : "Haushalt speichern"}
      </button>
    </div>
  )
}
