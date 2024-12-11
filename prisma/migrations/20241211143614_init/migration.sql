/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "videos_slug_key" ON "videos"("slug");
