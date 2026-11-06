-- Les frais d'entrée SCPI étaient réglés par nom de compte (scope = nom) :
-- renommer un compte faisait perdre son taux. On passe à scope = 'ACCOUNT:<id>'
-- en conservant les taux effectivement appliqués jusqu'ici.

-- 1. Réglages existants dont le scope correspond exactement au nom d'un compte.
UPDATE "InvestmentSetting"
SET "scope" = 'ACCOUNT:' || (
  SELECT "Account"."id" FROM "Account"
  WHERE "Account"."name" = "InvestmentSetting"."scope"
  ORDER BY "Account"."id" LIMIT 1
)
WHERE "key" = 'ENTRY_FEE_RATE'
  AND "scope" IN (SELECT "name" FROM "Account");

-- 2. Comptes SCPI sans réglage qui bénéficiaient du taux par défaut déduit du
--    nom (« corum origin » : 11,966 %, « corum xl » : 12 %).
INSERT INTO "InvestmentSetting" ("key", "scope", "value")
SELECT 'ENTRY_FEE_RATE', 'ACCOUNT:' || a."id",
  CASE WHEN lower(a."name") LIKE '%corum origin%' THEN 0.11966 ELSE 0.12 END
FROM "Account" a
JOIN "InvestmentTypeRef" t ON t."id" = a."typeId"
WHERE t."code" = 'SCPI'
  AND (lower(a."name") LIKE '%corum origin%' OR lower(a."name") LIKE '%corum xl%')
  AND NOT EXISTS (
    SELECT 1 FROM "InvestmentSetting" s
    WHERE s."key" = 'ENTRY_FEE_RATE' AND s."scope" = 'ACCOUNT:' || a."id"
  );

-- 3. Réglages orphelins (nom ne correspondant à aucun compte).
DELETE FROM "InvestmentSetting"
WHERE "key" = 'ENTRY_FEE_RATE' AND "scope" NOT LIKE 'ACCOUNT:%';
