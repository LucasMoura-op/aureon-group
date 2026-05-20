import { AureonLogo } from "@/components/brand/aureon-logo";

export function BrandSignature() {
  return (
    <div className="rounded-lg border bg-card p-4">
      <AureonLogo />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Assinatura proprietária para decisões de patrimônio, capital, risco e execução.
      </p>
    </div>
  );
}
