import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currency } from "@/lib/utils";

const stages = ["projeto", "fundação", "estrutura", "alvenaria", "elétrica", "hidráulica", "reboco", "piso", "pintura", "acabamento", "entrega"];

export default function ConstructionPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Obras</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Orçamento, etapas, fornecedores e estouro preventivo</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.7fr_0.3fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cronograma físico-financeiro</CardTitle>
            <CardDescription>Controle de avanço, atrasos, custo real e orçamento por etapa.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage, index) => {
              const progress = Math.min(100, Math.max(0, (5 - index) * 20));
              return (
                <div key={stage} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="capitalize font-medium">{stage}</p>
                    <Badge tone={progress === 100 ? "success" : progress > 0 ? "warning" : "muted"}>{progress}%</Badge>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">Orçado: {currency(90000 + index * 12000)}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alertas de obra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg border p-3 text-muted-foreground">Estrutura consumiu 84% do orçamento com 70% de progresso.</p>
            <p className="rounded-lg border p-3 text-muted-foreground">INCC acima do previsto pede renegociação de material.</p>
            <p className="rounded-lg border p-3 text-muted-foreground">Fornecedor de esquadrias sem nota fiscal anexada.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
