/*
  Warnings:

  - The primary key for the `user_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currency` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `enable_fatherhood_module` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `share_percentage_only` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_settings` table. All the data in the column will be lost.
  - You are about to drop the column `weight_unit` on the `user_settings` table. All the data in the column will be lost.
  - The required column `id` was added to the `user_settings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId` to the `user_settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "enableFatherhoodModule" BOOLEAN NOT NULL DEFAULT false,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_user_settings" ("createdAt", "updatedAt") SELECT "createdAt", "updatedAt" FROM "user_settings";
DROP TABLE "user_settings";
ALTER TABLE "new_user_settings" RENAME TO "user_settings";
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");
PRAGMA foreign_key_check("user_settings");
PRAGMA foreign_keys=ON;
