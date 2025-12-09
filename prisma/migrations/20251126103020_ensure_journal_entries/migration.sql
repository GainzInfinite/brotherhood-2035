-- CreateTable
CREATE TABLE "journal_entries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "mood" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "image_url" TEXT,
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
    "stretching" BOOLEAN NOT NULL DEFAULT false,
    "water_intake" REAL,
    "meditation_minutes" INTEGER,
    "study_minutes" INTEGER,
    "reading_minutes" INTEGER,
    "spend_today" REAL,
    "income_today" REAL,
    "savings_today" REAL,
    "fatherhood_patience" INTEGER,
    "fatherhood_time" INTEGER,
    "consistency_score" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_daily_logs" ("bike_minutes", "consistency_score", "createdAt", "date", "fatherhood_patience", "fatherhood_time", "id", "income_today", "meditation_minutes", "pushups", "reading_minutes", "spend_today", "steps", "study_minutes", "updatedAt", "user_id", "water_intake", "weight", "weight_training") SELECT "bike_minutes", "consistency_score", "createdAt", "date", "fatherhood_patience", "fatherhood_time", "id", "income_today", "meditation_minutes", "pushups", "reading_minutes", "spend_today", "steps", "study_minutes", "updatedAt", "user_id", "water_intake", "weight", "weight_training" FROM "daily_logs";
DROP TABLE "daily_logs";
ALTER TABLE "new_daily_logs" RENAME TO "daily_logs";
CREATE UNIQUE INDEX "daily_logs_user_id_date_key" ON "daily_logs"("user_id", "date");
CREATE TABLE "new_portfolio_holdings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "asset_name" TEXT NOT NULL,
    "ticker" TEXT,
    "quantity" REAL NOT NULL,
    "price_usd" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "yield_rate" REAL,
    "is_api_linked" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_portfolio_holdings" ("asset_name", "category", "createdAt", "id", "notes", "price_usd", "quantity", "ticker", "updatedAt", "user_id") SELECT "asset_name", "category", "createdAt", "id", "notes", "price_usd", "quantity", "ticker", "updatedAt", "user_id" FROM "portfolio_holdings";
DROP TABLE "portfolio_holdings";
ALTER TABLE "new_portfolio_holdings" RENAME TO "portfolio_holdings";
CREATE TABLE "new_user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "enableFatherhoodModule" BOOLEAN NOT NULL DEFAULT false,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "weightUnit" TEXT NOT NULL DEFAULT 'lbs',
    "volumeUnit" TEXT NOT NULL DEFAULT 'liters',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user_settings" ("createdAt", "enableFatherhoodModule", "id", "onboardingComplete", "updatedAt", "userId") SELECT "createdAt", "enableFatherhoodModule", "id", "onboardingComplete", "updatedAt", "userId" FROM "user_settings";
DROP TABLE "user_settings";
ALTER TABLE "new_user_settings" RENAME TO "user_settings";
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");
PRAGMA foreign_key_check("daily_logs");
PRAGMA foreign_key_check("portfolio_holdings");
PRAGMA foreign_key_check("user_settings");
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "journal_entries_user_id_date_key" ON "journal_entries"("user_id", "date");
