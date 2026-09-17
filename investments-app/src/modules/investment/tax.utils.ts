export const DEFAULT_SOCIAL_CONTRIBUTIONS_RATE = 0.186;
export const DEFAULT_INCOME_TAX_RATE = 0.128;
export const DEFAULT_LIFE_INSURANCE_ALLOWANCE = 4600;
export const DEFAULT_LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE = 0.172;
export const DEFAULT_LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE = 0.075;
export const DEFAULT_LIFE_INSURANCE_THRESHOLD = 150000;
export const DEFAULT_LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS = 8;
export const DEFAULT_LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER = 2;
export const DEFAULT_PEA_ALLOWANCE_DURATION_YEARS = 5;
export const DEFAULT_CRYPTO_CESSION_THRESHOLD = 305;
const DEFAULT_CORUM_ORIGIN_ENTRY_FEE_RATE = 0.11966;
const DEFAULT_CORUM_XL_ENTRY_FEE_RATE = 0.12;

const round2 = (value: number) => Math.round(value * 100) / 100;

export interface InvestmentTaxSettings {
  socialContributionsRate: number;
  incomeTaxRate: number;
  lifeInsuranceAllowance: number;
  lifeInsuranceSocialContributionsRate: number;
  lifeInsuranceReducedIncomeTaxRate: number;
  lifeInsuranceContributionThreshold: number;
  lifeInsuranceAllowanceDurationYears: number;
  lifeInsuranceCoupleAllowanceMultiplier: number;
  peaAllowanceDurationYears: number;
  cryptoCessionThreshold: number;
}

export const calculatePeaTax = ({
  value,
  gain,
  durationInYears,
  allowanceDurationYears = DEFAULT_PEA_ALLOWANCE_DURATION_YEARS,
  socialContributionsRate = DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
  incomeTaxRate = DEFAULT_INCOME_TAX_RATE,
}: {
  value: number;
  gain: number;
  durationInYears: number;
  allowanceDurationYears?: number;
  socialContributionsRate?: number;
  incomeTaxRate?: number;
}) => {
  const taxableGain = Math.max(0, gain);
  const incomeTax =
    durationInYears < allowanceDurationYears ? taxableGain * incomeTaxRate : 0;
  const socialContributions = taxableGain * socialContributionsRate;
  const totalTax = socialContributions + incomeTax;

  return {
    gain: round2(gain),
    closingRequired: durationInYears < allowanceDurationYears,
    socialContributions: round2(socialContributions),
    incomeTax: round2(incomeTax),
    totalTax: round2(totalTax),
    net: round2(value - totalTax),
  };
};

export const calculateCryptoTax = ({
  value,
  gain,
  totalCessions,
  cessionThreshold = DEFAULT_CRYPTO_CESSION_THRESHOLD,
  socialContributionsRate = DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
  incomeTaxRate = DEFAULT_INCOME_TAX_RATE,
}: {
  value: number;
  gain: number;
  totalCessions: number;
  cessionThreshold?: number;
  socialContributionsRate?: number;
  incomeTaxRate?: number;
}) => {
  const exempt = totalCessions < cessionThreshold;
  const taxableGain = exempt ? 0 : Math.max(gain, 0);
  const socialContributions = taxableGain * socialContributionsRate;
  const incomeTax = taxableGain * incomeTaxRate;
  const totalTax = socialContributions + incomeTax;

  return {
    gain: round2(gain),
    exempt,
    socialContributions: round2(socialContributions),
    incomeTax: round2(incomeTax),
    totalTax: round2(totalTax),
    net: round2(value - totalTax),
  };
};

