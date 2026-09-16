-- CreateTable
CREATE TABLE "InvestmentCategoryRef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentCategoryRef_code_key" ON "InvestmentCategoryRef"("code");

-- Seed the references that were previously defined in the dashboard constants.
INSERT INTO "InvestmentCategoryRef" ("code", "label") VALUES
    ('ALL', 'Tout'),
    ('STOCK', 'Actions'),
    ('SCPI', 'SCPI'),
    ('OTHER', 'Divers (or)'),
    ('CRYPTO', 'Cryptomonnaies');
