import { ProjectLab } from "@/components/projects/project-lab";

export default function ProjectsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Projetos</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Cadastro, cenários e diagnóstico preventivo</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Analise lote, construção, aluguel, leilão, consórcio, financiamento e outras teses antes de comprometer capital.
        </p>
      </div>
      <ProjectLab />
    </div>
  );
}
