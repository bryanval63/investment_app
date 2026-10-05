import {
  calculateInvestmentTax,
  calculateLifeInsuranceTax,
} from './tax.utils';

describe('calculateInvestmentTax', () => {
  it('applies the configured social contributions rate to PEE gains', () => {
    const result = calculateInvestmentTax({
      type: 'PEE',
      value: 12000,
      capitalGain: 2000,
      settings: {
        socialContributionsRate: 0.172,
        incomeTaxRate: 0.128,
        lifeInsuranceAllowance: 4600,
        lifeInsuranceSocialContributionsRate: 0.172,
        lifeInsuranceReducedIncomeTaxRate: 0.075,
        lifeInsuranceContributionThreshold: 150000,
        lifeInsuranceAllowanceDurationYears: 8,
        lifeInsuranceCoupleAllowanceMultiplier: 2,
        peaAllowanceDurationYears: 5,
        cryptoCessionThreshold: 305,
      },
    });

    expect(result).toBe(344);
  });

  it('does not charge PEE social contributions on losses', () => {
    const result = calculateInvestmentTax({
      type: 'PEE',
      capitalGain: -2000,
    });

    expect(result).toBe(0);
  });
});

describe('calculateLifeInsuranceTax', () => {
  it('keeps the reduced rate when total contributions stay below the threshold', () => {
    const result = calculateLifeInsuranceTax({
      value: 100000,
      gain: 20000,
      durationInYears: 10,
      totalContributions: 100000,
      contributionThreshold: 150000,
      lifeInsuranceAllowance: 0,
      reducedIncomeTaxRate: 0.075,
      incomeTaxRate: 0.128,
      socialContributionsRate: 0,
    });

    expect(result.incomeTax).toBeCloseTo(1500, 5);
  });

  it('applies the normal rate only to the portion above the threshold across all contracts', () => {
    const result = calculateLifeInsuranceTax({
      value: 100000,
      gain: 20000,
      durationInYears: 10,
      totalContributions: 200000,
      contributionThreshold: 150000,
      lifeInsuranceAllowance: 0,
      reducedIncomeTaxRate: 0.075,
      incomeTaxRate: 0.128,
      socialContributionsRate: 0,
    });

    expect(result.incomeTax).toBeGreaterThan(1500);
    expect(result.incomeTax).toBeLessThan(2560);
  });
});
