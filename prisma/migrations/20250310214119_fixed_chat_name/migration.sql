/*
  Warnings:

  - You are about to drop the column `messages` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `message` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "messages",
ADD COLUMN     "message" JSONB NOT NULL;
