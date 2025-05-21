import { useState } from "react"
import { toast } from "sonner"

export default function CreateHouseholdFlow() {
  const [step, setStep] = useState<"name" | "self" | "invite">("name")
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [householdId, setHouseholdId] = useState<string | null>(null)
  const [owner, setOwner] = useState({ name: "", age: "", role: "", email: "", preferences: [] as string[], allergies: [] as string[], equipment: [] as string[] })
  const [input, setInput] = useState({ pref: "", allergy: "", equip: "" })
  const [emailInvites, setEmailInvites] = useState<{ name: string, email: string }[]>([])
  const [inviteInput, setInviteInput] = useState({ name: "", email: "" })

  const createHousehold = async () => {
    if (!name) {
      alert("Bitte Haushaltsnamen eingeben.")
      return
    }
    setStep("self")
  }

  const createOwner = async () => {
    if (!owner.name || !owner.age || !owner.role || !owner.email) {
      alert("Bitte alle Felder ausfüllen.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("https://havusmlajpbmxrznabhz.supabase.co/functions/v1/create-household", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          owner_id: "a2d3c7b3-d5a0-478d-bb19-a321246862a3",
          name,
          members: [{
            name: owner.name,
            age: parseInt(owner.age || "0"),
            role: owner.role,
            email: owner.email,
            preferences: owner.preferences,
            allergies: owner.allergies
          }],
          equipment: owner.equipment
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setHouseholdId(data.household_id)
        setStep("invite")
      } else {
        const err = await res.json()
        alert("Fehler: " + err.message)
      }
    } catch (e) {
      alert("Netzwerkfehler")
    } finally {
      setLoading(false)
    }
  }

  const addValue = (field: "preferences" | "allergies" | "equipment", value: string) => {
    if (!value) return
    setOwner({ ...owner, [field]: [...owner[field], value] })
    setInput({ ...input, [field === "preferences" ? "pref" : field === "allergies" ? "allergy" : "equip"]: "" })
  }

  const sendInviteEmail = async (email: string, household_id: string) => {
    const res = await fetch("https://havusmlajpbmxrznabhz.supabase.co/functions/v1/send-invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, household_id })
    })
    if (res.ok) toast.success("Einladung gesendet an " + email)
    else toast.error("Einladung fehlgeschlagen")
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">Haushalt anlegen</h2>

      {step === "name" && (
        <div className="space-y-4 animate-fade-in">
          <input
            className="w-full p-2 border rounded"
            placeholder="Haushaltsname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={createHousehold}
            className="bg-coral text-white px-4 py-2 rounded"
          >
            Weiter
          </button>
        </div>
      )}

      {step === "self" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-semibold">Daten zur eigenen Person</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" placeholder="Dein Name" value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} />
            <input className="p-2 border rounded" placeholder="E-Mail-Adresse" value={owner.email} onChange={(e) => setOwner({ ...owner, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" placeholder="Alter" type="number" value={owner.age} onChange={(e) => setOwner({ ...owner, age: e.target.value })} />
            <input className="p-2 border rounded" placeholder="Rolle (z. B. Papa)" value={owner.role} onChange={(e) => setOwner({ ...owner, role: e.target.value })} />
          </div>

          {["preferences", "allergies", "equipment"].map((field) => (
            <div key={field}>
              <h4 className="font-semibold mt-4">
                {field === "preferences" ? "Ernährungspräferenzen" : field === "allergies" ? "Allergien" : "Küchengeräte"}
              </h4>
              <div className="flex gap-2">
                <input
                  className="p-2 border rounded w-full"
                  placeholder={field === "preferences" ? "z. B. vegetarisch" : field === "allergies" ? "z. B. Laktose" : "z. B. Mikrowelle"}
                  value={field === "preferences" ? input.pref : field === "allergies" ? input.allergy : input.equip}
                  onChange={(e) => setInput({ ...input, [field === "preferences" ? "pref" : field === "allergies" ? "allergy" : "equip"]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addValue(field as any, input[field === "preferences" ? "pref" : field === "allergies" ? "allergy" : "equip"])
                    }
                  }}
                />
                <button onClick={() => addValue(field as any, input[field === "preferences" ? "pref" : field === "allergies" ? "allergy" : "equip"])} className="bg-coral text-white px-3 py-1 rounded">+</button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {owner[field].map((val: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                    {val} <button onClick={() => setOwner({ ...owner, [field]: owner[field].filter((_: string, j: number) => j !== i) })}>×</button>
                  </span>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={createOwner}
            disabled={loading}
            className="bg-coral text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Speichern..." : "Mich anlegen und fortfahren"}
          </button>
        </div>
      )}

      {step === "invite" && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-semibold">{name} – Mitglieder einladen</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="p-2 border rounded" placeholder="Vorname" value={inviteInput.name} onChange={(e) => setInviteInput({ ...inviteInput, name: e.target.value })} />
            <input className="p-2 border rounded" placeholder="E-Mail-Adresse" value={inviteInput.email} onChange={(e) => setInviteInput({ ...inviteInput, email: e.target.value })} onKeyDown={async (e) => {
              if (e.key === "Enter" && householdId && inviteInput.email.includes("@") && inviteInput.name) {
                setEmailInvites([...emailInvites, inviteInput])
                await sendInviteEmail(inviteInput.email, householdId)
                setInviteInput({ name: "", email: "" })
              }
            }} />
          </div>
          <button className="bg-coral text-white px-3 py-1 rounded" onClick={async () => {
            if (!inviteInput.email.includes("@") || !inviteInput.name || !householdId) return
            setEmailInvites([...emailInvites, inviteInput])
            await sendInviteEmail(inviteInput.email, householdId)
            setInviteInput({ name: "", email: "" })
          }}>
            + Person einladen
          </button>
          <ul className="list-disc pl-6">
            {emailInvites.map((e, i) => (
              <li key={i}>{e.name} ({e.email})</li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">Diese Personen erhalten eine Einladung zur Plattform.</p>
        </div>
      )}
    </div>
  )
}
