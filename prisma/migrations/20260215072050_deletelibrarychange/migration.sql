-- DropForeignKey
ALTER TABLE "UserGame" DROP CONSTRAINT "UserGame_gameId_fkey";

-- AddForeignKey
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