export const calculateLifeInsuranceTax = ({
  value,
  gain,
  durationInYears,
  allowanceDurationYears = DEFAULT_LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
  familySituation = 'celibataire',
  lifeInsuranceAllowance = DEFAULT_LIFE_INSURANCE_ALLOWANCE,
  totalContributions = 0,
  socialContributionsRate = DEFAULT_LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
  reducedIncomeTaxRate = DEFAULT_LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
  contributionThreshold = DEFAULT_LIFE_INSURANCE_THRESHOLD,
  coupleAllowanceMultiplier = DEFAULT_LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
  incomeTaxRate = DEFAULT_INCOME_TAX_RATE,
}: {
  value: number;
  gain: number;
  durationInYears: number;
  allowanceDurationYears?: number;
  familySituation?: 'celibataire' | 'couple';
  lifeInsuranceAllowance?: number;
  totalContributions?: number;
  socialContributionsRate?: number;
  incomeTaxRate?: number;
  reducedIncomeTaxRate?: number;
  contributionThreshold?: number;
  coupleAllowanceMultiplier?: number;
}) => {
  if (gain < 0 || gain > value) {
    throw new Error(
      'Le gain doit être compris entre 0 et la valeur totale du contrat.',
    );
  }

  const eligibleForAllowance = durationInYears >= allowanceDurationYears;
  const socialContributions = gain * socialContributionsRate;
  let incomeTaxableGain = gain;
  let appliedAllowance = 0;
  let incomeTax = gain * incomeTaxRate;

  if (eligibleForAllowance) {
    appliedAllowance =
      familySituation === 'couple'
        ? lifeInsuranceAllowance * coupleAllowanceMultiplier
        : lifeInsuranceAllowance;
    incomeTaxableGain = Math.max(gain - appliedAllowance, 0);
    const amountAboveThreshold =
      totalContributions > contributionThreshold
        ? Math.min(
            1,
            (totalContributions - contributionThreshold) / totalContributions,
          )
        : 0;
    const gainAtNormalRate = incomeTaxableGain * amountAboveThreshold;
    const gainAtReducedRate = incomeTaxableGain - gainAtNormalRate;
    incomeTax =
      gainAtReducedRate * reducedIncomeTaxRate +
      gainAtNormalRate * incomeTaxRate;
  }

  const totalTax = socialContributions + incomeTax;

  return {
    capital: round2(value - gain),
    gain: round2(gain),
    eligibleForAllowance,
    appliedAllowance: round2(appliedAllowance),
    incomeTaxableGain: round2(incomeTaxableGain),
    socialContributions: round2(socialContributions),
    incomeTax: round2(incomeTax),
    totalTax: round2(totalTax),
    net: round2(value - totalTax),
  };
};

export const calculateInvestmentTax = ({
  type,
  capitalGain,
  value,
  durationInYears,
  totalContributions,
  totalCessions,
  settings = {
    socialContributionsRate: DEFAULT_SOCIAL_CONTRIBUTIONS_RATE,
    incomeTaxRate: DEFAULT_INCOME_TAX_RATE,
    lifeInsuranceAllowance: DEFAULT_LIFE_INSURANCE_ALLOWANCE,
    lifeInsuranceSocialContributionsRate:
      DEFAULT_LIFE_INSURANCE_SOCIAL_CONTRIBUTIONS_RATE,
    lifeInsuranceReducedIncomeTaxRate:
      DEFAULT_LIFE_INSURANCE_REDUCED_INCOME_TAX_RATE,
    lifeInsuranceContributionThreshold: DEFAULT_LIFE_INSURANCE_THRESHOLD,
    lifeInsuranceAllowanceDurationYears:
      DEFAULT_LIFE_INSURANCE_ALLOWANCE_DURATION_YEARS,
    lifeInsuranceCoupleAllowanceMultiplier:
      DEFAULT_LIFE_INSURANCE_COUPLE_ALLOWANCE_MULTIPLIER,
    peaAllowanceDurationYears: DEFAULT_PEA_ALLOWANCE_DURATION_YEARS,
    cryptoCessionThreshold: DEFAULT_CRYPTO_CESSION_THRESHOLD,
  },
}: {
  type: string;
  capitalGain: number;
  value?: number;
  durationInYears?: number;
  totalContributions?: number;
  totalCessions?: number;
  settings?: InvestmentTaxSettings;
}) => {
  const taxableGain = Math.max(0, capitalGain);

  if (type === 'PEA') {
    return calculatePeaTax({
      value: Math.max(value ?? taxableGain, taxableGain, 0),
      gain: taxableGain,
      durationInYears: durationInYears ?? 0,
      allowanceDurationYears: settings.peaAllowanceDurationYears,
      socialContributionsRate: settings.socialContributionsRate,
      incomeTaxRate: settings.incomeTaxRate,
    }).totalTax;
  }

  if (type === 'LIFE_INSURANCE') {
    const taxableValue = Math.max(value ?? taxableGain, taxableGain, 0);
    return calculateLifeInsuranceTax({
      value: taxableValue,
      gain: taxableGain,
      durationInYears: durationInYears ?? 0,
      totalContributions: totalContributions ?? 0,
      lifeInsuranceAllowance: settings.lifeInsuranceAllowance,
      allowanceDurationYears: settings.lifeInsuranceAllowanceDurationYears,
      socialContributionsRate: settings.lifeInsuranceSocialContributionsRate,
      reducedIncomeTaxRate: settings.lifeInsuranceReducedIncomeTaxRate,
      contributionThreshold: settings.lifeInsuranceContributionThreshold,
      coupleAllowanceMultiplier:
        settings.lifeInsuranceCoupleAllowanceMultiplier,
      incomeTaxRate: settings.incomeTaxRate,
    }).totalTax;
  }

  if (type === 'CRYPTO') {
    return calculateCryptoTax({
      value: Math.max(value ?? taxableGain, taxableGain, 0),
      gain: taxableGain,
      totalCessions: totalCessions ?? value ?? 0,
      cessionThreshold: settings.cryptoCessionThreshold,
      socialContributionsRate: settings.socialContributionsRate,
      incomeTaxRate: settings.incomeTaxRate,
    }).totalTax;
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
