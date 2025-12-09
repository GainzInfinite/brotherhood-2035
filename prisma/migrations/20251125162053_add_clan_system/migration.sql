-- CreateTable
CREATE TABLE "clans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "clan_members" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clan_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "clan_members_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "clan_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clan_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "clan_posts_clan_id_fkey" FOREIGN KEY ("clan_id") REFERENCES "clans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "clans_name_key" ON "clans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clans_slug_key" ON "clans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "clan_members_user_id_key" ON "clan_members"("user_id");
