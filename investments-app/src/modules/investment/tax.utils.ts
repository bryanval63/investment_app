export const DEFAULT_SOCIAL_CONTRIBUTIONS_RATE = 0.186;
export const DEFAULT_INCOME_TAX_RATE = 0.128;
export const DEFAULT_LIFE_INSURANCE_ALLOWANCE = 4600;
const DEFAULT_CORUM_ORIGIN_ENTRY_FEE_RATE = 0.11966;
const DEFAULT_CORUM_XL_ENTRY_FEE_RATE = 0.12;

export interface InvestmentTaxSettings {
  socialContributionsRate: number;
  incomeTaxRate: number;
  lifeInsuranceAllowance: number;
}

export const calculateInvestmentTax = ({
  type,
  capitalGain,
  settings = {
    socialContributionsRate: DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
    incomeTaxRate: DEFAULT_INCOME_TAX_RATE,
    lifeInsuranceAllowance: DEFAULT_LIFE_INSURANCE_ALLOWANCE,
  },
}: {
  type: string;
  capitalGain: number;
  settings?: InvestmentTaxSettings;
}) => {
  const taxableGain = Math.max(0, capitalGain);

  if (type === 'PEA') {
    return taxableGain * settings.socialContributionsRate;
  }

  if (type === 'LIFE_INSURANCE') {
    const incomeTaxableGain = Math.max(
      0,
      taxableGain - settings.lifeInsuranceAllowance,
    );
    return (
      taxableGain * settings.socialContributionsRate +
      incomeTaxableGain * settings.incomeTaxRate
    );
  }

  if (type === 'CRYPTO') {
    return (
      taxableGain * (settings.socialContributionsRate + settings.incomeTaxRate)
    );
  }

  if (['PEE', 'SCPI'].includes(type)) {
    return 0;
  }

  return 0;
};

export const calculateInvestmentEntryFee = ({
  type,
  accountName,
  amount,
  entryFeeRate,
}: {
  type: string;
  accountName: string;
  amount: number;
  entryFeeRate?: number;
}) => {
  if (type !== 'SCPI') {
    return 0;
  }

  const normalizedName = accountName.toLocaleLowerCase('fr-FR');
  const defaultRate = normalizedName.includes('corum origin')
    ? DEFAULT_CORUM_ORIGIN_ENTRY_FEE_RATE
    : normalizedName.includes('corum xl')
      ? DEFAULT_CORUM_XL_ENTRY_FEE_RATE
      : 0;
  const rate = entryFeeRate ?? defaultRate;

  return Math.max(0, amount) * rate;
};
