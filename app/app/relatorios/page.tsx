import { FileDown, ShieldAlert, TrendingUp } from "lucide-react";
import { BrandSignature } from "@/components/brand/brand-signature";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  { title: "Relatorio de viabilidade", description: "ROI, payback, margem, break-even, cenario pessimista e recomendacao." },
  { title: "Relatorio de risco", description: "Pegadinhas, clausulas perigosas, divida, liquidez e plano preventivo." },
  { title: "Relatorio patrimonial", description: "Patrimonio liquido, crescimento, alocacao, divida e projecoes de 1 a 10 anos." },
  { title: "Relatorio de obra", description: "Orcamento, etapas, materiais, fornecedores, fotos, atrasos e estouro." }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <p className="text-sm font-medium text-primary">Relatorios</p>
        <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">Decisoes documentadas e auditaveis</h1>
      </div>
      <BrandSignature />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report, index) => (
          <Card key={report.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {index % 2 === 0 ? <TrendingUp className="h-5 w-5 text-primary" /> : <ShieldAlert className="h-5 w-5 text-warning" />}
                <CardTitle>{report.title}</CardTitle>
              </div>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">
                <FileDown className="h-4 w-4" />
                Gerar PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
