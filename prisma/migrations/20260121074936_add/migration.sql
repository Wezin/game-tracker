-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "FavouriteGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavouriteGame_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavouriteGame_userId_idx" ON "FavouriteGame"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteGame_userId_position_key" ON "FavouriteGame"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "FavouriteGame_userId_gameId_key" ON "FavouriteGame"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "FavouriteGame" ADD CONSTRAINT "FavouriteGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavouriteGame" ADD CONSTRAINT "FavouriteGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
