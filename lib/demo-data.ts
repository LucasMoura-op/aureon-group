import { buildScenarios, diagnoseProject } from "@/lib/domain/diagnostics";
import { financialHealthScore, projectWealth } from "@/lib/domain/wealth";
import type { ProjectInput } from "@/lib/domain/types";

export const demoProjects: ProjectInput[] = [
  {
    name: "Studios Jardim Norte",
    type: "STUDIOS",
    city: "Londrina",
    state: "PR",
    neighborhood: "Jardim Norte",
    lotAreaM2: 420,
    builtAreaM2: 680,
    purchaseValue: 420000,
    constructionCost: 980000,
    saleValue: 1960000,
    monthlyRent: 15200,
    termMonths: 18,
    ownCapital: 540000,
    financedCapital: 500000,
    consortiumCapital: 0,
    perceivedRisk: "MEDIUM"
  },
  {
    name: "Casa de Leilão Centro",
    type: "AUCTION_PROPERTY",
    city: "Maringá",
    state: "PR",
    neighborhood: "Centro",
    lotAreaM2: 300,
    builtAreaM2: 210,
    purchaseValue: 610000,
    constructionCost: 160000,
    saleValue: 900000,
    monthlyRent: 5200,
    termMonths: 10,
    ownCapital: 360000,
    financedCapital: 380000,
    consortiumCapital: 0,
    perceivedRisk: "HIGH"
  },
  {
    name: "Containers BR-376",
    type: "CONTAINERS",
    city: "Apucarana",
    state: "PR",
    neighborhood: "Distrito Industrial",
    lotAreaM2: 900,
    builtAreaM2: 320,
    purchaseValue: 280000,
    constructionCost: 390000,
    saleValue: 790000,
    monthlyRent: 7600,
    termMonths: 12,
    ownCapital: 420000,
    financedCapital: 0,
    consortiumCapital: 180000,
    perceivedRisk: "MEDIUM"
  }
];

export function getExecutiveSnapshot() {
  const diagnostics = demoProjects.map((project) => ({ project, diagnostic: diagnoseProject(project) }));
  const assets = diagnostics.reduce((sum, item) => sum + Math.max(item.project.saleValue, item.project.monthlyRent * 120), 0);
  const debt = demoProjects.reduce((sum, item) => sum + item.financedCapital + item.consortiumCapital, 0);
  const ownCapital = demoProjects.reduce((sum, item) => sum + item.ownCapital, 0);
  const projectedProfit = diagnostics.reduce((sum, item) => sum + item.diagnostic.netProfit, 0);
  const monthlyRent = demoProjects.reduce((sum, item) => sum + item.monthlyRent, 0);
  const health = financialHealthScore({
    cash: 380000,
    assets,
    debt,
    monthlyFixedCosts: 42000,
    riskyCapital: ownCapital * 0.55
  });

  return {
    diagnostics,
    metrics: {
      estimatedWealth: assets,
      netWorth: assets - debt,
      availableCapital: 380000,
      committedCapital: ownCapital,
      cashFlow: monthlyRent - 42000,
      realizedProfit: 126000,
      projectedProfit,
      roi: projectedProfit / Math.max(1, ownCapital + debt),
      totalDebt: debt,
      futureInstallments: 92,
      activeProjects: demoProjects.length,
      riskyProjects: diagnostics.filter((item) => item.diagnostic.score < 60).length,
      opportunities: diagnostics.filter((item) => item.diagnostic.score >= 74).length,
      criticalAlerts: diagnostics.reduce((count, item) => count + item.diagnostic.traps.length, 0),
      health
    },
    wealthProjection: projectWealth({
      initialWealth: assets - debt,
      annualContribution: 220000,
      annualReturn: 0.14,
      inflation: 0.045,
      annualDebtService: 118000
    }),
    scenarios: buildScenarios(demoProjects[0])
  };
}
