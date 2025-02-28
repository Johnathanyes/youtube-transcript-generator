/*
  Warnings:

  - Added the required column `videoChannel` to the `VideoSummary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoThumbnail` to the `VideoSummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoSummary" ADD COLUMN     "videoChannel" TEXT NOT NULL,
ADD COLUMN     "videoThumbnail" TEXT NOT NULL;
