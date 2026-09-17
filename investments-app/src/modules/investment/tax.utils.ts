const SOCIAL_CONTRIBUTIONS_RATE = 0.186;
const CORUM_ORIGIN_ENTRY_FEE_RATE = 0.11966;
const CORUM_XL_ENTRY_FEE_RATE = 0.12;
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

  // PEE gains are exempt here.
  if (['PEE', 'SCPI'].includes(type)) {
    return 0;
  }

  return 0;
};

export const calculateInvestmentEntryFee = ({
  type,
  accountName,
  investedCapital,
}: {
  type: string;
  accountName: string;
  investedCapital: number;
}) => {
  if (type !== 'SCPI') {
    return 0;
  }

  const normalizedName = accountName.toLocaleLowerCase('fr-FR');
  const rate = normalizedName.includes('corum origin')
    ? CORUM_ORIGIN_ENTRY_FEE_RATE
    : normalizedName.includes('corum xl')
      ? CORUM_XL_ENTRY_FEE_RATE
      : 0;

  return Math.max(0, investedCapital) * rate;
};
