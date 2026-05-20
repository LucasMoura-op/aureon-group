export type FinancingInput = {
  principal: number;
  downPayment: number;
  termMonths: number;
  annualInterest: number;
  cet: number;
  system: "SAC" | "PRICE";
};

export function simulateFinancing(input: FinancingInput) {
  const financed = Math.max(0, input.principal - input.downPayment);
  const monthlyRate = Math.pow(1 + input.annualInterest, 1 / 12) - 1;
  const cetMonthly = Math.pow(1 + input.cet, 1 / 12) - 1;
  const schedule = input.system === "SAC"
    ? sacSchedule(financed, input.termMonths, cetMonthly || monthlyRate)
    : priceSchedule(financed, input.termMonths, cetMonthly || monthlyRate);
  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0) + input.downPayment;
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  return {
    financed,
    firstPayment: schedule[0]?.payment ?? 0,
    lastPayment: schedule.at(-1)?.payment ?? 0,
    totalInterest,
    totalCost: totalPaid,
    schedule,
    traps: [
      input.cet > input.annualInterest + 0.025 ? "CET muito acima dos juros anunciados: existe custo escondido relevante." : null,
      input.termMonths > 240 ? "Prazo muito longo reduz parcela, mas amplia juros totais e risco de descapitalização." : null,
      input.downPayment / input.principal < 0.2 ? "Entrada baixa aumenta alavancagem e sensibilidade a queda do mercado." : null
    ].filter(Boolean)
  };
}

function sacSchedule(principal: number, months: number, rate: number) {
  const amortization = months > 0 ? principal / months : 0;
  let balance = principal;
  return Array.from({ length: months }, (_, index) => {
    const interest = balance * rate;
    const payment = amortization + interest;
    balance = Math.max(0, balance - amortization);
    return { month: index + 1, payment, interest, amortization, balance };
  });
}

function priceSchedule(principal: number, months: number, rate: number) {
  const payment = rate === 0 ? principal / months : principal * (rate / (1 - Math.pow(1 + rate, -months)));
  let balance = principal;
  return Array.from({ length: months }, (_, index) => {
    const interest = balance * rate;
    const amortization = payment - interest;
    balance = Math.max(0, balance - amortization);
    return { month: index + 1, payment, interest, amortization, balance };
  });
}
