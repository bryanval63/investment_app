-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Investment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" INTEGER NOT NULL,
    "totalAmount" DECIMAL NOT NULL DEFAULT 0,
    "capitalGain" DECIMAL NOT NULL DEFAULT 0,
    "addedAmount" DECIMAL NOT NULL DEFAULT 0,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Investment_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Investment" ("accountId", "capitalGain", "date", "id", "totalAmount") SELECT "accountId", "capitalGain", "date", "id", "totalAmount" FROM "Investment";
DROP TABLE "Investment";
ALTER TABLE "new_Investment" RENAME TO "Investment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
