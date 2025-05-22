import Head from "next/head";
import HouseholdFormAdvanced from "@/components/HouseholdFormAdvanced";
import MemberList from "@/components/MemberList";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase.from("members").select("*");
      if (error) console.error("Fehler beim Laden:", error);
      else setMembers(data);
    };
    fetchMembers();
  }, []);

  return (
    <>
      <Head>
        <title>Haushalt anlegen</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-8 space-y-10">
        <HouseholdFormAdvanced />
        <div>
          <h2 className="text-xl font-semibold mb-2">Haushaltsmitglieder</h2>
          <MemberList members={members} />
        </div>
      </main>
    </>
  );
}
