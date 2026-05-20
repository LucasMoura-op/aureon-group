"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Lightbulb, Save } from "lucide-react";
import { buildScenarios, diagnoseProject } from "@/lib/domain/diagnostics";
import type { ProjectInput } from "@/lib/domain/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currency, percent } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(3),
  type: z.string(),
  city: z.string().min(2),
  state: z.string().min(2),
  neighborhood: z.string().min(2),
  purchaseValue: z.coerce.number().min(0),
  constructionCost: z.coerce.number().min(0),
  saleValue: z.coerce.number().min(0),
  monthlyRent: z.coerce.number().min(0),
  termMonths: z.coerce.number().int().min(1),
  ownCapital: z.coerce.number().min(0),
  financedCapital: z.coerce.number().min(0),
  consortiumCapital: z.coerce.number().min(0),
  perceivedRisk: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
});

type FormData = z.infer<typeof schema>;

const defaultValues: FormData = {
  name: "Novo empreendimento",
  type: "CONSTRUCTION",
  city: "Londrina",
  state: "PR",
  neighborhood: "Gleba Palhano",
  purchaseValue: 480000,
  constructionCost: 820000,
  saleValue: 1680000,
  monthlyRent: 9800,
  termMonths: 16,
  ownCapital: 520000,
  financedCapital: 420000,
  consortiumCapital: 0,
  perceivedRisk: "MEDIUM"
};

export function ProjectLab() {
  const [saved, setSaved] = useState(false);
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });
  const values = form.watch();
  const project = values as ProjectInput;
  const diagnostic = useMemo(() => diagnoseProject(project), [project]);
  const scenarios = useMemo(() => buildScenarios(project), [project]);

  async function onSubmit(data: FormData) {
    await fetch("/api/projects/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Novo projeto</CardTitle>
          <CardDescription>Formulário em base mobile-first para alimentar o diagnóstico automático.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome" name="name" register={form.register} />
              <Field label="Tipo" name="type" register={form.register} />
              <Field label="Cidade" name="city" register={form.register} />
              <Field label="Estado" name="state" register={form.register} />
              <Field label="Bairro" name="neighborhood" register={form.register} />
              <div className="space-y-2">
                <Label>Risco percebido</Label>
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("perceivedRisk")}>
                  <option value="LOW">Baixo</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HIGH">Alto</option>
                  <option value="CRITICAL">Crítico</option>
                </select>
              </div>
              <Field label="Compra do lote" name="purchaseValue" type="number" register={form.register} />
              <Field label="Custo de obra" name="constructionCost" type="number" register={form.register} />
              <Field label="Preço de venda" name="saleValue" type="number" register={form.register} />
              <Field label="Aluguel mensal" name="monthlyRent" type="number" register={form.register} />
              <Field label="Prazo meses" name="termMonths" type="number" register={form.register} />
              <Field label="Capital próprio" name="ownCapital" type="number" register={form.register} />
              <Field label="Capital financiado" name="financedCapital" type="number" register={form.register} />
              <Field label="Capital consórcio" name="consortiumCapital" type="number" register={form.register} />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="h-4 w-4" />
              Salvar análise
            </Button>
            {saved ? <p className="text-sm text-success">Diagnóstico enviado para a API e pronto para persistir no banco.</p> : null}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Diagnóstico automático</CardTitle>
              <CardDescription>Nota, veredito, riscos, pegadinhas e próximos passos.</CardDescription>
            </div>
            <Badge tone={diagnostic.score >= 74 ? "success" : diagnostic.score >= 60 ? "warning" : "danger"}>
              {diagnostic.score}/100
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Mini label="Lucro líquido" value={currency(diagnostic.netProfit)} />
              <Mini label="ROI" value={percent(diagnostic.roi)} />
              <Mini label="Payback" value={diagnostic.paybackMonths ? `${diagnostic.paybackMonths} meses` : "sem renda"} />
              <Mini label="Preço mínimo" value={currency(diagnostic.breakEvenPrice)} />
              <Mini label="Aluguel mínimo" value={currency(diagnostic.minimumRent)} />
              <Mini label="Margem segurança" value={percent(diagnostic.safetyMargin)} />
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {diagnostic.verdict}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{diagnostic.recommendation}</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <Insight title="Pegadinhas financeiras" icon={AlertTriangle} items={diagnostic.traps.length ? diagnostic.traps : ["Nenhuma pegadinha crítica detectada com os dados atuais."]} />
              <Insight title="Próximos passos" icon={Lightbulb} items={diagnostic.nextSteps} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cenários recalculados</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {scenarios.map((scenario) => (
              <div key={scenario.name} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{scenario.name}</p>
                <p className="mt-2 text-2xl font-semibold">{scenario.diagnostic.score}</p>
                <p className="text-sm text-muted-foreground">{scenario.diagnostic.verdict}</p>
                <p className="mt-2 text-sm">ROI {percent(scenario.diagnostic.roi)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, name, register, type = "text" }: { label: string; name: keyof FormData; type?: string; register: ReturnType<typeof useForm<FormData>>["register"] }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} {...register(name)} />
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Insight({ title, icon: Icon, items }: { title: string; icon: React.ElementType; items: string[] }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-warning" />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
