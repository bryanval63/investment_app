const SOCIAL_CONTRIBUTIONS_RATE = 0.186;
const SCPI_COST_RATE = 0.25;
const INCOME_TAX_RATE = 0.128;
const LIFE_INSURANCE_ALLOWANCE = 4600;
const CRYPTO_FLAT_TAX_RATE = SOCIAL_CONTRIBUTIONS_RATE + INCOME_TAX_RATE;

export const calculateInvestmentTax = ({
  type,
  capitalGain,
}: {
  type: string;
  capitalGain: number;
}) => {
  const taxableGain = Math.max(0, capitalGain);

  if (type === 'PEA') {
    return taxableGain * SOCIAL_CONTRIBUTIONS_RATE;
  }

  if (type === 'LIFE_INSURANCE') {
    const incomeTaxableGain = Math.max(
      0,
      taxableGain - LIFE_INSURANCE_ALLOWANCE,
    );
    return (
      taxableGain * SOCIAL_CONTRIBUTIONS_RATE +
      incomeTaxableGain * INCOME_TAX_RATE
    );
  }

  if (type === 'CRYPTO') {
    return taxableGain * CRYPTO_FLAT_TAX_RATE;
  }

  if (type === 'SCPI') {
    return taxableGain * SCPI_COST_RATE;
  }

  // PEE gains are exempt here.
  if (type === 'PEE') {
    return 0;
  }

  return 0;
};
