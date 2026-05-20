"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [loadingAction, setLoadingAction] = useState<"login" | "signup" | null>(null);

  async function login() {
    setMessage(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/app");
      return;
    }

    if (loginPassword.length < 6) {
      showError("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    setLoadingAction("login");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    });
    setLoadingAction(null);

    if (error) {
      showError(error.message);
      return;
    }

    router.push("/app");
    router.refresh();
  }

  async function signup() {
    setMessage(null);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      router.push("/app");
      return;
    }

    if (signupPassword.length < 6) {
      showError("Use uma senha com pelo menos 6 caracteres.");
      return;
    }

    if (signupPassword !== signupConfirm) {
      showError("As senhas nao conferem.");
      return;
    }

    setLoadingAction("signup");
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          name: signupName
        },
        emailRedirectTo:
          typeof window !== "undefined" ? `${window.location.origin}/app` : undefined
      }
    });
    setLoadingAction(null);

    if (error) {
      showError(error.message);
      return;
    }

    if (data.session) {
      router.push("/app");
      router.refresh();
      return;
    }

    showSuccess("Cadastro criado. Verifique seu e-mail para confirmar o acesso.");
  }

  function showError(text: string) {
    setMessageType("error");
    setMessage(text);
  }

  function showSuccess(text: string) {
    setMessageType("success");
    setMessage(text);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Acesso seguro</CardTitle>
          <CardDescription>Entre com sua conta AUREON GROUP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Senha</Label>
            <Input
              id="login-password"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />
          </div>
          <Button className="w-full" onClick={login} disabled={loadingAction !== null}>
            {loadingAction === "login" ? "Entrando..." : "Entrar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Cadastre-se para acessar o centro operacional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Nome</Label>
            <Input
              id="signup-name"
              type="text"
              value={signupName}
              onChange={(event) => setSignupName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">E-mail</Label>
            <Input
              id="signup-email"
              type="email"
              value={signupEmail}
              onChange={(event) => setSignupEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Senha</Label>
            <Input
              id="signup-password"
              type="password"
              value={signupPassword}
              onChange={(event) => setSignupPassword(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm">Confirmar senha</Label>
            <Input
              id="signup-confirm"
              type="password"
              value={signupConfirm}
              onChange={(event) => setSignupConfirm(event.target.value)}
            />
          </div>
          <Button className="w-full" onClick={signup} disabled={loadingAction !== null}>
            {loadingAction === "signup" ? "Criando conta..." : "Cadastrar"}
          </Button>
        </CardContent>
      </Card>

      {message ? (
        <p className={cn("text-sm", messageType === "success" ? "text-success" : "text-destructive")}>
          {message}
        </p>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Senhas e sessoes sao gerenciadas pelo Supabase Auth. Em desenvolvimento sem `.env`, o acesso abre o modo demonstracao.
      </p>
    </div>
  );
}
