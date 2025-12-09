/*
  Warnings:

  - You are about to drop the column `created_at` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `savings_today` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `daily_logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `income_logs` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `income_logs` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `income_logs` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `income_logs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `income_logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `portfolio_holdings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `portfolio_holdings` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `daily_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `income_type` to the `income_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `received_date` to the `income_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `income_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `portfolio_holdings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "user_settings" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "weight_unit" TEXT NOT NULL DEFAULT 'lbs',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "share_percentage_only" BOOLEAN NOT NULL DEFAULT true,
    "enable_fatherhood_module" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_daily_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weight" REAL,
    "pushups" INTEGER,
    "steps" INTEGER,
    "bike_minutes" INTEGER,
    "weight_training" BOOLEAN NOT NULL DEFAULT false,
    "water_intake" REAL,
    "meditation_minutes" INTEGER,
    "study_minutes" INTEGER,
    "reading_minutes" INTEGER,
    "spend_today" REAL,
    "income_today" REAL,
    "fatherhood_patience" INTEGER,
    "fatherhood_time" INTEGER,
    "consistency_score" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_daily_logs" ("bike_minutes", "consistency_score", "date", "fatherhood_patience", "fatherhood_time", "id", "income_today", "meditation_minutes", "pushups", "reading_minutes", "spend_today", "steps", "study_minutes", "user_id", "water_intake", "weight", "weight_training") SELECT "bike_minutes", "consistency_score", "date", "fatherhood_patience", "fatherhood_time", "id", "income_today", "meditation_minutes", "pushups", "reading_minutes", "spend_today", "steps", "study_minutes", "user_id", "water_intake", "weight", "weight_training" FROM "daily_logs";
DROP TABLE "daily_logs";
ALTER TABLE "new_daily_logs" RENAME TO "daily_logs";
CREATE UNIQUE INDEX "daily_logs_user_id_date_key" ON "daily_logs"("user_id", "date");
CREATE TABLE "new_income_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "income_type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "notes" TEXT,
    "received_date" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_income_logs" ("amount", "id", "source", "user_id") SELECT "amount", "id", "source", "user_id" FROM "income_logs";
DROP TABLE "income_logs";
ALTER TABLE "new_income_logs" RENAME TO "income_logs";
CREATE TABLE "new_portfolio_holdings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "asset_name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price_usd" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_portfolio_holdings" ("asset_name", "category", "id", "notes", "price_usd", "quantity", "ticker", "user_id") SELECT "asset_name", "category", "id", "notes", "price_usd", "quantity", "ticker", "user_id" FROM "portfolio_holdings";
DROP TABLE "portfolio_holdings";
ALTER TABLE "new_portfolio_holdings" RENAME TO "portfolio_holdings";
PRAGMA foreign_key_check("daily_logs");
PRAGMA foreign_key_check("income_logs");
PRAGMA foreign_key_check("portfolio_holdings");
PRAGMA foreign_keys=ON;
