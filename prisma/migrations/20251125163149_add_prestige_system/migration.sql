-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default-user',
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "prestige_rank" INTEGER NOT NULL DEFAULT 0,
    "prestige_date" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "clan_prestige" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_clans" ("created_at", "created_by", "description", "id", "name", "slug") SELECT "created_at", "created_by", "description", "id", "name", "slug" FROM "clans";
DROP TABLE "clans";
ALTER TABLE "new_clans" RENAME TO "clans";
CREATE UNIQUE INDEX "clans_name_key" ON "clans"("name");
CREATE UNIQUE INDEX "clans_slug_key" ON "clans"("slug");
PRAGMA foreign_key_check("clans");
PRAGMA foreign_keys=ON;
