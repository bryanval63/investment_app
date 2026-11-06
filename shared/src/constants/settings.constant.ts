/** Clé du taux de frais d'entrée (SCPI), réglé compte par compte. */
export const ENTRY_FEE_RATE_SETTING_KEY = "ENTRY_FEE_RATE";

/**
 * Portée d'un réglage propre à un compte : liée à son id, pour qu'un
 * renommage du compte ne fasse pas perdre le réglage.
 */
export const accountSettingScope = (accountId: number) =>
  `ACCOUNT:${accountId}`;
