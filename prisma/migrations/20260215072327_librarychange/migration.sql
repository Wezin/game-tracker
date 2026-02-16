-- DropForeignKey
ALTER TABLE "ListItem" DROP CONSTRAINT "ListItem_gameId_fkey";

-- AddForeignKey
ALTER TABLE "ListItem" ADD CONSTRAINT "ListItem_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
