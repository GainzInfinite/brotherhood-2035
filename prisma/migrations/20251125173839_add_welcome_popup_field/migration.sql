-- CreateTable
CREATE TABLE "portfolio_holdings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "asset_name" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "price_usd" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default-user',
    "username" TEXT,
    "location" TEXT,
    "timezone" TEXT,
    "fatherhood_enabled" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
    "welcome_popup_shown" BOOLEAN NOT NULL DEFAULT false,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "prestige_rank" INTEGER NOT NULL DEFAULT 0,
    "prestige_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("created_at", "id", "level", "prestige_date", "prestige_rank", "updated_at", "xp") SELECT "created_at", "id", "level", "prestige_date", "prestige_rank", "updated_at", "xp" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
PRAGMA foreign_key_check("users");
PRAGMA foreign_keys=ON;
