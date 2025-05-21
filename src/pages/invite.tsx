import { useRouter } from "next/router"
import { useState, useEffect } from "react"

export default function InvitePage() {
  const router = useRouter()
  const { household_id } = router.query

  const [member, setMember] = useState({
    name: "",
    email: "",
    age: "",
    role: "",
    preferences: [] as string[],
    allergies: [] as string[]
  })
  const [input, setInput] = useState({ pref: "", allergy: "" })
  const [submitted, setSubmitted] = useState(false)

  const addValue = (field: "preferences" | "allergies", value: string) => {
    if (!value) return
    setMember({ ...member, [field]: [...member[field], value] })
    setInput({ ...input, [field === "preferences" ? "pref" : "allergy"]: "" })
  }

  const submit = async () => {
    if (!household_id || !member.name || !member.email) {
      alert("Bitte alle Pflichtfelder ausfüllen.")
      return
    }
    const res = await fetch("https://havusmlajpbmxrznabhz.supabase.co/functions/v1/add-member", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        household_id,
        ...member,
        age: parseInt(member.age || "0")
      })
    })

    if (res.ok) {
      setSubmitted(true)
    } else {
      const err = await res.json()
      alert("Fehler: " + err.message)
    }
  }

  if (submitted) {
    return <div className="p-6 text-center">✅ Du wurdest erfolgreich hinzugefügt!</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Beitritt zum Haushalt</h2>

      <input className="p-2 border rounded w-full" placeholder="Name" value={member.name} onChange={(e) => setMember({ ...member, name: e.target.value })} />
      <input className="p-2 border rounded w-full" placeholder="E-Mail" value={member.email} onChange={(e) => setMember({ ...member, email: e.target.value })} />
      <input className="p-2 border rounded w-full" placeholder="Alter" type="number" value={member.age} onChange={(e) => setMember({ ...member, age: e.target.value })} />
      <input className="p-2 border rounded w-full" placeholder="Rolle (z. B. Papa)" value={member.role} onChange={(e) => setMember({ ...member, role: e.target.value })} />

      {["preferences", "allergies"].map((field) => (
        <div key={field}>
          <h4 className="font-semibold mt-4">{field === "preferences" ? "Ernährungspräferenzen" : "Allergien"}</h4>
          <div className="flex gap-2">
            <input
              className="p-2 border rounded w-full"
              placeholder={field === "preferences" ? "z. B. vegetarisch" : "z. B. Laktose"}
              value={field === "preferences" ? input.pref : input.allergy}
              onChange={(e) => setInput({ ...input, [field === "preferences" ? "pref" : "allergy"]: e.target.value })}
            />
            <button onClick={() => addValue(field as any, input[field === "preferences" ? "pref" : "allergy"])} className="bg-coral text-white px-3 py-1 rounded">+</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {member[field].map((val, i) => (
              <span key={i} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                {val} <button onClick={() => setMember({ ...member, [field]: member[field].filter((_, j) => j !== i) })}>×</button>
              </span>
            ))}
          </div>
        </div>
      ))}

      <button className="bg-coral text-white px-4 py-2 rounded" onClick={submit}>Beitreten</button>
    </div>
  )
}
