export interface TaxResponseDto {
  id: number;
  year: number;
  /** Négatif : impôt payé ; positif : remboursement. */
  amount: number;
}
