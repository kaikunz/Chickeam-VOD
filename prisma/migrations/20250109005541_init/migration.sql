-- CreateIndex
CREATE INDEX "Purchase_user_id_video_id_idx" ON "Purchase"("user_id", "video_id");

-- CreateIndex
CREATE INDEX "videos_slug_idx" ON "videos"("slug");
