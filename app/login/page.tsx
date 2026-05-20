import { LoginForm } from "@/components/auth/login-form";
import { AureonLogo } from "@/components/brand/aureon-logo";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <AureonLogo />
          <h1 className="mt-6 text-3xl font-semibold tracking-normal">Entre no centro operacional</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso protegido por Supabase Auth, organizacoes e permissoes por usuario.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
