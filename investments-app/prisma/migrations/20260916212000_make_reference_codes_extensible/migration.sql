PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_InvestmentTypeRef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL
);
INSERT INTO "new_InvestmentTypeRef" ("id", "code", "label")
SELECT "id", "code", "label" FROM "InvestmentTypeRef";
DROP TABLE "InvestmentTypeRef";
ALTER TABLE "new_InvestmentTypeRef" RENAME TO "InvestmentTypeRef";
CREATE UNIQUE INDEX "InvestmentTypeRef_code_key" ON "InvestmentTypeRef"("code");

CREATE TABLE "new_InvestmentCategoryRef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL
);
INSERT INTO "new_InvestmentCategoryRef" ("id", "code", "label")
SELECT "id", "code", "label" FROM "InvestmentCategoryRef";
DROP TABLE "InvestmentCategoryRef";
ALTER TABLE "new_InvestmentCategoryRef" RENAME TO "InvestmentCategoryRef";
CREATE UNIQUE INDEX "InvestmentCategoryRef_code_key" ON "InvestmentCategoryRef"("code");

CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'STOCK',
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Account_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InvestmentTypeRef" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("id", "typeId", "name", "category", "isClosed")
SELECT "id", "typeId", "name", "category", "isClosed" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
