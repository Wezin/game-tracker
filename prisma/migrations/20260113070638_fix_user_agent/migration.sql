/*
  Warnings:

  - You are about to drop the column `userAgen` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userAgen",
ADD COLUMN     "userAgent" TEXT;
