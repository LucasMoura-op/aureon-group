export type ConsortiumInput = {
  letterValue: number;
  termMonths: number;
  adminFee: number;
  reserveFund: number;
  insurance: number;
  embeddedBid: number;
  ownBid: number;
  expectedAwardMonth?: number;
};

export function simulateConsortium(input: ConsortiumInput) {
  const fees = input.letterValue * (input.adminFee + input.reserveFund + input.insurance);
  const availableCredit = input.letterValue - input.embeddedBid;
  const totalCost = input.letterValue + fees + input.ownBid;
  const monthlyPayment = totalCost / Math.max(1, input.termMonths);
  const awardDelay = input.expectedAwardMonth ?? Math.ceil(input.termMonths * 0.45);
  const delayRisk = awardDelay > input.termMonths * 0.45 ? "HIGH" : awardDelay > 12 ? "MEDIUM" : "LOW";

  return {
    availableCredit,
    totalCost,
    monthlyPayment,
    delayRisk,
    opportunityCostMonths: awardDelay,
    traps: [
      input.embeddedBid > input.letterValue * 0.3 ? "Lance embutido alto reduz a carta útil para comprar ou construir." : null,
      awardDelay > 18 ? "Contemplação tardia pode fazer você perder preço, terreno ou janela de mercado." : null,
      fees / input.letterValue > 0.22 ? "Taxas totais acima de 22% pedem comparação dura com financiamento e capital próprio." : null
    ].filter(Boolean)
  };
}
