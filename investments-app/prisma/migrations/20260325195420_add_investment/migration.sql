-- CreateTable
CREATE TABLE "InvestmentTypeRef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Account_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InvestmentTypeRef" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0,
    "capitalGain" DECIMAL NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Investment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentTypeRef_code_key" ON "InvestmentTypeRef"("code");
