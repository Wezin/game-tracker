-- CreateTable
CREATE TABLE "PinnedList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PinnedList_userId_idx" ON "PinnedList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PinnedList_userId_position_key" ON "PinnedList"("userId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "PinnedList_userId_listId_key" ON "PinnedList"("userId", "listId");

-- AddForeignKey
ALTER TABLE "PinnedList" ADD CONSTRAINT "PinnedList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedList" ADD CONSTRAINT "PinnedList_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
