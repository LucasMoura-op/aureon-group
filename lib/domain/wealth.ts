export function projectWealth(params: {
  initialWealth: number;
  annualContribution: number;
  annualReturn: number;
  inflation: number;
  annualDebtService: number;
}) {
  return [1, 3, 5, 10].map((year) => {
    let wealth = params.initialWealth;
    for (let i = 0; i < year; i += 1) {
      wealth = wealth * (1 + params.annualReturn - params.inflation) + params.annualContribution - params.annualDebtService;
    }
    return { year, wealth: Math.max(0, wealth) };
  });
}

export function financialHealthScore(input: {
  cash: number;
  assets: number;
  debt: number;
  monthlyFixedCosts: number;
  riskyCapital: number;
}) {
  const liquidityMonths = input.monthlyFixedCosts > 0 ? input.cash / input.monthlyFixedCosts : 12;
  const debtRatio = input.assets > 0 ? input.debt / input.assets : 1;
  const riskRatio = input.assets > 0 ? input.riskyCapital / input.assets : 0;
  const score = Math.round(
    Math.max(0, Math.min(100, 45 + liquidityMonths * 5 - debtRatio * 35 - riskRatio * 25))
  );
  const status = score >= 85 ? "excelente" : score >= 70 ? "saudável" : score >= 55 ? "atenção" : score >= 40 ? "arriscado" : "crítico";
  return { score, status, liquidityMonths, debtRatio };
}
