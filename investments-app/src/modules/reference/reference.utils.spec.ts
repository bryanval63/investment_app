import { BadRequestException } from '@nestjs/common';
import {
  buildReferenceCode,
  normalizeReferenceLabel,
  toReferenceCode,
} from './reference.utils';

describe('normalizeReferenceLabel', () => {
  it('trims the label', () => {
    expect(normalizeReferenceLabel('  PEA  ')).toBe('PEA');
  });

  it('throws on an empty label', () => {
    expect(() => normalizeReferenceLabel('   ')).toThrow(
      new BadRequestException('The label cannot be empty'),
    );
  });
});

describe('buildReferenceCode', () => {
  it('builds the code from the label', () => {
    expect(buildReferenceCode('Épargne salariée')).toBe('EPARGNE_SALARIEE');
  });

  it('throws when no letter or digit remains', () => {
    expect(() => buildReferenceCode('?!')).toThrow(
      new BadRequestException(
        'The label must contain at least one letter or number',
      ),
    );
  });
});

describe('toReferenceCode', () => {
  it('uppercases a simple label', () => {
    expect(toReferenceCode('crypto')).toBe('CRYPTO');
  });

  it('removes accents', () => {
    expect(toReferenceCode('Épargne salariée')).toBe('EPARGNE_SALARIEE');
  });

  it('replaces groups of non alphanumeric characters with one underscore', () => {
    expect(toReferenceCode('Assurance - vie / Luxembourg')).toBe(
      'ASSURANCE_VIE_LUXEMBOURG',
    );
  });

  it('trims leading and trailing underscores', () => {
    expect(toReferenceCode('  (PEA PME)  ')).toBe('PEA_PME');
  });

  it('keeps digits', () => {
    expect(toReferenceCode('Livret 2')).toBe('LIVRET_2');
  });

  it('returns an empty string when no letter or digit remains', () => {
    expect(toReferenceCode('--- !!')).toBe('');
  });
});
