import { z } from "zod";

/**
 * Normalise une saisie décimale française : espaces de milliers retirés
 * (y compris insécables) et virgule décimale remplacée par un point.
 */
export const normalizeDecimal = (value: unknown) =>
  typeof value === "string"
    ? value.replace(/[\s\u00a0\u202f]/g, "").replace(",", ".")
    : value;

/**
 * Nombre saisi dans un champ texte : accepte « 12,5 » comme « 12.5 ».
 * `schema` porte les contraintes du champ (ex. `z.coerce.number().positive()`).
 */
export const decimalNumber = (schema = z.coerce.number()) =>
  z.preprocess(normalizeDecimal, schema);
