import { NextResponse } from "next/server";
import { getExecutiveSnapshot } from "@/lib/demo-data";
import { currency, percent } from "@/lib/utils";

export async function POST(request: Request) {
  const { question } = await request.json();
  const snapshot = getExecutiveSnapshot();
  const best = [...snapshot.diagnostics].sort((a, b) => b.diagnostic.score - a.diagnostic.score)[0];
  const worst = [...snapshot.diagnostics].sort((a, b) => a.diagnostic.score - b.diagnostic.score)[0];
  const pessimistic = snapshot.scenarios[0].diagnostic;

  const answer = [
    `Pergunta: ${question}`,
    "",
    `Minha leitura: o melhor projeto hoje é ${best.project.name}, com nota ${best.diagnostic.score}/100, ROI de ${percent(best.diagnostic.roi)} e veredito "${best.diagnostic.verdict}". Ele não é certeza; ele apenas tem a melhor relação atual entre retorno, margem e risco.`,
    "",
    `O ponto que pode machucar mais é ${worst.project.name}. Principal risco: ${worst.diagnostic.mainRisk}`,
    "",
    `Cenário perigoso: se custo subir, venda cair e prazo atrasar, o projeto líder cai para nota ${pessimistic.score}/100, ROI de ${percent(pessimistic.roi)} e perda potencial de ${currency(Math.abs(pessimistic.worstCaseLoss))}. Esse é o tipo de situação que exige reserva antes de assinar.`,
    "",
    "Pegadinhas para checar antes de decidir:",
    "- CET real versus juros anunciados.",
    "- Contrato com correção, multa, distrato e garantias.",
    "- Orçamento de obra por m² abaixo da realidade.",
    "- Aluguel insuficiente para cobrir dívida com folga.",
    "- Liquidez da região em cenário ruim.",
    "",
    "Próxima decisão segura: valide comparáveis externos, fixe gatilhos de parada e só avance se a margem de segurança continuar positiva no cenário pessimista."
  ].join("\n");

  return NextResponse.json({ answer, confidence: 0.72 });
}
