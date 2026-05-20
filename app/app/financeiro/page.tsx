import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/finance/transactions-table";
import { currency } from "@/lib/utils";

export default function FinancePage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Financeiro</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Fluxo de caixa, dívidas e parcelas futuras</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Kpi label="Contas a receber" value={currency(81200)} />
        <Kpi label="Contas a pagar" value={currency(156400)} />
        <Kpi label="Saldo projetado" value={currency(304000)} />
        <Kpi label="Reserva mínima" value={currency(252000)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Movimentações</CardTitle>
          <CardDescription>Tabela avançada com TanStack Table para ordenar, filtrar e expandir depois.</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
