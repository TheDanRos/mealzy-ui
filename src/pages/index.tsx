import Head from "next/head"
import HouseholdFormAdvanced from "../../components/HouseholdFormAdvanced"


export default function Home() {
  return (
    <>
      <Head>
        <title>Haushalt anlegen</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-8">
        <HouseholdFormAdvanced />
      </main>
    </>
  )
}
