CREATE TABLE "InvestmentSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'GLOBAL',
    "value" REAL NOT NULL
);

CREATE UNIQUE INDEX "InvestmentSetting_key_scope_key"
    ON "InvestmentSetting"("key", "scope");
