/*
  Warnings:

  - A unique constraint covering the columns `[igdbId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `igdbId` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "igdbId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game_igdbId_key" ON "Game"("igdbId");

-- CreateIndex
CREATE INDEX "UserGame_userId_status_idx" ON "UserGame"("userId", "status");
