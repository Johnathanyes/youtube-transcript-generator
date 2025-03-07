/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `ChatMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_videoId_key" ON "ChatMessage"("videoId");
