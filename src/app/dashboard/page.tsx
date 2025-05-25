"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [household, setHousehold] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("*, households(*)")
        .eq("user_id", user.id)
        .single();

      if (memberError || !memberData) {
        console.error("Failed to load member data", memberError);
        return;
      }

      setHousehold(memberData.households);

      const { data: membersList, error: membersError } = await supabase
        .from("members")
        .select("first_name, last_name, user_id")
        .eq("household_id", memberData.household_id);

      if (membersError) {
        console.error("Failed to load members", membersError);
      } else {
        setMembers(membersList);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-10">Lade Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF9] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/images/icon.png" alt="Mealzy Icon" width={40} height={40} />
          <h1 className="text-2xl font-bold text-[#2B2B2B]">
            Haushalt: {household?.name || "Unbenannt"}
          </h1>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#2B2B2B] mb-2">Mitglieder</h2>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.user_id} className="p-2 border border-[#DADADA] rounded-xl">
                {m.first_name} {m.last_name || "(Name fehlt)"} – Status: (Demo)
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[#2B2B2B] mb-2">Geschmacksprofile</h2>
          <p className="text-sm text-[#2B2B2B]">(Feature bald verfügbar)</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[#2B2B2B] mb-2">Einkaufsliste</h2>
          <p className="text-sm text-[#2B2B2B]">(Feature bald verfügbar)</p>
        </section>
      </div>
    </div>
  );
}
