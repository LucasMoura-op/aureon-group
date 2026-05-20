export type ProjectInput = {
  name: string;
  type: string;
  city: string;
  state: string;
  neighborhood: string;
  lotAreaM2?: number;
  builtAreaM2?: number;
  purchaseValue: number;
  constructionCost: number;
  saleValue: number;
  monthlyRent: number;
  termMonths: number;
  ownCapital: number;
  financedCapital: number;
  consortiumCapital: number;
  perceivedRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  taxes?: number;
  vacancyRate?: number;
  expectedAppreciation?: number;
};

export type Diagnostic = {
  score: number;
  verdict:
    | "excelente"
    | "compensa"
    | "compensa com cautela"
    | "arriscado"
    | "não compensa"
    | "precisa de mais dados";
  grossProfit: number;
  netProfit: number;
  netMargin: number;
  roi: number;
  paybackMonths: number | null;
  breakEvenPrice: number;
  minimumRent: number;
  idealCapital: number;
  safetyMargin: number;
  worstCaseLoss: number;
  bestOpportunity: string;
  mainRisk: string;
  traps: string[];
  nextSteps: string[];
  recommendation: string;
};
