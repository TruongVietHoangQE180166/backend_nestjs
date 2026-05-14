-- CreateTable
CREATE TABLE "StoryDailyView" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "viewDate" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryDailyView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StoryDailyView_viewDate_idx" ON "StoryDailyView"("viewDate");

-- CreateIndex
CREATE UNIQUE INDEX "StoryDailyView_storyId_viewDate_key" ON "StoryDailyView"("storyId", "viewDate");

-- AddForeignKey
ALTER TABLE "StoryDailyView" ADD CONSTRAINT "StoryDailyView_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
