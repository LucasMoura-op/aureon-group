import type { Diagnostic, ProjectInput } from "./types";

const riskPenalty = {
  LOW: 0,
  MEDIUM: 8,
  HIGH: 18,
  CRITICAL: 32
};

export function diagnoseProject(input: ProjectInput): Diagnostic {
  const purchase = input.purchaseValue || 0;
  const construction = input.constructionCost || 0;
  const taxes = input.taxes ?? (purchase + construction) * 0.045;
  const totalCost = purchase + construction + taxes;
  const exitValue = Math.max(input.saleValue || 0, (input.monthlyRent || 0) * 120);
  const grossProfit = (input.saleValue || 0) - purchase - construction;
  const netProfit = (input.saleValue || exitValue) - totalCost;
  const netMargin = exitValue > 0 ? netProfit / exitValue : 0;
  const investedCapital = Math.max(input.ownCapital + input.financedCapital + input.consortiumCapital, totalCost);
  const roi = investedCapital > 0 ? netProfit / investedCapital : 0;
  const annualRent = input.monthlyRent * 12 * (1 - (input.vacancyRate ?? 0.08));
  const paybackMonths = annualRent > 0 ? Math.ceil((totalCost / annualRent) * 12) : null;
  const breakEvenPrice = totalCost * 1.04;
  const debtCapital = input.financedCapital + input.consortiumCapital;
  const monthlyDebtPressure = input.termMonths > 0 ? debtCapital / input.termMonths : 0;
  const minimumRent = monthlyDebtPressure * 1.25;
  const safetyMargin = exitValue > 0 ? (exitValue - breakEvenPrice) / exitValue : -1;
  const overrunShock = construction * 0.18;
  const marketShock = exitValue * 0.12;
  const worstCaseLoss = Math.min(0, netProfit - overrunShock - marketShock);
  const leverageRatio = totalCost > 0 ? debtCapital / totalCost : 0;
  const missingDataPenalty = [purchase, input.saleValue, input.termMonths].filter((v) => !v).length * 10;
  const score = clamp(
    58 +
      roi * 95 +
      netMargin * 40 +
      safetyMargin * 38 -
      leverageRatio * 22 -
      riskPenalty[input.perceivedRisk] -
      missingDataPenalty,
    0,
    100
  );

  const traps = [
    leverageRatio > 0.65 ? "Alavancagem alta: a dívida pode mandar no cronograma, não o projeto." : null,
    safetyMargin < 0.12 ? "Margem de segurança curta: pequena queda no preço ou estouro de obra elimina lucro." : null,
    input.monthlyRent > 0 && input.monthlyRent < minimumRent ? "Aluguel projetado não cobre a dívida com folga." : null,
    construction > 0 && input.builtAreaM2 && construction / input.builtAreaM2 < 1400
      ? "Custo de obra por m² parece baixo; valide padrão, mão de obra e acabamento."
      : null,
    input.termMonths > 24 ? "Prazo longo aumenta exposição a juros, inflação, vacância e mudança de mercado." : null
  ].filter(Boolean) as string[];

  const verdict = getVerdict(score, missingDataPenalty);
  const mainRisk =
    traps[0] ??
    (input.perceivedRisk === "CRITICAL"
      ? "Risco percebido crítico exige dados externos e validação documental."
      : "Risco principal está na aderência entre preço de saída, prazo e capital comprometido.");

  return {
    score: Math.round(score),
    verdict,
    grossProfit,
    netProfit,
    netMargin,
    roi,
    paybackMonths,
    breakEvenPrice,
    minimumRent,
    idealCapital: totalCost * 0.35,
    safetyMargin,
    worstCaseLoss,
    bestOpportunity:
      roi > 0.22
        ? "Reinvestir lucro e negociar insumos pode acelerar crescimento patrimonial."
        : "Melhorar preço de compra ou reduzir custo financeiro antes de executar.",
    mainRisk,
    traps,
    nextSteps: [
      "Validar preço de venda e aluguel com pelo menos três comparáveis reais.",
      "Simular cenário pessimista com atraso, INCC e queda de liquidez.",
      "Separar reserva de obra e caixa de segurança antes de assinar.",
      "Revisar contratos, multas, índice de correção e garantias."
    ],
    recommendation: buildRecommendation(verdict, roi, safetyMargin, leverageRatio)
  };
}

export function buildScenarios(input: ProjectInput) {
  return [
    {
      name: "Pessimista",
      diagnostic: diagnoseProject({
        ...input,
        constructionCost: input.constructionCost * 1.18,
        saleValue: input.saleValue * 0.9,
        monthlyRent: input.monthlyRent * 0.9,
        termMonths: input.termMonths + 4,
        vacancyRate: Math.max(input.vacancyRate ?? 0.08, 0.14)
      })
    },
    { name: "Realista", diagnostic: diagnoseProject(input) },
    {
      name: "Otimista",
      diagnostic: diagnoseProject({
        ...input,
        constructionCost: input.constructionCost * 0.97,
        saleValue: input.saleValue * 1.08,
        monthlyRent: input.monthlyRent * 1.05,
        expectedAppreciation: (input.expectedAppreciation ?? 0) + 0.04
      })
    }
  ];
}

function getVerdict(score: number, missingDataPenalty: number): Diagnostic["verdict"] {
  if (missingDataPenalty >= 20) return "precisa de mais dados";
  if (score >= 86) return "excelente";
  if (score >= 74) return "compensa";
  if (score >= 60) return "compensa com cautela";
  if (score >= 42) return "arriscado";
  return "não compensa";
}

function buildRecommendation(verdict: Diagnostic["verdict"], roi: number, safetyMargin: number, leverage: number) {
  if (verdict === "não compensa") {
    return "Não avançar sem renegociar preço, reduzir dívida ou encontrar uma saída de venda/aluguel melhor.";
  }
  if (verdict === "arriscado") {
    return "Avançar somente com reserva robusta, contrato bem protegido e gatilhos claros de parada.";
  }
  if (leverage > 0.65) {
    return "O negócio pode fazer sentido, mas a estrutura de dívida precisa ser redesenhada antes da execução.";
  }
  if (roi > 0.25 && safetyMargin > 0.18) {
    return "Projeto forte, desde que os comparáveis e custos sejam comprovados por documentos atuais.";
  }
  return "Projeto viável com cautela: priorize margem de segurança, liquidez e validação externa.";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
