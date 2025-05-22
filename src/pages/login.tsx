import Head from "next/head";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login – Mealzy</title>
      </Head>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <AuthForm />
      </main>
    </>
  );
}
