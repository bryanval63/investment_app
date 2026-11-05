import { BadRequestException } from '@nestjs/common';

export const toReferenceCode = (label: string): string =>
  label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** Retourne le label sans espaces autour ; lève une BadRequest s'il est vide. */
export const normalizeReferenceLabel = (label: string): string => {
  const normalizedLabel = label.trim();
  if (!normalizedLabel) {
    throw new BadRequestException('The label cannot be empty');
  }
  return normalizedLabel;
};

/** Génère le code d'un référentiel ; lève une BadRequest s'il est vide. */
export const buildReferenceCode = (label: string): string => {
  const code = toReferenceCode(label);
  if (!code) {
    throw new BadRequestException(
      'The label must contain at least one letter or number',
    );
  }
  return code;
};
