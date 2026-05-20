import { AlertTriangle, ArrowUpRight, Banknote, Building2, CircleDollarSign, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScenarioChart, WealthChart } from "@/components/dashboard/charts";
import { getExecutiveSnapshot } from "@/lib/demo-data";
import { currency, percent } from "@/lib/utils";

export default function DashboardPage() {
  const snapshot = getExecutiveSnapshot();
  const { metrics } = snapshot;
  const scenarioData = snapshot.scenarios.map((scenario) => ({
    name: scenario.name,
    score: scenario.diagnostic.score,
    roi: Math.round(scenario.diagnostic.roi * 100)
  }));
  const ranking = [...snapshot.diagnostics].sort((a, b) => b.diagnostic.score - a.diagnostic.score);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Dashboard executivo</p>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Decisão patrimonial com margem de segurança</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Visão consolidada de patrimônio, caixa, riscos, oportunidades, dívidas, obras e retorno esperado.
          </p>
        </div>
        <Badge tone={metrics.health.status === "saudável" ? "success" : "warning"}>Saúde financeira: {metrics.health.status}</Badge>
      </section>

      <section className="metric-grid">
        <Metric title="Patrimônio estimado" value={currency(metrics.estimatedWealth)} icon={Building2} />
        <Metric title="Patrimônio líquido" value={currency(metrics.netWorth)} icon={Target} />
        <Metric title="Capital disponível" value={currency(metrics.availableCapital)} icon={Banknote} />
        <Metric title="ROI geral" value={percent(metrics.roi)} icon={TrendingUp} />
        <Metric title="Fluxo de caixa" value={currency(metrics.cashFlow)} icon={CircleDollarSign} tone={metrics.cashFlow >= 0 ? "success" : "danger"} />
        <Metric title="Lucro previsto" value={currency(metrics.projectedProfit)} icon={ArrowUpRight} />
        <Metric title="Dívida total" value={currency(metrics.totalDebt)} icon={ShieldAlert} tone="warning" />
        <Metric title="Alertas críticos" value={String(metrics.criticalAlerts)} icon={AlertTriangle} tone="danger" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Projeção patrimonial</CardTitle>
            <CardDescription>Considera reinvestimento, inflação, dívida e crescimento esperado.</CardDescription>
          </CardHeader>
          <CardContent>
            <WealthChart data={snapshot.wealthProjection} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Motor de cenários</CardTitle>
            <CardDescription>Pessimista, realista e otimista recalculados para o projeto líder.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScenarioChart data={scenarioData} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ranking dos melhores projetos</CardTitle>
            <CardDescription>Ordenado por nota, ROI, margem e exposição a risco.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Veredito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map(({ project, diagnostic }) => (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{diagnostic.score}</TableCell>
                    <TableCell>{percent(diagnostic.roi)}</TableCell>
                    <TableCell><Badge tone={diagnostic.score >= 74 ? "success" : diagnostic.score >= 60 ? "warning" : "danger"}>{diagnostic.verdict}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projetos mais perigosos</CardTitle>
            <CardDescription>Onde o dinheiro pode escapar por dívida, prazo, obra ou liquidez.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ranking.reverse().map(({ project, diagnostic }) => (
              <div key={project.name} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{project.name}</p>
                  <Badge tone={diagnostic.score < 60 ? "danger" : "warning"}>{diagnostic.score}/100</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{diagnostic.mainRisk}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Metric({ title, value, icon: Icon, tone = "default" }: { title: string; value: string; icon: React.ElementType; tone?: "default" | "success" | "warning" | "danger" }) {
  const colors = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-amber-700 bg-warning/15 dark:text-amber-300",
    danger: "text-destructive bg-destructive/10"
  };
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-normal">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${colors[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
