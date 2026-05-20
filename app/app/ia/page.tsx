import { AIConsultant } from "@/components/ai/ai-consultant";

export default function AIPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">IA consultiva</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">AUREON Advisor para perguntas financeiras difíceis</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          A IA não promete certeza absoluta; ela organiza evidências, cálculos, cenários e alertas para reduzir erro decisório.
        </p>
      </div>
      <AIConsultant />
    </div>
  );
}
