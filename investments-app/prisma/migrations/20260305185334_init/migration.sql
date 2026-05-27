-- CreateTable
CREATE TABLE "IncomeTypeRef" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Income" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "typeId" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Income_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "IncomeTypeRef" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomeTypeRef_code_key" ON "IncomeTypeRef"("code");
