import { SimulatorLab } from "@/components/simulators/simulator-lab";

export default function SimulatorsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Simuladores</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Financiamento, consórcio e alternativas de capital</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Calcule SAC, PRICE, CET, custo total, risco de demora, liquidez perdida e comparação com capital próprio.
        </p>
      </div>
      <SimulatorLab />
    </div>
  );
}
