"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/app");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login obrigatório</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        {message ? <p className="text-sm text-destructive">{message}</p> : null}
        <Button className="w-full" onClick={submit}>Entrar</Button>
        <p className="text-xs text-muted-foreground">
          Em desenvolvimento sem `.env`, o botão abre o modo demonstração.
        </p>
      </CardContent>
    </Card>
  );
}
