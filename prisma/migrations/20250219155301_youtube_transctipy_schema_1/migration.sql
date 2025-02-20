-- CreateTable
CREATE TABLE "VideoSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "summary" TEXT,
    "transcriptChunks" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoSummary_videoId_key" ON "VideoSummary"("videoId");

-- AddForeignKey
ALTER TABLE "VideoSummary" ADD CONSTRAINT "VideoSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
