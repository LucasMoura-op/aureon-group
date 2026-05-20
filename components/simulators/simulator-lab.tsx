"use client";

import { useMemo, useState } from "react";
import { Calculator, Landmark, Scale } from "lucide-react";
import { simulateConsortium } from "@/lib/domain/consortium";
import { simulateFinancing } from "@/lib/domain/financing";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currency } from "@/lib/utils";

export function SimulatorLab() {
  const [principal, setPrincipal] = useState(900000);
  const [downPayment, setDownPayment] = useState(220000);
  const [termMonths, setTermMonths] = useState(180);
  const [annualInterest, setAnnualInterest] = useState(0.105);
  const [cet, setCet] = useState(0.128);
  const financing = useMemo(() => simulateFinancing({ principal, downPayment, termMonths, annualInterest, cet, system: "SAC" }), [principal, downPayment, termMonths, annualInterest, cet]);
  const consortium = useMemo(() => simulateConsortium({
    letterValue: principal,
    termMonths: 180,
    adminFee: 0.18,
    reserveFund: 0.025,
    insurance: 0.018,
    embeddedBid: 180000,
    ownBid: 90000,
    expectedAwardMonth: 24
  }), [principal]);
  const ownCapitalCost = principal - downPayment;

  return (
    <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros do crédito</CardTitle>
          <CardDescription>Compare SAC, consórcio e capital próprio com foco em custo total e risco de caixa.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <Field label="Valor do imóvel/projeto" value={principal} setValue={setPrincipal} />
          <Field label="Entrada" value={downPayment} setValue={setDownPayment} />
          <Field label="Prazo em meses" value={termMonths} setValue={setTermMonths} />
          <Field label="Juros anual" value={annualInterest} setValue={setAnnualInterest} step="0.001" />
          <Field label="CET anual" value={cet} setValue={setCet} step="0.001" />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <OptionCard
          title="Financiamento SAC"
          icon={Landmark}
          badge="Mais rápido"
          metrics={[
            ["Parcela inicial", currency(financing.firstPayment)],
            ["Parcela final", currency(financing.lastPayment)],
            ["Juros totais", currency(financing.totalInterest)],
            ["Custo total", currency(financing.totalCost)]
          ]}
          traps={financing.traps as string[]}
        />
        <OptionCard
          title="Consórcio"
          icon={Calculator}
          badge="Menos previsível"
          metrics={[
            ["Carta útil", currency(consortium.availableCredit)],
            ["Parcela média", currency(consortium.monthlyPayment)],
            ["Custo total", currency(consortium.totalCost)],
            ["Espera estimada", `${consortium.opportunityCostMonths} meses`]
          ]}
          traps={consortium.traps as string[]}
        />
        <OptionCard
          title="Capital próprio"
          icon={Scale}
          badge="Mais saudável"
          metrics={[
            ["Capital imobilizado", currency(ownCapitalCost)],
            ["Juros evitados", currency(financing.totalInterest)],
            ["Liquidez perdida", currency(ownCapitalCost)],
            ["Risco de caixa", downPayment / principal > 0.35 ? "baixo" : "atenção"]
          ]}
          traps={["Usar caixa demais pode tirar sua margem de segurança para obra, vacância e oportunidades melhores."]}
        />
      </div>
    </div>
  );
}

function Field({ label, value, setValue, step = "1000" }: { label: string; value: number; setValue: (value: number) => void; step?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="number" value={value} step={step} onChange={(event) => setValue(Number(event.target.value))} />
    </div>
  );
}

function OptionCard({ title, icon: Icon, badge, metrics, traps }: { title: string; icon: React.ElementType; badge: string; metrics: [string, string][]; traps: string[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge tone="muted">{badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 rounded-md bg-muted/50 p-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
        <div className="border-t pt-3">
          <p className="text-sm font-medium">Pegadinhas</p>
          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
            {traps.map((trap) => <li key={trap}>{trap}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
