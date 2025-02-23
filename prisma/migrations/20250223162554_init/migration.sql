/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "videos_path_key" ON "videos"("path");

-- CreateIndex
CREATE INDEX "videos_path_idx" ON "videos"("path");
