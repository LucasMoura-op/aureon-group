import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    sources: [
      { name: "Banco Central", indicators: ["Selic", "CDI", "IPCA"], reliability: 95 },
      { name: "IBGE", indicators: ["renda média", "crescimento urbano"], reliability: 92 },
      { name: "FIPE/FipeZAP/DataZAP", indicators: ["preço m²", "aluguel médio"], reliability: 82 },
      { name: "Índices de construção", indicators: ["INCC", "materiais", "mão de obra"], reliability: 88 },
      { name: "Notícias econômicas", indicators: ["risco", "oportunidade", "ameaça"], reliability: 70 }
    ],
    note: "Endpoint preparado para conectores reais, cache, confiabilidade e trilha de auditoria."
  });
}
