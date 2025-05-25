"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login fehlgeschlagen", { description: error.message });
    } else {
      toast.success("Login erfolgreich");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Passwort</Label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Wird geprüft..." : "Einloggen"}
        </Button>
      </form>
    </div>
  );
}
