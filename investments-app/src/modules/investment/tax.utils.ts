import { InvestmentType } from '@prisma/client';

const SOCIAL_CONTRIBUTIONS_RATE = 0.172;
const CRYPTO_FLAT_TAX_RATE = 0.3;
const SCPI_COST_RATE = 0.25;
const LIFE_INSURANCE_INCOME_TAX_RATE = 0.128;
const LIFE_INSURANCE_ALLOWANCE = 4600;

export const calculateInvestmentTax = ({
  type,
  capitalGain,
}: {
  type: InvestmentType;
  capitalGain: number;
}) => {
  const taxableGain = Math.max(0, capitalGain);

  if (type === InvestmentType.PEA) {
    return taxableGain * SOCIAL_CONTRIBUTIONS_RATE;
  }

  if (type === InvestmentType.LIFE_INSURANCE) {
    const incomeTaxableGain = Math.max(
      0,
      taxableGain - LIFE_INSURANCE_ALLOWANCE,
    );
    return (
      taxableGain * SOCIAL_CONTRIBUTIONS_RATE +
      incomeTaxableGain * LIFE_INSURANCE_INCOME_TAX_RATE
    );
  }

  if (type === InvestmentType.CRYPTO) {
    return taxableGain * CRYPTO_FLAT_TAX_RATE;
  }

  if (type === InvestmentType.SCPI) {
    return taxableGain * SCPI_COST_RATE;
  }

  // PEE gains are exempt here.
  if (type === InvestmentType.PEE) {
    return 0;
  }

  return 0;
};
