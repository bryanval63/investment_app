import { calculateLifeInsuranceTax } from './tax.utils';

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
