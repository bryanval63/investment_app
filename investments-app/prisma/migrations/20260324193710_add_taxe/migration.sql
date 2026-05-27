/*
  Warnings:

  - You are about to drop the `Taxe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Taxe";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Tax" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL DEFAULT 0,
    "year" INTEGER NOT NULL
);
